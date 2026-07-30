// scripts/translate-proyectos.mjs
// Traduce las fichas de proyecto ES -> EN usando el gateway LLM (el mismo del
// chat). El español es la ÚNICA fuente; el inglés es un artefacto generado
// (se commitea) para que el build del server no dependa de la API key.
//
// - Cachea por hash de contenido: solo re-traduce lo que cambió.
// - Fuerza los campos no traducibles (sector, cliente, imágenes, orden…) al
//   valor original, aunque el LLM los toque.
//
// Uso: OPENROUTER_API_KEY=... node scripts/translate-proyectos.mjs [--force]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import yaml from 'js-yaml';

const SRC_DIR = 'src/content/proyectos';
const EN_DIR = path.join(SRC_DIR, 'en');
const CACHE_FILE = path.join(EN_DIR, '.translation-cache.json');

const BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://opencode.ai/zen/go/v1';
const MODEL = process.env.OPENROUTER_MODEL || 'deepseek-v4-flash';
const KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_TOKEN;
const FORCE = process.argv.includes('--force');

// Campos que NUNCA se traducen: se fuerzan al valor original. `ubicacion` y
// `cliente` son nombres propios (lugar/empresa) y se preservan en español.
const KEEP_FIELDS = ['sector', 'cliente', 'ubicacion', 'coverImage', 'gallery', 'order', 'destacado', 'fecha', 'slug'];

if (!KEY) {
  console.error('[translate] Falta OPENROUTER_API_KEY. No se puede traducir.');
  process.exit(1);
}

function sha(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function splitMdx(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('frontmatter no encontrado');
  return { data: yaml.load(m[1]) || {}, body: m[2] };
}

const SYSTEM = `You are a professional technical translator (industrial engineering, automation, electrical). Translate Astro MDX case studies from Spanish to English with precise, natural, professional wording.`;

function userPrompt(raw) {
  return `Translate the following Astro MDX case study from Spanish to English.

RULES:
1. Keep the frontmatter delimiters (---) and ALL field NAMES exactly as they are.
2. Translate ONLY these field VALUES: title, resumen, and the human-readable text in kpis[].label, kpis[].value, tecnologias[] and tags[]. Keep numbers, units, codes, standards and brand/product names unchanged (e.g. MVA, kvar, HP, kV, RETIE, PLC, SCADA, Allen Bradley, Siemens, MIOBOX).
3. Do NOT translate and keep byte-for-byte identical: sector, cliente, ubicacion, coverImage, gallery, order, destacado, fecha, slug.
4. Translate the Markdown body. Translate the section headings: "## Reto" -> "## Challenge", "## Intervención" -> "## Approach", "## Resultados" -> "## Results". Keep every technical value unchanged.
5. "resumen" MUST stay under 240 characters.
6. Return ONLY the translated MDX (frontmatter + body). No code fences, no commentary.

MDX:
${raw}`;
}

async function callLLM(raw) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: Number(process.env.OPENROUTER_MAX_TOKENS || 8000),
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userPrompt(raw) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  let text = json?.choices?.[0]?.message?.content || '';
  // Quitar posibles cercas de código.
  text = text.replace(/^```(?:mdx|markdown)?\s*\n/, '').replace(/\n```\s*$/, '').trim();
  return text;
}

// Reconstruye el MDX EN forzando los campos no traducibles al original.
function reconcile(srcData, translatedRaw) {
  const { data: tData, body } = splitMdx(translatedRaw);
  const finalData = { ...tData };
  for (const f of KEEP_FIELDS) {
    if (srcData[f] !== undefined) finalData[f] = srcData[f];
    else delete finalData[f];
  }
  // Salvaguarda del límite del schema (resumen <= 240).
  if (typeof finalData.resumen === 'string' && finalData.resumen.length > 240) {
    finalData.resumen = finalData.resumen.slice(0, 237).trimEnd() + '…';
  }
  const fm = yaml.dump(finalData, { lineWidth: -1, quotingType: '"', forceQuotes: false });
  return `---\n${fm}---\n\n${body.replace(/^\n+/, '')}`;
}

async function main() {
  fs.mkdirSync(EN_DIR, { recursive: true });
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch {}
  }

  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.mdx'));
  let translated = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const outPath = path.join(EN_DIR, file);
    const raw = fs.readFileSync(srcPath, 'utf8');
    const hash = sha(raw);

    if (!FORCE && cache[file] === hash && fs.existsSync(outPath)) {
      skipped++;
      continue;
    }

    try {
      const { data: srcData } = splitMdx(raw);
      const out = reconcile(srcData, await callLLM(raw));
      // Validación mínima: parsea y trae title + resumen.
      const check = splitMdx(out);
      if (!check.data.title || !check.data.resumen) throw new Error('faltan title/resumen en la traducción');
      fs.writeFileSync(outPath, out, 'utf8');
      cache[file] = hash;
      translated++;
      console.log(`[translate] ✓ ${file}`);
    } catch (e) {
      failed++;
      console.error(`[translate] ✗ ${file}: ${e.message}`);
    }
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  console.log(`[translate] listo: ${translated} traducidas, ${skipped} en caché, ${failed} con error.`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
