import { Bell, Check, X, Settings, BellRing } from "lucide-react";

const ReminderSection = ({
  isAuthenticated,
  isExpired,
  reminderState,
  dispatchReminder,
  selectedDays,
  reminderOptions,
  daysUntilDeadline,
  loading,
  error,
  handleToggleReminder,
  handleCreateReminders,
  handleDeleteReminders,
  handleLoginClick,
}) => {
  const { showReminderSetup, existingReminders, hasReminders, showSuccess } =
    reminderState;

  if (isExpired) return null;

  if (!isAuthenticated) {
    return (
      <div className="mt-6 mb-6">
        <div className="relative bg-gradient-to-br from-[#f0f9f7] to-[#e0f4f1] p-4 rounded-xl border border-[#4db9a9]/20 shadow-sm overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-[#4db9a9]/10 p-2 rounded-lg mr-3">
                <Bell className="h-5 w-5 text-[#4db9a9]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  ¿Quieres recordatorios?
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Inicia sesión para configurar recordatorios personalizados por
                  email.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleLoginClick}
                    className="px-4 py-2 text-s font-medium rounded-md text-white bg-[#4db9a9] hover:bg-[#3a9e8f]"
                  >
                    Iniciar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 pt-6 mb-6">
      {/* Éxito */}
      {showSuccess && (
        <div className="mb-4 p-3 bg-gradient-to-r from-[#4db9a9]/10 to-[#4db9a9]/5 border border-[#4db9a9]/30 rounded-xl shadow-sm">
          <div className="flex items-center text-[#4db9a9]">
            <div className="flex-shrink-0 w-8 h-8 bg-[#4db9a9] rounded-full flex items-center justify-center mr-3">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {hasReminders
                  ? "¡Recordatorios configurados!"
                  : "¡Recordatorios eliminados!"}
              </p>
              <p className="text-xs text-[#4db9a9]/80 mt-0.5">
                {hasReminders
                  ? "Te notificaremos por email antes de la fecha límite"
                  : "Ya no recibirás notificaciones para esta oportunidad"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-gradient-to-r from-[#ec451d]/10 to-[#ec451d]/5 border border-[#ec451d]/30 rounded-xl shadow-sm">
          <div className="flex items-center text-[#ec451d]">
            <div className="flex-shrink-0 w-8 h-8 bg-[#ec451d] rounded-full flex items-center justify-center mr-3">
              <X className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">
                Error al procesar recordatorio
              </p>
              <p className="text-xs text-[#ec451d]/80 mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botón principal */}
      {!hasReminders && !showReminderSetup && (
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#4db9a9] to-[#4db9a9]/80 rounded-full mb-2">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">
              No te pierdas esta oportunidad
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Configura recordatorios para recibir alertas antes de la fecha
              límite
            </p>
          </div>
          <button
            onClick={() => dispatchReminder({ type: "SHOW_SETUP" })}
            className="w-full bg-gradient-to-r from-[#4db9a9] to-[#4db9a9]/90 hover:from-[#4db9a9]/90 hover:to-[#4db9a9] text-white py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Configurar recordatorios
          </button>
        </div>
      )}

      {/* Recordatorios existentes */}
      {hasReminders && !showReminderSetup && (
        <div className="bg-gradient-to-br from-[#4db9a9]/5 to-white border border-[#4db9a9]/20 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#4db9a9] to-[#4db9a9]/80 rounded-full flex items-center justify-center mr-3">
                <BellRing className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#4db9a9] text-sm">
                  Recordatorios activos
                </h3>
                <p className="text-xs text-gray-600">
                  {existingReminders.length} recordatorio
                  {existingReminders.length > 1 ? "s" : ""} configurado
                  {existingReminders.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatchReminder({ type: "SHOW_SETUP" })}
              className="flex items-center px-3 py-1.5 text-xs text-[#4db9a9] hover:text-[#4db9a9]/80 hover:bg-[#4db9a9]/10 rounded-lg transition-all duration-200"
            >
              <Settings className="h-3 w-3 mr-1" /> Gestionar
            </button>
          </div>
          <div className="space-y-2">
            {existingReminders.slice(0, 3).map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#4db9a9] rounded-full mr-3" />
                  <span className="text-sm text-gray-700 font-medium">
                    {reminderOptions.find(
                      (o) =>
                        o.value === reminder.reminder_type.replace("_days", ""),
                    )?.label || reminder.reminder_type}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reminder.status === "pending"
                      ? "bg-secondary/20 text-[#f5ba3c] border border-[#f5ba3c]/30"
                      : reminder.status === "sent"
                        ? "bg-[#4db9a9]/20 text-[#4db9a9] border border-[#4db9a9]/30"
                        : "bg-[#ec451d]/20 text-[#ec451d] border border-[#ec451d]/30"
                  }`}
                >
                  {reminder.status === "pending"
                    ? "Pendiente"
                    : reminder.status === "sent"
                      ? "Enviado"
                      : "Error"}
                </span>
              </div>
            ))}
            {existingReminders.length > 3 && (
              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">
                  y {existingReminders.length - 3} más...
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Panel configuración */}
      {showReminderSetup && (
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f5ba3c] to-[#f5ba3c]/80 rounded-full flex items-center justify-center mr-3">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-base font-semibold text-gray-900">
                {hasReminders
                  ? "Gestionar recordatorios"
                  : "Configurar recordatorios"}
              </h4>
            </div>
            <button
              onClick={() => dispatchReminder({ type: "HIDE_SETUP" })}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {hasReminders && (
            <div className="mb-5 p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <BellRing className="h-4 w-4 mr-2 text-[#4db9a9]" />{" "}
                Recordatorios actuales
              </p>
              <div className="space-y-2 mb-4">
                {existingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#4db9a9] rounded-full mr-3" />
                      <span className="text-sm text-gray-700">
                        {
                          reminderOptions.find(
                            (o) =>
                              o.value ===
                              reminder.reminder_type.replace("_days", ""),
                          )?.label
                        }
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reminder.status === "pending"
                          ? "bg-[#f5ba3c]/20 text-[#f5ba3c] border border-[#f5ba3c]/30"
                          : reminder.status === "sent"
                            ? "bg-[#4db9a9]/20 text-[#4db9a9] border border-[#4db9a9]/30"
                            : "bg-[#ec451d]/20 text-[#ec451d] border border-[#ec451d]/30"
                      }`}
                    >
                      {reminder.status === "pending"
                        ? "Pendiente"
                        : reminder.status === "sent"
                          ? "Enviado"
                          : "Error"}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleDeleteReminders}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ec451d] to-[#ec451d]/90 hover:from-[#ec451d]/90 hover:to-[#ec451d] text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Eliminando..." : "Eliminar todos los recordatorios"}
              </button>
            </div>
          )}

          {!hasReminders && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-[#f5ba3c]/10 to-[#f5ba3c]/5 rounded-xl border border-[#f5ba3c]/20">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f5ba3c] to-[#f5ba3c]/80 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-700 font-medium mb-1">
                  ¿Cuándo quieres que te recordemos?
                </p>
                <p className="text-xs text-gray-600">
                  Te enviaremos un email antes de la fecha límite
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {reminderOptions.map((option) => {
                  const isDisabled =
                    daysUntilDeadline <= parseInt(option.value);
                  const isSelected = selectedDays.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      htmlFor={`reminder-${option.value}`}
                      className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isDisabled
                          ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-200"
                          : isSelected
                            ? "bg-gradient-to-r from-[#4db9a9]/10 to-[#4db9a9]/5 border-[#4db9a9] shadow-md transform scale-105"
                            : "bg-white border-gray-200 hover:border-[#4db9a9]/50 hover:bg-[#4db9a9]/5 hover:shadow-sm"
                      }`}
                    >
                      <input
                        id={`reminder-${option.value}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          !isDisabled && handleToggleReminder(option.value)
                        }
                        disabled={isDisabled}
                        className="sr-only"
                      />
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? "bg-[#4db9a9] border-[#4db9a9]"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{option.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {option.label}
                        </span>
                      </div>
                      {isDisabled && (
                        <div className="absolute inset-0 bg-gray-100/50 rounded-xl flex items-center justify-center">
                          <span className="text-xs text-gray-500 font-medium">
                            No disponible
                          </span>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleCreateReminders}
                  disabled={loading || selectedDays.length === 0}
                  className="flex-1 bg-gradient-to-r from-[#4db9a9] to-[#4db9a9]/90 hover:from-[#4db9a9]/90 hover:to-[#4db9a9] text-white py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Creando...
                    </div>
                  ) : (
                    `Crear ${selectedDays.length > 0 ? selectedDays.length + " " : ""}recordatorio${selectedDays.length > 1 ? "s" : ""}`
                  )}
                </button>
                <button
                  onClick={() => dispatchReminder({ type: "HIDE_SETUP" })}
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReminderSection;
