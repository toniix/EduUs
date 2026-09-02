// supabase/functions/process-event-reminders/email-template.ts

export type ReminderType = '7_days' | '3_days' | '2_hours';

export interface EventData {
  title: string;
  starts_at: string;
  location?: string | null;
  modality: 'virtual' | 'presencial' | 'hibrido' | string;
  zoom_link?: string | null;
  slug: string;
}

export function getEventReminderEmailTemplate(
  name: string,
  event: EventData,
  reminderType: ReminderType
) {
  // Formatear fecha en hora Perú / español
  const eventDate = new Date(event.starts_at).toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Configuración según el tipo de recordatorio
  const typeConfig: Record<ReminderType, {
    badgeBg: string;
    badgeText: string;
    badgeLabel: string;
    headline: string;
    intro: string;
    headerSubtitle: string;
    accentColor: string;
  }> = {
    '7_days': {
      badgeBg: '#eff6ff',
      badgeText: '#1d4ed8',
      badgeLabel: '📅 En 1 semana',
      headline: '¡Tu evento se acerca!',
      intro: `Te recordamos que en una semana se llevará a cabo <strong>${event.title}</strong>. Recuerda agendar este espacio y preparar tus consultas.`,
      headerSubtitle: 'Recordatorio Pre-Evento • 7 Días',
      accentColor: '#2563eb'
    },
    '3_days': {
      badgeBg: '#fffbeb',
      badgeText: '#b45309',
      badgeLabel: '⏰ Faltan 3 días',
      headline: '¡Solo quedan 3 días!',
      intro: `Estamos a 3 días del evento <strong>${event.title}</strong>. Si aún no te has unido a la comunidad en WhatsApp para interactuar con los ponentes, te invitamos a hacerlo abajo.`,
      headerSubtitle: 'Recordatorio Pre-Evento • 3 Días',
      accentColor: '#f59e0b'
    },
    '2_hours': {
      badgeBg: '#fef2f2',
      badgeText: '#dc2626',
      badgeLabel: '🚨 ¡Comenzamos en 2 horas!',
      headline: '¡El evento inicia pronto!',
      intro: `¡Faltan solo 2 horas para que comience <strong>${event.title}</strong>! Prepara tu conexión y tu espacio para ingresar puntualmente.`,
      headerSubtitle: 'Acceso Inmediato • Inicia en 2 horas',
      accentColor: '#dc2626'
    }
  };

  const config = typeConfig[reminderType] || typeConfig['3_days'];

  const locationRow = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td width="48" valign="middle" style="padding-right: 12px;">
          <div style="background-color: #fef2f2; width: 40px; height: 40px; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">📍</div>
        </td>
        <td valign="middle" style="word-break: break-word;">
          <strong style="color: #374151; font-size: 13px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Ubicación</strong>
          <span class="detail-value" style="color: #1f2937; font-size: 16px; font-weight: 500;">${event.location || 'Por confirmar'}</span>
        </td>
      </tr>
    </table>
  `;

  const zoomRow = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td width="48" valign="middle" style="padding-right: 12px;">
          <div style="background-color: #fef2f2; width: 40px; height: 40px; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">💻</div>
        </td>
        <td valign="middle" style="word-break: break-word;">
          <strong style="color: #374151; font-size: 13px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Enlace de Zoom</strong>
          <span class="detail-value" style="color: #1f2937; font-size: 16px;">
            ${event.zoom_link ? `<a href="${event.zoom_link}" target="_blank" style="color: #e6461e; text-decoration: underline; font-weight: 600;">Ingresar a la sesión de Zoom</a>` : 'Se enviará antes del evento'}
          </span>
        </td>
      </tr>
    </table>
  `;

  let detailsHtml = '';
  if (event.modality === 'virtual') {
    detailsHtml = zoomRow;
  } else if (event.modality === 'hibrido') {
    detailsHtml = `
      ${locationRow}
      <div style="height: 1px; background-color: #e2e8f0; margin: 16px 0;"></div>
      ${zoomRow}
    `;
  } else {
    detailsHtml = locationRow;
  }

  // CTA principal para 2 horas antes (Zoom prioritario si es virtual)
  const isVirtual = event.modality === 'virtual' || event.modality === 'hibrido';
  const mainCtaText = reminderType === '2_hours' && isVirtual && event.zoom_link ? '🎥 Entrar al Zoom' : 'Ver detalles del evento';
  const mainCtaLink = reminderType === '2_hours' && isVirtual && event.zoom_link ? event.zoom_link : `https://eduus.club/eventos/${event.slug}`;

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${event.title}</title>
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
      <div style="background: linear-gradient(135deg, #e6461e 0%, #d83c16 100%); padding: 40px 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 30px; letter-spacing: 2px; font-weight: 700;">EDU-US</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">${config.headerSubtitle}</p>
      </div>

      <!-- Cuerpo del mensaje -->
      <div class="mobile-pad" style="padding: 40px 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: ${config.badgeBg}; color: ${config.badgeText}; padding: 8px 18px; border-radius: 20px; font-size: 14px; font-weight: 600;">
            ${config.badgeLabel}
          </div>
        </div>

        <h2 style="color: #111827; margin: 0 0 12px 0; font-size: 22px; font-weight: 600;">¡Hola, ${name || 'Estudiante'}!</h2>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 28px 0;">
          ${config.intro}
        </p>

        <!-- Tarjeta de Detalles del Evento -->
        <div
          class="event-card"
          style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 0 0 28px 0;"
        >
          <!-- Título del evento -->
          <div style="border-left: 4px solid #e6461e; padding-left: 14px; margin-bottom: 20px;">
            <h3 style="color: #1f2937; margin: 0; font-size: 19px; font-weight: 700; line-height: 1.4;">
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
                <span class="detail-value" style="color: #1f2937; font-size: 16px; font-weight: 600;">${eventDate}</span>
              </td>
            </tr>
          </table>

          <!-- Divisor -->
          <div style="height: 1px; background-color: #e2e8f0; margin-bottom: 16px;"></div>

          <!-- Ubicación / Zoom Link (Dinámico) -->
          ${detailsHtml}
        </div>

        <!-- Botones CTA -->
        <div style="text-align: center; margin-top: 32px; margin-bottom: 8px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
            <tr>
              <!-- Botón Principal -->
              <td style="padding: 0 6px;">
                <a
                  href="${mainCtaLink}"
                  target="_blank"
                  style="background: linear-gradient(135deg, #e6461e 0%, #d83c16 100%); color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; text-align: center; min-width: 130px;"
                >
                  ${mainCtaText}
                </a>
              </td>
              <!-- Botón WhatsApp -->
              <td style="padding: 0 6px;">
                <a
                  href="https://chat.whatsapp.com/KLGckmNVzvO7nuqWURd1Pf?s=cl&p=i&mlu=3"
                  target="_blank"
                  style="background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; text-align: center; min-width: 130px;"
                >
                  Grupo de WhatsApp
                </a>
              </td>
            </tr>
          </table>
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
          Este es un correo automático de recordatorio para el evento en el que te inscribiste en EDU-US.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px 0; font-weight: 500;">
          &copy; ${new Date().getFullYear()} EDU-US - Todos los derechos reservados
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}

