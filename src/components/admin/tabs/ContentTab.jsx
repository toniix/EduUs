import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import Pagination from "../../Pagination";
import OpportunityForm from "../OpportunityForm";
import { useState } from "react";

export default function ContentTab({
  paginatedContent,
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 pt-8">
      {showOpportunityForm && (
        <OpportunityForm
          showOpportunityForm={showOpportunityForm}
          setShowOpportunityForm={setShowOpportunityForm}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Contenido</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
          onClick={() => setShowOpportunityForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Contenido
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedContent.map((content) => (
              <tr
                key={content.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {content.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {content.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      content.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {content.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {content.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {content.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Eye className="h-4 w-4 text-blue-600 hover:text-blue-900" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Edit className="h-4 w-4 text-indigo-600 hover:text-indigo-900" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Trash2 className="h-4 w-4 text-red-600 hover:text-red-900" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
