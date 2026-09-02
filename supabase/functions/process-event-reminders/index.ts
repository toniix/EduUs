// supabase/functions/process-event-reminders/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getEventReminderEmailTemplate, ReminderType, EventData } from './email-template.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const config = {
  supabase: {
    url: Deno.env.get('SUPABASE_URL') || '',
    key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  },
  resend: {
    apiKey: Deno.env.get('RESEND_API_KEY') || '',
    from: Deno.env.get('EMAIL_FROM') || 'EDU-US <notificaciones@eduus.club>'
  },
  rateLimit: {
    delayMs: parseInt(Deno.env.get('RATE_LIMIT_DELAY_MS') || '600', 10),
    maxBatchSize: parseInt(Deno.env.get('MAX_BATCH_SIZE') || '50', 10)
  }
};

interface EventReminderRow {
  id: string;
  registration_id: string;
  event_id: string;
  email: string;
  name: string;
  reminder_date: string;
  reminder_type: ReminderType;
  status: 'pending' | 'sent' | 'failed';
  events: EventData;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!config.supabase.url || !config.supabase.key) {
      throw new Error('Variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configuradas');
    }

    if (!config.resend.apiKey) {
      throw new Error('RESEND_API_KEY no está configurado');
    }

    const supabaseClient = createClient(
      config.supabase.url,
      config.supabase.key
    );

    console.log('🚀 Iniciando procesamiento de recordatorios de eventos...');
    const now = new Date();

    // Consultar recordatorios pendientes cuya fecha sea menor o igual a ahora
    const { data: reminders, error } = await supabaseClient
      .from('event_reminders')
      .select(`
        id,
        registration_id,
        event_id,
        email,
        name,
        reminder_date,
        reminder_type,
        status,
        events (
          title,
          starts_at,
          location,
          modality,
          zoom_link,
          slug
        )
      `)
      .eq('status', 'pending')
      .lte('reminder_date', now.toISOString())
      .limit(config.rateLimit.maxBatchSize);

    if (error) {
      console.error('❌ Error obteniendo recordatorios de eventos:', error);
      throw error;
    }

    console.log(`📬 Encontrados ${reminders?.length || 0} recordatorios de eventos para procesar`);

    if (!reminders || reminders.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No hay recordatorios de eventos pendientes',
        processed: 0,
        timestamp: now.toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    const results = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < reminders.length; i++) {
      const reminder = reminders[i] as unknown as EventReminderRow;
      const event = reminder.events;

      try {
        console.log(`📤 [${i + 1}/${reminders.length}] Procesando recordatorio ${reminder.id} (${reminder.reminder_type}) para ${reminder.email}`);

        if (!event) {
          throw new Error(`Evento ${reminder.event_id} no encontrado`);
        }

        // Determinar asunto según el tipo de recordatorio
        const subjects: Record<ReminderType, string> = {
          '7_days': `📅 ¡En 1 semana! Recordatorio: ${event.title}`,
          '3_days': `⏰ ¡Faltan 3 días! Prepárate para: ${event.title}`,
          '2_hours': `🚨 ¡Comenzamos en 2 horas! Acceso: ${event.title}`
        };

        const subject = subjects[reminder.reminder_type] || `📅 Recordatorio de evento: ${event.title}`;
        const emailHtml = getEventReminderEmailTemplate(
          reminder.name,
          event,
          reminder.reminder_type
        );

        // Enviar con Resend
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.resend.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: config.resend.from,
            to: [reminder.email],
            subject: subject,
            html: emailHtml
          })
        });

        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(`Error de Resend (${response.status}): ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log(`✅ Email enviado exitosamente. Resend ID: ${data.id}`);

        // Actualizar estado en base de datos
        const { error: updateError } = await supabaseClient
          .from('event_reminders')
          .update({
            status: 'sent',
            sent_at: now.toISOString()
          })
          .eq('id', reminder.id);

        if (updateError) {
          console.error(`⚠️ Error actualizando estado de recordatorio ${reminder.id}:`, updateError);
        }

        results.push({
          id: reminder.id,
          status: 'sent',
          email: reminder.email,
          type: reminder.reminder_type,
          event: event.title
        });
        successCount++;

        // Delay para rate limiting
        if (i < reminders.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, config.rateLimit.delayMs));
        }

      } catch (emailError: any) {
        console.error(`❌ Error procesando recordatorio ${reminder.id}:`, emailError);
        
        await supabaseClient
          .from('event_reminders')
          .update({
            status: 'failed',
            sent_at: now.toISOString()
          })
          .eq('id', reminder.id);

        results.push({
          id: reminder.id,
          status: 'failed',
          error: emailError.message,
          email: reminder.email,
          type: reminder.reminder_type
        });
        failedCount++;
      }
    }

    console.log(`🎯 Procesamiento de eventos completado: ${successCount} enviados, ${failedCount} fallidos`);

    return new Response(JSON.stringify({
      success: true,
      message: `Procesamiento completado: ${successCount} enviados, ${failedCount} fallidos`,
      processed: results.length,
      sent: successCount,
      failed: failedCount,
      timestamp: now.toISOString(),
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: any) {
    console.error('💥 Error crítico procesando recordatorios de eventos:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Error interno del servidor',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

