import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Star,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useAdminEvents } from "../../../hooks/useEvents";
import { eventsService } from "../../../services/eventsService";
import {
  categoryConfig,
  modalityConfig,
  formatEventDate,
  getEventStatus,
  eventStatusConfig,
} from "../../../utils/events";
import EventForm from "./EventForm";
import EventPreviewModal from "./EventPreviewModal";
import EventDetailDrawer from "./EventDetailDrawer";
import InlineLoader from "../../ui/LoadingSpinner";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";
import ActionBtn from "../../ui/ActionBtn";


export default function EventsAdminTab() {
  const { isDark } = useTheme();
  const { events, loading, error, refetch } = useAdminEvents();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // para editar
  const [previewEvent, setPreviewEvent] = useState(null);  // para preview público
  const [drawerEvent, setDrawerEvent] = useState(null);    // para el drawer de detalles

  // Filtrado local por título
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return events;
    return events.filter((e) => e.title.toLowerCase().includes(term));
  }, [searchTerm, events]);

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleOpenEdit = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEvent(null);
  };

  // Crear o actualizar evento
  const handleSave = async (formData) => {
    let result;
    if (selectedEvent) {
      result = await eventsService.updateEvent(selectedEvent.id, formData);
    } else {
      result = await eventsService.createEvent(formData);
    }

    if (result.success) {
      toast.success(
        selectedEvent ? "Evento actualizado" : "Evento creado correctamente"
      );
      handleCloseForm();
      refetch();
    } else {
      toast.error(result.error || "Error al guardar el evento");
    }
  };

  const handleTogglePublish = async (event) => {
    const isPublished = event.status === "published";
    const action = isPublished ? "despublicar" : "publicar";
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas ${action} "${event.title}"?`
    );
    if (!confirmed) return;

    const { success, error } = await eventsService.updateEvent(event.id, {
      status: isPublished ? "draft" : "published",
    });

    if (success) {
      toast.success(`Evento ${action === "publicar" ? "publicado" : "despublicado"} correctamente`);
      refetch();
    } else {
      toast.error(error || "Error al actualizar el evento");
    }
  };

  const handleMarkAsPromo = async (event) => {
    const confirmed = window.confirm(
      `¿Deseas marcar "${event.title}" como el modal promocional? Esto reemplazará el evento promo actual.`
    );
    if (!confirmed) return;

    const { success, error } = await eventsService.updateEvent(event.id, {
      promo_modal: true,
    });

    if (success) {
      toast.success("Evento marcado como promocional");
      refetch();
    } else {
      toast.error(error || "Error al actualizar");
    }
  };

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar "${event.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    const { success, error } = await eventsService.deleteEvent(event.id);
    if (success) {
      toast.success("Evento eliminado");
      refetch();
    } else {
      toast.error(error || "Error al eliminar el evento");
    }
  };

  const containerClass = `rounded-lg shadow-md p-6 w-full h-full flex flex-col ${isDark ? "bg-gray-800" : "bg-white"
    }`;

  const thClass = `px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${isDark ? "text-gray-300" : "text-gray-500"
    }`;

  const tdClass = `px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`;

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2
          className={`text-xl font-semibold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"
            }`}
        >
          Gestión de Eventos
          <span className="ml-2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-semibold">
            {filtered.length} evento{filtered.length !== 1 ? "s" : ""}
          </span>
        </h2>

        <div className="flex items-center gap-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título..."
              className={`pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition-colors ${isDark
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
                : "bg-white border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary/20"
                }`}
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Crear evento
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <InlineLoader message="Cargando eventos..." size="md" />}

      {/* Error */}
      {!loading && error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <div className="w-full overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className={thClass}>Banner</th>
                <th className={thClass}>Título</th>
                <th className={thClass}>Categoría</th>
                <th className={thClass}>Fecha</th>
                <th className={thClass}>Modalidad</th>
                <th className={thClass}>Estado</th>
                <th className={thClass}>Cupos</th>
                <th className={thClass}>Acciones</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDark
                ? "bg-gray-700 divide-gray-600"
                : "bg-white divide-gray-100"
                }`}
            >
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className={`px-4 py-10 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    No se encontraron eventos.
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const status = getEventStatus(event);
                  const statusCfg = eventStatusConfig[status];
                  const catCfg = categoryConfig[event.category] || {
                    label: event.category,
                    badgeClass: "bg-gray-100 text-gray-700",
                  };
                  const modalCfg = modalityConfig[event.modality] || {
                    label: event.modality,
                    icon: "📍",
                  };

                  return (
                    <tr
                      key={event.id}
                      className={
                        isDark ? "hover:bg-gray-600" : "hover:bg-gray-50"
                      }
                    >
                      {/* Banner thumbnail */}
                      <td className={tdClass}>
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {event.banner_url ? (
                            <img
                              src={event.banner_url}
                              alt={event.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.parentElement.innerHTML =
                                  '<div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sin banner</div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] text-center leading-tight p-1">
                              Sin banner
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Título */}
                      <td className={`${tdClass} max-w-[200px]`}>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium line-clamp-2 leading-snug">
                            {event.title}
                          </span>
                          {event.promo_modal && (
                            <Star className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 fill-yellow-400" />
                          )}
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className={tdClass}>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${catCfg.badgeClass}`}
                        >
                          {catCfg.label}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className={`${tdClass} whitespace-nowrap text-xs`}>
                        {formatEventDate(event.starts_at)}
                      </td>

                      {/* Modalidad */}
                      <td className={`${tdClass} whitespace-nowrap text-xs`}>
                        {modalCfg.icon} {modalCfg.label}
                      </td>

                      {/* Estado */}
                      <td className={tdClass}>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusCfg.badgeClass}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Cupos */}
                      <td className={`${tdClass} text-xs whitespace-nowrap`}>
                        {event.capacity === null
                          ? "Sin límite"
                          : `${event.capacity - (event.spots_left ?? 0)
                          } / ${event.capacity}`}
                      </td>

                      {/* Acciones */}
                      <td className={tdClass}>
                        <div className="flex items-center gap-1.5">
                          {/* Editar */}
                          <ActionBtn
                            title="Editar"
                            onClick={() => handleOpenEdit(event)}
                            isDark={isDark}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </ActionBtn>

                          {/* Preview */}
                          <ActionBtn
                            title="Ver previa"
                            onClick={() => setPreviewEvent(event)}
                            isDark={isDark}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </ActionBtn>

                          {/* Toggle publicar */}
                          <ActionBtn
                            title={
                              event.status === "published" ? "Despublicar" : "Publicar"
                            }
                            onClick={() => handleTogglePublish(event)}
                            isDark={isDark}
                          >
                            {event.status === "published" ? (
                              <ToggleRight className="w-4 h-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-gray-400" />
                            )}
                          </ActionBtn>

                          {/* Marcar como promo */}
                          <ActionBtn
                            title="Marcar como modal promo"
                            onClick={() => handleMarkAsPromo(event)}
                            isDark={isDark}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${event.promo_modal
                                ? "text-yellow-500 fill-yellow-400"
                                : "text-gray-400"
                                }`}
                            />
                          </ActionBtn>

                          {/* Eliminar */}
                          <ActionBtn
                            title="Eliminar"
                            onClick={() => handleDelete(event)}
                            isDark={isDark}
                            danger
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </ActionBtn>

                          {/* Ver detalles */}
                          <ActionBtn
                            title="Ver detalles"
                            onClick={() => setDrawerEvent(event)}
                            isDark={isDark}
                          >
                            Ver detalles
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <EventForm
          event={selectedEvent}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}

      {/* Event Detail Drawer */}
      {drawerEvent && (
        <EventDetailDrawer
          event={drawerEvent}
          onClose={() => setDrawerEvent(null)}
          onEdit={(ev) => {
            setDrawerEvent(null);
            handleOpenEdit(ev);
          }}
          onDelete={async (ev) => {
            setDrawerEvent(null);
            await handleDelete(ev);
          }}
          onRefetch={refetch}
        />
      )}

      {/* Public preview modal */}
      {previewEvent && (
        <EventPreviewModal
          event={previewEvent}
          onClose={() => setPreviewEvent(null)}
        />
      )}
    </div>
  );
}


