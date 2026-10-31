import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  host: { class: 'flex min-h-dvh flex-col' },
  template: `
    <a
      href="#contenu"
      class="sr-only focus:not-sr-only focus:absolute focus:z-30 focus:m-2 focus:rounded-lg focus:bg-brun focus:p-3 focus:text-creme"
    >
      Aller au contenu
    </a>
    <app-site-header />
    <main id="contenu" class="flex-1">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
})
export class App {}
