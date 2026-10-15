# Stage 1: Install dependencies
FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN bun install --frozen-lockfile

# Generate Prisma Client
# Generate Prisma Client
RUN DATABASE_URL="postgresql://user:password@localhost:5432/mydb" bunx prisma generate

# Copy application source and TypeScript config
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript
RUN bun run build


# Stage 2: Production runtime
FROM node:22-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copy package metadata and dependencies
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Copy compiled application and Prisma schema/config
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

EXPOSE 3000

CMD ["node", "dist/index.js"]