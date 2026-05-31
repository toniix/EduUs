import {
  Check,
  Filter,
  RotateCcw,
  Globe,
  SlidersHorizontal,
  Briefcase,
  Tag,
  ChevronDown,
} from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

const FiltersComponent = ({
  onFilterChange,
  filterOptions = {},
  clearFilters,
  localFilters,
  setLocalFilters,
  hideHeader = false,
}) => {
  const { modalities = [], categories = [], countries = [] } = filterOptions;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const nextFilters = {
      ...localFilters,
      [name]: value,
    };
    setLocalFilters(nextFilters);
    onFilterChange(nextFilters);
  };

  const toggleShowExpired = (value) => {
    const nextFilters = {
      ...localFilters,
      show_expired: value,
    };
    setLocalFilters(nextFilters);
    onFilterChange(nextFilters);
  };

  const handleFilterReset = () => {
    setLocalFilters({
      modality: "",
      location: "",
      category_id: "",
      country: "",
      show_expired: false,
      sort: "created_at_desc",
    });
    clearFilters();
  };

  return (
    <div className="space-y-6">
      {/* Header del sidebar */}
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-heading font-bold text-gray-900">
              Filtros Avanzados
            </h3>
          </div>
          <button
            type="button"
            onClick={handleFilterReset}
            className="text-xs flex items-center space-x-1 font-bold text-gray-500 hover:text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-lg transition-all duration-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
      )}

      <div className="space-y-5">
        {/* Ordenamiento */}
        <div className="space-y-2">
          <span className="flex items-center text-xs font-heading font-bold uppercase tracking-wider text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            Ordenar por
          </span>
          <div className="flex flex-col gap-1.5">
            {[
              { value: "created_at_desc", label: "Más recientes" },
              { value: "deadline_asc", label: "Próximas a cerrar" },
              { value: "title_asc", label: "Título (A - Z)" },
            ].map((option) => {
              const isSelected = (localFilters.sort || "created_at_desc") === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilterChange({ target: { name: "sort", value: option.value } })}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/5 text-primary border-primary/20 shadow-sm"
                      : "bg-slate-50/50 text-slate-500 border-slate-200/50 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estado de Convocatoria (Segmented Toggle Control) */}
        <div className="space-y-2">
          <span className="flex items-center text-xs font-heading font-bold uppercase tracking-wider text-slate-400">
            Estado de Convocatoria
          </span>
          <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => toggleShowExpired(false)}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                !localFilters.show_expired
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Abiertas
            </button>
            <button
              type="button"
              onClick={() => toggleShowExpired(true)}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                localFilters.show_expired
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Todas
            </button>
          </div>
        </div>

        {/* Filtro por categoria*/}
        <div className="space-y-2">
          <label
            htmlFor="filter-category"
            className="flex items-center text-xs font-heading font-bold uppercase tracking-wider text-slate-400"
          >
            <Tag className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            Categoría
          </label>
          <CustomSelect
            name="category_id"
            value={localFilters.category_id || ""}
            onChange={handleFilterChange}
            placeholder="Todas las categorías"
            options={[
              { value: "", label: "Todas las categorías" },
              ...(categories || []).map((category) => ({
                value: category.id,
                label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
              })),
            ]}
          />
        </div>

        {/* Filtro por modalidad */}
        <div className="space-y-2">
          <span className="flex items-center text-xs font-heading font-bold uppercase tracking-wider text-slate-400">
            <Briefcase className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            Modalidad
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: "", label: "Todas" },
              ...modalities.map((modality) => ({
                value: modality,
                label: modality.charAt(0).toUpperCase() + modality.slice(1),
              })),
            ].map((option) => {
              const isSelected = (localFilters.modality || "") === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilterChange({ target: { name: "modality", value: option.value } })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/5 text-primary border-primary/20 shadow-sm"
                      : "bg-slate-50/50 text-slate-500 border-slate-200/50 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro por pais */}
        <div className="space-y-2">
          <label
            htmlFor="filter-country"
            className="flex items-center text-xs font-heading font-bold uppercase tracking-wider text-slate-400"
          >
            <Globe className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            País de Destino
          </label>
          <CustomSelect
            name="country"
            value={localFilters.country || ""}
            onChange={handleFilterChange}
            placeholder="Todos los países"
            options={[
              { value: "", label: "Todos los países" },
              ...countries.map((country) => ({
                value: country,
                label: country.charAt(0).toUpperCase() + country.slice(1),
              })),
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersComponent;
