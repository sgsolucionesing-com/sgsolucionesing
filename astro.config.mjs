// astro.config.mjs

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // URL canónica del sitio, requerida para generar el sitemap y URLs absolutas.
  site: 'https://www.sgsolucionesing.com',
  // Le decimos explícitamente a Astro dónde está la carpeta pública.
  publicDir: 'public',

  // El sitio sigue siendo estático (prerender) salvo las rutas que declaren
  // `export const prerender = false` (p. ej. src/pages/api/contacto.ts),
  // que corren on-demand sobre el server Node en modo standalone.
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  // Sitio bilingüe: español (por defecto, sin prefijo en la URL) e inglés en /en/.
  // La detección por idioma del navegador y el recuerdo de preferencia se hacen
  // del lado del cliente (ver BaseLayout), porque las páginas son estáticas.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false }
  },

  integrations: [tailwind(), icon(), mdx(), sitemap()]
});