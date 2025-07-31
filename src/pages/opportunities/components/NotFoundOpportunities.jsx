const NotFoundOpportunities = ({
  isSearching,
  searchTerm,
  handleClearFilters,
  setSearchTerm,
}) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isSearching
          ? `No se encontraron oportunidades para "${searchTerm}"`
          : "No se encontraron oportunidades"}
      </h3>
      <p className="text-gray-500">
        {isSearching
          ? "Intenta con otros términos de búsqueda o revisa los filtros aplicados."
          : "No hay oportunidades que coincidan con tus criterios de búsqueda."}
      </p>
      <div className="mt-4 space-x-3">
        {isSearching && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            Limpiar búsqueda
          </button>
        )}
        <button
          type="button"
          onClick={handleClearFilters}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
        >
          Limpiar {isSearching ? "todo" : "filtros"}
        </button>
      </div>
    </div>
  );
};

export default NotFoundOpportunities;
