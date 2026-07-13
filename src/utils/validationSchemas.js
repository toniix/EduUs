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
        "El nombre solo puede contener letras",
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

// Esquema de validación con Zod
export const opportunitySchema = z.object({
  title: z.string().min(3, "El título es obligatorio."),
  description: z.string().min(5, "La descripción es obligatoria."),
  modality: z.string().min(1, "La modalidad es obligatoria."),
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
  audience: z
    .string()
    .min(1, "El campo 'Quienes pueden postular' es obligatorio."),
  benefits: z.array(z.string()).min(1, "Al menos un beneficio es obligatorio."),
  requirements: z
    .array(z.string())
    .min(1, "Al menos una requisito es obligatorio.")
    .max(10, "Solo se permiten 10 requisitos."),
  tags: z
    .array(z.string())
    .min(1, "Al menos una etiqueta es obligatoria.")
    .max(5, "Solo se permiten 5 etiquetas."),
  contact: z.object({ website: z.string().optional() }).optional(),
  is_featured: z.boolean().optional().default(false),
  featured_order: z.number().min(1).max(4).nullable().optional(),
  is_published: z.boolean().optional().default(false),
  video_url: z
    .string()
    .url("La URL del video no es válida.")
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  social_links: z
    .object({
      facebook: z.string().optional().or(z.literal("")),
      instagram: z.string().optional().or(z.literal("")),
      linkedin: z.string().optional().or(z.literal("")),
    })
    .optional()
    .nullable(),
  application_steps: z
    .array(
      z.object({
        id: z.number().or(z.string()),
        title: z.string().min(1, "El título del paso es obligatorio"),
        description: z
          .string()
          .min(1, "La descripción del paso es obligatoria"),
        duration: z.string().optional().or(z.literal("")),
      }),
    )
    .optional()
    .nullable(),
  documentation: z
    .array(
      z.object({
        title: z.string().min(1, "El título del documento es obligatorio"),
        url: z.string().url("La URL del documento no es válida."),
      }),
    )
    .optional()
    .nullable(),
});

// Esquema de validación para eventos
export const eventSchema = z
  .object({
    title: z
      .string()
      .min(3, "El título debe tener al menos 3 caracteres.")
      .max(150, "El título no puede exceder 150 caracteres."),
    category: z.string().min(1, "La categoría es obligatoria."),
    modality: z.string().min(1, "La modalidad es obligatoria."),
    starts_at: z.string().min(1, "La fecha de inicio es obligatoria."),
    slug: z.string().optional(),
    description: z.string().min(1, "La descripción es obligatoria."),
    location: z.string().optional().nullable().or(z.literal("")),
    banner_url: z
      .string()
      .url("La URL del banner no es válida.")
      .optional()
      .or(z.literal(""))
      .or(z.null()),
    ends_at: z.string().optional(),
    capacity: z
      .number()
      .positive("La capacidad debe ser mayor a 0.")
      .nullable()
      .optional(),
    price: z
      .number()
      .min(0, "El precio no puede ser negativo.")
      .nullable()
      .optional(),
    promo_modal: z.boolean().optional(),
    registration_url: z
      .string()
      .url("La URL de inscripción no es válida.")
      .optional()
      .or(z.literal(""))
      .or(z.null()),
    status: z.enum(["draft", "published", "cancelled", "finished"]).optional(),
    speaker_id: z
      .string()
      .uuid("El ponente seleccionado no es válido.")
      .optional()
      .nullable()
      .or(z.literal("")),
    directed_to: z.string().min(1, "El campo 'Dirigido a' es obligatorio."),
    extra_details: z.string().optional().nullable().or(z.literal("")),
    brochure_url: z.string().optional().nullable().or(z.literal("")),
    zoom_link: z.string().optional().nullable().or(z.literal("")),
    benefits: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (
        data.modality === "presencial" &&
        (!data.location || !data.location.trim())
      ) {
        return false;
      }
      return true;
    },
    {
      message: "La ubicación es obligatoria para eventos presenciales.",
      path: ["location"],
    },
  )
  .refine(
    (data) => {
      if (
        data.modality === "presencial" &&
        (!data.brochure_url || !data.brochure_url.trim())
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "El brochure del evento es obligatorio para eventos presenciales.",
      path: ["brochure_url"],
    },
  )
  .refine(
    (data) => {
      if (
        (data.modality === "virtual" || data.modality === "hibrido") &&
        (!data.zoom_link || !data.zoom_link.trim())
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "El enlace de Zoom es obligatorio para eventos virtuales/híbridos.",
      path: ["zoom_link"],
    },
  );

// Esquema de validación para proyectos
export const projectSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().min(1, "La descripción corta es obligatoria."),
  details: z.string().min(1, "Los detalles son obligatorios."),
  icon: z.string().min(1, "El icono es obligatorio."),
  fondo: z.string().min(1, "La foto destacada es obligatoria."),
  objectives: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});

// Esquema de validación para inscripción de asistencia a eventos
export const eventRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre y apellidos debe tener al menos 3 caracteres.")
      .max(80, "El nombre no puede exceder los 80 caracteres."),
    email: z
      .string()
      .email("Ingresa un correo electrónico válido.")
      .toLowerCase(),
    age: z
      .string()
      .min(1, "La edad es obligatoria.")
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && num > 0 && num <= 100;
        },
        { message: "Ingresa una edad válida." },
      ),
    phone: z
      .string()
      .regex(/^\d{9}$/, "Ingresa un número de celular válido (9 dígitos)."),
    occupation: z.string().min(1, "Selecciona tu ocupación actual."),
    career: z
      .string()
      .min(1, "La carrera o área de estudios es obligatoria.")
      .max(25, "La carrera no puede exceder los 25 caracteres."),
    interest_reason: z
      .string()
      .min(1, "Por favor, cuéntanos tu interés en participar.")
      .max(100, "La carrera no puede exceder los 100 caracteres."),
    referral_source: z.string().min(1, "Selecciona cómo te enteraste."),
    dni: z.string().optional().nullable().or(z.literal("")),
    is_student_at_location: z.boolean().optional(),
    modality: z.enum(["presencial", "virtual", "hibrido"]).optional(),
  })
  .refine(
    (data) => {
      if (
        data.modality === "presencial" &&
        (!data.dni || !/^\d{8}$/.test(data.dni.trim()))
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "El DNI es obligatorio y debe tener 8 dígitos para eventos presenciales.",
      path: ["dni"],
    },
  );
