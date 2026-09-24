/* ============ chapter 4: Assassins ============ */
const CH4 = {
  title:'Assassins', number:'Four',
  intro:{loc:'Darujhistan', sub:'The rooftops · the second night', cap:'Slate and chimney-pots under a blue haze, and above them a black mountain with no light in its windows.',
    paras:[
`Two nights since the dye-shop. Two nights of hauling nothing, guarding a hole, and pretending to be a road crew for a city that has stopped pretending not to notice. The Gadrobi crossing has a new brazier and an old silence. Hedge sings in the hole. Trotts stands at the stakes. Whiskeyjack sits on his bucket, and looks at the lake, and does not say what he is waiting for, which is how you know he is waiting for something.`,
`The city has started dying on its roofs. Not in its streets; its streets are as loud as ever, fish and bells and blue lamps. On the roofs. A body on the tannery ridge at dawn, face-down, knives still in the sheaths. Two on the Gadrobi temple dome, the morning after. A man in a guild jerkin found hanging by one foot from a gutter on the Street of Tanners' Daughters, and nobody on the street will say which guild. The Watch go up with ladders and come down with sheets and say *the gas*. Everyone in Darujhistan knows it is not the gas. Nobody in Darujhistan says what it is.`,
`Kalam has been sitting on the chandler's step since noon, sharpening a knife that was sharp at breakfast. He does it slowly, with a stone the size of a thumb, and he does not look at the blade while he does it. He is looking at the roofs. When the lamps come on, street by street, he puts the stone away, and stands, and Whiskeyjack stands too, and neither of them says anything, and the whole crossing goes quiet around them as if a door had opened somewhere and let the cold in.`],
    go:'Up', node:'c4_start'},

  areas:[
    /* 16 columns x 12 rows.  . roof tile  , slate  # drop / open air  p plank  C chimney  S skylight  x washing-line post  > exit east (to the Daru roofs) */
    { id:'roofs_gadrobi', title:'Darujhistan · the Gadrobi roofs', sub:'Night · the second night', hint:'Tap roof to move · tap a figure to talk · the planks hold · the way on is east', decor:'roof_night',
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
             {id:'qb', name:'Quick Ben', kind:'qb', x:9, y:4, node:()=>'c4_qb_after', show:()=>!!S.f.c4_key && !S.f.c4_qbAfter, fresh:()=>true} ] } ],

  battles:{
    guild_roofs:{title:'The Gadrobi roofs', warrenText:'Open air on every side · the blue haze below · warrens steady', warren:{meanas:1.1,denul:1}, dark:true, music:'dark', style:'roof',
      map:["#......#","...##...","........",".#....#.","........","##....##","........","...,,...","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildknife',1,1],['guildknife',6,1],['guildknife',3,2]], xp:200, after:'c4_after_guild'},
    guild_roofs_2:{title:'The Gadrobi roofs', warrenText:'Open air on every side · the blue haze below · warrens steady', warren:{meanas:1.1,denul:1}, dark:true, music:'dark', style:'roof',
      map:["#......#","...##...","........",".#....#.","........","##....##","........","...,,...","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildknife',1,1],['guildknife',6,1]], xp:200, after:'c4_after_guild'},
    andii_roof:{title:'Two roofs over', warrenText:'Kurald Galain pours off the Spawn · Meanas drowns in it · Denul gutters', warren:{meanas:1.5,denul:0.7}, dark:true, music:'dark', style:'roof',
      map:["#......#","........","..#..#..","........","#......#","........","...,,...","#......#","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['andiihunter',4,1]], xp:220, after:'c4_after_andii',
      objective:{type:'survive', rounds:3, text:'Stand between them. Hold the roof for three rounds.'},
      allies:[['vell',6,8]],
      waves:[{round:2, foes:[['andiihunter',6,0]], text:'A second shape. It does not hurry.'}] },
    reprisal:{title:'The alley under the roofs', warrenText:'No lamps · wet stone · Meanas leans into the dark · Denul holds', warren:{meanas:1.3,denul:1}, dark:true, music:'dark', style:'city',
      map:["##....##","........",".#....#.","........","...##...","........","#......#","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildknife',1,1],['guildknife',6,1],['guildveteran',3,0]], xp:220, after:'c4_after_reprisal'} },

  foes:{ guildknife:{name:'Guild assassin', sig:'a', hp:14, ac:15, atk:6, dmg:[1,8,2], rng:1, mv:6, init:5, verb:'cuts at'},
         guildveteran:{name:'Guild veteran', sig:'A', hp:24, ac:16, atk:7, dmg:[1,10,3], rng:1, mv:6, init:6, verb:'opens'},
         andiihunter:{name:'Tiste Andii', sig:'T', hp:60, ac:17, atk:8, dmg:[2,6,3], rng:1, mv:6, init:7, boss:true, verb:'takes apart'},
         vell:{name:'Vell', sig:'v', hp:10, ac:13, atk:4, dmg:[1,6,1], rng:1, mv:6, init:4, verb:'stabs at'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    guildtoken:{name:'Guild token', slot:'trinket', who:null, stat:{guile:1}, line:'A disc of black horn the size of a thumbnail, with a hole through it and nothing carved on it at all. Vell says it opens a door. He does not say which door, or who is behind it, or what they will think of a Malazan holding it.'},
    ropehook:{name:'Journeyman\'s rope-and-hook', slot:'trinket', who:['ellis','sgt','kettle'], mv:1, line:'Thirty feet of tarred line and a three-pronged hook, wrapped in rag so it does not ring on slate. A Guild journeyman\'s kit. The rag is new. The journeyman is not going to need it.'},
    guildblade:{name:'Guild blade', slot:'weapon', who:['sgt','ellis','kettle'], atk:1, line:'A short straight blade blackened with lamp-soot, the edge left bright. No guard to catch on a gutter. Made to be carried up a drainpipe in the teeth, and it has been.'},
    andiicloak:{name:'Andii-grey cloak', slot:'armour', who:['tuft'], ac:1, line:'Grey, the grey of ash on a cold hearth, and lighter than cloth should be. It does not quite take the lamplight. Nobody but Tuft will put it on. Nobody else has been asked, and nobody else has offered.'} },

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

He says nothing about it. He never will. That's the worst thing he could have done, and he does it perfectly.` : `He looks at you, briefly, the way he looks at everything: as if measuring the distance to it and the time it would take to cross.`}

"Two roofs over," he says. "West of me. There's a chimney with a cracked pot on it. Sit behind it. When the people I'm meeting come, they'll come from every direction but that one, because that roof's got a skylight on the next one and nobody likes a skylight at their back." A pause you could fit a knife in. "Don't sit on the skylight."

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
      ch:[{t:'Look through the skylight.', req:()=>!S.f.c4_skylight, fx:()=>{S.f.c4_skylight=1;}, check:['wits',12], go:'c4_sky_ok', fail:'c4_sky_fail'},
          {t:'"Ellis. Which planks?"', req:()=>SQUAD().includes('ellis') && !S.f.c4_planks, go:'c4_planks'},
          {t:'Across the roofs.', go:()=>startExplore()}]}),
    c4_sky_ok:()=>({sp:'The skylight', fx:()=>{S.f.c4_sawSorry=1;}, txt:
`You kneel at the edge of the glass. Old glass, green and full of bubbles, but you can see.

A tavern's back room. A table. On the table, cups, and a plate with the ruin of a pastry on it, and a fat man in a red waistcoat asleep in his chair with his chin on his chest and his hands folded over his stomach like a man laid out for a funeral he intends to enjoy.${S.f.c3_kruppeMet || S.f.c3_inn ? ` Kruppe. Of course it is.` : ''}

And in the doorway of the room, a girl.

A plain face. A grey shawl. She is standing in the doorway with her hands folded in front of her, looking at the sleeping man, and she does not move. Not the stillness of someone waiting. The stillness of a thing that has been put there, and will be there until it is picked up again. You watch her for the space of ten breaths. She does not blink once.

Then she lifts her eyes, and looks up, through the bubbled glass and the dark, directly at you.

She can't see you. The glass is lamplit on her side and black on yours. She looks a moment longer, as if reading a line on a page, and then turns back to the fat man.

${SQUAD().includes('ellis') ? `Ellis, at your shoulder, has stopped breathing. "Sorry," she says. "That's the one from the crossing.${S.f.c3_inn ? ` And the fat one's the one from the Phoenix.` : S.f.c3_kruppeMet ? ` And the fat one's the one who talked at you in the street.` : ''}" Her gloved hand is flat on the slates. "She's not guarding him, Sergeant. Look at her. She's *watching his friends*. Whoever comes through that door next, she's already decided."` : `Tuft, at your shoulder, has stopped breathing. "It's her," she says. "The one from the crossing. The one with something inside." She takes her hand off the glass as if it had gone hot. "She's watching the door. Not him. Whoever comes to sit with him."`}

You get up off your knees. Your knees are shaking. You tell yourself it's the slate.`,
      ch:[{t:'"Ellis. Which planks?"', req:()=>SQUAD().includes('ellis') && !S.f.c4_planks, go:'c4_planks'},
          {t:'Away from the glass.', go:()=>startExplore()}]}),
    c4_sky_fail:()=>({sp:'The skylight', txt:
`The glass is old and thick and full of bubbles, and the room below bends in it like a room at the bottom of a well. A table. A lamp. A great round red shape in a chair that might be a man, asleep, or might be a pile of cushions, or a very large cat. A darker shape in what might be a door.

You lean closer. The glass creaks under your palm, a long thin sound like ice on a pond in the first cold week.

${SQUAD().includes('brisk') ? `Brisk's hand is on your collar before the creak has finished. She doesn't pull. She just holds, and you understand that if the glass goes she has decided you are not going with it. "Kalam said don't sit on the skylight," she says. "Kneeling on it's sitting on it slower."` : `Kettle hisses at you from the hatch. "Sergeant. *Sergeant.* That's a *window*."`}

When you look again the dark shape in the door isn't there. Or it's there and you can't see it. With that glass, you can't tell which, and you find you would rather not know.`,
      ch:[{t:'"Ellis. Which planks?"', req:()=>SQUAD().includes('ellis') && !S.f.c4_planks, go:'c4_planks'},
          {t:'Away from the glass.', go:()=>startExplore()}]}),
    c4_planks:()=>({sp:'Ellis', fx:()=>{ S.f.c4_planks=1; if (SQUAD().includes('ellis')) loy('ellis',1); }, txt:
`She's already looking. She crouches at the edge of the roof where the first plank goes over to the next, and doesn't touch it, and reads it the way she read the prints on the plain.

"That one." The near plank, to the slate roof. "Oak. Tarred at the ends. That's a Guild plank; they tar them so they don't rot in the joints, and they don't let anyone else use them, so it's never been walked by anyone heavy." She glances at Brisk. "It'll hold her. Just."

"Not that one." A second plank, a little north, that looks newer and better. "That's bait. It's pine, cut to look like oak. Somebody's put it there for somebody who isn't looking. It'll hold half a man. It'll hold him right to the middle."

She stands, and brushes off her knees with her good hand.

"Two years and they haven't moved it. I told the Claw. Nobody told the Guild." She almost smiles. "So they're still catching people with it. That's Darujhistan. Nobody throws away a thing that works."

${SQUAD().includes('brisk') ? `Brisk looks at the good plank for a long time. Then at Ellis. Then she steps onto it, and walks across it, one step at a time, with her shield on her back and her spear in her hand, and it bows under her like a bow drawn to the ear, and holds, and she steps off the far end and turns round and says: "Just."` : ''}`,
      ch:[{t:'Across the roofs.', go:()=>startExplore()},
          {t:'Look through the skylight first.', req:()=>!S.f.c4_skylight, fx:()=>{S.f.c4_skylight=1;}, check:['wits',12], go:'c4_sky_ok', fail:'c4_sky_fail'}]}),

    /* ---- Rallick Nom ---- */
    c4_rallick:()=>({sp:'A man on the ridge', fx:()=>{S.f.c4_rallick=1;}, txt:
`He is sitting on the ridge of the far roof with his back against a chimney and his knees drawn up, and you did not see him until you were close enough to spit on him, which is the first thing you notice about him and the last thing you'll forget.

A lean man. Not tall. A dark plain coat, and a plain face under a plain cap, and a pair of hands resting on his knees, open, where you can see them, in a way that tells you he has thought about where you can see them. He isn't watching you. He's watching a house, three streets north, on the hill where the lamps are brass: one window with a light in it, high up.

"Go home, Malazan," he says, without looking round. "This isn't your war."

His voice is very tired and very level, the voice of a man who has been saying the same thing to himself for a long time and has stopped expecting to be believed.`,
      ch:[{t:'"Whose war is it?"', check:['guile',12], go:'c4_rallick_ok', fail:'c4_rallick_fail'},
          {t:'"We\'re a road crew."', go:'c4_rallick_fail'},
          {t:'Leave him to his window.'}]}),
    c4_rallick_ok:()=>({sp:'A man on the ridge', fx:()=>{S.f.c4_rallickOk=1;}, txt:
`He turns his head, then. Not far. Enough to look at you out of the side of his eyes, the way a man looks at a dog that has just done something unexpectedly intelligent.

"Nobody's," he says. "That's the joke. There's a war on these roofs, and the Guild think it's your Empire's, and your Empire thinks it's the Guild's, and the dead don't get a vote." He looks back at the window. "Something came to the city with that mountain, Malazan. Something that doesn't talk. It's killing us because somebody told it to, and it's very good, and it doesn't care which of us it kills, because it isn't killing *us*. It's killing a door. Your Empress wanted to walk through the Guild. Somebody's bricking up the Guild so she can't."

A long breath.

"My own clan-master sent me up tonight to find out whose it is. I'm not looking. I've got my own business." The window, three streets north. "I've had my own business for five years. I'm not going to put it down now for a war that isn't mine either."

He turns his face away. That's the end of it. You have the strong sense that you have been told more than he's said to anyone in a year, and that he'll kill you if you ever repeat it, and that he'd be sorry about it, and do it anyway.

${SQUAD().includes('ellis') ? `Ellis, when you're three roofs away: "Rallick Nom. Ocelot's clan. The Claw has a page on him. Half of it's crossed out, because every time we thought we knew what he wanted, it turned out he wanted something else." A pause. "The window's the other half."` : ''}`,
      ch:[{t:'Leave him.'}]}),
    c4_rallick_fail:()=>({sp:'A man on the ridge', fx:()=>{S.f.c4_rallickTwice=1;}, txt:
`He doesn't answer. He doesn't need to. He looks at you for the first time, fully, a long level look that starts at your boots and goes up and finds, somewhere around your collarbone, everything it was looking for.

"Road crew," he says. "On a roof. At the eighth bell. With a shield." He looks back at the window. "Darujhistan's full of road crews this month. They're all very bad at it."

"Go home, Malazan. I won't say it a third time. I'll be gone before you'd need me to."

${SQUAD().includes('kettle') ? `Kettle, very quietly, as you move off: "I like him." Brisk: "You like anyone who'd kill you politely." Kettle considers this. "Yes."` : ''}`,
      ch:[{t:'Leave him.'}]}),
    c4_rallick_again:()=>({sp:'A man on the ridge', txt:
`${S.f.c4_roofsFought ? `He hasn't moved through any of it. Not the knives, not the shouting, not the bodies going off the edge. He's still watching the window three streets north. A Guild man died forty paces from him and he didn't turn his head, and you understand, looking at him, that whatever he's waiting for is worth more to him than the whole of his Guild.` : `He's still watching the window. He doesn't look round. You have the feeling that you've used up your share of him, and that there wasn't much share to begin with.`}`,
      ch:[{t:'Leave him.'}]}),

    /* ---- Crokus, running ---- */
    c4_crokus:()=>({sp:'Someone running', fx:()=>{S.f.c4_crokus=1;}, txt:
`He comes over the chimney-pots at a dead run, and you hear him before you see him: slate going under a heel, a gasp, a scrabble, and then he's on your roof and past you, a thin dark shape with a bag over his shoulder that clinks, running the way only the young run, as if the drop on either side of him were something that happened to other people.

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
`The plank over the last gap to the Daru roofs: oak, tarred at the ends. On the far side, the roofs rise toward the brass lamps, and somewhere up there is a chimney with a cracked pot on it, and Kalam.`,
      ch:[{t:'Across to the Daru roofs.', go:()=>{ startExplore('roofs_daru'); if (!S.f.c4_daruSeen) talk('c4_daru_arrive'); }},
          {t:'Not yet.'}]} : (SQUAD().includes('tuft') && !S.f.c4_drawn && !S.f.c4_noCard) ? {sp:'Tuft', txt:
`At the edge of the roof, where the plank goes over to the Daru side, Tuft stops, and crouches, and takes the Deck out of her sleeve.

She doesn't ask. She's holding it face-down in both hands, and she's looking up at the Moon's Spawn, and her hands are not quite steady.

"Before we cross," she says. "One card. It's close, Sergeant. *Close.* I can feel it on my teeth, like the air before a storm. Kurald Galain. The Spawn's warren. It's coming off that thing like smoke off a pyre and it's in the slates and it's in the dark between the roofs." She swallows. "I want to know what's coming over the next roof before it comes. I'd like the Deck to tell me. I'd like *something* to."`,
      ch:[{t:'Let her draw.', fx:()=>{ S.f.c4_drawn=1; S.card = ['assassin','assassin','knight','knight','oponn','herald'][R(6)]; }, go:()=>cardSequence(()=>talk('c4_card'))},
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
`They come over the chimneys on the far roof: three of them, low, fast, dark coats and soot-blackened blades, running the ridge the way Guild runners run it, bent double, one hand touching the slates every third stride. They see you. They stop.

For a moment nobody moves. You can see what they see: a squad of armed strangers on a Gadrobi roof, the night after a Guild clan-master was found on the temple dome with his throat opened. A shield. A crossbow. A woman with a Deck. Somebody's *helpers*.

The one in front says something in Daric, low and fast, and the other two spread out along the ridge, and all three start across the planks toward you. Not hurrying. Knives down along the forearm, the Daru way. They've decided.

${SQUAD().includes('kettle') && S.inv.cusser > 0 ? `Kettle's hand has gone into her satchel. It comes out with a cusser in it, round and clay-grey, the Moranth seal black on the top. She looks at it. She looks at the roof under her feet. She looks at the house under the roof. And she puts it back.` : ''}`,
      ch:[{t:'"Malazan! Malazan, you idiots! We\'re not who you\'re looking for!"', check:['guile',13], go:'c4_guild_heard', fail:'c4_guild_deaf'},
          {t:'"Kettle. The cusser—"', req:()=>SQUAD().includes('kettle') && S.inv.cusser > 0 && !S.f.c4_kettleNo, fx:()=>{S.f.c4_kettleNo=1;}, go:'c4_kettle_no'},
          {t:'"Brisk. Front."', go:()=>startBattle('guild_roofs',{})},
          {t:'Kettle skims a sharper along the ridge, away from the edge.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('guild_roofs',{pre:true})}]}),
    c4_kettle_no:()=>({sp:'Kettle', txt:
`"No," says Kettle, before you've finished. She has her hand on the satchel flap and she's holding it shut, as if something inside might open it from the other side.

"Not the cusser. Not up here. Not anything big." Very fast, very low, like a sapper counting drops. "It's a *roof*, Sergeant. A cusser takes the roof. The roof's on a house. The house has people in it, asleep, and a gas pipe coming up through the kitchen floor, and the pipe's joined to the one next door, and that one's joined to the street, and the street's joined to the *hole*." She swallows. "Hedge's hole. Fiddler's hole. Our hole. Forty of Hedge's babies sleeping in the mains."

"I throw that up here and I don't take three knives off a roof. I take the Gadrobi District off the map. Us on it." She lets go of the flap. "I'll use the bow. I'll use my teeth. I'm not throwing a cusser on a roof, and I'm telling you why so you don't think I've gone soft."

${SQUAD().includes('brisk') ? `Brisk, without turning her head: "Nobody thinks you've gone soft." Kettle: "*Good.*"` : `Nobody thinks she's gone soft. It's the least soft thing you've ever heard her say.`}

They're halfway across the planks.`,
      ch:[{t:'"Malazan! Malazan, you idiots!"', check:['guile',13], go:'c4_guild_heard', fail:'c4_guild_deaf'},
          {t:'"Brisk. Front."', go:()=>startBattle('guild_roofs',{})},
          {t:'"A sharper, then. Along the ridge. Away from the edge."', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('guild_roofs',{pre:true})}]}),
    c4_guild_heard:()=>({sp:'The plank east', fx:()=>{S.f.c4_fewer=1;}, txt:
`You put your whole chest into it, the parade-ground voice, the one that carries across a battlefield and makes horses stop. It goes out over the roofs and comes back off the chimneys.

"*Malazan! Malazan, you idiots! We're not who you're looking for!*"

The one at the back stops dead on the plank.

You watch him think it through. A Malazan squad. Shouting its own name, on a roof, in the middle of a war the Guild believes Malazans are fighting. It's so stupid it might be true. The silver-haired killers don't shout. They don't make any sound at all.

He says something to the other two, sharp. They don't stop. He doesn't follow them. He goes back over the plank the way he came, and down the far side of the roof, running, and you know exactly where he is running to: to somebody who needs to be told that there's a Malazan squad on the Gadrobi roofs that *shouts*.

The other two keep coming. They've come too far. Or they've buried someone this week, and a Malazan who shouts is still a Malazan.`,
      ch:[{t:'"Brisk. Front."', go:()=>startBattle('guild_roofs_2',{})},
          {t:'Kettle skims a sharper along the ridge.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('guild_roofs_2',{pre:true})}]}),
    c4_guild_deaf:()=>({sp:'The plank east', txt:
`You shout it. It comes out wrong: too loud in a city of whispers, too much like an order and too little like a plea, and in Malazan, which the Guild speaks as well as you do and hears, tonight, as the language of the people killing it.

The one in front laughs. Short and ugly.

"*Malazan*," he says, in your own tongue, with the Daru bend on the vowels. "Yes. We know."

They come faster.`,
      ch:[{t:'"Brisk. Front."', go:()=>startBattle('guild_roofs',{})},
          {t:'Kettle skims a sharper along the ridge.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('guild_roofs',{pre:true})}]}),
    c4_after_guild:()=>({sp:'The Gadrobi roofs', scene:'roof_night', fx:()=>{ S.f.c4_roofsFought=1; gain('guildblade'); }, txt:
`It's short and ugly and very quiet, the way roof fights have to be, because the noise carries and everyone below is listening. Boots on slate, breath, and once, a long sliding rattle as somebody goes down the pitch of a roof and over the gutter, and then nothing, and then, a long way below, a sound like a sack of grain landing in a yard.

${S.f.c4_fewer ? `Two of them. One goes over the edge. The other goes back across the plank with a hand pressed to his side and blood coming through the fingers, and nobody follows him.` : `Three of them. Two go over the edge, one after the other, and one doesn't get up, and lies on the slate with his face turned toward the Moon's Spawn and his eyes open.`}

One of them has left his blade on the roof, where it skidded out of his hand. Short, straight, blackened with lamp-soot, the edge bright. No guard. ${SQUAD().includes('ellis') ? `Ellis picks it up by the blade and hands it to you hilt first. "Guild journeyman's knife. Made to be carried up a drainpipe in the teeth." A pause. "They're not bad, Sergeant. They're frightened. That's worse. Frightened knives don't stop."` : `Brisk picks it up and hands it to you hilt first. "Soot on the blade so it doesn't shine," she says. "They thought of that. Didn't think of us."`}

${SQUAD().includes('ohl') ? `Ohl is kneeling at the edge of the roof, looking down into the blue. He can't see the bottom. None of you can. "I'd like to go down to ${S.f.c4_fewer ? 'him' : 'them'}," he says. "I know I can't." He doesn't take the oilcloth out. He just kneels there for a moment longer, and then gets up, and his knees crack like the slates.` : ''}

${SQUAD().includes('kettle') && S.f.c4_cusserHeld && S.inv.cusser > 0 ? `Kettle has her hand flat on the satchel flap again. She hasn't let go of it since the knives came. "Still here," she says, to nobody. "Still here."` : ''}`,
      ch:[{t:'Across to the Daru roofs.', go:()=>{ startExplore('roofs_daru'); talk('c4_daru_arrive'); }},
          {t:'Not yet.', go:()=>startExplore()}]}),

    /* ---- the Daru roofs ---- */
    c4_daru_arrive:()=>({sp:'The Daru roofs', scene:'roof_night', fx:()=>{S.f.c4_daruSeen=1;}, txt:
`The Daru roofs are higher and steeper and better kept, and the gutters are lead where the Gadrobi gutters are clay, and the chimney-pots have little brass hats on them against the rain. The lamps below are in brass cages. The blue coming up between the houses is paler here, bluer, as if even the haze had money.

The next roof east is flat, with a low parapet round it and a chimney with a cracked pot on it. Beyond that, one more roof, a little higher than the rest, flat, leaded, with nothing on it at all.

Nothing but Kalam.

He's standing in the middle of it, where anyone on any roof in the district can see him. His hood is down. His hands are empty and a little away from his sides. He's not looking at anything. He's letting himself be looked at, which is, you realise, the hardest thing you have ever seen Kalam do.

Above you, the Moon's Spawn. It's right overhead here. It's not, it's over the lake, it's half a mile off; but on a Daru roof at night, with the lamps below and nothing above but that black shape against a black sky, there is no other way to feel it.`,
      ch:[{t:'Watch.', go:()=>startExplore()}]}),

    /* ---- the meet: one sequence, Kalam's signal to Vell over the parapet ---- */
    c4_meet:()=>({sp:'Kalam\'s roof', scene:'roof_night', fx:()=>{ S.f.c4_meet=1;
        // the squad goes back to the cracked pot on the middle roof, so the map afterwards matches the scene
        S.pos = {x:8, y:7}; S.trail = [[9,7],[7,7],[9,6],[8,6],[7,6],[8,8]].map(([x,y]) => ({x, y})); }, txt:
`You get as far as his roof. Kalam doesn't turn his head. One hand moves at his side, two fingers, flat, a gesture you'd miss if you weren't waiting for it: *back*.

So you go back, over the plank, behind the cracked pot, where he told you. ${SQUAD().includes('brisk') ? `Brisk puts her shield flat on the leads in front of her, so it won't catch the light, and lies behind it, and becomes a part of the roof.` : ''} ${SQUAD().includes('ellis') ? `Ellis goes to the north corner of the parapet without being told, where she can see the whole of Kalam's roof and the two roofs past it. She strings the bow lying down.` : ''}

You settle, and you watch, and it begins.

Kalam takes a stub of candle out of his coat, and lights it, and sets it on the parapet of his roof. Then he takes out a second, and lights it from the first, and sets it a hand's width to the left. Then he stands back from them with his hands empty.

Two small yellow lights on a Daru roof. Nothing more. In a city of blue fire, the most visible thing on any roof in Darujhistan.

For a long time, nothing.

The candles burn down a finger's width. The blue haze shifts below. Somewhere a dog barks, three streets away, and stops, as if someone had put a hand on it. ${SQUAD().includes('kettle') ? `Kettle, beside you, has stopped counting under her breath. You didn't know she was doing it until she stopped.` : `Ohl, beside you, has stopped breathing through his mouth. You didn't know he was doing it until he stopped.`}

Then the roofs around Kalam begin, very quietly, to fill.`,
      ch:[{t:'Watch.', go:'c4_meet_guild'}]}),
    c4_meet_guild:()=>({sp:'Kalam\'s roof', scene:'roof_night', txt:
`They come the way water comes into a footprint: from underneath, from the sides, from nowhere. A shape on the ridge north of him that was a chimney-pot a moment ago. Two on the roof behind him, rising up out of the gutter. One, then three, then six, on the roofs south and east. They don't come close. They settle on the roofs *around* his, crouched on the ridges like crows on a fence, dark coats, hoods, knives you can't see and know are there.

Nine. Ten. You stop counting at twelve.

None on your roof. Kalam was right about the skylight.

One of them stands, on the roof north of Kalam's. A lean figure. Older, by the way it holds itself. It says something, low, in Daric, that you're too far off to catch. Kalam answers, in Daric, and holds up both hands, empty, and turns them over, slowly, so that the candlelight goes over the palms and the backs.

${S.f.c4_fewer ? `The one on the north roof says something else, and you catch one word of it, because it's a word you shouted two roofs ago: *Malazan*. And then, after it, a word you don't know, said with a kind of weary disgust.${SQUAD().includes('ellis') ? ' Ellis would know it.' : ''} Kettle, next to you, guesses: "*Idiots*," she breathes. "He's telling Kalam about us."` : `The one on the north roof says something else, and gestures, sharp, back the way you came, toward the Gadrobi roofs. Toward the dead on the Gadrobi roofs. Kalam doesn't turn his head to follow the gesture. He keeps his hands up.`}

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
`You hold. You don't know how. There are pieces of it, and the pieces don't fit. Brisk's shield ringing like a struck bell and the rim of it bent. Kettle's quarrel going into a tall shape's shoulder and the shape not noticing. The dark sword coming round in a flat arc that should have taken three heads and somehow took none. Cold. The cold of it, in your teeth and the roots of your hair.

And then the second one. Coming over the far parapet, as the first one steps back to look at you again. It doesn't hurry. It walks toward you along the leads with its sword down, and the first one turns its head, very slightly, and waits for it.

Two of them. You think: *well, that's the end, then*.

And from behind you, from the ridge of the next roof, very small, very dry, you hear it: tick-tick-tick. Wood on wood. A knuckle on a table. A laugh made of kindling.

The air on the roof *bends*.

You see Kalam. You see him on the roof to the south, running, with his hood down and a Guild blade in each hand, and he's calling something, and he's wounded, and he's there and he isn't there, because Kalam went east. You see him anyway. So do they.

The second one stops.

It doesn't go after the thing on the south roof. It stands quite still in the middle of the leads, with its sword down, and it looks at the running shape that is Kalam and is not Kalam; and then it looks, for a long moment, at the ridge behind you, where the laughing came from. It *hesitates*. You'd swear to it in front of Dujek. For the space of a breath, as if it had heard a voice it knew and could not place.

Then both of them go *elsewhere*.

Not off the roof. Not over the edge. They are there, and then there's a cold wind across the leads, and they aren't. The shape on the south roof isn't there either. It never was.

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

${SQUAD().includes('kettle') ? `Kettle is sitting on the leads with her back to the chimney and her crossbow across her knees, reloading it, very slowly. "It had a *shoulder*," she says, to the crossbow. "I put a quarrel in its shoulder. It didn't even look." She shrugs. "Guild boy's alive. Good. I'd like to go home now."` : ''}`,
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

"Kalam's alive," he says, before you ask. "Furious. Cut in three places he'll deny. He's going home by a road I wouldn't take and I'm not going to be on it with him, because he'll want to talk about it, and I've heard it." He smiles at the dark. "The Guild won't be buying tonight. The Guild won't be buying anything for a while. Somebody's closed the shop."

${S.f.c4_key === 'shield' ? `He looks at you then. He doesn't often do that, properly, and he does it now, for long enough that you want to look away.

"You stood in front of a Tiste Andii," he says. "For a Guild rope-boy you'd never met. On a roof. With a *shield*. It's the stupidest thing I've seen a marine do, Sergeant, and I've served with Hedge. You're alive because I was on the next roof being clever. Don't make me do it again. It has a price, and I'm not the one who pays it."

The sack, in his lap, is quite still.

"The second one stopped," he says, more quietly, almost to himself. "I didn't expect it to stop."` : `He doesn't look at you. He looks at the place on the leads where the boy fell, and then${SQUAD().includes('tuft') ? ` at Tuft, in the grey cloak, for rather longer, and then` : ''} back at the east.

"Stepped aside," he says. It isn't a question. "That was the smart thing. That's what I'd have done. That's what Whiskeyjack told you to do." A pause. "It *nodded* at you. I saw it from the ridge. They don't nod, Sergeant. I've watched them for a month and I have never seen one of them acknowledge that a human being was on the same roof."

"Somebody on that mountain has your face now. I'd think about that. I'd think about it for a long time."`}

He gets up, and tucks the sack under his arm, and goes over the edge of the roof, and down, and doesn't use the plank.`,
      ch:[{t:'Leave him.'}]}),
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
      ch:[{t:'Down.', go:'c4_descend'},
          {t:'Not yet.'}]} : S.f.c4_meet ? {sp:'The plank west', txt:
`Back toward the Gadrobi roofs. Kalam's roof is quiet now, and you have not finished what you came up here for.`,
      ch:[{t:'Not yet.'}]} : {sp:'The plank west', txt:
`Back across the plank to the Gadrobi roofs. Kalam is still standing on his roof in the east, with his hands empty, waiting to be answered.`,
      ch:[{t:'Back to the Gadrobi roofs.', go:()=>{ startExplore('roofs_gadrobi'); // come back by the east plank, not up the hatch
            S.pos = {x:14, y:6}; S.trail = [[13,6],[14,5],[14,7],[13,5],[13,7],[12,6]].map(([x,y]) => ({x, y})); save(); }},
          {t:'Not yet.'}]},

    /* ---- the descent ---- */
    c4_descend:()=>({sp:'Down', scene:'city_street', txt:
`Down the chandler's chimney-stair in the dark, one at a time, with a hand on the wall, because the stair was built for sweeps and sweeps are small. Out through the loft. Down a ladder into a yard that smells of tallow. Through a gate that isn't locked, into a lane that isn't lit.

The ground is very solid after the roofs.

The lane goes down toward the Gadrobi District between blind walls. The blue from the street at the far end is a long way off. Above, between the eaves, a strip of sky with no stars in it, and somewhere up there, on the roofs, the dead are being turned over by the living, and the living are counting.

${S.f.c4_key === 'shield' ? `Vell is walking. Mostly. ${SQUAD().includes('brisk') ? `He has one arm over Brisk's shoulders and she's taking most of his weight without seeming to notice she's doing it, the way she takes the weight of a shield.` : `He has one arm over your shoulders, and he's lighter than he should be, and he keeps apologising for it.`} He keeps looking back up at the roofs. "They'll be waiting at the bottom," he says. "My people. They'll want to know where I've been. I'll tell them." A pause. "I'll tell them everything."` : `Nobody talks. ${SQUAD().includes('ellis') ? `Ellis is walking last, where a scout walks, and twice you see her stop and look back up the lane, and listen, and come on.` : `Kettle is walking last, with the crossbow cocked, and twice you hear her stop and listen and come on.`}

Halfway down, the lane narrows between two warehouse walls, and there's no blue at all.`}`,
      ch:[{t:'On.', req:()=>S.f.c4_key === 'shield', go:'c4_vell_thanks'},
          {t:'On.', req:()=>S.f.c4_key !== 'shield', go:'c4_reprisal'}]}),
    c4_reprisal:()=>({sp:'The alley under the roofs', scene:'city_street', txt:
`They're waiting in the narrow part, where the warehouse walls lean together overhead and the lane is two shoulders wide. You don't see them. You smell them: lamp-soot and tar and the sour sweat of people who have been crouching in the dark for a long time, very still, getting angrier.

Three. Two in front, low, with the soot-black blades. And one behind them, standing, not crouching: an older man, grey at the temples, with a Guild blade held loose along his leg. ${S.f.c4_guildmen ? `You've seen him before. On Kalam's roof, kneeling among the dead, looking at your feet, and at the space where you stood aside.` : `You've seen him before, or the shape of him: one of the two who came back to Kalam's roof for the dead while you were still on yours.`}

He doesn't say anything for a long moment. When he does, it's in Malazan, careful, with the Daru bend on the vowels.

"Ocelot sends his regards." Flat. "We watched you on the Daru roof. We watched you step." He lifts the blade a little. "A Malazan squad, on a Guild roof, stood aside while one of ours was opened in front of it. Vell. He carried rope. He was seventeen." A breath. "The clan-master says that's an answer, Sergeant. He's not sure to what question. He's sent us to ask it again."

${SQUAD().includes('brisk') ? `Brisk has her shield up. She doesn't look at you. She hasn't looked at you since the roof. "I'd have stood," she says, to the old man, not to you, and it's the only thing she says.` : ''}`,
      ch:[{t:'"Close up."', go:()=>startBattle('reprisal',{})},
          {t:'Kettle rolls a sharper down the lane.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('reprisal',{pre:true})}]}),
    c4_after_reprisal:()=>({sp:'The alley under the roofs', scene:'city_street', fx:()=>{S.f.c4_reprisalFought=1;}, txt:
`It's close work in a lane that narrow, and there's no room to be clever, and nobody is. Shield and knife and elbow and wall. When it's over, one of the young ones is on his back in the gutter with his eyes open and the other has gone, back up the lane, running, and the old man is sitting against the warehouse wall with a hand pressed to his ribs, breathing in short pulls, looking at you.

He doesn't reach for the blade. It's on the cobbles by his foot. He could.

"There," he says. "Now it's asked." He coughs, and doesn't like what comes up, and wipes his mouth on his sleeve. "Go home, Malazan. Tell your one-armed— tell whoever it is you tell. The Guild's not buying. Not from you. Not from anyone who stands where you stood."

${SQUAD().includes('ohl') ? `Ohl takes a step toward him. The old man looks at him, and at the Denul light coming up faint under Ohl's palms, and laughs, which costs him. "No," he says. "Not from you either, grandfather. Go on."

Ohl stops. He stands there for a moment with his hands lit, and then he lets the light go out, and turns, and walks on down the lane, and doesn't say anything, and doesn't take out the oilcloth.` : `Nobody goes to him. He doesn't want anyone to.`}

${SQUAD().includes('ellis') ? `Ellis, as you pass him, very low: "He let you win that. He'll say he didn't. He'll believe it." She doesn't look back. "They wanted to hurt us. They didn't want to kill us. That's a message too."` : ''}

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

"I'll remember," he says, and he will. That's the thing about debts in this city, Kalam told you once. The Guild keeps them longer than anyone.`,
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

You give it to him the way he asked: in order, without anything in it that isn't so. The ladder. The roofs.${S.f.c4_sawSorry ? ` The skylight, and a fat man asleep at a table, and a girl in a grey shawl in the doorway who looked up through the glass at you.` : ''}${S.f.c4_crokus ? ` A boy${S.f.c3_inn ? ' from the Phoenix' : ''}, running, with a bag, and a tall shape behind him, and nobody shooting.` : ''}${S.f.c4_rallick ? ` A man on a ridge watching a window, who told you to go home.` : ''} The Guild on the planks${S.f.c4_fewer ? `, and shouting *Malazan* at them, and one of them believing it` : ''}. Kalam's candles. The Guild coming out of the roofs. The tall shapes. How fast. How quiet. Kalam running.

Then the boy, and what you did.

${S.f.c4_sawSorry ? `At *a girl in a grey shawl*, his eyes move, once, to the chandler's shutters down below, where there's nobody standing now. He doesn't say anything. He files it somewhere deep.` : ''}

He listens to all of it with his face doing nothing. He doesn't interrupt. When you get to the boy, he doesn't move at all.

When you've finished, he lets the silence go on until a lamp at the corner of the crossing hisses, and gutters, and goes out.

"I know," he says.

It's not a reproach. He's telling you a fact. He knew before you came up the ladder. He knew, you think, before you went up it.`,
      ch:[{t:'"Kalam, sir?"', go:'c4_dawn_kalam'}]}),
    c4_dawn_kalam:()=>({sp:'Kalam', scene:'roof', txt:
`Kalam is sitting against the chimney at the far end of the roof. You didn't see him when you came up. He has a bandage round his forearm and another under his shirt that he's pretending isn't there, and his knives are laid out on the tiles in front of him, all of them, in a row, and he's cleaning them, one by one, very slowly.

He's alive. That's the first thing.

He's furious. That's the second, and it's worse. Not loud. Kalam doesn't get loud. It's in the way he wipes each blade and lays it down exactly parallel to the last, and in the way he doesn't look up, and in the way the air round him feels like the air round a banked forge.

${S.f.c4_kalamLook ? `He does look up, once, when you come near. At you. The same beat too long as in the vault. Then back down to the knives.` : ''}

"Rake's people," he says.

Nothing else. Not to you. Not to anyone. He picks up the next knife and starts to clean it.`,
      ch:[{t:'Whiskeyjack.', go:'c4_dawn_wj'}]}),
    c4_dawn_wj:()=>({sp:'Whiskeyjack', scene:'roof', txt:
`Whiskeyjack has turned back to the lake. The Moon's Spawn hangs over it, black against the grey, and the light is coming up behind it and not touching it.

"The Guild won't deal," he says. "Not with us. Not tonight, not this month. Kalam went up to buy them and found somebody'd already bought the roof out from under him, with the Guild still on it." He doesn't sound angry. He sounds like a man reading a distance. "That's that, then. We do this the other way."

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

"Hedge'd say I've gone soft." She thinks about it. "Fiddler'd say I've gone sapper. I'd rather Fiddler." She shuts her eyes again.` : ` She opens her eyes and looks at the city, going grey in the dawn, all those roofs, all those houses under them. Then she shuts them again.`} "Sergeant. That thing on the roof. The tall one. I put a quarrel in it and it didn't look round." A long breath. "That's the first thing in six years I couldn't make stop being a thing. I don't like it. I want you to know I don't like it."`,
      ch:[{t:'Back to the row.', go:'c4_close'}]}),
    c4_close_ellis:()=>({sp:'Ellis', scene:'roof', txt:
`She's at the parapet, sitting with her legs over the drop, where she can see the whole of the Gadrobi roofs going grey. She doesn't turn round.

${S.f.c4_ellisRoofs ? `"Four of us came down, last time," she says. "Two years ago. I told you."` : `"I've been on these roofs before," she says. "Two years ago, for the Claw. Six of us went up. Four came down."`} She points, with the gloved hand, at a roof three streets north, a steep one with a lead gutter. "Corporal Hesk. That one. The pine plank. I told the Claw it was bait. I told them the day before." She lowers the hand. "They sent him across it anyway. To see if I was right."

"I was right." A breath. "I've always wondered whether they knew I would be, and sent him to find out whether I'd say so twice."

${S.f.c4_key === 'shield' ? `She's quiet for a long time. "You didn't ask anyone whether you were right, tonight," she says at last. "You just stood there. I've never worked for anyone who did that." Another silence. "I'm still not used to it. Don't stop."` : `She's quiet for a long time. "You stepped aside because you were told to watch," she says at last. "The Claw would have written that up as good work. It *was* good work." She pulls her knees up. "I'd just hoped this squad wrote things up differently."`}`,
      ch:[{t:'Back to the row.', go:'c4_close'}]}),
    c4_close_end:()=>({sp:'The chandler\'s roof', scene:'roof', txt:
`The last lamp on the lakefront goes out.

In the grey that's left, you look for them, the way you looked for them from this roof two dawns ago, the crouched shapes along the ridges, facing all the same way like crows in a field. They aren't there. The roofs of Darujhistan are empty, from the Gadrobi temples to the palaces on the hill, empty and wet and ordinary, with smoke starting to go up from the chimneys where somebody has lit a kitchen fire.

The Guild is not on the roofs this morning. The Guild is under them, counting.

${S.f.c4_key === 'shield' ? `And across the lake, the Moon's Spawn, black, with the dawn going round it the way water goes round a stone. You look at it for a long time. Somewhere on it, you think, something is also looking at a roof. It hesitated. You'd swear to it in front of Dujek. You're beginning to understand you'll never be asked to.` : `And across the lake, the Moon's Spawn, black, with the dawn going round it the way water goes round a stone. You look at it for a long time. You have the feeling, clear as cold water, that it's looking back, and that it knows exactly which roof to look at.`}

${SQUAD().includes('tuft') ? `At the end of the row, in the grey cloak, Tuft is looking at it too.` : ''}

Below, Whiskeyjack has gone back down to his bucket. Kalam has gone somewhere. Quick Ben is sitting on the chandler's step with the sack in his lap, whistling, and the city starts, around all of you, to shout about fish.`,
      ch:[{t:'Sleep. Or pretend.', fx:()=>{S.f.c4_done=1;}, go:()=>chapterEnd(4, S.f.c4_key || 'aside')}]}),
  }
};
