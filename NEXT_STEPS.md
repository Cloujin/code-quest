# NEXT STEPS — Code Quest

The ordered list of what is left. Start at the top. When an item is done, delete it and write the
story in `HANDOVER.md` §5; when one is found, add it where it ranks.

1. **Both of us: describe the new game.** The engine is waiting on the game design. Write the answers
   into `HANDOVER.md` §3: the genre and what the player does minute to minute, the camera (third
   person, top-down or isometric), single player or multiplayer, whether it still teaches programming,
   and two or three reference games or screenshots for the look.
2. **Engine, in order:** a player character with movement and collision against the ground; a
   follow camera; loading models made in Blender (glTF) instead of building them in code; shadows and
   ink outlines for the cartoon look; text and a menu on screen; sound.
3. **`@itx3010`, repository owner: apply the `main` ruleset.** Without it, nothing on GitHub stops a
   push to `main` or a merge without review:
   `gh api -X POST repos/itx3010/code-quest/rulesets --input .github/rulesets/main.json`
4. **Both of us: after pulling this, run `npm install`** to turn on `.githooks/`, then restart any open
   agent chat.
5. **Add tests.** `npm run check` only typechecks and builds. Start with `src/engine/executor.ts` and the
   server routes, then add `npm test` to the gate.
