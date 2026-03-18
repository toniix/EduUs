import { useState } from "react";
import { X } from "lucide-react";
import EventCard from "../../events/EventCard";
import { categoryConfig, modalityConfig, formatEventDate } from "../../../utils/events";

/**
 * EventPreviewModal — vista previa del evento en sus dos formatos.
 * Props:
 *  - event: Object — puede ser el formData no guardado para preview en tiempo real
 *  - onClose: () => void
 */
export default function EventPreviewModal({ event, onClose }) {
  const [activeTab, setActiveTab] = useState("card");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-gray-900">Vista previa</h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
              Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Tabs internos */}
        <div className="flex border-b border-gray-100 px-6">
          {[
            { value: "card", label: "Vista tarjeta" },
            { value: "promo", label: "Vista modal promo" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto p-6 flex-1">
          {activeTab === "card" && (
            <div className="max-w-xs mx-auto">
              <EventCard event={event} onRegisterClick={() => {}} />
            </div>
          )}

          {activeTab === "promo" && (
            <PromoPreview event={event} />
          )}
        </div>
      </div>
    </div>
  );
}

/* Vista previa inlinea del modal promo, sin lógica de timer/localStorage */
function PromoPreview({ event }) {

  const catCfg = categoryConfig[event.category] || {
    label: event.category || "Categoría",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const modalCfg = modalityConfig[event.modality] || {
    label: event.modality || "Modalidad",
    icon: "📍",
  };

  const description =
    (event.description || "").length > 120
      ? event.description.slice(0, 120) + "..."
      : event.description;

  const PLACEHOLDER_SVG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='180' viewBox='0 0 600 180'%3E%3Crect width='600' height='180' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%236b7280'%3ESin imagen%3C/text%3E%3C/svg%3E";

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      {/* Banner */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={event.banner_url || PLACEHOLDER_SVG}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_SVG;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-gray-900" />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${catCfg.badgeClass}`}
        >
          {catCfg.label}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-white leading-snug mb-1">
          {event.title || "Título del evento"}
        </h3>
        {description && (
          <p className="text-xs text-gray-400 mb-3">{description}</p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-4">
          {event.starts_at && (
            <span>📅 {formatEventDate(event.starts_at)}</span>
          )}
          {event.location && (
            <span>
              {modalCfg.icon} {event.location}
            </span>
          )}
        </div>

        {/* Countdown placeholder */}
        <div className="flex gap-3 mb-1">
          {["00", "00", "00", "00"].map((v, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xl font-extrabold text-white tabular-nums">
                {v}
              </span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wide">
                {["días", "horas", "min", "seg"][i]}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold">
            Quiero inscribirme
          </button>
          <button className="px-3 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-xs font-medium">
            Quizás después
          </button>
        </div>
      </div>
    </div>
  );
}
