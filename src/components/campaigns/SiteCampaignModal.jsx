import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Loader2,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { siteCampaignsService } from "../../services/siteCampaignsService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const IMAGE_POSITION_CLASSES = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

// Disponible únicamente en desarrollo para revisar la composición antes de
// publicar una campaña en Supabase. No forma parte del bundle de producción.
const DEVELOPMENT_PREVIEW_CAMPAIGN = {
  id: "preview-edu-mentor",
  campaign_key: "edu-mentor-survey",
  version: 1,
  target_paths: ["/"],
  cta_url:
    "https://docs.google.com/forms/d/e/1FAIpQLScCDDudEAIki6IhB216f0o_lldyxbAf9WoKTRW8Zs3lZ8Mhgw/viewform?usp=header",
  cta_label: "Compartir mi opinión",
  eyebrow: "EDU-MENTOR",
  panel_title: "Tu experiencia puede abrir más oportunidades.",
  panel_description:
    "Ayúdanos a diseñar experiencias de empleabilidad más útiles para jóvenes.",
  title: "Queremos escuchar tu experiencia profesional",
  description:
    "Completa este breve formulario para ayudarnos a construir EDU-MENTOR. Te tomará solo unos minutos.",
  image_url: "/CTA-img.png",
  image_alt: "Joven estudiante preparado para desarrollar su futuro profesional",
  image_fit: "contain",
  image_position: "center",
  duration_label: "Te tomará 3 minutos",
  access_label: "Participación voluntaria",
  email_capture_enabled: true,
  email_label: "Déjanos tu correo si deseas recibir novedades",
  email_placeholder: "tu@email.com",
  consent_copy: "Acepto recibir novedades sobre EDU-MENTOR.",
  open_delay_ms: 0,
  dismiss_for_days: 0,
};

function storageKey(type, campaign) {
  return [
    "site-campaign",
    type,
    campaign.campaign_key,
    "v" + campaign.version,
  ].join("-");
}

function wasRecentlyDismissed(campaign) {
  try {
    const dismissedAt = Number(
      localStorage.getItem(storageKey("dismissed", campaign)),
    );
    const duration = campaign.dismiss_for_days * DAY_IN_MS;
    return dismissedAt > 0 && Date.now() - dismissedAt < duration;
  } catch {
    return false;
  }
}

function alreadyParticipated(campaign) {
  try {
    return (
      localStorage.getItem(storageKey("participated", campaign)) === "true"
    );
  } catch {
    return false;
  }
}

export default function SiteCampaignModal() {
  const { pathname, search } = useLocation();
  const [campaign, setCampaign] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState("idle");
  const [imageFailed, setImageFailed] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const loadCampaign = async () => {
      setIsOpen(false);
      setCampaign(null);
      setImageFailed(false);

      const isDevelopmentPreview =
        import.meta.env.DEV &&
        new URLSearchParams(search).get("previewCampaign") === "edu-mentor";
      const activeCampaign = isDevelopmentPreview
        ? DEVELOPMENT_PREVIEW_CAMPAIGN
        : await siteCampaignsService.getActiveCampaign(pathname);

      if (
        cancelled ||
        !activeCampaign ||
        alreadyParticipated(activeCampaign) ||
        wasRecentlyDismissed(activeCampaign)
      ) {
        return;
      }

      setCampaign(activeCampaign);
      timer = window.setTimeout(
        () => setIsOpen(true),
        activeCampaign.open_delay_ms,
      );
    };

    loadCampaign();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname, search]);

  const close = useCallback(() => {
    if (campaign) {
      try {
        localStorage.setItem(
          storageKey("dismissed", campaign),
          String(Date.now()),
        );
      } catch {
        // Cerrar el modal no depende de poder persistir la preferencia.
      }
    }
    setIsOpen(false);
  }, [campaign]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => modalRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!campaign) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail && !EMAIL_PATTERN.test(normalizedEmail)) {
      setEmailError("Ingresa un correo válido o deja el campo vacío.");
      return;
    }

    if (
      campaign.email_capture_enabled &&
      normalizedEmail &&
      !consent
    ) {
      setEmailError("Confirma que podemos contactarte sobre esta iniciativa.");
      return;
    }

    setEmailError("");
    setStatus("loading");

    const campaignWindow = window.open(campaign.cta_url, "_blank");
    if (campaignWindow) {
      campaignWindow.opener = null;
    } else {
      window.location.assign(campaign.cta_url);
    }

    try {
      if (
        campaign.email_capture_enabled &&
        !website &&
        normalizedEmail
      ) {
        const result = await siteCampaignsService.registerLead({
          campaignId: campaign.id,
          email: normalizedEmail,
          sourcePath: pathname,
        });
        if (!result.success) toast.error(result.error);
      }

      try {
        localStorage.setItem(
          storageKey("participated", campaign),
          "true",
        );
      } catch {
        // El destino ya se abrió; no bloqueamos el flujo por localStorage.
      }

      setStatus("success");
      window.setTimeout(() => setIsOpen(false), 700);
    } catch {
      toast.error(
        "No pudimos guardar tu correo, pero el destino ya se abrió en otra pestaña.",
      );
      setStatus("idle");
    }
  };

  const emailInputClass = [
    "w-full rounded-xl border bg-slate-50 py-3.5 pl-12 pr-4 text-sm",
    "text-slate-900 outline-none transition focus:bg-white focus:ring-2",
    emailError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-primary focus:ring-primary/15",
  ].join(" ");
  const imageFitClass =
    campaign?.image_fit === "contain" ? "object-contain" : "object-cover";
  const imagePositionClass =
    IMAGE_POSITION_CLASSES[campaign?.image_position] || "object-center";

  if (!campaign) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <m.section
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-campaign-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl outline-none md:grid-cols-[0.9fr_1.1fr]"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar invitación"
              className="absolute right-4 top-4 z-20 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative hidden min-h-[560px] overflow-hidden bg-slate-950 text-white md:flex md:flex-col md:justify-between">
              <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/35 blur-3xl" />
              <div className="absolute -bottom-20 -right-14 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />

              {campaign.image_url && !imageFailed ? (
                <>
                  <img
                    src={campaign.image_url}
                    alt={campaign.image_alt || ""}
                    className={[
                      "absolute inset-0 h-full w-full",
                      imageFitClass,
                      imagePositionClass,
                    ].join(" ")}
                    onError={() => setImageFailed(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/25" />
                  <span className="absolute left-7 top-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    <HeartHandshake className="h-4 w-4 text-secondary" />
                    {campaign.eyebrow}
                  </span>
                </>
              ) : (
                <div className="relative flex h-full flex-col justify-between p-10">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90">
                      <HeartHandshake className="h-4 w-4 text-secondary" />
                      {campaign.eyebrow}
                    </span>
                    <h2 className="mt-8 text-4xl font-extrabold leading-tight">
                      {campaign.panel_title}
                    </h2>
                    <p className="mt-5 text-sm leading-relaxed text-slate-300">
                      {campaign.panel_description}
                    </p>
                  </div>

                  <div className="mt-10 space-y-4 text-sm text-slate-200">
                    {campaign.duration_label && (
                      <div className="flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-secondary" />
                        {campaign.duration_label}
                      </div>
                    )}
                    {campaign.access_label && (
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-secondary" />
                        {campaign.access_label}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 pt-14 sm:p-9 sm:pt-14 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary md:hidden">
                <HeartHandshake className="h-4 w-4" />
                {campaign.eyebrow}
              </span>
              <h2
                id="site-campaign-modal-title"
                className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 md:mt-0"
              >
                {campaign.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {campaign.description}
              </p>
              {(campaign.duration_label || campaign.access_label) && (
                <div
                  className={[
                    "mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600",
                    campaign.image_url && !imageFailed ? "" : "md:hidden",
                  ].join(" ")}
                >
                  {campaign.duration_label && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-primary" />
                      {campaign.duration_label}
                    </span>
                  )}
                  {campaign.access_label && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      {campaign.access_label}
                    </span>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7" noValidate>
                {campaign.email_capture_enabled && (
                  <>
                    <label
                      htmlFor="site-campaign-email"
                      className="text-sm font-bold text-slate-800"
                    >
                      {campaign.email_label}{" "}
                      <span className="font-medium text-slate-500">
                        (opcional)
                      </span>
                    </label>
                    <div className="relative mt-2">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id="site-campaign-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setEmailError("");
                        }}
                        placeholder={campaign.email_placeholder}
                        className={emailInputClass}
                      />
                    </div>

                    <div
                      className="absolute -left-[10000px]"
                      aria-hidden="true"
                    >
                      <label htmlFor="site-campaign-website">Sitio web</label>
                      <input
                        id="site-campaign-website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                      />
                    </div>

                    {email && (
                      <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-slate-600">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => {
                            setConsent(event.target.checked);
                            setEmailError("");
                          }}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span>
                          {campaign.consent_copy} Consulta la{" "}
                          <Link
                            to="/privacidad"
                            className="font-semibold text-primary underline underline-offset-2"
                            onClick={(event) => event.stopPropagation()}
                          >
                            política de privacidad
                          </Link>
                          .
                        </span>
                      </label>
                    )}

                    {emailError && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {emailError}
                      </p>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/95 hover:shadow-primary/35 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
                >
                  {status === "loading" && (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  )}
                  {status === "success" && (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  {status === "success" ? "Destino abierto" : campaign.cta_label}
                  {status === "idle" && <ArrowUpRight className="h-5 w-5" />}
                </button>
                {campaign.email_capture_enabled && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    El correo es opcional. El destino se abre en una nueva pestaña.
                  </p>
                )}
              </form>
            </div>
          </m.section>
        </m.div>
      )}
    </AnimatePresence>
  );
}
