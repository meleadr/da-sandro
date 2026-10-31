import { Component, inject } from '@angular/core';
import { business } from '../../data/business';
import { Seo } from '../seo/seo';

@Component({
  selector: 'app-legal-page',
  template: `
    <section class="mx-auto max-w-2xl px-4 pt-6 pb-12">
      <h1 class="title-sticker text-center text-3xl md:text-5xl">Mentions légales</h1>

      <div class="paper mt-8 py-6 md:px-8">
        <h2 class="font-display text-xl">Éditeur du site</h2>
        <p class="mt-2">
          {{ business.legalName || business.name }}, exerçant sous le nom {{ business.name }}
        </p>
        @if (business.legalForm) {
          <p>Forme juridique : {{ business.legalForm }}</p>
        }
        @if (business.legalAddress) {
          <p>{{ business.legalAddress }}</p>
        }
        @if (business.companyNumber) {
          <p>Numéro d'entreprise (BCE) : {{ business.companyNumber }}</p>
        }
        @if (business.vatNumber) {
          <p>TVA : {{ business.vatNumber }}</p>
        }
        @if (business.email) {
          <p>E-mail : {{ business.email }}</p>
        }

        <h2 class="mt-8 font-display text-xl">Hébergement</h2>
        <p class="mt-2">Le site est hébergé par Cloudflare, Inc.</p>

        <h2 class="mt-8 font-display text-xl">Vie privée</h2>
        <p class="mt-2">
          Les données envoyées via les formulaires du site servent uniquement à répondre à votre
          demande. Elles ne sont ni vendues ni transmises à des fins commerciales.
        </p>
        <p class="mt-2">
          La fréquentation du site est mesurée avec Cloudflare Web Analytics, sans cookies et sans
          suivi individuel des visiteurs.
        </p>
        <p class="mt-2">
          La carte Google Maps des pages de lieu ne se charge que si vous cliquez sur « Afficher la
          carte ». Google peut alors déposer ses propres cookies.
        </p>
      </div>
    </section>
  `,
})
export class LegalPage {
  protected readonly business = business;

  constructor() {
    inject(Seo).set({
      title: 'Mentions légales | Da Sandro',
      description: 'Mentions légales et vie privée du site Da Sandro.',
      path: '/mentions-legales/',
    });
  }
}
