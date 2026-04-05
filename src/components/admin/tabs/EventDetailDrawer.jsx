import { useState, useEffect, useCallback } from "react";
import {
  X, Calendar, MapPin, Clock, Users, DollarSign, Link,
  Hash, Star, CheckCircle2, XCircle, UserCheck, Loader2,
  ExternalLink, Copy, ChevronDown,
} from "lucide-react";
import { eventsService } from "../../../services/eventsService";
import {
  categoryConfig, modalityConfig, formatEventDate, getEventStatus, eventStatusConfig,
} from "../../../utils/events";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";

/* ─── Helpers ─── */
function formatDateTime(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(iso));
}

function formatShortDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(iso));
}

const REG_STATUS = {
  registered: { label: "Inscrito",  cls: "bg-blue-100 text-blue-700" },
  attended:   { label: "Asistió",   cls: "bg-green-100 text-green-700" },
  cancelled:  { label: "Cancelado", cls: "bg-red-100 text-red-600" },
};

/* ─── Componente principal ─── */
export default function EventDetailDrawer({ event, onClose, onEdit, onDelete, onRefetch }) {
  const { isDark } = useTheme();
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [regFilter, setRegFilter] = useState("all");

  const bg = isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";
  const border = isDark ? "border-gray-700" : "border-gray-100";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const cardBg = isDark ? "bg-gray-800" : "bg-gray-50";

  /* Fetch inscritos */
  const fetchRegs = useCallback(async () => {
    if (!event?.id) return;
    setLoadingRegs(true);
    try {
      const data = await eventsService.getRegistrations(event.id);
      setRegistrations(data);
    } catch {
      toast.error("Error al cargar inscritos");
    } finally {
      setLoadingRegs(false);
    }
  }, [event?.id]);

  useEffect(() => { fetchRegs(); }, [fetchRegs]);

  /* Bloquear scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Cambiar estado de inscripción */
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

  /* Exportar CSV */
  const exportCSV = () => {
    const headers = ["Nombre", "Email", "Teléfono", "Estado", "Fecha inscripción"];
    const rows = registrations.map((r) => [
      r.name, r.email, r.phone || "", REG_STATUS[r.status]?.label || r.status,
      formatShortDate(r.registered_at),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscritos-${event.slug || event.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!event) return null;

  const status = getEventStatus(event);
  const statusCfg = eventStatusConfig[status] || {};
  const catCfg = categoryConfig[event.category] || { label: event.category, badgeClass: "bg-gray-100 text-gray-600" };
  const modalCfg = modalityConfig[event.modality] || { label: event.modality, icon: "📍" };

  const totalCapacity = event.capacity;
  const registeredCount = registrations.filter((r) => r.status === "registered").length;
  const attendedCount = registrations.filter((r) => r.status === "attended").length;
  const cancelledCount = registrations.filter((r) => r.status === "cancelled").length;
  const spotsLeft = totalCapacity !== null ? Math.max(0, totalCapacity - registeredCount) : null;

  const filteredRegs = regFilter === "all"
    ? registrations
    : registrations.filter((r) => r.status === regFilter);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl z-50 shadow-2xl flex flex-col overflow-hidden ${bg} border-l ${border}`}
        style={{ animation: "slideIn 0.25s ease-out" }}
      >
        {/* ─── Header ─── */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${border} flex-shrink-0`}>
          <div className="flex items-center gap-3 min-w-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusCfg.badgeClass}`}>
              {statusCfg.label}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${catCfg.badgeClass}`}>
              {catCfg.label}
            </span>
            {event.promo_modal && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-yellow-400" /> PROMO
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(event)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Scrollable body ─── */}
        <div className="flex-1 overflow-y-auto">

          {/* Banner */}
          {event.banner_url && (
            <div className="w-full h-48 overflow-hidden flex-shrink-0">
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="px-6 py-5 space-y-6">

            {/* Título */}
            <div>
              <h2 className="text-xl font-bold leading-snug">{event.title}</h2>
              <p className={`text-xs mt-1 font-mono ${subText}`}>/{event.slug}</p>
            </div>

            {/* ─── Stats ─── */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3`}>
              {[
                {
                  icon: <Users className="w-4 h-4 text-primary" />,
                  label: "Inscritos",
                  value: registeredCount,
                },
                {
                  icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
                  label: "Asistieron",
                  value: attendedCount,
                },
                {
                  icon: <DollarSign className="w-4 h-4 text-amber-500" />,
                  label: "Precio",
                  value: event.price === 0 || event.price === null ? "Gratis" : `S/ ${event.price}`,
                },
                {
                  icon: <Users className="w-4 h-4 text-gray-400" />,
                  label: "Cupos libres",
                  value: spotsLeft === null ? "Sin límite" : spotsLeft,
                },
              ].map((s, i) => (
                <div key={i} className={`${cardBg} rounded-xl p-3 flex flex-col gap-1`}>
                  <div className="flex items-center gap-1.5">
                    {s.icon}
                    <span className={`text-[11px] ${subText}`}>{s.label}</span>
                  </div>
                  <p className="text-lg font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            {/* ─── Info del evento ─── */}
            <div className={`rounded-xl ${cardBg} p-4 space-y-3`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Información del evento
              </h3>

              <InfoRow icon={<Calendar className="w-4 h-4 text-primary" />} label="Inicio">
                {formatDateTime(event.starts_at)}
              </InfoRow>
              {event.ends_at && (
                <InfoRow icon={<Clock className="w-4 h-4 text-gray-400" />} label="Fin">
                  {formatDateTime(event.ends_at)}
                </InfoRow>
              )}
              <InfoRow icon={<span className="text-sm">{modalCfg.icon}</span>} label="Modalidad">
                {modalCfg.label}
              </InfoRow>
              {event.location && (
                <InfoRow icon={<MapPin className="w-4 h-4 text-gray-400" />} label="Lugar">
                  {event.location}
                </InfoRow>
              )}
              {totalCapacity !== null && (
                <InfoRow icon={<Users className="w-4 h-4 text-gray-400" />} label="Capacidad">
                  {totalCapacity} personas
                </InfoRow>
              )}
              {event.registration_url && (
                <InfoRow icon={<Link className="w-4 h-4 text-blue-500" />} label="URL inscripción">
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1 text-xs truncate max-w-[220px]"
                  >
                    {event.registration_url}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </InfoRow>
              )}
            </div>

            {/* Descripción */}
            {event.description && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Descripción
                </h3>
                <p className={`text-sm leading-relaxed ${subText}`}>{event.description}</p>
              </div>
            )}

            {/* ─── Inscritos ─── */}
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Inscritos ({registrations.length})
                </h3>

                <div className="flex items-center gap-2">
                  {/* Filtro */}
                  <select
                    value={regFilter}
                    onChange={(e) => setRegFilter(e.target.value)}
                    className={`text-xs rounded-lg border px-2 py-1 outline-none ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-700"}`}
                  >
                    <option value="all">Todos ({registrations.length})</option>
                    <option value="registered">Inscritos ({registeredCount})</option>
                    <option value="attended">Asistieron ({attendedCount})</option>
                    <option value="cancelled">Cancelados ({cancelledCount})</option>
                  </select>

                  {/* Exportar CSV */}
                  {registrations.length > 0 && (
                    <button
                      onClick={exportCSV}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors"
                    >
                      Exportar CSV
                    </button>
                  )}
                </div>
              </div>

              {loadingRegs && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}

              {!loadingRegs && filteredRegs.length === 0 && (
                <div className={`text-center py-10 rounded-xl ${cardBg}`}>
                  <Users className={`w-8 h-8 mx-auto mb-2 ${subText}`} />
                  <p className={`text-sm ${subText}`}>
                    {registrations.length === 0
                      ? "Aún no hay inscritos para este evento"
                      : "No hay inscritos con este filtro"}
                  </p>
                </div>
              )}

              {!loadingRegs && filteredRegs.length > 0 && (
                <div className="space-y-2">
                  {filteredRegs.map((reg) => {
                    const regCfg = REG_STATUS[reg.status] || { label: reg.status, cls: "bg-gray-100 text-gray-600" };
                    return (
                      <div
                        key={reg.id}
                        className={`${cardBg} rounded-xl p-3 flex items-center gap-3`}
                      >
                        {/* Avatar inicial */}
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {reg.name?.[0]?.toUpperCase() || "?"}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{reg.name}</p>
                          <p className={`text-xs truncate ${subText}`}>{reg.email}</p>
                          {reg.phone && (
                            <p className={`text-xs ${subText}`}>{reg.phone}</p>
                          )}
                          <p className={`text-[10px] mt-0.5 ${subText}`}>
                            {formatShortDate(reg.registered_at)}
                          </p>
                        </div>

                        {/* Estado + acciones */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${regCfg.cls}`}>
                            {regCfg.label}
                          </span>

                          {updatingId === reg.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          ) : (
                            <div className="flex gap-1">
                              {reg.status !== "attended" && (
                                <button
                                  title="Marcar como asistió"
                                  onClick={() => handleStatusChange(reg.id, "attended")}
                                  className="p-1 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {reg.status !== "registered" && (
                                <button
                                  title="Marcar como inscrito"
                                  onClick={() => handleStatusChange(reg.id, "registered")}
                                  className="p-1 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {reg.status !== "cancelled" && (
                                <button
                                  title="Cancelar inscripción"
                                  onClick={() => handleStatusChange(reg.id, "cancelled")}
                                  className="p-1 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ─── Zona peligrosa ─── */}
            <div className={`border ${isDark ? "border-red-900/40" : "border-red-100"} rounded-xl p-4`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">
                Zona peligrosa
              </h3>
              <button
                onClick={() => onDelete(event)}
                className="text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors"
              >
                Eliminar evento
              </button>
            </div>

            {/* Espaciado inferior */}
            <div className="h-4" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

/* ─── Helper visual ─── */
function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
          {label}
        </span>
        <div className="text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}
