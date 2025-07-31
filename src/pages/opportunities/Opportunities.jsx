import { useState, useCallback, useMemo } from "react";
import { useOpportunities } from "../../hooks/useOpportunities";
import FiltersComponent from "../../components/opportunities/FiltersComponent";
import Pagination from "../../components/Pagination";
import OpportunityList from "./components/OpportunityList";
import SearchHeader from "./components/SearchHeader";
import ResultsSummary from "./components/ResultsSummary";

const ITEMS_PER_PAGE = 6;

export default function Opportunities() {
  // Estados para filtros y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Combinar filtros con búsqueda
  const combinedFilters = useMemo(() => ({
    ...filters,
    ...(searchTerm.trim() && { search: searchTerm.trim() }),
  }), [filters, searchTerm]);

  // Obtener datos de oportunidades
  const { 
    opportunities, 
    totalCount, 
    totalPages, 
    loading, 
    error, 
    refetch 
  } = useOpportunities(combinedFilters, {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);
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

        {/* Barra de búsqueda */}
        <SearchHeader 
          searchTerm={searchTerm} 
          onSearchChange={handleSearch} 
          loading={loading} 
        />

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
            {/* Resumen de resultados */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <ResultsSummary 
                loading={loading}
                totalCount={totalCount}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>

            {/* Lista de oportunidades */}
            <OpportunityList 
              opportunities={opportunities}
              loading={loading}
              error={error}
              itemsPerPage={ITEMS_PER_PAGE}
              onRetry={handleRetry}
              onClearFilters={handleClearFilters}
            />

            {/* Paginación */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  itemsPerPage={ITEMS_PER_PAGE}
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
