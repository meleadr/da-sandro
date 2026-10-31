import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { business } from '../../data/business';
import { places } from '../../data/places';
import { schedule } from '../../data/schedule';
import { describeServiceDay, findNextService, ResolvedService } from './service-finder';

const REFRESH_MS = 60_000;

/**
 * The prerendered HTML must never announce today's service, because it would go stale.
 * It holds a neutral message, replaced in the browser with the same layout.
 */
@Component({
  selector: 'app-service-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block rounded-xl bg-brun p-4 text-center text-creme' },
  template: `
    <p class="text-xs font-extrabold tracking-widest text-vert uppercase">{{ eyebrow() }}</p>
    <p class="mt-1 font-titre text-lg text-jaune">{{ placeName() }}</p>
    <p class="mt-1 text-sm">{{ details() }}</p>
    @if (socialUrl) {
      <p class="mt-2 text-xs">
        Un changement de dernière minute ?
        <a [href]="socialUrl" class="underline underline-offset-2" rel="noopener" target="_blank">
          Suivez-nous sur nos réseaux
        </a>
      </p>
    }
  `,
})
export class ServiceStatus {
  private readonly service = signal<ResolvedService | null>(null);

  protected readonly socialUrl = business.socialLinks[0]?.url;

  protected readonly eyebrow = computed(() => {
    const service = this.service();
    return service ? describeServiceDay(service) : 'Cette semaine';
  });

  protected readonly placeName = computed(() => {
    const service = this.service();
    const place = places.find((candidate) => candidate.slug === service?.placeSlug);
    return place?.name ?? 'Où est le camion ?';
  });

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
