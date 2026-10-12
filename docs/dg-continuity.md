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

## Chapter 3 — The Ridge (v4.2.0, `src/50_b2_ch3.js`)

**Key `S.f.b2_c3_key`** (`S.chapters[3]`):
- `bait`: the squad herded its own stretch out onto the open Shallows, as the Weasel captain ordered. The column drops by 6, or by 8 if the people broke and ran (`b2_baitHeld` is 0, 1, or 2 for a clean hold). The trap closed clean. The captain touched Sathi's shoulder with his lance-butt (`b2_weaselHonour`), and that night she sat at the clan's fire. Sathi and Ramin approved; Haddat and Marrow disapproved. The fight is `b2_bait`, with two Weasel allies.
- `pull`: the squad pulled its people back under the wagons. The column drops by 2. The trap closed late and the fight was harder (`b2_pull`, no allies). The whole clan rode past Sathi without looking at her (`b2_sathiShamed`), and she did not laugh for the rest of the day. Haddat and Marrow approved; Sathi disapproved. Pay this off in Ch6, where Sathi wants to stay with the Wickans and her standing with the clan matters.

**Other flags:**
- `b2_lull`, `b2_lullYes`, `b2_lull3`: Captain Lull "volunteered" the squad as escort for Sergeant Wicket's sappers on the raid. `b2_lullHurt`: he came down the ramp at dusk with the eye and nose gone ("still prettier than the historian").
- `b2_raidDone`: the squad went through the warlocks' north cut, made the diversion at the Tithansi horse lines (`b2_raidBurner` if Tangle's burner opened it), and held the cut against the **god-ridden** Semk (`b2_godrider`) while Wicket dropped the roof. It got back up, and it looked at the sergeant, "interested". At Gelor it was taken by the earth spirits.
- `b2_clawStar`: `given` (to Lull, who put it away "like a letter he did not want") or `kept` (gear `b2_clawstar`, and Tangle disapproved). Sathi pulled it from a dead Tithansi. Nobody in the squad threw it.
- `b2_seep` (`b2_seepTook` gave +1 water; `b2_seepMarked` means Wicket chalked it): Marrow tasted the tunnel water first ("old rain"). Duiker reported it. The pits gave +4 water (`b2_tunnelWater`).
- `b2_earth` trick: **The Earth's Hand** (✦ wits 16 at a spirit-light in the tunnel; Sathi has the edge). Once a fight, an enemy within 4 and every enemy next to it are slowed and take −(2 + level step) to hit until the bearer's next turn. It is spirit-craft (`spirit:true`), so it never sputters.
- `b2_duikerTold3`: the sergeant told Duiker the column's story, names and all (Haddat +1). Otherwise Duiker says "you owe me a column".
- `b2_tangleAway`: Tangle went with Mincer's company into the ramp's banks the night before Gelor. He sat out `b2_bait`/`b2_pull` and `b2_ring` (engine: `def.away`, in 47). `b2_rampSatchel`: `took` (a sharper and a cusser spent on the ramp, gone for good, Tangle +1) or `left`. `b2_tangleBack` gives gear `b2_sappershield` (a shield-boss dented by a hoof). `b2_sulmar`: Captain Sulmar asked where he had gone, and Chenned nearly winked.
- `b2_sathiFile`: `now` (she filed her teeth under the dead tree on the eve), `wait` (she does it with the clan after `bait`; after `pull` she does not), or `no` (the sergeant said she didn't need them: Sathi −1, "she heard the other thing"). `b2_sathiTeeth` = her teeth are filed.
- `b2_ilharRidge`: a dying city boy among the Tithansi (weavers' street) said the water-sellers' man was **not** with the lancers. He went up to Reloe's tent on the ridge the night before, and told the lancers to "look for a blue shield and leave it alone". Haddat said Ilhar's name aloud for the first time since Hissar (the text never gives it). So Ilhar is alive and goes over to Dom with the rest of Reloe's command: Ch4 can have Haddat see him (`b2_ilharSeen`).
- `b2_skinFound` (only if Ch2's `b2_prisonerFate` was `free`): the squad's stamped skin was on a dead Tithansi horse at the Shallows. The boy was not among the dead.
- `b2_gelor`, `b2_ringDone` (`b2_ring`: holding the wounded wagons on the lake bed against the Ubari, with the Hissar Guard; then the charge, with two Foolish Dog allies), `b2_shDone`, `b2_dom` (Bult named Korbolo Dom: "Reloe was a mage who thought he was a general. Dom is a general."), `b2_mare` (Nil and Nether groomed the grey mare on the eve), `b2_fdog`, `b2_weaselcap3`, `b2_pathaWater`, `b2_eastGave` (the squad's skin went to the stretch on the raid night).
- Glossary rows (pushed onto `GLOSSX.dg` in 50): Captain Lull, Gelor Ridge, Korbolo Dom.

**Engine (47):** `def.away = ['tangle']` (or `stage2.away`) leaves those squadmates off the map for that fight only. They stay in `S.squad`, and the retry snapshot keeps them. Use it for anyone who is elsewhere for a fight.

**Inventions:** Sergeant **Wicket** (a squat grey sapper with no eyebrows, from Tangle's old section in Mincer's company); the north cut and its spirit-lights; the god-ridden Semk's interest in the sergeant; the Weasel captain's "lamb in a wolf-pit"; the weavers'-street boy; the grey mare's long patient face.

**Open on purpose:** the Claw in the Tithansi camp (never explained); the second young warlock (unnamed, died offstage); whether Sathi's standing with the clan can be mended after `pull`; Imra and Dessi under the carts key (still open).

**Fights (base xp):** `b2_raid` 100 (+40, survive 3 against the immortal god-ridden), `b2_bait` or `b2_pull` 150 (+70), `b2_ring` 110 (+50). The squad ends Ch3 at about level 5 (the bot reaches 5–6). Balance (smart squad, level 4–5, Tangle away where he is): Soldier raid 100%, bait 100%, pull 96%, ring 95%; Bridgeburner 75 / 75 / 38 / 75%.

## Chapter 4 — The Day of Pure Blood (v4.3.0, `src/51_b2_ch4.js`)

**Key `S.f.b2_c4_key`** (`S.chapters[4]`), chosen at the *Silanda*'s plank after the ropes fight, before the parley:
- `silanda`: a hurt squadmate went down the Vathar to Aren on the *Silanda* with the Seventh's wounded. **`b2_silandaWho`** = their id (never `sgt`, never `redblade`: "the company carries its own"). They are out of `S.squad` (by `letGo`) from here until Chapter 7; their kit is kept in `b2_silandaGear`. **Chapter 7: call `b2Ashore()` (47) in Aren** to bring them back with their kit (sets `b2_silandaBack`). They miss any level-up picks taken while away. Default choice is the worst hurt (`b2_hurtMost`, set by the ropes fight); `b2_silandaOther` = the player sent someone else. If Sathi went, Hackle went with her (no dog until she is back). If Tangle went, the satchel stayed with the squad; if Marrow went, there is no healer. Parting lines: Haddat asks the sergeant to say the column's names at night; Sathi says "tell the clan I did not ride away, I was carried"; Tangle counts the satchel; Marrow "bring me some knots".
- `keep`: nobody went; **`b2_woundWho`** = the hurt one, who carries the Vathar wound: −6 max health (`B2_WOUND`) in every fight, logged at the start of each, **until `S.f.b2_woundHealed`** — Chapter 7 should set it when the squad reaches a clean healer in Aren (lint lists it as read-but-unwritten until then). `b2_woundWho` can be unset under `keep` if nobody was eligible.

**Other flags:**
- `b2_ropesDone`, `b2_ropesSharper`: the squad cut Dom's ropes upriver (Gesler's marines saw them first). `b2_lull4`.
- `b2_gesler`, `b2_stormy`, `b2_truth`, `b2_silandaGone`: met the three marines; saw Coltaine punch Gesler (his hand bound at the parley). `b2_inside` trick (**Stormy's Way In**, ✦ might 16 with Stormy; Haddat and Ramin have the edge): once a fight, close on an enemy within 3 and strike at +(2+lvT); a long weapon's shaft breaks (no reach for the rest of the fight). Not sorcery: never sputters.
- `b2_envoys`, `b2_council`, `b2_domSeen`: Dom's envoys offered passage and Coltaine said no; Nethpara and Pullyk wanted it. Dom watched from the far bank, silent (half-Napan, blue cast to his skin, badges cut off).
- The deal: `b2_dealHint` (the steward or Nethpara let it slip), `b2_dealKnown` (the Council's Hissari servants told Haddat or the sergeant; always set after the boat), `b2_steward4`, `b2_envoyDone` (fight `b2_envoy` at the steward's boat; the steward ran, unharmed). `b2_conduct`: `given` (all of Dom's safe-conducts to Lull) or `kept` (gear `b2_conduct`, a trinket, +1 guile). `b2_tooLate`: by the time Lull had read it the carriages were moving and the column was following them into the river in the dark. The Fist still hears it from his own messenger at dawn (canon).
- `b2_nethpara`, `b2_pullyk`: the squad faced both and touched neither. Pullyk: "Soldiers are paid to die." If `b2_stewardWon` (Ch2), the steward showed the sergeant their own name in his ledger, and Pullyk knows it.
- **`b2_heldBack`**: 2 = the squad held its whole stretch on the bank until the bridges were broken; 1 = most held, some went; 0 = the squad went into the ford with them, hand on shoulder.
- `b2_robe`: `mincer` (Tangle went into the crowd in a refugee's shawl with Mincer's sappers and sat out `b2_bridge`; he will not say what happened in the water), `squad` (he wore the shawl with the squad), `none` (no Tangle). Mincer only asks for him when nobody went aboard the *Silanda*. `b2_bridgeCusser`: Tangle spent a cusser on a bridge's moorings (gone for good).
- **`b2_vatharLost`** = how many of the stretch the ford kept: about 40% of the column, less for `heldBack` (−12% a step), the cusser (−6%), Tangle with Mincer (−4%), a quick bridge fight (−5%), more for a slow one; at least 1 if the column was not empty. `b2_fordDone`, `b2_vathar`. Gear `b2_pikehead` (+1 to hit).
- `b2_sormoDead`: Sormo died on the far bank, in the water, trying to stop it; the yellow butterflies. (Ch1's `b2_sormo` still means "Sormo told Marrow the warrens are sick"; Marrow remembers it here.)
- **`b2_ilharSeen`** (only if Haddat was there): Ilhar at the rail of a drifting bridge among Dom's officers, in a city coat with the green cloth, "looking at the ford the way you look at a fire you set"; nobody on that bridge shot near the blue shield, and whether anyone was told to is left open. `b2_ilharSign`: `silent` or `named` (the sergeant said "Haddat", and she said his name aloud, the second time; the text still never gives it). Haddat's quest line now reads "across the water at the Vathar".
- `b2_marrowEnd`: `on` (she healed until the warren had a floor, +2 column, 3 knots and 1 sputter; **`b2_warrenFloor`**: "something sitting in it, down at the bottom, big and patient, and it moved when I touched it": the Path of Hands, unnamed) or `stopped` (four in the row die).
- `b2_bungle`, `b2_bungleMet`: Mincer broken to the ranks the evening after (no reason given; he offered to dig latrines); **Captain Bungle** has the company and Mincer's slate. `b2_mincer4`.
- `b2_sathiLaugh`: Sathi laughed at the Foolish Dog's funeral song and the Weasels laughed with her; if `b2_sathiShamed`, one of them looked at her for the first time since the Shallows. Not mended, but begun: Ch6 can build on it.
- `b2_orphans`: `took` (six children from the ford into the stretch, −2 water, +5 column), `sent` (a skin and the Wickan wagons), `left` (Haddat would not look at the sergeant).
- `b2_duiker5`, `b2_duiker6` (Duiker, hoarse, with finger-marks on his throat: "I would have killed him. I want that in the history too"), `b2_raminCount`, `b2_ramin4` (Ramin: the rich men watched from the hill in Ehrlitan; at the Vathar they went first on Dom's paper and lived), `b2_bultFord`, `b2_vatharWater`, `b2_bankRest`, `b2_farRest`.
- Glossary rows (pushed onto `GLOSSX.dg` in 51): the Silanda, the Nobles' Council, the Vathar.

**Engine (47):** `b2Mate(id)`, `b2Aboard(id)`, `b2Ashore()`, `B2_WOUND`, `b2Wounded(id)` (a `mkParty` wrapper takes the wound off max health); a `win` wrapper records `S.f.b2_lastRounds` after every Book Two fight and, for a fight with `def.hurtMost`, `S.f.b2_hurtMost`. Battle defs may use getters for `away`, `allies` and a stage's `waves` (Ch4's bridge does: more sappers for a short squad, the far-end pikeman only for a whole one).

**Inventions:** the rope-captain and the bridge-sergeant; the Council's Hissari servants (the grey woman: "servants believe what they are told until they are drowned"); Dom's safe-conducts; Truth's account of the headless rowers (implied; never shown); Stormy's pike drill.

**Open on purpose:** why Mincer was broken; who pulled Duiker off Nethpara; whether Ilhar spared the blue shield; what sits at the bottom of Marrow's warren; whether the ones on the *Silanda* reach Aren whole (Ch7 decides how they come back).

**Fights (base xp):** `b2_ropes` 90 (+30, hold the stakes 3 rounds; `hurtMost`), `b2_envoy` 70, `b2_bridge` 160 (+80, the bridge; Tangle away if `b2_robe` = `mincer`). No mortal fights. The squad ends Ch4 at about level 6 (the bot reaches 6–7). Balance (smart squad, level 5 for the ropes, 6 after): Soldier ropes 100%, envoy 100%, bridge 100% (whole squad), 100% at level 6 and 95% at level 5 with Marrow on the *Silanda*; Bridgeburner ropes 93%, envoy 100%, bridge 93% at level 6 and 29% at level 5.

## Chapter 5 — The Dry March (v4.4.0, `src/52_b2_ch5.js`)

**Key `S.f.b2_c5_key`** (`S.chapters[5]`), chosen at Bult's water ration on the Nenoth, after the herd and before the Tregyn:
- `squad`: the squad kept its skins. The stretch lost about a fifth (`b2_marchLost`, at least 2) in the night. The squad drank before the Tregyn raid (`b2_drank` = `'b2_dryraid'`), except Ramin, who gave his share to a child (`b2_drankSkip` = `'redblade'`, Ramin +1) and fought in scale with nothing in him. Tangle and Sathi approved ("the riders drink first"); Haddat and Marrow disapproved, and Haddat sat at the stretch's fire that night, not the squad's. In the camp the stretch took the Trygalle's water from the sergeant's hands "without looking at you".
- `column`: the squad's skins went to the stretch (water to 0; the stretch lost about 5%, at least 1, `b2_marchLost`). **`b2_dry`** = 1: the squad cannot drink and starts the Tregyn fight parched (−3 health, 47) until the Trygalle's water clears it (`b2_dry` = 0). Haddat, Marrow and Ramin approved; Tangle and Sathi disapproved ("a herd with no riders is a meal"). In the camp the stretch made the sergeant drink first. Bult: "The Fist heard. He said one word."
- Later chapters: the stretch's trust in the sergeant (warm after `column`, quiet after `squad`); Haddat's distance after `squad`. The Trygalle rescued both, after the choice.

**Heat (47, Book Two only):** a fight with `def.heat` is fought at midday. From round 4 (round 2 on a fight's second ground) a squadmate in heavy armour (`B2_HEAVY`: Haddat, Ramin, or any gear item marked `heavy`) loses a step every turn unless they drank (`b2Drink(fightId)` spends a skin and sets `S.f.b2_drank` = fightId; `b2Drink(id, true)` is free; `S.f.b2_drankSkip` = one squadmate who did not). `S.f.b2_dry` makes a heat fight start parched and blocks drinking. A unit marked `cooled` ignores the heat. Ch6 can reuse it for any midday fight (Sanimon, the running retreat): give the fight `heat:true` and offer a drink before it.

**Other flags:**
- `b2_forest`, `b2_list5` (met **Corporal List**, Fifth Company, out of the Hissar garrison: the sergeant remembers him from the yard, "died first in every mock fight"; javelin through the foot at Gelor), `b2_listTower` (he told the squad about the tower and his Jaghut), `b2_list6` (on the Nenoth: "they killed the ground so nobody like them could live on it"), `b2_list7` (the Jaghut said goodbye at the last tree, "we'd meet again, later, and I'd understand him better then": a plant for the Barrow), `b2_duiker7`, `b2_duiker8` (Duiker names the **Khundryl** as a rumour: "nobody has seen them yet").
- `b2_moundsDone` (`b2_mounds`: Bhilard among the forest mounds; a carter and his grown son saved, +2 column, the carter's wife dead), `b2_weasel5` (a Weasel rider: "the Weasels will owe us one cow").
- The tower (optional): `b2_towerIn`, `b2_towerIce` (in the ice, a boulder, and something small under its edge: seen, never described), `b2_shade` (a tall half-seen shape at the foot of the stair that never looks at the squad; never named), `b2_towerTop` (from the roof: the mounds, the Nenoth, Dom's dust), `b2_towerOut` (the sun had moved further than it should). Sathi will not go in; she waits outside with Hackle.
- **`b2_towerWarren`**: inside the tower Marrow's warren was clean, "nothing at the bottom": whatever is walking in the warrens does not like the cold (+1 knot). If the Vathar wound was kept (`b2_woundWho`), she cleaned the bottom of it but could not close it (the wound stays until Aren; `b2_woundHealed` is still Chapter 7's).
- `b2_breath` trick: **the Tower's Breath** (✦ wits 16 at the cold brazier; `b2_breathTry`; Marrow has the edge). Once a fight: a 3×3 within 4; enemies in it are slowed and take 1d6+1+lvT cold; squadmates in it shed the heat for the fight. Elder (`elder:true`): it never sputters.
- `b2_bungle5`: `gave` (Tangle gave Bungle's empty company a sharper, gone for good; Mincer nodded to him "the way a captain nods") / `kept` / `met`. Mincer is digging latrines in Bungle's company, cheerful; the reason he was broken is still open.
- `b2_nenoth`, `b2_herdDone` (`b2_herd`, heat: the Bhilard on the last herd, then holding a gap in the rocks 3 rounds), `b2_cattleDead` (the last cow of the herd from Hissar lay down four days later; "the dogs have nothing to herd now").
- **`b2_sathiRode`**: Sathi rode with the Weasel Clan on a spare grey and turned the herd (off the map for `b2_herd`, with Hackle; two Weasel riders stand in). If she was shamed at the Shallows, she asked the captain herself, and he looked at her for the first time since. She sat at the Weasels' fire that night. Unset if the sergeant kept her (Sathi −1). Weigh it in Ch6, where she wants to stay with the Wickans.
- `b2_bylan`: `took` (a Bylan family of five, +5 column, −1 water) / `sent` (to the Wickan wagons). Canon: Bylan refugees joined on the Dry March.
- `b2_jar` (daughters road only): `poured` (Imra poured Ressan's kept-back water into the squad's skin, +1 water; "He'd have sold it. And then given the money away") / `kept` (for Dessi "the day it's worse"; Dessi tops it up from the Trygalle's water).
- **`b2_jarboy`** (carts road only): `took` (+1 column) / `cart`. **Ibbin**, ten, Ressan's jar-boy, found the squad in the camp: he reached the well court, and Imra put Dessi up in front of a Crow rider and got up behind another; Ressan stayed on his well. **`b2_girlsRode`** = 1: Imra and Dessi got out of Hissar on Wickan saddles. Whether they lived through the Vathar is still open: Ch7 can find them in Aren, or not.
- `b2_dryDone` (`b2_dryraid`, heat: the Tregyn at the stretch's carts, then their water-carrier; +2 water from his skins). **`b2_ilharWater`** (only with Haddat): one of the water-carrier's skins carries **her mother's house mark** (a jar, a wave, a letter in the old Hissari hand): Ilhar is filling the family's skins for Dom's tribes. `b2_ilharSkin`: `drunk` (the stretch drank it, +1 water) or `kept` (gear `b2_sealskin`, a trinket for Haddat, full and stoppered: "If I see him, I will give him back his water, and tell him the column did not need it"). A gift for Ch6's last word with Ilhar at Sanimon.
- `b2_trygalle`, `b2_karpolan` (Karpolan said "Darujhistan" and hinted at "a gentleman with one arm who is, officially, at war with your Empress"), **`b2_bottle`** (the squad saw him hang the smoky glass bottle round Coltaine's neck: "Wear it. Always."; the Fist throwing it to Duiker is Sanimon's), `b2_campWater` (+6 water, clears `b2_dry`), `b2_shareholder`, `b2_shareholder2` (eleven horses from Darujhistan, nine arrived), `b2_ours7`, `b2_ours8`, `b2_ours9`, `b2_ramin7` (Ramin, for once, glad the company is elsewhere), `b2_weaselAsk`, `b2_ration`, `b2_c5Start`, rests `b2_forestRest`, `b2_nenothRest`, `b2_campRest`.
- Glossary rows (pushed onto `GLOSSX.dg` in 52): Corporal List, Jaghut, the Nenoth Odhan, the Trygalle Trade Guild.

**Helpers (52, global):** `b2Away()` (the Silanda one, if away), `b2Hurt()` (the wounded one, if here), `b2Hands5(away)` (squadmates on the map), `b2KeySquad()`, `b2KeyColumn()`, `B2_BOY` = 'Ibbin'.

**Short squads:** every Ch5 fight gets help when three or fewer squadmates are on the map (the Silanda, Sathi with the Weasels): the Weasel rider at the mounds, a second (and third) Weasel in the herd, three Seventh regulars (`b2_reg5`) at the carts.

**Inventions:** the carter and his son; the Weasel captain's bony grey; the Bhilard chief and the Tregyn water-carrier; Haddat's mother's house mark; Ibbin; the shareholder with frost in his beard; the tower's ice and the shape at the stair.

**Open on purpose:** what the bottle is for; whether the ghost List dreams of is the shape in the tower; where Dom's water comes from; Imra and Dessi after the Vathar (carts road); why Mincer was broken.

**Fights (base xp):** `b2_mounds` 100, `b2_herd` 120 (+50, heat, hold the gap 3 rounds), `b2_dryraid` 150 (+80, heat). No mortal fights. The squad ends Ch5 at about level 7 (the bot reaches 7). Balance (smart squad, level 6, 16 runs each): Soldier mounds 100% (94% one short), herd 94–100% (100% short or with Sathi riding), carts 100% undrunk, drank or dry, and 100% short with the regulars; Bridgeburner mounds 75%, herd 88–94%, carts 56–69% (38% dry).
