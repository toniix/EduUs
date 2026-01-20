import { Calendar, MapPin, Globe, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, isDateInPast } from "../../utils/formatDate";
import { typeConfig, modalityConfig } from "../../utils/opportunity";
import { useMemo } from "react";

export default function OpportunityCard({ opportunity }) {
  const {
    id,
    title,
    organization,
    description,
    deadline,
    image_url,
    tags,
    modality,
    country,
    category,
  } = opportunity;

  const isFinished = useMemo(() => {
    return deadline ? isDateInPast(new Date(deadline)) : false;
  }, [deadline]);

  // Obtener la información del tipo basada en el nombre de la categoría
  const categoryName = category?.name?.toLowerCase() || "";
  const typeInfo = typeConfig[categoryName] || {
    label: categoryName,
    color: "bg-gray-100 text-gray-800",
  };

  // Si no encontramos una coincidencia exacta, buscamos por coincidencia parcial
  const typeKey =
    Object.keys(typeConfig).find((key) => categoryName.includes(key)) || "";
  const matchedType = typeConfig[typeKey] || typeInfo;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="relative h-40 w-full">
        <img
          src={image_url || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              matchedType.color || "bg-gray-100 text-gray-800"
            }`}
          >
            {matchedType.label || categoryName || "Oportunidad"}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
              // Mejor opción
              isFinished
                ? "bg-slate-600 text-white"
                : "bg-emerald-500 text-white"
            } shadow-md`}
          >
            {isFinished ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                <span>FINALIZADO</span>
              </>
            ) : (
              <>
                <Clock className="h-3.5 w-3.5" />
                <span>ACTIVO</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-2xl mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 font-bold pb-1 border-b border-accent w-full">
          {organization}
        </p>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              <span className="font-bold text-secondary text-base">
                Fecha límite:
              </span>{" "}
              {formatDate(deadline)}
            </span>
          </div>
          {modality && modalityConfig[modality] && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="font-bold text-secondary text-base">
                Modalidad:
              </span>
              <span> {modalityConfig[modality].label}</span>
            </div>
          )}
          {country && (
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="h-4 w-4 mr-1" />
              <span className="font-bold text-secondary text-base">País:</span>
              <span> {country}</span>
            </div>
          )}
        </div>

        {/* <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full border border-gray-200 text-gray-600"
            >
              {tag.name}
            </span>
          ))}
        </div> */}

        <Link
          to={`/edutracker/oportunidad/${id}`}
          className="block w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 text-center"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
