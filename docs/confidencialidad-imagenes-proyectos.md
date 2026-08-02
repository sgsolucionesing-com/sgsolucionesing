# Confidencialidad de las imágenes de proyectos

## Por qué existe esta regla

Las fotos de los casos de éxito se toman dentro de las plantas de los clientes. Una foto de un tablero es material comercial legítimo; una foto de una pantalla de operador puede exponer datos del cliente que no nos corresponde publicar: su marca, sus parámetros de proceso, sus órdenes de producción o la topología de su red industrial.

El criterio es simple: **la web muestra nuestro trabajo, no la operación del cliente.**

## Qué no se publica

Antes de agregar una imagen a `public/assets/images/proyectos/`, se descarta si contiene:

1. **Pantallas SCADA o HMI en primer plano.** Muestran el logo del cliente, el mímico de su proceso y sus valores de operación (temperaturas por zona, presiones, kg/h, torque, setpoints). Es la receta de producción del cliente.
2. **Capturas de software de ingeniería** (Studio 5000, TIA Portal y similares). Exponen direcciones IP de la red OT, rutas de controlador, estructura del programa y nombres de tags. Es información directamente aprovechable por un atacante.
3. **Documentos de planta legibles**: órdenes de producción, etiquetas de lote, listas de despacho. Pueden revelar el producto, los volúmenes e incluso el cliente final del cliente.
4. **Datos personales**: placas de vehículos, cédulas, rostros identificables de terceros, marcas de agua de cámara con nombres de personas. Ojo con los reflejos en vidrios y puertas de tablero.

Sí se publica sin problema: tableros, barrajes, canalizaciones, equipos de fabricante (Siemens, Allen-Bradley, Schneider), instrumentos de medición y personal propio con EPP.

## Cómo se retira información sensible

Hay dos tratamientos según qué tan central sea el dato en la foto:

- **Retirar la imagen** cuando lo sensible es el contenido completo (una pantalla SCADA no se salva tapando el logo: los valores siguen ahí).
- **Censurar la región** cuando la foto es valiosa y el dato sensible es acotado (una etiqueta, una placa, una marca de agua).

La censura debe ser **destructiva y quemada en el archivo**. No sirve taparlo con CSS, con un overlay ni con una capa de edición: quien descargue la imagen debe recibirla ya censurada, sin forma de revertirla.

El procedimiento aplicado reduce la región a unos pocos píxeles y la vuelve a escalar, lo que destruye el detalle original de forma irrecuperable:

```bash
# redacta una región de WxH en la posición +X+Y, sobre el archivo mismo
magick imagen.jpg -strip \
  \( +clone -crop "${W}x${H}+${X}+${Y}" +repage \
     -scale 4x4! -scale "${W}x${H}!" \) \
  -geometry "+${X}+${Y}" -composite \
  -quality 88 imagen.jpg
```

El `-strip` elimina además los metadatos EXIF, que pueden incluir coordenadas GPS de la planta.

Después de censurar hay que **verificar con un recorte ampliado** que no quedó texto legible en los bordes de la región: las marcas de agua y las etiquetas suelen tener una segunda línea que se escapa.

## Al retirar una imagen

- Si la imagen retirada era la portada (`coverImage`), se promueve otra foto limpia del mismo proyecto.
- Si no queda ninguna foto publicable, se usa una imagen institucional propia de `src/assets/images/` y la galería queda vacía. El caso de éxito se mantiene publicado con su texto, KPIs y resultados: se retira el material sensible, no el proyecto.
- Hay que actualizar las **dos** versiones del contenido: `src/content/proyectos/` y `src/content/proyectos/en/`.
- Una galería sin imágenes se escribe `gallery: []`. Dejar `gallery:` sin elementos la vuelve `null` y rompe la validación del esquema de contenido.

## Verificación antes de publicar

```bash
# 1. Ninguna referencia del contenido apunta a un archivo inexistente
refs=$(rg -o --no-filename '/assets/images/proyectos/[a-z0-9./-]+\.jpg' src/content | sort -u)
echo "$refs" | while read -r p; do [ -f "public$p" ] || echo "FALTA: $p"; done

# 2. Ninguna imagen queda en disco sin referencia
fd -e jpg . public/assets/images/proyectos | while read -r f; do
  echo "$refs" | rg -q -F "/${f#public/}" || echo "SIN REF: $f"
done

# 3. El sitio compila
npm run build
```
