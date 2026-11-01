import { TestBed } from '@angular/core/testing';
import { MotionToggle } from './motion-toggle';

async function render(compact: boolean) {
  const fixture = TestBed.createComponent(MotionToggle);
  fixture.componentRef.setInput('compact', compact);
  await fixture.whenStable();
  const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
  return { fixture, button };
}

describe('MotionToggle', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('motion-paused');
  });

  it('pauses the animations and remembers the choice', async () => {
    const { fixture, button } = await render(false);

    button.click();
    await fixture.whenStable();

    expect(document.documentElement.classList).toContain('motion-paused');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.textContent).toContain('Relancer les animations');
    expect(localStorage.getItem('motion-paused')).toBe('true');
  });

  it('restarts them on a second click', async () => {
    const { fixture, button } = await render(false);

    button.click();
    await fixture.whenStable();
    button.click();
    await fixture.whenStable();

    expect(document.documentElement.classList).not.toContain('motion-paused');
  });

  it('keeps an accessible name in compact mode', async () => {
    const { button } = await render(true);

    expect(button.getAttribute('aria-label')).toBe('Mettre les animations en pause');
  });
});
