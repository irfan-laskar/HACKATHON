/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f1f8f4',
          100: '#dfefe5',
          200: '#c0dfcd',
          300: '#94c7a8',
          400: '#62a87e',
          500: '#3c8b5b',
          600: '#2c7047',
          700: '#235939',
          800: '#1e472f',
          900: '#143321',
          950: '#091c12',
        },
        cream: {
          50: '#fdfcf7',
          100: '#f9f6ed',
          200: '#f3eddc',
          300: '#eae0c4',
          400: '#decfa6',
          500: '#cbb684',
          600: '#b49966',
          700: '#957a4e',
          800: '#7a6341',
          900: '#645137',
          950: '#382b1b',
        },
        lime: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          950: '#1a2e05',
        },
        brand: {
          50: '#f1f8f4',
          100: '#dfefe5',
          200: '#c0dfcd',
          300: '#94c7a8',
          400: '#62a87e',
          500: '#2c7047',
          600: '#1e472f',
          700: '#143321',
          800: '#0f2719',
          900: '#091c12',
          950: '#05110a',
        },
        navy: {
          800: '#1a2e22',
          900: '#0f1c15',
          950: '#070f0b',
        },
        accent: {
          lime: '#84cc16',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          terracotta: '#c2593f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
