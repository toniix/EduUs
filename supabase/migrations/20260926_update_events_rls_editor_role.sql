-- supabase/migrations/20260926_update_events_rls_editor_role.sql

-- 1. Asegurar que Row Level Security (RLS) esté habilitado en la tabla 'events'
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 2. Limpieza de políticas previas para evitar colisiones
DROP POLICY IF EXISTS "Public can view published events" ON events;
DROP POLICY IF EXISTS "Public events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
DROP POLICY IF EXISTS "Allow public read-only access for published events" ON events;

DROP POLICY IF EXISTS "Admins can view all events" ON events;
DROP POLICY IF EXISTS "Admins and editors can view all events" ON events;

DROP POLICY IF EXISTS "Admins can insert events" ON events;
DROP POLICY IF EXISTS "Admins can create events" ON events;
DROP POLICY IF EXISTS "Admins and editors can create events" ON events;

DROP POLICY IF EXISTS "Admins can update events" ON events;
DROP POLICY IF EXISTS "Admins and editors can update events" ON events;

DROP POLICY IF EXISTS "Admins can delete events" ON events;
DROP POLICY IF EXISTS "Admins and creators can delete events" ON events;

-- ──────────────────────────────────────────────────────────────
-- POLÍTICAS RLS PARA 'events'
-- ──────────────────────────────────────────────────────────────

-- 1. LECTURA PÚBLICA:
-- Cualquier usuario (anónimo o autenticado) puede ver eventos publicados
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  TO public
  USING (status = 'published');

-- 2. LECTURA ADMINISTRATIVA / EDITORIAL:
-- Administradores y Editores pueden ver TODOS los eventos (incluidos borradores)
CREATE POLICY "Admins and editors can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- 3. INSERCIÓN (CREACIÓN):
-- Administradores y Editores pueden crear nuevos eventos
CREATE POLICY "Admins and editors can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- 4. ACTUALIZACIÓN (EDICIÓN):
-- - Administradores pueden editar cualquier evento
-- - Editores pueden editar los eventos creados por ellos (o asignados a ellos)
CREATE POLICY "Admins and editors can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (
        profiles.role = 'admin' 
        OR (profiles.role = 'editor' AND (events.created_by = auth.uid() OR events.created_by IS NULL))
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (
        profiles.role = 'admin' 
        OR (profiles.role = 'editor' AND (events.created_by = auth.uid() OR events.created_by IS NULL))
      )
    )
  );

-- 5. ELIMINACIÓN:
-- - Administradores pueden eliminar cualquier evento
-- - Editores pueden eliminar únicamente los eventos que ellos mismos crearon
CREATE POLICY "Admins and creators can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (
        profiles.role = 'admin' 
        OR (profiles.role = 'editor' AND events.created_by = auth.uid())
      )
    )
  );

-- ──────────────────────────────────────────────────────────────
-- OPCIONAL / RECOMENDADO: POLÍTICAS PARA 'event_registrations'
-- (Permite a los editores ver inscritos en el EventDetailDrawer y marcar asistencia)
-- ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins and editors can view registrations" ON event_registrations;
CREATE POLICY "Admins and editors can view registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Admins and editors can update registrations" ON event_registrations;
CREATE POLICY "Admins and editors can update registrations"
  ON event_registrations FOR UPDATE
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

