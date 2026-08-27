/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: { 900: '#0F0A12', 800: '#1B1220', 700: '#271A2E', 600: '#3A2740' },
        berry: { 400: '#FF6B93', 500: '#FF3D68', 600: '#E62356', 700: '#C21745' },
        gold: { 400: '#F5D68C', 500: '#F2C14E' },
        violet: { 400: '#A78BFA', 500: '#8B5CF6' },
        ivory: '#F5EDF0',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
