/* ============ Book Two, Chapter 7: Aren Way, and the end of Book Two ============ */
/* Balahn, the squalid village where Aren Way begins; the refugees' run of three leagues past old barrows to Aren, with Dom's horse round
   the Seventh and at the column; the count at the gate. Then Aren: the Barrow within sight of the walls, where Coltaine's last four hundred
   stand and fall (Bult, List, Lull; Bent speared); Coltaine crucified alive, Reloe blasting the crows, Blistig sending for Squint, the arrow,
   the crows and the body gone. Then Mallick Rel's dawn sortie: the Red Blades locked up, Duiker taken along, the feigned rout, the basin, the
   surrender, Pormqual beheaded, ten thousand crucified along Aren Way over a day and a half, Duiker last. Blistig's three hundred stay on the
   walls; Keneb warns Blistig; Dom never takes the city. The Adjunct's fleet is under a week out.
   THE BARROW (decided with the owner): whoever stayed with Coltaine at the split (S.f.b2_stay, 47 b2Rearguard) fights the last stand
   without the sergeant, seen through their eyes (b2LastStand / b2LastStandEnd, 47; def.lastStand: held or broken, it goes on), then the
   cut to the walls. They die there, for good. If nobody stayed, the Barrow is seen from the walls only.
   The Silanda one comes ashore in Aren on the last morning (b2Ashore, 47: canon has nothing heard of the Silanda by the sortie).
   An Old Hand of the Fourth (dgOldHands, 47: an imported Book One save on the empire road) can join for the last night, in the recruit's
   place, after the Red Blades are taken.
   Key (S.f.b2_c7_key), the book's road out: 'guard' (the Aren Guard with Blistig and Keneb), 'wickans' (ride with Nil, Nether and
   Temul), 'desert' (walk into Seven Cities and off the map). Then the Book Two finale (B2CH7.finale, read by 37's showFinale). */

/* the phase of the days in Aren: 1 the column is in, 2 the night after the Barrow, 3 the day of the sortie, 4 the last morning */
const b2Ph7 = () => S.f.b2_ph7 || 0;
/* fell at the Barrow (47 writes S.dead[id].where) */
const b2Fell = id => !!(S && S.dead && S.dead[id] && S.dead[id].where === 'The Barrow');
const b2Fallen = () => B2_SPLIT.filter(b2Fell);
/* names in a sentence: "Haddat", "Haddat and Sathi", "Haddat, Sathi and Tangle" */
const b2And = ids => !ids.length ? '' : ids.length === 1 ? NAME(ids[0]) : ids.slice(0, -1).map(NAME).join(', ') + ' and ' + NAME(ids[ids.length - 1]);
/* a short squad gets hands: the Wickan children on the road, the Aren Guard on the walls (three for the sergeant alone) */
const b2Help7 = kind => { const n = b2Hands5(); return n <= 1 ? [[kind, 1, 8], [kind, 6, 8], [kind, 3, 9]] : n <= 3 ? [[kind, 1, 8], [kind, 6, 8]] : []; };
/* the Old Hand who can come ashore, and who came */
const b2OH = () => S.f.b2_oldHand && TPL[S.f.b2_oldHand] ? S.f.b2_oldHand : null;
const b2OHFrom = () => (S.imported && S.imported.from) || 'Hask';
/* Hackle: with Sathi, or come back to the sergeant's whistle after the Barrow */
const b2Dog7 = () => b2In('sathi') || !!S.f.b2_hackleBack;
/* the stretch's count at the gate, as a word to start a sentence with: "Twenty", "None" */
const b2Gate7 = () => S.f.b2_gateCount ? numw(S.f.b2_gateCount, true) : 'None';

/* Squint's Breath: an old Aren Guard bowman's way of letting the breath go before the loose. A habit, not sorcery: it never sputters. */
Object.assign(TRICKS, {
  b2_squint:{name:'Squint\'s Breath', ch:7, use:'fight', ab:'t_b2_squint', where:'the north wall of Aren, with an old bowman of the Guard',
    lore:'Draw, and then wait, and let the breath out slowly, all of it, until there is nothing in you that moves. The old man on the stair says the arrow goes where the empty man is looking. He says it as if he did not much like knowing it.',
    get fx(){ return `Once a fight: the bearer empties their lungs and goes still. Their next blow or shot is +4 to hit and +2 damage${lvT() >= 2 ? ', and a shot reaches two tiles further' : ''}. Not sorcery: it never sputters.`; }},
});
Object.assign(AB, {
  t_b2_squint:{name:TRICKS.b2_squint.name, trick:'b2_squint', self:true, desc:()=>TRICKS.b2_squint.fx,
    run(u){ AUDIO.play('click'); u.steady = true; u.rallyUntil = Math.max(u.rallyUntil || 0, B.round + 1);
      if (lvT() >= 2 && u.rng > 1 && !u.squintRng) { u.squintRng = true; u.rng += 2; }
      float(u, 'still', '#cfe0f0'); blog(`${u.name} lets the breath go, slowly, all of it, the way the old man on the stair showed, and goes still as a post.`); }},
});

/* the words this chapter adds to Book Two's glossary */
GLOSSX.dg.push(
  [7, 'Aren', 'The great port of Seven Cities\' north coast, the High Fist\'s seat, with ten thousand of the Empire\'s soldiers inside its walls and the Empire\'s fleet held in its harbour.', ()=>!!(S.f && S.f.b2_ph7)],
  [7, 'Aren Way', 'A raised road, three leagues long, from the village of Balahn to Aren\'s north gate, between barrows older than anybody\'s name for them.', ()=>!!(S.f && S.f.b2_way)],
  [7, 'The Barrow', 'The mound on Aren Way, just out of bowshot of the walls, where Coltaine\'s last four hundred stood.', ()=>!!(S.f && S.f.b2_coltaineGone)],
  [7, 'Blistig', 'Commander of the Aren Guard. He held Duiker back on the tower, and sent for the old bowman, and kept three hundred of his own on the walls when the High Fist marched out.', ()=>!!(S.f && S.f.b2_blistig1)],
  [7, 'Captain Keneb', 'An officer out of the Orbal garrison who came to Aren by a road he does not talk about, with his family, and joined the Aren Guard.', ()=>!!(S.f && S.f.b2_keneb1)]);

const B2CH7 = {
  title:'Aren Way', number:'Seven',
  intro:{loc:'Balahn', sub:'Dusk · where Aren Way begins', scene:'b2_aren_walls', cap:'A raised road going away west between old mounds, and at the end of it, on the sea-light, the walls of Aren.',
    paras:[
`Three days from the Geleen the grass gives out, and the Kherahn Dhobri bring the column down off the plain into Balahn and stop there, the way a river stops at the sea. Balahn is mud walls and goats and a well with a chain and no bucket. Nobody in it has ever seen so many people. Nobody in the column has ever been so glad of mud.`,
`Aren Way begins at Balahn's last wall: a raised road, paved once, running west for three leagues between barrows older than the paving, straight as a lance. From the top of the wall you can see the end of it. A smudge on the sea-light, and towers. Aren.`,
`Behind you, east, a day back or less, the Seventh is still walking backwards with its shields up. Every night since the Geleen you have looked for its fires. Every night there have been fewer.`],
    go:'Into Balahn', node:'b2_c7_start'},

  areas:[
    /* 16 x 12.  Balahn at night: . hardpan  , scrub  # mud walls  = hovels and tents  F the fire  W the squad's cart  h horse lines  r low rock  x the dead tree at the east end */
    { id:'b2_balahn', title:'Balahn', sub:'Night · the head of Aren Way', hint:'Tap ground to move · tap a figure to talk · the dead tree looks east; the squad\'s cart when the squad is ready for the road', decor:'odhan_night', dark:true,
      map:[ "################",
            "#..,..=...,..x.#",
            "#.,.#..,.=.....#",
            "#..,....F...,..#",
            "#.=.#.......=..#",
            "#......,..h....#",
            "#.,..r.........#",
            "#....,...W..,..#",
            "#.=......,...=.#",
            "#..,...,....,..#",
            "#.....,..r.....#",
            "################" ],
      walk:'.,', triggers:{x:'b2_beast', F:'b2_bfire', W:'b2_bcart', h:'b2_bhorses'}, start:{x:7, y:9},
      quest:()=> !S.f.b2_duiker12 ? 'The historian, by the fire.' : !S.f.b2_nobles7 ? 'There is trouble at the Kherahn horse lines. The nobles.' : 'The squad\'s cart, at dawn. Aren Way.',
      npcs:[
        {id:'duiker12', name:'Duiker', kind:'duiker', x:6, y:3, node:()=>'b2_duiker12', fresh:()=>!S.f.b2_duiker12},
        {id:'kherahn7', name:'A Kherahn elder', kind:'kherahn', x:3, y:5, node:()=>'b2_kherahn7', fresh:()=>!S.f.b2_kherahn7},
        {id:'nil7', name:'Nil', kind:'nil', x:11, y:6, node:()=>'b2_nil7', fresh:()=>!S.f.b2_nil7},
        {id:'nether7', name:'Nether', kind:'nether', x:12, y:6, node:()=>'b2_nil7'},
        {id:'temul7', name:'Temul', kind:'temul', x:10, y:4, node:()=>'b2_temul7', fresh:()=>!S.f.b2_temul7},
        {id:'neth7', name:'Lord Nethpara', kind:'nethpara', x:3, y:8, node:()=>'b2_nobles7', show:()=>!!S.f.b2_duiker12, fresh:()=>!!S.f.b2_duiker12 && !S.f.b2_nobles7},
        {id:'pull7', name:'Lord Pullyk Alar', kind:'pullyk', x:4, y:8, node:()=>'b2_nobles7', show:()=>!!S.f.b2_duiker12},
        {id:'ours14', name:'The squad\'s people', kind:'hissari_w', x:10, y:8, node:()=>'b2_ours14', fresh:()=>!S.f.b2_ours14},
        {id:'haddat7', name:'Haddat', kind:'haddat', x:13, y:2, node:()=>'b2_haddat7', show:()=>b2In('haddat'), fresh:()=>b2In('haddat') && !S.f.b2_haddat7},
        {id:'sathi7', name:'Sathi', kind:'sathi', x:12, y:5, node:()=>'b2_sathi7', show:()=>b2In('sathi'), fresh:()=>b2In('sathi') && !S.f.b2_sathi7},
        {id:'tangle7', name:'Tangle', kind:'tangle', x:8, y:7, node:()=>'b2_tangle7', show:()=>b2In('tangle'), fresh:()=>b2In('tangle') && !S.f.b2_tangle7},
        {id:'marrow7', name:'Marrow', kind:'marrow', x:4, y:6, node:()=>'b2_marrow7', show:()=>b2In('marrow'), fresh:()=>b2In('marrow') && !S.f.b2_marrow7},
        {id:'ramin9', name:'Ramin', kind:'redblade', x:13, y:7, node:()=>'b2_ramin9', show:()=>b2In('redblade'), fresh:()=>b2In('redblade') && !S.f.b2_ramin9},
        {id:'ilhar7', name:'Ilhar', kind:'hissari_m', x:6, y:8, node:()=>'b2_ilhar7', show:()=>S.f.b2_ilhar === 'came', fresh:()=>S.f.b2_ilhar === 'came' && !S.f.b2_ilhar7} ] },

    /* 16 x 12.  Aren Way by day, Aren to the west: . the raised road  , dry grass  m barrow mounds  # rock  x a dead tree on a barrow  r the last milestone */
    { id:'b2_way', title:'Aren Way', sub:'Morning · three leagues to the gate', hint:'Tap ground to move · tap a figure to talk · the dead tree; the last milestone, west, is the way to the gate', decor:'barrow',
      map:[ "################",
            "#,,m,,,,x,,,m,,#",
            "#,mm,,,,,,,,mm,#",
            "#,,,,,m,,,,,,,,#",
            "#,,,,,,,,,m,,,,#",
            "#r.............#",
            "#..............#",
            "#,,,m,,,,,,,,,,#",
            "#,,mm,,,,,m,,,,#",
            "#,,,,,,,,,,,,m,#",
            "#,,m,,,,,,,,,,,#",
            "################" ],
      walk:'.,m', triggers:{r:'b2_wstone', x:'b2_wtree'}, start:{x:14, y:6},
      quest:()=> !S.f.b2_duiker13 ? 'The historian, at the front of the column.' : !S.f.b2_wcart ? 'A cart has stopped on the road. Everything behind it has stopped too.' : 'West. The last milestone, and the gate.',
      npcs:[
        {id:'duiker13', name:'Duiker', kind:'duiker', x:11, y:5, node:()=>'b2_duiker13', fresh:()=>!S.f.b2_duiker13},
        {id:'temul8', name:'Temul', kind:'temul', x:9, y:3, node:()=>'b2_temul8', fresh:()=>!S.f.b2_temul8},
        {id:'carter7', name:'A stopped cart', kind:'hissari_m', x:6, y:7, node:()=>'b2_wcarter', fresh:()=>!S.f.b2_wcart},
        {id:'ours15', name:'The squad\'s people', kind:'child', x:12, y:7, node:()=>'b2_ours15', fresh:()=>!S.f.b2_ours15},
        {id:'ilhar8', name:'Ilhar', kind:'hissari_m', x:4, y:5, node:()=>'b2_ilhar8', show:()=>S.f.b2_ilhar === 'came', fresh:()=>S.f.b2_ilhar === 'came' && !S.f.b2_ilhar8} ] },

    /* 16 x 12.  Aren, inside the north wall: . paving  , dust  # wall  t the towers  s the stair up the wall  = awnings  w a well  g the harbour gate */
    { id:'b2_aren', title:'Aren · the north wall', sub:'Inside the gate', hint:'Tap ground to move · tap a figure to talk · the stair up the wall, the well, the harbour gate', decor:'aren',
      map:[ "################",
            "#t.....s.....t.#",
            "#..............#",
            "#.=..,....,..=.#",
            "#..............#",
            "#.,...w....,...#",
            "#..............#",
            "#.=...,....=...#",
            "#.....,........#",
            "#..,.......,...#",
            "#......g.......#",
            "################" ],
      walk:'.,', triggers:{s:'b2_astair', w:'b2_awell', g:'b2_tohar'}, start:{x:7, y:8},
      quest:()=> b2Ph7() <= 1 ? (!S.f.b2_blistig1 ? 'The commander of the Aren Guard, at the foot of the stair.' : 'Up on the north wall. Something is coming down Aren Way.') :
        b2Ph7() === 2 ? (!S.f.b2_blistig2 ? 'Blistig. He wants a word with every squad of the Seventh.' : 'Dawn. The stair to the wall, when the city stirs.') :
        b2Ph7() === 3 ? (!S.f.b2_blistig3 ? 'Blistig, on his rounds.' : 'Night. Every hand on the walls. The stair.') : 'The harbour.',
      npcs:[
        {id:'blistig1', name:'Blistig', kind:'blistig', x:10, y:2, node:()=>b2Ph7() >= 3 ? 'b2_blistig3' : b2Ph7() === 2 ? 'b2_blistig2' : 'b2_blistig1', show:()=>b2Ph7() < 4,
          fresh:()=>b2Ph7() <= 1 ? !S.f.b2_blistig1 : b2Ph7() === 2 ? !S.f.b2_blistig2 : b2Ph7() === 3 && !S.f.b2_blistig3},
        {id:'squint', name:'An old bowman', kind:'squint', x:9, y:1, node:()=>'b2_squint1', show:()=>b2Ph7() <= 1, fresh:()=>b2Ph7() <= 1 && !S.f.b2_squint1},
        {id:'keneb1', name:'Captain Keneb', kind:'keneb', x:4, y:2, node:()=>b2Ph7() >= 2 ? 'b2_keneb2' : 'b2_keneb1', show:()=>b2Ph7() < 4,
          fresh:()=>b2Ph7() <= 1 ? !S.f.b2_keneb1 : b2Ph7() === 2 && !S.f.b2_keneb2},
        {id:'temul9', name:'Temul', kind:'temul', x:12, y:4, node:()=>'b2_nilguard', show:()=>b2Ph7() === 2, fresh:()=>b2Ph7() === 2 && !S.f.b2_nilguardDone},
        {id:'nil9', name:'Nil and Nether', kind:'nether', x:13, y:5, node:()=>'b2_nilguard', show:()=>b2Ph7() === 2},
        {id:'pullyk8', name:'Lord Pullyk Alar', kind:'pullyk', x:2, y:6, node:()=>'b2_pullyk8', show:()=>b2Ph7() === 2, fresh:()=>b2Ph7() === 2 && !S.f.b2_pullyk8},
        {id:'ours16', name:'The squad\'s people', kind:'hissari_w', x:8, y:7, node:()=>'b2_ours16', show:()=>b2Ph7() >= 1 && b2Ph7() <= 3, fresh:()=>b2Ph7() === 2 && !S.f.b2_ours16},
        {id:'haddat9', name:'Haddat', kind:'haddat', x:3, y:8, node:()=>'b2_sq7', show:()=>b2In('haddat') && b2Ph7() >= 2 && b2Ph7() <= 3, fresh:()=>b2In('haddat') && b2Ph7() === 2 && !(S.f.b2_sq7 || {}).haddat},
        {id:'sathi9', name:'Sathi', kind:'sathi', x:12, y:8, node:()=>'b2_sq7s', show:()=>b2In('sathi') && b2Ph7() >= 2 && b2Ph7() <= 3, fresh:()=>b2In('sathi') && b2Ph7() === 2 && !(S.f.b2_sq7 || {}).sathi},
        {id:'tangle9', name:'Tangle', kind:'tangle', x:9, y:9, node:()=>'b2_sq7t', show:()=>b2In('tangle') && b2Ph7() >= 2 && b2Ph7() <= 3, fresh:()=>b2In('tangle') && b2Ph7() === 2 && !(S.f.b2_sq7 || {}).tangle},
        {id:'marrow9', name:'Marrow', kind:'marrow', x:5, y:9, node:()=>'b2_sq7m', show:()=>b2In('marrow') && b2Ph7() >= 2 && b2Ph7() <= 3, fresh:()=>b2In('marrow') && b2Ph7() === 2 && !(S.f.b2_sq7 || {}).marrow},
        {id:'ramin10', name:'Ramin', kind:'redblade', x:13, y:6, node:()=>'b2_ramin10', show:()=>b2In('redblade') && b2Ph7() <= 1, fresh:()=>b2In('redblade') && b2Ph7() <= 1 && !S.f.b2_ramin10} ] },

    /* 16 x 12.  Aren harbour: . the quay  , dust  # the harbour wall and the drop to the water  s the steps down to the boats  = awnings  w a fountain  g the gate up into the city */
    { id:'b2_quay', title:'Aren harbour', sub:'The quay', hint:'Tap ground to move · tap a figure to talk · the steps to the boats, the fountain, the gate', decor:'aren',
      map:[ "################",
            "#######s########",
            "#..............#",
            "#.=...,....=...#",
            "#..............#",
            "#....,...w.....#",
            "#..............#",
            "#.=..,.....=...#",
            "#..............#",
            "#...,....,.....#",
            "#......g.......#",
            "################" ],
      walk:'.,', triggers:{s:'b2_qsteps', w:'b2_qwell', g:'b2_qgate'}, start:{x:7, y:8},
      quest:()=> b2Ph7() < 4 ? (b2OldHandPick() && !b2OH() && !S.f.b2_oldHandNo ? 'A ship out of Genabaris, at the end of the quay. Somebody on it knows a sergeant.' : 'The gate, back up into the city.') :
        !S.f.b2_c7_ready ? 'The Silanda is in. Hear the squad out, and the ones who would have you.' : 'Choose the road out: the Aren Guard (Blistig), the Wickans (Temul), or the landward gate, and Seven Cities.',
      npcs:[
        {id:'oldhand', name:'One of the Fourth', get kind(){ return b2OldHandPick() || 'b2soldier'; }, x:11, y:2, node:()=>'b2_oldhand', show:()=>b2Ph7() < 4 && !!b2OldHandPick() && !b2OH() && !S.f.b2_oldHandNo, fresh:()=>b2Ph7() < 4 && !!b2OldHandPick() && !b2OH() && !S.f.b2_oldHandNo},
        {id:'gesler7', name:'Gesler', kind:'gesler', x:5, y:2, node:()=>'b2_gesler7', show:()=>b2Ph7() >= 4, fresh:()=>b2Ph7() >= 4 && !S.f.b2_gesler7},
        {id:'stormy7', name:'Stormy', kind:'stormy', x:4, y:2, node:()=>'b2_gesler7', show:()=>b2Ph7() >= 4},
        {id:'blistig4', name:'Blistig', kind:'blistig', x:12, y:4, node:()=>'b2_blistig4', show:()=>b2Ph7() >= 4, fresh:()=>b2Ph7() >= 4 && !!S.f.b2_c7_ready && !S.f.b2_c7_key},
        {id:'keneb4', name:'Captain Keneb', kind:'keneb', x:13, y:4, node:()=>'b2_keneb4', show:()=>b2Ph7() >= 4, fresh:()=>b2Ph7() >= 4 && !S.f.b2_keneb4},
        {id:'temul10', name:'Temul', kind:'temul', x:2, y:4, node:()=>'b2_temul10', show:()=>b2Ph7() >= 4, fresh:()=>b2Ph7() >= 4 && !!S.f.b2_c7_ready && !S.f.b2_c7_key},
        {id:'nilq', name:'Nil and Nether', kind:'nil', x:3, y:5, node:()=>'b2_nilq', show:()=>b2Ph7() >= 4, fresh:()=>b2Ph7() >= 4 && !S.f.b2_nilq},
        {id:'ours17', name:'The squad\'s people', kind:'hissari_w', x:8, y:6, node:()=>'b2_ours17', show:()=>b2Ph7() >= 4, fresh:()=>b2Ph7() >= 4 && !S.f.b2_ours17},
        {id:'q_haddat', name:'Haddat', kind:'haddat', x:5, y:8, node:()=>'b2_last_haddat', show:()=>b2Ph7() >= 4 && b2In('haddat'), fresh:()=>b2Ph7() >= 4 && b2In('haddat') && !S.f.b2_lastH},
        {id:'q_sathi', name:'Sathi', kind:'sathi', x:12, y:8, node:()=>'b2_last_sathi', show:()=>b2Ph7() >= 4 && b2In('sathi'), fresh:()=>b2Ph7() >= 4 && b2In('sathi') && !S.f.b2_lastS},
        {id:'q_tangle', name:'Tangle', kind:'tangle', x:10, y:9, node:()=>'b2_last_tangle', show:()=>b2Ph7() >= 4 && b2In('tangle'), fresh:()=>b2Ph7() >= 4 && b2In('tangle') && !S.f.b2_lastT},
        {id:'q_marrow', name:'Marrow', kind:'marrow', x:3, y:8, node:()=>'b2_last_marrow', show:()=>b2Ph7() >= 4 && b2In('marrow'), fresh:()=>b2Ph7() >= 4 && b2In('marrow') && !S.f.b2_lastM},
        {id:'q_oh', name:'The Old Hand', get kind(){ return b2OH() || 'b2soldier'; }, x:13, y:7, node:()=>'b2_last_oh', show:()=>b2Ph7() >= 4 && !!b2OH() && b2In(b2OH()), fresh:()=>b2Ph7() >= 4 && !!b2OH() && b2In(b2OH()) && !S.f.b2_lastOH},
        {id:'q_ilhar', name:'Ilhar', kind:'hissari_m', x:9, y:8, node:()=>'b2_last_ilhar', show:()=>b2Ph7() >= 4 && S.f.b2_ilhar === 'came', fresh:()=>b2Ph7() >= 4 && S.f.b2_ilhar === 'came' && !S.f.b2_lastI} ] } ],

  battles:{
    /* the run: Dom's horse have come round the Seventh, and hit the column on Aren Way among the barrows. Hold the road while the
       stretch runs past. Then the last barrow before the walls, and their captain between the stretch and the gate */
    b2_runway:{title:'Aren Way', style:'barrow', warrenText:'Aren Way, morning · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["..,..m..",".,...mm.","..t.....","........","...,..,.",".mm.....",".m...t..","........","..,.....","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      get allies(){ return b2Help7('b2_wyouth'); },
      get foes(){ return b2Hands5() > 3 ? [['b2_domrider',2,1],['b2_domrider',5,1],['b2_domrider',3,2],['b2_domarcher',1,0],['b2_domarcher',6,0]] : b2Hands5() ? [['b2_domrider',2,1],['b2_domrider',5,1],['b2_domarcher',3,0]] : [['b2_domrider',3,1],['b2_domarcher',4,0]]; }, xp:150, after:'b2_after_run',
      get waves(){ return (b2Hands5() > 3 ? [{round:3, foes:[['b2_domrider',7,3]], text:'Another of them comes down off a barrow on the flank, on foot, his horse left blowing on the mound behind him.'}] : [])
        .concat(S && S.f && S.f.b2_wcart === 'lifted' ? [{round:4, foes:[['b2_domrider',0,4]], text:'One more, from the south barrows: the time it took to lift a cart, come due.'}] : []); },
      stage2:{title:'The last barrow', xp:60, keepAllies:true,
        text:()=>`The riders on the road are down or gone. The stretch is running, carts and all, and the walls of Aren are close enough now to see the men on them.

Between the stretch and the gate, on the last barrow before the walls, a captain of Dom's horse has put a dozen of his people across the road, on foot, with their horses held behind the mound. He has done the sum. A column that has to stop is a column that dies in sight of the gate. ${b2In('haddat') ? '"Through them," Haddat says. It is not a suggestion.' : 'Through them, then.'}`,
        map:["...mm...","..mmmm..",".,mmmm,.","........","..t..t..","........","...,....","........",",.......","........"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        get foes(){ return b2Hands5() > 3 ? [['b2_ridercap',3,1],['b2_domrider',2,2],['b2_domrider',5,2],['b2_domarcher',4,0]] : b2Hands5() ? [['b2_ridercap',3,1],['b2_domrider',2,2],['b2_domarcher',4,0]] : [['b2_ridercap',3,1]]; },
        get waves(){ return b2Hands5() > 3 ? [{round:3, foes:[['b2_domrider',7,2]], text:'One of the horse-holders lets the horses go and comes down off the mound with a lance, because his captain is shouting.'}] : []; }} },

    /* THE BARROW: the rearguard's last stand, without the sergeant. A hold-out nobody wins: held or broken, it goes on (def.lastStand, 47) */
    b2_barrow:{title:'The Barrow', style:'barrow', lastStand:true, warrenText:'The Barrow · Denul fouled to the bottom, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["..,..,..",".,....,.","..mmmm..",".mmmmmm.",".tmmmmm.",".mmmmtm.",".mmmmmm.","..mmmm..",".,....,.","........"],
      party:[[3,4],[4,3],[2,5],[3,6],[4,6],[5,4]],
      allies:[['b2_reg5',2,3],['b2_reg5',5,6],['b2_bent',4,3]],
      foes:[['b2_frenzy',1,0],['b2_frenzy',4,0],['b2_frenzy',7,1],['b2_pike',0,8],['b2_frenzy',6,9],['b2_domarcher',3,9]], xp:100, after:'b2_after_barrow',
      objective:{type:'survive', rounds:4, text:'Hold the mound four rounds. Then hold it again.'},
      waves:[{round:2, foes:[['b2_frenzy',0,4],['b2_frenzy',7,5]], text:'They come up the flanks of the mound, two and three at a time, not in order, not caring, the way the sea comes up a beach.'},
             {round:3, foes:[['b2_pike',7,8],['b2_frenzy',0,1]], text:'More. There will always be more. Somebody on the mound says so, and somebody laughs.'},
             {round:4, foes:[['b2_frenzy',3,0],['b2_frenzy',4,9]], text:'From both ends of the Way now. The road is black with them.'}],
      stage2:{title:'The top of the mound', xp:50, keepAllies:true, objective:{type:'survive', rounds:3, text:'The crest. Three more rounds. Nobody is counting any more but you.'},
        text:()=>`The Seventh goes back up the mound a step at a time, facing front, the way the Seventh goes back, until there is nowhere left to go back to. The crest. The Fist's standard is there, and the Fist under it, and round them what is left: a few hundred, and then fewer.

${b2And(b2Rearguard())} ${b2Rearguard().length === 1 ? 'is' : 'are'} at the crest with them.${b2Rearguard().includes('sathi') ? ' Hackle is at Sathi\'s knee, hackles up, as he has been since Hissar.' : ''}`,
        map:["........","..,..,..",".mmmmmm.",".mm,,mm.",".mm,,mm.",".mmmmmm.","..mmmm..","........","..,..,..","........"],
        party:[[3,3],[4,3],[3,4],[4,4],[2,5],[5,5]],
        foes:[['b2_frenzy',1,0],['b2_frenzy',6,0],['b2_pike',0,7],['b2_frenzy',7,8],['b2_domarcher',3,9]],
        waves:[{round:2, foes:[['b2_frenzy',0,3],['b2_frenzy',7,4]], text:'Up the sides of the crest, over their own dead.'},
               {round:3, foes:[['b2_frenzy',3,9],['b2_pike',4,0]], text:'And more.'}]} },

    /* the night after the sortie: a postern by the tanneries found unbarred, and Dom's people at it, and ladders on the wall beside it.
       Then the gate-passage, and the captain who was told it would be open */
    b2_postern:{title:'The postern', style:'aren', dark:true, warrenText:'Aren, the night after · the warrens quieter than they have been all summer, and still fouled', warren:{denul:.9, meanas:.9}, music:'battle',
      map:["###..###","#......#","#.t..t.#","#......#","##....##","#......#","#.t....#","#......#","#......#","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      get allies(){ const a = b2Help7('b2_areng'); if (S && S.f && S.f.b2_hackleBack && !b2In('sathi')) a.push(['hackle', 4, 7]); return a; },
      get foes(){ return b2Hands5() > 3 ? [['b2_ladder',3,0],['b2_ladder',4,0],['b2_ladder',2,1],['b2_wallbow',1,1],['b2_wallbow',6,1]] : b2Hands5() ? [['b2_ladder',3,0],['b2_ladder',4,0],['b2_wallbow',6,1]] : [['b2_ladder',3,0],['b2_wallbow',6,1]]; }, xp:170, after:'b2_after_postern',
      get waves(){ return b2Hands5() > 3 ? [{round:2, foes:[['b2_wallbow',3,1]], text:'A bowman of Dom\'s gets onto the wall-walk above the postern from a ladder nobody saw, and starts shooting down into the passage.'}, {round:3, foes:[['b2_ladder',6,3]], text:'A ladder comes up against the inside of the wall where nobody was watching, and a man comes over it with a knife in his teeth.'}] : []; },
      stage2:{title:'The gate-passage', xp:80, keepAllies:true,
        text:()=>`The postern is held. The ladders are down. And in the passage behind the north gate, where the bar should be, there is a lantern, and men in Dom's colours with a captain among them who came in by some other door, and who stands by the great bar of Aren's gate as if he had been told it would already be lifted.

He looks at you. He looks at the bar. ${b2In('tangle') ? 'Tangle hums four notes, and stops on the third.' : 'Somebody behind you says a short prayer.'}`,
        map:["#..##..#","#......#","#.t..t.#","#......#","#......#","##.##.##","#......#","#......#","#......#","#......#"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        get foes(){ return b2Hands5() > 3 ? [['b2_postcap',3,1],['b2_ladder',1,2],['b2_ladder',6,2],['b2_wallbow',2,0]] : b2Hands5() ? [['b2_postcap',3,1],['b2_ladder',1,2],['b2_wallbow',2,0]] : [['b2_postcap',3,1]]; },
        get waves(){ return b2Hands5() > 3 ? [{round:3, foes:[['b2_ladder',1,4]], text:'One more out of the dark of the passage, where the lantern does not reach.'}] : []; }} } },

  foes:{
    /* Dom's horse on Aren Way, fighting on foot among the barrows */
    b2_domrider:{name:'Dom\'s rider', sig:'r', kind:'bhilard', hp:17, ac:14, atk:5, dmg:[1,8,2], rng:1, mv:5, init:3, sk:['bleed'], verb:'drives a lance at'},
    b2_ridercap:{name:'A captain of Dom\'s horse', sig:'C', kind:'guran_officer', hp:36, ac:16, atk:6, dmg:[1,10,3], rng:1, mv:4, init:3, boss:true, sk:['rally', 'parry'], verb:'cuts at'},
    /* the Barrow: Dom's footsoldiers, frenzied, eager, without order */
    b2_frenzy:{name:'Dom\'s footsoldier', sig:'f', kind:'rebel', hp:15, ac:13, atk:5, dmg:[1,8,2], rng:1, mv:4, init:2, sk:['bleed'], verb:'hacks at'},
    /* the postern */
    b2_ladder:{name:'Ladder-man', sig:'l', kind:'guran', hp:18, ac:15, atk:5, dmg:[1,8,2], rng:1, mv:4, init:2, sk:['shove'], verb:'cuts at'},
    b2_wallbow:{name:'Dom\'s bowman', sig:'a', kind:'rebel_bow', hp:13, ac:12, atk:5, dmg:[1,8,1], rng:6, mv:4, init:2, sk:['pin'], verb:'looses at'},
    b2_postcap:{name:'The captain at the bar', sig:'B', kind:'guran_officer', hp:40, ac:16, atk:6, dmg:[1,10,3], rng:1, mv:4, init:3, boss:true, sk:['parry', 'rally'], verb:'cuts at'},
    /* hands: the Wickan children on the road, the Aren Guard on the walls, Bent at the Barrow */
    b2_wyouth:{name:'A Wickan youth', sig:'y', kind:'wickan', hp:16, ac:13, atk:5, dmg:[1,8,1], rng:5, mv:6, init:3, verb:'looses at'},
    b2_areng:{name:'Aren Guard', sig:'g', kind:'aren_guard', hp:20, ac:15, atk:4, dmg:[1,8,2], rng:1, mv:4, init:1, verb:'cuts at'},
    b2_bent:{name:'Bent', sig:'b', kind:'bent', hp:18, ac:13, atk:5, dmg:[1,6,2], rng:1, mv:6, init:3, verb:'bites'} },

  scenes:{
    b2_aren_walls:{loc:'Aren Way', sub:'The walls of Aren', cap:'Aren\'s walls from the road, high and pale, with people running toward them along the raised way between the barrows.', amb:'wind'},
    b2_barrow:{loc:'The Barrow', sub:'Aren Way · within sight of the walls', cap:'A mound on the road, seen from far off: a dark knot on top of it, a sea round it, and over it the crows in a cloud.', amb:'wind'},
    b2_aren_way:{loc:'Aren Way', sub:'Dawn', cap:'The road at dawn, going away north between the barrows, and along it, small with distance, shapes standing upright that are not trees.', amb:'dusk'},
    b2_harbour:{loc:'Aren', sub:'The harbour', cap:'Ships at anchor in a grey harbour, more ships than any harbour should hold, and none of them going anywhere.', amb:'lake'},
    b2_finale:{loc:'Aren Way', sub:'After', cap:'Crows over an empty barrow, and the city behind it, very quiet.', amb:'dusk'} },

  end:{
    guard:['The Aren Guard', 'The Chain of Dogs came into Aren and the Fist did not. He died on a barrow in sight of the walls, and ten thousand of the Empire\'s soldiers watched him do it, and the next day the High Fist marched them out and lost every one. The squad stood on the walls with Blistig\'s three hundred and held the door. When the Adjunct\'s fleet comes in, the squad will be on the quay to meet it, in the Aren Guard\'s sashes.'],
    wickans:['With the Wickans', 'The Chain of Dogs came into Aren and the Fist did not. He died on a barrow in sight of the walls, and the crows took him. The squad held a door in the city for the last of his warlocks, and stood on the walls while the High Fist lost his army, and when it was done it went with the Wickan children, Temul and Nil and Nether, because somebody had to ride beside them who had seen it.'],
    desert:['Off the map', 'The Chain of Dogs came into Aren and the Fist did not. He died on a barrow in sight of the walls, and the next day the High Fist lost ten thousand more along the same road. The squad held the walls, and then it went out of the landward gate with its people, into Seven Cities, where nobody keeps a roll and every well has a name.'] },
  endScene:'b2_finale',
  endCap:()=> `Aren, at the end of it. ${S.f.b2_gateCount ? `${numw(S.f.b2_gateCount, true)} of the squad's stretch came in at the gate. ` : ''}Out on Aren Way the crows have gone. The barrow is only a barrow again.`,
  tease:'The epilogue: the road out of Aren, a page for every one of the squad, and the end of Book Two.',

  extras:()=>{ const f = S.f, x = [];
    if (f.b2_gateCount != null) x.push(`${b2Gate7()} of the squad's stretch came in at Aren's north gate.${f.b2_runLost ? ` Aren Way cost ${numw(f.b2_runLost)}.` : ''}`);
    if (f.b2_duikerTold7 || f.b2_duikerTold3) x.push('The historian had the column\'s story from the sergeant, names and all. He took it out of the gate with him on the morning of the sortie.');
    if (f.b2_nobles7 === 'backed') x.push('At Balahn the squad stood behind the historian when the nobles tried to buy horses to ride ahead. Lord Pullyk remembered the sergeant\'s face.');
    b2Fallen().forEach(id => x.push(`${NAME(id)} fell at the Barrow with the Fist's rearguard.`));
    if (f.b2_coltaineGone) x.push('From the north wall the squad saw an old bowman of the Guard end it for the Fist, and the crows take him.');
    if (f.b2_hackleBack) x.push('Sathi\'s whistle brought Hackle home along Aren Way at dusk, through the gate, to the sergeant.');
    if (f.b2_raminGone) x.push('Ramin went to the High Fist\'s cells with the Red Blades, alive, and given back.');
    if (f.b2_raminMsg) x.push(`The Red Blades' commander had Ramin's message: he was not given back. He was kept.${f.b2_sashGiven ? ' And the sash.' : ''}`);
    if (b2OH()) x.push(`${NAME(b2OH())} of the Fourth came ashore from a Genabaris transport and stood the last night on the walls with the squad.`);
    if (f.b2_sortieNo) x.push('The squad did not march out with the High Fist. It stood on the walls with Blistig.');
    if (f.b2_nilGuard) x.push('The squad stood in a door with the Wickan children the night the High Fist sent for the warlocks.');
    if (f.b2_kenebHelp) x.push('On the morning of the sortie the squad showed Captain Keneb where to find Blistig. What he told him, the squad did not hear.');
    if (f.b2_posternDone) x.push('The night after the sortie the squad held a postern somebody had left unbarred, and the bar of the north gate.');
    if (f.b2_silandaBack && b2Mate(f.b2_silandaWho)) x.push(`The Silanda came into Aren harbour on the last morning, and ${NAME(f.b2_silandaWho)} came down the plank whole.`);
    if (f.b2_woundHealed && b2Mate(f.b2_woundWho)) x.push(`${NAME(f.b2_woundWho)}'s Vathar wound closed in Aren, at last.`);
    if (f.b2_girlsFound) x.push(`${B2.elder} and ${B2.younger} were alive in Aren. ${B2_BOY} found them.`);
    if (trickBy('b2_squint')) x.push(`${NAME(trickBy('b2_squint'))} breathes out before a shot now, the way the old bowman showed on the stair.`);
    return x; },

  journal:()=>{ const f = S.f; return [
    f.b2_c7Start && `At Balahn, where Aren Way begins, the Kherahn Dhobri turned back. The column ran the last three leagues to Aren past barrows older than anybody's name for them.`,
    f.b2_gateCount != null && `Aren opened its north gate for the refugees.`,
    f.b2_coltaineGone && `The Fist's last four hundred stood on a barrow within sight of the walls. Bult fell, and List with the standard, and Lull; Bent was speared. The Fist was crucified alive on the mound. Kamist Reloe blasted the crows out of the sky to keep them from him. Commander Blistig sent for an old bowman of the Guard, Squint, who shot the Fist from the wall, and the crows came down over the body and it was gone.`,
    f.b2_sortieSeen && `At dawn High Fist Pormqual marched the whole army of Aren out after Dom, on Mallick Rel's advice, with the Red Blades locked in the cells and the historian taken along. Dom's army broke and ran, and drew it into a basin among the hills, and surrounded it. The High Fist surrendered. A warchief took his head.`,
    f.b2_wayDead && `Along Aren Way, over a day and a half, ten thousand of the Empire's soldiers were crucified. The historian was the last of them, at the far north end. Nobody could reach him.`,
    f.b2_posternDone && `Blistig's three hundred held the walls. Dom did not take Aren.`,
    f.b2_ph7 >= 4 && `The Adjunct's fleet is less than a week out.`].filter(Boolean); },

  dlg:{}
};

/* ---------------- Balahn: the night before the run ---------------- */
Object.assign(B2CH7.dlg, {
  b2_c7_start:()=>{ const rg = b2Rearguard();
    return {sp:'Balahn', scene:'b2_aren_walls', fx:()=>{ if (!S.f.b2_c7Start) { S.f.b2_c7Start = 1; S.f.b2_drank = 0; S.f.b2_drankSkip = 0; S.f.b2_dry = 0; } }, txt:
`The column comes down into Balahn at dusk and fills it, and overfills it, and spreads out round it in the scrub until the village is an island of mud walls in a sea of carts.

The Kherahn will go home in the morning. They have brought the column to where the road begins, which is what they were paid for, and they have fed it, which they were not. Tomorrow it is three leagues of Aren Way, and the gate, and whatever is behind the gate.

${rg.length ? `You count the squad at the halt, out of habit. You get to the end and keep counting: ${b2And(rg)}, ${rg.length === 1 ? 'a day back' : 'a day back, all of them'}, with the Fist.${rg.includes('sathi') ? ' There is no dog at the squad\'s fire. You keep looking for him under the cart.' : ''} ` : 'You count the squad at the halt, out of habit, and get the right number, and count again anyway. '}${b2Away() ? `And ${NAME(b2Away())}, in Aren, if the ship got there. ` : ''}${b2Hurt() ? `${NAME(b2Hurt())} sits down at the halt carefully, the Vathar wound bound tight, and says Aren will have clean healers. ` : ''}${b2In('tangle') ? `"${b2Count()}," Tangle says, to the satchel. ` : ''}${b2In('marrow') ? `Marrow has ${b2Knots()}.` : ''}`,
    html:chainHTML('Balahn · the head of Aren Way'),
    ch:[b2DeckChoice(7), {t:'Look round.', go:()=>startExplore()}]}; },
  /* the reading at Balahn, the last halt before Aren (47c) */
  b2_c7_deck:()=>b2DeckOffer(7, 'b2_c7_card'),
  b2_c7_card:()=>b2DeckCard(7),

  /* ---- Duiker: the column's story ---- */
  b2_duiker12:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker12 = 1; S.f.b2_duiker = 1; }, txt:
`The historian is sitting on Balahn's well-head, which has a chain and no bucket, with the bottle on its cord outside his shirt for once, turning it in his fingers in the firelight.

"Three leagues," he says. "Three leagues of road, Sergeant, and a city at the end of it with ten thousand soldiers inside, and a High Fist, and a fleet in the harbour." He looks east. "And they have not come out. Not one rider. Not a wagon of water. Ten thousand, and they have not come out." He puts the bottle back inside his shirt.

${S.f.b2_duikerTold3 ? `"You gave me your stretch's story at the Ridge. I have it. I want the rest. I want the end of it written by somebody who was there, and I want it written in Aren, at a table, with a lamp." He almost smiles. "Walk at the front with me tomorrow."` : `"You still owe me a column, you know. The story of it. Names. I asked on the Geleen." He looks at you. "Tonight, if you like. Or in Aren, at a table, with a lamp. I would like very much to sit at a table with a lamp."`}`,
    ch:[{t:'Tell him now. The whole road, from Hissar, and every name you have.', req:()=>!S.f.b2_duikerTold7, fx:()=>{ S.f.b2_duikerTold7 = 1; if (b2In('haddat')) loy('haddat', 1); }, go:'b2_duiker12b'},
        {t:'"In Aren, sir. At a table, with a lamp."', go:'b2_duiker12c'}]}),
  b2_duiker12b:()=>({sp:'Duiker', txt:
`It takes half the night. You tell it the way the column happened, not the way an army would tell it: the water-sellers' quarter burning, the carts at the gate, ${S.f.b2_key === 'daughters' ? `two girls and a jar` : `a boy running back into the fire with your word`}, the ford at the Sekala, the Shallows, the Vathar, the Nenoth, the forty hours, the Geleen. ${b2In('haddat') ? 'Haddat sits down beside you halfway through and gives him the names when you falter, in the quarter\'s Hissari, and he writes them as she says them, asking her to spell each one.' : 'You give him the names. You falter, and he waits, and you find them.'}

He writes it all down in a small hand, by the light of somebody else's fire. When it is done he closes the book and holds it on his knee for a while.

"Thank you," he says. "Nobody is ever going to believe a word of it." He puts the book inside his shirt with the bottle. "Good. That's how you know it's history."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_duiker12c:()=>({sp:'Duiker', txt:`"In Aren, then." He nods, as if you had signed something. "At a table, with a lamp. I'll hold you to it, Sergeant." He goes back to turning the bottle in his fingers, and does not look east again, which takes some doing.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the Kherahn go home ---- */
  b2_kherahn7:()=>({sp:'A Kherahn elder', fx:()=>{ if (!S.f.b2_kherahn7) { S.f.b2_kherahn7 = 1; chain(1, 0, 'A Kherahn skin'); } }, txt:
`The old woman of the Kherahn Dhobri, the one who judged the chests on the Geleen, is sitting on her blanket at the edge of Balahn with her small horse saddled beside her, ready to go home in the morning. She has a skin of water across her knees. She holds it out to you without a word.

${b2In('haddat') ? `She says something. Haddat listens. "She says the road from here is short and the gate is shut," Haddat says. "She says a gate is a thing for keeping people out, whatever the people inside say it is for." Haddat pauses. "She says: walk them, anyway."` : `She says something you do not understand, and points west along the road, at the far smudge of the city, and shakes her head; and then points at the column, and nods.`}${S.f.b2_paid ? `

Her two healers, the ones the squad's silver bought, are going along your stretch one last time by lamplight, kneeling, and getting up, and kneeling. They will ride home at dawn with the rest. The stretch has learned their names.` : ''}`,
    ch:[{t:'Take the skin, and bow.', go:()=>startExplore()}]}),

  /* ---- the warlocks, and Temul ---- */
  b2_nil7:()=>({sp:'Nil and Nether', fx:()=>{ S.f.b2_nil7 = 1; S.f.b2_nil = 1; }, txt:
`Nil is asleep sitting up against a wall with his knees drawn up, the way a child sleeps on a cart. Nether is not asleep. She is standing at the end of Balahn with her arms folded, looking east, where the road goes back.

"The crows went that way," she says, when you come up. Not to you. "All day. All the crows on the Odhan, going east, over us, as if we were not here." She does not unfold her arms. "They are going to him."${b2In('sathi') ? `

Sathi, behind you, says something in Wickan, quietly. Nether answers without turning round. Then both of them are quiet for a long time.` : ''}`,
    ch:[{t:'Leave them.', go:()=>startExplore()}]}),

  b2_temul7:()=>({sp:'Temul', fx:()=>{ S.f.b2_temul7 = 1; }, txt:
`A young Wickan with a lance and a face that is trying very hard to be older, going down the line of the children's horses checking girths, because somebody has to, and the somebody is him.

"Temul," he says, when you ask. "Crow Clan." He pulls a girth tight. "The children are mine to bring to Aren. Mine, and the warlocks'. The Fist said." He looks at you, measuring. "You are the sergeant with the stretch. The one who walks in front of it instead of behind."${b2In('sathi') ? ` His eyes go to Sathi, and stay a moment. "And the Weasel who would not be sent." Sathi grins at him with her teeth. He does not grin back, but something in him unclenches.` : ''}

"Tomorrow my riders go on the flanks of the road, and we go fast, and we do not stop," he says. "If Dom's horse come round the Seventh, they will come at the people. We will be between." He goes back to the girths. "We will be between," he says again, to the horse, as if it had argued.`,
    ch:[{t:'"So will we."', fx:()=>{ S.f.b2_temulWord = 1; }, go:()=>startExplore()},
        {t:'Leave him to the horses.', go:()=>startExplore()}]}),

  /* ---- the nobles: a separate deal with the Kherahn for horses to ride ahead. Duiker forbids it; the squad may stand behind him ---- */
  b2_nobles7:()=>({sp:'Lord Nethpara', fx:()=>{ S.f.b2_nethpara = 1; S.f.b2_pullyk = 1; }, txt:
`At the Kherahn horse lines Lord Nethpara and Lord Pullyk Alar are standing with a Kherahn horse-dealer and a purse. The purse is open. The dealer is looking at it the way the old woman looked at the chests on the Geleen.

"Fresh horses," Nethpara is saying, very reasonably. "For the carriages. To ride ahead, to Aren, tonight, and tell the High Fist the column is coming, so that he can make ready to receive it. It is a service. To the column." He sees you, and his face does a thing. ${S.f.b2_stewardWon || S.f.b2_conduct ? 'He has seen you before. At the Vathar.' : ''}

Pullyk says nothing. Pullyk watches you.

Then the historian is there, out of breath from the well, with his notebook still in his hand. "No," says Duiker. "No horses. The carriages walk with the column, at the column's pace, as they have since Hissar. You will not ride ahead to tell the High Fist anything." He is shaking. "I know what you would tell him."`,
    ch:[{t:'Stand at the historian\'s shoulder. Say nothing.', fx:()=>{ S.f.b2_nobles7 = 'backed'; if (b2In('haddat')) loy('haddat', 1); }, go:'b2_nobles7b'},
        {t:'Stay back. It is the historian\'s fight.', fx:()=>{ S.f.b2_nobles7 = 'watched'; }, go:'b2_nobles7c'}]}),
  b2_nobles7b:()=>({sp:'Lord Pullyk Alar', txt:
`You stand at Duiker's shoulder. ${b2In('haddat') ? 'Haddat stands at yours, and puts her shield on the ground in front of her, rim down, the way a Hissari puts down a thing she is not going to pick up again. ' : ''}You say nothing at all. You do not need to.

The dealer closes the purse and gives it back to Nethpara and walks away to his horses, because the Kherahn have watched the Seventh for a long time now, and know which side of a soldier to stand.

"Sergeant," says Pullyk Alar, very pleasantly. It is the first word he has spoken. "I shall remember your face." He takes Nethpara's arm, and they go back to their carriages.

Duiker lets his breath out. "He will," he says. "He remembers everything. It is the only thing he is good at."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_nobles7c:()=>({sp:'Duiker', txt:`You stay back. The historian stands there alone, shaking, with the notebook in his hand, and the dealer looks at him, and at the column's fires behind him, and closes the purse and gives it back, because the Kherahn have watched the Seventh a long time. The nobles go back to their carriages. Pullyk looks at you as he passes, once, the way a man looks at a column in a ledger.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the squad's people ---- */
  b2_ours14:()=>({sp:b2Ours6() || 'The squad\'s people', fx:()=>{ S.f.b2_ours14 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.younger} has climbed Balahn's wall and is sitting on top of it with her father's jar in her lap, looking west, at the smudge on the sea-light.

"Has it got wells," she says, when you come up. "Aren." You say it has. A great many. "Sweet ones?" Some. "Father would know which." She looks at the jar. ${S.f.b2_jar === 'kept' ? `"It's full. From Dojal. I'm not drinking it. It's for when we're there."` : `"It's empty. I'll fill it in Aren. From a sweet one."`} ${B2.elder}, below the wall, is pretending not to listen.` : S.f.b2_jarboy ?
`${B2_BOY} is sitting with the Wickan children's wagons, where he has sat every night since the Geleen, asking the riders as they come in. "The Crow girl says the youngest ones are all going into Aren together," he says. "The children who rode. And the ones they carried." He does not look up. "If they're anywhere, Sergeant, they're in Aren. Or they're nowhere." He does not say which he thinks.` : S.f.b2_yedda ?
`${B2.widow} has got her rope off her shoulder for the first time since the wheel came off, and is sitting on it. "Three leagues," she says. "I walked further than that to market every week of my life." Her grandsons are asleep against her. "With a cart, mind."` :
`Your people, round the fires in Balahn's scrub, eating Kherahn bread. A child from the weavers' street asks you if Aren has a sea. You say it does. She has never seen one. Neither has anyone near her. They talk about it for an hour.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the squad, the night before the run ---- */
  b2_haddat7:()=>({sp:'Haddat', fx:()=>{ S.f.b2_haddat7 = 1; }, txt:
`Haddat is at the east end of Balahn with her shield on her back, looking down the road the column came in by. ${S.f.b2_ilhar === 'came' ? 'Her brother is asleep at the stretch\'s fire behind her, with their mother\'s skins for a pillow.' : ''}

"I say them every night," she says. "The stretch's names. Since Hissar." She does not turn round. ${b2Rearguard().length ? `"Tonight I said theirs as well. ${b2And(b2Rearguard())}. After the stretch." She is quiet. "I did not know where in the list to put them. I put them at the end. It felt like the wrong place."` : `"Tonight I said the Seventh's as well. The ones I know. Bult. Lull. List. The Fist." She is quiet. "I do not know why. They are not dead."`}${S.f.b2_ilhar === 'parted' ? `

"Somewhere back there is my brother, with Dom," she says. "Filling skins." She almost smiles. "Somebody has to."` : S.f.b2_ilhar === 'lost' ? `

"And somewhere back there, or nowhere, is my brother." She says his name, once, to the road.` : ''}`,
    ch:[{t:'Stand with her a while.', go:()=>startExplore()}]}),
  b2_sathi7:()=>({sp:'Sathi', fx:()=>{ S.f.b2_sathi7 = 1; }, txt:
`Sathi is with the Wickan children's horses, because she was sent with the children, and is pretending not to be one of them. Hackle is lying across her feet.

"The crows went east all day," she says. "Every one." She pulls Hackle's ear. "In Hissar, the night the city burned, they came down over his tent. I said it meant something. Nobody listened." Her teeth show${S.f.b2_sathiTeeth ? ', filed' : ''}. "Now they listen. Now everybody is looking at the crows."

She does not laugh. "Tomorrow, Sergeant, you look at the road. I will look at the sky. Hackle will look at everything."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_tangle7:()=>({sp:'Tangle', fx:()=>{ S.f.b2_tangle7 = 1; }, txt:
`Tangle has the satchel open on the tailboard and is not counting it. He is listening, with his head on one side, to the east.

"Spades," he says. "You can't hear them. I can. Bungle's lot, in the last ditch, a day back. Mincer singing." He is quiet a while. "${b2Count()}," he says then, without looking. "Into Aren. That was the sum. Three leagues and it comes out." He closes the satchel. ${b2Rearguard().includes('marrow') || b2Rearguard().includes('haddat') ? `"Wish it came out for everybody."` : `"Then I'll find out what I'm for, after."`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_marrow7:()=>({sp:'Marrow', fx:()=>{ S.f.b2_marrow7 = 1; }, txt:
`Marrow is sitting on an upturned basket at the stretch's fire with her hat over her face, because Marrow sits down whenever she can.

"The children's flux is mending," she says, under the hat. "Kherahn bread. Clean water. Nobody shooting at them for three days. It turns out that's the cure for most things." She lifts the hat. ${S.f.b2_warrenFloor ? `"And the warren's gone quiet, child. Since the Geleen. The thing at the bottom has stopped moving when I touch it." She frowns. "Either it's asleep or it's gone somewhere else. I've no idea which is worse."` : `"The warren's thinner tonight. Less mud. As if whatever was wading through it had waded off somewhere." She frowns. "I don't trust it."`}`,
    ch:[{t:'Let her sit.', go:()=>startExplore()}]}),
  b2_ramin9:()=>({sp:'Ramin', fx:()=>{ S.f.b2_ramin9 = 1; }, txt:
`Ramin is polishing the red of his scale at the stretch's fire, a scale at a time, as he does every night.

"In Aren the company will remount," he says. "The commander has said so. There is a Red Blade company in the city already, our brothers, with horses and a commander of their own." He holds a scale up to the light. "In Aren I will be given back." He says it the way he has said it since the Sekala. Tonight it sounds different, and he hears it, and puts the scale down. "It is a good word, given. I have liked being lent, Sergeant. I did not expect to."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ilhar7:()=>({sp:'Ilhar', fx:()=>{ if (!S.f.b2_ilhar7) { S.f.b2_ilhar7 = 1; chain(2, 0, 'A cistern only a water-seller would find'); } }, txt:
`Ilhar comes back to the stretch's fire in the dark with two skins full and his sleeves wet to the elbow. "Balahn's well is foul," he says. "A goat in it, years back. There's a cistern under the headman's floor. He didn't want to tell me. I asked him like a water-seller." He hands you the skins. "Aren Way is dry the whole three leagues. Drink tonight."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the camp: east, the fire, the horses, the cart ---- */
  b2_beast:()=>({sp:'The east end of Balahn', txt:
`A dead tree at the end of the village, and from beside it the road back east, the way the column came, going away into the dark between the low hills.

There are fires out there. A long way off. A day, perhaps. A thin line of them, very small, and very few.

${b2Rearguard().length ? `You look at them a long time. ${b2And(b2Rearguard())} ${b2Rearguard().length === 1 ? 'is' : 'are'} at one of them. You cannot tell which. You look at each of them in turn, to be sure.` : 'Every one of them is somebody you know. You look at each of them in turn.'}`,
    ch:[{t:'Back.', go:()=>startExplore()}]}),
  b2_bfire:()=>({sp:'The squad\'s fire', txt:`Thornwood and goat dung, burning low, against a mud wall that holds the warmth. The squad's fire. Behind it, the stretch, and the road.`,
    ch:[{t:'Drink, and sleep.', tag:'1 water', req:()=>!S.f.b2_balahnRest && chainW() > 0, fx:()=>{ S.f.b2_balahnRest = 1; dgRest('The squad sleeps against Balahn\'s mud wall, with the road at its feet. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_bhorses:()=>({sp:'The horse lines', txt:`The Kherahn's small horses on one side, saddled for home, and the Wickan children's on the other, saddled for Aren. Neither lot of riders is talking to the other. Both are watching the east.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_bcart:()=>({sp:'The squad\'s cart', txt: !S.f.b2_duiker12 ?
`The squad's cart, with the stretch asleep round it. The historian is at the well. He will want a word before the road; he always does.` :
`The squad's cart, and the stretch round it, packing in the dark. The east is going grey. The Kherahn are mounting up to go home, and the column is getting up off the ground with a sound like a whole country sighing.

Three leagues.`,
    ch:[{t:'Onto Aren Way.', req:()=>!!S.f.b2_duiker12, go:'b2_way_go'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_way_go:()=>({sp:'Aren Way · dawn', scene:'b2_aren_walls', fx:()=>{ S.f.b2_way = 1; }, txt:
`The column goes out of Balahn onto the raised road at first light and starts to run.

Not run: nobody in it can run any more. Walk fast, faster than it has walked since Hissar, the carts first, the old on the carts, the children carried, the stretch closed up round its wagon like a fist. The barrows go by on either side, old green humps in the dry grass, older than anybody's name for them. The road is paved under the dust. It rings under the carts.

${b2In('sathi') ? 'Sathi is on the flank with Temul\'s children, looking at the sky.' : 'Temul\'s children ride the flanks, looking at the south.'} Behind the column, on the hills to the south-east, there is dust where there should not be any.

Dom has sent his horse round the Seventh.`,
    ch:[{t:'Keep them moving.', go:()=>{ startExplore('b2_way'); talk('b2_way_arrive'); }}]}),
});

/* ---------------- Aren Way: the run ---------------- */
Object.assign(B2CH7.dlg, {
  b2_way_arrive:()=>({sp:'Aren Way', scene:'b2_aren_walls', txt:
`Three leagues. The walls ahead get no bigger for the first hour, and then all at once they are a city: pale stone on a pale sky, towers, and a gate, and on the walls, small as ants, people watching.

The dust to the south-east is horsemen now. A great many. Coming at the long slant that a rider takes when he means to arrive at the same place you do, a little before you.

Temul's children are already turning their horses to face them.`,
    html:chainHTML('Aren Way · three leagues'),
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  b2_duiker13:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker13 = 1; }, txt:
`The historian is at the head of the column on his bad horse, half standing in the stirrups to see the walls.

"They're on the walls," he says. "Thousands. Watching." He sits down hard. "Watching, Sergeant." He gets hold of himself. "Keep them moving. Don't stop for anything. Not for the riders, not for the carts, not for me." He looks at you. ${S.f.b2_duikerTold7 || S.f.b2_duikerTold3 ? `"I have your column written down. Every name. If you stop, I'll have to cross them out, and I won't."` : `"You owe me a column. I'm collecting in Aren. Don't you dare make it a short one."`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_temul8:()=>({sp:'Temul', fx:()=>{ S.f.b2_temul8 = 1; }, txt:
`Temul rides along the flank of the stretch with his lance across his saddle-bow, calling to the children in Wickan, short words, and they spread out along the south side of the road between the barrows like dogs round a herd.

"They will come at the carts," he says, pulling up beside you. "Not at the soldiers. At the carts. Because the carts are slow and the soldiers are few." He looks at you, and at your squad. ${S.f.b2_temulWord ? '"You said you would be between. Be between."' : '"Where will you be?"'} He does not wait for the answer. He is fifteen, perhaps sixteen, and he rides away down the line as if he had been doing this for thirty years.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- a cart stopped on the road ---- */
  b2_wcarter:()=>({sp:'A stopped cart', txt: S.f.b2_wcart ?
`Where the cart was. ${S.f.b2_wcart === 'lifted' ? 'It went on, rocking, on a wheel the squad held up by hand until the pin went in.' : 'It is still there, on its side in the ditch, and nobody beside it now.'}` :
`A handcart from the potters' street with its axle-pin sheared, down on one wheel in the middle of the road, and an old man and his daughter-in-law and three children trying to lift it, and behind it everything has stopped: a hundred people, two carts, a goat, all standing, all looking south at the dust.

${b2In('tangle') ? '"Pin\'s gone," Tangle says. "Thirty breaths with a spike and four backs. More with three."' : 'Thirty breaths, with a spike and some backs, to get a pin in.'} The dust to the south is a lot closer than thirty breaths.`,
    ch: S.f.b2_wcart ? [{t:'On.', go:()=>startExplore()}] : [
      {t:'Lift it. Everyone. Now.', fx:()=>{ S.f.b2_wcart = 'lifted'; if (b2In('haddat')) loy('haddat', 1); if (b2In('marrow')) loy('marrow', 1); }, go:'b2_wcart_lift'},
      {t:'Leave the cart. Carry the children. Go.', fx:()=>{ S.f.b2_wcart = 'left'; if (b2In('tangle')) loy('tangle', 1); }, go:'b2_wcart_leave'}]}),
  b2_wcart_lift:()=>({sp:'A stopped cart', txt:
`${b2In('haddat') ? 'Haddat puts her shoulder under the bed of it before you have finished saying it. ' : ''}You lift. Everyone who can get a hand on it lifts, the old man too, and ${b2In('tangle') ? 'Tangle drives a spike in for a pin with the butt of his crossbow, four blows, humming,' : 'somebody drives a spike in for a pin with a stone,'} and the cart comes down on two wheels and goes, and the hundred behind it go, and the goat.

It took longer than thirty breaths. The dust to the south has turned into men on horses, and they have seen the road stop, and they are coming to where it stopped.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_wcart_leave:()=>({sp:'A stopped cart', fx:()=>{ if (!S.f.b2_wcartLost) { S.f.b2_wcartLost = 1; chain(0, -1, 'The potters\' cart'); } }, txt:
`You take the smallest child yourself. The daughter-in-law takes the next. The old man will not leave the cart. He sits down beside it in the road, with his back to the wheel, and says something in the quarter's Hissari, and waves you on with the back of his hand, the way you wave away a fly.

${b2In('haddat') ? 'Haddat asks him his name as she goes past. He tells her. She will say it tonight.' : 'You do not know his name. You will want it, later.'} The road starts moving again. Behind you, you hear the riders reach the cart.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ours15:()=>({sp:b2Ours6() || 'The squad\'s people', fx:()=>{ S.f.b2_ours15 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.elder} has ${B2.younger} on her back, and the jar in her arms, and is walking faster than she has walked since Hissar with her eyes on the gate. ${B2.younger} is looking backwards over her shoulder at the dust. "They're coming," she says. "Imra, they're coming." "I know," says ${B2.elder}. She does not slow down.` : S.f.b2_jarboy ?
`${B2_BOY} is on the squad's cart with a stick, because the drover has a child in his arms. He is driving the ox the way a water-seller's boy drives anything, with a great deal of noise and no hitting at all. The ox does not understand. It goes anyway.` : S.f.b2_yedda ?
`${B2.widow} is walking with the rope on her shoulder and a grandson by each hand, very fast, and talking the whole time, to the grandsons, to the rope, to God. "A city," she says, to you, as you pass. "With a sea. I'll believe it when I'm wet."` :
`Your people, walking faster than they can, with their eyes on the gate and the dust both, the children carried, the old on the cart. Nobody is talking. Nobody has the breath.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ilhar8:()=>({sp:'Ilhar', fx:()=>{ S.f.b2_ilhar8 = 1; }, txt:`Ilhar is walking at the side of the road with his mother's skins on his back, giving water to whoever holds out a hand, a mouthful each, not a drop on the stones. "No wells on the Way," he says. "Never were. The old kings didn't want anyone stopping between Balahn and the gate." He gives a child a mouthful. "Clever of them. Keep walking."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_wtree:()=>({sp:'A dead tree on a barrow', txt:
`A dead tree on top of a barrow, the only height on the Way. From up here you can see the whole of it: the column strung along the road, a league of it, carts and walkers and the Wickan children on the flanks; the riders coming down the south slant to meet it; the walls of Aren ahead, close now, and thick with people.

And behind, far back to the east, where the road comes out of the hills, a dark knot on the road, moving slowly, that is not riders. It is close. Much closer than a day.

The Seventh.`,
    ch:[{t:'Down.', go:()=>startExplore()}]}),

  /* ---- the last milestone, and the riders ---- */
  b2_wstone:()=>({sp:'The last milestone', txt: !S.f.b2_wcart ?
`An old stone at the side of the road with a word cut in it in a script nobody uses any more. The gate is close. But behind you the column has stopped: something on the road, a cart down, and a hundred people standing round it looking south.` :
`An old stone at the side of the road with a word cut in it in a script nobody uses any more, and beyond it the last of the barrows, and beyond that the gate.

Dust on the barrows to the south. Riders. Once the squad turns to hold the road here, it holds it.`,
    ch: !S.f.b2_wcart ? [{t:'Back to the cart.', go:()=>startExplore()}] : [{t:'Turn. Hold the road.', go:'b2_wstone_hold'}, {t:'Not yet.', go:()=>startExplore()}]}),
  /* Dom's riders at the milestone, once the squad has turned to hold the road */
  b2_wstone_hold:()=>({sp:'The last milestone', txt:
`The riders have reached the road. Behind you, among the barrows, Dom's horse are coming down onto the paving from the south, on foot some of them, leading their horses up the barrow-sides to get round the Wickan children, and coming at the carts.

Your stretch is the last of the column. Everything between the riders and the people is you.`,
    ch:[
      {t:'Hold the road. Let the stretch run past.', go:()=>startBattle('b2_runway', {})},
      {t:'Tangle: a smoker across the road behind the carts, so their bows are blind.', tag:'uses 1 smoker', req:()=>b2In('tangle') && S.inv.smoker > 0, fx:()=>{ S.inv.smoker--; },
        go:()=>startBattle('b2_runway', {pre:'Tangle lobs a smoker into the road behind the last cart, and the paving goes white from barrow to barrow, and the riders in it are shooting at nothing.'})},
      {t:'Sathi and Hackle up the barrow, the Weasel way, round behind them.', check:['guile', 15], req:()=>b2In('sathi'),
        edges:id=>[id === 'sathi' && ['Hackle knows a barrow-side', 2], id === 'haddat' && ['mail', -1], id === 'redblade' && ['spurs', -2]],
        go:'b2_wstone_quiet', fail:'b2_wstone_loud'}]}),
  b2_wstone_quiet:()=>({sp:'Aren Way', txt:`${by({sathi:'Sathi goes up the side of the barrow on her belly with the dog, and over the top, and the first rider who comes round the foot of it never sees what pulls him down.', _:'{who} goes up the barrow with Sathi and the dog, and over, and the first rider round the foot of it never sees them.'})}`, ch:[{t:'Now.', go:()=>startBattle('b2_runway', {surprise:'p'})}]}),
  b2_wstone_loud:()=>({sp:'Aren Way', txt:`A stone goes rolling down the barrow-side under somebody's foot, and every rider at the foot of it looks up at once.`, ch:[{t:'At them.', go:()=>startBattle('b2_runway', {})}]}),

  b2_after_run:()=>({sp:'Aren\'s north gate', scene:'b2_aren_walls', fx:()=>{ if (S.f.b2_gateCount == null) { const c = chainC(), r = S.f.b2_lastRounds || 8;
      let loss = c ? Math.round(c * .06) + (r > 12 ? 2 : r > 9 ? 1 : 0) - (S.f.b2_paid ? 1 : 0) : 0; if (c >= 5) loss = Math.max(1, loss); loss = Math.max(0, Math.min(c, loss));
      S.f.b2_runLost = loss; if (loss) chain(0, -loss, 'Aren Way'); S.f.b2_gateCount = chainC(); } }, txt:
`The captain goes down on the last barrow with his people round him, and the rest pull their horses round and go back south among the mounds, and the road is clear, and the stretch runs.

It runs past you, the last of the column, carts and walkers and children carried, through the shadow of the walls, and the gate is open. Somebody on the walls has opened it. Men in the Aren Guard's colours are in the gateway, pulling people through by the arms.

You come through last. You count them as they go in. ${S.f.b2_runLost ? `Aren Way had ${numw(S.f.b2_runLost)} of them, among the barrows, before the riders broke. ${b2In('haddat') ? 'Haddat has the names.' : 'You have the names.'}` : 'Aren Way had none of them. You count again to be sure.'}

${b2Gate7()}. That is the stretch that walked out of Hissar behind you, and grew, and shrank, and came here. ${S.f.b2_gateCount ? 'It is the only number you have ever cared about.' : 'It is nobody, now. You count it anyway.'}`,
    html:chainHTML('Aren · the north gate'),
    ch:[{t:'Into Aren.', go:()=>{ startExplore('b2_aren'); talk('b2_aren_arrive'); }}]}),
});

/* ---------------- Aren: the north wall, and the Barrow ---------------- */
/* through their eyes: each one who stayed, on the mound, before the fight and at the end of it */
const B2_BAR7 = {
  haddat:()=>`Haddat is in the front of it with her shield up and her lips moving. She is saying the names: the stretch's, from Hissar, and then the rearguard's, the ones she has learned since the Geleen, and then, when she runs out, the Seventh's, any she knows.${S.f.b2_ilhar === 'parted' ? ' She is looking past the faces coming up the mound, for one face. She does not expect to find it. She looks anyway.' : ''}`,
  sathi:()=>`Sathi is ${S.f.b2_sathiClan === 'yes' ? 'with the last of the Weasels at the foot of the mound, on the bony grey, laughing' : 'on foot among the Seventh\'s shields, with her bow, laughing'}, because the Weasels laugh when they fight, and because there is nothing on this mound worth being afraid of any more. Hackle is at her knee. Above them, over the whole of the Way, the sky is filling up with crows.`,
  tangle:()=>`Tangle is in the ditch Bungle's company dug round the foot of the mound in the night, with Mincer three spades down from him, singing. ${S.f.b2_satchel6 === 'went' ? `He has the satchel open on the lip of the ditch. "${b2Count()}," he says, to nobody, and then, to the satchel: "Right. Let's see what you're for."` : 'He has a spade and a crossbow and a pile of stones. "Rocks," he says. "Bungle says we\'re good at rocks."'}`,
  marrow:()=>`Marrow is sitting down behind the shields with her kit open in front of her, because Marrow sits down whenever she can, and there are a great many people on this mound who need a healer and only one healer. ${S.f.b2_warrenFloor ? 'She has her hand in the warren already. At the bottom of it, where the thing sat since the Vathar, there is nothing now.' : 'The warren is thin and wrong. She reaches into it anyway.'}`,
  redblade:()=>`Ramin is in the line in his red scale with the short lance, very straight, the only red on the whole mound, and the tribes coming up the slope see it and shout *lapdog*, and he answers them politely, in their own dialect, which makes them angrier.`,
};
const B2_BAREND7 = {
  haddat:()=>`Haddat says names until she cannot. The last one she says is the sergeant's, which was not on any list, and which she put at the end.${S.f.b2_ilhar === 'parted' ? ` Behind Dom's lines, at the edge of the road, there is a water-cart, and a man in a city coat standing on it, quite still, with a skin over his shoulder, watching the mound. She lifts her shield to him, once. He lifts his hand.` : ''}`,
  sathi:()=>`Sathi sees them come. The crows: the whole sky of them, coming down. She is laughing when she sees it. *I said*, she says, in Wickan, to Hackle. *In Hissar. I said it meant something.* Hackle is standing over her, hackles up, and then he is not; nobody on the mound sees where a Wickan dog goes when the clan does not need him any more.`,
  tangle:()=>`Tangle hums four notes in the ditch, and stops on the fourth, and ${S.f.b2_satchel6 === 'went' && (S.inv.cusser || S.inv.sharper || S.inv.burner) ? 'the last thing in the satchel goes out over the lip of it, end over end, into the middle of them. The sum comes out' : 'throws the last of his rocks, and picks up the spade. The sum comes out anyway'}. Mincer stops singing at the same time. Nobody hears what they say to each other.`,
  marrow:()=>`Marrow reaches into the warren one more time, for a boy of the Seventh who has stopped breathing beside her, and for the first time since Hissar it is clean all the way to the bottom: cool, and quiet, and smelling of temple oil. The boy breathes. She has no string to tie it on; she gave it away. She ties a knot in the strap of her kit instead. Then she sits down, properly, the way she has been wanting to for twelve years.`,
  redblade:()=>`Ramin holds a street's width of the mound on foot, the way the Red Blades were drilled to when the horses would not, until there is no street left to hold. He is the last red anyone sees on the Barrow.`,
};
Object.assign(B2CH7.dlg, {
  b2_aren_arrive:()=>({sp:'Aren', scene:'b2_aren_walls', fx:()=>{ if (!S.f.b2_ph7) S.f.b2_ph7 = 1; }, txt:
`Inside the gate Aren is a city that has never been hungry. Clean streets. Fountains. Shops with their shutters down, and faces at the shutters. And soldiers: the High Fist's army, in clean kit, in rank after rank, ten thousand of them, who have stood behind these walls all summer and have not marched a step.

They look at the column coming in through the gate the way you would look at something that walked up out of the sea.

The refugees go where the Aren Guard points them, into the squares by the harbour. The historian goes up the north tower without a word to anybody, with Nil and Nether behind him, to see the road. Everybody who can is going up on the north wall.

Out on Aren Way the dust has stopped moving east to west. It is standing still now, on the road, in sight of the walls.`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  b2_blistig1:()=>({sp:'Blistig', fx:()=>{ S.f.b2_blistig1 = 1; }, txt:
`A heavy, sour man in the Aren Guard's colours at the foot of the wall stair, with a commander's knot on his shoulder, watching the refugees go past him as if each of them were a personal accusation.

"Blistig," he says. "Aren Guard. I had the gate opened for your lot, and the High Fist has had words with me about it, and I have had words back." He spits. "He says the enemy are too many to sally. He has ten thousand men in this city and a fleet in the harbour, and he says it." He looks up the stair. "Your Fist is on the road. An hour out. Less. Go up and see it, if you've the stomach. Everybody else is."`,
    ch:[{t:'"The Fist is still coming?"', go:'b2_blistig1b'},
        {t:'Up the wall.', go:()=>startExplore()}]}),
  b2_blistig1b:()=>({sp:'Blistig', txt:`"Coming." He laughs, short, with nothing in it. "He stopped. On the barrow nearest the walls, just out of bowshot. Four hundred of them, or about. And behind them Dom's whole army, like the sea behind a sandbar." He does not look at you. "He stopped where we could see him, Sergeant. That's what he's done. He stopped where every man on these walls could see him."`, ch:[{t:'Up the wall.', go:()=>startExplore()}]}),

  /* ---- Squint, an old bowman on the stair ---- */
  b2_squint1:()=>({sp:'An old bowman', fx:()=>{ S.f.b2_squint1 = 1; }, txt:
`An old man of the Aren Guard sitting halfway up the wall stair, out of everybody's way, waxing a bowstring between his finger and thumb, very slowly, as if there were nothing on the other side of the wall at all.

"Don't mind me," he says. "Old. Slow. They call me Squint, on account of the one eye's better than the other." He tests the string. "Everybody's going up to look. I've looked. I'll look again when there's something to see." He sights along the stave, at nothing. "There's a thing you do, before the loose. With the breath. Nobody does it any more. Too slow, they say."`,
    ch:[{t:'"Show me."', check:['wits', 16], trick:'b2_squint', req:()=>!S.f.b2_squintTry, fx:()=>{ S.f.b2_squintTry = 1; },
          edges:id=>[id === 'sathi' && ['a horse-bow is a bow', 2], id === 'tangle' && ['a crossbow is half a bow', 1], ['ellis', 'kettle'].includes(id) && ['an old hand', 1], id === 'haddat' && ['she has never drawn a bow in her life', -1]],
          go:'b2_squint_yes', fail:'b2_squint_no'},
        {t:'Leave him to his string.', go:()=>startExplore()}]}),
  b2_squint_yes:()=>({sp:'Squint', txt:
`${by({sathi:'Sathi sits down two steps below him with her horse-bow across her knees, and he looks at the bow, and grunts, and shows her.', tangle:'Tangle sits down with the crossbow, and Squint looks at it with deep disapproval, and shows him anyway.', _:'{who} sits down beside him, and he shows {who}.'})}

You draw, he says. And then you wait. And you let the breath go, slow, all of it, until there is nothing in you that moves, not your chest, not your hands, not your heart if you can help it. "Then the arrow goes where the empty man is looking," he says. "Not where you're looking. Where *he* is." He does not seem to like knowing it.

He goes back to his string. "Nobody does it any more," he says. "Too slow."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_squint_no:()=>({sp:'Squint', txt:`He shows you. You try it. The breath will not go all the way out; there is always something in you that moves. "Aye," says Squint. "There is in most. That's why nobody does it." He goes back to waxing the string.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Keneb ---- */
  b2_keneb1:()=>({sp:'Captain Keneb', fx:()=>{ S.f.b2_keneb1 = 1; }, txt:
`An officer in a garrison coat from somewhere inland, too heavy for Aren, with an Aren Guard sash over it, standing by the refugees' line with a slate, counting them in. A tired, ordinary face. He looks up as your stretch goes past.

"Keneb," he says. "Captain. I was at Orbal, when it rose. I've got my wife and my children out, which is more than..." He stops. "I came by a road I don't talk about. The Guard took me on." He looks at the slate. "How many did you bring in, Sergeant? Your own. Not the column. Yours."

You tell him: ${S.f.b2_gateCount ? numw(S.f.b2_gateCount) : 'none'}. He writes it down, carefully, beside a mark that is probably your squad, and underlines it.

"Good," he says. "Somebody should count."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ramin10:()=>({sp:'Ramin', fx:()=>{ S.f.b2_ramin10 = 1; }, txt:
`Ramin is standing at the edge of a square where a company of Red Blades in good scale, with horses, is drawn up in ranks, Aren's own Red Blades, and your stretch's, what is left of them, are falling in at the end of the ranks on foot. He is looking at the horses.

"The commander here has asked for us," he says. "All of us. Tonight." He does not move toward them yet. "It is a strange thing, Sergeant. All the way from the Sekala I have wanted to be asked for. And now..." He looks at the stair, where everyone is going up to the wall. "Now I would like to see the Fist, first. From the wall. I think I owe him that."`,
    ch:[{t:'"Come up, then. They\'ll wait."', go:()=>startExplore()}]}),

  /* ---- the stair, the well, the harbour gate ---- */
  b2_astair:()=>({sp:'The wall stair', txt: b2Ph7() <= 1 ?
`The stair up the inside of the north wall, worn hollow in the middle of every step, and people on it going up, all of them, soldiers and refugees and the Guard, nobody talking.` : b2Ph7() === 2 ?
`The stair, and the wall above, dark, with the Guard's lanterns along it. Out on the Way there is no light at all where the barrow is. ${S.f.b2_blistig2 ? 'At dawn the High Fist musters below this wall.' : 'Blistig is looking for the Seventh\'s squads.'}` : b2Ph7() === 3 ?
`The stair, and the wall, and the Guard going up it with every bow in the armoury. Out on the Way, along the road in the dusk, there are the shapes. You do not look at them for long. ${S.f.b2_blistig3 ? 'Blistig wants every hand on the wall tonight.' : ''}` :
`The stair, quiet. The wall is the Guard's now, and the Guard is three hundred tired men who held it.`,
    ch:[{t:'Up onto the north wall.', req:()=>b2Ph7() <= 1, go:'b2_wall_up'},
        {t:'Up. Dawn. The muster.', req:()=>b2Ph7() === 2 && !!S.f.b2_blistig2, go:'b2_muster'},
        {t:'Up. The night watch.', req:()=>b2Ph7() === 3 && !!S.f.b2_blistig3, go:'b2_postern_go'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_awell:()=>({sp:'A well', txt:
`A city well with a stone lip and a bucket on a chain, and water in it, sweet, as much as anyone could want, and a line of the column at it, drinking, not believing it. ${S.f.b2_ilhar === 'came' ? 'Ilhar is at the front of the line, tasting it like a merchant. "Good," he says. "Rain-cistern. Third best in the city, I should think."' : ''}${S.f.b2_arenWater ? '' : '\n\nThe squad has not filled a skin from a well since Dojal Spring.'}`,
    ch:[{t:'Fill every skin the squad has.', tag:'+6 water', req:()=>!S.f.b2_arenWater, fx:()=>{ S.f.b2_arenWater = 1; chain(6, 0, 'Aren\'s wells'); }, go:()=>startExplore()},
        {t:'Drink, and sleep while there is time.', tag:'1 water', req:()=>b2Ph7() >= 2 && b2Ph7() <= 3 && !S.f[`b2_arenRest${b2Ph7()}`] && chainW() > 0, fx:()=>{ S.f[`b2_arenRest${b2Ph7()}`] = 1; dgRest('The squad sleeps in the lee of the wall with its boots on, in a city, for the first time since Hissar. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:`Find a clean healer for ${b2Hurt() ? NAME(b2Hurt()) : 'the wounded'}.`, req:()=>!!b2Hurt() && b2Ph7() >= 2, go:'b2_heal7'},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_tohar:()=>({sp:'The harbour gate', txt: b2Ph7() <= 1 ?
`An inner gate, down to the harbour, where the refugees are being taken. Not now. Everyone who can is on the north wall.` :
`An inner gate in the old wall, down to the harbour: the smell of the sea and of tar, and masts over the roofs, more masts than any harbour should hold.`,
    ch:[{t:'Down to the harbour.', req:()=>b2Ph7() >= 2, go:()=>{ startExplore('b2_quay'); talk(b2Ph7() >= 4 ? 'b2_quay4' : 'b2_quay2'); }},
        {t:'Not now.', go:()=>startExplore()}]}),

  /* ---- the north wall: the Seventh comes ---- */
  b2_wall_up:()=>{ const rg = b2Rearguard();
    return {sp:'The north wall', scene:'b2_barrow', fx:()=>{ S.f.b2_wallUp = 1; }, txt:
`The north wall of Aren, and all along it, shoulder to shoulder, the soldiers of the city: the Guard, the High Fist's army, ten thousand, and the column's people among them, all looking the same way.

On the tower above you, at the corner of the wall: the historian, very still; Nil, sitting down against the parapet; Nether, standing; a soft, heavy man in gilded armour who must be the High Fist; a priest at his elbow in a priest's robes${S.f.b2_relSeen ? ', the one who blessed the squad at Hissar' : ''}; and Blistig.

Out on Aren Way, just out of bowshot, there is a barrow, and on the barrow there is the Seventh. Four hundred, or about. The Fist's standard. And all round the barrow, and back along the road as far as you can see, Dom's army, like the sea round a rock.

${rg.length ? `Somewhere on that mound are ${b2And(rg)}${rg.includes('sathi') ? ', and a dog' : ''}. From here they are a dark knot of shields, and you cannot tell one from another. You look anyway.` : 'Every one of the squad is on this wall with you. You look at the mound anyway, at every shield on it, as if you could tell one from another at this distance.'}`,
    ch: rg.length ? [{t:`The mound. ${b2And(rg)}.`, fx:()=>{ b2LastStand(); }, go:'b2_barrow_cut'}] : [{t:'Watch.', go:'b2_wall_watch'}]}; },

  /* ---- THE BARROW: through their eyes ---- */
  b2_barrow_cut:()=>{ const rg = b2Rearguard();
    return {sp:'The Barrow', scene:'b2_barrow', txt:
`Not the wall. The mound.

From up here the city is close enough to throw a stone at, if anyone had a stone left, and its walls are thick with people, and not one of them is coming out.

The Seventh has stopped here because there is nowhere further to go. The Fist is at the top of the barrow under the standard, on foot, in his black feathers, with Bult beside him and Corporal List holding the standard because nobody else would let him. Captain Lull's marines are on the north face with their one-eyed captain. Bungle's sappers have dug a ditch round the foot of the mound in the night, and Mincer is in it, singing. Bent, the Fist's old cattle-dog, is going round the line with his head low, the way a dog goes round a herd before weather.

${rg.map(id => B2_BAR7[id] ? B2_BAR7[id]() : '').filter(Boolean).join('\n\n')}

Dom's army comes up the mound.`,
      ch:[{t:'Hold.', go:()=>startBattle('b2_barrow', {})},
          {t:'Tangle: the satchel, into the first rank of them.', tag:'uses 1 cusser', req:()=>b2In('tangle') && S.inv.cusser > 0, fx:()=>{ S.inv.cusser--; },
            go:()=>startBattle('b2_barrow', {pre:'Tangle hums four notes in the ditch, and stops on the fourth, and lobs a cusser into the first rank coming up the mound, and the mound shakes, and the first rank is not there.'})}]}; },

  b2_after_barrow:()=>{ const rg = b2Rearguard(), held = !!S.f.b2_barrowHeld;
    return {sp:'The Barrow', scene:'b2_barrow', txt:
`${held ? 'They hold. Four rounds, and three more at the crest, longer than anyone on the walls would have said a few hundred could hold anything against all of that. It makes no difference. It makes all of it.' : 'They do not hold to the end of it. Nobody could. Nobody on the mound is counting rounds any more.'}

Bult goes down under the lances at the foot of the standard, cursing his nephew. List holds the standard until he cannot, and then the standard goes down, and List with it, and nobody sees his face, but the ones near him say afterwards, if there were an afterwards, that he looked like a man who had found what he was looking for. Lull's marines close round their captain and then there is no north face. Bent goes into the front of them with his teeth and does not come back.

${rg.map(id => B2_BAREND7[id] ? B2_BAREND7[id]() : '').filter(Boolean).join('\n\n')}

And then the sea comes up over the mound.`,
      ch:[{t:'The walls.', fx:()=>{ b2LastStandEnd(); }, go:'b2_wall_watch'}]}; },

  /* ---- the walls: the end of the Fist ---- */
  b2_wall_watch:()=>{ const fell = b2Fallen();
    return {sp:'The north wall', scene:'b2_barrow', txt:
`From the wall it is small, and far, and it takes a long time.

${fell.length ? `You did not see ${b2And(fell)} go down. Nobody on the wall could have. You watched the mound, all of it, every shield, and you will tell yourself afterwards that you knew the moment, and you will not be sure.` : `You see Bult go down at the foot of the standard, under lances. You see the standard go down, and come up, and go down. You see a dog go into the front of them and not come back. You see the north face of the mound, where the marines are, close, and then there is no north face.`}

The sea comes up over the barrow. And then it draws back a little, and there are a few of the Seventh still standing at the top, and then there are none, and one.

They do not kill him. They take him. On the top of the mound they put up a cross of timber, and lift him onto it, alive, in his black feathers, where every man on the walls of Aren can see.

${b2In('haddat') ? 'Haddat makes a sound you have never heard her make.' : ''}${b2In('marrow') ? ' Marrow sits down on the wall walk, very suddenly, and does not get up.' : ''}${b2In('tangle') ? ' Tangle is not humming.' : ''}`,
    ch:[{t:'Watch.', go:'b2_wall_crows'}]}; },
  b2_wall_crows:()=>({sp:'The north wall', scene:'b2_barrow', txt:
`Then the crows come.

All the crows on the Odhan, it looks like: they come in from the east over the Way, and they do not stop coming, until they are a cloud over the barrow, and then the sky, and the sun goes out. The whole wall goes dim under them. The noise of them is like rain.

Down at the foot of the mound a man on a horse lifts his hands, and fire goes up into the cloud from them, and crows fall out of the sky in hundreds, burning. ${S.f.b2_reloe ? 'Kamist Reloe.' : 'A mage of Dom\'s.'} He does it again. And again. He is trying to keep them off the cross.

On the tower the historian is shouting at the High Fist. You can hear him over the crows. *Sally. Sally, damn you, he's alive, he is still alive.* The High Fist says something. You hear it, because everybody on the wall is listening: *The enemy are too many.* The priest at his elbow says something soft, agreeing.${b2Dog7() ? ' Hackle, at the foot of the tower stair, has his lips back from his teeth, looking up at the priest, and will not stop growling.' : ''}

Blistig has the historian by the arms, holding him back from the High Fist. Then Blistig lets go of him, and turns his head, and says something to a runner. The runner goes down the stair at a run.`,
    ch:[{t:'Watch.', go:'b2_wall_squint'}]}),
  b2_wall_squint:()=>({sp:'The north wall', scene:'b2_barrow', txt:
`The runner comes back with an old man. ${S.f.b2_squint1 ? 'Squint, from the stair, with his bow and his waxed string.' : 'An old bowman of the Guard, with his bow.'} He comes up onto the wall beside the tower, and Blistig says something to him, short, and points.

The old man looks at the barrow. It is too far. Everybody on the wall knows it is too far; you can see him know it. His hands are shaking. He nocks anyway. He draws. ${S.f.b2_squint1 ? 'And then he waits, and lets the breath go, slowly, all of it, the way he said nobody does any more, until there is nothing in him that moves.' : 'And then he waits, a long time, and goes very still.'}

He looses.

The arrow goes up and up, too high, into the dim under the crows, and everybody on the wall watches it, and on the cross on the barrow, the Fist lifts his head and looks up, at the walls, at the arrow coming, as if he had been waiting for it.

It takes him in the forehead.

On the tower, Blistig puts his hand on the old man's shoulder. You are close enough to hear. "Ten thousand soldiers will be saying your name tonight, old man," he says. "Like a prayer." The old man does not answer. He goes down the stair with his bow, and nobody stops him, and nobody sees him again.`,
    ch:[{t:'Watch.', go:'b2_wall_gone'}]}),
  b2_wall_gone:()=>({sp:'The north wall', scene:'b2_barrow', fx:()=>{ S.f.b2_coltaineGone = 1; S.f.b2_coltaine = 1; }, txt:
`The crows come down.

All of them, at once, out of the dim, onto the barrow, onto the cross, until the top of the mound is a black shape that moves, and Dom's army round it stands back from it. Nobody burns them now. Then they lift again, all together, with a sound like a sail, and go up, and away east over the Way, and the sun comes back.

The cross is empty. There is nothing on it at all.

${b2In('sathi') ? `Sathi is laughing. She is crying too; you can see it; Wickan manners. "I said," she says, to you, to Hackle, to the wall. "In Hissar. The night the city burned. They came down over his tent and I said it meant something." Hackle howls, and on the tower Nether is wailing, a long sound with no words in it, and Nil is lying on the stones.` : `On the tower Nether is wailing, a long sound with no words in it, and Nil is lying on the stones. Somewhere along the wall a Wickan child is laughing, the funeral laugh, and nobody tells her to stop.`}

The historian is standing at the parapet with his hands flat on it. You hear him say it, to nobody. *They are all dead.*`,
    ch:[{t:'Blow Sathi\'s whistle, out over the Way.', req:()=>b2Fell('sathi') && S.kit.includes('b2_whistle') && !S.f.b2_hackleBack, go:'b2_whistle'},
        {t:'Down off the wall.', go:'b2_evening'}]}),
  b2_whistle:()=>({sp:'The north wall · dusk', fx:()=>{ S.f.b2_hackleBack = 1; }, txt:
`You blow it. It makes no sound you can hear properly; it never did. You blow it again, out over the Way, at the barrow, at the dusk. Nothing.

You are still standing there, with the bone whistle in your fist, when the light is nearly gone, and something comes along the road from the barrow, low, limping, between the dead, the colour of old rope.

"Open the postern," Blistig says, behind you. You did not hear him come. "For the dog." Somebody does.

Hackle comes up the wall stair on three legs and lies down across your feet, the way he lay across Sathi's, and puts his head on his paws, and does not look at anybody. He smells of crows.`,
    ch:[{t:'Down off the wall.', go:'b2_evening'}]}),
});

/* ---------------- Aren: the night after the Barrow ---------------- */
/* the squad's own, after the Barrow, one line each (S.f.b2_sq7[id]) */
const b2Sq7 = id => { S.f.b2_sq7 ??= {}; S.f.b2_sq7[id] = 1; };
Object.assign(B2CH7.dlg, {
  b2_evening:()=>({sp:'Aren · dusk', scene:'b2_aren_walls', fx:()=>{ if (b2Ph7() < 2) S.f.b2_ph7 = 2; }, txt:
`The walls empty slowly. Nobody says anything on the stairs. Ten thousand men go down off the walls of Aren and back to their billets in the dusk, and not one of them looks at another.

In the square below the north tower the Red Blades are drawn up in the lantern-light, all of them, Aren's company with its horses and what came in with the column on foot, and round them in a ring are the High Fist's provosts. An officer reads something off a paper. The Red Blades' commander listens without moving. Then he unbuckles his sword-belt, and holds it out, and every Red Blade in the square does the same.

"The High Fist does not want Seven Cities men in his ranks tomorrow," Blistig says, beside you, very quietly. "Tomorrow. Do you hear that, Sergeant? Tomorrow."`,
    ch: b2In('redblade') ? [{t:'Ramin.', go:'b2_ramin_go'}] : b2Fell('redblade') ? [{t:'Go down to the Red Blades\' commander.', go:'b2_ramin_msg'}, {t:'Leave them be.', go:'b2_evening2'}] : [{t:'On.', go:'b2_evening2'}]}),
  b2_ramin_go:()=>({sp:'Ramin', txt:
`Ramin is already unbuckling his sword. He does it the way he polishes the red, carefully, a buckle at a time.

"They have asked for us," he says. "All of us. The company." He holds the curved sword a moment, and then gives it to you, belt and all, instead of to the provost. "Keep it for me. It is a good sword. It is better kept than I am." He takes off the slit-visored helm and holds it under his arm, and he is very straight.

"I was lent," he says. "From the Sekala. And now I am given back." He looks at you a long moment. "Clean, Sergeant. Tell anyone who asks. The squad gave me back clean." He bows from the waist, the Ehrlitan way. Then he walks out into the square, into the ring of provosts, and falls in at the end of the Red Blades' rank, on foot, the only one of them with no horse, and they march away to the cells under the High Fist's palace, and you watch the red go out of the square.${b2In('haddat') ? `

Haddat says something after him in the Ehrlitan dialect. You do not ask what. Neither does she explain.` : ''}`,
    ch:[{t:'On.', fx:()=>{ if (b2In('redblade')) { S.f.b2_raminGone = 1; S.f.b2_raminSword = 1; letGo('redblade', 'Ramin goes with the Red Blades, to the High Fist\'s cells. Given back.'); } }, go:'b2_evening2'}]}),
  b2_ramin_msg:()=>({sp:'The Red Blades\' commander', txt:
`The Red Blades' commander is a lean grey man in good scale, with his sword-belt over his arm, waiting for the provosts to take him. He looks at you as you come through the ring, at the Seventh's badge, and knows, before you say it, what you have come to say. You say it anyway.

"Ramin," you tell him. "Of the Old Quarter. He stayed with the Fist." And then the message, word for word, the way he gave it on the Geleen. *Tell him I was not given back. Tell him I was kept.*

The commander does not move for a long moment. Then he nods, once, very slowly, the way a Red Blade nods at an order he gave himself a long time ago.

"Kept," he says. "Yes. I will write it so."${S.kit.includes('b2_sash') ? '\n\nYou have the red sash in your kit, folded, the one Ramin kept for the day there was a horse to ride in it.' : ''}`,
    ch:[{t:'Give him the sash as well.', req:()=>S.kit.includes('b2_sash'), fx:()=>{ S.f.b2_raminMsg = 1; S.f.b2_sashGiven = 1; S.kit = S.kit.filter(k => k !== 'b2_sash'); Object.values(S.gear).forEach(g => { Object.keys(g).forEach(s => { if (g[s] === 'b2_sash') delete g[s]; }); }); }, go:'b2_ramin_msg2'},
        {t:S.kit.includes('b2_sash') ? 'Keep the sash.' : 'Leave him to it.', fx:()=>{ S.f.b2_raminMsg = 1; }, go:'b2_evening2'}]}),
  b2_ramin_msg2:()=>({sp:'The Red Blades\' commander', txt:`He takes it, still folded, and holds it a moment, and then puts it inside his coat, against his chest. "There will be horses," he says. "Afterwards. There always are." He goes into the ring of provosts with his sword-belt over his arm, and does not look back.`, ch:[{t:'On.', go:'b2_evening2'}]}),

  b2_evening2:()=>({sp:'Aren · night', txt:
`Night in Aren. The city is quiet the way a house is quiet after a death: lamps lit, voices low, doors shut. Out along the Way the fires of Dom's army stretch from the barrow back as far as the hills, and they are singing out there, all of them, a long way off.

Word goes round the billets the way word does. The historian went to the High Fist's palace an hour ago with Nil and Nether behind him, and nobody has seen him come out. The High Fist is in council with his priest. Something is being decided.

And another word, quieter: the High Fist's provosts are asking where the Wickan warlocks sleep.`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),

  b2_blistig2:()=>({sp:'Blistig', fx:()=>{ S.f.b2_blistig2 = 1; }, txt:
`Blistig is on the stair in the dark with a lantern, going squad to squad.

"Dawn," he says. "The High Fist means to march out. The whole army of Aren. Ten thousand. Dom's lot are drunk on it tonight, the priest says, sated, fat, and they'll break like a dropped pot if we go at them at first light, the priest says, and the High Fist has decided the priest is right." He spits over the edge of the stair. "He wants every sword. The Seventh's squads too. You'll be ordered at the muster."

He looks at you over the lantern. "I've three hundred of the Guard who'll stay on these walls if I tell them to. I'm going to tell them to. Somebody has to hold the door when ten thousand men walk out of it." He does not ask you anything. He lets it sit.`,
    ch:[{t:'"We\'re not marching out, Commander."', fx:()=>{ S.f.b2_sortieNo = 1; }, go:'b2_blistig2b'},
        {t:'"Somebody has to hold the door."', fx:()=>{ S.f.b2_sortieNo = 1; }, go:'b2_blistig2b'}]}),
  b2_blistig2b:()=>({sp:'Blistig', txt:`"No," says Blistig. "You're not." He looks at you a moment longer, then nods, once, as if a sum had come out. "At the muster, when they ask, you say you're the Aren Guard's. Wall duty. I'll say the same." He goes on up the stair with the lantern. "God knows we could use some soldiers," he says, to nobody.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_keneb2:()=>({sp:'Captain Keneb', fx:()=>{ S.f.b2_keneb2 = 1; }, txt:
`Keneb is in a doorway by the wall with his family behind him in a lamp-lit room: a woman with her arms round two children, all three asleep against her, and she is not asleep.

"Something is wrong with tomorrow," he says, low, so as not to wake them. "I don't know what. I've been trying to put my finger on it all evening, and it slides off." He rubs his face. "Something I heard, in Orbal, at the start of it. A word. I can't get it back." He shakes his head. "Go to sleep, Sergeant. One of us should."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the warlocks: the provosts come, and the Wickan children bar the door ---- */
  b2_nilguard:()=>({sp:'Temul', txt: S.f.b2_nilguardDone ?
`The door, and the Wickan children in front of it with their lances, asleep on their feet. ${S.f.b2_nilGuard ? 'The provosts did not come back.' : 'The provosts went away. Temul does not trust it.'}` :
`A door at the end of an alley by the north wall, and in front of it Temul and a dozen of the Wickan children, standing with their lances, with their faces shut. Behind the door, Nil and Nether.

Up the alley come four of the High Fist's provosts with a paper, and a lantern, and Lord Pullyk Alar's steward behind them, pointing.

"They say the warlocks are to be held," Temul says, without turning round. "For questions. After." He grips the lance. "The Fist gave them to me to bring to Aren. He did not say: and then give them to anybody."`,
    ch: S.f.b2_nilguardDone ? [{t:'On.', go:()=>startExplore()}] : [
      {t:'Stand in the door with the children.', fx:()=>{ S.f.b2_nilguardDone = 1; S.f.b2_nilGuard = 1; if (b2In('sathi')) loy('sathi', 1); }, go:'b2_nilguard2'},
      {t:'Leave it to Temul. It is his.', fx:()=>{ S.f.b2_nilguardDone = 1; }, go:'b2_nilguard3'}]}),
  b2_nilguard2:()=>({sp:'Temul', txt:
`You go and stand in the door with them. ${b2In('haddat') ? 'Haddat stands beside you with her shield, and puts it down rim-first on the step. ' : ''}${b2Dog7() ? 'Hackle lies down across the threshold. ' : ''}You say nothing to the provosts at all. The squad says nothing.

The provosts look at the Wickan children, and at the Seventh's badges, and at the paper, and at the steward. One of them says that the muster is at dawn, and there are other papers. They go back up the alley. The steward goes last, and looks at you, and writes something down.

Temul does not thank you. He moves over on the step so there is room, and after a while, when the lantern has gone, he says, in Malazan, "The Fist would have liked that." Then nothing else.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_nilguard3:()=>({sp:'Temul', txt:`You stand at the end of the alley and watch. Temul does not move. The children do not move. The provosts look at a dozen Wickans with lances in a doorway, and at the paper, and decide that the muster is at dawn and there are other papers. They go. Temul watches them all the way to the end of the alley.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_pullyk8:()=>({sp:'Lord Pullyk Alar', fx:()=>{ S.f.b2_pullyk8 = 1; }, txt:
`Lord Pullyk Alar, in a clean coat, coming away from the High Fist's palace with two of the provosts behind him, as if he had been born in it. He stops when he sees you. He does not need to; he chooses to.

"Sergeant," he says. ${S.f.b2_nobles7 === 'backed' ? '"Of Balahn. I said I would remember your face."' : S.f.b2_stewardWon ? '"Of the ledger. My steward has your name."' : '"Of the Seventh."'} He smiles. "I have been with the High Fist this evening. We spoke of the historian a great deal. Of the Fist's methods. Of the Seventh's... habits." He shakes his head, gently. "The High Fist has had to take a view. In the morning, everyone marches. Even historians."

He walks on, with the provosts, before you can answer. Nobody touches him. Nobody is going to.`,
    ch:[{t:'Let him go.', go:()=>startExplore()}]}),

  /* ---- the squad's people in Aren ---- */
  b2_ours16:()=>({sp:b2Ours6() || 'The squad\'s people', fx:()=>{ if (b2Ph7() === 2) S.f.b2_ours16 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.younger} has found a well. Of course she has. She is sitting on the lip of it with Ressan's jar in her lap, full, and a tin cup, and she has been giving water to anybody in the column who passes, the way her father did, a cup each, not a drop on the stones. ${B2.elder} is beside her, watching the people take it.

When ${B2.younger} sees you she fills the cup and holds it out. "The first one's free," she says. "Father always said. The first one's free and the second one's a copper." She waits until you have drunk it all. "You came for us first," she says. "He said you would."` : S.f.b2_jarboy ?
`${B2_BOY} is at the gate where Captain Keneb's clerks wrote the column in, going down the slates with his finger, because he cannot read and has decided that if he looks hard enough the names will tell him anyway.` : S.f.b2_yedda ?
`${B2.widow} has found a ropemaker's yard by the harbour, shut, and has sat down outside it on her rope with her grandsons to wait for it to open. "A city with a sea," she says. "There'll be work for rope." She has not cried since Hissar. She is not going to start in Aren.` :
`Your people, in a square by the harbour, sleeping on paving stones in a city, under the Aren Guard's lanterns, with the sea making a noise at the end of the street that most of them have never heard before.`,
    ch:[{t:'Help him look. Read him the slates.', check:['wits', 15], req:()=>!!S.f.b2_jarboy && !S.f.b2_girlsTried, fx:()=>{ S.f.b2_girlsTried = 1; },
          edges:id=>[id === 'haddat' && ['she reads the quarter\'s hand', 2], S.f.b2_youngest && ['the Crow girl said the children came in together', 1], S.f.b2_kenebHelp && ['Keneb', 1]],
          go:'b2_girls_found', fail:'b2_girls_not'},
        {t:'On.', go:()=>startExplore()}]}),
  b2_girls_found:()=>({sp:B2_BOY, fx:()=>{ S.f.b2_girlsFound = 1; chain(0, 2, `${B2.elder} and ${B2.younger}`); if (b2In('haddat')) loy('haddat', 1); }, txt:
`Halfway down the third slate, in a clerk's hand among the Wickan children's, two names. Not the Hissari spelling. A Crow rider's, said aloud to a Malazan clerk, who wrote down what he heard. But they are the names.

${B2_BOY} does not say anything at all. He runs.

You find them an hour later in the Wickan children's square, by the harbour: a tall girl of nineteen with a cut on her forehead, and a small one of nine asleep across her knees, and ${B2_BOY} standing in front of them, out of breath, with his hands at his sides, telling them in the quarter's Hissari that their father stayed on his well, and that the sergeant came back for them, and that the sergeant is here.

${B2.elder} looks up at you over her sister's head. She does not get up. She does not need to.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_girls_not:()=>({sp:B2_BOY, txt:`You read him every slate. Twice. The Wickan children's names, the column's, the ones written in a hurry and the ones written in a Malazan spelling of a Hissari sound. Not theirs. Not that you can find. ${B2_BOY} nods, the way the quarter nods at a price. "Tomorrow there'll be more slates," he says. "Keneb's clerks are still writing." He does not stop looking.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the squad, the night after the Barrow ---- */
  b2_sq7:()=>({sp:'Haddat', fx:()=>b2Sq7('haddat'), txt:
`Haddat is sitting on the steps of the wall with her shield across her knees, saying names under her breath. She does not stop when you sit down. ${b2Fallen().length ? `When she gets to the end of the stretch's she says ${b2And(b2Fallen())}, and then the Fist's, and Bult's, and List's, and Lull's, and the dog's.` : `When she gets to the end of the stretch's she says the Fist's, and Bult's, and List's, and Lull's, and the dog's.`}

"Bent," she says. "He had a name too." ${S.f.b2_ilhar === 'came' ? `Her brother is asleep against the wall below her with his mother's skins for a pillow. She puts a hand on his hair without looking.` : S.f.b2_ilhar === 'fell' ? `She takes the green cloth out of her coat, folded, and looks at it, and puts it back.` : ''}`,
    ch:[{t:'Sit with her.', go:()=>startExplore()}]}),
  b2_sq7s:()=>({sp:'Sathi', fx:()=>b2Sq7('sathi'), txt:
`Sathi is with the Wickan children by Temul's door, laughing at something none of them will tell you, which means she has been crying, which means she is fine. Hackle is lying across the doorstep.

"The crows took him," she says, when she sees you. As if you had not been there. "All of him. Nobody on that mound will have him now, not Dom, not his mage." Her teeth show. "We did not bury him, Sergeant. The sky did. It is the best way. I will tell the clan, if there is a clan." She looks away. "There is not much of a clan."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_sq7t:()=>({sp:'Tangle', fx:()=>b2Sq7('tangle'), txt:
`Tangle is sitting at the foot of the wall with the satchel in his lap, not counting it.

"Mincer was singing," he says. "On the mound. In the ditch. I could hear him from the wall, under the crows. Same song as at Dojal." He turns the satchel over. "I'd have been in that ditch. Two spades down from him." He does not say it bitterly. He just puts the number where it goes. "${b2Count()}," he says then, out loud, to the satchel. "There. Somebody's still counting."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_sq7m:()=>({sp:'Marrow', fx:()=>b2Sq7('marrow'), txt:
`Marrow is sitting on the wall walk where she sat down this afternoon, and has not got up, and does not mean to. Her hat is in her lap.

"I reached for him," she says. "From the wall. For the Fist. I know it's too far. I reached anyway." She turns the hat round. "And the warren was clean, child. All the way down. For the first time since Hissar. Clean, and quiet, and nothing at the bottom of it at all. Whatever it was has gone." She looks at the barrow, in the dark. "It went today. I felt it go. As if it had been waiting for something, and it was done."`,
    ch:[{t:'Sit with her.', go:()=>startExplore()}]}),

  /* ---- the Vathar wound, at last ---- */
  b2_heal7:()=>{ const w = b2Hurt(), by = b2In('marrow') && w !== 'marrow' ? 'marrow' : b2OH() === 'ohl' && b2In('ohl') ? 'ohl' : 'temple';
    return {sp:'A clean healer', fx:()=>{ if (!S.f.b2_woundHealed) { S.f.b2_woundHealed = 1; S.f.b2_healedBy = by; if (by === 'marrow') S.f.b2_knots = (S.f.b2_knots || 0) + 1; if (w) loy(w, 1); } }, txt:
`${by === 'marrow' ? `Marrow sits ${w ? NAME(w) : 'the wounded one'} down on the lip of the well, and puts her hand on the Vathar wound, and reaches. "Clean," she says, surprised, as if somebody had handed her a cup she had not asked for. "All the way down." It closes under her hand like a door. She takes out a length of thread, because she has given away her string, and ties a knot in it.` : by === 'ohl' ? `Ohl, of the Fourth, sits ${w ? NAME(w) : 'the wounded one'} down on the lip of the well with an old man's grunt and puts a hand on the Vathar wound. "Denul is a standing argument with Hood," he says. "Here, tonight, I seem to be winning it." It closes. He sniffs. "Drink the tea. No, there isn't any tea. Drink the water, then."` : `There is a temple of Soliel two streets from the wall, with its doors open and its priestesses working in the courtyard by lamplight, and the warren, they say, is easier tonight than it has been all summer. One of them, a woman with tired hands, puts them on ${w ? NAME(w) : 'the wounded one'}'s Vathar wound and reaches, and it closes, the way a wound should, the way none has since the Vathar.`}

${w ? NAME(w) : 'The wounded one'} stands up and walks round the well, slowly, twice, as if trying out somebody else's legs. "Oh," ${w === 'sathi' || w === 'haddat' || w === 'marrow' ? 'she says' : 'he says'}. That is all.`,
      ch:[{t:'On.', go:()=>startExplore()}]}; },
});

/* ---------------- the sortie: dawn, the basin, the road ---------------- */
Object.assign(B2CH7.dlg, {
  b2_muster:()=>({sp:'The muster · dawn', scene:'b2_aren_walls', txt:
`Dawn, and the whole army of Aren in the streets below the north gate, rank on rank in clean kit, ten thousand, with the cavalry at the front and the High Fist on a white horse in gilded armour, and the priest beside him on a mule.

There was trouble in the High Fist's hall in the night. Everybody has heard some of it. The historian was brought before the High Fist to give his report, and Lord Nethpara laughed at him, and the historian killed Lord Nethpara with his foot, there, in front of everyone. And then the historian said something to the High Fist about the priest. A word. Nobody you ask knows what it was.

The historian is at the back of the High Fist's staff now, on his bad horse, with two provosts beside him. He is going out with the army. Not as a guest.

A captain of the High Fist's with clean boots and a list comes along the street to the Seventh's squads. "You," he says. "Fall in. Every sword."`,
    ch:[{t:'"We\'re the Aren Guard\'s. Wall duty."', req:()=>!!S.f.b2_sortieNo, go:'b2_muster2'},
        {t:'"No."', go:'b2_muster2'}]}),
  b2_muster2:()=>({sp:'Blistig', fx:()=>{ S.f.b2_sortieNo = 1; }, txt:
`The captain opens his mouth. Blistig is beside him before he can use it.

"Mine," says Blistig. "Aren Guard. Wall duty. By the High Fist's own standing order, the walls are the Guard's." He does not raise his voice. "Take it up with the High Fist, Captain. He's just there. On the white horse."

The captain looks at the white horse, and at the gate opening, and at his list, and goes on along the street.

The historian's horse comes past you in the press, with the provosts either side. He sees you. ${S.f.b2_duikerTold7 || S.f.b2_duikerTold3 ? `"I have your column, Sergeant," he says. "Every name. In here." He touches his chest, where the notebook is, and the bottle. "It's the safest place in the Empire, they tell me."` : `"You still owe me a column," he says. "I'll collect when I'm back." He almost smiles. "Don't make it a short one."`}

There is nothing to do. There is nobody to stop. There is the gate, opening, and ten thousand men, and one historian on a bad horse among them.`,
    ch:[{t:'Let him go.', go:'b2_sortie'}]}),
  b2_sortie:()=>({sp:'The north wall', scene:'b2_aren_walls', fx:()=>{ S.f.b2_sortieSeen = 1; }, txt:
`From the wall it is beautiful, which is the worst of it.

The army of Aren goes out of the north gate in the early light, rank on rank, banners, the cavalry first in a long bright column, and along Aren Way, and the dust goes up gold. On the road ahead of it, among the barrows, Dom's army is lying where it fell asleep, drunk on yesterday, and it wakes, and it sees ten thousand coming, and it breaks.

It breaks the way a thing breaks that has been told to. It runs north, past the barrow, past the barrows beyond, and the cavalry goes after it, and the infantry goes after the cavalry, singing, over the rise beyond the last barrow you can see, and out of sight.

Then there is only the dust, settling, and the empty road, and the barrow, with nothing on it.

${b2In('tangle') ? '"That was too easy," Tangle says. Nobody answers him.' : 'Nobody on the wall says anything.'} Blistig, on the tower, has a glass to his eye, and is not moving.`,
    ch:[{t:'On.', go:'b2_keneb3'}]}),
  b2_keneb3:()=>({sp:'Captain Keneb', txt:
`Keneb comes along the wall walk at a run, with his coat open and his face grey, pushing past the Guard, looking at every face.

"Blistig," he says, when he sees you. "Where is Blistig? The historian said a word in the High Fist's hall. I heard it. I've been..." He has no breath. "I remember where I heard it before. Orbal. The start of it. I have to tell him. Where is he?"`,
    ch:[{t:'"The tower. Come on." Take him there.', fx:()=>{ S.f.b2_kenebHelp = 1; }, go:'b2_keneb3b'},
        {t:'Point him at the tower.', go:'b2_keneb3c'}]}),
  b2_keneb3b:()=>({sp:'The tower', txt:`You take him up the tower stair through the Guard, two steps at a time. Blistig lowers the glass. Keneb says something to him with his back to you, low and fast, and Blistig goes very still, the way a man goes still when the floor moves. You do not hear the word. You are not meant to. Blistig looks out at the empty road a long moment, and then he says, quite quietly: "Double the guard on every gate. Nobody opens anything. Nobody. Whoever asks." And then, to Keneb: "You were right to come."`, ch:[{t:'On.', go:'b2_basin'}]}),
  b2_keneb3c:()=>({sp:'The tower', txt:`He goes. You watch him go up the tower stair through the Guard, and say something to Blistig with his back to the wall, low and fast, and Blistig lower the glass and go very still. Then Blistig's voice, carrying: "Double the guard on every gate. Nobody opens anything. Nobody. Whoever asks."`, ch:[{t:'On.', go:'b2_basin'}]}),
  b2_basin:()=>({sp:'The north wall · noon', scene:'b2_aren_walls', txt:
`Noon. Blistig lets the squad have the glass, one at a time, because he cannot stand to hold it any more.

Far out, at the very edge of it, where the hills fold, there is a basin, and in the basin is the army of Aren, ten thousand, standing in its ranks. There is no cavalry with it now. And on every hill round the basin, all the way round, in a ring that closes, there are horsemen.

${b2In('haddat') ? 'Haddat looks, and gives the glass back, and does not say anything at all.' : ''}

You watch for an hour. Nothing happens, and then a thing happens: along the front of the army in the basin, men are putting things down on the ground. Swords. Shields. Rank after rank, putting them down.

"He's surrendered," Blistig says. "The High Fist. On the priest's say, I'll lay money." He takes the glass back. He looks a long time. Then he lowers it. "There," he says, very flat. "A warchief's just taken his head off. With a tulwar. On his white horse." He gives the glass to nobody. "That was the High Fist."`,
    ch:[{t:'On.', go:'b2_way_dead'}]}),
  b2_way_dead:()=>({sp:'Aren Way · dusk', scene:'b2_aren_way', fx:()=>{ if (b2Ph7() < 3) { S.f.b2_ph7 = 3; S.f.b2_wayDead = 1; } }, txt:
`They bring them back along the road in the afternoon, Dom's army, ten thousand men with nothing in their hands, walking.

What happens to them on Aren Way you see from the wall, at a great distance, for the rest of that day and the night and the next morning, and there is nothing to be done about it, and every man on the wall knows it. The squad does not look away. It does not look for long, either. Nobody could.

By dusk there are shapes standing along the road, upright, between the barrows, all the way back toward Balahn, small with distance, that are not trees.${b2In('haddat') && S.f.b2_ilhar === 'parted' ? `

Toward evening Haddat touches your arm, and points. A water-cart, going slowly along the Way among Dom's people, and a man in a city coat walking beside it with a skin over his shoulder, stopping, and reaching up, and going on, and stopping. Dom's men let him. He is the water-seller. Haddat watches him until it is too dark to see, and says nothing at all, and does not let go of your arm.` : ''}${b2In('haddat') && S.f.b2_ilhar === 'lost' ? `

Haddat looks at every face she can make out along the road, all the way to the dark. She does not find the one she is looking for. She does not stop looking.` : ''}

The historian is out there. At the far end, they say. Nobody can reach him. Nobody tries, because there is no way to try.`,
    ch:[{t:'Down off the wall.', go:()=>startExplore()}]}),

  /* ---- the night after the sortie: the postern ---- */
  b2_blistig3:()=>({sp:'Blistig', fx:()=>{ S.f.b2_blistig3 = 1; }, txt:
`Blistig is going round the foot of the wall in the dusk with Keneb behind him and a list of every man he has: three hundred and some, and your squad at the bottom of it in his own hand.

"Dom'll try the walls tonight," he says. "Not hard. He doesn't need to try hard; he thinks the door was left open for him. The postern by the tanneries was found unbarred an hour ago. Nobody knows who." He looks at Keneb, and Keneb looks at nothing. "I'm not asking. I don't want to know tonight. I want it shut and I want men on it."

He looks at you. "Your squad. The postern, and the north gate behind it. Every hand on the walls."`,
    ch:[{t:'"Every hand."', go:()=>startExplore()}]}),
  b2_postern_go:()=>({sp:'The postern · night', txt:
`A narrow door in the wall by the tanneries, with a passage behind it that goes through to the back of the north gate, where the great bar is. Somebody has barred the postern again, and somebody else has stood a lantern by it, and the Aren Guard are on the wall above with every bow in the armoury.

Out in the dark below the wall, along the foot of it, there is movement. Ladders. Men who were told the door would be open.${b2OH() ? `

${NAME(b2OH())} is beside you, the way the Fourth stands beside its own. ${b2OH() === 'brisk' ? '"Sergeant," Brisk says. That is the whole of it.' : b2OH() === 'kettle' ? `"${S.inv.sharper || 0} sharpers between the pair of us," Kettle says, with a look at ${b2In('tangle') ? 'Tangle' : 'the satchel'}. "Same as this morning. Don't make me say it twice."` : b2OH() === 'tuft' ? 'Tuft is looking at the dark the way she looks at a card she has not turned yet.' : b2OH() === 'ohl' ? '"I\'ll be behind you," Ohl says. "With the needle. Try to need it as little as possible."' : b2OH() === 'ellis' ? 'Ellis has her bow strung and her gloved hand flat on the wall, feeling for footsteps.' : 'Vell has a coil of rope over his shoulder. "Ladders," he says, as if it were a professional insult.'}` : ''}`,
    ch:[{t:'Hold the postern.', go:()=>startBattle('b2_postern', {})},
        {t:'Tangle: a burner down onto the ladders before they reach the top.', tag:'uses 1 burner', req:()=>b2In('tangle') && S.inv.burner > 0, fx:()=>{ S.inv.burner--; },
          go:()=>startBattle('b2_postern', {pre:'Tangle leans out over the parapet, hums four notes, and drops a burner onto the foot of the ladders, and the night goes orange, and the men on the ladders come down them a great deal faster than they went up.'})},
        {t:'Kettle: a sharper over the wall into the dark.', tag:'uses 1 sharper', req:()=>b2In('kettle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; },
          go:()=>startBattle('b2_postern', {pre:'Kettle drops a sharper over the wall into the dark below the postern, and the dark below the postern lights up and comes apart. "Like old times," she says.'})}]}),
  b2_after_postern:()=>({sp:'The north gate · before dawn', fx:()=>{ if (b2Ph7() < 4) { S.f.b2_ph7 = 4; S.f.b2_posternDone = 1; } }, txt:
`The captain at the bar goes down with his hand still on it, and the bar does not move, and the ones left in the passage go back out through the postern the way they came, and the Guard on the wall see them all the way back into the dark.

Blistig comes down to the passage with a lantern and looks at the bar, and at the captain, and at the squad. He puts his hand flat on the great bar of the north gate of Aren, as if he were checking that it was real.

"Dom'll not take the city," he says. "Not with three hundred on the walls who know what's out there. He's not a fool. He'll sit out there and wait for somebody to open the door, and nobody will." He takes his hand off the bar. "Get some sleep. There's a ship coming in, the harbour says. Out of a fog that isn't there."`,
    ch:[{t:'Dawn.', go:'b2_dawn2'}]}),
  b2_dawn2:()=>({sp:'Aren · the second morning', scene:'b2_aren_way', txt:
`The second morning comes up grey off the sea.

Out on Aren Way it is finished. The last of them, they say, at the far north end, at Balahn's end, on a tree, was the historian. Nobody saw it from the walls. Nether says she felt it, at dawn, and will not say what she felt. Nil says nothing at all.

${S.f.b2_duikerTold7 || S.f.b2_duikerTold3 ? 'He had the column\'s story. Every name. You gave it to him to keep somewhere safe.' : 'You owed him a column. You never paid.'} There is nobody now to write any of it down, unless you do.

The crows are back over the Way. Not in a cloud. Just crows, going about their business, the way crows do.`,
    ch:[{t:'Down to the harbour.', go:()=>{ startExplore('b2_quay'); talk('b2_quay4'); }}]}),
});

/* ---------------- the harbour: an Old Hand of the Fourth (the night after the Barrow) ---------------- */
/* how each of the Fourth comes down a gangplank in Aren, and what they say to a sergeant who is not theirs */
const B2_OH7 = {
  brisk:{look:'A big woman with a heavy-infantry shield on her back that has been through a door or two, standing at the foot of the gangplank like something taller than she is.', say:'"Sergeant." She says it to you as if it were a whole conversation, and it is.', join:'"Shields," she says. "Rations. A wall. I know what a wall is for."'},
  kettle:{look:'A short woman with soot to the elbows and a satchel she will not put down, sitting on a bollard and counting something in it with her lips moving.', say:'"You\'re the Seventh," she says. "We heard on the ship. All of it." She looks at your kit. "Who\'s your sapper?"', join:'"Two sharpers, one burner," she says. "Same as this morning. I can count them on your wall as well as on a ship."'},
  tuft:{look:'A slight young woman with eyes too old for her, standing very still at the end of the quay looking north, the way a mage looks at a warren she does not like.', say:'"Something walked through the warrens here," she says. "Something huge. All summer. It has gone now, I think. Today." She looks at you. "The cards say nothing about you. That is a compliment, from the Deck."', join:'"I would rather stand on a wall than in a hold," she says. "The dark in a hold is nobody\'s."'},
  ohl:{look:'A stooped old healer with a bag of needles, standing on the quay with his face turned to the city the way a man turns to a smell he knows.', say:'"Ehrlitan," he says. "I was born in Ehrlitan. They said in Genabaris that Seven Cities would rise within the year. I bought gut and needles." He looks at the north wall. "Not enough."', join:'"There\'ll be wounded on a wall tonight," he says. "There always are. Denul is a standing argument with Hood. I\'d like to have it somewhere useful."'},
  ellis:{look:'A slight woman with a bow across her back and one gloved hand, standing at the edge of the quay like a bowstring, watching every face that passes.', say:'"I scout," she says. "I counted sentries for people who never said thank you for six years. Then I didn\'t." She looks at the north wall. "Your lot have walls tonight. Walls need eyes."', join:'"I\'ll count them for you," she says. "The ladders. Before they reach the top."'},
  vell:{look:'A long boy of seventeen, all elbows, with a coil of rope over his shoulder, sitting on the rail of the ship with his heels drumming.', say:'"I carry rope," he says. "That\'s all I do. I got the Fourth onto every roof in Darujhistan." He looks up at Aren\'s north wall with professional interest. "Off is the hard part. Off is the part people forget."', join:'"I\'ll get you onto any wall in this city," he says. "Or keep anyone else off it. Same rope."'},
};
Object.assign(B2CH7.dlg, {
  b2_quay2:()=>({sp:'Aren harbour · night', scene:'b2_harbour', txt:
`The harbour of Aren, at night, and more ships in it than any harbour should hold: the Empire's fleet, at anchor, every one of them, because the High Fist ordered it kept in harbour, and arrested the admiral when he argued. Lanterns on every deck. Nobody going anywhere.

${b2OldHandPick() ? `Among them, at the end of the long quay, a fat-bellied transport flying a Genabaris pennant, with soldiers on her deck in the Host's colours, leaning on the rail, looking at the city. Her master was bound home, by way of Aren, and Aren has kept her.

Somebody on that deck has seen your Seventh's badge in the lantern-light, and is coming down the gangplank.` : 'The refugees are asleep in the squares along the quay. The sea makes a noise at the end of every street.'}`,
    ch:[{t:'Look round.', go:()=>startExplore()}]}),
  b2_oldhand:()=>{ const id = b2OldHandPick(), O = (id && B2_OH7[id]) || {look:'', say:'', join:''}, from = b2OHFrom();
    return {sp:id ? NAME(id) : 'The Fourth', txt: !id ? `Nobody you know.` :
`${O.look}

${NAME(id)}, of the Fourth Squad, Onearm's Host: the Fourth that went home on the Empire's road from Darujhistan, with Sergeant ${esc(from)}. ${O.say}

Up on the ship's rail, a sergeant you have never met is watching, ${esc(from)}, with the look of somebody counting a squad and arriving at the right number, and not yet trusting it.

${NAME(id)} looks past you at the north wall, where the Guard's lanterns are. "We heard what's on the road," ${['ohl', 'vell'].includes(id) ? 'he' : 'she'} says. "We heard you're short." A pause. "The ship's going nowhere. ${esc(from)} says the Fourth can spare one for a night on a wall, if the Seventh wants one." Another pause. "${esc(from)} says the Fourth can't, really. ${esc(from)} says it anyway."`,
      ch: !id ? [{t:'On.', go:()=>startExplore()}] : [
        {t:'"The Seventh would be glad of you."', req:()=>!b2In('redblade'), fx:()=>{ b2OldHand(id); }, go:'b2_oldhand_yes'},
        {t:'"Go back to your squad. Hold on to them."', fx:()=>{ S.f.b2_oldHandNo = 1; }, go:'b2_oldhand_no'}]}; },
  b2_oldhand_yes:()=>{ const id = b2OH(), O = (id && B2_OH7[id]) || {join:''};
    return {sp:id ? NAME(id) : 'The Fourth', txt:`${O.join}

${id ? NAME(id) : 'The Old Hand'} looks back up at the ship's rail, once, at Sergeant ${esc(b2OHFrom())}, who lifts a hand, the way a sergeant lifts a hand to say *bring them back*. Then ${id && ['ohl', 'vell'].includes(id) ? 'he' : 'she'} picks up ${id && ['ohl', 'vell'].includes(id) ? 'his' : 'her'} kit and comes up the quay with you.${b2In('tangle') && id === 'kettle' ? `

Kettle and Tangle look at each other's satchels for a long moment, the way two dogs look at each other's bones. "${b2Count()}," Tangle says. "Two sharpers, one burner," says Kettle. They nod. It is the warmest greeting you have seen either of them give anybody.` : ''}${b2In('marrow') && id === 'ohl' ? `

Ohl and Marrow look at each other. "Denul?" "Denul." "Soliel?" "Once." "Ah." They sit down together on the nearest bollard and do not say anything else, and it is clear that a great deal has been said.` : ''}`,
      ch:[{t:'On.', go:()=>startExplore()}]}; },
  b2_oldhand_no:()=>({sp:'The Fourth', txt:`${b2OldHandPick() ? NAME(b2OldHandPick()) : 'The Old Hand'} nods, slowly, and goes back up the gangplank to the Fourth, and the Fourth closes up round ${b2OldHandPick() && ['ohl', 'vell'].includes(b2OldHandPick()) ? 'him' : 'her'} at the rail the way a squad closes round its own. You do not need anybody else's people. You have enough of your own to count.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_qsteps:()=>({sp:'The harbour steps', txt: b2Ph7() < 4 ?
`Steps down to the water, and the boats, and the ships at anchor beyond, every one with a lantern lit, and none of them going anywhere.` :
`Steps down to the water. Out in the harbour the ships of the Empire's fleet, still at anchor, and among them, where it came in this morning out of a fog that was not there, a burned wreck with its oars shipped that should not float, and does.${S.f.b2_silandaBack && b2Mate(S.f.b2_silandaWho) ? ` The Silanda. ${NAME(S.f.b2_silandaWho)} came down off it this morning.` : ' The Silanda. It has brought the Seventh\'s wounded from the Vathar, whole.'}`,
    ch:[{t:'Back.', go:()=>startExplore()}]}),
  b2_qwell:()=>({sp:'A fountain', txt:`A fountain on the quay with a stone fish spitting water into a basin, the way it has every day all summer, for nobody in particular.`,
    ch:[{t:'Count Marrow\'s string, out loud, the way she asked.', req:()=>b2Fell('marrow') && S.kit.includes('b2_knotstring') && !S.f.b2_stringCounted, fx:()=>{ S.f.b2_stringCounted = 1; }, go:'b2_string'},
        {t:'Drink, and rest.', tag:'1 water', req:()=>b2Ph7() >= 4 && !S.f.b2_quayRest && chainW() > 0, fx:()=>{ S.f.b2_quayRest = 1; dgRest('The squad sits on the quay in the sun with its boots off, and sleeps. Wounds close, mostly.'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),
  b2_string:()=>({sp:'Marrow\'s string', txt:
`You sit on the lip of the fountain with Marrow's string across your knees, and count the knots out loud, the way Tangle counted the satchel. From the old ones at the far end, that she tied before Hissar, the ones from Nap and the temple, to the new ones: ${numw(S.f.b2_knots || 0)} since Hissar. Every healing that took.

It takes a while. People on the quay stop to listen, and then go on. You do not count the others, the ones the warren spoiled. She said she had done that.

At the end you hold the string a moment. Then you tie one more knot in it, at the end, yourself, badly, for the boy on the Barrow whom nobody saw her heal, and whom you are sure she did.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_qgate:()=>({sp:'The gate', txt: b2Ph7() < 4 ?
`The gate back up into the city, and the north wall, and the night.` :
`The harbour gate up into the city, and beyond it, through the streets, the landward gate on the south side, which the Guard opens at noon now for anyone who wants to go into Seven Cities and does not mind what is out there. A few of the column's people are already going through it, with what they carry, south, toward the wells they know.`,
    ch:[{t:'Up into the city.', req:()=>b2Ph7() < 4, go:()=>startExplore('b2_aren')},
        {t:'The landward gate, and Seven Cities, and off the map.', req:()=>b2Ph7() >= 4 && !!S.f.b2_c7_ready, go:'b2_road_desert'},
        {t:'Not yet.', go:()=>startExplore()}]}),
});

/* ---------------- the last morning: the Silanda, the squad, and the road out ---------------- */
/* how the one who went down the Vathar on the Silanda comes down the plank in Aren */
const B2_BACK7 = {
  haddat:()=>`Haddat comes down the plank with her shield on her arm and the blue thread on its grip, walking the way she walked out of Hissar, and stops at the bottom, and looks at you, and at who is behind you, and counts. You watch her count. She gets to the end and starts again, and then she stops, because she knows how to count.`,
  sathi:()=>`Sathi comes down the plank at a run, with Hackle ahead of her, and jumps the last of it, and the dog goes round your legs three times and sits down on your feet. "I was carried," she says, before anything else. "Not sent. Carried." Then she looks along the quay for the Weasels, and you watch her not find them.`,
  tangle:()=>`Tangle comes down the plank with his hands empty, looking at them, as if he had forgotten what they were for without the satchel. "${b2Count()}," you tell him, before he can ask. He nods. He hums the four notes and stops on the third.`,
  marrow:()=>`Marrow comes down the plank slowly, and sits down on the bottom of it, because Marrow sits down whenever she can. "They healed me, child," she says. "On that ship. Something did. I don't know what. I don't want to." She holds up her string. "I've tied a knot for it anyway."`,
};
Object.assign(B2CH7.dlg, {
  b2_quay4:()=>{ const w = b2Away();
    return {sp:'Aren harbour · morning', scene:'b2_harbour', fx:()=>{ if (!S.f.b2_quay4) { S.f.b2_quay4 = 1; S.f.b2_silanda7 = 1;
      if (b2Hurt() && !S.f.b2_woundHealed) { S.f.b2_woundHealed = 1; S.f.b2_healedBy = 'temple'; } } }, txt:
`Grey morning on the harbour, and a fog on the water that the harbour-men say is not there, and out of it, slowly, oars working, a ship comes in that should not float.

It is burned to the waterline in places. Its sails are rags. Its oars dip and lift with nobody you can see at them. It comes in between the anchored ships of the fleet, and every man on every deck goes to the rail to look at it and then steps back from the rail, and it comes up to the end of the quay as gently as a barge on a canal, and stops.

The *Silanda*. From the Vathar.

Down the plank, one after another, come the Seventh's wounded, the ones it took at the river, and every one of them is walking. A marine sergeant with gold-coloured skin comes after them with a big red-bearded corporal and a boy, and looks at the city, and at the harbour, and at the faces on the quay, and asks where the Fist is. Nobody answers him. After a while he stops asking.

${w ? (B2_BACK7[w] ? B2_BACK7[w]() : `${NAME(w)} comes down the plank, whole.`) : 'Nobody of yours is on it. You watch every one of them come down anyway.'}${b2Hurt() ? `

${NAME(b2Hurt())}'s Vathar wound was closed in Aren. ${S.f.b2_healedBy === 'marrow' ? 'Marrow did it, at a well, with the warren clean.' : S.f.b2_healedBy === 'ohl' ? 'An old healer of the Fourth did it, at a well.' : 'A tired priestess of Soliel did it, by lamplight, with the warren easier than it has been all summer.'}` : ''}`,
      ch:[{t:w ? `${NAME(w)}.` : 'On.', fx:()=>{ if (b2Away()) b2Ashore(); S.f.b2_c7_ready = 1; }, go:'b2_quay4b'}]}; },
  b2_quay4b:()=>{ const fell = b2Fallen(), back = S.f.b2_silandaBack && b2Mate(S.f.b2_silandaWho) ? S.f.b2_silandaWho : null;
    return {sp:'Aren harbour', txt:
`${back ? `You tell ${NAME(back)}. All of it: the Geleen, the split, the run, the Barrow${fell.length ? `, and ${b2And(fell)}` : ''}, the crows, the road. It does not take as long as it should. Some things are short.` : `Keneb comes along the quay with a dispatch in his hand, reading it as he walks.`}

${fell.length && back ? `${NAME(back)} listens to the end. Then says ${fell.length === 1 ? 'the name' : 'the names'}, once, out loud, on the quay. ` : ''}Blistig is on the quay, and Keneb with a dispatch-case, and the Wickan children with their horses, and the column's people along the waterfront, sitting in the sun with their boots off. ${b2Rearguard().length ? '' : 'All of the squad is here. You count them anyway.'}

"A dispatch boat," Keneb says. "In the night. The Adjunct's fleet is less than a week out. Transports, to the horizon." He folds it up. "Whatever comes next, Sergeant, it comes here."`,
      html:chainHTML('Aren harbour · the last morning'),
      ch:[{t:'Look round.', go:()=>startExplore()}]}; },

  b2_gesler7:()=>({sp:'Gesler', fx:()=>{ S.f.b2_gesler7 = 1; S.f.b2_gesler = 1; }, txt:
`The gold-skinned marine sergeant from the Vathar, sitting on a bollard at the foot of the Silanda's plank, with the big red-bearded Falari beside him and the boy, Truth, standing guard over the two of them as if they were the wounded.

"Sergeant." Gesler looks at you, and at your squad, and does the sum the way every soldier on this quay is doing it. "We heard on the way in. The Fist." He looks at the harbour. "We went somewhere, on that ship. We came back. Don't ask. Stormy'll tell you, and he'll be wrong." Stormy, beside him, does not tell you anything at all, which is how you know how bad it was.

"Last thing the Fist ever did to me was break his hand on my face," Gesler says. "I'm keeping it."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_keneb4:()=>({sp:'Captain Keneb', fx:()=>{ S.f.b2_keneb4 = 1; }, txt:
`Keneb is on the quay with his wife and his children, looking at the ships, the way a man looks at something he did not expect to see again.

"The Adjunct," he says. "Coming here. To Aren. They say she's raising an army out of nothing, recruits and garrison leavings and whoever walks in the gate. A new one. The Fourteenth." He looks at you. "Somebody will have to tell her what happened on that road. Somebody who was on it." He does not say it as a question.${S.f.b2_kenebHelp ? ` "You took me to Blistig," he says. "On the wall. You didn't ask why. I've not forgotten it."` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_nilq:()=>({sp:'Nether', fx:()=>{ S.f.b2_nilq = 1; }, txt:
`Nil and Nether are sitting on the edge of the quay with their feet over the water, not touching each other. Nil is looking at nothing. Nether is looking at the sea.

"We felt the historian go," she says. "At dawn. At the end of the road." She does not turn round. "And the Fist, on the mound, when the crows came. And Sormo, at the river. We feel all of them go. It is what we are for, now, it seems." Her voice does not change. "Temul says the children will ride when there is somewhere to ride to. He says it every morning. One morning it will be true."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ours17:()=>({sp:b2Ours6() || 'The squad\'s people', fx:()=>{ S.f.b2_ours17 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.elder} and ${B2.younger} have set up at the fountain on the quay with Ressan's jar and two cups, and a line of people from the column, and they are selling water. Not selling: the first one is free. Every one is the first one, as far as you can see.

"Father would have charged," ${B2.elder} says. "And then given the money away." She fills a cup. "We're water-sellers. Somebody has to sell the water, when it's over." She holds out the cup. "You came for us first. He said you would. He said it to everybody, the whole winter you had the fever."` : S.f.b2_girlsFound ?
`${B2.elder} and ${B2.younger} are on the quay with ${B2_BOY}, sitting on the edge of the fountain, and ${B2.younger} is asleep with her head in her sister's lap, and ${B2_BOY} is telling ${B2.elder} about the carts and the gate and the Nenoth, all of it, and she is listening the way her father listened, without interrupting, to the end.

"He stayed on his well," she says to you, when he has finished. "Father. Didn't he." It is not a question. "Thank you for sending the boy."` : S.f.b2_jarboy ?
`${B2_BOY} is on the quay with Keneb's clerks' newest slate in his hands, that he cannot read. "They might be on a ship," he says. "Or in another square. Or they came in with the children and went out the landward gate already, to find Father's cousins." He looks at the slate. "Or nowhere." He does not cry. He has decided they are somewhere. Nobody on the quay is going to tell him otherwise, and you are not going to start.` : S.f.b2_yedda ?
`${B2.widow} has a stall. Of course she has. The ropemaker's yard by the harbour opened this morning, and its master looked at her rope and at her hands, and now she is sitting in its door with a grandson either side of her, splicing, and telling the master how to run his yard. "A city with a sea," she says. "I'm wet. I believe it."` :
`Your people, on the quay, in the sun, with their boots off, watching the ships. Some of them will stay in Aren. Some of them are already going out of the landward gate, south, to wells they know. A girl from the weavers' street has put her feet in the sea and is shrieking at how cold it is.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the squad, at the end ---- */
  b2_last_haddat:()=>({sp:'Haddat', fx:()=>{ S.f.b2_lastH = 1; }, txt:
`Haddat is sitting on the quay wall with her shield across her knees and her face to the sun, which you have never seen her do.

${S.f.b2_ilhar === 'came' ? `"My brother has found the third-best well in Aren," she says. "He is going to buy it. With what, he has not said. He says a water-seller in a city with a sea will never be poor." She almost laughs. "He is a terrible liar. He always was."` : S.f.b2_ilhar === 'parted' ? `"My brother gave water on that road," she says. "To the Empire's soldiers. In front of Dom's army, with Dom's men watching. I saw him." She is quiet. "Somebody has to sell the water when it is over. He said so. I did not know he meant he would give it away."` : S.f.b2_ilhar === 'fell' ? `She takes the green cloth out of her coat, folded, and the blue thread from her shield grip, and ties them together, very carefully, a water-seller's knot, and ties the knot back on the grip.` : S.f.b2_ilhar === 'lost' ? `"I looked at every face on that road," she says. "All day and all night. He was not there." She turns the shield over. "He was not there, Sergeant. That is what I have. I am going to keep it."` : `"I said the names last night," she says. "All of them. The stretch, and the rearguard, and the Fist, and the road. It took until morning."`}

"I took the Empire's silver," she says. "And kept my word on it. To the end." She looks out at the ships. "I do not know what my word is for now. I will have to find out."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_last_sathi:()=>({sp:'Sathi', fx:()=>{ S.f.b2_lastS = 1; }, txt:
`Sathi is with the Wickan children's horses at the end of the quay, with Hackle, ${S.f.b2_silandaBack && S.f.b2_silandaWho === 'sathi' ? 'just off the Silanda, and already the oldest of them,' : ''} braiding the bony grey's mane.

"The Weasels stayed with him," she says. "My clan. The captain, all of them." She does not stop braiding. "So the Weasel Clan is me, now. And three children who hold horses. And Hackle." She laughs, the funeral laugh, short. "A clan is a clan. The captain would say: it is a small one. Ride it well."

She ties off the braid. "Temul says when there is somewhere to ride, the children ride. I will ride with them. Someone has to teach them to laugh at the right times."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_last_tangle:()=>{ const n = (S.inv.sharper || 0) + (S.inv.burner || 0) + (S.inv.cusser || 0) + (S.inv.smoker || 0);
    return {sp:'Tangle', fx:()=>{ S.f.b2_lastT = 1; }, txt:
`Tangle has the satchel open on the quay and is counting it in the sun, out loud, for the last time.

"${b2Count()}," he says. "Out of Hissar with three sharpers, two burners, two cussers, two smokers. And Mincer's fifty-five, and the ramp, and the Vathar, and the walls." He looks at it. ${n ? `"${n === 1 ? 'One left' : numw(n, true) + ' left'}. That's the sum. It came out." He closes the satchel and doesn't open it again. "Question is what you do with the last of a sum."` : `"Nothing. Empty. It came out exactly." He closes the empty satchel. "Never thought I'd see the bottom of it. Feels like the bottom of a well."`}`,
      ch: n && !S.f.b2_lastMuni ? [
        {t:'"Keep it. One, for good."', fx:()=>{ S.f.b2_lastMuni = 'kept'; loy('tangle', 1); }, go:'b2_tangle_last'},
        {t:'"Give it to Blistig. For the north gate."', fx:()=>{ S.f.b2_lastMuni = 'blistig'; }, go:'b2_tangle_last'},
        {t:'"Give it to Kettle. She\'ll know the one that matters."', req:()=>b2In('kettle'), fx:()=>{ S.f.b2_lastMuni = 'kettle'; }, go:'b2_tangle_last'}] : [{t:'On.', go:()=>startExplore()}]}; },
  b2_tangle_last:()=>({sp:'Tangle', txt: S.f.b2_lastMuni === 'kept' ?
`He takes the last one out and puts it in the breast of his jerkin, against his chest, and buttons it in. "One," he says. "For good. Every sapper needs one he never throws." He hums the four notes, all four, and does not stop on any of them.` : S.f.b2_lastMuni === 'blistig' ?
`He takes it down the quay to Blistig himself and puts it in the commander's hands and explains, at length, exactly what it does and exactly where to put it if anybody ever comes at that bar again. Blistig listens to all of it. "Right," he says, at the end, holding it as if it were alive. "Right." Tangle comes back with his hands empty and looks at them. "Good," he says. "Done."` :
`He gives it to Kettle. She looks at it, and at him, and puts it in her own satchel without a word, the way you accept a thing at a funeral. "I'll know the one that matters," she says. "Somebody told me that once." Tangle nods. It is the most either of them has ever said about anything.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_last_marrow:()=>({sp:'Marrow', fx:()=>{ S.f.b2_lastM = 1; S.f.b2_knots = (S.f.b2_knots || 0) + 1; }, txt:
`Marrow is sitting on the edge of the fountain with her string across her knees, counting the knots by feel with her eyes shut.

"${numw(S.f.b2_knots || 0, true)} since Hissar," she says. "And ${S.f.b2_sputters ? numw(S.f.b2_sputters) : 'none'} the warren spoiled, that I don't count." She opens her eyes. "It's clean now, child. All the way down. Since the Barrow. Whatever was walking in it has walked off somewhere else, and good luck to wherever that is." She reaches in, there on the fountain's edge, for nothing, for the feel of it, and smiles. "Cool. Quiet. It smells of temple oil."

She ties one more knot in the string, slowly, and holds it up for you to see. "That one's for you," she says. "You got them here. Sit down, now. No, sit."`,
    ch:[{t:'Sit.', go:()=>startExplore()}]}),
  b2_last_oh:()=>{ const id = b2OH();
    return {sp:id ? NAME(id) : 'The Old Hand', fx:()=>{ S.f.b2_lastOH = 1; }, txt:
`${id ? NAME(id) : 'The Old Hand'} is sitting on a bollard at the foot of the Genabaris transport's gangplank, with ${id && ['ohl', 'vell'].includes(id) ? 'his' : 'her'} kit packed, looking at your squad the way the Fourth looks at itself.

"The ship's still going nowhere," ${id && ['ohl', 'vell'].includes(id) ? 'he' : 'she'} says. "Till the Adjunct comes and says it can. Then home, Sergeant ${esc(b2OHFrom())} says. Wherever that is now." A pause. ${id === 'brisk' ? '"You stood in front of things. On that wall. I noticed." That is all.' : id === 'kettle' ? '"Your sapper counts like a Moranth. Tell him I said so. No, don\'t. He\'ll be unbearable."' : id === 'tuft' ? '"The cards still say nothing about you. I checked again. It\'s still a compliment."' : id === 'ohl' ? '"I\'ve a list," he says. "Names. The ones I\'d have tried for. There are some of yours on it now. I hope you don\'t mind."' : id === 'ellis' ? '"You said thank you," she says. "On the wall. After. Nobody in the Claw ever did." She looks at her gloved hand. "Your lot say it a lot. I noticed."' : '"Off the wall was the hard part," he says. "Like I said. You did it." He grins. "Nobody remembers off."'}`,
      ch:[{t:'On.', go:()=>startExplore()}]}; },
  b2_last_ilhar:()=>({sp:'Ilhar', fx:()=>{ S.f.b2_lastI = 1; }, txt:`Ilhar is at the fountain on the quay with his mother's skins, tasting the water and making a face. "Fourth best," he says. "Maybe fifth. There's a better one under the customs house, and they don't know it." He looks at you, the quarter's look. "You walked my sister to Aren, Sergeant. And me, which you didn't have to." He holds out a skin. "First one's free."`, ch:[{t:'Drink.', go:()=>startExplore()}]}),

  /* ---- the road out: who would have you ---- */
  b2_blistig4:()=>({sp:'Blistig', txt:
`Blistig is on the quay with his hands behind his back, watching the Silanda as if it might be about to ask him for something.

"Three hundred," he says, without turning round. "That's what the Aren Guard is. Three hundred, and your lot, and a captain who came by a warren." He turns. "The Adjunct'll be here in a week, and she'll want an army, and she'll make one out of whatever's standing on this quay when she lands. The Guard'll be in it. I'll be in it, God help me." He looks at your squad. "There's a sash for every one of you, if you want it. Aren Guard. You held my door."`,
    ch:[{t:'"The Aren Guard, then."', req:()=>!!S.f.b2_c7_ready, go:'b2_road_guard'},
        {t:'"Not yet."', go:()=>startExplore()}]}),
  b2_temul10:()=>({sp:'Temul', txt:
`Temul is going down the line of the Wickan children's horses on the quay, checking girths, as he did at Balahn, because somebody has to and the somebody is still him.

"When there is somewhere to ride, we ride," he says. "Nil and Nether, and the children, and whoever of the clans comes looking for us. The Fist gave them to me to bring to Aren. He did not say what after." He pulls a girth tight. "The Adjunct may want us. She may not. Either way the Wickans will need people beside them who saw it. Who can tell it right." He looks at you. "You walked in front of your herd, Sergeant, not behind. Ride with us."`,
    ch:[{t:'"We\'ll ride with you."', req:()=>!!S.f.b2_c7_ready, go:'b2_road_wickans'},
        {t:'"Not yet."', go:()=>startExplore()}]}),
  b2_road_guard:()=>({sp:'The Aren Guard', txt:
`The Aren Guard. Blistig's three hundred, and a sash each, and the north wall, and the Adjunct's fleet a week out, and whatever army she makes on this quay out of the leavings of a summer.

${b2In('tangle') ? 'Tangle nods slowly: a wall is a thing a sapper understands. ' : ''}${b2In('sathi') ? 'Sathi looks down the quay at the Wickan children, and says nothing. ' : ''}${b2In('haddat') ? 'Haddat touches the Seventh\'s badge on her coat, and then the Hissari blue on her shield. "The Empire\'s silver," she says. "Still." ' : ''}`,
    ch:[{t:'This road.', fx:()=>{ S.f.b2_c7_key = 'guard'; if (b2In('tangle')) loy('tangle', 1); if (b2In('marrow')) loy('marrow', 1); if (b2OH()) loy(b2OH(), 1); if (b2In('sathi')) loy('sathi', -1); }, go:'b2_c7_end'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_road_wickans:()=>({sp:'With the Wickans', txt:
`The Wickans: Temul and the children, and Nil and Nether, who feel every death on this continent and have nobody left to tell, and whatever of the clans comes looking for them. Horses. A road that is wherever they are.

${b2In('sathi') ? 'Sathi is already grinning, all her teeth. Hackle barks once. ' : ''}${b2In('tangle') ? 'Tangle looks at the horses with deep distrust. "I\'ll walk," he says. ' : ''}${b2In('marrow') ? 'Marrow sighs. "Children," she says. "With the flux, I shouldn\'t wonder." She is pleased. ' : ''}`,
    ch:[{t:'This road.', fx:()=>{ S.f.b2_c7_key = 'wickans'; if (b2In('sathi')) loy('sathi', 2); if (b2In('tangle')) loy('tangle', -1); }, go:'b2_c7_end'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_road_desert:()=>({sp:'The landward gate', txt:
`The landward gate, at noon, open, and beyond it Seven Cities: hills, and the road south, and wells with names, and nobody keeping a roll. The column's people are going out through it in ones and twos with what they carry, to cousins, to quarters, to wells they know. Nobody stops them. Nobody would stop a squad either.

Off the map. Out of the Empire's ledger. Into the country the Chain walked across, with the people it walked with.

${b2In('haddat') ? 'Haddat looks at the gate a long time. "My country," she says. "Still." ' : ''}${b2In('tangle') ? 'Tangle looks at his satchel. "No Moranth quartermaster that way either," he says. ' : ''}`,
    ch:[{t:'This road.', fx:()=>{ S.f.b2_c7_key = 'desert'; if (b2In('haddat')) loy('haddat', 1); if (b2In('tangle')) loy('tangle', -1); }, go:'b2_c7_end'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_c7_end:()=>{ const k = S.f.b2_c7_key || 'guard', fell = b2Fallen();
    return {sp:'Aren Way · dusk', scene:'b2_finale', txt:
`At dusk you go up on the north wall one more time, because you have to.

Aren Way goes away north between the barrows, empty now. Dom's army has drawn off; it does not need the road. The shapes along it are gone, or going. The crows are going about their business. And on the barrow nearest the walls, just out of bowshot, where the Seventh stopped, there is nothing at all: a mound, grass, the marks of a great many feet, and a cross with nothing on it.

You count them. You have always counted them. ${b2Gate7()} of the stretch, who came in at the gate. ${SQUAD().filter(id => id !== 'sgt').length ? `${b2And(SQUAD().filter(id => id !== 'sgt'))}, beside you.` : 'Nobody beside you, now.'}${fell.length ? ` ${b2And(fell)}, on the barrow.` : ''}${S.f.b2_raminGone ? ' Ramin, given back.' : ''} The Fist. The historian. Bult and List and Lull, and a dog called Bent.

Then you go down, and ${k === 'guard' ? 'put on the Guard\'s sash' : k === 'wickans' ? 'go to the horse lines' : 'pack for the landward gate'}, and it is over.`,
      ch:[{t:'The end of the road.', go:()=>chapterEnd(7, S.f.b2_c7_key || 'guard')}]}; },
});

/* ============ the end of Book Two: the road out, a page per squadmate, the gone, the sergeant, the coda (37: showFinale) ============ */
const B2FIN = {};
B2FIN.KEYS = ['guard', 'wickans', 'desert'];
B2FIN.key = k => B2FIN.KEYS.includes(k) ? k : B2FIN.KEYS.includes(S.f.b2_c7_key) ? S.f.b2_c7_key : 'guard';
B2FIN.join = ps => ps.filter(p => p && String(p).trim()).join('\n\n');
B2FIN.he = id => ['tangle', 'redblade', 'ohl', 'vell'].includes(id);
B2FIN.P = id => B2FIN.he(id) ? {she:'he', She:'He', her:'him', hers:'his'} : {she:'she', She:'She', her:'her', hers:'her'};
B2FIN.n = () => S.f.b2_gateCount || 0;
B2FIN.mates = () => SQUAD().filter(id => id !== 'sgt');
/* the Silanda one, the Vathar wound, and loyalty: a line each, set before a page's last paragraph */
B2FIN.extra = id => [
  S.f.b2_silandaBack && S.f.b2_silandaWho === id ? `${B2FIN.P(id).She} was not on the Chain's last road. ${B2FIN.P(id).She} went down the Vathar on a burned ship that should not float, and came back up the plank in Aren whole, and has never once said what the Silanda was like inside. Some nights ${B2FIN.P(id).she} counts the squad and stops at the Geleen, as if the count went somewhere ${B2FIN.P(id).she} was not.` : '',
  S.f.b2_woundWho === id && S.f.b2_woundHealed ? `The Vathar wound closed in Aren, at last, after the Nenoth and the Geleen and the road. There is a white scar the length of a hand. ${B2FIN.P(id).She} touches it before a fight, the way other soldiers touch a charm.` : ''].filter(Boolean).join(' ');
B2FIN.loy = (id, warm, cold, mid) => { const l = S.loy[id] || 0; return l >= 2 ? warm : l <= -2 ? cold : mid; };

B2FIN.ending = key => {
  const T = {guard:['The Aren Guard', 'b2_harbour'], wickans:['With the Wickans', 'b2_odhan_dusk'], desert:['Off the map', 'b2_odhan_day']}[key] || ['The Aren Guard', 'b2_harbour'];
  if (typeof S === 'undefined' || !S || !S.f) return {title:T[0], scene:T[1], paras:[]};
  try {
    const n = B2FIN.n(), mates = B2FIN.mates(), fell = b2Fallen();
    let P;
    if (key === 'guard') P = [
`Five days after the crows, the Adjunct's fleet comes round the headland in the morning: transports to the edge of the sea, more ships than Aren's harbour has room for even with the Empire's fleet still in it, and on the quay to meet them, three hundred of the Aren Guard and a few more, in sashes, with Blistig at the front looking as if he has swallowed something and Keneb beside him with a slate. The squad is in the second rank. It is the only part of the Guard that walked the Chain.`,
`The Adjunct comes down the plank of the first ship, a plain woman in plain armour, and looks along the quay at what she has been given to make an army of, and does not smile, and does not say anything at all. Then she asks Blistig where Coltaine fell. He points north. She looks that way a long time.`,
`Out of the leavings of a summer, and recruits off the transports, and whoever walks in at the gate, the Fourteenth Army forms on the beaches at Aren. ${mates.length ? `${b2And(mates)} ${mates.length === 1 ? 'is' : 'are'} in it with you.` : 'You are in it.'} When the new soldiers ask the squad what the Chain of Dogs was like, the squad tells them, and they do not believe it, which is how you know it is history.`];
    else if (key === 'wickans') P = [
`The Wickans ride out of Aren's landward gate a month after the crows, when there is somewhere to ride: Temul at the front on a horse too big for him, and Nil and Nether in the middle of the children, and the children, and the squad among them, ${mates.length ? 'some of it on horses, some of it walking and complaining' : 'on a horse it does not trust'}.`,
`Where they ride is the Wickans' business, and they keep it. Along the coast, and inland, and back, wherever a clan of children with two broken warlocks can be useful to an Empire that has not yet decided what to do with them. Nether feels every death on the continent and says so, at night, by the fire. Nil does not say anything for a long time, and then one evening he laughs at something, and the children stare at him, and then they all laugh too, the funeral laugh, for a long while.`,
`The squad rides beside the herd, not behind it. Temul says that is the right place for dogs. He means it as the highest thing a Wickan can say.`];
    else P = [
`You go out of the landward gate of Aren at noon on an ordinary day, with the squad and what it carries, and nobody stops you, and nobody writes anything down. The road goes south into the hills. Behind you the Empire's walls, and the Empire's harbour, and the Empire's ledger, with the squad's names in it somewhere under *the Seventh*, and a line through them.`,
`Seven Cities takes the squad the way it takes everyone: without asking. There are wells with names, and quarters that remember the Chain, and villages where an old soldier who knows which water is sweet is worth more than a sword. ${n ? `Some of the stretch go with you, a while, and then go home, one by one, to cousins and quarters and wells, and each of them looks back once, and counts, and gets it wrong.` : ''}`,
`Nobody in Seven Cities asks which side you were on. They ask whether you were on the road. When you say yes, they give you water, and the first one is free.`];
    return {title:T[0], scene:T[1], paras:P};
  } catch(e) { return {title:T[0], scene:T[1], paras:[]}; }
};

B2FIN.fate = (id, key) => {
  key = B2FIN.key(key); const f = S.f, P = B2FIN.P(id), x = B2FIN.extra(id);
  const add = (title, ps) => { if (x) ps.splice(Math.max(1, ps.length - 1), 0, x); return {title, txt:B2FIN.join(ps)}; };
  if (id === 'sgt') return B2FIN.sgt(key);
  if (id === 'haddat') return add(f.b2_ilhar === 'came' ? 'The water-seller\'s sister' : 'The names', [
    key === 'guard' ? `Haddat wears the Guard's sash over the Seventh's badge and the Hissari blue on her shield, all three, and when the Fourteenth forms on the beach she is in its first rank: a Seven Cities woman in the Empire's army the year after Seven Cities rose. Nobody in it ever once asks her which side she is on. They ask her the way to the water.` :
    key === 'wickans' ? `Haddat rides with the Wickans, badly, and says a Hissari is not built for a horse, and every tribe the children meet on the road is met in her mouth: she talks for the Wickans to the Odhan, polite in every dialect, and the Odhan listens, because she is plainly one of theirs who took the Empire's silver and kept her word on it, and that is a thing every tribe understands.` :
    `Haddat goes home. Not to Hissar; not yet. To the water-sellers' quarters of the towns along the coast, where they know her mother's mark, and in each of them she says the column's names to the water-sellers, and the water-sellers say them back.`,
    f.b2_ilhar === 'came' ? `Ilhar is with her, finding the wells. He never wears green again. When anybody asks him about the rising he says he was in the water trade, which is true.` : f.b2_ilhar === 'parted' ? `She never sees her brother again. Sometimes, in a town on the coast, somebody says a water-seller came through with a mark on his skins like hers, giving the first one free, and went on.` : f.b2_ilhar === 'fell' ? `The green cloth is knotted to the blue thread on her shield grip, with a water-seller's knot. She never explains it. Nobody who walked the Chain asks.` : f.b2_ilhar === 'lost' ? `She never learns what became of her brother. She looks at every face. She has decided that is a kind of hope, and keeps it.` : '',
    B2FIN.loy('haddat', `"Sergeant," she says, at the end of everything, in Hissari, which makes it sound like an oath. It is one.`, `She never forgives the Geleen, or the water, or whatever it was. She says the names every night, and yours is not among them, and she means you to notice.`, `She says the names every night. Some nights she lets you say them, and corrects the potter's boy.`)]);
  if (id === 'sathi') return add('The Weasel Clan', [
    key === 'wickans' ? `Sathi rides with the children, and teaches them to laugh at the right times, which is all the times. The Weasel Clan is Sathi, and three children who hold horses, and Hackle; and then, a year on, more, because a clan that rides well gathers riders.` :
    key === 'guard' ? `Sathi takes the Guard's sash and ties it round Hackle's neck, and scouts for the Fourteenth from a Wickan saddle, out ahead where a scout rides, and laughs at funerals, and nobody has told the Fourteenth either.` :
    `Sathi goes into Seven Cities with the squad on the bony grey with Hackle at its heels, and is a Weasel on the Odhan again, and it suits her better than any of you expected, and exactly as well as she did.`,
    `${S.f.b2_sathiCrows ? 'She saw the crows come down over his tent the night Hissar burned, and said it meant something.' : 'She watched the crows the whole of the Chain.'} She was right. She does not say so. She does not have to; Hackle does it for her, every time a crow lands near him.`,
    B2FIN.loy('sathi', `"Hackle says you walk like a cow, Sergeant." Hackle is asleep. "He says it with love."`, `She has not forgiven you the children's end of the horse lines. She tells Hackle so, in Wickan, where you can hear.`, `She calls you Sergeant still. In Wickan it is a word for the dog that walks in front of the herd.`)]);
  if (id === 'tangle') return add('The sum', [
    key === 'guard' ? `Tangle is the Aren Guard's sapper, which means he is the whole of its sapping, and he checks the north gate's great bar every morning with his ear against it, humming. When the Adjunct's sappers come off the transports with crates of Moranth munitions he goes down to the quay and stands looking at the crates for a long time and does not touch them.` :
    key === 'wickans' ? `Tangle walks beside the Wickans' horses the whole way, and never once gets on one, and digs the children's latrines and their wells, and they adore him, because he hums.` :
    `Tangle digs wells, in Seven Cities. It turns out a sapper who can find where the ground is soft can find where the water is. Villages ask for him by name.`,
    S.f.b2_lastMuni === 'kept' ? `The last munition is in the breast of his jerkin, buttoned in. He has never thrown it. Every sapper needs one he never throws.` : S.f.b2_lastMuni === 'blistig' ? `The last munition is in Blistig's keeping, by the north gate's bar. Tangle explains to him where to put it, every month, at length.` : S.f.b2_lastMuni === 'kettle' ? `The last munition went to a sapper of the Fourth who said she would know the one that mattered. He believes her.` : `The satchel came out exactly. He keeps it anyway, empty, and counts it at every halt. "None," he says. "Same as this morning."`,
    B2FIN.loy('tangle', `He tied fuse-cord round your wrist once, on the Geleen, or would have. He ties it now, a sapper's knot. "So I can find you," he says.`, `He stopped giving you the count somewhere on the road. He counts out loud to the satchel now, and not to you.`, `He hums the four notes, and stops on the third. You still listen for the stop.`)]);
  if (id === 'marrow') return add('The knots', [
    key === 'guard' ? `Marrow is the Aren Guard's healer, and sits down whenever she can, and the temple of Soliel two streets from the wall asks her back, three times, very politely. She says no three times, for reasons she describes as theological.` :
    key === 'wickans' ? `Marrow rides with the Wickans in a cart, sitting down, healing children of the flux and warlocks of nothing anybody can heal, and says she has never been so tired or so useful.` :
    `Marrow sits down in a village with a sweet well somewhere south of Aren, and does not get up again for anyone but the sick, and the village decides she is a saint, which she finds very annoying.`,
    `The warren is clean now, all the way down. Whatever was walking in it walked off at the end of the summer, and she does not ask where. ${numw(S.f.b2_knots || 0, true)} knots since Hissar. She has started a second string, for after.`,
    B2FIN.loy('marrow', `"You got them here, child," she says. "Sit down. No, sit."`, `She never calls you child again. You find you miss it more than anything.`, `She still calls you child. You are fairly sure she always will.`)]);
  if (FIN_IDS.includes(id)) return add('An Old Hand', [
    `${NAME(id)} goes back up the Genabaris transport's gangplank when the Adjunct lets the fleet sail, to the Fourth, and to Sergeant ${esc(b2OHFrom())}, who counts them at the rail and arrives at the right number and, this time, trusts it.`,
    {brisk:`She stood one night on Aren's north wall in front of things, because that is what she does. She tells nobody about it. She writes it in the ration ledger instead: *One wall. Held.*`, kettle:`She stood one night on Aren's north wall with another sapper's satchel next to hers, and the two of them counted at each other till dawn. It is the happiest she has been since Nathilog.`, tuft:`She stood one night on Aren's north wall, in a warren that something huge had walked out of that very day, and felt where it went. She will not say. It was polite, she says.`, ohl:`He stood one night on Aren's north wall, four days' sail from where he was born, and argued with Hood on behalf of a squad that was not his, and won, for once. There are new names on his list. He hopes you do not mind.`, ellis:`She stood one night on Aren's north wall and counted ladders before they reached the top, for people who said thank you after. She keeps that.`, vell:`He stood one night on Aren's north wall, and kept men off it, which he says is the same as getting them on, only backwards.`}[id] || '',
    `"Lent," ${B2FIN.P(id).she} says, at the gangplank, with a look at the empty place where a Red Blade used to stand. "That's what your lot call it. Lent, and given back clean."`]);
  return {title:TPL[id] ? TPL[id].role : '', txt:TPL[id] ? TPL[id].quest : ''};
};

B2FIN.gone = (id, key) => {
  key = B2FIN.key(key); const P = B2FIN.P(id);
  if (b2Fell(id)) {
    const how = S.f.b2_splitHow && S.f.b2_splitHow[id], why = how === 'asked' ? `You asked ${P.her} to stay, on the Geleen, and ${P.she} did.` : how === 'talked' ? `You talked ${P.her} into staying, on the Geleen. ${P.She} said it was a good argument.` : `${P.She} chose it, on the Geleen, and you let ${P.her}.`;
    const T = {haddat:['The names', `Haddat said the names on the Barrow until she could not. The last one she said was yours, which was not on any list. ${S.kit.includes('b2_bluethread') ? 'You have the blue thread from her shield grip. You say the names every night. You get the potter\'s boy wrong.' : 'You say the names every night, for her.'}`],
      sathi:['The crows', `Sathi saw the crows come down over the Barrow, and laughed, because she had said so in Hissar, and was right. ${S.f.b2_hackleBack ? 'Hackle came home along Aren Way at dusk to the bone whistle, on three legs, and sleeps across your feet now.' : 'Nobody saw where Hackle went. Wickan dogs know their way.'} Somewhere a clan has one rider fewer, and laughs about it at the fire, which is Wickan manners.`],
      tangle:['Four notes', `Tangle hummed four notes in Bungle's ditch at the foot of the Barrow, and stopped on the fourth. ${S.f.b2_satchel6 === 'went' ? 'The satchel went with him, to the bottom.' : 'The satchel stayed with you. You count it at every halt, out loud, so it knows somebody is still counting.'} ${S.kit.includes('b2_bead') ? 'You have his prayer bead. You remembered a prayer for him. It had a good tune.' : ''}`],
      marrow:['The last knot', `Marrow sat down on the Barrow, behind the shields, and reached into the warren one more time, and it was clean all the way down. She tied the knot in the strap of her kit. ${S.kit.includes('b2_knotstring') ? `You have the string. ${S.f.b2_stringCounted ? 'You counted it out loud on Aren\'s quay, the way she asked.' : 'You count it, some nights.'}` : ''}`],
      redblade:['Kept', `Ramin held a street's width of the Barrow on foot, in his red scale, the only red on the mound. ${S.f.b2_raminMsg ? `His commander has the message, word for word: *not given back; kept*.${S.f.b2_sashGiven ? ' And the sash, folded, for the horse he never had.' : ''}` : 'Nobody told his commander. You meant to.'}`]}[id] || ['The Barrow', `${NAME(id)} stayed with the Fist and fell at the Barrow.`];
    return {title:T[0], txt:B2FIN.join([T[1], why, `${P.She} died on Aren Way, in sight of the walls, with the Seventh. The squad carried the name the rest of the way.`])};
  }
  if (id === 'redblade' && S.f.b2_raminGone) return {label:'Given back', title:'With the Red Blades', txt:B2FIN.join([
    `Ramin went to the High Fist's cells under the palace with the Red Blades on the night before the sortie, and that is why he is alive: every man the High Fist trusted marched out in the morning, and none came back.`,
    `When the Adjunct comes, the cells open, and there are horses. There always are. He rides in the red sash at last, unfolded, at the end of the Red Blades' rank, and when the company passes the squad in the street he does not turn his head, because a Red Blade in rank does not; but his hand comes off the reins, once, flat, the way you would show a sergeant that the sword is clean.`,
    S.f.b2_raminSword ? `You still have his curved sword. He never asks for it back. You never offer. It is better kept than either of you.` : ''])};
  return null;
};

B2FIN.sgt = key => {
  const f = S.f, n = B2FIN.n(), keeps = ['b2_bluethread', 'b2_whistle', 'b2_bead', 'b2_knotstring', 'b2_sash'].filter(k => S.kit.includes(k) && ITEMS[k]).map(k => ITEMS[k].name.toLowerCase());
  return {title:f.b2_key === 'daughters' ? 'The promise' : 'The herd', txt:B2FIN.join([
    key === 'guard' ? `You wear the Aren Guard's sash, and then the Fourteenth's badge, and stand on the beach at Aren while an army is made out of the leavings of a summer, and are asked, over and over, by men who were not there, what the Chain of Dogs was like. You tell them. They do not believe it.` :
    key === 'wickans' ? `You ride beside the Wickan children, not behind, the way Bult would have liked, and learn to sit a horse at last because there is no other way to keep up, and the children laugh at you for it, the funeral laugh, which is how you know you are theirs.` :
    `You walk into Seven Cities with what you carry, off the map and out of the ledger, and in every town with a well somebody asks if you were on the road, and you say yes, and they give you water.`,
    f.b2_key === 'daughters' ? `You kept your word to an old water-seller: you came for his daughters first. ${B2.elder} and ${B2.younger} sell water at a fountain on Aren's quay from his jar, and the first one is free. Ressan stayed on his well. You will never know what became of him. You have decided he is still there, selling.` :
    f.b2_girlsFound ? `You sent a boy back into the fire with your word, and the girls came out on Wickan saddles, and lived, and ${B2_BOY} found them in Aren on a slate. Ressan stayed on his well. You kept the half of the promise that could be kept.` :
    `You sent a boy back into the fire with your word, and you never learned whether the girls came out. ${B2_BOY} is still looking. You have stopped telling him to stop.`,
    `Bult gave you a stretch of the column outside Hissar, and said *you own these*. ${n ? `${numw(n, true)} of them came in at Aren's north gate. It is the only number you ever cared about, and you still count it, some nights, out loud.` : 'None of them came in at Aren\'s gate. You count them anyway, some nights, out loud, from Hissar.'}`,
    keeps.length ? `In your kit: ${keeps.length === 1 ? keeps[0] : keeps.slice(0, -1).join(', ') + ' and ' + keeps[keeps.length - 1]}. You do not take them out. You know where they are.` : `You carry nothing from the Chain but the names. It is heavier than it sounds.`])};
};

B2FIN.coda = key => {
  const n = B2FIN.n(), fell = b2Fallen();
  return [
`Coltaine of the Crow Clan walked forty thousand people across a burning continent and died on a barrow in sight of the walls of the city that would not come out for him. The crows took him. The historian who walked beside him wrote it all down, and died last on the road, and the story went with him, except for the parts that soldiers tell.`,
`${n ? `${numw(n, true)} of them came in at the gate behind one sergeant.` : 'One sergeant came in at the gate.'} ${fell.length ? `${b2And(fell)} did not; ${fell.length === 1 ? 'that one' : 'they'} stayed with the Fist.` : 'Every one of the squad who walked the Chain walked into Aren.'} That is the squad's part of it. It is small. It is the only part anybody will ever tell right.`,
`On Aren Way, just out of bowshot of the walls, there is a barrow, and on it nothing at all. The crows go over it on their way to somewhere else.`];
};

B2CH7.finale = {
  ids:()=>['haddat', 'sathi', 'tangle', 'marrow', 'redblade'],
  labels:{epi:'Epilogue', squad:'The squad', fallen:'The fallen', away:'Gone their own way', sgtRole:'Sergeant · Third Squad, the Seventh Army', road:'The squad\'s road', prologue:false,
    list:()=>['The stretch', `${b2Gate7()} came in at the gate`], noDead:'None of the squad. Every one of them walked into Aren.', paper:false,
    endline:'The End of Book Two: <em>Deadhouse Gates</em>',
    credit:'The Malazan world was created by Steven Erikson and Ian C. Esslemont, and it and its canon characters belong to them. With thanks to Steven Erikson for the book, Coltaine, Duiker and the Chain of Dogs, and to Ian C. Esslemont for the world they built together; the squad only walked beside it.'},
  endings:{ get guard(){ return B2FIN.ending('guard'); }, get wickans(){ return B2FIN.ending('wickans'); }, get desert(){ return B2FIN.ending('desert'); } },
  fate:(id, key)=>B2FIN.fate(id, key),
  gone:(id, key)=>B2FIN.gone(id, key),
  coda:(key)=>B2FIN.coda(key) };
