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
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
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
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-[fadeInUp_0.25s_ease]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="pr-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Inscripción
            </p>
            <h2 className="text-base font-bold text-gray-900 leading-snug">
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
        <div className="p-6">
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
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nombre completo <span className="text-primary">*</span>
                </label>
                <input
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
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Correo electrónico <span className="text-primary">*</span>
                </label>
                <input
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

              {/* Teléfono */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Teléfono{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+51 999 999 999"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
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
