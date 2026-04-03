/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#534AB7',
        'primary-dark': '#3C3489',
        'primary-mid': '#AFA9EC',
        'primary-light': '#EEEDFE',
        'bg': '#0E0D14',
        'bg2': '#16151F',
        'bg3': '#1E1C2A',
        'bg4': '#252335',
        'border': 'rgba(255,255,255,0.07)',
        'border2': 'rgba(255,255,255,0.12)',
        'text': '#F0EFF8',
        'text2': '#9B99B0',
        'text3': '#5E5C72',
        'accent-green': '#2EA043',
        'accent-amber': '#EF9F27',
        'accent-red': '#E24B4A',
        'accent-teal': '#1D9E75',
      },
      fontFamily: {
        'syne': ["'Syne'", 'sans-serif'],
        'dm': ["'DM Sans'", 'sans-serif'],
      },
      backgroundColor: {
        'dark': '#0E0D14',
        'dark2': '#16151F',
        'dark3': '#1E1C2A',
        'dark4': '#252335',
      },
    },
  },
  plugins: [],
}

