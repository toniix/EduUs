import { Plus, Eye, Edit, Trash2 } from "lucide-react";

export default function UsersTab({ users }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 pt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
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
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Eye className="h-4 w-4 text-blue-600 hover:text-blue-900" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Edit className="h-4 w-4 text-indigo-600 hover:text-indigo-900" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Trash2 className="h-4 w-4 text-red-600 hover:text-red-900" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
