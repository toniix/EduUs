import React, { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";

// Nueva implementación simplificada
const RoleGuard = ({
  children,
  requiredRoles = [],
  fallback = null,
  inverse = false,
}) => {
  const { profile, loading } = useAuth();

  const role = profile?.role;
  // Verificar si el usuario tiene acceso basado en el rol
  // console.log("verificando permisos...");

  const hasAccess = useMemo(() => {
    // Si no hay roles requeridos, se otorga acceso según la condición inverse
    if (!requiredRoles || requiredRoles.length === 0) {
      return !inverse;
    }

    // Verificar si el rol actual está en los roles requeridos
    const hasRequiredRole = role && requiredRoles.includes(role.toLowerCase());
    console.log("hasRequiredRole:", hasRequiredRole);
    // Aplicar la condición inverse si es necesario
    return inverse ? !hasRequiredRole : hasRequiredRole;
  }, [role, requiredRoles, inverse]);

  // console.log("hasAccess:", hasAccess);

  // Mostrar spinner mientras se carga la autenticación
  if (loading) {
    return <LoadingSpinner message="Verificando permisos..." size="lg" />;
  }

  // Si no tiene acceso, mostrar el fallback o null
  if (!hasAccess) {
    return fallback || null;
  }

  // Si tiene acceso, mostrar el contenido
  return children;
};

export default React.memo(RoleGuard);
