import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { projects } from "../data/projects";
import { ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";
import EventsSection from "../components/events/Events";

const ProjectsSection = () => {
  useEffect(() => {
    // Precargar imágenes de fondo
    projects.slice(0, 4).forEach((project) => {
      if (project.fondo) {
        const img = new Image();
        img.src = project.fondo;
      }
    });
  }, []);
  const scrollToProject = (projectId) => {
    const element = document.getElementById(projectId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section Mejorado */}
      <section className="relative w-full bg-gradient-to-r from-[#0b2826] via-[#1a4d47] to-[#0b2826] py-16 sm:py-20 px-4 sm:px-8 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Texto principal */}
          <div className="flex flex-col gap-5 md:pr-8 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-primary">
                Proyectos y Eventos de EDU-US
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light max-w-xl">
              Descubre nuestras iniciativas más impactantes y participa en los
              próximos eventos de la organización.
            </p>
          </div>
          {/* Grid de proyectos destacados */}
          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.slice(0, 4).map((project) => {
                const IconComponent = project.icon;
                return (
                  <button
                    key={project.id}
                    onClick={() => scrollToProject(project.id)}
                    className="group relative p-5 rounded-2xl overflow-hidden bg-cover bg-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gray-800/60 border border-secondary/30"
                    style={{
                      backgroundImage: project.fondo
                        ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${project.fondo})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="relative z-10 h-full flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-secondary">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1 text-center">
                        {project.name}
                      </h3>
                      <div className="flex items-center justify-center text-xs text-accent font-bold">
                        Ver más
                        <ArrowRightIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform fill-primary" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <span className="block text-xs text-gray-300 mt-2 text-center md:text-right">
              Haz click en un proyecto para ver detalles
            </span>
          </div>
        </div>
      </section>

      <EventsSection />

      {/* Projects Details */}
      <section className="py-16 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Section Title */}
          <div className="mb-20 text-center">
            <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-secondary mb-4">
              ✦ Nuestro Impacto Social ✦
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Proyectos que generan
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-primary">
                {" "}
                Cambio
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conoce nuestras iniciativas que impulsan el desarrollo academico y
              profesional en los jovenes peruanos.
            </p>
          </div>

          <div className="space-y-24">
            {projects.map((project, index) => {
              const IconComponent = project.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={project.id} id={project.id} className="scroll-mt-20">
                  <div
                    className={`flex flex-col ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } items-center gap-12 lg:gap-16`}
                  >
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "#fef4e6" }}
                        >
                          <IconComponent
                            className="w-6 h-6"
                            style={{ color: "#4db9a9" }}
                          />
                        </div>
                        <h3
                          className="text-2xl md:text-3xl font-bold"
                          style={{ color: "#222222" }}
                        >
                          {project.name}
                        </h3>
                      </div>
                      {/* 
                    <p className="text-lg text-gray-600 font-medium pb-2 shadow-[0_2px_0_0_#ED441D] hover:shadow-[0_4px_0_0_#ED441D] transition-all duration-200">
                      {project.description}
                    </p> */}

                      <p
                        className="leading-relaxed text-lg"
                        style={{ color: "#666666" }}
                      >
                        {project.details}
                      </p>

                      <div className="space-y-4">
                        <h4 className="font-bold text-2xl pb-2 inline-block relative">
                          Objetivos:
                        </h4>
                        <div className="flex flex-col gap-4">
                          {project.objectives.map(
                            (objective, objectiveIndex) => (
                              <div
                                key={objectiveIndex}
                                className="shadow-md rounded-lg px-4 py-3 flex items-center  hover:scale-[1.02] hover:shadow-xl group backdrop-blur-sm"
                                style={{
                                  background:
                                    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(75,186,170,0.15) 100%)",
                                  borderColor: "#4BBAAA",
                                  color: "#444",
                                  transition: "all 0.3s ease",
                                  boxShadow: "0 4px 15px rgba(244,182,59,0.08)",
                                }}
                              >
                                <span
                                  className="mr-3 flex items-center justify-center w-8 h-8 rounded-full transform transition-all duration-300 group-hover:scale-110"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #4BBAAA30 0%, #F4B63B20 100%)",
                                    border: "2px solid rgba(75,186,170,0.2)",
                                  }}
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    fill="#4BBAAA"
                                    viewBox="0 0 20 20"
                                  >
                                    <circle cx="10" cy="10" r="8" />
                                  </svg>
                                </span>
                                <span className="text-base font-medium">
                                  {objective}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 bg-gradient-to-br from-secondary to-[#0b2826] p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-lg">
                        <div className="flex items-center space-x-3 mb-6">
                          <h4 className="text-2xl font-bold text-white">
                            Resultados
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.results.map((result, resultIndex) => (
                            <div
                              key={resultIndex}
                              className="flex items-start space-x-3 p-4 bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 hover:border-primary/40 transition-all duration-300 group hover:shadow-md hover:shadow-primary/10"
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(77,185,169,0.5)]"></div>
                              </div>
                              <span className="text-gray-100 group-hover:text-white transition-colors duration-300 font-medium">
                                {result}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:flex-1 lg:max-w-lg ">
                      <div className="rounded-2xl overflow-hidden shadow-lg w-full p-2 bg-white">
                        <Swiper
                          modules={[Navigation, Pagination, Autoplay]}
                          spaceBetween={0}
                          slidesPerView={1}
                          navigation
                          pagination={{
                            clickable: true,
                            dynamicBullets: false,
                          }}
                          style={{
                            "--swiper-pagination-bottom": "5px",
                            "--swiper-pagination-color": "#3b82f6",
                            "--swiper-pagination-bullet-inactive-color":
                              "#9ca3af",
                          }}
                          autoplay={{
                            delay: 4000,
                            disableOnInteraction: true,
                          }}
                          className="project-swiper h-full"
                        >
                          {project.images.map((image, imageIndex) => (
                            <SwiperSlide key={imageIndex}>
                              <div className="relative aspect-square overflow-hidden rounded-lg">
                                <img
                                  src={image}
                                  alt={`${project.name} - Imagen ${
                                    imageIndex + 1
                                  }`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        <div className="p-6">
                          <h4
                            className="text-lg font-bold text-center mb-2"
                            style={{ color: "#222222" }}
                          >
                            {project.name}
                          </h4>
                          <p
                            className="text-center text-sm"
                            style={{ color: "#666666" }}
                          >
                            Galería de {project.images.length} imágenes del
                            proyecto
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Back to top */}
      <section className="py-16" style={{ backgroundColor: "#f8f8f8" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center px-6 py-3 text-white rounded-full transition-colors duration-200 font-medium"
            style={{ backgroundColor: "#4BBAAA" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#3da89a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4BBAAA")}
          >
            Volver al inicio
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectsSection;
