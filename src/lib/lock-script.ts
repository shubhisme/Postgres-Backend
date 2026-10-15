import { acquireLock, releaseLock } from "./redisLock.js";
import { connectedRedis, redis } from "./redis.js";

async function main() {
  await connectedRedis();

  const lockKey = "lock:test:user:123";

  await redis.del(lockKey);

  const token = await acquireLock(lockKey, 10);

  console.log("Lock token: ", token);

  const secondToken = await acquireLock(lockKey, 10);

  console.log("second lock token: ", secondToken);

  if (token) {
    await releaseLock(lockKey, token);
  }

  console.log("Lock released.");

  const tokenBagain = await acquireLock(lockKey, 10);

  console.log("Token B after release: ", tokenBagain);

  if (tokenBagain) {
    await releaseLock(lockKey, tokenBagain);
  }

  await redis.del(lockKey);

  await redis.quit();
}

main();
