import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../../components/admin/Sidebar";
import AdminPanelHeader from "../../components/admin/AdminPanelHeader";
import UsersTab from "../../components/admin/tabs/UsersTab";
import ContentTab from "../../components/admin/tabs/ContentTab";
import DashboardTab from "../../components/admin/tabs/DashboardTab";
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
        return <DashboardTab />;
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

  return (
    <DesktopOnlyWrapper>
      <div
        className={`flex h-screen ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Sidebar - Fuera del contenedor principal */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Contenedor principal con scroll controlado */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header fijo */}
          <AdminPanelHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            activeTab={activeTab}
          />

          {/* Área de contenido con scroll */}
          <main
            className={`flex-1 overflow-auto transition-all duration-300 pt-16 ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
            style={{
              marginLeft: isSidebarCollapsed ? "5rem" : "16rem",
            }}
          >
            <div className="w-full mx-auto ">{tabContent}</div>
          </main>
        </div>
      </div>
    </DesktopOnlyWrapper>
  );
};
export default AdminPanel;
