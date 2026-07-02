/**
 * Configuración de Cloudinary para el cliente.
 * Solo se usa el cloudName para optimización de URLs (lectura).
 * Los uploads se realizan a través de la Edge Function de Supabase
 * para proteger las credenciales de Cloudinary.
 */
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
};

if (!CLOUDINARY_CONFIG.cloudName) {
  throw new Error("Missing VITE_CLOUDINARY_CLOUD_NAME environment variable");
}
