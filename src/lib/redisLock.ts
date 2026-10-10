import { randomUUID } from "crypto";
import { redis } from "./redis.ts";

export async function acquireLock(key: string, ttlSeconds: number) {
  const token = randomUUID();

  const result = await redis.set(key, token, {
    NX: true,
    EX: ttlSeconds,
  });

  return result !== "OK" ? null : token;
}

const RELEASE_LOCK_SCRIPT = `
    if redis.call("GET" , KEYS[1]) == ARGV[1] then
        return redis.call("DEL" , KEYS[1])
    else
        return 0
    end
`;

export async function releaseLock(key: string, token: string) {
  await redis.eval(RELEASE_LOCK_SCRIPT, {
    keys: [key],
    arguments: [token],
  });
}
