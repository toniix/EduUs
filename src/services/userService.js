import { supabase } from "../lib/supabase";
import { formatDatePeruTime } from "../utils/formatDate";

export const checkOrCreateProfile = async (user) => {
  // console.log("---------------------------CHEKING PROFILE");
  if (!user || !user.id) throw new Error("Usuario inválido");

  // Usar upsert directamente - más eficiente que verificar primero
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Sin nombre",
        email: user.email,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;

  // Retornar el perfil completo para evitar otra consulta
  return {
    created: true,
    profile: data,
  };
};

// Obtener todos los perfiles
export const getAllProfiles = async () => {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return data;
};

// Eliminar un usuario por id
export const deleteUser = async (userId) => {
  const { error } = await supabase.from("profiles").delete().eq("id", userId);
  if (error) throw error;
  return true;
};

export const updateLastLogin = async (user) => {
  // console.log("Actualizando el last login");
  if (!user?.id || !user?.last_sign_in_at) return;

  try {
    // Usar la función centralizada para formatear la fecha en zona horaria de Perú
    const formattedDate = formatDatePeruTime(user.last_sign_in_at);

    // console.log("Fecha formateada para last_login:", formattedDate);

    if (!formattedDate) {
      console.error("❌ No se pudo formatear la fecha de last_login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        last_login: formattedDate,
      })
      .eq("id", user.id);

    if (error) throw error;
  } catch (err) {
    console.error("❌ Error al actualizar last_login:", err.message);
  }
};

// Obtener perfil completo del usuario actual
export const getCurrentUserProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
};
