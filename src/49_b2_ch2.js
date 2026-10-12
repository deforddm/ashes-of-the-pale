/* ============ Book Two, Chapter 2: The Odhan ============ */
/* Months on the march, Dryj Spring, the first real thirst, and the Sekala Crossing.
   Key (S.f.b2_c2_key): 'spring' (the squad stayed and held Dryj Spring for the refugees while the Wickans rode: column up)
   or 'water' (the squad rode with a Weasel party to take a Tithansi well: water up, and the spring paid for the squad's absence).
   New here: the fouled-warren sputter (47), the Red Blade recruit Ramin ('redblade', 47), Mincer's Drop (a trick, below). */

/* Marrow's string, as a sentence: the clean knots and the spoiled ones */
const b2Knots = () => { const k = S.f.b2_knots || 0, s = S.f.b2_sputters || 0;
  return k || s ? `${numw(k, true)} new knot${k === 1 ? '' : 's'} since Hissar, and ${s ? `${numw(s)} healing${s === 1 ? '' : 's'} the warren spoiled, which she counts on her fingers and does not tie` : 'nothing the warren has spoiled yet, which she does not trust'}` : 'no new knots since Hissar, which she says is because nobody has been stupid enough to need one'; };
/* the people the squad brought out of Hissar, by name, for a line of text */
const b2Ours = () => S.f.b2_key === 'daughters' ? `${B2.elder} and ${B2.younger}` : S.f.b2_yedda ? `${B2.widow} and her grandsons` : 'the squad\'s people';

/* Mincer's Drop: sapper's lore from the Sekala ford. Everyone near the bearer goes flat in a fold of ground: hard to shoot, hard to hit with a throw. */
Object.assign(TRICKS, {
  b2_drop:{name:'Mincer\'s Drop', ch:2, use:'fight', ab:'t_b2_drop', where:'the Sekala ford, with Mincer\'s sappers',
    lore:'When the fuse is lit, you drop. Not crouch, not duck: drop, flat, into whatever fold the ground has, and the ground always has one if you know how to look. Mincer\'s sappers can be flat before the word is finished.',
    get fx(){ return `Once a fight: the bearer shouts it, and the bearer and every squadmate within 2 go flat. Until the bearer's next turn, shots and sorcery from more than a step away are −${3 + lvT()} to hit them. Grows with level.`; }},
});
Object.assign(AB, {
  t_b2_drop:{name:TRICKS.b2_drop.name, trick:'b2_drop', self:true, desc:()=>TRICKS.b2_drop.fx,
    run(u){ const near = party().filter(p => !p.ally && cheb(p, u) <= 2); AUDIO.play('step');
      near.forEach(p => { p.flatUntil = B.round + 1; p.flatAc = 3 + lvT(); float(p, 'flat', '#c8b08a'); sparks(p.x, p.y, 6, '#a99a88', .3); });
      blog(`${u.name}: "*Down!*" ${near.length > 1 ? 'The squad hits the dirt the way Mincer\'s people do, all at once, in whatever fold the ground offers.' : 'One body, flat in the dust.'}`); }},
});

const B2CH2 = {
  title:'The Odhan', number:'Two',
  intro:{loc:'The Odhan', sub:'South and west of the Vin\'til Basin · summer', scene:'b2_odhan_day', cap:'The column going on into the glare, and the dust going up off it.',
    paras:[
`After Bat'rol the Seventh walks. It walks south and west across the Odhan, a country of hardpan and thorn and wind that tastes of salt, and it takes the refugees with it, all of them, at the pace of the slowest cart.`,
`The green army did not stay broken. It ran to Meila Oasis, drank it dry, and came back, the way Sathi said it would, and now there are always riders on the skyline. Tithansi, mostly. They do not charge any more. They wait.`,
`Bult says the next sweet water is Dryj Spring. Bult says a great many things. You have learned which of them to believe: the ones he does not laugh at.`],
    go:'On', node:'b2_c2_start'},

  areas:[
    /* 16 x 12.  . hardpan  , scrub  s sand  # rock  r low rock  x dead tree  = tent  W wagon  h horse lines  o the spring pool  t tamarisk */
    { id:'b2_dryj', title:'Dryj Spring · the Odhan', sub:'Day · heat · forty thousand people and one spring', hint:'Tap ground to move · tap a figure to talk · the pool is in the tamarisks', decor:'odhan',
      map:[ "################",
            "#..t..,...=..hh#",
            "#.t.ooo..=....h#",
            "#..ooooo.......#",
            "#.t.ooo..t..W..#",
            "#....,.........#",
            "#.=........=...#",
            "#..=..,...r....#",
            "#......W.....s.#",
            "#,..x.......ss.#",
            "#.s.....,....,.#",
            "################" ],
      walk:'.,s', triggers:{o:'b2_pool', W:'b2_dryj_wagons'}, start:{x:7, y:10},
      quest:()=> S.f.b2_prisonerDone ? 'The column moves. The wagons.' : S.f.b2_dryjFight ? 'There is a prisoner. Haddat wants a word with him.' : S.f.b2_c2_key ? 'Go.' : !S.f.b2_bult2 ? 'Bult is by the wagons, giving orders and laughing at them.' : 'Bult wants an answer: the spring, or the ride.',
      npcs:[
        {id:'bult2', name:'Bult', kind:'bult', x:8, y:5, node:()=>S.f.b2_c2_key ? 'b2_bult2_again' : 'b2_bult2', fresh:()=>!S.f.b2_bult2},
        {id:'coltaine2', name:'Coltaine', kind:'coltaine', x:12, y:2, node:()=>'b2_coltaine2', show:()=>!S.f.b2_c2_key, fresh:()=>!S.f.b2_coltaine2},
        {id:'weasel2', name:'A Weasel rider', kind:'wickan', x:11, y:1, node:()=>'b2_weasel2', show:()=>!S.f.b2_c2_key || S.f.b2_dryjFight, fresh:()=>!S.f.b2_weasel2},
        {id:'steward', name:'A noble\'s steward', kind:'noble', x:8, y:3, node:()=>S.f.b2_steward ? 'b2_steward_again' : 'b2_steward', fresh:()=>!S.f.b2_steward},
        {id:'imra2', name:B2.elder, kind:'hissari_w', x:5, y:7, node:()=>'b2_ours_dryj', show:()=>S.f.b2_key === 'daughters', fresh:()=>S.f.b2_key === 'daughters' && !S.f.b2_oursDryj},
        {id:'yedda2', name:B2.widow, kind:'hissari_w', x:5, y:7, node:()=>'b2_ours_dryj', show:()=>S.f.b2_key !== 'daughters' && !!S.f.b2_yedda, fresh:()=>S.f.b2_key !== 'daughters' && !!S.f.b2_yedda && !S.f.b2_oursDryj},
        {id:'prisoner', name:'A prisoner', kind:'rebel', x:3, y:6, node:()=>S.f.b2_prisonerDone ? 'b2_prisoner_again' : 'b2_prisoner', show:()=>!!S.f.b2_dryjFight && S.f.b2_prisonerFate !== 'free', fresh:()=>!!S.f.b2_dryjFight && !S.f.b2_prisonerDone} ] },

    /* 16 x 12.  . hardpan  , scrub  s sand  r low rock  x dead tree  b bones  = tent  W wagon  F campfire */
    { id:'b2_road', title:'The Odhan · a night on the march', sub:'Night · no moon · the first real thirst', hint:'Tap ground to move · tap a figure to talk · the squad\'s fire, then the wagons', decor:'odhan_night', dark:true,
      map:[ "################",
            "#.,..=....,..=.#",
            "#....=..F......#",
            "#.,.......W....#",
            "#..r.....,..,..#",
            "#.....=.....x..#",
            "#.b.........,..#",
            "#....W...F.....#",
            "#.,......,..=..#",
            "#..s...r.....,.#",
            "#ss..,.....b..s#",
            "################" ],
      walk:'.,s', triggers:{F:'b2_road_fire', W:'b2_road_on', b:'b2_bones'}, start:{x:8, y:9},
      quest:()=> S.f.b2_tailDone ? 'The wagons. On toward the river.' : !S.f.b2_roadRest ? 'The squad\'s fire. Count the skins.' : 'The wagons, when the squad is ready to go on.',
      npcs:[
        {id:'oxman', name:'A man with an ox', kind:'hissari_m', x:4, y:6, node:()=>S.f.b2_ox ? 'b2_ox_again' : 'b2_ox', fresh:()=>!S.f.b2_ox},
        {id:'feverg', name:'A grandmother', kind:'hissari_w', x:11, y:4, node:()=>S.f.b2_fever ? 'b2_fever_again' : 'b2_fever', fresh:()=>!S.f.b2_fever},
        {id:'weaselh', name:'A Weasel rider', kind:'wickan', x:13, y:2, node:()=>'b2_weasel_horse', fresh:()=>!S.f.b2_weaselHorse},
        {id:'dessi3', name:B2.younger, kind:'child', x:9, y:8, node:()=>'b2_road_ours', show:()=>S.f.b2_key === 'daughters', fresh:()=>S.f.b2_key === 'daughters' && !S.f.b2_roadOurs},
        {id:'yedda3', name:B2.widow, kind:'hissari_w', x:9, y:8, node:()=>'b2_road_ours', show:()=>S.f.b2_key !== 'daughters' && !!S.f.b2_yedda, fresh:()=>S.f.b2_key !== 'daughters' && !!S.f.b2_yedda && !S.f.b2_roadOurs} ] },

    /* 16 x 12.  . bank mud  , reeds  s sand  r rock  # cut bank  W wagon  = tent  - shallow ford water  ~ deep water  p the paved ford */
    { id:'b2_ford', title:'The Sekala · the east bank', sub:'Before dawn · the army crossing in the dark', hint:'Tap ground to move · tap a figure to talk · the paved ford, when the squad is called', decor:'river',
      map:[ "################",
            "#..=...,..W..=.#",
            "#.=..........=.#",
            "#.....,..r.....#",
            "#..W.......,...#",
            "#,....=........#",
            "#...........,..#",
            "#ss..s..sss..ss#",
            "#sss,ss.sssssss#",
            "#--~~~pppp~~~--#",
            "#~~~~~pppp~~~~~#",
            "################" ],
      walk:'.,s-', triggers:{p:'b2_cross', W:'b2_ford_wagons'}, start:{x:7, y:1},
      quest:()=> !S.f.b2_mincer ? 'Tangle wants you to meet his captain. Down at the water.' : !S.f.b2_fordWork ? 'Tangle is in the river with the sappers.' : 'The ford. The squad\'s stretch crosses when it is called.',
      npcs:[
        {id:'mincer', name:'Captain Mincer', kind:'mincer', x:8, y:7, node:()=>S.f.b2_mincer ? 'b2_mincer_again' : 'b2_mincer', fresh:()=>!S.f.b2_mincer},
        {id:'sapper', name:'A sapper', kind:'sapper', x:11, y:8, node:()=>S.f.b2_cusser || S.f.b2_cusserKept || (S.f.b2_fordWork && !b2In('tangle')) ? 'b2_ford_after' : 'b2_ford_work', fresh:()=>!!S.f.b2_mincer && !S.f.b2_fordWork},
        {id:'nil', name:'Nil', kind:'nil', x:3, y:5, node:()=>'b2_nil', fresh:()=>!S.f.b2_nil},
        {id:'nether', name:'Nether', kind:'nether', x:4, y:6, node:()=>'b2_nil', show:()=>!S.f.b2_nil || /^b2_nil/.test(S.node || '')},
        {id:'ramin1', name:'A Red Blade', kind:'redblade', x:12, y:3, node:()=>'b2_ramin_first', fresh:()=>!S.f.b2_raminFirst},
        {id:'duiker2', name:'A ragged man', kind:'duiker', x:6, y:2, node:()=>S.f.b2_duikerBack ? 'b2_duiker_again2' : 'b2_duiker_back', fresh:()=>!S.f.b2_duikerBack} ] },

    /* 16 x 12.  ~ deep water  - shallows  p the ford (behind)  s sand  . bank  , reeds  r rock  = tent  W wagon */
    { id:'b2_westbank', title:'The Sekala · the west bank', sub:'Day · the column coming over · the Semk on the ridge', hint:'Tap ground to move · tap a figure to talk · the ford is behind you now', decor:'river',
      map:[ "################",
            "#~~~~~pppp~~~~~#",
            "#--~~~pppp~~~--#",
            "#sss.ss..ss.sss#",
            "#..,....s....,.#",
            "#.=...r....=...#",
            "#.....,........#",
            "#..W.......=...#",
            "#.,....r.....,.#",
            "#....=......W..#",
            "#.,.....,....,.#",
            "################" ],
      walk:'.,s-', triggers:{p:'b2_ford_look', W:'b2_west_wagons'}, start:{x:7, y:3},
      quest:()=> !S.f.b2_westDone ? 'Captain Chenned is holding the line here. Report.' : !S.f.b2_blown ? 'The ford.' : S.f.b2_raminDone == null ? 'The Red Blades are counting their dead. One of them is looking at the squad.' : 'Night is coming. Bult is by the wagons.',
      npcs:[
        {id:'chenned', name:'Captain Chenned', kind:'b2soldier', x:5, y:6, node:()=>S.f.b2_westDone ? 'b2_chenned_again' : 'b2_chenned', fresh:()=>!S.f.b2_chenned},
        {id:'ramin2', name:'Ramin', kind:'redblade', x:10, y:6, node:()=>S.f.b2_raminDone != null ? 'b2_ramin_again' : 'b2_ramin', show:()=>!!S.f.b2_blown && !b2In('redblade') && S.f.b2_raminDone !== 0, fresh:()=>!!S.f.b2_blown && S.f.b2_raminDone == null},
        {id:'bult3', name:'Bult', kind:'bult', x:12, y:8, node:()=>'b2_ubaryd', show:()=>!!S.f.b2_blown, fresh:()=>!!S.f.b2_blown && !S.f.b2_ubaryd},
        {id:'ours4', name:'The squad\'s people', kind:'hissari_m', x:3, y:8, node:()=>'b2_west_ours', show:()=>!!S.f.b2_westDone, fresh:()=>!!S.f.b2_westDone && !S.f.b2_westOurs} ] } ],

  battles:{
    /* Dryj Spring, the Wickans gone: Tithansi raiders come for the water, and the squad is between them and it */
    b2_spring:{title:'Dryj Spring', style:'odhan', pitTxt:'the spring', warrenText:'Noon at the spring · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["..t..t..","........",".t....t.","...oo...","..oooo..","...oo...","........",".t....t.","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_lancer',1,0],['b2_lancer',6,0],['b2_tithbow',3,1],['b2_tithbow',4,0]], xp:100, after:'b2_after_spring',
      waves:[{round:2, foes:[['b2_lancer',7,4]], text:'Another comes round the pool on the far side, on foot, lance low, going for the water-carriers.'}],
      preText:()=>`Tangle's sharper goes off in the tamarisks where they were massing, and the tamarisks, which have stood by this spring since before there were tribes, go up in a shower of grey leaves. Somebody under them stops being in a hurry.`,
      stage2:{title:'The tamarisks', xp:40,
        text:()=>`The ones at the pool are down or running. The ones in the thicket are neither. A man on foot in a painted leather coat is shouting at them from the trees, in the tribes' tongue, and they are listening to him.
${b2In('haddat') ? `
"He says the water is theirs," Haddat says. "He says it was theirs before the Empire and it will be theirs after." She sets her shield. "He is right about the first part."` : ''}`,
        map:["#.t..t.#","..t..t..",".t....t.","........","..t..t..","........",".t....t.","........","........","##....##"],
        party:[[3,8],[4,8],[2,8],[5,8],[3,9],[4,9]],
        foes:[['b2_raidchief',3,1],['b2_lancer',2,2],['b2_lancer',5,2],['b2_tithbow',6,0]],
        waves:[{round:2, foes:[['b2_tithbow',0,4]], text:'A bowman who was lying flat in the scrub gets up and starts shooting again.'}]} },
    /* the Weasels' raid: a Tithansi water-camp at an old caravan well, two leagues out in the Odhan */
    b2_tithwell:{title:'The caravan well', style:'odhan', pitTxt:'the well', warrenText:'The Odhan at noon · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["#..##..#","..t..t..","........","...oo...","...oo...","........",".t....t.","........","........","##....##"],
      party:[[3,8],[4,8],[2,8],[5,8],[3,9],[4,9]],
      foes:[['b2_tithbow',1,1],['b2_tithbow',6,1],['b2_lancer',2,2],['b2_lancer',5,2]], xp:100, after:'b2_after_well',
      waves:[{round:2, foes:[['b2_lancer',1,2],['b2_lancer',6,2]], text:'The well-camp\'s horse-boys come out from the picket lines with spears. They are fourteen. They come anyway.'}],
      preText:()=>`Tangle's sharper lands among the water-skins stacked by the well-head, which was not where he meant it to go, and every skin bursts at once. For a breath it is raining in the Odhan. Everyone, on both sides, looks up.`,
      stage2:{title:'The well-house', xp:40,
        text:()=>`The yard is taken. The well-house is not: a squat mud-brick thing over the shaft, older than anyone's grandfather, with a door that has just been barred from inside, and somebody in there with the rope and the bucket and the only way down to the water.
${b2In('sathi') ? `
Sathi laughs, high and short. "They have locked themselves in with the well," she says. "Now they own the water and nothing else." Hackle is already at the door, nose to the crack.` : ''}`,
        map:["########","#..t...#","#......#","#.#..#.#","#......#","###..###","#......#","#.t..t.#","#......#","##....##"],
        party:[[3,8],[4,8],[2,8],[5,8],[3,9],[4,9]],
        foes:[['b2_wellkeeper',4,1],['b2_lancer',1,2],['b2_lancer',6,2],['b2_tithbow',2,4]]} },
    /* the march: Tithansi riders cut at the tail of the column in the dark. Hold until the Wickan rearguard comes back. */
    b2_tail:{title:'The tail of the column', style:'odhan_night', dark:true, warrenText:'Night on the Odhan · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["........","..t.....","......t.","........","...tt...","........",".t....t.","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_lancer',1,0],['b2_lancer',6,0],['b2_tithbow',3,0]], xp:60, after:'b2_after_tail',
      objective:{type:'survive', rounds:3, text:'Hold the tail for three rounds, until the Wickan rearguard comes back.'},
      waves:[{round:2, foes:[['b2_lancer',0,5],['b2_tithbow',7,2]], text:'More of them, out of the dark on the flank, where the carts are.'}, {round:3, foes:[['b2_lancer',7,6]], text:'One more, low on his horse\'s neck, going for the last cart.'}]},
    /* the west bank of the Sekala: the Semk come down on the column as it comes off the ford, and a Guran file probes beside them */
    b2_westbank:{title:'The Sekala · the west bank', style:'river', pitTxt:'the river', warrenText:'The ford at noon · the Semk god\'s sorcery in the air · Denul fouled, and it may give back mud', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["o.......","o..t....","o.......","o...t...","o.......","o.t...t.","o.......","oo......","oo......","oo......"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_semkwar',3,0],['b2_semkwar',6,1],['b2_semksorc',5,0],['b2_guran',1,1],['b2_guran',2,0]], xp:150, after:'b2_after_west',
      allies:[['b2_redally',6,7],['b2_redally',7,8]],
      waves:[{round:2, foes:[['b2_semkwar',7,3],['b2_semksorc',5,0]], text:'Two more Semk come down the bank at a run, painted to the eyes, screaming the god\'s name, and one of them has his hands up and the air bending round them.'}],
      preText:()=>`Tangle's sharper goes into the Guran file where it stands, and the Guran file, which has stood in rain and in sorcery and in the Emperor's day, discovers that it has never stood in a Moranth sharper. The front rank kneels without being told.`,
      stage2:{title:'The Semk\'s ground', style:'odhan', xp:80, keepAllies:true,
        text:()=>`The bank is held. Above it, on the stony rise, the Semk are still coming, and among them is something you do not have a word for: a sorcerer who is too tall, moving wrong, with the paint running off him like wet clay, and the air round him bending.

${b2In('marrow') ? `Marrow, beside you, very quietly: "That's not a warren, child. That's a god wearing a man. And it's wearing him out." As you watch, one of the painted men beside him lights up from the inside like a lantern, and falls, and does not get up.` : `As you watch, one of the painted men beside him lights up from the inside like a lantern, and falls, and does not get up. Their god is spending them.`}${b2In('redblade') ? '' : `

The Red Blades go up the rise beside you without waiting to be asked.`}`,
        map:["..t..t..","........",".t.##.t.","........","........","..t..t..","........","........","........","........"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['b2_semkhost',3,1],['b2_semksorc',1,0],['b2_semkwar',2,3],['b2_semkwar',5,3]],
        waves:[{round:2, foes:[['b2_semkwar',7,4]], text:'Another painted warrior comes over the rise. His paint is the same as the others\'. His eyes are not his own.'}]} } },

  foes:{
    /* Tithansi horse-archers, on foot in the scrub with their horse-bows */
    b2_tithbow:{name:'Tithansi bowman', sig:'b', kind:'tithansi_rider', hp:10, ac:12, atk:4, dmg:[1,6,1], rng:5, mv:5, init:3, sk:['pin'], verb:'looses a horse-bow at'},
    /* the raid-leader in the tamarisks at Dryj */
    b2_raidchief:{name:'Tithansi raid-leader', sig:'R', kind:'tithansi', hp:28, ac:14, atk:5, dmg:[1,10,2], rng:1, mv:5, init:3, boss:true, sk:['reach','rally'], verb:'brings a lance round on'},
    /* the man in the well-house with the rope and the bucket */
    b2_wellkeeper:{name:'The well\'s keeper', sig:'K', kind:'tithansi', hp:26, ac:13, atk:5, dmg:[1,8,3], rng:1, mv:4, init:2, boss:true, sk:['parry','shove'], verb:'swings a well-chain at'},
    /* Guran heavy infantry: a rebel city legion, armoured, drilled, unblooded */
    b2_guran:{name:'Guran legionary', sig:'G', kind:'guran', hp:16, ac:16, atk:4, dmg:[1,8,2], rng:1, mv:3, init:1, sk:['parry'], verb:'thrusts at'},
    /* the Semk: painted warriors of a tribe whose god rides them */
    b2_semkwar:{name:'Semk warrior', sig:'w', kind:'semk', hp:14, ac:12, atk:4, dmg:[1,8,1], rng:1, mv:4, init:2, sk:['bleed'], verb:'hacks at'},
    b2_semksorc:{name:'Semk sorcerer', sig:'s', kind:'semk', hp:11, ac:11, atk:4, dmg:[1,6,0], rng:3, mv:4, init:2, sk:['sbolt'], verb:'claws the air at'},
    b2_semkhost:{name:'The god\'s host', sig:'H', kind:'semk', hp:30, ac:13, atk:5, dmg:[1,10,2], rng:3, mv:4, init:3, boss:true, sk:['sbolt','daze'], verb:'reaches for'},
    /* allies: Red Blades on foot, their horses dead at the ford */
    b2_redally:{name:'Red Blade', sig:'r', kind:'redblade_trooper', hp:24, ac:15, atk:5, dmg:[1,8,2], rng:1, mv:4, init:2, verb:'cuts at'} },

  gear:{
    b2_tamarisk:{name:'Tamarisk switch', slot:'trinket', who:null, hp:1, line:'A green switch of tamarisk from Dryj Spring, cut where it grew over the water. It has gone grey and hard in the sun and smells, if you put your face to it, of the only cool place for fifty leagues.'},
    b2_wellrope:{name:'Well-rope knot', slot:'trinket', who:null, atk:1, line:'A hand\'s length of horsehair well-rope from the caravan well, knotted in the Tithansi way, which Sathi says is wrong and Haddat says is older than the Wickans.'},
    b2_paving:{name:'A ford stone', slot:'trinket', who:null, hp:2, line:'A flat paving stone from the Sekala ford, prised up by a sapper before the cussers went in. It is the size of a hand. It is the last of a road that is not there any more.'} },

  scenes:{
    b2_dryj_spring:{loc:'Dryj Spring', sub:'The Odhan', cap:'A muddy spring in a ring of tamarisks, and round it people and cattle as far as the heat lets you see.', amb:'plain'},
    b2_sekala:{loc:'The Sekala', sub:'The ford at dawn', cap:'A broad brown river, a ford under it, and on both banks, armies.', amb:'plain'},
    b2_spirits:{loc:'The west bank', sub:'Night', cap:'Far off on the plain, something huge and painted, and the earth coming up round it like hands.', amb:'night'} },

  end:{
    spring:['The spring held', 'At Dryj Spring the Wickans rode out into the Odhan and destroyed a Tithansi army seven times their number, and the squad stayed behind and held the water for the people who could not ride. At the Sekala Mincer\'s sappers paved a ford under the river and Cuttle blew it with the rebels on it. The Semk god is dead. The squad\'s stretch of the column is longer than it was. Its skins are lighter.'],
    water:['The water taken', 'At Dryj Spring the Wickans rode out into the Odhan and destroyed a Tithansi army seven times their number, and the squad rode with the Weasels and took a well and every skin in it. The spring paid for that. At the Sekala Mincer\'s sappers paved a ford under the river and Cuttle blew it with the rebels on it. The Semk god is dead. The squad has water. It has fewer people to give it to.'] },
  endScene:'b2_spirits',
  endCap:()=> S.f.b2_c2_key === 'spring' ? 'Night on the west bank of the Sekala. The squad\'s people are asleep in the lee of the wagons, more of them than at Bat\'rol, and the sergeant counts them twice.' : 'Night on the west bank of the Sekala. The skins are full and hung where the squad can see them, and the sergeant counts the people under them, and does not like the number.',
  tease:'Next: the Ridge. Nine days short of the P\'atha a Tithansi warleader with something old inside him, a tunnel the warlocks raise out of the earth, and beyond the river, Gelor Ridge.',

  extras:()=>{ const f = S.f, x = [];
    x.push(`The squad came over the Sekala with ${b2Chain()}.`);
    if (f.b2_c2_key === 'spring') x.push('At Dryj Spring the squad held the water while the Wickans rode. Nobody at the spring went thirsty that day, and the raiders who came for it did not go back.');
    if (f.b2_c2_key === 'water') x.push(`The squad rode with the Weasels to a Tithansi well and took it.${f.b2_springHit ? ' While it was gone, the spring was raided. The squad\'s stretch is shorter for it.' : ''}`);
    if (f.b2_ilharHeard) x.push('A green-cloth prisoner at Dryj said a man from the water-sellers\' quarter of Hissar rides with Reloe\'s Tithansi. Haddat did not ask his name. She did not need to.');
    if (f.b2_prisonerFate === 'free') x.push('The prisoner walked away into the Odhan with a skin of the squad\'s water. Haddat watched him all the way to the skyline.');
    if (f.b2_prisonerFate === 'wickans') x.push('The prisoner went to the Wickans. Nobody asked what they did with him.');
    if (f.b2_prisonerFate === 'column') x.push('The prisoner walks in the squad\'s stretch of the column, with his hands untied and a green cloth in his pocket, which is the strangest thing on the Odhan.');
    if (f.b2_oxBled) x.push('A carter\'s ox was bled at night on the march, and its blood went round the squad\'s people in a cup. Nobody has talked about it since.');
    if (f.b2_fever === 'held') x.push('Marrow sat up all night with a fevered girl on the march, and in the morning tied a knot.');
    if (f.b2_fever === 'lost') x.push('Marrow sat up all night with a fevered girl on the march. In the morning she did not tie a knot.');
    if (f.b2_cusser) x.push('One of the fifty-five cussers under the Sekala ford came out of Tangle\'s satchel. He has said the new count out loud at every halt since, and the old one once, quietly.');
    if (f.b2_fordLight === 'dumped') x.push('The squad poured three barrels into the Sekala to lighten the carts on the ford. Every soul in its stretch came over.');
    if (f.b2_fordLight === 'kept') x.push('The squad kept its water on the ford. The carts were slow, and the river took some of the people walking beside them.');
    if (f.b2_duikerBack) x.push('The Imperial Historian came back across the lines at the Sekala in a rebel\'s clothes, three months after anyone had seen him.');
    if (b2In('redblade')) x.push('Ramin, a Red Blade of Ehrlitan, walks with the squad. He is lent, he says, until the company remounts. He says it every day.');
    if (f.b2_raminDone === 0) x.push('A Red Blade offered his sword to the squad on the west bank, and the squad said no. He went back to what was left of his company.');
    if (f.b2_spirits) x.push('From the west bank the squad saw the land\'s spirits come up out of the dark and take the Semk god apart. Sathi did not laugh. That is how you know.');
    if (f.b2_ubaryd) x.push('Ubaryd has fallen. There is nowhere for the column to go now but Aren.');
    return x; },

  journal:()=>{ const f = S.f; return [
    f.b2_blown && `The Sekala. Mincer's sappers paved the ford under the water and packed it with fifty-five cussers, and the sapper Cuttle blew it with Reloe's peasant army on it. The Sialk Marines and the Red Blades each lost half their people on the banks.`,
    f.b2_spirits && `After the Sekala, Sormo E'nath and the young warlocks Nil and Nether gave the Semk god to the spirits of the land, and the spirits tore it apart.`,
    f.b2_ubaryd && `Ubaryd has fallen to the rebellion. The column will have to go all the way to Aren.`,
    b2In('redblade') && `Ramin of the Red Blades walks with the squad, lent until his company remounts. The rebels call his people Malazan lapdogs. The Malazans don't call them anything.`,
    f.b2_duikerBack && `Duiker came back to the column at the Sekala, across the rebel lines, in a rebel's clothes.`,
    f.b2_ilharHeard && `A prisoner at Dryj Spring said a man from the water-sellers' quarter of Hissar rides with Reloe's Tithansi.`,
    f.b2_c2_key === 'spring' && `At Dryj Spring the squad held the water for the refugees while Coltaine's Wickans rode out and destroyed a Tithansi army seven times their number.`,
    f.b2_c2_key === 'water' && `At Dryj Spring the squad rode with a Weasel party and took a Tithansi well, while Coltaine's Wickans destroyed a Tithansi army seven times their number.`,
    `After Bat'rol the Seventh marched south and west across the Odhan toward the Sekala, with the refugees, at the pace of the slowest cart.`].filter(Boolean); },

  dlg:{}
};

/* ---------------- the march to Dryj, and Dryj Spring ---------------- */
Object.assign(B2CH2.dlg, {
  b2_c2_start:()=>({sp:'The Odhan', scene:'b2_odhan_day', fx:()=>{ if (!S.f.b2_c2Start) { S.f.b2_c2Start = 1; chain(-2, -1, 'Three weeks on the Odhan'); } }, txt:
`Three weeks.

The column learns to walk the way the Odhan wants it to: before dawn and after dusk, and in the middle of the day under anything that throws a shadow, a cart, a cloak on two spears, a cow. The squad's stretch learns it with everyone else. Bult rides past once a day, laughing at something, and shouts *count them*, and you do.

One less. An old man from the dyers' street, who sat down at noon in the shade of a wagon and was still sitting there when the wagon moved. ${b2In('haddat') ? `Haddat knew his name. She said it over him in Hissari, and then in Malazan, so the squad would have it too.` : `Somebody knew his name. You have it written down.`}

${b2In('tangle') ? `Tangle counts the satchel at every halt. "${b2Count()}," he says. Nobody asks him to. ` : ''}${b2In('marrow') ? `Marrow has ${b2Knots()}.` : ''}`,
    html:chainHTML('The Odhan · three weeks out of the basin'),
    ch:[b2DeckChoice(2),
        {t:'"Bult says Dryj. How far?"', go:'b2_c2_start2'},
        {t:'"Water. Slowly. The way I showed you."', go:'b2_c2_start2'}]}),
  /* the reading at the noon halt (47c) */
  b2_c2_deck:()=>b2DeckOffer(2, 'b2_c2_card'),
  b2_c2_card:()=>b2DeckCard(2),
  b2_c2_start2:()=>({sp:'The Odhan', scene:'b2_odhan_day', txt:
`${b2In('sathi') ? `"Two days," Sathi says. "Hackle says one. Hackle is a liar about water. He always thinks it is closer." The dog, trotting beside her horse with his tongue out, does not dispute it.

` : ''}Duiker has not been seen since Bat'rol. He rode back across the basin after the battle with the dead-counters, notebook out, the way he does, and did not come back with them. The Weasels say the green army has him, or the Odhan does. Bult says the historian is too stubborn for either and will turn up when he has finished his chapter. Bult laughs when he says it. You have learned what that means.

Two days later the column comes down off a long dun slope into a hollow full of grey-green trees, and there is a smell in the air that nobody in the squad has smelled in three weeks. Wet earth.`,
    ch:[{t:'Dryj Spring.', go:()=>{ startExplore('b2_dryj'); talk('b2_dryj_arrive'); }}]}),
  b2_dryj_arrive:()=>({sp:'Dryj Spring', scene:'b2_dryj_spring', fx:()=>{ if (!S.f.b2_dryjIn) { S.f.b2_dryjIn = 1; chain(2, 0, 'Dryj Spring'); } }, txt:
`The spring is a pool the size of a Hissar courtyard in a ring of tamarisks, fed from somewhere underneath, and forty thousand people and their cattle have come down on it at once.

It is mud by the time the squad's stretch gets close. Then it is a queue. Then it is water, brown and warm and tasting of cow, and everyone drinks it as if it were wine from the Emperor's own cellar. The skins go down in it and come up fat.

${S.f.b2_dipper ? `You drink from Ressan's dipper. It is the first time you have used it. The brass is warm from your shirt, and the water in it is brown, and Ressan would have charged you for it and you would have paid.` : `You drink last, slowly, the way you always do.`}

Out past the tamarisks, the Wickans are not drinking. They are watering the horses in turn and saddling them again. On the skyline to the west, the Tithansi have stopped waiting. There are a great many of them.`,
    ch:[{t:'Find Bult.', go:()=>startExplore()}]}),

  /* ---- Bult: the spring or the ride ---- */
  b2_bult2:()=>({sp:'Bult · Coltaine\'s uncle', fx:()=>{ S.f.b2_bult2 = 1; }, txt:
`Bult is standing on a wagon-tongue so he can see over the tamarisks, eating something out of his fist.

"Sergeant. You've counted them." It isn't a question. "Good. Now listen, because the Fist is going to say this in one word and I'm going to say it in a great many.

"The Tithansi have come down off the hills. Seven of them for every one of us, the outriders say, and the outriders round down to be polite. They think we'll sit in this hole with our cattle and drink until they come and take the water off us. So the Fist is going to go out and kill them." He finishes whatever he was eating. "All the Wickans. Out there, a league and more, where they've put themselves to be clever. The column stays here. The column drinks."

He looks down at you. "So who holds the spring? Some regulars. Some auxiliaries. Some squads." He nods west. "And the Weasels are taking a party the other way, round the back of the Tithansi, to a caravan well the tribes have been sitting on. Every skin at that well is a skin the column doesn't have to dip out of this mud. They want bows and somebody who knows which end of a sharper to throw. The Weasel captain asked for ${b2In('sathi') ? `that girl of yours by name, and her dog` : `a Malazan squad, for the munitions`}."

He grins the scarred grin. "I'm not ordering you. I'm telling you what's here. You pick."`,
    ch:[{t:'"Seven to one, sir?"', req:()=>!S.f.b2_bultOdds, fx:()=>{ S.f.b2_bultOdds = 1; }, go:'b2_bult2_odds'},
        {t:'"We hold the spring."', fx:()=>{ S.f.b2_c2_key = 'spring'; if (b2In('marrow')) loy('marrow', 1); if (b2In('haddat')) loy('haddat', 1); if (b2In('sathi')) loy('sathi', -1); }, go:'b2_key_spring'},
        {t:'"We ride with the Weasels."', fx:()=>{ S.f.b2_c2_key = 'water'; if (b2In('sathi')) loy('sathi', 1); if (b2In('tangle')) loy('tangle', 1); if (b2In('marrow')) loy('marrow', -1); }, go:'b2_key_water'},
        {t:'"Give me a moment, sir."', go:()=>startExplore()}]}),
  b2_bult2_odds:()=>({sp:'Bult', txt:
`"Seven to one." He seems pleased you asked. "They're Tithansi. They ride well and they fight brave and they have never once in their lives been hunted by Wickans. The Fist used to raid the Empire's own frontier with three hundred, and the Empire sent an army after him, and he's the one who's still here." He shrugs. "Seven to one is a good number. Seven to one means they won't be watching for us. Ask me again tonight. I'll say the same thing, with more blood on me."`,
    ch:[{t:'"We hold the spring."', fx:()=>{ S.f.b2_c2_key = 'spring'; if (b2In('marrow')) loy('marrow', 1); if (b2In('haddat')) loy('haddat', 1); if (b2In('sathi')) loy('sathi', -1); }, go:'b2_key_spring'},
        {t:'"We ride with the Weasels."', fx:()=>{ S.f.b2_c2_key = 'water'; if (b2In('sathi')) loy('sathi', 1); if (b2In('tangle')) loy('tangle', 1); if (b2In('marrow')) loy('marrow', -1); }, go:'b2_key_water'},
        {t:'"A moment, sir."', go:()=>startExplore()}]}),
  b2_bult2_again:()=>({sp:'Bult', txt: S.f.b2_dryjFight ?
`Bult has blood to the elbow, none of it his, and is in a better mood than you have ever seen him. "Seven to one," he says. "Ask me now." He doesn't wait for you to. "The Tithansi will be telling this one round their fires for a hundred years. The ones that have fires left."` :
`"Go on, then." He waves you off with the hand he isn't eating with. "${S.f.b2_c2_key === 'water' ? 'The Weasels won\'t wait. They don\'t know how.' : 'Hold it. All of it. Every cow.'}"`,
    ch:[{t:'Go.', go:()=>startExplore()}]}),

  /* the spring: the squad stays */
  b2_key_spring:()=>({sp:'Dryj Spring', scene:'b2_dryj_spring', fx:()=>{ chain(0, 3, 'Stragglers from the cut-up stretches'); }, txt:
`Bult nods as if he'd known. "Good. The spring, then. When they come, and some of them will come, they'll come for the water and the carts at the water. Don't let them have either."

The Wickans go at mid-afternoon. All of them at once, without a horn, the way a flock goes up: Crow and Foolish Dog and the Weasels, out past the tamarisks and over the dun slope and gone, and the dust of them hangs in the air a long time after. ${b2In('sathi') ? `Sathi watches them go with both hands knotted in Hackle's ruff. She does not say anything. She does not have to. Her clan is in that dust, and she is here, and she has decided not to forgive you for it until later.` : ''}

The squad puts its people in the middle of the spring's south side, the carts round them, and three families who lost their own stretch at Bat'rol come and ask to be counted, and are.

Then there is nothing to do but wait in the heat, with the water at your back.`,
    ch:[{t:'Wait.', go:'b2_spring_wait'}]}),
  b2_spring_wait:()=>({sp:'Dryj Spring · the long afternoon', scene:'b2_dryj_spring', txt:
`The afternoon goes on forever, and then, all at once, it doesn't.

Out to the north and west there is noise a long way off, carried on the wind, a sound like surf. Nobody at the spring can see it. Everybody at the spring stops to listen to it.

And from the south, where nobody was listening, out of a dry gully below the tamarisks: Tithansi. Not the army. A raiding party that went round, forty or fifty of them on foot, with horse-bows and lances and water-skins, empty, slung on their backs. They have come for the spring the way you would come for a well in a burning city.

${b2In('haddat') ? `"They want water," Haddat says. "That is all. They are thirsty." She sets her shield. "So are we."` : `They want water. So does everyone.`}${b2In('tangle') ? ` Tangle stops humming.` : ''}`,
    ch:[{t:'"Hold the water."', go:()=>startBattle('b2_spring', {})},
        {t:'Tangle\'s sharper into the tamarisks where they\'re bunching.', tag:'uses 1 sharper', req:()=>b2In('tangle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('b2_spring', {pre:true})},
        {t:'Sathi and Hackle go round by the gully to take them from behind.', check:['guile',14], req:()=>b2In('sathi'),
          edges:id=>[id === 'sathi' && ['Hackle goes first', 2], id === 'haddat' && ['she can hear their dialect', 1]],
          go:'b2_spring_round', fail:'b2_spring_seen'}]}),
  b2_spring_round:()=>({sp:'Dryj Spring', txt:
`${by({sathi:`Sathi slides off down the gully on her belly with the dog beside her, and the two of them are gone into the scrub so completely that you stop being able to say where. A minute later the Tithansi bowman at the back of the party sits down with an arrow in him, and the one beside him turns round into a Wickan cattle-dog.`,
  _:`{who} goes down the gully with Sathi and the dog. A minute later the Tithansi at the back of the party are turning round to find out where the arrows are coming from.`})}

The rest of them come on anyway, faster now, and messier, which is what you wanted.`,
    ch:[{t:'Into them.', go:()=>startBattle('b2_spring', {surprise:'p'})}]}),
  b2_spring_seen:()=>({sp:'Dryj Spring', txt:
`A stone goes. One stone, down the side of the gully, rattling, and forty Tithansi faces turn toward it at once. Somebody shouts. ${b2In('sathi') ? `Sathi says a word in Wickan that makes the Hissari in the squad's stretch wince, and comes back up the gully at a run with the dog.` : ''}

They know you're there now. They come anyway.`,
    ch:[{t:'Hold.', go:()=>startBattle('b2_spring', {surprise:'e'})}]}),
  b2_after_spring:()=>({sp:'Dryj Spring', scene:'b2_dryj_spring', fx:()=>{ S.f.b2_dryjFight = 1; S.f.b2_springHeld = 1; chain(0, 2, 'Two more families come in from the north side'); gain('b2_tamarisk'); }, txt:
`The raid-leader goes down in the tamarisks with his painted coat over his face, and the ones behind him look at him lying there, and look at the spring, and decide the water belongs to someone else after all. They go back down the gully faster than they came up it, empty skins flapping.

They leave one behind. He is sitting against a tamarisk with a cut arm and no weapon and a strip of green cloth round the other arm, and he is very young, and he is looking at the water.

The noise in the north goes on until dusk, and then it stops, and some time after dark the Wickans come back. Not all of them. Most of them. They come in singing, slow, with their horses walking, and the Weasels are laughing, and there is a great deal of blood on all of it.

${b2In('sathi') ? `Sathi goes out to meet them before anyone can stop her. When she comes back she is quiet. "Seven to one," she says. "They killed them all. All of them, Sergeant. In a valley. The Tithansi rode into it and the clans closed it." She looks at the spring, and at the squad's people asleep round it, and some of the not-forgiving goes out of her. "The Weasel captain says somebody had to hold the water. He says it like an insult. It isn't one."` : `A Weasel rider tells you what happened, as much of it as you can follow. A valley. The Tithansi rode into it. The clans closed it. *All of them,* he says, more than once.`}`,
    ch:[{t:'The prisoner.', go:()=>startExplore()}]}),

  /* the water: the squad rides with the Weasels */
  b2_key_water:()=>({sp:'Dryj Spring', scene:'b2_dryj_spring', txt:
`Bult nods as if he'd known. "Good. The Weasels won't wait for you, so don't make them."

They don't. The Weasel party is thirty riders and a string of spare horses, and the spare horses are for you. Malazans on Wickan horses: the horses find this funny, and so do the Weasels, all the way out past the tamarisks. ${b2In('sathi') ? `Sathi rides at the head of the squad, upright and grinning, and talks to the Weasel captain in fast Wickan as if she had never been away. Hackle runs at her stirrup.` : ''}${b2In('marrow') ? ` Marrow rides as if the horse were a chair somebody had insulted her with.` : ''}

Behind you the spring gets smaller, and the people at it, and the carts, and the stretch of the column that is yours, with nobody of yours left to watch it.`,
    ch:[{t:'Ride.', go:'b2_ride'}]}),
  b2_ride:()=>({sp:'The Odhan · riding west', scene:'b2_odhan_day', txt:
`The Weasels ride wide, west and then north, along a dry streambed that hides them to the shoulders. Nobody talks. The horses know to be quiet.

At a place where the streambed turns, the captain lifts a hand and everybody stops, and he points up the bank. ${b2In('sathi') ? `Sathi slides off her horse and goes up the bank on her belly, and after a moment beckons you after her.` : `You go up the bank on your belly to look.`}

Below, a league off, in a long shallow valley, the Tithansi army is drawn up in the sun. Thousands. More horses than you have seen in your life, and men round them, and banners, and the dust of them going up. They are facing south, toward the spring, toward where they think the Wickans are.

The Wickans are not there.`,
    ch:[{t:'Watch.', go:'b2_rise'}]}),
  b2_rise:()=>({sp:'Above the valley', scene:'b2_odhan_day', fx:()=>{ S.f.b2_sawValley = 1; }, txt:
`You see it happen from a league away, the way you would see weather.

The Crow Clan comes over the western lip of the valley first, not fast, as if they had all the time in the world, and the Tithansi turn toward them. Then the Foolish Dog come over the eastern lip, heavier, at a canter, lances up. Then the Tithansi are turning both ways at once, and the valley has a north end and a south end and both of them are closing.

You don't see the rest. Dust goes up over it so thick that it is like looking into a storm, and the noise comes to you a long time after, the way thunder does, a sound like surf on a coast you have never been to.

${b2In('sathi') ? `Sathi, flat on the bank beside you, is laughing under her breath, not happily. "Seven to one," she says. "Seven to one, and they will all be dead by dark. Nobody will ever believe it." She looks at you sideways. "Write it down. The old historian is not here. Somebody should."` : `Nobody on the bank says anything. The Weasel captain watches with his chin on his fist, and then touches your shoulder, and points west, away from it.`}

This was never yours. Yours is two leagues on.`,
    ch:[{t:'The well.', go:'b2_well_go'}]}),
  b2_well_go:()=>({sp:'The caravan well', scene:'b2_odhan_day', txt:
`The well is an old caravan stop on a road nobody uses: a well-house of mud brick, a yard, a broken wall, picket lines, and water-skins stacked by the well-head higher than a man, every one of them full. The Tithansi left a camp here to keep it. Not many. The rest are in the valley, dying.

The Weasel captain looks at the camp, and at you, and says one word.

${b2In('sathi') ? `"He says: you have the fire-pots. You go in the front. We go in the sides." Sathi grins. "He says it is an honour. It is also because he does not want to be the one in front."` : `He points at you, and at the front of the camp, and at his riders, and at the sides. It is not complicated.`}`,
    ch:[{t:'In the front.', go:()=>startBattle('b2_tithwell', {})},
        {t:'Tangle\'s sharper into the yard first.', tag:'uses 1 sharper', req:()=>b2In('tangle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('b2_tithwell', {pre:true, surprise:'p'})}]}),
  b2_after_well:()=>({sp:'The caravan well', scene:'b2_odhan_day', fx:()=>{ S.f.b2_dryjFight = 1; S.f.b2_wellTaken = 1; chain(5, 0, 'The caravan well'); gain('b2_wellrope'); }, txt:
`The well-house door comes open and the man with the chain comes out of it the hard way, and that is the end of the caravan well's garrison.

The Weasels load the spare horses with skins until the horses complain, and then load them some more. More water than the squad has seen since Hissar. Enough, ${b2In('marrow') ? 'Marrow says' : 'by Bult\'s arithmetic'}, to keep your stretch alive to the next river, if the next river is where Bult says it is.

They leave you one live Tithansi, a boy with a cut arm and a green cloth round the other, sitting against the well-house wall looking at the water. The Weasel captain looks at him and then at you, and shrugs. Yours.${b2In('sathi') ? `

The Weasel captain says something to Sathi on the way back, short, and rides off before she can answer. She doesn't tell you what it was for a long time. Then, at the edge of the tamarisks: "He says I ride like a Weasel still. He says the dog was never in doubt." She is trying not to smile and failing.` : ''}`,
    ch:[{t:'Back to the spring.', go:'b2_back_spring'}]}),
  b2_back_spring:()=>({sp:'Dryj Spring · dusk', scene:'b2_dryj_spring', fx:()=>{ if (!S.f.b2_springHit) { S.f.b2_springHit = 1; chain(0, -4, 'The spring, while the squad was gone'); } }, txt:
`You come back to the spring at dusk with the skins, and the spring is wrong.

Tithansi came while the Wickans were in the valley. Not the army: a raiding party that went round, for the water. The regulars at the spring drove them off. They did not drive them off from everywhere at once, and the south side, where nobody of yours was watching, is where they came in.

${b2Ours() === 'the squad\'s people' ? `Your stretch of the column is shorter.` : `${b2Ours()} are alive. ${S.f.b2_key === 'daughters' ? `${B2.elder} has a cut over her eye and a tent-pole she has not put down.` : `${B2.widow} hit a raider with the rope and is telling everyone.`} Others are not.`} Four of the people Bult gave you are not where they were. Some of them are under blankets by the tamarisks. Some of them nobody can find.

${b2In('haddat') ? `Haddat goes and finds out the names. She says them to you in Hissari, all of them, quietly, and then in Malazan, and then she goes and stands by the water with her back to everyone for a while.` : `You find out the names. Bult said to.`}${b2In('marrow') ? `

Marrow looks at the skins, and then at the blankets, and sits down on the ground between them, because it is there. "Water," she says. "A great deal of water, child. That's not nothing." She says it the way you'd hold a bandage on a wound you know is too big for it.` : ''}`,
    html:chainHTML('Dryj Spring · dusk'),
    ch:[{t:'The prisoner.', go:()=>startExplore()}]}),

  /* ---- the prisoner, and Ilhar ---- */
  b2_prisoner:()=>({sp:'A prisoner · green cloth', txt:
`He is perhaps seventeen, with a cut arm somebody has bound in a strip of his own shirt, and a green cloth tied round the other arm, and Tithansi braids that are not quite right, as if he had learned to tie them from somebody else.

He is not Tithansi. ${b2In('haddat') ? `Haddat knows it the moment he opens his mouth to ask for water, and so do you: the swallowed endings, the way the quarter says *thirst*.

Haddat crouches so her face is level with his. She asks him something in Hissari, quietly. He answers. She asks something else.` : `When he opens his mouth to ask for water it is in city Hissari, the gutter kind, the kind you learned in six years of Hissar streets.`}`,
    ch:[{t:'Give him water first.', fx:()=>{ S.f.b2_prisonerWater = 1; }, go:'b2_prisoner_ilhar'},
        {t:'"Ask him who sent the raid."', go:'b2_prisoner_ilhar'}]}),
  b2_prisoner_ilhar:()=>({sp:'A prisoner', fx:()=>{ S.f.b2_ilharHeard = 1; }, txt:
`${S.f.b2_prisonerWater ? `He drinks the way people drink on the Odhan now, too fast, and chokes, and drinks again. When he's done he looks at you differently. Not kindly. Differently.

` : ''}He's from Hissar. The tanners' street, by the river. He went out with the green cloths the night the city rose because everyone in his street did. Reloe's people sent the city boys to the Tithansi, to ride with them, because the tribes needed men who knew the Malazans' ways and the Malazans' language, and the city boys needed horses.

"There are others," he says. "City men. From all over. The weavers. The water-sellers' quarter." He looks at ${b2In('haddat') ? 'Haddat' : 'you'}. "There is one from the water-sellers' quarter who the Tithansi listen to. He talks to the chiefs for Reloe. He has a sister in the Malazan army, everybody knows it, he says it himself. He says she took the Empire's silver." The boy shrugs with his good shoulder. "He says it like a joke. Nobody laughs."

${b2In('haddat') ? `Haddat does not move. She does not ask the man's name. You watch her not ask it.

When she stands up her face is the face she wears to count the dead in the column. "Thank you," she says to the boy, in the quarter's Hissari. Then, to you, in Malazan, as if reporting it: "A man of the water-sellers' quarter rides with Reloe's Tithansi. That is all he knows, Sergeant."` : `You don't ask the man's name. Somewhere in the Hissar garrison's rolls there is an auxiliary with a brother, and you think you know which one.`}`,
    ch:[{t:'"Let him go. Give him a skin."', fx:()=>{ S.f.b2_prisonerFate = 'free'; S.f.b2_prisonerDone = 1; chain(-1, 0, 'A skin for the prisoner'); if (b2In('haddat')) loy('haddat', 1); if (b2In('tangle')) loy('tangle', -1); }, go:'b2_prisoner_free'},
        {t:'"He walks with the column. Untie him."', fx:()=>{ S.f.b2_prisonerFate = 'column'; S.f.b2_prisonerDone = 1; chain(0, 1, 'A boy from the tanners\' street'); if (b2In('marrow')) loy('marrow', 1); }, go:'b2_prisoner_column'},
        {t:'"Give him to the Wickans."', fx:()=>{ S.f.b2_prisonerFate = 'wickans'; S.f.b2_prisonerDone = 1; if (b2In('haddat')) loy('haddat', -1); if (b2In('sathi')) loy('sathi', 1); }, go:'b2_prisoner_wickans'}]}),
  b2_prisoner_free:()=>({sp:'A prisoner', txt:
`He doesn't believe it until the skin is in his hands. Then he goes, walking, not running, out past the tamarisks and up the dun slope, with the skin over his shoulder and the green cloth still on his arm.

${b2In('haddat') ? `Haddat watches him all the way to the skyline. Just before he goes over it he stops and looks back, and lifts one hand, and she does not lift hers. "He will tell them," she says. "That the Malazans let him go with water. He will tell my brother." A long breath. "Good."` : `He will tell them the Malazans let him go with water. You find you don't mind.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_prisoner_column:()=>({sp:'A prisoner', txt:
`${b2In('haddat') ? `Haddat cuts the cord on his wrists herself.` : `Somebody cuts the cord on his wrists.`} He looks at his hands as if they belonged to someone else. Then he takes the green cloth off his arm, slowly, and looks at it, and puts it in his pocket instead of throwing it away, and nobody in the squad says anything about that.

${S.f.b2_yedda ? `${B2.widow} looks him up and down. "Tanners' street," she says. "Your mother sold hides to my husband. She cheated him." She hands him one handle of the cart. "Push."` : `Somebody in the squad's stretch hands him a cart-handle. He takes it.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_prisoner_wickans:()=>({sp:'A prisoner', txt:
`Two Crow riders come for him. They are not rough about it. They are not anything about it.

${b2In('haddat') ? `Haddat watches him go between them, and does not say anything at all. Later, by the water, you hear her say his street's name over and over, under her breath, as if she were trying to remember it for someone.` : `He looks back once, at the water.`}${b2In('sathi') ? `

"It is what the clans do," Sathi says. "He came for the spring with a lance." She does not laugh. You notice that she doesn't.` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_prisoner_again:()=>({sp:'The boy from the tanners\' street', txt:
`He's pushing ${S.f.b2_yedda ? `${B2.widow}'s cart, and being told he's doing it wrong` : `a cart in the squad's stretch`}. He doesn't look at you. He doesn't look away, either.`,
    ch:[{t:'Leave him.', go:()=>startExplore()}]}),

  /* ---- Coltaine, mounting ---- */
  b2_coltaine2:()=>({sp:'Coltaine · Fist of the Seventh', fx:()=>{ S.f.b2_coltaine2 = 1; }, txt:
`The Fist is standing by his horse while a Crow rider checks its girth, with his cloak of black feathers over one shoulder and his face turned to the west, to the skyline where the Tithansi are.

He sees you. He looks at the squad, all of it, the way he looked at the map in his tent at Hissar, and moves nothing.

Then he gets on the horse.

${S.f.b2_sathiCrows && b2In('sathi') ? `Over his head, as he rides out, there are crows. Not many: three, four, going the same way he is, low, without a sound. Sathi watches them until they are out of sight. "You see," she says. You do.` : `As he rides out, three or four crows go up out of the tamarisks and go the same way he does, low, without a sound.`}`,
    ch:[{t:'Salute.', go:()=>startExplore()}]}),
  /* ---- a Weasel rider ---- */
  b2_weasel2:()=>({sp:'A Weasel rider', fx:()=>{ S.f.b2_weasel2 = 1; }, txt: S.f.b2_dryjFight ?
`The Weasel rider is cleaning a lance in the spring, which nobody downstream of him is going to like. He lifts his chin at you. ${b2In('sathi') ? `He says something to Sathi, and she answers, and he laughs. "He says the valley was full," she says. "He says next time the Malazans should come, because there will not be enough Tithansi to go round and he wants to watch you be disappointed."` : `"Valley," he says in Malazan, and makes a closing gesture with both hands, and grins.`}` :
`A Weasel rider is watering his horse at the edge of the pool, a lance across his knees, a string of teeth at his throat, the Weasels' way. ${b2In('sathi') ? `He sees Sathi and says something, and she says something back, sharp, and Hackle wags. "He asks if I am still a Wickan," she says. "I told him to ask the dog."` : `He looks at you and says something in Wickan, and then, slowly, in Malazan: "You. Come. Or stay. Both good." He shrugs. "One more good."`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  /* ---- the noble's steward at the pool ---- */
  b2_steward:()=>({sp:'A noble\'s steward', fx:()=>{ S.f.b2_steward = 1; }, txt:
`At the deepest part of the pool, where the water comes up clean, somebody has put a line of men with staves, and behind the staves a string of mules, and on the mules, being filled one after another, enough barrels for a regiment.

A man in a good coat gone grey with dust is supervising. He is sweating through the coat and has a ledger.

"For the Council," he says before you can ask. "Lord Nethpara's household, and the Council's others. The Fist's own order: the Council's people draw first. There are a great many of the Council's people." He doesn't look up from the ledger. "Your peasants may use the shallows."

Behind you, in the shallows, your people are drinking mud.`,
    ch:[{t:'"Show me the Fist\'s order."', check:['wits',13], edges:id=>[id === 'haddat' && ['she has read a great many orders she was not supposed to', 1], id === 'sgt' && ['six years of garrison paperwork', 1]],
          clean:{t:'There is no order. There never was. He knows you know.', fx:()=>{ chain(1, 0, 'The deep water'); }},
          go:'b2_steward_won', fail:'b2_steward_lost'},
        {t:'"Haddat. Tell his staves who owns this spring."', req:()=>b2In('haddat'), go:'b2_steward_haddat'},
        {t:'Leave it. The shallows will do.', go:'b2_steward_lost'}]}),
  b2_steward_won:()=>({sp:'A noble\'s steward', fx:()=>{ S.f.b2_stewardWon = 1; }, txt:
`He looks at you for a long moment, and then at the ledger, and then he closes the ledger.

"The Council will hear of this," he says. It is what men like him say when they have lost. He waves a hand, and the staves step back, and the squad's people come up into the deep water with their skins and their jars, and the mules wait.

${b2In('haddat') ? `Haddat, behind you, in Hissari, not quite to herself: "He will remember your face." Then, in Malazan: "Good."` : `He writes something down as you go. Your name, probably. He spells it carefully.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_steward_haddat:()=>({sp:'Haddat', fx:()=>{ S.f.b2_stewardWon = 1; chain(1, 0, 'The deep water'); loy('haddat', 1); }, txt:
`Haddat doesn't raise her voice. She never does. She walks past the steward to the line of men with staves, who are Hissari, hired in Hissar, and says something to them in the quarter's own dialect, three or four sentences, quietly.

The men with the staves look at each other. Then the one in the middle steps aside, and then the rest do, and the squad's people come up into the deep water.

The steward is saying something about the Council. Nobody is listening.

"What did you say to them?" you ask her afterward.

"Whose water it is." She shrugs her shield higher. "In Hissar, a man who stands between a family and a well is a kind of thing there is a word for. I told them the word."`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_steward_lost:()=>({sp:'Dryj Spring', txt:
`The mules go on being filled. The squad's people go on drinking in the shallows, where the cattle have been.

${b2In('marrow') ? `"Boil it," Marrow says, to everyone, loudly, so the steward will hear. "If you can find anything to burn. If you can't, drink it anyway. Mud never killed anyone who was going to die of thirst."` : `It's water. It's wet. It will do.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_steward_again:()=>({sp:'A noble\'s steward', txt:`He is writing in the ledger. He doesn't look up. ${S.f.b2_stewardWon ? 'He writes harder when you go past.' : 'The mules are nearly full.'}`, ch:[{t:'Leave him.', go:()=>startExplore()}]}),

  /* ---- the squad's own people at the spring ---- */
  b2_ours_dryj:()=>({sp:S.f.b2_key === 'daughters' ? B2.elder : B2.widow, fx:()=>{ S.f.b2_oursDryj = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.elder} is filling the jar. ${B2.younger}'s jar, the one she carried out of Hissar in both arms; ${B2.younger} is asleep in the shade of a cart with her arms round nothing, and ${B2.elder} is filling it for her so it will be full when she wakes.

"Father would say this water is a disgrace," she says, without looking round. "He'd say he wouldn't sell it to a camel." She corks the jar. "He'd sell it to a camel."

She sits back on her heels. "Three weeks, Sergeant. ${B2.younger} asked me yesterday whether he's thirsty. I told her a water-seller is never thirsty. She believed me." She looks at you. "Don't tell her different. That's all I want from you today."` :
`${B2.widow} has her cart parked at the edge of the tamarisks with the coil of rope on it, and her grandsons asleep under it, and she is sitting on the rope.

"Soldier." She nods at the water. "In Hissar a ropemaker's widow would not wash her feet in that." She has. They are clean. "My husband walked to Ehrlitan once, with the rope trade, when he was young. Forty days. He said the Odhan was the only place in the world that wanted you dead and was polite about it." She sniffs. "He was a fool. He was right."${S.f.b2_key === 'carts' ? `

You ask her, because you ask everyone. Two girls from the water-sellers' quarter, the old man Ressan's daughters. The elder is nineteen. The little one carries a jar.

She looks at you for a long time. "I have asked too, soldier," she says. "For my sister's boy. Forty thousand people. Everybody has asked." Not unkind. "Keep asking. One day somebody will say yes."` : ''}`,
    ch:[{t:'Leave her be.', go:()=>startExplore()}]}),

  /* ---- the pool and the wagons ---- */
  b2_pool:()=>({sp:'Dryj Spring · the pool', txt:
`The pool in its ring of tamarisks, brown and warm and churned by forty thousand people and their cattle. ${S.f.b2_dryjFight ? 'The water has gone down a hand\'s width since noon. It is still water.' : 'Out in the middle, where it comes up from somewhere underneath, it is almost clear.'}${S.f.b2_dipper ? ` You fill Ressan's dipper and drink, slowly.` : ''}`,
    ch:[{t:'Leave it.', go:()=>startExplore()}]}),
  b2_dryj_wagons:()=>({sp:'The squad\'s wagons', txt: S.f.b2_prisonerDone ?
`The column is moving out of Dryj. The head of it is already over the dun slope to the south-west, the Wickans riding wide on both flanks, and the tail of it is still drinking. Bult's word is the Sekala: a river, a big one, and beyond it whatever is beyond it.

Your stretch is ready. ${chainC()} of them. ${S.f.b2_prisonerFate === 'column' ? 'One of them with a green cloth in his pocket.' : ''}` : !S.f.b2_c2_key ?
`The squad's carts, in the shade of the tamarisks. Nothing moves until the Fist says so, and the Fist hasn't said anything to anyone. Bult will.` :
`The carts. ${S.f.b2_dryjFight ? 'There is someone at the spring Haddat wants a word with first.' : 'Not yet.'}`,
    html:chainHTML('Dryj Spring'),
    ch:[{t:'On toward the Sekala.', req:()=>!!S.f.b2_prisonerDone, go:()=>{ startExplore('b2_road'); talk('b2_road_arrive'); }},
        {t:'Not yet.', go:()=>startExplore()}]}),
});

/* ---------------- the march: the first real thirst ---------------- */
Object.assign(B2CH2.dlg, {
  b2_road_arrive:()=>({sp:'The Odhan · a month out of Dryj', scene:'b2_odhan_dusk', fx:()=>{ if (!S.f.b2_roadIn) { S.f.b2_roadIn = 1; chain(-2, -2, 'A month on the Odhan'); } }, txt:
`A month out of Dryj, the water runs out.

Not all at once. The column has water: the Fist's barrels, the nobles' mules, the skins every family carries. It is that every day there is a little less of it, and every day the next well Bult names is dry, or fouled with a dead horse, or held, or not there at all. The Odhan does not care how many people you are. It is the same size for one as for forty thousand.

The squad's stretch walks at night now. In the day it lies under the carts. Two of your people did not get up from under the carts this week. A child and an old man. ${b2In('haddat') ? 'Haddat had both their names.' : 'You have both their names.'}

${b2In('tangle') ? `"${b2Count()}," Tangle says at the halt, and then, which he has never done before: "I'd trade any of it for a skin. Any of it. Don't tell Mincer."` : ''}${b2In('marrow') ? ` Marrow has ${b2Knots()}.` : ''}`,
    html:chainHTML('The Odhan · a month out of Dryj'),
    ch:[{t:'Make camp.', go:()=>startExplore()}]}),

  /* the squad's fire: drink, or keep the water */
  b2_road_fire:()=> S.f.b2_roadRest ? {sp:'The squad\'s fire', txt:`Dung and thornwood, burning low. ${b2In('tangle') ? 'Tangle is asleep sitting up, with the satchel in his arms.' : 'Somebody is asleep beside it.'} ${chainW() > 0 ? `The skins hang on the wagon: ${numw(chainW())}.` : 'The skins hang on the wagon, flat.'}`, ch:[{t:'Leave it.', go:()=>startExplore()}]} : {sp:'The squad\'s fire', txt:
`A fire of dung and thornwood in the lee of a wagon, because there is nothing else on the Odhan to burn. The squad gets down round it.

${chainW() > 0 ? `The squad has ${numw(chainW())} skin${chainW() === 1 ? '' : 's'}, and ${chainC()} people in its stretch who have less.` : `The squad has no water at all.`} A skin round the fire would put the squad back together for whatever comes next. It would also be a skin.

${b2In('sathi') ? `Sathi has her cheek against Hackle's neck. The dog is panting. He has been panting since noon.` : ''}`,
    html:chainHTML('The Odhan · a night on the march'),
    ch:[{t:'Drink, and sleep.', tag:'1 water', req:()=>chainW() > 0, fx:()=>{ S.f.b2_roadRest = 1; dgRest('The squad drinks slowly, round the fire, and sleeps on the hardpan. Wounds close, mostly.'); }, go:'b2_road_slept'},
        {t:'Give tonight\'s skin to the stretch instead.', tag:'1 water', req:()=>chainW() > 0, fx:()=>{ S.f.b2_roadRest = 1; S.f.b2_roadGave = 1; chain(-1, 1, 'The squad\'s skin to the stretch'); if (b2In('marrow')) loy('marrow', 1); if (b2In('tangle')) loy('tangle', -1); }, go:'b2_road_gave'},
        {t:'Sit, and keep the water.', fx:()=>{ S.f.b2_roadRest = 1; }, go:'b2_road_dry'}]},
  b2_road_slept:()=>({sp:'The squad\'s fire', txt:
`The skin goes round once. Everybody drinks the way you taught them, slowly, a mouthful held before it's swallowed. ${b2In('sathi') ? 'Sathi gives half of hers to Hackle out of her cupped hand. Nobody says anything.' : ''}

${b2In('haddat') ? `Haddat takes the first watch. She sits with her back to the fire and her face to the west, the way the Tithansi ride, and her shield across her knees.` : `You take the first watch yourself.`} The rest sleep on the hardpan like the dead, which on the Odhan this month is not a figure of speech.`,
    ch:[{t:'Wake.', go:()=>startExplore()}]}),
  b2_road_gave:()=>({sp:'The squad\'s fire', txt:
`The skin goes down the squad's stretch instead, cart to cart, a mouthful to each, the children first. It doesn't go far. It goes far enough that one old woman, who had stopped talking at noon, starts again, to complain about the taste.

The squad sits round the fire with dry mouths. ${b2In('marrow') ? `"Good," Marrow says. "Stupid. Good." She lies down where she is.` : 'Nobody complains. Nobody has the spit for it.'}${b2In('tangle') ? ` Tangle says nothing at all, which from Tangle is an argument.` : ''}`,
    ch:[{t:'Sleep, if you can.', go:()=>startExplore()}]}),
  b2_road_dry:()=>({sp:'The squad\'s fire', txt:
`Nobody drinks. The skins stay on the wagon where everybody can see them, and everybody looks at them, and nobody touches them.

${b2In('marrow') ? `"Sensible," Marrow says, lying down. "I hate sensible. Wake me if anybody dies."` : `It's the right call. Your mouth is full of sand.`}`,
    ch:[{t:'Up.', go:()=>startExplore()}]}),

  /* the carter and his ox */
  b2_ox:()=>({sp:'A carter and his ox', txt:
`A carter from Hissar, a big quiet man, sitting in the dark beside his ox. The ox is down. It is not dead; it is lying on its side with its legs out, breathing in long dragging breaths, and on the cart behind it are two old people from the squad's stretch who cannot walk, and a sack of grain, and a door.

"He pulled from Hissar," the carter says. He has his hand on the ox's neck. "Forty days. He'll pull tomorrow if he drinks. He won't drink. There's nothing to drink."

${b2In('sathi') ? `Sathi crouches by the ox and looks at it, and at the vein in its neck, and then at you, and says nothing yet.` : ''}`,
    ch:[{t:'"Give him a skin."', tag:'1 water', req:()=>chainW() > 0, fx:()=>{ S.f.b2_ox = 'watered'; chain(-1, 0, 'A skin for the ox'); if (b2In('marrow')) loy('marrow', 1); }, go:'b2_ox_watered'},
        {t:'"Sathi. The Wickan way."', req:()=>b2In('sathi'), fx:()=>{ S.f.b2_ox = 'bled'; S.f.b2_oxBled = 1; loy('sathi', 1); }, go:'b2_ox_bled'},
        {t:'"I\'m sorry. We can\'t."', fx:()=>{ S.f.b2_ox = 'left'; chain(0, -2, 'The ox, and the cart, and the two on it'); if (b2In('haddat')) loy('haddat', -1); }, go:'b2_ox_left'}]}),
  b2_ox_watered:()=>({sp:'A carter and his ox', txt:
`The carter holds the skin to the ox's mouth himself, and the ox drinks the way the people drink, too fast, and chokes, and drinks again. It takes the whole skin.

In the morning it gets up. Not quickly. It pulls. The two old people on the cart do not know what it cost and the carter does not tell them. He comes and stands by the squad's fire before the march and nods to you, once, and goes back to his ox.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ox_bled:()=>({sp:'Sathi', txt:
`"Cattle carry water," Sathi says. "In the blood. The clans do it on the plains in a bad summer. A little from the neck, and close it again, and the cow lives." She looks at the carter. "Your ox lives. You drink. Everybody wins but the ox, and the ox does not lose much."

The carter looks at her for a long time. Then he nods.

She does it with her long knife and a cup, quickly, the way you would do a thing you had seen done every summer of your life, and pinches the vein shut with her fingers, and Hackle sits and watches with great interest. The cup goes round the cart. The two old people drink. The carter drinks. Sathi offers it to you, and to the squad, with her chin up, daring.

${b2In('haddat') ? `Haddat drinks. Then you do. It is warm and salt and not water and it is wet, and nobody in the squad will ever talk about it again.` : `You drink. Nobody in the squad will ever talk about it again.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ox_left:()=>({sp:'A carter and his ox', txt:
`The carter nods. He knew. He sits with his hand on the ox's neck until it stops breathing, a little before dawn.

When the march goes on the cart stays, with the door and the grain. The two old people stay with it. They tell the carter to go on, and he does, in the end, without the cart. ${b2In('haddat') ? `Haddat goes back and sits with them a while, and gives them her own mouthful of the morning's water, and comes back without saying anything.` : `You don't look back. Then you do.`}

${b2In('marrow') ? `Marrow does not tie a knot. She doesn't untie one, either. She just holds the string a while.` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ox_again:()=>({sp:'The carter', txt: S.f.b2_ox === 'left' ? `He walks now, with nothing to pull. He doesn't look at you. You don't blame him.` : `The ox is up, and pulling, slowly. The carter walks at its head with a hand on its neck.`, ch:[{t:'Walk on.', go:()=>startExplore()}]}),

  /* a fevered girl, and Marrow's string */
  b2_fever:()=>({sp:'A grandmother', txt:
`A grandmother from the potters' street, with a girl of six or seven across her knees under a cloak. The girl is burning with fever and has stopped sweating, which on the Odhan is the bad sign, the one everybody has learned.

"Healer," the grandmother says. Not to you. ${b2In('marrow') ? 'To Marrow, who is already sitting down beside her.' : 'To the dark, to anyone. There is no healer in the squad tonight.'}

${b2In('marrow') ? `Marrow puts two fingers on the girl's neck and closes her eyes, and you can see her reach: a stillness, a listening, as if for footsteps a long way off. Her mouth tightens. "Thick tonight," she says. "Thick and wrong. Like wading in a ditch somebody's already drowned in." She doesn't open her eyes. "Sit with me, child. This is going to take the night."` : ''}`,
    ch:[{t:'Marrow reaches into Denul for the girl.', check:['wits',14], req:()=>b2In('marrow'), not:['sgt','haddat','sathi','tangle','redblade'],
          edges:id=>[S.f.b2_roadGave && ['the stretch had a mouthful tonight', 1], chainW() <= 0 && ['no water to cool her with', -2]],
          go:'b2_fever_held', fail:'b2_fever_lost'},
        {t:'Sit with her. Wet cloth, shade, a mouthful of water.', tag:'1 water', req:()=>!b2In('marrow') && chainW() > 0, fx:()=>{ chain(-1, 0, 'Water for a fevered girl'); S.f.b2_fever = R(2) ? 'held' : 'lost'; if (S.f.b2_fever === 'lost') chain(0, -1, 'A girl from the potters\' street'); }, go:'b2_fever_sat'},
        {t:'"I\'m sorry. There\'s nothing."', req:()=>!b2In('marrow'), fx:()=>{ S.f.b2_fever = 'lost'; chain(0, -1, 'A girl from the potters\' street'); }, go:'b2_fever_none'}]}),
  b2_fever_held:()=>({sp:'Marrow', fx:()=>{ S.f.b2_fever = 'held'; S.f.b2_knots = (S.f.b2_knots || 0) + 1; loy('marrow', 1); }, txt:
`It takes the night.

Some time after the middle of it, the girl starts to sweat. Marrow says nothing. She keeps her two fingers where they are and her eyes closed, and the grandmother holds her breath, and so, you find, do you.

At first light Marrow opens her eyes and takes her hand away and sits for a while, grey, looking at nothing. Then she takes out the string and ties one knot in it, slowly, with fingers that don't want to.

"One," she says. "Clean." She holds it up to the grey light. "You see that, child? That's a good one. The warren gave it back without anything on it. I'd forgotten what that looks like."`,
    ch:[{t:'"Sleep, Marrow."', go:()=>startExplore()}]}),
  b2_fever_lost:()=>({sp:'Marrow', fx:()=>{ S.f.b2_fever = 'lost'; S.f.b2_sputters = (S.f.b2_sputters || 0) + 1; chain(0, -1, 'A girl from the potters\' street'); }, txt:
`It takes the night, and at the end of it, it doesn't take.

Marrow reaches, and reaches, and some time after the middle of the night you hear her say, very quietly, "No. *No.* Not that," as if somebody had handed her the wrong thing across a counter. The warren gives back mud. She tries again. It gives back mud.

The girl dies a little before dawn without waking. The grandmother does not cry. She thanks Marrow, formally, in the potters' way, with both hands, and Marrow takes the thanks because there is nothing else to do with it.

She does not tie a knot. She sits with the string in her lap for a long time. Then she puts it away and lies down on the hardpan with her back to everyone.`,
    ch:[{t:'Let her be.', go:()=>startExplore()}]}),
  b2_fever_sat:()=>({sp:'A grandmother', txt:
`You sit with them through the night, with a wet cloth and the shade of the cart and a skin of the squad's water a mouthful at a time.

${S.f.b2_fever === 'held' ? `Some time after the middle of it, the girl starts to sweat, and the grandmother starts to cry, quietly, as if it were the girl who had been holding her breath all along. In the morning she can walk.` : `A little before dawn, she stops. The grandmother thanks you, formally, in the potters' way, with both hands. You take it, because there is nothing else to do with it.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_fever_none:()=>({sp:'A grandmother', txt:
`The grandmother nods. She knew. She sits with the girl under the cloak all night, and in the morning she gets up and walks on, alone.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_fever_again:()=>({sp:'A grandmother', txt: S.f.b2_fever === 'held' ? `The girl is riding on a cart, sullen and alive, refusing to wear her hat. The grandmother lifts a hand to you.` : `The grandmother walks alone, at the pace of the column, looking straight ahead.`, ch:[{t:'Walk on.', go:()=>startExplore()}]}),

  /* the Weasels' horses */
  b2_weasel_horse:()=>({sp:'A Weasel rider', fx:()=>{ S.f.b2_weaselHorse = 1; }, txt:
`A Weasel rider, standing at the head of a horse that is standing very still with its head down, and its legs shaking.

He talks to it in Wickan, low, for a long time. Then he takes out his knife.

${b2In('sathi') ? `Sathi goes over to him. She doesn't say anything. She puts her hand on the horse's neck beside his, and stays there while he does it, and after, when the horse is down, she stays crouched by it with her hand still on its neck.

When she comes back to the fire she sits down by Hackle and does not laugh, and does not talk, and the dog puts his head in her lap. "Third one this week," she says at last, to the dog, in Malazan, so you will hear. "The clans are walking. Wickans. Walking." She says it as if it were the worst word she knows. It may be.` : `You look away. When you look back the horse is down and the rider is crouched beside it with his hand on its neck. The Weasels have been losing horses all month. They do not laugh about it.`}`,
    ch:[{t:'Leave him to it.', go:()=>startExplore()}]}),
  /* the squad's own people on the road */
  b2_road_ours:()=>({sp:S.f.b2_key === 'daughters' ? B2.younger : B2.widow, fx:()=>{ S.f.b2_roadOurs = 1; }, txt: S.f.b2_key === 'daughters' ?
`${B2.younger} is sitting on the tail of a cart with the jar in her lap. It is empty. She is holding it anyway.

"${B2.elder} says Father isn't thirsty," she tells you. "Because he sells water." She considers. "But who does he sell it to? Everyone is gone."

She waits. She is nine and she has decided you will know.${b2In('haddat') ? `

Haddat, who has stopped beside you, says, before you can: "The Whirlwind's people. They are thirsty too. Everybody is, in the end. He told us so." She says it in the quarter's Hissari, in Ressan's own way of saying it, and ${B2.younger} looks at her for a long moment and then nods, satisfied, and puts her chin on the jar.` : `

You tell her: everybody is thirsty in the end. Her father said so. She nods, satisfied, and puts her chin on the jar.`}` :
`${B2.widow} has put her grandsons to sleep under the cart and is sitting on the rope, in the dark, upright.

"Soldier," she says. "The little one asked me tonight if we'll see the sea. At Aren." She snorts. "I told him yes. I don't know where Aren is. Do you?"

${S.f.b2_ubaryd ? '' : `You tell her: west. A long way west. On the sea. She nods as if you'd told her the price of bread and she meant to argue it later.`}`,
    ch:[{t:'Leave her be.', go:()=>startExplore()}]}),
  b2_bones:()=>({sp:'Bones', txt:
`Cattle bones, old ones, white, in a long scatter off the side of the road. Somebody else's march, years ago. ${b2In('sathi') ? 'Sathi looks at them and says nothing, which is not like her.' : 'Nobody stops to look.'}`,
    ch:[{t:'Walk on.', go:()=>startExplore()}]}),

  /* moving on: the tail of the column, in the dark */
  b2_road_on:()=> S.f.b2_tailDone ? {sp:'The wagons', txt:
`The column is moving again. The Sekala is somewhere ahead, Bult says: a river, a real one, with water in it all the way across.`,
    ch:[{t:'On to the river.', go:'b2_road_months'}, {t:'Not yet.', go:()=>startExplore()}]} : {sp:'The wagons', txt:
`Before dawn the column moves. The squad's stretch is near the tail tonight, which means the dark behind you is the dark the Tithansi ride in.

${!S.f.b2_roadRest ? 'The squad has not rested. ' : ''}You get your people moving: carts, the lame, the sleeping children lifted onto anything with wheels. And then, from behind, out of the dark, Hackle growls.`,
    ch:[{t:'"Turn round. Shields."', go:'b2_tail_start'},
        {t:'Not yet.', go:()=>startExplore()}]},
  b2_tail_start:()=>({sp:'The tail of the column', txt:
`Riders. Not many: a dozen, two dozen, Tithansi on small horses, coming out of the dark at the tail where the carts are slowest, the way wolves come at the back of a herd. They are not here to fight. They are here to cut off the last cart, and the one after, and be gone before the Wickan rearguard comes back from wherever it has gone.

The last cart is yours.

${b2In('haddat') ? `"Hold it," Haddat says. "Until the Wickans come. They will come." She doesn't say *probably*. She has decided not to.` : `Hold until the Wickans come back. They will.`}`,
    ch:[{t:'Hold the tail.', go:()=>startBattle('b2_tail', {})},
        {t:'Tangle\'s smoker across the road behind the carts.', tag:'uses 1 smoker', req:()=>b2In('tangle') && S.inv.smoker > 0, fx:()=>{ S.inv.smoker--; S.f.b2_tailSmoke = 1; }, go:'b2_tail_smoke'}]}),
  b2_tail_smoke:()=>({sp:'The tail of the column', txt:
`Tangle breaks a smoker across the road behind the last cart, and the grey goes out across the hardpan and sits there like a held breath. The horses won't go into it. The riders have to come round it, on foot, or not at all, and the carts get a little further on while they make up their minds.

"One smoker," Tangle says, hoarse. "Gone for good. For a cart." He doesn't sound as if he minds as much as he says.`,
    ch:[{t:'Hold.', go:()=>startBattle('b2_tail', {surprise:'p'})}]}),
  b2_after_tail:()=>({sp:'The tail of the column', fx:()=>{ S.f.b2_tailDone = 1; }, txt:
`The Weasel rearguard comes back out of the dark at a gallop, laughing, and the Tithansi who are still on their feet are not on them for long.

The last cart is still the last cart. Everyone on it is alive. ${S.f.b2_key === 'daughters' ? `${B2.elder} is on it, with ${B2.younger} behind her and a tent-pole in both hands, and she does not put it down until the sun is up.` : S.f.b2_yedda ? `${B2.widow} is on it, sitting on her rope, and says she was never worried, and her hands are shaking.` : `A family from the weavers' street is on it, and the mother will not stop thanking ${b2In('haddat') ? 'Haddat' : 'you'}, in a whisper, as if it were a secret.`}${b2In('marrow') ? `

Marrow ties ${S.f.b2_knots ? 'no knot. She is too tired. She says she\'ll remember which one it was.' : 'nothing. She sits on the cart-tail and closes her eyes.'}` : ''}`,
    ch:[{t:'On toward the river.', go:'b2_road_months'}]}),
  b2_road_months:()=>({sp:'The Odhan · toward the Sekala', scene:'b2_odhan_dusk', fx:()=>{ if (!S.f.b2_months) { S.f.b2_months = 1; chain(-1, -2, 'The last weeks to the river'); } }, txt:
`Weeks. The column goes on, because it goes where it's told.

Three months out of Hissar, and a hundred and sixty leagues, by Bult's count, which he says is a lie but the right size of lie. The cattle are thinner. The carts are fewer. The Tithansi ride the skyline every day now, and Reloe's army is behind, closer every week, filled out with every tribe and town that has decided the Seventh is a thing it would like to be able to say it helped to kill.

And then one evening the land in front of the column goes down in a long brown slope, and at the bottom of it there is a smell nobody has smelled since Dryj, and then a sound, and then a river.

The Sekala. Broad and brown and slow, with reeds along it and a ford, Bult says, somewhere under it.

${b2In('sathi') ? `Hackle runs down the slope to it without being told, and stands in it to the chest, and drinks, and looks back at Sathi as if to say: I told you. Nobody tells him he's wrong.` : 'Nobody runs. Nobody has the legs for it. They walk down to the water the way people walk into a temple.'}`,
    html:chainHTML('The Sekala · three months and a hundred and sixty leagues'),
    ch:[{t:'Down to the river.', go:()=>{ startExplore('b2_ford'); talk('b2_ford_arrive'); }}]}),
});

/* ---------------- the Sekala: the east bank ---------------- */
Object.assign(B2CH2.dlg, {
  b2_ford_arrive:()=>({sp:'The Sekala · the east bank', scene:'b2_sekala', fx:()=>{ if (!S.f.b2_fordIn) { S.f.b2_fordIn = 1; chain(3, 0, 'The Sekala'); } }, txt:
`The army goes across in the dark.

You don't see how. Nobody does. A fog comes up off the river at midnight that has no business being there in summer, thick and white and smelling of earth, and the Seventh's companies go down into it in file and do not come back up. ${b2In('sathi') ? `"The warlocks," Sathi says, low, with her hand in Hackle's ruff. The dog's hackles are up. "Sormo, and the young ones. They have asked the river for something." She doesn't say what the river asked for back.` : 'The Wickan warlocks, someone says. Nobody says it loudly.'}

By first light the regulars are over and dug in on the far bank, and the cattle are going across, bawling, a brown river on a brown river. The column waits its turn on the east bank. Every skin in the squad's stretch is full for the first time since Dryj. People are standing in the shallows to the knees, not drinking any more, just standing.

Behind, to the east, on a long low hill with a flat top, there are fires. A great many. Reloe's army has caught up. ${b2In('tangle') ? `

Tangle is looking at the river, not the hill. He has the expression of a man who has just seen an old friend across a crowded room. "That's Mincer's," he says. "That ford. That's the captain's work. Come and look, Sergeant, before it's gone."` : ''}`,
    ch:[{t:'Down to the water.', go:()=>startExplore()}]}),

  /* ---- Captain Mincer, and the paving under the river ---- */
  b2_mincer:()=>({sp:'Captain Mincer · the sappers', fx:()=>{ S.f.b2_mincer = 1; }, txt:
`Captain Mincer is sitting on an upturned crate at the water's edge, wet to the waist, with a slate on his knee. Older than you expected: grey and short and burned down one side of his face and neck, an old burn, shiny and pulled, the kind a sapper gets once. His coat has more pockets than a healer's. Every pocket has something in it.

"Sergeant." He doesn't get up. "${b2In('tangle') ? `You're Tangle's. He talks about you. Not much. That's a compliment, from Tangle.` : `Third Squad, Hissar. I had a man in your squad, once.`}"

He jerks his head at the river. "Stones. Flat ones, out of every wall and grave for a league round, laid edge to edge on the bottom, under the water, all the way over, in the dark, while the warlocks kept the fog on it. A road." He says it the way another man would say *my daughter*. "You can drive a wagon across that ford now at a trot. You couldn't yesterday. Nobody on that hill knows it."

He taps the slate. "And under the stones, fifty-four cussers. Fifty-five when I find the last. When the column's over and Reloe's peasants come after it, the road goes away." He looks at you with no expression at all. "You didn't hear that from me. You'll hear it from the river."`,
    ch:[{t:'"How do your people get flat so fast when the fuse is lit?"', check:['wits',16], trick:'b2_drop', req:()=>!S.f.b2_dropTried, fx:()=>{ S.f.b2_dropTried = 1; },
          edges:id=>[id === 'tangle' && ['his own captain', 2], id === 'sathi' && ['she fights from a saddle, not a ditch', -1]],
          go:'b2_mincer_drop', fail:'b2_mincer_miss'},
        {t:'"Who lights it?"', go:'b2_mincer_who'},
        {t:'Leave him to his slate.', go:()=>startExplore()}]}),
  b2_mincer_drop:()=>({sp:'Captain Mincer', txt:
`Mincer looks at ${by({sgt:'you', _:'{who}'})} as if somebody had finally asked the right question.

"You don't get flat," he says. "You *are* flat. You were flat before the fuse was lit; you just hadn't lain down yet." He stands up, for the first time, and points at the bank. "Look at it. Not at the river. At the ground. Every bit of ground has a fold in it somewhere, a rut, a hoof-print, a hollow where a stone was. You walk on a battlefield, you're always looking for your fold. Always. So when somebody shouts, you're already in it."

He sits back down. "Then you shout it for the people who weren't looking. *Down.* Not *duck*. Not *get down*. One word. They hear one word." He goes back to his slate. "That's the whole of it. Took me twenty years and half my face."

${by({tangle:`Tangle has gone red to the ears. "Sir," he says. It is the most he has said to anyone all week.`, _:b2In('tangle') ? `Tangle, behind you, is nodding, as if he had been waiting for somebody to say it out loud.` : ''})}`,
    ch:[{t:'"Who lights it?"', go:'b2_mincer_who'},
        {t:'Thank him, and go.', go:()=>startExplore()}]}),
  b2_mincer_miss:()=>({sp:'Captain Mincer', txt:
`Mincer looks at ${by({sgt:'you', _:'{who}'})} for a moment, and then at the slate.

"You lie down," he says. "Quick." He makes a mark. "Ask me after. If there's an after." It's not unkind. It's a man with fifty-four cussers on his mind and one missing.`,
    ch:[{t:'"Who lights it?"', go:'b2_mincer_who'},
        {t:'Leave him to it.', go:()=>startExplore()}]}),
  b2_mincer_who:()=>({sp:'Captain Mincer', txt:
`"Cuttle." He nods down the bank, at a sapper you can't pick out from the others, all of them wet and filthy and moving crates. "Cuttle's got the fuse. Cuttle always has the fuse. When Cuttle's got the fuse, I sleep." He doesn't look like a man who has slept in a month. "${b2In('tangle') ? `And your Tangle's going to help us lay the last of the stones. Aren't you, Tangle.` : `Your squad crosses when it's called. Don't be early. Don't be late.`}"

${b2In('tangle') ? `"Sir," says Tangle. He has already taken his boots off.` : ''}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_mincer_again:()=>({sp:'Captain Mincer', txt: S.f.b2_cusser ?
`Mincer looks up from the slate when he sees you, which he did not do the first time.

"Fifty-five," he says. "Your sapper's. I wrote his name next to it." He taps the slate: there it is, *Tangle*, in a careful hand, beside the last mark. "When Cuttle lights it, that's the one that goes under the far end, where they'll bunch. I'll tell him whose it was. Cuttle likes to know." He goes back to his counting, and then, without looking up again: "Sergeant. Thank you. That one cost him. I could see it."` : S.f.b2_cusserKept ?
`Mincer is counting something on the slate, lips moving. "Fifty-four," he says, to nobody, and then, to you, without heat: "I'll find one. Some fool's kit, some dead wagon. I always find one." He doesn't look up again.` :
`Mincer is counting something on the slate, lips moving. "Fifty-four," he says, to nobody. He doesn't look up.`,
    ch:[{t:'"How do your people get flat so fast when the fuse is lit?"', check:['wits',16], trick:'b2_drop', req:()=>!S.f.b2_dropTried, fx:()=>{ S.f.b2_dropTried = 1; },
          edges:id=>[id === 'tangle' && ['his own captain', 2], id === 'sathi' && ['she fights from a saddle, not a ditch', -1]],
          go:'b2_mincer_drop', fail:'b2_mincer_miss'},
        {t:'Leave him.', go:()=>startExplore()}]}),

  /* ---- Tangle in the river, and the last cusser ---- */
  b2_ford_work:()=>({sp:'The ford', fx:()=>{ S.f.b2_fordWork = 1; }, txt: b2In('tangle') ?
`Tangle is in the river to the chest with three of Mincer's sappers, and for the first time since Hissar he looks happy.

They are laying the last of the stones at the deep end of the ford, by feel, under brown water: a sapper ducks under and comes up and says *left*, and the next stone goes left. Tangle hums the four notes, the whole time, over and over, and nobody tells him to stop.

When they come out he is blue-lipped and grinning. Then the grin goes.

"Fifty-four," he says to you, low. "The captain's one short. One cusser short of the count, for the far end, where the peasants will bunch." He doesn't look at the satchel. He doesn't have to. "${b2Count()}. I said I'd throw it for the right thing, Sergeant. I said you'd tell me which thing was the right one." He waits.` :
`A sapper waist-deep in the river, laying stones under the water by feel. He comes up spitting and looks at you. "Captain's one cusser short of his count," he says. "Don't suppose you've got one." He doesn't wait for an answer. He goes back under.`,
    ch:[{t:'"Give it to Mincer."', tag:'uses 1 cusser', req:()=>b2In('tangle') && S.inv.cusser > 0 && !S.f.b2_cusser && !S.f.b2_cusserKept, fx:()=>{ S.inv.cusser--; S.f.b2_cusser = 1; loy('tangle', 1); }, go:'b2_cusser_give'},
        {t:'"Keep it. We\'ll need it."', req:()=>b2In('tangle') && !S.f.b2_cusser && !S.f.b2_cusserKept, fx:()=>{ S.f.b2_cusserKept = 1; }, go:'b2_cusser_keep'},
        {t:'On.', req:()=>!b2In('tangle') || !!(S.f.b2_cusser || S.f.b2_cusserKept), go:()=>startExplore()}]}),
  /* after the last cusser is settled: the sappers in the river know which way it went */
  b2_ford_after:()=>({sp:'The ford', txt: S.f.b2_cusser ?
`The sappers are still in the river, laying the last stones by feel. One of them comes up spitting, sees ${b2In('tangle') ? 'Tangle' : 'the squad'}, and knocks a knuckle on his helmet: the sappers' salute, the one officers aren't supposed to see.

"Fifty-five," he says. "The far end's ours now. Captain wrote your sapper's name on the slate next to it." He goes back under.` : S.f.b2_cusserKept ?
`The sappers are still in the river. One of them comes up, looks at Tangle's satchel, and doesn't say anything at all, which in a sapper is a speech. Then he goes back under.

"Captain'll find one," Tangle says, to nobody.` :
`The sappers are still in the river, laying stones under the brown water by feel. Nobody looks up.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_cusser_give:()=>({sp:'Tangle', txt:
`He takes the cusser out of the satchel with both hands, the way ${b2In('marrow') ? 'Marrow' : 'a priest'} holds a thing that matters, and wades back out with it, and gives it to Mincer at the water's edge. Mincer looks at it, and at Tangle, and writes on his slate.

"Fifty-five," Mincer says.

Tangle comes back up the bank. He doesn't hum. He sits down next to the satchel and counts it, out loud, slowly, all of it, and then the old count, once, under his breath, the way you'd say the name of somebody who has gone.

"It was the right thing," he says. Not a question.`,
    ch:[{t:'"It was the right thing."', go:()=>startExplore()}]}),
  b2_cusser_keep:()=>({sp:'Tangle', txt:
`Tangle nods. He knew. He is a sapper; he doesn't decide.

"Mincer'll find one," he says. "Off a dead wagon. Out of some fool's kit. Captain always finds one." He hums the four notes over the satchel, once, the way other men cross themselves. "${b2Count()}. Same as Dryj." He is pleased, and he is ashamed of being pleased, and he does not say either.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Nil and Nether ---- */
  b2_nil:()=>({sp:'Nil and Nether · Wickan warlocks', fx:()=>{ S.f.b2_nil = 1; }, txt:
`Two Wickan children sitting on a horse-blanket at the edge of the reeds, a boy and a girl, ten or twelve years old, very still, with their hands on their knees the way Sormo sits. You saw them behind him in the camp outside Hissar.

The girl looks up at you. Her eyes are not as old as Sormo's. They are on the way. "Malazan," she says, in good Malazan, unimpressed. "I am Nether. That is Nil. You are standing on a dead man."

You are not. You look anyway. She seems pleased.

The boy has not moved. He is looking east across the river at the long flat hill where Reloe's fires are. "There is an island in the bend," he says, to nobody, in a voice too quiet for a boy. "Down there. The clans fought each other on it, before the Empire. Before anyone. They're still there." He tilts his head as if listening. "They don't like the Tithansi either."

${b2In('sathi') ? `Sathi has gone down on one knee on the blanket's edge, which you have never seen her do for anyone, and says something to them in Wickan. Nether answers, sharp. Nil does not. "They are going across with the rearguard," Sathi says when she stands up, very quietly. "Into the fighting. The young ones. That is what the warlocks are for." She doesn't laugh. Hackle licks Nil's hand, and the boy, for a moment, is a boy.` : `"Go and cross your river, Malazan," Nether says. "We have work."`}`,
    ch:[{t:'Leave them to their work.', go:()=>startExplore()}]}),

  /* ---- the Red Blades at the water ---- */
  b2_ramin_first:()=>({sp:'The Red Blades', fx:()=>{ S.f.b2_raminFirst = 1; }, txt:
`The Red Blades are watering their horses below the squad's stretch: Seven Cities cavalry in red-enamelled scale and slit-visored helms, with lances racked on the saddles, sworn to the Empire, and every one of them a native of the country that is trying to kill them.

Your people do not like them. A man from the tanners' street spits as they go by, carefully, to one side, the way the quarter spits. Somebody behind him says a word in Hissari you have heard before, the one for a dog that eats from the wrong hand.

One of the Red Blades, a lean young man still holding his horse's bridle, stops, and turns round, and answers in the same Hissari, politely, with the swallowed endings, the way the quarter speaks.

"Thank you, uncle," he says. "I will drink your health on the other side." And he leads his horse on down to the water and lets it drink, and does not look back.

${b2In('haddat') ? `Haddat has watched all of it. "Ehrlitan," she says. "By the voice. The Old Quarter." She is quiet a moment. "They hate us less than they hate him. I did not think that was possible."` : `Ehrlitan, by the voice. You wouldn't have guessed it by the armour.`}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),

  /* ---- Duiker, back across the lines ---- */
  b2_duiker_back:()=>({sp:'A ragged man', fx:()=>{ S.f.b2_duikerBack = 1; S.f.b2_duiker = 1; }, txt:
`A man in a rebel's dirty robes and a rebel's head-cloth, thin as a stick, grey-bearded, coming down the bank from the north between two Wickan riders who are not, by the look of them, an honour guard. There's a green rag knotted round his arm.

He sees you, and stops, and the Wickans stop.

"Sergeant." The voice is Malazan, cracked, and familiar. "Third Squad, Hissar." He pulls the head-cloth back. It is Duiker. The Imperial Historian, three months older and twenty years thinner, with the sun burned into him like a brand. "I have been walking," he says, "with the Army of the Apocalypse, as one of its devout. Since Bat'rol. They are very bad at counting their own. I recommend it to no one."

He looks past you at the river, and the paved ford, and the column, and something goes out of his shoulders.

"I need the Fist. And the Red Blades' commander. The Semk have come to Reloe, Sergeant, a whole tribe, with their god, and nobody on this bank knows it yet." He starts walking again, and then stops. "Afterward. I'll want to know what I missed. All of it. Yours, not the officers'."`,
    ch:[{t:'"Go. The Fist is over the river."', go:()=>startExplore()},
        {t:'"Sir. You\'d better have water first."', fx:()=>{ chain(-1, 0, 'A skin for the historian'); S.f.b2_duikerWater = 1; }, req:()=>chainW() > 0, go:'b2_duiker_back2'}]}),
  b2_duiker_back2:()=>({sp:'Duiker', txt:
`He drinks the way everyone on the Odhan drinks, too fast, and makes himself stop, and drinks again, slowly.

"Thank you." He hands the skin back. "Three months, Sergeant, I have been grateful to people who wanted me dead, for water. It is pleasant to be grateful to someone who doesn't." He wipes his mouth. "${S.f.b2_duikerTold ? `*It looked like a city burning.* I've thought about that a great deal, out there. You were right. It still does.` : `I'll want the column's story from you. The officers will give me the battles.`}"

He goes on down to the ford between his Wickans, ${b2In('sathi') ? 'and Sathi says something to one of the riders, and the rider laughs. "He says the old one walked into their lines asking for Coltaine by name, in that rag, and nearly got a lance for it," she says. "He says the Fist will like him better now."' : 'and the riders let him lead.'}`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_duiker_again2:()=>({sp:'Duiker', txt:`He is on the far bank by now, or somewhere in the fog, with the Fist. You can't see him. You'd know him anywhere now: the only man in the column wearing the rebellion's colours on purpose.`, ch:[{t:'On.', go:()=>startExplore()}]}),

  b2_ford_wagons:()=>({sp:'The squad\'s carts', txt:
`The squad's carts and the squad's people, waiting their turn on the bank. ${chainC()} of them. They are standing in the shallows, or asleep on the cart-beds, or watching the hill to the east where the fires are. Out on the ford the cattle are still going over.`,
    html:chainHTML('The Sekala · the east bank'),
    ch:[{t:'Leave them.', go:()=>startExplore()}]}),

  /* ---- the crossing ---- */
  b2_cross:()=> !S.f.b2_mincer ? {sp:'The ford', txt:
`The paved ford, under knee-deep brown water. A sapper on the near end waves you off. Not yet. ${b2In('tangle') ? 'Tangle wants you to meet his captain first.' : 'The captain of sappers is down the bank.'}`,
    ch:[{t:'Not yet.', go:()=>startExplore()}]} : {sp:'The ford', scene:'b2_sekala', txt:
`Afternoon. The cattle are over. The horn goes, the long one, and the column comes down off the bank onto the ford: carts and families and the wounded and the nobles' carriages, everything, all at once, and the water closes over the paving stones round their knees.

Behind, on the east bank, the noise has been getting closer all day. The rearguard is falling back toward the river in a ring, and past them, on the oxbow island in the bend, something is fighting that nobody living is fighting, in armour nobody has worn for a thousand years. ${S.f.b2_nil ? 'Nil\'s work.' : 'You don\'t look at it twice.'}

The squad's stretch goes onto the stones.`,
    ch:[{t:'Across.', go:'b2_cross_jam'}, {t:'Not yet.', go:()=>startExplore()}]},
  b2_cross_jam:()=>({sp:'The ford · midstream', scene:'b2_sekala', txt:
`Halfway over, it jams.

Not the stones: the stones hold, every one of them, Mincer's road. It is the carts. Too many, too heavy, with the river shoving at the wheels, and the ones in front have slowed, and the squad's stretch is bunching up behind them in water to the waist now where the ford bends. ${S.f.b2_c2_key === 'water' || chainW() >= 6 ? `Your own carts are the heaviest on the ford: barrels and skins, all the water you have carried since Dryj.` : `Your carts are low in the water with barrels and skins.`}

A child goes off the edge of the paving into the deep water, and her mother after her, and ${b2In('sathi') ? 'Hackle goes in after both and drags the child back by her shirt while Sathi screams at the dog in Wickan.' : 'somebody gets an arm to both of them.'} The next ones won't be so lucky. Behind you, on the east bank, the rearguard's ring is very close to the water now.

${b2In('tangle') ? `"Lighten the carts," Tangle says. "Or they don't go. That's all a ford is, Sergeant. Weight." He looks at the barrels. He doesn't say anything else.` : 'Lighten the carts, or they don\'t move.'}`,
    ch:[{t:'"Over the side. The barrels. All of them."', fx:()=>{ S.f.b2_fordLight = 'dumped'; chain(-3, 0, 'The barrels, into the Sekala'); if (b2In('marrow')) loy('marrow', 1); if (b2In('haddat')) loy('haddat', 1); }, go:'b2_cross_light'},
        {t:'"Push. Keep the water. Everyone push."', fx:()=>{ S.f.b2_fordLight = 'kept'; chain(0, -4, 'The Sekala'); if (b2In('tangle')) loy('tangle', -1); if (b2In('haddat')) loy('haddat', -1); }, go:'b2_cross_heavy'}]}),
  b2_cross_light:()=>({sp:'The ford', txt:
`The barrels go over the side one after another, into the Sekala, and float, and turn slowly in the current, and go away downstream, all the water you have carried since Dryj. Your people watch them go. Nobody says anything. ${S.f.b2_key === 'daughters' ? `${B2.younger} holds the jar tighter.` : ''}

The carts come up out of the water a hand's width. Then they move. The squad's stretch goes over Mincer's road at a walk, then at a trot, every soul in it, and up the west bank into the sun.

${b2In('marrow') ? `"You can drink a river," Marrow says on the bank, sitting down in the mud. "You can't drink a child. There's a whole river of it right there, child. Go and fill a skin."` : 'There\'s a whole river of water right there. You fill what skins you have left on the far bank.'}`,
    ch:[{t:'The west bank.', go:()=>{ startExplore('b2_westbank'); talk('b2_west_arrive'); }}]}),
  b2_cross_heavy:()=>({sp:'The ford', txt:
`Everyone pushes. The carts move, a hand's width at a time, with the river shoving at the wheels and the squad's people shoving back, in water to the chest at the bend.

It is not enough, everywhere, all at once. A cart three ahead tips, slowly, the way a tired man sits down, and goes off the paving into the deep water with the family that was holding on to it, and the river takes them. Further back, somebody lets go of somebody. You don't see who. ${b2In('haddat') ? 'Haddat does. She does not tell you their names until that night.' : 'You find out the names that night.'}

The water comes over with you, every barrel. The squad's stretch comes up the west bank shorter than it went in.`,
    ch:[{t:'The west bank.', go:()=>{ startExplore('b2_westbank'); talk('b2_west_arrive'); }}]}),
});

/* ---------------- the Sekala: the west bank ---------------- */
Object.assign(B2CH2.dlg, {
  b2_west_arrive:()=>({sp:'The Sekala · the west bank', scene:'b2_sekala', fx:()=>{ S.f.b2_westIn = 1; }, txt:
`The west bank is not empty.

The regulars who crossed in the dark have dug a line along the top of it, earth thrown up on stakes, and behind the line the column is coming off the ford and spreading out over the stony ground like water out of a broken jar. In front of the line, a long bowshot off, there is another army.

To the north, in three blocks as square as a parade ground, heavy infantry under city standards: Guran, somebody says, a city legion, armoured to the eyes, standing in their ranks in the sun and not moving. To the south, nearer, along a low stony rise: Tithansi lancers, and among them men on foot painted from the scalp down, with bone in their hair, shouting the same word over and over, and the air over them is wrong, bending like the air over a fire.

${b2In('haddat') ? `"Semk," Haddat says. "From the hills. They have a god." She doesn't say anything else about it. She doesn't need to.` : 'Semk, somebody says. From the hills. They have a god.'}

The Red Blades are already riding along the front of the line toward them, red scale flashing, what horses they have left under them.`,
    ch:[{t:'Find whoever is holding this line.', go:()=>startExplore()}]}),
  b2_chenned:()=>({sp:'Captain Chenned · the Seventh', fx:()=>{ S.f.b2_chenned = 1; }, txt:
`The captain holding this stretch of the line is a lean, hollow-eyed Malazan with a bandage round his sword-hand and a voice worn to a whisper by a night of shouting. Chenned, the regulars call him.

"Third Squad. Hissar." He doesn't ask how you know he's in charge. "Good. Your stretch is coming off the ford there." He points with the bandaged hand. "The Semk will come down that rise at it, because it's soft and it's wet and it's full of carts. The Red Blades are going to hit them first. They'll need somebody to hold the bank behind them while they do. That's you."

He looks north, at the three square blocks of Guran in the sun. "And them. They're waiting to see who wins. They'll send a file down the bank to find out if we're soft. Don't be soft."

${b2In('redblade') ? '' : `He's already turning away. Then, over his shoulder: "The Red Blades lost a great many people getting into position this morning. Don't let them lose any more for want of a squad behind them."`}`,
    ch:[{t:'"Hold the bank."', go:'b2_west_fight'}, {t:'Not yet.', go:()=>startExplore()}]}),
  b2_west_fight:()=>({sp:'The west bank', txt:
`The Red Blades go in at the gallop, lances down, and hit the Semk on the rise like a hammer hitting a pot, and the Semk break, and then they don't. Something on the rise lifts its arms, and the air bends, and two Red Blade horses go down screaming with nothing touching them.

And the Semk who were broken come down off the rise, not at the Red Blades, at the ford, at the carts, at your people coming up out of the water, and with them, along the bank from the north, a file of Guran in good armour at a steady walk, the way a city legion walks when it has been told to find out.

Two Red Blades whose horses are dead get up out of the dust and fall in beside you without a word.

${b2In('marrow') ? `Marrow, at your shoulder, has her hand on the faceless Soliel in her pocket. "The warren stinks of them," she says. "If it gives me mud today, child, it gives me mud. I'm telling you now."` : ''}`,
    ch:[{t:'"Hold the bank."', go:()=>startBattle('b2_westbank', {})},
        {t:'Tangle\'s sharper into the Guran file.', tag:'uses 1 sharper', req:()=>b2In('tangle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('b2_westbank', {pre:true})}]}),
  b2_after_west:()=>({sp:'The west bank', scene:'b2_sekala', fx:()=>{ S.f.b2_westDone = 1; gain('b2_paving'); }, txt:
`The thing the god was wearing goes down on the stony rise and the god goes out of it, all at once, like a lamp going out, and what is left is a man, a thin old man with his paint run off, lying on his back with his mouth open. The Semk round him look at him and stop.

They go back up the rise. Not running. Walking, slowly, as if they had forgotten something and had gone to look for it. The Guran file goes back to its blocks at the same steady walk it came at, and the blocks do not move. They are still watching.

Half the Red Blades who rode at the rise are not riding any more. They are lying on it.

${b2In('marrow') ? `Marrow sits down in the mud at the top of the bank with her string in her lap. "${b2Knots()}," she says, to the river. "Write that down for the historian, child. Somebody should."` : ''}${b2In('sathi') ? ` Sathi is not laughing. She is looking back across the river at the oxbow island, where something old is still fighting, and her face is very young.` : ''}

And then, from behind, from the river, a horn.`,
    ch:[{t:'Turn round.', go:'b2_blown'}]}),
  b2_blown:()=>({sp:'The Sekala', scene:'b2_sekala', fx:()=>{ S.f.b2_blown = 1; }, txt:
`The last of the column is up the west bank. The rearguard is coming over the ford at a run, the last of them, and behind them, on to the stones, after them, comes Reloe's army. Not the soldiers. The others: the peasant host, the town levies, the thousands who have followed the Seventh across the Odhan for three months to watch it die. They come down off the east bank onto Mincer's road in a brown flood, because it is a road, and roads go somewhere.

${b2In('tangle') ? `Tangle has stopped humming. He has stopped doing anything. He is standing on the bank with his hands open at his sides, looking at the ford, at a place on the near end of it where nobody is standing.` : 'On the near end of the ford, nobody is standing.'}

Then the river stands up.

It goes up white, all the way across, the whole length of the ford at once, a wall of water and stone and everything that was on the stones, and the sound comes after it and goes through you and keeps going, and the ground under your boots jumps like a struck drum.

When the water comes down, the ford is gone. There is a trench in the river where the road was, and brown water pouring into it, and on the far bank the rest of Reloe's army is standing very still.

The river goes on downstream, carrying things. Nobody on the west bank watches it for long.${b2In('tangle') ? `

"Cuttle," Tangle says, after a long time, very quietly. ${S.f.b2_cusser ? `"Fifty-five." He doesn't say anything else, and nobody asks him to.` : `"That's Cuttle." He doesn't say anything else.`}` : ''}`,
    ch:[{t:'Count them.', go:'b2_west_count'}]}),
  b2_west_count:()=>({sp:'The west bank · evening', fx:()=>{ S.f.b2_counted = 1; }, txt:
`You count them. Bult said to.

${chainC()} in the squad's stretch, on the stony ground above the river, in the lee of the carts. ${S.f.b2_fordLight === 'dumped' ? 'Every one of them who went into the river came out of it.' : S.f.b2_fordLight === 'kept' ? 'The skins on the carts are full. The count is short.' : ''} ${S.f.b2_key === 'daughters' ? `${B2.elder} and ${B2.younger} among them, filling the jar at the river's edge.` : S.f.b2_yedda ? `${B2.widow} among them, sitting on her rope, telling her grandsons she saw the river stand up and it was nothing to the Hissar fire.` : ''}

Along the bank the Red Blades are counting theirs. They say the names out loud, at dusk, in Ehrlitan Hissari, the whole company together, and it takes a long time.`,
    html:chainHTML('The Sekala · the west bank'),
    ch:[{t:'Walk the bank.', go:()=>startExplore()}]}),
  b2_ford_look:()=>({sp:'The ford', txt: S.f.b2_blown ?
`Where the ford was there is a trench in the river with brown water pouring through it, and a line of broken stones along the near edge like teeth. On the far bank, Reloe's fires.` :
`The ford behind you, under the brown water, and the last of the column still coming over it. ${S.f.b2_westDone ? 'The rearguard is close.' : 'Not now.'}`,
    ch:[{t:'Leave it.', go:()=>startExplore()}]}),
  b2_chenned_again:()=>({sp:'Captain Chenned', txt:`Chenned is sitting on an upturned shield with his bandaged hand in his lap, looking at the river. "Held," he says, when you come by, which is all he says.`, ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_west_wagons:()=>({sp:'The squad\'s carts', txt:`The carts, drawn up in the lee of the bank. ${chainC()} people under them and round them.`, html:chainHTML('The Sekala · the west bank'), ch:[{t:'Leave them.', go:()=>startExplore()}]}),
  b2_west_ours:()=>({sp:'The squad\'s people', fx:()=>{ S.f.b2_westOurs = 1; }, txt:
`Your people, on the stony ground above the river. They have stopped being afraid of the Red Blades, a little. A woman from the weavers' street has taken a skin down to the two who held the bank beside the squad, and they took it, and thanked her in the quarter's own Hissari, and she came back up the bank looking as if she'd been stung.

${S.f.b2_prisonerFate === 'column' ? 'The boy from the tanners\' street is sitting a little apart, looking across the river at Reloe\'s fires. He has the green cloth out of his pocket. He is turning it over in his hands. He puts it back.' : 'Somebody has a fire going. Somebody has found a cooking-pot. It is the closest thing to a feast the squad\'s stretch has seen since Hissar: river water, boiled, with nothing in it.'}`,
    ch:[{t:'Leave them.', go:()=>startExplore()}]}),

  /* ---- the Red Blade ---- */
  b2_ramin:()=>({sp:'A Red Blade', txt:
`The lean young Red Blade from the water's edge, the one who answered the spitting in the quarter's Hissari. He is on foot. His scale is scored and his helm is under his arm and there is a lance-cut on his forearm somebody has bound with a strip of red sash. He comes up the bank to you and stops at the proper distance, the way a man reports.

"Sergeant. Ramin, of the Red Blades. Of Ehrlitan." He nods back at the rise. "My horse is in the river. My file is up there. All of it but me." He says it in the present tense, as if they were waiting for him somewhere. "The commander is lending out the men who have no horse to the Seventh's squads that are short, until the company can remount. In Aren, perhaps. Captain Chenned says your squad held the bank behind my file." A pause. "I would rather be lent to people I have seen fight."

He waits. He is very straight. ${b2In('haddat') ? `Haddat is looking at him the way you'd look at your own face in the water, if it had chosen differently.` : ''}`,
    ch:[{t:'"Why the Red Blades?"', req:()=>!S.f.b2_raminAsked, fx:()=>{ S.f.b2_raminAsked = 1; }, go:'b2_ramin_ask'},
        {t:'"Third Squad. If you want it."', go:'b2_ramin_yes'},
        {t:'"No. We\'re enough as we are."', go:'b2_ramin_no'}]}),
  b2_ramin_ask:()=>({sp:'Ramin', txt:
`He thinks about it, which you did not expect.

"My father kept the Empire's tolls on the Old Quarter gate in Ehrlitan," he says. "Every day of his life somebody spat at him. He did not stop. He said the gate was open because he was there, and it would be open for the people who spat, too, and that was the job." He shrugs. "The Red Blades were the only men in Ehrlitan who did not spit. So."

He looks back at the rise, at the red shapes on it.

"I will go back to the company when it calls for me. I say it now so nobody can say I didn't. A lent sword goes back to its owner." He looks at you. "Until then it is kept clean."${b2In('tangle') ? `

Tangle, behind you, very low: "Sergeant. He's a native." It is not quite an objection. It is a sapper counting something.` : ''}${b2In('sathi') ? ` Sathi, louder: "He fought. I saw. He is a red horse with no horse." She seems to think this settles it.` : ''}`,
    ch:[{t:'"Third Squad. If you want it."', go:'b2_ramin_yes'},
        {t:'"No. We\'re enough as we are."', go:'b2_ramin_no'}]}),
  b2_ramin_yes:()=>({sp:'Ramin', fx:()=>{ S.f.b2_raminDone = 1; recruit('redblade'); loy('redblade', 1); if (b2In('haddat')) loy('haddat', 1); if (b2In('tangle')) loy('tangle', -1); }, txt:
`"Third Squad," he says, as if he were testing the weight of a lance. Then he salutes, Malazan style, fist to chest, very correctly, and goes and stands with the squad, at the end, where a new man stands.

${b2In('haddat') ? `Haddat looks at him for a long moment and says something in Hissari, the quarter's, not Ehrlitan's. He answers in Ehrlitan's. Neither of them translates. Then she moves over, a step, to make room for him in the line, which you have never seen her do.` : ''}${b2In('tangle') ? `

Tangle counts the satchel. Out loud. Ramin listens, and when Tangle gets to the end, he says it back to him, exactly, the whole count. "To help," he says. Tangle stares at him.` : ''}${b2In('marrow') ? `

Marrow looks at the cut on his arm. "Sit," she says. "No. Sit." He sits.` : ''}

Along the bank the Red Blades are still saying their dead. Ramin says them with them, under his breath, all the names, standing with the squad.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ramin_no:()=>({sp:'Ramin', fx:()=>{ S.f.b2_raminDone = 0; }, txt:
`He nods. Once, correctly. "Sergeant." He doesn't argue. He has been told no by Malazans before; he has the face for it.

"Then I will ask the next squad," he says. "Somebody will lend for a red horse with no horse." And he goes back down the bank toward the company, and puts his helm on, and stands with them for the names, and does not look back.`,
    ch:[{t:'On.', go:()=>startExplore()}]}),
  b2_ramin_again:()=>({sp:'Ramin', txt:`He's with what's left of the Red Blades, saying the names.`, ch:[{t:'Leave him.', go:()=>startExplore()}]}),

  /* ---- Bult, and the news from Ubaryd ---- */
  b2_ubaryd:()=> S.f.b2_raminDone == null ? {sp:'Bult', txt:
`Bult is sitting on a wagon-tongue with his boots off and his feet in a bucket of the Sekala. "Sergeant. Later. There's a Red Blade been standing on this bank waiting to talk to you for an hour, as straight as a lance, and it's making my feet hurt to look at him."`,
    ch:[{t:'The Red Blade.', go:()=>startExplore()}]} : {sp:'Bult', fx:()=>{ S.f.b2_ubaryd = 1; }, txt:
`Bult is sitting on a wagon-tongue with his boots off and his feet in a bucket of the Sekala, and for once he is not laughing at anything.

"Sergeant. You held. Good." He moves his feet in the water. "Here is the rest of it, since nobody else will tell you. Reloe has no ford now. He has to go north to the next crossing, the Sekal, ten days there and ten back, and the Fist says tomorrow the column sleeps. All day. You may tell your people. It is the only good news I have."

He looks at the river.

"Ubaryd has fallen. A rider came over this morning, a Wickan who went to look. The city's taken, and the fleet's gone out of it, and there is nobody there to put us on ships." He takes his feet out of the bucket. "So. No Ubaryd. Aren." He says the name the way you'd say the length of a road you have to walk on a bad leg. "All the way to Aren."

Then, the grin coming back, a little: "Count them, Sergeant. It's further than it was this morning."`,
    ch:[{t:'"Sir."', go:'b2_night'}, {t:'Not yet.', go:()=>startExplore()}]},

  /* ---- the night: the spirits and the Semk god ---- */
  b2_night:()=>({sp:'The west bank · night', scene:'b2_spirits', fx:()=>{ S.f.b2_spirits = 1; }, txt:
`Some time after midnight Hackle wakes the squad, not by barking. By shaking. ${b2In('sathi') ? 'Sathi is already sitting up with both arms round him.' : 'The dog is pressed against the cart-wheel, shaking, with his ears flat.'}

Out on the plain to the south-west, far off, past the stony rise where the Semk were, there is a light. Not fire. Something cold and pale, low to the ground, and in it, something huge. Painted. You can see the paint from here. It is standing up, or trying to, and the ground round it is moving.

The ground is coming up out of itself. That is the only way you can say it afterward. Shapes coming up out of the earth, out of the stones, out of the dry grass, dozens and then hundreds, low, quick, without faces, the way the land would look if the land had teeth. They go to the painted thing. They go up it.

It does not make a sound you can hear. You hear it anyway.

${b2In('sathi') ? `"The warlocks," Sathi whispers. "Sormo. They have given it to the spirits. To the land. The land is old here and it is very hungry and nobody has fed it in a long time." She is not laughing. You have never seen her not laugh at a death. "Don't watch, Sergeant. It isn't ours. It's theirs."` : `It isn't yours to watch. You watch anyway.`}

${b2In('marrow') ? `Beside you Marrow makes a small sound. "The warren," she says. "Feel it, child. Something just went out of it." She has her hand flat on her chest. "For a breath, it was clean." She sits for a long time with the string in her lap and does not tie anything.` : ''}

By dawn there is nothing out there but the plain.`,
    ch:[{t:'Morning.', go:'b2_end'}]}),
  b2_end:()=>({sp:'The west bank · morning', scene:'b2_sekala', txt:
`The column sleeps.

All day, the way Bult said: forty thousand people lying in the shade of anything that throws one, on the west bank of a river with water in it, with the ford a trench behind them and Reloe ten days away and ten days back. The cattle go up into the hills to graze on what there is. Nobody counts anything, for a whole day, except you.

${chainC()} in the squad's stretch. ${chainW() > 0 ? `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'}, full of the Sekala.` : 'No skins worth the name.'} ${b2In('redblade') ? 'One Red Blade, polishing his scale.' : ''} ${b2In('haddat') ? `Haddat, asleep sitting up, with her shield across her knees and the green cloth${S.f.b2_ilharDoor === 'taken' ? ' in its grip' : ' that is not there'}, and a man from the water-sellers' quarter somewhere on the far side of the river, riding with the Tithansi, with a sister he jokes about.` : ''}

Aren. All the way to Aren.`,
    html:chainHTML('The Sekala · the day of rest'),
    ch:[{t:'Rest.', go:()=>chapterEnd(2, S.f.b2_c2_key || 'spring')}]}),
});
