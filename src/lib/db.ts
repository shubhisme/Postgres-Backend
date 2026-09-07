import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { requestContext } from "./requestContext.ts";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const db = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query  }) {
        console.log("PRISMA QUERY INTERCEPTED:", model, operation);
        const context = requestContext.getStore();

        const start = process.hrtime.bigint();

        try {
          return await query(args);
        } finally {
          if (context) {
            const end = process.hrtime.bigint();

            context.dbQueryCount += 1;

            context.dbQueryTime += Number(end - start) / 1_000_000;
          }
        }
      },
    },
  },
});
