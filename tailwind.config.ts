import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        lightTheme: {
          primary: "#006dff",
          secondary: "#00b5ff",
          accent: "#ffa800",
          neutral: "#050304",
          "base-100": "#fff7fe",
          info: "#00e2ff",
          success: "#429100",
          warning: "#ea8100",
          error: "#ff0064",
          body: {
            "background-color": "#e3e6e6",
          },
        },
      },
    ],
  },
};
export default config;
