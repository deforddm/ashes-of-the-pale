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
- v3.0.0 — Chapter One: Pale. Chapter system, levels to 8 with talent picks at 3/5/7, gear slots, survive-objectives and reinforcements, allied units.
