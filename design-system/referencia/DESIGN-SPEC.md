# Especificación de diseño — S&G Soluciones de Ingeniería

Guía para reconstruir y aplicar el rediseño ("estilo fresco") en **todo** el sitio.
Un agente de IA debe leer este documento y **reutilizar los mismos tokens, componentes y patrones** en cada página nueva, en lugar de inventar estilos.

---

## 0. Stack tecnológico

El sitio está construido con **Astro 6.0** y **Tailwind CSS**. Tener esto en cuenta al implementar:

- **Componentes = archivos `.astro`.** Cada componente de §4 (nav, botón, tarjeta de caso, KPI, carrusel de testimonios, mosaico…) debe existir como un `.astro` reutilizable en `src/components/`, y las páginas (`src/pages/*.astro`) los componen. No repetir markup: un solo `Boton.astro`, `TarjetaCaso.astro`, etc., parametrizados por props.
- **Tailwind es la capa de estilo.** Los prototipos de esta guía usan CSS con clases y `:root` para ser legibles; al llevarlos a producción, traducir a utilidades de Tailwind. Los **tokens de §2 se definen una sola vez** en `tailwind.config` (`theme.extend.colors`, `fontFamily`, etc.) y se consumen como `bg-ink`, `text-teal-700`, `font-cond`… — no hardcodear hex en las plantillas.
- **JS de interacción** (nav `.solid` al scroll, IntersectionObserver del reveal, carrusel) va en `<script>` del `.astro` o en una pequeña isla; mantenerlo vanilla, sin dependencias nuevas.
- **Contenido** (proyectos/casos) sigue en colecciones de contenido de Astro (`src/content/`), como hoy. El diseño consume esos datos; ver §7.
- **Imágenes:** usar `astro:assets` (`<Image />`) para las fotos reales; el `<image-slot>` del mosaico es solo para el prototipo/carga manual — en producción se sustituye por `<Image />` alimentado desde `gallery[]`.

> Los archivos `.html` de este proyecto son el **prototipo visual de referencia**. La fuente de verdad de estilo son los tokens; la de estructura, estos componentes.

---

## 1. Principios

- **Industrial, técnico y directo.** Titulares en mayúsculas condensadas, mucho contraste, foto real de planta.
- **Dos mundos que alternan:** secciones oscuras (fondo `--ink`, texto claro) y secciones claras (fondo `--paper`, texto oscuro). Nunca más de esas dos bases.
- **El teal es el único acento.** Se usa en kickers, viñetas, hovers, bordes de foco, marcas de esquina y botón primario. No introducir otros colores.
- **La foto manda.** Heros y galerías van a sangre; imágenes reales del proyecto, nunca ilustración ni gradientes decorativos.
- **Marca de esquina (teal L-corner)** como firma visual sobre las fotos destacadas.
- Sin emojis. Sin sombras de colores. Sin esquinas muy redondeadas (todo es recto salvo el radio mínimo de controles).

---

## 2. Tokens (copiar al `:root` de cada página)

```css
:root{
  /* Acento corporativo (del logo) */
  --teal:#00a79d; --teal-600:#009088; --teal-700:#00706a; --teal-300:#7fd8cf; --teal-050:#e7f6f3;
  /* Bases */
  --navy:#122a49; --ink:#0d1417; --ink-2:#141d21;
  --paper:#f4f6f6; --paper-2:#eceff0; --line:#d9dedf; --muted:#5b6567;
  /* Tipografía */
  --cond:"Barlow Condensed",system-ui,sans-serif;  /* títulos */
  --body:"Barlow",system-ui,sans-serif;            /* texto */
  /* Ritmo */
  --edge:clamp(24px,5vw,84px);  /* padding lateral de página */
  --max:1320px;                 /* ancho máximo de contenido */
}
```

Fuentes (en `<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&display=swap" rel="stylesheet" />
```

### Uso del color
- Texto sobre claro: `--ink` (títulos), `#374042` / `--muted` (cuerpo).
- Texto sobre oscuro: `#fff` (títulos), `rgba(226,236,236,.72–.9)` (cuerpo).
- Acento en texto sobre claro: **`--teal-700`** (nunca `--teal` puro, no contrasta lo suficiente en tamaño cuerpo).
- Acento en texto sobre oscuro: **`--teal-300`**.

### En Tailwind (producción)
Definir los tokens en `tailwind.config.mjs` y consumirlos como utilidades:
```js
// tailwind.config.mjs
export default {
  theme: { extend: {
    colors: {
      teal:   { DEFAULT:'#00a79d', 300:'#7fd8cf', 600:'#009088', 700:'#00706a', 50:'#e7f6f3' },
      navy:'#122a49', ink:{ DEFAULT:'#0d1417', 2:'#141d21' },
      paper:{ DEFAULT:'#f4f6f6', 2:'#eceff0' }, line:'#d9dedf', muted:'#5b6567',
    },
    fontFamily: { cond:['"Barlow Condensed"','sans-serif'], body:['Barlow','sans-serif'] },
  }},
};
```
Ejemplos: fondo oscuro `bg-ink text-white`, acento en claro `text-teal-700`, título `font-cond uppercase`, borde `border-line`.

### Modo claro / oscuro (theming)
El sistema soporta **ambos modos** mediante una capa de **tokens semánticos** que se invierten con `[data-theme="dark"]` en `<html>`. No se recolorean valores sueltos: los componentes consumen los tokens semánticos, no los crudos. El teal se mantiene; solo cambian superficie, texto y borde (y el acento en texto pasa de `teal-700` a `teal-300`).

```css
:root{
  --surface:#f4f6f6; --surface-2:#eceff0; --card:#ffffff;
  --tx:#0d1417; --tx-soft:#374042; --tx-mut:#5b6567;
  --bd:#d9dedf; --accent-tx:#00706a; --code-bg:#eceff0;
  color-scheme:light;
}
[data-theme=dark]{
  --surface:#0d1417; --surface-2:#10181c; --card:#141d21;
  --tx:#eef4f4; --tx-soft:rgba(238,244,244,.82); --tx-mut:rgba(226,236,236,.58);
  --bd:rgba(255,255,255,.12); --accent-tx:#7fd8cf; --code-bg:rgba(255,255,255,.06);
  color-scheme:dark;
}
```

| Token | Rol | Claro | Oscuro |
|---|---|---|---|
| `--surface` | Fondo de página | `#f4f6f6` | `#0d1417` |
| `--surface-2` | Fondo alterno | `#eceff0` | `#10181c` |
| `--card` | Superficie de tarjeta | `#ffffff` | `#141d21` |
| `--tx` | Texto principal | `#0d1417` | `#eef4f4` |
| `--tx-mut` | Texto tenue | `#5b6567` | `rgba(226,236,236,.58)` |
| `--bd` | Bordes / hairlines | `#d9dedf` | `rgba(255,255,255,.12)` |
| `--accent-tx` | Acento en texto | `#00706a` | `#7fd8cf` |

**Reglas del modo:**
- Toda superficie/texto/borde de página usa el token semántico (`background:var(--surface)`, `color:var(--tx)`, `border-color:var(--bd)`, acento en texto `var(--accent-tx)`), **no** el crudo (`--ink`/`--paper`/`--line`).
- Las secciones **estructuralmente oscuras** (hero, testimonio, contacto, footer) permanecen oscuras en ambos modos — usan `--ink`/`--navy` directo y NO cambian con el tema.
- El teal (`--teal*`) es constante en ambos modos.
- **Default e inicialización:** leer `localStorage['sg-theme']`; si no existe, usar `prefers-color-scheme`. Fijar `data-theme` en `<html>` con un script inline en `<head>` **antes** del render para evitar parpadeo (FOUC). Persistir en `localStorage` al alternar.
- En **Tailwind** activar `darkMode:['selector','[data-theme="dark"]']` y mapear los tokens semánticos como colores (`surface`, `card`, `tx`, `bd`, `accent-tx`) para usar `bg-surface text-tx border-bd`; el toggle es una isla mínima de JS. En **Astro**, un `ThemeToggle.astro` con el script no-flash en el `<head>` del layout.

Ver la demostración funcional (botón Oscuro/Claro) y la tabla de tokens en `sistema-de-diseno.html` → sección *Modo claro / oscuro*.

---

## 3. Tipografía

| Rol | Familia | Transformación | Tamaño |
|---|---|---|---|
| H1 hero | Barlow Condensed 600 | UPPERCASE | `clamp(42px,7vw,112px)`, line-height .94 |
| H1 página interior | Barlow Condensed 600 | UPPERCASE | `clamp(38px,5.6vw,84px)` |
| H2 sección | Barlow Condensed 600 | UPPERCASE | `clamp(34px,4vw,58px)` |
| H3 tarjeta | Barlow Condensed 600 | UPPERCASE | 21–26px |
| Kicker | Barlow Condensed 600 | UPPERCASE, `letter-spacing:.18em` | 14px |
| Cuerpo | Barlow 400 | normal | 15–17px, line-height 1.6 |
| KPI número | Barlow Condensed 700 | — | 22–50px |

- Resaltado dentro de títulos: envolver la palabra en `<em>` (estilo `font-style:normal; color:var(--teal-700)` en claro / `--teal-300` en oscuro).
- Etiquetas/overline: Barlow Condensed 600, uppercase, tracking `.05–.1em`.

---

## 4. Componentes reutilizables

Todos son HTML + CSS inline-compatibles (sin framework). Copiar la clase y su CSS.

### 4.1 Kicker (overline con línea)
```html
<span class="kick">Qué hacemos</span>
```
```css
.kick{font-family:var(--cond);font-weight:600;font-size:14px;letter-spacing:.18em;text-transform:uppercase;color:var(--teal-700);display:flex;align-items:center;gap:12px}
.kick::before{content:"";width:40px;height:2px;background:var(--teal)}
```
En secciones oscuras: `color:var(--teal-300)` (la línea sigue en `--teal`).

### 4.2 Botones
```html
<a class="btn-t">Cotiza tu proyecto <span class="arrow"></span></a>  <!-- primario relleno -->
<a class="btn-o">Ver casos <span class="arrow"></span></a>            <!-- contorno -->
```
- `.btn-t`: relleno `--teal`, texto blanco, hover `--teal-600` + `translateY(-2px)`.
- `.btn-o`: borde 1.5px, hover borde teal. Sobre oscuro: borde `rgba(255,255,255,.5)`, texto blanco.
- Altura 50px, Barlow Condensed 600 uppercase, `.arrow` = cuadro con dos bordes rotado 45°.

### 4.3 Marca de esquina (firma sobre fotos)
```html
<figure class="fig"><span class="mk2"></span><img …><span class="mk"></span></figure>
```
```css
.mk {position:absolute;left:-12px;bottom:-12px;width:54px;height:54px;border-left:3px solid var(--teal);border-bottom:3px solid var(--teal)}
.mk2{position:absolute;right:-12px;top:-12px;width:54px;height:54px;border-right:3px solid var(--teal);border-top:3px solid var(--teal)}
```

### 4.4 Tarjeta de servicio (fondo claro)
Número `01`, título uppercase, descripción, fila de `.tag`. Barra teal superior que aparece en hover (`::before` scaleX 0→1), `translateY(-4px)` + sombra.

### 4.5 Tarjeta de caso (fondo oscuro)
Foto 16:11 con overlay inferior y `.meta` teal encima; cuerpo con título, resumen, 3 KPIs sobre borde superior, y enlace "Ver caso". Toda la tarjeta enlaza al detalle. Hover: zoom de imagen (`scale(1.06)`).

### 4.6 KPI
```html
<div><div class="kn">−30%</div><div class="kl">Reducción de fallas</div></div>
```
`.kn` Barlow Condensed 700 (teal-700 en claro / teal-300 en oscuro), `.kl` uppercase 11–12px muted. Agrupar en fila con borde superior `1px solid`.

### 4.7 Tag / chip
```html
<span class="tag">MQTT</span>
```
Borde 1px `--line`, texto `--teal-700` uppercase, Barlow Condensed. En fila con `gap`.

### 4.8 Etiqueta / tagline sobre foto
Bloque teal sólido con número KPI grande, anclado a una esquina de la foto (`.tagline`).

### 4.9 Nav (fijo, transparente→sólido)
Logo (isotipo `assets/logo/icono.png`) + wordmark, enlaces uppercase, CTA teal. Al hacer scroll >40px añade `.solid` (fondo `rgba(11,17,20,.92)` + blur + reduce padding). Enlace activo: `[aria-current=page]` en teal.

### 4.10 Footer
Fondo `#090e10`, isotipo + nombre, línea legal + contacto. Flex con `space-between`.

### 4.11 Mosaico de galería (image-slot)
Para subir las fotos más representativas de cada proyecto. Grid de 4 columnas, filas de 190px, con celdas que ocupan varios módulos:
```html
<div class="mosaic">
  <image-slot class="m-big"  id="PROY-g1" shape="rect" placeholder="Foto principal"></image-slot>
  <image-slot               id="PROY-g2" shape="rect" placeholder="Detalle"></image-slot>
  …
</div>
<script src="image-slot.js"></script>
```
```css
.mosaic{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:190px;gap:14px}
.mosaic image-slot{width:100%;height:100%;display:block}
.mosaic .m-wide{grid-column:span 2}
.mosaic .m-tall{grid-row:span 2}
.mosaic .m-big {grid-column:span 2;grid-row:span 2}
```
**Regla:** cada `image-slot` necesita un `id` ÚNICO y distinto en cada página (persistencia por id). Prefijar con un slug del proyecto (`subestacion-g1`, `condensadores-g1`, …). Colapsa a 2 columnas ≤820px y a 1 columna ≤520px.

### 4.12 Carrusel de testimonios
Frases de clientes que rotan automáticamente sobre fondo `--navy`, con logo del cliente **opcional** (transparente si no se define) y puntos de navegación. Auto-avanza cada 5.5s; se pausa al pasar el mouse.
```html
<div class="qtrack" id="qtrack" aria-live="polite">
  <figure class="qitem on" data-logo="" data-name="Cargo" data-org="Empresa · Ciudad">
    <blockquote>Frase del cliente…</blockquote>
  </figure>
  <!-- repetir .qitem por testimonio -->
</div>
<div class="qmeta"><img class="qlogo" id="qlogo" alt="" /><figcaption id="qcap"></figcaption></div>
<div class="qdots" id="qdots" role="tablist"></div>
```
- `data-logo`: ruta del logo del cliente; **vacío = sin logo (transparente)**. `data-name` = persona/cargo, `data-org` = empresa (se resalta en `--teal-300`).
- Cada `.qitem` está en `position:absolute`; solo `.on` es visible (fade + subida 18px). El JS clona los puntos, rota el índice y pinta logo/caption desde los `data-*`.
- En Astro: un `TestimonioCarrusel.astro` que recibe `items[]` (`{cita, cargo, empresa, logo?}`) y trae su `<script>` de rotación; el logo se resuelve con `astro:assets` cuando existe.

---

## 5. Patrón de sección

```css
.sec{padding:clamp(72px,8vw,124px) 0}         /* respiración vertical */
.sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;flex-wrap:wrap;margin-bottom:clamp(40px,4vw,60px)}
```
Encabezado de sección = **kicker + H2 a la izquierda, lead/descr. a la derecha**. Alternar el fondo de secciones consecutivas (claro / oscuro) para dar ritmo.

### Animación de entrada (reveal)
Clase `.rv` (opacity:0) → `.rv.in` dispara keyframe `rise` (sube 26px + fade, cubic-bezier(.2,.7,.2,1)). Escalonar con `.d1/.d2/.d3` (delays .08/.16/.24s). Activar con un `IntersectionObserver` (threshold .12–.15) que añade `.in`. Respetar `prefers-reduced-motion`.

---

## 6. Plantillas de página

| Archivo | Rol | Sirve como |
|---|---|---|
| `index.html` | Landing completa | Referencia de hero, servicios, casos, nosotros, testimonio, contacto, footer |
| `casos-de-exito.html` | Listado de casos | Patrón de listado en split alternado |
| `plantilla-proyecto.html` | **Detalle de proyecto (guía)** | **Copiar por cada proyecto nuevo** |
| `sistema-de-diseno.html` | Guía visual en vivo | Tokens, tipografía y componentes renderizados |
| `portal-cliente.html` | **Portal privado de cliente** | Cartera, avance, WBS, Gantt, curvas, actividades, documentos, cuenta |
| `portal-admin.html` | **Administración del portal (S&G)** | Visibilidad por proyecto, accesos, empresas, alta de usuarios |

---

## 6b. Portal de cliente (área privada)

Área autenticada donde cada cliente ve el avance de **su** proyecto. Comparte tokens, tipografía y modo claro/oscuro con el sitio público, pero añade la **gramática blueprint** (marcos de línea con marcas de registro `+`) para las superficies de datos.

### Estructura
1. **Login** — split: panel oscuro de marca (rejilla técnica + gradiente teal) / formulario en tarjeta blueprint.
2. **Cartera de proyectos** — **pantalla de inicio tras el login**. Un cliente puede tener N proyectos; entra a la lista de los proyectos a los que tiene acceso y elige uno. La cabecera de proyecto se oculta en esta vista y cada tarjeta muestra código, estado, servicio, avance real vs. plan y rango de fechas.
3. **App shell** — `.appbar` oscura fija con logo, pestañas, toggle de tema, identidad del usuario y salir; tira `.mtabs` en móvil. Enlace `‹ Todos mis proyectos` para volver a la cartera.
4. **Cabecera de proyecto** — código, título, ficha (estado, fechas, fase, responsable) y **avance global** con barra + marca de corte del plan.
5. **Vistas** (pestañas): Cartera · Avance · **WBS** · Cronograma · Actividades · Documentos · Mi cuenta.

### Indicadores estándar — iguales en TODOS los proyectos
La vista de avance muestra **siempre los mismos cuatro indicadores, en el mismo orden**, para que el cliente compare proyectos sin reaprender la pantalla:

| # | Indicador | Origen |
|---|---|---|
| 1 | **Avance físico** (%) | Ponderado por peso de cada entregable de nivel 1 de la WBS |
| 2 | **Actividades cerradas** (n/N) | Cuenta de actividades de nivel 3 cerradas |
| 3 | **Cumplimiento de plazo (SPI)** | EV / PV |
| 4 | **Cumplimiento de costo (CPI)** | EV / AC |

Cada tarjeta lleva etiqueta, valor, **tendencia** (`.t-up` / `.t-dn` / `.t-fl`) y una línea de método. Las tarjetas usan **`grid-template-rows: subgrid`** para que etiqueta, número, tendencia y descripción queden alineados entre las cuatro aunque el texto se envuelva. Los indicadores propios del proyecto (puntos instrumentados, factor de potencia, etc.) NO van en esta fila — se muestran como KPIs del caso de éxito al cierre.

### WBS / EDT — tres niveles
El alcance se modela como una **lista plana** en la que el código determina la jerarquía: `'4'` (entregable) → `'4.1'` (paquete de trabajo) → `'4.1.2'` (actividad). Un solo array alimenta la vista WBS, el Gantt y el avance por fase — nunca se duplica la estructura.
```js
{ c:'4.1.2', n:'Validación de umbrales', w:5, s:5.2, e:6.2, p:45, st:'' }
// c = código WBS · n = nombre · w = peso % · s/e = inicio/fin en la escala del cronograma
// p = % avance · st = '' | 'done' | 'risk'
```
- **Vista WBS** (`.wbs-tree` / `.wnode` / `.wkids` / `.wk`): un marco blueprint por entregable de nivel 1 con su peso, avance y barra; dentro, filas de nivel 2 y, indentadas (`.wk.l3`), las de nivel 3.
- **Gantt jerárquico**: nivel 1 = **barra resumen** tipo corchete (`.gbar.b1`, con puntas triangulares, sin porcentaje), nivel 2 = barra estándar con % (`.b2`), nivel 3 = barra delgada (`.b3`). La columna de nombre indenta por nivel y muestra el código WBS en monoespaciada.
- **Controles** (`.gtoolbar`): segmentado “ver hasta nivel 1/2/3” + expandir/colapsar todo, y un `+/–` (`.tw`) por fila con hijos. El estado colapsado vive en un `Set` de códigos.

### Curva S y valor ganado
Dos gráficas SVG dibujadas con el mismo marco (`frame()` — rejilla, ejes, etiquetas, línea de HOY):
- **Curva S**: % acumulado planeado (línea punteada neutra) vs. ejecutado (línea teal con área y punto de corte) y **proyección** al cierre (teal punteado).
- **Valor ganado (EVM)**: PV / EV / AC acumulados en millones, más cuatro cifras: **SPI**, **CPI**, **BAC** y **EAC** (EAC en rojo si supera el BAC). Se recalculan del propio array — no se escriben a mano.
Ambas se redibujan al cambiar de tema y al entrar a la vista (los colores salen de los tokens vía `var()`).

### Componentes nuevos
| Clase | Qué es |
|---|---|
| `.bp` + `<i class="corner tl/tr/bl/br">` | **Marco blueprint**: borde hairline transparente con marcas de registro `+` en teal. Envuelve toda superficie de datos. |
| `.pgrid` / `.pcard` | Cartera: tarjeta de proyecto con estado, avance y enlace. Clicable y enfocable con teclado. |
| `.btn` `.btn-p` `.btn-o` `.btn-g` `.btn-block` | Botones del portal (44px). El primario es el único objeto relleno. |
| `.seg` | Segmentado (nivel de WBS visible en el Gantt). |
| `.field` `.input` `.pwrap`+`.peye` `.chk` | Campos de formulario, mostrar/ocultar contraseña, checkbox. |
| `.kgrid` / `.kcard` | Rejilla de indicadores con filas alineadas por subgrid. |
| `.bar` + `i` + `.plan` | Barra de avance con marca de corte del planeado. |
| `.gantt` `.grow.lv1/2/3` `.gname`+`.wbs`+`.tw` `.gbar.b1/b2/b3` `.gmile` `.gnow` | Gantt jerárquico de tres niveles con colapsado. |
| `.wbs-tree` `.wnode` `.wkids` `.wk` | Vista de WBS / EDT. |
| `.chart` + `.ln-pv/.ln-ev/.ln-ac/.fc` `.clegend` `.evm` | Curva S, valor ganado y sus cifras. |
| `.timeline` | Bitácora de actividades: línea vertical con rombos; cada entrada cita su código WBS. |
| `.dtable` `.dext` `.tag` `.pill` `.dl` | Tabla de documentos. |
| `.badge` `.b-ok/.b-warn/.b-risk` | Estado del proyecto. |
| `.meter` + `.reqs` | Medidor de fortaleza de contraseña y checklist de requisitos. |
| `.sec-list` | Filas etiqueta/valor con `.pill` a la derecha. |
| `.mos` + `image-slot` | Registro fotográfico de obra (mosaico de §4.11), con ids prefijados por proyecto. |

### Archivos del prototipo
`portal-cliente.html` (portal del cliente) · `portal-admin.html` (área interna de S&G) · `portal-config.js` (visibilidad por proyecto, compartida) · `portal-data.js` (datos de proyecto) · `portal-admin-data.js` (empresas y usuarios) · `portal-app.js` y `portal-admin.js` (lógica). En Astro: los `*-data.js` se sustituyen por consultas al backend y la lógica se reparte entre componentes `.astro` + islas mínimas.

---

## 6c. Administración del portal (área interna de S&G)

`portal-admin.html` — misma gramática visual que el portal, barra superior con la etiqueta *Administración del portal* y el acento en `--teal-300`. Está organizada como un **flujo numerado de cinco pasos**; las pestañas llevan el número del paso y cada vista indica cuál sigue.

### Flujo (el orden importa)
| Paso | Vista | Regla |
|---|---|---|
| **1** | **Empresas** | Todo empieza aquí. Sin empresa no se pueden crear usuarios ni proyectos. Nace **Pendiente**; pasa a **Activa** cuando tiene usuario y proyecto. |
| **2** | **Usuarios** | Cada usuario pertenece a **una sola empresa**. Sin proyectos al crearse — se asignan en el paso 4. |
| **3** | **Proyectos** | El proyecto se **aloja en una empresa** (campo `empresa`). Nace en estado **Planeado**, sin contactos. |
| **4** | **Contactos** | Asigna qué usuarios ven cada proyecto y su **rol dentro del proyecto** (`rolProyecto[projectId]`). Solo se ofrecen usuarios de la misma empresa del proyecto. |
| **5** | **Visibilidad** | Qué muestra el portal para ese proyecto (ver abajo). |

Atajos que respetan el flujo: en la tabla de empresas, `+ Usuario` y `+ Proyecto` abren el modal con la empresa **preseleccionada**; en la de proyectos, `Contactos` y `Visibilidad` saltan al paso correspondiente. Si no hay empresas, los botones de crear usuario/proyecto avisan y devuelven al paso 1.

### Patrón de tabla (obligatorio en toda tabla del admin)
Toda tabla usa la misma estructura de tres partes:
1. **`.tbar`** — buscador (`.srch` con icono, `type="search"` y botón de limpiar que aparece al escribir), filtro por empresa (`.fsel`) cuando aplica, contador `n de N` y botón primario `+ Nuevo…` a la derecha.
2. **`.tbl`** — filas con nombre + identificador secundario en monoespaciada, `.tag` para conteos y listas, `.pill` para estados, acciones alineadas a la derecha. Sin resultados → bloque `.empty` con título y sugerencia (nunca una tabla vacía muda).
3. **`.pager`** — `desde–hasta de total`, botones `‹ 1 … 4 5 6 … 12 ›` (ventana de ±1 con elipsis) y selector **Por página** (5/10/20).

La búsqueda es **acento-insensible** (`norm()` con `NFD`) y cubre todos los campos visibles de la fila; filtrar o cambiar el tamaño de página resetea a la página 1. Estado de cada tabla en un objeto propio `{page, size, q, empresa}`.

### Modales (`.mbd` + `.dlg`)
**Toda creación ocurre en un modal**, nunca en un formulario embebido en la página: backdrop oscuro con blur, diálogo con marco blueprint, cabecera (título + qué paso del flujo es), cuerpo con scroll propio y pie con acción primaria, cancelar y una nota. Cierre por botón `✕`, `Cancelar`, clic en el backdrop o `Esc`; `body.modal-open` bloquea el scroll de fondo y el foco entra al primer campo y vuelve al disparador al cerrar. Validación en el modal (`.err`, campos obligatorios, **NIT/correo/código de proyecto duplicados**) y confirmación por `.toast` que indica el paso siguiente.
Modales: **Nueva empresa** · **Nuevo usuario** · **Nuevo proyecto** · **Contactos del proyecto** (este último `.dlg.wide`, con su propio buscador de usuarios y una fila `.arow` por usuario: casilla, nombre/cargo, `select` de rol en el proyecto — deshabilitado si no está asignado — y estado).

### 5 · Visibilidad — qué ve el cliente
La visibilidad se define **por proyecto, no por cliente**. Lista de proyectos con buscador a la izquierda (`.plist` / `.pitem`), panel de conmutadores a la derecha (`.sw`, `role="switch"`), en cuatro grupos:

| Grupo | Controla |
|---|---|
| **Secciones visibles** | Avance · WBS · Cronograma · Bitácora · Documentos · Registro fotográfico (apagar oculta la pestaña entera) |
| **Indicadores** | Cuáles de los 4 estándar se muestran (la rejilla se recompone a 1–4 columnas; sin ninguno se oculta la sección completa) |
| **Cronograma y gráficas** | Gantt · fila de hitos · línea base · líneas de seguimiento · curva S · **valor ganado (EVM)** |
| **Detalle e información** | Resumen del periodo · riesgos y acciones · **montos en pesos (BAC/EAC)** |

Por defecto **valor ganado, CPI y montos están apagados** — información de costo que no todo cliente debe ver. `Guardar` persiste; `Restaurar por defecto` limpia la excepción del proyecto.

**Contrato de configuración** (`window.PortalConfig`): `get(projectId)` / `set(projectId,cfg)` / `reset(projectId)` sobre un objeto de cuatro grupos de banderas. El portal del cliente lo lee en `applyConfig()` y muestra u oculta pestañas, bloques, KPIs y gráficas.
> **En producción:** el prototipo persiste en `localStorage`; la implementación real es una tabla `project_visibility` y el **filtrado ocurre en servidor** — los datos ocultos no deben viajar al navegador del cliente (ocultar con CSS no es seguridad).

### Cronograma: línea base, seguimiento y PDF
- **Línea base** (`.gbase`): barra punteada bajo la barra real, dibujada con `bs`/`be` de cada fila de la WBS (si no existen, se asume igual al plan vigente). Permite ver el corrimiento contra el plan original.
- **Líneas de seguimiento** (`.gcut`): verticales ámbar en cada fecha de corte (`cortes[]{at,l}`), con etiqueta en la primera fila. La línea teal de HOY se mantiene aparte.
- Ambas se conmutan desde la barra del Gantt y pueden desactivarse por proyecto desde la administración.
- **Exportar PDF**: botón que añade `.printing` a la vista de cronograma y llama `window.print()`. El `@media print` fija **horizontal**, oculta barra, pestañas, controles y pie, suelta el scroll del Gantt y evita cortar las gráficas.

### Modelo de administración
`EMPRESAS[]{id,nombre,nit,sector,ciudad,contacto,correo,tel,estado,proyectos[]}` · `USUARIOS[]{id,nombre,correo,cargo,empresa,rol,estado,ultimo,dosPasos,proyectos[],rolProyecto{}}` · `PROJECTS[].empresa` liga proyecto ↔ empresa · `ROLES` (portal) y `ROLES_PROYECTO` (por proyecto). Reglas de alta: sin registro público, invitación firmada de un solo uso (72 h), contraseña 12+ con Argon2id, 2FA obligatoria para el rol Aprobador, aislamiento por empresa verificado en servidor y auditoría de ingresos, descargas y cambios de acceso.

### Estados semánticos
`--ok #2f8f6b` · `--warn #b8863b` · `--risk #b23b3b` (con variantes aclaradas en modo oscuro). Se usan **solo** para estado — no son colores decorativos, y no desplazan al teal como acento.

### Autenticación — criterio "fácil y seguro"
El prototipo no lleva backend. Al implementar en Astro:
- **Doble vía de ingreso:** contraseña + **enlace de un solo uso (magic link)** por correo, expiración 15 min. El enlace es la vía recomendada para usuarios poco técnicos: nada que recordar.
- **Contraseñas:** mínimo **12 caracteres** (frase), validación en cliente y servidor, hash **Argon2id** (o bcrypt cost ≥12). Nunca reglas de rotación forzada ni preguntas de seguridad.
- **2FA** por código de 6 dígitos (TOTP o correo) al entrar desde un equipo nuevo.
- **Sesión:** cookie `HttpOnly`, `Secure`, `SameSite=Lax`, rotación de token al iniciar sesión; "cerrar otras sesiones" al cambiar contraseña.
- **Rate limiting** por IP y por usuario en login y en solicitud de enlace; mensajes de error genéricos (nunca "usuario no existe").
- **Autorización:** cada usuario pertenece a una empresa y solo ve los proyectos de esa empresa — verificar en servidor en cada consulta, jamás filtrar solo en cliente.
- Usuarios los **habilita S&G** (no hay registro público); primer ingreso por enlace de invitación.
- Recomendado: delegar en un proveedor de auth (Auth.js / Supabase Auth / Clerk) antes que implementar sesiones a mano.

### Modelo de datos (alimenta también los casos de éxito)
Un proyecto en el portal es el **mismo registro** que luego se publica como caso de éxito. **Todos los proyectos llevan el mismo conjunto de campos** — la pantalla no cambia de un proyecto a otro:
`cliente`, `id` (código), `titulo`, `sector`, `ubicacion`, `servicio`, `estado`, `inicio`, `fin`, `faseActual`, `responsable`, `real`/`plan` (%), `wbs[]{c,n,w,s,e,p,st}` (3 niveles), `miles[]{n,at}`, `kpis[]` (los 4 estándar), `pv[]`/`ev[]`/`fcast[]` (curva S), `acPV[]`/`acEV[]`/`acAC[]`/`bac`/`eac` (EVM), `flags[]`, `acts[]{fecha,titulo,detalle,responsable,wbs}`, `nextActs[]`, `docs[]{nombre,tipo,version,fecha,estado,url}`, `fotos[]`.

**Autorización multiproyecto:** el usuario pertenece a una empresa y la consulta devuelve **solo** los proyectos de esa empresa; la cartera se arma con ese resultado y cada vista de detalle vuelve a verificar la pertenencia en servidor (nunca filtrar solo en cliente).

Al cierre: `estado: "cerrado"` + una bandera `publicarComoCaso` toma `titulo`, `sector`, `kpis`, `fotos` y el resumen de la WBS de nivel 1 para generar la página pública con `plantilla-proyecto.html`. **Los documentos, la bitácora y las cifras de costo (PV/EV/AC, BAC, EAC) nunca se publican.**

### `plantilla-proyecto.html` — cómo se usa
1. Copiar con nombre por proyecto (`proyecto-<slug>.html`).
2. Reemplazar los tokens `{{...}}` (título, meta, resumen, KPIs, ficha técnica, bloques, tecnologías).
3. Reemplazar los `id` de los `image-slot` por unos con prefijo del proyecto.
4. Enlazar desde las tarjetas de `index.html` y `casos-de-exito.html` (href de la tarjeta y del enlace "Ver caso").
5. Estructura fija: Hero foto + KPIs → ficha técnica → 3–4 bloques de contenido → mosaico → tecnologías → CTA → footer.

---

## 7. Estructura de contenido de un proyecto (del CMS actual)

Cada proyecto tiene: `title`, `sector`, `cliente`, `ubicacion`, `fecha`, `coverImage`, `resumen`, `kpis[]{label,value}`, `tecnologias[]`, `tags[]`, `gallery[]`, y cuerpo en secciones (Problema/Contexto → Enfoque/Intervención → Solución/Implementación → Resultados/Beneficios). El mapeo al patrón:
- `title`→H1, `sector·ubicacion·fecha`→metaline, `resumen`→resumen hero, `kpis`→KPIs hero, `tecnologias`→tags, `gallery`→mosaico, cuerpo→bloques `.block`.

---

## 8. Assets

- Logo: `assets/logo/` — `icono.png` (isotipo, para nav/footer), `logo.png` (lockup fondo claro), `logo-osc.png` (lockup fondo oscuro), `logo-full.svg`, `icon.svg`.
- Fotos: `assets/img/`. En producción, tomar de `coverImage`/`gallery` de cada proyecto.
- `image-slot.js` debe estar en la raíz junto a las páginas que lo usan (comparte sidecar por carpeta; ids únicos).

---

## 9. Checklist para el agente al crear/actualizar una página

- [ ] `:root` con los tokens de §2 y las fuentes Barlow / Barlow Condensed.
- [ ] Nav fijo con isotipo + comportamiento `.solid` al scroll.
- [ ] Alternar secciones claras/oscuras; una o dos bases, teal como único acento.
- [ ] Títulos en Barlow Condensed uppercase; cuerpo en Barlow.
- [ ] Acento en texto: `--teal-700` sobre claro, `--teal-300` sobre oscuro.
- [ ] Reutilizar los componentes de §4 (no crear variantes nuevas sin necesidad).
- [ ] Reveal `.rv` con IntersectionObserver + `prefers-reduced-motion`.
- [ ] Foco de teclado visible en teal; hovers definidos en todos los interactivos.
- [ ] `image-slot` con ids únicos por página para las galerías.
- [ ] Footer y datos de contacto consistentes (Barranquilla · +57 324 3025107 · informacion@sgsolucionesing.com).
