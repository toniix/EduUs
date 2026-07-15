import {
  Calendar,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useFeaturedEvent } from "../../hooks/useEvents";
import {
  categoryConfig,
  formatEventDate,
} from "../../utils/events";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function EventsSection() {
  const navigate = useNavigate();
  const { event, loading } = useFeaturedEvent();
  if (!event) return null;

  const catCfg = event
    ? categoryConfig[event.category] || {
        label: event.category,
        badgeClass: "bg-white/10 text-white border-white/20",
      }
    : null;

  return (
    <section className="relative py-24 overflow-hidden bg-gray-950 border-t border-b border-white/5">
      {/* Radial glow decorativo */}
      <div
        aria-hidden="true"
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[70%] h-[45%] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, rgba(236, 69, 29, 0.6) 0%, transparent 70%)",
        }}
      />
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading skeleton */}
        {loading && (
          <div className="animate-pulse rounded-3xl overflow-hidden bg-white/5 h-80 border border-white/10" />
        )}

        {!loading && event && (
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-12"
          >
            {/* Section heading */}
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                ✦ Próximo evento destacado ✦
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight font-heading">
                Aprende y potencia tu carrera 🚀
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Descubre talleres prácticos y ponencias interactivas diseñadas para acelerar tu desarrollo profesional.
              </p>
            </div>

            {/* Hero card */}
            <div className="rounded-[2rem] overflow-hidden flex flex-col md:flex-row bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl shadow-black/60 group hover:border-white/15 transition-colors duration-300">
              {/* Left — contenido */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center gap-6">
                {/* Badge */}
                <div className="flex items-center gap-2 w-fit">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    Reserva tu cupo antes que se agoten
                  </span>
                </div>

                {/* Título */}
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-heading group-hover:text-primary transition-colors duration-300">
                  {event.title}
                </h3>

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-300">
                  {event.starts_at && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{formatEventDate(event.starts_at)}</span>
                    </span>
                  )}
                  {event.location && event.modality !== "virtual" && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{event.location}</span>
                    </span>
                  )}
                </div>

                {/* Descripción */}
                {event.description && (
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xl line-clamp-3">
                    {event.description}
                  </p>
                )}

                {/* Botones */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="button"
                    onClick={() => navigate(`/eventos/${event.slug}`)}
                    className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition-all bg-primary hover:bg-primary/95 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 hover:shadow-primary/35"
                  >
                    <span>Reservar mi lugar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-gray-200 active:scale-[0.98]"
                    >
                      Ver agenda
                    </a>
                  )}
                </div>
              </div>

              {/* Right — imagen */}
              <div className="w-full md:w-5/12 lg:w-2/5 min-h-[260px] md:min-h-0 flex-shrink-0 relative overflow-hidden">
                <img
                  src={optimizeCloudinaryUrl(event.banner_url, 800)}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width="800"
                  height="600"
                />
                
                {/* gradient overlay izquierdo para blend con card */}
                <div className="absolute inset-y-0 left-0 w-16 hidden md:block bg-gradient-to-r from-gray-900/40 to-transparent pointer-events-none" />
                
                {catCfg && (
                  <span className={`absolute top-5 right-5 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border shadow-lg backdrop-blur-md ${catCfg.badgeClass}`}>
                    {catCfg.label}
                  </span>
                )}
              </div>
            </div>
          </m.div>
        )}
      </div>

      {/* Modal de registro removido - Redirección activa */}
    </section>
  );
}
