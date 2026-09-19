/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ee4d2d",
          dark:    "#d73211",
          light:   "#ff6b4a",
          50:      "#fff1ee",
          100:     "#ffddd6",
        },
        accent: {
          DEFAULT: "#f5a623",
          dark:    "#e0952e",
        },
        shopee: {
          red:    "#ee4d2d",
          orange: "#f5a623",
          bg:     "#f5f5f5",
        },
      },
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,.06)",
        nav:  "0 2px 8px rgba(0,0,0,.15)",
      },
      height: {
        nav: "56px",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
}
