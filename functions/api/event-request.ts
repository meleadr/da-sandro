import { handleEventRequest } from '../../src/app/events/handle-event-request';
import { isSameOrigin, MailEnv } from '../../src/app/shared/form-submission';

interface PagesContext {
  readonly request: Request;
  readonly env: MailEnv;
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (!isSameOrigin(request)) {
    return Response.json({ ok: false }, { status: 403 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const result = await handleEventRequest(await request.text(), env, today);

  return Response.json(result.body, { status: result.status });
}
