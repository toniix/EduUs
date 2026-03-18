import { useState } from "react";
import { Calendar, MapPin, Clock, ArrowRight, Users, Lightbulb, Award } from "lucide-react";
import { useFeaturedEvent } from "../../hooks/useEvents";
import { categoryConfig, modalityConfig, formatEventDate } from "../../utils/events";
import RegisterModal from "./RegisterModal";

/** Highlights estáticas del evento — iconos y textos representativos de la org */
const HIGHLIGHTS = [
  {
    icon: <Users className="w-5 h-5 text-primary" />,
    title: "Comunidad activa",
    desc: "Conecta con jóvenes comprometidos con el aprendizaje y el desarrollo.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-primary" />,
    title: "Aprendizaje práctico",
    desc: "Dinámicas, talleres y actividades diseñadas para el crecimiento real.",
  },
  {
    icon: <Award className="w-5 h-5 text-primary" />,
    title: "Certificación",
    desc: "Recibe constancia de participación al finalizar el evento.",
  },
];

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239ca3af'%3EImagen del evento%3C/text%3E%3C/svg%3E";


export default function EventsSection() {
  const { event, loading } = useFeaturedEvent();
  const [registerOpen, setRegisterOpen] = useState(false);
  if (!event) return null;
  function splitTitle(title = "") {
    const words = title.trim().split(" ");
    const mid = Math.ceil(words.length / 2);
    return {
      line1: words.slice(0, mid).join(" "),
      line2: words.slice(mid).join(" "),
    };
  }

  const catCfg = event ? (categoryConfig[event.category] || { label: event.category, badgeClass: "bg-gray-100 text-gray-600" }) : null;
  const modalCfg = event ? (modalityConfig[event.modality] || { label: event.modality, icon: "📍" }) : null;
  const { line1, line2 } = splitTitle(event?.title);

  // Formato de hora: "09:00 AM"
  function formatTime(iso) {
    if (!iso) return null;
    return new Intl.DateTimeFormat("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  }

  const timeRange = event?.starts_at
    ? `${formatTime(event.starts_at)}${event.ends_at ? ` - ${formatTime(event.ends_at)}` : ""}`
    : null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Loading skeleton ─── */}
        {loading && (
          <div className="animate-pulse rounded-3xl overflow-hidden bg-white shadow-lg h-80" />
        )}
        {/* ─── Evento destacado ─── */}
        {!loading && event && (
          <>
            {/* Hero card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">

              {/* Left — contenido */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center gap-5">

                {/* Badge */}
                <div className="flex items-center gap-2 w-fit">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                    No te pierdas nuestro próximo evento
                  </span>
                </div>

                {/* Título dos líneas */}
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                    {line1}
                  </h2>
                  {line2 && (
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary leading-tight">
                      {line2}
                    </h2>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                  {event.starts_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      {formatEventDate(event.starts_at)}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      {event.location}
                    </span>
                  )}
                  {timeRange && (
                    <span className="flex items-center gap-1.5 w-full sm:w-auto">
                      <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                      {timeRange}
                    </span>
                  )}
                </div>

                {/* Descripción */}
                {event.description && (
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md line-clamp-3">
                    {event.description}
                  </p>
                )}

                {/* Botones */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={() => setRegisterOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm shadow-md shadow-primary/20"
                  >
                    Reservar mi lugar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      Ver agenda
                    </a>
                  )}
                </div>
              </div>

              {/* Right — imagen */}
              <div className="w-full md:w-5/12 lg:w-2/5 min-h-[240px] md:min-h-0 flex-shrink-0 relative overflow-hidden">
                <img
                  src={event.banner_url || PLACEHOLDER_SVG}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER_SVG; }}
                />
                {/* Categoría badge sobre la imagen */}
                {catCfg && (
                  <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border ${catCfg.badgeClass}`}>
                    {catCfg.label}
                  </span>
                )}
                {/* Modalidad */}
                {modalCfg && (
                  <span className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {modalCfg.icon} {modalCfg.label}
                  </span>
                )}
              </div>
            </div>

            {/* ─── Highlights ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {HIGHLIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {h.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{h.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Register Modal */}
      {registerOpen && event && (
        <RegisterModal
          event={event}
          onClose={() => setRegisterOpen(false)}
        />
      )}
    </section>
  );
}
