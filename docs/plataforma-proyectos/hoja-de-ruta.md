# Plataforma de proyectos — hoja de ruta

Meta a largo plazo: centralizar en una sola aplicación la gestión de proyectos de
S&G bajo prácticas PMI, y darle a cada cliente una ventana al avance del suyo.

Se construye por entregas. Cada una es usable por sí sola.

---

## Estado

| Entrega | Alcance | Estado |
|---|---|---|
| **1** | [Clientes, proyectos y documentos](entrega-1-clientes-proyectos-documentos.md) | **Activa.** Diseño aprobado el 25 de agosto de 2026. |
| 2 | Planificación: WBS, hitos, tareas y subtareas | Propuesta. No aprobada. |
| 3 | Seguimiento: avance, curva S, valor ganado | Sin diseñar. |
| 4 | Bitácora y registro fotográfico de obra | Sin diseñar. |
| 5 | Generación de informes desde los datos | Sin diseñar. |

---

## Decisiones que atraviesan todas las entregas

Tomadas el 25 de agosto de 2026.

### Supabase self-hosted en Dokploy

Aporta Postgres, autenticación y Row Level Security sin salir de la
infraestructura propia. Dokploy tiene template oficial
(`Dokploy/templates/blueprints/supabase`), que levanta trece servicios: `db`,
`auth`, `rest`, `realtime`, `storage`, `kong`, `studio`, `supavisor`, `imgproxy`,
`meta`, `functions`, `db-config`, `deno-cache`.

Consecuencias asumidas:

- Aproximadamente 4 GB de RAM como piso y 8 GB para operar con holgura, conviviendo con la landing. **Verificar la memoria de `balerion` antes de desplegar.**
- El self-hosted no trae respaldo gestionado. El backup se configura en la Entrega 1.
- Las actualizaciones son manuales. Versión fijada en el compose.

### Dos superficies de API

| Superficie | Qué resuelve |
|---|---|
| **PostgREST** (automático de Supabase) | El CRUD completo, con RLS aplicado. Es la API que consumen sistemas externos. No se escribe: ya existe. |
| **Rutas en `src/pages/api/`** con `prerender = false` | Solo lógica: verificación de acceso, URLs firmadas y, más adelante, avance ponderado, SPI, CPI y valor ganado. |

El CRUD no se duplica en rutas propias.

### La plataforma vive en este mismo proyecto

`astro.config.mjs` ya declara `output: 'static'` con
`adapter: node({ mode: 'standalone' })`, y `src/pages/api/contacto.ts` corre
on-demand mediante `export const prerender = false`. Las rutas que necesitan
servidor lo declaran; el resto del sitio sigue estático.

### Ningún archivo de cliente entra al repositorio

El repositorio es público. Fotos, planos, informes y datos reales van a Supabase
Storage en bucket privado. Los datos de prueba se inventan. Ya hubo que purgar el
historial una vez por material sensible — ver `docs/confidencialidad-imagenes-proyectos.md`.

---

## Entrega 2 — Planificación (propuesta, no aprobada)

Diseño elaborado el 25 de agosto y desplazado al acotar el alcance inicial. Se
conserva porque la decisión de fondo sigue siendo válida.

### El árbol de WBS

El `DESIGN-SPEC.md` modela la WBS como tres niveles fijos codificados en el string
del código (`'4'` → `'4.1'` → `'4.1.2'`). El requisito real es más rico: hitos,
tareas y subtareas, cada una con responsable, fechas y duración.

La propuesta es **un único árbol auto-referencial** en lugar de tres tablas o de
tres niveles fijos:

```
wbs_nodos
  id, proyecto_id, padre_id  ← se apunta a sí misma; define la jerarquía
  codigo, nombre, tipo       ← entregable | paquete | hito | tarea | subtarea
  peso, avance, estado
  inicio, fin, duracion
  base_inicio, base_fin      ← línea base
  responsable_id, orden
```

Razones:

- El spec exige que *"un solo array alimente la vista WBS, el Gantt y el avance por fase — nunca se duplica la estructura"*. Un árbol lo cumple literalmente.
- Un hito es un nodo con duración cero. No necesita tabla propia.
- Un cuarto nivel de desglose es una fila más, no una migración de esquema.
- El avance de un nodo padre se deriva de sus hijos ponderado por peso: una sola regla, válida en todos los niveles.

El campo `codigo` se conserva porque el spec lo muestra en la interfaz, pero **no
define la jerarquía**. Eso lo hace `padre_id`.

Sobre `peso`: es el porcentaje dentro del padre y los hijos de un mismo padre
deben sumar 100. Se valida al leer, no con una restricción de tabla — durante la
edición de una WBS los pesos pasan por estados intermedios que no suman 100, y una
restricción los bloquearía.

### Tablas que acompañan

| Tabla | Columnas |
|---|---|
| `cortes` | `id`, `proyecto_id`, `fecha`, `etiqueta` |
| `avances` | `id`, `wbs_nodo_id`, `corte_id`, `avance`, `nota`, `unique (wbs_nodo_id, corte_id)` |
| `evm` | `proyecto_id`, `corte_id`, `pv`, `ev`, `ac`, PK compuesta |

El histórico de avance vive en `avances`; `wbs_nodos.avance` guarda el valor
vigente para no recalcular el último corte en cada lectura.

### Visibilidad por proyecto

La configuración del paso 5 del flujo de administración no es una decisión de
interfaz. Si un proyecto tiene apagado el valor ganado, la tabla `evm` no devuelve
filas a ese cliente: la política de RLS consulta `proyecto_visibilidad.config`
además de la empresa.

---

## Referencias

- `design-system/referencia/DESIGN-SPEC.md` — §6b portal de cliente, §6c administración.
- `design-system/MAPEO-ASTRO.md` — qué existe hoy en `src/` y dónde va lo nuevo.
- `docs/despliegue-dokploy.md` — despliegue actual en `balerion`.
