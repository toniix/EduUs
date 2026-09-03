import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
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
import { useAuth } from "../../contexts/AuthContext";
import { categoryService } from "../../services/categoryService";
import CategoriesTab from "../../components/admin/tabs/CategoriesTab";
import EventsAdminTab from "../../components/admin/tabs/EventsAdminTab";
import RegistrationsTab from "../../components/admin/tabs/RegistrationsTab";
import ProjectsTab from "../../components/admin/tabs/ProjectsTab";

const ITEMS_PER_PAGE = 10;

const AdminPanel = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

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

  // Filtros de administración para oportunidades
  const [adminCategoryFilter, setAdminCategoryFilter] = useState("all");
  const [adminModalityFilter, setAdminModalityFilter] = useState("all");
  const [adminStatusFilter, setAdminStatusFilter] = useState("all");
  const [adminPublishFilter, setAdminPublishFilter] = useState("all");
  const [adminDateFilter, setAdminDateFilter] = useState("all");
  const [adminFeaturedFilter, setAdminFeaturedFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  // Cargar categorías para los filtros
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar categorías en panel de admin:", err);
      }
    };
    fetchCategories();
  }, []);

  // Guardar la pestaña activa en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  // Memoizar las funciones de manejo para evitar recreaciones innecesarias
  const handleUserRoleUpdate = useCallback((userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
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
    [users, roleFilter],
  );

  // Memoizar la paginación de usuarios
  const { items: paginatedUsers, totalPages: totalPagesUsers } = useMemo(
    () => ({
      items: paginate(filteredUsers, currentPageUsers, ITEMS_PER_PAGE),
      totalPages: Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
    }),
    [filteredUsers, currentPageUsers],
  );

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoadingOpportunities(true);
      const data = await opportunitiesService.getAllOpportunities();
      setOpportunities(data);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      setOpportunitiesError(
        "Error al cargar las oportunidades. Por favor, intente de nuevo.",
      );
      toast.error("Error al cargar las oportunidades");
    } finally {
      setLoadingOpportunities(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "content" || opportunities.length > 0) return;
    fetchOpportunities();
  }, [activeTab, opportunities.length, fetchOpportunities]);

  // Memoizar el contenido filtrado
  const filteredOpportunities = useMemo(() => {
    let result = opportunities;

    // Filtrar por creador si el rol es editor
    if (profile?.role === "editor") {
      result = result.filter((opp) => opp.created_by === profile.id);
    }

    // Búsqueda por texto (título)
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((opp) =>
        opp.title.toLowerCase().includes(searchLower),
      );
    }

    // Filtro por Categoría
    if (adminCategoryFilter !== "all") {
      result = result.filter(
        (opp) => opp.category_id === Number(adminCategoryFilter),
      );
    }

    // Filtro por Modalidad
    if (adminModalityFilter !== "all") {
      result = result.filter((opp) => opp.modality === adminModalityFilter);
    }

    // Filtro por Estado (Convocatoria activa vs expirada)
    if (adminStatusFilter !== "all") {
      const today = new Date();
      result = result.filter((opp) => {
        const isExpired = new Date(opp.deadline) < today;
        return adminStatusFilter === "expired" ? isExpired : !isExpired;
      });
    }

    // Filtro por Visibilidad (Publicado vs Borrador)
    if (adminPublishFilter !== "all") {
      result = result.filter((opp) => {
        const isPublished = opp.is_published;
        return adminPublishFilter === "published" ? isPublished : !isPublished;
      });
    }

    // Filtro por Fecha de Publicación (Creación)
    if (adminDateFilter !== "all") {
      const now = new Date();
      result = result.filter((opp) => {
        if (!opp.created_at) return false;
        const createdDate = new Date(opp.created_at);

        if (adminDateFilter === "today") {
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);
          return createdDate >= startOfToday;
        }
        if (adminDateFilter === "week") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setHours(0, 0, 0, 0);
          sevenDaysAgo.setDate(now.getDate() - 7);
          return createdDate >= sevenDaysAgo;
        }
        if (adminDateFilter === "month") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setHours(0, 0, 0, 0);
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return createdDate >= thirtyDaysAgo;
        }
        return true;
      });
    }

    // Filtro por Destacado
    if (adminFeaturedFilter !== "all") {
      const isFeatured = adminFeaturedFilter === "featured";
      result = result.filter((opp) => opp.is_featured === isFeatured);
    }

    return result;
  }, [
    opportunities,
    searchTerm,
    adminCategoryFilter,
    adminModalityFilter,
    adminStatusFilter,
    adminPublishFilter,
    adminDateFilter,
    adminFeaturedFilter,
  ]);

  // Memoizar la paginación de oportunidades
  const { items: paginatedOpportunities, totalPages } = useMemo(
    () => ({
      items: paginate(filteredOpportunities, currentPage, ITEMS_PER_PAGE),
      totalPages: Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE),
    }),
    [filteredOpportunities, currentPage],
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
        if (!isAdmin)
          return (
            <div className="p-6 text-red-500 font-bold">Acceso Denegado</div>
          );
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
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            loading={loadingOpportunities}
            error={opportunitiesError}
            fetchOpportunities={fetchOpportunities}
            categories={categories}
            categoryFilter={adminCategoryFilter}
            setCategoryFilter={setAdminCategoryFilter}
            modalityFilter={adminModalityFilter}
            setModalityFilter={setAdminModalityFilter}
            statusFilter={adminStatusFilter}
            setStatusFilter={setAdminStatusFilter}
            publishFilter={adminPublishFilter}
            setPublishFilter={setAdminPublishFilter}
            dateFilter={adminDateFilter}
            setDateFilter={setAdminDateFilter}
            featuredFilter={adminFeaturedFilter}
            setFeaturedFilter={setAdminFeaturedFilter}
          />
        );
      case "categories":
        return <CategoriesTab />;
      case "events":
        return <EventsAdminTab />;
      case "registrations":
        if (!isAdmin)
          return (
            <div className="p-6 text-red-500 font-bold">Acceso Denegado</div>
          );
        return <RegistrationsTab />;
      case "projects":
        if (!isAdmin)
          return (
            <div className="p-6 text-red-500 font-bold">Acceso Denegado</div>
          );
        return <ProjectsTab />;
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
    isAdmin,
    loadingOpportunities,
    opportunitiesError,
    fetchOpportunities,
    categories,
    adminCategoryFilter,
    adminModalityFilter,
    adminStatusFilter,
    adminPublishFilter,
    adminDateFilter,
    adminFeaturedFilter,
  ]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <DesktopOnlyWrapper>
      <div
        className={`flex h-screen ${
          isDark ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
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
