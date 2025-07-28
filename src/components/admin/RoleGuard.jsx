import { usePermissions } from "../hooks/usePermissions";

export const RoleGuard = ({
  children,
  requiredRole,
  requiredRoles,
  fallback = null,
  inverse = false,
}) => {
  const { hasRole, hasAnyRole } = usePermissions();

  let hasAccess = false;

  if (requiredRole) {
    hasAccess = hasRole(requiredRole);
  } else if (requiredRoles && requiredRoles.length > 0) {
    hasAccess = hasAnyRole(requiredRoles);
  }

  // Si inverse es true, invertir la lógica
  if (inverse) {
    hasAccess = !hasAccess;
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};
