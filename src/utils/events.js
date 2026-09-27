/**
 * Configuración de categorías de eventos con colores Tailwind distintos
 */
export const categoryConfig = {
  taller: {
    label: "Taller",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  charla: {
    label: "Charla",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    dotClass: "bg-purple-500",
  },
  networking: {
    label: "Networking",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  campamento: {
    label: "Campamento",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
    dotClass: "bg-orange-500",
  },
};

/**
 * Configuración de modalidad de eventos
 */
export const modalityConfig = {
  presencial: { label: "Presencial", icon: "🏢" },
  virtual: { label: "Virtual", icon: "💻" },
  hibrido: { label: "Híbrido", icon: "🌐" },
};

export const PERU_TIMEZONE = "America/Lima";

/**
 * Convierte un ISO string UTC de la BD a formato "YYYY-MM-DDTHH:mm" en hora de Perú
 * para ser consumido por inputs type="datetime-local".
 * @param {string} isoString
 * @returns {string}
 */
export function toPeruDateTimeLocal(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: PERU_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const m = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${m.year}-${m.month}-${m.day}T${m.hour}:${m.minute}`;
}

/**
 * Convierte el valor "YYYY-MM-DDTHH:mm" de un input datetime-local (hora Perú)
 * a un string ISO UTC estandarizado ("YYYY-MM-DDTHH:mm:ss.sssZ").
 * @param {string} localStr
 * @returns {string|null}
 */
export function peruDateTimeLocalToIso(localStr) {
  if (!localStr) return null;
  // Si ya contiene indicador de timezone (Z o offset +/-), parsear directo
  if (
    localStr.includes("Z") ||
    (localStr.length > 19 &&
      (localStr.includes("+") || localStr.includes("-", 10)))
  ) {
    const d = new Date(localStr);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  const withSeconds = localStr.length === 16 ? `${localStr}:00` : localStr;
  const d = new Date(`${withSeconds}-05:00`);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Formatea una fecha ISO a la versión en español asegurando la hora oficial de Perú:
 * "15 de marzo · 10:00 AM"
 * @param {string} isoString
 * @returns {string}
 */
export function formatEventDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const datePart = new Intl.DateTimeFormat("es-PE", {
    timeZone: PERU_TIMEZONE,
    day: "numeric",
    month: "long",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("es-PE", {
    timeZone: PERU_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .toUpperCase();

  return `${datePart} · ${timePart}`;
}

/**
 * Formatea solo la hora en hora de Perú: "10:00 AM"
 * @param {string} isoString
 * @returns {string}
 */
export function formatEventTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-PE", {
    timeZone: PERU_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .toUpperCase();
}

/**
 * Retorna el estado visual de un evento combinando el campo `status` de la BD
 * con la fecha de inicio (para detectar eventos pasados).
 * @param {Object} event
 * @returns {"published"|"draft"|"sold_out"|"past"|"cancelled"|"finished"}
 */
export function getEventStatus(event) {
  // Si el status de la BD ya lo indica explícitamente
  if (event.status === "cancelled") return "cancelled";
  if (event.status === "finished") return "finished";
  if (event.status === "draft") return "draft";

  // Si está publicado, verificar si ya pasó o si está agotado
  const now = new Date();
  const startsAt = new Date(event.starts_at);
  if (startsAt < now) return "past";
  if (event.spots_left === 0) return "sold_out";

  return "published";
}

/**
 * Config visual por estado de evento (para badges en la tabla admin)
 */
export const eventStatusConfig = {
  published: {
    label: "Publicado",
    badgeClass: "bg-green-100 text-green-800",
  },
  draft: {
    label: "Borrador",
    badgeClass: "bg-gray-100 text-gray-600",
  },
  sold_out: {
    label: "Agotado",
    badgeClass: "bg-red-100 text-red-800",
  },
  past: {
    label: "Pasado",
    badgeClass: "bg-yellow-100 text-yellow-800",
  },
  cancelled: {
    label: "Cancelado",
    badgeClass: "bg-red-100 text-red-700",
  },
  finished: {
    label: "Finalizado",
    badgeClass: "bg-blue-100 text-blue-700",
  },
};

/**
 * Opciones de status para el select del EventForm (campo status de la BD)
 */
export const EVENT_STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "cancelled", label: "Cancelado" },
  { value: "finished", label: "Finalizado" },
];

/**
 * Filtros disponibles para la sección pública
 */
export const EVENT_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "taller", label: "Talleres" },
  { value: "charla", label: "Charlas" },
  // { value: "networking", label: "Networking" },
  // { value: "campamento", label: "Campamentos" },
];
