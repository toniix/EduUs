import { Search } from "lucide-react";

export default function SearchHeader({ searchTerm, onSearchChange, loading }) {
  return (
    <div className="relative mb-8 max-w-xl mx-auto transform transition-all duration-300 hover:scale-[1.02]">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-primary" />
      </div>
      <input
        type="text"
        className="block w-full p-3 pl-10 text-base border-2 border-gray-200 rounded-xl 
                 bg-white shadow-sm transition-all duration-300
                 focus:ring-4 focus:ring-primary/20 focus:border-primary
                 hover:border-primary/50"
        placeholder="Buscar oportunidades por título, descripción o etiquetas..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        disabled={loading}
      />
    </div>
  );
}
