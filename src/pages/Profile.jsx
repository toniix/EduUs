import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Buttom";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SectionLoader from "../components/ui/LoadingSpinner";
import { getRoleColor } from "../utils/getRoleColor";

const Profile = () => {
  const { user, role: userRole, loading } = useAuth();
  // const [editing, setEditing] = useState(false);
  // const [form, setForm] = useState({ full_name: "", email: "" });
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name;
  const userEmail = user?.email;

  const handleChange = (e) => {
    // setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleEdit = () => setEditing(true);
  // const handleCancel = () => {
  //   setEditing(false);
  //   setForm({ full_name: userName, email: userEmail });
  // };

  const handleSave = async () => {
    // Aquí deberías llamar a un servicio para actualizar el perfil
    // Por ahora, solo simula éxito
    // setForm({ ...form, full_name: userName });
    // setEditing(false);
    toast.success("Perfil actualizado");
  };

  if (loading) {
    return <SectionLoader message="Cargando datos de tu perfil..." />;
  }

  const roleColor = getRoleColor(userRole);
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
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-4xl text-primary">
            {userName?.charAt(0) || "U"}
          </div>
          <h2 className="text-2xl font-bold text-dark mb-1">{userName}</h2>
          <span className={roleColor}>
            {userRole === "admin" && "Administrador"}
            {userRole === "editor" && "Editor"}
            {userRole === "user" && "Usuario"}
          </span>
          <span className="text-gray-600 text-sm">{userEmail}</span>
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
              value={userName}
              onChange={handleChange}
              // disabled={!editing}
              required
            />
            <Input
              label="Correo electrónico"
              name="email"
              value={userEmail}
              disabled
            />
            <div className="flex gap-2 mt-4">
              {/* {!editing && ( */}
              <Button
                type="button"
                disabled={true}
                variante="primary"
                // onClick={handleEdit}
              >
                Editar
              </Button>
              {/* )} */}
              {/* {editing && (
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
              )} */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
