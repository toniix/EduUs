import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import ModalConfirmacion from "../../ModalConfirmacion";
import { updateUserRole } from "../../../services/rolesService";
import { deleteUser } from "../../../services/userService";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

export default function UserActionsMenu({
  user,
  onUserUpdated,
  onUserDeleted,
}) {
  const { user: currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "role" o "delete"
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async () => {
    setLoading(true);
    try {
      await updateUserRole(user.id, selectedRole);
      setModalOpen(false);
      onUserUpdated && onUserUpdated(selectedRole);
      toast.success("Rol actualizado correctamente");
    } catch (err) {
      toast.error("Error al cambiar el rol: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (user.id === currentUser.id) {
        toast.error("No puedes eliminar tu propio usuario.");
        setLoading(false);
        setModalOpen(false);
        return;
      }
      await deleteUser(user.id);
      toast.success("Usuario eliminado correctamente");
      setModalOpen(false);
      onUserDeleted && onUserDeleted(user.id);
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      toast.error("Error al eliminar usuario");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex space-x-2">
      {/* Cambiar rol */}
      <button
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        onClick={() => {
          setModalType("role");
          setModalOpen(true);
        }}
        title="Cambiar rol"
      >
        <Edit className="h-4 w-4 text-indigo-600 hover:text-indigo-900" />
      </button>
      {/* Eliminar usuario */}
      <button
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        onClick={() => {
          setModalType("delete");
          setModalOpen(true);
        }}
        title={
          user.id === currentUser.id
            ? "No puedes eliminarte a ti mismo"
            : "Eliminar usuario"
        }
        disabled={user.id === currentUser.id}
      >
        <Trash2
          className={`h-4 w-4 ${
            user.id === currentUser.id
              ? "text-gray-400"
              : "text-red-600 hover:text-red-900"
          }`}
        />
      </button>

      {/* Modal para cambiar rol */}
      <ModalConfirmacion
        open={modalOpen && modalType === "role"}
        title={`Cambiar rol de ${user.full_name || user.email}`}
        message={
          <>
            <div className="mb-2">Selecciona el nuevo rol:</div>
            <select
              className="w-full border rounded px-3 py-2 mt-1"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
            >
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
              <option value="user">Usuario</option>
            </select>
          </>
        }
        onCancel={() => setModalOpen(false)}
        onConfirm={handleRoleChange}
        confirmText={loading ? "Cambiando..." : "Cambiar rol"}
        cancelText="Cancelar"
      />
      {/* Modal para eliminar usuario */}
      <ModalConfirmacion
        open={modalOpen && modalType === "delete"}
        title={`Eliminar usuario`}
        message={
          <>
            ¿Estás seguro de que deseas eliminar a{" "}
            <span className="font-bold">{user.full_name || user.email}</span>?
            Esta acción no se puede deshacer.
          </>
        }
        onCancel={() => setModalOpen(false)}
        onConfirm={handleDelete}
        confirmText={loading ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
      />
    </div>
  );
}
