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

    // console.log("filters", filters);
    // console.log("pagination", pagination);

    const {
      modality,
      country,
      location,
      category_id,
      show_expired = false,
      search,
    } = filters;

    try {
      let query = supabase.from("opportunities").select(
        `*,
        category:categories(id, name, color),
        creator:profiles!opportunities_created_by_fkey(id, full_name),
        opportunity_tags(tag:tags(id, name))`,
        { count: "exact" },
      );

      // Filtros de igualdad exactos
      if (modality) query = query.eq("modality", modality);
      if (country) query = query.eq("country", country);
      if (location) query = query.eq("location", location);
      if (category_id) query = query.eq("category_id", category_id);
      if (filters.created_by)
        query = query.eq("created_by", filters.created_by);

      // Filtro administrativo (visibilidad)
      if (filters.is_published !== undefined) {
        query = query.eq("is_published", filters.is_published);
      } else {
        query = query.eq("is_published", true);
      }

      // Filtro de convocatorias activas (no vencidas)
      const today = new Date().toISOString().split("T")[0];
      if (show_expired === "only_expired") {
        query = query.lt("deadline", today).not("deadline", "is", null);
      } else if (!show_expired) {
        // Por defecto: mostrar solo activas (deadline >= hoy o deadline es null)
        query = query.or(`deadline.gte.${today},deadline.is.null`);
      }

      // Búsqueda por texto (título, descripción, ubicación o país)
      if (search && search.trim() !== "") {
        const term = `%${search.trim()}%`;
        query = query.or(
          `title.ilike.${term},description.ilike.${term},location.ilike.${term},country.ilike.${term}`,
        );
      }

      // Ordenamiento en base de datos
      if (sortBy === "deadline") {
        query = query.order("deadline", {
          ascending: sortOrder === "asc",
          nullsFirst: false,
        });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === "asc" });
      }

      // Paginación
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Ejecutar la consulta
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
    } catch (error) {
      console.error("Error fetching opportunities with filters:", error);
      throw error;
    }
  }

  /**
   * Helper para mantener compatibilidad con llamadas internas que usan getOpportunities
   */
  async getOpportunities(filters = {}, pagination = {}) {
    return this.getOpportunitiesWithFilters(filters, pagination);
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
        opportunity_tags(tag:tags(id, name))`,
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching all opportunities: ${error.message}`);
      }

      // Transformar los datos para aplanar las relaciones many-to-many
      const transformedData = this.transformOpportunityData(data || []);
      return this.sortByDeadline(transformedData);
    } catch (error) {
      console.error("Error in getAllOpportunities:", error);
      throw error;
    }
  }

  /**
   * Obtiene una oportunidad específica por ID o por Slug
   * @param {string} identifier - ID o Slug de la oportunidad
   * @returns {Promise<Object|null>} Oportunidad o null si no se encuentra
   */
  async getOpportunity(identifier) {
    try {
      // Intentamos buscar por ID primero si parece un UUID, o buscamos por slug
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          identifier,
        );

      let query = supabase.from("opportunities").select(
        `
          *,
          category:categories(id, name),
          creator:profiles!opportunities_created_by_fkey(id, full_name),
          opportunity_tags(tag:tags(id, name))
        `,
      );

      if (isUUID) {
        query = query.or(`id.eq.${identifier},slug.eq.${identifier}`);
      } else {
        query = query.eq("slug", identifier);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`Error fetching opportunity: ${error.message}`);
      }

      return this.transformSingleOpportunity(data);
    } catch (error) {
      console.error("Error in getOpportunity:", error);
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
      pagination,
    );
  }

  /**
   * Obtiene estadísticas de oportunidades
   * @returns {Promise<Object>} Estadísticas generales
   */
  async getOpportunityStats() {
    const today = new Date().toISOString().split("T")[0];
    try {
      const [totalResult, activeResult, categoriesResult] = await Promise.all([
        supabase
          .from("opportunities")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("opportunities")
          .select("id", { count: "exact", head: true })
          .or(`deadline.gte.${today},deadline.is.null`),
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
    return this.getOpportunities({ show_expired: "only_expired" }, pagination);
  }

  /**
   * Obtiene oportunidades recientes
   * @param {number} limit - Número de oportunidades a obtener
   * @returns {Promise<Array>} Lista de oportunidades recientes
   */
  async getRecentOpportunities(limit = 5) {
    const today = new Date().toISOString().split("T")[0];
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
        `,
        )
        .or(`deadline.gte.${today},deadline.is.null`)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(
          `Error fetching recent opportunities: ${error.message}`,
        );
      }

      const transformedData = this.transformOpportunityData(data || []);
      return this.sortByDeadline(transformedData);
    } catch (error) {
      console.error("Error in getRecentOpportunities:", error);
      throw error;
    }
  }

  /**
   * Obtiene oportunidades destacadas ordenadas por featured_order
   * @param {number} limit - Número máximo de oportunidades a obtener (default 4)
   * @returns {Promise<Array>} Lista de oportunidades destacadas ordenadas
   */
  async getFeaturedOpportunities(limit = 4) {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(
          `
          *,
          category:categories(
            id,
            name,
            color
          )
        `,
        )
        .eq("is_featured", true)
        // .eq("status", "active")
        .order("featured_order", { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error(
          `Error fetching featured opportunities: ${error.message}`,
        );
      }

      const transformedData = this.transformOpportunityData(data || []);
      return transformedData;
    } catch (error) {
      console.error("Error in getFeaturedOpportunities:", error);
      throw error;
    }
  }

  /**
   * Obtiene las opciones de filtro disponibles
   * @returns {Promise<Object>} Objeto con arrays de opciones para cada filtro
   */
  async getFilterOptions() {
    try {
      // Obtener categorías únicas
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      // Obtener modalidades únicas
      const { data: modalities } = await supabase
        .from("opportunities")
        .select("modality")
        .not("modality", "is", null)
        .order("modality", { ascending: true });

      // Obtener ubicaciones únicas
      const { data: locations } = await supabase
        .from("opportunities")
        .select("location")
        .not("location", "is", null)
        .order("location", { ascending: true });

      // Obtener países únicos
      const { data: countries } = await supabase
        .from("opportunities")
        .select("country")
        .not("country", "is", null)
        .order("country", { ascending: true });

      return {
        modalities: [...new Set(modalities.map((item) => item.modality))],
        categories,
        locations: [...new Set(locations.map((item) => item.location))],
        countries: [...new Set(countries.map((item) => item.country))],
      };
    } catch (error) {
      console.error("Error fetching filter options:", error);
      throw error;
    }
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

  /**
   * Ordena oportunidades por deadline (activas primero, vencidas después)
   * Las activas se ordenan por fecha más cercana primero
   * Las vencidas se ordenan por fecha más reciente primero
   * @param {Array} opportunities - Array de oportunidades a ordenar
   * @returns {Array} Array ordenado
   */
  sortByDeadline(opportunities) {
    const now = new Date();

    const active = [];
    const expired = [];

    // Separar activas de vencidas
    opportunities.forEach((opp) => {
      const deadline = new Date(opp.deadline);
      if (deadline >= now) {
        active.push(opp);
      } else {
        expired.push(opp);
      }
    });

    // Ordenar activas por fecha más cercana (ascending)
    active.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Ordenar vencidas por fecha más reciente (descending)
    expired.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));

    // Combinar: activas primero, vencidas después
    return [...active, ...expired];
  }
}

// Exportar una instancia singleton
export const opportunitiesService = new OpportunitiesService();
