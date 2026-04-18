import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Lightbulb,
  Award,
} from "lucide-react";
import { useFeaturedEvent } from "../../hooks/useEvents";
import {
  categoryConfig,
  modalityConfig,
  formatEventDate,
} from "../../utils/events";
import RegisterModal from "./RegisterModal";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";

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

  const catCfg = event
    ? categoryConfig[event.category] || {
        label: event.category,
        badgeClass: "bg-white/10 text-white border-white/20",
      }
    : null;
  const modalCfg = event
    ? modalityConfig[event.modality] || { label: event.modality, icon: "📍" }
    : null;
  const { line1, line2 } = splitTitle(event?.title);

  function formatTime(iso) {
    if (!iso) return null;
    return new Intl.DateTimeFormat("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  }

  // const timeRange = event?.starts_at
  //   ? `${formatTime(event.starts_at)}${event.ends_at ? ` - ${formatTime(event.ends_at)}` : ""}`
  //   : null;

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0d1526 100%)",
      }}
    >
      {/* ─── Radial glow decorativo ─── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "45%",
          background:
            "radial-gradient(ellipse at center, rgba(var(--color-primary-rgb, 230,70,30), 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading skeleton */}
        {loading && (
          <div className="animate-pulse rounded-3xl overflow-hidden bg-white/5 h-80" />
        )}

        {!loading && event && (
          <>
            {/* ─── Section heading ─── */}
            <div className="mb-10 text-center">
              <p
                className="text-xs font-bold uppercase tracking-[0.22em] mb-4"
                style={{ color: "var(--color-primary, #e6461e)" }}
              >
                ✦ Próximo evento ✦
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Tenemos algo{" "}
                <span
                  className="relative inline-block"
                  style={{ color: "var(--color-primary, #e6461e)" }}
                >
                  especial para ti
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 300 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5 Q75 1 150 5.5 Q225 10 299 5.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{
                        color: "var(--color-primary, #e6461e)",
                        opacity: 0.45,
                      }}
                    />
                  </svg>
                </span>{" "}
                🎉
              </h2>
              <p className="mt-4 text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Una nueva oportunidad de aprender, conectar y crecer junto a
                nuestra comunidad.
              </p>
            </div>

            {/* ─── Hero card ─── */}
            <div
              className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Left — contenido */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center gap-5">
                {/* Badge */}
                <div className="flex items-center gap-2 w-fit">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "var(--color-primary, #e6461e)" }}
                  />
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{
                      color: "var(--color-primary, #e6461e)",
                      background:
                        "rgba(var(--color-primary-rgb, 230,70,30), 0.12)",
                    }}
                  >
                    No te pierdas nuestro próximo evento
                  </span>
                </div>

                {/* Título dos líneas */}
                <div>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    {line1}
                  </h3>
                  {line2 && (
                    <h3
                      className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
                      style={{ color: "var(--color-primary, #e6461e)" }}
                    >
                      {line2}
                    </h3>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                  {event.starts_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "var(--color-primary, #e6461e)" }}
                      />
                      {formatEventDate(event.starts_at)}
                    </span>
                  )}
                  {event.location && event.modality !== "virtual" && (
                    <span className="flex items-center gap-1.5">
                      <MapPin
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "var(--color-primary, #e6461e)" }}
                      />
                      {event.location}
                    </span>
                  )}
                  {/* {timeRange && (
                    <span className="flex items-center gap-1.5 w-full sm:w-auto">
                      <Clock
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "var(--color-primary, #e6461e)" }}
                      />
                      {timeRange}
                    </span>
                  )} */}
                </div>

                {/* Descripción */}
                {event.description && (
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md line-clamp-3">
                    {event.description}
                  </p>
                )}

                {/* Botones */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={() => setRegisterOpen(true)}
                    className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "var(--color-primary, #e6461e)",
                      color: "#fff",
                      boxShadow:
                        "0 8px 24px rgba(var(--color-primary-rgb, 230,70,30), 0.35)",
                    }}
                  >
                    Reservar mi lugar
                  </button>
                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
                      style={{
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "#e2e8f0",
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      Ver agenda
                    </a>
                  )}
                </div>
              </div>

              {/* Right — imagen */}
              <div className="w-full md:w-5/12 lg:w-2/5 min-h-[240px] md:min-h-0 flex-shrink-0 relative overflow-hidden">
                <img
                  src={optimizeCloudinaryUrl(event.banner_url, 800)}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {/* gradient overlay izquierdo para blend con card */}
                <div
                  className="absolute inset-y-0 left-0 w-16 hidden md:block"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0.04), transparent)",
                  }}
                />
                {catCfg && (
                  <span
                    className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border ${catCfg.badgeClass}`}
                  >
                    {catCfg.label}
                  </span>
                )}
              </div>
            </div>

            {/* ─── Highlights ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              {HIGHLIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "rgba(var(--color-primary-rgb, 230,70,30), 0.15)",
                    }}
                  >
                    {h.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{h.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {registerOpen && event && (
        <RegisterModal event={event} onClose={() => setRegisterOpen(false)} />
      )}
    </section>
  );
}
