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
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
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
        "text-muted": "#64748b",
      },
      boxShadow: {
        "2xs": "0 1px 2px rgba(15, 23, 42, 0.04)",
        xs: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
        card: "0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03)",
        elevated: "0 8px 30px rgba(15, 23, 42, 0.08)",
        soft: "0 20px 60px rgba(15, 23, 42, 0.09)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: { "fade-in": "fade-in .5s ease-out both" },
    },
  },
  plugins: [],
};

export default config;