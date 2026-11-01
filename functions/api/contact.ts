import { contactMail, parseContactRequest } from '../../src/app/contact/contact-request';
import { handleFormSubmission, isSameOrigin, MailEnv } from '../../src/app/shared/form-submission';

interface PagesContext {
  readonly request: Request;
  readonly env: MailEnv;
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (!isSameOrigin(request)) {
    return Response.json({ ok: false }, { status: 403 });
  }

  const result = await handleFormSubmission(
    await request.text(),
    env,
    parseContactRequest,
    contactMail,
  );

  return Response.json(result.body, { status: result.status });
}
