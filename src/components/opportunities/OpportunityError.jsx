import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const OpportunityError = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error al cargar
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || "No se pudo cargar la oportunidad"}
        </p>
        <Link
          to="/edutracker"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Volver a oportunidades
        </Link>
      </div>
    </div>
  );
};

export default OpportunityError;
