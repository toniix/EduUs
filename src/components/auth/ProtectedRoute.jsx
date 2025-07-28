import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";

// This component is used to protect routes that require authentication

const ProtectedRoute = ({
  children,
  requiredRole,
  requiredRoles,
  minimumRole,
  fallback = null,
  redirectTo = "/unauthorized",
}) => {
  const { user, loading } = useAuth();
  // const { userRole, hasRole, hasAnyRole } = usePermissions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  //  // Mostrar loading mientras se cargan los roles
  //  if (loading) {
  //    return <LoadingSpinner />;
  //  }

  //  // Si no tiene rol (no autenticado)
  //  if (!userRole) {
  //    return <Navigate to="/login" replace />;
  //  }

  //  // Verificar permisos según el tipo de protección
  //  let hasAccess = false;

  //  if (requiredRole) {
  //    hasAccess = hasRole(requiredRole);
  //  } else if (requiredRoles && requiredRoles.length > 0) {
  //    hasAccess = hasAnyRole(requiredRoles);
  //  } else if (minimumRole) {
  //    hasAccess = hasMinimumRole(minimumRole);
  //  } else {
  //    // Si no se especifica ningún rol, solo verificar que esté autenticado
  //    hasAccess = !!userRole;
  //  }

  //  // Si no tiene acceso
  //  if (!hasAccess) {
  //    if (fallback) {
  //      return fallback;
  //    }
  //    return <Navigate to={redirectTo} replace />;
  //  }

  return <>{children}</>;
};

export default ProtectedRoute;
