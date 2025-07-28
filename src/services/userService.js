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
