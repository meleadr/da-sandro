import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_LINKS } from './nav-links';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  host: { class: 'block bg-brun text-creme' },
  template: `
    <footer class="mx-auto grid max-w-6xl gap-5 px-4 py-8 md:grid-cols-2 md:items-end">
      <div>
        <p class="font-titre text-xl text-jaune">Da Sandro</p>
        <p class="mt-1 text-sm">Pizzeria food truck en région liégeoise</p>
      </div>

      <nav aria-label="Pied de page" class="flex flex-wrap gap-x-5 gap-y-2 text-sm md:justify-end">
        <a routerLink="/carte" class="underline-offset-4 hover:underline">La carte</a>
        @for (link of links; track link.path) {
          <a [routerLink]="link.path" class="underline-offset-4 hover:underline">{{
            link.label
          }}</a>
        }
        <a routerLink="/mentions-legales" class="underline-offset-4 hover:underline">
          Mentions légales
        </a>
      </nav>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly links = NAV_LINKS;
}
