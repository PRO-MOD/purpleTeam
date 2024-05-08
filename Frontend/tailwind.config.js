// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          100: '#EEE2DC',
          200: '#D3BABA',
          300: '#B99595',
          400: '#A67F7F',
          500: '#8B4513',
          600: '#753A11',
          700: '#5E2F0E',
          800: '#48250B',
          900: '#311A08',
          550: '#212529',
          450:'#B7410E',
        },
      },
    },
  },
  plugins: [],
}
