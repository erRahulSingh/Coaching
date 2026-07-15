import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          deep: "#040814",
          muted: "#081026",
          light: "#0F1E43",
          border: "rgba(226, 184, 87, 0.15)",
        },
        gold: {
          DEFAULT: "#E2B857",
          light: "#F5D68B",
          dark: "#B88E30",
          glow: "rgba(226, 184, 87, 0.2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 8s infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: "0.3", transform: "scale(1) translate(0px, 0px)" },
          "50%": { opacity: "0.6", transform: "scale(1.1) translate(10px, -10px)" },
          "100%": { opacity: "0.3", transform: "scale(1) translate(0px, 0px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
