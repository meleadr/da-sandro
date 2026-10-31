import { FormMail, handleFormSubmission, HandlerResult, MailEnv } from '../shared/form-submission';
import { EventRequest, parseEventRequest } from './event-request';

function toMail(request: EventRequest): FormMail {
  return {
    replyTo: request.email,
    subject: `Demande d'événement : ${request.eventType} le ${request.date}`,
    text: [
      "Nouvelle demande d'événement depuis le site :",
      '',
      `Type : ${request.eventType}`,
      `Date : ${request.date}`,
      `Lieu : ${request.location}`,
      `Personnes : ${request.guests}`,
      '',
      `Nom : ${request.name}`,
      `E-mail : ${request.email}`,
      `Téléphone : ${request.phone || 'non renseigné'}`,
      '',
      'Message :',
      request.message || '(aucun)',
    ].join('\n'),
  };
}

export function handleEventRequest(
  rawBody: string,
  env: MailEnv,
  today: string,
  send: typeof fetch = fetch,
): Promise<HandlerResult> {
  return handleFormSubmission(
    rawBody,
    env,
    (input) => parseEventRequest(input, today),
    toMail,
    send,
  );
}
