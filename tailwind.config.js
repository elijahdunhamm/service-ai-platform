/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Elegant serif for luxury headings (Playfair Display).
        display: ['"Playfair Display"', "Georgia", "serif"],
        // Clean modern sans for body (Lato).
        body: ["Lato", "ui-sans-serif", "system-ui", "sans-serif"],
      },
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
        // "Noir Et Or" luxury palette — deep charcoal / matte black surfaces,
        // brushed metallic gold accents, soft ivory text.
        noir: {
          DEFAULT: "#0E0F11", // matte black page background
          card: "#17191D", // elevated charcoal card surface
          soft: "#1F2226", // hover / muted panel
        },
        ivory: {
          DEFAULT: "#F5F2EA", // soft off-white text
          muted: "#BDB8AD", // muted body text on dark
        },
      },
    },
  },
  plugins: [],
}
