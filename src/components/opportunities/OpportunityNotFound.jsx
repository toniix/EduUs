import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const OpportunityNotFound = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <div className="text-center py-12">
        <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Oportunidad no encontrada
        </h2>
        <p className="text-gray-600 mb-4">
          La oportunidad que buscas no existe o ha sido eliminada.
        </p>
        <Link
          to="/edutracker"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Explorar otras oportunidades
        </Link>
      </div>
    </div>
  );
};

export default OpportunityNotFound;
