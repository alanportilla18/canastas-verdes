/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'primary': {
          50: '#f4f7f1',
          100: '#e8efe3',
          200: '#d1dfc7',
          300: '#b0c89f',
          400: '#8bae72',
          500: '#6d9551',
          600: '#4e6e37',  // Color principal verde
          700: '#3f572d',
          800: '#354627',
          900: '#2d3a22',
        },
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
  corePlugins: {
    preflight: true,
  },
};
