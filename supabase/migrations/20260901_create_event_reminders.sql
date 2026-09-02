-- supabase/migrations/20260901_create_event_reminders.sql

-- 1. Crear tabla para los recordatorios de eventos
CREATE TABLE IF NOT EXISTS event_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  reminder_date TIMESTAMPTZ NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('7_days', '3_days', '2_hours')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices para acelerar las consultas del cron processor
CREATE INDEX IF NOT EXISTS idx_event_reminders_pending 
  ON event_reminders (status, reminder_date) 
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_event_reminders_registration 
  ON event_reminders (registration_id, reminder_type);

CREATE INDEX IF NOT EXISTS idx_event_reminders_event 
  ON event_reminders (event_id);

-- 3. Habilitar RLS
ALTER TABLE event_reminders ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (los administradores o service_role gestionan los recordatorios)
CREATE POLICY "Admins can view event reminders"
  ON event_reminders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 4. Función Trigger para generar automáticamente los recordatorios al inscribirse
CREATE OR REPLACE FUNCTION handle_new_event_registration()
RETURNS TRIGGER AS $$
DECLARE
  v_event RECORD;
  v_remind_7d TIMESTAMPTZ;
  v_remind_3d TIMESTAMPTZ;
  v_remind_2h TIMESTAMPTZ;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- Obtener datos y fecha de inicio del evento
  SELECT starts_at INTO v_event 
  FROM events 
  WHERE id = NEW.event_id;
  
  IF v_event.starts_at IS NOT NULL THEN
    -- 1. Calcular 7 días antes a las 09:00 AM (Hora Perú / UTC-5)
    v_remind_7d := ((v_event.starts_at AT TIME ZONE 'America/Lima' - INTERVAL '7 days')::date + TIME '09:00:00') AT TIME ZONE 'America/Lima';
    
    -- 2. Calcular 3 días antes a las 09:00 AM (Hora Perú / UTC-5)
    v_remind_3d := ((v_event.starts_at AT TIME ZONE 'America/Lima' - INTERVAL '3 days')::date + TIME '09:00:00') AT TIME ZONE 'America/Lima';
    
    -- 3. Calcular 2 horas antes de la hora exacta de inicio del evento
    v_remind_2h := v_event.starts_at - INTERVAL '2 hours';
    
    -- Insertar recordatorio de 7 días si la fecha es estrictamente futura
    IF v_remind_7d > v_now THEN
      INSERT INTO event_reminders (
        registration_id, event_id, email, name, reminder_date, reminder_type, status
      ) VALUES (
        NEW.id, NEW.event_id, NEW.email, NEW.name, v_remind_7d, '7_days', 'pending'
      );
    END IF;

    -- Insertar recordatorio de 3 días si la fecha es estrictamente futura
    IF v_remind_3d > v_now THEN
      INSERT INTO event_reminders (
        registration_id, event_id, email, name, reminder_date, reminder_type, status
      ) VALUES (
        NEW.id, NEW.event_id, NEW.email, NEW.name, v_remind_3d, '3_days', 'pending'
      );
    END IF;

    -- Insertar recordatorio de 2 horas si la fecha es estrictamente futura
    IF v_remind_2h > v_now THEN
      INSERT INTO event_reminders (
        registration_id, event_id, email, name, reminder_date, reminder_type, status
      ) VALUES (
        NEW.id, NEW.event_id, NEW.email, NEW.name, v_remind_2h, '2_hours', 'pending'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger en event_registrations
DROP TRIGGER IF EXISTS trigger_create_event_reminders ON event_registrations;
CREATE TRIGGER trigger_create_event_reminders
AFTER INSERT ON event_registrations
FOR EACH ROW
EXECUTE FUNCTION handle_new_event_registration();

