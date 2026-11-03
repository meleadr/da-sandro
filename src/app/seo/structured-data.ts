import type { Business, Menu, Place, Schedule, WeeklyService } from '../../data/types';

type JsonLd = Record<string, unknown>;

const CONTEXT = 'https://schema.org';
const SCHEMA_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

function formatEuro(priceCents: number): string {
  return (priceCents / 100).toFixed(2);
}

function priceRange(menu: Menu): string | undefined {
  const prices = menu.categories
    .flatMap((category) => category.items)
    .flatMap((item) => (item.priceCents === null ? [] : [item.priceCents]));

  return prices.length > 0
    ? `${formatEuro(Math.min(...prices))} € - ${formatEuro(Math.max(...prices))} €`
    : undefined;
}

/** The business has no public address: the schema describes the area it serves. */
export function buildBusinessSchema(business: Business, menu: Menu): JsonLd {
  const sameAs = business.socialLinks.map((link) => link.url);

  return {
    '@context': CONTEXT,
    '@type': 'Restaurant',
    '@id': `${business.siteUrl}/#da-sandro`,
    name: business.name,
    url: `${business.siteUrl}/`,
    image: `${business.siteUrl}/og-image.png`,
    // Temporary: replace with the final logo once it exists (see TODO.md).
    logo: `${business.siteUrl}/apple-touch-icon.png`,
    telephone: business.phone,
    email: business.email,
    servesCuisine: ['Pizza', 'Italienne'],
    hasMenu: `${business.siteUrl}/carte/`,
    areaServed: { '@type': 'AdministrativeArea', name: business.areaServed },
    ...(priceRange(menu) ? { priceRange: priceRange(menu) } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildMenuSchema(business: Business, menu: Menu): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Menu',
    name: `La carte de ${business.name}`,
    url: `${business.siteUrl}/carte/`,
    hasMenuSection: menu.categories.map((category) => ({
      '@type': 'MenuSection',
      name: category.name,
      hasMenuItem: category.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        ...(item.ingredients.length > 0 ? { description: item.ingredients.join(', ') } : {}),
        ...(item.priceCents === null
          ? {}
          : {
              offers: {
                '@type': 'Offer',
                price: formatEuro(item.priceCents),
                priceCurrency: 'EUR',
              },
            }),
      })),
    })),
  };
}

function openingHours(service: WeeklyService): JsonLd {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: SCHEMA_DAYS[service.weekday - 1],
    opens: service.start,
    closes: service.end,
  };
}

/** Returns null for provisional stops: example data must never reach search engines. */
export function buildPlaceSchema(
  business: Business,
  place: Place,
  schedule: Schedule,
): JsonLd | null {
  if (place.provisional || schedule.provisional || !place.address) {
    return null;
  }

  return {
    '@context': CONTEXT,
    '@type': 'Restaurant',
    name: `${business.name} - ${place.name}`,
    url: `${business.siteUrl}/emplacements/${place.slug}/`,
    image: `${business.siteUrl}/og-image.png`,
    telephone: business.phone,
    servesCuisine: ['Pizza', 'Italienne'],
    hasMenu: `${business.siteUrl}/carte/`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      postalCode: place.postalCode,
      addressLocality: place.city,
      addressCountry: 'BE',
    },
    openingHoursSpecification: schedule.weekly
      .filter((service) => service.placeSlug === place.slug)
      .map(openingHours),
  };
}
