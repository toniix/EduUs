import { useContext } from "react";
import UserActionsMenu from "./UserActionsMenu";
import { useRole } from "../../../contexts/RoleContext";
import { ThemeContext } from "../../../contexts/ThemeContext";
import InlineLoader from "../../ui/LoadingSpinner";

export default function UsersTab({
  users,
  totalPages,
  currentPage,
  setCurrentPage,
  roleFilter,
  setRoleFilter,
  onUserRoleUpdate,
  onUserDelete,
  loading = false,
}) {
  const { userRole } = useRole();
  const { isDark } = useContext(ThemeContext);
  if (userRole !== "admin") {
    return (
      <div
        className={`text-center font-semibold py-12 ${
          isDark ? "text-red-400" : "text-red-600"
        }`}
      >
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

  const getRoleButtonClasses = (isActive) => {
    const baseClasses =
      "px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50";

    if (isActive) {
      return `${baseClasses} bg-primary text-white border-primary shadow`;
    }

    return isDark
      ? `${baseClasses} bg-gray-700 text-primary-300 border-gray-600 hover:bg-gray-600`
      : `${baseClasses} bg-white text-primary border-primary hover:bg-primary/10`;
  };

  return (
    <div
      className={`rounded-lg shadow-md p-6 pt-8 ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2
          className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Gestión de Usuarios
          <span className="ml-2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold">
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
              className={getRoleButtonClasses(roleFilter === r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {loading && <InlineLoader message="Cargando usuarios..." size="md" />}
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y ${
            isDark ? "divide-gray-700" : "divide-gray-200"
          }`}
        >
          <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              {["Nombre", "Email", "Rol", "Último Acceso", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark
                ? "bg-gray-700 divide-gray-600"
                : "bg-white divide-gray-200"
            }`}
          >
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className={`px-6 py-10 text-center text-lg ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
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
                  className={`transition-colors duration-200 ${
                    isDark ? "hover:bg-gray-600" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.full_name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isDark
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role || "-"}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
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
                      isDark={isDark}
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
