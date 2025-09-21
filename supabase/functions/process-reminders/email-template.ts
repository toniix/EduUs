// supabase/functions/process-reminders/email-template.ts
export function getEmailTemplate(
  userName: string,
  opportunity: any,
  daysUntilDeadline: number,
  urgencyLevel: "urgent" | "warning" | "normal"
) {
  // Configuraciones por nivel de urgencia
  const urgencyConfig = {
    urgent: {
      color: '#ec451d',  // Rojo de la paleta para urgencia
      bgColor: '#fef2f2',
      gradient: 'linear-gradient(135deg, #ec451d, #d13c18)',
      icon: '🚨',
      buttonText: '🚀 ¡APLICAR AHORA!',
      message: daysUntilDeadline === 0 ? 'es HOY' : 'es MAÑANA'
    },
    warning: {
      color: '#f5ba3c',  // Amarillo de la paleta para advertencia
      bgColor: '#fff9e6',
      gradient: 'linear-gradient(135deg, #f5ba3c, #e6ac1a)',
      icon: '⏰',
      buttonText: '⚡ Aplicar Ahora',
      message: 'está muy cerca'
    },
    normal: {
      color: '#4db9a9',  // Verde azulado de la paleta para normal
      bgColor: '#f0f9f7',
      gradient: 'linear-gradient(135deg, #4db9a9, #3a9e8f)',
      icon: '📅',
      buttonText: '📝 Aplicar Ahora',
      message: 'se acerca'
    }
  }

  const config = urgencyConfig[urgencyLevel]
  
  // Logo por defecto de tu organización
  const defaultOrgLogo = 'https://res.cloudinary.com/eduus/image/upload/v1758387784/LOGO-DE-COLORES-PNG_jdt9ql.png' // ← Cambia por tu URL
  
  const getTimeMessage = () => {
    if (daysUntilDeadline === 0) return '¡LA FECHA LÍMITE ES HOY!'
    if (daysUntilDeadline === 1) return '¡SOLO QUEDA 1 DÍA!'
    return `QUEDAN ${daysUntilDeadline} DÍAS`
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Recordatorio de Oportunidad</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; margin: 0 !important; }
            .content-padding { padding: 20px !important; }
            .header-padding { padding: 30px 15px !important; }
            .button { padding: 12px 24px !important; font-size: 14px !important; }
            .org-logo { width: 50px !important; height: 50px !important; }
            .opportunity-image { height: 150px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; color: #333;">
        <div style="padding: 20px 0;">
          <div class="container" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);">
            
            <!-- Header con logo de tu organización -->
            <div class="header-padding" style="background: ${config.gradient}; padding: 30px 20px; text-align: center; position: relative;">
              <!-- Logo de tu organización -->
              <img 
                src="${defaultOrgLogo}" 
                alt="Logo de la organización"
                class="org-logo"
                style="width: 140px; height: 90px; border-radius: 16px; margin-bottom: 20px; background-color: rgba(255,255,255,0.15); padding: 10px; object-fit: contain;"
              />
              
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; line-height: 1.2;">
                Recordatorio de Oportunidad
              </h1>
              
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px; font-weight: 500; letter-spacing: 0.5px;">
                Sistema EduTracker
              </p>
              
              <!-- Decoración -->
              <div style="position: absolute; top: 15px; right: 15px; opacity: 0.1;">
                <div style="width: 50px; height: 50px; border: 3px solid white; border-radius: 50%; transform: rotate(45deg);"></div>
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="content-padding" style="padding: 40px 24px;">
            
              <!-- Mensaje personalizado -->
              <div style="margin-bottom: 40px;">
                <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 20px 0; color: #374151; font-size: 18px; font-weight: 600; line-height: 1.4;">
                    👋 Hola <span style="color: ${config.color};">${userName}</span>,
                  </p>
                  
                  <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 17px; line-height: 1.7;">
                    ${urgencyLevel === 'urgent' 
                      ? `🚨 <strong style="color: ${config.color};">¡URGENTE!</strong> La fecha límite para aplicar a "<strong>${opportunity.title}</strong>" ${config.message}.`
                      : `Te recordamos que la fecha límite para aplicar a "<strong>${opportunity.title}</strong>" ${config.message}.`
                    }
                  </p>
                  
                  <div style="background: ${config.color}08; padding: 20px; border-radius: 12px; border-left: 4px solid ${config.color};">
                    <p style="margin: 0; color: #374151; font-size: 16px; font-weight: 600; line-height: 1.5;">
                      ${urgencyLevel === 'urgent'
                        ? '🔥 ¡No dejes pasar esta oportunidad! ¡Aplica ahora mismo!'
                        : urgencyLevel === 'warning'
                        ? '⚡ ¡El tiempo se agota! Asegúrate de tener todo listo.'
                        : '📋 Recuerda preparar todos los documentos necesarios.'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Card de la oportunidad -->
              <div style="background: #ffffff; padding: 20px; border-radius: 16px; margin-bottom: 24px; border-left: 4px solid ${config.color}; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <!-- Imagen de la oportunidad con altura reducida -->
                ${opportunity.image_url ? `
                  <div style="margin-bottom: 16px; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <img 
                      src="${opportunity.image_url}" 
                      alt="${opportunity.title}"
                      class="opportunity-image"
                      style="width: 100%; height: 160px; object-fit: cover; display: block;"
                    />
                  </div>
                ` : ''}
                
                <h2 style="margin: 0 0 16px 0; color: ${config.color}; font-size: 22px; font-weight: 700; line-height: 1.3;">
                  ${opportunity.title}
                </h2>
                
                <!-- Información en línea compacta -->
                <div style="display: flex; align-items: stretch; background: #f9fafb; padding: 12px; border-radius: 10px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  <!-- Sección de Tipo -->
                  <div style="display: flex; align-items: center; padding: 0 16px; border-right: 1px solid #e5e7eb;">
                    <div style="background: ${config.color}10; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                      <span style="font-size: 16px; color: ${config.color};">📂</span>
                    </div>
                    <div>
                      <p style="margin: 0 0 2px 0; color: #6b7280; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Tipo
                      </p>
                      <p style="margin: 0; color: #1f2937; font-size: 13px; font-weight: 600; text-transform: capitalize;">
                        ${opportunity.type}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Sección de Fecha Límite -->
                  <div style="display: flex; align-items: center; padding: 0 16px;">
                    <div style="background: ${config.color}10; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                      <span style="font-size: 16px; color: ${config.color};">📅</span>
                    </div>
                    <div>
                      <p style="margin: 0 0 2px 0; color: #6b7280; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Fecha límite
                      </p>
                      <p style="margin: 0; color: #1f2937; font-size: 13px; font-weight: 600; line-height: 1.3;">
                        ${new Date(opportunity.deadline).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Contador de urgencia con animación visual -->
                <div style="background: ${config.bgColor}; background-image: linear-gradient(135deg, ${config.bgColor} 0%, rgba(255,255,255,0.8) 100%); padding: 24px; border-radius: 16px; text-align: center; border: 2px solid ${config.color}33; position: relative; overflow: hidden;">
                  <!-- Efecto de fondo -->
                  <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, ${config.color}05 0%, transparent 70%); animation: pulse 2s infinite;"></div>
                  
                  <div style="position: relative; z-index: 1;">
                    <p style="margin: 0 0 8px 0; color: ${config.color}; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                      ${config.icon} ${getTimeMessage()}
                    </p>
                    ${daysUntilDeadline > 0 ? `
                      <p style="margin: 0; color: ${config.color}; font-size: 16px; font-weight: 600;">
                        La fecha límite ${config.message}
                      </p>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Botón de acción mejorado -->
              ${opportunity.contact.website ? `
                <div style="text-align: center; margin: 40px 0;">
                  <div style="background: linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%); padding: 6px; border-radius: 16px; display: inline-block; box-shadow: 0 8px 25px ${config.color}40;">
                    <a 
                      href="${opportunity.contact.website}"
                      class="button"
                      style="display: inline-block; background: linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%); color: white; padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; letter-spacing: 0.5px; text-transform: uppercase; transition: all 0.3s ease; box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);"
                    >
                      ${config.buttonText} →
                    </a>
                  </div>
                  
                  <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px; font-style: italic;">
                    👆 Haz clic para acceder a la oportunidad
                  </p>
                </div>
              ` : ''}
              
              <!-- Consejo con diseño mejorado -->
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 24px; border-radius: 16px; margin: 32px 0; border: 1px solid #bae6fd; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -10px; right: -10px; width: 60px; height: 60px; background: #0ea5e933; border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <p style="margin: 0; color: #0c4a6e; font-size: 16px; text-align: center; font-weight: 600; line-height: 1.5;">
                    💡 <strong>Consejo profesional:</strong> 
                    ${urgencyLevel === 'urgent'
                      ? 'Revisa que tengas todos los documentos listos antes de aplicar. ¡El tiempo es crucial!'
                      : 'Comienza a reunir todos los documentos necesarios con tiempo. La preparación es clave para el éxito.'
                    }
                  </p>
                </div>
              </div>

              <!-- Recordatorio adicional si es urgente -->
              ${urgencyLevel === 'urgent' ? `
                <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 20px; border-radius: 12px; border: 2px solid #fca5a5; text-align: center; margin: 24px 0;">
                  <p style="margin: 0; color: #991b1b; font-size: 15px; font-weight: 700;">
                    ⚠️ RECORDATORIO FINAL: Esta es una oportunidad de tiempo limitado
                  </p>
                </div>
              ` : ''}
            </div>

            <!-- Footer mejorado -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px 24px; border-top: 1px solid #e2e8f0;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img 
                  src="${defaultOrgLogo}" 
                  alt="Logo"
                  style="width: 80px; height: 40px; border-radius: 8px; opacity: 0.7;"
                />
              </div>
              
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280; text-align: center; line-height: 1.6; font-weight: 500;">
                Este es un recordatorio automático que configuraste en nuestro sistema EduTracker.
                <br />
                Si ya aplicaste o no deseas recibir más notificaciones, puedes gestionar tus recordatorios en tu perfil.
              </p>
              
              <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af; font-weight: 500;">
                  📧 Enviado por el Sistema EduTracker • ${new Date().toLocaleDateString('es-ES')}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #d1d5db;">
                  © ${new Date().getFullYear()} EduUS. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}