import "dotenv/config";
import app from "./app.ts";
import config from "./config/config.ts";
import {db} from "./lib/db.ts";
import {redis} from "./lib/redis.ts"

const PORT = Number(config.PORT);

async function startServer() {
  try {
    await redis.connect();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
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
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

void startServer();