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
    console.log(upsertError);
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

export const updateLastLogin = async (user) => {
  if (!user || !user.id || !user.last_sign_in_at) return;

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ last_login: user.last_sign_in_at })
      .eq("id", user.id);

    if (error) throw error;

    console.log("✅ last_login actualizado correctamente");
  } catch (err) {
    console.error("❌ Error al actualizar last_login:", err.message);
  }
};
