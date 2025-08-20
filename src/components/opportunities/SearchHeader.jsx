import { Search, X } from "lucide-react";

export default function SearchHeader({
  searchTerm,
  onSearchChange,
  loading,
  onClearSearch,
}) {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-primary" />
        </div>
        <input
          type="text"
          className="block w-full p-3 pl-10 pr-10 text-base border-2 border-gray-200 rounded-xl 
                   bg-white shadow-sm transition-all duration-300
                   focus:ring-4 focus:ring-primary/20 focus:border-primary
                   hover:border-primary/50"
          placeholder="Buscar oportunidades por título, descripción o etiquetas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={loading}
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
}
