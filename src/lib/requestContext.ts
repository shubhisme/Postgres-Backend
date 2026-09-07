import { AsyncLocalStorage } from "node:async_hooks";

export interface RequestContext {
  dbQueryCount: number;
  dbQueryTime: number;
}

export const requestContext = new AsyncLocalStorage<RequestContext>()
