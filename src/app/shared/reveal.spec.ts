import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Reveal } from './reveal';

@Component({
  imports: [Reveal],
  template: `<section appReveal>Contenu</section>`,
})
class Host {}

function stubBrowser(reduced: boolean, top: number) {
  vi.stubGlobal('matchMedia', () => ({ matches: reduced }));
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect);
}

async function render(): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('section')!;
}

describe('Reveal', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('hides a section below the fold until it is reached', async () => {
    stubBrowser(false, 5000);

    expect((await render()).classList).toContain('reveal-attente');
  });

  it('leaves a section already in view alone', async () => {
    stubBrowser(false, 10);

    expect((await render()).classList).not.toContain('reveal-attente');
  });

  it('does nothing when the visitor asks for less motion', async () => {
    stubBrowser(true, 5000);

    expect((await render()).classList).not.toContain('reveal-attente');
  });
});
