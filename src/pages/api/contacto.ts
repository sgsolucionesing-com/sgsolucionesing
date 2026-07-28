// src/pages/api/contacto.ts
// Endpoint on-demand (no prerender) que recibe el formulario de contacto y
// envía el lead por correo usando Resend. El resto del sitio sigue
// pre-renderizado como estático; ver astro.config.mjs.
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Resend } from 'resend';

export const prerender = false;

const CONTACT_TO = import.meta.env.CONTACT_TO ?? 'comercial.proyectos@sgsolucionesing.com';

// El dominio de este remitente debe estar verificado en Resend (registros
// DNS en Cloudflare) o el envío falla. Ver runbook de despliegue en el PR.
const CONTACT_FROM = import.meta.env.CONTACT_FROM ?? 'S&G Web <web@sgsolucionesing.com>';
const CONTACT_CC = import.meta.env.CONTACT_CC ?? 'gestion.ofertas@sgsolucionesing.com';

const contactoSchema = z.object({
  nombre: z.string().trim().min(2, 'Muy corto').max(120, 'Muy largo'),
  correo: z.string().trim().email('Correo inválido'),
  mensaje: z.string().trim().min(10, 'Muy corto').max(3000, 'Muy largo'),
  // Honeypot: los bots suelen completar todos los campos de un formulario.
  // Un humano nunca ve ni completa este campo (oculto vía CSS .hp).
  empresa_web: z.string().optional()
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'validation', issues: ['JSON inválido'] }, 400);
  }

  const parsed = contactoSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      { ok: false, error: 'validation', issues: parsed.error.flatten().fieldErrors },
      400
    );
  }

  // Honeypot completo: probablemente un bot. Respondemos éxito sin enviar
  // nada para no revelarle que fue detectado.
  if (parsed.data.empresa_web) {
    return json({ ok: true }, 200);
  }

  const { nombre, correo, mensaje } = parsed.data;

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      '[api/contacto] RESEND_API_KEY no está configurada. El formulario no puede enviar correos hasta cargarla.'
    );
    return json({ ok: false, error: 'config' }, 503);
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      cc: CONTACT_CC,
      replyTo: correo,
      subject: `Nuevo contacto web: ${nombre}`,
      text: `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`,
      html: `<p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
<p><strong>Correo:</strong> ${escapeHtml(correo)}</p>
<p><strong>Mensaje:</strong></p>
<p>${escapeHtml(mensaje).replace(/\n/g, '<br />')}</p>`
    });

    if (error) {
      console.error('[api/contacto] Resend devolvió un error al enviar:', error);
      return json({ ok: false, error: 'send' }, 500);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[api/contacto] Error inesperado enviando el correo:', err);
    return json({ ok: false, error: 'send' }, 500);
  }
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
