/* ============ chapter 3: Blue Fire ============ */
const CH3 = {
  title:'Blue Fire', number:'Three',
  intro:{loc:'Darujhistan', sub:'The Gadrobi District · dusk', cap:'Blue lamps coming on one at a time along the walls, and above the lake a mountain that nobody looks at.',
    paras:[
() => `The road comes down out of the Gadrobi Hills in switchbacks, the way a drunk comes down a stair, and the wagon comes down it the same way, with Brisk at the brake and ${S.f.c2_wagon ? 'Pell the mule' : 'the mule'} expressing an opinion at every turn. There are goats on the slopes and goatherds who do not look up at Malazans, and a shrine to a god whose face somebody has chiselled off with care. Kettle has stopped counting munitions. She is counting chimneys.`,
`Then the hills open, and there is the lake, flat and grey as a slate, and on the near shore a city so large that the eye refuses it and goes looking for its edges, and does not find them. Walls inside walls. Domes, towers, a hill with palaces on it like teeth. Smoke from ten thousand kitchens. You are Sergeant {sgt}, Fourth Squad, and you have seen Pale and Genabaris and Nathilog, and you have never seen anything that made you feel so precisely the size of one wagon.`,
`Dusk comes on, and the city lights itself. Not with fire. Blue, cold, street by street, as if something beneath it were breathing out. And over the water, not far, not high, a mountain of black stone hangs in the air with nothing under it, where it has hung since Pale. It does not move. It casts no light. Down in the streets, nobody looks up at it any more, and that, Ohl says, is how you know it is a very old city.`],
    go:'Into the city', node:'c3_start'},

  areas:[
    /* 16 columns x 12 rows.  . cobbles  , wet cobbles  # wall  L gas lamp  W wagon  B crates  x stake barrier  < exit west (the Worry Gate proper: the road runs along the wall from the hills) */
    { id:'worry_gate', title:'Darujhistan · the Worry Gate', sub:'Dusk', hint:'Tap ground to move · tap a figure to talk · the gate is west', decor:'city_dusk',
      map:[ "################",
            "#...L....,....L#",
            "#........,.....#",
            "##..###..BB..###",
            "#.......,......#",
            "#.L............#",
            "<.....,........#",
            "#......,.....W.#",
            "#..B..xx...L..##",
            "#.....,,.......#",
            "#.L.....,.....L#",
            "################" ],
      walk:'.,DH><', triggers:{W:'c3_wagon', '<':'c3_to_cross'}, start:{x:12,y:5},
      npcs:[ {id:'pallick', name:'Pallick', kind:'guard', x:2, y:7, node:()=>S.f.c3_gate?'c3_pallick_again':'c3_pallick', fresh:()=>!S.f.c3_gate} ] },

    /* . cobbles  , gutter  # wall  H the dig  x stakes  W the crew's wagon  F brazier  B barrels  L lamp  > the alley up into Daru (the Phoenix at the top of it) */
    { id:'gadrobi_cross', title:'Darujhistan · the Gadrobi crossroads', sub:'Night', hint:'Tap ground to move · tap a figure to talk · the hole is in the middle', decor:'city_night',
      map:[ "################",
            "###########....#",
            "#L.........#..L#",
            "#..........#...#",
            "#...xxx.xxx....#",
            "#...x.....x....#",
            "#...x..H..x....>",
            "#...xxx.xxx....#",
            "#..............#",
            "#.W.....F....B.#",
            "#L,,.........,L#",
            "################" ],
      walk:'.,DH><', triggers:{H:'c3_dig_tile', '>':'c3_to_daru', W:'c3_crew_wagon'}, start:{x:2,y:7},
      npcs:[ {id:'wj', name:'Whiskeyjack', kind:'wj', x:8, y:3, node:()=>S.f.c3_reported?'c3_wj_again':'c3_wj', fresh:()=>!S.f.c3_reported},
             {id:'fiddler', name:'Fiddler', kind:'fiddler', x:6, y:6, node:()=>'c3_fiddler', fresh:()=>!!S.f.c3_reported && !S.f.c3_fid},
             {id:'hedge', name:'Hedge', kind:'hedge', x:8, y:5, node:()=>'c3_hedge'},
             {id:'mallet', name:'Mallet', kind:'mallet', x:10, y:9, node:()=>'c3_mallet'},
             {id:'trotts', name:'Trotts', kind:'trotts', x:3, y:6, node:()=>'c3_trotts', still:true},
             {id:'sorry', name:'Sorry', kind:'sorry', x:13, y:5, node:()=>'c3_sorry', still:true},
             {id:'kruppe', name:'A fat man in a red waistcoat', kind:'kruppe', x:11, y:8, node:()=>S.f.c3_kruppeMet?'c3_kruppe_again':'c3_kruppe', show:()=>!!S.f.c3_reported && !S.f.c3_inn && !S.f.c3_kruppeMet, fresh:()=>!S.f.c3_kruppeMet},
             {id:'urchin', name:'A Gadrobi child', kind:'urchin', x:4, y:9, node:()=>'c3_urchin', show:()=>!!S.f.c3_workDone && !SQUAD().includes('ellis') && !S.f.c3_msg, fresh:()=>true},
             {id:'qb', name:'Quick Ben', kind:'qb', x:12, y:3, node:()=>'c3_qb', show:()=>!!S.f.c3_night2, fresh:()=>!S.f.c3_qb},
             {id:'kalam', name:'Kalam', kind:'kalam', x:13, y:3, node:()=>'c3_kalam', show:()=>!!S.f.c3_night2, fresh:()=>!S.f.c3_kal} ] },

    /* . cobbles  , gutter  # wall  L lamp  D the Phoenix Inn's door  B barrels  < the alley back down to the crossing */
    { id:'daru_lane', title:'Darujhistan · the Daru District', sub:'Night · the top of the alley', hint:'Tap ground to move · the Phoenix is the door with the painted bird', decor:'city_night',
      map:[ "################",
            "###L###D###L####",
            "#..............#",
            "#.,,........,,.#",
            "#.........B....#",
            "<..............#",
            "#.......,......#",
            "#L............L#",
            "#####......#####",
            "#####..,...#####",
            "#####L....L#####",
            "################" ],
      walk:'.,D<', triggers:{D:'c3_inn_door', '<':'c3_lane_back'}, start:{x:1,y:5},
      npcs:[ {id:'irilta', name:'A big woman in an apron', kind:'irilta', x:8, y:2, still:true, node:()=>'c3_lane_irilta', fresh:()=>!S.f.c3_laneIrilta},
             {id:'laneboy', name:'A boy on a barrel', kind:'cutpurse', x:11, y:4, node:()=>'c3_lane_boy', show:()=>!S.f.c3_laneBoy, fresh:()=>true} ] },

    /* . cobbles  , gutter  # wall  L lamp  D the dye-shop door  < alley back west */
    { id:'daru_street', title:'Darujhistan · the Daru District', sub:'Night · the second night', hint:'Tap ground to move · tap a figure to talk · the dye-shop is north', decor:'city_night',
      map:[ "################",
            "##L####D####L###",
            "#..............#",
            "#.,,....L.....,#",
            "#..###....###..#",
            "<..###....###..#",
            "#..............#",
            "#..,....,......#",
            "#L.###....###.L#",
            "#..###....###..#",
            "#..,,......,,..#",
            "################" ],
      walk:'.,DH><', triggers:{D:'c3_dye_door', '<':'c3_back_west'}, start:{x:2,y:6},
      npcs:[ {id:'guard1', name:'City Watch', kind:'guard', x:7, y:6, node:()=>S.f.c3_guards?'c3_guard_again':'c3_guard', fresh:()=>!S.f.c3_guards},
             {id:'guard2', name:'City Watch', kind:'guard', x:8, y:6, node:()=>S.f.c3_guards?'c3_guard_again':'c3_guard'} ] } ],

  battles:{
    cutpurses:{title:'The alley by the Worry Gate', warrenText:'City stone · the blue lamps hiss · warrens steady', warren:{meanas:1,denul:1}, music:'battle', style:'city',
      map:["#..##..#","........","..#..#..","........","#......#","........","..#..#..","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['cutpurse',1,1],['cutpurse',6,1],['cutpurse',4,3],['bruiser',3,1],['bruiser',5,0]], xp:160, after:'c3_after_cutpurses',
      waves:[{round:2, foes:[['cutpurse',1,0],['cutpurse',6,0]], text:'Two more drop off the wall at the far end of the lane.'}] },
    knives:{title:'The alley behind the dye-shop', warrenText:'No lamps back here · Meanas leans into the dark · Denul holds', warren:{meanas:1.3,denul:1}, dark:true, music:'dark', style:'city',
      map:["##....##","........",".#....#.","........","...##...","........","#......#","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['knife',1,1],['knife',6,1],['knife',2,3],['knife',5,3],['clawknife',3,0]], xp:200, after:'c3_after_knives',
      waves:[{round:2, foes:[['knife',2,0],['knife',5,0]], text:'Two more come over the wall behind the racks.'}] } },

  foes:{ cutpurse:{name:'Daru cutpurse', sig:'c', hp:11, ac:12, atk:4, dmg:[1,6,1], rng:1, mv:5, init:3, verb:'stabs at'},
         bruiser:{name:'Gadrobi bruiser', sig:'G', hp:22, ac:13, atk:5, dmg:[1,10,2], rng:1, mv:4, init:1, verb:'swings a cudgel at'},
         knife:{name:'Hired knife', sig:'k', hp:13, ac:14, atk:5, dmg:[1,6,2], rng:1, mv:6, init:4, verb:'cuts at'},
         clawknife:{name:'Claw', sig:'C', hp:26, ac:15, atk:6, dmg:[1,8,3], rng:1, mv:6, init:5, boss:true, verb:'opens'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    daruknife:{name:'Daru duelling knife', slot:'weapon', who:['sgt','ellis'], atk:1, line:'Long, thin, with a basket of brass wire round the grip. Far too good for the man who was carrying it. He had not stolen it recently; he had stolen it well.'},
    roadleather:{name:'Gadrobi road-crew leather', slot:'armour', who:null, ac:1, line:'A crew jerkin of oiled leather with the Guild of Paviors\' mark burned into the back. It smells of gas and wet stone. It fits nobody and everybody, which is the point.'},
    lampchip:{name:'Blue-glass lamp-chip', slot:'trinket', who:null, stat:{might:1,wits:1,guile:1}, line:'A thumbnail of blue glass from a broken street lamp, drilled and hung on a cord. Daru knives wear them for luck. This one\'s luck ran out, which some would say makes it due.'},
    collsignet:{name:'Coll\'s old signet', slot:'trinket', who:null, stat:{guile:1}, line:'A heavy gold ring with the device ground off, so that only the shape of a house is left and not its name. It was worth a council seat once. It bought a round.'} },

  card:{ id:'magi', name:'Magi of High House Shadow', house:'High House Shadow', hue:'#9a86e0',
    txt:`A thin figure in grey at a table, doing something with its hands that the painter would not show. Behind it, a door, half open, and nothing in the door. Tuft looks at it for a long time. "That's a working card," she says. "Not a warning. A tool." Then, more quietly: "It's for me."`,
    fx:'Tuft\'s warren spells cost 1 less strain this chapter.' },

  dlg:{
    /* ---- opening: the Worry Gate ---- */
    c3_start:()=>({sp:'The Worry Gate', scene:'city_street', fx:()=>{S.f.c3_started=1;}, txt:
`The caravan road runs the last half-mile under the city's outer wall, which is higher than the Pale's was before the Pale fell into itself, and older, and has been patched so many times in so many colours of stone that it looks less like a wall than a quarrel. The gate ahead is called the Worry Gate, and nobody on the road can tell you why, and all of them smile when you ask.

The lamps along the wall are coming on one at a time. Not lit. *Coming on*, a little tongue of blue in each glass, with a hiss you feel in your teeth.

${S.f.c2_late ? `Brisk has not said *a day late* since the hills. She has said it with the brake, and with the way she's set the wagon's pace, and with the back of her neck.` : `Brisk, at the brake: "Eleven days. On the nose." She says it to the mule. The mule does not care. Brisk does, enormously, and would die before you saw it.`}

Tuft is looking up. She is the only person on the road who is. Out over the lake, black against the last of the light, the mountain hangs as if it had always hung there, and she looks at it the way you'd look at a man across a room who once hit you.`,
      ch:[{t:'Walk the wagon up to the gate.', go:()=>startExplore()},
          {t:'"Kettle. Count."', go:'c3_start_kettle'},
          {t: S.f.c2_hillsEllis ? '"Ellis. You\'ve been here. What am I looking at?"' : '"Ellis. What am I looking at?"', req:()=>SQUAD().includes('ellis'), go:'c3_start_ellis'}]}),
    c3_start_kettle:()=>({sp:'Kettle', txt:
`"${numw(S.inv.sharper, true)} sharper${S.inv.sharper === 1 ? '' : 's'}, ${numw(S.inv.burner)} burner${S.inv.burner === 1 ? '' : 's'}, ${numw(S.inv.cusser)} cusser${S.inv.cusser === 1 ? '' : 's'}." ${S.f.decoy && !S.f.c1_claw ? `She doesn't have a ledger to look at any more; the Claw has it.` : `She doesn't look at the ledger.`} "And a crate. Bridgeburner property. Sealed. ${tripDays(1)} days on a wagon, Sergeant, over a plain and round a barrow and past a mage burning to death, and I have not opened it, and when we find Whiskeyjack I want you to tell him so in front of me, so I can watch his face."

She sniffs. Frowns. Sniffs again.

"Gas. Under the road. You can smell it through the cobbles." She looks at the city with a new and terrible tenderness. "The whole place is sitting on it. The *whole* place, Sergeant."

Ohl, from the driver's board: "Do not."

"I didn't say anything."

"You were going to be pleased about it."`,
      ch:[{t:'Walk the wagon up to the gate.', go:()=>startExplore()}]}),
    c3_start_ellis:()=>({sp:'Ellis', fx:()=>{S.f.c3_ellisGate=1;}, txt:
`"Blue gas, bad wine, and nine hundred ways to be robbed. Three of them legal." She's walking at the wagon's off side, where the wall's shadow is, which is where she walks in any town. "That's the Gadrobi District on your left. Tanners, masons, the poor. Right, over the wall, is Daru, which is where the Gadrobi go to work and are not let stay after dark."

She points, without meaning to, the way you'd point at a scar on your own hand. A street going up between two tall houses, narrow, a line of blue lamps up it like buttons.

"That one goes up to a dye-shop. Indigo and madder, and a courtyard where they dry the cloth, and a room over it with a good lock." Her hand comes down. "${S.f.c2_hillsEllis ? `The green door's the house, Sergeant.` : `There's a green door in this city, Sergeant. The Claw calls it the house.`} That street's where the house sends you when it doesn't want you at the house."

Then she stops, and you watch her hear herself and wish she hadn't.

"Forget I pointed. I'd like that in the ledger too."`,
      ch:[{t:'"Forgotten."', fx:()=>{loy('ellis',1);}, go:()=>startExplore()},
          {t:'"No. I want to know where it is."', go:()=>startExplore()}]}),

    /* ---- Pallick, gate-clerk ---- */
    c3_pallick:()=>({sp:'Pallick · gate-clerk', txt:
`He has a stool, a desk the width of a book, a lamp, a ledger, and the expression of a man who has been standing between the city and the rest of the world for thirty years and has found the rest of the world wanting. Ink to the second knuckle.

"Name, trade, place of origin, number of wheels, number of legs, the legs including the mule's." He doesn't look up. "Gate toll is five silver for a laden wagon, and it's laden, I can see the axle from here. The name is for the ledger. The ledger is for the Council. The Council," he dips his pen, "does not read it. I am aware. I keep it anyway."

He looks up. He takes in Brisk's hauberk, Kettle's soot, the shape of the thing under the oilcloth.

"Road crew," he says. "Of course you are. The whole Gadrobi District has become road crew this month. I've never seen a city so devoted to its intersections. Name."`,
      ch:[{t:'Give him a name. Not yours.', check:['guile',12], go:'c3_pallick_lie', fail:'c3_pallick_caught'},
          {t:'Pay the toll. Five silver, and no name.', tag:'5 silver', req:()=>S.silver>=5, fx:()=>{S.silver-=5; S.f.c3_paid=1; AUDIO.play('coin');}, go:'c3_pallick_paid'},
          {t:'Let Brisk talk to him.', req:()=>SQUAD().includes('brisk'), go:'c3_pallick_brisk'},
          {t:'Give him your own name.', fx:()=>{S.f.c3_trueName=1;}, go:'c3_pallick_true'}]}),
    c3_pallick_lie:()=>({sp:'Pallick', fx:()=>{S.f.c3_gate=1; S.f.c3_falseName=1;}, txt:
`You give him a name you had off a headstone in Unta, and a trade, and a village in the Gadrobi Hills that you passed through and that has, as far as you could tell, one goat.

He writes it all down in a small square hand. He does not look up while he writes, and does not look up when he has finished, and says, to the ledger:

"Welcome to Darujhistan. Mind the lamps; they're hot. Mind the Gadrobi; they're poor. Mind the Daru; they're not." He blots. "The toll is waived for guild road crews. It's in the charter. Nobody has ever read the charter but me."

Kettle, as you go past: "He knew."

"He knew," Brisk agrees. "He wrote it down anyway. That's a clerk."`,
      ch:[{t:'On to the gate.', go:()=>startExplore()}]}),
    c3_pallick_caught:()=>({sp:'Pallick', txt:
`He writes the first word. Then he stops, and holds the pen very still above the page, so that a drop of ink gathers on the nib and considers its position.

"There is no village of that name in the Gadrobi Hills," he says. "There is a *goat* of that name. I know the goat." He sets down the pen. "I don't require your real name, Sergeant; it's a courtesy on both our parts. I do require that the false one be *plausible*, or the Council will think I'm drinking."

He waits. So does the ink.`,
      ch:[{t:'Pay the toll.', tag:'5 silver', req:()=>S.silver>=5, fx:()=>{S.silver-=5; S.f.c3_paid=1; AUDIO.play('coin');}, go:'c3_pallick_paid'},
          {t:'Let Brisk talk to him.', req:()=>SQUAD().includes('brisk'), go:'c3_pallick_brisk'},
          {t:'Give him your own name.', fx:()=>{S.f.c3_trueName=1;}, go:'c3_pallick_true'}]}),
    c3_pallick_paid:()=>({sp:'Pallick', fx:()=>{S.f.c3_gate=1;}, txt:
`He counts the coins without touching them, with his eyes, and then touches them, once each, as if confirming they exist. They go into a box. The box goes under the desk. His pen writes *road crew, one wagon, paid* and nothing else.

"No name," he says. "The Council will be bereft. I'd keep the purse inside the coat, Sergeant. Silver makes a noise in this city. People with no silver have very good ears."`,
      ch:[{t:'On to the gate.', go:()=>startExplore()}]}),
    c3_pallick_brisk:()=>({sp:'Brisk', fx:()=>{S.f.c3_gate=1; S.f.c3_briskVoice=1; loy('brisk',1);}, txt:
`Brisk steps up to the desk. She doesn't lean on it. She stands at it, the way the heavy infantry stand at a thing they're about to go through, and uses a voice you have heard exactly once before, at Nathilog, on a quartermaster who had tried to short the company's rations and did not try again.

"Paviors' Guild. Contracted. Gadrobi District, the east crossing, by order of the district warden. Charter exemption on the toll for guild work, section four. Wagon is guild property. Mule is guild property. *I* am guild property. You'll find the warden's seal on the crossing when we get there, and if you'd like to walk down and inspect it I will wait here, with the wagon, in your gate, until you come back."

Pallick regards her for a long moment. Something in him, something that has been thirty years at this desk, lights up very slightly, the way a lamp does.

"Section four," he says. "Nobody has cited section four in my lifetime." He writes: *Paviors, exempt.* He underlines it. "Go on, then. Go on."

Brisk steps back. "Ledgers," she says to you, low. "Every clerk alive wants somebody to have read the ledger. That's all it is. Nobody reads the ledger."`,
      ch:[{t:'On to the gate.', go:()=>startExplore()}]}),
    c3_pallick_true:()=>({sp:'Pallick', fx:()=>{S.f.c3_gate=1; S.f.c3_trueName=1; if (SQUAD().includes('brisk')) loy('brisk',-1);}, txt:
`"Sergeant {sgt}." He writes it. He says it back to you as he does, to get the spelling, and then again to himself, as a man tries a wine. "Unta, I'd say, from the vowels. Road crew." He lets that sit on the page. "Toll is waived for guild crews. It's in the charter."

Brisk waits until you're ten paces past the desk.

"You gave him your name." Not a question. "Your real one. For a book."

"He'd have had it anyway."

"Maybe. Now it's in *ink*." She hitches her shield up on her back. "Ledgers are where names go to be found, Sergeant. I keep ours honest so nobody else has to keep them at all."`,
      ch:[{t:'On to the gate.', go:()=>startExplore()}]}),
    c3_pallick_again:()=>({sp:'Pallick', txt:
`${S.f.c3_gateFought ? `He has not moved from the desk. He did not move during the noise in the lane, either. "The Watch will want to know about the lane," he says, writing. "I will tell them it was the gas. It is usually the gas."` : `"You're entered, Sergeant." He doesn't look up. "Go and be entered somewhere else."`}`,
      ch:[{t:'Leave him.'}]}),

    /* ---- the wagon at the gate ---- */
    c3_wagon:()=>({sp:'The wagon', txt:
`${S.f.c3_wagonSeen ? `${S.f.c2_wagon ? 'Pell the mule' : 'The mule'} is eating something off the cobbles that you'd rather not know about. Brisk has the ledger closed on her knee. The crate under the oilcloth is where it has been for ${tripDays()} days.` :
`Brisk is at the tailboard with the ledger open, writing in the last of the light, which she does when she wants a thing on paper before a city gets a look at it.

"${SQUAD().includes('ellis') ? (S.f.c2_late ? 'Seven days, six.' : 'Eight days, six.') : (S.f.c2_late ? 'Ten days, five.' : 'Eleven days, five.')} ${S.f.c2_late ? 'One day lost on the plain, sergeant\'s order.' : 'No days lost.'} One mule. One Bridgeburner crate, unopened, and I've written *unopened* twice so Kettle can see it." She blots it on her sleeve. "When we hand the wagon over, this goes with it. Whiskeyjack can read what it cost to get here, or not. I'd like him to read it."

${S.f.c2_badge ? `She has the Ninth Regiment badge on a thong round her wrist now, where she can turn it. "Lot of Malazans in this city, if you know how to look. Second Army deserters, some. Tav'd never desert. I'm looking anyway. It's a habit. Like the count."` : `"A city this size," she says, looking at it, "has a pay-ledger somewhere with every name in it. Somebody's. I'd give a lot to read it and find nobody I know."`}`}`,
      fx:()=>{S.f.c3_wagonSeen=1;},
      ch:[{t:'Leave'}]}),

    /* ---- exit: through the gate (the cutpurses) ---- */
    c3_to_cross:()=> S.f.c3_gateFought ? {sp:'The Worry Gate', txt:
`Through the gate, the street drops toward the Gadrobi District and the blue lamps go down it like a spilled necklace. Somewhere down there, a crossing with a hole in it.`,
      ch:[{t:'Down into the Gadrobi District.', go:()=>{ startExplore('gadrobi_cross'); talk('c3_cross_arrive'); }},
          {t:'Not yet.'}]} : !S.f.c3_gate ? {sp:'The Worry Gate', txt:
`The clerk at the desk by the gate has lifted his pen, and is holding it up, not at you, exactly, but at the space you are about to walk through. Nothing goes through the Worry Gate unwritten.`,
      ch:[{t:'Not yet.'}]} : {sp:'The Worry Gate', txt:
`You walk the wagon into the gate's arch. It is long, the arch, twenty paces of dark with the blue at the far end, and there's a lane opening off it on the left where the lamps have not come on.

${S.f.c3_paid ? `Something moves in the lane. Pallick said it: silver makes a noise.` : S.f.c3_briskVoice ? `Something moves in the lane. Brisk's voice carried; a guild wagon is a wagon somebody has paid for, and someone in that lane knows the arithmetic.` : `Something moves in the lane. A wagon that didn't pay the toll is a wagon with something on it worth not paying for, and someone in that lane can count.`}`,
      ch:[{t:'Keep walking.', go:'c3_ambush'},
          {t:'Not yet.'}]},
    c3_ambush:()=>({sp:'The lane by the Worry Gate', scene:'city_street', txt:
`Three of them come out of the lane at once, low and fast, thin as the lane itself, knives out and held the Daru way, point down along the forearm. Behind them, filling the lane from wall to wall, two Gadrobi with cudgels and faces like walls that have been punched a great deal and have decided to be proud of it.

The first one is at the wagon's tail before the mule has finished being alarmed. His hand is already under the oilcloth.

Kettle's voice, very high and very calm: "*That's a Moranth crate.*"

The hand comes out a great deal faster than it went in.

${S.f.c3_paid ? `"Purse," says the big one, to you, reasonably. "Saw it. Clerk's desk. Just the purse, and the crate stays a crate."` : `"Wagon," says the big one, reasonably. "Just the wagon, Malazan. You can keep the mule. Nobody wants the mule."`}

${S.f.c2_wagon ? 'Pell the mule' : 'The mule'}, as if understanding, tries to bite him.`,
      ch:[{t:'"Brisk."', go:()=>startBattle('cutpurses',{})},
          {t:'Kettle has a sharper in her hand already.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('cutpurses',{pre:true})}]}),
    c3_after_cutpurses:()=>({sp:'The lane by the Worry Gate', scene:'city_street', fx:()=>{ S.f.c3_gateFought=1; gain('daruknife'); }, txt:
`It's short. City fights are; there's nowhere to run in a lane except the ends, and there are Malazans at both of them. The bigger of the two Gadrobi goes down last and hardest and gets up again on his hands and knees and crawls, with great dignity, into the dark, and nobody stops him.

One of the thin ones has left his knife behind, on the cobbles, under the wagon. It's a duelling knife, long and fine, with a brass-wire basket round the grip. No cutpurse ever bought it. ${SQUAD().includes('ellis') ? `Ellis picks it up, weighs it, and hands it to you hilt first. "Daru noble's. Stolen from a man who'll have had the thief killed by now. It's a lovely thing. Don't wear it where a noble can see."` : `Brisk picks it up and hands it to you hilt first. "Pretty. Too long for a lane. Somebody's going to miss that."`}

At the gate, Pallick has not looked up from his ledger once. You get the feeling he has written *the gas* already.`,
      ch:[{t:'Down into the Gadrobi District.', go:()=>{ startExplore('gadrobi_cross'); talk('c3_cross_arrive'); }}]}),

    /* ---- the Gadrobi crossroads: arrival ---- */
    c3_cross_arrive:()=>({sp:'The Gadrobi crossroads', scene:'city_street', fx:()=>{S.f.c3_cross=1;}, txt:
`Four streets meet here, badly, the way streets meet where two districts do and neither will admit it: a tannery on one corner, a shuttered chandler's on another, a cooper's yard on the third, and on the fourth nothing but a wall with a lamp on it, and beside the wall an alley going up between blind walls toward the Daru District. Noise comes down the alley from somewhere at the top of it: a tavern, by the sound, with the door open. In the middle of the crossing somebody has taken up the cobbles in a square and put a ring of sharpened stakes round the hole, and a sign on the stakes that says, in Daric, *By order of the District Warden: Works*.

A lantern burns down inside the hole. Voices come up out of it, arguing, in Malazan.

A brazier. A crew's wagon with barrels on it. A very large man with tattoos across his face, standing at the stakes with his arms folded, and the arms are the size of your legs. Further off, alone, a young woman in a grey shawl, leaning on the chandler's shutters, doing nothing. Everyone in the crossing is somehow standing with their backs to her.

And at the barrier, on an upturned bucket, with a sword across his knees that he is not oiling this time, only holding: Whiskeyjack.

${SQUAD().includes('ellis') ? `Ellis has stopped a pace behind you. "Bridgeburners," she says, very low. "I've read their file. It's shorter than you'd think, and everything in it is a lie they told on purpose."` : `Kettle, reverent: "*Road crew.*"`}`,
      ch:[{t:'The crossing.', go:()=>startExplore()}]}),

    /* ---- Whiskeyjack ---- */
    c3_wj:()=>({sp:'Whiskeyjack · Bridgeburners', scene:'city_street', fx:()=>{ S.f.c3_reported=1; if (S.f.c2_late) S.f.wjRegard = (S.f.wjRegard || 0) - 1; }, txt:
`He doesn't stand. He looks at the wagon, and at the mule, and then at each of you, counting, and arrives at ${SQUAD().length === 6 ? 'six' : 'five'}, and you watch him check it${SQUAD().includes('ellis') ? ` and not like the sum. His eyes rest on Ellis's glove for exactly as long as it takes to read it` : ''}.

${S.f.c2_late ? `"Twelve days." Level, quiet, the way he'd read off a distance. "I said eleven."

That's all. He doesn't ask for the reason. He's filed it. You can see it go into the drawer and the drawer close.` : `"Eleven days."

That's all. Nothing after it. From anyone else it would be nothing. From him it is a sentence, with a full stop, and Brisk hears the full stop and stands a very little taller.`}

${S.f.c2_key === 'light' ? `He doesn't ask about the light in the west. He must have seen it; the whole of Genabackis saw it. He doesn't ask. Tuft, beside you, watches him not ask, and her face does something complicated and grateful and afraid all at once, and then goes back to being her face.` : `He doesn't ask about the plain. Whatever he heard, he heard from somebody else, and he'll keep it where he keeps things.`}

"Fourth Squad. You're a road crew now. Paviors' Guild, Gadrobi District, contracted to relay this crossing. You've done it before, badly, in a town you've forgotten the name of. If a Daru asks, you're Gadrobi. If a Gadrobi asks, you're from the hills. If anyone asks who's paying you, you point at me, and I'll look stupid, and that's what I'm for."`,
      ch:[{t:'"And what are we actually doing, sir?"', go:'c3_wj_orders'},
          {t:'"Kettle has something she wants you to hear."', go:'c3_wj_orders', fx:()=>{S.f.c3_kettleSeal=1; loy('kettle',1);}}]}),
    c3_wj_orders:()=>({sp:'Whiskeyjack', txt:
`${S.f.c3_kettleSeal ? `Kettle tells him. All of it: ${tripDays()} days, the plain, the barrow, the mage, the seals, *unopened*, twice. He listens to the whole of it with his face doing nothing at all.

"Noted," he says. "Open it."

Kettle makes a sound you have not heard her make.

` : ''}"Down that hole there are gas mains. Old ones. The whole city breathes through them." He doesn't lower his voice; nobody lowers their voice on a road crew. "Fiddler and Hedge are making a nest down there. Your wagon's the eggs. You'll haul them down, one at a time, carefully, and you'll stack them where Hedge says, and you won't ask Hedge why, because he'll tell you, and then you'll know."

"Quick Ben and Kalam aren't here. They'll be back when they're back. You didn't see them go and you won't see them come."

He looks at the dark over the lake, where nobody else looks, for as long as it takes a lamp to hiss.`,
      ch:[{t:'"Where are Quick Ben and Kalam?"', go:'c3_wj_guild'},
          {t:'"Sir." Start hauling.', go:()=>startExplore()}]}),
    c3_wj_guild:()=>({sp:'Whiskeyjack', fx:()=>{S.f.c3_guildHeard=1;}, txt:
`Hedge's head comes up out of the hole like a mole's, with a cap on it and a lot of dirt, and a grin that has several teeth missing and seems to feel it has plenty left.

"Out making friends with the Guild," he says. "Kalam's old trade. Quick's gone along to be charming. Hood help the Guild."

Whiskeyjack doesn't turn round.

"Hedge."

"Sergeant?"

"Down."

The head goes down. Whiskeyjack looks at you. His eyes are grey and tired, and there is nothing in them that is angry, and that is somehow the worst part.

"Forget you heard that word. Not *don't repeat it*. Forget it. If it's in your head it can come out of your mouth, and if it comes out of your mouth in this city, somebody I'd rather keep breathing stops."

${S.f.wjRegard > 0 ? `A pause. "I'm telling you because I think you can. Don't make me wrong."` : S.f.wjRegard < 0 ? `A pause. "I'd rather not have had to tell you at all."` : ''}`,
      ch:[{t:'"What word, sir?"', fx:()=>{S.f.c3_whatWord=1; loy('brisk',1);}, go:()=>startExplore()},
          {t:'"Sir."', go:()=>startExplore()}]}),
    c3_wj_again:()=>({sp:'Whiskeyjack', txt:
`${S.f.c3_msg && !S.f.c3_key ? `He looks at your face, not your hands. Whatever's in your hands, he has decided not to see it, and he has decided that where you can watch him decide.

"Dawn," he says. "Back by dawn. All of them."` :
  S.f.c3_workDone ? `"Crates are down. Hedge is happy, which I don't like." He's on his bucket with the sword across his knees again. "Stay near the crossing tonight, Sergeant. Drink at the Phoenix if you have to drink; it's near enough to shout from. This city is quiet at night the way a pond is quiet, and I've started to see what's under it."` :
  `"Crates, Sergeant." Not unkind. Not anything. "They don't carry themselves, and if they start to, run."`}`,
      ch:[{t:'Leave him.'}]}),

    /* ---- the crew ---- */
    c3_fiddler:()=>({sp:'Fiddler · sapper', fx:()=>{S.f.c3_fid=1;}, txt:
`He's sitting on the lip of the hole with his legs hanging into it and a fiddle case on his back that has never, as far as you can tell, had a fiddle in it.

${S.f.c3_workDone ? `"Good hands, your lot. Your sapper stacks like a sapper; she's got the lean for it, never leans on anything that'd lean back." He spits into the hole, which is a sapper's blessing. "Tell her I said. Don't tell Hedge I said."` : `"You're the baggage." Friendly. "Good. We ran out of baggage a week ago and Hedge has been using his own coat. Everything goes down the ladder by hand. Nobody throws. Nobody drops. If you feel a sneeze coming, you tell me, and I'll tell you where to put it."`}

His eyes go past you, once, to the chandler's shutters, and the woman in the grey shawl, and come back fast.

"And Sergeant. Her." He doesn't point. He doesn't need to. "Don't talk to her. Don't look at her long enough for her to notice." He smiles, and it isn't a joke, and he knows you know. "Squad advice. Free. First and only."`,
      ch:[{t:'"Who is she?"', go:'c3_fiddler_sorry'},
          {t:'"Bones?"', tag:'Bones', req:()=>!!S.f.c3_workDone && S.silver >= 1 && (S.f.c3_bonesNet || 0) < 15, go:'c3_bones'},
          {t:'Leave him.'}]}),
    c3_bones:()=>({sp:'Fiddler', txt:
`"Bones." Fiddler considers the word as if it were a fuse. Then he whistles, two notes, and Hedge comes out of the dark from the direction of the crates with his onion. "Sergeant wants a game."

"*Does* she." Hedge is already sitting. "Does he. Does the Sergeant." He produces the bones from somewhere under his cap. "My deal. Fid keeps the count. Fid, keep the count honest, the Sergeant's watching."

"I always keep it honest," says Fiddler. "That's why you always lose."

${S.f.c1_bones === 'won' ? `Hedge squints at you. "Wait. Pale. The blanket. You're the one took Fid's silver." He looks at Fiddler with dawning joy. "*You* sit out. I'll get it back for you."` : S.f.c1_bones === 'lost' ? `Hedge squints at you. "Pale. The blanket. You're the one Fid cleaned out." He beams. "Welcome back."` : ''}`,
      ch:[{t:'Deal.', tag:'Bones', go:()=>playBones({opp:'hedge', chat:'fiddler', stakes:[1,3,5], place:'c3', cap:15, after:r => { S.f.c3_bonesLast = r.games ? (r.net > 0 ? 'won' : r.net < 0 ? 'lost' : 'even') : 'left'; talk('c3_bones_after'); }})},
          {t:'"Another time."'}]}),
    c3_bones_after:()=>({sp:'Hedge and Fiddler', txt:
`${(S.f.c3_bonesNet || 0) >= 15 ? `"That's the crate money," says Hedge, faintly. "That was the crate money, Fid." Fiddler, very calm: "There isn't any crate money." Hedge: "There *was.*"` :
  S.f.c3_bonesLast === 'won' ? `Hedge hands over your silver one coin at a time, as if each one were a tooth. "Fine. *Fine.* Your sapper counts and you throw. That's not a squad, that's a con." He bites his onion. "I like it."` :
  S.f.c3_bonesLast === 'lost' ? `"Onion," says Hedge, holding it up, reverently. "Never doubt the onion."

Fiddler, pocketing his share of your silver: "He'll tell that story for a month. Your name's not in it. You're welcome."` :
  S.f.c3_bonesLast === 'even' ? `"Square," says Fiddler. "That's the worst result there is. Nobody learns anything."` :
  `Hedge puts the bones back under his cap. "Suit yourself. We'll be here. We're always here, lately."`}`,
      ch:[{t:'Leave them to it.'}]}),
    c3_fiddler_sorry:()=>({sp:'Fiddler', txt:
`"Sorry." He lets that sit until you understand it's a name. "Recruit. Fishing village on Itko Kan. Came to us young." A long pause, the kind a sapper leaves while the acid decides. "She's the best we've got at some things. I don't like the things."

"Look, it's like this. There's a feeling you get, before a cusser goes, when you're too close and you know it. The back of your neck knows it before you do." He rubs his. "I've had that feeling, standing next to her. Standing *behind* her. And she never had a munition on her in her life."

He picks up a coil of trip-cord and starts to measure it, and that's the conversation over.`,
      ch:[{t:'Leave him.'}]}),
    c3_hedge:()=>({sp:'Hedge · sapper', txt:
`${S.f.c3_workDone ? `Hedge is sitting on a crate that you would not personally sit on, eating an onion like an apple. "Twelve cussers," he says, with his mouth full. "*Twelve.* And the dud. Your sapper counted them twice and the dud three times. Tell you something, Sergeant, I've known Moranth quartermasters wouldn't trust themselves with twelve. She's got the fever. I can see it. Keep her away from this hole after we light it; she'll want to watch."` :
`He's half out of the hole with a cap pushed back and dirt in every line of him, grinning at your wagon like a man greeting a woman he's been writing to.

"That's her, is it? That's the crate?" He sniffs. "Cussers. A full crate, twelve and the dud. Hood's teeth, I can *smell* them. You carried twelve cussers across the Rhivi Plain on a mule-cart. ${tripDays(1)} days." He looks at Kettle. "Did you open it?"

Kettle, rigid: "No."

"Not *once?* Not a peek?" He regards her with enormous pity and respect. "Sergeant, your sapper's either a saint or she's broken. I'd get Mallet to look at her."`}`,
      ch:[{t:'Leave him.'}]}),
    c3_mallet:()=>({sp:'Mallet · healer', txt:
`Mallet is a big soft-looking man with a big soft voice, and neither is true. He's by the crew's wagon with a bucket of water and a roll of linen, doing nothing with them, ready to.

"Your healer." He nods at Ohl. "Denul?" Ohl nods back. It's a long nod, the kind two old dogs give each other across a yard. "Good. Then there's two of us. I don't know what's down that hole, Sergeant, and neither does anyone who's been down it, but I know the smell, and it's the smell of a thing that stops people needing healers."

${S.f.c3_inn ? `"Been to the Phoenix?" A faint smile. "Coll still buying? He'll buy for anyone who'll listen and he'll listen to anyone who won't talk about the Empire. You'll have failed that. Everyone does."` : `"If your lot are thirsty there's a tavern at the top of the alley, first door in Daru. The Phoenix. It's full of thieves." He considers. "They're the best people in Daru. Don't tell them I said."`}

Ohl, when you've moved on: "He knows. About the list. I don't know how." Then, mildly: "Healers."`,
      ch:[{t:'Leave him.'}]}),
    c3_trotts:()=>({sp:'Trotts', txt:
`He's standing at the stakes. He has been standing at the stakes since you arrived and, as far as anyone can tell, since the city was founded. Barghast: tattoos across the whole of his face in blue lines, like a map of rivers, and teeth filed, and hair in knots with little bones in them. He is enormous in the way that walls are enormous. He does not look at you.

${SQUAD().includes('brisk') ? `Brisk stops in front of him. They regard each other, two walls meeting. Then Trotts, very slowly, bares his teeth. Every one of them. Brisk nods, once, as if in answer to a question she's been asked a great many times, and moves on, and says to you, with enormous satisfaction, "*Him* I like."` : `Kettle stops in front of him and looks up, and up. Trotts bares his teeth. Kettle bares hers back. Something is agreed that nobody else understands.`}`,
      ch:[{t:'Leave him.'}]}),
    c3_sorry:()=>({sp:'Sorry', fx:()=>{S.f.c3_sorry=1;}, txt:
`${S.f.c3_sorry ? `She hasn't moved. You're not sure she has breathed. The squad has gone the long way round the brazier to avoid the line of her eyes, and none of them discussed it.` :
`You walk over. Behind you, the crossing gets quieter in a way that has nothing to do with sound: Fiddler's hands stop on the trip-cord, Trotts turns his head, and Hedge, down the hole, stops singing.

She's young. That's the first thing, and it's wrong; she's young the way a knife is new. A plain face. A grey shawl. Hands folded in front of her like a girl waiting at a well. She looks at you, and you have the feeling, clear as cold water, that she has been looking at you since the Worry Gate.

"You brought the wagon. Good. Now stand somewhere I am not."

Eleven words. Each of them put down where it goes. The voice is a girl's voice, and it is not the shape of a girl's voice, and something at the back of your neck, the part that Fiddler talked about, stands up and asks to leave.`}

${!S.f.c3_sorry ? `${SQUAD().includes('ellis') ? `Ellis, when you're back at the brazier, hasn't taken her eyes off the chandler's shutters, and her gloved hand is at her belt, and she is breathing like a scout in long grass. "I've met Claw who'd cross the street," she says. "I'd have crossed it first."` : `Tuft, when you're back at the brazier, has her Deck in her hand, face down, and hasn't noticed she's taken it out. "There's something in her," she says. "Not a warren. *In* her. Like a hand in a glove." She puts the Deck away. She doesn't say anything else, and her hands don't stop shaking for an hour.`}

Kettle, much later, to no one: "I'd rather have a cusser in my lap."` : ''}`,
      ch:[{t:'Stand somewhere she is not.'}]}),
    c3_crew_wagon:()=>({sp:'The crew\'s wagon', txt:
`${S.f.c3_workDone ? `Empty now, except for barrels of pitch and a sign that says *Works* in three languages, one of them misspelt. Your own wagon is drawn up beside it, lighter by one crate. ${S.f.c2_wagon ? 'Pell' : 'Your mule'} looks at the Bridgeburners' mule. The Bridgeburners' mule looks at ${S.f.c2_wagon ? 'Pell' : 'yours'}. Neither of them thinks much of the other.` : `The Bridgeburners' wagon: barrels of pitch, rolls of oiled canvas, picks and shovels, a sign that says *Works*, and nothing whatsoever that would tell a Daru magistrate there was a war on. Your wagon is drawn up alongside, with the crate under the oilcloth.

Kettle is standing next to it. She has one hand flat on the oilcloth. She has not lifted it. She is looking at you with the expression of a hound that has been told to wait.`}`,
      ch:[{t:'Start the work.', req:()=>!!S.f.c3_reported && !S.f.c3_workDone, go:'c3_work_crate'},
          {t:'Leave it.'}]}),

    /* ---- the dig ---- */
    c3_dig_tile:()=> !S.f.c3_reported ? {sp:'The dig', txt:
`A square hole in the cobbles, a ladder going down, a lantern at the bottom, and the smell: sweet, heavy, rotten-sweet, like fruit left too long in a cellar. Fiddler looks up at you from the lip of it and jerks his head, very slightly, at the man on the bucket by the barrier.

"Not me, Sergeant. Him first."`,
      ch:[{t:'Leave it.'}]} : !S.f.c3_workDone ? {sp:'The dig', txt:
`The ladder goes down twice a man's height into a darkness that the lantern makes worse. Down there, pipes. Old iron and older clay, sweating. Hedge's voice comes up, singing something filthy about a Moranth and a goat.

Your wagon is by the stakes. The crate is on your wagon. Kettle is by the crate.`,
      ch:[{t:'Start hauling.', go:'c3_work_crate'},
          {t:'Not yet.'}]} : SQUAD().includes('ellis') && !S.f.c3_msg ? {sp:'The dig', txt:
`Ellis is sitting on the lip of the hole with her legs over the edge, where she can see the whole crossing and nobody can see her hands. She wasn't there a minute ago. She has a folded paper in the gloved one, and she is looking at it the way she looked at the prints on the plain.

She sees you. She doesn't put it away.`,
      ch:[{t:'"Ellis."', go:'c3_msg_ellis'},
          {t:'Leave her be. For now.'}]} : {sp:'The dig', txt:
`${S.f.c3_key ? `The hole is quiet now. The lantern at the bottom has burned down to a bead. Down there, in the dark, twelve Moranth cussers and forty more of the Bridgeburners' own sit in the gas mains of the last free city, waiting, like a held breath.` : `Fiddler's down the hole; you can hear him counting under his breath, and Hedge contradicting him. The smell of gas comes up the ladder like warm breath. Nobody on the crossing looks at the hole for long. It's a road crew's hole. It's nothing. It's Works.`}`,
      ch:[{t:'Leave it.'}]},
    c3_work_crate:()=>({sp:'The crate', scene:'city_street', fx:()=>{ S.f.c3_crate=1; }, txt:
`Whiskeyjack has come over from the barrier. He doesn't say anything. He stands at the wagon's tail, with Hedge's head poking up from the hole behind him, and Fiddler on the lip, and he nods at Kettle.

She lifts the oilcloth. She takes out her knife. She cuts the first seal, the Moranth seal, black wax with a thumbprint in it, and it goes with a sound like a small bone breaking, and everybody on the crossing who knows what a Moranth crate is holds their breath at once.

The lid comes up.

Straw. Oilcloth. Under the oilcloth, a frame of pale wood with thirteen round shapes in it, three rows of four and one on its own at the end, each the size of a man's head, each in its own nest of straw, clay-grey and smooth and heavy-looking in a way that has nothing to do with weight. All but the one on its own. That one sits in the straw like an empty cup.

Twelve cussers. And the dud: the thirteenth, empty clay, the one the Moranth pack in every crate and will never explain.

Kettle doesn't say *I told you*. She doesn't say anything. She stands there looking down at them with her knife still in her hand, and her face is the face of a woman at the end of a very long road, and it is, you realise, joy.

"Twelve," she says at last, to Whiskeyjack. "Sir. And the dud. I *told* them."

"You did." Whiskeyjack looks at her for a moment longer than he has looked at anyone. "${tripDays(1)} days, and you didn't open it." He nods, once. "Hedge. Take them down. Let her carry the first one."`,
      ch:[{t:'Down the ladder.', go:'c3_work_down'}]}),
    c3_work_down:()=>({sp:'Under the crossroads', scene:'cellar', txt:
`Down the ladder it's a different country. A vault, low, bricked, older than the street above it by a good many streets, with water standing in the low places and iron pipes along the walls as thick as a man's waist, sweating in the lantern light. The smell is everywhere: sweet and rotten and faintly warm, like the breath of something asleep. Your eyes water. Your lips go numb.

The pipes hiss. Not loudly. Continuously, the way blood does in your ears when you listen for it.

And along the base of the pipes, packed into niches cut in the old brick, wedged in with clay and straw and a care you've only ever seen in a surgeon: Moranth munitions. Dozens. Cussers, sharpers, burners, stacked where the pipes join, where the pressure's highest, where one would do the most. Fiddler's walking the line with a lantern, touching each one with a fingertip like a man counting sleeping children.

Kettle comes down the ladder behind you with the first cusser in both arms, very slowly, and stops at the bottom, and looks.

"Oh," she says softly. "Oh, *Sergeant*."

${SQUAD().includes('ohl') ? `Ohl, halfway down the ladder, has stopped. "There are forty thousand people in this district," he says, to nobody. "I asked the clerk." Then he comes down the rest of the way and takes a cusser from Brisk's arms, because he is a soldier, and he doesn't say it again.` : ''}`,
      ch:[{t:'"Show me where they go, Hedge. I\'ll lay them."', tag:'Sapper\'s puzzle', go:()=>playCharges({after:r => { S.f.c3_charges = r.solved ? (r.clean ? 'clean' : 'solved') : r.runs ? 'part' : 'hedge'; if (r.solved) mgDeed(r.clean ? 'chargesClean' : 'chargesLaid'); talk('c3_work_hedge'); }})},
          {t:'Stack them where Hedge says.', go:'c3_work_hedge'}]}),
    c3_work_hedge:()=>({sp:'Hedge', scene:'cellar', txt:
`${S.f.c3_charges === 'clean' || S.f.c3_charges === 'solved' ? `Twelve cussers, three runs, and not one of them where Hedge would have moved it. He walks the vault twice with the lantern, touching each one the way Fiddler does, and comes back, and looks at you for a long moment with his cap pushed back.

"${S.f.c3_charges === 'clean' ? 'First go, every run' : 'You got there'}," he says. "I've had sappers ten years in the trade couldn't lay the junction run without taking the arch out. You're wasted on the marines, Sergeant. Everyone's wasted on the marines. That's what marines are for."

` : S.f.c3_charges === 'part' ? `You lay what you can before Hedge takes the chalk back, not unkindly, and finishes the rest himself in about four minutes, whistling.

` : ''}It takes three hours. Nobody drops anything. Nobody sneezes. Brisk carries cussers down the ladder, one at a time, with the same face she uses for rations, and Tuft holds the lantern and says nothing and watches the dark past the pipes, where the vault goes on further than the lantern does.

When it's done, Hedge wipes his hands on his shirt, which makes them dirtier.

"What've you got in the satchel, Falari? Your own kit."

"${numw(S.inv.sharper, true)} sharper${S.inv.sharper === 1 ? '' : 's'}, ${numw(S.inv.burner)} burner${S.inv.burner === 1 ? '' : 's'}, ${numw(S.inv.cusser)} cusser${S.inv.cusser === 1 ? '' : 's'}."

"${S.inv.cusser === 0 ? 'No cussers.' : S.inv.cusser === 1 ? 'One cusser.' : `${S.inv.cusser} cussers.`}" Hedge looks at you, the sergeant, with frank contempt. "You've been walking a marine squad around Genabackis with ${S.inv.cusser === 0 ? 'no cussers' : S.inv.cusser === 1 ? 'one cusser' : 'that many cussers'}. What are you, *priests?*"

He reaches into a niche and takes one out, clay-grey and round, and puts it into Kettle's arms like a baby.

"For carrying. Don't tell Whiskeyjack. Don't tell Fid. Don't name it; I can see you want to name it."

Kettle, very quietly: "Hedge."

"*Don't.*"

He's already turned back to the niches, lips moving, counting the Bridgeburners' own: four crates with green wax on the lids, the ones the Green Moranth brought in for Whiskeyjack, packed with everything from cussers all the way down to smokers. At the last he stops, reaches in, and comes out with two small clay pots stoppered with wax, and drops them into Kettle's satchel without looking.

"Smokers. Nobody counts smokers." He pats the lid. "Thirteen to a crate, the Moranth pack them. Twelve and a dud. The thirteenth's empty clay, every crate, every time, and not one of them will tell you why. I asked once. Still waiting." He wipes his hands again, which doesn't help. "Fid and me named half of what's in these, you know. Sharpers, 'cause that's what they do to you if you're stood too close when one goes. Ears bleeding, bits of iron in your cheek." A pause, very nearly fond. "Ask him about the Drum some day. Not down here."`,
      fx:()=>{ S.inv.cusser += 1; S.inv.smoker = (S.inv.smoker || 0) + 2; S.f.gotSmokers = 1; note('Hedge\'s tip: +1 cusser, and two smokers.','good'); if (SQUAD().includes('kettle')) loy('kettle',1);
        if (S.f.c3_charges === 'clean' || S.f.c3_charges === 'solved') { S.inv.sharper += S.f.c3_charges === 'clean' ? 2 : 1; const up = gainXP(S.f.c3_charges === 'clean' ? 30 : 20); note(`Hedge's respect: +${S.f.c3_charges === 'clean' ? 2 : 1} sharper${S.f.c3_charges === 'clean' ? 's' : ''}, and +${S.f.c3_charges === 'clean' ? 30 : 20} experience.`, 'good'); if (up) note(`The squad reaches level ${S.lvl}.`, 'good'); } },
      ch:[{t:'Up the ladder.', go:'c3_work_done'}]}),
    c3_work_done:()=>({sp:'The second night', scene:'city_street', fx:()=>{ S.f.c3_workDone=1; S.f.c3_night2=1; gain('roadleather'); const up = gainXP(60); note('+60 experience. Road crew work.','good'); if (up) note(`The squad reaches level ${S.lvl}. Everyone is tougher and hits harder.`,'good'); }, txt:
`You sleep on the chandler's roof, all of you in a row under the eaves, and wake at noon to the sound of the city: carts and bells and a man shouting about fish, and under it, if you listen, the hiss. Mallet brings bread. Fiddler throws a crew jerkin at you, oiled leather with a guild mark burned in the back. "Look the part. Nobody looks twice at a man in one of those. Nobody looks *once*."

Then dusk, and the lamps come on, street by street, and it's the second night.

Somebody has come back. Two somebodies. There's a dark long-fingered man sitting on the chandler's step with his feet crossed at the ankles, smiling at nothing, and a big one standing beside him, not leaning on anything. You didn't see them arrive. Nobody saw them arrive.`,
      ch:[{t:'The crossing.', go:()=>startExplore()}]}),

    /* ---- the second night: Quick Ben and Kalam ---- */
    c3_qb:()=>({sp:'Quick Ben · squad mage', fx:()=>{S.f.c3_qb=1;}, txt:
`He smiles when you come up, the way he smiled at the Pale: at something just past you, which you have learned is where he keeps the joke.

"Sergeant. The baggage. Kettle opened the crate? Good. Whiskeyjack's been unbearable. He's been saying *they'll be on time* for a week in a tone of voice that meant he didn't believe it, ${S.f.c2_late ? `and then you were a day late, and he was right, which is worse` : `and now he has to find something else to not believe`}."

${S.f.c2_croneSaw ? `He looks at you properly then, which he doesn't often do to anyone.

"A raven talked to you. On the plain. The big one, the old one." Lightly, as if mentioning weather. "She doesn't talk to people. She talks *about* them, to someone else, afterwards. So somebody who matters has heard your name now, Sergeant, and heard it from her, and she will have made it sound interesting." A pause. "I'd try to be less interesting, if I were you. It's a skill. I've been practising for years."` : `${S.f.c1_qbTuft ? `His eyes go to Tuft, and this time he doesn't bother not looking. "Your mage has been somewhere cold," he says. "I can tell. It's on her like frost. Tell her I said the warren stays open if she wants it to, and I'm not the only one who'd notice if it closed."` : `His eyes go past you to Tuft, and rest there a moment, and come back. "Your mage is holding something shut. Tell her I said the trick is to hold it shut *loosely*. She won't thank you. She'll remember."`}`}

Where they were last night, he doesn't say. You don't ask. There's a cut on the back of his hand, very clean, very fresh, and he sees you see it and turns the hand over.`,
      ch:[{t:'Leave him.'}]}),
    c3_kalam:()=>({sp:'Kalam', fx:()=>{S.f.c3_kal=1;}, txt:
`Kalam doesn't turn his head when you come up. He's watching the rooftops. Not any rooftop in particular: all of them, the whole ragged line of them against the blue glow, the way a man watches the treeline in country where the trees have archers.

"Sergeant." A long pause, the kind he leaves, that you could fit a knife in. "City's full of knives. More than there should be. More than there were last month. Somebody's paying for them, and it isn't us."

He finally looks at you.

${SQUAD().includes('ellis') ? `"You've got a Claw's scout in your squad." A nod, barely, at Ellis. "Cut loose. So she says. So Toc says." His voice doesn't change at all. "The Claw doesn't cut loose. It ties a longer string. Watch who pulls it, Sergeant. It won't be her."` : `"No Claw scout in your squad." It isn't quite a question. "Then you've a Claw's interest in it instead. Same thing, with fewer arrows." His voice doesn't change at all. "They'll come to you before they come to us. They always go to the baggage first. It talks."`}

He goes back to the rooftops.`,
      ch:[{t:'Leave him.'}]}),

    /* ---- Kruppe, on the street ---- */
    c3_kruppe:()=>({sp:'A fat man in a red waistcoat', fx:()=>{S.f.c3_kruppeMet=1;}, txt:
`He is standing in the middle of the crossing, where no one stands, eating a pastry, and he has placed himself precisely where you will walk into him, and you walk into him.

"Ah!" Crumbs. A small, round, sticky hand flutters up and dusts them off your sleeve, and then off his own waistcoat, which is red, and embroidered, and strains. "Kruppe begs pardon of the honest labourer, who is doubtless weary from honest labour, as Kruppe is weary from observing it. Such digging! Such diligence! The Gadrobi District has never seen a hole so lovingly attended."

He beams. His eyes are small and brown and extremely friendly, and they have, in the time it took him to dust your sleeve, counted your squad, priced your boots, noted Kettle's satchel and the way she holds it, and moved on to Tuft, and stopped there, for exactly one blink, and moved on again.

"Kruppe is merely a humble citizen of this great city, a man of modest appetites and immodest waistcoats. Kruppe drinks at the Phoenix, at the top of the alley yonder, the first door in the Daru District, for Kruppe is a Daru man, though his heart is broad enough for both districts and his waistcoat very nearly so. Kruppe finds that road crews are thirsty. Kruppe finds that thirsty road crews, from the *hills*," he lingers on the word, lovingly, like a man smelling a wine he knows to be forged, "are the most delightful company in all Darujhistan, having so many stories and so few of them true."`,
      ch:[{t:'"We\'re from the hills."', go:'c3_kruppe_hills'},
          {t:'"Who are you?"', go:'c3_kruppe_hills'},
          {t:'Step round him.', go:'c3_kruppe_hills'}]}),
    c3_kruppe_hills:()=>({sp:'Kruppe', txt:
`"Of course you are! Of course. Kruppe never doubted it for a moment; the hills produce such *tall* road-menders, such *armoured* ones." He pats Brisk's forearm, briefly, in passing, and Brisk looks at the place where he patted as if a bird had landed on it. "And their accents! The hills are so various."

"Kruppe is Kruppe. That is the whole of it and the sum of it, and many in this city would tell you it is too much of it. Come to the Phoenix tonight, weary labourers. Kruppe will be at his table. Kruppe is always at his table. There will be wine that is not very good, and company that is better, and a young friend of Kruppe's who has never seen a Mala— a *road-mender*, and would so like to hear of the Pale."

A small bow, astonishingly graceful for the shape attempting it.

"Kruppe observes, in passing, that the lady by the shutters has not blinked in some time. Kruppe merely observes. Kruppe is a great observer, and a poor walker, and he walks, now, *away*."

And he does. At a stroll, whistling, with his hands behind his back, across the crossing and up the alley toward the noise at the top of it, and out of sight.

${SQUAD().includes('tuft') ? `Tuft is staring after him. "He looked at me," she says, "like Tattersail used to look at a card she'd already turned."` : ''}`,
      ch:[{t:'Leave it for now.'}]}),
    c3_kruppe_again:()=>({sp:'Kruppe', txt:
`The fat man is not in the crossing. He was, a moment ago. There is a pastry crumb on the cobbles where he stood, and a second one at the foot of the alley, and up at the top of it the Phoenix's door is swinging, very gently, as if someone had just gone through it at a stroll.`,
      ch:[{t:'Leave it.'}]}),

    /* ---- the Phoenix Inn ---- */
    c3_inn_door:()=> !S.f.c3_reported ? {sp:'The Phoenix Inn', txt:
`A painted bird over the door, a phoenix or a chicken, depending on the painter's intentions and your mood. Noise inside, and warmth, and the smell of spilled wine. Whiskeyjack is waiting at the barrier, down the alley. Report first. Drink after.`,
      ch:[{t:'Not yet.'}]} : S.f.c3_inn ? {sp:'The Phoenix Inn', txt:
`The Phoenix is as loud as it was. Kruppe's table is in the corner, and Kruppe is at it, and has raised a cup to you through the window, though you'd swear he hasn't looked round.`,
      ch:[{t:'Go back in for a cup.', go:'c3_inn_again'},
          {t:'Not now.'}]} : {sp:'The Phoenix Inn', txt:
`A painted bird over the door, a phoenix or a chicken, depending. Behind the door, the sound of forty people who have decided that the night is young and so are they, and are wrong on both counts.

${S.f.c3_kruppeMet ? `Kettle has her nose nearly on the window. "The fat one's in there. He's waving. He's waving at *us*."` : `Kettle has her nose nearly on the window. "It's full of thieves," she reports, delighted. "I can tell. They're all sitting with their backs to the wall."`}`,
      ch:[{t:'Go in. All of you.', go:'c3_inn'},
          {t:'Not yet.'}]},
    c3_inn:()=>({sp:'The Phoenix Inn', scene:'inn', fx:()=>{S.f.c3_inn=1;}, txt: S.f.c3_inn ?
`Kruppe's table, under the one good lamp. The wine has not improved. Kruppe is telling Murillio a story about a duchess and a goose in which, as far as you can follow it, Kruppe is both. Coll is listening with his eyes shut. Crokus is walking the coin across his knuckles, back and forth, and watching your squad over it.

${SQUAD().includes('kettle') ? `Kettle is at the bar, trying to get the barkeep to tell her where the gas comes from. The barkeep is pretending not to speak Malazan. Kettle is pretending not to notice.` : `Somebody at the bar is singing. Nobody is stopping him, which in this room is a kind of applause.`}` :
`Low beams, black with smoke. A long bar. Tables that have been fought over, and lost, and put back. Every face in the room turns to look at the door when you come through it and then, with great courtesy, turns away again, and the turning away is a thing you can feel on your skin, like being measured for a coat.

Kruppe's table is in the corner, under the one good lamp. Kruppe is at it, spread, a plate of something in front of him that he is not so much eating as conducting. Round the table: a boy of maybe seventeen, thin and quick, with dark hair in his eyes and a coin walking across the backs of his knuckles as if it had somewhere to be. A slender man in a silk shirt the colour of a bruise, with a thin moustache and rings, who looks at your boots and winces for them. And a big man, a *very* big man, slumped with a jug, whose face was handsome once and whose shoulders were a soldier's once, and who has made a careful, dogged, years-long project of ruining both.

"Ah!" Kruppe spreads his hands. "The road-menders! Kruppe said they would come, and they have come, and Kruppe is never, ever wrong, and it is a burden he carries with such grace. Sit, sit. Crokus, a stool for the armoured lady. Murillio, do stop looking at their boots; they are *hill* boots, they are meant to look like that. Coll—" a small pause, delicately placed, "—Coll, do not buy them anything *yet*."

The big man raises his jug an inch off the table, which might be a toast.

${SQUAD().includes('ellis') ? `Ellis has taken the stool nearest the door without being offered it. She has put her back to the wall. So, you notice, has everyone else in the room.` : `Brisk has taken the stool nearest the door. She has her back to the wall, like everyone else in the room, and she looks, for the first time since the Gadrobi Hills, almost at home.`}`,
      ch:[{t:'Listen to Kruppe.', req:()=>!S.f.c3_innKruppe, go:'c3_inn_kruppe'},
          {t:'The boy with the coin wants to ask you something.', req:()=>!S.f.c3_innCrokus, go:'c3_inn_crokus'},
          {t:'The big man with the jug.', req:()=>!S.f.c3_innColl, go:'c3_inn_coll'},
          {t:'The man in silk is looking at Tuft.', req:()=>!S.f.c3_innMur, go:'c3_inn_murillio'},
          {t:'Ohl has gone very quiet.', req:()=>!S.f.c3_innOhl && SQUAD().includes('ohl'), go:'c3_inn_ohl'},
          {t:'Tuft has gone to the back table.', req:()=>!S.f.c3_drawn && !S.f.c3_noCard && SQUAD().includes('tuft'), go:'c3_inn_tuft'},
          {t:'Kruppe has produced three cups and a coin.', tag:'Kruppe\'s cups', req:()=>!!S.f.c3_innKruppe && S.silver >= 1 && (S.f.c3_cupsSits || 0) < 3, go:()=>playKruppeCups('c3_inn')},
          {t:'Finish your cup and go.', go:'c3_inn_leave'}]}),
    c3_inn_kruppe:()=>({sp:'Kruppe', fx:()=>{S.f.c3_innKruppe=1;}, txt:
`Kruppe sets down his fork, which is a thing he does, you gather, with ceremony, like a herald setting down a trumpet.

"Kruppe welcomes the weary. Kruppe has always welcomed the weary; the weary are his favourite people, being too tired to lie well." He beams round the table. "And what has brought the weary to Darujhistan, the jewel of the lake, the last of the free cities, as the poets say, poets being so fond of the word *last*? Road-mending! A noble trade."

He sips. He sets the cup down precisely in the ring it came from.

"Kruppe will say only this, as a friend, to friends, who are strangers, which are the best kind of friend, having not yet been disappointed. There is a mountain over the lake. The city does not look at it. The city has decided that a thing one does not look at cannot, in fairness, fall on one; Darujhistan is *very* fair-minded. And there is a hole in the Gadrobi crossing, and the city does not look at *that* either, for the same reason, and Kruppe finds it curious, only curious, that the things one must not look at in this city have lately become two, where for so long they were one."

He dabs his lips with a napkin that is cleaner than anything else in the room.

"Kruppe merely observes. More wine?"`,
      ch:[{t:'Back to the table.', go:'c3_inn'}]}),
    c3_inn_crokus:()=>({sp:'Crokus', fx:()=>{S.f.c3_innCrokus=1;}, txt:
`The boy leans in. The coin stops on his knuckles, balanced on its edge, and stays there, which it shouldn't.

"You were at Pale." Low, eager, trying not to be. "Don't say you weren't; your big one carries a shield no road ever needed, and Kruppe says road-menders don't carry shields that heavy. Is it true? The Moon came down over it and the sky caught fire and the whole city went into the ground?"

${S.f.c1_key === 'line' ? `You tell him a little. The tent lines. The Hounds. The cadre row, and standing in front of it.` : `You tell him a little. The tent lines. The Hounds. A crate, and a grey cloak, and keeping a door shut.`}

"And you *lived*," he says.

"Most of us."

"I'd have—" He stops. He looks at the coin on his knuckles, standing on its edge. "I don't know what I'd have done." Honest; it surprises him. "Uncle Mammot says the Empire's a thing that happens to other cities. I think he's wrong. I think it's a thing that happens to the people in them."

Kruppe, not looking over: "The boy is young, and thinks. It will pass. Kruppe has prayed for it."

The coin falls. Crokus catches it without looking. For a moment, Tuft is watching that coin very hard, and then she isn't.`,
      ch:[{t:'Back to the table.', go:'c3_inn'}]}),
    c3_inn_coll:()=>({sp:'Coll', fx:()=>{S.f.c3_innColl=1;}, txt:
`The big man looks at you over the jug for a long time, as if you were a long way off.

"Malazans." Not loud. The table goes quiet around it anyway. "Don't. Kruppe can pretend. Kruppe can pretend a dog's a duchess. I'm too drunk to pretend and not drunk enough to stop noticing." He drinks. "You stand like the Genabaris garrison stood, the year of the treaty, when they came down here to look at us. I sold them wine."

He puts the jug down.

"Here's a thing about your Empire, Sergeant, from a man who used to sit on a council and doesn't. The Empire never conquers a city. It *waits*. It waits for the city to sell itself, one councillor at a time, one wife at a time, one house at a time. And when the city's sold every piece of itself to somebody, your Empress walks in and buys the lot at a discount, and calls it liberation, and she's not even lying. That's the worst of it. By then there's nothing left to take that anybody wants back."

He looks at the jug. It's empty. He looks at it as if that too were something that had been sold.

"Barkeep. A round. For the road-menders." A heavy hand on the table. "They'll need it. They're going to buy this city, and it's already been sold, and nobody's told them what they paid."`,
      ch:[{t:'"And you, Coll? What did you pay?"', check:['guile',12], go:'c3_coll_ok', fail:'c3_coll_fail'},
          {t:'Drink the round. Say nothing.', fx:()=>{loy('ohl',1);}, go:'c3_inn'}]}),
    c3_coll_ok:()=>({sp:'Coll', fx:()=>{S.f.c3_collTalk=1;}, txt:
`You say it the right way, the way you'd say it to a man in your own squad at the end of a bad night, as a thing you'd rather know than not, and not as a thing you'd use. He hears the difference. Drunks always do.

"Everything," he says simply. "A house. A name. A seat. A wife, who did the selling, and did it very well, and I'll not hear a word against her skill." He takes something off his finger. It's a ring: heavy gold, with the device ground off, so that only the shape of a crest is left and not its name. He sets it on the table between the cups. "That was worth a council seat. Now it's worth the round. I'm short, and I'm buying, and a man who buys should pay."

"Take it," Coll says to you. "Go on. I'd rather it went with a soldier than a barman. At least a soldier'll lose it honest."`,
      ch:[{t:'Take the ring.', fx:()=>{ S.f.c3_coll=1; gain('collsignet'); }, go:'c3_coll_take'},
          {t:'Push it back to him. Pay for the round yourself.', tag:'4 silver', req:()=>S.silver>=4, fx:()=>{ S.silver-=4; AUDIO.play('coin'); loy('ohl',1); if (SQUAD().includes('brisk')) loy('brisk',1); }, go:'c3_coll_return'}]}),
    c3_coll_fail:()=>({sp:'Coll', txt:
`It comes out wrong. It comes out like a question a man asks when he's collecting answers, and Coll has been asked that kind of question by better people than you, in rooms with better furniture.

"Paid?" He smiles. It's worse than the other face. "I paid for this round. That's what I paid. Drink it, Malazan, and tell your Empress Coll says the wine is on him, and see if she laughs."

He turns his shoulder. It's a very big shoulder.

Murillio, softly, to you, as if passing a note in temple: "He tells it to people who don't ask. That's the trick. You asked."`,
      ch:[{t:'Back to the table.', go:'c3_inn'}]}),
    c3_coll_take:()=>({sp:'Coll', txt:
`It's heavy in your hand. Heavier than gold should be; that's the history.

Coll nods, once, as if a debt had been entered in a ledger he keeps somewhere behind his eyes. "Good. Now it's a soldier's ring. It'll get lost in a ditch, and that's better than a drawer." He reaches for the new jug. "Don't wear it in the Daru District, Malazan. Somebody might recognise the shape."

Kruppe, delicately, to the ceiling: "Somebody *will*."`,
      ch:[{t:'Back to the table.', go:'c3_inn'}]}),
    c3_coll_return:()=>({sp:'Coll', txt:
`You put the coins on the bar and push the ring back across the table with one finger until it touches his hand.

He looks at it. He looks at you. For a moment the soldier's shoulders are a soldier's shoulders again, and the face is the face somebody married, and then the jug comes up and it's gone.

"Hood take you," he says, without heat. "I'd almost got rid of it."

He puts it back on. Ohl, beside you, has the look of a man who has watched a wound close that he expected to have to stitch.`,
      ch:[{t:'Back to the table.', go:'c3_inn'}]}),
    c3_inn_murillio:()=>({sp:'Murillio', fx:()=>{S.f.c3_innMur=1;}, txt:
`${S.f.c2_key === 'light' ? `"Forgive me," says the man in silk, to Tuft, with a small inclination of the head that a Daru lady would have paid for. "That badge on your collar. Silver and enamel, a hand on a flame. Imperial, surely, but not a soldier's." He smiles. "In this city, my dear, we'd call wearing that a *declaration*. We'd want to know to whom."

Tuft's hand goes to the cadre badge. It doesn't take it off.

"To somebody who's dead," she says.

Murillio's smile goes away entirely, and what's under it is kinder and older. "Ah," he says. "Then it's the only honest thing at this table. Keep it on."` :
  `"Forgive me," says the man in silk, to Tuft, with a small inclination of the head that a Daru lady would have paid for. "You have the look of a girl who's been told to wear a thing and taken it off. There's a mark on your collar where a badge was, and the cloth's less faded." He smiles. "I notice collars. It's a professional failing."

Tuft looks at him for a long moment.

"Then notice something else," she says, and Murillio, to his credit, laughs, and does.`}

${SQUAD().includes('ellis') ? `He glances, just once, at Ellis's glove, and then very carefully away, the way a man steps over something on a stair.` : ''}`,
      ch:[{t:'Back to the table.', go:'c3_inn'}]}),
    c3_inn_ohl:()=>({sp:'Ohl', fx:()=>{S.f.c3_innOhl=1; loy('ohl',1);}, txt:
`Ohl has his cup in both hands and is looking at the beams, at the door, at the long scarred bar, at the corner by the stair where the lamp doesn't reach.

"Number sixty-four," he says quietly, when you sit by him. "Corporal Jeth Arrow. Fifth Company, marines, attached to the Genabaris garrison. Carried letters into this city, eight years ago, when there was a treaty and letters went in and out. He came back with a knife in him from a tavern with a bird over the door. The Phoenix, he said. I remember because he laughed, saying it. *Phoenix.* He said it was a good joke for a place you don't come back from." He turns the cup. "He lived three days. I had my hands in him for all three."

He looks at the corner by the stair.

"I've carried him on the list eight years. I never thought I'd sit in the room." A long breath. "It's a nice room. That's the thing I didn't expect, Sergeant. It's a nice room, and the wine's bad, and the boy with the coin has kind eyes, and a man bled out from here on the road north with his letters still in his coat. Both things. At the same table."

He drinks. "Put it on my list, will you. The room. Not a name. I don't know how to write a room."`,
      ch:[{t:'Back to the table.', go:'c3_inn'}]}),
    c3_inn_tuft:()=>({sp:'Tuft', txt:
`She's at the back table, alone, in the corner the lamp doesn't reach, which she has chosen on purpose. The Deck is on the table in front of her, face down, in a neat square stack, and both her hands are flat on either side of it, not touching.

"It's been warm since the gate," she says, before you can speak. "Warmer since the fat man looked at me." She doesn't look up. "He looked at me like he'd read my cards already. Nobody's done that since the staff."

${S.f.c2_drawn ? `"I drew on the plain, and it was the Raven, or near enough, and the Raven came. I'm frightened of what I'll draw here, and I'm frightened of what'll come if I don't."` : S.f.c2_noCard ? `"You told me not to, on the ridge. I didn't. Nothing happened, and a mage burned anyway. I've been thinking about whether those are connected. I've decided they aren't. I'd like to be wrong."` : `"I'd like to draw one, Sergeant. For the city. It's owed one."`}

"One card. Then I'll put them away and drink the bad wine like a marine."`,
      ch:[{t:'Let her draw.', fx:()=>{ S.f.c3_drawn=1; S.card = ['knight','knight','oponn','assassin','obelisk','magi'][R(6)]; }, go:()=>cardSequence(()=>talk('c3_card'))},
          {t:'"Put it away. Not in front of thieves."', fx:()=>{ S.f.c3_noCard=1; loy('tuft',-1); if (SQUAD().includes('brisk')) loy('brisk',1); }, go:'c3_inn_tuft_no'}]}),
    c3_card:()=>{ const c = (CARDS[S.card] || CH3.card); return {sp:'The Deck of Dragons', scene:'inn', txt:
`Tuft lays the reading out on the back table, on a ring of wine that nobody has wiped in a generation. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)} · ${esc(c.fx)}</div>`, oncard:[S.card,false],
      after:`${c.txt}

Across the room, Kruppe has not turned round. He raises his cup, very slightly, to the wall in front of him, as if toasting a card he cannot see.`,
      ch:[{t:'Put the cards away.', go:'c3_inn'}]}; },
    c3_inn_tuft_no:()=>({sp:'Tuft', txt:
`She squares the stack with one finger and puts it into her sleeve.

"Yes, Sergeant."

${S.f.c2_noCard || S.f.c1_noCard ? `She doesn't say *that's twice*, or *three times*. She's stopped counting out loud. That's worse.` : `She goes to the bar and comes back with a cup of the bad wine, and drinks it like a marine, all at once, and makes the face.`}

Across the room, Kruppe sighs, very gently, as if a pastry had been taken off his plate.`,
      ch:[{t:'Back to the table.', go:'c3_inn'}]}),
    c3_inn_leave:()=>({sp:'Kruppe', fx:()=>{S.f.c3_kruppe=1;}, txt:
`You stand. The squad stands. Kruppe rises too, which takes a moment, and comes round the table to see you to the door with his hands clasped behind his back like a host, or a priest, or a man about to steal your purse and return it with interest.

At the door he stops. He isn't looking at you. He's looking at Tuft, and his face has not changed, and his voice has.

"Kruppe once heard it said, little mage, that on the plain to the north the grass took a thing out of a fire that was a woman when it went into the fire, and is a child now in a blanket, and will be a woman again sooner than any child should, and will *remember*, and that the Rhivi carry her very carefully, as one carries a thing that is heavier every day." A pause, delicate as a knife laid on a plate. "Kruppe merely repeats. Kruppe knows nothing of plains. Kruppe does not care for grass."

Nobody else understands a word of it. Kettle frowns. Brisk looks at the fat man as if he'd spoken Rhivi.

Tuft has gone white. Not pale: *white*, the colour of a candle with no flame in it, and her hand is on the doorframe, and she's holding it.

"Good night, road-menders!" Kruppe, beaming, all his sentences suddenly his own again. "Kruppe bids you mend well!"

The door shuts.

Tuft doesn't let go of the frame for a long moment. When she does, she doesn't say anything, and she doesn't look at you, and she walks back to the crossing ahead of all of you, fast, the way she walked on the plain before she stopped walking in the tall grass.`,
      ch:[{t:'Back to the crossing.', go:()=>startExplore('gadrobi_cross')},
          {t:'"Tuft. What did he mean?"', fx:()=>{S.f.c3_askedTuft=1;}, go:'c3_inn_tuft_after'}]}),
    c3_inn_tuft_after:()=>({sp:'Tuft', txt:
`She stops. She doesn't turn round.

"I don't know." A breath. "That's not true. I don't know *yet*. When I know, you'll be the first, Sergeant. I promise. Just not tonight." Her voice shakes once and then stops shaking, the way a lamp does when a hand closes round it.

${S.loy.tuft >= 2 ? `Then, very quietly: "She's not gone. That's what he meant. That's all I'm going to say, because if I say more I'll have to believe it."` : `And she walks on.`}`,
      ch:[{t:'Back to the crossing.', go:()=>startExplore('gadrobi_cross')}]}),
    /* ---- Kruppe's cups ---- */
    c3_cups_after:()=>({sp:'Kruppe', scene:'inn', txt:
`${S.f.c3_cupsLast === 'caught' ? `Kruppe is still delighted. He tells Murillio about it, in detail, with the Sergeant as the hero and Kruppe as a tragic figure of great charm. Murillio looks at you over his cup with something like respect, which on Murillio looks like indigestion.` :
  S.f.c3_cupsLast === 'up' ? `"The Sergeant leaves richer," Kruppe tells the table, "and Kruppe leaves wiser, which is the better bargain, though it doesn't feel like it." He pats his waistcoat where the silver used to be. "It will feel like it tomorrow."` :
  S.f.c3_cupsLast === 'down' ? `Kruppe stacks your silver in a neat little tower beside his plate and does not touch it, which is somehow worse. "For the next round," he says, "whenever the Sergeant feels lucky. Kruppe keeps it warm."` :
  `"Another time, then." Kruppe puts the cups away inside his waistcoat, one inside the other, and the waistcoat does not change shape at all.`}`,
      ch:[{t:'Back to the table.', go:()=>talk(S.f.c3_cupsFrom || 'c3_inn')}]}),
    c3_inn_again:()=>({sp:'The Phoenix Inn', scene:'inn', txt:
`Kruppe's table. Kruppe at it. ${S.f.c3_coll ? `Coll, without his ring, drinking as if there were more of it in the jug.` : `Coll, with his ring, drinking as if the jug might argue.`} Murillio has changed his rings. Crokus isn't there; Kruppe says he is out *walking*, in a tone that says he is up on a roof somewhere with a sack.

"The road-menders return!" Kruppe beams. "Kruppe knew they would. The wine is still not very good. Kruppe has had words with it."

${S.f.c3_msg && !S.f.c3_key ? `Then, as you turn to go, very quietly, to his plate: "The Daru District is lovely at night, Kruppe hears. Such fine shops. So many of them open late. Kruppe would go in threes, himself. Or sixes."` : ''}`,
      ch:[{t:'Kruppe has the cups out again.', tag:'Kruppe\'s cups', req:()=>S.silver >= 1 && (S.f.c3_cupsSits || 0) < 3, go:()=>playKruppeCups('c3_inn_again')},
          {t:'Back to the crossing.', go:()=>startExplore('gadrobi_cross')}]}),

    /* ---- the message ---- */
    c3_urchin:()=>({sp:'A Gadrobi child', fx:()=>{S.f.c3_msg=1;}, txt:
`She's perhaps nine. Barefoot, sharp-elbowed, with a Gadrobi face under a lot of dirt and a Daru coin, a whole silver councillor, held up between two fingers where you can see it, which is not a thing a child in this district does unless she wants it seen.

"You the sergeant? The road-crew sergeant with the mule that bites?" She doesn't wait. "A lady give me this to give you." A folded paper, clean, sealed with blue wax. "And this to not read it." The coin. "I can't read anyhow, but she didn't ask."

She holds the paper out and doesn't let go of it when you take it.

"She's got blue hands," the child says. "Right up to here." She touches her own wrist. "Nice voice. Give me a honey-cake once. I didn't eat it." A pause. "I'd like another coin to forget your face, Sergeant. I'm good at forgetting. It's the most of what I'm good at."`,
      ch:[{t:'Give her a coin.', tag:'1 silver', req:()=>S.silver>=1, fx:()=>{ S.silver-=1; AUDIO.play('coin'); }, go:'c3_msg_read'},
          {t:'"Keep the one you\'ve got. Go home."', go:'c3_msg_read'}]}),
    c3_msg_ellis:()=>({sp:'Ellis', fx:()=>{ S.f.c3_msg=1; S.f.c3_ellisMsg=1; }, txt:
`She doesn't get up. She holds the paper out without looking at it.

"There was a boy at the Gadrobi well. Nineteen, now. He was thirteen when I knew him, in the training yards at Genabaris, and he cried every night for a year and then one night he stopped, and they gave him a grey cloak for it." Her voice is exactly level. "He found me at the well at noon. He didn't say my name. He said *pretty*, the way the man at the green door said it, and put this in my hand, and walked off, and I let him."

Sealed with blue wax. Your name on the front, in a small square hand.

"I didn't open it. I want that in the ledger." A breath. "I thought about not bringing it to you. I thought about dropping it down the hole. I thought about a lot of things, Sergeant, for about an hour, and then I came and sat here where you'd have to walk past." She finally looks up. "This is how they do it. They don't come for you. They send you something through somebody who used to be yours, and then they watch which way you carry it."

"I carried it to you. That's the only thing I've got to say about it."`,
      ch:[{t:'Open it.', go:'c3_msg_read'}]}),
    c3_msg_read:()=>({sp:'The message', txt:
`The paper is good paper, the kind a Daru merchant uses for a bill of sale. The hand is small, square, feminine, and completely without flourish.

*Sergeant {sgt}. A dye-shop in the Street of Tanners' Daughters, Daru District, the sign of the blue hand. Tonight, after the eleventh bell. Come up the outside stair. Bring whom you like. You will be offered tea, and something more useful than tea.*

*You carry the Empire's regard already, Sergeant, whether you know it or not. Come and learn its weight.*

No signature. At the bottom, pressed into the paper with a thumb, a small print in blue dye, perfectly clear, perfectly unhurried.

${SQUAD().includes('brisk') ? `Brisk reads it over your shoulder, which she has never done. "Claw," she says. Just that. Then: "They don't ask, Sergeant. When the Claw asks, it's so there's a record you said yes."` : ''}

${S.f.marked ? `Your name, spelled correctly. You think of a man at the Pale with clean boots, writing in a very neat hand.` : S.f.c3_trueName ? `Your name, spelled correctly. You think of Pallick at his desk, saying it back to you to get the vowels.` : `Your name, spelled correctly. You haven't said your name to anyone in this city. You go through it twice to be sure.`}

The alley at the east end of the crossing runs up into the Daru District. It's the only way that isn't back.`,
      ch:[{t:'The crossing.', go:()=>startExplore()}]}),

    /* ---- exit: the alley east, to Daru ---- */
    c3_to_daru:()=> S.f.c3_msg ? {sp:'The alley east', txt:
`The alley climbs out of the Gadrobi crossing between two blind walls. At the top, where the cobbles change, the Phoenix's painted bird hangs over the first door in Daru; past it the street climbs on, and the lamps are closer together and the doors have brass on them. After the eleventh bell.`,
      ch:[{t:'Up into the Daru District.', go:()=>{ startExplore('daru_street'); talk('c3_daru_arrive'); }},
          {t:'The Phoenix, at the top of the alley.', go:()=>{ startExplore('daru_lane'); if (!S.f.c3_lane) talk('c3_lane_arrive'); }},
          {t:'Not yet.'}]} : S.f.c3_reported ? {sp:'The alley east', txt:
`The alley climbs out of the Gadrobi crossing between two blind walls, and at the top of it the cobbles change: smaller, squarer, laid by somebody who was paid properly. The Daru District starts there. So does the Phoenix, on the first corner, with a painted bird over its door and noise coming out round the edges of it.${S.f.c3_workDone && SQUAD().includes('ellis') ? `

Ellis isn't at your shoulder, where she usually is. The last you saw of her, she was sitting on the lip of the dig.` : ''}`,
      ch:[{t:'Up to the Phoenix.', go:()=>{ startExplore('daru_lane'); if (!S.f.c3_lane) talk('c3_lane_arrive'); }},
          {t:'Not yet.'}]} : {sp:'The alley east', txt:
`The alley climbs toward the Daru District, where road crews have no business after dark. Not yet. You've no reason to be up there, and Whiskeyjack would ask what the reason was.${S.f.c3_workDone && SQUAD().includes('ellis') ? `

Ellis isn't at your shoulder, where she usually is. The last you saw of her, she was sitting on the lip of the dig.` : ''}`,
      ch:[{t:'Not yet.'}]},

    /* ---- the top of the alley: the Phoenix ---- */
    c3_lane_arrive:()=>({sp:'The Daru District', scene:'city_street', fx:()=>{S.f.c3_lane=1;}, txt:
`Up the alley between two blind walls, with the gutter running down the middle of it the wrong way, and at the top the cobbles change: smaller, squarer, laid by somebody who was paid properly. The Daru District. Not the rich end; the rich end is further up, where the lamps sit in brass cages. This is the end where the Daru come down to drink with people they wouldn't have to dinner.

The first door on the corner has a painted bird over it, a phoenix or a chicken, depending on the painter's intentions and your mood, and noise coming out round the edges of the door the way steam comes out round a lid.

${SQUAD().includes('kettle') ? `Kettle has her nose up like a dog at a kitchen. "Wine," she reports. "Bad wine. And pastry. And somebody's *very* good boots."` : `Brisk looks at the door, and at the street, and at the roofs opposite, in that order, and says nothing, which from Brisk is approval.`}`,
      ch:[{t:'The lane.', go:()=>startExplore()}]}),
    c3_lane_irilta:()=>({sp:'A big woman in an apron', fx:()=>{S.f.c3_laneIrilta=1;}, txt: S.f.c3_inn ?
`She's back on the step with the door propped behind her and the cudgel leaning on the frame. "Still sitting down?" she says, and looks you over, and seems to decide you are. "Good. Kruppe likes you. I haven't made up my mind."` :
`She's taking the air on the step with the door propped open behind her: a big woman in an apron, sleeves rolled to the elbow, and a cudgel leaning on the frame within reach, the way another woman might keep an umbrella by the door. She looks the squad over the way a quartermaster looks over a delivery she didn't order.

"Road crew," she says. "From the hole." It isn't a question; the whole street knows about the hole. "You pay before you drink. You drink sitting down. You start anything, I finish it." She jerks her head at the door. "Kruppe's at his table. He's always at his table. He said you'd come." A pause. "He says that about everybody. It's worse when he's right."

${SQUAD().includes('brisk') ? `Brisk looks at the cudgel, and at the arm that goes with it, and nods to her the way she'd nod to another sergeant.` : `Nobody argues with the cudgel.`}`,
      ch:[{t:'"We\'ll sit down."'}]}),
    c3_lane_boy:()=>({sp:'A boy on a barrel', fx:()=>{S.f.c3_laneBoy=1;}, txt:
`A boy of ten or so is sitting on a barrel against the Phoenix's wall with his heels drumming on the staves, watching the squad the way a cat watches a bird it has decided is too big. His eyes go to ${SQUAD().includes('kettle') ? `Kettle's satchel` : `your belt`} and stay there.

${SQUAD().includes('kettle') ? `Kettle looks back at him. "No," she says. The boy considers this, and nods, and looks at Brisk's purse instead. Brisk looks at him. He looks at the sky.` : `Brisk moves her purse round to the front of her belt without looking at him. He looks at the sky.`}

"You're the hole," he says. "Everybody knows about the hole. The big sad one's in there. The fat one's in there; he's *never* sad. Crokus is in there with his coin." He hops down. "I'm not in there. I'm not allowed in there. I'm allowed *out here*."

And he's gone up the street, past the lamps, before you've decided whether you've been robbed.`,
      ch:[{t:'Count the purse.', go:'c3_lane_purse'}]}),
    c3_lane_purse:()=>({sp:'The purse', txt:
`It's all there. Every coin. You count it twice.

It's the not knowing that stays with you, all the way to the door.`,
      ch:[{t:'The lane.'}]}),
    c3_lane_back:()=>({sp:'The alley', txt:
`Back down the alley to the Gadrobi crossing, where the brazier is.`,
      ch:[{t:'Down to the crossing.', go:()=>startExplore('gadrobi_cross')},
          {t:'Not yet.'}]}),

    /* ---- the Daru District ---- */
    c3_daru_arrive:()=>({sp:'The Daru District', scene:'city_street', fx:()=>{S.f.c3_daru=1;}, txt:
`Up here the streets are narrower and cleaner, and the lamps are set in brass cages instead of iron, and the houses lean together overhead as if sharing a secret about you. Shuttered shopfronts. A cat. A gutter running with water that is, faintly, blue: the dye-works somewhere up ahead, bleeding into the street the way they have for a hundred years.

The Moon's Spawn is right overhead here, or seems to be. It's a trick of the narrow street; the lake is half a mile off. But between the rooflines there is a strip of sky, and the strip is black, and it has no stars in it.

${SQUAD().includes('ellis') ? `Ellis has her hood up. She didn't have it up in the Gadrobi. "Blue hand," she says, reading a sign you can't see yet. "Top of the street, on the left. Outside stair. She'll have somebody on the roof opposite. There's always somebody on the roof opposite."` : `Kettle, very low: "Everyone up here's rich. I can tell. The gutters are *clean*." She says it the way you'd say *the water's poisoned*.`}

At the corner, under a lamp, two men in the city's grey-and-blue watch colours have stopped talking to each other in order to watch you.`,
      ch:[{t:'The street.', go:()=>startExplore()}]}),
    c3_guard:()=>({sp:'City Watch', txt:
`There are two of them: an older one with a paunch and a pike he uses to lean on, and a younger one with a pike he holds as if it might be asked a question.

"Evening." The older one. "Road crew." He's read the guild mark. "Gadrobi crossing, that'll be. Long way up from the Gadrobi crossing, this. Long way up after dark." He looks at Brisk's shield, at Kettle's satchel, at the whole shape of you. "You're a lot of road crew for a small hole."

The young one says nothing. His hand has moved an inch down the pike-haft, and you see him notice that it has.`,
      ch:[{t:'"Paviors\' Guild. Sent up to look at the drains by the dye-works. They\'re running blue into the Gadrobi mains."', check:['guile',12], go:'c3_guard_ok', fail:'c3_guard_fail'},
          {t:'Let Brisk tell them.', req:()=>SQUAD().includes('brisk'), go:'c3_guard_brisk'},
          {t:'Three silver, folded into a handshake.', tag:'3 silver', req:()=>S.silver>=3, fx:()=>{ S.silver-=3; AUDIO.play('coin'); }, go:'c3_guard_paid'}]}),
    c3_guard_ok:()=>({sp:'City Watch', fx:()=>{S.f.c3_guards=1;}, txt:
`It's a good lie because it's nearly true. The gutter at your feet is running faintly blue, and the older one looks down at it, and you watch him remember a hundred complaints from a hundred Gadrobi about blue water in their wells.

"Hood knows they're right about that," he says. "Go on, then. Tell the warden it's the Blue Hand. Everyone knows it's the Blue Hand. Nobody does anything, because she gives the Watch a bolt of good grey every winter." He waves you on with the pike. "Nice woman. Terrible drains."

The young one watches you all the way up the street.`,
      ch:[{t:'Up the street.'}]}),
    c3_guard_fail:()=>({sp:'City Watch', txt:
`He looks at the gutter. He looks at you. "Drains," he says. "At the eleventh bell. With a *shield*."

The young one has both hands on the pike now. Behind you, Brisk's weight has shifted the way it does before she does something that can't be taken back.

"It's a cold night," he says, "and my knees are bad, and I'm going to walk round that corner and look at a wall for a while. I'd like the street empty when I come back. I'd like it empty *down*, not up."`,
      ch:[{t:'Three silver, and he looks at the wall longer.', tag:'3 silver', req:()=>S.silver>=3, fx:()=>{ S.silver-=3; AUDIO.play('coin'); }, go:'c3_guard_paid'},
          {t:'Let Brisk tell them.', req:()=>SQUAD().includes('brisk'), go:'c3_guard_brisk'},
          {t:'Wait until they\'re round the corner. Go up anyway.', fx:()=>{ S.f.c3_guards=1; S.f.c3_watchSaw=1; }, go:()=>startExplore()}]}),
    c3_guard_paid:()=>({sp:'City Watch', fx:()=>{S.f.c3_guards=1;}, txt:
`The coins go from your hand to his without either of you looking down. It's done so smoothly that you understand it has been done on this corner a great many times, by a great many hands.

"Evening, road crew," he says, as if you'd only just arrived. "Mind the gutters. They're blue." He walks off round the corner with his pike on his shoulder. The young one hesitates, and then follows, and looks back once, and you can see him learning something he'll wish he hadn't.`,
      ch:[{t:'Up the street.'}]}),
    c3_guard_brisk:()=>({sp:'Brisk', fx:()=>{ S.f.c3_guards=1; loy('brisk',1); }, txt:
`Brisk walks up to the older one until she is standing much too close, and uses the voice she used on Pallick, the regiment voice, the one that comes out of the chest like a drum.

"Sergeant. Paviors' Guild, contracted, Gadrobi crossing. District warden's seal on the works. We've been sent up to inspect the Blue Hand's outflow, which is running into the Gadrobi mains and has been since spring, and which the Watch has been told about, in writing, eleven times. I have a list of the dates. Would you like me to read you the list of the dates, Sergeant?"

He is not a sergeant. He's never been called one in his life. You watch it land on him like a medal.

"No," he says. "No, that's— go on up. Eleven times, was it?"

"Eleven."

Brisk walks on. She doesn't look at you. "Everybody wants to be somebody's sergeant," she says. "Nobody wants to be read a list."`,
      ch:[{t:'Up the street.'}]}),
    c3_guard_again:()=>({sp:'City Watch', txt:
`${S.f.c3_knivesFought ? `The Watch are back on their corner. They are looking at the alley behind the dye-shop very carefully, and at nothing else. One of them has a list. He does not read it.` : S.f.c3_watchSaw ? `They're back from their wall. They look at you the way men look at weather they've decided not to be out in.` : `"Evening, road crew." The older one, already looking elsewhere. "Terrible drains up here."`}`,
      ch:[{t:'Leave them.'}]}),

    /* ---- the dye-shop ---- */
    c3_dye_door:()=> S.f.c3_key ? {sp:'The sign of the blue hand', txt:
`The shutters are closed. The outside stair is dark. There is no light in the room over the courtyard, and there is no sound in it, and you have the distinct feeling that there will not be again, and that there never was.`,
      ch:[{t:'Leave it.'}]} : !S.f.c3_guards ? {sp:'The sign of the blue hand', txt:
`A painted sign over a shuttered shopfront: an open hand, blue to the wrist. An outside stair going up to a room with a lamp in it. The Watch at the corner are watching you look at the stair. Not with them watching.`,
      ch:[{t:'Not yet.'}]} : {sp:'The sign of the blue hand', txt:
`A painted sign: an open hand, blue to the wrist. The shop below is shuttered, and through the gaps in the shutters comes the smell of the vats, sour and mineral and faintly like old blood. An outside stair goes up the courtyard wall to a door with a lamp beside it, and the door is open an inch, and the inch is warm yellow light.

${SQUAD().includes('ellis') ? `Ellis has stopped at the foot of the stair. "I'll come up," she says, before you can ask. "I'd rather see her than be told about her. But I'm going up last, Sergeant, and I'm standing by the door."` : `Tuft has stopped at the foot of the stair. "There's nothing on the stair," she says. "No ward. No warren. Nothing." She sounds as if she'd have liked there to be.`}`,
      ch:[{t:'Up the stair.', go:'c3_madryn'},
          {t:'Not yet.'}]},
    c3_madryn:()=>({sp:'Madryn', scene:'room', fx:()=>{S.f.c3_madryn=1;}, txt:
`A long low room over the courtyard, with the dyeing-frames stacked against one wall and bolts of cloth on shelves, indigo and madder and a grey so fine it looks like smoke. A table. A kettle on a small fire. Cups, set out already. You count them without meaning to: ${SQUAD().length === 6 ? 'seven' : 'six'}. One for each of you, and one for her.

She's sitting at the table, and she doesn't get up. Grey hair pinned up plainly. A dark wool dress with the sleeves rolled. A face that is kind in the way a well-kept tool is kind: it has been used for a long time, carefully, for one purpose. Her hands, folded on the table, are blue to the wrist. Not painted. *Stained*, deep in the skin, in the creases of the knuckles, under the nails. Eleven years of vats.

"Sergeant {sgt}." A gentle voice. A voice for telling children a story they'll remember. "Sit, please. All of you. The tea's hot; I made it when you turned into the street. My name is Madryn. I have kept this shop for eleven years, and in eleven years I have never once had to raise my voice in it, and I don't expect to start tonight."

${S.f.marked ? `She turns over a paper on the table. You can't read it upside down. You don't need to; you know the hand. Neat. "You'll have met our friend at the Pale," she says. "He writes a lovely report. He was very taken with your squad. He said you had a way of *carrying* things."` : S.f.c3_trueName ? `"Pallick sends his regards," she says. "He doesn't know he does. He keeps such a careful ledger, and he leaves it open on the desk at night, and the Worry Gate has a very small window." A smile. "Unta, from the vowels. He was right."` : S.f.c3_falseName ? `"You gave the gate a name that isn't yours. Off a headstone, I'd think; it had that sort of spelling." She pours. "That was well done, Sergeant. I'd like you to know that it was noticed, and that it didn't matter."` : `"You didn't give your name at the gate. Or in the crossing. Or at the Phoenix." She pours. "That was well done, Sergeant. I'd like you to know that it was noticed, and that it didn't matter."`}

${SQUAD().includes('ellis') ? `Her eyes go past you, to the door, where Ellis is standing with her back to the frame.

"Ellis." Warmly, as if to a niece. "Genabaris. You were pretty, the report said. Before the hand." A small sympathetic pause. "You're still pretty, dear. Do come in and sit."

Ellis doesn't move from the door.` : ''}`,
      ch:[{t:'Sit. Drink the tea.', fx:()=>{S.f.c3_tea=1;}, go:'c3_madryn_ask'},
          {t:'Stay standing. "What do you want?"', fx:()=>{ if (SQUAD().includes('brisk')) loy('brisk',1); }, go:'c3_madryn_ask'}]}),
    c3_madryn_ask:()=>({sp:'Madryn', txt:
`${S.f.c3_tea ? `The tea is very good, and exactly as hot as you'd have wanted, and that is the first frightening thing.` : `She doesn't insist. She pours her own cup, and drinks from it, and sets it down, and the not-insisting is somehow worse than a knife on the table would have been.`}

"I'll be plain. The plain way is the kind way, in my experience, and it saves everyone a second pot."

"There is a hole in the Gadrobi crossing. The Bridgeburners are in it. They are putting Moranth munitions into the gas mains, and I know that because I have eyes and a window, and because the Gadrobi well has smelled of Moranth clay for nine days. What I don't know is *how much*, and *where*, and *when*. The Empress would like to know those things before the city does."

She turns her cup a quarter-turn on the table.

"And there are two men who leave the crossing at night. A mage, and a big Seven Cities man who used to be ours. They go into the city and they come back before dawn, and where they go, my people lose them, which my people do not do." Gently: "Whiskeyjack's men have always been very *independent*, Sergeant. The Empress admires independence. She likes to know where it's going."

${SQUAD().includes('brisk') ? `Brisk has not sat down. She has not moved at all. She is standing the way she stands at the front of a shield-wall when the other side hasn't charged yet.` : ''}`,
      ch:[{t:'"And if I tell you?"', go:'c3_madryn_offer'},
          {t:'"The Bridgeburners are Malazans. So are you. Ask Whiskeyjack."', go:'c3_madryn_offer'}]}),
    c3_madryn_offer:()=>({sp:'Madryn', txt:
`She smiles. It is a lovely smile. Grandmothers would envy it.

"Whiskeyjack doesn't answer questions. It's his great charm. You do, Sergeant; it's yours." She reaches down beside her chair and sets a purse on the table beside the kettle. It is not a small purse. "Forty silver, Imperial weight. For your squad's trouble, and for the tea. And something better than silver, which is the Empire's regard. You have a little of it already. You could have a great deal more. It keeps knives off a squad. It opens doors."

She folds her blue hands.

"Or you can go back down my stair and tell me nothing, and I will think no less of you. I will simply think *about* you. And this is a large city, Sergeant, and a dark one, and I am not the only person in it who thinks."

${SQUAD().includes('ellis') ? `At the door, Ellis has gone completely still. Not the stillness of a scout. The stillness of a girl in a training yard, waiting to hear which way her name will be read.` : SQUAD().includes('tuft') ? `Tuft is looking at the purse. Not at the silver: at the purse, the leather, the drawstring, as if she has seen purses like it before, on a staff, in a tent, and knows what they are for.` : ''}`,
      ch:[{t:'Tell her everything. The mains, the count, the two men at night.', go:'c3_report_all'},
          {t:'Tell her some of it. The mains. Not Quick Ben and Kalam.', go:'c3_report_some'},
          {t:S.f.c3_tea ? '"No." Stand up. Walk out.' : '"No." Walk out.', go:'c3_refuse'},
          {t:'Lie to her. Give her a count that\'s wrong and a direction that\'s nowhere.', check:['guile',14], go:'c3_lie_ok', fail:'c3_lie_fail'}]}),

    /* ---- report ---- */
    c3_report_all:()=>({sp:'Madryn', fx:()=>{ S.f.c3_key='report'; S.f.c3_told=1; S.f.c3_toldAll=1; S.f.clawFavour=1; S.silver+=40; AUDIO.play('coin'); note('+40 silver.','good');
        if (SQUAD().includes('brisk')) loy('brisk',-2); if (SQUAD().includes('ellis')) loy('ellis',-2); if (SQUAD().includes('tuft')) loy('tuft',1); if (SQUAD().includes('ohl')) loy('ohl',-1); }, txt:
`You tell her. The vault under the crossing. The pipes, and where they join. How many crates you carried down the ladder, and how many were already there, and how Hedge seats a cusser against a joint. The two men who leave at night and come back before dawn${S.f.c3_qb ? `, and the clean cut on the back of the mage's hand` : ''}. You don't know where they go. You tell her that too, and she writes it down, and it seems to matter to her as much as the rest.

She doesn't interrupt. She doesn't hurry. She listens the way Ohl listens to a chest, and when you've finished she sits for a moment with her pen above the paper, and then she writes one more line, and blots it, and pushes the purse across the table to you with two blue fingers.

"Thank you, Sergeant. That was generous. The Empress will know it was." She stands, at last, and she is shorter than you expected. "My people will leave the Fourth alone. You have my word, and my word is kept in this city by a great many knives that are not mine."

"Whiskeyjack won't hear of this. Not from me. He'll hear of it one day, because everyone does; but not from me, and not this year."

She holds the door for you herself.`,
      ch:[{t:'Down the stair.', go:'c3_report_walk'}]}),
    c3_report_some:()=>({sp:'Madryn', fx:()=>{ S.f.c3_key='report'; S.f.c3_told=1; S.f.c3_toldSome=1; S.f.clawFavour=1; S.silver+=40; AUDIO.play('coin'); note('+40 silver.','good');
        if (SQUAD().includes('brisk')) loy('brisk',-2); if (SQUAD().includes('ellis')) loy('ellis',-2); if (SQUAD().includes('tuft')) loy('tuft',1); if (SQUAD().includes('ohl')) loy('ohl',-1); }, txt:
`You tell her about the vault. The mains. Moranth clay in the joints. Roughly how many crates. You tell her you don't know about the two men at night; they're Bridgeburners, and Bridgeburners don't tell marines where they go, which is true, and she knows it's true, and she knows it isn't the whole of the truth.

She writes it down. When you stop, she waits, pen lifted, for exactly as long as it takes you to understand that she knows you've stopped on purpose.

"That's a sergeant's answer," she says, not unkindly. "You've kept something back for your friends. I'd have thought less of you if you hadn't." She pushes the purse across with two blue fingers. "The Empress pays for what she's given. She notes what she isn't."

"My people will leave the Fourth alone. Whiskeyjack won't hear of this from me. He'll hear of it one day; everyone does." She holds the door for you herself. "Good night, Sergeant. Mind the stair. It's steeper going down."`,
      ch:[{t:'Down the stair.', go:'c3_report_walk'}]}),
    c3_report_walk:()=>({sp:'The Daru District', scene:'city_street', txt:
`Nobody says anything on the stair. Nobody says anything in the street. The purse is heavy on your belt and makes a noise when you walk, and Pallick was right: silver makes a noise in this city, and every one of the squad can hear it.

${SQUAD().includes('brisk') ? `Brisk walks beside you for a whole street before she speaks, and when she speaks she doesn't look at you.

"That's the squad's sergeant, Sergeant." Flat. "That's whose they are. Not ours. *Theirs.* I heard every word, and every one of them was about somebody who's going to be under that crossing when it goes, and you sold them for forty and a cup of tea${S.f.c3_tea ? '' : ` you didn't even drink`}." A long breath through the nose. "I'll put it in the ledger. Forty silver, received. I won't write what for. I'll know."` : ''}

${SQUAD().includes('tuft') ? `Tuft falls into step on your other side, which she hasn't done since the Pale. "You kept a door open," she says quietly. "I've watched a lot of people shut them. They all thought they were being brave. Most of them are dead." She doesn't say anything else. She doesn't need to; she's walking where you can see her.` : ''}

${SQUAD().includes('ohl') ? `Ohl says nothing at all. He has the oilcloth out, and he's looking at it, and he isn't writing anything, and he puts it away.` : ''}

${SQUAD().includes('ellis') ? `Ellis walks behind all of you, last, where a scout walks. At the corner she catches you up, and says one sentence, and it's the right one.

"Now they know the door opens, Sergeant, and they never stop knocking on a door that's opened once."

Then she drops back again, and doesn't come forward for the rest of the night.` : ''}`,
      ch:[{t:'The street.', go:()=>startExplore()}]}),

    /* ---- refuse ---- */
    c3_refuse:()=>({sp:'Madryn', fx:()=>{ S.f.c3_key='refuse'; S.f.marked=1; if (SQUAD().includes('brisk')) loy('brisk',1); if (SQUAD().includes('ellis')) loy('ellis',2); }, txt:
`${S.f.c3_tea ? `You stand up. The stool scrapes. The squad is already standing; they were standing, you realise, before you were.` : `You've been standing since the door. So has the squad, and they've already turned toward it; they turned, you realise, before you'd decided.`}

"No."

She doesn't move. She looks up at you from the table with her blue hands folded and her face exactly as kind as it was, and she nods, slowly, as if you'd told her the price of wool.

"No," she agrees. "I thought perhaps not. You have a very Malazan face, Sergeant, for a Malazan who won't help the Empire." She pours herself more tea. "Well. ${S.f.c3_tea ? `You've drunk my tea, and you've been in my room` : `You've stood in my room and let my tea go cold`}, and now you'll go down my stair, and I'll sit here and think about you. That's all. Go on."

${SQUAD().includes('ellis') ? `At the door, as you pass, Ellis says one sentence, low, to you and not to Madryn, and it's the right one.

"That's the first time anyone's shut that door with me on the right side of it."` : ''}

${SQUAD().includes('brisk') ? `Brisk is the last out. She stops in the doorway and looks back at the woman at the table, for a long moment, and says, very quietly, "Ma'am," the way the heavy infantry say it to an officer they intend to see buried, and goes down the stair.` : ''}`,
      ch:[{t:'Down the stair.', go:'c3_alley'}]}),
    c3_lie_ok:()=>({sp:'Madryn', fx:()=>{ S.f.c3_key='refuse'; S.f.c3_lied=1; S.f.c3_lieHeld=1; S.f.marked=1; if (SQUAD().includes('brisk')) loy('brisk',1); if (SQUAD().includes('ellis')) loy('ellis',2); }, txt:
`You give her a count that's half the true one and a map of the vault that puts the munitions under the wrong street. You give her the two men going *north*, to the lakefront, where the Council's houses are, which is the one direction you're certain they don't go.

She writes it all down. She thanks you. She pushes the purse across.

Then she stops, with two blue fingers still on the leather, and looks at you, and for a moment the kind face is only a face, and what's behind it is doing arithmetic.

"Thank you, Sergeant," she says, and takes her fingers off the purse, and leaves it on her side of the table. "Keep your silver. I'll pay when it's proven. That's how I've kept a shop eleven years."

${SQUAD().includes('ellis') ? `On the stair, Ellis says one sentence, low, and it's the right one.

"She half believes you, and the half that doesn't is the half that sends people."` : `On the stair, Tuft, low: "She half believed you. That's the dangerous half."`}`,
      ch:[{t:'Down the stair.', go:'c3_alley'}]}),
    c3_lie_fail:()=>({sp:'Madryn', fx:()=>{ S.f.c3_key='refuse'; S.f.c3_lied=1; S.f.marked=1; if (SQUAD().includes('brisk')) loy('brisk',1); if (SQUAD().includes('ellis')) loy('ellis',2); }, txt:
`You give her a count, and a map, and two men going north, and she writes it down, and halfway through the second line she stops writing.

She puts the pen down. She puts it down exactly parallel to the edge of the paper.

"Sergeant," she says, gently, the way you'd tell a child its dog has died. "There is Moranth clay in the *Gadrobi* well. Not under the street you've just drawn me. I told you so myself not ten minutes ago." She folds her hands. "It's a kind thing, to lie to someone. It means you think they're worth the trouble. I'm touched. I truly am."

She doesn't raise her voice. She said she wouldn't, and she doesn't.

"Go on down, Sergeant. Mind the stair."

${SQUAD().includes('ellis') ? `On the stair, Ellis says one sentence, and it's the right one. "She's already sent them; she sent them when you came up the stair."` : `On the stair, Kettle, very quietly, feeling in her satchel: "Sergeant, I think we should stop being on this stair."`}`,
      ch:[{t:'Down the stair.', go:'c3_alley'}]}),
    c3_alley:()=>({sp:'The alley behind the dye-shop', scene:'city_street', txt:
`The stair comes down into the courtyard, and the courtyard gate lets out, not onto the street, but into the alley behind it, because the street gate has been locked while you were upstairs. Nobody heard it lock.

No lamps in the alley. Blue light from the street at the far end, and between you and it, forty paces of dark, and dyeing-racks, and wet cloth hanging from them like flayed things, dripping indigo.

${S.f.c3_lieHeld ? `They're slow to come. Whoever sent them sent them with a question, not an order. It gives you a breath. You use it.` : `They're already there.`}

Four shapes come off the racks, low, with the Daru knife-grip. And a fourth, who doesn't come off anything. He's simply there, at the far end, against the blue, in a grey cloak, not hurrying. His boots are clean.

${SQUAD().includes('ellis') ? `Ellis, very quietly: "The one at the end is Claw. The others are money. Kill the money if you have to. Don't let the Claw get behind anyone."` : `Tuft, very quietly: "The one at the end isn't hired. He's the one who pays."`}`,
      ch:[{t:'"Shields. Close up."', go:()=>startBattle('knives', S.f.c3_lieHeld ? {surprise:'p'} : S.f.c3_lied ? {surprise:'e'} : {})},
          {t:'Kettle rolls a sharper down the alley.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('knives', S.f.c3_lieHeld ? {pre:true, surprise:'p'} : S.f.c3_lied ? {pre:true, surprise:'e'} : {pre:true})}]}),
    c3_after_knives:()=>({sp:'The alley behind the dye-shop', scene:'city_street', fx:()=>{ S.f.c3_knivesFought=1; gain('lampchip'); }, txt:
`The hired ones don't die well or badly. Two of them run, and one of them doesn't get up, and wet indigo runs over his hand and into the gutter, and the gutter takes it down to the street where it will go blue into somebody's well.

The Claw is not among them. There's blood on the cobbles where he was, and more on the courtyard wall, and a smear of it at the top of the wall where he went over, and nothing after. He was hurt. He did the arithmetic. He left.

Round the dead one's neck, on a cord, a chip of blue lamp-glass. Daru knives wear them for luck. ${SQUAD().includes('kettle') ? `Kettle cuts it off with her knife and holds it up to the light from the street. "Pretty," she says. "Didn't work."` : `You cut it free. It's warm from him.`}

${SQUAD().includes('brisk') ? `Brisk is looking at the blood on the top of the wall. "Claw bleeds," she says. "Same as anyone. Slower, and somewhere else." She wipes her spear on a hanging bolt of cloth, which dyes the cloth. "He'll remember the shield. I'd like him to."` : ''}

${SQUAD().includes('ohl') ? `Ohl is kneeling by the dead knife with his hands on the man's chest, though there's nothing to argue with Hood about. "Not ours," he says. "Not on the list." And then, after a moment, as if disappointed in himself: "Not on *a* list. That's worse."` : ''}

Up above, in the room over the courtyard, the lamp has gone out.`,
      ch:[{t:'The street.', go:()=>startExplore()}]}),

    /* ---- exit: back west (and the close) ---- */
    c3_back_west:()=> S.f.c3_key ? {sp:'The alley west', txt:
`Down the alley, out of Daru, back toward the Gadrobi crossing and the brazier and the hole. The sky over the lake has gone from black to the grey that comes before black admits anything.`,
      ch:[{t:'Down to the crossing.', go:()=>talk(S.f.c3_key === 'refuse' ? 'c3_return_refuse' : 'c3_return_report')},
          {t:'Not yet.'}]} : {sp:'The alley west', txt:
`Back down the alley to the Gadrobi crossing, where the brazier is.`,
      ch:[{t:'Back to the crossing.', go:()=>startExplore('gadrobi_cross')},
          {t:'Not yet.'}]},
    c3_return_report:()=>({sp:'The Gadrobi crossroads', scene:'city_street', txt:
`The crossing at the end of the night. The brazier is down to embers. Trotts is still at the stakes; you wonder if he has ever not been at the stakes. Hedge is asleep in the hole, sitting up, snoring, with his arms round a crate.

Whiskeyjack is on his bucket. He looks up as you come round the corner, and counts, and gets the number right.

He doesn't ask. He looks at your face, and at the purse on your belt, and at Brisk, who is not looking at you, and then he looks back at the lake. That's all.

It's not that he knows. He doesn't know; Madryn said he wouldn't, and Madryn doesn't lie about small things. It's that he is a man who has spent his life looking at soldiers' faces at the end of nights, and yours is one he's filed now, and you don't know which drawer.

"Roof," he says. "Sleep. It'll be light soon, and nobody will want to look at us."`,
      ch:[{t:'Up to the roof.', go:'c3_close'}]}),
    c3_return_refuse:()=>({sp:'The Gadrobi crossroads', scene:'city_street', txt:
`The crossing at the end of the night. The brazier is down to embers. Trotts is still at the stakes. Hedge is asleep in the hole, sitting up, with his arms round a crate. Mallet is at the wagon, and when he sees you come round the corner, and sees the way Brisk is carrying her arm, and the blood on Kettle's jerkin that isn't Kettle's, he picks up his bucket and comes over without a word.

Whiskeyjack is on his bucket. He looks up, and counts, and gets the number right, and something in his shoulders that you hadn't known was held lets go by the width of a hair.

He doesn't ask. He never asks.

${SQUAD().includes('ellis') ? `Ellis stops beside you. "Tell him," she says, very low. "Or don't. But if you don't, don't do it because of me."` : `Tuft stops beside you. "He won't ask," she says. "That's why you'd have to tell him."`}`,
      ch:[{t:'Tell him. All of it: the paper, the dye-shop, the woman with blue hands, the alley.', go:'c3_wj_good'},
          {t:'Say nothing. Go up to the roof.', go:'c3_close'}]}),
    c3_wj_good:()=>({sp:'Whiskeyjack', scene:'city_street', fx:()=>{ S.f.c3_wjTold=1; S.f.wjRegard = (S.f.wjRegard || 0) + 1; }, txt:
`You tell him. You tell it the way you'd give a report, in order, without anything in it that isn't so: the paper${S.f.c3_ellisMsg ? ' and the boy at the well' : ' and the child with the coin'}, the street, the Watch, the stair, the tea, the blue hands, the purse. What she asked. What you said. The alley, and the grey cloak at the end of it, and the blood at the top of the wall.

He listens to the whole of it with his sword across his knees and his eyes on the lake. He doesn't interrupt. When you've finished, he doesn't say anything.

He doesn't say anything for a long time. Long enough for a lamp at the corner of the crossing to hiss, and gutter, and go out.

Then he looks at you. Grey eyes. Tired. Nothing in them you could name.

"Good."

That's all. That's the whole of it. He looks back at the lake.

It's a lot, from him.

${SQUAD().includes('brisk') ? `Brisk, when you've gone past, not looking at you: "*Good*," she repeats, very softly, to herself, the way you'd test the edge of a blade with your thumb. It's the nearest thing to a smile you have ever heard in her voice.` : ''}`,
      ch:[{t:'Up to the roof.', go:'c3_close'}]}),

    /* ---- chapter close: the roof at dawn ---- */
    c3_close:()=>({sp:'The chandler\'s roof', scene:'roof', txt:
`Dawn, from the flat roof over the chandler's, above the dig. The Fourth is in a row under the eaves where Whiskeyjack put you, and nobody is asleep, and everybody is pretending to be.

The city goes out lamp by lamp: one at a time, street by street, the blue shrinking back into the glass and then gone, as if something beneath the city were breathing in.

And above the haze, the Moon's Spawn. The light is coming up now, and it doesn't catch any; the sun goes round it the way water goes round a stone. Black. Silent. Close enough, in this light, to see that it is not smooth: that there are towers on it, and windows in the towers, and no light in the windows.

${S.f.c3_key === 'refuse' ? `${SQUAD().includes('brisk') ? `Brisk is sitting against the parapet with her arm bound and her shield across her knees. She hasn't said much since the alley. She doesn't need to; she's put the shield on the side of the roof that faces the Daru District.` : ''}

${S.f.c3_wjTold ? `Down below, Whiskeyjack has moved his bucket. He's put it where he can see the mouth of the alley to Daru. He hasn't said why, and he isn't going to.` : `Down below, Whiskeyjack is on his bucket, looking at the lake. He doesn't know. You don't know yet whether that was the right thing, and you're beginning to understand that you won't, for a long time.`}` :
`${SQUAD().includes('brisk') ? `Brisk is sitting at the far end of the row, as far as the roof allows, with the ledger on her knee. It's closed. She has written one line in it tonight, and you know exactly what the line says, and exactly what it doesn't.` : ''}

The purse is under your head. It makes a very poor pillow. It makes a noise every time you move.`}

${SQUAD().includes('tuft') ? `Tuft is awake, sitting up, with her knees drawn in and her arms round them, looking at the Spawn. ${S.f.c3_kruppe ? `She has been looking at it since the Phoenix. Whatever Kruppe said to her in the door, she's turning it over and over the way Crokus turns his coin, and it keeps landing on its edge.` : `She looks at it the way she used to look at the cadre row. The way you look at a place you've been, and got out of, and can see from where you are.`}` : ''}

${SQUAD().includes('kettle') ? `Kettle is asleep, actually asleep, the only one, with her satchel in her arms. Her lips are moving. She's counting.` : ''}`,
      ch:[{t:'Watch the last of the lamps go out.', go:'c3_close_shapes'}]}),
    c3_close_shapes:()=>({sp:'The chandler\'s roof', scene:'roof', txt:
`The last lamp on the lakefront goes out.

In the grey that's left, you see them. Not at once.

On the rooftops. Across the Daru District, along the ridge of the tanneries, on the domes of the Gadrobi temples, on a chimney-stack three streets away: figures. Crouched. Still. Dozens. More than dozens. They are all facing the same way, like crows in a field before weather, and none of them is facing you, and none of them is moving, and then, as the first real light comes up over the hills, they are all moving at once, and then they're gone. Over the ridges, into the gutters, down the far sides of the roofs, as if the dawn had been a signal.

${SQUAD().includes('ellis') ? `Ellis is on her feet. You didn't hear her get up. "That's not the Claw," she says. "The Claw doesn't come in *numbers*. That's something that lives here."` : `Tuft is on her feet. "Sergeant," she says. "Did you see—" and then stops, because you did.`}

Behind you, from the ladder-head, where you didn't hear him come up${SQUAD().includes('ellis') ? ' either' : ''}, Kalam's low unhurried voice:

"Go to sleep, Sergeant. You didn't see that. Nobody sees that."

${S.f.c3_guildHeard ? `And then, after a pause you could fit a knife into: "That's the word you forgot."` : `And then, after a pause you could fit a knife into: "That's the city's other road crew. They've been mending things here a lot longer than we have."`}

He goes back down. The sun comes up over the Gadrobi Hills, and it doesn't touch the Moon's Spawn, and the city starts, below you, to shout about fish.`,
      ch:[{t:'Sleep. Or pretend.', fx:()=>{S.f.c3_done=1;}, go:()=>chapterEnd(3, S.f.c3_key || 'refuse')}]}),
  }
};
