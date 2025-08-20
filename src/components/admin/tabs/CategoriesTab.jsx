import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const CategoriesTab = ({ isDark }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6", // Color por defecto
  });

  // Simulación de carga de categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Aquí iría la llamada a tu API
        // const response = await yourApiService.getCategories();
        // setCategories(response.data);

        // Datos de ejemplo
        setTimeout(() => {
          setCategories([
            {
              id: 1,
              name: "Becas",
              description: "Oportunidades de becas",
              color: "#3b82f6",
            },
            {
              id: 2,
              name: "Talleres",
              description: "Talleres educativos",
              color: "#10b981",
            },
            {
              id: 3,
              name: "Intercambios",
              description: "Programas de intercambio",
              color: "#f59e0b",
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Error al cargar las categorías");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para crear/actualizar la categoría
    console.log("Formulario enviado:", formData);
    setIsModalOpen(false);
    // Limpiar el formulario
    setFormData({ name: "", description: "", color: "#3b82f6" });
    setCurrentCategory(null);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")
    ) {
      // Aquí iría la lógica para eliminar la categoría
      console.log("Eliminar categoría:", id);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg ${
          isDark ? "bg-red-900/30 text-red-200" : "bg-red-100 text-red-800"
        }`}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md p-6 pt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Buscar categorías..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-primary/50`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setCurrentCategory(null);
            setFormData({ name: "", description: "", color: "#3b82f6" });
            setIsModalOpen(true);
          }}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-primary hover:bg-primary/90 text-white"
          } transition-colors`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Descripción
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Color
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-gray-200 dark:divide-gray-700 ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-3 w-3 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div className="font-medium">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {category.description || "Sin descripción"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-4 w-4 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-xs font-mono">
                        {category.color}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className={`p-1.5 rounded-md ${
                          isDark
                            ? "text-blue-400 hover:bg-blue-900/30"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className={`p-1.5 rounded-md ${
                          isDark
                            ? "text-red-400 hover:bg-red-900/30"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className={`px-6 py-8 text-center text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No se encontraron categorías
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md rounded-xl p-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {currentCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentCategory(null);
                }}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="color"
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Color
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="h-10 w-16 cursor-pointer rounded border border-gray-300"
                  />
                  <span className="text-sm font-mono">{formData.color}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentCategory(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    isDark
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  {currentCategory ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesTab;
