import { useState, useRef, useEffect } from "react";
import { useEvents } from "../../hooks/useEvents";
import { EVENT_FILTERS } from "../../utils/events";
import EventCard from "./EventCard";
import RegisterModal from "./RegisterModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function EventsSection() {
  const { events, loading, error } = useEvents();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // 🔥 CONTROL AUTOPLAY
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !swiper.autoplay) return;

    if (expandedId) {
      swiper.autoplay.stop();
    } else {
      if (swiper.params.autoplay) {
        swiper.autoplay.start();
      }
    }
  }, [expandedId]);

  // 🔥 FILTRO
  const filtered =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.category === activeFilter);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-2 mb-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Próximos
            </h2>
            <p className="text-3xl sm:text-4xl md:text-5xl font-medium italic text-secondary">
              eventos
            </p>
          </div>
          <p className="text-gray-500 text-sm max-w-xl mx-auto sm:mx-0">
            Únete a talleres, charlas y actividades que impulsan tu desarrollo.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
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

        {/* LOADING */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-lg h-48 shadow-sm border border-gray-100"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* 🔥 SWIPER + NAV NETFLIX */}
        {!loading && !error && filtered.length > 0 && (
          <div
            className="relative group"
            onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
            onMouseLeave={() => {
              if (!expandedId) swiperRef.current?.autoplay?.start();
            }}
          >
            {/* 🔥 BOTÓN IZQUIERDO */}
            <button
              ref={prevRef}
              className="absolute left-0 top-0 h-full z-20 
              w-12 sm:w-16
              hidden sm:flex items-center justify-center
              bg-gradient-to-r from-black/40 to-transparent
              text-white
              opacity-0 group-hover:opacity-100
              transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition hover:scale-110" />
            </button>

            {/* 🔥 BOTÓN DERECHO */}
            <button
              ref={nextRef}
              className="absolute right-0 top-0 h-full z-20 
              w-12 sm:w-16
              hidden sm:flex items-center justify-center
              bg-gradient-to-l from-black/40 to-transparent
              text-white
              opacity-0 group-hover:opacity-100
              transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 opacity-80 hover:opacity-100 transition hover:scale-110" />
            </button>

            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 16 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              loop={filtered.length > 3}
              autoplay={
                filtered.length > 1
                  ? { delay: 3000, disableOnInteraction: false }
                  : false
              }
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              className="w-full pb-8"
              style={{ paddingBottom: 40 }}
            >
              {filtered.map((event) => (
                <SwiperSlide key={event.id} className="!h-auto">
                  <EventCard
                    event={event}
                    onRegisterClick={setSelectedEvent}
                    expanded={expandedId === event.id}
                    onToggle={() => handleToggle(event.id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* VACÍO - CTA */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
            <div className="mb-6">
              <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                No hay eventos disponibles en este momento
              </h3>
              <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                Mantente atento a nuestros próximos talleres y charlas. Recibe
                notificaciones en tiempo real.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.whatsapp.com/channel/0029VbBbJtWAzNc3WLlNXR3H"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.176c-1.493.799-2.863 1.93-3.716 3.217-1.735 2.786-2.262 6.144-1.463 9.234.397 1.527 1.172 2.958 2.212 4.174.524.572 1.159 1.07 1.865 1.404 1.502.74 3.127 1.123 4.821 1.123 2.488 0 4.817-.726 6.852-2.095 2.035-1.369 3.627-3.37 4.614-5.811 1.463-3.66 1.227-7.684-.649-11.134-.85-1.599-2.136-2.952-3.685-3.957-1.549-1.005-3.315-1.619-5.223-1.788zm10.389-10.154c-.788-.028-1.546.234-2.135.789-.589.555-.974 1.301-1.101 2.115-.127.814.073 1.652.567 2.322.494.67 1.244 1.113 2.098 1.188.854.075 1.717-.171 2.368-.702.651-.531 1.084-1.318 1.187-2.181.103-.863-.188-1.749-.825-2.426-.637-.677-1.567-1.104-2.559-1.205zm5.156-.404c-1.065-.021-2.104.326-2.895.969-.791.643-1.319 1.568-1.485 2.599-.166 1.031.088 2.09.716 2.942.628.852 1.578 1.43 2.649 1.57 1.071.14 2.177-.274 2.967-.997.79-.723 1.307-1.762 1.441-2.879.134-1.117-.262-2.288-1.087-3.146-.825-.858-1.988-1.366-3.206-1.458z" />
                </svg>
                Unirse a WhatsApp
              </a>

              <a
                href="/edutracker"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Explorar Oportunidades
              </a>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedEvent && (
        <RegisterModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}
