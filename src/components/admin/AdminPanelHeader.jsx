import { Search, Bell, User, ChevronDown, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { useTheme } from "../../contexts/ThemeContext"; // Si tienes un contexto de tema

const AdminPanelHeader = ({
  searchTerm,
  setSearchTerm,
  isSidebarCollapsed,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // const { theme, toggleTheme } = useTheme(); // Descomenta si tienes tema oscuro

  return (
    <header
      className={`fixed top-0 right-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 h-[77px] flex items-center ${
        isSidebarCollapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="px-6 py-3 w-full flex items-center justify-between">
        {/* Barra de búsqueda */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en el panel..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Acciones del usuario */}
        <div className="flex items-center space-x-4">
          {/* Botón de notificaciones */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Selector de tema (opcional) */}
          <button
            // onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Sun className="h-5 w-5" />
            {/* Alternar entre <Sun /> y <Moon /> según el tema */}
          </button>

          {/* Perfil del usuario */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 group"
            >
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  isProfileOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {/* Menú desplegable del perfil */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                <Link
                  to="/profile"
                  // onClick={handleNavigation}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </Link>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Configuración
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminPanelHeader;
