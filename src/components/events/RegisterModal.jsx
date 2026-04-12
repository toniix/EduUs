import { useState, useEffect, useRef } from "react";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { eventsService } from "../../services/eventsService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * RegisterModal — modal de inscripción a un evento.
 * Props:
 *  - event: Object
 *  - onClose: () => void
 */
export default function RegisterModal({ event, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", career: "", university: "", dni: "", phone: "" });
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
    if (!form.university.trim()) newErrors.university = "La universidad es obligatoria.";
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
      university: form.university.trim(),
      dni: form.dni.trim(),
      phone: form.phone.trim(),
    });

    if (success) {
      setStatus("success");
    } else {
      setStatus("error");
      setApiError(error || "Error al procesar tu inscripción. Intenta de nuevo.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-[fadeInUp_0.25s_ease] max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="pr-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Inscripción
            </p>
            <h2 id="register-modal-title" className="text-base font-bold text-gray-900 leading-snug">
              {event?.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Estado éxito */}
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
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Error de API */}
              {status === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {apiError}
                </div>
              )}

              {/* Nombre */}
              <div>
                <label htmlFor="reg-name" className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Correo */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Carrera */}
              <div>
                <label htmlFor="reg-career" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Carrera <span className="text-primary">*</span>
                </label>
                <input
                  id="reg-career"
                  type="text"
                  name="career"
                  value={form.career}
                  onChange={handleChange}
                  placeholder="Ej: Ingeniería de Sistemas"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
                    errors.career
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.career && (
                  <p className="text-xs text-red-600 mt-1">{errors.career}</p>
                )}
              </div>

              {/* Universidad */}
              <div>
                <label htmlFor="reg-university" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Universidad <span className="text-primary">*</span>
                </label>
                <input
                  id="reg-university"
                  type="text"
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                  placeholder="Ej: Universidad Nacional Mayor de San Marcos"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
                    errors.university
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                {errors.university && (
                  <p className="text-xs text-red-600 mt-1">{errors.university}</p>
                )}
              </div>

              {/* DNI y Teléfono en una fila */}
              <div className="grid grid-cols-2 gap-3">
                {/* DNI */}
                <div>
                  <label htmlFor="reg-dni" className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                  {errors.dni && (
                    <p className="text-xs text-red-600 mt-1">{errors.dni}</p>
                  )}
                </div>

                {/* Número de celular */}
                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Confirmar inscripción"
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
