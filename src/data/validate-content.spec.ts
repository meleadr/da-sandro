import { siteContent } from './site-content';
import type { SiteContent } from './types';
import { findPublishErrors, findStructureErrors } from './validate-content';

const publishable: SiteContent = {
  business: {
    provisional: false,
    siteUrl: 'https://example.be',
    name: 'Da Sandro',
    legalName: 'Sandro Meledina',
    legalForm: 'Personne physique',
    phone: '+32470000000',
    email: 'contact@example.be',
    legalAddress: 'Rue Exemple 1, 4460 Grâce-Hollogne',
    companyNumber: '0123.456.789',
    vatNumber: 'BE 0123.456.789',
    areaServed: 'Région liégeoise',
    socialLinks: [],
  },
  places: [
    {
      provisional: false,
      slug: 'grace-hollogne',
      name: 'Grâce-Hollogne',
      address: 'Rue Exemple 1',
      postalCode: '4460',
      city: 'Grâce-Hollogne',
      description: 'Sur la place.',
    },
  ],
  schedule: {
    provisional: false,
    weekly: [{ weekday: 5, placeSlug: 'grace-hollogne', start: '18:00', end: '21:30' }],
    exceptions: [],
  },
  menu: {
    provisional: false,
    categories: [
      {
        name: 'Classiques',
        items: [{ name: 'Margherita', ingredients: ['tomate'], priceCents: 1000 }],
      },
    ],
    note: '',
  },
};

describe('content validation', () => {
  it('accepts complete content', () => {
    expect(findPublishErrors(publishable)).toEqual([]);
  });

  it('keeps the current data structurally valid', () => {
    expect(findStructureErrors(siteContent)).toEqual([]);
  });

  it('refuses provisional content', () => {
    const content = { ...publishable, menu: { ...publishable.menu, provisional: true } };

    expect(findPublishErrors(content)).toContain('menu: still provisional');
  });

  it('refuses a missing price', () => {
    const content: SiteContent = {
      ...publishable,
      menu: {
        ...publishable.menu,
        categories: [
          { name: 'Classiques', items: [{ name: 'Regina', ingredients: [], priceCents: null }] },
        ],
      },
    };

    expect(findPublishErrors(content)).toContain('menu: missing price for "Regina"');
  });

  it('refuses a missing phone number', () => {
    const content = { ...publishable, business: { ...publishable.business, phone: '' } };

    expect(findPublishErrors(content)).toContain('business: invalid phone');
  });

  it('refuses a placeholder social link', () => {
    const content: SiteContent = {
      ...publishable,
      business: {
        ...publishable.business,
        socialLinks: [{ network: 'facebook', url: 'https://www.facebook.com/' }],
      },
    };

    expect(findPublishErrors(content)).toContain('business: facebook link is still a placeholder');
  });

  it('accepts a real social link', () => {
    const content: SiteContent = {
      ...publishable,
      business: {
        ...publishable.business,
        socialLinks: [{ network: 'facebook', url: 'https://www.facebook.com/dasandro' }],
      },
    };

    expect(findPublishErrors(content)).toEqual([]);
  });

  it('refuses a place without any service', () => {
    const content: SiteContent = {
      ...publishable,
      schedule: { ...publishable.schedule, weekly: [] },
    };

    expect(findPublishErrors(content)).toContain(
      'places: "grace-hollogne" has no service, so it must not have a page',
    );
  });

  it('refuses a service at an unknown place', () => {
    const content: SiteContent = {
      ...publishable,
      schedule: {
        ...publishable.schedule,
        weekly: [{ weekday: 1, placeSlug: 'nulle-part', start: '18:00', end: '21:30' }],
      },
    };

    expect(findStructureErrors(content)).toContain(
      'schedule.weekly[0]: unknown place "nulle-part"',
    );
  });

  it('refuses hours that end before they start', () => {
    const content: SiteContent = {
      ...publishable,
      schedule: {
        ...publishable.schedule,
        weekly: [{ weekday: 5, placeSlug: 'grace-hollogne', start: '22:00', end: '18:00' }],
      },
    };

    expect(findStructureErrors(content)).toContain('schedule.weekly[0]: invalid hours');
  });

  it('refuses an impossible exception date', () => {
    const content: SiteContent = {
      ...publishable,
      schedule: {
        ...publishable.schedule,
        exceptions: [{ kind: 'cancelled', date: '2026-02-31' }],
      },
    };

    expect(findStructureErrors(content)).toContain(
      'schedule.exceptions[0]: invalid date "2026-02-31"',
    );
  });
});
