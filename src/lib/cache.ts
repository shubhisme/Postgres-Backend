import { redis } from "./redis.ts";

export type cacheReadResult<T> =
  | {
      status: "hit";
      value: T;
    }
  | { status: "miss" }
  | { status: "error"; error: unknown };

export async function getCache<T>(key: string): Promise<cacheReadResult<T>> {
  try {
    const value = await redis.get(key);

    if (value === null) {
      return {
        status: "miss",
      };
    }

    try {
      console.log(`Cache hit for key ${key}: `, value);
      return {
        status: "hit",
        value: JSON.parse(value) as T,
      };
    } catch (error) {
      console.error(`Cache JSON parse failed for key ${key}: `, error);
      return {
        status: "error",
        error,
      };
    }
  } catch (error) {
    console.error(`Cache get failed for key ${key} : ${error}`);
    return {
      status: "error",
      error,
    };
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (err) {
    console.error(`Cache set failed for key ${key} :${err}`);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`Cache DELETE failed for ${key} : ${err}`);
  }
}
