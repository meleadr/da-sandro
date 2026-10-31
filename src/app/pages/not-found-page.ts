import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../seo/seo';
import { Mascot } from '../shared/mascot';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, Mascot],
  template: `
    <section class="mx-auto max-w-xl px-4 py-10 text-center">
      <app-mascot class="mx-auto mb-4 size-28" />
      <h1 class="title-sticker text-4xl md:text-6xl">Page introuvable</h1>
      <p class="mt-5 font-semibold">Cette page a dû partir avec la dernière pizza.</p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <a routerLink="/" class="btn btn-brown">Retour à l'accueil</a>
        <a routerLink="/carte" class="btn btn-outline">Voir la carte</a>
      </div>
    </section>
  `,
})
export class NotFoundPage {
  constructor() {
    inject(Seo).set({
      title: 'Page introuvable | Da Sandro',
      description: "Cette page n'existe pas sur le site de Da Sandro.",
      path: '/404/',
      noindex: true,
    });
  }
}
