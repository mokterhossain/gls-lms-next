import { AsyncLocalStorage } from "async_hooks";

type Context = {
  userId?: string;
  ip?: string;
};

const storage = new AsyncLocalStorage<Context>();

export const RequestContext = {
  run: (ctx: Context, fn: () => void) => storage.run(ctx, fn),
  get: () => storage.getStore(),
};