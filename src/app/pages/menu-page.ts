import { Component } from '@angular/core';
import { menu } from '../../data/menu';
import { MenuList } from '../shared/menu-list';

@Component({
  selector: 'app-menu-page',
  imports: [MenuList],
  template: `
    <section class="mx-auto max-w-2xl px-4 pt-6 pb-12 text-center">
      <span class="etiquette">Cucina tradizionale italiana</span>
      <h1 class="titre-sticker mt-4 text-4xl md:text-6xl">La carte</h1>

      @for (category of menu.categories; track category.name) {
        <h2 class="mt-10 mb-2 font-titre text-2xl">{{ category.name }}</h2>
        <app-menu-list [items]="category.items" />
      }

      <p class="mt-8 font-semibold">{{ menu.note }}</p>
    </section>
  `,
})
export class MenuPage {
  protected readonly menu = menu;
}
