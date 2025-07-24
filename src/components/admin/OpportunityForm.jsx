import { useState } from "react";
import { X } from "lucide-react";

const OpportunityForm = ({ showOpportunityForm, setShowOpportunityForm }) => {
  const [opportunityForm, setOpportunityForm] = useState({
    type: "beca",
    modality: "presencial",
    studyLevel: "pregrado",
    status: "draft",
    benefits: [],
    tags: [],
    requirements: [],
    contact: { email: "" },
  });
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [currentRequirement, setCurrentRequirement] = useState("");

  const handleOpportunityChange = (e) => {
    const { name, value } = e.target;
    setOpportunityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setOpportunityForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };

  const handleArrayInput = (type, value) => {
    if (!value.trim()) return;

    setOpportunityForm((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), value],
    }));

    switch (type) {
      case "benefits":
        setCurrentBenefit("");
        break;
      case "tags":
        setCurrentTag("");
        break;
      case "requirements":
        setCurrentRequirement("");
        break;
    }
  };

  const removeArrayItem = (type, index) => {
    setOpportunityForm((prev) => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", opportunityForm);
    setShowOpportunityForm(false);
  };

  if (!showOpportunityForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[100vh] overflow-y-auto p-8 shadow-2xl border border-gray-200">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-1 flex items-center gap-2">
                <span>
                  <X className="hidden" />
                </span>
                Nueva Oportunidad
              </h2>
              <p className="text-gray-500 text-base">
                Completa los campos para publicar una nueva oportunidad.
              </p>
            </div>
            <button
              onClick={() => setShowOpportunityForm(false)}
              className="text-gray-400 hover:text-primary bg-gray-100 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Información Básica
            </h3>
            <hr className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.title || ""}
                  onChange={handleOpportunityChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organización
                </label>
                <input
                  type="text"
                  name="organization"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.organization || ""}
                  onChange={handleOpportunityChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  name="type"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.type}
                  onChange={handleOpportunityChange}
                >
                  <option value="beca">Beca</option>
                  <option value="intercambio">Intercambio</option>
                  <option value="practica">Práctica</option>
                  <option value="voluntariado">Voluntariado</option>
                  <option value="curso">Curso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  name="category"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.category || ""}
                  onChange={handleOpportunityChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidad
                </label>
                <select
                  name="modality"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.modality}
                  onChange={handleOpportunityChange}
                >
                  <option value="virtual">Virtual</option>
                  <option value="presencial">Presencial</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Estudios
                </label>
                <select
                  name="studyLevel"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.studyLevel}
                  onChange={handleOpportunityChange}
                >
                  <option value="secundaria">Secundaria</option>
                  <option value="pregrado">Pregrado</option>
                  <option value="maestria">Maestría</option>
                  <option value="doctorado">Doctorado</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="status"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.status}
                  onChange={handleOpportunityChange}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.country || ""}
                  onChange={handleOpportunityChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.location || ""}
                  onChange={handleOpportunityChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Límite
                </label>
                <input
                  type="date"
                  name="deadline"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.deadline || ""}
                  onChange={handleOpportunityChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.imageUrl || ""}
                  onChange={handleOpportunityChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Información de Contacto
            </h3>
            <hr className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.contact?.email || ""}
                  onChange={handleContactChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.contact?.phone || ""}
                  onChange={handleContactChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web
                </label>
                <input
                  type="url"
                  name="website"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={opportunityForm.contact?.website || ""}
                  onChange={handleContactChange}
                />
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
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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
              {opportunityForm.benefits?.map((benefit, index) => (
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
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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
              {opportunityForm.requirements?.map((requirement, index) => (
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
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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
              {opportunityForm.tags?.map((tag, index) => (
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

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => setShowOpportunityForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white rounded-md font-semibold text-lg shadow hover:bg-primary/90 transition-colors"
            >
              Guardar Oportunidad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
