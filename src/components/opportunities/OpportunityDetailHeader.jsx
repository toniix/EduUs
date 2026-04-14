import {
  Share2,
  Building,
  MapPin,
  Globe,
  BookOpen,
  Briefcase,
  Users,
  Trophy,
  Laptop,
  HeartHandshake,
  Medal,
  BadgeCheck,
  Plane,
  Award,
} from "lucide-react";
import { modalityStyles } from "../../utils/opportunity";

const categoryIcons = {
  taller: <BookOpen className="h-5 w-5" />,
  charla: <Briefcase className="h-5 w-5" />,
  conferencia: <Users className="h-5 w-5" />,
  hackathon: <Trophy className="h-5 w-5" />,
  bootcamp: <Laptop className="h-5 w-5" />,
  voluntario: <HeartHandshake className="h-5 w-5" />,
  olimpiada: <Medal className="h-5 w-5" />,
  certificacion: <BadgeCheck className="h-5 w-5" />,
  curso: <BookOpen className="h-5 w-5" />,
  intercambio: <Globe className="h-5 w-5" />,
  practica: <Briefcase className="h-5 w-5" />,
  programa: <Plane className="h-5 w-5" />,
  beca: <Award className="h-5 w-5" />,
  concurso: <Trophy className="h-5 w-5" />,
  simulacion: <Users className="h-5 w-5" />,
};
const modalityIcons = {
  virtual: <Globe className="h-5 w-5" />,
  presencial: <Building className="h-5 w-5" />,
  hibrido: <Users className="h-5 w-5" />,
};

const DetailHeader = ({
  title,
  image_url,
  status,
  statusConfig,
  category,
  modality,
  organization,
  location,
  country,
  tags,
  openShareModal,
}) => {
  const StatusIcon = statusConfig.icon;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {image_url && (
        <div className="h-64 overflow-hidden">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {/* Status + badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              <StatusIcon className="h-4 w-4 mr-1" />
              {status === "active" ? "Activa" : "Inactiva"}
            </div>
            {category && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {categoryIcons[category.name]}
                <span className="ml-1 capitalize">{category.name}</span>
              </div>
            )}
            {modality && (
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${modalityStyles[modality] || modalityStyles.presencial} transition-colors duration-200 hover:shadow-sm`}
              >
                {modalityIcons[modality]}
                <span className="ml-1 capitalize">{modality}</span>
              </div>
            )}
          </div>
          <button
            onClick={openShareModal}
            className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        {/* Info básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          {organization && (
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-gray-400" />
              <span>{organization}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{location}</span>
            </div>
          )}
          {country && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-gray-400" />
              <span>{country}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: tag.color ? `${tag.color}20` : "#f3f4f6",
                  color: tag.color || "#6b7280",
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailHeader;
