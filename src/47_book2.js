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
    get quest(){ const f = (S && S.f) || {}; return f.b2_ilharSeen ? `Ilhar rides with the rebellion. She has seen him now, across the water at the Vathar, with a green cloth on his arm. He saw her. Neither of them lifted a hand.` : `Her brother rode out of Hissar two nights before it fell, with a green cloth round his arm. She looks at every face that rides past the column.`; },
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

/* ---- the Red Blade (v4.1, Chapter 2): a Seven Cities loyalist, lent to the squad after Sekala until the company remounts in Aren.
   One recruit at a time. He leaves with the Red Blades in Aren (Chapter 7). ---- */
Object.assign(TPL, {
  redblade:{name:'Ramin', role:'Red Blade · dismounted', sig:'R', col:'#c4483a', hp:20, ac:15, atk:4, dmg:[1,8,2], rng:1, mv:4, init:2, st:{might:2, wits:1, guile:1}, ab:['b2_lance','salve'],
    epithet:'"I am of the Red Blades. I am lent. I will be given back."', origin:'Ehrlitan, the Old Quarter', age:26, service:'Seven years, the Red Blades. Cavalry, until the Sekala',
    height:'Lean, very straight, and still wears his spurs.',
    weapon:'A lance cut down to a short spear after it broke at the Sekala, and a curved sword he keeps better than he keeps himself', armour:'Red-enamelled scale over chain, a slit-visored helm he carries more than he wears, and spurs with no horse under them',
    bio:`A Seven Cities man who swore to the Empire and meant it, which makes him a traitor to every tribe on the Odhan and a native to every Malazan in the column. The Red Blades are used to both. His horse died at the ford and most of his file died on the west bank, and his commander lent what was left of him to the squad, until the company has horses again.`,
    bio2:`Grew up in Ehrlitan, where his father kept the Empire's tolls on the Old Quarter gate and was spat at for it every day of his life. Joined the Red Blades at nineteen because they were the only people in the city who did not spit. He was in Ehrlitan the winter the company cleared the market, and he does not speak about the market. He speaks about the company, often, in the present tense, and about the day it will take him back.`,
    traits:['Polishes the red of his scale every night, whatever else is undone', 'Answers rebels in their own dialect, politely, and it makes them angrier', 'Counts the company\'s dead by name, out loud, at dusk', 'Will not take water before the squad\'s civilians have had theirs, and says it is an order he gave himself'],
    gear:['A lance-head on a broken shaft', 'A Red Blade\'s red sash, folded, for the day he has a horse to ride in it', 'A tin of enamel and a brush'],
    get quest(){ return `Lent to the squad after the Sekala, until the Red Blades remount. He says he will go back to the company the day it asks for him. He says it often enough that nobody doubts it.`; },
    banter:[`"The tribes call us lapdogs. A dog that knows its house is not the worst thing to be, Sergeant."`, `"I am lent. A lent sword is kept clean, so the owner does not complain."`, `"Your Wickan girl laughs at funerals. In Ehrlitan we do it at weddings. Both are correct."`],
    rel:{haddat:'Another Seven Cities soldier who took the silver. They have not decided whether that makes them kin or rivals, and are polite about it in two languages.', sathi:'She calls him "the red horse with no horse". He has taken it as a rank.', tangle:'Tangle counts the satchel when Ramin is near. Ramin has noticed, and counts it with him, out loud, to help.', marrow:'She cleaned the lance-cut on his arm and asked nothing about the company. He has decided she is the only Malazan in the squad.'}},
});
VERB.redblade = 'cuts at';
STATUP.redblade = ['might', 'guile'];
PICKS[3].redblade = [['holdline','The Red Line','Ramin\'s free swings are unlimited and hit +2. The Red Blades were drilled to hold a street on foot when the horses would not.'],['discipline','Company Drill','Every squadmate wears +1 armour. He drills them at dusk whether they asked or not.']];
PATRONS.redblade = {god:'the Queen of Dreams', title:'The Queen of Dreams', txt:id => `Ramin, down in the dust, says the Ehrlitan prayer his mother said over the toll-gate every dusk, and the noise of the fight goes far away, as if it were a dream somebody else were having.\n\nIn the dream the squad stands up. It is not the Queen's habit to explain herself. It is not Ramin's habit to ask.`};
/* Ramin's lance, held short: a blow at two paces */
AB.b2_lance = {name:'Lance Held Short', desc:()=>`An enemy up to 2 tiles off: 1d10+${2 + lvDmg()} on a hit. Recharges after ${2 - lvAt(6)} round${lvAt(6) ? '' : 's'}. Grows with level.`,
  ok:u=>!(u.cdLance >= B.round), tiles:u=>foes().filter(f => cheb(u, f) <= 2 && sees(u, f)),
  run(u,x,y){ const t = unitAt(x,y); if (!t) return; u.cdLance = B.round + 2 - lvAt(6); u.reachMelee = true; attack(u, t, {dmg:[1,10,2 + lvDmg()], verb:'drives the short lance at'}); u.reachMelee = false; }};
/* a recruit in Book Two joins the squad, not the Fourth */
{ const _recruit = recruit; recruit = function(id){ if (!S || S.book !== 'dg') return _recruit(id); const n0 = note; note = (t, c) => n0(String(t).replace('joins the Fourth', 'joins the squad'), c); try { _recruit(id); } finally { note = n0; } }; }
/* how far Book Two goes, for the title: counted from the chapters actually registered */
const dgChCount = () => Object.keys(BOOK === 'dg' ? CHAPTERS : BOOKSNAP.dg.ch).length;
const dgProgress = () => { const n = dgChCount(); return n >= 7 ? 'All seven chapters.' : n === 1 ? 'Chapter One so far.' : `${['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][n]} chapters so far.`; };
Object.defineProperty(BOOKS.dg, 'blurb', {get(){ return 'Seven Cities. A new squad of the Seventh on the Chain of Dogs, from the fall of Hissar toward Aren. Plays on its own. ' + dgProgress(); }});

/* ---- fouled warrens (v4.1): in Book Two a spell that costs strain can sputter for half its effect, the warren giving back mud.
   10% in Chapter 2, rising 5% a chapter to 35% by Chapter 7. Wickan spirit-craft (a.spirit) and Elder tricks (a.elder) never sputter.
   Marrow ties a knot for a clean healing only: S.f.b2_knots counts the clean ones, S.f.b2_sputters the ones the warren spoiled. ---- */
const b2Sputter = () => S && S.book === 'dg' && (S.chapter || 0) >= 2 ? Math.min(.35, .05 * S.chapter) : 0;
const b2Mud = () => ['The warren gives back mud.', 'The warren gives back mud, and something in it with fur.', 'The warren gives back mud. Half of what was asked for comes up through it.', 'The warren gives back mud, thick and warm, as if something enormous had just waded through.'][R(4)];
const B2_HEALS = ['mend', 'wash', 'stanch', 'argument'];
{ const _useAb = useAb;
  useAb = function(k, x, y){
    const u = B && B.cur, a = AB[k];
    if (!S || S.book !== 'dg' || !u || !a || !a.strain || a.elder || a.spirit || u.side !== 'p' || u.ally) return _useAb(k, x, y);
    const heal = B2_HEALS.includes(k);
    if (R(100) >= Math.round(b2Sputter() * 100)) { if (heal && u.id === 'marrow') S.f.b2_knots = (S.f.b2_knots || 0) + 1; return _useAb(k, x, y); }
    if (heal && u.id === 'marrow') S.f.b2_sputters = (S.f.b2_sputters || 0) + 1;
    blog(`<em>${u.name} reaches into the warren. ${b2Mud()}</em> Half effect.`); float(u, 'sputters', '#a08a5a'); tally('sputters');
    const w0 = B.warren || {}, down = B.units.filter(p => p.side === 'p' && p.hp <= 0);
    B.warren = Object.assign({}, w0, {denul:(w0.denul || 1) * .5, meanas:(w0.meanas || 1) * .5});
    try { _useAb(k, x, y); }
    finally { B.warren = w0; down.filter(p => p.hp > 0).forEach(p => { p.hp = Math.max(1, Math.ceil(p.hp / 2)); }); } }; }
/* an enemy caster's warren is as fouled as anyone's: a Semk's daze can come out as a stagger, a sorcerer's bolt at half */
SORC.push('sbolt');
{ const _foeSpecial = foeSpecial;
  foeSpecial = async function(u, gone){
    if (!S || S.book !== 'dg' || !B) return _foeSpecial(u, gone);
    u.cd = u.cd || {};
    if (hasSk(u, 'sbolt') && !(u.cd.sbolt > B.round)) {
      const t = party().filter(p => !p.ally && cheb(u, p) <= 5 && cheb(u, p) > 1 && canShoot(u, p)).sort((a, b) => a.hp - b.hp)[0];
      if (t && R(2) === 0) { u.cd.sbolt = B.round + 2; const sp = R(100) < Math.round(b2Sputter() * 100);
        if (sp) blog(`<em>${u.name} calls on the Semk god. ${b2Mud()}</em>`);
        AUDIO.play('shadow'); attack(u, t, {dmg:sp ? [1,6,0] : [2,6,1], verb:sp ? 'spits half a curse at' : 'throws the god\'s fire at'}); await wait(650); return true; } }
    const dazeReady = hasSk(u, 'daze') && !(u.cd.daze > B.round), before = new Set(party().filter(p => p.stun));
    const r = await _foeSpecial(u, gone);
    if (dazeReady && u.cd.daze > B.round && B && R(100) < Math.round(b2Sputter() * 100)) {
      party().filter(p => p.stun && !before.has(p)).forEach(p => { p.stun = false; p.slowTurn = true; float(p, 'staggered', '#a08a5a'); blog(`<em>The warren gives ${u.name} back mud.</em> ${p.name} staggers, and keeps the turn.`); }); }
    return r; }; }
/* flat on the ground (Mincer's Drop, Chapter 2): shots and thrown things find it hard to hit what is lying in a fold of earth */
{ const _atkCalc = atkCalc;
  atkCalc = function(a, t, o = {}){ const c = _atkCalc(a, t, o);
    if (t && t.flatUntil >= B.round && cheb(o.from || a, t) > 1) c.ac += t.flatAc || 3; return c; }; }

/* a squadmate who is somewhere else for one fight (v4.2, Chapter 3: Tangle in the ramp's banks with Mincer's sappers):
   a fight with def.away = ['tangle'] is fought without them. They are still in the squad; they are just not on this map. */
{ const _startBattle = startBattle;
  startBattle = function(id, opt = {}){ const d = S && S.book === 'dg' ? BATTLES[id] : null, away = d && (d.away || (opt.stage === 2 && d.stage2 && d.stage2.away));
    if (!away || !away.some(k => S.squad.includes(k))) return _startBattle(id, opt);
    const sq = S.squad; S.squad = sq.filter(k => !away.includes(k));
    try { return _startBattle(id, opt); }
    finally { S.squad = sq; if (B && B.snap) { const o = JSON.parse(B.snap); o.squad = sq.slice(); B.snap = JSON.stringify(o); } save(); } }; } // a retry starts from the snapshot: it keeps them

/* ---- the Silanda, and a wound that walks (v4.3, Chapter 4: the Vathar) ----
   b2Aboard(id): a hurt squadmate goes aboard the Silanda for Aren and leaves the squad; their kit is kept for them (S.f.b2_silandaGear).
   b2Ashore(): Chapter 7 calls it in Aren to bring them back, kit and all (S.f.b2_silandaBack). They miss any level-5+ picks taken while away.
   S.f.b2_woundWho: a squadmate kept with the squad carries the Vathar wound: −B2_WOUND max health in every fight until S.f.b2_woundHealed (Aren). */
const b2Mate = id => typeof id === 'string' && id !== 'sgt' && !!TPL[id];
function b2Aboard(id){ if (!b2Mate(id) || !S.squad.includes(id)) return; S.f.b2_silandaWho = id; S.f.b2_silandaGear = Object.assign({}, S.gear[id] || {});
  letGo(id, `${NAME(id)} goes aboard the Silanda, for Aren.`); }
function b2Ashore(){ const id = S.f.b2_silandaWho; if (!b2Mate(id) || S.squad.includes(id)) return false;
  recruit(id); S.gear[id] = Object.assign({}, S.f.b2_silandaGear || {}); S.f.b2_silandaBack = 1; save(); return true; }
const B2_WOUND = 6;
const b2Wounded = id => !!(S && S.book === 'dg' && S.f && S.f.b2_woundWho === id && !S.f.b2_woundHealed);
{ const _mkParty = mkParty;
  mkParty = function(id, x, y){ const u = _mkParty(id, x, y); if (b2Wounded(id)) { u.maxhp = Math.max(6, u.maxhp - B2_WOUND); u.hp = Math.min(u.hp, u.maxhp); u.vatharWound = true; } return u; }; }
{ const _startBattle = startBattle;
  startBattle = function(id, opt = {}){ const r = _startBattle(id, opt);
    const w = S && S.book === 'dg' && B && B.units.find(u => u.vatharWound && u.side === 'p' && !u.ally);
    if (w) blog(`<em>${w.name} fights with the Vathar arrow-wound bound tight under the kit: −${B2_WOUND} health until Aren.</em>`);
    return r; }; }
/* after a Book Two fight: how many rounds it took (S.f.b2_lastRounds), and, for a fight marked hurtMost, which squadmate came out of it worst
   (S.f.b2_hurtMost: lowest health for their size; never the sergeant, never the Red Blade, whom the company keeps) */
{ const _win = win;
  win = function(){
    if (S && S.book === 'dg' && B && B.def) { S.f.b2_lastRounds = B.round;
      if (B.def.hurtMost) { const c = B.units.filter(u => u.side === 'p' && !u.ally && b2Mate(u.id) && u.id !== 'redblade' && S.squad.includes(u.id)).sort((a, b) => a.hp / a.maxhp - b.hp / b.maxhp);
        if (c.length) S.f.b2_hurtMost = c[0].id; } }
    return _win(); }; }

/* ---- heat (v4.4, Chapter 5: the Dry March) ----
   A fight marked def.heat is fought at midday. From round 4 (round 2 on a fight's second ground, the squad already cooked by the first),
   a squadmate in heavy armour (B2_HEAVY: mail or scale) loses a step of movement every turn, unless they drank before the fight.
   b2Drink(id) spends a skin so the squad drinks before fight id (S.f.b2_drank = id; S.f.b2_drankSkip = a squadmate who would not drink);
   b2Drink(id, true) is the free version, for a squad whose water was already given out to it.
   S.f.b2_dry: the squad gave its water to the column, so it cannot drink, and starts a heat fight parched (−3 health).
   A squadmate marked u.cooled (the Tower's Breath, Chapter 5) has shed the heat for the rest of the fight. */
const B2_HEAVY = id => ['haddat', 'redblade'].includes(id) || Object.values(((S && S.gear) || {})[id] || {}).some(g => ITEMS[g] && ITEMS[g].heavy);
function b2Drink(id, free){ if (!S || S.f.b2_dry) return false;
  if (!free) { if (chainW() <= 0) return false; chain(-1, 0, 'A skin before the fight'); }
  S.f.b2_drank = id; return true; }
const b2Drank = (id, who) => !!(S && S.f.b2_drank === id && S.f.b2_drankSkip !== who);
const b2HeatFrom = () => B && B.def && B.def.isStage2 ? 2 : 4;
{ const _mkParty = mkParty;
  mkParty = function(id, x, y){ const u = _mkParty(id, x, y);
    if (S && S.book === 'dg' && S.f.b2_dry && B && B.def && B.def.heat && !u.parched) { u.hp = Math.max(1, u.hp - 3); u.parched = true; }
    return u; }; }
{ const _startBattle = startBattle;
  startBattle = function(id, opt = {}){ const r = _startBattle(id, opt);
    if (S && S.book === 'dg' && B && B.def && B.def.heat) {
      const sq = B.units.filter(u => u.side === 'p' && !u.ally), heavy = sq.filter(u => B2_HEAVY(u.id) && !b2Drank(id, u.id)).map(u => u.name);
      blog(`<em>Midday. The sun is a hand on the back of every neck.</em>`);
      if (S.f.b2_dry) blog(`<em>The squad's water went to the column. Every mouth is dust: everyone starts a little hurt.</em>`);
      else if (S.f.b2_drank === id) blog(`The squad drank before it came on. The heat will wait a while.`);
      if (heavy.length) blog(`<em>${heavy.join(' and ')} ${heavy.length > 1 ? 'are' : 'is'} in mail with nothing to drink: from round ${b2HeatFrom()}, one step fewer every turn.</em>`); }
    return r; }; }
{ const _squadTurnStart = squadTurnStart;
  squadTurnStart = function(u){ const r = _squadTurnStart(u);
    if (S && S.book === 'dg' && B && B.def && B.def.heat && u && u.side === 'p' && !u.ally && u.hp > 0 && !u.cooled && B.round >= b2HeatFrom()
        && B2_HEAVY(u.id) && !b2Drank(B.id, u.id) && (B.mvLeft ?? u.mv) > 0) {
      B.mvLeft = Math.max(0, (B.mvLeft ?? u.mv) - 1); float(u, 'the heat', '#e0b060');
      if (!u.heatSaid) { u.heatSaid = true; blog(`<em>The heat has ${u.name}. The mail is an oven: one step fewer every turn.</em>`); } }
    return r; }; }

/* ---- the split on the Geleen Plain (v4.5, Chapter 6) ----
   Coltaine splits the Chain: the refugees go on to Aren, the Seventh stays behind with him. The sergeant always goes with the column.
   S.f.b2_stay = {id:true} for each squadmate who stayed with the rearguard. b2StayBehind(id) takes them out of the squad at the split
   (letGo, not kill: they die at the Barrow in Chapter 7), with their kit kept in S.f.b2_stayGear[id]; their loyalty and picks stay in
   S.loy / S.picks. If Tangle stayed and took the satchel, S.f.b2_stayInv holds its munitions (the squad's are zeroed).
   Chapter 7, the Barrow: b2LastStand() puts the ones who stayed back on the map as the whole squad (no sergeant: the sergeant is on Aren's
   walls), with their kit and Tangle's satchel if it went; the squad that went ahead waits in S.f.b2_wallSquad. Fight the last stand with
   that squad (Hackle comes with Sathi as always), then call b2LastStandEnd(): they are recorded dead at the Barrow (S.dead[id], ch 7) and
   the walls' squad comes back, its own munitions with it (S.f.b2_barrowFell = 1). Both are safe to call twice. */
const B2_SPLIT = ['haddat', 'sathi', 'tangle', 'marrow', 'redblade'];
const b2Rearguard = () => B2_SPLIT.filter(id => S && S.f && S.f.b2_stay && S.f.b2_stay[id] === true && TPL[id]);
function b2StayBehind(id){ if (!b2Mate(id) || !S.squad.includes(id)) return;
  S.f.b2_stay ??= {}; S.f.b2_stay[id] = true; S.f.b2_stayGear ??= {}; S.f.b2_stayGear[id] = Object.assign({}, S.gear[id] || {});
  letGo(id, `${NAME(id)} stays with the Fist's rearguard.`); }
const B2_MUNI = ['sharper', 'burner', 'cusser', 'smoker'];
function b2LastStand(){ const rg = b2Rearguard(); if (!rg.length || S.f.b2_wallSquad || S.f.b2_barrowFell) return false;
  S.f.b2_wallSquad = S.squad.slice(); S.f.b2_wallInv = Object.assign({}, S.inv);
  rg.forEach(id => { S.gear[id] = Object.assign({}, (S.f.b2_stayGear || {})[id] || {}); S.loy[id] ??= 0; S.picks[id] ??= []; });
  S.squad = rg.slice(); S.inv = Object.assign({salve:1}, ...B2_MUNI.map(k => ({[k]:rg.includes('tangle') && S.f.b2_stayInv ? S.f.b2_stayInv[k] || 0 : 0})));
  S.trail = S.trail.slice(0, Math.max(1, S.squad.length - 1)); save(); return true; }
function b2LastStandEnd(){ if (!Array.isArray(S.f.b2_wallSquad)) return false; const rg = b2Rearguard();
  S.dead ??= {}; rg.forEach(id => { S.dead[id] = {ch:7, where:'The Barrow'}; S.gear[id] = {}; });
  S.squad = S.f.b2_wallSquad.filter(id => !rg.includes(id)); if (!S.squad.includes('sgt')) S.squad.unshift('sgt');
  if (S.f.b2_wallInv) S.inv = Object.assign({}, S.f.b2_wallInv);
  S.f.b2_wallSquad = null; S.f.b2_wallInv = null; S.f.b2_barrowFell = 1; S.trail = S.trail.slice(0, Math.max(1, S.squad.length - 1)); save(); return true; }

/* Book Two's chapters register in start() (90), after Book One's */
