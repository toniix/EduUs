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
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <!-- Encabezado con color principal -->
              <div style="background-color: #e6461e; padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">EDU-US</h1>
                <p style="color: #ffecd1; margin: 8px 0 0 0; font-size: 16px;">Confirmación de Inscripción</p>
              </div>

              <!-- Cuerpo del mensaje -->
              <div style="padding: 32px 24px;">
                <h2 style="color: #111827; margin-top: 0; font-size: 20px;">¡Hola, ${record.name}! 👋</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Nos alegra confirmarte que tu inscripción ha sido procesada con éxito. Ya tienes tu lugar asegurado para nuestro próximo evento.
                </p>

                <!-- Tarjeta de Detalles del Evento -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 24px 0;">
                  <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #e6461e; padding-bottom: 8px; display: inline-block;">
                    ${event.title}
                  </h3>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; width: 30px; vertical-align: top;"><span style="font-size: 18px;">📅</span></td>
                      <td style="padding: 8px 0;">
                        <strong style="color: #374151; font-size: 14px; display: block; margin-bottom: 2px;">Fecha y hora</strong>
                        <span style="color: #64748b; font-size: 15px;">${eventDate}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; width: 30px; vertical-align: top;"><span style="font-size: 18px;">📍</span></td>
                      <td style="padding: 8px 0;">
                        <strong style="color: #374151; font-size: 14px; display: block; margin-bottom: 2px;">Ubicación</strong>
                        <span style="color: #64748b; font-size: 15px;">${event.location}</span>
                      </td>
                    </tr>
                  </table>
                </div>

                
                <div style="text-align: center; margin-top: 32px;">
                  <a href="https://eduus.club" style="background-color: #e6461e; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Ir al sitio web</a>
                </div>
              </div>

               <!-- Pie de página -->
              <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                  Este es un correo automático, por favor no respondas a este mensaje.
                </p>
                <p style="color: #9ca3af; font-size: 14px; margin: 8px 0 0 0;">
                  &copy; ${new Date().getFullYear()} EDU-US. Todos los derechos reservados.
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