import UserActionsMenu from "./UserActionsMenu";
import { useRole } from "../../../hooks/RoleProvider";

export default function UsersTab({
  users,
  totalPages,
  currentPage,
  setCurrentPage,
  roleFilter,
  setRoleFilter,
  onUserRoleUpdate,
  onUserDelete,
}) {
  const { userRole } = useRole();
  if (userRole !== "admin") {
    return (
      <div className="text-center text-red-600 font-semibold py-12">
        Acceso denegado. Solo los administradores pueden gestionar usuarios.
      </div>
    );
  }

  const roles = [
    { label: "Todos", value: "all" },
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
    { label: "User", value: "user" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Gestión de Usuarios
          <span className="ml-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
            {users.length} usuario{users.length === 1 ? "" : "s"}
          </span>
        </h2>
        <div className="flex gap-2 flex-wrap">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                setRoleFilter(r.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                roleFilter === r.value
                  ? "bg-primary text-white border-primary shadow"
                  : "bg-white text-primary border-primary hover:bg-primary/10"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Acceso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500 text-lg"
                >
                  {roleFilter === "all"
                    ? "No hay usuarios"
                    : roleFilter === "admin"
                    ? "No hay usuarios administradores"
                    : roleFilter === "editor"
                    ? "No hay usuarios editores"
                    : roleFilter === "user"
                    ? "No hay usuarios estándar"
                    : "No hay usuarios para este filtro"}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <UserActionsMenu
                      user={user}
                      onUserUpdated={(role) =>
                        onUserRoleUpdate && onUserRoleUpdate(user.id, role)
                      }
                      onUserDeleted={() =>
                        onUserDelete && onUserDelete(user.id)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
