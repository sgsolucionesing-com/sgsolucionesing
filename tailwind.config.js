/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Nocturne (Fase 1 rediseño) — namespaced tokens, no tocan los existentes
        teal: { DEFAULT: '#00a79d', 300: '#7fd8cf', 600: '#009088', 700: '#00706a', 50: '#e7f6f3' },
        navy: '#122a49',
        ink: { DEFAULT: '#0d1417', 2: '#141d21' },
        paper: { DEFAULT: '#f4f6f6', 2: '#eceff0' },
        line: '#d9dedf',
        muted: '#5b6567',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],

        // Nocturne (Fase 1 rediseño)
        cond: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

