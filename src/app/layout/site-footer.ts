import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { business } from '../../data/business';
import { SocialLinks } from '../shared/social-links';
import { NAV_LINKS } from './nav-links';

const AUTHOR = { name: 'Adriano Meledina', linkedinUrl: 'https://www.linkedin.com/in/adrianomeledina/' };

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, FaIconComponent, SocialLinks],
  host: { class: 'block bg-brun text-creme' },
  template: `
    <footer class="mx-auto grid max-w-6xl gap-5 px-4 py-8 md:grid-cols-2 md:items-end">
      <div>
        <p class="font-titre text-xl text-jaune">Da Sandro</p>
        <p class="mt-1 text-sm">Pizzeria food truck en région liégeoise</p>
        @if (socialLinks.length > 0) {
          <app-social-links class="mt-3" [links]="socialLinks" />
        }
      </div>

      <nav aria-label="Pied de page" class="flex flex-wrap gap-x-5 gap-y-2 text-sm md:justify-end">
        <a routerLink="/carte" class="underline-offset-4 hover:underline">La carte</a>
        @for (link of links; track link.path) {
          <a [routerLink]="link.path" class="underline-offset-4 hover:underline">{{
            link.label
          }}</a>
        }
        <a routerLink="/mentions-legales" class="underline-offset-4 hover:underline">
          Mentions légales
        </a>
      </nav>
      <p class="text-center text-xs md:col-span-2">
        © {{ year }}
        @if (author.linkedinUrl) {
          <a
            class="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
            rel="noopener"
            target="_blank"
            [href]="author.linkedinUrl"
          >
            {{ author.name }}
            <fa-icon class="text-sm" [icon]="linkedinIcon" aria-hidden="true" />
            <span class="sr-only">(LinkedIn)</span>
          </a>
        } @else {
          {{ author.name }}
        }
      </p>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly author = AUTHOR;
  protected readonly linkedinIcon = faLinkedin;
  protected readonly links = NAV_LINKS;
  protected readonly socialLinks = business.socialLinks;
  protected readonly year = new Date().getFullYear();
}
