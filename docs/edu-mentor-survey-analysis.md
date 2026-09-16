# EDU-MENTOR: análisis de encuesta y pop-up

## Hallazgos del formulario actual

- El formulario está publicado y puede responderse sin iniciar sesión.
- Google Forms no recopila automáticamente la cuenta de Google.
- Tiene 13 preguntas numeradas: 11 obligatorias y 2 opcionales (contacto y
  respuesta abierta final).
- La pregunta 8 es una cuadrícula de 6 filas por 4 opciones. Aunque aparece como
  una sola pregunta, exige seis decisiones y aumenta bastante la fricción.
- El título visible, “Inscripción a un evento”, no coincide con el objetivo real
  de investigación y validación de EDU-MENTOR.
- La descripción de la sección 1 muestra una nota interna sobre el “perfil
  target”; no debería aparecer a las personas encuestadas.
- La pregunta 12 mide interés, pero sus extremos dicen “Nada seguro/a” y
  “Totalmente preparado/a”. Deben decir “Nada interesado/a” y “Muy
  interesado/a”.
- Pedir nombres como dato obligatorio contradice parcialmente la promesa de
  confidencialidad y reduce la percepción de anonimato.
- El campo único “Correo electrónico / WhatsApp” mezcla dos tipos de dato y
  complica la validación y el contacto posterior.

## Versión recomendada (2–3 minutos)

Mantener como obligatorias:

1. Rango de edad.
2. Carrera o área de estudios.
3. Etapa académica/laboral.
4. Hasta tres principales dificultades de empleabilidad.
5. Nivel de preparación percibido (1–5).
6. Hasta tres componentes más valiosos del programa.
7. Horas semanales disponibles.
8. Interés en postular a la Oleada 1 (1–5).

Dejar opcionales:

- Horario preferido, solo si la fecha de la primera cohorte ya está cerca.
- Comentario abierto sobre el resultado esperado.

Eliminar o trasladar:

- Nombre y contacto: el pop-up ya captura correo de forma opcional y con
  consentimiento.
- La pregunta sobre ansiedad/síndrome del impostor: se solapa con la opción de
  ansiedad de la pregunta de dificultades. Si se necesita para diseñar apoyo
  psicológico, mantenerla como opcional por tratar un tema sensible.

## Decisiones de implementación

- El pop-up se muestra en el home después de 1.8 segundos.
- No requiere autenticación.
- El correo es opcional; si se ingresa, el consentimiento es obligatorio.
- Cerrar el pop-up lo oculta durante siete días. Abrir la encuesta lo desactiva
  en ese navegador.
- Solo puede estar activa una campaña automática en el home. La variable
  VITE_HOME_PROMO_CAMPAIGN acepta edu-mentor, event u off.
- Los correos se guardan en edu_mentor_interest. La tabla permite inserción
  anónima validada, pero no lectura pública.
- El formulario se abre en una pestaña nueva y sigue siendo la fuente de las
  respuestas de investigación; Supabase guarda únicamente los contactos con
  consentimiento.

## Despliegue

1. Aplicar la migración 20260916_create_edu_mentor_interest.sql al proyecto de
   Supabase de desarrollo.
2. Confirmar que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY ya estén
   configuradas en el entorno de preview.
3. Definir VITE_HOME_PROMO_CAMPAIGN=edu-mentor.
4. Probar envío con correo, sin correo, cierre, reapertura a los siete días y
   responsive móvil.
5. Aplicar los cambios de contenido al Google Form después de aprobar la versión
   reducida.
