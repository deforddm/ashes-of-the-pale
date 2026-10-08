/* ============ chapter 4: Assassins ============ */
/* the two checks offered from more than one node, built fresh each time a node is shown */
const C4H = {
  // the skylight (Wits 12): from the roof arrival and from Ellis's planks
  sky:t=>({t, req:()=>!S.f.c4_skylight, fx:()=>{S.f.c4_skylight=1;}, check:['wits',12],
    edges:id=>[S.f.c4_planks && ['Ellis read this roof for you', 1]],
    near:{t:'Yes, but the old glass creaks.', fx:()=>{ S.f.c4_skyCreak=1; S.f.c4_skyWho=ROLL().who; }},
    clean:{t:()=>`${NAME(ROLL().who)} sees what the girl's folded hands are doing: winding a length of dark cord round two fingers, and unwinding it, and winding it again.`, fx:()=>{ S.f.c4_skyCord=1; }},
    go:'c4_sky_ok', fail:'c4_sky_fail'}),
  // the shout across the planks (a parade-ground bellow, so Might 13): from the Guild's arrival and from Kettle's refusal
  shout:t=>({t, check:['might',13],
    edges:id=>[S.f.c4_rallickOk && ['Rallick told you what they hunt', 1], S.f.c4_cusserHeld && SQUAD().includes('kettle') && ['they saw Kettle put the cusser back', 1]],
    near:{t:'Yes, but it carries a long way further than the planks.', fx:()=>{ S.f.c4_shoutLoud=1; }},
    clean:{t:()=>{ const w = ROLL().who; return w === 'sgt' ? 'The whole of the parade-ground voice, the one that stops horses. Brisk, beside you, looks very nearly proud.' : w === 'brisk' ? 'Brisk has not let the regiment voice out since Nathilog. She liked it.' : `${NAME(w)} has never shouted like that in the squad's hearing, and is pleased about it, and trying not to be.`; },
      fx:()=>{ const w = ROLL().who; if (w !== 'sgt' && SQUAD().includes(w)) loy(w, 1); }},
    go:'c4_guild_heard', fail:'c4_guild_deaf'}),
};
/* the tannery ridge: the second ground of the Gadrobi fight, either way it began. Two boots wide, with a step at a chimney
   halfway along and the plank to the Daru roofs at the far end. Nobody passes anybody on it. */
const C4_RIDGE = ["##....##","##.,,.##","###..###","###..###","##.,,.##","###..###","###..###","##....##","#......#","#......#"];
const CH4 = {
  title:'Assassins', number:'Four',
  intro:{loc:'Darujhistan', sub:'The rooftops · two nights on', cap:'Slate and chimney-pots under a blue haze, and above them a black mountain with no light in its windows.',
    paras:[
`Two nights since the dye-shop. Two nights of hauling nothing, guarding a hole, and pretending to be a road crew for a city that has stopped pretending not to notice. The Gadrobi crossing has a new brazier and an old silence. Hedge sings in the hole. Trotts stands at the stakes. Whiskeyjack sits on his bucket, and looks at the lake, and does not say what he is waiting for, which is how you know he is waiting for something.`,
`The city has started dying on its roofs. Not in its streets; its streets are as loud as ever, fish and bells and blue lamps. On the roofs. A body on the tannery ridge at dawn, face-down, knives still in the sheaths. Two on the Gadrobi temple dome, the morning after. A man in a guild jerkin found hanging by one foot from a gutter on the Street of Tanners' Daughters, and nobody on the street will say which guild. The Watch go up with ladders and come down with sheets and say *the gas*. Everyone in Darujhistan knows it is not the gas. Nobody in Darujhistan says what it is.`,
`Kalam has been sitting on the chandler's step since noon, sharpening a knife that was sharp at breakfast. He does it slowly, with a stone the size of a thumb, and he does not look at the blade while he does it. He is looking at the roofs. When the lamps come on, street by street, he puts the stone away, and stands, and Whiskeyjack stands too, and neither of them says anything, and the whole crossing goes quiet around them as if a door had opened somewhere and let the cold in.`],
    go:'Up', node:'c4_start'},

  areas:[
    /* 16 columns x 12 rows.  . roof tile  , slate  # drop / open air  p plank  C chimney  S skylight  x washing-line post  > exit east (to the Daru roofs) */
    { id:'roofs_gadrobi', title:'Darujhistan · the Gadrobi roofs', sub:'Night · two nights on', hint:'Tap roof to move · tap a figure to talk · the planks hold · the way on is east', decor:'roof_night',
      map:[ "################",
            "#..C..#,,,,#...#",
            "#.....#,,C,#.x.#",
            "#.x...p,,,,#...#",
            "#.....#,S,,p...#",
            "#.....#,,,,#...#",
            "#.....#,,,,#...>",
            "#..C..p,,,,#.,.#",
            "#.....#,,x,#...#",
            "#.....#,,,,p...#",
            "#.....#,,,,#.C.#",
            "################" ],
      walk:'.,p><', triggers:{'>':'c4_to_daru'}, start:{x:2,y:6},
      npcs:[ {id:'rallick', name:'A man on the ridge', kind:'rallick', x:14, y:10, still:true, node:()=>S.f.c4_rallick?'c4_rallick_again':'c4_rallick', show:()=>!S.f.c4_key, fresh:()=>!S.f.c4_rallick},
             {id:'crokus', name:'Someone running', kind:'crokus', x:8, y:2, node:()=>'c4_crokus', show:()=>!S.f.c4_crokus, fresh:()=>true} ] },

    /* . roof tile  , slate  # drop / open air  p plank  C chimney  x washing-line post  < exit west (back to the Gadrobi roofs; after the choice, down) */
    { id:'roofs_daru', title:'Darujhistan · the Daru roofs', sub:'Night · two roofs over', hint:'Tap roof to move · tap a figure to talk · Kalam\'s roof is the far one · down is west', decor:'roof_night',
      map:[ "################",
            "#...#...C.#....#",
            "#...#.....#.C..#",
            "#...p.....p....#",
            "#.C.#..x..#....#",
            "#...#.....#....#",
            "<...#.,,,.p....#",
            "#...#.....#.x..#",
            "#...p..C..#....#",
            "#...#.....#....#",
            "#.x.#.....#..C.#",
            "################" ],
      walk:'.,p><', triggers:{'<':'c4_back_west'}, start:{x:1,y:6},
      npcs:[ {id:'kalam', name:'Kalam', kind:'kalam', x:13, y:5, still:true, node:()=>'c4_meet', show:()=>!S.f.c4_meet, fresh:()=>true},
             {id:'guild1', name:'Guild men', kind:'assassin', x:14, y:4, still:true, node:()=>'c4_guildmen', show:()=>!!S.f.c4_meet && !(S.f.c4_key === 'aside' && S.f.c4_guildmen), fresh:()=>!!S.f.c4_key && !S.f.c4_guildmen},
             {id:'guild2', name:'Guild men', kind:'assassin', x:14, y:7, still:true, node:()=>'c4_guildmen', show:()=>!!S.f.c4_meet && !(S.f.c4_key === 'aside' && S.f.c4_guildmen)},
             {id:'qb', name:'Quick Ben', kind:'qb', x:9, y:4, node:()=>'c4_qb_after', show:()=>!!S.f.c4_key && !S.f.c4_qbAfter, fresh:()=>true},
             // after the hold, Vell is where the text has him: propped against the cracked pot on the squad's roof
             {id:'vell', name:'Vell', kind:'vell', x:6, y:8, still:true, node:()=>'c4_vell_roof', show:()=>S.f.c4_key === 'shield', fresh:()=>!S.f.c4_vellRoof} ] } ],

  battles:{
    guild_roofs:{title:'The Gadrobi roofs', warrenText:'Open air on every side · the blue haze below · warrens steady', warren:{meanas:1.1,denul:1}, dark:true, music:'dark', style:'roof',
      map:["#......#","...##...","........",".#....#.","........","##....##","........","...,,...","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildknife',1,1],['guildknife',6,1],['guildknife',3,2],['guildveteran',4,0]], xp:200, after:'c4_after_guild',
      waves:[{round:2, foes:[['guildknife',6,0]], text:'Another comes up over the gutter.'}],
      // Kettle's sharper, away from the edge as Fiddler said: the ridge-slates go into an attic (a hole between them and you), and every Guild ear on the Gadrobi roofs hears Moranth clay
      preText:()=>`It goes off on the ridge, away from the edge, the way Fiddler said, and a whole run of slates goes with it, down into somebody's attic. There is a hole in the roof between you and them now. And every Guild ear on the Gadrobi roofs has just heard a Moranth sharper${SQUAD().includes('kettle') ? `. "Oh," says Kettle. "Oh, that *carried*."` : '.'}`,
      preFx:B=>{ preTile(3,4,'#'); preTile(4,4,'#'); preWave(2, [['guildknife',1,0]], 'And one more, over the far gutter, come at the noise of the sharper.'); },
      stage2:{title:'The tannery ridge', warrenText:'A ridge two boots wide · the hide-yards far below · warrens steady',
        text:()=>`The way east is the tannery ridge: a spine of old lead forty paces long and two boots wide, with the hide-yards a long way down on either side and the smell of them coming up like heat off a fire. A body was found on this ridge two mornings ago, face-down, knives still in the sheaths. Nobody has been up to scrub the place.

They didn't all come across the planks. At the far end, where the ridge meets the plank to the Daru roofs, a crossbow is braced on the chimney-stack, and between it and you, where the ridge is narrowest, there are two more in soot-black, waiting.${preUsed('guild_roofs') ? ' They heard the sharper. They have had the whole of the fight to choose their ground.' : ''} Nobody needs telling what a ridge two boots wide is for.${SQUAD().includes('brisk') ? ` Brisk unslings the shield and goes to the front without being asked. "One at a time," she says. "Theirs and ours."` : ''}`,
        map:C4_RIDGE, party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['guildbow',3,0],['guildknife',3,2],['guildveteran',4,4]],
        waves:[{round:2, foes:[['guildknife',1,9]], text:'One comes up a drainpipe behind you, quiet as a cat.'}] } },
    guild_roofs_2:{title:'The Gadrobi roofs', warrenText:'Open air on every side · the blue haze below · warrens steady', warren:{meanas:1.1,denul:1}, dark:true, music:'dark', style:'roof',
      map:["#......#","...##...","........",".#....#.","........","##....##","........","...,,...","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildknife',1,1],['guildknife',6,1],['guildknife',4,2]], xp:200, after:'c4_after_guild',
      // the same fight after the shout: the same hole in the roof, and the older one who went back to tell somebody about a Malazan squad that shouts hears Moranth clay and comes back
      preText:()=>`It goes off on the ridge, away from the edge, and a run of slates goes with it, down into somebody's attic: a hole in the roof between you and them. On the far plank, the older one who went back to tell somebody about a Malazan squad that *shouts* stops dead, and turns round.${SQUAD().includes('kettle') ? ` "I've undone it," Kettle says. "Haven't I. The shouting."` : ''}`,
      preFx:B=>{ preTile(3,4,'#'); preTile(4,4,'#'); preWave(2, [['guildveteran',4,0]], 'The older one comes back over the plank. He heard the sharper. He has finished deciding.'); },
      // the shout reached the ridge too: the crossbow at the end of it takes a breath to decide, and the squad gets the breath
      stage2:{title:'The tannery ridge', warrenText:'A ridge two boots wide · the hide-yards far below · warrens steady', surprise:'p',
        text:()=>`The way east is the tannery ridge: a spine of old lead forty paces long and two boots wide, with the hide-yards a long way down on either side and the smell of them coming up like heat off a fire. A body was found on this ridge two mornings ago, face-down, knives still in the sheaths.

At the far end, where the ridge meets the Daru plank, a crossbow is braced on the chimney-stack. ${preUsed('guild_roofs_2') ? `He heard the shouting, and then he heard the sharper, and you can see him trying to make the two into one squad: the bow up and not quite on you, and a long breath in which a Malazan who shouts its own name and a Malazan who throws Moranth clay will not fit together in his head.` : `He heard the shouting. You can see him hearing it still: the bow up and not quite on you, and a long breath in which he decides whether a Malazan who shouts its own name is a Malazan who kills Guild.`} The two on the ridge in front of him have already decided. You get the breath.${S.f.c4_shouter === 'kettle' && SQUAD().includes('kettle') ? ` "That's *mine*," Kettle whispers. "That breath. I shouted for that."` : ''}`,
        map:C4_RIDGE, party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['guildbow',3,0],['guildknife',3,2],['guildknife',4,4]] } },
    andii_roof:{title:'Two roofs over', warrenText:'Kurald Galain pours off the Spawn · Meanas drowns in it · Denul gutters', warren:{meanas:1.5,denul:0.7}, dark:true, music:'dark', style:'roof',
      map:["#......#","........","..#..#..","........","#......#","........","...,,...","#......#","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['andiihunter',4,1]], xp:220, after:'c4_after_andii',
      objective:{type:'survive', rounds:3, text:'Stand between them. Hold the roof for three rounds.'},
      allies:[['vell',6,8]],
      waves:[{round:2, foes:[['andiihunter',6,0]], text:'A second shape. It does not hurry.'}],
      // the flash at its feet: the dark it wears is burned off it for the fight (no Kurald Galain cloak), but everyone looked it in the face, and the sapper who threw it looked longest
      preText:()=>`For one white heartbeat the whole of the tall shape is lit: the long hands, the silver hair, and the face, the one Kalam told you not to look at. Everybody looks. The dark it wears is burned off it, and it does not put it back on.${SQUAD().includes('kettle') ? ' Kettle is still looking.' : ''}`,
      preFx:B=>{ const a = foes().find(f => f.id === 'andiihunter'); if (a) { a.darkened = true; a.darkUntil = -1; }
        const k = B.units.find(u => u.side === 'p' && !u.ally && u.id === 'kettle') || B.units.find(u => u.side === 'p' && !u.ally); if (k) k.stun = true; } },
    reprisal:{title:'The alley under the roofs', warrenText:'No lamps · wet stone · Meanas leans into the dark · Denul holds', warren:{meanas:1.3,denul:1}, dark:true, music:'dark', style:'city',
      map:["##....##","........",".#....#.","........","...##...","........","#......#","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildknife',1,1],['guildknife',6,1],['guildveteran',3,0],['guildveteran',4,0]], xp:220, after:'c4_after_reprisal',
      waves:[{round:2, foes:[['guildknife',2,0]], text:'Another comes down off the roofs.'}],
      // a sharper down a lane two shoulders wide: the eaves come down and pinch the lane to two gaps, but the lane throws the blast back up at the front rank, and the Watch hear it
      preText:()=>`The lane does the rest. Two shoulders wide, with nowhere for the blast to go but along it, both ways: the warehouse eaves come down in the narrow part, and the brick comes back up the lane at you. Somewhere toward the Daru District a Watch rattle starts, and another answers it.`,
      preFx:B=>{ preTile(2,4,'#'); preTile(5,4,'#');
        const front = B.units.filter(u => u.side === 'p' && !u.ally && u.hp > 0).sort((a, b) => a.y - b.y || Math.abs(a.x - 3.5) - Math.abs(b.x - 3.5)).slice(0, 2);
        front.forEach(u => hurt(u, roll(1,4))); if (front.length) blog(`${front.map(u => u.name).join(' and ')} ${front.length > 1 ? 'take' : 'takes'} the brick in the face.`); },
      stage2:{title:'The cooperage yard', warrenText:'Barrels and drying-racks · one hooded lamp · Meanas leans into the dark · Denul holds',
        text:()=>`The lane gives out under an arch into a cooperage yard: staves in drying-racks taller than a man, barrels stacked in pyramids, a loading-gallery along the back wall with a hoist-beam over it, and one lamp, hooded, on the gallery steps. The old man has gone through the arch ahead of you with a hand pressed to his ribs, and the yard is not empty.${preUsed('reprisal') ? ' Behind you the brick-dust is still settling in the lane, and the Watch rattles are getting closer, and everyone in this yard heard what the Fourth answered the Guild with.' : ''}

Ocelot sent more than four. A crossbow on the gallery steps. Two more in soot-black among the barrels. And at the heart of the yard, between the stacks where there's room to swing, a broad one with a Guild blade in each hand, unhurried, waiting for you to come to him.${SQUAD().includes('ellis') ? ` Ellis, very low: "They wanted us through the lane first. To be sure we'd come on."` : SQUAD().includes('kettle') ? ` Kettle, very low, counting: "Four. Ocelot counts better than we do."` : ''}`,
        map:["##..#..#","#......#","#.##.#.#","........",".#..##..","...,....","..#...#.","........","#......#","##....##"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['guildbow',6,0],['guildveteran',4,3],['guildknife',1,3],['guildknife',6,4]],
        waves:[{round:2, foes:[['guildknife',0,5]], text:'Another drops off the yard wall among the barrels.'}] } },
    /* the way home: a Guild clan with no master left to tell it no, coming over the Daru ridge after the squad (both roads) */
    c4_clan:{title:'The plank home', warrenText:'Open air under the planks · Kurald Galain still in the slates · Meanas uneasy · Denul holds', warren:{meanas:1.2,denul:0.9}, dark:true, music:'dark', style:'roof',
      map:["#......#","........","#......#","##p##p##","##p##p##","##p##p##","#......#","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildbow',6,1],['guildveteran',3,1],['guildknife',2,2],['guildknife',5,2]], xp:200, after:'c4_after_clan',
      waves:[{round:2, foes:[['guildknife',3,0]], text:'Another comes over the Daru ridge, late, and running.'}],
      // a sharper on the Daru ridge cracks a gas flue: fire on the ridge behind them for two rounds, but it lights the planks for their crossbow, and a Daru house burns (the Watch, Fiddler's order)
      preText:()=>`It goes off on the Daru ridge, away from the edge, and cracks a gas flue on the way: fire comes up out of the chimney-stack behind them, blue at the root and yellow at the top, and the ridge is lit like a stage. So are the planks. Their crossbow can see every one of them now.${SQUAD().includes('kettle') ? ` "It's a *sharper*," Kettle says. "Sharpers don't—" The gas finds it. Fiddler said it would.` : ' The gas finds it. Fiddler said it would.'}`,
      preFx:B=>{ [[2,0],[3,0],[4,0],[3,1],[4,1]].forEach(([x, y]) => preFire(x, y, 2, 'the burning flue')); const bow = foes().find(f => f.id === 'guildbow'); if (bow) bow.atk += 2; } } },

  foes:{ guildknife:{name:'Guild assassin', sig:'a', hp:14, ac:15, atk:6, dmg:[1,8,2], rng:1, mv:6, init:5, verb:'cuts at'},
         guildveteran:{name:'Guild veteran', sig:'A', hp:24, ac:16, atk:7, dmg:[1,10,3], rng:1, mv:6, init:6, verb:'opens'},
         guildbow:{name:'Guild crossbow', sig:'b', kind:'xbow', hp:12, ac:14, atk:6, dmg:[1,8,1], rng:5, mv:4, init:5, sk:['pin'], verb:'looses a quarrel at'},
         andiihunter:{name:'Tiste Andii', sig:'T', hp:60, ac:17, atk:8, dmg:[2,6,3], rng:1, mv:6, init:7, boss:true, attacks:2, verb:'takes apart', verb2:'turns and cuts again at'},
         vell:{name:'Vell', sig:'v', hp:10, ac:13, atk:4, dmg:[1,6,1], rng:1, mv:6, init:4, verb:'stabs at'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    guildtoken:{name:'Guild token', slot:'trinket', who:null, stat:{guile:1}, line:'A disc of black horn the size of a thumbnail, with a hole through it and nothing carved on it at all. Vell says it opens a door. He does not say which door, or who is behind it, or what they will think of a Malazan holding it.'},
    ropehook:{name:'Journeyman\'s rope-and-hook', slot:'trinket', who:['ellis','sgt','kettle'], mv:1, line:'Thirty feet of tarred line and a three-pronged hook, wrapped in rag so it does not ring on slate. A Guild journeyman\'s kit. The rag is new. The journeyman is not going to need it.'},
    guildblade:{name:'Guild blade', slot:'weapon', who:['sgt','ellis','kettle'], atk:1, line:'A short straight blade blackened with lamp-soot, the edge left bright. No guard to catch on a gutter. Made to be carried up a drainpipe in the teeth, and it has been.'},
    andiicloak:{name:'Andii-grey cloak', slot:'armour', who:['tuft'], ac:1, line:'Grey, the grey of ash on a cold hearth, and lighter than cloth should be. It does not quite take the lamplight. Nobody but Tuft will put it on. Nobody else has been asked, and nobody else has offered.'} },

  // the chapter's own lines on the end screen, after the engine's
  extras:()=>{ const f = S.f, x = [];
    if (f.c4_skyCreak) x.push('Old glass creaked on the Gadrobi roofs, and a girl in a grey shawl was standing in the tallow-yard when the Fourth came down. Nobody had told her where to stand.');
    if (f.c4_rallickTail) x.push(`${SQUAD().includes('ellis') ? 'Rallick Nom' : 'The man on the ridge'} took his eyes off his window to watch the Fourth instead. Whatever he saw, his clan-master has it now.`);
    if (f.c4_shoutFailed) x.push('The Fourth shouted its own name across the Gadrobi roofs and nobody believed it. The Guild carried the word to Kalam\'s parley and set it down there like a knife.');
    if (f.c4_cantFar) x.push('Kalam sent the Fourth a roof further back with one hand. He has not said why. He will not.');
    if (f.c4_plankDown) x.push('A Guild plank went down into a Gadrobi lane on the night the Guild lost its roofs. The Guild counts its planks.');
    if (f.c4_ropeDown) x.push(f.c4_key === 'shield' ? 'A Guild line came down off a Gadrobi chimney under the Fourth\'s hands. Vell strung it, two nights ago. He saw it hanging in the lane, and very carefully did not ask.' : 'A Guild line came down off a Gadrobi chimney under the Fourth\'s hands. The Guild had it taken in before the Fourth reached the lane, and brought it to the alley.');
    // what Kettle's sharpers did up there, and the Andii that went down
    if (preUsed('guild_roofs') || preUsed('guild_roofs_2')) x.push('A Moranth sharper went off on the Gadrobi roofs while Kalam stood on his with his hands empty. The Guild knows the sound now. So does an old woman in an attic with a hole in the roof.');
    if (preUsed('andii_roof')) x.push('Kettle lit a Tiste Andii up like a lamp, and the Fourth looked it in the face. Kalam told them not to.');
    if (heldDowns('andii_roof') > 0) x.push(`${heldDowns('andii_roof') > 1 ? 'Two Tiste Andii' : 'A Tiste Andii'} went down on the leads of a Daru roof under the Fourth's blades, and got up, and went elsewhere. They live a very long time. They remember roofs.`);
    if (preUsed('c4_clan')) x.push('A chimney burned blue on the Daru ridge in the small hours. The Watch said the gas. Fiddler has not said anything yet, at length.');
    if (preUsed('reprisal')) x.push('The Guild came to an alley with knives, to ask a question. The Fourth answered with Moranth clay, and the Watch rattles went on till dawn.');
    return x; },

  dlg:{
    /* ---- opening: the briefing, under the crossing ---- */
    c4_start:()=>({sp:'Whiskeyjack · Bridgeburners', scene:'cellar', fx:()=>{ S.f.c4_briefed=1; if (S.f.c3_key === 'report') S.f.c4_kalamLook=1; }, txt:
`He does it in the vault, under the crossing, with the pipes hissing on every side and Hedge's munitions sleeping in the walls, because it is the one place in Darujhistan nobody will come to listen. The lantern is on a crate. Whiskeyjack is standing. You have not often seen him stand for a thing he could have said sitting.

Kalam is by the ladder, with his hood down, doing nothing with his hands. Quick Ben is on a crate with a sack across his knees: a plain grain sack, knotted at the neck with a sailor's knot, that he has not put down since you came in. Fiddler leans on the pipes where he can see all of you at once.

"Kalam's going up tonight," Whiskeyjack says. "Onto the roofs. Alone. He's going to put up a signal, and some people are going to come and answer it, and he's going to talk to them. Doesn't matter who. Doesn't matter what about."

"You're going up two roofs over. You watch. You do not help." The grey eyes go round the squad and come back to you. "If it goes wrong you come down, and you tell me how."

${S.f.wjRegard > 0 ? `A pause. "I'm sending you because I trust you to watch and not do anything about it. That's harder than it sounds. Most soldiers can't. I think you can."` : S.f.wjRegard < 0 ? `A pause. "I'm sending you because every other squad I've got is busy. I'd like that understood. It's not a compliment. It's a roster."` : `A pause, in which he doesn't say why it's you. You get the feeling he's decided not to know himself.`}

${S.f.c3_wjTold ? `"And Sergeant." He doesn't look at Kalam. "The Guild has a grey-haired dye-seller's name now. Somebody made sure of it." Kalam, at the ladder, laughs: once, low, like a knife going back into a sheath, and that is all the thanks you will ever get for the alley behind the blue hand.` : ''}`,
      ch:[{t:'"Sir."', go:'c4_start_kalam'},
          {t:'"Why watch, sir, if we can\'t help?"', go:'c4_start_why'}]}),
    c4_start_why:()=>({sp:'Whiskeyjack', txt:
`He looks at you for as long as it takes a pipe to hiss.

"Because if it goes wrong, I'll want to know which way. Kalam won't tell me. Kalam will tell me it went fine, with a knife in him, because that's Kalam." Kalam, at the ladder, does not disagree. "Quick will tell me a story. It'll be a good story. Some of it will be true."

"You'll tell me what you saw. In order. Without anything in it that isn't so." ${S.f.c3_wjTold ? `Very slightly, the corner of his mouth moves. "You've done it before."` : S.f.wjRegard < 0 ? `"You can do that, I'm told. I'd like to find out."` : `"That's all a squad two roofs over is for. Eyes, and a mouth afterwards."`}

"And if you're up there and you think, *I could help* — that's the moment you're most use to me by not moving. Remember that. It'll feel like cowardice. It isn't. It's the job."

${SQUAD().includes('brisk') ? `Brisk, behind you, very quietly: "Watching's a shield-wall that doesn't get to lift the shield." Nobody answers her. Fiddler nods, once, as if she'd said a true thing he'd been trying to put into words for years.` : ''}`,
      ch:[{t:'"Sir."', go:'c4_start_kalam'}]}),
    c4_start_kalam:()=>({sp:'Kalam', txt:
`Kalam pushes off from the ladder and comes past you on his way up, and he stops, because you are in the way, or because he meant to.

${S.f.c4_kalamLook ? `He looks at you a beat too long. Not at your face; at the space behind it, the way he looked at the rooftops two nights ago, the way a man looks at a treeline where the trees have archers.

He knows. Not what, and not who. Only that somebody in this squad has sat at a table with the Claw and come away lighter by something, and that the Claw now knows a little more about a hole in the Gadrobi crossing than it did a week ago. He was Claw himself. He can smell it on a squad the way Ohl smells rot in a wound.

He says nothing about it. Not tonight, and not for a long while. That's the worst thing he could have done, and he does it perfectly.` : `He looks at you, briefly, the way he looks at everything: as if measuring the distance to it and the time it would take to cross.`}

"Two roofs over," he says. "West of me. There's a chimney with a cracked pot on it. Sit behind it. When the people I'm meeting come, they'll come from every direction but that one, because that roof's got a skylight on the next one and nobody likes a skylight at their back." A pause you could fit a knife in. "Don't sit on the skylight."

"And whatever happens, you don't make a sound. Slate carries. It carries further than you'd think, to people you'd rather it didn't."

"If something comes over the roof that isn't one of mine and isn't one of theirs," he says, "you'll know it. Don't look it in the face."`,
      ch:[{t:'"What\'s been killing them, Kalam?"', go:'c4_kalam_ask'},
          {t:'Let him go.', go:'c4_start_qb'}]}),
    c4_kalam_ask:()=>({sp:'Kalam', txt:
`He doesn't answer for a long moment. Somewhere in the pipes something ticks, cooling.

"I don't know," he says. It costs him. You can see it cost him; Kalam is a man who has built his life on knowing, and he has come down a ladder into a vault full of munitions to say *I don't know* to a marine sergeant.

"Somebody's taking the Guild apart. On the roofs. At night. Quietly. Clan-masters. Journeymen. Runners, even. The Guild thinks it's us. Why wouldn't it? Empire comes to a city, the knives in the city start dying." He turns the hood up. "They won't talk to me while they think I'm the one with the knife. So I go up, and I stand where they can see me, and I show them empty hands, and I hope."

"It's not us, Sergeant. I'd know. Whatever's up there, it's not ours, and it's very, very good."

${SQUAD().includes('tuft') ? `Tuft has gone still in the lantern light. Not frightened. Listening, the way she listened in the collapsed junction under the Pale, to something the rest of you could not hear.` : ''}

He goes up the ladder. He doesn't look back. He doesn't make a sound on the rungs.`,
      ch:[{t:'Quick Ben.', go:'c4_start_qb'}]}),
    c4_start_qb:()=>({sp:'Quick Ben · squad mage', txt:
`Quick Ben has not got up. He's watching the ladder where Kalam went, with the sack across his knees and both hands resting on it, lightly, the way you'd rest your hands on a dog that might bite.

"I'll be going up after him," he says, to nobody. "Not straight after. A little after. There's a trick to *a little after*. Too soon, and you're company. Too late, and you're a mourner." He smiles at the ladder. "I've been both. Company's better."

The sack moves.

Not much. A shift, the way a sack of grain settles when it's put down. Except it has been down for as long as you've been in the vault, and grain doesn't settle twice. Quick Ben's hands don't move on it. His smile doesn't move either.

${S.f.c3_qb && S.f.c2_croneSaw ? `"Sergeant." Lightly. "Last time I told you to be less interesting. You haven't managed it. I'd keep trying."` : `"Sergeant." Lightly. "You're the baggage. I'm told the baggage is reliable. I'd like that to go on being true tonight."`}`,
      ch:[{t:'"What\'s in the sack?"', go:'c4_qb_sack'},
          {t:'Fiddler wants a word.', go:'c4_start_fid'}]}),
    c4_qb_sack:()=>({sp:'Quick Ben', txt:
`"Insurance," says Quick Ben.

He says it pleasantly. He says it the way a man says *rain* when asked what the weather will do. He doesn't look at the sack, and he doesn't look at you, and the sack lies very still across his knees for the whole of the sentence, as if it were listening.

Then, from inside it, very small, very dry, a sound. Wood on wood. A tick, like a knuckle on a table.

Or a laugh, if a laugh were made of kindling.

Quick Ben's hand closes on the knot.

"Don't," he says, conversationally, and you're not sure it's you he's talking to. The sack goes still.

${SQUAD().includes('tuft') ? `Tuft has taken a step back. She hasn't noticed she's done it. "There's someone in there," she says, very low, to you and not to him. "Not a someone. A *used-to-be*. Tied up in string." Quick Ben's eyes flick to her and away, and something in his face is, for a moment, almost apologetic.` : SQUAD().includes('ohl') ? `Ohl has taken a step back. Ohl, who has had his hands inside more dying men than anyone in the Host, has taken a step back from a grain sack.` : ''}

"Insurance," Quick Ben says again, and stands, and tucks the sack under his arm, and goes to wait at the foot of the ladder, humming.`,
      ch:[{t:'Fiddler.', go:'c4_start_fid'}]}),
    c4_start_fid:()=>({sp:'Fiddler · sapper', txt:
`Fiddler catches your sleeve at the ladder. He keeps his voice under the hiss of the pipes.

"Roofs," he says. "Listen. I've done roofs. Pale, before the Moon came. Genabaris. Here's roofs, Sergeant, all of it: *slate's a liar*. Looks like a floor. It's a floor laid by somebody who hated you. Wet slate you slide on, dry slate cracks under a heel and the crack goes down to the street and takes your ankle with it."

"Planks between roofs, you cross one at a time. *One.* Nobody waits in the middle. Nobody looks down to see how far down is." He lets go of your sleeve. "And the cusser." He looks past you at Kettle's satchel. "She's not to throw it up there. Not a sharper near the edge, not a burner anywhere. You set fire to a roof in this city and the gas finds it, and then there's no city, and then Whiskeyjack's annoyed."

${SQUAD().includes('kettle') ? `Kettle, who has heard every word, looks at him with the expression of a woman being told not to breathe. "Fiddler," she says. "I *know*." He looks back at her. "I know you know," he says. "I'm telling you so you'll remember I told you."` : ''}`,
      ch:[{t:'"Ellis. You\'ve been up there."', req:()=>SQUAD().includes('ellis'), go:'c4_start_ellis'},
          {t:'Up the ladder.', go:()=>{ startExplore('roofs_gadrobi'); talk('c4_roofs_arrive'); }}]}),
    c4_start_ellis:()=>({sp:'Ellis', fx:()=>{S.f.c4_ellisRoofs=1;}, txt:
`She's by the ladder, drawing her glove tighter at the wrist, which is a thing she does before she climbs.

"The Gadrobi roofs. Yes." Not looking at you. "Two years ago. We were counting Guild safe-houses for the Claw, from above. Six of us. Every night for a month." She flexes the gloved hand. "Four of us came down."

"I know the planks. Some of them are the same planks. The Daru never replace a thing that's still holding." A breath. "I'll go first across anything that looks like a plank, Sergeant. That's not me being brave. That's me knowing which ones hold and not wanting to tell you from the other side."

${S.f.c3_ellisMsg ? `She finally looks at you. "The boy from the well. He was on these roofs too, that month. Seventeen. They sent him across first because he was the lightest." Her face does nothing. "He was very light."` : `She finally looks at you. "They'll know we're up there. The Guild. They know every foot on every roof in this city. They'll know we're not theirs, and they'll decide what that means, and they won't ask us first."`}`,
      ch:[{t:'Up the ladder.', go:()=>{ startExplore('roofs_gadrobi'); talk('c4_roofs_arrive'); }}]}),

    /* ---- the Gadrobi roofs ---- */
    c4_roofs_arrive:()=>({sp:'The Gadrobi roofs', scene:'roof_night', txt:
`Up the ladder, up through the chandler's loft, up the chimney-stair that the chimney-sweeps use, and out through a hatch onto the roof. And then you are standing on Darujhistan.

It goes on forever. That's the first thing. Roofs, in every direction, flat and pitched and domed, joined by planks and gutters and washing-lines and ladders lashed to chimneys, a second city on top of the first, with nobody in it. Below, the blue haze of the lamps comes up between the houses like water in a flooded field, and you cannot see the bottom of any of it.

Above, the Moon's Spawn. You are closer to it here. It is so large that it has weather: a smear of cloud caught on one of its towers, not moving, as if even the wind is afraid to pull it free.

${SQUAD().includes('tuft') ? `Tuft stops dead on the hatch-step. She looks up at it. She has been in its shadow for a month and never, you realise, this close. "It's *breathing*," she says, very quietly. "Not the stone. The dark around it. It's coming off it like cold off ice."` : `Kettle looks up at it and then, carefully, down at her own feet. "I'm going to look at slates," she says. "Slates I understand."`}

Close by, a skylight glows: a square of warm yellow in the grey, somebody's lamp in somebody's room below. East, over two planks and a gutter, the roofs go on toward the Daru District, and Kalam, and the job.`,
      ch:[C4H.sky('Look through the skylight.'),
          {t:'"Ellis. Which planks?"', req:()=>SQUAD().includes('ellis') && !S.f.c4_planks, go:'c4_planks'},
          {t:'Across the roofs.', go:()=>startExplore()}]}),
    c4_sky_ok:()=>({sp:'The skylight', fx:()=>{S.f.c4_sawSorry=1;}, txt:
`${by({
  ohl:`Ohl gets there first. He kneels at the edge of the glass the way he kneels at a cot, one knee and then the other, slowly, and wipes a circle in the soot with his sleeve, and looks for a long time before he shifts over to make room for you.`,
  tuft:`Tuft gets there first. She lies flat on the slates with her cheek a finger's width off the glass, and goes still, and after a moment reaches back without looking and pulls you down beside her by the sleeve.`,
  kettle:`Kettle gets there first, on her belly, arms and legs spread wide on the slates to share her weight out, which is a thing sappers know about roofs and nobody else bothers to. "Like a frog," she breathes. "Get down. Be a frog."`,
  ellis:`Ellis gets there first. She doesn't kneel on the glass; she kneels on the lead between the panes, where the frame carries the weight, with her gloved hand in her lap. Then she moves over an inch, which from Ellis is an invitation.`,
  sgt:`You kneel at the edge of the glass.`,
  _:`{who} gets to the glass first, and kneels at the edge of it, and after a while makes room for you.`})} Old glass, green and full of bubbles, but you can see.

A tavern's back room. A table. On the table, cups, and a plate with the ruin of a pastry on it, and a fat man in a red waistcoat asleep in his chair with his chin on his chest and his hands folded over his stomach like a man laid out for a funeral he intends to enjoy.${S.f.c3_kruppeMet || S.f.c3_inn ? ` Kruppe. Of course it is.` : ''}

And in the doorway of the room, a girl.

A plain face. A grey shawl. She is standing in the doorway with her hands folded in front of her, looking at the sleeping man, and she does not move. Not the stillness of someone waiting. The stillness of a thing that has been put there, and will be there until it is picked up again. You watch her for the space of ten breaths. She does not blink once.

Then she lifts her eyes, and looks up, through the bubbled glass and the dark, directly at ${by({sgt:'you', _:'the two of you'})}.

She can't see ${by({sgt:'you', _:'either of you'})}. The glass is lamplit on her side and black on yours. She looks a moment longer, as if reading a line on a page, and then turns back to the fat man.

${by({
  ohl:`Ohl sits back on his heels. "That child," he says, and stops. He has called everyone *child* for twenty years, and he hears himself do it, and doesn't like it. "That isn't a child. It has a child's hands." He wipes his palms on his knees, slowly, as if he'd touched something. "She's not watching him, Sergeant. She's watching for whoever comes to sit with him. I'd not like to be the next one through that door."`,
  kettle:`Kettle comes off the glass backwards, on her elbows, very fast. "She looked *up*," she whispers. "Did you see? Through a window. At night. From the lit side. Nobody does that. You look at windows from the *dark* side, that's what dark's *for*." She's talking too fast and she knows it. "I'm fine. I'm talking. That's how I'm fine."`,
  tuft:`Tuft, at your shoulder, has stopped breathing. "It's her," she says. "The one from the crossing. The one with something inside." She takes her hand off the glass as if it had gone hot. "She's watching the door. Not him. Whoever comes to sit with him."`,
  _:SQUAD().includes('ellis') ? `Ellis, at your shoulder, has stopped breathing. "Sorry," she says. "That's the one from the crossing.${S.f.c3_inn ? ` And the fat one's the one from the Phoenix.` : S.f.c3_kruppeMet ? ` And the fat one's the one who talked at you in the street.` : ''}" Her gloved hand is flat on the slates. "She's not guarding him, Sergeant. Look at her. She's *watching his friends*. Whoever comes through that door next, she's already decided."` : `Tuft, at your shoulder, has stopped breathing. "It's her," she says. "The one from the crossing. The one with something inside." She takes her hand off the glass as if it had gone hot. "She's watching the door. Not him. Whoever comes to sit with him."`})}

You get up off your knees. Your knees are shaking. You tell yourself it's the slate.${nearMiss() ? `

Behind you, as the last of the weight comes off it, the old glass gives: a long thin creak, like ice on a pond in the first cold week. Below, the girl doesn't look up again. She doesn't need to.` : ''}`,
      ch:[{t:'"Ellis. Which planks?"', req:()=>SQUAD().includes('ellis') && !S.f.c4_planks, go:'c4_planks'},
          {t:'Away from the glass.', go:()=>startExplore()}]}),
    c4_sky_fail:()=>({sp:'The skylight', fx:()=>{ S.f.c4_skyCreak=1; S.f.c4_skyWho=ROLL().who; }, txt:
`The glass is old and thick and full of bubbles, and the room below bends in it like a room at the bottom of a well. A table. A lamp. A great round red shape in a chair that might be a man, asleep, or might be a pile of cushions, or a very large cat. A darker shape in what might be a door.

${by({
  ohl:`Ohl leans closer, and puts his weight on his palm the way he'd lean over a cot to listen to a chest. The glass creaks under it, a long thin sound like ice on a pond in the first cold week.`,
  tuft:`Tuft leans closer, until her breath fogs the pane, and puts a hand flat on it to steady herself. The glass creaks under her palm, a long thin sound like ice on a pond in the first cold week.`,
  kettle:`Kettle wriggles closer on her belly, and closer, and puts an elbow down on the glass without looking. It creaks, a long thin sound like ice on a pond in the first cold week, and she goes absolutely rigid.`,
  ellis:`Ellis shifts her knee onto the lead between the panes, the way she would have two years ago. The lead has had two more years. It gives, and the glass beside it creaks, a long thin sound like ice on a pond in the first cold week. "The Daru never replace a thing that's still holding," she says through her teeth. "This one's stopped."`,
  sgt:`You lean closer. The glass creaks under your palm, a long thin sound like ice on a pond in the first cold week.`,
  _:`{who} leans closer. The glass creaks, a long thin sound like ice on a pond in the first cold week.`})}

${SQUAD().includes('brisk') && ROLL().who !== 'brisk' ? `Brisk's hand is on ${by({sgt:'your', _:'{who}\'s'})} collar before the creak has finished. She doesn't pull. She just holds, and you understand that if the glass goes she has decided ${by({sgt:'you are', _:'{who} is'})} not going with it. "Kalam said don't sit on the skylight," she says. "Kneeling on it's sitting on it slower."` : `Kettle hisses from the hatch. "*Off.* That's a *window*."`}

When you look again the dark shape in the door isn't there. Or it's there and you can't see it. With that glass, you can't tell which, and you find you would rather not know.

Somebody down there heard the glass. You're as sure of it as you'd be of a step on the stair behind you in an empty house.`,
      ch:[{t:'"Ellis. Which planks?"', req:()=>SQUAD().includes('ellis') && !S.f.c4_planks, go:'c4_planks'},
          {t:'Away from the glass.', go:()=>startExplore()}]}),
    c4_planks:()=>({sp:'Ellis', fx:()=>{ S.f.c4_planks=1; if (SQUAD().includes('ellis')) loy('ellis',1); }, txt:
`She's already looking. She crouches at the edge of the roof where the first plank goes over to the next, and doesn't touch it, and reads it the way she read the prints on the plain.

"That one." The near plank, to the slate roof. "Oak. Tarred at the ends. That's a Guild plank; they tar them so they don't rot in the joints, and they don't let anyone else use them, so it's never been walked by anyone heavy." She glances at Brisk. "It'll hold her. Just."

"Not that one." A second plank, a little north, that looks newer and better. "That's bait. It's pine, cut to look like oak. Somebody's put it there for somebody who isn't looking. It'll hold half a man. It'll hold him right to the middle."

She stands, and brushes off her knees with her good hand.

"Two years and they haven't moved it. I told the Claw. Nobody told the Guild." She almost smiles. "So they're still catching people with it. That's Darujhistan. Nobody throws away a thing that works."
${!S.f.c4_skylight ? `
She nods at the yellow square of the skylight. "And if anyone's going to look through that, kneel on the lead between the panes. Not the glass. The lead's Guild work too. The glass is somebody's grandmother's."
` : ''}
${SQUAD().includes('brisk') ? `Brisk looks at the good plank for a long time. Then at Ellis. Then she steps onto it, and walks across it, one step at a time, with her shield on her back and her spear in her hand, and it bows under her like a bow drawn to the ear, and holds, and she steps off the far end and turns round and says: "Just."` : ''}`,
      ch:[{t:'Across the roofs.', go:()=>startExplore()},
          C4H.sky('Look through the skylight first.')]}),

    /* ---- Rallick Nom ---- */
    c4_rallick:()=>({sp:'A man on the ridge', fx:()=>{S.f.c4_rallick=1;}, txt:
`He is sitting on the ridge of the far roof with his back against a chimney and his knees drawn up, and you did not see him until you were close enough to spit on him, which is the first thing you notice about him and the last thing you'll forget.

A lean man, long in the leg. A dark plain coat, and a plain face under a plain cap, and a pair of hands resting on his knees, open, where you can see them, in a way that tells you he has thought about where you can see them. He isn't watching you. He's watching a house up the hill to the east, where the lamps are brass: one window with a light in it, high up.

"Go home, Malazan," he says, without looking round. "This isn't your war."

His voice is very tired and very level, the voice of a man who has been saying the same thing to himself for a long time and has stopped expecting to be believed.`,
      ch:[{t:'Ask him whose war it is.', check:['guile',12],
            edges:id=>[id === 'ellis' && ['the Claw has a page on him', 1], (S.f.c4_fewer || S.f.c4_shoutFailed) && ['you shouted across his roofs', -1], (preUsed('guild_roofs') || preUsed('guild_roofs_2')) && ['you set off a sharper on his roofs', -1]],
            near:{t:'Yes, but he takes his eyes off the window to answer, and they do not go back to it.', fx:()=>{ S.f.c4_rallickTail=1; }},
            clean:{t:()=>`${NAME(ROLL().who)} follows his eyes to the window: a big house on the brass-lamp hill, and a woman's shape crossing the light, and gone.`, fx:()=>{ S.f.c4_rallickWindow=1; }},
            go:'c4_rallick_ok', fail:'c4_rallick_miss'},
          {t:'"We\'re a road crew."', go:'c4_rallick_fail'},
          {t:'Leave him to his window.'}]}),
    c4_rallick_ok:()=>({sp:'A man on the ridge', fx:()=>{S.f.c4_rallickOk=1;}, txt:
`${by({
  tuft:`Tuft asks it. Not loudly: she sits down on the slates a little way off from him, the way you'd sit near a cat, and asks it of the window rather than of him. "Whose war is it, then?"`,
  ellis:`Ellis asks it, in Daru, quietly, with the Claw's flat vowels sanded off it. "Whose war, then? Not Ocelot's. Or you'd be watching the roofs, not the window."`,
  kettle:`Kettle asks it, straight out, with total conviction, as if she has a right to know and has been waiting all night to be told. "Whose war is it, then? Because everyone keeps saying it's ours, and *nobody asked us*."`,
  sgt:`"Whose war is it?" you ask.`,
  _:`{who} asks it, plainly. "Whose war is it, then?"`})}

He turns his head, then. Not far. Enough to look at ${by({sgt:'you', _:'{who}'})} out of the side of his eyes, the way a man looks at a dog that has just done something unexpectedly intelligent.

"Nobody's," he says. "That's the joke. There's a war on these roofs, and the Guild think it's your Empire's, and your Empire thinks it's the Guild's, and the dead don't get a vote." He looks back at the window. "Something came to the city with that mountain, Malazan. Something that doesn't talk. It's killing us because somebody told it to, and it's very good, and it doesn't care which of us it kills, because it isn't killing *us*. It's killing a door. Your Empress wanted to walk through the Guild. Somebody's bricking up the Guild so she can't."

A long breath.

"My own clan-master sent me up tonight to find out whose it is. I'm not looking. I've got my own business." The window, up on the hill. "I've had my own business for two years. I'm not going to put it down now for a war that isn't mine either."

He turns his face away. That's the end of it. You have the strong sense that you have been told more than he's said to anyone in a year, and that he'll kill you if you ever repeat it, and that he'd be sorry about it, and do it anyway.${nearMiss() ? `

Only he doesn't turn it back to the window. When you move off, his eyes come with you, all the way across the roof, the way a man keeps a hand near a knife he hasn't decided to draw.` : ''}

${SQUAD().includes('ellis') ? `Ellis, when you're three roofs away: "Rallick Nom. Ocelot's clan. The Claw has a page on him. Half of it's crossed out, because every time we thought we knew what he wanted, it turned out he wanted something else." A pause. "The window's the other half."` : ''}`,
      ch:[{t:'Leave him.'}]}),
    c4_rallick_miss:()=>({sp:'A man on the ridge', fx:()=>{ S.f.c4_rallickTail=1; }, txt:
`${by({
  tuft:`Tuft asks it, quietly, of the window rather than of him. It's a good question. It's the wrong voice: a cadre voice, a little too exact, the voice of someone who reads people for a living and doesn't mind if they know.`,
  ellis:`Ellis asks it, in Daru, and the Claw comes through it like a stain through paint: the flat vowels, the patience, the question that already knows half its answer.`,
  kettle:`Kettle asks it with total confidence, and then, because he doesn't answer, asks it again, and then explains why she's asking, at length, with her hands.`,
  sgt:`"Whose war is it?" you ask. It comes out like a sergeant's question, the kind with a right answer.`,
  _:`{who} asks it. It comes out like a question with a right answer.`})}

He doesn't answer. He takes his eyes off the window, for the first time, and puts them on ${by({sgt:'you', _:'{who}'})}: a long level look that starts at the boots and goes up and finds, somewhere around the collarbone, everything it was looking for.

"I was sent up tonight to find out whose it is," he says. "I wasn't going to look." A breath. "Now I'm curious."

"Go home, Malazan."

He doesn't turn back to the window. When you move off, his eyes come with you, all the way across the roof, and you can feel them on the back of your neck like a hand that hasn't decided to be a hand yet.

${SQUAD().includes('ellis') ? (ROLL().who === 'ellis' ? `Ellis, when you're three roofs away, very low: "Rallick Nom. Ocelot's clan. I knew the name, and I still asked it like a Claw." She doesn't look back. "We're his business now. I'm sorry."` : `Ellis, when you're three roofs away, very low: "Rallick Nom. Ocelot's clan." She doesn't look back. "We've just become his business. That's the one thing on these roofs I'd have paid not to be."`) : `Kettle, very low, as you move off: "He's still looking." Nobody turns round to check. Nobody needs to.`}`,
      ch:[{t:'Leave him.'}]}),
    c4_rallick_fail:()=>({sp:'A man on the ridge', fx:()=>{S.f.c4_rallickTwice=1;}, txt:
`He doesn't answer. He doesn't need to. He looks at you for the first time, fully, a long level look that starts at your boots and goes up and finds, somewhere around your collarbone, everything it was looking for.

"Road crew," he says. "On a roof. At the eighth bell. With a shield." He looks back at the window. "Darujhistan's full of road crews this month. They're all very bad at it."

"Go home, Malazan. I won't say it a third time. I'll be gone before you'd need me to."

${SQUAD().includes('kettle') ? `Kettle, very quietly, as you move off: "I like him." Brisk: "You like anyone who'd kill you politely." Kettle considers this. "Yes."` : ''}`,
      ch:[{t:'Leave him.'}]}),
    c4_rallick_again:()=>({sp:'A man on the ridge', txt:
`${S.f.c4_rallickTail ? `${S.f.c4_roofsFought ? 'He watched the knives on the planks, all of it, without moving. ' : ''}He isn't watching the window any more. He's watching you. He doesn't say anything. He's said all he means to.` : S.f.c4_roofsFought ? `He hasn't moved through any of it. Not the knives, ${S.f.c4_fewer || S.f.c4_shoutFailed ? 'not the shouting, ' : ''}${preUsed('guild_roofs') || preUsed('guild_roofs_2') ? 'not a Moranth sharper going off two roofs from him, ' : ''}not the bodies going off the edge. He's still watching the window up on the hill. A Guild man died forty paces from him and he didn't turn his head, and you understand, looking at him, that whatever he's waiting for is worth more to him than the whole of his Guild.` : `He's still watching the window. He doesn't look round. You have the feeling that you've used up your share of him, and that there wasn't much share to begin with.`}`,
      ch:[{t:'Leave him.'}]}),

    /* ---- Crokus, running ---- */
    c4_crokus:()=>({sp:'Someone running', fx:()=>{S.f.c4_crokus=1;}, txt:
`He has been crouched in the lee of the chimney, getting his breath, so still you took him for part of it. Then he looks back over his shoulder at something you can't see, and he's up and away at a dead run: slate going under a heel, a gasp, a scrabble, and he's past you close enough to touch, a thin dark shape with a bag over his shoulder that clinks, running the way only the young run, as if the drop on either side of him were something that happened to other people.

A boy. Dark hair in his eyes. For half a heartbeat, as he goes past the skylight, the yellow light catches his face${S.f.c3_innCrokus ? `, and you know it. The Phoenix. The coin walking across the backs of his knuckles. *You lived*, he said.` : S.f.c3_inn ? `, and you know it. The Phoenix: the boy at Kruppe's table, with the coin walking across the backs of his knuckles.` : `: young, and delighted, and terrified, all three at once, the face of a thief at the best moment of a thief's life.`}

He doesn't see you. He doesn't see anything. He goes over the gap to the next roof in one long leap, lands rolling, comes up running, and is gone.

And behind him, a heartbeat later, something tall.

It doesn't run. It moves across the roof you've just watched the boy cross as if the roof were level ground and the drop were nothing at all, and it is tall, taller than Brisk, and dark, and where the lamplight from below catches its head there is hair the colour of old silver.

${SQUAD().includes('ellis') ? `Ellis has an arrow on the string. You didn't see her draw. The bow is at full stretch and the point is on the tall shape's back and her lips are drawn away from her teeth.` : `Kettle has the crossbow up. You didn't see her lift it. The quarrel is on the tall shape's back and she's breathing through her teeth.`}

One word, and it goes into that back. You have perhaps half a heartbeat left to say it in.`,
      ch:[{t:'"No."', fx:()=>{S.f.c4_crokusNo=1;}, go:'c4_crokus_after'},
          {t:'Say nothing. Put your hand on the weapon.', go:'c4_crokus_quiet'}]}),
    c4_crokus_after:()=>({sp:'The Gadrobi roofs', txt:
`"*No.*"

${SQUAD().includes('ellis') ? `The bow comes down an inch. Ellis doesn't take her eyes off the tall shape, and the arrow doesn't come off the string, and she lets the draw out slowly, slowly, the way you'd let a door close on a sleeping room.` : `The crossbow comes down an inch. Kettle doesn't take her eyes off the tall shape, and doesn't take the quarrel off the rail, but her finger comes off the lever and goes flat along the stock, where it can't do anything by accident.`}

The tall shape does not look at you. It does not break stride. It goes over the gap after the boy, in one long step that should not be possible, and down the far side of the next roof, and is gone the way the boy went.

The roof is very quiet.

"Hood's breath," says Kettle at last. "Sergeant, that was—"

"I know what it was."

You don't, and she knows you don't, and she lets it go. Behind you, in the silence, somebody is breathing very fast, and after a moment you realise it's you.

${SQUAD().includes('tuft') ? `Tuft is looking at the place where the tall shape went over. "If you'd shot it," she says, quite calmly, "it would have turned round." That's all she says. It's enough.` : ''}`,
      ch:[{t:'On.', go:()=>startExplore()}]}),
    c4_crokus_quiet:()=>({sp:'The Gadrobi roofs', txt:
`You don't say anything. You reach out and put your hand flat on the ${SQUAD().includes('ellis') ? 'bow, over Ellis\'s gloved hand' : 'crossbow, over Kettle\'s hand'}, and push down. Not hard. Just down.

She lets you.

The tall shape does not look at you. It goes over the gap after the boy in one long step that should not be possible, and down the far side of the next roof, and the dark takes it the way water takes a stone: without a sound, without a ripple, as if it had always been there.

Nobody speaks for a long time.

${SQUAD().includes('brisk') ? `Then Brisk, very low: "Good." She says it to your hand, not to you. "You'd have put ${SQUAD().includes('ellis') ? 'an arrow' : 'a quarrel'} in that and it'd have come back for the rest of us. You'd have been a sergeant for another heartbeat."` : `Then Ohl, very low: "Good." He says it to your hand, not to you. "I didn't want to find out what that bleeds."`}

The boy with the bag is gone. The tall shape is gone. Somewhere a long way off, over the Daru roofs, somebody laughs, high and breathless, the laugh of a boy who has got away with something and does not yet know what it cost.`,
      ch:[{t:'On.', go:()=>startExplore()}]}),

    /* ---- exit east: Tuft's draw, then the Guild ---- */
    c4_to_daru:()=> S.f.c4_roofsFought ? {sp:'The plank east', txt:
`The plank over the last gap to the Daru roofs: oak, tarred at the ends. On the far side, the roofs rise toward the brass lamps, and somewhere up there is a chimney with a cracked pot on it, and Kalam.${!S.f.c4_ropeTried && !S.f.c4_meet ? `

Above the plank, from the chimney at your shoulder to a chimney on the Daru side, runs a line. Not a washing-line: tarred, taut, black against the haze, strung a man's height over the gap, where nobody walking a plank would think to look. Nobody in Darujhistan admits to stringing these. ${SQUAD().includes('ellis') ? `Ellis looks at it and then, carefully, away. "Guild," she says. "They don't walk on it. They don't fall off it, either."` : `Kettle looks at it with professional interest. "That's not for washing," she says.`}` : S.f.c4_ropeDown ? `

The line that ran over the gap hangs straight down the wall from the chimney now, into the dark, turning a little.` : ''}`,
      ch:[{t:'Across the Daru roofs, low, between the Guild\'s lanterns.', tag:'Roof run', req:()=>!S.f.c4_daruSeen, go:()=>playRoofRun({after:r => { S.f.c4_run = r.done ? (r.seen ? 'seen' : 'unseen') : 'walked'; startExplore('roofs_daru'); talk('c4_daru_arrive'); }})},
          {t:'Across to the Daru roofs.', go:()=>{ startExplore('roofs_daru'); if (!S.f.c4_daruSeen) talk('c4_daru_arrive'); }},
          {t:'The line overhead. Cross it the way the Guild does.', check:['might',16], trick:'rope', near:false, req:()=>!S.f.c4_ropeTried && !S.f.c4_meet, fx:()=>{ S.f.c4_ropeTried=1; },
            edges:id=>[id === 'kettle' && ['ran powder up Falari rigging', 2], id === 'ellis' && ['a month on these roofs, for the Claw', 2], id === 'brisk' && ['a shield and a spear on her back', -1]],
            go:'c4_rope_ok', fail:'c4_rope_fail'},
          {t:'Not yet.'}]} : (SQUAD().includes('tuft') && !S.f.c4_drawn && !S.f.c4_noCard) ? {sp:'Tuft', txt:
`At the edge of the roof, where the plank goes over to the Daru side, Tuft stops, and crouches, and takes the Deck out of her sleeve.

She doesn't ask. She's holding it face-down in both hands, and she's looking up at the Moon's Spawn, and her hands are not quite steady.

"Before we cross," she says. "One card. It's close, Sergeant. *Close.* I can feel it on my teeth, like the air before a storm. Kurald Galain. The Spawn's warren. It's coming off that thing like smoke off a pyre and it's in the slates and it's in the dark between the roofs." She swallows. "I want to know what's coming over the next roof before it comes. I'd like the Deck to tell me. I'd like *something* to."`,
      ch:[{t:'Let her draw.', fx:()=>{ S.f.c4_drawn=1; S.card = dealCard(['assassin','assassin','knight','knight','oponn','herald']); }, go:()=>cardSequence(()=>talk('c4_card'))},
          {t:'"Not up here. Not in the open."', fx:()=>{ S.f.c4_noCard=1; loy('tuft',-1); if (SQUAD().includes('brisk')) loy('brisk',1); }, go:'c4_card_no'},
          {t:'Not yet. Back from the edge.'}]} : {sp:'The plank east', txt:
`The plank over the last gap to the Daru roofs: oak, tarred at the ends. Beyond it the roofs climb toward the brass lamps. You put a foot on it.

Something moves on the far roof.`,
      ch:[{t:'Hold.', go:'c4_guild'},
          {t:'Not yet.'}]},
    c4_card:()=>{ const c = CARDS[S.card] || CARDS.oponn; return {sp:'The Deck of Dragons', scene:'roof_night', txt:
`Tuft lays the reading out on the slates, in the lee of a chimney, where the wind off the lake can't take the cards. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)}${c.fx ? ` · ${esc(c.fx)}` : ''}</div>`, oncard:[S.card || 'oponn',false],
      after:`${S.card === 'herald' ? `The Herald of High House Death. A figure in grey with its face turned away, holding a door open for somebody you can't see.

Tuft looks at it for a long moment, and then turns it face down on the slate, gently, the way you'd close a dead man's eyes. "It's not for us," she says. "It's for someone *near* us." She doesn't say anything else, and she doesn't put that card back in the Deck; she puts it in her other sleeve, by itself.` : S.card === 'knight' ? `A tall figure with a black sword, turned away.

Tuft doesn't put it back. She looks at it, and then up at the Spawn, and then at the card again, as if comparing them. "He's not watching the city tonight," she says. "He's watching the roofs."` : `${c.txt || ''}`}

${SQUAD().includes('ellis') ? `Ellis, who won't touch a Deck and never looks away from one, has watched. "Put them away," she says softly. "Something's on the next roof."` : `Kettle, very softly: "Tuft. Put them away. Something's on the next roof."`}`,
      ch:[{t:'Put the cards away.', go:'c4_guild'}]}; },
    c4_card_no:()=>({sp:'Tuft', txt:
`She doesn't argue. She squares the Deck with one finger and puts it back into her sleeve, and stands, and brushes the slate-grit off her knees.

"Yes, Sergeant."

${S.f.c3_noCard || S.f.c2_noCard || S.f.c1_noCard || S.f.noCard ? `She doesn't say anything about the other times. She's past saying it. She just looks at the Spawn, once, the way you'd look at a door you were not allowed to open, and walks to the plank.` : `She looks at the Spawn, once, the way you'd look at a door you were not allowed to open. "It'll come anyway," she says. "Whatever it is. I just wanted to see its face first."`}

She puts her foot on the plank.

Something moves on the far roof.`,
      ch:[{t:'"Hold."', go:'c4_guild'}]}),
    c4_guild:()=>({sp:'The plank east', scene:'roof_night', fx:()=>{ if (S.inv.cusser > 0) S.f.c4_cusserHeld=1; }, txt:
`They come over the chimneys on the far roof: four of them, three low and fast and one older who doesn't need to be, dark coats and soot-blackened blades, running the ridge the way Guild runners run it, bent double, one hand touching the slates every third stride. They see you. They stop.

For a moment nobody moves. You can see what they see: a squad of armed strangers on a Gadrobi roof, the night after a Guild clan-master was found on the temple dome with his throat opened. A shield. A crossbow. A woman with a Deck. Somebody's *helpers*.

The one in front says something in Daru, low and fast, and the others spread out along the ridge, and all four start across the planks toward you. Not hurrying. Knives down along the forearm, the Daru way. They've decided.

${SQUAD().includes('kettle') && S.inv.cusser > 0 ? `Kettle's hand has gone into her satchel. It comes out with a cusser in it, round and clay-grey, the Moranth seal black on the top. She looks at it. She looks at the roof under her feet. She looks at the house under the roof. And she puts it back.` : ''}`,
      ch:[C4H.shout('Shout it across the planks: "Malazan, you idiots! We\'re not who you\'re looking for!"'),
          {t:'"Kettle. The cusser—"', req:()=>SQUAD().includes('kettle') && S.inv.cusser > 0 && !S.f.c4_kettleNo, fx:()=>{S.f.c4_kettleNo=1;}, go:'c4_kettle_no'},
          {t:'"Brisk. Front."', go:()=>startBattle('guild_roofs',{})},
          {t:'Kettle skims a sharper along the ridge, away from the edge.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('guild_roofs',{pre:true})}]}),
    c4_kettle_no:()=>({sp:'Kettle', txt:
`"No," says Kettle, before you've finished. She has her hand on the satchel flap and she's holding it shut, as if something inside might open it from the other side.

"Not the cusser. Not up here. Not anything big." Very fast, very low, like a sapper counting drops. "It's a *roof*, Sergeant. A cusser takes the roof. The roof's on a house. The house has people in it, asleep, and a gas pipe coming up through the kitchen floor, and the pipe's joined to the one next door, and that one's joined to the street, and the street's joined to the *hole*." She swallows. "Hedge's hole. Fiddler's hole. Our hole. Forty of Hedge's babies sleeping in the mains."

"I throw that up here and I don't take four knives off a roof. I take the Gadrobi District off the map. Us on it." She lets go of the flap. "I'll use the bow. I'll use my teeth. I'm not throwing a cusser on a roof, and I'm telling you why so you don't think I've gone soft."

${SQUAD().includes('brisk') ? `Brisk, without turning her head: "Nobody thinks you've gone soft." Kettle: "*Good.*"` : `Nobody thinks she's gone soft. It's the least soft thing you've ever heard her say.`}

They're halfway across the planks.`,
      ch:[C4H.shout('Shout it across the planks: "Malazan, you idiots!"'),
          {t:'"Brisk. Front."', go:()=>startBattle('guild_roofs',{})},
          {t:'"A sharper, then. Along the ridge. Away from the edge."', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('guild_roofs',{pre:true})}]}),
    c4_guild_heard:()=>({sp:'The plank east', fx:()=>{ S.f.c4_fewer=1; S.f.c4_shouter=ROLL().who; }, txt:
`${by({
  brisk:`Brisk doesn't wait for the word. She takes one step to the edge of the slates, plants the butt of her spear, and lets the regiment voice out: the one that carried down the line at Nathilog in a gale and made the Fist's horse sit down. It goes out over the roofs and comes back off the chimneys.

"*Malazan! Malazan, you idiots! We're not who you're looking for!*"`,
  kettle:`Kettle gets there first. She hasn't got a parade-ground voice; she's got a Falari harbour voice, the one for shouting at a boat that's leaving with your money, and it goes out over the roofs like a gull.

"*Malazan! Malazan, you idiots! If we were the other lot you'd be dead already!*"`,
  ohl:`Ohl stands up. He doesn't shout often. When he does, it's the voice he uses down the length of a hospital tent to stop an orderly sawing the wrong leg: very deep, very calm, and it carries like a bell.

"*Malazan. Malazan, you idiots. We are not who you are looking for.*"`,
  sgt:`You put your whole chest into it, the parade-ground voice, the one that carries across a battlefield and makes horses stop. It goes out over the roofs and comes back off the chimneys.

"*Malazan! Malazan, you idiots! We're not who you're looking for!*"`,
  _:`{who} puts a whole chest into it, and it goes out over the roofs and comes back off the chimneys.

"*Malazan! Malazan, you idiots! We're not who you're looking for!*"`})}

The one at the back stops dead on the plank.

You watch him think it through. A Malazan squad. Shouting its own name, on a roof, in the middle of a war the Guild believes Malazans are fighting. It's so stupid it might be true. The silver-haired killers don't shout. They don't make any sound at all.

He says something to the other three, sharp. They don't stop. He doesn't follow them. He goes back over the plank the way he came, and down the far side of the roof, running, and you know exactly where he is running to: to somebody who needs to be told that there's a Malazan squad on the Gadrobi roofs that *shouts*.${nearMiss() ? `

It carries further than it should, though. Off the chimneys, over the gutters, east, all the way to the Daru roofs, where a man is standing very still on a leaded roof with his hands empty, waiting to be answered quietly.` : ''}

The other three keep coming. They've come too far. Or they've buried someone this week, and a Malazan who shouts is still a Malazan.`,
      ch:[{t:'"Brisk. Front."', go:()=>startBattle('guild_roofs_2',{})},
          {t:'Kettle skims a sharper along the ridge.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('guild_roofs_2',{pre:true})}]}),
    c4_guild_deaf:()=>({sp:'The plank east', fx:()=>{ S.f.c4_shoutFailed=1; }, txt:
`${by({
  brisk:`Brisk shouts it, the regiment voice, all of it. It comes out exactly as it's meant to: an order, from a line, to a line. Which is what the Guild hears. Not *we're not who you think*. *Form up.*`,
  kettle:`Kettle shrieks it. It comes out high and fast and furious, in a Falari accent so thick that the only word anybody on the far roof could swear to is the first one.`,
  ohl:`Ohl says it, deep and calm, the way he'd say it down a ward. It's too calm. It's the voice of a man who isn't afraid of four knives, and the Guild hears exactly that.`,
  sgt:`You shout it. It comes out wrong: too loud in a city of whispers, too much like an order and too little like a plea.`,
  _:`{who} shouts it. It comes out wrong: too loud in a city of whispers, too much like an order and too little like a plea.`})} And it's in Malazan, which the Guild speaks as well as you do and hears, tonight, as the language of the people killing it.

The one in front laughs. Short and ugly.

"*Malazan*," he says, in your own tongue, with the Daru bend on the vowels. "Yes. We know."

They come faster.`,
      ch:[{t:'"Brisk. Front."', go:()=>startBattle('guild_roofs',{})},
          {t:'Kettle skims a sharper along the ridge.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('guild_roofs',{pre:true})}]}),
    c4_after_guild:()=>({sp:'The Gadrobi roofs', scene:'roof_night', fx:()=>{ S.f.c4_roofsFought=1; gain('guildblade'); }, txt:
`${preUsed('guild_roofs') || preUsed('guild_roofs_2') ? `It's ugly, and after the sharper there's no point in it being quiet, the way roof fights are meant to be: the noise has already gone everywhere it was ever going to go.` : `It's ugly and very quiet, the way roof fights have to be, because the noise carries and everyone below is listening.`} Boots on slate, breath, and once, a long sliding rattle as somebody goes down the pitch of a roof and over the gutter, and then nothing, and then, a long way below, a sound like a sack of grain landing in a yard.

${S.f.c4_fewer ? `The three who kept coming${preUsed('guild_roofs_2') ? `, and then the older one, back over the plank at the sound of the sharper, who had been going for help and decided he was the help` : ''}. One goes over the edge. The last of them goes back across the plank with a hand pressed to his side and blood coming through the fingers, and nobody follows him.` : `The four off the far roof, and the one who came up over the gutter late${preUsed('guild_roofs') ? `, and the one the sharper fetched` : ''}. Two go over the edge, one after the other. The last of them doesn't get up, and lies on the slate with his face turned toward the Moon's Spawn and his eyes open.`}

Then the tannery ridge, two boots wide, and the crossbow at the end of it. ${S.f.c4_fewer ? `He never quite finishes deciding about the shouting${preUsed('guild_roofs_2') ? ', or about the sharper that came after it' : ''}. He is still deciding when it stops mattering.` : `He gets off three quarrels. He doesn't get off a fourth.`} His bow goes down into the hide-yards, turning over and over, and nobody goes down after it.${preUsed('guild_roofs') || preUsed('guild_roofs_2') ? `

And there's a hole in the roof. Where the sharper went off on the ridge, away from the edge the way Fiddler said, a run of slates has gone through into somebody's attic, and in the attic, in the blue that comes up through the hole, an old woman is sitting up in a bed under the eaves in her nightcap, looking up at you. She doesn't scream. She looks at the squad, and at the Moon's Spawn behind it, as if deciding which of the two to complain about first.

${SQUAD().includes('kettle') ? `"Paviors' Guild," Kettle tells her, down the hole, with total conviction. "We'll be back about the roof." The old woman looks at the crossbow. Kettle looks at the crossbow. "Market day," Kettle says.

Then, on the way back across the slates, low, to you and nobody else: "Away from the edge. Like Fiddler said. Didn't matter. Every roof from here to the lake heard that, Sergeant." She swallows. "So did the people Kalam's waiting for. And there's only one army in this city that carries Moranth clay."` : `Every roof from here to the lake heard that sharper. Somewhere east, on a leaded roof, a man with his hands empty heard it too, and so did everyone he was waiting for, and there is only one army in this city that carries Moranth clay.`}` : ''}

One of them has left his blade on the roof, where it skidded out of his hand. Short, straight, blackened with lamp-soot, the edge bright. No guard. ${SQUAD().includes('ellis') ? `Ellis picks it up by the blade and hands it to you hilt first. "Guild journeyman's knife. Made to be carried up a drainpipe in the teeth." A pause. "They're not bad, Sergeant. They're frightened. That's worse. Frightened knives don't stop."` : `Brisk picks it up and hands it to you hilt first. "Soot on the blade so it doesn't shine," she says. "They thought of that. Didn't think of us."`}

${SQUAD().includes('ohl') ? `Ohl is kneeling at the edge of the roof, looking down into the blue. He can't see the bottom. None of you can. "I'd like to go down to ${S.f.c4_fewer ? 'him' : 'them'}," he says. "I know I can't." He doesn't take the oilcloth out. He just kneels there for a moment longer, and then gets up, and his knees crack like the slates.` : ''}

${SQUAD().includes('kettle') && S.f.c4_cusserHeld && S.inv.cusser > 0 ? `Kettle has her hand flat on the satchel flap again. She hasn't let go of it since the knives came. "Still here," she says, to nobody. "Still here."` : ''}`,
      ch:[{t:'Across to the Daru roofs.', go:()=>{ startExplore('roofs_daru'); talk('c4_daru_arrive'); }},
          {t:'Not yet.', go:()=>startExplore()}]}),

    /* ---- the rope-line over the last gap (✦ The Rope's Way) ---- */
    c4_rope_ok:()=>{ const w = ROLL().who, mate = ['kettle','ellis','brisk','ohl','tuft'].find(x => x !== w && SQUAD().includes(x)) || 'brisk', M = NAME(mate); return {sp:'The rope-line', txt:
`${by({
  brisk:`Brisk takes the shield off her back and hands it to you without a word, and the spear after it, and spits on her palms, and goes up the chimney to the line like a woman going up a siege ladder: no hurry, no pause, no looking at anything but the next rung. She doesn't walk it. She hangs under it, knees hooked over, and goes across hand over hand, the way you'd haul a boat in.`,
  kettle:`Kettle is up the chimney before you've finished looking at it. "Falar," she says, from the top, as if that explained it, and it does: every ship in Falar has more rope than deck, and every powder-runner learns to go up rigging in the dark with a keg on her back. She doesn't walk the line. She hangs under it, ankles crossed over it, and goes across head-first and upside down, hand over hand, humming.`,
  ellis:`Ellis goes up the chimney carefully, one-handed, the gloved hand tucked against her chest. "We never used them," she says, from the top. "The Claw said they were Guild, and Guild means watched. I watched them use them for a month." She hooks a knee over the line, then the other, and lets herself go over backwards until she's hanging under it, and goes across one good hand at a time. "Every night for a month," she says, upside down, over the drop. "I always wanted to."`,
  sgt:`You go up the chimney, because somebody has to and you're the sergeant. The line is tarred and taut and colder than it has any right to be. You don't walk it; you've seen sailors. You hang under it, knees hooked over, and go hand over hand, and the drop is a long way of nothing under your back.`,
  _:`{who} goes up the chimney to the line, and doesn't walk it: hangs under it, knees hooked over, and goes across hand over hand, with a long way of nothing underneath.`})}

At the low point, where the line sags, there's a knot of black rag tied round it, small and neat and old. Somebody's offering. Nobody who crosses here touches it, and ${by({sgt:'you don\'t', _:'{who} doesn\'t'})} either.

At the far chimney ${by({sgt:'you turn', _:'{who} turns'})} to come back, and ${M} is already on the line, halfway out, against every rule Fiddler ever gave anyone about planks. Two on one line, over the drop, going opposite ways, and no room to pass.

${by({sgt:`Nobody waits in the middle. You don't either. It isn't a thing you decide: your knees let go and you swing down under the line on your hands, and ${M} goes over the top of you, and for a heartbeat you're face to face, a hand's width apart, one of you upside down, over nothing. Then you've changed places, and nobody has fallen, and nobody has even slowed.`,
  _:`Nobody waits in the middle. {who} doesn't either. It isn't a thing anyone decides: {who} lets go with the knees and swings down under the line, and ${M} goes over the top, and for a heartbeat they're face to face, a hand's width apart, one of them upside down, over nothing. Then they've changed places, and nobody has fallen, and nobody has even slowed.`})}

That's the trick of it. Not the crossing. The Guild doesn't string these lines to cross. It strings them to *pass*.

${M} comes back by the plank afterwards, like a sensible person, and says nothing until both feet are on slate. ${SQUAD().includes('tuft') && w !== 'tuft' && mate !== 'tuft' ? `Tuft is looking out at the knot of black rag. "There's a card for him," she says. "${S.card === 'assassin' && S.f.c4_drawn ? 'The one that came up on the slates tonight. ' : ''}The Assassin of High House Shadow: a figure half in shadow, rope and knives. The Guild calls him the Rope." She looks at ${w === 'sgt' ? 'you' : '{who}'}. "He's had a look at you now. They say he likes the ones who don't wait."` : ''}`,
      ch:[{t:'Across to the Daru roofs. By the plank.', go:()=>{ startExplore('roofs_daru'); if (!S.f.c4_daruSeen) talk('c4_daru_arrive'); }},
          {t:'Back to the plank.', go:'c4_to_daru'}]}; },
    c4_rope_fail:()=>({sp:'The rope-line', fx:()=>{ S.f.c4_ropeDown=1; S.f.c4_ropeFell=ROLL().who; }, txt:
`${by({
  brisk:`Brisk takes the shield off her back and goes up the chimney and out under the line the way she goes at everything, straight, with her whole weight, and the line takes it for three arm-lengths and then turns over in her hands like a live thing.`,
  kettle:`Kettle is up the chimney and out under the line before anyone can say *Fiddler*, upside down, humming, three arm-lengths, four, and then the line turns over in her hands like a live thing.`,
  ellis:`Ellis goes up one-handed and out under the line, careful, the gloved hand tucked to her chest. Three arm-lengths. Then the line turns over, and there's only one good hand to hold it with.`,
  sgt:`You go up the chimney and out under the line, knees hooked over, hand over hand. Three arm-lengths. Then the line turns over in your hands like a live thing.`,
  _:`{who} goes up the chimney and out under the line, hand over hand. Three arm-lengths. Then the line turns over like a live thing.`})}

It's strung with a twist in it. Of course it is. Anyone who doesn't know which way it wants to roll, rolls with it.

There's a long moment with ${by({sgt:'you', _:'{who}'})} hanging by the hands over the blue, and nothing underneath but the haze and the sound of the city a long way down. Then ${SQUAD().includes('brisk') && ROLL().who !== 'brisk' ? 'Brisk has the line at the chimney end and is hauling' : 'the squad has the line at the chimney end and is hauling'}, and the far knot, on the Daru chimney, decides it has had enough of being pulled on by strangers, and lets go.

The line comes down. ${by({sgt:'You come down with it, and swing in against the wall under the gutter hard enough to knock the breath out of you, and get dragged back up onto the slates by the collar, with the tar burned into both palms.', _:'{who} comes down with it, and swings in against the wall under the gutter hard enough to knock the breath out, and gets dragged back up onto the slates by the collar, with the tar burned into both palms.'})}

The rope-line hangs down the wall now, from the Gadrobi chimney into the dark, all the way to the lane. Somebody strung that. Somebody will come along to see who had it down.`,
      ch:[{t:'Across by the plank, like a sensible person.', go:()=>{ startExplore('roofs_daru'); if (!S.f.c4_daruSeen) talk('c4_daru_arrive'); }},
          {t:'Back to the plank.', go:'c4_to_daru'}]}),

    /* ---- the Daru roofs ---- */
    c4_daru_arrive:()=>({sp:'The Daru roofs', scene:'roof_night', fx:()=>{ S.f.c4_daruSeen=1;
        if (S.f.c4_run === 'unseen' || S.f.c4_run === 'seen') { const n = S.f.c4_run === 'unseen' ? 30 : 10, up = gainXP(n); note(`+${n} experience. ${S.f.c4_run === 'unseen' ? 'Across the roofs unseen.' : 'Across the roofs.'}`, 'good'); if (up) note(`The squad reaches level ${S.lvl}.`, 'good'); } }, txt:
`${S.f.c4_run === 'unseen' ? `Three roofs, and not one lantern has touched you. You come down behind the last parapet in a row, all of you, breathing through your mouths, and ${SQUAD().includes('ellis') ? 'Ellis lets out a breath she has been holding since the plank. "Well," she says. "Well. The Guild\'s going to hate that."' : 'Kettle unclenches her hand. There is a smeared *8* in charcoal on the palm.'}

` : S.f.c4_run === 'seen' ? `You make it across, in the end. Somewhere behind you, on a roof you've already left, somebody is still whistling, low, two notes and two notes, and somebody else is answering. The Guild knows there are Malazans on its roofs tonight. So much for low and slow.

` : ''}The Daru roofs are higher and steeper and better kept, and the gutters are lead where the Gadrobi gutters are clay, and the chimney-pots have little brass hats on them against the rain. The lamps below are in brass cages. The blue coming up between the houses is paler here, bluer, as if even the haze had money.

The next roof east is flat, with a low parapet round it and a chimney with a cracked pot on it. Beyond that, one more roof, a little higher than the rest, flat, leaded, with nothing on it at all.

Nothing but Kalam.

He's standing in the middle of it, where anyone on any roof in the district can see him. His hood is down. His hands are empty and a little away from his sides. He's not looking at anything. He's letting himself be looked at, which is, you realise, the hardest thing you have ever seen Kalam do.

Above you, the Moon's Spawn. It's right overhead here. It's not, it's over the lake, it's half a mile off; but on a Daru roof at night, with the lamps below and nothing above but that black shape against a black sky, there is no other way to feel it.`,
      ch:[{t:'Watch.', go:()=>startExplore()}]}),

    /* ---- the meet: one sequence, Kalam's signal to Vell over the parapet ---- */
    c4_meet:()=>({sp:'Kalam\'s roof', scene:'roof_night', fx:()=>{ S.f.c4_meet=1;
        // the squad goes back to the cracked pot on the middle roof, so the map afterwards matches the scene
        S.pos = {x:8, y:7}; S.trail = [[9,7],[7,7],[9,6],[8,6],[7,6],[8,8]].map(([x,y]) => ({x, y})); }, txt:
`You get as far as his roof. ${S.f.c4_run === 'unseen' ? 'Nobody on any roof has seen you come, and Kalam, who sees everything, gives you one short look that is very nearly a compliment. ' : ''}Kalam doesn't turn his head. One hand moves at his side, two fingers, flat, a gesture you'd miss if you weren't waiting for it: *back*.${S.f.c4_shoutLoud || preUsed('guild_roofs') || preUsed('guild_roofs_2') ? ` Then a second, which nobody needs a Claw's training to read: ${preUsed('guild_roofs') || preUsed('guild_roofs_2') ? 'the hand closing at his hip and flung open, once, like something going off, and then ' : ''}one finger, laid across his lips. *Slate carries.*` : ''}

The hand stays where it is afterwards, loose at his side, as if it had more to say to anyone who answered it.`,
      ch:[{t:'Back, behind the cracked pot.', go:'c4_meet_wait'},
          {t:'Answer his hand with one of yours.', check:['guile',16], trick:'cant', near:false, req:()=>!S.f.c4_cantTried, fx:()=>{ S.f.c4_cantTried=1; },
            edges:id=>[id === 'ellis' && ['six years a Claw scout', 2], S.f.c4_kalamLook && ['Kalam knows someone here sat with the Claw', -2], S.f.c1_kalamTalk && ['Kalam talked to you off the record once', 1], S.f.c4_run === 'unseen' && ['across the roofs unseen', 1], S.f.c4_shoutLoud && ['Kalam heard the shouting', -1], (preUsed('guild_roofs') || preUsed('guild_roofs_2')) && ['Kalam heard the sharper', -1]],
            go:'c4_cant_ok', fail:'c4_cant_fail'}]}),
    c4_cant_ok:()=>({sp:'Kalam\'s roof', scene:'roof_night', fx:()=>{ S.f.c4_cantWho=ROLL().who; }, txt:
`${by({
  ellis:`Ellis answers him. Her gloved hand comes up to her hip, where only he could see it if he were looking, which he isn't, and the two good fingers flick: the scouts' cant, the six signs the Claw gives the people it sends ahead. *Seen. How many?*

Kalam's hand stops. For a long moment it does nothing at all. Then it answers her: not in the scouts' six. In the other cant. The one the Claw doesn't teach to scouts.`,
  tuft:`Tuft answers him. She lifts her hand and gives his gesture back to him, two fingers, flat, exactly, the way she'd copy a sigil off a page: the angle of the knuckle, and the small turn of the wrist at the end that you didn't see him make and she did.

Kalam's hand stops. For a long moment it does nothing at all. Then, perhaps because nobody has ever copied him that exactly, it goes on.`,
  kettle:`Kettle answers him. She has no idea what she's saying. She makes a shape with her fingers, a confident, complicated shape, the shape of a woman who has watched Bridgeburners sign across a camp for a year and assumed it couldn't be that hard.

Kalam's hand stops. You watch his shoulders not move. Then, very slowly, as if he cannot bear to let it stand, his fingers correct her: *no. This.* And having started, they go on.`,
  sgt:`You answer him with the only sign you know: the marines' flat palm, *understood*, the one every sergeant in the Host uses across a noisy camp.

Kalam's hand stops. Then it answers you, and not in anything the marines use.`,
  _:`{who} answers him with a hand, low, where only he could see it if he were looking.

Kalam's hand stops. Then it answers.`})}

Three signs. Slow enough to be read once, by someone watching, and not twice. A flick of two fingers outward: *watch*. A curl of the whole hand inward, like a hand closing on a rope: *here*. And a cut, the edge of the hand drawn once across the other palm: *this one. Now.*

Then the hand goes loose at his side again, as if it had never moved.

"I didn't show you that," Kalam says. Low. To the empty roof in front of him. A pause you could fit a knife into. "Back."

${by({
  ellis:`Ellis is white to the lips. "That's not the scouts' cant," she breathes. "That's the *hands*. The ones who go in. Six years, and they never—" She shuts her mouth. She flexes the two good fingers, once, the way you'd test a new blade.`,
  kettle:`Kettle is glowing. "He *corrected* me," she whispers. "Did you see? He couldn't stand it." A breath. "That's love, in the assassin trade."`,
  tuft:`Tuft has closed her hand, as if she were carrying the shapes in it. "He did it to see if I'd remember," she says. "I'm going to remember."`,
  _:''})}`,
      ch:[{t:'Back, behind the cracked pot.', go:'c4_meet_wait'}]}),
    c4_cant_fail:()=>({sp:'Kalam\'s roof', scene:'roof_night', fx:()=>{ S.f.c4_cantFar=1; }, txt:
`${by({
  ellis:`Ellis answers him in the scouts' cant, the six signs the Claw gives the ones it sends ahead: *seen. How many?*

Kalam's hand goes flat, and very still. He knows exactly where she learned that. He didn't need reminding, tonight, on a Guild roof, with the Guild coming.`,
  tuft:`Tuft gives his gesture back to him, exactly, the way she'd copy a sigil off a page. It's too exact. It's a mage's copy, every angle right and nothing behind it, and his hand goes very still, the way a man goes still when someone he doesn't know says his name.`,
  kettle:`Kettle answers him, with total confidence, in a sign she has made up on the spot and is entirely sure of.

Kalam's hand goes very still. Whatever she has said, in whatever tongue it happens to exist in, it was not *understood*.`,
  sgt:`You answer him with the marines' flat palm, *understood*. His hand goes very still. Whatever that means on a Daru roof, at night, with the Guild about to come, it isn't what it means in camp.`,
  _:`{who} answers him with a hand. His goes very still.`})}

Then it moves again. Sharper. *Back.* And again, with a small push at the end of it, the way you'd shoo a dog off a step: *further*.

${by({kettle:`"What did I *say*?" Kettle whispers. Nobody knows. Nobody is ever going to know.`, ellis:`Ellis doesn't say anything at all.`, _:''})}`,
      ch:[{t:'Further back.', go:'c4_meet_wait'}]}),
    c4_meet_wait:()=>({sp:'Kalam\'s roof', scene:'roof_night', fx:()=>{ rest('The hour behind the cracked pot. The Fourth binds what the planks and the ridge opened, by feel, in the dark, and lies still on the leads. Nobody sleeps. It\'s the nearest thing to it.'); }, txt:
`So you go back, over the plank, behind the cracked pot, where he told you.${S.f.c4_cantFar ? ` Then a roof further, because his hand said so the second time: low behind a parapet, where you can see the whole of Kalam's roof and hear nothing from it at all.` : ''} ${SQUAD().includes('brisk') ? `Brisk puts her shield flat on the leads in front of her, so it won't catch the light, and lies behind it, and becomes a part of the roof.` : ''} ${SQUAD().includes('ellis') ? `Ellis goes to the north corner of the parapet without being told, where she can see the whole of Kalam's roof and the two roofs past it. She strings the bow lying down.` : ''}${S.f.c4_rallickTail ? `

On a ridge two roofs north, with his back to a chimney and his knees drawn up, there's a lean man in a plain coat who wasn't there when you came. He isn't watching Kalam. He isn't watching the brass-lamp hill. He's watching you.` : ''}

You settle, and you watch, and it begins.

Kalam takes a stub of candle out of his coat, and lights it, and sets it on the parapet of his roof. Then he takes out a second, and lights it from the first, and sets it a hand's width to the left. Then he stands back from them with his hands empty.

Two small yellow lights on a Daru roof. Nothing more. In a city of blue fire, the most visible thing on any roof in Darujhistan.

For a long time, nothing. ${SQUAD().includes('ohl') ? `Ohl goes along the row on his knees and binds what the ridge opened, by feel, without a light, and doesn't make a sound doing it.` : `The squad binds what the ridge opened, by feel, without a light, and nobody makes a sound doing it.`}

The candles burn down a finger's width. The blue haze shifts below. Somewhere a dog barks, three streets away, and stops, as if someone had put a hand on it. ${SQUAD().includes('kettle') ? `Kettle, beside you, has stopped counting under her breath. You didn't know she was doing it until she stopped.` : `Ohl, beside you, has stopped breathing through his mouth. You didn't know he was doing it until he stopped.`}

Then the roofs around Kalam begin, very quietly, to fill.`,
      ch:[{t:'Watch.', go:'c4_meet_guild'}]}),
    c4_meet_guild:()=>({sp:'Kalam\'s roof', scene:'roof_night', txt:
`They come the way water comes into a footprint: from underneath, from the sides, from nowhere. A shape on the ridge north of him that was a chimney-pot a moment ago. Two on the roof behind him, rising up out of the gutter. One, then three, then six, on the roofs south and east. They don't come close. They settle on the roofs *around* his, crouched on the ridges like crows on a fence, dark coats, hoods, knives you can't see and know are there.

Nine. Ten. You stop counting at twelve.

None on your roof. Kalam was right about the skylight.

One of them stands, on the roof north of Kalam's. A lean figure. Older, by the way it holds itself. It says something, low, in Daru, that you're too far off to catch. Kalam answers, in Daru, and holds up both hands, empty, and turns them over, slowly, so that the candlelight goes over the palms and the backs.

${S.f.c4_fewer ? (S.f.c4_cantFar ? `The one on the north roof says something else. From a roof further back than Kalam first put you, you can't catch a word of it, and you don't need to: he points, back the way you came, toward the Gadrobi roofs, and then opens and shuts his hand in the air, like a mouth. *Shouting.* ${S.f.c4_shouter === 'kettle' ? `Kettle, next to you, breathes out through her nose. "He's telling Kalam about *me*." She sounds pleased.` : `Kettle, next to you, breathes out through her nose. "He's telling Kalam about us."`}` : `The one on the north roof says something else, and you catch one word of it, because it's a word ${S.f.c4_shouter && S.f.c4_shouter !== 'sgt' && SQUAD().includes(S.f.c4_shouter) ? NAME(S.f.c4_shouter) : 'you'} shouted two roofs ago: *Malazan*. And then, after it, a word you don't know, said with a kind of weary disgust.${SQUAD().includes('ellis') ? ' Ellis would know it.' : ''} ${S.f.c4_shouter === 'kettle' ? `Kettle, next to you, guesses: "*Idiots*," she breathes. "He's telling Kalam about *me*." She sounds pleased.` : `Kettle, next to you, guesses: "*Idiots*," she breathes. "He's telling Kalam about us."`}`) : `The one on the north roof says something else, and gestures, sharp, back the way you came, toward the Gadrobi roofs. Toward the dead on the Gadrobi roofs.${S.f.c4_shoutFailed && !S.f.c4_cantFar ? ` And one word, flat, set down on the parapet between them like a knife on a table: *Malazan*. You know where he got it. He got it off a plank, shouted.` : ''} Kalam doesn't turn his head to follow the gesture. He keeps his hands up.`}${preUsed('guild_roofs') || preUsed('guild_roofs_2') ? `

Then the one on the north roof does a thing with both hands that needs no Daru at all: closes them, and flings them open. A burst. He points at the Gadrobi roofs${S.f.c4_cantFar ? `. From where Kalam's hand put you, you can't hear what he calls it. You don't need to.` : ` and says one word more, and it's a word every soldier in the Host knows in every tongue they've marched through. *Moranth.*`} Kalam keeps his hands up. You watch his shoulders not move, and you know to the ounce what it is costing them.` : ''}

For a moment, you think it's going to work.

${SQUAD().includes('ellis') ? `"They're listening," Ellis breathes, at the parapet. "Hood's teeth. He's done it. They're *listening* to him."` : `"They're listening," Tuft breathes. "He's done it."`}

Then the lean one on the north roof stops talking in the middle of a word.`,
      ch:[{t:'Watch.', go:'c4_meet_andii'}]}),
    c4_meet_andii:()=>({sp:'Kalam\'s roof', scene:'roof_night', txt:
`He stops because there's a hand on his shoulder, and it's not a hand anyone in the Guild has.

It's long, and dark, darker than the night, and the fingers are very long, and above it, behind him, where there was nothing a heartbeat ago, is someone tall. Silver hair. No hood. A face you can't see because the candlelight doesn't reach it, and because, you think afterwards, it does not choose to be seen.

The lean one turns. He's fast. He's still turning when he stops being a person and becomes a shape going down the slope of the roof, loose, all at once, like a coat dropped off a peg.

And then it's everywhere.

They're on every roof. You don't see them come. You see the Guild see them: the heads turning, the knives coming up, the crouched shapes rising off the ridges and not making it all the way up. Tall shapes, silver hair, moving through the Guild the way a scythe goes through standing wheat, without hurry, without effort, without a sound. No cries. The Guild don't cry out. There isn't time. Twelve assassins die the way candles go out when a door opens, one after another, in silence.

Nobody touches Kalam. They go round him the way a river goes round a post.

${SQUAD().includes('tuft') ? `Beside you, Tuft has her hands over her mouth. Not from horror. You can see her eyes over the fingers, and they're wide and wet and *shining*, and her whole body is leaning toward Kalam's roof the way a plant leans toward a window. "Kurald Galain," she whispers through her fingers. "Not leaking. Not seeping through a crack. *Walking.* That's what it's for. Oh, gods, Sergeant, it's so *cold*." And under the horror, under all of it, something you'd never heard in her voice before and would give a great deal never to hear again: longing.` : `Beside you, Ohl has his hand on his chest, over the oilcloth. He isn't writing. There's no time to write. He's just holding it, the way you'd hold a wound.`}`,
      ch:[{t:'Watch.', go:'c4_meet_run'}]}),
    c4_meet_run:()=>({sp:'Kalam\'s roof', scene:'roof_night', txt:
`Kalam runs.

Not away from them. They've let him be, and he knows it, and he doesn't wait to find out for how long. He goes off the east edge of his roof in a long flat dive that ends on the ridge of the next roof down, rolls, comes up, and is gone into the dark, faster than you've ever seen a big man move, with his hood up and his knives out and nobody behind him.

The candles are still burning on the parapet. One of the tall shapes stops beside them, and looks down at them, and pinches them out, one, two, with its fingers, as if tidying.

Something moves on the roof behind you.

You turn. Quick Ben is on the ridge of your roof, crouched, a dark small man with a grain sack under one arm, looking where Kalam went. He doesn't look at you. He's going after him. *A little after.* He goes past you along the ridge and down the far side, and as he passes, from inside the sack, you hear it again. Wood on wood. A dry, small tick-tick-tick, like a knuckle on a table.

Like laughter, if laughter were made of kindling.

And then he's gone too, and it's you, and the roof, and the dead, and the tall shapes, and you think it's over.

A scrabble on the parapet. Hands. A body coming over the edge of your roof, fast and clumsy, all elbows, landing on the leads in front of the chimney-pot on hands and knees and scrambling up, and it's a boy. Young. Daru. Soot on his face, a coil of tarred rope over his shoulder with a hook on the end of it, and a cut across his back that has opened his coat from shoulder to hip, and a knife in his hand that he has forgotten is there.

He sees you. He sees the squad. His face does a thing you have seen faces do on battlefields, at the moment when the last door shuts.

Two roofs behind him, coming over the ridge without hurry, tall, silver-haired: one of them. Closing.`,
      ch:[{t:'—', go:'c4_vell'}]}),
    c4_vell:()=>({sp:'The boy', scene:'roof_night', txt:
`"I'm nobody," the boy says. He says it to you, because you're the one in front, and his voice cracks on it like a boy's does. "I'm nobody. I'm *nobody*. Please."

He's on his knees. He doesn't know he's on his knees. The knife is still in his hand and he's holding it out to you, blade first, as if you'd asked for it. There's blood running down the back of his legs from the cut. He's young enough that it's still a surprise to him that he has so much of it.

"Vell. I'm Vell. I'm a journeyman, I carry *rope*, I carry rope for Ocelot's people, I've never—" His eyes go past you, over his own shoulder, and come back. "Please. I'm not anybody. It doesn't *need* me."

Behind him, the tall shape comes over the last ridge and down onto the roof next to yours. It doesn't run. It steps across the gap between the roofs as if it were a crack in a floor. It does not look at you. It's looking at the boy. It has a sword in one hand, long and very slightly curved, and the blade is dark, not dark with blood, dark with *dark*, and it's held low and easy, the way a woman holds a broom.

It does not speak. You understand, looking at it, that it's not going to.

One roof. Then none.

You have perhaps a breath. ${SQUAD().includes('brisk') ? `Brisk is already on her feet behind you, shield up. She's looking at you, not at it.` : ''} ${SQUAD().includes('tuft') ? `Tuft hasn't moved at all.` : ''}`,
      ch:[{t:'Stand between them.', fx:()=>{ S.f.c4_key='shield'; S.f.c4_vell=1; S.f.c4_guildKnows=1; }, go:'c4_shield'},
          {t:'Step out of the way.', fx:()=>{ S.f.c4_key='aside'; S.f.c4_seen=1; S.f.c4_tuftDark=1; }, go:'c4_aside'},
          {t:'"Tuft—"', req:()=>SQUAD().includes('tuft') && !S.f.c4_askTuft, fx:()=>{S.f.c4_askTuft=1;}, go:'c4_vell_tuft'},
          {t:'"Brisk—"', req:()=>SQUAD().includes('brisk') && !S.f.c4_askBrisk, fx:()=>{S.f.c4_askBrisk=1;}, go:'c4_vell_brisk'}]}),
    c4_vell_tuft:()=>({sp:'Tuft', scene:'roof_night', txt:
`She doesn't turn her head. She's looking at the tall shape, and her lips are parted, and her breath is smoking in air that was not cold a moment ago.

"Tiste Andii," she says. "From the Spawn. It's one of *his*." She doesn't say whose. "Sergeant, it's — I can see the warren on it. It's wearing it. Like a cloak. Like skin. There's no bottom to it. Meanas is a pond and that's the *sea*."

A breath.

"If you stand in front of it, it'll go through us to get him. It won't want to. It won't mind." Her voice is perfectly steady and she's crying, a little, without noticing. "If you step aside, it'll look at us. I want you to know that. I want you to know I *want* it to look at us, and that's why you shouldn't listen to me."`,
      ch:[{t:'Stand between them.', fx:()=>{ S.f.c4_key='shield'; S.f.c4_vell=1; S.f.c4_guildKnows=1; }, go:'c4_shield'},
          {t:'Step out of the way.', fx:()=>{ S.f.c4_key='aside'; S.f.c4_seen=1; S.f.c4_tuftDark=1; }, go:'c4_aside'},
          {t:'"Brisk—"', req:()=>SQUAD().includes('brisk') && !S.f.c4_askBrisk, fx:()=>{S.f.c4_askBrisk=1;}, go:'c4_vell_brisk'}]}),
    c4_vell_brisk:()=>({sp:'Brisk', scene:'roof_night', txt:
`"I don't know what it is." Flat. Her shield's up and her spear's out and her eyes haven't left it. "I know what he is. He's a boy on his knees on our roof."

"Whiskeyjack said watch. Whiskeyjack didn't say what to do when the thing we're watching comes over the parapet onto us." She shifts her weight, forward foot, back foot. "That's what a sergeant's for. That's you."

"I'll stand where you put me, Sergeant. Same as always." A beat. "But you should know where I'd put me."`,
      ch:[{t:'Stand between them.', fx:()=>{ S.f.c4_key='shield'; S.f.c4_vell=1; S.f.c4_guildKnows=1; }, go:'c4_shield'},
          {t:'Step out of the way.', fx:()=>{ S.f.c4_key='aside'; S.f.c4_seen=1; S.f.c4_tuftDark=1; }, go:'c4_aside'},
          {t:'"Tuft—"', req:()=>SQUAD().includes('tuft') && !S.f.c4_askTuft, fx:()=>{S.f.c4_askTuft=1;}, go:'c4_vell_tuft'}]}),

    /* ---- shield: stand between them ---- */
    c4_shield:()=>({sp:'Two roofs over', scene:'roof_night', txt:
`You step forward, past the boy, between him and it, and you don't think about it, and afterwards you'll never be able to say you did. ${SQUAD().includes('brisk') ? `Brisk is on your left before your foot is down. Her shield comes up beside yours with a sound like a door closing, and the two rims overlap, the way they overlapped at Nathilog, a hand's width, no more.` : `The squad is round you before your foot is down, closing the gap without being told.`}

The tall shape stops.

It looks at you. For the first time, it looks at something that isn't the boy. You still can't see its face. You can see its eyes, or where its eyes are: two points of no-light in the dark of the face, like holes cut in black paper.

It considers you. You feel it do it. It's like standing in a cold draught from a door you didn't know was open: the whole of you, weighed and priced and set aside in less time than it takes to breathe, not with contempt, not with anything, the way you'd consider a stone in a path.

Then it lifts the dark sword, very slightly, and comes on.

${SQUAD().includes('ohl') ? `Behind you, Ohl, very quietly, to Hood, in Ehrlii: an old argument, the opening line.` : ''} Behind you the boy has stopped saying *please*. He's got to his feet. He's got his knife in the right hand now. He's standing behind your shield, shaking so hard you can hear his teeth, with his rope-and-hook in the other hand, and he says, in a very small voice, "I'm not much with a knife."

"Nobody is," you tell him. "Stay behind the shield."`,
      ch:[{t:'"Hold."', go:()=>startBattle('andii_roof',{})},
          {t:'Kettle skims a sharper across the leads at its feet.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('andii_roof',{pre:true})}]}),
    c4_after_andii:()=>({sp:'Two roofs over', scene:'roof_night', txt:
`You hold. You don't know how. There are pieces of it, and the pieces don't fit. Brisk's shield ringing like a struck bell and the rim of it bent. Kettle's quarrel going into a tall shape's shoulder and the shape not noticing. The dark sword coming round in a flat arc that should have taken three heads and somehow took none. Cold. The cold of it, in your teeth and the roots of your hair.${preUsed('andii_roof') ? `

And at the very start, before any of it, the sharper: one white heartbeat in which the whole of the tall shape was lit, the face too, the face Kalam told you not to look at, and every one of you looked. It didn't stop it. It burned the dark off it, the cloak of Kurald Galain it wears the way other people wear weather, and it fought you the rest of the way bare-faced and did not seem to mind.${SQUAD().includes('kettle') ? ` Kettle stood where she'd thrown from for a whole breath afterwards, the crossbow hanging off one hand, looking. You had to say her name twice. "I *lit* it," she said, when she could. "Kalam said don't look, and I lit it up like a lamp so we'd all get a good look."` : ''}` : ''}

And then the second one. Coming over the far parapet, as the first one steps back to look at you again. It doesn't hurry. It walks toward you along the leads with its sword down, and the first one turns its head, very slightly, and waits for it.

Two of them. You think: *well, that's the end, then*.

And from behind you, from the ridge of the next roof, very small, very dry, you hear it: tick-tick-tick. Wood on wood. A knuckle on a table. A laugh made of kindling.

The air on the roof *bends*.

You see Kalam. You see him on the roof to the south, running, with his hood down and a Guild blade in each hand, and he's calling something, and he's wounded, and he's there and he isn't there, because Kalam went east. You see him anyway. So do they.

The second one stops.

It doesn't go after the thing on the south roof. It stands quite still in the middle of the leads, with its sword down, and it looks at the running shape that is Kalam and is not Kalam; and then it looks, for a long moment, at the ridge behind you, where the laughing came from. It *hesitates*. You'd swear to it in front of Dujek. For the space of a breath, as if it had heard a voice it knew and could not place.

Then both of them go *elsewhere*.

Not off the roof. Not over the edge. They are there, and then there's a cold wind across the leads, and they aren't. The shape on the south roof isn't there either. It never was.${heldDowns('andii_roof') > 0 ? `

It's only afterwards, putting the pieces in order, that you find this among them, and you'll tell it to nobody but Whiskeyjack, because nobody else would believe it: ${heldDowns('andii_roof') > 1 ? 'both of them, at one time or another, went down. On the leads, on their knees, with the dark running out of them like water out of a cracked jar. Each got up again the way a tide comes back in, slow and then all at once. But they went down, on your roof, under the Fourth\'s blades, and they know which roof.' : 'one of them went down. On the leads, on its knees, with the dark running out of it like water out of a cracked jar. It got up again the way a tide comes back in, slow and then all at once. But it went down, on your roof, under the Fourth\'s blades, and it knows which roof.'}` : ''}

On the ridge behind you, a dark small man with a grain sack under his arm stands up, and brushes his knees, and doesn't look at you, and goes away east, fast, after the real Kalam. The sack is quiet. The sack is very, very quiet.`,
      ch:[{t:'The boy.', go:'c4_shield_vell'}]}),
    c4_shield_vell:()=>({sp:'Vell', scene:'roof_night', fx:()=>{ gain('andiicloak'); }, txt:
`Vell is on his back on the leads behind the chimney-pot, cut in two new places, breathing. His rope-and-hook is still in his hand. The hook is caught in something: a long fold of grey cloth, the grey of ash on a cold hearth, torn along one edge as if something had pulled away from it very fast and not stopped to take it back.

He looks at the cloth, and at the hook, and at you.

"I caught it," he says. "I don't know when. I just threw. I'm a *rope* man." He laughs, and it hurts, and he stops. "I caught one of *them*."

${SQUAD().includes('ohl') ? `Ohl is already down beside him with his hands on the cuts, and the Denul light is coming up under his palms, faint and green and stubborn, like a candle in a draught.` : `Somebody is already binding the cut on his back with a strip of somebody's shirt.`}

"Why?" Vell says. "I'm nobody. I'm *Guild*. The Guild's been saying it's you, killing us, every night, and you—" He can't finish.

You don't have an answer that fits in a sentence. You find you don't need one. He looks at your face, and whatever he finds there, it'll do.

"Vell," he says again, as if you might not have heard it the first time. "Journeyman. Ocelot's clan. I owe you." A breath. "The Guild'll know. I'll make sure the Guild knows. A Malazan squad held a roof for one of ours." He shuts his eyes. "They won't *like* it. They'll know."

${SQUAD().includes('tuft') ? `Tuft has worked the grey cloth free of the hook. She holds it in both hands. It's lighter than it should be. It doesn't quite take the lamplight from below. She looks at it for a long time and then, without asking anyone, puts it round her own shoulders, and it settles there as if it had been waiting.` : `The grey cloth lies on the leads, not quite taking the light. Nobody wants to pick it up. In the end you do, and fold it, and it weighs almost nothing, and you put it in the pack, and try to forget it's there.`}`,
      ch:[{t:'The squad.', go:'c4_shield_squad'}]}),
    c4_shield_squad:()=>({sp:'Two roofs over', scene:'roof_night', fx:()=>{ if (SQUAD().includes('brisk')) loy('brisk',1); if (SQUAD().includes('ohl')) loy('ohl',1); if (SQUAD().includes('tuft')) loy('tuft',-1); if (SQUAD().includes('ellis')) loy('ellis',1); }, txt:
`${SQUAD().includes('brisk') ? `Brisk is looking at her shield. The rim is bent a finger's width, where the dark sword came down on it, and the bend is white with frost. She runs her thumb along it. She doesn't say anything for a long time.

"That's what a line is for," she says at last, to the shield. "Not the ones behind it that'd have lived anyway. The ones that wouldn't." She looks at you, once. "Nine years, Sergeant. That's the first time I've seen what it's for."` : ''}

${SQUAD().includes('ohl') ? `Ohl has the oilcloth out. He's been writing on it, with the stub of charcoal he keeps for it, while the boy was being cut: you see now that he started a line when Vell came over the parapet. *A boy. Daru. No name.* He looks at it. Then he draws the charcoal through it, once, carefully, from end to end, the way you'd close a door on a room with nobody in it.

"I don't get to do that very often," he says. "I'd forgotten how it feels." He puts the oilcloth away. His hands are shaking. They never shake.` : ''}

${SQUAD().includes('tuft') ? `Tuft is standing at the parapet in the grey cloak, looking east, where they went. She doesn't turn round.

"You stood in front of *that*," she says. "For him. It could have gone through all of us, and it didn't, and you don't know why." Not kind: "That wasn't brave, Sergeant. That was a fool with a shield. It got lucky, and the luck had a name, and the name was in a *sack*."` : ''}

${SQUAD().includes('ellis') ? `Ellis comes down off the parapet and stands beside you, and says one sentence, low, and it's the right one. "The Claw would have stepped aside. I'd have stepped aside, a year ago." She looks at Vell. "I'm glad it's not a year ago."` : ''}

${SQUAD().includes('kettle') ? `Kettle is sitting on the leads with her back to the chimney and her crossbow across her knees, reloading it, very slowly. "It had a *shoulder*," she says, to the crossbow. "I put a quarrel in its shoulder. It didn't even look." She shrugs. "Guild boy's alive. Good. I'd like to go home now."` : ''}

${S.f.c4_rallickTail ? `On the ridge two roofs north, the lean man in the plain coat gets to his feet. He looks at Vell, behind your shield, for a long moment, and at you for a longer one. Then he goes, without hurrying, toward whoever he answers to. Ocelot will have it from him before Vell gets the chance.` : ''}`,
      ch:[{t:'On your feet.', go:()=>startExplore()}]}),

    /* ---- aside: step out of the way ---- */
    c4_aside:()=>({sp:'Two roofs over', scene:'roof_night', txt:
`You step aside.

It's one step. Half a step. You move your foot, and your weight goes with it, and there's nothing between the boy on his knees and the tall shape coming down onto your roof but a stretch of lead the width of a doorway.

${SQUAD().includes('brisk') ? `Brisk doesn't move. For a heartbeat she's still there, shield up, in the gap you've left, and she's looking at you, and you look back, and then she takes the step too.` : `The squad moves with you, because that's what a squad does. You hear it in their breathing.`}

The boy sees the gap open. He understands it before you've finished making it. He doesn't say *please* again. He doesn't say anything. He looks at you, and you'll carry the look, and then he turns round on his knees to face it, with the knife in his hand, because there's nothing else to face.

The tall shape doesn't hurry. It steps onto your roof, and past you, close enough to touch, and you feel the cold come off it like cold off a well, and it kills him.

One motion. You don't see the sword move. You see the boy, and then you see the boy lying on the leads in two directions at once, and the rope-and-hook sliding out of his hand, and nothing else, not a sound, not a cry. It's so quick it's almost gentle.

Then it turns its head, and looks at you.

You still can't see its face. You see the eyes, or where the eyes are: two holes of no-light. They rest on you. On your face. On each of the squad's faces, one after another, unhurried, as if reading names off a list.

And then it *nods*.

Once. Slow. The way one soldier nods to another across a field, after, when both of them are still standing and neither of them had to be. A courtesy. An acknowledgement. *I see you. I will know you.*

And it's gone. Over the parapet, into the dark, without a sound.`,
      ch:[{t:'—', go:'c4_aside_body'}]}),
    c4_aside_body:()=>({sp:'Two roofs over', scene:'roof_night', fx:()=>{ gain('ropehook'); gain('andiicloak'); }, txt:
`It left its cloak.

You don't see it happen. You see it afterwards: a long fold of grey cloth, the grey of ash on a cold hearth, laid over the boy's face and shoulders. Neatly. The edges straightened. As if someone had knelt, in the half-heartbeat between the nod and the going, and covered him, the way you'd cover a man on a field whose name you didn't know.

Nobody moves for a long time.

${SQUAD().includes('ohl') ? `Then Ohl goes and kneels by the boy. He doesn't lift the cloth. He knows what's under it. He takes the boy's hand, which is still warm, and holds it, the way he holds the hands of the dying, although there's no dying left to do, and says something in Ehrlii that isn't an argument with Hood, because there's no argument left either. It's just a name. *Vell.* Said to nobody.` : `Then you go and kneel by the boy. You don't lift the cloth. You know what's under it.`}

His rope-and-hook is on the leads where it fell. Thirty feet of tarred line, wrapped in new rag so it won't ring on slate. You pick it up, because leaving it there feels worse, and it's heavier than it looks, and you don't know what else to do with your hands.

${SQUAD().includes('tuft') ? `Tuft kneels on the boy's other side. She lifts the grey cloak off his face, gently, and folds it back over his chest so he's covered from the neck down, and then she takes it off him entirely, and stands, and puts it round her own shoulders.

Nobody says anything. It settles on her as if it had been waiting for her. It doesn't quite take the light from below. For a moment, in it, standing at the parapet with her back to you, looking where the tall shape went, she doesn't quite take the light either.` : `The grey cloak lies on the leads where you set it. Nobody wants to pick it up. In the end you do, because it would be worse to leave it, and you fold it, and it weighs almost nothing, and you put it in the pack.`}`,
      ch:[{t:'The squad.', go:'c4_aside_squad'}]}),
    c4_aside_squad:()=>({sp:'Two roofs over', scene:'roof_night', fx:()=>{ if (SQUAD().includes('tuft')) loy('tuft',2); if (SQUAD().includes('brisk')) loy('brisk',-2); if (SQUAD().includes('ohl')) loy('ohl',-2); if (SQUAD().includes('ellis')) loy('ellis',-1); }, txt:
`${SQUAD().includes('brisk') ? `Brisk hasn't lowered her shield. She's standing where she stood when you stepped aside, facing the place where the boy was, with the rim up, as if the thing might come back and she might get a second chance at the step.

"Whiskeyjack said watch," she says. Very flat. "We watched."

That's all. It's the worst thing she's ever said to you, and she knows it, and she says it anyway, and then she lowers the shield, finally, and turns her back on you, and goes to the far end of the roof and sits against the parapet, and doesn't look round.` : ''}

${SQUAD().includes('ohl') ? `Ohl gets up off his knees. He has the oilcloth out. He writes on it, with the stub of charcoal: one line, small. You can't read it upside down. You don't need to.

"${S.f.c2_key === 'light' ? 'Two hundred and thirteen' : 'Two hundred and twelve'}," he says. He doesn't look at you. "That's a name I didn't put there, Sergeant." He folds the oilcloth, carefully, along its old creases. "I've carried ${S.f.c2_key === 'light' ? 'two hundred and twelve' : 'two hundred and eleven'} names that Hood took off me. I've never carried one somebody *handed* him." He puts it away. "I'll carry it. That's what the list is. I just wanted you to know whose hand it's in."` : ''}

${SQUAD().includes('ellis') ? `Ellis comes down off the parapet and stops beside you. She doesn't look at you. She looks at the boy.

"That's how the Claw would have done it," she says. "Exactly like that. One step." She's quiet for a moment. "I'd hoped you weren't."` : ''}

${SQUAD().includes('kettle') ? `Kettle is sitting against the chimney with her crossbow across her knees. "It *nodded*," she says, to the crossbow. "Did you see? It nodded at us." She doesn't say whether that's good. She doesn't seem to know. She reloads, very slowly, and doesn't look at the boy.` : ''}

${SQUAD().includes('tuft') ? `Tuft is at the parapet in the grey cloak. She hasn't turned round.` : ''}`,
      ch:[{t:'"Tuft."', req:()=>SQUAD().includes('tuft'), go:'c4_aside_tuft'},
          {t:'On your feet.', go:()=>startExplore()}]}),
    c4_aside_tuft:()=>({sp:'Tuft', scene:'roof_night', txt:
`She doesn't turn round. She's looking east, the way it went, with the grey cloak round her and her hands folded inside it.

"It looked at me," she says. "Did you see? Not at you. At all of us, yes. But it *stopped* on me. For as long as it takes to breathe out."

"I've been in Kurald Galain before, Sergeant. Under the Pale. It came up through the stone like water and I swam in it and I didn't drown and I told myself that was luck." She turns her head, just enough that you can see the side of her face. It's calm. It's very calm. "I looked into it tonight, and it looked back. It knows what I am now. It knows my face." A breath. "I'm not frightened. That's what I wanted to tell you. I should be, and I'm not."

She pulls the cloak tighter. It doesn't rustle.

"Don't tell Ohl. He'll write it down."`,
      ch:[{t:'On your feet.', go:()=>startExplore()}]}),

    /* ---- the Daru roofs, after ---- */
    c4_qb_after:()=>({sp:'Quick Ben', fx:()=>{S.f.c4_qbAfter=1;}, txt:
`He's come back. You didn't hear him. He's sitting on the parapet of your roof with his feet dangling over the drop, the sack in his lap, looking east where Kalam went.

"Kalam's alive," he says, before you ask. "Furious. Cut in three places he'll deny. He's going home by a road I wouldn't take and I'm not going to be on it with him, because he'll want to talk about it, and I've heard it." He smiles at the dark. "The Guild won't be buying tonight. The Guild won't be buying anything for a while. Somebody's closed the shop."${preUsed('guild_roofs') || preUsed('guild_roofs_2') ? `

${SQUAD().includes('kettle') ? `His eyes go to Kettle's satchel.` : `He looks at you.`} "Some of the furious is yours, by the way. He was standing on a roof with his hands open, telling the Guild the Empire isn't the one with the knife, and two roofs west of him somebody let off a Moranth sharper." Mildly: "He won't mention it. He'll just remember it. That's worse. I'd know."` : ''}

${S.f.c4_key === 'shield' ? `He looks at you then. He doesn't often do that, properly, and he does it now, for long enough that you want to look away.

"You stood in front of a Tiste Andii," he says. "For a Guild rope-boy you'd never met. On a roof. With a *shield*. It's the stupidest thing I've seen a marine do, Sergeant, and I've served with Hedge. You're alive because I was on the next roof being clever. Don't make me do it again. It has a price, and I'm not the one who pays it."${preUsed('andii_roof') ? ` A pause. "And a *sharper*. At its feet. I heard Fiddler wince from here, and he's down a hole in the Gadrobi."` : ''}${heldDowns('andii_roof') > 0 ? `

"You put ${heldDowns('andii_roof') > 1 ? 'them' : 'one of them'} on the leads, too. I saw." He doesn't sound pleased. "Keep that to yourself. They live a very long time, Sergeant, and they've nothing much to do with it but remember."` : ''}

The sack, in his lap, is quite still.

"The second one stopped," he says, more quietly, almost to himself. "I didn't expect it to stop."` : `He doesn't look at you. He looks at the place on the leads where the boy fell, and then${SQUAD().includes('tuft') ? ` at Tuft, in the grey cloak, for rather longer, and then` : ''} back at the east.

"Stepped aside," he says. It isn't a question. "That was the smart thing. That's what I'd have done. That's what Whiskeyjack told you to do." A pause. "It *nodded* at you. I saw it from the ridge. They don't nod, Sergeant. I've watched them every night since we came, and I have never seen one of them acknowledge that a human being was on the same roof."

"Somebody on that mountain has your face now. I'd think about that. I'd think about it for a long time."`}

He gets up, and tucks the sack under his arm, and goes over the edge of the roof, and down, and doesn't use the plank.`,
      ch:[{t:'Leave him.'}]}),
    c4_vell_roof:()=>({sp:'Vell', fx:()=>{S.f.c4_vellRoof=1;}, txt:
`${S.f.c4_vellRoof ? `He's still against the chimney-pot, with the rope-and-hook in his lap. He gives you a small nod every time you come near, as if checking you're still real.` : `He's sitting against the cracked pot with his knees drawn up and ${SQUAD().includes('ohl') ? `Ohl's bandages` : `a strip of somebody's shirt`} round his middle, holding the rope-and-hook in his lap the way a child holds a blanket. Every time something moves on the roofs he flinches, and then looks at the squad, and stops flinching.

"Is it over?" he says. "Up here, I mean. I know it isn't over." He looks east, at Kalam's roof, where two of his own are kneeling among the dead. "Those are Ocelot's. They've seen me. They'll not come over while you're here." A breath. "I'd like to go down with you, if that's all right. I don't think I can do the stair on my own."`}`,
      ch:[{t:'"When we go, you go with us."'}]}),
    c4_guildmen:()=>({sp:'Guild men', txt:
`${!S.f.c4_key ? `Two shapes on Kalam's roof, kneeling among the dead. They don't look up.` : S.f.c4_guildmen && S.f.c4_key === 'shield' ? `They're still at it, among the dead. The older one doesn't look up again. He's looked once. Once is what you get.` : S.f.c4_key === 'shield' ? `Two of them have come back for the dead. They kneel on Kalam's roof among the bodies, turning them over, closing eyes, cutting purses loose so the Watch won't have them. Neither of them is wearing a mask.

One of them looks up as you come near. An older man, grey at the temples, with a Guild blade across his knees. He looks at you, and past you at Vell, propped against the chimney-pot on your roof with ${SQUAD().includes('ohl') ? `Ohl's bandages` : `a strip of somebody's shirt`} round him, and he doesn't say anything.

Then he lifts the blade, very slightly, off his knees, and puts it down again. It's not a salute. It's a note in a ledger. *Seen.*

He goes back to the dead.` : `Two of them have come back for the dead. They kneel on Kalam's roof among the bodies, turning them over, closing eyes, cutting purses loose so the Watch won't have them. They work fast and quiet.

They've already been to your roof. You didn't see them come. The boy is gone from the leads by your chimney-pot; there's a smear where they took him, and the smear goes to the parapet and over.

One of them looks up as you come near. An older man, grey at the temples, with a Guild blade across his knees. He doesn't look at your face. He looks at your feet, and then past you, at the leads by the chimney-pot on your roof: at the space there, the width of a doorway, where you stood aside.

He looks at it for a long time. Then he gets up and goes over the far side of Kalam's roof, and the other one follows him, and neither of them looks back, and you know, the way you know weather, that you'll be seeing them again before dawn.`}`,
      ch:[{t:'Leave them.', fx:()=>{ if (S.f.c4_key) S.f.c4_guildmen=1; }}]}),

    /* ---- exit west: back to the Gadrobi roofs, or (after the choice) down ---- */
    c4_back_west:()=> S.f.c4_key ? {sp:'The way down', txt:
`West, over the plank, and down the chandler's chimney-stair, and into the streets, and back to the crossing, and the bucket, and Whiskeyjack. It's the only way down that isn't the quick one.

${S.f.c4_key === 'shield' ? `Vell can walk, if somebody holds him up. ${SQUAD().includes('brisk') ? 'Brisk holds him up.' : 'Somebody holds him up.'}` : `Nobody talks. The dark between the roofs is very dark tonight.`}`,
      ch:[{t:'Down.', req:()=>!S.f.c4_clanFought && !S.f.c4_plankDown, go:'c4_clan'},
          {t:'Down.', req:()=>!!(S.f.c4_clanFought || S.f.c4_plankDown), go:'c4_descend'},
          {t:'Not yet.'}]} : S.f.c4_meet ? {sp:'The plank west', txt:
`Back toward the Gadrobi roofs. Kalam's roof is quiet now, and you have not finished what you came up here for.`,
      ch:[{t:'Not yet.'}]} : {sp:'The plank west', txt:
`Back across the plank to the Gadrobi roofs. Kalam is still standing on his roof in the east, with his hands empty, waiting to be answered.`,
      ch:[{t:'Back to the Gadrobi roofs.', go:()=>{ startExplore('roofs_gadrobi'); // come back by the east plank, not up the hatch
            S.pos = {x:14, y:6}; S.trail = [[13,6],[14,5],[14,7],[13,5],[13,7],[12,6]].map(([x,y]) => ({x, y})); save(); }},
          {t:'Not yet.'}]},

    /* ---- the plank home: a clan with no master, over the Daru ridge after the squad (both roads) ---- */
    c4_clan:()=>({sp:'The plank west', scene:'roof_night', txt:
`You're across the plank, all of you, ${S.f.c4_key === 'shield' ? `with Vell set down against the chimney-stack on the Gadrobi side and ${SQUAD().includes('brisk') ? 'Brisk\'s' : 'somebody\'s'} coat under his head,` : `and nobody looking back,`} when the Daru ridge behind you fills.

Four of them. Five. They come over the ridge the way the others came out of the roofs round Kalam's, low and from nowhere; but these don't settle. They come wrong. Too fast and too close together, knives already out, and one with a crossbow he hasn't remembered to keep low. A clan doesn't move like that. Not a clan with somebody left to tell it *no*.

${S.f.c4_key === 'shield' ? `Behind you, Vell says a name. Then another. He knows them. "That's the dome," he says. "The clan off the temple dome. Their master's the one they found up there yesterday with his throat open." He gets an elbow under himself and shouts across the gap, and his voice cracks on it: "*Not them! They held the roof! They held it for me!*"

The one leading them looks at Ocelot's rope-boy, sitting behind a Malazan shield, and you watch it make everything worse.` : SQUAD().includes('ellis') ? `Ellis has an arrow on the string. "Guild," she says, very low. "Not Ocelot's. That's a clan that's buried its master and hasn't picked another. Nobody left to say *no*." She doesn't take her eyes off them. "Frightened knives, Sergeant. They don't stop."` : `Kettle, very low: "Those aren't the ones off Kalam's roof. Those are *worse*." She's right, and she doesn't know why she's right, and neither do you.`}

They're coming down to the plank.`,
      ch:[{t:'"Hold the plank."', go:()=>startBattle('c4_clan',{})},
          {t:'Kettle skims a sharper along the Daru ridge, away from the edge.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('c4_clan',{pre:true})},
          {t:'Throw the plank down before they reach it.', check:['might',16], near:false,
            edges:id=>[id === 'kettle' && ['a sapper knows what a thing is pinned with', 1], S.f.c4_planks && ['Ellis read these planks for you', 1]],
            go:'c4_plank_down', fail:'c4_plank_stuck'}]}),
    c4_plank_down:()=>({sp:'The plank west', scene:'roof_night', fx:()=>{ S.f.c4_plankDown=1; }, txt:
`${by({
  brisk:`${S.f.c4_key === 'shield' ? 'Brisk leaves Vell to the chimney-stack and' : 'Brisk'} goes to the plank end and gets her shoulder under it, the way she'd get it under a cart in a ditch. The tar at the joint holds. Brisk holds longer.`,
  kettle:`Kettle is on her knees at the plank end before you've finished saying it, feeling under the lead with both hands. "Pinned," she says. "Here. And — *here*." She does something with a knife-blade under the gutter, and puts her whole weight on the end of the plank, and it gives.`,
  ellis:`Ellis doesn't heave at it. She kneels at the end and finds, with her good hand, the iron pin the Guild drives under the lead so a plank won't walk, and works it out. "Two years," she says through her teeth. "Same pin."`,
  sgt:`You get your shoulder under the plank end and heave. The tar at the joint holds. You hold longer.`,
  _:`{who} gets a shoulder under the plank end and heaves. The tar at the joint holds. {who} holds longer.`})}

The plank comes off the gutter with a crack like a bone, tips, and goes down end over end into the blue. For a long time there's no sound at all. Then a very small one.

The clan stops at the edge of the Daru roof. The gap is four paces of nothing. Nobody on that side is going to jump it, and nobody on this side is fool enough to wait and see. The one leading them looks at you across it, no mask, a young face that has got old since yesterday morning, and then down at the gutter where the plank was.

"That was a Guild plank," he says. In Malazan, quite quietly, as if that were the worst of it. Maybe it is.

${SQUAD().includes('ellis') ? `Ellis, at the hatch, not looking back: "Nobody throws away a thing that works." A pause. "We just did. They'll count it."` : SQUAD().includes('kettle') ? `Kettle, at the hatch: "I'd like it noted that it was a plank. Not a cusser. A *plank*."` : `At the hatch, nobody says anything at all.`}`,
      ch:[{t:'Down.', go:'c4_descend'}]}),
    c4_plank_stuck:()=>({sp:'The plank west', scene:'roof_night', txt:
`${by({sgt:'You get', _:'{who} gets'})} a shoulder under the plank end and heaves, and it doesn't come. It's tarred into the gutter and pinned under the lead, and whoever laid it laid it to stay where it was put. Guild work. Nobody in this city throws away a thing that works.

By the time it shifts, the first of them is on it.`,
      ch:[{t:'"Hold the plank."', go:()=>startBattle('c4_clan',{surprise:'e'})}]}),
    c4_after_clan:()=>({sp:'The plank west', scene:'roof_night', fx:()=>{ S.f.c4_clanFought=1; }, txt:
`It's decided on the planks, the way Fiddler said roof fights are: one at a time, and nobody waits in the middle. Two of them come off the planks the short way. The crossbow on the Daru side gets off what he can and then isn't there. And the one who led them is sitting on the far edge of the gap with his knife across his knees, not getting up, not coming on, looking at the ridge behind him where his master isn't.

Nobody goes back across for him.${preUsed('c4_clan') ? `

Behind him, on the Daru ridge, the chimney-stack is still burning where the sharper cracked the flue: blue at the root, yellow at the top, the little brass hat on the pot glowing like a coal. Somebody in the house under it is shouting, and somebody else is throwing water, which is the wrong thing to throw. A street away the Watch's fire-bell starts, two strokes and two strokes.

${SQUAD().includes('kettle') ? `Kettle stares at it. "It was a *sharper*," she says. "Sharpers don't *burn*." Nobody answers her. "Fiddler said. Not a sharper near the edge, not a burner anywhere, and the gas finds it. I went *away from the edge*." She watches the blue run along the gutter and go out. "The gas found it anyway. It's this city. The whole city's a cusser somebody built houses on."` : `Nobody says anything. Fiddler said it in the vault: you set fire to a roof in this city and the gas finds it. Nobody had thought he meant a sharper.`}` : ''}

${S.f.c4_key === 'shield' ? `Vell watches him from the chimney-stack for a long time. "The Guild's not one thing," he says at last. "I should have said. It's a lot of frightened people with the same name."${SQUAD().includes('brisk') ? ` Brisk gets his arm back over her shoulders. "Twice tonight," she says. She doesn't say it like a complaint.` : ''}` : SQUAD().includes('brisk') ? `Brisk held the plank end. She's still holding it, shield up, though there's nobody left on the plank. "That one I'd have stood for," she says. She doesn't say which one she means, and you don't ask.` : `Nobody says anything. There isn't anything to say that wouldn't be about the other roof.`}

${SQUAD().includes('ohl') ? `Ohl stands at the edge a moment, looking down where the two went. He doesn't take out the oilcloth. "Not mine," he says. "Somebody's." Then he turns his back on the drop and goes to the hatch.` : ''}`,
      ch:[{t:'Down.', go:'c4_descend'}]}),

    /* ---- the descent ---- */
    c4_descend:()=>({sp:'Down', scene:'city_street', txt:
`Down the chandler's chimney-stair in the dark, one at a time, with a hand on the wall, because the stair was built for sweeps and sweeps are small. Out through the loft. Down a ladder into a yard that smells of tallow.${S.f.c4_skyCreak ? `

There's a girl in the yard. In the doorway of the tallow-house, in a grey shawl, with her hands folded in front of her: the shape you saw in the doorway under the glass. She doesn't look at the roofs. She looks at ${S.f.c4_skyWho && S.f.c4_skyWho !== 'sgt' && SQUAD().includes(S.f.c4_skyWho) ? NAME(S.f.c4_skyWho) : 'you'}, once, the way you'd look at a line on a page you meant to come back to; and then she's looking at the gate again, and you are through it, and nobody says a word until the lane.

` : ' '}Through a gate that isn't locked, into a lane that isn't lit.

The ground is very solid after the roofs.

The lane goes down toward the Gadrobi District between blind walls. The blue from the street at the far end is a long way off. Above, between the eaves, a strip of sky with no stars in it, and somewhere up there, on the roofs, the dead are being turned over by the living, and the living are counting.

${S.f.c4_key === 'shield' ? `Vell is walking. Mostly. ${SQUAD().includes('brisk') ? `He has one arm over Brisk's shoulders and she's taking most of his weight without seeming to notice she's doing it, the way she takes the weight of a shield.` : `He has one arm over your shoulders, and he's lighter than he should be, and he keeps apologising for it.`} He keeps looking back up at the roofs. "They'll be waiting at the bottom," he says. "My people. They'll want to know where I've been. I'll tell them." A pause. "I'll tell them everything."${S.f.c4_ropeDown ? `

Halfway down, a rope hangs out of the dark between the eaves and stops at head height, turning a little, though there's no wind: the line off the Gadrobi chimney. Vell stops under it. "That's mine," he says. "I strung that, two nights ago." He looks at it, and then at ${S.f.c4_ropeFell && S.f.c4_ropeFell !== 'sgt' && SQUAD().includes(S.f.c4_ropeFell) ? `${NAME(S.f.c4_ropeFell)}'s` : 'your'} rope-burned palms, and very carefully doesn't ask.` : ''}` : `Nobody talks. ${SQUAD().includes('ellis') ? `Ellis is walking last, where a scout walks, and twice you see her stop and look back up the lane, and listen, and come on.` : `Kettle is walking last, with the crossbow cocked, and twice you hear her stop and listen and come on.`}${S.f.c4_ropeDown ? `

There's a long dark mark down one wall where something hung and swung against the brick, and nothing hanging there now. The line off the Gadrobi chimney has been taken in. Somebody has been down this lane before you tonight, and didn't mind you knowing it.` : ''}

Halfway down, the lane narrows between two warehouse walls, and there's no blue at all.`}`,
      ch:[{t:'On.', req:()=>S.f.c4_key === 'shield', go:'c4_vell_thanks'},
          {t:'On.', req:()=>S.f.c4_key !== 'shield', go:'c4_reprisal'}]}),
    c4_reprisal:()=>({sp:'The alley under the roofs', scene:'city_street', txt:
`They're waiting in the narrow part, where the warehouse walls lean together overhead and the lane is two shoulders wide. You don't see them. You smell them: lamp-soot and tar and the sour sweat of people who have been crouching in the dark for a long time, very still, getting angrier.

Four. Two in front, low, with the soot-black blades.${S.f.c4_ropeDown ? ` One of them has a coil of tarred line over his shoulder with a knot of black rag on the end of it. You know the line.` : ''} Two behind them, standing, not crouching: a woman with a Guild blade and a face like a shut door, and beside her an older man, grey at the temples, with a Guild blade held loose along his leg. ${S.f.c4_guildmen ? `You've seen him before. On Kalam's roof, kneeling among the dead, looking at your feet, and at the space where you stood aside.` : `You've seen him before, or the shape of him: one of the two who came back to Kalam's roof for the dead while you were still on yours.`}

He doesn't say anything for a long moment. When he does, it's in Malazan, careful, with the Daru bend on the vowels.

"Ocelot sends his regards." Flat. "We watched you on the Daru roof. We watched you step."${S.f.c4_rallickTail ? ` His head tips, very slightly, north, toward the roofs. "One of ours had his eyes on you from the Gadrobi ridge on. You made him curious. He told the clan-master what he saw."` : ''} He lifts the blade a little. "A Malazan squad, on a Guild roof, stood aside while one of ours was opened in front of it. Vell. He carried rope. He was seventeen." A breath. "The clan-master says that's an answer, Sergeant. He's not sure to what question. He's sent us to ask it again."

${SQUAD().includes('brisk') ? `Brisk has her shield up. She doesn't look at you. She hasn't looked at you since the roof. "I'd have stood," she says, to the old man, not to you, and it's the only thing she says.` : ''}`,
      ch:[{t:'"Close up."', go:()=>startBattle('reprisal',{})},
          {t:'Kettle rolls a sharper down the lane.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('reprisal',{pre:true})}]}),
    c4_after_reprisal:()=>({sp:'The alley under the roofs', scene:'city_street', fx:()=>{S.f.c4_reprisalFought=1;}, txt:
`It's close work in a lane that narrow, and there's no room to be clever, and nobody is. Shield and knife and elbow and wall. Then the yard, where there's room, which is worse: barrels going over, a quarrel out of the dark from the gallery steps, staves rolling underfoot like logs in a river. When it's over, one of the young ones is on his back in the gutter with his eyes open and the other has gone, back up the lane, running, and the old man is sitting against the warehouse wall with a hand pressed to his ribs, breathing in short pulls, looking at you.

He doesn't reach for the blade. It's on the cobbles by his foot. He could.

"There," he says. "Now it's asked." He coughs, and doesn't like what comes up, and wipes his mouth on his sleeve. "Go home, Malazan. Tell your one-armed— tell whoever it is you tell. The Guild's not buying. Not from you. Not from anyone who stands where you stood."${preUsed('reprisal') ? `

He looks past you, up the lane, at the eaves down across it and the brick-dust still hanging in the dark, and the black star on the cobbles where the sharper went off. "We came with knives," he says. "To ask. You answered with the Moranth." He nods, slowly, the way a man nods at a price. "Ocelot will hear it the way I heard it." Up toward the Daru District the Watch rattles are closer now, two and two, going from lane to lane, asking which of them has Moranth clay in it.

${SQUAD().includes('kettle') ? `Kettle is picking brick out of her hair. "A lane's a barrel," she says, to nobody. "You roll a sharper down a barrel and it comes out both ends. I *know* that." A pause. "I knew it before I rolled it."` : ''}` : ''}

${SQUAD().includes('ohl') ? `Ohl takes a step toward him. The old man looks at him, and at the Denul light coming up faint under Ohl's palms, and laughs, which costs him. "No," he says. "Not from you either, grandfather. Go on."

Ohl stops. He stands there for a moment with his hands lit, and then he lets the light go out, and turns, and walks on down the lane, and doesn't say anything, and doesn't take out the oilcloth.` : `Nobody goes to him. He doesn't want anyone to.`}

${SQUAD().includes('ellis') ? `Ellis, as you pass him, very low: "He let you win that. He'll say he didn't. He'll believe it." She doesn't look back. "They wanted to hurt us. They didn't want to kill us. That's a message too."${preUsed('reprisal') ? ` A glance back up the lane at the brick-dust. "So was ours. I'm not sure it was the one we meant."` : ''}` : ''}

Behind you, when you're thirty paces down the lane, you hear him get up.`,
      ch:[{t:'Back to the crossing.', go:'c4_dawn'}]}),
    c4_vell_thanks:()=>({sp:'Vell', scene:'city_street', fx:()=>{ gain('guildtoken'); }, txt:
`At the bottom of the lane, where it opens into a street with a single blue lamp on a bracket, Vell stops. He takes his arm off ${SQUAD().includes('brisk') ? `Brisk's shoulders` : `your shoulders`} and stands on his own, swaying, and turns round to face you.

"Here," he says. "They'll find me here. You shouldn't be here when they do." He's trying to be grave about it. He's seventeen and cut in three places, and trying very hard.

He fumbles in his coat and comes out with something small and dark, and holds it out on his palm. A disc of black horn the size of a thumbnail, with a hole through it. Nothing carved on it. Nothing at all.

"It's a token," he says. "A Guild token. Journeyman's. You show it at a door, the right door, and somebody opens it, and then they decide what to do with you." He almost smiles. "It won't make them like you. Nothing will. But they'll *open the door*. That's more than any Malazan's had in this city."

He puts it in your hand and closes your fingers over it with both of his, the way a child does.

"I'm Vell," he says, for the third time. "Journeyman. Ocelot's clan." Then, as if it had only just occurred to him: "I don't know your name."

${S.f.c3_falseName ? `You give him the one off the headstone in Unta. It's the one this city has. He repeats it carefully, to get it right, and you feel something like shame and don't know what to do with it.` : `You tell him. He repeats it carefully, to get it right.`}

"I'll remember," he says, and he will. That's the thing about debts in this city. The Guild keeps them longer than anyone.`,
      ch:[{t:'Leave him under the lamp.', go:'c4_corner'}]}),
    c4_corner:()=>({sp:'The street corner', scene:'city_street', txt:
`You go down the street, toward the Gadrobi crossing, and at the corner, under the next lamp, there's a man.

He's wearing a guardsman's coat, the city's grey and blue, with the brass buttons, and a guardsman's cap, and he's leaning on the wall with his arms folded the way the Watch lean on walls, and he isn't a guardsman. The coat fits. The cap is right. It's the way he's standing, which is not the way a man stands when he's waiting for his shift to end, but the way a man stands when he's waiting for something else to begin.

He doesn't look at you. He's looking up the street, the way you've come, toward the lamp where you left Vell. He watches it with no expression at all. Then, as you pass him, very slightly, without turning his head, he moves his weight off the wall, and back.

That's all.

${SQUAD().includes('ellis') ? `Ellis, when you're round the corner, very low: "That wasn't Watch." A pause. "The Claw's got a page on this city with a hole in the middle of it. Everything we ever sent into that hole came back as *a man on a corner*. Never the same corner. Never a name." She lets out a long breath. "I think we just walked past the hole."` : `Kettle, when you're round the corner, very low: "That wasn't Watch." "No." "Who was it?" "Nobody," you say, and you find you mean it as a kind of respect.`}`,
      ch:[{t:'Keep walking.', go:'c4_dawn'},
          {t:'Go back and nod to him.', go:'c4_corner_nod'}]}),
    c4_corner_nod:()=>({sp:'The street corner', scene:'city_street', fx:()=>{S.f.c4_nodded=1;}, txt:
`You go back to the corner. You don't know why. You stop, a pace off, the way you'd stop by a sentry from another company, and you nod to him, once.

He looks at you for the first time. Grey eyes, tired, in an ordinary face you'll never be able to describe. He looks at you for as long as it takes a lamp to hiss.

Then he nods back. Not much. Barely. The nod of a man who has noticed that a Malazan sergeant walked a Guild journeyman down off the roofs tonight and left him where his own people would find him, and has put that somewhere, in a ledger you'll never see, in a hand you'll never read.

And he looks away up the street again, and you are no longer there, as far as he's concerned, and you never were.

${SQUAD().includes('tuft') ? `Tuft, when you catch up with the squad: "Whoever that is," she says, "he's more afraid than we are. He's just been afraid for longer."` : ''}`,
      ch:[{t:'Back to the crossing.', go:'c4_dawn'}]}),

    /* ---- dawn: the debrief at the dig ---- */
    c4_dawn:()=>({sp:'The roof above the dig', scene:'roof', txt:
`Whiskeyjack isn't on his bucket. He's on the chandler's roof, over the dig, where the Fourth slept the first night, and by the look of him he has been standing there a long time. The sky over the Gadrobi Hills has gone from black to the grey that comes before black admits anything.

He doesn't say anything when you come up the ladder. He counts. ${SQUAD().length === 6 ? 'Six' : 'Five'}. Something in his shoulders lets go by the width of a hair.

"Report."

You give it to him the way he asked: in order, without anything in it that isn't so. The ladder. The roofs.${S.f.c4_sawSorry ? ` The skylight, and a fat man asleep at a table, and a girl in a grey shawl in the doorway${S.f.c4_skyCord ? ', winding a cord round two fingers,' : ''} who looked up through the glass at you.` : S.f.c4_skyCreak ? ` The skylight, and a creak of old glass, and a dark shape in a doorway that wasn't there when you looked again.` : ''}${S.f.c4_crokus ? ` A boy${S.f.c3_inn ? ' from the Phoenix' : ''}, running, with a bag, and a tall shape behind him, and nobody shooting.` : ''}${S.f.c4_rallick ? ` A man on a ridge watching a window${S.f.c4_rallickWindow ? ' in a big house on the brass-lamp hill' : ''}, who told you to go home${S.f.c4_rallickTail ? ', and then watched you instead' : ''}.` : ''} The Guild on the planks${S.f.c4_fewer ? `, and *Malazan* shouted at them, and one of them believing it` : S.f.c4_shoutFailed ? `, and *Malazan* shouted at them, and none of them believing it` : ''}${preUsed('guild_roofs') || preUsed('guild_roofs_2') ? `, and a sharper on the ridge, away from the edge, and a hole in an old woman's roof` : ''}.${S.f.c4_ropeTried ? (S.f.c4_ropeDown ? ' A Guild line between two chimneys, and how it came down.' : ' A Guild line between two chimneys, and what it was strung for.') : ''} Kalam's candles${S.f.c4_cantFar ? ', from a roof further back than he first put you' : ''}. The Guild coming out of the roofs. The tall shapes. How fast. How quiet. Kalam running.

Then the boy, and what you did.${heldDowns('andii_roof') > 0 ? ` That ${heldDowns('andii_roof') > 1 ? 'both of them' : 'one of them'} went down on the leads, and got up again.` : ''}${S.f.c4_clanFought ? ` The plank home, and the clan with no master that came down onto it${preUsed('c4_clan') ? ', and the chimney on the Daru ridge, and the gas' : ''}.` : S.f.c4_plankDown ? ' The plank home, and how it went down into the dark before they reached it.' : ''}${S.f.c4_skyCreak ? ` And on the way down, in the tallow-yard at the foot of the stair, a girl in a grey shawl, waiting.` : ''}${S.f.c4_reprisalFought ? ` The lane, and Ocelot's question in it${preUsed('reprisal') ? ', and the sharper you answered it with' : ''}, and an old man sitting against a warehouse wall telling you to go home.` : ''}

${S.f.c4_sawSorry || S.f.c4_skyCreak ? `At *a girl in a grey shawl*, his eyes move, once, to the chandler's shutters down below, where there's nobody standing now. He doesn't say anything. He files it somewhere deep.` : ''}

He listens to all of it with his face doing nothing. He doesn't interrupt. When you get to the boy, he doesn't move at all.${heldDowns('andii_roof') > 0 ? ` When you get to the tall shape on its knees on the leads, his eyes come off the lake to your face, and stay there until you've finished.` : ''}

When you've finished, he lets the silence go on until a lamp at the corner of the crossing hisses, and gutters, and goes out.

"I know," he says.

It's not a reproach. He's telling you a fact. He knew before you came up the ladder. He knew, you think, before you went up it.`,
      ch:[{t:'"Kalam, sir?"', go:'c4_dawn_kalam'}]}),
    c4_dawn_kalam:()=>({sp:'Kalam', scene:'roof', txt:
`Kalam is sitting against the chimney at the far end of the roof. You didn't see him when you came up. He has a bandage round his forearm and another under his shirt that he's pretending isn't there, and his knives are laid out on the tiles in front of him, all of them, in a row, and he's cleaning them, one by one, very slowly.

He's alive. That's the first thing.

He's furious. That's the second, and it's worse. Not loud. Kalam doesn't get loud. It's in the way he wipes each blade and lays it down exactly parallel to the last, and in the way he doesn't look up, and in the way the air round him feels like the air round a banked forge.

${S.f.c4_kalamLook ? `He does look up, once, when you come near. At you. The same beat too long as in the vault. Then back down to the knives.` : ''}

"Moon's Spawn," he says.

Nothing else. Not to you. Not to anyone. He picks up the next knife and starts to clean it.${trickBy('cant') ? `

Only, as ${trickBy('cant') === 'sgt' ? 'you pass' : `${NAME(trickBy('cant'))} passes`} him, his free hand moves on the tiles beside the knives: a flat palm, wiped once across the slate, left to right. Nobody needs the cant for that one. *Nothing. I showed you nothing.*` : ''}`,
      ch:[{t:'Whiskeyjack.', go:'c4_dawn_wj'}]}),
    c4_dawn_wj:()=>({sp:'Whiskeyjack', scene:'roof', txt:
`Whiskeyjack has turned back to the lake. The Moon's Spawn hangs over it, black against the grey, and the light is coming up over the hills to the east and not touching it.

"The Guild won't deal," he says. "Not with us. Not tonight, not this month. Kalam went up to buy them and found somebody'd already bought the roof out from under him, with the Guild still on it." He doesn't sound angry. He sounds like a man reading a distance. "That's that, then. We do this the other way."${preUsed('c4_clan') ? `

"There was a fire on the Daru ridge in the third bell," he says, to the lake. "A chimney. Blue at the root. The Watch had it out with sand before it found the next house, and they're saying *the gas*."${SQUAD().includes('kettle') ? ` He doesn't look at Kettle. "Everybody in this city says the gas. Fiddler will want a word, Sergeant. He'll want it with you, and then he'll want it with her, and it'll be the same word."` : ` A pause. "Everybody in this city says the gas. Fiddler will want a word, Sergeant."`}` : ''}${preUsed('reprisal') ? `

"And somebody put Moranth clay in a lane above the Gadrobi crossing in the small hours. The Watch were up and down the lanes with rattles till the fourth bell, asking road crews where they'd been." A pause. "Nobody's asked ours. Yet."` : ''}

${S.f.c4_key === 'shield' ? `A long pause.

"Quick Ben says the second one hesitated."

He doesn't turn round.

"Why would it do that, Sergeant?"

He knows. You can hear that he knows, the way you can hear a man knows the answer to a question he asks a recruit, and wants to hear what the recruit says. It's the wrong shape of question. It's got something else inside it, the way the sack had something inside it.` : `A long pause.

"Quick Ben says it nodded at you."

He doesn't turn round.

"Why would it do that, Sergeant?"

He doesn't know. For the first time since you've known him, you can hear Whiskeyjack asking a question he doesn't know the answer to, and not liking the sound of his own voice doing it. It's the wrong shape of question. It's got something else inside it, the way the sack had something inside it.`}`,
      ch:[{t:'"Because of what was in Quick Ben\'s sack, sir."', req:()=>S.f.c4_key === 'shield', go:'c4_dawn_answer'},
          {t:'"Because it wanted us to know it had seen us, sir."', req:()=>S.f.c4_key !== 'shield', go:'c4_dawn_answer'},
          {t:'"I don\'t know, sir."', go:'c4_dawn_dunno'}]}),
    c4_dawn_answer:()=>({sp:'Whiskeyjack', scene:'roof', fx:()=>{S.f.c4_answered=1;}, txt:
`${S.f.c4_key === 'shield' ? `He turns his head, then. Not all the way. Enough.

"Don't," he says. Very quietly. "That's the one thing you saw tonight that you didn't see. Understood? You saw a Tiste Andii stop on a roof. You don't know why. Nobody knows why. If anybody asks you, Claw or Guild or Kruppe or the Empress herself, you don't know why, and you'll say it so they believe it."

He looks back at the lake.

"You stood in front of one of them, for a Guild boy." He says it slowly, as if tasting it. "That was a stupid thing to do. I'd have done it. I'd like you not to do it again, and I know you will." A breath. "Brisk'll be insufferable."` : `He turns his head, then. Not all the way. Enough.

"Yes," he says. "That's what I thought. I wanted to hear if you'd say it." He looks back at the lake. "Something on that mountain knows your squad's faces now. Not your names. Faces. It doesn't need names."

"You did what I told you. You watched. You didn't help." His voice doesn't change at all. "I told you it'd feel like cowardice. It isn't. I also didn't tell you it'd feel like *that*." He doesn't look at the place on your roof where the boy is not. He doesn't need to. "That's mine, Sergeant. Not yours. I sent you up."`}`,
      ch:[{t:'The squad.', go:'c4_close'}]}),
    c4_dawn_dunno:()=>({sp:'Whiskeyjack', scene:'roof', txt:
`"No," Whiskeyjack says. "Neither do I."

${S.f.c4_key === 'shield' ? `It isn't true. You both know it isn't true. He says it the way you'd put a lid on a pot, and you let him, because the thing in the pot is Quick Ben's, and whatever it is, it laughs.

"Keep not knowing," he says. "It's a skill. Quick's been practising for years." He looks back at the lake. "You stood in front of one of them for a Guild boy. I'll hear about that from the Guild before I hear about it from Dujek, and I'll hear it from both." A breath. "I'd have done it. Don't tell Kalam I said so."` : `It's true. That's the terrible thing. It's the truest thing he's ever said to you.

"Something on that mountain looked at the Fourth tonight," he says, "and decided it was worth a nod. I don't know what that buys you. I don't know what it costs." He looks back at the lake. "You watched, like I said. You didn't help. That was the order and you kept it." A pause. "The boy's mine. Not yours. I sent you up. Put him on my list, not yours, if you keep one."`}`,
      ch:[{t:'The squad.', go:'c4_close'}]}),

    /* ---- chapter close: the roof at dawn ---- */
    c4_close:()=>({sp:'The chandler\'s roof', scene:'roof', txt:
`The city goes out lamp by lamp. You've seen it do it before, from this roof, and it's the same, and it isn't: the blue shrinking back into the glass street by street, as if something beneath the city were breathing in, and then gone.

The Fourth is in a row under the eaves. Nobody is asleep.

${S.f.c4_key === 'shield' ? `A Guild debt, in horn, is in your pocket. A Tiste Andii's cloak is ${SQUAD().includes('tuft') ? `on Tuft's shoulders, and she hasn't taken it off` : `in the pack, weighing nothing`}. A boy called Vell is somewhere in the Daru District, being stitched by somebody who isn't Ohl, telling his clan-master how a Malazan squad held a roof. The Guild will hate you for it a little less than it hates everyone else. That will have to be enough.` : `A dead boy's rope-and-hook is coiled at your feet. A Tiste Andii's cloak is ${SQUAD().includes('tuft') ? `on Tuft's shoulders, and she hasn't taken it off` : `in the pack, weighing nothing`}. The Guild asked its question in an alley, and you answered it, and nobody liked the answer. And somewhere on that black mountain over the lake, something tall has your face.`}

The squad is awake. You could talk to any of them. It's the hour for it.`,
      ch:[{t:'Tuft.', req:()=>SQUAD().includes('tuft') && !S.f.c4_closeTuft, fx:()=>{S.f.c4_closeTuft=1;}, go:'c4_close_tuft'},
          {t:'Ohl.', req:()=>SQUAD().includes('ohl') && !S.f.c4_closeOhl, fx:()=>{S.f.c4_closeOhl=1;}, go:'c4_close_ohl'},
          {t:'Brisk.', req:()=>SQUAD().includes('brisk') && !S.f.c4_closeBrisk, fx:()=>{S.f.c4_closeBrisk=1;}, go:'c4_close_brisk'},
          {t:'Kettle.', req:()=>SQUAD().includes('kettle') && !S.f.c4_closeKettle, fx:()=>{S.f.c4_closeKettle=1;}, go:'c4_close_kettle'},
          {t:'Ellis.', req:()=>SQUAD().includes('ellis') && !S.f.c4_closeEllis, fx:()=>{S.f.c4_closeEllis=1;}, go:'c4_close_ellis'},
          {t:'Watch the last lamp go out.', go:'c4_close_end'}]}),
    c4_close_tuft:()=>({sp:'Tuft', scene:'roof', txt:
`She's sitting at the end of the row with her knees drawn up, in the grey cloak, looking at the Spawn. The light doesn't touch it. It doesn't quite touch her either.

${S.f.c4_tuftDark ? `"It's still cold," she says, before you can speak. "The cloak. It hasn't warmed up. Cloth warms up. This doesn't." She turns her hand over inside it, as if checking it's still there. "I keep thinking I can hear something. Not a voice. The place a voice would be, if there were one. A long way off, and down."

She's quiet for a moment.

"Under the Pale I thought Kurald Galain was a flood. Something that happened to you. It isn't. It's a *house*, Sergeant. Somebody lives in it. And tonight, for as long as it takes to breathe out, somebody in the house came to the window." A breath. "It was *polite* about it. That's the part I keep coming back to." She pulls the cloak closer. "I'd like to tell you I'm frightened. I've been trying to be, all the way down the stairs."` : `"You were wrong," she says, before you can speak. Not unkind. Just a fact, like the weather. "Stupid and wrong, and it came out right, and you'll think that means you weren't." She turns her hand over inside the cloak, as if checking it's still there. "I saw what it was. Up close. I saw what it could have done, and didn't. It wasn't *you* it didn't do it for."

She's quiet for a moment.

"The cloak's still cold," she says, differently. "Cloth warms up. This doesn't. I keep thinking I can hear something, in it. Not a voice. The place a voice would be. A long way off, and down." She pulls it closer. "I'm not going to take it off. I thought you should know that. I don't entirely know why."`}`,
      ch:[{t:'Back to the row.', go:'c4_close'}]}),
    c4_close_ohl:()=>({sp:'Ohl', scene:'roof', txt:
`He's sitting with his back to the chimney and a cup of his tea going cold in his hands. He's not drinking it. He's holding it for the warmth.

${S.f.c4_key === 'shield' ? `"I crossed one off," he says, when you sit. "Did you see? I don't get to do that. Twenty-two years, and the list goes one way." He turns the cup. "I've had names on it I thought were going to come off. Soldiers carried in who might have lived. I never wrote those. I wait. I wait until I'm sure." A breath. "Tonight I didn't wait. I wrote him as he came over the parapet. I *knew*." He looks at the cup. "And then I didn't know. I'd forgotten that could happen. I'm too old to be surprised, Sergeant. It was very pleasant."

He drinks the tea, finally, cold, and makes the face.` : `"${S.f.c2_key === 'light' ? 'Two hundred and thirteen' : 'Two hundred and twelve'}," he says, when you sit. He doesn't look at you. "I read it again on the stair. I read them all, most nights. I know where each of them is, on the cloth. I can find any of them in the dark."

He turns the cup.

"I'll be able to find him too. That's the thing. He'll be there with the rest, and in a year I won't be able to tell you which ones Hood took and which one was handed over." He looks at the cup. "I don't want to forget which. I'm going to make a mark. Not a big one. A small one, by his name, so I'll know." A pause. "I've never made a mark before. I don't know what shape it should be."

He doesn't drink the tea. He pours it out onto the tiles, slowly, and watches it run into the gutter.`}`,
      ch:[{t:'Back to the row.', go:'c4_close'}]}),
    c4_close_brisk:()=>({sp:'Brisk', scene:'roof', txt:
`${S.f.c4_key === 'shield' ? `She's got her shield across her knees and a hammer from Fiddler's kit, and she's knocking the rim straight, very gently, a tap at a time, with the whole of her attention.

"Frost's gone out of it," she says. "Went on the way down. Left the bend." Tap. "I'm not taking the bend all the way out. I'm leaving a bit."

She doesn't explain. After a while she does anyway.

"Nathilog, I held a line in front of the Fist's tent. Two days. Lost four out of nine. Nobody behind that line was going to die. The Fist was in the next valley, it turned out. We held a line in front of an empty tent." Tap. "Tonight there was a boy behind it." She sights along the rim. "I'm leaving a bit of the bend in. So I know which dent was for something."` : `She's sitting as far down the row as the roof allows, with the ledger closed on her knee. She doesn't look up when you sit. She doesn't move away, either, which you take as the most she can manage.

"I've written it," she says. "What happened on the roof. I wrote *stood aside*. I thought about writing *by order*. It was by order. Whiskeyjack said watch." She turns the ledger over in her hands. "I didn't write it. It'd be true, and it'd be a lie."

A long silence.

"I took the step with you. I want that in there too. I didn't have to. I did." She puts the ledger away. "Don't ask me to take it again, Sergeant. I'll take it. That's the problem."`}`,
      ch:[{t:'Back to the row.', go:'c4_close'}]}),
    c4_close_kettle:()=>({sp:'Kettle', scene:'roof', txt:
`She's actually asleep again, for about a breath, and then she isn't, because she heard you sit down. She's got the satchel in her arms.

"${S.inv.cusser === 0 ? 'No cussers' : S.inv.cusser === 1 ? 'One cusser' : `${S.inv.cusser} cussers`}," she says, without opening her eyes. "${['No','One','Two','Three','Four','Five','Six'][S.inv.sharper] || S.inv.sharper} sharper${S.inv.sharper === 1 ? '' : 's'}. ${['No','One','Two','Three','Four','Five','Six'][S.inv.burner] || S.inv.burner} burner${S.inv.burner === 1 ? '' : 's'}."${S.f.c4_cusserHeld && S.inv.cusser > 0 ? ` A pause. "I didn't throw it. Did you see? On the roof, with the knives coming. I had it in my *hand*."

She opens her eyes and looks at the city, going grey in the dawn, all those roofs, all those houses under them, all those kitchens with gas pipes coming up through the floor.

"Hedge'd say I've gone soft." She thinks about it. "Fiddler'd say I've gone sapper. I'd rather Fiddler." She shuts her eyes again.` : ` She opens her eyes and looks at the city, going grey in the dawn, all those roofs, all those houses under them. Then she shuts them again.`}${preUsed('c4_clan') ? ` "And I set a roof on fire with a *sharper*. Do you know how hard that is? Away from the edge, and the gas found it anyway." She hugs the satchel. "Fiddler's going to stand there and not say anything. For a *week*."` : ''} "Sergeant. That thing on the roof. The tall one. ${S.f.c4_key === 'shield' ? `I put a quarrel in it and it didn't look round.${preUsed('andii_roof') ? ' I lit it up and looked it in the face and it didn\'t *mind*.' : ''}` : `It walked past me close enough to touch, and I had the crossbow in my hands, and I didn't lift it. I *couldn't*.`}" A long breath. "That's the first thing in six years I couldn't make stop being a thing. I don't like it. I want you to know I don't like it."`,
      ch:[{t:'Back to the row.', go:'c4_close'}]}),
    c4_close_ellis:()=>({sp:'Ellis', scene:'roof', txt:
`She's at the parapet, sitting with her legs over the drop, where she can see the whole of the Gadrobi roofs going grey. She doesn't turn round.

${S.f.c4_ellisRoofs ? `"Four of us came down, last time," she says. "Two years ago. I told you."` : `"I've been on these roofs before," she says. "Two years ago, for the Claw. Six of us went up. Four came down."`} She points, with the gloved hand, at a roof three streets north, a steep one with a lead gutter. "Corporal Hesk. That one. ${S.f.c4_planks ? 'The pine plank.' : 'There\'s a plank up there, pine, cut to look like oak. It\'s still there.'} I told the Claw it was bait. I told them the day before." She lowers the hand. "They sent him across it anyway. To see if I was right."

"I was right." A breath. "I've always wondered whether they knew I would be, and sent him to find out whether I'd say so twice."

${S.f.c4_key === 'shield' ? `She's quiet for a long time. "You didn't ask anyone whether you were right, tonight," she says at last. "You just stood there. I've never worked for anyone who did that." Another silence. "I'm still not used to it. Don't stop."` : `She's quiet for a long time. "You stepped aside because you were told to watch," she says at last. "The Claw would have written that up as good work. It *was* good work." She pulls her knees up. "I'd just hoped this squad wrote things up differently."`}`,
      ch:[{t:'Back to the row.', go:'c4_close'}]}),
    c4_close_end:()=>({sp:'The chandler\'s roof', scene:'roof', txt:
`The last lamp on the lakefront goes out.

In the grey that's left, you look for them, the way you looked for them from this roof two dawns ago, the crouched shapes along the ridges, facing all the same way like crows in a field. They aren't there. The roofs of Darujhistan are empty, from the Gadrobi temples to the palaces on the hill, empty and wet and ordinary, with smoke starting to go up from the chimneys where somebody has lit a kitchen fire.${preUsed('c4_clan') ? ' On the Daru ridge one chimney has no pot on it any more, only a black stump and a long stain down the slates, and nobody is going to light that one again.' : ''}${preUsed('guild_roofs') || preUsed('guild_roofs_2') ? ' On the Gadrobi side, an old woman is standing on a stool in her attic with her head out of a hole in her roof, looking at the mountain over the lake, and waiting for ' + (SQUAD().includes('kettle') ? 'market day.' : 'somebody to come about it.') : ''}

The Guild is not on the roofs this morning. The Guild is under them, counting.

${S.f.c4_key === 'shield' ? `And across the lake, the Moon's Spawn, black, with the dawn going round it the way water goes round a stone. You look at it for a long time. Somewhere on it, you think, something is also looking at a roof. It hesitated. You'd swear to it in front of Dujek. You're beginning to understand you'll never be asked to.` : `And across the lake, the Moon's Spawn, black, with the dawn going round it the way water goes round a stone. You look at it for a long time. You have the feeling, clear as cold water, that it's looking back, and that it knows exactly which roof to look at.`}

${SQUAD().includes('tuft') ? `At the end of the row, in the grey cloak, Tuft is looking at it too.` : ''}

Below, Whiskeyjack has gone back down to his bucket. Kalam has gone somewhere. Quick Ben is sitting on the chandler's step with the sack in his lap, whistling, and the city starts, around all of you, to shout about fish.`,
      ch:[{t:'Sleep. Or pretend.', fx:()=>{S.f.c4_done=1;}, go:()=>chapterEnd(4, S.f.c4_key || 'aside')}]}),
  }
};
