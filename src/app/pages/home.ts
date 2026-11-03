import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPhone, faPizzaSlice, faTruck } from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import { menu } from '../../data/menu';
import { photos } from '../../data/photos';
import { googleReviews } from '../../data/reviews';
import { schedule } from '../../data/schedule';
import { ServiceStatus } from '../schedule/service-status';
import { WeeklySchedule } from '../schedule/weekly-schedule';
import { Seo } from '../seo/seo';
import { buildBusinessSchema } from '../seo/structured-data';
import { showPhotoPlaceholders } from '../shared/build-flags';
import { formatPhone } from '../shared/format-phone';
import { Mascot } from '../shared/mascot';
import { MenuList } from '../shared/menu-list';
import { PhotoGallery } from '../shared/photo-gallery';
import { formatPrice } from '../shared/format-price';
import { ReviewsSection } from '../shared/reviews-section';
import { Ticker } from '../shared/ticker';

const PREVIEW_SIZE = 3;
const EVENING_START = '17:00';

/** Lowest known pizza price, or null while no price is set. */
function lowestPrice(): string | null {
  const prices = menu.categories[0].items.flatMap(({ priceCents }) =>
    priceCents === null ? [] : [priceCents],
  );
  return prices.length > 0 ? formatPrice(Math.min(...prices)) : null;
}

/** "3 soirs par semaine", from the weekly schedule. */
function describeWeek(): string {
  const days = new Set(schedule.weekly.map((service) => service.weekday)).size;
  const evenings = schedule.weekly.every((service) => service.start >= EVENING_START);
  const unit = evenings ? 'soir' : 'jour';
  return `${days} ${unit}${days > 1 ? 's' : ''} par semaine`;
}

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FaIconComponent,
    Mascot,
    MenuList,
    PhotoGallery,
    ReviewsSection,
    ServiceStatus,
    Ticker,
    WeeklySchedule,
  ],
  template: `
    <section
      class="mx-auto grid max-w-6xl gap-6 px-4 pt-2 pb-8 text-center md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center md:gap-10 md:px-6 md:pb-12 md:text-left"
    >
      <div>
        <app-mascot class="mx-auto mb-3 size-28 md:mx-0 md:size-40" />
        <h1>
          <span class="title-sticker block text-[2.6rem] md:text-7xl">Da Sandro</span>
          <span class="mt-4 block text-sm font-extrabold uppercase md:text-base">
            Pizzeria food truck à Liège et Grâce-Hollogne
          </span>
        </h1>
      </div>

      <div class="grid gap-4">
        <app-service-status />
        <a routerLink="/evenements" class="btn btn-brown">
          <fa-icon [icon]="truckIcon" aria-hidden="true" />
          Réserver pour un événement
        </a>
        <p class="flex flex-wrap justify-center gap-x-6 gap-y-2 font-bold">
          <a
            routerLink="/carte"
            class="inline-flex items-center gap-2 underline-offset-4 hover:underline"
          >
            <fa-icon [icon]="pizzaIcon" aria-hidden="true" />
            La carte et les prix
          </a>
          @if (phone) {
            <a
              [href]="'tel:' + phone"
              class="inline-flex items-center gap-2 tabular-nums underline-offset-4 hover:underline"
            >
              <fa-icon [icon]="phoneIcon" aria-hidden="true" />
              {{ phoneLabel }}
            </a>
          }
        </p>
      </div>
    </section>

    <app-ticker />

    <section class="bg-brown px-4 py-10 text-center text-cream">
      <div class="mx-auto max-w-2xl">
        <span class="tag">{{ weekTag }}</span>
        <h2 class="mt-3 mb-5 font-display text-2xl md:text-3xl">La semaine du camion</h2>
        <app-weekly-schedule />
      </div>
    </section>

    <section class="px-4 py-12 md:py-16">
      <div
        class="mx-auto grid max-w-5xl gap-8 text-center md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-12 md:text-left"
      >
        <div>
          @if (fromPrice) {
            <span class="tag">Dès {{ fromPrice }}</span>
          }
          <h2 class="mt-3 font-display text-3xl md:text-5xl">Nos pizzas</h2>
          <p class="mx-auto mt-4 max-w-md font-semibold md:mx-0">{{ menuNote }}</p>
          <a routerLink="/carte" class="btn btn-brown mt-6">Toute la carte</a>
        </div>
        <app-menu-list [items]="preview" />
      </div>
    </section>

    <app-photo-gallery [photos]="photos" [placeholders]="photoPlaceholders" />

    <app-reviews-section [reviews]="reviews" />

    <section class="bg-orange px-4 py-12 md:py-16">
      <div
        class="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:gap-12 md:text-left"
      >
        <div class="max-w-2xl">
          <span class="tag bg-brown text-cream">Sur devis</span>
          <h2 class="mt-3 font-display text-3xl text-balance md:text-4xl lg:text-5xl">
            Le camion chez vous
          </h2>
          <p class="mt-4 font-semibold">
            Mariages, anniversaires, entreprises : le camion se déplace partout en région liégeoise.
          </p>
        </div>
        <a routerLink="/evenements" class="btn btn-brown shrink-0">
          <fa-icon [icon]="truckIcon" aria-hidden="true" />
          Demander un devis
        </a>
      </div>
    </section>
  `,
})
export class Home {
  protected readonly phoneIcon = faPhone;
  protected readonly pizzaIcon = faPizzaSlice;
  protected readonly truckIcon = faTruck;
  protected readonly phone = business.phone;
  protected readonly phoneLabel = business.phone ? formatPhone(business.phone) : '';
  protected readonly photos = photos;
  protected readonly photoPlaceholders = showPhotoPlaceholders;
  protected readonly reviews = googleReviews;
  protected readonly preview = menu.categories[0].items.slice(0, PREVIEW_SIZE);
  protected readonly fromPrice = lowestPrice();
  protected readonly menuNote = menu.note;
  protected readonly weekTag = describeWeek();

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
