# GEMINI.md — Code Quest

You are one of two coding agents in this repository. The other one is Claude Code, which works
for the other person. Both of you follow the same rules.

Before any work:

1. Read the team status that `.gemini/hooks/session-start.mjs` put at the top of this session. If it
   is missing, run `npm run setup` and read what it prints. Fix every `TODO` line or tell the human.
2. Read the rules and the collaboration protocol imported below. `CLAUDE.md` is the canonical full
   text. Read it before you commit, and read the skill files it names.

Never add a `Co-authored-by` line or any "generated with" line for any agent to a commit or a
pull request. The `commit-msg` hook refuses them.

@./AGENTS.md

@./COLLABORATION.md
