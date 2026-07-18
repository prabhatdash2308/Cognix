# syntax=docker/dockerfile:1

# ── Base ─────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ── Prune the workspace to just what @cognix/web needs ──────────────────────
FROM base AS pruner
RUN corepack prepare pnpm@9.15.4 --activate
COPY . .
RUN pnpm dlx turbo@^2.5.0 prune @cognix/web --docker

# ── Install dependencies and build ──────────────────────────────────────────
FROM base AS builder
RUN corepack prepare pnpm@9.15.4 --activate
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@cognix/web

# ── Runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
USER nextjs

# Next.js standalone output bundles the server and its dependencies.
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/web/server.js"]
