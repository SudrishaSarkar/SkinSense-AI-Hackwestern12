/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skinBg: "#f5f5d5",
        skinSand: "#c7b793",
        skinSage: "#a3b68a",
        skinOlive: "#5c724a",
        skinDeep: "#354a2f",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
