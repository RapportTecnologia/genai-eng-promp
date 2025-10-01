/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de cores laranja e marrom
        primary: {
          50: '#FFF5E6',
          100: '#FFE6CC',
          200: '#FFCC99',
          300: '#FFB366',
          400: '#FF9933',
          500: '#FF8C42', // Laranja principal
          600: '#FFA500',
          700: '#CC7A00',
          800: '#995C00',
          900: '#663D00',
        },
        brown: {
          50: '#F5E6D3',
          100: '#E6D0B8',
          200: '#D4B896',
          300: '#C19A6B',
          400: '#A0522D', // Marrom claro para bordas
          500: '#8B4513',
          600: '#6B3410',
          700: '#4A240B',
          800: '#2A1507',
          900: '#1A0D04',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
