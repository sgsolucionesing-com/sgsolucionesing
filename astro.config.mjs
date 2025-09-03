// astro.config.mjs

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // FIX: Le decimos explícitamente a Astro dónde está la carpeta pública.
  publicDir: 'public', 
  
  integrations: [tailwind(), icon()]
});