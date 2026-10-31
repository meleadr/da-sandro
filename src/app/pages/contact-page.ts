import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import { ContactForm } from '../contact/contact-form';
import { Seo } from '../seo/seo';
import { Reveal } from '../shared/reveal';
import { SocialLinks } from '../shared/social-links';

@Component({
  selector: 'app-contact-page',
  imports: [ContactForm, RouterLink, FaIconComponent, Reveal, SocialLinks],
  template: `
    <section class="mx-auto max-w-xl px-4 pt-6 pb-12 text-center">
      <span class="tag">Une question ?</span>
      <h1 class="title-sticker mt-4 text-4xl md:text-6xl">Contact</h1>

      <div class="mt-8 grid gap-3">
        @if (business.phone) {
          <a [href]="'tel:' + business.phone" class="btn btn-orange">
            <fa-icon [icon]="phoneIcon" aria-hidden="true" />
            Appeler
          </a>
        }
        @if (business.email) {
          <a [href]="'mailto:' + business.email" class="btn btn-outline">
            <fa-icon [icon]="emailIcon" aria-hidden="true" />
            {{ business.email }}
          </a>
        }
        @if (business.socialLinks.length > 0) {
          <app-social-links class="justify-center" [links]="business.socialLinks" />
        }
        <a routerLink="/evenements" class="btn btn-brown">Organiser un événement</a>
      </div>
    </section>

    <section appReveal class="bg-orange px-4 py-10">
      <div class="mx-auto max-w-2xl">
        <h2 class="mb-6 text-center font-display text-2xl">Écrivez-nous</h2>
        <app-contact-form />
      </div>
    </section>
  `,
})
export class ContactPage {
  protected readonly business = business;
  protected readonly emailIcon = faEnvelope;
  protected readonly phoneIcon = faPhone;

  constructor() {
    inject(Seo).set({
      title: 'Contact | Da Sandro',
      description:
        'Contactez Da Sandro, pizzeria food truck en région liégeoise, par téléphone, par e-mail ou via notre formulaire.',
      path: '/contact/',
    });
  }
}
