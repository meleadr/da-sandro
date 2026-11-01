import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { EventForm } from './event-form';

function nextYear(): string {
  return `${new Date().getUTCFullYear() + 1}-06-15`;
}

async function setup() {
  const fixture = TestBed.createComponent(EventForm);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;

  const fill = (id: string, value: string) => {
    const field = element.querySelector<HTMLInputElement>(`#${id}`)!;
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const fillValid = () => {
    fill('eventType', 'Mariage');
    fill('date', nextYear());
    fill('location', 'Liège');
    fill('guests', '80');
    fill('name', 'Jeanne');
    fill('email', 'jeanne@example.be');
  };
  const submit = async () => {
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  };

  return { element, fill, fillValid, submit };
}

describe('EventForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows errors and sends nothing when the form is incomplete', async () => {
    const send = vi.fn();
    vi.stubGlobal('fetch', send);
    const { element, submit } = await setup();

    await submit();

    expect(send).not.toHaveBeenCalled();
    expect(element.textContent).toContain('Indiquez la date.');
  });

  it('confirms once the request is sent', async () => {
    const send = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', send);
    const { element, fillValid, submit } = await setup();

    fillValid();
    await submit();

    expect(send).toHaveBeenCalledOnce();
    expect(element.textContent).toContain('Votre demande est bien partie');
  });

  it('keeps what was typed when sending fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    const { element, fillValid, submit } = await setup();

    fillValid();
    await submit();

    expect(element.textContent).toContain("L'envoi a échoué");
    expect(element.querySelector<HTMLInputElement>('#name')?.value).toBe('Jeanne');
  });
});
