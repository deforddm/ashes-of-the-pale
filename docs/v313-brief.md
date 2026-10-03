# v3.13 — sapper consequences, hold-out takedowns, and a continuity pass — writers' brief

David is playing the game closely and loving it. This pass is three jobs in your chapter file(s). Read this brief, then `docs/story-bible.md` §5 (voice) and your `docs/chN-brief.md` (canon rules), then your file (large files: grep and targeted ranges, but job 3 needs you to actually read the chapter's dialogue through).

## 1. Every sharper opening has a consequence

Many fights can be opened with Kettle's sharper (`startBattle('id', {pre:true})`, the choice tagged *uses 1 sharper*). Today it only does 1d10 to every enemy. David wants it to feel Malazan: **each case gets a consequence that is different and specific to that encounter**, and the story **says what went down differently because of it**, with sapper-flavoured dialogue (Kettle above all; Hedge, Fiddler or whoever is there if they are).

The engine now supports (in the battle def, `CH.battles.<id>`):

```js
preText:'One log line, in voice: what the blast did beyond the damage.',   // or ()=>string
preFx:B => { /* the in-fight consequence, applied after the blast lands */ },
```

and these helpers for a `preFx` (all in `src/31c_stakes.js`):
- `preWave(round, [[kind,x,y],…], 'text')` — more of them come at the noise (or the Watch, or something worse).
- `preTile(x, y, '#')` — the map changes: a chimney comes down, a doorway is blocked, a plank goes (`'#'` blocks; `'.'` opens).
- `preFire(x, y, rounds)` / `preSmoke(x, y, rounds)` — burning tiles; smoke nobody shoots through.
- `preFoe(kind, x, y)` — something new turns up now.
- Direct changes are fine too: `foes().forEach(f => …)` (stun one, scatter them, strip a boss's parry `f.parryLeft = 0`), `B.surprise = 'p'`, a squadmate shaken (`u.slowTurn = true`, `u.steady = true`), etc.

`preUsed('id')` is true in later nodes when that fight was opened with the sharper. Use it in the fight's `after` node (and anywhere else the consequence should echo: the end-screen `CH.extras`, a later chapter line in your own file, a loyalty beat) to say **what happened differently**: two or three sentences, the sapper's view of it, never a lecture. Consequences can cut both ways — munitions are double-edged in this world: it can win the fight faster and cost you something (a witness, the Watch, the loot, a roof, a friend's good opinion, a fire in the wrong place), or it can buy a real advantage (a choke point sealed, a crossbow buried, a boss stunned, a flank opened). Make each one *specific* to the place and the people: the barrow, the roof, the alley, the garden at the Fete, the quay.

Where one fight has several sharper openings (different nodes), give it one consequence; the text may still reflect where it was thrown from. The prologue's opening at the deserters already has one (`S.f.noisy`: it wakes the Stonebound early) — keep it, and add the explanation and the sapper lines it lacks.

## 2. Hold-out fights: putting one down counts

In the survive-N-rounds fights, the Fourth sometimes brings an enemy down even though the job was only to hold (a Hound, an Andii hunter, a warrenspawn), and immortal ones (the Tyrant, the Adjunct) can be brought to one knee. The engine now counts it, pays an XP bonus (40% of the fight's XP per enemy, up to three) and notes it. Your job: **mention it in the story** in that fight's `after` node (and the chapter close if it matters), even when the enemy lives to fight again — the Hound that limps home, the hunter that will remember, the Tyrant who noticed. Helpers: `heldDowns('id')` (how many), `S.f.lastHold` (`{id, n, names:[…], knelt}` — `knelt` true when an immortal went to one knee). One or two lines, guarded by `heldDowns('id') > 0`.

## 3. A continuity pass

David found real slips that come from talking to people **in a different order** than the writer expected, and from **who is shown on the map vs what the text says**. Read your chapter's dialogue through and fix what you find. Known ones:
- **Ch3:** talking to Sorry at the crossing recalls "the feeling Hedge mentioned" even if you haven't talked to Hedge yet. Characters are said to be **down the hole** at the crossing while their figure stands above ground in plain view (fix the NPC `show:` conditions, or the text). **Ellis and the letter:** it's hard to tell she is waiting for you to start that conversation — make it unmistakable (the quest line, her NPC's `fresh:` marker, a line from her or a squadmate pointing at her).
- Everywhere: look for lines that assume an earlier conversation or flag the player may not have (guard with the flag, or write a variant), NPCs present on the map while the text has them elsewhere (asleep, gone, down a ladder, dead), revisits of a node that contradict the first visit, quest lines (`QUESTS` in `src/37_chapters.js` are engine — tell me if one is wrong rather than editing it) that send the player to the wrong place, `fresh:` markers that never clear, names used before the squad has learned them.

Fix with flags (`fx:()=>{ S.f.c3_hedgeTalked = 1; }` and a guard where it's read), variant text, or `show:` conditions. Don't rewrite good scenes; make them true in every order.

## Rules

- Keep every existing node id, flag, battle id and chapter-key contract. New flags prefixed with your chapter (`c3_…`, prologue `p_…`).
- Edit only your own chapter file(s). If something needs an engine change (or a `QUESTS` line), say so in your report.
- Guard squadmate lines with `SQUAD().includes(id)`. Choice labels: no `*…*`, no `{sgt}`.

## How to work and test

1. Work in your own copy: `cp -r /home/claude/aotp /home/claude/work3-<name>`.
2. Build `python3 build.py`; `node --check src/<file>`.
3. Lint: `node tools/lint.mjs > /tmp/lint3-<name>.txt` — baseline: 0 errors, 2 "Flags read but never written" (`c1_bonesNet`, `c3_bonesNet`). Add none.
4. Play: `node tools/play.mjs 2 --from=N --quiet` and `node tools/play.mjs 2 --cheat --from=N --quiet`; both must end OK. Write logs to unique names (the scratchpad is shared).
5. Test every `preFx` directly at least once (start the battle with `{pre:true}` in a page and check no errors and the effect is visible), e.g. adapting `tools/stakes_test.mjs`.
6. Copy **only your file(s)** back to `/home/claude/aotp/src/`.
7. Report (under 400 words): per sharper opening, the consequence (in-fight + story) in a line; the hold-out mentions; every continuity fix (what was wrong, how it's fixed); anything you need from the engine.
