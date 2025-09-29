import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronDown } from "lucide-react";
import { projects } from "../data/projects";

const ProjectsSection = () => {
  const scrollToProject = (projectId) => {
    const element = document.getElementById(projectId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative text-white min-h-screen flex flex-col"
        style={{
          background: `linear-gradient(135deg, #0c2b2a 0%, #1a3d3b 100%)`,
        }}
      >
        {/* Fondo con textura sutil */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E")
      `,
            backgroundColor: "#0c2b2a",
          }}
        ></div>

        {/* Efecto de partículas con los colores de la marca */}
        <div className="absolute inset-0 overflow-hidden opacity-70">
          {/* Verde agua principal (#4db9a9) más intenso */}
          <div
            className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(77,185,169,0.25) 0%, rgba(12,43,42,0) 70%)",
              filter: "blur(80px)",
            }}
          ></div>

          {/* Naranja (#f5ba3c) más sutil */}
          <div
            className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(245,186,60,0.15) 0%, rgba(12,43,42,0) 70%)",
              filter: "blur(80px)",
              animation: "float 25s ease-in-out infinite",
            }}
          ></div>

          {/* Rojo (#ec451d) más sutil */}
          <div
            className="absolute bottom-0 right-1/4 w-[550px] h-[550px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(236,69,29,0.1) 0%, rgba(12,43,42,0) 70%)",
              filter: "blur(80px)",
              animation: "float 30s ease-in-out infinite 5s",
            }}
          ></div>
        </div>

        {/* Contenido principal */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex-1 flex flex-col">
          {/* Contenido superior */}
          <div className="text-center mb-4 lg:mb-8">
            <div className="inline-block relative">
              <div
                className="absolute -inset-1 rounded-lg opacity-30 group-hover:opacity-50 transition duration-200"
                style={{
                  background:
                    "linear-gradient(90deg, #4db9a9 0%, #f5ba3c 50%, #ec451d 100%)",
                  filter: "blur(15px)",
                }}
              ></div>
              <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4db9a9] via-[#f5ba3c] to-[#ec451d]">
                  Proyectos de EDU-US
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-8 mt-8">
              Iniciativas enfocadas en generar cambios positivos y desarrollo
              sostenible en nuestras comunidades de jóvenes
            </p>
          </div>

          {/* Navegación de proyectos integrada */}
          <div className="mt-auto mb-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {projects.slice(0, 4).map((project) => {
                const IconComponent = project.icon;
                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      scrollToProject(project.id);
                      document.getElementById(project.id)?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-gradient-to-br hover:from-white/10 hover:to-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    style={{
                      "--tw-shadow-color": "rgba(77, 185, 169, 0.4)",
                      "--tw-shadow-colored":
                        "0 10px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "radial-gradient(circle at center, rgba(77,185,169,0.1) 0%, rgba(0,0,0,0) 70%)",
                      }}
                    ></div>
                    <div className="relative z-10">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto"
                        style={{
                          background:
                            "linear-gradient(135deg, #4db9a9 0%, #3da89a 100%)",
                        }}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {project.shortDescription}
                      </p>
                      <div
                        className="mt-3 flex items-center justify-center text-xs font-medium"
                        style={{
                          background:
                            "linear-gradient(90deg, #4db9a9, #f5ba3c)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Ver más
                        <svg
                          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{
                            stroke: "url(#gradient)",
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#4db9a9" />
                              <stop offset="100%" stopColor="#f5ba3c" />
                            </linearGradient>
                          </defs>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indicador de scroll */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Details */}
      <section className="py-10 bg-secondary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
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

                    <p className="text-lg text-gray-600 font-medium pb-2 shadow-[0_2px_0_0_#ED441D] hover:shadow-[0_4px_0_0_#ED441D] transition-all duration-200">
                      {project.description}
                    </p>

                    <p
                      className="leading-relaxed text-lg"
                      style={{ color: "#666666" }}
                    >
                      {project.details}
                    </p>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-xl pb-2 inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-24 after:h-1 after:bg-gradient-to-r after:from-primary after:to-[#4db9a9] after:rounded-full">
                        Objetivos:
                      </h4>
                      <div className="flex flex-col gap-4">
                        {project.objectives.map((objective, objectiveIndex) => (
                          <div
                            key={objectiveIndex}
                            className="shadow-md rounded-lg px-4 py-3 flex items-center border-l-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group backdrop-blur-sm"
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
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-xl pb-2 inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-24 after:h-1 after:bg-gradient-to-r after:from-primary after:to-[#4db9a9] after:rounded-full">
                        Resultados obtenidos:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.results.map((result, resultIndex) => (
                          <span
                            key={resultIndex}
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: "#f0f0f0",
                              color: "#222222",
                            }}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:flex-1 lg:max-w-lg">
                    <div
                      className="rounded-2xl overflow-hidden shadow-lg w-full"
                      style={{ backgroundColor: "#FFFFFF" }}
                    >
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                          delay: 4000,
                          disableOnInteraction: false,
                        }}
                        className="project-swiper"
                      >
                        {project.images.map((image, imageIndex) => (
                          <SwiperSlide key={imageIndex}>
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={image}
                                alt={`${project.name} - Imagen ${
                                  imageIndex + 1
                                }`}
                                // className="w-full h-full object-cover"
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
