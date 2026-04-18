import { useState, useEffect, useCallback, useContext } from "react";
import { opportunitiesService } from "../services/fetchOpportunityService";
import { OpportunitiesContext } from "../contexts/OpportunityContext";

/**
 * Hook para obtener lista de oportunidades
 * @param {Object} filters - Filtros para aplicar
 * @param {Object} pagination - Parámetros de paginación
 * @returns {Object} Estado con oportunidades, loading, error, etc.
 */

// Hook para usar el contexto
export const useOpportunities = () => {
  const context = useContext(OpportunitiesContext);
  // console.log(context);
  if (!context) {
    throw new Error(
      "useOpportunities debe ser usado dentro de OpportunitiesProvider",
    );
  }
  return context;
};

export function useOpportunity(identifier) {
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOpportunity = useCallback(async () => {
    if (!identifier) return;

    try {
      setLoading(true);
      const data = await opportunitiesService.getOpportunity(identifier);
      setOpportunity(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching opportunity:", err);
      setError(err.message || "Error al cargar la oportunidad");
      setOpportunity(null);
    } finally {
      setLoading(false);
    }
  }, [identifier]);

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
      const result =
        await opportunitiesService.getInactiveOpportunities(pagination);
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
