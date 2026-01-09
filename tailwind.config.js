/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // important
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        card: "hsl(var(--card))",
        popover: "hsl(var(--popover))",
        muted: "hsl(var(--muted))",
        "muted-soft": "hsl(var(--muted-soft))",

        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",

        text: {
          strong: "hsl(var(--text-strong))",
          DEFAULT: "hsl(var(--text))",
          muted: "hsl(var(--text-muted))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          fg: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
        },

        success: {
          DEFAULT: "hsl(var(--success))",
          fg: "hsl(var(--success-foreground))",
          soft: "hsl(var(--success-soft))",
        },

        warning: {
          DEFAULT: "hsl(var(--warning))",
          fg: "hsl(var(--warning-foreground))",
          soft: "hsl(var(--warning-soft))",
        },

        danger: {
          DEFAULT: "hsl(var(--danger))",
          fg: "hsl(var(--danger-foreground))",
          soft: "hsl(var(--danger-soft))",
        },

        info: {
          DEFAULT: "hsl(var(--info))",
          fg: "hsl(var(--info-foreground))",
          soft: "hsl(var(--info-soft))",
        },

        kpi: {
          blue: "hsl(var(--kpi-blue))",
          orange: "hsl(var(--kpi-orange))",
          purple: "hsl(var(--kpi-purple))",
          red: "hsl(var(--kpi-red))",

          "blue-soft": "hsl(var(--kpi-blue-soft))",
          "orange-soft": "hsl(var(--kpi-orange-soft))",
          "purple-soft": "hsl(var(--kpi-purple-soft))",
          "red-soft": "hsl(var(--kpi-red-soft))",
        },

        sidebar: {
          bg: "hsl(var(--sidebar-bg))",
          border: "hsl(var(--sidebar-border))",
          text: "hsl(var(--sidebar-text))",
          muted: "hsl(var(--sidebar-muted))",
          active: "hsl(var(--sidebar-active-bg))",
        },
      },
    },
  },
  plugins: [],
};
