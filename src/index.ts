import "dotenv/config";
import app from "./app.js";
import config from "./config/config.js";
import { db } from "./lib/db.js";
import { redis } from "./lib/redis.js";

const PORT = Number(config.PORT) || 5001;

async function startServer() {
  try {
    await redis.connect();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server is running on port ${PORT} | instance : ${process.env.INSTANCE_ID}`,
      );
    });

    process.on("SIGTERM", () => {
      GracefulShutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      GracefulShutdown("SIGINT");
    });

    async function shutdown(signal: string) {
      console.log(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        try {
          await redis.quit();
          await db.$disconnect();

          console.log("Redis connection closed");
          console.log("Database connection closed");
          console.log("HTTP server closed");

          process.exit(0);
        } catch (err) {
          console.error("Error during shutdown:", err);
          process.exit(1);
        }
      });
    }

    async function GracefulShutdown(signal: string) {
      console.log(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("HTTP server closed");

        try {
          await db.$disconnect();

          console.log("Database connection closed");

          await redis.quit();

          console.log("Redis connection closed");

          process.exit(0);
        } catch (err) {
          console.error("Error during shutdown:", err);
          process.exit(1);
        }
      });
    }
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

void startServer();
