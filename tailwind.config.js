/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00D9FF",
        secondary: "#7B61FF",
        accent: "#00F5A0",
        surface: "#1E1E2E",
        background: "#151521",
        success: "#00F5A0",
        warning: "#FFB800",
        error: "#FF3B3B",
        info: "#00D9FF",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}