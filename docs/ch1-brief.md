# Chapter 1 — "Pale" — content brief (v3.0)

You are writing the content module `src/40_chapter1.js` for *Ashes of the Pale*, a Malazan Book of the Fallen fan RPG (Gardens of the Moon). Read these first, in this order — they are the voice and the schema:

1. `src/14_data.js` — TPL (the five squadmates: bios, banter, traits, rel), FOES, CARDS, PALE map + NPCS, BATTLES (the two prologue fights).
2. `src/16_skill_checks.js` — the prologue's whole dialogue tree (`DLG`), `check()`, `talk()`, `sceneShell()`. This is the voice. Match it exactly: short paragraphs, dry marine humour, grimdark restraint, no exclamation marks in narration, dialogue in double quotes, italics with *asterisks*, `{sgt}` for the sergeant's name. Canon characters speak in their own book voices (Whiskeyjack tired and exact; Quick Ben amused and layered; Kalam quiet and physical; Paran stiff, new, noble-born and knows it; Tattersail warm, blunt, frightened underneath).
3. `docs/outline.md` — the campaign outline (Chapter 1 row and "The deal").

## What Chapter 1 is

Two nights after the prologue. Captain Ganoes Paran has arrived at Pale to take command of the Bridgeburners. The Fourth Squad (the player's) is attached to Whiskeyjack for the Darujhistan job, but the Black Moranth will not carry a sixth squad, so the Fourth will ride south overland with the baggage (that is Chapter 2 — set it up, don't play it). Tonight the Hounds of Shadow come through the tent lines hunting Paran. Canon fixed points: Paran is stabbed by Sorry (off-screen, tonight, before the Hounds), carried to Tattersail's tent; the Hounds Gear and Rood come; Paran wounds Gear with his sword; the Hounds withdraw. Hairlock (the puppet, Tattersail's "luggage") is in her tent and is alive in a way that should not be possible. Nobody canon dies or lives because of the player.

**The choice that matters:** when the tents burn, two voices give the Fourth orders at once — Tattersail (from her tent: "the line, Sergeant, hold the line by the cadre row") and the grey cloak (the Claw from the prologue: "leave the mage; seal the cadre tent and hold the crate"). Following Tattersail = the harder Hound fight (survive 4 rounds, second Hound arrives round 2), Tuft +2, the cadre trusts the Fourth (`S.f.cadreTrust=1`). Following the Claw = a 3-round fight with the Claw's own people helping (`allies` — see schema), Tuft −2, Brisk −1, `S.f.clawFavour=1`; the Claw "acquires" something from the tent (a page in Varrow's hand, if the journal survived; otherwise Hairlock's crate lid). This sets Tuft's road, which runs to the Fete (Chapter 6) — plant, don't resolve.

**Prologue state to honour** (all in `S.f` / `S.ending`, set by the prologue — read `16_skill_checks.js` to see how each is set):
- `S.ending` ∈ given | told | burned | claw — what happened to Varrow's journal. Tattersail's greeting, Whiskeyjack's briefing and the Claw's manner all change with it. `claw` = the Fourth handed it over; `told` = Tattersail and the player know the truth; `burned` = Tattersail lit it herself.
- `S.f.marked` — a Claw has the sergeant's name. If marked AND the player follows Tattersail tonight, an optional post-Hound ambush fires: "the Claw's accounting" (2–3 `assassin` foes at the picket line; can be avoided with a Guile 14 check or Kettle's munitions bluff).
- `S.f.decoy` — the Claw has Kettle's munitions ledger. He returns it tonight, with a comment.
- `S.f.knowTruth` / `S.f.partial` — the underlined line / the name Tayschrenn. Tuft's plant scene depends on it.
- `S.f.clawFooled`, `S.f.noisy`, `S.f.knowDeserters`, `S.f.gaveClaw` — small callbacks only.
- Loyalty pips `S.loy[id]` −3..3 — a line of banter here and there should read them (`S.loy.brisk >= 2` etc.).

## Beats (in order; the player can wander between the first three)

1. **Chapter card + intro narration** (I render the card; you write `CH1.intro` — three short paragraphs, second person, like `showIntro()` in `29_title_intro.js`).
2. **Report to Whiskeyjack** at the Bridgeburners' fire (Quick Ben and Kalam beside him). The briefing: Darujhistan, the Moranth, the Fourth rides overland. A Wits check to notice Quick Ben is reading Tuft; a Guile check to get Kalam to say what he thinks of the new captain. Whiskeyjack's regard for the Fourth is set here (`S.f.wjRegard` −1/0/1) by how the sergeant reports the tunnels.
3. **Paran walks the lines.** New captain, noble, trying. Three choices: salute properly (+nothing, he notices), tell him the squad's count honestly (Might 11 — hold his stare), or Ohl offers him tea. Ends with Paran walking toward the cadre row, and a line that lands only in hindsight (he is about to be stabbed).
4. **Tattersail's tent.** Greeting by `S.ending`. Hairlock is on the crate — a Wits 12 check to notice the puppet's head turned. Tuft goes still; Tattersail asks the sergeant to step outside with her: the Tuft plant (she has recognised the cadre badge Tuft does not wear). Pell has restocked (shop node, same shape as the prologue's `pell` — silver prices: sharper 6, burner 5, salve 3; he now also has ONE `cusser` at 14 silver if `S.silver >= 14`).
5. **The Hounds.** Trigger when the player has done 2 and 4 (or 2, 3 and 4). Night goes wrong: a scream from the cadre row, dogs that are not dogs. The orders choice (above). Then `startBattle('hounds_line', {...})` or `startBattle('hounds_claw', {...})`.
6. **After.** Gear limps off with a sword-wound. Paran lives. The Claw returns/keeps what he took. The optional ambush (if marked and Tattersail chosen). Whiskeyjack's last orders. Chapter close: `go:()=>chapterEnd(1, key)` with `key` ∈ `line` | `claw` (which orders you followed).

## Schema — produce exactly this in `src/40_chapter1.js`

```js
/* ============ chapter 1: Pale ============ */
const CH1 = {
  title:'Pale', number:'One',
  intro:{loc:'The Pale', sub:'Genabackis · two nights later', cap:'…one line under the picture…', paras:[`…`,`…`,`…`], go:'Walk the lines', node:'c1_start'},
  area:{ id:'pale_night', title:'The Pale · the camp at night', sub:'Bridgeburners\' fire to the east · cadre row north',
    hint:'Tap ground to move · tap a figure to talk',
    // 16 columns x 12 rows. # rubble  . ground  , ash  = tent  C cadre tent (Tattersail's; walking onto it = talk)  F fire  W wagon (Pell)  P burial pit  x picket stake  B Bridgeburners' fire (walk onto = Whiskeyjack)
    map:[ "################", "#..C..=..=....P#", …12 rows… ],
    walk:'.,', triggers:{C:'c1_tent', B:'c1_wj', W:'c1_pell'},
    start:{x:8,y:9},
    npcs:[ {id:'paran', name:'Captain Paran', kind:'paran', x:6, y:5, node:()=>S.f.c1_paran?'c1_paran_again':'c1_paran', show:()=>!S.f.c1_hounds, fresh:()=>!S.f.c1_paran},
           {id:'wj', name:'Whiskeyjack', kind:'wj', x:12, y:8, node:()=>…}, {id:'qb', …kind:'qb'}, {id:'kalam', …kind:'kalam'},
           {id:'tat', name:'Tattersail', kind:'tat', …}, {id:'pell', …kind:'pell'}, {id:'claw', kind:'claw', show:()=>…} ] },
  battles:{
    hounds_line:{title:'The cadre row', warrenText:'Shadow bleeds through the tent lines · Meanas howls', warren:{meanas:1.4,denul:0.8}, dark:true, music:'dark',
      map:[…10 rows of 8…], party:[[x,y]×5], foes:[['hound',3,1]], xp:180, after:'c1_after_line',
      objective:{type:'survive', rounds:4, text:'Hold the cadre row for four rounds.'},
      waves:[{round:2, foes:[['hound',6,0]], text:'A second Hound comes over the tents. Rood.'}] },
    hounds_claw:{ … rounds:3, allies:[['assassin',1,9],['assassin',6,9]] (Claw's people fight for you this battle only) … after:'c1_after_claw' },
    accounting:{title:'The picket line', … foes:[['assassin',…]×3], xp:120, after:'c1_after_accounting'} },
  foes:{ hound:{name:'Hound of Shadow', sig:'H', hp:44, ac:15, atk:6, dmg:[2,6,2], rng:1, mv:6, init:4, boss:true, verb:'tears at'},
         assassin:{name:'Claw', sig:'C', hp:14, ac:14, atk:5, dmg:[1,8,2], rng:1, mv:5, init:4, verb:'knifes'} },
  gear:{ // 3–4 items found or given in this chapter. slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone. Numbers are small (+1/+2).
    heater:{name:'Second Army heater shield', slot:'armour', who:['brisk','sgt'], ac:1, line:'A heater shield with the Second\'s sigil burned off. Brisk did not ask whose.'},
    … },
  card:{ id:'hounds', name:'Hounds of Shadow', house:'High House Shadow', hue:'#7a6a9a', txt:`…Tuft's line on drawing it…`, fx:'Your squad moves +1 tile this chapter.' },
  dlg:{ c1_start:()=>({sp:'…', txt:`…`, ch:[…]}), … every node … }
};
```

Rules for `dlg` nodes: same shape as the prologue `DLG` (`sp`, `txt`, optional `html`, `after`, `scene`, `fx`, `ch:[{t, go, check:[stat,dc,who?], fail, req, fx, tag}]`). `go` is a node id string or a function. Available helpers: `loy(id,±n)`, `note(text,'good'|'bad')`, `gainXP(n)` (returns true on level-up — note it like the prologue does), `startBattle(id, opt)`, `talk(id)`, `startExplore()`, `gain(gearId)` (adds a gear item to the squad's kit and notes it), `chapterEnd(1, key)`, `S.silver`, `S.inv.*`. Scenes for `scene:` — `'explore'` (back to the map), `'camp_night'` (tent lines under a bruised sky), `'tent'` (inside Tattersail's tent, candle and cards), `'fire'` (the Bridgeburners' fire). Set `S.f.c1_*` flags for everything the journal or later chapters might need, and set `S.f.c1_hounds=1` when the Hounds sequence begins, `S.f.c1_done=1` at chapter end.

Deck: the player may draw once this chapter (Tuft offers at the Bridgeburners' fire, before the Hounds). Reuse the prologue pattern: a node that calls `cardSequence(()=>talk('c1_card'))` and a `c1_card` node that sets `S.card` from `['hounds','oponn','knight','assassin']` (weighted to `hounds` 50%) and shows the inline card like the prologue's `card` node.

Length: aim for 45–65 nodes, roughly the prologue's density ×2.5. Every canon character gets at least one line that could only be theirs. Brisk's brother (Tav) gets one beat at the burial field (`P` tiles are walkable; walking onto one triggers `c1_pits` once). Ohl's list gets one line. Kettle names the cusser. The Claw is never named as a Claw by anyone but the player's squad, and never confirms it.

Do not touch any other file. Do not invent helpers that are not listed. Do not resolve Tuft's arc. Do not let Paran die. Output only `src/40_chapter1.js`; syntax-check it with `node --check` before you finish (wrap-free: it is a plain script, not a module — `const CH1 = {...};` at top level is fine).
