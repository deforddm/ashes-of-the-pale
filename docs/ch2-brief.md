# Chapter 2 — "The Rhivi Plain" — content brief (v3.1)

You are writing the content module `src/41_chapter2.js` for *Ashes of the Pale*, a Malazan Book of the Fallen fan RPG (Gardens of the Moon). Read these first, in this order:

1. `src/14_data.js` — TPL (the five squadmates), FOES, CARDS, the prologue map and NPCS, BATTLES, AREAS, PICKS.
2. `src/16_skill_checks.js` — the prologue dialogue tree (`DLG`) and the helpers. This is the voice.
3. `src/40_chapter1.js` — Chapter 1, the module you are matching in shape and voice. Read every node. Note how it reads prologue flags, how `scene:` moves between backdrops, how battles/foes/gear/card/dlg are declared, and how the chapter closes (`chapterEnd(1, key)`; Whiskeyjack's last orders: "Wagon leaves at dawn. Baggage, Rhivi guide, the Fourth. South, then east, then Darujhistan. We'll be there a week before you. Try not to be interesting on the way.").
4. `docs/outline.md` — the campaign outline.

## What Chapter 2 is

The Fourth rides south across the Rhivi Plain with the Bridgeburners' baggage wagon and a Rhivi guide, while the Bridgeburners themselves have flown ahead by quorl. Six days of grass. Canon fixed points on the plain, all of which happen *near* the Fourth, none of which they can change: Captain Paran and Toc the Younger are riding the same way; the Hounds are still hunting Paran's trail and take him into Shadow (off-screen — the Fourth finds the place afterwards, horses dead, no captain, Toc alone and shaken); Tattersail flees Pale pursued by Bellurdan and dies on the plain in a pillar of sorcerous fire — the light on the plain — and the Rhivi find something in the ashes they carry away (Silverfox; never named, never shown, the Fourth sees only that the Rhivi are carrying something with great care); Crone, Anomander Rake's Great Raven, passes over and talks to whoever is beneath her; a Tiste Andii patrol crosses the Fourth's path at night; far off, a dust-line that the guide says is "a woman and a thing that is not a man" — Adjunct Lorn and Tool — which the Fourth never reaches. Nobody canon dies or lives because of the player.

**The choice that matters:** on the fourth night the light rises on the plain, two hours' hard ride west. The guide says it is a mage dying. Whiskeyjack's timetable says east. Ride to the light = arrive at the ashes with the Rhivi already there (a Rhivi outrider confrontation that can be talked past, then the aftermath: Tattersail's fall, the Rhivi carrying something away, Crone above), Tuft +2 (she knows who it was), Brisk −2 (orders), `S.f.c2_key='light'`, the wagon arrives late (`S.f.c2_late=1`, Whiskeyjack's regard −1 in Chapter 3). Keep the timetable = the light burns in the west all night and nobody sleeps; Brisk +1, Tuft −2, Ohl −1 ("someone was dying and we counted rations"); `S.f.c2_key='road'`; the Tiste Andii patrol scene happens instead (they were watching the light too). Either way the chapter ends at the edge of the Gadrobi Hills with Darujhistan's blue glow on the horizon.

**Ellis, the recruit.** Toc the Younger's scout — Claw-trained, one eye already lost to a fire at Pale (Toc's wound in the book is his own; Ellis is an original character standing in the margin, so give her a different scar: a burned hand she keeps gloved). She is found at the Hound site with Toc, holding a dying horse's head. The player can help her end the horse and bury it (Might 11 or Ohl's tea — either works, Ohl's is kinder), after which Toc, who has to ride on alone to find the captain, tells her to go with the Fourth: "The Claw's done with you. Be done with them." She joins if the player says yes (`recruit('ellis')` — the engine adds her to the squad and handles her sheet, sprite, portrait and talent). If the player refuses her, `S.f.c2_ellisRefused=1` and she is gone. If the player was `S.f.clawFavour` from Chapter 1, she is wary of the sergeant and says so; if `S.f.cadreTrust`, she has heard of them. She is quiet, exact, and funnier than she looks. She does not trust Tuft's Deck and says so once.

Ellis's numbers (already defined in the engine as `TPL.ellis`; you only *write* her): ranged (bow, reach 5), fast (move 6), fragile (13 health). Ability `mark` — Tracker's Mark: an enemy within 5 takes +2 damage from every hit for two rounds.

**Prologue and Chapter 1 state to honour:** `S.ending`, `S.f.marked`, `S.f.cadreTrust`, `S.f.clawFavour`, `S.f.c1_key` ('line' | 'claw'), `S.f.wjRegard`, `S.f.c1_refusedKnife`, `S.f.c1_accFought`, `S.f.c1_plant` (Tuft's badge is known), `S.f.knowTruth`. Loyalty pips `S.loy[id]` −3..3 (Ellis's starts at 0 when she joins; `S.loy.ellis` exists after `recruit`).

## Beats (in order; areas connect by exit tiles)

1. **Chapter card + intro** (`CH2.intro`, three short paragraphs: the wagon, the guide, the grass, the quorls gone).
2. **Area `plain_road`** (day): the wagon and the Rhivi guide **Sethand** (original; a Rhivi of the Mhybe's clan, dry, unimpressed by Malazans, knows the barrows). Talk to him: the road, the barrows ("do not"), the dust-line. Brisk counts rations at the wagon (`W` tile). A barrow (`M` tiles) the player can poke at: Wits 12 to notice it has been opened from inside; go in = `startBattle('barrow')` (barrow wights, 3–4, an ordinary fight, xp 140) and a gear find. Exit `>` east to the Hound site.
3. **Area `hound_site`** (dusk): two dead horses, a third dying, Toc the Younger sitting with his back to it, Ellis holding its head. The horse; Toc's account (a Hound came out of the ground, the captain went *into* it, "I've served the Claw nine years, Sergeant, and I've never seen the Empire lose an argument that fast"); the offer of Ellis; Toc rides on. A Wits 13 check on the ground reveals the Hound's prints stop mid-stride. Exit `>` east to the ridge camp.
4. **Area `ridge`** (night, the fourth camp): fire, tents, the guide, and — at some point after the player has talked to Sethand here — the light rises in the west (a trigger, set `S.f.c2_light=1`). The choice. Then either `light_ride` (a `scene:'plain_night'` sequence: outriders `startBattle('outriders')` avoidable by Guile 13 or Sethand's word if his loyalty was earned; the ashes; Crone) or `road_watch` (the Tiste Andii patrol: `scene:'plain_night'`, three tall figures with silver hair who ask one question and answer none; a Wits 12 check to understand they are afraid of what they saw; no fight). Then Crone passes over on both paths (one node, variant lines).
5. **Area `hills_edge`** (day, the last morning): the Gadrobi Hills, the blue glow of Darujhistan far south-east, the dust-line finally described by Sethand. If Ellis is with them, a short Ellis beat here (she knows Darujhistan; "the Claw has a house there"). Chapter close: `chapterEnd(2, key)` with `key` ∈ `light` | `road`. Set `S.f.c2_done=1`.

Deck: one draw, offered by Tuft at the ridge fire before the light (same pattern as Chapter 1: a node calling `cardSequence(()=>talk('c2_card'))`; `S.card` from `['raven','raven','raven','oponn','obelisk','knight']`).

## Schema — produce exactly this in `src/41_chapter2.js`

```js
/* ============ chapter 2: The Rhivi Plain ============ */
const CH2 = {
  title:'The Rhivi Plain', number:'Two',
  intro:{loc:'The Rhivi Plain', sub:'Genabackis · six days south of Pale', cap:'…', paras:[`…`,`…`,`…`], go:'Ride', node:'c2_start'},
  areas:[  // several explore areas this chapter. Each has the same shape as Chapter 1's `area`. Tile letters for the plain:
    //   . grass   , tall grass   r rock   M barrow stone   W wagon   F fire   = tent   x stake   > exit east (walk onto = the node in triggers)   < exit west   # impassable (a cliff, a drop)
    { id:'plain_road', title:'The Rhivi Plain · the wagon road', sub:'Day three', hint:'Tap ground to move · tap a figure to talk · east is the way', decor:'plain',
      map:[ 16 columns × 12 rows ], walk:'.,', triggers:{W:'c2_wagon', M:'c2_barrow', '>':'c2_to_hound'}, start:{x:2,y:6},
      npcs:[ {id:'sethand', name:'Sethand', kind:'rhivi', x:4, y:5, node:()=>…, fresh:()=>…}, … ] },
    { id:'hound_site', decor:'plain_dusk', … npcs: toc (kind:'toc'), ellis (kind:'ellis', show:()=>!S.f.c2_ellisJoined && !S.f.c2_ellisRefused) … },
    { id:'ridge', decor:'plain_night', … },
    { id:'hills_edge', decor:'plain', … } ],
  battles:{ barrow:{…}, outriders:{…}, },   // same shape as Chapter 1 battles; add `open:true` (open ground, no tunnel walls)
  foes:{ wight:{name:'Barrow wight', sig:'w', hp:12, ac:13, atk:4, dmg:[1,8,1], rng:1, mv:4, init:1, verb:'claws at'},
         rhivi:{name:'Rhivi outrider', sig:'R', hp:12, ac:13, atk:4, dmg:[1,6,2], rng:4, mv:6, init:3, verb:'looses at'} },
  gear:{ 3–4 items: e.g. a barrow torc (trinket), a Rhivi horn bow for Ellis or Kettle (weapon, rng +1), Toc's spare cloak (armour), … },
  card:{ id:'raven', name:'The Great Raven', house:'Unaligned', hue:'#6a6f7a', txt:`…`, fx:'Your squad rolls +1 initiative and sees one tile further this chapter.' },  // engine effect is +2 initiative; keep the fx text honest: use 'Your squad rolls +2 initiative this chapter.'
  dlg:{ c2_start:()=>({…}), … }
};
```

Rules for `dlg` nodes: same as Chapter 1. Helpers available: `loy(id,±n)`, `note(text,'good'|'bad')`, `gainXP(n)`, `startBattle(id, opt)`, `talk(id)`, `startExplore(areaId)` (moves the squad to that area and puts them on its `start` tile), `gain(gearId)`, `recruit('ellis')`, `chapterEnd(2, key)`, `cardSequence(cb)`, `S.silver`, `S.inv.*`, `AUDIO.play(name)` for 'coin' | 'click' | 'growl' | 'heal'. Scenes for `scene:` — `'explore'` (back to the map), `'plain'` (day, grass to the horizon, the wagon), `'plain_dusk'`, `'plain_night'` (stars, and when `S.f.c2_light` is set, a pillar of light on the western horizon), `'fire'` (a camp fire — reused from Chapter 1). `SQUAD()` returns the squad ids (includes 'ellis' after she joins) — use `SQUAD().includes('ellis')` to gate her lines. `NAME('ellis')` is 'Ellis'.

Exit tiles: walking onto `>` fires its trigger node; that node should have a one-line text and a choice whose `go` is `()=>startExplore('<next area id>')`, plus a "Not yet" choice.

Length: 60–80 nodes. Every canon character (Toc, Crone, the Andii) gets at least one line that could only be theirs. Sethand and Ellis are originals: give each a voice. Brisk gets a beat about her brother (a Second Army badge in the barrow, wrong regiment). Kettle names something. Ohl's list gets a line at the ashes. Tuft's arc: she recognises the light for what it is before the guide says it; plant, don't resolve.

Do not touch any other file. Do not invent helpers that are not listed. Do not let Paran or Toc die. Output only `src/41_chapter2.js`; syntax-check with `node --check` before you finish.
