import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faLocationDot,
  faPhone,
  faPizzaSlice,
  faTruck,
} from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import { menu } from '../../data/menu';
import { ServiceStatus } from '../schedule/service-status';
import { WeeklySchedule } from '../schedule/weekly-schedule';
import { Seo } from '../seo/seo';
import { buildBusinessSchema } from '../seo/structured-data';
import { Mascot } from '../shared/mascot';
import { MenuList } from '../shared/menu-list';
import { Reveal } from '../shared/reveal';
import { Ticker } from '../shared/ticker';

const PREVIEW_SIZE = 3;

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FaIconComponent,
    Mascot,
    MenuList,
    Reveal,
    ServiceStatus,
    Ticker,
    WeeklySchedule,
  ],
  template: `
    <section
      class="mx-auto grid max-w-6xl gap-6 px-4 pt-2 pb-8 text-center md:grid-cols-[1.25fr_1fr] md:items-center md:gap-10 md:px-6 md:pb-12 md:text-left"
    >
      <div>
        <app-mascot class="mx-auto mb-3 size-28 md:mx-0 md:size-40" />
        <h1 class="titre-sticker text-[2.6rem] md:text-7xl">Da Sandro</h1>
        <p class="mt-4 text-sm font-extrabold uppercase md:text-base">
          Pizzeria food truck à Liège et Grâce-Hollogne
        </p>
      </div>

      <div class="grid gap-2.5">
        <app-service-status />
        <a routerLink="/emplacements" class="btn btn-orange">
          <fa-icon [icon]="locationIcon" aria-hidden="true" />
          Voir les emplacements
        </a>
        <a routerLink="/carte" class="btn btn-contour">
          <fa-icon [icon]="pizzaIcon" aria-hidden="true" />
          Voir la carte
        </a>
        @if (phone) {
          <a [href]="'tel:' + phone" class="btn btn-contour">
            <fa-icon [icon]="phoneIcon" aria-hidden="true" />
            Appeler
          </a>
        }
      </div>
    </section>

    <app-ticker />

    <section appReveal class="bg-brun px-4 py-10 text-center text-creme">
      <div class="mx-auto max-w-2xl">
        <span class="etiquette">Où nous trouver</span>
        <h2 class="mt-3 mb-5 font-titre text-2xl md:text-3xl">La semaine du camion</h2>
        <app-weekly-schedule />
      </div>
    </section>

    <section appReveal class="px-4 py-10 text-center">
      <div class="mx-auto max-w-2xl">
        <span class="etiquette">La carte</span>
        <h2 class="mt-3 mb-3 font-titre text-2xl md:text-3xl">Nos pizzas</h2>
        <app-menu-list [items]="preview" />
        <a routerLink="/carte" class="btn btn-brun mt-6">Toute la carte</a>
      </div>
    </section>

    <section appReveal class="bg-orange px-4 py-10 text-center">
      <div class="mx-auto max-w-2xl">
        <span class="etiquette bg-brun text-creme">Événements</span>
        <h2 class="mt-3 font-titre text-2xl md:text-3xl">Le camion chez vous</h2>
        <p class="mt-3 font-semibold">
          Mariages, anniversaires, entreprises : le camion se déplace partout en région liégeoise.
        </p>
        <a routerLink="/evenements" class="btn btn-brun mt-5">
          <fa-icon [icon]="truckIcon" aria-hidden="true" />
          Demander un devis
        </a>
      </div>
    </section>
  `,
})
export class Home {
  protected readonly locationIcon = faLocationDot;
  protected readonly phoneIcon = faPhone;
  protected readonly pizzaIcon = faPizzaSlice;
  protected readonly truckIcon = faTruck;
  protected readonly phone = business.phone;
  protected readonly preview = menu.categories[0].items.slice(0, PREVIEW_SIZE);

  constructor() {
    inject(Seo).set({
      title: 'Da Sandro | Pizzeria food truck à Liège et Grâce-Hollogne',
      description:
        'Da Sandro, pizzeria food truck en région liégeoise : pizzas italiennes à la pâte artisanale, et un camion qui se déplace pour vos mariages et événements.',
      path: '/',
      structuredData: buildBusinessSchema(business, menu),
    });
  }
}
