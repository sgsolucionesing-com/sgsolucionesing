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

const CONTACT_TO = import.meta.env.CONTACT_TO ?? process.env.CONTACT_TO ?? 'comercial.proyectos@sgsolucionesing.com';
const CONTACT_FROM =
  import.meta.env.CONTACT_FROM ?? process.env.CONTACT_FROM ?? 'S&G Web <web@sgsolucionesing.com>';
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;

const WHATSAPP_URL = 'https://wa.me/573006300658';
const FALLBACK_MESSAGE = `Ahora mismo no puedo responderte por acá. Escribinos por WhatsApp: ${WHATSAPP_URL} y te atendemos enseguida.`;

const MAX_USER_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `Sos el asistente virtual de S&G Soluciones de Ingeniería, una empresa de ingeniería con sede en Barranquilla, Colombia, especializada en automatización y control industrial, instrumentación, eficiencia energética, diseño y fabricación de tableros eléctricos, montaje eléctrico bajo la norma RETIE y mantenimiento industrial.

Datos clave de la empresa:
- Somos Bronze System Integrator de Rockwell Automation.
- Desarrollamos MioBox, nuestra propia plataforma de IIoT (Internet Industrial de las Cosas).
- Trabajamos con PLC Allen Bradley y Siemens, sistemas SCADA, bancos de condensadores y corrección de factor de potencia, y medición/gestión de energía.
- Atendemos principalmente la Región Caribe de Colombia.
- Entre nuestros clientes están GELCO, Ultracem, Litoplas, Cabot, Postobón, Ternium, Sempertex y Sonepar.
- Publicamos 17 casos de éxito en la sección /proyectos del sitio.
- Contacto: WhatsApp/teléfono +57 300 630 0658, correo comercial.proyectos@sgsolucionesing.com, Carrera 44 #69-80, Barranquilla.

Tu objetivo es atender a quien te escribe de forma cálida, humana y profesional: entendé qué necesita, recomendale el servicio o caso de éxito más relevante para su situación, y llevá la charla hacia una cotización o un contacto directo con el equipo. Pedí nombre y un dato de contacto (correo o teléfono) de forma natural, solo cuando ya se note interés real — nunca en el primer mensaje.

Reglas que debés respetar siempre:
- Hablá solo de S&G, sus servicios, sus casos de éxito y su industria (automatización, energía, tableros eléctricos, mantenimiento). Si te preguntan algo fuera de este tema, redirigí la charla amablemente hacia cómo podemos ayudar.
- Nunca inventes precios, plazos ni datos técnicos que no tengas certeza de conocer. Si no podés responder algo técnico con seguridad, ofrecé conectar con el equipo por WhatsApp: +57 300 630 0658.
- Respuestas concisas, de 2 a 5 frases, sin markdown pesado (nada de títulos, tablas ni bloques de código).`;

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
        max_tokens: 1500,
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
