import { Plus } from "lucide-react";
import OpportunityForm from "../../opportunities/OpportunityForm";
import { useState } from "react";
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
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

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
    <div className="bg-white rounded-lg shadow-md p-6 pt-8 max-w-full overflow-x-auto">
      {showOpportunityForm && (
        <OpportunityForm
          showOpportunityForm={showOpportunityForm}
          setShowOpportunityForm={setShowOpportunityForm}
          onSuccess={handleFormSubmit}
          onClose={handleFormClose}
          initialData={selectedOpportunity}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Gestión de Oportunidades
          <span className="ml-2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold">
            {opportunities.length} oportunidad
            {opportunities.length === 1 ? "" : "s"}
          </span>
        </h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
          onClick={() => setShowOpportunityForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Oportunidad
        </button>
      </div>

      {loading && (
        <InlineLoader message="Cargando oportunidades..." size="md" />
      )}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {opportunity.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {opportunity.type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      opportunity.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {opportunity.status === "active" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {opportunity.creator?.full_name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* {opportunity.created_at
                    ? format(new Date(opportunity.created_at), "PP", {
                        locale: es,
                      })
                    : "N/A"} */}
                  {opportunity.created_at
                    ? new Date(opportunity.created_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <OpportunityActionsMenu
                    opportunity={opportunity}
                    setShowOpportunityForm={setShowOpportunityForm}
                    setSelectedOpportunity={setSelectedOpportunity}
                    fetchOpportunities={fetchOpportunities}
                  />
                </td>
              </tr>
            ))}
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
  );
}
