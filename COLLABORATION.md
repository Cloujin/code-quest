# COLLABORATION — Code Quest

Two people build this repository, each with their own coding agent: Alex (`@thealexsan`) works
with Claude Code, and `@itx3010` works with Gemini. Both agents follow the same rules: `CLAUDE.md`
is canonical, `AGENTS.md` is its short form, and this file is the protocol between the two of us.
The rules apply to both agents and to both of us at a bare terminal.

## 1. Before you start

1. `git switch main && git pull --ff-only`. Never start new work from a stale `main`.
2. `npm run setup`, once per clone and again whenever something seems off. It checks Node, turns
   on `.githooks/`, checks your git identity and `gh` sign-in, installs dependencies, creates
   `.env`, and ends with the team status. Anything it cannot fix is printed as `TODO`.
3. `npm run team` shows what changed on `main`, every open pull request, who owns it, and what is
   waiting for your review. Both agents get it automatically at session start: Claude through
   `.claude/settings.json`, Gemini through `.gemini/settings.json`.
4. Read `NEXT_STEPS.md` and the newest entries in `HANDOVER.md` §5.

Start Gemini from the repository root. Its hook commands are relative to where it starts. The first
time, Gemini asks you to trust the project hooks. Say yes, and check them with `/hooks panel`.

## 2. Claim the work before you write code

Each of us has a separate checkout, so the agents cannot see each other's local work. An open
pull request is the only claim both of us can see.

- Pick an item from `NEXT_STEPS.md` or a GitHub issue. If another open pull request already
  touches it, do not start. Ask the other person first.
- Make a branch `type/topic` (`feat/quiz-timer`, `fix/pyodide-timeout`). Push it at once with
  `gh pr create --draft`, and say in the description what you will change.
- One topic per branch. Keep a pull request small enough to review in ten minutes.
- These files are shared hot spots: `src/context/GameContext.tsx`, `src/types/game.ts`,
  `src/data/curriculum.ts`, `server/db.ts`, `package.json` and `package-lock.json`. Before you
  change one of them, check `npm run team` for an open pull request that also changes it. If one
  does, agree who goes first.

## 3. While you work

- Commit each finished unit as `type(scope): subject`. Scopes: `web` `server` `curriculum`
  `engine` `docs` `ci` `repo`.
- Run `npm run check` before every commit. It typechecks the client and the server and builds the
  client. CI runs the same gate.
- Rebase on `main` at least once a day, and again before you ask for review:
  `git fetch origin && git rebase origin/main`, then `git push --force-with-lease`. Force-push
  only your own branch, and never `main`.
- Do not change files the other person's open pull request changes, unless you have agreed
  that with them.
- Change a dependency only in its own pull request. A dependency added in the middle of feature
  work makes conflicts in `package-lock.json`.

## 4. Pull requests

- Fill in every section of the template. "How it was verified" names the commands you ran and
  what you clicked.
- Mark the pull request ready only when CI is green.
- **The other person reviews and approves before the merge.** An agent never merges a pull
  request that the other person has not approved. Neither of us approves our own pull request.
- The author merges, with `gh pr merge --merge --delete-branch`. Then the author does
  `git switch main && git pull --ff-only`.
- Review comments get a reply or a fix commit. Do not resolve the other person's thread
  without one.

## 5. Handovers between people

`.agent/` is git-ignored and exists only on one machine. Nothing the other person needs may stay
only there.

- When a pull request merges, its story goes into `HANDOVER.md` §5 and leftover work goes into
  `NEXT_STEPS.md`, in the same pull request.
- A decision goes into `HANDOVER.md` §3 with the date and who decided. A trap goes into §4.
- If you stop in the middle, push the branch, keep the pull request as a draft, and write
  "Where I stopped" in its description: what is done, what is half done, and the exact next step.
  The other person, or their agent, continues from there.
- To hand a branch to the other person, say so in the pull request. From then on, only they push
  to it.

## 6. What enforces this

| Rule | Where |
|---|---|
| no commit on `main`, no push to `main` | `.githooks/pre-commit`, `.githooks/pre-push`, Claude's `git-guard` |
| no assistant attribution (Claude, Gemini, any agent) | `.githooks/commit-msg`, Claude's `git-guard` |
| no comments added to code | `.githooks/pre-commit` |
| the gate passes | `.github/workflows/ci.yml` on every pull request |
| a review by the other person | the `main` ruleset, `.github/rulesets/main.json` |
| a reviewer is asked automatically | `.github/CODEOWNERS` |
| no `--no-verify`, no `core.hooksPath` change | `scripts/agent-guard.mjs`, in both agents |
| no bare `--force`, no force-push of `main` | `scripts/agent-guard.mjs`, in both agents |
| no `gh pr merge` without the other person's approval | `scripts/agent-guard.mjs`, in both agents; the human can waive it with `CODE_QUEST_ALLOW_UNAPPROVED_MERGE=1` |
| everyone sees the open pull requests | `npm run team`, at session start in both agents |

The ruleset is applied by the repository owner, once:

```bash
gh api -X POST repos/itx3010/code-quest/rulesets --input .github/rulesets/main.json
```

It requires a pull request with one approval, a green `Gate` check on a branch that is up to date
with `main`, and resolved review threads. It blocks force-pushes to `main` and deleting `main`.
