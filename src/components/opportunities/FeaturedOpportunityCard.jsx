import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { formatDate } from "../../utils/formatDate";
import { modalityConfig } from "../../utils/opportunity";
import { Globe, MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Paletas de acento para cada tarjeta
const accentPalette = [
  {
    badge: "bg-primary",
    button: "bg-primary hover:bg-primary/90",
    glow: "from-primary/60",
  },
  {
    badge: "bg-secondary",
    button: "bg-secondary hover:bg-secondary/90",
    glow: "from-secondary/60",
  },
  {
    badge: "bg-primary",
    button: "bg-primary hover:bg-primary/90",
    glow: "from-primary/60",
  },
  {
    badge: "bg-secondary",
    button: "bg-secondary hover:bg-secondary/90",
    glow: "from-secondary/60",
  },
];

const FeaturedOpportunityCard = ({ opportunity, index }) => {
  const { id, title, deadline, image_url, modality, country, category, slug } =
    opportunity;

  const accent = accentPalette[index % accentPalette.length];
  const categoryName = category?.name;

  return (
    <m.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-400 h-96 cursor-pointer"
    >
      {/* Imagen de fondo */}
      <img
        src={
          optimizeCloudinaryUrl(image_url, { width: 400 }) || "/placeholder.svg"
        }
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
      />

      {/* Overlay gradiente multicapa */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      {/* Glow de color en la parte inferior */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t ${accent.glow} to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-400`}
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        {/* Parte superior – badge de categoría */}
        <div className="flex items-start justify-between">
          {categoryName && (
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-md ${accent.badge}`}
            >
              {categoryName}
            </span>
          )}
        </div>

        {/* Parte inferior – info + botón */}
        <div className="flex flex-col gap-4">
          {/* Título */}
          <h3 className="text-white text-lg font-bold line-clamp-3 leading-snug drop-shadow-sm">
            {title}
          </h3>

          {/* Metadatos */}
          <div className="space-y-1.5 text-[11px] text-gray-200">
            {deadline && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-white/60" />
                <span>
                  Límite:{" "}
                  <span className="text-white font-medium">
                    {formatDate(deadline)}
                  </span>
                </span>
              </div>
            )}
            {modality && modalityConfig[modality] && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-white/60" />
                <span>
                  Modalidad:{" "}
                  <span className="text-white font-medium">
                    {modalityConfig[modality].label}
                  </span>
                </span>
              </div>
            )}
            {country && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 flex-shrink-0 text-white/60" />
                <span>
                  País:{" "}
                  <span className="text-white font-medium">{country}</span>
                </span>
              </div>
            )}
          </div>

          {/* Botón */}
          <Link
            to={`/edutracker/oportunidad/${slug || id}`}
            className={`group/btn flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-white transition-all duration-300 shadow-lg ${accent.button}`}
          >
            Ver detalles
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </m.div>
  );
};

export default FeaturedOpportunityCard;
