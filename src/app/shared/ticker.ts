import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { places } from '../../data/places';
import { schedule } from '../../data/schedule';
import { WEEKDAY_NAMES } from '../schedule/weekly-schedule';
import { MotionToggle } from './motion-toggle';

/**
 * The week of the truck, then the events. It is decoration hidden from assistive technology:
 * the same facts are in the schedule section, which also works when the motion is paused.
 */
const ITEMS = [
  ...[...schedule.weekly]
    .sort((a, b) => a.weekday - b.weekday || a.start.localeCompare(b.start))
    .map((service) => {
      const place = places.find((candidate) => candidate.slug === service.placeSlug);
      return `${WEEKDAY_NAMES[service.weekday]} à ${place?.name ?? ''}, ${service.start}`;
    }),
  'Mariages',
  'Anniversaires',
  'Entreprises',
];

@Component({
  selector: 'app-ticker',
  imports: [FaIconComponent, MotionToggle],
  host: { class: 'relative block overflow-hidden bg-orange py-2.5 text-brown' },
  template: `
    <div class="flex w-max animate-marquee motion-reduce:animate-none" aria-hidden="true">
      @for (copy of copies; track copy) {
        <ul class="flex shrink-0">
          @for (item of items; track item) {
            <li
              class="flex items-center gap-4 pr-4 text-xs font-black tracking-[0.12em] whitespace-nowrap uppercase"
            >
              <span class="-mr-[0.12em]">{{ item }}</span>
              <span class="tracking-normal">◆</span>
            </li>
          }
        </ul>
      }
    </div>
    <div
      class="absolute inset-y-0 left-0 flex animate-drive items-center bg-orange px-3 text-lg motion-reduce:hidden"
      aria-hidden="true"
    >
      <fa-icon [icon]="truckIcon" />
    </div>
    <app-motion-toggle
      class="absolute inset-y-0 right-0 z-10 flex items-center bg-orange px-2"
      [compact]="true"
    />
  `,
})
export class Ticker {
  protected readonly truckIcon = faTruck;
  protected readonly items = ITEMS;
  protected readonly copies = [1, 2, 3, 4];
}
