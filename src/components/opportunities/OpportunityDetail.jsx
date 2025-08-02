import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOpportunity } from "../../hooks/useOpportunities";
import {
  Calendar,
  MapPin,
  ChevronLeft,
  Building,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Share2,
  Bookmark,
  ArrowRight,
  Star,
  Award,
  BookOpen,
  Users,
  Briefcase,
  Trophy,
  Laptop,
  HeartHandshake,
  Medal,
  BadgeCheck,
  Plane,
} from "lucide-react";
import { statusColors, modalityStyles } from "../../utils/opportunity";
import OpportunityLoading from "./OpportunityLoading";
import OpportunityError from "./OpportunityError";
import OpportunityNotFound from "./OpportunityNotFound";

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

const OpportunityDetail = () => {
  const { id } = useParams();
  const { opportunity, loading, error } = useOpportunity(id);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: opportunity.title,
          text: opportunity.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Aquí implementarías la lógica para guardar/quitar de favoritos
  };

  const handleApply = () => {
    // Lógica para aplicar a la oportunidad
    console.log("Aplicando a la oportunidad:", opportunity.id);
  };

  if (loading) {
    return <OpportunityLoading />;
  }

  if (error) {
    return <OpportunityError />;
  }

  if (!opportunity) {
    return <OpportunityNotFound />;
  }

  const {
    title,
    organization,
    description,
    location,
    deadline,
    image_url,
    tags,
    category,
    country,
    requirements,
    benefits,
    contact,
    modality,
  } = opportunity;

  // Supón que data.requirements viene como un string JSON
  const parsedRequirements =
    typeof requirements === "string" ? JSON.parse(requirements) : requirements;

  const parsedBenefits =
    typeof benefits === "string" ? JSON.parse(benefits) : benefits;

  // console.log("requirements:", requirements);
  // console.log("type:", typeof requirements);
  // console.log("is array:", Array.isArray(requirements));
  const isExpired = deadline && new Date(deadline) < new Date();

  const status = isExpired ? "inactive" : "active";

  const statusConfig = statusColors[status] || statusColors.active;
  const StatusIcon = statusConfig.icon;

  const daysUntilDeadline = deadline
    ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/edutracker"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-white border border-primary hover:bg-primary rounded-lg transition-all duration-200 ease-in-out group"
          >
            <ChevronLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Volver a oportunidades</span>
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Imagen */}
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
                {/* Status y Tipo */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {status === "active"
                        ? "Activa"
                        : status === "inactive"
                        ? "Inactiva"
                        : "Inactiva"}
                    </div>

                    {category && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {categoryIcons[category.name]}
                        <span className="ml-1 capitalize">{category.name}</span>
                      </div>
                    )}
                    {modality && (
                      <div
                        className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
                          ${
                            modalityStyles[modality] ||
                            modalityStyles.presencial
                          }
                          transition-colors duration-200 hover:shadow-sm
                        `}
                      >
                        {modalityIcons[modality]}
                        <span className="ml-1 capitalize">{modality}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded-full transition-colors ${
                        isBookmarked
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      <Bookmark
                        className={`h-5 w-5 ${
                          isBookmarked ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {title}
                </h1>

                {/* Información básica */}
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
                          backgroundColor: tag.color
                            ? `${tag.color}20`
                            : "#f3f4f6",
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

            {/* Descripción */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Descripción
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>

            {/* Requisitos */}
            {parsedRequirements && parsedRequirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Requisitos
                </h2>
                <ul className="space-y-2">
                  {parsedRequirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Beneficios */}
            {parsedBenefits && parsedBenefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Beneficios
                </h2>
                <ul className="space-y-2">
                  {parsedBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Acción */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {/* Deadline */}
              {deadline && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    isExpired
                      ? "bg-red-50 border border-red-200"
                      : daysUntilDeadline <= 7
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <div className="flex items-center">
                    <Calendar
                      className={`h-4 w-4 mr-2 ${
                        isExpired
                          ? "text-red-500"
                          : daysUntilDeadline <= 7
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isExpired ? "Fecha límite vencida" : "Fecha límite"}
                      </p>
                      <p
                        className={`text-sm ${
                          isExpired
                            ? "text-red-600"
                            : daysUntilDeadline <= 7
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {new Date(deadline).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {!isExpired && daysUntilDeadline !== null && (
                          <span className="block">
                            {daysUntilDeadline === 0
                              ? "¡Hoy!"
                              : daysUntilDeadline === 1
                              ? "¡Mañana!"
                              : `${daysUntilDeadline} días restantes`}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de Aplicar */}
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-primary text-white hover:bg-primary/90 hover:shadow-lg`}
              >
                Mas información
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>

              {/* Información de Contacto */}
              {contact && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Información de contacto
                  </h3>
                  <div className="space-y-2 text-sm">
                    {contact.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-primary"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="h-4 w-4 mr-2" />
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          Sitio web o plataforma de inscripción
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
