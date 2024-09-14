/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        flash: {
          "0%, 100%": { backgroundColor: "#fff" },
          "50%": { backgroundColor: "#ffe6e6" },
        },
      },
      animation: {
        flash: "flash 1s infinite alternate",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
