import { useState, useCallback, useMemo, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import FiltersComponent from "../../components/opportunities/FiltersComponent";
import Pagination from "../../components/Pagination";
import OpportunityList from "../../components/opportunities/OpportunityList";
import SearchHeader from "../../components/opportunities/SearchHeader";
import ResultsSummary from "../../components/opportunities/ResultsSummary";
import InlineLoading from "../../components/ui/LoadingSpinner";
import NotFoundOpportunities from "../../components/opportunities/NotFoundOpportunities";
import { useOpportunities } from "../../hooks/useOpportunities";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import SEO from "../../components/SEO";

const ITEMS_PER_PAGE = 12;

const Opportunities = () => {
  const [localSearch, setLocalSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    opportunities: allOpportunities,
    totalCount,
    loading,
    error,
    refetch,
    filterOptions,
    filters: globalFilters,
    updateFilters,
    clearFilters,
    updatePagination,
    totalPages,
    pagination,
  } = useOpportunities();

  const currentPage = pagination.page || 1;

  const [localFilters, setLocalFilters] = useState({
    modality: globalFilters.modality || "",
    location: globalFilters.location || "",
    category_id: globalFilters.category_id || "",
    country: globalFilters.country || "",
    show_expired: globalFilters.show_expired || false,
    sort: globalFilters.sort || "created_at_desc",
  });

  // Sincronizar los filtros locales con los globales cuando cambien
  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      ...globalFilters,
    }));
  }, [globalFilters]);

  // Sincronizar la barra de búsqueda local con los filtros del contexto
  useEffect(() => {
    setLocalSearch(globalFilters.search || "");
  }, [globalFilters.search]);

  // Bloquear el scroll del body cuando los filtros móviles estén abiertos
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileFilters]);

  // Configurar la paginación inicial en el contexto
  useEffect(() => {
    updatePagination({
      page: 1,
      limit: ITEMS_PER_PAGE,
      sortBy: "created_at",
      sortOrder: "desc",
    });
  }, [updatePagination]);

  // Determinar si estamos en modo búsqueda (si hay un filtro de búsqueda aplicado)
  const isSearching = useMemo(
    () => (globalFilters.search || "").trim() !== "",
    [globalFilters.search]
  );

  const hasActiveFilters = useMemo(() => {
    return Object.entries(globalFilters).some(([key, value]) => {
      if (key === "sort") return false;
      if (key === "search") return false;
      return value !== "" && value !== false && value !== undefined;
    });
  }, [globalFilters]);

  // Handlers
  const handleSearchChange = useCallback((term) => {
    setLocalSearch(term);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    updateFilters({ search: localSearch });
    updatePagination({ page: 1 });
  }, [localSearch, updateFilters, updatePagination]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch("");
    updateFilters({ search: "" });
    updatePagination({ page: 1 });
  }, [updateFilters, updatePagination]);

  const handlePageChange = useCallback(
    (pageNumber) => {
      updatePagination({ page: pageNumber });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updatePagination],
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      const { sort, ...restFilters } = newFilters;

      // Traducir el ordenamiento de la UI a sortBy/sortOrder del API
      if (sort) {
        let sortBy = "created_at";
        let sortOrder = "desc";
        if (sort === "deadline_asc") {
          sortBy = "deadline";
          sortOrder = "asc";
        } else if (sort === "created_at_desc") {
          sortBy = "created_at";
          sortOrder = "desc";
        } else if (sort === "title_asc") {
          sortBy = "title";
          sortOrder = "asc";
        }
        updatePagination({
          sortBy,
          sortOrder,
          page: 1,
        });
      } else {
        updatePagination({ page: 1 });
      }

      updateFilters({
        ...restFilters,
        sort: sort || "created_at_desc",
      });
    },
    [updateFilters, updatePagination],
  );

  const handleClearFilters = useCallback(() => {
    setLocalSearch("");
    setLocalFilters({
      modality: "",
      location: "",
      category_id: "",
      country: "",
      show_expired: false,
      sort: "created_at_desc",
    });
    clearFilters();
    updatePagination({
      page: 1,
      sortBy: "created_at",
      sortOrder: "desc",
      limit: ITEMS_PER_PAGE,
    });
  }, [clearFilters, updatePagination]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Mostrar error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 text-center">
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
    <>
      <SEO
        title="Edutracker: oportunidades seguras en un solo lugar"
        description="Explora becas, talleres y experiencias únicas para tu futuro."
      />
      <section className="min-h-screen bg-secondary/10">
        <section className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
              Edutracker: oportunidades seguras en un solo lugar.
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-6">
              Explora becas, talleres y experiencias únicas para tu futuro.
            </p>
          </header>

          {/* Barra de búsqueda con contador */}
          <div className="relative mb-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <div className="w-full md:flex-1">
                <SearchHeader
                  searchTerm={localSearch}
                  onSearchChange={handleSearchChange}
                  onSearchSubmit={handleSearchSubmit}
                  onClearSearch={handleClearSearch}
                  loading={loading}
                />
              </div>

              {isSearching && (
                <div className="w-full md:w-auto flex-shrink-0 mt-1 md:mt-0">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 inline-flex items-center">
                    <span className="text-secondary text-sm font-medium">
                      {totalCount} resultado
                      {totalCount !== 1 ? "s" : ""}
                      {globalFilters.search && ` para "${globalFilters.search}"`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile filter button */}
          <div className="lg:hidden mb-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-sm shadow-slate-950/10 active:scale-95 transition-all duration-150"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
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
                  clearFilters={clearFilters}
                  localFilters={localFilters}
                  setLocalFilters={setLocalFilters}
                />
              </div>
            </section>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  {/* Backdrop */}
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowMobileFilters(false)}
                  />

                  {/* Bottom Sheet */}
                  <m.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="fixed bottom-0 inset-x-0 bg-white rounded-t-[2rem] shadow-2xl border-t border-slate-100 flex flex-col max-h-[85vh] overflow-hidden"
                  >
                    {/* Pull indicator */}
                    <div className="flex justify-center py-3 flex-shrink-0">
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-center px-6 pb-4 border-b border-slate-100 flex-shrink-0">
                      <h3 className="text-lg font-heading font-extrabold text-slate-800">
                        Filtros
                      </h3>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="text-xs flex items-center gap-1 font-bold text-slate-500 hover:text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Restablecer</span>
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 active:scale-95 transition-all duration-150"
                          onClick={() => setShowMobileFilters(false)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 pb-12">
                      <FiltersComponent
                        onFilterChange={(filters) => {
                          handleFilterChange(filters);
                          setShowMobileFilters(false);
                        }}
                        filterOptions={filterOptions}
                        clearFilters={clearFilters}
                        localFilters={localFilters}
                        setLocalFilters={setLocalFilters}
                        hideHeader={true}
                      />
                    </div>
                  </m.div>
                </div>
              )}
            </AnimatePresence>

            {/* Contenido Principal */}
            <main className="flex-1">
              {loading && allOpportunities.length === 0 ? (
                <InlineLoading message="Cargando oportunidades..." />
              ) : (
                <>
                  {/* Resumen de resultados */}
                  <ResultsSummary
                    totalCount={totalCount}
                    filteredCount={allOpportunities.length}
                    onClearFilters={handleClearFilters}
                    hasActiveFilters={hasActiveFilters || isSearching}
                    isSearching={isSearching}
                    searchTerm={globalFilters.search || ""}
                  />

                  {/* Lista de oportunidades */}
                  <section className="mt-6">
                    {allOpportunities.length > 0 ? (
                      <>
                        <OpportunityList
                          opportunities={allOpportunities}
                          onRetry={refetch}
                        />

                        {/* Paginación */}
                        {totalPages > 1 && (
                          <div className="mt-8">
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              totalItems={totalCount}
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
                              {allOpportunities.length} de {totalCount}{" "}
                              oportunidades)
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <NotFoundOpportunities
                        isSearching={isSearching}
                        searchTerm={globalFilters.search || ""}
                        handleClearFilters={handleClearFilters}
                        setSearchTerm={handleClearSearch}
                      />
                    )}
                  </section>
                </>
              )}
            </main>
          </div>
        </section>
      </section>
    </>
  );
};

export default Opportunities;
