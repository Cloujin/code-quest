import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { teamStatus } from "./team-status.mjs";

const MIN_NODE_MAJOR = 24;
const HOOKS_PATH = ".githooks";
const IS_WINDOWS = process.platform === "win32";

const done = [];
const todo = [];

function run(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8", timeout: 20000, stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return null;
  }
}

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < MIN_NODE_MAJOR) {
  todo.push(`Node ${process.versions.node} is too old: the server uses node:sqlite, which needs Node ${MIN_NODE_MAJOR} or newer.`);
} else {
  done.push(`Node ${process.versions.node}`);
}

if (run("git", ["config", "core.hooksPath", HOOKS_PATH]) !== null) {
  done.push(`git hooks on (core.hooksPath = ${HOOKS_PATH})`);
} else {
  todo.push(`Could not set core.hooksPath. Run \`git config core.hooksPath ${HOOKS_PATH}\`.`);
}

const name = run("git", ["config", "user.name"]);
const email = run("git", ["config", "user.email"]);
if (name && email) {
  done.push(`git identity: ${name}`);
} else {
  todo.push("Set your git identity: `git config --global user.name \"...\"` and `git config --global user.email \"...\"`.");
}

const login = run("gh", ["api", "user", "--jq", ".login"]);
if (login) {
  done.push(`gh signed in as @${login}`);
} else {
  todo.push("Sign in to GitHub: `gh auth login`. Pull requests, reviews and `npm run team` need it.");
}

if (!existsSync("node_modules")) {
  const install = spawnSync(IS_WINDOWS ? "npm.cmd" : "npm", ["install"], { stdio: "inherit", shell: IS_WINDOWS });
  if (install.status === 0) done.push("npm install");
  else todo.push("`npm install` failed. Read its output above.");
} else {
  done.push("dependencies present");
}

if (!existsSync(".env") && existsSync(".env.example")) {
  copyFileSync(".env.example", ".env");
  done.push(".env created from .env.example (add a GEMINI_API_KEY or OPENAI_API_KEY for the live mentor)");
}

const branch = run("git", ["branch", "--show-current"]);
const dirty = run("git", ["status", "--porcelain"]);
if (branch === "main" && dirty === "") {
  if (run("git", ["pull", "-q", "--ff-only"]) !== null) done.push("main is up to date with origin");
  else todo.push("`git pull --ff-only` on main failed. Check it by hand.");
}

console.log("## Code Quest setup");
for (const line of done) console.log(`- ok: ${line}`);
for (const line of todo) console.log(`- TODO: ${line}`);
console.log("");
console.log(teamStatus());
process.exit(todo.length ? 1 : 0);
