/* ============ Book Two, Chapter 5: The Dry March ============ */
/* Vathar Forest (old T'lan Imass and Jaghut battlefields, the mounds, a Jaghut tower Corporal List dreams about), then the Nenoth Odhan:
   the Dry March, Bhilard and Tregyn raiding without pause, Dom's army five times the Seventh, the last cattle dying; and at the end of it,
   out of nowhere, the Trygalle Trade Guild's carriage with food and water, and a smoky glass bottle for the Fist.
   Key (S.f.b2_c5_key), who gets the water when there is not enough: 'squad' (the squad drinks and fights well; the stretch pays in lives)
   or 'column' (the stretch drinks; the squad gives its skins away and goes into the Tregyn raid parched, S.f.b2_dry). The Trygalle rescues
   both, but only after the choice. New here: heat (47: a midday fight costs heavy armour a step after round 3 unless the wearer drank),
   and the Tower's Breath (below), Jaghut cold carried out of the tower: Elder, it never sputters. */

/* the squad's own people, for a line: the daughters, the widow, or the stretch */
const b2Ours5 = () => S.f.b2_key === 'daughters' ? B2.elder : S.f.b2_yedda ? B2.widow : null;
/* the one who went down the Vathar on the Silanda, if anyone did (never named as present: they are not) */
const b2Away = () => S.f.b2_c4_key === 'silanda' && b2Mate(S.f.b2_silandaWho) && !b2In(S.f.b2_silandaWho) ? S.f.b2_silandaWho : null;
/* the one who carries the Vathar wound, if they are here */
const b2Hurt = () => S.f.b2_c4_key === 'keep' && b2Mate(S.f.b2_woundWho) && b2In(S.f.b2_woundWho) ? S.f.b2_woundWho : null;
/* how many squadmates (not the sergeant) are on the map for a fight: a short squad gets help (the Silanda, Sathi with the Weasels) */
const b2Hands5 = away => S && S.squad ? S.squad.filter(k => k !== 'sgt' && !(away || []).includes(k)).length : 4;
/* Ressan's jar-boy, on the carts road */
const B2_BOY = 'Ibbin';

/* the key (b2_ration): who drinks. 'squad': the stretch loses about a fifth, the squad drinks before the Tregyn (Ramin will not);
   'column': the squad's skins go to the stretch, which loses one or so, and the squad fights dry (S.f.b2_dry, 47) until the Trygalle */
function b2KeySquad(){ if (S.f.b2_c5_key) return; S.f.b2_c5_key = 'squad';
  const c = chainC(), loss = c ? Math.max(2, Math.round(c * .18)) : 0; S.f.b2_marchLost = loss; chain(0, -loss, 'The squad drinks; the stretch goes without');
  b2Drink('b2_dryraid', true); if (b2In('redblade')) { S.f.b2_drankSkip = 'redblade'; loy('redblade', 1); }
  if (b2In('tangle')) loy('tangle', 1); if (b2In('sathi')) loy('sathi', 1); if (b2In('haddat')) loy('haddat', -1); if (b2In('marrow')) loy('marrow', -1); }
function b2KeyColumn(){ if (S.f.b2_c5_key) return; S.f.b2_c5_key = 'column';
  const c = chainC(), loss = c ? Math.max(1, Math.round(c * .05)) : 0; S.f.b2_marchLost = loss; chain(-chainW(), -loss, 'The skins go to the stretch'); S.f.b2_dry = 1;
  if (b2In('haddat')) loy('haddat', 1); if (b2In('marrow')) loy('marrow', 1); if (b2In('redblade')) loy('redblade', 1); if (b2In('tangle')) loy('tangle', -1); if (b2In('sathi')) loy('sathi', -1); }

/* The Tower's Breath: Jaghut cold carried out of the tower in the Vathar Forest. Elder (Omtose Phellack): it never sputters. */
Object.assign(TRICKS, {
  b2_breath:{name:'The Tower\'s Breath', ch:5, use:'fight', ab:'t_b2_breath', sorcery:true, elder:true, where:'the cold brazier in the Jaghut tower, Vathar Forest',
    lore:'There is a brazier in the tower that burns with cold instead of fire, and has for longer than anyone has had a word for it. Held over it, a hand comes away white to the wrist and does not warm again for an hour. Some of the cold stays in the chest after, like a breath held under water, and it can be let out.',
    get fx(){ return `Once a fight: let the breath out on a 3×3 within 4. Enemies in it are rimed: slowed, and 1d6+${1 + lvT()} cold. Squadmates in it shed the heat for the rest of the fight. Grows with level. Elder: it never sputters.`; }},
});
Object.assign(AB, {
  t_b2_breath:{name:TRICKS.b2_breath.name, trick:'b2_breath', sorcery:true, elder:true, aoe:1, range:4, desc:()=>TRICKS.b2_breath.fx,
    run(u, x, y){ AUDIO.play('slam'); sparks(x, y, 26, '#bfe8ff', .6); sparks(x, y, 10, '#ffffff', 1);
      const caught = B.units.filter(v => v.hp > 0 && cheb(v, {x, y}) <= 1), them = caught.filter(v => v.side === 'e'), us = caught.filter(v => v.side === 'p' && !v.ally);
      blog(`${u.name} breathes out, long and slow, and the breath is white. ${them.length ? 'Frost goes over the ground in a ring, and over everything standing on it.' : 'Frost goes over the ground in a ring, on nothing much.'}`);
      them.forEach(f => { f.slowTurn = true; float(f, 'rimed', '#bfe8ff'); hurt(f, roll(1, 6, 1 + lvT())); });
      us.forEach(p => { if (!p.cooled) { p.cooled = true; float(p, 'cool', '#bfe8ff'); } });
      if (us.length) blog(`<em>${us.map(p => p.name).join(' and ')} ${us.length > 1 ? 'shed' : 'sheds'} the heat. The cold sits in the chest like a held breath.</em>`);
      updBattleUI(); afterAct(); }},
});

/* the words this chapter adds to Book Two's glossary */
GLOSSX.dg.push(
  [5, 'Corporal List', 'A young corporal of the Fifth Company, out of the Hissar garrison, who escorts the historian. A javelin took him through the foot at Gelor Ridge. Since then he dreams of a Jaghut.', ()=>!!(S.f && S.f.b2_list5)],
  [5, 'Jaghut', 'An elder race, long gone, who worked ice the way the Moranth work clay. The T\'lan Imass hunted them for longer than there have been cities. Vathar Forest is one of the places they did it.', ()=>!!(S.f && S.f.b2_forest)],
  [5, 'The Nenoth Odhan', 'The Dry March: the waterless plain between the Vathar Forest and the hills, where the Seventh\'s last cattle died.', ()=>!!(S.f && S.f.b2_nenoth)],
  [5, 'The Trygalle Trade Guild', 'Traders out of Genabackis who drive a carriage through the warrens to wherever they are paid to go. Their guards are shareholders. Most of them do not live to collect.', ()=>!!(S.f && S.f.b2_trygalle)]);

const B2CH5 = {
  title:'The Dry March', number:'Five',
  intro:{loc:'Vathar Forest', sub:'South of the Vathar · the old wood', scene:'b2_forest', cap:'An old dark forest, mounds among the trees, and far off, above the canopy, the top of a tower.',
    paras:[
`The forest south of the Vathar is the first shade the column has walked in since Hissar, and nobody likes it.`,
`It is old. The trees are old, and the ground under them is older, heaped into long mounds the leaf-litter cannot quite hide, and there are no birds in it. None. The cattle walk with their heads up. The dogs will not go off the track.`,
`Somewhere behind, on the far bank of the river, Korbolo Dom is counting his army. Somewhere ahead, past the trees, is the Nenoth Odhan, which the guides call the Dry March and will not say more about. In between there is this, and the column walking through it in silence, as if it were a temple.`],
    go:'Into the trees', node:'b2_c5_start'},

  areas:[
    /* 16 x 12.  . leaf-litter  , undergrowth  # trunk (blocks)  T big tree (blocks)  m mound/tomb (blocks)  b old bones  r stone */
    { id:'b2_vforest', title:'Vathar Forest', sub:'Day · under the old trees', hint:'Tap ground to move · tap a figure to talk · the standing stone in the north-east · the great tree to the south, when the squad is ready', decor:'forest',
      map:[ "################",
            "#..,.#..m..,..r#",
            "#.,..,..,...,..#",
            "#..m....#...,..#",
            "#.,...,...b....#",
            "#...#.....,..m.#",
            "#.,....,.......#",
            "#..,..m...,.#..#",
            "#.b.......,....#",
            "#..,..#....,.,.#",
            "#.,.....,..T...#",
            "################" ],
      walk:'.,b', triggers:{m:'b2_mound', b:'b2_oldbones', r:'b2_tstone', T:'b2_forest_edge'}, start:{x:7, y:9},
      quest:()=> !S.f.b2_list5 ? 'The historian and his escort, up among the trees.' : !S.f.b2_moundsDone ? (S.f.b2_weasel5 ? 'The mounds, where the stragglers went.' : 'A Weasel rider is looking for squads.') : 'The great tree to the south, and the Nenoth beyond it. Or the standing stone, and the tower.',
      npcs:[
        {id:'list5', name:'Corporal List', kind:'list', x:10, y:2, node:()=>S.f.b2_list5 ? 'b2_list5_again' : 'b2_list5', fresh:()=>!S.f.b2_list5},
        {id:'duiker7', name:'Duiker', kind:'duiker', x:11, y:3, node:()=>'b2_duiker7', fresh:()=>!S.f.b2_duiker7},
        {id:'weasel5', name:'A Weasel rider', kind:'weasel', x:2, y:6, node:()=>S.f.b2_weasel5 ? 'b2_weasel5_again' : 'b2_weasel5', show:()=>!!S.f.b2_list5, fresh:()=>!!S.f.b2_list5 && !S.f.b2_weasel5},
        {id:'bungle5', name:'Captain Bungle', kind:'sapper', x:2, y:4, node:()=>'b2_bungle5', fresh:()=>!S.f.b2_bungle5},
        {id:'ours7', name:'The squad\'s people', kind:'hissari_w', x:5, y:9, node:()=>'b2_ours7', fresh:()=>!S.f.b2_ours7},
        {id:'ramin7', name:'Ramin', kind:'redblade', x:13, y:8, node:()=>'b2_ramin7', show:()=>b2In('redblade'), fresh:()=>b2In('redblade') && !S.f.b2_ramin7} ] },

    /* 16 x 12.  the Jaghut tower inside: . frost-rimed stone  # wall (blocks)  i ice (blocks)  - slick ice  s stair  c cold brazier */
    { id:'b2_jtower', title:'The tower', sub:'Inside · colder than it should be', hint:'Tap ground to move · tap a figure to talk · the braziers, the ice, the stair up and the way out', decor:'jaghut', dark:true,
      map:[ "################",
            "#######ss#######",
            "####i..--..i####",
            "###...-..-...###",
            "##i..........i##",
            "##..-......-..##",
            "#.....c..c.....#",
            "##..-......-..##",
            "##i..........i##",
            "###...-..-...###",
            "####i......i####",
            "################" ],
      walk:'.-', triggers:{c:'b2_brazier', i:'b2_ice', s:'b2_tstair'}, start:{x:7, y:10},
      quest:()=> !S.f.b2_towerIce ? 'Nothing moves. Look round.' : !S.f.b2_shade ? 'The stair goes up.' : 'Out, into the warm, while you still want to.',
      npcs:[
        {id:'shade', name:'Something tall', kind:'jaghut_shade', x:8, y:2, node:()=>'b2_shade', show:()=>!!S.f.b2_towerIce, fresh:()=>!!S.f.b2_towerIce && !S.f.b2_shade},
        {id:'marrow5', name:'Marrow', kind:'marrow', x:5, y:7, node:()=>'b2_tower_marrow', show:()=>b2In('marrow'), fresh:()=>b2In('marrow') && !S.f.b2_towerWarren} ] },

    /* 16 x 12.  the Nenoth by day: . hardpan  , scrub  s sand  # rock (blocks)  r low rock  x dead tree  b bones  W wagon  h horse lines */
    { id:'b2_nenoth', title:'The Nenoth Odhan', sub:'Midday · the Dry March', hint:'Tap ground to move · tap a figure to talk · the squad\'s cart, the bones, the dead tree that looks back', decor:'odhan',
      map:[ "################",
            "#ss..,..b...,.s#",
            "#.,..r....,..x.#",
            "#..b....,....,.#",
            "#.,...s....r...#",
            "#....,..W....,.#",
            "#.r.......,..b.#",
            "#..,..s......,.#",
            "#.,.....,..r...#",
            "#..h.,....,..,.#",
            "#.....s.,....s.#",
            "################" ],
      walk:'.,s', triggers:{W:'b2_ncart', b:'b2_carcass', x:'b2_lookback', h:'b2_nhorses'}, start:{x:8, y:7},
      quest:()=> !S.f.b2_herdDone ? (S.f.b2_weaselAsk ? 'The cattle, and the Bhilard on the skyline.' : 'The Weasel captain, by the horse lines.') : !S.f.b2_c5_key ? 'Bult has the water ration.' : !S.f.b2_dryDone ? 'Midday. The Tregyn are coming for the carts.' : 'Dusk. Back to the camp.',
      npcs:[
        {id:'weaselcap5', name:'The Weasel captain', kind:'weasel', x:4, y:9, node:()=>'b2_weaselcap5', fresh:()=>!S.f.b2_weaselAsk},
        {id:'cattle1', name:'The last cattle', kind:'cattle', x:11, y:9, node:()=>'b2_cattle', show:()=>!S.f.b2_cattleDead, fresh:()=>!S.f.b2_herdDone && !!S.f.b2_weaselAsk},
        {id:'cattle2', name:'A cow', kind:'cattle', x:13, y:8, node:()=>'b2_cattle', show:()=>!S.f.b2_cattleDead},
        {id:'bult7', name:'Bult', kind:'bult', x:9, y:4, node:()=>'b2_ration', show:()=>!!S.f.b2_herdDone, fresh:()=>!!S.f.b2_herdDone && !S.f.b2_c5_key},
        {id:'bylan', name:'Strangers', kind:'hissari_m', x:2, y:3, node:()=>'b2_bylan', show:()=>!!S.f.b2_nenoth, fresh:()=>!S.f.b2_bylan},
        {id:'list6', name:'Corporal List', kind:'list', x:12, y:3, node:()=>'b2_list6', fresh:()=>!S.f.b2_list6},
        {id:'ours8', name:'The squad\'s people', kind:'child', x:6, y:6, node:()=>'b2_ours8', fresh:()=>!S.f.b2_ours8} ] },

    /* 16 x 12.  the camp at night on the Nenoth: . hardpan  , scrub  = tent  F fire  W wagon  h horse lines */
    { id:'b2_karpcamp', title:'The Nenoth · the camp', sub:'Night · a carriage where there was none', hint:'Tap ground to move · tap a figure to talk · the squad\'s cart, when there is nothing more to do', decor:'odhan_night', dark:true,
      map:[ "################",
            "#.,..=...=..,..#",
            "#..F.........,.#",
            "#.,....,..=....#",
            "#..=.........F.#",
            "#.....,..,.....#",
            "#.,..W.........#",
            "#...........h..#",
            "#..,...F...,...#",
            "#.=.......,..=.#",
            "#....,...W.....#",
            "################" ],
      walk:'.,', triggers:{W:'b2_kcart', F:'b2_kfire'}, start:{x:7, y:10},
      quest:()=> !S.f.b2_karpolan ? 'The carriage, and the man who came in it.' : !S.f.b2_campWater ? 'The squad\'s cart. The water is being handed out.' : 'Bult, when the squad has drunk.',
      npcs:[
        {id:'karpolan', name:'Karpolan Demesand', kind:'karpolan', x:8, y:3, node:()=>S.f.b2_karpolan ? 'b2_karpolan_again' : 'b2_karpolan', fresh:()=>!S.f.b2_karpolan},
        {id:'tguard', name:'A Trygalle shareholder', kind:'trygalle_guard', x:11, y:2, node:()=>'b2_shareholder', fresh:()=>!S.f.b2_shareholder},
        {id:'tguard2', name:'A Trygalle shareholder', kind:'trygalle_guard', x:6, y:2, node:()=>'b2_shareholder2', fresh:()=>!S.f.b2_shareholder2},
        {id:'duiker8', name:'Duiker', kind:'duiker', x:10, y:5, node:()=>'b2_duiker8', fresh:()=>!S.f.b2_duiker8},
        {id:'list7', name:'Corporal List', kind:'list', x:11, y:5, node:()=>'b2_list7', fresh:()=>!S.f.b2_list7},
        {id:'jarboy', name:B2_BOY, kind:'child', x:4, y:8, node:()=>'b2_jarboy', show:()=>S.f.b2_key === 'carts', fresh:()=>S.f.b2_key === 'carts' && !S.f.b2_jarboy},
        {id:'ours9', name:'The squad\'s people', kind:'hissari_w', x:6, y:7, node:()=>'b2_ours9', show:()=>S.f.b2_key !== 'carts', fresh:()=>S.f.b2_key !== 'carts' && !S.f.b2_ours9},
        {id:'bult8', name:'Bult', kind:'bult', x:12, y:8, node:()=>'b2_bult8', show:()=>!!S.f.b2_campWater, fresh:()=>!!S.f.b2_campWater} ] } ],

  battles:{
    /* the forest: Bhilard in among the mounds, picking off the column's stragglers. Shade: no heat */
    b2_mounds:{title:'The mounds', style:'forest', warrenText:'Vathar Forest · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["..#..,..",".t...t.#","...#....","#..t..t.","........",".,..#...","..t...t.","........","........","...,...."],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      /* a short squad has the Weasel rider who brought it here */
      get allies(){ return b2Hands5() <= 3 ? [['b2_weasel5',6,8]] : []; },
      foes:[['b2_bhil',2,1],['b2_bhil',5,2],['b2_bhilbow',1,0],['b2_bhilbow',6,0],['b2_bhilchief',4,0]], xp:100, after:'b2_after_mounds',
      waves:[{round:3, foes:[['b2_bhil',0,4]], text:'Another raider comes up out of the leaf-litter between two mounds, where there was nobody, with a straggler\'s bundle still on his shoulder.'}] },

    /* the Nenoth at midday: Bhilard riders cut into the last of the herd. Then hold the gap in the rocks while the Weasels turn the cattle */
    b2_herd:{title:'The herd', style:'odhan', heat:true, warrenText:'Midday on the Nenoth · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      get away(){ return S && S.f && S.f.b2_sathiRode ? ['sathi'] : null; },
      /* one Weasel on foot in the herd; more for a squad that came short (Sathi on the herd with the clan counts as short) */
      get allies(){ const n = b2Hands5(this.away); return [['b2_weasel5',6,7],['b2_weasel5',1,7],['b2_weasel5',7,8]].slice(0, n <= 2 ? 3 : n <= 3 ? 2 : 1); },
      map:["........","..t.....","......t.","........","...,....",".t......","........","....t...","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_bhil',1,1],['b2_bhil',6,1],['b2_bhil',3,2],['b2_bhilbow',2,0],['b2_bhilbow',5,0]], xp:120, after:'b2_after_herd',
      waves:[{round:3, foes:[['b2_bhil',7,3]], text:'A rider comes off the skyline at a dead run, leaves the horse at a gallop, and is on his feet among the cattle with a spear before the horse has stopped.'}],
      stage2:{title:'The gap', xp:50, keepAllies:true,
        text:()=>`The raiders in the herd are down. The herd is not safe: it is running, what is left of it, bawling, east, toward a gap in a long spine of rock, and on the far side of the gap the Bhilard chief has the rest of his riders, waiting for it.
${b2In('haddat') ? `
Haddat sees it. "The gap," she says. "If they hold the gap, the cattle are theirs." She is already going. "So we hold it first."` : `
Somebody has to be in the gap before the cattle are.`}${S.f.b2_sathiRode ? `

Out on the pan, small with distance, a rider with a dog running at her horse's heels is turning the front of the herd, laughing.` : ''}`,
        map:["##....##","#......#","..t..t..","........","#......#","##....##","........","...,....","........","........"],
        party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
        foes:[['b2_bhilchief',3,0],['b2_bhil',2,1],['b2_bhil',5,1],['b2_bhilbow',4,0]],
        objective:{type:'survive', rounds:3, text:'Hold the gap for three rounds while the Weasels turn the herd.'},
        waves:[{round:2, foes:[['b2_bhil',2,0]], text:'Another comes down off the rock on the north side of the gap, sliding, spear first.'},
               {round:3, foes:[['b2_bhilbow',5,0]], text:'A bowman on the spine of the rock, against the white sky, drawing.'}]} },

    /* the next midday: the Tregyn come for the carts of the squad's stretch. Then their water-carrier and his guard */
    b2_dryraid:{title:'The carts', style:'odhan', heat:true, warrenText:'Midday on the Nenoth · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["........","...,....",".t....t.","........","..t..t..","........","........",".t....t.","........","........"],
      party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
      /* a short squad: Bult sends three of the Seventh's regulars down the line, and they stay for the water-carrier too */
      get allies(){ return b2Hands5() <= 3 ? [['b2_reg5',1,8],['b2_reg5',6,8],['b2_reg5',7,7]] : []; },
      foes:[['b2_treg',2,1],['b2_treg',5,1],['b2_treg',3,2],['b2_tregbow',1,0],['b2_tregbow',6,0]], xp:150, after:'b2_after_dryraid',
      waves:[{round:2, foes:[['b2_treg',0,3]], text:'Tregyn on foot out of a fold in the pan nobody could see, running low, with knives in their teeth and skins on their backs.'}],
      stage2:{title:'The water-carrier', xp:80, keepAllies:true,
        text:()=>`The Tregyn at the carts are down, or running. Out on the pan a knot of them is not running: a big man in a horsehair mantle with a string of water-skins across his saddle, and his guard round him, on foot now, coming on. He has come to take the stretch's water. He has brought skins to put it in.
${S.f.b2_dry ? `
Nobody in the squad has had a drink since yesterday. You can hear it in how they breathe.` : `
The squad drank this morning. You can see it in how they stand.`}${b2In('haddat') ? `

Haddat is looking at the skins on his saddle. She has gone very still.` : ''}`,
        map:["........","........","..t..t..","........","...,....","........",".t....t.","........","........","........"],
        party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
        foes:[['b2_treglord',3,1],['b2_treg',2,1],['b2_treg',5,1],['b2_tregbow',4,0]],
        /* the last one off the flank only comes at a squad that came to the carts whole */
        get waves(){ return b2Hands5() > 3 ? [{round:3, foes:[['b2_treg',7,1]], text:'A last Tregyn comes in from the flank with his mantle over his head against the sun.'}] : []; }} } },

  foes:{
    /* the Bhilard: a raiding tribe of the Odhan, light and quick, here for whatever the column drops */
    b2_bhil:{name:'Bhilard raider', sig:'b', kind:'bhilard', hp:16, ac:13, atk:4, dmg:[1,8,2], rng:1, mv:5, init:3, sk:['bleed'], verb:'drives a spear at'},
    b2_bhilbow:{name:'Bhilard bowman', sig:'a', kind:'bhilard', hp:12, ac:12, atk:4, dmg:[1,8,1], rng:6, mv:5, init:3, sk:['pin'], verb:'looses at'},
    b2_bhilchief:{name:'Bhilard chief', sig:'C', kind:'bhilard', hp:30, ac:15, atk:5, dmg:[1,10,2], rng:1, mv:5, init:3, boss:true, sk:['rally','bleed'], verb:'cuts at'},
    /* the Tregyn: heavier, slower, in horsehair mantles, and they come for the water */
    b2_treg:{name:'Tregyn raider', sig:'t', kind:'tregyn', hp:18, ac:14, atk:4, dmg:[1,10,2], rng:1, mv:4, init:2, sk:['shove'], verb:'swings at'},
    b2_tregbow:{name:'Tregyn bowman', sig:'a', kind:'tregyn', hp:13, ac:12, atk:4, dmg:[1,8,1], rng:6, mv:4, init:2, sk:['pin'], verb:'looses at'},
    b2_treglord:{name:'The water-carrier', sig:'W', kind:'tregyn', hp:34, ac:16, atk:5, dmg:[1,10,3], rng:1, mv:4, init:2, boss:true, sk:['rally','parry'], verb:'brings a heavy blade down on'},
    /* ally: a Weasel Clan rider, dismounted, with the clan's teeth */
    b2_weasel5:{name:'Weasel rider', sig:'w', kind:'weasel', hp:18, ac:13, atk:5, dmg:[1,8,2], rng:1, mv:6, init:3, verb:'cuts at'},
    /* ally: a regular of the Seventh, lent down the line to a short squad */
    b2_reg5:{name:'Seventh regular', sig:'r', kind:'b2soldier', hp:20, ac:14, atk:4, dmg:[1,8,2], rng:1, mv:4, init:1, verb:'cuts at'} },

  gear:{
    b2_sealskin:{name:'A skin with the water-sellers\' seal', slot:'trinket', who:['haddat'], stat:{wits:1}, line:'A water-skin taken off a dead Tregyn on the Nenoth, full, with a mark pressed into the leather at the neck: a house mark from the water-sellers\' quarter of Hissar. Haddat\'s mother\'s house. Haddat carries it, and does not drink from it.'} },

  scenes:{
    b2_forest:{loc:'Vathar Forest', sub:'The old wood', cap:'An old dark forest, long mounds under the leaf-litter, and far off over the trees the top of a tower.', amb:'dark'},
    b2_tower:{loc:'Vathar Forest', sub:'The tower', cap:'Inside a tower of fitted stone, every surface white with frost, two braziers burning with no flame, and a stair going up into the cold.', amb:'tunnel'},
    b2_dry_march:{loc:'The Nenoth Odhan', sub:'The Dry March', cap:'The column on a cracked white pan under a white sun, and dark shapes on the ground behind it that were cattle.', amb:'wind'},
    b2_trygalle:{loc:'The Nenoth Odhan', sub:'Out of nowhere', cap:'A carriage coming out of thin air in a shimmer, scorched black, nine horses lathered white, and battered guards on its roof holding on.', amb:'plain'} },

  end:{
    squad:['The squad drank', 'On the Dry March the water ran short, as everyone had known it would, and the sergeant kept the squad\'s skins for the squad. It fought the Tregyn with water in it, and won, and the stretch paid for it in the only coin the Nenoth takes. Two nights later the Trygalle came out of nowhere with water for everyone. Nobody in the stretch has said anything about the skins. Nobody has had to.'],
    column:['The column drank', 'On the Dry March the water ran short, as everyone had known it would, and the sergeant gave the squad\'s skins to the stretch. The squad went into the Tregyn with dust in its mouth, and won anyway, barely. Two nights later the Trygalle came out of nowhere with water for everyone. The stretch has started to bring the squad the first cup of anything. Nobody told them to.'] },
  endScene:'b2_trygalle',
  endCap:()=> S.f.b2_c5_key === 'column' ? `Night on the Nenoth. The squad has drunk at last, and the stretch watched it drink, and some of them were smiling.` : `Night on the Nenoth. Everybody has drunk now. The stretch is shorter than it was when the water ran out, and everybody can count.`,
  tease:'Next: Sanimon. Dom\'s army five times the Seventh, the tribes gathering on every side, and the Khundryl, whom nobody has met yet.',

  extras:()=>{ const f = S.f, x = [];
    x.push(`The squad came off the Dry March with ${b2Chain()}.`);
    if (f.b2_c5_key === 'squad') x.push(`When the water ran short the squad kept its skins. The stretch lost ${numw(f.b2_marchLost || 0)} on the Nenoth.`);
    if (f.b2_c5_key === 'column') x.push(`When the water ran short the squad gave its skins to the stretch, and fought the Tregyn parched.`);
    if (f.b2_drankSkip === 'redblade') x.push('Ramin would not drink before the stretch had. He fought the Tregyn in his scale with nothing in him, and said it was an order he had given himself.');
    if (f.b2_towerIn) x.push(`The squad went into the Jaghut tower in Vathar Forest${f.b2_shade ? ', and saw something tall at the top of the stair that did not look at it' : ''}.`);
    if (trickBy('b2_breath')) x.push(`${NAME(trickBy('b2_breath'))} carries a little of the tower's cold, and can let it out.`);
    if (f.b2_towerWarren) x.push('In the tower Marrow reached into her warren and found it clean, for the first time since Hissar. Nothing at the bottom of it.');
    if (f.b2_sathiRode) x.push('Sathi rode with the Weasel Clan on the Nenoth and turned the last herd, and the clan let her.');
    if (f.b2_ilharWater) x.push(`Haddat found her mother's house mark on a Tregyn's water-skin. ${f.b2_ilharSkin === 'kept' ? 'She carries it, full.' : 'The stretch drank it.'}`);
    if (f.b2_bylan === 'took') x.push('A family from Bylan joined the squad\'s stretch on the Nenoth.');
    if (f.b2_jarboy) x.push(`${B2_BOY}, Ressan's jar-boy, walks in the squad's stretch now. He saw ${B2.elder} and ${B2.younger} ride out of Hissar on Wickan saddles.`);
    if (f.b2_jar === 'poured') x.push(`${B2.elder} poured her father's water into the squad's skin on the Nenoth.`);
    if (f.b2_bottle) x.push('The squad saw the Trygalle trader hang a smoky glass bottle on a chain round the Fist\'s neck.');
    return x; },

  journal:()=>{ const f = S.f; return [
    f.b2_forest && `South of the Vathar the column went through an old forest of mounds and bones, where the T'lan Imass and the Jaghut fought before there were cities. There is a Jaghut tower in it. Corporal List dreams about it.`,
    f.b2_nenoth && `After the forest, the Nenoth Odhan: the Dry March. The Bhilard and the Tregyn raid every day. Korbolo Dom's army follows, five times the size of the Seventh, and growing.`,
    f.b2_cattleDead && `The last of the Seventh's cattle died on the Nenoth.`,
    f.b2_c5_key && `When the water ran short on the Nenoth, the sergeant had to choose who drank: the squad, or its stretch of the column.`,
    f.b2_trygalle && `A carriage of the Trygalle Trade Guild came out of the air into the camp on the Nenoth with food and water: a gift from Darujhistan, the trader said. His name is Karpolan Demesand.`,
    f.b2_bottle && `Karpolan Demesand gave the Fist a smoky glass bottle on a chain, and told him to wear it.`].filter(Boolean); },

  dlg:{}
};

/* ---------------- Vathar Forest: the mounds, List, the stragglers ---------------- */
Object.assign(B2CH5.dlg, {
  b2_c5_start:()=>({sp:'Vathar Forest · the first day', scene:'b2_forest', fx:()=>{ if (!S.f.b2_c5Start) { S.f.b2_c5Start = 1; chain(-1, -2, 'The first days after the Vathar'); } }, txt:
`The wounded from the ford die in the first two days under the trees, the ones who were going to. Two of them were yours. ${b2In('haddat') ? 'Haddat has their names.' : 'You have their names.'} You bury them in the leaf-litter beside the track, shallow, because the ground under the litter is like iron and the column does not stop.

${b2Away() ? `You count the squad at the first halt, out of habit, and get to the end and count ${NAME(b2Away())} anyway, who is on a burned ship somewhere down the Vathar, or in Aren, or neither. You will stop doing that. Not yet.` : b2Hurt() ? `${NAME(b2Hurt())} walks with the wound from the ropes bound under the kit, and does not mention it, and you watch ${b2Him(b2Hurt())} not mention it every time the track goes uphill.` : 'You count the squad at the first halt. All there. You count them again anyway.'}

${b2In('tangle') ? `"${b2Count()}," Tangle says, to the satchel. "Nobody's touched it. Nobody look at it."` : ''}${b2In('marrow') ? ` Marrow has ${b2Knots()}.` : ''}`,
    html:chainHTML('Vathar Forest · south of the river'),
    ch:[b2DeckChoice(5), {t:'On, under the trees.', go:'b2_forest_arrive'}]}),
  /* the reading at the first halt under the trees (47c) */
  b2_c5_deck:()=>b2DeckOffer(5, 'b2_c5_card'),
  b2_c5_card:()=>b2DeckCard(5),

  b2_forest_arrive:()=>({sp:'Vathar Forest', scene:'b2_forest', fx:()=>{ S.f.b2_forest = 1; }, txt:
`The column halts at midday in a long clearing, because the Fist has said halt, and spreads out among the trees to rest, and nobody rests.

It is the mounds. They are everywhere once you have seen the first: long and low under the leaf-litter, longer than a man, longer than a cart, lying side by side between the trees in rows that go on into the dark of the wood further than anyone wants to walk. Some have a stone at the head. Some have had the stone pulled down a long time ago and left.

${b2In('sathi') ? `Hackle will not go off the track. Sathi does not make him. "The spirits here are not ours," she says, low. "They are not anyone's. They are only angry." She has her bow strung, which she never does under trees.` : 'The dogs will not go off the track, any of them.'}

There are no birds. Not one, all morning. The whole forest is listening to something, and it is not you.`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  /* ---- Corporal List, the historian's escort ---- */
  b2_list5:()=>({sp:'Corporal List', fx:()=>{ S.f.b2_list5 = 1; }, txt:
`The historian's escort is sitting on a fallen trunk with one boot off, binding his foot, and you know him. You knew him before you knew you did: the face from the Hissar garrison's yard, years ago, a recruit of the Fifth Company with ears that stood out, who died in every mock fight the garrison ever staged, first, and got up laughing.

"Sergeant." He gets up, on one foot, which is regulation and absurd. "List. Corporal now. Fifth Company." He sees you remember. He grins, and it is the same grin, nearly. "I don't die first any more. A javelin tried at Gelor." He looks down at the foot. "Through the boot. Through the foot. Through the other side of the boot. It's better. It isn't."

He is young and earnest and very tired, and there is something behind his eyes that was not there in the Hissar yard. He keeps looking north-east, through the trees, at nothing you can see.`,
    ch:[{t:'"What are you looking at, Corporal?"', go:'b2_list5b'},
        {t:'"Mind the foot." Leave him.', go:()=>startExplore()}]}),
  b2_list5b:()=>({sp:'Corporal List', fx:()=>{ S.f.b2_listTower = 1; }, txt:
`He doesn't answer straight away. He finishes the binding and puts the boot on over it, slowly.

"There's a tower," he says. "That way. Past a standing stone. I've seen it every night since Gelor, since the foot went bad and I nearly went through Hood's gate and didn't. Before we ever came to this forest. Every night." He looks at you to see if you are going to laugh. You aren't. "There's somebody in it. A Jaghut. Tall, and grey, and he has tusks, and he talks to me. I know how that sounds."

"He says this whole country is dead because of what was done here. Not the forest: all of it, south of the river, all the way out. He says the Imass broke his people's bones and put the living under stones, and it was so long ago that nobody has a number for it." He swallows. "He says don't go in the tower. Then he says it doesn't matter, there's nothing in it now. He says both, every time."

${b2In('marrow') ? `Marrow, who has been listening with her eyes shut: "Child, have you told the Fist's healers about these dreams?" "Yes," says List. "They said it was the fever." "Was it?" "No," says List.` : `You do not ask him if it was the fever. He has been asked.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_list5_again:()=>({sp:'Corporal List', txt: S.f.b2_towerOut ? `List looks at your face, and then away. "You went in," he says. It isn't a question. "Good. Now we can leave."` : `List is on his feet beside the historian, looking north-east through the trees. "Past the standing stone," he says, without being asked. "If you go. I'd not."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_duiker7:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker7 = 1; S.f.b2_duiker = 1; }, txt:
`The historian has a mound for a writing desk and does not seem to have noticed. He is scratching at his notebook with a stub of pencil, and his voice, when he speaks, is still a croak from the Vathar.

"Battlefields," he says. "The whole wood. Imass and Jaghut, before anyone had cities to write histories in. Every mound a grave, or a cairn over something they wanted to keep down." He taps the pencil on the litter beside him. "I have been trying to decide whether it is a comfort that the world has done this before, Sergeant, and is still here. I have decided it is not."

He glances at his escort. "The corporal dreams about it. I'm writing that down too. I write everything down. It is the only thing I am any good for."`,
    ch:[{t:'"You were good for something at the Vathar, sir."', go:'b2_duiker7b'},
        {t:'Leave him to it.', go:()=>startExplore()}]}),
  b2_duiker7b:()=>({sp:'Duiker', txt:`He touches his throat, where the marks are going yellow. "I was very nearly good for a hanging." He almost smiles. "Go on, Sergeant. The Fist wants out of these trees by tomorrow night, and the corporal agrees with him, and they are the two least frightened men in the army, so I am told."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the Weasels, and the stragglers in the mounds ---- */
  b2_weasel5:()=>({sp:'A Weasel rider', fx:()=>{ S.f.b2_weasel5 = 1; }, txt:
`A Weasel rider on foot, leading a horse with ribs like a cage, comes down the track looking for anyone with a weapon who is not doing anything with it.

"Malazan." Teeth filed to points; he grins with them, and doesn't mean it. "The tail of your column is being eaten. Stragglers. A cart that stops for a wheel, an old man who sits down. They go off the track among the graves and they don't come back." He jerks his head west, into the mounds. "Bhilard. Raiders off the Odhan, come into the trees ahead of their tribe, to eat what falls. Six, eight. The clan has no horses to spare for trees." He looks at your boots. "You have feet."

${b2In('sathi') ? `Sathi says something to him in Wickan, short. He looks at her properly for the first time, and at her teeth${S.f.b2_sathiTeeth ? ', which are filed like his' : ', which are not filed'}, and answers, shorter. "He says the Weasels will owe us one cow," she reports. "He says there are not many cows left to owe."` : ''}`,
    ch:[{t:'"Show me."', go:'b2_mounds_go'},
        {t:'"In a moment."', go:()=>startExplore()}]}),
  b2_weasel5_again:()=>({sp:'A Weasel rider', txt: S.f.b2_moundsDone ? `The Weasel rider lifts a hand to you from his horse, which is all a Weasel ever gives anyone. "One cow," he says. "If there is a cow."` : `"West," the Weasel says. "Among the graves. Before they eat another one."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_mound:()=>({sp:'A mound', txt: S.f.b2_moundsDone ?
`The mound, and the raiders the squad left in the litter beside it. Nobody has touched them. Nobody will. The forest is very quiet about it.` : S.f.b2_weasel5 ?
`A long mound under the leaf-litter, and the litter scuffed beside it where somebody was dragged. A dropped bundle. A child's sandal. The tracks go west, between the mounds, into the dark of the wood.` :
`A long mound, longer than a cart, with a stone at its head so old the edges have gone soft. The leaf-litter lies on it the way snow lies on a roof. ${b2In('marrow') ? `Marrow puts her hand flat on it, and takes it away again quickly. "Something under there," she says. "Old. Not dead the way the dead are dead." She wipes her hand on her coat, though there is nothing on it.` : b2In('haddat') ? `Haddat walks round it rather than over it, and says a word in Hissari you have heard her say at funerals.` : 'Nobody walks over it.'}`,
    ch:[{t:'Follow the tracks.', req:()=>!!S.f.b2_weasel5 && !S.f.b2_moundsDone, go:'b2_mounds_go'},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_mounds_go:()=>({sp:'Among the mounds', txt:
`You go in among the mounds in a file, off the track, and the forest closes behind you like a door.

The tracks are easy: a cart's ruts, and the scuffing of somebody being pulled, and blood, a little. Then the mounds open out into a ring of them round a hollow, and in the hollow are the Bhilard, eight or so, lean men in dust-coloured cloth, going through a cart's bundles. Two people from the column sit with their backs to a mound, tied, watching them do it. Somebody else is lying very still. ${b2In('sathi') ? 'Sathi has an arrow on the string.' : ''}${b2Hands5() <= 3 ? ' The Weasel rider has come with you, on foot, his knife out, because he has counted your squad and does not think much of the number.' : ''}`,
    ch:[{t:'Into them.', go:()=>startBattle('b2_mounds', {})},
        {t:'Sathi and Hackle along the back of the mounds first.', check:['guile',15], req:()=>b2In('sathi'),
          edges:id=>[id === 'sathi' && ['Hackle knows how to be quiet', 2], id === 'redblade' && ['spurs', -2], id === 'haddat' && ['mail', -1]],
          go:'b2_mounds_quiet', fail:'b2_mounds_loud'},
        {t:'Tangle\'s sharper into the hollow first.', tag:'uses 1 sharper', req:()=>b2In('tangle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; },
          go:()=>startBattle('b2_mounds', {pre:'Tangle hums four notes, stops, and rolls a sharper down the inside of the ring, away from the two tied by the mound. It goes off among the bundles with a crack the forest swallows whole.'})}]}),
  b2_mounds_quiet:()=>({sp:'Among the mounds', txt:`${by({sathi:`Sathi and the dog go along the back of the ring, low, and are gone. A breath. Then a bowman on the far mound sits down without a sound, and the one beside him turns round into Hackle.`, _:`{who} goes round behind the ring with Sathi and the dog. A breath. A bowman on the far mound sits down without a sound.`})}`, ch:[{t:'Now.', go:()=>startBattle('b2_mounds', {surprise:'p'})}]}),
  b2_mounds_loud:()=>({sp:'Among the mounds', txt:`A stone at the head of a mound turns under a boot and goes over, slowly, with a sound like a door shutting in an empty house, and every head in the hollow comes round at once.`, ch:[{t:'In, before they nock.', go:()=>startBattle('b2_mounds', {})}]}),

  b2_after_mounds:()=>({sp:'Among the mounds', fx:()=>{ if (!S.f.b2_moundsDone) { S.f.b2_moundsDone = 1; chain(0, 2, 'Stragglers from the mounds'); } }, txt:
`The last of them goes over a mound and does not come back over it.

The two by the mound are a carter and his grown son, both alive, both cut about, the son with a split lip and the carter not speaking at all. The one lying still is the carter's wife. ${b2In('marrow') ? 'Marrow kneels by her, and looks, and does not reach for the warren. "No," she says. That is all.' : 'You look, and there is nothing to do.'}

You bring the two of them back to the track, and they walk in your stretch now, because there is nowhere else for them to walk.

${b2In('haddat') ? `Haddat looks at the dead Bhilard a while. "Odhan men," she says. "Ahead of us, in the trees. Not behind." She doesn't need to say what that means.` : 'Bhilard in the forest, ahead of the column. Not behind it.'}`,
    ch:[{t:'Back to the track.', go:()=>startExplore()}]}),

  b2_oldbones:()=>({sp:'Old bones', txt:
`Bones in the leaf-litter, where a mound has slumped. Not a man's. Too long in the arm, too heavy in the brow, and a jaw with two tusks in it, yellow as old ivory, curving up. Beside it, half sunk, a shoulder-blade with a hole through it the size of a fist, made by something that was not a spear.

${b2In('tangle') ? `Tangle squats by it and looks at the hole a long time. "Stone," he says. "Something stone went through that." He stands up. "Don't like it." He doesn't hum.` : b2In('haddat') ? `Haddat looks at the tusks, and then at you. "My grandmother told stories," she says. "About the grey people who made winter. I thought they were stories."` : 'Nobody wants to touch it. Nobody does.'}`,
    ch:[{t:'Leave it lie.', go:()=>startExplore()}]}),

  /* ---- Bungle's company, and Mincer in it ---- */
  b2_bungle5:()=>({sp:'Captain Bungle', fx:()=>{ S.f.b2_bungle5 = S.f.b2_bungle5 || 'met'; }, txt:
`Bungle's company is digging a latrine trench beside the track, because the Fist wants the camp clean even in a graveyard. Bungle stands over it with Mincer's slate. In the trench, with a spade, stripped to the waist and sweating, is Mincer.

He looks up. "Sergeant." No rank on him anywhere. He looks well, for a man in a latrine. He goes back to digging.

"Sergeant." Bungle comes over, the slate held to his chest like a shield. "Quick word. The company's dry. I don't mean water. I mean there's not a sharper left in it, nor a burner, nor anything that goes off. Sappers with nothing to throw are a regiment of ditch-diggers." He looks at the trench. "As you see." ${b2In('tangle') ? `He looks at Tangle's satchel. He doesn't ask. He is asking.` : b2Away() === 'tangle' ? `"Your sapper's on the burned boat with his satchel?" "The satchel's here." He brightens, and then looks at you, and doesn't ask.` : `"You've no sapper. Pity."`}`,
    ch:[{t:'"Tangle. Give the company a sharper."', tag:'1 sharper, for good', req:()=>b2In('tangle') && S.inv.sharper > 0 && S.f.b2_bungle5 !== 'gave', fx:()=>{ S.inv.sharper--; S.f.b2_bungle5 = 'gave'; loy('tangle', 1); }, go:'b2_bungle5_gave'},
        {t:'"We\'re short ourselves, Captain."', fx:()=>{ if (S.f.b2_bungle5 !== 'gave') S.f.b2_bungle5 = 'kept'; }, go:'b2_bungle5_kept'}]}),
  b2_bungle5_gave:()=>({sp:'Captain Bungle', txt:`Tangle takes a sharper out of the satchel and holds it a moment, and hums the four notes, and stops, and puts it in Bungle's hand. "${b2Count()}," he says. "Tell Mincer it was me."

In the trench Mincer has stopped digging. He doesn't say anything. He nods to Tangle, once, the way a captain nods, and goes back to the spade.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_bungle5_kept:()=>({sp:'Captain Bungle', txt:`"Course you are." Bungle doesn't argue. Sappers never argue about munitions; they only remember. "If it comes to it, Sergeant, and it will, find us. We'll throw rocks. We're good at rocks." In the trench Mincer laughs, once, at the spade.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the squad's people, and Ramin, in the trees ---- */
  b2_ours7:()=>({sp:b2Ours5() || 'The squad\'s people', fx:()=>{ S.f.b2_ours7 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.younger} has found a leaf as big as her head and is holding it over herself like a parasol, very seriously. ${B2.elder} is watching the trees.

"She asked me if the forest has a well," ${B2.elder} says. "I said no. She said then who waters the trees." She almost smiles. "Father would have had an answer. He had an answer for everything about water." She looks at the jar on her hip, Ressan's jar, that ${B2.younger} would not leave on the well. "I still have some of his. From Hissar. I keep a little back."` : S.f.b2_yedda ?
`${B2.widow} is sitting on her rope in the shade with her eyes on the mounds. "My husband's people put their dead in the ground in rows like that," she says. "In the hills. With a stone at the head." She looks at the long ones. "Not so long." Her grandsons are not allowed off the track, and for once they do not argue.` :
`The weavers' family, in the shade, the mother with her back against a tree for the first time in a month, asleep sitting up. The children are not playing. Nobody here has played since the Vathar.`,
    ch:[{t:'Leave them to the shade.', go:()=>startExplore()}]}),
  b2_ramin7:()=>({sp:'Ramin', fx:()=>{ S.f.b2_ramin7 = 1; loy('redblade', 1); }, txt:
`Ramin is standing in the middle of the track very straight, looking up into the trees with his helm under his arm.

"In Ehrlitan there are no trees like this," he says. "There are palms. A palm is a tree that has decided to be useful." He looks at a trunk wider than a cart. "This one has decided nothing for a thousand years." He puts his helm on. "The company's horses would not have come into this wood. I am glad they are not here to refuse." It is the first time you have heard him glad the company is somewhere else.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the standing stone, and the path to the tower ---- */
  b2_tstone:()=>({sp:'A standing stone', txt: S.f.b2_towerOut ?
`The standing stone, with the frost on its north face, and the path going away from it toward the tower. You have been. Once is plenty.` :
`A standing stone at the edge of the mounds, taller than a man, leaning. There is frost on its north face. It is midday, under a summer sun, and there is frost on the stone, white, and it does not melt when you put your hand to it.

Beyond it a path goes north-east through the trees, older than the track and narrower, and at the end of it, over the canopy, you can see the top of a tower. ${S.f.b2_listTower ? 'List\'s tower.' : 'A tower, out here, where nobody has built anything in longer than anyone can say.'}

${b2In('sathi') ? `Hackle sits down at the stone and will not go past it.` : ''}`,
    ch:[{t:'Up the path, to the tower.', req:()=>!S.f.b2_towerOut, go:'b2_tower_go'},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_tower_go:()=>({sp:'The tower', scene:'b2_tower', txt:
`It is further than it looks, and colder with every step, until your breath shows in front of you at noon.

The tower is round, and fitted stone without mortar, the stones so close you could not get a knife-blade between them, and it has no door. It has a gap where a door was, a long time ago, and frost round the gap thick as fur. Cold comes out of it. Not like a cellar. Like a winter, waiting.

${b2In('sathi') ? `Sathi stops at the edge of the frost with Hackle pressed against her legs. "No," she says, quite calmly. "Not for me. Not for the dog. This is not a place for anything that lives." She sits down on a root to wait, facing away from it. "Go if you go. Come back."` : ''}${b2In('haddat') ? ` Haddat says her five words to no god, under her breath, and goes in first, because Haddat always goes in first.` : ''}`,
    ch:[{t:'In.', go:()=>{ startExplore('b2_jtower'); talk('b2_tower_in'); }},
        {t:'Not today. Back to the column.', go:()=>startExplore()}]}),
});

/* ---------------- inside the Jaghut tower ---------------- */
Object.assign(B2CH5.dlg, {
  b2_tower_in:()=>({sp:'The tower', scene:'b2_tower', fx:()=>{ S.f.b2_towerIn = 1; }, txt:
`Inside, everything is white.

The floor is stone under a skin of frost that creaks underfoot. The walls are stone, and here and there not stone: ice, set into the wall in great clear slabs as if it were masonry, clear as water and deep. Two braziers stand in the middle of the floor, iron gone grey, and something in them is burning without any flame, and the air over them shivers the way air shivers over a fire, and is cold.

A stair goes up round the inside wall into the dark.

Nothing moves. Nothing has moved here for a long time. ${b2In('tangle') ? 'Tangle is not humming. Nobody is anything.' : 'Nobody speaks.'}`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  b2_ice:()=>({sp:'The ice', fx:()=>{ S.f.b2_towerIce = 1; }, txt:
`You look into the ice. You should not have.

It goes back a long way, further than the wall is thick, as if the slab were a window onto somewhere else. Far back in it, very clear, there is a great stone, a boulder, grey, the size of a cart. It is lying on something. At the edge of it, where it meets the ground, there is a shape, small, and you do not look long enough to say what shape, and you do not need to.

${b2In('haddat') ? `Haddat turns her back on the wall and stands that way, shield up, as if something might come out of it. "Don't," she says. "Sergeant. Don't."` : b2In('marrow') ? `Marrow looks, and sits down on the frost, which is what Marrow does when she has seen enough of something. "Somebody's child," she says. That is all.` : 'You step back from it. Nobody else looks.'}

Behind you, by the foot of the stair, the cold has got deeper. You did not hear anything. You turn round anyway.`,
    ch:[{t:'Turn round.', go:()=>startExplore()}]}),

  b2_shade:()=>({sp:'Something tall', fx:()=>{ S.f.b2_shade = 1; }, txt:
`At the foot of the stair, where there was nothing, there is something tall.

You cannot see it well. You can see it the way you see a breath on a winter morning: the shape of it against the dark, taller than any man, grey, stooped as if under a weight. The suggestion of a long face. Of tusks. The cold comes off it in a slow wave and goes through your coat and your skin and stops somewhere behind your ribs.

It is not looking at you. It is looking at the wall where the ice is, the way you would look at a window you have looked out of every day for longer than there have been days.

${b2In('tangle') ? 'Tangle starts to hum, four notes, and stops on the second, and does not start again.' : ''}${b2In('haddat') ? ' Haddat has her shield up and her tulwar down, which is the most polite thing she knows how to do with them.' : ''}${b2In('redblade') ? ' Ramin has gone down on one knee, the way a Red Blade does before a governor, and does not seem to know he has.' : ''}${b2In('marrow') ? ' Marrow, from the floor, very softly: "Child. Don\'t move."' : ''}

You don't. After a while (a long while, or no time at all) it is not there. The cold stays.`,
    ch:[{t:'Breathe.', go:()=>startExplore()}]}),

  b2_brazier:()=>({sp:'A cold brazier', txt: S.f.b2_breathTry ?
`The brazier burns on with its cold, as it has for longer than anyone has a word for. ${trickBy('b2_breath') ? `${NAME(trickBy('b2_breath'))} does not go near it again. Some of it is still in there, behind the ribs.` : 'Your hand still aches from it.'}` :
`An iron brazier, grey with age, full of something like coals that are white instead of red. The air above it shivers. You hold out a hand, the way you would to a fire, and the cold comes up into it, and goes on coming, up the wrist and the arm and into the chest, and it is not like ice, it is like a breath held under water: there is a weight in it, and a stillness, and if you could hold on to it a moment longer, you think you could keep some.`,
    ch:[{t:'Hold on. Breathe it in.', check:['wits',16], trick:'b2_breath', req:()=>!S.f.b2_breathTry, fx:()=>{ S.f.b2_breathTry = 1; },
          edges:id=>[id === 'marrow' && ['she knows a warren when she is standing in one', 2], id === 'tangle' && ['he has held worse things very still', 1], id === 'redblade' && ['a desert man, and every hair on him says no', -1]],
          go:'b2_brazier_yes', fail:'b2_brazier_no'},
        {t:'Take your hand away.', go:()=>startExplore()}]}),
  b2_brazier_yes:()=>({sp:'A cold brazier', txt:
`${by({marrow:`Marrow holds her hand over it with her eyes shut, the way she reaches into Denul, and breathes in, slowly, and does not let go until her lips have gone blue. When she takes the hand away it is white to the wrist. "Old," she says, with her teeth chattering. "Older than Denul. Older than Soliel. And clean, child. Clean as snow." She sits down.`, haddat:`Haddat holds her hand over it as if she were holding it over a candle to prove something, and breathes in, and keeps breathing, and her face does not change at all. When she takes it away her hand is white to the wrist. She closes it. "Something stays," she says.`, _:`{who} holds on, and breathes in, and goes on breathing in after it hurts, and then after it stops hurting, which is worse. The hand comes away white to the wrist. Something stays behind the ribs: a cold, and a stillness, held.`})}

It does not warm for an hour. When it does, the cold is still there, further in, waiting to be let out.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_brazier_no:()=>({sp:'A cold brazier', txt:
`${by({_:`{who} holds on as long as a body can, and then a little after, and then the body wins and the hand comes away by itself, white and shaking.`})} Whatever was there, it does not stay. Only the ache does. It aches all afternoon, like a bruise from a blow nobody struck.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_tower_marrow:()=>({sp:'Marrow', fx:()=>{ if (!S.f.b2_towerWarren) { S.f.b2_towerWarren = 1; S.f.b2_knots = (S.f.b2_knots || 0) + 1; } }, txt:
`Marrow is sitting on the frost with her back against a wall that is not ice, with her eyes shut and one hand open in her lap. She is reaching. You know the look of it by now.

Then she laughs. You have not heard her laugh since Hissar.

"It's clean," she says. "The warren. Here. Cold as a well in winter and clean." She opens her eyes. "${S.f.b2_warrenFloor ? `At the Vathar I put my hand in and there was a bottom to it, and something sitting on the bottom. Here there's no bottom. And nothing sitting. Whatever it is, it doesn't come in here.` : `Since Hissar it's been mud, and fur, and something wading. Here, nothing. Nothing wading.`} It doesn't like the cold, child. Whatever's walking in the warrens this summer, it doesn't like this."

${b2Hurt() && b2Hurt() !== 'marrow' ? `She reaches for ${NAME(b2Hurt())} before you can say anything, and puts her hand flat on the bound wound, and reaches again. ${NAME(b2Hurt())} flinches, and then doesn't. "It won't close," Marrow says after a while. "Not all the way. Not with me. But the bottom of it's clean now, and it wasn't." She ties a knot in her string.` : `She takes out her string and ties a knot in it, for nothing, for the warren being clean, and looks at the knot a long time.`}`,
    ch:[{t:'Let her sit.', go:()=>startExplore()}]}),

  b2_tstair:()=>({sp:'The stair', txt:
`A stair of fitted stone going up round the inside of the wall, every step furred with frost, into the dark and the cold. ${S.f.b2_towerTop ? 'You have been up. There is nothing up there but the sky, and the country to the south.' : ''}`,
    ch:[{t:'Up.', req:()=>!S.f.b2_towerTop, go:'b2_tower_top'},
        {t:'Out. Back into the warm.', go:'b2_tower_leave'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_tower_top:()=>({sp:'The top of the tower', fx:()=>{ S.f.b2_towerTop = 1; }, txt:
`The stair comes out on a broken roof under a white sky, and the forest is below you.

You can see it all from here: the mounds in their rows between the trees, more than you had thought, many more, all the way to the edge of the wood; the track, and the column on it, a dark thread, very thin; and beyond the forest to the south, the Nenoth. White. Flat. Going on to the edge of the world with nothing standing on it at all. It shimmers.

North, back across the Vathar, there is dust on the horizon. A great deal of it. More than at the river.

${b2In('haddat') ? `Haddat looks north a long time. She doesn't say anything. She doesn't have to.` : 'You look north a long time.'}`,
    ch:[{t:'Down.', go:()=>startExplore()}]}),
  b2_tower_leave:()=>({sp:'Outside', scene:'b2_forest', fx:()=>{ S.f.b2_towerOut = 1; }, txt:
`You come out through the gap where the door was into heat that hits like a hand, and stand in it, and let it.

${b2In('sathi') ? `Sathi is on her root where you left her, with Hackle's head in her lap. She looks at you, and at the sky. "You were a long time," she says. "The sun moved." It has moved further than it should have. Nobody argues with her.` : `The sun has moved further than it should have. Nobody mentions it.`}

You walk back down the path to the standing stone, and the frost on it, and the mounds, and the column, and none of you looks back at the tower, and all of you want to.`,
    ch:[{t:'Back to the column.', go:()=>startExplore('b2_vforest')}]}),

  /* ---- the edge of the forest ---- */
  b2_forest_edge:()=>({sp:'The great tree', txt: !S.f.b2_moundsDone ?
`A great tree at the south end of the clearing, its roots heaped like a wall, and beyond it the trees thinning, and light. The column is gathering here to go on. Behind it, somewhere among the mounds, the tail is still being picked at. ${S.f.b2_weasel5 ? 'The Weasel said west.' : 'Somebody should see to that.'}` :
`The great tree at the south end of the clearing. Beyond it the trees thin out into scrub, and the scrub into nothing, and the nothing is white and very bright and goes on for ever. The Nenoth.

The column is already moving out onto it. ${b2In('tangle') ? '"Dry March," Tangle says. "The guides call it the Dry March." He looks at the white. "I like a place that tells you."' : ''}`,
    ch:[{t:'Drink, and rest under the last trees.', tag:'1 water', req:()=>!!S.f.b2_moundsDone && !S.f.b2_forestRest && chainW() > 0, fx:()=>{ S.f.b2_forestRest = 1; dgRest('The squad lies down under the last of the shade and sleeps an hour with its boots on. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Out onto the Nenoth.', req:()=>!!S.f.b2_moundsDone, go:'b2_nenoth_go'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_nenoth_go:()=>({sp:'The edge of the forest', scene:'b2_dry_march', txt:
`The last tree. Then the scrub, then the cracked white clay, and the sun on it like a hammer on an anvil, and the column going out into it a cart at a time, a family at a time, the way people go into cold water.

${b2In('marrow') ? 'Marrow pulls her hat down. "Well," she says. "It was nice to be cold."' : 'Behind you the forest is very quiet.'}${S.f.b2_towerOut && b2In('haddat') ? ` Haddat looks back once, north-east, where the top of the tower shows over the trees. Then she does not look back again.` : ''}`,
    ch:[{t:'Onto the Dry March.', fx:()=>{ if (!S.f.b2_nenoth) { S.f.b2_nenoth = 1; chain(-2, -2, 'Days on the Nenoth'); } }, go:()=>{ startExplore('b2_nenoth'); talk('b2_nenoth_arrive'); }}]}),
});

/* ---------------- the Nenoth Odhan: the Dry March ---------------- */
Object.assign(B2CH5.dlg, {
  b2_nenoth_arrive:()=>({sp:'The Nenoth Odhan · the Dry March', scene:'b2_dry_march', txt:
`Days.

There is no water on the Nenoth. The guides said so, and the guides were right, and the column walks across it anyway because there is nowhere else to walk. The clay is white and cracked into plates, and the plates curl at the edges, and they break under the carts with a sound like crockery. By noon the air over it shakes. By the third day nobody talks at noon. It costs too much.

The Bhilard come every day, and the Tregyn, raiding: out of the shimmer at the column's edges, a cart, a straggler, a cow, gone, and back into the shimmer before anyone can turn. They do not stand and fight. They do not need to. The Nenoth is fighting for them.

And behind, every evening, the dust. Bult says Dom has five men now for every one of the Seventh, and more coming in from the cities every day. Nobody asks how he knows. You can see it.`,
    html:chainHTML('The Nenoth Odhan · the Dry March'),
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  /* ---- the Weasels and the last herd ---- */
  b2_weaselcap5:()=>({sp:'The Weasel captain', fx:()=>{ S.f.b2_weaselAsk = 1; }, txt:
`The Weasel captain, the one from the Shallows, is walking his horse along the clan's lines with his lance across his shoulders, looking at the horses' ribs the way a man looks at a debt.

"Malazan." He stops. "The last of the cattle. There." He points with the lance at a knot of gaunt beasts on the pan, two hundred of them, perhaps, where there were thousands at Hissar. "Bhilard on the skyline since dawn, counting them. They will come at midday, when everyone is too hot to run." He looks at your squad. "I have riders. I have not enough horses for the riders. Your feet, in the gap in those rocks, and my riders on the herd, and we keep the cattle another day."

${b2In('sathi') ? (S.f.b2_sathiShamed && !S.f.b2_sathiLaugh ? `He does not look at Sathi. He has not looked at her since the Shallows.

Sathi steps in front of him anyway. She says something in Wickan, low and fast, with her chin up. He hears her out, and then, for the first time since the Shallows, he looks at her. A long look. Then he jerks his head at a spare horse, a bony grey. "He says I may ride," Sathi says, very flat. "If my sergeant can spare me."` : `He looks at Sathi. "And you, girl. I have a horse with no rider. Your sergeant can spare you a morning." It is not a question to you. It is a question to her.${S.f.b2_weaselHonour || S.f.b2_sathiLaugh ? ` She has gone red to the ears, which on Sathi you have never seen.` : ''}`) : `"Your Wickan girl would have been useful," he says. "Pity."`}`,
    ch: b2In('sathi') ? [
        {t:'"Go with them, Sathi. Take Hackle."', fx:()=>{ S.f.b2_sathiRode = 1; loy('sathi', 1); }, go:'b2_sathi_rides'},
        {t:'"I need her with the squad, Captain."', fx:()=>{ loy('sathi', -1); }, go:'b2_sathi_stays'}] :
      [{t:'"The gap, then."', go:()=>startExplore()}]}),
  b2_sathi_rides:()=>({sp:'Sathi', txt:
`Sathi is on the grey before you have finished saying it, without touching the stirrup, the way she gets onto everything. Hackle is already running at the horse's heels. She looks down at you from the saddle, and she is seventeen, and she is a Weasel, and for a moment she is so happy it is hard to look at.

"Watch the gap, Sergeant," she says. "We will bring you the cows." And then she is gone along the lines with the clan's riders, laughing at something one of them said, and you do not see her again until the dust.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_sathi_stays:()=>({sp:'Sathi', txt:`The captain shrugs, and turns his horse, and goes. Sathi watches the riders go along the lines without her. She doesn't say anything. She checks her bowstring, twice, which she never does, and Hackle leans against her leg.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_cattle:()=>({sp:'The last cattle', txt: S.f.b2_herdDone ?
`The cattle that are left, standing on the pan with their heads down, too tired to graze on nothing. They are bones in a hide. The Weasels' dogs lie among them in the shade of their bodies, which is the only shade there is.` : !S.f.b2_weaselAsk ?
`Cattle, the last of the Seventh's herd: two hundred, perhaps, gaunt, their hides hanging off their hips like wet cloth on a pole. They stand on the white clay with their heads down. A Weasel's dog lies in the shade of each one.` :
`The herd, and beyond it, on the skyline to the east, a line of riders that was not there an hour ago, sitting their horses, watching. Waiting for noon.

It is nearly noon. The air over the pan is shaking. ${b2In('haddat') ? `Haddat is in mail, and you watch the sweat run out from under her head-cloth and dry before it reaches her jaw.` : b2In('redblade') ? `Ramin is in his scale, and you watch the sweat run out from under his helm and dry before it reaches his jaw.` : 'Everyone is sweating, and the sweat dries before it runs.'}`,
    ch:[{t:'To the gap.', req:()=>!!S.f.b2_weaselAsk && !S.f.b2_herdDone, go:'b2_herd_go'},
        {t:'Leave them.', go:()=>startExplore()}]}),
  b2_herd_go:()=>({sp:'Midday · the herd', scene:'b2_dry_march', txt:
`Noon on the Nenoth. The sun is straight overhead and there is no shadow anywhere, not even under the carts. The raiders on the skyline start to move.

Here is the thing about noon on the Nenoth, which every soldier in the Seventh has learned by now. A fight goes well for three breaths, four, and then the sun finds whoever is wearing iron. ${[b2In('haddat') && 'Haddat\'s mail', b2In('redblade') && 'Ramin\'s scale'].filter(Boolean).length ? `${[b2In('haddat') && 'Haddat\'s mail', b2In('redblade') && 'Ramin\'s scale'].filter(Boolean).join(' and ')} will be ${b2In('haddat') && b2In('redblade') ? 'ovens' : 'an oven'} by the fourth round, and an oven is slow.` : 'Anyone in mail will be an oven by the fourth round, and an oven is slow.'} Unless there is water in them first.

${chainW() > 0 ? `There are ${numw(chainW())} skin${chainW() === 1 ? '' : 's'} on the cart.` : 'There is no water on the cart.'}`,
    ch:[{t:'Drink first, all of you. One skin.', tag:'1 water', req:()=>chainW() > 0 && !S.f.b2_dry, fx:()=>{ b2Drink('b2_herd'); }, go:()=>startBattle('b2_herd', {})},
        {t:'No water to spare. Into the herd.', go:()=>startBattle('b2_herd', {})}]}),

  b2_after_herd:()=>({sp:'The gap', fx:()=>{ S.f.b2_herdDone = 1; }, txt:
`The Bhilard chief goes down in the gap, and his riders see it from the pan and turn, all at once, the way a flock turns, and are gone into the shimmer.

The herd comes through the gap behind you, bawling, with the Weasels on its flanks and their dogs at its heels, and goes past in a long stinking river of hide and bone, and the dust of it settles on everybody. ${S.f.b2_sathiRode && b2In('sathi') ? `Sathi comes through last, on the bony grey, with Hackle running beside her and three Weasels round her, and one of them has his hand on her shoulder. She is laughing. She does not stop laughing for a long time.` : ''}

The captain rides past, and lifts his lance to you, which is a great deal, from a Weasel.

The cattle are saved. For today.`,
    ch:[{t:'For today.', go:'b2_cattle_die'}]}),
  b2_cattle_die:()=>({sp:'The Nenoth · the days after', scene:'b2_dry_march', fx:()=>{ if (!S.f.b2_cattleDead) { S.f.b2_cattleDead = 1; chain(0, -1, 'The days after'); } }, txt:
`They die anyway.

Not to the Bhilard. To the Nenoth. Two days after the gap the first of them lie down on the white clay and do not get up, and the next day it is twenty, and the day after that the Wickans stop trying to get them up. The column eats what it can. It is not much. There was nothing on them.

On the fourth morning the last cow in the Seventh's herd stands in the middle of the pan with her head down, and the Weasels' dogs stand round her in a ring, watching, and then she lies down too, slowly, front legs first, the way cattle do, and that is the end of the herd that walked out of Hissar.

${b2In('sathi') ? `Sathi sits by her a while with Hackle. When she comes back she doesn't laugh. "The dogs have nothing to herd now," she says. "They don't know what they are for."` : `The dogs stand round her a long time, not knowing what they are for.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_carcass:()=>({sp:'Bones', txt: S.f.b2_cattleDead ?
`A cow from the Seventh's herd, three days dead, already flat, already white. The Nenoth does not let anything stay soft for long.` :
`Bones on the pan, white, cattle bones, a long way from any herd: the Nenoth's, from some year when somebody else tried to cross it. They have been here a long time. They look as if they are waiting for company.`,
    ch:[{t:'Leave them.', go:()=>startExplore()}]}),
  b2_lookback:()=>({sp:'A dead tree', txt:
`A tree that died standing, white as the clay, with one arm pointing back the way you came. You stand in the stripe of shade it throws, which is the width of a hand, and look back north.

Dust. A wall of it on the horizon, low and brown and wide, wider than yesterday. Under it Korbolo Dom's army, and Reloe's tribes, and the cities' legions, and every Odhan clan with a grudge, coming on at their own pace because they have all the water in the world behind them and you have none in front.

${b2In('haddat') && S.f.b2_ilharSeen ? `Haddat comes and stands in the hand's-width of shade beside you, and looks at the dust. She doesn't say his name. She says: "He was always the one who knew where the water was." Then she goes back to the carts.` : b2In('haddat') ? `Haddat looks at the dust a long time, at every part of it, as if she could pick out one face at a league.` : 'You look at it until your eyes water, which is a waste.'}`,
    ch:[{t:'Back to the carts.', go:()=>startExplore()}]}),
  b2_nhorses:()=>({sp:'The horse lines', txt:
`The Wickan horse lines: what is left of them. Horses standing with their heads low, ribs like barrel-hoops, and Wickans walking among them with a little water in their cupped hands, giving each horse a mouthful, one after another, down the line, the way you would give a sacrament. ${b2In('sathi') ? `Sathi goes and helps. She gives the bony grey hers, out of her own skin, and Hackle watches her do it and does not ask for any.` : ''}`,
    ch:[{t:'Leave them to it.', go:()=>startExplore()}]}),

  /* ---- the column grows on the Dry March, too ---- */
  b2_bylan:()=>({sp:'Strangers', txt: S.f.b2_bylan ? (S.f.b2_bylan === 'took' ? `The family from Bylan, walking in your stretch now, the grandmother on the cart. They have learned the Chain's walk already: eyes a pace ahead of the feet.` : `The family from Bylan has gone back along the column to the Wickan wagons. You hope the grandmother is on a cart.`) :
`A family you have never seen, standing at the edge of your stretch the way people stand at a door they have not been asked through: a man and a woman, a grandmother on the man's back, two children with their mouths cracked white. Not from Hissar. Their clothes are wrong, and the way they speak.

"Bylan," the man says, when you ask. He points north-east, at nothing. "They burned Bylan. We heard there was an army going to Aren." He looks at the column, at the length of it, as if it were a miracle he was not sure he believed in. "Is this it?"

${b2In('haddat') ? 'Haddat answers him, in a Hissari he understands. "This is it," she says. "Such as it is."' : 'You tell him it is.'}`,
    ch:[{t:'"Walk with us." Into the stretch.', tag:'1 water', req:()=>!S.f.b2_bylan && chainW() >= 1, fx:()=>{ S.f.b2_bylan = 'took'; chain(-1, 5, 'A family from Bylan'); if (b2In('haddat')) loy('haddat', 1); if (b2In('marrow')) loy('marrow', 1); }, go:'b2_bylan_took'},
        {t:'"The Wickan wagons, at the back. They\'ll take you."', req:()=>!S.f.b2_bylan, fx:()=>{ S.f.b2_bylan = 'sent'; }, go:()=>startExplore()},
        {t:'Leave them.', req:()=>!!S.f.b2_bylan, go:()=>startExplore()}]}),
  b2_bylan_took:()=>({sp:'The squad\'s stretch', txt:`They come in. The children get a mouthful each from the squad's skin, slowly, the way the stretch has learned to drink, holding it, and somebody in the stretch shows them how. ${S.f.b2_key === 'daughters' ? `${B2.younger} takes the smaller one by the hand without being asked.` : S.f.b2_yedda ? `${B2.widow} looks at the grandmother on the man's back and says, "Put her on my cart, then," and moves over on her rope.` : 'A woman from the weavers\' street makes room on a cart for the grandmother.'} The stretch is longer by five. The skins are lighter. That is the arithmetic.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- List on the Nenoth ---- */
  b2_list6:()=>({sp:'Corporal List', fx:()=>{ S.f.b2_list6 = 1; }, txt:
`List is limping along beside the historian's horse with his hand on the stirrup, as if the horse were helping him. Perhaps it is.

"He came last night," he says, when you fall in beside him. He doesn't say who. "Out here. I thought he'd stay in the forest." He looks at the white clay going on for ever. "He says this is what it looks like after. After the Imass. He says they didn't only kill his people, they killed the ground so nobody like them could ever live on it again. And it stayed killed." He wipes his mouth. "He didn't sound angry. He sounded like Duiker when Duiker reads out a casualty list."

${S.f.b2_shade ? `He glances at you sidelong. "You saw him. In the tower." You didn't tell him. "Did he look at you?" "No." List nods, as if that were the right answer. "He never looks at anyone. He's looking for someone."` : S.f.b2_towerIn ? `"You went in the tower," he says. "He said. He said you didn't stay long enough to be rude."` : ''}`,
    ch:[{t:'Walk with him a while.', go:()=>startExplore()}]}),

  /* ---- the squad's people: the jar ---- */
  b2_ours8:()=>({sp:b2Ours5() || 'The squad\'s people', fx:()=>{ S.f.b2_ours8 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.elder} comes and finds you at the halt, with the jar.

Ressan's jar: clay, with the water-sellers' blue round the neck, that ${B2.younger} carried out of Hissar in both arms. ${B2.elder} holds it out. You can hear water in it. Not much.

"Father's," she says. "A water-seller keeps a little back, always, for the day there's none. He taught us that before we could walk. We've kept a mouthful each, every day, since Hissar." She looks at the skins on the cart, which are nearly flat. "This is the day there's none. Isn't it."

${B2.younger} is standing behind her, watching the jar, the way she watched it on the well-cover.` : S.f.b2_yedda ?
`${B2.widow} is walking beside her cart with her hand on the rope, not on the handle, because her grandsons are on the cart now and she is pushing it herself. Her lips are cracked white. "Don't you look at me like that, soldier," she says, without looking at you. "I've walked further on less. I walked to my wedding." She keeps pushing.` :
`Your people, walking. Nobody talks. A man from the weavers' street has a pebble in his mouth, to keep the spit coming. Half the stretch has, now. You can hear them click against teeth.`,
    ch: S.f.b2_key === 'daughters' ? [
        {t:'"Pour it in the skin. It goes to everyone."', req:()=>!S.f.b2_jar, fx:()=>{ S.f.b2_jar = 'poured'; chain(1, 0, 'Ressan\'s water'); if (b2In('haddat')) loy('haddat', 1); }, go:'b2_jar_poured'},
        {t:'"Keep it. That\'s for her, the day it\'s worse."', req:()=>!S.f.b2_jar, fx:()=>{ S.f.b2_jar = 'kept'; if (b2In('marrow')) loy('marrow', 1); }, go:'b2_jar_kept'},
        {t:'On.', req:()=>!!S.f.b2_jar, go:()=>startExplore()}] :
      [{t:'On.', go:()=>startExplore()}]}),
  b2_jar_poured:()=>({sp:B2.elder, txt:`She unstoppers the jar and pours it into the squad's skin, carefully, the way her father poured, not a drop on the clay. It is not much. It is a skin's worth, nearly, of fifty days' mouthfuls. ${B2.younger} watches every drop go. When it is empty ${B2.elder} stoppers the jar again and gives it back to her sister, and ${B2.younger} holds it the way she always has, empty, in both arms. "He'd have sold it," ${B2.elder} says. "To the highest bidder. And then given the money away." She almost laughs.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_jar_kept:()=>({sp:B2.elder, txt:`She looks at you a long moment. Then she stoppers the jar and gives it back to ${B2.younger}, who holds it in both arms the way she always has. "He'd have said the same," ${B2.elder} says. "A water-seller keeps something back. That's the whole trade." She goes back to the cart. You hear ${B2.younger} ask her something, and ${B2.elder} say, "Not yet. Not today."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ncart:()=>({sp:'The squad\'s cart', txt:
`The squad's cart, with the stretch round it, every face turned to the skins on the tailboard. ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'}, and you can see from here how flat they are.` : 'The skins hang from the tailboard flat as leaves.'} ${chainC()} people.`,
    html:chainHTML('The Nenoth · the Dry March'),
    ch:[{t:'Drink, and sleep through the worst of the noon.', tag:'1 water', req:()=>chainW() > 0 && !S.f.b2_nenothRest && !S.f.b2_dry, fx:()=>{ S.f.b2_nenothRest = 1; dgRest('The squad lies under the cart through the worst of the noon with a mouthful each, and sleeps, or lies still, which on the Nenoth counts. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),

  /* ---- the ration: who drinks ---- */
  b2_ration:()=>{ const c = chainC(), w = chainW();
    return {sp:'Bult', scene:'b2_dry_march', fx:()=>{ S.f.b2_ration = 1; }, txt:
`Bult comes down the column at dusk on foot, leading his horse because his horse has nothing left to carry him with, and stops at every stretch, and says the same thing. When he gets to yours he says it to you.

"Three days to the hills. If there's water in the hills. The guides think there is. The guides thought there'd be cattle." He squints at your cart. "The Fist's orders. Every squad keeps what water it holds. No more is coming. Squads that hold stretches feed their stretches out of what they hold, or don't." He looks at you. "That's all the Fist says. I say the rest."

"Here's the rest." He nods at the skins. ${w ? `"${numw(w, true)} skin${w === 1 ? '' : 's'}. ` : `"No skins. `}${c} people. And a squad that has to fight the Tregyn tomorrow at noon, because they're coming, the Tregyn, for whoever looks driest." He spits, or tries to; nothing comes. "There isn't enough for both, Sergeant. There isn't enough for either. I'm not choosing for you. Nobody's choosing for anybody now."

${b2In('haddat') ? `Haddat is standing very still, looking at the stretch. ` : ''}${b2In('marrow') ? `Marrow is sitting on the tailboard with her eyes shut. ` : ''}${b2In('tangle') ? `Tangle is looking at the squad. ` : ''}${b2In('sathi') ? `Sathi is looking at the horses. ` : ''}${b2In('redblade') ? `Ramin is looking at nobody, very straight.` : ''}`,
      ch:[{t:'"The squad drinks. If we can\'t fight, nobody in the stretch lives to drink anything."', fx:()=>b2KeySquad(), go:'b2_key_squad'},
          {t:'"The stretch drinks. The squad will fight dry."', fx:()=>b2KeyColumn(), go:'b2_key_column'},
          {t:'Not yet.', go:()=>startExplore()}]}; },
  b2_key_squad:()=>({sp:'The squad\'s cart · dusk', txt:
`You say it. Nobody argues. That is the worst of it.

The stretch hears. They do not shout, or plead, or come at the cart. They have walked from Hissar; they know what a squad is for, and what a sergeant is for, and they go and sit down in the dusk round their own empty pots. ${b2Ours5() ? `${b2Ours5()} does not look at you. She is not angry. She understands. That is worse too.` : ''}

${b2In('tangle') ? `"It's right," Tangle says, very low, to nobody. "It's right. It's the sum." He does not hum. ` : ''}${b2In('sathi') ? `Sathi nods. "The riders drink first," she says. "So the herd has riders. That is the Wickan way." She does not say it the way she says most things. ` : ''}${b2In('haddat') ? `Haddat takes her share of the skin and holds it a long moment, and drinks, because you have ordered it, and then goes and sits with the stretch, and does not come back to the squad's fire. ` : ''}${b2In('marrow') ? `Marrow drinks. She does not tie anything. ` : ''}${b2In('redblade') ? `

Ramin takes his share of the skin, and walks over to the stretch with it, and gives it to the first child he comes to, and comes back. "An order I gave myself," he says, when you look at him. "Long ago. It does not change because I am thirsty." He will go into the Tregyn tomorrow in scale over chain with nothing in him. He knows it.` : ''}

${S.f.b2_marchLost ? `In the night ${numw(S.f.b2_marchLost)} of the stretch do not wake. ${b2In('haddat') ? 'Haddat has their names. She says them at the squad\'s fire, standing, before she sits down at the other one.' : 'You have their names.'}` : 'There is nobody in the stretch to go without. That is its own answer.'}`,
    html:chainHTML('The Nenoth · the night before'),
    ch:[{t:'Noon.', go:'b2_dryraid_go'}]}),
  b2_key_column:()=>({sp:'The squad\'s cart · dusk', txt:
`You take the skins off the tailboard yourself and carry them into the stretch, and give them out, a mouthful each, slowly, the way the stretch has learned, the children first, the old, then everybody, until the last skin is flat and there is nothing for the squad at all.

${b2Ours5() ? `${b2Ours5()} drinks, and looks at you over the skin, and you look away first.` : 'Nobody in the stretch says thank you. They are too busy drinking. That is the right thank you.'}

${b2In('haddat') ? `Haddat helps you give it out, and says each name as she gives it, in the quarter's Hissari. ` : ''}${b2In('marrow') ? `Marrow sits on the empty tailboard. "Good," she says. "Now none of you get stabbed tomorrow. I've nothing to wash it with." ` : ''}${b2In('tangle') ? `Tangle watches the last skin go and does a sum you can see him do, and doesn't like the answer, and doesn't say it. ` : ''}${b2In('sathi') ? `Sathi says something in Wickan, short and hard. "A herd with no riders is a meal," she says, in Malazan, when you look at her. She goes and sits with the horses. ` : ''}${b2In('redblade') ? `Ramin nods once, as if you had confirmed an order he had given himself long ago.` : ''}

${S.f.b2_marchLost ? `In the night ${numw(S.f.b2_marchLost)} of the stretch do not wake anyway. The Nenoth takes what it takes.` : 'In the night, everyone in the stretch wakes up. You count them twice.'} The squad lies with its mouths full of dust, and does not sleep much, and at dawn nobody can talk.`,
    html:chainHTML('The Nenoth · the night before'),
    ch:[{t:'Noon.', go:'b2_dryraid_go'}]}),

  /* ---- the Tregyn at noon ---- */
  b2_dryraid_go:()=>({sp:'Midday · the carts', scene:'b2_dry_march', txt:
`They come at noon, as Bult said: the Tregyn, out of the shimmer to the south, on foot and on horses, in horsehair mantles, with empty skins slung on their backs. They are not coming for the column. They are coming for the stretch with the driest look, and there it is.

${S.f.b2_dry ? `Your mouth is dust. Everybody's is. ${b2In('haddat') ? 'Haddat pulls her mail straight, and her hands are slow doing it.' : 'Hands are slow on buckles.'}` : `The squad drank this morning, a mouthful each, and it is in you, like a coal. ${S.f.b2_drankSkip === 'redblade' ? 'Ramin did not. He is very straight, and very pale under the brown, and his scale is already too hot to touch.' : ''}`}${b2Hands5() <= 3 ? `

Three of the Seventh's regulars come trotting down the line with their shields up, sent by Bult, because word has gone round that your squad is short${S.f.b2_dry ? ', and where its water went' : ''}. "Sergeant," says the older one. "Where do you want us?"` : ''}`,
    ch:[{t:'To the carts.', go:()=>startBattle('b2_dryraid', {})},
        {t:'Tangle: a burner into them as they come, first.', tag:'uses 1 burner', req:()=>b2In('tangle') && S.inv.burner > 0, fx:()=>{ S.inv.burner--; },
          go:()=>startBattle('b2_dryraid', {pre:'Tangle lobs a burner out over the carts underarm, and it bursts on the clay in front of the Tregyn, and the clay burns, and the Tregyn who run through it are not running the same way afterwards.'})}]}),

  b2_after_dryraid:()=>({sp:'The carts', fx:()=>{ if (!S.f.b2_dryDone) { S.f.b2_dryDone = 1; chain(2, 0, 'The water-carrier\'s skins'); } }, txt:
`The water-carrier goes down on the clay with his mantle over him like a tent, and his guard runs, and the Tregyn on the pan see him go and break, all at once, into the shimmer.

He brought skins to carry the stretch's water away in. Some of them were full already: water for the raid, for his men, from wherever the Tregyn get water. ${S.f.b2_dry ? 'The squad drinks from them where it stands, on its knees on the clay, and nobody is ashamed of it.' : 'The squad brings them in to the cart.'}

${b2In('haddat') ? `Haddat has one of the skins in her hands. She is not drinking from it. She is looking at the neck of it, where the leather is stamped.` : ''}`,
    ch:[{t:b2In('haddat') ? 'Haddat.' : 'Back to the column.', go:b2In('haddat') ? 'b2_sealskin' : 'b2_dusk5'}]}),
  b2_sealskin:()=>({sp:'Haddat', fx:()=>{ S.f.b2_ilharWater = 1; }, txt:
`The mark at the neck of the skin is small, pressed into the leather with a hot iron: a jar, and a wave under it, and a single letter in the old Hissari hand. You have seen it before. On jars in the water-sellers' quarter, on a doorpost, on the cup Haddat drinks from.

"My mother's house," Haddat says. She turns the skin over. "Our skins. We sold water in them for three generations. Only we used this mark." She is quite calm. "He has my mother's skins. He is filling them for Dom's tribes." She weighs it in her hand. It is full. "He was always the one who knew where the water was."

She holds it out to you, and then doesn't, and then does.

"It is water, Sergeant," she says. "Tell me what to do with it."`,
    ch:[{t:'"Water is water. Give it to the stretch."', fx:()=>{ S.f.b2_ilharSkin = 'drunk'; chain(1, 0, 'A skin from the water-sellers\' quarter'); loy('haddat', 1); }, go:'b2_sealskin_drunk'},
        {t:'"Keep it. It\'s yours. Give it back to him, if you see him."', fx:()=>{ S.f.b2_ilharSkin = 'kept'; gain('b2_sealskin'); loy('haddat', 1); }, go:'b2_sealskin_kept'}]}),
  b2_sealskin_drunk:()=>({sp:'Haddat', txt:`She carries it into the stretch herself and gives it out, a mouthful each, saying the names, and the children drink her brother's water and her mother's mark goes from hand to hand down the carts. When it is empty she rolls it up and puts it in the bottom of her kit. "He would have laughed," she says. "He always said I would come home thirsty."`, ch:[{t:'On.', go:'b2_dusk5'}]}),
  b2_sealskin_kept:()=>({sp:'Haddat', txt:`She stoppers it, and hangs it on her belt beside her own tin cup, and does not drink from it. "If I see him," she says. "At the next river. Or the one after." She looks north, where the dust is. "I will give him back his water, and tell him the column did not need it." She knows it is a lie. She will tell it anyway. It is a good lie.`, ch:[{t:'On.', go:'b2_dusk5'}]}),

  b2_dusk5:()=>({sp:'The Nenoth · dusk', scene:'b2_dry_march', txt:
`Dusk. The column stops where it stops, on the clay, and makes a camp with nothing to make it with: no wood, no water, the carts in a ring and the Wickans' horses inside it and the Seventh round the outside, facing out. Fires of dung and broken cart. The Fist's tent in the middle.

Nobody sings. Nobody has sung since the forest.

The squad goes in through the ring to the stretch's place, and sits down, and does not get up.`,
    ch:[{t:'Sit.', go:()=>{ startExplore('b2_karpcamp'); talk('b2_carriage_comes'); }}]}),
});

/* ---------------- the camp on the Nenoth: the Trygalle ---------------- */
Object.assign(B2CH5.dlg, {
  b2_carriage_comes:()=>({sp:'The Nenoth · night', scene:'b2_trygalle', fx:()=>{ S.f.b2_trygalle = 1; }, txt:
`It comes out of the air.

One moment there is the ring of carts, and the dung-fires, and the dark beyond. The next the dark beyond is shaking, the way the air shakes over the pan at noon, and then it tears, and there is a smell like a forge and a sound like a sail splitting, and a carriage comes out of the tear at a gallop with nine horses in front of it.

It is scorched black to the axles. The horses are lathered white and screaming. There are men on its roof, holding on to the rails, in armour that has been hit by a great many things, and one of them is on fire, a little, and puts it out with his hand. The carriage comes through the gap in the carts that the pickets are shouting about, and slews, and stops, twenty paces from the Fist's tent, and the air closes behind it like water.

Every Wickan bow in the camp is drawn on it.

The door opens. A man gets out: a huge man, round as a wine-jar, in silks that were good once, sweating. He looks round at the bows, and the carts, and the Seventh, and smiles, and his teeth are capped with gold, and in the gold there are diamonds, and they catch the firelight.

"Food," he says, in excellent Malazan. "And water. From the people of Darujhistan, with their compliments. Would somebody please tell these charming people to point those somewhere else."`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  /* ---- Karpolan Demesand ---- */
  b2_karpolan:()=>({sp:'Karpolan Demesand', txt:
`The huge man is standing by his carriage while his people unload it, mopping his face with a square of silk that is wetter than his face. Casks. Sacks. More casks. Wickans are carrying them away into the dark toward the carts, and the Seventh's quartermasters are following them with slates, and nobody is quite believing any of it.

He sees you watching, and turns his small bright eyes on you, and smiles with the diamonds. "A sergeant. Splendid. Karpolan Demesand, of the Trygalle Trade Guild, at your service, provided you pay." He waves a pudgy hand at the casks. "This is paid for. Not by you. By people who would be very embarrassed to be thanked, so do not trouble."

${b2In('marrow') ? `He glances at Marrow, and something in his face sharpens, the way a healer's does. "Denul," he says. "You've been reaching, madam, and getting mud. Everyone has, this year." He lowers his voice. "Something is walking in all the warrens this summer. Many somethings. We go round them. It is the only way to travel."` : ''}`,
    ch:[{t:'"Darujhistan? Why would Darujhistan care what happens to us?"', go:'b2_karpolan2'},
        {t:'Leave him to his casks.', go:()=>startExplore()}]}),
  b2_karpolan2:()=>({sp:'Karpolan Demesand', fx:()=>{ S.f.b2_karpolan = 1; }, txt:
`"Darujhistan," says Karpolan Demesand, "cares about very little that it cannot drink or wear." The diamonds glint. "Darujhistan sent the food. Darujhistan was asked to, very politely, by a gentleman with one arm who is, officially, at war with your Empress, and who wishes it known that he is not at war with you." He mops his face. "I did not say that. I am a merchant. Merchants never say anything."

Bult comes out of the Fist's tent and crooks a finger at him.

"Ah," says Karpolan. He reaches into his silks and brings out something on a chain: a little bottle of glass, smoky, the size of a thumb, that turns in the firelight and shows nothing inside it at all. "Excuse me, Sergeant. I have a delivery to make that is not food." He goes toward the tent.

You can see the tent mouth from where you stand. You see Coltaine come to it, in his black feathers, and the huge man bow, and put the chain over the Fist's head with his own pudgy hands, and say something, and tap the bottle once with a finger. Wear it, the gesture says. Always.

Coltaine looks at the bottle. He does not take it off.`,
    ch:[{t:'On.', fx:()=>{ S.f.b2_bottle = 1; }, go:()=>startExplore()}]}),
  b2_karpolan_again:()=>({sp:'Karpolan Demesand', txt:`Karpolan is sitting on his carriage step with a cup of something red that did not come from anywhere on the Nenoth, being fanned by a servant. "Sergeant." He raises the cup. "We leave before dawn. The road we came by is unpleasant to linger on. Drink while you can." He does not say what road.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the shareholders ---- */
  b2_shareholder:()=>({sp:'A Trygalle shareholder', fx:()=>{ S.f.b2_shareholder = 1; }, txt:
`One of the guards from the roof, sitting against a wheel with his helm off. His armour has been hit by everything, and some of it was not swords. There is frost in his beard, in a camp where nobody has been cool for a week, and it is melting. His left hand is wrapped in a rag that is black with something.

"Don't ask," he says, before you can. "Whatever you were going to. Don't ask what's in there, don't ask what it's like, don't ask what took my fingers." He grins with half his teeth. "Shareholders. Every guard on that carriage owns a piece of the Guild. Most of us don't live to sell it. That's the arrangement." He holds out the wrapped hand, a little. "If you've got a healer who can stand to look at this, I'd not say no."`,
    ch:[{t:b2In('marrow') ? 'Marrow.' : 'Bind it yourself, from the field kit.', go:'b2_shareholder_hand'},
        {t:'Leave him.', go:()=>startExplore()}]}),
  b2_shareholder_hand:()=>({sp:'A Trygalle shareholder', txt: b2In('marrow') ?
`Marrow sits down beside him, because Marrow sits down whenever she can, and unwraps the rag, and looks. Her face does not change. "Cold did this," she says. "Not frost. Older." She does it the slow way, needle and gut and salve, and does not reach for the warren at all. "Not for this, child. I don't know what would come back up."

He watches her work. "Thanks," he says, when she's done. "I'll put you in my will. It's a short will."` :
`You bind it the way the field kit says, as well as you can, and do not look too long at what is under the rag. He doesn't watch you do it.

"Thanks," he says. "I'll put you in my will. It's a short will."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_shareholder2:()=>({sp:'A Trygalle shareholder', fx:()=>{ S.f.b2_shareholder2 = 1; }, txt:
`A woman in battered scale on the carriage roof, with her legs dangling, counting the horses as the grooms lead them off. She gets to nine, and stops, and counts again.

"Eleven, we started with," she says to you. "Darujhistan to here. Eleven horses, eight of us on the roof." She doesn't say how many came out the other end. You can count the roof. ${b2In('tangle') ? `"Sapper?" she says to Tangle, looking at the satchel. "Moranth? We carried a crate of those once. Never again. The warrens don't like them."` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Duiker and List by the Fist's tent ---- */
  b2_duiker8:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker8 = 1; }, txt:
`The historian is sitting by a dung-fire with a cup of water from Darujhistan in both hands, looking at it as if it were a letter he could not read.

"Water," he says. "From a city on another continent, Sergeant, brought through the warrens by a fat man with diamonds in his teeth, two nights before we would have started to die." He drinks a little. "When I write this down, nobody will believe it. I'm not sure I do." He looks at the tent, where the Fist is. "He's wearing it, you know. The bottle. The trader told him always. He hasn't said what it's for. I'm not sure he knows."

He puts the cup down. "The guides say the hills tomorrow, and water in them, and the tribes all round. The Bhilard, the Tregyn, Dom behind." He frowns. "And another tribe, they say. Out there somewhere. The Khundryl. Nobody has seen them yet. Everybody is talking about them."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_list7:()=>({sp:'Corporal List', fx:()=>{ S.f.b2_list7 = 1; }, txt:
`List is beside the historian's fire with his bad foot stretched out toward it and his boot off, and for once he is not looking at anything far away.

"He's gone," he says. "Since the edge of the forest. I thought he'd follow me out here. He didn't." He wiggles his toes at the fire. "He said goodbye. At the last tree. He said we'd meet again, later, and I'd understand him better then." He thinks about that. "I didn't like how he said it."

He looks over at the Fist's tent, at the shadow on the canvas. "Funny thing. I feel better tonight than I have since Gelor. Like something's been lifted off." He laughs, a little embarrassed. "Water, probably."`,
    ch:[{t:'"Probably."', go:()=>startExplore()}]}),

  /* ---- the carts road: Ressan's jar-boy ---- */
  b2_jarboy:()=>({sp:B2_BOY, txt:
`A boy is standing at the edge of the stretch's fire, ten years old, barefoot, looking at you. You know the face. You knew it in Hissar, under the soot: the boy who carried Ressan's jars, who ran back into the quarter with your word the night the city burned.

"Sergeant." His voice has gone hoarse, like everyone's. "I've been looking. Since the river. All down the column. Every fire." He swallows. "${B2_BOY}. I'm ${B2_BOY}. You didn't ask, in Hissar. There wasn't time."

He sits down, because his legs decide for him.

"I got there," he says. "To the well. I said what you said. *The horsemen.* ${B2.elder} was already doing it. She had ${B2.younger} by the arm and she was putting her up on a horse, in front of a Crow rider, at the court gate, and then she got up behind another one, and they went." He looks at his hands. "Ressan stayed on his well. He told me to go. I ran after the horses and I lost them, and a Wickan grandmother pulled me onto her cart." He looks up. "They got out, Sergeant. I saw them get out. I don't know after that. I looked at the Vathar." He stops. "I looked."`,
    ch:[{t:'"Walk with us now. In the stretch."', tag:'+1 in the column', fx:()=>{ S.f.b2_jarboy = 'took'; S.f.b2_girlsRode = 1; chain(0, 1, B2_BOY); if (b2In('haddat')) loy('haddat', 1); }, go:'b2_jarboy_took'},
        {t:'"Go back to your grandmother. I\'ll find you. Keep looking."', fx:()=>{ S.f.b2_jarboy = 'cart'; S.f.b2_girlsRode = 1; }, go:'b2_jarboy_cart'}]}),
  b2_jarboy_took:()=>({sp:B2_BOY, txt:`He stays. Somebody in the stretch gives him a cup of Darujhistan's water, and he drinks it in one go, the way children do who have not yet learned the Chain's way, and nobody stops him. ${b2In('haddat') ? `Haddat sits down beside him and asks him about the quarter, in the quarter's Hissari, the names of streets, and he answers, and after a while he is asleep against her shield.` : 'After a while he is asleep against the cart wheel.'}

${B2.elder} and ${B2.younger} got out of Hissar on Wickan saddles. Somewhere in the column, or somewhere behind it. You keep asking. You will keep asking.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_jarboy_cart:()=>({sp:B2_BOY, txt:`He nods, the way the quarter nods at a price, and gets up, and goes back into the dark toward the Wickan wagons, not running this time. At the edge of the light he turns round. "I'll keep looking," he says. "You keep looking too."

${B2.elder} and ${B2.younger} got out of Hissar on Wickan saddles. Somewhere in the column, or somewhere behind it.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ours9:()=>({sp:b2Ours5() || 'The squad\'s people', fx:()=>{ S.f.b2_ours9 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.younger} has a cup of the trader's water and is not drinking it. She is looking into it, by the light of the fire. "It's clear," she says to you, astonished. "Look. You can see the bottom." The Nenoth's water, when there was any, was the colour of tea.

${B2.elder} laughs. You have not heard her laugh since the well court. "Drink it," she says. "It's from the other side of the world. Father would have charged double." ${S.f.b2_jar === 'kept' ? `She holds out the jar, and ${B2.younger} pours half her cup into it, very carefully, and stoppers it. "For the day there's none," she says. Her father's daughter.` : ''}` : S.f.b2_yedda ?
`${B2.widow} is sitting on her rope with a cup of the trader's water, sipping it, with her eyes shut. "Darujhistan," she says. "Where is Darujhistan, soldier?" You tell her: a long way. Across a sea. "Well," she says. "Somebody there's got manners." She gives the rest of the cup to her grandsons.` :
`The weavers' family, round the fire, with a cup of the trader's water each. The youngest is asleep with hers still in her hands. Nobody takes it off her.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the squad's cart: the water ---- */
  b2_kcart:()=>({sp:'The squad\'s cart', txt: S.f.b2_campWater ?
`The squad's cart, with Darujhistan's water on it. ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'}, full, round.` : ''} The stretch round it, asleep, most of them, with full bellies for the first time since the forest.` :
`A Seventh quartermaster is at your cart with a slate and two Wickans and a cask between them, giving it out by the skin: so many to a squad, so many to a stretch, the same to everyone, the slate says. ${S.f.b2_dry ? 'The squad has not drunk since yesterday. Nobody in it can talk.' : ''}`,
    html:chainHTML('The Nenoth · the Trygalle\'s water'),
    ch:[{t:'Take the skins. Give them out.', req:()=>!S.f.b2_campWater, fx:()=>{ S.f.b2_campWater = 1; S.f.b2_dry = 0; chain(6, 0, 'Water from Darujhistan'); }, go:'b2_kcart_water'},
        {t:'Drink, and sleep.', tag:'1 water', req:()=>!!S.f.b2_campWater && !S.f.b2_campRest && chainW() > 0, fx:()=>{ S.f.b2_campRest = 1; dgRest('The squad drinks as much as it wants, for the first time since the forest, and sleeps like the dead. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_kcart_water:()=>({sp:'The squad\'s cart', txt:
`You give it out. The stretch first, then the squad, the way it has always gone, except when it didn't. ${S.f.b2_c5_key === 'squad' ? `The stretch takes it from your hands without looking at you, and drinks, and then some of them do look at you. You let them. ${S.f.b2_marchLost ? `There are ${numw(S.f.b2_marchLost)} who are not here to drink.` : ''}` : `When it comes to the squad's turn the stretch does not let you give it out. ${b2Ours5() || 'A woman from the weavers\' street'} takes the skin out of your hands and gives it to you, first, and stands there until you drink.`}

${S.f.b2_c5_key === 'column' && b2In('marrow') ? 'Marrow drinks, and sits down, and laughs, and coughs, and laughs. ' : ''}${b2In('tangle') ? `Tangle drinks, and wipes his mouth, and counts the satchel. "${b2Count()}," he says. "And water. I'd forgotten that was a thing you could count." ` : ''}${b2In('sathi') ? 'Sathi gives Hackle his first, out of her cupped hands, before she drinks herself. ' : ''}${S.f.b2_drankSkip === 'redblade' && b2In('redblade') ? `Ramin drinks last of all, after the last child, and only a little, and then a lot.` : ''}`,
    html:chainHTML('The Nenoth · the Trygalle\'s water'),
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_kfire:()=>({sp:'A fire', txt:
`A dung-fire, low and smoky, and the Seventh round it in the dark with full cups for the first time in a week, not talking. Somebody starts to hum, a marching song, and stops, and then somebody else picks it up. Not singing. Nobody is ready to sing. Humming.

${b2In('tangle') ? 'Tangle listens to it a while. It is not his four notes. He hums along anyway.' : 'You hum along. Nobody minds.'}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Bult, and the end of the Dry March ---- */
  b2_bult8:()=>({sp:'Bult', txt:
`Bult is sitting on an upturned cask from Darujhistan, with a cup of Darujhistan's wine that he did not ask anybody's leave for, looking out past the ring of carts at the dark.

"Sergeant. Drink?" He holds up the cup. "No. You've got water. Water's better. I'm an old man, I'm allowed the worse thing." He drinks. "The hills tomorrow. Water in them, the guides say, and this time I believe them, because the Bhilard believe them, and they're all going there too. And the Tregyn. And Dom, behind." He considers the dark. "And these Khundryl, whoever they are. Everybody's going to the same water. That's how battles happen."

He looks at you sidelong. ${S.f.b2_c5_key === 'column' ? `"I heard where your skins went. You fought the Tregyn with dust in your mouths, and won." He drinks. "The Fist heard too. He said one word." He does not say which. He doesn't have to. "Count your own. Then sleep."` : `"I heard what you did with your skins. Don't look at me like that. It was right, and you'll never be sure it was, and that's how you know it was a sergeant's choice and not a priest's." He drinks. "Count your own. Then sleep."`}`,
    ch:[{t:'Count them.', go:'b2_c5_end'}, {t:'Not yet.', go:()=>startExplore()}]}),
  b2_c5_end:()=>({sp:'The Nenoth · night', scene:'b2_trygalle', txt:
`You count them.

${chainC()} in the squad's stretch, asleep on the white clay of the Nenoth with water in them. ${S.f.b2_marchLost ? `${numw(S.f.b2_marchLost, true)} fewer than when the water ran out. You have their names.` : 'All of them.'}${S.f.b2_bylan === 'took' ? ' Five from Bylan, who were nobody\'s a week ago.' : ''}${S.f.b2_jarboy === 'took' ? ` A boy called ${B2_BOY}, asleep against a wheel.` : ''} ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'} on the cart, full.` : 'No water on the cart, and it does not matter tonight.'}

${b2Away() ? `And the squad: one short, still. ${NAME(b2Away())} is in Aren by now, or ought to be, on a burned ship. You count ${b2Him(b2Away())} anyway.` : b2Hurt() ? `And the squad: all of it. ${NAME(b2Hurt())} sleeps with the wound bound tight, and does not wake when ${b2He(b2Hurt())} turns over, for the first time since the river.` : 'And the squad: all of it.'}${b2In('haddat') && S.f.b2_ilharSkin === 'kept' ? `

Haddat sleeps with her mother's skin on her belt, full, the stopper tied down.` : ''}${b2In('sathi') && S.f.b2_sathiRode ? `

Sathi is not at the squad's fire. She is at the Weasels'. You can hear her laughing from here.` : ''}

Somewhere in the dark the trader's carriage is being harnessed, quietly, to go back the way it came. In the morning it will not be there. In the morning there will be hills, and water in them, and every tribe on the Odhan going to the same water.`,
    html:chainHTML('The Nenoth · the end of the Dry March'),
    ch:[{t:'Sleep.', go:()=>chapterEnd(5, S.f.b2_c5_key || 'squad')}]}),
});
