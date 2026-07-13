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
}

export const speakersService = new SpeakersService();
