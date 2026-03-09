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

RUN npm run build

# Etapa 2: Producción (versión específica para forzar rebuild sin cache)
FROM nginx:1.27-alpine AS production

RUN apk add --no-cache curl

# Crear directorio para configuración personalizada
RUN mkdir -p /etc/nginx/templates

# Configuración de Nginx optimizada para CapRover
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copiar archivos construidos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
