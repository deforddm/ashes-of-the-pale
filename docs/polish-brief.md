# Polish pass (v3.7.0): the shared brief

**Ashes of the Pale** is David's personal Malazan fan RPG (Baldur's Gate 2-style), played on his phone as an installable PWA from GitHub Pages. It covers the whole of *Gardens of the Moon* from the ranks: a prologue plus seven chapters. His squad is the Fourth: the sergeant (the player, default name Hask), Brisk, Kettle, Tuft and Ohl, with Ellis as the one optional recruit (Chapter 2). The game is complete and stable. The lint is clean and bot playthroughs finish. This pass is **polish**: make everything that exists better, tighter, more consistent and more robust. It is not a pass for new chapters or new systems.

David asked for "the entire game some polishing". Treat it like a senior studio polish sprint: fix every bug you find, smooth every rough edge, and make the thing feel finished and loved.

## What David has already decided (do not change)

- **Tone.** Grimdark MBOTF, understated and concrete, Erikson-like. "The characters are the real treat." Prose is dry and specific, with no purple flourishes and no modern slang.
- **Canon.** The spine is fixed (the events of GotM happen as in the book). The margins are free: squad endings vary, the world ending doesn't. Canon names are exact: Whiskeyjack, Quick Ben, Kalam, Fiddler, Hedge, Trotts, Mallet, Sorry/Apsalar, Paran, Toc the Younger, Tattersail, Tayschrenn, Dujek Onearm, Lorn, Onos T'oolan (Tool), Anomander Rake, Crone, Kruppe, Murillio, Coll, Rallick Nom, Crokus Younghand, Challice, Baruk, Derudan, Mammot, Lady Simtal, Turban Orr, Raest, Tiste Andii, T'lan Imass, Moranth, Rhivi, Darujhistan, Pale, Gadrobi, Hounds of Shadow, Oponn, Kurald Galain, Omtose Phellack, Meanas, Denul, otataral, cusser/sharper/burner.
- **Combat rules he settled:**
  - Leftover movement stays usable after a partial move.
  - A clear ranged-attack radius indicator.
  - Flanking applies to melee *and* ranged, and the enemy AI seeks flanks.
  - Attacks of opportunity trigger on ANY step out of a tile next to an enemy, including sliding to another threatened tile. He tried the lenient version and asked for this one back.
  - Once a character has moved and then acted, they cannot move again that turn. Acting first still leaves the full move.
- **Skill checks.** The squadmate with the best matching stat rolls, the choice tag names them, and the d20 animation stays on screen about 2 s. He asked for it to stay a bit longer, so don't shorten it.
- **Difficulty.** Keep combat difficulty at the current pitch. Fix only outliers, such as a fight that is trivially won or near-impossible, a broken map or a degenerate AI loop, and justify each with evidence.
- **Only one recruit:** Ellis. No new squadmates, no new chapters, no new big systems.

## Hard rules for every worker

1. **Edit only the files you own** (see the map below). If something outside your files needs changing, put an exact proposed patch in your final report. The integrator applies it.
2. **Save compatibility.** David may have a save in progress. Never rename or remove dialogue node ids, flag names (`S.f.*`), item ids, battle ids, area ids, card ids or state fields. Adding new ones is fine. A saved `S.node` must still resolve.
3. **Never commit `index.html`**, which is generated. Build it to test, and commit only your `src/` (and owned) files: `git add <your files> && git commit -m "polish(<area>): …"`. Commit on your worktree branch. Several small commits are fine.
4. **Verify everything** before you finish:
   - `python3 build.py`
   - `node tools/lint.mjs`: no new ERRORS. The one known false positive is `c4_card: after-text contains "undefined"` (the linter draws cards outside that chapter's pool).
   - `node tools/play.mjs 1 --quiet`: a full bot playthrough must end `OK`. Add `--cheat` for a fast flow-only run, and `--from=N` to start at chapter N.
   - For anything visual, **look at it**. Use `node tools/shoot.mjs --out=/tmp/<you>/x.png --js="…"` (see the header of `tools/shoot.mjs` for setups), then Read the PNG. Check phone portrait 390×844 first, then 360×640, and a desktop 1280×800 if relevant.
   - The browser tools share a 2-slot lock (the machine has 2 CPUs), so you may wait a little. Don't run more than one play run at a time.
5. **Mobile first.** Everything is used by thumb on a phone: tap targets of at least about 40 px, no hover-only affordances, no horizontal page scroll, and text readable at the default font scale. It is dark-themed throughout.
6. **Performance.** Canvas scenes animate at 60 fps on a phone, so keep per-frame work cheap. Don't add big allocations or unbounded particle counts, and respect `REDUCE()` (reduced motion).
7. **No external assets and no new network dependencies.** Art is procedural canvas and audio is procedural WebAudio. Fonts come from Google Fonts: IM Fell English, IM Fell English SC, Alegreya Sans and Alegreya Sans SC. The test tools serve local copies.
8. **Don't pad.** If a thing is already good, leave it. Every change should make the game clearly better. Don't rewrite prose for the sake of it. Fix what is wrong, weak, inconsistent or unclear.

## How the code is laid out

`src/*.js` are concatenated in filename order into one `<script>` by `build.py`, so all top-level names are globals. Key pieces:

- **State:** `S` (the save), `B` (the live battle), `view`, `SQUAD()`, `S.f` (flags), `S.dead`, `S.chapters`, `recruit/unrecruit/kill`, `gain(item)`, `loy(id,n)`, `note()`, `gainXP()`.
- **Dialogue:** `DLG[id] = () => ({sp, scene, fx, txt, html, after, oncard, ch:[{t, go, fail, check:[stat,dc,who], req, fx, tag}]})`.
  - `talk(id)` renders a node. `fx` runs once per node per save (`S.fxd`).
  - `go` can be a node id, a function (it closes the sheet and runs it), or undefined (it just closes the sheet, which is fine on an explore map).
  - `*text*` becomes italic, a blank line starts a new paragraph, and `{sgt}` becomes the sergeant's name.
- **Chapters:** `src/40_chapter1.js` … `src/46_chapter7.js`. Each is a module `{title, number, intro, areas|area, battles, foes, gear, card, dlg, scenes, quests, end, tease, extras, endCap, finale…}` registered at boot by `registerChapter`.
- **Areas:** 16×12 char maps. `walk` holds the walkable chars, `triggers` maps a tile char to a node, and `npcs` entries look like `{id, name, kind, x, y, node(), show(), fresh(), still}`.
- **Battles:** 8×10 maps; party slots, foes, `waves`, `allies`, `objective:{type:'survive', rounds}`, `mortal`, `nomagic`.
- **Art:**
  - `drawFigure(ctx, kind, …)`: sprites, a switch on kind.
  - `drawPortrait`: character portraits.
  - `drawTile` / `drawEstateTile`: map tiles.
  - `drawScene` / `drawInterior` / `drawPlain` / `drawCity` / `drawEstate`: backdrops for talk scenes.
  - `drawCard`: the Deck of Dragons.
  - The title backdrop.
- **Audio:** `AUDIO.play(name)` for sound effects and `AUDIO.setScene(kind)` for music and ambience, all procedural.

## The test tools (in `tools/`)

- **`lint.mjs`** evaluates every dialogue node under 40 randomised states. It checks every target and reference, looks for soft-locks (no visible choice), template leaks (`undefined`, `NaN`, `${`), area and battle geometry, and items. The **REVIEW** section lists places where the text names a squadmate who, in that state, is not in the squad: dead after Chapter 6's otataral alley, Ellis gone through the rent in Chapter 5, or Ellis never recruited. Most are deliberate, the dead being remembered. Some are real bugs: a dead squadmate speaking or acting. Chapter workers must check every entry in their chapter against where the node can actually be reached.
- **`play.mjs`** is a bot that plays the real UI from the title to the end of the finale with random choices. It fights battles with the enemy AI on the squad's side (no abilities, so it plays worse than a person). It reports stuck states, page errors and battle losses.
- **`shoot.mjs`** takes a screenshot of any state.

## The ownership map

| Worker | Owns |
|---|---|
| combat | `src/31_battle.js`, `src/27_pathfinding.js`, `src/26_display_interpolation.js` |
| ui | `src/00_head.html`, `src/01_style.css`, `src/02_body.html`, `src/11_utilities.js`, `src/12_settings.js`, `src/15_state.js`, `src/16_skill_checks.js`, `src/24_canvas_setup.js`, `src/28_hud.js`, `src/29_title_intro.js`, `src/30_explore.js`, `src/32_ending.js`, `src/33_character_sheets_one_at_a_time.js`, `src/34_settings.js`, `src/35_pack_journal_save.js`, `src/37_chapters.js`, `src/90_resume_boot.js`, `src/99_boot2.js`, `sw.js`, `manifest.webmanifest` |
| art | `src/17_drawing_helpers.js`, `src/18_figure_sprites.js`, `src/19_portraits.js`, `src/20_deck_of_dragons_card_art.js`, `src/21_the_reading_full_screen_card_sequence.js`, `src/22_title_backdrop_moon_s_spawn_over_the_pale.js`, `src/23_tunnel_scene_backdrop_talk_nodes_away_from_the_map.js`, `src/25_tiles.js` |
| audio | `src/13_audio_engine_all_procedural.js` |
| prologue | `src/39_prologue.js`, `src/14_data.js` (squad data, the prologue's foes, cards, picks, the Pale map) |
| ch1 … ch7 | `src/40_chapter1.js` … `src/46_chapter7.js`, one each |

The integrator (the lead) merges all branches, applies the cross-file patches from the reports, bumps the version and publishes.

## Your final report (your last message)

Keep it tight. The integrator reads a dozen of these.

1. The branch name and commit hash(es).
2. **What you changed:** a bullet per change, with the why.
3. **Cross-file patches needed:** exact file, find and replace, or clear instructions.
4. **Found but not fixed**, and why.
5. **Verification:** the lint summary line, the play result line, and which screenshots you checked.
