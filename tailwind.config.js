/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { 
        primary: '#0BA4DB',
        'primary-hover': '#0993c5',
        'primary-active': '#0883af'
      }
    },
  },
  plugins: [],
}

