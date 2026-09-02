import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#6847F5",
        "brand-dark": "#5134D9",
        ink: "#171321",
        muted: "#716D7E",
        surface: "#F7F6FB"
      }
    }
  },
  plugins: []
};

export default config;
