# Plan de implementación: encuesta web EDU-MENTOR

## Objetivo

Reemplazar el salto a Google Forms por una encuesta nativa y reutilizable en
EDU-US. Debe permitir empezar sin cuenta tradicional, guardar respuestas
parciales y continuar en el mismo navegador. El popup seguirá configurándose
desde `site_campaigns`, pero su CTA abrirá la ruta de la encuesta.

## Encuesta propuesta

El correo es el primer paso y se solicita para guardar el avance y permitir el
contacto sobre EDU-MENTOR. La pantalla debe explicar el uso del dato antes de
continuar. El permiso para recibir futuras comunicaciones se presenta aparte y
es opcional. Con correo asociado no se debe describir la encuesta como anónima.

### Ocho preguntas principales

| Clave sugerida | Pregunta | Tipo / regla |
| --- | --- | --- |
| `age_range` | ¿En qué rango de edad estás? | Selección única; definir los rangos finales y el tratamiento de menores antes de publicar. |
| `study_area` | ¿Qué carrera o área de estudios cursas o cursaste? | Selección única con “Otra”. |
| `current_stage` | ¿Cuál es tu etapa académica o laboral actual? | Selección única. |
| `employment_barriers` | ¿Cuáles son tus principales dificultades al buscar empleo o prácticas? | Selección múltiple, máximo 3. |
| `readiness` | Del 1 al 5, ¿qué tan preparado/a te sientes para ingresar al mercado laboral? | Escala con extremos etiquetados. |
| `valuable_components` | ¿Qué componentes de EDU-MENTOR te resultarían más valiosos? | Selección múltiple, máximo 3; sustituye la cuadrícula de seis valoraciones. |
| `weekly_availability` | ¿Cuántas horas por semana podrías dedicar al programa? | Selección única. |
| `application_interest` | ¿Qué tan interesado/a estarías en postular a la primera edición? | Escala de “Nada interesado/a” a “Muy interesado/a”. |

### Opcionales

- `preferred_schedule`: horario preferido. Incluirlo si el equipo ya necesita
  decidir horarios de la primera cohorte.
- `expected_outcome`: ¿Qué te gustaría llevarte del programa? Respuesta abierta
  corta.

### Retirar del formulario actual

- Nombre obligatorio.
- Contacto mezclado en un solo campo de correo/WhatsApp.
- Pregunta sobre ansiedad o síndrome del impostor; es sensible y se solapa con
  una opción de dificultades. Si el equipo la necesita para diseñar un servicio
  específico, deberá justificarse y volver como pregunta voluntaria separada.
- Cuadrícula de seis filas de la pregunta actual 8.

Corregir el título del formulario y eliminar la nota interna sobre el perfil
objetivo. La duración objetivo es 2–3 minutos; comprobarla con personas antes de
publicar.

## Flujo de la persona encuestada

1. Abre la invitación desde el popup y llega a una ruta propia, por ejemplo
   `/encuesta/edu-mentor`.
2. Ve el propósito, el tiempo estimado, el aviso de privacidad y el campo de
   correo. El permiso de seguimiento futuro está separado y desmarcado por
   defecto.
3. Comienza en una sesión anónima de Supabase; no crea contraseña ni inicia
   sesión con Google.
4. Responde paso a paso. Cada respuesta se guarda automáticamente y la pantalla
   muestra `Guardando`, `Guardado` o `No se pudo guardar; reintentar`.
5. Si vuelve desde el mismo navegador, recupera el borrador y continúa. La
   sesión anónima no es recuperable si borra los datos del navegador o cambia
   de dispositivo; el acceso de recuperación por enlace de correo queda como
   fase posterior.
6. Al enviar, se validan las preguntas obligatorias, la respuesta pasa a
   `submitted` y se muestra una confirmación.

## Modelo de datos reutilizable

No reutilizar `site_campaign_leads` como almacenamiento de respuestas: esa
tabla solo representa contactos de campañas con consentimiento y no permite
guardar avances ni controlar su propietario.

- `surveys`: clave pública, versión, título, estado y ventana de publicación.
- `survey_questions`: clave estable, tipo, texto, opciones, obligatoriedad,
  límite de selección y orden. Publicar cambios incompatibles como una versión
  nueva.
- `survey_responses`: encuesta y versión, propietario `auth.uid()`, correo,
  permisos registrados, estado (`in_progress` o `submitted`), pregunta actual
  y marcas de tiempo.
- `survey_answers`: una respuesta JSON por pregunta, con clave única por
  respuesta y pregunta; soporta valores simples y listas para multiselección.

Las preguntas se renderizan por tipo desde configuración validada; las
respuestas usan claves estables, no posiciones del formulario. Al enviar, una
operación de servidor valida requeridos y opciones contra la versión publicada,
y marca la respuesta completa. El estado abandonado se puede derivar de la
antigüedad de `updated_at`; no hace falta marcarlo al cerrar la pestaña.

## Seguridad y privacidad

- Habilitar Auth anónimo en Supabase y proteger las filas mediante RLS basada en
  `auth.uid()`. La clave pública de Supabase nunca debe permitir listar todas
  las respuestas.
- Separar el consentimiento necesario para tratar y guardar la respuesta del
  permiso opcional para recibir futuras invitaciones.
- Guardar fecha, versión del aviso y valor de cada permiso.
- Definir antes del despliegue cuánto tiempo conservar borradores y respuestas
  completas, y cómo se atenderá una solicitud de eliminación.
- Definir si se admiten menores de 18 años. El público planteado es 18–30;
  aclarar la elegibilidad antes de recolectar correo.
- Revisar CAPTCHA o limitación de frecuencia para prevenir creación abusiva de
  sesiones y respuestas.
- No guardar respuestas completas ni correo en `localStorage`. La sesión de
  Supabase permite recuperar el borrador en ese navegador.
- Confirmar la finalidad y el aviso de privacidad con quien administra la
  política de EDU-US antes de producción.

## Checklist de desarrollo

### Fase 1 — Cerrar contenido y decisiones

- [ ] Aprobar las ocho preguntas principales y las dos opcionales.
- [ ] Confirmar rangos de edad y elegibilidad de menores.
- [ ] Aprobar el texto para pedir correo y los dos permisos separados.
- [ ] Definir plazos de conservación para borradores y respuestas enviadas.
- [ ] Aprobar título, introducción y confirmación final de la encuesta.

### Fase 2 — Base de datos y autorización

- [ ] Crear migración para encuestas versionadas, preguntas, respuestas y
      respuestas por pregunta.
- [ ] Habilitar RLS, revocar permisos públicos innecesarios y limitar acceso a
      la sesión propietaria.
- [ ] Añadir validación transaccional para completar la encuesta.
- [ ] Añadir mecanismo de limpieza por antigüedad según la política aprobada.
- [ ] Configurar Auth anónimo y controles contra abuso en el proyecto de
      Supabase de preview.

### Fase 3 — Interfaz reusable

- [ ] Crear ruta pública de encuesta y estados de carga/error/éxito.
- [ ] Implementar renderizadores de correo, selección única, multiselección,
      escala y texto abierto.
- [ ] Añadir avance, navegación atrás/continuar y validación accesible.
- [ ] Implementar guardado automático, reintento y recuperación del borrador.
- [ ] Añadir pantalla de finalización y prevención de doble envío.

### Fase 4 — Conectar campaña EDU-MENTOR

- [ ] Actualizar la campaña para que `cta_url` apunte a la ruta de encuesta.
- [ ] Asegurar que el popup no capture el correo antes de iniciar la encuesta;
      la encuesta será la fuente única de ese dato.
- [ ] Mantener fechas, rutas, imagen y textos del popup configurables desde
      `site_campaigns`.
- [ ] Verificar que campañas futuras puedan apuntar a otras encuestas/versiones.

### Fase 5 — Revisión antes de publicar

- [ ] Revisar que nadie pueda leer o modificar la respuesta de otra sesión.
- [ ] Comprobar guardado al avanzar, refrescar, cerrar y volver en el mismo
      navegador.
- [ ] Comprobar que las preguntas opcionales no bloqueen el envío.
- [ ] Probar validaciones de escalas y máximo de tres selecciones.
- [ ] Revisar vista móvil, teclado, lector de pantalla y mensajes de guardado.
- [ ] Confirmar que el correo y las respuestas no aparezcan en logs de cliente.
- [ ] Validar aviso de privacidad, consentimientos y texto de retención.
- [ ] Probar en Supabase preview antes de aplicar migración en producción.

### Fase 6 — Activación gradual

- [ ] Aplicar la migración en preview y cargar una versión inicial de EDU-MENTOR.
- [ ] Publicar la ruta y enlazarla desde la campaña de preview.
- [ ] Completar una respuesta de prueba y revisar el resultado desde acceso
      administrativo autorizado.
- [ ] Confirmar fecha de cierre y retención con el equipo responsable.
- [ ] Reemplazar el enlace a Google Forms solo después de aprobar el recorrido
      completo.

## Criterios de aceptación

- Se responde sin cuenta Google ni contraseña.
- El correo se explica antes de recopilarse y el seguimiento promocional es
  opcional.
- Cada respuesta contestada queda persistida aunque la persona abandone antes
  de enviar.
- La persona puede recuperar el borrador desde el mismo navegador.
- Las respuestas no se exponen a otras sesiones ni a visitantes anónimos.
- Un cambio futuro de encuesta puede publicarse como nueva versión sin
  reasignar respuestas históricas a preguntas distintas.
- Popup, imagen, enlace, fechas y ruta siguen configurados desde base de datos.
