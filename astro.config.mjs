// astro.config.mjs

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // URL canónica del sitio, requerida para generar el sitemap y URLs absolutas.
  site: 'https://www.sgsolucionesing.com',
  // Le decimos explícitamente a Astro dónde está la carpeta pública.
  publicDir: 'public',

  integrations: [tailwind(), icon(), mdx(), sitemap()]
});