/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  darkMode: "class", // dark mode toggle via class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#6366F1",    // indigo-500
          secondary: "#7C3AED",  // purple-600
          accent: "#F59E0B",     // amber-500
          neutral: "#1F2937",    // gray-800
          "base-100": "#FFFFFF", // light bg
          "base-200": "#F3F4F6",
          "base-300": "#E5E7EB",
        },
      },
      "dark", // daisyUI automatic dark theme
    ],
  },
};
