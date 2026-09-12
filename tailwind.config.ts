import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", "Arial", "sans-serif"],
        display: ["Figtree", "Arial", "sans-serif"],
        "about-display": ["Figtree", "Arial", "sans-serif"],
        mono: ["Figtree", "Arial", "sans-serif"],
        editorial: ["var(--font-source-serif)", "Source Serif 4", "Georgia", "Times New Roman", "serif"],
      },
      fontSize: {
        micro: ["0.6875rem", { lineHeight: "1rem" }],      // 11px
        xs: ["0.75rem", { lineHeight: "1.1rem" }],          // 12px
        sm: ["0.875rem", { lineHeight: "1.35rem" }],        // 14px
        base: ["1rem", { lineHeight: "1.6rem" }],           // 16px
        lg: ["1.125rem", { lineHeight: "1.6rem" }],
        xl: ["1.25rem", { lineHeight: "1.65rem" }],
        "2xl": ["1.5rem", { lineHeight: "1.25" }],
        "3xl": ["1.875rem", { lineHeight: "1.15" }],
        "4xl": ["2.25rem", { lineHeight: "1.1" }],
        "5xl": ["3rem", { lineHeight: "1.05" }],
        "6xl": ["3.5rem", { lineHeight: "1.02" }],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "20px",
        xl: "28px",
        pill: "999px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        ink: "var(--ink)",
        brand: {
          DEFAULT: "var(--brand)",
          strong: "var(--brand-strong)",
          soft: "var(--brand-soft)",
          foreground: "var(--brand-foreground)",
          disabled: "var(--brand-disabled)",
          dark: "#0a1226",
        },
        surface: {
          DEFAULT: "var(--surface)",
          alt: "var(--surface-alt)",
        },
        navy: "var(--navy)",
        hairline: "var(--hairline)",
        signal: {
          DEFAULT: "var(--signal)",
          foreground: "var(--signal-foreground)",
        },
        "text-primary": "#0a1226",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "#94a3b8",
      },
      boxShadow: { soft: "0 20px 60px rgba(0,0,0,.12)" },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: { "fade-in": "fade-in .5s ease-out both" },
    },
  },
  plugins: [],
};

export default config;