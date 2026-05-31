import { supabase } from "../lib/supabase";

class ProjectsService {
  /**
   * Obtiene todos los proyectos de la base de datos
   * @returns {Promise<Array>} Lista de proyectos
   */
  async getProjects() {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  /**
   * Crea un nuevo proyecto
   * @param {object} projectData - Datos del proyecto a crear
   * @param {string} userRole - Rol del usuario actual
   * @returns {Promise<object>} El proyecto creado
   */
  async createProject(projectData, userRole) {
    if (userRole !== "admin") {
      throw new Error("Solo los administradores pueden crear proyectos.");
    }
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  /**
   * Actualiza un proyecto existente
   * @param {string} id - ID UUID del proyecto
   * @param {object} updates - Datos a actualizar
   * @param {string} userRole - Rol del usuario actual
   * @returns {Promise<object>} El proyecto actualizado
   */
  async updateProject(id, updates, userRole) {
    if (userRole !== "admin") {
      throw new Error("Solo los administradores pueden actualizar proyectos.");
    }
    try {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  /**
   * Elimina un proyecto por su ID
   * @param {string} id - ID del proyecto a eliminar
   * @param {string} userRole - Rol del usuario actual
   * @returns {Promise<void>}
   */
  async deleteProject(id, userRole) {
    if (userRole !== "admin") {
      throw new Error("Solo los administradores pueden eliminar proyectos.");
    }
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }
}

export const projectsService = new ProjectsService();
