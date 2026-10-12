# Book Two, Chapter 1 — "Hissar Burns" — content brief (v4.0)

You are writing `src/48_b2_ch1.js`: the first chapter of **Book Two: Deadhouse Gates**, a standalone campaign inside *Ashes of the Pale* (a Malazan Book of the Fallen fan RPG for phones). Book One (Gardens of the Moon) is finished and must keep working exactly as it does.

Read first, in this order:
1. `docs/dg-canon.md` — the sourced canon sheet for Deadhouse Gates, with **hard limits** (§8). Break none.
2. `src/47_book2.js` — Book Two's engine: the new squad (`TPL.sathi`, `tangle`, `haddat`, `marrow`, and the sergeant's Book Two history), Hackle the dog, the Chain (`chain()`, `chainHTML()`, `dgRest()`), `newStateDG()`, the glossary (`GLOSSX.dg`, whose rows unlock on `S.f.b2_duiker`, `b2_bult`, `b2_reloe`).
3. `src/40_chapter1.js` and `src/41_chapter2.js` — the schema and, above all, **the voice**. Match it: short paragraphs, dry soldier humour, grimdark restraint, no exclamation marks in narration, second person for the sergeant (gender never stated), `{sgt}` for the sergeant's name, italics with `*asterisks*`. Canon characters speak in their own book voices.
4. `docs/story-bible.md` §0 and "Systems since v3.11" — how checks, tricks, gods, second areas, hold-outs and flags work. `src/16_skill_checks.js` (`talk`, `check`, edges, near/clean/crit tiers), `src/31c_stakes.js` (`battleDef`, `stage2`, waves, objectives), `src/14_data.js` (`registerChapter`, BATTLES shape).

## How Book Two plugs in

- Export one constant, `B2CH1`, shaped like `CH1`/`CH2` (`title`, `number:'One'`, `intro`, `areas`, `battles`, `foes`, `gear`?, `scenes`, `dlg`, `end`, `tease`, `extras`, `journal`, `endCap`, `endScene`). `src/90_resume_boot.js` already registers it with `registerChapter(1, B2CH1, 'dg')`. Do **not** define `CH1`..`CH7` or touch Book One files.
- **Every id carries the `b2_` prefix**: areas, dialogue nodes, battles, foes, gear, scenes, flags (`S.f.b2_*`). Areas, nodes, fights and foes are global and shared with Book One, so a clash breaks Book One.
- A new Book Two game runs `newStateDG(name)` then `startChapter(1)`: squad `['sgt','haddat','sathi','tangle','marrow']`, level 1, water 8, column 0, satchel `{sharper:3, burner:2, cusser:2, salve:2, smoker:2}`, 12 silver. There is no prologue and no Deck reading in Book Two's Chapter 1 (no `card`).
- **The squad** (read their TPL entries; write to them, not past them):
  - **The sergeant**: Third Squad, Hissar garrison, six years in Seven Cities. Owes a debt to Ressan, an old water-seller in the water-sellers' quarter, whose family nursed the sergeant through a winter fever. The promise: if the city ever burned, come for his daughters first. The sergeant's quest line reads `S.f.b2_ressanOut` (set it when the daughters are out and Ressan is not).
  - **Haddat**: Hissari auxiliary, loyalist, tulwar and shield (`bash`). Speaks the tribes' tongues; parleys go through her. Her brother **Ilhar** rode out two nights ago with a green cloth on his arm (the rebels' mark). Plant it in this chapter (`S.f.b2_ilharDoor`: a green cloth on her family's door); don't resolve it.
  - **Sathi**: Wickan, Weasel Clan, 17, outrider, horse bow (`mark`). Talks to her dog Hackle in Wickan and to everyone else barely. Laughs at funerals (Wickan manners). Plant `S.f.b2_sathiCrows`: she sees crows settle over Coltaine's tent and decides it means something.
  - **Tangle**: sapper in Captain Mincer's company. Munitions are a fixed stock for the whole book; every one spent is gone for good. Hums four notes over a charge and stops when it matters.
  - **Marrow**: Napan Denul healer, ex-temple of Soliel. The warren has gone strange this summer (the Path of Hands, though nobody here knows the name). She keeps a knotted string, a knot for every healing that took.
  - **Hackle**: Sathi's Wickan cattle-dog. He joins every fight automatically as an ally beside Sathi (no code needed); give a fight `noDog:true` only if he truly can't be there. He takes away an enemy ambush's surprise.
- **Squad lines by roller.** Where Book One branches text on `ohl`/`kettle`/etc., branch on this squad's ids, with a `_` default. Skill-check `edges` can favour the right squadmate (Haddat for languages and the city, Sathi for tracking and horses, Tangle for locks and powder, Marrow for wounds and the sick).

## The Chain (water and the column)

- `chain(dWater, dColumn, why)` changes `S.chain.water` (0..12 skins) and `S.chain.column` (the refugees the squad itself is shepherding), and notes it. Water at 0: the squad fights parched (the engine does this). `dgRest()` spends a skin for a full rest; with none, there's no rest.
- `chainHTML(road)` returns the march widget; put it in a node's `html` wherever the column is the point (the camp, the march into the basin). The map header shows both numbers automatically.
- Choices should trade one against the other. Nobody gets both.

## The chapter

**Canon spine** (dg-canon §1): the rising takes Hissar; Coltaine's Wickans ride round the first rebel attackers, ambush them, and pull back with many citizens before rebel reinforcements arrive; the Seventh and the refugees march south-west; the first real battle is **Bat'rol** in the Vin'til Basin, where Kamist Reloe's eager, green Odhan army is smashed and regroups at Meila Oasis. Coltaine had a priest of Mael, **Mallick Rel**, thrown out of Hissar (a cameo at most: he is not killed, not exposed, not made to suffer by the squad). Duiker, Coltaine, Bult, Sormo E'nath, Nil and Nether are with the Seventh. Do **not** use Lull, List, Kulp, Keneb, Nethpara, Pullyk, or any canon character not named here; the canon sheet says where they really are.

**The squad's own story**, in four areas (16×12, `walk` and `triggers` as in Book One):

1. **`b2_quarter`**: the water-sellers' quarter, night, fires on the roofs, the Whirlwind's name being shouted from somewhere. Ressan's house and his two daughters (name them; keep names clear of canon, nothing like Felisin, Sha'ik, Lostara, Tavore or any Seven Cities canon name); neighbours; a quarter cistern behind an iron grille. Ressan refuses to leave his wells ("a water-seller does not leave his wells"); the daughters may go. Haddat's family door with a green cloth on it. A street fight with green-cloth rebels (**`b2_street`**, with a `stage2` in the well court). An optional cistern (water: Tangle can blow the grille, Haddat can talk the warden, or a fight with water-thieves, `b2_cistern`).
2. **`b2_gate`**: the square inside the south gate. The garrison is pulling out to Coltaine's camp; the water carts go in one bell. **The key choice**: the carts are here and the daughters are in the other direction, or the reverse, however you stage it; the sergeant must choose between **the promise** (`daughters`: the girls come out with the squad, column up, the carts leave without them, water down) and **the carts** (`carts`: the squad brings the garrison's water out, water up, and the daughters must take their chances; Bult can later tell the sergeant the Wickans brought many citizens out, and whether they were among them is left open, or later pays off; your call, but never cruel for its own sake). The rebels try to shut the gate: **`b2_gate`**, with a `stage2` on the gatehouse stairs. The Mael priest cameo can happen here or at the camp.
3. **`b2_camp`**: the Seventh's camp outside the walls, before dawn. Refugees pouring in; the Wickans come back from riding round the rebels with citizens on their saddles. Coltaine (very few words), Bult (earthy, laughs at the Fist), Duiker (the historian, curious, writing it down: set `b2_duiker`), Sormo (old eyes in a young face; he can tell Marrow the warrens are sick, and should). Bult hands the squad a stretch of the column ("you own these", a fixed `chain(0, +N)`), which is where the Chain begins. A rest with water (`dgRest`). Crows over Coltaine's tent (`b2_sathiCrows`).
4. **`b2_basin`**: the march south-west into the Vin'til Basin, day, heat. Reloe's army sighted (name him: `b2_reloe`). The squad holds a stretch of the flank by a dry wash. The battle **`b2_batrol`** (with a `stage2`, "The dry wash"), then the green army breaking and running for Meila Oasis. End with `chapterEnd(1, S.f.b2_key)`.

Feel free to add a small scene or two, a hold-out fight, or a check that changes something later, as Book One does; keep the chapter about the size of Book One's Chapter 1 or a little smaller (40–70 nodes). Plant, don't resolve: Ilhar, the crows, Marrow's string, Tangle's count, the daughters if left behind.

**Fights.** Styles: `'hissar'` for the city (set `dark:true` at night), `'odhan'` for the basin by day, `'odhan_night'` for the camp at night. Use `warren:{denul:.85, meanas:.85}` (Marrow's warren is fouled) with a `warrenText` that says so plainly. Difficulty at Book One's pitch for a five-person squad plus a dog. Total experience for the chapter about 500–600 (the squad should end the chapter around level 3). Foes (define them in `foes`, ids `b2_*`) must use these sprite kinds as `kind`: `rebel` (green-cloth townsman with a blade), `rebel_bow` (rebel archer), `tithansi` (Odhan tribesman, lance or spear), `semk` (a painted holy man of the Apocalypse who casts), `b2soldier` (a Malazan regular), `wickan` (a Wickan rider on foot). Use Book One's foe skills (`sk`: bleed, pin, shove, howl, parry, reach…) where they fit.

**Sprite kinds for NPCs** (drawn by the art pass in `src/47b_book2_art.js`; use exactly these): `coltaine`, `bult`, `duiker`, `sormo`, `wickan`, `b2soldier`, `hissari_m`, `hissari_w`, `child`, `noble`, `rebel`, `rebel_bow`, `tithansi`, `semk`, `ressan`, `priest` (the Mael priest), plus the squad's own ids and `hackle`.

**Map tiles** (the art pass draws these; use only these characters):
- `hissar`: `.` packed street, `,` ash and rubble, `#` building wall (blocks), `F` fire (blocks), `w` well or cistern (blocks), `c` cart, `p` palm, `=` market awning, `g` gate stones, `D` doorway, `~` water channel.
- `odhan` / `odhan_night`: `.` hardpan, `,` scrub, `s` sand, `#` rock outcrop (blocks), `r` low rock, `x` dead tree, `b` bones, `=` tent, `W` wagon, `F` campfire, `h` horse lines.
Set `decor` on each area to its style (`'hissar'`, `'odhan'`, `'odhan_night'`), and `dark:true` on a night area.

**Backdrops** (`scene` on a node, `intro.scene`, `endScene`; drawn by the art pass): `b2_hissar_burning` (the city on fire, seen from the walls), `b2_coltaine_tent` (lamp-lit tent interior), `b2_well` (a courtyard well at night), `b2_odhan_dusk` (the column strung out across the Odhan at dusk), `b2_odhan_day` (glare and dust), `b2_basin` (the Vin'til Basin at dawn). Register their captions in `scenes` (`{loc, sub, cap, amb}`); ambience already maps these names.

**End and after.** `end:{daughters:[title, text], carts:[title, text]}`; `extras:()=>[...]` for the end screen, built only from `S.f.b2_*`; `journal:()=>[...]` lines; `endCap:()=>'…'`; `endScene:'b2_odhan_dusk'`; `tease:'Next: …'` pointing at Dryj Spring and the Sekala. The level-up picks, tricks and gods all work without anything from you.

## Tests (all must pass before you finish)

- `python3 build.py`, `node --check` on your file, and `node tools/lint.mjs` with **0 errors** (warnings explained or fixed). The lint builds random states for Book One's squad; extend it so Book Two's areas and nodes (ids starting `b2_`) are checked under Book Two states (`S.book='dg'`, the Book Two squad, a `chain`), without weakening any Book One check.
- `tools/play.mjs`: add `--book=dg` (pick Book Two on the new-sergeant form before Begin; the run succeeds when it reaches Chapter 1's end screen, since there is no Chapter 2 yet). Run `node tools/play.mjs 3 --book=dg` until 3/3 pass, and `node tools/play.mjs 2` (Book One) must still pass.
- Then `node tools/run_all.mjs` must pass.
- Don't edit `src/47_book2.js`, `src/47b_book2_art.js` or any Book One file except where a bug blocks you; if you must, say exactly what and why in your report.
