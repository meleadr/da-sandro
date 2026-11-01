import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ContactForm } from './contact-form';

async function setup() {
  const fixture = TestBed.createComponent(ContactForm);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;

  const fill = (id: string, value: string) => {
    const field = element.querySelector<HTMLInputElement>(`#${id}`)!;
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const submit = async () => {
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  };
  const fillValid = () => {
    fill('name', 'Jeanne');
    fill('email', 'jeanne@example.be');
    fill('message', 'Bonjour');
  };

  return { element, fillValid, submit };
}

describe('ContactForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows errors and sends nothing when the form is incomplete', async () => {
    const send = vi.fn();
    vi.stubGlobal('fetch', send);
    const { element, submit } = await setup();

    await submit();

    expect(send).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Écrivez votre message.');
  });

  it('sends to the contact endpoint and confirms', async () => {
    const send = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', send);
    const { element, fillValid, submit } = await setup();

    fillValid();
    await submit();

    expect(send.mock.calls[0][0]).toBe('/api/contact');
    expect(element.textContent).toContain('Votre message est bien parti');
  });

  it('keeps what was typed when sending fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    const { element, fillValid, submit } = await setup();

    fillValid();
    await submit();

    expect(element.textContent).toContain("L'envoi a échoué");
    expect(element.querySelector<HTMLTextAreaElement>('#message')?.value).toBe('Bonjour');
  });
});
