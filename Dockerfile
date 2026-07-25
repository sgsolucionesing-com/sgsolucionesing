# Dockerfile para S&G Soluciones de Ingeniería
# Build multi-stage para optimizar el tamaño de la imagen
#
# NOTA (feat/contacto-resend): el sitio pasó de ser 100% estático servido por
# nginx a un server Node standalone (adapter @astrojs/node), porque la ruta
# /api/contacto necesita un runtime para enviar correo con Resend. El resto
# del sitio se sigue pre-renderizando; nginx.conf.template quedó sin uso (ver
# comentario en ese archivo).

# Etapa 1: Build
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY astro.config.mjs ./
COPY tailwind.config.* ./
COPY tsconfig.json ./
COPY postcss.config.js ./

RUN npm ci

COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

# Etapa 2: Producción — server Node standalone generado por @astrojs/node
FROM node:20-alpine AS production

WORKDIR /app

# Dependencias de producción únicamente (el server standalone las necesita
# en runtime, p. ej. "resend").
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server.mjs ./server.mjs

ENV HOST=0.0.0.0
ENV PORT=80

EXPOSE 80

# curl no está disponible en node:alpine por defecto; usamos wget (busybox).
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:80/ || exit 1

# server.mjs envuelve dist/server/entry.mjs para aplicar los headers de
# seguridad también a las páginas estáticas pre-renderizadas (ver ese
# archivo para el detalle). No usar `node ./dist/server/entry.mjs`
# directamente en producción: serviría el sitio sin esos headers.
CMD ["node", "./server.mjs"]
