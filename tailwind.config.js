/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ED441D",
        secondary: "#4BBAAA",
        accent: "#F4B63B",
        light: "#FFFFFF",
        dark: "#222222",
      },
    },
  },
  plugins: [],
};
