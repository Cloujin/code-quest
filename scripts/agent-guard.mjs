import { execFileSync } from "node:child_process";

const BLOCKED = 2;
const MAIN = "main";
const MERGE_OVERRIDE = "CODE_QUEST_ALLOW_UNAPPROVED_MERGE";
const FORCE_OVERRIDE = "CODE_QUEST_ALLOW_FORCE_PUSH";

function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve("");
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

function refuse(reason) {
  process.stderr.write(`Blocked by scripts/agent-guard.mjs (COLLABORATION.md): ${reason}\n`);
  process.exit(BLOCKED);
}

function currentBranch() {
  try {
    return execFileSync("git", ["branch", "--show-current"], { encoding: "utf8", timeout: 5000 }).trim();
  } catch {
    return "";
  }
}

function reviewOf(target) {
  const args = ["pr", "view", "--json", "number,reviewDecision,isDraft"];
  if (target) args.splice(2, 0, target);
  try {
    return JSON.parse(execFileSync("gh", args, { encoding: "utf8", timeout: 10000, stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}

function check(command) {
  const segments = command.split(/&&|\|\||;|\n/).map((s) => s.trim()).filter(Boolean);
  for (const segment of segments) {
    const isGit = /^git\b/.test(segment);

    if (isGit && /\s--no-verify\b/.test(segment)) {
      return "`--no-verify` skips .githooks. Fix what the hook refused instead.";
    }
    if (isGit && /^git\s+commit\b/.test(segment) && /\s-[a-zA-Z]*n[a-zA-Z]*\b/.test(segment.replace(/-m\s+("[^"]*"|'[^']*'|\S+)/g, ""))) {
      return "`git commit -n` skips .githooks. Fix what the hook refused instead.";
    }
    if (isGit && /core\.hooksPath/.test(segment) && !/core\.hooksPath\s*=?\s*\.githooks\b/.test(segment)) {
      return "core.hooksPath must stay `.githooks`.";
    }
    if (/^git\s+push\b/.test(segment)) {
      const forced = /\s(--force(?!-with-lease)|-f\b|\+\S)/.test(segment);
      const leased = /\s--force-with-lease\b/.test(segment);
      const toMain = new RegExp(`(\\s|:|\\+)${MAIN}(\\s|$)`).test(segment) || ((forced || leased) && currentBranch() === MAIN);
      if ((forced || leased) && toMain) return `Never force-push \`${MAIN}\`.`;
      if (forced && process.env[FORCE_OVERRIDE] !== "1") {
        return "Use `git push --force-with-lease` on your own branch, never a bare `--force`.";
      }
    }
    const merge = segment.match(/^gh\s+pr\s+merge\b\s*([^\s-]\S*)?/);
    if (merge && process.env[MERGE_OVERRIDE] !== "1") {
      const pr = reviewOf(merge[1]);
      if (!pr) return "Could not read the pull request's review state, so the merge is not allowed.";
      if (pr.isDraft) return `#${pr.number} is still a draft.`;
      if (pr.reviewDecision !== "APPROVED") {
        return `#${pr.number} is not approved by the other person (review: ${pr.reviewDecision || "none"}). Ask them to review it. Only the human can waive this, with ${MERGE_OVERRIDE}=1.`;
      }
    }
  }
  return null;
}

const raw = await readStdin();
let payload = {};
try {
  payload = raw ? JSON.parse(raw) : {};
} catch {
  process.exit(0);
}
const input = payload.tool_input ?? {};
const command = typeof input === "string" ? input : input.command || input.cmd || "";
if (!command) process.exit(0);

const reason = check(command);
if (reason) refuse(reason);
process.exit(0);
