import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/AdminPanelHeader";
import UsersTab from "../../components/admin/tabs/UsersTab";
import ContentTab from "../../components/admin/tabs/ContentTab";
import AnalyticsTab from "../../components/admin/tabs/AnalyticsTab";
import SettingsTab from "../../components/admin/tabs/SettingsTab";
import Dashboard from "../../components/admin/tabs/Dashboard";
import { paginate } from "../../utils/pagination";
import { mockContent } from "../../utils/mockData";
import { getAllProfiles } from "../../services/userService";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const itemsPerPage = 10;

  // --- NUEVO: Actualización reactiva de usuarios ---
  const handleUserRoleUpdate = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleUserDelete = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
  };

  // --- FIN: Actualización reactiva de usuarios ---

  // --- NUEVO: Cargar usuarios ---
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setUsersError(null);
      try {
        const profiles = await getAllProfiles();
        setUsers(profiles);
      } catch (err) {
        setUsersError("Error al cargar usuarios");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Paginación para usuarios
  const [roleFilter, setRoleFilter] = useState("all");
  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((u) => u.role && u.role.toLowerCase() === roleFilter);
  const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = paginate(
    filteredUsers,
    currentPageUsers,
    itemsPerPage
  );

  const filteredContent = searchTerm
    ? mockContent.filter(
        (content) =>
          content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockContent;

  const paginatedContent = paginate(filteredContent, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  const renderTabContent = () => {
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
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 ml-64 p-8">
          <div className="mb-6">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
