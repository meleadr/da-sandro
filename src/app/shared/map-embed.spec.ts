import { TestBed } from '@angular/core/testing';
import type { Place } from '../../data/types';
import { MapEmbed } from './map-embed';
import { mapQuery } from './place-address';

async function render(query: string) {
  const fixture = TestBed.createComponent(MapEmbed);
  fixture.componentRef.setInput('query', query);
  fixture.componentRef.setInput('label', 'Liège');
  await fixture.whenStable();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('MapEmbed', () => {
  it('loads nothing from Google before the click', async () => {
    const { element } = await render('4000 Liège');

    expect(element.querySelector('iframe')).toBeNull();
    expect(element.textContent).toContain('Afficher la carte');
  });

  it('loads the map after the click and follows a new query', async () => {
    const { fixture, element } = await render('4000 Liège');

    element.querySelector('button')!.click();
    await fixture.whenStable();
    expect(element.querySelector('iframe')?.src).toContain(encodeURIComponent('4000 Liège'));

    fixture.componentRef.setInput('query', '4460 Grâce-Hollogne');
    await fixture.whenStable();
    expect(element.querySelector('iframe')?.src).toContain(encodeURIComponent('4460 Grâce-Hollogne'));
  });
});

describe('mapQuery', () => {
  const place: Place = {
    provisional: false,
    slug: 'liege',
    name: 'Liège',
    address: '',
    postalCode: '4000',
    city: 'Liège',
    description: '',
  };

  it('falls back on the town without an address', () => {
    expect(mapQuery(place)).toBe('4000 Liège, Belgique');
  });

  it('uses the exact address when it is known', () => {
    expect(mapQuery({ ...place, address: 'Place Saint-Lambert 1' })).toBe(
      'Place Saint-Lambert 1, 4000 Liège',
    );
  });
});
