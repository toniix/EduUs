import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, Users, RefreshCw, UserCheck, XCircle, CheckCircle2 } from "lucide-react";
import { eventsService } from "../../../services/eventsService";
import { categoryConfig } from "../../../utils/events";
import { useTheme } from "../../../contexts/ThemeContext";
import { toast } from "react-hot-toast";

const REG_STATUS = {
  registered: { label: "Inscrito", cls: "bg-blue-100 text-blue-700" },
  attended: { label: "Asistió", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado", cls: "bg-red-100 text-red-600" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(iso));
}

export default function RegistrationsTab() {
  const { isDark } = useTheme();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");

  const bg = isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";
  const cardBg = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const inputCls = `px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${isDark
    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-primary"
    : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-primary"
    }`;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await eventsService.getAllRegistrations();
      setRegistrations(data);
    } catch (err) {
      toast.error("Error al cargar inscripciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  console.log(registrations);

  /* Cambiar estado */
  const handleStatusChange = async (regId, newStatus) => {
    setUpdatingId(regId);
    const { success, error } = await eventsService.updateRegistrationStatus(regId, newStatus);
    if (success) {
      setRegistrations((prev) =>
        prev.map((r) => r.id === regId ? { ...r, status: newStatus } : r)
      );
      toast.success("Estado actualizado");
    } else {
      toast.error(error || "Error al actualizar");
    }
    setUpdatingId(null);
  };

  /* Exportar CSV global */
  const exportCSV = () => {
    const headers = ["Nombre", "Email", "Carrera", "Universidad", "DNI", "Teléfono", "Estado", "Evento", "Fecha inscripción"];
    const rows = filtered.map((r) => [
      r.name, r.email, r.career || "", r.university || "", r.dni || "", r.phone || "",
      REG_STATUS[r.status]?.label || r.status,
      r.event?.title || "—",
      formatDate(r.registered_at),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inscripciones.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Eventos únicos para el filtro */
  const events = Array.from(
    new Map(
      registrations
        .filter((r) => r.event)
        .map((r) => [r.event.id, r.event])
    ).values()
  ).sort((a, b) => a.title.localeCompare(b.title));

  /* Filtrado */
  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.dni?.toLowerCase().includes(q) ||
      r.career?.toLowerCase().includes(q) ||
      r.university?.toLowerCase().includes(q) ||
      r.event?.title?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchEvent = eventFilter === "all" || r.event?.id === eventFilter;
    return matchSearch && matchStatus && matchEvent;
  });

  /* Counters */
  const total = registrations.length;
  const inscribed = registrations.filter((r) => r.status === "registered").length;
  const attended = registrations.filter((r) => r.status === "attended").length;
  const cancelled = registrations.filter((r) => r.status === "cancelled").length;

  return (
    <div className={`min-h-screen ${bg}`}>
      <div className="p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Inscripciones</h1>
            <p className={`text-sm ${subText}`}>Todos los registrados en todos los eventos</p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-primary text-primary hover:bg-primary/5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: total, cls: "text-gray-700", icon: <Users className="w-4 h-4 text-gray-400" /> },
              { label: "Inscritos", value: inscribed, cls: "text-blue-600", icon: <CheckCircle2 className="w-4 h-4 text-blue-400" /> },
              { label: "Asistieron", value: attended, cls: "text-green-600", icon: <UserCheck className="w-4 h-4 text-green-400" /> },
              { label: "Cancelados", value: cancelled, cls: "text-red-500", icon: <XCircle className="w-4 h-4 text-red-400" /> },
            ].map((s) => (
              <div key={s.label} className={`${cardBg} border rounded-2xl p-4 flex items-center gap-3`}>
                {s.icon}
                <div>
                  <p className={`text-xl font-bold ${s.cls}`}>{s.value}</p>
                  <p className={`text-xs ${subText}`}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Búsqueda */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${subText}`} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o evento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputCls} w-full pl-9`}
            />
          </div>

          {/* Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputCls}
          >
            <option value="all">Todos los estados</option>
            <option value="registered">Inscrito</option>
            <option value="attended">Asistió</option>
            <option value="cancelled">Cancelado</option>
          </select>

          {/* Evento */}
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className={`${inputCls} max-w-[200px]`}
          >
            <option value="all">Todos los eventos</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>

          {/* Exportar */}
          {filtered.length > 0 && (
            <button
              onClick={exportCSV}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Exportar CSV
            </button>
          )}
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className={`w-10 h-10 mx-auto mb-3 ${subText}`} />
            <p className={`text-sm ${subText}`}>
              {registrations.length === 0
                ? "No hay inscripciones aún"
                : "No hay resultados para los filtros aplicados"}
            </p>
          </div>
        ) : (
          <div className={`${cardBg} border rounded-2xl overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={isDark ? "border-b border-gray-700 bg-gray-800/60" : "border-b border-gray-100 bg-gray-50"}>
                    {["Persona", "Email", "Carrera", "Universidad", "DNI", "Teléfono", "Evento", "Estado", "Fecha", "Acciones"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${subText}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((reg) => {
                    const regCfg = REG_STATUS[reg.status] || { label: reg.status, cls: "bg-gray-100 text-gray-600" };
                    const catCfg = reg.event ? (categoryConfig[reg.event.category] || null) : null;
                    const isUpd = updatingId === reg.id;

                    return (
                      <tr
                        key={reg.id}
                        className={`border-b last:border-0 transition-colors ${isDark ? "border-gray-700 hover:bg-gray-700/30" : "border-gray-50 hover:bg-gray-50"
                          }`}
                      >
                        {/* Avatar + nombre */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {reg.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span className="font-medium truncate max-w-[120px]">{reg.name}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className={`px-4 py-3 ${subText} truncate max-w-[160px]`}>{reg.email}</td>

                        {/* Carrera */}
                        <td className={`px-4 py-3 ${subText} truncate max-w-[140px]`}>{reg.career || "—"}</td>

                        {/* Universidad */}
                        <td className={`px-4 py-3 ${subText} truncate max-w-[160px]`}>{reg.university || "—"}</td>

                        {/* DNI */}
                        <td className={`px-4 py-3 ${subText} font-mono`}>{reg.dni || "—"}</td>

                        {/* Teléfono */}
                        <td className={`px-4 py-3 ${subText}`}>{reg.phone || "—"}</td>

                        {/* Evento */}
                        <td className="px-4 py-3">
                          {reg.event ? (
                            <div>
                              <p className="font-medium text-xs truncate max-w-[140px]">{reg.event.title}</p>
                              {catCfg && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border mt-0.5 inline-block ${catCfg.badgeClass}`}>
                                  {catCfg.label}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className={subText}>—</span>
                          )}
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${regCfg.cls}`}>
                            {regCfg.label}
                          </span>
                        </td>

                        {/* Fecha */}
                        <td className={`px-4 py-3 text-xs ${subText} whitespace-nowrap`}>
                          {formatDate(reg.registered_at)}
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-3">
                          {isUpd ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          ) : (
                            <div className="flex gap-1">
                              {reg.status !== "attended" && (
                                <button
                                  title="Marcar como asistió"
                                  onClick={() => handleStatusChange(reg.id, "attended")}
                                  className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {reg.status !== "registered" && (
                                <button
                                  title="Marcar como inscrito"
                                  onClick={() => handleStatusChange(reg.id, "registered")}
                                  className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {reg.status !== "cancelled" && (
                                <button
                                  title="Cancelar inscripción"
                                  onClick={() => handleStatusChange(reg.id, "cancelled")}
                                  className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className={`px-4 py-3 border-t text-xs ${subText} flex items-center justify-between ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <span>Mostrando {filtered.length} de {total} inscripciones</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
