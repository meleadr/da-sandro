import { Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTiktok, IconDefinition } from '@fortawesome/free-brands-svg-icons';
import type { SocialLink } from '../../data/types';

const NETWORKS: Record<SocialLink['network'], { label: string; icon: IconDefinition }> = {
  facebook: { label: 'Facebook', icon: faFacebook },
  instagram: { label: 'Instagram', icon: faInstagram },
  tiktok: { label: 'TikTok', icon: faTiktok },
};

@Component({
  selector: 'app-social-links',
  imports: [FaIconComponent],
  host: { class: 'flex flex-wrap gap-2' },
  template: `
    @for (link of links(); track link.url) {
      <a
        class="flex size-10 items-center justify-center rounded-full bg-creme text-lg text-brun transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        rel="noopener"
        target="_blank"
        [attr.aria-label]="'Da Sandro sur ' + network(link).label"
        [href]="link.url"
      >
        <fa-icon [icon]="network(link).icon" aria-hidden="true" />
      </a>
    }
  `,
})
export class SocialLinks {
  readonly links = input.required<readonly SocialLink[]>();

  protected network(link: SocialLink) {
    return NETWORKS[link.network];
  }
}
