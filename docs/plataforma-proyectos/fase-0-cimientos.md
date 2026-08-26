# Fase 0 — Cimientos

Diseño aprobado el 25 de agosto de 2026.

Primera de las cinco entregas de la plataforma de proyectos de S&G. Define la
base de datos, el aislamiento entre clientes, la superficie de API y el ingreso
del personal interno. No incluye ninguna pantalla del panel.

---

## 1. Contexto

El sitio corporativo es una landing pública pre-renderizada. Lo que se construye
acá es una aplicación distinta: empresas, usuarios, credenciales, y datos que un
cliente no puede ver del otro.

`astro.config.mjs` ya declara `output: 'static'` con
`adapter: node({ mode: 'standalone' })`, y `src/pages/api/contacto.ts` corre
on-demand mediante `export const prerender = false`. La plataforma vive en este
mismo proyecto: las rutas que necesitan servidor lo declaran, y el resto del
sitio sigue siendo estático.

### Las cinco entregas

| # | Entrega | Depende de |
|---|---|---|
| **0** | **Cimientos** — base de datos, modelo, API, login interno | — |
| 1 | Admin pasos 1–3: Empresas → Usuarios → Proyectos | 0 |
| 2 | Planificación: WBS, hitos, tareas y subtareas | 1 |
| 3 | Admin pasos 4–5: Contactos y Visibilidad | 1, 2 |
| 4 | Portal de cliente: cartera, avance, Gantt, curva S, documentos | 3 |

---

## 2. Decisiones

### 2.1 Supabase self-hosted en Dokploy

Aporta Postgres, autenticación (contraseña, enlace de un solo uso, 2FA) y Row
Level Security sin salir de la infraestructura propia. Dokploy tiene template
oficial (`Dokploy/templates/blueprints/supabase`), que levanta trece servicios:
`db`, `auth`, `rest`, `realtime`, `storage`, `kong`, `studio`, `supavisor`,
`imgproxy`, `meta`, `functions`, `db-config`, `deno-cache`.

Consecuencias operativas asumidas:

- Aproximadamente 4 GB de RAM como piso y 8 GB para operar con holgura, conviviendo con la landing en el mismo servidor. **Verificar la memoria disponible en `balerion` antes de desplegar.**
- El self-hosted no trae respaldo gestionado. El backup se configura en esta misma fase, no después.
- Las actualizaciones son manuales y pueden romper entre versiones. Fijar versión en el compose y actualizar de forma deliberada.

### 2.2 Dos superficies de API

| Superficie | Qué resuelve |
|---|---|
| **PostgREST** (automático de Supabase) | El CRUD completo, con RLS aplicado. Es la API que consumen sistemas externos. No se escribe: ya existe. |
| **Rutas en `src/pages/api/`** con `prerender = false` | Solo cálculo: avance ponderado, SPI, CPI, curva S, valor ganado. Lógica que merece código versionado y con pruebas. |

El CRUD no se duplica en rutas propias. Si una operación es un `insert`, un
`update` o un `select`, va por PostgREST.

### 2.3 El árbol de WBS

El `DESIGN-SPEC.md` modela la WBS como tres niveles fijos codificados en el
string del código (`'4'` → `'4.1'` → `'4.1.2'`). El requisito real es más rico:
hitos, tareas y subtareas, cada una con responsable, fechas y duración.

Se adopta **un único árbol auto-referencial** (`wbs_nodos.padre_id`) en lugar de
tres tablas o de tres niveles fijos:

- El spec exige que *"un solo array alimente la vista WBS, el Gantt y el avance por fase — nunca se duplica la estructura"*. Un árbol lo cumple literalmente.
- Un hito es un nodo con duración cero. No necesita tabla propia.
- Un cuarto nivel de desglose es una fila más, no una migración de esquema.
- El avance de un nodo padre se deriva de sus hijos ponderado por peso: una sola regla, válida en todos los niveles.

El campo `codigo` (`'4.1.2'`) se conserva porque el spec lo muestra en la interfaz,
pero **no es el que define la jerarquía**. La jerarquía la define `padre_id`.

---

## 3. Modelo de datos

Todas las tablas viven en el esquema `public`. Claves primarias `uuid` con
`gen_random_uuid()`. Marcas de tiempo en `timestamptz`.

### 3.1 `empresas`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `nombre` | text | obligatorio |
| `nit` | text | obligatorio, único |
| `sector`, `ciudad`, `contacto`, `correo`, `telefono` | text | |
| `estado` | text | `pendiente` \| `activa` \| `inactiva`, por defecto `pendiente` |
| `creada_en` | timestamptz | `now()` |

Nace `pendiente` y pasa a `activa` cuando tiene al menos un usuario y un proyecto
(regla del paso 1 del flujo de administración).

### 3.2 `perfiles`

Relación uno a uno con `auth.users` de Supabase. Las credenciales las administra
Supabase; acá vive todo lo demás.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK, `references auth.users(id) on delete cascade` |
| `empresa_id` | uuid | `references empresas(id)`. **`null` identifica al personal de S&G.** |
| `nombre` | text | obligatorio |
| `cargo` | text | |
| `rol` | text | `sg_admin` \| `sg_gestor` \| `cliente_lectura` \| `cliente_aprobador` \| `cliente_admin` |
| `estado` | text | `invitado` \| `activo` \| `inactivo`, por defecto `invitado` |
| `dos_pasos` | boolean | por defecto `false` |
| `ultimo_ingreso` | timestamptz | |

Un usuario pertenece a **una sola** empresa. No hay registro público: las altas
las hace S&G.

### 3.3 `proyectos`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `codigo` | text | obligatorio, único. Formato `SG-2026-014`. |
| `empresa_id` | uuid | obligatorio, `references empresas(id)` |
| `titulo` | text | obligatorio |
| `sector`, `ubicacion`, `servicio`, `fase_actual`, `responsable` | text | `responsable` es de S&G |
| `estado` | text | `planeado` \| `en_ejecucion` \| `suspendido` \| `cerrado`, por defecto `planeado` |
| `inicio`, `fin` | date | |
| `bac` | numeric | presupuesto a la conclusión |
| `publicar_como_caso` | boolean | por defecto `false`. Al cerrar, habilita generar el caso de éxito público. |
| `creado_en` | timestamptz | `now()` |

### 3.4 `wbs_nodos`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `proyecto_id` | uuid | obligatorio, `on delete cascade` |
| `padre_id` | uuid | `references wbs_nodos(id) on delete cascade`. `null` = raíz. **Define la jerarquía.** |
| `codigo` | text | obligatorio. Único por proyecto. Se muestra en la interfaz; no define jerarquía. |
| `nombre` | text | obligatorio |
| `tipo` | text | `entregable` \| `paquete` \| `hito` \| `tarea` \| `subtarea` |
| `peso` | numeric | porcentaje **dentro de su padre**. Los hijos de un mismo padre deben sumar 100. Se valida al leer, no con una restricción de tabla: durante la edición de una WBS los pesos pasan por estados intermedios que no suman 100, y una restricción los bloquearía. La API de cálculo reporta el desbalance. |
| `avance` | numeric | 0–100. Solo se escribe en nodos hoja; en los padres se calcula. |
| `estado` | text | `''` \| `done` \| `risk` |
| `inicio`, `fin` | date | plan vigente |
| `duracion` | integer | días |
| `base_inicio`, `base_fin` | date | línea base. Si son nulos, se asume igual al plan vigente. |
| `responsable_id` | uuid | `references perfiles(id)` |
| `orden` | integer | orden entre hermanos |

Restricciones: `unique (proyecto_id, codigo)`; un nodo `hito` tiene `duracion = 0`;
`padre_id` debe pertenecer al mismo `proyecto_id`.

### 3.5 `proyecto_contactos`

| Columna | Tipo | Notas |
|---|---|---|
| `proyecto_id` | uuid | PK compuesta |
| `usuario_id` | uuid | PK compuesta, `references perfiles(id)` |
| `rol_proyecto` | text | `contacto_principal` \| `contacto_tecnico` \| `aprobador` \| `solo_lectura` |

Solo se pueden asignar usuarios cuya empresa coincida con la del proyecto. Se
impone con un trigger, no solo en la interfaz.

### 3.6 `proyecto_visibilidad`

| Columna | Tipo | Notas |
|---|---|---|
| `proyecto_id` | uuid | PK, `references proyectos(id) on delete cascade` |
| `config` | jsonb | los cuatro grupos de banderas del paso 5 |
| `actualizada_en` | timestamptz | |

Ausencia de fila significa "valores por defecto". Por defecto **valor ganado, CPI
y montos en pesos están apagados**.

### 3.7 `cortes`, `avances`, `evm`

| Tabla | Columnas |
|---|---|
| `cortes` | `id`, `proyecto_id`, `fecha` (obligatoria), `etiqueta` |
| `avances` | `id`, `wbs_nodo_id` (cascade), `corte_id` (cascade), `avance` numeric, `nota` text, `unique (wbs_nodo_id, corte_id)` |
| `evm` | `proyecto_id`, `corte_id`, `pv`, `ev`, `ac` numeric, PK compuesta `(proyecto_id, corte_id)` |

El histórico de avance vive en `avances`. El campo `wbs_nodos.avance` es el valor
vigente, para no recalcular el último corte en cada lectura.

### 3.8 `documentos` y `actividades`

| Tabla | Columnas |
|---|---|
| `documentos` | `id`, `proyecto_id` (cascade), `nombre`, `tipo`, `version`, `fecha`, `estado` (`vigente` \| `en_revision` \| `obsoleto`), `storage_path`, `subido_por` |
| `actividades` | `id`, `proyecto_id` (cascade), `wbs_nodo_id`, `fecha`, `titulo`, `detalle`, `responsable` |

---

## 4. Aislamiento — Row Level Security

**RLS activo en todas las tablas, sin excepción.** El aislamiento lo impone la
base de datos, no el código de la aplicación: si una consulta se escribe sin
filtro, Postgres la corta igual.

Dos funciones auxiliares, ambas `security definer` y `stable`:

```sql
-- Empresa del usuario autenticado; null si es personal de S&G
create function empresa_del_usuario() returns uuid ...

-- Verdadero si el usuario autenticado pertenece a S&G (perfiles.empresa_id is null)
create function es_staff() returns boolean ...
```

Política base, replicada en cada tabla ajustando el camino hasta `empresa_id`:

```sql
create policy proyectos_lectura on proyectos for select
  using (es_staff() or empresa_id = empresa_del_usuario());
```

Para `wbs_nodos`, `documentos`, `actividades`, `cortes`, `avances` y `evm` la
condición navega hasta `proyectos.empresa_id`. La escritura queda restringida a
`es_staff()` en esta fase.

### 4.1 La visibilidad también se filtra en la base

La configuración del paso 5 no es una decisión de interfaz. Si un proyecto tiene
apagado el valor ganado, **la tabla `evm` no devuelve filas a ese cliente**. La
política de `evm` consulta `proyecto_visibilidad.config` además de la empresa.

> Del spec, enunciado dos veces: el filtrado ocurre en servidor. Los datos que un
> cliente no debe ver no viajan a su navegador. Ocultar con CSS no es seguridad.

---

## 5. Autenticación en esta fase

Solo ingreso del personal de S&G, con correo y contraseña de Supabase Auth:
mínimo 12 caracteres, validado en cliente y servidor. Sesión en cookie
`HttpOnly`, `Secure`, `SameSite=Lax`, con rotación de token al iniciar sesión.

El enlace de un solo uso, la 2FA y el flujo de invitación son de la Fase 1, que es
cuando entran los usuarios de cliente.

Existen **usuarios de cliente en la base** desde esta fase, creados por el seed a
través de la API de administración de Supabase Auth. No tienen pantalla por dónde
entrar todavía, pero sí credenciales — y son los que hacen posible probar el
aislamiento del criterio 3. Que no exista el flujo de invitación no significa que
no existan usuarios contra los cuales verificar RLS.

Las credenciales de conexión (`SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`) se declaran en `env.example` sin valores y se
inyectan como variables de entorno en Dokploy. La clave de servicio **nunca**
llega al navegador: solo la usan las rutas con `prerender = false`.

---

## 6. Entregables y criterios de aceptación

| # | Entregable | Se acepta cuando |
|---|---|---|
| 1 | Supabase desplegado en Dokploy | Responde, con versión fijada en el compose y **respaldo automático configurado y restaurado una vez a modo de prueba**. |
| 2 | Esquema como migraciones versionadas en `supabase/migrations/` | Una base vacía llega al esquema completo ejecutando las migraciones en orden. Ningún cambio hecho a mano en Studio: lo que no está en una migración, no existe. |
| 3 | RLS en todas las tablas | Existe una prueba automatizada que confirma que un usuario de la empresa A **no puede leer** el proyecto de la empresa B, en lectura directa por PostgREST. **Si esa prueba no pasa, la fase no se cierra.** |
| 4 | Login del personal de S&G | Un usuario `sg_admin` inicia y cierra sesión, y la sesión persiste entre recargas. |
| 5 | `GET /api/proyectos/[id]/avance` | Devuelve el avance ponderado calculado desde el árbol de WBS, con prueba unitaria sobre la función de cálculo. |
| 6 | Seed de datos | Los datos de demostración del prototipo (`design-system/referencia/portal-data.js` y `portal-admin-data.js`) cargados, para trabajar la Fase 1 contra datos reales. |

---

## 7. Fuera de alcance

No entra en esta fase: ninguna pantalla del panel ni del portal, el enlace de un
solo uso, la 2FA, el flujo de invitación, la carga de documentos a Storage, el
cálculo de curva S y EVM (solo se define el modelo que los sostiene), y la
publicación de casos de éxito.

---

## 8. Riesgos

| Riesgo | Mitigación |
|---|---|
| El servidor no tiene memoria para trece contenedores más la landing | Medir antes de desplegar. Si no alcanza, ampliar el servidor o mover la landing. Es un bloqueo, no un ajuste posterior. |
| Pérdida de datos de proyectos de clientes | El respaldo es entregable de esta fase, con una restauración de prueba. Sin eso, la fase no se cierra. |
| Una actualización de Supabase rompe el stack | Versión fijada en el compose. Actualizaciones deliberadas, con respaldo previo. |
| Fuga de datos entre empresas | RLS en la base, no en la aplicación, con prueba automatizada que lo verifica. |

---

## 9. Referencias

- `design-system/referencia/DESIGN-SPEC.md` — §6b portal de cliente, §6c administración.
- `design-system/MAPEO-ASTRO.md` — qué existe hoy en `src/` y dónde va lo nuevo.
- `docs/despliegue-dokploy.md` — despliegue actual en `balerion`.
