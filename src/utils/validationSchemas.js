// src/utils/validationSchemas.js

import { z } from "zod";

// ===================================================
// ESQUEMAS DE VALIDACIÓN
// ===================================================

// Esquema para registro de usuario
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El nombre solo puede contener letras"
      ),

    email: z.string().email("Correo electrónico inválido").toLowerCase(),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(50, "La contraseña no puede exceder 50 caracteres"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Esquema para login
export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido").toLowerCase(),

  password: z.string().min(1, "La contraseña es requerida"),
});

// Esquema para recuperar contraseña
export const forgotPasswordSchema = z.object({
  email: z.string().email("Correo electrónico inválido").toLowerCase(),
});

// Esquema para cambiar contraseña
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),

    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres"),

    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["newPassword"],
  });

// Esquema para perfil de usuario
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

  email: z.string().email("Correo electrónico inválido").toLowerCase(),

  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]+$/, "Número de teléfono inválido")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .max(500, "La biografía no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// ===================================================
// CONSTANTES DE VALIDACIÓN
// ===================================================

export const VALIDATION_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_BIO_LENGTH: 500,
};

// ===================================================
// MENSAJES DE ERROR PERSONALIZADOS
// ===================================================

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Este campo es requerido",
  INVALID_EMAIL: "Correo electrónico inválido",
  PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH} caracteres`,
  PASSWORDS_DONT_MATCH: "Las contraseñas no coinciden",
  NAME_TOO_SHORT: `El nombre debe tener al menos ${VALIDATION_CONSTANTS.MIN_NAME_LENGTH} caracteres`,
  INVALID_PHONE: "Número de teléfono inválido",
};

// Esquema de validación con Zod
export const opportunitySchema = z.object({
  title: z.string().min(5, "El título es obligatorio."),
  description: z.string().min(5, "La descripción es obligatoria."),
  type: z.string().min(1, "El tipo es obligatorio."),
  modality: z.string().min(1, "La modalidad es obligatoria."),
  status: z.string().min(1, "El estado es obligatorio."),
  organization: z.string().min(1, "La organización es obligatoria."),
  country: z.string().min(1, "El país es obligatorio."),
  location: z.string().min(1, "La ubicación es obligatoria."),
  deadline: z.string().min(1, "La fecha límite es obligatoria."),
  image_url: z
    .any()
    .refine((val) => val && (typeof val === "string" || val instanceof File), {
      message: "La imagen es obligatoria.",
    }),
  category: z.string().optional(),
  category_id: z.string().min(1, "La categoría es obligatoria"),
  benefits: z.array(z.string()).min(1, "Al menos un beneficio es obligatorio."),
  requirements: z
    .array(z.string())
    .min(1, "Al menos una requisito es obligatorio."),
  tags: z.array(z.string()).min(1, "Al menos una etiqueta es obligatoria."),
  contact: z.object({ website: z.string().optional() }).optional(),
});
