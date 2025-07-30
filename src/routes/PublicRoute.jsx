import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRole } from "../contexts/RoleContext";
import { ROLES } from "../utils/constants";

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useRole();

  useEffect(() => {
    if (authLoading || roleLoading) return;

    if (user && userRole) {
      if (userRole === ROLES.ADMIN || userRole === ROLES.EDITOR) {
        navigate("/admin", { replace: true });
      } else if (userRole === ROLES.USER) {
        navigate("/", { replace: true });
      }
    }
  }, [user, userRole, authLoading, roleLoading, navigate]);

  // Mostrar loading mientras se cargan los datos
  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Solo mostrar el contenido si no hay usuario autenticado
  return !user ? children : null;
};

export default PublicRoute;
