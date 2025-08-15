/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ← necesario para que el toggle de tema funcione
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
