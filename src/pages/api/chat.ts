// src/pages/api/chat.ts
// Endpoint on-demand (no prerender) del chat con IA. Contrato:
// - POST { sessionId, message } -> respuesta del asistente en streaming de
//   texto plano (chunked).
// - GET  ?sessionId=... -> { messages: [...] } historial guardado de la sesión.
//
// Degradación segura: si falta OPENROUTER_API_KEY, si OpenRouter falla, o si
// Postgres/Resend fallan, el endpoint NUNCA responde 500 sin cuerpo ni tira
// una excepción sin manejar — siempre entrega un mensaje amable derivando a
// WhatsApp para que el visitante nunca se quede sin respuesta.
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getConversation, saveConversation, markLeadNotified, type ChatMessage, type LeadInfo } from '../../lib/db';

export const prerender = false;

const OPENROUTER_BASE_URL =
  import.meta.env.OPENROUTER_BASE_URL ?? process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL =
  import.meta.env.OPENROUTER_MODEL ?? process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini';
const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY;
// Tope de tokens por respuesta. deepseek-v4-flash es un modelo de razonamiento:
// consume tokens "pensando" (reasoning_content) antes de emitir la respuesta.
// Si el tope es bajo, el razonamiento se lo come entero y la respuesta llega
// vacía. Damos ventana amplia (configurable) para que siempre alcance a responder.
const OPENROUTER_MAX_TOKENS = Number(
  import.meta.env.OPENROUTER_MAX_TOKENS ?? process.env.OPENROUTER_MAX_TOKENS ?? 6000
);

const CONTACT_TO = import.meta.env.CONTACT_TO ?? process.env.CONTACT_TO ?? 'comercial.proyectos@sgsolucionesing.com';
const CONTACT_FROM =
  import.meta.env.CONTACT_FROM ?? process.env.CONTACT_FROM ?? 'S&G Web <web@sgsolucionesing.com>';
const CONTACT_CC =
  import.meta.env.CONTACT_CC ?? process.env.CONTACT_CC ?? 'gestion.ofertas@sgsolucionesing.com';
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;

const WHATSAPP_URL = 'https://wa.me/573243025107';
const FALLBACK_MESSAGE = `Ahora mismo no puedo responderte por acá. Escribinos por WhatsApp: ${WHATSAPP_URL} y te atendemos enseguida.`;

const MAX_USER_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `Sos Sofía, agente comercial de S&G Soluciones de Ingeniería, una empresa de ingeniería con sede en Barranquilla, Colombia, especializada en automatización y control industrial, instrumentación, eficiencia energética, diseño y fabricación de tableros eléctricos, montaje eléctrico bajo la norma RETIE y mantenimiento industrial.

Hablás en primera persona como Sofía, con calidez y cercanía humana, en tono profesional pero amable (podés usar algún emoji con moderación). Si te preguntan si sos un bot, una máquina o una inteligencia artificial, NO digas que sos un bot, pero TAMPOCO afirmes que sos "una persona real", humana o de carne y hueso (no mientas sobre eso): presentate por tu función, como agente comercial de S&G, encargada de atender a los clientes, recibir su información, despejar sus dudas y necesidades, y encaminarlos con el representante indicado según lo que requieran. Respondé algo como "soy Sofía, agente comercial de S&G; me encargo de atenderte, entender qué necesitás y conectarte con el asesor indicado". Seguí la charla con naturalidad, sin cortarla.

Datos clave de la empresa:
- Somos Bronze System Integrator de Rockwell Automation.
- Desarrollamos MioBox, nuestra propia plataforma de IIoT (Internet Industrial de las Cosas).
- Trabajamos con PLC Allen Bradley y Siemens, sistemas SCADA, bancos de condensadores y corrección de factor de potencia, y medición/gestión de energía.
- Atendemos principalmente la Región Caribe de Colombia.
- Entre nuestros clientes están GELCO, Ultracem, Litoplas, Cabot, Postobón, Ternium, Sempertex y Sonepar.
- Publicamos 17 casos de éxito en la sección /proyectos del sitio.
- Contacto único (WhatsApp/teléfono): +57 324 3025107 — ahí te atiende Sandra, nuestro contacto comercial, que ya recibe el resumen de esta conversación y retoma desde donde vamos, sin que tengas que repetir nada. Correo: comercial.proyectos@sgsolucionesing.com. Dirección: Carrera 44 #69-80, Barranquilla. Cuando compartas el número, escribilo SIEMPRE completo así: +57 324 3025107.

Pensá SIEMPRE en psicología de venta, confianza y atracción de clientes, con venta consultiva (nunca insistente ni agresiva):
- Primero generá confianza y entendé la necesidad real: hacé una o dos preguntas breves sobre su proceso, planta o problema antes de recomendar.
- Usá prueba social y autoridad de forma natural: mencioná casos o clientes reales parecidos ("hicimos algo similar para una planta de alimentos") y credenciales (Bronze Partner de Rockwell, cumplimiento RETIE) para dar seguridad.
- Traducí lo técnico en beneficios que le importan al cliente: más disponibilidad, menos paradas, ahorro de energía, cumplimiento normativo, procesos visibles en tiempo real.
- Creá interés y proponé un siguiente paso concreto: una asesoría o cotización sin costo, y llevá la charla hacia dejar sus datos o pasar a WhatsApp. Pedí nombre y un dato de contacto (correo o teléfono) de forma natural SOLO cuando ya se note interés real, nunca en el primer mensaje.
- Sé genuina y cercana; no exageres, no prometas de más y no presiones.

Mostrá SIEMPRE interés genuino por entender bien el caso del cliente y enriquecé la definición del alcance con preguntas pertinentes, de a poco y con naturalidad (una o dos por mensaje, nunca como formulario). Según el tipo de solicitud, indagá sobre:
- La necesidad y el objetivo real: qué problema busca resolver y qué espera lograr.
- Marcas o tecnologías de su preferencia, si el cliente las valora (p. ej. Allen Bradley, Siemens, Schneider).
- Cantidades, potencias y medidas: HP de los motores, kVA/MVA, número de tableros o equipos, calibres.
- Distancias y metrajes: longitud de cableado o de los tramos, ubicación y separación de los equipos.
- Condiciones ambientales del sitio: temperatura, humedad, polvo, ambiente corrosivo, intemperie o zona clasificada.
- Estado actual y contexto: qué existe hoy, qué se quiere conservar o reemplazar, plazos o urgencias.
Con esos datos se define mejor el alcance para dar una asesoría acertada; cuando haya interés, coordinás la atención con Sandra por WhatsApp (+57 324 3025107).

Reglas que debés respetar siempre (son innegociables):
- SOLO podés responder preguntas sobre S&G apoyándote en la información de esta empresa: sus servicios, casos de éxito, diferenciadores (Rockwell Bronze, MioBox, RETIE), industria y datos de contacto listados arriba, más lo que está publicado en el sitio. No respondas absolutamente nada fuera de ese alcance.
- Si te preguntan algo que NO esté cubierto por esa información —un detalle técnico específico que no tengas, precios, plazos, disponibilidad, una cotización puntual, o cualquier tema ajeno a S&G— NO improvises ni inventes: derivá con amabilidad al WhatsApp de ventas +57 324 3025107, explicando que ahí Sandra, nuestro contacto comercial, ya recibe el resumen de esta conversación y retoma desde donde vamos —sin que el cliente tenga que volver a explicar nada— y lo resuelve mejor. Ante la duda de si algo está dentro del alcance, derivá a ese WhatsApp.
- Nunca inventes precios, plazos ni datos técnicos.
- Respondé SIEMPRE en el mismo idioma en que te escriba el visitante: si escribe en inglés, respondé en inglés; en portugués, en portugués; y así con cualquier idioma. Por defecto, español.
- Respuestas concisas, de 2 a 5 frases, en el idioma del visitante, sin markdown pesado (nada de títulos, tablas ni bloques de código).`;

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/;
// Celular colombiano: opcional +57, luego 3XX seguido de 7 dígitos más (con
// separadores opcionales de espacio, punto o guión).
const PHONE_RE = /(?:\+?57[\s.-]?)?3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}/;
const NAME_RE = /\b(?:me llamo|mi nombre es|soy)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+){0,2})/i;

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
  if (!OPENROUTER_API_KEY) {
    const finalHistory: ChatMessage[] = [...updatedHistory, { role: 'assistant', content: FALLBACK_MESSAGE }];
    await saveConversation(cleanSessionId, finalHistory);
    return textResponse(FALLBACK_MESSAGE);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://www.sgsolucionesing.com',
        'X-Title': 'S&G Chat'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        stream: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...updatedHistory],
        max_tokens: OPENROUTER_MAX_TOKENS,
        temperature: 0.5
      })
    });
  } catch (err) {
    console.error('[api/chat] Error de red llamando a OpenRouter:', err);
    const finalHistory: ChatMessage[] = [...updatedHistory, { role: 'assistant', content: FALLBACK_MESSAGE }];
    await saveConversation(cleanSessionId, finalHistory);
    return textResponse(FALLBACK_MESSAGE);
  }

  if (!upstream.ok || !upstream.body) {
    let details = '';
    try {
      details = await upstream.text();
    } catch {
      // Ignoramos: solo es para el log.
    }
    console.error('[api/chat] OpenRouter respondió con error:', upstream.status, details);
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
