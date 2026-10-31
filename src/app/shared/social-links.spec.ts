import { TestBed } from '@angular/core/testing';
import { SocialLinks } from './social-links';

describe('SocialLinks', () => {
  it('renders one labelled link per network', async () => {
    const fixture = TestBed.createComponent(SocialLinks);
    fixture.componentRef.setInput('links', [
      { network: 'facebook', url: 'https://facebook.example/dasandro' },
      { network: 'instagram', url: 'https://instagram.example/dasandro' },
    ]);
    await fixture.whenStable();

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');

    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('https://facebook.example/dasandro');
    expect(links[1].getAttribute('aria-label')).toBe('Da Sandro sur Instagram');
  });
});
