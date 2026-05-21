# @jvstack/create-jvstack

Scaffold a Turborepo monorepo with Convex, Clerk, Vite, React, TanStack, and shadcn/ui.

Note that the CLI is pure AI slop and did not recieve as much care as the template it self

## Usage

```bash
npm create jvstack@latest
```

You will be prompted for:

1. **App name** — `my-app` creates `./my-app` (replaces `__APP_NAME__`); `.` scaffolds into the **current directory** (must be empty)
2. **shadcn preset code** — from [ui.shadcn.com/create](https://ui.shadcn.com/create) (e.g. `a2r6bw`)
3. **Git** — optional; confirm to run `git init` and create an initial commit (default: yes)

The CLI runs `npm install`, applies the shadcn preset in `packages/ui`, then optionally initializes git.

Non-interactive (CI):

```bash
node dist/index.js my-app a2r6bw
node dist/index.js my-app a2r6bw --skip-git
# or in an empty directory:
node dist/index.js . a2r6bw
```

## Template placeholders

Use `__APP_NAME__` anywhere in `templates/default` (package names, imports, README, turbo filters, etc.).

## Development

```bash
npm install
npm run build
node dist/index.js my-test-app
```

## License

MIT
