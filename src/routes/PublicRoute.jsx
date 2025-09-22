import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import InlineLoader from "../components/ui/LoadingSpinner";

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // Obtener la URL guardada o usar "/" como fallback
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";

      // Limpiar el sessionStorage
      sessionStorage.removeItem("redirectAfterLogin");

      // Redirigir
      navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Mostrar loading mientras se cargan los datos
  if (authLoading) {
    return <InlineLoader />;
  }

  // Solo mostrar el contenido si no hay usuario autenticado
  return !user ? children : null;
};

export default PublicRoute;
