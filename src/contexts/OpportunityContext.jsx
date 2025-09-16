import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { opportunitiesService } from "../services/fetchOpportunityService";

// Crear el contexto
export const OpportunitiesContext = createContext();

// Provider del contexto
export const OpportunitiesProvider = ({ children }) => {
  // Estados del contexto
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    modalities: [],
    locations: [],
  });

  // Estados para filtros y paginación controlados por el contexto
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({});

  // Memoizar las dependencias para evitar recreación en cada render
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const memoizedPagination = useMemo(
    () => pagination,
    [JSON.stringify(pagination)]
  );

  // Función para cargar oportunidades
  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const result = await opportunitiesService.getOpportunitiesWithFilters(
        memoizedFilters,
        memoizedPagination
      );
      setOpportunities(result.data);
      setTotalCount(result.total);
      setTotalPages(result.totalPages);
      setError(null);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters, memoizedPagination]);

  // Función para cargar opciones de filtro (solo una vez)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await opportunitiesService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  }, []);

  // console.log(filters);

  // Función para actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    // console.log("newFilters:", newFilters);
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Función para actualizar paginación
  const updatePagination = useCallback((newPagination) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      ...newPagination,
    }));
  }, []);

  // Función para refetch manual
  const refetch = useCallback(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Cargar oportunidades cuando cambian los filtros o paginación
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Cargar opciones de filtro solo al montar
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // console.log("opportunities:", opportunities);
  // Valor del contexto que se proporcionará a los componentes hijos
  const contextValue = {
    // Estados
    opportunities,
    loading,
    error,
    totalCount,
    totalPages,
    filterOptions,
    filters,
    pagination,

    // Acciones
    updateFilters,
    clearFilters,
    updatePagination,
    refetch,
  };

  return (
    <OpportunitiesContext.Provider value={contextValue}>
      {children}
    </OpportunitiesContext.Provider>
  );
};
