import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { ROLES } from "../utils/constants";
import { getCurrentUserRole } from "../services/rolesService";

// Context para roles
const RoleContext = createContext();

// Provider de roles
export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserRole = useCallback(async () => {
    try {
      setLoading(true);
      const role = await getCurrentUserRole();
      setUserRole(role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  const value = {
    userRole,
    loading,
    error,
    refetch: fetchUserRole,
    isAdmin: userRole === ROLES.ADMIN,
    isEditor: userRole === ROLES.EDITOR,
    isUser: userRole === ROLES.USER,
    hasRole: useCallback((role) => userRole === role, [userRole]),
    hasAnyRole: useCallback((roles) => roles.includes(userRole), [userRole]),
  };

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
