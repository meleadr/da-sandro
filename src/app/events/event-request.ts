export const EVENT_TYPES = ['Mariage', 'Anniversaire', 'Entreprise', 'Autre'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface EventRequest {
  readonly eventType: EventType;
  /** YYYY-MM-DD */
  readonly date: string;
  readonly location: string;
  readonly guests: number;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly message: string;
}

export type EventRequestErrors = Partial<Record<keyof EventRequest, string>>;

export type ParseResult =
  | { readonly ok: true; readonly value: EventRequest }
  | { readonly ok: false; readonly errors: EventRequestErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_GUESTS = 5000;
const MAX_SHORT_TEXT = 200;
const MAX_MESSAGE = 2000;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isRealDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/**
 * Validates a request in the browser and on the server, with the same rules.
 * `today` is YYYY-MM-DD.
 */
export function parseEventRequest(input: unknown, today: string): ParseResult {
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const errors: EventRequestErrors = {};

  const eventType = text(raw['eventType']) as EventType;
  const date = text(raw['date']);
  const location = text(raw['location']);
  const name = text(raw['name']);
  const email = text(raw['email']);
  const phone = text(raw['phone']);
  const message = text(raw['message']);
  const guests = Number(text(String(raw['guests'] ?? '')) || NaN);

  if (!EVENT_TYPES.includes(eventType)) {
    errors.eventType = "Choisissez le type d'événement.";
  }
  if (!DATE.test(date) || !isRealDate(date)) {
    errors.date = 'Indiquez la date.';
  } else if (date < today) {
    errors.date = 'Cette date est déjà passée.';
  }
  if (location.length === 0 || location.length > MAX_SHORT_TEXT) {
    errors.location = 'Indiquez le lieu.';
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    errors.guests = 'Indiquez le nombre de personnes.';
  }
  if (name.length === 0 || name.length > MAX_SHORT_TEXT) {
    errors.name = 'Indiquez votre nom.';
  }
  if (!EMAIL.test(email) || email.length > MAX_SHORT_TEXT) {
    errors.email = 'Indiquez une adresse e-mail valide.';
  }
  if (phone.length > MAX_SHORT_TEXT) {
    errors.phone = 'Ce numéro est trop long.';
  }
  if (message.length > MAX_MESSAGE) {
    errors.message = 'Ce message est trop long.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, value: { eventType, date, location, guests, name, email, phone, message } };
}
