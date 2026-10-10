import { AppError } from "../errors/AppError.ts";
import { redis } from "./redis.ts";

const SESSION_PREFIX = "session:";

interface RedisSession {
  userId: string;
  expiresAt: string;
}

function getSessionKey(tokenHash: string) {
  return `${SESSION_PREFIX}${tokenHash}`;
}

export async function createSession(
  tokenHash: string,
  userId: string,
  expiresAt: Date,
): Promise<boolean> {
  const key = getSessionKey(tokenHash);
  const ttlSeconds = Math.ceil((expiresAt.getTime() - Date.now()) / 1000);

  const session: RedisSession = {
    userId,
    expiresAt: expiresAt.toISOString(),
  };

  if (ttlSeconds <= 0) {
    throw new AppError("Cannot create a session that is already expired", 400);
  }

  const result = await redis.set(key, JSON.stringify(session), {
    EX: ttlSeconds,
    NX: true,
  });

  return result === "OK";
}

export async function getSession(
  tokenHash: string,
): Promise<RedisSession | null> {
  const key = getSessionKey(tokenHash);
  const value = await redis.get(key);

  if (value === null) {
    return null;
  }

  let session: unknown = JSON.parse(value);
  if (typeof session === "string") {
    session = JSON.parse(session);
  }

  if (
    typeof session !== "object" ||
    session === null ||
    !("userId" in session) ||
    typeof session.userId !== "string"
  ) {
    throw new AppError("Invalid session data in Redis", 500);
  }

  const expiresAt =
    "expiresAt" in session
      ? session.expiresAt
      : "expireAt" in session
        ? session.expireAt
        : null;
  if (typeof expiresAt !== "string") {
    throw new AppError("Invalid session expiration data in Redis", 500);
  }

  return {
    userId: session.userId,
    expiresAt,
  };
}

export async function deleteSession(tokenHash: string) {
  const key = getSessionKey(tokenHash);

  await redis.del(key);
}
