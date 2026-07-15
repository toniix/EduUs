import { supabase } from "../lib/supabase";

/**
 * Sube una imagen a Cloudinary a través de la Edge Function de Supabase.
 * Las credenciales de Cloudinary residen únicamente en el servidor.
 *
 * @param {File|Blob} file - Archivo de imagen a subir
 * @returns {Promise<string>} URL pública de la imagen subida
 */
export async function uploadImageToCloudinary(file) {
  // Obtener el token de sesión actual para autenticar la llamada a la Edge Function
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Se requiere autenticación para subir imágenes");
  }

  const formData = new FormData();
  formData.append("file", file);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(
    `${supabaseUrl}/functions/v1/upload-image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Error subiendo imagen");
  }

  return result.url;
}
