import { useState, useEffect, useRef } from "react";
import { X, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { eventsService } from "../../services/eventsService";
import { categoryConfig } from "../../utils/events";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * RegisterModal — modal de inscripción a un evento.
 */
export default function RegisterModal({ event, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    career: "",
    university: "Universidad de Piura",
    dni: "",
    phone: "",
    is_udep: true, // Por defecto asumimos que es de la UDEP
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");
  const overlayRef = useRef(null);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

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

  const catCfg = categoryConfig[event?.category] || {
    label: event?.category,
    badgeClass: "bg-gray-100 text-gray-700",
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="presentation"
      aria-hidden="true"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative animate-[fadeInUp_0.25s_ease] max-h-[95vh] flex flex-col border border-white/20"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-modal-title"
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${catCfg.badgeClass}`}
              >
                {catCfg.label}
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                Inscripción
              </span>
            </div>
            <h2
              id="register-modal-title"
              className="text-xl font-extrabold text-gray-900 leading-tight"
            >
              {event?.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-all hover:rotate-90 duration-300 flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mx-6 p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
            Completa tus datos para asegurar tu cupo. Recibirás un correo de
            confirmación al finalizar.
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1">
          {status === "success" ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <div>
                <p className="text-lg font-bold text-gray-900">
                  ¡Inscripción exitosa!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Hola <span className="font-semibold">{form.name}</span>, te
                  esperamos en el evento. Revisa tu correo para más detalles.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Listo
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              {status === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {apiError}
                </div>
              )}

              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
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
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
                    errors.name
                      ? "border-red-400"
                      : "border-gray-200 focus:border-primary"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
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
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-200 focus:border-primary"
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
                    className="block text-xs font-semibold text-gray-700 mb-1.5"
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
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
                      errors.career
                        ? "border-red-400"
                        : "border-gray-200 focus:border-primary"
                    }`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-dni"
                    className="block text-xs font-semibold text-gray-700 mb-1.5"
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
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
                      errors.dni
                        ? "border-red-400"
                        : "border-gray-200 focus:border-primary"
                    }`}
                  />
                </div>
              </div>

              {/* Pregunta UDEP + Disclaimer */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">
                      ¿Eres de la UDEP?
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Universidad de Piura
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = !form.is_udep;
                      setForm((prev) => ({
                        ...prev,
                        is_udep: newValue,
                        university: newValue ? "Universidad de Piura" : "",
                      }));
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      form.is_udep ? "bg-primary" : "bg-gray-300"
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
                  * Esta información es exclusiva para gestionar tu ingreso al
                  campus.
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
                    className="block text-xs font-semibold text-gray-700 mb-1.5"
                  >
                    Universidad de origen{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    id="reg-university"
                    type="text"
                    name="university"
                    value={form.university}
                    onChange={handleChange}
                    placeholder="Ej: UNMSM, PUCP, etc."
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
                      errors.university
                        ? "border-red-400"
                        : "border-gray-200 focus:border-primary"
                    }`}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="reg-phone"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
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
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
                    errors.phone
                      ? "border-red-400"
                      : "border-gray-200 focus:border-primary"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all font-outfit"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-[2] py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-outfit"
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
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
