import { Component, inject } from '@angular/core';
import { business } from '../../data/business';
import { menu } from '../../data/menu';
import { Seo } from '../seo/seo';
import { buildMenuSchema } from '../seo/structured-data';
import { MenuList } from '../shared/menu-list';

@Component({
  selector: 'app-menu-page',
  imports: [MenuList],
  template: `
    <section class="mx-auto max-w-4xl px-4 pt-6 pb-12 text-center">
      <span class="tag text-[0.6875rem] min-[360px]:text-xs" lang="it"
        >Cucina tradizionale italiana</span
      >
      <h1 class="title-sticker mt-4 text-4xl md:text-6xl">La carte</h1>
      <p class="mx-auto mt-5 max-w-xl font-semibold">{{ menu.note }}</p>

      @for (category of menu.categories; track category.name) {
        <h2 class="mt-10 mb-3 font-display text-2xl md:text-3xl">{{ category.name }}</h2>
        @let long = category.items.length >= COLUMNS_FROM;
        <app-menu-list
          class="mx-auto"
          [class.max-w-xl]="!long"
          [items]="category.items"
          [columns]="long"
        />
      }

      <p class="mx-auto mt-8 max-w-xl text-sm font-semibold">
        Prix TVA comprise. Allergies ou intolérances ? La liste des allergènes est disponible sur
        simple demande au camion.
      </p>
    </section>
  `,
})
export class MenuPage {
  /** Short lists stay in one narrow column. */
  protected readonly COLUMNS_FROM = 6;
  protected readonly menu = menu;

  constructor() {
    inject(Seo).set({
      title: 'Carte et prix des pizzas | Da Sandro',
      description:
        'La carte de Da Sandro : Margherita, Regina, Capricciosa, Diavola et autres pizzas à la pâte artisanale, préparées selon la tradition italienne.',
      path: '/carte/',
      structuredData: buildMenuSchema(business, menu),
    });
  }
}
