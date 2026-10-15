import { deleteCache, getCache, setCache } from "../../lib/cache.js";
import { redis } from "../../lib/redis.js";
import { acquireLock, releaseLock } from "../../lib/redisLock.js";
import {
  getUserByID,
  getUsers,
  updateUserNameById,
} from "./user.repository.js";

export async function getUsersService() {
  const users = await getUsers();

  return users;
}

export async function getUsersByID({ id }: { id: string }) {
  const cacheKey = `user:profile:${id}`;

  const lockKey = `lock:${cacheKey}`;

  const LOCK_TTL_SECONDS = 10;

  const MAX_RETRIES = 50;

  const RETRY_DELAY_MS = 100;

  // 1. Check Redis cache
  const cachedUser = await getCache<string>(cacheKey);

  // 2. Cache HIT
  if (cachedUser.status === 'hit') {
    console.log("Cache HIT:", cacheKey);

    return cachedUser;
  }

  console.log("Cache MISS:", cacheKey);

  // 3. Try to acquire Redis lock
  const lockToken = await acquireLock(lockKey, LOCK_TTL_SECONDS);

  // 4. Lock acquired
  if (lockToken) {
    try {
      console.log("Lock acquired:", lockKey);

      // 5. Double-check cache
      const cachedUserAfterLock = await getCache<string>(cacheKey);

      if (cachedUserAfterLock.status === 'hit') {
        console.log("Cache HIT after acquiring lock:", cacheKey);

        return cachedUserAfterLock;
      }

      // 7. Query PostgreSQL
      const user = await getUserByID({ id });

      console.log("DB query executed:", id);

      // 8. Store in Redis
      await setCache(cacheKey, user, 5);

      console.log("Cache SET:", cacheKey);

      return user;
    } finally {
      // 9. Release only our own lock
      await releaseLock(lockKey, lockToken);

      console.log("Lock released:", lockKey);
    }
  }

  // 10. Lock is already held by another request
  console.log("Lock busy. Waiting:", lockKey);

  // 11. Wait and retry cache
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

    const cachedUserAfterWait = await getCache<string>(cacheKey);

    if (cachedUserAfterWait) {
      console.log("Cache HIT after waiting:", cacheKey);

      return cachedUserAfterWait;
    }
  }

  // 12. Cache never became available
  throw new Error("Cache unavailable after waiting for lock");
}

export async function updateUserName({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  // Update the user's name in the database
  const updateuser = await updateUserNameById({ id, name });

  deleteCache(`user:profile:${id}`);

  return updateuser;
}
