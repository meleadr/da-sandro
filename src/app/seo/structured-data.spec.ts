import type { Business, Menu, Place, Schedule } from '../../data/types';
import { buildBusinessSchema, buildMenuSchema, buildPlaceSchema } from './structured-data';

const business: Business = {
  provisional: false,
  siteUrl: 'https://example.be',
  name: 'Da Sandro',
  legalName: 'Sandro Meledina',
  legalForm: 'Personne physique',
  phone: '+32470000000',
  email: 'contact@example.be',
  legalAddress: 'Rue Privée 1, 4460 Grâce-Hollogne',
  companyNumber: '0123.456.789',
  vatNumber: 'BE 0123.456.789',
  areaServed: 'Région liégeoise',
  socialLinks: [],
};

const menu: Menu = {
  provisional: false,
  note: '',
  categories: [
    {
      name: 'Pizzas',
      items: [
        { name: 'Margherita', ingredients: ['tomate', 'mozzarella'], priceCents: 800 },
        { name: 'Parmigiana', ingredients: [], priceCents: 1100 },
        { name: 'Nouvelle', ingredients: [], priceCents: null },
      ],
    },
  ],
};

const place: Place = {
  provisional: false,
  slug: 'grace-hollogne',
  name: 'Grâce-Hollogne',
  address: 'Place Exemple 1',
  postalCode: '4460',
  city: 'Grâce-Hollogne',
  description: 'Sur la place.',
};

const schedule: Schedule = {
  provisional: false,
  weekly: [
    { weekday: 5, placeSlug: 'grace-hollogne', start: '18:00', end: '21:30' },
    { weekday: 2, placeSlug: 'liege', start: '18:00', end: '21:30' },
  ],
  exceptions: [],
};

describe('buildBusinessSchema', () => {
  it('describes the area served and never the legal address', () => {
    const schema = buildBusinessSchema(business, menu);

    expect(schema).toMatchObject({
      '@type': 'Restaurant',
      telephone: '+32470000000',
      priceRange: '8.00 € - 11.00 €',
      areaServed: { name: 'Région liégeoise' },
    });
    expect(schema).not.toHaveProperty('address');
    expect(JSON.stringify(schema)).not.toContain('Rue Privée');
  });

  it('omits empty social links', () => {
    expect(buildBusinessSchema(business, menu)).not.toHaveProperty('sameAs');
  });
});

describe('buildMenuSchema', () => {
  it('lists items with their price', () => {
    const section = buildMenuSchema(business, menu)['hasMenuSection'] as {
      hasMenuItem: Record<string, unknown>[];
    }[];

    expect(section[0].hasMenuItem[0]).toMatchObject({
      name: 'Margherita',
      description: 'tomate, mozzarella',
      offers: { price: '8.00', priceCurrency: 'EUR' },
    });
  });

  it('never publishes an offer for an unknown price', () => {
    const section = buildMenuSchema(business, menu)['hasMenuSection'] as {
      hasMenuItem: Record<string, unknown>[];
    }[];

    expect(section[0].hasMenuItem[2]).not.toHaveProperty('offers');
  });
});

describe('buildPlaceSchema', () => {
  it('gives the address and only the hours of this place', () => {
    const schema = buildPlaceSchema(business, place, schedule);

    expect(schema).toMatchObject({
      address: { addressLocality: 'Grâce-Hollogne', addressCountry: 'BE' },
      openingHoursSpecification: [{ dayOfWeek: 'Friday', opens: '18:00', closes: '21:30' }],
    });
  });

  it('publishes nothing for a provisional place', () => {
    expect(buildPlaceSchema(business, { ...place, provisional: true }, schedule)).toBeNull();
  });

  it('publishes nothing for a provisional schedule', () => {
    expect(buildPlaceSchema(business, place, { ...schedule, provisional: true })).toBeNull();
  });
});
