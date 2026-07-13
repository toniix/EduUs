import {
  Filter,
  RotateCcw,
  Globe,
  SlidersHorizontal,
  Briefcase,
  Tag,
  Check,
  History,
} from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
import FiltersAccordionItem from "../ui/FiltersAccordionItem";

const FiltersComponent = ({
  onFilterChange,
  filterOptions = {},
  clearFilters,
  localFilters,
  setLocalFilters,
  hideHeader = false,
  hideSort = false,
}) => {
  const { modalities = [], categories = [], countries = [] } = filterOptions;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const nextFilters = { ...localFilters, [name]: value };
    setLocalFilters(nextFilters);
    onFilterChange(nextFilters);
  };

  const handleFilterReset = () => {
    setLocalFilters({
      modality: "",
      category_id: "",
      location: "",
      show_expired: false,
      sort: "created_at_desc",
    });
    clearFilters();
  };

  const hasActiveFilters =
    localFilters.modality !== "" ||
    localFilters.category_id !== "" ||
    localFilters.location !== "" ||
    localFilters.show_expired === "only_expired" ||
    localFilters.sort !== "created_at_desc";

  return (
    <div className="space-y-0">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-3 mb-1">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-heading font-bold text-gray-900">
              Filtros
            </h3>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-primary inline-block" />
            )}
          </div>
          <button
            type="button"
            onClick={handleFilterReset}
            disabled={!hasActiveFilters}
            className={`text-xs flex items-center gap-1 font-bold px-2 py-1 rounded-lg transition-all duration-200 ${
              hasActiveFilters
                ? "text-primary hover:bg-primary/5 cursor-pointer"
                : "text-slate-300 cursor-default"
            }`}
          >
            <RotateCcw className="h-3 w-3" />
            <span>Limpiar</span>
          </button>
        </div>
      )}

      {/* Ordenar por */}
      {!hideSort && (
        <FiltersAccordionItem
          id="sort"
          icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          label="Ordenar por"
          isActive={localFilters.sort !== "created_at_desc"}
          defaultOpen={true}
        >
          <div className="flex flex-col gap-1.5 mt-1">
            {[
              { value: "created_at_desc", label: "Más recientes" },
              { value: "deadline_asc", label: "Próximas a cerrar" },
              { value: "title_asc", label: "Título (A - Z)" },
            ].map((option) => {
              const isSelected =
                (localFilters.sort || "created_at_desc") === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleFilterChange({
                      target: { name: "sort", value: option.value },
                    })
                  }
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/5 text-primary border-primary/20"
                      : "bg-slate-50/50 text-slate-500 border-slate-200/50 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {option.label}
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </FiltersAccordionItem>
      )}

      {/* Categoría */}
      <FiltersAccordionItem
        id="categoria"
        icon={<Tag className="h-3.5 w-3.5" />}
        label="Categoría"
        isActive={localFilters.category_id !== ""}
      >
        <div className="mt-1">
          <CustomSelect
            name="category_id"
            value={localFilters.category_id || ""}
            onChange={handleFilterChange}
            placeholder="Todas las categorías"
            options={[
              { value: "", label: "Todas las categorías" },
              ...(categories || []).map((c) => ({
                value: c.id,
                label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
              })),
            ]}
          />
        </div>
      </FiltersAccordionItem>

      {/* Modalidad */}
      <FiltersAccordionItem
        id="modalidad"
        icon={<Briefcase className="h-3.5 w-3.5" />}
        label="Modalidad"
        isActive={localFilters.modality !== ""}
      >
        <div className="flex flex-wrap gap-1.5 mt-1">
          {[
            { value: "", label: "Todas" },
            ...modalities.map((m) => ({
              value: m,
              label: m.charAt(0).toUpperCase() + m.slice(1),
            })),
          ].map((option) => {
            const isSelected = (localFilters.modality || "") === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleFilterChange({
                    target: { name: "modality", value: option.value },
                  })
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 ${
                  isSelected
                    ? "bg-primary/5 text-primary border-primary/20"
                    : "bg-slate-50/50 text-slate-500 border-slate-200/50 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </FiltersAccordionItem>

      {/* Ámbito */}
      <FiltersAccordionItem
        id="ambito"
        icon={<Globe className="h-3.5 w-3.5" />}
        label="Ámbito"
        isActive={localFilters.location !== ""}
        defaultOpen={true}
      >
        <div className="flex flex-row lg:flex-col p-1 lg:p-0 bg-slate-100/80 lg:bg-transparent rounded-xl lg:rounded-none border border-slate-200/50 lg:border-none mt-1 gap-1.5">
          {[
            { value: "", label: "Todos" },
            { value: "Nacional", label: "Nacional" },
            { value: "international", label: "Internacional" },
          ].map((option) => {
            const isSelected = (localFilters.location || "") === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleFilterChange({
                    target: { name: "location", value: option.value },
                  })
                }
                className={`text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? "bg-white lg:bg-primary/5 text-primary shadow-sm lg:shadow-none border border-transparent lg:border-primary/20"
                    : "text-slate-500 lg:bg-slate-50/50 lg:border lg:border-slate-200/50 hover:text-slate-700 lg:hover:bg-slate-50 lg:hover:text-slate-800"
                } flex-1 lg:flex-initial lg:w-full lg:text-left py-2 px-3 rounded-lg lg:rounded-xl`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </FiltersAccordionItem>

      {/* Botón de Convocatorias Pasadas / Historial */}
      <div className="pt-4 mt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            const nextValue =
              localFilters.show_expired === "only_expired"
                ? false
                : "only_expired";
            handleFilterChange({
              target: { name: "show_expired", value: nextValue },
            });
          }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 border ${
            localFilters.show_expired === "only_expired"
              ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              : "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
          }`}
        >
          {localFilters.show_expired === "only_expired" ? (
            <>
              <Check className="h-4 w-4 text-primary" />
              <span>Ver convocatorias vigentes</span>
            </>
          ) : (
            <>
              <History className="h-4 w-4 text-primary" />
              <span>Oportunidades Pasadas</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FiltersComponent;
