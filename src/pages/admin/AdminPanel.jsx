import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/AdminPanelHeader";
import UsersTab from "../../components/admin/tabs/UsersTab";
import ContentTab from "../../components/admin/tabs/ContentTab";
import AnalyticsTab from "../../components/admin/tabs/AnalyticsTab";
import SettingsTab from "../../components/admin/tabs/SettingsTab";
import Dashboard from "../../components/admin/Dashboard";
import { mockUsers, mockContent } from "../../utils/mockData";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginateContent = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const filteredContent = searchTerm
    ? mockContent.filter(
        (content) =>
          content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockContent;

  const paginatedContent = paginateContent(filteredContent);
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UsersTab users={mockUsers} />;
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
          {" "}
          {/* Ajustar el margen según el ancho del sidebar */}
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
