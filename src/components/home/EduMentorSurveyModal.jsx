import { useEffect, useRef, useState } from "react";
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
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { eduMentorService } from "../../services/eduMentorService";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScCDDudEAIki6IhB216f0o_lldyxbAf9WoKTRW8Zs3lZ8Mhgw/viewform?usp=header";
const OPEN_DELAY_MS = 1800;
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const DISMISS_KEY = "edu-mentor-survey-dismissed-v1";
const PARTICIPATED_KEY = "edu-mentor-survey-participated-v1";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function wasRecentlyDismissed() {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY));
    return dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

export default function EduMentorSurveyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState("idle");
  const modalRef = useRef(null);

  const close = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Cerrar el modal no depende de poder persistir la preferencia.
    }
    setIsOpen(false);
  };

  useEffect(() => {
    let participated = false;
    try {
      participated = localStorage.getItem(PARTICIPATED_KEY) === "true";
    } catch {
      // El modal sigue disponible si el navegador bloquea localStorage.
    }

    if (participated || wasRecentlyDismissed()) return undefined;

    const timer = window.setTimeout(() => setIsOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

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
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail && !EMAIL_PATTERN.test(normalizedEmail)) {
      setEmailError("Ingresa un correo válido o deja el campo vacío.");
      return;
    }

    if (normalizedEmail && !consent) {
      setEmailError("Confirma que podemos contactarte sobre EDU-MENTOR.");
      return;
    }

    setEmailError("");
    setStatus("loading");

    // Se abre dentro del gesto del usuario para evitar bloqueadores de pop-ups.
    const surveyWindow = window.open(FORM_URL, "_blank");
    if (surveyWindow) {
      surveyWindow.opener = null;
    } else {
      window.location.assign(FORM_URL);
    }

    try {
      // Campo señuelo: los bots creen que enviaron el formulario, pero no guardamos el dato.
      if (!website && normalizedEmail) {
        const result = await eduMentorService.registerInterest(normalizedEmail);
        if (!result.success) toast.error(result.error);
      }

      try {
        localStorage.setItem(PARTICIPATED_KEY, "true");
      } catch {
        // La encuesta ya se abrió; no bloqueamos el flujo por localStorage.
      }
      setStatus("success");
      window.setTimeout(() => setIsOpen(false), 700);
    } catch {
      toast.error(
        "No pudimos guardar tu correo, pero la encuesta ya se abrió en otra pestaña.",
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
            aria-labelledby="edu-mentor-modal-title"
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

            <div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
              <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/35 blur-3xl" />
              <div className="absolute -bottom-20 -right-14 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90">
                  <HeartHandshake className="h-4 w-4 text-secondary" />
                  EDU-MENTOR
                </span>
                <h2 className="mt-8 text-4xl font-extrabold leading-tight">
                  Tu experiencia puede cambiar la de muchos.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-slate-300">
                  Estamos diseñando un programa gratuito de mentoría para jóvenes
                  de Negocios y Gestión. Queremos construirlo contigo, no solo para
                  ti.
                </p>
              </div>

              <div className="relative mt-10 space-y-4 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-secondary" />
                  Toma entre 3 y 5 minutos
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-secondary" />
                  No requiere iniciar sesión
                </div>
              </div>
            </div>

            <div className="p-6 pt-14 sm:p-9 sm:pt-14 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary md:hidden">
                <HeartHandshake className="h-4 w-4" />
                EDU-MENTOR
              </span>
              <h2
                id="edu-mentor-modal-title"
                className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 md:mt-0"
              >
                Ayúdanos a crear una mentoría que sí responda a tus retos
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Cuéntanos qué te cuesta al buscar prácticas o empleo y qué apoyo te
                sería realmente útil. Tus respuestas serán confidenciales.
              </p>

              <form onSubmit={handleSubmit} className="mt-7" noValidate>
                <label
                  htmlFor="edu-mentor-email"
                  className="text-sm font-bold text-slate-800"
                >
                  Recibe la invitación prioritaria{" "}
                  <span className="font-medium text-slate-500">(opcional)</span>
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="edu-mentor-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError("");
                    }}
                    placeholder="tu@correo.com"
                    className={emailInputClass}
                  />
                </div>

                <div className="absolute -left-[10000px]" aria-hidden="true">
                  <label htmlFor="edu-mentor-website">Sitio web</label>
                  <input
                    id="edu-mentor-website"
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
                      Acepto que EDU-US use mi correo para contactarme sobre
                      EDU-MENTOR. Consulta la{" "}
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

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/95 hover:shadow-primary/35 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
                >
                  {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
                  {status === "success" && <CheckCircle2 className="h-5 w-5" />}
                  {status === "success" ? "Encuesta abierta" : "Responder encuesta"}
                  {status === "idle" && <ArrowUpRight className="h-5 w-5" />}
                </button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  El correo es opcional. La encuesta se abre en una nueva pestaña.
                </p>
              </form>
            </div>
          </m.section>
        </m.div>
      )}
    </AnimatePresence>
  );
}
