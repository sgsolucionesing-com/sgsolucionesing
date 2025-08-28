/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Colores personalizados basados en la página original
        primary: '#2DD4BF',    // Color primario (turquesa)
        secondary: '#1E3A8A',  // Color secundario (azul oscuro)
        'dark-blue': '#0F172A', // Azul muy oscuro
        'light-gray': '#F8FAFC', // Gris claro
        dark: '#0F172A',       // Alias para dark-blue
        light: '#F8FAFC',      // Alias para light-gray
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

