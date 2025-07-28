import { useRole } from "./RoleProvider";
import { useCallback } from "react";
import { ROLES } from "../utils/constants";

export const usePermissions = () => {
  const { userRole, loading } = useRole();

  return {
    userRole,
    loading,
    isAdmin: userRole === ROLES.ADMIN,
    isEditor: userRole === ROLES.EDITOR,
    isUser: userRole === ROLES.USER,
    hasRole: useCallback((role) => userRole === role, [userRole]),
    hasAnyRole: useCallback((roles) => roles.includes(userRole), [userRole]),
  };
};
