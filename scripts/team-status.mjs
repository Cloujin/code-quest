import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const MAIN = "main";
const FETCH_TIMEOUT_MS = 8000;
const GH_TIMEOUT_MS = 8000;
const SHARED_FILES = [
  "src/context/GameContext.tsx",
  "src/types/game.ts",
  "src/data/curriculum.ts",
  "server/db.ts",
  "package.json",
  "package-lock.json",
];

function run(command, args, timeout = 5000) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      timeout,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

export function teamStatus() {
  const lines = ["## Team status (npm run team)"];

  const fetched = run("git", ["fetch", "-q", "origin", "--prune"], FETCH_TIMEOUT_MS) !== null;
  if (!fetched) lines.push("- Could not reach origin. The numbers below may be stale.");

  const branch = run("git", ["branch", "--show-current"]) || "(detached)";
  const dirty = (run("git", ["status", "--porcelain"]) || "").split("\n").filter(Boolean).length;
  lines.push(`- You are on \`${branch}\`${dirty ? `, with ${dirty} uncommitted file(s)` : ""}.`);

  const counts = run("git", ["rev-list", "--left-right", "--count", `origin/${MAIN}...HEAD`]);
  if (counts) {
    const [behind, ahead] = counts.split(/\s+/).map(Number);
    if (branch === MAIN && behind) {
      lines.push(`- Local \`${MAIN}\` is ${behind} commit(s) behind origin. Run \`git pull --ff-only\` first.`);
    } else if (branch !== MAIN && behind) {
      lines.push(`- \`${branch}\` is ${behind} commit(s) behind \`origin/${MAIN}\` and ${ahead} ahead. Rebase with \`git rebase origin/${MAIN}\` before review.`);
    }
  }

  const recent = run("git", ["log", `origin/${MAIN}`, "-5", "--format=%h %an: %s"]);
  if (recent) {
    lines.push(`- Latest on \`${MAIN}\`:`);
    for (const entry of recent.split("\n")) lines.push(`  - ${entry}`);
  }

  const me = run("gh", ["api", "user", "--jq", ".login"], GH_TIMEOUT_MS);
  const prsJson = run(
    "gh",
    ["pr", "list", "--state", "open", "--limit", "30", "--json", "number,title,author,headRefName,isDraft,reviewDecision,files"],
    GH_TIMEOUT_MS,
  );

  if (prsJson === null) {
    lines.push("- `gh` is not signed in or not reachable, so open pull requests are unknown. Run `gh auth login`.");
  } else {
    const prs = JSON.parse(prsJson);
    if (!prs.length) {
      lines.push("- No open pull requests. Nothing is claimed.");
    } else {
      lines.push("- Open pull requests (each one is a claim on its files):");
      for (const pr of prs) {
        const state = pr.isDraft ? "draft" : (pr.reviewDecision || "ready").toLowerCase().replace(/_/g, " ");
        const owner = pr.author?.login === me ? "you" : `@${pr.author?.login}`;
        const shared = (pr.files || []).map((f) => f.path).filter((p) => SHARED_FILES.includes(p));
        const sharedNote = shared.length ? ` | shared files: ${shared.join(", ")}` : "";
        lines.push(`  - #${pr.number} ${pr.title} [${pr.headRefName}] by ${owner}, ${state}${sharedNote}`);
      }
      const toReview = prs.filter((pr) => !pr.isDraft && pr.author?.login !== me && pr.reviewDecision !== "APPROVED");
      if (toReview.length) {
        lines.push(`- Waiting for your review: ${toReview.map((pr) => `#${pr.number}`).join(", ")}.`);
      }
    }
  }

  lines.push("- Protocol: COLLABORATION.md. Claim work with a draft pull request before writing code.");
  return lines.join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(teamStatus());
}
