import { useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { EVENT_FILTERS, categoryConfig } from "../../utils/events";
import EventCard from "./EventCard";
import RegisterModal from "./RegisterModal";

/**
 * EventsSection — sección pública con filtros y grilla de eventos.
 * Insertable en cualquier punto del layout.
 */
export default function EventsSection() {
  const { events, loading, error } = useEvents();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filtrado frontend, sin re-fetch
  const filtered =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.category === activeFilter);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-secondary mb-2">
            ÚNETE A NUESTRA COMUNIDAD
          </p>
          <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Próximos
            </h2>
            <p className="text-3xl sm:text-4xl md:text-5xl font-medium italic text-secondary leading-tight">
              eventos
            </p>
          </div>
          <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto sm:mx-0">
            Talleres, charlas y campamentos para potenciar tu desarrollo
            personal y profesional.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          {EVENT_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeFilter === filter.value
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Estados loading / error */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl h-72 shadow-sm border border-gray-100"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Grilla de tarjetas */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegisterClick={setSelectedEvent}
              />
            ))}
          </div>
        )}

        {/* Estado vacío */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="text-5xl">📭</div>
            <div>
              <p className="text-gray-700 font-semibold text-lg">
                No hay eventos en esta categoría por el momento
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Prueba con otro filtro o vuelve pronto.
              </p>
            </div>
            <button
              onClick={() => setActiveFilter("all")}
              className="mt-2 px-5 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Ver todos los eventos
            </button>
          </div>
        )}
      </div>

      {/* Register Modal */}
      {selectedEvent && (
        <RegisterModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
