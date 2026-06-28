import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const RegisterSidebarCTA = () => {
  return (
    <motion.div
      className="flex flex-col items-center gap-3.5 py-4 px-2 border-t border-gray-100 w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Fila superior: Imagen (55%) y Texto (40%) */}
      <div className="flex items-center justify-center gap-3.5 w-full">
        {/* Imagen */}
        <div className="w-[55%] flex-shrink-0 select-none pointer-events-none">
          <img
            src="/CTA-img.png"
            alt="Regístrate"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Texto */}
        <div className="w-[40%] flex-1 min-w-0 space-y-0.5 text-left">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
            ¡Encuentra más oportunidades como esta!
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 leading-snug">
            Crea tu cuenta para recibir alertas personalizadas y guardar tus
            favoritas.
          </p>
        </div>
      </div>

      {/* Botón abajo */}
      <Link
        to="/register"
        className="w-fit min-w-[165px] self-center flex items-center justify-center py-2.5 px-5 bg-primary text-white font-semibold text-xs rounded-xl shadow-sm shadow-primary/10 hover:bg-primary/95 transition-all duration-200"
      >
        Crear cuenta gratis
      </Link>
    </motion.div>
  );
};
export default RegisterSidebarCTA;
