import { supabase } from "../lib/supabase";

class CategoryService {
  /**
   * Obtiene todas las categorías disponibles
   * @returns {Promise<Array>} Lista de categorías
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
