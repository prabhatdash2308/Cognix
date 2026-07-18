# Cognix

**The AI Organization Operating System.**

Cognix enables organizations to create, manage, and collaborate with autonomous
AI teams through shared memory, workflows, projects, tasks, documents, and
intelligent agents.

---

## Monorepo layout

```
apps/
  web        Next.js 15 + TypeScript web client
  api        FastAPI backend service
  gateway    API gateway (placeholder)
  desktop    Desktop client (placeholder)
  mobile     Mobile client (placeholder)
packages/
  ui         Shared React UI primitives
  config     Shared TS / ESLint / Prettier config
  types      Shared domain & transport types
  database   Prisma schema & client
  auth       Tokens, sessions, password hashing
  ai         Typed Anthropic client wrapper
  sdk        Typed API client
services/    Deployable backend microservices (empty)
agents/      Autonomous agent runtimes (empty)
```

Managed with [Turborepo](https://turbo.build) and [pnpm](https://pnpm.io)
workspaces.

## Requirements

- Node.js `>=20.11` (see [`.nvmrc`](./.nvmrc))
- pnpm `>=9` (`corepack enable`)
- Python `>=3.11` and [uv](https://docs.astral.sh/uv/) (for `apps/api`)
- Docker (optional, for containerized runs)

## Getting started

```bash
corepack enable
pnpm install
cp .env.example .env

pnpm dev            # run all apps in dev mode
```

## Common tasks

| Command          | Description                                 |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Run all apps in watch mode                  |
| `pnpm build`     | Build every package and app                 |
| `pnpm lint`      | Lint the workspace (zero warnings enforced) |
| `pnpm typecheck` | Strict TypeScript type checking             |
| `pnpm format`    | Format with Prettier                        |
| `pnpm test`      | Run tests across the workspace              |

## Docker

```bash
docker compose up --build
```

Brings up Postgres, Redis, the API (`:8000`), and the web app (`:3000`).

## Conventions

- **TypeScript strict mode** everywhere; `any` is disallowed.
- **Conventional Commits** enforced via commitlint + Husky.
- **Formatting & linting** run automatically on staged files (lint-staged).
