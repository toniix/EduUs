import React, { useEffect, useCallback, useReducer, useContext } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryService } from "../../../services/categoryService";
import toast from "react-hot-toast";
import CategoryForm from "../../CategoryForm";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";

const EMPTY_FORM = { name: "", description: "", color: "#3b82f6" };

const dataInitialState = { categories: [], loading: true, error: null };

function dataReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { categories: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat,
        ),
      };
    case "DELETE":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };
    default:
      return state;
  }
}

const modalInitialState = {
  isModalOpen: false,
  isSubmitting: false,
  currentCategory: null,
  formData: EMPTY_FORM,
};

function modalReducer(state, action) {
  switch (action.type) {
    case "OPEN_CREATE":
      return {
        ...state,
        isModalOpen: true,
        currentCategory: null,
        formData: EMPTY_FORM,
      };
    case "OPEN_EDIT":
      return {
        ...state,
        isModalOpen: true,
        currentCategory: action.payload,
        formData: {
          name: action.payload.name,
          description: action.payload.description || "",
          color: action.payload.color || "#3b82f6",
        },
      };
    case "CLOSE":
      return { ...modalInitialState };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true };
    case "SUBMIT_END":
      return { ...state, isSubmitting: false };
    case "FIELD_CHANGE":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    default:
      return state;
  }
}

const CategoriesTab = () => {
  const { isDark } = useContext(ThemeContext);
  const { profile } = useAuth();
  const role = profile?.role;

  const [dataState, dispatchData] = useReducer(dataReducer, dataInitialState);
  const { categories, loading, error } = dataState;

  const [modalState, dispatchModal] = useReducer(
    modalReducer,
    modalInitialState,
  );
  const { isModalOpen, isSubmitting, currentCategory, formData } = modalState;

  const fetchCategories = useCallback(async () => {
    try {
      dispatchData({ type: "FETCH_START" });
      const data = await categoryService.getCategories();
      dispatchData({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatchData({
        type: "FETCH_ERROR",
        payload:
          "Error al cargar las categorías. Inténtalo de nuevo más tarde.",
      });
      toast.error("No se pudieron cargar las categorías.");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatchModal({ type: "FIELD_CHANGE", payload: { [name]: value } });
  };

  const resetForm = () => {
    dispatchModal({ type: "CLOSE" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatchModal({ type: "SUBMIT_START" });
    try {
      if (currentCategory) {
        const updatedCategory = await categoryService.updateCategory(
          currentCategory.id,
          formData,
          role,
        );
        dispatchData({ type: "UPDATE", payload: updatedCategory });
        toast.success("Categoría actualizada con éxito");
      } else {
        const newCategory = await categoryService.createCategory(
          formData,
          role,
        );
        dispatchData({ type: "ADD", payload: newCategory });
        toast.success("Categoría creada con éxito");
      }
      resetForm();
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      dispatchModal({ type: "SUBMIT_END" });
    }
  };

  const handleEdit = (category) => {
    dispatchModal({ type: "OPEN_EDIT", payload: category });
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")
    ) {
      try {
        // console.log(role);
        await categoryService.deleteCategory(id, role);
        dispatchData({ type: "DELETE", payload: id });
        toast.success("Categoría eliminada con éxito");
      } catch (err) {
        toast.error("No se pudo eliminar la categoría. " + err);
      }
    }
  };

  // const filteredCategories = categories.filter(
  //   (category) =>
  //     category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     category.description.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
    <div
      className={`rounded-lg shadow-md p-6 w-full h-full flex flex-col ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Gestión de Categorías
          <span className="ml-2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold">
            {categories.length} categoría
            {categories.length === 1 ? "" : "s"}
          </span>
        </h2>

        <button
          onClick={() => dispatchModal({ type: "OPEN_CREATE" })}
          className="flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
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
            className={`divide-y ${
              isDark
                ? "bg-gray-700 divide-gray-600"
                : "bg-white divide-gray-200"
            }`}
          >
            {categories.length > 0 ? (
              categories.map((category) => (
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
        <CategoryForm
          isDark={isDark}
          currentCategory={currentCategory}
          formData={formData}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default CategoriesTab;
