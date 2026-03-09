# Dockerfile para S&G Soluciones de Ingeniería
# Build multi-stage para optimizar el tamaño de la imagen

# Etapa 1: Build
FROM node:18-alpine AS builder

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
COPY nginx.conf ./nginx.conf

RUN npm run build

# Etapa 2: Producción
FROM nginx:alpine AS production

RUN apk add --no-cache curl

# Consumir el SHA del commit para invalidar cache de todas las capas siguientes
ARG CAPROVER_GIT_COMMIT_SHA=0
RUN echo "deploy: $CAPROVER_GIT_COMMIT_SHA" > /build-info.txt && \
    rm -rf /etc/nginx/conf.d/* /etc/nginx/templates/*

# Copiar configuración de nginx desde builder
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar archivos públicos explícitamente
COPY --from=builder /app/public /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
