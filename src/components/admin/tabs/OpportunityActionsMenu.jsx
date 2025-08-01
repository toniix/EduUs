import React from "react";
import { useState } from "react";
import ModalConfirmacion from "../../ModalConfirmacion";
import { deleteOpportunity } from "../../../services/opportunityService";
import { toast } from "react-hot-toast";
import { Eye, Edit, Trash2 } from "lucide-react";

const OpportunityActionsMenu = ({
  opportunity,
  setShowOpportunityForm,
  setSelectedOpportunity,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (opportunity) => {
    console.log("Editing opportunity:", opportunity);
    // Ensure we have all required fields for the form
    const opportunityData = {
      ...opportunity,
      category: opportunity.category?.name || "",
      // tags: opportunity.tags?.map((tag) => tag.name) || [],
      // Format date for date inputs if needed
      deadline: opportunity.deadline
        ? new Date(opportunity.deadline).toISOString().split("T")[0]
        : "",
    };

    setSelectedOpportunity(opportunityData);
    console.log(opportunityData);
    setShowOpportunityForm(true);
  };
  const handleDeleteClick = (opportunity) => {
    setOpportunityToDelete(opportunity);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!opportunityToDelete) {
      return;
    }
    console.log("Deleting opportunity with ID:", opportunityToDelete.id);
    try {
      setIsDeleting(true);

      const result = await deleteOpportunity(opportunityToDelete.id);

      if (result && result.success) {
        console.log("Delete successful, refreshing opportunities list");
        toast.success("Oportunidad eliminada correctamente");
        await fetchOpportunities();
      } else {
        const errorMsg =
          result?.error || "Error desconocido al eliminar la oportunidad";
        console.error("Delete failed:", errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleDeleteConfirm:", error);
      toast.error(error.message || "Error al eliminar la oportunidad");
    } finally {
      console.log("Cleaning up delete state");
      setIsDeleting(false);
      setShowDeleteModal(false);
      setOpportunityToDelete(null);
    }
  };
  return (
    <>
      <div className="flex space-x-2">
        <button
          className="text-blue-600 hover:text-blue-900"
          title="Ver detalles"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          className="text-indigo-600 hover:text-indigo-900"
          title="Editar"
          onClick={() => handleEdit(opportunity)}
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          className="text-red-600 hover:text-red-900 disabled:opacity-50"
          title="Eliminar"
          onClick={() => handleDeleteClick(opportunity)}
          disabled={isDeleting}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <ModalConfirmacion
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Oportunidad"
        message={`¿Estás seguro de que deseas eliminar la oportunidad "${opportunityToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </>
  );
};

export default OpportunityActionsMenu;
