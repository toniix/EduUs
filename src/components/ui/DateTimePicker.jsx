import { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Sparkles,
} from "lucide-react";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

const TIME_PRESETS = [
  { label: "09:00 AM", hour: 9, minute: 0 },
  { label: "10:30 AM", hour: 10, minute: 30 },
  { label: "02:00 PM", hour: 14, minute: 0 },
  { label: "04:30 PM", hour: 16, minute: 30 },
  { label: "06:00 PM", hour: 18, minute: 0 },
  { label: "07:30 PM", hour: 19, minute: 30 },
];

/** Formatea una fecha local "YYYY-MM-DDTHH:mm" a string legible en español */
function formatDisplayDate(val) {
  if (!val) return "";
  const [dPart, tPart] = val.split("T");
  if (!dPart) return "";
  const [y, m, d] = dPart.split("-").map(Number);
  if (!y || !m || !d) return val;

  const dateObj = new Date(y, m - 1, d);
  const dayName = new Intl.DateTimeFormat("es-PE", { weekday: "short" }).format(
    dateObj,
  );
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const monthName = MONTH_NAMES[m - 1]?.slice(0, 3);

  let timeFormatted = "";
  if (tPart) {
    const [hh, mm] = tPart.split(":").map(Number);
    const period = hh >= 12 ? "PM" : "AM";
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    timeFormatted = ` · ${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${period}`;
  }

  return `${capitalizedDay}, ${d} ${monthName} ${y}${timeFormatted}`;
}

/** Devuelve texto relativo amigable */
function getRelativeHint(val) {
  if (!val) return null;
  const [dPart] = val.split("T");
  if (!dPart) return null;
  const [y, m, d] = dPart.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Evento en el pasado";
  if (diffDays === 0) return "¡Hoy!";
  if (diffDays === 1) return "Mañana";
  if (diffDays < 7) return `En ${diffDays} días`;
  const weeks = Math.round(diffDays / 7);
  return `En ~${weeks} semana${weeks > 1 ? "s" : ""}`;
}

export default function DateTimePicker({
  name,
  value = "",
  onChange,
  label,
  required = false,
  error = "",
  placeholder = "Seleccionar fecha y hora...",
  minDate,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar"); // 'calendar' | 'time'
  const containerRef = useRef(null);

  // Parsear fecha actual o inicializar en hoy
  const parsed = useMemo(() => {
    if (!value) {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth(), // 0-11
        day: now.getDate(),
        hour: 18,
        minute: 0,
      };
    }
    const [dPart, tPart] = value.split("T");
    const [y, m, d] = (dPart || "").split("-").map(Number);
    const [hh, mm] = (tPart || "18:00").split(":").map(Number);
    return {
      year: y || new Date().getFullYear(),
      month: (m || 1) - 1,
      day: d || 1,
      hour: isNaN(hh) ? 18 : hh,
      minute: isNaN(mm) ? 0 : mm,
    };
  }, [value]);

  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);

  // Sincronizar vista si cambia el valor externamente
  useEffect(() => {
    if (value) {
      const [dPart] = value.split("T");
      const [y, m] = (dPart || "").split("-").map(Number);
      if (y && m) {
        setViewYear(y);
        setViewMonth(m - 1);
      }
    }
  }, [value]);

  // Click outside para cerrar popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const emitChange = (y, m, d, hh, mm) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const timeStr = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    const combined = `${dateStr}T${timeStr}`;

    if (typeof onChange === "function") {
      onChange({ target: { name, value: combined } });
    }
  };

  const handleDaySelect = (dayNumber) => {
    emitChange(viewYear, viewMonth, dayNumber, parsed.hour, parsed.minute);
  };

  const handleTimePreset = (h, m) => {
    emitChange(parsed.year, parsed.month, parsed.day, h, m);
  };

  const handleHourChange = (newHour24) => {
    emitChange(parsed.year, parsed.month, parsed.day, newHour24, parsed.minute);
  };

  const handleMinuteChange = (newMinute) => {
    emitChange(parsed.year, parsed.month, parsed.day, parsed.hour, newMinute);
  };

  const handleAmPmToggle = (period) => {
    let currentHour = parsed.hour;
    const isCurrentlyPm = currentHour >= 12;
    if (period === "AM" && isCurrentlyPm) {
      currentHour -= 12;
    } else if (period === "PM" && !isCurrentlyPm) {
      currentHour += 12;
    }
    emitChange(
      parsed.year,
      parsed.month,
      parsed.day,
      currentHour,
      parsed.minute,
    );
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleTodayShortcut = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    emitChange(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      parsed.hour,
      parsed.minute,
    );
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (typeof onChange === "function") {
      onChange({ target: { name, value: "" } });
    }
  };

  // Cálculo de la cuadrícula de días (Lunes a Domingo)
  const daysGrid = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    // Ajustar para que 0 sea Lunes y 6 sea Domingo
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
      });
    }

    // Días del mes actual
    const today = new Date();
    const isCurrentYearMonth =
      today.getFullYear() === viewYear && today.getMonth() === viewMonth;
    const todayDate = today.getDate();

    const isSelectedYearMonth =
      value && parsed.year === viewYear && parsed.month === viewMonth;

    for (let d = 1; d <= daysInMonth; d++) {
      let isDisabled = false;
      if (minDate) {
        const [minY, minM, minD] = minDate.split("T")[0].split("-").map(Number);
        const thisDate = new Date(viewYear, viewMonth, d);
        const minDateObj = new Date(minY, minM - 1, minD);
        if (thisDate < minDateObj) isDisabled = true;
      }

      days.push({
        day: d,
        isCurrentMonth: true,
        isToday: isCurrentYearMonth && d === todayDate,
        isSelected: isSelectedYearMonth && d === parsed.day,
        isDisabled,
      });
    }

    // Días del próximo mes para completar la cuadrícula (múltiplo de 7)
    const remaining = 42 - days.length; // 6 semanas fijas para estabilidad visual
    for (let d = 1; d <= remaining && days.length < 42; d++) {
      days.push({
        day: d,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewYear, viewMonth, parsed, value, minDate]);

  // Cálculos de hora en formato 12h
  const isPm = parsed.hour >= 12;
  const hour12 = parsed.hour % 12 === 0 ? 12 : parsed.hour % 12;
  const relativeHint = getRelativeHint(value);

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-primary">*</span>}
          </span>
          {relativeHint && (
            <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {relativeHint}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer text-left ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
            : "hover:border-primary/50"
        } ${
          error
            ? "border-red-400 dark:border-red-500 bg-red-50/40 dark:bg-red-950/15"
            : isOpen
              ? "border-primary ring-2 ring-primary/20 bg-white dark:bg-gray-900"
              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              value
                ? "bg-primary/10 text-primary"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400"
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>

          <span
            className={`text-xs truncate ${
              value
                ? "font-semibold text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Borrar fecha"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 right-0 sm:left-auto sm:w-[350px] p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150">
          {/* Navegación de pestañas: Fecha vs Hora */}
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 mb-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "calendar"
                  ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Fecha
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("time")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "time"
                  ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Hora ({String(hour12).padStart(2, "0")}:
              {String(parsed.minute).padStart(2, "0")} {isPm ? "PM" : "AM"})
            </button>
          </div>

          {/* VISTA 1: CALENDARIO */}
          {activeTab === "calendar" && (
            <div className="space-y-3">
              {/* Header Mes y Año */}
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center font-bold text-xs text-gray-900 dark:text-gray-100 font-heading">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Cabecera Días de Semana */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1 border-b border-gray-100 dark:border-gray-800">
                {WEEKDAYS.map((wd) => (
                  <span key={wd}>{wd}</span>
                ))}
              </div>

              {/* Grid de Días */}
              <div className="grid grid-cols-7 gap-1">
                {daysGrid.map((item, idx) => {
                  if (!item.isCurrentMonth) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="h-8 flex items-center justify-center text-xs text-gray-300 dark:text-gray-700 select-none"
                      >
                        {item.day}
                      </div>
                    );
                  }

                  const isSel = item.isSelected;
                  const isTod = item.isToday;
                  const isDis = item.isDisabled;

                  return (
                    <button
                      key={`day-${item.day}`}
                      type="button"
                      disabled={isDis}
                      onClick={() => handleDaySelect(item.day)}
                      className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                        isSel
                          ? "bg-primary text-white shadow-md shadow-primary/30 font-bold scale-105"
                          : isTod
                            ? "border border-primary text-primary hover:bg-primary/10"
                            : isDis
                              ? "text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-40"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                      }`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>

              {/* Accesos rápidos de fecha */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleTodayShortcut}
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("time")}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                >
                  Ajustar hora →
                </button>
              </div>
            </div>
          )}

          {/* VISTA 2: SELECTOR DE HORA */}
          {activeTab === "time" && (
            <div className="space-y-4 py-1">
              {/* Selector 12h: Horas, Minutos y AM/PM */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-center gap-3">
                  {/* Horas */}
                  <div className="flex flex-col items-center">
                    <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1">
                      Hora
                    </label>
                    <select
                      value={hour12}
                      onChange={(e) => {
                        const val12 = Number(e.target.value);
                        const new24 = isPm
                          ? val12 === 12
                            ? 12
                            : val12 + 12
                          : val12 === 12
                            ? 0
                            : val12;
                        handleHourChange(new24);
                      }}
                      className="px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h}>
                          {String(h).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-xl font-bold text-gray-400 pt-4">
                    :
                  </span>

                  {/* Minutos */}
                  <div className="flex flex-col items-center">
                    <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1">
                      Minutos
                    </label>
                    <select
                      value={parsed.minute}
                      onChange={(e) =>
                        handleMinuteChange(Number(e.target.value))
                      }
                      className="px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 41, 45, 50, 55].map(
                        (m) => (
                          <option key={m} value={m}>
                            {String(m).padStart(2, "0")}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* Toggle AM / PM */}
                  <div className="flex flex-col items-center">
                    <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1">
                      Periodo
                    </label>
                    <div className="flex p-0.5 rounded-lg bg-gray-200 dark:bg-gray-700">
                      <button
                        type="button"
                        onClick={() => handleAmPmToggle("AM")}
                        className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                          !isPm
                            ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                            : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAmPmToggle("PM")}
                        className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                          isPm
                            ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                            : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horarios predeterminados rápidos */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Horarios sugeridos
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_PRESETS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => handleTimePreset(t.hour, t.minute)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                        parsed.hour === t.hour && parsed.minute === t.minute
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("calendar")}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                >
                  ← Volver a fecha
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 bg-primary text-white rounded-lg font-bold text-xs shadow-sm hover:bg-primary/90"
                >
                  Listo
                </button>
              </div>
            </div>
          )}

          {/* Footer del Popover */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
            <span className="truncate">
              📍 <strong>Hora oficial de Perú</strong> (UTC-5)
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-primary hover:underline ml-2"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
