import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export default function NoAccessFallback() {
  console.log("NoAccessFallback");
  return (
    <div className="p-12 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-light rounded-xl shadow-lg border border-primary/10">
      <div className="flex flex-col items-center gap-2">
        <Lock className="h-14 w-14 text-primary mb-2 drop-shadow-lg animate-pulse" />
        <h2 className="text-2xl font-bold text-red-600 mb-1">
          No tienes permisos para acceder a esta sección
        </h2>
        <p className="text-gray-600 text-lg max-w-md text-center">
          Esta área está reservada para usuarios con permisos especiales.
          <br />
          Si crees que esto es un error, contacta con un administrador.
        </p>
      </div>
      <Link
        to="/"
        className="inline-block mt-2 px-6 py-3 bg-primary text-white rounded-full font-semibold shadow hover:bg-secondary transition-colors text-base"
      >
        Explora oportunidades
      </Link>
    </div>
  );
}
