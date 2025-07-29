import {
  Users,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const menuItems = [
  { icon: <Home />, label: "Dashboard", value: "dashboard" },
  { icon: <Users />, label: "Usuarios", value: "users" },
  { icon: <FileText />, label: "Contenido", value: "content" },
  { icon: <BarChart2 />, label: "Analíticas", value: "analytics" },
  { icon: <Settings />, label: "Configuración", value: "settings" },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("Cerrando sesión...");
      await signOut();
      console.log("Sesión cerrada");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleItemClick = (item) => {
    setActiveTab(item.value);
  };

  const handleExpandClick = (e, itemValue) => {
    e.stopPropagation(); // Previene que se active el handleItemClick del padre
    setExpandedItem(expandedItem === itemValue ? null : itemValue);
  };

  return (
    <div
      className={`fixed left-0 h-screen bg-white shadow-xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo y botón de colapsar */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center">
            <img src="/logo.svg" alt="EDU-US" className="h-8 w-8" />
            <span className="ml-2 font-bold text-xl text-primary">EDU-US</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Menú principal */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.value}>
            <button
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab.startsWith(item.value)
                  ? "bg-primary text-white shadow-md hover:shadow-lg"
                  : "hover:bg-gray-50 text-gray-700 hover:text-primary"
              }`}
            >
              <div className="flex items-center">
                <span
                  className={`h-5 w-5 ${
                    activeTab.startsWith(item.value) ? "transform rotate-6" : ""
                  }`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </div>
            </button>
          </div>
        ))}
      </nav>

      {/* Acciones de navegación y logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className="space-y-2">
          <button
            onClick={() => navigate("/")}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "justify-start"
            } px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-300`}
          >
            <Home className="h-5 w-5" />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Ir al Inicio</span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "justify-start"
            } px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && (
              <span className="ml-3 font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
