# Estructura del Proyecto S&G Soluciones de Ingeniería

Este documento detalla la estructura del proyecto del sitio web de S&G Soluciones de Ingeniería, explicando la organización de archivos y carpetas, así como las tecnologías utilizadas.

## Tecnologías Utilizadas

- **Astro 5**: Framework principal para la construcción del sitio web (SSG, sin SSR)
- **Tailwind CSS 3**: Framework de CSS para estilos utilitarios
- **astro-icon**: Iconos vía Iconify (`@iconify-json/mdi`)
- **@astrojs/mdx**: Soporte MDX para el contenido de proyectos
- **@astrojs/sitemap**: Generación automática de sitemap
- **Zod**: Validación de esquema de las colecciones de contenido
- **HTML**: Estructura semántica de las páginas
- **JavaScript**: Vanilla, mínimo, solo donde es necesario (nav sticky, reveal on scroll, modal de galería)

## Estructura de Carpetas

```
/
├── docs/                # Documentación del proyecto
│   ├── README.md        # Información general sobre la documentación
│   ├── guia-de-uso.md   # Guía principal de uso del proyecto
│   ├── estructura-proyecto.md # Este documento
│   ├── guia-desarrollo.md     # Directrices de desarrollo
│   ├── contribucion.md        # Flujo de contribución
│   ├── despliegue-dokploy.md  # Guía de despliegue en Dokploy
│   └── seo-optimizacion.md    # Guía de SEO
├── public/              # Archivos estáticos accesibles públicamente
│   └── favicon.svg      # Favicon del sitio
├── src/
│   ├── assets/          # Imágenes, fuentes y otros recursos (branding, images, icons)
│   ├── components/
│   │   └── nocturne/    # Componentes de sección del sistema de diseño "Nocturne"
│   │       ├── Hero.astro
│   │       ├── Servicios.astro
│   │       ├── Casos.astro
│   │       ├── Nosotros.astro
│   │       ├── Testimonios.astro
│   │       └── Contacto.astro
│   ├── content/
│   │   ├── config.ts    # Definición de la colección `proyectos` (schema Zod)
│   │   └── proyectos/   # Entradas MDX (casos/proyectos)
│   ├── layouts/
│   │   └── BaseLayout.astro # Layout único del sitio (nav fijo, slot, footer)
│   ├── pages/            # Páginas del sitio
│   │   ├── index.astro           # Página principal
│   │   ├── contacto.astro        # Página de contacto
│   │   └── proyectos/
│   │       ├── index.astro       # Listado de proyectos
│   │       └── [slug].astro      # Detalle de proyecto (ruta dinámica)
│   └── styles/           # Estilos globales
│       └── nocturne.css  # Sistema de diseño "Nocturne" (tokens y clases con Tailwind)
├── astro.config.mjs     # Configuración de Astro
├── package.json         # Dependencias y scripts
├── tailwind.config.js   # Configuración de Tailwind CSS
└── tsconfig.json        # Configuración de TypeScript
```

## Descripción de Componentes Principales

### Layouts

- **BaseLayout.astro**: Único layout del sitio; lo usan todas las páginas (home, contacto, proyectos/*). Contiene la estructura HTML básica, metadatos SEO (`title`/`description` por props), la carga de fuentes (Barlow / Barlow Condensed), el nav fijo (`.nav`, con clase `.solid` al hacer scroll), el `<slot />` con el contenido de la página, el footer, y el script inline que gestiona el scroll y el reveal (`IntersectionObserver` sobre `.rv`).

### Componentes (`src/components/nocturne/`)

- **Hero.astro**: Sección hero de la home
- **Servicios.astro**: Sección de servicios/unidades de negocio
- **Casos.astro**: Sección de proyectos/casos de éxito destacados
- **Nosotros.astro**: Sección "Quiénes Somos" con información de la empresa
- **Testimonios.astro**: Sección de testimonios
- **Contacto.astro**: Sección/formulario de contacto

### Páginas

- **index.astro**: Página principal; compone `Hero`, `Servicios`, `Casos`, `Nosotros`, `Testimonios` y `Contacto` dentro de `BaseLayout`
- **contacto.astro**: Página con información de contacto y formulario
- **proyectos/index.astro**: Listado de proyectos, iterando la colección de contenido `proyectos`
- **proyectos/[slug].astro**: Ruta dinámica que renderiza el detalle de un proyecto (MDX vía `<Content />` dentro de `.prose-n`) más una galería de imágenes con modal (navegación por teclado y swipe táctil)

### Contenido

- **src/content/config.ts**: Define la colección `proyectos` con schema Zod (`title`, `slug`, `sector`, `cliente`, `ubicacion`, `fecha`, `coverImage`, `resumen`, `kpis[]`, `tecnologias[]`, `tags[]`, `destacado`, `order`, `gallery[]`)
- **src/content/proyectos/*.mdx**: Entradas de la colección; cada archivo es un proyecto/caso de éxito

### Estilos

- **nocturne.css**: Sistema de diseño "Nocturne", con tokens CSS (`--teal`, `--navy`, `--ink`, `--paper`, `--line`, `--muted`) y clases reutilizables (`.kick`, `.btn-t`/`.btn-o`, `.sec`, `.phead`, `.factbar`, `.prose-n`, entre otras). Se importa una única vez desde `BaseLayout.astro`.

## Guía de Estilos

### Colores Corporativos

Los colores corporativos están definidos como tokens CSS en `src/styles/nocturne.css` y expuestos también como colores de Tailwind en `tailwind.config.js`:

- **teal**: `#00a79d` (color principal, con variantes `300`/`600`/`700`/`50`)
- **navy**: `#122a49`
- **ink**: `#0d1417` (con variante `2`: `#141d21`) — texto principal / fondo oscuro
- **paper**: `#f4f6f6` (con variante `2`: `#eceff0`) — fondo claro
- **line**: `#d9dedf` — bordes/divisores
- **muted**: `#5b6567` — texto secundario

No existe la paleta `primary`/`secondary`/`dark-blue`/`light-gray`; pertenecía al diseño anterior y fue reemplazada por completo.

### Tipografía

- **body**: Barlow (texto general)
- **cond**: Barlow Condensed (títulos, kickers y encabezados)

Ambas se cargan desde Google Fonts en `BaseLayout.astro`.

## Componentes de UI Reutilizables

Definidos en `src/styles/nocturne.css`:

- **Botones**:
  - `.btn-t`: Botón principal, fondo `teal`, con efecto hover (oscurece + eleva)
  - `.btn-o`: Botón con borde (`outline`) y efecto hover
- **Secciones**:
  - `.sec`: Padding estándar de sección
  - `.sec-head`: Encabezado de sección (título + lead)
  - `.kick`: Kicker/eyebrow con línea decorativa antes del texto
  - `.phead`: Bloque hero de cabecera para páginas internas (ej. listado/detalle de proyectos)
  - `.factbar`: Barra de datos/estadísticas
- **Contenido de proyecto**:
  - `.prose-n`: Estilos de contenido MDX/prosa en el detalle de proyecto
  - `.gallery` / `.gal-grid`: Grilla de imágenes de la galería

## Animaciones y Efectos

### Reveal on Scroll
- Clase `.rv`: elementos con esta clase reciben `.in` cuando entran en el viewport (vía `IntersectionObserver` en `BaseLayout.astro`), disparando su animación de aparición definida en CSS

### Nav sticky
- `.nav` agrega `.solid` cuando el scroll supera 40px (ver script en `BaseLayout.astro`)

### Efectos Hover
- Transformaciones y cambios de color/sombra en botones (`.btn-t`, `.btn-o`) y otros elementos interactivos
- Transiciones suaves con CSS transitions

## Cómo Contribuir

### Agregar Nuevas Páginas

Para agregar una nueva página al sitio:

1. Crea un nuevo archivo `.astro` en la carpeta `src/pages/`
2. Importa el layout único:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';

   // SEO metadata específico para esta página
   const title = "Título de la Página | S&G Soluciones de Ingeniería";
   const description = "Descripción de la página para SEO";
   ---

   <BaseLayout title={title} description={description}>
     <!-- Contenido de la página -->
   </BaseLayout>
   ```

### Agregar Nuevos Componentes

Para crear un nuevo componente reutilizable (por ejemplo, una nueva sección de la home):

1. Crea un nuevo archivo `.astro` en `src/components/nocturne/` (o en `src/components/` si no es una sección del sistema Nocturne)
2. Define la estructura del componente:
   ```astro
   ---
   // Props del componente
   interface Props {
     title: string;
     // Otras props...
   }
   
   const { title } = Astro.props;
   ---
   
   <div class="mi-componente">
     <h2>{title}</h2>
     <!-- Resto del componente -->
   </div>
   
   <style>
   /* Estilos específicos del componente */
   </style>
   ```

### Modificar Estilos

Para modificar los estilos globales:

1. Edita el archivo `src/styles/nocturne.css` para cambios en tokens y clases del sistema de diseño
2. Para cambiar los colores corporativos o tipografía expuestos a Tailwind, modifica `tailwind.config.js`

## Optimización para SEO

Cada página debe incluir los siguientes metadatos para optimización SEO:

- **Title**: Título descriptivo y conciso
- **Description**: Descripción breve del contenido

Estos metadatos se pasan como props al componente `BaseLayout` (que solo acepta `title` y `description`; no hay prop `keywords`):

```astro
<BaseLayout
  title="Título de la Página | S&G Soluciones de Ingeniería"
  description="Descripción para SEO">
  <!-- Contenido -->
</BaseLayout>
```

Para la estrategia de SEO completa (sitemap, meta tags, Open Graph), ver [`seo-optimizacion.md`](./seo-optimizacion.md).

## Consideraciones de Rendimiento

- Optimizar imágenes antes de agregarlas al proyecto
- Utilizar componentes de Astro para mejor rendimiento
- Minimizar el uso de JavaScript innecesario
- Aprovechar las capacidades de Tailwind para estilos eficientes

---

Este documento debe actualizarse cada vez que se realicen cambios significativos en la estructura del proyecto o se agreguen nuevas funcionalidades.