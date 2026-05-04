import { RequestContext } from "./request-context";

export function withContext(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const userId = req.headers.get("x-user-id") || undefined;
    const ip = req.headers.get("x-ip") || undefined;

    return RequestContext.run({ userId, ip }, async () => {
      return handler(req);
    });
  };
}