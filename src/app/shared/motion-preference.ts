import { afterNextRender, DOCUMENT, effect, inject, Service, signal } from '@angular/core';

const STORAGE_KEY = 'motion-paused';

/** Lets visitors stop the looping animations, as WCAG 2.2.2 requires. */
@Service()
export class MotionPreference {
  readonly paused = signal(false);

  constructor() {
    const root = inject(DOCUMENT).documentElement;

    effect(() => root.classList.toggle(STORAGE_KEY, this.paused()));

    afterNextRender(() => {
      try {
        this.paused.set(localStorage.getItem(STORAGE_KEY) === 'true');
      } catch {
        // Storage can be blocked: the choice then only lasts for this visit.
      }
    });
  }

  toggle(): void {
    this.paused.update((paused) => !paused);
    try {
      localStorage.setItem(STORAGE_KEY, String(this.paused()));
    } catch {
      // Storage can be blocked: the choice then only lasts for this visit.
    }
  }
}
