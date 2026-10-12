/* ============ Book Two, Chapter 6: Sanimon ============ */
/* The hills above Sanimon, where every tribe on the Odhan has come to the same water; Coltaine attacks at dawn and cannot break the
   Tregyn and the Bhilard, and is pushed back, until the Khundryl (tens of thousands of them, thought to be Dom's) come down off the ridges
   and break Dom's tribes instead; in the middle of it the Fist throws the Trygalle's bottle to Duiker. Then the running retreat: Dom
   attacks for more than forty hours, Tathimon, Dojal Spring. Then the Geleen Plain at dusk, where Coltaine pays the soldiers' wages to the
   Kherahn Dhobri elders for the refugees' passage to Balahn, and splits the column: Duiker, Nil, Nether and the youngest Wickans take the
   refugees on; the rest of the Seventh stays with him. List stays: he has found his war.
   THE SPLIT (decided with the owner): the sergeant always goes ahead with the column (Bult gave it to them). Each squadmate here decides,
   with the player's say, in a scene of their own: S.f.b2_split = {id:'stay'|'go'}, S.f.b2_splitHow = {id:'own'|'asked'|'talked'}.
   Those who stay leave the squad at the split by b2StayBehind (47: kit kept, not killed); S.f.b2_stay = {id:true}. They die at the
   Barrow in Chapter 7 (b2Barrow / b2BarrowEnd, 47). Hackle goes wherever Sathi goes.
   Key (S.f.b2_c6_key), by count: 'whole' (nobody stayed), 'some', 'many' (two or more, and at least half of those who could).
   New here: the Khundryl Paint (a trick, not sorcery: it never sputters). Haddat's last word with Ilhar at Sanimon: S.f.b2_ilhar. */

/* the squad's own people, for a line: the daughters, the widow, or the stretch */
const b2Ours6 = () => S.f.b2_key === 'daughters' ? B2.elder : S.f.b2_yedda ? B2.widow : null;
/* the squadmates who are here to choose at the split (the one on the Silanda is not) */
const b2Here6 = () => B2_SPLIT.filter(b2In);
/* which way each of them leans before the sergeant says anything. Sathi always wants to stay (she is one of the youngest, and Coltaine
   sends the youngest on); Haddat stays unless her brother walks in the column; Tangle stays if he is Bungle's man now; Marrow stays if she
   healed the Vathar to the floor of the warren; Ramin goes, because the squad goes. The one carrying the Vathar wound wants to stay. */
function b2Lean(id){ const f = S.f, hurt = b2Hurt() === id;
  if (id === 'sathi') return 'stay';
  if (id === 'haddat') return f.b2_ilhar === 'came' ? 'go' : 'stay';
  if (id === 'tangle') return hurt || f.b2_bungle5 === 'gave' || f.b2_robe === 'mincer' ? 'stay' : 'go';
  if (id === 'marrow') return hurt || f.b2_marrowEnd === 'on' ? 'stay' : 'go';
  return hurt ? 'stay' : 'go'; }
function b2Choose(id, stay, how){ S.f.b2_split ??= {}; S.f.b2_split[id] = stay ? 'stay' : 'go'; S.f.b2_splitHow ??= {}; S.f.b2_splitHow[id] = how; }
const b2Said = id => !!(S.f.b2_split && S.f.b2_split[id]);
const b2Staying = id => !!(S.f.b2_split && S.f.b2_split[id] === 'stay');
const b2AllSaid = () => b2Here6().every(b2Said);
const b2HowSaid = id => (S.f.b2_splitHow && S.f.b2_splitHow[id]) || 'own';
/* the arguments that move each of them: loyalty first, then the thing they care about */
const b2Sway = (id, more) => [[`${NAME(id)} trusts you`, Math.max(0, S.loy[id] || 0)], (S.loy[id] || 0) < 0 && [`${NAME(id)} is sore at you`, S.loy[id]], ...(more || [])];
/* what each one leaves with the sergeant at the split */
const B2_KEEP6 = {haddat:'b2_bluethread', sathi:'b2_whistle', tangle:'b2_bead', marrow:'b2_knotstring', redblade:'b2_sash'};

/* the split itself, at Bult's word: the ones who stay leave the squad (47), the Kherahn feed the column, and the key is set by count */
function b2DoSplit(){ if (S.f.b2_c6_key) return;
  const here = b2Here6(), st = here.filter(b2Staying), n = st.length;
  if (st.includes('tangle') && S.f.b2_satchel6 === 'went') { const k = ['sharper', 'burner', 'cusser', 'smoker'];
    S.f.b2_stayInv = {}; k.forEach(m => { S.f.b2_stayInv[m] = S.inv[m] || 0; S.inv[m] = 0; }); }
  S.f.b2_stay ??= {};
  st.forEach(id => b2StayBehind(id)); st.forEach(id => { if (B2_KEEP6[id]) gain(B2_KEEP6[id]); }); // all out first, so no keepsake is handed to someone else who is leaving
  S.f.b2_stayCount = n;
  S.f.b2_c6_key = !n ? 'whole' : n >= 2 && n * 2 >= here.length ? 'many' : 'some';
  chain(4, 0, 'The Kherahn Dhobri feed the column'); }

/* The Khundryl Paint: three strokes of ochre and ash, the way a Khundryl goes to war. A custom, not sorcery: it never sputters. */
Object.assign(TRICKS, {
  b2_paint:{name:'The Khundryl Paint', ch:6, use:'fight', ab:'t_b2_paint', where:'the field at Sanimon, with a Khundryl warrior',
    lore:'Three strokes, ochre and ash, from the brow down across the eyes, put on with two fingers and a word. The Khundryl say a warrior who goes in painted has already been mourned, and has nothing left to be afraid of. It does nothing at all, a Malazan would say. Then a Malazan stands next to someone wearing it.',
    get fx(){ return `Once a fight: the bearer gives the Khundryl cry. The bearer and squadmates next to them are +2 to hit until the bearer's next turn; enemies within 2 of the bearer are −3 to hit this round, and ${lvT() >= 2 ? 'the nearest of them loses its nerve for a turn' : 'falter'}. Not sorcery: it never sputters.`; }},
});
Object.assign(AB, {
  t_b2_paint:{name:TRICKS.b2_paint.name, trick:'b2_paint', self:true, desc:()=>TRICKS.b2_paint.fx,
    run(u){ AUDIO.play('sword'); shakeMap();
      const us = party().filter(p => !p.ally && cheb(p, u) <= 1), them = foes().filter(f => cheb(f, u) <= 2);
      us.forEach(p => { p.rallyUntil = Math.max(p.rallyUntil || 0, B.round + 1); float(p, 'painted', '#d08a4a'); sparks(p.x, p.y, 6, '#d08a4a', .4); });
      them.forEach(f => { f.dazzleUntil = Math.max(f.dazzleUntil || 0, B.round); float(f, 'falters', '#cfc8b8'); });
      const near = lvT() >= 2 && them.sort((a, b) => cheb(a, u) - cheb(b, u))[0]; if (near) { near.slowTurn = true; }
      blog(`${u.name} throws back ${u.id === 'sgt' ? 'their' : 'the'} head and gives the Khundryl cry, the one from the ridges at Sanimon, with the ochre and the ash across the eyes. ${them.length ? 'The nearest of the enemy check, all at once, as if they had heard a ghost.' : 'There is nobody close enough to hear it. It helps anyway.'}`); }},
});

/* the words this chapter adds to Book Two's glossary */
GLOSSX.dg.push(
  [6, 'The Khundryl', 'A horse-tribe of the Odhan, tens of thousands strong, in grey scale under furs and fetishes. At Sanimon everyone thought they were Dom\'s. They had come to find out which tribe was the strongest.', ()=>!!(S.f && S.f.b2_khundryl)],
  [6, 'Sanimon', 'The hills where every tribe on the Odhan came to the same water, and the Khundryl turned on Korbolo Dom.', ()=>!!(S.f && S.f.b2_sanimonDone)],
  [6, 'The Kherahn Dhobri', 'An Odhan people who kept out of the war and kept their treaties. On the Geleen Plain the Fist paid their elders the Seventh\'s wages to take the refugees to Balahn.', ()=>!!(S.f && S.f.b2_kherahn)],
  [6, 'The Geleen Plain', 'Grass, at last, after the Nenoth. Where the Chain of Dogs became two chains.', ()=>!!(S.f && S.f.b2_geleen)]);

const B2CH6 = {
  title:'Sanimon', number:'Six',
  intro:{loc:'The hills above Sanimon', sub:'Night · every tribe on the Odhan at the same water', scene:'b2_odhan_dusk', cap:'Hills at the end of the Nenoth, and fires on every ridge of them, more fires than there are stars.',
    paras:[
`The hills at the end of the Nenoth have water in them. The guides were right this time. Everybody was right: the Bhilard, the Tregyn, the Can'eld, Korbolo Dom. Everybody came.`,
`By the second night the Seventh is camped in a fold of the hills with its back to a spring, and across the valley Dom's tribes have their fires, and on every ridge round both, in a ring that goes all the way round and closes, there are more fires than anyone can count.`,
`Khundryl, the guides say. Tens of thousands. Nobody has spoken to them. Dom's riders go up to their fires and come back down again, and Dom's camp sings at night, so everybody knows whose they are.`],
    go:'Into the camp', node:'b2_c6_start'},

  areas:[
    /* 16 x 12.  the hills at night: . hardpan  , scrub  r low rock  x the lookout  = tent  F fire  W the squad's cart  h horse lines  o the seep */
    { id:'b2_hills', title:'The hills above Sanimon', sub:'Night · fires on every ridge', hint:'Tap ground to move · tap a figure to talk · the seep, the lookout, the squad\'s cart when the squad is ready', decor:'odhan_night', dark:true,
      map:[ "################",
            "#..,..r...,..x.#",
            "#.,.=...,....,.#",
            "#....,..F...r..#",
            "#.r.......,....#",
            "#..,.=......=..#",
            "#.......,..h...#",
            "#.,..o.........#",
            "#....,...W..,..#",
            "#.=.....,....=.#",
            "#..,..r.....,..#",
            "################" ],
      walk:'.,', triggers:{x:'b2_ridge', F:'b2_hfire', o:'b2_hseep', W:'b2_hcart', h:'b2_hhorses'}, start:{x:7, y:10},
      quest:()=> !S.f.b2_bult9 ? 'Bult is going round the squads.' : !S.f.b2_seepDone ? 'There is water in the hills. The seep.' : 'The squad\'s cart, when the squad is ready for the dawn.',
      npcs:[
        {id:'bult9', name:'Bult', kind:'bult', x:9, y:3, node:()=>'b2_bult9', fresh:()=>!S.f.b2_bult9},
        {id:'duiker9', name:'Duiker', kind:'duiker', x:6, y:3, node:()=>'b2_duiker9', fresh:()=>!S.f.b2_duiker9},
        {id:'list8', name:'Corporal List', kind:'list', x:7, y:4, node:()=>'b2_list8', fresh:()=>!S.f.b2_list8},
        {id:'lull6', name:'Captain Lull', kind:'lull', x:3, y:4, node:()=>'b2_lull6', fresh:()=>!S.f.b2_lull6},
        {id:'haddat6', name:'Haddat', kind:'haddat', x:12, y:2, node:()=>'b2_haddat6', show:()=>b2In('haddat'), fresh:()=>b2In('haddat') && !S.f.b2_haddat6},
        {id:'sathi6', name:'Sathi', kind:'sathi', x:12, y:6, node:()=>'b2_sathi6', show:()=>b2In('sathi'), fresh:()=>b2In('sathi') && !S.f.b2_sathi6},
        {id:'tangle6', name:'Tangle', kind:'tangle', x:8, y:8, node:()=>'b2_tangle6', show:()=>b2In('tangle'), fresh:()=>b2In('tangle') && !S.f.b2_tangle6},
        {id:'marrow6', name:'Marrow', kind:'marrow', x:4, y:7, node:()=>'b2_marrow6', show:()=>b2In('marrow'), fresh:()=>b2In('marrow') && !S.f.b2_marrow6},
        {id:'ramin8', name:'Ramin', kind:'redblade', x:13, y:8, node:()=>'b2_ramin8', show:()=>b2In('redblade'), fresh:()=>b2In('redblade') && !S.f.b2_ramin8},
        {id:'ours10', name:'The squad\'s people', kind:'hissari_w', x:10, y:9, node:()=>'b2_ours10', fresh:()=>!S.f.b2_ours10} ] },

    /* 16 x 12.  the field at Sanimon, the afternoon after: . hardpan  , scrub  s sand  r low rock  x a dead tree  b the dead  W Dom's water-carts  = the Seventh's lines  h horse lines */
    { id:'b2_field', title:'Sanimon', sub:'Afternoon · the field, after', hint:'Tap ground to move · tap a figure to talk · Dom\'s water-carts, the dead, the Seventh\'s lines when there is nothing more to do', decor:'odhan',
      map:[ "################",
            "#..b..,...r..,.#",
            "#.,...W..W..,..#",
            "#....,.....b...#",
            "#.r..,.x.....,.#",
            "#..,....,..r...#",
            "#.b.........,..#",
            "#....,..s....b.#",
            "#.,.....,..,...#",
            "#..h..,.....=..#",
            "#.....,..s.....#",
            "################" ],
      walk:'.,s', triggers:{W:'b2_wcarts', b:'b2_fdead', x:'b2_ftree', '=':'b2_field_out'}, start:{x:8, y:10},
      quest:()=> !S.f.b2_duiker10 ? 'The historian, by the dead tree.' : b2In('haddat') && !S.f.b2_ilhar ? 'Dom\'s water-carts, up on the north side of the field.' : !S.f.b2_warchief ? 'The Khundryl are coming down to the Fist\'s standard.' : 'The Seventh\'s lines. The column moves at dusk.',
      npcs:[
        {id:'duiker10', name:'Duiker', kind:'duiker', x:8, y:4, node:()=>'b2_duiker10', fresh:()=>!S.f.b2_duiker10},
        {id:'khund', name:'A Khundryl warrior', kind:'khundryl', x:4, y:5, node:()=>'b2_khund', fresh:()=>!S.f.b2_khund},
        {id:'chief6', name:'A Khundryl war chief', kind:'khundryl_chief', x:12, y:8, node:()=>'b2_warchief', show:()=>!!S.f.b2_duiker10, fresh:()=>!!S.f.b2_duiker10 && !S.f.b2_warchief},
        {id:'ours11', name:'The squad\'s people', kind:'child', x:4, y:9, node:()=>'b2_ours11', fresh:()=>!S.f.b2_ours11},
        {id:'ilharc', name:'Ilhar', kind:'hissari_m', x:7, y:3, node:()=>'b2_ilhar_after', show:()=>S.f.b2_ilhar === 'came', fresh:()=>false} ] },

    /* 16 x 12.  Dojal Spring at noon: . hardpan  , scrub  s sand  r low rock  t tamarisk (blocks)  o the spring (blocks)  W the squad's cart  x the way on */
    { id:'b2_dojal', title:'Dojal Spring', sub:'Noon · the running retreat', hint:'Tap ground to move · tap a figure to talk · the spring, the squad\'s cart, the way on', decor:'odhan',
      map:[ "################",
            "#.,..t...,..t..#",
            "#..,...ooo...,.#",
            "#.t...,ooo.,...#",
            "#....,..,....t.#",
            "#.,.r......,...#",
            "#....W....,..r.#",
            "#.,.....,......#",
            "#..s..,...x..,.#",
            "#.,......,..s..#",
            "#....,.....,...#",
            "################" ],
      walk:'.,s', triggers:{o:'b2_spring6', W:'b2_dcart', x:'b2_dojal_out'}, start:{x:6, y:9},
      quest:()=> !S.f.b2_dojalDone ? 'The spring, before Dom\'s people get to it.' : 'The stretch is drinking. Then on, to the Geleen.',
      npcs:[
        {id:'lull7', name:'Captain Lull', kind:'lull', x:11, y:5, node:()=>'b2_lull7', fresh:()=>!S.f.b2_lull7},
        {id:'bungle6', name:'Captain Bungle', kind:'sapper', x:3, y:7, node:()=>'b2_bungle6', fresh:()=>!S.f.b2_bungle6},
        {id:'nobles6', name:'A noble\'s carriage', kind:'nethpara', x:12, y:7, node:()=>'b2_nobles6', fresh:()=>!S.f.b2_nobles6},
        {id:'ours12', name:'The squad\'s people', kind:'hissari_w', x:8, y:7, node:()=>'b2_ours12', fresh:()=>!S.f.b2_ours12} ] },

    /* 16 x 12.  the Geleen Plain at dusk: . short grass  , long grass  = tent  F the elders' fire  c the coin chests  W the squad's cart  h horse lines */
    { id:'b2_geleen', title:'The Geleen Plain', sub:'Dusk · grass, and two roads', hint:'Tap ground to move · tap a figure to talk · the chests by the elders\' fire, the horse lines, the squad\'s cart', decor:'geleen',
      map:[ "################",
            "#.,..=...,..=..#",
            "#..,....,..,...#",
            "#.=...cFc....,.#",
            "#....,.....,...#",
            "#.,......,...h.#",
            "#..,..,....,...#",
            "#.W.....,..,.=.#",
            "#....,.....,...#",
            "#.,..,...,..,..#",
            "#.=....,....,..#",
            "################" ],
      walk:'.,', triggers:{c:'b2_chests', F:'b2_gfire', W:'b2_gcart', h:'b2_ghorses'}, start:{x:7, y:10},
      quest:()=> !S.f.b2_bult10 ? 'Bult, by the elders\' fire.' : !S.f.b2_silverDone ? 'The chests by the elders\' fire. Dom\'s riders have heard about the silver.' : !b2AllSaid() ? 'Night. Each of the squad has to choose. Go and hear them.' : 'Bult, when the squad has chosen.',
      npcs:[
        {id:'bult10', name:'Bult', kind:'bult', x:9, y:4, node:()=>S.f.b2_silverDone ? 'b2_bult11' : 'b2_bult10', fresh:()=>!S.f.b2_bult10 || (!!S.f.b2_silverDone && b2AllSaid() && !S.f.b2_c6_key)},
        {id:'kherahn1', name:'A Kherahn elder', kind:'kherahn', x:6, y:2, node:()=>'b2_kherahn6', fresh:()=>!!S.f.b2_bult10 && !S.f.b2_kherahn},
        {id:'kherahn2', name:'A Kherahn elder', kind:'kherahn', x:8, y:2, node:()=>'b2_kherahn6'},
        {id:'coltaine6', name:'Coltaine', kind:'coltaine', x:7, y:4, node:()=>'b2_coltaine6', fresh:()=>!!S.f.b2_silverDone && !S.f.b2_coltaine6},
        {id:'duiker11', name:'Duiker', kind:'duiker', x:4, y:4, node:()=>'b2_duiker11', show:()=>!!S.f.b2_silverDone, fresh:()=>!!S.f.b2_silverDone && !S.f.b2_duiker11},
        {id:'lull8', name:'Captain Lull', kind:'lull', x:11, y:6, node:()=>'b2_lull8', show:()=>!!S.f.b2_silverDone, fresh:()=>!!S.f.b2_silverDone && !S.f.b2_lull8},
        {id:'nil6', name:'Nil and Nether', kind:'nil', x:4, y:9, node:()=>'b2_youngest', show:()=>!!S.f.b2_silverDone, fresh:()=>!!S.f.b2_silverDone && !S.f.b2_youngest},
        {id:'nether6', name:'Nether', kind:'nether', x:5, y:9, node:()=>'b2_youngest', show:()=>!!S.f.b2_silverDone},
        {id:'weaselcap6', name:'The Weasel captain', kind:'weasel', x:12, y:5, node:()=>'b2_weaselcap6', show:()=>!!S.f.b2_silverDone, fresh:()=>!!S.f.b2_silverDone && b2In('sathi') && !S.f.b2_weaselcap6},
        {id:'p_haddat', name:'Haddat', kind:'haddat', x:5, y:6, node:()=>b2Said('haddat') ? 'b2_part_said' : 'b2_part_haddat', show:()=>!!S.f.b2_silverDone && b2In('haddat'), fresh:()=>!!S.f.b2_silverDone && b2In('haddat') && !b2Said('haddat')},
        {id:'p_sathi', name:'Sathi', kind:'sathi', x:13, y:6, node:()=>b2Said('sathi') ? 'b2_part_said' : 'b2_part_sathi', show:()=>!!S.f.b2_silverDone && b2In('sathi'), fresh:()=>!!S.f.b2_silverDone && b2In('sathi') && !b2Said('sathi')},
        {id:'p_tangle', name:'Tangle', kind:'tangle', x:3, y:8, node:()=>b2Said('tangle') ? 'b2_part_said' : 'b2_part_tangle', show:()=>!!S.f.b2_silverDone && b2In('tangle'), fresh:()=>!!S.f.b2_silverDone && b2In('tangle') && !b2Said('tangle')},
        {id:'p_marrow', name:'Marrow', kind:'marrow', x:6, y:5, node:()=>b2Said('marrow') ? 'b2_part_said' : 'b2_part_marrow', show:()=>!!S.f.b2_silverDone && b2In('marrow'), fresh:()=>!!S.f.b2_silverDone && b2In('marrow') && !b2Said('marrow')},
        {id:'p_ramin', name:'Ramin', kind:'redblade', x:10, y:8, node:()=>b2Said('redblade') ? 'b2_part_said' : 'b2_part_ramin', show:()=>!!S.f.b2_silverDone && b2In('redblade'), fresh:()=>!!S.f.b2_silverDone && b2In('redblade') && !b2Said('redblade')},
        {id:'ours13', name:'The squad\'s people', kind:'hissari_w', x:6, y:8, node:()=>'b2_ours13', show:()=>!!S.f.b2_silverDone, fresh:()=>!!S.f.b2_silverDone && !S.f.b2_ours13} ] } ],

  battles:{
    /* dawn at Sanimon: the Seventh goes into the Tregyn and the Bhilard before they are out of their blankets, and cannot break them.
       Then the push back, into the noon, holding a fold of the hill until the Khundryl come down off the ridges */
    b2_sanimon:{title:'The Tregyn line', style:'odhan', warrenText:'Sanimon at dawn · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["........","...t..t.","........","....t...","........",".t......","......t.","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      /* a short squad has two of the Seventh's regulars on its flanks, sent along the line by Bult */
      get allies(){ return b2Hands5() <= 3 ? [['b2_reg5',1,8],['b2_reg5',6,8]] : []; },
      foes:[['b2_treg',2,1],['b2_treg',5,1],['b2_bhil',1,2],['b2_bhil',6,2],['b2_tregbow',2,0],['b2_tregbow',5,0]], xp:140, after:'b2_after_sanimon',
      waves:[{round:3, foes:[['b2_bhil',7,3]], text:'A Bhilard comes in off the flank on foot, his horse shot under him somewhere up the slope, with a spear and nothing to lose.'}],
      stage2:{title:'Pushed back', xp:70, heat:true, keepAllies:true,
        text:()=>`It does not break. The Tregyn give a step, and another, and then they stop giving, and the Bhilard come round the end of the Seventh's line like water round a stone, and the whole line goes back up the hill, step by step, facing front, the way the Seventh goes back.
${b2In('haddat') ? `
"They are not running," Haddat says, between breaths. "They should be running." She looks up at the ridges, where the Khundryl sit their horses in their tens of thousands and have not moved all morning.` : `
On the ridges the Khundryl sit their horses in their tens of thousands, and have not moved all morning.`}

It is noon. Your piece of the hill is a fold of rock and scrub with the stretch's carts behind it. Hold it.`,
        map:["#......#","........","..t..t..","........","........","...t....","........","........","#......#","........"],
        party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
        foes:[['b2_tregcap',3,0],['b2_treg',2,1],['b2_treg',5,1],['b2_caneld',6,1],['b2_canbow',4,0]],
        objective:{type:'survive', rounds:4, text:'Hold the fold for four rounds. Something has to happen. Something always does.'},
        waves:[{round:2, foes:[['b2_caneld',0,2]], text:'Can\'eld, lean men with their faces wrapped, come along the slope from the west, where nobody thought there was anybody left.'},
               {round:3, foes:[['b2_treg',7,1]], text:'Another Tregyn, mantle over his head against the sun, walking, because nobody on this hill can run any more.'}]} },

    /* noon at Dojal Spring, on the running retreat: Dom's people come to take the spring the column needs. Then their captain in the tamarisks */
    b2_dojal:{title:'Dojal Spring', style:'odhan', heat:true, warrenText:'Noon at Dojal Spring · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["..t..t..","........","...oo...","...oo...","........",".t....t.","........","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      get allies(){ return b2Hands5() <= 3 ? [['b2_reg5',1,8],['b2_reg5',6,8]] : []; },
      foes:[['b2_pike',2,1],['b2_pike',5,1],['b2_domarcher',3,0],['b2_domarcher',6,0],['b2_caneld',6,4]], xp:120, after:'b2_after_dojal',
      waves:[{round:3, foes:[['b2_caneld',0,5]], text:'A Can\'eld out of the scrub on the near side of the spring, going for the water-skins on the squad\'s backs.'}],
      stage2:{title:'The tamarisks', xp:50, keepAllies:true,
        text:()=>`The spring is the Seventh's again, for as long as the Seventh stands on it. Behind you the stretch is coming down to it at a run, with pots.

In the tamarisks on the far side an officer of Dom's, in a Malazan-cut coat with the badges cut off, is rallying what is left: a few pikemen, a bow. He is not going to let the column drink in peace. He has been told not to.`,
        map:["t..t..t.","........",".t....t.","........","...t....","........","........",".t....t.","........","........"],
        party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
        foes:[['b2_domcap',3,1],['b2_escort',2,2],['b2_escort',5,2],['b2_domarcher',4,0]],
        get waves(){ return b2Hands5() > 3 ? [{round:3, foes:[['b2_pike',7,3]], text:'One more pikeman comes out of the tamarisks, late, holding the pike the wrong way up, and turns it round.'}] : []; }} },

    /* dusk on the Geleen: Can'eld riders on foot come for the coin chests at the elders' fire, and then for the Wickan horse lines */
    b2_silver:{title:'The silver', style:'geleen', warrenText:'The Geleen Plain at dusk · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["........","..,..,..","........",".t....t.","........","........","..t..t..","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      get allies(){ return b2Hands5() <= 3 ? [['b2_reg5',1,8],['b2_reg5',6,8]] : []; },
      foes:[['b2_caneld',2,1],['b2_caneld',5,1],['b2_caneld',3,2],['b2_canbow',1,0],['b2_canbow',6,0]], xp:90, after:'b2_after_silver',
      waves:[{round:3, foes:[['b2_caneld',0,3]], text:'Another comes in low through the long grass, where you would swear there was no room for a man to lie.'}],
      stage2:{title:'The horse lines', xp:30, keepAllies:true,
        text:()=>`The ones at the chests are down. The rest have gone round, through the long grass, for the Wickan horse lines: a chief of theirs in a wrapped face, going for the horses that will carry the youngest Wickans to Balahn.${b2In('sathi') ? `

Sathi is already running. "The horses," she says, over her shoulder, as if that were the whole of an argument. It is.` : ''}`,
        map:["........",".t....t.","........","........","...,....","........",".t....t.","........","........","........"],
        party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
        foes:[['b2_canchief',3,0],['b2_caneld',2,1],['b2_caneld',5,1],['b2_canbow',4,0]]} } },

  foes:{
    /* the Can'eld: an Odhan tribe of Dom's, light raiders with wrapped faces */
    b2_caneld:{name:'Can\'eld raider', sig:'c', kind:'caneld', hp:17, ac:13, atk:5, dmg:[1,8,2], rng:1, mv:5, init:3, sk:['bleed'], verb:'cuts at'},
    b2_canbow:{name:'Can\'eld bowman', sig:'a', kind:'caneld', hp:13, ac:12, atk:5, dmg:[1,8,1], rng:6, mv:5, init:3, sk:['pin'], verb:'looses at'},
    b2_canchief:{name:'Can\'eld chief', sig:'C', kind:'caneld', hp:34, ac:15, atk:6, dmg:[1,10,3], rng:1, mv:5, init:3, boss:true, sk:['rally','bleed'], verb:'cuts at'},
    /* a Tregyn war-leader at Sanimon */
    b2_tregcap:{name:'Tregyn war-leader', sig:'T', kind:'tregyn', hp:36, ac:16, atk:6, dmg:[1,10,3], rng:1, mv:4, init:2, boss:true, sk:['rally','shove'], verb:'brings a heavy blade down on'},
    /* one of Dom's officers: a Malazan deserter, by the cut of the coat */
    b2_domcap:{name:'Dom\'s captain', sig:'O', kind:'guran_officer', hp:34, ac:16, atk:6, dmg:[1,10,3], rng:1, mv:4, init:3, boss:true, sk:['parry','rally'], verb:'cuts at'} },

  gear:{
    b2_bluethread:{name:'A blue thread', slot:'trinket', who:null, stat:{wits:1}, line:'A blue thread from Haddat\'s mother\'s veil, that was tied to her shield grip from Hissar to the Geleen Plain. She untied it with her teeth and gave it to the sergeant. "For the names," she said.'},
    b2_whistle:{name:'A bone whistle', slot:'trinket', who:null, stat:{guile:1}, line:'Sathi\'s bone whistle, that Hackle answers and nobody else can hear properly. Hackle is not here to answer it now.'},
    b2_bead:{name:'A Kanese prayer bead', slot:'trinket', who:null, stat:{wits:1}, line:'Tangle\'s prayer bead, from Itko Kan, with no prayer he could ever remember. He gave it to the sergeant on the Geleen Plain. "You remember one," he said.'},
    b2_knotstring:{name:'A knotted string', slot:'trinket', who:null, stat:{wits:1}, line:'Marrow\'s string: a knot for every healing that took, from Hissar to the Geleen Plain. She put it in the sergeant\'s hand and closed the hand. "Count them for me, child."'},
    b2_sash:{name:'A red sash', slot:'trinket', who:null, stat:{might:1}, line:'A Red Blade\'s red sash, folded, kept for the day there was a horse to ride in it. Ramin gave it to the sergeant on the Geleen Plain, still folded.'} },

  scenes:{
    b2_sanimon:{loc:'Sanimon', sub:'The Khundryl', cap:'A sea of riders coming down off the ridges, and the army they were thought to belong to turning to look at them, too late.', amb:'wind'},
    b2_geleen:{loc:'The Geleen Plain', sub:'Dusk · the split', cap:'Grass at dusk, one long column going on into the west, and a smaller, darker line of riders turning back the way it came.', amb:'dusk'},
    b2_kherahn:{loc:'The Geleen Plain', sub:'The Kherahn Dhobri', cap:'Old men and women by a fire, grave as judges, and between them and the Fist, chests of silver, open.', amb:'plain'} },

  end:{
    whole:['The whole squad', 'On the Geleen Plain the Fist split the Chain: the refugees went on to Aren with the historian and the youngest Wickans, and the Seventh stayed behind with him to hold Dom off. Every one of the squad chose the column. The sergeant walked at the head of the stretch with all of them, and nobody looked back at the dark line turning east, and all of them wanted to.'],
    some:['Some stayed', 'On the Geleen Plain the Fist split the Chain: the refugees went on to Aren with the historian and the youngest Wickans, and the Seventh stayed behind with him to hold Dom off. Not all of the squad went with the column. The sergeant walked at the head of the stretch, one short, or two, and counted the gap anyway.'],
    many:['Many stayed', 'On the Geleen Plain the Fist split the Chain: the refugees went on to Aren with the historian and the youngest Wickans, and the Seventh stayed behind with him to hold Dom off. Most of the squad stayed with it. The sergeant walked at the head of the stretch with what was left, and the stretch walked closer round the sergeant than it ever had.'] },
  endScene:'b2_geleen',
  endCap:()=> S.f.b2_c6_key === 'whole' ? `Night on the Geleen Plain. The whole squad is walking west. Behind it, east, a dark line of riders is going the other way, and nobody in the squad turns round to watch it go.` : `Night on the Geleen Plain. The column is walking west. Behind it, east, a dark line is going the other way, and some of the squad is in it.`,
  tease:'Next: Balahn, and Aren Way, three leagues of road past old barrows to a city with its gates shut. And behind the column, the Barrow.',

  extras:()=>{ const f = S.f, x = [], st = b2Rearguard();
    x.push(`The squad came to the Geleen Plain with ${b2Chain()}.`);
    if (f.b2_bottleThrown) x.push('At Sanimon the squad saw the Fist pull the Trygalle\'s bottle off over his head and throw it to the historian.');
    if (f.b2_warchief) x.push('The Khundryl war chief came down to the Fist\'s standard at dusk and named the strongest tribe on the Odhan. Three times.');
    if (f.b2_ilhar === 'came') x.push('Haddat\'s brother Ilhar took off the green cloth at Sanimon and walks in the squad\'s stretch.');
    if (f.b2_ilhar === 'parted') x.push(`Haddat found her brother at Dom's water-carts at Sanimon and they said what they had to say. ${f.b2_ilharGave ? 'She gave him back his water. ' : ''}He went back to Dom alive.`);
    if (f.b2_ilhar === 'fell') x.push('Haddat found her brother at Dom\'s water-carts at Sanimon, under the Khundryl. She said his name to him, at the end.');
    if (f.b2_ilhar === 'lost') x.push('Haddat saw her brother at Dom\'s water-carts at Sanimon, under the Khundryl, and the sergeant held her back. Nobody knows what became of him.');
    if (trickBy('b2_paint')) x.push(`${NAME(trickBy('b2_paint'))} wears the Khundryl paint into a fight.`);
    if (f.b2_dojalDone) x.push('On the running retreat the squad held Dojal Spring long enough for its stretch to drink.');
    if (f.b2_retreatLost) x.push(`The forty hours of the running retreat cost the stretch ${numw(f.b2_retreatLost)}.`);
    if (f.b2_paid) x.push('The squad put its own silver on the Kherahn elders\' chests, with the Seventh\'s wages and the Wickans\' gold.');
    if (f.b2_listWar) x.push('Corporal List stayed with the Fist. He sent the historian a message: he had found his war.');
    st.forEach(id => x.push(`${NAME(id)} stayed with the Fist's rearguard${id === 'sathi' ? ', and Hackle with her' : ''}.`));
    if (!st.length && f.b2_c6_key) x.push('Every one of the squad who could choose chose the column.');
    return x; },

  journal:()=>{ const f = S.f; return [
    f.b2_sanimonDone && `At Sanimon the Fist attacked Dom's tribes at dawn and could not break them. At noon the Khundryl came down off the ridges, tens of thousands of them, and everyone had thought they were Dom's. They were not anybody's. They broke the Bhilard, the Can'eld, the Tregyn and what was left of the Semk and the Tithansi.`,
    f.b2_bottleThrown && `In the middle of Sanimon the Fist threw the Trygalle's bottle to the historian.`,
    f.b2_warchief && `At dusk the Khundryl war chief rode to the Fist's standard and named the strongest tribe on the Odhan: the Wickans.`,
    f.b2_retreat && `After Sanimon Dom attacked for more than forty hours without stopping: Tathimon, Dojal Spring. The Seventh is down to about five thousand who can fight.`,
    f.b2_kherahn && `On the Geleen Plain the Fist paid the Seventh's wages to the elders of the Kherahn Dhobri, and the Wickans added their own wealth, for the refugees' passage to Balahn.`,
    f.b2_c6_key && `The Fist split the Chain on the Geleen Plain. The historian, Nil and Nether and the youngest Wickans take the refugees on to Aren. The Seventh stays behind with the Fist.`].filter(Boolean); },

  dlg:{}
};

/* ---------------- the hills above Sanimon: the night before ---------------- */
Object.assign(B2CH6.dlg, {
  b2_c6_start:()=>({sp:'The hills above Sanimon', scene:'b2_odhan_dusk', fx:()=>{ if (!S.f.b2_c6Start) { S.f.b2_c6Start = 1; S.f.b2_drankSkip = 0; S.f.b2_dry = 0; chain(0, -1, 'The last day on the Nenoth'); } }, txt:
`The last day on the Nenoth takes one more of the stretch, an old man from the potters' street who sat down on the clay at noon to rest and was resting at dusk. ${b2In('haddat') ? 'Haddat has his name.' : 'You have his name.'} Then the clay turns to stone, and the stone to hills, and in the hills there is water, real water, coming out of the rock in a seep as thin as a thread.

There is also everyone else.

${b2Away() ? `You count the squad at the halt and get to ${NAME(b2Away())} and stop. Aren, by now. Or not. ` : ''}${b2Hurt() ? `${NAME(b2Hurt())} sits down carefully at the halt and gets up carefully, the Vathar wound bound tight under the kit, and says it is better. It is not better. ` : ''}${b2In('tangle') ? `"${b2Count()}," Tangle says, to the satchel. ` : ''}${b2In('marrow') ? `Marrow has ${b2Knots()}.` : ''}`,
    html:chainHTML('The hills above Sanimon · the end of the Nenoth'),
    ch:[b2DeckChoice(6), {t:'Look round.', go:()=>startExplore()}]}),
  /* the reading at the halt above Sanimon (47c) */
  b2_c6_deck:()=>b2DeckOffer(6, 'b2_c6_card'),
  b2_c6_card:()=>b2DeckCard(6),

  /* ---- Bult: the dawn ---- */
  b2_bult9:()=>({sp:'Bult', fx:()=>{ S.f.b2_bult9 = 1; }, txt:
`Bult is going round the squads in the dark with a stick, poking the fires down so they do not show, which is a joke, since every fire on every ridge for a league round is showing.

"Sergeant." He leans on the stick. "Dawn. The Fist's going at them before they're out of their blankets. The Tregyn, there, and the Bhilard on their flank." He points across the valley with the stick, at a long low glow. "Dom's got the Can'eld behind them, and what's left of the Semk and the Tithansi, and his own legions further back, and he thinks he's got those." The stick goes up, and round, at the ridges. "The Khundryl."

He looks at the ridges a while.

"Tens of thousands. Painted, the scouts say, and in scale under their furs, and their horses are better than ours, which these days isn't hard. Dom's riders go up there every evening and come back down again, and Dom's camp sings." He spits. "So either we're dead tomorrow, or we're dead the day after. The Fist says go at dawn. I agree with him. It's his nephew's privilege to be right, and an uncle's to say so."`,
    ch:[{t:'"And if the Khundryl aren\'t Dom\'s?"', go:'b2_bult9b'},
        {t:'"Dawn, then."', go:()=>startExplore()}]}),
  b2_bult9b:()=>({sp:'Bult', txt:`"Then they're nobody's." He shrugs. "That's worse, mostly. A tribe that's nobody's has come to watch, and it'll eat whoever loses." He pokes a fire down. "Your stretch goes behind the Seventh's line, on the slope, with the carts. Your squad goes in front of it. Sleep, if you can. I can't. I'm old, I've stopped needing to."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_duiker9:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker9 = 1; S.f.b2_duiker = 1; }, txt:
`The historian is sitting on a rock with his back to the Fist's tent and his notebook shut on his knee, which for him is a kind of despair.

"He's still wearing it," he says, before you can ask anything. "The bottle. The trader said always, and the Fist does what he's told by nobody, so I assume he decided to." He looks up at the ridges. "Have you seen them? The Khundryl. I went up with the scouts this afternoon as far as the scouts would go. Grey scale under the furs, like the skin of something that lives in rivers. Black braids. Faces as pale as a northerner's under the paint. They didn't look at us. They looked at the valley." He opens the notebook, and shuts it again. "As if it were a horse they were thinking of buying."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_list8:()=>({sp:'Corporal List', fx:()=>{ S.f.b2_list8 = 1; }, txt:
`List is sitting with his bad foot in the seep's runnel, which the healers would have words about, with a look on his face you have not seen on it since the Hissar yard. Peaceful, nearly.

"He hasn't come back," he says. "My Jaghut. Not since the forest." He moves his toes in the water. "I thought I'd miss him. I don't. I keep thinking..." He frowns, trying to get it right. "I keep thinking I'm about to find something, Sergeant. Something I was looking for. And I don't know what it is, and I'm not frightened of it." He looks at you. "That's mad. Isn't it."

${b2In('marrow') ? `"Yes," says Marrow, from the dark, where she is sitting down. "Get your foot out of that, child, before it rots off you and you never find anything."` : 'You tell him it isn\'t. You are not sure.'}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_lull6:()=>({sp:'Captain Lull', fx:()=>{ S.f.b2_lull6 = 1; }, txt:
`Captain Lull is sitting on a saddle with his back to the firelight, because of the face. What Gelor left of it has healed the way bad things heal on the march: badly, and quickly, and for good.

"Sergeant." The voice is the same. "Dawn. We go at them before they're out of their blankets. The Fist's idea. I said it was a good one. I say that about all of them now. It saves time." He turns his head so the one eye can see you. "If you're wondering about the Khundryl, stop. I've stopped. Whoever they are, they'll still be there at noon, and at noon we'll know."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the squad, the night before ---- */
  b2_haddat6:()=>({sp:'Haddat', fx:()=>{ S.f.b2_haddat6 = 1; }, txt:
`Haddat is standing at the edge of the camp with her shield on her back, looking across the valley at Dom's fires.

"There," she says, without turning round. "Behind the Tregyn. Those are the water-carts." You look. Carts in a row, a fire beside them, and men going to and fro between the carts and a spring with skins on their shoulders. ${S.f.b2_ilharWater ? `"The tribes' water. Somebody is filling the tribes' skins for Dom." She touches the belt where ${S.f.b2_ilharSkin === 'kept' ? 'her mother\'s skin hangs, full' : 'her mother\'s skin hung, before the stretch drank it'}. "My mother's skins."` : `"Somebody fills the tribes' skins for Dom. Somebody who knows water."`}

She is quiet a while.

"If he is anywhere tomorrow, Sergeant, he is at the water. He was always at the water." She turns round. "I am not asking you for anything. I am telling you where I will be looking."`,
    ch:[{t:'"Look, then. I\'ll look with you."', fx:()=>{ S.f.b2_ilharLook = 1; loy('haddat', 1); }, go:()=>startExplore()},
        {t:'"Tomorrow you look at the Tregyn, Haddat. Nothing else."', fx:()=>{ S.f.b2_ilharLook = 0; }, go:'b2_haddat6b'}]}),
  b2_haddat6b:()=>({sp:'Haddat', txt:`"Yes, Sergeant." She says it in Hissari, which makes it sound like an oath, and it is one, and you both know she will keep it and look anyway, with the corner of her eye, the whole of the day.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_sathi6:()=>({sp:'Sathi', fx:()=>{ S.f.b2_sathi6 = 1; }, txt:
`Sathi comes back from the Weasel fires in the dark with Hackle at her knee and sits down by the squad's cart without a word, which is unlike her, and then says a great many words in Wickan to the dog, which is not.

"They are talking," she says at last, in Malazan. "At the fires. The old ones. They say if it comes to the end, the Fist will send the young ones away. To live. To take the story home to the plains." She pulls Hackle's ear. "The young ones. Nil. Nether. The children who ride the remounts." She looks at you, and her teeth${S.f.b2_sathiTeeth ? ', filed to points,' : ''} show. "I am seventeen, Sergeant. I have ridden with Coltaine since the plains. ${S.f.b2_sathiRode ? 'I turned the herd on the Nenoth with the clan. ' : ''}I am not a child for sending away."`,
    ch:[{t:'"If it comes to it, I\'ll speak for you."', fx:()=>{ S.f.b2_sathiPromise = 1; loy('sathi', 1); }, go:'b2_sathi6b'},
        {t:'"Nobody is sending anyone anywhere yet. Sleep."', go:'b2_sathi6c'}]}),
  b2_sathi6b:()=>({sp:'Sathi', txt:`She looks at you a long moment. Then she nods, once, the way the Weasel captain nods, and lies down against the cart wheel with Hackle across her legs. "Good," she says, to the dog, in Malazan, so you will hear it. "The sergeant will speak. Remember it."`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_sathi6c:()=>({sp:'Sathi', txt:`"Yet," Sathi says. She says it to Hackle, and Hackle thumps his tail once, and neither of them says anything else. She does not sleep. You can tell by the dog.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_tangle6:()=>({sp:'Tangle', fx:()=>{ S.f.b2_tangle6 = 1; }, txt:
`Tangle has the satchel open on the tailboard and is counting it by feel, in the dark, with his eyes shut.

"${b2Count()}," he says. "Same as at the Vathar${S.inv.sharper + S.inv.burner + S.inv.cusser + S.inv.smoker <= 2 ? ', near enough. Near enough nothing' : ''}." He closes it. "Bungle came by. The company's dry, he says. Not water. Nothing to throw. He says if it comes to a last ditch the Fist'll want sappers in it, and sappers with nothing to throw are men with spades, and men with spades are what a last ditch is." He hums the four notes, and stops on the third. ${S.f.b2_bungle5 === 'gave' ? `"Mincer asked after me. By name." He looks at the satchel. "He's never done that."` : S.f.b2_robe === 'mincer' ? `"Mincer asked after me. Since the ford he asks." He doesn't say what happened in the ford. He never has.` : `"Mincer's digging latrines and singing. Somebody should."`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_marrow6:()=>({sp:'Marrow', fx:()=>{ S.f.b2_marrow6 = 1; }, txt:
`Marrow is sitting on the stone by the seep with her hat over her face and her string in her lap.

She has ${b2Knots()}. "I count them at night," she says, under the hat, as if she knew you would ask. "It is better than counting the other thing." She lifts the hat. ${S.f.b2_warrenFloor ? `"It is still there, child. At the bottom. Since the Vathar. Big, and patient, and I put my hand in every day and it moves when I touch it." She puts the hat back. "I am getting tired of being touched back."` : `"The warren is mud again, since the tower. Mud and fur. I go on reaching. What else is a healer for?"`}${b2Hurt() && b2Hurt() !== 'marrow' ? ` She looks over at ${NAME(b2Hurt())}. "That one will not close. Not with me. Not on this road."` : ''}`,
    ch:[{t:'Let her sit.', go:()=>startExplore()}]}),

  b2_ramin8:()=>({sp:'Ramin', fx:()=>{ S.f.b2_ramin8 = 1; loy('redblade', 1); }, txt:
`Ramin is polishing the red of his scale by the light of somebody else's fire, very carefully, a scale at a time.

"The company has horses again," he says. "Eleven. Taken off the Tregyn on the Nenoth. Not one for me." He does not sound as if he minds; he sounds as if he has decided not to. "The commander says I am still lent." He holds a scale up to the firelight. "Tomorrow the tribes will see the red, and they will say: the lapdogs. Let them say it. A dog that knows whose it is does not have to wonder at dawn."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ours10:()=>({sp:b2Ours6() || 'The squad\'s people', fx:()=>{ S.f.b2_ours10 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.younger} is counting the fires on the ridges with a stick in the dirt, a scratch for each, and has run out of dirt. ${B2.elder} is watching her do it.

"She asked me whose they are," ${B2.elder} says. "I said nobody's. She said everybody's somebody's." She almost smiles. ${S.f.b2_jar === 'kept' ? `"She filled Father's jar at the seep tonight. The first water in it since Hissar that wasn't his. She cried. Then she stoppered it and she was fine."` : `"She carries Father's jar still. Empty. She says it's for when we get there."`}` : S.f.b2_jarboy ? 
`${B2_BOY} is with the stretch, sitting on a cart with his knees up, watching the ridges. "There's Crow riders in the camp," he says. "I asked them. About the girls." He shakes his head. "They don't know. Nobody knows anybody, Sergeant. There's too many." He keeps watching the ridges.` : S.f.b2_yedda ?
`${B2.widow} is sitting on her rope with her grandsons asleep against her. "All those fires," she says. "My husband used to say you could tell a tribe by its fires. Little and close, they're afraid. Big and far apart, they're not." She looks at the ridges. "Those aren't afraid of anything, soldier."` :
`Your people, round a fire nobody is allowed to let show, eating what the hills have: a lizard, roots, ${b2In('sathi') ? 'a hare Sathi\'s dog brought in' : 'a hare somebody\'s snare caught'}. The children are asleep. The grown ones are watching the ridges.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the camp at night: the seep, the ridges, the horse lines, the fire, the cart ---- */
  b2_hseep:()=>({sp:'The seep', txt: S.f.b2_seepDone ?
`The seep, a thread of water out of the rock into a basin somebody's grandfather cut, and a line of the Seventh waiting at it with skins, and the line never gets shorter.` :
`Water, coming out of the rock in a thread no thicker than a fuse-cord, into a stone basin somebody cut a long time ago. A line of the Seventh waiting at it with skins. It takes an age to fill one. Nobody minds. It is water, and it is not from Darujhistan, and it is not in a dead man's skin.`,
    ch:[{t:'Wait in the line. Fill the squad\'s skins.', tag:'+3 water', req:()=>!S.f.b2_seepDone, fx:()=>{ S.f.b2_seepDone = 1; chain(3, 0, 'The seep in the hills'); }, go:'b2_seep_done'},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_seep_done:()=>({sp:'The seep', txt:`It takes most of the night. ${b2In('haddat') ? 'Haddat fills them, one after another, slowly, the water-seller\'s way, not a drop on the stone, and says nothing about it.' : 'You fill them one after another, slowly, not a drop on the stone.'} When the last one is full the sky in the east has gone the colour of a bruise.`, html:chainHTML('The hills above Sanimon · the seep'), ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ridge:()=>({sp:'The lookout', fx:()=>{ S.f.b2_khundryl = 1; }, txt:
`A spur of rock at the top of the camp where the pickets stand, and from it the whole of it: the valley, Dom's fires across it in their thousands, and above both, all the way round, on every ridge, more fires. Nobody's.

They are singing up there, the Khundryl. Not Dom's camp's songs. Something slower, under the wind, that comes and goes.

${b2In('haddat') ? `Haddat listens a long time with her head on one side. "I know some of their words," she says. "Not many. Their grandmothers traded salt with mine." She listens. "They are not singing about Dom. They are singing about horses. And about the strongest." She frowns. "*Who is the strongest.* Over and over. As if it were a question."` : 'You listen until the wind takes it. It sounds like a question, asked over and over.'}`,
    ch:[{t:'Back down.', go:()=>startExplore()}]}),

  b2_hhorses:()=>({sp:'The horse lines', txt:
`The Wickan horse lines, the horses drinking at last from buckets passed hand to hand up from the seep, a mouthful at a time, the riders talking to them low. ${b2In('sathi') ? `Sathi is down the line with the bony grey from the Nenoth, and the grey has its head on her shoulder.` : ''} Further along, at the end of the line, the youngest of the Wickans, the remount boys and girls, the ones who hold the spare horses in a fight, are sitting together and not talking at all.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_hfire:()=>({sp:'A fire', txt:`A fire in a hollow of the rock, kept low, the squad's, with the stretch's fires further down the slope. Above everything, on every ridge, the other fires.`,
    ch:[{t:'Drink, and sleep while there is night left.', tag:'1 water', req:()=>!S.f.b2_hillsRest && chainW() > 0, fx:()=>{ S.f.b2_hillsRest = 1; dgRest('The squad sleeps in the hollow of the rock with its boots on, under more fires than stars. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),

  b2_hcart:()=>({sp:'The squad\'s cart', txt: !S.f.b2_bult9 ?
`The squad's cart, with the stretch asleep round it. Bult will be along, the way he always is before a fight. Nobody sleeps much the night before Bult.` :
`The squad's cart, and the stretch round it, packing in the dark. The east has gone grey. Across the valley Dom's fires are going out one by one as the tribes wake up. On the ridges, none of the fires go out.

The Seventh is forming up below the camp in silence.`,
    ch:[{t:'Down to the line.', req:()=>!!S.f.b2_bult9, go:'b2_sdawn'},
        {t:'Not yet.', go:()=>startExplore()}]}),

  /* ---- dawn: into the Tregyn ---- */
  b2_sdawn:()=>({sp:'Dawn · Sanimon', scene:'b2_odhan_day', txt:
`The Seventh goes down the slope in the half-dark with its shields up and nobody speaking, and the Wickans go round on either side at a walk, and at the bottom of the valley the Tregyn are getting out of their blankets.

It will be noon before this is done, one way or the other. Everybody knows it. Anybody in iron will be an oven by then. ${[b2In('haddat') && 'Haddat', b2In('redblade') && 'Ramin'].filter(Boolean).length ? `${[b2In('haddat') && 'Haddat', b2In('redblade') && 'Ramin'].filter(Boolean).join(' and ')} ${b2In('haddat') && b2In('redblade') ? 'are' : 'is'} in iron.` : ''}

${chainW() > 0 ? `There are ${numw(chainW())} skin${chainW() === 1 ? '' : 's'} on the cart.` : 'There is no water on the cart.'}`,
    ch:[{t:'Drink first, all of you. One skin.', tag:'1 water', req:()=>chainW() > 0, fx:()=>{ b2Drink('b2_sanimon'); }, go:'b2_sdawn2'},
        {t:'No. Keep it for the stretch. Into them.', go:'b2_sdawn2'}]}),
  b2_sdawn2:()=>({sp:'Dawn · Sanimon', scene:'b2_odhan_day', txt:
`The Fist's horn. The Seventh starts to run.`,
    ch:[{t:'Into the Tregyn.', go:()=>startBattle('b2_sanimon', {surprise:'p'})},
        {t:'Tangle: a sharper into their blankets first.', tag:'uses 1 sharper', req:()=>b2In('tangle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; },
          go:()=>startBattle('b2_sanimon', {surprise:'p', pre:'Tangle hums four notes, stops, and lobs a sharper into the nearest knot of blankets, and the blankets come up off the ground all at once with the men in them.'})}]}),

  b2_after_sanimon:()=>({sp:'Noon · Sanimon', scene:'b2_sanimon', fx:()=>{ if (!S.f.b2_sanimonDone) { S.f.b2_sanimonDone = 1; S.f.b2_khundryl = 1; S.f.b2_bottleThrown = 1; chain(0, -2, 'Sanimon'); } }, txt:
`Four rounds. Five. The fold holds, and then it doesn't have to.

The sound comes first: a long rolling thunder from the ridges, from all the ridges at once, north and south, and the ground under your boots shaking with it. Then they come down. The Khundryl, in their tens of thousands, out of the hills, the whole slope of the world moving, grey scale and fur and black braids and the sun on the blades of them.

They do not come for the Seventh. They go past the end of the Seventh's line at a gallop, close enough to touch, and into the Tregyn from behind, and into the Bhilard, and on through the Can'eld into Dom's flank, and the army that thought it owned them turns round to look at them, too late, all along the valley, the way a man turns to look at a door that has opened behind him.

In the middle of it, on the rise where the standard is, you see Coltaine. He pulls something off over his head on a chain, smoky, the size of a thumb, and throws it, hard, without looking, to the historian beside him, who catches it against his chest the way you catch something you did not want. The Fist does not watch him catch it. He is already riding down the slope.

${b2In('sathi') ? 'Sathi is laughing. She cannot stop. Hackle is barking at the whole valley.' : ''}${b2In('haddat') ? ` Haddat is not laughing. She is looking north, past the Tregyn, at the water-carts.` : ''}`,
    ch:[{t:'Afterwards.', go:()=>{ startExplore('b2_field'); talk('b2_field_arrive'); }}]}),
});

/* ---------------- the field at Sanimon: the afternoon after, the bottle, the Khundryl, Ilhar ---------------- */
Object.assign(B2CH6.dlg, {
  b2_field_arrive:()=>({sp:'Sanimon · afternoon', scene:'b2_sanimon', fx:()=>{ S.f.b2_field = 1; }, txt:
`It takes Dom four hours to drive the Khundryl back off his flank, and when he has done it there is nothing behind them to drive. The Bhilard are gone into the hills. The Tregyn are gone. The Can'eld are dead on the slope in their wrapped faces, or running, and what was left of the Semk and the Tithansi is not left any more.

Dom's legions draw off north in good order, because Dom is a general. Everybody else is just gone.

The Seventh holds the field. It does not know what to do with it. It stands in its ranks on the valley floor among the dead with its shields still up, in the heat, and watches the Khundryl ride to and fro across the valley, taking what they want from the tribes' camps, singing. Nobody has told anybody what the Khundryl are now. Nobody knows.

The Fist's word comes down the line at last: the column moves at dusk. Until then, nobody goes near the Khundryl who doesn't have to.`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  b2_duiker10:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker10 = 1; }, txt:
`The historian is sitting under a dead tree with the bottle in his hands. Not wearing it. Holding it, on its chain, the way you would hold a small animal you had been given and did not know how to feed.

"You saw," he says. You did. "He threw it at me. In the middle of it. He didn't say a word, he didn't look, he just threw it, and I caught it, because when the Fist throws something at you, you catch it." He turns it over. Smoky glass. Nothing inside. "The trader said *wear it always*. The Fist decided that meant me." He looks up at you. "Do you know what I think, Sergeant? I think he's decided how this ends. And he wants somebody to be there to write it down who isn't in it." He puts the chain over his own head, slowly. "I'd rather he hadn't."`,
    ch:[{t:'"Maybe he just didn\'t want it, sir."', go:'b2_duiker10b'},
        {t:'Leave him to it.', go:()=>startExplore()}]}),
  b2_duiker10b:()=>({sp:'Duiker', txt:`"Maybe." He tucks the bottle inside his shirt. "That's what I'll write. Maybe the Fist didn't want it." He almost laughs. "Nobody will believe that either."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- a Khundryl warrior, and the paint ---- */
  b2_khund:()=>({sp:'A Khundryl warrior', fx:()=>{ S.f.b2_khund = 1; S.f.b2_khundryl = 1; }, txt:
`A Khundryl warrior on foot, holding a pony with a dead Tregyn's mantle thrown over its withers like a prize. Up close the grey scale under the furs is exactly what Duiker said, the skin of something that lives in rivers, and the face is pale under three broad strokes of ochre and ash, from the brow down across the eyes.

He looks at you, and at the squad, with a great deal of interest and no fear at all. Then he says something, and laughs.

${b2In('haddat') ? `"He asks which tribe we are," Haddat says. "I told him the Seventh. He says he has never heard of it. He says it fights like a tribe that has nothing to go home to." She listens. "He says that is a compliment."` : `You do not have the words. He doesn't seem to mind. He points at your face, and at his, at the paint, and laughs again.`}`,
    ch:[{t:'Ask about the paint.', check:['guile',16], trick:'b2_paint', req:()=>!S.f.b2_paintTry, fx:()=>{ S.f.b2_paintTry = 1; },
          edges:id=>[id === 'haddat' && ['she has some of their grandmothers\' words', 2], id === 'sathi' && ['one rider to another', 1], id === 'redblade' && ['a red horse with no horse, and he knows it', -1], id === 'tangle' && ['he smells of fire, and they like that', 1]],
          go:'b2_khund_paint', fail:'b2_khund_no'},
        {t:'Nod, and leave him to his pony.', go:()=>startExplore()}]}),
  b2_khund_paint:()=>({sp:'A Khundryl warrior', txt:
`${by({haddat:`Haddat asks it in the grandmothers' words, badly, and he laughs at how badly, and then stops laughing, and looks at her a long moment, and takes a pot of ochre from his belt.`, sathi:`Sathi asks it in no words at all: she points at the paint, and at her own face, and grins with her teeth, and he grins back with his, and takes a pot of ochre from his belt.`, _:`{who} asks it with a finger, pointing from the paint to {who}'s own face, and he considers it, and then takes a pot of ochre from his belt.`})}

Three strokes, with two fingers, from the brow down across the eyes, ochre and then ash, and a word with each one. ${b2In('haddat') ? `"He says the one who wears it has already been mourned," Haddat says, very quietly. "So there is nothing left to be afraid of."` : 'You do not need the words. You can feel what they mean.'}

He looks at his work, and nods, and gets back on his pony with the Tregyn's mantle, and rides away singing. It washes off by evening. It does not, somehow, go.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_khund_no:()=>({sp:'A Khundryl warrior', txt:`He listens, or watches, with his head on one side, and then laughs, not unkindly, and shakes his head, and taps the paint on his own face, and then taps yours, and says one word. ${b2In('haddat') ? `"Not yet," Haddat translates.` : 'It sounds like *not yet*.'} He rides off singing.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the war chief, at dusk ---- */
  b2_warchief:()=>({sp:'The Fist\'s standard · dusk', scene:'b2_sanimon', fx:()=>{ S.f.b2_warchief = 1; }, txt:
`At dusk they come down to the Fist's standard: a knot of Khundryl war chiefs, grey scale and furs and fetishes, black braids to the waist, and one in front of the others, older, with the paint on his face gone dark with the day's sweat.

The Seventh's line opens for them because nobody knows what else to do. Coltaine comes out to meet them on foot, in his black feathers, and the old war chief does not get down off his horse.

${b2In('haddat') ? `Haddat is close enough to hear, and has the words, some of them. She gives them to you under her breath as they come.

The Fist thanks them. Plainly; Coltaine does not do anything any other way. He gives them the day.

The war chief laughs at him. *Thanks*, he says. *We did not come for you. We came to see which tribe on the Odhan was the strongest. We have waited a long time to know.*

The Fist says the Wickans are no tribe of the Odhan now. They are of the Empire. They are beyond such things.

"He did not like that," Haddat breathes.` : `You cannot hear what they say. You can see it: the Fist speaking, short, plain, and the old war chief laughing at him from the saddle, and the Fist saying something else, shorter.`}

The war chief draws his sword. Every Wickan bow on the field comes up. He does not even look at them. He lifts the blade over his head, high, at the standard, and he shouts, and his chiefs shout with him, and then the whole valley, every Khundryl on it, all of them at once, in their tens of thousands:

*The Wickans. The Wickans. The Wickans.*

Then they turn their horses and ride away into the dusk, still shouting it, and it goes on, fainter and fainter, from the hills, for a long time after you can no longer see them.

${b2In('sathi') ? 'Sathi is crying. She is also laughing. Wickan manners. Hackle howls with the hills.' : 'Somewhere among the Wickans, someone is laughing. Wickan manners.'}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ours11:()=>({sp:b2Ours6() || 'The squad\'s people', fx:()=>{ S.f.b2_ours11 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.younger} is asleep on the cart with her arms round her father's jar, in the middle of a battlefield, at noon. ${B2.elder} sits beside her with a stick across her knees that she picked up somewhere this morning and has not put down.

"They came past the carts," she says. "The horsemen. Close enough to touch. Hundreds. She didn't wake up." She looks at the stick, as if she has only just seen it. "I was going to hit one."` : S.f.b2_yedda ?
`${B2.widow} has her grandsons under the cart and is sitting in front of it on her rope with a cleaver in her lap. "All those horses," she says. "Going past. I thought, well, Yedda, this is it, and then they went past." She does not put the cleaver down.` :
`Your people, under the carts, where they went when the Khundryl came down. Most of them have not come out yet. A boy from the weavers' street is counting the horses that go past and has got to a number nobody believes.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_fdead:()=>({sp:'The dead', txt:
`Can'eld, mostly, here, in their wrapped faces, where the Khundryl went through them. Some Tregyn. A Bhilard boy no older than the jar-boys in Hissar, with a horse-bow still in his hand. The Khundryl have been along already and taken what they wanted, which is the horses and the good knives and, from the chiefs, something you do not look at long enough to see.

${b2In('marrow') ? 'Marrow walks among them and does not reach for the warren. There is nothing here for it.' : 'There is nothing here for anyone.'}`,
    ch:[{t:'Leave them.', go:()=>startExplore()}]}),

  b2_ftree:()=>({sp:'The rise', txt:`A dead tree on the rise where the Fist's standard was this morning. From under it you can see the whole valley: the Seventh in its ranks, small, the dead, the Khundryl riding to and fro across Dom's camps, and north, a long way off, the dust of Dom's legions going away in good order. ${S.f.b2_ilhar ? '' : b2In('haddat') ? 'And north of the field, the water-carts, and the Khundryl among them.' : ''}`,
    ch:[{t:'Down.', go:()=>startExplore()}]}),

  /* ---- Dom's water-carts, and Ilhar ---- */
  b2_wcarts:()=>({sp:'Dom\'s water-carts', txt: S.f.b2_ilhar || !b2In('haddat') ?
`Dom's water-carts, what the Khundryl have left of them: barrels stove in, the carters gone, the skins taken. ${S.f.b2_ilhar === 'fell' ? 'A place on the ground by the third cart where Haddat knelt.' : S.f.b2_ilhar === 'lost' ? 'Nothing, by the third cart, where there was somebody.' : 'The water soaking into the ground.'}` :
`The water-carts, at the north edge of the field, where Dom's tribes had their spring: a dozen carts in a row and barrels on them, and men who were filling skins this morning, and the Khundryl among them now on their ponies, riding the carters down one at a time, without hurry, the way you would clear a field of stones.

On the third cart a man in a city coat is standing very still with a skin over his shoulder and a knife in his hand, and a green cloth on his arm, watching the riders come along the row toward him.

Haddat has stopped walking. She does not say anything. She does not have to. You have never seen him, and you would know him anywhere: he has her face.

The nearest rider is four carts away.`,
    ch: S.f.b2_ilhar || !b2In('haddat') ? [{t:'Leave it.', go:()=>startExplore()}] : [
      {t:'"Go, Haddat. We\'re with you."', check:['guile',14,'haddat'], fx:()=>{ S.f.b2_ilharTry = 1; },
        edges:id=>[['she has the Khundryl grandmothers\' words', 2], S.f.b2_ilharLook && ['the sergeant said they would look together', 1], b2Hurt() === 'haddat' && ['the Vathar wound', -1]],
        go:'b2_ilhar_reach', fail:'b2_ilhar_late'},
      {t:'"Haddat. Hold. They are our allies today, and he is theirs."', go:'b2_ilhar_hold'}]}),

  b2_ilhar_hold:()=>({sp:'Haddat', fx:()=>{ if (!S.f.b2_ilhar) { S.f.b2_ilhar = 'lost'; loy('haddat', -2); } }, txt:
`Haddat holds. Her whole body holds, the way it does behind the shield, and her hand closes on the tulwar until the knuckles go pale.

The rider comes along the row. Another cart. Another. Dust goes up from the third cart, and men, and horses, and when it comes down there is nobody standing on it, and nobody on the ground beside it that you can see from here, and the rider is going on along the row, and you will never know.

Haddat does not look at you. "Yes, Sergeant," she says, in Hissari. Then she turns round and walks back to the Seventh's line, very straight, and does not say anything else for the rest of the day.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ilhar_late:()=>({sp:'The water-carts', fx:()=>{ if (!S.f.b2_ilhar) { S.f.b2_ilhar = 'fell'; loy('haddat', 1); } }, txt:
`You run. Haddat is ahead of you, shouting in the grandmothers' words, and the rider hears her and turns in the saddle to look, and it is the wrong moment for him to look, because the man on the cart has decided not to wait, and comes down off it with the knife at the pony's legs, and the rider's lance comes round without his even thinking about it.

When you get there it is done. The rider looks at Haddat, at her face, at the man's face, and says something that might be sorry, and rides on.

Haddat is on her knees by the third cart with his head in her lap. He is still alive. Not for long, and he knows it, and he looks up at her as if she were the last thing he expected and the only thing he wanted. He says something in the quarter's Hissari. She answers. ${S.f.b2_ilharSkin === 'kept' ? `She takes her mother's skin off her belt, the one from the Nenoth, full, and unstoppers it, and gives him a mouthful, the way a water-seller gives it, not a drop on the ground. "Your water," she says. "The column did not need it."` : 'She cups his face in her hands.'}

She says his name. You hear her say it. It is the last time.

Afterwards she cuts the green cloth off his arm, and folds it, and puts it inside her coat, and you carry him to the Seventh's line between you, because she will not leave him for the Khundryl, and the Seventh buries him with its own dead and does not ask whose he was.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ilhar_reach:()=>({sp:'The water-carts', txt:
`Haddat goes down the row at a run with her shield up, shouting in the grandmothers' words, and the nearest rider hears her and pulls his pony round to see who in the world is shouting at him in his own tongue.

${nearMiss() ? `He has already lowered the lance. It goes into the side of the cart a hand from the man's leg, and stays there, and the rider laughs and lets go of it.` : 'He has the lance up. He holds it there.'}

"*Mine*," Haddat says to him, and puts herself between the pony and the cart. "*This one is mine. My brother. My prisoner. My blood.*" ${b2In('sathi') ? 'Sathi is beside her with an arrow on the string, laughing, which is the right thing to do with a Khundryl, as it turns out.' : ''} The rider looks at her shield, and her face, and the man's face on the cart, and laughs, and says something, and rides on along the row to the next cart.

The man on the cart puts the knife down. He looks at his sister for a long moment.

"You took the Empire's silver," he says. In Malazan, so that you will understand him. "I heard."

"I keep my word on it," says Haddat.`,
    ch:[{t:'Let them talk.', go:'b2_ilhar_talk'}]}),

  b2_ilhar_talk:()=>({sp:'Ilhar', txt:
`He gets down off the cart. He is thinner than she is, and burned dark, in a city coat that was good in Hissar, with the green cloth on his arm and her mother's mark on every skin across his back. He looks at you once, the way the quarter looks at a soldier, and then not again.

They talk in the quarter's Hissari. Haddat gives you some of it, flat, after.

He says: *Dom says the column dies at Aren. He says Aren will not open for Coltaine. He says it as if he knew.* He says: *I filled their skins because somebody had to know where the water was, and it was always me.* He says: *I told them, at the ridge. Leave the blue shield alone.* He says: *Come with me. There is water where I am going.*

Haddat says nothing for a long time. Then she looks at you.

"Sergeant," she says. "Tell me what to say to him."`,
    ch:[{t:'"Give him back his water, Haddat."', req:()=>S.f.b2_ilharSkin === 'kept' && !S.f.b2_ilharGave, fx:()=>{ S.f.b2_ilharGave = 1; }, go:'b2_ilhar_water'},
        {t:'"Ask him to come with us. The column is his too."', check:['guile',15,'haddat'], fx:()=>{ S.f.b2_ilharAsked = 1; },
          edges:id=>[S.f.b2_ilharGave && ['she gave him back his water', 3], S.f.b2_prisonerFate === 'free' && ['a tanners\' boy told him the Malazans gave water', 2], S.f.b2_ilharSign === 'named' && ['she said his name at the Vathar', 1], S.f.b2_c5_key === 'column' && ['the stretch drank first on the Nenoth', 1]],
          go:'b2_ilhar_came', fail:'b2_ilhar_parts'},
        {t:'"Say goodbye to him, Haddat. Let him go."', go:'b2_ilhar_parts'}]}),

  b2_ilhar_water:()=>({sp:'Haddat', txt:
`Haddat takes her mother's skin off her belt, the one from the Nenoth, full, the stopper tied down, and holds it out to him.

"Your water," she says, in Malazan, so you will hear it too. "From a Tregyn on the Nenoth. The column did not need it."

He looks at the skin, at the mark on the neck of it. He takes it. Then he laughs, a short helpless laugh, exactly like hers, and puts his hand over his eyes.

"It did," he says. "It did need it. You're a liar, sister. You always were a terrible liar."`,
    ch:[{t:'"Ask him now, Haddat."', check:['guile',15,'haddat'], fx:()=>{ S.f.b2_ilharAsked = 1; },
          edges:id=>[['she gave him back his water', 3], S.f.b2_prisonerFate === 'free' && ['a tanners\' boy told him the Malazans gave water', 2], S.f.b2_ilharSign === 'named' && ['she said his name at the Vathar', 1], S.f.b2_c5_key === 'column' && ['the stretch drank first on the Nenoth', 1]],
          go:'b2_ilhar_came', fail:'b2_ilhar_parts'},
        {t:'"Now say goodbye."', go:'b2_ilhar_parts'}]}),

  b2_ilhar_came:()=>({sp:'Ilhar', fx:()=>{ if (!S.f.b2_ilhar) { S.f.b2_ilhar = 'came'; chain(0, 1, 'A water-seller from Hissar'); loy('haddat', 2); } }, txt:
`Haddat asks him. Not in Malazan. You do not need it in Malazan.

He doesn't answer for a long time. He looks north, where Dom's dust is going away. He looks at the Khundryl along the row of carts. He looks at the Seventh, standing in its ranks among the dead in the heat, and at the column's carts on the slope behind it, and at his sister.

Then he unties the green cloth from his arm, slowly, and holds it a moment, and gives it to her.

"I know where the water is," he says, in Malazan, to you. "Between here and Aren. Every well. I've been filling Dom's skins from them for a month." He shrugs, her shrug. "Somebody should fill yours."

He walks into your stretch that evening with her mother's skins across his back and no cloth on his arm, and the stretch looks at him, and at Haddat, and asks nothing, which is the quarter's manners and the Chain's.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ilhar_parts:()=>({sp:'Ilhar', fx:()=>{ if (!S.f.b2_ilhar) { S.f.b2_ilhar = 'parted'; loy('haddat', 1); } }, txt:
`${S.f.b2_ilharAsked ? 'Haddat asks him. He hears her out. Then he shakes his head, slowly, the way the quarter shakes its head at a price it will not pay.' : 'Haddat does not ask him. She looks at him a long time instead, the way she looks at the faces in the column, learning it.'}

"Aren will not open," he says. "Not for you." He touches her cheek, once, with the back of his hand. "Stay alive, Haddat. Somebody has to sell the water when this is over."

He goes back up the row through the Khundryl, who let him, because she has said he is hers, with her mother's skins on his back, north, toward the dust where Dom is. He does not look back. Neither does she.

"He was always the one who knew where the water was," she says, when he is gone. "He still is." She says his name, once, to nobody. Then she goes back to the line.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ilhar_after:()=>({sp:'Ilhar', txt:`Haddat's brother, walking in the stretch with the water-sellers' skins across his back, already telling a carter which side of the next ridge the well is on. He catches you looking. He doesn't look away, and he doesn't smile. "Sergeant," he says. It is the quarter's word for it, not the army's.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- dusk: the column moves ---- */
  b2_field_out:()=>({sp:'The Seventh\'s lines', txt: !S.f.b2_warchief ?
`The Seventh's lines. The column is packing to move at dusk. Over by the Fist's standard the Khundryl war chiefs are coming down off the slope, slowly, as if they had all the time in the world. It might be worth seeing.` : b2In('haddat') && !S.f.b2_ilhar ?
`The Seventh's lines, packing to move. Haddat is standing at the end of the line looking north across the field at the water-carts, where the Khundryl are, and does not move when the line moves.` :
`The Seventh's lines, packing. The column is moving already, the carts first, west and south out of the valley into the dusk, and the Seventh's rearguard forming behind it. Somewhere north Dom is gathering what Sanimon left him. He will not wait long.`,
    ch:[{t:'Move out with the column.', req:()=>!!S.f.b2_warchief && !(b2In('haddat') && !S.f.b2_ilhar), go:'b2_retreat'},
        {t:'Not yet.', go:()=>startExplore()}]}),
});

/* ---------------- the running retreat: forty hours, Tathimon, Dojal Spring ---------------- */
Object.assign(B2CH6.dlg, {
  b2_retreat:()=>({sp:'The running retreat', scene:'b2_odhan_dusk', fx:()=>{ if (!S.f.b2_retreat) { S.f.b2_retreat = 1; const c = chainC(), loss = c ? Math.max(2, Math.round(c * .12)) : 0; S.f.b2_retreatLost = loss; chain(-3, -loss, 'Forty hours'); } }, txt:
`Dom does not wait long. He does not wait at all.

He comes at the column's tail an hour after dark, and again at midnight, and again before dawn, and all the next day, and the next night: not a battle, never a battle, only the edge of his army reaching out of the dark and taking a bite and going back, over and over, the way the sea takes a beach. The Seventh walks backwards across the Odhan with its shields up for forty hours, and fights for most of them, and sleeps standing, and the column walks in front of it and does not stop.

Somewhere in the second night the guides say *Tathimon*, and there are a few walls in the dark, and a well full of stones, and Dom's riders round it, and then it is behind you and you never see more of it than the name.

The column shrinks. Not all at once: a cart that loses a wheel and is left, a grandmother who sits down, a child who wanders to the edge in the dark. Bult comes down the line on the second morning on a horse that is mostly bones and says the Seventh is five thousand who can still hold a weapon, and does not say how many it was.

${S.f.b2_retreatLost ? `The stretch loses ${numw(S.f.b2_retreatLost)} in the forty hours. ${b2In('haddat') ? 'Haddat has their names. She says them walking, because nobody stops.' : 'You have their names. You say them walking.'}` : 'Nobody in the stretch is lost, because there is nobody in the stretch to lose.'}${S.f.b2_ilhar === 'came' ? ` Ilhar walks at the front of it with his mother's skins and finds water where nobody else would look: a cistern under a stone, a seep at the root of a dead tree. Twice. The stretch has started to call him the water-seller.` : ''}`,
    html:chainHTML('The running retreat · forty hours'),
    ch:[{t:'Noon of the second day.', go:()=>{ startExplore('b2_dojal'); talk('b2_dojal_arrive'); }}]}),

  b2_dojal_arrive:()=>({sp:'Dojal Spring · noon', scene:'b2_odhan_day', txt:
`Dojal Spring: a pool among tamarisks in a fold of the plain, green, the first green since the hills. The column's head reaches it at noon of the second day and the whole Chain smells it at once, and the carts start to run.

So do Dom's people. A company of his on foot, pikes and bows, and Can'eld who escaped the Khundryl, coming down on the far side of the spring to take it, or foul it, or only to stand on it while the column dies of thirst in sight of it.

Captain Lull is at the spring with his one eye and a handful of marines. He sees your squad come down the slope and lifts a hand. It means: *here*.`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  b2_lull7:()=>({sp:'Captain Lull', fx:()=>{ S.f.b2_lull7 = 1; }, txt: S.f.b2_dojalDone ?
`Lull is sitting on the edge of the spring with his boots in it, which is against every order the Seventh ever gave about water. "Officers' privilege," he says. "I've lost an eye and a nose. I'm owed a foot-bath."` :
`"Sergeant." Lull nods across the pool at the tamarisks, where pike-heads move above the scrub. "Dom's. They mean to sit on this. The Fist means them not to. The column needs an hour at the water. Give it one." He considers. "Two would be generous. I'd remember you in my prayers, if I prayed." He goes back to his marines. His one eye watches you go, so you know he means it.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_bungle6:()=>({sp:'Captain Bungle', fx:()=>{ S.f.b2_bungle6 = 1; }, txt:
`Bungle's company is digging. Of course it is: a ditch across the column's road behind the spring, at a run, with spades, the sappers stripped to the waist and grey with dust. Mincer is in the ditch, at the deep end. He is singing.

"Rumour," says Bungle, coming over with the slate, "is that the Fist means to cut the column in two before Aren. Send the people on. Keep the army back to hold the door." He looks at the ditch. "If he does, the company stays. Sappers dig the last ditch. That's what we're for, at the end. Mincer says so." In the ditch, Mincer waves his spade. ${b2In('tangle') ? `Bungle looks at Tangle. "You'd be welcome. If it comes to it. Just saying." Tangle doesn't answer. He hums the four notes. He stops on the fourth.` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_nobles6:()=>({sp:'A noble\'s carriage', fx:()=>{ S.f.b2_nobles6 = 1; S.f.b2_tumlit = 1; }, txt:
`The Council's carriages have come up to the spring ahead of the carts, the way they come up to everything, and their servants are filling barrels at the edge of the pool. Lord Nethpara is sitting in the door of his carriage with a damp cloth on his neck, watching them do it. He sees you, and his face does a thing. ${S.f.b2_stewardWon || S.f.b2_conduct ? 'He remembers you.' : ''}

"Lord Tumlit is unwell," he says, to nobody, as if somebody had asked. "In his carriage. He has been unwell since the Vathar. The heat." He dabs his neck. "Nobody thinks of us, Sergeant. Nobody ever thinks of us."

${b2In('haddat') ? `Haddat says something to the servants at the barrels, in the quarter's Hissari, quietly. One of them looks up at her, and then at the stretch coming down the slope behind her with its pots, and moves his barrel along, to make room.` : 'The servants at the barrels do not look up.'}`,
    ch:[{t:'Leave him to his cloth.', go:()=>startExplore()}]}),

  b2_ours12:()=>({sp:b2Ours6() || 'The squad\'s people', fx:()=>{ S.f.b2_ours12 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.elder} is carrying ${B2.younger} on her back. ${B2.younger} has not walked since Tathimon. She is not hurt. She is just finished, the way children finish, all at once.

"The water," ${B2.younger} says, into her sister's neck, when she sees the green of the tamarisks. "Is that water." ${B2.elder} says yes. ${B2.younger} holds the jar tighter. "Is it ours."

${B2.elder} looks at you.` : S.f.b2_ilhar === 'came' ?
`Ilhar is at the front of the stretch, looking at the tamarisks the way a man looks at a ledger. "Good water," he says. "Sweet. Dom's people know it too." He looks at you. "My sister will want to know where I am in the fight. Tell her: with the pots. Somebody has to carry the pots."` : S.f.b2_yedda ?
`${B2.widow}'s cart has lost a wheel at last, somewhere in the second night, and she is carrying the rope over her shoulder, coiled, and her grandsons are carrying everything else. "Not leaving the rope," she says, before you can ask. "A rope's a rope."` :
`Your people, coming down the slope toward the green with their pots, faster than they have moved in two days, and then stopping, all of them at once, when they see the pike-heads in the tamarisks.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_spring6:()=>({sp:'Dojal Spring', txt: S.f.b2_dojalDone ?
`The spring, and the stretch round it, drinking: slowly, holding it, the way the Chain has learned, and then not slowly at all. ${b2In('sathi') ? 'Sathi has her face in it like a horse.' : ''}` :
`The pool among the tamarisks, green and still, and across it, in the scrub on the far side, the pike-heads of Dom's company, and their bows, and the wrapped faces of the Can'eld. Between them and the water, nobody yet.

It is noon. ${chainW() > 0 ? `There are ${numw(chainW())} skin${chainW() === 1 ? '' : 's'} on the cart, and a spring in front of you, and the squad has been walking backwards for forty hours.` : 'There is no water on the cart. There is a spring in front of you.'}`,
    ch:[{t:'Drink first, all of you, from the skins. Then take the spring.', tag:'1 water', req:()=>!S.f.b2_dojalDone && chainW() > 0, fx:()=>{ b2Drink('b2_dojal'); }, go:()=>startBattle('b2_dojal', {})},
        {t:'Take the spring. Drink after.', req:()=>!S.f.b2_dojalDone, go:()=>startBattle('b2_dojal', {})},
        {t:'Tangle: a smoker over the pool first, so their bows are blind.', tag:'uses 1 smoker', req:()=>!S.f.b2_dojalDone && b2In('tangle') && S.inv.smoker > 0, fx:()=>{ S.inv.smoker--; },
          go:()=>startBattle('b2_dojal', {pre:'Tangle lobs a smoker over the pool and it bursts in the tamarisks, and the far bank goes white, and the bows in it are shooting at sounds.'})},
        {t:'Leave it.', go:()=>startExplore()}]}),

  b2_after_dojal:()=>({sp:'Dojal Spring', fx:()=>{ if (!S.f.b2_dojalDone) { S.f.b2_dojalDone = 1; chain(4, 0, 'Dojal Spring'); } }, txt:
`The captain goes down in the tamarisks with his badgeless coat over his face, and what is left of his company goes back into the scrub and keeps going.

Behind you the stretch is already at the water. Nobody told them they could. Nobody needed to.

${S.f.b2_key === 'daughters' ? `${B2.younger} gets down off her sister's back and walks to the edge of the pool on her own and fills Ressan's jar, very carefully, and stoppers it. Then she drinks out of her hands. ` : ''}${S.f.b2_ilhar === 'came' ? `Ilhar fills his mother's skins at the far edge of the pool, where the water comes in clean, and carries them back to the stretch, and gives them to Haddat to give out. ` : ''}The squad fills its skins last, and sits in the shade of the tamarisks with its boots in the mud, and for a while nobody says anything at all.`,
    html:chainHTML('Dojal Spring · the running retreat'),
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_dcart:()=>({sp:'The squad\'s cart', txt:`The squad's cart in the shade of the tamarisks. ${S.f.b2_dojalDone ? 'Full skins on the tailboard, for once.' : 'The skins on the tailboard, and the spring, and Dom\'s people between.'}`,
    html:chainHTML('Dojal Spring'),
    ch:[{t:'Drink, and sleep an hour in the shade.', tag:'1 water', req:()=>!!S.f.b2_dojalDone && !S.f.b2_dojalRest && chainW() > 0, fx:()=>{ S.f.b2_dojalRest = 1; dgRest('The squad sleeps an hour in the tamarisks with its boots in the mud. It is the first sleep in forty hours that nobody has to stand up for. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),

  b2_dojal_out:()=>({sp:'The road west', txt: !S.f.b2_dojalDone ?
`The road on, west, out of the fold. Nobody is going anywhere until the column has drunk.` :
`The road on, west, out of the fold of the plain, and the column already on it, the carts first. Beyond, the guides say, the Odhan turns to grass: the Geleen Plain. And on the Geleen, the Kherahn Dhobri, who have kept out of the war, and whom the Fist means to ask for something.`,
    ch:[{t:'On, to the Geleen.', req:()=>!!S.f.b2_dojalDone, go:'b2_geleen_go'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_geleen_go:()=>({sp:'The Geleen Plain', scene:'b2_kherahn', fx:()=>{ S.f.b2_geleen = 1; }, txt:
`Grass.

After the Nenoth, after the hills and the forty hours, grass: short and grey-green, and then long, to the knee, moving in the wind like water, all the way to the edge of the sky. The column walks into it as if it were walking into a river, slowly, touching it.

At dusk there is a fire on the plain ahead, a single fire, and old men and women round it on blankets, grave as judges, and the Fist rides out to it alone with Bult and two Wickans leading horses, and on the horses are chests.`,
    ch:[{t:'Make camp.', go:()=>{ startExplore('b2_geleen'); talk('b2_geleen_arrive'); }}]}),
});

/* ---------------- the Geleen Plain: the silver, the order, the partings, the split ---------------- */
/* the parting choices: let them choose as they lean (+1), ask them the other way (only if they trust you: loyalty 2 or more), or argue
   it (the sergeant's own guile, DC 15, helped by loyalty and by the argument that matters to them). A failed argument leaves them where
   they leaned. The result nodes settle it: as they leaned is 'own', the other way is 'talked', unless a choice already said 'asked'. */
function b2PartCh(id, o){ const lean = b2Lean(id), stay = lean === 'stay';
  return [
    {t:stay ? o.letStay : o.letGo, fx:()=>{ b2Choose(id, stay, 'own'); loy(id, 1); }, go:stay ? o.stayNode : o.goNode},
    {t:stay ? o.askGo : o.askStay, tag:'they trust you', req:()=>(S.loy[id] || 0) >= 2, fx:()=>{ b2Choose(id, !stay, 'asked'); }, go:stay ? o.goNode : o.stayNode},
    {t:stay ? o.argGo : o.argStay, check:['guile', 15, 'sgt'], edges:()=>b2Sway(id, stay ? o.edgesGo : o.edgesStay), go:stay ? o.goNode : o.stayNode, fail:stay ? o.stayNode : o.goNode}]; }
const b2Settle = (id, stay) => { if (!b2Said(id)) b2Choose(id, stay, (b2Lean(id) === 'stay') === stay ? 'own' : 'talked'); };

Object.assign(B2CH6.dlg, {
  b2_geleen_arrive:()=>({sp:'The Geleen Plain · dusk', scene:'b2_kherahn', txt:
`The column makes camp in the long grass a bowshot from the elders' fire, and for the first time since Hissar nobody has to be told to sit down.

The word goes round the carts the way word does: the Kherahn Dhobri, who kept out of the war and kept their treaties, are deciding whether to let the column through their country, and feed it, and take it to Balahn, where the road to Aren begins. The Fist has brought them something to help them decide.

And another word, quieter: Lord Tumlit of the Council died in his carriage last night, of nothing anybody can name. Lord Nethpara says it was his heart. Lord Pullyk says nothing at all.`,
    html:chainHTML('The Geleen Plain · dusk'),
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  /* ---- Bult: the silver ---- */
  b2_bult10:()=>({sp:'Bult', fx:()=>{ S.f.b2_bult10 = 1; }, txt:
`Bult is standing a little way off from the elders' fire with his thumbs in his belt, watching the Fist talk, or rather watching the Fist not talk, which with Coltaine is most of it.

"Sergeant." He doesn't take his eyes off the fire. "You see the chests? The Seventh's pay. All of it. Every soldier's wages since Hissar, forty-one thousand jakatas in silver, and the Fist's put it on a blanket in front of a lot of old Kherahn and said: this, for the people. Food. Healing. Passage. An escort to Balahn." He spits in the grass. "And the Wickans have been taking the gold out of their braids all evening and throwing it in on top. My nephew's a madman. I've always said."

He looks at you at last. "Every Can'eld and Bhilard who got away from the Khundryl has heard there's a fortune in chests on a blanket on the Geleen. Stand by them till the old ones say yes. They're slow. They're Kherahn. They're thinking about it properly, which is more than anyone else in this war has done."`,
    ch:[{t:'"To the chests."', go:()=>startExplore()},
        {t:'"And if they say no?"', go:'b2_bult10b'}]}),
  b2_bult10b:()=>({sp:'Bult', txt:`"Then we're on the Geleen with no pay, five thousand who can fight, forty thousand who can't, and Dom a day behind." He shrugs. "So they'll say yes. The Fist doesn't make a bet he hasn't won already. He just likes to watch the other man find out."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_kherahn6:()=>({sp:'A Kherahn elder', scene:'b2_kherahn', fx:()=>{ S.f.b2_kherahn = 1; }, txt:
`An old woman of the Kherahn Dhobri, sitting on a blanket by the fire with her hands folded, in a robe the colour of the grass, looking at the chests of silver the way a judge looks at a man who has pleaded guilty to something he did not do.

She looks at you for a long time. Then at the squad. Then past you, at the column, its fires spread out across the grass for a league, and the people round them.

${b2In('haddat') ? `She says something. Haddat answers, carefully, in a tongue you have never heard her use. "She asks if those are ours," Haddat says. "The people. I said some of them are. She says: then why is it the soldiers' silver on the blanket, and not theirs?" Haddat pauses. "I said they have none. She says: then it is a good bargain."` : `She says something you do not understand, and nods at the column, and nods at the silver, as if she were weighing one against the other and finding it a fair price.`}`,
    ch:[{t:'Put the squad\'s own silver on the chests.', tag:'all the squad\'s silver', req:()=>!S.f.b2_paid && S.silver > 0, fx:()=>{ S.f.b2_paid = S.silver; S.silver = 0; chain(0, 2, 'The Kherahn\'s healers'); if (b2In('haddat')) loy('haddat', 1); if (b2In('sathi')) loy('sathi', 1); if (b2In('tangle')) loy('tangle', -1); }, go:'b2_kherahn_paid'},
        {t:'Bow, and leave her to her judging.', go:()=>startExplore()}]}),
  b2_kherahn_paid:()=>({sp:'A Kherahn elder', txt:`You put it on the blanket with the rest: not much, against forty-one thousand, a sergeant's purse and what the squad had in its boots. The old woman watches you do it. Then she lifts one hand and says a word, and two of the younger Kherahn get up from the edge of the firelight and go with you to your stretch, with bags, and kneel by the sick, and start to work. ${b2In('marrow') ? `Marrow watches them a while, and then sits down beside one of them and starts to work too, and they do not need a language for it.` : ''}${b2In('tangle') ? ` Tangle counts the empty purse. "Worth it," he says. "Probably. Don't tell me if it wasn't."` : ''}`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_chests:()=>({sp:'The chests', txt: S.f.b2_silverDone ?
`The chests, on the blanket by the elders' fire. The elders have said yes. Nobody is guarding them any more: they are the Kherahn's, and the Kherahn's young men sit by them with spears across their knees, and nobody in the world is going to try.` : !S.f.b2_bult10 ?
`Chests on a blanket by the fire, lids open, silver in them to the brim, and Wickans throwing gold on top out of their braids. You have never seen so much money. Nobody in the Seventh has. Bult is watching it with his thumbs in his belt.` :
`The chests, lids open, silver to the brim, and the gold of the Wickans' braids on top, catching the firelight, and the elders round them on their blankets thinking. Out in the long grass, beyond the light, the grass is moving against the wind.`,
    ch:[{t:'Stand by the chests.', req:()=>!!S.f.b2_bult10 && !S.f.b2_silverDone, go:'b2_silver_go'},
        {t:'Leave them.', go:()=>startExplore()}]}),
  b2_silver_go:()=>({sp:'Dusk · the chests', txt:
`They come at the last of the light, out of the long grass on foot, low, wrapped faces: Can'eld who got away from the Khundryl at Sanimon with nothing, and have come a long way to get something. They are not coming for the column. They are coming for the blanket.

The elders do not get up. They do not even look round. The old woman goes on thinking, with her hands folded, as if the squad between her and the knives were a thing she had already taken into account.`,
    ch:[{t:'Meet them in the grass.', go:()=>startBattle('b2_silver', {})},
        {t:'Sathi and Hackle out into the grass first, the Weasel way.', check:['guile',15], req:()=>b2In('sathi'),
          edges:id=>[id === 'sathi' && ['Hackle knows long grass', 2], id === 'haddat' && ['mail', -1], id === 'redblade' && ['spurs', -2]],
          go:'b2_silver_quiet', fail:'b2_silver_loud'}]}),
  b2_silver_quiet:()=>({sp:'The long grass', txt:`${by({sathi:'Sathi goes into the grass with the dog and the grass closes behind them. A breath. Out in the dusk somebody sits down suddenly, and the grass round him thrashes once, and is still.', _:'{who} goes out into the grass with Sathi and the dog. A breath. Out in the dusk somebody sits down suddenly, and does not get up.'})}`, ch:[{t:'Now.', go:()=>startBattle('b2_silver', {surprise:'p'})}]}),
  b2_silver_loud:()=>({sp:'The long grass', txt:`A bird goes up out of the grass under somebody's boot, shrieking, and every wrapped head out there comes round at once.`, ch:[{t:'At them.', go:()=>startBattle('b2_silver', {})}]}),

  b2_after_silver:()=>({sp:'The elders\' fire · night', scene:'b2_kherahn', fx:()=>{ if (!S.f.b2_silverDone) { S.f.b2_silverDone = 1; S.f.b2_kherahn = 1; } }, txt:
`The chief goes down among the Wickan horses${b2In('sathi') ? ' with Hackle\'s teeth in his arm' : ''} and a remount child's knife in his side, and the rest are gone back into the grass, and the horses are safe, and the chests.

When you come back to the fire the old woman of the Kherahn is standing up. The elders are all standing up. She says one word to the Fist, and Coltaine nods, once, and that is the bargain made: passage, and food, and healers, and an escort to Balahn.

Bult comes over from the fire. He doesn't look at the chests. He looks at you, and the squad, and the stretch behind you, for a long moment, the way he looked at you in the camp outside Hissar when he said *you own these*.

"Here it is, then," he says. "The Fist's splitting the Chain. The people go on to Aren with the Kherahn, tonight. The historian takes them. Nil and Nether, and the youngest of the Wickans, the children, as their escort, because they're all the Wickans have left that'll live to be old. And the squads that hold stretches walk their stretches." He jerks his head east, back the way you came. "Everybody else stays with the Fist. The Seventh holds Dom off the column's tail as long as there's a Seventh to do it."

He lets that sit.

"He says it's not an order for anyone who'd rather stay with him. That's the only thing he's said today that isn't an order. Your people will have to choose. Each of them. Tonight."`,
    ch:[{t:'"And me?"', go:'b2_bult_sq'},
        {t:'"I\'d rather stay, Bult."', go:'b2_bult_no'}]}),
  b2_bult_sq:()=>({sp:'Bult', txt:`"You?" He looks surprised that you asked. "You've got a stretch. I gave it you outside Hissar, and I said *you own these*, and I meant it the way a Wickan means it. A herder doesn't stay behind to die well. A herder gets the herd home." He claps you on the shoulder, hard. "Go and hear your people. Then come and tell me who's walking and who isn't. I'll want to know who to look for, at the end."`, ch:[{t:'Go and hear them.', go:()=>startExplore()}]}),
  b2_bult_no:()=>({sp:'Bult', txt:`"No." He doesn't even think about it. "You'd rather. I'd rather be thirty and on a good horse in the Wickan hills with a girl I knew once. We're not getting what we'd rather, Sergeant, either of us." He jabs a finger at the stretch, at the carts and the fires in the grass. "I gave you those outside Hissar. *You own these.* A herder doesn't stay behind to die well. A herder gets the herd home. That's the harder job, and you know it, and that's why it's yours." He claps you on the shoulder. "Go and hear your people. Then come and tell me."`, ch:[{t:'Go and hear them.', go:()=>startExplore()}]}),

  b2_bult11:()=>({sp:'Bult', txt: !b2AllSaid() ?
`Bult is watching the column start to pack, by firelight. "Heard them all yet?" He sees that you have not. "Every one, Sergeant. Then come back to me. Nobody's going anywhere till moonrise."` :
`Bult looks at you as you come up, and at the squad behind you, and reads it off your faces before you say anything. You say it anyway. ${b2Here6().length ? b2Here6().map(id => `${NAME(id)}: ${b2Staying(id) ? 'stays' : 'walks'}.`).join(' ') : 'There is nobody to choose but you, and you do not get to.'}

He nods at each name, slowly, as if he were putting it somewhere.`,
    ch:[{t:'"That\'s all of them."', req:()=>b2AllSaid(), fx:()=>b2DoSplit(), go:'b2_split'},
        {t:'Not yet.', go:()=>startExplore()}]}),

  b2_coltaine6:()=>({sp:'Coltaine', fx:()=>{ S.f.b2_coltaine6 = 1; }, txt:
`The Fist is standing by the elders' fire, alone now that the bargain is made, in his black feathers, with his broken hand bound and his face giving nothing to the firelight. Where the bottle hung at his neck there is nothing.

He sees you. He looks past you, at your stretch, at its carts and its fires in the long grass, for what feels like a long time.

"Walk them," he says.

That is all. He goes back to looking at the fire.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_duiker11:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker11 = 1; }, txt:
`The historian is standing at the edge of the firelight with his horse's reins in his hand, looking at the column the way a man looks at a river he has been told to carry across a desert in his arms.

"Me," he says. "He gave them to me. Forty thousand people. I am a historian, Sergeant. I write down what other people do." He touches his shirt, where the bottle is. "I suppose that's why. Somebody has to be there at the end to write it, and not be in it." ${S.f.b2_duikerTold3 ? `He looks at you. "You told me your stretch's story at the Ridge, names and all. I wrote it down. I'd like to write the end of it in Aren. Walk at the front with me, when we go."` : `He looks at you. "You still owe me a column, you know. The story of it. Walk at the front with me, when we go, and tell me on the way."`}

He gets up on the horse, badly, the way he always does. "Lull's staying," he says. "And List. Did you know? List sent word. He says he's found his war." He shakes his head. "He's so young, Sergeant."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_lull8:()=>({sp:'Captain Lull', fx:()=>{ S.f.b2_lull8 = 1; S.f.b2_listWar = 1; }, txt:
`Lull is sitting on his saddle in the grass, fitting a new strap to his shield by feel. He does not get up.

"Sergeant. You're walking, I hear. Good. Somebody should." He works the strap. "I'm rearguard. I've always been rearguard. It's restful; you always know which way the enemy is." He tugs it tight. "Corporal List came to me an hour ago. Asked me to take a message to the historian, because he couldn't say it to his face, the historian being the historian." The one eye looks at you. "*I have found my war.* That was the message. That was all of it." He goes back to the strap. "I've been a soldier longer than he's been alive and never found mine. I'm told it's a thing that happens to corporals."

${S.f.b2_list7 ? `Over by the standard, List is sitting with his bad foot stretched out and the Seventh's colours across his knees, mending a tear in them with a needle, very carefully, the way you mend something you mean to keep.` : `Over by the standard, List is sitting with his bad foot stretched out, looking east, peaceful, the way you have only seen him look since the forest.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_youngest:()=>({sp:'Nil and Nether', fx:()=>{ S.f.b2_youngest = 1; if (S.f.b2_jarboy) S.f.b2_girlsVathar = 1; }, txt:
`The youngest of the Wickans are gathered at the horse lines, the remount boys and girls and the warlocks, Nil and Nether in the middle of them, and they are furious. Not loud. Wickans are not loud. They stand with their arms folded and their faces shut and their horses saddled, which is worse.

"He sends us to herd," Nil says. He is not talking to you. He is talking to the grass. "The last warlocks of the Wickans, and he sends us to herd cattle that walk on two legs." Nether says nothing at all. She is looking east, where the Seventh will stand, with her jaw set so hard it must hurt.

${S.f.b2_jarboy ? `${B2_BOY} is among them, from the Wickan wagons, asking each of them the same thing, in his hoarse voice. One of them, a Crow girl no older than him, stops and thinks about it. "Two city girls," she says. "In front of my aunt and behind my cousin. As far as the river. The bad river." She shrugs. "After that, I don't know. After that nobody knows anybody." ${B2_BOY} thanks her, the way the quarter thanks, and goes on asking.` : b2In('sathi') ? `Sathi is not among them. She is at the other end of the horse lines with the Weasels, as far from the children as the lines go, with her back to them.` : 'One of the remount girls is crying, very angrily, into her horse\'s neck.'}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_weaselcap6:()=>({sp:'The Weasel captain', fx:()=>{ S.f.b2_weaselcap6 = 1; }, txt: !b2In('sathi') ?
`The Weasel captain is going down the clan's lines with his lance across his shoulders, looking at each rider as he passes, as if he were counting them for something. He nods to you. He does not stop.` :
`The Weasel captain, going down the clan's lines with his lance across his shoulders. He stops by you without being asked, and looks over at Sathi, who is at the end of the line with Hackle, not looking at either of you.

"The Fist says the young go," he says. "With the warlocks. She is young." ${S.f.b2_weaselHonour || S.f.b2_sathiRode || S.f.b2_sathiLaugh ? `He looks at her a while. "She is also a Weasel. ${S.f.b2_sathiRode ? 'She turned the herd on the Nenoth. ' : ''}${S.f.b2_weaselHonour ? 'She held at the Shallows. ' : ''}${S.f.b2_sathiLaugh ? 'She laughed at the Foolish Dog\'s song. ' : ''}If she rides with the clan tonight, the clan will not send her away." He shrugs. "I do not tell her. I tell you. You are her sergeant."` : `He does not look at her. "If she stays, she stays on foot, with your Malazans. The clan does not take her. I do not tell her. I tell you."`}`,
    ch: !b2In('sathi') ? [{t:'On.', go:()=>startExplore()}] : S.f.b2_weaselHonour || S.f.b2_sathiRode || S.f.b2_sathiLaugh ? [{t:'On.', fx:()=>{ S.f.b2_sathiClan = 'yes'; }, go:()=>startExplore()}] : [
      {t:'"She rode with my squad from Hissar, Captain. Take her, if she stays."', check:['guile', 15, 'sgt'], edges:()=>[S.f.b2_sathiPromise && ['you gave her your word', 2], S.f.b2_sathiTeeth && ['her teeth are filed', 1], ['the captain has watched her all the way', 1]], go:'b2_weaselcap6_yes', fail:'b2_weaselcap6_no'},
      {t:'"Then she goes with the children."', fx:()=>{ S.f.b2_sathiClan = 'no'; }, go:()=>startExplore()}]}),
  b2_weaselcap6_yes:()=>({sp:'The Weasel captain', fx:()=>{ S.f.b2_sathiClan = 'yes'; }, txt:`He hears you out. Then he looks at Sathi, for the first time in a long time, a long look. "If she stays," he says, "she rides with the clan." He goes on down the line. He does not tell her. He was never going to.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_weaselcap6_no:()=>({sp:'The Weasel captain', fx:()=>{ S.f.b2_sathiClan = 'no'; }, txt:`He hears you out, and shakes his head, once. "The Fist says the young go," he says. "I do not argue with the Fist on the last night." He goes on down the line.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ours13:()=>({sp:b2Ours6() || 'The squad\'s people', fx:()=>{ S.f.b2_ours13 = 1; }, txt:
`The Kherahn women have come out into the column's camp with bread, and bowls of something hot, and salve, and they go from fire to fire giving it out, and the column does not know what to do. It has forgotten how. People hold the bread and look at it. A man from the potters' street tries to pay with a button.

${S.f.b2_key === 'daughters' ? `${B2.younger} is asleep with a Kherahn woman's hand on her forehead, and the woman is singing to her in a language nobody here knows. ${B2.elder} is watching them, very still. "Nobody has done that," she says, "since Mother." She does not look away.` : S.f.b2_ilhar === 'came' ? `Ilhar is talking to a Kherahn grandmother about the wells between here and Balahn, in a tongue that is half Hissari and half hands, and she is laughing at him. Haddat watches them from across the fire, and does not come over, and does not look away.` : S.f.b2_yedda ? `${B2.widow} has been given a bowl and has given it to her grandsons and been given another and given that away too, and the Kherahn woman has sat down beside her and is not leaving until she eats. They are both very stubborn. It is going to be a long night.` : `A Kherahn woman is going along your stretch with a bowl, and a child takes it, and then gives it back, because it does not believe it is allowed to keep it.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_gfire:()=>({sp:'The elders\' fire', txt:`The elders' fire, and the old Kherahn round it on their blankets, and the chests beside it${S.f.b2_silverDone ? ', paid' : ''}. ${S.f.b2_silverDone ? 'The Fist is not there now. Only the silver and the old people and the fire.' : 'The Fist stands at the edge of the light, saying nothing, while they think.'}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ghorses:()=>({sp:'The horse lines', txt:`The Wickan horse lines in the long grass. The riders have been taking the gold out of their braids all evening, rings and wire and little bells, and walking to the elders' fire with it in their fists, and coming back with their hair loose. ${S.f.b2_silverDone ? 'Now they are saddling: some to ride west with the children, and most of them, the older ones, to ride east with the Fist.' : ''}${b2In('sathi') ? ` Sathi has taken the Weasel teeth from her throat${S.f.b2_sathiTeeth ? ', and her own are filed now and she does not need them,' : ''} and is turning them over in her hand, deciding.` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_gcart:()=>({sp:'The squad\'s cart', txt:`The squad's cart in the long grass, the stretch round it, eating Kherahn bread. ${S.f.b2_silverDone ? 'The squad is not eating. The squad is waiting to be asked.' : ''}`,
    html:chainHTML('The Geleen Plain'),
    ch:[{t:'Drink, and rest.', tag:'1 water', req:()=>!S.f.b2_geleenRest && chainW() > 0, fx:()=>{ S.f.b2_geleenRest = 1; dgRest('The squad rests in the long grass with Kherahn bread in it and water from Dojal, and for an hour it is almost like being alive. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),

  b2_part_said:()=>({sp:'The squad', txt:`They have said it. There is nothing left to say to them tonight that would not take it back, and you will not take it back.`, ch:[{t:'On.', go:()=>startExplore()}]}),
});

/* ---------------- the partings: each of the squad chooses, with the sergeant's say ---------------- */
Object.assign(B2CH6.dlg, {
  /* ---- Haddat ---- */
  b2_part_haddat:()=>{ const f = S.f, lean = b2Lean('haddat');
    return {sp:'Haddat', txt:
`Haddat is sitting by the stretch's fire with her shield across her knees, watching the elders' fire, where the chests are.

${lean === 'go' ? `"My brother walks in your stretch," she says, before you can ask. "With no cloth on his arm, and my mother's skins on his back, finding water for people who would have killed him in Hissar. If I stay, he walks into Aren a rebel, with nobody who knows his name." She turns the shield over. "I took the Empire's silver. I can keep the word on it in Aren as well as here." She looks up at you. "Tell me I am wrong, Sergeant. I would like somebody to."` :
`"I watched them count it," she says. "The silver. Forty-one thousand. Mine is in it. Seven years, every coin the Empire paid me since I was twenty-one, on a Kherahn blanket, for the column's road." She turns the shield over. "Paid. The Empire has paid me in full tonight, and given it all away, and I find I do not mind.

"I took the silver. I said I would keep my word on it. I never said to whom. I thought it was to the column." She looks at the fire where the Fist is standing. "It was to him. I am staying."${f.b2_ilhar === 'fell' ? `

She touches her coat, where the green cloth is folded. "And there is nobody left now who will ask where I went."` : f.b2_ilhar === 'parted' ? `

"My brother is with Dom. If I walk to Aren I walk away from him. If I stay, I will be facing him when he comes." She almost smiles. "I would rather face him. I always would."` : f.b2_ilhar === 'lost' ? `

"I do not know where my brother is. I would like to be standing somewhere he can find me."` : ''}`}${b2Hurt() === 'haddat' ? `

She puts a hand on her side, where the Vathar wound is bound. "And this would not keep the column's pace to Aren. You know it. I know it."` : ''}`,
      ch:b2PartCh('haddat', {stayNode:'b2_p_haddat_stay', goNode:'b2_p_haddat_go',
        letStay:'"Then stay, Haddat. I\'ll say the names."', askGo:'"Walk with us. I\'m asking you. Not ordering."', argGo:'"Who says the stretch\'s names at night, if you stay?"',
        letGo:'"Then walk with him. With us."', askStay:'"The Fist needs every shield he has tonight. I\'m asking you to stay."', argStay:'"You said it yourself, at Sanimon. Your word was to the Empire, and the Empire is staying here."',
        edgesGo:[['the names', 2], f.b2_ilhar === 'parted' && ['her brother may come looking for her in Aren', 1]],
        edgesStay:[['her own words', 2], f.b2_ilhar === 'came' && ['her brother is walking', -2]]})}; },
  b2_p_haddat_stay:()=>({sp:'Haddat', fx:()=>b2Settle('haddat', true), txt:
`${b2HowSaid('haddat') === 'asked' ? `She is quiet a long time. "Because you asked," she says. "I hoped you would ask the other thing." Then she nods, once, the way she nods at an order she means to keep.` : b2HowSaid('haddat') === 'talked' ? `She hears you out, and is quiet a long time, and then she nods. "You listened to me," she says. "That is the worst of it."` : `She nods, once. She does not thank you. Haddat never thanks anyone for the thing she was going to do anyway.`}

She unties the blue thread from her shield grip, the one from her mother's veil that has been there since Hissar, and it is knotted tight, and she does it with her teeth. She puts it in your hand.

"For the names," she says. Then she stands up, and stands in front of you, and says them. All of them. The stretch, from Hissar: ${numw(chainC())}, and the ones who are not in it any more, the potters' street and the weavers' street and the ford and the Nenoth and the forty hours, every one, in the quarter's Hissari, without stopping. It takes a long time. You listen to all of it.${S.f.b2_ilhar === 'came' ? `

Then she goes and sits with her brother at the stretch's fire, and they talk in the quarter's Hissari until moonrise, and you do not listen to any of it.` : ''}

"Now you have them," she says.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_p_haddat_go:()=>({sp:'Haddat', fx:()=>b2Settle('haddat', false), txt:
`${b2HowSaid('haddat') === 'asked' ? `She looks at you a long moment. "Because you asked," she says. "Not because you are right." She puts the shield on her back. "Somebody has to say the names in Aren. You would get them wrong."` : b2HowSaid('haddat') === 'talked' ? `She hears you out. Then she laughs, very quietly, which you have heard perhaps three times since Hissar. "The names," she says. "Yes. You would get them wrong, Sergeant. You always say the potter's boy's name like a Malazan."` : `"Good," she says. That is all. She puts the shield on her back and goes back to the stretch's fire${S.f.b2_ilhar === 'came' ? ', and sits down beside her brother, close, without saying anything to him at all' : ''}.`}

${b2In('marrow') && !b2Said('marrow') ? 'Behind her, Marrow is watching you, waiting her turn, with her hat in her hands.' : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Sathi ---- */
  b2_part_sathi:()=>{ const f = S.f, clan = f.b2_sathiClan;
    return {sp:'Sathi', txt:
`Sathi is at the end of the Weasel lines with Hackle and the bony grey from the Nenoth, saddled. She has been saddled since Bult came to the fire.

"The Fist says the young ones go," she says. "Nil. Nether. The remount children. Me." She says it the way you would read out a charge. "To herd the people to Aren, so the Wickans have someone left who will grow old. The Weasels stay with him. My clan stays." ${clan === 'yes' ? `She looks down the line at the captain, who is not looking at her. "The captain says if I stay I ride with the clan. He did not say it to me. He said it to the horse. Weasels."` : clan === 'no' ? `She laughs, short. "The captain says the clan does not take me. So I will stay on foot. With the Malazans. With Hackle. There are worse ways to go."` : `"I have not asked the captain. I will not ask. I will just be there in the morning, and he can send me away if he can catch me."`}

She pulls Hackle's ear. "I am staying, Sergeant. Hackle stays where I stay. He is the clever one. He has known since the hills." ${f.b2_sathiPromise ? `She looks at you, and her chin comes up. "You said you would speak for me. In the hills. You said."` : ''}`,
      ch:b2PartCh('sathi', {stayNode:'b2_p_sathi_stay', goNode:'b2_p_sathi_go',
        letStay:f.b2_sathiPromise ? '"I said I\'d speak for you. This is me speaking. Stay."' : '"Stay, then. Ride with them."',
        askGo:'"Go with Nil and Nether, Sathi. I\'m asking you."',
        argGo:'"Nil and Nether need a Weasel at their backs. The children need someone who rides the way you ride."',
        edgesGo:[['the warlocks need riders', 2], f.b2_sathiPromise && ['you gave her your word in the hills', -2], clan === 'no' && ['the clan will not take her', 2], f.b2_sathiShamed && !f.b2_sathiLaugh && !f.b2_sathiRode && ['the clan has not looked at her since the Shallows', 1]]})}; },
  b2_p_sathi_stay:()=>({sp:'Sathi', fx:()=>b2Settle('sathi', true), txt:
`${b2HowSaid('sathi') === 'talked' ? `She hears you out, and for a moment you think you have her. Then she shakes her head, slowly, and her teeth show. "You are right," she says. "Every word. And I am staying." She laughs.` : `Sathi laughs.`} It is the Wickan laugh, the funeral one, that nobody told the squad about, and it goes on, and Hackle's tail goes with it.

"Good," she says. "Good. Now we are all where we should be." She takes the bone whistle from round her neck, the one Hackle answers and nobody else can hear properly, and holds it out. "Hackle will not need it where we are going. You blow it. Sometimes. Somebody should."

She is on the grey before you have closed your hand on it, without the stirrup, the way she gets onto everything. ${S.f.b2_sathiClan === 'no' ? 'She rides down the Seventh\'s lines, not the Weasels\', looking for the foot she will stand with. The Weasel captain watches her go past. He does not say anything. After a while he turns his horse and follows her.' : 'She rides down the line to the Weasels, and the captain moves his horse over without looking at her, and there is room.'} Hackle runs at the horse's heels. He does not look back. Dogs don't.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_p_sathi_go:()=>({sp:'Sathi', fx:()=>b2Settle('sathi', false), txt:
`${b2HowSaid('sathi') === 'asked' ? `She stares at you. For a long moment you think she is going to hit you, or laugh, and she does neither. "Because you asked," she says. "I would not do it for the Fist."` : `She hears you out, all of it, with her face shut like the remount children's. "You are right," she says at last. "I hate it. I hate you. You are right."`}

She takes the Weasel teeth from her throat and holds them a while, and then puts them back on.

"Tell the clan I did not ride away," she says. "Tell them I was sent." Then she turns the grey toward the children's end of the lines, toward Nil and Nether, and rides there without looking back, very straight, and Hackle comes and licks your hand, once, before he goes after her.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Tangle ---- */
  b2_part_tangle:()=>{ const f = S.f, lean = b2Lean('tangle'), n = S.inv.sharper + S.inv.burner + S.inv.cusser + S.inv.smoker;
    return {sp:'Tangle', txt:
`Tangle is sitting on the squad's tailboard with the satchel in his lap, not counting it. That is how you know.

${lean === 'stay' ? `"Bungle's company is staying," he says. "Last ditch. Mincer's out there already, digging it, singing. He sent a man to ask if I'd be along." He turns the satchel over. "By name. Mincer's never asked for anybody by name.${f.b2_robe === 'mincer' ? ' Not since the ford. Not since what we did in the ford.' : ''}" He looks east. "Sappers dig the last ditch. That's what we're for, at the end. I always thought I'd mind."` : `"Somebody's got to count it into Aren," he says. "${b2Count()}." He pats the satchel. "There's a sum in here, and I'm the only one who knows it, and if I'm not there to finish it the sum's wrong. I hate a wrong sum." He looks east, where Bungle's company is forming. "They'll manage. Mincer's got a spade."`}${b2Hurt() === 'tangle' ? `

He moves his leg, where the Vathar wound is, and doesn't wince, and you see him not wince. "And this won't do Aren Way at a run. You know it won't."` : ''}`,
      ch:b2PartCh('tangle', {stayNode:'b2_p_tangle_stay', goNode:'b2_p_tangle_go',
        letStay:'"Go and dig it, then."', askGo:'"Walk with us, Tangle. I\'m asking."', argGo:'"The column will want a sapper at Aren\'s gate, and somebody to count that satchel into it."',
        letGo:'"Count it into Aren, then."', askStay:'"Bungle\'s short. I\'m asking you to stay with them."', argStay:'"Mincer asked for you by name. He never asks."',
        edgesGo:[n >= 3 && ['the satchel has to last to Aren', 2], b2Hurt() === 'tangle' && ['Aren has clean healers', 1]],
        edgesStay:[S.f.b2_bungle6 && ['Bungle said he would be welcome', 2], S.f.b2_bungle5 === 'gave' && ['he gave the company a sharper on the Nenoth', 1]]})}; },
  b2_p_tangle_stay:()=>{ const n = S.inv.sharper + S.inv.burner + S.inv.cusser + S.inv.smoker;
    return {sp:'Tangle', fx:()=>b2Settle('tangle', true), txt:
`${b2HowSaid('tangle') === 'asked' ? `He looks at you a while. "All right," he says. "You asked. I'd have gone with you if you'd asked the other way. You know that." He doesn't say it bitterly. Tangle doesn't say things bitterly. He just counts them.` : b2HowSaid('tangle') === 'talked' ? `He hears you out, and nods slowly. "That's a good argument," he says. "Mincer's is better. Mincer doesn't make arguments. He just asks."` : `He nods. He hums the four notes, and does not stop on any of them, and that is the first time you have heard all four.`}

${n ? `Then he holds up the satchel. "${b2Count()}," he says. "Now the hard sum. The last ditch'll want it. So will Aren's gate. Your call, Sergeant. It always was."` : `He holds up the satchel. It is empty. "Nothing to argue about," he says. "That's a relief."`}`,
      ch: n ? [{t:'"Take it. They\'ll need it more."', fx:()=>{ S.f.b2_satchel6 = 'went'; loy('tangle', 1); }, go:'b2_p_tangle_satchel'},
               {t:'"Leave it with the squad."', fx:()=>{ S.f.b2_satchel6 = 'left'; }, go:'b2_p_tangle_satchel'}] :
             [{t:'On.', fx:()=>{ S.f.b2_satchel6 = 'empty'; }, go:'b2_p_tangle_satchel'}]}; },
  b2_p_tangle_satchel:()=>({sp:'Tangle', txt:
`${S.f.b2_satchel6 === 'went' ? `He puts the strap over his shoulder. "Thought you'd say that," he says. "Hoped." He pats it. "Every one's one fewer, for good. That was always the rule. Turns out *for good* means something." ` : S.f.b2_satchel6 === 'left' ? `He puts it on the tailboard, and takes his hand off it, and puts it back, and takes it off. "Count it," he says. "Every halt. Out loud. So it knows somebody's still counting." Then: "We'll throw rocks. Bungle says we're good at rocks." ` : ''}

He takes the prayer bead out of his pocket, the Kanese one with no prayer he could ever remember, and gives it to you. "You remember one," he says. "For me. Any one. They're all the same prayer, Mincer says, only some of them have better tunes." He gets up, and unwinds the fuse-cord from one wrist, and ties it round yours, quickly, a sapper's knot, before you can stop him. Then he walks off east through the grass toward the sound of spades, humming.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_p_tangle_go:()=>({sp:'Tangle', fx:()=>b2Settle('tangle', false), txt:
`${b2HowSaid('tangle') === 'asked' ? `He looks at you a while. "All right," he says. "You asked." He looks east, at the spades. "Mincer'll understand. Mincer understands everything. It's his worst quality."` : b2HowSaid('tangle') === 'talked' ? `"A sapper at Aren's gate," he says. "Yes. Somebody'll want something blown, and it'll be the wrong thing, and I'll have to stop them." He puts the satchel strap over his shoulder.` : `"Right," he says, and gets up, and puts the satchel strap over his shoulder.`}

"${b2Count()}," he says. "Into Aren. Don't let me lose count." He hums the four notes, and stops on the third, and looks east once, where the spades are, and then doesn't again.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Marrow ---- */
  b2_part_marrow:()=>{ const f = S.f, lean = b2Lean('marrow');
    return {sp:'Marrow', txt:
`Marrow is sitting on an upturned basket by the stretch's fire, because Marrow sits down whenever she can, with her string in her hands, counting knots by feel.

${lean === 'stay' ? `"The Kherahn have healers," she says, without looking up. "Good ones. I watched them. They'll walk with the column all the way to Balahn, and past it." She ties nothing. "The Fist's lot will have needle and gut and whoever can't run. And no Denul, child, not a hand of it, not one." She looks up. "And I'm tired. ${f.b2_warrenFloor ? `There's something sitting at the bottom of my warren, and it moves when I touch it, and I've touched it every day since the Vathar. I'd rather meet it sitting down, among soldiers, than in a city with a gate.` : `Twelve years. I'd like to sit down somewhere and not have to get up again for anyone but soldiers.`}"` : `"The stretch's children have the flux," she says, without looking up. "Half of them. The Kherahn don't know them. I do. Every one, and what they can keep down, and which ones lie about it." She ties nothing. "The Fist's lot are soldiers. Soldiers die of things I can't help. Children die of things I can." She looks up at you. "That's the sum. Tangle would like it."`}${b2Hurt() === 'marrow' ? `

She puts her hand on the Vathar wound under her coat, absently, the way she would put a hand on somebody else's. "And I can't close this one. I've tried. It's a long way to Aren on a wound that won't close."` : ''}`,
      ch:b2PartCh('marrow', {stayNode:'b2_p_marrow_stay', goNode:'b2_p_marrow_go',
        letStay:'"Sit down with them, then."', askGo:'"Walk with us, Marrow. I\'m asking you."', argGo:'"The stretch\'s children need you. The Kherahn don\'t know them. You said so yourself, once."',
        letGo:'"Walk with them, then. With us."', askStay:'"The Fist\'s lot will have nobody. I\'m asking you to stay."', argStay:'"The rearguard has no healer at all. Soldiers die of things you can help too."',
        edgesGo:[['the stretch\'s children', 2], b2Hurt() === 'marrow' && ['Aren has clean healers', 1]],
        edgesStay:[['the rearguard has no healer', 2]]})}; },
  b2_p_marrow_stay:()=>({sp:'Marrow', fx:()=>b2Settle('marrow', true), txt:
`${b2HowSaid('marrow') === 'asked' ? `"Well," says Marrow. She looks at you for a long time. "You've learned something, child. You've learned to ask for the hard thing." She does not say whether she is pleased.` : b2HowSaid('marrow') === 'talked' ? `"No, child," she says, quite gently. "That's a good argument. I've made it myself. I'm still tired."` : `"Good," says Marrow. "Sit down. No, sit. I am not doing this standing up."`}

She takes the string, all of it, the knots from Hissar to the Geleen, ${numw(S.f.b2_knots || 0)} new since Hissar and the old ones from before, and puts it in your hand, and closes your hand over it with both of hers.

"Count them for me, child," she says. "When you get there. Out loud, the way Tangle does the satchel. So somebody knows they took." ${S.f.b2_sputters ? `She keeps her fingers closed over yours a moment. "The other ones, the ones the warren spoiled. Don't count those. I've done it."` : ''}

Then she picks up her kit, and her hat, and walks east through the grass toward the Seventh's fires, slowly, the way she walks at the end of a march, and sits down on the first thing she comes to.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_p_marrow_go:()=>({sp:'Marrow', fx:()=>b2Settle('marrow', false), txt:
`${b2HowSaid('marrow') === 'asked' ? `"Because you asked," says Marrow. "And because you're right, which is more annoying." She ties a knot in the string, for nothing, for being asked.` : b2HowSaid('marrow') === 'talked' ? `"Yes," says Marrow, after a long time. "Yes, I did say that." She ties a knot in the string, for being argued with by a sergeant and losing, which has never happened before.` : `"Good," says Marrow. "Then let me sit while I can."`}

She looks east, where the Seventh's fires are, and the Fist's lot, who will have nobody. She looks at them a long time. Then she looks at the stretch, and the children with the flux, and the Kherahn healer kneeling among them.

"Somebody tell them," she says, to nobody, "that I'm sorry." And then she gets up, and goes to the children.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Ramin ---- */
  b2_part_ramin:()=>{ const lean = b2Lean('redblade');
    return {sp:'Ramin', txt:
`Ramin is standing very straight at the edge of the stretch's firelight with his helm under his arm, as if he were waiting to be inspected.

"The company rides with the column," he says. "To Aren. The commander says the Red Blades are wanted in Aren, and the Fist agrees, and the company is glad to be wanted anywhere." He turns the helm in his hands. "I am lent. I am lent to the squad, and the squad walks to Aren with its people, and a lent sword goes where it was lent, and is given back clean." ${lean === 'stay' ? 'He looks east. "Unless."' : 'He waits. He has said what he thinks. A Red Blade does not say it twice.'}`,
      ch:b2PartCh('redblade', {stayNode:'b2_p_ramin_stay', goNode:'b2_p_ramin_go',
        letStay:'"Stay, then."', askGo:'"Walk with us, Ramin."', argGo:'"The company will want you back."',
        letGo:'"Walk with us, then. Your company will want you back."', askStay:'"The Fist\'s line needs a man who can hold a street on foot. I\'m asking you to stay."', argStay:'"The tribes call you lapdogs. Let them see a Red Blade on the Seventh\'s last field."',
        edgesGo:[['the company', 2]],
        edgesStay:[['a Red Blade on the Seventh\'s last field', 1]]})}; },
  b2_p_ramin_stay:()=>({sp:'Ramin', fx:()=>b2Settle('redblade', true), txt:
`${b2HowSaid('redblade') === 'asked' ? `He is quiet a moment. Then he puts the helm on. "Yes," he says. "I hoped somebody would ask a Red Blade for something hard. Nobody does. They ask us to hold doors."` : `He hears you out, and something in his face goes very still, and then very bright. "Yes," he says. "Let them see the red."`}

He takes the red sash from his kit, the one he kept folded for the day there was a horse to ride in it, and gives it to you, still folded.

"For the horse I never had," he says. "And tell my commander, in Aren. Tell him I was not given back." He thinks about it. "Tell him I was kept."

He walks east toward the Seventh's fires in his red scale with the short lance on his shoulder, very straight, and he is the only red in the whole dark line.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_p_ramin_go:()=>({sp:'Ramin', fx:()=>b2Settle('redblade', false), txt:
`${b2HowSaid('redblade') === 'asked' ? `He bows, the Ehrlitan way, from the waist. "As you ask, Sergeant." He puts the helm on.` : b2HowSaid('redblade') === 'talked' ? `"The company," he says, and his face does something complicated. "Yes. It will want me back. It has said so." He puts the helm on.` : `He nods, once, the way a Red Blade nods at an order he gave himself a long time ago, and puts the helm on.`}

"Then I am still lent," he says. "Good. I will be given back in Aren, and the company will see I was kept clean." He looks east, at the Seventh's fires, a long time. "In Ehrlitan they would say this is the right choice. In Ehrlitan they say a great many things."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
});

/* ---------------- moonrise: the split ---------------- */
const B2_GOODBYE6 = {
  haddat:()=>`Haddat goes last of them, with the blue gone from her shield grip. She does not look back, because Haddat never looks back; you can see her lips moving as she goes, saying names, the column's, and then, you think, the rearguard's.`,
  sathi:()=>`Sathi goes at a canter on the bony grey with Hackle running at the horse's heels, laughing, and at the top of the rise she turns in the saddle and lifts her bow, once, and is gone over it.`,
  tangle:()=>`Tangle walks east toward the sound of spades ${S.f.b2_satchel6 === 'went' ? 'with the satchel on his shoulder' : 'with nothing on his shoulder at all'}, humming the four notes, all four, and does not stop on any of them.`,
  marrow:()=>`Marrow rides east sitting on the tailboard of a Seventh cart, because Marrow sits down whenever she can, and lifts a hand without turning round.`,
  redblade:()=>`Ramin walks east in his red scale with the short lance on his shoulder, very straight, the only red in the dark line.`,
};
Object.assign(B2CH6.dlg, {
  b2_split:()=>({sp:'The Geleen Plain · moonrise', scene:'b2_geleen', fx:()=>b2DoSplit(), txt: // the split is made by Bult's choice, before this text is written; the fx is a safety net
`The moon comes up over the Geleen, and the Chain of Dogs comes apart.

It happens quietly. Nobody gives an order you can hear. The carts start to move west in the long grass, and the Kherahn go with them on their small horses, and the youngest of the Wickans, and the historian at the head of it on his bad horse with the bottle inside his shirt. And the Seventh does not move. It stands in its ranks on the grass, facing east, and lets the column walk out from behind it, and the gap between them gets longer.

${b2Rearguard().length ? b2Rearguard().map(id => B2_GOODBYE6[id]()).join('\n\n') : `Nobody from the squad goes east. They stand round you at the head of the stretch, all of them${b2Away() ? `, all but ${NAME(b2Away())}, who is in Aren, if the ship got there,` : ''} and watch the Seventh not move.`}${b2Rearguard().length && b2Away() ? `

And ${NAME(b2Away())} is in Aren, if the ship got there, and does not know any of this yet.` : ''}

${b2Here6().length ? `${b2Here6().length === 1 ? NAME(b2Here6()[0]) + ' walks' : b2Here6().map(id => NAME(id)).join(' and ') + ' walk'} beside you at the head of the stretch.` : 'You walk at the head of the stretch with nobody beside you. The stretch closes up round you anyway, the way water closes.'}`,
    html:chainHTML('The Geleen Plain · the split'),
    ch:[{t:'Walk.', go:'b2_split2'}]}),

  b2_split2:()=>({sp:'The Geleen Plain · night', scene:'b2_geleen', txt:
`You look back once. Everyone does, once.

The column is a long dark river in the grass going west under the moon, a league of it, carts and walkers and the Kherahn's small horses, and the children of the Wickans riding along its flanks like dogs round a herd. Behind it, getting smaller, the Seventh: five thousand, in a dark line across the plain, facing the other way. The Fist's standard. ${S.f.b2_listWar ? 'Somewhere under it, a corporal with a bad foot who has found his war.' : ''} The crows, because there are always crows over Coltaine, going round and round above the line in the moonlight, not settling.

${b2Rearguard().length ? `Somewhere in that line are ${b2Rearguard().length === 1 ? NAME(b2Rearguard()[0]) : b2Rearguard().slice(0, -1).map(id => NAME(id)).join(', ') + ' and ' + NAME(b2Rearguard().slice(-1)[0])}${b2Rearguard().includes('sathi') ? ', and a dog' : ''}. You cannot see them. You look anyway, until the grass takes the line, and then you look at the place where it was.` : 'Nobody you know is in that line. Everybody you know is in that line. Both are true, on the Chain.'}

${b2In('sathi') ? `Sathi does not look back. She rides at the column's flank with the Wickan children, very straight, with Hackle at her heels, and her face is wet, and she is not laughing.` : ''}`,
    ch:[{t:'Count them.', go:'b2_c6_end'}]}),

  b2_c6_end:()=>({sp:'The Geleen Plain · night', scene:'b2_geleen', txt:
`You count them, walking.

${chainC()} in the squad's stretch, going west in the grass with Kherahn bread in them. ${S.f.b2_retreatLost ? `${numw(S.f.b2_retreatLost, true)} fewer than at Sanimon.` : ''}${S.f.b2_ilhar === 'came' ? ` A water-seller from Hissar at the front, finding the way.` : ''} ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'} on the cart.` : 'No water on the cart, and the Kherahn know where the wells are.'}

And the squad: ${b2Here6().length ? b2Here6().map(id => NAME(id)).join(', ') : 'nobody, now, but you'}${b2Away() ? `, and ${NAME(b2Away())} waiting in Aren` : ''}. ${b2Rearguard().length ? `You count the ones in the dark line behind you too. You will count them every night until Aren, and after.` : 'All of them. You count them twice.'}

Ahead, three days, the guides say: Balahn, and the road to Aren. Behind, the Seventh, and the Fist, and Dom.`,
    html:chainHTML('The Geleen Plain · west'),
    ch:[{t:'Walk on.', go:()=>chapterEnd(6, S.f.b2_c6_key || 'whole')}]}),
});
