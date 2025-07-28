// src/services/RolesService.js

import { supabase } from "../lib/supabase";

// Obtener el rol del usuario actual
export const getCurrentUserRole = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data?.role || "user";
};

// Obtener perfil completo del usuario actual
export const getCurrentUserProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
};

// Verificar si el usuario actual tiene un rol específico
export const hasRole = async (requiredRole) => {
  try {
    const userRole = await getCurrentUserRole();
    return userRole === requiredRole;
  } catch (error) {
    console.error("Error verificando rol:", error);
    return false;
  }
};

// Verificar si el usuario tiene cualquiera de los roles especificados
export const hasAnyRole = async (roles) => {
  try {
    const userRole = await getCurrentUserRole();
    return roles.includes(userRole);
  } catch (error) {
    console.error("Error verificando roles:", error);
    return false;
  }
};

// ===================================================
// GESTIÓN DE ROLES (Solo para administradores)
// ===================================================

// Obtener todos los usuarios con sus roles
export const getAllUsersWithRoles = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Actualizar rol de un usuario
export const updateUserRole = async (userId, newRole) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Formatear nombre de rol para mostrar
export const formatRoleName = (roleName) => {
  const roleNames = {
    admin: "Administrador",
    editor: "Editor",
    user: "Usuario",
  };

  return roleNames[roleName] || roleName;
};
