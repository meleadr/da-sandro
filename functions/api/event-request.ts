import { handleEventRequest, MailEnv } from '../../src/app/events/handle-event-request';

interface PagesContext {
  readonly request: Request;
  readonly env: MailEnv;
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  const today = new Date().toISOString().slice(0, 10);
  const result = await handleEventRequest(await request.text(), env, today);

  return Response.json(result.body, { status: result.status });
}
