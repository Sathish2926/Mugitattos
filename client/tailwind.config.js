/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        blackcurrant: '#2b193d',
        grape: '#3b2155',
        plum: '#5a2a6e',
        accent: '#a855f7',
        offwhite: '#f7f7f8'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        premium: '0 10px 30px rgba(168,85,247,0.15)'
      }
    }
  },
  plugins: []
};
