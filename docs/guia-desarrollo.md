# Guía de Desarrollo

Este documento proporciona directrices para el desarrollo y mantenimiento del código del sitio web de S&G Soluciones de Ingeniería. Seguir estas pautas asegurará la consistencia, calidad y mantenibilidad del código.

## Tecnologías Principales

### Astro

Utilizamos [Astro](https://astro.build/) como framework principal por su enfoque en rendimiento y su capacidad para generar sitios estáticos optimizados.

**Ventajas clave:**
- Rendimiento optimizado con "Zero JavaScript por defecto"
- Soporte para múltiples frameworks (React, Vue, Svelte, etc.)
- Sistema de componentes flexible
- Generación de sitios estáticos (SSG)

### Tailwind CSS

Utilizamos [Tailwind CSS](https://tailwindcss.com/) para los estilos por su enfoque utilitario y su capacidad de personalización.

**Ventajas clave:**
- Desarrollo rápido con clases utilitarias
- Personalización a través de `tailwind.config.js`
- Optimización automática para producción
- Consistencia en el diseño

### Estándares de Diseño

El sitio sigue el sistema de diseño **"Nocturne"**, definido en `src/styles/nocturne.css` e importado una única vez desde `BaseLayout.astro`.

**Colores Corporativos:**
Los tokens de color están definidos como CSS custom properties en `src/styles/nocturne.css` y expuestos también como colores de Tailwind en `tailwind.config.js`:

```javascript
colors: {
  teal: { DEFAULT: '#00a79d', 300: '#7fd8cf', 600: '#009088', 700: '#00706a', 50: '#e7f6f3' },
  navy: '#122a49',
  ink: { DEFAULT: '#0d1417', 2: '#141d21' },
  paper: { DEFAULT: '#f4f6f6', 2: '#eceff0' },
  line: '#d9dedf',
  muted: '#5b6567',
}
```

No existe la paleta `primary`/`secondary`/`dark-blue`/`light-gray`; pertenecía al diseño anterior.

**Iconografía:**
- Utilizar `astro-icon` con el set de Iconify `@iconify-json/mdi` para iconos consistentes
- No se usa Font Awesome en este proyecto
- Aplicar las clases de Nocturne (`.svc`, `.svc-grid`, etc.) para efectos hover uniformes en iconos de servicios

## Estructura de Archivos

### Componentes

Los componentes se organizan en la carpeta `src/components/` y siguen estas convenciones:

- Nombres en PascalCase (ej. `ServiceCard.astro`)
- Un componente por archivo
- Componentes relacionados pueden agruparse en subcarpetas (ej. `src/components/nocturne/` agrupa las secciones del sistema de diseño "Nocturne": `Hero`, `Servicios`, `Casos`, `Nosotros`, `Testimonios`, `Contacto`)

**Estructura básica de un componente:**

```astro
---
// Definición de props con TypeScript (opcional pero recomendado)
interface Props {
  title: string;
  description: string;
  icon?: string;
}

// Destructuración de props
const { title, description, icon = "default-icon.svg" } = Astro.props;

// Lógica del componente
const formattedTitle = title.toUpperCase();
---

<!-- Estructura HTML del componente -->
<div class="service-card bg-white p-6 rounded-lg shadow-md">
  <img src={icon} alt="" class="w-12 h-12 mb-4" />
  <h3 class="text-xl font-bold mb-2">{formattedTitle}</h3>
  <p class="text-gray-700">{description}</p>
</div>

<!-- Estilos específicos del componente (si son necesarios) -->
<style>
  .service-card {
    transition: transform 0.3s ease;
  }
  .service-card:hover {
    transform: translateY(-5px);
  }
</style>
```

### Páginas

Las páginas se almacenan en `src/pages/` y siguen estas convenciones:

- Nombres en kebab-case (ej. `contacto.astro`)
- Rutas automáticas basadas en la estructura de archivos
- Metadatos SEO consistentes (`title` y `description`)

**Estructura básica de una página:**

```astro
---
// Importaciones
import BaseLayout from '../layouts/BaseLayout.astro';
import ServiceCard from '../components/ServiceCard.astro';

// Metadatos SEO
const title = "Servicios | S&G Soluciones de Ingeniería";
const description = "Descubre nuestros servicios de automatización industrial, desarrollo de software y soluciones IoT para optimizar tus procesos.";

// Datos de la página
const services = [
  {
    title: "Automatización Industrial",
    description: "Optimizamos procesos industriales con soluciones de automatización avanzadas.",
    icon: "/assets/icons/automation.svg"
  },
  // Más servicios...
];
---

<BaseLayout title={title} description={description}>
  <main class="container mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold text-center mb-12">Nuestros Servicios</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map(service => (
        <ServiceCard 
          title={service.title}
          description={service.description}
          icon={service.icon}
        />
      ))}
    </div>
  </main>
</BaseLayout>
```

### Layouts

El sitio tiene un único layout, `src/layouts/BaseLayout.astro`, usado por todas las páginas. Solo acepta `title` y `description` como props (no hay `keywords` ni `ogImage`).

**Estructura real del layout** (ver `src/layouts/BaseLayout.astro`):

```astro
---
// src/layouts/BaseLayout.astro — Rediseño "Nocturne"
import '../styles/nocturne.css';

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = 'Ingeniería en automatización industrial, Industria 4.0 / IoT, gestión de energía y desarrollo de software a la medida.',
} = Astro.props;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body id="top">
    <nav class="nav" id="nav"><!-- ... --></nav>
    <slot />
    <footer class="site"><!-- ... --></footer>
    <script is:inline>
      // Nav sólida al hacer scroll + reveal on scroll para elementos .rv
    </script>
  </body>
</html>
```

## Convenciones de Código

### HTML/Astro

- Utiliza indentación de 2 espacios
- Usa nombres de clases descriptivos
- Mantén la estructura semántica del HTML
- Utiliza los componentes de Astro para código reutilizable

### CSS/Tailwind

- Utiliza las clases de Tailwind siempre que sea posible
- Agrupa las clases por categoría para mejorar la legibilidad
- Para estilos específicos de componentes, usa la etiqueta `<style>` en el componente
- Para estilos globales, utiliza `src/styles/nocturne.css`

### JavaScript

- Utiliza camelCase para nombres de variables y funciones
- Usa const para variables que no cambian
- Prefiere funciones de flecha para funciones anónimas
- Comenta el código cuando sea necesario para explicar la lógica compleja

## Optimización de Rendimiento

### Imágenes

- Optimiza todas las imágenes antes de agregarlas al proyecto
- Utiliza formatos modernos como WebP
- Especifica dimensiones (width/height) para evitar layout shifts
- Usa el atributo `loading="lazy"` para imágenes bajo el fold

### JavaScript

- Minimiza el uso de JavaScript innecesario
- Utiliza la directiva `client:load` de Astro solo cuando sea necesario
- Considera otras directivas como `client:visible` para cargar componentes solo cuando son visibles

### CSS

- Aprovecha PurgeCSS integrado en Tailwind para eliminar CSS no utilizado
- Evita importar estilos innecesarios

## Accesibilidad

- Utiliza etiquetas semánticas (header, nav, main, section, footer, etc.)
- Asegura un contraste adecuado entre texto y fondo
- Proporciona textos alternativos para imágenes
- Asegura que los formularios sean accesibles
- Verifica la navegación por teclado

## Pruebas y Depuración

### Navegadores

Prueba el sitio en los siguientes navegadores:
- Chrome
- Firefox
- Safari
- Edge

### Dispositivos

Prueba el sitio en diferentes tamaños de pantalla:
- Móvil (320px - 480px)
- Tablet (481px - 768px)
- Laptop (769px - 1024px)
- Desktop (1025px y superior)

### Herramientas de Desarrollo

- Utiliza las herramientas de desarrollo del navegador para depurar
- Verifica la consola para errores
- Utiliza Lighthouse para evaluar rendimiento, accesibilidad, SEO y mejores prácticas

## Despliegue

### Preparación para Producción

Antes de desplegar, ejecuta:

```bash
npm run build
```

Esto generará una versión optimizada del sitio en la carpeta `dist/`.

### Verificación Pre-Despliegue

- Verifica que todas las páginas funcionen correctamente
- Comprueba que los enlaces internos y externos funcionen
- Asegura que los formularios envíen datos correctamente
- Verifica que los metadatos SEO estén presentes en todas las páginas

El sitio se despliega en **Dokploy** (Astro build → imagen Nginx). Ver la guía completa en [`despliegue-dokploy.md`](./despliegue-dokploy.md).

## Recursos Útiles

- [Documentación de Astro](https://docs.astro.build/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Guía de Accesibilidad Web](https://www.w3.org/WAI/fundamentals/)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

Este documento debe actualizarse periódicamente para reflejar las mejores prácticas actuales y los cambios en las tecnologías utilizadas.