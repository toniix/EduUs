import React from "react";
function PaginationComponent({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
}) {
  // Calcular rango de elementos mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const delta = 2; // Cuántas páginas mostrar a cada lado de la actual
    const range = [];
    const rangeWithDots = [];

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
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="pagination-container">
      {/* Información de elementos */}
      <div className="pagination-info">
        Mostrando {startItem}-{endItem} de {totalCount} resultados
      </div>

      {/* Controles de paginación */}
      <div className="pagination-controls">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn pagination-prev"
        >
          ← Anterior
        </button>

        {/* Números de página */}
        <div className="pagination-numbers">
          {getPageNumbers().map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === "..." ? (
                <span className="pagination-dots">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(pageNum)}
                  className={`pagination-number ${
                    pageNum === currentPage ? "active" : ""
                  }`}
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
          disabled={currentPage === totalPages}
          className="pagination-btn pagination-next"
        >
          Siguiente →
        </button>
      </div>

      {/* Selector de elementos por página */}
      <div className="pagination-size-selector">
        <label>
          Mostrar:
          <select
            value={itemsPerPage}
            onChange={(e) => {
              // Aquí necesitarías actualizar el itemsPerPage en el componente padre
              // O manejarlo como prop
              console.log("Cambiar a:", e.target.value);
            }}
          >
            <option value={6}>6 por página</option>
            <option value={12}>12 por página</option>
            <option value={24}>24 por página</option>
            <option value={48}>48 por página</option>
          </select>
        </label>
      </div>
    </div>
  );
}
export default PaginationComponent;
