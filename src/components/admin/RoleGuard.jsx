import { useRole } from "../../hooks/RoleProvider";

export const RoleGuard = ({
  children,
  requiredRole,
  requiredRoles,
  fallback = null,
  inverse = false,
}) => {
  const { hasRole, hasAnyRole } = useRole();

  let hasAccess = false;
  if (requiredRole) {
    hasAccess = hasRole(requiredRole);
  } else if (requiredRoles && requiredRoles.length > 0) {
    hasAccess = hasAnyRole(requiredRoles);
  }
  if (inverse) hasAccess = !hasAccess;
  if (!hasAccess) return fallback;
  return children;
};

