import { Component, computed, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import type { GoogleReviews } from '../../data/types';

@Component({
  selector: 'app-reviews-section',
  imports: [FaIconComponent],
  host: { class: 'block' },
  template: `
    @if (visible()) {
      <section class="px-4 py-10 text-center">
        <div class="mx-auto max-w-4xl">
          <span class="tag">Avis Google</span>
          <h2 class="mt-3 mb-5 font-display text-2xl md:text-3xl">Ils ont goûté</h2>

          @if (reviews().items.length > 0) {
            <ul class="grid gap-4 text-left md:grid-cols-3">
              @for (review of reviews().items; track review.author) {
                <li class="paper py-4">
                  <p
                    class="flex gap-0.5 text-brown"
                    role="img"
                    [attr.aria-label]="review.rating + ' étoiles sur 5'"
                  >
                    @for (star of stars(review.rating); track star) {
                      <fa-icon [icon]="starIcon" aria-hidden="true" />
                    }
                  </p>
                  <p class="mt-2">{{ review.text }}</p>
                  <p class="mt-2 text-sm font-extrabold">{{ review.author }}</p>
                </li>
              }
            </ul>
            <p class="mt-4 text-sm font-semibold">
              Une sélection d'avis publiés sur Google.
              @if (reviews().readUrl; as url) {
                <a class="underline underline-offset-2" [href]="url" rel="noopener" target="_blank">
                  Voir tous les avis
                </a>
              }
            </p>
          }

          @if (reviews().writeUrl; as url) {
            <p class="mt-5 font-semibold">
              Vous avez goûté nos pizzas ? Votre avis nous aide beaucoup.
            </p>
            <a class="btn btn-brown mt-3" [href]="url" rel="noopener" target="_blank">
              <fa-icon [icon]="googleIcon" aria-hidden="true" />
              Laisser un avis sur Google
            </a>
          }
        </div>
      </section>
    }
  `,
})
export class ReviewsSection {
  readonly reviews = input.required<GoogleReviews>();

  protected readonly googleIcon = faGoogle;
  protected readonly starIcon = faStar;
  protected readonly visible = computed(() => {
    const { items, writeUrl } = this.reviews();
    return items.length > 0 || Boolean(writeUrl);
  });

  protected stars(rating: number): readonly number[] {
    return Array.from({ length: rating }, (_, index) => index);
  }
}
