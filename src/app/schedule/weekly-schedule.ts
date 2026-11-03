import { afterNextRender, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { places } from '../../data/places';
import { schedule } from '../../data/schedule';
import type { Weekday, WeeklyService } from '../../data/types';
import { findNextService, isoWeekday } from './service-finder';

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
  7: 'Dimanche',
};

/** Weekly planning. It is in the prerendered HTML, so it must not depend on the current day. */
@Component({
  selector: 'app-weekly-schedule',
  imports: [RouterLink],
  host: { class: 'block' },
  template: `
    <ul class="grid gap-1.5">
      @for (service of services(); track service.weekday + service.start) {
        <li
          class="flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 rounded-lg bg-brown-light px-3 py-2.5 text-left text-sm"
          [class.font-extrabold]="isNext(service)"
          [class.outline-2]="isNext(service)"
          [class.outline-orange]="isNext(service)"
        >
          <span class="min-w-20">{{ dayName(service) }}</span>
          @if (!placeSlug()) {
            <a
              class="flex-1 underline-offset-2 hover:underline"
              [routerLink]="['/emplacements', service.placeSlug]"
            >
              {{ placeName(service) }}
            </a>
          }
          <span class="whitespace-nowrap">{{ service.start }} – {{ service.end }}</span>
        </li>
      }
    </ul>
  `,
})
export class WeeklySchedule {
  /** Limits the list to one place. */
  readonly placeSlug = input<string>();

  private readonly next = signal<WeeklyService | null>(null);

  protected readonly services = computed(() => {
    const slug = this.placeSlug();
    return schedule.weekly
      .filter((service) => !slug || service.placeSlug === slug)
      .sort((a, b) => a.weekday - b.weekday || a.start.localeCompare(b.start));
  });

  constructor() {
    afterNextRender(() => {
      const service = findNextService(schedule, new Date());
      if (service) {
        this.next.set({ ...service, weekday: isoWeekday(service.date) });
      }
    });
  }

  protected dayName(service: WeeklyService): string {
    return WEEKDAY_NAMES[service.weekday];
  }

  protected placeName(service: WeeklyService): string {
    return places.find((place) => place.slug === service.placeSlug)?.name ?? '';
  }

  protected isNext(service: WeeklyService): boolean {
    const next = this.next();
    return (
      next?.weekday === service.weekday &&
      next.start === service.start &&
      next.placeSlug === service.placeSlug
    );
  }
}
