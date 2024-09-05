module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        purple: {
          400: '#9F7AEA',
          600: '#805AD5',
        },
        indigo: {
          600: '#5A67D8',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}