import { m } from "framer-motion";
import { Eye } from "lucide-react";
import ProjectIcon from "../ProjectIcon";

const ProjectSlide = ({ project, onSelect }) => {
  const backgroundImage = project.images?.[0] || project.fondo;

  return (
    <m.div
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className="relative h-[320px] sm:h-[380px] rounded-2xl overflow-hidden group cursor-pointer select-none border border-gray-100/10 hover:border-secondary/30 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* "Ver detalles" tooltip/cue at top right */}
      <div className="absolute top-4 right-4 z-10 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-300">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md text-gray-900 rounded-full text-xs font-bold shadow-md border border-white/20">
          <Eye className="w-3.5 h-3.5 text-secondary animate-pulse" />
          Ver detalles
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
        {/* Icon badge */}
        <div className="mb-4 transform group-hover:-translate-y-1 transition-transform duration-500">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 group-hover:border-secondary/40 group-hover:bg-secondary/20 transition-all duration-300">
            <ProjectIcon
              name={project.icon}
              className="w-7 h-7 text-white/90"
            />
          </div>
        </div>

        {/* Title & description */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:-translate-y-1 transition-transform duration-300">
          {project.name}
        </h3>
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-lg mb-2">
          {project.description}
        </p>
      </div>
    </m.div>
  );
};
export default ProjectSlide;
