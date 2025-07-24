import { Search, Filter } from "lucide-react";

const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="fixed top-0 right-0 z-10 ml-64 w-[calc(100%-16rem)] bg-gray-100 p-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-3 rounded-xl shadow-lg">
        <h1 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
          Panel de Administración
        </h1>
        <div className="flex space-x-2">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-8 pr-2 py-1.5 w-full md:w-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-gray-100 p-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-300">
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
