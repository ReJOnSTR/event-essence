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
          DEFAULT: "#9b87f5", // Ana mor
          dark: "#6E59A5", // Koyu mor
          light: "#D3E4FD", // Açık mor
          foreground: "hsl(var(--primary-foreground))",
        },
        "secondary": {
          DEFAULT: "#7E69AB", // İkincil mor
          dark: "#4A3B7F", // Koyu ikincil mor
          light: "#F2FCE2", // Açık ikincil mor
          foreground: "hsl(var(--secondary-foreground))",
        },
        "accent": {
          DEFAULT: "#8E9196", // Nötr gri
          dark: "#1A1F2C", // Koyu gri
          light: "#F1F1F1", // Açık gri
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