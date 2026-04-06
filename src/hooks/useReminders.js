// src/hooks/useReminders.js
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export function useReminders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { profile, isAuthenticated } = useAuth();

  /**
   * Crear recordatorios para una oportunidad
   */
  const createReminder = async (
    opportunityId,
    reminderTypes = ["7", "3", "1"],
  ) => {
    if (!profile) {
      setError("Usuario no autenticado");
      return { success: false, error: "Usuario no autenticado" };
    }

    setLoading(true);
    setError(null);

    try {
      // Llamar a la Edge Function
      const { data, error } = await supabase.functions.invoke(
        "create-reminder",
        {
          body: {
            userId: profile.id,
            opportunityId,
            reminderTypes,
          },
        },
      );

      if (error) {
        console.error("❌ Error llamando a la función:", error);
        throw new Error(error.message || "Error al crear recordatorios");
      }

      if (!data || !data.success) {
        const errorMessage =
          data?.error || data?.message || "Error desconocido";
        console.error("❌ Respuesta de error:", data);
        throw new Error(errorMessage);
      }

      console.log("✅ Recordatorios creados:", data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || "Error creando recordatorios";
      console.error("💥 Error en createReminder:", errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener recordatorios del usuario actual
   */
  const getUserReminders = async () => {
    if (!profile) {
      setError("Usuario no autenticado");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("reminders")
        .select(
          `
          *,
          opportunities (
            id,
            title,
            deadline,
            type,
            url
          )
        `,
        )
        .eq("user_id", profile.id)
        .order("reminder_date", { ascending: true });

      if (error) {
        console.error("❌ Error obteniendo recordatorios:", error);
        throw new Error(error.message);
      }

      console.log("📋 Recordatorios obtenidos:", data?.length || 0);
      return data || [];
    } catch (err) {
      const errorMessage = err.message || "Error obteniendo recordatorios";
      console.error("💥 Error en getUserReminders:", errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar un recordatorio específico
   */
  const deleteReminder = async (reminderId) => {
    if (!profile) {
      setError("Usuario no autenticado");
      return { success: false, error: "Usuario no autenticado" };
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", reminderId)
        .eq("user_id", profile.id);

      if (error) {
        console.error("❌ Error eliminando recordatorio:", error);
        throw new Error(error.message);
      }

      console.log("🗑️ Recordatorio eliminado:", reminderId);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Error eliminando recordatorio";
      console.error("💥 Error en deleteReminder:", errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar todos los recordatorios de una oportunidad
   */
  const deleteOpportunityReminders = async (opportunityId) => {
    if (!profile) {
      setError("Usuario no autenticado");
      return { success: false, error: "Usuario no autenticado" };
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("opportunity_id", opportunityId)
        .eq("user_id", profile.id);

      if (error) {
        console.error(
          "❌ Error eliminando recordatorios de oportunidad:",
          error,
        );
        throw new Error(error.message);
      }

      // console.log("🗑️ Recordatorios de oportunidad eliminados:", opportunityId);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Error eliminando recordatorios";
      console.error("💥 Error en deleteOpportunityReminders:", errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verificar si existe recordatorio para una oportunidad
   */
  const checkExistingReminders = async (opportunityId) => {
    if (!profile) return [];

    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("id, reminder_type, status, reminder_date")
        .eq("user_id", profile.id)
        .eq("opportunity_id", opportunityId);

      if (error) {
        console.error("❌ Error verificando recordatorios existentes:", error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("💥 Error en checkExistingReminders:", err);
      return [];
    }
  };

  /**
   * Obtener estadísticas de recordatorios
   */
  const getReminderStats = async () => {
    if (!profile) return null;

    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("status")
        .eq("user_id", profile.id);

      if (error) {
        console.error("❌ Error obteniendo estadísticas:", error);
        return null;
      }

      const stats = {
        total: data?.length || 0,
        pending: data?.filter((r) => r.status === "pending").length || 0,
        sent: data?.filter((r) => r.status === "sent").length || 0,
        failed: data?.filter((r) => r.status === "failed").length || 0,
      };

      return stats;
    } catch (err) {
      console.error("💥 Error en getReminderStats:", err);
      return null;
    }
  };

  return {
    // Funciones principales
    createReminder,
    getUserReminders,
    deleteReminder,
    deleteOpportunityReminders,
    checkExistingReminders,
    getReminderStats,

    // Estados
    loading,
    error,

    // Información del usuario
    profile,
    isAuthenticated,
  };
}
