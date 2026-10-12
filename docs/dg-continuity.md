# Book Two: Deadhouse Gates — continuity

What each chapter set up, for the chapters after it. Every writer appends their chapter's section when done. Shared helpers in `src/48_b2_ch1.js` are global: `B2` (names), `b2Chain()`, `b2In(id)` (squadmate present), `numw()`.

## Chapter 1 — Hissar Burns (v4.0.0, `src/48_b2_ch1.js`)

**Key `S.f.b2_key`** (`S.chapters[1]`):
- `daughters`: the sergeant went back for Ressan's daughters, **Imra** (19) and **Dessi** (9); −3 water; they walk in the squad's stretch of the column (+2); `b2_ressanOut`, `b2_girlsOut` set. Ressan stayed with his wells (alive in Hissar when last seen). Haddat and Sathi approved; Tangle disapproved.
- `carts`: the squad brought the garrison's water carts out (+4 water); a boy ran back to the quarter with the sergeant's word to send the girls to the Wickans. Bult says many citizens came out on Wickan saddles; **whether Imra and Dessi did is open**. Marrow and Tangle approved; Haddat disapproved.

**Other flags:**
- `b2_dipper`: Ressan gave the sergeant his brass water-seller's dipper (gear `b2_dipper`, a trinket).
- `b2_ilharDoor`: `left` / `taken` — the green cloth on Haddat's family door (Ilhar's). `taken` = cut off and kept in her shield grip; `b2_doorHers` if she cut it herself.
- `b2_listSeen`: in the well court, a rebel list of names: Haddat's family crossed off, in another hand (someone protected them; Ilhar?).
- `b2_yedda`: Yedda, a ropemaker's widow, joined the column with her grandsons and a handcart (+3).
- `b2_cistern`: `talked` / `blown` / `fought` (water from the quarter cistern; a garrison deserter gang if fought).
- `b2_sathiCrows`: Sathi saw crows settle over Coltaine's tent and is sure it means something.
- `b2_sormo`: Sormo E'nath told Marrow the warrens are sick.
- `b2_mother`: `gave` / `refused` — at the basin, a mother begging water (+4 column if given).
- `b2_relSeen`: Mallick Rel (priest of Mael) escorted out of Hissar by Wickans; he blessed the squad and Hackle went still. Unharmed.
- `b2_duiker`, `b2_duikerTold`, `b2_bult`, `b2_coltaine` (Coltaine said one word: "Good."), `b2_reloe` (Duiker named Reloe at the basin).
- Bult gave the squad a stretch of the column: "You own these" (+12).

**Inventions:** Duiker came to Hissar to write the history of a quiet province; Sormo's apprentices shown but not named; Reloe offstage at Bat'rol; the Weasel outrider and the wash at Bat'rol.

**Fights (base xp):** `b2_street` 100 (+40 stage 2), `b2_cistern` 60, `b2_gate` 110 (+50), `b2_batrol` 150 (+80). Squad ends about level 3.

## Chapter 2 — The Odhan (v4.1.0, `src/49_b2_ch2.js`)

**Key `S.f.b2_c2_key`** (`S.chapters[2]`):
- `spring`: the squad held Dryj Spring while the Wickans rode (fight `b2_spring`). Column +5 in all (3 strays, 2 families), no extra water. Marrow and Haddat approved, Sathi disapproved (her clan rode without her; she half-forgives it after). Flag `b2_springHeld`.
- `water`: the squad rode with a Weasel party to a Tithansi caravan well (fight `b2_tithwell`) and saw Coltaine's seven-to-one from a ridge (`b2_sawValley`). Water +5; the spring was raided while they were away, column −4 (`b2_springHit`). Sathi and Tangle approved, Marrow disapproved. The Weasel captain told Sathi she "rides like a Weasel still" (pay off in Ch3, when the Weasels use refugees as bait).

**Other flags:**
- `b2_ilharHeard`: a green-cloth prisoner (a Hissar tanners'-street boy riding with the Tithansi) said a man of the water-sellers' quarter talks to the Tithansi chiefs for Reloe and jokes about a sister who "took the Empire's silver". Haddat did not ask his name. Always set.
- `b2_prisonerFate`: `free` (walked off with a skin, and will tell Ilhar the Malazans gave water) / `column` (walks in the squad's stretch, the green cloth in his pocket) / `wickans`.
- `b2_stewardWon`: the squad faced down Lord Nethpara's steward at the deep water (Nethpara named offstage; the steward wrote the sergeant's name down: a seed for the Vathar).
- `b2_ox`: `watered` / `bled` (Sathi bled the ox the plains way; `b2_oxBled`) / `left` (the cart and two old people left behind, column −2).
- `b2_fever`: `held` / `lost` (Marrow and a fevered girl; a knot or a sputter).
- `b2_roadGave`: the squad gave its night's skin to the stretch.
- `b2_cusser`: Tangle gave one cusser to make Mincer's 55 (gone for good); `b2_cusserKept` if refused. Tangle never blows the ford: Cuttle does.
- `b2_drop` trick (**Mincer's Drop**, ✦ wits 16 at Mincer): once a fight, the bearer and squadmates within 2 go flat: −(3+level) to be hit from more than a step away.
- `b2_fordLight`: `dumped` (barrels into the river, −3 water, everyone across) / `kept` (column −4).
- `b2_duikerBack`: Duiker came back across the lines at the Sekala in rebel robes (`b2_duikerWater` if the squad gave him a skin).
- `b2_raminDone`: 1 = **Ramin** joined (`recruit('redblade')`), 0 = refused. `b2_spirits` (saw the spirits take the Semk god from afar), `b2_ubaryd` (Ubaryd has fallen: Aren), `b2_blown`, `b2_westDone`, `b2_nil`, `b2_mincer`.
- Marrow's string: `b2_knots` (clean healings, in battle and out) and `b2_sputters` (spoiled ones). `b2Knots()` in 49 turns them into a sentence.

**The fouled warrens (47):** any Book Two strain spell (Marrow's mend, wash, stanch, argument) sputters for half effect at 5% × chapter from Ch2 (10%) to Ch7 (35%), with a "the warren gives back mud" line; tricks marked `elder` or `spirit` never do (mark Wickan spirit-craft tricks `spirit:true`). Enemy casters too: a new foe skill `sbolt` (Semk sorcery bolt, 2d6+1, half on a sputter) and a Semk daze that sputters into a stagger. `atkCalc` honours `flatUntil`/`flatAc` (Mincer's Drop).

**Ramin (`redblade`, 47):** Red Blade of Ehrlitan, the Old Quarter, 26; his father kept the Empire's tolls on the Old Quarter gate; was in Ehrlitan "the winter the company cleared the market" (never discussed). Horse and file lost at the Sekala; lent by his commander until the company remounts, "in Aren, perhaps". Says every day he will go back to the company when it calls: plant for Ch7. Ability `b2_lance` (Lance Held Short, reach 2); level-3 picks `holdline`/`discipline`; patron the Queen of Dreams. Haddat: kin or rival, polite in two dialects. Tangle distrusts him and counts the satchel; Ramin counts it back "to help". Sathi: "a red horse with no horse".

**Inventions:** Lord Nethpara's steward and his ledger; the caravan well and its keeper; the carter and his ox; the grandmother from the potters' street; the boy from the tanners' street; the Weasel captain (unnamed).

**Open on purpose:** Ilhar's name never said; whether Imra and Dessi came out (carts key) still open, Yedda says "keep asking"; Duiker said he wants the column's story later; the Guran legions watched and never fought.

**Fights (base xp):** `b2_spring` 100 (+40) or `b2_tithwell` 100 (+40), `b2_tail` 60 (survive 3), `b2_westbank` 150 (+80, two Red Blade allies). The squad ends Ch2 at about level 4.
