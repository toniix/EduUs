-- Local PostgreSQL harness for the additive 20261003 migration.
-- Run only against an ephemeral database, never a Supabase project.
CREATE SCHEMA auth;
CREATE TABLE auth.users (id UUID PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', TRUE), '')::UUID;
$$;

CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_key TEXT NOT NULL,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  status TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  UNIQUE (survey_key, version)
);
CREATE TABLE public.survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.surveys(id),
  question_key TEXT NOT NULL,
  prompt TEXT NOT NULL,
  helper_text TEXT,
  question_type TEXT NOT NULL,
  required BOOLEAN NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::JSONB,
  max_selections INTEGER,
  scale_min INTEGER,
  scale_max INTEGER,
  scale_min_label TEXT,
  scale_max_label TEXT,
  text_max_length INTEGER NOT NULL DEFAULT 1000,
  position INTEGER NOT NULL,
  UNIQUE (survey_id, question_key),
  UNIQUE (survey_id, position)
);
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES public.surveys(id),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'in_progress',
  current_question_key TEXT,
  submitted_at TIMESTAMPTZ
);
CREATE TABLE public.survey_answers (
  response_id UUID NOT NULL REFERENCES public.survey_responses(id),
  question_id UUID NOT NULL REFERENCES public.survey_questions(id),
  answer JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (response_id, question_id)
);

INSERT INTO public.surveys (
  survey_key, version, title, intro_text, estimated_minutes, status,
  starts_at, ends_at
) VALUES (
  'edu-mentor', 1, 'Old survey', 'Old introduction', 3, 'published',
  NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days'
);

INSERT INTO public.survey_questions (
  survey_id, question_key, prompt, question_type, required,
  options, max_selections, scale_min, scale_max, position
)
SELECT survey.id, question.question_key, question.question_key,
       question.question_type, question.required, question.options,
       question.max_selections, question.scale_min, question.scale_max,
       question.position
FROM public.surveys survey
CROSS JOIN (VALUES
  ('age_range', 'single_choice', TRUE, '["18 a 21 años"]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, 1),
  ('study_area', 'single_choice', TRUE, '["Economía"]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, 2),
  ('current_stage', 'single_choice', TRUE, '["Estudiante"]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, 3),
  ('employment_barriers', 'multi_choice', TRUE, '["Falta", "Otra dificultad"]'::JSONB, 3, NULL::INTEGER, NULL::INTEGER, 4),
  ('readiness', 'scale', TRUE, '[]'::JSONB, NULL::INTEGER, 1, 5, 5),
  ('valuable_components', 'multi_choice', TRUE, '["Mentoría"]'::JSONB, 3, NULL::INTEGER, NULL::INTEGER, 6),
  ('weekly_availability', 'single_choice', TRUE, '["2 a 3 horas"]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, 7),
  ('application_interest', 'scale', TRUE, '[]'::JSONB, NULL::INTEGER, 1, 5, 8),
  ('preferred_schedule', 'multi_choice', FALSE, '["Sábado"]'::JSONB, 1, NULL::INTEGER, NULL::INTEGER, 9),
  ('expected_outcome', 'long_text', FALSE, '[]'::JSONB, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER, 10)
) AS question(
  question_key, question_type, required, options, max_selections,
  scale_min, scale_max, position
)
WHERE survey.survey_key = 'edu-mentor' AND survey.version = 1;
