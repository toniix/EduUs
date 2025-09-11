import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";

const DeletionLoader = ({
  isDeleting = false,
  message = "Eliminando...",
  variant = "default", // "default", "danger", "warning"
}) => {
  if (!isDeleting) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconColor: "text-red-500",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          bgAccent: "bg-red-50",
        };
      case "warning":
        return {
          iconColor: "text-yellow-500",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          bgAccent: "bg-yellow-50",
        };
      default:
        return {
          iconColor: "text-blue-500",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          bgAccent: "bg-blue-50",
        };
    }
  };

  const styles = getVariantStyles();

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 className={`h-6 w-6 ${styles.iconColor}`} />;
      case "warning":
        return <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />;
      default:
        return (
          <svg
            className={`animate-spin h-6 w-6 ${styles.iconColor}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        className={`flex flex-col items-center gap-4 bg-white rounded-2xl shadow-xl p-8 ${styles.borderColor} ${styles.bgAccent} border-2 animate-pulse`}
      >
        {getIcon()}
        <span className={`${styles.textColor} text-lg font-semibold`}>
          {message}
        </span>
        <div className="flex space-x-1">
          <div
            className={`w-2 h-2 ${styles.iconColor.replace(
              "text-",
              "bg-"
            )} rounded-full animate-bounce`}
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className={`w-2 h-2 ${styles.iconColor.replace(
              "text-",
              "bg-"
            )} rounded-full animate-bounce`}
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className={`w-2 h-2 ${styles.iconColor.replace(
              "text-",
              "bg-"
            )} rounded-full animate-bounce`}
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DeletionLoader;
