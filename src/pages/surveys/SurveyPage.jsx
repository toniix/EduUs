import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";
import SEO from "../../components/SEO";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  SURVEY_CONSENT_VERSION,
  surveysService,
} from "../../services/surveysService";

function hasAnswer(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function getResumeIndex(survey, response, answers) {
  const lastSavedIndex = survey.survey_questions.findIndex(
    (question) => question.question_key === response?.current_question_key,
  );

  if (lastSavedIndex >= 0 && lastSavedIndex < survey.survey_questions.length - 1) {
    return lastSavedIndex + 1;
  }

  const unansweredQuestion = survey.survey_questions.findIndex(
    (question) => !hasAnswer(answers[question.question_key]),
  );
  if (unansweredQuestion >= 0) return unansweredQuestion;
  return Math.max(0, survey.survey_questions.length - 1);
}

function QuestionInput({ question, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  if (question.question_type === "single_choice") {
    return (
      <div className="mt-6 grid gap-3">
        {(question.options || []).map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={isSelected}
              className={[
                "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition",
                isSelected
                  ? "border-primary bg-primary/5 text-slate-950 ring-2 ring-primary/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:bg-slate-50",
              ].join(" ")}
            >
              {option}
              <span
                className={[
                  "ml-4 grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                  isSelected ? "border-primary bg-primary text-white" : "border-slate-300",
                ].join(" ")}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.question_type === "multi_choice") {
    return (
      <div className="mt-6 grid gap-3">
        {(question.options || []).map((option) => {
          const isSelected = selected.includes(option);
          const limitReached =
            !isSelected &&
            Number.isInteger(question.max_selections) &&
            selected.length >= question.max_selections;
          return (
            <button
              key={option}
              type="button"
              disabled={limitReached}
              onClick={() => {
                if (isSelected) {
                  onChange(selected.filter((item) => item !== option));
                } else if (!limitReached) {
                  onChange([...selected, option]);
                }
              }}
              aria-pressed={isSelected}
              className={[
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                isSelected
                  ? "border-primary bg-primary/5 text-slate-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:bg-slate-50",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                  isSelected ? "border-primary bg-primary text-white" : "border-slate-300",
                ].join(" ")}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </span>
              {option}
            </button>
          );
        })}
        {Number.isInteger(question.max_selections) && (
          <p className="text-xs text-slate-500">
            Puedes elegir hasta {question.max_selections}. Seleccionadas: {selected.length}.
          </p>
        )}
      </div>
    );
  }

  if (question.question_type === "scale") {
    const min = Number(question.scale_min);
    const max = Number(question.scale_max);
    const values = Array.from({ length: max - min + 1 }, (_, index) => min + index);
    return (
      <div className="mt-8">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {values.map((item) => {
            const isSelected = Number(value) === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                aria-label={`${item}`}
                aria-pressed={isSelected}
                className={[
                  "aspect-square rounded-2xl border text-lg font-extrabold transition sm:text-xl",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex justify-between gap-4 text-xs font-medium text-slate-500">
          <span>{question.scale_min_label}</span>
          <span className="text-right">{question.scale_max_label}</span>
        </div>
      </div>
    );
  }

  return (
    <textarea
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      maxLength={question.text_max_length || 1000}
      rows={5}
      placeholder="Escribe tu respuesta aquí..."
      className="mt-6 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
    />
  );
}

export default function SurveyPage() {
  const { surveyKey } = useParams();
  const [survey, setSurvey] = useState(null);
  const [response, setResponse] = useState(null);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [consentResearch, setConsentResearch] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [confirmAdult, setConfirmAdult] = useState(false);
  const [step, setStep] = useState(-1);
  const [loadState, setLoadState] = useState("loading");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [savingState, setSavingState] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveTimerRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadState("loading");
      setError("");
      try {
        const activeSurvey = await surveysService.getPublishedSurvey(surveyKey);
        if (!activeSurvey) {
          if (!cancelled) setLoadState("unavailable");
          return;
        }

        await surveysService.ensureSession();
        const myResponse = await surveysService.getMyResponse(activeSurvey.id);
        const savedAnswers = myResponse?.status === "in_progress"
          ? await surveysService.getAnswers(myResponse.id, activeSurvey.survey_questions)
          : {};

        if (cancelled) return;

        setSurvey(activeSurvey);
        setResponse(myResponse);
        setAnswers(savedAnswers);
        setEmail(myResponse?.email || "");
        setConsentResearch(
          myResponse?.consent_text_version === SURVEY_CONSENT_VERSION,
        );
        setConsentMarketing(Boolean(myResponse?.consent_marketing));
        setConfirmAdult(Boolean(myResponse?.adult_confirmed));
        setLoadState("ready");
      } catch {
        if (!cancelled) {
          setError(
            "No pudimos cargar la encuesta. Intenta de nuevo en unos momentos.",
          );
          setLoadState("error");
        }
      }
    };

    load();
    return () => {
      cancelled = true;
      window.clearTimeout(saveTimerRef.current);
    };
  }, [surveyKey]);

  const questions = survey?.survey_questions || [];
  const currentQuestion = questions[step];
  const progress = useMemo(
    () => (step >= 0 && questions.length ? Math.round(((step + 1) / questions.length) * 100) : 0),
    [questions.length, step],
  );

  const saveCurrentAnswer = useCallback(
    async (question, value) => {
      if (!response || !question) return;
      await surveysService.saveAnswer({
        responseId: response.id,
        questionKey: question.question_key,
        answer: value,
      });
    },
    [response],
  );

  const scheduleSave = (question, value) => {
    setAnswers((previous) => ({ ...previous, [question.question_key]: value }));
    setSavingState("saving");
    window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(async () => {
      try {
        await saveCurrentAnswer(question, value);
        setSavingState("saved");
      } catch {
        setSavingState("error");
      }
    }, 450);
  };

  const startSurvey = async (event) => {
    event.preventDefault();
    setError("");
    setEmailError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError("Ingresa un correo electrónico válido.");
      emailInputRef.current?.focus();
      return;
    }
    if (!confirmAdult) {
      setError("Esta encuesta está dirigida a personas mayores de 18 años.");
      return;
    }
    if (!consentResearch) {
      setError("Necesitamos tu autorización para guardar y analizar tus respuestas.");
      return;
    }

    setLoadState("starting");
    try {
      const savedResponse = await surveysService.startResponse({
        surveyId: survey.id,
        email: normalizedEmail,
        consentMarketing,
        existingResponse: response,
      });
      setResponse(savedResponse);
      setEmail(savedResponse.email);
      setStep(
        savedResponse.status === "in_progress"
          ? getResumeIndex(survey, savedResponse, answers)
          : 0,
      );
      setLoadState("ready");
    } catch {
      setLoadState("ready");
      setError("No pudimos iniciar tu encuesta. Revisa tu conexión e inténtalo otra vez.");
    }
  };

  const goNext = async () => {
    if (!currentQuestion || isSubmitting) return;
    const answer = answers[currentQuestion.question_key];
    if (currentQuestion.required && !hasAnswer(answer)) {
      setError("Responde esta pregunta para continuar.");
      return;
    }

    setError("");
    window.clearTimeout(saveTimerRef.current);
    setSavingState("saving");
    if (Object.hasOwn(answers, currentQuestion.question_key)) {
      try {
        await saveCurrentAnswer(currentQuestion, answer);
        setSavingState("saved");
      } catch {
        setSavingState("error");
        setError("No se pudo guardar esta respuesta. Intenta continuar otra vez.");
        return;
      }
    }

    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      await surveysService.submitResponse(response.id);
      setResponse((previous) => ({ ...previous, status: "submitted" }));
      setLoadState("complete");
    } catch {
      setError("No pudimos enviar la encuesta. Tus respuestas siguen guardadas; inténtalo otra vez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goPrevious = async () => {
    setError("");
    window.clearTimeout(saveTimerRef.current);
    if (currentQuestion && Object.hasOwn(answers, currentQuestion.question_key)) {
      setSavingState("saving");
      try {
        await saveCurrentAnswer(
          currentQuestion,
          answers[currentQuestion.question_key],
        );
        setSavingState("saved");
      } catch {
        setSavingState("error");
        setError("No pudimos guardar esta respuesta; podrás reintentar al volver a esta pregunta.");
      }
    }
    setStep((current) => Math.max(0, current - 1));
  };

  if (loadState === "loading") {
    return <LoadingSpinner fullScreen message="Preparando la encuesta..." />;
  }

  if (loadState === "unavailable" || loadState === "error") {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
        <SEO title="Encuesta EDU-MENTOR | EDU-US" noindex />
        <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-900/5 sm:p-12">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-slate-950">
            {loadState === "unavailable" ? "La encuesta no está disponible" : "No pudimos abrir la encuesta"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {loadState === "unavailable"
              ? "Esta encuesta todavía no está publicada o su periodo de respuesta terminó."
              : error}
          </p>
          {loadState === "error" && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Intentar de nuevo
            </button>
          )}
          <Link to="/" className="mt-6 block text-sm font-bold text-primary">
            Volver a EDU-US
          </Link>
        </section>
      </main>
    );
  }

  if (loadState === "complete" || response?.status === "submitted") {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
        <SEO title="Gracias por participar | EDU-US" noindex />
        <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-900/5 sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-slate-950">¡Gracias por tu tiempo!</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Tus respuestas nos ayudarán a diseñar EDU-MENTOR con las necesidades reales de jóvenes profesionales.
          </p>
          <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
            Volver a EDU-US <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    );
  }

  if (step < 0) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:py-14">
        <SEO title="Encuesta EDU-MENTOR | EDU-US" description="Ayúdanos a diseñar EDU-MENTOR." noindex />
        <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary">EDU-MENTOR</span>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{survey.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">{survey.intro_text}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/90">
              <Clock3 className="h-4 w-4 text-secondary" />
              Aproximadamente {survey.estimated_minutes} minutos
            </div>
          </div>

          <form onSubmit={startSurvey} className="space-y-6 p-6 sm:p-10">
            {response?.status === "in_progress" && (
              <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-slate-700">
                Encontramos un avance guardado en este navegador. Puedes continuar con tu correo.
              </div>
            )}

            <div>
              <label htmlFor="survey-email" className="text-sm font-bold text-slate-800">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Lo usaremos para guardar tu avance y comunicarnos contigo sobre EDU-MENTOR.
              </p>
              <input
                ref={emailInputRef}
                id="survey-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError("");
                }}
                placeholder="tu@correo.com"
                className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              {emailError && <p className="mt-2 text-xs font-semibold text-red-600">{emailError}</p>}
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-700">
              <input
                type="checkbox"
                checked={confirmAdult}
                onChange={(event) => setConfirmAdult(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span>Confirmo que tengo 18 años o más y que deseo participar voluntariamente.</span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-700">
              <input
                type="checkbox"
                checked={consentResearch}
                onChange={(event) => setConsentResearch(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span>
                Autorizo a EDU-US a usar mi correo para guardar mi avance y comunicarse conmigo sobre EDU-MENTOR, y mis respuestas para analizar esta encuesta. He leído la{" "}
                <Link to="/privacidad" target="_blank" className="font-bold text-primary underline" onClick={(event) => event.stopPropagation()}>
                  política de privacidad
                </Link>.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-700">
              <input
                type="checkbox"
                checked={consentMarketing}
                onChange={(event) => setConsentMarketing(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span>Quiero recibir por correo futuras convocatorias y novedades de EDU-MENTOR. (Opcional)</span>
            </label>

            {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loadState === "starting"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
            >
              {loadState === "starting" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {response?.status === "in_progress" ? "Continuar encuesta" : "Comenzar encuesta"}
              {loadState !== "starting" && <ArrowRight className="h-5 w-5" />}
            </button>
            <p className="text-center text-xs leading-relaxed text-slate-500">
              Tus respuestas se guardan a medida que avanzas para que puedas volver desde este navegador. El correo se solicita para guardar tu progreso, por eso la encuesta no es anónima.
            </p>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:py-12">
      <SEO title={`${survey.title} | EDU-US`} noindex />
      <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/5">
        <header className="border-b border-slate-100 px-6 pb-5 pt-7 sm:px-10 sm:pt-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">EDU-MENTOR</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Save className="h-4 w-4" />
              {savingState === "saving" ? "Guardando..." : savingState === "error" ? "Error al guardar" : savingState === "saved" ? "Avance guardado" : "Guardado automático"}
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">Pregunta {step + 1} de {questions.length}</p>
              <h1 className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">{survey.title}</h1>
            </div>
            <span className="text-sm font-extrabold text-primary">{progress}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`Progreso ${progress}%`}>
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </header>

        <div className="px-6 py-7 sm:px-10 sm:py-10">
          <div className="flex items-start gap-2 text-xs font-bold uppercase tracking-wide text-primary">
            {currentQuestion?.required ? "Obligatoria" : "Opcional"}
          </div>
          <h2 className="mt-3 text-2xl font-extrabold leading-snug text-slate-950 sm:text-3xl">
            {currentQuestion?.prompt}
          </h2>
          {currentQuestion?.helper_text && (
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{currentQuestion.helper_text}</p>
          )}

          {currentQuestion && (
            <QuestionInput
              question={currentQuestion}
              value={answers[currentQuestion.question_key]}
              onChange={(value) => scheduleSave(currentQuestion, value)}
            />
          )}

          {error && <p role="alert" className="mt-5 text-sm font-semibold text-red-600">{error}</p>}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goPrevious}
              disabled={step === 0 || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Anterior
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={isSubmitting || savingState === "saving"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
              {step === questions.length - 1 ? "Enviar respuestas" : "Continuar"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </section>
      <p className="mx-auto mt-5 flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 shrink-0" /> Tus respuestas se guardan de forma privada y solo tú puedes recuperar el avance en este navegador.
      </p>
    </main>
  );
}
