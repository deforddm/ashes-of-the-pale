/* ============ Book Two, Chapter 3: The Ridge ============ */
/* Nine days east of the P'atha: the night raid under the Tithansi camp (the squad goes with the sappers through the warlocks' second cut,
   to make the noise while Lull's party does the killing), the tunnel's water, and Gelor Ridge: the Shallows, the Weasels' bait, the ring on the lake bed.
   Key (S.f.b2_c3_key): 'bait' (the squad herded its own stretch out onto the Shallows as the Weasels ordered: column down hard, the trap closes clean,
   the clan honours Sathi) or 'pull' (the squad pulled its people back into the wagons: a harder fight, the column kept, Sathi shamed before her clan).
   New here: a fight a squadmate sits out (def.away, 47: Tangle is in the ramp's banks with Mincer's sappers), and the Earth's Hand (a Wickan trick, below). */

/* Tangle is with the squad, and not off in a hole in the ramp with Mincer */
const b2Tg = () => b2In('tangle') && !S.f.b2_tangleAway;
/* the squad's own people, for a line: the daughters, the widow, or the stretch */
const b2Ours3 = () => S.f.b2_key === 'daughters' ? B2.elder : S.f.b2_yedda ? B2.widow : null;

/* The Earth's Hand: Wickan spirit-craft from the warlocks' tunnel. It is the land's own; it never sputters. */
Object.assign(TRICKS, {
  b2_earth:{name:'The Earth\'s Hand', ch:3, use:'fight', ab:'t_b2_earth', spirit:true, where:'the warlocks\' tunnel, by the spirit-light',
    lore:'The Wickans do not command the land. They ask it, the way you ask a horse, and sometimes it does what it is asked. Nil asked the earth for a tunnel; one of the small lights he left to hold it open will hold something else, for a breath, if it is asked properly.',
    get fx(){ return `Once a fight: an enemy within 4, and every enemy next to it, is taken by the feet. They are slowed, and −${2 + lvT()} to hit until the bearer's next turn. Grows with level. Spirit-craft: it never sputters.`; }},
});
Object.assign(AB, {
  t_b2_earth:{name:TRICKS.b2_earth.name, trick:'b2_earth', spirit:true, desc:()=>TRICKS.b2_earth.fx,
    tiles:u=>foes().filter(f => cheb(u, f) <= 4 && sees(u, f)),
    run(u, x, y){ const t = unitAt(x, y); if (!t) return; AUDIO.play('step'); shakeMap();
      const hit = foes().filter(f => cheb(f, t) <= 1);
      hit.forEach(f => { f.earthUntil = B.round + 1; f.earthPen = 2 + lvT(); f.slowTurn = true; float(f, 'held', '#9fbf7a'); sparks(f.x, f.y, 10, '#8aa86a', .4); });
      blog(`${u.name} puts a palm flat on the ground and asks it, in Wickan, the way you ask a horse. ${hit.length > 1 ? `The earth comes up round ${hit.length} pairs of feet and holds them, cold, as if it had been waiting.` : `The earth comes up round ${t.name}'s feet and holds them, cold.`}`); }},
});
/* held by the earth: a blow struck from held feet goes wide */
{ const _atkCalc = atkCalc;
  atkCalc = function(a, t, o = {}){ const c = _atkCalc(a, t, o);
    if (S && S.book === 'dg' && B && a && a.earthUntil >= B.round) c.bonus -= a.earthPen || 2; return c; }; }

/* the words this chapter adds to Book Two's glossary */
GLOSSX.dg.push(
  [3, 'Captain Lull', 'Captain of the Sialk Marines. Practical, dry, and the man the Fist sends when something has to be done in the dark.', ()=>!!(S.f && S.f.b2_lull)],
  [3, 'Gelor Ridge', 'A ridge above the P\'atha River. Reloe\'s sappers cut it into one long ramp with high banks, so the Seventh could only go up it one way.', ()=>!!(S.f && S.f.b2_gelor)],
  [3, 'Korbolo Dom', 'A half-Napan Fist of the Empire who went over to the rebellion. After Gelor Ridge he has the whole rebel army.', ()=>!!(S.f && S.f.b2_dom)]);

const B2CH3 = {
  title:'The Ridge', number:'Three',
  intro:{loc:'The Odhan', sub:'West of the Sekala · the long way to the P\'atha', scene:'b2_odhan_dusk', cap:'The column strung out across the Odhan at dusk, and on every skyline, riders.',
    paras:[
`The column slept a day on the west bank of the Sekala, and then it walked again, because Reloe had gone north to the next crossing and would be back, and because there was nowhere to go now but Aren.`,
`The Weasels came back from the Sekala with fewer horses and filed teeth. All of them, the whole clan, sharpened to points like a dog's, the morning after the ford. Nobody asked them why. Nobody in the column asks the Weasels anything any more.`,
`Weeks. The rivers Bult names are dry beds. Tithansi ride at the tail of the column every night and cut away whatever is slowest. And nine days east of the P'atha, on a night like the others, a marine captain you have never spoken to comes looking for the Third Squad by name.`],
    go:'On', node:'b2_c3_start'},

  areas:[
    /* 16 x 12.  . hardpan  , scrub  s sand  # rock  r low rock  x dead tree  b bones  = tent  W wagon  F campfire  h horse lines */
    { id:'b2_east', title:'The Odhan · nine days east of the P\'atha', sub:'Night · the column dry · Tithansi on the flank', hint:'Tap ground to move · tap a figure to talk · the squad\'s carts, when it is time', decor:'odhan_night', dark:true,
      map:[ "################",
            "#..=...,...hhh.#",
            "#.=....F....h..#",
            "#....,.....=...#",
            "#..W.......,...#",
            "#.,...=..r.....#",
            "#......F....W..#",
            "#.r..,.........#",
            "#....=.....x...#",
            "#.,......,...=.#",
            "#s..b...s....s.#",
            "################" ],
      walk:'.,s', triggers:{F:'b2_east_fire', W:'b2_east_wagons', h:'b2_east_horses', b:'b2_east_bones'}, start:{x:7, y:9},
      quest:()=> !S.f.b2_lull ? 'A marine captain is asking for the Third Squad.' : !S.f.b2_wicket ? 'The sappers you are going with. By the low rock.' : 'The squad\'s carts, when the squad is ready to go under.',
      npcs:[
        {id:'lull', name:'Captain Lull', kind:'lull', x:5, y:3, node:()=>S.f.b2_lull ? 'b2_lull_again' : 'b2_lull', fresh:()=>!S.f.b2_lull},
        {id:'duiker3', name:'Duiker', kind:'duiker', x:8, y:4, node:()=>S.f.b2_duiker3 ? 'b2_duiker3_again' : 'b2_duiker3', fresh:()=>!S.f.b2_duiker3},
        {id:'nil3', name:'Nil', kind:'nil', x:12, y:4, node:()=>'b2_nil3', fresh:()=>!S.f.b2_nil3},
        {id:'wicket', name:'Sergeant Wicket', kind:'sapper', x:3, y:7, node:()=>S.f.b2_wicket ? 'b2_wicket_again' : 'b2_wicket', show:()=>!!S.f.b2_lull, fresh:()=>!!S.f.b2_lull && !S.f.b2_wicket},
        {id:'weasel3', name:'A Weasel rider', kind:'weasel', x:13, y:2, node:()=>'b2_weasel3', fresh:()=>!S.f.b2_weasel3},
        {id:'ours3', name:'The squad\'s people', kind:'hissari_w', x:10, y:8, node:()=>'b2_ours3', fresh:()=>!S.f.b2_ours3},
        {id:'ramin3', name:'Ramin', kind:'redblade', x:6, y:6, node:()=>'b2_ramin3', show:()=>b2In('redblade'), fresh:()=>b2In('redblade') && !S.f.b2_ramin3} ] },

    /* 16 x 12.  . packed earth  , roots  # earth wall  ~ seeping water  - the shallow water at the tunnel's mouth  l spirit-light */
    { id:'b2_tunnelway', title:'The warlocks\' cut · under the Odhan', sub:'Night · the earth opened, and asked to stay open', hint:'Tap ground to move · tap a figure to talk · the mouth is where the water is, at the far end', decor:'b2tunnel', dark:true,
      map:[ "################",
            "#####..,..######",
            "####l....,.~####",
            "###...,.....####",
            "###.~#####..l###",
            "##...######..###",
            "##,.l######.,.##",
            "###..#####...~##",
            "####...,......##",
            "#####.~..,l.####",
            "######..--..####",
            "################" ],
      walk:'.,-', triggers:{l:'b2_light', '~':'b2_seep', '-':'b2_tunnel_end'}, start:{x:6, y:1},
      quest:()=> !S.f.b2_seep ? 'The tunnel. Something in the walls smells of water.' : 'The far end, where the shallow water is. Then up.',
      npcs:[
        {id:'wicket2', name:'Sergeant Wicket', kind:'sapper', x:8, y:3, node:()=>'b2_wicket_t', fresh:()=>!S.f.b2_wicketT} ] },

    /* 16 x 12.  . slope  , scrub  s sand  # rock  ^ the ramp's banks (beyond the river)  ~ the P'atha  x dead tree */
    { id:'b2_patha', title:'The P\'atha · the eve of Gelor', sub:'Dusk · the ridge across the river, and an army on it', hint:'Tap ground to move · tap a figure to talk · Bult, when the squad is ready to sleep', decor:'ridge',
      map:[ "################",
            "#^^^^^....^^^^^#",
            "#^^#^^.....^^#^#",
            "#~~~~~~~~~~~~~~#",
            "#~~~~~~~~~~~~~~#",
            "#ss.sss..ss.sss#",
            "#..,....,....,.#",
            "#.x......,.....#",
            "#....,.....#...#",
            "#.,.....,......#",
            "#..s..,....x.,.#",
            "################" ],
      walk:'.,s', triggers:{'~':'b2_patha_river', x:'b2_sathi_tree'}, start:{x:7, y:9},
      quest:()=> b2In('tangle') && !S.f.b2_tangleAway ? 'Mincer is on the bank. He wants Tangle.' : !S.f.b2_weaselcap3 ? 'The Weasel captain. Something about tomorrow.' : 'Bult, when the squad is ready to sleep.',
      npcs:[
        {id:'mincer3', name:'Captain Mincer', kind:'mincer', x:4, y:6, node:()=>S.f.b2_mincer3 ? 'b2_mincer3_again' : 'b2_mincer3', show:()=>!S.f.b2_mincer3 || !b2In('tangle') || /^b2_(mincer3|tangle_go)/.test(S.node || ''), fresh:()=>!S.f.b2_mincer3},
        {id:'lull3', name:'Captain Lull', kind:'lull', x:9, y:6, node:()=>'b2_lull3', fresh:()=>!S.f.b2_lull3},
        {id:'sulmar', name:'Captain Sulmar', kind:'b2soldier', x:12, y:8, node:()=>'b2_sulmar', show:()=>!!S.f.b2_tangleAway, fresh:()=>!!S.f.b2_tangleAway && !S.f.b2_sulmar},
        {id:'fdog', name:'A Foolish Dog rider', kind:'foolish_dog', x:13, y:6, node:()=>'b2_fdog', fresh:()=>!S.f.b2_fdog},
        {id:'weaselcap3', name:'The Weasel captain', kind:'weasel', x:2, y:9, node:()=>'b2_weaselcap3', fresh:()=>!S.f.b2_weaselcap3},
        {id:'duiker4', name:'Duiker', kind:'duiker', x:7, y:8, node:()=>'b2_duiker4', fresh:()=>!S.f.b2_duiker4},
        {id:'nil4', name:'Nil', kind:'nil', x:5, y:9, node:()=>'b2_mare', fresh:()=>!S.f.b2_mare},
        {id:'nether4', name:'Nether', kind:'nether', x:6, y:10, node:()=>'b2_mare'},
        {id:'bult4', name:'Bult', kind:'bult', x:10, y:9, node:()=>'b2_bult4', fresh:()=>!!S.f.b2_weaselcap3 && (!b2In('tangle') || !!S.f.b2_tangleAway)} ] },

    /* 16 x 12.  . the lake bed  , scrub  s sand  ^ the foot of the ridge  x dead tree  ~ the P'atha */
    { id:'b2_shallows', title:'The Shallows · below Gelor Ridge', sub:'Morning · the army gone up the ramp · the column left behind', hint:'Tap ground to move · tap a figure to talk · the Weasel captain, by the dead trees', decor:'ridge',
      map:[ "################",
            "#^^^^^^..^^^^^^#",
            "#.,..s.....s..,#",
            "#..s...,.....s.#",
            "#.....x....,...#",
            "#.,.........s..#",
            "#....s..,......#",
            "#..,.....x...,.#",
            "#s.....s.......#",
            "#~~~~~.....~~~~#",
            "#~~~~~~~~~~~~~~#",
            "################" ],
      walk:'.,s', triggers:{x:'b2_shallows_tree', '~':'b2_shallows_river'}, start:{x:7, y:8},
      quest:()=> S.f.b2_ringDone ? 'Dusk. Count them.' : S.f.b2_shDone ? (S.f.b2_cityboy || !b2In('haddat') ? 'The lake bed. The ring is bending. The dead trees, where the wagons are.' : 'Haddat has found someone among the Tithansi.') : !S.f.b2_c3_key ? 'The Weasel captain wants the Third Squad.' : 'Go.',
      npcs:[
        {id:'weaselcap4', name:'The Weasel captain', kind:'weasel', x:7, y:2, node:()=>S.f.b2_c3_key ? 'b2_weaselcap_after' : 'b2_weasel_order', fresh:()=>!S.f.b2_c3_key},
        {id:'ours4', name:'The squad\'s people', kind:'hissari_m', x:4, y:6, node:()=>'b2_ours_sh', fresh:()=>!S.f.b2_oursSh},
        {id:'cityboy', name:'A Tithansi rider', kind:'tithansi_rider', x:11, y:5, node:()=>'b2_cityboy', show:()=>!!S.f.b2_shDone && b2In('haddat') && !S.f.b2_cityboy, fresh:()=>!!S.f.b2_shDone && !S.f.b2_cityboy} ] } ],

  battles:{
    /* the raid: the Tithansi horse lines, at the mouth of the sappers' cut. Make the noise; then the thing that gets back up */
    b2_raid:{title:'The horse lines', style:'odhan_night', dark:true, pitTxt:'the cut', warrenText:'Night, under the Tithansi camp · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["..,..,..",",.......","..t..t..","........",".,....,.","........","..t..t..","........","...oo...","...oo..."],
      party:[[2,8],[5,8],[1,7],[6,7],[3,7],[4,7]],
      foes:[['b2_tithlance',1,0],['b2_tithlance',6,0],['b2_tithbow',3,0],['b2_tithbow',4,1]], xp:100, after:'b2_after_raid',
      allies:[['b2_sapally',4,7]],
      waves:[{round:2, foes:[['b2_tithlance',0,3],['b2_tithlance',7,3]], text:'Men come running out of the dark between the horses, half-dressed, spears first, shouting about the noise.'}],
      preText:()=>`Tangle's burner goes into the picket lines, and the Tithansi horses, which have been thirsty a long time and are in no mood, decide all at once to be somewhere else. Half the camp wakes to the sound of its own herd leaving.`,
      stage2:{title:'The thing that gets back up', style:'b2tunnel', xp:40, keepAllies:true,
        text:()=>`The horse lines are a ruin and the camp is awake, all of it, a long way off to the south where Lull's people are. That was the noise. You made it. Now you go home.
${b2In('sathi') ? `
At the mouth of the cut Hackle stops dead, and turns round, and makes a sound you have never heard a dog make.` : `
At the mouth of the cut, Wicket stops, and turns round.`}

Something is coming down the slope after you, out of the camp, walking. A painted man. Semk, by the paint, and the paint is wrong, green where it should be ochre, and running. One of Wicket's sappers throws a sharper at it from the cut, and it goes down in the flash, and it gets up.

${b2In('marrow') ? `"Child," Marrow says, very quietly. "That's the one from the Sekala. That's the god. What's left of it." ` : ''}Wicket, flat in the mouth of the cut: "Hold it off. We're bringing the roof down. Three breaths. Hold it."`,
        map:["##....##","#......#","#.,..,.#","#......#","##.##.##","#......#","#.,....#","#......#","##....##","##....##"],
        party:[[2,8],[5,8],[3,9],[4,9],[2,9],[5,9]],
        foes:[['b2_godrider',3,1],['b2_semkwar',2,2],['b2_tithlance',5,2]],
        objective:{type:'survive', rounds:3, text:'Hold the cut for three rounds while the sappers bring the roof down. It will not stay down.'},
        waves:[{round:2, foes:[['b2_semkwar',4,0]], text:'Another painted man comes down the slope behind it, eyes empty, walking the way it walks.'}, {round:3, foes:[['b2_tithlance',2,0]], text:'A lancer on foot, running after the painted ones as if he could not help it.'}]} },

    /* the Shallows, the squad's stretch out in the open as the Weasels ordered: the lancers come all the way in, and the clan closes */
    b2_bait:{title:'The Shallows', style:'ridge', pitTxt:'the river', warrenText:'Morning on the lake bed · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle', away:['tangle'],
      map:["........","..,..,..","........",".,....,.","........","...tt...","........",".,....,.","........","oooooooo"],
      party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
      foes:[['b2_tithlance',1,0],['b2_tithlance',6,0],['b2_tithlance',3,1],['b2_tithbow',0,2],['b2_tithbow',7,2]], xp:150, after:'b2_after_bait',
      allies:[['b2_weaselally',0,6],['b2_weaselally',7,6]],
      waves:[{round:2, foes:[['b2_tithlance',4,0]], text:'More lancers come over the lip of the lake bed into the squad\'s people, and do not see the Weasels until the Weasels are among them.'}],
      stage2:{title:'The lance-captain', xp:70, keepAllies:true,
        text:()=>`The first rush is broken. The Tithansi who are left are trying to get back the way they came, and the Weasels have closed it. One of their chiefs has rallied a knot of lancers round him at the lip of the lake bed, and is coming back in, at the column, because the column is the only way out that is not full of Wickans.

${b2In('sathi') ? `Sathi is laughing. High, short, not happy, the Weasel laugh. "Now," she says. "Now they understand."` : 'The Weasels are laughing. It is not a happy sound.'}`,
        map:["........",".,....,.","........","..t..t..","........","........",".,....,.","........","........","oooooooo"],
        party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
        foes:[['b2_lancecap',3,1],['b2_tithlance',1,1],['b2_tithlance',6,1],['b2_tithbow',4,0]],
        waves:[{round:2, foes:[['b2_tithlance',0,3]], text:'A lancer comes out of the people on the ground, where he was hiding among them, and goes for the nearest back.'}]} },

    /* the Shallows, the squad's stretch pulled back into the wagons: the trap springs half-shut and the lancers come in at the gap */
    b2_pull:{title:'The gap in the wagons', style:'ridge', pitTxt:'the river', warrenText:'Morning on the lake bed · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle', away:['tangle'],
      map:["........","..,..,..","........",".#....#.","........","...tt...","........",".#....#.","........","oooooooo"],
      party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
      foes:[['b2_tithlance',1,0],['b2_tithlance',6,0],['b2_tithlance',3,1],['b2_tithbow',7,2]], xp:150, after:'b2_after_pull',
      waves:[{round:2, foes:[['b2_tithlance',7,4]], text:'Lancers come wide round the wagons, looking for the soft place, and find the squad standing in it.'}],
      stage2:{title:'The lance-captain', xp:70,
        text:()=>`The first rush is broken against the wagons. The Weasels have come out of the east at last, late, and closed the far side, and the Tithansi between are trying to get out through the only gap they can see, which is yours.

A chief with a lance-captain's horsetails rallies them at the lip of the lake bed. ${b2In('sathi') ? `Sathi doesn't laugh. She looks once at the Weasels on the far side, and then she nocks an arrow and does not look at them again.` : 'The Weasels are a long way off.'}`,
        map:["........",".,....,.","........","..t..t..","........","........",".#....#.","........","........","oooooooo"],
        party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
        foes:[['b2_lancecap',3,1],['b2_tithlance',1,1],['b2_tithlance',6,1]]} },

    /* the afternoon: the Seventh's ring on the lake bed bends under the Ubari legions, and the wagons roll south. Hold the squad's wagons */
    b2_ring:{title:'The ring', style:'ridge', pitTxt:'the drop', warrenText:'Noon on the lake bed · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle', away:['tangle'],
      map:["........","..,..,..","........","........",".t....t.","........","..,..,..","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_ubari',2,0],['b2_ubari',5,0],['b2_ubari',3,1],['b2_tithbow',7,1]], xp:110, after:'b2_after_ring',
      allies:[['b2_hguard',1,7]],
      waves:[{round:2, foes:[['b2_ubari',7,2]], text:'The Ubari line bends round the wagons like a hand closing, and another file comes in on the flank.'}],
      stage2:{title:'The charge', xp:50, keepAllies:true,
        text:()=>`On the ridge above you, something happens to the light.

It goes white for a moment, and cold, the way it went white over the Sekala when the river stood up, and then down the ramp comes the Foolish Dog. Five thousand of them, heavy, in scale, with lances, at a gallop, downhill, into the southern host, and the noise of it reaches you after, like surf.

The Ubari in front of the wagons hear it too. Some of them run. Their officer does not. ${b2In('haddat') ? `"He wants the wagons before it reaches him," Haddat says. "To have something." She sets her shield.` : 'He wants the wagons before the charge reaches him.'}

Two Foolish Dog riders come down off the lake-bed slope on blown horses, and get off them, and walk toward the officer with their lances, as if nobody else were there.`,
        map:["........","........","..t..t..","........","........","........","..,..,..","........","........","........"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['b2_ubarioff',3,1],['b2_ubari',1,1],['b2_ubari',6,1]],
        allies:[['b2_fdally',0,5],['b2_fdally',7,5]]} } },

  foes:{
    /* Tithansi lancers, after Dryj and the Sekala: fewer, harder, angrier */
    b2_tithlance:{name:'Tithansi lancer', sig:'l', kind:'tithansi', hp:15, ac:13, atk:4, dmg:[1,8,2], rng:1, mv:5, init:2, sk:['reach'], verb:'drives a lance at'},
    /* the god-ridden Semk: what is left of the Semk god, in a man. It does not stay down */
    b2_godrider:{name:'The god-ridden', sig:'G', kind:'warleader', hp:60, ac:14, atk:5, dmg:[1,10,2], rng:1, mv:3, init:1, boss:true, immortal:true, sk:['daze'], verb:'reaches for'},
    /* the lance-captain at the Shallows */
    b2_lancecap:{name:'Tithansi lance-captain', sig:'C', kind:'tithansi', hp:30, ac:14, atk:5, dmg:[1,10,2], rng:1, mv:5, init:3, boss:true, sk:['reach','rally'], verb:'brings a lance round on'},
    /* the Ubari legions: city infantry, drilled, armoured, in the northern lake bed */
    b2_ubari:{name:'Ubari legionary', sig:'U', kind:'guran', hp:17, ac:16, atk:4, dmg:[1,8,2], rng:1, mv:3, init:1, sk:['parry'], verb:'thrusts at'},
    b2_ubarioff:{name:'Ubari file-officer', sig:'O', kind:'guran_officer', hp:32, ac:16, atk:5, dmg:[1,10,2], rng:1, mv:3, init:2, boss:true, sk:['parry','rally'], verb:'cuts at'},
    /* allies: Wicket the sapper; Weasel warriors with filed teeth; a Hissar Guard spearman; Foolish Dog riders on foot */
    b2_sapally:{name:'Wicket', sig:'k', kind:'sapper', hp:20, ac:13, atk:4, dmg:[1,8,1], rng:4, mv:4, init:2, verb:'looses a quarrel at'},
    b2_weaselally:{name:'Weasel warrior', sig:'e', kind:'weasel', hp:20, ac:13, atk:5, dmg:[1,8,2], rng:1, mv:5, init:3, verb:'cuts at'},
    b2_hguard:{name:'Hissar Guard', sig:'g', kind:'b2soldier', hp:20, ac:15, atk:4, dmg:[1,8,1], rng:1, mv:4, init:1, verb:'cuts at'},
    b2_fdally:{name:'Foolish Dog rider', sig:'f', kind:'foolish_dog', hp:26, ac:16, atk:6, dmg:[1,10,3], rng:1, mv:4, init:2, verb:'drives a lance at'} },

  gear:{
    b2_clawstar:{name:'A black iron star', slot:'trinket', who:null, atk:1, line:'A throwing star of black iron, five-pointed, edged on every point, pulled out of a dead Tithansi in the horse lines. Nobody in the squad threw it. Nobody in the squad says out loud who did.'},
    b2_tunnelroot:{name:'A root from the cut', slot:'trinket', who:null, hp:2, line:'A twist of pale root from the warlocks\' tunnel, still damp when it was broken off and damp now, weeks later, in a country where nothing stays damp an hour.'},
    b2_sappershield:{name:'A sapper\'s dented shield-boss', slot:'trinket', who:null, hp:1, line:'The iron boss of a sapper\'s shield, dented in the shape of a horse\'s hoof. Tangle brought it back from the ramp. It was over his face at the time.'} },

  scenes:{
    b2_tunnel:{loc:'The warlocks\' cut', sub:'Under the Odhan', cap:'Earth walls laced with pale roots, a floor of black water, and small cold lights set in the walls like held breath.', amb:'tunnel'},
    b2_gelor:{loc:'Gelor Ridge', sub:'The P\'atha', cap:'A long ridge over a dry lake bed, cut into one sandy ramp between high banks, and on top of it, an army.', amb:'wind'},
    b2_charge:{loc:'Gelor Ridge', sub:'The Foolish Dog', cap:'Dust down the whole length of the ramp, heavy riders inside it, and up at the top a white light going out.', amb:'plain'} },

  end:{
    bait:['The bait', 'Nine days east of the P\'atha the squad went under the Tithansi camp with the sappers to make a noise, while Captain Lull\'s party went in and did the killing, and the warlocks\' tunnel gave the army water. At Gelor Ridge the Seventh went up Reloe\'s ramp and broke his army, and on the Shallows below the Weasel Clan put the column out as bait and closed on the Tithansi, and the squad herded its own people into the open as it was told. The trap closed clean. The Tithansi are gone. So is a part of the squad\'s stretch that will not come back.'],
    pull:['Pulled back', 'Nine days east of the P\'atha the squad went under the Tithansi camp with the sappers to make a noise, while Captain Lull\'s party went in and did the killing, and the warlocks\' tunnel gave the army water. At Gelor Ridge the Seventh went up Reloe\'s ramp and broke his army, and on the Shallows below the Weasel Clan put the column out as bait and closed on the Tithansi. The squad pulled its own people back into the wagons. The trap closed late, and the squad paid for the gap in blood. Its stretch of the column is still walking. The Weasels have not forgotten whose it was.'] },
  endScene:'b2_charge',
  endCap:()=> S.f.b2_c3_key === 'bait' ? 'Dusk below Gelor Ridge. The Weasels are singing over their dead and laughing between the verses, and the squad\'s stretch is shorter, and quiet, and walks on.' : 'Dusk below Gelor Ridge. The Weasels are singing over their dead on the far side of the camp, and the squad\'s stretch is under the wagons, nearly all of it, alive.',
  tease:'Next: the Day of Pure Blood. Korbolo Dom has the rebel army now, and at the Vathar Crossing he offers the column safe passage.',

  extras:()=>{ const f = S.f, x = [];
    x.push(`The squad came down off Gelor Ridge with ${b2Chain()}.`);
    if (f.b2_raidDone) x.push('Nine days east of the P\'atha the squad went under the Tithansi camp with Wicket\'s sappers and made the noise that covered Captain Lull\'s raid. Something painted came after it, and got back up.');
    if (f.b2_clawStar === 'kept') x.push('The squad keeps a black iron throwing star from the Tithansi horse lines. Nobody in the squad threw it.');
    if (f.b2_clawStar === 'given') x.push('The squad gave Captain Lull a black iron throwing star from the Tithansi horse lines. He put it away very carefully.');
    if (f.b2_seep) x.push('In the warlocks\' tunnel Marrow tasted the water in the walls and said it was sweet. By dawn the whole army was digging for it.');
    if (f.b2_c3_key === 'bait') x.push(`On the Shallows the squad herded its stretch of the column into the open as the Weasels ordered, and the Tithansi came all the way in, and did not go out again.${f.b2_sathiTeeth ? ' That night Sathi filed her teeth with the clan.' : ''}`);
    if (f.b2_c3_key === 'pull') x.push('On the Shallows the squad pulled its people back into the wagons against the Weasels\' order. Its stretch is nearly whole. The Weasel captain has not spoken to Sathi since.');
    if (f.b2_tangleAway) x.push(`Tangle spent the battle in a hole in the ramp's bank with Mincer's sappers, and the Foolish Dog charge went over his shield.${f.b2_rampSatchel === 'took' ? ' He came back with a lighter satchel.' : ''}`);
    if (f.b2_ilharRidge) x.push('A dying city boy on the Shallows told Haddat that the man from the water-sellers\' quarter went up to Reloe\'s tent on the ridge the night before. He was not with the lancers.');
    if (f.b2_skinFound) x.push('Among the dead Tithansi horses Haddat found a water-skin with the Seventh\'s stamp on it, the one the squad gave a prisoner at Dryj. Nobody found the prisoner.');
    if (f.b2_dom) x.push('Reloe will never command again. The rebel army belongs to Korbolo Dom.');
    return x; },

  journal:()=>{ const f = S.f; return [
    f.b2_dom && `After Gelor Ridge Kamist Reloe lost his army. A renegade Fist named Korbolo Dom has it now.`,
    f.b2_lullHurt && `Captain Lull lost an eye and his nose on the ridge, to a mace. He says it improves him.`,
    f.b2_ringDone && `At Gelor Ridge the warlocks Nil and Nether spent a mare's life to drive five thousand Foolish Dog riders up and then down Reloe's ramp, and Mincer's sappers came up out of the banks under them. The rebel army broke.`,
    f.b2_shDone && `On the Shallows below the ridge the Weasel Clan used the refugees as bait and destroyed the Tithansi lancers. Hundreds of refugees died. The Tithansi are all but gone.`,
    f.b2_raidDone && `Nine days east of the P'atha, Captain Lull's party went into the Tithansi camp through a tunnel the warlocks raised, and killed their warleader. Claw weapons were found in the bodies. The tunnel held water, and the army drank.`,
    f.b2_godrider && `Something of the Semk god survived the Sekala, in a painted man who gets back up.`,
    `West of the Sekala the column walked on toward the P'atha, with the Tithansi at its tail every night.`].filter(Boolean); },

  dlg:{}
};

/* ---------------- nine days east of the P'atha ---------------- */
Object.assign(B2CH3.dlg, {
  b2_c3_start:()=>({sp:'The Odhan · nine days east of the P\'atha', scene:'b2_odhan_dusk', fx:()=>{ if (!S.f.b2_c3Start) { S.f.b2_c3Start = 1; chain(-3, -2, 'The weeks after the Sekala'); } }, txt:
`The column camps where it stops, which tonight is a long flat nothing with a dry streambed through it and a smell of dust.

There is no water for the cattle. The herders have started killing the ones that will not get up, by torchlight, all down the column, for the meat while there is still blood in it to keep it, and the sound of that goes on all night and nobody sleeps through it. Two of your people did not get up this week. ${b2In('haddat') ? 'Haddat has their names.' : 'You have their names.'}

There are stories going up and down the column now, the way there are when people are thirsty enough. The one tonight is about the nobles' wagons and what is cooking in them. Nobody believes it. Everybody repeats it.

${b2Tg() ? `"${b2Count()}," Tangle says at the halt. Then, because nobody asked: "Still." ` : ''}${b2In('marrow') ? `Marrow has ${b2Knots()}.` : ''}`,
    html:chainHTML('The Odhan · nine days east of the P\'atha'),
    ch:[b2DeckChoice(3), {t:'Make camp.', go:()=>startExplore()}]}),
  /* the reading at the night camp (47c) */
  b2_c3_deck:()=>b2DeckOffer(3, 'b2_c3_card'),
  b2_c3_card:()=>b2DeckCard(3),

  /* ---- Captain Lull ---- */
  b2_lull:()=>({sp:'Captain Lull · Sialk Marines', fx:()=>{ S.f.b2_lull = 1; }, txt:
`He finds you before you find him: a marine captain in a sweat-black leather cap, middle-sized, plain-faced, with the look of a man who has been awake a long time and has decided it suits him.

"Third Squad. Hissar." He doesn't wait for you to agree. "Lull. Sialk Marines. Don't salute, it's dark, and somebody over there is counting us."

He crouches by your fire as if it were his. "There's a Tithansi warleader been cutting at the tail of this column every night since the Sekala. The Fist would like him to stop. Tonight the warlocks are going to open the ground and some of us are going to walk under the Tithansi camp and see to it." A pause. "Not you. You're going the other way, with a squad of sappers, through a smaller hole, to make a noise at the far end of their camp, so that everybody in it is looking the wrong way while we work."

He looks at the squad, all of it, without hurry. "Mincer says your sapper's one of his. Wicket's people are short a man who can count. ${b2Tg() ? `That's you, Tangle.` : `Bring whoever can throw.`}"`,
    ch:[{t:'"Why the Third, sir?"', go:'b2_lull_why'},
        {t:'"Who goes in with you?"', go:'b2_lull_who'},
        {t:'"We\'ll be ready."', go:'b2_lull_yes'}]}),
  b2_lull_why:()=>({sp:'Captain Lull', txt:
`"Because you held the bank at the Sekala, and Chenned remembered your number, and I asked Chenned." He shrugs. "And because I need a squad that won't run when the noise starts, and won't run *toward* it either, which is harder to find."

He considers you. "Also you've a dog. The Tithansi have dogs. Yours is better."${b2In('sathi') ? ` Sathi, behind you, does not translate this for Hackle. She doesn't have to. The dog's tail moves once.` : ''}`,
    ch:[{t:'"Who goes in with you?"', go:'b2_lull_who'},
        {t:'"We\'ll be ready."', go:'b2_lull_yes'}]}),
  b2_lull_who:()=>({sp:'Captain Lull', txt:
`"Four of mine. Two of Sormo's young ones, to hold the hole open. Three squads of sappers, of which you're escorting one." He counts it off on his fingers with no particular interest. "And the historian."

You must look something, because he almost smiles. "Duiker. He's been volunteered. He doesn't know it yet. I'm going to go and tell him now, and watch his face, and then I'm going to tell the Fist that the historian volunteered, and watch his."

He stands up. "He was a soldier once, the old man. Before the Emperor decided he ought to be able to read. I want somebody on this raid who'll write it down properly if it goes wrong. It's a comfort."`,
    ch:[{t:'"We\'ll be ready."', go:'b2_lull_yes'}]}),
  b2_lull_yes:()=>({sp:'Captain Lull', fx:()=>{ S.f.b2_lullYes = 1; }, txt:
`"Good." He says it the way Coltaine does, as if it were the whole of a conversation. "Sergeant Wicket's people are by the low rock. They'll tell you which hole is yours. Go down it when the warlocks say, not before. Come back up it when you've made your noise, not after." He turns to go. "And if anything follows you home, Sergeant, don't bring it to supper."`,
    ch:[{t:'Find Wicket.', go:()=>startExplore()}]}),
  b2_lull_again:()=>({sp:'Captain Lull', txt: S.f.b2_lullYes ? `Lull is with his marines by the dry streambed, checking crossbow strings by feel. He doesn't look up. "Wicket," he says. "Low rock. Go."` : `Lull is waiting, crouched by the fire, as if he had all night.`,
    ch:[{t:'"Sir."', req:()=>!!S.f.b2_lullYes, go:()=>startExplore()}, {t:'"We\'ll be ready."', req:()=>!S.f.b2_lullYes, go:'b2_lull_yes'}]}),

  /* ---- Duiker, volunteered ---- */
  b2_duiker3:()=>({sp:'Duiker · Imperial Historian', fx:()=>{ S.f.b2_duiker3 = 1; S.f.b2_duiker = 1; }, txt:
`Duiker is sitting on a saddle by a dead fire, sharpening a short sword he does not look as if he has drawn in years. He has got the rebel robes off. The sun is still burned into him.

"Sergeant." He holds up the sword. "I have been volunteered. Captain Lull has a gift for the passive voice." He tests the edge with his thumb and winces. "I was a soldier, you know, before Kellanved pulled me out of the ranks and had me taught my letters. I had hoped not to be one again. History is so much more comfortable from the far end."

He puts the sword across his knees. "I said at the Sekala I wanted your column's story. Yours, not the officers'. I still do. There may not be another quiet night between here and the river. Tell me something. Anything. A name."`,
    ch:[{t:'Tell him about the stretch: the names, the count, the dead.', fx:()=>{ S.f.b2_duikerTold3 = 1; if (b2In('haddat')) loy('haddat', 1); }, go:'b2_duiker3_tell'},
        {t:'"After tonight, sir. If there is one."', go:'b2_duiker3_later'}]}),
  b2_duiker3_tell:()=>({sp:'Duiker', txt:
`You tell him. Not the battles. The stretch: ${chainC()} people, and who they were in Hissar, and the old man from the dyers' street who sat down in the shade of a wagon, and ${S.f.b2_key === 'daughters' ? `${B2.elder} and ${B2.younger} and the jar` : S.f.b2_yedda ? `${B2.widow} and her rope` : 'the families nobody else counts'}. ${b2In('haddat') ? 'Haddat comes and stands behind you halfway through and gives him the names you have forgotten, in Hissari and then in Malazan.' : ''}

He doesn't write while you talk. He listens, with the sword across his knees, and when you stop he sits a while.

"Thank you," he says. "Every army I have ever written down was a list of officers and a number. This one has people in it." He picks up the whetstone again. "I'll write it later. If I'm not in it myself by morning."`,
    ch:[{t:'"You won\'t be, sir."', go:()=>startExplore()}]}),
  b2_duiker3_later:()=>({sp:'Duiker', txt:
`"After tonight." He nods, as if you had given him a date in a chronicle. "A soldier's answer. I'd forgotten how much I disliked them." He goes back to the whetstone. "Mind the captain, Sergeant. He's the most reasonable man in the Seventh, and that is a terrible thing to follow into a hole."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_duiker3_again:()=>({sp:'Duiker', txt:`The historian is still at the whetstone. The sword is as sharp as it is going to get. He keeps going anyway, the way you'd say a prayer you don't believe in.`, ch:[{t:'Leave him to it.', go:()=>startExplore()}]}),

  /* ---- Nil, before the raid ---- */
  b2_nil3:()=>({sp:'Nil · a Wickan warlock', fx:()=>{ S.f.b2_nil3 = 1; }, txt:
`Nil is sitting cross-legged on the bare ground at the edge of the camp with both hands flat on the earth, as if feeling for a heartbeat. Beside him, doing the same, is another of Sormo's young warlocks, older than Nil, whose name nobody in the squad catches. Neither of them looks up.

"It's full," Nil says. To nobody, in that quiet voice. "The ground. Here, under all this. Full of water, a long way down, and nobody's asked it for any." He presses harder with his palms. "It doesn't like the Tithansi either."

${b2In('sathi') ? `Sathi goes down on one knee at the edge of the bare patch, as she did by the Sekala, and says something to him in Wickan. He answers without looking at her. "He says the earth here is old and very tired," she tells you after, "and that tonight it is going to be asked for a great deal, and he is sorry." She doesn't laugh. "He is ten years old, Sergeant."` : `The other young warlock looks up at you, once, with eyes too old for the face, and goes back to the ground.`}`,
    ch:[{t:'Leave them to it.', go:()=>startExplore()}]}),

  /* ---- Wicket and the sappers ---- */
  b2_wicket:()=>({sp:'Sergeant Wicket · sappers', fx:()=>{ S.f.b2_wicket = 1; }, txt:
`Four of Mincer's sappers, by the low rock, sitting in a ring round an oilcloth with things laid out on it in rows that you decide not to look at closely. Their sergeant is a squat grey woman with no eyebrows, which on a sapper is a kind of rank.

"Wicket." She doesn't get up either. Sappers never get up. "${b2Tg() ? `Tangle. You're still alive. That's two of us out of the old section. Don't spoil it.` : `You're the escort. Good. Escort.`}"

${b2Tg() ? `Tangle sits down on the edge of the oilcloth as if he'd been sitting there all his life. "Wicket," he says. That's all. They look at each other the way people look at each other who have stood in the same hole when it went wrong. Then Wicket nods at his satchel. "Count," she says, and he does, out loud: "${b2Count()}." She whistles. "Rich man."

` : ''}"Here's the night," she says. "The warlocks cut us our own little hole, north of the captain's. We go down it, we come up under their horse lines, we make the loudest noise anyone's made on the Odhan since Cuttle stood the Sekala on end. Everyone in that camp looks north. The captain works south. Then we go home the way we came, quick, before anyone thinks to follow." She pats the oilcloth. "Questions? Good. Nobody ever has questions."`,
    ch:[{t:'"What if something does follow?"', go:'b2_wicket_follow'},
        {t:'"We\'ll be behind you."', go:()=>startExplore()}]}),
  b2_wicket_follow:()=>({sp:'Sergeant Wicket', txt:
`"Then we bring the roof down on it." She says it as if you'd asked what happens if it rains. "It's a hole in the earth, Sergeant. That's what holes are for. The warlocks hold it up; we take it down. The trick's being on the right side when we do." She looks at you sidelong. "Stay on the right side."`,
    ch:[{t:'"We\'ll be behind you."', go:()=>startExplore()}]}),
  b2_wicket_again:()=>({sp:'Sergeant Wicket', txt:`The sappers are packing the oilcloth, carefully, row by row. "When the warlocks say," Wicket says, without looking up. "Not before."`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- a Weasel, with filed teeth ---- */
  b2_weasel3:()=>({sp:'A Weasel rider', fx:()=>{ S.f.b2_weasel3 = 1; }, txt:
`A Weasel rider is sitting by the horse lines, mending a bridle with his teeth. His teeth are filed to points. All of them. When he grins at you, which he does, it is like being grinned at by a dog that has decided to be friendly for now.

${b2In('sathi') ? `He sees Sathi and says something, and the grin gets wider, and she answers sharp. He laughs, and points at his own mouth, and then at hers, and says something else, slower.

"He asks why my teeth are still a child's," Sathi says. Her voice is very flat. "After the Sekala the clan filed them. All of them, the morning after. For the dead, and for what they will do to the ones who made them dead." She is not looking at you. "I was with the Malazans that morning. Nobody came to get me."

The rider says one more thing and goes back to his bridle. She doesn't translate it. Hackle leans against her leg.` : `He points at his teeth, and then at you, and says in slow Malazan: "Sekala." Then he makes a closing gesture with both hands, the way the Weasel at Dryj did, and goes back to his bridle.`}`,
    ch:[{t:'Leave him to it.', go:()=>startExplore()}]}),

  /* ---- the squad's people ---- */
  b2_ours3:()=>({sp:b2Ours3() || 'The squad\'s people', fx:()=>{ S.f.b2_ours3 = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.elder} is sitting by the cart with ${B2.younger} asleep against her, and the jar between her feet, and she is very angry, quietly, the way her father used to be angry at a customer.

"They are saying the nobles are eating children," she says. "In the wagons. At night." She pushes ${B2.younger}'s hair back off her face. "I don't believe it. Some of them would if they could get the cook to do it." She looks up. "${B2.younger} heard. She asked me if they'd eat her. I said she was too thin." A pause. "She laughed. Sergeant, she *laughed*."` : S.f.b2_yedda ?
`${B2.widow} is sitting on her rope with her grandsons asleep on either side of her, and a look on her face like a woman who has been told a price and means to argue it.

"They are saying the nobles are eating babies," she says. "In the wagons." She sniffs. "I've seen the nobles, soldier. They couldn't catch one." She tucks a blanket round the smaller grandson. "Somebody's eating *something* in those wagons, mind. You can smell it at dusk. It isn't horse."` :
`A family from the weavers' street, the mother awake with the youngest across her knees. "They are saying things about the nobles' wagons," she says, very low. "About what they are eating." She doesn't say what. "It isn't true, is it, soldier." It isn't a question you can answer. You tell her it isn't true.`,
    ch:[{t:'Leave them be.', go:()=>startExplore()}]}),

  /* ---- Ramin, at dusk ---- */
  b2_ramin3:()=>({sp:'Ramin', fx:()=>{ S.f.b2_ramin3 = 1; loy('redblade', 1); }, txt:
`Ramin is polishing the red of his scale by the light of a cattle-fire, the way he does every night, whatever else is undone. He has heard about the hole.

"In Ehrlitan we bury the dead," he says, without looking up. "Under the ground. That is where they go, Sergeant. Not soldiers. Soldiers go *over* things." He works the cloth round a dent. "The Red Blades have never once in their history gone anywhere through a hole."

He sets the scale down. "I am lent. A lent sword goes where it is carried." Then, quieter: "If I do not come up, tell the company I went the long way round."`,
    ch:[{t:'"You\'ll come up."', go:()=>startExplore()},
        {t:'"I\'ll tell them you went first."', fx:()=>{ loy('redblade', 1); }, go:'b2_ramin3b'}]}),
  b2_ramin3b:()=>({sp:'Ramin', txt:`He looks at you for a moment, and then he laughs, which you have not heard him do. "First," he says. "Yes. They would believe that." He goes back to the polishing, still smiling.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the squad's fire: drink, or keep the water ---- */
  b2_east_fire:()=> S.f.b2_eastRest ? {sp:'The squad\'s fire', txt:`Dung and thornwood, burning low. ${chainW() > 0 ? `The skins hang on the cart: ${numw(chainW())}.` : 'The skins hang on the cart, flat.'}`, ch:[{t:'Leave it.', go:()=>startExplore()}]} : {sp:'The squad\'s fire', txt:
`The squad's fire, in the lee of a cart. ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'} on the cart, and ${chainC()} people in the stretch who are looking at them.` : 'No water at all.'}

Whatever goes down that hole tonight should go down it with something in its mouth. Whatever stays behind will be just as thirsty in the morning.`,
    html:chainHTML('The Odhan · nine days east of the P\'atha'),
    ch:[{t:'Drink, and rest before the raid.', tag:'1 water', req:()=>chainW() > 0, fx:()=>{ S.f.b2_eastRest = 1; dgRest('The squad drinks, slowly, round the fire, and sleeps an hour on the hardpan. Wounds close, mostly.'); }, go:'b2_east_slept'},
        {t:'Give tonight\'s skin to the stretch.', tag:'1 water', req:()=>chainW() > 0, fx:()=>{ S.f.b2_eastRest = 1; S.f.b2_eastGave = 1; chain(-1, 1, 'The squad\'s skin to the stretch'); if (b2In('marrow')) loy('marrow', 1); if (b2In('redblade')) loy('redblade', 1); }, go:'b2_east_gave'},
        {t:'Keep it. Go down dry.', fx:()=>{ S.f.b2_eastRest = 1; }, go:'b2_east_dry'}]},
  b2_east_slept:()=>({sp:'The squad\'s fire', txt:`The skin goes round once. Everybody holds the mouthful before they swallow it, the way you taught them. ${b2In('sathi') ? 'Sathi gives half of hers to Hackle out of her cupped hand.' : ''} An hour's sleep on the hardpan, with the cattle dying all down the column. It is better than nothing. It is not much better.`, ch:[{t:'Up.', go:()=>startExplore()}]}),
  b2_east_gave:()=>({sp:'The squad\'s fire', txt:`The skin goes down the stretch, cart to cart, children first. ${b2In('redblade') ? 'Ramin carries it, and does not drink from it, and says that is an order he gave himself.' : ''} ${b2In('marrow') ? '"Stupid," Marrow says. "Good." She doesn\'t lie down. There\'s a hole to go into.' : 'Nobody in the squad says anything. Nobody has the spit.'}`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_east_dry:()=>({sp:'The squad\'s fire', txt:`Nobody drinks. The skins stay on the cart where the stretch can see them. ${b2Tg() ? 'Tangle says, "Dry fuses are good fuses," which is not a joke, and nobody laughs.' : 'It is the sensible thing. Your mouth is full of sand.'}`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_east_horses:()=>({sp:'The Weasel horse lines', txt:`The Weasels' horses, standing in a long line with their heads down. You can count their ribs in the dark. ${b2In('sathi') ? 'Sathi walks the line with her hand on every neck she passes, and says each one\'s name, and does not say anything to you.' : 'Nobody is riding anywhere tonight that they can walk.'}`, ch:[{t:'Leave them.', go:()=>startExplore()}]}),
  b2_east_bones:()=>({sp:'The herders\' work', txt:`Where the herders have been at the cattle. You don't look long. ${b2In('marrow') ? 'Marrow does. "Blood\'s wet," she says. "They should be giving it to the children." She goes to tell them so.' : 'Somebody is saying the cattle have more water in them dead than the column has alive. Somebody is right.'}`, ch:[{t:'Walk on.', go:()=>startExplore()}]}),

  b2_east_wagons:()=>({sp:'The squad\'s carts', txt: !S.f.b2_lullYes || !S.f.b2_wicket ?
`The squad's carts and the squad's people, ${chainC()} of them, asleep or pretending. ${!S.f.b2_lull ? 'A marine captain has been asking for the Third Squad.' : 'Wicket\'s sappers are by the low rock.'}` :
`The squad's carts. ${chainC()} people asleep or pretending, and the dry streambed beyond them, and beyond that, a long way off, the Tithansi fires.

Out at the edge of the camp Nil and the other young warlock have stood up. The ground round them has gone dark, as if it were wet.

${S.f.b2_eastRest ? 'The squad is as ready as it is going to be.' : 'The squad has not sat down since dusk.'}`,
    html:chainHTML('The Odhan · nine days east of the P\'atha'),
    ch:[{t:'Down the hole.', req:()=>!!S.f.b2_lullYes && !!S.f.b2_wicket, go:'b2_tunnel_in'},
        {t:'Not yet.', go:()=>startExplore()}]}),
});

/* ---------------- the warlocks' cut, and the raid ---------------- */
Object.assign(B2CH3.dlg, {
  b2_tunnel_in:()=>({sp:'The edge of the camp', scene:'b2_tunnel', txt:
`It is not like digging. Nobody digs.

Nil kneels with his palms on the dark patch of ground and says something, and the other young warlock says something back, and the ground sighs. That is the only word for it. It sighs, and sags, and opens, slowly, the way a sleeping animal opens its mouth, and there is a slope going down into it, and a smell comes up out of it of roots and wet stone and something older.

Lull's people go down the big mouth to the south without a word, the historian among them with his short sword held as if it might bite him. Wicket's mouth is the small one, to the north. Wicket goes first. ${b2In('redblade') ? 'Ramin goes second, before anyone can stop him, very straight, as if walking into a temple he disapproves of.' : ''}${b2In('sathi') ? ` Hackle will not go in until Sathi does. Then he will not let her go first.` : ''}`,
    ch:[{t:'Down.', go:()=>{ startExplore('b2_tunnelway'); talk('b2_tunnel_arrive'); }}]}),
  b2_tunnel_arrive:()=>({sp:'The warlocks\' cut', scene:'b2_tunnel', fx:()=>{ S.f.b2_tunnelIn = 1; }, txt:
`Inside, it is cool. That is the first thing, and for a moment it is the only thing: after weeks on the Odhan, cool, like a hand on the back of your neck.

The walls are earth, packed hard as fired brick, laced through with pale roots that should not be this far down in a country with nothing growing on top of it. Here and there, set into the walls in little niches, there are lights. Not fire. Small, pale, cold things, the colour of moonlight on water, that do not flicker, and that you do not look at directly for long.

${b2In('sathi') ? `"Spirits," Sathi whispers. "Small ones. The warlocks asked them to hold the light, and the roof." She touches Hackle's head. "Do not thank them. It is rude. They are working."` : `Wicket, ahead, says over her shoulder: "Don't touch the lights. Don't thank them. Don't anything them."`}

And underfoot, in the low places, the floor is damp.`,
    ch:[{t:'On, quietly.', go:()=>startExplore()}]}),

  /* ---- the spirit-lights, and the Earth's Hand ---- */
  b2_light:()=>({sp:'A spirit-light', txt: S.f.b2_light ?
`A small cold light in its niche, holding up a hand's width of the roof. ${S.tricks && S.tricks.b2_earth ? `${NAME(S.tricks.b2_earth.who)} does not look at it. It does not look back. That seems to be the arrangement.` : 'It does not want anything from you.'}` :
`One of the small lights, in its niche in the wall. Up close it is not a flame or a stone. It is more like the memory of a light, a pale thing the shape of nothing, holding very still, the way a hare holds still in long grass.

The earth round it is cold to the touch. Colder than the tunnel. Colder than anything on the Odhan.

${b2In('sathi') ? `Sathi crouches by it and does not touch it. "On the plains the old women can do this," she says, very low. "Ask the ground for a thing. A hand. To hold a horse's feet, or a wolf's. You ask it like a horse, not like a god. You don't ask twice." She looks at the light. "This one is listening. I can feel it listening."` : `It is listening. You can feel it listening.`}`,
    ch:[{t:'Ask it the way the Wickans ask. For a hand, not a gift.', check:['wits',16], trick:'b2_earth', req:()=>!S.f.b2_light, fx:()=>{ S.f.b2_light = 1; },
          edges:id=>[id === 'sathi' && ['the old women on the plains', 2], id === 'marrow' && ['her warren argues with it', -1], id === 'redblade' && ['he will not look at it', -1]],
          go:'b2_light_ask', fail:'b2_light_no'},
        {t:'Leave it be. It is working.', req:()=>!S.f.b2_light, fx:()=>{ S.f.b2_light = 1; }, go:()=>startExplore()},
        {t:'Leave it.', req:()=>!!S.f.b2_light, go:()=>startExplore()}]}),
  b2_light_ask:()=>({sp:'A spirit-light', txt:
`${by({sathi:`Sathi puts her palm flat on the cold earth under the niche and says something in Wickan, slowly, the way you would talk a frightened horse down off a ridge. Not a prayer. A request, plainly made, with nothing promised for it.`, _:`{who} puts a palm flat on the cold earth under the niche, the way Sathi showed, and asks: not a prayer, not an order. A request, plainly made, with nothing promised for it.`})}

The earth takes hold of the hand.

Not hard. The way a hand takes a hand. Cold comes up into the wrist and stays there a moment, considering, and then lets go, and the light in the niche has not changed at all, except that it is now, very slightly, looking at you.

${b2In('sathi') ? `Sathi lets out a breath. "It said yes," she says. "Once. Each time. Don't ask it for more than a hand."` : `Somehow you understand the terms. Once. A hand. No more.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_light_no:()=>({sp:'A spirit-light', txt:
`${by({_:`{who} puts a palm on the cold earth under the niche and asks.`})} The earth does not answer. Not unkindly. It is working, and it has been asked for a great deal tonight, and this is not the voice it is listening for.

${b2In('sathi') ? `"It's busy," Sathi says. "It's holding a roof up over our heads. Let it."` : `The cold goes out of your hand. The light goes on holding up the roof.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the water in the walls ---- */
  b2_seep:()=>({sp:'The wall of the cut', txt: S.f.b2_seep ?
`Water, beading out of the wall and running down the roots in threads. ${S.f.b2_seepTook ? 'Somebody has scraped a hollow under it and it is filling, slowly.' : 'Wicket has chalked a mark beside it.'}` :
`Water.

It is beading out of the earth wall in a long dark patch and running down the pale roots in threads, and pooling in the low places, and it is the first water you have seen in nine days that nobody is standing over with a stave.

${b2In('marrow') ? `Marrow puts a fingertip to it, and to her tongue, and closes her eyes. "Sweet," she says. "Child, it's sweet. Not the Odhan's salt. Rain. Old rain." She opens her eyes. "It's coming up from underneath. The whole floor of this country is sitting on it, and nobody ever asked it to come up." She looks at the wall the way she looks at a wound that is closing.` : `You put a fingertip to it and taste it. Sweet. Old rain, a long way down, that nobody ever asked to come up.`}

${b2Tg() ? `Tangle has stopped humming. "If it's here," he says, "it's under the camp too. The whole camp. Sergeant, the warlocks did this. Did they know?"` : `If it is here, it is under the camp too.`}`,
    ch:[{t:'Scrape a hollow and fill a skin while you can.', req:()=>!S.f.b2_seep, fx:()=>{ S.f.b2_seep = 1; S.f.b2_seepTook = 1; chain(1, 0, 'Water from the walls of the cut'); }, go:()=>startExplore()},
        {t:'Leave it for now. Wicket marks it; the army will come back for it.', req:()=>!S.f.b2_seep, fx:()=>{ S.f.b2_seep = 1; S.f.b2_seepMarked = 1; }, go:'b2_seep_mark'},
        {t:'On.', req:()=>!!S.f.b2_seep, go:()=>startExplore()}]}),
  b2_seep_mark:()=>({sp:'Sergeant Wicket', txt:`Wicket chalks a sapper's mark on the wall beside it, a circle with a line through it, which means *here, and come back*. "Somebody'll be digging for this by morning," she says. "Not us. We're busy." She looks at the water a moment longer than she needs to.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_wicket_t:()=>({sp:'Sergeant Wicket', fx:()=>{ S.f.b2_wicketT = 1; }, txt:
`Wicket is crouched where the cut narrows, with her ear to the wall.

"Horses," she says. "Over us. A lot of them." She points up and ahead with her chin. "The mouth's past the water. Comes up in a gully under their picket lines. When we're up, we spread, we light, we fight whoever comes to see, and when I say *home* we're back down this hole before the second word." ${b2Tg() ? `She looks at Tangle. "You lit at the Sekala?" "Stones," says Tangle. "I laid stones." "Then you'll enjoy tonight."` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the mouth ---- */
  b2_tunnel_end:()=>({sp:'The mouth of the cut', txt:
`The cut comes up in a gully, under a lip of earth, with shallow water round your boots and the night sky above, and the smell of horses so strong it is like a wall.

Above the lip, the Tithansi picket lines: a long rope between stakes, horses on it, a guard-fire at each end, and men asleep by the horses with their spears beside them. Beyond them, a long way south, the main camp. Somewhere down there Lull is going in.

Wicket's people are already moving, flat, along the gully, with their oilcloth bundles. ${b2Tg() ? 'Tangle is with them. He has not hummed since the water.' : ''}`,
    ch:[{t:'Up, and into them.', go:()=>startBattle('b2_raid', {})},
        {t:'Tangle\'s burner into the picket lines first.', tag:'uses 1 burner', req:()=>b2Tg() && S.inv.burner > 0, fx:()=>{ S.inv.burner--; S.f.b2_raidBurner = 1; }, go:()=>startBattle('b2_raid', {pre:'Tangle\'s burner goes up the bank in a long low arc and lands among the horses.', surprise:'p'})},
        {t:'Sathi and Hackle go along the gully and take the guards at the far fire.', check:['guile',14], req:()=>b2In('sathi'),
          edges:id=>[id === 'sathi' && ['Hackle goes first', 2], id === 'redblade' && ['spurs', -2]],
          go:'b2_raid_quiet', fail:'b2_raid_loud'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_raid_quiet:()=>({sp:'The picket lines', txt:
`${by({sathi:`Sathi goes along the gully on her belly with the dog, and is gone. A breath. Two. At the far guard-fire a man sits down, and the one beside him turns round into Hackle.`, _:`{who} goes along the gully with Sathi and the dog. A breath. Two. At the far guard-fire a man sits down without a sound.`})}

Then Wicket lights, and the night goes white.`,
    ch:[{t:'Into them.', go:()=>startBattle('b2_raid', {surprise:'p'})}]}),
  b2_raid_loud:()=>({sp:'The picket lines', txt:
`A horse smells the dog. One horse, and then the whole line, all at once, screaming, rearing on the rope, and every man by the pickets is on his feet with a spear before Sathi is halfway along the gully. ${b2In('sathi') ? 'She says the word in Wickan that makes Hissari wince.' : ''}

Wicket lights anyway. Noise is noise.`,
    ch:[{t:'Up, and hold.', go:()=>startBattle('b2_raid', {surprise:'e'})}]}),

  b2_after_raid:()=>({sp:'The cut', scene:'b2_tunnel', fx:()=>{ S.f.b2_godrider = 1; gain('b2_tunnelroot'); }, txt:
`Wicket says *home*, and the roof comes down.

Not all of it. The mouth: a sapper's charge in the earth above the gully, and a long soft roar, and the cut behind you fills with earth and dust and dark, and the cold lights in the niches go out, one, two, three, all the way back, as if somebody were walking down the tunnel blowing them out. ${b2In('sathi') ? '"They let go," Sathi says, in the dark. "We are finished asking."' : ''}

The last you saw of it, it was standing in the mouth of the cut with the earth coming down on it, looking at you. Not angry. Interested.

You go home in the dark, by feel, through water to the ankles that was not there an hour ago.`,
    ch:[{t:'Home.', go:'b2_raid_star'}]}),
  b2_raid_star:()=>({sp:'The edge of the camp · before dawn', txt:
`You come up out of the north mouth into grey light, all of you. ${b2In('redblade') ? 'Ramin comes up last, as he went down second, and stands in the open air with his face turned up to it for a long moment.' : ''}

${b2In('sathi') ? `Sathi has something in her fist. She opens it in front of you without a word. A throwing star, black iron, five points, every point edged. She pulled it out of a dead Tithansi in the horse lines, she says. In the throat. "Not Wicket's," she says. "Not ours. Not a Wickan's. Nobody here throws this."` : `${b2In('haddat') ? 'Haddat' : 'Somebody in the squad'} has something in their fist: a throwing star, black iron, five points, every point edged, out of a dead Tithansi in the horse lines. Nobody in the squad threw it. Nobody here throws anything like it.`}

${b2Tg() ? `Tangle looks at it and goes very still. "Claw," he says, low. "That's a Claw's. Sergeant, put it away."` : `Wicket looks at it and goes very still. "Claw," she says. "Put it away, Sergeant."`}`,
    ch:[{t:'Give it to Captain Lull.', fx:()=>{ S.f.b2_clawStar = 'given'; }, go:'b2_raid_back'},
        {t:'Keep it. Say nothing.', fx:()=>{ S.f.b2_clawStar = 'kept'; gain('b2_clawstar'); if (b2Tg()) loy('tangle', -1); }, go:'b2_raid_back'}]}),
  b2_raid_back:()=>({sp:'The camp · dawn', scene:'b2_odhan_dusk', fx:()=>{ S.f.b2_raidDone = 1; }, txt:
`Lull's party is already back. Not all of it.

A marine is carrying Nil in her arms, the boy limp as washing, eyes open and seeing nothing, and a Wickan cattle-dog is dragging a travois behind her for the healers. Of the other young warlock there is no sign, and nobody says anything about it, and you understand that nobody is going to. The historian is sitting on the ground with his short sword across his knees and blood on it, looking at the sword as if it belonged to somebody else.

${S.f.b2_clawStar === 'given' ? `You give Lull the star. He turns it over once, in the grey light, and puts it away inside his jerkin very carefully, the way you would put away a letter you did not want to have received.

"Duiker found two more," he says. "In the bodies. Knives. Same make." He looks at you. "Something in that camp was killing Tithansi last night, Sergeant, and it wasn't us. I'm going to go and tell the Fist that now. You can watch his face if you like."` : `Lull looks at you, once, as if he knew there was something you were not saying, and lets it go. "Duiker found knives in the bodies," he says. "Claw make. Something in that camp was killing Tithansi last night, Sergeant, and it wasn't us." He goes to tell the Fist. You keep your hand off your pocket.`}

"And the warleader?" you ask.

"Dead. The one we went for." He rubs his face. "There was another one. Painted. You saw it, I think." It isn't a question. "It gets back up."`,
    ch:[{t:'"It does, sir."', go:'b2_water'}]}),
  b2_water:()=>({sp:'The camp · morning', scene:'b2_odhan_day', fx:()=>{ if (!S.f.b2_tunnelWater) { S.f.b2_tunnelWater = 1; chain(4, 0, 'The water under the camp'); } }, txt:
`By the middle of the morning the whole army is digging.

The historian told the Fist about the water in the warlocks' tunnel${S.f.b2_seep ? `, and so did Wicket, and somebody went down the south mouth with a skin and came back up with it full` : ''}, and now there are pits all through the camp, an arm deep, two arms, and in the bottom of every one of them, water. Sweet. Old rain. People are lying on their bellies at the edges of the pits with cups on cords, laughing, the way people laugh in a temple when the priest is not looking.

Your stretch digs its own. ${b2In('haddat') ? 'Haddat digs it, mostly, and then stands back and lets the children drink first, and then the old, and drinks last, slowly.' : 'The children drink first.'} The skins come up fat. ${b2In('sathi') ? 'Hackle lies in the bottom of the pit with his chin on the wet and will not come out.' : ''}

${b2In('marrow') ? `Marrow sits at the edge of the squad's pit with her feet in it. "Sormo says a piece of the Semk god lived through the Sekala," she says. "In a man. That thing last night. Sormo says it's badly hurt now." She moves her feet in the water. "He says it like a man who's hoping."` : `Word comes down from the Fist's tent that Sormo says a piece of the Semk god lived through the Sekala, in a man, and that the raid hurt it badly. He says it like a man who is hoping.`}`,
    html:chainHTML('Nine days east of the P\'atha · the pits'),
    ch:[{t:'On toward the P\'atha.', go:'b2_nine'}]}),
  b2_nine:()=>({sp:'The Odhan · toward the P\'atha', scene:'b2_odhan_dusk', txt:
`Nine days.

The Tithansi still ride at the tail every night, but fewer, and they do not come in as close. Nil walks again on the third day, with Nether holding his hand, and does not talk to anyone. ${b2In('sathi') ? 'Sathi says he went somewhere, under the ground, and met someone there, and will not say who.' : ''}

The land tips west. The column comes down a long slope at dusk, and below it there is a river, the P'atha, low and brown between banks of sand, and across the river a broad dry lake bed, and beyond the lake bed, a ridge.

On the ridge, in the last of the light, fires. More of them than at the Sekala.`,
    ch:[{t:'The river.', go:()=>{ startExplore('b2_patha'); talk('b2_patha_arrive'); }}]}),
});

/* ---------------- the P'atha: the eve of Gelor ---------------- */
Object.assign(B2CH3.dlg, {
  b2_patha_arrive:()=>({sp:'The P\'atha · dusk', scene:'b2_gelor', fx:()=>{ S.f.b2_gelor = 1; }, txt:
`The river is low, knee-deep at the fords, brown, with sandbars. Beyond it the dry lake bed runs west a long way, white and cracked, two thousand paces across, and at the far side of it the ground goes up all at once into a ridge.

Gelor Ridge. You can see what Reloe has done to it from here. His people have cut it. The whole face of the ridge has been dug away into cliffs, all but one place, where a long sandy ramp goes up between high banks to the top, like a road somebody built for you on purpose.

On top of it, an army. Not one army. Three, the outriders say, each bigger than the Seventh: city legions in blocks, tribes in clouds, and the banners of the Apocalypse over all of it.

${b2In('haddat') ? `Haddat looks at it a long time. "He has made it a gate," she says at last. "One way in. He wants us to walk up it." A pause. "Somewhere up there is my brother, Sergeant. Under those banners." She says it plainly, as she says the names of the dead.` : `It is a gate. One way in. Reloe wants you to walk up it.`}

Behind you, the Fist's tent is going up on the near bank. Nobody in the column is talking about going round.`,
    ch:[{t:'Make camp.', go:()=>startExplore()}]}),

  /* ---- Mincer, and Tangle's night ---- */
  b2_mincer3:()=> b2In('tangle') ? {sp:'Captain Mincer', fx:()=>{ S.f.b2_mincer3 = 1; }, txt:
`Mincer is sitting on the sand by the water with his slate, and three of his sappers are standing round him with their kit already on their backs. He doesn't get up.

"Sergeant. I need your man." He nods at Tangle. "Tonight. All of my company, every sapper who can still lift a pick." He lowers his voice, which on Mincer is the same as raising it. "We go over the river in the dark and up into the banks of that ramp, and we dig in, and we lie there under our shields with the earth on top of us, all night and half tomorrow, with Reloe's army walking about over our heads. And when the Fist comes up the ramp, we come up out of the banks."

He looks at you with no expression. "By morning my whole company will have deserted. Captain Sulmar will tell the Fist so, in a temper. Let him. You never saw me."

Tangle has already stood up. He is looking at the satchel. Then at you.

"Captain's stock is thin," Mincer says, to nobody. "After the Sekala."`,
    ch:[{t:'"Take the satchel, Tangle. Spend what the ramp needs."', fx:()=>{ S.f.b2_rampSatchel = 'took'; S.f.b2_tangleAway = 1; loy('tangle', 1); if (S.inv.sharper > 0) S.inv.sharper--; if (S.inv.cusser > 0) S.inv.cusser--; }, go:'b2_tangle_go'},
        {t:'"Go with Mincer\'s stock. Bring ours back."', fx:()=>{ S.f.b2_rampSatchel = 'left'; S.f.b2_tangleAway = 1; }, go:'b2_tangle_go'}]} : {sp:'Captain Mincer', fx:()=>{ S.f.b2_mincer3 = 1; }, txt:
`Mincer is sitting on the sand by the water with his slate. He looks up at you, and past you, and at the squad, and back at the slate.

"Sergeant." He makes a mark. "You never saw me. Tomorrow, you still haven't." He does not explain. He doesn't look like a man who ever has.`,
    ch:[{t:'"Sir."', go:()=>startExplore()}]},
  b2_tangle_go:()=>({sp:'Tangle', txt:
`${S.f.b2_rampSatchel === 'took' ? `Tangle takes a sharper and a cusser out of the satchel and puts them in the bag on his back, very carefully, and buckles the satchel and hands it to you. "${b2Count()}," he says. "That's what you've got. Don't let anybody throw it who doesn't know how." He thinks. "Nobody here knows how. Don't let anybody throw it."` : `Tangle buckles the satchel and hands it to you, all of it. "${b2Count()}," he says. "Count it while I'm gone. Out loud. I'll know if you don't."`}

${b2In('sathi') ? 'Hackle follows him to the water\'s edge and sits down there, and will not come back until Sathi calls him twice.' : ''}${b2In('redblade') ? ` Ramin salutes him, Malazan style, very correctly. Tangle looks at the salute as if it were a lit fuse.` : ''}

He goes down into the river in the dusk with Mincer's people, all of them carrying picks and shields and nothing else, and wades across, and goes up into the far bank under the ramp, and you lose him in the dark long before he gets there.

Just before you lose him, you hear him start humming. The four notes. Then nothing.`,
    ch:[{t:'Let him go.', go:()=>startExplore()}]}),
  b2_mincer3_again:()=>({sp:'The bank', txt:`Where Mincer was sitting there is a dent in the sand and nothing else. The sappers are gone. All of them. You never saw them.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Captain Sulmar: where has your sapper gone? ---- */
  b2_sulmar:()=>({sp:'Captain Sulmar · the Seventh', fx:()=>{ S.f.b2_sulmar = 1; }, txt:
`An old officer of the Seventh, grey and stiff and furious, with Captain Chenned standing a pace behind him looking at the river.

"Sergeant. You had one of Mincer's men." Sulmar does not wait. "Mincer's company is gone. All of it. Every pick and shovel. Deserted, the night before a battle, and Mincer with them." He is shaking slightly. "I'm going to the Fist. I want to know if your man said anything. Where they were going. Anything."

Chenned, behind him, does not look at you at all. That is how you know he knows.`,
    ch:[{t:'"Not a word, sir. He was just gone."', check:['guile',13], edges:id=>[id === 'sgt' && ['fourteen years of officers', 1]],
          go:'b2_sulmar_ok', fail:'b2_sulmar_doubt'},
        {t:'"Ask Captain Mincer, sir. When he turns up."', go:'b2_sulmar_doubt'}]}),
  b2_sulmar_ok:()=>({sp:'Captain Sulmar', txt:`Sulmar looks at you a long moment and then turns away, muttering about sappers and their mothers, and goes up the bank toward the Fist's tent at a stiff fast walk. Chenned goes after him. As he passes you he says, without moving his lips: "Good."`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_sulmar_doubt:()=>({sp:'Captain Sulmar', txt:`Sulmar's eyes narrow. "You know something." He thinks about it, and decides, visibly, that he has no time to find out what. "The Fist will hear of this. Deserters. The night before." He goes up the bank toward the Fist's tent. Chenned follows, and on the way past gives you a look that is very nearly a wink, which on Chenned's face is like seeing a rock smile.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Lull, the night before ---- */
  b2_lull3:()=>({sp:'Captain Lull', fx:()=>{ S.f.b2_lull3 = 1; S.f.b2_lull = 1; }, txt:
`Lull is sitting on his helmet on the sand, eating something out of a tin with his knife, watching the ridge the way a man watches weather coming.

"Sergeant. They tell me the sappers have deserted." He chews. "All of them. The night before a battle. Sulmar's beside himself." He swallows. "I don't believe a word of it, myself. Sappers never desert. They'd have to leave their munitions behind." He doesn't look at you. ${b2In('tangle') ? '"How\'s your man, by the way?"' : ''}

He points the knife at the ramp. "Corporal List and I are at the back tomorrow, with the historian, so somebody's there to see it if it goes wrong. Which it won't. The Fist says so." A beat. "The Fist has said so before, and been right, which is the most annoying thing about him."

He scrapes the tin. "That painted thing from the raid. Sormo says it's out there still. Behind the lines, with the Tithansi. Hurt." He puts the tin away. "Mind your people tomorrow, Sergeant. It's the soft thing it'll come for. It's what I'd do."`,
    ch:[{t:'"Sir."', go:()=>startExplore()}]}),

  /* ---- a Foolish Dog rider, heavy now ---- */
  b2_fdog:()=>({sp:'A Foolish Dog rider', fx:()=>{ S.f.b2_fdog = 1; }, txt:
`A big Foolish Dog rider is standing by his horse in a coat of Malazan scale that was made for somebody else, with a lance as long as two men leaning on his shoulder, looking unhappy about all of it.

"Heavy," he says to you in Malazan, before you can ask. He slaps the scale. "The Fist makes us heavy. The Seventh's spare armour, the Seventh's lances. Five thousand of us." He looks up at the ridge, and the ramp, and the army on top of it. "Uphill."

${b2In('sathi') ? `Sathi says something to him in Wickan. He laughs, a short bark, and answers. "He says the old historian told him heavy horse cannot charge up a hill," she says. "He says the old historian has not met his horse."` : `He shrugs, a great clank of borrowed scale. "The historian says heavy horse cannot go up a hill. The historian is a wise man." He grins. "He has not met my horse."`}`,
    ch:[{t:'Leave him to his horse.', go:()=>startExplore()}]}),

  /* ---- the Weasel captain: tomorrow ---- */
  b2_weaselcap3:()=>({sp:'The Weasel captain', fx:()=>{ S.f.b2_weaselcap3 = 1; }, txt:
`The Weasel captain from Dryj Spring is sitting on his heels by the river with his horse's reins looped round his wrist, and his teeth filed like the rest of them, and he looks at you the way a man looks at a tool he is thinking of using.

${b2In('sathi') ? (S.f.b2_c2_key === 'water' ? `He speaks to Sathi first. Something short, with the word for *weasel* in it; you have learned that much. Sathi's chin comes up.

"He says: the girl who rides like a Weasel still," she says. "He says tomorrow the clan will see if she is one."` : `He speaks to Sathi first. Something short. She answers stiffly.

"He says: the girl who stayed at the spring with the Malazans," she says. "He says it is not an insult. He says tomorrow the clan will see what it is."`) : `He looks at the squad, and nods once, as if he had counted it and found the number acceptable.`}

${b2In('sathi') ? `Then he talks to you, through her, slowly. "Tomorrow the Fist goes up the ramp with everything that can climb. Everything that cannot stays on the lake bed by the river. The Shallows. The column. Your people." Sathi's voice is careful. "He says the Weasels stay with the column. He says the column will be safe. He says it the way you say a thing you are going to make true."` : `Then, in slow Malazan: "Tomorrow. Fist goes up. Column stays. Shallows." He points at the lake bed. "Weasels stay with column." He grins, all points. "You will see."`}`,
    ch:[{t:'"How safe?"', go:'b2_weaselcap3b'},
        {t:'Leave him.', go:()=>startExplore()}]}),
  b2_weaselcap3b:()=>({sp:'The Weasel captain', txt:
`${b2In('sathi') ? `He looks at you a long moment before he answers, and Sathi listens, and does not translate at once.

"He says: safe as a lamb in a wolf-pit," she says at last. "It is a saying. On the plains, when wolves take the lambs, you dig a pit and put a lamb in it, and the wolves come." She stops. "He says: the lamb is very safe. It is in the middle of everything."` : `He thinks about it. Then he holds up one hand, flat, like a lid, and brings the other up under it, quick, and closes them. He doesn't explain. He doesn't stop smiling.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Duiker, the night before ---- */
  b2_duiker4:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duiker4 = 1; }, txt:
`The historian is standing at the edge of the river looking at the ridge, with his notebook shut in his hand.

"No scouts went up there," he says. "None came back with anything. We know there are three armies, each bigger than ours, and we know there is one road, and we know he built it for us." He doesn't look round. "I asked the Fist how we will win. He looked at me as if I had asked how the sun will come up."

${S.f.b2_duikerTold3 ? `He turns the notebook over. "I wrote down your column. Every name you gave me. If tomorrow goes the way I think, it will be the only part of the Seventh anyone can still read."` : `He opens the notebook, and closes it. "You owe me a column, Sergeant. I'd like it before the Fist proves me wrong."`}`,
    ch:[{t:'"Bult says we go through, sir."', go:'b2_duiker4b'},
        {t:'Leave him to the river.', go:()=>startExplore()}]}),
  b2_duiker4b:()=>({sp:'Duiker', txt:`"Bult says we go through." He laughs, not much. "Bult says a great many things." Then, quietly, the way you'd admit to something: "He's usually right." He puts the notebook away.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Nil and Nether, and a mare ---- */
  b2_mare:()=>({sp:'Nil and Nether', fx:()=>{ S.f.b2_mare = 1; }, txt:
`Nil and Nether are grooming a mare by the water. A grey, old for a Wickan horse, with a soft muzzle and a long patient face. They are doing it very thoroughly, the way you would do it before a feast-day. Nil has not spoken to anyone since the raid. He is talking to the mare.

Nether sees you. "She is going to run tomorrow," she says, in her good Malazan. "Further than any horse has ever run." She goes on combing the mane. "Don't touch her, Malazan. She's busy."

${b2In('sathi') ? `Sathi has gone very still. She looks at the mare, and at the two of them, and at the ridge, and something goes across her face that you do not have a word for. She does not go down on one knee this time. She turns away, and takes Hackle by the ruff, and walks off along the river, fast.` : `The mare puts her nose in Nil's hair. He stands very still and lets her.`}`,
    ch:[{t:'Leave them.', go:()=>startExplore()}]}),

  /* ---- Sathi's teeth ---- */
  b2_sathi_tree:()=>({sp:S.f.b2_sathiFile ? 'A dead tree' : 'Sathi', txt: S.f.b2_sathiFile || !b2In('sathi') ?
`A dead tree on the riverbank, white as bone, the only thing for a league that throws a shadow. ${S.f.b2_sathiFile === 'now' ? 'There is grit on the root where Sathi sat with the file-stone.' : ''}` :
`Sathi is sitting under the dead tree with her back to the trunk and Hackle across her feet, and a file-stone in her fist. A Weasel's file-stone, flat and grey and worn in the middle. Somebody gave it to her. She hasn't used it.

"The clan will be together tomorrow," she says, without looking up. "All the Weasels. All of them with their teeth for the Sekala." She turns the stone over. "And me with a child's."

She looks up at you. She is seventeen, and she has decided to ask you, and she hates that she has.

"Sergeant. What do I do?"`,
    ch:[{t:'"It\'s your clan\'s way. If you want it, do it now."', req:()=>b2In('sathi') && !S.f.b2_sathiFile, fx:()=>{ S.f.b2_sathiFile = 'now'; S.f.b2_sathiTeeth = 1; loy('sathi', 1); }, go:'b2_sathi_now'},
        {t:'"Wait. Do it with them, after tomorrow. They should see you earn it."', req:()=>b2In('sathi') && !S.f.b2_sathiFile, fx:()=>{ S.f.b2_sathiFile = 'wait'; }, go:'b2_sathi_wait'},
        {t:'"You don\'t need filed teeth to be a Weasel."', req:()=>b2In('sathi') && !S.f.b2_sathiFile, fx:()=>{ S.f.b2_sathiFile = 'no'; loy('sathi', -1); }, go:'b2_sathi_no'},
        {t:'Leave it.', req:()=>!b2In('sathi') || !!S.f.b2_sathiFile, go:()=>startExplore()}]}),
  b2_sathi_now:()=>({sp:'Sathi', txt:
`She nods, once. Then she turns her back to you, and to the camp, and does it, there under the tree, with the stone, the way the clan does it, and she does not make a sound, and it takes a long time.

When she turns round her mouth is bloody and her eyes are wet and she is grinning, all points. "Now," she says, thick. "Now they can look."

Hackle licks the blood off her chin. She lets him.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_sathi_wait:()=>({sp:'Sathi', txt:
`She thinks about that for a long time. Then she puts the stone away inside her shirt.

"After," she says. "With them. If they will have me." She puts her hand on Hackle's head. "You are a very Malazan sergeant. You want everything earned." A pause. "It is not stupid. It is only Malazan."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_sathi_no:()=>({sp:'Sathi', txt:
`She looks at you as if you had slapped her.

"You don't know what I need," she says, very quietly, in Malazan, and then something in Wickan, not quietly at all, and gets up and walks off along the river with the dog. The stone is still in her fist.

${b2In('haddat') ? 'Haddat, later, says only: "You told her she is not one of them, Sergeant. You meant the other thing. She heard that one."' : 'You meant the other thing. She heard that one.'}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_patha_river:()=>({sp:'The P\'atha', txt: S.f.b2_pathaWater ?
`The river, low and brown, with the column's cattle standing in it to the knees. Across it, the lake bed, and the ridge. ${S.f.b2_tangleAway ? 'Somewhere under that far bank, Tangle is lying in the dark with the earth on top of him.' : ''}` :
`A river. Low, brown, warm, and with water in it all the way across, after nine days of pits. Your people go down into it to the knees and fill everything they have.`,
    ch:[{t:'Fill the skins.', req:()=>!S.f.b2_pathaWater, fx:()=>{ S.f.b2_pathaWater = 1; chain(2, 0, 'The P\'atha'); }, go:()=>startExplore()},
        {t:'Leave it.', go:()=>startExplore()}]}),

  /* ---- Bult: sleep. Tomorrow, through ---- */
  b2_bult4:()=>({sp:'Bult', txt:
`Bult is lying on his back on a horse-blanket by the Fist's tent with his hands behind his head, looking at the ridge upside down.

"Sergeant." He doesn't sit up. "You've seen it. Good. Now stop looking at it. It doesn't get any smaller." He grins at the sky. "We can't go round. We can't go back. So we go through. The Fist has a plan, and the plan is: through." He laughs. "It's a good plan. I've seen worse. I've made worse."

${!S.f.b2_weaselcap3 ? `He rolls his head toward you. "Go and see the Weasel captain before you sleep. Tomorrow your people are his business. He'll want to look at you first."` : `He closes his eyes. "Your people stay on the Shallows tomorrow, with the Weasels. Do what the Weasels tell you." One eye opens. "Mostly."`}`,
    ch:[{t:'Sleep, and morning.', req:()=>!!S.f.b2_weaselcap3 && (!b2In('tangle') || !!S.f.b2_tangleAway), go:'b2_patha_morning'},
        {t:'"Sir."', go:()=>startExplore()}]}),
  b2_patha_morning:()=>({sp:'The P\'atha · morning', scene:'b2_gelor', fx:()=>{ if (!S.f.b2_pathaRest) { S.f.b2_pathaRest = 1; rest('The squad sleeps by the river, with water in it, and wakes before dawn with the whole army moving round it.'); } }, txt:
`Before dawn the Seventh forms up on the near bank, and you watch it go.

It goes like a spear. Marines at the point, in a wedge. Then the Crow Clan, riding wide, the barbs on the head. Then the Foolish Dog, five thousand of them, heavy, in borrowed scale, with the lances up like a forest walking. Then the wagons of the wounded, with the infantry round them, and at the back the Hissar Guard and the last of the Seventh's own cavalry. It goes over the river in the grey light and out across the lake bed toward the ramp, and the army on the ridge watches it come and makes a noise like the sea.

Everything that cannot climb stays behind. The refugees, the cattle, the nobles' carriages, the carts. The column. Yours.

It stays on the Shallows: a long flat reach of the lake bed by the river, where the water used to be when there was water, white and cracked and open on every side.

And the Weasels, who were all round the column last night, are gone.`,
    ch:[{t:'The Shallows.', go:()=>{ startExplore('b2_shallows'); talk('b2_shallows_arrive'); }}]}),
});

/* ---------------- the Shallows: the Weasels' bait ---------------- */
Object.assign(B2CH3.dlg, {
  b2_shallows_arrive:()=>({sp:'The Shallows · morning', scene:'b2_gelor', fx:()=>{ S.f.b2_shIn = 1; }, txt:
`Forty thousand people on a white lake bed, with nothing round them.

Away to the west the Seventh is going up the ramp. You can see it from here, small and clear in the morning light: the wedge of the marines at the top of the sand, and the arrows going down at it in clouds, and the Crow riders going wide at the archers on the banks. The noise comes a long time after, the way it did in the valley at Dryj.

Nobody on the Shallows is watching the ramp. Everybody on the Shallows is watching the other way, east, back over the river, at the empty country the column came out of. There is nothing there. That is what they are watching.

${b2In('sathi') ? `Sathi has her nose up like the dog's. "They are close," she says. "The Weasels. I can smell the horses. I cannot see them." She looks at you. "That is how you know it is a Weasel plan."` : `There are no Weasels anywhere. Not one.`}

Then one of them is standing beside you. The captain, on foot, from nowhere.`,
    ch:[{t:'"Captain."', go:'b2_weasel_order'}]}),
  b2_weasel_order:()=>({sp:'The Weasel captain', txt:
`${b2In('sathi') ? `He talks fast and low, and Sathi gives it to you a sentence behind, flat, the way she reports a horse's lameness.` : `He talks slowly, in Malazan, with his hands.`}

"The Tithansi are behind us. Over the river, in the gullies. All the lancers they have left, and the painted one with them. They think the Wickans went up the ramp with the Fist. They think the column is alone." ${b2In('sathi') ? 'Sathi\'s voice does not change. "He says: they are right to think it. That is why they will come."' : ''}

"When they come, we want them all the way in. All of them. Not at the edge, where they can turn and go home and come again tomorrow. In the middle. Among the carts." He looks at your stretch of the column, ${chainC()} people under the carts and round them. "So: your people go out. Onto the open ground, there, where the Tithansi can see them. Cattle and old women and children. No soldiers standing. Soldiers lie down in the dirt with the old women, and wait."

${b2In('sathi') ? `Sathi stops. Then she goes on, in the same flat voice. "When the lancers are among them, the clan comes. Then it is finished. He says: some of them will die before we come. He says: not as many as will die if the Tithansi come every night from here to Aren."` : `He makes the closing gesture with his hands. Then he holds up some fingers. Then more. He is telling you how many will die. He is telling you it is fewer than the other way.`}

He waits. ${b2In('sathi') ? `He is not looking at you now. He is looking at Sathi.` : ''}`,
    ch:[{t:'"How many?"', req:()=>!S.f.b2_orderAsked, fx:()=>{ S.f.b2_orderAsked = 1; }, go:'b2_weasel_ask'},
        {t:'"We\'ll do it." Herd your people out into the open.', fx:()=>{ S.f.b2_c3_key = 'bait'; if (b2In('sathi')) loy('sathi', 1); if (b2In('redblade')) loy('redblade', 1); if (b2In('haddat')) loy('haddat', -1); if (b2In('marrow')) loy('marrow', -1); }, go:'b2_key_bait'},
        {t:'"No. My people go under the wagons." Pull them back.', fx:()=>{ S.f.b2_c3_key = 'pull'; if (b2In('haddat')) loy('haddat', 1); if (b2In('marrow')) loy('marrow', 1); if (b2In('sathi')) loy('sathi', -1); }, go:'b2_key_pull'},
        {t:'Not yet.', go:()=>startExplore()}]}),
  b2_weasel_ask:()=>({sp:'The Weasel captain', txt:
`${b2In('sathi') ? `He answers before she has finished asking it. Sathi listens, and for a moment does not translate.

"He says: he does not know. He says: some. He says: a sergeant who counts his people should know that the count goes down either way, and should choose which way it goes down." She swallows. "He says it is a Wickan thing, to choose that. He says he thought it was a Malazan thing too."` : `He looks at you for a long time. Then he shrugs, and spreads both hands, and says one word in Malazan: "Some."`}

${b2In('haddat') ? `Haddat, behind you, has not moved. Her face is the face she wears to count the dead. "They are Hissari, Sergeant," she says, very low. "Every one of them. My street. My mother's street." That is all she says. It is enough.` : ''}${b2In('redblade') ? `

Ramin, very straight: "It is an order, Sergeant. From the people who will close the trap." He does not say whether he likes it. "In Ehrlitan, the company held the market the same way. With people in it." He stops there.` : ''}`,
    ch:[{t:'"We\'ll do it." Herd your people out into the open.', fx:()=>{ S.f.b2_c3_key = 'bait'; if (b2In('sathi')) loy('sathi', 1); if (b2In('redblade')) loy('redblade', 1); if (b2In('haddat')) loy('haddat', -1); if (b2In('marrow')) loy('marrow', -1); }, go:'b2_key_bait'},
        {t:'"No. My people go under the wagons." Pull them back.', fx:()=>{ S.f.b2_c3_key = 'pull'; if (b2In('haddat')) loy('haddat', 1); if (b2In('marrow')) loy('marrow', 1); if (b2In('sathi')) loy('sathi', -1); }, go:'b2_key_pull'},
        {t:'Not yet.', go:()=>startExplore()}]}),

  /* ---- the bait ---- */
  b2_key_bait:()=>({sp:'The Shallows', txt:
`The captain nods, once, as if you had told him the time, and is gone.

You get your people up. You tell them to walk out onto the open lake bed, away from the carts, and sit down there in the sun, and not to run when they see riders, whatever they see. They look at you. They do it. That is the worst of it: they do it, because you tell them to, because Bult gave them to you at Hissar and you have kept them alive since, and they have learned that when the sergeant says a thing it is the thing that keeps them alive.

${b2Ours3() === B2.elder ? `${B2.elder} goes out with ${B2.younger} by the hand and the jar under her arm. She doesn't ask why. At the edge of the carts she looks back at you once. You make yourself look back.` : b2Ours3() === B2.widow ? `${B2.widow} goes out with her grandsons and sits down on her rope in the middle of the white ground as if it were her own doorstep. "I hope you know what you're doing, soldier," she says. You don't answer.` : `A mother from the weavers' street goes out first, with the baby, and sits down, and the others follow her.`}

The squad goes with them, and lies down flat in the dirt among them, weapons under cloaks. ${b2In('haddat') ? `Haddat lies down beside a grandmother from the potters' street and puts her shield over both of them, and does not look at you.` : ''}${b2In('marrow') ? ` Marrow sits up, because Marrow sits, and holds a child in her lap, and says nothing at all.` : ''}

Then, out of the gullies across the river: lancers.`,
    ch:[{t:'Lie still. Wait for the Weasels.', go:'b2_bait_wait'}]}),
  b2_bait_wait:()=>({sp:'The Shallows', txt:
`They come over the river at a canter, a few hundred, spread wide, and on the lake bed they see the people sitting in the sun, and no soldiers, and they come in. You hear the people see them. You hear the sound go through the stretch, a sound like wind in reeds, and you feel every one of them want to run.

${b2In('sathi') ? `Behind them, at the back of the lancers, on a big horse, there is a painted figure sitting very upright, too still, with the paint run green. Hackle, flat beside Sathi, is shaking.` : `At the back of the lancers, on a big horse, a painted figure, too still.`}

The lancers reach the first of them.`,
    ch:[{t:'"Hold. Hold. Hold." Keep them sitting.', check:['might',13], edges:id=>[id === 'haddat' && ['they are her street', 2], id === 'sgt' && ['they are yours', 1]],
          clean:{t:'Not one of them runs. Not one.', fx:()=>{ S.f.b2_baitHeld = 2; }},
          go:'b2_bait_held', fail:'b2_bait_broke'}]}),
  b2_bait_held:()=>({sp:'The Shallows', fx:()=>{ S.f.b2_baitHeld = S.f.b2_baitHeld || 1; }, txt:
`They hold. Your voice, ${b2In('haddat') ? `and Haddat's under it in the quarter's own Hissari, ` : ''}low and steady, and the people of the stretch sit in the sun with lances coming at them and do not run, because you have told them not to.

The lancers go in among them. Then, from the east, from the north, from nowhere, the Weasels.

You come up out of the dirt with them.`,
    ch:[{t:'Up.', go:()=>startBattle('b2_bait', {surprise:'p'})}]}),
  b2_bait_broke:()=>({sp:'The Shallows', fx:()=>{ S.f.b2_baitHeld = 0; }, txt:
`Somebody runs. One. A boy. And then twenty, and the lancers turn after them the way dogs turn after anything that runs, and you are up out of the dirt before you have decided to be, and so is the squad.

Then, from the east, from the north, from nowhere, the Weasels.`,
    ch:[{t:'Into them.', go:()=>startBattle('b2_bait', {})}]}),
  b2_after_bait:()=>({sp:'The Shallows', scene:'b2_gelor', fx:()=>{ if (!S.f.b2_shDone) { S.f.b2_shDone = 1; chain(0, S.f.b2_baitHeld ? -6 : -8, 'The Shallows'); if (b2In('sathi')) { S.f.b2_weaselHonour = 1; if (S.f.b2_sathiFile === 'wait') S.f.b2_sathiTeeth = 1; } } }, txt:
`It is over quickly, after that. The Weasels close the trap from three sides and the river closes the fourth, and the Tithansi who rode in among the bait do not ride out.

At the back, the painted one on the big horse turns, and for a moment looks straight across the lake bed at you, interested, the way it looked at you from the mouth of the cut. Then the ground under its horse opens. Not a hole: hands. Shapes coming up out of the earth, the way they came up round the Semk god beyond the Sekala, low and quick and without faces, and they go up the horse and up the thing on it, and you look away. ${b2In('sathi') ? 'Sathi doesn\'t. Sathi watches all of it.' : ''}

Then it is only the Shallows, white, with people lying on it who are not going to get up.

You count. ${b2In('haddat') ? 'Haddat counts with you, and says the names.' : 'You know most of the names.'} ${S.f.b2_baitHeld ? 'They held. Fewer died because they held. It is a great many.' : 'They ran, some of them, and the lancers went after the ones who ran. It is a great many.'}${b2In('sathi') ? `

The Weasel captain rides past, slow, blood to the elbows, laughing the Weasel laugh. He stops by Sathi and says three words to her, and touches her shoulder with the butt of his lance, the way you'd touch a horse that had run well, and rides on.

She does not tell you what he said. She does not have to. ${S.f.b2_sathiFile === 'wait' ? 'That night she sits with the clan, by their fire, and comes back to the squad at dawn with her mouth bloody and her teeth filed to points, grinning.' : S.f.b2_sathiFile === 'now' ? 'She grins at you, all points.' : 'She stands very straight for the rest of the day.'}` : ''}`,
    html:chainHTML('The Shallows · after'),
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- the pull ---- */
  b2_key_pull:()=>({sp:'The Shallows', txt:
`The captain looks at you for a long time. ${b2In('sathi') ? `Then he says something to Sathi, not to you, short, and turns his back on both of you and is gone.

She doesn't translate it. She doesn't move. "Sathi," you say. "Get them under the wagons." She does it. She doesn't look at you while she does it.` : `Then he shrugs, and turns his back, and is gone.`}

You get your people back in among the carts, under them, behind them, a wall of wheels and tailboards with the stretch inside it and the squad in front. ${b2In('haddat') ? `Haddat does it fast and quiet, in the quarter's Hissari, and nobody argues with her.` : ''}${b2In('marrow') ? ` Marrow says, to nobody, "Good," and then, "Hood help us," and sits down behind a wheel.` : ''}

All down the Shallows the other stretches are walking out onto the open ground and sitting down in the sun. Yours is not. There is a gap in the bait the shape of a sergeant's choice.

Then, out of the gullies across the river: lancers. They see the people in the sun. They see the wagons. They see the gap.`,
    ch:[{t:'Hold the gap.', go:()=>startBattle('b2_pull', {})}]}),
  b2_after_pull:()=>({sp:'The Shallows', scene:'b2_gelor', fx:()=>{ if (!S.f.b2_shDone) { S.f.b2_shDone = 1; chain(0, -2, 'The Shallows'); if (b2In('sathi')) S.f.b2_sathiShamed = 1; } }, txt:
`The Weasels closed the trap. Late, from three sides, with the river on the fourth, and most of the Tithansi who rode in did not ride out. Some did, through the gap, past your wagons, and the Weasels who went after them did not all come back.

At the back, the painted one on the big horse turns, and for a moment looks straight across the lake bed at you. Then the ground under its horse opens. Not a hole: hands. Shapes coming up out of the earth the way they came up round the Semk god beyond the Sekala, and they go up the horse and up the thing on it, and you look away.

Your people come out from under the wagons. Nearly all of them. ${b2Ours3() === B2.elder ? `${B2.elder} has ${B2.younger} by the hand and the jar under her arm.` : b2Ours3() === B2.widow ? `${B2.widow} comes out last, with her grandsons and her rope, and looks out at the white ground where the other stretches sat, and does not say anything at all.` : ''} Out on the open lake bed the other stretches are counting theirs.${b2In('sathi') ? `

The Weasel captain rides past, slow, blood to the elbows. He does not stop. He does not look at Sathi. Behind him the clan rides past, one after another, and none of them looks at her, and she stands there by the wagons with her chin up and her bow in her hand and Hackle pressed against her leg, and lets them not look at her, all the way to the last rider.

Then she goes behind the wagons, alone. When she comes back her face is dry and she does not laugh at anything for the rest of the day.` : ''}`,
    html:chainHTML('The Shallows · after'),
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_weaselcap_after:()=>({sp:'The Weasel captain', txt: S.f.b2_c3_key === 'bait' ?
`The captain is washing his arms in the river. He lifts his chin at you, which from a Weasel is a speech. ${b2In('sathi') ? 'He says something to Sathi. She grins.' : ''}` :
`The captain is washing his arms in the river. He sees you, and goes on washing.`,
    ch:[{t:'Leave him.', go:()=>startExplore()}]}),

  /* ---- the squad's people, before and after ---- */
  b2_ours_sh:()=>({sp:'The squad\'s people', fx:()=>{ S.f.b2_oursSh = 1; }, txt: !S.f.b2_shDone ?
`Your stretch, round the carts, on the white ground, with the noise of the ridge coming over them like weather. ${chainC()} of them. They are watching you. They have learned to watch you. When you move, they get ready to move.` : S.f.b2_c3_key === 'bait' ?
`What is left of your stretch is sitting where you told them to sit, on the white ground, among the ones who are lying down. Nobody is blaming you. That is the thing you will remember later. Nobody says a word.` :
`Your stretch is out from under the wagons, sitting in the shade of them, ${chainC()} of them, mostly whole. They are looking out at the open ground where the other stretches sat. Nobody says anything about that either.`,
    html:chainHTML('The Shallows'),
    ch:[{t:'Leave them be.', go:()=>startExplore()}]}),

  /* ---- Haddat and a city boy among the Tithansi ---- */
  b2_cityboy:()=>({sp:'A Tithansi rider', txt:
`Among the dead Tithansi at the edge of the lake bed, one who is not dead yet. Young, with braids that are not quite right, and a green cloth on his arm, and a lance-wound that Marrow would not try to close. ${b2In('haddat') ? `Haddat is already kneeling by him. He has said something to her in the quarter's Hissari, and she has gone still.` : ''}

He is from Hissar. The weavers' street. ${b2In('haddat') ? `She asks him, very gently, in the voice she uses for the column's children. Not his name. Another name.` : ''}`,
    ch:[{t:'Let Haddat ask.', req:()=>b2In('haddat'), go:'b2_cityboy2'},
        {t:'Give him water.', tag:'1 water', req:()=>chainW() > 0, fx:()=>{ chain(-1, 0, 'A mouthful for a dying boy'); S.f.b2_boyWater = 1; }, go:'b2_cityboy2'},
        {t:'Sit with him.', req:()=>!b2In('haddat'), go:'b2_cityboy2'}]}),
  b2_cityboy2:()=>({sp:'A Tithansi rider', fx:()=>{ S.f.b2_cityboy = 1; S.f.b2_ilharRidge = 1; if (S.f.b2_prisonerFate === 'free') S.f.b2_skinFound = 1; if (b2In('haddat')) loy('haddat', 1); }, txt:
`${S.f.b2_boyWater ? 'He drinks. Most of it does not stay in him. ' : ''}He talks, the way the dying talk, quickly, as if there were a great deal to get through.

"The water-seller's man. The one who talks to the chiefs." He tries to laugh. "He wasn't with us. He went up last night. To Reloe's tent. On the ridge. With the chiefs' word. He said the lancers were a waste. He said..." He stops, and starts again. "He said his sister would be on the Shallows. He said to look for a blue shield and leave it alone."

${b2In('haddat') ? `Haddat does not move. Her shield is beside her on the white ground: the Hissari auxiliary's faded blue.

The boy dies a little after that, still talking. Haddat closes his eyes, and says his street's name over him, and then, very quietly, in the quarter's Hissari, a name that is not his. The first time you have heard her say it since Hissar.

She stands up. "He was not with the lancers," she says to you, in Malazan, reporting. "He is on the ridge. With Reloe." She picks up her shield. "That is all he knows, Sergeant."` : `He dies a little after that, still talking.`}${S.f.b2_prisonerFate === 'free' ? `

Nearby, on a dead Tithansi horse, a water-skin with the Seventh's stamp burned into the leather. The squad's. The one you gave a boy from the tanners' street at Dryj Spring, and let walk away over the skyline. ${b2In('haddat') ? 'Haddat looks at it a long time, and then at the dead round it, one by one, every face. He is not among them. She says so. She does not say whether that is better.' : 'He is not among the dead. You look.'}` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_shallows_river:()=>({sp:'The P\'atha', txt:`The river, low and brown. ${S.f.b2_shDone ? 'Weasels are watering their horses in it, and washing, and the water goes downstream a different colour.' : 'On the far bank, the gullies. Nothing moves in them. Everybody watches them.'}`, ch:[{t:'Leave it.', go:()=>startExplore()}]}),

  /* ---- the dead trees: the ring, and the wagons rolling south ---- */
  b2_shallows_tree:()=> S.f.b2_ringDone ? {sp:'The dead trees', txt:`Two dead trees on the lake bed, white as bone, and round them the wagons of the wounded, drawn up again, and the Hissar Guard sitting down where they stood.`, ch:[{t:'Dusk.', go:'b2_dusk'}, {t:'Not yet.', go:()=>startExplore()}]} : !S.f.b2_shDone ? {sp:'The dead trees', txt:`Two dead trees on the white ground, the only shade on the Shallows. Nobody is sitting in it. Everybody is watching the river.`, ch:[{t:'Leave them.', go:()=>startExplore()}]} : {sp:'The lake bed', txt:
`Out past the dead trees, on the lake bed between the Shallows and the ramp, the Seventh's ring is bending.

You can see it from here. The wagons of the wounded in the middle, and the infantry round them in a ring, and coming at the ring from the north, out of the northern lake bed, the city legions: Ubari, by the standards, block after block of them, and cavalry on their flanks. The ring bends. It bends in, and the wagons start rolling south, away from it, toward you, and the Hissar Guard at the back of the ring is going down under the cavalry.

A Crow rider comes down off the lake bed at a gallop and reins in by the dead trees and shouts in Malazan to anybody standing: squads, any squads, to the wagons, now.

${b2In('haddat') ? '"The Hissar Guard," Haddat says. "Those are ours." She is already moving.' : 'The Hissar Guard. They held Hissar\'s walls for you once.'} ${S.f.b2_tangleAway ? 'Tangle is somewhere up there in the bank of the ramp. Your satchel is on your own back, and nobody in the squad can throw it.' : ''}`,
    ch:[{t:'To the wagons.', go:()=>startBattle('b2_ring', {})},
        {t:'Not yet.', go:()=>startExplore()}]},
  b2_after_ring:()=>({sp:'Gelor Ridge', scene:'b2_charge', fx:()=>{ S.f.b2_ringDone = 1; S.f.b2_gelor = 1; }, txt:
`You see the rest of it from the wagons.

The light on the ridge was the mare. You understand that afterward, the way you understand most things about the Wickans: afterward, and not all the way. Nil and Nether led her up behind the marines, the old grey with the patient face, and did something to her there at the top of the ramp, and the white went out of her and into five thousand horses all at once, and they went up that sand as if it were flat. And then down.

And as the Foolish Dog came up the ramp, the banks on either side of it came up too. Men, out of the earth, with shields, out of holes nobody had seen dug: Mincer's sappers, every one of them, who had lain there all night with Reloe's army walking about over their heads. Their munitions went into the elite at the top of the ramp, and the Foolish Dog went over the sappers' shields and through what was left.

${b2In('sathi') ? `Out on the northern lake bed, last of all, the Weasels came. They had finished with the Tithansi and they came on round the Shallows with the cattle-dogs running in front of them, onto the flank of the city cavalry that had broken the Hissar Guard, and Sathi, standing on a wagon to see, laughs out loud for the first time all day. ${S.f.b2_sathiShamed ? 'Then she stops, as if she had remembered something.' : ''}` : `Out on the northern lake bed, last of all, the Weasels came round the Shallows with the cattle-dogs running in front, onto the flank of the city cavalry. It ended there.`}

By the middle of the afternoon there is nobody on Gelor Ridge but the Seventh.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- dusk: Tangle comes back, and Lull, and the count ---- */
  b2_dusk:()=>({sp:'Below Gelor Ridge · dusk', scene:'b2_odhan_dusk', fx:()=>{ if (S.f.b2_tangleAway && !S.f.b2_tangleBack) { S.f.b2_tangleBack = 1; gain('b2_sappershield'); } }, txt:
`${S.f.b2_tangleAway ? `Tangle comes back at dusk, walking, filthy from his hair to his boots, as if somebody had dug him up. Which somebody did.

He sits down next to the satchel without a word, and opens it, and counts it, out loud: "${b2Count()}." He closes it. Then he takes the iron boss off his shield, which is dented in the exact shape of a horse's hoof, and puts it in your hand.

"Over my face," he says. "The whole Foolish Dog. Five thousand. Over my face." He thinks about it. "${S.f.b2_rampSatchel === 'took' ? `The sharper went into the Guran at the top. The cusser went into the rest. Gone for good, both. Worth it.` : `Mincer's stock did it. Thin, like he said. Enough.`} The captain says we were deserters all night and heroes by noon, and Sulmar owes him an apology, and won't." He lies down flat on his back on the lake bed. "Don't let anyone step on me."` : `The sappers come back at dusk, walking, filthy from their hair to their boots, as if somebody had dug them up. Which somebody did.`}

Lull comes down the ramp a little after, between two marines, on his own feet. His face is wrapped in a bandage that is mostly red, all down one side. A mace, the marines say. One eye. His nose.

He sees you, with the eye he has left. "Sergeant." His voice is thick under the wrapping. "You'll note I'm still prettier than the historian." He keeps walking.

${b2In('marrow') ? `Marrow watches him go. "That'll scar," she says. "The eye's gone. The rest he'll live with." She has ${b2Knots()}.` : ''}`,
    ch:[{t:'Find Bult.', fx:()=>{ S.f.b2_lullHurt = 1; }, go:'b2_dom'}]}),
  b2_dom:()=>({sp:'Bult', scene:'b2_gelor', fx:()=>{ S.f.b2_dom = 1; }, txt:
`Bult is sitting on a dead horse at the foot of the ramp with a skin of wine he has got from somewhere, and for once he is not laughing at anything.

"Sergeant. You held. Good." He drinks. "The Fist says the count is done. You don't want to hear it. Duiker's writing it down, and he's not enjoying it." He holds the skin out to you. "The Tithansi are finished. There aren't enough of them left to call a tribe. Reloe's army is in pieces all over the Odhan."

He takes the skin back. "And Reloe's done. He'll never command again; nobody will follow him across the road now. There's another one picking up the pieces." He says the name as if it tasted of something. "Korbolo Dom. A Napan. Half a Napan. He was one of ours, Sergeant. A Fist of the Empire. He knows how we march, and how we camp, and where we put the wagons." He looks at the ridge. "Reloe was a mage who thought he was a general. Dom is a general."

He gets up off the dead horse. "Count them, Sergeant. Then sleep. Tomorrow we walk, and he'll be behind us."`,
    ch:[{t:'Count them.', go:'b2_c3_end'}]}),
  b2_c3_end:()=>({sp:'Below Gelor Ridge · night', scene:'b2_charge', txt:
`You count them.

${chainC()} in the squad's stretch, on the lake bed below Gelor Ridge, in the lee of the wagons. ${S.f.b2_c3_key === 'bait' ? 'Fewer than this morning, by the ones the Shallows kept. You have their names. Somebody should.' : 'Nearly all of them. Out on the Shallows the other stretches are counting fewer. You hear them doing it.'} ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'} of the P'atha on the carts.` : 'No water worth the name.'}

${b2In('sathi') ? (S.f.b2_c3_key === 'bait' ? `Across the camp the Weasels are singing over their dead and laughing between the verses, and Sathi is with them, by their fire, for the first time since Hissar. Hackle is with the squad. He keeps looking over at the fire, and then at you, as if he would like somebody to explain.` : `Across the camp the Weasels are singing over their dead and laughing between the verses. Sathi is with the squad. She sits with her back to the Weasels' fire and her arm round the dog and does not look at it, all night.`) : ''}${b2In('haddat') ? `

Haddat sits with her shield across her knees and looks at the ridge, black against the stars, where a man from the water-sellers' quarter was last night and is not now.` : ''}

Korbolo Dom. The name goes round the fires like a cold wind. Behind you, the ridge. In front of you, the Vathar, and Aren, and a great deal of Odhan in between.`,
    html:chainHTML('Below Gelor Ridge'),
    ch:[{t:'Sleep.', go:()=>chapterEnd(3, S.f.b2_c3_key || 'bait')}]}),
});
