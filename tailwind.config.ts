import { withUt } from "uploadthing/tw";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* --------------------------------------------------
       * COLORS
       * -------------------------------------------------- */
      colors: {
        /* ---------- LIGHT MODE (unchanged) ---------- */
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },

        /* ---------- DARK MODE (BLUE REMOVED) ---------- */
        "dark-tremor": {
          brand: {
            faint: "#000000",
            muted: "#0a0a0a",
            subtle: "#111111",
            DEFAULT: "#ffffff",
            emphasis: "#e5e5e5",
            inverted: "#000000",
          },
          background: {
            muted: "#050505",
            subtle: "#0a0a0a",
            DEFAULT: "#000000",
            emphasis: "#f5f5f5",
          },
          border: {
            DEFAULT: "#1f1f1f",
          },
          ring: {
            DEFAULT: "#262626",
          },
          content: {
            subtle: "#737373",
            DEFAULT: "#a3a3a3",
            emphasis: "#e5e5e5",
            strong: "#ffffff",
            inverted: "#000000",
          },
        },

        /* ---------- SHADCN / SYSTEM COLORS ---------- */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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

      /* --------------------------------------------------
       * BORDER RADIUS
       * -------------------------------------------------- */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },

      /* --------------------------------------------------
       * KEYFRAMES
       * -------------------------------------------------- */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "automation-zoom-in": {
          "0%": { transform: "translateY(-30px) scale(0.2)" },
          "100%": { transform: "translateY(0px) scale(1)" },
        },
        "float-slow": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-40px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },

      /* --------------------------------------------------
       * ANIMATIONS
       * -------------------------------------------------- */
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "automation-zoom-in": "automation-zoom-in 0.5s ease-out",
        "float-slow": "float-slow 18s ease-in-out infinite",

      },
    },
  },

  /* --------------------------------------------------
   * SAFELIST (COLOR UTILS)
   * -------------------------------------------------- */
  safelist: [
    {
      pattern:
        /^(bg|text|border|ring|stroke|fill)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
      variants: ["hover","group-hover", "ui-selected"],
    },
  ],

  plugins: [require("tailwindcss-animate")],
});
