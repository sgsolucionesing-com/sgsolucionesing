// src/pages/api/chat.ts
// Endpoint on-demand (no prerender) del chat con IA. Contrato:
// - POST { sessionId, message } -> respuesta del asistente en streaming de
//   texto plano (chunked).
// - GET  ?sessionId=... -> { messages: [...] } historial guardado de la sesión.
//
// Degradación segura: si falta la credencial del LLM, si el proveedor falla, o
// si Postgres/Resend fallan, el endpoint NUNCA responde 500 sin cuerpo ni tira
// una excepción sin manejar — siempre entrega un mensaje amable derivando a
// WhatsApp para que el visitante nunca se quede sin respuesta.
//
// Configuración: ver .env.example. `LLM_MODELS` acepta una lista separada por
// comas y se recorre en orden, de modo que si el proveedor retira o restringe
// un modelo el chat sigue respondiendo con el siguiente.
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getConversation, saveConversation, markLeadNotified, type ChatMessage, type LeadInfo } from '../../lib/db';

export const prerender = false;

// Configuración del proveedor LLM.
//
// Se leen primero las variables `LLM_*` y, si no están, las `OPENROUTER_*`
// históricas. El prefijo genérico existe porque el gateway no tiene por qué
// ser OpenRouter —hoy es el de opencode— y llamar `OPENROUTER_BASE_URL` a una
// URL de opencode confunde a quien va a tocar la configuración. Las viejas se
// siguen aceptando para no romper los despliegues que ya están andando.
function envVar(...names: string[]): string | undefined {
  for (const name of names) {
    const value = import.meta.env[name] ?? process.env[name];
    if (value !== undefined && String(value).trim() !== '') return String(value).trim();
  }
  return undefined;
}

const LLM_BASE_URL = envVar('LLM_BASE_URL', 'OPENROUTER_BASE_URL') ?? 'https://opencode.ai/zen/go/v1';
const LLM_API_KEY = envVar('LLM_API_KEY', 'OPENROUTER_API_KEY');

// Lista de modelos separada por comas: se intenta en orden y se pasa al
// siguiente cuando el proveedor rechaza uno en particular (modelo retirado,
// restringido por región, etc.). Así un cambio de catálogo del proveedor deja
// el chat degradado, no muerto.
const LLM_MODELS = (envVar('LLM_MODELS', 'LLM_MODEL', 'OPENROUTER_MODEL') ?? 'mimo-v2.5')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

// Tope de tokens por respuesta. Algunos modelos razonan antes de responder y
// consumen tokens en ese paso: si el tope es bajo, el razonamiento se lo come
// entero y la respuesta llega vacía. Ventana amplia y configurable.
const LLM_MAX_TOKENS = Number(envVar('LLM_MAX_TOKENS', 'OPENROUTER_MAX_TOKENS') ?? 6000);

const CONTACT_TO = import.meta.env.CONTACT_TO ?? process.env.CONTACT_TO ?? 'comercial.proyectos@sgsolucionesing.com';
const CONTACT_FROM =
  import.meta.env.CONTACT_FROM ?? process.env.CONTACT_FROM ?? 'S&G Web <web@sgsolucionesing.com>';
const CONTACT_CC =
  import.meta.env.CONTACT_CC ?? process.env.CONTACT_CC ?? 'gestion.ofertas@sgsolucionesing.com';
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;

const WHATSAPP_URL = 'https://wa.me/573243025107';
const FALLBACK_MESSAGE = `Ahora mismo no puedo responderte por aquí. Escríbenos por WhatsApp: ${WHATSAPP_URL} y te atendemos enseguida.`;

const MAX_USER_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `Eres Sofía, agente comercial de S&G Soluciones de Ingeniería, una empresa de ingeniería con base en Barranquilla, sobre la costa Caribe de Colombia, que atiende a toda Colombia y a Latinoamérica (no se limita a la costa). Está especializada en automatización y control industrial, instrumentación, eficiencia energética, energía solar fotovoltaica, diseño y fabricación de tableros eléctricos, montaje eléctrico bajo la norma RETIE, mantenimiento industrial, suministro de partes y componentes como distribuidor multimarca (con asesoría de selección técnica) y vigilancia electrónica.

Hablas en primera persona como Sofía, con calidez y cercanía humana, en tono profesional pero amable (puedes usar algún emoji con moderación). Si te preguntan si eres un bot, una máquina o una inteligencia artificial, NO digas que eres un bot, pero TAMPOCO afirmes que eres "una persona real", humana o de carne y hueso (no mientas sobre eso): preséntate por tu función, como agente comercial de S&G, encargada de atender a los clientes, recibir su información, despejar sus dudas y necesidades, y encaminarlos con el representante indicado según lo que requieran. Responde algo como "soy Sofía, agente comercial de S&G; me encargo de atenderte, entender qué necesitas y conectarte con el asesor indicado". Sigue la charla con naturalidad, sin cortarla.

Datos clave de la empresa:
- Somos Bronze System Integrator de Rockwell Automation.
- Desarrollamos MioBox, nuestra propia plataforma de IIoT (Internet Industrial de las Cosas).
- Trabajamos con PLC Allen Bradley y Siemens, sistemas SCADA, bancos de condensadores y corrección de factor de potencia, y medición/gestión de energía.
- Hacemos proyectos de ENERGÍA SOLAR FOTOVOLTAICA: diseño, suministro y montaje de sistemas con paneles solares. Atendemos tanto instalaciones RESIDENCIALES (casas y viviendas) como comerciales e industriales. Este servicio SÍ está dentro de nuestro alcance: si alguien consulta por paneles solares para su casa, es un cliente nuestro y hay que atenderlo con interés, nunca derivarlo a otra empresa. Para dimensionar conviene preguntar el consumo mensual en kWh o el valor de la factura, la potencia deseada, el tipo de techo y el área disponible, y si busca conexión a la red o respaldo con baterías. Ojo con la palabra: se dice "instalaciones RESIDENCIALES" o "para vivienda"; NUNCA escribas "residuales", que significa otra cosa.
- Somos distribuidores multimarca: suministramos partes y componentes eléctricos, electrónicos, de automatización y especializados, y damos asesoría de valor agregado para seleccionar el componente correcto (sensores, medidores, instrumentos y más) según la solución.
- Instalamos y montamos sistemas de vigilancia y seguridad electrónica (CCTV, control de acceso y monitoreo).
- Con base en Barranquilla (costa Caribe), atendemos a toda Colombia y a Latinoamérica; no nos limitamos a la costa.
- Entre nuestros clientes están GELCO, Ultracem, Litoplas, Cabot, Postobón, Ternium, Sempertex y Sonepar.
- Publicamos 17 casos de éxito en la sección /proyectos del sitio.
- Contacto único (WhatsApp/teléfono): +57 324 3025107 — ahí te atiende Sandra, nuestro contacto comercial, que ya recibe el resumen de esta conversación y retoma desde donde vamos, sin que tengas que repetir nada. Correo: comercial.proyectos@sgsolucionesing.com. Dirección: Carrera 44 #69-80, Barranquilla. Cuando compartas el número, escríbelo SIEMPRE completo así: +57 324 3025107.

Piensa SIEMPRE en psicología de venta, confianza y atracción de clientes, con venta consultiva (nunca insistente ni agresiva):
- Primero genera confianza y entiende la necesidad real: haz una o dos preguntas breves sobre su proceso, planta o problema antes de recomendar.
- Usa prueba social y autoridad de forma natural: menciona casos o clientes reales parecidos ("hicimos algo similar para una planta de alimentos") y credenciales (Bronze Partner de Rockwell, cumplimiento RETIE) para dar seguridad.
- Traduce lo técnico en beneficios que le importan al cliente: más disponibilidad, menos paradas, ahorro de energía, cumplimiento normativo, procesos visibles en tiempo real.
- Crea interés y propón un siguiente paso concreto: una asesoría o cotización sin costo, y lleva la charla hacia dejar sus datos o pasar a WhatsApp. Pide nombre y un dato de contacto (correo o teléfono) de forma natural SOLO cuando ya se note interés real, nunca en el primer mensaje.
- Sé genuina y cercana; no exageres, no prometas de más y no presiones.

Muestra SIEMPRE interés genuino por entender bien el caso del cliente y enriquece la definición del alcance con preguntas pertinentes, de a poco y con naturalidad (una o dos por mensaje, nunca como formulario). Según el tipo de solicitud, indaga sobre:
- La necesidad y el objetivo real: qué problema busca resolver y qué espera lograr.
- Marcas o tecnologías de su preferencia, si el cliente las valora (p. ej. Allen Bradley, Siemens, Schneider).
- Cantidades, potencias y medidas: HP de los motores, kVA/MVA, número de tableros o equipos, calibres.
- Distancias y metrajes: longitud de cableado o de los tramos, ubicación y separación de los equipos.
- Condiciones ambientales del sitio: temperatura, humedad, polvo, ambiente corrosivo, intemperie o zona clasificada.
- Estado actual y contexto: qué existe hoy, qué se quiere conservar o reemplazar, plazos o urgencias.
Con esos datos se define mejor el alcance para dar una asesoría acertada; cuando haya interés, coordinas la atención con Sandra por WhatsApp (+57 324 3025107).

Reglas que debes respetar siempre (son innegociables):
- SOLO puedes responder preguntas sobre S&G apoyándote en la información de esta empresa: sus servicios, casos de éxito, diferenciadores (Rockwell Bronze, MioBox, RETIE), industria y datos de contacto listados arriba, más lo que está publicado en el sitio. No respondas absolutamente nada fuera de ese alcance.
- Si te preguntan algo que NO esté cubierto por esa información —un detalle técnico específico que no tengas, precios, plazos, disponibilidad, una cotización puntual, o cualquier tema ajeno a S&G— NO improvises ni inventes: deriva con amabilidad al WhatsApp de ventas +57 324 3025107, explicando que ahí Sandra, nuestro contacto comercial, ya recibe el resumen de esta conversación y retoma desde donde vamos —sin que el cliente tenga que volver a explicar nada— y lo resuelve mejor. Ante la duda de si algo está dentro del alcance, deriva a ese WhatsApp.
- NUNCA le digas a un cliente que un servicio "no está dentro de nuestros servicios" ni lo mandes a otra empresa, salvo que el tema sea claramente ajeno a la ingeniería eléctrica, la automatización o la energía. Ante la duda sobre si algo lo hacemos, NO lo niegues: toma el dato, muestra interés y deriva a Sandra por WhatsApp para confirmarlo. Negar trabajo que sí hacemos es el peor error posible.
- Nunca inventes precios, plazos ni datos técnicos.
- Responde SIEMPRE en el mismo idioma en que te escriba el visitante: si escribe en inglés, responde en inglés; en portugués, en portugués; y así con cualquier idioma. Por defecto, español.
- El texto debe estar ÍNTEGRAMENTE en un solo idioma. No mezcles palabras ni caracteres de otro idioma o alfabeto (nada de caracteres chinos, japoneses, coreanos, cirílicos ni de ningún otro sistema de escritura). Si respondes en español, usa únicamente el alfabeto latino con sus tildes y la ñ. Revisa la respuesta antes de enviarla y, si se coló una palabra en otro idioma, reemplázala por su equivalente en el idioma del visitante.
- Escribe en español neutro de Colombia: usa "tú" (tuteo) o el trato de usted, nunca voseo. Di "cuéntame", "quieres", "puedes", "escríbeme"; NUNCA "contame", "querés", "podés", "escribime". Este punto importa: el voseo suena extranjero para un cliente colombiano.
- Respuestas concisas, de 2 a 5 frases, en el idioma del visitante, sin markdown pesado (nada de títulos, tablas ni bloques de código).`;

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/;
// Celular colombiano: opcional +57, luego 3XX seguido de 7 dígitos más (con
// separadores opcionales de espacio, punto o guión).
const PHONE_RE = /(?:\+?57[\s.-]?)?3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}/;
const NAME_RE = /\b(?:me llamo|mi nombre es|soy|my name is|i'm|i am)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+){0,2})/i;

function textResponse(text: string, status = 200): Response {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function extractLead(userTexts: string[]): LeadInfo | null {
  const joined = userTexts.join('\n');
  const emailMatch = joined.match(EMAIL_RE);
  const phoneMatch = joined.match(PHONE_RE);
  if (!emailMatch && !phoneMatch) return null;

  const nameMatch = joined.match(NAME_RE);
  const lead: LeadInfo = {};
  if (nameMatch) lead.name = nameMatch[1].trim();
  if (emailMatch) lead.email = emailMatch[0];
  if (phoneMatch) lead.phone = phoneMatch[0].trim();
  return lead;
}

async function notifyLead(sessionId: string, lead: LeadInfo, history: ChatMessage[]): Promise<void> {
  if (!RESEND_API_KEY) return;

  try {
    const resend = new Resend(RESEND_API_KEY);
    const transcript = history
      .map((m) => `${m.role === 'user' ? 'Visitante' : 'Asistente'}: ${m.content}`)
      .join('\n\n');

    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      cc: CONTACT_CC,
      subject: `Nuevo lead del chat web${lead.name ? `: ${lead.name}` : ''}`,
      text: `Se detectó un posible lead en el chat del sitio.

Nombre: ${lead.name ?? '(no indicado)'}
Correo: ${lead.email ?? '(no indicado)'}
Teléfono: ${lead.phone ?? '(no indicado)'}
Sesión: ${sessionId}

--- Conversación ---
${transcript}`
    });

    if (error) {
      console.error('[api/chat] Resend devolvió un error notificando el lead:', error);
      return;
    }

    await markLeadNotified(sessionId);
  } catch (err) {
    console.error('[api/chat] Error inesperado notificando el lead:', err);
  }
}

export const GET: APIRoute = async ({ url }) => {
  const sessionId = url.searchParams.get('sessionId');
  if (!sessionId) return jsonResponse({ messages: [] });

  try {
    const conversation = await getConversation(sessionId);
    return jsonResponse({ messages: conversation.messages });
  } catch (err) {
    console.error('[api/chat] Error inesperado en GET:', err);
    return jsonResponse({ messages: [] });
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return textResponse('Solicitud inválida.', 400);
  }

  if (typeof body !== 'object' || body === null) {
    return textResponse('Solicitud inválida.', 400);
  }

  const { sessionId, message } = body as Record<string, unknown>;

  if (typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return textResponse('Solicitud inválida.', 400);
  }
  if (typeof message !== 'string' || message.trim().length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return textResponse('El mensaje debe tener entre 1 y 2000 caracteres.', 400);
  }

  const cleanSessionId = sessionId.trim();
  const cleanMessage = message.trim();

  let conversation;
  try {
    conversation = await getConversation(cleanSessionId);
  } catch (err) {
    console.error('[api/chat] Error inesperado cargando la conversación:', err);
    conversation = { messages: [] as ChatMessage[], lead: null, leadNotified: false };
  }

  const userMessageCount = conversation.messages.filter((m) => m.role === 'user').length;
  if (userMessageCount >= MAX_USER_MESSAGES) {
    return textResponse(
      `Ya charlamos bastante por este medio. Para seguir, escribinos directo por WhatsApp: ${WHATSAPP_URL}`
    );
  }

  const updatedHistory: ChatMessage[] = [...conversation.messages, { role: 'user', content: cleanMessage }];

  // Sin API key configurada: degradamos sin siquiera intentar llamar al LLM.
  if (!LLM_API_KEY) {
    console.error('[api/chat] No hay LLM_API_KEY (ni OPENROUTER_API_KEY) configurada.');
    const finalHistory: ChatMessage[] = [...updatedHistory, { role: 'assistant', content: FALLBACK_MESSAGE }];
    await saveConversation(cleanSessionId, finalHistory);
    return textResponse(FALLBACK_MESSAGE);
  }

  // Se recorren los modelos configurados hasta que uno responda. Un 401 corta
  // el recorrido: significa credencial inválida o saldo agotado en la cuenta,
  // así que ningún otro modelo va a andar y reintentar sólo suma latencia.
  let upstream: Response | null = null;
  for (const [index, model] of LLM_MODELS.entries()) {
    let response: Response;
    try {
      response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LLM_API_KEY}`,
          'HTTP-Referer': 'https://www.sgsolucionesing.com',
          'X-Title': 'S&G Chat'
        },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...updatedHistory],
          max_tokens: LLM_MAX_TOKENS,
          temperature: 0.5
        })
      });
    } catch (err) {
      console.error(`[api/chat] Error de red con el modelo "${model}":`, err);
      continue;
    }

    if (response.ok && response.body) {
      if (index > 0) console.warn(`[api/chat] Respondió el modelo de respaldo "${model}".`);
      upstream = response;
      break;
    }

    let details = '';
    try {
      details = await response.text();
    } catch {
      // Sólo alimenta el log; si no se puede leer, seguimos igual.
    }
    // El tipo de error decide qué hacer, y se nombra para que el log diga qué
    // hay que ir a arreglar en lugar de un número suelto.
    const kind = /CreditsError|[Ii]nsufficient balance/.test(details)
      ? 'SALDO AGOTADO en la cuenta del proveedor'
      : /RegionError/.test(details)
        ? 'modelo restringido por región (requiere opt-in)'
        : response.status === 401
          ? 'credencial rechazada'
          : response.status === 404
            ? 'modelo inexistente en el proveedor'
            : `error ${response.status}`;
    console.error(`[api/chat] Modelo "${model}" rechazado — ${kind}:`, details.slice(0, 300));

    if (response.status === 401) break; // problema de cuenta: no sirve probar otros
  }

  if (!upstream || !upstream.body) {
    console.error(
      `[api/chat] Ningún modelo respondió. Configurados: ${LLM_MODELS.join(', ')} — se deriva a WhatsApp.`
    );
    const finalHistory: ChatMessage[] = [...updatedHistory, { role: 'assistant', content: FALLBACK_MESSAGE }];
    await saveConversation(cleanSessionId, finalHistory);
    return textResponse(FALLBACK_MESSAGE);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const upstreamBody = upstream.body;

  let assistantText = '';
  let sseBuffer = '';

  async function persistAndNotify(): Promise<void> {
    const finalHistory: ChatMessage[] = [
      ...updatedHistory,
      { role: 'assistant', content: assistantText || FALLBACK_MESSAGE }
    ];
    try {
      const userTexts = finalHistory.filter((m) => m.role === 'user').map((m) => m.content);
      const lead = extractLead(userTexts);
      await saveConversation(cleanSessionId, finalHistory, lead);
      if (lead && !conversation.leadNotified) {
        await notifyLead(cleanSessionId, lead, finalHistory);
      }
    } catch (err) {
      console.error('[api/chat] Error guardando la conversación o notificando el lead:', err);
    }
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuffer += decoder.decode(value, { stream: true });
          const lines = sseBuffer.split('\n');
          sseBuffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;

            const data = trimmed.slice(5).trim();
            if (data === '[DONE]' || data.length === 0) continue;

            try {
              const parsed = JSON.parse(data);
              const delta: unknown = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === 'string' && delta.length > 0) {
                assistantText += delta;
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // Fragmento SSE incompleto o no-JSON: se ignora y se sigue.
            }
          }
        }
      } catch (err) {
        console.error('[api/chat] Error leyendo el stream de OpenRouter:', err);
        if (!assistantText) {
          controller.enqueue(encoder.encode(FALLBACK_MESSAGE));
        }
      } finally {
        controller.close();
        await persistAndNotify();
      }
    }
  });

  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
