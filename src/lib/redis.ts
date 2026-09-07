import { createClient } from "redis";
import config from "../config/config.ts";

export const redis = createClient({
  url: config.REDIS_URL || "",
});

redis.on("connect", () => {
  console.log("Redis connecting...");
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

redis.on("end", () => {
  console.log("Redis connection closed");
});

export async function connectedRedis() {
  if (redis.isOpen) {
    return;
  }

  await redis.connect();
}
