import { useState } from "react";
import {
  Filter,
  RotateCcw,
  Globe,
  SlidersHorizontal,
  Briefcase,
  Tag,
  ChevronDown,
  Check,
} from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

/* ─── Accordion item ──────────────────────────────────────── */
const AccordionItem = ({ id, icon, label, isActive, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [overflow, setOverflow] = useState(defaultOpen ? "visible" : "hidden");

  const handleToggle = () => {
    if (open) {
      // Cerrar: primero cortar el overflow, luego colapsar
      setOverflow("hidden");
      setOpen(false);
    } else {
      // Abrir: expandir y después de la transición abrir overflow
      setOpen(true);
      // El timeout coincide con la duración de la transición (300ms)
      setTimeout(() => setOverflow("visible"), 300);
    }
  };

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between py-3 px-1 group transition-colors duration-150 hover:text-primary"
        aria-expanded={open}
        aria-controls={`accordion-${id}`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`transition-colors duration-200 ${
              isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"
            }`}
          >
            {icon}
          </span>
          <span
            className={`text-xs font-heading font-bold uppercase tracking-wider transition-colors duration-200 ${
              isActive ? "text-primary" : "text-slate-500 group-hover:text-primary"
            }`}
          >
            {label}
          </span>
          {isActive && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Panel expandible */}
      <div
        id={`accordion-${id}`}
        style={{
          maxHeight: open ? "500px" : "0px",
          opacity: open ? 1 : 0,
          overflow,
          transition: "max-height 300ms ease-in-out, opacity 300ms ease-in-out",
        }}
      >
        <div className="pb-4 px-1">{children}</div>
      </div>
    </div>
  );
};

/* ─── FiltersComponent ────────────────────────────────────── */
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
    const nextFilters = { ...localFilters, [name]: value };
    setLocalFilters(nextFilters);
    onFilterChange(nextFilters);
  };

  const toggleShowExpired = (value) => {
    const nextFilters = { ...localFilters, show_expired: value };
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

  const hasActiveFilters =
    localFilters.modality !== "" ||
    localFilters.category_id !== "" ||
    localFilters.country !== "" ||
    localFilters.show_expired === true ||
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

      {/* ── Acordeón ── */}

      {/* Ordenar por */}
      <AccordionItem
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
      </AccordionItem>

      {/* Estado de convocatoria */}
      <AccordionItem
        id="estado"
        icon={<Check className="h-3.5 w-3.5" />}
        label="Estado"
        isActive={localFilters.show_expired === true}
        defaultOpen={true}
      >
        <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 mt-1">
          <button
            type="button"
            onClick={() => toggleShowExpired(false)}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
              !localFilters.show_expired
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Abiertas
          </button>
          <button
            type="button"
            onClick={() => toggleShowExpired(true)}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
              localFilters.show_expired
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Todas
          </button>
        </div>
      </AccordionItem>

      {/* Categoría */}
      <AccordionItem
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
      </AccordionItem>

      {/* Modalidad */}
      <AccordionItem
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
      </AccordionItem>

      {/* País */}
      <AccordionItem
        id="pais"
        icon={<Globe className="h-3.5 w-3.5" />}
        label="País de destino"
        isActive={localFilters.country !== ""}
      >
        <div className="mt-1">
          <CustomSelect
            name="country"
            value={localFilters.country || ""}
            onChange={handleFilterChange}
            placeholder="Todos los países"
            options={[
              { value: "", label: "Todos los países" },
              ...countries.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
              })),
            ]}
          />
        </div>
      </AccordionItem>
    </div>
  );
};

export default FiltersComponent;
