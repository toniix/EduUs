import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";
import logo from "../../assets/logo_2.png";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop";

export default function EventBannerCard({ event }) {
  const { title, slug, description, banner_url, spots_left, price } = event;

  const isSoldOut = spots_left === 0;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full aspect-[2.1/1] min-h-[300px] rounded-3xl overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-350 group border border-gray-100 dark:border-gray-800"
    >
      {/* Imagen de fondo */}
      <img
        src={optimizeCloudinaryUrl(banner_url, { width: 1200 }) || PLACEHOLDER}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
      />

      {/* Overlay gradiente oscuro de izquierda a derecha */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 md:from-black/75 md:via-black/45 md:to-black/15" />

      {/* Contenido flotante sobre la tarjeta */}
      <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-between z-10 text-white">
        {/* Header de la tarjeta */}
        <div className="flex justify-between items-start">
          {/* Logo en la esquina superior derecha */}
          <img
            src={logo}
            alt="EDU-US"
            className="h-6 sm:h-8 w-auto object-contain brightness-0 invert opacity-90"
          />
        </div>

        {/* Título, subtítulo y botones en la parte inferior derecha */}
        <div className="flex flex-col md:items-end md:self-end text-left md:text-right max-w-xl md:ml-auto">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none mb-1 font-heading text-white">
            {title.split(":")[0]}
          </h3>

          {description && (
            <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 mb-6 line-clamp-1">
              {description.split("\n")[0]}
            </p>
          )}

          {/* Botones y Badge de Precio */}
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {/* Badge de Precio / Free */}
            <span className="text-xs font-bold bg-black/60 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-lg text-white">
              🎫 {price === 0 ? "Free" : `S/ ${price}`}
            </span>

            {/* Botón Ver Detalles */}
            <Link
              to={`/eventos/${slug}`}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-primary font-bold text-sm transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              Ver Detalles
            </Link>

            {/* Botón Inscríbete ya */}
            <Link
              to={`/eventos/${slug}#inscripcion`}
              className={`px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all shadow-sm whitespace-nowrap ${
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
