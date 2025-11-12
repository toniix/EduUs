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
  user: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => {},
  signInWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
  });

  const initializeProfile = async (currentUser) => {
    try {
      const profileData = await getCurrentUserProfile();
      setProfile({
        full_name:
          profileData?.full_name || currentUser?.user_metadata?.full_name || "",
        email: profileData?.email || currentUser?.email || "",
      });
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Esta función maneja tanto la carga inicial como los cambios
    const handleAuthState = async (session) => {
      const currentUser = session?.user ?? null;

      if (!isMounted) return;

      if (!currentUser?.email_confirmed_at) {
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setUser(currentUser);
        setIsAuthenticated(true);

        // Ejecutar en paralelo
        await Promise.allSettled([
          checkOrCreateProfile(currentUser),
          updateLastLogin(currentUser),
          initializeProfile(currentUser),
        ]);

        if (isMounted) {
          const role = await getCurrentUserRole();
          setRole(role);
        }
      } catch (error) {
        console.error("Error en autenticación:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // 1. Cargar sesión actual (solo una vez al inicio)
    getSession()
      .then((session) => {
        handleAuthState(session);
      })
      .catch((error) => {
        console.error("Error obteniendo sesión:", error);
        if (isMounted) {
          setLoading(false);
        }
      });

    // 2. Suscribirse a cambios futuros
    const { data: { subscription } = {} } =
      onAuthStateChange(handleAuthState) || {};

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
    setUser(null);
  };

  // Función para iniciar sesión con Google
  const signInWithGoogle = async () => {
    return await authSignInWithGoogle();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signOut,
    signInWithGoogle,
    role,
    profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
