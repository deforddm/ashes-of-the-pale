/* ============ Book Two: Deadhouse Gates — the squad, the Chain, Hackle ============ */
/* Book Two is its own campaign: a new squad of the Seventh on the Chain of Dogs, from the fall of Hissar toward Aren.
   Its chapters register with registerChapter(n, CH, 'dg') (90) and its ids carry a b2_ prefix (areas, nodes, fights, flags).
   This file holds what the book needs outside a chapter: the four new squadmates and the sergeant's Book Two history,
   the dog, the Chain (water and the column), the import from a finished Book One, the glossary and the gods. */

const DG_PORDER = ['sgt', 'haddat', 'sathi', 'tangle', 'marrow'];

/* the sergeant in Book Two: the same hands (stats and abilities as Book One), a different life */
BOOKSNAP.dg.sgt = Object.getOwnPropertyDescriptors({
  name:'', role:'Sergeant', sig:'S', col:'#d6a24a', hp:22, ac:14, atk:4, dmg:[1,8,2], rng:1, mv:4, init:1, st:{might:2, wits:2, guile:1}, ab:['rally','shove','salve'],
  epithet:'Third Squad, Hissar garrison, the Seventh Army', origin:'Jakata, Quon Tali', age:36, service:'Fourteen years, the last six in Seven Cities', height:'Middling, and burnt dark by six summers of the Holy Desert.',
  weapon:'Malazan longsword, and a shield that has had three regiments painted on it and shows all of them', armour:'Boiled leather over quilting, a scarf wound against the sand, an iron cap too hot to wear by noon',
  bio:`Six years in the Hissar garrison, which in the Seventh counts as a long time in one place. Knows which wells in the old city are sweet and which have a dead dog in them, and the Hissari word for both.`,
  bio2:`Came out to Seven Cities as a corporal with a promise of a year's posting, and stayed because nobody sent the relief. Owes a debt in the water-sellers' quarter that the Empire does not know about: a winter of fever, a family that took in a foreign soldier and nursed the fever out, and a promise to an old man named Ressan that if the city ever burned, the sergeant would come for his daughters first. The city is burning.`,
  traits:['Speaks gutter Hissari better than the officers speak Malazan', 'Drinks water slowly, always', 'Counts the column the way other sergeants count the squad', 'Will not sit on a horse unless ordered'],
  gear:['A water-seller\'s brass token from Ressan, worn smooth', 'The squad roll, wrapped in oilcloth', 'Field kit: needle, thread, salt'],
  get quest(){ const f = (S && S.f) || {}; return f.b2_ressanOut ? `Ressan's daughters are in the column. Ressan is not. The sergeant has kept half a promise, and walks beside the half that is left.` : `A promise to an old water-seller in Hissar: if the city ever burned, come for his daughters first. The city is burning.`; },
});

Object.assign(TPL, {
  sathi:{name:'Sathi', role:'Outrider · Weasel Clan', sig:'W', col:'#c8a24a', hp:15, ac:13, atk:4, dmg:[1,8,1], rng:5, mv:6, init:3, st:{might:1, wits:2, guile:2}, ab:['mark','salve'],
    epithet:'"The dog is the clever one. I only ride."', origin:'The Wickan plains, Weasel Clan', age:17, service:'One summer with Coltaine, and every summer before it on a horse', height:'Small, and all of it braced for a fall.',
    weapon:'A Wickan horse bow, short and doubled back on itself, and a long knife she uses for everything else', armour:'Hardened hide, fringed. A string of Weasel teeth at her throat',
    bio:`Rides like the horse is a thing she thought of. Shoots from the saddle at a gallop and is insulted when anyone is impressed. Sent down from the plains with the clans when Coltaine came to the Seventh, and has not forgiven the lowlands for being flat in the wrong way.`,
    bio2:`The Weasel Clan sent its young with Coltaine to learn the Malazans, and Sathi has learned them: they are slow, they are brave about the wrong things, and they will not eat dog. Her dog Hackle, a Wickan cattle-dog the colour of old rope, was born the same summer she was given her first horse, and the clan considers them one animal with two minds. Hackle is the clever one. Sathi will tell you so. She means it as a boast.`,
    traits:['Talks to Hackle in Wickan and to everyone else not at all', 'Sleeps with one hand on the dog', 'Will not walk where she can ride', 'Laughs at funerals, which is Wickan manners and nobody\'s told the squad'],
    gear:['A bone whistle Hackle answers and nobody else can hear properly', 'Dried horse-meat, which she offers to everyone, once', 'A Malazan army blanket she has cut a hole in to wear'],
    get quest(){ const f = (S && S.f) || {}; return f.b2_sathiCrows ? `She saw the crows come down over Coltaine's tent the night Hissar burned, and says it means something. She will not say what. She is seventeen and has decided to be sure of it.` : `The clans came south for Coltaine. Sathi came for the horses, and stayed for the dog, and is not yet sure why she is still here.`; },
    banter:[`"Hackle says you walk like a cow, Sergeant." Hackle has said nothing. Hackle is asleep.`, `"Lowlanders. Your whole country is a floor."`, `"When the Weasels fight, we laugh. Do not be offended. You should be laughing too. You will live longer."`],
    rel:{haddat:'Thinks Haddat is a fine soldier and a bad Hissari, and says so in Wickan, which Haddat understands.', tangle:'Calls him "the one who smells of fire". Lets Hackle sleep on his feet.', marrow:'Watches her heal the way a horse-breaker watches a foal: as if it might bolt.'}},
  tangle:{name:'Tangle', role:'Sapper · Mincer\'s company', sig:'T', col:'#e07a45', hp:16, ac:13, atk:3, dmg:[1,8,0], rng:5, mv:4, init:2, st:{might:1, wits:2, guile:2}, ab:['sharper','burner','cusser','smoker','salve'],
    epithet:'Fuse-cord round both wrists. Counts everything twice.', origin:'Itko Kan', age:31, service:'Ten years, sapper the whole of it', height:'Long and bent, like something folded to fit in a satchel.',
    weapon:'A crossbow with a cradle he built himself, and a satchel of Moranth munitions that will not be refilled this side of Aren', armour:'Leather apron over a jerkin, scorched. Ears that ring',
    bio:`One of Captain Mincer's sappers, which means he has dug a great many holes in Seven Cities and filled some of them with things the Moranth make. Counts the satchel at every halt. There is nobody this side of the sea to sell him more, and he knows exactly how much that is.`,
    bio2:`Got the name from the fuse-cord he wears in coils round both wrists, and the habit of looping it round anything that stands still long enough. Learned his trade under a sapper who was famous for being careless and is now famous for being dead. Tangle has decided to be famous for neither. He hums under his breath while he works, the same four notes, and stops when it matters; the squad has learned to listen for the stop.`,
    traits:['Hums four notes over munitions and stops when it matters', 'Ties knots in anything', 'Keeps a tally of the satchel scratched on his crossbow stock', 'Will not tell a joke, but laughs at all of them'],
    gear:['The satchel, and a tally of it on the stock', 'Fuse-cord, a great deal of it', 'A Kanese prayer bead with no prayer he can remember'],
    get quest(){ return `There is no Moranth quartermaster within a thousand leagues. Every sharper Tangle throws is one fewer forever, and the satchel is the only thing he counts out loud.`; },
    banter:[`"Three sharpers, two burners, two cussers, two smokers. Same as this morning. Don't make me say it at the next halt."`, `"Mincer says pave the ford. I say pave the ford. The ford says nothing, which is how I like a ford."`, `"Point. I'll make it go away. Just don't point at anything you want back."`],
    rel:{sathi:'Lets the dog sleep on his feet and pretends not to notice.', haddat:'Owes her his life from a riot in the old city. Pays in water.', marrow:'She stitched his ear. He still hears it.'}},
  haddat:{name:'Haddat', role:'Hissari auxiliary · Shield', sig:'H', col:'#cfc6b4', hp:24, ac:15, atk:4, dmg:[1,8,2], rng:1, mv:4, init:1, st:{might:2, wits:1, guile:1}, ab:['bash','salve'],
    epithet:'"I took the Empire\'s silver. I keep my word on it."', origin:'Hissar, the water-sellers\' quarter', age:28, service:'Seven years, auxiliary', height:'Tall, broad in the shoulder, and still as a post when she listens.',
    weapon:'A tulwar, a round shield with the Hissari auxiliary\'s faded blue, and a boot knife', armour:'Mail shirt over a long coat, a head-cloth that is also a bandage when it needs to be',
    bio:`A Hissari woman who took the Empire's silver when she was twenty-one and has kept her word on it ever since, which in Seven Cities this summer is a kind of madness. Speaks the tribes' tongues and the city's, and every parley the squad has goes through her mouth.`,
    bio2:`Her family sold water in the quarter where the sergeant once lay sick, and her brother Ilhar rode out of the city two nights before it fell, with a green cloth tied round his arm. She knows what the cloth means. She has not said his name since, and when the Apocalypse rides past the column with green cloths flying, she looks at every face.`,
    traits:['Prays five times a day, to no god she will name', 'Never raises her voice; never needs to', 'Counts the dead in the column, by name when she knows them', 'Will not eat until the squad has eaten'],
    gear:['A blue thread from her mother\'s veil, tied to the shield grip', 'A water-seller\'s cup, tin', 'The auxiliary\'s brass badge, polished every night'],
    get quest(){ const f = (S && S.f) || {}; return f.b2_ilharSeen ? `Ilhar rides with the rebellion. She has seen him now, across a field, with a green cloth on his arm. He saw her. Neither of them lifted a hand.` : `Her brother rode out of Hissar two nights before it fell, with a green cloth round his arm. She looks at every face that rides past the column.`; },
    banter:[`"Sergeant." She says it in Hissari, which makes it sound like an oath.`, `"The tribes say we are traitors. The officers say we are tribes. I say the column needs water."`, `"Stand behind the shield. That is what it is for. You are welcome."`],
    rel:{sathi:'Answers the girl\'s Wickan insults in Wickan, which delights her.', tangle:'Pulled him out of a riot in the old city. Will not discuss it.', marrow:'Carries her kit when the healer is too tired to. Says nothing about that either.'}},
  marrow:{name:'Marrow', role:'Healer · Denul', sig:'M', col:'#7fb394', hp:15, ac:12, atk:2, dmg:[1,6,0], rng:1, mv:4, init:0, st:{might:0, wits:3, guile:1}, ab:['mend','wash','stanch','salve'], magic:true,
    epithet:'"Something is wrong with the warren. Not with me."', origin:'Nap', age:40, service:'Twelve years, nine of them as a squad healer', height:'Spare, sun-cracked, and always sitting down when she can.',
    weapon:'A knife, for cutting bandages and occasionally people', armour:'A healer\'s coat with too many pockets, and a hat against the sun',
    bio:`A Napan healer with a dry mouth and steady hands who has kept the Third Squad alive through six summers of Seven Cities. Reaches into Denul the way other people reach into a well, and this summer the well has started giving back something she does not like the taste of.`,
    bio2:`Trained at a temple of Soliel in Nap and left it for the army, for reasons she describes as "theological" and nobody pushes. Since the rising began her warren has gone strange: thin some days, thick and wrong on others, as if something enormous were wading through it a long way off. She still heals. She has started to count how often it works.`,
    traits:['Sits down whenever she can', 'Names the warren\'s moods like weather', 'Keeps a tally of the healings that took and the ones that didn\'t', 'Calls everyone younger than her "child", including the sergeant'],
    gear:['Needles, gut, a tin of salve she makes herself', 'A small wooden Soliel, faceless with handling', 'A tally-string, knotted'],
    get quest(){ return `Denul has gone strange in Seven Cities: thin some days, thick and wrong on others. Marrow keeps a knotted string, one knot for every healing that took. She has started to need a second string for the others.`; },
    banter:[`"Sit. No, sit. I am not doing this standing up, child."`, `"The warren's thin today. Try not to be stabbed."`, `"Soliel answers when she likes. I answer whether I like it or not. That's the difference between a goddess and a sergeant."`],
    rel:{sathi:'Calls her "foal". Sathi has decided to allow it.', tangle:'Stitched his ear after the Hissar riot, and still checks it.', haddat:'Leans on her at the end of a march and has never once said thank you, which Haddat counts as trust.'}},
});
Object.assign(VERB, {sathi:'looses an arrow at', tangle:'looses a quarrel at', haddat:'cuts at', marrow:'stabs at'});
Object.assign(STATUP, {sathi:['guile','wits'], tangle:['wits','might'], haddat:['might','wits'], marrow:['wits','guile']});
Object.assign(PICKS[3], {
  sathi:[['quickshot','Two on the Run','Once a fight: two arrows at one target within reach (three from level 6). The Weasel way: from the saddle, at a gallop, laughing.'],['ghost','Low in the Saddle','Enemies take −2 to hit Sathi. She is never quite where the horse is.']],
  tangle:[['longfuse','Crossbow Cradle','A cradle under the crossbow: sharpers, burners, smokers and cussers never scatter, and reach one tile further.'],['sappers_eye','Sapper\'s Eye','The squad rolls +2 initiative, and Tangle\'s free swings hit +2. He has seen this ground before; he has seen all ground before.']],
  haddat:[['shieldwall','Shield Wall','Squadmates standing next to Haddat get +2 armour.'],['holdline','Hold the Line','Haddat\'s free swings are unlimited and hit +2.']],
  marrow:[['triage','Field Triage','Mend heals +3 and reaches 4 tiles.'],['argument','Argument with Hood','Once a fight: a downed squadmate within 2 stands up at 6 health. Strain 3.']],
});
/* the gods who answer for Book Two's squad, most loyal first (31c) */
Object.assign(PATRONS, {
  sathi:{god:'the spirits', title:'The spirits of the Wickan plains', txt:id => `Hackle stands over Sathi with his hackles up and his lips back, and the ground under the dog goes cold, and then the cold goes outward.\n\nSomething old comes up out of the earth of a country that is not its own and looks round at the squad, the way a herd-spirit looks at a herd. The Wickans do not pray. They do not need to. The land remembers who is owed.`},
  tangle:{god:'Oponn', title:'Oponn, the Twins', txt:id => `A cusser rolls out of Tangle's satchel. Tangle has not opened the satchel. It rolls the length of a man and stops against a stone, and every enemy close enough to see it decides, all at once, to be somewhere else.\n\nIt does not go off. Nobody will ever know if it could have. The Lady pulls; the Lord, back to back with her, is already writing it down.`},
  haddat:{god:'Hood', title:'Hood, Lord of Death', txt:id => `Haddat, on her knees, lays her shield flat over the sergeant and says five words in Hissari to no god she will name.\n\nOne of them answers. Somewhere there is a gate the size of the world, and this summer it stands open all across Seven Cities, and a grey hand on it pauses. *Not these. There are enough.*`},
  marrow:{god:'Soliel', title:'Soliel, Mistress of Healing', txt:id => `Marrow, face down in the dust, says something to the faceless wooden figure in her fist, and for a moment the warren is not strange at all. It is clean, and cool, and smells of temple oil.\n\nSoliel does not often answer soldiers. She answers healers who left her, sometimes. Marrow has never asked why. She ties a knot in the string.`},
});

/* Hackle, the Weasel Clan cattle-dog: fights at Sathi's side in every fight she is in, unless the fight says otherwise (noDog) */
FOES.hackle = {name:'Hackle', sig:'h', hp:14, ac:13, atk:5, dmg:[1,6,2], rng:1, mv:6, init:3, verb:'bites'};
{ const _mkAlly = mkAlly;
  mkAlly = function(k, x, y){ const u = _mkAlly(k, x, y); if (k === 'hackle') { u.name = 'Hackle'; u.maxhp = u.hp = 14 + 3 * lvB(); u.atk += lvB(); u.dog = true; } return u; }; }
{ const _battleDef = battleDef;
  battleDef = function(id, stage){ const d = _battleDef(id, stage); if (!d || !S || S.book !== 'dg' || d.noDog || !SQUAD().includes('sathi')) return d;
    const i = SQUAD().indexOf('sathi'), p = d.party[i] || d.party[d.party.length - 1];
    return Object.assign({}, d, {allies:[...(d.allies || []), ['hackle', p[0], p[1]]], dogIn:true}); }; }
/* Hackle smells an ambush before it springs: the enemy loses its surprise, once he is in the fight */
{ const _startBattle = startBattle;
  startBattle = function(id, opt = {}){ const dog = S && S.book === 'dg' && opt.surprise === 'e' && SQUAD().includes('sathi') && !(battleDef(id, opt.stage) || {}).noDog;
    const r = _startBattle(id, dog ? Object.assign({}, opt, {surprise:null}) : opt);
    if (dog && B) blog(`<em>Hackle growls, low, before anyone else has seen a thing. Sathi says one word in Wickan. Nobody is surprised.</em>`);
    if (S && S.book === 'dg' && B && B.def.dogIn) blog(`Hackle is at Sathi's knee, hackles up.`);
    if (S && S.book === 'dg' && B && S.chain && S.chain.water <= 0) blog(`<em>No water. Every mouth in the squad is dust: everyone starts a little hurt.</em>`);
    return r; }; }
/* no water: the squad starts every fight parched */
{ const _mkParty = mkParty;
  mkParty = function(id, x, y){ const u = _mkParty(id, x, y); if (S && S.book === 'dg' && S.chain && S.chain.water <= 0) { u.hp = Math.max(1, u.hp - 3); u.parched = true; } return u; }; }

/* ---- the Chain: water and the column ----
   S.chain.water: skins of water the squad holds (0..12). A full rest costs one (dgRest). At 0 the squad fights parched.
   S.chain.column: the refugees the squad has brought along and is keeping alive. The finale counts how many reach Aren. */
const CHAIN_MAXW = 12;
function chain(dw = 0, dc = 0, why = ''){
  S.chain ??= {water:8, column:0};
  const w0 = S.chain.water, c0 = S.chain.column;
  S.chain.water = clamp(w0 + dw, 0, CHAIN_MAXW); S.chain.column = Math.max(0, c0 + dc);
  const dW = S.chain.water - w0, dC = S.chain.column - c0, bits = [];
  if (dW) bits.push(`${dW > 0 ? '+' : '−'}${Math.abs(dW)} water`); if (dC) bits.push(`${dC > 0 ? '+' : '−'}${Math.abs(dC)} in the column`);
  if (bits.length) note(`${why ? why + ': ' : ''}${bits.join(', ')}.`, dW < 0 || dC < 0 ? 'bad' : 'good');
  if (dC > 0) tally('columnIn', dC); if (dC < 0) tally('columnLost', -dC);
  updChain();
}
const chainW = () => (S && S.chain ? S.chain.water : 0), chainC = () => (S && S.chain ? S.chain.column : 0);
/* the march widget, for a node's html: the two numbers, and where on the road the column is */
function chainHTML(road){
  const w = chainW(), c = chainC(), cw = Math.round(w / CHAIN_MAXW * 100), cc = Math.min(100, Math.round(c / 60 * 100));
  return `<div class="chainbox" role="group" aria-label="The Chain">${road ? `<div class="road">${esc(road)}</div>` : ''}
    <div class="crow"><span>Water</span><b>${w} skin${w === 1 ? '' : 's'}${w <= 0 ? ' · parched' : ''}</b></div><div class="bar"><i style="width:${cw}%"></i></div>
    <div class="crow"><span>The column</span><b>${c} ${c === 1 ? 'soul' : 'souls'} with the squad</b></div><div class="bar col"><i style="width:${cc}%"></i></div></div>`;
}
function updChain(){ const el = typeof document !== 'undefined' && document.getElementById('chainp'); if (!el) return;
  if (!S || S.book !== 'dg' || !S.chain) { el.textContent = ''; return; }
  el.innerHTML = `<span class="chainpill"><span class="${S.chain.water <= 0 ? 'dry' : ''}">Water <b>${S.chain.water}</b></span><span>Column <b>${S.chain.column}</b></span></span>`; }
/* a full rest on the march costs a skin of water; with none, no rest */
function dgRest(t){ S.chain ??= {water:8, column:0};
  if (S.chain.water <= 0) { note('No water to spare: the squad sits in the shade it can find, and gets up no better.', 'bad'); return false; }
  chain(-1, 0, 'Rest'); rest(t || 'The squad rests in what shade there is. Wounds close, mostly.'); return true; }

/* ---- a fresh Book Two sergeant, and what a finished Book One can bring ---- */
function newStateDG(name, importId){
  name = name || 'Hask';
  const s = {v:1, book:'dg', sid:sidFor(name), name, scene:'chintro', node:null, bg:null, silver:12, xp:0, lvl:1, card:null,
    inv:{sharper:3, burner:2, cusser:2, salve:2, smoker:2}, loy:{haddat:0, sathi:0, tangle:0, marrow:0}, f:{}, pos:{x:5, y:8},
    trail:[{x:4, y:8}, {x:6, y:8}, {x:4, y:9}, {x:5, y:9}], log:[], ending:null, battle:null, bopt:null,
    squad:[...DG_PORDER], chapter:0, chapters:{}, area:'b2_hissar_gate', chain:{water:8, column:0}};
  if (importId) { const imp = dgImport(importId); if (imp) s.imported = imp; }
  return migrate(s);
}
/* only the road out of Darujhistan and who walked it: the empire road's ship can call at Aren (Book Two, Chapter 7) */
function dgImport(id){ const o = loadSlot(id); if (!o || !o.chapters || o.chapters[7] == null) return null;
  const road = o.chapters[7], follow = (o.f && o.f.c7_follow) || {}, mates = ['brisk', 'kettle', 'tuft', 'ohl', 'ellis', 'vell'].filter(k => (o.squad || []).includes(k) && !(o.dead && o.dead[k]));
  return {from:o.name, sid:id, road, lvl:o.lvl || 1, follow, mates, dead:Object.keys(o.dead || {}), loy:Object.assign({}, o.loy || {})}; }
const dgOldHands = () => { const i = S && S.imported; if (!i || i.road !== 'empire') return []; return i.mates.filter(k => !i.follow || i.follow[k] !== false); };

/* the HUD line on the map: water and the column, beside the silver (Book Two only) */
{ const _updSilver = updSilver; updSilver = function(){ _updSilver(); updChain(); }; }

/* ---- the words Book Two throws at you: [chapter, word, meaning, met?] ---- */
GLOSSX.dg = [
  [0, 'The Seventh', 'The Seventh Army, the Empire\'s garrison of Seven Cities. Coltaine of the Crow Clan commands it now, which the old officers have not forgiven.'],
  [0, 'Coltaine', 'Fist of the Seventh. A Wickan warlord who rebelled against the Empire, lost, and was given an army for it. The nobles call him a savage. The soldiers have stopped calling him anything.'],
  [0, 'Wickans', 'Horse clans of the plains north of Quon Tali: the Crow, the Foolish Dog, the Weasel. They came south with Coltaine. They ride as if the horse were an idea they had.'],
  [0, 'The Whirlwind', 'The rising. A goddess in the sand of Raraku, a prophet called Sha\'ik, and a Holy Book. Every city in Seven Cities has heard the Whirlwind say its name this summer.'],
  [0, 'The Apocalypse', 'What the rebels call their war, after the Book of Dryjhna. Rebels wear a green cloth.'],
  [0, 'Warrens', 'The paths of power mages draw on. In Seven Cities this summer they are fouled: thin some days, wrong on others, as if something huge were wading through them.'],
  [0, 'Denul', 'The warren of healing. Marrow\'s. It has gone strange.'],
  [0, 'Hood', 'The Lord of Death. His gate stands open across Seven Cities this summer, and every soldier knows it.'],
  [0, 'Moranth munitions', 'Clay grenades from the Moranth of Genabackis: sharpers, burners, smokers and cussers. Nobody in Seven Cities makes them. Every one thrown is one fewer, for good.'],
  [1, 'The Chain', 'What the column becomes: soldiers, refugees, cattle and carts, strung out for leagues, walking west to Aren with an army on every side. The soldiers have started calling it the Chain of Dogs.', ()=>S.chapter >= 1],
  [1, 'Duiker', 'The Imperial Historian, who came to Hissar to write the history of a quiet province. He rides with Coltaine now, and writes everything down.', ()=>!!(S.f && S.f.b2_duiker)],
  [1, 'Bult', 'Coltaine\'s uncle, and his second. Old, scarred, and the only man in the Seventh who laughs at the Fist to his face.', ()=>!!(S.f && S.f.b2_bult)],
  [1, 'Kamist Reloe', 'A High Mage of Seven Cities who was thought dead. He leads the first rebel army against the Seventh.', ()=>!!(S.f && S.f.b2_reloe)],
];

/* Book Two's chapters register in start() (90), after Book One's */
