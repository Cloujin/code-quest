import {
  HANDOVER_ORDERS,
  LEVEL,
  SHORT_ANSWERS,
  contextTokens,
  levelFor,
  readState,
  readStdin,
  respond,
  writeState,
} from "./lib.mjs";

const REPEAT_URGE_EVERY_PROMPTS = 5;

const input = await readStdin();
const sessionId = input.session_id;
const tokens = contextTokens(input.transcript_path);
const state = readState(sessionId);

const context = [SHORT_ANSWERS];
let systemMessage;

if (tokens !== null) {
  const level = levelFor(tokens);
  const thousands = Math.round(tokens / 1000);
  const rising = level > state.level;
  const repeat = level >= LEVEL.URGE && state.promptsSinceWarning + 1 >= REPEAT_URGE_EVERY_PROMPTS;

  if (level === LEVEL.HANDBRAKE) {
    systemMessage = `HANDBRAKE: this chat holds about ${thousands}k tokens. Gemini is writing the handover and stopping. Open a new chat.`;
    context.push(
      `HANDBRAKE: the chat holds about ${thousands}k tokens. Stop the task now and do not do what this message asks. ` +
        "Only reading, read-only git, and writing to .agent/, HANDOVER.md or NEXT_STEPS.md are allowed. " +
        HANDOVER_ORDERS,
    );
  } else if (level === LEVEL.URGE && (rising || repeat)) {
    systemMessage = `This chat is very long (about ${thousands}k tokens). Open a new chat now.`;
    context.push(
      `The chat holds about ${thousands}k tokens, and answers get slower and less precise from here. ` +
        "Finish the current unit only, then: " +
        HANDOVER_ORDERS,
    );
  } else if (level === LEVEL.WARN && rising) {
    systemMessage = `This chat is getting long (about ${thousands}k tokens). Consider a new chat soon.`;
    context.push(
      `The chat holds about ${thousands}k tokens. In your reply, tell the user in one short line that this chat is getting long, and offer to write a handover for a new chat. Then do what they asked.`,
    );
  }

  const warned = Boolean(systemMessage);
  writeState(sessionId, {
    level: warned ? level : Math.min(level, state.level),
    promptsSinceWarning: warned ? 0 : state.promptsSinceWarning + 1,
    tokens,
  });
}

const output = { hookSpecificOutput: { hookEventName: "BeforeAgent", additionalContext: context.join("\n\n") } };
if (systemMessage) output.systemMessage = systemMessage;
respond(output);
