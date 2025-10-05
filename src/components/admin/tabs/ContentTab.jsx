import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import OpportunityForm from "../../opportunities/OpportunityForm";
import { useState, useContext } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import {
  updateOpportunity,
  createOpportunity,
} from "../../../services/opportunityService";
import InlineLoader from "../../ui/LoadingSpinner";
import { toast } from "react-hot-toast";
import OpportunityActionsMenu from "../../admin/tabs/OpportunityActionsMenu";
import Pagination from "../../Pagination2";

export default function ContentTab({
  opportunities,
  currentPage,
  setCurrentPage,
  totalPages,
  loading,
  fetchOpportunities,
}) {
  const { isDark } = useContext(ThemeContext);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // console.log(opportunities);
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedOpportunity?.id) {
        const { success, error } = await updateOpportunity(
          selectedOpportunity.id,
          formData
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
          <Link
            to="/edutracker"
            className="bg-secondary-light hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center transition-colors"
          >
            Ir a Edutracker
          </Link>
          <button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
            onClick={() => setShowOpportunityForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        {loading && (
          <InlineLoader message="Cargando oportunidades..." size="md" />
        )}
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
                    colSpan={5}
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
                    }
                  );

                  return (
                    <tr
                      key={opportunity.id}
                      className={
                        isDark ? "hover:bg-gray-600" : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div
                          className={`text-sm font-medium ${
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
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
