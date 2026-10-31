import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NAV_LINKS } from './nav-links';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, FaIconComponent],
  template: `
    <header class="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
      <a routerLink="/" class="font-display text-lg text-brown">Da Sandro</a>

      <nav aria-label="Navigation principale" class="hidden items-center gap-2 md:flex">
        @for (link of links; track link.path) {
          <a
            [routerLink]="link.path"
            routerLinkActive="bg-brown text-cream"
            class="btn btn-sm btn-outline"
          >
            {{ link.label }}
          </a>
        }
        <a routerLink="/carte" class="btn btn-sm btn-brown">La carte</a>
      </nav>

      <div class="flex items-center gap-2 md:hidden">
        <a routerLink="/carte" class="btn btn-sm btn-brown">La carte</a>
        <details #menu class="group">
          <summary
            class="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border-2 border-brown text-brown [&::-webkit-details-marker]:hidden"
            aria-label="Menu"
          >
            <fa-icon [icon]="menuIcon" aria-hidden="true" />
          </summary>
          <nav
            aria-label="Navigation mobile"
            class="absolute inset-x-4 top-full z-20 grid gap-2 rounded-xl bg-brown p-3 shadow-lg"
          >
            @for (link of links; track link.path) {
              <a
                [routerLink]="link.path"
                class="btn text-cream btn-outline"
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
}
