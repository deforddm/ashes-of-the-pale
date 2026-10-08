# Ashes of the Pale: series canon for writers

Thu Oct 8, 2026, 12:30 AM PDT. Written for v3.16.0. **The reference every later chapter of the game is written against.** Built from `forward-canon-v3.15.3.md` (§3 keep-open rules, §4 name clashes, §5 roads and books), then re-checked: §7 below works through that doc's "Not verified" list and its medium, low and memory items with fresh sources. The book-order chronology of *Gardens of the Moon* is `canon-chronology.md` (beat IDs like `22.8`).

**Rules for using it.** The novels, all of them, are the authority; everything here is a check on them, gathered by people who did not have the text. Each claim carries its sources:
- **W**: Malazan Wiki (malazan.fandom.com), the named page. About half of all requests returned HTTP 402; each was retried once.
- **R**: Reactor's "Malazan Re-read of the Fallen" (reactormag.com).
- **F**: the fan worksheets at starvalddemelain.pbworks.com.
- **FC**: `forward-canon-v3.15.3.md`, where it is the only source.
- *(memory)*: not checked against any source. Treat as a lead, never as a fact.

Books: GotM *Gardens of the Moon*, DG *Deadhouse Gates*, MoI *Memories of Ice*, HoC *House of Chains*, MT *Midnight Tides*, BH *The Bonehunters*, RG *Reaper's Gale*, TtH *Toll the Hounds*, DoD *Dust of Dreams*, TCG *The Crippled God* (Erikson); NoK *Night of Knives*, RotCG *Return of the Crimson Guard*, SW *Stonewielder*, OST *Orb Sceptre Throne*, B&B *Blood and Bone*, *Assail* (Esslemont).

Line numbers (`46:2267` = `src/46_chapter7.js` line 2267) are for commit 7b9647d (v3.15.4 plus the lead's renames). Other v3.16 branches move some of them.

---

## (a) Keep-open rules: binding on every writer

Each rule says what a later book depends on. Break one and a sequel chapter, or a reader of the series, finds the game wrong.

1. **The outlawing is never vouched for.** Characters may believe Dujek's Host is outlawed in earnest. The narrator never says so, and neither Dujek nor Whiskeyjack is ever given a private thought that treats it as real. (Laseen, Dujek and Tayschrenn arranged it as a ruse: W *Dujek Onearm*, *Tayschrenn*, both citing DG.) Dujek's "I haven't decided yet what I'm going to lie about" is the model.
2. **Nobody is proved guilty at Pale.** Varrow's journal records an order and its timing; Tuft and the deserters speak belief. Never narrate Tayschrenn killing the cadre. MoI recasts the enfilade.
3. **The cadre badge as the High Mage's window is Quick Ben's claim.** Never show who is on the other end. Tayschrenn lies in a coma after the Fete and then travels hidden in the Host as Artanthos (W *Tayschrenn*).
4. **The child holds three souls** (Tattersail, Nightchill, Bellurdan). Name Tattersail if you like; never say "only". The Rhivi going east is a first leg; within two months they are with Brood near Pale (W *Silverfox*, *Mhybe*). She looks about five on the plain and about ten two months later (W *Silverfox*). Tuft's "where he can't see" stays her hope.
5. **Toc is on neither roll.** Never say whose tracks Ellis found or that Toc was walking. Nobody learns of Morn. Ellis's hunt never succeeds. (He wakes at Morn two months on, in MoI: W *Toc the Younger*.)
6. **The Azath stays shut.** Raest becomes its guardian; Rallick and Vorcan sleep inside it until TtH (W *Raest*, *Rallick Nom*). Never open the door, show the inside, say who lies under the fresh mound, or call Raest dead. Never name Vorcan.
7. **Whiskeyjack's leg stays bad, by his choice.** It could be mended; he never gives Mallet the time (R GotM Epilogue; W *Whiskeyjack*). Nobody heals it. It fails him at Coral and he dies of it (W *Whiskeyjack*).
8. **Lorn's sword** goes with Paran but is never used or lost in the game. He buries it by the back wall of Coll's estate, digs it up in BH, and it is shattered as payment to the Trygalle; he keeps a shard (W *Lorn*; R BH ch. 15 for the shard).
9. **Simtal.** The shut door is enough. Keep Coll's broken-off "and my wife —". Never say they were childless: in MoI Coll thinks he may have a child of three (W *Coll*).
10. **The mines stay asleep** under the crossing. The Claw's order to fire them stays unsigned.
11. **Tuft and the powers.** Noticed by Shadow, never given a House title or card. "Somebody in the house" of Kurald Galain stays Rake or his people, never Mother Dark (who turns away from her children until TtH: W *Mother Dark*). Her two Elder tricks are a gift and a frost-mark, never a warren she can open. The blank card stays blank; the Herald and the Magi stay faceless.
12. **The Fourth is never "Bridgeburners".** It is always "Seventh Company, Onearm's Host". Paran takes 38 Bridgeburners into the Pannion campaign (W *Bridgeburners*). Fiddler commands a Fourth Squad of marines in the Fourteenth Army from HoC on (W *Fiddler*); never let the two meet on the page.
13. **Names never used:** Kellanved, Dancer, Ammanas, Laseen, Surly, Topper, the Talon, the Eel, the T'orrud Cabal. **No Burn's Sleep year** in game text: dates stay relative ("nine years before Pale").
14. **Who lives.** No Hound dies at the Fourth's hands. Challice's rescuer stays unseen. Murillio, Coll, Baruk, Derudan, Kruppe, Crone and Rake all walk out alive and unexplained. Blues does not die.
15. **The chained man in vision 5 stays nameless.**
16. **Rumjugs and Sweetlard** stay a pin-up nobody can explain; they join the Bonehunters later.

Also binding (common brief): a character may believe what a later book overturns; the narrator may not state it.

---

## (b) Name clashes and their resolutions

| Name | Status | Canon bearer | Note for writers |
|---|---|---|---|
| **Pallick → Pennick** | Done (display text). Internal ids such as `pallickDoubt` stay for saves. | Pallick is a Hound of Shadow, Rood's mate, named in GotM (FC, which re-fetched W). | Never write "Pallick" in new text. |
| **Kettle** | Kept. | Kettle, the undead child of the Azath in Letheras, a large part in MT and RG (FC, citing W *Kettle*; not re-fetched). | Defensible on another continent. A sequel that reaches Lether will have two Kettles: give ours a surname or a tag there. |
| **Tav, "Tavore-by-no-relation" → Tavrin** | Done: full name Tavrin, called Tav; "by-no-relation" removed. | Tavore Paran, Adjunct after Lorn, centre of HoC to TCG. | Never write "Tavore" for Brisk's brother. |
| **Chains card → the Wain** | Done in name and card text; internal id `chains` stays. The art still shows chains (art worker redraws). | High House Chains enters the Deck in MoI as the Crippled God's House (FC, W). | Never call an Unaligned card "Chains" or "Chain". |
| **Madryn** | Kept. | Madrun, a masked estate guard in Darujhistan in TtH and OST *(memory; W page returned 402 twice)*. | One letter apart. If the game reaches TtH Darujhistan, keep them in different rooms. |

Minor, no action (FC): Tuft and Tufty (Raest's undead cat in TtH, W *Raest*), Pell and Pella, Gerrun and a Gerrun in *Assail*, Bris and Brys Beddict.

---

## (c) What each canon character does next, book by book

One or two lines each. Sources in brackets; *(memory)* lines are unchecked.

- **Whiskeyjack.** MoI: Dujek's second; leg untreated; killed at Coral by Kallor when the leg gives, entombed in Moon's Spawn. TtH: leads Hood's dead in Dragnipur as Iskar Jarak. DoD/TCG: guards Hood's Gate with the dead Bridgeburners; at the end, a last moment with Korlat. [W *Whiskeyjack*]
- **Ganoes Paran.** MoI: captain of the Bridgeburners, Master of the Deck; the Azath recognises him (Raest shows him down). BH: digs up Lorn's sword, crosses plague-struck Seven Cities, frees the Deragoth, wounds Poliel with an otataral shard; after Dujek dies the Host makes him High Fist. TCG: leads the Host in Kolanse. [W *Raest*, *Lorn*, *Ammanas*; R BH ch. 15]
- **Tattersail / Silverfox.** MoI: about ten, with Brood; summons the Second Gathering of the T'lan Imass; at Coral; the Mhybe is drained by her growth. TtH: the Imass serve only her. *Assail*: searches for surviving Imass. [W *Silverfox*]
- **The Mhybe.** MoI: about twenty at the birth, aged to a crone by the child; tended by Coll and Murillio; entombed living in Capustan; lives young in a dream-world. [W *Mhybe*]
- **Lorn.** Dead at the Fete (23.9). Buried by Paran on the north shore of Lake Azur (GotM Epilogue per W); in DoD Tavore says a pauper's grave. [W *Lorn*]
- **Tool (Onos T'oolan).** MoI: at Morn, travels with Lady Envy, befriends Toc, follows the Seer to Coral; becomes mortal. RG: marries Hetan, leads the Barghast. DoD: his family torn apart; turns on the Barghast. TCG: leads the Imass at the Spire, reunited with his family. [W *Onos T'oolan*]
- **Toc the Younger.** MoI: two months in Chaos, wakes at Morn, renamed Aral Fayle, captured and tortured by the Seer, dies at Coral; his soul goes into Anaster. RG: as Toc Anaster with the Awl, dies at Q'uson Tapi. TtH: Herald of Death. TCG: a Bridgeburner at Hood's Gate. [W *Toc the Younger*]
- **Quick Ben.** MoI: the Barghast and Coral. HoC: Raraku; Tayschrenn makes him High Mage. BH: meets Tayschrenn; with the Fourteenth. RG: in Lether; brings Hedge back to the flesh. TCG: Shadowthrone sends him and Kalam to the Host. [W *Tayschrenn*, *Bridgeburners*, *Hedge*, *Ammanas*; W *Quick Ben* returned 402]
- **Kalam Mekhar.** DG: to Seven Cities with Fiddler, Crokus and Apsalar; learns from Laseen the outlawing was a ruse. HoC: Raraku. BH: meets Tayschrenn; Shadowthrone saves him (the Claw ambush in Malaz City, *memory* for the detail). TCG: sent to the Host. [W *Fiddler*, *Dujek Onearm*, *Tayschrenn*, *Ammanas*; W *Kalam* returned 402]
- **Fiddler.** DG: Seven Cities, Tremorlor; joins the Fourteenth. HoC: re-enlists as Sergeant Strings, Fourth Squad of marines; Raraku. BH: Y'Ghatan. RG: Letheras. DoD: reads the Deck. TCG: captain of the marines; retires to fish off Malaz City. [W *Fiddler*]
- **Hedge.** Alive at the end of GotM. MoI: 7th Squad; dies at Coral throwing a cusser at his own feet. HoC–BH: a ghost. RG: made flesh again by the Azath; rejoins Fiddler. DoD/TCG: Letherii recruits, new munitions; survives. [W *Hedge*]
- **Mallet.** MoI: survives Coral, retires to Darujhistan. BH/TtH: co-owns K'rul's Bar; dies defending it from the Guild in TtH. DoD: a ghost at Hood's Gate. [W *Mallet*]
- **Trotts.** MoI: warchief among the White Face Barghast; dies of wounds at Coral. Later among the dead. [W *Trotts*]
- **Twist.** MoI: dies at Coral. [FC; unconfirmed this pass]
- **Sorry / Apsalar.** DG: to Seven Cities; Shadowthrone returns her to the Kanese coast. HoC: works for Cotillion, Drift Avalii, leaves Crokus. BH: Shadow's assassin *(memory)*. TCG: reunited with Cutter in Itko Kan. [W *Crokus Younghand*, *Cotillion*; W *Apsalar* returned 402]
- **Crokus Younghand (Cutter).** DG: Seven Cities. HoC: takes the name Cutter; Drift Avalii; Cotillion's man. BH: escorts Heboric and Felisin Younger. TtH: back in Darujhistan; affair with Challice; kills Gorlas Vidikas after Murillio's death. TCG: reunited with Apsalar. [W *Crokus Younghand*]
- **Kruppe.** MoI: in the Darujhistan delegation (with Coll, Murillio and Estraysian D'Arle) at the parley near Pale; marches with the army; hires the Trygalle. BH: visits Paran at the Azath. TtH: dances for K'rul. OST: steers events against the Legate. [W *Kruppe*; R MoI ch. 4–5]
- **Coll.** MoI: back on the Council; negotiates with Brood and Dujek; marches to Capustan; tends the Mhybe. TtH: Murillio's death; fights Council enemies. OST: on the Council facing the Seguleh. [W *Coll*; R MoI ch. 4–5]
- **Murillio.** MoI: with Coll on the march; tends the Mhybe. TtH: killed in a duel by Gorlas Vidikas. [W *Murillio*]
- **Rallick Nom.** MoI to BH: asleep in the Azath with Vorcan. TtH: Raest kicks him awake. OST: helps bring down the Legate; with Vorcan. [W *Rallick Nom*]
- **Vorcan.** Asleep in the Azath until TtH; TtH watches Dragnipur's end with Baruk and Crone; OST with Rallick. [W *Rallick Nom*, *Crone*; W *Vorcan* returned 402]
- **Baruk.** DG: the Cabal sponsors the Trygalle run to Coltaine. MoI: raises Duiker. OST: the Legate makes him Barukanal; survives. [W *Baruk*]
- **Derudan.** TtH: watches Dragnipur's end with Baruk, Crone and Vorcan. [W *Crone*]
- **Anomander Rake.** MoI: at Coral he drops Moon's Spawn on the Seer's palace and gives it as Whiskeyjack's tomb; his Andii settle Black Coral. TtH: lets Traveller kill him with Dragnipur in Darujhistan to bring Mother Dark to Black Coral. [W *Anomander Rake*, *Mother Dark*]
- **Crone.** MoI: with Brood; loses her roost when the Spawn goes to sea. TtH: in Darujhistan for Rake; last seen at Dragnipur's end. She is "she", the eldest Great Raven, over 120,000 years old. [W *Crone*]
- **Hairlock.** Dead in GotM (15.8).
- **Tayschrenn.** GotM: coma after his demon dies. MoI: hidden in the Host as Artanthos; saves Korlat at Coral. BH: confined in Mock's Hold. RotCG: pulled into Chaos at the Battle of the Plains. OST: memory gone; takes K'rul's power and becomes T'renn. [W *Tayschrenn*]
- **Dujek Onearm.** DG: sponsors supply for Coltaine. MoI: allies with Brood; the ruse known only to Whiskeyjack and Tayschrenn. HoC: Host down to about three thousand; too late for Raraku. BH: dies of plague; Paran succeeds him. TtH: among Hood's dead. [W *Dujek Onearm*; R BH ch. 15]
- **Raest.** MoI on: the Azath's guardian; shows Paran down seven flights. BH: a muttering Jaghut manservant. TtH: Antsy gives him the cat Tufty. OST: plays cards with Dev'ad Anan Tol and turns Rallick away. Undead, not dead. [W *Raest*]
- **Challice D'Arle.** TtH: married to Gorlas Vidikas; affair with Cutter; takes her own life. [W *Crokus Younghand*]
- **Blues.** Crimson Guard. RotCG and later *(memory)*. Must not die in the game (rule 14).
- **Kettle (canon, Letheras).** Not ours; see (b).

---

## (d) Where the roads lead

**The shape.** The Host is back outside Pale within weeks; Brood's army, with the Rhivi and the child, meets it there about two months after the Fete (W *Rallick Nom*: Paran is back in Darujhistan two months on; R MoI ch. 4–5: the parley at Brood's camp; W *Murillio*: the meeting near Pale). So the outlaw road, Brisk going to Tavrin, Ohl's hospital tent, Kettle with the Black Moranth, and Tuft and Ohl going east all end in one camp. Only the empire road, the city road and Ellis truly part. **That camp is the natural place to open a sequel.**

| Road | MoI (from 2 months on) | DG (same year) | HoC (next year) | BH | TtH / OST | RotCG | DoD / TCG |
|---|---|---|---|---|---|---|---|
| **Outlaw** (with Onearm's Host) | Pale, the parley, Capustan, Coral. **The richest road.** | — | The Host's remnant (about 3,000) sails to Seven Cities, too late for Raraku | Plague; Dujek dies; Paran becomes High Fist | — | — | Kolanse under Paran |
| **Empire** (Genabaris and home) | — | Seven Cities, if their ship calls there | The Fourteenth Army forms | The Fourteenth | — | Quon Tali: the best home for this road | The Bonehunters |
| **City** (Darujhistan) | Kruppe, Coll, Murillio and D'Arle go to the parley as envoys; the city is quiet | — | — | Paran passes through for Lorn's sword | K'rul's Bar and the retired Bridgeburners; a Guild contract on Malazans; Rake dies in the streets; the Legate (OST) | — | — |
| **Disband** | Each squadmate to their own road (below) | | | | | | |

**Each squadmate's likely road** (from the fate pages, `story-bible.md` §1):
- **Brisk** → outlaw: Tavrin, Fourth Regiment of the Second, is in the Host's camp. On every other road she still knows where he is. Leads to MoI.
- **Kettle** → outlaw or Black Moranth: the Black Moranth side with Dujek (story bible 24.3 [?]), so the munitions train ends in the same camp; off the map until the Moranth matter again in OST. The Paviors' Guild job keeps her in the city (TtH/OST).
- **Tuft** → east with the Rhivi and the child: within two months that is Brood's camp by Pale (MoI); after Coral, off the map.
- **Ohl** → Dujek's hospital tent (MoI), or Genabaris with needles for Seven Cities (DG territory), or Jeth Arrow's room at the Phoenix (city), or east with Tuft.
- **Ellis** → after Toc: off the map, and must never find him (rule 5); or scout for the Host (MoI); or the Genabaris dock; or the city's horse-market.
- **The sergeant** → follows the chosen road.

**Hard limits** (break none):
- **MoI.** Not among Paran's thirty-eight Bridgeburners; not in Coral's keep. Whiskeyjack, Hedge and Trotts die at Coral (W), and Twist (FC only); six Bridgeburners survive: Antsy, Blend, Bluepearl, Mallet, Picker, Spindle (W *Bridgeburners*). The two marines guarding Silverfox are killed (FC). The Host falls from about 10,000 to about 3,000 (FC; HoC's 3,000 per W *Dujek Onearm*).
- **DG.** The Chain of Dogs and the fall at Aren leave almost no survivors (FC; *memory* for names). Kalam and Fiddler are there; keep the Fourth clear of their scenes.
- **HoC to TCG.** The Fourteenth's marine squads are named almost man for man; a Fourth Squad already exists (Fiddler's). No room to insert ours.
- **BH.** Plague in the Host; Dujek dies of it.
- **TtH.** The K'rul's Bar Bridgeburners are a closed group; Mallet dies there; Rake dies; Murillio dies.
- **RotCG.** Units are loosely listed: room for the empire road.
- **Off the map:** MT, RG, SW, B&B (other continents).
- **Who must not be present:** the Fourth never stands in a scene that canon lists by name (Coral's keep, Paran's 38, the K'rul's Bar regulars, the Fourteenth's marines), and never meets Toc at Morn.

**What a sequel inherits from the player** (none contradicts canon while §(a) holds): squadmates dead in Ch6; a squad that reported to the Claw; a pardon (worthless once the Host is reinstated after Coral); the unsigned order to fire the mines; a mage marked by Shadow or by Rake's people; a scout who went into the grey and came back; Sethand's vow of silence about the child, which is why no canon character ever hears of her from the Fourth.

---

## (e) Timeline by Burn's Sleep year

Never print a BS year in game text (rule 13). This is for writers only.

| BS | Event | Source | Agreement |
|---|---|---|---|
| 1154 | GotM Prologue: the Mouse Quarter purge; last year of Kellanved. NoK (Kellanved and Dancer ascend). | W *GotM/Prologue*; F; W *Tayschrenn* (NoK 1154) | two |
| 1161 | GotM ch. 1: Itko Kan; Paran joins Lorn; Sorry enlists. | W *GotM/Chapter 1*; F | two |
| 1163 | GotM ch. 2 to Epilogue (about one month; the Fete ends it). DG prologue. | F; W *Burn's Sleep*; a reader's day count on r/Malazan | two |
| 1164 | MoI (from two months after the Fete); bulk of DG; HoC per the timeline summary. | F; W *Burn's Sleep* | two |
| 1165 | BH (prologue 1164), RG (into 1166). RotCG is after BH. | F; W *Return of the Crimson Guard* (after BH only) | one |
| ? | TtH, DoD, TCG, OST. TtH and OST are some years after MoI. | *(memory: TtH about 1166–67; OST some months to a year after TtH)* | unverified |

**Known inconsistencies.**
- **The year boundary.** The Fete is the Daru new year at winter's end (W *Fête of Gedderone*), but the Malazan count stays at 1163 through GotM, and MoI, two months on, is 1164 (F; r/Malazan day count). So "the same year" depends on whose calendar.
- **HoC.** The book prints 1159; Erikson is quoted saying the prologue and later year should both be 1159; the worksheet's own analysis of Karsa argues 1163; its prologue entry reads "1139" (a likely typo). (F)
- **MT.** Summary 1162 (rough order "1162–3"), but one entry sits under 1159. (F)
- **BH.** Prologue 1164 gives Laseen's 22nd year, which the worksheet's other Laseen dates put at 1176. (F)
- **Tellann dating.** GotM and MoI give different Tellann year names a year apart. (F)

---

## (f) The gods who answer a wipe

The game's patrons (`src/31c_stakes.js`) and what becomes of each, so a later chapter can keep or replace them.

- **Hood** (Death). Active through BH and RG. **TtH: Rake beheads him with Dragnipur**; after Dragnipur falls, Whiskeyjack and the Bridgeburners become the Guardians of the Gate. DoD: Hood returns to his frozen body on the Ice Throne and leads his fourteen undead Jaghut. TCG: active again at the Spire. Not available as a patron for scenes set after TtH; a sequel should answer with the Guardians of the Gate. [W *Hood*]
- **Oponn** (the Twins of Chance). MoI: they have let Paran go. BH: in Malaz City the night Tavore arrives; something terrifies them and Shadowthrone throws them out of Obo's tower. DoD: revealed as heirs of Sechul Lath. B&B: taunt T'riss. Still about, diminished and scared. [W *Oponn*, *Ammanas*]
- **Shadowthrone** (Ammanas). Active in every book through TCG, scheming; still King of High House Shadow at the end. Never name him Kellanved or Ammanas in game text (rule 13). [W *Ammanas*; W *Shadowthrone* returned 402]
- **Cotillion** (the Rope). Active through TCG; at the end he stabs the Crippled God and sends him home. GotM 23.1: Paran gives him Chance; whether he kept it is not said. [W *Cotillion*; R GotM 22–23]
- **Soliel** (**Mistress of Healing**, not "Lady of Health"). Sister of Poliel. BH: speaks through a chosen girl; agrees to heal the Host, at a cost to Paran; Poliel is killed by the Deragoth. [R BH ch. 15; W *Soliel* returned 402 twice]
- **Fener** (the Boar, the Lord of Summer). **DG: torn down into the mortal world** by Heboric. MoI: Treach takes his place as god of war; his Grey Swords turn to Togg and Fanderay. RG: hiding in Letheras. **TCG: killed** at the Spire when Karsa breaks a tusk in his Darujhistan temple; his blood makes the Imass and the undead Jaghut mortal. Not available as a patron after DG. [W *Fener*]

---

## (g) Closing the "Not verified" list

Forward-canon §6 and its medium, low and *memory* items, re-checked. **Closed** = two sources agree. **One source** = supported, not closed. **Open** = no answer found.

### §6: pages and memory items

| Item | Answer | Source(s) | Status |
|---|---|---|---|
| Wiki pages never reached | This pass reached: Whiskeyjack, Fiddler, Hedge, Mallet, Trotts, Bridgeburners, Crokus Younghand, Kruppe, Coll, Murillio, Rallick Nom, Baruk, Anomander Rake, Crone, Mhybe, Silverfox, Tayschrenn, Dujek Onearm, Toc the Younger, Onos T'oolan, Raest, Lorn, Moon's Spawn, Otataral, T'lan Imass, Nathilog, Genabaris, Mother Dark, Turban Orr, Daru, Hood, Oponn, Fener, Cotillion, Ammanas, Burn's Sleep, Fête of Gedderone, GotM Prologue/Ch1/Ch5/Ch24/Epilogue. Still 402: Ganoes Paran, Quick Ben, Kalam Mekhar, Apsalar, Vorcan, Soliel, Shadowthrone, Madrun, Onearm's Host, Battle of Black Coral, Chain of Dogs, Worry Gate, Jammit's Worry, Gedderone's Fete, Orb Sceptre Throne. Finnest House, Deck of Dragons, Darujhistan, Ocelot and the Timeline were not retried. | W | — |
| BS years of TtH, RotCG, OST | RotCG is after BH. No year found for any of the three. | W *RotCG*; F has no entries | open |
| No later book lifts the mines | No source found either way. | — | open (*memory*) |
| Mother Dark's timing | She turns from the Andii through MoI–BH and settles in Black Coral when Rake sacrifices himself (TtH). Rule 11 holds. | W *Mother Dark* | one source |
| Madrun | Not reached (402 twice). | — | open (*memory*: a masked estate guard in TtH/OST) |
| Raest's look as guardian | No later description found. W gives a general gaunt, near-fleshless look and his doings: guardian, "manservant" (BH), cat (TtH), cards (OST). Undead, not dead. | W *Raest* | one source |
| Who survives Aren | Not reached. | — | open (*memory*) |
| Daru coin and language | W *Daru*: a people and a district; nothing on language or coins. F: the population is mainly Daru and Gadrobi. | W, F | open |
| Which leg | Not found. A pillar falls on it (W); "his leg" in every summary. | W *Whiskeyjack*; R | open: never write left or right |
| Moon's Spawn before the Fete | W: south of the city, "possibly over the Dwelling Plain". During the Fete it comes down over the roofs (R 23.3; W). No second source found. **Lead's ruling: keep it over the lake.** | W *Moon's Spawn* | one source; ruled |
| West at dawn | West as it leaves (R 24.6; W ch. 24 gives no direction). South by the Epilogue, seen from Lake Azur (W *GotM/Epilogue*; W *Moon's Spawn*: "drifting south"). MoI: hidden south-east, in Ortnal's Cut by Coral (W). | R, W | **closed** (west, then south) |
| Paran carries Lorn's sword through MoI | Not said. He wears it in the Epilogue (R E.2); it lies buried at Coll's estate by BH, burial date unknown. | R; W *Lorn*, *Coll* | open |

### Medium items

| Item | Answer | Source(s) | Status |
|---|---|---|---|
| Seasons (46:2267 "all winter", :2302 "the whole first winter", :2309 "In the spring", :2278 "It took a year") | The Fete is at winter's end (the Daru new year); the parley is two months on; Coral falls within MoI. No winter camp between the Fete and Coral. | W *Fête of Gedderone*; F (MoI two months on); r/Malazan day count | **closed**: "all winter" and "first winter" are wrong for the outlaw road |
| The Host outside Pale | The parley is at Brood's camp near Pale about two months on. | R MoI ch. 4–5; W *Murillio* | **closed** |
| The empire road to Genabaris | Genabaris is a port on the north-west coast; Paran landed there and was flown to Pale. "Round the lake" is wrong; "north-west, wide of Pale" or by water. | W *Genabaris*; R GotM 3.1–3.2 | **closed** |
| Otataral and the Elder warrens | Kurald Galain and Tellann are immune. Omtose Phellack is not mentioned. | W *Otataral* | one source: exempt A Courtesy of Darkness; Omtose Rime unconfirmed |
| Otataral's reach; where it is mined | It works on the bearer and on magic aimed at the bearer; no range is given. Mined at Dosin Pali and in the Tanno Hills, Seven Cities. | W *Otataral* | one source |
| Nathilog | Among the first northern cities the Empire took; Second Army veterans at Pale fought there. No year. | W *Nathilog* | one source: "two years" is unlikely, drop the number |
| The T'lan Imass under Laseen | **Disagrees with FC.** Tattersail (GotM ch. 2) says they would not acknowledge Laseen, went into the Jhag Odhan, and came back at half strength; MoI says the Logros served until shortly after Kellanved's death; yet in GotM Tool serves Lorn on Laseen's orders. | W *T'lan Imass*; chronology 9.2, 14.1 | open: see Questions |
| Lorn and Tool | Tool stays at the barrow; Lorn enters the city alone. | R 19.7 and 20.3 (chronology 19.5, 20.3); W *Onos T'oolan* (he goes to the barrow, not the city) | **closed** |
| The Azath's yard | It takes one: the Tyrant's form is dragged into the garden by roots (22.12). Rallick and Vorcan go into the house (24.4). | R 22.12, 24.4; W *Raest* | **closed**: "a yard with room for" |
| Moon's Spawn before the Fete | See §6 above. | | ruled |

### Low items

| Item | Answer | Source(s) | Status |
|---|---|---|---|
| "gave it back" (Chance) | Paran gives Chance to Cotillion in Shadow: "gave it away". | R 23.1; W *Cotillion* | **closed** |
| Crone "before the Imass learned to count" | Crone is the eldest Great Raven, over 120,000 years; the Imass go back 300,000 years (Pran Chole, 11.1). The boast is false as fact; as Crone's own boast it may stand. | W *Crone*; R 11.1 | **closed** (as fact) |
| "Daric" for the Daru tongue (9 times) | No source names the language. | W *Daru* | open |
| "Tuesday" (43:595, :1354) | No source gives Genabackan weekdays. An Earth weekday in a world without one; a style call. | — | open |
| "every stick", "Ran powder" (14_data) | Not checked. | — | open |
| Freed Hounds run to "a door" (36b:353) | Not checked (*memory*: the gate rides on Dragnipur's wagon). | — | open |
| "a silver councillor" (42:1045) | No source names the coins. | — | open (*memory*: "council") |
| The Fander rite the morning after (45:2348) | W: the Wolf Goddess of Winter rite is a week before the Fête. F: the Flaying of Fander "marks the dawn of Gedderone". Neither puts it the morning after. | W *Fête of Gedderone*; F *Darujhistan* | sources disagree on when; both against "the morning after" |
| Lamps "for three hundred years" (46:128) | The gas has fed at least one district for nine hundred years (GotM, UK p. 130–1). | F *Darujhistan* | one source |
| "the lakefront, where the Council's houses are" (42:1395) | Nobles' estates are on the fourth, highest tier around Majesty Hill; the Lakefront is the third tier up from the harbour. | F *Darujhistan* | one source |
| Crone "it" in narration | Canon calls her "she". | W *Crone*; FC | **closed** |
| Turban Orr works sorcery (45:1205–1210) | W: the best duellist in the city, nothing on sorcery. R 22.3: Vorcan is surprised Rallick got past "Orr's protections", which suggests wards, not spellcraft of his own. | W *Turban Orr*; R 22.3 | one source each; open |

### The two named questions

- **Jammit's Worry or Jatem's Worry.** F (the Darujhistan worksheet) gives "Jammit's Worry, the east road", citing the GotM glossary. The official map gives "Jatem's Worry". No second source for either spelling was found (web search; W pages 402). **Unconfirmed. Keep "Jammit's Worry"** per the lead's settled decision.
- **Moon's Spawn before the Fete.** W alone puts it south of the city, hedged "possibly over the Dwelling Plain". **Keep it over the lake** per the lead's ruling.

---

## Questions the lead should know about

Findings that would change game text or the bible. Lines at 7b9647d.

1. **The bible's §8.49 is wrong: Hedge does not die in GotM** (`docs/story-bible.md:145`, §9 Ch7 row `:171`). He dies at Coral in MoI (W *Hedge*; FC's own table). The game's living Hedge (`c6_mines_kettle`, `c7_hedge`) is canon; nothing to change in `src`. Fiddler mourning Hedge in E.3 is not in W's Epilogue.
2. **The bible's §8.50 may overstate the departure slip** (`docs/story-bible.md:146`). W's Epilogue sets all three scenes on Lake Azur, with Circle Breaker watching the coin go in, and gives no coast. The game's lake departure may be right; "the morning tide" (`src/46_chapter7.js:495`) is still wrong for a lake.
3. **T'lan Imass: do not apply FC's medium fix yet** (`src/44_chapter5.js:210`, `src/35_pack_journal_save.js:100` "They fight beside the Empire."). Tool serves Lorn under Laseen in GotM, and Tattersail says they came back at half strength. "The Empire has an army of them" is shaky; "They fight beside the Empire" is defensible.
4. **Otataral exemption** (`src/16b_tricks.js:33`, `:36`): Kurald Galain's immunity has one source; Omtose Phellack's has none. If the rules change, exempt A Courtesy of Darkness only, or wait.
5. **Seasons on the outlaw road** (`src/46_chapter7.js:2267` "all winter", `:2302` "the whole first winter"): closed by three sources. "That season" / "that first campaign".
6. **The Fander rite** (`src/45_chapter6.js:2348`, priestesses at first light the morning after): both sources put the rite before or at the Fête's start.
7. **Lamps** (`src/46_chapter7.js:128` "three hundred years"): one source says nine hundred.
8. **Turban Orr's spell in the duel** (`src/45_chapter6.js:1205`–`1210`): one source says swordsman only, one suggests wards. If kept, it reads as a ward firing, not a spell he shapes.
9. **The bible's 3.2/8.1 Green Moranth and boat**, 15.9 Hound names (Doan, Ganrod), 19.4 "Whiskeyjack and Dujek", 21.12 (tiger mask, Baruk presiding, D'Arle seconding), 22.8 terrace and the Black Moranth in 24.3 are not in the summaries read. Treat as unconfirmed.
10. **Paran later lives in the Finnest House** (MoI, BH: W *Raest*, *Bridgeburners*). Rule 6 still holds for the game, but a sequel set in Darujhistan will need it.
