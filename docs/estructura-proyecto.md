# Estructura del Proyecto S&G Soluciones de Ingeniería

Este documento detalla la estructura del proyecto del sitio web de S&G Soluciones de Ingeniería, explicando la organización de archivos y carpetas, así como las tecnologías utilizadas.

## Tecnologías Utilizadas

- **Astro**: Framework principal para la construcción del sitio web
- **Tailwind CSS**: Framework de CSS para estilos
- **HTML**: Estructura básica de las páginas
- **JavaScript**: Funcionalidades interactivas

## Estructura de Carpetas

```
/
├── docs/                # Documentación del proyecto
│   ├── README.md        # Información general sobre la documentación
│   ├── guia-de-uso.md   # Guía principal de uso del proyecto
│   └── estructura-proyecto.md # Este documento
├── public/              # Archivos estáticos accesibles públicamente
│   └── favicon.svg      # Favicon del sitio
├── src/
│   ├── assets/          # Imágenes, fuentes y otros recursos
│   │   ├── astro.svg    # Logo de Astro (a reemplazar)
│   │   └── background.svg # Imagen de fondo
│   ├── components/      # Componentes reutilizables
│   │   └── Welcome.astro # Componente principal de la página de inicio
│   ├── layouts/         # Plantillas de diseño
│   │   └── Layout.astro # Layout principal del sitio
│   ├── pages/           # Páginas del sitio
│   │   ├── index.astro  # Página principal
│   │   ├── casos-exito.astro # Página de casos de éxito
│   │   └── contacto.astro # Página de contacto
│   └── styles/          # Estilos globales
│       └── global.css   # Estilos globales con Tailwind
├── astro.config.mjs     # Configuración de Astro
├── package.json         # Dependencias y scripts
├── tailwind.config.js   # Configuración de Tailwind CSS
└── tsconfig.json        # Configuración de TypeScript
```

## Descripción de Componentes Principales

### Layouts

- **Layout.astro**: Plantilla principal que contiene la estructura HTML básica, metadatos SEO y enlaces a estilos y scripts. Todas las páginas utilizan este layout como base.

### Componentes

- **Welcome.astro**: Componente principal que integra todos los componentes modulares y define estilos globales
- **HeroSection.astro**: Sección hero con fondo animado y logo de la empresa
- **StatsSection.astro**: Sección de estadísticas con contadores animados
- **ServicesSection.astro**: Sección de servicios/unidades de negocio con iconos FontAwesome
- **PlatformsSection.astro**: Sección de acceso multiplataforma con iconos de dispositivos
- **AboutSection.astro**: Sección "Quiénes Somos" con información de la empresa
- **SectorsSection.astro**: Sección de sectores de aplicación
- **ProjectsSection.astro**: Biblioteca de proyectos con imágenes
- **TestimonialsSection.astro**: Sección de testimonios con avatares personalizados

### Páginas

- **index.astro**: Página principal que utiliza el componente Welcome.
- **casos-exito.astro**: Página que muestra los proyectos exitosos de la empresa.
- **contacto.astro**: Página con información de contacto y formulario.

### Estilos

- **global.css**: Archivo de estilos globales que utiliza Tailwind CSS para definir clases y componentes reutilizables.

## Guía de Estilos

### Colores Corporativos

Los colores corporativos están definidos en el archivo `tailwind.config.mjs` y coinciden con el diseño original:

- **Primary**: #2DD4BF (Teal/Turquesa principal)
- **Secondary**: #1E3A8A (Azul secundario)
- **Dark-blue**: #0F172A (Azul oscuro)
- **Accent**: #FFD700 (Dorado para acentos)
- **Dark**: #333333 (Gris oscuro)
- **Light**: #F8FAFC (Gris claro del diseño original)

### Tipografía

- **Sans**: Inter, system-ui, sans-serif (Texto general)
- **Heading**: Montserrat, sans-serif (Títulos y encabezados)

## Componentes de UI Reutilizables

Se han definido varios componentes de UI reutilizables en los estilos globales:

- **Botones**:
  - `.btn-primary`: Botón principal con color teal (#2DD4BF)
  - `.btn-outline`: Botón con borde y efectos hover
  - Efectos hover con transformación scale(1.05)

- **Estadísticas**:
  - `.stats-counter`: Contadores con gradiente de colores primarios
  - Animaciones de aparición con scroll

- **Iconos de Servicios**:
  - `.service-icon`: Iconos con gradiente y efectos hover
  - Transformación y sombra en hover

- **Efectos de Tarjetas**:
  - `.card-hover`: Efectos de elevación y transformación
  - `.section-divider`: Divisores de sección con gradiente

## Animaciones y Efectos

### Animaciones de Fondo
- **hero-animated-bg**: Gradiente animado en la sección hero
- **animated-gradient**: Animación de movimiento de fondo

### Animaciones de Scroll
- **fade-in-element**: Elementos que aparecen al hacer scroll
- **pulse**: Animación de pulsación para elementos destacados

### Efectos Hover
- Transformaciones scale() en botones e iconos
- Cambios de opacidad y sombras
- Transiciones suaves con CSS transitions

## Cómo Contribuir

### Agregar Nuevas Páginas

Para agregar una nueva página al sitio:

1. Crea un nuevo archivo `.astro` en la carpeta `src/pages/`
2. Importa el Layout principal:
   ```astro
   ---
   import Layout from '../layouts/Layout.astro';
   
   // SEO metadata específico para esta página
   const title = "Título de la Página | S&G Soluciones de Ingeniería";
   const description = "Descripción de la página para SEO";
   const keywords = "palabras, clave, relevantes";
   ---
   
   <Layout title={title} description={description} keywords={keywords}>
     <!-- Contenido de la página -->
   </Layout>
   ```

### Agregar Nuevos Componentes

Para crear un nuevo componente reutilizable:

1. Crea un nuevo archivo `.astro` en la carpeta `src/components/`
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

1. Edita el archivo `src/styles/global.css` para cambios en los estilos base
2. Para cambiar los colores corporativos o tipografía, modifica el archivo `tailwind.config.js`

## Optimización para SEO

Cada página debe incluir los siguientes metadatos para optimización SEO:

- **Title**: Título descriptivo y conciso
- **Description**: Descripción breve del contenido
- **Keywords**: Palabras clave relevantes

Estos metadatos se pasan como props al componente Layout:

```astro
<Layout 
  title="Título de la Página | S&G Soluciones de Ingeniería"
  description="Descripción para SEO"
  keywords="palabras, clave, relevantes">
  <!-- Contenido -->
</Layout>
```

## Consideraciones de Rendimiento

- Optimizar imágenes antes de agregarlas al proyecto
- Utilizar componentes de Astro para mejor rendimiento
- Minimizar el uso de JavaScript innecesario
- Aprovechar las capacidades de Tailwind para estilos eficientes

---

Este documento debe actualizarse cada vez que se realicen cambios significativos en la estructura del proyecto o se agreguen nuevas funcionalidades.