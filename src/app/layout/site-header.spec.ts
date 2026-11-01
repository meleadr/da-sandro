import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiteHeader } from './site-header';

async function renderOpenMenu() {
  const fixture = TestBed.createComponent(SiteHeader);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  document.body.appendChild(element);
  const menu = element.querySelector('details')!;
  menu.open = true;
  return { element, menu };
}

describe('SiteHeader', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('closes the mobile menu with Escape', async () => {
    const { menu } = await renderOpenMenu();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(menu.open).toBe(false);
  });

  it('closes the mobile menu on a click elsewhere', async () => {
    const { menu } = await renderOpenMenu();

    document.body.click();

    expect(menu.open).toBe(false);
  });

  it('keeps the mobile menu open on a click inside it', async () => {
    const { menu } = await renderOpenMenu();

    menu.querySelector('nav')!.click();

    expect(menu.open).toBe(true);
  });
});
