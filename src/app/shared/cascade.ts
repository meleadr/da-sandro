import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

const HIDDEN = 'cascade-pending';
const SHOWN = 'cascade-visible';

/**
 * Brings the items of a list in one after the other when it scrolls into view: the pizzas
 * on the menu board, the photos on the table. The hidden state is only applied from the
 * browser, so the items stay visible without JavaScript and in the prerendered HTML.
 */
@Directive({ selector: '[appCascade]' })
export class Cascade {
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const alreadyInView = element.getBoundingClientRect().top < innerHeight;
      if (reduced || alreadyInView || !('IntersectionObserver' in window)) {
        return;
      }

      Array.from(element.children).forEach((child, index) =>
        (child as HTMLElement).style.setProperty('--cascade-index', String(index)),
      );
      element.classList.add(HIDDEN);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            element.classList.add(SHOWN);
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -15% 0px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
