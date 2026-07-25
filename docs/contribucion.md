# Guía de Contribución

Este documento describe cómo contribuir al proyecto del sitio web de S&G Soluciones de Ingeniería. Seguir estas pautas ayudará a mantener la coherencia y calidad del código.

## Flujo de Trabajo de Contribución

### 1. Crear una Rama

Antes de comenzar cualquier trabajo, crea una nueva rama desde `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-de-la-caracteristica
```

Utiliza prefijos descriptivos para las ramas:
- `feature/` para nuevas características
- `fix/` para correcciones de errores
- `docs/` para cambios en la documentación
- `refactor/` para refactorizaciones de código

### 2. Desarrollo

Durante el desarrollo, asegúrate de:

- Seguir las convenciones de código establecidas
- Mantener los cambios enfocados en una sola característica o corrección
- Actualizar la documentación relevante
- Escribir comentarios claros y concisos en el código

### 3. Commits

Realiza commits frecuentes con mensajes descriptivos en español:

```bash
git add .
git commit -m "Agrega formulario de contacto con validación"
```

Estructura de los mensajes de commit:
- Usa verbos en presente ("Agrega", "Corrige", "Actualiza")
- Sé específico pero conciso
- Si es necesario, agrega detalles adicionales en el cuerpo del mensaje

### 4. Actualizar la Documentación

Si tu contribución incluye cambios en la funcionalidad o estructura del proyecto, actualiza la documentación correspondiente en la carpeta `docs/`.

### 5. Pull Request

Cuando hayas completado tu trabajo:

1. Asegúrate de que tu rama esté actualizada con `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/nombre-de-la-caracteristica
   git merge main
   ```

2. Resuelve cualquier conflicto que pueda surgir

3. Envía tu rama al repositorio remoto
   ```bash
   git push origin feature/nombre-de-la-caracteristica
   ```

4. Crea un Pull Request en GitHub con una descripción clara de los cambios realizados

## Convenciones de Código

### HTML/Astro

- Utiliza indentación de 2 espacios
- Usa nombres de clases descriptivos siguiendo la metodología BEM o similar
- Mantén la estructura semántica del HTML

```astro
<section class="hero-section">
  <div class="hero-section__content">
    <h1 class="hero-section__title">Título Principal</h1>
    <p class="hero-section__description">Descripción del contenido</p>
  </div>
</section>
```

### CSS/Tailwind

- Utiliza las clases de Tailwind siempre que sea posible
- Para estilos personalizados, sigue la misma estructura de nombres que Tailwind
- Agrupa las clases de Tailwind por categoría (layout, spacing, typography, etc.)

```html
<button class="
  px-4 py-2 rounded-lg  /* Spacing y bordes */
  bg-teal text-white  /* Colores (tokens Nocturne) */
  font-medium transition-colors  /* Tipografía y transiciones */
  hover:bg-teal-600 focus:ring-2  /* Estados */
">
  Botón de Acción
</button>
```

Para componentes que ya siguen el sistema de diseño "Nocturne" (secciones de la home, páginas de proyectos), preferí las clases hechas a mano de `src/styles/nocturne.css` (`.btn-t`, `.btn-o`, `.sec`, etc.) en vez de reconstruirlas con utilidades de Tailwind.

### JavaScript

- Utiliza camelCase para nombres de variables y funciones
- Usa const para variables que no cambian
- Comenta el código cuando sea necesario para explicar la lógica

```javascript
// Función para validar el formulario de contacto
const validarFormulario = () => {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  
  // Validación básica
  if (!nombre || !email) {
    mostrarError('Todos los campos son obligatorios');
    return false;
  }
  
  return true;
};
```

## Estructura de Archivos

Sigue estas pautas al crear nuevos archivos:

- **Componentes**: Colócalos en `src/components/` con nombres descriptivos en PascalCase (ej. `ContactForm.astro`); las secciones del sistema de diseño "Nocturne" viven en `src/components/nocturne/`
- **Páginas**: Colócalas en `src/pages/` con nombres en kebab-case (ej. `contacto.astro`)
- **Estilos**: Estilos específicos de componentes dentro del componente, estilos globales en `src/styles/nocturne.css`
- **Assets**: Imágenes y otros recursos en `src/assets/` organizados por tipo
- **Contenido**: Nuevos proyectos/casos de éxito como archivos MDX en `src/content/proyectos/`, respetando el schema de `src/content/config.ts`

## Optimización de Rendimiento

- Optimiza las imágenes antes de agregarlas al proyecto
- Minimiza el uso de JavaScript innecesario
- Utiliza componentes de Astro para mejor rendimiento
- Aprovecha las capacidades de Tailwind para estilos eficientes

## SEO

Asegúrate de que cada página incluya los metadatos necesarios para SEO:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const title = "Título de la Página | S&G Soluciones de Ingeniería";
const description = "Descripción clara y concisa para SEO";
---

<BaseLayout title={title} description={description}>
  <!-- Contenido de la página -->
</BaseLayout>
```

## Pruebas

Antes de enviar tu contribución, asegúrate de:

1. Probar la funcionalidad en diferentes navegadores (Chrome, Firefox, Safari)
2. Verificar la responsividad en dispositivos móviles y de escritorio
3. Comprobar que no hay errores en la consola del navegador
4. Validar que el rendimiento no se ha degradado

## Preguntas y Soporte

Si tienes preguntas sobre cómo contribuir o necesitas ayuda, puedes:

- Crear un issue en el repositorio de GitHub
- Contactar al equipo de desarrollo a través de los canales internos

---

Gracias por contribuir al proyecto del sitio web de S&G Soluciones de Ingeniería. Tu esfuerzo ayuda a mejorar nuestra presencia digital y a ofrecer una mejor experiencia a nuestros clientes.