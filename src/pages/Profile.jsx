import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "../services/rolesService";
import { signOut } from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Buttom";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/RoleProvider";

const Profile = () => {
  const { user, signOut: signOutContext } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userRole } = useRole();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getCurrentUserProfile();
        setProfile(data);
        setForm({ full_name: data.full_name || "", email: data.email || "" });
      } catch (e) {
        toast.error("Error cargando perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setForm({ full_name: profile.full_name, email: profile.email });
  };

  const handleSave = async () => {
    // Aquí deberías llamar a un servicio para actualizar el perfil
    // Por ahora, solo simula éxito
    setProfile({ ...profile, full_name: form.full_name });
    setEditing(false);
    toast.success("Perfil actualizado");
  };

  const handleSignOut = async () => {
    await signOut();
    if (signOutContext) signOutContext();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-light pt-16">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8 relative">
        <div
          className="absolute left-4 top-4 flex items-center gap-1 cursor-pointer text-primary hover:text-secondary font-semibold text-base transition-colors"
          onClick={() => navigate(-1)}
          title="Volver"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver
        </div>
        <div className="flex flex-col items-center mb-8">
          {/* Espacio para futura foto de perfil */}
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-4xl text-primary">
            {profile.full_name?.charAt(0) || "U"}
          </div>
          <h2 className="text-2xl font-bold text-dark mb-1">
            {profile.full_name}
          </h2>
          <span className="text-primary font-semibold capitalize mb-2">
            {userRole === "admin" && "Administrador"}
            {userRole === "editor" && "Editor"}
            {userRole === "user" && "Usuario"}
          </span>
          <span className="text-gray-600 text-sm">{profile.email}</span>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-dark mb-2">
            Información del perfil
          </h3>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Input
              label="Nombre completo"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              disabled={!editing}
              required
            />
            <Input
              label="Correo electrónico"
              name="email"
              value={form.email}
              disabled
            />
            <div className="flex gap-2 mt-4">
              {!editing && (
                <Button type="button" variante="primary" onClick={handleEdit}>
                  Editar
                </Button>
              )}
              {editing && (
                <>
                  <Button type="submit" variante="primary">
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    variante="secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-dark mb-2">Seguridad</h3>
          <Button variante="secondary" className="w-full mb-2" disabled>
            Cambiar contraseña (próximamente)
          </Button>
        </div>

        <div className="flex justify-end">
          <Button variante="danger" onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
