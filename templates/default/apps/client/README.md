# Client

React frontend that consumes the Convex API.

## Stack

Vite, React, TanStack Router, TanStack Query, Clerk, Convex, Tailwind CSS 4.

## Dependencies

- **@**APP_NAME**/server** — Convex generated API (`./api` export).
- **@**APP_NAME**/ui** — shared UI components and styles.
- **@**APP_NAME**/config** — shared lint/TS config (dev).

## Commands

From repo root:

```bash
npx turbo dev --filter=@__APP_NAME__/client
npx turbo build --filter=@__APP_NAME__/client
npx turbo lint --filter=@__APP_NAME__/client
npx turbo preview --filter=@__APP_NAME__/client
```

From `apps/client`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
