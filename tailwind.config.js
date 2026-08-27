/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Modern Royal Elegance" palette — Royal Blue primary + Gold accents
        royal: {
          DEFAULT: "#1E3A8A", // royal blue
          dark: "#16295F", // deeper royal for hover / footer
          soft: "#E8EDF8", // very light accent background
          light: "#EDF1FA", // light accent surface
        },
        gold: {
          DEFAULT: "#D4AF37", // metallic gold
          dark: "#B8942A", // deeper gold for hover
          light: "#F7ECC7", // pale gold tint
        },
      },
    },
  },
  plugins: [],
}
