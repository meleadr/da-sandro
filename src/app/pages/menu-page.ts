import { Component, inject } from '@angular/core';
import { business } from '../../data/business';
import { menu } from '../../data/menu';
import { Seo } from '../seo/seo';
import { buildMenuSchema } from '../seo/structured-data';
import { MenuList } from '../shared/menu-list';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-menu-page',
  imports: [MenuList, Reveal],
  template: `
    <section class="mx-auto max-w-2xl px-4 pt-6 pb-12 text-center">
      <span class="tag">Cucina tradizionale italiana</span>
      <h1 class="title-sticker mt-4 text-4xl md:text-6xl">La carte</h1>

      @for (category of menu.categories; track category.name) {
        <div appReveal>
          <h2 class="mt-10 mb-2 font-display text-2xl">{{ category.name }}</h2>
          <app-menu-list [items]="category.items" />
        </div>
      }

      <p class="mt-8 font-semibold">{{ menu.note }}</p>
      <p class="mt-3 text-sm font-semibold">
        Prix TVA comprise. Allergies ou intolérances ? La liste des allergènes est disponible sur
        simple demande au camion.
      </p>
    </section>
  `,
})
export class MenuPage {
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
