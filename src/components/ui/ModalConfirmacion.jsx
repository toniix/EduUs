import { m, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, Info, X } from "lucide-react";

export default function ModalConfirmacion({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "info", // "info", "danger", "warning"
}) {
  const lowerConfirm = confirmText.toLowerCase();
  const activeVariant =
    variant !== "info"
      ? variant
      : lowerConfirm.includes("eliminar") || lowerConfirm.includes("delete") || lowerConfirm.includes("borrar")
      ? "danger"
      : lowerConfirm.includes("destacar") || lowerConfirm.includes("promo") || lowerConfirm.includes("star")
      ? "warning"
      : "info";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <m.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-3xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-10 flex flex-col items-center text-center gap-4 animate-[fadeIn_0.2s_ease]"
          >
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Badge */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 shrink-0 ${
              activeVariant === "danger"
                ? "bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-200 dark:border-red-800"
                : activeVariant === "warning"
                ? "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-550 border border-yellow-200 dark:border-yellow-800"
                : "bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20"
            }`}>
              {activeVariant === "danger" ? (
                <Trash2 className="w-5 h-5" />
              ) : activeVariant === "warning" ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-light tracking-tight font-heading">
              {title}
            </h3>

            {/* Message Body */}
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed w-full break-words whitespace-pre-line text-center">
              {message}
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full mt-2 justify-center">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gray-150 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-300 font-bold text-sm transition-all active:scale-[0.98]"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98] shadow-md ${
                  activeVariant === "danger"
                    ? "bg-red-550 hover:bg-red-600 shadow-red-500/10"
                    : activeVariant === "warning"
                    ? "bg-yellow-550 hover:bg-yellow-600 text-gray-900 shadow-yellow-500/10"
                    : "bg-primary hover:bg-primary/95 shadow-primary/15"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
