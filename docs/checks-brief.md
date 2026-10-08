# v3.11 — skill checks that matter, and tricks — writers' brief

*Historical: a past work order (v3.11); the game has moved on — see docs/story-bible.md.*

David (the player) asked to make skill checks feel meaningful. The engine work is done (`src/16_skill_checks.js`, `src/16b_tricks.js`, `src/31b_tricks_in_battle.js`). Your job is the **content**: every check in your chapter file, plus the new hard checks assigned to you. Read this whole brief, then `docs/story-bible.md` §5 (voice) and your chapter's `docs/chN-brief.md` for canon rules, then your chapter file.

## What changed in the engine (what the player now sees)

1. **The player picks who handles a check.** Tapping a check choice opens a strip of squadmates, each with their odds and the named bonuses that apply; the likeliest is lit. (A choice with a third entry, `check:['might',13,'sgt']`, skips the strip: only that person can do it.)
2. **Odds on the tag.** `Wits 13 · Ohl 55%` (or `Wits · Ohl · even odds` with roll numbers off).
3. **Named bonuses ("edges")**: the roller's stat (base + gear), loyalty (+1 at loyalty ≥ 2, −1 at ≤ −2), *rattled* (−1, from a natural 1 or some "yes, but" costs), *the Lord's push* (−2 after the Lady's Pull is used), Oponn (+1), and **whatever the choice adds via `edges`** (yours to write).
4. **Six outcomes**: natural 20 (always succeeds, +20 xp), **clean** (made it by 5+, +10 xp), success, **"yes, but"** (missed by 1–2: the choice's `go` happens, at a cost), failure, natural 1 (always fails; the roller is rattled).
5. **Tricks**: ten optional hard checks (DC 15–17, ✦ on the tag) teach whoever makes them a usable trick (once a fight, or charges per chapter). The engine grants the trick and announces it; you write the scene.
6. **The story knows who rolled.** `S.lastRoll` = `{who, stat, tier, ok, pass, margin, nat}`; helpers below.

Odds today: the best stat in the squad is +3 (might: Brisk; wits: Ohl; guile: Tuft, and Ellis if recruited). The sergeant is might 2 / wits 2 / guile 1; Kettle 1/2/2; Tuft 0/2/3; Ohl 1/3/0; Brisk 3/0/0; Ellis 0/2/3. With +3, DC 12 ≈ 60%, DC 13 ≈ 55%, DC 15 ≈ 45%, DC 16 ≈ 40%, DC 17 ≈ 35%. Story difficulty is −2 DC, Bridgeburner +1.

## The check API (a choice in a node's `ch` array)

```js
{t:'Give him a name. Not yours.',            // label: no *…*, no {sgt}
 check:['guile', 12],                         // stat, DC (soldier difficulty). ['might',13,'sgt'] = only the sergeant
 edges:id => [S.f.c3_trueName && ['Pallick has your real name', -2], id === 'kettle' && ['Kettle cannot lie', -2]],  // optional; falsy entries are ignored; id is the roller being priced
 near:{t:'Pallick blots the page twice. He will remember the goat.', fx:()=>{ S.f.c3_pallickDoubt = 1; }},  // optional "yes, but" cost; near:false = no yes-but here (a miss is a miss)
 clean:{t:'…', fx:()=>{…}},                    // optional extra on a clean success or a natural 20
 fumble:{t:'…', fx:()=>{…}},                   // optional extra on a natural 1 (the engine already rattles the roller)
 not:['brisk'], notWhy:{brisk:'is the one he is staring at'},  // optional: who can't try, and why (shown greyed in the strip)
 trick:'pull',                                 // only for the assigned trick checks
 req:()=>…, fx:()=>…,                          // as before: fx runs once the roller is chosen, before the roll
 go:'c3_pallick_lie', fail:'c3_pallick_caught'}
```

**Default "yes, but"** (if you don't write `near`): −3 silver if the squad has it, else the roller is rattled. That is a fallback; a specific cost is better wherever one is natural (a loyalty point, a flag that echoes later, a scratch of HP isn't available outside fights, an item, time). Use `near:false` where a half-success makes no sense (a single yes/no moment, a key choice, the trick checks — the engine already disables it for those).

**In node text** (nodes are functions, built when shown, after the roll is settled):
- `by({tuft:'…', ellis:'…', kettle:'…', sgt:'…', _:'…'})` → the entry for whoever rolled, else `_`.
- `{who}` inside `txt` → the roller's name (the sergeant's name when the sergeant rolled).
- `ROLL()` → `{who, tier, margin, nat, ok, pass}`; `nearMiss()` → it was a "yes, but"; `cleanRoll()` → clean or a natural 20.
- Only use these in nodes reached **directly** from the check (the `go`/`fail` node and anything it leads to in the same breath). If later text needs to remember who did it, store it in the success node's `fx`: `fx:()=>{ S.f.c3_liar = ROLL().who; }` and read the flag later.

## Your tasks, for every existing check in your file

1. **Who acts must match the story.** Today the best-stat squadmate rolls, but the text has *you* (the sergeant) doing it. Now the player picks. Rewrite the success and failure (and where useful the "yes, but") text so whoever rolled is the one who did it, with `by({...})`: a line for each *likely* roller (the top two or three for that stat, plus the sergeant), in their voice (bible §5), and a neutral `_` that works for anyone using `{who}`. Kettle lies badly but with total confidence; Tuft is quiet and exact; Ellis says one sentence, the right one; Brisk is the wall; Ohl is patient and makes rules; the sergeant is "you". Keep it tight: a sentence or two per variant, worked into the existing prose; do not rewrite good scenes wholesale.
   - Where the choice label is the sergeant's own quoted line, either make the label an action anyone can take (`Shout them down.`) and let the roller say it, or force the sergeant (`check:[stat, dc, 'sgt']`) when it must be them — and then keep the odds near where they were (a lower DC, or an `edges` bonus with a name).
   - Fix stat mismatches you find (a parade-ground bellow is Might, not Guile).
2. **Named edges.** Wherever something the player did earlier should make this easier or harder, add it with a name the player will recognise (`['Varrow\'s journal', 2]`, `['the Watch has seen your faces', -2]`, `['Garrow\'s word', 3]`). Aim for at least a third of your checks. Read the flags in the story bible §0–§4 and in your file; only use flags that are actually set somewhere.
3. **Failures change something.** A failure that only withholds a line of lore is the flat kind. Make each one change the situation: someone notices the sergeant, a later line or option changes, a cost, a loyalty beat, a door opens differently. Set a flag and **pay it off at least once later** (in your chapter, its close round, `CH.extras`, or the next chapter if you own it). Don't punish; complicate.
4. **"Yes, but."** Decide per check: a specific `near` cost, the default, or `near:false`.
5. **Clean successes** may get a `clean` extra where a little more is natural (an extra line of lore, a small item, a loyalty point for the roller: `loy(ROLL().who, 1)` guarded by `ROLL().who !== 'sgt' && SQUAD().includes(ROLL().who)`). Not everywhere.

## New hard checks (✦ tricks), by chapter

Each is an **optional extra choice** in an existing conversation (never blocking the road), **one attempt per playthrough** (`req:()=>!S.f.cN_xTried`, `fx:()=>{S.f.cN_xTried=1;}`), with a `trick:'key'`, DC as listed, and a success and a failure node. The engine grants the trick on success (don't call `earnTrick`), shows "✦ X learns …", and lists it on the squad sheet. Your success scene shows *how* the roller came by it, in their voice (by-variants for the likely rollers); the failure is short, characterful, and changes something small. The trick's name, lore and effect are in `src/16b_tricks.js` — match them. Put the trick choice where the fiction offers it naturally; the player should be able to see the ✦ and choose not to.

| File | Key | Stat · DC | Scene |
|---|---|---|---|
| 39_prologue.js | `fold` | Wits 15 | Tattersail's tent: watch (or ask) how she folds a turned card back into the spread |
| 40_chapter1.js | `line` | Might 16 | The Hound night on the cadre row: lock shields across the row |
| 41_chapter2.js | `song` | Wits 16 | The Rhivi outriders: answer them with the Rhivi words for the dead (an `edges` bonus if Sethand trusts the squad) |
| 42_chapter3.js | `pull` | Wits 16 | The Phoenix Inn: watch the boy (Crokus) spin his coin, and catch it at the right moment (Oponn, the Lady pulls / the Lord pushes) |
| 42_chapter3.js | `bluefire` | Wits 15 | Hedge's cellar under the gas mains: get Hedge to show you how he bottles the lamp-gas |
| 43_chapter4.js | `cant` | Guile 16 | Kalam's roof: get Kalam to show the Claw's hand-cant (he will say he didn't) |
| 43_chapter4.js | `rope` | Might 16 | The rope-line strung between chimneys over the roofs: cross it the way the Guild does (Cotillion, the Rope) |
| 44_chapter5.js | `otataral` | Wits 16 | The ward-stone the Adjunct's sword cut: scrape the red dust from the cut (Tuft and Ohl cannot try: the engine already greys them out) |
| 45_chapter6.js | `dark` | Guile 17 | The terrace: the tall guest in the black dragon mask; meet his eyes and bow the way the Andii do (edges if `c4_seen` / `c4_tuftDark`). Canon: he changes nothing, says at most a word, never names himself |
| 45_chapter6.js | `rime` | Might 17 | The garden as the Tyrant's frost comes across the lawn in rings, before `c6_choice`: stand in its path / pull someone out of it, and a little of the ice stays |

**Chapters 5–7 also need more hard checks at the big moments** (they have only two checks each today). Add **2–3 more hard checks (DC 15–17) per chapter** in Ch5 and Ch6 besides the tricks, and **3–4 in Ch7**, each with a real consequence: a flag that changes a later scene, the close round, `CH.extras`, or (Ch7) the finale/fate pages; loyalty; an item; silver. Ch7's hard checks have no tricks; their rewards are in the ending. Make them choices the player can decline.

**The two forced checks** (the only option on screen today) become a choice of approach, each with its own stat and its own success/failure flavour:
- Ch5 `c5_to_vale` "Look at the dig. Carefully." (Wits 13): e.g. look (Wits), keep everyone flat and still (Might — the stillness of the line), or send the quietest one along the crest (Guile).
- Ch7 `c7_ledger` "Find it before he does." (Wits 13): e.g. search the stacks (Wits), take the clerk's wrist (Might), or pull his eyes away (Guile). All three still set the same outcome flags the finale reads (`c7_ledgerBurnt` etc.).

## Rules (unchanged from the chapter briefs)

- Keep every existing node id, flag and chapter-key contract; later chapters and the finale read them. New flags: prefix with your chapter (`c3_…`, prologue `p_…`). New node ids likewise.
- A node's `fx` runs once per node id, ever, after its text is built. Choice `fx` runs when chosen.
- Guard every squadmate line with `SQUAD().includes(id)` (Ellis may be absent; anyone but the sergeant may be dead after the Ch6 alley). A `by()` entry is only shown if that squadmate rolled, so it is safe.
- Choice labels: no `*…*`, no `{sgt}`. Text uses `*x*` for italics.
- Canon characters are met, not played; keep their lines few and in voice (your chapter brief).
- Do not edit any file but your own chapter file(s). If the engine can't do something you need, say so in your report instead.

## How to work and test

1. Work in your own copy: `cp -r /home/claude/aotp /home/claude/work-<yourname>` and edit there.
2. Build: `cd /home/claude/work-<yourname> && python3 build.py`, then `node --check src/<file>`.
3. Lint: `node tools/lint.mjs > /tmp/lint-<yourname>.txt` (needs a browser slot; it waits if busy). The baseline has three sections — "Choices with no go (close the sheet)" (157), "REVIEW: text names a squadmate who is not in the squad" (133), "Flags read but never written" (2: `c1_bonesNet`, `c3_bonesNet`). Your edits must add **no new "Flags read but never written"**, no errors, no template leaks, no soft-locks; check any new REVIEW lines are guarded on purpose.
4. Play it: `node tools/play.mjs 2 --cheat --from=N --quiet` (N = your chapter; 0 for the prologue) drives your chapter through the real UI, picking rollers and choices at random; it must report OK. Run it more than once if you can.
5. When done, copy **only your chapter file(s)** back: `cp src/<file> /home/claude/aotp/src/<file>`.
6. Report back briefly: per check, what changed (roller lines, edges, failure consequence + where it pays off, near choice); the new hard checks (where, DC, consequences); new flags and where each is read; and the lint/play results.
