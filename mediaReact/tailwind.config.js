/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // we start to customize colors and fonts
  theme: {
  extend: {
    height:{
header:'560px',
rate:'440px'
    },
    fontSize:{
h1:'2.6rem',
    },
    screens:{
      xs:'475px',
    },
  colors: {
    main: '#001233',      // Dark Slate Gray
    subMain: '#DF9704',   // Pumpkin
    dry: '#002255',       // Battleship Gray
    star: '#FFD700',      // Gold
    text: '#C0C0C0',      // Silver
    border: '#585858',    // Dim Gray
    dryGray: '#E8E8E8',   // Light Gray
  },
  },
  },
  plugins: [require('@tailwindcss/line-clamp')],
  };