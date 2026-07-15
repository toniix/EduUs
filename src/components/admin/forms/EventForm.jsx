import { useState, useRef, useEffect } from "react";
import { X, AlertTriangle, Loader2, ImagePlus, Trash2, FileText } from "lucide-react";
import {
  categoryConfig,
  modalityConfig,
  EVENT_STATUS_OPTIONS,
} from "../../../utils/events";
import { eventSchema } from "../../../utils/validationSchemas";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";
import { speakersService } from "../../../services/speakersService";
import BannerUpload from "../EventBannerUpload";
import toast from "react-hot-toast";
import { createSlug } from "../../../utils/slugify";

const CATEGORIES = Object.entries(categoryConfig).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

const MODALITIES = Object.entries(modalityConfig).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "",
  modality: "",
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
  directed_to: "",
  extra_details: "",
  brochure_url: "",
  zoom_link: "",
  benefits: ["", "", ""],
};

/**
 * EventForm — modal para crear o editar un evento con ponentes relacionales.
 */
export default function EventForm({ event = null, onClose, onSave }) {
  const isEditing = !!event;

  const [form, setForm] = useState(() =>
    isEditing
      ? {
          ...EMPTY_FORM,
          ...event,
          capacity: event.capacity ?? "",
          price: event.price ?? "0",
          registration_url: event.registration_url ?? "",
          status: event.status ?? "draft",
          starts_at: event.starts_at ? event.starts_at.slice(0, 16) : "",
          ends_at: event.ends_at ? event.ends_at.slice(0, 16) : "",
          directed_to: event.directed_to ?? "",
          extra_details: event.extra_details ?? "",
          brochure_url: event.brochure_url ?? "",
          zoom_link: event.zoom_link ?? "",
          speaker_id: event.speaker_id ?? "",
          benefits: event.benefits && Array.isArray(event.benefits)
            ? [...event.benefits, "", "", ""].slice(0, 3)
            : ["", "", ""],
        }
      : { ...EMPTY_FORM },
  );

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPromoWarning, setShowPromoWarning] = useState(false);
  
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
  };

  const handleBannerDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
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
        payload.avatar_url = await uploadImageToCloudinary(newSpeakerAvatarFile);
      }
      const res = await speakersService.createSpeaker(payload);
      if (res.success && res.data) {
        toast.success("Ponente registrado y seleccionado", { id: toastId });
        setSpeakersList((prev) =>
          [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name))
        );
        setForm((prev) => ({ ...prev, speaker_id: res.data.id }));
        
        // Reset del formulario de ponente inline
        setNewSpeaker({ name: "", role: "", company: "", avatar_url: "" });
        setNewSpeakerAvatarFile(null);
        setNewSpeakerAvatarPreview(null);
        setShowNewSpeakerForm(false);
      } else {
        toast.error(res.error || "Error al crear ponente", { id: toastId });
      }
    } catch (err) {
      toast.error("Error al registrar ponente: " + err.message, { id: toastId });
    } finally {
      setCreatingSpeaker(false);
    }
  };

  // Auto-generar slug cuando cambia el título
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

    if (name === "promo_modal" && checked) {
      setShowPromoWarning(true);
    }

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
      capacity: form.capacity === "" ? null : Number(form.capacity),
      price: form.price === "" ? null : Number(form.price),
      brochure_url: brochureFile ? "https://placeholder-brochure.pdf" : form.brochure_url,
    };

    const result = eventSchema.safeParse(checkForm);

    if (result.success) return {};

    return result.error.issues.reduce((acc, issue) => {
      const field = issue.path[0];
      if (field && !acc[field]) acc[field] = issue.message;
      return acc;
    }, {});
  };

  const buildPayload = (forcePublish = false) => {
    const filteredBenefits = (form.benefits || [])
      .map((b) => b.trim())
      .filter(Boolean);

    return {
      ...form,
      capacity: form.capacity === "" ? null : Number(form.capacity),
      price: form.price === "" ? null : Number(form.price),
      status: forcePublish ? "published" : form.status,
      registration_url: form.registration_url?.trim() || null,
      zoom_link: (form.modality === "virtual" || form.modality === "hibrido") ? form.zoom_link?.trim() || null : null,
      location: form.modality !== "virtual" ? form.location?.trim() || null : null,
      benefits: filteredBenefits,
      speaker_id: form.speaker_id || null,
    };
  };

  const handleSaveDraft = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Por favor, corrige los errores en el formulario.");
      return;
    }
    setSaving(true);
    const toastId = toast.loading("Guardando borrador y subiendo archivos...");
    try {
      const payload = buildPayload(false);
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

  const handlePublishAndSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Por favor, corrige los errores en el formulario.");
      return;
    }
    setSaving(true);
    const toastId = toast.loading("Publicando evento y subiendo archivos...");
    try {
      const payload = buildPayload(true);
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
        "Error al publicar: " + (err.message || "inténtalo de nuevo"),
        { id: toastId },
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col text-gray-900 dark:text-light">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-base font-bold text-gray-900 dark:text-light">
            {isEditing ? "Editar evento" : "Crear nuevo evento"}
          </h2>
          <button type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* SECCIÓN 1: Información Básica */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider font-heading">
              1. Información Básica
            </h3>
            
            <Field label="Título del Evento" required error={errors.title}>
              <input
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Nombre del evento"
                className={inputClass(errors.title)}
              />
            </Field>

            <Field label="Slug (URL amigable)">
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="slug-del-evento"
                className={inputClass()}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Categoría" required error={errors.category}>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass(errors.category)}
                >
                  <option value="">Seleccionar</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Modalidad" required error={errors.modality}>
                <select
                  name="modality"
                  value={form.modality}
                  onChange={handleChange}
                  className={inputClass(errors.modality)}
                >
                  <option value="">Seleccionar</option>
                  {MODALITIES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Descripción Breve" required error={errors.description}>
              <div className="relative">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe brevemente el evento..."
                  className={`${inputClass(errors.description)} resize-none`}
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">
                  {form.description?.length} caracteres
                </span>
              </div>
            </Field>
          </div>

          {/* SECCIÓN 2: Fecha, Aforo y Precio */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider font-heading">
              2. Programación, Aforo y Precio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Fecha de inicio" required error={errors.starts_at}>
                <input
                  type="datetime-local"
                  name="starts_at"
                  value={form.starts_at}
                  onChange={handleChange}
                  className={inputClass(errors.starts_at)}
                />
              </Field>
              <Field label="Fecha de fin (opcional)">
                <input
                  type="datetime-local"
                  name="ends_at"
                  value={form.ends_at}
                  onChange={handleChange}
                  className={inputClass()}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Capacidad (vacío = ilimitado)">
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Ej. 50"
                  className={inputClass()}
                />
              </Field>
              <Field label="Precio (0 = gratis)">
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={inputClass()}
                />
              </Field>
              <Field label="Estado" required>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass()}
                >
                  {EVENT_STATUS_OPTIONS.filter((opt) =>
                    isEditing
                      ? true
                      : !["cancelled", "finished"].includes(opt.value),
                  ).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* SECCIÓN 3: Modalidad y Enlaces */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider font-heading">
              3. Ubicación / Accesos
            </h3>

            {/* Link de Zoom (Solo virtual / híbrido) - No visible al público general */}
            {(form.modality === "virtual" || form.modality === "hibrido") && (
              <Field label="Link de Zoom del evento (No visible al público, se usará para envío de correos)" required error={errors.zoom_link}>
                <input
                  name="zoom_link"
                  value={form.zoom_link || ""}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/..."
                  className={inputClass(errors.zoom_link)}
                />
              </Field>
            )}

            {/* Dirección / Ubicación (Solo presencial / híbrido) */}
            {form.modality !== "virtual" && (
              <Field label="Ubicación / Lugar" required error={errors.location}>
                <input
                  name="location"
                  value={form.location || ""}
                  onChange={handleChange}
                  placeholder="Ej. Campus UDEP Piura, Aula L-21"
                  className={inputClass(errors.location)}
                />
              </Field>
            )}
          </div>

          {/* SECCIÓN 4: Detalles de Admisión, Brochure y Beneficios */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider font-heading">
              4. Detalles de Admisión, Brochure y Beneficios
            </h3>

            <Field label="Dirigido a" required error={errors.directed_to}>
              <input
                name="directed_to"
                value={form.directed_to || ""}
                onChange={handleChange}
                placeholder="Ej. Estudiantes universitarios de Piura, egresados..."
                className={inputClass(errors.directed_to)}
              />
            </Field>

            <Field label="Detalles extras (opcional)">
              <textarea
                name="extra_details"
                value={form.extra_details || ""}
                onChange={handleChange}
                rows={2}
                placeholder="Ej. Traer laptop propia. Se entregará constancia digital de asistencia."
                className={inputClass()}
              />
            </Field>

            {/* Brochure Upload */}
            <Field
              label={form.modality === "presencial" ? "Brochure del evento (Obligatorio, debe indicar cronograma)" : "Brochure del evento (Opcional)"}
              required={form.modality === "presencial"}
              error={errors.brochure_url}
            >
              <div className="flex flex-col gap-2">
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
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                    {brochureFile ? `Archivo: ${brochureFile.name.substring(0, 20)}...` : "Subir archivo del brochure"}
                  </button>
                  {brochureFile && (
                    <button
                      type="button"
                      onClick={handleRemoveBrochureFile}
                      className="text-xs text-red-500 hover:text-red-650 hover:underline font-semibold"
                    >
                      Remover archivo
                    </button>
                  )}
                </div>
              </div>
            </Field>

            {/* Beneficios (Max 3) */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Beneficios (Hasta 3 bullets)
              </label>
              {[0, 1, 2].map((idx) => (
                <input
                  key={`benefit-slot-${idx}`}
                  value={form.benefits?.[idx] || ""}
                  onChange={(e) => {
                    const newBenefits = [...(form.benefits || ["", "", ""])];
                    newBenefits[idx] = e.target.value;
                    setForm((prev) => ({ ...prev, benefits: newBenefits }));
                  }}
                  placeholder={`Beneficio ${idx + 1}`}
                  className={inputClass()}
                />
              ))}
            </div>

            {/* Banner del evento */}
            <Field label="Banner del evento (Fondo destacado)">
              <BannerUpload
                bannerPreview={bannerPreview}
                fileInputRef={fileInputRef}
                onDrop={handleBannerDrop}
                onChange={handleBannerChange}
                onRemove={handleRemoveBanner}
              />
            </Field>
          </div>

          {/* SECCIÓN 5: Datos del Ponente */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider font-heading">
                5. Ponente del Evento (Opcional)
              </h3>
              {!showNewSpeakerForm && (
                <button
                  type="button"
                  onClick={() => setShowNewSpeakerForm(true)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  + Registrar nuevo ponente
                </button>
              )}
            </div>

            {!showNewSpeakerForm ? (
              <Field label="Seleccionar Ponente" error={errors.speaker_id}>
                <select
                  name="speaker_id"
                  value={form.speaker_id || ""}
                  onChange={handleChange}
                  className={inputClass(errors.speaker_id)}
                >
                  <option value="">Ninguno / Sin ponente</option>
                  {speakersList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.role} {s.company ? `(${s.company})` : ""}
                    </option>
                  ))}
                </select>
              </Field>
            ) : (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-800 space-y-4">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Registrar Nuevo Ponente
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nombre del ponente" required>
                    <input
                      value={newSpeaker.name}
                      onChange={(e) => setNewSpeaker((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej. Dra. Sofía Martínez"
                      className={inputClass()}
                    />
                  </Field>
                  <Field label="Cargo / Rol" required>
                    <input
                      value={newSpeaker.role}
                      onChange={(e) => setNewSpeaker((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="Ej. Coordinadora de Becas"
                      className={inputClass()}
                    />
                  </Field>
                </div>

                <Field label="Organización / Empresa">
                  <input
                    value={newSpeaker.company}
                    onChange={(e) => setNewSpeaker((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Ej. Delegación de la Unión Europea"
                    className={inputClass()}
                  />
                </Field>

                {/* Avatar del Ponente */}
                <Field label="Foto de perfil del ponente">
                  <div className="flex items-center gap-4">
                    {newSpeakerAvatarPreview ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 group">
                        <img
                          src={newSpeakerAvatarPreview}
                          alt="Previsualización"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => newSpeakerAvatarInputRef.current?.click()}
                            className="p-1 bg-white text-gray-700 rounded-full hover:bg-gray-100 shadow-sm"
                          >
                            <ImagePlus className="w-3 h-3 text-gray-700" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewSpeakerAvatarFile(null);
                              setNewSpeakerAvatarPreview(null);
                            }}
                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-650 shadow-sm"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => newSpeakerAvatarInputRef.current?.click()}
                        className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-primary/45 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 text-gray-400"
                      >
                        <ImagePlus className="w-4 h-4 text-gray-300 dark:text-gray-500" />
                        <span className="text-[9px] font-medium leading-none">Subir</span>
                      </button>
                    )}

                    <div className="text-[11px] text-gray-500">
                      <p className="font-semibold text-gray-700 dark:text-gray-300">Avatar del Ponente</p>
                      <p className="text-gray-400">PNG o JPG de máx. 2 MB</p>
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
                          setNewSpeakerAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </Field>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewSpeakerForm(false)}
                    className="px-3 py-1.5 border border-gray-250 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={creatingSpeaker}
                    onClick={handleCreateSpeakerInline}
                    className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {creatingSpeaker ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Guardar Ponente
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Switches */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
            <SwitchField
              name="promo_modal"
              checked={form.promo_modal}
              onChange={handleChange}
              label="Mostrar en modal promocional"
              description="Aparecerá automáticamente al entrar al sitio"
            />
            {showPromoWarning && form.promo_modal && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/15 border border-yellow-200 dark:border-yellow-900/40">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  Esto <strong>reemplazará</strong> el evento promocional
                  actual. Solo puede haber una promoción activa a la vez.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer fijo */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-850 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 dark:hover:bg-primary/10 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isEditing ? "Guardar cambios" : "Guardar borrador"}
          </button>
          <button
            type="button"
            onClick={handlePublishAndSave}
            disabled={saving || form.status !== "published"}
            title={
              form.status !== "published"
                ? "Cambia el estado a 'Publicado' para usar esta opción"
                : undefined
            }
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Publicar y guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers de formulario ─── */

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function SwitchField({ name, checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-10 h-6 rounded-full transition-colors ${
            checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-800"
          }`}
        />
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}

function inputClass(hasError = false) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors bg-white dark:bg-gray-950/40 text-gray-900 dark:text-light ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500/70"
      : "border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20"
  }`;
}
