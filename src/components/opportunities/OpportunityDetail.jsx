import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOpportunity } from "../../hooks/useOpportunities";
import {
  Calendar,
  MapPin,
  BookOpen,
  Users,
  Award,
  Briefcase,
  ChevronLeft,
  Clock,
  Building,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  Share2,
  Bookmark,
  Eye,
  ArrowRight,
  Star,
} from "lucide-react";

const typeIcons = {
  beca: <Award className="h-5 w-5" />,
  taller: <BookOpen className="h-5 w-5" />,
  intercambio: <Users className="h-5 w-5" />,
  charla: <Briefcase className="h-5 w-5" />,
  conferencia: <Users className="h-5 w-5" />,
  remote: <Globe className="h-5 w-5" />,
  onsite: <Building className="h-5 w-5" />,
  hybrid: <Users className="h-5 w-5" />,
};

const statusColors = {
  active: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
  closed: { bg: "bg-red-100", text: "text-red-800", icon: AlertCircle },
  draft: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
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
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-8 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error al cargar
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "No se pudo cargar la oportunidad"}
          </p>
          <Link
            to="/edutracker"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Volver a oportunidades
          </Link>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <div className="text-center py-12">
          <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oportunidad no encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            La oportunidad que buscas no existe o ha sido eliminada.
          </p>
          <Link
            to="/edutracker"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Explorar oportunidades
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    organization,
    description,
    type,
    location,
    deadline,
    image_url,
    tags,
    category,
    creator,
    country,
    requirements,
    benefits,
    status,
    contact,
    created_at,
  } = opportunity;

  // Supón que data.requirements viene como un string JSON
  const parsedRequirements =
    typeof requirements === "string" ? JSON.parse(requirements) : requirements;

  const parsedBenefits =
    typeof benefits === "string" ? JSON.parse(benefits) : benefits;

  console.log("requirements:", requirements);
  console.log("type:", typeof requirements);
  console.log("is array:", Array.isArray(requirements));

  const statusConfig = statusColors[status] || statusColors.active;
  const StatusIcon = statusConfig.icon;

  const isExpired = deadline && new Date(deadline) < new Date();
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
                        : status === "closed"
                        ? "Cerrada"
                        : "Borrador"}
                    </div>

                    {type && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {typeIcons[type]}
                        <span className="ml-1 capitalize">{type}</span>
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

                  {category && (
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{category.name}</span>
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
              <button
                onClick={handleApply}
                disabled={isExpired || status === "closed"}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isExpired || status === "closed"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg"
                }`}
              >
                {isExpired
                  ? "Fecha límite vencida"
                  : status === "closed"
                  ? "Oportunidad cerrada"
                  : "Aplicar ahora"}
                {!isExpired && status !== "closed" && (
                  <ArrowRight className="h-4 w-4 ml-2" />
                )}
              </button>

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
                    {contact.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="hover:text-primary"
                        >
                          {contact.phone}
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
                          Sitio web
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Información del Creador */}
              {creator && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Publicado por
                  </h3>
                  <div className="flex items-center">
                    {creator.avatar_url ? (
                      <img
                        src={creator.avatar_url}
                        alt={creator.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {creator.full_name}
                      </p>
                      {created_at && (
                        <p className="text-xs text-gray-500">
                          {new Date(created_at).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
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
