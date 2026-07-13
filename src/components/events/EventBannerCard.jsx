import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";
import logo from "../../assets/logo_2.png";
import { formatEventDate } from "../../utils/events";
import { Calendar, Ticket } from "lucide-react";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop";

export default function EventBannerCard({ event }) {
  const { title, slug, description, banner_url, spots_left, price, starts_at } = event;

  const isSoldOut = spots_left === 0;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full aspect-[4/3] sm:aspect-[1.8/1] md:aspect-[2.1/1] lg:aspect-[2.3/1] xl:aspect-[2.5/1] min-h-[350px] sm:min-h-[380px] md:min-h-[420px] rounded-3xl overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-350 group border border-gray-100 dark:border-gray-800"
    >
      {/* Imagen de fondo */}
      <img
        src={optimizeCloudinaryUrl(banner_url, { width: 1200 }) || PLACEHOLDER}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
      />

      {/* Overlay gradiente oscuro responsivo: vertical en móvil para proteger textos apilados, horizontal (derecha a izquierda) en desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10 sm:bg-gradient-to-l sm:from-black/85 sm:via-black/55 sm:to-black/10" />

      {/* Contenido flotante sobre la tarjeta */}
      <div className="absolute inset-0 pt-4 px-5 pb-5 sm:pt-6 sm:px-8 sm:pb-8 md:pt-8 md:px-10 md:pb-10 lg:pt-10 lg:px-12 lg:pb-12 xl:pt-12 xl:px-14 xl:pb-14 flex flex-col justify-between z-10 text-white">
        {/* Header de la tarjeta - Logo en la izquierda y Badge de Precio en la derecha */}
        <div className="flex justify-between items-start w-full">
          <img
            src={logo}
            alt="EDU-US"
            className="h-5 sm:h-7 md:h-8 w-auto object-contain brightness-0 invert opacity-90"
          />
          {/* Badge de Precio / Free */}
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold bg-black/60 backdrop-blur-sm border border-white/15 px-2.5 py-1.5 rounded-lg text-white">
            <Ticket className="w-3.5 h-3.5 text-secondary" />
            <span>{price === 0 ? "Free" : `S/ ${price}`}</span>
          </span>
        </div>

        {/* Título, subtítulo y botones - Alineados a la derecha de la tarjeta con textos y botones centrados en desktop */}
        <div className="flex flex-col items-start text-left sm:items-center sm:text-center mt-auto sm:self-end w-full sm:w-[48%] md:w-[45%] max-w-2xl gap-2 sm:gap-3">
          {/* Eyebrow de Fecha (oculto en móviles para ahorrar espacio vertical) */}
          {starts_at && (
            <div className="hidden sm:flex flex-wrap items-center justify-start sm:justify-center gap-x-1.5 gap-y-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-secondary">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatEventDate(starts_at)}</span>
            </div>
          )}

          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight font-heading text-white">
            {title.split(":")[0]}
          </h3>

          {description && (
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-white/90 line-clamp-2 max-w-xl">
              {description.split("\n")[0]}
            </p>
          )}

          {/* Botones */}
          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 mt-1 sm:mt-2 w-full">
            {/* Botón Ver Detalles */}
            <Link
              to={`/eventos/${slug}`}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white hover:bg-gray-100 text-primary font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              Ver Detalles
            </Link>

            {/* Botón Inscríbete ya */}
            <Link
              to={`/eventos/${slug}#inscripcion`}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-white text-xs sm:text-sm transition-all shadow-sm whitespace-nowrap ${
                isSoldOut
                  ? "bg-gray-500/50 cursor-not-allowed opacity-50"
                  : "bg-secondary hover:bg-secondary/90 hover:shadow-md active:scale-95"
              }`}
              onClick={(e) => isSoldOut && e.preventDefault()}
            >
              {isSoldOut ? "Sin cupos" : "¡Inscríbete ya!"}
            </Link>
          </div>
        </div>
      </div>
    </m.div>
  );
}
