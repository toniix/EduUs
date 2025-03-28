import { Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOpportunity } from "../../contexts/OpportunityContext";
// Función para formatear la fecha
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

// Mapeo de tipos a colores y etiquetas
const typeConfig = {
  scholarship: { label: "Beca", color: "bg-blue-100 text-blue-800" },
  workshop: { label: "Taller", color: "bg-green-100 text-green-800" },
  exchange: { label: "Intercambio", color: "bg-purple-100 text-purple-800" },
  volunteer: { label: "Voluntariado", color: "bg-orange-100 text-orange-800" },
  internship: { label: "Pasantía", color: "bg-pink-100 text-pink-800" },
};

export default function OpportunityCard({ opportunity }) {
  const navigate = useNavigate();
  const { setSelectedOpportunity } = useOpportunity();

  const handleClick = () => {
    setSelectedOpportunity(opportunity);
    navigate("/dashboard/details");
  };

  const {
    title,
    organization,
    description,
    type,
    location,
    deadline,
    imageUrl,
    tags,
  } = opportunity;

  const typeInfo = typeConfig[type];

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="relative h-40 w-full">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}
          >
            {typeInfo.label}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{organization}</p>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Fecha límite: {formatDate(deadline)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full border border-gray-200 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={handleClick}
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}
