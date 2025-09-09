import { X } from "lucide-react";

const CategoryForm = ({
  isDark,
  currentCategory,
  formData,
  isSubmitting,
  handleSubmit,
  resetForm,
  handleInputChange,
}) => {
  return (
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
            onClick={resetForm}
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
              rows="2"
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
              onClick={resetForm}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex items-center justify-center px-4 py-2 rounded-lg w-32 ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-primary hover:bg-primary/90 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : currentCategory ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
