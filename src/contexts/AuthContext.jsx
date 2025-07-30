import { createContext, useContext, useEffect, useState } from "react";
import {
  getSession,
  signOut as authSignOut,
  signInWithGoogle as authSignInWithGoogle,
  onAuthStateChange,
} from "../services/AuthService";
import { checkOrCreateProfile, updateLastLogin } from "../services/userService";
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

  // Cargar sesión y rol actual al inicio
  useEffect(() => {
    const fetchSessionAndRole = async () => {
      const session = await getSession();
      const currentUser = session?.user ?? null;

      if (!currentUser || !currentUser.email_confirmed_at) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setIsAuthenticated(true);
      setLoading(false);

      try {
        // Crear perfil si no existe
        await checkOrCreateProfile(currentUser);
        const role = await getCurrentUserRole();
        console.log(role);

        // Actualizar last_login
        await updateLastLogin(currentUser);
      } catch (error) {
        console.error("Error creando perfil o obteniendo rol:", error.message);
      }
    };

    fetchSessionAndRole();

    const {
      data: { subscription },
    } = onAuthStateChange(async (session) => {
      const currentUser = session?.user ?? null;

      if (!currentUser || !currentUser.email_confirmed_at) {
        setUser(null);
        setIsAuthenticated(false);

        setLoading(false);
        return;
      }

      setUser(currentUser);
      setIsAuthenticated(true);
      setLoading(false);

      try {
        await checkOrCreateProfile(currentUser);
        await updateLastLogin(currentUser);
        const role = await getCurrentUserRole();
        setRole(role);
      } catch (error) {
        console.error("Error creando perfil o obteniendo rol:", error.message);
      }
    });

    return () => subscription.unsubscribe();
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
