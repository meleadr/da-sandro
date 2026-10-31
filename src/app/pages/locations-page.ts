import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { places } from '../../data/places';
import { ServiceStatus } from '../schedule/service-status';
import { WeeklySchedule } from '../schedule/weekly-schedule';
import { Seo } from '../seo/seo';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-locations-page',
  imports: [RouterLink, FaIconComponent, Reveal, ServiceStatus, WeeklySchedule],
  template: `
    <section class="mx-auto max-w-2xl px-4 pt-6 pb-10 text-center">
      <span class="tag">Où nous trouver</span>
      <h1 class="title-sticker mt-4 mb-6 text-4xl md:text-6xl">Emplacements</h1>
      <app-service-status />
    </section>

    <section appReveal class="bg-brown px-4 py-10 text-center text-cream">
      <div class="mx-auto max-w-2xl">
        <h2 class="mb-5 font-display text-2xl">La semaine du camion</h2>
        <app-weekly-schedule />
      </div>
    </section>

    <section appReveal class="mx-auto max-w-2xl px-4 py-10 text-center">
      <h2 class="mb-5 font-display text-2xl">Nos lieux</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        @for (place of places; track place.slug) {
          <a [routerLink]="place.slug" class="btn btn-outline">
            <fa-icon [icon]="locationIcon" aria-hidden="true" />
            {{ place.name }}
          </a>
        }
      </div>
    </section>
  `,
})
export class LocationsPage {
  protected readonly locationIcon = faLocationDot;
  protected readonly places = places;

  constructor() {
    inject(Seo).set({
      title: 'Emplacements et horaires du food truck | Da Sandro',
      description:
        'Où trouver le food truck Da Sandro cette semaine : lieux et horaires du camion à pizza en région liégeoise.',
      path: '/emplacements/',
    });
  }
}
