import { X } from "lucide-react";
import { useOpportunityForm } from "../../hooks/useOpportunityForm";
import { categoryService } from "../../services/categoryService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
    handleArrayInput,
    removeArrayItem,
    submitForm,
    errors,
    resetForm,
  } = useOpportunityForm(initialData, categories);

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

  if (!showOpportunityForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-[100] overflow-y-auto py-8">
      <div className="bg-light rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-primary/20 relative my-8">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-center relative">
            <button
              onClick={onClose}
              className="absolute right-0 text-primary hover:text-white bg-secondary rounded-full p-2 transition-colors shadow hover:bg-primary"
              aria-label="Cerrar formulario"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-3xl font-bold text-primary mb-1 text-center w-full">
              <span>
                <X className="hidden" />
              </span>
              {formTitle}
            </h2>
          </div>
        </div>

        {/* Feedback visual de éxito/error */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-xl p-8 border border-primary/30 animate-fade-in">
              <svg
                className="animate-spin h-8 w-8 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span className="text-primary text-lg font-bold">
                Creando oportunidad...
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
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Título <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  // required
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
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Descripción <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  // required
                  className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                  value={formData.description || ""}
                  onChange={handleChange}
                />
                {errors?.description && (
                  <div className="text-xs text-red-600 mt-1 font-semibold">
                    {errors.description}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organización
                </label>
                <input
                  type="text"
                  name="organization"
                  // required
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

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  name="type"
                  // required
                  className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="beca">Beca</option>
                  <option value="intercambio">Intercambio</option>
                  <option value="practica">Práctica</option>
                  <option value="voluntariado">Voluntariado</option>
                  <option value="curso">Curso</option>
                  <option value="pasantia">Pasantía</option>
                  <option value="taller">Taller</option>
                  <option value="charla">Charla</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidad
                </label>
                <select
                  name="modality"
                  // required
                  className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                  value={formData.modality}
                  onChange={handleChange}
                >
                  <option value="virtual">Virtual</option>
                  <option value="presencial">Presencial</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="status"
                  //   required
                  className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="draft">Borrador</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  name="country"
                  // required
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <select
                  name="location"
                  // required
                  className="w-full rounded-xl border border-primary/20 bg-white text-dark px-4 py-2 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-gray-400"
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="national">Nacional</option>
                  <option value="international">Internacional</option>
                  <option value="latin-america">Latinoamerica</option>
                  <option value="europe">Europa</option>
                  <option value="asia">Asia</option>
                  <option value="u-s">EEUU</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Límite
                </label>
                <input
                  type="date"
                  name="deadline"
                  // required
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
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  handleArrayInput("benefits", currentBenefit)
                }
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
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  handleArrayInput("requirements", currentRequirement)
                }
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
                onKeyPress={(e) =>
                  e.key === "Enter" && handleArrayInput("tags", currentTag)
                }
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
          {/* Input para imagen al final del formulario */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen principal
            </label>
            <input
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
              <img
                src={URL.createObjectURL(formData.image_url)}
                alt="Previsualización"
                className="mt-2 rounded-xl max-h-40 border"
              />
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

          <div className="flex justify-end space-x-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-secondary text-secondary rounded-full font-semibold shadow hover:bg-secondary hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-light rounded-full font-bold text-lg shadow-lg hover:bg-primary/90 transition-all focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Oportunidad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
