import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          ink: "#26323f",
          mist: "#f6fbff",
          blue: "#dcefff",
          green: "#ddf7e8",
          orange: "#ffe6cf"
        }
      },
      boxShadow: {
        soft: "0 12px 32px rgba(38, 50, 63, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
