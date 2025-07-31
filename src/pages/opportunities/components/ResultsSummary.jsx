import { Loader2 } from "lucide-react";

export default function ResultsSummary({ 
  loading, 
  totalCount, 
  currentPage, 
  totalPages 
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <p className="text-gray-600">
        Mostrando <span className="font-medium text-primary">{totalCount}</span> oportunidades
      </p>
      {totalPages > 0 && (
        <div className="text-gray-600">
          Página {currentPage} de {totalPages}
        </div>
      )}
    </div>
  );
}
