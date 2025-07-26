import { createContext, useContext, useEffect, useState } from "react";
import {
  getSession,
  signOut as authSignOut,
  signInWithGoogle as authSignInWithGoogle,
  onAuthStateChange,
} from "../services/AuthService";

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

  // Verificar sesión al cargar
  useEffect(() => {
    // Verificar sesión al cargar
    getSession().then((session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    // Escuchar cambios en el estado de autenticación
    const {
      data: { subscription },
    } = onAuthStateChange((session) => {
      setUser(session?.user ?? null);
      // console.log(session.user);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
