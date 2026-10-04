# Sprint propuesto · EDU-MENTOR / invitación y encuesta

**Ventana sugerida:** 5–16 de octubre de 2026 (dos semanas; confirmar capacidad y fecha en la reunión).

**Estado:** ejecución técnica local en curso; contenido y publicación aún no aprobados.

**Rama de landing:** `feat/edu-mentor-survey-popup`. No hacer merge a `master` desde este sprint sin validación de fase.

**Objetivo:** dejar la invitación y la encuesta nativa aprobadas y probadas de extremo a extremo en **preview**, con una entrega verificable para quien administra la landing. El portal EDU-MENTOR mantiene su propio gate y repositorio.

**Secuencia sugerida:** semana 1, decisiones A0 e implementación A1/A2 en mock; preparar preview en paralelo. Semana 2, integración y seguridad A3, cierre A4 y reporte separado del carril B. A3 necesita una configuración de preguntas congelada; A4 necesita evidencia A0–A3.

## Responsabilidades propuestas

El organigrama de Innovación Estratégica & Digital (v1.0, 26/09/2026) ubica landing y EDU-MENTOR en Tecnología · Producto. Estos son **responsables propuestos para este sprint**, no asignaciones nuevas ni aprobaciones implícitas:

| Decisión / entrega | Responsable propuesto | Validación / apoyo |
| --- | --- | --- |
| Alcance, contenido y prioridades de Producto | Celia Álvarez (liderazgo de Producto) | Bruno (coordinación de Tecnología), Kenyi (Comunidad) |
| Implementación de landing, encuesta y migración | Frente de Producto / persona técnica asignada por Celia | Bruno para bloqueos y capacidad; Anthony para revisión de primeros entregables si corresponde |
| Texto de invitación y difusión | Kenyi / Comunidad | Celia para coherencia con el producto |
| Privacidad, elegibilidad, fecha de cierre y paso de fase | Nancy Paico / Dirección, con las áreas validadoras pertinentes | Celia presenta evidencia de validación |
| Merge y despliegue de landing | Encargado/a de la landing, por confirmar | Después de aprobación de fase; fuera de este sprint hasta que se nombre |

La mentoría **interna** del organigrama acompaña a voluntarios; no equivale al rol de mentor del programa EDU-MENTOR ni cambia automáticamente los permisos del portal.

## Línea de base comprobada al 03/10/2026

- [x] Existe ruta reutilizable `/encuesta/:surveyKey`, modal de campañas y flujo de guardado por pregunta en la rama.
- [x] Hay migraciones preparadas para campañas, encuestas versionadas, RLS y retención; **preparadas no significa aplicadas**.
- [x] Existe modo mock local para la encuesta; no envía respuestas a Supabase.
- [x] `npm run build`, ESLint de los cuatro archivos principales de la función y `git diff --check` pasan.
- [x] ESLint global sin errores. Se retiraron ocho referencias sin uso; quedan dos advertencias preexistentes.
- [ ] Verificación real de migraciones, Auth anónimo, RLS y respuestas parciales en Supabase preview.
- [ ] Contenido de la nueva versión aprobado por Producto/Comunidad.
- [ ] Rama limpia, commits revisados y entrega lista para merge.

## Carril A · Landing y encuesta (objetivo del sprint)

### A0. Cerrar decisiones de contenido y datos — gate antes de publicar

- [ ] Celia y Comunidad aprueban el objetivo de la encuesta, público elegible, texto de correo, privacidad y consentimiento opcional de novedades. No llamarla “anónima” si recoge correo.
- [ ] Aprobar esta reducción: **mantener** la pregunta de horas semanales; **retirar** el horario preferido; **agregar** “Cuando tienes dudas sobre tu futuro profesional o búsqueda laboral, ¿a quién recurres principalmente?” (máximo dos); **integrar** “¿qué haría valiosa una mentoría?” en `valuable_components`, sin añadir una pregunta redundante.
- [ ] Aprobar opciones y límites de la nueva pregunta: familia/amigos, docentes, profesionales del sector, servicios de la institución, recursos web/IA, nadie y otra opción. “Nadie” debe ser excluyente; “Otra” pide texto libre con límite explícito.
- [ ] Acordar si “acompañamiento emocional con psicólogos” es una prestación confirmada. Si aún es propuesta, redactarla como **opción a evaluar**, nunca como promesa del servicio.
- [ ] Aprobar una explicación breve de EDU-MENTOR (fases, mentor/profesional y apoyo psicológico solo si está confirmado) dentro del flujo existente; verificar que no convierta la encuesta en una pantalla extra innecesaria.
- [ ] Confirmar ventana `starts_at`–`ends_at` de campaña y encuesta, criterio de cierre, edad mínima, plazo de conservación y responsable de solicitudes de eliminación.

**Evidencia de A0:** acta o comentario de aprobación con copy final, lista de preguntas y opciones, decisiones de privacidad y fechas. Hasta entonces, el copy actual es provisional.

### A1. Implementar la versión acordada en configuración y mock

- [ ] Confirmar primero en preview si la versión 1 fue aplicada y tiene respuestas. Si **no** fue desplegada, ajustar su semilla inicial; si **sí** tiene respuestas, publicar versión 2 y conservar la versión histórica. No editar preguntas de una versión con respuestas.
- [x] Preparar semilla SQL v2 en **draft** y `devSurveyMockService.js` con el mismo orden, claves estables, opciones y reglas. Se mantiene `weekly_availability` y se retira `preferred_schedule` solo de v2. La publicación sigue pendiente de A0/A3.
- [x] Implementar `{selected, other_text}` para “Otra” y validación de longitud, límites, duplicados y exclusividad en frontend y `save_survey_answer`. Probado en PostgreSQL sintético; falta Supabase preview.
- [x] Mantener `expected_outcome` opcional en v2 y verificar que no bloquea el envío mock.
- [x] La introducción mock dice expresamente que usa datos ficticios y no envía nada a Supabase. El banner adicional permanece oculto según la decisión anterior del equipo para capturas; no eliminar este aviso del texto.

**Evidencia de A1:** `npm run test:survey` (5/5), `supabase/tests/assert_edu_mentor_survey_v2.sql` en PostgreSQL local y recorrido mock en navegador (10 preguntas, reanudación, envío sin opcional). La migración v2 es aditiva y no alteró las diez preguntas v1 en la prueba.

Las instrucciones reproducibles y el orden de despliegue están en [qa-edu-mentor-survey.md](qa-edu-mentor-survey.md).

### A2. Asegurar la invitación reutilizable

- [ ] Revisar que `site_campaigns` controle ruta, prioridad, CTA, imagen/posición, textos, retraso, cierre temporal y ventana de visibilidad, con fechas aprobadas (no solo `NOW() + 30 days` sin decisión).
- [x] Confirmar en el preview local que el CTA de EDU-MENTOR conduce a la encuesta propia y que **solo la encuesta** solicita el correo; sin captura duplicada en el pop-up.
- [ ] Probar campaña futura con otra `campaign_key` y `cta_url` sin cambiar el componente; revisar fallback de imagen, móvil, teclado, Escape y foco.
- [ ] Verificar que al terminar `ends_at` la campaña desaparece y que cerrar el modal respeta `dismiss_for_days`.

**Evidencia de A2:** capturas o prueba automatizada con campaña activa, expirada y segunda campaña; registro de la configuración usada.

### A3. Integración en Supabase **preview** y seguridad

- [ ] Identificar un proyecto de preview separado de producción y documentar URL/entorno sin guardar llaves secretas en Git.
- [ ] Aplicar migraciones en orden, habilitar Auth anónimo y confirmar que el esquema y funciones existen. No aplicar SQL a producción en esta fase.
- [ ] Probar dos sesiones independientes: A no puede leer ni alterar respuestas de B; visitante sin sesión no puede listar correos/respuestas; solo el propietario puede guardar su borrador.
- [ ] Probar respuesta parcial (por ejemplo, cinco de diez), refresco y regreso en el **mismo navegador**; confirmar persistencia en BD. Otro navegador/dispositivo no debe prometer recuperación por correo en este corte.
- [ ] Probar envío final, doble clic, preguntas requeridas/opcionales, encuesta cerrada y error de red con reintento. Revisar que no aparezcan correos/respuestas en logs de cliente.
- [ ] Elegir y probar control antiabuso antes de cualquier publicación abierta.
- [ ] Probar retención y limpieza con datos sintéticos y documentar cómo se atiende la eliminación de datos.

**Evidencia de A3:** matriz de casos con resultado, IDs sintéticos, captura de esquema/políticas y registro de fallos corregidos. No basta que el mock funcione.

**Estado local:** la configuración `.env.local` actual apunta al proyecto de Supabase identificado como producción en el dashboard previo. No se aplicaron migraciones allí. Supabase local no terminó de iniciar porque el registro de imágenes devolvió un límite de descargas; los contenedores parciales quedaron detenidos. La prueba PostgreSQL aislada valida SQL y ownership del RPC, **no** Auth ni RLS reales.

### A4. Cierre y entrega al encargado de landing

- [ ] Repetir lint del alcance, build, pruebas funcionales y revisión móvil/accesibilidad. El lint global ya no tiene errores (quedan dos advertencias preexistentes); falta la revisión integral en preview.
- [ ] Revisar el diff completo: secretos, cambios ajenos, migraciones repetibles, fecha de expiración, copy y estado de la rama. Crear commits acotados sin mezclar trabajo de terceros.
- [ ] Demostración de extremo a extremo en preview: pop-up → correo/consentimientos → cinco respuestas → abandono → reanudación → envío → comprobación autorizada en BD.
- [ ] Obtener aprobación de Celia/áreas validadoras y decisión de paso de fase de Dirección. Entregar URL de preview, checklist firmado, comandos/migraciones y riesgos residuales al encargado de landing.
- [ ] **No hacer merge ni activar producción automáticamente.** El encargado designado ejecuta ese paso después de la aprobación.

**Definición de terminado del carril A:** todos los ítems A0–A4 verificados con evidencia, sin datos mock presentados como reales, y rama lista para revisión/merge; producción sigue fuera hasta autorización.

## Carril B · Portal EDU-MENTOR — **stand-by por instrucción del equipo**

El portal tiene su propio repositorio y `docs/07-checklist-master.md` como fuente de verdad. **No ejecutar ni cambiar este carril durante el sprint actual.** Los puntos siguientes son recordatorios para cuando el equipo lo reactive, no tareas asignadas ahora:

- Revalidar web, API, PostgreSQL y Redis; un `200` de la web no prueba que la API esté operativa.
- Cerrar Gate 1 (typecheck/CI) antes del vertical Agenda y Gate 2.
- Cerrar decisiones de Producto, UAT, notificaciones y almacenamiento en ese repositorio.
- Mantener el texto público de la encuesta alineado con lo que realmente ofrecerá el piloto.

**Evidencia del carril B:** actualización del checklist maestro en el repositorio del portal con pruebas reproducibles y decisiones aprobadas. La mentoría interna de innovación se gestiona por su organigrama, no mediante cambios de RBAC improvisados.

## Riesgos y decisiones para la reunión de inicio

1. ¿Quién aprueba el cuestionario final, la privacidad y las fechas? Sin esa decisión A0 bloquea publicación, pero no impide trabajar en mock y validadores.
2. ¿La versión 1 existe en algún entorno con respuestas? Define si se edita la semilla inicial o se publica versión 2.
3. ¿Qué proyecto Supabase será **preview**? El proyecto de producción no debe usarse para pruebas sintéticas.
4. ¿Qué afirmaciones sobre duración, acompañamiento y psicólogos están confirmadas? El texto público debe corresponder al piloto real.
5. ¿Quién es el encargado de la landing que recibirá la rama y el paquete de validación?

## Primer corte de seguimiento

En cada reunión breve de célula: actualizar A0–A4 con **pendiente / en curso / verificado / bloqueado**, adjuntar evidencia y anotar responsable y fecha. No marcar una casilla solo porque existe código: la casilla describe el resultado probado.
