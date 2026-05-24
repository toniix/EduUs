import { Plus } from "lucide-react";
import OpportunityForm from "../../opportunities/OpportunityForm";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import {
  updateOpportunity,
  createOpportunity,
} from "../../../services/opportunityService";
import InlineLoader from "../../ui/LoadingSpinner";
import { toast } from "react-hot-toast";
import OpportunityActionsMenu from "../../admin/OpportunityActionsMenu";
import Pagination from "../../Pagination";
import { useAuth } from "../../../contexts/AuthContext";
import { getCountOfFeaturedOpportunities } from "../../../services/opportunityService";

export default function ContentTab({
  opportunities,
  currentPage,
  setCurrentPage,
  totalPages,
  loading,
  fetchOpportunities,
  categories = [],
  categoryFilter,
  setCategoryFilter,
  modalityFilter,
  setModalityFilter,
  statusFilter,
  setStatusFilter,
  publishFilter,
  setPublishFilter,
  dateFilter,
  setDateFilter,
  featuredFilter,
  setFeaturedFilter,
}) {
  const { profile } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [totalFeaturedCount, setTotalFeaturedCount] = useState(0);

  // console.log(opportunities);
  // console.log(opportunities.map((opp) => opp.featured_order));

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedOpportunity?.id) {
        const { success, error } = await updateOpportunity(
          selectedOpportunity.id,
          formData,
          profile?.role,
        );
        if (!success) throw new Error(error);
        toast.success("Oportunidad actualizada correctamente");
      } else {
        const { success, error } = await createOpportunity(formData);
        if (!success) throw new Error(error);
        toast.success("Oportunidad creada correctamente");
      }

      setShowOpportunityForm(false);
      setSelectedOpportunity(null);
      await fetchOpportunities();
      return true;
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al procesar la solicitud");
      throw error; // Let the form handle it if needed
    }
  };

  const handleFormClose = () => {
    setShowOpportunityForm(false);
    setSelectedOpportunity(null);
  };

  useEffect(() => {
    const countAllFeatured = async () => {
      try {
        const count = await getCountOfFeaturedOpportunities(); // Sin parámetros
        setTotalFeaturedCount(count);
      } catch (err) {
        console.error("Error contando destacadas totales:", err);
      }
    };

    countAllFeatured();
  }, [opportunities]); // Recontar cada vez que cambian las oportunidades

  return (
    <div
      className={`rounded-lg shadow-md p-6 w-full h-full flex flex-col ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      {showOpportunityForm && (
        <OpportunityForm
          showOpportunityForm={showOpportunityForm}
          setShowOpportunityForm={setShowOpportunityForm}
          onSuccess={handleFormSubmit}
          onClose={handleFormClose}
          initialData={selectedOpportunity}
          isDark={isDark}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Gestión de Oportunidades
          <span className="ml-2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold">
            {opportunities.length} oportunidad
            {opportunities.length === 1 ? "" : "s"}
          </span>
        </h2>

        <div className="flex gap-3">
          {/* <Link
            to="/edutracker"
            className="bg-secondary-light hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center transition-colors"
          >
            Ir a Edutracker
          </Link> */}
          <button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
            onClick={() => setShowOpportunityForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Oportunidad
          </button>
        </div>
      </div>

      {/* Filtros de Oportunidades para el Administrador */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Filtro por Categoría */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <span
            className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Categoría
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`text-xs rounded-lg border px-3 py-2 outline-none transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-primary"
                : "bg-white border-gray-200 text-gray-700 focus:border-primary"
            }`}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Modalidad */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <span
            className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Modalidad
          </span>
          <select
            value={modalityFilter}
            onChange={(e) => {
              setModalityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`text-xs rounded-lg border px-3 py-2 outline-none transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-primary"
                : "bg-white border-gray-200 text-gray-700 focus:border-primary"
            }`}
          >
            <option value="all">Todas las modalidades</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="híbrida">Híbrida</option>
          </select>
        </div>

        {/* Filtro por Estado (Convocatoria) */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <span
            className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Estado Convocatoria
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`text-xs rounded-lg border px-3 py-2 outline-none transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-primary"
                : "bg-white border-gray-200 text-gray-700 focus:border-primary"
            }`}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="expired">Expirado</option>
          </select>
        </div>

        {/* Filtro por Visibilidad (Publicado / Borrador) */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <span
            className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Visibilidad
          </span>
          <select
            value={publishFilter}
            onChange={(e) => {
              setPublishFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`text-xs rounded-lg border px-3 py-2 outline-none transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-primary"
                : "bg-white border-gray-200 text-gray-700 focus:border-primary"
            }`}
          >
            <option value="all">Todas las visibilidades</option>
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
          </select>
        </div>

        {/* Filtro por Fecha de Publicación */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <span
            className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Fecha de Publicación
          </span>
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`text-xs rounded-lg border px-3 py-2 outline-none transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-primary"
                : "bg-white border-gray-200 text-gray-700 focus:border-primary"
            }`}
          >
            <option value="all">Cualquier fecha</option>
            <option value="today">Publicadas hoy</option>
            <option value="week">Publicadas esta semana</option>
            <option value="month">Publicadas este mes</option>
          </select>
        </div>

        {/* Filtro por Destacado */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <span
            className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Destacado
          </span>
          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`text-xs rounded-lg border px-3 py-2 outline-none transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-primary"
                : "bg-white border-gray-200 text-gray-700 focus:border-primary"
            }`}
          >
            <option value="all">Todas las oportunidades</option>
            <option value="featured">Destacadas</option>
            <option value="not_featured">No destacadas</option>
          </select>
        </div>

        {/* Botón Restablecer Filtros */}
        {(categoryFilter !== "all" ||
          modalityFilter !== "all" ||
          statusFilter !== "all" ||
          publishFilter !== "all" ||
          dateFilter !== "all" ||
          featuredFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setCategoryFilter("all");
              setModalityFilter("all");
              setStatusFilter("all");
              setPublishFilter("all");
              setDateFilter("all");
              setFeaturedFilter("all");
              setCurrentPage(1);
            }}
            className="self-end px-4 py-2 text-xs font-bold rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
          >
            Restablecer Filtros
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* {loading && (
          <InlineLoader message="Cargando oportunidades..." size="md" />
        )} */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Título
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Tipo
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Estado
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Visibilidad
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Fecha de cierre
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
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
              {opportunities.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className={`px-6 py-10 text-center text-lg ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No hay oportunidades
                  </td>
                </tr>
              ) : (
                opportunities.map((opportunity) => {
                  const deadlineDate = new Date(opportunity.deadline);
                  const isExpired = deadlineDate < new Date();
                  const formattedDeadline = deadlineDate.toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    },
                  );

                  return (
                    <tr
                      key={opportunity.id}
                      className={
                        isDark ? "hover:bg-gray-600" : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 border-b border-gray-100/5">
                        <div
                          className={`text-sm font-medium max-w-xs break-words ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {opportunity.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {opportunity.category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isExpired
                              ? isDark
                                ? "bg-red-900 text-red-200"
                                : "bg-red-100 text-red-800"
                              : isDark
                                ? "bg-green-900 text-green-200"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {isExpired ? "Expirado" : "Activo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            opportunity.is_published
                              ? isDark
                                ? "bg-blue-900/60 text-blue-200"
                                : "bg-blue-100 text-blue-800"
                              : isDark
                                ? "bg-amber-900/60 text-amber-200"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {opportunity.is_published ? "Publicado" : "Borrador"}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                          isDark ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {formattedDeadline}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <OpportunityActionsMenu
                          opportunity={opportunity}
                          setShowOpportunityForm={setShowOpportunityForm}
                          setSelectedOpportunity={setSelectedOpportunity}
                          fetchOpportunities={fetchOpportunities}
                          isDark={isDark}
                          featuredCount={totalFeaturedCount}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
