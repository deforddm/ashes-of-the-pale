/* ============ Book Two, Chapter 4: The Day of Pure Blood ============ */
/* The Vathar Crossing. The Silanda at the ford and Gesler's marines; Dom's archers crossing upriver on ropes; Dom's envoys and Coltaine's no;
   the Nobles' Council's secret deal, which the squad finds out and cannot stop; the floating bridges and the slaughter in the ford; Sormo's death;
   the evening after (Mincer broken to the ranks, Bungle a captain, Marrow at the bottom of her warren).
   Key (S.f.b2_c4_key): 'silanda' (a hurt squadmate goes aboard the Silanda for Aren: they leave the squad and rejoin in Chapter 7, S.f.b2_silandaWho)
   or 'keep' (the hurt one stays, carrying the Vathar wound: −max health until Aren, S.f.b2_woundWho). Engine for both in 47 (b2Aboard, b2Ashore, b2Wounded).
   Nobody dies here: no mortal fights. The day is carried in the column's count, and kept far off. */

/* a squadmate's name from a flag that holds an id, or a plain fallback */
const b2Nm = (k, d) => b2Mate(S.f[k]) ? NAME(S.f[k]) : d;
/* he or she, for a squadmate named by id */
const b2He = id => ['tangle', 'redblade'].includes(id) ? 'he' : 'she', b2His = id => ['tangle', 'redblade'].includes(id) ? 'his' : 'her', b2Him = id => ['tangle', 'redblade'].includes(id) ? 'him' : 'her';
/* who the Silanda could take: the squad's hurt, never the sergeant, never the Red Blade (the company carries its own) */
const b2Cands = () => SQUAD().filter(id => b2Mate(id) && id !== 'redblade');
const b2Worst = () => { const c = b2Cands(), h = S.f.b2_hurtMost; return c.includes(h) ? h : c[0] || null; };
/* the squad's own people, for a line */
const b2Ours4 = () => S.f.b2_key === 'daughters' ? B2.elder : S.f.b2_yedda ? B2.widow : null;

/* Stormy's Way In: a marine's way past a pike. Not sorcery: it never sputters. */
Object.assign(TRICKS, {
  b2_inside:{name:'Stormy\'s Way In', ch:4, use:'fight', ab:'t_b2_inside', where:'the bank of the Vathar, with Gesler\'s marines',
    lore:'A pike is a long way of saying *stay over there*. The Falari answer is to disagree with it: hands on the shaft, shoulder down, along the wood and inside the point before the man holding it has finished being sure of himself. Then the shaft is just a stick, and the man is very close.',
    get fx(){ return `Once a fight: close on an enemy within 3 and strike at +${2 + lvT()} to hit. If it fights with a long weapon, the shaft is broken: no more reach for it this fight. Grows with level.`; }},
});
Object.assign(AB, {
  t_b2_inside:{name:TRICKS.b2_inside.name, trick:'b2_inside', desc:()=>TRICKS.b2_inside.fx,
    tiles:u=>foes().filter(f => cheb(u, f) <= 3 && sees(u, f) && (cheb(u, f) <= 1 || [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]].some(([dx, dy]) => free(f.x + dx, f.y + dy, u)))),
    run(u, x, y){ const t = unitAt(x, y); if (!t) return; AUDIO.play('step');
      if (cheb(u, t) > 1) { const at = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]].map(([dx, dy]) => ({x:t.x + dx, y:t.y + dy})).filter(p => free(p.x, p.y, u)).sort((a, b) => cheb(u, a) - cheb(u, b))[0];
        if (at) { u.x = at.x; u.y = at.y; sparks(at.x, at.y, 6, '#c8b08a', .3); } }
      const long = (t.rng || 1) > 1 || (t.sk || []).includes('reach');
      blog(`${u.name} goes in along the ${long ? 'shaft' : 'blade'}, shoulder down, the Falari way, ${long ? 'inside the point before ' + t.name + ' has finished deciding' : 'too close to be argued with'}.`);
      attack(u, t, {bonus:2 + lvT(), verb:'comes in under the guard of'});
      if (long && t.hp > 0) { t.rng = 1; t.sk = (t.sk || []).filter(k => k !== 'reach'); float(t, 'shaft broken', '#c8b08a'); blog(`The shaft goes with a crack. ${t.name} is holding a stick.`); } }},
});

/* the words this chapter adds to Book Two's glossary */
GLOSSX.dg.push(
  [4, 'The Silanda', 'A burned ship with no business floating, rowed by something the marines aboard her do not discuss. She came up the Vathar to the ford and took the Seventh\'s worst wounded down to Aren.', ()=>!!(S.f && S.f.b2_gesler)],
  [4, 'The Nobles\' Council', 'Lord Nethpara, Pullyk Alar, Lenestro, Tumlit and the others: the rich of Hissar, with their carriages and their servants, who walk with the column and complain to the historian. They do not think of themselves as refugees.', ()=>!!(S.f && S.f.b2_council)],
  [4, 'The Vathar', 'A river between the Odhan and the old forest. The column crossed it. The day it crossed has a name now, and nobody who was there says it.', ()=>S.chapter >= 4 && !!(S.f && S.f.b2_vathar)]);

const B2CH4 = {
  title:'The Day of Pure Blood', number:'Four',
  intro:{loc:'The Odhan', sub:'West of Gelor Ridge · toward the Vathar', scene:'b2_odhan_dusk', cap:'The column strung out across the Odhan at dusk, and behind it, a long way off, dust that does not settle.',
    paras:[
`After Gelor Ridge there are no more Tithansi at the tail of the column at night. There is something worse, and it does not need to come close. Korbolo Dom follows a day behind, with Reloe's broken armies put back together and a great many more besides, and he does not waste one of them on a raid.`,
`He doesn't have to. He was a Fist of the Empire. He knows how the Seventh marches, how far it can go in a day, where it will have to stop. He knows it will have to stop at the Vathar.`,
`The river is the last thing between the column and the old forest beyond it. The Foolish Dog ride ahead to find the ford. The rest of you walk.`],
    go:'On', node:'b2_c4_start'},

  areas:[
    /* 16 x 12.  . mud  , reeds  ~ the river (blocks)  - ford shallows  # steep bank  x drowned tree  W overturned wagon  c cart */
    { id:'b2_vathar_bank', title:'The Vathar · the near bank', sub:'Afternoon · the column coming down to the water', hint:'Tap ground to move · tap a figure to talk · the drowned tree at the water, the carts, Captain Lull', decor:'vathar',
      map:[ "################",
            "#####.##########",
            "#~~~~-~~~~~~~~~#",
            "#~~~~--~~~~~~~~#",
            "#---,.-,---,-x-#",
            "#.,....,...c...#",
            "#..W....,......#",
            "#.,..c.....,.,.#",
            "#......,..W....#",
            "#.,.......c..,.#",
            "#..,........,..#",
            "################" ],
      walk:'.,-', triggers:{x:'b2_bank_river', c:'b2_bank_cart', W:'b2_bank_wagon'}, start:{x:7, y:9},
      quest:()=> !S.f.b2_ropesDone ? (S.f.b2_lull4 ? 'Upriver, where the ropes are. The overturned wagon is the way along the bank.' : 'Captain Lull is looking for squads.') : !S.f.b2_c4_key ? 'The Silanda is taking the wounded.' : !S.f.b2_envoys ? 'Riders on the far bank, under a pale cloth. Go and see.' : 'Dusk. The nobles\' carriages, downstream. The overturned wagon.',
      npcs:[
        {id:'gesler', name:'Sergeant Gesler', kind:'gesler', x:6, y:5, node:()=>S.f.b2_gesler ? 'b2_gesler_again' : 'b2_gesler', show:()=>!S.f.b2_silandaGone, fresh:()=>!S.f.b2_gesler},
        {id:'stormy', name:'Corporal Stormy', kind:'stormy', x:9, y:5, node:()=>'b2_stormy', show:()=>!S.f.b2_silandaGone, fresh:()=>!S.f.b2_stormy},
        {id:'truth', name:'Truth', kind:'truth', x:4, y:6, node:()=>'b2_truth', show:()=>!S.f.b2_silandaGone, fresh:()=>!S.f.b2_truth},
        {id:'lull4', name:'Captain Lull', kind:'lull', x:12, y:7, node:()=>S.f.b2_lull4 ? 'b2_lull4_again' : 'b2_lull4', fresh:()=>!S.f.b2_lull4},
        {id:'duiker5', name:'Duiker', kind:'duiker', x:8, y:8, node:()=>'b2_duiker5', fresh:()=>!S.f.b2_duiker5},
        {id:'mincer4', name:'Captain Mincer', kind:'mincer', x:2, y:8, node:()=>'b2_mincer4', fresh:()=>!S.f.b2_mincer4},
        {id:'ours5', name:'The squad\'s people', kind:'hissari_w', x:13, y:9, node:()=>'b2_ours5', fresh:()=>!S.f.b2_ours5},
        {id:'dom', name:'A rider on the far bank', kind:'dom', x:5, y:1, node:()=>'b2_dom_far', show:()=>!!S.f.b2_envoys, fresh:()=>!!S.f.b2_envoys && !S.f.b2_domSeen} ] },

    /* 16 x 12.  the Council's carriages, downstream, at night */
    { id:'b2_carriages', title:'The Vathar · the Council\'s carriages', sub:'Night · lamps in the carriages, and harness being put on', hint:'Tap ground to move · tap a figure to talk · the squad\'s carts, when there is nothing more to do', decor:'vathar', dark:true,
      map:[ "################",
            "#~~~~~~~~~~~~~~#",
            "#~~~~~~~~~~~~~~#",
            "#---,----,---,-#",
            "#..c..c...c..,.#",
            "#.,......W.....#",
            "#..c.,..c...c..#",
            "#.....,........#",
            "#.,..W....,..x.#",
            "#.......c......#",
            "#..,.......,...#",
            "################" ],
      walk:'.,-', triggers:{c:'b2_carriage', W:'b2_night_carts', '-':'b2_night_river'}, start:{x:7, y:10},
      quest:()=> !S.f.b2_dealKnown ? 'Something is wrong with the carriages tonight.' : !S.f.b2_envoyDone ? 'The steward is going down to the water.' : !S.f.b2_tooLate ? 'Captain Lull, with what you know.' : 'The squad\'s carts. Your own people.',
      npcs:[
        {id:'steward4', name:'Lord Nethpara\'s steward', kind:'noble', x:6, y:5, node:()=>S.f.b2_steward4 ? 'b2_steward4_again' : 'b2_steward4', show:()=>!S.f.b2_envoyDone, fresh:()=>!S.f.b2_steward4},
        {id:'servants', name:'Hissari servants', kind:'hissari_m', x:11, y:7, node:()=>'b2_servants', fresh:()=>!S.f.b2_servants},
        {id:'nethpara', name:'Lord Nethpara', kind:'nethpara', x:3, y:5, node:()=>'b2_nethpara', fresh:()=>!S.f.b2_nethpara},
        {id:'pullyk', name:'Pullyk Alar', kind:'pullyk', x:12, y:5, node:()=>'b2_pullyk', fresh:()=>!S.f.b2_pullyk},
        {id:'lull5', name:'Captain Lull', kind:'lull', x:2, y:9, node:()=>'b2_lull_night', show:()=>!!S.f.b2_envoyDone, fresh:()=>!!S.f.b2_envoyDone && !S.f.b2_tooLate},
        {id:'ramin4', name:'Ramin', kind:'redblade', x:9, y:9, node:()=>'b2_ramin4', show:()=>b2In('redblade'), fresh:()=>b2In('redblade') && !S.f.b2_ramin4} ] },

    /* 16 x 12.  the ford at first light: the crossing already begun */
    { id:'b2_vford', title:'The Vathar · the ford', sub:'Dawn · forty thousand people walking into a river', hint:'Tap ground to move · tap a figure to talk · the overturned wagon, when the squad is ready', decor:'vathar',
      map:[ "################",
            "#~~~~~~~~~~~~~~#",
            "#~~~~~~~~~~~~~~#",
            "#~~-----------~#",
            "#~~-,--x---,--~#",
            "#---.---W----,-#",
            "#..,..c....,...#",
            "#.,.......c..,.#",
            "#.....,..W.....#",
            "#..c.......,...#",
            "#.,....,....c..#",
            "################" ],
      walk:'.,-', triggers:{x:'b2_ford_tree', W:'b2_ford_wagon', c:'b2_ford_cart'}, start:{x:7, y:9},
      quest:()=> !S.f.b2_robe ? 'Mincer\'s sappers are pulling on refugees\' robes. Tangle is looking at you.' : 'The overturned wagons in the shallows. Then the water.',
      npcs:[
        {id:'mincer5', name:'Captain Mincer', kind:'mincer', x:4, y:7, node:()=>'b2_robe', fresh:()=>!S.f.b2_robe},
        {id:'ours6', name:'The squad\'s people', kind:'hissari_m', x:12, y:8, node:()=>'b2_ours_ford', fresh:()=>!S.f.b2_oursFord},
        {id:'bult5', name:'Bult', kind:'bult', x:9, y:6, node:()=>'b2_bult_ford', fresh:()=>!S.f.b2_bultFord} ] },

    /* 16 x 12.  the far bank at dusk: the wood behind, the river in front, and what is in it */
    { id:'b2_farbank', title:'The Vathar · the far bank', sub:'Dusk · the edge of the old forest', hint:'Tap ground to move · tap a figure to talk · Bult, when the squad has counted', decor:'vathar',
      map:[ "################",
            "#xx..,xx..x.,xx#",
            "#.,....,...,...#",
            "#..c....W....,.#",
            "#.......,......#",
            "#.,..c.....c...#",
            "#......,.......#",
            "#--,-------,---#",
            "#~~~~~~bb~~~~~~#",
            "#~~~~~~~~~~~~~~#",
            "#~~~~~~~~~~~~~~#",
            "################" ],
      walk:'.,-', triggers:{b:'b2_wreck', c:'b2_far_cart', W:'b2_far_wagon'}, start:{x:7, y:6},
      quest:()=> !S.f.b2_orphans ? 'Children on the bank, with nobody. The carts.' : 'Bult, when the squad has counted.',
      npcs:[
        {id:'marrow4', name:'Marrow', kind:'marrow', x:4, y:4, node:()=>'b2_marrow_end', show:()=>b2In('marrow'), fresh:()=>b2In('marrow') && !S.f.b2_marrowEnd},
        {id:'tangle4', name:'Tangle', kind:'tangle', x:10, y:4, node:()=>'b2_tangle_mincer', show:()=>b2In('tangle'), fresh:()=>b2In('tangle') && !S.f.b2_bungle},
        {id:'bungle', name:'Captain Bungle', kind:'sapper', x:12, y:2, node:()=>'b2_bungle', show:()=>!b2In('tangle') || !!S.f.b2_bungle, fresh:()=>!S.f.b2_bungleMet},
        {id:'sathi4', name:'Sathi', kind:'sathi', x:2, y:2, node:()=>'b2_sathi_laugh', show:()=>b2In('sathi'), fresh:()=>b2In('sathi') && !S.f.b2_sathiLaugh},
        {id:'duiker6', name:'Duiker', kind:'duiker', x:7, y:2, node:()=>'b2_duiker6', fresh:()=>!S.f.b2_duiker6},
        {id:'ramin5', name:'Ramin', kind:'redblade', x:13, y:6, node:()=>'b2_ramin_count', show:()=>b2In('redblade'), fresh:()=>b2In('redblade') && !S.f.b2_raminCount},
        {id:'bult6', name:'Bult', kind:'bult', x:5, y:6, node:()=>'b2_bult6', fresh:()=>!!S.f.b2_orphans} ] } ],

  battles:{
    /* upriver: Dom's archers coming over the Vathar hand over hand on ropes. Kill what is ashore; then hold the stakes while the ropes are cut */
    b2_ropes:{title:'The ropes', style:'vathar', pitTxt:'the river', warrenText:'Afternoon on the Vathar · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle', hurtMost:true,
      map:["oooooooo","oooooooo","--.--.--","..,..,..","........",".t....t.","........","..,..,..","........","........"],
      party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
      foes:[['b2_domarcher',1,2],['b2_domarcher',6,2],['b2_pike',3,3],['b2_pike',4,3]], xp:90, after:'b2_after_ropes',
      waves:[{round:2, foes:[['b2_domarcher',2,2]], text:'Another archer comes up out of the river on the rope, wet to the chest, bow dry on his back, and is shooting before his feet are under him.'}],
      stage2:{title:'The stakes', xp:30,
        text:()=>`The archers who got ashore are down. The ropes are not: four of them, stretched over the Vathar from stakes on this bank to stakes on that one, and on every rope, men, hand over hand, coming.
${b2In('tangle') ? `
Tangle has his knife out. "Hemp," he says. "Wet hemp. This'll take a while." He doesn't hum. "Keep them off me."` : `
Somebody has to cut them, and somebody has to stand over whoever is cutting.`}`,
        map:["oooooooo","--.--.--","........","..t..t..","........",".,....,.","........","........","........","........"],
        party:[[3,4],[4,4],[2,5],[5,5],[3,5],[4,5]],
        foes:[['b2_domarcher',0,1],['b2_pike',4,1],['b2_ropecap',3,2]],
        objective:{type:'survive', rounds:3, text:'Hold the stakes for three rounds while the ropes are cut.'},
        waves:[{round:2, foes:[['b2_pike',6,1]], text:'A man drops off the last rope into the shallows with a pike across his back and comes up the bank with it.'}, {round:3, foes:[['b2_domarcher',1,1]], text:'One more, off a rope that is already half cut, swinging.'}]} },

    /* night, below the carriages: Dom's men come over in a boat to settle the Council's deal. The squad gets there late */
    b2_envoy:{title:'At the water\'s edge', style:'vathar', dark:true, pitTxt:'the river', warrenText:'Night on the Vathar · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["oooooooo","--------","..,..,..","...t....","........","..t..t..","........",".,....,.","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_escort',2,2],['b2_escort',5,2],['b2_domarcher',3,1],['b2_envoyoff',4,1]], xp:70, after:'b2_after_envoy',
      waves:[{round:3, foes:[['b2_escort',7,1]], text:'A second boat grounds in the shallows, and the man in its bow is already over the side.'}] },

    /* the day: the bridges come down the river into the ford. Hold the shallows; then go out onto the bridge */
    b2_bridge:{title:'The ford', style:'vathar', pitTxt:'the river', warrenText:'Morning in the ford · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      get away(){ return S && S.f && S.f.b2_robe === 'mincer' ? ['tangle'] : null; },
      map:["ooobbooo","ooobbooo","---bb---","--------","-,--t---","--------","---t--,-","--------","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_pike',3,2],['b2_pike',4,2],['b2_domarcher',3,0],['b2_domarcher',4,1],['b2_pike',1,3]], xp:160, after:'b2_after_bridge',
      /* Mincer's people in robes, among the crowd: one beside the squad, two if the squad came to the ford short (the Silanda, or Tangle with Mincer) */
      get allies(){ const n = S && S.squad ? S.squad.filter(k => k !== 'sgt' && !(this.away || []).includes(k)).length : 4; return [['b2_sapdis',6,7],['b2_sapdis',1,7],['b2_sapdis',7,6]].slice(0, n <= 2 ? 3 : n <= 3 ? 2 : 1); },
      waves:[{round:2, foes:[['b2_pike',4,1]], text:'More of them come off the bridge into the water, in good order, the way the Seventh would do it. They were taught by somebody who taught the Seventh.'},
             {round:3, foes:[['b2_domarcher',3,0]], text:'Fresh archers at the bridge\'s end. They are not shooting at the squad. They are shooting past it, into the ford, at whatever is nearest.'}],
      stage2:{title:'The bridge', xp:80, keepAllies:true,
        text:()=>`The pikemen in the shallows are down, or back on the planks. The bridge is still there: a long raft of lashed timber with a rail of pikes along it, moored somehow at the head of the ford, and its archers still working.

All down the ford the people in the water have stopped running. ${b2In('haddat') ? `Haddat sees it first. "They are climbing," she says. "Look. They are climbing it."` : 'They are climbing.'} Out of the river onto the floating bridges, hundreds of them, with their hands, with nothing, onto the pikes. Somewhere upriver a bridge tips, and goes over, and does not come up.

The one in front of you has a sergeant on it with a horsetail on his helm, and he is holding it.${S.f.b2_robe === 'mincer' ? ` Somewhere downstream there is a flat hard sound, and then another: Mincer's people, in their borrowed robes, doing something to a bridge.` : ''}${b2In('haddat') ? `

On the next bridge, the one beyond this, among the officers at the rail, there is a man who is not shooting. A green cloth on his arm. He is looking at the ford the way you look at a fire you set. Haddat has stopped moving.` : ''}`,
        map:["obbbbbbo","obbbbbbo","obbbbbbo","obbttbbo","obbbbbbo","obbbbbbo","obbbbbbo","obbbbbbo","---bb---","--------"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['b2_bridgecap',3,1],['b2_pike',2,2],['b2_pike',5,2],['b2_domarcher',4,0]],
        /* a squad that came to the ford whole gets the pikeman from the far end too */
        get waves(){ const n = S && S.squad ? S.squad.filter(k => k !== 'sgt' && !(S.f.b2_robe === 'mincer' && k === 'tangle')).length : 4;
          return n >= 4 ? [{round:2, foes:[['b2_pike',1,3]], text:'A pikeman comes back along the rail from the far end, where the people climbing out of the water have made him unwelcome.'}] : []; }} } },

  foes:{
    /* Korbolo Dom's soldiers: the rebel army as a Malazan Fist builds one. Drilled, and in no hurry */
    b2_pike:{name:'Dom\'s pikeman', sig:'p', kind:'pikeman', hp:17, ac:15, atk:4, dmg:[1,10,2], rng:1, mv:3, init:1, sk:['reach'], verb:'drives a pike at'},
    b2_domarcher:{name:'Dom\'s archer', sig:'a', kind:'rebel_bow', hp:12, ac:12, atk:4, dmg:[1,8,1], rng:6, mv:4, init:2, sk:['pin'], verb:'looses at'},
    b2_escort:{name:'Dom\'s escort', sig:'e', kind:'pikeman', hp:16, ac:15, atk:4, dmg:[1,8,2], rng:1, mv:4, init:2, sk:['parry'], verb:'cuts at'},
    /* the bosses: the rope-captain, the envoy's officer, the bridge-sergeant */
    b2_ropecap:{name:'Rope-captain', sig:'R', kind:'guran_officer', hp:30, ac:15, atk:5, dmg:[1,10,2], rng:1, mv:4, init:2, boss:true, sk:['rally'], verb:'cuts at'},
    b2_envoyoff:{name:'The envoy\'s officer', sig:'O', kind:'guran_officer', hp:28, ac:16, atk:5, dmg:[1,10,2], rng:1, mv:4, init:3, boss:true, sk:['parry','rally'], verb:'cuts at'},
    b2_bridgecap:{name:'Bridge-sergeant', sig:'S', kind:'pikeman', hp:32, ac:16, atk:5, dmg:[1,10,3], rng:1, mv:3, init:2, boss:true, sk:['reach','rally'], verb:'brings a pike round on'},
    /* ally: one of Mincer's sappers in a refugee's robe */
    b2_sapdis:{name:'Sapper in a robe', sig:'k', kind:'sapper', hp:18, ac:13, atk:4, dmg:[1,8,1], rng:4, mv:4, init:2, verb:'looses a quarrel at'} },

  gear:{
    b2_conduct:{name:'Dom\'s safe-conduct', slot:'trinket', who:null, stat:{guile:1}, line:'A square of good paper with a seal on it, the seal a Fist\'s seal with the Emperor\'s mark scraped out of it. It promises the bearer safe passage over the Vathar. It is not worth the wax.'},
    b2_pikehead:{name:'A pike-head from the ford', slot:'trinket', who:null, atk:1, line:'The iron head of a rebel pike, the shaft broken off a hand below the socket. Made in a Malazan pattern. Somebody taught them that.'} },

  scenes:{
    b2_vathar:{loc:'The Vathar', sub:'The crossing', cap:'A wide brown river at noon, a ford through it, floating bridges coming down it, and the far bank black with men.', amb:'wind'},
    b2_silanda:{loc:'The Vathar', sub:'The Silanda', cap:'A burned ship that has no business floating, low in the water in a mist of her own, her oars working in the shadow.', amb:'dark'},
    b2_after:{loc:'The Vathar', sub:'Dusk, after', cap:'The river at dusk, smoke on it, birds over it, and on the far bank a long line of the living walking on into the trees.', amb:'dusk'} },

  end:{
    silanda:['Aboard the Silanda', 'At the Vathar the Nobles\' Council made its own peace with Korbolo Dom, and in the morning the refugees went into the ford under his word, and his bridges came down the river into them. The squad knew the night before. It could not stop it. It held a piece of the ford, and broke a bridge, and counted. One of the squad was not there to count: they went down the river to Aren the day before, on a burned ship rowed by something nobody looks at, with the Seventh\'s worst hurt. They will be waiting at the end of the road. If the road has an end.'],
    keep:['Kept', 'At the Vathar the Nobles\' Council made its own peace with Korbolo Dom, and in the morning the refugees went into the ford under his word, and his bridges came down the river into them. The squad knew the night before. It could not stop it. It held a piece of the ford, and broke a bridge, and counted. Everyone in the squad who came to the river walked away from it. One of them walks carefully now, with a wound bound under the kit, and will until Aren.'] },
  endScene:'b2_after',
  endCap:()=> S.f.b2_c4_key === 'silanda' ? `Dusk on the far bank of the Vathar. The squad is one short, and the one is somewhere downriver on a ship that should not float, and nobody in the squad says that this is luck.` : `Dusk on the far bank of the Vathar. The whole squad is here. One of them sits down carefully, and gets up carefully, and does not want to talk about it.`,
  tease:'Next: the Dry March. The old forest beyond the Vathar, the Nenoth Odhan after it, and Dom\'s army growing every day.',

  extras:()=>{ const f = S.f, x = [];
    x.push(`The squad left the Vathar with ${b2Chain()}.`);
    if (f.b2_vatharLost) x.push(`The ford kept ${numw(f.b2_vatharLost)} of the squad's stretch. Haddat has their names, or the sergeant does.`);
    if (f.b2_c4_key === 'silanda' && b2Mate(f.b2_silandaWho)) x.push(`${NAME(f.b2_silandaWho)} went down the Vathar on the Silanda with the Seventh's wounded, to wait in Aren.`);
    if (f.b2_c4_key === 'keep' && b2Mate(f.b2_woundWho)) x.push(`${NAME(f.b2_woundWho)} stayed with the squad, and carries the wound from the ropes: less to give in a fight, until Aren.`);
    if (f.b2_dealKnown) x.push('The squad found out the Council\'s deal with Dom the night before the crossing, and took it to Captain Lull. It was already too late. It had been too late since the envoys left.');
    if (f.b2_conduct === 'kept') x.push('The squad keeps a safe-conduct with Korbolo Dom\'s seal on it, from the envoy\'s boat.');
    if (f.b2_heldBack === 2) x.push('The squad kept its own people out of the ford until the bridges were broken. All of them.');
    if (f.b2_heldBack === 1) x.push('The squad held some of its people back from the ford. Not all.');
    if (f.b2_bridgeCusser) x.push('Tangle put a cusser into a floating bridge\'s moorings. It is gone for good. So is the bridge.');
    if (f.b2_robe === 'mincer') x.push('Tangle went into the ford in a refugee\'s robe with Mincer\'s sappers, and came out of it with something he will not say.');
    if (f.b2_ilharSeen) x.push('Haddat saw her brother at the Vathar, at the rail of a floating bridge among Dom\'s officers. He saw her. Neither of them lifted a hand.');
    if (f.b2_marrowEnd === 'on') x.push('Marrow healed on the far bank until the warren had nothing left to give, and then a little after that.');
    if (f.b2_orphans === 'took') x.push('At dusk the squad took in children the ford had left with nobody.');
    if (f.b2_sathiLaugh) x.push('When the butterflies came up off the river, Sathi laughed, the Wickan way, and the Weasels laughed with her.');
    return x; },

  journal:()=>{ const f = S.f; return [
    f.b2_vathar && `At the Vathar Crossing Korbolo Dom offered the column safe passage, and Coltaine refused. The Nobles' Council made its own deal with Dom in secret. In the morning the refugees went into the ford, and Dom's archers and pikemen came down the river on floating bridges.`,
    f.b2_vathar && `About twenty thousand refugees died at the Vathar, and about seven hundred soldiers. The Foolish Dog Clan is fewer than five hundred.`,
    f.b2_sormoDead && `Sormo E'nath, the Seventh's chief warlock, died at the Vathar on the far bank, trying to stop it.`,
    f.b2_gesler && `A burned ship, the Silanda, came up the Vathar with three marines aboard: Sergeant Gesler, Corporal Stormy and a recruit called Truth. She took the Seventh's worst wounded down to Aren. Coltaine broke his hand on Gesler's face.`,
    f.b2_bungle && `After the Vathar Captain Mincer was broken to the ranks, and his company was given to Bungle.`,
    f.b2_ropesDone && `Dom's archers crossed the Vathar upriver on ropes before the column reached the ford. Some of the ropes were cut.`].filter(Boolean); },

  dlg:{}
};

/* ---------------- the near bank: the Silanda, the ropes, the envoys ---------------- */
Object.assign(B2CH4.dlg, {
  b2_c4_start:()=>({sp:'The Odhan · west of Gelor', scene:'b2_odhan_dusk', fx:()=>{ if (!S.f.b2_c4Start) { S.f.b2_c4Start = 1; chain(-2, -2, 'The days after Gelor'); } }, txt:
`Days. The ground goes from white to brown, and then, one morning, there is grass in it, thin and yellow, and the cattle that are left put their heads down and will not lift them.

Two of your people sat down this week and did not get up. ${b2In('haddat') ? 'Haddat has their names.' : 'You have their names.'} The rest walk. They have learned how. They walk the way the Seventh walks now, without looking at anything, with their eyes a pace ahead of their feet.

Behind the column, every evening, dust. Not riders on the skyline any more, not Tithansi. Just dust, a long way back, a great deal of it, that does not settle. ${b2In('tangle') ? `"${b2Count()}," Tangle says at the halt, and then, because the dust is there: "Not enough."` : ''}

${b2In('marrow') ? `Marrow has ${b2Knots()}.` : ''}`,
    html:chainHTML('The Odhan · toward the Vathar'),
    ch:[b2DeckChoice(4), {t:'On, to the river.', go:'b2_vathar_arrive'}]}),
  /* the reading at the evening halt (47c) */
  b2_c4_deck:()=>b2DeckOffer(4, 'b2_c4_card'),
  b2_c4_card:()=>b2DeckCard(4),

  b2_vathar_arrive:()=>({sp:'The Vathar · afternoon', scene:'b2_vathar', fx:()=>{ S.f.b2_vathar = 1; }, txt:
`The river is wide and brown and slow, and on the far side of it there are trees. Real trees, old ones, a whole dark wall of them, the first in a thousand leagues. The column comes down to the near bank in the afternoon and stops, and looks at them, the way you would look at a coast.

The Foolish Dog are already here, the ones that are left, watering their horses in the shallows. There is a ford, they say: a long pale bar of gravel under the water, waist-deep at the worst.

And there is a ship.

She is moored in the slack water under the near bank, where no ship has any reason to be, a long way from any sea. She is burned. Not scorched: burned, black to the waterline, her rail charred to the shape of teeth, and she floats anyway. There is a mist round her that the sun does not seem to reach. ${b2In('sathi') ? 'Hackle will not go within a stone\'s throw of her, and Sathi does not make him.' : 'The cattle will not go near her.'}

Three marines are sitting on her rail with their boots dangling, as if she were any ship.`,
    ch:[{t:'Down to the bank.', go:()=>startExplore()}]}),

  /* ---- Gesler, Stormy, Truth ---- */
  b2_gesler:()=>({sp:'Sergeant Gesler · Coastal Guard', fx:()=>{ S.f.b2_gesler = 1; }, txt:
`The one in the middle drops off the rail onto the bank and comes up it to meet you, unhurried. A marine sergeant: a compact, weathered man in a salt-stained leather cap, and his skin has a colour to it you have never seen on a man. Gold. Not sunburn. A faint gold, as if there were a lamp lit somewhere under it.

"Gesler," he says. "Sergeant, for the moment. Coastal Guard, once, until the coast went over to the other side." He jerks a thumb at the ship. "That's the Silanda. Don't ask."

${b2In('marrow') ? `Marrow is looking at his face, and at his hands. "Child," she says, "what happened to your skin?" Gesler grins. "Fire," he says. "Long story. I didn't burn. It's in the same story as the ship. I'm not telling it."` : `You look at his skin. He sees you looking. "Fire," he says. "Long story. Same story as the ship."`}`,
    ch:[{t:'"What\'s she doing here?"', go:'b2_gesler_ship'},
        {t:'"Can she carry wounded?"', go:'b2_gesler_ship'}]}),
  b2_gesler_ship:()=>({sp:'Sergeant Gesler', txt:
`"Floating." He considers the Silanda as if he were seeing her for the first time. "We came up this river out of somewhere I'd sooner not describe, and found your Foolish Dog, and your warlock girl, and now we're a ferry." He scratches his jaw. "She'll take wounded. She'll take a lot of wounded. Your Fist wants the worst of them down to Aren, and she's the fastest thing on this river by a distance, because she doesn't stop to sleep."

He looks at you, sidelong. "Anyone you put aboard: tell them stay on deck. Don't go below. Don't look at the rowers." A pause. "Truth looked at the rowers. Ask him how that went."

${b2In('tangle') ? `Tangle has been looking at the oars. They are moving, very slightly, in the slack water. Nobody is on the benches you can see. "Sergeant," he says quietly, "I'm going to stand over there."` : 'Her oars are moving, very slightly, in the slack water. Nobody is on the benches that you can see.'}`,
    ch:[{t:'Leave him to his ship.', go:()=>startExplore()}]}),
  b2_gesler_again:()=>({sp:'Sergeant Gesler', txt: S.f.b2_ropesDone ? `Gesler is on the bank by the Silanda's plank with a slate, chalking up names as the wagons of the wounded come down. He doesn't look up. "Worst first," he says. "If it can walk, it walks."` : `Gesler has gone back to sitting on the rail. "Lull's looking for squads," he says. "I've told him I'm not one."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_stormy:()=>({sp:'Corporal Stormy', fx:()=>{ S.f.b2_stormy = 1; }, txt:
`The big one. A Falari, by the red of the beard, which comes down to his belt, and the size of him, which comes down to everywhere. He is on the bank with a marine's shortsword and a dented shield, showing the young one something, loudly, and the young one is on his back in the mud.

"*Inside!*" Stormy is roaring. "Not *at* it. Inside it. A pike's a long way of saying stay over there, and you go *inside* it, along the wood, before the fool holding it has finished being sure of himself. Up." The young one gets up. "Again."

He sees you. "Dom's got pikes," he says, as if you'd asked. "We saw 'em from the boat. Upriver. Hundreds." He spits. "Pikes are for people who don't want to meet you. Want to learn how to meet them anyway?"`,
    ch:[{t:'"Show me." Try the Falari way in, against his shield.', check:['might',16], trick:'b2_inside', req:()=>!S.f.b2_stormyTry, fx:()=>{ S.f.b2_stormyTry = 1; },
          edges:id=>[id === 'haddat' && ['a shield-fighter knows where a shaft ends', 2], id === 'redblade' && ['a lance-man knows what a pike fears', 2], id === 'marrow' && ['she sits down halfway', -2], id === 'tangle' && ['he is folded wrong for it', -1]],
          go:'b2_stormy_yes', fail:'b2_stormy_no'},
        {t:'"Some other time, Corporal."', go:()=>startExplore()}]}),
  b2_stormy_yes:()=>({sp:'Corporal Stormy', txt:
`${by({haddat:`Haddat sets her shield and goes in along the haft he holds out, low, the boss turning the point, and is inside it before Stormy has finished the word *again*. He looks down at her. She is very close. "Huh," he says.`, redblade:`Ramin takes the haft in one hand as if it were his own broken lance and goes along it, shoulder down, and stops with his curved sword resting very lightly under the Falari's beard. "In Ehrlitan," he says politely, "we were taught this the other way round."`, _:`{who} goes in along the shaft he holds out, shoulder down, the way he showed the young one, and is inside it before Stormy has finished being sure of himself.`})}

Stormy roars with laughter and hits you on the back hard enough to loosen teeth. "*That's* it. That's the Falari way. Truth, did you see? *That's* how you meet a pike." The young one, Truth, from the mud, says he saw.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_stormy_no:()=>({sp:'Corporal Stormy', txt:
`${by({_:`{who} goes in along the shaft and the shaft comes round, and the mud comes up, and the sky is where the river was.`})}

Stormy looks down, beard first. "Close," he says, which is generous. "You went *at* it. Everybody goes at it." He hauls you up one-handed. "Watch Truth. Truth's nearly got it, and Truth's an idiot."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_truth:()=>({sp:'Truth', fx:()=>{ S.f.b2_truth = 1; }, txt:
`The young marine, the one Stormy keeps putting in the mud. A boy, nearly: eager, scraped, with the look of somebody who has seen a great deal in a short time and is still deciding which parts to believe.

"Sergeant." He says it properly, the way recruits do. "You're with the Seventh. The real Seventh. The Chain." He says the name the way the column never does, as if it were a thing in a song. "We heard about you. Before. Everyone's heard about the Chain."

He glances back at the Silanda. "She's all right, mostly. You get used to her. Only don't go below." His face does something. "There's nothing down there you need."

${b2In('sathi') ? `Sathi asks him something about the ship, in her bad Malazan, and he answers in a rush, and she listens with her head on one side. Afterwards she says: "He went into the dark under it. He saw them rowing. He says they had no heads." She considers this. "He is not lying. He is too young to lie that well."` : ''}`,
    ch:[{t:'Leave him to Stormy.', go:()=>startExplore()}]}),

  /* ---- Captain Lull: squads, upriver ---- */
  b2_lull4:()=>({sp:'Captain Lull', fx:()=>{ S.f.b2_lull4 = 1; S.f.b2_lull = 1; }, txt:
`Lull, on foot, with a bandage across the middle of his face that has gone the colour of the river, and the one eye looking out over it. He is walking down the bank collecting squads the way a man collects firewood.

"Sergeant. Good. You'll do." He points upriver with his chin. "Those marines on the burned boat went up that way this morning and saw archers coming over the Vathar on ropes. Dom's. Hand over hand, with their bows on their backs. He means to have them on this bank before we're across, in the reeds, to make the crossing interesting." The eye considers you. "Go and make it dull. Cut the ropes. Kill whoever's already over."

${b2In('marrow') ? `Marrow is looking at the bandage. "That wants changing, Captain." "It wants a face under it," Lull says. "Later."` : ''}`,
    ch:[{t:'"Sir."', go:()=>startExplore()}]}),
  b2_lull4_again:()=>({sp:'Captain Lull', txt: S.f.b2_ropesDone ? `Lull is by the Silanda's plank, watching the wounded go aboard with the one eye. "Ropes," he says, "dull. Good."` : `"Upriver, Sergeant," Lull says, without turning round. "Along the bank past the wagon. You'll see the ropes. You'll see what's on them."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_bank_wagon:()=>({sp:'An overturned wagon', txt: !S.f.b2_lull4 ?
`A wagon gone over in the reeds at the bank's edge, wheels up. Beyond it the bank goes on upriver, and the reeds get thick. Captain Lull is down the bank, looking for squads.` : S.f.b2_ropesDone ? (S.f.b2_envoys ? `The overturned wagon, and beyond it the bank going downstream toward the nobles' carriages, where the lamps are being lit. It is nearly dark.` : `The overturned wagon. Upriver the ropes hang slack in the water from their stakes.`) :
`The overturned wagon, and the bank going on beyond it upriver, the reeds thick and tall. A long way up, over the water, you can see them now: lines across the river, low, dark, sagging, and on the lines, small dark shapes, moving.`,
    ch:[{t:'Along the bank, quietly.', req:()=>!!S.f.b2_lull4 && !S.f.b2_ropesDone, go:'b2_ropes_go'},
        {t:'Downstream, to the carriages.', req:()=>!!S.f.b2_envoys, go:'b2_to_night'},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_ropes_go:()=>({sp:'Upriver', txt:
`The reeds are taller than a man, and the mud between them is soft, and you go through them in a file with your weapons held up out of it.

Then the reeds thin, and there is a stretch of open bank, and the ropes: four of them, from stakes driven into this bank, sagging across the whole width of the Vathar to stakes on the far one. On the near bank, among the stakes, a dozen archers already over, wet to the waist, stringing their bows. On the ropes, more. ${b2In('sathi') ? 'Sathi has an arrow on the string before you see them.' : ''}`,
    ch:[{t:'Into them.', go:()=>startBattle('b2_ropes', {})},
        {t:'Sathi and Hackle through the reeds first, to the archers\' flank.', check:['guile',15], req:()=>b2In('sathi'),
          edges:id=>[id === 'sathi' && ['Hackle knows reeds', 2], id === 'redblade' && ['spurs', -2]],
          go:'b2_ropes_quiet', fail:'b2_ropes_loud'},
        {t:'Tangle\'s sharper into the stakes first.', tag:'uses 1 sharper', req:()=>b2In('tangle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; S.f.b2_ropesSharper = 1; }, go:()=>startBattle('b2_ropes', {pre:'Tangle\'s sharper goes into the stakes in a flat bright crack, and two of the ropes go slack, and the men on them go into the Vathar.', surprise:'p'})}]}),
  b2_ropes_quiet:()=>({sp:'The reeds', txt:`${by({sathi:`Sathi and the dog go into the reeds and are gone. A breath. Then an archer at the end of the line sits down, and the one beside him turns round into Hackle.`, _:`{who} goes into the reeds with Sathi and the dog. A breath. At the end of the line, an archer sits down without a sound.`})}`, ch:[{t:'Now.', go:()=>startBattle('b2_ropes', {surprise:'p'})}]}),
  b2_ropes_loud:()=>({sp:'The reeds', txt:`A heron goes up out of the reeds in front of Sathi, enormous, shouting, and every archer on the bank turns round at once. ${b2In('sathi') ? 'Sathi says the word in Wickan that makes Hissari wince.' : ''}`, ch:[{t:'In, before they nock.', go:()=>startBattle('b2_ropes', {})}]}),

  b2_after_ropes:()=>({sp:'Upriver', fx:()=>{ S.f.b2_ropesDone = 1; }, txt:
`The last rope goes with a sound like a bowstring, and drops into the Vathar, and the men on it go with it. Some of them swim. The current is slow. The far bank is a long way off.

You stand on the near bank among the cut stakes, breathing. Your hands are shaking a little, the way they do after, and you notice it, and they stop.

Then you count the squad, the way you always do${b2Worst() ? `, and you stop counting at ${NAME(b2Worst())}` : ''}.

${b2Worst() ? `An arrow. ${b2He(b2Worst()) === 'he' ? 'He' : 'She'} took it early, from a man on a rope, and went on fighting with it in, the way you're not supposed to, and now ${b2He(b2Worst())} is sitting on the bank with ${b2His(b2Worst())} back against a stake and a face like paper. ${b2In('marrow') && b2Worst() !== 'marrow' ? `Marrow is already there. She looks at the wound, and at you. "I can close the top of it," she says. "Not the bottom. Not with this warren." A pause. "There's a ship."` : `Nobody in the squad can close it. There's a ship.`}` : `Nobody is down. Nobody is unhurt either.`}`,
    ch:[{t:'Carry them back to the ford.', go:'b2_punch'}]}),

  /* ---- the Silanda takes the wounded; Coltaine and Gesler ---- */
  b2_punch:()=>({sp:'The Silanda\'s plank', scene:'b2_silanda', txt:
`At the ford the column has come down to the water, all of it, and the wagons of the wounded are lined up on the bank by the Silanda, and Gesler is at the plank with his slate, and Coltaine is there.

The Fist is on foot, in his black crow-feather cloak, watching the wounded go aboard. Lull is with him, and Bult. Lull is saying something to Gesler. You are close enough to hear it: a captaincy, a company, the Seventh needs officers. Gesler is saying no. He says it several ways. Then he says something about Bult, not loudly, that makes the marines on the plank go very still.

Coltaine hits him.

Once, in the face, without any warning at all, the way you'd swat a fly. Gesler's head goes back and comes forward again and he does not fall down. He blinks. There is a little blood at his nose. Coltaine shakes his hand once and looks at it, with no expression, the way he looks at everything.

"Good," Bult says, to nobody, and laughs.

Gesler wipes his nose with the back of his wrist and goes back to his slate.${b2In('sathi') ? `

Sathi, at your elbow, very low: "The Fist broke his hand on that one's face." She sounds impressed by both of them. "That one is not all a man any more, Sergeant. Nil says so. His blood is old."` : ''}`,
    ch:[{t:'Your own wounded.', go:'b2_silanda_who'}]}),
  b2_silanda_who:()=>{ const c = b2Cands(), d = b2Worst();
    return {sp:'Sergeant Gesler', txt: d ?
`Gesler looks at ${NAME(d)}, and at the arrow-wound, and at you.

"Room for one more of yours," he says. "Down the river. Aren in a few days, at the rate she goes; a proper healer at the end of it, if Aren's got any left." He makes a mark on his slate and holds the chalk over it. "Or keep ${b2Him(d)}. ${b2He(d) === 'he' ? 'He' : 'She'}'ll walk, likely. Bind it tight and ${b2He(d)}'ll walk all the way to Aren with it, and fight on it too, and it'll take something out of ${b2Him(d)} every day ${b2He(d)} does." He shrugs. "Your call, Sergeant. They always are."

${c.length > 1 ? 'The squad is watching you. Nobody says anything.' : ''}${b2In('marrow') && d !== 'marrow' ? ` Marrow says, very quietly: "The ship, child. If it were mine to say."` : ''}${b2In('haddat') && d !== 'haddat' ? ` Haddat says nothing at all, which is how you know she agrees with whoever is speaking.` : ''}` :
`Gesler looks at the squad, and at you, and makes no mark on his slate. "Nobody of yours bad enough," he says. "Good. Keep it that way."`,
      ch: d ? [
        {t:`Put ${NAME(d)} aboard.`, fx:()=>{ S.f.b2_c4_key = 'silanda'; b2Aboard(d); }, go:'b2_aboard'},
        {t:'Someone else goes. Not the one with the arrow.', req:()=>c.length > 1, go:'b2_silanda_other'},
        {t:`Keep ${NAME(d)}. Bind it, and walk.`, fx:()=>{ S.f.b2_c4_key = 'keep'; S.f.b2_woundWho = d; loy(d, 1); }, go:'b2_keep'}] :
        [{t:'On.', fx:()=>{ S.f.b2_c4_key = 'keep'; }, go:'b2_silanda_off'}]}; },
  b2_silanda_other:()=>{ const d = b2Worst(), o = b2Cands().filter(k => k !== d);
    return {sp:'Sergeant Gesler', txt:
`"Someone else." Gesler doesn't ask why. He has been a sergeant a long time. "Then the one with the arrow walks with it, and someone with something worse that doesn't show goes down the river." He waits.

You know which of them it is. Everybody has something by now. Some of it shows.`,
      ch:[...o.map(k => ({t:`${NAME(k)}.`, fx:()=>{ S.f.b2_c4_key = 'silanda'; S.f.b2_silandaOther = 1; b2Aboard(k); }, go:'b2_aboard'})),
          {t:`No. ${d ? NAME(d) : 'The hurt one'} goes.`, req:()=>!!d, fx:()=>{ S.f.b2_c4_key = 'silanda'; b2Aboard(d); }, go:'b2_aboard'},
          {t:'Back.', req:()=>!d && !o.length, go:'b2_silanda_who'}]}; },
  b2_aboard:()=>{ const w = S.f.b2_silandaWho, n = b2Nm('b2_silandaWho', 'They');
    return {sp:'The Silanda', scene:'b2_silanda', txt:
`${n} goes up the plank on ${S.f.b2_silandaOther ? 'their own feet' : 'two marines\' shoulders'}, and turns at the top, on the burned deck, in the mist, and looks back at the squad.

${w === 'haddat' ? `Haddat stands very straight, the way she stands to report. "Sergeant." In Hissari, so it sounds like an oath. Then, in Malazan, because it matters: "The names. The column's names. You have them. Say them at night." She does not look away until the mist takes her.` :
  w === 'sathi' ? `Sathi does not want to go. She says so, in Wickan, at length, to Gesler, who does not understand a word and nods at all of it. Hackle goes up the plank after her without being called, and lies down across her feet on the black deck, and the marines let him. "Tell the clan," she says to you, last of all, in Malazan. "Tell them I did not ride away. Tell them I was carried."` :
  w === 'tangle' ? `Tangle unbuckles the satchel and holds it out to you. "${b2Count()}," he says. "Count it out loud. Every halt. I'll know." Then, quieter: "Don't let anyone throw it who doesn't know how." He looks down the deck, at the oars, and away again, fast. "I'm going to stand very still the whole way."` :
  w === 'marrow' ? `Marrow lowers herself onto a coil of charred rope on the deck, because Marrow sits down whenever she can. "Child," she says. "You'll be without a healer. Don't be stupid." She holds up the knotted string. "I'll keep count from Aren. Bring me some knots."` :
  `${n} lifts a hand. That's all.`}

Gesler pulls in the plank. Nobody casts off. The oars go into the water by themselves, slow, all together, and the Silanda turns out into the Vathar with her mist round her and goes away down the river faster than the current, and nobody on the bank says anything until she is out of sight.${w === 'sathi' && b2In('haddat') ? `

Haddat says, after a while: "The dog will look after her." It is the kindest thing you have heard her say about the dog.` : ''}`,
      ch:[{t:'Back to the bank.', go:'b2_silanda_off'}]}; },
  b2_keep:()=>{ const w = b2Mate(S.f.b2_woundWho) ? S.f.b2_woundWho : null, n = b2Nm('b2_woundWho', 'The hurt one');
    return {sp:'The bank', txt:
`"Keep ${w ? b2Him(w) : 'them'}," you say, and Gesler shrugs and turns to the next wagon.

${w === 'marrow' ? `Marrow binds her own wound, sitting down, with her teeth and one hand, and will not let anyone help. "A healer who goes down the river leaves her squad without one," she says. "I've seen what you lot do to yourselves." She ties the bandage off. She does not tie a knot in the string.` :
  b2In('marrow') ? `Marrow binds it. She does it slowly, and tightly, and reaches into the warren once, and gets back something thin, and closes the top of the wound with it and no more. "It'll hold," she says. "It'll hurt every day. ${w ? `${NAME(w)} will be less in a fight, until somebody with a clean warren gets at the bottom of it.` : ''}" She doesn't tie a knot.` :
  `You bind it yourself, tight, the way the field kit says. It will hold. It will hurt every day.`}

${w === 'haddat' ? `Haddat stands up on it as soon as it is bound, and picks up her shield, and says nothing about it, then or ever.` : w === 'sathi' ? `Sathi laughs at it, the Wickan way, high and short, and then has to sit down again. Hackle licks the bandage until she pushes his nose away.` : w === 'tangle' ? `Tangle gets up, and sits down, and gets up. "Right," he says. "${b2Count()}. And one hole in me. Count it."` : w === 'marrow' ? '' : `${n} gets up on it. That will have to do.`}

The Silanda goes away down the river with her mist round her and her oars working by themselves, and nobody on the bank watches her go for long.`,
      ch:[{t:'Back to the bank.', go:'b2_silanda_off'}]}; },
  b2_silanda_off:()=>({sp:'The Vathar · late afternoon', fx:()=>{ S.f.b2_silandaGone = 1; }, txt:
`Where the burned ship was moored there is only slack water, and a little mist on it that takes a long time to go.

The rest of the column is coming down to the bank behind you, all of it, forty thousand people and what cattle are left and the nobles' carriages, and spreading out along the river to look at the far side. Nobody is crossing. The Fist has not said cross.

${b2In('haddat') ? `Haddat is looking across the water. "Riders," she says. "On the far bank. Under a pale cloth." She frowns. "They want to talk."` : 'On the far bank, riders are coming down to the water under a pale cloth.'}`,
    ch:[{t:'Go and see.', go:'b2_envoys'}]}),

  /* ---- Dom's envoys, and the Fist's answer ---- */
  b2_envoys:()=>({sp:'The ford · dusk', scene:'b2_vathar', fx:()=>{ S.f.b2_envoys = 1; S.f.b2_council = 1; }, txt:
`They come over the ford in the last of the light, a handful of riders with the pale cloth on a lance, and stop in the shallows on this side: officers of Dom's, in good armour, very correct. One of them speaks for the rest. In Malazan. Good Malazan, a Quon accent under it.

You cannot hear all of it from where the squad stands. You hear enough. Korbolo Dom offers the column safe passage over the Vathar. The refugees may cross unharmed. The army must stay on this bank and surrender its arms.

Then the nobles are there. You did not see them come down: a knot of them, out of the carriages, in silk gone grey with the march, pushing through to the Fist. A fat man sweating through his collar, talking fast. A thin one beside him, talking less. They want it. They want the safe passage. You can hear the fat one from here: *civilised*, he keeps saying. *A civilised offer.*

Coltaine listens to all of it. His hand is bound up in a strip of cloth.

Then he says one word, and turns his back on the envoys, and walks away up the bank. You don't need to hear the word.

${b2In('haddat') ? `"No," Haddat says, very quietly, translating nothing.` : ''}${b2In('redblade') ? ` Ramin lets out a breath. "Good," he says. "In Ehrlitan, men who offer that much are selling something else."` : ''}`,
    ch:[{t:'Watch the envoys go.', go:()=>startExplore()}]}),
  b2_dom_far:()=>({sp:'The far bank', fx:()=>{ S.f.b2_domSeen = 1; }, txt:
`You wade out into the ford to the knees, as far as the pickets let anyone go, and look.

The envoys have gone back over. On the far bank, at the edge of the trees, a rider sits a big horse and watches them come. A broad man, dark, with a blue cast to the dark that is the Napan in him, in Malazan-cut armour with every badge taken off it, so that the leather is paler in patches where the Empire used to be. He does not have the look of a man waiting for an answer. He has the look of a man who already has one, and is not offended by it.

${b2In('sathi') ? `"Who is that?" Sathi says.` : ''} Bult, on the bank behind you, answers without being asked. "Korbolo Dom." He spits in the river. "Look at him. Sitting a horse like a Fist. He was a good one." He turns away. "That's the worst of it."`,
    ch:[{t:'Back to the bank.', go:()=>startExplore()}]}),
  b2_to_night:()=>({sp:'The bank · night', txt:
`Night comes down over the Vathar. The column camps along the near bank in a line leagues long, and lights its fires, and looks at the far bank, where there are more fires than there are stars.

Downstream, the nobles' carriages have drawn up in a ring by the water, with their lamps lit. ${b2In('haddat') ? 'Haddat is looking at them. "They are harnessing the mules," she says. "At night. Why harness mules at night?"' : 'Somebody down there is harnessing mules. At night.'}`,
    ch:[{t:'Down to the carriages.', go:()=>{ startExplore('b2_carriages'); talk('b2_carriages_arrive'); }}]}),

  /* ---- the bank, the cart, the squad's people ---- */
  b2_bank_river:()=>({sp:'The Vathar', txt: S.f.b2_vatharWater ?
`The river, wide and brown and slow, and full of the column: cattle to their bellies, children to their knees, women filling every pot they have. ${S.f.b2_envoys ? 'On the far bank, fires.' : 'On the far bank, the trees.'}` :
`A whole river. After the Odhan it is hard to look at. It just goes on being there, wide and brown and slow, and nobody is standing over it with a stave.

Your people go down into it to the knees and fill everything.`,
    ch:[{t:'Fill the skins.', req:()=>!S.f.b2_vatharWater, fx:()=>{ S.f.b2_vatharWater = 1; chain(4, 0, 'The Vathar'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_bank_cart:()=>({sp:'The squad\'s cart', txt: S.f.b2_bankRest ? `The squad's cart. ${chainW() > 0 ? `The skins hang on it: ${numw(chainW())}.` : 'The skins hang on it, flat.'}` :
`The squad's cart, in the reeds, with the stretch round it. ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'} on the tailboard.` : 'No water at all, with a river ten paces off.'} ${chainC()} people, some of them already asleep where they stopped.`,
    html:chainHTML('The Vathar · the near bank'),
    ch:[{t:'Drink, and rest an hour.', tag:'1 water', req:()=>chainW() > 0 && !S.f.b2_bankRest, fx:()=>{ S.f.b2_bankRest = 1; dgRest('The squad drinks river water, as much as it wants, for the first time since the P\'atha, and sleeps an hour in the reeds. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_ours5:()=>({sp:b2Ours4() || 'The squad\'s people', fx:()=>{ S.f.b2_ours5 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.younger} is standing in the shallows up to her knees holding the jar, looking at the trees on the far side as if they might be a trick. ${B2.elder} is watching her from the bank.

"She has never seen a tree," ${B2.elder} says. "Not one like that. Not a whole wall of them." She smiles, which you do not see her do often. "She asked me if there would be water in the forest. I said yes. I don't know." She looks at you. "Is there?"` : S.f.b2_yedda ?
`${B2.widow} is sitting on her rope by the water with her feet in it and her eyes shut, and her grandsons are throwing mud at each other in the shallows, and she is letting them.

"Forty years in Hissar," she says, without opening her eyes, "I never once put my feet in a river." She wriggles her toes. "If the gods want me tomorrow, soldier, they can have me with clean feet."` :
`A family from the weavers' street, sitting on the bank with their feet in the water, not talking. The youngest is asleep across her mother's knees. "Tomorrow," the mother says. "Over there. Into the trees. And then?" You don't have an answer. She doesn't seem to need one.`,
    ch:[{t:'Leave them be.', go:()=>startExplore()}]}),

  /* ---- Duiker and Mincer, before ---- */
  b2_duiker5:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker5 = 1; S.f.b2_duiker = 1; }, txt:
`The historian rode ahead with the Foolish Dog and has been here since morning. He is sitting on a stone by the water with his notebook on his knee, writing nothing.

"I counted them," he says, before you can say anything. "The Foolish Dog. Coming down to the river. Five thousand went up the ramp at Gelor." He closes the notebook. "Don't ask me what I counted."

He looks at the far bank, at the trees. "Dom will be over there by now. Some of him. He'll have read the same maps we have. Every map in Seven Cities says the column must cross at this ford." He takes his spectacles off and rubs his eyes. "Sergeant, I have read a great many histories of armies at rivers. They are not, on the whole, cheerful reading."`,
    ch:[{t:'"Then don\'t read them, sir."', go:'b2_duiker5b'},
        {t:'Leave him.', go:()=>startExplore()}]}),
  b2_duiker5b:()=>({sp:'Duiker', txt:`He laughs, a short tired bark. "I'm writing one, Sergeant. That's worse." He puts the spectacles back on. "${S.f.b2_duikerTold3 ? 'Your column\'s in it. Every name. I keep it in the front, where I can find it.' : 'You still owe me a column.'}"`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_mincer4:()=>({sp:'Captain Mincer', fx:()=>{ S.f.b2_mincer4 = 1; }, txt:
`Mincer is sitting on an upturned bucket with his slate, as he always is, and his company round him, what is left of it after the ramp, mending shields.

"Sergeant." He makes a mark. "${b2In('tangle') ? `I've your man's name on here twice. Once for Sekala, once for Gelor. Don't make me write it a third time.` : `Your sapper's on the ship. I heard. Good. One I don't have to count.`}" He looks at the river. "Fords. I hate fords. You can't pave this one, and there's nothing left to blow it with."

${b2In('tangle') ? `Tangle squats beside him. They do not talk. After a while Mincer holds out the slate and Tangle reads it, and hands it back, and says, "You're short," and Mincer says, "I'm always short," and that is the whole of it.` : ''}`,
    ch:[{t:'Leave him to his slate.', go:()=>startExplore()}]}),
});

/* ---------------- night: the Council's carriages, and the deal ---------------- */
Object.assign(B2CH4.dlg, {
  b2_carriages_arrive:()=>({sp:'The Council\'s carriages · night', scene:'b2_vathar', txt:
`The nobles' carriages stand in a ring on the bank below the ford, gilt gone dull, wheels caked to the hubs, with lamps lit in the windows. Inside the ring there are more servants than the Seventh has cooks, and every one of them is working.

They are packing. Not the way the column packs in the morning, slow and half-asleep. Fast, and quiet, in the dark, with the lamps turned low: chests roped, mules harnessed, the good horses brought in from the lines and put to the traces.

${b2In('haddat') ? `Haddat watches the servants a long while. "They are Hissari," she says. "From the old families' houses. I know how they work when the master is afraid." A pause. "This is how they work when the master is afraid."` : 'You have seen people pack like that before. In Hissar, the night it burned.'}`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  /* ---- the steward, who wrote the sergeant's name down at Dryj ---- */
  b2_steward4:()=>({sp:'Lord Nethpara\'s steward', fx:()=>{ S.f.b2_steward4 = 1; }, txt:
`A man in a good coat gone grey, with a ledger under his arm and a lantern in his hand, going from carriage to carriage with a list. ${S.f.b2_stewardWon ? `You know him. Dryj Spring, the deep water, the line of men with staves.

He knows you too. He stops. "Sergeant." He opens the ledger, without looking down, to a page he does not need to find, and turns it so that you can see a name written very carefully near the top. Yours. "I said the Council would hear of it. The Council has heard of a great many things, Sergeant. It is about to stop hearing of them."` : `Lord Nethpara's steward: you have heard of him, the man who stood over Dryj Spring with a ledger.

He looks at you the way he looks at mules. "The Council's affairs are the Council's," he says. "Good night, soldier."`}

He is sweating. It is not a warm night.`,
    ch:[{t:'"Where is the Council going in the dark?"', check:['wits',14], edges:id=>[id === 'haddat' && ['she has watched men like him lie for years', 2], id === 'sgt' && ['six years of garrison paperwork', 1], id === 'redblade' && ['Ehrlitan merchants sweat the same way', 1]],
          go:'b2_steward4_slip', fail:'b2_steward4_shut'},
        {t:'Let him go about his business. Watch where it takes him.', go:'b2_steward4_watch'}]}),
  b2_steward4_slip:()=>({sp:'Lord Nethpara\'s steward', fx:()=>{ S.f.b2_dealHint = 1; }, txt:
`"Going?" He laughs, too high. "The Council is going nowhere, Sergeant. The Council is going exactly where the Fist goes. Over the river." His eyes go, once, all on their own, to the water below the carriages, where it is very dark, and back. "At first light. Like everyone. Under..." He stops.

"Under what?" you say.

He closes the ledger. "Good night, Sergeant." He goes off between the carriages with the lantern, quickly, toward the river.`,
    ch:[{t:'Let him go. Follow the lantern.', go:()=>startExplore()}]}),
  b2_steward4_shut:()=>({sp:'Lord Nethpara\'s steward', txt:`"Where the Fist goes, Sergeant. Where else?" He is already walking away. He takes the lantern with him, between the carriages, toward the river, not toward the Fist's tent.`, ch:[{t:'Watch the lantern.', go:()=>startExplore()}]}),
  b2_steward4_watch:()=>({sp:'The carriages', txt:`You let him go. He goes from carriage to carriage with the list, and at the last one he turns the lantern down to a thread and goes out of the ring, not toward the Fist's tent, but down the bank, toward the water.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_steward4_again:()=>({sp:'The carriages', txt:`The steward is gone from the ring. Down by the water, below the carriages, a lantern turned low.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the servants, in Hissari ---- */
  b2_servants:()=>({sp:'Hissari servants', fx:()=>{ S.f.b2_servants = 1; }, txt:
`Three of the Council's servants are roping a chest by a carriage wheel: a grey woman and two young men, Hissari, talking low in the old families' dialect while they work, the way servants talk when they think nobody who matters can understand them.

${b2In('haddat') ? `Haddat goes and helps with the rope. She doesn't say anything. After a while, in the same dialect, she says something about the weather, and the grey woman answers, and then they are talking, all four of them, quietly, with the rope going round and round the chest.` : `You speak gutter Hissari. Not this Hissari. But near enough to follow.`}`,
    ch:[{t:b2In('haddat') ? 'Let Haddat talk to them.' : 'Talk to them in their own tongue.', check:['guile',13], edges:id=>[id === 'haddat' && ['their own dialect', 3], id === 'sgt' && ['gutter Hissari', 1], id === 'redblade' && ['they hate a Red Blade more than a Malazan', -2]],
          go:'b2_servants_talk', fail:'b2_servants_shut'},
        {t:'Leave them to their rope.', go:()=>startExplore()}]}),
  b2_servants_talk:()=>({sp:'Hissari servants', fx:()=>{ S.f.b2_dealKnown = 1; if (b2In('haddat')) loy('haddat', 1); }, txt:
`${b2In('haddat') ? `Haddat comes back to you with her face very still, and tells it in Malazan, flatly, the way she reports.` : 'It comes out a piece at a time, under the noise of the rope.'}

"The masters have made a peace. Their own. With the one across the river." The grey woman had said it like a woman telling a price. "Their people go over at first light, under his word, and nobody touches them. The steward has the papers. He went down to the boat for the last of them." A pause. "Anyone may follow, the masters say. Dom's word covers anyone who crosses with the Council. They are proud of that. They think it is generous."

${b2In('haddat') ? `"I asked her if she believed it," Haddat says. "She said she was a servant. She said servants believe what they are told until they are drowned."` : 'The grey woman looks at you as you go. She does not say whether she believes it.'}`,
    ch:[{t:'The boat. Down to the water.', go:()=>startExplore()}]}),
  b2_servants_shut:()=>({sp:'Hissari servants', txt:`The talk stops when you come near, and the rope goes round the chest in silence, and the grey woman looks at you with no expression whatsoever, the way the old families' servants have looked at soldiers for three hundred years. But one of the young men glances at the water, below the carriages, before he can stop himself.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Nethpara and Pullyk Alar ---- */
  b2_nethpara:()=>({sp:'Lord Nethpara', fx:()=>{ S.f.b2_nethpara = 1; S.f.b2_council = 1; }, txt:
`The fat one from the parley, on a folding stool by his carriage step, with a servant fanning him though it is night. Lord Nethpara. He is sweating through good silk, and he has a cup of something in his hand, and he looks at you as if you were weather.

"A soldier." He sighs. "Another one. Have you come to tell me how brave the Fist is? I know how brave the Fist is. He is so brave he will march forty thousand civilised people into the grave for his pride, and call it war." He drinks. "Korbolo Dom was a Fist of the Empire, soldier. A man of breeding, of a kind. He offered terms. Terms. Do you know how rare that is, in this country?"

${b2In('haddat') ? `Haddat, very quietly, in Hissari: "He is drunk with fear." Then, in Malazan, louder: "My lord." Only that. Nethpara does not understand why it frightens him.` : ''}`,
    ch:[{t:'"Is there a deal, my lord?"', go:'b2_nethpara2'},
        {t:'Say nothing. Walk away.', go:()=>startExplore()}]}),
  b2_nethpara2:()=>({sp:'Lord Nethpara', fx:()=>{ S.f.b2_dealHint = 1; }, txt:
`"A *deal*." He goes red, and then very pale, and the cup shakes. "How dare you. I am a member of the Council. I do not make *deals* with rebels, I..." He stops. He looks past you, at the river. "Go away, soldier. Go and die for the Fist. Somebody should."

${b2In('redblade') ? `Ramin, as you go: "In Ehrlitan, Sergeant, when a rich man says *how dare you*, it means *yes*." He says it without heat. He has seen this before.` : 'It is the most honest thing he has said.'}

You do not touch him. You are a soldier of the Seventh, and he is what the Seventh is marching for, and both of you know it.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_pullyk:()=>({sp:'Pullyk Alar', fx:()=>{ S.f.b2_pullyk = 1; S.f.b2_council = 1; }, txt:
`The thin one. He is standing by his own carriage, watching his servants rope a chest, with his hands folded behind him. He is the only man in the ring who is not sweating.

"Sergeant." He has a cool, precise voice, a clerk's voice. "${S.f.b2_stewardWon ? `The squad from Dryj Spring. Nethpara's man has your name. He is very proud of having it.` : `Of the Seventh. One of the Fist's.`}" He considers you. "You will want to say something to me about duty. Please don't. Soldiers are paid to die, Sergeant. That is the arrangement. We are not, and we have decided not to." He smiles, thinly. "If you lay a hand on a member of the Council, the Fist will hang you himself. He needs us more than he knows. Somebody has to be grateful to him in Aren."`,
    ch:[{t:'"Somebody will be, my lord. It won\'t be you."', go:'b2_pullyk2'},
        {t:'Turn your back on him.', go:()=>startExplore()}]}),
  b2_pullyk2:()=>({sp:'Pullyk Alar', txt:`He inclines his head, as if you had made a point in a debate he had already won. "Good night, Sergeant." He turns back to his chest. Over his shoulder, mildly: "Do try to be on the near bank in the morning."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Ramin, by the carriages ---- */
  b2_ramin4:()=>({sp:'Ramin', fx:()=>{ S.f.b2_ramin4 = 1; loy('redblade', 1); }, txt:
`Ramin is standing at the edge of the ring very straight, looking at the carriages the way you'd look at a tavern you once lost a fight in.

"In Ehrlitan," he says, "the winter the company cleared the market, there were men like these. In carriages. They watched from the hill." He doesn't go on about the market. He never does. "They had paid for it, you understand. They were watching what they had paid for."

He turns his back on the carriages, deliberately, as a Red Blade turns his back on a thing beneath notice. "These ones have paid for something tonight, Sergeant. I would like very much to know what."`,
    ch:[{t:'"So would I."', go:()=>startExplore()}]}),

  b2_carriage:()=>({sp:'A carriage', txt: S.f.b2_tooLate ?
`An empty carriage, its door swinging. Its owners are already down at the ford in the dark, with everyone who would follow them.` :
`A noble's carriage, gilt, mud to the windows, with a lamp burning low inside and a child's face at the glass looking out at you. A servant pulls the curtain. ${b2In('sathi') ? 'Sathi makes a face at the curtain, a Weasel face, all points. "They are going somewhere," she says. "Horses know. Look at the horses."' : 'The horses in the traces are stamping. They know something.'}`,
    ch:[{t:'Leave it.', go:()=>startExplore()}]}),

  /* ---- the water's edge: Dom's boat ---- */
  b2_night_river:()=>({sp:'The water\'s edge', txt: S.f.b2_envoyDone ?
`The shallows below the carriages, black, with the bodies of Dom's men in them, and the boat drifting a little way out, empty. On the far bank, fires.` : (S.f.b2_steward4 || S.f.b2_dealKnown) ?
`Down the bank below the carriages, where the reeds open: a lantern turned to a thread, and the steward beside it, and out on the black water, coming, the dark shape of a boat. Then another behind it.

Men in the bow. Pikes, upright. They ground in the shallows and get out, quietly, and the one in front, an officer, goes up to the steward with something under his arm. A satchel. The steward holds out his hand for it.

${b2In('sathi') ? 'Sathi has an arrow on the string. "Now?"' : 'They have not seen you.'}` :
`The river, black, below the carriages. On the far bank, fires, more than there are stars. Nothing moves on the water that you can see.`,
    ch:[{t:'Now. Into them.', req:()=>!S.f.b2_envoyDone && !!(S.f.b2_steward4 || S.f.b2_dealKnown), go:()=>startBattle('b2_envoy', {})},
        {t:'Closer first, through the reeds.', check:['guile',14], req:()=>!S.f.b2_envoyDone && !!(S.f.b2_steward4 || S.f.b2_dealKnown),
          edges:id=>[id === 'sathi' && ['Hackle knows reeds', 2], id === 'tangle' && ['sappers go quiet', 1], id === 'redblade' && ['spurs', -2]],
          go:'b2_envoy_close', fail:'b2_envoy_seen'},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_envoy_close:()=>({sp:'The reeds', txt:`Through the reeds on your bellies, in the mud, until you can hear them: the officer's good Malazan, the steward's thin voice. "...all of them, every house of the Council, and anyone who walks with them..." Then the officer looks up.`, ch:[{t:'Up.', go:()=>startBattle('b2_envoy', {surprise:'p'})}]}),
  b2_envoy_seen:()=>({sp:'The reeds', txt:`A bird goes up out of the reeds, or a frog goes into the water, or a knee goes into the mud too loud. The officer's head comes round. "Steward," he says, quite calmly, "you've been followed." The pikes come down.`, ch:[{t:'Into them.', go:()=>startBattle('b2_envoy', {surprise:'e'})}]}),
  b2_after_envoy:()=>({sp:'The water\'s edge', fx:()=>{ S.f.b2_envoyDone = 1; S.f.b2_dealKnown = 1; }, txt:
`The steward is gone. He ran at the first blow, back up the bank toward the carriages with his lantern swinging, and nobody went after him; he is not who you came for.

The officer is down in the shallows. The satchel is in the mud beside him. You open it by the light of the boat's lamp.

Papers. A stack of them, each the same, each sealed with a Fist's seal with the Emperor's mark scraped out of it, each with the name of a house of the Council written at the top in a clerk's hand: Nethpara, Pullyk Alar, Lenestro, Tumlit, a dozen more. Safe passage over the Vathar, at first light, for the bearer's household and any who cross in its company. Signed: Korbolo Dom, Fist.

${b2In('haddat') ? `Haddat reads one over your shoulder. She reads it twice. "Any who cross in its company," she says. "Sergeant, he means everyone. He means the whole column. He means them to walk into the river behind the Council." She puts it down very carefully, as if it might go off.` : `*And any who cross in its company.* You read it twice. He means the whole column. He means them to walk into the river behind the Council.`}`,
    ch:[{t:'Take them all to Captain Lull.', fx:()=>{ S.f.b2_conduct = 'given'; }, go:()=>startExplore()},
        {t:'Take them to Lull. Keep one.', fx:()=>{ S.f.b2_conduct = 'kept'; gain('b2_conduct'); }, go:()=>startExplore()}]}),

  /* ---- Lull, and too late ---- */
  b2_lull_night:()=>({sp:'Captain Lull', txt:
`Lull is on the bank above the carriages with two of his marines, as if he had been waiting there for some time to see what the carriages would do. He reads the paper by firelight with the one eye, slowly, all of it.

"Hood's breath." He says it without any heat at all. He folds the paper and puts it inside his jerkin. "With me. Now. The Fist will want to see your face when he hears it."`,
    ch:[{t:'With him.', go:'b2_too_late'}, {t:'"A moment, sir."', go:()=>startExplore()}]}),
  b2_too_late:()=>({sp:'The bank · the dark before dawn', fx:()=>{ S.f.b2_tooLate = 1; }, txt:
`You never get to the Fist's tent.

Halfway along the bank Lull stops, and you stop with him, because behind you the carriages are moving. All of them, lamps out, the good horses in the traces, going down the bank in a line toward the ford, in the dark, quietly. And behind the carriages, the column is getting up.

Word goes up the bank faster than a horse. You hear it go: from fire to fire, a whisper and then not a whisper. *Safe passage. The Council has it. Dom's word. Anyone who crosses with the Council.* People are getting up. Picking up children, bundles, pots, and going down to the water after the carriages, in the dark, without anyone telling them to, because somebody rich has promised them something and they have walked eight hundred leagues and they are so tired.

Thousands. You can hear them going into the river. The splashing. The children.

Lull watches it with the one eye. Then he says, quite gently: "There it is, Sergeant. You can't stop that. Not without killing it." He turns toward the Fist's tent, at a run now. "Get your own people. If you still can."`,
    ch:[{t:'Your own people.', go:'b2_hold'}]}),
  b2_hold:()=>({sp:'The squad\'s carts', txt:
`Your stretch is on its feet when you get there. ${chainC()} of them, bundles on their backs, children up on the carts, and their faces turned toward the ford, where the sound of it is, people going into water in the dark.

They turn and look at you. They have learned to look at you. ${S.f.b2_key === 'daughters' ? `${B2.elder} has ${B2.younger} by the hand and the jar under her arm, and she is looking at you, waiting.` : S.f.b2_yedda ? `${B2.widow} has her grandsons by the collars and her rope over her shoulder, and she is looking at you, waiting.` : 'A mother from the weavers\' street has her baby on her hip and is looking at you, waiting.'}

"Safe passage," somebody says. "Sergeant. They say there's safe passage."`,
    html:chainHTML('The Vathar · before dawn'),
    ch:[{t:'"Sit down. Nobody goes into that river until I say." Hold them.', check:['might',15], edges:id=>[id === 'haddat' && ['they are her street', 2], id === 'sgt' && ['they are yours', 1], id === 'redblade' && ['they hate the red', -1], id === 'marrow' && ['she sits down first, and they follow her', 1]],
          go:'b2_hold_ok', fail:'b2_hold_some'},
        {t:'"Then we go with them, and keep them together in the water."', fx:()=>{ S.f.b2_heldBack = 0; if (b2In('marrow')) loy('marrow', -1); if (b2In('sathi')) loy('sathi', 1); }, go:'b2_hold_go'}]}),
  b2_hold_ok:()=>({sp:'The squad\'s carts', fx:()=>{ S.f.b2_heldBack = 2; if (b2In('haddat')) loy('haddat', 1); }, txt:
`They sit.

Not all at once. One, and then another, the way the stretch sat on the Shallows if it sat at all, because you have told them to and because you have kept them alive since Hissar and they have nothing else to go on. ${b2In('haddat') ? 'Haddat goes along the carts in the dark saying it again in the quarter\'s own Hissari, low, the same words, and they sit.' : ''}${b2In('marrow') ? ' Marrow sits down first, on the tailboard, as if she had all night, and the old people sit round her.' : ''}

Down at the ford the noise goes on. People going into water. Some of your people put their hands over their children's ears. You don't stop them.`,
    ch:[{t:'Wait for the light.', go:'b2_dawn'}]}),
  b2_hold_some:()=>({sp:'The squad\'s carts', fx:()=>{ S.f.b2_heldBack = 1; }, txt:
`Most of them sit. Not all. A family from the end of the stretch is already gone, down the bank in the dark toward the water, and two more after them, and when you shout they walk faster. ${b2In('haddat') ? 'Haddat goes after them and comes back alone, and says nothing, and sits down with the rest.' : 'You let them go. You have the rest to hold.'}

Down at the ford the noise goes on.`,
    ch:[{t:'Wait for the light.', go:'b2_dawn'}]}),
  b2_hold_go:()=>({sp:'The squad\'s carts', txt:
`"Together," you say. "In a file. Hand on the shoulder in front. Nobody lets go." They do it, because you said it. The squad goes in front, and at the sides, and at the back. ${b2In('sathi') ? 'Sathi says, "Good. If they go, we go with them. That is the Wickan way."' : ''}${b2In('marrow') ? ' Marrow says nothing at all, which from Marrow is a speech.' : ''}

You go down to the ford in the dark with the rest of the column, into the cold water, and wait there, in the river to the waist, for the light.`,
    ch:[{t:'The light.', go:'b2_dawn'}]}),
  b2_night_carts:()=>({sp:'The squad\'s carts', txt: S.f.b2_tooLate ? `Your people, and the carts.` :
`The squad's carts and the squad's people, ${chainC()} of them, asleep or trying to be. On the far bank, fires. Down by the carriages, harness. ${!S.f.b2_dealKnown ? 'Something is wrong down there, and you do not know what yet.' : 'You know what. They don\'t, yet.'}`,
    ch:[{t:'Your people.', req:()=>!!S.f.b2_tooLate && S.f.b2_heldBack == null, go:'b2_hold'},
        {t:'Wait for the light.', req:()=>S.f.b2_heldBack != null, go:'b2_dawn'},
        {t:'Leave them sleep while they can.', go:()=>startExplore()}]}),
});

/* ---------------- the ford: the day ---------------- */
Object.assign(B2CH4.dlg, {
  b2_dawn:()=>({sp:'The Vathar · first light', scene:'b2_vathar', txt:
`The light comes up grey over the old forest, and you can see it.

The ford is full. From bank to bank, the long pale bar of it under the brown water, and on it, in it, to the waist, to the chest, people: the column, tens of thousands, walking into the river in a crowd as wide as the river, the nobles' carriages at the head of it already halfway, lurching, the horses swimming where the gravel drops. Nobody is guarding them. Nobody is shooting at them. On the far bank, at the edge of the trees, nothing moves at all.

Behind them the Seventh is coming down to the water at a run, in no order, because the Fist has given the only order there is: cross. Cross now, behind them, and be on the far bank before whatever is going to happen happens.

${S.f.b2_heldBack === 2 ? 'Your stretch is still on the bank, sitting, all of it, where you told it to sit. They are watching the river.' : S.f.b2_heldBack === 1 ? 'Most of your stretch is still on the bank, where you told it to sit. Some of it is out there in the water.' : 'Your stretch is in the river with you, in a file, hand on shoulder, to the waist, shivering.'}`,
    ch:[{t:'To the ford.', go:()=>{ startExplore('b2_vford'); }}]}),

  /* ---- Mincer's sappers, in robes ---- */
  b2_robe:()=>({sp:'Captain Mincer', txt:
`Mincer's company is pulling on robes. Refugees' robes, head-cloths, women's shawls, whatever the column will give them, over the leather aprons and the munitions. Mincer is in a farmer's coat that comes to his knees, writing on his slate.

"The Fist's order," he says, without looking up. "Sappers into the crowd, dressed like the crowd. If Dom's got something waiting in that river, we're in the middle of it when it comes." He looks up. ${b2In('tangle') && !b2Mate(S.f.b2_silandaWho) ? `At Tangle. "You're mine today, if your sergeant can spare you. I'm short."

Tangle looks at you. He has a shawl in his hands already, somebody's grandmother's, blue.` : b2In('tangle') ? `At Tangle, and at the squad, and at the gap in it where ${b2Nm('b2_silandaWho', 'someone')} was. "I'd ask for him," he says. "You're short already. Keep him. Put a robe on him." He tosses Tangle a shawl, somebody's grandmother's, blue.` : `"Your sapper's on the burned boat. Pity. I could have used him." He goes back to the slate.`}`,
    ch: b2In('tangle') && !b2Mate(S.f.b2_silandaWho) ? [
        {t:'"Go with your captain, Tangle."', fx:()=>{ S.f.b2_robe = 'mincer'; loy('tangle', 1); }, go:'b2_robe_go'},
        {t:'"He stays with us. In the robe, with our own people."', fx:()=>{ S.f.b2_robe = 'squad'; }, go:'b2_robe_stay'}] :
      b2In('tangle') ? [{t:'"Thank you, Captain."', fx:()=>{ S.f.b2_robe = 'squad'; }, go:'b2_robe_stay'}] :
      [{t:'Leave him to it.', fx:()=>{ S.f.b2_robe = 'none'; }, go:()=>startExplore()}]}),
  b2_robe_go:()=>({sp:'Tangle', txt:
`Tangle puts the shawl over his head, and is at once, horribly, somebody's grandmother. He buckles the satchel and holds it out to you. "${b2Count()}," he says. "Keep it dry." Then he goes off into the crowd with Mincer's people, stooping, and you lose him in the first twenty paces. ${b2In('sathi') ? 'Hackle whines after him once.' : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_robe_stay:()=>({sp:'Tangle', txt:
`Mincer shrugs and goes back to the slate. Tangle puts the shawl on anyway, over the apron, and stands among your people in it, and is at once, horribly, somebody's grandmother. "If there's something in that river," he says, "it's coming at them, not at Mincer." He pats the satchel. "${b2Count()}. Point me at it."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ours_ford:()=>({sp:b2Ours4() || 'The squad\'s people', fx:()=>{ S.f.b2_oursFord = 1; }, txt: S.f.b2_heldBack ?
`${S.f.b2_key === 'daughters' ? `${B2.elder} is sitting on the bank with ${B2.younger} in her lap and the jar between them. "Why are we not going?" ${B2.younger} asks you. ${B2.elder} answers before you can. "Because the sergeant said." She doesn't take her eyes off the river.` : S.f.b2_yedda ? `${B2.widow} is sitting on her rope with her grandsons pressed against her. "Everyone else is going, soldier." She looks at the river. "I hope you're right." She doesn't move.` : 'Your people, sitting on the bank where you told them, watching everyone else go into the river. Nobody says anything.'}` :
`${S.f.b2_key === 'daughters' ? `${B2.elder} is in the water to her waist with ${B2.younger} on her back and the jar held up out of the river in both hands, like an offering.` : S.f.b2_yedda ? `${B2.widow} is in the water to her chest with a grandson on each hip, and the rope floating out behind her.` : 'Your people, in the river to the waist, in a file, hand on shoulder.'} Nobody lets go.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_bult_ford:()=>({sp:'Bult', fx:()=>{ S.f.b2_bultFord = 1; }, txt:
`Bult is on a horse at the water's edge, watching the crossing with his jaw working on nothing.

"The Fist says cross," he says. "So we cross. Behind them. What else is there?" He spits. "Sormo's over already, with the young warlocks. On the far bank, where the trees start. He didn't like the look of the trees." He gathers the reins. "Neither do I. Nothing in them. Not one bird."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ford_tree:()=>({sp:'A drowned tree', txt:
`A dead tree in the shallows, roots up, white, with the river pulling at it. From here you can see the far bank, and the edge of the forest, and at the water's edge among the first trees, small figures: Wickans. ${b2In('sathi') ? `Sathi shades her eyes. "Sormo," she says. "And the young ones. On the bank. He has his hands in the water." She frowns. "He is listening to the river. Why is he listening to the river?"` : 'One of them, older, is kneeling with his hands in the water, as if he were listening to it.'}

Upriver, round the bend, something is coming down on the current. Long, low, dark. More than one.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ford_cart:()=>({sp:'A cart in the shallows', txt:`A cart gone over in the shallows, somebody's, with its bundles floating off it one by one and nobody stopping to pick them up. ${chainW() > 0 ? `Your skins, at least, are on your backs: ${numw(chainW())}.` : 'Your skins are empty. There is a whole river.'}`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ford_wagon:()=>({sp:'The shallows', txt: !S.f.b2_robe ?
`The overturned wagons at the edge of the ford, and the water beyond them full of people. Mincer's sappers are pulling on robes, back on the bank. ${b2In('tangle') ? 'Tangle is looking at you.' : ''}` :
`The overturned wagons at the edge of the ford, and the water beyond them full of people, and coming round the bend upriver on the current, low and long and dark: rafts. No. Bridges. Lashed timber, wide as a road, floating, with men on them. A rail of pikes along each one. Archers behind the pikes.

They are not coming to the bank. They are coming to the ford.`,
    ch:[{t:'Into the water.', req:()=>!!S.f.b2_robe, go:'b2_bridges'},
        {t:'Not yet.', go:()=>startExplore()}]}),

  b2_bridges:()=>({sp:'The ford', scene:'b2_vathar', txt:
`The bridges come down the Vathar into the ford, one after another, and swing across the current, and stop. Somebody has moored them. Somebody knew exactly where to moor them.

Then the archers begin.

They do not aim. They do not need to. The ford is full from bank to bank. People go down under it the way grass goes down under rain, and the ones who are not hit try to run, in water to the chest, and cannot, and the pikemen step down off the bridges into the shallows in good order and go to work.

You do not look at it for long. You do not need to. You will be able to see it later whenever you like.

The nearest bridge has swung in at the head of your stretch of the ford. Its pikemen are stepping down into the water.${S.f.b2_heldBack === 0 ? ' Your people are behind you in the river, hand on shoulder, and nobody has let go.' : ''}`,
    ch:[{t:'Hold the shallows.', go:()=>startBattle('b2_bridge', {})},
        {t:'Tangle: a cusser into the bridge\'s moorings, first.', tag:'uses 1 cusser', req:()=>b2In('tangle') && S.f.b2_robe !== 'mincer' && S.inv.cusser > 0, fx:()=>{ S.inv.cusser--; S.f.b2_bridgeCusser = 1; loy('tangle', 1); }, go:()=>startBattle('b2_bridge', {pre:'Tangle wades out to the chest in his grandmother\'s shawl and sets the cusser on the bridge\'s mooring-line, and comes back faster than he went. The end of the bridge goes up in a flat white roar, and swings, and half the archers on it go into the Vathar.', surprise:'p'})}]}),

  b2_after_bridge:()=>({sp:'The ford', scene:'b2_vathar', fx:()=>{ if (!S.f.b2_fordDone) { S.f.b2_fordDone = 1; S.f.b2_vathar = 1;
      const c = chainC(), r = S.f.b2_lastRounds || 7; let p = .4 - (S.f.b2_heldBack || 0) * .12 - (S.f.b2_bridgeCusser ? .06 : 0) - (S.f.b2_robe === 'mincer' ? .04 : 0) + (r <= 4 ? -.05 : r >= 9 ? .05 : 0);
      p = clamp(p, .08, .5); const loss = c ? Math.max(1, Math.round(c * p)) : 0; S.f.b2_vatharLost = loss; chain(0, -loss, 'The Vathar'); gain('b2_pikehead'); } }, txt:
`The bridge sergeant goes into the river with his horsetail, and does not come up, and the bridge is yours.

Then it is not anybody's. The people in the water have reached it. They come up over the edge of the planks out of the Vathar, hundreds of them, unarmed, with their hands, the way they came up out of the Odhan: they have walked eight hundred leagues and they have stopped being afraid of anything. They come up onto the bridge and over the archers and the bridge tips, slowly, all along its length, and goes over, and the river closes on it.

All down the ford it is happening. The bridges are going under.

${S.f.b2_robe === 'mincer' ? `Downstream there is a long flat roar, and a column of white water, and a bridge comes apart in the middle. Somebody's grandmother in a blue shawl is standing in the shallows beside it, very still.` : ''}

You stand in the river to the waist, and count. ${S.f.b2_vatharLost ? `The ford has kept ${numw(S.f.b2_vatharLost)} of your stretch. ${b2In('haddat') ? 'Haddat says the names.' : 'You have the names.'}` : 'Nobody of yours is in the water that you can find.'} ${S.f.b2_heldBack === 2 ? 'The rest are on the bank, where you sat them. They are alive because you sat them there, and they will never, any of them, thank you for it, and that is right.' : ''}`,
    html:chainHTML('The Vathar · the ford'),
    ch:[{t:'The far bank.', go:'b2_butterflies'}]}),
  b2_butterflies:()=>({sp:'The ford', fx:()=>{ S.f.b2_sormoDead = 1; }, txt:
`On the far bank, where the trees begin, something is rising off the water.

At first you think it is smoke. It is not smoke. It is yellow. A cloud of yellow, rising off the river by the bank where the Wickans were, thousands on thousands of small bright wings, butterflies, a great slow column of them going up into the grey morning over the Vathar, over the bridges and the dead and the living, as if something were being carried.

${b2In('sathi') ? `Sathi stops. She stands in the river with her bow in her hand and watches them go up, and her face does a thing you have never seen it do. "Sormo," she says. Only that.` : `Nobody around you says anything. Nobody needs to. Somebody on the far bank is dead, and it is somebody the land knew.`}

The word comes down the river an hour later. Sormo E'nath went into the water when the bridges came, on the far bank, and stood in it, and tried to stop them. The archers on the nearest bridge found him. ${b2In('marrow') ? (S.f.b2_sormo ? `Marrow, beside you in the river, says very quietly: "He told me the warrens were sick. At Hissar. The first night. He was the only one who'd say it." She does not say anything else for a long time.` : `Marrow, beside you in the river, says nothing at all for a long time.`) : ''}`,
    ch:[{t:'On.', go:()=>talk(b2In('haddat') ? 'b2_ilhar' : 'b2_vcross')}]}),
  b2_ilhar:()=>({sp:'Haddat', fx:()=>{ S.f.b2_ilharSeen = 1; }, txt:
`Haddat has not moved since the bridge.

She is standing in the shallows with her shield on her arm, the auxiliary's faded blue, looking upriver, at the next bridge. It is still afloat. It is drifting now, its moorings cut, turning slowly in the current, with a knot of Dom's officers at its rail who have not yet decided whether to jump.

One of them is not in armour. A city coat, a green cloth on the arm. A man about her age with her shoulders. He is looking at the ford the way you look at a fire you set. Then he is looking at the shield. Then at her.

The bridge turns in the current. Nobody on it lifts a bow toward the blue shield. Nobody on it lifts a bow toward anything near it. Whether anyone on it was ever told to, you will never know.

He does not lift a hand. Neither does she.`,
    ch:[{t:'Let her be.', fx:()=>{ S.f.b2_ilharSign = 'silent'; }, go:'b2_ilhar_silent'},
        {t:'"Haddat." Only that.', fx:()=>{ S.f.b2_ilharSign = 'named'; loy('haddat', 1); }, go:'b2_ilhar_named'}]}),
  b2_ilhar_silent:()=>({sp:'Haddat', txt:`The bridge goes on turning, and drifts away round the bend with the current, and he goes with it. Haddat watches until there is nothing to watch. Then she turns round and walks back through the water to the squad, and says, in Malazan, reporting: "My brother is with Dom, Sergeant. On the bridges. I have seen him." She picks up a child out of the shallows who has lost its mother, and carries it to the bank, and does not say anything else all day.`, ch:[{t:'On.', go:'b2_vcross'}]}),
  b2_ilhar_named:()=>({sp:'Haddat', txt:`She hears you. She does not turn round. In Hissari, very low, too low for the water to carry, she says a name. His. The second time you have heard her say it. The bridge drifts away round the bend with him on it, and he does not hear, or he does not show it.

When she turns round her face is the face she wears to count the dead. "Thank you, Sergeant," she says. "I needed somebody to have heard me say it."`, ch:[{t:'On.', go:'b2_vcross'}]}),
  b2_vcross:()=>({sp:'The Vathar · afternoon', scene:'b2_after', txt:
`The Seventh crosses the Vathar in the afternoon, behind what is left of the column, over the ford, between the drifting wreckage of the bridges. Nobody shoots at it. Dom's archers on the far bank have gone back into the trees. The Foolish Dog went in after them, Bult says, and came out again, fewer.

${S.f.b2_heldBack ? 'Your stretch crosses with the army, last, through water that is not brown any more. You tell them not to look down. Most of them manage it.' : 'Your stretch is already over, the ones the ford left you, sitting on the far bank in a heap, soaked, holding on to each other.'}

On the far bank, at the edge of the old forest, the column stops, because it cannot go any further today, and sits down where it stops.`,
    ch:[{t:'The far bank.', go:()=>{ startExplore('b2_farbank'); talk('b2_farbank_arrive'); }}]}),
});

/* ---------------- the far bank: dusk, after ---------------- */
Object.assign(B2CH4.dlg, {
  b2_farbank_arrive:()=>({sp:'The far bank · dusk', scene:'b2_after', txt:
`Dusk on the far bank of the Vathar.

The river goes on behind you, slow and brown, as if nothing had happened in it. There is smoke on it from somewhere. There are birds over it, a great many birds, and you do not look at what they are doing.

Up the bank, where the trees begin, the living are sitting down in the leaf-litter in their thousands, and not talking, and not lighting fires. Somebody has already given the day a name. By the time the stars are out, everybody is using it.

${b2In('marrow') ? 'Marrow is already among the wounded, under the first trees.' : 'There is no healer with the squad. There is a great deal for a healer to do.'}`,
    html:chainHTML('The Vathar · the far bank'),
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  /* ---- Marrow, at the bottom of the warren ---- */
  b2_marrow_end:()=>({sp:'Marrow', txt: S.f.b2_marrowEnd ?
`Marrow is sitting against a tree with her eyes shut and the string in her lap. ${S.f.b2_marrowEnd === 'on' ? 'She is not asleep. She is just empty.' : 'She is asleep, or pretending to be, for your sake.'}` :
`Marrow is on her knees under the first trees with the wounded laid out in front of her in a row that goes back into the dark further than you can see. She is doing it the slow way: needle, gut, salve, a hand on the forehead. Every so often she reaches into the warren, and you can see it in her face, the reach, and what comes back.

She has done a great many. She is still going. When she looks up at you her eyes are wrong, the way a well's water is wrong when somebody has been drawing too long.

"It's nearly gone, child," she says. "Not mud. Not tonight. Nothing. I put my hand in and there's a bottom to it, and it's dry, and there's something sitting on the bottom." She looks at the row. "There are four more I could reach. I think. If I go on."`,
    ch:[{t:'"Go on, then. I\'ll hold you up."', req:()=>!S.f.b2_marrowEnd, fx:()=>{ S.f.b2_marrowEnd = 'on'; S.f.b2_warrenFloor = 1; S.f.b2_knots = (S.f.b2_knots || 0) + 3; S.f.b2_sputters = (S.f.b2_sputters || 0) + 1; chain(0, 2, 'Marrow\'s last'); loy('marrow', 1); }, go:'b2_marrow_on'},
        {t:'"Stop. You\'ll be no use to anyone tomorrow."', req:()=>!S.f.b2_marrowEnd, fx:()=>{ S.f.b2_marrowEnd = 'stopped'; }, go:'b2_marrow_stop'},
        {t:'Leave her.', req:()=>!!S.f.b2_marrowEnd, go:()=>startExplore()}]}),
  b2_marrow_on:()=>({sp:'Marrow', txt:
`You kneel behind her and hold her up by the shoulders, and she goes on.

Three of them take. You can see them take: the colour coming back, the breath going deep. She ties a knot in the string after each, with fingers that are shaking. The fourth does not. She reaches, and there is nothing, and she reaches again, deeper, past where it is safe to go, and something comes back up with her hand that is not Denul, and the man in front of her goes very still, and then breathes, badly, and lives. She does not tie a knot for that one. She counts it on her fingers.

Then she sits back against you, all her weight, and does not get up for a long time.

"Something's sitting in it," she says, at last, into your shoulder. "In the warren. Down at the bottom, where the water should be. Something big, and patient, and it moved when I touched it." She is quiet a while. "Don't tell Sormo's boy. He's ten."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_marrow_stop:()=>({sp:'Marrow', txt:
`She looks at you for a long moment. Then she puts the needle down.

"You're right," she says. "I hate it when you're right." She lets you help her up, and walks with you away from the row, and does not look back at it, which costs her more than you will ever know. "Tomorrow," she says. "There'll be a little in the well tomorrow. There always is."

There are four more in the row who will not see tomorrow. She knows exactly which four. So do you.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Tangle, and Mincer's fall ---- */
  b2_tangle_mincer:()=>({sp:'Tangle', fx:()=>{ S.f.b2_bungle = 1; }, txt:
`Tangle is sitting on a root with the shawl still round his shoulders, blue, somebody's grandmother's, and his crossbow across his knees, and he is not counting anything.

"They've broken Mincer," he says. "To the ranks. An hour ago, in front of the company." He turns the crossbow over. "Captain this morning. Sapper tonight. Same as me." He laughs, not much. "He'll be better at it than me."

${S.f.b2_robe === 'mincer' ? `He doesn't say why. You were not there, and he was, in the robe, with the company, all day in the river. "Don't ask me, Sergeant," he says, before you can. "He won't say. I won't either. It was a bad day in the water. Everybody did things." He looks at the river. "Some of us did the wrong ones for the right reasons, and some the other way. Somebody up there knows which. That's what Fists are for."` : `"Nobody's saying why," he says. "Not in the hearing of anyone below a captain." He looks at the river. "It was a bad day in the water. Everybody did things."`}

He takes the shawl off at last, and folds it, carefully, and puts it in the satchel. "${b2Count()}," he says. "And a shawl."`,
    ch:[{t:'"Who has the company?"', go:'b2_tangle_bungle'}]}),
  b2_tangle_bungle:()=>({sp:'Tangle', txt:`"Bungle." He says it the way you would say the name of a horse you were not sure of. "Captain Bungle, now. He's over there, wearing it." He nods up the bank. "He'll be all right. He's sensible. That's the worst thing you can say about a sapper and the best thing about a captain."`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_bungle:()=>({sp:'Captain Bungle', fx:()=>{ S.f.b2_bungleMet = 1; S.f.b2_bungle = 1; }, txt:
`A sapper in a scorched apron with a captain's badge pinned on crooked over it, by somebody in a hurry, sitting on an ammunition chest with Mincer's slate in his hands, looking at it as if it might go off.

"Sergeant." He doesn't get up. Sappers never get up. "Bungle. Captain, apparently." He holds up the slate. "Mincer's. He gave it me himself. Said I'd need it." He looks at the names on it, a long time. "He's down there. With the company. Digging latrines. He offered."

He puts the slate away inside his apron, very carefully, the way Lull put away the Claw star. "Don't call me *sir*," he says. "Not tonight."`,
    ch:[{t:'"Captain."', go:()=>startExplore()}]}),

  /* ---- Sathi, and the Wickan manners ---- */
  b2_sathi_laugh:()=>({sp:'Sathi', fx:()=>{ S.f.b2_sathiLaugh = 1; loy('sathi', 1); }, txt:
`Down by the water the Wickans are singing over their dead. The Foolish Dog, mostly: what is left of them. There are not many voices.

Sathi is sitting at the edge of the trees with Hackle across her knees, listening. When the song gets to a place you can feel coming, a long falling place, she laughs. Out loud, high and short, the Wickan way, the way the Weasels laugh at funerals. It goes out over the water in the dusk.

Somebody down by the water laughs back.

Then more of them. A Weasel, two, a handful, the clan's riders sitting their tired horses at the river's edge, laughing in the dark between the verses, and one of them turns in the saddle and looks up the bank at the girl who laughed first. ${S.f.b2_sathiShamed ? `It is the first time a Weasel has looked at her since the Shallows.` : S.f.b2_sathiTeeth ? `He grins at her, all points, and she grins back, all points.` : ''}

${S.f.b2_sathiShamed ? `Sathi doesn't move. She doesn't look back at him. But she doesn't stop laughing either, until the song does.` : `"For Sormo," she says to you, when it is over, wiping her eyes. "He would want it loud. The old ones carry him now. Eight of them, the clan says, inside him. Now nine."`}`,
    ch:[{t:'Let her be.', go:()=>startExplore()}]}),

  /* ---- Duiker, hoarse ---- */
  b2_duiker6:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker6 = 1; }, txt:
`The historian is sitting against a tree with his notebook shut on his knee. His voice, when he speaks, is a croak, and there are marks on his throat, dark ones, in the shape of fingers.

"Nethpara," he says. "At the water's edge. After." He touches his throat. "I put my hands on him. I had them round his neck. I was going to kill him, Sergeant, there in front of the column. A member of the Council." He is quiet a moment. "They pulled me off. I don't know who. I woke up in the mud."

He opens the notebook, and looks at it, and shuts it again. "I'll write it down. All of it. The bridges, the Council, the deal." He looks at the river. "And then somebody in Unta will read it, and say *how dreadful*, and turn the page." He closes his eyes. "I would have killed him. I want that in the history too."`,
    ch:[{t:'"I\'d have helped, sir."', go:'b2_duiker6b'},
        {t:'Sit with him a while.', go:()=>startExplore()}]}),
  b2_duiker6b:()=>({sp:'Duiker', txt:`He opens his eyes and looks at you, and almost laughs, and it hurts his throat. "No you wouldn't, Sergeant. You'd have pulled me off. That's why they give you the stripes." He shuts his eyes again. "Thank you, though."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Ramin counts the company ---- */
  b2_ramin_count:()=>({sp:'Ramin', fx:()=>{ S.f.b2_raminCount = 1; loy('redblade', 1); }, txt:
`Ramin is standing at the edge of the trees facing the river, very straight, counting the company's dead out loud, by name, the way he does every dusk. It takes longer tonight.

When he has finished he stays where he is. "They were in the ford," he says, without turning round. "The company. Between the bridges and the people, on foot, the horses gone. Holding." He says it in the present tense, as he says everything about the company, and then hears himself, and stops. "Held."

He turns round. "In Ehrlitan, Sergeant, the rich men watched from the hill. Today they went first, in the water, with the paper Dom gave them." His voice does not change. "And they lived. Most of them. I asked." He goes back to looking at the river. "I am lent. I will be given back. I would like the company to be there when I am."`,
    ch:[{t:'"It will be."', go:()=>startExplore()}]}),

  /* ---- the wreck of a bridge ---- */
  b2_wreck:()=>({sp:'The wreck', txt:`Planks of a floating bridge, washed up against the bank, still lashed together with rope that has been cut and knotted and cut again. A pike's broken shaft is wedged between two of them. ${b2In('tangle') ? 'Tangle looks at the lashing. "Good work," he says, and hates that he said it.' : 'Somebody built it well.'}`, ch:[{t:'Leave it.', go:()=>startExplore()}]}),

  /* ---- the Chain at dusk: the children nobody has ---- */
  b2_far_cart:()=>({sp:'The squad\'s cart', txt: S.f.b2_orphans ?
`The squad's cart, under the first trees. ${S.f.b2_orphans === 'took' ? 'The children are asleep on it, in a heap, under the squad\'s blankets.' : 'The children are gone where you sent them.'} ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'} hang${chainW() === 1 ? 's' : ''} on the tailboard.` : 'No water. There is a river behind you, and nobody will go down to it tonight.'}` :
`The squad's cart, under the first trees, with what is left of your stretch round it.

And round the stretch, at the edge of the firelight that nobody has lit, children. Five of them. Six. Soaked, silent, with nobody, from somewhere in the ford. They have come up the bank to the nearest people who look as if they know what they are doing, and sat down, and they are watching the skins on your cart.

${b2In('haddat') ? 'Haddat looks at them, and at you, and does not say anything. She does not have to.' : 'Nobody in the squad says anything.'}`,
    html:chainHTML('The far bank of the Vathar'),
    ch:[{t:'Take them into the stretch.', tag:'2 water', req:()=>!S.f.b2_orphans && chainW() >= 2, fx:()=>{ S.f.b2_orphans = 'took'; chain(-2, 5, 'Children from the ford'); if (b2In('haddat')) loy('haddat', 1); if (b2In('marrow')) loy('marrow', 1); }, go:'b2_orphans_took'},
        {t:'Give them a skin, and walk them to the Wickan wagons.', tag:'1 water', req:()=>!S.f.b2_orphans && chainW() >= 1, fx:()=>{ S.f.b2_orphans = 'sent'; chain(-1, 0, 'A skin for the children'); }, go:'b2_orphans_sent'},
        {t:'There is no water for them. Not and keep the stretch alive.', req:()=>!S.f.b2_orphans, fx:()=>{ S.f.b2_orphans = 'left'; if (b2In('haddat')) loy('haddat', -1); }, go:'b2_orphans_left'},
        {t:'Leave it.', req:()=>!!S.f.b2_orphans, go:()=>startExplore()}]}),
  b2_orphans_took:()=>({sp:'The squad\'s cart', txt:`You give them the skin. They drink the way the stretch has learned to drink, slowly, holding it, because somebody in the stretch shows them how. ${S.f.b2_key === 'daughters' ? `${B2.younger} gives the smallest one a turn with the jar.` : S.f.b2_yedda ? `${B2.widow} counts them, out loud, and says, "Well. Six more," as if she had been expecting it.` : 'A woman from the weavers\' street takes the smallest one into her lap without a word.'} The stretch is longer. It is lighter by two skins. That is the arithmetic of the Chain, and everybody on it knows it.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_orphans_sent:()=>({sp:'The squad\'s cart', txt:`A skin, and a walk up the bank in the dark to where the Wickans have their wagons. A Wickan grandmother looks at them, and at you, and takes them in under her cart without a word, as if children were a thing that came up out of rivers every evening. Perhaps today they were.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_orphans_left:()=>({sp:'The squad\'s cart', txt:`You don't give them anything. You can't. The skins are for the stretch, and the stretch is already more than the skins. After a while the children get up, one by one, and go away up the bank to the next fire nobody has lit. ${b2In('haddat') ? 'Haddat watches them go. She counts them. She does not look at you for the rest of the night.' : 'You count them as they go. Six.'}`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_far_wagon:()=>({sp:'Under the trees', txt: S.f.b2_farRest ? `The squad's blankets, in the leaf-litter, under the first trees.` :
`The leaf-litter under the first trees is soft and damp, and smells of rot and green, and after the Odhan it is like lying down in a bed. Nobody in the column has lit a fire. Nobody wants to be seen.`,
    ch:[{t:'Drink, and sleep.', tag:'1 water', req:()=>!S.f.b2_farRest && chainW() > 0, fx:()=>{ S.f.b2_farRest = 1; dgRest('The squad lies down under the trees with the river at its back, and sleeps, or lies still with its eyes shut, which on the Chain counts. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),

  /* ---- Bult, and the count ---- */
  b2_bult6:()=>({sp:'Bult', txt:
`Bult is sitting on a dead log at the edge of the trees with no wine and no grin, looking at the river.

"Sergeant." He doesn't look round. "Duiker has the count. Do you want it?" He doesn't wait. "Twenty thousand of the column. Near enough. Seven hundred of ours. The Foolish Dog are fewer than five hundred, and they were five thousand at Gelor. And Sormo." He is quiet a moment. "Sormo, who was older than he looked, and younger than he should have been, and carried his teachers inside him like a man carries his dead. He went into the water to stop it. With his hands."

He picks up a stone and turns it over. "The Council lived. Most of it. Nethpara. Pullyk. The ones who made the deal walked over on Dom's paper and his archers let them by." He puts the stone down. "The Fist knows. He will do nothing, because there is nothing to do that does not lose us the rest of the column, and he is a Fist, and that is what a Fist is for." He looks at you at last. "I'm his uncle. I'm allowed to hate it."

"Count your own, Sergeant. Then sleep. The forest tomorrow. Dom won't come into the trees after us tonight. He doesn't need to."`,
    ch:[{t:'Count them.', go:'b2_c4_end'}, {t:'Not yet.', go:()=>startExplore()}]}),
  b2_c4_end:()=>({sp:'The far bank of the Vathar · night', scene:'b2_after', txt:
`You count them.

${chainC()} in the squad's stretch, on the far bank of the Vathar, under the first trees of the old forest, in the dark. ${S.f.b2_vatharLost ? `${numw(S.f.b2_vatharLost, true)} fewer than came to the river. You have their names. Somebody should.` : 'All of the ones who came to the river.'}${S.f.b2_orphans === 'took' ? ' And six who were not yours this morning.' : ''} ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'} of the Vathar on the cart.` : 'No water.'}

${S.f.b2_c4_key === 'silanda' && b2Mate(S.f.b2_silandaWho) ? `And the squad: one short. ${NAME(S.f.b2_silandaWho)} is somewhere down the river tonight, on a burned ship, going to Aren. You find yourself counting ${b2Him(S.f.b2_silandaWho)} anyway. You will for a while.` : S.f.b2_c4_key === 'keep' && b2Mate(S.f.b2_woundWho) && b2In(S.f.b2_woundWho) ? `And the squad: all of it. ${NAME(S.f.b2_woundWho)} is asleep with the wound bound tight under the kit, and wakes when ${b2He(S.f.b2_woundWho)} turns over, every time.` : 'And the squad: all of it.'}${b2In('haddat') && S.f.b2_ilharSeen ? `

Haddat sits with her shield across her knees and looks at the river, black under the stars, where a bridge went round the bend this morning with a man on it from the water-sellers' quarter.` : ''}

Somebody has named the day. It is a Wickan name, or a soldier's, or both; by midnight nobody can remember who said it first. The Day of Pure Blood. Nobody who was in the river says it out loud.`,
    html:chainHTML('The far bank of the Vathar'),
    ch:[{t:'Sleep.', go:()=>chapterEnd(4, S.f.b2_c4_key || 'keep')}]}),
});
