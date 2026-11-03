import { Component, computed, input } from '@angular/core';
import type { MenuItem } from '../../data/types';
import { formatPrice } from './format-price';

/** The menu painted on the side of the truck. */
@Component({
  selector: 'app-menu-list',
  host: { class: 'board block' },
  template: `
    <!-- In two columns, the list fills the left column first, like a printed menu. -->
    <ul
      class="board-inner px-5 py-1.5 md:px-7"
      [class]="columns() ? 'md:grid md:grid-flow-col md:gap-x-12' : ''"
      [style.grid-template-rows]="columns() ? 'repeat(' + rows() + ', auto)' : null"
    >
      @for (item of items(); track item.name) {
        <li
          class="border-b-2 border-dashed border-cream/25 py-4 text-left last:border-b-0"
          [class]="columns() && $index === rows() - 1 ? 'md:border-b-0' : ''"
        >
          <div class="flex items-baseline justify-between gap-4">
            <span class="text-lg font-extrabold">{{ item.name }}</span>
            <span class="shrink-0 font-display text-xl whitespace-nowrap text-yellow">
              {{ price(item) }}
            </span>
          </div>
          @if (item.ingredients.length > 0) {
            <p class="mt-1 leading-snug text-cream/80">{{ item.ingredients.join(', ') }}</p>
          }
        </li>
      }
    </ul>
  `,
})
export class MenuList {
  readonly items = input.required<readonly MenuItem[]>();
  /** Two columns from the md breakpoint, for long lists. */
  readonly columns = input(false);

  /** Rows of the left column, which holds the extra item of an odd list. */
  protected readonly rows = computed(() => Math.ceil(this.items().length / 2));

  protected price(item: MenuItem): string {
    return formatPrice(item.priceCents);
  }
}
