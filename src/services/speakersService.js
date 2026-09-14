import { supabase } from "../lib/supabase";

class SpeakersService {
  /**
   * Obtiene todos los ponentes de la base de datos
   * @returns {Promise<{success: boolean, data: Array|null, error: string|null}>}
   */
  async getSpeakers() {
    try {
      const { data, error } = await supabase
        .from("speakers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [], error: null };
    } catch (err) {
      console.error("Error fetching speakers:", err);
      return { success: false, data: null, error: err.message };
    }
  }

  /**
   * Crea un nuevo ponente
   * @param {object} speakerData
   * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
   */
  async createSpeaker(speakerData) {
    try {
      const { data, error } = await supabase
        .from("speakers")
        .insert([speakerData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.error("Error creating speaker:", err);
      return { success: false, data: null, error: err.message };
    }
  }

  /**
   * Actualiza un ponente existente (permitido para administradores y editores)
   * @param {string} id
   * @param {object} speakerData
   * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
   */
  async updateSpeaker(id, speakerData) {
    try {
      const { data, error } = await supabase
        .from("speakers")
        .update(speakerData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.error("Error updating speaker:", err);
      return { success: false, data: null, error: err.message };
    }
  }

  /**
   * Elimina un ponente de la base de datos.
   * Regla de negocio: Solo los administradores pueden eliminar ponentes (los editores no).
   * @param {string} speakerId
   * @param {string|null} userRole
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async deleteSpeaker(speakerId, userRole = null) {
    if (userRole && userRole !== "admin") {
      return {
        success: false,
        error:
          "Solo los administradores tienen permiso para eliminar ponentes.",
      };
    }
    try {
      const { error } = await supabase
        .from("speakers")
        .delete()
        .eq("id", speakerId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      console.error("Error deleting speaker:", err);
      return { success: false, error: err.message };
    }
  }
}

export const speakersService = new SpeakersService();
