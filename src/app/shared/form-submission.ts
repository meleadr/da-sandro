export interface MailEnv {
  readonly RESEND_API_KEY?: string;
  readonly MAIL_FROM?: string;
  readonly MAIL_TO?: string;
}

export interface HandlerResult {
  readonly status: number;
  readonly body: { readonly ok: boolean; readonly errors?: unknown };
}

export type ParsedForm<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly errors: unknown };

export interface FormMail {
  readonly replyTo: string;
  readonly subject: string;
  readonly text: string;
}

const MAX_BODY_LENGTH = 10_000;
const RESEND_URL = 'https://api.resend.com/emails';

/** Server side of the site forms. It runs in a Cloudflare Pages Function. */
export async function handleFormSubmission<T>(
  rawBody: string,
  env: MailEnv,
  parse: (input: unknown) => ParsedForm<T>,
  toMail: (value: T) => FormMail,
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

  const parsed = parse(input);
  if (!parsed.ok) {
    return { status: 400, body: { ok: false, errors: parsed.errors } };
  }

  if (!env.RESEND_API_KEY || !env.MAIL_FROM || !env.MAIL_TO) {
    return { status: 503, body: { ok: false } };
  }

  const mail = toMail(parsed.value);
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
        reply_to: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
      }),
    });

    return response.ok ? { status: 200, body: { ok: true } } : { status: 502, body: { ok: false } };
  } catch {
    return { status: 502, body: { ok: false } };
  }
}
