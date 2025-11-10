import { supabase } from "../lib/supabase";

export const checkOrCreateProfile = async (user) => {
  if (!user || !user.id) throw new Error("Usuario inválido");
  // Verificar si el perfil ya existe
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code === "PGRST116") {
    // Si no existe, crearlo
    const { error: upsertError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Sin nombre",
        email: user.email,
      },
      { onConflict: "id" }
    );
    if (upsertError) throw upsertError;
    return { created: true };
  }
  if (profileError) throw profileError;
  return { created: false };
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

// export const updateLastLogin = async (user) => {
//   if (!user || !user.id || !user.last_sign_in_at) return;

//   try {
//     const { error } = await supabase
//       .from("profiles")
//       .update({ last_login: user.last_sign_in_at })
//       .eq("id", user.id);

//     if (error) throw error;
//   } catch (err) {
//     console.error("❌ Error al actualizar last_login:", err.message);
//   }
// };

export const updateLastLogin = async (user) => {
  if (!user?.id || !user?.last_sign_in_at) return;

  try {
    // Crear fecha en la zona horaria de Perú
    const peruTime = new Date(user.last_sign_in_at).toLocaleString("es-PE", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Usar formato 24 horas
    });

    // Formato: YYYY-MM-DD HH:MM:SS
    const [date, time] = peruTime.split(", ");
    const [day, month, year] = date.split("/");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )} ${time}`;

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
