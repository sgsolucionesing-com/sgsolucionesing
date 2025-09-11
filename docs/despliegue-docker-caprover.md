# Guía de Despliegue con Docker y CapRover

## Descripción

Esta guía explica cómo desplegar la landing page de S&G Soluciones de Ingeniería utilizando Docker y CapRover para un despliegue automatizado y escalable.

## Requisitos Previos

### Para Docker Local
- Docker Desktop instalado
- Docker Compose (incluido con Docker Desktop)

### Para CapRover
- Servidor con CapRover instalado
- Acceso al panel de administración de CapRover
- Dominio configurado (opcional)

## Archivos de Configuración

### Dockerfile
El proyecto incluye un Dockerfile multi-stage que:
- **Etapa 1 (Builder)**: Construye la aplicación Astro
- **Etapa 2 (Producción)**: Sirve los archivos estáticos con Nginx

### captain-definition
Archivo requerido por CapRover que especifica la configuración de despliegue:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
}
```

### nginx.conf.template
Archivo de configuración de Nginx que se utiliza en el contenedor de producción. Este archivo contiene:
- Configuración para Single Page Application (SPA)
- Headers de seguridad (CSP, X-Frame-Options, etc.)
- Configuración de cache para assets estáticos
- Compresión gzip
- Endpoints de health check (`/health` y `/status`)

**Nota:** Este archivo se creó para resolver problemas de compatibilidad con versiones de Docker que no soportan heredoc (<<EOF) en comandos COPY.

### Archivos de Configuración Incluidos
- `Dockerfile`: Configuración de contenedor optimizada
- `.dockerignore`: Excluye archivos innecesarios del contexto
- `captain-definition`: Configuración para CapRover
- `nginx.conf.template`: Configuración de Nginx para producción
- `docker-compose.yml`: Para testing local

## Despliegue Local con Docker

### 1. Construcción de la Imagen
```bash
# Construir la imagen
docker build -t sgsolucionesing .

# Ejecutar el contenedor
docker run -p 8080:80 sgsolucionesing
```

### 2. Usando Docker Compose
```bash
# Iniciar el servicio
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener el servicio
docker-compose down
```

La aplicación estará disponible en: `http://localhost:8080`

## Despliegue con CapRover

### 1. Preparación del Repositorio
El proyecto incluye configuración optimizada para CapRover:
- `captain-definition` en la raíz del proyecto
- `Dockerfile` optimizado con configuración de Nginx mejorada
- `.dockerignore` para contexto de build eficiente
- `.caprover` con configuraciones recomendadas
- `deploy-caprover.sh` script de despliegue automatizado

### 2. Configuración en CapRover

#### Opción A: Despliegue desde Git
1. Accede al panel de CapRover
2. Crea una nueva aplicación
3. Configura el repositorio Git
4. CapRover detectará automáticamente el `captain-definition`
5. Inicia el despliegue

#### Opción B: Despliegue Manual
1. Comprime el proyecto (excluyendo `node_modules` y `dist`)
2. Sube el archivo comprimido a CapRover
3. CapRover construirá y desplegará automáticamente

#### Opción C: Script Automatizado
Utiliza el script incluido para un despliegue simplificado:
```bash
# Hacer el script ejecutable (solo la primera vez)
chmod +x deploy-caprover.sh

# Ejecutar el script de despliegue
./deploy-caprover.sh
```

El script automatizado:
- Verifica dependencias y configuración
- Ejecuta tests si están disponibles
- Construye y prueba la imagen Docker localmente
- Crea un archivo tar optimizado para CapRover
- Proporciona instrucciones paso a paso

### 3. Configuración Post-Despliegue

#### Variables de Entorno (si es necesario)
```bash
NODE_ENV=production
```

#### Configuración de Dominio
1. En el panel de CapRover, ve a la aplicación
2. Configura el dominio personalizado
3. Habilita HTTPS automático

## Monitoreo y Mantenimiento

### Health Checks y Monitoreo
El contenedor incluye endpoints optimizados para CapRover:

#### Health Check
- URL: `/health`
- Respuesta: `healthy` (HTTP 200)
- Usado por CapRover para verificar el estado de la aplicación

#### Status Endpoint
- URL: `/status`
- Respuesta: JSON con información del servicio
- Incluye timestamp para monitoreo avanzado
- Formato: `{"status":"ok","service":"sgsolucionesing","timestamp":"2024-01-01T12:00:00Z"}`

### Logs
```bash
# Docker local
docker logs sgsolucionesing-web

# Docker Compose
docker-compose logs -f

# CapRover
# Disponible en el panel web de CapRover
```

### Actualización de la Aplicación

#### Con CapRover (Git)
1. Realiza push al repositorio
2. CapRover detectará los cambios automáticamente
3. Se iniciará un nuevo despliegue

#### Manual
1. Construye nueva imagen
2. Sube a CapRover
3. CapRover realizará el rolling update

## Optimizaciones de Producción

### Nginx
- Compresión gzip habilitada
- Cache de archivos estáticos (1 año)
- Headers de seguridad configurados

### Docker
- Imagen multi-stage para reducir tamaño
- Imagen basada en Alpine Linux
- Health checks configurados

## Solución de Problemas

### Problemas Comunes

#### Error de construcción
```bash
# Verificar logs de construcción
docker build --no-cache -t sgsolucionesing .
```

#### Problemas de permisos
```bash
# Verificar permisos de archivos
ls -la
```

#### Contenedor no inicia
```bash
# Verificar logs del contenedor
docker logs <container_id>
```

### Verificación de Configuración

#### Test del Health Check
```bash
# Dentro del contenedor
curl -f http://localhost/health

# Desde el host
curl -f http://localhost:8080/health
```

## Seguridad

### Headers de Seguridad Configurados
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: Configurada para permitir Font Awesome desde cdnjs.cloudflare.com

### Configuración de Nginx

El archivo `nginx.conf.template` contiene la configuración optimizada de Nginx:

- **Configuración SPA**: Redirección de rutas para aplicaciones de una sola página
- **Headers de seguridad**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy
- **Content Security Policy (CSP)**: Configuración que permite Font Awesome desde cdnjs.cloudflare.com y recursos de Splide desde cdn.jsdelivr.net
- **Caché de assets estáticos**: Configuración optimizada para archivos CSS, JS, imágenes
- **Compresión Gzip**: Habilitada para mejorar el rendimiento
- **Health checks**: Endpoints `/health` y `/status` para monitoreo

> **Nota**: Este archivo fue creado para resolver problemas de compatibilidad de heredoc con Docker en CapRover.

#### Configuración de CSP

La Content Security Policy está configurada para permitir:
- **style-src**: Estilos desde el mismo origen, inline, Google Fonts, Font Awesome Kit, cdnjs.cloudflare.com y cdn.jsdelivr.net
- **font-src**: Fuentes desde el mismo origen, Google Fonts, Font Awesome Kit y cdnjs.cloudflare.com
- **script-src**: Scripts desde el mismo origen, inline, Font Awesome Kit, Google Fonts y cdn.jsdelivr.net
- **img-src**: Imágenes desde el mismo origen, data URIs y cualquier HTTPS
- **connect-src**: Conexiones solo desde el mismo origen

### Recomendaciones
- Mantener Docker y CapRover actualizados
- Usar HTTPS en producción
- Configurar firewall apropiadamente
- Monitorear logs regularmente

## Contacto y Soporte

Para problemas relacionados con el despliegue, consulta:
- Documentación de CapRover: https://caprover.com/docs/
- Documentación de Docker: https://docs.docker.com/
- Repositorio del proyecto para issues específicos