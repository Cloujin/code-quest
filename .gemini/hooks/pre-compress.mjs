import { respond } from "./lib.mjs";

respond({
  systemMessage:
    "Gemini is compressing this chat, so older details are being dropped. GEMINI.md and the rules stay loaded. " +
    "If a task is half done, ask Gemini for a handover to .agent/progress.md and the draft pull request, then open a new chat.",
});
