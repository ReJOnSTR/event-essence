import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Ana renkler
        "primary": {
          DEFAULT: "#6366f1", // Indigo-500
          dark: "#4338ca", // Indigo-700
          light: "#a5b4fc", // Indigo-300
          foreground: "hsl(var(--primary-foreground))",
        },
        "secondary": {
          DEFAULT: "#8b5cf6", // Violet-500
          dark: "#6d28d9", // Violet-700
          light: "#c4b5fd", // Violet-300
          foreground: "hsl(var(--secondary-foreground))",
        },
        "accent": {
          DEFAULT: "#64748b", // Slate-500
          dark: "#334155", // Slate-700
          light: "#cbd5e1", // Slate-300
          foreground: "hsl(var(--accent-foreground))",
        },
        // Google Calendar renkleri
        "calendar-blue": {
          DEFAULT: "#1a73e8",
          dark: "#364c5b"
        },
        "calendar-hover": {
          DEFAULT: "#1557b0",
          dark: "#3b82f6"
        },
        "calendar-gray": {
          DEFAULT: "#70757a",
          dark: "#9ca3af"
        },
        "calendar-border": {
          DEFAULT: "#dadce0",
          dark: "#374151"
        },
        "calendar-event": {
          DEFAULT: "#039be5",
          dark: "#38bdf8"
        },
        // Diğer renkler
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;