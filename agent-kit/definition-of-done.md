# Definition of Done

Run this checklist before opening a PR.

## Code Quality

- [ ] **TypeScript check passes**
  ```bash
  pnpm typecheck
  ```

- [ ] **Linting passes**
  ```bash
  pnpm lint
  ```

- [ ] **Build succeeds**
  ```bash
  pnpm build
  ```

## Functionality

- [ ] **Smoke test passes**: Run the CLI locally
  ```bash
  pnpm start
  # OR
  node dist/index.js
  ```

- [ ] **Template scaffolding works**: If you changed scaffolding logic, test creating a new project
  ```bash
  cd /tmp
  node /path/to/create-flix-yourself/dist/index.js my-test-app
  cd my-test-app
  pnpm install
  pnpm dev
  ```

## Documentation

- [ ] **CLI help text updated** (if adding/changing options)

- [ ] **README updated** (if changing user-facing behavior)

- [ ] **AGENTS.md stays accurate** (if changing architecture)

## Git Hygiene

- [ ] **Conventional Commits** used for all commits

- [ ] **Branch name** follows `<type>/<description>` format

- [ ] **No debug code** (console.logs, commented code, TODOs without issues)

## Versioning

- [ ] **Changeset created** for user-facing changes
  ```bash
  pnpm changeset
  ```

## Scope Check

- [ ] **No business logic added** – features go in `flix-yourself-template`, not here

- [ ] **Code is minimal** – src/ should stay under ~500 lines

- [ ] **Template handles complexity** – CLI just orchestrates

## CI/CD

- [ ] **All checks pass locally** (simulate what CI will do)
  ```bash
  pnpm typecheck && pnpm lint && pnpm build
  ```

---

## Quick Pre-PR Command

Run everything at once:
```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm start --help
```

If this passes and you've created a changeset (if needed), you're ready to push and open a PR.
