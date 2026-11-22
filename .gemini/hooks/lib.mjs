import { closeSync, existsSync, openSync, readFileSync, readSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const WARN_TOKENS = 200_000;
export const URGE_TOKENS = 400_000;
export const HANDBRAKE_TOKENS = 600_000;
export const LEVEL = { OK: 0, WARN: 1, URGE: 2, HANDBRAKE: 3 };

const BYTES_PER_TOKEN = 4;
const MAX_TRANSCRIPT_BYTES = 30_000_000;

export function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve({});
    let raw = "";
    const guard = setTimeout(() => resolve({}), 4000);
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (raw += chunk));
    process.stdin.on("end", () => {
      clearTimeout(guard);
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export function respond(output) {
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}

function safeId(sessionId) {
  return /^[A-Za-z0-9_-]+$/.test(String(sessionId ?? "")) ? String(sessionId) : null;
}

export function statePath(sessionId) {
  const id = safeId(sessionId);
  return id ? join(tmpdir(), `code-quest-gemini-${id}.json`) : null;
}

export function readState(sessionId) {
  const path = statePath(sessionId);
  if (!path || !existsSync(path)) return { level: LEVEL.OK, promptsSinceWarning: 0, tokens: 0 };
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { level: LEVEL.OK, promptsSinceWarning: 0, tokens: 0 };
  }
}

export function writeState(sessionId, state) {
  const path = statePath(sessionId);
  if (path) writeFileSync(path, JSON.stringify(state));
}

function lastReportedInputTokens(text) {
  try {
    const transcript = JSON.parse(text);
    const messages = Array.isArray(transcript) ? transcript : transcript.messages ?? [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const tokens = messages[i]?.tokens ?? messages[i]?.usageMetadata;
      const input = tokens?.input ?? tokens?.promptTokenCount;
      if (Number.isFinite(input) && input > 0) return input;
    }
  } catch {
    return null;
  }
  return null;
}

function readCapped(path) {
  const size = statSync(path).size;
  const length = Math.min(size, MAX_TRANSCRIPT_BYTES);
  const buffer = Buffer.alloc(length);
  const fd = openSync(path, "r");
  readSync(fd, buffer, 0, length, size - length);
  closeSync(fd);
  return { text: buffer.toString("utf8"), size };
}

export function contextTokens(transcriptPath) {
  if (typeof transcriptPath !== "string" || !existsSync(transcriptPath)) return null;
  const { text, size } = readCapped(transcriptPath);
  return lastReportedInputTokens(text) ?? Math.round(size / BYTES_PER_TOKEN);
}

export function levelFor(tokens) {
  if (tokens >= HANDBRAKE_TOKENS) return LEVEL.HANDBRAKE;
  if (tokens >= URGE_TOKENS) return LEVEL.URGE;
  if (tokens >= WARN_TOKENS) return LEVEL.WARN;
  return LEVEL.OK;
}

export const SHORT_ANSWERS =
  "Short-answers rule (skill short-answers): reply as short as possible. Yes/no question: one word. " +
  "Status question: one line. Done task: max 3 lines (changed, verified, left). No preamble, recap, " +
  "tables or closing offers. Detail only when asked. Code, commits, PRs and docs stay complete.";

export const HANDOVER_ORDERS =
  "Write the handover now into .agent/progress.md: what is done and committed, what is half done and " +
  "uncommitted (branch, files), what was verified, and the exact next step. Commit and push the branch, keep " +
  "or open its pull request as a draft, and put the same handover under 'Where I stopped' in the pull request " +
  "description so the other person can see it (COLLABORATION.md section 5). Then give the user, in one line, " +
  "the advice to open a new chat, and a short handoff message to paste into it.";
