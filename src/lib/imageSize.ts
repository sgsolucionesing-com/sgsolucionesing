// src/lib/imageSize.ts
// Lee las dimensiones intrínsecas de una imagen servida desde /public.
//
// Por qué existe: las imágenes del sitio viven en `public/` y se referencian con
// rutas absolutas, así que no pasan por `astro:assets` y Astro no puede inferir
// su tamaño. Sin `width`/`height` en el <img>, el navegador no sabe cuánto
// espacio reservar y el layout salta cuando la imagen llega — eso es CLS, y CLS
// es una de las tres Core Web Vitals que Google usa como señal de ranking.
//
// Se parsean las cabeceras a mano en lugar de usar `sharp` porque sharp llega
// como dependencia transitiva de Astro, no declarada en package.json: apoyarse
// en ella haría que el build dependa de un paquete que nadie prometió mantener
// ahí. JPEG, PNG, WebP y SVG cubren todo lo que el sitio publica hoy.
//
// Sólo corre en build (las páginas son prerenderizadas), así que leer del disco
// no tiene costo en tiempo de respuesta.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ImageSize {
  width: number;
  height: number;
}

// El resultado se memoiza: el mismo logo aparece en muchas páginas y el archivo
// no cambia durante un build.
const cache = new Map<string, ImageSize | null>();

function parsePng(buf: Buffer): ImageSize | null {
  // Firma PNG + chunk IHDR: ancho y alto son enteros de 32 bits big-endian.
  if (buf.length < 24) return null;
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function parseJpeg(buf: Buffer): ImageSize | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset < buf.length - 9) {
    if (buf[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buf[offset + 1];
    // SOF0..SOF15 llevan las dimensiones; se excluyen DHT (c4), JPG (c8) y DAC (cc),
    // que comparten rango pero no son marcadores de trama.
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    const segmentLength = buf.readUInt16BE(offset + 2);
    if (segmentLength < 2) return null;
    offset += 2 + segmentLength;
  }
  return null;
}

function parseWebp(buf: Buffer): ImageSize | null {
  if (buf.length < 30) return null;
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const format = buf.toString('ascii', 12, 16);
  if (format === 'VP8 ') {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (format === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (format === 'VP8X') {
    const w = buf[24] | (buf[25] << 8) | (buf[26] << 16);
    const h = buf[27] | (buf[28] << 8) | (buf[29] << 16);
    return { width: w + 1, height: h + 1 };
  }
  return null;
}

function parseSvg(buf: Buffer): ImageSize | null {
  // Sólo se leen los primeros 2 KB: el <svg> raíz siempre está ahí.
  const head = buf.toString('utf8', 0, Math.min(buf.length, 2048));
  const viewBox = head.match(/viewBox\s*=\s*["']\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (viewBox) {
    return { width: Math.round(Number(viewBox[1])), height: Math.round(Number(viewBox[2])) };
  }
  // El delimitador tiene que ser inicio o espacio, no `\b`: en `stroke-width`
  // el guion es un carácter no-palabra, así que `\bwidth` casaría con él y
  // devolvería el grosor del trazo como ancho de la imagen. El número exige al
  // menos un dígito, para que un `width="."` no produzca NaN.
  const NUM = String.raw`\d+(?:\.\d+)?`;
  const w = head.match(new RegExp(`(?:^|\\s)width\\s*=\\s*["'](${NUM})`, 'i'));
  const h = head.match(new RegExp(`(?:^|\\s)height\\s*=\\s*["'](${NUM})`, 'i'));
  if (!w || !h) return null;
  const width = Math.round(Number(w[1]));
  const height = Math.round(Number(h[1]));
  // Un 0 no describe nada y produciría un aspect-ratio inválido en el <img>.
  return width > 0 && height > 0 ? { width, height } : null;
}

/**
 * Dimensiones intrínsecas de una imagen de /public, o `null` si la ruta no es
 * local, el archivo no existe o el formato no se reconoce. Nunca lanza: una
 * imagen sin medir debe degradar a un <img> sin atributos, no romper el build.
 */
export function getImageSize(src: string | undefined): ImageSize | null {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return null;
  if (cache.has(src)) return cache.get(src)!;

  let size: ImageSize | null = null;
  try {
    // `src` viene de rutas absolutas del sitio; se resuelven contra public/.
    const path = join(process.cwd(), 'public', decodeURIComponent(src));
    const buf = readFileSync(path);
    size =
      parsePng(buf) ?? parseJpeg(buf) ?? parseWebp(buf) ?? parseSvg(buf) ?? null;
  } catch {
    size = null;
  }

  cache.set(src, size);
  return size;
}

/**
 * Atributos listos para hacer spread sobre un <img>: `{...imgSize(src)}`.
 * Devuelve un objeto vacío cuando no se pudo medir, de modo que el markup
 * quede exactamente como estaba antes.
 */
export function imgSize(src: string | undefined): Record<string, number> {
  const size = getImageSize(src);
  return size ? { width: size.width, height: size.height } : {};
}
