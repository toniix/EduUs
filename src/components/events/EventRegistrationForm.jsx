import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { eventsService } from "../../services/eventsService";
import { toast } from "react-hot-toast";
import { eventRegistrationSchema } from "../../utils/validationSchemas";

const OCCUPATION_OPTIONS = [
  "Estudiante Universitario(a)",
  "Estudiante de Instituto",
  "Egresado(a)",
  "Bachiller",
  "Otro",
];

const REFERRAL_OPTIONS = [
  "Instagram",
  "LinkedIn",
  "Recomendación de un amigo/a",
  "Sitio Web",
  "Otro",
];

export default function EventRegistrationForm({ event, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    occupation: "",
    career: "",
    interest_reason: "",
    referral_source: "",
    dni: "",
    is_student_at_location: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");

  const getCleanLocation = () => {
    if (!event.location) return "el lugar del evento";
    return event.location.split(",")[0]?.trim() || event.location;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = eventRegistrationSchema.safeParse({
      ...form,
      modality: event.modality,
    });

    if (!result.success) {
      const validationErrors = result.error.issues.reduce((acc, issue) => {
        const field = issue.path[0];
        if (field && !acc[field]) acc[field] = issue.message;
        return acc;
      }, {});

      setErrors(validationErrors);
      console.log(validationErrors);

      // Determinar si todos los campos requeridos están completamente vacíos
      const requiredFields = [
        "name",
        "email",
        "age",
        "phone",
        "occupation",
        "career",
        "interest_reason",
        "referral_source",
      ];
      if (event.modality === "presencial") {
        requiredFields.push("dni");
      }

      const allEmpty = requiredFields.every((field) => {
        const val = form[field];
        return typeof val === "string" ? !val.trim() : !val;
      });

      if (allEmpty) {
        toast.error("Por favor, completa los campos requeridos correctamente.");
      } else {
        // Encontrar la primera alerta de error de Zod para mostrarla
        const firstIssue = result.error.issues[0];
        if (firstIssue) {
          toast.error(firstIssue.message);
        }
      }
      return;
    }

    setStatus("loading");
    setApiError("");

    const { success, error } = await eventsService.registerForEvent(event.id, {
      name: form.name.trim(),
      email: form.email.trim(),
      career: form.career.trim(),
      dni: event.modality === "presencial" ? form.dni.trim() : null,
      phone: form.phone.trim(),
      age: Number(form.age),
      occupation: form.occupation,
      interest_reason: form.interest_reason.trim(),
      referral_source: form.referral_source,
      is_student_at_location: form.is_student_at_location,
    });

    if (success) {
      setStatus("success");
      toast.success("¡Registro exitoso! Nos vemos en el evento.");
      if (onSuccess) onSuccess(form.name);
    } else {
      setStatus("error");
      const errorMsg =
        error || "Error al procesar tu inscripción. Intenta de nuevo.";
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isPresencial = event.modality === "presencial";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {apiError}
        </div>
      )}

      {/* 1. Nombres y Apellidos */}
      <div>
        <label
          htmlFor="reg-name"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Nombres y Apellidos <span className="text-primary">*</span>
        </label>
        <input
          id="reg-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          disabled={status === "loading" || status === "success"}
          className={inputClass(errors.name)}
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Correo Electrónico (Requerido implícito para el envío del link) */}
      <div>
        <label
          htmlFor="reg-email"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Correo electrónico <span className="text-primary">*</span>
        </label>
        <input
          id="reg-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="tu@correo.com"
          disabled={status === "loading" || status === "success"}
          className={inputClass(errors.email)}
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      {/* DNI (Solo presencial) & Edad */}
      <div
        className={`grid ${isPresencial ? "grid-cols-2" : "grid-cols-1"} gap-3`}
      >
        {isPresencial && (
          <div>
            <label
              htmlFor="reg-dni"
              className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
            >
              DNI <span className="text-primary">*</span>
            </label>
            <input
              id="reg-dni"
              type="tel"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              placeholder="12345678"
              maxLength={8}
              disabled={status === "loading" || status === "success"}
              className={inputClass(errors.dni)}
            />
            {errors.dni && (
              <p className="text-xs text-red-600 mt-1">{errors.dni}</p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="reg-age"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Edad <span className="text-primary">*</span>
          </label>
          <input
            id="reg-age"
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Ej. 20"
            min={1}
            disabled={status === "loading" || status === "success"}
            className={inputClass(errors.age)}
          />
          {errors.age && (
            <p className="text-xs text-red-600 mt-1">{errors.age}</p>
          )}
        </div>
      </div>

      {/* Celular / WhatsApp */}
      <div>
        <label
          htmlFor="reg-phone"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Número de WhatsApp <span className="text-primary">*</span>
        </label>
        <input
          id="reg-phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="999 999 999"
          maxLength={9}
          disabled={status === "loading" || status === "success"}
          className={inputClass(errors.phone)}
        />
        {errors.phone && (
          <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Actualmente eres */}
      <div>
        <label
          htmlFor="reg-occupation"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Actualmente eres <span className="text-primary">*</span>
        </label>
        <select
          id="reg-occupation"
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          disabled={status === "loading" || status === "success"}
          className={inputClass(errors.occupation)}
        >
          <option value="">Selecciona una opción</option>
          {OCCUPATION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.occupation && (
          <p className="text-xs text-red-600 mt-1">{errors.occupation}</p>
        )}
      </div>

      {/* Carrera o Área de Estudios */}
      <div>
        <label
          htmlFor="reg-career"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Carrera o Área de Estudios <span className="text-primary">*</span>
        </label>
        <input
          id="reg-career"
          type="text"
          name="career"
          value={form.career}
          onChange={handleChange}
          placeholder="Tu carrera o área"
          disabled={status === "loading" || status === "success"}
          className={inputClass(errors.career)}
        />
        {errors.career && (
          <p className="text-xs text-red-600 mt-1">{errors.career}</p>
        )}
      </div>

      {/* ¿Por qué te interesa participar en este taller/charla? */}
      <div>
        <label
          htmlFor="reg-interest"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          ¿Por qué te interesa participar en este taller/charla?{" "}
          <span className="text-primary">*</span>
        </label>
        <textarea
          id="reg-interest"
          name="interest_reason"
          value={form.interest_reason}
          onChange={handleChange}
          rows={3}
          placeholder="Cuéntanos brevemente..."
          disabled={status === "loading" || status === "success"}
          className={`${inputClass(errors.interest_reason)} resize-none`}
        />
        {errors.interest_reason && (
          <p className="text-xs text-red-600 mt-1">{errors.interest_reason}</p>
        )}
      </div>

      {/* ¿Cómo te enteraste de este taller? */}
      <div>
        <label
          htmlFor="reg-referral"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          ¿Cómo te enteraste de este taller?{" "}
          <span className="text-primary">*</span>
        </label>
        <select
          id="reg-referral"
          name="referral_source"
          value={form.referral_source}
          onChange={handleChange}
          disabled={status === "loading" || status === "success"}
          className={inputClass(errors.referral_source)}
        >
          <option value="">Selecciona una opción</option>
          {REFERRAL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.referral_source && (
          <p className="text-xs text-red-600 mt-1">{errors.referral_source}</p>
        )}
      </div>

      {/* ¿Eres estudiante en [Lugar del evento] (Opcional - solo presencial) */}
      {isPresencial && (
        <div className="mt-1 animate-[fadeIn_0.2s_ease]">
          <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
            <input
              type="checkbox"
              name="is_student_at_location"
              checked={form.is_student_at_location}
              onChange={handleChange}
              disabled={status === "loading" || status === "success"}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 cursor-pointer"
            />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              ¿Eres estudiante en {getCleanLocation()}?{" "}
              <span className="text-gray-400 font-normal">(Opcional)</span>
            </span>
          </label>
        </div>
      )}

      {status !== "success" && (
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full mt-2 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-heading"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Inscribiendo...
            </>
          ) : (
            "Confirmar Inscripción"
          )}
        </button>
      )}
    </form>
  );
}

function inputClass(hasError = false) {
  return `w-full rounded-xl border bg-white dark:bg-dark text-gray-900 dark:text-light px-4 py-2.5 text-sm outline-none transition-colors ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-gray-200 dark:border-gray-700 focus:border-primary"
  }`;
}
