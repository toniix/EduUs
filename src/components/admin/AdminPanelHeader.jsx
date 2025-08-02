import { Search, Bell, User, ChevronDown, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRole } from "../../contexts/RoleContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const AdminPanelHeader = ({
  searchTerm,
  handleSearch,
  isSidebarCollapsed,
  activeTab,
  setSearchTerm,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleDarkMode } = useTheme();
  const { userRole } = useRole();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("Cerrando sesión...");
      await signOut();
      console.log("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const headerClasses = `fixed top-0 right-0 left-0 z-10 transition-all duration-300 ${
    isSidebarCollapsed ? "ml-20" : "ml-64"
  } ${isDark ? "bg-gray-900" : "bg-gray-100"}`;

  const inputClasses = `w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400 ${
    isDark
      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:bg-gray-700"
      : "bg-gray-50/80 border-gray-400/50 text-gray-800 placeholder-gray-100 focus:bg-white"
  }`;

  return (
    <header className={headerClasses}>
      <div className="px-6 py-4 w-full flex items-center justify-between">
        {/* Barra de búsqueda */}
        {activeTab === "users" || activeTab === "content" ? (
          <div className="relative w-80">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            />
            <input
              type="text"
              placeholder="Buscar en el panel..."
              className={inputClasses}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {isDark
                ? "Bienvenido al panel de administración"
                : "Bienvenido al panel de administración"}
            </h1>
          </div>
        )}
        {/* Acciones del usuario */}
        <div className="flex items-center space-x-4">
          {/* Botón de notificaciones */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Selector de tema (opcional) */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors ${
              isDark
                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
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
              <span
                className={`text-sm font-medium text-gray-700 ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {userRole}
              </span>
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
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminPanelHeader;
