import { categoryConfig } from "../../../utils/events";
import { UserCheck, XCircle, CheckCircle2, Loader2 } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

const REG_STATUS = {
  registered: { label: "Inscrito", cls: "bg-blue-100 text-blue-700" },
  attended: { label: "Asistió", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado", cls: "bg-red-100 text-red-600" },
};

const RegistrationsTable = ({
  filtered,
  total,
  isDark,
  subText,
  cardBg,
  updatingId,
  onStatusChange,
}) => {
  return (
    <div className={`${cardBg} border rounded-2xl overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={
                isDark
                  ? "border-b border-gray-700 bg-gray-800/60"
                  : "border-b border-gray-100 bg-gray-50"
              }
            >
              {[
                "Persona",
                "Email",
                "Carrera",
                "Universidad",
                "DNI",
                "Teléfono",
                "Evento",
                "Estado",
                "Fecha",
                "Acciones",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${subText}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((reg) => {
              const regCfg = REG_STATUS[reg.status] || {
                label: reg.status,
                cls: "bg-gray-100 text-gray-600",
              };
              const catCfg = reg.event
                ? categoryConfig[reg.event.category] || null
                : null;
              const isUpd = updatingId === reg.id;
              return (
                <tr
                  key={reg.id}
                  className={`border-b last:border-0 transition-colors ${isDark ? "border-gray-700 hover:bg-gray-700/30" : "border-gray-50 hover:bg-gray-50"}`}
                >
                  {/* Avatar + nombre */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {reg.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium truncate max-w-[120px]">
                        {reg.name}
                      </span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${subText} truncate max-w-[160px]`}>
                    {reg.email}
                  </td>
                  <td className={`px-4 py-3 ${subText} truncate max-w-[140px]`}>
                    {reg.career || "—"}
                  </td>
                  <td className={`px-4 py-3 ${subText} truncate max-w-[160px]`}>
                    {reg.university || "—"}
                  </td>
                  <td className={`px-4 py-3 ${subText} font-mono`}>
                    {reg.dni || "—"}
                  </td>
                  <td className={`px-4 py-3 ${subText}`}>{reg.phone || "—"}</td>
                  {/* Evento */}
                  <td className="px-4 py-3">
                    {reg.event ? (
                      <div>
                        <p className="font-medium text-xs truncate max-w-[140px]">
                          {reg.event.title}
                        </p>
                        {catCfg && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border mt-0.5 inline-block ${catCfg.badgeClass}`}
                          >
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
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${regCfg.cls}`}
                    >
                      {regCfg.label}
                    </span>
                  </td>
                  {/* Fecha */}
                  <td
                    className={`px-4 py-3 text-xs ${subText} whitespace-nowrap`}
                  >
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
                            onClick={() => onStatusChange(reg.id, "attended")}
                            className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {reg.status !== "registered" && (
                          <button
                            title="Marcar como inscrito"
                            onClick={() => onStatusChange(reg.id, "registered")}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {reg.status !== "cancelled" && (
                          <button
                            title="Cancelar inscripción"
                            onClick={() => onStatusChange(reg.id, "cancelled")}
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
      <div
        className={`px-4 py-3 border-t text-xs ${subText} flex items-center justify-between ${isDark ? "border-gray-700" : "border-gray-100"}`}
      >
        <span>
          Mostrando {filtered.length} de {total} inscripciones
        </span>
      </div>
    </div>
  );
};

export default RegistrationsTable;
