import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../../components/admin/Sidebar";
import AdminPanelHeader from "../../components/admin/AdminPanelHeader";
import UsersTab from "../../components/admin/tabs/UsersTab";
import ContentTab from "../../components/admin/tabs/ContentTab";
import AnalyticsTab from "../../components/admin/tabs/AnalyticsTab";
import Dashboard from "../../components/admin/tabs/Dashboard";
import DesktopOnlyWrapper from "../../components/layouts/wrappers/DesktopOnlyWrapper";
import { paginate } from "../../utils/pagination";
import { getAllProfiles } from "../../services/userService";
import { opportunitiesService } from "../../services/fetchOpportunityService";
import { useTheme } from "../../contexts/ThemeContext";
import CategoriesTab from "../../components/admin/tabs/CategoriesTab";

const ITEMS_PER_PAGE = 10;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(() => {
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
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [opportunitiesError, setOpportunitiesError] = useState(null);
  const { isDark } = useTheme();

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

  const fetchOpportunities = async () => {
    try {
      setLoadingOpportunities(true);
      const data = await opportunitiesService.getAllOpportunities();
      setOpportunities(data);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      setOpportunitiesError(
        "Error al cargar las oportunidades. Por favor, intente de nuevo."
      );
      toast.error("Error al cargar las oportunidades");
    } finally {
      setLoadingOpportunities(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "content" || opportunities.length > 0) return;
    fetchOpportunities();
  }, [activeTab, opportunities.length]);

  const searchOpportunities = useCallback((term, opportunitiesList) => {
    if (!term || term.trim() === "") return opportunitiesList;

    const searchLower = term.toLowerCase();
    return opportunitiesList.filter(
      (opp) => opp.title.toLowerCase().includes(searchLower)
      // opp.location.toLowerCase().includes(searchLower) ||
      // opp.tags?.some((tag) => tag.name.toLowerCase().includes(searchLower))
    );
  }, []);
  // Memoizar el contenido filtrado
  const filteredOpportunities = useMemo(
    () => searchOpportunities(searchTerm, opportunities),
    [searchTerm, opportunities, searchOpportunities]
  );

  // Memoizar la paginación de oportunidades
  const { items: paginatedOpportunities, totalPages } = useMemo(
    () => ({
      items: paginate(filteredOpportunities, currentPage, ITEMS_PER_PAGE),
      totalPages: Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE),
    }),
    [filteredOpportunities, currentPage]
  );

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    // Resetear a la primera página al buscar
    setCurrentPage(1);
  }, []);

  // console.log(paginatedOpportunities);
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
        if (opportunitiesError)
          return <div className="text-red-600">{opportunitiesError}</div>;
        return (
          <ContentTab
            opportunities={paginatedOpportunities}
            // filteredContent={filteredContent}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            loading={loadingOpportunities}
            error={opportunitiesError}
            fetchOpportunities={fetchOpportunities}
          />
        );
      case "analytics":
        return <AnalyticsTab />;
      case "categories":
        return <CategoriesTab />;
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
    paginatedOpportunities,
    totalPages,
    currentPage,
  ]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Clases para el tema oscuro solo en el panel de administración
  const adminPanelClasses = `flex h-screen transition-colors duration-200`;
  const mainContentClasses = `flex-1 flex flex-col min-h-0 overflow-y-auto`;

  return (
    <DesktopOnlyWrapper>
      <div
        className={`${adminPanelClasses} ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className={mainContentClasses}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          <div className="flex-1 flex flex-col transition-all duration-300">
            <AdminPanelHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              isSidebarCollapsed={isSidebarCollapsed}
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
              activeTab={activeTab}
            />

            <main
              className={`flex-1 pt-16 overflow-y-auto transition-all duration-300 ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
              style={{
                marginLeft: isSidebarCollapsed ? "5rem" : "16rem",
                transition: "margin-left 0.3s ease-in-out",
              }}
            >
              <div className="w-full max-w-full mx-auto px-4 h-full flex flex-col">
                <div className="flex-1 min-h-0">{tabContent}</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </DesktopOnlyWrapper>
  );
};
export default AdminPanel;
