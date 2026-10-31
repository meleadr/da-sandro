import { EventRequest, parseEventRequest } from './event-request';

export interface MailEnv {
  readonly RESEND_API_KEY?: string;
  readonly MAIL_FROM?: string;
  readonly MAIL_TO?: string;
}

export interface HandlerResult {
  readonly status: number;
  readonly body: { readonly ok: boolean; readonly errors?: unknown };
}

const MAX_BODY_LENGTH = 10_000;
const RESEND_URL = 'https://api.resend.com/emails';

function mailText(request: EventRequest): string {
  return [
    "Nouvelle demande d'événement depuis le site :",
    '',
    `Type : ${request.eventType}`,
    `Date : ${request.date}`,
    `Lieu : ${request.location}`,
    `Personnes : ${request.guests}`,
    '',
    `Nom : ${request.name}`,
    `E-mail : ${request.email}`,
    `Téléphone : ${request.phone || 'non renseigné'}`,
    '',
    'Message :',
    request.message || '(aucun)',
  ].join('\n');
}

/** Server side of the event form. It runs in a Cloudflare Pages Function. */
export async function handleEventRequest(
  rawBody: string,
  env: MailEnv,
  today: string,
  send: typeof fetch = fetch,
): Promise<HandlerResult> {
  if (rawBody.length > MAX_BODY_LENGTH) {
    return { status: 413, body: { ok: false } };
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { ok: false } };
  }

  // Only bots fill in this hidden field: pretend it worked and send nothing.
  const honeypot = (input as { website?: unknown } | null)?.website;
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { status: 200, body: { ok: true } };
  }

  const parsed = parseEventRequest(input, today);
  if (!parsed.ok) {
    return { status: 400, body: { ok: false, errors: parsed.errors } };
  }

  if (!env.RESEND_API_KEY || !env.MAIL_FROM || !env.MAIL_TO) {
    return { status: 503, body: { ok: false } };
  }

  const request = parsed.value;
  try {
    const response = await send(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [env.MAIL_TO],
        reply_to: request.email,
        subject: `Demande d'événement : ${request.eventType} le ${request.date}`,
        text: mailText(request),
      }),
    });

    return response.ok ? { status: 200, body: { ok: true } } : { status: 502, body: { ok: false } };
  } catch {
    return { status: 502, body: { ok: false } };
  }
}
