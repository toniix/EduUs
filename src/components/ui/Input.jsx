import React from "react";

const Input = ({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  label,
  icon: Icon,
  error,
  disabled = false,
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`block w-full ${
            Icon ? "pl-10" : "pl-3"
          } pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error ? "border-red-500" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
