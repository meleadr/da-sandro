import { Component, input } from '@angular/core';
import type { MenuItem } from '../../data/types';
import { formatPrice } from './format-price';

@Component({
  selector: 'app-menu-list',
  host: { class: 'paper block' },
  template: `
    <ul class="cascade">
      @for (item of items(); track item.name) {
        <li
          class="border-b-2 border-dashed border-brown/30 py-3.5 text-left last:border-b-0"
          [style.--cascade-index]="$index"
        >
          <div class="flex items-baseline justify-between gap-4">
            <span class="text-lg font-extrabold">{{ item.name }}</span>
            <span class="shrink-0 font-display text-lg whitespace-nowrap">{{ price(item) }}</span>
          </div>
          @if (item.ingredients.length > 0) {
            <p class="mt-1 leading-snug">{{ item.ingredients.join(', ') }}</p>
          }
        </li>
      }
    </ul>
  `,
})
export class MenuList {
  readonly items = input.required<readonly MenuItem[]>();

  protected price(item: MenuItem): string {
    return formatPrice(item.priceCents);
  }
}
