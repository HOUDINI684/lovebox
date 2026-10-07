/** @type {import('tailwindcss').Config} */
// Direction C : noir profond, or fin, luxe discret.
// Toutes les couleurs de l'app passent par ces jetons : pour changer d'ambiance, c'est ici (et themes.js) qu'on agit.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#0B0B0D', 900: '#121114', 800: '#18171B', 700: '#222127', 600: '#2D2B33' },
        gold: { 300: '#E8D5A3', 400: '#E0BC4A', 500: '#D4AF37', 600: '#B8962E', 700: '#8F7324' },
        ivory: '#F3EEE3',
        paper: { 100: '#F3EEE3', 200: '#EFE3C8' },
        danger: '#E58E8E',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Caveat"', 'cursive'],
        sans: ['"Nunito"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
