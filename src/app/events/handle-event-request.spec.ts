import { vi } from 'vitest';
import type { MailEnv } from '../shared/form-submission';
import { parseEventRequest } from './event-request';
import { handleEventRequest } from './handle-event-request';

const TODAY = '2026-11-01';
const ENV: MailEnv = {
  RESEND_API_KEY: 'test-key',
  MAIL_FROM: 'Da Sandro <site@example.be>',
  MAIL_TO: 'owner@example.be',
};

const valid = {
  eventType: 'Mariage',
  date: '2026-12-12',
  location: 'Liège',
  guests: '80',
  name: 'Jeanne Dupont',
  email: 'jeanne@example.be',
  phone: '',
  message: 'Bonjour',
};

function okSender() {
  return vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 200 }));
}

describe('parseEventRequest', () => {
  it('accepts a complete request and converts the guest count', () => {
    const result = parseEventRequest(valid, TODAY);

    expect(result).toMatchObject({ ok: true, value: { guests: 80 } });
  });

  it('accepts a request for today', () => {
    expect(parseEventRequest({ ...valid, date: TODAY }, TODAY).ok).toBe(true);
  });

  it('reports every missing required field', () => {
    const result = parseEventRequest({}, TODAY);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual([
        'date',
        'email',
        'eventType',
        'guests',
        'location',
        'name',
      ]);
    }
  });

  it('refuses a past date', () => {
    expect(parseEventRequest({ ...valid, date: '2026-10-01' }, TODAY)).toMatchObject({
      ok: false,
      errors: { date: 'Cette date est déjà passée.' },
    });
  });

  it('refuses an impossible date', () => {
    expect(parseEventRequest({ ...valid, date: '2026-02-31' }, TODAY).ok).toBe(false);
  });

  it('refuses a guest count that is not a whole number', () => {
    expect(parseEventRequest({ ...valid, guests: '12.5' }, TODAY).ok).toBe(false);
  });

  it('refuses an e-mail containing a line break', () => {
    expect(parseEventRequest({ ...valid, email: 'a@b.be\nBcc: x@y.be' }, TODAY).ok).toBe(false);
  });
});

describe('handleEventRequest', () => {
  it('sends the mail with a reply-to and no secret in the body', async () => {
    const send = okSender();

    const result = await handleEventRequest(JSON.stringify(valid), ENV, TODAY, send);

    expect(result).toEqual({ status: 200, body: { ok: true } });
    const init = send.mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(init.body as string);
    expect(payload).toMatchObject({ to: ['owner@example.be'], reply_to: 'jeanne@example.be' });
    expect(payload.text).toContain('Personnes : 80');
    expect(init.body).not.toContain('test-key');
  });

  it('accepts a filled honeypot silently, without sending', async () => {
    const send = okSender();
    const body = JSON.stringify({ ...valid, website: 'https://spam.example' });

    const result = await handleEventRequest(body, ENV, TODAY, send);

    expect(result.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('refuses invalid data without sending', async () => {
    const send = okSender();

    const result = await handleEventRequest('{}', ENV, TODAY, send);

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('refuses malformed JSON', async () => {
    expect((await handleEventRequest('nope', ENV, TODAY, okSender())).status).toBe(400);
  });

  it('refuses an oversized body', async () => {
    const body = 'x'.repeat(10_001);

    expect((await handleEventRequest(body, ENV, TODAY, okSender())).status).toBe(413);
  });

  it('reports a missing configuration', async () => {
    const result = await handleEventRequest(JSON.stringify(valid), {}, TODAY, okSender());

    expect(result.status).toBe(503);
  });

  it('reports a refusal from the mail service', async () => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 422 }));

    const result = await handleEventRequest(JSON.stringify(valid), ENV, TODAY, send);

    expect(result.status).toBe(502);
  });

  it('reports a network failure', async () => {
    const send = vi.fn<typeof fetch>().mockRejectedValue(new Error('down'));

    const result = await handleEventRequest(JSON.stringify(valid), ENV, TODAY, send);

    expect(result.status).toBe(502);
  });
});
