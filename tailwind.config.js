/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ignition-amber': '#D97925',
        'champagne-gold': '#D4AF37',
        'warm-clay': '#C17754',
        'deep-teal': '#0B697A',
        'cream': '#FFF8F0',
        'desert-sand': '#E5D4B8',
        'dark-base': '#0A0A0A',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
