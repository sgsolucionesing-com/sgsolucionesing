# Despliegue en Dokploy

## Descripción

El sitio se sirve en producción a través de **Dokploy**, en el servidor `balerion`, aplicación `LandingPage`, servicio Swarm `sgsolucionescom-landingpage-ugsoai`. No hay ningún componente de CapRover en producción: la configuración legacy de CapRover que existía en el repositorio (`captain-definition`, `deploy-caprover.sh`, `.caprover`) fue eliminada porque no aplica a este despliegue.

## Cómo se construye la imagen

El build es el `Dockerfile` multi-stage de la raíz del proyecto:

1. **Etapa `builder`** (`node:20-alpine`): instala dependencias con `npm ci` y ejecuta `npm run build` (Astro genera el sitio estático en `dist/`).
2. **Etapa `production`** (`nginx:1.27-alpine`): copia `dist/` a `/usr/share/nginx/html` y sirve el sitio con Nginx.

Dokploy no requiere ningún archivo adicional de configuración (no usa `captain-definition` ni equivalentes): solo necesita el `Dockerfile`.

## `nginx.conf.template` y el bug del `${PORT}`

`nginx.conf.template` se copia a `/etc/nginx/templates/default.conf.template` y Nginx lo renderiza con `envsubst` al arrancar el contenedor, sustituyendo cualquier variable de entorno `${VAR}` presente en el archivo.

**Importante: no usar en este archivo variables que Dokploy no defina.** Antes la configuración usaba `listen ${PORT};`, una variable que CapRover inyecta automáticamente pero que Dokploy no define. Al no existir `PORT` en el entorno, `envsubst` dejaba la variable vacía y Nginx abortaba al arrancar con el error:

```
host not found in "${PORT}"
```

Como el contenedor nuevo nunca llegaba a estar `healthy`, Swarm no actualizaba el servicio y seguía sirviendo el contenedor viejo. El deploy en el panel de Dokploy se mostraba como exitoso, pero la web en producción no cambiaba.

La solución es usar un puerto fijo:

```nginx
listen 80;
```

Este valor coincide con el `EXPOSE 80` y el `HEALTHCHECK` del `Dockerfile`. Si en el futuro se necesita otra variable de entorno en `nginx.conf.template`, hay que confirmar primero que Dokploy la define para el servicio; de lo contrario, hardcodear el valor.

## Sitio estático: sin fallback a `index.html`

Este es un sitio generado por Astro en modo SSG (build estático, sin SSR ni rutas dinámicas server-side). La configuración de Nginx usa:

```nginx
location / {
    try_files $uri $uri/ =404;
}
```

**No se debe cambiar esto a un fallback tipo SPA** (`try_files $uri $uri/ /index.html;`). Ese patrón es para aplicaciones de una sola página con enrutamiento en el cliente; en un sitio estático haría que cualquier URL inexistente devuelva `200` con el contenido del home, generando contenido duplicado y confundiendo a los buscadores (SEO).

## Deploy manual y verificación previa

Dokploy dispara el build y el `docker service update` automáticamente cuando el webhook funciona (ver nota al final). El equivalente manual, útil para verificar antes de tocar el servicio en producción:

```bash
cd /etc/dokploy/applications/sgsolucionescom-landingpage-ugsoai/code
git fetch origin && git reset --hard origin/main

# 1. Construir la imagen
docker build -t sgsolucionescom-landingpage-ugsoai:latest .

# 2. Verificar que la imagen arranca y la config de Nginx es válida
#    ANTES de actualizar el servicio en Swarm
docker run --rm --entrypoint sh sgsolucionescom-landingpage-ugsoai:latest -c "/docker-entrypoint.sh nginx -t"

# 3. Actualizar el servicio Swarm con la imagen ya verificada
docker service update --force --no-resolve-image --image sgsolucionescom-landingpage-ugsoai:latest sgsolucionescom-landingpage-ugsoai
```

El paso 2 es el que hubiera detectado el bug del `${PORT}` antes de afectar producción: si `nginx -t` falla, el contenedor no sirve, y no tiene sentido forzar el `service update`.

## Estado del auto-deploy

Hoy el auto-deploy **no funciona**: el único webhook de GitHub configurado en el repositorio apunta al CapRover viejo y falla por timeout. Hasta que se configure el webhook de Dokploy, los deploys a producción son manuales siguiendo los pasos de arriba.

## Health checks

- `HEALTHCHECK` del `Dockerfile`: `curl -f http://localhost/health`, cada 30s.
- Endpoint `/health`: devuelve `200 healthy`.
- Endpoint `/status`: devuelve un JSON simple con estado y timestamp, útil para monitoreo externo.
