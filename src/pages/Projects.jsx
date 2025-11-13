import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { projects } from "../data/projects";
import { ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";

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
      {/* Hero Section */}
      <section className="relative text-white min-h-screen flex flex-col">
        {/* Header - 30% */}
        <header className="relative h-[30vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-[#0b2826]">
          <div className="max-w-3xl">
            <div className="inline-block relative">
              <div
                className="absolute -inset-1 rounded-lg opacity-30 group-hover:opacity-50 transition duration-200"
                style={{
                  background:
                    "linear-gradient(90deg, #4db9a9 0%, #f5ba3c 50%, #ec451d 100%)",
                  filter: "blur(15px)",
                }}
              ></div>
              <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-100">
                Proyectos de EDU-US
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-200 mx-auto leading-relaxed font-light mt-8">
              Iniciativas enfocadas en generar cambios positivos y desarrollo
              sostenible en nuestras comunidades de jóvenes
            </p>
          </div>
        </header>

        {/* Navigation - 70% */}
        <nav
          className="relative flex-1 flex flex-col items-center justify-center px-10 lg:px-8 py-12 sm:py-4"
          style={{
            background:
              "linear-gradient(90deg, rgba(14, 26, 14, 1) 0%, rgba(14, 26, 14, 0.9) 25%, rgba(25, 80, 75, 1) 50%, rgba(14, 26, 14, 0.9) 75%, rgba(14, 26, 14, 1) 100%)",
          }}
        >
          {/* Fades for the blurred border effect */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0b2826] to-transparent pointer-events-none backdrop-blur-sm"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[hsl(175,55%,15%)] to-transparent pointer-events-none backdrop-blur-sm"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
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
                  className="group relative p-6 rounded-2xl overflow-hidden bg-cover bg-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gray-800/50"
                  style={{
                    backgroundImage: project.fondo
                      ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${project.fondo})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    "--tw-shadow-color": "rgba(77, 185, 169, 0.4)",
                    "--tw-shadow-colored":
                      "0 10px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color)",
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto bg-secondary">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 text-center">
                      {project.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-center text-s  text-accent font-bold">
                      Ver más
                      <ArrowRightIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform fill-primary" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </section>

      {/* Projects Details */}
      <section className="py-10 bg-secondary/10">
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
                        {project.objectives.map((objective, objectiveIndex) => (
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
                        ))}
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
                          dynamicBullets: true,
                        }}
                        style={{
                          "--swiper-pagination-bottom": "5px",
                          "--swiper-pagination-color": "#3b82f6",
                          "--swiper-pagination-bullet-inactive-color":
                            "#9ca3af",
                        }}
                        autoplay={{
                          delay: 4000,
                          disableOnInteraction: false,
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
