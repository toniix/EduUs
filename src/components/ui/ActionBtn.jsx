function ActionBtn({ children, title, onClick, isDark, danger = false }) {
    return (
        <button
            title={title}
            onClick={onClick}
            className={`p-1.5 rounded-lg transition-colors ${danger
                ? "hover:bg-red-100 text-red-500 hover:text-red-700"
                : isDark
                    ? "hover:bg-gray-500 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
        >
            {children}
        </button>
    );
}
export default ActionBtn;