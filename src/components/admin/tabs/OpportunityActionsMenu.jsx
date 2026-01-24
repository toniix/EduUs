import { useState, useContext } from "react";
import ModalConfirmacion from "../../ModalConfirmacion";
import { deleteOpportunity } from "../../../services/opportunityService";
import { toast } from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { ThemeContext } from "../../../contexts/ThemeContext";
import DeletionLoader from "../../ui/DeletionLoader";

const OpportunityActionsMenu = ({
  opportunity,
  setShowOpportunityForm,
  setSelectedOpportunity,
  fetchOpportunities,
}) => {
  const { profile } = useAuth();
  const { isDark } = useContext(ThemeContext);
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

      const result = await deleteOpportunity(
        opportunityToDelete.id,
        profile?.role,
      );

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

  const getButtonClasses = (isDisabled, isDelete = false) => {
    const baseClasses = "flex items-center justify-center p-1 rounded";
    const sizeClasses = "h-6 w-6";

    if (isDisabled) {
      return `${baseClasses} ${sizeClasses} ${
        isDark ? "text-secondary" : "text-gray-400"
      } cursor-not-allowed`;
    }

    if (isDelete) {
      return `${baseClasses} ${sizeClasses} ${
        isDark
          ? "text-red-400 hover:bg-red-900/50 hover:text-red-300"
          : "text-red-600 hover:bg-red-50 hover:text-red-800"
      }`;
    }

    return `${baseClasses} ${sizeClasses} ${
      isDark
        ? "text-indigo-400 hover:bg-gray-700 hover:text-indigo-300"
        : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800"
    }`;
  };

  const isOwner = profile?.id === opportunity.created_by;
  const editButtonClasses = getButtonClasses(!isOwner);
  const deleteButtonClasses = getButtonClasses(isDeleting, true);

  if (isDeleting) {
    return (
      <DeletionLoader
        isDeleting={isDeleting}
        message="Eliminando oportunidad..."
        variant="danger"
      />
    );
  }

  return (
    <div className="flex space-x-2">
      <button
        className={editButtonClasses}
        title="Editar"
        onClick={() => handleEdit(opportunity)}
        disabled={!isOwner}
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        className={deleteButtonClasses}
        title="Eliminar"
        onClick={() => handleDeleteClick(opportunity)}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <ModalConfirmacion
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Oportunidad"
        message={
          <>
            ¿Estás seguro de que deseas eliminar la oportunidad{" "}
            <span className="font-bold">"{opportunityToDelete?.title}"</span>?
            Esta acción no se puede deshacer.
          </>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default OpportunityActionsMenu;
