import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

const HIDDEN = 'reveal-pending';
const SHOWN = 'reveal-visible';

/**
 * Fades a section in when it scrolls into view. The hidden state is only applied from the
 * browser, so the content stays visible without JavaScript and in the prerendered HTML.
 */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const alreadyInView = element.getBoundingClientRect().top < innerHeight;
      if (reduced || alreadyInView || !('IntersectionObserver' in window)) {
        return;
      }

      element.classList.add(HIDDEN);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            element.classList.add(SHOWN);
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
