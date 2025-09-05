// astro.config.mjs

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // FIX: Le decimos explícitamente a Astro dónde está la carpeta pública.
  publicDir: 'public', 
  
  integrations: [tailwind(), icon(),mdx()]
});