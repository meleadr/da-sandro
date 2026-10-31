import type { Schedule } from '../../data/types';
import { describeServiceDay, findNextService } from './service-finder';

const schedule: Schedule = {
  provisional: false,
  weekly: [
    { weekday: 2, placeSlug: 'liege', start: '18:00', end: '21:30' },
    { weekday: 5, placeSlug: 'grace-hollogne', start: '18:00', end: '21:30' },
  ],
  exceptions: [],
};

describe('findNextService', () => {
  it('keeps a service while it is running', () => {
    // Friday 6 November 2026, 19:00 in Brussels.
    const service = findNextService(schedule, new Date('2026-11-06T18:00:00Z'));

    expect(service).toMatchObject({ date: '2026-11-06', placeSlug: 'grace-hollogne', daysAway: 0 });
  });

  it('moves to the next service once the current one is over', () => {
    // Friday, 22:00 in Brussels.
    const service = findNextService(schedule, new Date('2026-11-06T21:00:00Z'));

    expect(service).toMatchObject({ date: '2026-11-10', placeSlug: 'liege', daysAway: 4 });
  });

  it('finds the next service on a day without one', () => {
    // Wednesday 4 November.
    const service = findNextService(schedule, new Date('2026-11-04T10:00:00Z'));

    expect(service).toMatchObject({ date: '2026-11-06', daysAway: 2 });
  });

  it('skips a cancelled day', () => {
    const cancelled: Schedule = {
      ...schedule,
      exceptions: [{ kind: 'cancelled', date: '2026-11-06' }],
    };

    const service = findNextService(cancelled, new Date('2026-11-06T11:00:00Z'));

    expect(service).toMatchObject({ date: '2026-11-10', placeSlug: 'liege' });
  });

  it('cancels only the given service on a day with two', () => {
    const twoServices: Schedule = {
      ...schedule,
      weekly: [
        { weekday: 5, placeSlug: 'liege', start: '11:30', end: '14:00' },
        { weekday: 5, placeSlug: 'grace-hollogne', start: '18:00', end: '21:30' },
      ],
      exceptions: [{ kind: 'cancelled', date: '2026-11-06', start: '11:30' }],
    };

    const service = findNextService(twoServices, new Date('2026-11-06T09:00:00Z'));

    expect(service).toMatchObject({ start: '18:00', placeSlug: 'grace-hollogne' });
  });

  it('uses a moved service instead of the cancelled one', () => {
    const moved: Schedule = {
      ...schedule,
      exceptions: [
        { kind: 'cancelled', date: '2026-11-06' },
        { kind: 'one-off', date: '2026-11-07', placeSlug: 'liege', start: '12:00', end: '14:00' },
      ],
    };

    const service = findNextService(moved, new Date('2026-11-06T09:00:00Z'));

    expect(service).toMatchObject({ date: '2026-11-07', placeSlug: 'liege', daysAway: 1 });
  });

  it('keeps a one-off service on a cancelled day', () => {
    const relocated: Schedule = {
      ...schedule,
      exceptions: [
        { kind: 'cancelled', date: '2026-11-06' },
        { kind: 'one-off', date: '2026-11-06', placeSlug: 'liege', start: '12:00', end: '14:00' },
      ],
    };

    const service = findNextService(relocated, new Date('2026-11-06T09:00:00Z'));

    expect(service).toMatchObject({ date: '2026-11-06', placeSlug: 'liege' });
  });

  it('applies summer time', () => {
    // Friday 3 July 2026: 19:30 and then 22:00 in Brussels (UTC+2).
    expect(findNextService(schedule, new Date('2026-07-03T17:30:00Z'))?.date).toBe('2026-07-03');
    expect(findNextService(schedule, new Date('2026-07-03T20:00:00Z'))?.date).toBe('2026-07-07');
  });

  it('handles the night the clocks change', () => {
    // Sunday 29 March 2026, 03:30 in Brussels, just after the change.
    const service = findNextService(schedule, new Date('2026-03-29T01:30:00Z'));

    expect(service).toMatchObject({ date: '2026-03-31', daysAway: 2 });
  });

  it('uses the Brussels day even when it is still the previous day elsewhere', () => {
    // Still Friday evening in New York, but already Saturday 00:30 in Brussels.
    const service = findNextService(schedule, new Date('2026-11-06T23:30:00Z'));

    expect(service).toMatchObject({ date: '2026-11-10', daysAway: 3 });
  });

  it('returns null when nothing is planned', () => {
    const empty: Schedule = { ...schedule, weekly: [] };

    expect(findNextService(empty, new Date('2026-11-06T09:00:00Z'))).toBeNull();
  });
});

describe('describeServiceDay', () => {
  const service = {
    date: '2026-11-06',
    placeSlug: 'liege',
    start: '18:00',
    end: '21:30',
    daysAway: 0,
  };

  it('describes an evening service today', () => {
    expect(describeServiceDay(service)).toBe('Prévu ce soir');
  });

  it('describes a lunch service today', () => {
    expect(describeServiceDay({ ...service, start: '11:30', end: '14:00' })).toBe('Prévu ce midi');
  });

  it('describes tomorrow', () => {
    expect(describeServiceDay({ ...service, daysAway: 1 })).toBe('Prévu demain');
  });

  it('names the weekday within a week', () => {
    expect(describeServiceDay({ ...service, daysAway: 4 })).toBe('Prévu vendredi');
  });

  it('gives the date beyond a week', () => {
    expect(describeServiceDay({ ...service, daysAway: 9 })).toBe('Prévu le 6 novembre');
  });
});
