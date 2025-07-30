import { useRole } from "../../contexts/RoleContext";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";

export const RoleGuard = ({
  children,
  requiredRole,
  requiredRoles,
  fallback = null,
  inverse = false,
}) => {
  const { hasRole, hasAnyRole, loading: roleLoading, userRole } = useRole();
  const { role, loading: authLoading } = useAuth();

  const effectiveRole = userRole || role;
  const isLoading = roleLoading || authLoading;

  if (isLoading || !effectiveRole) {
    return (
      <LoadingSpinner
        message="Verificando permisos de administrador..."
        size="lg"
        className="min-h-[400px]"
      />
    );
  }

  let hasAccess = false;

  if (requiredRole) {
    hasAccess = hasRole
      ? hasRole(requiredRole)
      : effectiveRole === requiredRole;
  } else if (requiredRoles && requiredRoles.length > 0) {
    hasAccess = hasAnyRole
      ? hasAnyRole(requiredRoles)
      : requiredRoles.includes(effectiveRole);
  }

  if (inverse) hasAccess = !hasAccess;
  if (!hasAccess) return fallback;
  return children;
};
