import { useState, useRef, useEffect, useMemo } from "react";
import {
  X,
  Loader2,
  ImagePlus,
  Trash2,
  FileText,
  User,
  Plus,
  ChevronUp,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Sparkles,
  DollarSign,
  Tag,
  Check,
  Layers,
  ArrowRight,
  ArrowLeft,
  Info,
  Globe,
  Building,
  Monitor,
} from "lucide-react";
import {
  categoryConfig,
  modalityConfig,
  EVENT_STATUS_OPTIONS,
  toPeruDateTimeLocal,
  peruDateTimeLocalToIso,
} from "../../../utils/events";
import { eventSchema } from "../../../utils/validationSchemas";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";
import { speakersService } from "../../../services/speakersService";
import BannerUpload from "../EventBannerUpload";
import DateTimePicker from "../../ui/DateTimePicker";
import toast from "react-hot-toast";
import { createSlug } from "../../../utils/slugify";

const CATEGORIES = Object.entries(categoryConfig).map(([value, cfg]) => ({
  value,
  label: cfg.label,
  dotClass: cfg.dotClass,
  badgeClass: cfg.badgeClass,
}));

const MODALITIES = [
  {
    value: "virtual",
    label: "Virtual",
    icon: Monitor,
    desc: "Sesión 100% online con enlace de Zoom",
  },
  {
    value: "presencial",
    label: "Presencial",
    icon: Building,
    desc: "Encuentro en campus o locación física",
  },
  {
    value: "hibrido",
    label: "Híbrido",
    icon: Globe,
    desc: "Asistencia física y transmisión online",
  },
];

const TABS = [
  { id: "general", label: "General", icon: Layers },
  { id: "schedule", label: "Fecha y Aforo", icon: Calendar },
  { id: "speakers", label: "Ponentes", icon: Users },
  { id: "media", label: "Multimedia", icon: ImagePlus },
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "",
  modality: "virtual",
  description: "",
  location: "",
  banner_url: "",
  starts_at: "",
  ends_at: "",
  capacity: "",
  price: "0",
  promo_modal: false,
  registration_url: "",
  status: "draft",
  speaker_id: "",
  speaker_ids: [],
  directed_to: "",
  extra_details: "",
  brochure_url: "",
  zoom_link: "",
  benefits: ["", "", ""],
};

/**
 * EventForm — Modal de creación y edición de eventos con diseño moderno Impeccable.
 */
export default function EventForm({ event = null, onClose, onSave }) {
  const isEditing = !!event;
  const [activeTab, setActiveTab] = useState("general");

  const [form, setForm] = useState(() => {
    if (!isEditing) return { ...EMPTY_FORM };

    // Extraer array de speaker_ids con retrocompatibilidad
    let initialSpeakerIds = [];
    if (Array.isArray(event.speaker_ids) && event.speaker_ids.length > 0) {
      initialSpeakerIds = event.speaker_ids;
    } else if (Array.isArray(event.speakers) && event.speakers.length > 0) {
      initialSpeakerIds = event.speakers.map((s) => s.id);
    } else if (
      Array.isArray(event.event_speakers) &&
      event.event_speakers.length > 0
    ) {
      initialSpeakerIds = event.event_speakers
        .slice()
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((es) => es.speaker_id || es.speaker?.id)
        .filter(Boolean);
    } else if (event.speaker_id) {
      initialSpeakerIds = [event.speaker_id];
    }

    return {
      ...EMPTY_FORM,
      ...event,
      capacity: event.capacity ?? "",
      price: event.price ?? "0",
      registration_url: event.registration_url ?? "",
      status: event.status ?? "draft",
      starts_at: toPeruDateTimeLocal(event.starts_at),
      ends_at: toPeruDateTimeLocal(event.ends_at),
      directed_to: event.directed_to ?? "",
      extra_details: event.extra_details ?? "",
      brochure_url: event.brochure_url ?? "",
      zoom_link: event.zoom_link ?? "",
      speaker_id: initialSpeakerIds[0] || "",
      speaker_ids: initialSpeakerIds,
      benefits:
        event.benefits && Array.isArray(event.benefits)
          ? [...event.benefits, "", "", ""].slice(0, 3)
          : ["", "", ""],
    };
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Archivo banner
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(
    isEditing && event.banner_url ? event.banner_url : null,
  );
  const fileInputRef = useRef(null);

  // Archivo brochure
  const [brochureFile, setBrochureFile] = useState(null);
  const brochureInputRef = useRef(null);

  // Ponentes de la BD
  const [speakersList, setSpeakersList] = useState([]);
  const [showNewSpeakerForm, setShowNewSpeakerForm] = useState(false);

  // Registro de nuevo ponente inline
  const [newSpeaker, setNewSpeaker] = useState({
    name: "",
    role: "",
    company: "",
    avatar_url: "",
  });
  const [newSpeakerAvatarFile, setNewSpeakerAvatarFile] = useState(null);
  const [newSpeakerAvatarPreview, setNewSpeakerAvatarPreview] = useState(null);
  const newSpeakerAvatarInputRef = useRef(null);
  const [creatingSpeaker, setCreatingSpeaker] = useState(false);

  // Cargar lista de ponentes
  useEffect(() => {
    let active = true;
    const fetchSpeakers = async () => {
      const res = await speakersService.getSpeakers();
      if (res.success && active && res.data) {
        setSpeakersList(res.data);
      }
    };
    fetchSpeakers();
    return () => {
      active = false;
    };
  }, []);

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    clearError("banner_url");
  };

  const handleBannerDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    clearError("banner_url");
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setForm((prev) => ({ ...prev, banner_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBrochureFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBrochureFile(file);
    setForm((prev) => ({ ...prev, brochure_url: file.name }));
    clearError("brochure_url");
  };

  const handleRemoveBrochureFile = () => {
    setBrochureFile(null);
    setForm((prev) => ({ ...prev, brochure_url: "" }));
    if (brochureInputRef.current) brochureInputRef.current.value = "";
  };

  // Crear ponente inline
  const handleCreateSpeakerInline = async () => {
    if (!newSpeaker.name.trim() || !newSpeaker.role.trim()) {
      toast.error("El nombre y cargo del ponente son obligatorios.");
      return;
    }
    setCreatingSpeaker(true);
    const toastId = toast.loading("Registrando ponente...");
    try {
      const payload = { ...newSpeaker };
      if (newSpeakerAvatarFile) {
        payload.avatar_url =
          await uploadImageToCloudinary(newSpeakerAvatarFile);
      }
      const res = await speakersService.createSpeaker(payload);
      if (res.success && res.data) {
        toast.success("Ponente registrado y agregado al evento", {
          id: toastId,
        });
        setSpeakersList((prev) =>
          [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setForm((prev) => {
          const currentIds = prev.speaker_ids || [];
          const updatedIds = currentIds.includes(res.data.id)
            ? currentIds
            : [...currentIds, res.data.id];
          return {
            ...prev,
            speaker_ids: updatedIds,
            speaker_id: updatedIds[0] || "",
          };
        });

        setNewSpeaker({ name: "", role: "", company: "", avatar_url: "" });
        setNewSpeakerAvatarFile(null);
        setNewSpeakerAvatarPreview(null);
        setShowNewSpeakerForm(false);
      } else {
        toast.error(res.error || "Error al crear ponente", { id: toastId });
      }
    } catch (err) {
      toast.error("Error al registrar ponente: " + err.message, {
        id: toastId,
      });
    } finally {
      setCreatingSpeaker(false);
    }
  };

  const handleAddSpeaker = (speakerId) => {
    if (!speakerId) return;
    setForm((prev) => {
      const currentIds = prev.speaker_ids || [];
      if (currentIds.includes(speakerId)) return prev;
      const updatedIds = [...currentIds, speakerId];
      return {
        ...prev,
        speaker_ids: updatedIds,
        speaker_id: updatedIds[0] || "",
      };
    });
    clearError("speaker_ids");
  };

  const handleRemoveSpeaker = (speakerId) => {
    setForm((prev) => {
      const updatedIds = (prev.speaker_ids || []).filter(
        (id) => id !== speakerId,
      );
      return {
        ...prev,
        speaker_ids: updatedIds,
        speaker_id: updatedIds[0] || "",
      };
    });
  };

  const handleMoveSpeaker = (index, direction) => {
    setForm((prev) => {
      const ids = [...(prev.speaker_ids || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= ids.length) return prev;
      const temp = ids[index];
      ids[index] = ids[targetIndex];
      ids[targetIndex] = temp;
      return {
        ...prev,
        speaker_ids: ids,
        speaker_id: ids[0] || "",
      };
    });
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      ...(prev.slug === createSlug(prev.title)
        ? { slug: createSlug(title) }
        : {}),
    }));
    clearError("title");
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "status") {
      setForm((prev) => ({ ...prev, status: value }));
      clearError(name);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
    clearError(name);
  };

  const validate = () => {
    const checkForm = {
      ...form,
      banner_url: bannerFile
        ? "https://placeholder-banner.jpg"
        : form.banner_url || "",
      capacity: form.capacity === "" ? null : Number(form.capacity),
      price: form.price === "" ? null : Number(form.price),
      brochure_url: brochureFile
        ? "https://placeholder-brochure.pdf"
        : form.brochure_url,
      speaker_ids: form.speaker_ids || [],
    };

    const result = eventSchema.safeParse(checkForm);
    if (result.success) return {};

    return result.error.issues.reduce((acc, issue) => {
      const field = issue.path[0];
      if (field && !acc[field]) acc[field] = issue.message;
      return acc;
    }, {});
  };

  // Detección de errores por pestaña
  const tabErrors = useMemo(() => {
    return {
      general: Boolean(
        errors.title ||
        errors.category ||
        errors.modality ||
        errors.description ||
        errors.directed_to ||
        errors.location ||
        errors.zoom_link,
      ),
      schedule: Boolean(
        errors.starts_at || errors.ends_at || errors.capacity || errors.price,
      ),
      speakers: Boolean(errors.speaker_ids),
      media: Boolean(errors.banner_url || errors.brochure_url),
    };
  }, [errors]);

  const buildPayload = (forcePublish = false) => {
    const filteredBenefits = (form.benefits || [])
      .map((b) => b.trim())
      .filter(Boolean);

    return {
      ...form,
      starts_at: peruDateTimeLocalToIso(form.starts_at),
      ends_at: peruDateTimeLocalToIso(form.ends_at),
      capacity: form.capacity === "" ? null : Number(form.capacity),
      price: form.price === "" ? null : Number(form.price),
      status: forcePublish ? "published" : form.status,
      registration_url: form.registration_url?.trim() || null,
      zoom_link:
        form.modality === "virtual" || form.modality === "hibrido"
          ? form.zoom_link?.trim() || null
          : null,
      location:
        form.modality !== "virtual" ? form.location?.trim() || null : null,
      benefits: filteredBenefits,
      speaker_id: form.speaker_ids?.[0] || form.speaker_id || null,
      speaker_ids: form.speaker_ids || [],
    };
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Por favor, corrige los campos requeridos.");

      if (
        validationErrors.title ||
        validationErrors.category ||
        validationErrors.modality ||
        validationErrors.description ||
        validationErrors.directed_to ||
        validationErrors.location ||
        validationErrors.zoom_link
      ) {
        setActiveTab("general");
      } else if (
        validationErrors.starts_at ||
        validationErrors.ends_at ||
        validationErrors.capacity ||
        validationErrors.price
      ) {
        setActiveTab("schedule");
      } else if (validationErrors.speaker_ids) {
        setActiveTab("speakers");
      } else if (validationErrors.banner_url || validationErrors.brochure_url) {
        setActiveTab("media");
      }
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      isEditing
        ? "Guardando cambios..."
        : form.status === "published"
          ? "Publicando evento..."
          : "Guardando borrador...",
    );
    try {
      const payload = buildPayload(
        !isEditing ? form.status === "published" : false,
      );
      if (bannerFile) {
        payload.banner_url = await uploadImageToCloudinary(bannerFile);
      }
      if (brochureFile) {
        payload.brochure_url = await uploadImageToCloudinary(brochureFile);
      }
      await onSave(payload);
      toast.dismiss(toastId);
    } catch (err) {
      console.error(err);
      toast.error(
        "Error al guardar: " + (err.message || "inténtalo de nuevo"),
        { id: toastId },
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (err) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
      err
        ? "border-red-400 dark:border-red-500 bg-red-50/40 dark:bg-red-950/20"
        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700"
    }`;

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden my-auto border border-gray-200 dark:border-gray-800 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Elegante con Icono y Control de Publicación (Switch) */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/60 dark:bg-gray-900/60 backdrop-blur-sm gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-inner flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-light font-heading truncate">
                {isEditing ? "Editar Evento" : "Crear Nuevo Evento"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate hidden sm:block">
                {isEditing
                  ? "Modifica los detalles, ponentes y configuración del evento"
                  : "Completa la información para publicar o guardar un borrador"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Control Switch / Selector de Estado de Publicación */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800/90 py-1.5 px-2.5 sm:px-3 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:inline">
                Estado:
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={form.status === "published"}
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    status: prev.status === "published" ? "draft" : "published",
                  }));
                  clearError("status");
                }}
                className="flex items-center gap-2 cursor-pointer select-none group focus:outline-none"
                title={
                  form.status === "published"
                    ? "El evento será público. Clic para cambiar a Borrador."
                    : "El evento es un borrador. Clic para Publicar."
                }
              >
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                    form.status === "published"
                      ? "bg-emerald-500"
                      : form.status === "cancelled"
                        ? "bg-rose-500"
                        : form.status === "finished"
                          ? "bg-blue-500"
                          : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      form.status === "published"
                        ? "translate-x-4"
                        : "translate-x-0"
                    }`}
                  />
                </div>

                <span
                  className={`text-xs font-bold transition-colors ${
                    form.status === "published"
                      ? "text-emerald-700 dark:text-emerald-400"
                      : form.status === "cancelled"
                        ? "text-rose-700 dark:text-rose-400"
                        : form.status === "finished"
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {form.status === "published"
                    ? "Publicado"
                    : form.status === "cancelled"
                      ? "Cancelado"
                      : form.status === "finished"
                        ? "Finalizado"
                        : "Borrador"}
                </span>
              </button>

              {isEditing && (
                <div className="relative pl-1.5 border-l border-gray-200 dark:border-gray-700">
                  <select
                    value={form.status}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, status: e.target.value }));
                      clearError("status");
                    }}
                    className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-transparent border-0 py-0 pl-1 pr-4 cursor-pointer focus:ring-0 focus:outline-none"
                    title="Cambiar estado del evento"
                  >
                    {EVENT_STATUS_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Pestañas (Segmented Tabs) */}
        <div className="px-6 pt-3 pb-0 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-3">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              const hasError = tabErrors[tab.id];

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>

                  {/* Indicador de error en la pestaña */}
                  {hasError && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive
                          ? "bg-white"
                          : "bg-red-500 ring-2 ring-white dark:ring-gray-900"
                      }`}
                      title="Esta sección tiene campos incompletos"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body Scrollable con Pestañas Activas */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: INFORMACIÓN GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <Field label="Título del Evento" required error={errors.title}>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="Ej. Taller Práctico: Postulación a Becas Internacionales"
                  className={inputClass(errors.title)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Slug (URL amigable del evento)"
                  helper="Se auto-genera desde el título o puedes personalizarlo."
                >
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-gray-400 select-none">
                      /eventos/
                    </span>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="nombre-del-evento"
                      className={`${inputClass()} pl-20 font-mono text-xs`}
                    />
                  </div>
                </Field>

                <Field label="Categoría" required error={errors.category}>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass(errors.category)}
                  >
                    <option value="">Selecciona una categoría</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Selector Visual de Modalidad */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Modalidad del Evento <span className="text-primary">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MODALITIES.map((mod) => {
                    const ModIcon = mod.icon;
                    const isSelected = form.modality === mod.value;
                    return (
                      <button
                        key={mod.value}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, modality: mod.value }));
                          clearError("modality");
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm ring-2 ring-primary/20"
                            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                            }`}
                          >
                            <ModIcon className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-light">
                            {mod.label}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                            {mod.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.modality && (
                  <p className="text-xs text-red-600 mt-1">{errors.modality}</p>
                )}
              </div>

              {/* Campos dinámicos según Modalidad */}
              {(form.modality === "virtual" || form.modality === "hibrido") && (
                <Field
                  label="Enlace de Zoom / Sesión Online"
                  required
                  error={errors.zoom_link}
                  helper="Este enlace está protegido: no es público y solo se enviará por correo a inscritos confirmados."
                >
                  <div className="relative">
                    <Video className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      name="zoom_link"
                      value={form.zoom_link || ""}
                      onChange={handleChange}
                      placeholder="https://zoom.us/j/123456789..."
                      className={`${inputClass(errors.zoom_link)} pl-10`}
                    />
                  </div>
                </Field>
              )}

              {form.modality !== "virtual" && (
                <Field
                  label="Ubicación física / Lugar"
                  required
                  error={errors.location}
                  helper="Especifica el campus, auditorio o dirección exacta."
                >
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      name="location"
                      value={form.location || ""}
                      onChange={handleChange}
                      placeholder="Ej. Campus Universidad de Piura, Edificio 3, Aula Magna"
                      className={`${inputClass(errors.location)} pl-10`}
                    />
                  </div>
                </Field>
              )}

              <Field
                label="Dirigido a"
                required
                error={errors.directed_to}
                helper="Define la audiencia objetivo del evento."
              >
                <input
                  name="directed_to"
                  value={form.directed_to || ""}
                  onChange={handleChange}
                  placeholder="Ej. Estudiantes universitarios de Piura, recién egresados e investigadores"
                  className={inputClass(errors.directed_to)}
                />
              </Field>

              <Field
                label="Descripción del Evento"
                required
                error={errors.description}
              >
                <div className="relative">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe de qué trata el evento, qué temas se abordarán y por qué es relevante..."
                    className={`${inputClass(errors.description)} resize-none`}
                  />
                  <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-400 select-none">
                    {form.description?.length || 0} caracteres
                  </span>
                </div>
              </Field>
            </div>
          )}

          {/* TAB 2: FECHA Y AFORO */}
          {activeTab === "schedule" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  <p className="font-bold text-gray-900 dark:text-light mb-0.5">
                    Zona horaria oficial: Perú (UTC-5)
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Las fechas y horas seleccionadas se guardan de forma exacta
                    en UTC y se presentarán de forma uniforme en la web, correos
                    y recordatorios automáticos.
                  </p>
                </div>
              </div>

              {/* Selector Moderno de Fechas con DateTimePicker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DateTimePicker
                  label="Fecha y Hora de Inicio"
                  required
                  name="starts_at"
                  value={form.starts_at}
                  onChange={handleChange}
                  error={errors.starts_at}
                  placeholder="Elegir inicio del evento..."
                />

                <DateTimePicker
                  label="Fecha y Hora de Fin (Opcional)"
                  name="ends_at"
                  value={form.ends_at}
                  onChange={handleChange}
                  minDate={form.starts_at}
                  error={errors.ends_at}
                  placeholder="Elegir finalización..."
                />
              </div>

              {/* Aforo, Precio y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-gray-100 dark:border-gray-800">
                {/* Aforo */}
                <Field
                  label="Capacidad / Aforo Máximo"
                  helper="Deja vacío para capacidad ilimitada."
                  error={errors.capacity}
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="number"
                        name="capacity"
                        min="1"
                        value={form.capacity}
                        onChange={handleChange}
                        placeholder="Ilimitado"
                        className={`${inputClass(errors.capacity)} pl-10`}
                      />
                    </div>
                    {/* Chips rápidos de aforo */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">
                        Rápido:
                      </span>
                      {[
                        { label: "Ilimitado", val: "" },
                        { label: "30", val: "30" },
                        { label: "50", val: "50" },
                        { label: "100", val: "100" },
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, capacity: chip.val }))
                          }
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                            form.capacity === chip.val
                              ? "bg-primary text-white border-primary font-bold shadow-sm"
                              : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary/40"
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Field>

                {/* Precio */}
                <Field label="Precio del Evento" error={errors.price}>
                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400 select-none">
                        S/
                      </span>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`${inputClass(errors.price)} pl-9 font-semibold`}
                      />
                    </div>
                    {/* Chips rápidos de precio */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">
                        Rápido:
                      </span>
                      {[
                        { label: "Gratis (S/ 0)", val: "0" },
                        { label: "S/ 15", val: "15" },
                        { label: "S/ 30", val: "30" },
                        { label: "S/ 50", val: "50" },
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, price: chip.val }))
                          }
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                            form.price === chip.val
                              ? "bg-primary text-white border-primary font-bold shadow-sm"
                              : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary/40"
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* TAB 3: PONENTES (MANY-TO-MANY) */}
          {activeTab === "speakers" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-light font-heading">
                    Ponentes Asignados ({form.speaker_ids?.length || 0})
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Asigna ponentes, cambia su orden de aparición o registra uno
                    nuevo.
                  </p>
                </div>
                {!showNewSpeakerForm && (
                  <button
                    type="button"
                    onClick={() => setShowNewSpeakerForm(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nuevo Ponente
                  </button>
                )}
              </div>

              {!showNewSpeakerForm ? (
                <div className="space-y-4">
                  {/* Selector para agregar */}
                  <Field
                    label="Agregar ponente de la base de datos"
                    error={errors.speaker_ids}
                  >
                    <select
                      id="speaker-selector-add"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) handleAddSpeaker(e.target.value);
                      }}
                      className={inputClass(errors.speaker_ids)}
                    >
                      <option value="">
                        {speakersList.filter(
                          (s) => !form.speaker_ids?.includes(s.id),
                        ).length > 0
                          ? "+ Seleccionar ponente para añadir..."
                          : "Todos los ponentes disponibles ya están asignados"}
                      </option>
                      {speakersList
                        .filter((s) => !form.speaker_ids?.includes(s.id))
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — {s.role}{" "}
                            {s.company ? `(${s.company})` : ""}
                          </option>
                        ))}
                    </select>
                  </Field>

                  {/* Lista de ponentes seleccionados */}
                  {form.speaker_ids && form.speaker_ids.length > 0 ? (
                    <div className="space-y-2">
                      {form.speaker_ids.map((id, index) => {
                        const speakerData = speakersList.find(
                          (s) => s.id === id,
                        );
                        if (!speakerData) return null;
                        const isFirst = index === 0;
                        const isLast = index === form.speaker_ids.length - 1;

                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 hover:border-primary/40 transition-all gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {speakerData.avatar_url ? (
                                <img
                                  src={speakerData.avatar_url}
                                  alt={speakerData.name}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20 flex-shrink-0">
                                  {speakerData.name.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                                    {speakerData.name}
                                  </span>
                                  {index === 0 && (
                                    <span className="text-[9px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                      Principal
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                  {speakerData.role}{" "}
                                  {speakerData.company
                                    ? `• ${speakerData.company}`
                                    : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              {form.speaker_ids.length > 1 && (
                                <>
                                  <button
                                    type="button"
                                    disabled={isFirst}
                                    onClick={() =>
                                      handleMoveSpeaker(index, "up")
                                    }
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-20 transition-colors"
                                    title="Mover arriba"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isLast}
                                    onClick={() =>
                                      handleMoveSpeaker(index, "down")
                                    }
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-20 transition-colors"
                                    title="Mover abajo"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveSpeaker(id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-1"
                                title="Quitar del evento"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                      <User className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        No hay ponentes asignados
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Selecciona uno en el desplegable superior o crea uno
                        nuevo.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Formulario Inline para registrar nuevo ponente */
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-light uppercase tracking-wider font-heading">
                      Registrar Nuevo Ponente
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowNewSpeakerForm(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nombre completo" required>
                      <input
                        value={newSpeaker.name}
                        onChange={(e) =>
                          setNewSpeaker((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Ej. Dra. Sofía Martínez"
                        className={inputClass()}
                      />
                    </Field>
                    <Field label="Cargo / Especialidad" required>
                      <input
                        value={newSpeaker.role}
                        onChange={(e) =>
                          setNewSpeaker((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        placeholder="Ej. Especialista en Becas Erasmus+"
                        className={inputClass()}
                      />
                    </Field>
                  </div>

                  <Field label="Institución / Empresa">
                    <input
                      value={newSpeaker.company}
                      onChange={(e) =>
                        setNewSpeaker((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      placeholder="Ej. Comisión Europea o Banco Mundial"
                      className={inputClass()}
                    />
                  </Field>

                  {/* Avatar Upload */}
                  <Field label="Foto de perfil del ponente">
                    <div className="flex items-center gap-4">
                      {newSpeakerAvatarPreview ? (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 group">
                          <img
                            src={newSpeakerAvatarPreview}
                            alt="Previsualización"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => {
                                setNewSpeakerAvatarFile(null);
                                setNewSpeakerAvatarPreview(null);
                              }}
                              className="p-1 text-white hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            newSpeakerAvatarInputRef.current?.click()
                          }
                          className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary text-gray-400 hover:text-primary flex flex-col items-center justify-center transition-colors"
                        >
                          <ImagePlus className="w-4 h-4 mb-0.5" />
                          <span className="text-[9px] font-bold">Subir</span>
                        </button>
                      )}

                      <div className="text-[11px] text-gray-500">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                          Foto o Avatar
                        </p>
                        <p className="text-gray-400">
                          PNG o JPG cuadrado (máx. 2 MB)
                        </p>
                      </div>

                      <input
                        ref={newSpeakerAvatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewSpeakerAvatarFile(file);
                            setNewSpeakerAvatarPreview(
                              URL.createObjectURL(file),
                            );
                          }
                        }}
                      />
                    </div>
                  </Field>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewSpeakerForm(false)}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={creatingSpeaker}
                      onClick={handleCreateSpeakerInline}
                      className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/95 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-md shadow-primary/20"
                    >
                      {creatingSpeaker && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      Guardar Ponente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MULTIMEDIA Y DETALLES */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Banner Obligatorio */}
              <Field
                label="Banner Principal del Evento"
                required
                error={errors.banner_url}
                helper="Imagen destacada que se mostrará en las tarjetas, banners y páginas de detalle (Recomendado: 1200x630 px)."
              >
                <BannerUpload
                  bannerPreview={bannerPreview}
                  fileInputRef={fileInputRef}
                  onDrop={handleBannerDrop}
                  onChange={handleBannerChange}
                  onRemove={handleRemoveBanner}
                  hasError={!!errors.banner_url}
                />
              </Field>

              {/* Brochure PDF */}
              <Field
                label={
                  form.modality === "presencial"
                    ? "Brochure Informativo (Obligatorio en eventos presenciales)"
                    : "Brochure Informativo (Opcional)"
                }
                required={form.modality === "presencial"}
                error={errors.brochure_url}
                helper="Documento PDF descargable con el cronograma y detalles."
              >
                <div className="space-y-2">
                  <input
                    name="brochure_url"
                    value={form.brochure_url || ""}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/brochure.pdf o sube un archivo"
                    className={inputClass(errors.brochure_url)}
                  />
                  <div className="flex items-center gap-3">
                    <input
                      ref={brochureInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      className="hidden"
                      onChange={handleBrochureFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => brochureInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      {brochureFile
                        ? `Archivo listo: ${brochureFile.name.substring(0, 25)}...`
                        : "Cargar archivo PDF"}
                    </button>
                    {brochureFile && (
                      <button
                        type="button"
                        onClick={handleRemoveBrochureFile}
                        className="text-xs text-red-500 hover:underline font-semibold"
                      >
                        Quitar archivo
                      </button>
                    )}
                  </div>
                </div>
              </Field>

              {/* Beneficios Clave */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Beneficios Destacados (Hasta 3 viñetas)
                </label>
                <p className="text-[11px] text-gray-400 mb-2">
                  Aparecerán con checkmarks en la página pública del evento.
                </p>
                {[0, 1, 2].map((idx) => (
                  <div
                    key={`benefit-${idx}`}
                    className="flex items-center gap-2"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      ✓
                    </span>
                    <input
                      value={form.benefits?.[idx] || ""}
                      onChange={(e) => {
                        const newBenefits = [
                          ...(form.benefits || ["", "", ""]),
                        ];
                        newBenefits[idx] = e.target.value;
                        setForm((prev) => ({ ...prev, benefits: newBenefits }));
                      }}
                      placeholder={`Beneficio ${idx + 1} (ej. Certificado de participación gratuito)`}
                      className={inputClass()}
                    />
                  </div>
                ))}
              </div>

              {/* Detalles Extras */}
              <Field
                label="Detalles o Requisitos Adicionales (Opcional)"
                helper="Información de interés como materiales requeridos, vestimenta o requisitos previos."
              >
                <textarea
                  name="extra_details"
                  value={form.extra_details || ""}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej. Traer documento de identidad y laptop propia para los talleres prácticos."
                  className={`${inputClass()} resize-none`}
                />
              </Field>
            </div>
          )}
        </div>

        {/* Footer de Acciones con Navegación y Guardado */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Navegación anterior / siguiente entre pestañas */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentTabIndex > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab(TABS[currentTabIndex - 1].id)}
                className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Anterior
              </button>
            )}

            {currentTabIndex < TABS.length - 1 && (
              <button
                type="button"
                onClick={() => setActiveTab(TABS[currentTabIndex + 1].id)}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Siguiente: {TABS[currentTabIndex + 1].label}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Botones principales de acción */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {isEditing
                ? "Guardar Cambios"
                : form.status === "published"
                  ? "Publicar Evento"
                  : "Guardar como Borrador"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers de formulario ─── */

function Field({ label, required, error, helper, children }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      {children}
      {helper && !error && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 leading-normal">
          {helper}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
