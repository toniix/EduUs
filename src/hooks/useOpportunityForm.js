import { useState } from "react";
import { createOpportunity } from "../services/opportunityService";
import { opportunitySchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";

const initialState = {
  title: "",
  description: "",
  type: "beca",
  modality: "presencial",
  status: "draft",
  benefits: [],
  requirements: [],
  category_id: null,
  organization: "",
  country: "",
  location: "",
  deadline: "",
  image_url: "",
  contact: { website: "" },
  tags: [],
};

export function useOpportunityForm(initial = {}) {
  const [formData, setFormData] = useState({ ...initialState, ...initial });
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // error general
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({}); // errores por campo

  // Change handlers
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === "file" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  // Submit logic
  const submitForm = async (onSuccess) => {
    setError("");
    setSuccess("");
    console.log(formData);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return false;
    }
    setLoading(true);
    console.log("submitForm");
    try {
      const { success: ok, error: serviceError } = await createOpportunity(
        formData
      );
      if (ok) {
        setSuccess("Oportunidad guardada correctamente.");
        if (onSuccess) onSuccess();
        return true;
      } else {
        console.log(serviceError);
        setError(serviceError || "Ocurrió un error al guardar.");
        return false;
      }
    } catch (err) {
      console.log(err);
      setError("Error inesperado: " + (err.message || err));
      return false;
    } finally {
      setLoading(false);
    }
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
  };
}
