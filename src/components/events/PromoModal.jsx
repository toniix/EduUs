import { X, Timer } from "lucide-react";
import { usePromoModal } from "../../hooks/usePromoModal";
import { categoryConfig, modalityConfig, formatEventDate } from "../../utils/events";
import RegisterModal from "./RegisterModal";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='260' viewBox='0 0 600 260'%3E%3Crect width='600' height='260' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ESin imagen%3C/text%3E%3C/svg%3E";

/**
 * CountdownUnit — bloque individual del countdown
 */
function CountdownUnit({ value, label, isUrgent }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`text-2xl font-extrabold tabular-nums ${
          isUrgent ? "text-orange-500" : "text-white"
        }`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </div>
  );
}

function Separator({ isUrgent }) {
  return (
    <span
      className={`text-xl font-bold mb-4 ${
        isUrgent ? "text-orange-500" : "text-white"
      }`}
    >
      :
    </span>
  );
}

/**
 * PromoModal — modal promocional automático con countdown.
 * Toda la lógica está en usePromoModal.
 */
export default function PromoModal() {
  const {
    isOpen,
    event,
    isLoading,
    countdown,
    close,
    openRegister,
    registerOpen,
    closeRegister,
  } = usePromoModal();

  // No renderizar nada si carga o si no hay evento promo
  if (isLoading || !event || !isOpen) {
    return registerOpen && event ? (
      <RegisterModal event={event} onClose={closeRegister} />
    ) : null;
  }

  const catCfg = categoryConfig[event.category] || {
    label: event.category,
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const modalCfg = modalityConfig[event.modality] || {
    label: event.modality,
    icon: "📍",
  };

  const description =
    event.description?.length > 120
      ? event.description.slice(0, 120) + "..."
      : event.description;

  return (
    <>
      {/* Overlay — clic fuera NO cierra (es intencional) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
          {/* Botón X */}
          <button
            onClick={close}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Banner */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.banner_url || PLACEHOLDER_SVG}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_SVG;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-gray-900" />
            {/* Badge categoría */}
            <span
              className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full border ${catCfg.badgeClass}`}
            >
              {catCfg.label}
            </span>
          </div>

          {/* Contenido */}
          <div className="px-6 pb-6 pt-2">
            <h2 className="text-lg font-bold text-white leading-snug mb-1">
              {event.title}
            </h2>
            {description && (
              <p className="text-sm text-gray-400 mb-3">{description}</p>
            )}

            {/* Fecha y lugar */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
              <span>📅 {formatEventDate(event.starts_at)}</span>
              <span>
                {modalCfg.icon} {event.location}
              </span>
              {event.spots_left !== null && event.spots_left > 0 && (
                <span className="text-orange-400 font-semibold">
                  ⚡ {event.spots_left} cupos restantes
                </span>
              )}
            </div>

            {/* Countdown */}
            {countdown && !countdown.isExpired && (
              <div className="mb-5">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
                  <Timer className="w-3.5 h-3.5" />
                  <span>
                    {countdown.isUrgent
                      ? "¡Menos de 24 horas!"
                      : "El evento comienza en"}
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  {countdown.days > 0 && (
                    <>
                      <CountdownUnit
                        value={countdown.days}
                        label="días"
                        isUrgent={countdown.isUrgent}
                      />
                      <Separator isUrgent={countdown.isUrgent} />
                    </>
                  )}
                  <CountdownUnit
                    value={countdown.hours}
                    label="horas"
                    isUrgent={countdown.isUrgent}
                  />
                  <Separator isUrgent={countdown.isUrgent} />
                  <CountdownUnit
                    value={countdown.minutes}
                    label="min"
                    isUrgent={countdown.isUrgent}
                  />
                  <Separator isUrgent={countdown.isUrgent} />
                  <CountdownUnit
                    value={countdown.seconds}
                    label="seg"
                    isUrgent={countdown.isUrgent}
                  />
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={openRegister}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Quiero inscribirme
              </button>
              <button
                onClick={close}
                className="px-4 py-3 rounded-xl border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Quizás después
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RegisterModal abierto desde PromoModal */}
      {registerOpen && (
        <RegisterModal event={event} onClose={closeRegister} />
      )}
    </>
  );
}
