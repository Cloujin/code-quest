# GEMINI.md — Code Quest

You are one of two coding agents in this repository. The other one is Claude Code, which works
for the other person. Both of you follow the same rules.

Before any work:

1. Read the team status that `.gemini/hooks/session-start.mjs` put at the top of this session. If it
   is missing, run `npm run setup` and read what it prints. Fix every `TODO` line or tell the human.
2. Read the rules and the collaboration protocol imported below. `CLAUDE.md` is the canonical full
   text. Read it before you commit, and read the skill files it names.

## What runs by itself

`.gemini/settings.json` is committed, so these hooks run for anyone who starts Gemini in this repository:

| Hook | Does |
|---|---|
| SessionStart | puts the standing rules, the skills list and the team status at the top of the session |
| BeforeAgent | reinjects the short-answers rule on every prompt. Warns at about 200k tokens of context. At about 400k it orders a handover and a new chat |
| BeforeTool, any tool | past about 600k tokens, the handbrake allows only reading and writing the handover |
| BeforeTool, shell | `scripts/agent-guard.mjs` blocks `--no-verify`, force-pushing `main`, and merging without the other person's approval |
| PreCompress | tells the user that compression drops detail |

## Skills

Skills live in `.agents/skills/`. Activate each one when its moment comes:

- `ask-first`: before any business logic, feature workflow or feature idea.
- `no-inline-comments`: before writing or editing code.
- `git-commit-push`: before the first commit of the session.
- `ui-craft`: before designing, building or reviewing any screen. Run its checklist before calling UI done.
- `short-answers`: always.

The first three are copied from `.claude/skills/` by `npm run setup`. Edit them there, never in `.agents/skills/`.

## Handover

When a chat ends, or the hooks say it is too long, write the handover to `.agent/progress.md` and put it
in the draft pull request under "Where I stopped". Then give the user a one-line handoff message for
the next chat.

Never add a `Co-authored-by` line or any "generated with" line for any agent to a commit or a
pull request. The `commit-msg` hook refuses them.

@./AGENTS.md

@./COLLABORATION.md
