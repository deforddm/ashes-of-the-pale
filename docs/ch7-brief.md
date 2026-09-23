# Chapter 7 — "Outlaws" — content brief (v3.6) — the finale

You are writing the content module `src/46_chapter7.js` for *Ashes of the Pale*, a Malazan Book of the Fallen fan RPG following an original marine squad (the Fourth) through Gardens of the Moon. The player plays the Sergeant. Chapters 1–5 are done. **Chapter 6 (The Fete) is being written at the same time by another writer from `docs/ch6-brief.md`**; you will not be able to read its module, so read its brief closely — its **flag contract** is what you build on. This is the last chapter of the book. It ends the game: four squad endings, a page per squadmate, a campaign summary.

Read these first, in this order:

1. `docs/story-bible.md` — everything the squad has lived through, every flag, every open thread, voices, and the inconsistencies not to repeat. **Read all of it.** §6 (open threads) is your checklist.
2. `docs/ch6-brief.md` — what happens the night before your chapter, and the flags it sets.
3. `src/14_data.js` — TPL (the squad: read every squadmate's `bio2`, `quest`, `traits`, `rel`), FOES, CARDS, PICKS, `registerChapter`.
4. `src/44_chapter5.js` — read every node. This is the module you are matching in shape and voice (second person, present tense, grimdark but humane, dry humour, short declaratives, canon characters in their own voices). Its close (`c5_close_*`) is the model for your squad goodbyes.
5. `src/42_chapter3.js` and `src/43_chapter4.js` — Darujhistan; Kruppe, Coll, Murillio, Crokus; Madryn and the grey cloak; the Claw's neat hand; Whiskeyjack's debrief style.
6. `src/37_chapters.js` — `CHEND` (the key titles you will see in the campaign summary), the end screen, `QUESTS`.
7. `src/16_skill_checks.js` — the prologue: Varrow's journal, Tattersail, the grey cloak's first appearance. The game began here; the finale should rhyme with it (the Fourth came up out of the dark "all five").

## Canon for this chapter (verified against the book — keep it)

The morning after the Fete.
- **Whiskeyjack's leg** was broken in the garden; Mallet has done what he can and it will never be right.
- Through Quick Ben's means (a sending — keep it vague: a bone, a voice, Quick Ben not smiling), **Whiskeyjack speaks to Dujek Onearm**, far to the north with the Host. **The Empress has outlawed Dujek**; he is under sentence of death. The Empire is stretched thin (Seven Cities is close to rising). Dujek means to go his own way — to talk with Caladan Brood (do not elaborate the politics). **The Black Moranth stand with Dujek.** **Whiskeyjack becomes Dujek's second-in-command. Paran is given command of the Bridgeburners.** Whether the outlawry is all it seems is not for the Fourth to know — Quick Ben may look like a man who knows something; nobody says anything.
- **Kalam and Fiddler leave by ship**, taking **Crokus** and **Apsalar** (Sorry — the possession gone out of her; a fisher girl again, with somebody else's memories fading) home across the sea. **Crokus throws Oponn's coin into the lake.**
- **Moon's Spawn** drifts away west. For the first time since Pale the sky over the Fourth has nothing in it.
- **The Azath** stands in what was Simtal's garden, a house with a yard of mounds. **Rallick** went into it last night carrying someone; he has not come out. **Coll** has his house back. **Murillio** is not well. **Kruppe** is exactly as well as he chooses to be. **Baruk** grieves Mammot.
- **Paran** has Lorn's otataral sword and carried her body out of the city (he buries her on the north shore of the lake). In the book's last pages he reaches for Tattersail — and finds she is **not gone**. (In this game she is the child in the Rhivi bundle — the Mhybe's — going home east with Sethand's people.)
- **Tool** leaves alone, walking, not hurrying. One glimpse at most.

**Rules:** the Fourth changes none of this. No canon character dies, lives, wins or loses because of the player. Canon characters are met, not played; keep their lines few and in voice. Whiskeyjack: "Sergeant." / "Good." / "I know." Dujek (a voice only, or in the outlaw epilogue): blunt, old, one-armed, profane in the Malazan way, fond of the sergeant (who served three years under him) and of Ohl (who served the Second under him). Paran: stiff, then flat about death, now with something new in him. Kruppe: third person, ornate, exact. Crone: "Ha!", "little soldiers", "my lord". Sethand: "Malazan." in the voice the Untan docks use for *tide*; never says a thing twice.

## What Chapter 7 is (the Fourth's morning)

One morning in Darujhistan, then a hill east of the city where the Black Moranth have landed their quorls to carry the Bridgeburners north to the outlawed Host. Every thread the squad has carried gets its payoff. The Claw comes for its last accounting. Then the sergeant decides where the Fourth goes, and the game ends.

### Threads you must pay off (bible §6 — all of them)

- **The Claw's last accounting** (one optional fight). The grey cloak — the never-named Claw with clean boots and a neat hand who has followed the Fourth since the prologue — comes to close the Fourth's entry. What he comes with depends on the Fourth's ledger:
  - Claw-friendly (`S.f.clawFavour` and not `S.f.marked`; `c1_key==='claw'`, `c3_key==='report'`, prologue `claw`): he comes with an **offer** — a pardon in a neat hand, passage home, a place: the Empire has use for soldiers who report. This is the pull toward the **empire** ending. The price is a report on the Bridgeburners (and on the sergeant's own people). Accepting or refusing sets `S.f.c7_clawDeal='took'|'refused'`.
  - Claw-hostile (`S.f.marked`, `c3_key==='refuse'`, `c1_accFought`, `c3_knivesFought`, `c3_wjTold`): he comes to **close the entry**. Battle `last_accounting` (optional: it can be avoided — Guile, or with the Claw's own written order from the cellars, `S.f.c6_orders`, as leverage: "if this reaches the Host, or the Bridgeburners —"). `S.f.c7_clawFought=1` / `S.f.c7_clawBought=1`.
  - **Tuft** (`S.f.c6_tuft==='kept'`): the High Mage's working is still in her badge; he has come for her. Last chance to cut it (the otataral glove is still in the kit — the glove path is always open; pay it). If it isn't cut now, Tuft goes with him in the **empire** ending and her fate page says so.
  - **Whiskeyjack and the report:** if the Fourth reported to the Claw in Ch3 (`S.f.c3_told`) and Whiskeyjack never learned it (`!S.f.c3_wjTold`), he learns it this morning — from the grey cloak, or from Kalam (`S.f.c4_kalamLook`), or from the sergeant first if the player chooses to tell him before anyone else can. Set `S.f.c7_wjKnows` and how (`'told'` by the sergeant, `'claw'`, `'kalam'`). This matters to the outlaw ending: Whiskeyjack takes the Fourth anyway if the sergeant told him; he does not if he heard it from the Claw.
  - Madryn said "not this year." It's a new year somewhere. One line.
- **Ellis.**
  - `S.f.c5_ellisThrough` (she went into the grey after Toc; `unrecruit`ed): **she comes back** this morning — steps out of a shadow on the Lakefront at dawn with grey in her hair, Kettle's two lengths of fuse-cord knotted round her wrist (that's what they were for: a line to find her way back), and no idea how long she was gone ("Four days." "It was longer."). She did not find Toc. "He's out there. He kept riding." (Toc's Ch2 message, in her mouth now.) The sergeant can take her back: `recruit('ellis')`, `S.f.c7_ellisBack=1`. (Her loyalty in `S.loy.ellis` survived; Kettle gets her cord back.)
  - `S.f.c2_ellisRefused` (she never joined): she is at **the green door** — the Claw house on the Lakefront, a wine-merchant's near the Gadrobi quarter — come to read her own name in the ledger. The Fourth can go with her. She may walk with them at the end (`recruit('ellis')`, `S.f.c7_ellisJoined=1`) or not.
  - Ellis in the squad (any path): **the green door and the ledger** — "which way it is written". Resolve it (cut loose / struck / *pretty* / whatever the book says in a neat hand). If `S.f.c5_ellisHeld`: this is where her silence with the sergeant ends — one sentence, the right one.
  - If Ellis died in the Ch6 alley (`S.dead.ellis`) none of this happens; her page is in the finale.
- **Brisk and Tav** (never resolved; the letter is still sealed in her gorget with the badge): the Moranth carry the Host's rolls, or Dujek's voice answers a question. **Tav is alive** — Fourth Regiment, the Second's survivors folded into Onearm's Host, on the list of the living. Brisk opens the letter at last. Write the letter (short, dry, a brother's; it should make her laugh or break, or both). If Brisk died in Ch6, the sergeant finds the letter in her gear and the news comes anyway — decide what the sergeant does with it (`S.f.c7_tav='alive'`, `S.f.c7_letter='brisk'|'sgt'`).
- **Kettle's Moranth debt** (never touched, bible §1): the Black Moranth quartermaster at the quorls knows her. The debt is **Chub's cusser** — a Moranth cusser Chub took from a Moranth crate at Nathilog and never signed for, and gave to her ("keep it for the one that matters, girl, you'll know it"); **the spoon** is the Moranth measuring spoon that came with it. If she still has a cusser (`S.inv.cusser > 0`) she can hand it back and be square. If she threw it at the barrow wards in Ch5 (`S.f.c5_cusserUsed`) she tells him what it was spent on, and the Moranth accept that — "the one that mattered". Give the Moranth their click-and-hiss speech and their strangeness (they are hidden inside black chitin; nobody has seen a Moranth face). `S.f.c7_debt='paid'|'spent'|'owed'`.
- **Ohl's list** (count = `listCount()`; bible §1): the spaces he left for Toc and Ellis — if Ellis comes back he crosses her space out, which he has never been able to do. Dujek's voice knows him. His fate page settles the list (the TPL promise: no name from the Fourth — if Ch6 put one there, `S.dead`, that has to be faced).
- **Tuft** (her arc resolved in Ch6 — `S.f.c6_tuft`): she owes the sergeant an explanation of Kruppe's sentence (Ch3). At the quorl hill the Rhivi bundle goes by with Sethand's people — **the child is Tattersail**, and Tuft knows it and says so, finally (`S.f.c7_tattersail=1`). `'shadow'` / `'dark'` / `'glove'` / `'kept'` colour her fate page.
- **Paran**: Toc's message (`S.f.c6_paranToc` — if not delivered yet, now); the alley (`S.f.c6_lornEnd` — the Fourth were there when she died); he is the Bridgeburners' new captain and short of soldiers; he remembers the line at Pale (`c1_key==='line'`).
- **Coll's signet** (`S.f.c3_coll` and not `S.f.c6_collRing`): give it back on the Lakefront, or keep it.
- **The Guild:** Vell alive (`c4_vell`) can appear to pay his debt (a warning about the Claw; a name) — or Ocelot's grudge (`c4_key==='aside'`) is settled or not.
- **Kruppe** — the city ending's patron (Coll needs a house guard for a house with an Azath in the garden; the Phoenix Inn; Baruk needs doors watched). **Kalam** — one last look, or a word (`c4_kalamLook`). **Crone** — last laugh: her lord says the small ones may go. **Sethand** — the Rhivi road east; if `S.f.c2_outSeth` the unpayable debt is still owed; if `S.f.c5_sethSat` the charm.
- **Whiskeyjack's regard** (`S.f.wjRegard`, −2..+2; `S.f.c3_wjTold`) and what the Fourth did at the Fete (`S.f.c6_key`: `'bridgeburners'` held the garden with them; `'cellars'` saved the city under their feet; `'alley'` stood between the Adjunct and a Daru boy) decide what the Bridgeburners think of the Fourth.
- **The dead** (`S.dead` — anyone who fell in the Ch6 alley): they are not in the squad. Every squadmate line must be guarded with `SQUAD().includes(...)`. Somebody should say their name this morning.

## Areas (in order) — design the 16×12 maps yourself

1. **Chapter card + intro** (`CH7.intro`): `loc:'Darujhistan'`, `sub:'The Lakefront · the morning after'`, three short paragraphs (dawn; the smell of the lake; the sky with nothing in it; the city counting). Intro `node:'c7_start'`.
2. **The vault or the garden bench** (talk nodes, `scene:'cellar'` or `'fete_garden'`): Whiskeyjack with his leg; Quick Ben and the sending — Dujek's voice (to the sergeant; to Ohl); the news (the Host outlawed, Whiskeyjack second, Paran the Bridgeburners' captain). Whiskeyjack to the Fourth: you're not Bridgeburners; the outlawry reads *the Host*; the Host is a word with some give in it; the quorls leave from the hill east of the city at noon; be on them or don't. Then `startExplore('lakefront')`.
3. **Area `lakefront`** (decor `lakefront`, 16×12): the docks at dawn — lake water (`~`), piers (`p`), moored boats (`n`), bollards (`k`), crates (`B`), blue lamps going out (`L`), a door (`D`) that is the **green door** (make it a trigger). NPCs (guard with `show`): **Kalam**, **Fiddler**, **Crokus**, **Apsalar** (`'sorry'` sprite) at a ship — the farewell (Fiddler to Kettle; Kalam's look; Crokus and the coin); **Kruppe** on a bollard; **Coll**; **Paran** (with Lorn's sword — sprite `'paran'`); **Mallet**; **the grey cloak** (`'claw'`, the last accounting); **Ellis** coming back out of a shadow (`'ellis'`, `show:()=>S.f.c5_ellisThrough && !S.f.c7_ellisBack`) or at the green door (`show:()=>S.f.c2_ellisRefused`); **Vell** (`'vell'`, only if `S.f.c4_vell`). Exit east (`>`) to the hill — but not before the accounting has been faced (or deliberately avoided).
4. **Area `quorl_hill`** (decor `hills`, 16×12): a brown hill east of the city on the Gadrobi road, morning. **Black Moranth** (`'moranth'`) and their **quorls** (`'quorl'`, `still:true` — huge winged insects on the grass), the Bridgeburners boarding, **Whiskeyjack** on a litter (`'wj'`, `still:true`), **Quick Ben**, **Paran**, the **Moranth quartermaster** (Kettle's debt; give him a Moranth name), **Sethand** and a Rhivi party (`'rhivi'`) with the bundle, on the road east (Tuft and Tattersail), **Crone** (`'crone'`) on a stone. **The choice** is made here, with Whiskeyjack: `c7_choice`.
5. **Close** — `c7_close`: the squad's last round (like `c5_close_*`: each living squadmate says their piece about the road chosen; loyalty decides whether they come), then `chapterEnd(7, S.f.c7_key)`. The engine then shows the finale pages built from `CH7.finale`.

### The choice that matters — `S.f.c7_key`

Four roads. Every squadmate reacts by loyalty and by their own thread; some may not follow. Show, in the choice node itself, who is with the sergeant on each road (e.g. Brisk will go where Tav is; Kettle's debt; Ellis's ledger; Tuft's badge; Ohl's list).

- **`'outlaw'`** — go north with the Bridgeburners on the quorls, into Dujek's outlawed Host. The canon road. Tav is with the Host. Whiskeyjack takes the Fourth only if he trusts them (`wjRegard >= 0`, or the sergeant told him about the Claw report themselves, or they held the garden); otherwise they go as the Host's marines, not his. Paran is short of soldiers.
- **`'empire'`** — go home to the Empire, honest or not: take the grey cloak's pardon (`c7_clawDeal==='took'`) or just walk to Genabaris and report as a loyal squad of a rebel army. Brisk goes the other way from Tav. The Claw keeps its ledger.
- **`'city'`** — stay in Darujhistan. Coll's house has an Azath in the garden and needs a guard; Kruppe has arranged things before anyone asked; the Phoenix Inn needs a bouncer. Deserters, in the Empire's ledger. Warm and uneasy.
- **`'disband'`** — stand the Fourth down. The sergeant tells them they're free, and each one chooses their own road (Brisk to Tav, Kettle to the Moranth, Tuft east with the Rhivi and the child, Ohl… , Ellis…). The squad ends; the people don't.

Set `S.f.c7_key` and call `chapterEnd(7, S.f.c7_key)` from `c7_close`.

## The finale (you write the text; the engine lays out the pages)

Add `CH7.finale`:
```js
finale:{
  endings:{  // page 1: the road taken. scene ∈ 'road_east'|'ship'|'lakefront_dawn'|'quorl_hill'|'fete_garden'
    outlaw:{title:'Outlaws', scene:'road_east', paras:[`…`,`…`,`…`]},
    empire:{title:'…', scene:'ship', paras:[…]},
    city:{title:'…', scene:'lakefront_dawn', paras:[…]},
    disband:{title:'…', scene:'quorl_hill', paras:[…]} },
  fate:(id, key)=>({title:'…', txt:`…`}),   // one page per squadmate STILL IN S.squad (not 'sgt'), then one for 'sgt' (the sergeant's own fate, called with id 'sgt')
  gone:(id, key)=>({title:'…', txt:`…`}),   // one page per squadmate who is NOT in the squad at the end: dead (S.dead[id]) or gone and not back (e.g. Ellis refused and not rejoined, Ellis through and not taken back)
  coda:(key)=>[`…`,`…`]                      // the last page's closing paragraphs, above the engine's campaign summary
}
```
- `fate` should be rich: 2–4 paragraphs per squadmate, built from `key`, `S.loy[id]`, and their thread's flags (Tav and the letter; the debt; the badge and the child; the list; the ledger). A squadmate who would not follow the sergeant's road (`S.loy[id] <= -2`, or their thread pulls them elsewhere) gets that in their fate, with dignity — they go their own way. Every combination must produce sensible text (write defaults). The sergeant's own page (`'sgt'`) closes the loop from the prologue ("all five", the whistle, the pay ledger, the names of the dead, "somebody has noticed").
- `gone` for the dead: short, plain, final, in the voice of the one who remembers them (Ohl if Ohl lives; otherwise Brisk; otherwise the sergeant). Include Ohl's list number for them: `listCount()` is the total; the dead's own numbers are yours to assign (e.g. the next numbers after 211 + Tattersail + Vell).
- `coda`: one or two paragraphs — the book closes. Something the gods do not say. Rhyme with the prologue.
- The engine adds, below the coda, a **campaign summary** it builds itself: the key title of each chapter (`CHEND`), the dead, Ohl's count, the squad level. You don't write that.

Also provide, like Chapter 6: `end:{outlaw:['<title>','<paragraph>'], empire:[…], city:[…], disband:[…]}` (the end-of-chapter screen that precedes the finale pages), `endCap:()=>'…'`, `extras:()=>[…]` (bullet lines from flags: the accounting, Ellis, Tav, the debt, Tuft, Whiskeyjack's regard), `quests:{lakefront:()=>'…', quorl_hill:()=>'…'}`, `scenes:{lakefront_dawn:{loc,sub,cap,amb}, quorl_hill:{…}, road_east:{…}, ship:{…}}`. No `tease` (there is no Chapter 8) — or a one-line "The Book of the Fallen goes on without the Fourth, mostly." if you like.

## Deck

One draw: Tuft (if alive and in the squad), on the Lakefront or at the hill (`cardSequence(()=>talk('c7_card'))`; `S.card` from `['crown','crown','obelisk','oponn','chains','knight']`; refusing sets `S.f.c7_noCard`). The new card is the **Crown**: `card:{ id:'crown', name:'Crown', house:'Unaligned', hue:'#e8c073', txt:\`…\`, fx:'Every skill check this chapter rolls twice and keeps the better.' }` — the engine implements the effect; keep the fx text exactly. (The Crown: sovereignty. Tuft laughs: it means nobody owns us. Or everybody wants to.) If `S.f.c6_tuft==='glove'` her Meanas is quiet — she can still read the Deck; the Deck isn't Meanas. If Tuft is dead, nobody draws; the Deck is in her pack; someone holds it.

## Engine surface (use exactly these)

**Decors / tiles**: `lakefront` (new; the city style at dawn) — `.` cobbles · `,` wet stone · `#` building · `~` lake water (blocks) · `p` pier planks (walkable — list it in `walk`) · `n` moored boat (blocks) · `k` bollard (blocks) · `B` crates (blocks) · `L` gas lamp (blocks) · `W` wagon (blocks) · `x` post (blocks) · `r` rubble (blocks) · `D` door (trigger) · `>` `<` `^` `v` exits. `hills` (existing) — `.` grass · `,` scrub · `r` rock · `M` barrow stone · `#` drop · `x` Rhivi stake · exits.
**Scenes** (new, drawn by the engine; put their text in `CH7.scenes`): `'lakefront_dawn'` (docks, a ship at the pier, the empty sky), `'quorl_hill'` (quorls on a brown hill, Black Moranth, the city behind), `'road_east'` (a column on a road going north-east at morning, far off), `'ship'` (a deck, a sail, open water). Also available from Ch6: `'fete_street'`, `'fete_hall'`, `'fete_garden'` (after `S.f.c6_azath`, the garden shows the Azath house), `'garden_storm'`, `'dragon_sky'`, `'alley_night'`; older: `'cellar'`, `'city_street'`, `'inn'`, `'room'`, `'roof'`, `'hills'`, `'plain'`.
**Sprites**: existing `wj`, `qb`, `kalam`, `paran`, `fiddler`, `hedge`, `mallet`, `trotts`, `kruppe`, `crokus`, `murillio`, `coll`, `rallick`, `sorry`, `claw`, `clawknife`, `assassin`, `vell`, `rhivi`, `crone`, `ellis`, `tool`, `urchin`, `guard`; new: `dujek` (one-armed old soldier — only in scene art or the epilogue; he is not in the city), `moranth` (Black Moranth in black chitin), `quorl` (the insect mount), `baruk`, `crimson`, `irilta`, `meese`, `reveller`.
**Battles**: 8×10; `#` blocks. New style `style:'dock'` (planks and cobbles; `#` = lake water or stacked crates). `objective`, `waves`, `allies`, `surprise` as before.
**Foes to declare in `CH7.foes`** (you may also use `assassin`, `clawknife`, and Ch6's `clawmage` — all chapters are registered at boot):
```
greycloak:{name:'The grey cloak', sig:'C', kind:'claw', hp:44, ac:17, atk:9, dmg:[1,10,4], rng:1, mv:6, init:7, boss:true, verb:'opens'},
clawcrossbow:{name:'Claw crossbow', sig:'x', kind:'assassin', hp:16, ac:14, atk:8, dmg:[1,10,2], rng:5, mv:4, init:5, verb:'shoots at'}
```
Battle `last_accounting` (`style:'dock'`, the Lakefront at dawn; `greycloak` + 2 `assassin` + `clawcrossbow` + `clawmage`; xp 320). You decide what happens to the grey cloak if he loses (into the lake? dead on the planks? his ledger in the sergeant's hand?). He is still never named.
**Gear**: 2–3 items (e.g. a Moranth thing for Kettle if the debt is settled; Paran's gift; Kruppe's). New ids only.
**Helpers**: `SQUAD()`, `NAME(id)`, `loy(id,n)` (only for present squadmates), `note`, `gain`, `recruit(id)`, `unrecruit(id)`, `startBattle`, `startExplore`, `talk`, `cardSequence(done)`, `chapterEnd(7, key)`, `R(n)`, `listCount()`, `S.dead` (`{id:{ch, where}}`), `S.f.lastFallen`, `S.inv`, `S.silver`, `S.loy`, `S.kit`, `S.gear`. **`win()` already awards xp.** A node's `fx` runs once per node id ever and after its text is built. **No `*…*` and no `{sgt}` in choice labels.**
**Checks**: the Crown card makes checks roll twice (engine). Use Guile/Wits/Might checks for the accounting and the ledger.

## Flags you can read from Chapter 6 (its contract)

`S.f.c6_key` ∈ `'bridgeburners'|'cellars'|'alley'`; `S.f.c6_tuft` ∈ `'glove'|'shadow'|'dark'|'kept'`; `S.f.c6_orders` (cellars: the Claw's written order to fire the mines, taken as evidence); `S.f.c6_steppedIn` (alley: they stood between Lorn and the boy); `S.f.c6_lornEnd` (they saw Lorn die); `S.dead` / `S.f.lastFallen` (who died in the alley; `S.f.sgtScar` if the sergeant fell and lived); `S.f.c6_wjLeg` (they were there when Whiskeyjack's leg broke); `S.f.c6_paranToc` (Toc's message delivered); `S.f.c6_collRing` (signet returned) / `S.f.c6_signetSeen`; `S.f.c6_guildPassed` / `S.f.c6_terraceFought`; `S.f.c6_houndKnew` / `S.f.c6_houndFought`; `S.f.c6_sawRake`, `S.f.c6_rakeLooked`; `S.f.c6_azath`.

## Flags you set (the finale reads them)

`S.f.c7_key` ∈ `'outlaw'|'empire'|'city'|'disband'`; `S.f.c7_clawDeal` ('took'|'refused'), `S.f.c7_clawFought`, `S.f.c7_clawBought`, `S.f.c7_wjKnows` ('told'|'claw'|'kalam'); `S.f.c7_ellisBack`, `S.f.c7_ellisJoined`, `S.f.c7_ledger` (what Ellis's line said); `S.f.c7_tav`, `S.f.c7_letter`; `S.f.c7_debt`; `S.f.c7_tattersail`; `S.f.c7_tuftCut` (if a 'kept' working is cut this morning); `S.f.c7_follow` — an object `{id: true|false}` recording who follows the sergeant's road (set it in the choice/close; the finale fates read it); `S.f.c7_done`.

## Length and finish

60–80 dialogue nodes, plus the finale text. Every squadmate who is alive gets a real farewell beat; the four endings each get three paragraphs that land.

Do not touch any other file. Do not invent helpers, scenes, tile letters, sprite kinds or battle fields not listed. Output only `src/46_chapter7.js`. Verify with a small node script in your scratch space: maps 16×12 and battle maps 8×10; `start`, npc and trigger tiles walkable/reachable (trigger tiles count as walkable; npc tiles block); every `go`/`fail`/`talk('…')` target exists in `CH7.dlg`; battle `after` nodes exist; foe ids exist in `CH7.foes` or among `assassin clawknife clawmage`; no `*` or `{sgt}` in choice labels; then call `CH7.finale.fate(id, key)` and `gone(id, key)` for every id in `['sgt','brisk','kettle','tuft','ohl','ellis']` × every key under a handful of stub states (all loyalties −3, 0, +3; Ellis present/absent/dead; Tuft each `c6_tuft`; someone dead) and check nothing throws and no `undefined` appears in the text; then `node --check src/46_chapter7.js`. Report the node count, the flags you set, and anything you had to decide that the brief didn't cover.
