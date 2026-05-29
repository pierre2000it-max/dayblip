import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1a1a2e",
        accent: "#e94560",
        surface: "#16213e",
        muted: "#0f3460",
        light: "#f5f5f5",
        textPrimary: "#ffffff",
        textSecondary: "#a8a8b3",
      },
    },
  },
  plugins: [],
};
export default config;
