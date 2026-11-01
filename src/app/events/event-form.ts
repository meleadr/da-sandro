import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, schema, validateTree } from '@angular/forms/signals';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import { formatPhone } from '../shared/format-phone';
import { focusFirstError, postForm, toFieldErrors, visibleError } from '../shared/form-helpers';
import { EVENT_TYPES, parseEventRequest } from './event-request';

interface EventFormModel {
  eventType: string;
  date: string;
  location: string;
  guests: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Hidden from visitors: only bots fill it in. */
  website: string;
}

const eventFormSchema = schema<EventFormModel>((path) => {
  validateTree(path, ({ value, fieldTree }) => {
    const today = new Date().toISOString().slice(0, 10);
    const result = parseEventRequest(value(), today);
    return result.ok ? null : toFieldErrors(result.errors, fieldTree);
  });
});

@Component({
  selector: 'app-event-form',
  imports: [FaIconComponent, FormField, FormRoot],
  host: { class: 'block' },
  templateUrl: './event-form.html',
})
export class EventForm {
  private readonly model = signal<EventFormModel>({
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

  protected readonly eventTypes = EVENT_TYPES;
  protected readonly phone = business.phone;
  protected readonly phoneLabel = formatPhone(business.phone);
  protected readonly sendIcon = faPaperPlane;
  protected readonly sent = signal(false);
  protected readonly failed = signal(false);
  protected readonly error = visibleError;

  protected readonly form = form(this.model, eventFormSchema, {
    submission: {
      action: async () => {
        this.failed.set(false);
        const delivered = await postForm('/api/event-request', this.model());
        this.sent.set(delivered);
        this.failed.set(!delivered);
      },
      onInvalid: (field) => focusFirstError(field),
    },
  });
}
