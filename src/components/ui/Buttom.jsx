const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  onClick,
  fullWidth = true,
}) => {
  const baseStyles =
    "flex justify-center items-center gap-2 py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "border-transparent text-white bg-primary hover:bg-primary/90 focus:ring-primary",
    secondary:
      "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
