import { supabase } from "../lib/supabase";

// Función para verificar si el email ya existe
export const checkEmailExists = async (email) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email.toLowerCase()) // Normalizar a minúsculas
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = "No rows found" - esto es lo que queremos
      throw error;
    }

    return !!data; // Retorna true si existe, false si no existe
  } catch (error) {
    console.error("Error verificando email:", error);
    throw new Error("Error al verificar email");
  }
};

// Función mejorada de registro con validación
export const registerUser = async ({ email, password, name }) => {
  // Proceder con el registro
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase(),
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;
  return { user: data.user };
};

// Crear perfil de usuario
export const createProfile = async (userId, { name, email }) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        full_name: name,
        email: email,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
};

// Inicio de sesión con email y contraseña
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Crear un error más descriptivo manteniendo el error original
    const customError = new Error(error.message);
    customError.code = error.status;
    customError.originalError = error;
    throw customError;
  }

  return data;
};

// Función para reenviar email de confirmación
export const resendConfirmationEmail = async (email) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
  });

  if (error) throw error;
  console.log(error);
  return true;
};

// Inicio de sesión con Google
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al iniciar sesión con Google", error.message);
    throw error;
  }
};

// Cierre de sesión
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Obtener sesión actual
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Suscribirse a cambios en la autenticación
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
};
