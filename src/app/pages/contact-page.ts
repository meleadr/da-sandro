import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTiktok, IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import type { SocialLink } from '../../data/types';

const SOCIAL_ICONS: Record<SocialLink['network'], IconDefinition> = {
  facebook: faFacebook,
  instagram: faInstagram,
  tiktok: faTiktok,
};

@Component({
  selector: 'app-contact-page',
  imports: [RouterLink, FaIconComponent],
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
        @for (link of business.socialLinks; track link.url) {
          <a [href]="link.url" class="btn btn-contour capitalize" rel="noopener" target="_blank">
            <fa-icon [icon]="icon(link)" aria-hidden="true" />
            {{ link.network }}
          </a>
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

  protected icon(link: SocialLink): IconDefinition {
    return SOCIAL_ICONS[link.network];
  }
}
