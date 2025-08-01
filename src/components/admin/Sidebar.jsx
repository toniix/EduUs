import {
  Users,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo_1.png";

const menuItems = [
  { icon: <Home />, label: "Dashboard", value: "dashboard" },
  { icon: <Users />, label: "Usuarios", value: "users" },
  { icon: <FileText />, label: "Contenido", value: "content" },
  { icon: <BarChart2 />, label: "Analíticas", value: "analytics" },
  { icon: <Settings />, label: "Configuración", value: "settings" },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleItemClick = (item) => {
    setActiveTab(item.value);
  };

  return (
    <aside
      className={`fixed left-0 h-screen bg-white shadow-xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo y botón de colapsar */}
      {/* Header mejorado */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="EDU-US"
            className="h-10 w-10 rounded-full shadow"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              {/* <span className="font-bold text-lg text-primary">EDU-US</span> */}
              {user && (
                <span className="text-xs text-gray-600">
                  Bienvenido,{" "}
                  <span className="font-semibold">
                    {user.user_metadata.full_name ||
                      user.user_metadata.name ||
                      user.email}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
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
              <span className="ml-3 font-medium">Salir al Inicio</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
