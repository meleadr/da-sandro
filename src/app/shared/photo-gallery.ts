import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import type { Photo } from '../../data/types';

const PLACEHOLDERS = ['Le camion', 'Le four', 'Une pizza', 'La pâte', 'Un événement', 'Sandro'];

@Component({
  selector: 'app-photo-gallery',
  imports: [FaIconComponent, NgOptimizedImage],
  host: { class: 'block' },
  template: `
    @if (visible()) {
      <section class="bg-brown px-4 py-10 text-center text-cream">
        <div class="mx-auto max-w-4xl">
          <span class="tag">En images</span>
          <h2 class="mt-3 mb-6 font-display text-2xl md:text-3xl">Le camion en vrai</h2>

          <ul class="cascade grid grid-cols-2 gap-4 md:grid-cols-3">
            @for (photo of photos(); track photo.src) {
              <li class="photo-frame" [style.--cascade-index]="$index">
                <img
                  class="size-full object-cover"
                  [alt]="photo.alt"
                  [height]="photo.height"
                  [ngSrc]="photo.src"
                  [width]="photo.width"
                />
              </li>
            }
            @if (photos().length === 0) {
              @for (label of placeholderLabels; track label) {
                <li class="photo-frame" [style.--cascade-index]="$index">
                  <div
                    class="flex size-full flex-col items-center justify-center gap-2 bg-cardboard p-2 text-brown"
                  >
                    <fa-icon class="text-2xl" [icon]="cameraIcon" aria-hidden="true" />
                    <span class="text-sm font-extrabold">{{ label }}</span>
                    <span class="text-xs font-semibold">Photo à venir</span>
                  </div>
                </li>
              }
            }
          </ul>
        </div>
      </section>
    }
  `,
})
export class PhotoGallery {
  readonly photos = input.required<readonly Photo[]>();
  /** Shows sample frames while there are no real photos. Never on in production. */
  readonly placeholders = input(false);

  protected readonly cameraIcon = faCamera;
  protected readonly placeholderLabels = PLACEHOLDERS;
  protected readonly visible = computed(() => this.photos().length > 0 || this.placeholders());
}
