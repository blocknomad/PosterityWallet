/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2D3D31",
        "primary-hover": "#28362c",
        "primary-active": "#243027",
      },
    },
  },
  plugins: [],
};
