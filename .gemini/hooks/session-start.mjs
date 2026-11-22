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
  "Skills in .agents/skills, activate each with activate_skill when its moment comes:",
  "- ask-first: before any business logic, feature workflow or feature idea",
  "- no-inline-comments: before writing or editing code",
  "- git-commit-push: before the first commit of the session",
  "- ui-craft: before designing, building or reviewing any screen; run its checklist before calling UI done",
  "- short-answers: now, and keep it for the whole session",
  "Long chats: at about 200k tokens you are warned, at about 400k you write a handover and the user opens a new chat, and at about 600k a handbrake allows only the handover.",
].join("\n");

process.stdout.write(JSON.stringify({ hookSpecificOutput: { additionalContext: context } }));
