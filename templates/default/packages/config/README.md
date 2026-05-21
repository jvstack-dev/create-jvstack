# Config

Shared tooling defaults for the monorepo: ESLint flat config and base TypeScript config.

## Stack

ESLint, Prettier, TypeScript (as peer), `eslint-plugin-turbo`.

## Dependencies

No workspace packages. Consumed via:

- `@__APP_NAME__/config/eslint`
- `@__APP_NAME__/config/tsconfig`

## Commands

No package scripts. Extend these exports from app `eslint.config.js` / `tsconfig.json`.

From repo root, lint still runs via apps that reference this package:

```bash
npx turbo lint
```
