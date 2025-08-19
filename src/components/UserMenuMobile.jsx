import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const UserMenuMobile = ({ onItemClick }) => {
  const { user, signOut, role } = useAuth();
  const navigate = useNavigate();
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const userImage = user?.user_metadata?.avatar_url;
  const handleLogout = async () => {
    await signOut();
    if (onItemClick) onItemClick();
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 px-2 py-2 bg-gray-50 rounded-lg mb-2">
        {userImage ? (
          <img
            src={userImage}
            alt="Profile"
            className="w-10 h-10 rounded-full border"
          />
        ) : (
          <User className="w-10 h-10 text-gray-400" />
        )}
        <div className="flex-1">
          <div className="font-semibold text-dark text-base line-clamp-1">
            {userName}
          </div>
          <div className="text-xs text-gray-500 line-clamp-1">
            {role || "Usuario"}
          </div>
        </div>
      </div>
      <Link
        to="/profile"
        onClick={onItemClick}
        className="flex items-center gap-2 px-4 py-3 rounded-lg text-dark hover:bg-gray-100 transition-colors"
      >
        <User className="w-5 h-5" /> Mi Perfil
      </Link>
      <Link
        to="/settings"
        onClick={onItemClick}
        className="flex items-center gap-2 px-4 py-3 rounded-lg text-dark hover:bg-gray-100 transition-colors"
      >
        <Settings className="w-5 h-5" /> Configuración
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" /> Cerrar sesión
      </button>
    </div>
  );
};

export default UserMenuMobile;
