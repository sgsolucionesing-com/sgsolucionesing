# S&G Soluciones de Ingeniería - Sitio Web

Este repositorio contiene el código fuente del sitio web de S&G Soluciones de Ingeniería, una empresa especializada en soluciones de automatización industrial, procesos industriales, y desarrollo de software en la región de la costa norte de Colombia.

## 🚀 Tecnologías Utilizadas

- **[Astro](https://astro.build/)**: Framework principal para la construcción del sitio
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS para estilos
- **HTML**: Estructura básica de las páginas
- **JavaScript**: Funcionalidades interactivas

## 📂 Estructura del Proyecto

```text
/
├── docs/                # Documentación del proyecto
│   ├── README.md        # Información sobre la documentación
│   ├── guia-de-uso.md   # Guía principal de uso del proyecto
│   ├── estructura-proyecto.md # Estructura detallada del proyecto
│   ├── contribucion.md  # Guía para contribuir al proyecto
│   ├── seo-optimizacion.md # Guía de optimización SEO
│   └── guia-desarrollo.md # Guía de desarrollo
├── public/              # Archivos estáticos accesibles públicamente
│   └── favicon.svg      # Favicon del sitio
├── src/
│   ├── assets/          # Imágenes, fuentes y otros recursos
│   ├── components/      # Componentes reutilizables
│   ├── layouts/         # Plantillas de diseño
│   ├── pages/           # Páginas del sitio
│   └── styles/          # Estilos globales
├── astro.config.mjs     # Configuración de Astro
├── tailwind.config.js   # Configuración de Tailwind CSS
└── package.json         # Dependencias y scripts
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, en una terminal:

| Comando                  | Acción                                           |
| :----------------------- | :----------------------------------------------- |
| `npm install`            | Instala dependencias                             |
| `npm run dev`            | Inicia servidor de desarrollo en `localhost:4321`|
| `npm run build`          | Construye el sitio para producción en `./dist/`  |
| `npm run preview`        | Previsualiza la construcción antes de desplegar  |
| `npm run astro ...`      | Ejecuta comandos CLI como `astro add`, `astro check` |

## 📚 Documentación

Este proyecto incluye documentación detallada en la carpeta `docs/`:

- **[Guía de Uso](docs/guia-de-uso.md)**: Lineamientos generales para el desarrollo y mantenimiento del sitio
- **[Estructura del Proyecto](docs/estructura-proyecto.md)**: Detalles sobre la organización de archivos y carpetas
- **[Guía de Contribución](docs/contribucion.md)**: Instrucciones para contribuir al proyecto
- **[Optimización SEO](docs/seo-optimizacion.md)**: Prácticas de SEO implementadas
- **[Guía de Desarrollo](docs/guia-desarrollo.md)**: Directrices técnicas para el desarrollo
- **[Despliegue en Dokploy](docs/despliegue-dokploy.md)**: Guía completa de despliegue

## 🐳 Despliegue

### Docker Local
```bash
# Construcción y ejecución
docker build -t sgsolucionesing .
docker run -p 8080:80 sgsolucionesing
```

### Dokploy
El sitio se despliega en producción a través de [Dokploy](https://dokploy.com/), que construye la imagen a partir del `Dockerfile` multi-stage (Astro build + Nginx) y actualiza el servicio Swarm correspondiente.

Consulta la [guía de despliegue](docs/despliegue-dokploy.md) para el detalle del proceso y la verificación manual.

## 🌐 Páginas del Sitio

El sitio web consta de tres páginas principales:

1. **Página Principal**: Presentación de la empresa y sus servicios
2. **Casos de Éxito**: Proyectos realizados y testimonios de clientes
3. **Contacto**: Información de contacto y formulario

## 🔄 Flujo de Trabajo

Para contribuir al proyecto:

1. Crea una rama desde `main`
2. Implementa los cambios siguiendo las guías de desarrollo
3. Actualiza la documentación si es necesario
4. Crea un commit con un mensaje descriptivo en español
5. Envía un Pull Request

## 📝 Licencia

Este proyecto es propiedad de S&G Soluciones de Ingeniería. Todos los derechos reservados.
