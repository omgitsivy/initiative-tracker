module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        red: {
          500: '#f56565',
          600: '#e53e3e',
          700: '#c53030',
        },
        green: {
          500: '#48bb78',
          600: '#38a169',
          700: '#2f855a',
        },
        blue: {
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
        },
        purple: {
          500: '#9f7aea',
          600: '#805ad5',
          700: '#6b46c1',
        },
        yellow: {
          500: '#ecc94b',
          600: '#d69e2e',
          700: '#b7791f',
        },
        indigo: {
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
}
