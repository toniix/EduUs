import { supabase } from "../lib/supabase";
import { createSlug } from "../utils/slugify";
import { MOCK_EVENTS } from "../data/mockEvents";

/**
 * SELECT base para eventos — incluye conteo de inscritos para calcular spots_left.
 * La columna spots_left YA NO existe en la tabla; se computa aquí.
 */
const EVENT_SELECT = `
  *,
  speaker:speakers(*),
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

      // Validar inconsistencias lógicas
      const validationError = this._validateEvent(payload);
      if (validationError) {
        return { success: false, data: null, error: validationError };
      }

      // Si el nuevo evento se crea y se marca como promo_modal = true, desmarcar otros
      if (payload.promo_modal === true) {
        await supabase
          .from("events")
          .update({ promo_modal: false })
          .eq("promo_modal", true);
      }

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
    try {
      // 1. Obtener los valores actuales del evento para validación cruzada y combinación de parches
      const { data: current, error: fetchError } = await supabase
        .from("events")
        .select("status, starts_at, ends_at, capacity, price, promo_modal")
        .eq("id", id)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      // 2. Construir el payload del cambio
      const patch =
        "title" in formData ? this._buildPayload(formData) : formData;

      // 3. Crear el payload combinado para validar el estado resultante completo
      const mergedPayload = {
        ...current,
        ...patch,
      };

      // 4. Validar inconsistencias lógicas
      const validationError = this._validateEvent(mergedPayload);
      if (validationError) {
        return { success: false, data: null, error: validationError };
      }

      // 5. Si se marca como promo_modal, desmarcar cualquier otro evento promocional activo
      if (patch.promo_modal === true) {
        await supabase
          .from("events")
          .update({ promo_modal: false })
          .neq("id", id)
          .eq("promo_modal", true);
      }

      // 6. Ejecutar la actualización en Supabase
      const { data, error } = await supabase
        .from("events")
        .update(patch)
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
    {
      name,
      email,
      career,
      dni,
      phone,
      age,
      occupation,
      interest_reason,
      referral_source,
      is_student_at_location,
    },
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
            dni,
            phone,
            age,
            occupation,
            interest_reason,
            referral_source,
            is_student_at_location,
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
          dni,
          phone,
          age,
          occupation,
          interest_reason,
          referral_source,
          is_student_at_location,
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
      directed_to,
      extra_details,
      brochure_url,
      zoom_link,
      benefits,
      speaker_id,
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
      directed_to: directed_to?.trim() || null,
      extra_details: extra_details?.trim() || null,
      brochure_url: brochure_url?.trim() || null,
      zoom_link: zoom_link?.trim() || null,
      benefits: Array.isArray(benefits) ? benefits : [],
      speaker_id: speaker_id || null,
    };
  }

  /** Genera slug básico desde un título */
  _generateSlug(title = "") {
    return createSlug(title);
  }

  /**
   * Realiza validaciones lógicas cruzadas de consistencia sobre el payload del evento.
   * @param {Object} payload - Objeto que representa el estado del evento
   * @returns {string|null} - Retorna un string con el error de validación o null si todo es consistente
   */
  _validateEvent(payload) {
    // 1. Validar fechas de inicio y fin
    if (payload.starts_at && payload.ends_at) {
      const starts = new Date(payload.starts_at);
      const ends = new Date(payload.ends_at);
      if (ends <= starts) {
        return "La fecha de finalización debe ser posterior a la fecha de inicio.";
      }
    }

    // 2. Validar publicación de eventos pasados
    if (payload.status === "published" && payload.starts_at) {
      const starts = new Date(payload.starts_at);
      const now = new Date();
      if (starts < now) {
        return "No puedes publicar un evento cuya fecha de inicio ya ha pasado.";
      }
    }

    // 3. Validar capacidad
    if (payload.capacity !== null && payload.capacity < 0) {
      return "La capacidad del evento no puede ser un número negativo.";
    }

    // 4. Validar precio
    if (payload.price !== null && payload.price < 0) {
      return "El precio del evento no puede ser un número negativo.";
    }

    // 5. Validar evento promocional (promo_modal)
    if (payload.promo_modal === true) {
      if (payload.status !== "published") {
        return "El evento debe estar publicado para marcarlo como destacado.";
      }
      if (payload.starts_at) {
        const starts = new Date(payload.starts_at);
        const now = new Date();
        if (starts < now) {
          return "No puedes marcar un evento pasado como destacado o promocional.";
        }
      }
    }

    return null;
  }

  /**
   * Verifica si un usuario está registrado en un evento
   * @param {string} eventId
   * @param {string} userId
   * @returns {Promise<{registered: boolean, name: string|null}>}
   */
  async checkUserRegistration(eventId, userId) {
    if (!eventId || !userId) return { registered: false, name: null };
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("name, status")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .eq("status", "registered")
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        return { registered: true, name: data[0].name };
      }
      return { registered: false, name: null };
    } catch (err) {
      console.error("Error checking user registration:", err);
      return { registered: false, name: null };
    }
  }
}

export const eventsService = new EventsService();
