# Verificación y despliegue controlado · encuesta EDU-MENTOR

Este corte está preparado **en la rama**, no publicado. El portal EDU-MENTOR queda en stand-by. La encuesta v2 se crea como `draft`; no cambiar ese estado ni apuntar el pop-up a ella antes de aprobar contenido, fechas y privacidad.

## Prueba local reproducible

Desde la raíz de `EduUs`:

```sh
npm run test:survey
npm run lint
npm run build
git diff --check
npm run dev
```

Abrir `http://127.0.0.1:5173/encuesta/edu-mentor?mockSurvey=edu-mentor&resetMock=1` para una sesión ficticia nueva. En desarrollo, `mockSurvey` usa `sessionStorage` y no contacta Supabase. Para ver la invitación, abrir `http://127.0.0.1:5173/?previewCampaign=edu-mentor`; el CTA abre la encuesta mock. El correo y las respuestas de esa prueba deben ser ficticios.

Comprobar: campos obligatorios, “Otra” con texto y límite, opción “No tengo a quién recurrir” excluyente, máximo de selecciones, refresco y reanudación en la misma pestaña, pregunta final opcional y envío. El banner extra de demo se mantiene oculto para las capturas del equipo, pero la introducción de la encuesta mock avisa que nada se envía a Supabase.

## SQL aislado

La prueba usa `supabase/tests/refine_edu_mentor_survey.sql` como esquema mínimo sintético, después aplica `supabase/migrations/20261003_refine_edu_mentor_survey.sql` y ejecuta `supabase/tests/assert_edu_mentor_survey_v2.sql`. Validar también una segunda aplicación de la migración para comprobar idempotencia. Se verificó en PostgreSQL 16 local. Esta prueba **no reemplaza** Auth anónimo, RLS ni políticas reales de Supabase.

## Orden para preview (solo después de identificar un proyecto separado)

1. Confirmar que el destino es **preview**, nunca el proyecto de producción de `.env.local`. No versionar credenciales ni pegar llaves privilegiadas en el frontend.
2. Comprobar qué migraciones están aplicadas. Ejecutar primero `20260916_create_site_campaigns.sql`, luego `20260925_create_reusable_surveys.sql`, y finalmente `20261003_refine_edu_mentor_survey.sql`, solo si faltan. **Ojo:** la primera semilla publica por 30 días la campaña con CTA a Google Forms y la segunda cambia su CTA a la encuesta nativa, además de publicar v1 si la ventana está vigente. Revisar esa activación y las fechas antes de ejecutar incluso en preview. La consulta del frontend a `survey_questions` requiere las nuevas columnas de la última migración: desplegar **base de datos antes que frontend**.
3. Verificar Auth anónimo, RLS y RPC con dos sesiones y respuestas sintéticas. Repetir abandono, refresco, envío y expiración. No usar correos reales en QA.
4. Obtener aprobación de la pregunta y copy finales, consentimiento, retención y fechas. La v2 copia la ventana temporal de v1; actualizar explícitamente `starts_at`/`ends_at` antes de publicar si ya pasó o no coincide con la campaña.
5. Para el lanzamiento, en una transacción revisada: archivar v1, publicar v2 y confirmar que la campaña activa usa el CTA interno `/encuesta/edu-mentor`, con ventana y estado aprobados. La migración de v1 intenta cambiar el CTA, pero no asumir el estado real de la base: verificarlo antes de confirmar la transacción.
6. Presentar evidencia de preview al encargado de la landing; merge y producción quedan bajo su decisión y el gate de Dirección.

La sesión anónima de Supabase permite reanudar en el **mismo navegador**. El correo identifica el contacto, pero no autentica por sí solo ni permite recuperar respuestas desde otro navegador; no prometer esa recuperación en la interfaz o difusión.
