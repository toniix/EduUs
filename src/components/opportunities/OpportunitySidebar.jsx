import { useState, useEffect, useReducer, useCallback } from "react";
import { ArrowRight, Mail, Globe, FileText } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { useReminders } from "../../hooks/useReminders";
import toast from "react-hot-toast";
import { useLoginRedirect } from "../../hooks/useLoginRedirect";
import ReminderSection from "./OpportunityReminderSection";
import SidebarDeadlineBlock from "./SidebarDeadlineBlock";
import OpportunityProcessTimeline from "./OpportunityProcessTimeline";

const SOCIAL_ICONS = {
  facebook: {
    Icon: FaFacebook,
    color:
      "text-[#1877f2] bg-[#1877f2]/5 border-[#1877f2]/10 hover:bg-[#1877f2]/10 hover:border-[#1877f2]/20",
    label: "Facebook",
  },
  instagram: {
    Icon: FaInstagram,
    color:
      "text-[#e1306c] bg-[#e1306c]/5 border-[#e1306c]/10 hover:bg-[#e1306c]/10 hover:border-[#e1306c]/20",
    label: "Instagram",
  },
  linkedin: {
    Icon: FaLinkedin,
    color:
      "text-[#0a66c2] bg-[#0a66c2]/5 border-[#0a66c2]/10 hover:bg-[#0a66c2]/10 hover:border-[#0a66c2]/20",
    label: "LinkedIn",
  },
};

/* ─── Reducer de recordatorios (mismo que antes) ─────────────── */
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

/* ─── Sidebar principal ──────────────────────────────────────── */
export default function OpportunitySidebar({
  deadline,
  contact,
  social_links = {},
  opportunityId,
  isExpired,
  daysUntilDeadline,
  _organization,
  created_at,
  documentation,
}) {
  const {
    createReminder,
    checkExistingReminders,
    deleteOpportunityReminders,
    loading,
    error,
    isAuthenticated,
  } = useReminders();

  const [reminderState, dispatchReminder] = useReducer(
    reminderReducer,
    reminderInitialState,
  );
  const { showReminderSetup, existingReminders, hasReminders } = reminderState;
  const [selectedDays, setSelectedDays] = useState(["7", "3", "1"]);
  const { redirectToLogin } = useLoginRedirect();

  const reminderOptions = [
    { value: "14", label: "2 semanas", icon: "📅" },
    { value: "7", label: "1 semana", icon: "📆" },
    { value: "3", label: "3 días", icon: "⏰" },
    { value: "1", label: "1 día", icon: "🚨" },
  ];

  const loadExistingReminders = useCallback(async () => {
    const existing = await checkExistingReminders(opportunityId);
    dispatchReminder({ type: "LOAD_REMINDERS", payload: existing });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityId]);

  useEffect(() => {
    if (opportunityId && isAuthenticated) {
      loadExistingReminders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityId, isAuthenticated]);

  const handleToggleReminder = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleCreateReminders = async () => {
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

  // Filtrar y preparar redes sociales válidas
  const activeSocials = Object.entries(social_links)
    .filter(
      ([key, url]) =>
        url && typeof url === "string" && url.trim() && SOCIAL_ICONS[key],
    )
    .map(([key, url]) => ({ key, url, ...SOCIAL_ICONS[key] }));

  return (
    <div className="space-y-4">
      {/* ── Tarjeta principal sticky ── */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Franja decorativa superior con color de estado */}
        <div
          className={`h-1 w-full ${
            isExpired
              ? "bg-gradient-to-r from-red-400 to-red-500"
              : daysUntilDeadline !== null && daysUntilDeadline <= 7
                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                : "bg-gradient-to-r from-primary to-accent"
          }`}
        />

        <div className="p-5 space-y-4">
          {/* Deadline */}
          <SidebarDeadlineBlock
            deadline={deadline}
            isExpired={isExpired}
            daysUntilDeadline={daysUntilDeadline}
          />

          {/* Línea de tiempo del proceso de inscripción */}
          <OpportunityProcessTimeline
            deadline={deadline}
            created_at={created_at}
          />

          {/* CTA Principal */}
          {contact?.website && (
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                group w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm
                transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]
                ${
                  isExpired
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                    : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                }
              `}
            >
              {isExpired ? "Convocatoria cerrada" : "Ir a postular"}
              {!isExpired && (
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </a>
          )}

          {/* Sección de recordatorios */}
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
        </div>

        {/* Contacto, Redes & Documentación */}
        {((contact && (contact.email || contact.website)) ||
          activeSocials.length > 0 ||
          (Array.isArray(documentation) && documentation.length > 0)) && (
          <div className="px-5 pb-5">
            <div className="pt-4 border-t border-gray-100 space-y-4">
              {/* Bloque de Documentación */}
              {Array.isArray(documentation) && documentation.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Documentación oficial
                  </p>

                  {documentation.map((doc, idx) => (
                    <a
                      key={doc.url}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 group py-0.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-150">
                        <FileText className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors duration-150" />
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-primary transition-colors duration-150 truncate">
                        {doc.title || `Documento ${idx + 1}`}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {/* Bloque de Contacto Directo */}
              {(contact?.email || contact?.website) && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Contacto directo
                  </p>

                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2.5 group py-0.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-150">
                        <Mail className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors duration-150" />
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-primary transition-colors duration-150 truncate">
                        {contact.email}
                      </span>
                    </a>
                  )}

                  {contact.website && (
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 group py-0.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/5 group-hover:border-secondary/20 transition-all duration-150">
                        <Globe className="h-3.5 w-3.5 text-gray-400 group-hover:text-secondary transition-colors duration-150" />
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-secondary transition-colors duration-150 truncate">
                        Sitio web oficial
                      </span>
                    </a>
                  )}
                </div>
              )}

              {/* Bloque de Redes Sociales */}
              {activeSocials.length > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2.5">
                    Encuentra más Información Aquí
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {activeSocials.map((social) => {
                      const Icon = social.Icon;
                      return (
                        <a
                          key={social.key}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={social.label}
                          className={`
                            flex items-center justify-center py-2 px-1 rounded-lg border
                            transition-all duration-200 active:scale-95 group
                            ${social.color}
                          `}
                        >
                          <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
