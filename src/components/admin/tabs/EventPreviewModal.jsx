import { X, Timer } from "lucide-react";
import { categoryConfig, modalityConfig, formatEventDate } from "../../../utils/events";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='260' viewBox='0 0 600 260'%3E%3Crect width='600' height='260' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ESin imagen%3C/text%3E%3C/svg%3E";

function CountdownUnit({ value, label, isUrgent }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`text-2xl font-extrabold tabular-nums ${isUrgent ? "text-orange-500" : "text-white"
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
      className={`text-xl font-bold mb-4 ${isUrgent ? "text-orange-500" : "text-white"
        }`}
    >
      :
    </span>
  );
}

export default function EventPreviewModal({ event, onClose }) {

  console.log(event);
  const catCfg = categoryConfig[event?.category] || {
    label: event?.category || "Categoría",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const modalCfg = modalityConfig[event?.modality] || {
    label: event?.modality || "Modalidad",
    icon: "📍",
  };

  const description =
    event?.description?.length > 180
      ? event.description.slice(0, 180) + "..."
      : event?.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 sm:px-6">
      <div className="bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row border border-white/10 max-h-[90vh]">
        {/* Botón X superior derecho (capa superior) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-sm transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Banner / Imagen (Lado izquierdo) */}
        <div className="relative w-full md:w-5/12 lg:w-1/2 min-h-[200px] sm:min-h-[250px] md:min-h-full">
          <img
            src={event?.banner_url || PLACEHOLDER_SVG}
            alt={event?.title || "Vista previa"}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_SVG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/20 md:to-slate-900" />
          {/* Badge categoría elegante */}
          <span
            className={`absolute top-5 left-5 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md bg-white/90 text-gray-900 border border-white/50`}
          >
            {catCfg.label}
          </span>
          <span className="absolute top-5 right-16 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg bg-yellow-400 text-yellow-900">
            Vista Previa
          </span>
        </div>

        {/* Contenido (Lado derecho) */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-slate-900 overflow-y-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4 pr-10">
            {event?.title || "Título del evento"}
          </h2>
          {description && (
            <p className="text-sm sm:text-base text-slate-400 mb-6 leading-relaxed">
              {description}
            </p>
          )}

          {/* Fecha y lugar */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-300 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span className="font-medium text-white">{event?.starts_at ? formatEventDate(event.starts_at) : 'Fecha por definir'}</span>
            </div>
            {event?.location && event?.modality !== 'virtual' && (
              <div className="flex items-center gap-2">
                <span className="text-lg">{modalCfg.icon}</span>
                <span className="font-medium text-white">{event.location}</span>
              </div>
            )}
          </div>

          {event?.spots_left !== null && event?.spots_left > 0 && (
            <div className="mb-6 inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-lg font-semibold text-sm w-fit">
              <span className="animate-pulse">⚡</span> Solo {event.spots_left} cupos restantes
            </div>
          )}

          {/* Countdown Mock */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Timer className="w-4 h-4 text-primary" />
              <span className="font-medium">
                El evento comienza en (Demo)
              </span>
            </div>
            <div className="flex items-end gap-3">
              <CountdownUnit
                value={0}
                label="días"
                isUrgent={false}
              />
              <Separator isUrgent={false} />
              <CountdownUnit
                value={0}
                label="horas"
                isUrgent={false}
              />
              <Separator isUrgent={false} />
              <CountdownUnit
                value={0}
                label="min"
                isUrgent={false}
              />
              <Separator isUrgent={false} />
              <CountdownUnit
                value={0}
                label="seg"
                isUrgent={false}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              onClick={(e) => e.preventDefault()}
              className="flex-1 py-4 rounded-xl font-extrabold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 cursor-default"
              style={{ background: "var(--color-primary, #e6461e)", color: "#fff" }}
            >
              Reserva tu cupo ahora
            </button>
            <button
              onClick={onClose}
              className="py-4 px-6 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              Cerrar vista previa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
