# Base de diseño — S&G Soluciones de Ingeniería

Punto de entrada único para cualquier trabajo visual sobre el sistema web de S&G:
sitio público, casos de éxito, portal de cliente y panel de administración.

Esta carpeta **no entra al build**. Astro solo compila `src/` y `public/`, y el
`Dockerfile` copia únicamente `src/`, `public/` y los archivos de configuración.
Vive en el repositorio como referencia versionada, no como código desplegado.

---

## 1. Orden de lectura

| # | Archivo | Para qué |
|---|---|---|
| 1 | [`referencia/DESIGN-SPEC.md`](referencia/DESIGN-SPEC.md) | **Fuente de verdad.** Tokens, tipografía, componentes, modo claro/oscuro, portal y administración. Leer completo antes de escribir estilos. |
| 2 | [`MAPEO-ASTRO.md`](MAPEO-ASTRO.md) | Qué del spec ya existe en `src/`, qué falta y dónde va cada pieza. |
| 3 | `referencia/*.html` | Prototipos navegables. Abrir en el navegador para ver el comportamiento real. |

---

## 2. Regla de precedencia (importante)

En `referencia/_ds/` conviven **dos** sistemas de diseño, y no dicen lo mismo:

| Sistema | Acento | Rol |
|---|---|---|
| **Nocturne** | teal `#00a79d` | El del sitio en producción hoy. |
| **Industry** | acero `#5980a6` | Sistema del que se toma **solo la gramática blueprint** (marcos hairline con marcas de registro `+`). |

**Manda el `DESIGN-SPEC.md`.** Su §2 fija el teal como único acento y sus tokens
son los que ya están en `src/styles/nocturne.css` y `tailwind.config.js`.
De Industry se hereda la *forma* (marcos blueprint para superficies de datos del
portal), nunca la *paleta*. No introducir el azul acero en ninguna pantalla.

---

## 3. Contenido de `referencia/`

### Prototipos de página

| Archivo | Rol |
|---|---|
| `index.html` | Landing completa: hero, servicios, casos, nosotros, testimonio, contacto, footer. |
| `casos-de-exito.html` | Listado de casos en split alternado. |
| `plantilla-proyecto.html` | Detalle de proyecto. Plantilla con tokens `{{...}}` para copiar por proyecto. |
| `sistema-de-diseno.html` | **Guía visual en vivo**: tokens, tipografía y componentes renderizados, con el toggle claro/oscuro funcionando. |
| `portal-cliente.html` | Portal privado: cartera, avance, WBS, Gantt, curva S, EVM, actividades, documentos, cuenta. |
| `portal-admin.html` | Panel de administración: el flujo de 5 pasos (Empresas → Usuarios → Proyectos → Contactos → Visibilidad). |

Los prototipos usan **rutas relativas a su propia carpeta**. Se conservaron en la
raíz de `referencia/` sin reorganizar precisamente para que abran sin tocar una
línea: basta con abrir el `.html` en el navegador.

### Lógica y datos del prototipo

| Archivo | Contenido |
|---|---|
| `portal-config.js` | Contrato `window.PortalConfig`: `get/set/reset` de visibilidad por proyecto. |
| `portal-data.js` | Datos de un proyecto (WBS, hitos, curva S, EVM, actividades, documentos). |
| `portal-admin-data.js` | `EMPRESAS[]`, `USUARIOS[]`, `ROLES`, `ROLES_PROYECTO`. |
| `portal-app.js` | Lógica del portal de cliente. |
| `portal-admin.js` | Lógica del panel de administración. |
| `image-slot.js` | Componente `<image-slot>` del mosaico de galería (persistencia por `id`). |
| `ds-base.js` | Cargador del bundle de design system. |

> Los `*-data.js` son **datos de demostración**. Empresas, NIT, usuarios y correos
> son ficticios. En producción se sustituyen por consultas al backend.

### Assets

- `assets/logo/` — `icono.png` (isotipo, nav/footer), `logo.png` (fondo claro), `logo-osc.png` (fondo oscuro), `logo-full.svg`, `icon.svg`.
- `assets/img/` — fotografía de referencia. **Son imágenes generadas, no fotos de plantas de clientes.** `portada-principal.jpg` y `proyecto-1.jpg` son idénticas, igual que `coverImage.jpg` y `energia-1.jpg`.
- `assets/photo.jpg` — plano de 1918 (dominio público) usado como textura blueprint.
- `screenshots/`, `uploads/` — capturas del propio prototipo, para comparar al implementar.

### Bundles de design system

- `_ds/nocturne-.../` — `styles.css` + `_ds_bundle.js`.
- `_ds/industry-.../` — `styles.css`, `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json` y `readme.md`.

**Brecha conocida:** el `readme.md` de Industry documenta `foundations/`,
`components/`, `templates/`, `theme.json` y `thumbnail.html`, pero esos archivos
**no vinieron en la exportación**. Lo que hay es el runtime (CSS + JS) que
consumen las páginas, no la galería completa. Si hace falta esa galería, hay que
volver a exportarla desde el proyecto de Claude Design.

---

## 4. Checklist antes de escribir una pantalla nueva

Tomado de §9 del spec, con lo que aplica a este repositorio:

- [ ] Consumir los tokens desde `tailwind.config.js` (`bg-ink`, `text-teal-700`, `font-cond`). Nunca hex a mano.
- [ ] Alternar secciones claras y oscuras; teal como único acento.
- [ ] Títulos en Barlow Condensed uppercase; cuerpo en Barlow.
- [ ] Acento en texto: `--teal-700` sobre claro, `--teal-300` sobre oscuro.
- [ ] Reutilizar los componentes de §4 del spec antes de crear una variante nueva.
- [ ] Reveal `.rv` con `IntersectionObserver` y respeto a `prefers-reduced-motion`.
- [ ] Foco de teclado visible en teal en todo elemento interactivo.
- [ ] Datos de contacto consistentes: Barranquilla · +57 324 3025107 · informacion@sgsolucionesing.com

---

## 5. Procedencia

Exportado del proyecto de Claude Design *Rediseño web corporativo S&G Soluciones*.
Al re-exportar, reemplazar el contenido de `referencia/` completo en lugar de
mezclar archivos sueltos, y revisar de nuevo este README por si cambió el
inventario.
