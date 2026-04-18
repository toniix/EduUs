/**
 * Convierte un texto en un slug amigable para URLs.
 * Ejemplo: "Beca de Verano 2026!" -> "beca-de-verano-2026"
 */
export function createSlug(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Reemplaza espacios con -
    .replace(/[^\w-]+/g, "")         // Elimina caracteres no alfanuméricos excepto -
    .replace(/--+/g, "-")            // Reemplaza múltiples - con uno solo
    .replace(/^-+/, "")              // Elimina - al inicio
    .replace(/-+$/, "");             // Elimina - al final
}
