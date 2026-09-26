# Ashes of the Pale

A non-commercial Malazan Book of the Fallen fan RPG for personal play: an original marine squad in the aftermath of the Pale. Turn-based tactical combat, dialogue skill checks, warren strain, Moranth munitions and a Deck of Dragons reading.

Play: https://deforddm.github.io/ashes-of-the-pale/ (installable as an app).

The Malazan world and its canon characters belong to Steven Erikson. This is fan work and is not affiliated with the author or publisher.

## Building

`index.html` is generated. The source lives in `src/` (one file per module, concatenated in filename order) and is built with:

    python3 build.py

`tools/` holds the checks used for the polish pass (Node + Playwright): `lint.mjs` evaluates every dialogue node under randomised states, `play.mjs` is a bot that plays the whole game from the title to the finale, and `shoot.mjs` screenshots any state.

Chapters are content modules (`src/40_chapter1.js`, …) registered at boot; each defines its area, battles, foes, gear, a Deck card and its dialogue tree. `docs/` holds the campaign outline and the per-chapter content briefs.

## Versions

- v1.0.0 — vertical slice (the prologue: Varrow's journal under the Pale).
- v2.0.x — art pass, Deck sequence, audio, settings, character sheets; flanking, attacks of opportunity, movement carry-over, range indicator.
- v3.0.x — Chapter One: Pale. Chapter system, levels to 8 with talent picks at 3/5/7, gear slots, survive-objectives and reinforcements, allied units; skill-check die; rule tweaks.
- v3.1.0 — Chapter Two: The Rhivi Plain. Multi-area chapters with travel, open-plain maps with day/dusk/night, Ellis the tracker (sixth squadmate, Tracker's Mark), the Great Raven card.
- v3.2.0 — Chapter Three: Blue Fire. Darujhistan: city streets, the Phoenix Inn, the dig under the Gadrobi crossing, the Claw's dye-shop.
- v3.3.0 — Chapter Four: Assassins. The rooftops at night, Kalam's meet, the Tiste Andii, the Guild and the roof choice.
- v3.4.0 — Chapter Five: The Gadrobi Hills. Lorn and Tool, the barrow, Hairlock's rent, Toc, the Hounds, the Herald card.
- v3.6.0 — Chapters Six and Seven: The Fete, Outlaws — the end of the book. Estate and lakefront maps, the Tyrant, the Adjunct, otataral and mortal fights, the finale and a page per squadmate.
- v3.7.0 — The polish pass. Every chapter proofread and checked for continuity, including every combination of the dead after the alley. Painted portraits, reworked sprites, tiles, backdrops and cards. A rebuilt procedural score and place-by-place ambience. Sturdier battles with hit chances, clearer turns and no clipped sprites. A close-up explore map that follows the sergeant. Proper curly quotes. Updates now wait for a tap instead of reloading mid-fight, and the fonts work offline.
- v3.7.8 — Plays properly on a PC. On a wide screen (1000px and up) the map, battlefield or backdrop fills the left side as big as the window allows, and the header, text, dialogue, unit bar and log sit in a column on the right; nothing needs scrolling at 1366×768. Keyboard: 1–9 pick a dialogue choice or an ability, Space ends a turn or talks to whoever is beside you, arrow keys or WASD walk, J/P/C open the journal, pack and squad, Esc settings, Enter a page's main button. With a mouse: tile outlines and a pointer under the cursor, number badges on choices and abilities, "click" for "tap", and a Keyboard list in Settings. The phone layout is unchanged. `node tools/play.mjs --wide` plays in the PC layout.
- v3.7.7 — A save for every sergeant: more than one person can play on the same device. The title lists each sergeant with their chapter, place, level and when they last played; tap one to carry on. The name prompt only appears for a new sergeant. Switch sergeant from the Save tab; erase one with the × on the title or from Settings; a save code for a sergeant already here asks before it replaces them. The old single save becomes the first sergeant on the list.
- v3.7.6 — Brisk and the sergeant look like different people: Brisk bareheaded with a crown plait, a spear and an oxblood shield, taller on the field; the sergeant bearded under the iron cap with the Nathilog heater shield. Every page change (chapters, cards, the finale, squad sheets) opens at the top.
- v3.7.5 — Chapters 3 to 5 bite harder, tuned with tools/balance.mjs to sit with Chapter 1 and Chapter 6 (about 10% of the squad's health a fight for a careful player, with the odd squadmate down): bigger fights at the Worry Gate and behind the dye-shop, a Guild veteran on the roofs and in the reprisal, Tiste Andii who strike twice, a tougher Jaghut ward and a second wave of barrow dead, and more warren-spawn at the rent.
- v3.7.4 — Chapters 1 and 2 read through for continuity (the city lies south-west beyond the hills, the quorls leave before the wagon rolls, and two dozen smaller fixes). Kettle keeps Chub's cusser, Maud, out of ordinary fights. The Worry Gate map faces west, and the street outside the Phoenix has people on it. The fight at the rent is harder. A glossary at the foot of the journal, and a what's-new note after every update (tap the version number on the title to see it again). tools/balance.mjs plays every fight with a smarter squad.
- v3.7.3 — Continuity. The road from Pale is eleven days everywhere (twelve with the detour), and Whiskeyjack, Brisk, Kettle and Hedge now agree on it. The sealed Moranth crate holds a full crate: twelve cussers and the dud, all the way through to the Chapter 6 vault. The Phoenix's door has moved up the alley into the Daru District, with its own lane. Plus a sweep of smaller slips: eight Bridgeburners, a leftover Gadrobi gate, Tuft's badge months, time spans, directions, and the mule's name before anyone names it.
- v3.7.2 — Maps and book beats. Darujhistan's geography follows the maps: the east road runs through the Worry Gate, and the Phoenix stands on the Daru side of the crossing. Whiskeyjack's squad of nine flies to Lake Azur and crosses by boat. New in the Gadrobi Hills: the Adjunct rides down a small party on the slope while the Fourth watches, and in the night Anomander Rake kills two Hounds that turn on Paran. At the Fete, five dragons leave the Moon's Spawn, and at dawn the priestesses of Gedderone run the streets with wolf fur. Dujek names the Pannion Seer. Tuft is clear of Garrow in the camp scene, and the sergeant and Brisk lead every marching column.
- v3.7.1 — Moranth munitions, closer to canon. Smokers join Kettle's satchel from Hedge's cellar in Chapter 3; smoke blocks every shot into or out of it. Cussers are fired from the crossbow's cradle (the Crossbow Cradle talent, formerly Long Fuse), burners stay strapped down near otataral, and the Chapter 6 vault runs on acid and wax instead of fuse-cord.
