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
        "dark-teal": "#1f5e5b",
        "light-cream": "#fbf9fa",
        "deep-red": "#ae2938",
        "muted-teal": "#7ca8a6",
        "light-teal": "#e9f4f4",
      },
    },
  },
  plugins: [],
};

export default config;
