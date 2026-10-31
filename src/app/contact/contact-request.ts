import { FormMail } from '../shared/form-submission';

export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export type ContactRequestErrors = Partial<Record<keyof ContactRequest, string>>;

export type ContactParseResult =
  | { readonly ok: true; readonly value: ContactRequest }
  | { readonly ok: false; readonly errors: ContactRequestErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SHORT_TEXT = 200;
const MAX_MESSAGE = 2000;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Validates a message in the browser and on the server, with the same rules. */
export function parseContactRequest(input: unknown): ContactParseResult {
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const name = text(raw['name']);
  const email = text(raw['email']);
  const message = text(raw['message']);
  const errors: ContactRequestErrors = {};

  if (name.length === 0 || name.length > MAX_SHORT_TEXT) {
    errors.name = 'Indiquez votre nom.';
  }
  if (!EMAIL.test(email) || email.length > MAX_SHORT_TEXT) {
    errors.email = 'Indiquez une adresse e-mail valide.';
  }
  if (message.length === 0) {
    errors.message = 'Écrivez votre message.';
  } else if (message.length > MAX_MESSAGE) {
    errors.message = 'Ce message est trop long.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, value: { name, email, message } };
}

export function contactMail(request: ContactRequest): FormMail {
  return {
    replyTo: request.email,
    subject: 'Nouveau message depuis le site',
    text: [
      'Nouveau message depuis le site :',
      '',
      `Nom : ${request.name}`,
      `E-mail : ${request.email}`,
      '',
      'Message :',
      request.message,
    ].join('\n'),
  };
}
