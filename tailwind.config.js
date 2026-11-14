/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryPurple: '#8B5CF6',
        secondaryBlue: '#0EA5E9',
        accentPink: '#F472B6',
        gridBorder: '#E2E8F0',
        promptBox: '#F8FAFC',
      }
    },
  },
  plugins: [],
}