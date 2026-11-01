import type { GoogleReviews } from './types';

/**
 * Stays hidden on the site until it holds real data.
 *
 * - `writeUrl`: in the Google Business Profile, "Get more reviews", then copy the link.
 * - `readUrl`: link to the public reviews of the profile on Google Maps.
 * - `items`: copy real reviews word for word, with the first name and an initial only.
 *
 * Do not add review or rating markup for these: Google does not allow it on a business's own site.
 */
export const googleReviews: GoogleReviews = {
  // Public profile for now: replace writeUrl with the direct review link once it is available.
  writeUrl: 'https://share.google/X2ParGaUJlSmKsLuW',
  readUrl: 'https://share.google/X2ParGaUJlSmKsLuW',
  items: [],
};
