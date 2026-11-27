-- supabase/migrations/20261126_update_categories_rls_editor_role.sql

-- 1. Asegurar que Row Level Security (RLS) esté habilitado en la tabla 'categories'
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Limpieza de políticas previas para evitar colisiones
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Allow public read-only access for categories" ON categories;
DROP POLICY IF EXISTS "Public read access for categories" ON categories;

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON categories;

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can create categories" ON categories;
DROP POLICY IF EXISTS "Admins and editors can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins and editors can create categories" ON categories;

DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins and editors can update categories" ON categories;

DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

-- ──────────────────────────────────────────────────────────────
-- POLÍTICAS RLS PARA 'categories'
-- ──────────────────────────────────────────────────────────────

-- 1. LECTURA PÚBLICA:
-- Cualquier usuario (anónimo o autenticado) puede consultar categorías
-- para oportunidades, eventos y filtros.
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- 2. INSERCIÓN (CREACIÓN):
-- Administradores y Editores pueden crear nuevas categorías
CREATE POLICY "Admins and editors can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND LOWER(profiles.role) IN ('admin', 'editor')
    )
  );

-- 3. ACTUALIZACIÓN (EDICIÓN):
-- Administradores y Editores pueden actualizar categorías existentes
CREATE POLICY "Admins and editors can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND LOWER(profiles.role) IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND LOWER(profiles.role) IN ('admin', 'editor')
    )
  );

-- 4. ELIMINACIÓN:
-- ÚNICAMENTE Administradores pueden eliminar categorías (Editores tienen denegada la eliminación)
CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND LOWER(profiles.role) = 'admin'
    )
  );
