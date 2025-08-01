import { useState, useCallback, useMemo } from "react";
import { useOpportunities } from "../../hooks/useOpportunities";
import FiltersComponent from "../../components/opportunities/FiltersComponent";
import Pagination from "../../components/Pagination";
import OpportunityList from "../../components/opportunities/OpportunityList";
import SearchHeader from "../../components/opportunities/SearchHeader";
import ResultsSummary from "../../components/opportunities/ResultsSummary";
import InlineLoading from "../../components/ui/LoadingSpinner";
import NotFoundOpportunities from "../../components/opportunities/NotFoundOpportunities";

const ITEMS_PER_PAGE = 9;

const Opportunities = () => {
  // Estados para filtros, búsqueda y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    opportunities: allOpportunities,
    totalCount,
    loading,
    error,
    refetch,
    filterOptions,
  } = useOpportunities(filters, {
    page: 1,
    limit: 1000,
  });

  const searchOpportunities = useCallback((term, opportunitiesList) => {
    if (!term || term.trim() === "") return opportunitiesList;

    const searchLower = term.toLowerCase();
    return opportunitiesList.filter(
      (opp) =>
        opp.title.toLowerCase().includes(searchLower) ||
        opp.description.toLowerCase().includes(searchLower) ||
        opp.location.toLowerCase().includes(searchLower) ||
        opp.tags?.some((tag) => tag.name.toLowerCase().includes(searchLower))
    );
  }, []);

  // Aplicar búsqueda del lado del cliente
  const filteredOpportunities = useMemo(
    () => searchOpportunities(searchTerm, allOpportunities),
    [searchTerm, allOpportunities, searchOpportunities]
  );

  // Determinar si estamos en modo búsqueda
  const isSearching = useMemo(() => searchTerm.trim() !== "", [searchTerm]);

  // Oportunidades a mostrar según el modo
  const displayOpportunities = useMemo(() => {
    if (isSearching) {
      // En búsqueda: mostrar todos los resultados filtrados
      return filteredOpportunities;
    } else {
      // Vista normal: aplicar paginación
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return allOpportunities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }
  }, [isSearching, filteredOpportunities, allOpportunities, currentPage]);

  // Calcular páginas para vista normal
  const totalPages = useMemo(
    () => Math.ceil(allOpportunities.length / ITEMS_PER_PAGE),
    [allOpportunities.length]
  );

  // Handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    // No necesitamos resetear página porque en búsqueda no hay paginación
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

  // Mostrar error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 pt-20 text-center">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error al cargar las oportunidades.{" "}
                  <button
                    onClick={handleRetry}
                    className="font-medium text-red-700 hover:text-red-600 underline"
                  >
                    Reintentar
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
            ¡Descubre y aprovecha las mejores oportunidades para jóvenes!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-6">
            Explora becas, talleres y experiencias únicas para transformar tu
            futuro. Encuentra la oportunidad perfecta para crecer, aprender y
            conectar con el mundo.
          </p>
        </header>

        {/* Barra de búsqueda */}
        <SearchHeader searchTerm={searchTerm} onSearchChange={handleSearch} />

        {/* Indicador de búsqueda activa */}
        {isSearching && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium">
                  Resultados de búsqueda para "{searchTerm}"
                </p>
                <p className="text-blue-600 text-sm">
                  {filteredOpportunities.length} resultado(s) encontrado(s)
                </p>
              </div>
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          </div>
        )}

        {/* Mobile filter dialog */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setShowMobileFilters(true)}
          >
            Filtros
          </button>
        </div>

        {/* Sección de filtros y resultados */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros - Sticky */}
          <section className="hidden lg:block lg:w-1/4">
            <div className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <FiltersComponent
                onFilterChange={handleFilterChange}
                filterOptions={filterOptions}
              />
            </div>
          </section>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  onClick={() => setShowMobileFilters(false)}
                ></div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <span className="sr-only">Cerrar</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Filtros
                      </h3>
                      <div className="mt-2">
                        <FiltersComponent
                          onFilterChange={(filters) => {
                            handleFilterChange(filters);
                            setShowMobileFilters(false);
                          }}
                          filterOptions={filterOptions}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido Principal */}
          <main className="flex-1">
            {loading && allOpportunities.length === 0 ? (
              <InlineLoading message="Cargando oportunidades..." />
            ) : (
              <>
                {/* Resumen de resultados */}
                <ResultsSummary
                  totalCount={totalCount}
                  filteredCount={displayOpportunities.length}
                  onClearFilters={handleClearFilters}
                  hasActiveFilters={
                    Object.keys(filters).length > 0 || isSearching
                  }
                  isSearching={isSearching}
                  searchTerm={searchTerm}
                />

                {/* Lista de oportunidades */}
                <section className="mt-6">
                  {displayOpportunities.length > 0 ? (
                    <>
                      <OpportunityList
                        opportunities={displayOpportunities}
                        onRetry={refetch}
                      />

                      {/* Paginación: SOLO mostrar si NO estamos buscando */}
                      {!isSearching && totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={allOpportunities.length}
                            onPageChange={handlePageChange}
                            itemsPerPage={ITEMS_PER_PAGE}
                          />
                        </div>
                      )}

                      {/* Mensaje informativo para búsqueda */}
                      {isSearching && (
                        <div className="mt-8 text-center">
                          <p className="text-gray-600 text-sm">
                            Mostrando todos los resultados de búsqueda (
                            {filteredOpportunities.length} de{" "}
                            {allOpportunities.length} oportunidades)
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <NotFoundOpportunities
                      isSearching={isSearching}
                      searchTerm={searchTerm}
                      handleClearFilters={handleClearFilters}
                      setSearchTerm={setSearchTerm}
                    />
                  )}
                </section>
              </>
            )}
          </main>
        </div>
      </section>
    </section>
  );
};

export default Opportunities;
