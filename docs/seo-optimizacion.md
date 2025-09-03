# Guía de Optimización SEO

Este documento detalla las prácticas de optimización para motores de búsqueda (SEO) implementadas en el sitio web de S&G Soluciones de Ingeniería, así como recomendaciones para mantener y mejorar el posicionamiento en buscadores.

## Nuevas Implementaciones (Última actualización)

### Sitemap Automático
- **Integración**: `@astrojs/sitemap` v3.5.1
- **Configuración**: Sitemap generado automáticamente durante el build
- **Archivos generados**: 
  - `sitemap-index.xml`: Índice principal del sitemap
  - `sitemap-0.xml`: URLs de todas las páginas del sitio
- **URL configurada**: https://sgsolucionesing.com
- **Referencia en HTML**: `<link rel="sitemap" type="application/xml" href="/sitemap-index.xml">`

### Datos Estructurados (JSON-LD)
- **Tipo**: Organization Schema
- **Información incluida**:
  - Datos de la empresa (nombre, URL, logo, descripción)
  - Información de contacto y ubicación
  - Catálogo de servicios (Automatización Industrial, Desarrollo de Software, Soluciones IoT)
  - Área de servicio (Costa Norte de Colombia)

### Robots.txt Dinámico
- **Ubicación**: `/src/pages/robots.txt.ts` (API Route)
- **Generación**: Dinámico durante el build usando `import.meta.env.SITE`
- **Configuración**: Permite acceso a todos los crawlers
- **Referencia al sitemap**: Generada automáticamente con la URL del sitio
- **Ventajas**: Se actualiza automáticamente si cambia la URL del sitio

### URL Canónica
- **Implementación**: `<link rel="canonical" href="{canonicalURL}">`
- **Configuración automática**: Basada en la URL del sitio y la ruta actual

## Validación según Documentación Oficial

Nuestra implementación sigue las mejores prácticas recomendadas por la documentación oficial de Astro:

### ✅ Cumplimiento de Estándares
- **Sitemap automático**: Implementado con `@astrojs/sitemap` v3.5.1
- **Configuración de site**: URL configurada en `astro.config.mjs`
- **Robots.txt dinámico**: Implementado como API Route según recomendaciones
- **Referencias en HTML**: Sitemap referenciado en el `<head>` del sitio
- **Generación automática**: Tanto sitemap como robots.txt se generan dinámicamente

### 🔄 Beneficios de la Implementación Dinámica
- **Mantenimiento automático**: No requiere actualización manual
- **Consistencia**: URLs siempre sincronizadas con la configuración del sitio
- **Escalabilidad**: Se adapta automáticamente a nuevas páginas
- **Mejores prácticas**: Sigue las recomendaciones oficiales de Astro

## Metadatos Implementados

Cada página del sitio incluye los siguientes metadatos para optimización SEO:

### Metadatos Básicos

- **Title**: Título descriptivo y conciso que incluye el nombre de la empresa
- **Description**: Descripción breve del contenido de la página (150-160 caracteres)
- **Keywords**: Palabras clave relevantes separadas por comas

### Metadatos Open Graph

Para mejorar la presentación en redes sociales:

- **og:title**: Título para compartir en redes sociales
- **og:description**: Descripción para compartir en redes sociales
- **og:type**: Tipo de contenido (website, article, etc.)
- **og:url**: URL canónica de la página
- **og:image**: Imagen representativa para compartir

### Metadatos Twitter

Para optimizar la presentación en Twitter:

- **twitter:card**: Tipo de tarjeta (summary, summary_large_image)
- **twitter:title**: Título para compartir en Twitter
- **twitter:description**: Descripción para compartir en Twitter
- **twitter:image**: Imagen para compartir en Twitter

## Implementación en Layout.astro

Los metadatos se implementan en el componente `Layout.astro` y se personalizan para cada página:

```astro
---
interface Props {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

const { 
  title, 
  description, 
  keywords,
  ogImage = "/images/og-default.jpg" 
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<head>
  <!-- Metadatos básicos -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <link rel="canonical" href={canonicalURL} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:image" content={ogImage} />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</head>
```

## Recomendaciones para Títulos y Descripciones

### Títulos (Title)

- Longitud ideal: 50-60 caracteres
- Incluir la palabra clave principal al inicio
- Formato recomendado: "[Palabra Clave Principal] - [Descripción] | S&G Soluciones de Ingeniería"
- Ser único para cada página

**Ejemplos:**
- Página principal: "S&G Soluciones de Ingeniería | Automatización Industrial y Desarrollo de Software"
- Casos de éxito: "Casos de Éxito en Automatización Industrial | S&G Soluciones de Ingeniería"
- Contacto: "Contacta con Nuestros Expertos en Ingeniería | S&G Soluciones de Ingeniería"

### Descripciones (Description)

- Longitud ideal: 150-160 caracteres
- Incluir la palabra clave principal y secundarias
- Ser descriptivo y persuasivo
- Incluir un llamado a la acción cuando sea apropiado

**Ejemplos:**
- Página principal: "S&G Soluciones de Ingeniería ofrece servicios de automatización industrial, desarrollo de software y soluciones IoT en la costa norte de Colombia. Optimiza tus procesos con expertos."
- Casos de éxito: "Descubre cómo hemos ayudado a empresas de la costa norte de Colombia a optimizar sus procesos industriales con soluciones de automatización y software a medida."
- Contacto: "¿Necesitas optimizar tus procesos industriales? Contacta con nuestro equipo de expertos en S&G Soluciones de Ingeniería. Respuesta en 24 horas."

## Palabras Clave (Keywords)

### Palabras Clave Principales

- Soluciones de ingeniería
- Automatización industrial
- Desarrollo de software industrial
- Soluciones IoT
- Ingeniería en la costa norte de Colombia

### Palabras Clave Secundarias

- Optimización de procesos industriales
- Sistemas SCADA
- Programación PLC
- Desarrollo de aplicaciones industriales
- Mantenimiento de sistemas automatizados
- Consultoría en automatización

## Estructura de URLs

- Utilizar URLs descriptivas y amigables
- Incluir palabras clave relevantes
- Evitar parámetros innecesarios
- Usar guiones (-) para separar palabras

**Ejemplos:**
- `/servicios/automatizacion-industrial`
- `/casos-exito/optimizacion-procesos-empresa-x`
- `/blog/tendencias-automatizacion-2023`

## Optimización de Imágenes

- Utilizar nombres de archivo descriptivos (ej. `automatizacion-planta-industrial.jpg`)
- Incluir atributos `alt` descriptivos
- Optimizar el tamaño de las imágenes para carga rápida
- Utilizar formatos modernos como WebP cuando sea posible

```html
<img 
  src="/assets/automatizacion-planta.webp" 
  alt="Sistema de automatización implementado en planta industrial" 
  width="800" 
  height="600" 
  loading="lazy"
/>
```

## Estructura de Encabezados

Mantener una jerarquía clara de encabezados:

- `<h1>`: Título principal de la página (uno por página)
- `<h2>`: Secciones principales
- `<h3>`: Subsecciones
- `<h4>`, `<h5>`, `<h6>`: Detalles adicionales

## Rendimiento y Experiencia de Usuario

Factores que afectan al SEO relacionados con el rendimiento:

- **Velocidad de carga**: Optimizar todos los recursos
- **Mobile-friendly**: Diseño responsivo para todos los dispositivos
- **Core Web Vitals**: Optimizar LCP, FID y CLS
- **HTTPS**: Asegurar que el sitio utilice HTTPS

## Contenido SEO-Friendly

Recomendaciones para el contenido:

- Crear contenido original y de valor
- Actualizar regularmente el contenido
- Incluir palabras clave de forma natural
- Utilizar listas y párrafos cortos para mejorar la legibilidad
- Incluir enlaces internos relevantes
- Agregar contenido multimedia (imágenes, videos, infografías)

## Seguimiento y Análisis

Herramientas recomendadas para seguimiento SEO:

- Google Search Console
- Google Analytics
- Herramientas de análisis de velocidad (PageSpeed Insights, GTmetrix)

## Checklist SEO para Nuevas Páginas

Antes de publicar una nueva página, verificar:

- [ ] Título optimizado con palabras clave relevantes
- [ ] Meta descripción persuasiva y con palabras clave
- [ ] URL amigable y descriptiva
- [ ] Contenido de calidad con palabras clave distribuidas naturalmente
- [ ] Imágenes optimizadas con atributos alt
- [ ] Estructura de encabezados jerárquica
- [ ] Enlaces internos a otras páginas relevantes
- [ ] Metadatos Open Graph y Twitter Card
- [ ] Tiempo de carga optimizado
- [ ] Diseño responsivo para móviles

---

Este documento debe actualizarse periódicamente para reflejar las mejores prácticas actuales de SEO y los cambios en los algoritmos de los motores de búsqueda.