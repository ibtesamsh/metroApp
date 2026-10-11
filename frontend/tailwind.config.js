/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        // Semantic tokens driven by CSS variables (see index.css)
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          fg: "rgb(var(--brand-fg) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          fg: "rgb(var(--accent-fg) / <alpha-value>)",
        },
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgb(0 0 0 / 0.15)",
        lift: "0 12px 30px -8px rgb(0 0 0 / 0.25)",
        glow: "0 0 0 4px rgb(var(--brand) / 0.15)",
      },
      spacing: { 4.5: "1.125rem" },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "dash-move": { to: { strokeDashoffset: "-32" } },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "dash-move": "dash-move 1s linear infinite",
      },
    },
  },
  plugins: [],
};
