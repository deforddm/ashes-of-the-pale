# Engine work for v3.5/v3.6 — Chapters 6 (The Fete) and 7 (Outlaws, the finale)

You are extending the engine of *Ashes of the Pale*, a Malazan fan RPG (mobile PWA, one HTML file built from `src/`). Repo: `/home/claude/ashes-of-the-pale`. `python3 build.py` concatenates `src/00_head.html`, `01_style.css`, `02_body.html`, every `src/1x–9x_*.js` in filename order, and `99_boot2.js` into `index.html`.

**Two other writers are working at the same time** on `src/45_chapter6.js` (from `docs/ch6-brief.md`) and `src/46_chapter7.js` (from `docs/ch7-brief.md`). **Do not create, edit or delete those two files or any file in `docs/`.** They may appear half-written while you work, so **do not run `build.py`** — for your tests build a page in your scratch space with a copy of the build logic that skips `45_*.js` and `46_*.js`, and inject small stub chapters of your own there.

Read first: `docs/ch6-brief.md` and `docs/ch7-brief.md` (the sections "Engine surface", the foe lists, the finale spec and both flag contracts — **everything they promise, you implement, with exactly those names**), then the engine: `src/14_data.js`, `15_state.js`, `16_skill_checks.js` (`check`, `talk`, `SCENES`, `sceneShell`), `18_figure_sprites.js`, `19_portraits.js`, `20_deck_of_dragons_card_art.js`, `21_the_reading_full_screen_card_sequence.js`, `23_tunnel_scene_backdrop_talk_nodes_away_from_the_map.js` (`drawCity` is the model for new scenes), `24_canvas_setup.js`, `25_tiles.js`, `30_explore.js`, `31_battle.js`, `37_chapters.js`, `90_resume_boot.js`, `99_boot2.js`, `01_style.css`, `13_audio_engine_all_procedural.js`. Match the existing code style (dense, one-liners, `ell`/`poly`/`glow`/`hash` helpers from `17_drawing_helpers.js`, grimdark palette, everything procedural — no images).

## 1. Chapter module fields (registerChapter in `14_data.js`, end screen in `37_chapters.js`)

- `CH.scenes` → `Object.assign(SCENES, CH.scenes)` (text entries `{loc, sub, cap, amb, warren?}`; drawing is yours, §6).
- `CH.quests` → `Object.assign(QUESTS, CH.quests)`.
- `CH.end` → `CHEND[n] = CH.end`; `CH.tease` → `CHTEASE[n] = CH.tease`.
- `CH.extras()` → extra bullet lines on the end screen (append after the engine's own); `CH.endCap()` → the caption under the end-screen picture (default stays "Morning finds the Fourth still standing…"); `CH.endScene` (optional string) → the end-screen canvas scene (defaults: chapter 6 → `'fete_garden'`, chapter 7 → `'quorl_hill'`, else `'camp'` as now).
- `CH.intro.scene` (optional) → the chapter-intro canvas; defaults: chapter 6 → `'fete_street'`, chapter 7 → `'lakefront_dawn'`; otherwise the existing decor mapping (extend it: `estate_*` → `'fete_garden'`, `lakefront` → `'lakefront_dawn'`).
- `CH.finale` (Chapter 7) — see §8.
- Boot (`90_resume_boot.js start()`): register CH6 and CH7 with the same `typeof` guards as CH1–5.

## 2. State helpers (`15_state.js`)

- `migrate`: `s.dead ??= {}`.
- `kill(id)`: if `id !== 'sgt'` and in the squad → remove from `S.squad`, `S.dead[id] = {ch:S.chapter, where:(B && B.def && B.def.title) || ''}`, trim `S.trail` like `unrecruit`, `save()`. No note (the battle writes it).
- `listCount()`: `211 + (S.f.c2_key === 'light' ? 1 : 0) + (S.f.c4_key === 'aside' ? 1 : 0) + Object.keys(S.dead || {}).length + (S.f.listAdds || 0)` — Ohl's list.

## 3. Battles (`31_battle.js`)

- **`def.nomagic`** (otataral): every ability with a `strain` cost is unusable (`abOk` false; the button shows disabled). Units with `magic:true` (Tuft, Ohl) fight with a knife/cudgel: range 1, damage `[1,4,1]` for Tuft (Ohl keeps his cudgel), verb `'jabs a knife at'` for Tuft. Log once at the start: *Otataral. The warrens are dead here.* Items (sharper/burner/cusser/salve) still work.
- **`def.mortal`**: at `startBattle` set `S.f.lastFallen = []`. In `win()`: fallen = squad units (side `'p'`, not `ally`) with `hp <= 0`. If the sergeant fell: `S.f.sgtScar = 1` (the sergeant lives). Everyone else who fell: push to `S.f.lastFallen` and `kill(id)`. Replace the usual "Ohl patches up the squad; everyone is back on their feet" note with "`<names>` did not get up." (bad) when anyone died, else "Everyone is still breathing." — and when Ohl is dead, never say Ohl patches anyone. `lose()` is unchanged (retry restores the snapshot; no one dies on a retry).
- **Foe `immortal:true`**: `hurt()` never takes it below 1 health (float `'holds'` when a blow would have dropped it). It never dies; such battles always have a survive objective.
- **Foe `attacks:n`**: in `ai()`, after its first attack, attack again (same target if alive, else another in range) up to `n` times, with a short wait between.
- **Foe `ai:'raest'`**: the Tyrant. Keep a turn counter. On odd turns: **the lance** — pick a random living party unit anywhere on the field (squad preferred over allies), draw an ice-blue bolt from the Tyrant to it (`#bfe8ff`), then hurt it `roll(2,8,2)` and every other *party* unit adjacent to it `roll(1,8,0)`, ice-blue sparks, `shakeMap()`, log "The Tyrant speaks a word of Omtose Phellack. The air around X turns to knives." On even turns: the normal AI (it has `mv:2`, melee). Give its sprite a frost glow.
- **Foe `kind`**: already works through the spread in `mkFoe`/`mkAlly` — make sure the corpse, the turn chips and the sprite all use `u.kind`. Allies show as "`name` (ally)" as now.
- **Card `'chains'`**: when an enemy hits a squadmate (not an ally), after the damage lands the attacker takes 2 (`hurt(a, 2)`, log "The chains bite back."; immortal foes clamp as usual).
- New battle **styles** passed to `prerender` → `drawTile`: `'garden'`, `'terrace'`, `'storm'`, `'dock'` (§4).

## 4. Tiles (`25_tiles.js`) and prerender (`24_canvas_setup.js`)

**Estate style** — decors `estate_night`, `estate_terrace`, `estate_storm`, and battle styles `garden` (= estate_night lawn), `terrace` (= estate_terrace), `storm` (= estate_storm). Night palette, deep blue-green, lantern-warm accents.
`.` lawn (garden: trimmed dark lawn with mower stripes; terrace: pale marble flagstones with seams) · `,` raked gravel (garden) / a mosaic runner in deep red and lapis (terrace) · `h` hedge (clipped, dark, a lit top edge) · `f` fountain (round stone basin, water, a spout) · `l` Fete lantern pole (a post with a string of 3–4 paper lanterns, red/amber/green/blue) · `b` balustrade (low stone rail with turned balusters) · `s` statue on a plinth · `t` banquet table (white cloth, dishes, a candle, a wine jug) · `w` ornamental pond (dark water, lily pads) · `T` tree (canopy, trunk shadow) · `A` **the Finnest sapling**: turned earth and a black, twisted young tree — and **when `S.f.c6_azath` is set, the young Azath**: a small, wrong house of living wood with a peaked roof and roots in the lawn (prerender reads the flag; the explore view re-prerenders when you enter the area) · `D` a lit door in a wall · `g` an iron gate · `#` wall (garden: old brick with ivy; terrace: pale dressed stone; in battle styles: `garden` → a hedge block, `terrace` → a pillar/balustrade block, `storm` → a block of ice or a broken statue) · exits `>` `<` **and `^` `v`** (arrows up/down; add `^`/`v` to every style).
`estate_storm`/`storm`: the same garden, frozen: white-blue frost rings on the lawn, broken lantern paper, ice on the hedges.

**City style additions** (`city_*`, `cellar`, `lakefront`, battle style `city`): `l` Fete lantern pole (festive string across the street), `g` iron gate, `~` lake water (dark, moving highlights), `p` pier planks, `n` a moored boat (hull, mast stub), `k` a bollard with rope, and `^` `v` arrows.
**`lakefront` decor**: the city style at **dawn** — cooler blue-grey stone warming at the east edge; lamps (`L`) burning low and blue, going out; the lake `~`.
**Battle style `dock`**: `.` wet cobbles, `,` pier planks, `#` lake water (draw water, it blocks).
**Prerender dark flag** (`fitCanvas`): add `estate_night`, `estate_terrace`, `estate_storm` to the dark decors; `lakefront` is not dark.

## 5. Explore dressing (`30_explore.js drawExplore`)

- `estate_*`: animated lantern glows on `l` (warm, multi-coloured, a slight sway), fountain shimmer on `f` and glints on `w`, a faint green-violet pulse on `A` (the Azath: a slow pulse and a lit window), warm light spilling from `D`; a night-blue overlay; **drifting Fete confetti/paper petals** instead of ash on `estate_night`/`estate_terrace`; on `estate_storm` drifting ice and no lantern glows; vignette and party lantern warmth tuned to match `city_night`.
- `lakefront`: animated highlights on `~`, a warm dawn gradient from the right, lake mist in the fog banks, a few gulls (small `v` shapes) drifting; no ash.
- Audio (optional polish): an ambience for the Fete (a far crowd murmur and pipes) and for the lake (water on piles, gulls) in `13_audio_engine…` — pick them from the decor in `startExplore` when an area has no `amb`, and from the scene id in `sceneShell` for the new scenes. Keep them quiet.

## 6. Scenes (`23_…js` + the dispatch in `90_resume_boot.js loop()` and `showChapterIntro`/`showChapterEnd`)

Write `drawEstate(cv, kind, t)` (or several functions) for these scene ids, in the style of `drawCity`/`drawPlain` (560×240 canvas, painterly, animated, grimdark; draw the squad with `drawFigure` where it fits, using `SQUAD()`):
- `fete_street` — dusk; a Darujhistan street strung with Fete lanterns; masked revellers; blue gas lamps; Moon's Spawn black over the lake.
- `fete_hall` — the hall/terrace: chandeliers, masked dancers, pillars; a very tall figure in a black dragon mask by a pillar (`rakemask`); Kruppe at a table.
- `fete_garden` — the garden at night: hedges, lanterns in the trees, the fountain, the sapling; if `S.f.c6_azath`, the young Azath house stands in it (a squat, wrong house of dark wood, a yard of mounds); lighting is **dawn** when `S.chapter >= 7` or the current node (`S.node`) starts with `c6_dawn` or `c6_close`.
- `garden_storm` — frost rings spreading on the lawn, lanterns dead, a masked figure (`raest`) with ice, the Azath's roots coming up out of the lawn, coloured warren-light (Quick Ben).
- `dragon_sky` — Darujhistan's roofs at night, Moon's Spawn low; two great dragons over the city — one black (Rake), one pale and wrong (the demon) — circling and striking; every few seconds a burst of black **smoke-chains** (Dragnipur drawn).
- `alley_night` — a narrow wet alley, walls close on both sides, one blue lamp, a doorway, a figure in a faded crimson cloak half in shadow (`crimson`, only faintly).
- `lakefront_dawn` — docks, the lake, a ship at a pier, gulls, the city behind; **the sky has nothing in it** (no Moon's Spawn).
- `quorl_hill` — a brown hill east of the city, morning; quorls (huge black four-winged insects) on the grass; Black Moranth in chitin; the city small behind; Rhivi riders far off on the road.
- `road_east` — morning; a long column of soldiers and wagons very far off on a road going north-east through brown hills; banners; the squad in the foreground.
- `ship` — a deck, a rail, a sail, open grey water, the city receding.
Dispatch these from `loop()` (before the `drawScene` fallback).

## 7. Sprites (`18_figure_sprites.js drawFigure`), cards, the reading

**Sprites** (same ~32px idiom, `o.phase` for variation, `o.still`): `rake` (very tall — scale ~1.3 — black clothing, long silver-white hair, a great black sword on his back trailing faint smoke), `rakemask` (the same with a black dragon mask), `baruk` (older man, dark red alchemist's robes, a skullcap), `simtal` (a noblewoman in a pale gown, jewels), `orr` (a councilman in green and gold, a rapier), `reveller` (a masked Fete guest; gown or coat colour and mask vary with `o.phase`), `houseguard` (Simtal's livery in blue and silver, a halberd), `mammot` (an old priest in robes wearing a tusked Jaghut mask), `raest` (Mammot possessed: the tusked mask, too tall, frost glow, ice at the hands), `rime` (a rime-dead: a figure of ice and old bone, pale blue, crystalline), `crimson` (a man in a faded crimson cloak, a plain sword), `irilta` (a big woman, apron, a cudgel), `meese` (a lean woman, a kitchen knife), `challice` (a young noblewoman in a mask), `dujek` (an old soldier, one arm, grey), `moranth` (a Black Moranth: black chitin plates, a full helm with no face, a crossbow), `quorl` (a huge black four-winged insect, long body; the wings shimmer; `still` sits it down).
**Cards** (`14_data.js` CARDS + `20_…` art): `chains` (Unaligned: chains hanging out of darkness, links catching light, the shadow of a sword), `blank` = `{name:'The unpainted card', house:'—', hue:'#d8d0c0', txt:'No house. No figure. Gesso and grain, and nothing on it yet.', fx:'None. It isn\'t anyone\'s yet.'}` (art: a pale, empty gessoed face with grain), and better art for `crown` (an iron crown with a thread of gold, empty throne-dark behind). The chapters' own `card` entries overwrite `CARDS.chains`/`CARDS.crown` text at registration — keep the ids.
**`check()`** (`16_skill_checks.js`): with `S.card === 'crown'`, roll two d20 and keep the better (say so in the note: "the Crown: best of two").
**`cardSequence(done, opt = {})`** (`21_…js`): `opt.card` shows that card instead of `S.card` and **does not change `S.card`**; with `opt.self` the captions become a self-draw ("Tuft shuffles. Her hands are not steady." → "One card. For herself. The first time." → "The cards on either side stay face down." → "She turns it over.") and the two flanking cards never flip; the button reads "Put the card away".

## 8. The finale (`37_chapters.js` + CSS + resume)

When `chapterEnd(7, key)` runs, the normal end screen shows (with `CH7.end`/`extras`/`endCap`); since there is no Chapter 8, its primary button is **"Epilogue"**, which opens the finale. State: `S.scene = 'finale'`, `S.finPage = i`; `resume()` returns to the page. Pages:
1. **The road** — `CH7.finale.endings[key]`: its `scene` on the canvas, the `title` large, the `paras`.
2. **One page per squadmate still in `S.squad`** (excluding `'sgt'`, in squad order): the animated portrait (`drawPortrait` from `19_portraits.js`, e.g. 200×260), name, role, loyalty (`loyLabel`), and `CH7.finale.fate(id, key)` → `{title, txt}` (`txt` through `fmt`).
3. **One page per squadmate not in the squad** (check `['brisk','kettle','tuft','ohl','ellis']`): call `CH7.finale.gone(id, key)`; if it returns `null`/`undefined`, skip; otherwise the portrait drawn greyed and dimmed (CSS filter), a small "†" or "gone" mark as fits (`S.dead[id]` → dead; else gone), and the text.
4. **The sergeant** — `fate('sgt', key)` with the `sgt` portrait.
5. **The end** — `CH7.finale.coda(key)` paragraphs, then an engine-built **campaign summary**: "The Fourth's road": the prologue's key title (`CHEND[0][S.chapters[0]][0]`) and, for each chapter 1–7, `Chapter N · <title> — <CHEND[n][S.chapters[n]][0]>`; the dead (name, and `S.dead[id].where`); "Ohl's list: N names" (`listCount()`); squad level; then **"The End of *Gardens of the Moon*"** and a line of thanks-to-the-author credit ("The Malazan world and its canon characters belong to Steven Erikson."). Buttons: Back, "The squad" (`openChars(0)`), "Title".
Every page has Back / Next (and swipe or arrow keys if easy). `AUDIO.setScene('end')`. Style it with the game's CSS vocabulary (`.end`, `.narr`, `.kv`, `.btn`) plus a new `.fin` block in `01_style.css`; it must read well at phone width (the game is played on a phone) and in the existing dark palette. If `CH7` or `CH7.finale` is missing, fall back gracefully (no crash).

## 9. Housekeeping

- `src/10_preamble.js`: `VERSION = '3.6.0'`; `sw.js`: `CACHE = 'ashes-v3.6.0'`.
- Title fine print (`29_title_intro.js`): "Gardens of the Moon, from the ranks: the prologue and all seven chapters." (keep the rest).
- `README.md` Versions: add v3.2.0 (Chapter Three: Blue Fire), v3.3.0 (Chapter Four: Assassins), v3.4.0 (Chapter Five: The Gadrobi Hills) if missing, and v3.6.0 (Chapters Six and Seven: The Fete, Outlaws — the end of the book; estate and lakefront maps, the Tyrant, the Adjunct, otataral and mortal fights, the finale and a page per squadmate).
- Journal tab (`35_pack_journal_save.js`): no change needed.

## 10. Test (Playwright, headless, in your scratch space)

Chromium: `executablePath: '/opt/pw-browsers/chromium'` (do not run `playwright install`). Build your test page (skipping `45_`/`46_`), inject stub chapters `CH6`/`CH7` with tiny areas using every new tile letter in each new decor, tiny battles using every new style/field (`nomagic`, `mortal`, `immortal`, `attacks:2`, `ai:'raest'`, allies with `kind`), a stub `finale`, and exercise: every new sprite (a grid of them on a canvas), every new scene id, every tile style, the Tyrant's lance, Lorn's double attack and immortality, a mortal win where a squadmate fell (check `S.dead`, `S.squad`, `S.f.lastFallen`, `S.f.sgtScar`, the note), `listCount()`, the Crown check, `cardSequence` with `{card:'blank', self:true}`, the end screen for chapter 7 → Epilogue → every finale page → Title, and `resume()` into a finale page. Look at your screenshots (Read them) and fix what looks wrong. Extract the built page's `<script>` blocks and `node --check` them. Report what you built, any deviation from the chapter briefs' engine surface (there should be none), and the screenshot paths.
