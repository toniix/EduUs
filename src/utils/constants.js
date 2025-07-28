// ===================================================
// CONSTANTES DE ROLES
// ===================================================

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  USER: "user",
};

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
