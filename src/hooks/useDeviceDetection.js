import { useState, useEffect } from "react";

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Detectar por tamaño de pantalla
      const isMobileSize = width < 768; // Menor a tablet
      const isTabletSize = width >= 768 && width < 1024; // Tablet

      // Detectar por User Agent (más preciso)
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);

      // Detectar por características táctiles
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Combinación de criterios para mayor precisión
      setIsMobile(isMobileSize || (isMobileUA && !isTabletUA));
      setIsTablet((isTabletSize || isTabletUA) && !isMobileSize);
    };

    // Verificar al cargar
    checkDevice();

    // Verificar al redimensionar
    const handleResize = () => {
      checkDevice();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenSize,
    // Funciones útiles adicionales
    isSmallScreen: screenSize.width < 1024,
    isTouchDevice: "ontouchstart" in window || navigator.maxTouchPoints > 0,
  };
};
