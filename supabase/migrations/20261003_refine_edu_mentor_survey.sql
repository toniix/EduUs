-- Expand the reusable question model without changing answers attached to v1.
-- This migration leaves EDU-MENTOR v2 in draft. Publish it only after content
-- approval and preview testing; see docs/sprint-edu-mentor-oct-2026.md.
ALTER TABLE public.survey_questions
  ADD COLUMN IF NOT EXISTS other_option TEXT,
  ADD COLUMN IF NOT EXISTS other_text_max_length INTEGER NOT NULL DEFAULT 160,
  ADD COLUMN IF NOT EXISTS exclusive_options TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'survey_questions_other_length_positive'
      AND conrelid = 'public.survey_questions'::REGCLASS
  ) THEN
    ALTER TABLE public.survey_questions
      ADD CONSTRAINT survey_questions_other_length_positive
      CHECK (other_text_max_length BETWEEN 1 AND 500);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'survey_questions_other_is_choice'
      AND conrelid = 'public.survey_questions'::REGCLASS
  ) THEN
    ALTER TABLE public.survey_questions
      ADD CONSTRAINT survey_questions_other_is_choice
      CHECK (other_option IS NULL OR question_type IN ('single_choice', 'multi_choice'));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.save_survey_answer(
  p_response_id UUID,
  p_question_key TEXT,
  p_answer JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_question public.survey_questions%ROWTYPE;
  v_survey_id UUID;
  v_selected JSONB;
  v_selected_count INTEGER;
  v_valid_count INTEGER;
  v_number NUMERIC;
  v_other_text TEXT;
BEGIN
  SELECT response.survey_id INTO v_survey_id
  FROM public.survey_responses response
  WHERE response.id = p_response_id
    AND response.owner_user_id = (SELECT auth.uid())
    AND response.status = 'in_progress';

  IF v_survey_id IS NULL THEN
    RAISE EXCEPTION 'Survey response is unavailable';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.surveys survey
    WHERE survey.id = v_survey_id
      AND survey.status = 'published'
      AND NOW() >= survey.starts_at
      AND (survey.ends_at IS NULL OR NOW() < survey.ends_at)
  ) THEN
    RAISE EXCEPTION 'Survey is closed';
  END IF;

  SELECT question.* INTO v_question
  FROM public.survey_questions question
  WHERE question.survey_id = v_survey_id
    AND question.question_key = p_question_key;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Survey question is unavailable';
  END IF;

  IF p_answer IS NULL OR p_answer = 'null'::JSONB THEN
    DELETE FROM public.survey_answers answer
    WHERE answer.response_id = p_response_id
      AND answer.question_id = v_question.id;
    UPDATE public.survey_responses
    SET current_question_key = p_question_key
    WHERE id = p_response_id;
    RETURN;
  END IF;

  IF v_question.question_type IN ('single_choice', 'multi_choice') THEN
    IF jsonb_typeof(p_answer) = 'object' THEN
      IF v_question.other_option IS NULL
        OR p_answer - 'selected' - 'other_text' <> '{}'::JSONB THEN
        RAISE EXCEPTION 'Answer contains unsupported fields';
      END IF;
      v_selected := p_answer -> 'selected';
    ELSE
      v_selected := p_answer;
    END IF;

    IF v_question.question_type = 'single_choice' THEN
      IF jsonb_typeof(v_selected) <> 'string'
        OR NOT (v_question.options ? (v_selected #>> '{}')) THEN
        RAISE EXCEPTION 'Answer is not an available option';
      END IF;
    ELSE
      IF jsonb_typeof(v_selected) <> 'array' THEN
        RAISE EXCEPTION 'Answer must be a valid list of options';
      END IF;
      IF jsonb_array_length(v_selected) > COALESCE(v_question.max_selections, 99) THEN
        RAISE EXCEPTION 'Answer has too many selected options';
      END IF;

      SELECT COUNT(*), COUNT(DISTINCT item.value)
        INTO v_selected_count, v_valid_count
      FROM jsonb_array_elements(v_selected) AS item(value)
      WHERE jsonb_typeof(item.value) = 'string'
        AND v_question.options ? (item.value #>> '{}');

      IF v_selected_count <> jsonb_array_length(v_selected)
        OR v_valid_count <> v_selected_count THEN
        RAISE EXCEPTION 'Answer contains invalid or repeated options';
      END IF;

      IF jsonb_array_length(v_selected) > 1 AND EXISTS (
        SELECT 1 FROM unnest(v_question.exclusive_options) AS exclusive_choice(option)
        WHERE v_selected ? exclusive_choice.option
      ) THEN
        RAISE EXCEPTION 'Exclusive option cannot be combined';
      END IF;
    END IF;

    IF v_question.other_option IS NOT NULL THEN
      IF (
        (v_question.question_type = 'single_choice'
          AND v_selected #>> '{}' = v_question.other_option)
        OR (v_question.question_type = 'multi_choice'
          AND v_selected ? v_question.other_option)
      ) THEN
        IF jsonb_typeof(p_answer) <> 'object'
          OR jsonb_typeof(p_answer -> 'other_text') <> 'string' THEN
          RAISE EXCEPTION 'Other option requires text';
        END IF;
        v_other_text := btrim(p_answer ->> 'other_text');
        IF v_other_text = ''
          OR char_length(v_other_text) > v_question.other_text_max_length THEN
          RAISE EXCEPTION 'Other option text is missing or too long';
        END IF;
      ELSIF jsonb_typeof(p_answer) = 'object'
        AND COALESCE(btrim(p_answer ->> 'other_text'), '') <> '' THEN
        RAISE EXCEPTION 'Other text requires the other option';
      END IF;
    END IF;
  ELSIF v_question.question_type = 'scale' THEN
    IF jsonb_typeof(p_answer) <> 'number' THEN
      RAISE EXCEPTION 'Answer must be a number';
    END IF;
    v_number := (p_answer #>> '{}')::NUMERIC;
    IF v_number <> trunc(v_number)
      OR v_number < v_question.scale_min
      OR v_number > v_question.scale_max THEN
      RAISE EXCEPTION 'Answer is outside the permitted scale';
    END IF;
  ELSIF v_question.question_type = 'long_text' THEN
    IF jsonb_typeof(p_answer) <> 'string'
      OR char_length(p_answer #>> '{}') > v_question.text_max_length THEN
      RAISE EXCEPTION 'Answer must be text within the permitted length';
    END IF;
  END IF;

  INSERT INTO public.survey_answers (response_id, question_id, answer)
  VALUES (p_response_id, v_question.id, p_answer)
  ON CONFLICT (response_id, question_id)
  DO UPDATE SET answer = EXCLUDED.answer, updated_at = NOW();

  UPDATE public.survey_responses
  SET current_question_key = p_question_key
  WHERE id = p_response_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_survey_response(p_response_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_response public.survey_responses%ROWTYPE;
BEGIN
  SELECT response.* INTO v_response
  FROM public.survey_responses response
  WHERE response.id = p_response_id
    AND response.owner_user_id = (SELECT auth.uid())
    AND response.status = 'in_progress'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Survey response is unavailable';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.surveys survey
    WHERE survey.id = v_response.survey_id
      AND survey.status = 'published'
      AND NOW() >= survey.starts_at
      AND (survey.ends_at IS NULL OR NOW() < survey.ends_at)
  ) THEN
    RAISE EXCEPTION 'Survey is closed';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.survey_questions question
    LEFT JOIN public.survey_answers answer
      ON answer.response_id = p_response_id
      AND answer.question_id = question.id
    WHERE question.survey_id = v_response.survey_id
      AND question.required = TRUE
      AND (
        answer.response_id IS NULL
        OR CASE question.question_type
          WHEN 'single_choice' THEN
            COALESCE(
              CASE WHEN jsonb_typeof(answer.answer) = 'object'
                THEN answer.answer ->> 'selected'
                ELSE answer.answer #>> '{}'
              END, ''
            ) = ''
          WHEN 'multi_choice' THEN
            jsonb_array_length(
              CASE WHEN jsonb_typeof(answer.answer) = 'object'
                THEN answer.answer -> 'selected'
                ELSE answer.answer
              END
            ) = 0
          WHEN 'scale' THEN jsonb_typeof(answer.answer) <> 'number'
          WHEN 'long_text' THEN btrim(COALESCE(answer.answer #>> '{}', '')) = ''
          ELSE TRUE
        END
      )
  ) THEN
    RAISE EXCEPTION 'Please answer all required questions';
  END IF;

  UPDATE public.survey_responses
  SET status = 'submitted', submitted_at = NOW()
  WHERE id = p_response_id;
END;
$$;

-- A separate draft keeps v1 responses and the live campaign untouched.
INSERT INTO public.surveys (
  survey_key, version, title, intro_text, estimated_minutes, status,
  starts_at, ends_at
)
SELECT
  'edu-mentor',
  2,
  'Ayúdanos a diseñar EDU-MENTOR',
  'Estamos diseñando EDU-MENTOR para acompañar a jóvenes que buscan prácticas o empleo. La propuesta combina orientación de profesionales, ejercicios prácticos y seguimiento personalizado; queremos saber qué partes realmente te ayudarían.' || E'\n\n' ||
  'Cuéntanos tu experiencia en unos 3 minutos. Pediremos tu correo para guardar el avance; la encuesta no es anónima.',
  3,
  'draft',
  prior.starts_at,
  prior.ends_at
FROM public.surveys prior
WHERE prior.survey_key = 'edu-mentor' AND prior.version = 1
ON CONFLICT (survey_key, version) DO NOTHING;

-- Copy unchanged questions, preserving the original version and its answers.
INSERT INTO public.survey_questions (
  survey_id, question_key, prompt, helper_text, question_type, required,
  options, max_selections, other_option, other_text_max_length,
  exclusive_options, scale_min, scale_max, scale_min_label,
  scale_max_label, text_max_length, position
)
SELECT newer.id, older.question_key, older.prompt, older.helper_text,
       older.question_type, older.required, older.options, older.max_selections,
       CASE WHEN older.question_key = 'employment_barriers' THEN 'Otra dificultad' END,
       160, ARRAY[]::TEXT[], older.scale_min, older.scale_max,
       older.scale_min_label, older.scale_max_label, older.text_max_length,
       CASE older.question_key
         WHEN 'readiness' THEN 6
         WHEN 'weekly_availability' THEN 8
         WHEN 'application_interest' THEN 9
         WHEN 'expected_outcome' THEN 10
         ELSE older.position
       END
FROM public.surveys newer
JOIN public.surveys prior
  ON prior.survey_key = newer.survey_key AND prior.version = 1
JOIN public.survey_questions older ON older.survey_id = prior.id
WHERE newer.survey_key = 'edu-mentor'
  AND newer.version = 2
  AND older.question_key IN (
    'age_range', 'study_area', 'current_stage', 'employment_barriers',
    'readiness', 'weekly_availability', 'application_interest', 'expected_outcome'
  )
ON CONFLICT (survey_id, question_key) DO NOTHING;

INSERT INTO public.survey_questions (
  survey_id, question_key, prompt, helper_text, question_type, required,
  options, max_selections, other_option, other_text_max_length,
  exclusive_options, position
)
SELECT survey.id, question.question_key, question.prompt, question.helper_text,
       'multi_choice', TRUE, question.options, question.max_selections,
       question.other_option, 160, question.exclusive_options, question.position
FROM public.surveys survey
CROSS JOIN (VALUES
  (
    'support_network',
    'Cuando tienes dudas sobre tu futuro profesional o búsqueda laboral, ¿a quién recurres principalmente?',
    'Selecciona hasta dos. Si no cuentas con alguien, elige solo esa opción.',
    '["Familia o amistades", "Docentes o tutores", "Profesionales de mi sector", "Servicios de orientación de mi institución", "Recursos en internet o herramientas de IA", "No tengo a quién recurrir", "Otra persona o recurso"]'::JSONB,
    2,
    'Otra persona o recurso',
    ARRAY['No tengo a quién recurrir']::TEXT[],
    5
  ),
  (
    'valuable_components',
    '¿Qué haría que una mentoría como EDU-MENTOR realmente valga la pena para ti?',
    'Selecciona hasta tres.',
    '["Mentor o mentora con experiencia en mi sector", "Feedback práctico sobre CV y entrevistas", "Objetivos claros y seguimiento personalizado", "Ejercicios y casos reales", "Acceso a contactos y oportunidades de mi sector", "Apoyo para definir mi camino profesional", "Orientación emocional con psicólogos, si se incorpora al programa", "Otra forma de apoyo"]'::JSONB,
    3,
    'Otra forma de apoyo',
    ARRAY[]::TEXT[],
    7
  )
) AS question(
  question_key, prompt, helper_text, options, max_selections,
  other_option, exclusive_options, position
)
WHERE survey.survey_key = 'edu-mentor' AND survey.version = 2
ON CONFLICT (survey_id, question_key) DO NOTHING;

COMMENT ON COLUMN public.survey_questions.other_option IS
  'Option that requires an accompanying other_text answer.';
COMMENT ON COLUMN public.survey_questions.exclusive_options IS
  'Options that cannot be combined with any other selection.';
