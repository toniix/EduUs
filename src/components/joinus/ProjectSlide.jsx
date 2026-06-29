import { m } from "framer-motion";
import { Eye } from "lucide-react";
import ProjectIcon from "../ProjectIcon";

const ProjectSlide = ({ project, onSelect }) => {
  const backgroundImage = project.images?.[0] || project.fondo;

  return (
    <m.div
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className="relative h-[320px] sm:h-[380px] rounded-[2rem] overflow-hidden group cursor-pointer select-none border border-gray-200/50 hover:border-secondary/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-2 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_48px_-8px_rgba(77,185,169,0.15)]"
    >
      {/* Background image with cinematic mix blend and zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Cinematic dark visual gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* "Ver detalles" pill button layout inside */}
      <div className="absolute top-5 right-5 z-10 md:opacity-0 md:group-hover:opacity-100 md:-translate-y-2 md:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-gray-900 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-lg border border-white/20">
          <Eye className="w-3.5 h-3.5 text-secondary animate-pulse" />
          Ver detalles
        </span>
      </div>

      {/* Content layout */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 space-y-3">
        {/* Icon container */}
        <div className="transform group-hover:-translate-y-1 transition-transform duration-500">
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 group-hover:border-secondary/40 group-hover:bg-secondary/35 group-hover:shadow-[0_0_20px_rgba(77,185,169,0.3)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
            <ProjectIcon
              name={project.icon}
              className="w-6.5 h-6.5 text-white/95"
            />
          </div>
        </div>

        {/* Text descriptions */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-heading group-hover:-translate-y-0.5 transition-transform duration-500">
            {project.name}
          </h3>
          <p className="text-secondary-light  text-sm sm:text-base font-light leading-relaxed max-w-sm mt-1 opacity-90">
            {project.description}
          </p>
        </div>
      </div>
    </m.div>
  );
};
export default ProjectSlide;
