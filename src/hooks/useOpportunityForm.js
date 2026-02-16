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
};

export function useOpportunityForm(initial = {}, categories = []) {
  const [formData, setFormData] = useState({ ...initialState, ...initial });
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === "file" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      // Si es el campo category_id, también actualizamos el category con el nombre correspondiente
      if (name === "category_id") {
        const selectedCategory = categories.find((cat) => cat.id === value);
        setFormData((prev) => ({
          ...prev,
          category_id: value,
          category: selectedCategory ? selectedCategory.name : "",
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
  const validateForm = () => {
    const result = opportunitySchema.safeParse(formData);
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

  const submitForm = async (onSuccess) => {
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return false;
    }

    setLoading(true);
    try {
      // Just pass the form data to the parent's onSubmit
      if (onSuccess) {
        await onSuccess(formData);
      }
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
    handleArrayInput,
    removeArrayItem,
    submitForm,
    resetForm,
  };
}
