/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0B0B0D',
          card: '#121215',
          light: '#1A1A1E',
          border: '#26262E',
        },
        luxe: {
          gold: '#D4AF37',
          'gold-light': '#F4E08D',
          terracotta: '#E07A5F',
          sage: '#8B9D83',
          rose: '#E8A598',
          cream: '#FBF9F5',
          sand: '#F4EFEA',
          charcoal: '#1C1C21',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Italiana', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxe': '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
        'luxe-gold': '0 10px 30px -10px rgba(212, 175, 55, 0.25)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.15)',
      }
    },
  },
  plugins: [],
}
