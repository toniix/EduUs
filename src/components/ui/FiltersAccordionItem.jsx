import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FiltersAccordionItem = ({
  id,
  icon,
  label,
  isActive,
  children,
  defaultOpen = false,
}) => {
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
              isActive
                ? "text-primary"
                : "text-slate-400 group-hover:text-primary"
            }`}
          >
            {icon}
          </span>
          <span
            className={`text-xs font-heading font-bold uppercase tracking-wider transition-colors duration-200 ${
              isActive
                ? "text-primary"
                : "text-slate-500 group-hover:text-primary"
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

export default FiltersAccordionItem;
