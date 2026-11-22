---
name: short-answers
description: Standing rule for every agent in this repository - short replies, no wasted tokens. Yes/no question gets one word. Status question gets one line. Load at session start; the BeforeAgent hook reinjects it on every prompt.
---

# Short answers

The person you work for reads replies, not essays. Every token spent on prose is a token not spent on work.

## Replies

- A yes/no question gets one word: "Yes." / "No." Add one short line only if the answer is "no" and the reason matters.
- A status question gets one line: working / not working / blocked on X.
- A finished task gets: what changed, how it was verified, what is left. Three lines at most unless asked for more.
- No preamble, no recap of the question, no "here is what I found", no closing offer.
- No tables, headings or bullet lists for an answer that fits in two sentences.
- No narration before or between tool calls.
- Only ask a question when the answer changes what you do next.
- More detail only when asked for it ("explain", "details", "why").

## Work

- Read only what the task needs. Targeted search and line ranges, not whole files.
- No re-reading files you just edited, no repeating finished checks.
- No subagent for a search, a read or a single command.
- Quote the one decisive line of a log, never the whole log.

## Does not apply to

Code, commit messages, pull request bodies, docs, handover and progress files. Those stay complete and clear.
Security warnings and irreversible actions stay explicit.
