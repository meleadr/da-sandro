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
import { business } from '../../data/business';
import { EVENT_TYPES, EventRequest, EventRequestErrors, parseEventRequest } from './event-request';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    @if (status() === 'sent') {
      <div class="rounded-xl bg-brun p-6 text-center text-creme" role="status">
        <p class="font-titre text-xl text-jaune">Merci !</p>
        <p class="mt-2">Votre demande est bien partie. Vous recevrez une réponse par e-mail.</p>
      </div>
    } @else {
      <form class="grid gap-4 text-left sm:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div>
          <label class="champ-label" for="eventType">Type d'événement *</label>
          <select id="eventType" class="champ" formControlName="eventType" [attr.aria-invalid]="invalid('eventType')">
            <option value="">Choisir</option>
            @for (type of eventTypes; track type) {
              <option [value]="type">{{ type }}</option>
            }
          </select>
          @if (error('eventType'); as message) {
            <p class="champ-erreur">{{ message }}</p>
          }
        </div>

        <div>
          <label class="champ-label" for="date">Date *</label>
          <input id="date" class="champ" type="date" formControlName="date" [attr.aria-invalid]="invalid('date')" />
          @if (error('date'); as message) {
            <p class="champ-erreur">{{ message }}</p>
          }
        </div>

        <div>
          <label class="champ-label" for="location">Lieu *</label>
          <input id="location" class="champ" type="text" formControlName="location" [attr.aria-invalid]="invalid('location')" />
          @if (error('location'); as message) {
            <p class="champ-erreur">{{ message }}</p>
          }
        </div>

        <div>
          <label class="champ-label" for="guests">Nombre de personnes *</label>
          <input id="guests" class="champ" type="number" min="1" inputmode="numeric" formControlName="guests" [attr.aria-invalid]="invalid('guests')" />
          @if (error('guests'); as message) {
            <p class="champ-erreur">{{ message }}</p>
          }
        </div>

        <div>
          <label class="champ-label" for="name">Votre nom *</label>
          <input id="name" class="champ" type="text" autocomplete="name" formControlName="name" [attr.aria-invalid]="invalid('name')" />
          @if (error('name'); as message) {
            <p class="champ-erreur">{{ message }}</p>
          }
        </div>

        <div>
          <label class="champ-label" for="email">Votre e-mail *</label>
          <input id="email" class="champ" type="email" autocomplete="email" formControlName="email" [attr.aria-invalid]="invalid('email')" />
          @if (error('email'); as message) {
            <p class="champ-erreur">{{ message }}</p>
          }
        </div>

        <div class="sm:col-span-2">
          <label class="champ-label" for="phone">Téléphone</label>
          <input id="phone" class="champ" type="tel" autocomplete="tel" formControlName="phone" />
        </div>

        <div class="sm:col-span-2">
          <label class="champ-label" for="message">Message</label>
          <textarea id="message" class="champ" rows="4" formControlName="message"></textarea>
          @if (error('message'); as message) {
            <p class="champ-erreur">{{ message }}</p>
          }
        </div>

        <!-- Hidden from visitors: only bots fill it in. -->
        <div class="absolute -left-[9999px]" aria-hidden="true">
          <label for="website">Ne pas remplir</label>
          <input id="website" type="text" tabindex="-1" autocomplete="off" formControlName="website" />
        </div>

        <div class="sm:col-span-2">
          @if (status() === 'failed') {
            <p class="mb-3 rounded-lg bg-brun p-3 text-center text-sm text-creme" role="alert">
              L'envoi a échoué, mais votre demande est conservée ci-dessus. Réessayez, ou appelez-nous
              au <a class="font-bold underline" [href]="'tel:' + phone">{{ phone }}</a>.
            </p>
          }
          <button type="submit" class="btn btn-brun w-full" [disabled]="status() === 'sending'">
            {{ status() === 'sending' ? 'Envoi…' : 'Demander un devis' }}
          </button>
          <p class="mt-3 text-center text-xs font-semibold">
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
      const response = await fetch('/api/demande', {
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
