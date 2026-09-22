# Chapter 4 — "Assassins" — content brief (v3.3)

You are writing the content module `src/43_chapter4.js` for *Ashes of the Pale*, a Malazan Book of the Fallen fan RPG (Gardens of the Moon). Read these first, in this order:

1. `src/14_data.js` — TPL, FOES, CARDS, ITEMS/gear shape, BATTLES, AREAS, PICKS.
2. `src/16_skill_checks.js` — the prologue dialogue tree (`DLG`) and the helpers. This is the voice.
3. `src/42_chapter3.js` — Chapter 3, the module you are matching in shape and voice. Read every node: `areas:[]`, exit tiles, `scene:` moves, npc `fresh`/`show`/`node`, gear/battles/foes/card, the card node, the `check:[stat,dc], go, fail` pattern, and the close (`chapterEnd(3, key)`).
4. `src/40_chapter1.js` — the two `hounds_*` battles: `objective:{type:'survive', rounds:N, text}`, `waves:[{round, foes, text}]`, `allies:[[kind,x,y]]`. You will use all three.
5. `docs/outline.md` — the campaign outline.

## What Chapter 4 is

Two nights after Chapter 3. Kalam has been trying to buy the Assassins' Guild for the Empire; the Guild has not answered because someone is killing Guild assassins on the rooftops — tall, silver-haired, silent — and the Guild thinks it is the Malazans. It is not. It is Anomander Rake's Tiste Andii, on Rake's order, denying the Empire the Guild. Canon fixed points, all *near* the Fourth, none of which they change: Kalam goes up to the roofs alone to signal the Guild and is met by Guild assassins who are then killed around him by the Andii; Quick Ben goes up after him with something in a sack (Hairlock's puppet, never named — a wooden thing that laughs); Rallick Nom is on the roofs on his own business and alive at the end; Ocelot, Rallick's clan-master, is alive at the end; Crokus the thief crosses the roofs at a dead run with a bag from Lady Simtal's estate and a tall figure behind him, and gets away (nobody in the Fourth may touch either of them); Sorry is in the street below, watching a fat man's friends; Circle Breaker (a Guild man, seen only as "a man in a guardsman's coat who is not a guardsman", never named) is on a corner. Nobody canon dies or lives because of the player. The Guild survives the night (it does in the book), and the Malazan contact fails (it does in the book).

**The Fourth's job.** Whiskeyjack: "Kalam's going up tonight. You're going up two roofs over. You watch. You do not help. If it goes wrong you come down and you tell me how." (`S.f.wjRegard` colours the briefing — he trusts them with this if ≥1, tells them they were the only squad not busy if ≤ −1.) If `S.f.c3_key==='report'`, Kalam looks at the sergeant a beat too long before he goes up — he knows the Claw has been told *something*, not by whom; `S.f.c4_kalamLook=1`. If `S.f.c3_wjTold`, Whiskeyjack says the Guild has "a grey-haired dye-seller's name" now and Kalam laughs, once.

**The choice that matters.** On Kalam's roof the Guild assassins die around him and he runs. One of them — **Vell**, an original: young, Daru, a Guild journeyman with a rope-and-hook, cut across the back — comes over the parapet onto the Fourth's roof with an Andii assassin two roofs behind and closing. The Andii does not speak. Vell does: "I'm nobody. I'm nobody. Please." **Shield** = stand between them: `startBattle('andii_roof')` — a *survive* battle (hold 3 rounds; the Andii is a boss you cannot realistically kill; Quick Ben's illusion pulls it off the roof at the end — `after` node: a second silver-haired shape hesitates, something in Quick Ben's sack laughs, and both Andii go *elsewhere*). `S.f.c4_key='shield'`, Vell lives (`S.f.c4_vell=1` — a Guild debt for later), Brisk +1 ("that's what a line is for"), Ohl +1, Tuft −1 (she saw what the Andii was and thinks the sergeant is a fool), Ellis +1 if present, Kettle indifferent. The Guild (Ocelot, through Rallick) knows a Malazan squad held a roof for one of theirs; `S.f.c4_guildKnows=1`. **Aside** = step out of the way: the Andii kills Vell on the Fourth's roof in one motion, looks at the sergeant, and *nods* — and goes. `S.f.c4_key='aside'`, `S.f.c4_seen=1` (a Tiste Andii knows the Fourth's faces; that's a Rake thing now), Tuft +2 (she looked into Kurald Galain and it looked back; `S.f.c4_tuftDark=1` — plant), Brisk −2, Ohl −2 ("his list has a name on it now that he didn't put there"), Ellis −1 if present. Either way Kalam gets off the roof; either way the chapter ends at dawn at the dig with Whiskeyjack's debrief.

**Fights.** (1) Before the meet, on the Gadrobi roofs: two Guild assassins take the Fourth for the silver-haired killers' helpers and come at them across the planks — `startBattle('guild_roofs')` (three `guildknife`, ordinary, xp 200, `style:'roof'`, `dark:true`, no walls but `#` = drops between roofs). A Guile 13 *before* it (the sergeant shouts "Malazan! Malazan, you idiots!") turns it into two foes instead of three (pass `startBattle('guild_roofs', {fewer:true})` — the engine drops the last foe when `opt.fewer`) — implement by declaring a second battle `guild_roofs_2` with two foes and choosing which to start; do not rely on `opt`. (2) The choice fight `andii_roof` on shield (survive 3 rounds: foe `andiihunter` boss; `allies:[['vell',6,8]]` — Vell fights with a knife, badly; wave at round 2: a second `andiihunter` at the far parapet, text: "A second shape. It does not hurry."). (3) On aside, instead: the Guild's reprisal in the alley on the way down — `startBattle('reprisal')` (two `guildknife` and one `guildveteran`, xp 220, `style:'city'`, `dark:true`) because Ocelot's people saw a Malazan squad stand aside while one of theirs was opened, and that is an answer of a kind.

## Areas (in order)

1. **Chapter card + intro** (`CH4.intro`, three short paragraphs: two nights, the roofs, the thing the city is not talking about, Kalam sharpening). `loc:'Darujhistan'`, `sub:'The rooftops · the second night'`.
2. **Briefing** — `c4_start` opens on `scene:'cellar'`: Whiskeyjack, Kalam (`'kalam'`), Quick Ben with a sack (`'qb'`), Fiddler. Then `startExplore('roofs_gadrobi')`.
3. **Area `roofs_gadrobi`** (decor `roof_night`): flat roofs joined by planks, chimneys, a skylight, drops. Tiles: `.` roof tile · `,` slate (walkable) · `#` drop / open air (impassable) · `p` plank (walkable) · `C` chimney (blocks) · `S` skylight (blocks, glows) · `>` exit east (trigger) · `x` a washing-line post (blocks). `walk:'.,p><'`. NPCs: Rallick Nom (`'rallick'`, `still:true`, one node, the line: "Go home, Malazan. This isn't your war." — and if `S.f.c4_key` is set later he is gone: `show:()=>!S.f.c4_key`), Crokus (`'crokus'`, `show:()=>!S.f.c4_crokus` — the trigger node on a `,` tile? no: make Crokus an npc who is *running*: his node is a one-shot cutscene: he goes past with the bag, a tall shape behind him, Ellis or Kettle nearly shoots, the sergeant says no; sets `S.f.c4_crokus=1`), the Guild pair encounter is the `>` exit trigger the first time (`S.f.c4_roofsFought` after). Also a Wits 12 check at the skylight: below, a fat man in a red waistcoat asleep at a table, and a girl in the doorway watching him who does not move at all (`S.f.c4_sawSorry=1`).
4. **Area `roofs_daru`** (decor `roof_night`): the meet. Kalam's roof is the `K` tile? — no new tile letters: use a `S` skylight as Kalam's marker is confusing; instead Kalam is an npc (`'kalam'`, on the far roof, `still:true`; his node is the meet cutscene: the signal, the Guild arriving (`'assassin'` npcs shown only after `S.f.c4_meet`), then the Andii, then Kalam running — all as one `scene:'roof_night'` sequence ending with Vell over the parapet and the choice node). The `<` exit west leads back to Gadrobi (allowed before the meet; after `S.f.c4_key` the `<` trigger routes to the descent: `c4_descend`). NPC Quick Ben appears after the choice (`show:()=>S.f.c4_key`), one node.
5. **Descent** — `c4_descend`: `scene:'city_street'`. On aside → `startBattle('reprisal')`; on shield → Vell's thank-you (he gives the sergeant a Guild token — `gain('guildtoken')`) and a man in a guardsman's coat on the corner who is not a guardsman and does not look at you. Then `c4_dawn`: `scene:'roof'` (dawn) — Whiskeyjack's debrief at the dig: what the Fourth saw; he already knows; Kalam is alive and furious; "Rake's people," he says, and nothing else, and then: "Quick Ben says the second one *hesitated*. Why would it do that, Sergeant?" (He knows why on shield; on aside he says "It nodded at you." Both are the wrong shape.) `chapterEnd(4, key)`; set `S.f.c4_done=1`.

Deck: one draw, Tuft on the Gadrobi roof before the crossing (same pattern: `cardSequence(()=>talk('c4_card'))`; `S.card` from `['assassin','assassin','knight','knight','oponn','herald']`). New card art exists for all of these.

## Engine surface (already implemented — use exactly these)

- Decor: `'roof_night'` (new), `'city_night'`, `'cellar'`.
- Roof tiles as above. City tiles as Chapter 3.
- Scenes for `scene:`: `'explore'`, `'roof_night'` (new: rooftops at night, Moon's Spawn, the squad small on a roof), `'roof'` (dawn), `'cellar'`, `'city_street'`, `'inn'`.
- Sprite kinds for npcs: `wj`, `qb`, `kalam`, `fiddler`, `crokus`, `rallick` (new), `vell` (new), `assassin` (Guild), `andii`, `guard`, `sorry`.
- Battles: `style:'roof'` (new; `#` = drops, the rest roof tile) or `style:'city'`; 8×10 maps; party rows 8–9.
- Foes to declare in `CH4.foes` (sprites exist):
  `guildknife:{name:'Guild assassin', sig:'a', hp:14, ac:15, atk:6, dmg:[1,8,2], rng:1, mv:6, init:5, verb:'cuts at'}`,
  `guildveteran:{name:'Guild veteran', sig:'A', hp:24, ac:16, atk:7, dmg:[1,10,3], rng:1, mv:6, init:6, verb:'opens'}`,
  `andiihunter:{name:'Tiste Andii', sig:'T', hp:60, ac:17, atk:8, dmg:[2,6,3], rng:1, mv:6, init:7, boss:true, verb:'takes apart'}`,
  `vell:{name:'Vell', sig:'v', hp:10, ac:13, atk:4, dmg:[1,6,1], rng:1, mv:6, init:4, verb:'stabs at'}` (used only as an ally).
- Gear: 3–4 items (`guildtoken` trinket +1 guile, a rope-and-hook trinket +1 move for ellis/sgt/kettle, a Guild blade weapon, an Andii-grey cloak armour that only Tuft will wear).
- Card: none new this chapter (omit `card:`; the draw uses existing cards).
- Helpers: as Chapter 3. Flags the engine reads: `c4_briefed`, `c4_roofsFought`, `c4_crokus`, `c4_sawSorry`, `c4_rallick`, `c4_meet`, `c4_key` (`shield`|`aside`), `c4_vell`, `c4_guildKnows`, `c4_seen`, `c4_tuftDark`, `c4_kalamLook`, `c4_reprisalFought`, `c4_done`. Quest lines: `QUESTS.roofs_gadrobi`, `QUESTS.roofs_daru` read `c4_roofsFought`, `c4_meet`, `c4_key`.

## Schema — produce exactly this in `src/43_chapter4.js`

```js
/* ============ chapter 4: Assassins ============ */
const CH4 = {
  title:'Assassins', number:'Four',
  intro:{loc:'Darujhistan', sub:'The rooftops · the second night', cap:'…', paras:[`…`,`…`,`…`], go:'Up', node:'c4_start'},
  areas:[ { id:'roofs_gadrobi', decor:'roof_night', map:[…16×12…], walk:'.,p><', triggers:{'>':'c4_to_daru', S:'c4_skylight'}, start:{x:2,y:6}, npcs:[…] },
          { id:'roofs_daru', decor:'roof_night', … triggers:{'<':'c4_back_west'} … } ],
  battles:{ guild_roofs:{…}, guild_roofs_2:{…}, andii_roof:{…objective, allies, waves…}, reprisal:{…} },
  foes:{ … },
  gear:{ … },
  dlg:{ c4_start:()=>({…}), … }
};
```

`S` (skylight) blocks movement, so its trigger cannot fire by stepping — make the skylight look an npc-less trigger on the `,` tile beside it instead: put a `,` tile next to the `S` and use a dedicated letter… no new letters. Use an npc with `kind:'sorry'`? No — Sorry is below. Do this: triggers `{'>':'c4_to_daru'}` only, and make the skylight a choice on the Gadrobi-roof arrival node (`c4_roofs_arrive`, fired from `c4_start` after `startExplore`) — "Look through the skylight" (Wits 12). Keep triggers to exits.

Length: 60–80 nodes. Whiskeyjack, Kalam, Quick Ben, Fiddler, Rallick, Crokus (no dialogue — he doesn't stop), Vell, the Andii (no dialogue — they never speak) each get what is theirs. Brisk: a line about what a shield-wall is for. Kettle: a cusser she does *not* throw on a roof and says why. Ohl's list: a name on it he did not put there (aside) or one crossed off (shield). Tuft: Kurald Galain, up close; plant, don't resolve. Ellis: she has been on these roofs before, with the Claw, and knows which planks hold.

Do not touch any other file. Do not invent helpers, scenes, tile letters or sprite kinds not listed. Do not let any canon character die, be wounded by the player, or fail to do what the book has them do. Output only `src/43_chapter4.js`; verify maps (16×12; battles 8×10; start/npc/trigger tiles walkable and reachable; every `go`/`fail`/`talk()` target exists in `CH4.dlg`; every foe id exists) with a small node script, then `node --check`.
