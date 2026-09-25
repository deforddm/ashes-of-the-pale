# Ashes of the Pale: story bible (prologue to Chapter 5)

For the writers of Chapter 6 (The Fete) and Chapter 7 (Outlaws). The sources are `src/16_skill_checks.js` (prologue `DLG`), `src/40_chapter1.js` to `src/44_chapter5.js`, `src/14_data.js` (TPL), `src/37_chapters.js` (CHEND/CHTEASE) and the engine. Quotes are verbatim; `*x*` is the game's own emphasis markup.

**Notation.** `[if X]` means the line only appears when X is true. "Always" means every playthrough reaches it. A **key** is the value passed to `chapterEnd(n, key)` and stored in `S.chapters[n]` and `S.f.cN_key`. Loyalty is `S.loy[id]`, clamped to −3..+3.

---

## 0. At a glance

| Ch | Key flag | Values | Main consequences |
|---|---|---|---|
| Prologue | `S.ending` = `S.chapters[0]` | `given` / `told` / `burned` / `claw` | `knowTruth`, `partial`, `marked`, `decoy`, `clawFooled`, `gaveClaw` |
| 1 Pale | `S.f.c1_key` | `line` / `claw` | `cadreTrust` / `clawFavour`; `c1_acc*` (line + marked only) |
| 2 Rhivi Plain | `S.f.c2_key` | `light` / `road` | `c2_late`, `c2_out*`, Ashes vs Andii visit; Ellis: `c2_ellisJoined` / `c2_ellisRefused` |
| 3 Blue Fire | `S.f.c3_key` | `report` / `refuse` | `c3_told` + `clawFavour` + 40 silver / `marked` + alley knives; `c3_wjTold` |
| 4 Assassins | `S.f.c4_key` | `shield` / `aside` | `c4_vell`, `c4_guildKnows` / `c4_seen`, `c4_tuftDark`, `c4_reprisalFought` |
| 5 Gadrobi Hills | `S.f.c5_key` | `through` / `hold` | With Ellis: `c5_ellisThrough` (she is gone) / `c5_ellisHeld`. Without Ellis: `c5_tuftMarked` / `c5_tuftHeld` |

**Where the story stands at the end of Ch5.** Dawn on the long ridge in the Gadrobi Hills, three days' walk east of Darujhistan. Toc the Younger has been pulled through Hairlock's rent. Hairlock was torn apart by two Hounds of Shadow. Lorn and Tool have gone to the city. Raest is waking under the barrow (*thud*, … *thud*). Paran has ridden ahead and asked the Fourth to "Tell Whiskeyjack I'm coming… Tell him about Toc. I'd rather he heard it from someone who saw." The Rhivi bundle is on the ridge, and the woman holding it is looking west toward the city. Crone has flown west. CHTEASE 5: "everyone the Fourth has met is going to be at Lady Simtal's."

**Squad size.** Possible squads are 5 (Ellis refused in Ch2, or went through in Ch5) or 6. The sergeant and the four TPL veterans can never leave. `unrecruit('ellis')` sets `S.f.ellisGone=1`.

---

## 1. Per-squadmate arcs

### The Sergeant (`sgt`, name `S.name`, default "Hask")
- **TPL.** Untan, eleven years a marine, three under Dujek. Keeps the pay ledger. The quest line: "The Fourth came through the siege with all five still breathing. Somewhere in Onearm's Host, somebody has noticed." Carries a Second Army whistle "no longer used" and a knife "nobody has seen drawn".
- **Gender.** The prose is second person and never gives the sergeant a gender. The one slip is Whiskeyjack's "all five of his squad" in `c1_wj_boast`. Keep it neutral.
- **Recurring beat: everyone counts the Fourth.** Tattersail: "You came back with all five," she says. "That's a nice touch." Paran: "yours is the first one that came with a face attached." Whiskeyjack: "Sergeant." As you turn. "All five. Keep doing that." `[wjRegard>0]` Whiskeyjack, the Andii, Ellis and Sethand all count as well. The chapter closes repeat "You count twice."
- **The sergeant's name on paper, and who holds it.**
  - The prologue grey cloak, if `S.f.marked`: "I know the name now. {sgt}. It's a good name… Try to keep it attached." (`c1_claw`)
  - Pallick's ledger. `c3_trueName` means the real name was given, and Madryn quotes it back ("Pallick sends his regards… Unta, from the vowels"). `c3_falseName` means a name "off a headstone in Unta", and that is the name Vell learns in Ch4. `c3_paid` means five silver and no name.
  - Crone knows the name if `c2_croneSaw` (CHEND 2: "A Great Raven knows the sergeant's name now").
  - The Tiste Andii know the squad's faces if `c4_seen`.
- **Whiskeyjack's report formula.** "in order, without anything in it that isn't so". It was set up in Ch3 (`c3_wj_good`), used at the Ch4 dawn debrief, and ends Ch5 as the next job: "a report to give in order".

### Brisk (`brisk`): brother Tav, Second Army
- **TPL.** From Cawn. Her brother "Tavore-by-no-relation, called Tav" joined the Second a year before she joined the Third. Quest: "He isn't on any list yet, living or dead. Brisk checks the pits when nobody is watching." She carries "A letter from Tav, three years old, sealed."
- **Ch1, burial field** (`c1_pits`, optional, `S.f.c1_pits`). She finds a heater shield with the Second's sigil burned off: "Tav wrote a letter. Three years ago. I never opened it. I thought I'd open it when I found him… If I open it now it means something."
  - Take it: `gain('heater')`, brisk +1. "Not his… His had a notch top left. This one's clean."
  - Leave it: `S.f.c1_leftShield`, ohl +1, brisk −1.
  - Wait: `S.f.c1_waitedBrisk`, brisk +1. "He's not in this one." She says it to the pit, not to you. "I'd know."
- **Ch2, barrow** (optional fight, `c2_barrowFought`). She finds a Ninth Regiment badge: "Tav was Fourth. This isn't his."
  - Keep it: `S.f.c2_badge`, `gain('secondbadge')`, brisk +1. She puts it "inside her gorget, where the letter is": "He could've known Tav. Marched with him. Somebody did."
  - Leave it: brisk −1, ohl +1. "He stays with the ones that killed him. That's the Second all over."
  - That night `[c2_badge]`: "If Tav's dead, I want to have known it before somebody tells me. I don't know how that works. I'm working on it."
- **Ch3** (`c3_wagon`). `[c2_badge]` The badge is now on a thong round her wrist: "Tav'd never desert. I'm looking anyway. It's a habit. Like the count." Otherwise: "A city this size… has a pay-ledger somewhere with every name in it."
- **Ch5** `[c5_ellisThrough]` "I said it to Tav, the day he joined the Second. *We don't leave people.*"
- **Status.** Tav is **unresolved**: not found, not on any list, and the letter is **still sealed**. The Ch7 regroup with Dujek's Host (the remains of the Second) is the natural place to pay it off.
- **Her other arc: the ledger and "we don't leave people".** She keeps the ration count and writes the chapter's cost into it: "Mule's Pell." / "One day lost, west, on the sergeant's order." / `[report]` "Forty silver, received. I won't write what for. I'll know." / `[aside]` "I wrote *stood aside*… I didn't write [by order]. It'd be true, and it'd be a lie."
  - The phrase **"we don't leave people"** first appears in Ch5. `[through, Ellis]` "We don't leave people… Nine years. That's the whole of it." A breath. "You just did." Then: "I don't know if you were wrong. That's what I can't forgive. I don't *know*."
  - `[c5_briskHeld]` She tackles Ellis unbidden, and only if `S.loy.brisk>=2`: "Claw-trained. Good elbow." / "I've been not-looked-at before. It's what the shield's for."
- **Shield-wall theme.**
  - `[shield]` "That's what a line is for… Not the ones behind it that'd have lived anyway. The ones that wouldn't." She keeps a bit of the bend in the rim: "So I know which dent was for something."
  - The Nathilog story: four of nine lost holding a line "in front of an empty tent".
  - `[aside]` "Whiskeyjack said watch… We watched." In the reprisal alley: "I'd have stood".
- **Loyalty.** Up for caution, discipline and the line. Down for Claw deals (`c3_report` −2), `c2_ride` −2 and `aside` −2.

### Kettle (`kettle`): the Moranth debt, the cussers, the spoon
- **TPL.** Falari; ran powder for a smuggler; learned munitions from Chub, "who lost three fingers". Quest: "Owes a Moranth quartermaster something she won't name… keeps checking the sky for quorls." Gear: "A spoon she will not explain."
- **The Moranth debt has never been touched in the prologue or Ch1–5.** Quorls come up only as the Black Moranth flying the Bridgeburners south (Ch1–2). Tuft `[loy≥2]`: "The quorls went south-east. Not south." This is **fully open**, and her level-3 talent "Quorl Signal" (a Moranth drop) is a natural hook for it.
- **The spoon.** It appears only in `c1_claw` `[decoy]`: "a spoon listed under *equipment*". It is still unexplained.
- **Named cussers.**
  - **Maud** is her starting cusser (`c1_start`: "The cusser's called Maud, if anyone's asking." Nobody is.).
  - **Gerrun** is bought from Pell for 14 silver (`S.f.c1_cusserSold`): "After a sapper. He's dead. It's a compliment."
  - **Hedge's cusser** is gifted in Ch3 (`c3_work_hedge`, `S.inv.cusser += 1`, always): "Don't name it; I can see you want to name it."
  - **Chub's cusser.** In Ch5 she says the one she has "carried since Nathilog" was Chub's: "*keep it for the one that matters, girl, you'll know it*". The text never says which named cusser this is. Maud is the likeliest.
  - Current count is `S.inv.cusser`, which may be 0 because cussers can also be thrown in battle.
- **Arc in Ch1–5: permission to throw.**
  - Ch1 `[c1_accBluffed]`: she walks out with the cusser, "This is Maud/Gerrun," "Say hello." (kettle +1, brisk −1; "Never. Again.")
  - Ch2: she names the mule **Pell** (`c2_muleNamed`, kettle +1): "It does the same face." She walks eleven days beside the Bridgeburners' sealed crate without opening it.
  - Ch3: she opens the crate at last. `c3_kettleSeal`: Whiskeyjack says "Noted… Open it." Then: "Four," she says at last, to Whiskeyjack. "Sir. I *told* them."
  - Ch4: she refuses to throw on a roof (`c4_kettleNo`): "I throw that up here and I don't take three knives off a roof. I take the Gadrobi District off the map… I'm telling you why so you don't think I've gone soft."
  - Ch5: Whiskeyjack says yes ("Throw it at anything else you like"). `[c5_cusserUsed]` She throws it at the barrow wards: "That's awful," she says. "Isn't it. That's an awful thing to feel." / "It was *beautiful*, though. Wasn't it." / "I don't think it mattered, Sergeant. I think I just couldn't carry it any more." If she had a cusser and didn't throw it: "Maybe I've gone Fiddler."
- **Ellis.** They trade arrows for fuse-cord. `[c5_ellisThrough]` "She had my fuse-cord… Two lengths. She never said what for." This is a planted object for Ellis's return.
- **The decoy ledger.** `[S.f.decoy]` Her munitions ledger went to the Claw in the prologue. It comes back **only if** she talks to the grey cloak in Ch1 (`c1_claw`). If `decoy && !c1_claw`, the Claw still has it.

### Tuft (`tuft`): the High Mage, the cadre, Shadow. Her arc resolves at the Fete.
- **TPL.** A Mouse Quarter foundling; joined the cadre at sixteen; "a season attached to the High Mage's staff"; transferred out "with a letter that said nothing". She "goes very still when someone says 'High Mage'", "never draws a card for herself", "sleeps with a lamp lit" and carries "a cadre badge she does not wear".
- **Prologue.**
  - Reading the journal gives `knowTruth` ("*Moved before the Spawn attacked. Not after.*… Tuft stops breathing"). A failed read gives `partial` (the name *Tayschrenn*).
  - `final_told` tuft +1, `final_burn` tuft −1, `claw_took` tuft −2.
- **Ch1.**
  - Quick Ben (`c1_qbTuft`, a Wits 12 check): "How's the High Mage's staff these days?"
  - **Tattersail's plant** (`c1_tuft_plant`, always, so `S.f.c1_plant` is effectively always 1): "I sewed one like it onto a girl's collar sixteen months ago, on the High Mage's staff… He doesn't let people leave, Sergeant. He let her. I'd like to know what he thinks he still has of hers." The paragraph after that varies by `knowTruth` / `partial` / neither. Three possible replies:
    - `c1_plantDeny`: "don't ask her why. Ask her who taught her."
    - `c1_plantMarine` (tuft +1): "there's a card in her deck she's never drawn for herself. When she does, be standing next to her."
    - The ask reply (no flag): "it'll come looking like a favour or an order, and it'll come from someone who outranks both of us. Do nothing until you've asked her."
  - At the close. `[line]` "Sergeant." She doesn't turn round. "Thank you." `[claw]` "One of them knew my name… Not the one you'd think. The other one." That grey-cloak Claw is **still unexplained**.
- **Ch2.**
  - She knows the light is Tattersail before anyone says it: "That's her… that's Tattersail. That's Telas".
  - `[light]` At the ashes (`c2_ashesTuft`) she names Bellurdan and Nightchill: "Somebody sent a man who didn't want to go. I was on that staff." Her replies set `c2_tuftSteadied` / `c2_tuftStood` (+1 each) or "Up" (−1).
  - `[light]` She **starts wearing the cadre badge** (`c2_close`). `[road]` She walks in the tall grass and doesn't wear it.
  - Refusing her draw (`c2_noCard`, after `c1_noCard`): "That's twice."
- **Ch3.**
  - Murillio notices the badge `[light]`: "To somebody who's dead." Otherwise he notices the unfaded mark where it was.
  - **Kruppe's sentence** at the door (`c3_kruppe`, optional): the Rhivi carry "a thing out of a fire that was a woman… is a child now in a blanket, and will be a woman again sooner than any child should, and will *remember*". Tuft goes white.
  - `c3_askedTuft`: "When I know, you'll be the first, Sergeant. I promise." `[loy≥2]` "She's not gone. That's what he meant." **The promised explanation is still owed.**
  - `[report]` tuft +1: "You kept a door open."
  - Sorry `[no Ellis]`: "There's something in her… Like a hand in a glove."
  - Magi card: "It's for me."
- **Ch4: Kurald Galain.**
  - At the Andii slaughter she feels "longing". In `c4_vell_tuft`: "I want you to know I *want* it to look at us, and that's why you shouldn't listen to me."
  - She takes the **Andii cloak** on both paths ("It doesn't quite take the lamplight").
  - `[aside]` tuft +2, `S.f.c4_tuftDark`: "It knows what I am now. It knows my face… I'm not frightened." / "It's a *house*, Sergeant. Somebody lives in it… somebody in the house came to the window." / "Don't tell Ohl. He'll write it down."
  - `[shield]` tuft −1: "That was a fool with a shield. It got lucky, and the luck had a name, and the name was in a *sack*."
  - Herald drawn in Ch4: she keeps that card "in her other sleeve, by itself". **No flag records this** because `S.card` resets every chapter.
- **Ch5: otataral and Shadow.**
  - Near Lorn: "There's a hole in the world, Sergeant… and she's carrying it."
  - Near the bundle: "don't let me go near that."
  - **Tuft's choice only exists if Ellis is not in the squad.**
    - `[through]` She goes to the threshold. A Hound smells her hand, and she comes back with a grey lock at the left temple: `S.f.c5_tuftMarked`, tuft +2, ohl −1, brisk −1. "I think it'll know me now… I think *someone* will." / "I think I'd rather be nothing than be *noticed*. And I think it's too late to choose." / Meanas comes "*easier*… somebody's propped it." Ohl: "Something's got a thumb on her… Like a man holding his place in a book."
    - `[hold]` `S.f.c5_tuftHeld`, tuft −2, brisk +1: "Yes, Sergeant." / "I hate that you knew."
  - Ch5 close (not marked): "Somebody sent them… We weren't the only ones watching this hill."
- **Plants for the Fete. None are resolved.**
  - Tayschrenn and "what he thinks he still has of hers".
  - The card she has never drawn for herself.
  - `c4_tuftDark` (Kurald Galain looked back).
  - `c5_tuftMarked` (Shadow's thumb). **It is mutually exclusive with Ellis being in the squad at Ch5.**
  - Tattersail reborn (the bundle).
  - Her promise to explain.
  - Her fear of the otataral glove.
  - CHEND says Tuft calls the dark and the threshold "polite" (the `c4_tuftDark` and `c5_tuftMarked` extras). **She never says "polite" in dialogue.** Ch6 can give her the word.
- **Deck-refusal tally.** `c1_noCard`, `c2_noCard`, `c3_noCard`, `c4_noCard`, `c5_noCard` (plus the prologue's `noCard`). By Ch4–5 "She's past saying it."

### Ohl (`ohl`): the list of the dead
- **TPL.** An Ehrlitan temple healer who served the Second under Dujek. "The list. Oilcloth. Two hundred and eleven names." Quest: "He has not added a name from the Fourth yet, and intends to die before he does." That is **still true**: no one from the Fourth is on the list.
- **Ch1.** "Two hundred and eleven. I counted again by the fire. It doesn't get shorter when you count it, but I keep hoping." Paran's tea (`c1_paranTea`): "Is that medicine?" / "Technically," says Ohl.
- **Ch2.**
  - At the horse (`c2_horseHow='tea'`): "Tea," says Ohl. "Technically."
  - `[light]` **He writes Tattersail** (`c2_ashesOhl`): "*Tattersail. Cadre. Two hundred and twelve.*" And: "I have decided the list is not a list of my failures. It is a list of the ones I would have tried for."
  - `[road]` "Somebody is dying… and we are counting rations."
  - `[c2_outFought]` "They are *children*, Sergeant".
- **Ch3.** The Phoenix Inn (`c3_innOhl`): "Number sixty-four… Corporal Jeth Arrow… Put it on my list, will you. The room. Not a name. I don't know how to write a room." After the alley knives: "Not on *a* list. That's worse."
- **Ch4.**
  - `[shield]` He writes "*A boy. Daru. No name.*" when Vell comes over the parapet, then crosses it out: "I don't get to do that very often."
  - `[aside]` ohl −2: "Two hundred and twelve… That's a name I didn't put there, Sergeant… I just wanted you to know whose hand it's in." He means to make "a mark… I don't know what shape it should be." **See the count inconsistency in §8.**
- **Ch5.**
  - "Nobody's dead until I know where they went. That's a rule. I've just made it."
  - He leaves a space for Toc. `[through, Ellis]` He leaves one for her too: "Some lists close from the other side."
  - On Tool's advice: "That was *kind*."
  - He marched beside T'lan Imass at Aren.
- **Open.** The spaces for Toc and Ellis. Vell's mark. The TPL promise (no Fourth name, ever). His hand on Tuft's head. **Current count = 211 + (`c2_key==='light'`) + (`c4_key==='aside'`).**

### Ellis (`ellis`, recruit): the Claw ledger
- **TPL.** From Genabaris. Six years as a Claw scout; Toc's scout. She "Burned her hand at Pale pulling a courier out of a tent… Does not talk about the courier." Quest: "Somewhere in Darujhistan there is a house with her name in a ledger, and she means to find out which way it is written." She wears a Claw whistle with the cord cut.
- **Ch2** (every playthrough decides her). At the dying mare, `S.f.c2_horseHow` records how it ended: `knife` / `botched` / `tea` / `refused`. Every variant has her line "Fire at the Pale… Before the Hounds."
  - Toc: "The Claw's done with you. Be done with them."
  - `c2_ellisAsked`, tuft +1. `[clawFavour]` "He wrote my transfer. He writes very neatly… I'll be watching you." `[cadreTrust]` "The Claw don't hold for the cadre."
  - **`c2_ellisJoined`** (`recruit('ellis')`) or **`c2_ellisRefused`** (ohl −1; she rides off with Toc).
  - Toc's asks: "Her hand. Ohl'll want to look at it and she'll say no. Let him look anyway." / "her eye's fine… I'm the one with the eye. Don't let her tell you different; she's started to". **Both are unpaid.**
- **The Claw house** (`c2_hills_ellis`): "Lakefront, near the Gadrobi quarter, a wine-merchant's with a green door… the man who took it looked at my hand, before it was burned, and said *pretty*." **Fete hook:** "My mother was Gadrobi; she sold horses at the Fete." **The green door has never been visited.**
- **Ch3.**
  - She points out the dye-shop street (`c3_ellisGate`).
  - The message comes through her (`c3_ellisMsg`), from the well-boy from the Genabaris yards: "This is how they do it… they watch which way you carry it… I carried it to you."
  - Madryn: "You were pretty, the report said. Before the hand."
  - `[report]` ellis −2: "Now they know the door opens… they never stop knocking on a door that's opened once."
  - `[refuse]` ellis +2: "That's the first time anyone's shut that door with me on the right side of it."
  - Kalam: "The Claw doesn't cut loose. It ties a longer string. Watch who pulls it."
- **Ch4.**
  - She knows the planks (`c4_planks`, +1). The pine plank is bait. Corporal Hesk was "sent… across it anyway. To see if I was right."
  - `[shield]` +1: "I've never worked for anyone who did that… Don't stop."
  - `[aside]` −1: "That's how the Claw would have done it… One step… I'd hoped you weren't."
- **Ch5.** Toc counts her fingers: "Five," says Toc. "Five," says Ellis. Then: "He's my captain. Sergeant. He's my captain."
  - **`c5_ellisThrough`**: she goes into the grey after Toc and `unrecruit('ellis')` runs. CHEND: "Nobody has said the word 'dead'. Nobody will." **The brief allows her to return in Ch7.** Her ledger of loyalty survives in `S.loy.ellis`.
  - **`c5_ellisHeld`** (ellis −3). This covers `c5_briskHeld`, `c5_hold_ok` and `c5_hold_fail` ("You grabbed… You were too slow. But you *grabbed*… I'll remember which."). At dawn: "He'd have told me not to go, and I wouldn't have listened to him either — so don't expect thanks, Sergeant, but don't think I don't know." CHEND: "She counts the squad every morning and arrives at the wrong number."
- **Refused path.** In Ch5 Toc says: "Ellis isn't with you… she wasn't at the Rhivi fires either… when you're not wanted, don't be anywhere." **Her whereabouts are unknown**, so she is also available to return.

---

## 2. Canon (and recurring original) characters: standing and last words

| Character | Met | Flags | Standing / last said to the Fourth |
|---|---|---|---|
| **Whiskeyjack** | Ch1, Ch3, Ch4, Ch5 (briefing) | `wjRegard`: Ch1 honest = 1, evasive = 0, boast = −1; Ch3 −1 if `c2_late`; +1 if `c3_wjTold`. Range −2..+2. Also `c1_reported`, `c3_reported`, `c3_guildHeard`/`c3_whatWord`, `c4_answered` | Last seen in the Ch5 vault: "If she sees you, you're dead, and so is the mission, so be dead somewhere else." Optional lines: "Throw it at anything else you like." / on T'lan Imass: "you'll spend the rest of your life trying to work out what it saw." Ch4 dawn: "I know." `[shield]` "I'd have done it." `[aside]` "The boy's mine. Not yours. I sent you up." **He does not know about `c3_told`.** Madryn: "He'll hear of it one day… but not from me, and not this year." |
| **Quick Ben** | Ch1, Ch3, Ch4 | `c1_qb`/`c1_qbTuft`, `c3_qb` | Ch3: "I'd try to be less interesting." Ch4 (`c4_qbAfter`): `[shield]` "Don't make me do it again. It has a price, and I'm not the one who pays it." / "I didn't expect it to stop." `[aside]` "Somebody on that mountain has your face now." He carried the **sack** (Hairlock, "Insurance"). |
| **Kalam** | Ch1, Ch3, Ch4 | `c1_kal`/`c1_kalamTalk`, `c3_kal`, **`c4_kalamLook`** (set if `c3_key==='report'`) | Ch3 roof: "Go to sleep, Sergeant. You didn't see that. Nobody sees that." Ch4 dawn, last word: "Rake's people." `[c4_kalamLook]` He knows someone in the Fourth talked to the Claw, not who: "He says nothing about it. He never will." `[c3_wjTold]` He laughs at Madryn's name going to the Guild. |
| **Fiddler** | Ch3, Ch4 | `c3_fid` | "Don't talk to her [Sorry]… Squad advice. Free. First and only." Ch4: "*slate's a liar*." To Kettle: "I'm telling you so you'll remember I told you." |
| **Hedge** | Ch3 | none (the cusser gift is always given) | "What are you, *priests?*" / "Don't." He hid the gifted cusser from Whiskeyjack and Fiddler. |
| **Mallet** | Ch3 | none | Recognises Ohl as Denul; "He knows. About the list." (Ohl) |
| **Trotts** | Ch3 | none | Bares his teeth. Brisk: "*Him* I like." |
| **Sorry** | Ch3, Ch4 | `c3_sorry`, `c4_sawSorry` (skylight, Wits 12) | Ch3, eleven words: "You brought the wagon. Good. Now stand somewhere I am not." Ch4: she watches sleeping Kruppe's doorway and looks up through the glass at the sergeant. Ellis: "She's *watching his friends*." Whiskeyjack files it. |
| **Paran** | Ch1, Ch5 | `c1_paran`, `c1_paranStare`, `c1_paranTea`, `c5_paran`, `c5_paranHill`, `c5_paranDied` | Ch1: knifed, then fought the Hound Gear and lived. Ch5 `[c1_key==='line']` he remembers the line of shields ("*somebody's doing their job*"); otherwise he can't place them. "No… I've been dead." Last: "Tell Whiskeyjack I'm coming… Tell him about Toc." `[c5_toolSaw]` "It hasn't spoken to me once, in a month." **He still has Toc's horse on a lead rein.** |
| **Toc the Younger** | Ch2, Ch5 | `c2_toc`, `c2_tocHound`, `c2_tocCaptain`, `c2_tocGone`, `c5_toc` | Ch2: "tell him Toc kept riding. He'll know what it means." **That message was never delivered to Paran.** Ch5: pulled through the rent. His mouth opens to say something "still in his mouth when the grey closes over his head." |
| **Tattersail** | Prologue, Ch1 (dies Ch2) | ending-dependent; `cadreTrust` | Ch1 `[line]` "Go and find Whiskeyjack." `[claw]` "You held the crate, Sergeant. For him." Dies on the plain with Bellurdan. **Reborn in the Rhivi bundle.** |
| **Hairlock** | Ch1 (puppet), Ch4 (sack), Ch5 | `c1_sawHairlock`, `c1_namedHairlock` | "Luggage. Don't talk to it. It talks back." In Ch5 he opens the rent ("I'm going to open you up, Captain") and is torn apart by the Hounds. His strings lie on the next hill. |
| **Kruppe** | Ch3, Ch4 (asleep) | `c3_kruppeMet`, `c3_innKruppe`, `c3_kruppe` | The two things the city doesn't look at "have lately become two". Tells Tuft about the bundle. `[c3_msg]` "Kruppe would go in threes, himself. Or sixes." On Coll's ring: "Somebody *will*" (recognise it). |
| **Crokus** | Ch3, Ch4 | `c3_innCrokus`, `c4_crokus`, `c4_crokusNo` | "And you *lived*." "Uncle Mammot says the Empire's a thing that happens to other cities." In Ch4 he runs past on the roofs with a bag and an Andii behind him, and never sees the Fourth. |
| **Murillio** | Ch3 | `c3_innMur` | `[light]` "Keep it on." (the badge) |
| **Coll** | Ch3 | `c3_innColl`, `c3_collTalk` (Guile 12), **`c3_coll`** (took ring) | "The Empire never conquers a city. It *waits*." Ring taken: "Don't wear it in the Daru District… Somebody might recognise the shape." Ring returned: "Hood take you… I'd almost got rid of it." (No flag; derive it from `c3_collTalk && !c3_coll`.) |
| **Rallick Nom** | Ch4 | `c4_rallick` (the Guile outcome is not flagged) | "Go home, Malazan. This isn't your war." He watches one lit window on the brass-lamp hill: "I've had my own business for five years." Guile success: "Somebody's bricking up the Guild so she can't." |
| **Ocelot** | never on-screen | `c4_guildKnows` / `c4_reprisalFought` | `[aside]` his veteran says "Ocelot sends his regards… The Guild's not buying… from anyone who stands where you stood." |
| **Lorn** | Ch5 (never spoken to) | `c5_lorn`, `c5_spotted` | `[after wards]` "She looked at you the way you'd look at a smudge on a map." Ellis once carried her a letter. |
| **Tool (Onos T'oolan)** | Ch5 | `c5_toolSaw` (requires `c5_spotted`) | To Raest: "Forgive me." To the sergeant `[c5_toolSaw]`: "You are very small… Stay that way." |
| **Tiste Andii** | Ch2 (`road` only), Ch4 | `c2_andii`, `c2_andiiFear`, `c4_seen` | Ch2: "The light. Did you go to it?" / "No… Nor did we." Ch4 never speaks. `[aside]` it nods ("*I see you. I will know you.*") and lays its cloak over Vell. `[shield]` the second one hesitates at Quick Ben's illusion. |
| **Crone** | Ch2 (always), Ch5 (optional) | `c2_crone`, `c2_croneSaw`, `c5_crone`, `c5_croneRake` | Ch2 `[light]` "Keep her [Tuft]… For what she'll be worth to someone." `[road]` "Keep counting." Ch5: "My lord is *interested* in that hill… I will tell him you were here. He will not care." Flies west to the city. |
| **Sethand** (original, Rhivi guide, the Mhybe's clan) | Ch2, Ch5 | `c2_sethTrust` (count), `c2_outSeth`, `c2_outFought`, `c5_seth`, `c5_sethSat`, `c5_sethBundle` | Ch2 `[trust≥2]` "come by the Mhybe's fires. Say my name." `[c2_outSeth]` "you owe me a thing you will not be able to pay." Ch5 `[light]` "The Mhybe says you may live." `[outFought]` cold. At dawn he **raises his open hand**, which he has never done. |
| **Madryn** (original, Claw handler, blue-dyed hands) | Ch3 | `c3_madryn`, `c3_tea`, `c3_key`, `c3_told`, `c3_toldAll`/`Some`, `c3_lied`, `c3_lieHeld` | `[report]` "My people will leave the Fourth alone… Whiskeyjack won't hear of this… not from me, and not this year." `[refuse]` "I'll sit here and think about you." `[lie held]` "I'll pay when it's proven." `[lie failed]` "It's a kind thing, to lie to someone." The dye-shop is dark by dawn. `[c3_wjTold]` Whiskeyjack gave her name to the Guild. |
| **The grey cloak** (original, recurring Claw, clean boots, "neat hand") | Prologue, Ch1, Ch3 alley | `clawMet`, `clawFooled`, `marked`, `c1_claw`, `c1_clawTent`, `clawFavour` | Ch1: "Three rounds, Sergeant. You held them. That's been noted." In the Ch3 alley a man in a grey cloak with clean boots is wounded and goes over the wall. He is **never named or confirmed as Claw**; that is a rule from the Ch1 brief. |
| **Vell** (original, Guild journeyman) | Ch4 | `c4_vell` (alive) | `[shield]` "Vell… Journeyman. Ocelot's clan. I owe you." He gives the token and learns the sergeant's name (or the false one). `[aside]` Killed; Ohl's #212. |
| **The man on the corner** | Ch4 `[shield]` | none (the nod is unflagged) | A fake Watchman with grey eyes. Ellis: "the hole in the middle" of the Claw's page. He nods back if the sergeant nods. |
| Others | | | Pallick (gate clerk, `c3_gate`); Garrow (`knowDeserters`); Quartermaster Pell; the Gadrobi urchin (only without Ellis); the well-boy (only with Ellis); the Rhivi outrider boy (his cousin was killed by Lorn); Jeth Arrow; Corporal Hesk; Chub; the Hound "Gear". **Never on-screen:** Tayschrenn, Dujek, Rake, Ocelot, Mammot, Simtal. |

**Bridgeburner regard beyond `wjRegard`.**
- Kettle's crate discipline, which Whiskeyjack noticed: "Eleven days, and you didn't open it."
- Hedge's cusser.
- Fiddler, `[workDone]`: "Good hands, your lot."
- Quick Ben's interest in Tuft.
- Kalam's suspicion `[c4_kalamLook]`.

---

## 3. Chapter keys and what they mean

### Prologue: `S.chapters[0]` (= `S.ending`)
- **given**: "It's yours. We never saw it." This is possible **even if the squad read the journal**, so check `knowTruth` separately.
  - CHEND: "Tattersail owes your squad, and she is the kind who pays."
  - Ch1 effects: `gain('cadretoken')`. Quick Ben: "Somebody delivered something and didn't stay to read it." `[c1 claw]` The grey cloak steals "a loose leaf" of Varrow's from the cadre tent.
- **told** (requires `knowTruth`): Tattersail says "Forget the underlined part… I'll remember it for all of us."
  - Ch1: cadre token. Tattersail: "You know what I know. That makes two of us, and Tayschrenn, and Varrow."
- **burned**: Tattersail burns it: "It just isn't the one Varrow died for."
  - Ch1: "I've been thinking about your candle." `[c1 claw]` The grey cloak takes the crate lid, "Luggage".
- **claw** (`gaveClaw`): the Herald card. "Then the High Mage will have it by morning."
  - Ch1: the grey cloak says "The High Mage sends his regards… He doesn't, in fact."
- **Other prologue flags.**
  - `marked` (the Might 14 or 15 stand-off against the grey cloak failed): "entered into a ledger, in a very neat hand".
  - `decoy`: Kettle handed over her munitions ledger.
  - `clawFooled`: the Guile 13 "Grave detail" lie worked, so the grey cloak never waits at the tunnel mouth and the squad cannot be marked in the prologue.
  - `knowStakes`, `knowDeserters`, `noisy` (the sharper woke the Stonebound).

### Ch1: `c1_key` `line` | `claw` (CHEND "The line held" / "The crate held")
- **line**: hold the cadre row for Tattersail. `cadreTrust=1`, tuft +2. The squad survives 4 rounds against two Hounds and gains `houndtooth`.
  - `[marked]` The Claw's **accounting** follows at the picket line (`c1_accounting`), with three outcomes: `c1_accAvoided` (Guile 14, "Ask her whose ledger you're in"), `c1_accBluffed` (the cusser; needs `S.inv.cusser>0`) or `c1_accFought`.
  - Whiskeyjack: "The Host doesn't love the cadre, Sergeant, and the Claw don't love anybody who does."
- **claw**: seal the tent on the grey cloak's word. `clawFavour=1`, tuft −2, brisk −1. The squad survives 3 rounds with two Claw allies.
  - Afterwards: take the knife (`clawknife`) or refuse it (`c1_refusedKnife`, brisk +1).
  - Whiskeyjack: "people who help the Claw once get asked twice, and the second time it isn't a request."
- **Echoes.**
  - Toc's greeting (Ch2).
  - Ellis's terms (Ch2).
  - The mood at the start of Ch2: "Nobody has said the words *cadre row*" / "*grey cloak*".
  - Crokus hears the story (Ch3).
  - Paran remembers the line (Ch5).
- `clawFavour` can also come from Ch3 `report`, so test `c1_key` when you need the Ch1 meaning.

### Ch2: `c2_key` `light` | `road` (CHEND "You rode to the light" / "You kept the road")
- **light**: ride to Tattersail's death. `c2_late=1` (a day late), tuft +2, brisk −2, ellis +1.
  - Rhivi outriders: `c2_outTalked` (Guile 13), `c2_outSeth` (needs `sethTrust≥2`; spends Sethand's word for a year) or `c2_outFought` (the Rhivi remember).
  - **The ashes**: black glass, Bellurdan and Tattersail. The Mhybe carries away the bundle. Ellis: "It moved."
  - Tuft wears the badge from then on.
  - Ch3: Whiskeyjack says "Twelve days… I said eleven." (`wjRegard −1`).
  - Ch5: Sethand says "The Mhybe says you may live."
- **road**: keep the timetable. brisk +1, tuft −2, ohl −1, ellis −1.
  - Three **Tiste Andii** walk in before dawn: "Did you go to it?" A Wits 12 check (`c2_andiiFear`) shows they are afraid.
  - Tuft stays in the tall grass.
  - Ch5: Sethand says "You kept your road… The clans say that is what Malazans are for."
- **Both keys**: Crone lands, laughs and names herself (`c2_crone`); `c2_croneSaw` is optional.
- **Ellis** is decided on both keys, independently of the key.

### Ch3: `c3_key` `report` | `refuse` (CHEND "You told the Claw" / "You walked out")
- **report** (`c3_told=1`, plus `c3_toldAll` including Quick Ben and Kalam's nights, or `c3_toldSome` without them).
  - `clawFavour=1`, +40 silver. brisk −2, ellis −2, tuft +1, ohl −1.
  - No fight; Whiskeyjack doesn't know. CHEND: "a loaded gun with the Fourth's name on the grip."
  - Ch4 sets `c4_kalamLook`.
- **refuse** (`marked=1`). It includes lying: `c3_lied`, with `c3_lieHeld` if Guile 14 passes (in which case Madryn keeps her purse until it is proven). brisk +1, ellis +2.
  - Alley fight with hired knives and a Claw (`c3_knivesFought`, `lampchip`).
  - Option to tell Whiskeyjack everything: `c3_wjTold`, `wjRegard +1`, and he says "Good." In Ch4 he gives Madryn's name to the Guild.

### Ch4: `c4_key` `shield` | `aside` (CHEND "You held the roof" / "You stepped aside")
- **shield**: `c4_vell`, `c4_guildKnows`. The squad survives 3 rounds against an Andii hunter.
  - Quick Ben's sack-laugh illusion makes the second Andii hesitate. Vell hooks the Andii cloak.
  - `guildtoken`; the man on the corner.
  - brisk +1, ohl +1, tuft −1, ellis +1.
  - Whiskeyjack: "That's the one thing you saw tonight that you didn't see."
- **aside**: `c4_seen`, `c4_tuftDark`. The Andii kills Vell, nods, and lays its cloak over him.
  - `ropehook`; Ocelot's reprisal in the alley (`c4_reprisalFought`, always on this path).
  - tuft +2, brisk −2, ohl −2, ellis −1.
  - Whiskeyjack: "Something on that mountain looked at the Fourth tonight… and decided it was worth a nod."

### Ch5: `c5_key` `through` | `hold` (CHEND "Into the grey" / "You held the line")
- **The node branches on Ellis** (`c5_rent`):
  - **With Ellis, through**: `c5_ellisThrough`, `unrecruit('ellis')`, brisk −1, tuft +1, ohl +1, kettle −1.
  - **With Ellis, hold**: `c5_ellisHeld`, ellis −3. It is Brisk's tackle `c5_briskHeld` if `loy.brisk≥2`; otherwise a Might 13 check.
  - **Without Ellis, through**: `c5_tuftMarked`.
  - **Without Ellis, hold**: `c5_tuftHeld`.
- Kettle's cusser (`c5_cusserUsed`) is independent of the key, as are:
  - `c5_spotted` (a failed Wits 13 at the edge, so Tool turned his head);
  - `c5_toolSaw`;
  - `c5_sethSat` (the Rhivi charm; unavailable if `c2_outFought`).
- The otataral glove and Toc's scout cloak come on both keys.

### Four endings in Ch7: the loyalty axes the player has built

| Axis | For | Against |
|---|---|---|
| **Claw** | `clawFavour`, `c1_key==='claw'`, `c3_told`, `gaveClaw`, `clawknife` | `marked`, `c1_accFought`, `c3_key==='refuse'`, `c3_knivesFought`, `c3_wjTold`, `c1_refusedKnife` |
| **Bridgeburners** | `wjRegard` > 0, `c3_wjTold` | `c4_kalamLook` (Kalam suspects someone talked), a hidden `c3_told`, `c2_late` |
| **Cadre / Tattersail** | `cadreTrust`, `c2_key==='light'`, `told`/`given` | |
| **Guild** | `c4_vell`, `c4_guildKnows`, `guildtoken` | `c4_seen`, `c4_reprisalFought` |
| **Rhivi** | `c2_sethTrust`, `c2_outSeth` (a debt), `c5_sethSat`, `rhivicharm` | `c2_outFought` |
| **Rake / Andii** | `c2_andii*` | `c4_seen` |
| **Shadow** | `c5_tuftMarked` | |

---

## 4. Objects with story weight

**Gear ids by chapter.** Slot, who can wear it, and stat in brackets. Unless marked always, each needs the flag or choice shown.
- **Ch1**
  - `heater` (armour, brisk/sgt, ac1): taken from the pits.
  - `houndtooth` (trinket, any, atk1): `line` only. "It is warm. It stays warm."
  - `cadretoken` (trinket, tuft/ohl, hp2): ending `told`/`given`. "Give it to whichever of them you think needs to be remembered."
  - `clawknife` (weapon, sgt/kettle, atk1): `claw`, if accepted.
- **Ch2**
  - `barrowtorc` (trinket, hp2): after the barrow fight. "Tuft would not touch it."
  - `secondbadge` (trinket, brisk/sgt, ac1): `c2_badge`.
  - `rhivibow` (weapon, ellis/kettle, rng1 atk1): from Sethand, if you say nothing at the ridge fire. "It is a bad bow."
  - `toccloak` (armour, ellis/tuft/sgt, ac1): **always**. Toc's spare. "He says it's for when he's cold, and he's never cold. That's a Claw joke."
- **Ch3**
  - `daruknife` (weapon, sgt/ellis, atk1): after the cutpurse fight, always.
  - `roadleather` (armour, ac1): **always**; it is the Paviors' Guild crew jerkin.
  - `lampchip` (trinket, +1 might/wits/guile): `refuse` alley.
  - `collsignet` (trinket, guile+1): `c3_coll`. **Coll's ground-off crest; the Fete is at Lady Simtal's.**
- **Ch4**
  - `guildblade` (weapon, sgt/ellis/kettle, atk1): always (the roof fight is mandatory).
  - `guildtoken` (trinket, guile+1): `shield`. It "opens a door… then they decide what to do with you."
  - `ropehook` (trinket, ellis/sgt/kettle, mv1): `aside`. Dead Vell's.
  - `andiicloak` (armour, **tuft only**, ac1): **both paths**. "Cloth warms up. This doesn't."
- **Ch5**
  - `rhivicharm` (trinket, wits+1): `c5_sethSat`. "The grass knows whose that is now."
  - `barrowflint` (weapon, sgt/brisk/kettle/ellis, atk1): always.
  - `otatglove` (trinket, sgt/brisk, ac1): always. Lorn's forgotten glove, dusted with otataral. "Tuft will not stand on the same side of the fire as it."
  - `scoutcloak` (armour, ellis/kettle/sgt, ac1): always. Toc's, handed over by Paran.

**Story objects that aren't gear.**
- **Tav's letter**: sealed, kept in Brisk's gorget with the badge.
- **Brisk's ration ledger**, the **sergeant's pay ledger**, and **Kettle's munitions ledger** (see `decoy`).
- **Ohl's oilcloth list and his charcoal stub.**
- **Tuft's Deck.** "the paint worn from the House of Shadow". It "refuses her"; it was warm in Ch2–3; the Herald may be in her other sleeve.
- **Tuft's cadre badge** (worn if `c2_key==='light'`), grey ribbon, lamp, and the **grey lock** (`c5_tuftMarked`).
- **Ellis's glove.** Two fingers are fused at two knuckles. Also Kettle's fuse-cord (two lengths) and the Claw whistle with the cut cord.
- **Kettle's cussers and spoon.** Cussers are `S.inv.cusser`.
- **Toc's horse**: it came back riderless, and **Paran leads it**.
- **Hairlock's strings** on the next hill.
- **The Rhivi bundle** (see §6).
- **The Bridgeburners' munitions** in the Gadrobi-crossing gas mains: "four Moranth cussers and forty more of the Bridgeburners' own".
- The squad's cover is the **Paviors' Guild, Gadrobi crossing**. Brisk's "Charter exemption… section four".
- **Currencies:** `S.silver`, and `S.inv` {sharper, burner, cusser, salve}.

---

## 5. Motifs and voice

**Running motifs.**
- **Counting.**
  - Everyone counts the Fourth: "arrives at five, and checks it".
  - Brisk counts rations: "Eighteen days hardtack, five. Fourteen if the mule eats. Eleven if Kettle does."
  - Kettle counts munitions: "Two sharpers, one burner, one cusser. Same as this morning."
  - Ohl counts his list.
  - Ellis counts horses first.
- **Ledgers.** The Claw's neat hand, Pallick's ledger, Brisk's ledger and Ohl's list are the same idea. "Ledgers are where names go to be found, Sergeant." (Brisk) / "Nobody reads the ledger." "put it in the ledger" is a squad refrain (Kettle, Ellis).
- **Pell the mule.** It "does the same face" as the quartermaster, bites Gadrobi, and is in the ledger. It is last seen in Ch3, at the crossing beside the Bridgeburners' mule: the squad goes on foot in Ch4–5, so where Pell is now is open.
- **Ohl's tea.** "technically medicine"; "Hood's breath… Is that medicine?" / "Technically." Other forms: the other flask; tea poured out into a gutter.
- **"We don't leave people"** is Brisk's, and **new in Ch5**. It is the hinge for both Ch5 choices.
- **Clean boots** mean the Claw. A **pause you could fit a knife into** means Kalam.
- **Stock images.**
  - "the way water goes round a stone" (the dawn round the Spawn).
  - The city "starts… to shout about fish" (Ch3 and Ch4 closes).
  - "Sleep. Or pretend." (Tattersail's advice, reused on the Ch3 and Ch4 close buttons).
  - **Ellis "says one sentence, and it's the right one."**
  - "*Thud*… A long time later: *thud*." (Raest).
- **Deck readings** follow a formula: "Two cards refuse her. The third does not." She "never draws for herself". Somebody (Quick Ben, Sethand, Kruppe) watches her face, not the card.

**How the gods are handled.** Gods never appear on stage. They are felt through their instruments:
- the Deck;
- the Hounds (Shadow is a place they "went *home*");
- ravens;
- Oponn's coin ("a coin came down on the wrong side", Paran);
- Hood as the person Ohl *argues with* in Ehrlii (Brisk "Prays to no one, salutes Hood anyway").

Oaths: "Hood's breath / teeth". Warrens are physical sensations: Kurald Galain is cold that light pushes through "like water", then a "*house*" with somebody in it. Meanas is a pond next to the Andii's sea. Otataral is "a hole in the world… like waking up deaf". Chaos smells of a struck match, a slaughterhouse and a sea. Rake is never seen; his presence is Crone, the Andii and the Spawn.

**Canon voices.**
- Whiskeyjack: terse and grey-eyed; "Sergeant."; sword across his knees on a bucket; says "I know" / "Good." as full sentences.
- Quick Ben: mild, "smiling at something just past you", practising being uninteresting.
- Kalam: low and unhurried, watches rooftops.
- Kruppe: third person, ornate, "Kruppe merely observes", secretly exact.
- Crone: "Ha!", "Malazans!", "little soldiers", "my lord".
- Sethand: "Malazan." in the voice the Untan docks use for *tide*; "I am telling you so you will know"; never says a thing twice; "by his count".
- Toc: "a young voice and an old way of using it", Claw jokes.
- Paran: stiff, then flat about death ("It isn't catching.").
- Tool: dry, "every word… like a stone in a wall".
- Hairlock: a warm grown man's voice that forgets it has no knees.
- The Andii and Lorn never speak.
- The grey cloak and Madryn never say the word "Claw".

**Squadmate voice notes and representative quotes.**
- **Brisk.** Few words, the regiment voice when needed. The single word "Sergeant." is a whole conversation. Quotes: "A week's a thing officers say instead of a number." / "Everybody wants to be somebody's sergeant… Nobody wants to be read a list." / "I'll stand where you put me, Sergeant. Same as always… But you should know where I'd put me."
- **Kettle.** Chatty, bad liar, names things; afraid in the form of talking. Quotes: "You keep pointing me at things and I'll keep making them stop being things. That's love, in the sapper trade." / "Can I *want* to shoot it?" / "That's the first thing in six years I couldn't make stop being a thing."
- **Tuft.** Quiet and exact, with italics on the key word. "Yes, Sergeant." is her compliance voice. Quotes: "The cards say nothing about you, Sergeant. I checked." / "It's a *house*, Sergeant. Somebody lives in it." / "I think I'd rather be nothing than be *noticed*."
- **Ohl.** Patient, says "child", Ehrlii to Hood, makes rules. Quotes: "Drink the tea, Sergeant. It's not poison. It's just unpleasant, which is how you know." / "I don't know how to write a room." / "Nobody's dead until I know where they went."
- **Ellis.** Exact, dry, "I'd like that in the ledger"; tells you so you won't have to ask. Quotes: "I'd like it noted that I didn't." / "Also, the fish is good. Lakefront. Say I sent you. Then run." / "I'm still not used to it. Don't stop."

---

## 6. Open threads for Chapters 6 and 7 (checklist)

**Expected by the outline and briefs**
- [ ] **Tuft's arc resolves at the Fete** (the outline: "Sets Tuft's road (which runs to the Fete)"). Pay off:
  - the High Mage and "what he thinks he still has of hers";
  - the card she has never drawn for herself ("be standing next to her");
  - `c4_tuftDark` and `c5_tuftMarked` (these are exclusive with an Ellis playthrough);
  - her promise to explain;
  - the Andii cloak;
  - her fear of the otataral glove.

  Tuft's Shadow thread also touches Sorry ("a hand in a glove") and her "Somebody sent them [the Hounds]".
- [ ] **The Claw's last accounting (Ch7).** Inputs:
  - `marked`, `clawFavour`, `c1_acc*`, `c1_key`;
  - `c3_told`/`toldAll`/`toldSome`, `c3_lied`/`lieHeld`, `c3_knivesFought`;
  - `c3_wjTold` (Madryn's name went to the Guild);
  - `decoy` (and whether `c1_claw` returned the ledger), `gaveClaw`;
  - the grey cloak; Madryn's "not this year".
  
  If the Fourth reported and Whiskeyjack never learned of it, Ch7 is where he does. Kalam already suspects (`c4_kalamLook`).
- [ ] **Ellis may return in Ch7** `[c5_ellisThrough]`, probably with Toc's trail and Kettle's fuse-cord. `[c2_ellisRefused]` She is also loose somewhere. `[c5_ellisHeld]` Her resentment (−3 swing) needs a turn.

  The Claw house with the green door and "her name in a ledger" has never been visited. Nor has the courier at Pale, Ohl looking at her hand, or her mother at the Fete (the horses).
- [ ] **The Rhivi bundle (Tattersail reborn, the Mhybe's).** It is on the Gadrobi ridge with Sethand's party, looking west, "going home, by a long road. It wanted to come this way."
  - Kruppe knows. Tuft asked "don't let me go near that". `[loy≥2]` "She's not gone."
  - `[c2_outSeth]` The squad owes Sethand "a thing you will not be able to pay".
- [ ] **Paran.** Report to Whiskeyjack ahead of him, and tell him about Toc. **Deliver Toc's Ch2 message "Toc kept riding"**, which is now unbearably loaded. He remembers the line `[c1_key==='line']`. He has Toc's horse.
- [ ] **Bridgeburner regard.** `wjRegard` runs from −2 to +2 (plus `c3_wjTold`). Ch7 "Outlaws" is the defection to Dujek, so the Fourth's place in it should follow this. The sergeant's TPL quest also points here: "Somewhere in Onearm's Host, somebody has noticed."

**Also planted and unresolved**
- [ ] Brisk: Tav and the sealed letter (the Host in Ch7); the badge; her "I don't *know*" `[through]`.
- [ ] Kettle: the **Moranth debt**, never touched; the spoon; her remaining cussers; "the one that matters".
- [ ] Ohl: the spaces left for Toc and Ellis; Vell's mark; no Fourth name on the list yet.
- [ ] Coll's signet `[c3_coll]` at Lady Simtal's Fete: "Somebody *will*" recognise it. Rallick's "own business" and the lit window.
- [ ] The Guild: Vell's debt and token `[shield]`, or Ocelot's grudge `[aside]`; the man on the corner.
- [ ] Rake: Crone's "My lord is *interested*"; the Andii who know the Fourth's faces `[c4_seen]`; the second Andii's hesitation `[shield]`.
- [ ] Raest waking: "It knows we were here." / "You are very small. Stay that way."
- [ ] Sorry, watching Kruppe's friends `[c4_sawSorry]`. Crokus and the Andii chasing him.
- [ ] Quick Ben's sack has been used up. Hairlock is dead.

---

## 7. Engine facts

**Chapter module.**
- Shape: `const CHn = {title, number, intro:{loc, sub, cap, paras:[…], go, node}, area | areas:[…], battles, foes, gear, card, dlg}`.
- `registerChapter(n, CH)` merges areas into `AREAS`, battles into `BATTLES`, foes into `FOES`, gear into `ITEMS`, the card into `CARDS` and dlg into `DLG`. Everything is global, so ids from any chapter are reusable and **must be unique**.
- **Boot registers CH1–CH5 only** (`90_resume_boot.js start()`), so CH6/CH7 must be added there.
- End screens: `CHEND[n]` {key: [title, text]}, `CHTEASE[n]`, and a per-`n` `extra` block in `showChapterEnd`.
- Per-area quest lines: `QUESTS[areaId]`, or an area's `quest()`.
- The journal (`35_pack_journal_save.js`) only covers the prologue and Ch1.

**Areas.**
- Fields: `{id, title, sub, hint, decor, map (16×12 strings), walk:'.,…', triggers:{char:nodeId}, start:{x,y}, npcs:[{id, name, kind, x, y, node:()=>id, show:()=>bool, fresh:()=>bool, still:true}]}`.
- Decors: `pale`, `camp_night`, `plain`, `plain_dusk`, `plain_night`, `hills`, `hills_dusk`, `hills_night`, `city_dusk`, `city_night`, `roof_night`, `cellar`.
- Sprite kinds: sgt, brisk, kettle, tuft, ohl, ellis, tat, pell, garrow, claw, paran, wj, qb, kalam, rhivi, toc, crone, andii, fiddler, hedge, mallet, trotts, sorry, kruppe, crokus, murillio, coll, urchin, guard, rallick, vell, assassin, lorn, tool, hairlock, hound, shade, wight, ward, warrenspawn, stone, deserter, xbow, cutpurse, bruiser, knife, clawknife, guildknife, guildveteran, andiihunter, thug.

**`SCENES` for a node's `scene:`.** `explore` means return to the map. The rest: tunnel, dark, camp_night, tent, fire, plain, plain_dusk, plain_night, hills, hills_dusk, hills_night, city_street, inn, cellar, room, roof_night, roof. A new place needs a new `SCENES` entry.

**Dialogue node.**
- `NAME:()=>({sp, scene, fx, txt, html, oncard, after, ch:[…]})`. Nodes are functions, so text is built each visit.
- Each `ch` item is `{t, req:()=>bool, fx:()=>{}, go, check:[stat, dc, who?], fail, tag}`.
  - `go` can be a node id (`talk`), a function (the sheet closes first, then it runs) or omitted (close and return to the map).
  - `check` rolls d20 plus the best squadmate's `statOf`, or the named `who`. The stats are might, wits and guile; Oponn gives +1 and the Nerve pick +1. The roll routes to `go` or `fail`. `tag` is a label shown on the button.
- **A node's `fx` runs once per node id, ever** (`S.fxd[id]`). It runs **after** the node's text has been built, so text cannot see a flag set by its own `fx`.
- **A choice's `fx` runs on every click**, before navigation.
- `fmt` handles `{sgt}` (replaced by `S.name`), `*emphasis*` (becomes `<em>`) and blank-line paragraph breaks. It applies to **`txt` and `after` only**. `sp` and choice `t` are HTML-escaped, so **no `{sgt}` or `*…*` in choice labels**; Ch5 has two that render literal asterisks.

**Helpers.**
- `SQUAD()`: the list of ids.
- `loy(id, n)`: clamps to ±3 and adds an approve/disapprove note. **Only call it for a present squadmate**; the convention is `if (SQUAD().includes('x')) loy('x', n)`.
- `note(text, 'good'|'bad')`.
- `gainXP(n)`: returns true on level-up. Note the level-up in the same node, as the prologue does.
- `gain(itemId)`: once only; auto-equips.
- `recruit(id)` / `unrecruit(id)` (sets `S.f[id+'Gone']`).
- `startBattle(id, {surprise:'p'|'e', pre:true, drop:[i]})`. `pre` is Kettle's opening sharper: 1d10 to every foe.
- `startExplore(areaId?)`, `talk(id)`, `cardSequence(done)`, `chapterEnd(n, key)`, `elog()`.
- State: `S.inv`, `S.silver`, `S.card` (reset to null at every `startChapter`), `S.loy`, `S.lvl` / `S.xp` (LEVELS to 8; picks at 3, 5 and 7 open before the next `talk`), `S.kit`, `S.gear`, `S.f`, `S.chapters`, `S.ending`.

**Battles.**
- Fields: `{title, warrenText, warren:{meanas, denul}, dark, music:'battle'|'dark', open, style:'city'|'roof'|'cellar', map (8×10), party:[[x,y]×6], foes:[[foeId,x,y]], xp, after, objective:{type:'survive', rounds, text}, waves:[{round, foes, text}], allies:[[foeId,x,y]]}`.
- **`win()` already awards `def.xp` and notes it, then calls `talk(after)`.** Do not call `gainXP` again in the `after` node; Ch1 does and double-awards.
- Foe schema: `{name, sig, hp, ac, atk, dmg:[n,s,+], rng, mv, init, boss, verb}`.
- Existing foes you can reuse: deserter, xbow, stone, shade, hound, assassin, wight, rhivi, cutpurse, bruiser, knife, clawknife, guildknife, guildveteran, andiihunter, vell, ward, warrenspawn.

**Gear.** `{name, slot:'weapon'|'armour'|'trinket', who:[ids]|null, ac, atk, hp, mv, rng, dmg, stat:{might,wits,guile}, line}`.

**Cards.**
- `CARDS` ids and their implemented effects:

  | Card | Effect |
  |---|---|
  | oponn | +1 d20 |
  | obelisk | +4 hp |
  | knight | foes −1 to hit |
  | assassin | crit on 19–20 |
  | hounds | +1 move |
  | raven | +2 initiative |
  | magi | Tuft strain −1 |
  | herald | stay at 1 hp once a fight |
  | crown / sceptre / orb | art only |

- Draw pattern: a choice `fx:()=>{S.f.cN_drawn=1; S.card=[weighted list][R(n)]}` with `go:()=>cardSequence(()=>talk('cN_card'))`. The card node shows `html:'<div class="cardinline"><canvas id="icard" …></canvas>…'` and `oncard:[S.card,false]`. Refusing sets `S.f.cN_noCard` (tuft −1, usually brisk +1).
- Ch4 declared no new card.

**Conventions.**
- Node ids `cN_*`; flags `S.f.cN_*`; `S.f.cN_done=1` at the close.
- Close with `chapterEnd(N, S.f.cN_key || 'default')`.
- Conditional text uses template literals with ternaries. Examples: `${SQUAD().includes('ellis') ? `…` : ``}`, `${S.f.x ? … : S.f.y ? … : …}`.
- Threshold beats use `S.loy.x >= 2`.
- Munitions counts are pluralised inline: `${S.inv.sharper} sharper${S.inv.sharper === 1 ? '' : 's'}`.
- Every squadmate line is guarded by `SQUAD().includes(...)`, even for the four who cannot leave.
- End-of-chapter "talk to anyone" rows use `req` plus a `cN_closeX` flag.

---

## 8. Inconsistencies to watch (so Ch6–7 don't compound them)

1. **Ohl's count.** Tattersail is #212 on the `light` path (`c2_ashes_ohl`), but on the `aside` path Vell is also "Two hundred and twelve" and Ohl says "I've carried two hundred and eleven names that Hood took". Compute the count as `211 + light + aside`.
2. **Crone in Ch5** branches on `c2_croneSaw` ("We have not met"). But Crone named herself to the squad in `c2_crone` on every path (`c2_crone` is always set). Branch on "talked with her" instead.
3. **CHEND 3 `c3_paid`** says "The Fourth's real name is in a gate-clerk's ledger". Paying was the no-name option; the real-name option is `c3_trueName`.
4. **CHEND 1 `c1_accBluffed`** says "a cusser named after a Claw". The dialogue only says Maud or Gerrun.
5. **CHEND 4 `c4_guildKnows`** says "Rallick told him". In the dialogue Vell promises to tell; Rallick isn't involved.
6. **Ch1 after-battle nodes call `gainXP` again** (`c1_after_line` 180, `c1_after_claw` 150, `c1_after_accounting` 120), so XP is double-counted.
7. **`c1_plant` is always set**, because the tent scene is mandatory. The "She sewed a badge on my collar once… I'm going to start" branch in `c2_ashes_tuft` and the "Kettle snores" branch in `c2_start_tuft` are unreachable.
8. **Numbers and days.** Settled in v3.7.3: the road from Pale to the Worry Gate is eleven days (twelve with the light detour, `c2_late`; `tripDays()` in 37_chapters.js), Ch2 opens on day four, "a week behind us" is the lag behind the Bridgeburners, who are eight (Whiskeyjack, Quick Ben, Kalam, Fiddler, Hedge, Mallet, Trotts, Sorry). The Moranth crate the Fourth hauls is a full one: thirteen slots, twelve cussers and a dud; the vault holds forty of Hedge's and those twelve.
9. **Refused-path Ellis.** She rode off with Toc in Ch2, yet in Ch5 Toc "wondered" where she was.
10. **Tuft's through path in Ch5.** CHEND says "the Fourth let someone follow", but nobody followed. CHEND also has Tuft call things "polite" (Ch4 and Ch5 extras); she never does in dialogue.
11. **Chub's cusser** is "the size of a big man's fist" in Ch5; the cussers in Ch3 are "the size of a man's head".
12. **Choice labels in `c5_wards` / `c5_rent`** contain `*…*`, which renders as literal asterisks.
13. **Missing flags.** Returning Coll's ring, Rallick's Guile outcome, nodding to the man on the corner, and Tuft keeping the Herald all set no flag. Derive them or add flags going forward.
14. **Whiskeyjack's Ch5 "You reported it"** assumes the dust-line talks (`c2_sethDust` / `c2_hillsDust`), which are optional.
15. **Ellis's timeline.** She was recruited at 18 (six years ago), but she knew the well-boy in the Genabaris yards eight years ago.
