import { supabase } from "../lib/supabase";

class OpportunitiesService {
  /**
   * Aplica filtros a las oportunidades
   * @param {Object} filters - Objeto con los filtros a aplicar
   * @param {Object} pagination - Configuración de paginación
   * @returns {Promise<Object>} Objeto con las oportunidades y metadatos de paginación
   */
  async getOpportunitiesWithFilters(filters = {}, pagination = {}) {
    const {
      page = 1,
      limit = 6,
      sortBy = "created_at",
      sortOrder = "desc",
    } = pagination;

    const { search, modality, country, organization, category_id } = filters;

    try {
      let query = supabase.from("opportunities").select(
        `*,
        category:categories(id, name),
        creator:profiles!opportunities_created_by_fkey(id, full_name),
        opportunity_tags(tag:tags(id, name))`,
        { count: "exact" }
      );

      const exactFilters = {
        modality,
        country,
        organization,
        category_id,
      };

      Object.entries(exactFilters).forEach(([key, value]) => {
        if (value) {
          query = query.eq(key, value);
        }
      });

      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const transformedData = this.transformOpportunityData(data || []);

      return {
        data: transformedData,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
        limit,
      };
      console.log(data);
    } catch (error) {
      console.error("Error fetching opportunities with filters:", error);
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
        .select(
          `*,
        category:categories(id, name),
        creator:profiles!opportunities_created_by_fkey(id, full_name),
        opportunity_tags(tag:tags(id, name))`
        )
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
   * Obtiene las opciones de filtro disponibles
   * @returns {Promise<Object>} Objeto con arrays de opciones para cada filtro
   */
  async getFilterOptions() {
    try {
      // Obtener tipos únicos
      const { data: types } = await supabase
        .from("opportunities")
        .select("type")
        .not("type", "is", null)
        .order("type", { ascending: true });

      // Obtener modalidades únicas
      const { data: modalities } = await supabase
        .from("opportunities")
        .select("modality")
        .not("modality", "is", null)
        .order("modality", { ascending: true });

      // Obtener países únicos
      const { data: countries } = await supabase
        .from("opportunities")
        .select("country")
        .not("country", "is", null)
        .order("country", { ascending: true });

      // Obtener organizaciones únicas
      const { data: organizations } = await supabase
        .from("opportunities")
        .select("organization")
        .not("organization", "is", null)
        .order("organization", { ascending: true });

      return {
        types: [...new Set(types.map((item) => item.type))],
        modalities: [...new Set(modalities.map((item) => item.modality))],
        countries: [...new Set(countries.map((item) => item.country))],
        organizations: [
          ...new Set(organizations.map((item) => item.organization)),
        ],
      };
    } catch (error) {
      console.error("Error fetching filter options:", error);
      throw error;
    }
  }

  /**
   * Transforma los datos de las oportunidades para aplanar las relaciones many-to-many
   * @param {Array} opportunities - Lista de oportunidades con relaciones anidadas
   * @returns {Array} Datos transformados
   */
  transformOpportunityData(opportunities) {
    return opportunities.map((opportunity) => {
      // Extraer tags de la relación many-to-many
      const tags = (opportunity.opportunity_tags || [])
        .map((ot) => ot.tag)
        .filter(Boolean);

      return {
        ...opportunity,
        tags, // Añadir tags como array plano
        // Eliminar la relación original que ya no necesitamos
        opportunity_tags: undefined,
      };
    });
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
