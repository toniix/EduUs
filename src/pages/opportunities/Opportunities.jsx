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
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  ChevronDown,
  Check,
} from "lucide-react";
import SEO from "../../components/SEO";
import Events from "../events/Events";
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: "created_at_desc", label: "Más recientes" },
  { value: "deadline_asc", label: "Próximas a cerrar" },
  { value: "title_asc", label: "Título (A - Z)" },
];

const Opportunities = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = useMemo(() => {
    return searchParams.get("tab") === "events" ? "events" : "opportunities";
  }, [searchParams]);

  const setActiveTab = useCallback(
    (tab) => {
      setSearchParams((prev) => {
        if (tab === "events") {
          prev.set("tab", "events");
        } else {
          prev.delete("tab");
        }
        return prev;
      });
    },
    [setSearchParams],
  );

  const [localSearch, setLocalSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 180);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // console.log("Desde Oportunities: ", globalFilters);

  const currentPage = pagination.page || 1;

  const [localFilters, setLocalFilters] = useState({
    category_id: globalFilters.category_id || "",
    modality: globalFilters.modality || "",
    location: globalFilters.location || "",
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
    [globalFilters.search],
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
    updateFilters({ search: localSearch.trim() });
    updatePagination({ page: 1 });
  }, [localSearch, updateFilters, updatePagination]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch("");
    updateFilters({ search: "" });
    updatePagination({ page: 1 });
  }, [updateFilters, updatePagination]);

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

  const handleSortChange = useCallback(
    (sortValue) => {
      const nextFilters = { ...localFilters, sort: sortValue };
      setLocalFilters(nextFilters);
      handleFilterChange(nextFilters);
    },
    [localFilters, handleFilterChange],
  );

  const handlePageChange = useCallback(
    (page) => {
      updatePagination({ page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updatePagination],
  );

  const handleClearFilters = useCallback(() => {
    setLocalSearch("");
    setLocalFilters({
      category_id: "",
      modality: "",
      location: "",
      show_expired: false,
      sort: "created_at_desc",
    });
    clearFilters();
    updatePagination({
      page: 1,
      sortBy: "created_at",
      sortOrder: "desc",
    });
  }, [clearFilters, updatePagination]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Mostrar error state
  if (error && activeTab === "opportunities") {
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
                  <button type="button"
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
        title={
          activeTab === "opportunities"
            ? "Edutracker: oportunidades en un solo lugar"
            : "Iniciativas internas de Edu-us: eventos y talleres"
        }
        description="Explora becas, talleres y experiencias únicas para tu futuro."
      />

      {/* Header Sticky Flotante - Bottom Floating Dock en Móviles */}
      <AnimatePresence>
        {isHeaderSticky && (
          <m.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none lg:hidden"
          >
            <div className="max-w-7xl w-full flex justify-center">
              <div className="p-1 bg-secondary/20 backdrop-blur-xl border border-secondary/25 rounded-full flex gap-1.5 shadow-2xl w-auto pointer-events-auto transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setActiveTab("opportunities")}
                  className={`rounded-full font-bold transition-all duration-300 flex-1 text-center py-2 px-2 text-xs sm:text-[13px] whitespace-nowrap ${
                    activeTab === "opportunities"
                      ? "bg-primary text-light shadow-sm"
                      : "text-dark/60 dark:text-light/60 hover:text-primary dark:hover:text-primary"
                  }`}
                >
                  Oportunidades
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("events")}
                  className={`rounded-full font-bold transition-all duration-300 flex-1 text-center py-2 px-2 text-xs sm:text-[13px] whitespace-nowrap ${
                    activeTab === "events"
                      ? "bg-primary text-light shadow-sm"
                      : "text-dark/60 dark:text-light/60 hover:text-primary dark:hover:text-primary"
                  }`}
                >
                  Eventos de EDU-US
                </button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-secondary/10 pb-16">
        <section className="max-w-7xl mx-auto px-4 pt-4 pb-8 w-full">
          {/* Encabezado Principal Estático */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-2 pb-4 border-b border-dark/10 gap-4 mb-4">
            <div className="max-w-2xl text-center lg:text-left min-h-[36px] lg:min-h-[48px] flex items-center justify-center lg:justify-start overflow-hidden">
              <AnimatePresence mode="wait">
                <m.h1
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    type: "spring",
                    duration: 0.38,
                    bounce: 0.08,
                  }}
                  className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-secondary to-teal-600 text-transparent bg-clip-text leading-tight font-heading"
                >
                  {activeTab === "opportunities"
                    ? "Explora oportunidades nacionales e internacionales"
                    : "Participa en nuestros próximos eventos y talleres"}
                </m.h1>
              </AnimatePresence>
            </div>

            {/* Selector de Pestañas (Tab Switcher) */}
            <div className="flex justify-center lg:justify-end flex-shrink-0">
              <div className="p-1 bg-secondary-light border border-secondary/20 rounded-full flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("opportunities")}
                  className={`rounded-full font-bold transition-all duration-300 px-5 py-2 text-xs sm:text-sm ${
                    activeTab === "opportunities"
                      ? "bg-primary text-light"
                      : "text-dark/60 hover:text-primary"
                  }`}
                >
                  Oportunidades
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("events")}
                  className={`rounded-full font-bold transition-all duration-300 px-5 py-2 text-xs sm:text-sm ${
                    activeTab === "events"
                      ? "bg-primary text-light"
                      : "text-dark/60 hover:text-primary"
                  }`}
                >
                  Eventos de EDU-US
                </button>
              </div>
            </div>
          </div>

          {activeTab === "opportunities" ? (
            <>
              {/* Sección de dos columnas: Filtros y Oportunidades */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar acordeón - Desktop */}
                <section className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-24 transition-all duration-300">
                  {/* Selector de Pestañas Flotante - Desktop */}
                  <AnimatePresence>
                    {isHeaderSticky && (
                      <m.div
                        initial={{
                          opacity: 0,
                          y: -10,
                          height: 0,
                          marginBottom: 0,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          height: "auto",
                          marginBottom: 16,
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                          height: 0,
                          marginBottom: 0,
                        }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden flex justify-center w-full"
                      >
                        <div className="p-1 bg-secondary-light border border-secondary/20 rounded-full flex gap-1.5 shadow-sm w-full pointer-events-auto transition-all duration-300">
                          <button
                            type="button"
                            onClick={() => setActiveTab("opportunities")}
                            className={`rounded-full font-bold transition-all duration-300 flex-1 text-center py-2 px-1 text-[11px] sm:text-xs whitespace-nowrap ${
                              activeTab === "opportunities"
                                ? "bg-primary text-light shadow-sm"
                                : "text-dark/60 hover:text-primary"
                            }`}
                          >
                            Oportunidades
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("events")}
                            className={`rounded-full font-bold transition-all duration-300 flex-1 text-center py-2 px-1 text-[11px] sm:text-xs whitespace-nowrap ${
                              activeTab === "events"
                                ? "bg-primary text-light shadow-sm"
                                : "text-dark/60 hover:text-primary"
                            }`}
                          >
                            Eventos de EDU-US
                          </button>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>

                  <div className="bg-white px-5 py-5 rounded-2xl shadow-sm border border-gray-100">
                    <FiltersComponent
                      onFilterChange={handleFilterChange}
                      filterOptions={filterOptions}
                      clearFilters={clearFilters}
                      localFilters={localFilters}
                      setLocalFilters={setLocalFilters}
                      hideSort={true}
                    />
                  </div>
                </section>

                {/* Contenido Principal */}
                <div className="flex-1 w-full">
                  {/* Barra de búsqueda con contador e icono de filtros en móvil */}
                  <div className="relative mb-6 w-full">
                    <div className="flex items-center gap-3">
                      {/* Buscador */}
                      <div className="flex-1">
                        <SearchHeader
                          searchTerm={localSearch}
                          onSearchChange={handleSearchChange}
                          onSearchSubmit={handleSearchSubmit}
                          onClearSearch={handleClearSearch}
                          loading={loading}
                        />
                      </div>

                      {/* Ordenamiento - Solo Desktop */}
                      {localFilters.show_expired !== "only_expired" && (
                        <div className="hidden lg:block relative flex-shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setShowSortDropdown(!showSortDropdown)
                            }
                            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 hover:text-primary hover:border-primary/45 rounded-2xl shadow-sm active:scale-95 transition-all duration-200 text-sm font-bold"
                          >
                            <ArrowUpDown className="h-4 w-4 text-slate-500" />
                            <span>
                              Ordenar:{" "}
                              {
                                SORT_OPTIONS.find(
                                  (o) =>
                                    o.value ===
                                    (localFilters.sort || "created_at_desc"),
                                )?.label
                              }
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                showSortDropdown ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {showSortDropdown && (
                              <>
                                {/* Overlay invisible para cerrar al hacer click fuera */}
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setShowSortDropdown(false)}
                                />
                                <m.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{
                                    duration: 0.15,
                                    ease: "easeOut",
                                  }}
                                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-lg py-1.5 z-20 overflow-hidden"
                                >
                                  {SORT_OPTIONS.map((option) => {
                                    const isSelected =
                                      (localFilters.sort ||
                                        "created_at_desc") === option.value;
                                    return (
                                      <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                          handleSortChange(option.value);
                                          setShowSortDropdown(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left font-bold transition-colors duration-150 ${
                                          isSelected
                                            ? "bg-primary/5 text-primary"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                        }`}
                                      >
                                        <span>{option.label}</span>
                                        {isSelected && (
                                          <Check className="h-4 w-4 text-primary" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </m.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Botón icono de filtros en móvil */}
                      <div className="lg:hidden flex-shrink-0">
                        <button
                          type="button"
                          className="p-3.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 hover:text-primary hover:border-primary/45 rounded-2xl shadow-sm active:scale-95 transition-all duration-150"
                          onClick={() => setShowMobileFilters(true)}
                          aria-label="Filtros"
                        >
                          <SlidersHorizontal className="h-5 w-5" />
                        </button>
                      </div>

                      {isSearching && (
                        <div className="hidden md:block flex-shrink-0">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 inline-flex items-center">
                            <span className="text-secondary text-sm font-medium">
                              {totalCount} resultado
                              {totalCount !== 1 ? "s" : ""}
                              {globalFilters.search &&
                                ` para "${globalFilters.search}"`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contador en móvil (debajo de barra si busca) */}
                    {isSearching && (
                      <div className="md:hidden mt-2">
                        <span className="text-xs text-secondary font-medium px-1">
                          {totalCount} resultado{totalCount !== 1 ? "s" : ""}
                          {globalFilters.search &&
                            ` para "${globalFilters.search}"`}
                        </span>
                      </div>
                    )}
                  </div>

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
                          transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 220,
                          }}
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

                  {/* Contenido Principal de Oportunidades */}
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
              </div>
            </>
          ) : (
            <Events onExplore={() => setActiveTab("opportunities")} />
          )}
        </section>
      </div>
    </>
  );
};

export default Opportunities;
