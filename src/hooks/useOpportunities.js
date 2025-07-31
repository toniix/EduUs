import { useState, useEffect } from "react";
import { opportunitiesService } from "../services/fetchOpportunityService";

/**
 * Hook para obtener lista de oportunidades
 * @param {Object} filters - Filtros para aplicar
 * @param {Object} pagination - Parámetros de paginación
 * @returns {Object} Estado con oportunidades, loading, error, etc.
 */
export function useOpportunities(filters = {}, pagination = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await opportunitiesService.getOpportunities(
        filters,
        pagination
      );
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [JSON.stringify(filters), JSON.stringify(pagination)]);

  return {
    opportunities: data?.data || [],
    totalCount: data?.count || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    loading,
    error,
    refetch: fetchOpportunities,
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

  useEffect(() => {
    if (!id) return;

    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await opportunitiesService.getOpportunityById(id);
        setOpportunity(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  return { opportunity, loading, error };
}
