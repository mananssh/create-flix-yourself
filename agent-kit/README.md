# Agent Kit: create-flix-yourself

This directory contains AI agent workflows and checklists for the **create-flix-yourself CLI orchestrator**.

## Quick Links

- [Commit and PR Workflow](commit-and-pr.md) - Git workflow, Conventional Commits, changesets
- [Definition of Done](definition-of-done.md) - Pre-PR checklist
- [Main Agent Guide](../AGENTS.md) - Core principles and architecture rules

## Purpose

This CLI is a **thin orchestrator** that scaffolds FlixYourself projects from templates.

**All feature work happens in `../flix-yourself-template/`.** See that repo's agent-kit for detailed workflows around auth, storage, video players, database schemas, etc.

## What This Repo Does

```
User input → Fetch template → Write config → Patch Prisma → Install → Done
```

That's it. If you're adding business logic, you're in the wrong repo.

## Workflow Summary

1. **Create feature branch**: `git checkout -b feat/my-change`
2. **Make changes** (keep it minimal!)
3. **Follow Conventional Commits**
4. **Run [definition-of-done](definition-of-done.md)** checklist
5. **Create changeset** if user-facing: `pnpm changeset`
6. **Open PR** with clear description
7. **CI passes** → merge
8. **Delete branch** after merge

## Key Constraints

- **~500 lines max** in `src/` – this is a simple CLI
- **No feature implementations** – they go in the template
- **No complex abstractions** – keep it like a shell script with nice UX

## For Complex Feature Work

See `../flix-yourself-template/agent-kit/` – that's where the real development happens.

This CLI just exposes those features during project scaffolding.
