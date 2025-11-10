import React from "react";
import { AboutItems } from "../data/aboutData";
import styles from "./AboutSection.module.css";

const AboutSection = () => {
  const [hoveredCard, setHoveredCard] = React.useState(null);

  return (
    <section className="py-12 sm:pt-12 lg:py-14 px-4 sm:px-6 lg:px-8 bg-light">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="relative inline-block">Lo que hacemos hoy</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {AboutItems.map((item) => (
            <div
              key={item.id}
              className={`relative w-full h-96 sm:h-80 lg:h-96 cursor-pointer ${styles.perspective1000}`}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Flashcard Container */}
              <div
                className={`relative w-full h-full ${styles.transformStylePreserve3d}`}
              >
                {/* Front Side (Image) */}
                <div
                  className={`absolute inset-0 w-full h-full ${styles.backfaceHidden} rounded-2xl overflow-hidden shadow-lg`}
                  style={{
                    transform:
                      hoveredCard === item.id
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    transition: "transform 0.7s",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6">
                    <h3 className="text-white text-xl lg:text-2xl font-bold">
                      {item.title}
                    </h3>
                  </div>
                  <div
                    className="absolute top-4 right-4 rounded-full p-3 transition-opacity duration-300"
                    style={{
                      backgroundColor: "rgba(237, 68, 29, 0.9)",
                      opacity: hoveredCard === item.id ? 1 : 0,
                    }}
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
                  className="absolute inset-0 w-full h-full rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-center overflow-hidden"
                  style={{
                    transform:
                      hoveredCard === item.id
                        ? "rotateY(0deg)"
                        : "rotateY(-180deg)",
                    transition: "transform 0.7s",
                    background:
                      "linear-gradient(135deg, #fef2f2 0%, #f0fdfa 50%, #fef9e6 100%)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* Content */}
                  <div className="relative z-10 max-w-xs sm:max-w-sm h-full flex flex-col justify-center">
                    <div className="flex-1 flex flex-col justify-center min-h-0">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 flex-shrink-0 bg-accent"
                        style={{
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

                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 flex-shrink-0 text-dark/500">
                        {item.title}
                      </h3>

                      <div className="flex-1 flex items-center min-h-0">
                        <p
                          className="text-sm sm:text-base lg:text-lg leading-relaxed overflow-hidden text-dark"
                          style={{
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
    </section>
  );
};

export default AboutSection;
