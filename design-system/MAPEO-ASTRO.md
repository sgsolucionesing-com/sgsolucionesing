# Mapeo spec ↔ repositorio

Confronta el `DESIGN-SPEC.md` con lo que hoy existe en `src/`.
Verificado sobre la rama `main` al 25 de agosto de 2026.

---

## 1. Diferencias entre el spec y este repositorio

El spec fue escrito contra un prototipo estático. El repositorio real difiere en
cuatro puntos que hay que tener presentes al implementar:

| Tema | Dice el spec | Está en el repo |
|---|---|---|
| Versión de Astro | Astro 6.0 | Astro `^5.13.4` |
| Salida | No lo trata | `output: 'static'` + `adapter: @astrojs/node` en modo `standalone`. Las rutas con `export const prerender = false` corren on-demand (ver `src/pages/api/contacto.ts`). |
| Idiomas | Solo español | Bilingüe: `es` por defecto sin prefijo, `en` bajo `/en/`. Toda pantalla nueva pública necesita su par en inglés. |
| Secciones | Home, casos, proyecto | Además existe `servicios/` con listado y detalle (`[slug].astro`). |
| Config de Tailwind | `tailwind.config.mjs` | `tailwind.config.js` (CommonJS). Los tokens ya están cargados. |

La existencia del adaptador Node es el dato relevante para el portal y el panel:
**no hace falta cambiar la arquitectura** para agregar rutas con servidor.

---

## 2. Tokens — alineados

`src/styles/nocturne.css` (`:root`) y `tailwind.config.js` ya llevan exactamente
los tokens de §2 del spec: `--teal` y su rampa, `--navy`, `--ink`/`--ink-2`,
`--paper`/`--paper-2`, `--line`, `--muted`, `--cond`, `--body`, `--edge`, `--max`.

En Tailwind se consumen como `teal`, `teal-300/600/700`, `navy`, `ink`, `ink-2`,
`paper`, `paper-2`, `line`, `muted`, `font-cond`, `font-body`.

> `tailwind.config.js` conserva además `sans: Inter` y `heading: Montserrat` del
> diseño anterior. No usarlos en pantallas nuevas.

---

## 3. Componentes de §4 — qué existe

`nocturne.css` define 440 líneas de sistema. Otros componentes viven como estilos
scoped dentro de los `.astro`.

| §4 | Componente | Estado | Dónde |
|---|---|---|---|
| 4.1 | Kicker `.kick` | ✅ | `nocturne.css` |
| 4.2 | Botones `.btn-t` / `.btn-o` / `.arrow` | ✅ | `nocturne.css` (además `.btn-ghost`) |
| 4.3 | Marca de esquina `.mk` / `.mk2` | ✅ | scoped en `Nosotros.astro`, `PageProyectos.astro` |
| 4.4 | Tarjeta de servicio | ✅ | `Servicios.astro`, `.svc*` en `nocturne.css` |
| 4.5 | Tarjeta de caso | ✅ | `Casos.astro`, `.casos` / `.cases` |
| 4.6 | KPI `.kn` / `.kl` | ✅ | scoped en `Casos.astro`, `Nosotros.astro`, `PageProyecto.astro` |
| 4.7 | Tag `.tag` | ✅ | scoped en `Servicios.astro`, `PageProyectos.astro`, `PageServicios.astro` |
| 4.8 | Tagline sobre foto | ✅ | scoped en `PageProyectos.astro` |
| 4.9 | Nav fijo `.nav` + `.solid` | ✅ | `nocturne.css` + script en `BaseLayout.astro` |
| 4.10 | Footer | ✅ | `BaseLayout.astro` |
| 4.11 | Mosaico `<image-slot>` | ❌ | No existe. Hoy la galería del detalle usa `.gal-grid` / `.gallery` con modal propio. |
| 4.12 | Carrusel de testimonios | ✅ | `.qtrack` / `.qitem` / `.qdots` / `.qlogo` / `.qmeta` en `nocturne.css`, `Testimonios.astro` |
| §5 | Sección `.sec` / `.sec-head` y reveal `.rv` | ✅ | `nocturne.css` + `IntersectionObserver` en `BaseLayout.astro` |

Extras del repo que el spec no cubre: `.phead`, `.factbar`, `.prose-n`,
`.cert*` (certificaciones), `.faq-item`, `.crumb`, `.mapsec`, `.clientes`.

Sobre 4.11: el spec dice que `<image-slot>` es solo para el prototipo y que en
producción se sustituye por `<Image />` de `astro:assets` alimentado desde
`gallery[]`. **Eso ya está hecho.** No hay que portar `image-slot.js` al sitio
público; sí es útil como referencia para el registro fotográfico del portal.

---

## 4. Lo que falta

### 4.1 Modo claro / oscuro — no implementado

Verificado: cero ocurrencias de `data-theme` y de `--surface` en `nocturne.css`
y en `BaseLayout.astro`. Hoy el sitio es solo claro.

Para implementarlo según §2 del spec hace falta:

1. Capa de tokens semánticos en `nocturne.css`: `--surface`, `--surface-2`, `--card`, `--tx`, `--tx-soft`, `--tx-mut`, `--bd`, `--accent-tx`, `--code-bg`, más el bloque `[data-theme=dark]`.
2. Migrar los componentes a consumir el token semántico (`var(--surface)`, `var(--tx)`, `var(--bd)`) en vez del crudo (`--paper`, `--ink`, `--line`). Las secciones estructuralmente oscuras (hero, testimonio, contacto, footer) se quedan con `--ink`/`--navy` y no cambian.
3. `darkMode: ['selector', '[data-theme="dark"]']` en `tailwind.config.js` y mapear los semánticos como colores.
4. `ThemeToggle.astro` + script inline **en el `<head>`** de `BaseLayout.astro`, antes del render, leyendo `localStorage['sg-theme']` con respaldo en `prefers-color-scheme`. Sin esto hay parpadeo (FOUC).

Referencia funcional: `referencia/sistema-de-diseno.html`, sección *Modo claro / oscuro*.

### 4.2 Portal de cliente — no existe

Nada de §6b está en `src/`. Ver `referencia/portal-cliente.html` y `portal-app.js`.

### 4.3 Panel de administración — no existe

Nada de §6c está en `src/`. Ver `referencia/portal-admin.html`, `portal-admin.js`
y `portal-admin-data.js`.

---

## 5. Dónde va cada cosa

```
src/
├── components/
│   ├── nocturne/          ← secciones del sitio público (ya existe)
│   ├── portal/            ← nuevo: componentes del portal de cliente
│   └── admin/             ← nuevo: componentes del panel de administración
├── layouts/
│   ├── BaseLayout.astro   ← sitio público (ya existe)
│   └── PanelLayout.astro  ← nuevo: appbar oscura, pestañas, toggle de tema
├── pages/
│   ├── portal/            ← nuevo, con `prerender = false`
│   └── admin/             ← nuevo, con `prerender = false`
└── styles/
    ├── nocturne.css       ← tokens + sistema público (ya existe)
    └── panel.css          ← nuevo: gramática blueprint y componentes de datos
```

Portal y administración comparten tokens, tipografía y modo claro/oscuro con el
sitio público, y añaden la gramática blueprint (`.bp` + `<i class="corner">`) para
las superficies de datos. Es una capa **encima** de `nocturne.css`, no un sistema
paralelo.

---

## 6. Regla de seguridad que no es negociable

El spec la enuncia dos veces y conviene repetirla acá:

> El filtrado ocurre **en servidor**. Los datos que un cliente no debe ver no
> deben viajar a su navegador. Ocultar con CSS no es seguridad.

Aplica a la visibilidad por proyecto (§6c paso 5) y al aislamiento por empresa:
cada consulta verifica en servidor que el usuario pertenece a la empresa dueña del
proyecto. Nunca filtrar solo en cliente.
