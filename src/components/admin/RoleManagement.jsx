import { useState, useEffect } from "react";
import {
  getAllUsersWithRoles,
  updateUserRole,
} from "../../services/rolesService";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import AdminOnly from "../AdminOnly";
import UserRoleRow from "./UserRoleRow";

export const SimpleRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsersWithRoles();
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers(); // Recargar datos
      toast.success("Rol actualizado correctamente");
    } catch (err) {
      toast.error("Error al actualizar rol");
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <AdminOnly
      fallback={
        <div className="p-4">No tienes permisos para ver esta página</div>
      }
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Gestión de Roles</h2>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cambiar Rol
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <UserRoleRow
                  key={user.id}
                  user={user}
                  onRoleChange={handleRoleChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminOnly>
  );
};
