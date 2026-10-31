import { vi } from 'vitest';
import { handleFormSubmission } from '../shared/form-submission';
import { contactMail, parseContactRequest } from './contact-request';

const ENV = {
  RESEND_API_KEY: 'test-key',
  MAIL_FROM: 'Da Sandro <site@example.be>',
  MAIL_TO: 'owner@example.be',
};
const valid = { name: 'Jeanne', email: 'jeanne@example.be', message: 'Bonjour' };

function submit(body: unknown, send: typeof fetch) {
  return handleFormSubmission(JSON.stringify(body), ENV, parseContactRequest, contactMail, send);
}

describe('parseContactRequest', () => {
  it('accepts a complete message', () => {
    expect(parseContactRequest(valid)).toEqual({ ok: true, value: valid });
  });

  it('reports every missing field', () => {
    const result = parseContactRequest({});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name']);
    }
  });

  it('refuses a message that is only spaces', () => {
    expect(parseContactRequest({ ...valid, message: '   ' }).ok).toBe(false);
  });
});

describe('contact submission', () => {
  it('sends the message with a reply-to', async () => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 200 }));

    const result = await submit(valid, send);

    expect(result.status).toBe(200);
    const payload = JSON.parse((send.mock.calls[0][1] as RequestInit).body as string);
    expect(payload).toMatchObject({
      reply_to: 'jeanne@example.be',
      subject: 'Nouveau message depuis le site',
    });
    expect(payload.text).toContain('Bonjour');
  });

  it('never puts visitor text in the subject', async () => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 200 }));

    await submit({ ...valid, name: 'Jeanne\nBcc: x@y.be' }, send);

    const payload = JSON.parse((send.mock.calls[0][1] as RequestInit).body as string);
    expect(payload.subject).toBe('Nouveau message depuis le site');
  });

  it('ignores a filled honeypot', async () => {
    const send = vi.fn<typeof fetch>();

    const result = await submit({ ...valid, website: 'spam' }, send);

    expect(result.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });
});
