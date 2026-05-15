/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          DEFAULT: '#25D366',
          hover: '#1da851',
          light: '#DCF8C6',
          dark: '#075E54',
        },
        sidebar: {
          DEFAULT: '#111827',
          hover: '#1f2937',
          active: '#1e293b',
        },
        page: '#F7F8FA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
