import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X, Target, Trophy, Sparkles, ZoomIn } from "lucide-react";
import ProjectIcon from "./ProjectIcon";
import { optimizeCloudinaryUrl } from "../utils/cloudinaryOptimize";

export default function ProjectDrawer({ project, onClose }) {
  const [activeImage, setActiveImage] = useState(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (activeImage) {
          setActiveImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, activeImage]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop Overlay */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer Container */}
      <m.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="relative h-full w-full sm:max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Sleek Navigation Header Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 flex-shrink-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/10 flex items-center justify-center">
              <ProjectIcon name={project.icon} className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Detalles del Proyecto
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-100 transition-all active:scale-95"
            aria-label="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-8 scrollbar-thin">
          {/* Title & Description */}
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary/10 rounded-full text-secondary text-xs font-bold uppercase tracking-wider mb-3">
              ✦ Proyecto Pasado
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {project.name}
            </h2>
            <p className="text-secondary font-bold text-sm sm:text-base mt-2 uppercase tracking-wide">
              {project.description}
            </p>
          </div>

          {/* Details Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Acerca del Proyecto
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {project.details}
            </p>
          </div>

          {/* Objectives and Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
            {/* Objectives */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Objetivos
              </h3>
              <ul className="space-y-3">
                {project.objectives?.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                Resultados Obtenidos
              </h3>
              <div className="space-y-3">
                {project.results?.map((res, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-secondary-light/10 rounded-xl border border-secondary/10 flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0 shadow-[0_0_6px_rgba(77,185,169,0.5)]" />
                    <span className="text-sm font-semibold text-gray-700 leading-snug">
                      {res}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Galería de Actividades
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden group cursor-zoom-in border border-gray-100 shadow-sm"
                  >
                    <img
                      src={optimizeCloudinaryUrl(img, { width: 400 })}
                      alt={`Galería ${project.name} ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </m.div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setActiveImage(null)}
          >
            {/* Close Lightbox button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
              aria-label="Cerrar vista completa"
            >
              <X className="w-5 h-5" />
            </button>

            <m.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              src={optimizeCloudinaryUrl(activeImage)}
              alt="Detalle del proyecto"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
