import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import InlineLoader from "../components/ui/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const processedRef = useRef(false);

  useEffect(() => {
    const handleCallback = () => {
      // Si ya se procesó, no hacer nada
      if (processedRef.current) return;

      // Si AuthContext aún está cargando, esperar
      if (authLoading) return;

      // Marcar como procesado
      processedRef.current = true;

      // console.log("Procesando callback con AuthContext");
      // console.log("Usuario:", user);

      if (user) {
        // Usuario autenticado exitosamente
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
        // console.log("URL guardada:", redirectUrl);

        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin");
          // console.log("Redirigiendo a:", redirectUrl);
          navigate(redirectUrl, { replace: true });
        } else {
          // console.log("No hay URL guardada, redirigiendo a home");
          navigate("/", { replace: true });
        }
      } else {
        // No hay usuario, algo salió mal
        console.log("No hay usuario después del callback");
        navigate("/login", { replace: true });
      }

      setLocalLoading(false);
    };

    handleCallback();
  }, [user, authLoading, navigate]);

  if (authLoading || localLoading) {
    return <InlineLoader />;
  }

  return null;
};

export default AuthCallback;
