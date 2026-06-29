import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { eventsService } from "../../services/eventsService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EventRegistrationForm({ event, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    career: "",
    university: "Universidad de Piura",
    dni: "",
    phone: "",
    is_udep: true,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!form.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = "Ingresa un correo válido.";
    }
    if (!form.career.trim()) newErrors.career = "La carrera es obligatoria.";
    if (!form.is_udep && !form.university.trim())
      newErrors.university = "La universidad es obligatoria.";
    if (!form.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio.";
    } else if (!/^\d{8}$/.test(form.dni.trim())) {
      newErrors.dni = "Ingresa un DNI válido (8 dígitos).";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "El número es obligatorio.";
    } else if (!/^\d{9}$/.test(form.phone.trim().replace(/\s/g, ""))) {
      newErrors.phone = "Ingresa un número válido (9 dígitos).";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");
    setApiError("");

    const { success, error } = await eventsService.registerForEvent(event.id, {
      name: form.name.trim(),
      email: form.email.trim(),
      career: form.career.trim(),
      university: form.is_udep
        ? "Universidad de Piura"
        : form.university.trim(),
      is_udep: form.is_udep,
      dni: form.dni.trim(),
      phone: form.phone.trim(),
    });

    if (success) {
      setStatus("success");
      if (onSuccess) onSuccess(form.name);
    } else {
      setStatus("error");
      setApiError(
        error || "Error al procesar tu inscripción. Intenta de nuevo.",
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {apiError}
        </div>
      )}

      <div>
        <label
          htmlFor="reg-name"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Nombre completo <span className="text-primary">*</span>
        </label>
        <input
          id="reg-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          disabled={status === "loading" || status === "success"}
          className={`w-full rounded-xl border bg-white dark:bg-dark text-gray-900 dark:text-light px-4 py-2.5 text-sm outline-none transition-colors ${
            errors.name
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700 focus:border-primary"
          }`}
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

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
          className={`w-full rounded-xl border bg-white dark:bg-dark text-gray-900 dark:text-light px-4 py-2.5 text-sm outline-none transition-colors ${
            errors.email
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700 focus:border-primary"
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="reg-career"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Carrera <span className="text-primary">*</span>
          </label>
          <input
            id="reg-career"
            type="text"
            name="career"
            value={form.career}
            onChange={handleChange}
            placeholder="Tu carrera"
            disabled={status === "loading" || status === "success"}
            className={`w-full rounded-xl border bg-white dark:bg-dark text-gray-900 dark:text-light px-4 py-2.5 text-sm outline-none transition-colors ${
              errors.career
                ? "border-red-400"
                : "border-gray-200 dark:border-gray-700 focus:border-primary"
            }`}
          />
        </div>
        <div>
          <label
            htmlFor="reg-dni"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            DNI <span className="text-primary">*</span>
          </label>
          <input
            id="reg-dni"
            type="text"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            placeholder="12345678"
            maxLength={8}
            disabled={status === "loading" || status === "success"}
            className={`w-full rounded-xl border bg-white dark:bg-dark text-gray-900 dark:text-light px-4 py-2.5 text-sm outline-none transition-colors ${
              errors.dni
                ? "border-red-400"
                : "border-gray-200 dark:border-gray-700 focus:border-primary"
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              ¿Eres de la UDEP?
            </span>
            <span className="text-[10px] text-gray-500">
              Universidad de Piura
            </span>
          </div>
          <button
            type="button"
            disabled={status === "loading" || status === "success"}
            onClick={() => {
              const newValue = !form.is_udep;
              setForm((prev) => ({
                ...prev,
                is_udep: newValue,
                university: newValue ? "Universidad de Piura" : "",
              }));
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              form.is_udep ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.is_udep ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 italic px-1 leading-tight">
          * Esta información es exclusiva para gestionar tu ingreso al campus.
          <span className="text-primary/70 font-medium">
            {" "}
            El evento es abierto al público en general.
          </span>
        </p>
      </div>

      {!form.is_udep && (
        <div className="animate-[fadeIn_0.2s_ease]">
          <label
            htmlFor="reg-university"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Universidad de origen <span className="text-primary">*</span>
          </label>
          <input
            id="reg-university"
            type="text"
            name="university"
            value={form.university}
            onChange={handleChange}
            placeholder="Ej: UNMSM, PUCP, etc."
            disabled={status === "loading" || status === "success"}
            className={`w-full rounded-xl border bg-white dark:bg-dark text-gray-900 dark:text-light px-4 py-2.5 text-sm outline-none transition-colors ${
              errors.university
                ? "border-red-400"
                : "border-gray-200 dark:border-gray-700 focus:border-primary"
            }`}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="reg-phone"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Celular <span className="text-primary">*</span>
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
          className={`w-full rounded-xl border bg-white dark:bg-dark text-gray-900 dark:text-light px-4 py-2.5 text-sm outline-none transition-colors ${
            errors.phone
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700 focus:border-primary"
          }`}
        />
      </div>

      {status !== "success" && (
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full mt-2 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-heading"
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
