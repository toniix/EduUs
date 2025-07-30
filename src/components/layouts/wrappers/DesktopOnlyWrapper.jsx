import React from "react";
import { useDeviceDetection } from "../../../hooks/useDeviceDetection";
import { Monitor, Smartphone, Tablet, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DesktopOnlyWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop, screenSize } = useDeviceDetection();

  // Si es desktop, mostrar el contenido normal
  if (isDesktop) {
    return children;
  }

  // Si no es desktop, mostrar mensaje de restricción
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        {/* Icono del dispositivo detectado */}
        <div className="mb-6">
          {isMobile ? (
            <Smartphone className="mx-auto h-20 w-20 text-orange-500" />
          ) : isTablet ? (
            <Tablet className="mx-auto h-20 w-20 text-blue-500" />
          ) : (
            <Monitor className="mx-auto h-20 w-20 text-gray-500" />
          )}
        </div>

        {/* Título principal */}
        <div className="mb-4">
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Restringido
          </h1>
        </div>

        {/* Mensaje específico según dispositivo */}
        <div className="mb-6">
          {isMobile ? (
            <p className="text-gray-600 leading-relaxed">
              El panel de administración no está disponible en dispositivos
              móviles. Por favor, accede desde una computadora de escritorio
              para una mejor experiencia.
            </p>
          ) : isTablet ? (
            <p className="text-gray-600 leading-relaxed">
              El panel de administración requiere una pantalla más grande. Por
              favor, accede desde una computadora de escritorio.
            </p>
          ) : (
            <p className="text-gray-600 leading-relaxed">
              Tu pantalla es demasiado pequeña para el panel de administración.
              Se requiere una resolución mínima de 1024px de ancho.
            </p>
          )}
        </div>

        {/* Información técnica */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Información técnica:</p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>
              Resolución actual: {screenSize.width} x {screenSize.height}px
            </p>
            <p>
              Dispositivo:{" "}
              {isMobile ? "Móvil" : isTablet ? "Tablet" : "Escritorio"}
            </p>
            <p>Resolución requerida: Mínimo 1024px de ancho</p>
          </div>
        </div>

        {/* Iconos de dispositivos compatibles */}
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500 mb-3">
            Dispositivos compatibles:
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex flex-col items-center">
              <Monitor className="h-8 w-8 text-green-500 mb-1" />
              <span className="text-xs text-gray-500">Desktop</span>
            </div>
          </div>
        </div>

        {/* Botón para refrescar */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Ir a la página principal
        </button>
      </div>
    </div>
  );
};

export default DesktopOnlyWrapper;
