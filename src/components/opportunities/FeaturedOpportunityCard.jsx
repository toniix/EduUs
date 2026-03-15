import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { modalityConfig } from "../../utils/opportunity";
import { Globe, MapPin, Calendar } from "lucide-react";

// Componente para la tarjeta individual de oportunidad destacada
const FeaturedOpportunityCard = ({ opportunity, index }) => {
  const { id, title, deadline, image_url, modality, country, category } =
    opportunity;

  // La segunda tarjeta (índice 1) usa primary, el resto usa secondary
  const isPrimary = index === 1;
  const badgeClass = isPrimary
    ? "bg-primary text-white"
    : "bg-secondary text-white";
  const buttonClass = isPrimary
    ? "bg-primary text-white hover:bg-primary/90"
    : "bg-secondary text-white hover:bg-secondary/90";

  const categoryName = category?.name;

  return (
    <div className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-96">
      {/* Background Image */}
      <img
        src={image_url || "/placeholder.svg"}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        {/* Top section with badge and share button */}
        <div className="flex items-start justify-between">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              badgeClass
            }`}
          >
            {categoryName}
          </span>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-6 items-center">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-white text-xl font-bold line-clamp-3 leading-tight">
              {title}
            </h3>

            {/* Info */}
            <div className="space-y-2 text-xs text-gray-100">
              {deadline && (
                <div className="flex items-center gap-1.5">
                  <Calendar
                    className={`w-3.5 h-3.5 flex-shrink-0 ${isPrimary ? "text-primary" : "text-secondary"}`}
                  />
                  <span>Límite: {formatDate(deadline)}</span>
                </div>
              )}
              {modality && modalityConfig[modality] && (
                <div className="flex items-center gap-1.5">
                  <MapPin
                    className={`w-3.5 h-3.5 flex-shrink-0 ${isPrimary ? "text-primary" : "text-secondary"}`}
                  />
                  <span>Modalidad: {modalityConfig[modality].label}</span>
                </div>
              )}
              {country && (
                <div className="flex items-center gap-1.5">
                  <Globe
                    className={`w-3.5 h-3.5 flex-shrink-0 ${isPrimary ? "text-primary" : "text-secondary"}`}
                  />
                  <span>País: {country}</span>
                </div>
              )}
            </div>
          </div>
          {/* Button */}
          <Link
            to={`/edutracker/oportunidad/${id}`}
            className={`flex items-center justify-center px-6 py-3.5 rounded-2xl font-semibold text-base transition-colors duration-300 ${buttonClass}`}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedOpportunityCard;
