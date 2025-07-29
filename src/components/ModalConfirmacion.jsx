import React from "react";

export default function ModalConfirmacion({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-6 text-gray-700 break-words whitespace-pre-line word-break break-all">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
