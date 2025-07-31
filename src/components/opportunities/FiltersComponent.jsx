import { useState } from "react";

const FiltersComponent = ({ onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({
    search: "",
    category_id: "",
    type: "",
    location: "",
  });

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => value !== "")
    );
    onFilterChange(cleanFilters);
  };

  const handleFilterReset = () => {
    setLocalFilters({
      search: "",
      category_id: "",
      type: "",
      location: "",
    });
    onFilterChange({});
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>

      <form onSubmit={handleFilterSubmit} className="space-y-4">
        {/* Filtro por tipo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de oportunidad
          </label>
          <select
            value={localFilters.type}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                type: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Todos los tipos</option>
            <option value="remote">Remoto</option>
            <option value="onsite">Presencial</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>

        {/* Filtro por ubicación */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Escribe una ubicación..."
            value={localFilters.location}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                location: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-300"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={handleFilterReset}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FiltersComponent;
