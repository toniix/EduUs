import { createContext, useContext, useEffect, useState } from "react";
import {
  getSession,
  signOut as authSignOut,
  signInWithGoogle as authSignInWithGoogle,
  onAuthStateChange,
} from "../services/AuthService";
import {
  checkOrCreateProfile,
  updateLastLogin,
  getCurrentUserProfile,
} from "../services/userService";
import { getCurrentUserRole } from "../services/rolesService";

const AuthContext = createContext({
  profile: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => {},
  signInWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para inicializar el perfil del usuario
  const initializeProfile = async (currentUser, profileData = null) => {
    try {
      // Si ya tenemos el profileData, usarlo directamente
      const data = profileData || (await getCurrentUserProfile());

      // Si no existe, usa los datos de Auth
      if (!data) {
        setProfile({
          id: currentUser.id,
          full_name: currentUser?.user_metadata?.full_name || "",
          email: currentUser?.email || "",
          role: "user",
        });
        return;
      }
      // Si existe, usa los datos de BD
      setProfile({
        id: currentUser.id,
        full_name:
          data?.full_name || currentUser?.user_metadata?.full_name || "",
        email: data?.email || currentUser?.email || "",
        avatar_url: data?.avatar_url || currentUser?.user_metadata?.avatar_url,
        role: data?.role || "user",
        last_login: data?.last_login || null,
      });
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };

  // Esta useEffect maneja la autenticación y el estado del usuario
  useEffect(() => {
    let isMounted = true;
    let lastAuthState = null;

    // Función para procesar autenticación completa (primera carga)
    const handleInitialAuth = async (session) => {
      const currentUser = session?.user ?? null;
      console.log(session);
      if (!isMounted) return;

      if (!currentUser?.email_confirmed_at) {
        setProfile(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        setIsAuthenticated(true);

        // Ejecutar checkOrCreateProfile y updateLastLogin en paralelo
        const [profileResult] = await Promise.allSettled([
          checkOrCreateProfile(currentUser),
          updateLastLogin(currentUser),
        ]);

        // Usar el perfil retornado por checkOrCreateProfile
        const profileData =
          profileResult.status === "fulfilled"
            ? profileResult.value?.profile
            : null;

        // Obtener el rol del usuario
        const userRole = await getCurrentUserRole(currentUser.id);

        await initializeProfile(currentUser, profileData);

        // Actualizar el perfil con el rol
        if (isMounted) {
          setProfile((prev) => ({
            ...prev,
            role: userRole,
          }));
        }
      } catch (error) {
        console.error("Error en autenticación:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Función para detectar cambios de autenticación (solo logout/cambios reales)
    const handleAuthStateChange = (session) => {
      const currentUser = session?.user ?? null;

      // Si estaba autenticado y sigue autenticado → NO hacer nada (evita reprocesamiento)
      if (lastAuthState?.user?.id === currentUser?.id && currentUser) {
        console.log("✅ Usuario sigue autenticado, sin cambios innecesarios");
        return;
      }

      // Si hubo cambio real (logout o cambio de usuario)
      if (!currentUser) {
        console.log("🔴 Logout detectado");
        if (isMounted) {
          setProfile(null);
          setIsAuthenticated(false);
        }
      } else if (!lastAuthState?.user && currentUser) {
        // Usuario se acaba de loguear (nuevo inicio de sesión)
        console.log("🟢 Login detectado, procesando autenticación");
        handleInitialAuth(session);
      }

      lastAuthState = session;
    };

    // 1. Cargar sesión actual (solo una vez al inicio)
    getSession()
      .then((session) => {
        lastAuthState = session;
        handleInitialAuth(session);
      })
      .catch((error) => {
        console.error("Error obteniendo sesión:", error);
        if (isMounted) {
          setLoading(false);
        }
      });

    // 2. Suscribirse a cambios futuros (solo detecta cambios reales)
    const { data: { subscription } = {} } =
      onAuthStateChange(handleAuthStateChange) || {};

    // Limpieza al desmontar
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Función para cerrar sesión
  const signOut = async () => {
    await authSignOut();
    setIsAuthenticated(false);
    setProfile(null);
  };

  // Función para iniciar sesión con Google
  const signInWithGoogle = async () => {
    return await authSignInWithGoogle();
  };

  // console.log(profile);
  const value = {
    profile,
    loading,
    isAuthenticated,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
