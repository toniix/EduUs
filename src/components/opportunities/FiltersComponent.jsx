import { Check } from "lucide-react";

const FiltersComponent = ({
  onFilterChange,
  filterOptions = {},
  clearFilters,
  localFilters,
  setLocalFilters,
}) => {
  const { modalities = [], locations = [], categories = [] } = filterOptions;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => value !== "")
    );
    onFilterChange(cleanFilters);
  };

  const handleFilterReset = () => {
    setLocalFilters({
      type: "",
      modality: "",
      location: "",
      category_id: "",
    });
    clearFilters();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <button
          type="button"
          onClick={handleFilterReset}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      <form onSubmit={handleFilterSubmit} className="space-y-4">
        {/* Filtro por categoria*/}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            name="category_id"
            value={localFilters.category_id || ""}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Todas las categorías</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por modalidad */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Modalidad
          </label>
          <select
            name="modality"
            value={localFilters.modality}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Todas las modalidades</option>
            {modalities.map((modality) => (
              <option key={modality} value={modality}>
                {modality.charAt(0).toUpperCase() + modality.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por ubicación */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ubicación
          </label>
          <select
            name="location"
            value={localFilters.location}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Todas las ubicaciones</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location.charAt(0).toUpperCase() + location.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Botón de aplicar filtros */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            <Check className="h-4 w-4 mr-2" />
            Aplicar filtros
          </button>
        </div>
      </form>
    </div>
  );
};

export default FiltersComponent;
