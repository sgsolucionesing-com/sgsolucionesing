# Guía de Uso - S&G Soluciones de Ingeniería

Este documento sirve como guía principal para el desarrollo y mantenimiento del sitio web de S&G Soluciones de Ingeniería. Aquí encontrarás toda la información necesaria para instalar, configurar, desarrollar y contribuir al proyecto.

## Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Instalación](#instalación)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Guía de Estilo](#guía-de-estilo)
5. [Desarrollo](#desarrollo)
6. [SEO](#seo)
7. [Contribución](#contribución)
8. [Despliegue](#despliegue)

## Descripción del Proyecto

Este proyecto es la landing page oficial de S&G Soluciones de Ingeniería, una empresa joven especializada en soluciones de ingeniería en la región de la costa norte de Colombia. La empresa se dedica a:

- Automatización industrial
- Procesos industriales
- Soluciones de automatización de procesos industriales
- Proyectos de Industria 4.0, IoT y desarrollo de software

El sitio web está desarrollado como un sitio estático (SSG) con Astro, con foco en HTML semántico, JavaScript mínimo (vanilla) y CSS con Tailwind más el sistema de diseño propio "Nocturne". La estructura del sitio consta de estas rutas principales:

1. Página principal (`index.astro`)
2. Contacto (`contacto.astro`)
3. Listado de proyectos (`proyectos/index.astro`)
4. Detalle de proyecto (`proyectos/[slug].astro`), ruta dinámica sobre la colección de contenido `proyectos`

## Instalación

Para instalar y ejecutar el proyecto localmente, sigue estos pasos:

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd sgsolucionesing

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:4321`.

## Estructura del Proyecto

El proyecto sigue la estructura estándar de Astro:

```
/
├── docs/                # Documentación del proyecto
├── public/              # Archivos estáticos accesibles públicamente
│   └── favicon.svg
├── src/
│   ├── assets/          # Imágenes, fuentes y otros recursos
│   ├── components/
│   │   └── nocturne/    # Componentes de sección del sistema de diseño "Nocturne"
│   ├── content/
│   │   ├── config.ts    # Schema Zod de la colección `proyectos`
│   │   └── proyectos/   # Entradas MDX de casos/proyectos
│   ├── layouts/
│   │   └── BaseLayout.astro  # Layout único del sitio
│   ├── pages/           # Páginas del sitio
│   │   ├── index.astro           # Página principal
│   │   ├── contacto.astro        # Página de contacto
│   │   └── proyectos/
│   │       ├── index.astro       # Listado de proyectos
│   │       └── [slug].astro      # Detalle de proyecto
│   └── styles/
│       └── nocturne.css # Sistema de diseño "Nocturne" (tokens y clases)
├── astro.config.mjs     # Configuración de Astro
├── package.json         # Dependencias y scripts
└── tsconfig.json        # Configuración de TypeScript
```

Para el detalle completo de la estructura, ver [`estructura-proyecto.md`](./estructura-proyecto.md).

## Guía de Estilo

El diseño del sitio sigue el sistema "Nocturne", definido en `src/styles/nocturne.css` e importado desde `BaseLayout.astro`:

- **Estilo**: Moderno, empresarial, atractivo y minimalista
- **Paleta de colores**: tokens CSS `--teal`, `--navy`, `--ink`, `--paper`, `--line`, `--muted` (expuestos también como colores de Tailwind: `teal`, `navy`, `ink`, `paper`, `line`, `muted` en `tailwind.config.js`)
- **Tipografía**: Barlow (texto general, token `body`) y Barlow Condensed (títulos/kickers, token `cond`), cargadas desde Google Fonts en `BaseLayout.astro`
- **Componentes**: Tailwind CSS para utilidades + clases propias de Nocturne (`.kick`, `.btn-t`/`.btn-o`, `.sec`, `.phead`, `.factbar`, `.prose-n`, entre otras)

### Principios de Diseño

1. **Simplicidad**: Interfaces limpias y fáciles de navegar
2. **Profesionalismo**: Reflejar la seriedad y experiencia de la empresa
3. **Responsividad**: Diseño adaptable a todos los dispositivos
4. **Accesibilidad**: Seguir las pautas WCAG para garantizar accesibilidad

## Desarrollo

### Funcionalidades Implementadas

#### Navegación fija y scroll-reveal

`BaseLayout.astro` incluye un script inline con dos comportamientos globales:

**Características:**
- **Nav sólida al hacer scroll**: la barra de navegación (`.nav`) agrega la clase `.solid` al superar 40px de scroll vertical
- **Reveal on scroll**: cualquier elemento con la clase `.rv` recibe `.in` cuando entra en el viewport (vía `IntersectionObserver`, threshold 0.15), disparando su animación de aparición

**Implementación técnica:**
- Script `is:inline` al final del `<body>` en `src/layouts/BaseLayout.astro`
- No requiere JavaScript de terceros: es vanilla JS mínimo
- El sitio es SSG (sin hidratación de frameworks); todo el comportamiento interactivo es JS vanilla puntual como este

#### Modal de Galería de Imágenes

En las páginas de proyectos individuales (`/proyectos/[slug]`), se ha implementado un modal interactivo para visualizar las imágenes de la galería:

**Características:**
- **Activación**: Click en cualquier imagen de la galería
- **Navegación**: 
  - Flechas laterales para navegar entre imágenes
  - Teclas de flecha izquierda/derecha del teclado
  - Tecla Escape para cerrar
  - Gestos táctiles (deslizar izquierda/derecha) en dispositivos móviles
- **Interfaz**:
  - Contador de imágenes (ej: "1 / 5")
  - Icono de lupa en hover para indicar funcionalidad
  - Fondo oscuro semitransparente
  - Botón de cierre (X) con fondo semitransparente
  - Botones de navegación con fondo semitransparente
- **Responsive**: 
  - Optimizado para dispositivos móviles y desktop
  - Botones adaptativos según tamaño de pantalla
  - Espaciado responsive (menor en móviles, mayor en desktop)
  - Soporte completo para gestos táctiles
- **Accesibilidad**: Cierre al hacer click en el fondo del modal
- **Soporte de temas**: Compatible con modo claro y oscuro

**Implementación técnica:**
- JavaScript vanilla integrado en la página
- CSS con Tailwind para estilos
- Manejo de eventos de teclado y mouse
- Verificaciones de tipos para TypeScript

### Flujo de Trabajo

1. **Creación de Ramas**: Antes de implementar cualquier cambio, crear una nueva rama:
   ```bash
   git checkout -b nombre-de-la-funcionalidad
   ```

2. **Implementación**: Desarrollar la funcionalidad siguiendo las guías de estilo

3. **Commit**: Al finalizar, realizar commit con comentarios descriptivos en español:
   ```bash
   git add .
   git commit -m "Descripción detallada del cambio implementado"
   ```

4. **Pull Request**: Crear un pull request para revisión

### Buenas Prácticas

- Mantener el código limpio y bien comentado
- Seguir los principios de componentes reutilizables
- Optimizar imágenes y recursos para rendimiento
- Realizar pruebas en diferentes navegadores y dispositivos
- Actualizar documentación al implementar nuevas funcionalidades

## SEO

Cada página debe incluir los siguientes elementos para optimización SEO:

- **Meta Title**: Título conciso y relevante (máximo 60 caracteres)
- **Meta Description**: Descripción breve del contenido (máximo 160 caracteres)
- **Meta Keywords**: Palabras clave relevantes para el contenido
- **Estructura de encabezados**: Usar correctamente H1, H2, H3, etc.
- **Imágenes optimizadas**: Incluir atributos alt descriptivos

## Contribución

Para contribuir al proyecto:

1. Asegúrate de seguir el flujo de trabajo descrito en la sección de Desarrollo
2. Actualiza la documentación cuando implementes nuevas funcionalidades
3. Mantén el código limpio y bien comentado
4. Respeta la guía de estilo establecida

## Despliegue

El sitio se despliega en **Dokploy** (build multi-stage con Astro + Nginx). Ver la guía completa en [`despliegue-dokploy.md`](./despliegue-dokploy.md).

---

**Nota**: Esta guía se actualizará continuamente a medida que el proyecto evolucione. Cada vez que se implemente una nueva funcionalidad, se debe actualizar la documentación correspondiente.