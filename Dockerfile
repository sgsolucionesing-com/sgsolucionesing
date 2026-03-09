# Dockerfile para S&G Soluciones de Ingeniería
# Build multi-stage para optimizar el tamaño de la imagen

# Etapa 1: Build
FROM node:18-alpine AS builder

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./
COPY astro.config.mjs ./
COPY tailwind.config.* ./
COPY tsconfig.json ./
COPY postcss.config.js ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Usar el commit SHA de CapRover para invalidar cache
ARG CAPROVER_GIT_COMMIT_SHA=0

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/

# Construir la aplicación
RUN npm run build

# Verificar que archivos públicos están en dist
RUN ls -la /app/dist/logo.png || echo "WARN: logo.png no encontrado en dist"

# Etapa 2: Producción
FROM nginx:alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Variables de entorno para CapRover
ENV NODE_ENV=production

# Invalidar cache para esta etapa
ARG CAPROVER_GIT_COMMIT_SHA=0

# Eliminar configuración default de nginx y usar la nuestra directamente
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos construidos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar archivos públicos explícitamente para garantizar disponibilidad
COPY public/ /usr/share/nginx/html/

# Verificar que archivos existen
RUN ls -la /usr/share/nginx/html/logo.png && ls -la /usr/share/nginx/html/Logo1x.png && echo "Archivos públicos OK"

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
