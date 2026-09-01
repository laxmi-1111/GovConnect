/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1D22',
        paper: '#F7F8FA',
        line: '#D8DCE3',
        navy: {
          50: '#EEF2F8',
          100: '#DCE4F1',
          400: '#3C5D93',
          600: '#294A79',
          700: '#1B3A6B',
          800: '#142C52',
          900: '#0E2039',
        },
        marigold: {
          50: '#FDF3E7',
          100: '#FBE6C9',
          400: '#EAA349',
          500: '#E08A2C',
          600: '#C06F1B',
        },
        verified: {
          50: '#EAF5EF',
          500: '#2F7D5C',
          600: '#256349',
        },
        caution: {
          50: '#FBEDED',
          500: '#B23A3A',
          600: '#8F2E2E',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans Devanagari"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(14, 32, 57, 0.06)',
      },
    },
  },
  plugins: [],
}
