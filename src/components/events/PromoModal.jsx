import { X, Timer, Calendar, MapPin, Ticket, Zap } from "lucide-react";
import { usePromoModal } from "../../hooks/usePromoModal";
import {
  categoryConfig,
  modalityConfig,
  formatEventDate,
} from "../../utils/events";
import { m, AnimatePresence } from "framer-motion";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='260' viewBox='0 0 600 260'%3E%3Crect width='600' height='260' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ESin imagen%3C/text%3E%3C/svg%3E";

/**
 * CountdownUnit — bloque individual del countdown con diseño premium
 */
function CountdownUnit({ value, label, isUrgent }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 min-w-[70px] shadow-sm backdrop-blur-sm">
      <span
        className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-none tabular-nums ${
          isUrgent ? "text-orange-500 animate-pulse" : "text-white"
        }`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function Separator({ isUrgent }) {
  return (
    <span
      className={`text-xl sm:text-2xl font-bold mb-5 self-center animate-pulse ${
        isUrgent ? "text-orange-500" : "text-white/40"
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
  const navigate = useNavigate();
  const {
    isOpen,
    event,
    isLoading,
    countdown,
    close,
  } = usePromoModal();

  if (isLoading || !event) {
    return null;
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
    event.description?.length > 180
      ? event.description.slice(0, 180) + "..."
      : event.description;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 sm:px-6"
          >
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row border border-white/10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-hidden"
            >
              {/* Botón X superior derecho (capa superior) */}
              <button
                onClick={close}
                className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer text-white"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Banner / Imagen (Lado izquierdo) */}
              <div className="relative w-full md:w-5/12 lg:w-1/2 min-h-[240px] md:min-h-[500px] bg-gray-950 flex items-center justify-center p-4 md:p-6 overflow-hidden">
                {/* Imagen de fondo difuminada para efecto de profundidad */}
                <img
                  src={
                    optimizeCloudinaryUrl(event.banner_url, { width: 400 }) ||
                    PLACEHOLDER_SVG
                  }
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 pointer-events-none scale-105"
                />

                {/* Imagen frontal contenida nítida */}
                <img
                  src={
                    optimizeCloudinaryUrl(event.banner_url, { width: 800 }) ||
                    PLACEHOLDER_SVG
                  }
                  alt={event.title}
                  className="max-w-full max-h-[200px] md:max-h-full object-contain shadow-2xl rounded-2xl z-10 border border-white/10"
                  loading="lazy"
                  width="800"
                  height="500"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_SVG;
                  }}
                />

                {/* Degradados decorativos en las esquinas */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent pointer-events-none z-10" />

                {/* Badge categoría elegante */}
                <span className="absolute top-5 left-5 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md bg-white/10 text-white border border-white/15 z-20">
                  {catCfg.label}
                </span>
              </div>

              {/* Contenido (Lado derecho) */}
              <div className="w-full md:w-7/12 lg:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-gray-900">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 pr-10">
                  {event.title}
                </h2>
                {description && (
                  <p className="text-xs sm:text-base text-gray-400 mb-4 md:mb-6 leading-relaxed line-clamp-3 md:line-clamp-none">
                    {description}
                  </p>
                )}

                {/* Fecha y lugar - Oculto en móvil para ahorrar espacio */}
                <div className="hidden md:flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span className="font-semibold text-white">
                      {formatEventDate(event.starts_at)}
                    </span>
                  </div>
                  {event.location && event.modality !== "virtual" && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span className="font-semibold text-white">
                        {event.location}
                      </span>
                    </div>
                  )}
                </div>

                {event.spots_left !== null && event.spots_left > 0 && (
                  <div className="mb-4 md:mb-6 inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold text-[10px] md:text-sm w-fit">
                    <Zap className="w-3.5 h-3.5 animate-pulse text-orange-400" />
                    <span>Solo {event.spots_left} cupos restantes</span>
                  </div>
                )}

                {/* Countdown - Más compacto en móvil */}
                {countdown && !countdown.isExpired && (
                  <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Timer className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {countdown.isUrgent
                          ? "¡Menos de 24 horas!"
                          : "El evento comienza en"}
                      </span>
                    </div>
                    <div className="flex items-end gap-2.5 sm:gap-3">
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
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <button
                    onClick={() => {
                      close();
                      navigate(`/eventos/${event.slug}`);
                    }}
                    className="flex-1 py-4 px-6 rounded-xl font-extrabold text-base transition-all bg-primary hover:bg-primary/95 text-white hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/25 hover:shadow-primary/30 flex items-center justify-center gap-2"
                  >
                    <span>Reserva tu cupo ahora</span>
                    <Ticket className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
