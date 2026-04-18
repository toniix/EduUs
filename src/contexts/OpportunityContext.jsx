import {
  createContext,
  useState,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { opportunitiesService } from "../services/fetchOpportunityService";

// Crear el contexto
export const OpportunitiesContext = createContext();

const initialState = {
  opportunities: [],
  loading: true,
  error: null,
  totalCount: 0,
  totalPages: 0,
  filterOptions: { types: [], modalities: [], locations: [] },
};

function opportunitiesReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        opportunities: action.payload.data,
        totalCount: action.payload.total,
        totalPages: action.payload.totalPages,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_FILTER_OPTIONS":
      return { ...state, filterOptions: action.payload };
    default:
      return state;
  }
}

// Provider del contexto
export const OpportunitiesProvider = ({ children }) => {
  // console.log("montando opportunities provider");
  const [state, dispatch] = useReducer(opportunitiesReducer, initialState);
  const {
    opportunities,
    loading,
    error,
    totalCount,
    totalPages,
    filterOptions,
  } = state;

  // Filtros y paginación controlados por el contexto
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({});

  // Función para cargar oportunidades
  const fetchOpportunities = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_START" });
      const result = await opportunitiesService.getOpportunitiesWithFilters(
        filters,
        pagination,
      );
      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          data: result.data,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  }, [filters, pagination]);

  // Función para cargar opciones de filtro (solo una vez)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await opportunitiesService.getFilterOptions();
      dispatch({ type: "SET_FILTER_OPTIONS", payload: options });
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  }, []);

  // Función para actualizar filtros
  const updateFilters = useCallback((newFilters) => {
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
