import type { APIRoute } from 'astro';

const robotsTxt = `
User-agent: *
Allow: /

# Sitemap
Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}

# Disallow admin areas (if any)
# Disallow: /admin/
# Disallow: /_astro/
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};