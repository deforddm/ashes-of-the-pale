/* ============ Book Two, Chapter 1: Hissar Burns ============ */
/* The squad's night in Hissar, the Seventh's camp before dawn, and Bat'rol in the Vin'til Basin.
   Key (S.f.b2_key): 'daughters' (the promise kept, the carts went without them: water down, column up) or 'carts'
   (the garrison's water out through the gate, Ressan's girls left to the Wickans and their own luck). */

/* Tangle's count, in words: "Three sharpers, two burners, two cussers, two smokers" */
const b2Count = () => { const p = (n, s) => `${numw(n)} ${s}${n === 1 ? '' : 's'}`;
  const t = `${p(S.inv.sharper || 0, 'sharper')}, ${p(S.inv.burner || 0, 'burner')}, ${p(S.inv.cusser || 0, 'cusser')}, ${p(S.inv.smoker || 0, 'smoker')}`; return t[0].toUpperCase() + t.slice(1); };
const b2In = id => SQUAD().includes(id);
/* the daughters and the neighbour, by name */
const B2 = {elder:'Imra', younger:'Dessi', widow:'Yedda'};
/* the water and the column, as a sentence for the end screen and the journal */
const b2Chain = () => `${numw(chainW(), true)} skin${chainW() === 1 ? '' : 's'} of water, and ${chainC()} ${chainC() === 1 ? 'soul' : 'souls'} in the squad's stretch of the column`;

/* the water-sellers' trick (v4.7.1): earned from Ressan at his well; spent in dgRest and b2Drink (47) */
Object.assign(TRICKS, {
  b2_measure:{name:'The Water-Seller\'s Measure', ch:1, use:'chapter', n:2, where:'Ressan\'s well, the night Hissar burned',
    notWhy:{sathi:'won\'t sit still for an old man\'s lesson tonight'},
    lore:'Forty years of selling water by the cup in a city that never has enough: wet the mouth, not the throat; drink in the shade, never in the sun; a mouthful before the work, not after. A water-seller can walk a man three days on one skin, and charge him for four.',
    get fx(){ return `${trickTimes('b2_measure')} a chapter: a rest, or a drink before a midday fight, costs no water. The bearer shares the skin out the water-sellers' way. One more use from level 5.`; }},
});
const b2MeasureCh = () => ({t:'"Teach me what you know about making a skin last."', check:['wits',15], trick:'b2_measure', req:()=>!S.f.b2_measureTried, fx:()=>{ S.f.b2_measureTried = 1; },
  edges:id=>[id === 'haddat' && ['a water-seller\'s daughter: she grew up on it', 2], id === 'sgt' && ['a winter in his house', 1], id === 'marrow' && ['a healer knows thirst', 1], id === 'tangle' && ['he is watching the fire, not the old man', -1]],
  go:'b2_measure_ok', fail:'b2_measure_miss'});

const B2CH1 = {
  title:'Hissar Burns', number:'One',
  intro:{loc:'Hissar', sub:'Seven Cities · the night the city rose', scene:'b2_hissar_burning', cap:'The city from the garrison wall: roofs on fire in a ring, and the ring closing.',
    paras:[
`It started in the old city at dusk, with a single voice on a rooftop shouting a name, and by the second bell every roof between the river and the south gate had somebody on it shouting the same name back. *Whirlwind.* Nobody in the Hissar garrison has to ask whose.`,
`You are Sergeant {sgt}, Third Squad, Hissar garrison, the Seventh Army, and you have been six years in Seven Cities, which is long enough to know which wells are sweet and which way a crowd will run. Tonight the crowds are not running. They are walking, all of them, toward the garrison, with green cloth tied round their arms.`,
`The order came down the wall an hour ago: the garrison goes out to the Fist's camp beyond the south gate, and takes what it can carry. You have been carrying something else for six years. An old water-seller named Ressan, and a winter fever, and a promise. *If the city ever burns, come for my daughters first.*`],
    go:'Down off the wall', node:'b2_start'},

  areas:[
    /* 16 x 12.  . street  , ash  # wall  F fire  w the quarter cistern  c handcart  p palm  = market awning  D Haddat's family door  g the south lane */
    { id:'b2_quarter', title:'Hissar · the water-sellers\' quarter', sub:'Night · fires on the roofs', hint:'Tap ground to move · tap a figure to talk · the south lane goes to the gate', decor:'hissar', dark:true,
      map:[ "################",
            "#,.F##..##F#,..#",
            "#...##..##.#..w#",
            "#..............#",
            "#.p..=====...p.#",
            "#....=====.....#",
            "#,.............#",
            "##D##..c...##.##",
            "#....,....,....#",
            "#.F..........,.#",
            "#,....,...p....#",
            "#######gg#######" ],
      walk:'.,=', triggers:{D:'b2_door', w:'b2_cistern', g:'b2_to_gate'}, start:{x:8, y:9},
      quest:()=> S.f.b2_streetDone ? 'South, to the gate.' : !S.f.b2_ressan ? 'Ressan\'s house, at the top of the quarter.' : 'The south lane, to the gate. The green cloths are in the quarter.',
      npcs:[
        {id:'ressan', name:'Ressan', kind:'ressan', x:7, y:2, node:()=>S.f.b2_ressan ? 'b2_ressan_again' : 'b2_ressan', fresh:()=>!S.f.b2_ressan},
        {id:'imra', name:B2.elder, kind:'hissari_w', x:6, y:3, node:()=>'b2_imra', show:()=>!!S.f.b2_ressan || /^b2_imra/.test(S.node || ''), fresh:()=>!!S.f.b2_ressan && !S.f.b2_imra},
        {id:'dessi', name:B2.younger, kind:'child', x:8, y:3, node:()=>'b2_imra', show:()=>!!S.f.b2_ressan},
        {id:'yedda', name:B2.widow, kind:'hissari_w', x:11, y:6, node:()=>'b2_yedda', show:()=>!S.f.b2_yeddaGone || /^b2_yedda/.test(S.node || ''), fresh:()=>!S.f.b2_yedda} ] },

    /* 16 x 12.  , ash  # wall  F fire  = awning  p palm  c the water carts  ~ the gate channel  g the south gate */
    { id:'b2_gate', title:'Hissar · the south gate square', sub:'Night · the garrison pulling out', hint:'Tap ground to move · tap a figure to talk · the carts are by the channel', decor:'hissar', dark:true,
      map:[ "################",
            "#F.,#......#,.F#",
            "#...#..==..#...#",
            "#..............#",
            "#.p....,.....p.#",
            "#..cc......cc..#",
            "#..............#",
            "#,.....~~......#",
            "#.....,........#",
            "##............##",
            "###....gg....###",
            "################" ],
      walk:'.,=', triggers:{c:'b2_carts', g:'b2_gate_g'}, start:{x:7, y:2},
      quest:()=> S.f.b2_key ? 'The gate.' : S.f.b2_corporal ? 'The carts go in a bell. Somebody is running across the square toward you.' : 'The water carts. Find who is moving them.',
      npcs:[
        {id:'benth', name:'Corporal Benth', kind:'b2soldier', x:5, y:5, node:()=>S.f.b2_key ? 'b2_corporal_again' : 'b2_corporal', fresh:()=>!S.f.b2_corporal},
        {id:'priest', name:'A priest of Mael', kind:'priest', x:9, y:3, node:()=>'b2_rel', show:()=>!S.f.b2_relGone || /^b2_rel/.test(S.node || ''), fresh:()=>!S.f.b2_relSeen},
        {id:'gwickan', name:'A Wickan rider', kind:'wickan', x:12, y:8, node:()=>'b2_wickan_gate', fresh:()=>!S.f.b2_wickanGate} ] },

    /* 16 x 12.  . hardpan  , scrub  s sand  # rock  r low rock  = tent  F campfire  W wagon  h horse lines  b bones */
    { id:'b2_camp', title:'The Seventh\'s camp · outside Hissar', sub:'Before dawn · refugees still coming in', hint:'Tap ground to move · tap a figure to talk · the wagons march at first light', decor:'odhan_night', dark:true,
      map:[ "################",
            "#..==...=..hhh.#",
            "#..==...=..,...#",
            "#.......,......#",
            "#.=..F.....=...#",
            "#..........=...#",
            "#,..r....,.....#",
            "#.....W......b.#",
            "#..=.....F.....#",
            "#..=....,....,.#",
            "#.,.....s...ss.#",
            "################" ],
      walk:'.,s', triggers:{F:'b2_fire', h:'b2_horses', W:'b2_march'}, start:{x:7, y:10},
      quest:()=> !S.f.b2_bult ? 'Find whoever is giving out the column. An old Wickan, they say, laughing.' : 'First light. The wagons, when you are ready.',
      npcs:[
        {id:'bult', name:'Bult', kind:'bult', x:7, y:4, node:()=>S.f.b2_bult ? 'b2_bult_again' : 'b2_bult', fresh:()=>!S.f.b2_bult},
        {id:'coltaine', name:'Coltaine', kind:'coltaine', x:5, y:2, node:()=>'b2_coltaine', fresh:()=>!S.f.b2_coltaine},
        {id:'duiker', name:'The historian', kind:'duiker', x:12, y:5, node:()=>S.f.b2_duiker ? 'b2_duiker_again' : 'b2_duiker', fresh:()=>!S.f.b2_duiker},
        {id:'sormo', name:'Sormo E\'nath', kind:'sormo', x:13, y:3, node:()=>S.f.b2_sormo ? 'b2_sormo_again' : 'b2_sormo', fresh:()=>!S.f.b2_sormo},
        {id:'girls', name:B2.elder, kind:'hissari_w', x:11, y:9, node:()=>'b2_imra_camp', show:()=>S.f.b2_key === 'daughters', fresh:()=>S.f.b2_key === 'daughters' && !S.f.b2_imraCamp},
        {id:'crider', name:'A Weasel rider', kind:'wickan', x:10, y:7, node:()=>'b2_horses'} ] },

    /* 16 x 12.  . hardpan  , scrub  s sand  # rock  r low rock  x dead tree (the lip of the wash)  W the water wagon  b bones */
    { id:'b2_basin', title:'The Vin\'til Basin · south-west of Hissar', sub:'Day · heat · the column strung out behind', hint:'Tap ground to move · tap a figure to talk · the wash is east, by the dead tree', decor:'odhan',
      map:[ "################",
            "#ss,..r...,.ss.#",
            "#s...,....#...,#",
            "#..r.....##..x.#",
            "#.,.......#....#",
            "#....W.....,.b.#",
            "#,..........s..#",
            "#...,..r.......#",
            "#.s.....,....,.#",
            "#..b.........r.#",
            "#s..,.....,..ss#",
            "################" ],
      walk:'.,s', triggers:{x:'b2_wash', W:'b2_wagon'}, start:{x:2, y:7},
      quest:()=> S.f.b2_batrolDone ? 'They are running. Let them.' : !S.f.b2_duikerBasin ? 'Dust on the far rim. The historian is on the rise, watching it.' : 'Hold the flank by the dry wash. East, by the dead tree.',
      npcs:[
        {id:'bduiker', name:'Duiker', kind:'duiker', x:8, y:2, node:()=>'b2_duiker_basin', fresh:()=>!S.f.b2_duikerBasin},
        {id:'outrider', name:'A Weasel outrider', kind:'wickan', x:12, y:4, node:()=>S.f.b2_washRead != null ? 'b2_outrider_again' : 'b2_outrider', fresh:()=>S.f.b2_washRead == null},
        {id:'mother', name:'A woman with a child', kind:'hissari_w', x:3, y:6, node:()=>S.f.b2_mother ? 'b2_mother_again' : 'b2_mother', fresh:()=>!S.f.b2_mother} ] } ],

  battles:{
    /* the quarter: green cloths with a list, in the lane below Ressan's, then in the well court */
    b2_street:{title:'The south lane', style:'hissar', dark:true, warrenText:'Denul runs thin and wrong tonight · Meanas no better', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["#..##..#","#......#","..t..t..","........","#.#..#.#","........",".t....t.","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_rebel',1,1],['b2_rebel',6,1],['b2_rebel',4,3],['b2_rebelbow',6,0]], xp:100, after:'b2_after_street',
      preText:()=>`Tangle's sharper goes off against a mud-brick wall that has stood two hundred years and decides, all at once, not to. The ones under it stop being a line. Somewhere up the quarter a voice stops shouting the Whirlwind's name, mid-word.`,
      /* the second ground: the well court below Ressan's house, the well-head in the middle, and the man with the list */
      stage2:{title:'The well court', xp:40,
        text:()=>`The lane is clear, and the noise has gone up the quarter ahead of you. When you come round the corner into the well court there are more of them, and one of them has a paper.

He is reading from it by the light of a burning door. Names. Houses. The ones that sold water to the garrison${S.f.b2_ressan ? `, and you hear *Ressan* go by on the list, read out in the same voice as all the rest` : ''}.${b2In('haddat') ? ` Haddat goes very still beside you. Her family's name is on the list too, two lines down. Then he reads a third, and stops, and reads it again, and crosses it out.` : ''}`,
        map:["##....##","#..tt..#","........","#......#","..#..#..","........","#......#","........","........","##....##"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['b2_listman',4,2],['b2_rebel',1,3],['b2_rebel',6,3],['b2_rebelbow',3,0]],
        waves:[{round:2, foes:[['b2_rebel',0,5]], text:'Another green cloth comes over the court wall from the next lane, a cleaver in his fist.'}]} },
    /* the cistern: garrison men with their badges cut off, come for the quarter's water */
    b2_cistern:{title:'The quarter cistern', style:'hissar', dark:true, warrenText:'Denul runs thin and wrong tonight · Meanas no better', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["#.####.#","........","..t..t..","........","#......#","...##...","........","#......#","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_thief',2,1],['b2_thief',5,1],['b2_thief',1,3],['b2_thiefbow',6,0]], xp:60, after:'b2_cistern_after'},
    /* the south gate: hold it open while the rebels try to shut it, then take the winch room on the gatehouse stairs */
    b2_gate:{title:'The south gate', style:'hissar', dark:true, warrenText:'Denul runs thin and wrong tonight · Meanas no better', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["#..##..#","........","..t..t..","........","#......#","........",".t....t.","........","........","##....##"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_rebel',1,0],['b2_rebel',6,0],['b2_rebelbow',3,1]], xp:110, after:'b2_after_gate',
      objective:{type:'survive', rounds:3, text:'Hold the gate open for three rounds.'},
      waves:[{round:2, foes:[['b2_rebel',1,1],['b2_rebel',6,1]], text:'More green cloths come out of the side streets, at a run, shouting for the gate.'},
             {round:3, foes:[['b2_rebel',5,0]], text:'One more, with a torch, going for the gate timbers.'}],
      preText:()=>`The sharper goes off in the mouth of the street they came down, and the street remembers that it was a street of cloth-sellers. Awnings go up like paper. For a breath nobody comes through it at all.`,
      stage2:{title:'The gatehouse stairs', xp:50,
        text:()=>`The square holds. But the gate is coming down anyway: you can hear the chain going round the drum in the gatehouse above, a link at a time, somebody up there leaning on the winch.

The stair is one body wide and turns twice. ${b2In('haddat') ? `Haddat puts her shield up the stair in front of her and goes, and doesn't look back to see who follows. Everyone does.` : `Nobody wants to go first. Somebody has to.`}${b2In('tangle') ? ` Tangle, behind, says "Not on a stair. Not with that chain over us," before anybody has asked him for anything.` : ''}`,
        map:["#..t..##","#......#","###..###","#......#","#.##...#","#......#","###..###","#......#","#......#","##....##"],
        party:[[3,8],[4,8],[2,8],[5,8],[3,9],[4,9]],
        foes:[['b2_gatecapt',3,1],['b2_rebel',5,3],['b2_rebelbow',1,0],['b2_rebel',2,5]]} },
    /* Bat'rol: the squad's stretch of the flank, by the dry wash, as Reloe's army comes on */
    b2_batrol:{title:'Bat\'rol · the flank', style:'odhan', warrenText:'The basin under a white sky · Denul thin and wrong · Meanas no better', warren:{denul:.85, meanas:.85}, music:'battle',
      map:["...t....",".....#..",".t......","........","........","...tt...","........","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['b2_lancer',1,0],['b2_lancer',6,1],['b2_lancer',2,2],['b2_semk',4,1]], xp:150, after:'b2_after_batrol',
      waves:[{round:2, foes:[['b2_lancer',0,3],['b2_lancer',7,3]], text:'Two more come in wide on the flanks, whooping, lances down.'}],
      preText:()=>`Tangle's sharper was in the ground before they came, under a stone at the lip of the wash, with a long fuse and four notes hummed over it. He stops humming. The front of their charge goes up in a fan of grit and the rest of it has to go round, and green armies do not like going round.`,
      stage2:{title:'The dry wash', xp:80,
        text:()=>`The ones on the hardpan break, and do not run back the way they came. They run into the wash, which is where the rest of them were waiting: a dry channel between two banks of crumbling clay, a painted holy man at the head of it with his hands up, and a big man on foot with a feathered lance shouting them back into line.

${b2In('sathi') ? `Sathi laughs, high and short, and Hackle goes down the bank ahead of her. "The Weasels say: never follow anyone into a ditch," she says. "Then they follow everyone into a ditch."` : `Down the bank, then. Into the ditch.`}`,
        map:["##....##","#......#","#.#..#.#","#......#","##....##","#......#","#.t..t.#","#......#","........","........"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['b2_warleader',3,1],['b2_semk',6,1],['b2_lancer',1,3],['b2_lancer',6,3]],
        waves:[{round:2, foes:[['b2_lancer',0,8]], text:'A rider comes down the wash behind you, on foot now, his horse dead somewhere up the channel.'}]} } },

  foes:{
    /* green cloths: townsmen of Hissar with whatever blade the house had */
    b2_rebel:{name:'Green-cloth', sig:'r', kind:'rebel', hp:11, ac:12, atk:3, dmg:[1,6,1], rng:1, mv:4, init:1, verb:'hacks at'},
    b2_rebelbow:{name:'Green-cloth archer', sig:'a', kind:'rebel_bow', hp:8, ac:11, atk:3, dmg:[1,6,1], rng:5, mv:4, init:2, sk:['pin'], verb:'looses at'},
    /* the man with the list in the well court: reads names, and has a sword that is not a townsman's */
    b2_listman:{name:'The man with the list', sig:'L', kind:'rebel', hp:22, ac:13, atk:4, dmg:[1,8,2], rng:1, mv:4, init:2, sk:['parry'], verb:'cuts at'},
    /* the winch room: a big man at the top of a narrow stair, which is where a big man wants to be */
    b2_gatecapt:{name:'The man at the winch', sig:'W', kind:'rebel', hp:24, ac:13, atk:4, dmg:[1,10,1], rng:1, mv:3, init:1, sk:['shove'], verb:'swings a gate-bar at'},
    /* garrison men with the badges cut off, after the quarter's water */
    b2_thief:{name:'Garrison deserter', sig:'d', kind:'b2soldier', hp:12, ac:13, atk:4, dmg:[1,8,0], rng:1, mv:4, init:1, verb:'cuts at'},
    b2_thiefbow:{name:'Deserter crossbow', sig:'x', kind:'b2soldier', hp:8, ac:12, atk:3, dmg:[1,8,0], rng:5, mv:3, init:2, sk:['pin'], verb:'shoots at'},
    /* Reloe's green army: Odhan tribesmen, eager, unblooded */
    b2_lancer:{name:'Odhan lancer', sig:'l', kind:'tithansi', hp:13, ac:12, atk:4, dmg:[1,8,1], rng:1, mv:5, init:2, sk:['reach'], verb:'drives a lance at'},
    b2_semk:{name:'Painted holy man', sig:'s', kind:'semk', hp:10, ac:11, atk:4, dmg:[1,6,1], rng:4, mv:4, init:2, sk:['daze'], verb:'calls the Apocalypse down on'},
    b2_warleader:{name:'Odhan warleader', sig:'W', kind:'tithansi', hp:28, ac:14, atk:5, dmg:[1,10,2], rng:1, mv:5, init:3, boss:true, sk:['reach','rally'], verb:'brings a lance round on'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    b2_dipper:{name:'Ressan\'s dipper', slot:'trinket', who:null, hp:2, line:'A brass water-seller\'s dipper on a thong, the lip worn thin by forty years of other people\'s mouths. Ressan put it in the sergeant\'s hand at the well and closed the fingers over it.'},
    b2_lancehead:{name:'Odhan lance-head', slot:'trinket', who:null, atk:1, line:'A leaf-bladed iron head off a lance from the wash at Bat\'rol, the green rag still knotted under it. Nobody in the squad wants to untie the rag.'} },

  scenes:{
    b2_hissar_burning:{loc:'Hissar', sub:'From the garrison wall', cap:'Roofs on fire in a ring round the old city, and the ring closing, and on every roof somebody shouting one word.', amb:'city_night'},
    b2_well:{loc:'Hissar', sub:'Ressan\'s well court', cap:'A courtyard well with a wooden cover, two water jars by it, a burning door across the court, and an old man sitting on the well-head as if it were a throne.', amb:'city_night'},
    b2_coltaine_tent:{loc:'The Seventh\'s camp', sub:'The Fist\'s tent', cap:'One lamp, a map weighted with stones, a cloak of black feathers over a stool, and nobody sitting on the stool.', amb:'interior'},
    b2_odhan_dusk:{loc:'The Odhan', sub:'Dusk', cap:'The column strung out across the Odhan for a league and more, carts and cattle and people, and dust going up off all of it into a red sky.', amb:'dusk'},
    b2_odhan_day:{loc:'The Odhan', sub:'Day', cap:'Glare, and dust, and the column going on into both of them.', amb:'plain'},
    b2_basin:{loc:'The Vin\'til Basin', sub:'The basin floor', cap:'A wide pan of cracked clay under a white sky, a dry wash cut across it, and on the far rim, dust that is not the column\'s.', amb:'dusk'} },

  end:{
    daughters:['The promise kept', 'Hissar burned, and the sergeant went back into it for two girls from the water-sellers\' quarter while the garrison\'s water carts went out of the gate without the squad. The girls walk in the column now. Their father sat on his well-head and let them go. The squad has fewer skins than it should, and the sergeant has one promise kept and half of another.'],
    carts:['The water out', 'Hissar burned, and the squad brought the garrison\'s water carts out through the south gate while a boy ran back into the water-sellers\' quarter with the sergeant\'s word. The Wickans brought many citizens out of the city that night. The sergeant has not asked which ones. The squad has more water than it can easily carry, and walks beside it.'] },
  endScene:'b2_odhan_dusk',
  endCap:()=> S.f.b2_key === 'daughters' ? 'Dusk over the Vin\'til Basin. Two girls from the water-sellers\' quarter are asleep in the squad\'s stretch of the column, on a wagon-bed, holding hands.' : 'Dusk over the Vin\'til Basin. The water carts creak behind the squad, and the sergeant drinks slowly, as always, and looks back the way the column came.',
  tease:'Next: Dryj Spring. Coltaine leaves the refugees at the spring and rides for water, the Odhan fills with Tithansi, and beyond them, the river at the Sekala.',

  extras:()=>{ const f = S.f, x = [];
    x.push(`The squad came out of the basin with ${b2Chain()}.`);
    if (f.b2_key === 'daughters') x.push(`${B2.elder} and ${B2.younger}, Ressan's daughters, walk in the column. Ressan stayed with his wells.${f.b2_dipper ? ' His dipper hangs round a soldier\'s neck now.' : ''}`);
    if (f.b2_key === 'carts') x.push(`Ressan's daughters were at the well when the water carts went out. Bult says the Weasels brought in a great deal of the city on their saddles. Nobody has said more than that.`);
    if (f.b2_ilharDoor === 'left') x.push('A green cloth is still tied to a door in the water-sellers\' quarter. Haddat left it there. It may be keeping the house standing.');
    if (f.b2_ilharDoor === 'taken') x.push('Haddat cut a green cloth off her family\'s door and carries it folded in her shield grip. She has not said whose arm it came off.');
    if (f.b2_yedda) x.push(`${B2.widow}, a ropemaker's widow, came out of the quarter behind the squad with her two grandsons and a handcart.`);
    if (f.b2_cistern === 'blown') x.push('Tangle blew the grille off the quarter cistern. One sharper, gone for good. He has said the number out loud twice since.');
    if (f.b2_cistern === 'talked') x.push('The cistern warden opened his grille for Haddat, and blessed the squad in a dialect nobody else understood.');
    if (f.b2_cistern === 'fought') x.push('Garrison men with their badges cut off came for the quarter\'s water. They did not get it.');
    if (f.b2_relSeen) x.push('A priest of Mael went out of Hissar ahead of everyone, on Coltaine\'s order, and blessed the squad on his way past. Hackle did not like him.');
    if (f.b2_sathiCrows) x.push('Sathi saw crows come down over Coltaine\'s tent before dawn, and has decided it means something.');
    if (f.b2_sormo) x.push('Sormo E\'nath told Marrow the warrens are sick. She already knew. She has started a second string.');
    if (f.b2_duikerTold) x.push('The Imperial Historian has the night in his notebook, in the sergeant\'s words.');
    if (f.b2_mother === 'gave') x.push('A skin of the squad\'s water went to a woman with a child, in the basin. She is still walking in the squad\'s stretch.');
    if (f.b2_mother === 'refused') x.push('A woman with a child went looking for water in another stretch of the column. The squad\'s stretch is three shorter.');
    if (preUsed('b2_batrol')) x.push('Tangle buried a sharper at the lip of the wash at Bat\'rol, and it went where he meant it to. He wants that written down.');
    return x; },

  journal:()=>{ const f = S.f; return [
    f.b2_batrolDone && `Bat'rol. Reloe's green army broke in the Vin'til Basin and ran for Meila Oasis. The squad held its stretch of the flank by the dry wash.`,
    f.b2_reloe && `Kamist Reloe, a High Mage of Seven Cities everyone thought dead, leads the army that came at the column in the basin.`,
    f.b2_bult && `Bult, Coltaine's uncle, gave the squad a stretch of the column: "You own these." The squad counts them every halt.`,
    f.b2_sathiCrows && `Sathi saw crows settle over Coltaine's tent the night Hissar burned. She says it means something. She will not say what.`,
    f.b2_sormo && `Sormo E'nath told Marrow the warrens are sick, all across Seven Cities. Marrow keeps a knotted string: a knot for every healing that took.`,
    f.b2_key === 'daughters' && `${B2.elder} and ${B2.younger} came out of Hissar with the squad. Ressan would not leave his wells.`,
    f.b2_key === 'carts' && `The squad brought the garrison's water out through the south gate. Ressan's daughters were left at the well, to the Wickans and their own luck.`,
    f.b2_ilharDoor && `A green cloth was tied to the door of Haddat's family house. Her brother Ilhar rode out of Hissar two nights before it fell with one on his arm.`,
    f.b2_ressan && `Ressan, the water-seller who nursed the sergeant through a winter fever, will not leave his wells. "A water-seller does not leave his wells."`,
    `Hissar has risen for the Whirlwind. The garrison is going out to Coltaine's camp beyond the south gate.`].filter(Boolean); },

  dlg:{
    /* ---- opening: the foot of the garrison stair ---- */
    b2_start:()=>({sp:'The garrison stair', scene:'b2_hissar_burning', fx:()=>{ S.f.b2_started = 1; }, txt:
`The squad is at the foot of the wall stair, where you told it to be, which in this city tonight is worth more than it sounds.

Haddat has her shield on her arm and her head-cloth down over her mouth against the smoke. She is looking north, toward the water-sellers' quarter, where she was born, and not saying so. Sathi is crouched against the wall with one hand in Hackle's ruff, talking to the dog in Wickan, low and fast. Hackle is listening. Tangle has the satchel open on his knee and is counting it by touch. Marrow is sitting on the bottom step, because there is a step.

"Sergeant." Haddat, in Hissari, which makes it an oath. "The quarter is that way. The gate is the other way. I tell you so you will have heard it from someone."`,
      ch:[{t:'"The quarter. Ressan first. Then the gate."', go:()=>startExplore()},
          {t:'"Tangle. Count."', req:()=>!S.f.b2_askTangle, fx:()=>{ S.f.b2_askTangle = 1; }, go:'b2_start_tangle'},
          {t:'"Marrow. How is it tonight?"', req:()=>!S.f.b2_askMarrow, fx:()=>{ S.f.b2_askMarrow = 1; }, go:'b2_start_marrow'}]}),
    b2_start_tangle:()=>({sp:'Tangle', scene:'b2_hissar_burning', txt:
`He doesn't look up. Four notes, hummed, the same four he always hums, and then he stops.

"${b2Count()}. Same as this morning. Same as it'll be at Aren, Sergeant, less what you make me throw between here and there." He buckles the satchel. "There's no Moranth this side of the sea. I want that understood before anyone points at anything."

${S.loy.tangle >= 1 ? `Then, quieter: "I'll throw it for the right thing. You just have to tell me which thing's the right one. I'm a sapper. I don't decide."` : `Sathi, to the dog, in Wickan. Haddat's mouth moves, which on Haddat is a laugh. Tangle doesn't ask.`}`,
      ch:[{t:'"Marrow. How is it tonight?"', req:()=>!S.f.b2_askMarrow, fx:()=>{ S.f.b2_askMarrow = 1; }, go:'b2_start_marrow'},
          {t:'"The quarter. Move."', go:()=>startExplore()}]}),
    b2_start_marrow:()=>({sp:'Marrow', scene:'b2_hissar_burning', txt:
`"Thin." She doesn't get up. "Thin and greasy, like soup somebody's been boiling bones in for a month. I reached in an hour ago for a boy on the wall with a cut hand and it came back to me smelling of fur."

She holds up the string. Knots along it, a good many, close together at one end and further apart toward the other. "Since spring, child. The knots are getting further apart. I don't know what that means. I know I don't like it."

${b2In('sathi') ? `Sathi says something to Hackle. Haddat, without turning round: "She says the dog smells it too." Sathi glares at her for translating.` : `Nobody says anything to that.`}`,
      ch:[{t:'"Tangle. Count."', req:()=>!S.f.b2_askTangle, fx:()=>{ S.f.b2_askTangle = 1; }, go:'b2_start_tangle'},
          {t:'"The quarter. Move."', go:()=>startExplore()}]}),

    /* ---- Ressan, on his well-head ---- */
    b2_ressan:()=>({sp:'Ressan · water-seller', scene:'b2_well', fx:()=>{ S.f.b2_ressan = 1; }, txt:
`The court behind Ressan's house is the way you remember it from the winter you lay in the room over it: a well with a wooden cover, two big jars sweating in the dark, a fig tree that has never fruited. The difference is the door across the court, which is on fire, and the old man sitting on the well-cover with his stick across his knees, watching it burn.

"Soldier." He knew your step before he turned his head. He always did. "You came. Good. I told them you would come, and the little one said you had forgotten, and I said, a soldier who has been fed by a house does not forget the house. Sit."

His daughters are in the doorway behind him. ${B2.elder}, the elder, is nineteen now and has her mother's way of standing with her arms folded, as if the night had been rude to her. ${B2.younger} is nine and has a water jar in both arms that is half as big as she is. She is not putting it down.

"I know why you are here," Ressan says. "I am not coming."`,
      ch:[{t:'"The city is burning, Ressan. All of you. Now."', go:'b2_ressan_argue'},
          {t:'Remind him of the winter, and what he asked of you then.', check:['guile',13],
            edges:id=>[id === 'haddat' && ['Haddat\'s family sold water two streets over', 2], id === 'sathi' && ['he does not know her, and she does not care', -1], id === 'marrow' && ['Marrow nursed fevers like his', 1]],
            near:{t:'He gives his word for the girls. But he gives it to the fire, not to you, and his hand on the stick does not open.'},
            clean:{t:'He closes your fingers round something brass, and does not let go for a long breath.', fx:()=>{ gain('b2_dipper'); S.f.b2_dipper = 1; }},
            go:'b2_ressan_promise', fail:'b2_ressan_argue'},
          {t:'Sit down on the well-cover beside him.', fx:()=>{ S.f.b2_sat = 1; if (b2In('haddat')) loy('haddat', 1); }, go:'b2_ressan_promise'},
          b2MeasureCh()]}),
    b2_ressan_argue:()=>({sp:'Ressan', scene:'b2_well', txt:
`He listens to all of it. He was always a good listener; you told him a great many things that winter, with the fever in you, that you have never told anyone since.

"A water-seller does not leave his wells." He says it the way you would say the name of your regiment. "My father sat on this cover when the Emperor's soldiers came, the first time, and nobody came for him, and the well was here in the morning. The Whirlwind will want water. Everyone wants water. A man who sells it does not need a god."

He taps the stick on the stones, once. "The girls are another thing. The girls are why I asked."`,
      ch:[{t:'"Then the girls."', go:'b2_ressan_promise'}]}),
    b2_ressan_promise:()=>({sp:'Ressan', scene:'b2_well', txt:
`${S.f.b2_sat ? `You sit. The well-cover is warm from the burning door. For a while neither of you says anything, and it is the most like that winter that anything has been in six years.

` : ''}"${B2.elder}." He doesn't raise his voice. She comes. "You will go with the soldier. You and your sister."

"No." ${B2.elder} has her arms folded. "Not while you sit there like a fool on a box. I'll get him moving, Sergeant. Give me until the carts go. If he won't come, I'll bring ${B2.younger}. If he will, I'll bring them both." She looks at you the way she looked at you when you were sick in her house and complaining about the soup. "The garrison's going out by the south gate. Everybody knows. Wait for us there."

Ressan sighs, the long sigh of a man whose daughters have always won. "You see," he says to you. "This is what I have been living with."${S.f.b2_dipper ? `

Under his hand, on your knee, the brass of the dipper is still warm.` : ''}`,
      ch:[{t:'"The south gate. Before the carts go."', fx:()=>{ S.f.b2_wait = 1; }, go:()=>startExplore()},
          {t:`"${B2.elder}. Now. Not in a bell. Now."`, go:'b2_imra'}]}),
    b2_ressan_again:()=>({sp:'Ressan', scene:'b2_well', txt: S.f.b2_streetDone ?
`He is still on the well-cover. The door across the court has burned down to its frame, and the frame is still standing, which he seems to find interesting.

"The lane is quiet," he says. "You did that. ${B2.elder} says the gate. Go to the gate, soldier. You have been standing in my court long enough to be charged for the water."` :
`He is still on the well-cover. "The gate, soldier," he says, without looking round. "My daughter has given you your orders. She gives very good orders. I have been taking them for nineteen years."`,
      ch:[b2MeasureCh(), {t:'Leave him to his well.', go:()=>startExplore()}]}),
    b2_measure_ok:()=>({sp:'Ressan', scene:'b2_well', txt:
`Ressan looks at ${by({sgt:'you', haddat:'Haddat', _:'{who}'})} for a long moment, the way he used to look at a coin before he took it.

"Everyone asks how to find water," he says. "Nobody asks how to keep it." He takes the brass cup off its hook on the well-post and holds it up. "The mouth, not the throat. You wet the mouth, the throat believes you. In the shade, never the sun: the sun drinks half of what you swallow. A mouthful before the work, never after, because after the work you will drink the whole skin and still want it." He fills the cup, and drinks a third of it, and holds it out. "Three of these is a day. Four if you are carrying something. Five if you are a fool."

${by({haddat:`Haddat takes the cup and drinks exactly a third of it, and Ressan laughs out loud, for the first time tonight. "Somebody's daughter," he says. "I know the hand."`, sgt:`You drink a third and hand it back. "You remember," he says. "Good. Fever is a long lesson."`, _:`{who} drinks a third and hands it back, and Ressan nods as if a sale had gone through.`})}`,
      ch:[{t:'Thank him.', go:()=>startExplore()}]}),
    b2_measure_miss:()=>({sp:'Ressan', scene:'b2_well', txt:
`Ressan begins to tell ${by({sgt:'you', _:'{who}'})}, and a roof falls in two streets over, and the whole court flinches, and when it is quiet again he has lost the thread and is looking at the burning door.

"Another time," he says. "There will be another time. There is always more thirst." He does not believe it, and neither do you.`,
      ch:[{t:'Leave him to his well.', go:()=>startExplore()}]}),
    b2_imra:()=>({sp:B2.elder, scene:'b2_well', fx:()=>{ S.f.b2_imra = 1; }, txt:
`She doesn't move from the doorway. Behind her ${B2.younger} still has the jar in both arms.

"Now," ${B2.elder} says, "is when he is sitting on a well with a stick and a burning house and two hundred years of grandfathers. Now is when I would have to carry him." She lowers her voice. "He will come, Sergeant. He has to be let to decide it. That is the only way he has ever done anything, and he is too old to learn a new one tonight."

${B2.younger}, from behind her: "I'm bringing the jar."

"You're bringing the jar," ${B2.elder} agrees, without looking round. "Go to the gate, Sergeant. Before the carts. We'll be there."${b2In('sathi') ? `

Sathi has been watching ${B2.younger} and the jar. She says something to Hackle in Wickan, and the dog goes and sits by the child's feet, and the child, after a moment, lets go of the jar with one hand to put it on the dog.` : ''}`,
      ch:[{t:'"Before the carts."', fx:()=>{ S.f.b2_wait = 1; }, go:()=>startExplore()}]}),

    /* ---- the ropemaker's widow, and her handcart ---- */
    b2_yedda:()=>({sp:B2.widow + ' · a ropemaker\'s widow', fx:()=>{ S.f.b2_yeddaMet = 1; }, txt:
`A woman of sixty with a handcart, two small boys, and a coil of rope on the cart the size of a cartwheel, which she is sitting on to keep anyone else from sitting on it. The boys are holding the handles. They are not going anywhere. Nobody has told them where.

"Soldier." She knows the uniform; everyone in the quarter does. "Is it true the Empire is leaving?"

${b2In('haddat') ? `Haddat answers her before you can, in the quarter's own Hissari, the one with the swallowed endings. The old woman looks at her for a long time. "You are Bethra's girl," she says. "The one who went for a soldier." Haddat says yes. ${B2.widow} spits, carefully, to one side, and then nods as if that were settled.` : `You tell her the truth. She takes it the way the quarter takes everything, as if she'd known it was coming and had been waiting for someone to be rude enough to say so.`}`,
      ch:[{t:'"Bring the cart. Walk behind us. Keep up."', fx:()=>{ S.f.b2_yedda = 1; S.f.b2_yeddaGone = 1; chain(0, 3, B2.widow + ' and her grandsons'); }, go:'b2_yedda_come'},
          {t:'"The Wickans are riding the quarters. Go to the horsemen, not the gate."', fx:()=>{ S.f.b2_yeddaGone = 1; }, go:'b2_yedda_wickans'}]}),
    b2_yedda_come:()=>({sp:B2.widow, txt:
`She gets off the rope. "Pesh. Arin. Push." The boys push. The cart does not move. Haddat puts one hand on the back of it and it moves.

"I'll walk where I like," ${B2.widow} says. "Behind you is where I like. That is a coincidence."

She has a water jar of her own on the cart, wedged in the coil, and a sack of something, and two boys, and opinions. The column has started, and it has started here.`,
      ch:[{t:'On.', go:()=>startExplore()}]}),
    b2_yedda_wickans:()=>({sp:B2.widow, txt:
`She looks at you as if you'd told her to go and stand in the river. "Horsemen. Savages from the north who eat their dogs."

"They don't eat dogs," Sathi says, which is more than she has said to anyone in Hissar in a week. Hackle wags.

${B2.widow} looks at the dog, and at the girl, and at you. Then she gets off the rope, says "Pesh. Arin. Push," and goes off up the quarter toward the sound of hooves, with the cart and the boys and the coil, and doesn't look back. You hope the Wickans find her. You think they will. She is not a small thing to miss.`,
      ch:[{t:'On.', go:()=>startExplore()}]}),

    /* ---- Haddat's family door ---- */
    b2_door:()=> S.f.b2_ilharDoor ? {sp:'A door in the quarter', txt:
`The door of Haddat's family house. ${S.f.b2_ilharDoor === 'left' ? 'The green cloth is still on the latch.' : 'The latch is bare now, and the nail-hole where the knot was.'} Haddat doesn't look at it as you pass. She doesn't have to.`,
      ch:[{t:'Walk on.', go:()=>startExplore()}]} : {sp:'A door in the quarter', fx:()=>{ S.f.b2_doorSeen = 1; }, txt:
`${b2In('haddat') ? `Haddat stops. She doesn't say *this is my mother's house*. She doesn't have to; she stops the way people stop at their mother's house.` : `A house with its shutters closed and its water jars taken in, which in this quarter means the family has gone.`}

The shutters are closed. The jars that should be by the step are gone. Every other door on the street has been kicked in or burned, and this one hasn't, and the reason is on the latch: a strip of green cloth, knotted twice, the way a man ties a thing he expects to have to untie in a hurry.

${b2In('haddat') ? `"Ilhar." She says it to the door. It is the first time you have heard her say her brother's name since he rode out of the city, two nights before it fell, with a cloth just like that one round his arm. "He came back. He came back and tied that on our door so they'd leave it standing. And then he went again."

She puts her hand out to it. Then she doesn't touch it.` : `Somebody marked this house to be spared. Somebody who knew the mark.`}`,
      ch:[{t:'"Leave it. It\'s keeping the house standing."', fx:()=>{ S.f.b2_ilharDoor = 'left'; }, go:'b2_door_left'},
          {t:'"Your door, Haddat. Your call."', req:()=>b2In('haddat'), fx:()=>{ S.f.b2_ilharDoor = 'taken'; S.f.b2_doorHers = 1; loy('haddat', 1); }, go:'b2_door_taken'},
          {t:'Cut it off the latch.', fx:()=>{ S.f.b2_ilharDoor = 'taken'; if (b2In('haddat')) loy('haddat', -1); }, go:'b2_door_taken'}]},
    b2_door_left:()=>({sp:'Haddat', txt:
`${b2In('haddat') ? `She takes her hand back. "Yes," she says. "It is keeping the house standing." She says it in Malazan, carefully, as if she were reporting it.

Then, in Hissari, so quietly you almost don't hear: "Brother. You fool." And she walks on, and doesn't look back at the door, and her shield is a hand's width higher on her arm than it was.` : `You leave it. The house stays standing. Somebody wanted it to.`}`,
      ch:[{t:'On.', go:()=>startExplore()}]}),
    b2_door_taken:()=>({sp:'Haddat', txt:
`${b2In('haddat') ? `${S.f.b2_doorHers ? 'She looks at you for a long moment, as if you had handed her something heavy. Then she decides.' : 'She looks at you for a long moment. Then she does it herself, so that nobody else will have.'} Her boot knife goes through the knot in one cut. She folds the cloth twice, small, and pushes it into the grip of her shield, under the blue thread from her mother's veil, and the two colours sit there together.

"If they burn it," she says, "they burn it. It was never his to save." She doesn't look at the door again. You notice that she doesn't. She notices you noticing, and says nothing about it, which is how Haddat says thank you, and also how she says the other thing.` : `The cloth comes away. The door is just a door now. In this quarter, tonight, that may not be enough.`}`,
      ch:[{t:'On.', go:()=>startExplore()}]}),

    /* ---- the quarter cistern ---- */
    b2_cistern:()=> S.f.b2_cistern ? {sp:'The quarter cistern', txt:
`The grille ${S.f.b2_cistern === 'blown' ? 'is a twist of black iron in the gutter' : 'stands open'}. The water down there is the colour of the sky, which tonight is orange.`,
      ch:[{t:'Leave it.', go:()=>startExplore()}]} : {sp:'The quarter cistern', fx:()=>{ S.f.b2_cisternSeen = 1; }, txt:
`The quarter's cistern is under the street, behind an iron grille as thick as your wrist, with a stair going down into the cool. Every summer of your six in Hissar, the water-sellers have drawn from it by the jar, and paid the warden by the jar, and argued with him by the jar.

The warden is behind the grille now, on the top step, with the key on a cord round his neck and a lamp at his feet. He is very old and very frightened and has not moved since the shouting started, because his whole life has been the grille, and the grille is shut.

Water. The squad has ${numw(chainW())} skin${chainW() === 1 ? '' : 's'}. Down there is more than a squad could carry in a year.`,
      ch:[{t:'Haddat talks to the warden, in the quarter\'s Hissari.', check:['guile',13], req:()=>b2In('haddat'), not:['sgt','sathi','tangle','marrow'],
            edges:id=>[S.f.b2_ressan && ['he knows Ressan\'s soldier', 1], S.f.b2_ilharDoor === 'taken' && ['a green cloth in her shield grip', -1]],
            go:'b2_cistern_talk', fail:'b2_cistern_thieves'},
          {t:'Tangle looks at the hinges.', tag:'uses 1 sharper', req:()=>b2In('tangle') && S.inv.sharper > 0, go:'b2_cistern_blow'},
          {t:'Leave the old man his grille.', go:()=>startExplore()}]},
    b2_cistern_talk:()=>({sp:'The cistern warden', fx:()=>{ S.f.b2_cistern = 'talked'; chain(2, 0, 'The quarter cistern'); }, txt:
`Haddat crouches by the grille so her face is level with his, and talks. You get one word in five. Her mother's name. Ressan's. The word for *thirst*, which in the quarter's Hissari is also the word for *debt*.

The warden looks at her for a long time. Then he takes the cord off his neck, with both hands, as if it were heavier than it is, and gives her the key through the bars.

He says something you don't follow at all, long and sing-song, with his hand over his heart. Haddat bows her head. "He says the water knows its own," she says, filling the skins. "It is a blessing. It is also a complaint about the price."`,
      ch:[{t:'On.', go:()=>startExplore()}]}),
    b2_cistern_blow:()=>({sp:'Tangle', txt:
`He looks at the hinges for a long time. He looks at the warden. The warden looks at the satchel.

"Old man." Tangle, gently, in bad Hissari. "Down the stairs. All the way. Hands over your ears." He waits until the lamp has gone down out of sight. Then he hums the four notes, twice, and wedges the sharper behind the lower hinge, and stops humming.

"One sharper," he says. "Gone for good. I want everyone to have heard me say it."`,
      ch:[{t:'"Heard. Do it."', fx:()=>{ S.inv.sharper--; S.f.b2_cistern = 'blown'; chain(3, 0, 'The quarter cistern'); }, go:'b2_cistern_blown'},
          {t:'"Not for water. Keep it."', go:()=>startExplore()}]}),
    b2_cistern_blown:()=>({sp:'The quarter cistern', txt:
`The grille goes into the gutter in one piece, smoking, and the bang goes away up the quarter and comes back off every wall.

Down the stair, the warden is sitting on the bottom step with his hands still over his ears and his mouth open. He doesn't say anything while you fill the skins. When you're done, he says, very clearly, in Malazan: "*Thank* you." It is the worst thing anyone has said to Tangle all summer.

The skins are cold and heavy and the squad carries them like infants.`,
      ch:[{t:'On.', go:()=>startExplore()}]}),
    b2_cistern_thieves:()=>({sp:'The quarter cistern', txt:
`Haddat talks, and the warden listens, and shakes his head, and keeps shaking it, and then stops, because he is looking past her up the street.

Men are coming down it with jars. Malazan kit, garrison issue, the badges cut off clean and the threads still hanging. Somebody in the garrison has decided the Empire is leaving and they aren't, and they've decided to be thirsty first.

"Hissari," one of them says, looking at Haddat. Then at you: "Sergeant. Walk on. It's only water."`,
      ch:[{t:'"It\'s the quarter\'s water."', go:()=>startBattle('b2_cistern', {})},
          {t:'Walk on.', fx:()=>{ S.f.b2_cisternLet = 1; if (b2In('haddat')) loy('haddat', -1); }, go:()=>startExplore()}]}),
    b2_cistern_after:()=>({sp:'The quarter cistern', fx:()=>{ S.f.b2_cistern = 'fought'; chain(2, 0, 'The quarter cistern'); }, txt:
`The warden comes up the stair when it's over, slowly, and looks at the men in garrison kit lying in his street, and then at you, in the same kit.

He doesn't say anything. He opens the grille. You fill the skins. Haddat says something to him in Hissari that sounds like an apology and isn't one, and he nods as if it were.

${b2In('marrow') ? `Marrow goes to the one who's still breathing and kneels by him, knees first, slowly. She ties no knot. "The warren didn't want him," she says, getting up. "Or it did, and not the way I asked."` : `Nobody looks at the faces.`}`,
      ch:[{t:'On.', go:()=>startExplore()}]}),

    /* ---- the south lane: the green cloths with the list ---- */
    b2_to_gate:()=> S.f.b2_ressan && !S.f.b2_doorSeen && b2In('haddat') ? {sp:'The south lane', txt:
`At the top of the lane Haddat stops, without a word, outside a house two doors from the corner. She doesn't call you. She just stops, and the squad stops with her.`,
      ch:[{t:'The door.', go:'b2_door'}]} : !S.f.b2_ressan ? {sp:'The south lane', txt:
`The lane down to the south gate. ${b2In('haddat') ? `Haddat stands in the mouth of it, and does not move. "Ressan first," she says. "You said."` : `Ressan first. You said.`}`,
      ch:[{t:'"Ressan first."', go:()=>startExplore()}]} : S.f.b2_streetDone ? {sp:'The south lane', txt:
`The lane is empty now except for what the squad left in it. At the bottom of it, past the well court, the square inside the south gate is full of noise and torchlight and carts.`,
      ch:[{t:'Down to the gate.', go:()=>{ startExplore('b2_gate'); talk('b2_gate_arrive'); }},
          {t:'Not yet.'}]} : {sp:'The south lane', fx:()=>{ S.f.b2_lane = 1; }, txt:
`The lane drops toward the gate between blind walls. Halfway down it there are a dozen people where nobody should be, with green cloth tied round their arms and torches in their hands, and kitchen knives, and a cleaver, and one bow.

They are not running anywhere. They are standing in front of a door, and the door has a number chalked on it, and one of them is chalking the next.

${b2In('haddat') ? `"They're marking the garrison's people," Haddat says. "The ones who sold to us." Her voice doesn't change. "That's a water-seller's door."` : `They're marking doors.`}${b2In('sathi') ? ` Hackle's lip is up off his teeth. Sathi has an arrow on the string and hasn't decided where to put it yet, which for Sathi is restraint.` : ''}`,
      ch:[{t:'"Shields. Down the lane."', go:()=>startBattle('b2_street', {})},
          {t:'Tangle rolls a sharper down the lane ahead of you.', tag:'uses 1 sharper', req:()=>S.inv.sharper > 0 && b2In('tangle'), fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('b2_street', {pre:`Tangle hums four notes, stops, and bowls a sharper down the lane underarm, the way a boy rolls a ball. It goes off against the far wall.`})},
          {t:'Sathi and Hackle go round by the roofs.', check:['guile',14], req:()=>b2In('sathi'),
            edges:id=>[id === 'sathi' && ['Hackle goes first', 2], id === 'haddat' && ['she knows these roofs', 1]],
            go:'b2_lane_round', fail:'b2_lane_seen'},
          {t:'Not yet.'}]},
    b2_lane_round:()=>({sp:'The south lane', fx:()=>{ S.f.b2_laneRound = ROLL().who || 'sgt'; }, txt:
`${by({sathi:`Sathi goes up a drainpipe the way other people go up a stair, and Hackle goes up the woodpile beside it, and neither of them makes a sound. A minute later there is a Wickan arrow in the man with the chalk, and a dog on the archer, and the lane turns round to see where they came from.`,
  haddat:`Haddat knows these roofs. She was a girl on them. She takes Sathi and the dog over the bakehouse and the dyer's and down behind the green cloths, and the first they know of it is a tulwar.`,
  sgt:`You go over the roofs with Sathi and the dog, slower than they'd like, and come down behind the green cloths, and the first they know of it is the dog.`,
  _:`{who} takes Sathi and the dog over the roofs and down behind the green cloths, and the first they know of it is the dog.`})}

The rest of the squad comes down the lane at a run while they're still turning round.`,
      ch:[{t:'Into them.', go:()=>startBattle('b2_street', {surprise:'p'})}]}),
    b2_lane_seen:()=>({sp:'The south lane', txt:
`A tile goes. One tile, off the edge of the dyer's roof, into the lane, where it breaks in the quiet like a plate.

Every face in the lane turns up. The man with the chalk points. The bow comes up. ${b2In('sathi') ? `Sathi, on the ridge, says one word in Wickan which Haddat refuses afterward to translate.` : ''}`,
      ch:[{t:'Into them anyway.', go:()=>startBattle('b2_street', {surprise:'e'})}]}),
    b2_after_street:()=>({sp:'The well court', scene:'b2_well', fx:()=>{ S.f.b2_streetDone = 1; S.f.b2_listSeen = 1; }, txt:
`The well court is quiet. The burning door has burned down to its frame. The man with the list is on his back by the well-head, and the list is under his hand.

${b2In('haddat') ? `Haddat picks it up. She reads it by the light of the frame, all of it, top to bottom, the way she counts the dead in a column. Her family's name is on it. Somebody has drawn a line through it, in a different hand, carefully.${S.f.b2_ilharDoor ? ` She knows whose hand. So do you.` : ` She doesn't say whose hand. She folds the paper and puts it in her coat.`}

"Ressan's is on it," she says. "Not crossed out."` : `The list is names and houses. The water-sellers who sold to the garrison. Ressan's is on it. Nobody has crossed it out.`}

${b2In('marrow') ? `Marrow is sitting on the edge of the well, because it's there. She ties a knot in her string, and then sits looking at the empty length after it. "One," she says. "Out of three I reached for. Don't ask me which."` : ''}`,
      ch:[{t:'"The gate. Now."', go:()=>startExplore()}]}),
    /* ---- the square inside the south gate ---- */
    b2_gate_arrive:()=>({sp:'The south gate square', fx:()=>{ S.f.b2_gateIn = 1; }, txt:
`The square inside the south gate is the only place in Hissar tonight where anybody is giving orders and anybody else is taking them. Torches on poles. Garrison men in twos and threes, coming in from every street with whatever they could carry, and going out through the gate in a long sullen file toward the dark where the Fist's camp is. The gate is open. Somebody has wedged it open with a cart-axle, which tells you what somebody thinks of the gate's chances.

By the channel there are water carts: four of them, big-wheeled, each with a barrel on its bed the size of a hut, and not one ox between them.

${b2In('tangle') ? `Tangle looks at the gate, and up at the gatehouse over it, and at the chain hanging from the gatehouse to the gate, and stops humming. "Somebody ought to be up there," he says. "Somebody's going to be."` : `Somebody ought to be up in the gatehouse. You can't see who is.`}`,
      ch:[{t:'Look for whoever has the carts.', go:()=>startExplore()}]}),
    b2_carts:()=>({sp:'The water carts', txt: S.f.b2_key === 'carts' ?
`The carts. Four barrels, and the squad's name on all of them now, as far as Corporal Benth is concerned. Haddat has a hand on the nearest wheel as if it might try to leave without her.` : S.f.b2_key === 'daughters' ?
`Where the carts were, wheel-ruts in the ash going out through the gate. Benth got one away, with a mule he found somewhere. The other three are still here, barrels and all, with nobody to pull them, and they'll be here in the morning for whoever owns the city.` :
`Four big-wheeled carts with a barrel on each bed, water sloshing in the dark, the garrison's whole reserve for a march. No oxen. No drivers. A corporal with a lantern and a slate is walking round them, counting them, as if they might have changed.`,
      ch:[{t:'The corporal.', req:()=>!S.f.b2_key, go:'b2_corporal'},
          {t:'Leave them.', go:()=>startExplore()}]}),
    b2_corporal:()=>({sp:'Corporal Benth · the garrison stores', fx:()=>{ S.f.b2_corporal = 1; }, txt:
`Benth. You know him: the garrison stores, a fat careful man who once made you sign for a single bootlace. He has a slate and a stub of chalk and no oxen.

"Sergeant." He sounds like a man who has been waiting all night for somebody he could say it to. "Water. The garrison's. Fist's orders: it goes out with the garrison, in a bell, by the Fist's own count. Drivers ran at the second bell. Oxen were in the north yards and the north yards are burning." He taps the slate. "Four barrels. A squad on the shafts could move them. A squad that wanted to. There won't be another drop out of this city that the Whirlwind hasn't spat in, Sergeant."

${b2In('marrow') ? `Marrow, beside you, very quietly: "That's a great deal of water, child."` : `It is a great deal of water.`}

And then, across the square, somebody is shouting your name.`,
      ch:[{t:'Turn round.', go:'b2_runner'}, {t:'Not yet.', go:()=>startExplore()}]}),
    b2_runner:()=>({sp:'A boy from the quarter', txt:
`A boy from the quarter, ten years old, barefoot, soot to the eyebrows. You know his face; he used to carry Ressan's jars. He runs straight into you and holds on to your belt with both hands while he gets his breath.

"${B2.elder} says." He has been told what to say and he is saying it exactly. "They came back. To the well. More of them. With torches, for the list. He's on the well and he won't get off it and she won't leave him and they're shouting at the door. She says come now. She says, *come now or don't come.*"

He lets go of your belt. He looks at the carts. He's ten, and from the quarter, and he knows what water is.

Benth, behind you, not unkindly: "A bell, Sergeant. The carts go in a bell. They go with a squad or they stay with the Whirlwind."

${b2In('haddat') ? `Haddat doesn't say anything. She is looking up the street toward the quarter, toward her mother's door, and she has her shield on her arm, and she is waiting, which is the hardest thing Haddat does.` : ''}${b2In('sathi') ? ` Sathi is looking at you, not the street. So is the dog.` : ''}`,
      ch:[{t:'"The quarter. Now. We go for the girls."', fx:()=>{ S.f.b2_key = 'daughters'; chain(-3, 0, 'The carts go out without the squad'); if (b2In('haddat')) loy('haddat', 1); if (b2In('sathi')) loy('sathi', 1); if (b2In('tangle')) loy('tangle', -1); }, go:'b2_key_daughters'},
          {t:'"The carts. Boy: run to the Wickans, they\'re riding the quarters. Tell her to go to the horsemen."', fx:()=>{ S.f.b2_key = 'carts'; chain(4, 0, 'The garrison\'s water carts'); if (b2In('marrow')) loy('marrow', 1); if (b2In('tangle')) loy('tangle', 1); if (b2In('haddat')) loy('haddat', -1); }, go:'b2_key_carts'}]}),

    /* the promise: back up the quarter, the carts go without them */
    b2_key_daughters:()=>({sp:'The water-sellers\' quarter', scene:'b2_well', txt:
`You go back up the quarter at a run, the squad strung out behind you and the boy in front because he won't be left. Behind you, Benth is shouting at somebody about a mule.

The well court. Green cloths at the court gate, six or seven, with torches, and the list again, a new copy, and somebody beating on Ressan's door with the haft of an axe. They hear you coming. ${S.f.b2_streetDone ? `They heard about the lane, too; you can see it go through them, the word passed back from the gate, *the soldiers from the lane*. ` : ''}${b2In('haddat') ? `Haddat says one sentence to them in Hissari, not loud, and the one with the axe looks at her face and then at her shield, and lowers it.` : `The one with the axe looks at you for a long moment and then lowers it.`} They go. Not far. They go out of the court the way smoke goes out of a room, and they'll be back.

Ressan is on the well-cover with his stick across his knees. ${B2.elder} is in the doorway with a kitchen knife, and ${B2.younger} is behind her with the jar.

"You came," Ressan says. "Good. Take them."

"Father—"

"Take them, soldier. I'm sitting on my well."`,
      ch:[{t:'"Ressan. Get up."', go:'b2_ressan_last'}]}),
    b2_ressan_last:()=>({sp:'Ressan', scene:'b2_well', fx:()=>{ S.f.b2_ressanOut = 1; S.f.b2_girlsOut = 1; chain(0, 2, `${B2.elder} and ${B2.younger}`); }, txt:
`He doesn't. He reaches up instead, and takes your hand, and holds it the way he held it that winter, when you were burning with the fever and talking to people who weren't in the room.

"A water-seller does not leave his wells." He says it gently this time, the way you'd tell a child a thing it already knows. "Somebody has to be here when they're thirsty. They will be. Everybody is, in the end." He lets go. "You kept your word. Now keep the rest of it. Walk them to wherever the Empire is going, and give them water on the way, and do not let ${B2.elder} carry everything, because she will try."

${B2.elder} kisses him on the forehead, hard, as if she were angry with it. ${B2.younger} tries to give him the jar. He makes her keep it.

You go. At the court gate you look back, once. He is sitting on the well-cover in the light of the burned door, with his stick across his knees, and he lifts one hand off the stick, and puts it back.`,
      ch:[{t:'Back to the gate.', go:'b2_gate_back'}]}),
    b2_gate_back:()=>({sp:'The south gate square', scene:'b2_hissar_burning', txt:
`The square has emptied while you were gone. The carts are where they were, three of them, with nobody on the shafts; the fourth is gone, and the ruts go out through the gate, and Benth with them. Water for whoever holds Hissar in the morning.

${B2.elder} sees them, and sees you see them, and understands what they are, and says nothing. Her chin comes up a little. ${B2.younger} holds the jar tighter.${b2In('tangle') ? `

Tangle looks at the barrels, and at the girls, and does a sum you can watch him do. He doesn't say it out loud. That's the first thing he hasn't said out loud all night.` : ''}

And then the gate begins to close.`,
      ch:[{t:'The gate.', go:'b2_gate_shut'}]}),

    /* the carts: the boy runs, and the squad takes the shafts */
    b2_key_carts:()=>({sp:'The south gate square', txt:
`The boy looks at you. Then he nods, once, the way the quarter nods at a price it doesn't like and will pay, and he's gone, back up the street toward the fires, running, faster than he came.

${b2In('haddat') ? `Haddat watches him go. Then she puts her shield on her back and her shoulder to the first cart's shaft, and when it doesn't move she puts her other shoulder to it. "Ressan's girl is not a fool," she says, to the shaft. "She'll go to the horsemen." She doesn't say it as if she believes it. She says it as if she's decided to.` : `Somebody puts a shoulder to the first cart's shaft. It moves.`}

${b2In('marrow') ? `Marrow sits down on the tail of the second cart, which is the only way she will ever travel, and ties no knot, and looks at the barrel. "Four thousand mouths," she says. "Maybe. For a day. Maybe two. That's not nothing, child. Tell yourself that. I'll tell you as often as you need."` : ''}

Benth is weeping, quietly, into his slate. It is the first time you have ever seen him do anything that wasn't in a ledger.

And then the gate begins to close.`,
      ch:[{t:'The gate.', go:'b2_gate_shut'}]}),

    /* ---- the gate: they try to shut it ---- */
    b2_gate_shut:()=>({sp:'The south gate', txt:
`The chain over the gate is moving. Somebody in the gatehouse is on the winch, and the axle-wedge is groaning, and the gate is coming in against it a hand's width at a time. Out of the streets on the far side of the square the green cloths come, a lot of them, running, not shouting now, which is worse: they are shouting for the gate, and the gate is listening.

Everyone still in the square is between them and the gate. That's the squad${S.f.b2_key === 'carts' ? `, and four water carts` : `, and two girls from the quarter with a jar`}${S.f.b2_yedda ? `, and a ropemaker's widow on a coil of rope telling her grandsons to *push*` : ''}.

${b2In('haddat') ? `"Hold it open," Haddat says. It isn't a question and it isn't advice. She's already going.` : `Hold it open, or stay in Hissar.`}`,
      ch:[{t:'"Hold the gate."', go:()=>startBattle('b2_gate', {})},
          {t:'Tangle puts a sharper into the street they\'re coming down.', tag:'uses 1 sharper', req:()=>S.inv.sharper > 0 && b2In('tangle'), fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('b2_gate', {pre:`Tangle stops humming, and bowls a sharper underarm into the mouth of the cloth-sellers' street, and gets his hands over his ears.`})}]}),
    b2_after_gate:()=>({sp:'The south gate', scene:'b2_hissar_burning', fx:()=>{ S.f.b2_gateDone = 1; }, txt:
`The man at the winch goes down the gatehouse stair a good deal faster than he came up it. The chain stops. The gate stops, half shut, with the axle-wedge cracked through and still holding, which is all anyone wanted of it.

You go out through the gap. ${S.f.b2_key === 'carts' ? `The carts first, the squad on the shafts, the barrels slopping, wheels catching on the gate-stones and Haddat's shoulder getting them over.` : `${B2.elder} first, with ${B2.younger}, and the jar, and the squad behind them.`}${S.f.b2_yedda ? ` ${B2.widow} comes after, with the cart and the boys and the coil, saying *push*.` : ''}

On the road outside the walls you stop and look back, everyone does. Hissar is on fire from the river to the garrison wall. Over it, against the glow, the sky is full of something moving: dust, or smoke, or riders.

${b2In('sathi') ? `"Weasels," says Sathi, and laughs, high and pleased. "Look. They went round. They went all the way round them." She says something to Hackle. Hackle barks once.` : `Riders. Wickans, going round the city in the dark, the way water goes round a stone.`}`,
      ch:[{t:'The Fist\'s camp.', go:()=>{ startExplore('b2_camp'); talk('b2_camp_arrive'); }}]}),
    b2_gate_g:()=>({sp:'The south gate', txt:
`The gate, wedged open with a cart-axle, and the road beyond it going away into the dark toward the Fist's camp. Garrison men are going out through it in twos and threes. ${S.f.b2_corporal ? `Not the squad. Not yet.` : `There's somebody with the water carts, by the channel. Not yet.`}`,
      ch:[{t:'Not yet.', go:()=>startExplore()}]}),

    /* ---- the priest of Mael, on his way out ahead of everyone ---- */
    b2_corporal_again:()=>({sp:'Corporal Benth', txt:`Benth is counting the carts again, with the slate hung round his neck on a string. "Sergeant," he says, and nothing else, and that is the most respectful he has ever been.`,
      ch:[{t:'Leave him.', go:()=>startExplore()}]}),
    b2_rel:()=>({sp:'A priest of Mael', fx:()=>{ S.f.b2_relSeen = 1; }, txt:
`A priest in robes the colour of deep water, plump and soft-handed, with a Wickan rider at each shoulder who are not, by the look of them, an honour guard. He has a small chest under one arm and is holding it the way a man holds a thing he has been told he may keep.

"Sergeant." He has a voice like warm oil. "Mallick Rel, of Mael's temple. You'll forgive me: the Fist has asked me to leave the city ahead of everyone. Ahead of *everyone*." The smile does not go anywhere near his eyes. "One does not argue with the Fist. One finds a ship."

He makes a small blessing at the squad, two fingers, the sign of the deep water. ${b2In('sathi') ? `Hackle, at Sathi's knee, does not growl. He goes very still instead, and lowers his head, and looks at the priest the way he looks at a snake in the grass, and Sathi doesn't call him off.` : ''}${b2In('haddat') ? ` Haddat does not return the blessing. She is Hissari; she was taught what to do with a blessing from a man she doesn't know.` : ''}

One of the Wickans says something short. The priest inclines his head to you, pleasantly, and goes on toward the gate, and out of it, and away.`,
      ch:[{t:'Let him go.', fx:()=>{ S.f.b2_relGone = 1; }, go:()=>startExplore()}]}),
    b2_wickan_gate:()=>({sp:'A Wickan rider · Crow Clan', fx:()=>{ S.f.b2_wickanGate = 1; }, txt:
`A Wickan on a lathered horse, stopped by the channel to let it drink. A Crow, by the feathers braided into the horse's mane. Grey in his braids. He looks at the squad and at the burning city and seems to find both mildly funny.

${b2In('sathi') ? `Sathi says something to him in Wickan, fast. He answers, slower, and laughs, and points north with his chin. Sathi turns back to you, delighted. "He says the rebels came out of the old city to the garrison, and the clans rode round them by the river, and came in behind, and *ate* them." She thinks. "That is the word he used. And now the clans are taking people out. Many people. On the saddles. Out the north side, and round."` : `He says something in Wickan you don't follow, and then, in bad Malazan, pointing north: "We ride round. Come behind. Eat them." He grins. "Now we take people. Many people. Saddle." He pats the horse's rump, where a saddle might have a child on it.`}

${S.f.b2_key === 'carts' ? `You think of a boy running back up the quarter with your word, and of a well court, and you hope the Crow is right about *many*.` : `He looks you over, all of you, and nods, as if counting.`}`,
      ch:[{t:'On.', go:()=>startExplore()}]}),
    /* ---- the Seventh's camp, before dawn ---- */
    b2_camp_arrive:()=>({sp:'The Seventh\'s camp', scene:'b2_odhan_dusk', fx:()=>{ S.f.b2_campIn = 1; }, txt:
`The Fist's camp is a league outside the walls on the Odhan, and by the time the squad reaches it there is no telling where the camp stops and the refugees start. People are still coming in down the road behind you, and across the scrub on both sides of it, in the dark: on foot, on mules, in carts, carrying children and pots and a chair, one man carrying a door. Nobody is telling them where to go. They are going toward the fires.

And out of the north, out of the dark round the city, the Wickans are coming back. Riders in twos and threes, their horses blown, and on almost every saddle, in front of the rider or behind, somebody from Hissar: a child, an old man, a woman holding on with both arms round a Wickan's waist and her eyes shut.

${S.f.b2_key === 'carts' ? `You look at every one of them. You can't help it. ${b2In('haddat') ? `Neither can Haddat.` : ''}` : `${B2.elder} watches them come in, holding ${B2.younger}'s hand, and doesn't say anything, and you know who she's looking for and that he isn't on any of them.`}

Somebody is standing on a wagon in the middle of it all, giving out the column like rations, and laughing.`,
      ch:[{t:'Find whoever is giving out the column.', go:()=>startExplore()}]}),

    /* ---- Bult: "you own these" ---- */
    b2_bult:()=>({sp:'Bult · Coltaine\'s uncle', fx:()=>{ S.f.b2_bult = 1; }, txt:
`He's old, and broad, and scarred across one cheek in a way that's pulled his mouth into a permanent half-grin, and he is standing in the bed of a supply wagon pointing at people. A Wickan, Crow Clan, the Fist's uncle and his second, and the only man in the Seventh who laughs at the Fist where the Fist can hear it.

"You. Sergeant." He has the Malazan of a man who learned it to argue with Malazans. "Third Squad, Hissar? Good. You walked out. Half the garrison walked out *with* things, and half of them walked out *as* things, and you look like you're still a squad." He jumps down off the wagon, heavily, and looks the squad over. ${b2In('sathi') ? `He stops at Sathi, and says something in Wickan, and Sathi goes red to the ears. Hackle wags at him. Bult scratches the dog's head and says to it, in Malazan, "Yes. You too."` : `He stops at Haddat's shield, and the faded auxiliary blue on it, and nods to her as if they'd met.`}

"Here is what the Fist says. The Fist says very little. I say the rest." He waves an arm at the dark, at the fires, at the people still coming. "All this. We are taking it to Aren. All of it, the soldiers and the cattle and the carts and the merchants who think we work for them. The Fist does not leave things behind. So." He points at a knot of people round a fire: a family, an old man, two boys with a goat. "That fire. And that one. And the cart behind them with the three sisters who keep asking me for a tent. Yours."

"Mine, sir?"

"You own these." He grins the scarred grin. "Count them every halt. When one is missing, find out why. When one is dead, find out why. When you are all dead, I will find out why. Good?"`,
      ch:[{t:'"Sir."', fx:()=>{ chain(0, 12, 'Bult gives the squad a stretch of the column'); if (b2In('haddat')) loy('haddat', 1); }, go:'b2_bult_owned'},
          {t:'"Sir. With respect, a squad can\'t keep twelve people alive across the Odhan."', go:'b2_bult_cant'}]}),
    b2_bult_cant:()=>({sp:'Bult', txt:
`Bult laughs. It is a big laugh, and it goes out across the camp, and some of the refugees turn round to look at it.

"No," he says. "It can't. Neither can an army keep forty thousand. Neither can a Wickan warlord keep an army that wants him dead, and look, here we are, all of us, doing it." He claps you on the shoulder, hard enough to move you. "You'll fail, Sergeant. Everybody fails. Fail slowly. Fail all the way to Aren."

He says it to the Fist's tent, over his shoulder, louder: "*He says it can't be done.*"

From inside the tent, nobody answers.`,
      ch:[{t:'"Sir."', fx:()=>{ chain(0, 12, 'Bult gives the squad a stretch of the column'); }, go:'b2_bult_owned'}]}),
    b2_bult_owned:()=>({sp:'Bult', txt:
`"Good." He's already looking at the next squad coming in. "The march goes at first light. South-west, into the Vin'til Basin. There's water in the basin, they say. They also say there's an army in it. We'll see which one is lying."

He looks back at you once more, and something in the grin goes away, and comes back. "The ones you brought out of the city with you." ${S.f.b2_key === 'daughters' ? `He nods at ${B2.elder} and ${B2.younger}. "Those are yours too. They were yours before I said so."` : S.f.b2_key === 'carts' ? `He nods at the water carts. "Those are the Fist's. The Fist thanks you. He won't say so. I am saying so. And the city the Weasels brought out on their saddles tonight, a great deal of the city, they are in the column now too, somewhere. Forty thousand is a lot of faces, Sergeant. Look at them all. You'll want to."` : ''}${S.f.b2_yedda ? ` He looks past you at ${B2.widow}, sitting on her coil of rope. "And her. I am sorry for you about her."` : ''}`,
      html:chainHTML('Outside Hissar · before dawn'),
      ch:[{t:'Walk the camp.', go:()=>startExplore()}]}),
    b2_bult_again:()=>({sp:'Bult', txt:
`He's up on the wagon bed again, pointing. "Sergeant! Count them yet?" He doesn't wait for an answer. He never does. "Count them again."`,
      html:chainHTML('Outside Hissar · before dawn'),
      ch:[{t:'Walk on.', go:()=>startExplore()}]}),

    /* ---- Coltaine, at the mouth of his tent: very few words ---- */
    b2_coltaine:()=>({sp:'Coltaine · Fist of the Seventh', scene:'b2_coltaine_tent', fx:()=>{ S.f.b2_coltaine = 1; }, txt:
`The Fist's tent has one lamp in it and a map on a trestle weighted with stones, and a cloak of black feathers thrown over a stool. Nobody is on the stool.

Coltaine is standing at the trestle, looking at the map. He's tall, and thin, and his face is the face of a man who has heard every story about himself and agreed with none of them. He doesn't look up when you come to the tent mouth.

He listens to you report. All of it: the quarter, the lane, the gate${S.f.b2_key === 'carts' ? ', the water' : ', the girls'}. When you've done, he moves one stone on the map a finger's width to the south-west.

"Good."

That's all. You wait. He doesn't say anything else. After a while it becomes clear that he isn't going to, and that he has already forgotten you were there, and that this is, from Coltaine, a commendation.${b2In('sathi') ? `

Outside, Sathi has gone very quiet. She's looking up at the top of the tent.` : ''}`,
      ch:[{t:'Salute, and go.', go:'b2_crows'}]}),
    b2_crows:()=>({sp:'Outside the Fist\'s tent', fx:()=>{ if (b2In('sathi')) S.f.b2_sathiCrows = 1; }, txt:
`${b2In('sathi') ? `Sathi hasn't moved. She's looking up at the peak of the Fist's tent, where the ridge-pole comes through, and following her eyes, you see them.

Crows. In the dark before dawn, when crows have no business being awake: one, and then three, and then more than you want to count, coming down out of the smoke from Hissar and settling along the ridge of the Fist's tent, and on the guy-ropes, and on the poles of the tents around it, without a sound.

Sathi says something to Hackle in Wickan. Then she says it again, to you, in Malazan, as if you'd argued.

"That means something." She is seventeen and she has decided. "It *means* something, Sergeant. Don't say it doesn't."

Hackle, at her knee, is looking up too. He doesn't bark. He's the clever one.` : `Crows. In the dark before dawn, settling along the ridge of the Fist's tent without a sound, more of them than you want to count. Nobody in the camp looks up at them. You have the feeling they've all seen it before.`}`,
      ch:[{t:b2In('sathi') ? '"I won\'t say it doesn\'t."' : 'Walk on.', fx:()=>{ if (b2In('sathi')) loy('sathi', 1); }, go:()=>startExplore()},
          {t:'"They\'re crows, Sathi. There\'s a city burning."', req:()=>b2In('sathi'), fx:()=>{ loy('sathi', -1); }, go:'b2_crows_no'}]}),
    b2_crows_no:()=>({sp:'Sathi', txt:
`She looks at you the way a horse-breaker looks at a man who has just tried to get on the wrong side.

"Lowlanders," she says, to Hackle. Then she laughs, short and high, which is how the Weasels take an insult, and walks off between the tents with the dog. She doesn't look up at the crows again while you can see her. You think she's decided not to let you watch her do it.`,
      ch:[{t:'Walk on.', go:()=>startExplore()}]}),

    /* ---- Duiker, the Imperial Historian ---- */
    b2_duiker:()=>({sp:'The Imperial Historian', fx:()=>{ S.f.b2_duiker = 1; }, txt:
`A grey old man in a soldier's coat, on an upturned bucket by a fire, with a notebook on his knee and a stub of charcoal and the look of a man who has been awake for two days and would like to be awake for two more. Wiry, a scholar's hands with a soldier's calluses on them.

"Sergeant. You came out of the city. By the south gate, they say, late." He doesn't stand. "Duiker. Imperial Historian. I came to Hissar to write the history of a quiet province." He looks at the glow on the horizon. "I'm revising."

He holds the charcoal over the page. "Tell me. Not the officers' version. Yours. What did it *look* like?"`,
      ch:[{t:'Tell him. The quarter, the list, the door, the gate. All of it.', fx:()=>{ S.f.b2_duikerTold = 1; }, go:'b2_duiker_told'},
          {t:'"It looked like a city burning, sir."', go:'b2_duiker_short'}]}),
    b2_duiker_told:()=>({sp:'Duiker', txt:
`He writes it down. All of it, in a small quick hand, without asking you to slow down, which nobody has ever done for you before. When you get to the list in the well court he stops writing and looks up.

"Names crossed out," he says. "In a different hand." He writes that too, and underlines it. "That's the thing nobody will remember, Sergeant. They'll remember the fires. Nobody remembers that somebody went down a list in the middle of a rising and crossed out his own mother's door."${b2In('haddat') ? ` He doesn't look at Haddat. You're fairly sure he knows exactly which of you to not look at.` : ''}

${S.f.b2_key === 'daughters' ? `When you tell him about the carts going out without you, he writes that too, and then sits looking at it. "History will say you were wrong," he says. "History is very bad at counting girls."` : S.f.b2_key === 'carts' ? `When you tell him about the boy running back up the quarter, he stops writing for a while. "The Wickans brought out more than anyone has counted yet," he says at last. "I've been trying. I've stopped at four thousand. There are more." It's an offer, of a kind. It's the only one he has.` : ''}`,
      ch:[{t:'Leave him to it.', go:()=>startExplore()}]}),
    b2_duiker_short:()=>({sp:'Duiker', txt:
`He looks at you for a moment, and then writes that down too. "*It looked like a city burning,*" he reads back. "Sergeant of the Third, Hissar garrison." He seems pleased with it. "That's better than anything the officers gave me. They told me what it meant."`,
      ch:[{t:'Leave him to it.', go:()=>startExplore()}]}),
    b2_duiker_again:()=>({sp:'Duiker', txt:`He's still writing. He lifts the charcoal at you without looking up, which from a historian is a salute.`, ch:[{t:'Leave him.', go:()=>startExplore()}]}),

    /* ---- Sormo E'nath: old eyes in a young face, and the warrens are sick ---- */
    b2_sormo:()=>({sp:'Sormo E\'nath · Wickan warlock', fx:()=>{ S.f.b2_sormo = 1; }, txt:
`A boy, by his face, thirteen or fourteen, sitting cross-legged on a horse-blanket at the edge of the firelight with his hands open on his knees. Two other young Wickans sit behind him, a girl and a boy, very still, watching him the way you watch a teacher.

Then he looks up at the squad, and his eyes are not a boy's. They are older than Bult's. They are older than anything in the camp.

"Healer." He's looking at Marrow. "Come here. Sit." Marrow, who sits whenever she can, sits. "You reach into Denul and it comes back wrong."

${b2In('marrow') ? `"Thin," Marrow says. "Some days thick. Greasy. Like something enormous wading through it a long way off." She holds up the string. "I've started counting."

"Count." Sormo nods. "It is not you. It is not your goddess. The warrens are sick, all across this land. Something is walking in them that does not belong there. Many somethings." He looks east, toward a desert none of you can see. "The spirits of this land smell it too. They do not like it. They are old and they are angry and they will help us, for a price, for a while." He smiles, and it's a boy's smile again, briefly. "Your string will get longer, healer. And the knots further apart. That is the price you pay. Mine is different."` : `"It is not you. The warrens are sick, all across this land. Something walks in them that does not belong there. Tell your healer, when you have one again. She will want to know it is not her fault."`}`,
      ch:[{t:'"What is your price?"', go:'b2_sormo_price'},
          {t:'Leave him to his students.', go:()=>startExplore()}]}),
    b2_sormo_price:()=>({sp:'Sormo E\'nath', txt:
`He looks at you with the old eyes for a long moment.

"Mine is Wickan business, Sergeant." Not unkind. "Go and count your people. Bult will ask."

Behind him, the two young Wickans haven't moved. The girl is looking at you. She has the same eyes he does, nearly: not yet, but on the way.${b2In('marrow') ? `

Marrow ties a knot in her string, as she gets up. Not for a healing. You don't ask what for, and she doesn't say.` : ''}`,
      ch:[{t:'Go and count.', go:()=>startExplore()}]}),
    b2_sormo_again:()=>({sp:'Sormo E\'nath', txt:`He's speaking to his two students in Wickan, low. He doesn't look up. The old eyes have already looked at you, once, and that seems to have been enough for him.`, ch:[{t:'Leave him.', go:()=>startExplore()}]}),

    /* ---- the daughters in the camp ---- */
    b2_imra_camp:()=>({sp:B2.elder, fx:()=>{ S.f.b2_imraCamp = 1; }, txt:
`${B2.elder} has found a corner of a wagon-bed for ${B2.younger}, who is asleep on it with both arms round the jar. ${B2.elder} is not asleep. She is sitting on the wheel looking back at the glow over Hissar.

"He'll be all right," she says, before you can say anything. "Everybody wants water. He said so." She doesn't look at you. "He's said it every summer of my life. It's always been true."

${b2In('marrow') ? `Marrow comes and sits on the wheel beside her, because it's a wheel, and doesn't say anything at all, and after a while ${B2.elder} leans on her.` : `You stand there for a while. After a while she says, "Go on. You've got people to count. Bult told everyone."`}`,
      ch:[{t:'Leave her be.', go:()=>startExplore()}]}),

    /* ---- the fire: rest, with water ---- */
    b2_fire:()=> S.f.b2_rested ? {sp:'The squad\'s fire', txt:`The fire's down to coals. ${b2In('tangle') ? 'Tangle is asleep on his satchel.' : 'Somebody is asleep on the far side of it.'} First light isn't far off.`, ch:[{t:'Leave it.', go:()=>startExplore()}]} : {sp:'The squad\'s fire', txt:
`A fire somebody else built and left, in the lee of a wagon. The squad gets down round it without anyone saying to. ${b2In('marrow') ? 'Marrow is sitting before you have finished deciding where to stand.' : ''}

There's an hour before first light. A skin of water, passed round, and sleep, would put the night back together. ${chainW() > 0 ? `The squad has ${numw(chainW())} skin${chainW() === 1 ? '' : 's'}.` : 'The squad has no water at all.'}`,
      html:chainHTML('Outside Hissar · an hour before dawn'),
      ch:[{t:'Drink, and sleep an hour.', tag:'1 water', req:()=>chainW() > 0, fx:()=>{ S.f.b2_rested = 1; dgRest(`The squad sleeps an hour in the lee of a wagon${b2In('marrow') ? ', and Marrow sees to what needs it' : ''}. Wounds close, mostly.`); }, go:'b2_fire_slept'},
          {t:'Sit, and keep the water.', fx:()=>{ S.f.b2_rested = 1; }, go:'b2_fire_dry'}]},
    b2_fire_slept:()=>({sp:'The squad\'s fire', txt:
`The water goes round the fire once. Everybody drinks slowly, the way you've taught them, and passes it on. ${b2In('sathi') ? `Sathi gives a mouthful of hers to Hackle out of her cupped hand, and nobody says anything about it.` : ''}

${b2In('tangle') ? `Tangle hums the four notes over the satchel, once, the way other men say prayers, and lies down with his head on it.` : ''} ${b2In('haddat') ? `Haddat takes the first watch without asking. She sits with her back to the fire and her face to the city, and her shield across her knees, and the green cloth${S.f.b2_ilharDoor === 'taken' ? ' in its grip' : ''} where she can see it.` : ''}

You sleep an hour. It's not enough. It's what there is.`,
      ch:[{t:'Wake.', go:()=>startExplore()}]}),
    b2_fire_dry:()=>({sp:'The squad\'s fire', txt:
`Nobody drinks. Nobody asks to. They sit round the fire with their mouths dry and the skins hung on the wagon where everyone can see them, and nobody looks at them.

${b2In('marrow') ? `"Sensible," says Marrow. "Hateful. Sensible."` : `It's the right call. It doesn't feel like one.`}`,
      ch:[{t:'Up.', go:()=>startExplore()}]}),

    /* ---- the horse lines: a Weasel rider ---- */
    b2_horses:()=>({sp:'The horse lines', txt:
`The Weasel Clan's horse lines, small tough horses the colour of the Odhan, and young Wickans sleeping between their feet. ${b2In('sathi') ? `One of the riders sees Sathi and calls something to her, and she calls something back, and two or three of them laugh. "They say I walk like a Malazan now," she says, sour. "They say the dog is the only one of us who still knows how to be a Wickan." Hackle looks pleased.` : `A rider watches you go by and says something to the next rider, and they both laugh.`}

${S.f.b2_key === 'carts' ? `You ask about the quarters. The water-sellers'. Two girls. One of them is nine. The Weasel listens and shrugs, not unkindly. "Many," he says, holding up both hands, and then again, and again. "Many. Saddles. Everywhere." He waves at the camp. "Look."` : `"Many," the rider says, and holds up both hands, and then again, and again, and waves at the camp as if to say: all of this. Saddles. Look.`}`,
      ch:[{t:'Walk on.', go:()=>startExplore()}]}),

    /* ---- first light: the march ---- */
    b2_march:()=> S.f.b2_bult && !S.f.b2_coltaine ? {sp:'The wagons', txt:
`The wagons are loading. A Crow rider with a lance stops you at the wagon line and points, with the lance, at the Fist's tent. Every squad that came out of the city reports to the Fist before it marches. He doesn't say it in Malazan. He doesn't need to.`,
      ch:[{t:'The Fist\'s tent.', go:()=>startExplore()}]} : !S.f.b2_bult ? {sp:'The wagons', txt:
`The wagons are being loaded. Nobody will tell you where your place is in the line. Somebody says *ask Bult*; somebody else says *ask the old one laughing on the wagon*, and points.`,
      ch:[{t:'Find him.', go:()=>startExplore()}]} : {sp:'The wagons', txt:
`First light, grey over the Odhan. The column is moving, the head of it already a league off, the tail still in the camp. Your stretch of it is here: ${chainC()} ${chainC() === 1 ? 'soul' : 'souls'}, carts, a goat, ${S.f.b2_key === 'carts' ? 'four water carts,' : ''} and the squad.

Behind you Hissar is a smudge of smoke on the horizon. Ahead is the Vin'til Basin, south-west, a day and a half.`,
      html:chainHTML('The road south-west · first light'),
      ch:[b2DeckChoice(1),
          {t:'March.', go:()=>{ startExplore('b2_basin'); talk('b2_basin_arrive'); }},
          {t:'Not yet.'}]},
    /* the reading: Marrow (or whoever reads, 47) at the wagons, first light (47c) */
    b2_c1_deck:()=>b2DeckOffer(1, 'b2_c1_card'),
    b2_c1_card:()=>b2DeckCard(1),
    /* ---- the Vin'til Basin: the march, and Reloe's army ---- */
    b2_basin_arrive:()=>({sp:'The Vin\'til Basin', scene:'b2_basin', fx:()=>{ S.f.b2_basinIn = 1; }, txt:
`A day and a half south-west, the ground drops away into the Vin'til Basin: a wide pan of cracked clay under a white sky, with scrub round its rim and dry washes cut across its floor like old knife-cuts. The heat comes up off it into your face. The column goes down into it because the column goes where it's told.

The squad's stretch is on the left flank, near the tail. ${S.f.b2_key === 'carts' ? `The water carts creak. Haddat walks with one hand on the lead cart's wheel, as if it might wander.` : `${B2.elder} walks beside ${B2.younger}, who is riding on a cart with the jar in her lap, and won't let anyone else carry it.`} Hackle runs out and back, out and back, along the line of the squad's people, the way a Wickan dog works a herd. ${b2In('sathi') ? `Sathi, on a borrowed horse, rides beside him and says nothing to anyone, which is Sathi content.` : ''}

Somewhere ahead, at the head of the column, a horn. Then another, from the right. Then, from the far rim of the basin, dust.`,
      ch:[{t:'Look.', go:()=>startExplore()}]}),
    b2_duiker_basin:()=>({sp:'Duiker', fx:()=>{ S.f.b2_duikerBasin = 1; S.f.b2_reloe = 1; S.f.b2_duiker = 1; }, txt:
`The historian has ridden back along the column on a tired mare, notebook in one hand, and stopped on a low rise to look at the far rim. He's squinting.

"Kamist Reloe." He says it the way you'd say the name of a disease. "A High Mage of Seven Cities. He was supposed to be dead. A good many people who were supposed to be dead have turned out to be on the other side this summer." He points with the charcoal. "That's his army. Odhan tribes, mostly. Young. Eager. They've never fought anything that fought back."

He watches the dust a while longer. "Coltaine has been waiting for this since Hissar. Watch the Wickans, Sergeant. You'll want to have seen it." Then, more quietly, turning the mare: "And watch your flank. Eager armies go where you don't expect, because they don't know where they're supposed to go."`,
      ch:[{t:'"Sir."', go:()=>startExplore()}]}),
    b2_outrider:()=>({sp:'A Weasel outrider', txt:
`A Wickan girl not much older than Sathi, on a horse that's been ridden hard, with a bow across her knees. She points at the dry wash to the east, where a dead tree hangs over the lip of it, and says something in Wickan.

${b2In('sathi') ? `Sathi answers. They talk fast for a while, and the outrider laughs, and points again. "She says the wash runs right round behind the column's flank," Sathi says. "She says their young men will try to come up it, because they will think it is clever. She says the Fist wants it held. She says *you* are to hold it, because we are the nearest and the Fist does not care who." She grins. "She says the Weasels will be watching to see how Malazans die."` : `She talks fast, and points, and when it's clear you haven't understood, she draws it in the dust with her bow: the column, the flank, the wash curving round behind. An arrow, up the wash. Then she points at you, and at the wash, and makes a fist.`}`,
      ch:[{t:'Read the wash before they come.', check:['wits',12],
            edges:id=>[id === 'sathi' && ['Sathi reads ground from a saddle', 2], id === 'tangle' && ['a sapper looks at a ditch and sees a trench', 1]],
            clean:{t:'There\'s a place at the lip where a charge would have to bunch. Tangle has already seen it.', fx:()=>{ S.f.b2_washBunch = 1; }},
            go:'b2_outrider_read', fail:'b2_outrider_miss'},
          {t:'"Tell her we\'ll hold it."', fx:()=>{ S.f.b2_washRead = 0; }, go:()=>startExplore()}]}),
    b2_outrider_read:()=>({sp:'The dry wash', fx:()=>{ S.f.b2_washRead = 1; }, txt:
`${by({sathi:`Sathi rides the lip of the wash at a walk, leaning out of the saddle, and comes back. "They'll come up it on foot, not horses. Too narrow. They'll come out where the bank's broken, by the dead tree, all at once, because they'll be frightened." She shrugs. "That is where I would be, if I were stupid."`,
  tangle:`Tangle walks the lip of the wash with his hands in his pockets, humming. He stops by the dead tree. He stops humming. "Here," he says. "Bank's broken. They come out here or they don't come out. A sharper in the bank, there, and they'd have to go round." He looks at you. "I'm not saying do it. I'm saying it's here."`,
  haddat:`Haddat looks at the wash for a long time, the way she looks at a street before a riot. "By the tree," she says. "The bank is broken there. They will come out together, because they are young, and nobody has told them not to."`,
  sgt:`You walk the lip. Six years of Hissar streets: you know where a crowd comes out of an alley. By the dead tree, where the bank's broken.`,
  _:`{who} walks the lip of the wash and stops by the dead tree, where the bank is broken. That's where.`})}

When they come, you'll be standing where they come out.`,
      ch:[{t:'Back to the column.', go:()=>startExplore()}]}),
    b2_outrider_miss:()=>({sp:'The dry wash', fx:()=>{ S.f.b2_washRead = 0; }, txt:
`The wash is a wash. It goes round, and the banks crumble, and the heat-shimmer off the clay makes it impossible to tell where one bend ends and the next begins. ${by({sgt:'You', _:'{who}'})} can't make anything of it that the outrider hasn't already said with a bow in the dust.

They'll come up it. You'll have to meet them wherever they come out.`,
      ch:[{t:'Back to the column.', go:()=>startExplore()}]}),
    b2_outrider_again:()=>({sp:'A Weasel outrider', txt:`She's watching the wash with her bow across her knees. She lifts her chin at you, which is a Wickan's whole conversation.`, ch:[{t:'Walk on.', go:()=>startExplore()}]}),

    /* the woman with a child: water against the column */
    b2_mother:()=>({sp:'A woman with a child', txt:
`A woman from one of the Hissar trades, by her hands, with a boy of three on her hip. She has walked out of the city and across the Odhan and down into the basin carrying him, and her lips are cracked white, and his aren't, which tells you where her water went.

"Soldier." She doesn't ask. She only looks at the skins on the squad's belts. "My husband's sister and her two. They're behind. They're in the next stretch. They have nothing."

${b2In('marrow') ? `Marrow looks at the boy, and at the mother, and then at you, and says nothing in the way that is a sentence.` : ''}${b2In('tangle') ? ` Tangle, very quietly, the way he counts the satchel: "${numw(chainW(), true)} skins."` : ''}`,
      ch:[{t:'Give her a skin. Bring her sister\'s family into the squad\'s stretch.', req:()=>chainW() > 0, fx:()=>{ S.f.b2_mother = 'gave'; chain(-1, 4, 'A mother, her boy, and her husband\'s sister\'s family'); if (b2In('marrow')) loy('marrow', 1); }, go:'b2_mother_gave'},
          {t:'"The water carts at the head of the column. Ask there."', fx:()=>{ S.f.b2_mother = 'refused'; if (b2In('marrow')) loy('marrow', -1); }, go:'b2_mother_no'}]}),
    b2_mother_gave:()=>({sp:'A woman with a child', txt:
`She drinks after the boy does, which is the right order and the hardest one. Then she goes back down the column, quickly, and comes back with her husband's sister, a girl of twelve and a baby, and they fall in among the squad's people without anyone saying where to stand, and ${S.f.b2_yedda ? `${B2.widow} makes room on the handcart for the baby without being asked, and complains about it` : `somebody makes room on a cart for the baby`}.

The skins on the squad's belts are lighter. Bult said count them. You count them.`,
      html:chainHTML('The Vin\'til Basin · noon'),
      ch:[{t:'On.', go:()=>startExplore()}]}),
    b2_mother_no:()=>({sp:'A woman with a child', txt:
`She looks at you for a long moment, and then she nods, as if she'd known what you'd say, and goes back down the column toward the head of it, with the boy on her hip, walking carefully, to save her strength.

${b2In('marrow') ? `Marrow doesn't say anything. She ties a knot in her string, and then, after a moment, unties it again.` : `Nobody in the squad says anything.`}`,
      ch:[{t:'On.', go:()=>startExplore()}]}),
    b2_mother_again:()=>({sp:'A woman with a child', txt: S.f.b2_mother === 'gave' ? `She's walking with her sister now. The boy is asleep on her shoulder. She doesn't look at you; she's saving her strength for walking, which is right.` : `She's gone up the column. You don't see her again.`, ch:[{t:'Walk on.', go:()=>startExplore()}]}),
    b2_wagon:()=>({sp:'The squad\'s stretch', txt:
`${S.f.b2_key === 'carts' ? `The water carts, the barrels hot to the touch now.` : `A borrowed wagon with three families' worth of pots on it.`} The squad's people are bunched round it in the shade it doesn't give.`,
      html:chainHTML('The Vin\'til Basin · noon'),
      ch:[{t:'Count them.', go:()=>startExplore()}]}),

    /* ---- the wash: Bat'rol ---- */
    b2_wash:()=> S.f.b2_batrolDone ? {sp:'The dry wash', txt:`The wash is full of what the green army left in it. The dead tree's still there. Nobody sits under it.`, ch:[{t:'Leave it.', go:()=>startExplore()}]} : !S.f.b2_duikerBasin ? {sp:'The dry wash', txt:
`A dry wash cut across the basin floor, with a dead tree hanging over the lip of it. Down in the channel the clay is cracked into plates. Nothing moves in it yet. The dust on the far rim is getting closer.`,
      ch:[{t:'Back to the column.', go:()=>startExplore()}]} : {sp:'The dry wash', txt:
`The dry wash, and the dead tree over it, and the dust that was on the far rim and isn't any more. Once the squad is down in the flank, it stays there until it's over.`,
      ch:[{t:'Down into the flank.', go:'b2_wash_hit'}, {t:'Not yet.', go:()=>startExplore()}]},
    /* the green army's charge, once the squad has taken the flank */
    b2_wash_hit:()=>({sp:'Bat\'rol · the flank', scene:'b2_basin', fx:()=>{ S.f.b2_batrolStart = 1; }, txt:
`It comes all at once, the way weather comes in the Odhan.

Out on the basin floor the green army charges the column, a long ragged wave of horsemen and men on foot, and the Wickans are not where they were. They were never where they were. The Weasels and the Crows come out of the scrub on both sides and the charge goes into them, and the dust goes up over all of it so thick you can't see the head of the column.

And up the wash, as the outrider said, as Duiker said, the young men who think they are clever.

${S.f.b2_washRead ? `They come out by the dead tree, all at once, the way ${by({sathi:'Sathi', tangle:'Tangle', haddat:'Haddat', _:'you'})} said they would. ` : `They come out wherever the bank lets them, in twos and threes and then all at once. `}Painted faces, green rags on the lance-heads, and one man in the middle of them with his hands up, painted head to foot, shouting the Apocalypse at the sky.

Behind you, the squad's people. ${chainC()} of them. ${b2In('haddat') ? `Haddat has her shield up and her feet set and is saying, in Hissari, a prayer to no god she will name.` : ''}`,
      ch:[{t:'"Hold the flank."', go:()=>startBattle('b2_batrol', S.f.b2_washRead ? {surprise:'p'} : {})},
          {t:'Tangle\'s sharper, in the broken bank, before they reach it.', tag:'uses 1 sharper', req:()=>b2In('tangle') && S.inv.sharper > 0 && !!S.f.b2_washRead, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('b2_batrol', {pre:true, surprise:'p'})}]}),
    b2_after_batrol:()=>({sp:'The dry wash', scene:'b2_basin', fx:()=>{ S.f.b2_batrolDone = 1; S.f.b2_reloe = 1; gain('b2_lancehead'); }, txt:
`The warleader goes down in the wash with a Wickan cattle-dog on his lance-arm and ${b2In('haddat') ? 'Haddat\'s tulwar' : 'a Malazan blade'} in him, and the young men behind him look at him lying there and stop being an army. They stop all at once, the way a crowd stops. Then they run.

Up on the basin floor they are running too. All of them. The green army has gone into the Wickans and come out the other side in pieces, and the pieces are going west across the clay toward the far rim, horses and men on foot and a painted holy man with his robes held up round his knees, and the Wickans are letting them go, mostly, with the Weasels riding along beside the stragglers laughing.

${b2In('sathi') ? `Sathi is laughing too, sitting on the lip of the wash with Hackle's head in her lap and blood on her bow-hand that isn't hers. It isn't a happy sound. It's a Wickan one. "Look at them run," she says. "They'll run to Meila. That's what the outrider says. All the way to the oasis, and drink it dry, and come back angrier."` : `They'll run as far as Meila Oasis, somebody says. They'll drink it dry, and come back angrier.`}

${b2In('tangle') ? `Tangle is counting the satchel. "${b2Count()}," he says, to nobody. Then he says it again, as if the second time might come out different.` : ''} ${b2In('marrow') ? `Marrow is on her knees by somebody from the squad's stretch who caught a lance-butt in the ribs. When she gets up she ties one knot, and holds the string up to the light, and looks at it, and doesn't say anything.` : ''}`,
      ch:[{t:'Count them.', go:'b2_count'}]}),
    b2_count:()=>({sp:'The Vin\'til Basin · dusk', scene:'b2_odhan_dusk', txt:
`Dusk. The column has stopped for the night on the far side of the basin, strung out for a league along the old road, and the fires are coming up all along it one by one.

You count them. Bult said to. ${chainC()} in the squad's stretch. ${S.f.b2_key === 'daughters' ? `${B2.elder} and ${B2.younger} among them, asleep on a wagon-bed, holding hands, with the jar between them.` : `None of them from the water-sellers' quarter. You've looked at every face in the column you could reach, today, between the fighting. You will go on looking.`}${S.f.b2_yedda ? ` ${B2.widow} on her rope, awake, watching you count, daring you to get it wrong.` : ''}

${b2In('haddat') ? `Haddat is sitting a little way off from the fire, with the shield across her knees, ${S.f.b2_ilharDoor === 'taken' ? 'and the green cloth from her mother\'s door out of its grip, in her hand. She is looking west, the way the green army ran.' : 'looking west, the way the green army ran. She is looking at every face she can remember from it.'} She doesn't say his name. She doesn't have to.` : ''}

Somewhere up the column the Fist's tent is going up. You can't see it from here. You don't need to. ${S.f.b2_sathiCrows ? `Sathi says the crows are back on it.` : `There will be crows.`}`,
      html:chainHTML('The Vin\'til Basin · the first night'),
      ch:[{t:'Rest.', go:()=>chapterEnd(1, S.f.b2_key || 'daughters')}]}),
  }
};
