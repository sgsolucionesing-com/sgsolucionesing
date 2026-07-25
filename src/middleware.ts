// src/middleware.ts
// Al pasar de nginx a un server Node (adapter @astrojs/node) perdemos los
// `add_header` de nginx.conf.template. Este middleware los repone para toda
// respuesta servida por Astro, tanto páginas estáticas como la API on-demand.
import { defineMiddleware } from 'astro:middleware';

const CSP = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  // El mapa de /contacto embebe un iframe de Google Maps.
  "frame-src https://www.google.com"
].join('; ');

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', CSP);

  return response;
});
