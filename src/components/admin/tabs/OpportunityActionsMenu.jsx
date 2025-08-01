import React from "react";
import { useState } from "react";
import ModalConfirmacion from "../../ModalConfirmacion";
import { deleteOpportunity } from "../../../services/opportunityService";
import { toast } from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const OpportunityActionsMenu = ({
  opportunity,
  setShowOpportunityForm,
  setSelectedOpportunity,
  fetchOpportunities,
}) => {
  const { role, user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (opportunity) => {
    const opportunityData = {
      ...opportunity,
      category: opportunity.category?.name || "",
      tags: opportunity.tags?.map((tag) => tag.name) || [],
      deadline: opportunity.deadline
        ? new Date(opportunity.deadline).toISOString().split("T")[0]
        : "",
    };

    setSelectedOpportunity(opportunityData);
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
    try {
      setIsDeleting(true);

      const result = await deleteOpportunity(opportunityToDelete.id, role);

      if (result && result.success) {
        toast.success("Oportunidad eliminada correctamente");
        await fetchOpportunities();
      } else {
        const errorMsg =
          result?.error || "Error desconocido al eliminar la oportunidad";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error(error.message || "Error al eliminar la oportunidad");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setOpportunityToDelete(null);
    }
  };
  return (
    <>
      <div className="flex space-x-2">
        <button
          className="text-indigo-600 hover:text-indigo-900"
          title="Editar"
          onClick={() => handleEdit(opportunity)}
          disabled={user.id !== opportunity.created_by}
        >
          <Edit
            className={`h-4 w-4 ${
              user.id !== opportunity.created_by
                ? "text-gray-400"
                : "text-indigo-600 hover:text-indigo-900"
            }`}
          />
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
