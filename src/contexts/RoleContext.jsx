import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from "react";
import { ROLES } from "../utils/constants";
import { getCurrentUserRole } from "../services/rolesService";
import { useAuth } from "../contexts/AuthContext";

// Context para roles
const RoleContext = createContext();

// Provider de roles
export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUserRole = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Reset error al empezar

      // Si no hay usuario, limpiar rol
      if (!user) {
        setUserRole(null);
        return;
      }

      // Si hay usuario, obtener el rol
      const role = await getCurrentUserRole();
      setUserRole(role);
    } catch (err) {
      setError(err.message);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  // Funciones memoizadas para evitar re-renders innecesarios
  const hasRole = useCallback((role) => userRole === role, [userRole]);

  const hasAnyRole = useCallback(
    (roles) => {
      if (!Array.isArray(roles)) return false;
      return roles.includes(userRole);
    },
    [userRole]
  );

  // Valores derivados memoizados
  const derivedValues = useMemo(
    () => ({
      isAdmin: userRole === ROLES.ADMIN,
      isEditor: userRole === ROLES.EDITOR,
      isUser: userRole === ROLES.USER,
    }),
    [userRole]
  );

  const value = useMemo(
    () => ({
      userRole,
      loading,
      error,
      refetch: fetchUserRole,
      hasRole,
      hasAnyRole,
      ...derivedValues,
    }),
    [
      userRole,
      loading,
      error,
      fetchUserRole,
      hasRole,
      hasAnyRole,
      derivedValues,
    ]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

// Hook para usar el contexto de roles
export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole debe ser usado dentro de RoleProvider");
  }
  return context;
};
