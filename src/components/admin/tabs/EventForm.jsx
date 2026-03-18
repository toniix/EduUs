import { useState, useRef } from "react";
import { X, AlertTriangle, Loader2, ImagePlus, Trash2 } from "lucide-react";
import { categoryConfig, modalityConfig, EVENT_STATUS_OPTIONS } from "../../../utils/events";
import { eventSchema } from "../../../utils/validationSchemas";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";

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
};

/** Genera slug básico desde un título */
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * EventForm — modal para crear o editar un evento.
 * Props:
 *  - event: Object|null — null = modo crear, objeto = modo editar
 *  - onClose: () => void
 *  - onSuccess: (data) => void — callback tras guardar exitosamente
 *  - onSave: (formData, publish) => Promise<{success, error}>
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
        starts_at: event.starts_at
          ? event.starts_at.slice(0, 16)
          : "",
        ends_at: event.ends_at ? event.ends_at.slice(0, 16) : "",
      }
      : { ...EMPTY_FORM }
  );

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPromoWarning, setShowPromoWarning] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);       // File | null
  const [bannerPreview, setBannerPreview] = useState(     // URL previsualizable
    isEditing && event.banner_url ? event.banner_url : null
  );
  const fileInputRef = useRef(null);

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

  // Scroll bloqueado mientras el modal está open
  // useEffect(() => {
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, []);

  // Auto-generar slug cuando cambia el título (solo si el usuario no lo ha editado manualmente)
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      // Auto-slug si no hay slug personalizado o si coincide con el anterior
      ...(prev.slug === generateSlug(prev.title)
        ? { slug: generateSlug(title) }
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

    // Cambio de status → actualiza solo status
    if (name === "status") {
      setForm((prev) => ({ ...prev, status: value }));
      clearError(name);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
    clearError(name);
  };

  const validate = () => {
    const result = eventSchema.safeParse({
      ...form,
      capacity: form.capacity === "" ? null : Number(form.capacity),
      price: form.price === "" ? null : Number(form.price),
    });

    if (result.success) return {};

    // Convertir errores de Zod al formato { campo: mensaje }
    return result.error.issues.reduce((acc, issue) => {
      const field = issue.path[0];
      if (field && !acc[field]) acc[field] = issue.message;
      return acc;
    }, {});
  };

  // buildPayload: ajusta tipos y valores antes de enviar
  const buildPayload = (forcePublish = false) => ({
    ...form,
    capacity: form.capacity === "" ? null : Number(form.capacity),
    price: form.price === "" ? null : Number(form.price),
    status: forcePublish ? "published" : form.status,
    registration_url: form.registration_url?.trim() || null,
  });

  const handleSaveDraft = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload(false);
      if (bannerFile) {
        payload.banner_url = await uploadImageToCloudinary(bannerFile);
      }
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishAndSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload(true);
      if (bannerFile) {
        payload.banner_url = await uploadImageToCloudinary(bannerFile);
      }
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const locationLabel =
    form.modality === "virtual"
      ? "Link de acceso"
      : form.modality === "hibrido"
        ? "Dirección / Link"
        : "Dirección";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-gray-900">
            {isEditing ? "Editar evento" : "Crear nuevo evento"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Título */}
          <Field label="Título" required error={errors.title}>
            <input
              name="title"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Nombre del evento"
              className={inputClass(errors.title)}
            />
          </Field>

          {/* Slug */}
          <Field label="Slug (URL amigable)">
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="slug-del-evento"
              className={inputClass()}
            />
          </Field>

          {/* Categoría y Modalidad */}
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

          {/* Descripción */}
          <Field label="Descripción">
            <div className="relative">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe el evento..."
                className={`${inputClass()} resize-none`}
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">
                {form.description?.length} caracteres
              </span>
            </div>
          </Field>

          {/* Lugar / Link */}
          <Field label={locationLabel}>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder={
                form.modality === "virtual"
                  ? "https://meet.google.com/..."
                  : "Av. Ejemplo 123, Lima"
              }
              className={inputClass()}
            />
          </Field>

          {/* Banner — file upload */}
          <Field label="Banner del evento">
            {/* Zona de drop / click */}
            {!bannerPreview ? (
              <div
                onDrop={handleBannerDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <ImagePlus className="w-8 h-8 text-gray-300" />
                <p className="text-sm text-gray-400">
                  Haz clic o arrastra una imagen aquí
                </p>
                <p className="text-xs text-gray-300">PNG, JPG, WEBP — máx. 5 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-44 object-cover"
                />
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Quitar
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </div>
            )}
          </Field>

          {/* Fechas */}
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

          {/* Capacidad, Precio y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Capacidad (vacío = sin límite)">
              <input
                type="number"
                name="capacity"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                placeholder="Ej. 30"
                className={inputClass()}
              />
            </Field>
            <Field label="Precio (0 = gratuito)">
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
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
                  isEditing ? true : !["cancelled", "finished"].includes(opt.value)
                ).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* URL de inscripción externa */}
          <Field label="URL de inscripción externa (opcional)">
            <input
              name="registration_url"
              value={form.registration_url}
              onChange={handleChange}
              placeholder="https://forms.gle/..."
              className={inputClass()}
            />
          </Field>

          {/* Switches */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <SwitchField
              name="promo_modal"
              checked={form.promo_modal}
              onChange={handleChange}
              label="Mostrar en modal promocional"
              description="Aparecerá automáticamente al entrar al sitio"
            />
            {showPromoWarning && form.promo_modal && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  Esto <strong>reemplazará</strong> el evento promocional
                  actual. Solo puede haber una promoci&oacute;n activa a la vez.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer fijo */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
          className={`w-10 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-gray-200"
            }`}
        />
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"
            }`}
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

function inputClass(hasError = false) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${hasError
    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
    : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
    }`;
}
