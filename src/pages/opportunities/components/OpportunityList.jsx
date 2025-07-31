import { Loader2 } from "lucide-react";
import OpportunityCard from "../../../components/opportunities/OpportunityCard";

export default function OpportunityList({ 
  opportunities, 
  loading, 
  error, 
  itemsPerPage = 6,
  onRetry,
  onClearFilters
}) {
  // Estado de carga
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-red-200">
        <div className="text-red-500 text-lg mb-4">
          {error.message || "Ocurrió un error al cargar las oportunidades"}
        </div>
        <button
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 
                   transition-colors duration-300"
          onClick={onRetry}
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Sin resultados
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500 text-lg mb-4">
          No se encontraron oportunidades con los filtros seleccionados.
        </p>
        <button
          className="mt-4 text-primary hover:text-primary/80 font-medium 
                   transition-colors duration-300"
          onClick={onClearFilters}
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  // Lista de oportunidades
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
        />
      ))}
    </div>
  );
}
