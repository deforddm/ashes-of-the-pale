# Ashes of the Pale

A non-commercial Malazan Book of the Fallen fan RPG for personal play: an original marine squad in the aftermath of the Pale. Turn-based tactical combat, dialogue skill checks, warren strain, Moranth munitions and a Deck of Dragons reading.

Play: https://deforddm.github.io/ashes-of-the-pale/ (installable as an app).

The Malazan world and its canon characters belong to Steven Erikson. This is fan work and is not affiliated with the author or publisher.

## Building

`index.html` is generated. The source lives in `src/` (one file per module, concatenated in filename order) and is built with:

    python3 build.py

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
