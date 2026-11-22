import { HANDOVER_ORDERS, LEVEL, readState, readStdin } from "./lib.mjs";

const BLOCKED = 2;
const READ_ONLY_TOOLS = new Set([
  "read_file",
  "read_many_files",
  "glob",
  "grep_search",
  "search_file_content",
  "list_directory",
  "activate_skill",
  "write_todos",
]);
const WRITE_TOOLS = new Set(["write_file", "replace"]);
const HANDOVER_PATH = /([\\/]\.agent[\\/]|(^|[\\/])HANDOVER\.md$|(^|[\\/])NEXT_STEPS\.md$|handoff)/i;
const HANDOVER_GIT = /^\s*(git\s+(status|diff|log|show|branch|add|commit|push|switch -c|checkout -b)\b|gh\s+pr\s+(create|edit|view)\b)[^;&|<>`$]*$/;

const input = await readStdin();
if (readState(input.session_id).level < LEVEL.HANDBRAKE) process.exit(0);

const tool = input.tool_name ?? "";
const args = input.tool_input ?? {};
const path = args.file_path ?? "";
const command = args.command ?? "";

const allowed =
  READ_ONLY_TOOLS.has(tool) ||
  (WRITE_TOOLS.has(tool) && HANDOVER_PATH.test(path)) ||
  (tool === "run_shell_command" && HANDOVER_GIT.test(command));

if (allowed) process.exit(0);

process.stderr.write(`HANDBRAKE: this chat is too long to keep working in. ${HANDOVER_ORDERS}\n`);
process.exit(BLOCKED);
