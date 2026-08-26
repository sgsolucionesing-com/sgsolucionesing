# Entrega 1 — Clientes, proyectos y documentos

Diseño aprobado el 25 de agosto de 2026. Es la entrega activa.

Meta de la entrega: que un cliente de S&G pueda iniciar sesión y leer el informe
técnico de su proyecto, y que S&G administre desde un panel las empresas, los
stakeholders, los proyectos y los documentos que se les publican.

La gestión de proyectos según PMI —WBS, cronograma, avance, valor ganado— **no
entra acá**. Ver [`hoja-de-ruta.md`](hoja-de-ruta.md).

---

## 1. Alcance

### Entra

| # | Pieza |
|---|---|
| 1 | Página de ingreso |
| 2 | Portal de administración de S&G: empresas → stakeholders → proyectos → documentos |
| 3 | Portal de cliente: sus proyectos y los documentos publicados de cada uno |
| 4 | El informe `GDI-364-INF-008` portado al sistema Nocturne y accesible desde el portal |

### No entra

Generación de informes desde datos, WBS, cronograma, Gantt, curva S, valor ganado,
bitácora de actividades, registro fotográfico como vista propia, publicación de
casos de éxito, enlace de un solo uso y 2FA.

### La app guarda, no genera

Decisión explícita del 25 de agosto: los informes se siguen produciendo por fuera.
La aplicación los almacena, los versiona, los controla y los entrega al cliente.

---

## 2. Modelo de datos

Cinco tablas en el esquema `public`. Claves primarias `uuid` con
`gen_random_uuid()`, marcas de tiempo en `timestamptz`.

### 2.1 `empresas` — el cliente

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `nombre` | text | obligatorio |
| `nit` | text | obligatorio, único |
| `sector`, `ciudad`, `contacto`, `correo`, `telefono` | text | |
| `estado` | text | `pendiente` \| `activa` \| `inactiva`, por defecto `pendiente` |
| `creada_en` | timestamptz | `now()` |

Nace `pendiente`; pasa a `activa` cuando tiene al menos un stakeholder y un
proyecto. Sin empresa no se puede crear ni un stakeholder ni un proyecto.

### 2.2 `perfiles` — los stakeholders

Uno a uno con `auth.users` de Supabase. Las credenciales las administra Supabase;
acá vive el resto.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK, `references auth.users(id) on delete cascade` |
| `empresa_id` | uuid | `references empresas(id)`. **`null` identifica al personal de S&G.** |
| `nombre` | text | obligatorio |
| `cargo` | text | |
| `rol` | text | `sg_admin` \| `sg_gestor` \| `cliente_lectura` \| `cliente_aprobador` \| `cliente_admin` |
| `estado` | text | `invitado` \| `activo` \| `inactivo`, por defecto `invitado` |
| `creado_en` | timestamptz | `now()` |

Un stakeholder pertenece a **una sola** empresa. No hay registro público: las
altas las hace S&G.

### 2.3 `proyectos`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `codigo` | text | obligatorio, único. Formato `GDI-364`. |
| `empresa_id` | uuid | obligatorio, `references empresas(id)` |
| `titulo` | text | obligatorio |
| `descripcion` | text | |
| `sector`, `ubicacion`, `servicio`, `responsable` | text | `responsable` es de S&G |
| `estado` | text | `planeado` \| `en_ejecucion` \| `suspendido` \| `cerrado`, por defecto `planeado` |
| `inicio`, `fin` | date | |
| `creado_en` | timestamptz | `now()` |

### 2.4 `proyecto_contactos` — quién ve qué

| Columna | Tipo | Notas |
|---|---|---|
| `proyecto_id` | uuid | PK compuesta, `on delete cascade` |
| `usuario_id` | uuid | PK compuesta, `references perfiles(id) on delete cascade` |
| `rol_proyecto` | text | `contacto_principal` \| `contacto_tecnico` \| `aprobador` \| `solo_lectura` |

**Esta tabla es la que decide el acceso.** Pertenecer a la empresa no alcanza: hay
que ser contacto del proyecto. Un trigger impide asignar un stakeholder cuya
empresa no sea la del proyecto — no se confía en la interfaz para eso.

### 2.5 `documentos`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `proyecto_id` | uuid | obligatorio, `on delete cascade` |
| `nombre` | text | obligatorio |
| `descripcion` | text | |
| `tipo` | text | `informe` \| `plano` \| `acta` \| `certificado` \| `otro` |
| `referencia` | text | referencia documental. Ej. `GDI-364-INF-008` |
| `version` | text | ej. `008` |
| `reemplaza_a` | uuid | `references documentos(id)`. Al fijarlo, el documento apuntado pasa a `obsoleto`. |
| `fecha_emision` | date | |
| `estado` | text | `borrador` \| `vigente` \| `obsoleto`, por defecto `borrador` |
| `storage_path` | text | ruta en el bucket privado |
| `mime`, `tamano_bytes` | text, bigint | |
| `publicado` | boolean | por defecto `false` |
| `subido_por` | uuid | `references perfiles(id)` |
| `creado_en` | timestamptz | `now()` |

Sobre `version` y `reemplaza_a`: hoy no se genera nada, pero el informe de
referencia ya declara *"INF-008 reemplaza INF-007"*. Es control de documentos de
PMI. Agregarlo hoy no cuesta nada; agregarlo con documentos ya cargados cuesta una
migración de datos.

Sobre `publicado`: **subir no es publicar.** Un documento cargado permanece
invisible para el cliente hasta que S&G lo publica de forma explícita.

---

## 3. Archivos — los 452 MB

El material del proyecto de referencia son 262 archivos y 452 MB: 191 fotos,
45 videos, planos y el informe. Eso define dónde viven las cosas:

- **Ni en la base de datos ni en el repositorio.** Van a Supabase Storage, bucket privado `documentos`. En la base solo queda `storage_path`.
- **El repositorio es público.** Ningún archivo de cliente entra a git: ni como ejemplo, ni como fixture, ni como semilla. Los datos de prueba se inventan.
- Ruta en el bucket: `proyectos/{proyecto_id}/{documento_id}/{nombre_archivo}`.

### 3.1 Cómo se entrega un documento

Nunca por enlace directo ni por bucket público. El flujo es:

1. El cliente pide el documento desde el portal.
2. Una ruta de Astro con `prerender = false` verifica la sesión.
3. Verifica que ese usuario sea contacto del proyecto y que el documento esté `publicado` y no `obsoleto`.
4. Recién ahí genera una URL firmada de vida corta (5 minutos) contra Storage.

Un enlace permanente a un HTML confidencial es una filtración con fecha diferida.

---

## 4. Aislamiento — Row Level Security

RLS activo en las cinco tablas. El aislamiento lo impone Postgres, no la
aplicación: una consulta mal escrita queda cortada igual.

Dos funciones auxiliares, `security definer` y `stable`:

```sql
-- Empresa del usuario autenticado; null si es personal de S&G
create function empresa_del_usuario() returns uuid ...

-- Verdadero si el usuario pertenece a S&G (perfiles.empresa_id is null)
create function es_staff() returns boolean ...
```

| Tabla | Lectura permitida a |
|---|---|
| `empresas` | staff, o el usuario cuya `empresa_id` coincide |
| `perfiles` | staff, o perfiles de la misma empresa |
| `proyectos` | staff, o proyectos donde el usuario figura en `proyecto_contactos` |
| `proyecto_contactos` | staff, o las filas del propio usuario |
| `documentos` | staff, o documentos `publicado = true` y `estado <> 'obsoleto'` de proyectos donde el usuario es contacto |

La escritura queda restringida a `es_staff()` en toda la entrega.

> Del `DESIGN-SPEC`, enunciado dos veces: el filtrado ocurre en servidor. Los datos
> que un cliente no debe ver no viajan a su navegador. Ocultar con CSS no es
> seguridad.

---

## 5. Rutas

Todas bajo `export const prerender = false`. El sitio público sigue estático.

| Ruta | Quién | Qué |
|---|---|---|
| `/ingresar` | público | Ingreso con correo y contraseña |
| `/admin/empresas` | staff | Listado y alta de empresas |
| `/admin/stakeholders` | staff | Listado y alta, filtrado por empresa |
| `/admin/proyectos` | staff | Listado y alta |
| `/admin/proyectos/[id]` | staff | Ficha, contactos asignados y documentos |
| `/portal` | cliente | Sus proyectos |
| `/portal/proyectos/[id]` | cliente | Ficha y documentos publicados |
| `/api/documentos/[id]/url` | ambos | Devuelve la URL firmada tras verificar el acceso |

Tras ingresar, el destino depende del perfil: `perfiles.empresa_id is null` va a
`/admin`, el resto a `/portal`.

---

## 6. Interfaz

Todo en Nocturne, según el `DESIGN-SPEC` y lo inventariado en
[`../../design-system/MAPEO-ASTRO.md`](../../design-system/MAPEO-ASTRO.md):

- Tokens desde `tailwind.config.js` (`bg-ink`, `text-teal-700`, `font-cond`). Nunca hex a mano.
- Títulos en Barlow Condensed uppercase; cuerpo en Barlow. Teal como único acento.
- Gramática blueprint (`.bp` con marcas de registro `+`) para toda superficie de datos, según §6b del spec.
- Componentes nuevos en `src/components/admin/` y `src/components/portal/`; capa de estilo en `src/styles/panel.css`, **encima** de `nocturne.css`, no en paralelo.
- Patrón de tabla obligatorio del spec §6c: barra con buscador y contador, tabla con estado vacío explícito, y paginador. Nunca una tabla vacía muda.
- Toda creación ocurre en un modal, no en formulario embebido.

### 6.1 Modo claro y oscuro

El panel lo requiere (§6b del spec) y hoy no existe en el sitio: cero ocurrencias
de `data-theme` y `--surface`. Esta entrega introduce la capa de tokens semánticos
descrita en §2 del spec y el `ThemeToggle` con script sin parpadeo en el `<head>`.

Se aplica **solo al panel y al portal**. Migrar el sitio público al modo oscuro es
trabajo aparte y no entra acá.

---

## 7. El informe portado a Nocturne

El informe hoy trae su propia hoja de estilo: `--primary: #1BA39C`, `--dark: #2b2f36`
y `Segoe UI`. Cerca del teal de S&G (`#00a79d`), pero no es Nocturne.

**No se retoca a mano.** Sus clases ya son regulares y se repiten: `finding-card`
(29 veces), `day-head` (6), `gallery` (12), `tag` (76), `stat`, `plano-block`,
`imgwrap`. Entonces:

1. Se escribe `informe-nocturne.css`: una hoja que mapea esas clases al sistema Nocturne.
2. Se reemplaza el bloque de estilo embebido del informe por esa hoja.
3. Cualquier informe futuro con las mismas clases hereda el estilo sin retoque.

Retocarlo a mano significa volver a retocar el siguiente.

**Estado: hecho.** La hoja vive en `src/styles/informe-nocturne.css` y se verifica
contra `design-system/muestras/informe.html`, que usa datos ficticios. Al portar
se corrigieron dos cosas que el estilo original violaba del spec: el gradiente
decorativo del hero (ahora fondo sólido con marca de esquina teal) y las esquinas
redondeadas (el sistema es recto). El token `--dark-block` resuelve que los
bloques estructuralmente oscuros —hero, banner de confidencialidad, encabezado de
tabla— no se fundan con el fondo en modo oscuro: son `ink` sobre papel y `navy`
sobre fondo oscuro.

El informe portado **no se versiona en el repositorio**: es material de cliente.
Se regenera con el guion de porte cuando haga falta.

El HTML conserva sus 94 imágenes en base64 y sus 12,6 MB. Carga lento, pero
funciona y no depende de la red. Cuando exista un segundo informe, conviene
extraer las imágenes a Storage; no en esta entrega.

---

## 8. Entregables y criterios de aceptación

| # | Entregable | Se acepta cuando |
|---|---|---|
| 1 | Supabase desplegado | Responde, con versión fijada en el compose y **respaldo automático configurado y restaurado una vez a modo de prueba**. |
| 2 | Esquema en `supabase/migrations/` | Una base vacía llega al esquema completo ejecutando las migraciones en orden. Lo que no está en una migración, no existe. |
| 3 | RLS en las cinco tablas | Prueba automatizada: un stakeholder de la empresa A **no puede leer** el proyecto ni el documento de la empresa B, consultando PostgREST directo. **Sin esta prueba en verde, la entrega no cierra.** |
| 4 | Ingreso | Un `sg_admin` y un `cliente_lectura` inician sesión y caen cada uno en su portal. La sesión sobrevive a la recarga. |
| 5 | Admin | Se crea una empresa, un stakeholder, un proyecto, se asigna el contacto y se sube un documento, en ese orden y desde la interfaz. |
| 6 | Publicación | Un documento sin publicar **no aparece** en el portal del cliente. Al publicarlo, aparece. |
| 7 | Entrega del archivo | El cliente abre el informe. La URL firmada caduca a los 5 minutos y deja de servir. Un usuario que no es contacto del proyecto recibe 403. |
| 8 | Informe en Nocturne | El informe se ve con tokens y tipografía de S&G, en claro y en oscuro. |

---

## 9. Riesgos

| Riesgo | Mitigación |
|---|---|
| Un archivo de cliente termina en el repositorio público | Ningún archivo real entra a git. Los datos de prueba se inventan. Ya hubo que purgar el historial una vez por esto. |
| El servidor no tiene memoria para los trece contenedores de Supabase más la landing | Medir antes de desplegar. Es un bloqueo, no un ajuste posterior. |
| Fuga de datos entre empresas | RLS en la base con prueba automatizada. |
| Un enlace a un documento se comparte y queda accesible | URL firmada de 5 minutos, generada tras verificar sesión y pertenencia. Nunca un enlace permanente. |
| Pérdida de documentos de clientes | El respaldo es entregable, con restauración de prueba. |

---

## 10. Bloqueo operativo abierto

El MCP de Dokploy conectado corresponde a la instancia de MIOBOX, no a la de S&G:
`project.all` devuelve únicamente `MIOBOX - DEMO - FARMACIA`, y una búsqueda de
`landing` no arroja resultados. **Hace falta acceso a la instancia de `balerion`,
o que S&G despliegue Supabase y entregue las credenciales.**

---

## 11. Referencias

- `design-system/referencia/DESIGN-SPEC.md` — §6b portal, §6c administración.
- `design-system/MAPEO-ASTRO.md` — qué existe hoy en `src/`.
- `docs/despliegue-dokploy.md` — despliegue actual en `balerion`.
- `docs/confidencialidad-imagenes-proyectos.md` — antecedente de material sensible.
