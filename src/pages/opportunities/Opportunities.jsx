import { useState } from "react";
import OpportunityCard from "../../components/opportunities/OpportunityCard";
import Pagination from "../../components/Pagination";
import { Search, Loader2 } from "lucide-react";
import { useOpportunities } from "../../hooks/useOpportunities";
import FiltersComponent from "../../components/opportunities/FiltersComponent";

export default function Opportunities() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;
  const combinedFilters = {
    // Combinar filtros del FiltersComponent con la búsqueda
    ...filters,
    ...(searchTerm.trim() && { search: searchTerm.trim() }),
  };

  const { opportunities, totalCount, totalPages, loading, error, refetch } =
    useOpportunities(combinedFilters, {
      page: currentPage,
      limit: itemsPerPage,
    });

  console.log(opportunities.length);

  // Handlers - Solo manejo de UI local
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Resetear a página 1 cuando se busca
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Resetear a página 1 cuando se filtra
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll suave hacia arriba al cambiar página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({});
    setCurrentPage(1);
  };

  const handleRetry = () => {
    refetch();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
            ¡Descubre y aprovecha las mejores oportunidades para jóvenes!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-6">
            ¡Explora becas, talleres y experiencias únicas para transformar tu
            futuro! Encuentra la oportunidad perfecta para crecer, aprender y
            conectar con el mundo.
          </p>
        </div>

        {/* Barra de búsqueda principal */}
        <div className="relative mb-8 max-w-xl mx-auto transform transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-primary" />
          </div>
          <input
            type="text"
            className="block w-full p-3 pl-10 text-base border-2 border-gray-200 rounded-xl 
                     bg-white shadow-sm transition-all duration-300
                     focus:ring-4 focus:ring-primary/20 focus:border-primary
                     hover:border-primary/50"
            placeholder="Buscar oportunidades por título, descripción o etiquetas..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Sección de filtros y resultados */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros - Sticky */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <FiltersComponent onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Contador de resultados */}
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando...
                  </span>
                ) : (
                  <>
                    Mostrando{" "}
                    <span className="font-medium text-primary">
                      {totalCount}
                    </span>{" "}
                    oportunidades
                  </>
                )}
              </p>
              {!loading && totalPages > 0 && (
                <div className="text-gray-600">
                  Página {currentPage} de {totalPages}
                </div>
              )}
            </div>

            {/* Estado de error */}
            {error && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 border-red-200">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <button
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 
                           transition-colors duration-300"
                  onClick={handleRetry}
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Estado de carga */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Skeleton cards */}
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
            )}

            {/* Grid de oportunidades */}
            {!loading && !error && opportunities.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                  />
                ))}
              </div>
            )}

            {/* Estado sin resultados */}
            {!loading && !error && opportunities.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg mb-4">
                  No se encontraron oportunidades con los filtros seleccionados.
                </p>
                <button
                  className="mt-4 text-primary hover:text-primary/80 font-medium 
                           transition-colors duration-300"
                  onClick={handleClearFilters}
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Paginación */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
