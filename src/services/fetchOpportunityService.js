import { supabase } from "../lib/supabase";

class OpportunitiesService {
  /**
   * Obtiene todas las oportunidades con sus relaciones
   * @param {Object} filters - Filtros para aplicar
   * @param {Object} pagination - Parámetros de paginación
   * @returns {Promise<Object>} Respuesta con datos, count, totalPages, currentPage
   */
  async getOpportunities(filters = {}, pagination = { page: 1, limit: 6 }) {
    try {
      const { page, limit } = pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      let query = supabase
        .from("opportunities")
        .select(
          `
          *,
          category:categories(
            id,
            name
          ),
          creator:profiles!opportunities_created_by_fkey(
            id,
            full_name
          ),
          opportunity_tags(
            tag:tags(
              id,
              name
            )
          )
        `,
          { count: "exact" }
        )
        .range(from, to)
        .order("created_at", { ascending: false });

      // Aplicar filtros
      query = this.applyFilters(query, filters);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Error fetching opportunities: ${error.message}`);
      }

      // Transformar los datos para aplanar las relaciones many-to-many
      const transformedData = this.transformOpportunityData(data || []);

      return {
        data: transformedData,
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error in getOpportunities:", error);
      throw error;
    }
  }

  /**
   * Obtiene una oportunidad específica por ID
   * @param {string} id - ID de la oportunidad
   * @returns {Promise<Object|null>} Oportunidad o null si no se encuentra
   */
  /**
   * Obtiene todas las oportunidades sin paginación ni filtros
   * @returns {Promise<Array>} Lista de oportunidades con sus relaciones
   */
  async getAllOpportunities() {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          category:categories(
            id,
            name
          ),
          creator:profiles!opportunities_created_by_fkey(
            id,
            full_name
          ),
          opportunity_tags(
            tag:tags(
              id,
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching all opportunities: ${error.message}`);
      }

      // Transformar los datos para aplanar las relaciones many-to-many
      return this.transformOpportunityData(data || []);
    } catch (error) {
      console.error("Error in getAllOpportunities:", error);
      throw error;
    }
  }

  /**
   * Obtiene una oportunidad específica por ID
   * @param {string} id - ID de la oportunidad
   * @returns {Promise<Object|null>} Oportunidad o null si no se encuentra
   */
  async getOpportunityById(id) {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(
          `
          *,
          category:categories(
            id,
            name
          ),
          creator:profiles!opportunities_created_by_fkey(
            id,
            full_name
          ),
          opportunity_tags(
            tag:tags(
              id,
              name
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // No encontrado
        }
        throw new Error(`Error fetching opportunity: ${error.message}`);
      }

      return this.transformSingleOpportunity(data);
    } catch (error) {
      console.error("Error in getOpportunityById:", error);
      throw error;
    }
  }

  /**
   * Obtiene oportunidades por usuario
   * @param {string} userId - ID del usuario
   * @param {Object} pagination - Parámetros de paginación
   * @returns {Promise<Object>} Respuesta con oportunidades del usuario
   */
  async getOpportunitiesByUser(userId, pagination = {}) {
    return this.getOpportunities({ created_by: userId }, pagination);
  }

  /**
   * Obtiene oportunidades por categoría
   * @param {string} categoryId - ID de la categoría
   * @param {Object} pagination - Parámetros de paginación
   * @returns {Promise<Object>} Respuesta con oportunidades de la categoría
   */
  async getOpportunitiesByCategory(categoryId, pagination = {}) {
    return this.getOpportunities({ category_id: categoryId }, pagination);
  }

  /**
   * Busca oportunidades por texto
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} filters - Filtros adicionales
   * @param {Object} pagination - Parámetros de paginación
   * @returns {Promise<Object>} Respuesta con oportunidades encontradas
   */
  async searchOpportunities(searchTerm, filters = {}, pagination = {}) {
    return this.getOpportunities(
      { ...filters, search: searchTerm },
      pagination
    );
  }

  /**
   * Obtiene estadísticas de oportunidades
   * @returns {Promise<Object>} Estadísticas generales
   */
  async getOpportunityStats() {
    try {
      const [totalResult, activeResult, categoriesResult] = await Promise.all([
        supabase
          .from("opportunities")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("opportunities")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("opportunities")
          .select("category_id")
          .then(({ data }) => {
            const categories = data?.reduce((acc, curr) => {
              acc[curr.category_id] = (acc[curr.category_id] || 0) + 1;
              return acc;
            }, {});
            return { data: categories, error: null };
          }),
      ]);

      if (totalResult.error || activeResult.error || categoriesResult.error) {
        throw new Error("Error fetching opportunity statistics");
      }

      return {
        total: totalResult.count || 0,
        active: activeResult.count || 0,
        byCategory: categoriesResult.data || {},
      };
    } catch (error) {
      console.error("Error in getOpportunityStats:", error);
      throw error;
    }
  }

  /**
   * Obtiene oportunidades recientes
   * @param {number} limit - Número de oportunidades a obtener
   * @returns {Promise<Array>} Lista de oportunidades recientes
   */
  /**
   * Obtiene oportunidades inactivas
   * @param {Object} pagination - Parámetros de paginación
   * @returns {Promise<Object>} Respuesta con datos de oportunidades inactivas
   */
  async getInactiveOpportunities(pagination = {}) {
    return this.getOpportunities({ status: "inactive" }, pagination);
  }

  /**
   * Obtiene oportunidades recientes
   * @param {number} limit - Número de oportunidades a obtener
   * @returns {Promise<Array>} Lista de oportunidades recientes
   */
  async getRecentOpportunities(limit = 5) {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(
          `
          *,
          category:categories(
            id,
            name,
            description
          ),
          creator:profiles!opportunities_created_by_fkey(
            id,
            full_name,
            avatar_url
          ),
          opportunity_tags(
            tag:tags(
              id,
              name,
              color
            )
          )
        `
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(
          `Error fetching recent opportunities: ${error.message}`
        );
      }

      return this.transformOpportunityData(data || []);
    } catch (error) {
      console.error("Error in getRecentOpportunities:", error);
      throw error;
    }
  }

  /**
   * Aplica filtros a la consulta
   * @param {Object} query - Query de Supabase
   * @param {Object} filters - Filtros a aplicar
   * @returns {Object} Query con filtros aplicados
   */
  applyFilters(query, filters) {
    const { category_id, tag_ids, type, status, location, search, created_by } =
      filters;

    if (category_id) {
      query = query.eq("category_id", category_id);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (status) {
      query = query.eq("status", status);
    } else {
      // Por defecto, solo mostrar oportunidades activas
      query = query.eq("status", "active");
    }

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    if (created_by) {
      query = query.eq("created_by", created_by);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (tag_ids && tag_ids.length > 0) {
      // Para filtrar por tags, necesitamos una subconsulta
      query = query.in(
        "id",
        supabase
          .from("opportunity_tags")
          .select("opportunity_id")
          .in("tag_id", tag_ids)
      );
    }

    return query;
  }

  /**
   * Transforma los datos de oportunidades para aplanar las relaciones many-to-many
   * @param {Array} data - Array de oportunidades raw
   * @returns {Array} Array de oportunidades transformadas
   */
  transformOpportunityData(data) {
    return data.map((item) => this.transformSingleOpportunity(item));
  }

  /**
   * Transforma una sola oportunidad
   * @param {Object} item - Oportunidad raw
   * @returns {Object} Oportunidad transformada
   */
  transformSingleOpportunity(item) {
    return {
      ...item,
      tags: item.opportunity_tags?.map((ot) => ot.tag) || [],
      // Removemos la relación intermedia ya que ya tenemos los tags
      opportunity_tags: undefined,
    };
  }
}

// Exportar una instancia singleton
export const opportunitiesService = new OpportunitiesService();

// Ejemplo de uso en un componente
/*
// components/OpportunitiesList.jsx
import React from 'react';
import { useOpportunities } from '../hooks/useOpportunities';

export default function OpportunitiesList() {
  const { opportunities, loading, error, totalCount } = useOpportunities(
    { status: 'active' }, // filtros
    { page: 1, limit: 12 } // paginación
  );

  if (loading) return <div>Cargando oportunidades...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Oportunidades ({totalCount})</h2>
      <div className="opportunities-grid">
        {opportunities.map(opportunity => (
          <div key={opportunity.id} className="opportunity-card">
            <h3>{opportunity.title}</h3>
            <p>{opportunity.description}</p>
            <div>Categoría: {opportunity.category.name}</div>
            <div>Creado por: {opportunity.creator.full_name}</div>
            <div>
              Tags: {opportunity.tags.map(tag => (
                <span key={tag.id} className="tag">{tag.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
*/
