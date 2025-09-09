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
        .select("id, name, description, color") // Ampliamos para obtener todos los datos
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva categoría
   * @param {object} categoryData - Datos de la categoría a crear { name, description, color }
   * @returns {Promise<object>} La categoría creada
   */
  async createCategory(categoryData, userRole) {
    if (userRole !== "admin") {
      throw new Error("Solo los administradores pueden crear categorías.");
    }
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([categoryData])
        .select()
        .single(); // .single() para devolver el objeto creado

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  /**
   * Elimina una categoría por su ID
   * @param {number} categoryId - ID de la categoría a eliminar
   * @returns {Promise<void>}
   */
  async deleteCategory(categoryId, userRole) {
    if (userRole !== "admin") {
      // console.error("No tienes permiso para eliminar categorías.");
      throw new Error("Solo los administradores pueden eliminar categorías.");
    }
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  /**
   * Actualiza una categoría existente
   * @param {number} categoryId - ID de la categoría a actualizar
   * @param {object} updates - Datos a actualizar { name, description, color }
   * @returns {Promise<object>} La categoría actualizada
   */
  async updateCategory(categoryId, updates, userRole) {
    if (userRole !== "admin") {
      throw new Error("Solo los administradores pueden actualizar categorías.");
    }
    try {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", categoryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
