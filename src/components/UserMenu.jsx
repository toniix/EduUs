import { useState, useEffect, useRef } from "react";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { userRole } = useRole();
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const userImage = user?.user_metadata?.avatar_url;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 hover:opacity-80"
      >
        {userImage ? (
          <img src={userImage} alt="Profile" className="w-8 h-8 rounded-full" />
        ) : (
          <User className="h-8 w-8 text-gray-500" />
        )}
        <span className="text-gray-700">{userName}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
          <Link
            to="/perfil"
            onClick={handleNavigation}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4 mr-2" />
            Mi Perfil
          </Link>
          {["admin", "editor"].includes(userRole) && (
            <Link
              to="/adminpanel"
              onClick={handleNavigation}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              Panel Admin
            </Link>
          )}
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
