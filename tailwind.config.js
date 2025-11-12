/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Habilita el modo oscuro basado en clases
  theme: {
    extend: {
      colors: {
        primary: "#ec451d",
        secondary: {
          DEFAULT: "#4db9a9",
          light: "#E0F2F0", // Lighter variant of secondary color
        },
        accent: "#f5ba3c",
        light: "#FFFFFF",
        dark: "#222222",
        // Colores adicionales para el modo oscuro
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        // Para títulos
        heading: ["Space Grotesk", "sans-serif"],

        // Para contenido general - sobrescribe la fuente sans por defecto
        sans: ["Nunito", "ui-sans-serif", "system-ui"],

        // // También puedes crear un alias específico para Nunito
        // body: ["Nunito", "sans-serif"],
      },
      transitionProperty: {
        colors:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
      },
    },
  },
  plugins: [],
};
