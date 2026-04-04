import { parse } from "postcss";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext } from "react";

const FeaturedModal = ({
  showFeaturedModal,
  setShowFeaturedModal,
  featuredForm,
  handleFeaturedChange,
  handleFeaturedSave,
  isSavingFeatured,
}) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl max-w-md w-full overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-6 py-5 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? "bg-amber-900/40" : "bg-amber-50"}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#FAC775" : "#BA7517"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <p
              className={`text-sm font-semibold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Destacar esta oportunidad
            </p>
            <p
              className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Configura la visibilidad de esta oportunidad
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Toggle card */}
          <label
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
              featuredForm.is_featured
                ? isDark
                  ? "border-amber-500/40 bg-amber-900/20"
                  : "border-amber-300 bg-amber-50"
                : isDark
                  ? "border-gray-600 bg-gray-700/50"
                  : "border-gray-200 bg-gray-50"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                featuredForm.is_featured
                  ? "border-amber-500 bg-amber-400"
                  : isDark
                    ? "border-gray-500 bg-transparent"
                    : "border-gray-300 bg-white"
              }`}
            >
              {featuredForm.is_featured && (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke={isDark ? "#1a1a1a" : "#633806"}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1.5 6 4.5 9 10.5 3" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              id="is_featured_modal"
              checked={featuredForm.is_featured}
              onChange={(e) =>
                handleFeaturedChange("is_featured", e.target.checked)
              }
              className="sr-only"
            />
            <div>
              <p
                className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Marcar como destacado
              </p>
            </div>
          </label>

          {/* Position grid */}
          {featuredForm.is_featured && (
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Posición <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "1", label: "Primera" },
                  { value: "2", label: "Segunda" },
                  { value: "3", label: "Tercera" },
                  { value: "4", label: "Cuarta" },
                ].map(({ value, label }) => {
                  const isSelected =
                    featuredForm.featured_order === parseInt(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleFeaturedChange("featured_order", value)
                      }
                      className={`py-3 rounded-xl border text-center transition ${
                        isSelected
                          ? isDark
                            ? "border-amber-500 bg-amber-900/40"
                            : "border-amber-400 bg-amber-50"
                          : isDark
                            ? "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <p
                        className={`text-base font-semibold ${isSelected ? (isDark ? "text-amber-300" : "text-amber-700") : isDark ? "text-white" : "text-gray-800"}`}
                      >
                        {value}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${isSelected ? (isDark ? "text-amber-400" : "text-amber-600") : isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex gap-3 px-6 pb-6`}>
          <button
            onClick={() => setShowFeaturedModal(false)}
            disabled={isSavingFeatured}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
              isDark
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleFeaturedSave}
            disabled={
              isSavingFeatured ||
              (featuredForm.is_featured && !featuredForm.featured_order)
            }
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {isSavingFeatured ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default FeaturedModal;
