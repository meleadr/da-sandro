import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { business } from '../../data/business';

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /** With a trailing slash, as served in production. */
  readonly path: string;
  readonly structuredData?: Record<string, unknown> | null;
  /** For pages that must stay out of search results. */
  readonly noindex?: boolean;
}

/** Sets the head of a page. It runs during prerendering, so the tags are in the static HTML. */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  set(page: PageSeo): void {
    const url = `${business.siteUrl}${page.path}`;

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });

    for (const [property, content] of [
      ['og:title', page.title],
      ['og:description', page.description],
      ['og:url', url],
      ['og:type', 'website'],
      ['og:locale', 'fr_BE'],
      ['og:site_name', business.name],
      ['og:image', `${business.siteUrl}/og-image.png`],
    ]) {
      this.meta.updateTag({ property, content });
    }
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    if (page.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
    } else {
      this.meta.removeTag('name="robots"');
    }

    this.setCanonical(url);
    this.setStructuredData(page.structuredData ?? null);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setStructuredData(data: Record<string, unknown> | null): void {
    this.document.head.querySelector('script[data-seo]')?.remove();
    if (!data) {
      return;
    }

    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo', '');
    // Stops a value from closing the script tag early.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    this.document.head.appendChild(script);
  }
}
