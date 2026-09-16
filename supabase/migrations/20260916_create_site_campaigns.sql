CREATE TABLE IF NOT EXISTS public.site_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_key TEXT NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  internal_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'paused', 'archived')),
  target_paths TEXT[] NOT NULL DEFAULT ARRAY['/']::TEXT[],
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  cta_url TEXT NOT NULL,
  cta_label TEXT NOT NULL DEFAULT 'Continuar',
  eyebrow TEXT NOT NULL,
  panel_title TEXT NOT NULL,
  panel_description TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_label TEXT,
  access_label TEXT,
  email_capture_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  email_label TEXT,
  email_placeholder TEXT DEFAULT 'tu@correo.com',
  consent_copy TEXT,
  open_delay_ms INTEGER NOT NULL DEFAULT 1800,
  dismiss_for_days INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT site_campaigns_valid_window CHECK (ends_at > starts_at),
  CONSTRAINT site_campaigns_nonempty_paths CHECK (cardinality(target_paths) > 0),
  CONSTRAINT site_campaigns_https_cta CHECK (cta_url ~* '^https://'),
  CONSTRAINT site_campaigns_delay_range
    CHECK (open_delay_ms BETWEEN 0 AND 60000),
  CONSTRAINT site_campaigns_dismiss_range
    CHECK (dismiss_for_days BETWEEN 1 AND 365),
  CONSTRAINT site_campaigns_version_positive CHECK (version > 0)
);

CREATE INDEX IF NOT EXISTS site_campaigns_active_lookup
  ON public.site_campaigns (status, starts_at, ends_at, priority DESC);

ALTER TABLE public.site_campaigns ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.site_campaigns FROM anon, authenticated;
GRANT SELECT ON TABLE public.site_campaigns TO anon, authenticated;

DROP POLICY IF EXISTS "Public can read active site campaigns"
  ON public.site_campaigns;

CREATE POLICY "Public can read active site campaigns"
  ON public.site_campaigns
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND NOW() >= starts_at
    AND NOW() < ends_at
  );

CREATE TABLE IF NOT EXISTS public.site_campaign_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL
    REFERENCES public.site_campaigns(id) ON DELETE RESTRICT,
  email TEXT NOT NULL,
  source_path TEXT NOT NULL,
  consent_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT site_campaign_leads_email_length CHECK (char_length(email) <= 320),
  CONSTRAINT site_campaign_leads_email_format CHECK (
    email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  CONSTRAINT site_campaign_leads_consent_required
    CHECK (consent_marketing = TRUE),
  CONSTRAINT site_campaign_leads_source_path
    CHECK (char_length(source_path) BETWEEN 1 AND 300)
);

CREATE UNIQUE INDEX IF NOT EXISTS site_campaign_leads_campaign_email_unique
  ON public.site_campaign_leads (campaign_id, lower(email));

ALTER TABLE public.site_campaign_leads ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.site_campaign_leads FROM anon, authenticated;
GRANT INSERT ON TABLE public.site_campaign_leads TO anon, authenticated;

DROP POLICY IF EXISTS "Public can register active campaign leads"
  ON public.site_campaign_leads;

CREATE POLICY "Public can register active campaign leads"
  ON public.site_campaign_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent_marketing = TRUE
    AND EXISTS (
      SELECT 1
      FROM public.site_campaigns campaign
      WHERE campaign.id = campaign_id
        AND campaign.status = 'published'
        AND campaign.email_capture_enabled = TRUE
        AND NOW() >= campaign.starts_at
        AND NOW() < campaign.ends_at
        AND (
          '*' = ANY(campaign.target_paths)
          OR source_path = ANY(campaign.target_paths)
        )
    )
  );

CREATE OR REPLACE FUNCTION public.set_site_campaign_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_site_campaigns_updated_at
  ON public.site_campaigns;

CREATE TRIGGER set_site_campaigns_updated_at
BEFORE UPDATE ON public.site_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.set_site_campaign_updated_at();

INSERT INTO public.site_campaigns (
  campaign_key,
  version,
  internal_name,
  status,
  target_paths,
  starts_at,
  ends_at,
  priority,
  cta_url,
  cta_label,
  eyebrow,
  panel_title,
  panel_description,
  title,
  description,
  duration_label,
  access_label,
  email_capture_enabled,
  email_label,
  email_placeholder,
  consent_copy,
  open_delay_ms,
  dismiss_for_days
)
VALUES (
  'edu-mentor-survey-2026',
  1,
  'Encuesta EDU-MENTOR 2026',
  'published',
  ARRAY['/']::TEXT[],
  NOW(),
  NOW() + INTERVAL '30 days',
  100,
  'https://docs.google.com/forms/d/e/1FAIpQLScCDDudEAIki6IhB216f0o_lldyxbAf9WoKTRW8Zs3lZ8Mhgw/viewform?usp=header',
  'Responder encuesta',
  'EDU-MENTOR',
  'Tu experiencia puede cambiar la de muchos.',
  'Estamos diseñando un programa gratuito de mentoría para jóvenes de Negocios y Gestión. Queremos construirlo contigo, no solo para ti.',
  'Ayúdanos a crear una mentoría que sí responda a tus retos',
  'Cuéntanos qué te cuesta al buscar prácticas o empleo y qué apoyo te sería realmente útil. Tus respuestas serán confidenciales.',
  'Toma entre 3 y 5 minutos',
  'No requiere iniciar sesión',
  TRUE,
  'Recibe la invitación prioritaria',
  'tu@correo.com',
  'Acepto que EDU-US use mi correo para contactarme sobre esta iniciativa.',
  1800,
  7
)
ON CONFLICT (campaign_key) DO NOTHING;

COMMENT ON TABLE public.site_campaigns IS
  'Configuración y ventana de publicación de pop-ups reutilizables.';

COMMENT ON TABLE public.site_campaign_leads IS
  'Contactos con consentimiento capturados por campañas del sitio.';
