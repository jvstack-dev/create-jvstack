# Server

Convex backend: database schema, functions, and auth configuration

## Dependencies

- **@**APP_NAME**/config** — shared lint config (dev).

Apps depend on this package for the **`./api`** export (generated Convex API for clients).

## Commands

From repo root:

```bash
npx turbo dev --filter=@__APP_NAME__/server
npx turbo lint --filter=@__APP_NAME__/server
npx turbo deploy --filter=@__APP_NAME__/server
```

From `apps/server`:

```bash
npm run dev
npm run deploy
npm run lint
```

Deploy expects Convex credentials (e.g. `CONVEX_DEPLOY_KEY` in CI).
