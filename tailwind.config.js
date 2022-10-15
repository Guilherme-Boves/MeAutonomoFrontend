/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        fundo: "url(/Images/fundo.png)",
        fundo2: "url(/Images/fundo2.png)"
      },
      fontFamily: {
        sans: 'Nunito, sans-serif',
      },
    },
  },
  plugins: [],
}
  