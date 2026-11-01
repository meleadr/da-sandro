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
import { EVENT_TYPES, EventRequest, EventRequestErrors, parseEventRequest } from './event-request';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

@Component({
  selector: 'app-event-form',
  imports: [FaIconComponent, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    @if (status() === 'sent') {
      <div class="rounded-xl bg-brown p-6 text-center text-cream" role="status">
        <p class="font-display text-xl text-yellow">Merci !</p>
        <p class="mt-2">Votre demande est bien partie. Vous recevrez une réponse par e-mail.</p>
      </div>
    } @else {
      <form class="grid gap-4 text-left sm:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div>
          <label class="field-label" for="eventType">Type d'événement *</label>
          <select id="eventType" class="field" formControlName="eventType" [attr.aria-invalid]="invalid('eventType')" [attr.aria-describedby]="error('eventType') ? 'eventType-error' : null" aria-required="true">
            <option value="">Choisir</option>
            @for (type of eventTypes; track type) {
              <option [value]="type">{{ type }}</option>
            }
          </select>
          @if (error('eventType'); as message) {
            <p id="eventType-error" class="field-error">{{ message }}</p>
          }
        </div>

        <div>
          <label class="field-label" for="date">Date *</label>
          <input id="date" class="field" type="date" formControlName="date" [attr.aria-invalid]="invalid('date')" [attr.aria-describedby]="error('date') ? 'date-error' : null" aria-required="true" />
          @if (error('date'); as message) {
            <p id="date-error" class="field-error">{{ message }}</p>
          }
        </div>

        <div>
          <label class="field-label" for="location">Lieu *</label>
          <input id="location" class="field" type="text" formControlName="location" [attr.aria-invalid]="invalid('location')" [attr.aria-describedby]="error('location') ? 'location-error' : null" aria-required="true" />
          @if (error('location'); as message) {
            <p id="location-error" class="field-error">{{ message }}</p>
          }
        </div>

        <div>
          <label class="field-label" for="guests">Nombre de personnes *</label>
          <input id="guests" class="field" type="number" min="1" inputmode="numeric" formControlName="guests" [attr.aria-invalid]="invalid('guests')" [attr.aria-describedby]="error('guests') ? 'guests-error' : null" aria-required="true" />
          @if (error('guests'); as message) {
            <p id="guests-error" class="field-error">{{ message }}</p>
          }
        </div>

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
          <label class="field-label" for="phone">Téléphone</label>
          <input id="phone" class="field" type="tel" autocomplete="tel" formControlName="phone" />
        </div>

        <div class="sm:col-span-2">
          <label class="field-label" for="message">Message</label>
          <textarea id="message" class="field" rows="4" formControlName="message" [attr.aria-invalid]="invalid('message')" [attr.aria-describedby]="error('message') ? 'message-error' : null"></textarea>
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
              L'envoi a échoué, mais votre demande est conservée ci-dessus. Réessayez, ou appelez-nous
              au <a class="font-bold underline" [href]="'tel:' + phone">{{ phoneLabel }}</a>.
            </p>
          }
          <button type="submit" class="btn btn-brown w-full" [disabled]="status() === 'sending'">
            <fa-icon [icon]="sendIcon" aria-hidden="true" />
            {{ status() === 'sending' ? 'Envoi…' : 'Demander un devis' }}
          </button>
          <p class="mt-3 text-center text-sm font-semibold">
            Votre devis vous est envoyé par e-mail. Vos données servent uniquement à répondre à votre demande.
          </p>
        </div>
      </form>
    }
  `,
})
export class EventForm {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly eventTypes = EVENT_TYPES;
  protected readonly phone = business.phone;
  protected readonly phoneLabel = formatPhone(business.phone);
  protected readonly sendIcon = faPaperPlane;
  protected readonly status = signal<Status>('idle');

  protected readonly form = inject(NonNullableFormBuilder).group({
    eventType: '',
    date: '',
    location: '',
    guests: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    website: '',
  });

  private readonly attempted = signal(false);
  private readonly values = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  private readonly errors = computed<EventRequestErrors>(() => {
    const result = parseEventRequest(this.values(), today());
    return result.ok ? {} : result.errors;
  });

  protected error(field: keyof EventRequest): string | undefined {
    return this.attempted() ? this.errors()[field] : undefined;
  }

  protected invalid(field: keyof EventRequest): true | null {
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
      const response = await fetch('/api/event-request', {
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

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
