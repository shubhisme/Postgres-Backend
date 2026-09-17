import { createClient } from "redis";

const redis = createClient({
  url: "redis://localhost:6380",
});

redis.on("error", (error) => {
  console.log("error: ", error);
});

async function main() {
  await redis.connect();

  console.log("Redis connected to eviction...");

  const before = await redis.info("stats");

  console.log("\nBefore Writes: \n", before);

  console.log("\nWriting keys...");

  let successfulWrites = 0;
  let failedWrites = 0;

  for (let i = 0; i < 10_000; i++) {
    try {
      await redis.set(`eviction:test:${i}`, "x".repeat(1024));

      successfulWrites++;
    } catch (error) {
      failedWrites++;

      console.error(`Write failed at key ${i}:`, error);
    }

    if (i % 1000 === 0) {
      console.log(`Written ${i} keys`);
    }
  }

  console.log("\nSuccessful writes:", successfulWrites);
  console.log("Failed writes:", failedWrites);

  const after = await redis.info("stats");

  console.log(`\nAfter writes : `, after);

  const dbSize = await redis.dbSize();

  console.log("\nFinal redis  key count: ", dbSize);

  await redis.quit();
}

main().catch(async (error) => {
  console.error(error);

  if (redis.isOpen) {
    await redis.quit();
  }

  process.exit(1);
});
