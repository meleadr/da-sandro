import { Component, input } from '@angular/core';

/** Page temporaire : chaque route sera remplacée par sa vraie page. */
@Component({
  selector: 'app-page-placeholder',
  template: `
    <section class="mx-auto max-w-3xl px-4 py-16 text-center">
      <span class="etiquette">Bientôt</span>
      <h1 class="mt-4 font-titre text-3xl">{{ heading() }}</h1>
    </section>
  `,
})
export class PagePlaceholder {
  readonly heading = input.required<string>();
}
