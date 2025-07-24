import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Función para calcular el rango de páginas a mostrar
  // Se muestra un máximo de 5 páginas, incluyendo la primera y la última
  const getPageRange = () => {
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageRange = getPageRange();

  return (
    <nav className="flex justify-center items-center space-x-1">
      {/* Botón anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </button>

      {/* Primera página y puntos suspensivos si es necesario */}
      {pageRange[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`h-8 w-8 rounded-md ${
              currentPage === 1
                ? "bg-primary text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            1
          </button>
          {pageRange[0] > 2 && <span className="px-2 text-gray-500">...</span>}
        </>
      )}

      {/* Páginas numeradas */}
      {pageRange.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-8 w-8 rounded-md ${
            currentPage === page
              ? "bg-primary text-white"
              : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Última página y puntos suspensivos si es necesario */}
      {pageRange[pageRange.length - 1] < totalPages && (
        <>
          {pageRange[pageRange.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`h-8 w-8 rounded-md ${
              currentPage === totalPages
                ? "bg-primary text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botón siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Página siguiente</span>
      </button>
    </nav>
  );
}
