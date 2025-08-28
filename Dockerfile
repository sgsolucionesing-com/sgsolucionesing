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

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM nginx:alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar configuración personalizada de nginx
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    # Configuración para SPA
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Configuración de cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self';" always;
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Copiar archivos construidos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]