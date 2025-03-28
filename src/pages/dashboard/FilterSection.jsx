import { useState } from "react";
import { Check, ChevronDown, Filter } from "lucide-react";

const typeOptions = [
  { value: "scholarship", label: "Becas" },
  { value: "workshop", label: "Talleres" },
  { value: "exchange", label: "Intercambios" },
  { value: "volunteer", label: "Voluntariados" },
  { value: "internship", label: "Pasantías" },
];

export default function FilterSection({
  onTypeFilter,
  onLocationFilter,
  locations,
  selectedTypes,
  selectedLocations,
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleTypeChange = (type) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    onTypeFilter(updatedTypes);
  };

  const handleLocationChange = (location) => {
    const updatedLocations = selectedLocations.includes(location)
      ? selectedLocations.filter((l) => l !== location)
      : [...selectedLocations, location];

    onLocationFilter(updatedLocations);
  };

  const clearFilters = () => {
    onTypeFilter([]);
    onLocationFilter([]);
  };

  const hasActiveFilters =
    selectedTypes.length > 0 || selectedLocations.length > 0;

  return (
    <div className="w-full md:w-64 bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros
        </h2>

        {/* Botón para móviles */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-md text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className={`${!isOpen && "hidden md:block"}`}>
        {/* Filtro por tipo */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-sm text-gray-700">
            Tipo de oportunidad
          </h3>
          <div className="space-y-2">
            {typeOptions.map((type) => (
              <label
                key={type.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedTypes.includes(type.value)
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleTypeChange(type.value)}
                >
                  {selectedTypes.includes(type.value) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtro por ubicación */}
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-sm text-gray-700">Ubicación</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {locations.map((location) => (
              <label
                key={location}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedLocations.includes(location)
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleLocationChange(location)}
                >
                  {selectedLocations.includes(location) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <button
            className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={clearFilters}
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
