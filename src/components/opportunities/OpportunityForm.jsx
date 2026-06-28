import { X } from "lucide-react";
import { useOpportunityForm } from "../../hooks/useOpportunityForm";
import { categoryService } from "../../services/categoryService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import ImagePreview from "./OpportunityImagePreview";

const OpportunityForm = ({
  showOpportunityForm,
  initialData = null,
  onSuccess,
  onClose,
}) => {
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const isEditing = !!initialData?.id;
  const formTitle = isEditing
    ? "Editar Oportunidad"
    : "Crear Nueva Oportunidad";
  const {
    formData,
    currentBenefit,
    setCurrentBenefit,
    currentTag,
    setCurrentTag,
    currentRequirement,
    setCurrentRequirement,
    loading,
    error,
    success,
    handleChange,
    handleContactChange,
    handleSocialLinksChange,
    addApplicationStep,
    removeApplicationStep,
    addDocumentationItem,
    removeDocumentationItem,
    handleArrayInput,
    removeArrayItem,
    submitForm,
    errors,
  } = useOpportunityForm(initialData, categories);

  // Estados locales para los builders dinámicos
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");
  const [newStepDuration, setNewStepDuration] = useState("");
  const [stepBuilderError, setStepBuilderError] = useState("");

  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocUrl, setNewDocUrl] = useState("");
  const [docBuilderError, setDocBuilderError] = useState("");

  const handleAddStep = (e) => {
    e.preventDefault();
    if (!newStepTitle.trim() || !newStepDesc.trim()) {
      setStepBuilderError("El título y la descripción del paso son obligatorios.");
      return;
    }
    addApplicationStep({
      title: newStepTitle.trim(),
      description: newStepDesc.trim(),
      duration: newStepDuration.trim() || undefined,
    });
    setNewStepTitle("");
    setNewStepDesc("");
    setNewStepDuration("");
    setStepBuilderError("");
  };

  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocUrl.trim()) {
      setDocBuilderError("El título y la URL del documento son obligatorios.");
      return;
    }
    if (!newDocUrl.startsWith("http://") && !newDocUrl.startsWith("https://")) {
      setDocBuilderError("La URL del documento debe comenzar con http:// o https://");
      return;
    }
    addDocumentationItem({
      title: newDocTitle.trim(),
      url: newDocUrl.trim(),
    });
    setNewDocTitle("");
    setNewDocUrl("");
    setDocBuilderError("");
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);
      try {
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading categories:", err);
        setCategoriesError("Error al cargar las categorías");
        toast.error("Error al cargar las categorías");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submitForm(async (formData) => {
      if (onSuccess) {
        await onSuccess(formData);
      }
    });

    if (ok && onClose) {
      onClose();
    }
  };

  const handleSubmitWithStatus = async (publishStatus) => {
    const ok = await submitForm(
      async (dataToSubmit) => {
        if (onSuccess) {
          await onSuccess(dataToSubmit);
        }
      },
      { is_published: publishStatus },
    );

    if (ok && onClose) {
      onClose();
    }
  };

  if (!showOpportunityForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-[100] overflow-y-auto py-8">
      <div className="bg-light rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-primary/20 relative my-8">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-center relative">
            <button
              onClick={onClose}
              className="absolute right-0 text-primary hover:text-white bg-secondary-light rounded-full p-2 transition-colors shadow hover:bg-primary"
              aria-label="Cerrar formulario"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-3xl font-bold text-secondary mb-1 text-center w-full">
              {formTitle}
            </h2>
          </div>
        </div>

        {/* Feedback visual de éxito/error */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="text-primary text-lg font-bold">
                {isEditing
                  ? "Actualizando oportunidad..."
                  : "Creando oportunidad..."}
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 font-semibold border border-red-200 animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-100 text-green-700 font-semibold border border-green-200 animate-fade-in">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <h3 className="text-xl font-bold text-primary mb-2 tracking-tight">
              Información Básica
            </h3>
            <hr className="mb-6 border-primary/30" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna Izquierda: Campos cortos */}
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label
                    htmlFor="opp-title"
                    className="block text-sm font-semibold text-dark mb-1"
                  >
                    Título <span className="text-primary">*</span>
                  </label>
                  <input
                    id="opp-title"
                    type="text"
                    name="title"
                    className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                    placeholder="Ej: Beca de excelencia académica"
                    value={formData.title || ""}
                    onChange={handleChange}
                  />
                  {errors?.title && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {errors.title}
                    </div>
                  )}
                </div>

                {/* Organización */}
                <div>
                  <label
                    htmlFor="opp-organization"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Organización
                  </label>
                  <input
                    id="opp-organization"
                    type="text"
                    name="organization"
                    className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                    value={formData.organization || ""}
                    onChange={handleChange}
                  />
                  {errors?.organization && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {errors.organization}
                    </div>
                  )}
                </div>

                {/* Categoría */}
                <div>
                  <label
                    htmlFor="opp-category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Categoría
                  </label>
                  <select
                    id="opp-category"
                    name="category_id"
                    className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                    value={formData.category_id || ""}
                    onChange={handleChange}
                    disabled={isLoadingCategories}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingCategories && (
                    <div className="text-xs text-gray-500 mt-1">
                      Cargando categorías...
                    </div>
                  )}
                  {categoriesError && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {categoriesError}
                    </div>
                  )}
                  {errors?.category_id && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {errors.category_id}
                    </div>
                  )}
                </div>

                {/* Modalidad */}
                <div>
                  <label
                    htmlFor="opp-modality"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Modalidad
                  </label>
                  <select
                    id="opp-modality"
                    name="modality"
                    className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                    value={formData.modality}
                    onChange={handleChange}
                  >
                    <option value="virtual">Virtual</option>
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>

                {/* País */}
                <div>
                  <label
                    htmlFor="opp-country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    País
                  </label>
                  <input
                    id="opp-country"
                    type="text"
                    name="country"
                    className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                    value={formData.country || ""}
                    onChange={handleChange}
                  />
                  {errors?.country && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {errors.country}
                    </div>
                  )}
                </div>

                {/* Ubicación */}
                <div>
                  <label
                    htmlFor="opp-location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ubicación
                  </label>
                  <select
                    id="opp-location"
                    name="location"
                    className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                    value={formData.location}
                    onChange={handleChange}
                  >
                    <option value="national">Nacional</option>
                    <option value="international">Internacional</option>
                  </select>
                </div>

                {/* Fecha Límite */}
                <div>
                  <label
                    htmlFor="opp-deadline"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fecha Límite
                  </label>
                  <input
                    id="opp-deadline"
                    type="date"
                    name="deadline"
                    className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                    value={formData.deadline || ""}
                    onChange={handleChange}
                  />
                  {errors?.deadline && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {errors.deadline}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Descripción */}
              <div className="flex flex-col h-full">
                <label
                  htmlFor="opp-description"
                  className="block text-sm font-semibold text-dark mb-1"
                >
                  Descripción <span className="text-primary">*</span>
                </label>
                <textarea
                  id="opp-description"
                  name="description"
                  className="w-full flex-grow rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400 resize-none h-[calc(100%-2.5rem)] min-h-[480px]"
                  placeholder="Describe detalladamente de qué trata la oportunidad..."
                  value={formData.description || ""}
                  onChange={handleChange}
                />
                {errors?.description && (
                  <div className="text-xs text-red-600 mt-1 font-semibold">
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            {/* Estado de Publicación */}
            <div className="mt-8 pt-6 border-t border-primary/20">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                📢 Estado de Publicación
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20 transition-all hover:bg-primary/10">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={formData.is_published || false}
                    onChange={(e) => {
                      handleChange({
                        target: {
                          name: "is_published",
                          type: "checkbox",
                          checked: e.target.checked,
                        },
                      });
                    }}
                    className="w-5 h-5 rounded border-primary cursor-pointer accent-primary focus:ring-primary/30"
                  />
                  <label
                    htmlFor="is_published"
                    className="text-sm font-semibold text-dark cursor-pointer select-none"
                  >
                    Publicar oportunidad (hacer visible en la plataforma)
                  </label>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      formData.is_published
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {formData.is_published
                      ? "Estado: Publicado"
                      : "Estado: Borrador"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quienes pueden postular */}
            <div className="mt-12 pt-8 border-t border-primary/20">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                ¿Quienes pueden postular?
              </h3>
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label
                    htmlFor="audience"
                    className="block text-sm font-semibold text-dark mb-1"
                  >
                    Audiencia <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="audience"
                    id="audience"
                    rows="4"
                    className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400 resize-none"
                    placeholder="Ej: Estudiantes universitarios de últimos semestres, profesionales con experiencia en tecnología, etc."
                    value={formData.audience || ""}
                    onChange={handleChange}
                  />
                  {errors?.audience && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {errors.audience}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contacto de la oportunidad */}
            <div className="mt-12 pt-8 border-t border-primary/20">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                Contacto de la oportunidad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sitio Web */}
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-semibold text-dark mb-1"
                  >
                    Sitio Web o link de la oportunidad
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 0v4m0 8v4m8-8h-4m-8 0H3"
                        ></path>
                      </svg>
                    </span>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      autoComplete="url"
                      placeholder="https://sitio.com"
                      className="w-full pl-10 pr-4 rounded-xl border border-primary/20 bg-white text-dark py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none placeholder:text-gray-400"
                      value={formData.contact?.website || ""}
                      onChange={handleContactChange}
                    />
                  </div>
                  {errors?.contact?.website && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {errors.contact.website}
                    </div>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-dark mb-1"
                  >
                    Email (opcional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 12H8m8 0V8a4 4 0 00-8 0v4m8 0h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h2"
                        ></path>
                      </svg>
                    </span>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      placeholder="correo@ejemplo.com"
                      className="w-full pl-10 pr-4 rounded-xl border border-primary/20 bg-white text-dark py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none placeholder:text-gray-400"
                      value={formData.contact?.email || ""}
                      onChange={handleContactChange}
                    />
                  </div>
                  {errors?.contact?.email && (
                    <div className="text-xs text-red-600 mt-1 font-semibold">
                      {errors.contact.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Beneficios
            </h3>
            <hr className="mb-4" />
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentBenefit}
                onChange={(e) => setCurrentBenefit(e.target.value)}
                className="flex-1 rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="Agregar beneficio"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleArrayInput("benefits", currentBenefit);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => handleArrayInput("benefits", currentBenefit)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {errors?.benefits && (
                <div className="text-xs text-red-600 mt-1 font-semibold">
                  {errors.benefits}
                </div>
              )}
              {formData.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {benefit}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("benefits", index)}
                    className="ml-2 text-primary hover:text-primary/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Requisitos
            </h3>
            <hr className="mb-4" />
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentRequirement}
                onChange={(e) => setCurrentRequirement(e.target.value)}
                className="flex-1 rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="Agregar requisito"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleArrayInput("requirements", currentRequirement);
                  }
                }}
              />

              <button
                type="button"
                onClick={() =>
                  handleArrayInput("requirements", currentRequirement)
                }
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {errors?.requirements && (
                <div className="text-xs text-red-600 mt-1 font-semibold">
                  {errors.requirements}
                </div>
              )}
              {formData.requirements?.map((requirement, index) => (
                <span
                  key={index}
                  className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {requirement}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("requirements", index)}
                    className="ml-2 text-secondary hover:text-secondary/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent mb-2">
              Etiquetas
            </h3>
            <hr className="mb-4" />
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className="flex-1 rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="Agregar etiqueta"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleArrayInput("tags", currentTag);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => handleArrayInput("tags", currentTag)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {errors?.tags && (
                <div className="text-xs text-red-600 mt-1 font-semibold">
                  {errors.tags}
                </div>
              )}
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("tags", index)}
                    className="ml-2 text-accent hover:text-accent/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* MEDIOS/REDES Y DOCUMENTACIÓN EN LA MISMA FILA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Columna 1: Medios y Redes Sociales */}
            <div className="p-6 rounded-2xl bg-white border border-primary/10 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Medios y Redes Sociales
                </h3>
                <hr className="mb-4" />
                
                <div className="space-y-4">
                  {/* Video URL */}
                  <div>
                    <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Video (Presentación o Guía)
                    </label>
                    <input
                      id="video_url"
                      type="url"
                      name="video_url"
                      className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.video_url || ""}
                      onChange={handleChange}
                    />
                    {errors?.video_url && (
                      <div className="text-xs text-red-600 mt-1 font-semibold">
                        {errors.video_url}
                      </div>
                    )}
                  </div>

                  {/* Redes Sociales: Facebook */}
                  <div>
                    <label htmlFor="fb_url" className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook de la institución
                    </label>
                    <input
                      id="fb_url"
                      type="url"
                      name="facebook"
                      className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                      placeholder="https://facebook.com/..."
                      value={formData.social_links?.facebook || ""}
                      onChange={handleSocialLinksChange}
                    />
                    {errors?.social_links?.facebook && (
                      <div className="text-xs text-red-600 mt-1 font-semibold">
                        {errors.social_links.facebook}
                      </div>
                    )}
                  </div>

                  {/* Redes Sociales: Instagram */}
                  <div>
                    <label htmlFor="ig_url" className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram de la institución
                    </label>
                    <input
                      id="ig_url"
                      type="url"
                      name="instagram"
                      className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                      placeholder="https://instagram.com/..."
                      value={formData.social_links?.instagram || ""}
                      onChange={handleSocialLinksChange}
                    />
                    {errors?.social_links?.instagram && (
                      <div className="text-xs text-red-600 mt-1 font-semibold">
                        {errors.social_links.instagram}
                      </div>
                    )}
                  </div>

                  {/* Redes Sociales: LinkedIn */}
                  <div>
                    <label htmlFor="in_url" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn de la institución
                    </label>
                    <input
                      id="in_url"
                      type="url"
                      name="linkedin"
                      className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                      placeholder="https://linkedin.com/company/..."
                      value={formData.social_links?.linkedin || ""}
                      onChange={handleSocialLinksChange}
                    />
                    {errors?.social_links?.linkedin && (
                      <div className="text-xs text-red-600 mt-1 font-semibold">
                        {errors.social_links.linkedin}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 2: Documentos de la Oportunidad */}
            <div className="p-6 rounded-2xl bg-white border border-primary/10 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Documentos de la Oportunidad
                </h3>
                <hr className="mb-4" />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Documentos de la Oportunidad (Bases, Anexos, Reglamentos, etc.)
                    </label>
                    
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:outline-none placeholder:text-gray-400 text-sm"
                        placeholder="Título del documento (ej. Anexo 1)"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <input
                          type="url"
                          className="flex-1 rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:outline-none placeholder:text-gray-400 text-sm"
                          placeholder="URL del documento"
                          value={newDocUrl}
                          onChange={(e) => setNewDocUrl(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleAddDoc}
                          className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all text-sm flex-shrink-0"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>

                    {docBuilderError && (
                      <div className="text-xs text-red-600 font-semibold">{docBuilderError}</div>
                    )}

                    {/* Listado de documentos agregados */}
                    <div className="space-y-2 mt-3 max-h-[220px] overflow-y-auto pr-1">
                      {formData.documentation?.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <div className="flex flex-col min-w-0 pr-4">
                            <span className="text-sm font-bold text-gray-900 truncate">{doc.title}</span>
                            <span className="text-xs text-gray-500 truncate">{doc.url}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocumentationItem(idx)}
                            className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PASOS DEL PROCESO DE POSTULACIÓN */}
          <div className="mt-8 p-6 rounded-2xl bg-white border border-primary/10 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-primary">
              Pasos del Proceso de Postulación
            </h3>
            <hr />

            <div className="space-y-4">
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-150 space-y-3">
                <p className="text-xs font-semibold text-gray-500">CREAR UN PASO</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:outline-none placeholder:text-gray-400 text-sm"
                      placeholder="Título del paso (ej. Registro en línea)"
                      value={newStepTitle}
                      onChange={(e) => setNewStepTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:outline-none placeholder:text-gray-400 text-sm"
                      placeholder="Duración aproximada (ej. 15 minutos / Opcional)"
                      value={newStepDuration}
                      onChange={(e) => setNewStepDuration(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <textarea
                      rows="2"
                      className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:outline-none placeholder:text-gray-400 text-sm"
                      placeholder="Descripción del paso..."
                      value={newStepDesc}
                      onChange={(e) => setNewStepDesc(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  {stepBuilderError ? (
                    <div className="text-xs text-red-600 font-semibold">{stepBuilderError}</div>
                  ) : (
                    <div className="text-xs text-gray-400">Completa el paso e instálalo en el proceso</div>
                  )}
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all text-sm"
                  >
                    Agregar Paso
                  </button>
                </div>
              </div>

              {/* Listado de pasos agregados */}
              <div className="space-y-3 mt-2">
                {formData.application_steps?.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-gray-150 shadow-sm flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{step.title}</h4>
                        {step.duration && (
                          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md self-start sm:self-center">
                            {step.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{step.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeApplicationStep(idx)}
                      className="text-red-500 hover:text-red-700 p-1 flex-shrink-0 mt-0.5"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Input para imagen al final del formulario */}
          <div className="mt-8">
            <label
              htmlFor="opp-image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Imagen principal
            </label>
            <input
              id="opp-image"
              type="file"
              accept="image/*"
              name="image_url"
              className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleChange({
                    target: {
                      name: "image_url",
                      type: "file",
                      files: e.target.files,
                      value: "",
                    },
                  });
                }
              }}
            />
            {errors?.image_url && (
              <div className="text-xs text-red-600 mt-1 font-semibold">
                {errors.image_url}
              </div>
            )}
            {/* Previsualización */}
            {formData.image_url && typeof formData.image_url !== "string" && (
              <ImagePreview file={formData.image_url} />
            )}
            {formData.image_url &&
              typeof formData.image_url === "string" &&
              formData.image_url.startsWith("http") && (
                <img
                  src={formData.image_url}
                  alt="Previsualización"
                  className="mt-2 rounded-xl max-h-40 border"
                />
              )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-primary/10">
            <Button
              variant="secondary"
              onClick={onClose}
              fullWidth={false}
              className="px-6 rounded-full font-semibold order-last sm:order-none"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => handleSubmitWithStatus(false)}
              fullWidth={false}
              className="px-6 rounded-full font-semibold border border-primary/20 hover:bg-primary/5 text-primary"
            >
              {loading
                ? "Guardando..."
                : formData.is_published
                  ? "Cambiar a Borrador"
                  : "Guardar en Borrador"}
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={() => handleSubmitWithStatus(true)}
              fullWidth={false}
              className="px-8 rounded-full font-bold text-white bg-primary hover:bg-opacity-90 shadow-lg"
            >
              {loading
                ? "Procesando..."
                : formData.is_published
                  ? "Guardar Cambios"
                  : "Publicar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
