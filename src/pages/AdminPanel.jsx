import React, { useState } from "react";
import {
  Users,
  FileText,
  BarChart2,
  Settings,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  Plus,
} from "lucide-react";

const mockUsers = [
  {
    id: "1",
    name: "María González",
    email: "maria@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-03-15 10:30",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    role: "Editor",
    status: "active",
    lastLogin: "2024-03-14 15:45",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@example.com",
    role: "User",
    status: "inactive",
    lastLogin: "2024-03-10 09:15",
  },
];

const mockContent = [
  {
    id: "1",
    title: "Nueva Beca Internacional",
    type: "opportunity",
    status: "published",
    author: "María González",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Guía para Estudiar en el Extranjero",
    type: "blog",
    status: "draft",
    author: "Carlos Rodríguez",
    createdAt: "2024-03-14",
  },
  {
    id: "3",
    title: "Conferencia de Educación 2024",
    type: "news",
    status: "published",
    author: "Ana Martínez",
    createdAt: "2024-03-13",
  },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
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
                  {mockUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
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

      case "content":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestión de Contenido</h2>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Contenido
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockContent.map((content) => (
                    <tr key={content.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {content.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {content.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            content.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {content.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {content.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {content.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
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

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Usuarios Totales</h3>
                <p className="text-3xl font-bold text-primary">1,234</p>
                <p className="text-sm text-gray-500">
                  +12% desde el mes pasado
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">
                  Contenido Publicado
                </h3>
                <p className="text-3xl font-bold text-secondary">456</p>
                <p className="text-sm text-gray-500">+8% desde el mes pasado</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Aplicaciones</h3>
                <p className="text-3xl font-bold text-accent">789</p>
                <p className="text-sm text-gray-500">
                  +15% desde el mes pasado
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Gráfico de Actividad
              </h3>
              <div className="h-64 flex items-center justify-center border border-gray-200 rounded">
                <p className="text-gray-500">
                  Gráfico de actividad (Placeholder)
                </p>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Configuración</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Configuración General
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre del Sitio
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      placeholder="EDU-US"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descripción
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      rows={3}
                      placeholder="Descripción del sitio..."
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Notificaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Recibir notificaciones por email
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Notificaciones de nuevos usuarios
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === "users"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Usuarios</span>
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === "content"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Contenido</span>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === "analytics"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Analíticas</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === "settings"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Configuración</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                  Panel de Administración
                </h1>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="bg-gray-100 p-2 rounded-md hover:bg-gray-200">
                    <Filter className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
