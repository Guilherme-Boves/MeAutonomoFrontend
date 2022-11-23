/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        fundo: "url(/Images/Fundo.png)",
        fundo2: "url(/Images/Fundo2.png)",
        fundo3: "url(/Images/fundo3.png)"
      },
      fontFamily: {
        sans: 'Nunito, sans-serif',
      },
    },
  },
  plugins: [],
}
  