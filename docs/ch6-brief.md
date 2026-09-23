# Chapter 6 — "The Fete" — content brief (v3.5)

You are writing the content module `src/45_chapter6.js` for *Ashes of the Pale*, a Malazan Book of the Fallen fan RPG following an original marine squad (the Fourth) through Gardens of the Moon. The player plays the Sergeant. Chapters 1–5 are done. This is the second-to-last chapter; Chapter 7 (Outlaws, the finale) is being written **at the same time by another writer from `docs/ch7-brief.md`** and reads the flags you set — the **flag contract** below is binding.

Read these first, in this order:

1. `docs/story-bible.md` — everything the squad has lived through, every flag, every open thread, voices, and the inconsistencies not to repeat. **Read all of it.**
2. `src/14_data.js` — TPL (the squad), FOES, CARDS, PICKS, `registerChapter`.
3. `src/44_chapter5.js` — read every node. This is the module you are matching in shape, length and voice (second person, present tense, grimdark but humane, dry humour, short declaratives, canon characters in their own voices).
4. `src/43_chapter4.js` and `src/42_chapter3.js` — the city chapters: Darujhistan's voice, Kruppe, Murillio, Coll, Crokus, Rallick, the Guild, Madryn and the grey cloak, Vell, the roof choice, Whiskeyjack's debrief style.
5. `src/37_chapters.js` — `CHEND`, `CHTEASE`, `QUESTS`, the end screen.
6. `docs/outline.md` — the campaign outline.

## Canon for this chapter (verified against the book — keep it exactly)

The night of the Gedderone Fete. Lady Simtal throws a masked party at her estate in the Estate District (the estate that was Coll's before Simtal and Councilman Turban Orr took it from him). Half the city is there.

- **The Bridgeburners hired themselves on as guards at the Fete** (Fiddler and Hedge arranged it). Kalam and Paran talk quietly about killing the Adjunct; Kalam sends word to the Assassins' Guild that a large contract is available at the party (it is on Lorn — never say so outright).
- **Lorn** (wounded some days ago; it heals badly) has come into the city. She **buries the Tyrant's Finnest — a thing like an acorn — in Lady Simtal's garden**, as bait: the Tyrant will come to it. She means to kill the boy who carries Oponn's coin (Crokus) as her last act.
- **Baruk** (the High Alchemist, of the T'orrud Cabal) arrives with a very tall guest in a **black dragon mask** — **Anomander Rake**. Turban Orr does not know who he is. **Mammot** (High Priest of D'rek, Crokus's uncle, Cabal) arrives in a **Jaghut mask** — he has been possessed by the Tyrant, Raest, and nobody knows it yet. **Kruppe** is there, eating, and lets Rake know that he knows what Rake is. **Derudan** (a witch of the Cabal) is there.
- **The duel:** Turban Orr recognises a spy (Circle Breaker, a guard) and is about to act when **Rallick Nom** crashes into him and provokes a duel. **Rake agrees to be Rallick's second.** Rallick kills Orr very quickly (Rallick is dusted with otataral; Orr's sorcery finds nothing). Rallick tells **Murillio** and **Lady Simtal** that Orr is dead and **Coll** will be reinstated. Murillio leaves Simtal a dagger, knowing she will use it on herself. (Keep Simtal's death offstage: the dagger, and later a closed door.)
- **Crokus** gets past the guard line and brings **Challice** (a nobleman's daughter) into the garden.
- **The Tyrant strikes, in the garden:** Mammot/Raest attacks the gathered mages with Omtose Phellack (ice). **Quick Ben opens seven warrens at once.** **Whiskeyjack's leg is broken.** **Paran's sword, Chance, swallows a lance of the Tyrant's sorcery**, and Paran is pulled somewhere else for a while (where Tool is fighting the Finnest inside something new). **Hedge's munitions** break Mammot's body. **The Finnest in the garden has become a young Azath** — a thing of wood that grows as you watch — and it **drags the Tyrant in with its roots and holds him.** Mammot is dead.
- **Lorn**, feeling the Tyrant fail, **releases a Demon Lord of the Galayn** (a dragon-shaped thing, a Soletaken) against Rake, and goes after Crokus. **Rake takes dragon form and fights the demon above the city, then kills it with Dragnipur** — the black sword trailing smoke-chains; everything it kills is chained to it. The Fourth see this from wherever they are, as a sky-event.
- **Lorn's end:** a man in a faded crimson cloak (**Blues**, of the Crimson Guard — one of Crokus's hidden protectors) stops her; she breaks off, wounded; then **Meese and Irilta** (the two women of the Phoenix Inn — Irilta big, Meese not — the Eel's people) kill her in an alley. **Paran finds her dying** and she dies in his arms. He takes her otataral sword. (The Twins — Oponn — appear to him; keep that as something the Fourth only half-sees: two figures in a doorway who are not there when you look again.) He carries her away.
- Off-stage, the same night: Vorcan (the Guild's master) moves against the Cabal; **Rallick carries a wounded Vorcan into the Azath**, which by dawn is **a house with a yard full of mounds**. Nobody in the Fourth sees Vorcan. Never put Vorcan on screen.
- At dawn, **Moon's Spawn** begins to drift away west.

**Rules:** the Fourth changes none of this. No canon character dies, lives, wins or loses because of the player. The Fourth witnesses, stands somewhere, pays for where it stood. Canon characters are met, not played; keep their lines few and in voice. Rake: courteous, dry, weary, enormous; he speaks rarely and never explains. Baruk: courteous, tired, precise. Kruppe: third person, ornate, secretly exact. Rallick: short. Murillio: charming, sick at heart tonight. Whiskeyjack: "Sergeant." / "Good." Quick Ben: mild, smiling at something past you, until tonight, when he stops smiling. Hedge and Fiddler as in Ch3–4. Lorn never speaks to the Fourth except in the alley, and then only orders.

## What Chapter 6 is (the Fourth's night)

The Fourth walks back into Darujhistan from the Gadrobi Hills on the morning of the Fete (Paran rode ahead; he got there a day before them). They report to Whiskeyjack in the vault under the Gadrobi crossing — **in order, without anything in it that isn't so** (the Ch3–5 formula) — about Toc, the rent, the Hounds, the barrow. Whiskeyjack has them put on the Fete's guard list alongside Fiddler and Hedge: armbands, halberds nobody expects them to use, and a party with every dangerous person in the city at it. Then the night, then the Tyrant, then the choice, then dawn.

### Threads you must pay off (see the bible §6)

- **Tuft's arc resolves tonight** (the outline: "Tuft's road runs to the Fete"). Design below — follow it.
- **Toc's message to Paran:** "tell him Toc kept riding" (Ch2) has never been delivered. Deliver it tonight if the player chooses (Paran is in the vault, or in the garden). It is now unbearably loaded; let it land.
- **Coll's signet** (`S.f.c3_coll`, item `collsignet`): Coll said somebody *will* recognise it. Tonight somebody does — at Simtal's gate or on the terrace. This can trigger the optional guard fight (below). Coll is at the Fete (canon: he returns to his house tonight); the sergeant can give him the ring back (`S.f.c6_collRing=1`; remove the item: `S.kit = S.kit.filter(k => k !== 'collsignet'); Object.keys(S.gear).forEach(w => { if (S.gear[w].trinket === 'collsignet') delete S.gear[w].trinket; });`).
- **The Guild:** Vell's debt and token (`c4_key==='shield'`, `c4_vell`, item `guildtoken`) or Ocelot's grudge (`c4_key==='aside'`, `c4_reprisalFought`). The Guild is on the terraces tonight.
- **Rake:** Crone's "my lord is *interested*"; the Andii who know the Fourth's faces (`c4_seen`); Tuft's Kurald Galain window (`c4_tuftDark`). Tonight the Fourth stands in a room with him.
- **Kalam** (`c4_kalamLook` — he knows someone in the Fourth talked to the Claw). He does not settle it tonight; Chapter 7 does. One look is allowed.
- **Crokus**, whom the Fourth met at the Phoenix Inn (Ch3), is at the Fete and later in the alley.
- **Ellis** (only if in the squad — `SQUAD().includes('ellis')`): her mother sold horses at the Fete. Give her one quiet beat in the streets. If `S.f.c5_ellisHeld` she still has not forgiven the sergeant; let that sit, don't resolve it — Chapter 7 does.
- **Kettle:** Hedge again; cussers left (`S.inv.cusser`); on the cellars path, her whole arc (keeping munitions from going off) is the point.
- **Brisk:** the line; "we don't leave people". **Ohl:** the list (count = `listCount()`), the spaces he left for Toc and Ellis, and — on the alley path — possibly a name from the Fourth.

### Tuft's resolution (design — write it in her voice)

The High Mage (Tayschrenn — **never on screen, never named by the grey cloak**) "doesn't let people leave. He let her." Tattersail wondered "what he thinks he still has of hers". Here is the answer: **the cadre badge.** Every cadre badge carries a small working of the High Mage's — it is how he keeps his mages; it is how he always knows where they are and, when he wants to, looks out through them. Tuft carried hers for sixteen months and never wore it. On the Ch2 "light" path (`S.f.c2_key==='light'`) she began wearing it, for Tattersail — and so, since the plain, something has been able to look out of her collar. (On the road path she carries it in her pack, not worn; the working is weaker but it is still hers.)

Tonight the grey cloak (the recurring, never-named Claw with clean boots and a neat hand) finds the Fourth in the garden before the Tyrant comes and says, politely, that *the High Mage would like to see the Fete*, and that Tuft is to stand where he says and keep her eyes open. That is the summons. Quick Ben can plant it earlier in the day in the vault ("Somebody's looking out of your collar, girl"). Tuft asks the sergeant to be standing next to her (Tattersail's Ch1 line: "there's a card in her deck she's never drawn for herself. When she does, be standing next to her"). **She draws a card for herself for the first time**, with the sergeant beside her — use `cardSequence(done, {card:'blank', self:true})` (see engine) — and it is **the unpainted card**: blank, nobody's yet. Then she decides what to do with the badge, and how it ends sets `S.f.c6_tuft`:

- `'glove'` — always available: the **otataral-dusted glove** (Ch5 item `otatglove`, always acquired). The sergeant (or Brisk) holds it open and Tuft drops the badge into it. The working dies like a candle under a cup. It hurts her — Meanas goes quiet in her for a while; she is nobody's; the grey cloak's leash goes slack in his hand and he knows it. (She was afraid of that glove for a chapter. Pay that off.)
- `'shadow'` — only if `S.f.c5_tuftMarked`: the thing with Shadow's thumb on it bites the thread. Tie it to the Hound in the garden (below). Out of one hand, maybe into another; Ohl hates it. She is not the High Mage's; she may be somebody's.
- `'dark'` — only if `S.f.c4_tuftDark`: the tall man in the black dragon mask, passing on the terrace, looks at her collar once, the way you'd look at a spider on a sleeve, and the badge goes cold. Kurald Galain doing a courtesy to someone whose face it knows. (Can happen on the terrace, earlier; then in the garden she tells the grey cloak there is nothing to look through.)
- `'kept'` — the working is **not** cut: only if the player refuses to stand with her, or `S.loy.tuft <= -2` and the player doesn't talk her round, or the player hands her to the grey cloak. She does what the grey cloak says tonight. She does not leave the squad. Chapter 7 settles it (the last accounting). Make this a real, dark option, not a trap: it should be reachable but clearly the worse road.

Also pay off, in the same sequence or around it: her promise to explain Kruppe's sentence (Ch3 `c3_askedTuft`) — she can say "Tomorrow. I'll tell you tomorrow. I promise I'll know by then" (Chapter 7 pays it at the Rhivi bundle); her "polite" (CHEND says she calls the dark and the threshold *polite* — give her the word in dialogue at last); the andii cloak she wears; the lamp she sleeps with.

### The Hound in the garden

One Hound of Shadow comes over the garden wall before the Tyrant does — wounded (the Hounds met Rake in the hills after the Fourth left; two died, the rest were driven off; this one came to the city following something). It can be a fight or not:
- **Fight** `garden_hound` (default): survive 3 rounds or bring it down; it goes back over the wall into nothing.
- If `S.f.c5_tuftMarked`: Tuft can walk to it. It is the one that smelled her hand at the threshold. No fight (`S.f.c6_houndKnew=1`); it lies down in the wet grass with its sides going like bellows and lets her put her hand on it; the `'shadow'` resolution is available.
- Otherwise `S.f.c6_houndFought=1`.
Paran feels it — his blood has Hound in it now (canon: Paran fought Hounds and something of them is in him). One line, no more.

### Areas (in order) — design the 16×12 maps yourself

1. **Chapter card + intro** (`CH6.intro`, three short paragraphs: the walk back in through the Gadrobi Gate on the morning of the Fete, the city hanging lanterns and masks on everything, the black mountain over the lake nobody looks at). `loc:'Darujhistan'`, `sub:'The Gedderone Fete · the morning after the hills'`. Intro `node:'c6_start'`.
2. **The vault** (talk nodes only, `scene:'cellar'`): the report to Whiskeyjack; Paran (Toc's message); Quick Ben and Tuft's collar; Fiddler and Hedge with the guard armbands; Kalam and Paran talking low about the Adjunct (the Fourth half-hears; Kalam: you didn't hear that). Tuft's draw for the squad (the chapter card, see Deck) can happen here or at dusk in the street. Then `startExplore('fete_street')`.
3. **Area `fete_street`** (decor `city_dusk`, 16×12): the street outside Simtal's estate at dusk, Fete crowds, masks, lantern strings (`l` tiles), blue gas lamps (`L`). NPCs: **Kruppe** (`'kruppe'`), **Murillio** (`'murillio'`, with masks, sick at heart), **Coll** (`'coll'`, healed, plain clothes; his signet), **Crokus** (`'crokus'`, in a hurry with a coil of rope), **Rallick** (`'rallick'`, `still:true`, in a doorway; "Go home, Malazan" again, or silence), a mask-seller or reveller (`'reveller'`), and — only if Ellis is in the squad (`show:()=>SQUAD().includes('ellis')`) — an old Gadrobi horse-seller with a string of Fete ponies (sprite `'reveller'`) for her mother's beat. Exit: the estate gate `g` → node `c6_gate` (the gate steward, the guest list, the guard list; Coll's signet may be recognised here → optional fight `house_guards` or a Guile check; then `startExplore('simtal_terrace')`).
4. **Area `simtal_terrace`** (decor `estate_terrace`, 16×12): marble terraces, balustrades, banquet tables, lanterns, the lit doors of the hall. NPCs: **Baruk** (`'baruk'`) and the tall guest in the black dragon mask (`'rakemask'`, `still:true` — Rake; the player never gets his name from him; Crone's "my lord"), **Kruppe** (`'kruppe'` again, at a table), **Lady Simtal** (`'simtal'`), **Turban Orr** (`'orr'`), **Mammot** in a Jaghut mask (`'mammot'`; Tuft or Ohl notices something wrong; Crokus's uncle), **Rallick** (`'rallick'`) → **the duel** cutscene (Rake as Rallick's second; Orr dies fast; Murillio's dagger; Simtal's door), **Derudan** optional (`'reveller'`). **Vorcan's people on the upper terrace:** the Fourth, walking guard rounds, find Guild assassins going over a balustrade toward the Cabal — fight `terrace_knives`, or, with Vell's token (`c4_key==='shield'` and `S.kit.includes('guildtoken')`), a pass ("Not tonight, Malazan. Tonight you're furniture." — set `S.f.c6_guildPassed=1`); on the aside path the Guild is glad to see them (add the veteran). Exit down the steps (`v` or `>`) → `startExplore('simtal_garden')`.
5. **Area `simtal_garden`** (decor `estate_night`, 16×12): lawns, gravel paths, hedges, a fountain, a pond, trees, lantern poles, and near the far end **the Finnest sapling (`A`)** in turned earth where Lorn buried it (the Fourth may glimpse Lorn leaving the garden early — she is a smudge on a map). NPCs: **Fiddler** and **Hedge** (`'fiddler'`, `'hedge'`, on guard), **Crokus** and Challice (`'crokus'`, and `'challice'`) running through, **Paran** (`'paran'`), **Quick Ben** (`'qb'`), **Whiskeyjack** (`'wj'`), the **grey cloak** (`'claw'`, Tuft's summons), the **Hound** (`'hound'`). Sequence: the Hound → Tuft's summons and the self-draw → the Tyrant. The Tyrant's arrival is a cutscene (`scene:'garden_storm'`): Mammot walks to the sapling and takes off the mask and it is not Mammot's face; the lawn freezes in rings; the lanterns go out one after another; Quick Ben stops smiling. Whiskeyjack: orders. **The choice.**

### The choice that matters — `S.f.c6_key`

Where the Fourth stands when Rake draws Dragnipur. The choice node id is `c6_choice`, in the garden, the moment the Tyrant shows his face.

- **`'bridgeburners'`** — "With the Bridgeburners. Line on the sergeant." Stay in the garden and hold. Battle `tyrant_garden`: **survive 4 rounds** against the Tyrant (`raest`, immortal — cannot be killed) and rime-dead (`rime`) coming up out of the frozen lawn; wave at round 2 (more rime); allies Fiddler and Hedge (`bbfiddler`, `bbhedge`). After: the canon beats in fragments — seven warrens, Whiskeyjack's leg (`S.f.c6_wjLeg=1`: the Fourth saw it break; someone of the Fourth can help carry him), Paran's sword swallowing the lance, Hedge's cusser, the young Azath's roots dragging the Tyrant down. Then the sky: the demon and the dragon (`scene:'dragon_sky'`) and the moment Rake draws Dragnipur.
- **`'cellars'`** — Quick Ben: the Tyrant's sorcery is going into the ground; forty Bridgeburner munitions and four Moranth cussers are sitting in the gas mains under the Gadrobi crossing; if the sorcery finds them, there is no city. "Somebody sit on those crates." The Fourth runs through the Fete streets (a cutscene, `scene:'fete_street'` then `'cellar'`) to the vault and finds **Claw** there laying fuse — a standing order, older than tonight, from someone who wanted the city gone if the Bridgeburners wouldn't do it. Battle `the_mines` (**win**, not survive): `clawknife` (the Ch3 Claw), `assassin` (the Ch1 Claw), `clawmage` (new). Kettle pulls fuses afterwards (her whole arc: making things *not* be things). From the vault stair they feel the sky change when Rake draws Dragnipur. **Gain the order**: a slip in a neat hand (`S.f.c6_orders=1`) — Chapter 7 uses it as leverage against the Claw. Whiskeyjack's leg breaks without them.
- **`'alley'`** — Lorn slips out of the garden gate as the mask comes off (she knew). The Fourth follows (Kalam asked the Fourth, in the vault, to watch her if they could; or the sergeant just goes). Streets, then an alley off the Daru District: Lorn has the boy with the coin (Crokus) against a wall. She orders the Fourth: *hold him*. **Sub-choice** `c6_alley_line`:
  - **Step in** (`S.f.c6_steppedIn=1`) — put the Fourth between the Adjunct and a Daru boy (the Ch4 roof again, with the Empress's own hand on the other side). Battle `lorn_alley`: **survive 3 rounds** against Lorn (`lorn`, immortal, two attacks a turn). **The battle is `mortal:true` and `nomagic:true`** — otataral: no warrens work in the alley, and **anyone of the squad who falls does not get up** (see engine). Warn the player plainly in the node before the fight: *Otataral. If anyone falls here, Ohl can't bring them back.* After: a man in a faded crimson cloak steps out of a doorway (Blues); Lorn breaks off, wounded; the boy is gone.
  - **Stand aside** — no fight. Blues steps out anyway; the Adjunct is wounded and runs. Loyalty costs (Brisk −2 "that's twice we've stood aside", Kettle −1, Tuft ±, Ohl −1, Ellis if present −1; the sergeant knows it was the safe thing; nobody says so).
  Both: later, two women from the Phoenix Inn pass the alley mouth with a cudgel and a kitchen knife and do not look at the Fourth; after a while Paran comes; then the Adjunct dying on the cobbles, Paran kneeling, her otataral sword, two figures in a doorway that aren't there when you look again. Over the roofs, the dragon and the demon, and the moment Rake draws Dragnipur. `S.f.c6_lornEnd=1`.
  **Only this path risks a squadmate.** After `lorn_alley`, read `S.f.lastFallen` (array of squad ids who died in that battle — set by the engine; the sergeant is never in it; if the sergeant fell they lived, and `S.f.sgtScar=1`). Write the deaths properly: who, how it looked, what the others do, Ohl and the list (if Ohl is the one who fell, Brisk writes his name in the ration ledger, because someone has to write it somewhere). Several squadmates can fall — handle 0, 1 or more generically with text built from the array (use `NAME(id)` and per-id lines). A dead squadmate is gone for the rest of the game (the engine removes them from `S.squad`, records `S.dead[id]`). Do not make the death cheap and do not dwell past the point of dignity.

### Close — dawn

`c6_dawn` (`scene:'fete_garden'` at dawn, or `'lakefront_dawn'`): the Fourth comes back to the garden. **There is a house there that was not there last night** — the young Azath, a house with a yard of mounds, and one of the mounds is fresh. Whiskeyjack on a bench with his leg splinted (Mallet: it's not going to be right). Paran with a sword that isn't his (if the Fourth didn't see Lorn's end, he tells it in one sentence, or doesn't). Coll walking through his own front door. Murillio sitting on the steps not going in. Moon's Spawn, low over the roofs, beginning to move west. Kruppe eating something. A talk-to-anyone close round (`c6_close_*`, like Ch5's `c5_close_brisk` etc.: Brisk, Kettle, Tuft, Ohl, Ellis if present — skip anyone dead), then `chapterEnd(6, S.f.c6_key)`; `S.f.c6_done=1`.

## Deck

One draw for the squad: Tuft, in the vault or the street at dusk (`cardSequence(()=>talk('c6_card'))`; `S.card` from `['chains','chains','knight','hounds','obelisk','oponn']`; refusing sets `S.f.c6_noCard`, tuft −1). New card: `card:{ id:'chains', name:'Chains', house:'Unaligned', hue:'#9a9aa6', txt:\`…\`, fx:'An enemy that lands a blow on a squadmate takes 2 damage back.' }` — the engine implements the effect; keep the fx text exactly. (The Chains: bound at both ends. Tonight a sword that chains everything it kills will be drawn over the city. Tuft doesn't know that; the card seems to.)

The self-draw (Tuft's resolution) is separate: `cardSequence(()=>talk('c6_tuft_card'), {card:'blank', self:true})` — the engine shows the unpainted card with captions for a self-draw and does **not** change `S.card`. The `'blank'` card is defined by the engine; do not redeclare it.

## Engine surface (implemented by the engine writer — use exactly these)

**Decors / tiles for areas**
- `city_dusk` (existing city style) — tiles `.` cobbles · `,` puddle · `#` building · `L` blue gas lamp · `D` door · `H` hole · `B` crates · `W` wagon · `x` post · `F` brazier · `r` rubble · `l` **Fete lantern pole** (new; blocks; strings of paper lanterns) · `g` **iron gate** (new; use it as a trigger tile) · `>` `<` `^` `v` exits (arrows drawn).
- `estate_terrace` and `estate_night` (new) — tiles `.` lawn (garden) / marble flagstone (terrace) · `,` raked gravel (garden) / mosaic runner (terrace) · `h` hedge · `f` fountain · `l` Fete lantern pole · `b` balustrade · `s` statue · `t` banquet table · `w` ornamental pond · `T` tree · `A` the Finnest sapling (it glows faintly; after the Tyrant it is drawn as the young Azath automatically when `S.f.c6_azath` is set — set `S.f.c6_azath=1` in the Tyrant cutscene) · `D` a lit door · `g` iron gate · `#` wall · `>` `<` `^` `v` exits. All of `h f l b s t w T A #` block movement; `D g > < ^ v` are walkable only if listed in `triggers` (as with `>` before); `.` and `,` are walkable (list them in `walk`).
- `estate_storm` (new) — the garden after the Tyrant: frost and broken lanterns; same tiles as `estate_night`.

**Scenes for a node's `scene:`** — existing: `cellar`, `city_street`, `inn`, `room`, `roof`, `roof_night`, `hills`, `plain`… New: `'fete_street'` (Fete crowds in masks, lanterns, blue lamps, the Spawn over the lake), `'fete_hall'` (the hall and terrace inside: chandeliers, masks, a very tall figure in a black dragon mask by a pillar), `'fete_garden'` (the garden at night with lanterns and the sapling; at dawn after `c6_azath` it shows the house), `'garden_storm'` (frost rings, dead lanterns, a masked figure, the Azath's roots), `'dragon_sky'` (two dragons over Darujhistan, one black; smoke-chains when Dragnipur is drawn), `'alley_night'` (a narrow wet alley, one lamp, a doorway). Put the `SCENES` text entries for these in `CH6.scenes` (see schema) — `{loc, sub, cap, amb}` where `amb` ∈ `'explore'|'tunnel'|'dark'`; the engine draws them.

**Sprite kinds for npcs** — existing: `wj`, `qb`, `kalam`, `paran`, `fiddler`, `hedge`, `mallet`, `trotts`, `kruppe`, `crokus`, `murillio`, `coll`, `rallick`, `sorry`, `lorn`, `claw`, `clawknife`, `guildknife`, `guildveteran`, `hound`, `crone`, `guard`, `urchin`, `andii`. New: `rake` (bare-faced — do not use in Ch6), `rakemask` (the black dragon mask), `baruk`, `simtal`, `orr`, `reveller` (a masked guest; varies by position), `houseguard` (Simtal's livery, halberd), `mammot` (old priest in a Jaghut mask), `raest` (Mammot possessed: the mask, frost, too tall), `rime` (rime-dead), `crimson` (Blues: faded crimson cloak), `irilta`, `meese`, `challice`.

**Battles** — 8×10 maps; `#` blocks, every other character is walkable ground and is drawn by `style`. New styles: `style:'garden'` (lawn; `#` = hedge), `style:'terrace'` (marble; `#` = balustrade or pillar), `style:'storm'` (frozen lawn; `#` = ice or a broken statue). Existing: `style:'city'` (alley), `style:'cellar'` (the vault). `party` gets six entries. New battle fields: `nomagic:true` (otataral: Tuft's and Ohl's warren abilities are disabled; items still work), `mortal:true` (squadmates who go down stay down and are dead after the fight; see above). `objective:{type:'survive', rounds, text}`, `waves`, `allies` as before.

**New foe fields**: `immortal:true` (never drops below 1 health — the fight can only be survived), `attacks:2` (acts twice a turn), `ai:'raest'` (the Tyrant: alternates an ice lance at a squadmate anywhere on the field with a slow advance), `kind:'<sprite>'` (draw with another sprite — needed for allies and variants).

**Foes to declare in `CH6.foes`** (do not redeclare `hound`, `assassin`, `clawknife`, `guildknife`, `guildveteran`):
```
houseguard:{name:'House guard', sig:'g', hp:20, ac:15, atk:7, dmg:[1,8,3], rng:1, mv:4, init:2, verb:'swings a halberd at'},
housecaptain:{name:'Captain of the house', sig:'G', kind:'houseguard', hp:32, ac:16, atk:8, dmg:[1,10,3], rng:1, mv:4, init:3, boss:true, verb:'brings a halberd down on'},
houndhurt:{name:'Hound of Shadow, wounded', sig:'H', kind:'hound', hp:34, ac:15, atk:7, dmg:[2,6,3], rng:1, mv:6, init:5, boss:true, verb:'tears at'},
raest:{name:'The Tyrant', sig:'R', kind:'raest', hp:300, ac:18, atk:9, dmg:[2,8,3], rng:1, mv:2, init:2, boss:true, immortal:true, ai:'raest', verb:'lays a hand of ice on'},
rime:{name:'Rime-dead', sig:'r', kind:'rime', hp:16, ac:14, atk:7, dmg:[1,8,3], rng:1, mv:4, init:3, verb:'claws at'},
bbfiddler:{name:'Fiddler', sig:'F', kind:'fiddler', hp:40, ac:15, atk:8, dmg:[1,8,3], rng:5, mv:4, init:4, verb:'puts a quarrel into'},
bbhedge:{name:'Hedge', sig:'h', kind:'hedge', hp:40, ac:15, atk:7, dmg:[1,8,4], rng:1, mv:4, init:3, verb:'cracks a mallet across'},
clawmage:{name:'Claw hand-mage', sig:'M', kind:'claw', hp:18, ac:14, atk:7, dmg:[2,6,2], rng:4, mv:4, init:4, verb:'looses a shadow-bolt at'},
lorn:{name:'The Adjunct', sig:'L', kind:'lorn', hp:90, ac:18, atk:9, dmg:[2,6,4], rng:1, mv:4, init:6, boss:true, immortal:true, attacks:2, verb:'cuts at'}
```
**Battles to declare in `CH6.battles`** (you design the maps): `house_guards` (optional; `style:'terrace'` or `'city'`; 3 `houseguard` + `housecaptain`; xp 200), `terrace_knives` (`style:'terrace'`, dark; 3 `guildknife` + 1 `guildveteran`, +1 more `guildveteran` on the aside path via a second battle id `terrace_knives_2` or via `drop`; xp 240), `garden_hound` (`style:'garden'`, dark; `houndhurt`; `objective survive 3`; xp 240), `tyrant_garden` (`style:'storm'`, dark, music `'dark'`, warrenText about Omtose Phellack; `raest` at the top of the map + 3 `rime`; wave round 2: 3 more `rime`; allies `bbfiddler`, `bbhedge`; `objective survive 4`, text `'Hold the garden. Four rounds.'`; xp 300), `the_mines` (`style:'cellar'`, dark; `clawknife` + 2 `assassin` + `clawmage`; xp 300), `lorn_alley` (`style:'city'`, dark, `nomagic:true`, `mortal:true`, warrenText `'Otataral · every warren is dead here · whoever falls stays down'`; `lorn` + nothing else; `objective survive 3`, text `'Keep her off the boy. Three rounds.'`; xp 320).

**Gear** (3–4 items): e.g. a Fete mask that is a trinket (+1 guile), a house guard's halberd for Brisk (weapon, atk +1, `who:['brisk','sgt']`), a Bridgeburner's spare munitions satchel strap (trinket, hp +2), a Guild assassin's blacked blade on the terrace path. `slot` ∈ `weapon|armour|trinket`; stats `ac atk hp mv rng`, `stat:{might|wits|guile}`; always a `line:` of prose. Ids must be new (not `heater houndtooth cadretoken clawknife barrowtorc secondbadge rhivibow toccloak daruknife roadleather lampchip collsignet guildblade guildtoken ropehook andiicloak rhivicharm barrowflint otatglove scoutcloak`).

**Helpers** (as before): `SQUAD()`, `NAME(id)`, `loy(id,n)` (only for present squadmates — guard with `SQUAD().includes(id)`), `note(t,'good'|'bad')`, `gain(itemId)`, `recruit(id)`, `unrecruit(id)`, `startBattle(id, opt)` (`opt.pre` = Kettle's opening sharper, `opt.surprise:'p'|'e'`), `startExplore(areaId)`, `talk(id)`, `cardSequence(done, opt)`, `chapterEnd(n, key)`, `R(n)`, `listCount()` (**new**: Ohl's list count — 211 + Tattersail on the light path + Vell on the aside path + the Fourth's own dead + `S.f.listAdds`; if Ohl writes a new name tonight — Mammot? a boy in the alley? — do `S.f.listAdds = (S.f.listAdds||0) + 1`), `S.dead` (**new**: `{id:{ch, where}}` for dead squadmates), `S.f.lastFallen` (**new**: ids who died in the last mortal battle). **`win()` already awards the battle's xp — never call `gainXP` in an `after` node.**

**Node rules** (bible §7): a node's `fx` runs once per node id, ever, and after its text is built. Choice labels (`t`) are escaped: **no `*…*` and no `{sgt}` in choice labels.** Guard every squadmate line with `SQUAD().includes(...)` — Ellis may be absent; after the alley anybody but the sergeant may be absent. Prefer `S.loy.x >= 2` thresholds for special beats.

## Schema — produce exactly this in `src/45_chapter6.js`

```js
/* ============ chapter 6: The Fete ============ */
const CH6 = {
  title:'The Fete', number:'Six',
  intro:{loc:'Darujhistan', sub:'The Gedderone Fete · the morning after the hills', cap:'…', paras:[`…`,`…`,`…`], go:'…', node:'c6_start'},
  areas:[ { id:'fete_street', title:'…', sub:'…', hint:'…', decor:'city_dusk', map:[…16×12…], walk:'.,', triggers:{'g':'c6_gate'}, start:{x,y}, npcs:[…] },
          { id:'simtal_terrace', decor:'estate_terrace', … },
          { id:'simtal_garden', decor:'estate_night', … } ],
  battles:{ house_guards:{…}, terrace_knives:{…}, garden_hound:{…}, tyrant_garden:{…}, the_mines:{…}, lorn_alley:{…} },
  foes:{ …as above… },
  gear:{ … },
  card:{ id:'chains', … },
  scenes:{ fete_street:{loc,sub,cap,amb}, fete_hall:{…}, fete_garden:{…}, garden_storm:{…}, dragon_sky:{…}, alley_night:{…} },
  quests:{ fete_street:()=>'…', simtal_terrace:()=>'…', simtal_garden:()=>'…' },   // the HUD line per area, from flags
  end:{ bridgeburners:['<title>','<one paragraph>'], cellars:['…','…'], alley:['…','…'] },   // the end-of-chapter headline per key, like CHEND[5]
  endCap:()=>'…',          // the caption under the end-screen picture (it may mention a death)
  extras:()=>[ … ],         // end-screen bullet lines from flags, like the n===5 block in 37_chapters.js (include wjRegard lines, deaths, Tuft's resolution, the Guild, the signet)
  tease:'Next: …',          // one line teasing Chapter 7 (Outlaws: dawn on the Lakefront, the Host outlawed, the Claw's last accounting, and where the Fourth goes)
  dlg:{ c6_start:()=>({…}), … }
};
```

## Flag contract (Chapter 7 reads these — set them exactly)

- `S.f.c6_key` ∈ `'bridgeburners' | 'cellars' | 'alley'`
- `S.f.c6_tuft` ∈ `'glove' | 'shadow' | 'dark' | 'kept'` (always set by the time of the Tyrant, even if Tuft somehow isn't present — she always is at that point)
- `S.f.c6_orders` (cellars path: the Claw's written order was taken)
- `S.f.c6_steppedIn` (alley: the Fourth stood between Lorn and the boy) · `S.f.c6_lornEnd` (saw Lorn's end — alley path) · `S.f.lastFallen` / `S.dead` (engine)
- `S.f.c6_wjLeg` (bridgeburners path: they were there when it broke)
- `S.f.c6_paranToc` (Toc's message delivered to Paran)
- `S.f.c6_collRing` (the signet returned to Coll) · `S.f.c6_signetSeen` (somebody recognised it)
- `S.f.c6_guildPassed` or `S.f.c6_terraceFought`
- `S.f.c6_houndKnew` or `S.f.c6_houndFought`
- `S.f.c6_sawRake` (they stood near him on the terrace) · `S.f.c6_rakeLooked` (he looked at the Fourth — optional; e.g. on `c4_seen`)
- `S.f.c6_azath` (the sapling became the house) · `S.f.c6_done`

## Length and finish

80–100 nodes. Chapter 5 is the model for density. Every squadmate who is present gets at least one real beat; Tuft gets the chapter.

Do not touch any other file. Do not invent helpers, scenes, tile letters, sprite kinds or battle fields not listed. Output only `src/45_chapter6.js`. Then verify with a small node script (write it in your scratch space, not in the repo): maps 16×12 and battle maps 8×10; `start`, npc and trigger tiles walkable and reachable from `start` (treat trigger tiles as walkable; npc tiles block); every `go`/`fail`/`talk('…')` target string exists in `CH6.dlg`; every battle `after` exists; every foe id in battles exists in `CH6.foes` or among `hound assassin clawknife guildknife guildveteran`; no `*` or `{sgt}` in any choice `t`; then `node --check src/45_chapter6.js`. To evaluate the module in node, stub the globals it touches at load time (`S`, `SQUAD`, etc. are only used inside functions, so a plain `eval` of the file with `const CH6` replaced works — the Ch5 writer did this). Report the node count, the flags you set, and anything you had to decide that the brief didn't cover.
