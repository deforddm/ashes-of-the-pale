/* ============ Book Two: the Deck of Dragons on the Chain ============
   A reading in every chapter, at the chapter's first halt (Chapter 1: first light at the wagons, before the march). The reader is
   VISREADER (47): Marrow, else Yedda, else the old Kanese. The start node offers b2DeckChoice(n) → b2_cN_deck (the offer, in the
   reader's voice) → "Let her draw" sets the flags b2_cN_drawn and b2_cN_reader, deals from B2POOL[n] → cardSequence → b2_cN_card
   (the card inline, as Book One's c1_card) → back to where the start node was going. "Not now" sets b2_cN_noCard.
   A vision (56) opens from the card screen like Book One's and comes back to b2_cN_card (36b cardNodeName).
   Cards are only the canon Deck as Deadhouse Gates has it: no House of Chains, no Great Raven, no Wain. Book One's cards keep their
   effects, which are engine-wide (16, 31): Oponn, Obelisk, Knight, Assassin, Hounds, Herald. Book Two adds four of High Houses Death
   and Life (b2c_*), with their effects below. */

const B2CARDS = {
  b2c_king:{name:'King of High House Death', house:'High House Death', hue:'#b8c0b0',
    txt:'A hooded figure on a grey seat with no back to it, hands folded, and behind it a gate the size of the world with the dead walking through it, unhurried, as if every one of them had been invited.',
    fx:'The squad\'s blows do +2 damage to an enemy already at half its health or less.'},
  b2c_queen:{name:'Queen of High House Life', house:'High House Life', hue:'#d8b4c4',
    txt:'A woman seated in a garden at night, her face veiled, a cup overflowing in her lap, and the water running away from her feet into dry ground that goes green where it touches.',
    fx:'Every healing in a fight heals 2 more this chapter.'},
  b2c_mason:{name:'Mason of High House Death', house:'High House Death', hue:'#c0a07a',
    txt:'A broad, bent figure in a dusty apron with a mallet and a chisel, cutting a long stone to fit a long hole. The hole is a barrow. The stone is its door.',
    fx:'Munitions the squad throws do +2 damage to every enemy they catch.'},
  b2c_soldier:{name:'Soldier of High House Death', house:'High House Death', hue:'#9aa6ae',
    txt:'A soldier in grey armour with no badge on it, standing at a gate with the shield up, and behind the visor something that is not quite a face.',
    fx:'Every squadmate wears +1 armour this chapter.'},
};
Object.assign(CARDS, B2CARDS);

/* each chapter's pool leans to one card, as Book One's do (the Hounds in its Chapter 1) */
const B2POOL = {
  1:['hounds', 'hounds', 'hounds', 'oponn', 'obelisk', 'b2c_mason'],          // Hissar burns: Shadow's dogs are loose in Seven Cities
  2:['b2c_queen', 'b2c_queen', 'b2c_queen', 'oponn', 'hounds', 'knight'],     // the Odhan: water, fever, and a Red Blade's queen
  3:['b2c_mason', 'b2c_mason', 'b2c_mason', 'oponn', 'assassin', 'obelisk'],  // the Ridge: sappers in the ramp, a roof dropped
  4:['herald', 'herald', 'herald', 'b2c_soldier', 'oponn', 'knight'],         // the Vathar: a door held open for someone near
  5:['obelisk', 'obelisk', 'obelisk', 'b2c_queen', 'hounds', 'oponn'],        // the Dry March: something endures
  6:['b2c_soldier', 'b2c_soldier', 'b2c_soldier', 'herald', 'oponn', 'assassin'], // Sanimon and the split: the rearguard
  7:['b2c_king', 'b2c_king', 'b2c_king', 'herald', 'b2c_soldier', 'oponn'],   // Aren Way and the Barrow
};

/* ---- the effects: engine-wide, keyed on S.card, so they hold in any fight of the chapter ---- */
/* Queen of High House Life: every healing on the squad's side heals 2 more */
{ const _heal = heal; heal = function(u, n){ return _heal(u, S && S.card === 'b2c_queen' && u && u.side === 'p' && n > 0 ? n + 2 : n); }; }
/* Mason of High House Death: a blast the squad sets off hits every enemy in it for 2 more */
{ const _blast = blast;
  blast = function(pt, dice, col){
    if (!(S && S.card === 'b2c_mason' && B && B.cur && B.cur.side === 'p' && !B.cur.ally)) return _blast(pt, dice, col);
    const _hurt = hurt; hurt = function(u, n, crit){ return _hurt(u, u && u.side === 'e' ? n + 2 : n, crit); };
    try { return _blast(pt, dice, col); } finally { hurt = _hurt; } }; }
/* Soldier of High House Death: +1 armour for every squadmate */
{ const _atkCalc = atkCalc;
  atkCalc = function(a, t, o = {}){ const c = _atkCalc(a, t, o); if (S && S.card === 'b2c_soldier' && t && t.side === 'p' && !t.ally) c.ac += 1; return c; }; }
/* King of High House Death: the squad's blows on an enemy at half health or less do +2 */
{ const _attack = attack;
  attack = function(a, t, o = {}){
    if (S && S.card === 'b2c_king' && a && a.side === 'p' && t && t.side === 'e' && t.hp > 0 && t.hp * 2 <= t.maxhp) { const dd = o.dmg || a.dmg; o = Object.assign({}, o, {dmg:[dd[0], dd[1], dd[2] + 2]}); }
    return _attack(a, t, o); }; }
/* a fight opens with the card's word in the log, so the player can see it working */
{ const _startBattle = startBattle;
  startBattle = function(id, opt = {}){ const r = _startBattle(id, opt);
    if (S && S.book === 'dg' && B && B.log && CARDS[S.card] && S.card.startsWith('b2c_')) blog(`<em>${CARDS[S.card].name}:</em> ${CARDS[S.card].fx}`);
    return r; }; }

/* ---- the readers ---- */
const b2Rd = () => visReader();
const b2RdShe = (cap) => { const he = b2Rd().he; return cap ? (he ? 'He' : 'She') : (he ? 'he' : 'she'); };
const b2RdHer = (cap) => { const he = b2Rd().he; return cap ? (he ? 'His' : 'Her') : (he ? 'his' : 'her'); };
const b2RdObj = () => b2Rd().he ? 'him' : 'her';
const B2RD_DECK = {
  marrow:`Marrow has her Deck out: a temple deck from Nap, old, the paint gone soft at the corners from other people's fingers. She learned it from Soliel's priests, who read for the sick before they touched them, and she has kept it through twelve years of the army and never once explained why.`,
  yedda:`Yedda has a Deck out of her apron, wrapped in a square of rope-walk sacking: the cheap kind they sold by the south gate in Hissar, the paint bright and the wood thin. She reads the way the rope-walk women read, fast, and for money, except that she has never once asked the squad for any.`,
  kanese:`The old Kanese from the squad's stretch has his Deck out, wrapped in a faded prayer-cloth. Nobody knows his name. He walks by the carts, and reads for anyone who asks, and for nothing, and says his prayers in Kanese over every card he turns.`,
};
/* per chapter: the scene, where it is laid out, where the start node was going (back/backT), and the reader's own words */
const B2DECK = {
  1:{scene:'b2_odhan_day', on:'the tailboard of a water-cart', back:()=>{ startExplore(); talk('b2_march'); }, backT:'Back to the wagons.', // b2_march is a map node: back on the map, not a backdrop
    set:'First light, grey over the Odhan, and the wagons loading.',
    marrow:`"Soliel's priests read for the sick before they put a hand on them," she says. "I read for the squad before it walks. Sit, child. One card. For the road."`,
    yedda:`"My husband never let me read for him," she says. "Said it was asking for trouble. He's dead, so." She shuffles. "One card. For the road."`,
    kanese:`"For the road," he says, in Kanese, and then in a Malazan with most of the corners knocked off. "One card. No money."`},
  2:{scene:'b2_odhan_day', on:'a cloak spread in the shade of the cart', back:'b2_c2_start2', backT:'On toward Dryj.',
    set:'The noon halt, under a cloak on two spears, with the column lying in every shadow it can find.',
    marrow:`"Three weeks and nobody's asked me," she says. "I'm offended. The warren won't talk to me today, child. Perhaps the Deck will."`,
    yedda:`"You've the face of someone who's been told it's two days to water," she says. "Sit. One card. It's cheaper than hoping."`,
    kanese:`He has laid his cloth in the shade of a cart and is waiting beside it with the Deck, the way a man waits at a well. "One card," he says. "Before the water."`},
  3:{scene:'b2_odhan_dusk', on:'the lid of the squad\'s water-cask, by torchlight', back:()=>startExplore(), backT:'Make camp.',
    set:'Night on the long flat nothing, and the sound of the herders at the cattle all down the column.',
    marrow:`"Nobody's sleeping through that," she says, meaning the cattle. "We may as well read."`,
    yedda:`"They're saying the nobles are eating children," she says. "I don't believe it. Let's see what the Deck believes."`,
    kanese:`He has spread his cloth by the dry streambed with a candle-end stuck on a stone. "Bad night," he says. "Good night for cards."`},
  4:{scene:'b2_odhan_dusk', on:'a flat stone at the halt, with the dust behind', back:'b2_vathar_arrive', backT:'On, to the river.',
    set:'The evening halt, west of Gelor, with the dust behind the column that does not settle.',
    marrow:`"There's a river ahead, the Wickans say," she says. "Rivers make me want to know things. One card, child."`,
    yedda:`"Dust behind us every evening," she says. "I'd like to know whose. One card."`,
    kanese:`"A river soon," he says. "My mother crossed a river once, and never told anyone what was on the other side." He holds out the Deck. "One card."`},
  5:{scene:'b2_forest', on:'the leaf-litter at the side of the track', back:'b2_forest_arrive', backT:'On, under the trees.',
    set:'The first halt under the trees, in green shade nobody has seen since Hissar.',
    marrow:`She is sitting on a root with her back against a trunk, the first thing she has leaned on in weeks. "Trees," she says. "I'd forgotten. One card, child, while I remember how to sit in the shade."`,
    yedda:`"Leaf-litter," she says, scuffing it. "You can't read on leaf-litter. The cards slide." She reads on it anyway.`,
    kanese:`He has found a flat place by the track and wiped it with his sleeve. "A forest for the dead," he says. "We ask them, then. One card."`},
  6:{scene:'b2_odhan_dusk', on:'a shelf of rock above the seep', back:()=>startExplore(), backT:'Look round.',
    set:'The halt in the hills above Sanimon, with fires on every ridge for a league round.',
    marrow:`"Everyone's here," she says, looking at the ridges. "Every army in Seven Cities. Let's see who the Deck thinks is winning."`,
    yedda:`"Water out of a rock," she says. "My husband would have sold them rope to let a bucket down into it." She shuffles. "One card."`,
    kanese:`He is sitting by the seep, watching it fill a cup a drop at a time. "Long wait," he says. "Long enough for a card."`},
  7:{scene:'b2_aren_walls', on:'a cloth against Balahn\'s mud wall', back:()=>startExplore(), backT:'Look round.',
    set:'Dusk in Balahn, three leagues from Aren, and the village an island of mud walls in a sea of carts.',
    marrow:`"Three leagues," she says. "I've read for this squad since Hissar, child. Let me read for the end of it."`,
    yedda:`"Aren tomorrow," she says. "I said in Hissar I'd read for you at the gate. This is near enough."`,
    kanese:`He has spread his cloth against the mud wall. "Last road," he says. "Last card, maybe. Sit."`},
};
/* each card, said by each reader (Book Two's words for Book One's cards too: Tuft's lines are Tuft's) */
const B2SAY = {
  hounds:{d:'Seven shapes running under a moon that isn\'t there.',
    marrow:`"Shadow's dogs," Marrow says. "They're loose in Seven Cities this summer. The Wickans have seen the tracks." She doesn't put it back. "Walk quick, child."`,
    yedda:`"Dogs," Yedda says, and looks at Hackle. "Not that kind of dog." She taps the card. "It means keep moving. Everything means keep moving this summer."`,
    kanese:`The old Kanese breathes in through his teeth. "In Itko Kan they came through a village once," he says. "Every door open after. We walk fast now, yes?"`},
  oponn:{d:'The jesters of chance, back to back, and a coin in the air between them.',
    marrow:`"The Twins," Marrow says. "The Lady's pulling, for now." She looks at the coin a long moment. "Don't thank her, child. She hears."`,
    yedda:`"Luck," says Yedda, with contempt. "My husband had luck. Thirty years and never a rope broke on him, and then one did." She leaves the card face up anyway.`,
    kanese:`"The Twins," he says, and smiles with no teeth. "Good card, bad card. Same card. Today, good."`},
  obelisk:{d:'A standing stone, unaligned and older than anyone\'s gods.',
    marrow:`"Something endures," Marrow says. "The priests used to say that one meant the patient would live, and not to be too pleased about it."`,
    yedda:`"A stone," says Yedda. "It means you'll last. It doesn't say how well."`,
    kanese:`"Old stone," he says. "Older than Kan. It stays. We stay." He nods, as if that were settled.`},
  knight:{d:'A tall figure with a black sword, turned away.',
    marrow:`"High House Dark," Marrow says. "He's a long way from here. Genabackis, the soldiers say." She puts it down gently. "Somebody's watching something, child. It isn't us."`,
    yedda:`"A tall one with a sword," Yedda says. "Turned away. Good. I've had enough of men with swords turning round."`,
    kanese:`"Dark," he says. "Not for us. He looks the other way. Let him."`},
  assassin:{d:'A figure half in shadow, rope and knives.',
    marrow:`"The Rope," Marrow says, and makes a small sign with two fingers that the temple never taught her. "Shadow's knife. He's been busy in Seven Cities, they say."`,
    yedda:`"Knives," says Yedda. "And a rope." She sniffs. "That's a ropemaker's card. Somebody bought good rope."`,
    kanese:`The old man touches the card's edge and takes his finger back fast. "Shadow," he says. "Quick hands. Quick ends." He grins, suddenly. "Ours, today."`},
  herald:{d:'A grey figure with its face turned away, holding a door open for somebody you cannot see.',
    marrow:`Marrow looks at it a long time. "Hood's door," she says. "Held open. Not for us, child. For someone near us." She turns it face down. "I've had a great deal of near us this summer."`,
    yedda:`"Hood's man," Yedda says, flat. "Holding the door." She looks down the column. "Plenty of takers."`,
    kanese:`He covers it with his hand. "The door," he says. "Not you. Someone near you walks through it, and you stay." He takes his hand away. "That is the good reading."`},
  b2c_king:{d:B2CARDS.b2c_king.txt,
    marrow:`"Hood himself," Marrow says. She has gone grey round the mouth. "The King of High House Death. I've never drawn him. The priests said you only did when he was busy near you." She looks up the column, toward the Fist's tent, and does not say anything else.`,
    yedda:`"Him," Yedda says. Just that. Then: "He took my husband off a rope-walk. He's welcome to the ones who come at us." She leaves it face up.`,
    kanese:`The old Kanese takes off his cap, which he has not done for anything since Hissar. "The King," he says. "He walks with the column now. Be polite to him. He finishes what is started."`},
  b2c_queen:{d:B2CARDS.b2c_queen.txt,
    marrow:`Marrow laughs, short and surprised. "High House Life," she says. "A healer's card. Soliel's priests kept that one on the altar." She touches the cup with one finger. "The warren's going to like me better for a while, child. Don't get used to it."`,
    yedda:`"The Queen," says Yedda, and something goes out of her shoulders. "The rope-walk women prayed to her for the babies. It means things mend. A bit better than you'd think."`,
    kanese:`"Life," he says, surprised, as if he had forgotten the Deck had a card for it. "High House Life. The Queen." He smiles. "Good card. Good card."`},
  b2c_mason:{d:B2CARDS.b2c_mason.txt,
    marrow:`"The Mason," Marrow says. "High House Death's builder. He makes the barrows." She taps the mallet. "A sapper's card, if any card is. Tell Tangle."`,
    yedda:`"A stonecutter," says Yedda, "building something for Hood." She turns it to the light. "My aunt said that one meant the things you throw land heavy. She was wrong about most things."`,
    kanese:`"The Mason," he says. "He builds the house for the dead." He points with his chin at the dark beyond the fires. "Today he builds it for them."`},
  b2c_soldier:{d:B2CARDS.b2c_soldier.txt,
    marrow:`"Hood's soldier," Marrow says. "He stands at the gate and keeps it." She looks round the squad. "It means you'll be harder to send through. Not impossible, child. Harder."`,
    yedda:`"A soldier," Yedda says. "Hood's." She looks at you. "He'd like you to keep your shield up. So would I."`,
    kanese:`"Grey soldier," he says. "He guards the door from the wrong side. Today he guards it for you. Shields up, he says."`},
};
const b2CardSay = id => { const s = B2SAY[id], r = b2Rd().id; return s ? `${s.d}\n\n${s[r] || ''}`.trim() : ((CARDS[id] && CARDS[id].txt) || ''); };
/* the card screen in Book Two: the reader's captions, and the card's words without Tuft in them (21) */
CARDBOOK = {
  txt:id => { const s = B2SAY[id]; return s ? s.d : ((CARDS[id] && CARDS[id].txt) || ''); },
  cap(t, self, second){ const r = b2Rd(), n = r.name, she = b2RdShe(), her = b2RdHer(), Her = b2RdHer(true);
    const first = {marrow:'Marrow shuffles sitting down, the way she does everything.', yedda:'Yedda shuffles like a rope-walker paying out line.', kanese:'The old Kanese shuffles with his eyes shut.'}[r.id] || `${n} shuffles.`;
    const three = {marrow:'Three cards. She reads for the squad, never for herself.', yedda:'Three cards, and she doesn\'t charge you.', kanese:'Three cards. He says something over them in Kanese.'}[r.id] || 'Three cards.';
    if (second) return t < 1500 ? `${n} folds the card back into the spread.` : t < 2900 ? `Three again. The Deck lets ${b2RdObj()}, mostly.` : t < 4900 ? '' : t < 5800 ? 'Another comes up.' : '';
    return t < 1500 ? first : t < 2900 ? three : t < 3900 ? `The first card refuses ${b2RdObj()}.` : t < 4900 ? `The second card refuses ${b2RdObj()}.` : t < 5800 ? 'The third does not.' : ''; },
};

/* ---- the chapter's reading: a choice on the chapter's first halt, the offer, and the card ---- */
function b2DeckChoice(n){ const r = b2Rd();
  return {t:`Sit with ${r.mid || r.name} and the Deck.`, deck:true, req:()=>!S.f[`b2_c${n}_drawn`] && !S.f[`b2_c${n}_noCard`], go:`b2_c${n}_deck`}; }
function b2DeckOffer(n, card = `b2_c${n}_card`){ const D = B2DECK[n], r = b2Rd();
  return {sp:r.name === 'Yedda' ? 'Yedda · a ropemaker\'s widow' : r.name, scene:D.scene, txt:
`${B2RD_DECK[r.id] || ''}

${D.set} ${D[r.id] || ''}`,
    ch:[{t:`Let ${b2RdObj()} draw.`, deck:true, fx:()=>{ S.f[`b2_c${n}_drawn`] = 1; S.f[`b2_c${n}_reader`] = r.id; S.card = dealCard(B2POOL[n]); }, go:()=>cardSequence(()=>talk(card))},
        {t:'"Not now."', fx:()=>{ S.f[`b2_c${n}_noCard`] = 1; }, go:D.back}]}; }
function b2DeckCard(n){ const D = B2DECK[n], r = b2Rd(), id = S.card && CARDS[S.card] ? S.card : B2POOL[n][0], c = CARDS[id];
  return {sp:'The Deck of Dragons', scene:D.scene, txt:
`${r.name} lays the reading out on ${D.on}. Two cards refuse ${b2RdObj()}. The third does not.`,
    html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)}${c.fx ? ` · ${esc(c.fx)}` : ''}</div>`, oncard:[id, false],
    after:`${b2CardSay(id)}${id === 'b2c_queen' && typeof b2In === 'function' && b2In('redblade') ? `\n\nRamin, watching over ${r.he ? 'his' : 'her'} shoulder, says the Ehrlitan prayer to the Queen of Dreams under his breath, the one his mother said at the toll-gate.` : ''}`,
    ch:[{t:D.backT, go:D.back}]}; }
