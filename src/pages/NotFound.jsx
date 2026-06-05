import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7F4]">
      <SEO
        title="Página no encontrada (404) | EDU-US"
        description="Lo sentimos, la página que buscas no existe. Vuelve al inicio para explorar becas y oportunidades internacionales."
        noindex={true}
      />
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <h1 className="text-6xl mb-4">404 - Página no encontrada</h1>
        <p className="text-2xl mb-4">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link to="/" className="text-xl text-blue-500 hover:underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
