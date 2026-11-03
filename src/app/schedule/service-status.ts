import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDiamondTurnRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import { places } from '../../data/places';
import { schedule } from '../../data/schedule';
import { directionsUrl } from '../shared/place-address';
import { describeServiceDay, findNextService, ResolvedService } from './service-finder';

const REFRESH_MS = 60_000;

/**
 * The board painted on the truck: where it stops next, and how to get there.
 *
 * The prerendered HTML must never announce today's service, because it would go stale.
 * It holds a neutral message, replaced in the browser with the same layout.
 */
@Component({
  selector: 'app-service-status',
  imports: [RouterLink, FaIconComponent],
  host: { class: 'board block' },
  template: `
    <div class="board-inner @container px-4 py-5 text-center md:px-6">
      <p class="font-bold text-yellow">{{ eyebrow() }}</p>
      <p class="mt-2 font-display text-[length:min(3rem,8cqi)] leading-none">
        {{ placeName() }}
      </p>
      <p class="mt-2 text-xl font-extrabold tabular-nums">{{ details() }}</p>

      <div class="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        @if (place(); as place) {
          @if (directions(); as url) {
            <a [href]="url" class="btn btn-orange" rel="noopener" target="_blank">
              <fa-icon [icon]="directionsIcon" aria-hidden="true" />
              Y aller
            </a>
          } @else {
            <a [routerLink]="['/emplacements', place.slug]" class="btn btn-orange">
              <fa-icon [icon]="locationIcon" aria-hidden="true" />
              Voir l'emplacement
            </a>
          }
          @if (weekLink()) {
            <a routerLink="/emplacements" class="text-sm font-bold underline underline-offset-4">
              Toute la semaine
            </a>
          }
        } @else if (weekLink()) {
          <a routerLink="/emplacements" class="btn btn-orange">
            <fa-icon [icon]="locationIcon" aria-hidden="true" />
            Voir les emplacements
          </a>
        }
      </div>

      @if (socialUrl) {
        <p class="mt-4 text-xs">
          Un changement de dernière minute ?
          <a [href]="socialUrl" class="underline underline-offset-2" rel="noopener" target="_blank">
            Suivez-nous sur nos réseaux
          </a>
        </p>
      }
    </div>
  `,
})
export class ServiceStatus {
  /** Off on the locations page, which already shows the whole week. */
  readonly weekLink = input(true);

  private readonly service = signal<ResolvedService | null>(null);

  protected readonly directionsIcon = faDiamondTurnRight;
  protected readonly locationIcon = faLocationDot;
  protected readonly socialUrl = business.socialLinks[0]?.url;

  protected readonly place = computed(() => {
    const slug = this.service()?.placeSlug;
    return places.find((candidate) => candidate.slug === slug);
  });

  protected readonly directions = computed(() => {
    const place = this.place();
    return place ? directionsUrl(place) : null;
  });

  protected readonly eyebrow = computed(() => {
    const service = this.service();
    return service ? describeServiceDay(service) : 'Cette semaine';
  });

  protected readonly placeName = computed(() => this.place()?.name ?? 'Où est le camion ?');

  protected readonly details = computed(() => {
    const service = this.service();
    return service ? `${service.start} – ${service.end}` : 'Lieux et horaires de la semaine';
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const refresh = () => this.service.set(findNextService(schedule, new Date()));
      refresh();

      const timer = setInterval(refresh, REFRESH_MS);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }
}
