import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Cascade } from './cascade';

@Component({
  imports: [Cascade],
  template: `<ul appCascade>
    <li>Margherita</li>
    <li>Regina</li>
  </ul>`,
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
  return (fixture.nativeElement as HTMLElement).querySelector('ul')!;
}

describe('Cascade', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('hides a list below the fold and numbers its items', async () => {
    stubBrowser(false, 5000);

    const list = await render();

    expect(list.classList).toContain('cascade-pending');
    expect((list.children[1] as HTMLElement).style.getPropertyValue('--cascade-index')).toBe('1');
  });

  it('leaves a list already in view alone', async () => {
    stubBrowser(false, 10);

    expect((await render()).classList).not.toContain('cascade-pending');
  });

  it('does nothing when the visitor asks for less motion', async () => {
    stubBrowser(true, 5000);

    expect((await render()).classList).not.toContain('cascade-pending');
  });
});
