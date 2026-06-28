import { motion } from "framer-motion";
import { Share2, Building, MapPin, Globe, BookOpen, Briefcase, Users, Trophy, Laptop, HeartHandshake, Medal, BadgeCheck, Plane, Award, CheckCircle, XCircle } from "lucide-react";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";
import { modalityStyles } from "../../utils/opportunity";

/* ─── Iconos por categoría ───────────────────────────────────── */
const categoryIcons = {
  taller: <BookOpen className="h-3.5 w-3.5" />,
  charla: <Briefcase className="h-3.5 w-3.5" />,
  conferencia: <Users className="h-3.5 w-3.5" />,
  hackathon: <Trophy className="h-3.5 w-3.5" />,
  bootcamp: <Laptop className="h-3.5 w-3.5" />,
  voluntario: <HeartHandshake className="h-3.5 w-3.5" />,
  olimpiada: <Medal className="h-3.5 w-3.5" />,
  certificacion: <BadgeCheck className="h-3.5 w-3.5" />,
  curso: <BookOpen className="h-3.5 w-3.5" />,
  intercambio: <Globe className="h-3.5 w-3.5" />,
  practica: <Briefcase className="h-3.5 w-3.5" />,
  programa: <Plane className="h-3.5 w-3.5" />,
  beca: <Award className="h-3.5 w-3.5" />,
  concurso: <Trophy className="h-3.5 w-3.5" />,
  simulacion: <Users className="h-3.5 w-3.5" />,
};

const modalityIcons = {
  virtual: <Globe className="h-3.5 w-3.5" />,
  presencial: <Building className="h-3.5 w-3.5" />,
  hibrido: <Users className="h-3.5 w-3.5" />,
};

/* ─── Chip de badge reutilizable ─────────────────────────────── */
function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

/* ─── Componente principal ───────────────────────────────────── */
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
  const isActive = status === "active";

  return (
    <motion.article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Hero image */}
      {image_url && (
        <div className="relative h-56 sm:h-72 overflow-hidden bg-gray-100">
          <motion.img
            src={optimizeCloudinaryUrl(image_url, { width: 900 })}
            alt={`Imagen de la oportunidad: ${title}`}
            className="w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            loading="eager"
          />
          {/* Gradiente inferior para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Status badge flotante sobre la imagen */}
          <div className="absolute top-4 left-4">
            <Badge
              className={`${statusConfig.bg} ${statusConfig.text} shadow-sm backdrop-blur-sm`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {isActive ? "Convocatoria abierta" : "Convocatoria cerrada"}
            </Badge>
          </div>

          {/* Botón compartir flotante */}
          <div className="absolute top-4 right-4">
            <button
              onClick={openShareModal}
              className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all duration-200 active:scale-95"
              aria-label="Compartir oportunidad"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Badges cuando no hay imagen */}
        {!image_url && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${statusConfig.bg} ${statusConfig.text}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {isActive ? "Convocatoria abierta" : "Convocatoria cerrada"}
              </Badge>

              {category && (
                <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
                  {categoryIcons[category.name]}
                  <span className="capitalize">{category.name}</span>
                </Badge>
              )}

              {modality && (
                <Badge
                  className={`border ${modalityStyles[modality] || modalityStyles.presencial}`}
                >
                  {modalityIcons[modality]}
                  <span className="capitalize">{modality}</span>
                </Badge>
              )}
            </div>

            <button
              onClick={openShareModal}
              className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 active:scale-95"
              aria-label="Compartir oportunidad"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Badges adicionales cuando hay imagen */}
        {image_url && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
                {categoryIcons[category.name]}
                <span className="capitalize">{category.name}</span>
              </Badge>
            )}
            {modality && (
              <Badge
                className={`border ${modalityStyles[modality] || modalityStyles.presencial}`}
              >
                {modalityIcons[modality]}
                <span className="capitalize">{modality}</span>
              </Badge>
            )}
            <div className="ml-auto">
              <button
                onClick={openShareModal}
                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 active:scale-95"
                aria-label="Compartir oportunidad"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Título */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 leading-snug tracking-tight">
          {title}
        </h1>

        {/* Info institucional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {organization && (
            <div className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <Building className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium leading-none mb-0.5">
                  Institución
                </p>
                <p className="text-sm text-gray-700 font-medium truncate">{organization}</p>
              </div>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium leading-none mb-0.5">
                  Lugar
                </p>
                <p className="text-sm text-gray-700 font-medium truncate">{location}</p>
              </div>
            </div>
          )}

          {country && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <Globe className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium leading-none mb-0.5">
                  País
                </p>
                <p className="text-sm text-gray-700 font-medium truncate">{country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-50">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 hover:opacity-80"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}18` : "#f3f4f6",
                    color: tag.color || "#6b7280",
                    border: `1px solid ${tag.color ? `${tag.color}30` : "#e5e7eb"}`,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default DetailHeader;
