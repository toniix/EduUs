import React, { useMemo } from "react";
import PropTypes from "prop-types";

function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  itemsPerPage = 6,
  onPageChange,
}) {
  // Calcular rango de elementos mostrados
  const { startItem, endItem } = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalCount);
    return { startItem: start, endItem: end };
  }, [currentPage, itemsPerPage, totalCount]);

  // Generar números de página para mostrar
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];

    const delta = 2; // Cuántas páginas mostrar a cada lado de la actual
    const range = [];
    const rangeWithDots = [];
    let l;

    // Calcular el rango de páginas a mostrar
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Agregar primera página
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    // Agregar páginas del rango
    rangeWithDots.push(...range);

    // Agregar última página
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      if (range[range.length - 1] !== totalPages) {
        rangeWithDots.push(totalPages);
      }
    }

    // Eliminar duplicados y ordenar
    return [...new Set(rangeWithDots)].sort((a, b) => {
      if (a === "...") return 1;
      if (b === "...") return -1;
      return a - b;
    });
  }, [currentPage, totalPages]);

  // Si no hay páginas o solo hay una página, no mostrar la paginación
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-center mt-6 space-y-4 md:space-y-0">
      <div className="flex items-center space-x-2">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          aria-label="Página anterior"
        >
          &larr; Anterior
        </button>

        {/* Números de página */}
        <div className="hidden sm:flex items-center space-x-1">
          {pageNumbers.map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === "..." ? (
                <span className="px-3 py-1">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(Number(pageNum))}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                    pageNum === currentPage
                      ? "bg-secondary text-white"
                      : "border hover:bg-gray-50"
                  }`}
                  aria-current={pageNum === currentPage ? "page" : undefined}
                  aria-label={`Ir a la página ${pageNum}`}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          aria-label="Página siguiente"
        >
          Siguiente &rarr;
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  showPageSizeSelector: PropTypes.bool,
  onPageSizeChange: PropTypes.func,
};

export default React.memo(Pagination);
