import { Search, X } from "lucide-react";
import PropTypes from "prop-types";

export default function SearchHeader({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  loading,
  onClearSearch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          className="block w-full py-3.5 pl-4 pr-24 text-base border border-slate-200 rounded-2xl 
                   bg-white shadow-sm transition-all duration-300
                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                   hover:border-slate-300"
          placeholder="Buscar oportunidades por título, descripción..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={loading}
        />
        <div className="absolute right-2.5 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={onClearSearch}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 bg-transparent text-slate-400 hover:text-primary hover:bg-primary/5 active:scale-90 transition-all duration-200 rounded-full"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </form>
  );
}

SearchHeader.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onClearSearch: PropTypes.func.isRequired,
};
