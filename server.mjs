// server.mjs
// Entry point de producción usado por el Dockerfile en vez de
// `node ./dist/server/entry.mjs` directamente.
//
// Por qué existe: el adapter @astrojs/node en modo standalone sirve las
// páginas pre-renderizadas (home, /proyectos, /contacto, etc.) con un
// handler de archivos estáticos que NUNCA pasa por src/middleware.ts —
// solo las rutas on-demand (prerender = false, como /api/contacto) pasan
// por el pipeline de Astro donde corre el middleware. Como resultado, si
// solo dependiéramos de src/middleware.ts, la mayoría del sitio se
// quedaría sin los headers de seguridad que antes ponía nginx.conf.template.
//
// Esta envoltura fija los headers en TODA respuesta (estática u on-demand)
// antes de delegar al handler exportado por el build de Astro, cerrando ese
// gap sin renunciar al pre-renderizado del sitio.
import http from 'node:http';

// El entry.mjs generado por @astrojs/node en modo standalone arranca su
// propio server automáticamente al importarlo (usa PORT/HOST del entorno).
// Lo deshabilitamos porque nosotros manejamos el `http.createServer` acá
// para poder inyectar los headers de seguridad primero.
process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

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

const port = Number(process.env.PORT) || 80;
const host = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', CSP);
  handler(req, res);
});

server.listen(port, host, () => {
  console.log(`[server.mjs] Escuchando en http://${host}:${port}`);
});
