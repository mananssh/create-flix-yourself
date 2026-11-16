# Agent Rules — create-flix-yourself

**Read this before working in this repo.** This is the CLI orchestrator for flix-yourself. It stays **thin and simple** — no business logic, no feature code.

## Mission

This CLI's job is to **scaffold new instances** of flix-yourself:

1. Prompt the user for config choices
2. Fetch the pinned template from `flix-yourself-template`
3. Write `config.yaml` + `.env.local`
4. Patch the Prisma datasource line
5. Run `pnpm install && pnpm build`
6. Done

**That's it.** No providers, no feature logic, no UI code.

## The Core Rule

> **If you're adding business logic to the CLI, you're doing it wrong.**

Features, providers, and UI belong in `flix-yourself-template`. The CLI only wires config.

### Red Flags (don't do these)

If you find yourself wanting to:
- Add a storage provider → Add it to `flix-yourself-template/src/lib/storage/providers/`
- Add auth logic → Add it to `flix-yourself-template/src/lib/auth/providers/`
- Generate TypeScript files → Add a seam to the template instead
- Fork code paths by config → The template's runtime config already does this
- Add UI components → Absolutely not, that's the template's job
- Implement features → Wrong repo

The CLI writes config files, not code.

## Workflow

- **main is protected** — no direct pushes
- **Branch → PR → CI → merge** for all changes
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `build:`, `chore:`
- **Changesets** (`.changeset/*.md`) for user-facing changes
- See `agent-kit/commit-and-pr.md` for details

## Testing

One smoke test is enough: scaffold a temp instance with `--yes`, run `pnpm install && pnpm build`, assert success. This catches 90% of CLI regressions.

## Expected Structure

```
create-flix-yourself/
├── src/
│   ├── index.ts           # CLI entry point
│   ├── prompts.ts         # @clack/prompts flow
│   ├── fetch-template.ts  # giget wrapper
│   ├── apply-config.ts    # Write config.yaml + .env.local
│   └── patch-prisma.ts    # Datasource line replacement
├── test/
│   └── smoke.test.ts      # Scaffold + build test
└── package.json
```

**Size check:** If `src/` grows past ~500 lines total, something's wrong. This is a thin orchestrator.

## Cross-repo Link

**For feature work**, see `../flix-yourself-template/AGENTS.md` — that's where the app lives and where you should spend 95% of your time.

This repo exists to **ship** the template, not to **be** the template.

## Definition of Done

See `agent-kit/definition-of-done.md` for the checklist.

Quick version:
```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm test
```

If that passes and you've added a changeset, you're good.
