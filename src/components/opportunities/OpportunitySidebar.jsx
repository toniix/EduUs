import { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, Mail, Globe } from "lucide-react";
import { useReminders } from "../../hooks/useReminders";
import toast from "react-hot-toast";
import { useLoginRedirect } from "../../hooks/useLoginRedirect";
import ReminderSection from "./OpportunityReminderSection";

const reminderInitialState = {
  showReminderSetup: false,
  existingReminders: [],
  hasReminders: false,
  showSuccess: false,
};

function reminderReducer(state, action) {
  switch (action.type) {
    case "SHOW_SETUP":
      return { ...state, showReminderSetup: true, showSuccess: false };
    case "HIDE_SETUP":
      return { ...state, showReminderSetup: false };
    case "LOAD_REMINDERS":
      return {
        ...state,
        existingReminders: action.payload,
        hasReminders: action.payload.length > 0,
      };
    case "CREATE_SUCCESS":
      return {
        ...state,
        showReminderSetup: false,
        showSuccess: true,
        existingReminders: action.payload,
        hasReminders: action.payload.length > 0,
      };
    case "DELETE_SUCCESS":
      return {
        ...state,
        existingReminders: [],
        hasReminders: false,
        showSuccess: true,
      };
    default:
      return state;
  }
}

export default function OpportunitySidebar({
  deadline,
  contact,
  opportunityId,
  isExpired,
  daysUntilDeadline,
}) {
  const {
    createReminder,
    checkExistingReminders,
    deleteOpportunityReminders,
    loading,
    error,
    isAuthenticated,
  } = useReminders();

  // console.log("isAuthenticated:", isAuthenticated);

  const [reminderState, dispatchReminder] = useReducer(
    reminderReducer,
    reminderInitialState,
  );
  const { showReminderSetup, existingReminders, hasReminders, showSuccess } =
    reminderState;

  const [selectedDays, setSelectedDays] = useState(["7", "3", "1"]);
  const { redirectToLogin } = useLoginRedirect();

  const reminderOptions = [
    { value: "14", label: "2 semanas", icon: "📅" },
    { value: "7", label: "1 semana", icon: "📆" },
    { value: "3", label: "3 días", icon: "⏰" },
    { value: "1", label: "1 día", icon: "🚨" },
  ];

  // Cargar recordatorios existentes
  useEffect(() => {
    if (opportunityId && isAuthenticated) {
      loadExistingReminders();
    }
  }, [opportunityId, isAuthenticated]);

  const loadExistingReminders = async () => {
    const existing = await checkExistingReminders(opportunityId);
    dispatchReminder({ type: "LOAD_REMINDERS", payload: existing });
  };

  const handleToggleReminder = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleCreateReminders = async () => {
    // console.log("creando recordatorios");
    if (selectedDays.length === 0) return;

    const result = await createReminder(opportunityId, selectedDays);
    if (result.success) {
      const existing = await checkExistingReminders(opportunityId);
      dispatchReminder({ type: "CREATE_SUCCESS", payload: existing });
      toast.success("Recordatorios configurados exitosamente");
    }
  };

  const handleDeleteReminders = async () => {
    const result = await deleteOpportunityReminders(opportunityId);
    if (result.success) {
      dispatchReminder({ type: "DELETE_SUCCESS" });
      toast.success("Recordatorios eliminados exitosamente");
    }
  };

  const handleLoginClick = () => {
    redirectToLogin();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
        {deadline && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              isExpired
                ? "bg-red-50 border border-red-200"
                : daysUntilDeadline <= 7
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-center">
              <Calendar
                className={`h-4 w-4 mr-2 ${
                  isExpired
                    ? "text-red-500"
                    : daysUntilDeadline <= 7
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isExpired ? "Fecha límite vencida" : "Fecha límite"}
                </p>
                <p
                  className={`text-sm ${
                    isExpired
                      ? "text-red-600"
                      : daysUntilDeadline <= 7
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {new Date(deadline).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {!isExpired && daysUntilDeadline !== null && (
                    <span className="block">
                      {daysUntilDeadline === 0
                        ? "¡Hoy!"
                        : daysUntilDeadline === 1
                          ? "¡Mañana!"
                          : `${daysUntilDeadline} días restantes`}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <a
          href={contact.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-primary text-white hover:bg-primary/90 hover:shadow-lg mb-4"
        >
          Mas información
          <ArrowRight className="h-4 w-4 ml-2" />
        </a>

        <ReminderSection
          isAuthenticated={isAuthenticated}
          isExpired={isExpired}
          reminderState={reminderState}
          dispatchReminder={dispatchReminder}
          selectedDays={selectedDays}
          reminderOptions={reminderOptions}
          daysUntilDeadline={daysUntilDeadline}
          loading={loading}
          error={error}
          handleToggleReminder={handleToggleReminder}
          handleCreateReminders={handleCreateReminders}
          handleDeleteReminders={handleDeleteReminders}
          handleLoginClick={handleLoginClick}
        />

        {/* Información de Contacto */}
        {contact && (
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Información de contacto
            </h3>
            <div className="space-y-2 text-sm">
              {contact.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-primary"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="h-4 w-4 mr-2" />
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    Sitio web o plataforma de inscripción
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
