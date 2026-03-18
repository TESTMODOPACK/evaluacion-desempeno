FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
COPY . .
# Run turbo prune to isolate the package
RUN npx turbo prune @repo/api --docker

# Installer
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Generate Prisma Client
RUN pnpm --filter @repo/api run db:generate

# Build the api project
RUN pnpm turbo build --filter=@repo/api

# Runner
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy built application and required production files
COPY --from=installer --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nestjs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=installer --chown=nestjs:nestjs /app/apps/api/dist ./apps/api/dist
COPY --from=installer --chown=nestjs:nestjs /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer --chown=nestjs:nestjs /app/packages/prisma/schema.prisma ./packages/prisma/schema.prisma
COPY --from=installer --chown=nestjs:nestjs /app/packages/prisma/migrations ./packages/prisma/migrations
COPY --from=installer --chown=nestjs:nestjs /app/packages/prisma/seed.ts ./packages/prisma/seed.ts
COPY --from=installer --chown=nestjs:nestjs /app/packages/prisma/package.json ./packages/prisma/package.json

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]
