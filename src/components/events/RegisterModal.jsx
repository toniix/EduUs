import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, Info } from "lucide-react";
import { categoryConfig } from "../../utils/events";
import EventRegistrationForm from "./EventRegistrationForm";

/**
 * RegisterModal — modal de inscripción a un evento.
 */
export default function RegisterModal({ event, onClose }) {
  const [successName, setSuccessName] = useState("");
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

  const handleSuccess = (name) => {
    setSuccessName(name);
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
        {!successName && (
          <div className="mx-6 p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
              Completa tus datos para asegurar tu cupo. Recibirás un correo de
              confirmación al finalizar.
            </p>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1">
          {successName ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <div>
                <p className="text-lg font-bold text-gray-900">
                  ¡Inscripción exitosa!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Hola <span className="font-semibold">{successName}</span>, te
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
            <EventRegistrationForm event={event} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
