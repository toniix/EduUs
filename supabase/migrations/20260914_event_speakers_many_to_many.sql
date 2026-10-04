-- supabase/migrations/20260914_event_speakers_many_to_many.sql

-- 1. Crear tabla intermedia para relación Many-to-Many entre eventos y ponentes
CREATE TABLE IF NOT EXISTS event_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  speaker_id UUID NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, speaker_id)
);

-- 2. Índices para acelerar joins y filtros
CREATE INDEX IF NOT EXISTS idx_event_speakers_event ON event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker ON event_speakers(speaker_id);

-- 3. Habilitar Row Level Security (RLS) en event_speakers
ALTER TABLE event_speakers ENABLE ROW LEVEL SECURITY;

-- Lectura pública: cualquiera puede ver los ponentes asignados a eventos
DROP POLICY IF EXISTS "Public can view event speakers" ON event_speakers;
CREATE POLICY "Public can view event speakers"
  ON event_speakers FOR SELECT
  TO public
  USING (true);

-- Gestión de event_speakers: administradores y editores pueden vincular ponentes a eventos
DROP POLICY IF EXISTS "Admins can manage event speakers" ON event_speakers;
DROP POLICY IF EXISTS "Admins and editors can manage event speakers" ON event_speakers;
CREATE POLICY "Admins and editors can manage event speakers"
  ON event_speakers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- 4. Migración de datos históricos: migra todos los ponentes vinculados previamente en events.speaker_id
INSERT INTO event_speakers (event_id, speaker_id, display_order)
SELECT id, speaker_id, 0
FROM events
WHERE speaker_id IS NOT NULL
ON CONFLICT (event_id, speaker_id) DO NOTHING;

-- 5. Políticas RLS para la tabla 'speakers'
-- Regla: Los editores pueden crear ponentes, pero NO pueden eliminarlos (solo admins).
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

-- Lectura pública de ponentes
DROP POLICY IF EXISTS "Public can view speakers" ON speakers;
CREATE POLICY "Public can view speakers"
  ON speakers FOR SELECT
  TO public
  USING (true);

-- Administradores y Editores pueden crear (INSERT) nuevos ponentes
DROP POLICY IF EXISTS "Admins and editors can create speakers" ON speakers;
CREATE POLICY "Admins and editors can create speakers"
  ON speakers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Administradores y Editores pueden actualizar (UPDATE) datos de ponentes
DROP POLICY IF EXISTS "Admins and editors can update speakers" ON speakers;
CREATE POLICY "Admins and editors can update speakers"
  ON speakers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- ÚNICAMENTE Administradores pueden eliminar (DELETE) ponentes (Editores tienen denegada la eliminación)
DROP POLICY IF EXISTS "Only admins can delete speakers" ON speakers;
CREATE POLICY "Only admins can delete speakers"
  ON speakers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
