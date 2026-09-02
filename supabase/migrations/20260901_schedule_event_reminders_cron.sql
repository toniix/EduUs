-- supabase/migrations/20260901_schedule_event_reminders_cron.sql

-- Habilitar las extensiones necesarias si no están habilitadas
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Desprogramar trabajo previo si existe
SELECT cron.unschedule('process-event-reminders-job') 
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'process-event-reminders-job'
);

-- Programar ejecución cada 30 minutos
-- Nota: Asegúrate de reemplazar [PROJECT_REF] y [ANON_OR_SERVICE_ROLE_KEY] en caso de no usar Vault
-- o configurar la llamada a la Edge Function process-event-reminders:
SELECT cron.schedule(
  'process-event-reminders-job',
  '*/30 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://' || current_setting('request.headers', true)::json->>'host' || '/functions/v1/process-event-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);

