import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronDown, ExternalLink, Github, Globe } from "lucide-react";
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
        className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #ED441D 0%, #c73a17 50%, #a02f12 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Proyectos de EDU-US
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Iniciativas enfocadas en generar cambios positivos y desarrollo
              sostenible en nuestras comunidades de jóvenes
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => scrollToProject("navigation")}
                className="px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ backgroundColor: "#FFFFFF", color: "#ED441D" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f8f8")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#FFFFFF")
                }
              >
                Explorar Proyectos
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            fill="none"
            className="w-full h-20 md:h-32"
          >
            <path
              d="M0,120 C150,80 350,40 600,60 C850,80 1050,40 1200,80 L1200,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Projects Navigation */}
      <section
        id="navigation"
        className="py-16"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#222222" }}
            >
              Proyectos Sociales
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#666666" }}
            >
              Haz clic en cualquier proyecto para ver los detalles completos
            </p>
          </div> */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {projects.map((project) => {
              const IconComponent = project.icon;
              return (
                <button
                  key={project.id}
                  onClick={() => scrollToProject(project.id)}
                  className="group flex flex-col items-center p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: "#FFFFFF" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f0fffe")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#FFFFFF")
                  }
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
      <section className="py-16">
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
                      <h4
                        className="font-semibold"
                        style={{ color: "#222222" }}
                      >
                        Objetivos:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {project.objectives.map((objective, objectiveIndex) => (
                          <li
                            key={objectiveIndex}
                            className="flex items-center"
                            style={{ color: "#666666" }}
                          >
                            <div
                              className="w-2 h-2 rounded-full mr-3"
                              style={{ backgroundColor: "#4BBAAA" }}
                            ></div>
                            {objective}
                          </li>
                        ))}
                      </ul>
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

                  <div className="flex-1 max-w-lg">
                    <div
                      className="rounded-2xl overflow-hidden shadow-lg"
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
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="p-6">
                        <div className="flex items-center justify-center mb-3">
                          <IconComponent
                            className="w-8 h-8"
                            style={{ color: "#4BBAAA" }}
                          />
                        </div>
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
