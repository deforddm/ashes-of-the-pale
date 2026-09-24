/* ============ chapter 5: The Gadrobi Hills ============ */
const CH5 = {
  title:'The Gadrobi Hills', number:'Five',
  intro:{loc:'The Gadrobi Hills', sub:'East of Darujhistan · the third day', cap:'Brown hills folded on each other like blankets on a sickbed, and barrow-stones on every crest, and no smoke anywhere.',
    paras:[
`Out through the Gadrobi Gate before the lamps go off, past the tanneries and the goat-pens and the last shrine to a god whose name has worn off the lintel, and then the road east stops pretending. Ruts. A cairn. A dead fire nobody claims. The city is behind you, blue and loud, and in front of you there is nothing, and the nothing goes up and down.`,
`The Gadrobi Hills are brown in autumn and brown the rest of the year. They fold into each other the way old men's hands fold, and on the crests there are stones, set upright, older than the Gadrobi, older than the city, older than anybody the Gadrobi can think of to blame. Sheep won't graze near them. The Gadrobi shepherds won't say why. They say *sheep know*, and spit, and walk the long way round.`,
`Three days ago Whiskeyjack said a thing to you in the vault, over the hiss of the pipes, that you have been turning over since like a stone in a boot. *You found her once without meaning to. Find her again on purpose.* You remember the dust-line on the Rhivi Plain, and now you know what raised it: a woman on a horse riding badly and fast, and something beside her, walking, keeping up. Sethand would not cross its line. You are being sent to stand on it.`],
    go:'Into the hills', node:'c5_start'},

  areas:[
    /* 16 columns x 12 rows.  . grass  , scrub  r rock  M barrow stone  # cliff / drop  x Rhivi marker-stake  > exit east (to the vale) */
    { id:'hills_ridge', title:'The Gadrobi Hills · the long ridge', sub:'Day · the third day out', hint:'Tap ground to move · tap a figure to talk · stay below the skyline · the vale is east', decor:'hills',
      map:[ "################",
            "#,,..r...,..M..#",
            "#.,....,...MM,.#",
            "#..x......,....#",
            "#,....M.....r..#",
            "#..,..MM.......#",
            "#.........,....>",
            "#.r....,...x...#",
            "#,...,....M....#",
            "#..#.......MM,.#",
            "#,,##..,.....,,#",
            "################" ],
      walk:'.,><', triggers:{'>':'c5_to_vale'}, start:{x:2,y:6},
      npcs:[ {id:'sethand', name:'Sethand', kind:'rhivi', x:8, y:5, still:true, node:()=>S.f.c5_seth ? 'c5_seth_again' : 'c5_seth', fresh:()=>!S.f.c5_seth},
             {id:'outrider', name:'A Rhivi outrider', kind:'rhivi', x:13, y:3, still:true, node:()=>'c5_outrider', fresh:()=>!S.f.c5_outrider},
             {id:'crone', name:'A raven on a stone', kind:'crone', x:9, y:8, still:true, node:()=>S.f.c5_crone ? 'c5_crone_again' : 'c5_crone', show:()=>!!S.f.c5_seth, fresh:()=>!S.f.c5_crone} ] },

    /* . grass  , the dig / turned earth  r rock  M barrow stone (the ring)  # drop  < exit west (the ridge)  > exit east (the far hill; after dark, the rent) */
    { id:'barrow_vale', title:'The Gadrobi Hills · the barrow vale', sub:'Dusk · the long barrow', hint:'Tap ground to move · tap a figure to talk · do not go near the Adjunct · west is the ridge', decor:'hills_dusk',
      map:[ "################",
            "#..r.....,,....#",
            "#....MMMMMM....#",
            "#...M,,,,,,M...#",
            "#..M,,,,,,,,M..#",
            "#...M,,,,,,M.r.#",
            "<....MM,,MM....>",
            "#.r.....,......#",
            "#.....r....,...#",
            "#..,.......r...#",
            "#.,,...r.....,.#",
            "################" ],
      walk:'.,><', triggers:{'>':'c5_vale_east', '<':'c5_back_ridge'}, start:{x:1,y:6},
      npcs:[ {id:'lorn', name:'The Adjunct', kind:'lorn', x:13, y:2, still:true, node:()=>S.f.c5_wardsFought ? 'c5_lorn_after' : 'c5_lorn', show:()=>!S.f.c5_night, fresh:()=>S.f.c5_wardsFought ? !S.f.c5_lornAfter : !S.f.c5_lorn},
             {id:'tool', name:'A thing of bone and hide', kind:'tool', x:7, y:4, still:true, node:()=>S.f.c5_wardsFought ? 'c5_tool_after' : 'c5_tool', show:()=>!S.f.c5_night, fresh:()=>!S.f.c5_wardsFought},
             {id:'toc', name:'Toc the Younger', kind:'toc', x:4, y:8, node:()=>S.f.c5_toc ? 'c5_toc_again' : 'c5_toc', show:()=>!!S.f.c5_wardsFought && !S.f.c5_night, fresh:()=>!S.f.c5_toc},
             {id:'paran', name:'Captain Paran', kind:'paran', x:5, y:9, still:true, node:()=>S.f.c5_paran ? 'c5_paran_again' : S.f.c5_toc ? 'c5_paran' : 'c5_toc', show:()=>!!S.f.c5_wardsFought && !S.f.c5_night, fresh:()=>!S.f.c5_paran} ] },

    /* the same vale after the Adjunct has gone: night, nobody left in it but the Fourth. Entered from c5_nightfall. */
    { id:'barrow_night', title:'The Gadrobi Hills · the barrow vale', sub:'Night · the long barrow', hint:'Tap ground to move · east, past the dig, to Paran\'s fire', decor:'hills_night',
      map:[ "################",
            "#..r.....,,....#",
            "#....MMMMMM....#",
            "#...M,,,,,,M...#",
            "#..M,,,,,,,,M..#",
            "#...M,,,,,,M.r.#",
            "<....MM,,MM....>",
            "#.r.....,......#",
            "#.....r....,...#",
            "#..,.......r...#",
            "#.,,...r.....,.#",
            "################" ],
      walk:'.,><', triggers:{'>':'c5_vale_east', '<':'c5_back_ridge'}, start:{x:3,y:7}, npcs:[] } ],

  /* quest lines for the areas above (they take the place of the engine's QUESTS entries for these ids) */
  quests:{
    hills_ridge:()=> !S.f.c5_seth ? 'Talk to the Rhivi on the ridge' : !S.f.c5_edgeDone ? 'The east edge. Look into the vale. Don\'t be seen.' : !S.f.c5_valeSeen ? 'Dusk. East, down into the vale.' : 'East, back down to the barrow vale',
    barrow_vale:()=> S.f.c5_key ? 'Dawn. Paran rides for the city.' : S.f.c5_night ? 'Night. East, past the dig, to Paran\'s fire.' : S.f.c5_paran ? 'The captain, by his horse. He hasn\'t finished with you.' : S.f.c5_wardsFought ? 'Two riders at the edge of the dead ground' : 'The Adjunct and the Imass. Watch.',
    barrow_night:()=> 'Night. East, past the dig, to Paran\'s fire.' },

  battles:{
    barrow_wards:{title:'The ridge of small barrows', warrenText:'Otataral somewhere below · Meanas thin as old cloth · Denul holds, barely', warren:{meanas:0.7,denul:0.8}, dark:true, music:'dark', open:true,
      map:["#..##..#","........","..#..#..","........","...,,...",".#....#.","........","........","..,..,..","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['wight',1,1],['wight',6,1],['wight',3,3],['ward',4,1]], xp:220, after:'c5_after_wards'},
    the_rent:{title:'The hillside under the rent', warrenText:'A wound in the world · Meanas howls through it · Denul gutters · something smells of Chaos', warren:{meanas:1.6,denul:0.7}, dark:true, music:'dark', open:true,
      map:["...##...","........",".#....#.","........","..,..,..","........","#......#","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['shade',2,1],['shade',5,1],['warrenspawn',3,1]], xp:240, after:'c5_after_rent',
      objective:{type:'survive', rounds:3, text:'Hold the hillside. Three rounds.'},
      waves:[{round:2, foes:[['shade',1,0],['shade',6,0]], text:'More of them come through the grey behind the first. And behind them, far off and coming closer, the sound of dogs.'}] } },

  foes:{ ward:{name:'Jaghut ward', sig:'J', hp:30, ac:15, atk:6, dmg:[1,10,3], rng:1, mv:3, init:1, boss:true, verb:'grinds against'},
         warrenspawn:{name:'Warren-spawn', sig:'W', hp:18, ac:14, atk:6, dmg:[2,4,2], rng:1, mv:6, init:5, verb:'unfolds onto'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    rhivicharm:{name:'Rhivi bone charm', slot:'trinket', who:null, stat:{wits:1}, line:'A knuckle-bone, a horse\'s, bored through and strung on plaited hair, with a single blue bead. The Rhivi hang them on children so the grass will know whose they are. Sethand did not say whose this was. He tied it on your wrist himself, and pulled the knot tight with his teeth.'},
    barrowflint:{name:'Barrow-flint blade', slot:'weapon', who:['sgt','brisk','kettle','ellis'], atk:1, line:'A leaf of grey flint the length of a forearm, knapped so fine the edge is translucent, bound to an antler haft with sinew that should have rotted before the Empire had a name. It came up out of a barrow on the ridge in a dead hand. It still cuts. It cuts better than your sword.'},
    otatglove:{name:'Otataral-dusted glove', slot:'trinket', who:['sgt','brisk'], ac:1, line:'A plain riding glove, left on a stone where the Adjunct\'s tent stood. There is a fine red dust worked into the seams that will not brush out. Sorcery slides off the hand in it like rain off oilcloth: a mage\'s working will find the glove and forget what it was for. Tuft will not stand on the same side of the fire as it.'},
    scoutcloak:{name:'Malazan scout\'s cloak', slot:'armour', who:['ellis','kettle','sgt'], ac:1, line:'Second Army issue, grey-green, rolled tight behind a saddle and strapped with a scout\'s knot. Toc\'s. The horse came back without him before dawn, lathered, and stood by the Fourth\'s fire because it had nowhere else to stand.'} },

  card:{ id:'herald', name:'Herald of High House Death', house:'High House Death', hue:'#8fa38a',
    txt:`A grey figure with its face turned away, holding a door open for somebody you cannot see. Tuft has turned it before, over the years, and never liked it. "Not for us," she says. "For someone near us. It always says that. I'd like it to stop."`,
    fx:'Once a fight, a squadmate who would go down stays standing at 1 health.' },

  dlg:{
    /* ---- opening: the vault, three days ago, and the road east ---- */
    c5_start:()=>({sp:'Whiskeyjack · Bridgeburners', scene:'cellar', fx:()=>{ S.f.c5_briefed=1; }, txt:
`Three days ago. The vault under the crossing, the lantern on its crate, the pipes hissing on every side like a room full of kettles nobody will take off the fire.

Whiskeyjack is sitting this time, on a munitions crate with the seal broken, and there is a map on his knee that is mostly blank. Kalam is not here. Quick Ben is not here. Nobody says where they are, and the not-saying has a shape, the way a missing tooth has a shape.

"The dust-line," Whiskeyjack says. "On the plain. ${S.f.c2_sethDust || S.f.c2_sethDustNight || S.f.c2_hillsDust ? `You reported it.` : `You'll have seen it. Your Rhivi guide knew what it was; the Rhivi generally do.`} A woman on a horse and something walking beside her." He taps the blank part of the map. "The woman's the Adjunct. Lorn. The thing beside her is a T'lan Imass. They're in the Gadrobi Hills, east of the city, and they're digging."

He lets that sit in the lantern light.

"You found her once without meaning to. Find her again on purpose. Watch. Don't be seen." The grey eyes come up off the map. "If she sees you, you're dead, and so is the mission, so be dead somewhere else."

${S.f.c4_key === 'shield' ? `A pause. "You stood in front of a Tiste Andii on a roof. I'd like you not to stand in front of anything out there. You're eyes. Eyes don't have shields."` : S.f.c4_key === 'aside' ? `A pause. "You stood aside on the roof when I told you to watch. I know what that cost. I'm asking you to do it again, for longer, in the open. I'm sorry for it. I'm asking anyway."` : `A pause, in which he doesn't say why it's you, and you understand that it's because you're the only squad he has that isn't under the city or on a roof or somewhere he won't name.`}`,
      ch:[{t:'"What are they digging for, sir?"', go:'c5_start_why'},
          {t:'"Kettle wants to know about the cusser."', req:()=>SQUAD().includes('kettle'), go:'c5_start_kettle'},
          {t:'"Sir."', go:'c5_road'}]}),
    c5_start_why:()=>({sp:'Whiskeyjack', scene:'cellar', fx:()=>{ S.f.c5_askWhy=1; }, txt:
`"I don't know." He says it plainly, the way he said *I know* on the roof, as a fact about the weather. "Something old. Something the Empress would rather have than not. An Adjunct doesn't go into the hills with a T'lan Imass to pick mushrooms."

He folds the map. It's easier to fold when it's mostly blank.

"Here's what I know about T'lan Imass, Sergeant, and then you'll know it too. They're dead. They've been dead longer than there's been a word for *long*. They don't sleep, they don't eat, they don't get tired, and they don't forget. The Empire has an army of them somewhere in Seven Cities, and every soldier who's ever marched next to one of them has come back quieter." A breath. "If it looks at you, don't look back. Not because it'll hurt you. Because you'll spend the rest of your life trying to work out what it saw."

${SQUAD().includes('ohl') ? `Ohl, behind you, very quietly: "I marched beside them once. Aren. A column of them went past the hospital tents." He doesn't say any more. He doesn't need to. He is quieter, and he was never loud.` : ''}`,
      ch:[{t:'"Kettle wants to know about the cusser."', req:()=>SQUAD().includes('kettle') && !S.f.c5_askCusser, go:'c5_start_kettle'},
          {t:'"Sir."', go:'c5_road'}]}),
    c5_start_kettle:()=>({sp:'Kettle', scene:'cellar', fx:()=>{ S.f.c5_askCusser=1; }, txt:
`Kettle has been waiting for this with the satchel in her lap and both arms round it, like a child with a cat.

"Sir." She's never called him *sir* in her life. "Fiddler said no cussers on the roofs. I didn't. I had it in my hand and I put it back. I'm asking. The hills. Are there gas pipes in the hills?"

Whiskeyjack looks at her for as long as it takes the pipes to hiss twice. Something at the corner of his mouth does nothing, very carefully.

"There's no gas in the hills," he says. "There's grass, and sheep, and stones, and an Adjunct of the Empire. Don't throw it at the Adjunct."

"No, sir."

"Throw it at anything else you like."

${S.inv.cusser > 0 ? `Kettle doesn't say anything. She puts her face down against the satchel flap, just for a moment, the way you'd rest your cheek on a horse's neck. When she lifts it again her eyes are very bright. "${['One', 'Two', 'Three'][Math.min(S.inv.cusser, 3) - 1]} of them," she says, to the satchel. "*Two years.* You hear that? Somebody finally said yes."` : `Kettle opens the satchel and looks into it and shuts it again. "I haven't got one," she says. "I haven't *got* one, sir. Hood's breath." She looks as if she might cry. She doesn't. Kettle doesn't. "Somebody says yes and I've got *sharpers*."`}`,
      ch:[{t:'"What are they digging for, sir?"', req:()=>!S.f.c5_askWhy, fx:()=>{S.f.c5_askWhy=1;}, go:'c5_start_why'},
          {t:'"Sir."', go:'c5_road'}]}),
    c5_road:()=>({sp:'The road east', scene:'hills', txt:
`${SQUAD().includes('ellis') ? `Ellis finds you at the ladder as the squad goes up. She has her glove pulled tight at the wrist.

"Lorn," she says. Only that, at first. Then: "I carried a letter to her once. Genabaris, three years ago. She took it without looking at me and read it standing, and when she'd read it she looked at me for the first time, and I understood that she was deciding whether I'd read it too." A breath. "I hadn't. She believed me. I've never been so glad to be believed." She goes up the ladder ahead of you. "She has a sword. You'll know it when you're near it. Everyone does."

` : ''}Three days of it, then. Out through the Gadrobi Gate, east, on foot, with the packs and no wagon, because a wagon is a thing an Adjunct can see from a hill.

The first day the hills are just hills. The second day the stones start: one on a crest, then three, then a line of them along a ridge like the back of a buried animal. The sheep go round them. The squad goes round them too, after Brisk watches the sheep for a while and says nothing and leads the way the sheep went.

The third morning, from the top of a long brown ridge, you see smoke. Not a lot. A thin grey thread, going straight up in the still air two valleys east, and under it, small as a flea on a blanket, a tent.

${SQUAD().includes('tuft') ? `Tuft stops dead. She puts a hand to her ear as if she'd heard something, and then takes it away, and looks at it. "Sergeant," she says. "Something's wrong with Meanas. It's *thin*. Like a coat worn through at the elbow." She tries a small working, a shadow round her fingers; it comes, and it's weak, and it goes out. "That's the far side of two valleys. Two valleys, and I can feel it from here."` : ''}

And on this ridge, you are not alone. There are stakes driven into the turf, with rags on them. Rhivi marker-stakes, a long way from the plain.`,
      ch:[{t:'Keep below the skyline.', go:()=>{ startExplore('hills_ridge'); }}]}),

    /* ---- the ridge: Sethand ---- */
    c5_seth:()=>({sp:'Sethand · Rhivi', fx:()=>{ S.f.c5_seth=1; }, txt:
`He is sitting on his heels in the lee of a barrow-stone with his horse's reins looped round his wrist, and he has been watching you come along the ridge for, you'd guess, the better part of an hour. His face does nothing when you reach him. It does nothing very deliberately, which is how you know he is surprised.

"Malazan." The *tide* voice. "You are a long way from your city. I am a long way from my grass. One of us is lost."

There are six Rhivi on the ridge besides him, lying flat along the crest with their horses hobbled below it. They have been here days. You can tell from the grass.

${S.f.c2_outFought ? `He doesn't stand. He doesn't offer water. He looks at you the way he looked at the barrows on the plain: without looking, which is a kind of looking. "There is Rhivi blood on the grass by the fourth camp," he says. "The clans remember whose. I remember. I am telling you so you do not think I have forgotten because I am being polite."` : S.f.c2_key === 'light' ? `He stands, which he did not do for Malazans on the plain. "The Rhivi know what the Fourth saw at the ashes," he says. "You went to the fire and stood on the glass while the dead were still warm, and you did not take anything, and you did not ask twice." A pause, in which something is weighed. "The Mhybe says you may live. I tell you this because it was not a small thing for her to say, and it is not a small thing for me to repeat."${S.f.c2_outSeth ? ` A breath. "You still owe me the thing you will not be able to pay. I have not come for it. I am telling you so you will know I have not forgotten where it is."` : ''}` : `He doesn't stand, but he moves over, so that there is room in the lee of the stone for a Malazan to sit if a Malazan wished to. "You kept your road on the plain," he says. "You counted your bread and went east. The clans say that is what Malazans are for. I am not sure yet that they are wrong."`}`,
      ch:[{t:'"The dust-line. Is it here?"', go:'c5_seth_dust'},
          {t:'"What are the Rhivi doing in the hills?"', go:'c5_seth_bundle'},
          {t:'Sit in the lee of the stone and say nothing.', req:()=>!S.f.c2_outFought, fx:()=>{ S.f.c5_sethSat=1; }, go:'c5_seth_sit'}]}),
    c5_seth_dust:()=>({sp:'Sethand', fx:()=>{ S.f.c5_sethDust=1; }, txt:
`He looks east, toward the thread of smoke, with his hand flat over his eyes although the sun is at his back. He did that on the plain too. You think now that it isn't for the sun.

"The woman and the thing that is not a man," he says. He says it as if it were one word, a name, the way the clans must say it now round their fires. "Yes. Two valleys. They came ten days ago. The woman made a camp and the thing did not; it has not sat down since it came, and it has not slept, and it has walked the long barrow in the vale from end to end, forty times, slowly, with its head down, like a man looking for a coin he dropped in the grass."

"Six days ago it stopped walking. It knelt at the east end and put its hands flat on the ground." His own hands are flat on his knees. He has made them be. "Since then it has been digging. With its hands. It does not tire. The earth comes away from it the way water comes away from a stone."

"There is something in that barrow that was put there before the Rhivi. Before the grass. The people who put it there had grey skin and tusks and hated each other very much, and they put it there because they hated it more." He lowers his hand. "The thing that is not a man was made to hunt them. It has come a long way to open that hill. I would like very much to know why, and I will not go and ask."`,
      ch:[{t:'"What are the Rhivi doing here?"', req:()=>!S.f.c5_sethBundle, go:'c5_seth_bundle'},
          {t:'"Thank you, Sethand."', go:'c5_seth_again'}]}),
    c5_seth_bundle:()=>({sp:'Sethand', fx:()=>{ S.f.c5_sethBundle=1; }, txt:
`"Watching." He doesn't pretend otherwise. "The same as you. For the same reason, I think, but we are not going to tell each other that."

Down below the crest, among the hobbled horses, one of the Rhivi is sitting with something across her knees. It's wrapped in a horse-blanket, and over the blanket a hide, and over the hide a second blanket, the good red Rhivi wool, bound with plaited hair in three places. She isn't holding it the way you hold baggage. She has one hand flat on top of it, and she doesn't take the hand away, and she doesn't take her eyes off the smoke in the east.

${S.f.c2_key === 'light' ? `You've seen that bundle before. Or its shape. On the glass, on the plain, in an old woman's arms.` : `You've never seen it before. You find you don't want to look at it for long, and you couldn't have said why.`}

${S.f.c2_key === 'light' ? `Sethand watches you see it. "Yes," he says. "You were there. You know what I will not tell you, or you know the shape of it. The Mhybe sent it with us because she would not let it be anywhere she could not send it. It is ours. It is going home, by a long road. It wanted to come this way." A pause. "I did not say *wanted*. You did not hear me say it."` : `Sethand watches you look at it. "Do not ask," he says. "The night the light came down in the west, the plain found a thing in the fire. It is ours, and it goes where the Mhybe sends it, and she sent it here." His hands are still. "She did not say why. It is the first time in my life she has not said why."`}

${SQUAD().includes('tuft') ? `Tuft is looking at the bundle too. She's gone pale, and then paler, and then she turns her back on it, deliberately, the way she turns her back on things she is listening to. "Sergeant," she says, very quietly, "don't let me go near that." You've never heard her ask for anything in that voice.` : ''}`,
      ch:[{t:'"The dust-line."', req:()=>!S.f.c5_sethDust, go:'c5_seth_dust'},
          {t:'"We didn\'t see it."', go:'c5_seth_again'}]}),
    c5_seth_sit:()=>({sp:'Sethand', fx:()=>{ gain('rhivicharm'); }, txt:
`You sit. The stone is warm on the sun side and cold on the other, and the lee is the cold side. Sethand says nothing. You say nothing. Below the crest a horse blows. Up here the wind moves the grass the way a hand moves over a dog's back, the whole ridge at once, and then lets it lie.

After a long time he reaches into his shirt and takes out something small on a cord. A horse's knuckle-bone, bored through, with a blue bead.

"Give me your hand."

You give it to him. He ties it round your wrist, and pulls the knot tight with his teeth, the way you'd tie off a bandage, and lets go.

"The grass knows whose that is now," he says, to the east. "It will not help you. It will know, if something happens to you on it, whose you were. That is all the Rhivi can do for a Malazan in these hills." A pause. "It is not nothing."

${(S.f.c2_sethTrust || 0) >= 2 ? `"You said my name at the Mhybe's fires?" he asks, and then, before you can answer: "No. You did not come by the fires. You came by *me*. That will do."` : `He doesn't say anything else. He has said, by his count, a great deal.`}`,
      ch:[{t:'"The dust-line."', req:()=>!S.f.c5_sethDust, go:'c5_seth_dust'},
          {t:'"What are the Rhivi doing here?"', req:()=>!S.f.c5_sethBundle, go:'c5_seth_bundle'},
          {t:'Get up.', go:()=>startExplore()}]}),
    c5_seth_again:()=>({sp:'Sethand', txt:
`${S.f.c2_outFought ? `He's watching the smoke. "Malazan." Only that. It's cold, and it isn't unkind. It's the voice you'd use for weather you did not ask for.` : `He's watching the smoke. "Malazan. There is still room by the stone."`}

${S.f.c5_edgeDone ? `"You went to the east edge," he adds, without turning his head. "${S.f.c5_spotted ? `The thing that is not a man turned its head. I saw it from here. It turned it back. I do not know which of those I like less.` : `Nothing turned its head. Good. You are lighter on your feet than you look, for a people who wear iron hats.`}"` : `"If you are going to look into that vale, go to the east edge and lie down before you get there, and look with one eye. The thing that is not a man does not see the way we see. It sees the way the barrows see. Do not be *interesting* to it."`}`,
      ch:[{t:'"The dust-line."', req:()=>!S.f.c5_sethDust, go:'c5_seth_dust'},
          {t:'"What are the Rhivi doing here?"', req:()=>!S.f.c5_sethBundle, go:'c5_seth_bundle'},
          {t:'Sit in the lee of the stone.', req:()=>!S.f.c2_outFought && !S.f.c5_sethSat, fx:()=>{ S.f.c5_sethSat=1; }, go:'c5_seth_sit'},
          {t:'Leave him to the smoke.'}]}),

    /* ---- the ridge: a Rhivi outrider ---- */
    c5_outrider:()=>({sp:'A Rhivi outrider', fx:()=>{ S.f.c5_outrider=1; }, txt:
`A boy. Fifteen, sixteen; the Rhivi start them young and the plain finishes them fast. He's lying flat on the crest with a horn bow under him so it won't catch the light, and he doesn't get up when you crawl alongside, and he doesn't look at you. He's looking at the vale.

"Malazan," he says, in a Malazan he has learned from people shouting it. Then, in Rhivi, something short. Then, because you clearly didn't follow, he points with his chin: at the smoke, at the tent, at the long low hill in the vale beyond with a black wound opened in one end of it.

"She kill my cousin," he says. "Third day. On the plain. He see her. She see him see her." He mimes it: a hand, a sword, a very short movement. "The thing, it stand there. It not help her. It not *need*." He's quiet for a moment. "Sethand say, watch. So I watch. I watch very good."

${S.f.c2_outFought ? `He looks at you then, for the first time, and his eyes go over your kit and stop on the squad badge. "Fourth," he says. He knows the word. Someone has taught it to him, recently, and not kindly. He looks back at the vale and doesn't speak again.` : `He looks at you then, for the first time. "You go close?" You nod. He thinks about it. "Stay low. Stay *low*, Malazan. The thing, it look at the ground more than the sky. It look at the ground like it hear it."`}`,
      ch:[{t:'Leave him to his watching.'}]}),

    /* ---- the ridge: Crone ---- */
    c5_crone:()=>({sp:'Crone · Great Raven', fx:()=>{ S.f.c5_crone=1; }, txt:
`It's on a barrow-stone, the tallest on the ridge, as if the stone had been set there to hold it. The size of a dog. Black, and the black has grey in it now at the throat, like an old woman's hair under a shawl. It watches you come the way a merchant watches a customer who has not got enough money.

Then it opens its beak and laughs.

"${S.f.c2_croneSaw ? `Sergeant {sgt}! Ha! I said you'd be late, and here you are, *early*, on the wrong hill, lying on your belly in the sheep-dung with the Rhivi. Oh, I do love a Malazan who cannot read a map.` : `Malazans! Ha! On a hill! Lying on their bellies in the sheep-dung with the Rhivi, watching a hole. Oh, I have seen armies do stupider things, but never on purpose.`}"

It shifts from foot to foot on the stone, settling its feathers. The Rhivi on the crest don't look round. They have decided, collectively and without discussion, that there is no raven.

"${S.f.c2_croneSaw ? `You remember my name, and I remember yours. That is how it is with ravens and soldiers, except that we go on remembering, and we are *so* good at remembering what you were called.` : `Crone, little soldiers, in case you had forgotten. You told me to get off your wagon, on the plain, and I got off it. I have been wondering ever since what you would tell me to get off on a hill.`}"`,
      ch:[{t:'"What\'s in the hill?"', go:'c5_crone_rake'},
          {t:'"What does your lord want here?"', go:'c5_crone_rake'},
          {t:'"Get off the stone. You\'ll give us away."', fx:()=>{ if (SQUAD().includes('brisk')) loy('brisk',1); }, go:'c5_crone_off'}]}),
    c5_crone_rake:()=>({sp:'Crone', fx:()=>{ S.f.c5_croneRake=1; }, txt:
`"Ha!" It cocks its head so far that one eye looks straight up at the sky and the other straight down at you. "Questions! The soldier on its belly has questions. As if I'd know. As if I'd *say*."

It tells you anyway. Ravens can't help it; it's why they're kept.

"A tyrant, child. A Jaghut. One of the old ones, the ones who were kings when kings meant something, which is to say when they meant *everyone else is dead*. He was put in that hill by his own kind and they sat on the lid, and then they went away and died out, and the lid has been sitting on itself ever since." It preens. "And now a bag of bones with a flint sword is taking the lid off, for a woman who carries a hole in the world on her hip, for an Empress who wants a tyrant of her own. Oh, it is *so* Malazan."

"My lord is *interested* in that hill." It says the word the way you'd say the name of a very sharp knife. "Anomander Rake does not get interested often. When he does, things change shape. Cities. Continents. Soldiers." It looks you over, from boots to helm, slowly. "I came to see what shape things will be. I will tell him you were here. He will not care. That is the kindest thing I can promise you."

And then it laughs, and laughs, the cracked crow's laugh going out over the ridge and the vale and the thread of smoke, and not one of the Rhivi turns round.`,
      ch:[{t:'"Get off the stone."', go:'c5_crone_off'}]}),
    c5_crone_off:()=>({sp:'Crone', txt:
`"*Manners!*" But it goes: a heave of wings that throws the grass flat and sets one of the hobbled horses below the crest dancing, and then it's above you, and above the ridge, circling once, far too big and far too slow, the wrong shape for a bird.

It doesn't go east, over the vale, as you'd feared. It goes up. Up and up, until it's a speck, and then it's a speck that stays, a black mote hung in the pale sky over the Gadrobi Hills, watching.

${SQUAD().includes('ellis') ? `Ellis, lying on her back in the grass, squinting at it: "It'll stay up there all day. A raven that size, that high. The Adjunct's going to see it." A pause. "She'll know whose it is. She won't know it's anything to do with us. That's the best cover I've ever had. I hate it."` : `Kettle, lying on her back in the grass, squinting at it: "Can I shoot it?" Brisk: "No." Kettle: "Can I *want* to shoot it?" Brisk thinks about this. "Yes."`}`,
      ch:[{t:'Back to the ridge.', go:()=>startExplore()}]}),
    c5_crone_again:()=>({sp:'A speck in the sky', txt:
`${S.f.c5_night ? `The sky over the ridge is black and full of stars and there's no speck in it. You have the strong impression that there's a raven in it anyway.` : `The raven is a black mote high over the ridge. It hasn't moved in an hour. Once, very faintly, carried down on the wind from a height no bird should reach, you hear it laugh.`}`,
      ch:[{t:'Leave it.'}]}),

    /* ---- exit east: the edge, Tuft's draw, the vale ---- */
    c5_to_vale:()=> !S.f.c5_seth ? {sp:'The east edge', txt:
`The ridge runs out eastward into a steep brown fall, and below it the vale, and the smoke. You could go now.

Behind you, a Rhivi in the lee of a barrow-stone is watching you with the patience of weather. He's been here days. He'll know things. Whiskeyjack sent you to watch; he didn't say you couldn't ask someone who'd already been watching.`,
      ch:[{t:'Not yet. Talk to the Rhivi first.'}]} : !S.f.c5_edgeDone ? {sp:'The east edge', txt:
`You go the last fifty paces on your belly, the way the outrider showed you, with the grass in your mouth and the sheep-dung under your elbows, and at the lip of the ridge you stop, and put one eye over.

The vale. A long low hill running down the middle of it, too regular to be a hill, grassed over, with a ring of standing stones round the near end like the fingers of a buried hand. At the far end, the earth has been opened: a black wound in the brown, with the spoil heaped either side of it. A tent. A picketed horse. A thin grey thread of smoke.

Nobody moving. That's the first thing you see, and it's wrong, because somebody has to be moving; the smoke doesn't feed itself.

${SQUAD().includes('ellis') ? `Ellis is beside you. You didn't hear her come. "Tent's empty," she breathes. "Horse is resting a hind foot. Nobody's near it. Nobody's been near it an hour." A pause. "Look at the dig, Sergeant. Not the tent. The *dig*."` : `Kettle is beside you, breathing through her teeth. "Tent," she whispers. "Horse. Fire. Nobody." A pause. "Nobody's a lot of people not to see."`}`,
      ch:[{t:'Look at the dig. Carefully.', fx:()=>{ S.f.c5_edgeDone=1; }, check:['wits',13], go:'c5_edge_ok', fail:'c5_edge_fail'}]} : (SQUAD().includes('tuft') && !S.f.c5_drawn && !S.f.c5_noCard) ? {sp:'Tuft', scene:'hills_dusk', txt:
`Dusk comes up out of the vale before it comes down out of the sky. The long barrow goes grey, then blue, then a colour that isn't one. The smoke goes on going straight up.

Tuft is sitting with her back against a barrow-stone on the lip of the ridge, where she can't see the vale and it can't see her. She has the Deck in her lap. She hasn't taken a card. Her face is grey, and there's sweat on her upper lip, though the air has gone cold.

"It's down there," she says, before you ask. "Whatever the Adjunct carries. I can feel it from here. It's like — Sergeant, it's like standing at the edge of a well at night and knowing the well goes all the way through the world and out the other side. Meanas doesn't *fade* near it. It *stops*. There's a hole." She swallows. "I want one card before we go down. One. So I'll know I can still see *something*."`,
      ch:[{t:'Let her draw.', fx:()=>{ S.f.c5_drawn=1; S.card = ['herald','herald','obelisk','hounds','knight','oponn'][R(6)]; S.f.c5_drawnCard = S.card; }, go:()=>cardSequence(()=>talk('c5_card'))},
          {t:'"No readings. Not this close to her."', fx:()=>{ S.f.c5_noCard=1; loy('tuft',-1); if (SQUAD().includes('brisk')) loy('brisk',1); }, go:'c5_card_no'}]} : {sp:'The east edge', txt:
`${S.f.c5_valeSeen ? `The steep brown fall into the vale, and the long barrow, and the smoke.` : `The steep brown fall into the vale. Dusk is coming up out of it like water into a footprint.`}`,
      ch:[{t:'Down into the vale.', go:()=>{ startExplore('barrow_vale'); if (!S.f.c5_valeSeen) talk('c5_vale_arrive'); }},
          {t:'Not yet.'}]},
    c5_edge_ok:()=>({sp:'The east edge', txt:
`You look at the dig, and at first you see only earth, turned and heaped, black where it's fresh, and the long shadow of the barrow across it. And then a piece of the shadow moves.

It's kneeling in the wound at the east end of the barrow, down in the dark of the opened earth, with its back to you. A shape the colour of the earth it's kneeling in: dun hide, and bone showing through the hide at the shoulders, and a long bone-hilted something across its back that catches no light. It's digging with its hands. You watch it lift out a stone the size of a man's chest and set it aside, gently, as if it might wake something, and go back for the next.

It doesn't hurry. It doesn't stop. In the time it takes you to breathe out slowly, it moves more earth than Brisk could in a morning.

And on the far lip of the dig, standing, a woman. A dark cloak. Her back to you too. One hand resting on the hilt of a sword at her hip, the way you'd rest a hand on a dog's head. She's watching it dig. She has been, you think, all day.

You look for as long as you dare, and then you look for half a breath longer, and then you ease back down below the lip of the ridge, slowly, the way you'd back out of a room with a sleeping bear in it.

Nobody down there turned round.

${SQUAD().includes('tuft') ? `Tuft is lying in the grass behind you with her eyes shut. "Don't tell me," she says. "I know where she is. I can feel the edges of her from here. She's like a cold coin on your tongue."` : ''}`,
      ch:[{t:'Back from the edge.', go:()=>startExplore()}]}),
    c5_edge_fail:()=>({sp:'The east edge', fx:()=>{ S.f.c5_spotted=1; }, txt:
`You look at the dig and at first you see only earth, and the long shadow of the barrow across it, and you ease a little further over the lip to see into the dark of the opened end, and a stone turns under your elbow and goes rattling off down the fall.

Not far. Twenty paces. A small stone, into grass. The sound of it is nothing, the sound of a sheep shifting.

Down in the wound at the east end of the barrow, something stops digging.

You see it then. It's the colour of the earth. It's kneeling in the dig with its back to you: dun hide, bone at the shoulders where the hide has worn through, a long bone-hilted shape across its back. It has stopped with a stone the size of a man's chest in its hands. It stays like that for three heartbeats, holding the stone.

Then it turns its head.

Not its body. Only the head, on a neck that should not turn that far, and it's looking up the fall, at the ridge, at the lip, at the grass you're lying in. You can't see its eyes. You can see the places where eyes would be, if it had any: two pits of shadow in a face of hide and bone.

It looks for as long as it takes you to not breathe.

Then it turns its head back, and sets the stone down, gently, and goes on digging.

Nothing follows. No shout. The woman on the far lip of the dig doesn't turn round. Nothing comes up the hill. Nothing at all happens, and it goes on happening all the way back down the ridge, and it will go on happening all night.

${SQUAD().includes('brisk') ? `Brisk, when you're back below the crest: "It saw us." Flat. "It saw us and it didn't care." She puts her shield down in the grass, carefully. "I'd rather it cared."` : `Kettle, when you're back below the crest: "It *looked*." She's shaking. "It looked right at me and went back to its *hole*." She puts a hand on the satchel. "I'd rather it came up the hill. I know what to do if it comes up the hill."`}

Nobody in the Fourth is going to sleep tonight. You know it the way you know weather.`,
      ch:[{t:'Back from the edge.', go:()=>startExplore()}]}),
    c5_card:()=>{ const c = CARDS[S.card] || CARDS.oponn; return {sp:'The Deck of Dragons', scene:'hills_dusk', txt:
`Tuft lays the reading out on the flat of a barrow-stone, in the last of the light, with her body between the cards and the vale as if the vale might read them over her shoulder. Her hands are slow. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)}${c.fx ? ` · ${esc(c.fx)}` : ''}</div>`, oncard:[S.card || 'oponn',false],
      after:`${S.card === 'herald' ? `The Herald of High House Death. The grey figure with its face turned away, and the door, and whoever it's holding the door for.

Tuft looks at it for a long time. "This one," she says. "It keeps coming." She doesn't turn it face down. She leaves it face up on the barrow-stone, in the dusk, and looks at it, and then past it, east, at the vale. "It's not for us," she says. "It's never for us. It's for someone *near* us, and every time it comes, they're nearer."` : S.card === 'hounds' ? `${c.txt}

Tuft doesn't put it back. She holds it very still between two fingers. "Hounds," she says. "Out here. With *her* two valleys away." She looks at it as if it had said something rude. "Shadow doesn't come where there's otataral. It can't. So why is it in my hand?"` : `${c.txt}`}

${SQUAD().includes('ellis') ? `Ellis, who won't touch the Deck and has never yet missed a reading, has watched this one too. "Put them away," she says softly. "It's getting dark, and the dark's where we're going."` : `Kettle, softly: "Put them away, Tuft. It's getting dark."`}`,
      ch:[{t:'Down into the vale.', go:()=>{ startExplore('barrow_vale'); talk('c5_vale_arrive'); }}]}; },
    c5_card_no:()=>({sp:'Tuft', scene:'hills_dusk', txt:
`She doesn't argue. She squares the Deck against her knee and puts it back in her sleeve, and sits for a moment with her hand over the sleeve as if keeping something warm.

"Yes, Sergeant."

${S.f.c4_noCard || S.f.c3_noCard || S.f.c2_noCard ? `She doesn't say anything about the other times. She doesn't look at you. She looks east, at the vale going blue in the dusk, the way you'd look at a door you'd been told not to open, and then she gets up.` : `"You're probably right," she says, getting up. "It'd have been a blank card. Near her, they'd all be blank." She tries to smile. "I just wanted to see it be blank."`}`,
      ch:[{t:'Down into the vale.', go:()=>{ startExplore('barrow_vale'); talk('c5_vale_arrive'); }}]}),

    /* ---- the vale ---- */
    c5_vale_arrive:()=>({sp:'The barrow vale', scene:'hills_dusk', fx:()=>{ S.f.c5_valeSeen=1; }, txt:
`Down the fall in the last of the light, one at a time, on your heels and your hands, with the scree going out from under you in little whispering runs that sound, every one, like a shout. At the bottom, a fold of dead ground, and along the fold a second, lower ridge: a line of small barrows, knee-high, grassed over, like the long barrow's children put to bed in a row. You settle the squad among them. It's the only cover in the vale.

From here you can see all of it. The long barrow, stretching away east. The ring of stones round its near end, leaning, cracked, furred with a grey lichen that is not quite the colour of lichen. The opened end, far off, black. The tent. The horse. The smoke.

And the cold.

It comes off the long barrow the way cold comes off a cellar door in summer. Not wind. The grass round the ring of stones is white at the tips. Frost, at dusk, with the day's warmth still in the ground.

${SQUAD().includes('tuft') ? `Tuft has her knees drawn up and her arms round them and her forehead on her arms. She's shivering, and it isn't the frost. "She's closer," she says into her knees. "I can't — Sergeant, I can't find the warren. I reach for it and my hand goes through where it should be. Like reaching for a stair in the dark that isn't there."` : ''}

${SQUAD().includes('ohl') ? `Ohl has his hand flat on the grass of the small barrow in front of him. He takes it away, and looks at it, and wipes it on his robe, slowly, the way he wipes his hands after the dead.` : ''}`,
      ch:[{t:'Watch.', go:()=>startExplore()}]}),

    /* ---- the Adjunct: never spoken to ---- */
    c5_lorn:()=>({sp:'The Adjunct', fx:()=>{ S.f.c5_lorn=1; }, txt:
`You don't go to her. You couldn't. You get as far as the end of the row of small barrows, where the dead ground runs out and the vale opens, and you stop there on your belly in the grass, three hundred paces off, and that's as close to the Adjunct of the Empress as you mean to get.

She's standing on the lip of the dig. A dark cloak, a plain grey tunic, riding boots. Short hair. A woman of no particular height, of no particular age, with a face that does nothing at all. She hasn't moved in the time it takes the light to go from red to grey. Her left hand is resting on the hilt of the sword at her hip.

It's a plain sword. A plain hilt, wrapped in plain leather. And you can *feel* it from here, the way you can feel a sheer drop behind you in the dark: not with your skin. With the part of you that knows where the edges of things are.

${SQUAD().includes('tuft') ? `Tuft has come after you, on her elbows, and she shouldn't have, and she's grey. Grey in the face, grey round the mouth, as if she'd been bled. Her lips are moving. You put your head down next to hers to hear.

"There's a hole in the world, Sergeant," she whispers, "and she's carrying it." Her breath is coming short. "Otataral. The sword's made of it. Or dusted with it, or — it doesn't matter. Anything that's magic goes *into* it and doesn't come out. Three hundred paces, and it's still too close. I can't feel Meanas at all. I can't feel *me*." Her hand has closed on your sleeve. "It's like being deaf. It's like waking up deaf. Please can we go back."` : `Nobody speaks. Brisk, beside you, has put her hand flat on the grass the way Ohl did, and taken it away again.`}

The Adjunct turns her head. Not toward you. Toward the long barrow, as if it had said something. She listens. Then she looks back at the dig, and her hand shifts on the hilt, very slightly, and settles.`,
      ch:[{t:'"Back. Now."', go:'c5_lorn_back'}]}),
    c5_lorn_back:()=>({sp:'The small barrows', txt:
`You go back along the row on your elbows, and every pace of it the thing in your chest that knows where the edges are eases by a hair, and by the time you're back among the small barrows it's only a cold weight, the kind you'd carry in a pocket.

${SQUAD().includes('tuft') ? `Tuft lies on her back in the grass with her eyes shut, breathing. After a while she holds her hand up in front of her face, and a little shadow comes and curls round her fingers, faint as smoke, and she lets out a sound that is almost a laugh and almost not.

"There," she says. "There you are." She lets the shadow go. "Sergeant, I'm not going that near that woman again. I want you to know that I'll go if you order it. I want you to know I'll be no use to you there at all. Not a shadow. Not a card. *Nothing*." A breath. "I've never been nothing before. I didn't know there was a place you could stand and be it."` : `Brisk says nothing all the way back. When you reach the barrows she sits down against one with her shield across her knees and looks at the far end of the vale for a long time. "A woman with a sword," she says at last. "That's all she is. I've stood in front of a hundred women with swords." She doesn't sound as if she believes it.`}

${SQUAD().includes('ellis') ? `Ellis, who has not moved from her place in the row: "Same face," she says quietly. "Genabaris. Three years. She hasn't aged a day, and she's older." She pulls her glove tighter. "That's what the Claw does to the ones at the top. It doesn't age you. It *files* you."` : ''}`,
      ch:[{t:'Watch the dig.', go:()=>startExplore()}]}),
    c5_lorn_after:()=>({sp:'The Adjunct', fx:()=>{ S.f.c5_lornAfter=1; }, txt:
`She's standing where she stood. The fight on the ridge of small barrows was three hundred paces from her, and loud, and short, and she has not come to look at it.

She looked, though. Once. When the ward went down. You saw her turn her head, and look along the vale at the row of small barrows, at the torn turf and the bodies that were already bodies before tonight, and at the Fourth, standing among them, breathing hard.

She looked at you the way you'd look at a smudge on a map. Something to be accounted for. Something that had been accounted for.

Then she turned back to the dig.

That is the whole of the Adjunct's opinion of the Fourth, and you understand, lying in the grass with your heart going, that it's the best opinion you could have hoped for.`,
      ch:[{t:'Leave her be.'}]}),

    /* ---- the T'lan Imass: the wards ---- */
    c5_tool:()=>({sp:'The long barrow', scene:'hills_dusk', txt:
`You don't go to it. You stay where you are among the small barrows, with the squad flat in the grass round you, and you watch, and it begins.

It comes up out of the dig. Slowly, the way a man climbs out of a ditch at the end of a long day, one hand on the lip, then the other. It stands. It's not tall. You'd thought it would be tall. It's shorter than Brisk and broader, and it stands the way a stone stands, with its weight all the way down in the ground. Dun hide stretched over bone. Hair, what's left of it, in a lank dark rope down its back. A face you can see now in the dusk, and would rather not: hide dried to the skull, the lips gone back from the teeth, and where the eyes were, two pits, and in each pit, very small, something that isn't light but is where light would be.

It draws the thing on its back. A sword. Grey flint, as long as your arm, knapped so fine that the dusk shows through its edge. It holds it point-down in front of it in both hands, and it walks, slowly, to the ring of standing stones at the near end of the barrow, and stops, in the middle, and stands.

The Adjunct has not moved. She's watching it. So are you.

It lifts its head, and speaks.

${SQUAD().includes('tuft') ? `Tuft grabs your wrist. Her fingers are like ice. "It's not talking to *her*," she breathes. "It's talking to the *hill*."` : `Kettle, beside you, very softly: "It's talking to the hill. Sergeant. It's talking to the *hill*."`}`,
      ch:[{t:'Listen.', go:'c5_tool_hill'}]}),
    c5_tool_hill:()=>({sp:'Onos T\'oolan · T\'lan Imass', scene:'hills_dusk', txt:
`The voice is dry. It's the voice of something that has not needed breath for a very long time and uses it now only as a courtesy, the way you'd put on a coat to visit a house where they keep coats on. It's slow. Every word is set down separately, exactly, like a stone in a wall.

"Raest."

The frost on the grass round the ring goes out from the stones in a long white breath.

"I am Onos T'oolan, of the Logros T'lan Imass. Once of the Tarad clan. I was a hunter of your kind before your kind had a name for us. I am the last of us who remembers your face." A pause, in which nothing moves in the whole of the vale. "Those who set you here are dust. Those who hunted you are dust, and walk. There is no one left to hate you, Tyrant, but me, and I have not the heart for it any more."

"I have come to open your door. I have not come to let you out. The difference will be of no comfort to you. It is of none to me."

He lifts the flint sword. Not high. Just to the level of his chest, point down, over the largest stone in the ring. He holds it there for the space of a long breath.

"Forgive me," says the T'lan Imass, to the hill.

And drives it down.

The sound isn't loud. It's the sound of a pane of ice breaking on a pond, far off, in a cold week. Then the sound of it again, and again, going round the ring, stone by stone, crack, crack, crack, like a man counting in a language made of breaking. The standing stones don't fall. They split, top to bottom, and out of the splits comes white, a breath of frost that rolls out across the vale and over the grass and up the slope toward you, and where it touches the row of small barrows the turf lifts.

Under you. Under the squad. Under the barrow in front of your face, the grass is lifting like a blanket over someone sitting up.`,
      ch:[{t:'"Up. Up! Off the barrows!"', go:'c5_wards'}]}),
    c5_wards:()=>({sp:'The small barrows', scene:'hills_dusk', txt:
`They come up out of the ground the way the dead come up in stories and never do in life: slowly, with the earth running off them. Three of them, out of three barrows, and they were men once, or something built like men, and they've been lying under the turf in the dark for longer than there have been Gadrobi. Black iron at their throats. Grey skin gone to leather. Their hands come up first, and then their heads, and then they stand, and turn their empty faces toward the squad with a patience that is worse than hurry.

And out of the fourth barrow, the long one at the end of the row, something that was never a man. It unfolds out of the earth like a cart being tipped. Stone, grey and slick with rime, and ice between the stones where joints would be, and cold coming off it in a wave you feel in your teeth. It has no face. It turns toward you anyway. It was set here to guard something, and the guarding has gone on without anyone to tell it to stop, and now it has been woken, and there's nobody left to guard against but you.

${SQUAD().includes('tuft') ? `"Jaghut," Tuft says. She's on her feet, and she's grey, and she's got a thread of shadow round one hand, thin as a hair. "A ward. A made thing. It's Omtose Phellack, Sergeant; it's *ice*, it's what they were—" The shadow flickers. "She's too close. I've got almost nothing."` : ''}

${SQUAD().includes('kettle') ? `Kettle has her hand in the satchel. She's looking at you. She's got a look on her face you've seen before, once, on a recruit at Nathilog, the morning he was told the leave had come through.` : ''}

Down in the vale, the Adjunct hasn't turned. The T'lan Imass is standing in the ring of split stones with its sword in the ground, and it's looking, you'd swear, at the hill, and not at you.`,
      ch:[{t:'"Kettle. Now."', req:()=>SQUAD().includes('kettle') && S.inv.cusser > 0, go:'c5_wards_cusser'},
          {t:'"Kettle. A sharper. Into the middle of them."', tag:'uses 1 sharper', req:()=>SQUAD().includes('kettle') && S.inv.cusser <= 0 && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('barrow_wards',{pre:'Kettle\'s sharper skips between the small barrows and goes off in the middle of them.'})},
          {t:'"Shields. Close up."', go:()=>startBattle('barrow_wards',{})}]}),
    c5_wards_cusser:()=>({sp:'Kettle', scene:'hills_dusk', txt:
`She has it out before you've finished the word. Round, clay-grey, the size of a man's head, with the Moranth seal on it in black wax. She's carried it since Nathilog. She carried it through the Pale and across the plain and under the city and up onto the roofs, and she's talked to it at night, and named it Maud, and been told no.

"No gas," she says. It isn't to you. "No roofs. No pipes. No *city*." She weighs it in her hands the way you'd weigh a newborn. "Just the hills, and a lot of old dead things, and a big ugly rock with ice in it."

She looks at you. You nod.

Kettle stands up out of the grass, in full view of the vale, in full view of the Adjunct of the Empress, and draws her arm back, and throws, overhand, long and high and perfect, a sapper's throw, the kind Chub taught her with three fingers.

"*Down!*"

${SQUAD().includes('brisk') ? `Brisk has her by the collar and on the ground before the cusser's at the top of its arc.` : `The squad goes down. Kettle goes down last, and slowest, because she wants to watch.`}`,
      ch:[{t:'—', fx:()=>{ S.inv.cusser -= 1; S.f.c5_cusserUsed=1; }, go:()=>startBattle('barrow_wards',{pre:'The cusser comes down in the middle of the small barrows, and the whole vale hears it.'})}]}),
    c5_after_wards:()=>({sp:'The small barrows', scene:'hills_dusk', fx:()=>{ S.f.c5_wardsFought=1; gain('barrowflint'); if (SQUAD().includes('kettle') && S.f.c5_cusserUsed) loy('kettle',1); }, txt:
`${S.f.c5_cusserUsed ? `You'll remember the cusser. Everyone in the vale will. It goes off in the middle of the small barrows with a sound that isn't a sound, that's a *shove*, a hand the size of a hill in the middle of your back, and the row of barrows goes up into the dusk in a fountain of turf and bone and frost, and comes down again for a long time afterwards, pattering, like rain after the rain. The stone thing is on its knees in the crater with one side of it gone. It gets up anyway.

The rest of it is shorter and uglier and yours.` : `It's short and ugly and cold. The dead fight the way the dead fight, without fear and without hurry, and the stone thing fights like a landslide with an opinion. Frost on your blade. Frost on your teeth.`} When it's done, the dead are dead again, properly this time, and the ward is a heap of split stone and grey slush steaming in the grass, and the Fourth is standing in a row of opened graves with its breath smoking, counting.

${SQUAD().length === 6 ? 'Six' : 'Five'}. You count twice.

One of the dead has let go of something. A leaf of grey flint the length of a forearm, on an antler haft, lying in the grass where its hand opened. The same work as the T'lan Imass's sword, or near it. You pick it up. The edge is so fine the last of the light shows through it.

${S.f.c5_cusserUsed ? `Kettle is sitting in the crater. She's sitting in it the way you'd sit in a bath. Soot to the eyebrows. Frost in her hair. She hasn't said a word. She's looking at the hole in the ground where the barrows were, and her mouth is open a little, and she looks about nine years old.` : ''}`,
      ch:[{t:'"Kettle."', req:()=>SQUAD().includes('kettle') && S.f.c5_cusserUsed, go:'c5_after_kettle'},
          {t:'Down in the vale, the T\'lan Imass is looking up the slope.', req:()=>!!S.f.c5_spotted, go:'c5_tool_look'},
          {t:'Look to the vale.', req:()=>!S.f.c5_spotted, go:'c5_riders'}]}),
    c5_after_kettle:()=>({sp:'Kettle', scene:'hills_dusk', txt:
`She doesn't look up when you crouch at the lip of the crater.

"Two years," she says. "Chub gave me that one at Nathilog. He said, *keep it for the one that matters, girl, you'll know it*. And I kept it. Every time. The Pale. The tunnels. The roof, with the knives coming, I had it in my *hand*." She holds up the hand. It's shaking. "I kept thinking, *this is it, this is the one that matters*, and every time it wasn't, and every time somebody said no."

She looks at the hole.

"It wasn't this one either," she says. "Was it? Wights and a rock. It didn't *matter*. I could've done it with sharpers and my crossbow and Brisk's shield." A long breath. "And I don't care. Sergeant. I don't *care*. You should've seen it go. You should've *felt* it. It went up like — it went up like the whole world had been holding its breath for two years and let it go."

She laughs. It comes out wet. "That's awful," she says. "Isn't it. That's an awful thing to feel."

${SQUAD().includes('brisk') ? `Brisk, from the rim, not unkindly: "Yes." Kettle nods. "Good," she says. "I just wanted to check."` : `Ohl, from the rim, not unkindly: "Yes." Kettle nods. "Good," she says. "I just wanted to check."`}`,
      ch:[{t:'Down in the vale, the T\'lan Imass is looking up the slope.', req:()=>!!S.f.c5_spotted, go:'c5_tool_look'},
          {t:'Look to the vale.', req:()=>!S.f.c5_spotted, go:'c5_riders'}]}),
    c5_tool_look:()=>({sp:'Onos T\'oolan', scene:'hills_dusk', fx:()=>{ S.f.c5_toolSaw=1; }, txt:
`It's at the foot of the slope. You didn't see it come. It's standing in the grass forty paces below the ruined barrows, with the flint sword point-down in the turf in front of it and both hands resting on the pommel, and it's looking up at you.

It looked at you once already today, from the dig, when the stone went rattling down the fall. It turned its head and turned it back. It hasn't forgotten. You understand, looking at it, that it has never forgotten anything.

The squad has gone very still behind you. ${SQUAD().includes('brisk') ? `Brisk has her shield up. You don't think she knows she's done it.` : ''}

It regards you for a long moment. It regards the ${S.f.c5_cusserUsed ? 'crater' : 'torn barrows'}, and the dead that are properly dead now, and the grey slush that was a ward. Then the pits where its eyes were come back to you.

"You are very small," says Onos T'oolan. The dry, exact, courteous voice. "Stay that way."

It isn't a threat. That's the terrible thing. It has the sound of advice from someone who has watched a great many small things become large, and has seen what happened to them after.

It turns, and goes back down into the vale, and doesn't look round.

${SQUAD().includes('ohl') ? `Ohl lets out a breath he's been holding since the stone rolled. "Kind," he says, very low. "That was *kind*. Hood's teeth. I think that was the kindest thing anyone's said to me this year."` : ''}`,
      ch:[{t:'Look to the vale.', go:'c5_riders'}]}),
    c5_tool_after:()=>({sp:'Onos T\'oolan', txt:
`It's back in the dig. You can see its shoulders moving at the east end of the long barrow, lifting, setting down. The ring of stones round the near end stands split and steaming. It doesn't look up.

${S.f.c5_toolSaw ? `It said what it had to say to you. It isn't going to say it twice. You have the sense that nothing that old ever says anything twice; there hasn't been time.` : `It never looked at the ridge. Not once, all through the fight. You're not sure whether that means you weren't seen, or that you weren't worth seeing, and you find you'd rather not know which.`}`,
      ch:[{t:'Leave it to its digging.'}]}),

    /* ---- riders: Paran and Toc ---- */
    c5_riders:()=>({sp:'The barrow vale', scene:'hills_dusk', txt:
`Hoofbeats, from the north. Two horses, coming down the long slope into the vale at a walk, the way riders come when they've been told where to find someone and don't much want to.

The first rider sits a horse like a man who was taught properly and has since stopped caring. A captain's cloak, dust-coloured. No helm. The second rides a little behind and to the left, where a scout rides, with a bow across his saddle and his head turned so his one good eye is on the ridges.

${SQUAD().includes('ellis') ? `Ellis has stood up.

She's stood up in full view of the vale without thinking about it, the way you'd stand up in a tavern when someone you'd thought was dead came through the door. Her gloved hand is at her mouth. "Toc," she says, through it. "Hood's breath. It's *Toc*."` : `Kettle squints. "One eye," she says. "The one on the plain. With the dead horses."`}

The riders don't go to the Adjunct. Not at first. The captain reins in at the head of the vale and sits looking along it, at the split stones and the frost and the T'lan Imass in its hole, and at ${S.f.c5_cusserUsed ? `the smoke of the cusser still hanging over the ridge of small barrows` : `the torn turf along the ridge of small barrows`}; and then he turns his horse, and comes toward you.`,
      ch:[{t:'Go down to meet them.', go:()=>startExplore()}]}),
    c5_toc:()=>({sp:'Toc the Younger', fx:()=>{ S.f.c5_toc=1; }, txt:
`He's off the horse before it's stopped. The burn on the left side of his face has healed shiny and tight since the plain, and the lid on that side is sunk over nothing, and the other eye is exactly as quick as you remember.

${SQUAD().includes('ellis') ? `He doesn't look at you. He goes straight past you to Ellis, and stops, a pace off, and looks at her.

Then he takes her gloved hand, the burned one, in both of his, and counts the fingers. One. Two. Three. Four. Five. Through the glove, with his thumb, the way you'd count coins you'd been told were all there and didn't quite believe. She lets him. She's standing very straight.

"Five," says Toc.

"Five," says Ellis.

And he laughs. It comes out of him all at once, a young man's laugh with nothing held back in it, the first one you've heard out of anyone in a week, and it goes out across the vale and makes the T'lan Imass stop digging, for a moment, and go on.

He turns round to you with her hand still in one of his. "Sergeant," he says. "You kept her." A breath. "Good."` : S.f.c2_ellisRefused ? `"Sergeant." He's looking past you, along the row, counting. Five. He knew it would be five. He counts it again anyway, and you watch him not find what he knew he wouldn't.

"I left her at a garrison on the Adjunct's road," he says. "A bad one; I said it would be. She walked out of it inside a week, and nobody saw her go, and nobody's seen her since." He picks a burr off his bowstring. "That's Ellis. That's what they taught her: when you're not wanted, don't be anywhere." A short breath through the nose. "She'll be fine. She's always fine. It's the thing I'd most like to beat out of her."` : `"Sergeant." He's looking past you, along the row, counting.`}

"You've been busy." He nods at the ridge: the torn barrows, the slush, the dead. "We heard it from two hills over. The captain thought it was the Adjunct. I said the Adjunct doesn't make noise." The eye comes back to you. ${S.f.c5_cusserUsed ? `"What in Hood's name did you *throw*?"` : `"What in Hood's name was *that*?"`}`,
      ch:[{t:'"Kettle had a cusser. She\'s been saving it."', req:()=>!!S.f.c5_cusserUsed, go:'c5_toc_more'},
          {t:'"Things came up out of the barrows."', go:'c5_toc_more'}]}),
    c5_toc_more:()=>({sp:'Toc the Younger', txt:
`${S.f.c5_cusserUsed ? `Toc looks at Kettle. Kettle looks back, soot to the eyebrows, frost in her hair, with an expression of such complete and radiant peace that Toc, after a moment, looks away first. "Right," he says. "Good. Remind me to stand on the other side of her."` : `"Things." Toc looks at the opened barrows, and the grey skin, and the black iron at the throats. "Yes. Things do that, round here, I'm told. Round *her*." He doesn't look at the Adjunct. He's very careful not to.`}

He lowers his voice.

"The captain's going to want a word. Let him have it. He's —" Toc stops, and chooses, and you watch him choose. "He's not the man you saw at the Pale, Sergeant. He went into the ground on the plain with a Hound and came out somewhere else, and he's been somewhere since that he won't talk about, and before *that*, at Pale, there was a knife." He touches his own chest, low, on the left. "He'll tell you. He tells everyone. Flat, like that. Like weather. It's the flat that gets you."

"And he's the Adjunct's," Toc says. "Still. Whatever else. Whatever she's doing out here. So am I." The eye goes, for a heartbeat, to the long barrow, to the dig, to the thing in it. "I'd like that to be less true than it is."

${SQUAD().includes('ellis') ? `Ellis is watching him the way she watches ground. "You're frightened," she says. Nobody else in the Fourth would have said it out loud. Toc looks at her. "Yes," he says, simply. "Aren't you?"` : ''}`,
      ch:[{t:'The captain.', go:'c5_paran'}]}),
    c5_toc_again:()=>({sp:'Toc the Younger', txt:
`He's seeing to the horses, both of them, with his back to the dig. ${SQUAD().includes('ellis') ? `Ellis is helping him. They're not talking. They're working side by side the way two people work who've done it before, a lot, in the dark, somewhere worse.` : `He whistles under his breath while he does it, a Genabari dock song, and stops whenever the T'lan Imass stops digging, and starts again when it starts.`}

"The captain," he says, without turning round. "When you're ready. He won't come to you. He doesn't go to people any more. He waits and they come."`,
      ch:[{t:'The captain.', req:()=>!S.f.c5_paran, go:'c5_paran'},
          {t:'Leave him to the horses.'}]}),
    c5_paran:()=>({sp:'Captain Paran', fx:()=>{ S.f.c5_paran=1; }, txt:
`He's standing by his horse at the edge of the dead ground with the reins in one hand, looking at the long barrow. He doesn't turn when you come up. He knows you're there. He has the stillness of a man who has learned, recently and at some cost, that nothing needs to be looked at the moment it arrives.

He's thinner than he was. A sword at his hip, an ordinary-looking sword in a worn scabbard, and his left hand rests on the pommel the way the Adjunct's rests on hers, and you notice that, and wish you hadn't.

"Sergeant." He turns his head then.

${S.f.c1_key === 'line' ? `"Fourth Squad." He knows you. You watch it come into his face. "Pale. The cadre row. The night the Hounds came through the tent lines, you held the row for Tattersail. I was in the fire with a Hound on top of me, and I looked up, and there was a line of marine shields between the cadre and the dark, and I thought, *somebody's doing their job*." A breath. "It was the last thing I thought for a while. I've wanted to tell you that. I didn't expect to get the chance."` : `He looks at you for a long moment, and you can see him try to place you, and fail, and not mind failing. "Fourth Squad," he says. "I read the roster. At Pale. I think I read it. There was a great deal at Pale I've lost the thread of." It isn't an apology. It's a report.`}

"Whiskeyjack sent you." Not a question. "To watch her." He looks back at the barrow. "So did I, once. I was her aide. I was supposed to watch her and learn." Something moves at the corner of his mouth that was probably, a long time ago, a smile. "I learned."`,
      ch:[{t:'"You look like a man who\'s been ill, sir."', go:'c5_paran_died'},
          {t:'"What is she letting out of that hill, sir?"', go:'c5_paran_hill'}]}),
    c5_paran_hill:()=>({sp:'Captain Paran', fx:()=>{ S.f.c5_paranHill=1; }, txt:
`"A Jaghut." He says it the way Toc says *Hound*: flat, so you'll know he knows how it sounds. "A tyrant. Buried by his own people, under wards, a very long time ago. She wants him awake and walking toward Darujhistan. She wants the city to have something bigger to worry about than the Empire, or she wants the Empire to have an excuse, or she wants something I haven't been told." He shrugs, a small, tired movement. "I was told I'd be told. I've been told a great many things."

He looks at the split stones steaming in the dusk.

"The Imass broke the outer wards tonight. There are more. It'll take it a while yet." A pause. "And then the thing under the hill will wake up, slowly, the way old men do, and wonder where it is, and remember, and be very, very angry about it." He doesn't look at you. "I'm told that's the plan. I'd like it on record, Sergeant, with somebody, that I said it out loud and it sounded as bad as it is."

${SQUAD().includes('tuft') ? `Tuft, behind you, has gone completely still.` : ''}`,
      ch:[{t:'"You look like a man who\'s been ill, sir."', req:()=>!S.f.c5_paranDied, go:'c5_paran_died'},
          {t:'"We\'ll camp west of the barrows, sir."', fx:()=>{ S.f.c5_night=1; }, go:'c5_nightfall'}]}),
    c5_paran_died:()=>({sp:'Captain Paran', fx:()=>{ S.f.c5_paranDied=1; }, txt:
`"No," he says. "I've been dead."

He says it flat. Toc told you he would, and he does, and it's the flat that gets you.

"At Pale. After the Hounds. A knife, in the night, from someone I'll probably never be allowed to name." He touches his chest, low, on the left, the same place Toc touched, as if they'd rehearsed it. "I went through a gate. There was a gate, Sergeant. They tell you there isn't, and there is. Somebody was standing at it. And then a coin came down on the wrong side, and I was on my back in the mud with a surgeon swearing at me." He lets go of the pommel. "Since then I've been under the plain with the Hounds of Shadow, which I don't remember, and somewhere else, which I do, and I'd rather not."

He turns back to the barrow.

"I'm telling you because it'll save time. Everyone looks at me and wonders what's wrong, and it takes them a week to ask, and by then it's worse. So: I died, and I didn't stay, and something is interested in me that I'd much rather wasn't." A breath. "That's all. It isn't catching."

${SQUAD().includes('ohl') ? `Ohl has been standing a pace behind you, listening. He looks at Paran for a long time, the way he looks at a wound. "I believe you, sir," he says at last. "You've got the look. I've seen it twice. Both times the man went on to do something the rest of us talked about for years." A pause. "Neither of them enjoyed it."` : `Nobody says anything. There isn't anything to say to that. You find you believe him completely.`}`,
      ch:[{t:'"What is she letting out of that hill, sir?"', req:()=>!S.f.c5_paranHill, go:'c5_paran_hill'},
          {t:'"We\'ll camp west of the barrows, sir."', fx:()=>{ S.f.c5_night=1; }, go:'c5_nightfall'}]}),
    c5_paran_again:()=>({sp:'Captain Paran', txt:
`He's looking at the barrow. He doesn't turn round. "Sergeant."`,
      ch:[{t:'"We\'ll camp west of the barrows, sir."', fx:()=>{ S.f.c5_night=1; }, go:'c5_nightfall'},
          {t:'Leave him.'}]}),
    c5_nightfall:()=>({sp:'The barrow vale', scene:'hills_night', fx:()=>{ gain('otatglove'); }, txt:
`"No," says Paran. "Camp with us. East, past the far hill; Toc's found water. The Adjunct's leaving tonight." He says it without inflection. "For the city. With the Imass. She has what she came for, or enough of it. She'll want me to follow in the morning. I'd rather not sleep alone in this vale, and I'm not too proud to say so to a sergeant."

Night comes down fast in the hills. It comes down like a lid.

You watch the Adjunct go. She saddles her own horse. She strikes her own tent. The T'lan Imass climbs up out of the dig one last time and stands by her stirrup, and she mounts, and they go west, along the vale, past the ridge of small barrows, torn open, and past the Fourth, close enough to spit on. She doesn't look at you. The thing beside her doesn't look at anything. And then the dark has them, and there's only the sound of one horse walking, and then there isn't that.

${SQUAD().includes('tuft') ? `Tuft lets out a breath like someone surfacing. "Gone," she says. "She's gone. Oh, it's *back*." She holds up her hand and the shadow comes to it, thick as smoke, and wraps her fingers, and she presses the hand against her mouth.` : ''}

Where the Adjunct's tent stood, on a flat stone by the dead fire, a glove. A plain riding glove, left or forgotten. There's a fine red dust in its seams that won't brush out. ${SQUAD().includes('tuft') ? `Tuft won't go near it. She won't even stand on the same side of the fire. You pick it up yourself, and put it in your belt, and she watches you do it the way you'd watch someone pick up a snake.` : `You pick it up, and put it in your belt. It's colder than the night.`}

Behind you, down in the dark at the east end of the long barrow, something breathes out.

Not a sound. A change in the air. The frost on the grass round the ring goes out another pace, and stops. And under your boots, very faintly, so faintly you think at first it's your own pulse, the ground goes: *thud*. And, a long time later: *thud*.

${S.f.c5_spotted ? `Nobody in the Fourth is going to sleep tonight. You knew it on the ridge. You know it harder now.` : `Nobody says anything about it. Nobody needs to.`}`,
      ch:[{t:'East, to Paran\'s fire.', go:()=>startExplore('barrow_night')}]}),

    /* ---- exits ---- */
    c5_back_ridge:()=> S.f.c5_night ? {sp:'The way west', txt:
`West, up the fall, is the ridge and the Rhivi and the long way home. The captain's fire is east. Whatever you do tonight, you're not doing it on that ridge.`,
      ch:[{t:'Not yet.'}]} : {sp:'The way west', txt:
`Back up the fall to the long ridge, where the Rhivi lie flat along the crest and Sethand sits in the lee of his stone.`,
      ch:[{t:'Up to the ridge.', go:()=>startExplore('hills_ridge')},
          {t:'Not yet.'}]},
    c5_vale_east:()=> S.f.c5_night ? {sp:'East · the far hill', scene:'hills_night', txt:
`Past the east end of the long barrow, where the dig is a black mouth breathing frost, and round the flank of the far hill, and down to a fold with a spring in it and a fire. Toc's fire. Paran is sitting by it with his sword across his knees. Toc is seeing to the horses.

The stars are very bright. There's no moon. Somewhere to the west, behind you, under the long barrow, the ground goes *thud*, and a long time later, *thud*.`,
      ch:[{t:'Down to the fire.', go:'c5_hairlock'},
          {t:'Not yet.', go:()=>startExplore()}]} : S.f.c5_wardsFought ? {sp:'East · the far hill', txt:
`East past the dig is the far hill. ${S.f.c5_paran ? `The captain is still by his horse, looking at the barrow. He hasn't finished with you.` : `The captain is waiting by his horse at the edge of the dead ground. Nobody goes anywhere until he's had his word.`}`,
      ch:[{t:'Not yet.'}]} : {sp:'East · the far hill', txt:
`East is past the dig. Past the Adjunct's tent. Past the thing in the hole. Whiskeyjack said *watch*. He didn't say *walk past*.`,
      ch:[{t:'Not yet.'}]},

    /* ---- night: Hairlock ---- */
    c5_hairlock:()=>({sp:'The fold below the far hill', scene:'hills_night', txt:
`The fire is small and smokeless and set in the lee of a rock, the way scouts set fires. Paran sits with his back to the rock and his sword across his knees and doesn't sleep. Toc sits across from him, restringing a bow that doesn't need it. The Fourth sits where it can: ${SQUAD().includes('brisk') ? `Brisk with her shield on her knees, facing out; ` : ''}${SQUAD().includes('kettle') ? `Kettle with the satchel in her arms; ` : ''}${SQUAD().includes('tuft') ? `Tuft as close to the fire as she can get without being in it; ` : ''}${SQUAD().includes('ohl') ? `Ohl with a cup of tea he isn't drinking; ` : ''}${SQUAD().includes('ellis') ? `Ellis next to Toc, close enough that their shoulders touch, neither of them mentioning it.` : `nobody talking.`}

Every so often, from the west, under the long barrow: *thud*. And a long time later: *thud*.

It's Toc who sees it first. He stops, with the bowstring half-looped, and looks up, past the fire, at the crest of the hill above the fold. His one eye narrows.

Something is sitting on the crest.

It's small. The size of a child, sitting with its legs dangling over the slope the way a child sits on a wall. The starlight catches it, a little: a round wooden head, and a face painted on the wood, white, with red cheeks and a red smile and two black eyes, the paint cracked. Its arms hang loose. From its wrists and its knees and the crown of its head, thin lines go up into the dark, straight up, taut, and end in nothing at all.

${S.f.c1_sawHairlock ? `You know it. You saw it on a crate in Tattersail's tent at Pale, with its head turned toward you, and it stayed turned. *Luggage*, she said. *Don't talk to it. It talks back.*` : `A puppet. A marionette. Somebody's toy, left on a hill in the middle of the Gadrobi nowhere, with its strings going up to nobody.`}

${SQUAD().includes('tuft') ? `Tuft has stopped breathing. "That's a man," she whispers. "Sergeant, that's a *man*. In there. Tied up in string."` : ''}

The painted head turns. Wood creaks. The black eyes find the fire, and the man with the sword across his knees, and stop.`,
      ch:[{t:'—', go:'c5_hairlock_voice'}]}),
    c5_hairlock_voice:()=>({sp:'The puppet', scene:'hills_night', txt:
`"*Captain.*"

The voice is a man's. That's the worst of it. A grown man's voice, a little hoarse, the voice of someone who has been out in the cold too long and is glad to see a fire; and it comes out of the painted mouth without the mouth moving at all.

"I've been looking for you. Everywhere. Do you know how big this continent is, Captain, when you're this size? No, of course you don't." A dry creak, which might be a laugh. "Forgive me. I'd get up. My knees." The wooden head tilts. "I haven't got knees. I keep forgetting. Isn't that a thing? You'd think it'd be the first thing you'd remember."

Paran hasn't moved. His hand is on the sword.

"You died, Captain. At Pale. I watched. I was *so* pleased." The voice is warm, companionable, a friend telling a story at a fire. "And then you didn't. Somebody tossed a coin for you. Did you know that? I heard it land. I've been hearing it land ever since." The painted smile catches the firelight. "I don't like people who get tossed for. It isn't *fair*. Nobody tossed for me. I just got put in a box."

${SQUAD().includes('ohl') ? `Ohl, very quietly, in Ehrlii: not an argument with Hood. A question. You don't know the words. You know the shape.` : ''}

"I'm going to open you up, Captain," the puppet says, reasonably, "and see what the coin was for."

It lifts one wooden hand, on its string, and the air over the fold *tears*.`,
      ch:[{t:'—', go:'c5_rent_open'}]}),
    c5_rent_open:()=>({sp:'The rent', scene:'hills_night', txt:
`There's no sound. That comes after. First there's the tear itself: a line of grey light down the hillside above the fire, from the puppet's feet to the bottom of the fold, as if someone had taken a knife to the dark and slit it like cloth. And the edges of the slit curl back. And behind them is *grey*. Not light. Not dark. Grey, going away forever, full of a wind that smells like a struck match and a slaughterhouse and a sea.

${SQUAD().includes('tuft') ? `Tuft makes a sound you've never heard her make. "Chaos," she gets out. "That's not a warren, that's the space *between*, that's — Sergeant, it's *pulling*—"` : ''}

It pulls. The fire goes flat toward it, all at once, like grass before a wind. Your cloak goes toward it. The loose stones round the fire go skittering toward it across the turf and over the edge of the grey and don't land.

And Toc's horse screams.

It's picketed at the edge of the fold, nearest the rent, and it rears and screams and the picket-pin comes out of the ground like a tooth, and it goes over backwards, and Toc is already up and running for its head, because that's what a scout does, that's the only thing a scout does, you run for the horse. He gets a hand on the bridle.

The rent takes the horse's scream and makes it long.

It takes Toc too.

You see it. You'll see it for years. The grey reaches out across the turf like a tide coming in over flat sand, fast, and it goes over Toc's boots and his knees, and he looks down at it, and then up, and his one eye finds ${SQUAD().includes('ellis') ? `Ellis` : `you`}, across the fire. He doesn't shout. He opens his mouth to say something, and whatever it was is still in his mouth when the grey closes over his head.

The horse comes out of it. Somehow. It's on its feet on the turf, and it bolts, west, into the dark, dragging its reins. Toc doesn't come out. Toc isn't anywhere.

The rent is still open. A tear of grey light on the hillside, curling at the edges, and pulling, and pulling.`,
      ch:[{t:'—', go:'c5_rent'}]}),
    c5_rent:()=>({sp:'The rent', scene:'hills_night', txt: SQUAD().includes('ellis') ?
`Ellis is already moving.

She's past the fire before you've understood that she's standing. She's got her bow in one hand and her gloved hand out in front of her, reaching, the way you'd reach for someone falling off a roof. The grey pulls at her cloak. She doesn't lean away from it. She leans *in*.

"He's my captain." She says it over her shoulder, without stopping, without turning her head. Her voice is perfectly level. "Sergeant. He's my captain."

Five paces to the rent. Four. On the crest above it the puppet has turned its painted head to watch her, and it's laughing, a dry creak like a door in the wind.

${SQUAD().includes('brisk') ? `Brisk is on her feet with her shield. She's looking at you. She's always looking at you, at the moment it matters. ${S.loy.brisk >= 2 ? `But she's already moving too, and you understand that she's decided, and that she'll do it whether you say a word or not.` : `She's waiting for the word.`}` : ''}

${SQUAD().includes('tuft') ? `Tuft, on her knees in the flattened grass with shadow pouring off her hands like water: "Someone has to," she says. "Sergeant. Someone always has to, through a door like that. He'll need someone who knows his face."` : ''}

Three paces.` :
`Tuft is on her feet.

She's standing at the edge of the fold, with the grey pulling at her cloak and her hair and the shadow coming off her hands like steam off a horse, and she's looking into the rent the way she looked at the Tiste Andii on the roof. Not frightened. Leaning.

"Sergeant." Her voice is very clear over the wind. "It's open. Meanas is *howling* through it, I can — there's so much of it, it's like standing in a river." She takes a step toward it. "I can feel where he went. Toc. I can feel the shape of the hole he made going in, like a hand in a glove. It's not far. It's *not far*."

"Just to the threshold, Sergeant. I can feel where he went. Just to the edge, just to *look*, and I'll come back. I'll come straight back."

On the crest the puppet has turned its painted head to watch her. It's laughing: a dry creak, like a door in the wind.

${SQUAD().includes('ohl') ? `Ohl has his hand on your arm. He isn't holding it. He's just letting you know it's there. "Don't," he says, very low. "Sergeant. That's not a door. That's a *mouth*."` : ''}
${SQUAD().includes('brisk') ? `Brisk is standing with her shield, between Tuft and the rent, not quite in the way. Waiting for the word.` : ''}`,
      ch:[{t:'"Let her go."', req:()=>SQUAD().includes('ellis'), fx:()=>{ S.f.c5_key='through'; }, go:'c5_through_ellis'},
          {t:'"Ellis — no!"', req:()=>SQUAD().includes('ellis') && SQUAD().includes('brisk') && S.loy.brisk >= 2, fx:()=>{ S.f.c5_key='hold'; }, go:'c5_hold_brisk'},
          {t:'Get your arms round her before she reaches it.', req:()=>SQUAD().includes('ellis') && !(SQUAD().includes('brisk') && S.loy.brisk >= 2), fx:()=>{ S.f.c5_key='hold'; }, check:['might',13,'sgt'], go:'c5_hold_ok', fail:'c5_hold_fail'},
          {t:'"Go. The threshold. No further."', req:()=>!SQUAD().includes('ellis'), fx:()=>{ S.f.c5_key='through'; }, go:'c5_through_tuft'},
          {t:'"No. Stay on this side, Tuft."', req:()=>!SQUAD().includes('ellis'), fx:()=>{ S.f.c5_key='hold'; }, go:'c5_hold_tuft'}]}),

    /* ---- through: Ellis ---- */
    c5_through_ellis:()=>({sp:'The rent', scene:'hills_night', fx:()=>{ S.f.c5_ellisThrough=1; unrecruit('ellis'); if (SQUAD().includes('brisk')) loy('brisk',-1); if (SQUAD().includes('tuft')) loy('tuft',1); if (SQUAD().includes('ohl')) loy('ohl',1); if (SQUAD().includes('kettle')) loy('kettle',-1); }, txt:
`"Let her go," you say, and you don't know you've said it until it's out.

She hears. She doesn't look back. She lifts the gloved hand, once, over her shoulder, not quite a salute, the way you'd lift a hand to someone on a dock as the ship goes out.

And she goes into the grey.

She goes into it the way she'd cross a plank she had already read: fast, and without looking down. For half a heartbeat you can see her in it, a dark shape going away in the grey, reaching; and then the edges of the rent curl in, like a mouth closing, and it shuts on her heel. There's a sound like a sail filling. And there's a hillside, and grass, and nothing.

${SQUAD().includes('brisk') ? `Brisk hasn't moved. Her shield is still up. She lowers it, slowly, and she looks at you, and her face does nothing at all.

"We don't leave people," she says. "That's the one thing. Nine years. That's the whole of it." A breath. "You just did."` : ''}

${SQUAD().includes('tuft') ? `Tuft, on her knees: "Someone had to," she says, to the place where the rent was. "Someone had to go after him who knew his face." She wipes her mouth with the back of her hand. "You understood that. I didn't think you would."` : ''}

${SQUAD().includes('ohl') ? `Ohl has the oilcloth out. He has the charcoal. He looks at it for a long time. Then he puts both away without writing anything. "No," he says, to nobody. "Not her. Not him." He folds the oilcloth along its old creases. "Some lists close from the other side."` : ''}

${SQUAD().includes('kettle') ? `Kettle is staring at the hillside. "She had my trip-cord," she says. "Two lengths. She never said what for." Her voice cracks on it. "Sergeant, she never *said*."` : ''}

On the crest, the puppet laughs, and lifts both wooden hands on their strings, and the hillside *tears* again: lower, wider, a long grey mouth opening across the slope above the fire. And things are coming out of it.`,
      ch:[{t:'"Hold the hillside!"', go:()=>startBattle('the_rent',{})}]}),

    /* ---- hold: Ellis ---- */
    c5_hold_brisk:()=>({sp:'The rent', scene:'hills_night', fx:()=>{ S.f.c5_ellisHeld=1; S.f.c5_briskHeld=1; loy('ellis',-3); }, txt:
`You don't get the word out. You don't need to.

Brisk hits her from the side, shield-first, the way she'd hit a man coming over a wall, and they go down together in the flattened grass two paces from the grey. Ellis fights. She fights the way Claw are taught to fight, with everything, elbows and knees and the heel of her hand, and none of it matters, because Brisk has her by the belt and the collar and has put her whole weight down on her like a sack of grain on a mouse, and is not moving, and is not going to move.

"He's my *captain*." Into the turf. "He's my captain, let me *go*, he's my—"

"I know," says Brisk.

The rent curls in at the edges. It closes, slowly, a grey mouth folding itself shut, and the last of it is a line of light on the hillside, and then it's grass.

Ellis stops fighting.

It's worse than the fighting. She lies there under Brisk's weight with her face in the grass and her gloved hand still reaching, flat, fingers spread, toward the place where the grey was; and she doesn't make a sound.

Brisk doesn't let go. She doesn't look at you. She didn't ask. She'll never ask.

On the crest the puppet laughs, and lifts both wooden hands on their strings, and the hillside *tears* again: lower, wider, a long grey mouth opening across the slope above the fire. And things are coming out of it.`,
      ch:[{t:'"Up! Hold the hillside!"', go:()=>startBattle('the_rent',{})}]}),
    c5_hold_ok:()=>({sp:'The rent', scene:'hills_night', fx:()=>{ S.f.c5_ellisHeld=1; loy('ellis',-3); }, txt:
`You get to her at two paces from the grey. You don't tackle her. There isn't room. You just put your arms round her from behind, both arms, round her arms, the way you'd hold someone in a fire who wanted to go back in, and you set your heels, and the rent pulls at both of you, and you hold.

She's fast and she's Claw and she knows exactly where to put an elbow, and she puts it there, twice. You hold. She stamps for your instep. You hold. She says something in a language you don't know, and then in one you do, and it's the worst thing anyone has ever said to you, and you hold.

"He's my *captain*."

"I know."

The rent curls in at the edges. It closes, slowly, a grey mouth folding shut on nothing, and the last of it is a line of light on the hillside, and then it's grass.

She stops. All at once, the way a rope goes slack. You hold her anyway, a moment longer, because you don't trust it. Then you let go, and she stands there with her back to you, and doesn't turn round, and pulls her glove tight at the wrist with her good hand, very slowly, finger by finger.

She doesn't say anything. She's not going to. Not tonight.

On the crest the puppet laughs, and lifts both wooden hands on their strings, and the hillside *tears* again: lower, wider, a long grey mouth across the slope. And things are coming out of it.`,
      ch:[{t:'"Hold the hillside!"', go:()=>startBattle('the_rent',{})}]}),
    c5_hold_fail:()=>({sp:'The rent', scene:'hills_night', fx:()=>{ S.f.c5_ellisHeld=1; loy('ellis',-3); }, txt:
`You get a hand on her cloak at three paces from the grey, and she's Claw, and she's out of the cloak before you've closed your fist, and it's in your hand, empty, and she's still going.

Two paces. One.

The rent closes in her face.

It doesn't close because of you. It closes because it was always going to, a few breaths after Toc, the edges curling in like a burning page. She's close enough that the last of it lifts her hair. She puts her gloved hand out, flat, against the place where it was, as if it might be a door, as if she might knock; and there's only the night air, and the hillside, and grass.

She stays like that. Her hand out. She doesn't turn round.

You're standing behind her holding her cloak. There's nothing in the world you could say. ${SQUAD().includes('brisk') ? `Brisk comes up beside you and takes the cloak out of your hands, gently, and holds it, and doesn't say anything either.` : ''}

"You grabbed," Ellis says at last, to the hillside. Very quietly. "You were too slow. But you *grabbed*." She pulls the glove tight, finger by finger. "I'll remember which."

On the crest the puppet laughs, and lifts both wooden hands on their strings, and the hillside *tears* again: lower, wider, a long grey mouth across the slope. And things are coming out of it.`,
      ch:[{t:'"Hold the hillside!"', go:()=>startBattle('the_rent',{})}]}),

    /* ---- through: Tuft, to the threshold ---- */
    c5_through_tuft:()=>({sp:'The rent', scene:'hills_night', fx:()=>{ if (SQUAD().includes('tuft')) loy('tuft',2); if (SQUAD().includes('ohl')) loy('ohl',-1); if (SQUAD().includes('brisk')) loy('brisk',-1); }, txt:
`"Go," you say. "The threshold. No further."

She doesn't thank you. She doesn't look back. She walks to the rent the way she walked onto the roof in Darujhistan${S.f.c2_key === 'light' ? `, the way she walked onto the glass on the plain` : ''}, as if the ground went on further than it looked; and at the edge of the grey she stops, with her toes on the line where the hillside ends, and the wind of it pulling her hair out straight behind her like a flag.

She puts one hand into the grey. Up to the wrist. Up to the elbow.

"Oh," says Tuft.

Just that. Very softly, the way you'd say it seeing the sea for the first time.

${SQUAD().includes('ohl') ? `Ohl has his hand over his eyes. "Hood," he says. "Hood, Hood, you old bastard, not her. Not *her*." It isn't an argument. It's begging, and he's never begged.` : ''}
${SQUAD().includes('brisk') ? `Brisk has moved to stand behind Tuft, two paces back, shield up, not touching her. "You said the threshold, Sergeant." Very flat. "I'll hold you to the threshold." She doesn't say *we don't leave people*. She doesn't need to. It's in how she stands.` : ''}

On the crest the puppet laughs, and lifts both wooden hands on their strings, and the rent *widens*: lower, longer, a grey mouth across the whole slope with Tuft standing at its lip like a figure in a doorway. And things are coming out of it, round her, past her, as if she were a stone in a stream. They don't touch her. They come for the rest of you.

Tuft doesn't turn round. Shadow is pouring off her like smoke off a pyre, and some of it is going *into* the grey, and some of it is coming back, and you can't tell any more which is which.`,
      ch:[{t:'"Hold the hillside!"', go:()=>startBattle('the_rent',{})}]}),

    /* ---- hold: Tuft ---- */
    c5_hold_tuft:()=>({sp:'The rent', scene:'hills_night', fx:()=>{ S.f.c5_tuftHeld=1; if (SQUAD().includes('tuft')) loy('tuft',-2); if (SQUAD().includes('brisk')) loy('brisk',1); }, txt:
`"No," you say. "Stay on this side, Tuft."

She stops. She's two paces from the grey, with the wind of it pulling her hair out straight, and she stops because you said so, the way she's stopped every time, on the Pale, on the plain, on the roof. You watch her stop. You watch what it costs her.

She turns her head, and looks at you over her shoulder, and her eyes are full of grey light, and something in them goes out.

"Yes, Sergeant," she says.

The rent curls in at the edges. The first one, Toc's, folds itself shut like a burning page, and there's a line of light on the hillside, and then grass.

${SQUAD().includes('brisk') ? `Brisk lets out a breath. She doesn't say *good*. She puts her shield on her arm and comes and stands beside Tuft, close, on the side toward where the rent was, and Tuft lets her. That's all.` : ''}

"He's in there," Tuft says, to the grass. Quietly. Conversationally. "I could feel him. He was *right there*. I could have—" She stops. "No. You're right. I'd have gone further. You knew I'd have gone further." She wipes her face with the heel of her hand, hard. "I hate that you knew."

On the crest the puppet laughs, and lifts both wooden hands on their strings, and the hillside *tears* again: lower, wider, a long grey mouth across the slope. And things are coming out of it.`,
      ch:[{t:'"Hold the hillside!"', go:()=>startBattle('the_rent',{})}]}),

    /* ---- after the rent: the Hounds, and Hairlock's end ---- */
    c5_after_rent:()=>({sp:'The hillside', scene:'hills_night', fx:()=>{ S.f.c5_rentFought=1; }, txt:
`You hold. You don't know how. The things out of the grey don't die the way things die; they come apart, and the pieces go on for a while on their own. Shadow-shapes with too many joints. And the other thing, the thing with the legs, that came out folding and unfolding like a hand opening and closing, and went for ${SQUAD().includes('brisk') ? `Brisk's shield` : `the fire`} as if it hated light.

And behind it, in the grey, the sound of dogs.

Not barking. Baying. Far off and coming closer, the long belling note of hounds on a scent, and the note goes down into the ground and up through your boots and into your teeth, and every hair on your body stands up at once.

${S.f.c1_key ? `You've heard it before. At Pale, in the tent lines, the night the sky was on fire.` : `You've heard it before. At Pale.`}

They come out of the rent at a run.

Two of them. The size of horses. Black, or the colour of the place where black ends, with eyes like lamps seen through smoke. They come out of the grey onto the hillside in one long stride and the turf tears under their feet like cloth, and they go *past you*.

Past the fire. Past ${SQUAD().includes('brisk') ? `Brisk with her shield up` : `the squad`}, close enough to touch. Past you. The wind of them goes over you like a wave. They don't look at you. They don't look at anything. They go up the hillside toward the crest, and the thing sitting on it, and the thing sitting on it stops laughing.

${SQUAD().includes('tuft') ? `Tuft, somewhere behind you, in a voice like someone praying: "*Shadow.*"` : ''}`,
      ch:[{t:'Watch.', go:'c5_hairlock_end'}]}),
    c5_hairlock_end:()=>({sp:'The next hill', scene:'hills_night', txt:
`The puppet gets up.

It gets up the way a man gets up who has forgotten he has no legs: all at once, flailing, the strings jerking it upright a fraction too late. It's saying something. It's saying a great many things, very fast, in the grown man's voice, and none of them are words any more.

It runs. Over the crest, and down the far side, and up the next hill, a small painted figure bounding across the starlit grass on its strings like a child's toy thrown down a stair.

The Hounds catch it on the next hill.

You see it against the stars. You'll wish you hadn't. Two shapes the size of horses, and one small shape between them, and then the small shape is in two places, and then in more than two. The sound comes across the fold a heartbeat late: wood, splitting. A great deal of wood, splitting, and under it, a man's voice going up and up and up, and then, very suddenly, not.

Something falls out of the sky onto the grass of the next hill. Loose, and slow, curling as it falls, the way a kite-string falls when the kite has gone. The puppet's strings. They go slack all at once, from the nothing they were hanging from, and drift down, and lie on the hillside like cobweb.

The Hounds stand over what's left, for a moment. One of them lifts its head, and looks, across the fold, at the fire. At Paran, standing with his sword in his hand. At the Fourth.

${S.f.c5_key === 'through' && !S.f.c5_ellisThrough ? `At Tuft, standing at the lip of the rent. Longest at Tuft.` : ''}

Then they're gone. Not over the hill. Just gone, the way a shadow goes when the lamp's moved.

Paran lowers his sword. He's alive. He's standing by the dead fire with the sword hanging from his hand, alive, looking at the next hill, and you understand from his face that he'd expected, when the Hounds came out of the grey, that they had come for him.

"Not me," he says. Quite quietly. "Not this time." He sounds almost disappointed. He sounds like a man who has been told that the debt is still outstanding.

The rent on the hillside curls in at the edges, and closes, and is grass.`,
      ch:[{t:'Tuft.', req:()=>S.f.c5_key === 'through' && !S.f.c5_ellisThrough, go:'c5_tuft_back'},
          {t:'Count.', req:()=>!(S.f.c5_key === 'through' && !S.f.c5_ellisThrough), go:'c5_night_after'}]}),
    c5_tuft_back:()=>({sp:'Tuft', scene:'hills_night', fx:()=>{ S.f.c5_tuftMarked=1; }, txt:
`She's standing where the rent was, on the grass, with her arm still out in front of her, up to the elbow in nothing.

She lowers it. She looks at it: her hand, her fingers, turning it over in the starlight as if she'd borrowed it from someone and wanted to be sure she was giving it back undamaged. Then she turns round and walks back down to the fire, quite steadily, and sits down in the flattened grass beside you, and folds her hands in her lap.

There's grey in her hair.

Not much. A lock of it, at the left temple, where the wind of the rent was strongest. It wasn't there at dusk. It's the grey of ash, the grey of an old woman's plait, and it doesn't take the firelight, and when she moves her head it doesn't quite move with the rest.

"I didn't go in," she says. "I want you to know. I stood at the threshold. Like you said." She looks at the fire. "They came past me. The Hounds. Both of them. Close enough that I could feel the heat off them, and they're not hot, Sergeant, they're *cold*, they're cold like the space under a door."

"One of them stopped." Her voice is quite calm. "Just for a heartbeat. On the threshold, next to me. It put its head down and smelled my hand. The way a dog does, when it's deciding if it knows you." A pause. "And then it went on. It was very polite about it."

"I think it'll know me now." She reaches up and touches the grey lock, without seeming to know she's doing it. "I think *someone* will."

${SQUAD().includes('ohl') ? `Ohl hasn't said anything. He's looking at the grey in her hair. After a long time he reaches out and puts his hand on her head, the way you'd bless a child, and takes it away again, and doesn't say what he found.` : ''}`,
      ch:[{t:'Count.', go:'c5_night_after'}]}),
    c5_night_after:()=>({sp:'The fold below the far hill', scene:'hills_night', txt:
`${SQUAD().length === 6 ? `Six.` : `Five.`} You count twice. You count a third time, because the number's right and it doesn't feel right.

${S.f.c5_ellisThrough ? `There's a place by the fire, next to where Toc sat, where the grass is pressed flat in the shape of someone sitting close to someone else. Nobody sits in it. Nobody says they're not sitting in it.` : S.f.c5_ellisHeld ? `Ellis is sitting on the far side of the fire from you, with her back to you, facing the hillside where the rent was. She hasn't moved since the Hounds went. She isn't going to. Brisk has put a blanket round her shoulders, and she hasn't taken it off, and she hasn't acknowledged it's there.` : S.f.c5_tuftMarked ? `Tuft is sitting beside you. Everyone keeps looking at her hair and then looking away.` : `Tuft is sitting at the far edge of the firelight with her knees drawn up, facing the place where the rent was. She hasn't said a word since *yes, Sergeant*. Kettle is sitting beside her, not talking either, which for Kettle is a kind of shouting.`}

Paran hasn't sat down. He's standing at the edge of the fold with his back to the fire, looking west, at the long barrow, a black line under the stars. *Thud*, from under it. A long time later: *thud*. It's slower now. It's slower, and it's deeper, the way a man's heart slows when he's about to wake.

"Toc," Paran says, to the dark. Just the name.

${SQUAD().includes('ohl') ? `Ohl has the oilcloth on his knee. He hasn't opened it. "I won't write him," he says, to nobody, to Paran's back. "I don't know where he went. Nobody's dead until I know where they went." He puts it away. "That's a rule. I've just made it. I'm old enough to make rules."` : ''}

Nobody sleeps. The stars go round. Somewhere before dawn there's a sound of hooves, slow and uneven, coming down into the fold from the west, and Toc's horse walks into the last of the firelight dragging its reins, lathered and shaking, and stops by the fire because it has nowhere else to stop.`,
      ch:[{t:'Dawn.', go:'c5_dawn'}]}),

    /* ---- dawn ---- */
    c5_dawn:()=>({sp:'The Gadrobi Hills · dawn', scene:'hills', fx:()=>{ gain('scoutcloak'); }, txt:
`Dawn in the hills comes up grey, then brown, the way it has for longer than there have been people to watch it. The frost on the grass round the long barrow has gone out in the night another twenty paces, in a ring, white, as neat as a drawn line.

Paran is on his horse. He's grey in the face, grey the way Tuft went grey near the Adjunct, as if something had been drawn out of him in the night and not put back. He has Toc's horse on a lead rein. He sat with it, you think, the last hour before light. Behind its saddle, rolled tight and strapped with a scout's knot, a Second Army cloak; he unstraps it without a word and holds it down to you, and you take it.

"The Adjunct's gone to the city," he says. "With the Imass. I'm to follow." He looks west, along the vale, toward Darujhistan. "I'm going to find Whiskeyjack first."

He's quiet for a moment.

"Tell Whiskeyjack I'm coming," he says. "Tell him —" And stops, and you watch him look at whatever he was going to say, and put it down. "No. I'll tell him."

He turns the horse; not west, yet, but up the slope toward the next hill, where the strings are lying in the grass. "I'm going to look at what's left of him before I go. Somebody who knew him should." A pause. "I'll pass you on the road. But when you get there, tell Whiskeyjack about Toc. I'd rather he heard it from someone who saw."

${S.f.c5_toolSaw ? `As he goes: "The Imass spoke to you. I saw it from the head of the vale." He doesn't turn round. "It hasn't spoken to me once, in a month. I'd think about that, Sergeant."` : ''}

And away to the west, under the long barrow, something turns over in its sleep. You feel it through your boots: a long, slow shift, the way a sleeper turns toward the wall. The frost ring shivers. The split stones round the near end groan, all together, like old men getting up.

Then it's still. It's still for now.`,
      ch:[{t:'Ellis.', req:()=>!!S.f.c5_ellisHeld, go:'c5_dawn_ellis'},
          {t:'West. The ridge.', req:()=>!S.f.c5_ellisHeld, go:'c5_dawn_ridge'}]}),
    c5_dawn_ellis:()=>({sp:'Ellis', scene:'hills', txt:
`She's standing where the rent was. She's been standing there since first light, with Brisk's blanket still round her shoulders, looking at the grass.

She doesn't look at you when you come up. She hasn't looked at you since the fire. You don't think she's going to.

Then she does. A long level look, ${S.f.c4_planks ? `the look she gave the planks on the Gadrobi roofs` : `the look she gives ground before she'll put her weight on it`}, weighing what would hold.

"He'd have told me not to go, and I wouldn't have listened to him either — so don't expect thanks, Sergeant, but don't think I don't know."

That's all. One sentence. She pulls the glove tight at the wrist, and takes Brisk's blanket off her shoulders and folds it, exactly, into a square, and walks back to the squad, and hands it to Brisk, and takes her place at the end of the line, facing out, where a scout walks.

It's the right sentence. You'll think about it for a long time, and you won't find a better one.`,
      ch:[{t:'West. The ridge.', go:'c5_dawn_ridge'}]}),
    c5_dawn_ridge:()=>({sp:'The long ridge', scene:'hills', txt:
`Up the fall, in the grey light, with the scree going out from under you and nobody caring now how loud it is.

The Rhivi are still on the ridge. They've been there all night; you can see it in how they're lying. They watched the frost go out round the long barrow. They watched the grey light on the far hill, and the two shapes that came out of it. They watched the Adjunct go by in the dark with the thing beside her, and did not shoot, and are still alive because they did not.

The woman with the bundle is standing, below the crest, among the horses. She has it in both arms now, against her chest, the good red Rhivi wool, and she's looking west, toward the city, the way the Adjunct went. The bundle is very still.

Sethand is on his feet by his barrow-stone. He watches you come up the slope, all of you, and you watch him count, the way everyone counts the Fourth. ${S.f.c5_ellisThrough ? `He arrives at five, and you see him notice who isn't there, and put it away.` : `He arrives at the number, and it's the right one, and something in his face moves.`}

He doesn't speak. He's said, by his count, more than enough to Malazans for one life.

He raises a hand.

Just that. His right hand, open, palm toward you, shoulder-high, and holds it there. He has never done it. Not on the plain, not at the fires, not at the edge of the hills when he turned his horse for home. You don't know what it means to the Rhivi. You know what it means.

${S.f.c2_outFought ? `Then he lowers it, and turns his back, and that is also a thing that means something, and you understand that the one does not cancel the other.` : `Then he lowers it, and turns back to his horse, and doesn't look round again.`}

Above the ridge, very high, a black mote hangs in the pale sky. It has been there all night. You hear it laugh, once, faintly, and then it goes west too, toward the city, ahead of all of you, like everything else.`,
      ch:[{t:'The squad.', go:'c5_close'}]}),

    /* ---- chapter close: the ridge at dawn ---- */
    c5_close:()=>({sp:'The long ridge · dawn', scene:'hills', txt:
`Three days back to the city. Paran's horse will pass you on the road before noon, and he won't stop, and you won't expect him to.

The Fourth sits for a moment in the lee of the barrow-stones before the walk, because it's the last moment anyone is going to get. Nobody has slept. ${S.f.c5_spotted ? `Nobody slept the night before either. It's in their faces, the grey, sanded look of soldiers who have been looked at by something that did not care, twice.` : `It's in their faces, the grey, sanded look of soldiers who have been awake too long in the presence of something that did not need to sleep.`}

${S.f.c5_ellisThrough ? `Five. Brisk counted the rations this morning and the number came out wrong, and she counted again, and it came out wrong the same way, and she closed the ledger and hasn't opened it since.` : S.f.c5_tuftMarked ? `Tuft sits with her hood up. Everyone knows why. Nobody says.` : ''}

The squad is awake. You could talk to any of them. It's the hour for it.`,
      ch:[{t:'Brisk.', req:()=>SQUAD().includes('brisk') && !S.f.c5_closeBrisk, fx:()=>{ S.f.c5_closeBrisk=1; }, go:'c5_close_brisk'},
          {t:'Kettle.', req:()=>SQUAD().includes('kettle') && !S.f.c5_closeKettle, fx:()=>{ S.f.c5_closeKettle=1; }, go:'c5_close_kettle'},
          {t:'Ohl.', req:()=>SQUAD().includes('ohl') && !S.f.c5_closeOhl, fx:()=>{ S.f.c5_closeOhl=1; }, go:'c5_close_ohl'},
          {t:'Tuft.', req:()=>SQUAD().includes('tuft') && !S.f.c5_closeTuft, fx:()=>{ S.f.c5_closeTuft=1; }, go:'c5_close_tuft'},
          {t:'Look back at the vale one last time.', go:'c5_close_end'}]}),
    c5_close_brisk:()=>({sp:'Brisk', scene:'hills', txt:
`${S.f.c5_ellisThrough ? `She's sitting with the ledger closed on her knee and her shield against the stone, and she doesn't look up when you sit.

"I've been trying to work out what I'd write," she says. "*Scout, Ellis, lost.* She's not lost. She walked. *Scout, Ellis, detached.* By whose order?" She turns the ledger over. "By yours. In the ledger, that's by yours."

A long silence.

"We don't leave people. Nine years I've said it. I said it to Tav, the day he joined the Second. *We don't leave people.*" She puts the ledger away. "It's easy to say when nobody's ever walked off into a hole in the air on purpose. It's easy to say when *leaving* only goes one way." She finally looks at you. "I don't know if you were wrong. That's what I can't forgive. I don't *know*."` : S.f.c5_briskHeld ? `She's sitting with her shield across her knees and there's a bruise coming up along her jaw, the shape of the heel of a small hand.

"She's not speaking to me," she says, before you can. "She won't. Not for a long while." She touches the bruise. "Claw-trained. Good elbow."

"You didn't tell me to." It isn't a complaint. "I did it anyway. I'd have done it if you'd told me not to." She sights along the rim of the shield. "That's what *we don't leave people* costs, Sergeant. Somebody has to be the one who doesn't let go. And then they're the one she doesn't look at." A breath. "It's all right. I've been not-looked-at before. It's what the shield's for."` : S.f.c5_ellisHeld ? `She's sitting with her shield across her knees, watching Ellis at the end of the line.

"You grabbed her," she says. "Good." That's all, for a while. Then: "We don't leave people. People don't get to leave us either. That's the half nobody says out loud, because it sounds like a cell." She looks at you. "She'll hate you a while. Let her. It's cheaper than the other thing."` : S.f.c5_tuftMarked ? `She's sitting with her shield across her knees, and she's looking at Tuft, at the hood, at what's under it.

"The threshold, you said." Very flat. "I watched her the whole time. She didn't go in. You were right, and she came back, and she's got an old woman's hair on a nineteen-year-old head." She puts the shield down. "We don't leave people. I thought that meant keeping them on this side. I don't know what it means when they come back and some of them's stayed over there."` : `She's sitting with her shield across her knees, watching Tuft.

"You held her," she says. "Good." Then, after a while: "She won't thank you. She'll say *yes, Sergeant* for a month in that voice. Let her." Brisk runs her thumb along the shield rim. "That's what *we don't leave people* costs. You keep them. And they know you kept them. And they know you knew they'd have gone."`}`,
      ch:[{t:'Back to the row.', go:'c5_close'}]}),
    c5_close_kettle:()=>({sp:'Kettle', scene:'hills', txt:
`${S.f.c5_cusserUsed ? `She's lying on her back in the grass with the empty place in the satchel on her chest and her hands folded over it.

"I keep thinking about it," she says, to the sky. "Not the wights. Not the rock. The *moment*. The bit where it's at the top, and it's going over, and it's not gone off yet, and nothing in the world has happened yet but everything's going to." She sighs. "Two years I carried that. And it's over in the time it takes to say it."

"Chub said I'd know. The one that matters." She turns her head and looks at you. "I don't think it mattered, Sergeant. I think I just couldn't carry it any more." A pause. "${S.inv.cusser > 0 ? `I've still got ${S.inv.cusser > 1 ? `the others` : `the other one`}. I'm going to have to start again. Two years. I'll be ancient.` : `I haven't got another one. That's the first time in five years I haven't had one. I feel *light*. I hate it.`}"

Then, very quietly: "It was *beautiful*, though. Wasn't it."` : S.inv.cusser > 0 ? `She's sitting with the satchel in her lap and the cusser in her hands, turning it over and over.

"He said yes," she says. "Whiskeyjack. No gas in the hills, he said, throw it at anything you like. And I *didn't*." She looks at it. "I stood there with the wights coming up and I thought, *this is it*, and I thought, *no, save it*, and I don't know why."

She puts it back in the satchel, carefully, the way you'd tuck in a child.

"Maybe I've gone Fiddler," she says. "Maybe that's what happens. You carry the big one so long you start to think the carrying's the point."` : `She's sitting with the empty satchel in her lap.

"Somebody finally said yes," she says. "And I had nothing to throw." She laughs, not much. "That's the sapper's life, Sergeant. You spend two years waiting for permission, and when it comes, you're out."`}

${S.f.c5_ellisThrough ? `She's quiet a moment. "She had my trip-cord. Ellis. Two lengths." A breath. "I hope she's using it on something."` : ''}`,
      ch:[{t:'Back to the row.', go:'c5_close'}]}),
    c5_close_ohl:()=>({sp:'Ohl', scene:'hills', txt:
`He has the oilcloth open on his knee, for once, in daylight. He isn't reading it. He's looking at the space at the bottom, under the last name, where the next one would go.

"Toc the Younger," he says. "I've been looking at where he'd go. I'm not going to put him there."

${S.f.c5_ellisThrough ? `"Or her." He smooths the oilcloth flat with the side of his hand. "Twenty-two years, Sergeant, and every name on this went one way. Into the ground, into the fire, into Hood's hands. I knew where they went. That's what made them names on a list and not people I'd lost track of." He looks up at the ridge, at the sky. "She went *through*. After him. On purpose, knowing. And I don't know where *through* goes." A long breath. "Some lists close from the other side. I've never had one do that. I'm going to leave the space, and see if anyone fills it from over there."` : `"I don't know where he went," Ohl says. "That's the thing. Every name on this, I know where they went. I was there. I had my hands in them." He folds the oilcloth, along its old creases. "He went into the grey with his mouth open. I don't know where that goes. Nobody's dead until I know where they went. I made that rule last night." A pause. "Some lists close from the other side, Sergeant. I'd never thought of it before. I'm going to leave the space."`}

${S.f.c5_tuftMarked ? `He looks down the row, at Tuft, at the hood. "And her," he says, very quietly. "I put my hand on her head last night. I've had my hands on a lot of heads." He doesn't finish. Then he does. "Something's got a thumb on her, Sergeant. Not a hand. A thumb. Like a man holding his place in a book."` : ''}`,
      ch:[{t:'Back to the row.', go:'c5_close'}]}),
    c5_close_tuft:()=>({sp:'Tuft', scene:'hills', txt:
`${S.f.c5_tuftMarked ? `She has her hood up. She doesn't take it down when you sit. After a while she does, anyway, and lets you look.

The grey lock at her temple is still there in daylight. It's the colour of ash. It doesn't move in the wind the way the rest of her hair moves.

"I've been trying to use Meanas all morning," she says. "It comes. It comes *easier*. Like a door I used to have to push, and now somebody's propped it." She turns her hand over. A thread of shadow comes and curls round her fingers, thick as rope, and goes. "I didn't prop it."

"Near her, the Adjunct, there was nothing. A hole. I've never been so frightened." She pulls the hood back up. "And then the rent, and there was *everything*. And the Hound put its head down and smelled my hand." She's quiet. "I think I'd rather the hole, Sergeant. I think I'd rather be nothing than be *noticed*. And I think it's too late to choose."` : S.f.c5_tuftHeld ? `She's sitting a little apart, with the Deck in her lap, not drawing.

"Yes, Sergeant," she says, before you can speak, ${S.f.c5_closeBrisk ? `in exactly the voice Brisk said she'd use` : `in the voice she's used since the hillside`}. Then she hears herself, and stops, and puts her face in her hands for a moment, and takes it out.

"I'm sorry," she says. "I'm not angry. I'm *not*." A breath. "Near the Adjunct there was nothing. A hole in the world, and I was in it, and I couldn't feel me. And then the rent, and it was *everything*, all of Meanas, all at once, like a river, and I could feel where Toc went." She turns a card over, face down. "You stopped me stepping into the river. I know you did right. I just — I'd never felt that much of anything before. And I'll never know what was on the other side of it."

"Shadow was, I think." Very quietly. "The Hounds came from there. Out of the grey. I heard them coming." She puts the Deck away. "I'd have been standing right in their road."` : `She's sitting a little apart, with the Deck in her lap, not drawing.

"Near the Adjunct there was nothing," she says. "A hole in the world. I couldn't feel Meanas, I couldn't feel *me*. I've never been so frightened." She turns the top card over. It's blank; the paint's worn off. She turns it back. "And then the rent, and it was everything. And the Hounds came out of it and went past us like we were furniture."

"Somebody sent them." She looks west, toward the city. "Somebody who knew exactly where that puppet would be. That's the part I can't stop thinking about. We weren't the only ones watching this hill."`}`,
      ch:[{t:'Back to the row.', go:'c5_close'}]}),
    c5_close_end:()=>({sp:'The long ridge · dawn', scene:'hills', txt:
`From the lip of the ridge you can see the whole of the vale, one last time, in the flat grey light.

The long barrow. The ring of split stones round its near end, still steaming faintly, like a horse's breath. The frost gone out round it in a white line, neat as a drawn circle. The row of small barrows, torn open${S.f.c5_cusserUsed ? `, and a black crater in the middle of them that Kettle is going to remember for the rest of her life` : ''}. The dig at the east end, a black mouth in the brown.

Nothing moving. The Adjunct is gone. The Imass is gone. The captain is a speck on a hilltop past the far end of the vale, standing in the grass with two horses, looking down at something he hasn't picked up; and Toc is ${S.f.c5_ellisThrough ? `somewhere nobody knows, with Ellis somewhere after him` : `somewhere nobody knows`}, and the puppet's strings lie on the next hill like cobweb.

And under the hill: *thud*.

A long, long time later: *thud*.

It's not in your boots now. It's in the ridge. It's in the stone you're sitting on. It's slower than a heart, and deeper, and it's getting, very slowly, *interested*.

${SQUAD().includes('tuft') ? `Tuft, beside you${S.f.c5_tuftMarked ? `, with her hood up` : ''}: "It knows we were here," she says. "Not who. Just that something small stood on its hill and watched." ${S.f.c5_toolSaw ? `A pause. "*You are very small. Stay that way.*" She says it in almost the Imass's voice, dry and exact, every word set down on its own. "I'd like to. I'd really like to."` : `A pause. "I'd like to stay small, Sergeant. I'd really like to."`}` : ''}

West, then. Three days. The city, and the blue fire, and Whiskeyjack on his bucket, and a report to give in order, without anything in it that isn't so.`,
      ch:[{t:'West, toward the city.', fx:()=>{ S.f.c5_done=1; }, go:()=>chapterEnd(5, S.f.c5_key || 'hold')}]}),
  }
};
