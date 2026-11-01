import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import { formatPhone } from '../shared/format-phone';
import { ContactRequest, ContactRequestErrors, parseContactRequest } from './contact-request';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

@Component({
  selector: 'app-contact-form',
  imports: [FaIconComponent, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    @if (status() === 'sent') {
      <div class="rounded-xl bg-brown p-6 text-center text-cream" role="status">
        <p class="font-display text-xl text-yellow">Merci !</p>
        <p class="mt-2">Votre message est bien parti. Nous vous répondrons par e-mail.</p>
      </div>
    } @else {
      <form class="grid gap-4 text-left sm:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div>
          <label class="field-label" for="name">Votre nom *</label>
          <input id="name" class="field" type="text" autocomplete="name" formControlName="name" [attr.aria-invalid]="invalid('name')" [attr.aria-describedby]="error('name') ? 'name-error' : null" aria-required="true" />
          @if (error('name'); as message) {
            <p id="name-error" class="field-error">{{ message }}</p>
          }
        </div>

        <div>
          <label class="field-label" for="email">Votre e-mail *</label>
          <input id="email" class="field" type="email" autocomplete="email" formControlName="email" [attr.aria-invalid]="invalid('email')" [attr.aria-describedby]="error('email') ? 'email-error' : null" aria-required="true" />
          @if (error('email'); as message) {
            <p id="email-error" class="field-error">{{ message }}</p>
          }
        </div>

        <div class="sm:col-span-2">
          <label class="field-label" for="message">Votre message *</label>
          <textarea id="message" class="field" rows="5" formControlName="message" [attr.aria-invalid]="invalid('message')" [attr.aria-describedby]="error('message') ? 'message-error' : null" aria-required="true"></textarea>
          @if (error('message'); as message) {
            <p id="message-error" class="field-error">{{ message }}</p>
          }
        </div>

        <!-- Hidden from visitors: only bots fill it in. -->
        <div class="absolute -left-[9999px]" aria-hidden="true">
          <label for="website">Ne pas remplir</label>
          <input id="website" type="text" tabindex="-1" autocomplete="off" formControlName="website" />
        </div>

        <div class="sm:col-span-2">
          @if (status() === 'failed') {
            <p class="mb-3 rounded-lg bg-brown p-3 text-center text-sm text-cream" role="alert">
              L'envoi a échoué, mais votre message est conservé ci-dessus. Réessayez, ou appelez-nous
              au <a class="font-bold underline" [href]="'tel:' + phone">{{ phoneLabel }}</a>.
            </p>
          }
          <button type="submit" class="btn btn-brown w-full" [disabled]="status() === 'sending'">
            <fa-icon [icon]="sendIcon" aria-hidden="true" />
            {{ status() === 'sending' ? 'Envoi…' : 'Envoyer' }}
          </button>
          <p class="mt-3 text-center text-sm font-semibold">
            Vos données servent uniquement à répondre à votre message.
          </p>
        </div>
      </form>
    }
  `,
})
export class ContactForm {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly phone = business.phone;
  protected readonly phoneLabel = formatPhone(business.phone);
  protected readonly sendIcon = faPaperPlane;
  protected readonly status = signal<Status>('idle');

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: '',
    email: '',
    message: '',
    website: '',
  });

  private readonly attempted = signal(false);
  private readonly values = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  private readonly errors = computed<ContactRequestErrors>(() => {
    const result = parseContactRequest(this.values());
    return result.ok ? {} : result.errors;
  });

  protected error(field: keyof ContactRequest): string | undefined {
    return this.attempted() ? this.errors()[field] : undefined;
  }

  protected invalid(field: keyof ContactRequest): true | null {
    return this.error(field) ? true : null;
  }

  protected async submit(): Promise<void> {
    if (this.status() === 'sending') {
      return;
    }

    this.attempted.set(true);
    if (Object.keys(this.errors()).length > 0) {
      afterNextRender(() => this.focusFirstError(), { injector: this.injector });
      return;
    }

    this.status.set('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.getRawValue()),
      });
      this.status.set(response.ok ? 'sent' : 'failed');
    } catch {
      this.status.set('failed');
    }
  }

  private focusFirstError(): void {
    this.element.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }
}
