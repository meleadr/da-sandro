import { Component, computed, inject, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { MotionPreference } from './motion-preference';

@Component({
  selector: 'app-motion-toggle',
  imports: [FaIconComponent],
  host: { class: 'motion-reduce:hidden' },
  template: `
    <button
      type="button"
      class="inline-flex min-h-6 min-w-6 cursor-pointer items-center justify-center gap-1.5"
      [attr.aria-label]="compact() ? label() : null"
      [attr.aria-pressed]="motion.paused()"
      (click)="motion.toggle()"
    >
      <fa-icon [icon]="icon()" aria-hidden="true" />
      @if (!compact()) {
        <span class="underline underline-offset-2">{{ label() }}</span>
      }
    </button>
  `,
})
export class MotionToggle {
  /** Shows the icon alone, with the same accessible name. */
  readonly compact = input(false);

  protected readonly motion = inject(MotionPreference);
  protected readonly icon = computed(() => (this.motion.paused() ? faPlay : faPause));
  protected readonly label = computed(() =>
    this.motion.paused() ? 'Relancer les animations' : 'Mettre les animations en pause',
  );
}
