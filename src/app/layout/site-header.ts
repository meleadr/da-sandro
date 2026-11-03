import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NAV_LINKS } from './nav-links';

/** A brown sign laid on the cardboard: cream links, and the menu as the one orange button. */
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, FaIconComponent],
  host: {
    class: 'block px-3 pt-3 md:px-6',
    '(document:keydown.escape)': 'closeMenu()',
    '(document:click)': 'closeOnOutsideClick($event)',
  },
  template: `
    <header
      class="relative mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full bg-brown py-2 pr-2 pl-5 text-cream shadow-[4px_5px_0_rgb(58_36_19_/_0.55)]"
    >
      <a routerLink="/" class="font-display text-lg text-yellow">Da Sandro</a>

      <nav aria-label="Navigation principale" class="hidden items-center gap-6 md:flex">
        @for (link of links; track link.path) {
          <a
            [routerLink]="link.path"
            routerLinkActive="text-yellow underline"
            ariaCurrentWhenActive="page"
            class="font-bold decoration-yellow decoration-[3px] underline-offset-[6px] hover:underline"
          >
            {{ link.label }}
          </a>
        }
        <a
          routerLink="/carte"
          ariaCurrentWhenActive="page"
          routerLinkActive
          class="btn btn-sm btn-orange"
        >
          La carte
        </a>
      </nav>

      <div class="flex items-center gap-2 md:hidden">
        <a
          routerLink="/carte"
          ariaCurrentWhenActive="page"
          routerLinkActive
          class="btn btn-sm btn-orange"
        >
          La carte
        </a>
        <details #menu class="group">
          <summary
            class="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border-2 border-cream text-cream [&::-webkit-details-marker]:hidden"
            aria-label="Menu"
          >
            <fa-icon [icon]="menuIcon" aria-hidden="true" />
          </summary>
          <nav
            aria-label="Navigation mobile"
            class="absolute inset-x-0 top-full z-20 mt-2 grid rounded-2xl bg-brown px-5 py-2 shadow-[4px_5px_0_rgb(58_36_19_/_0.55)]"
          >
            @for (link of links; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="text-yellow"
                ariaCurrentWhenActive="page"
                class="border-b-2 border-dashed border-cream/25 py-3.5 text-lg font-bold last:border-b-0"
                (click)="closeMenu()"
              >
                {{ link.label }}
              </a>
            }
          </nav>
        </details>
      </div>
    </header>
  `,
})
export class SiteHeader {
  protected readonly links = NAV_LINKS;
  protected readonly menuIcon = faBars;

  private readonly menu = viewChild.required<ElementRef<HTMLDetailsElement>>('menu');

  protected closeMenu(): void {
    this.menu().nativeElement.open = false;
  }

  protected closeOnOutsideClick(event: MouseEvent): void {
    if (!this.menu().nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }
}
