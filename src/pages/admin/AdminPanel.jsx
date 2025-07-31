import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../../components/admin/Sidebar";
import AdminPanelHeader from "../../components/admin/AdminPanelHeader";
import UsersTab from "../../components/admin/tabs/UsersTab";
import ContentTab from "../../components/admin/tabs/ContentTab";
import AnalyticsTab from "../../components/admin/tabs/AnalyticsTab";
import SettingsTab from "../../components/admin/tabs/SettingsTab";
import Dashboard from "../../components/admin/tabs/Dashboard";
import DesktopOnlyWrapper from "../../components/layouts/wrappers/DesktopOnlyWrapper";
import { paginate } from "../../utils/pagination";
import { mockContent } from "../../utils/mockData";
import { getAllProfiles } from "../../services/userService";
import InlineLoader from "../../components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 10;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Intentar recuperar la pestaña activa del localStorage
    const savedTab = localStorage.getItem("adminActiveTab");
    return savedTab || "dashboard";
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");

  // Guardar la pestaña activa en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  // Memoizar las funciones de manejo para evitar recreaciones innecesarias
  const handleUserRoleUpdate = useCallback((userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }, []);

  const handleUserDelete = useCallback((userId) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
  }, []);

  // Cargar usuarios solo cuando sea necesario
  useEffect(() => {
    // Solo cargar usuarios si estamos en la pestaña de usuarios
    if (activeTab !== "users" || users.length > 0) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      console.log("cargando usuarios...");
      setUsersError(null);
      try {
        const profiles = await getAllProfiles();
        setUsers(profiles);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setUsersError("Error al cargar usuarios. Intente de nuevo más tarde.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [activeTab, users.length]);

  // Memoizar usuarios filtrados para evitar recálculos innecesarios
  const filteredUsers = useMemo(
    () =>
      roleFilter === "all"
        ? users
        : users.filter((u) => u.role && u.role.toLowerCase() === roleFilter),
    [users, roleFilter]
  );

  // Memoizar la paginación de usuarios
  const { items: paginatedUsers, totalPages: totalPagesUsers } = useMemo(
    () => ({
      items: paginate(filteredUsers, currentPageUsers, ITEMS_PER_PAGE),
      totalPages: Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
    }),
    [filteredUsers, currentPageUsers]
  );

  // Memoizar el contenido filtrado
  const filteredContent = useMemo(
    () =>
      searchTerm
        ? mockContent.filter(
            (content) =>
              content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              content.author.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : mockContent,
    [searchTerm]
  );

  // Memoizar la paginación del contenido
  const { items: paginatedContent, totalPages } = useMemo(
    () => ({
      items: paginate(filteredContent, currentPage, ITEMS_PER_PAGE),
      totalPages: Math.ceil(filteredContent.length / ITEMS_PER_PAGE),
    }),
    [filteredContent, currentPage]
  );

  // Memoizar el contenido de la pestaña actual
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        if (usersError) return <div className="text-red-600">{usersError}</div>;
        return (
          <UsersTab
            users={paginatedUsers}
            totalPages={totalPagesUsers}
            currentPage={currentPageUsers}
            setCurrentPage={setCurrentPageUsers}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            onUserRoleUpdate={handleUserRoleUpdate}
            onUserDelete={handleUserDelete}
            loading={loadingUsers}
          />
        );
      case "content":
        return (
          <ContentTab
            filteredContent={filteredContent}
            paginatedContent={paginatedContent}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        );
      case "analytics":
        return <AnalyticsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <div>Pestaña no encontrada</div>;
    }
  }, [
    activeTab,
    usersError,
    paginatedUsers,
    totalPagesUsers,
    currentPageUsers,
    roleFilter,
    handleUserRoleUpdate,
    handleUserDelete,
    loadingUsers,
    filteredContent,
    paginatedContent,
    totalPages,
    currentPage,
  ]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <DesktopOnlyWrapper>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <AdminPanelHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          <main className="flex-1 p-4 pt-16 overflow-y-auto transition-all duration-300">
            <div className="w-full max-w-full mx-auto">
              <div className="transform hover:translate-y-[-2px] transition-all duration-300">
                {tabContent}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DesktopOnlyWrapper>
  );
};
export default AdminPanel;
