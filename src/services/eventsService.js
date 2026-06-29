import { supabase } from "../lib/supabase";
import { createSlug } from "../utils/slugify";
import { MOCK_EVENTS } from "../data/mockEvents";

/**
 * SELECT base para eventos — incluye conteo de inscritos para calcular spots_left.
 * La columna spots_left YA NO existe en la tabla; se computa aquí.
 */
const EVENT_SELECT = `
  *,
  registrations:event_registrations(count)
`;

/** Transforma el row de Supabase al shape que usan los componentes */
function transformEvent(row) {
  if (!row) return null;

  const registrationCount = row.registrations?.[0]?.count ?? 0;
  const spotsLeft =
    row.capacity !== null
      ? Math.max(0, row.capacity - registrationCount)
      : null;

  return {
    ...row,
    spots_left: spotsLeft,
    registrations: undefined, // limpiar el campo intermedio
  };
}

class EventsService {
  /**
   * Eventos públicos: solo los publicados, ordenados por fecha de inicio.
   */
  async getEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(EVENT_SELECT)
        .eq("status", "published")
        .order("starts_at", { ascending: true });

      if (error) throw error;

      // Si la base de datos no tiene eventos cargados, usamos los mocks para fines de UI/demo.
      // if (!data || data.length === 0) {
      //   return MOCK_EVENTS;
      // }

      return (data || []).map(transformEvent);
    } catch (err) {
      console.warn(
        "Error con Supabase en getEvents, usando mocks locales:",
        err,
      );
      // return MOCK_EVENTS;
    }
  }

  /**
   * Todos los eventos para el panel admin (incluye borradores).
   */
  async getAllEvents() {
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .order("starts_at", { ascending: true });

    if (error) throw new Error(`Error al obtener eventos: ${error.message}`);
    return (data || []).map(transformEvent);
  }

  /**
   * Evento marcado como modal promocional.
   * Falla silenciosamente (retorna null) si no hay o si hay error.
   */
  async getPromoEvent() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(EVENT_SELECT)
        .eq("promo_modal", true)
        .eq("status", "published")
        .order("starts_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) return null;
      return data ? transformEvent(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Evento destacado para el home.
   * Usa el mismo evento que el promo_modal (el evento del mes).
   */
  async getFeaturedEvent() {
    return this.getPromoEvent();
  }

  /**
   * Obtiene un evento por ID.
   */
  async getEventById(id) {
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Error al obtener evento: ${error.message}`);
    return data ? transformEvent(data) : null;
  }

  /**
   * Obtiene un evento por SLUG.
   */
  async getEventBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(EVENT_SELECT)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return transformEvent(data);
      }

      // Fallback a los mocks si no se encuentra en Supabase
      const mockEvent = MOCK_EVENTS.find((e) => e.slug === slug);
      return mockEvent || null;
    } catch (err) {
      console.warn(
        `Error al obtener evento por slug (${slug}), buscando en mocks locales:`,
        err,
      );
      const mockEvent = MOCK_EVENTS.find((e) => e.slug === slug);
      return mockEvent || null;
    }
  }

  // ─────────────────────────────────────────────
  // CRUD ADMIN
  // ─────────────────────────────────────────────

  /**
   * Crea un nuevo evento.
   * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
   */
  async createEvent(formData) {
    try {
      const payload = this._buildPayload(formData);

      const { data, error } = await supabase
        .from("events")
        .insert([payload])
        .select(EVENT_SELECT)
        .single();

      if (error) throw new Error(error.message);
      return { success: true, data: transformEvent(data), error: null };
    } catch (err) {
      return { success: false, data: null, error: err.message };
    }
  }

  /**
   * Actualiza un evento existente.
   * - Si recibe un formData completo (tiene 'title') → lo pasa por _buildPayload para limpiar tipos.
   * - Si recibe un patch parcial (ej: { promo_modal: true }) → lo envía directo sin tocar otros campos.
   * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
   */
  async updateEvent(id, formData) {
    // console.log(formData);
    try {
      // Validar que el evento esté publicado antes de marcarlo como promo
      if (formData.promo_modal === true) {
        const { data: current, error: fetchError } = await supabase
          .from("events")
          .select("status")
          .eq("id", id)
          .single();

        if (fetchError) throw new Error(fetchError.message);

        if (current.status !== "published") {
          return {
            success: false,
            data: null,
            error:
              "El evento debe estar publicado para marcarlo como destacado.",
          };
        }

        // Desmarcar cualquier otro evento promo
        await supabase
          .from("events")
          .update({ promo_modal: false })
          .neq("id", id)
          .eq("promo_modal", true);
      }

      // Update completo (viene del EventForm) → sanitizar con _buildPayload
      // Patch parcial (ej: toggle publish, marcar promo) → enviar tal cual
      const payload =
        "title" in formData ? this._buildPayload(formData) : formData;

      const { data, error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", id)
        .select(EVENT_SELECT)
        .single();

      if (error) throw new Error(error.message);
      return { success: true, data: transformEvent(data), error: null };
    } catch (err) {
      return { success: false, data: null, error: err.message };
    }
  }

  /**
   * Elimina un evento.
   * Verifica que no tenga inscripciones activas primero.
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async deleteEvent(id) {
    try {
      // Verificar si tiene inscritos activos
      const { count } = await supabase
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", id)
        .eq("status", "registered");

      if (count > 0) {
        return {
          success: false,
          error: `No se puede eliminar: hay ${count} inscripción(es) activa(s).`,
        };
      }

      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw new Error(error.message);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // ─────────────────────────────────────────────
  // INSCRIPCIONES
  // ─────────────────────────────────────────────

  /**
   * Registra a un usuario en un evento.
   * Verifica cupos disponibles antes de insertar.
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async registerForEvent(
    eventId,
    { name, email, career, university, dni, phone, is_udep },
  ) {
    // console.log(eventId, name, email, career, university, dni, phone, is_udep);
    try {
      // Verificar si ya existe una inscripción con este correo
      const { data: existing } = await supabase
        .from("event_registrations")
        .select("id, status")
        .eq("event_id", eventId)
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        if (existing.status === "registered") {
          return {
            success: false,
            error: "Este correo ya está inscrito en el evento.",
          };
        }
        // Si fue cancelado, se puede re-inscribir actualizando
        const { error } = await supabase
          .from("event_registrations")
          .update({
            status: "registered",
            name,
            career,
            university,
            dni,
            phone,
            is_udep,
          })
          .eq("id", existing.id);

        if (error) throw new Error(error.message);
        return { success: true, error: null };
      }

      // Verificar cupos (si el evento tiene límite)
      const event = await this.getEventById(eventId);
      if (event && event.spots_left !== null && event.spots_left <= 0) {
        return {
          success: false,
          error: "El evento ya no tiene cupos disponibles.",
        };
      }

      // Obtener usuario autenticado (opcional)
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;

      const { error } = await supabase.from("event_registrations").insert([
        {
          event_id: eventId,
          user_id: userId,
          name,
          email,
          career,
          university,
          dni,
          phone,
          is_udep,
        },
      ]);

      if (error) throw new Error(error.message);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Obtiene todos los inscritos de un evento.
   * @returns {Promise<Array>}
   */
  async getRegistrations(eventId) {
    const { data, error } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId)
      .order("registered_at", { ascending: false });

    if (error) throw new Error(`Error al obtener inscritos: ${error.message}`);
    return data || [];
  }

  /**
   * Cambia el estado de una inscripción (registered / attended / cancelled).
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async updateRegistrationStatus(registrationId, status) {
    try {
      const { error } = await supabase
        .from("event_registrations")
        .update({ status })
        .eq("id", registrationId);

      if (error) throw new Error(error.message);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Obtiene TODAS las inscripciones de todos los eventos, con datos del evento.
   * @returns {Promise<Array>}
   */
  async getAllRegistrations() {
    const { data, error } = await supabase
      .from("event_registrations")
      .select(
        `
        *,
        event:events(id, title, slug, starts_at, category)
      `,
      )
      .order("registered_at", { ascending: false });

    if (error)
      throw new Error(`Error al obtener inscripciones: ${error.message}`);
    return data || [];
  }

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  /** Construye el payload limpio a partir del formData del formulario */
  _buildPayload(formData) {
    const {
      title,
      slug,
      category,
      modality,
      description,
      location,
      banner_url,
      starts_at,
      ends_at,
      capacity,
      price,
      promo_modal,
      registration_url,
      status,
    } = formData;

    return {
      title: title?.trim(),
      slug: slug?.trim() || this._generateSlug(title),
      category,
      modality,
      description: description?.trim() || null,
      location: location?.trim() || null,
      banner_url: banner_url?.trim() || null,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
      capacity: capacity !== "" && capacity !== null ? Number(capacity) : null,
      price: price !== "" && price !== null ? Number(price) : 0,
      promo_modal: promo_modal ?? false,
      registration_url: registration_url?.trim() || null,
      status: status || "draft",
    };
  }

  /** Genera slug básico desde un título */
  _generateSlug(title = "") {
    return createSlug(title);
  }
}

export const eventsService = new EventsService();
