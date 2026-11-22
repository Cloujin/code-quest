# AGENTS.md — Code Quest

Portable instructions for any coding agent working in this repository: Antigravity, Cursor,
Copilot, Gemini CLI, Codex, Windsurf, Aider, Claude Code, or a human at a terminal.

This file is the index and the short form. **`CLAUDE.md` holds the rules in full and is
canonical.** When a rule changes, change it there and check that this summary still matches.

## What this is

A gamified programming academy: a React and Vite client with a sandboxed code runner, and an Express API with SQLite and an AI mentor.

## Two people, two agents

Alex (`@thealexsan`, Claude Code) and `@itx3010` (Gemini) build this together, each in their own
checkout. **Read `COLLABORATION.md` before any work.** Run `npm run team` first, claim work with a
draft pull request, rebase on `main` before review, never merge without the other person's
approval, and write every handover into the pull request and `HANDOVER.md`.

## The rules that are not negotiable

1. **Ask before inventing product logic** — `.claude/skills/ask-first/SKILL.md`. Never assume a
   business rule, a workflow step or the purpose of a feature. Read the repo first, then ask,
   batch the questions, and write the answer into a test, a name or `HANDOVER.md`.
2. **No comments in code** — `.claude/skills/no-inline-comments/SKILL.md`. Only toolchain
   directives that name their rule. Explanation goes in a name, a constant, a test or a document.
3. **Commit protocol** — `.claude/skills/git-commit-push/SKILL.md`. `type(scope): subject`, one
   finished unit per commit, a branch and a pull request, never a commit on `main`, never a
   red or pending check merged, never a merge without the other person's approval, the user's identity and no assistant attribution. `.githooks/`
   enforces it after `git config core.hooksPath .githooks`.
4. **Verify before claiming.** The gate before every commit:

   ```bash
   npm run check
   ```

## Read before working

| File | When |
|---|---|
| `COLLABORATION.md` | first, every session: how the two of us share this repository |
| `NEXT_STEPS.md` | when picking the repository up |
| `HANDOVER.md` §4 | before changing anything — the traps |
| `HANDOVER.md` §3 | before proposing a different design — it may have been decided |
| `.claude/rules/security.md` | before anything that reads or writes user data |
| `.claude/rules/performance.md` | before a query, a list, a cache or a heavy component |
| `.claude/rules/page-weight.md` | before adding a dependency or client code to a page |
| `.claude/rules/ui.md` | before building or changing a screen |

Working notes go in `.agent/` (git-ignored) and move to `HANDOVER.md` or `NEXT_STEPS.md` when
the change lands.
