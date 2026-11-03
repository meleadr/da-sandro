import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { places } from '../../data/places';
import type { Place } from '../../data/types';
import { ServiceStatus } from '../schedule/service-status';
import { WeeklySchedule } from '../schedule/weekly-schedule';
import { Seo } from '../seo/seo';
import { MapEmbed } from '../shared/map-embed';
import { fullAddress, mapQuery } from '../shared/place-address';

@Component({
  selector: 'app-locations-page',
  imports: [RouterLink, FaIconComponent, MapEmbed, ServiceStatus, WeeklySchedule],
  template: `
    <section class="mx-auto max-w-2xl px-4 pt-6 pb-10 text-center">
      <span class="tag">Région liégeoise</span>
      <h1 class="title-sticker mt-4 mb-6 text-[1.7rem] min-[380px]:text-4xl md:text-6xl">
        Emplacements
      </h1>
      <app-service-status [weekLink]="false" />
    </section>

    <section class="bg-brown px-4 py-10 text-center text-cream">
      <div class="mx-auto max-w-2xl">
        <h2 class="mb-5 font-display text-2xl">La semaine du camion</h2>
        <app-weekly-schedule />
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-10 text-center">
      <h2 class="mb-5 font-display text-2xl">Nos lieux</h2>

      <div class="grid gap-3 sm:grid-cols-2">
        @for (place of places; track place.slug) {
          <div class="paper py-4 text-left">
            <a [routerLink]="place.slug" class="group flex items-center justify-between gap-3">
              <span class="text-lg font-extrabold">{{ place.name }}</span>
              <fa-icon
                class="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                [icon]="arrowIcon"
                aria-hidden="true"
              />
            </a>
            <p class="mt-1 text-sm">{{ address(place) }}</p>
            <button
              type="button"
              class="btn btn-sm btn-outline mt-3 w-full"
              [class.bg-brown]="selected() === place"
              [class.text-cream]="selected() === place"
              [attr.aria-pressed]="selected() === place"
              (click)="selected.set(place)"
            >
              <fa-icon [icon]="locationIcon" aria-hidden="true" />
              Voir sur le plan
            </button>
          </div>
        }
      </div>

      <app-map-embed class="mt-5" [label]="selected().name" [query]="query()" />
    </section>
  `,
})
export class LocationsPage {
  protected readonly arrowIcon = faArrowRight;
  protected readonly locationIcon = faLocationDot;
  protected readonly places = places;
  protected readonly selected = signal<Place>(places[0]);
  protected readonly query = computed(() => mapQuery(this.selected()));

  constructor() {
    inject(Seo).set({
      title: 'Emplacements et horaires du food truck | Da Sandro',
      description:
        'Où trouver le food truck Da Sandro cette semaine : lieux et horaires du camion à pizza en région liégeoise.',
      path: '/emplacements/',
    });
  }

  protected address(place: Place): string {
    return fullAddress(place) ?? 'Adresse exacte bientôt disponible';
  }
}
