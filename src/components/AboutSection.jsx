import React from "react";

const AboutSection = () => {
  const items = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      title: "Hoy hacemos",
      description:
        "Hoy en día, trabajamos con jóvenes peruanos de 18 a 28 años que estudian o trabajan en contextos desafiantes, muchos de ellos provenientes de regiones fuera de Lima y con barreras socioeconómicas.",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
      title: "Buscamos ser",
      description:
        "Buscamos ser el puente entre jóvenes peruanos y el mercado laboral, desarrollando sus capacidades a través de formación en empleabilidad, habilidades digitales e inteligencia artificial, con un acompañamiento humano que respeta y entiende su contexto.",
    },
  ];

  return (
    <section className="pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 lg:px-8 bg-secondary-light">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="relative inline-block">
              <span className="relative z-10">Lo que hacemos hoy</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/70 -z-0 transform -rotate-1"></span>
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative w-full h-96 sm:h-80 lg:h-96 cursor-pointer perspective-1000"
            >
              {/* Flashcard Container */}
              <div className="relative w-full h-full transform-style-preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                {/* Front Side (Image) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle overlay for better contrast */}
                  <div className="absolute inset-0 bg-black/10" />

                  {/* Title hint on front */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6">
                    <h3 className="text-white text-xl lg:text-2xl font-bold">
                      {item.title}
                    </h3>
                  </div>

                  {/* Hover indicator */}
                  <div
                    className="absolute top-4 right-4 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "rgba(237, 68, 29, 0.9)" }}
                  >
                    <svg
                      className="w-5 h-5 text-white transform rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Back Side (Content) */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, #4BBAAA 0%, #ED441D 50%, #F4B63B 100%)`,
                  }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute top-10 left-10 w-20 h-20 border-2 rounded-full"
                      style={{ borderColor: "#FFFFFF" }}
                    />
                    <div
                      className="absolute bottom-16 right-12 w-16 h-16 border rounded-full"
                      style={{ borderColor: "#FFFFFF" }}
                    />
                    <div
                      className="absolute top-1/2 right-8 w-8 h-8 rounded-full"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                    <div
                      className="absolute bottom-1/3 left-6 w-12 h-12 border rounded-full"
                      style={{ borderColor: "#FFFFFF" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 max-w-xs sm:max-w-sm h-full flex flex-col justify-center">
                    <div className="flex-1 flex flex-col justify-center min-h-0">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 flex-shrink-0"
                        style={{
                          backgroundColor: "rgba(244, 182, 59, 0.3)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8"
                          fill="none"
                          stroke="#FFFFFF"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>

                      <h3
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 flex-shrink-0"
                        style={{ color: "#FFFFFF" }}
                      >
                        {item.title}
                      </h3>

                      <div className="flex-1 flex items-center min-h-0">
                        <p
                          className="text-sm sm:text-base lg:text-lg leading-relaxed overflow-hidden"
                          style={{
                            color: "rgba(255, 255, 255, 0.95)",
                            WebkitLineClamp: window.innerWidth < 640 ? 4 : 3,
                            WebkitBoxOrient: "vertical",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS personalizado para el efecto 3D */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .group:hover .rotate-y-180 {
          transform: rotateY(0deg);
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
