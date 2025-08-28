#!/bin/bash

# Script de despliegue automatizado para CapRover
# S&G Soluciones de Ingeniería

set -e

echo "🚀 Iniciando despliegue para CapRover..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "captain-definition" ]; then
    log_error "No se encontró captain-definition. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    log_error "No se encontró Dockerfile. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que Git esté limpio
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Hay cambios sin commitear. Se recomienda hacer commit antes del despliegue."
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Despliegue cancelado."
        exit 1
    fi
fi

# Verificar dependencias
log_info "Verificando dependencias..."

if ! command -v docker &> /dev/null; then
    log_error "Docker no está instalado o no está en el PATH."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm no está instalado o no está en el PATH."
    exit 1
fi

log_success "Dependencias verificadas."

# Ejecutar tests (si existen)
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    log_info "Ejecutando tests..."
    npm test || {
        log_error "Los tests fallaron. Despliegue cancelado."
        exit 1
    }
    log_success "Tests completados exitosamente."
fi

# Build local para verificar
log_info "Construyendo imagen Docker localmente para verificación..."
docker build -t sgsolucionesing:test . || {
    log_error "Error en la construcción de Docker. Revisa el Dockerfile."
    exit 1
}
log_success "Imagen Docker construida exitosamente."

# Test rápido del contenedor
log_info "Probando contenedor..."
CONTAINER_ID=$(docker run -d -p 8080:80 sgsolucionesing:test)
sleep 5

# Verificar health check
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    log_success "Health check exitoso."
else
    log_error "Health check falló."
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    exit 1
fi

# Limpiar contenedor de prueba
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID
log_success "Verificación local completada."

# Crear archivo tar para CapRover (excluyendo archivos innecesarios)
log_info "Creando archivo de despliegue..."
tar --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='.astro' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='coverage' \
    --exclude='.nyc_output' \
    --exclude='.tmp' \
    --exclude='.temp' \
    -czf sgsolucionesing-deploy.tar.gz .

log_success "Archivo de despliegue creado: sgsolucionesing-deploy.tar.gz"

# Mostrar información del archivo
log_info "Tamaño del archivo: $(du -h sgsolucionesing-deploy.tar.gz | cut -f1)"

echo
log_success "🎉 Preparación completada exitosamente!"
echo
log_info "Próximos pasos:"
echo "1. Sube el archivo 'sgsolucionesing-deploy.tar.gz' a tu panel de CapRover"
echo "2. O configura el despliegue automático desde Git en CapRover"
echo "3. Configura las variables de entorno si es necesario"
echo "4. Habilita HTTPS si tienes un dominio configurado"
echo
log_info "Endpoints disponibles después del despliegue:"
echo "  - Health check: /health"
echo "  - Status: /status"
echo
log_warning "Recuerda configurar tu dominio en CapRover después del despliegue."

echo
log_info "¿Deseas abrir la documentación de despliegue? (y/N)"
read -p ": " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open docs/despliegue-docker-caprover.md
    elif command -v xdg-open &> /dev/null; then
        xdg-open docs/despliegue-docker-caprover.md
    else
        log_info "Abre manualmente: docs/despliegue-docker-caprover.md"
    fi
fi

log_success "¡Despliegue listo para CapRover! 🚀"