CREATE TABLE IF NOT EXISTS public.edu_mentor_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'home_popup',
  consent_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT edu_mentor_interest_email_length CHECK (char_length(email) <= 320),
  CONSTRAINT edu_mentor_interest_email_format CHECK (
    email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  CONSTRAINT edu_mentor_interest_consent_required CHECK (consent_marketing = TRUE),
  CONSTRAINT edu_mentor_interest_source_length CHECK (char_length(source) BETWEEN 1 AND 80)
);

CREATE UNIQUE INDEX IF NOT EXISTS edu_mentor_interest_email_unique
  ON public.edu_mentor_interest (lower(email));

ALTER TABLE public.edu_mentor_interest ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.edu_mentor_interest FROM anon, authenticated;
GRANT INSERT ON TABLE public.edu_mentor_interest TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can register EDU-MENTOR interest"
  ON public.edu_mentor_interest;

CREATE POLICY "Anyone can register EDU-MENTOR interest"
  ON public.edu_mentor_interest
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent_marketing = TRUE
    AND char_length(email) <= 320
    AND char_length(source) BETWEEN 1 AND 80
  );

COMMENT ON TABLE public.edu_mentor_interest IS
  'Correos con consentimiento explícito para recibir novedades de EDU-MENTOR.';
