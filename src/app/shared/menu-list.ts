import { Component, input } from '@angular/core';
import type { MenuItem } from '../../data/types';
import { formatPrice } from './format-price';

@Component({
  selector: 'app-menu-list',
  host: { class: 'block' },
  template: `
    <ul>
      @for (item of items(); track item.name) {
        <li class="border-b-2 border-dashed border-brown/50 py-3 text-left">
          <div class="flex items-baseline justify-between gap-4">
            <span class="font-bold">{{ item.name }}</span>
            <span class="shrink-0 font-bold whitespace-nowrap">{{ price(item) }}</span>
          </div>
          @if (item.ingredients.length > 0) {
            <p class="mt-0.5 text-sm">{{ item.ingredients.join(', ') }}</p>
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
