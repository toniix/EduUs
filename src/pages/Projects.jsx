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
        className="relative text-white overflow-hidden min-h-[85vh] flex items-center"
        style={{
          background: `linear-gradient(135deg, #ED441D 0%, #F4B63B 100%)`,
        }}
      >
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#4BBAAA]/20 via-transparent to-[#F4B63B]/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>

        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4BBAAA] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -left-20 w-72 h-72 bg-[#F4B63B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-40 w-96 h-96 bg-[#ED441D] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-block">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 drop-shadow-lg">
                Proyectos de EDU-US
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Iniciativas enfocadas en generar cambios positivos y desarrollo
              sostenible en nuestras comunidades de jóvenes
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => scrollToProject("navigation")}
                className="group px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-1 bg-gradient-to-r from-[#4BBAAA] to-[#4BBAAA]/90"
                style={{
                  boxShadow: "0 20px 40px -15px rgba(75,186,170,0.4)",
                }}
              >
                <span className="bg-clip-text font-medium text-lg">
                  Explorar Proyectos
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Navigation */}
      <section
        id="navigation"
        className="py-16"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#666666" }}
            >
              Haz clic en cualquier proyecto para ver los detalles completos
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {projects.map((project) => {
              const IconComponent = project.icon;
              return (
                <button
                  key={project.id}
                  onClick={() => scrollToProject(project.id)}
                  className="group flex flex-col items-center p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300"
                    style={{ backgroundColor: "#e6f7f5" }}
                  >
                    <IconComponent
                      className="w-8 h-8 transition-colors duration-300"
                      style={{ color: "#4BBAAA" }}
                    />
                  </div>
                  <h3
                    className="font-semibold text-center text-sm md:text-base transition-colors duration-300"
                    style={{ color: "#222222" }}
                  >
                    {project.name}
                  </h3>
                  <ChevronDown
                    className="w-4 h-4 mt-2 transition-all duration-300 group-hover:translate-y-1"
                    style={{ color: "#999999" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Details */}
      <section className="py-10">
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
                          style={{ color: "#F4B63B" }}
                        />
                      </div>
                      <h3
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: "#222222" }}
                      >
                        {project.name}
                      </h3>
                    </div>

                    <p
                      className="text-lg font-medium"
                      style={{ color: "#ED441D" }}
                    >
                      {project.description}
                    </p>

                    <p
                      className="leading-relaxed text-lg"
                      style={{ color: "#666666" }}
                    >
                      {project.details}
                    </p>

                    <div className="space-y-4">
                      <h3
                        className="font-semibold"
                        style={{ color: "#222222" }}
                      >
                        Objetivos:
                      </h3>
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
                      <h4
                        className="font-semibold"
                        style={{ color: "#222222" }}
                      >
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
