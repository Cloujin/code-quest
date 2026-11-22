import { readFileSync } from "node:fs";
import { join } from "node:path";
import { teamStatus } from "../../scripts/team-status.mjs";

const root = process.env.GEMINI_PROJECT_DIR || process.cwd();
const rules = readFileSync(join(root, ".claude", "standing-rules.md"), "utf8");

const context = [
  "## Code Quest standing rules (injected by .gemini/hooks/session-start.mjs)",
  "",
  rules.trim(),
  "",
  teamStatus(),
  "",
  "You are Gemini, working for @itx3010. The other agent is Claude Code, working for Alex (@thealexsan).",
  "Before your first commit, read CLAUDE.md and .claude/skills/git-commit-push/SKILL.md.",
].join("\n");

process.stdout.write(JSON.stringify({ hookSpecificOutput: { additionalContext: context } }));
