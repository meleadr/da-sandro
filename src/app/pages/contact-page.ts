import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import { Seo } from '../seo/seo';
import { SocialLinks } from '../shared/social-links';

@Component({
  selector: 'app-contact-page',
  imports: [RouterLink, FaIconComponent, SocialLinks],
  template: `
    <section class="mx-auto max-w-xl px-4 pt-6 pb-12 text-center">
      <span class="etiquette">Une question ?</span>
      <h1 class="titre-sticker mt-4 text-4xl md:text-6xl">Contact</h1>

      <div class="mt-8 grid gap-3">
        @if (business.phone) {
          <a [href]="'tel:' + business.phone" class="btn btn-orange">
            <fa-icon [icon]="phoneIcon" aria-hidden="true" />
            Appeler
          </a>
        }
        @if (business.email) {
          <a [href]="'mailto:' + business.email" class="btn btn-contour">
            <fa-icon [icon]="emailIcon" aria-hidden="true" />
            {{ business.email }}
          </a>
        }
        @if (business.socialLinks.length > 0) {
          <app-social-links class="justify-center" [links]="business.socialLinks" />
        }
        <a routerLink="/evenements" class="btn btn-brun">Organiser un événement</a>
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
        'Contactez Da Sandro, pizzeria food truck en région liégeoise, par téléphone ou par e-mail.',
      path: '/contact/',
    });
  }
}
