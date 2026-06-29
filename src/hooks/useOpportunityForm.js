import { useState } from "react";
import { opportunitySchema } from "../utils/validationSchemas";

const initialState = {
  title: "",
  description: "",
  modality: "presencial",
  benefits: [],
  requirements: [],
  category_id: null,
  organization: "",
  country: "",
  location: "Nacional",
  deadline: "",
  image_url: "",
  audience: "",
  contact: { website: "" },
  tags: [],
  is_featured: false,
  featured_order: null,
  is_published: false,
  video_url: "",
  social_links: { facebook: "", instagram: "", linkedin: "" },
  application_steps: [],
  documentation: [],
};

export function useOpportunityForm(initial = {}, categories = []) {
  const [formData, setFormData] = useState(() => {
    const base = { ...initialState, ...initial };
    return {
      ...base,
      social_links: {
        facebook: base.social_links?.facebook || "",
        instagram: base.social_links?.instagram || "",
        linkedin: base.social_links?.linkedin || "",
      },
      application_steps: Array.isArray(base.application_steps) ? base.application_steps : [],
      documentation: Array.isArray(base.documentation) ? base.documentation : [],
      video_url: base.video_url || "",
    };
  });
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, files, value, checked } = e.target;
    if (type === "file" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      // Si se desmarca featured, limpiar featured_order
      if (name === "is_featured" && !checked) {
        setFormData((prev) => ({
          ...prev,
          is_featured: checked,
          featured_order: null,
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      // Si es el campo category_id, también actualizamos el category con el nombre correspondiente
      if (name === "category_id") {
        const selectedCategory = categories.find((cat) => cat.id === value);
        setFormData((prev) => ({
          ...prev,
          category_id: value,
          category: selectedCategory ? selectedCategory.name : "",
        }));
      } else if (name === "featured_order") {
        setFormData((prev) => ({
          ...prev,
          [name]: value ? parseInt(value) : null,
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    // Limpiar error del campo al modificarlo
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value,
      },
    }));
  };

  const addApplicationStep = (step) => {
    setFormData((prev) => {
      const steps = prev.application_steps || [];
      const newStep = {
        id: steps.length + 1,
        ...step,
      };
      return {
        ...prev,
        application_steps: [...steps, newStep],
      };
    });
  };

  const removeApplicationStep = (index) => {
    setFormData((prev) => {
      const steps = (prev.application_steps || []).filter((_, i) => i !== index);
      // Re-indexar IDs de pasos secuencialmente
      const reindexedSteps = steps.map((s, idx) => ({ ...s, id: idx + 1 }));
      return {
        ...prev,
        application_steps: reindexedSteps,
      };
    });
  };

  const addDocumentationItem = (item) => {
    setFormData((prev) => ({
      ...prev,
      documentation: [...(prev.documentation || []), item],
    }));
  };

  const removeDocumentationItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      documentation: (prev.documentation || []).filter((_, i) => i !== index),
    }));
  };

  // Array handlers
  const handleArrayInput = (type, value) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), value],
    }));
    if (type === "benefits") setCurrentBenefit("");
    if (type === "tags") setCurrentTag("");
    if (type === "requirements") setCurrentRequirement("");
  };

  const removeArrayItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index),
    }));
  };

  // Validation con Zod
  const validateForm = (dataToValidate = formData) => {
    const result = opportunitySchema.safeParse(dataToValidate);
    if (!result.success) {
      // Mapear errores de Zod a objeto { campo: mensaje }
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      console.log(fieldErrors);
      setErrors(fieldErrors);
      // Devuelve mensaje general si hay muchos errores
      return "Corrige los errores del formulario.";
    }
    setErrors({});
    return "";
  };

  const submitForm = async (onSuccess, overrideFields = {}) => {
    setError("");
    setSuccess("");

    const dataToSubmit = {
      ...formData,
      ...overrideFields,
    };

    const validationError = validateForm(dataToSubmit);
    if (validationError) {
      setError(validationError);
      return false;
    }

    setLoading(true);
    try {
      // Just pass the form data to the parent's onSubmit
      if (onSuccess) {
        await onSuccess(dataToSubmit);
      }
      setFormData(dataToSubmit); // Sincronizar el estado del formulario
      return true;
    } catch (err) {
      console.error("Error in form submission:", err);
      setError(err.message || "Error al procesar el formulario");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setCurrentBenefit("");
    setCurrentTag("");
    setCurrentRequirement("");
    setError("");
    setErrors({});
  };

  return {
    formData,
    setFormData,
    currentBenefit,
    setCurrentBenefit,
    currentTag,
    setCurrentTag,
    currentRequirement,
    setCurrentRequirement,
    loading,
    error,
    errors, // errores por campo
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
    resetForm,
  };
}
