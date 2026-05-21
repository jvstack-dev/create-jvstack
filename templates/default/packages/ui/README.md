# UI

Shared React component library and global styles for web apps (Vite + Tailwind).

## Stack

React, Tailwind CSS 4, shadcn/Radix-style primitives (Base UI, Radix UI, lucide-react, etc.), Vite/React tooling for local lint.

## Dependencies

- **@**APP_NAME**/config** — shared lint config (dev).

**Consumers:** **@**APP_NAME**/admin** (see that app’s `package.json`).

## Commands

From repo root:

```bash
npx turbo lint --filter=@__APP_NAME__/ui
```

From `packages/ui`:

```bash
npm run lint
npm run lint:fix
```
