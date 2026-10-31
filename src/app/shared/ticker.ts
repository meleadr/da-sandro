import { ChangeDetectionStrategy, Component } from '@angular/core';

const ITEMS = ['Pizzas', 'Mariages', 'Anniversaires', 'Entreprises', 'Région liégeoise'];

@Component({
  selector: 'app-ticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block overflow-hidden bg-orange py-2.5 text-brun' },
  template: `
    <div class="flex w-max animate-defile motion-reduce:animate-none" aria-hidden="true">
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
  `,
})
export class Ticker {
  protected readonly items = ITEMS;
  protected readonly copies = [1, 2, 3, 4];
}
