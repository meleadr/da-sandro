import { Component, inject } from '@angular/core';
import { EventForm } from '../events/event-form';
import { Seo } from '../seo/seo';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-events-page',
  imports: [EventForm, Reveal],
  template: `
    <section class="mx-auto max-w-2xl px-4 pt-6 pb-10 text-center">
      <span class="tag">Événements</span>
      <h1 class="title-sticker mt-4 text-4xl md:text-6xl">Le camion chez vous</h1>
      <p class="mt-5 font-semibold">
        Mariage, anniversaire, événement d'entreprise : Da Sandro se déplace partout en région
        liégeoise pour servir ses pizzas à vos invités.
      </p>
    </section>

    <section appReveal class="bg-orange px-4 py-10">
      <div class="mx-auto max-w-2xl">
        <h2 class="mb-6 text-center font-display text-2xl">Demander un devis</h2>
        <app-event-form />
      </div>
    </section>
  `,
})
export class EventsPage {
  constructor() {
    inject(Seo).set({
      title: 'Food truck pizza pour mariage et événement à Liège | Da Sandro',
      description:
        "Un food truck pizza pour votre mariage, anniversaire ou événement d'entreprise en région liégeoise. Demandez votre devis à Da Sandro.",
      path: '/evenements/',
    });
  }
}
