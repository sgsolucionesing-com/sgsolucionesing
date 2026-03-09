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

# Etapa 2: Producción
FROM nginx:alpine AS production

RUN apk add --no-cache curl

# Generar configuración de nginx directamente (evita problemas de cache)
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/templates/* && \
    cat > /etc/nginx/conf.d/default.conf << 'NGINXCONF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://fonts.googleapis.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://cdn.jsdelivr.net https://cloudflareinsights.com;" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    location /status {
        access_log off;
        return 200 '{"status":"ok","version":"v8"}';
        add_header Content-Type application/json;
    }
}
NGINXCONF

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar archivos públicos explícitamente
COPY public/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
