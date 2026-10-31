import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

/** Google Maps sets its own cookies, so it only loads once the visitor asks for it. */
@Component({
  selector: 'app-map-embed',
  imports: [FaIconComponent],
  host: { class: 'block' },
  template: `
    <div class="aspect-4/3 overflow-hidden rounded-xl bg-brun text-creme md:aspect-video">
      @if (visible()) {
        <iframe
          class="size-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          [src]="source()"
          [title]="'Carte : ' + label()"
        ></iframe>
      } @else {
        <div class="flex size-full flex-col items-center justify-center gap-3 p-5 text-center">
          <fa-icon class="text-3xl text-jaune" [icon]="mapIcon" aria-hidden="true" />
          <button type="button" class="btn btn-orange" (click)="visible.set(true)">
            Afficher la carte
          </button>
          <p class="max-w-sm text-xs">
            La carte est fournie par Google Maps, qui peut déposer ses propres cookies.
          </p>
        </div>
      }
    </div>
  `,
})
export class MapEmbed {
  readonly query = input.required<string>();
  readonly label = input.required<string>();

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly mapIcon = faMapLocationDot;
  protected readonly visible = signal(false);

  protected readonly source = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${encodeURIComponent(this.query())}&output=embed`,
    ),
  );
}
