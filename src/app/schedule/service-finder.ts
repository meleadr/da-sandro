import type { Schedule, Weekday } from '../../data/types';

export interface ResolvedService {
  /** Brussels calendar date, YYYY-MM-DD. */
  readonly date: string;
  readonly placeSlug: string;
  readonly start: string;
  readonly end: string;
  /** 0 for today, 1 for tomorrow, and so on. */
  readonly daysAway: number;
}

const TIME_ZONE = 'Europe/Brussels';
const LOOK_AHEAD_DAYS = 60;
const MS_PER_DAY = 86_400_000;
const EVENING_START = '17:00';

const brusselsClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function brusselsNow(instant: Date): { date: string; time: string } {
  const parts = Object.fromEntries(
    brusselsClock.formatToParts(instant).map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts['year']}-${parts['month']}-${parts['day']}`,
    time: `${parts['hour']}:${parts['minute']}`,
  };
}

function addDays(date: string, days: number): string {
  const base = Date.parse(`${date}T00:00:00Z`);
  return new Date(base + days * MS_PER_DAY).toISOString().slice(0, 10);
}

function isoWeekday(date: string): Weekday {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return (day === 0 ? 7 : day) as Weekday;
}

function servicesOn(schedule: Schedule, date: string, daysAway: number): ResolvedService[] {
  const exceptions = schedule.exceptions.filter((exception) => exception.date === date);
  const cancellations = exceptions.flatMap((exception) =>
    exception.kind === 'cancelled' ? [exception] : [],
  );
  const isCancelled = (start: string) =>
    cancellations.some(
      (cancellation) => cancellation.start === undefined || cancellation.start === start,
    );

  const weekday = isoWeekday(date);
  const weekly = schedule.weekly
    .filter((service) => service.weekday === weekday && !isCancelled(service.start))
    .map(({ placeSlug, start, end }) => ({ date, placeSlug, start, end, daysAway }));

  const oneOff = exceptions.flatMap((exception) =>
    exception.kind === 'one-off'
      ? [
          {
            date,
            placeSlug: exception.placeSlug,
            start: exception.start,
            end: exception.end,
            daysAway,
          },
        ]
      : [],
  );

  return [...weekly, ...oneOff].sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * Returns the current or next planned service. It uses Brussels time whatever the
 * visitor's time zone, and returns null when nothing is planned in the next 60 days.
 */
export function findNextService(schedule: Schedule, instant: Date): ResolvedService | null {
  const now = brusselsNow(instant);

  for (let daysAway = 0; daysAway <= LOOK_AHEAD_DAYS; daysAway++) {
    const services = servicesOn(schedule, addDays(now.date, daysAway), daysAway);
    const next = services.find((service) => daysAway > 0 || service.end > now.time);
    if (next) {
      return next;
    }
  }
  return null;
}

/** Heading of the service block: it states what is planned, never that the truck is open. */
export function describeServiceDay(service: ResolvedService): string {
  if (service.daysAway === 0) {
    return service.start >= EVENING_START ? 'Prévu ce soir' : 'Prévu ce midi';
  }
  if (service.daysAway === 1) {
    return 'Prévu demain';
  }

  const date = new Date(`${service.date}T12:00:00Z`);
  const format = service.daysAway < 7 ? { weekday: 'long' } : { day: 'numeric', month: 'long' };
  const label = new Intl.DateTimeFormat('fr-BE', {
    ...(format as Intl.DateTimeFormatOptions),
    timeZone: 'UTC',
  }).format(date);

  return service.daysAway < 7 ? `Prévu ${label}` : `Prévu le ${label}`;
}
