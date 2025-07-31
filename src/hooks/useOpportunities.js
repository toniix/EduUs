import { useState, useEffect, useCallback, useMemo } from "react";
import { opportunitiesService } from "../services/fetchOpportunityService";

/**
 * Hook para obtener lista de oportunidades
 * @param {Object} filters - Filtros para aplicar
 * @param {Object} pagination - Parámetros de paginación
 * @returns {Object} Estado con oportunidades, loading, error, etc.
 */
export function useOpportunities(filters = {}, pagination = {}) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    modalities: [],
    countries: [],
    organizations: [],
  });

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
  }, [memoizedFilters, memoizedPagination]); // Dependencias memoizadas

  // Función para cargar opciones de filtro (solo una vez)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await opportunitiesService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  }, []); // Sin dependencias, solo se ejecuta una vez

  // Cargar oportunidades cuando cambian los filtros o paginación
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Cargar opciones de filtro solo al montar
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const refetch = useCallback(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return {
    opportunities,
    loading,
    error,
    totalCount,
    totalPages,
    filterOptions,
    refetch,
  };
}

/**
 * Hook para obtener una oportunidad específica
 * @param {string} id - ID de la oportunidad
 * @returns {Object} Estado con oportunidad, loading, error
 */
export function useOpportunity(id) {
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOpportunity = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await opportunitiesService.getOpportunityById(id);
      setOpportunity(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching opportunity:", err);
      setError(err.message || "Error al cargar la oportunidad");
      setOpportunity(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOpportunity();
  }, [fetchOpportunity]);

  const refetch = useCallback(() => {
    fetchOpportunity();
  }, [fetchOpportunity]);

  return {
    opportunity,
    loading,
    error,
    refetch,
  };
}

export function useAllOpportunities() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await opportunitiesService.getAllOpportunities();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return { opportunities: data || [], loading, error };
}

export function useInactiveOpportunities(pagination = {}) {
  const [data, setData] = useState({ data: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInactiveOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await opportunitiesService.getInactiveOpportunities(
        pagination
      );
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    fetchInactiveOpportunities();
  }, [fetchInactiveOpportunities]);

  const refetch = useCallback(() => {
    return fetchInactiveOpportunities();
  }, [fetchInactiveOpportunities]);

  return {
    opportunities: data.data || [],
    totalCount: data.count || 0,
    totalPages: data.totalPages || 1,
    currentPage: data.currentPage || 1,
    loading,
    error,
    refetch,
  };
}
