# NEXT STEPS — Code Quest

The ordered list of what is left. Start at the top. When an item is done, delete it and write the
story in `HANDOVER.md` §5; when one is found, add it where it ranks.

1. **`@itx3010`, repository owner: apply the `main` ruleset.** Without it, nothing on GitHub stops a
   push to `main` or a merge without review:
   `gh api -X POST repos/itx3010/code-quest/rulesets --input .github/rulesets/main.json`
2. **Both of us: after pulling this, run `npm install`** to turn on `.githooks/`, then restart any open
   agent chat.
3. **Add tests.** `npm run check` only typechecks and builds. Start with `src/engine/executor.ts` and the
   server routes, then add `npm test` to the gate.
