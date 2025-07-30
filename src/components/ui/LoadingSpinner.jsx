import React from "react";

const LoadingSpinner = ({
  message = "Cargando...",
  size = "lg",
  showMessage = true,
  className = "",
  fullScreen = false,
  overlay = false,
}) => {
  // Configuraciones de tamaño
  const sizeConfig = {
    sm: {
      container: "h-32",
      spinner: "h-12 w-12",
      center: "inset-2",
      text: "text-sm",
    },
    md: {
      container: "h-48",
      spinner: "h-16 w-16",
      center: "inset-2.5",
      text: "text-base",
    },
    lg: {
      container: "h-64",
      spinner: "h-20 w-20",
      center: "inset-3",
      text: "text-lg",
    },
    xl: {
      container: "h-80",
      spinner: "h-24 w-24",
      center: "inset-3.5",
      text: "text-xl",
    },
  };

  const config = sizeConfig[size] || sizeConfig.lg;

  // Contenedor base
  const baseClasses = fullScreen
    ? "fixed inset-0 flex flex-col justify-center items-center z-50"
    : `flex flex-col justify-center items-center ${config.container}`;

  // Overlay opcional
  const overlayClasses = overlay ? "bg-black/20 backdrop-blur-sm" : "";

  return (
    <div className={`${baseClasses} ${overlayClasses} ${className}`}>
      {/* Spinner */}
      <div className="relative flex">
        <span className={`relative flex ${config.spinner}`}>
          {/* Spinner principal con gradiente mejorado */}
          <span
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: `conic-gradient(
                from 0deg,
                #ED441D 0deg,
                #4BBAAA 90deg,
                #F4B63B 180deg,
                #ED441D 270deg,
                transparent 360deg
              )`,
              borderRadius: "50%",
              padding: "2px",
            }}
          >
            <span
              className="flex h-full w-full rounded-full bg-white"
              style={{
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
              }}
            ></span>
          </span>

          {/* Centro con efecto de profundidad */}
          <span
            className={`absolute ${config.center} bg-gradient-to-br from-white to-gray-50 rounded-full shadow-inner flex items-center justify-center`}
          >
            {/* Punto central pulsante */}
            <span className="w-2 h-2 bg-gradient-to-r from-[#ED441D] to-[#4BBAAA] rounded-full animate-pulse"></span>
          </span>
        </span>
      </div>

      {/* Mensaje con animación */}
      {showMessage && (
        <div className="mt-6 text-center animate-pulse">
          <p className={`font-medium text-gray-700 ${config.text} mb-2`}>
            {message}
          </p>
          {/* Dots animados */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-[#ED441D] rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#4BBAAA] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#F4B63B] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente específico para pantalla completa
export const FullScreenLoader = ({ message = "Cargando aplicación..." }) => (
  <LoadingSpinner
    message={message}
    size="xl"
    fullScreen={true}
    overlay={true}
    className="bg-white"
  />
);

// Componente para overlays
export const OverlayLoader = ({ message = "Procesando..." }) => (
  <LoadingSpinner
    message={message}
    size="lg"
    fullScreen={true}
    overlay={true}
  />
);

// Componente inline pequeño
export const InlineLoader = ({ message = "Cargando..." }) => (
  <LoadingSpinner
    message={message}
    size="sm"
    showMessage={true}
    className="py-4"
  />
);

// Componente para cards/secciones
export const SectionLoader = ({ message = "Cargando contenido..." }) => (
  <LoadingSpinner
    message={message}
    size="md"
    showMessage={true}
    className="min-h-[200px]"
  />
);

export default LoadingSpinner;
