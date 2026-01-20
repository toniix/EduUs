import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import InlineLoader from "../components/ui/LoadingSpinner";

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (profile) {
      // Obtener la URL guardada o usar "/" como fallback
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";

      // Limpiar el sessionStorage
      sessionStorage.removeItem("redirectAfterLogin");

      // Redirigir
      navigate(redirectTo, { replace: true });
    }
  }, [profile, authLoading, navigate]);

  // Mostrar loading mientras se cargan los datos
  if (authLoading) {
    return <InlineLoader />;
  }

  // Solo mostrar el contenido si no hay usuario autenticado
  return !profile ? children : null;
};

export default PublicRoute;
