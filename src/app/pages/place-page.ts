import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDiamondTurnRight } from '@fortawesome/free-solid-svg-icons';
import { places } from '../../data/places';
import { WeeklySchedule } from '../schedule/weekly-schedule';
import { MapEmbed } from '../shared/map-embed';

@Component({
  selector: 'app-place-page',
  imports: [RouterLink, FaIconComponent, MapEmbed, WeeklySchedule],
  template: `
    @if (place(); as place) {
      <section class="mx-auto max-w-2xl px-4 pt-6 pb-10 text-center">
        <span class="etiquette">Food truck pizza</span>
        <h1 class="titre-sticker mt-4 text-4xl md:text-6xl">{{ place.name }}</h1>
        <p class="mt-4 font-bold">
          @if (place.address) {
            {{ place.address }}, {{ place.postalCode }} {{ place.city }}
          } @else {
            Adresse exacte bientôt disponible
          }
        </p>
        @if (place.description) {
          <p class="mt-3">{{ place.description }}</p>
        }
        @if (directionsUrl(); as url) {
          <a [href]="url" class="btn btn-orange mt-5" rel="noopener" target="_blank">
            <fa-icon [icon]="directionsIcon" aria-hidden="true" />
            Y aller
          </a>
        }
      </section>

      <section class="bg-brun px-4 py-10 text-center text-creme">
        <div class="mx-auto max-w-2xl">
          <h2 class="mb-5 font-titre text-2xl">Horaires à {{ place.name }}</h2>
          <app-weekly-schedule [placeSlug]="place.slug" />
        </div>
      </section>

      @if (query(); as mapQuery) {
        <section class="mx-auto max-w-2xl px-4 py-10">
          <app-map-embed [query]="mapQuery" [label]="place.name" />
        </section>
      }

      <p class="py-10 text-center">
        <a routerLink="/carte" class="btn btn-brun">Voir la carte</a>
      </p>
    }
  `,
})
export class PlacePage {
  /** Bound from the route parameter. */
  readonly slug = input.required<string>();

  protected readonly directionsIcon = faDiamondTurnRight;

  protected readonly place = computed(() => places.find(({ slug }) => slug === this.slug()));

  protected readonly query = computed(() => {
    const place = this.place();
    return place?.address ? `${place.address}, ${place.postalCode} ${place.city}` : null;
  });

  protected readonly directionsUrl = computed(() => {
    const query = this.query();
    return query
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
      : null;
  });
}
