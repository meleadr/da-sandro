import type { SiteContent } from './types';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+\d{8,15}$/;

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isValidRange(start: string, end: string): boolean {
  return TIME.test(start) && TIME.test(end) && start < end;
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

/** Errors that make the data unusable, whatever its publication status. */
export function findStructureErrors(content: SiteContent): string[] {
  const errors: string[] = [];
  const slugs = content.places.map((place) => place.slug);
  const knownSlugs = new Set(slugs);

  if (knownSlugs.size !== slugs.length) {
    errors.push('places: duplicate slug');
  }
  for (const slug of slugs) {
    if (!SLUG.test(slug)) {
      errors.push(`places: invalid slug "${slug}"`);
    }
  }

  content.schedule.weekly.forEach((service, index) => {
    const label = `schedule.weekly[${index}]`;
    if (!Number.isInteger(service.weekday) || service.weekday < 1 || service.weekday > 7) {
      errors.push(`${label}: invalid weekday`);
    }
    if (!knownSlugs.has(service.placeSlug)) {
      errors.push(`${label}: unknown place "${service.placeSlug}"`);
    }
    if (!isValidRange(service.start, service.end)) {
      errors.push(`${label}: invalid hours`);
    }
  });

  content.schedule.exceptions.forEach((exception, index) => {
    const label = `schedule.exceptions[${index}]`;
    if (!isValidDate(exception.date)) {
      errors.push(`${label}: invalid date "${exception.date}"`);
    }
    if (exception.kind === 'one-off') {
      if (!knownSlugs.has(exception.placeSlug)) {
        errors.push(`${label}: unknown place "${exception.placeSlug}"`);
      }
      if (!isValidRange(exception.start, exception.end)) {
        errors.push(`${label}: invalid hours`);
      }
    } else if (exception.start !== undefined && !TIME.test(exception.start)) {
      errors.push(`${label}: invalid start`);
    }
  });

  for (const category of content.menu.categories) {
    for (const item of category.items) {
      if (item.priceCents !== null && (!Number.isInteger(item.priceCents) || item.priceCents <= 0)) {
        errors.push(`menu: invalid price for "${item.name}"`);
      }
    }
  }

  return errors;
}

/** Everything that must be true before the site can go live. */
export function findPublishErrors(content: SiteContent): string[] {
  const errors = findStructureErrors(content);
  const { business, places, schedule, menu } = content;

  if (business.provisional) errors.push('business: still provisional');
  if (schedule.provisional) errors.push('schedule: still provisional');
  if (menu.provisional) errors.push('menu: still provisional');

  for (const field of [
    'name',
    'legalName',
    'legalForm',
    'legalAddress',
    'companyNumber',
    'vatNumber',
  ] as const) {
    if (isBlank(business[field])) {
      errors.push(`business: missing ${field}`);
    }
  }
  if (!PHONE.test(business.phone)) errors.push('business: invalid phone');
  if (!EMAIL.test(business.email)) errors.push('business: invalid email');

  if (places.length === 0) errors.push('places: at least one place is required');

  const servedSlugs = new Set([
    ...schedule.weekly.map((service) => service.placeSlug),
    ...schedule.exceptions.flatMap((exception) =>
      exception.kind === 'one-off' ? [exception.placeSlug] : [],
    ),
  ]);
  const descriptions = places.map((place) => place.description.trim());

  for (const place of places) {
    if (place.provisional) errors.push(`places: "${place.slug}" still provisional`);
    for (const field of ['name', 'address', 'postalCode', 'city', 'description'] as const) {
      if (isBlank(place[field])) {
        errors.push(`places: "${place.slug}" missing ${field}`);
      }
    }
    if (!servedSlugs.has(place.slug)) {
      errors.push(`places: "${place.slug}" has no service, so it must not have a page`);
    }
  }
  if (new Set(descriptions).size !== descriptions.length) {
    errors.push('places: descriptions must be unique');
  }

  if (schedule.weekly.length === 0) errors.push('schedule: no weekly service');

  const items = menu.categories.flatMap((category) => category.items);
  if (items.length === 0) errors.push('menu: no item');
  for (const item of items) {
    if (item.priceCents === null) errors.push(`menu: missing price for "${item.name}"`);
  }

  return errors;
}
