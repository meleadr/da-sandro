import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';

const ITEMS = ['Pizzas', 'Mariages', 'Anniversaires', 'Entreprises', 'Région liégeoise'];

@Component({
  selector: 'app-ticker',
  imports: [FaIconComponent],
  host: { class: 'relative block overflow-hidden bg-orange py-2.5 text-brown' },
  template: `
    <div class="flex w-max animate-marquee motion-reduce:animate-none" aria-hidden="true">
      @for (copy of copies; track copy) {
        <ul class="flex shrink-0">
          @for (item of items; track item) {
            <li class="px-3 text-xs font-black tracking-[0.12em] whitespace-nowrap uppercase">
              ◆ {{ item }}
            </li>
          }
        </ul>
      }
    </div>
    <div
      class="absolute inset-y-0 left-0 flex animate-drive items-center bg-orange px-3 text-lg motion-reduce:hidden"
      aria-hidden="true"
    >
      <fa-icon [icon]="truckIcon" />
    </div>
  `,
})
export class Ticker {
  protected readonly truckIcon = faTruck;
  protected readonly items = ITEMS;
  protected readonly copies = [1, 2, 3, 4];
}
