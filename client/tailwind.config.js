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
        // User requested: change white colour into #F5EFE1
        white: '#F5EFE1',

        // Core Crimson Scale centered around #790D16
        crimson: {
          50: '#fdf3f3',
          100: '#fbe4e5',
          200: '#f7cbcd',
          300: '#f0a4a9',
          400: '#e3727c',
          500: '#d0434f',
          600: '#b01d2a',
          700: '#790D16', // Exact user color #790D16
          800: '#640911',
          850: '#4e070c',
          900: '#3a0509',
          950: '#220306',
        },
        // Core Sand Scale centered around #E5D3AF
        sand: {
          50: '#faf6ee',
          100: '#f4ebd7',
          200: '#E5D3AF', // Exact user color #E5D3AF
          300: '#d5be8a',
          400: '#c5a769',
          500: '#b28e4e',
          600: '#94723a',
          700: '#75582c',
          800: '#5c4422',
          900: '#423018',
          950: '#25190b',
        },
        // Core Ivory Scale centered around #F5EFE1
        ivory: {
          50: '#F5EFE1', // Exact user color #F5EFE1
          100: '#ede3ce',
          200: '#e1d2b3',
          300: '#d1be95',
          400: '#bfaa7a',
          500: '#ab9461',
          600: '#8e794b',
          700: '#6f5d38',
          800: '#534529',
          900: '#372d1a',
        },
        // Core Powder Blue / Slate Mist Scale centered around #AEC4D4
        powder: {
          50: '#f3f7fa',
          100: '#e5edf3',
          200: '#cedfe9',
          300: '#AEC4D4', // Exact user color #AEC4D4
          400: '#8caaba',
          500: '#5f8399',
          600: '#2d5573', // High contrast dark shade for light backgrounds
          700: '#1d3b52', // AAA contrast
          800: '#132635',
          900: '#0d1a24',
          950: '#070f15',
        },

        // Semantic mapping to seamlessly apply palette across all existing components
        // 'forest' becomes the rich #790D16 Crimson scale
        forest: {
          50: '#fdf3f3',
          100: '#fbe4e5',
          200: '#f7cbcd',
          300: '#f0a4a9',
          400: '#e3727c',
          500: '#b01d2a',
          600: '#91111c',
          700: '#790D16', // Primary Brand Anchor #790D16
          800: '#640911',
          850: '#4e070c',
          900: '#3a0509',
          950: '#220306',
        },
        // 'cream' becomes the Warm Ivory #F5EFE1 and Sand #E5D3AF scale
        cream: {
          50: '#F5EFE1', // Page canvas & primary card surface #F5EFE1
          100: '#f0e8d6',
          200: '#E5D3AF', // Border & warm highlight #E5D3AF
          300: '#d5be8a',
          400: '#c5a769',
          500: '#b28e4e',
          600: '#94723a',
          700: '#75582c',
          800: '#5c4422',
          900: '#423018',
          950: '#25190b',
        },
        // 'lime' becomes the soft Powder Blue #AEC4D4 contrast accent scale
        lime: {
          50: '#f3f7fa',
          100: '#e5edf3',
          200: '#cedfe9',
          300: '#AEC4D4', // Accent Pill & Badge Anchor #AEC4D4
          400: '#8caaba',
          500: '#5f8399',
          600: '#2d5573', // Deep high-contrast blue for light mode text
          700: '#1d3b52',
          800: '#132635',
          900: '#0d1a24',
          950: '#070f15',
        },
        brand: {
          50: '#fdf3f3',
          100: '#fbe4e5',
          200: '#f7cbcd',
          300: '#f0a4a9',
          400: '#e3727c',
          500: '#b01d2a',
          600: '#790D16',
          700: '#640911',
          800: '#4e070c',
          900: '#3a0509',
          950: '#220306',
        },
        navy: {
          800: '#3a0509',
          900: '#2a0407',
          950: '#1a0204',
        },
        accent: {
          crimson: '#790D16',
          sand: '#E5D3AF',
          ivory: '#F5EFE1',
          powder: '#AEC4D4',
          gold: '#c5a769',
        }
      },
      fontFamily: {
        sans: [
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        helvetica: [
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        display: [
          '"Apoc Revelations"',
          '"Instrument Serif"',
          '"Cormorant Garamond"',
          'Georgia',
          'serif'
        ],
        serif: [
          '"Apoc Revelations"',
          '"Instrument Serif"',
          '"Cormorant Garamond"',
          'Georgia',
          'serif'
        ],
        apoc: [
          '"Apoc Revelations"',
          '"Instrument Serif"',
          '"Cormorant Garamond"',
          'Georgia',
          'serif'
        ],
      }
    },
  },
  plugins: [],
}
