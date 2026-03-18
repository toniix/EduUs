import { categoryConfig, modalityConfig, formatEventDate } from "../../utils/events";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect width='400' height='220' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ESin imagen%3C/text%3E%3C/svg%3E";

/**
 * EventCard — tarjeta individual de evento para la sección pública.
 * Props:
 *  - event: Object
 *  - onRegisterClick: (event) => void
 */
export default function EventCard({ event, onRegisterClick }) {
  const {
    title,
    category,
    modality,
    starts_at,
    banner_url,
    capacity,
    spots_left,
    price,
  } = event;

  const catCfg = categoryConfig[category] || {
    label: category,
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const modalCfg = modalityConfig[modality] || { label: modality, icon: "📍" };

  const isSoldOut = spots_left === 0;
  const showSpots = capacity !== null && spots_left !== null;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 group">
      {/* Banner */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={banner_url || PLACEHOLDER_SVG}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_SVG;
          }}
        />
        {/* Badge categoría sobre imagen */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${catCfg.badgeClass}`}
        >
          {catCfg.label}
        </span>
        {/* Badge agotado */}
        {isSoldOut && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-red-600 text-white">
            Agotado
          </span>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Modalidad y fecha */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            {modalCfg.icon} {modalCfg.label}
          </span>
          <span className="text-gray-300">·</span>
          <span>{formatEventDate(starts_at)}</span>
        </div>

        {/* Título */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Precio */}
        <p className="text-xs font-semibold text-primary">
          {price === 0 ? "Gratuito" : `S/ ${price}`}
        </p>

        {/* Cupos disponibles */}
        {showSpots && (
          <p
            className={`text-xs font-medium ${
              spots_left <= 5 ? "text-orange-600" : "text-gray-500"
            }`}
          >
            {spots_left <= 5 && spots_left > 0
              ? `⚡ Solo quedan ${spots_left} cupos`
              : `${spots_left} cupos disponibles`}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Botón */}
        <button
          onClick={() => onRegisterClick(event)}
          disabled={isSoldOut}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
            isSoldOut
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {isSoldOut ? "Sin cupos" : "Inscribirse"}
        </button>
      </div>
    </article>
  );
}
