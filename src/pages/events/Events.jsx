import EventBannerCard from "../../components/events/EventBannerCard";
import { useMemo, useState, useRef } from "react";
import { useEvents } from "../../hooks/useEvents";
import { FaInstagram } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { m } from "framer-motion";
import logo from "../../assets/logo_2.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Events = ({ onExplore }) => {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <>
      {/* Contenido de Eventos (Iniciativas de EDU-US) */}
      <div className="w-full">
        {/* LOADING EVENTOS */}
        {eventsLoading && (
          <div className="animate-pulse bg-white dark:bg-gray-900 rounded-3xl h-80 border border-gray-100 dark:border-gray-800" />
        )}

        {/* ERROR EVENTOS */}
        {!eventsLoading && eventsError && (
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold">{eventsError}</p>
          </div>
        )}

        {/* LISTADO DE EVENTOS */}
        {!eventsLoading && !eventsError && events.length > 0 && (
          <div className="w-full">
            {events.length === 1 ? (
              <EventBannerCard event={events[0]} />
            ) : (
              <div className="relative group events-banner-swiper">
                {/* Botones de navegación glassmorphic flotantes (solo desktop) */}
                <button
                  ref={prevRef}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 
                  w-12 h-12 rounded-full hidden md:flex items-center justify-center
                  bg-black/35 backdrop-blur-md border border-white/10 text-white
                  hover:bg-black/50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  ref={nextRef}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 
                  w-12 h-12 rounded-full hidden md:flex items-center justify-center
                  bg-black/35 backdrop-blur-md border border-white/10 text-white
                  hover:bg-black/50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={24}
                  slidesPerView={1}
                  loop={events.length > 1}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }}
                  className="w-full"
                  style={{
                    paddingBottom: "36px",
                    "--swiper-pagination-color":
                      "var(--color-primary, #ec451d)",
                    "--swiper-pagination-bullet-inactive-color": "#9ca3af",
                    "--swiper-pagination-bullet-inactive-opacity": "0.4",
                    "--swiper-pagination-bullet-size": "8px",
                  }}
                >
                  {events.map((event) => (
                    <SwiperSlide key={event.id}>
                      <EventBannerCard event={event} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        )}

        {/* ESTADO VACÍO EVENTOS (Banner Responsivo Premium) */}
        {!eventsLoading && !eventsError && events.length === 0 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full aspect-[4/3] sm:aspect-[1.8/1] md:aspect-[2.1/1] lg:aspect-[2.3/1] xl:aspect-[2.5/1] min-h-[350px] sm:min-h-[380px] md:min-h-[420px] rounded-3xl overflow-hidden relative shadow-md group border border-gray-100 dark:border-gray-800"
          >
            {/* Imagen de fondo */}
            <img
              src="/empty-events-bg.webp"
              alt="Nuevos eventos en camino"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />

            {/* Overlay gradiente oscuro responsivo: vertical en móvil, horizontal (derecha a izquierda) en desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent sm:bg-gradient-to-l sm:from-black/90 sm:via-black/60 sm:to-transparent" />

            {/* Contenido flotante sobre la tarjeta */}
            <div className="absolute inset-0 pt-4 px-5 pb-5 sm:pt-6 sm:px-8 sm:pb-8 md:pt-8 md:px-10 md:pb-10 lg:pt-10 lg:px-12 lg:pb-12 xl:pt-12 xl:px-14 xl:pb-14 flex flex-col justify-between z-10 text-white">
              {/* Header de la tarjeta - Logo en la izquierda y Badge de Comunidad en la derecha */}
              <div className="flex justify-between items-start w-full">
                <img
                  src={logo}
                  alt="EDU-US"
                  className="h-5 sm:h-7 md:h-8 w-auto object-contain brightness-0 invert opacity-90"
                />
                {/* Badge de Comunidad */}
                <span className="text-[10px] sm:text-xs font-bold bg-black/60 backdrop-blur-sm border border-white/15 px-2.5 py-1.5 rounded-lg text-white">
                  📢 Comunidad
                </span>
              </div>

              {/* Título, descripción y botones - Alineados a la derecha de la tarjeta con textos y botones centrados en desktop */}
              <div className="flex flex-col items-start text-left sm:items-center sm:text-center mt-auto sm:self-end w-full sm:w-[48%] md:w-[45%] max-w-2xl gap-3 sm:gap-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight font-heading text-white">
                  Nuevos eventos en camino 🚀
                </h3>

                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-white/90 line-clamp-2 max-w-xl">
                  Estamos preparando talleres y charlas interactivas para
                  potenciar tu futuro académico y profesional. Síguenos en
                  Instagram para no perderte el lanzamiento.
                </p>

                {/* Botones */}
                <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 mt-1 sm:mt-2 w-full">
                  {/* Botón Seguir en Instagram */}
                  <a
                    href="https://www.instagram.com/edu.us_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-primary font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 whitespace-nowrap flex items-center gap-2"
                  >
                    <FaInstagram className="w-4 h-4" />
                    <span>Seguir en Instagram</span>
                  </a>

                  {/* Botón Explorar Oportunidades */}
                  {onExplore && (
                    <button
                      type="button"
                      onClick={onExplore}
                      className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 hover:shadow-md text-white font-bold text-xs sm:text-sm transition-all active:scale-95 whitespace-nowrap"
                    >
                      Explorar Oportunidades
                    </button>
                  )}
                </div>
              </div>
            </div>
          </m.div>
        )}
      </div>
    </>
  );
};

export default Events;
