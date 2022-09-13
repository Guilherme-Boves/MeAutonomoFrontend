/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.jsx'
  ],
  theme: {
    extend: {
      backgroundImage: {
        fundo: 'url(/src/assets/Fundo.png)'
      },
      fontFamily: {
        sans: 'Nunito, sans-serif',
      },
    },
  },
  plugins: [],
}
