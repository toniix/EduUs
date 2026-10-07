CREATE TABLE IF NOT EXISTS public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_key TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 3,
  draft_retention_days INTEGER NOT NULL DEFAULT 90,
  submitted_retention_days INTEGER NOT NULL DEFAULT 1825,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT surveys_version_positive CHECK (version > 0),
  CONSTRAINT surveys_estimated_minutes_positive CHECK (estimated_minutes > 0),
  CONSTRAINT surveys_draft_retention_range
    CHECK (draft_retention_days BETWEEN 1 AND 365),
  CONSTRAINT surveys_submitted_retention_range
    CHECK (submitted_retention_days BETWEEN 1 AND 1825),
  CONSTRAINT surveys_valid_window CHECK (ends_at IS NULL OR ends_at > starts_at),
  UNIQUE (survey_key, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS surveys_one_published_version
  ON public.surveys (survey_key)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS surveys_public_lookup
  ON public.surveys (survey_key, status, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS public.survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE RESTRICT,
  question_key TEXT NOT NULL,
  prompt TEXT NOT NULL,
  helper_text TEXT,
  question_type TEXT NOT NULL
    CHECK (question_type IN ('single_choice', 'multi_choice', 'scale', 'long_text')),
  required BOOLEAN NOT NULL DEFAULT TRUE,
  options JSONB NOT NULL DEFAULT '[]'::JSONB
    CHECK (jsonb_typeof(options) = 'array'),
  max_selections INTEGER,
  scale_min INTEGER,
  scale_max INTEGER,
  scale_min_label TEXT,
  scale_max_label TEXT,
  text_max_length INTEGER NOT NULL DEFAULT 1000,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT survey_questions_max_selections_positive
    CHECK (max_selections IS NULL OR max_selections > 0),
  CONSTRAINT survey_questions_valid_scale
    CHECK (
      question_type <> 'scale'
      OR (scale_min IS NOT NULL AND scale_max IS NOT NULL AND scale_max >= scale_min)
    ),
  CONSTRAINT survey_questions_text_length_positive CHECK (text_max_length > 0),
  UNIQUE (survey_id, question_key),
  UNIQUE (survey_id, position)
);

CREATE INDEX IF NOT EXISTS survey_questions_order_lookup
  ON public.survey_questions (survey_id, position);

CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE RESTRICT,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  adult_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  consent_research BOOLEAN NOT NULL DEFAULT FALSE,
  consent_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  consent_text_version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'submitted')),
  current_question_key TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  CONSTRAINT survey_responses_email_length CHECK (char_length(email) <= 320),
  CONSTRAINT survey_responses_email_format CHECK (
    email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  CONSTRAINT survey_responses_research_consent CHECK (consent_research = TRUE),
  CONSTRAINT survey_responses_adult_confirmed CHECK (adult_confirmed = TRUE),
  CONSTRAINT survey_responses_submission_timestamp CHECK (
    (status = 'in_progress' AND submitted_at IS NULL)
    OR (status = 'submitted' AND submitted_at IS NOT NULL)
  ),
  UNIQUE (survey_id, owner_user_id)
);

CREATE INDEX IF NOT EXISTS survey_responses_admin_lookup
  ON public.survey_responses (survey_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.survey_answers (
  response_id UUID NOT NULL
    REFERENCES public.survey_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL
    REFERENCES public.survey_questions(id) ON DELETE RESTRICT,
  answer JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (response_id, question_id)
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_answers ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.surveys FROM anon, authenticated;
REVOKE ALL ON TABLE public.survey_questions FROM anon, authenticated;
REVOKE ALL ON TABLE public.survey_responses FROM anon, authenticated;
REVOKE ALL ON TABLE public.survey_answers FROM anon, authenticated;

GRANT SELECT ON TABLE public.surveys, public.survey_questions TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.survey_responses TO authenticated;
GRANT UPDATE (email, consent_marketing, current_question_key)
  ON TABLE public.survey_responses TO authenticated;
GRANT SELECT ON TABLE public.survey_answers TO authenticated;

DROP POLICY IF EXISTS "Visitors can read published surveys" ON public.surveys;
CREATE POLICY "Visitors can read published surveys"
  ON public.surveys FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND NOW() >= starts_at
    AND (ends_at IS NULL OR NOW() < ends_at)
  );

DROP POLICY IF EXISTS "Visitors can read published survey questions"
  ON public.survey_questions;
CREATE POLICY "Visitors can read published survey questions"
  ON public.survey_questions FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.surveys survey
      WHERE survey.id = survey_id
        AND survey.status = 'published'
        AND NOW() >= survey.starts_at
        AND (survey.ends_at IS NULL OR NOW() < survey.ends_at)
    )
  );

DROP POLICY IF EXISTS "Respondents can read their own survey response"
  ON public.survey_responses;
CREATE POLICY "Respondents can read their own survey response"
  ON public.survey_responses FOR SELECT TO authenticated
  USING (owner_user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Respondents can start their own survey response"
  ON public.survey_responses;
CREATE POLICY "Respondents can start their own survey response"
  ON public.survey_responses FOR INSERT TO authenticated
  WITH CHECK (
    owner_user_id = (SELECT auth.uid())
    AND status = 'in_progress'
    AND consent_research = TRUE
    AND EXISTS (
      SELECT 1
      FROM public.surveys survey
      WHERE survey.id = survey_id
        AND survey.status = 'published'
        AND NOW() >= survey.starts_at
        AND (survey.ends_at IS NULL OR NOW() < survey.ends_at)
    )
  );

DROP POLICY IF EXISTS "Respondents can update their own draft response"
  ON public.survey_responses;
CREATE POLICY "Respondents can update their own draft response"
  ON public.survey_responses FOR UPDATE TO authenticated
  USING (
    owner_user_id = (SELECT auth.uid())
    AND status = 'in_progress'
  )
  WITH CHECK (
    owner_user_id = (SELECT auth.uid())
    AND status = 'in_progress'
  );

DROP POLICY IF EXISTS "Respondents can read answers to their own response"
  ON public.survey_answers;
CREATE POLICY "Respondents can read answers to their own response"
  ON public.survey_answers FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.survey_responses response
      WHERE response.id = response_id
        AND response.owner_user_id = (SELECT auth.uid())
    )
  );

CREATE OR REPLACE FUNCTION public.set_survey_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_surveys_updated_at ON public.surveys;
CREATE TRIGGER set_surveys_updated_at
BEFORE UPDATE ON public.surveys
FOR EACH ROW EXECUTE FUNCTION public.set_survey_updated_at();

DROP TRIGGER IF EXISTS set_survey_responses_updated_at ON public.survey_responses;
CREATE TRIGGER set_survey_responses_updated_at
BEFORE UPDATE ON public.survey_responses
FOR EACH ROW EXECUTE FUNCTION public.set_survey_updated_at();

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
  v_selected_count INTEGER;
  v_valid_count INTEGER;
  v_number NUMERIC;
BEGIN
  SELECT response.survey_id
    INTO v_survey_id
  FROM public.survey_responses response
  WHERE response.id = p_response_id
    AND response.owner_user_id = (SELECT auth.uid())
    AND response.status = 'in_progress';

  IF v_survey_id IS NULL THEN
    RAISE EXCEPTION 'Survey response is unavailable';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.surveys survey
    WHERE survey.id = v_survey_id
      AND survey.status = 'published'
      AND NOW() >= survey.starts_at
      AND (survey.ends_at IS NULL OR NOW() < survey.ends_at)
  ) THEN
    RAISE EXCEPTION 'Survey is closed';
  END IF;

  SELECT question.*
    INTO v_question
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
    RETURN;
  END IF;

  IF v_question.question_type = 'single_choice' THEN
    IF jsonb_typeof(p_answer) <> 'string'
      OR NOT (v_question.options ? (p_answer #>> '{}')) THEN
      RAISE EXCEPTION 'Answer is not an available option';
    END IF;
  ELSIF v_question.question_type = 'multi_choice' THEN
    IF jsonb_typeof(p_answer) <> 'array' THEN
      RAISE EXCEPTION 'Answer must be a valid list of options';
    END IF;
    IF jsonb_array_length(p_answer) > COALESCE(v_question.max_selections, 99) THEN
      RAISE EXCEPTION 'Answer has too many selected options';
    END IF;

    SELECT COUNT(*), COUNT(DISTINCT selected.value)
      INTO v_selected_count, v_valid_count
    FROM jsonb_array_elements_text(p_answer) AS selected(value)
    WHERE v_question.options ? selected.value;

    IF v_selected_count <> jsonb_array_length(p_answer)
      OR v_valid_count <> v_selected_count THEN
      RAISE EXCEPTION 'Answer contains invalid or repeated options';
    END IF;
  ELSIF v_question.question_type = 'scale' THEN
    IF jsonb_typeof(p_answer) <> 'number' THEN
      RAISE EXCEPTION 'Answer must be a number';
    END IF;
    v_number := (p_answer #>> '{}')::NUMERIC;
    IF v_number < v_question.scale_min OR v_number > v_question.scale_max THEN
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
  SELECT response.*
    INTO v_response
  FROM public.survey_responses response
  WHERE response.id = p_response_id
    AND response.owner_user_id = (SELECT auth.uid())
    AND response.status = 'in_progress'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Survey response is unavailable';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.surveys survey
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
          WHEN 'single_choice' THEN COALESCE(answer.answer #>> '{}', '') = ''
          WHEN 'multi_choice' THEN jsonb_array_length(answer.answer) = 0
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

CREATE OR REPLACE FUNCTION public.purge_expired_survey_responses()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM public.survey_responses response
  USING public.surveys survey
  WHERE response.survey_id = survey.id
    AND (
      (
        response.status = 'in_progress'
        AND response.updated_at < NOW() - make_interval(days => survey.draft_retention_days)
      )
      OR (
        response.status = 'submitted'
        AND response.submitted_at < NOW() - make_interval(days => survey.submitted_retention_days)
      )
    );

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.save_survey_answer(UUID, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.submit_survey_response(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.purge_expired_survey_responses() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_survey_answer(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_survey_response(UUID) TO authenticated;

INSERT INTO public.surveys (
  survey_key, version, title, intro_text, estimated_minutes, status,
  starts_at, ends_at
)
SELECT
  'edu-mentor',
  1,
  'Ayúdanos a diseñar EDU-MENTOR',
  'Queremos conocer tus retos al buscar empleo y qué apoyo te sería útil. Esta encuesta toma entre 2 y 3 minutos. Te pediremos un correo para guardar tu avance; tus respuestas no son anónimas y se tratarán según nuestra política de privacidad.',
  3,
  CASE WHEN campaign.ends_at > NOW() THEN 'published' ELSE 'draft' END,
  campaign.starts_at,
  campaign.ends_at
FROM public.site_campaigns campaign
WHERE campaign.campaign_key = 'edu-mentor-survey-2026'
ON CONFLICT (survey_key, version) DO NOTHING;

CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-expired-survey-responses') THEN
    PERFORM cron.unschedule('purge-expired-survey-responses');
  END IF;

  PERFORM cron.schedule(
    'purge-expired-survey-responses',
    '0 3 * * *',
    'SELECT public.purge_expired_survey_responses();'
  );
END;
$$;

INSERT INTO public.survey_questions (
  survey_id, question_key, prompt, helper_text, question_type, required,
  options, max_selections, scale_min, scale_max, scale_min_label,
  scale_max_label, text_max_length, position
)
SELECT survey.id, question.question_key, question.prompt, question.helper_text,
       question.question_type, question.required, question.options,
       question.max_selections, question.scale_min, question.scale_max,
       question.scale_min_label, question.scale_max_label,
       question.text_max_length, question.position
FROM public.surveys survey
CROSS JOIN (VALUES
  ('age_range', '¿En qué rango de edad estás?', NULL, 'single_choice', TRUE,
   '["18 a 21 años", "22 a 25 años", "26 a 30 años", "31 años o más"]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, NULL::TEXT, NULL::TEXT, 1000, 1),
  ('study_area', '¿Qué carrera estudiaste o estudias actualmente?', 'Elige la opción más cercana a tu área.', 'single_choice', TRUE,
   '["Administración de Empresas / Gestión Empresarial", "Economía", "Contabilidad y Finanzas", "Marketing / Publicidad", "Negocios Internacionales / Comercio Exterior", "Otra carrera relacionada a Negocios", "Otra carrera no relacionada a Negocios"]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, NULL::TEXT, NULL::TEXT, 1000, 2),
  ('current_stage', '¿En qué etapa académica o laboral estás?', NULL, 'single_choice', TRUE,
   '["Estudiante de primeros o ciclos intermedios", "Estudiante de últimos ciclos", "Egresado/a en búsqueda de empleo o prácticas", "Egresado/a con empleo que busca mejorar o cambiar", "Emprendiendo o trabajando de forma independiente"]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, NULL::TEXT, NULL::TEXT, 1000, 3),
  ('employment_barriers', '¿Cuáles son tus principales dificultades al buscar empleo o prácticas?', 'Selecciona hasta tres.', 'multi_choice', TRUE,
   '["Falta de experiencia laboral previa", "No tener una red de contactos en mi sector", "Inseguridad o falta de preparación para entrevistas", "No saber cómo mejorar mi CV o LinkedIn", "Falta de claridad sobre el área hacia la que dirigir mi carrera", "Falta de experiencia práctica resolviendo problemas reales", "Otra dificultad"]'::JSONB, 3, NULL::INTEGER, NULL::INTEGER, NULL::TEXT, NULL::TEXT, 1000, 4),
  ('readiness', 'Del 1 al 5, ¿qué tan preparado/a te sientes para ingresar al mercado laboral?', NULL, 'scale', TRUE,
   '[]'::JSONB, NULL::INTEGER, 1, 5, 'Nada preparado/a', 'Muy preparado/a', 1000, 5),
  ('valuable_components', '¿Qué componentes de EDU-MENTOR te resultarían más valiosos?', 'Selecciona hasta tres.', 'multi_choice', TRUE,
   '["Mentoría 1:1 con un profesional de mi sector", "Optimización de CV y perfil de LinkedIn", "Simulaciones de entrevistas con feedback", "Desafíos prácticos basados en casos reales", "Conexión con otros jóvenes y mentoría entre pares", "Talleres para fortalecer habilidades profesionales"]'::JSONB, 3, NULL::INTEGER, NULL::INTEGER, NULL::TEXT, NULL::TEXT, 1000, 6),
  ('weekly_availability', '¿Cuánto tiempo podrías dedicar al programa cada semana?', NULL, 'single_choice', TRUE,
   '["2 a 3 horas", "4 a 6 horas", "Más de 6 horas", "No dispongo de tiempo actualmente"]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, NULL::TEXT, NULL::TEXT, 1000, 7),
  ('application_interest', '¿Qué tan interesado/a estarías en postular a la primera edición de EDU-MENTOR?', NULL, 'scale', TRUE,
   '[]'::JSONB, NULL::INTEGER, 1, 5, 'Nada interesado/a', 'Muy interesado/a', 1000, 8),
  ('preferred_schedule', '¿En qué horario te resultaría más cómodo participar?', 'Opcional; puedes elegir más de uno.', 'multi_choice', FALSE,
   '["Noches entre semana", "Sábados por la mañana", "Sábados por la tarde", "Domingos por la mañana"]'::JSONB, 4, NULL::INTEGER, NULL::INTEGER, NULL::TEXT, NULL::TEXT, 1000, 9),
  ('expected_outcome', '¿Qué te gustaría llevarte al finalizar un programa como este?', 'Opcional; máximo 500 caracteres.', 'long_text', FALSE,
   '[]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, NULL::TEXT, NULL::TEXT, 500, 10)
) AS question(
  question_key, prompt, helper_text, question_type, required, options,
  max_selections, scale_min, scale_max, scale_min_label, scale_max_label,
  text_max_length, position
)
WHERE survey.survey_key = 'edu-mentor'
  AND survey.version = 1
ON CONFLICT (survey_id, question_key) DO NOTHING;

ALTER TABLE public.site_campaigns
  DROP CONSTRAINT IF EXISTS site_campaigns_https_cta;

ALTER TABLE public.site_campaigns
  ADD CONSTRAINT site_campaigns_valid_cta_url
  CHECK (cta_url ~* '^https://' OR (cta_url ~ '^/' AND cta_url !~ '^//'));

UPDATE public.site_campaigns
SET cta_url = '/encuesta/edu-mentor',
    cta_label = 'Responder encuesta',
    email_capture_enabled = FALSE
WHERE campaign_key = 'edu-mentor-survey-2026';

COMMENT ON TABLE public.surveys IS
  'Definiciones versionadas de encuestas públicas reutilizables.';
COMMENT ON TABLE public.survey_questions IS
  'Preguntas configurables por versión, con claves estables para guardar respuestas.';
COMMENT ON TABLE public.survey_responses IS
  'Una sesión de respuesta por encuesta y usuario autenticado o anónimo.';
COMMENT ON TABLE public.survey_answers IS
  'Respuestas incrementales protegidas por la sesión propietaria.';
