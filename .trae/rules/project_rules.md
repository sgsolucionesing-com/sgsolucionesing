# Reglas del Proyecto S&G Soluciones de Ingeniería

## Contexto del Proyecto

Este proyecto contiene la landing page de S&G Soluciones de Ingeniería, una empresa joven con equipo altamente calificado especializada en:
- Soluciones de automatización industrial
- Procesos industriales
- Proyectos de Industria 4.0 e IoT
- Desarrollo de software

**Ubicación**: Región de la costa norte de Colombia
**Estructura del sitio**: 3 páginas principales (inicio, casos de éxito, contacto)

## Stack Tecnológico

- **Framework**: Astro (manteniendo HTML puro)
- **Estilos**: Tailwind CSS + CSS personalizado
- **Interactividad**: JavaScript (preferiblemente Vue cuando sea necesario)
- **Iconografía**: Font Awesome
- **Estructura**: HTML5 semántico

## Estándares de Desarrollo

### Calidad de Código
- Código limpio, claro y sencillo
- Comentarios cortos en español para desarrolladores
- Programación concisa y mantenible

### Workflow de Desarrollo
- Crear rama antes de iniciar implementación
- Commit después de completar cada implementación
- Documentar toda nueva funcionalidad en `docs/`

### Gestión de Reglas (CRÍTICO)
Cada vez que se agregue una nueva regla, actualizar TODOS los archivos:
- `CLAUDE.md` (Claude Code)
- `GEMINI.md` (Gemini)
- `AGENTS.md` (GitHub Copilot/Cursor)
- `.trae/rules/project_rules.md` (Trae)

## Mejores Prácticas Técnicas

### Astro Framework
- Usar arquitectura de component islands efectivamente
- Optimizar tamaños de bundle con hidratación selectiva
- Implementar estrategias apropiadas de generación de sitios estáticos (SSG)
- Usar optimización de imágenes integrada de Astro
- Seguir recomendaciones de rendimiento de Astro

### SEO y Rendimiento
- Estructura HTML semántica con jerarquía apropiada de encabezados
- Optimización completa de meta tags (title, description, keywords, Open Graph, Twitter Cards)
- Implementación de datos estructurados cuando sea aplicable
- Optimización de imágenes con atributos alt descriptivos y nombres de archivo
- Optimización de estructura URL con slugs significativos
- Optimización de rendimiento del sitio (Core Web Vitals)
- Meta tags breves y funcionales para correcta indexación

### Organización de Archivos
- Componentes agrupados por funcionalidad en subdirectorios lógicos
- Imágenes organizadas por categoría (branding/, projects/, ui/, etc.)
- Assets separados apropiadamente entre `src/assets/` (procesados) y `public/` (estáticos)
- Convenciones de nomenclatura claras para todos los archivos y directorios

## Estilo Visual
- Diseño moderno, empresarial, atractivo y minimalista
- Enfocado en destacar capacidades técnicas de la empresa
- Orientado a clientes industriales de la región

## Documentación
- Documentación clara y concisa sobre instalación y uso
- Información sobre construcción del proyecto y contribución
- Organización de componentes y guías de trabajo
- Documentar cada implementación nueva
