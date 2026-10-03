# v3.12 — higher-stakes combat — writers' brief

David asked for combat with real stakes. The balance tester (`tools/balance.mjs`) shows why: with sensible play the squad wins all 23 fights 100% of the time, losing 4–27% of its health. The engine work is done (`src/31c_stakes.js`, `src/31_battle.js`); your job is the **content** in your chapter file(s):

1. **A second area on most fights** in your chapter.
2. **One new fight** in your chapter, at a moment the story already has.
3. **One rest** in your chapter, for Bridgeburner difficulty.

Read this brief, then `docs/story-bible.md` §5 (voice) and your `docs/chN-brief.md` (canon rules), then your file. Look at how the existing battles in your file are declared (`CH.battles`, `CH.foes`) and started (`startBattle(id, opt)` from a choice's `go`, with the battle's `after` node continuing the story).

## What the engine now does

- **Second areas.** A battle with a `stage2` field goes on after its first map is cleared: a banner ("The way on"), a short breath sheet with your text and a "Push on" button, then a new map with new enemies. **Wounds, Tuft's and Ohl's strain, spent munitions and salves, and once-a-fight abilities all carry over**; a squadmate who went down is dragged up at a quarter of their health. XP is paid once, at the end (the first area's `xp` plus `stage2.xp`, which defaults to half the first area's). A defeat in the second area retries the second area.
- **Enemy tricks** (Soldier and Bridgeburner only; off on Story), by enemy kind: crossbows **pin** (−2 move next turn), shades **drain** (heal what they deal), knives/assassins/warrenspawn **bleed** (1d4 at the start of the next two turns), hounds **pounce** (leap in, +2 to hit, knock down) and **howl** (the squad −1 to hit for a round), Claw assassins **shadow-step** behind the weakest squadmate once a fight, Guild veterans and the grey cloak **parry** one hit a fight, the grey cloak **marks** a target (+2 for every enemy against it), wights and rime-dead **chill** (−2 move), the barrow ward **holds** (no move next turn), Rhivi riders and cutpurses **hit and run**, bruisers **shove** (into fire, if there is fire), house guards' halberds **reach 2**, the house captain **rallies** (+2 to hit for the household at half health), the Claw mage **dazes** at range, the Andii hunter wraps itself in **darkness** (−2 to hit it). A new foe you declare in `CH.foes` may carry `sk:['bleed','parry']` etc. from that list (names exactly as in `FOE_SK` in `src/31c_stakes.js`); without `sk` it gets its kind's tricks, if any.
- **Ohl** now has **Denul Wash** (strain 4: Ohl and every squadmate within 2 heal 1d6+1) and **Stanch** (strain 2: a squadmate within 3 can't drop below 1 until Ohl's next turn) besides Mend.
- **Salves:** the squad starts with 1, Pell charges 5 silver, and one jar turns up as loot in each chapter from Chapter Two (the engine does it on the chapter's first won fight).
- **Bridgeburner** carries wounds from fight to fight until the squad rests (a new chapter, or `rest()` — your task 3). Story and Soldier patch everyone up after each fight, as before.
- **The gods**: when the whole squad goes down, the most loyal squadmate's god answers (once a chapter each, on Soldier and Bridgeburner) and the fight restarts. You don't need to do anything for this.
- **Difficulty is tuned last, globally** (Claude runs the balance tester over everything after you're done and scales enemies per chapter). Don't hand-tune numbers to be easy; make each area a real fight for its place in the story.

## 1. Second areas

Add a `stage2` to **most** of your chapter's ordinary fights. Leave the hold-out fights alone — the survive-N-rounds fights and the boss set pieces with their own shape (`hounds_line`, `hounds_claw`, `andii_roof`, `the_rent`, `garden_hound`, `tyrant_garden`, `lorn_alley`). Every other fight should get one unless it truly makes no sense (say why in your report).

```js
some_fight:{ /* the existing first area, unchanged */ title:'…', map:[…], party:[…], foes:[…], xp:200, after:'c3_after_fight', …,
  stage2:{
    title:'The courtyard behind the dye-works',          // the second ground's name (shown on the breath sheet and as the battle title)
    warrenText:'…',                                       // optional; else the first area's
    text:`Two short paragraphs, the breath between: what the squad sees as it pushes on, who is waiting. Squadmate lines guarded with SQUAD().includes(id).`,
    map:[ /* 10 strings of 8 chars; '#' blocks, anything else is walkable */ ],
    party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],        // six start tiles for the squad
    foes:[['guildknife',2,1],['guildveteran',4,0],['guildknife',6,1]],   // [kind, x, y]
    waves:[{round:2, foes:[['guildknife',0,4]], text:'More come over the wall.'}],   // optional
    xp:100,                                               // optional; default half the first area's
    surprise:'e',                                         // optional
    // style, dark, music, warren, nomagic, nothrow are inherited from the first area unless you set them here
  }},
```

Design: a different place a few steps on (the next gallery, the burial chamber, the stair down, the courtyard beyond, the next roof), a different composition (a tougher one at its heart — a veteran, a bruiser, a mage, a crossbow on high ground — or a kind from the first area plus something new), and terrain that asks something different (a choke point, cover, open ground). About as dangerous as the first area. Use existing enemy kinds (FOES and your chapter's foes); a new foe needs an existing sprite via `kind:'<sprite>'`. Write `text` in the voice of the chapter: spare, grim, wry, specific; never more than two short paragraphs.

## 2. One new fight

Add **one new fight** to your chapter at a moment the story already has — a node where a fight is natural (an ambush on the road, something in the dark, a crowd that turns, a debt called in). It should be met on **the main road** of the chapter (most playthroughs), not hidden. It can be avoidable at a cost (a hard check, silver, a loyalty hit), but the default is to fight. Declare it in `CH.battles` with an `after` node that continues the story (reacting to the fight in a line or two, with squadmate beats guarded), start it with `go:()=>startBattle('id')` (or `startBattle('id', {surprise:'e'})` etc.), give it XP in line with your chapter's other fights, and give it a `stage2` too if it suits. Canon rules hold: the Fourth changes nothing in the canon spine.

## 3. One rest (Bridgeburner)

Call `rest('A line about the squad sleeping, in the chapter\'s voice.')` in the `fx` of one natural resting node in your chapter (a camp, the inn, a night's sleep), roughly mid-chapter. It only does anything on Bridgeburner (where wounds carry); elsewhere it's a no-op.

## Rules

- Keep every existing node id, flag, battle id and chapter-key contract. New ids/flags prefixed with your chapter (`c3_…`, prologue `p_…`).
- Edit only your own chapter file(s) (the prologue writer may also edit the `deserters` and `stone` entries in `BATTLES` in `src/14_data.js`, and nothing else there).
- A node's `fx` runs once per node id, ever. Choice labels: no `*…*`, no `{sgt}`. Guard squadmate lines with `SQUAD().includes(id)`.
- Battle maps are 8 wide × 10 tall. Foe and party tiles must be walkable and not overlap; party tiles near the bottom rows unless the story says otherwise.

## How to work and test

1. Work in your own copy: `cp -r /home/claude/aotp /home/claude/work2-<name>`.
2. Build `python3 build.py`; `node --check src/<file>`.
3. Lint: `node tools/lint.mjs > /tmp/lint2-<name>.txt` — baseline: 0 errors, 2 "Flags read but never written" (`c1_bonesNet`, `c3_bonesNet`). Add none.
4. Play: `node tools/play.mjs 2 --from=N --quiet` (real fights; the bot's squad is driven by the enemy AI, so losses happen — a lost fight is retried through the gods, that's fine) and `node tools/play.mjs 2 --cheat --from=N --quiet` (flow). Both must end OK.
5. Balance smoke test for your fights: `node tools/balance.mjs --only=<id,id,…> --runs=6 --noellis=0 --naive=0 --quiet`. Every fight must be winnable and not stuck (no 'stage-stuck', 'stuck' or 'stalemate'); don't chase a win rate — Claude tunes globally afterwards.
6. Copy **only your file(s)** back to `/home/claude/aotp/src/`.
7. Report (under 350 words): each second area (battle id → title, composition, the idea of the terrain), the new fight (where, why, avoidable how), the rest node, any new foes, and the test results.
