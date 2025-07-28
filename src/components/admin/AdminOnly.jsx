import { RoleGuard } from "../RoleGuard";
import { usePermissions } from "../hooks/usePermissions";

export const AdminOnly = ({ children, fallback = null }) => (
  <RoleGuard requiredRole="admin" fallback={fallback}>
    {children}
  </RoleGuard>
);

// export const EditorOrAdmin = ({ children, fallback = null }) => (
//   <RoleGuard requiredRoles={["admin", "editor"]} fallback={fallback}>
//     {children}
//   </RoleGuard>
// );

// export const UserOnly = ({ children, fallback = null }) => (
//   <RoleGuard requiredRole="user" fallback={fallback}>
//     {children}
//   </RoleGuard>
// );
