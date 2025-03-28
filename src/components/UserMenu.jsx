import { useState } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 hover:opacity-80"
      >
        <img
          src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=crop&w=32&h=32&q=80"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-700">Juan Pérez</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
          <a
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4 mr-2" />
            Mi Perfil
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
