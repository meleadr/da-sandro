import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, schema, validateTree } from '@angular/forms/signals';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { business } from '../../data/business';
import { formatPhone } from '../shared/format-phone';
import { focusFirstError, postForm, toFieldErrors, visibleError } from '../shared/form-helpers';
import { parseContactRequest } from './contact-request';

interface ContactFormModel {
  name: string;
  email: string;
  message: string;
  /** Hidden from visitors: only bots fill it in. */
  website: string;
}

const contactFormSchema = schema<ContactFormModel>((path) => {
  validateTree(path, ({ value, fieldTree }) => {
    const result = parseContactRequest(value());
    return result.ok ? null : toFieldErrors(result.errors, fieldTree);
  });
});

@Component({
  selector: 'app-contact-form',
  imports: [FaIconComponent, FormField, FormRoot],
  host: { class: 'block' },
  templateUrl: './contact-form.html',
})
export class ContactForm {
  private readonly model = signal<ContactFormModel>({
    name: '',
    email: '',
    message: '',
    website: '',
  });

  protected readonly phone = business.phone;
  protected readonly phoneLabel = formatPhone(business.phone);
  protected readonly sendIcon = faPaperPlane;
  protected readonly sent = signal(false);
  protected readonly failed = signal(false);
  protected readonly error = visibleError;

  protected readonly form = form(this.model, contactFormSchema, {
    submission: {
      action: async () => {
        this.failed.set(false);
        const delivered = await postForm('/api/contact', this.model());
        this.sent.set(delivered);
        this.failed.set(!delivered);
      },
      onInvalid: (field) => focusFirstError(field),
    },
  });
}
