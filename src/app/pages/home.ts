import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLocationDot, faPizzaSlice, faTruck } from '@fortawesome/free-solid-svg-icons';
import { Mascot } from '../shared/mascot';
import { Ticker } from '../shared/ticker';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FaIconComponent, Mascot, Ticker],
  template: `
    <section
      class="mx-auto grid max-w-6xl gap-6 px-4 pt-2 pb-8 text-center md:grid-cols-[1.25fr_1fr] md:items-center md:gap-10 md:px-6 md:pb-12 md:text-left"
    >
      <div>
        <app-mascot class="mx-auto mb-3 size-28 md:mx-0 md:size-40" />
        <h1 class="titre-sticker text-[2.6rem] md:text-7xl">Da Sandro</h1>
        <p class="mt-4 text-sm font-extrabold uppercase md:text-base">
          Pizzas au camion à Liège et Grâce-Hollogne
        </p>
      </div>

      <div class="grid gap-2.5">
        <div class="rounded-xl bg-brun p-4 text-center text-creme">
          <p class="text-xs font-extrabold tracking-widest text-vert uppercase">Cette semaine</p>
          <p class="mt-1 font-titre text-lg text-jaune">Où est le camion ?</p>
          <p class="mt-1 text-sm">Lieux et horaires de la semaine</p>
        </div>
        <a routerLink="/emplacements" class="btn btn-orange">
          <fa-icon [icon]="locationIcon" aria-hidden="true" />
          Voir les emplacements
        </a>
        <a routerLink="/carte" class="btn btn-contour">
          <fa-icon [icon]="pizzaIcon" aria-hidden="true" />
          Voir la carte
        </a>
        <a routerLink="/evenements" class="btn btn-contour">
          <fa-icon [icon]="truckIcon" aria-hidden="true" />
          Réserver pour un event
        </a>
      </div>
    </section>

    <app-ticker />
  `,
})
export class Home {
  protected readonly locationIcon = faLocationDot;
  protected readonly pizzaIcon = faPizzaSlice;
  protected readonly truckIcon = faTruck;
}
