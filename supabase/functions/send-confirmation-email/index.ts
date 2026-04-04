import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resendApiKey = Deno.env.get('RESEND_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    // ✅ Leer payload UNA SOLA VEZ
    const payload = await req.json()
    console.log("Webhook payload:", payload)

    // ✅ Solo procesar INSERT
    if (payload.type !== 'INSERT') {
      return new Response('OK: Not an INSERT event', { status: 200 })
    }

    const record = payload.record

    if (!record || !record.email) {
      throw new Error("No hay correo en el payload")
    }

    // 🔍 Obtener datos del evento
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('title, starts_at, location')
      .eq('id', record.event_id)
      .single()

    if (eventError) {
      throw new Error(`Error al buscar evento: ${eventError.message}`)
    }

    // 📅 Formatear fecha
    const eventDate = new Date(event.starts_at).toLocaleString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    // 📩 Enviar email con Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'EDU-US <notificaciones@eduus.club>',
        to: record.email,
        subject: `¡Confirmación de inscripción! - ${event.title}`,
        html: `
         <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style type="text/css">
      @media only screen and (max-width: 600px) {
        .email-container { width: 100% !important; }
        .mobile-pad { padding: 28px 16px !important; }
        .event-card { padding: 20px 16px !important; }
        .detail-value { font-size: 14px !important; }
      }
    </style>
  </head>
  <body
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%); margin: 0; padding: 40px 20px;"
  >
    <div
      class="email-container"
      style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);"
    >
      <!-- Barra decorativa superior -->
      <div style="height: 4px; background: linear-gradient(90deg, #e6461e 0%, #ff6b47 100%);"></div>

      <!-- Encabezado -->
      <div style="background: linear-gradient(135deg, #e6461e 0%, #d83c16 100%); padding: 48px 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 2px; font-weight: 700;">EDU-US</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 15px; letter-spacing: 0.5px; text-transform: uppercase;">Confirmación de Inscripción</p>
      </div>

      <!-- Cuerpo del mensaje -->
      <div class="mobile-pad" style="padding: 40px 32px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background-color: #ecfdf5; color: #059669; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
            ✓ Inscripción Confirmada
          </div>
        </div>

        <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">¡Hola, ${record.name}!</h2>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
          Nos complace confirmarte que tu inscripción ha sido procesada exitosamente. Tu lugar está asegurado para nuestro próximo evento. ¡Te esperamos!
        </p>

        <!-- Tarjeta de Detalles del Evento -->
        <div
          class="event-card"
          style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 28px; margin: 0 0 32px 0;"
        >
          <!-- Título del evento -->
          <div style="border-left: 4px solid #e6461e; padding-left: 16px; margin-bottom: 24px;">
            <h3 style="color: #1f2937; margin: 0; font-size: 20px; font-weight: 700; line-height: 1.4;">
              ${event.title}
            </h3>
          </div>

          <!-- Fila: Fecha -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
            <tr>
              <td width="48" valign="middle" style="padding-right: 12px;">
                <div style="background-color: #fef2f2; width: 40px; height: 40px; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">📅</div>
              </td>
              <td valign="middle" style="word-break: break-word;">
                <strong style="color: #374151; font-size: 13px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Fecha y hora</strong>
                <span class="detail-value" style="color: #1f2937; font-size: 16px; font-weight: 500;">${eventDate}</span>
              </td>
            </tr>
          </table>

          <!-- Divisor -->
          <div style="height: 1px; background-color: #e2e8f0; margin-bottom: 16px;"></div>

          <!-- Fila: Ubicación -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="48" valign="middle" style="padding-right: 12px;">
                <div style="background-color: #fef2f2; width: 40px; height: 40px; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">📍</div>
              </td>
              <td valign="middle" style="word-break: break-word;">
                <strong style="color: #374151; font-size: 13px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Ubicación</strong>
                <span class="detail-value" style="color: #1f2937; font-size: 16px; font-weight: 500;">${event.location}</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Botón CTA -->
        <div style="text-align: center; margin-top: 36px;">
          <a
            href="https://eduus.club"
            style="background: linear-gradient(135deg, #e6461e 0%, #d83c16 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;"
            >Visitar EDU-US</a
          >
        </div>
      </div>

      <!-- Pie de página -->
      <div style="background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%); padding: 32px 24px 24px; text-align: center; border-top: 1px solid #e5e7eb;">

        <!-- Redes Sociales -->
        <p style="color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0;">
          Síguenos en:
        </p>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 28px;">
          <tr>
            <!-- Instagram -->
            <td style="padding: 0 6px;">
              <a href="https://www.instagram.com/edu.us_/" target="_blank"
                 style="display: inline-block; width: 40px; height: 40px; background-color: #e6e6e6; border-radius: 50%; text-align: center; font-size: 0; line-height: 0; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                     width="20" height="20" alt="Instagram"
                     style="display: block; margin: 10px auto; border: 0;">
              </a>
            </td>
            <!-- LinkedIn -->
            <td style="padding: 0 6px;">
              <a href="https://www.linkedin.com/company/edu-us/" target="_blank"
                 style="display: inline-block; width: 40px; height: 40px; background-color: #e6e6e6; border-radius: 50%; text-align: center; font-size: 0; line-height: 0; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"
                     width="20" height="20" alt="LinkedIn"
                     style="display: block; margin: 10px auto; border: 0;">
              </a>
            </td>
            <!-- Facebook -->
            <td style="padding: 0 6px;">
              <a href="https://web.facebook.com/profile.php?id=100090641378967" target="_blank"
                 style="display: inline-block; width: 40px; height: 40px; background-color: #e6e6e6; border-radius: 50%; text-align: center; font-size: 0; line-height: 0; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                     width="20" height="20" alt="Facebook"
                     style="display: block; margin: 10px auto; border: 0;">
              </a>
            </td>
            <!-- YouTube -->
            <td style="padding: 0 6px;">
              <a href="https://www.youtube.com/@eduus-" target="_blank"
                 style="display: inline-block; width: 40px; height: 40px; background-color: #e6e6e6; border-radius: 50%; text-align: center; font-size: 0; line-height: 0; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                     width="20" height="20" alt="YouTube"
                     style="display: block; margin: 10px auto; border: 0;">
              </a>
            </td>
          </tr>
        </table>

        <!-- Links -->
        <p style="color: #9ca3af; font-size: 13px; margin: 0 0 20px 0;">
          <a href="https://eduus.club/privacidad" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">Privacidad</a>
          <span style="color: #d1d5db;">•</span>
          <a href="https://eduus.club/terminos" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">Términos</a>
        </p>

        <!-- Legal -->
        <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0; line-height: 1.6;">
          Este es un correo automático de confirmación. Por favor, no respondas a este mensaje.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px 0; font-weight: 500;">
          &copy; ${new Date().getFullYear()} EDU-US - Todos los derechos reservados
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 0;">
          Recibiste este correo porque te inscribiste a un evento en EDU-US
        </p>

      </div>
    </div>
  </body>
</html>

        `
      })
    })

    const resData = await res.json()

    if (!res.ok) {
      throw new Error(`Error de Resend: ${JSON.stringify(resData)}`)
    }

    console.log("Email enviado:", resData)

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    const error = err as Error;
    console.error('Error:', error.message)

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})