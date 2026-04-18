import { m, AnimatePresence } from "framer-motion";
import {
  categoryConfig,
  modalityConfig,
  formatEventDate,
} from "../../utils/events";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";

const PLACEHOLDER = "https://via.placeholder.com/400x200?text=Evento";

export default function EventCard({
  event,
  expanded,
  onToggle,
  onRegisterClick,
}) {
  const {
    title,
    category,
    modality,
    starts_at,
    capacity,
    spots_left,
    price,
    description,
    banner_url,
  } = event;

  const catCfg = categoryConfig[category] || {
    label: category,
    badgeClass: "bg-gray-100 text-gray-700",
  };

  const modalCfg = modalityConfig[modality] || {
    label: modality,
    icon: "📍",
  };

  const isSoldOut = spots_left === 0;
  const showSpots = capacity !== null && spots_left !== null;

  return (
    <m.div
      layout
      className="border border-gray-200 rounded-xl bg-white 
      hover:border-primary/40 hover:shadow-sm
      transition-all duration-300 overflow-hidden"
    >
      {/* HEADER */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex flex-col gap-2 text-left"
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catCfg.badgeClass}`}
          >
            {catCfg.label}
          </span>

          <m.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-gray-400"
          >
            ▼
          </m.div>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
          {title}
        </h3>

        <div className="text-xs text-gray-500 flex gap-2 items-center">
          <span>
            {modalCfg.icon} {modalCfg.label}
          </span>
          <span>·</span>
          <span>{formatEventDate(starts_at)}</span>
        </div>
      </button>

      {/* CTA SIEMPRE VISIBLE */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onRegisterClick(event)}
          disabled={isSoldOut}
          className={`w-full py-2 rounded-lg text-sm font-medium transition ${
            isSoldOut
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {isSoldOut ? "Sin cupos" : "Inscribirse"}
        </button>
      </div>

      {/* EXPANSIÓN */}
      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <m.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-h-[450px] w-full overflow-hidden bg-gray-50 flex items-center justify-center"
            >
              <img
                src={optimizeCloudinaryUrl(banner_url, { width: 600 }) || PLACEHOLDER}
                alt={title}
                className="w-full h-full object-contain"
              />
            </m.div>

            {/* Contenido */}
            <div className="p-4 flex flex-col gap-3">
              {description && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}

              <p className="text-sm font-semibold text-primary">
                {price === 0 ? "Gratuito" : `S/ ${price}`}
              </p>

              {showSpots && (
                <p
                  className={`text-xs ${
                    spots_left <= 5 ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  {spots_left <= 5 && spots_left > 0
                    ? `⚡ Solo quedan ${spots_left} cupos`
                    : `${spots_left} cupos disponibles`}
                </p>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
