/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Colores del diseño original S&G Soluciones de Ingeniería
        primary: '#2DD4BF',    // Teal/Turquesa principal
        secondary: '#1E3A8A',  // Azul secundario
        'dark-blue': '#0F172A', // Azul oscuro
        accent: '#FFD700',     // Dorado para acentos
        dark: '#333333',       // Gris oscuro
        light: '#F8FAFC',      // Gris claro del diseño original
       },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};