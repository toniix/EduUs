-- supabase/migrations/20260927_create_event_access_table.sql

-- 1. Crear tabla satélite 'event_access' para almacenar credenciales y enlaces privados de eventos
CREATE TABLE IF NOT EXISTS public.event_access (
  event_id UUID PRIMARY KEY REFERENCES public.events(id) ON DELETE CASCADE,
  zoom_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS en 'event_access'
ALTER TABLE public.event_access ENABLE ROW LEVEL SECURITY;

-- 3. Limpiar políticas previas si existieran
DROP POLICY IF EXISTS "Admins and editors can view event access" ON public.event_access;
DROP POLICY IF EXISTS "Admins and editors can insert event access" ON public.event_access;
DROP POLICY IF EXISTS "Admins and editors can update event access" ON public.event_access;
DROP POLICY IF EXISTS "Admins and editors can delete event access" ON public.event_access;

-- 4. POLÍTICAS RLS:
-- 4.1 SELECT: Solo administradores y editores (y service_role) pueden consultar enlaces privados
CREATE POLICY "Admins and editors can view event access"
  ON public.event_access FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- 4.2 INSERT: Solo administradores y editores pueden registrar enlaces privados
CREATE POLICY "Admins and editors can insert event access"
  ON public.event_access FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- 4.3 UPDATE: Solo administradores y editores pueden modificar enlaces privados
CREATE POLICY "Admins and editors can update event access"
  ON public.event_access FOR UPDATE
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

-- 4.4 DELETE: Solo administradores y editores pueden eliminar enlaces privados
CREATE POLICY "Admins and editors can delete event access"
  ON public.event_access FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- 5. Migrar datos existentes de 'events.zoom_link' a 'event_access' si la columna existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name = 'zoom_link'
  ) THEN
    INSERT INTO public.event_access (event_id, zoom_link)
    SELECT id, zoom_link 
    FROM public.events
    WHERE zoom_link IS NOT NULL AND TRIM(zoom_link) != ''
    ON CONFLICT (event_id) DO UPDATE SET zoom_link = EXCLUDED.zoom_link;
    
    -- Eliminar la columna de la tabla base 'events' para erradicar la superficie de ataque
    ALTER TABLE public.events DROP COLUMN zoom_link;
  END IF;
END $$;
