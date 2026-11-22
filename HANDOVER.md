# HANDOVER — Code Quest

The memory of this repository: what it is, why it is shaped this way and what has bitten. Every
session that learns something a later one needs writes it here before it ends.

## 1. What this is

A gamified programming academy: a React and Vite client with a sandboxed code runner, and an Express API with SQLite and an AI mentor.

## 2. How it is put together

- `src/`: the React 19 client, built with Vite and Tailwind 4. `App.tsx` switches between the views in
  `src/components/`. Player state lives in `src/context/GameContext.tsx`, typed by `src/types/game.ts`.
  It is kept in `localStorage` and synced to the server.
- `src/data/`: the content, which is the curriculum, homework, projects and the language portal. Most
  feature work touches it.
- `src/engine/executor.ts`: runs learner code in Web Workers, with Pyodide for Python, plain workers for
  JavaScript, and a sandboxed `<iframe>` for HTML and CSS, each with a timeout.
- `server/`: the Express 5 API on port 3001. `db.ts` uses Node's built-in `node:sqlite` with the file
  `data/codequest.sqlite`. `mentor.ts` is the `/api/mentor` endpoint. It calls OpenAI or Gemini when a key
  is in `.env`, and otherwise falls back to an offline mentor.
- `npm run dev` starts both halves. `npm run check` is the gate: it typechecks the client (root
  `tsconfig.json`) and the server (`server/tsconfig.json`), then builds the client.

## 3. Decisions

Each of these was a choice. Read the reason before reversing one. Add the date and who decided.

1. **2026-11-22, Alex: we keep the existing stack.** The app was built on Vite, React, Express and
   SQLite, not on our default stack (Next.js, Go, Postgres on Neon). Moving it would be a rewrite, so
   it stays as it is. If it ever needs accounts shared across devices, or more than one server, we
   revisit the decision then, starting with Postgres on Neon.
2. **2026-11-22, Alex: two people, one protocol.** `COLLABORATION.md` holds the rules: a draft pull
   request is a claim, and the other person must approve before a merge. `GEMINI.md` imports
   `AGENTS.md`, so Gemini and Claude read the same rules.

## 4. Traps

What looked right and was wrong. One entry per trap: what happens, why, and how to avoid it.

1. **`.githooks/` are off in a fresh clone** until `npm install` runs. The `prepare` script sets
   `core.hooksPath`. A clone that never runs `npm install` commits with no guard.
2. **`.agent/` is on one machine only.** It is git-ignored. Notes the other person needs go in the pull
   request and in this file.
3. **Gemini's project hooks run from where Gemini starts.** `.gemini/settings.json` calls
   `node .gemini/hooks/session-start.mjs` and `node scripts/agent-guard.mjs` by relative path, because
   `$GEMINI_PROJECT_DIR` is not expanded the same way in every Windows shell. Start Gemini from the
   repository root. Gemini also asks to trust project hooks the first time, and again whenever one
   changes.

## 5. Log

Newest first. One entry per change that a later reader needs the story of: what was done, what
was verified, what was left.

- **2026-11-22, chore/gemini-hooks:** Gemini now has its own committed hooks in `.gemini/settings.json`:
  the standing rules and team status at session start, and `scripts/agent-guard.mjs` before every
  shell command. Claude runs the same guard. The guard blocks `--no-verify`, `core.hooksPath` changes,
  a bare `--force`, force-pushing `main`, and `gh pr merge` on an unapproved pull request. Added
  `npm run setup` for each new clone. Verified: guard cases by hand, `npm run setup`, the Gemini
  session-start JSON, and `npm run check`.

- **2026-11-22, chore/agent-setup:** installed groundwork v0.18.0 (rules, hooks, skills, CI and
  security workflows). Added `COLLABORATION.md`, `GEMINI.md`, `npm run team` (also run at every
  Claude session start), `CODEOWNERS`, a pull request template, and the `main` ruleset in
  `.github/rulesets/main.json`. Added `server/tsconfig.json` and the `typecheck` and `check` scripts.
  Verified: `npm run check` passes. Left: the owner applies the ruleset (see `NEXT_STEPS.md`).
