# Ashes of the Pale: whole-project audit at v3.15.3

Tue Oct 6, 2026, 8:04 PM PDT. Read-only look-over of commit d4ec571 (game v3.15.3). Nothing in the game was changed. This is the worklist for the canon and polish pass (planned as v3.16.0).

**Read with `forward-canon-v3.15.3.md` (Oct 7), which checks this audit against the later books. Where the two disagree, that doc wins: it corrects §1.3 (Lorn's alley), §1.4 #53, §1.5 (Moon's Spawn, the Chains card, the Mouse Quarter wording), §1.6 (warrens) and §6 calls 1 and 5.**

**How it was checked.** The repo was cloned and compared with `C:\Users\stone\Ashes` (same files, same sizes; five spot-compared byte for byte). `build.py` reproduces `index.html` exactly. Lint: 682 nodes, 0 errors. back_test, item_view_test, fit_test, stakes_test, tactics_test, tricks_test and one bot playthrough to the finale all pass. Four separate read-throughs then covered continuity, canon, art and upkeep; the art one rendered the maps and about 30 screens at 360×800 and 1366×768. Canon was checked against the Malazan Wiki and the Reactor re-read where they could be reached; each canon item carries a confidence. **Re-read the lines before changing anything, and re-check any canon item marked medium or low against the novel.** Line numbers are for v3.15.3.

---

## 1. Canon

### 1.1 The Genabackis map is the wrong way round (high)

The 3.15.0 redraw put Darujhistan south-south-WEST of Pale with Lake Azur to Pale's south-west (`src/19c_artwork.js:85`, `docs/art/MapGenabackis.dc.html`; its label says "from Pale south-west to Darujhistan"). The official map in the Ashes folder (`Map_Genabackis_from_GotM.webp`) has the city south and a little EAST of Pale, Lake Azur due south of Pale, and the city on the lake's south-east corner. The game's own text already agrees with the official map ("three days south-east of Pale", 41:34; "South-east across the plain, over the Gadrobi Hills", 40:889). The "south-west" lines in Ch2 are spoken from out on the plain, where the city really is south-west.

Target geography (official map plus the existing text):
- Pale at the top, Tahlyn Mountains to its east, Lake Azur due south of it, Darujhistan on the lake's south-east corner.
- The Fourth's road: east-south-east from Pale along the Tahlyn Mountains (Ch2 seal about three days out), south at The Divide, then west and south-west through the Gadrobi Hills (Ch5 seal) to Worrytown and the Worry Gate.
- The quorl flight: south, a touch east, to the lake's north shore, then the boat.
- R. Maiten leaves the lake at the city, flowing south-west. Dhavran sits on the lake's west tip. Moranth Mountains north-west of the lake. Label the Dwelling Plain south of the city.
- The "north, to the Free Cities" arrow points east; it should point up.
- Seal VII sits off the dotted road; put it on it.

Also on the maps:
- **Darujhistan** (`19c:86`, `MapDaru.dc.html`), against `Map_Darujhistan.webp`: the wall round the Estate District is the Third Tier Wall, not "the second tier wall"; Worrytown sits directly outside the east gate along the road (the game's own 44:31 says so), not to the south-east; along the east wall the order north to south is Majesty Hill, Despot's Barbican, K'rul's Hill, High Gallows Hill; the city fill covers Daru Bay so the bay reads as dry land; pin 4 (the Blue Hand) sits in the Marsh District but 42:1068 says Daru District.
- **Pale** (`19c:87`): the tunnel mouth is drawn south-west outside the walls; the text says the north wall (39:76, 39:138, 14_data:138).
- **Gadrobi** (`19c:88`): "a brown hill · VII" is on the barrow's field map three days out, but Ch7 has the city "small and blue behind" (46:262); the blue arc bottom-left is unlabelled.
- **Old route map** (`src/38_deeds.js:18-27`, journal and Deeds): puts Lake Azur south of the city; it is north-west. The journal currently shows two maps that disagree.
- 46:1362 "The quay runs east to the Gadrobi District" disagrees with the game's own city map (medium).
- 44:782 says the city road runs "north-west" from the barrow; everything else says west.
- `docs/ch2-brief.md:28` still says "far south-east".

### 1.2 The Deck visions (`src/36b_visions.js`) have never had a canon pass

| # | Where | Game | Novel | Conf. |
|---|---|---|---|---|
| 1 | v1_paran :37-42 | The Twin names the sword: "Call it *Chance*." | Paran named it himself the day he bought it, years before Pale. | high |
| 2 | v1_paran :7, :15 | Hood's Gate is two posts and a lintel; Paran is passive. | A gate of writhing bodies; Paran bargains. | med-high |
| 3 | v2_crone :87 | "Five warrens in one fire" | Seven. | high |
| 4 | v3_qb :115 | Quick Ben walks into Shadowkeep, "Nobody stops him." | Hounds escort him. | high |
| 5 | v4_rallick :157-178, v4_hunter :204 | The fight is inside the warehouse; bolts to the chest; a knife. | Rallick on the roof, Ocelot in the yard; the quarrel between the shoulder blades; he answers with a crossbow. | med-high |
| 6 | v4_hunter :194, v4_rallick :165 | The Guild killings have run "a season". | A few weeks at most; the game itself says "a month" (46:129). | medium |
| 7 | v5_paran :321-329 | Two Hounds; Rake speaks "an hour" later. | All seven Hounds; Rake kills two and speaks on the spot. | high |
| 8 | v5_paran :349 | "he came in by the sword" | By the blood (the vision's own :337 says so). | high |
| 9 | v6_rake :400-412 | The demon falls into Baruk's house; Rake nods to Crokus. | The street by Baruk's; Rake speaks to Crokus. | medium |
| 10 | v7_lorn :435, :437 | "since the spring"; the demon is "a word, a seal". | The Fete is the first night of spring; a glass flask. | low |

House style: the visions spell it "Fête" (3 times); the rest of the game says "Fete" (136).

### 1.3 The visions against the chapters (the player sees both)

- **Lorn's alley** (v7_lorn :447-463 vs 45:2183-2326): "A stranger in a blue cloak" vs "a faded crimson cloak"; he cuts twice and she runs vs one thrust, "fast, not running"; two knives vs a cudgel and a kitchen knife; Paran takes the sword while she lives vs after he closes her eyes; and the Fourth is missing from an alley it may have stood in.
- **Rake over the city** (v6_rake :369-406 vs 45:1952-1962, :2084, :2280): the vision has him on K'rul's belfry and the kill at Baruk's; the chapter leaves his glass on Simtal's rail with the dragon "Above the house" and the kill "on a roof over the Daru District". The vision is the canon one (this is bible §8 #44).
- **Hairlock's end** (v5_paran :325-363 vs 44:1348-1374): different Hounds, different witnesses, Rake speaks vs "He says nothing", "No blood" vs hands "black to the wrist".
- **Paran at Pale** (v1_paran :11, :54, :62 vs 40:286-309, 40:712, 44:761): the vision plays at the Ch1 reading, before Paran can be met walking the lines, yet shows him already knifed and waking; Ch5 has him "on my back in the mud with a surgeon".
- **Crone at the ashes** (v2_crone :70, :89, :91 vs 41:1019, 41:1178, 41:1192): two figures on foot vs "a fat woman on a bad horse"; the bodies wound together vs apart; Crone "doesn't go down" vs "On the glass, with the dead still warm".
- **Tuft never carries a vision forward.** Nothing outside 36b reads `S.seenVisions` or a `v*_` flag, so she can watch Quick Ben sell Hairlock in Ch3 and still say "Somebody sent them… the part I can't stop thinking about" (44:1523).
- The journal's Visions list (36b:559-567) replays every vision ending with Tuft in the present, even if she is dead.
- 45:2311 (new in 3.14.0): "The last time you saw him he was standing on a frozen lawn, and then he wasn't" is on the alley path, but only the Bridgeburner path sees Paran vanish.

### 1.4 Chapter slips still in the text (bible §8, canon items)

| §8 | Status | Where | Smallest fix |
|---|---|---|---|
| 43 Paran and Chance | **Fixed** in 3.14.0, no leftovers | | |
| 44 Rake leaves from the belfry; kill at Baruk's | still there (high) | 45:1952-1954, :1962, :2084, :2280, :1695 | Three sky nodes: the dragon rises up the hill over a bell-tower; the kill is behind a wall up the hill. The official city map puts Baruk's Estate in the Estate District, so "the Daru District" is wrong as well. |
| 45 Rallick is masked at the Fete | still there (med-high) | 45:1171, :695 | "in a cheap tiger mask". |
| 47 Five dragons leave as Mammot unmasks | still there (high) | 45:1759 | Move the sentence to the dusk street (near 45:710), or make it five shapes coming back, one red, flying hurt. |
| 50 "the morning tide" on a lake | still there (med-high) | 46:495, :1041 | "the morning wind". The ship and "the sea" are fine. |
| 57 Ocelot's foreknowledge | still there (high) | 45:1119 | "Ocelot's standing word was…". |
| 53 "With the Imass" | soft | 44:775, :1389 | Optional: drop the three words. |
| 54 "an Andii behind him" | soft | 43:423 | Optional. |
| 46, 48, 52, 58 | defensible staging | | Leave; record as deliberate. |
| **49, 51, 55** | **the bible is wrong, the game is right** | | Hedge survives the novel; the Black Moranth did fly the squad; Dujek does name the Pannion Seer. Strike them from §8. |

### 1.5 Data and terms

- `14_data.js:35`, Tuft's bio: "the night the Claw came through the Quarter killing every mage". The Mouse Quarter purge was the new mage cadre enforcing the ban on sorcery. "The Claw" → "the cadre mages" (high).
- 43:1002, Kalam on the Andii: "I've watched them for a month". The Bridgeburners arrived about a week before the Fourth (medium).
- Moon's Spawn: 43:1226 and 45:2516 put the dawn "behind it" while it sits west of the city; 46:129 says "the sun came up where it had been". Pick one sky.
- Tattersail's "tent" on the "cadre row" (40:391, :764) against the novel's rooms in Pale, which vision 1 follows (36b:54). Leave the chapter; make the vision not contradict it.
- Deck: "Chains" and "the Great Raven" are not Gardens of the Moon cards, and the novel's card is "Hound", not "Hounds of Shadow". Invented on purpose; record as deliberate.
- `35_pack_journal_save.js:79` glossary: "Onearm's Host: The Second Army" (it is three armies; low). `31c_stakes.js:148` Soliel's title (unverified).
- "otataral" is lower-case 35 times and capitalised 20. README:63 still says "squad of nine".

### 1.6 Checked and clean

Munitions (sharper, burner, cusser, smoker; cussers from the cradle, never thrown). Every listed name and place spelling across `src`, `docs/art` and the README. The Erikson and Esslemont credit on the README, title, finale and both map plates. Warrens, ranks, the calendar, Gedderone, the Twins. Every other compass direction in the text.

---

## 2. Continuity

### 2.1 Story bible §8: still in the text at v3.15.3

Chapters 39–44 have not changed since the bible was written, so every item it listed as open is still open. Story-breaking first.

- **#16** Kept-Tuft after Rake's courtesy: 45:1526, :1548, :1564, :1576 are not gated on `!c6_badgeCold`; 45:1739 shows "somebody standing behind the glass" of a dead badge.
- **#17** Hedge's cusser: the text hands it over on `S.inv.cusser > 0` (45:1900) but the fx needs `> (maudKept() ? 1 : 0)` (45:1897); then 45:2439 says "I didn't have one to give him".
- **#10** Chapter 5 end, `through`: "when someone in the Fourth moved to follow him, the sergeant said go" (37:21) is wrong on the Tuft path.
- **#8** 45:193 "Eleven of Hedge's down there… And four cussers"; everywhere else it is forty of Hedge's and twelve cussers. 45:318 calls all forty "Moranth munitions".
- **#18** 42:1121 Brisk: "Ninth Regiment… Heavy." She joined the Third.
- **#19** Coll's Ch5 outcome (`c5_collTended` / `c5_collRefused`) is never read after Ch5.
- **#20** 42:447 "You're the baggage." ignores a Ch1 meeting at the bones (`c1_bones`).
- **#21** 44:941 "Five men with lanterns" is written on Ohl's list but never counted.
- **#22** 46:1992: the finale's list count can be lower than the number Ohl gave Dujek that morning.
- **#23** 45:2157 "the way they did on the roof" shows on the `aside` path too.
- **#26, #27** The Claw's promise and Kalam's "He never will" (43:202) against Kalam's word in Ch7 (46:562, 46:826).
- **#28** 46:2352 "Ohl crossed out her space anyway" has no scene and no flag behind it.
- **#29** 46:1004 "Brisk has the glove out of her belt already" without checking who holds the glove.
- **#31** 46:2236 Brisk's "She salutes when she passes you" prints when she did not follow.
- **#35** Ch'kess is "it" in narration and "he" at 46:2116, 46:2242.
- Smaller or cosmetic: #7, #13, #24, #25, #30, #33, #34, #36, #37, #38, #39, #40, #42. #32 holds. #41: the lint's "never written" list is now 14, all dynamic writes.

### 2.2 New since the bible

- Item viewer, `19d_art.js:45`: "Chub's is called Maud, and Kettle keeps her out of ordinary fights" still shows after Maud is thrown at the barrow or handed back.
- The Rations ledger paper (`19c:133`, shown to everyone from Ch7 by `19d:90`) is one fixed page listing branch-only entries ("One day lost, west", "One vault. Forty and twelve. Not fired.", "In line before they stood"), and "Ten silver. Alley." has no source line.
- Journal maps unlock early and show later chapters: Genabackis (from Ch2) shows seals V and VII and "Moon's Spawn, until it moved"; Darujhistan (from Ch3) lists the Fete and "the last accounting" (`19d:84-85`). The "Tool" face unlocks at Ch2, three chapters before he is named (`19c:7`).
- Claw file paper (`19c:134`) says "all five" and lists four.
- 36b:311 and 44:1397 say "a month"; Pale to Ch5 is about three weeks by the game's own count (soft).

### 2.3 Not bugs: leave alone

- The lint's 140 "names an absent squadmate" lines: every one read is unreachable in that state, a deliberate naming of the dead, or the lint dropping someone who cannot yet be dead.
- The 14 "read but never written" flags are written dynamically (36b:481, 36_minigames:151). Teach the lint; do not touch the text.
- All 29 open threads in bible §6 are still open. Four are open on purpose (Vell's mark, the second Andii's hesitation, Sethand's debt, Toc's fate).
- Numbers that agree everywhere: eleven or twelve days, thirteen slots with twelve and a dud, 211, fourteen months, six years, eleven years.

---

## 3. Art

Seen in renders, most noticeable first.

1. The maps' handwriting font is never loaded. Ten labels ask for "Homemade Apple"; the page does not load it, so they fall to the device's default cursive (Comic Sans on most Windows machines).
2. Genabackis: the title box covers the start of "The Rhivi Plain", and "Moon's Spawn, until it moved" is printed over the same label. Pale: the title box hides "Varrow's tunnel ·".
3. Chapter openings stack the painted plate on the older drawn backdrop of the same scene; on a PC the old drawing fills the screen and the plate is a thumbnail.
4. Chapter ends are painted for chapters 2, 3 and 5 and old drawings for the prologue, 1, 4, 6 and 7.
5. Painted Deck faces exist for Hounds, Raven, Magi, Herald, Chains, Crown and the blank card. Oponn, Obelisk, Knight and Assassin (the prologue's cards, in every pool to Ch6) have none, so a reading mixes the two sets.
6. Vistas and road pictures are cropped hard: the barrow vista loses the squad, the lake vista loses the city, the finale road picture is squeezed on PC.
7. Pack munition pictures are 30×24 with 24px tap rows. Black-on-black items (Guild token, Moranth chit, barrow torc) nearly vanish at icon size. Item pictures come in two shapes and three tints.
8. Phone squad sheet, kit list: the text column is about 120px, so names and stats break mid-phrase.
9. Title: on a phone the key art's squad and Pale sit behind the form; lamp glows sit behind the difficulty text.
10. Darujhistan map: three labels cross the wall line. Old route map: its dashed line runs through two labels.
11. Map viewer on PC fits width only, so the key and compass sit below the fold.
12. The quorls in the Outlaws and Stood Down pictures read as four-point stars; the painted Hounds read as crows.
13. Classic Hounds card (`20_deck…js:52`) draws two hounds; the text says "Seven shapes".

Leftovers from the removed Artwork page: `tools/art_build.py:27-47, 111-113` still builds whole boards and discards them; 21 pictures (about 20 KB) are generated and never shown (`squad/*`, `motifs/*`, three insignia, two papers); `munitions/acid` and the no-save branch of `artReach()` (`19d:20, :47, :54`) are unreachable; comments at `90_resume_boot.js:57, :65` still mention the board viewer.

Clean: all 27 gear items have a picture and every picture has an item; chapter titles, patrons, sigils, munition texts and face quotes match the game; the Classic switch falls back everywhere.

---

## 4. Screens and upkeep

**Likely real bugs**
- **What's new shows only the newest three notes** (`35_pack_journal_save.js:199`). Anyone updating from 3.14 or earlier never sees the painted-set note or the visions note, and is told "the Art tab is gone" about a tab they never saw. The 3.15.0 note (:120) still advertises the Art tab.
- **Reduced motion leaves the vision title card up.** `.reduce *{animation:none!important}` (`01_style.css:199`) kills the fade that hides `.vtitle` (:447-452), so the dark card should sit over the picture for the whole vision. Read in the CSS, not seen on screen: reproduce first.
- `openNotes` (35:200) and `openPicks` (37:216) reuse the modal without resetting its scroll, so level-up picks can open part-way down.
- Vision steps without a label get a continue button reading only "—" (36b:481).

**Reference text that lags the game**
- The journal's notes stop growing after Chapter 1 (no chapter defines the `journal` hook, 35:13), and two of its three later lines show from the prologue, before the player knows those threads.
- The glossary (35:77-106) stops at the 3.7-era terms: no Shadowthrone, Cotillion, Soliel, Fener, Meanas, Denul, Mockra, Kurald Galain, Dragnipur or the Finnest.
- Settings › Artwork › Classic says "the game's original drawings" but also removes item pictures, the item viewer and the journal's Maps, Papers and Faces (34:13).
- Soldier difficulty says "a god answers once a chapter"; each god does (15_state:34).
- Deeds has no rows for tricks, the gods' answers or visions, though all are counted (38:4-10).
- The squad sheet shows Obelisk's health but not Hounds, Raven, Sapper's Eye or Marine Discipline, so it can disagree with the battle bar (33:9). 33:20 carries a second hand-copied table of ability text that will drift.
- Wording drift: "Once per fight" / "Once a fight"; "Reach" / "range"; trick names differ between sheet and battle bar; chapter numbers appear as words, digits and Roman numerals.
- Keyboard help omits the target cursor; What's new cannot be opened from Settings.

**Phone and access**
- Tap targets under 44px: Settings toggles and the difficulty picker (34px), `.btn.sm` (30px, including Salve and the vision buttons), the version link.
- `--dim` text is about 3:1 contrast at 0.7rem (the roll breakdown, the version link). Nine rules sit at about 10–11px.
- Overlays have no dialog role, focus trap or focus return.
- A phone held sideways gets the portrait layout in about 390px of height.

**Prose mechanics**
- Apostrophes stay straight in all prose beside curly double quotes (`16_skill_checks.js:101` only curls doubles).
- Interrupted speech uses a closed dash in Ch1–4 and Ch6 and a spaced one in Ch5 and Ch7.
- "afterward" twice against 23 "afterwards"; "backward" once against 9; one "..." at 36b:461.

**Publishing**
- `sw.js:31-36` re-downloads the 2.5 MB page on every launch and precaches it twice; a dismissed "Update ready" still lands on the next launch.
- The manifest locks an installed copy to portrait and has no `id`. The three store screenshots predate the painted set. No social-share tags.

**Dead code**
- `herald`, `crown` and `chains` are defined in `14_data.js:103-108` and again in their chapters, which win. Six dead `QUESTS` entries (37:198-212). Unused: `SKN`, `showEnd`, `loadSave`, `.hpbar`, the `S.scene === 'end'` branch, the hot-reload hooks at `90_resume_boot.js:53-54`. `32_ending.js` is one helper.

---

## 5. Docs and tools

- **The canon chronology is missing.** The story bible cites `bible/canon-chronology.md` for every beat ID; it is not in the repo, the Ashes folder or the project.
- The story bible is headed v3.13.7. It lacks the visions (`v*_` flags, `seenVisions`), the art module and the item viewer; §8 still lists #43 as open and wrongly lists #49, #51 and #55 as slips.
- README: line 15 still describes the gallery; line 17 names three of the twelve tools; the version list runs oldest-first to 3.7.0 and then newest-first; there is no feature list; line 19 undersells `docs/`.
- The chapter and engine briefs are past work orders with nothing marking them historical. `outline.md` still says difficulty "stays at the current pitch". Four briefs name the owner by first name in a public repo (his call).
- `tools/page.mjs` needs a fonts folder that exists on one machine only, so fit measurements can shift. tactics_test and tricks_test write screenshots to a folder that may not exist. stakes, tactics and tricks never set an exit code. There is no run-all script.
- Nothing tests the visions (lint never reads their text; the bot never plays one), old-save loading, save codes, the Classic switch or reduced motion.
- Save migration was read and looks sound for every field added since 3.11.

---

## 6. Owner's calls, with the default taken unless he says otherwise

1. **The east road's name.** The game calls it "the Gadrobi road" (about 30 times, and on the map). The official map calls it Jatem's Worry; the novel's prose is reported to say Jammit's Worry (not confirmed against the text). The official "Gadrobi Road" is a different road outside the west wall. Default: use the canon name on the map and in narration, in the novel's spelling once checked.
2. **"the Pale".** The novel says "Pale"; the prose says "the Pale" about a hundred times and the title depends on it. Default: leave the prose and the title, and make the old route map's labels say "Pale" like the painted ones.
3. **Finish the painted set.** Five chapter-end vistas (prologue, 1, 4, 6, 7) and four card faces (Oponn, Obelisk, Knight, Assassin) are new pictures. Default: paint them.
4. **Tuft remembering what she saw.** Default: one conditional line where a vision would otherwise make a later line false; no new scenes.
5. **Where the Gadrobi District is.** Chapter 3 has the Worry Gate street drop straight into the Gadrobi District (42:216, :289 "the east crossing", :325), and 46:1362 has the quay run "east to the Gadrobi District". On the official map, and on the game's own city map, the Worry Gate is on the east wall and the Gadrobi District is on the far west side by the Two-Ox Gate. The district is the setting of Chapters 3, 4 and 6 (31 mentions) and should stay. Default: keep it, and change only the few lines that put it beside the Worry Gate, so the wagon crosses the city to reach it.
