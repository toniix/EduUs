// supabase/functions/process-reminders/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getEmailTemplate } from './email-template.ts';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// Configuración
const config = {
  supabase: {
    url: Deno.env.get('SUPABASE_URL') || '',
    key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  },
  resend: {
    apiKey: Deno.env.get('RESEND_API_KEY') || '',
    from: Deno.env.get('EMAIL_FROM') || 'notificaciones@eduus.club'
  },
  rateLimit: {
    delayMs: parseInt(Deno.env.get('RATE_LIMIT_DELAY_MS') || '600', 10),
    maxBatchSize: parseInt(Deno.env.get('MAX_BATCH_SIZE') || '50', 10)
  }
};

// Validar configuraciones requeridas
const requiredVars = [
  { key: 'SUPABASE_URL', value: config.supabase.url },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', value: config.supabase.key },
  { key: 'RESEND_API_KEY', value: config.resend.apiKey }
];

for (const { key, value } of requiredVars) {
  if (!value) {
    throw new Error(`❌ Variable de entorno requerida no configurada: ${key}`);
  }
}
interface Reminder {
  id: string;
  user_id: string;
  opportunity_id: string;
  reminder_date: string;
  reminder_type: string;
  status: string;
  opportunities: {
    title: string;
    description?: string;
    deadline: string;
    url?: string;
    image_url?: string;
    category: {
      id: string;
      name: string;
    };
  };
  profiles: {
    email: string;
    full_name: string;
  };
}
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const supabaseClient = createClient(
      config.supabase.url,
      config.supabase.key
    )

    const RESEND_API_KEY = config.resend.apiKey

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no está configurado')
    }
    console.log('🚀 Iniciando procesamiento de recordatorios...');

    const now = new Date();


    const { data: reminders, error } = await supabaseClient.from('reminders').select(`
        *,
        opportunities (*,
        category:categories(id, name)),
        profiles!inner (email, full_name)
      `).eq('status', 'pending').lte('reminder_date', now.toISOString())
      .limit(config.rateLimit.maxBatchSize); // Limitar batch size
    if (error) {
      console.error('❌ Error obteniendo recordatorios:', error);
      throw error;
    }

    console.log(`📬 Encontrados ${reminders?.length || 0} recordatorios para procesar`);

    if (!reminders || reminders.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No hay recordatorios pendientes',
        processed: 0,
        timestamp: now.toISOString()
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      });
    }

    const results = [];
    let successCount = 0;
    let failedCount = 0;

    // 🔄 PROCESAR CADA RECORDATORIO CON DELAY
    for(let i = 0; i < reminders.length; i++){
      const reminder: Reminder = reminders[i];
      try {
        console.log(`📤 [${i + 1}/${reminders.length}] Procesando recordatorio ${reminder.id} para ${reminder.profiles.email}`);

        // Enviar email con rate limiting
        const emailResult = await sendReminderEmailWithRateLimit(reminder, config.resend.apiKey, config.rateLimit.delayMs);
        if (emailResult.success) {
          // Actualizar estado del recordatorio
          const { error: updateError } = await supabaseClient.from('reminders').update({
            status: 'sent',
            sent_at: now.toISOString()
          }).eq('id', reminder.id);
          if (updateError) {
            console.error(`⚠️ Error actualizando estado del recordatorio ${reminder.id}:`, updateError);
          }
          results.push({
            id: reminder.id,
            status: 'sent',
            email: reminder.profiles.email,
            opportunity: reminder.opportunities.title
          });
          successCount++;
          
          console.log(`✅ Recordatorio ${reminder.id} enviado exitosamente`);
        } else {
          throw new Error(emailResult.error || 'Error enviando email');
        }
      } catch (emailError) {
        console.error(`❌ Error procesando recordatorio ${reminder.id}:`, emailError);
        // Marcar como fallido
        await supabaseClient.from('reminders').update({
          status: 'failed',
          sent_at: now.toISOString()
        }).eq('id', reminder.id);
        results.push({
          id: reminder.id,
          status: 'failed',
          error: emailError.message,
          email: reminder.profiles.email,
          opportunity: reminder.opportunities.title
        });
        failedCount++;
      }
    }
    console.log(`🎯 Procesamiento completado: ${successCount} enviados, ${failedCount} fallidos`);
    return new Response(JSON.stringify({
      success: true,
      message: `Procesamiento completado: ${successCount} enviados, ${failedCount} fallidos`,
      processed: results.length,
      sent: successCount,
      failed: failedCount,
      timestamp: now.toISOString(),
      results
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('💥 Error crítico procesando recordatorios:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Error interno del servidor',
      timestamp: new Date().toISOString()
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
// 📧 Función mejorada para enviar emails CON RATE LIMITING
async function sendReminderEmailWithRateLimit(reminder, resendApiKey, delayMs) {
  try {
    const userName = reminder.profiles?.full_name || 'Usuario';
    const opportunity = reminder.opportunities;
    const userEmail = reminder.profiles.email;
    // Calcular días hasta la fecha límite
    const deadline = new Date(opportunity.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    // Determinar nivel de urgencia 
    const urgencyLevel = daysUntilDeadline <= 1 ? 'urgent' : daysUntilDeadline <= 3 ? 'warning' : 'normal';
    console.log(`📊 Email para ${userEmail}: ${opportunity.title} - ${daysUntilDeadline} días - ${urgencyLevel}`);

    // Generar HTML usando el template mejorado
    const emailHtml = getEmailTemplate(
      userName, 
      opportunity, 
      daysUntilDeadline, 
      urgencyLevel);

    // Generar subject dinámico y mejorado
    const subjectConfig = {
      urgent: daysUntilDeadline === 0 ? '🚨 ¡ES HOY!' : '🚨 ¡URGENTE - Solo queda 1 día!',
      warning: `⏰ ¡Quedan ${daysUntilDeadline} días!`,
      normal: `📅 Recordatorio - ${daysUntilDeadline} días restantes`
    };

    const subject = `${subjectConfig[urgencyLevel]} ${opportunity.title}`;

    // Enviar email usando Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: config.resend.from,
        to: [
          userEmail
        ],
        subject: subject,
        html: emailHtml
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`❌ Error de Resend (${response.status}):`, responseText);
      throw new Error(`Error de Resend (${response.status}): ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log(`📤 Email enviado exitosamente. ID: ${data.id}`);

    // ⏱️ ESPERAR ANTES DEL SIGUIENTE ENVÍO (Rate Limiting)
    console.log(`⏳ Esperando ${delayMs}ms antes del siguiente envío...`);
    await new Promise((resolve)=>setTimeout(resolve, delayMs));

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('💥 Error enviando email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
