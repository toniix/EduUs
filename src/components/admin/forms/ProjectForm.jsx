import { useState, useRef } from "react";
import { X, Plus, Trash2, ImagePlus, Loader2, Sparkles } from "lucide-react";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";
import { projectSchema } from "../../../utils/validationSchemas";
import toast from "react-hot-toast";

const AVAILABLE_ICONS = [
  { value: "GraduationCap", label: "Gorra de Graduación (Educación)" },
  { value: "BookOpen", label: "Libro Abierto (Lectura/Cultura)" },
  { value: "Presentation", label: "Pizarra (Talleres/Presentaciones)" },
  { value: "Search", label: "Lupa (Oportunidades/Búsqueda)" },
  { value: "Heart", label: "Corazón (Solidaridad/Salud)" },
  { value: "Users", label: "Usuarios (Comunidad)" },
  { value: "Sparkles", label: "Destellos (Impacto/Premios)" },
  { value: "Calendar", label: "Calendario (Eventos)" },
];

const EMPTY_FORM = {
  name: "",
  description: "",
  details: "",
  icon: "GraduationCap",
  fondo: "",
  objectives: [],
  results: [],
  images: [],
};

export default function ProjectForm({ project = null, onClose, onSave }) {
  const isEditing = !!project;

  const [form, setForm] = useState(() =>
    isEditing
      ? {
          ...EMPTY_FORM,
          ...project,
        }
      : { ...EMPTY_FORM },
  );

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingFondo, setUploadingFondo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // File refs for upload
  const fondoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ----------------------------------------------------
  // MANEJO DE FOTO DESTACADA (FONDO)
  // ----------------------------------------------------
  const handleFondoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setUploadingFondo(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, fondo: url }));
      if (errors.fondo) {
        setErrors((prev) => ({ ...prev, fondo: "" }));
      }
      toast.success("Foto destacada subida correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al subir la foto destacada");
    } finally {
      setUploadingFondo(false);
    }
  };

  // ----------------------------------------------------
  // MANEJO DE GALERÍA DE IMÁGENES
  // ----------------------------------------------------
  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGallery(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`La imagen ${file.name} supera los 5MB y fue omitida.`);
          continue;
        }
        toast.loading(`Subiendo ${file.name}...`, { id: "gallery-upload" });
        const url = await uploadImageToCloudinary(file);
        uploadedUrls.push(url);
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      toast.success("Galería actualizada correctamente", {
        id: "gallery-upload",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al subir una o más imágenes de la galería", {
        id: "gallery-upload",
      });
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // ----------------------------------------------------
  // MANEJO DE LISTAS DINÁMICAS (OBJETIVOS / RESULTADOS)
  // ----------------------------------------------------
  const [newObjective, setNewObjective] = useState("");
  const [newResult, setNewResult] = useState("");

  const addObjective = () => {
    if (!newObjective.trim()) return;
    setForm((prev) => ({
      ...prev,
      objectives: [...prev.objectives, newObjective.trim()],
    }));
    setNewObjective("");
  };

  const removeObjective = (idx) => {
    setForm((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== idx),
    }));
  };

  const addResult = () => {
    if (!newResult.trim()) return;
    setForm((prev) => ({
      ...prev,
      results: [...prev.results, newResult.trim()],
    }));
    setNewResult("");
  };

  const removeResult = (idx) => {
    setForm((prev) => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== idx),
    }));
  };

  // ----------------------------------------------------
  // VALIDACIÓN Y ENVÍO
  // ----------------------------------------------------
  const validate = () => {
    const result = projectSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const validationErrors = result.error.issues.reduce((acc, issue) => {
      const field = issue.path[0];
      if (field && !acc[field]) acc[field] = issue.message;
      return acc;
    }, {});

    setErrors(validationErrors);
    return false;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    setSaving(true);
    const success = await onSave(form);
    if (success) {
      onClose();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-300">
                Completa los campos para publicar un proyecto en la web
              </p>
            </div>
          </div>
          <button type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Grid Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. BOOTCAMP DE EMPLEABILIDAD"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Icono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                Icono del Proyecto <span className="text-red-500">*</span>
              </label>
              <select
                name="icon"
                value={form.icon}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                {AVAILABLE_ICONS.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción corta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                Descripción Corta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.description}
                onChange={handleChange}
                name="description"
                placeholder="Ej. Herramientas reales para el futuro laboral"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Detalles del proyecto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Detalle Completo del Proyecto{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.details}
              onChange={handleChange}
              name="details"
              rows={4}
              placeholder="Explica a fondo el propósito del proyecto, metodología, etc."
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.details
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none`}
            />
            {errors.details && (
              <p className="text-xs text-red-500 mt-1">{errors.details}</p>
            )}
          </div>

          {/* Foto Destacada (Fondo) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Foto Destacada Principal <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={fondoInputRef}
              onChange={handleFondoChange}
              accept="image/*"
              className="hidden"
            />

            {form.fondo ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 max-w-md shadow-sm">
                <img
                  src={form.fondo}
                  alt="Fondo preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fondoInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cambiar Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, fondo: "" }))}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fondoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all max-w-md"
              >
                {uploadingFondo ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <ImagePlus className="w-8 h-8 text-gray-300" />
                )}
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {uploadingFondo
                    ? "Subiendo foto destacada..."
                    : "Cargar Foto Destacada"}
                </span>
                <span className="text-xs text-gray-300">
                  Recomendado: 800x600 px (máx. 5MB)
                </span>
              </div>
            )}
            {errors.fondo && (
              <p className="text-xs text-red-500 mt-1">{errors.fondo}</p>
            )}
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Objetivos y Resultados (Listas dinámicas en grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Objetivos */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                  Objetivos del Proyecto
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Añadir un objetivo..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addObjective())
                    }
                  />
                  <button
                    type="button"
                    onClick={addObjective}
                    className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {form.objectives.length > 0 ? (
                <ul className="space-y-2 border border-gray-100 dark:border-gray-700 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/40">
                  {form.objectives.map((obj, idx) => (
                    <li
                      key={obj}
                      className="flex items-start justify-between gap-3 text-sm text-gray-600 dark:text-gray-300 py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{obj}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeObjective(idx)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No se han añadido objetivos.
                </p>
              )}
            </div>

            {/* Resultados */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                  Resultados del Proyecto
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    placeholder="Añadir un resultado..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addResult())
                    }
                  />
                  <button
                    type="button"
                    onClick={addResult}
                    className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {form.results.length > 0 ? (
                <ul className="space-y-2 border border-gray-100 dark:border-gray-700 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/40">
                  {form.results.map((res, idx) => (
                    <li
                      key={res}
                      className="flex items-start justify-between gap-3 text-sm text-gray-600 dark:text-gray-300 py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                        <span>{res}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeResult(idx)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No se han añadido resultados.
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Galería de fotos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Galería de Fotos del Proyecto (Múltiples Imágenes)
            </label>
            <input
              type="file"
              ref={galleryInputRef}
              onChange={handleGalleryChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Fotos existentes en la galería */}
              {form.images.map((imgUrl, idx) => (
                <div
                  key={imgUrl}
                  className="relative rounded-xl overflow-hidden aspect-square border border-gray-100 shadow-sm group bg-gray-100"
                >
                  <img
                    src={imgUrl}
                    alt={`Gallery preview ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar de la galería"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Botón de añadir más */}
              <div
                onClick={() =>
                  !uploadingGallery && galleryInputRef.current?.click()
                }
                className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all aspect-square"
              >
                {uploadingGallery ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <ImagePlus className="w-6 h-6 text-gray-300" />
                )}
                <span className="text-xs font-semibold text-gray-400">
                  {uploadingGallery ? "Subiendo..." : "Agregar Fotos"}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || uploadingFondo || uploadingGallery}
            className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
              </>
            ) : (
              "Guardar Proyecto"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
