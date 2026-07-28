// src/lib/db.ts
// Persistencia de conversaciones del chat en Postgres. Si DATABASE_URL no
// está configurada, todas las funciones se comportan como no-op (devuelven
// vacío / no hacen nada) para que el chat siga funcionando sin memoria
// persistente en vez de romper el sitio.
import pg from 'pg';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LeadInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface StoredConversation {
  messages: ChatMessage[];
  lead: LeadInfo | null;
  leadNotified: boolean;
}

const connectionString = import.meta.env.DATABASE_URL ?? process.env.DATABASE_URL;

const pool: pg.Pool | null = connectionString ? new pg.Pool({ connectionString }) : null;

if (pool) {
  // Un cliente idle que tira error no debe tumbar el proceso Node.
  pool.on('error', (err) => {
    console.error('[db] Error inesperado en un cliente Postgres idle:', err);
  });
}

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!pool) return Promise.resolve();
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS chat_conversations (
          session_id text PRIMARY KEY,
          messages jsonb NOT NULL DEFAULT '[]',
          lead jsonb,
          lead_notified boolean NOT NULL DEFAULT false,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        );`
      )
      .then(() => undefined)
      .catch((err: unknown) => {
        console.error('[db] No se pudo asegurar el esquema de chat_conversations:', err);
        // Si falló, permitimos reintentar en el próximo request en vez de
        // quedar "rota" para siempre hasta reiniciar el proceso.
        schemaReady = null;
      });
  }
  return schemaReady;
}

export async function getConversation(sessionId: string): Promise<StoredConversation> {
  const empty: StoredConversation = { messages: [], lead: null, leadNotified: false };
  if (!pool) return empty;

  try {
    await ensureSchema();
    const { rows } = await pool.query(
      'SELECT messages, lead, lead_notified FROM chat_conversations WHERE session_id = $1',
      [sessionId]
    );
    if (rows.length === 0) return empty;

    const row = rows[0] as { messages: unknown; lead: unknown; lead_notified: boolean };
    return {
      messages: Array.isArray(row.messages) ? (row.messages as ChatMessage[]) : [],
      lead: (row.lead as LeadInfo | null) ?? null,
      leadNotified: Boolean(row.lead_notified)
    };
  } catch (err) {
    console.error('[db] Error leyendo la conversación:', err);
    return empty;
  }
}

export async function saveConversation(
  sessionId: string,
  messages: ChatMessage[],
  lead?: LeadInfo | null
): Promise<void> {
  if (!pool) return;

  try {
    await ensureSchema();
    await pool.query(
      `INSERT INTO chat_conversations (session_id, messages, lead, updated_at)
       VALUES ($1, $2::jsonb, $3::jsonb, now())
       ON CONFLICT (session_id)
       DO UPDATE SET
         messages = EXCLUDED.messages,
         lead = COALESCE(EXCLUDED.lead, chat_conversations.lead),
         updated_at = now()`,
      [sessionId, JSON.stringify(messages), lead ? JSON.stringify(lead) : null]
    );
  } catch (err) {
    console.error('[db] Error guardando la conversación:', err);
  }
}

export async function markLeadNotified(sessionId: string): Promise<void> {
  if (!pool) return;

  try {
    await ensureSchema();
    await pool.query(
      'UPDATE chat_conversations SET lead_notified = true, updated_at = now() WHERE session_id = $1',
      [sessionId]
    );
  } catch (err) {
    console.error('[db] Error marcando el lead como notificado:', err);
  }
}
