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
  CalendarPlus,
  SearchX,
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
import EventForm from "../forms/EventForm";
import EventPreviewModal from "../EventPreviewModal";
import EventDetailDrawer from "../EventDetailDrawer";
import InlineLoader from "../../ui/LoadingSpinner";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import ActionBtn from "../../ui/ActionBtn";
import { optimizeCloudinaryUrl } from "../../../utils/cloudinaryOptimize";
import ModalConfirmacion from "../../ui/ModalConfirmacion";

export default function EventsAdminTab() {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const { events, loading, error, refetch } = useAdminEvents();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // para editar
  const [previewEvent, setPreviewEvent] = useState(null); // para preview público
  const [drawerEvent, setDrawerEvent] = useState(null); // para el drawer de detalles
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Filtrado: si es editor, solo ve sus eventos creados
  const filtered = useMemo(() => {
    let result = events;
    if (profile?.role === "editor") {
      result = result.filter((e) => e.created_by === profile.id);
    }
    const term = searchTerm.toLowerCase().trim();
    if (!term) return result;
    return result.filter((e) => e.title.toLowerCase().includes(term));
  }, [searchTerm, events, profile]);

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

  // Crear o actualizar evento con comprobación de autoría
  const handleSave = async (formData) => {
    let result;
    if (selectedEvent) {
      result = await eventsService.updateEvent(
        selectedEvent.id,
        formData,
        profile?.role,
        profile?.id,
      );
    } else {
      result = await eventsService.createEvent(
        formData,
        profile?.role,
        profile?.id,
      );
    }

    if (result.success) {
      toast.success(
        selectedEvent ? "Evento actualizado" : "Evento creado correctamente",
      );
      handleCloseForm();
      refetch();
    } else {
      toast.error(result.error || "Error al guardar el evento");
    }
  };

  const handleTogglePublish = async (event) => {
    const canModify = isAdmin || event.created_by === profile?.id;
    if (!canModify) {
      toast.error("No tienes permiso para modificar este evento.");
      return;
    }

    const isPublished = event.status === "published";
    const action = isPublished ? "despublicar" : "publicar";

    // Validar en el cliente antes de llamar a la API
    if (!isPublished && event.starts_at) {
      const starts = new Date(event.starts_at);
      const now = new Date();
      if (starts < now) {
        toast.error(
          "No puedes publicar un evento cuya fecha de inicio ya ha pasado.",
        );
        return;
      }
    }

    setConfirmModal({
      open: true,
      title: isPublished ? "Despublicar evento" : "Publicar evento",
      message: `¿Estás seguro de que deseas ${action} "${event.title}"?`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        const { success, error } = await eventsService.updateEvent(
          event.id,
          { status: isPublished ? "draft" : "published" },
          profile?.role,
          profile?.id,
        );

        if (success) {
          toast.success(
            `Evento ${action === "publicar" ? "publicado" : "despublicado"} correctamente`,
          );
          refetch();
        } else {
          toast.error(error || "Error al actualizar el evento");
        }
      },
    });
  };

  const handleMarkAsPromo = async (event) => {
    const canModify = isAdmin || event.created_by === profile?.id;
    if (!canModify) {
      toast.error("No tienes permiso para modificar este evento.");
      return;
    }

    const isPromo = event.promo_modal;

    if (!isPromo) {
      if (event.status !== "published") {
        toast.error(
          "Debes publicar el evento antes de marcarlo como destacado.",
        );
        return;
      }

      // Validar en el cliente antes de llamar a la API
      if (event.starts_at) {
        const starts = new Date(event.starts_at);
        const now = new Date();
        if (starts < now) {
          toast.error(
            "No puedes marcar un evento pasado como destacado o promocional.",
          );
          return;
        }
      }
    }

    const message = isPromo
      ? `¿Deseas desmarcar "${event.title}" del modal promocional?`
      : `¿Deseas marcar "${event.title}" como el modal promocional? Esto reemplazará el evento promo actual.`;

    setConfirmModal({
      open: true,
      title: isPromo ? "Desmarcar destacado" : "Marcar destacado",
      message,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        const { success, error } = await eventsService.updateEvent(
          event.id,
          { promo_modal: !isPromo },
          profile?.role,
          profile?.id,
        );

        if (success) {
          toast.success(
            isPromo
              ? "Evento desmarcado como promocional"
              : "Evento marcado como promocional",
          );
          refetch();
        } else {
          toast.error(error || "Error al actualizar");
        }
      },
    });
  };

  const handleDelete = async (event) => {
    const canDelete = isAdmin || event.created_by === profile?.id;
    if (!canDelete) {
      toast.error("No tienes permiso para eliminar este evento.");
      return;
    }

    setConfirmModal({
      open: true,
      title: "Eliminar Evento",
      message: `¿Estás seguro de eliminar "${event.title}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        const { success, error } = await eventsService.deleteEvent(
          event.id,
          profile?.role,
          profile?.id,
        );
        if (success) {
          toast.success("Evento eliminado");
          refetch();
        } else {
          toast.error(error || "Error al eliminar el evento");
        }
      },
    });
  };

  const containerClass = `rounded-lg shadow-md p-6 w-full h-full flex flex-col ${
    isDark ? "bg-gray-800" : "bg-white"
  }`;

  const thClass = `px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap ${
    isDark ? "text-gray-300" : "text-gray-500"
  }`;

  const tdClass = `px-4 py-3 text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`;

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2
          className={`text-xl font-semibold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
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
              className={`pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition-colors ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
                  : "bg-white border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary/20"
              }`}
            />
          </div>

          <button
            type="button"
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

      {/* Tabla y Estado Vacío */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner">
                {searchTerm.trim() ? (
                  <SearchX className="w-8 h-8" />
                ) : (
                  <CalendarPlus className="w-8 h-8" />
                )}
              </div>

              <h3
                className={`text-lg font-bold mb-1.5 font-heading ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {searchTerm.trim()
                  ? `Sin resultados para "${searchTerm}"`
                  : profile?.role === "editor"
                    ? "¡Aún no has creado ningún evento!"
                    : "No hay eventos registrados"}
              </h3>

              <p
                className={`text-sm max-w-md mb-6 leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {searchTerm.trim()
                  ? "No encontramos eventos que coincidan con tu búsqueda. Intenta con otros términos o limpia el buscador."
                  : profile?.role === "editor"
                    ? "Comienza a publicar iniciativas, talleres o webinars para la comunidad académica de EDU-US."
                    : "Aún no se ha publicado ningún evento en la plataforma. Comienza creando el primero."}
              </p>

              {searchTerm.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
                >
                  Limpiar búsqueda
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] font-heading"
                >
                  <Plus className="w-4 h-4" />
                  {profile?.role === "editor"
                    ? "Crear mi primer evento"
                    : "Crear evento"}
                </button>
              )}
            </div>
          ) : (
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
                  className={`divide-y ${
                    isDark
                      ? "bg-gray-700 divide-gray-600"
                      : "bg-white divide-gray-100"
                  }`}
                >
                  {filtered.map((event) => {
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
                                src={optimizeCloudinaryUrl(event.banner_url, {
                                  width: 100,
                                })}
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
                            : `${
                                event.capacity - (event.spots_left ?? 0)
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
                                event.status === "published"
                                  ? "Despublicar"
                                  : "Publicar"
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
                                className={`w-3.5 h-3.5 ${
                                  event.promo_modal
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
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
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

      {/* Confirmation modal */}
      <ModalConfirmacion
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
