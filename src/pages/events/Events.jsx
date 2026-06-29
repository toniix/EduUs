import { EVENT_FILTERS } from "../../utils/events";
import EventBannerCard from "../../components/events/EventBannerCard";
import { useMemo, useState } from "react";
import { useEvents } from "../../hooks/useEvents";
import { FaInstagram } from "react-icons/fa6";

const Events = ({ onExplore }) => {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const [activeEventFilter, setActiveEventFilter] = useState("all");

  const filteredEvents = useMemo(() => {
    return activeEventFilter === "all"
      ? events
      : events.filter((e) => e.category === activeEventFilter);
  }, [events, activeEventFilter]);

  return (
    <>
      {/* Contenido de Eventos (Iniciativas de EDU-US) */}
      <div className="max-w-4xl mx-auto">
        {/* Filtros de Categorías de Eventos */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {EVENT_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveEventFilter(filter.value)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                activeEventFilter === filter.value
                  ? "bg-secondary text-white border-secondary shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-255 dark:border-gray-800 hover:border-secondary/40 dark:hover:border-secondary/40 hover:text-secondary"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* LOADING EVENTOS */}
        {eventsLoading && (
          <div className="flex flex-col gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-gray-900 rounded-3xl h-80 border border-gray-100 dark:border-gray-800"
              />
            ))}
          </div>
        )}

        {/* ERROR EVENTOS */}
        {!eventsLoading && eventsError && (
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold">{eventsError}</p>
          </div>
        )}

        {/* LISTADO DE EVENTOS */}
        {!eventsLoading && !eventsError && filteredEvents.length > 0 && (
          <div className="flex flex-col gap-8">
            {filteredEvents.map((event) => (
              <EventBannerCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* ESTADO VACÍO EVENTOS */}
        {!eventsLoading && !eventsError && filteredEvents.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="inline-block bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl mb-4 text-gray-400">
              <svg
                className="w-10 h-10 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-light mb-2 font-heading">
              No hay eventos disponibles
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">
              Por ahora no tenemos actividades programadas en esta categoría,
              pero puedes seguirnos en Instagram para enterarte de nuevas
              convocatorias al instante o seguir explorando las convocatorias de
              estudio y empleo vigentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="https://www.instagram.com/edu.us_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-violet-600 hover:opacity-95 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
              >
                <FaInstagram className="w-5 h-5" />
                <span>Seguir en Instagram</span>
              </a>
              {onExplore && (
                <button
                  type="button"
                  onClick={onExplore}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800  text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm"
                >
                  Explorar Oportunidades
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
