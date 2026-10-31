import type { Schedule } from './types';

/**
 * To cancel a service, add `{ kind: 'cancelled', date: 'YYYY-MM-DD' }` to `exceptions`.
 * Add `start` to cancel only one service on a day with several.
 * To move or add one, add a `one-off` entry as well.
 */
export const schedule: Schedule = {
  provisional: true,
  weekly: [
    { weekday: 2, placeSlug: 'liege', start: '18:00', end: '21:30' },
    { weekday: 5, placeSlug: 'grace-hollogne', start: '18:00', end: '21:30' },
    { weekday: 6, placeSlug: 'liege', start: '18:00', end: '21:30' },
  ],
  exceptions: [],
};
