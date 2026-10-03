/* ============ chapter 2: The Rhivi Plain ============ */
/* leaving the barrow alone counts once (with Sethand, and with the squad), however often you walk back to look at it */
function c2LeaveBarrow(fx){ if (S.f.c2_barrowLeft) return; S.f.c2_barrowLeft = 1; S.f.c2_sethTrust = (S.f.c2_sethTrust || 0) + 1; fx(); }
/* the mule has a name only if the squad heard Kettle give it one (the first stop at the wagon) */
const c2Mule = (cap) => S.f.c2_wagon ? 'Pell' : cap ? 'The mule' : 'the mule';
/* whoever a stored roller flag names, for text read after the roll has gone by: "you" for the sergeant (or anyone not here), else the name */
const c2P = id => { const y = !(id && id !== 'sgt' && TPL[id] && SQUAD().includes(id)), he = id === 'ohl';
  return {you:y, n:y ? 'you' : NAME(id), N:y ? 'You' : NAME(id), was:y ? 'were' : 'was', has:y ? 'have' : 'has', poss:y ? 'your' : NAME(id) + '\'s', them:y ? 'you' : he ? 'him' : 'her', they:y ? 'you' : he ? 'he' : 'she'}; };
/* the same, for the chapter's end screen, which speaks of the sergeant in the third person */
const c2Who = id => id && id !== 'sgt' && TPL[id] ? NAME(id) : 'the sergeant';
/* Moreau's section ran from the north tunnels on Garrow's word in the prologue (desert_flee), so the men at the ridge are his */
const c2Moreau = () => !!(S.f.garrowWord && !S.f.p_garrowCrossed);
/* Brisk's ration count at dusk on day four, the same as she gave it at the horses */
const c2Count = () => SQUAD().includes('ellis') ? 'Fifteen days, six' : 'Seventeen days, five';
/* the outriders' answers: the talk (Guile), the ✦ song (Wits 16), Sethand's word, shields. Offered again if the song goes wrong. */
const c2OutCh = () => [
  {t:'Through Sethand: you have come to bury her, not to take anything.', check:['guile',13], fx:()=>{ S.f.c2_outTalkTried=1; },
    edges:id=>[S.f.c2_barrowCold && ['the Rhivi can see the barrow on Kettle', -1], S.f.c2_songWrong && ['they heard the horse-song', -1], id === 'tuft' && ['Tuft knew the dead woman', 1], id === 'kettle' && [S.f.c2_barrowCold ? 'they are pointing at Kettle' : 'they are pointing at Kettle\'s satchel', -2]],
    near:{t:()=>!['sharper','burner'].includes(S.f.c2_outToll) ? `The man in front keeps an arrow on ${NAME(ROLL().who)} all the way through the line. ${NAME(ROLL().who)} comes out of it rattled: −1 on the next check.` : `The man in front will not lower his bow until Kettle has put a ${S.f.c2_outToll} in his hand.`,
      fx:()=>{ if (S.inv.sharper > 0) { S.inv.sharper--; S.f.c2_outToll = 'sharper'; } else if (S.inv.burner > 0) { S.inv.burner--; S.f.c2_outToll = 'burner'; } else { S.f.c2_outToll = 'arrow'; (S.rattled ??= {})[ROLL().who] = 1; } }},
    clean:{fx:()=>{ const w = ROLL().who; if (w !== 'sgt' && SQUAD().includes(w)) loy(w, 1); }},
    go:'c2_out_talk', fail:'c2_out_fight'},
  {t:'Answer them in Rhivi, with the words for the dead.', check:['wits',16], trick:'song', req:()=>!S.f.c2_songTried, fx:()=>{ S.f.c2_songTried=1; S.f.c2_songGiven = (S.f.c2_sethTrust || 0) >= 2 ? 1 : 0; },
    edges:id=>{ const t = S.f.c2_sethTrust || 0; return [t >= 2 ? ['Sethand trusts you: he gives you the words', 2] : t >= 1 && ['Sethand mouths the words', 1], id === 'ohl' && ['Ohl argues with Hood in three tongues', 1], id === 'ellis' && ['Ellis has scouted Rhivi country', 1], id === 'kettle' && ['Kettle cannot carry a tune', -1]]; },
    go:'c2_song', fail:'c2_song_wrong'},
  {t:'"Sethand. Your word. Whatever it costs."', req:()=>(S.f.c2_sethTrust || 0) >= 2, go:'c2_out_seth'},
  {t:'"Shields."', go:'c2_out_fight'}];
const CH2 = {
  title:'The Rhivi Plain', number:'Two',
  intro:{loc:'The Rhivi Plain', sub:'Genabackis · three days south-east of Pale', cap:'Grass to every horizon, and one wagon on it, and the sky empty of quorls.',
    paras:[
`The Black Moranth went south the morning the wagon left, before it had rolled a mile, eight Bridgeburners riding things that should not fly, bound for the north shore of Lake Azur and a boat across it by night. Hedge was still complaining about the boat when the quorl lifted him. The sky over the Pale was full of wings for the time it takes to say a name, and then it was not. Whiskeyjack did not wave. Nobody expected him to. Kettle watched until there was nothing to watch, and then she counted the munitions.`,
`You are Sergeant {sgt}, Fourth Squad, Seventh Company marines, and you are the baggage. One wagon, one mule, eighteen days of hardtack, the Bridgeburners' spare kit under an oilcloth, and a Rhivi guide who has said eleven words in three days and rationed them. The grass is chest-high on Brisk and taller than Tuft. It does not end. Sethand says it ends at the Gadrobi Hills, and says it the way you'd tell a child the sea has a far side.`,
`Day four. Somewhere ahead, a city with blue fire in its streets. Somewhere behind, a camp that has stopped burning. Somewhere on the same road, though nobody has said so, a captain who should have died twice.`],
    go:'Ride', node:'c2_start'},

  areas:[
    /* 16 columns x 12 rows.  . grass  , tall grass  r rock  M barrow stone  W wagon  F fire  = tent  x stake  > exit east  # impassable */
    { id:'plain_road', title:'The Rhivi Plain · the wagon road', sub:'Day four', hint:'Tap ground to move · tap a figure to talk · east is the way', decor:'plain',
      map:[ "################",
            "#,,..,....,...,#",
            "#.,....r...,,..#",
            "#..........MM..#",
            "#,..........MM,#",
            "#.......,......#",
            "#..............>",
            "#..W.,.....r...#",
            "#,.......,.....#",
            "#..r...,.......#",
            "#,,..,....,..,,#",
            "################" ],
      walk:'.,', triggers:{W:'c2_wagon', M:'c2_barrow', '>':'c2_to_hound'}, start:{x:2,y:6},
      quest:()=> !S.f.c2_seth ? 'The guide. He has not said where the road goes.' : 'East. The grass does not care which way you go.',
      npcs:[ {id:'sethand', name:'Sethand', kind:'rhivi', x:4, y:5, node:()=>S.f.c2_seth?'c2_sethand_again':'c2_sethand', fresh:()=>!S.f.c2_seth} ] },

    { id:'hound_site', title:'The Rhivi Plain · where the horses died', sub:'Day four · dusk', hint:'Tap ground to move · tap a figure to talk · east is the way', decor:'plain_dusk',
      map:[ "################",
            "#,,.....,.....,#",
            "#..r.......,...#",
            "#.....,........#",
            "#,........r....#",
            "#..............>",
            "#.......,......#",
            "#...,..........#",
            "#.r.......,.r..#",
            "#......,.......#",
            "#,,....,....,,,#",
            "################" ],
      walk:'.,', triggers:{'>':'c2_to_ridge'}, start:{x:2,y:6},
      quest:()=> S.f.c2_tocGone ? 'East. The ridge before dark, Sethand says.' : !S.f.c2_toc ? 'Two dead horses and a Malazan sitting with his back to the third.' : !S.f.c2_horseDone ? 'The third horse is still breathing.' : 'Toc has something to say before he rides.',
      npcs:[ {id:'toc', name:'Toc the Younger', kind:'toc', x:8, y:5, node:()=>S.f.c2_horseDone && !S.f.c2_tocGone ? 'c2_toc_offer' : S.f.c2_toc ? 'c2_toc_again' : 'c2_toc', show:()=>!S.f.c2_tocGone, fresh:()=>!S.f.c2_toc || (S.f.c2_horseDone && !S.f.c2_tocGone)},
             {id:'ellis', name:'Ellis', kind:'ellis', x:9, y:6, node:()=>S.f.c2_horseDone ? 'c2_toc_offer' : 'c2_ellis', show:()=>!S.f.c2_ellisJoined && !S.f.c2_ellisRefused && !S.f.c2_tocGone, fresh:()=>!S.f.c2_horseDone} ] },

    { id:'ridge', title:'The Rhivi Plain · the fourth camp', sub:'Night · a low ridge with the wind on it', hint:'Tap ground to move · tap a figure to talk · the fire is lit', decor:'plain_night',
      map:[ "################",
            "###..,....###..#",
            "#.....r.......,#",
            "#,.............#",
            "#....=...=.....#",
            "#..............#",
            "#,.....F.......#",
            "#..............>",
            "#..W....x.x....#",
            "#.........,....#",
            "#,,....,....r,,#",
            "################" ],
      walk:'.,', triggers:{F:'c2_fire', '=':'c2_tent', W:'c2_wagon_night', '>':'c2_to_hills'}, start:{x:5,y:9},
      quest:()=> S.f.c2_lightDone ? 'Dawn. East, and the hills.' : S.f.c2_light ? 'There is a light in the west.' : !S.f.c2_sethNight ? 'The fourth camp. Sethand is at the fire, which is new.' : !(S.f.c2_drawn || S.f.c2_noCard) ? 'Night. Tuft is at the fire with the Deck in her hand.' : 'Night. Nobody is sleeping yet.',
      npcs:[ {id:'sethand', name:'Sethand', kind:'rhivi', x:8, y:7, node:()=>S.f.c2_sethNight ? 'c2_ridge_seth_again' : 'c2_ridge_seth', fresh:()=>!S.f.c2_sethNight} ] },

    { id:'hills_edge', title:'The edge of the Gadrobi Hills', sub:'The last morning', hint:'Tap ground to move · tap a figure to talk · the hills are east', decor:'plain',
      map:[ "################",
            "#,,......,....,#",
            "#.......r......#",
            "#,....,.....##.#",
            "#..........###.#",
            "#..r......,..#.#",
            "#..............>",
            "#.....,......#.#",
            "#..W.......r##.#",
            "#,......,...####",
            "#,,...,....,####",
            "################" ],
      walk:'.,', triggers:{W:'c2_wagon_last', '>':'c2_close'}, start:{x:2,y:6},
      quest:()=> 'Darujhistan is a blue smudge to the south-west. The hills are in the way.',
      npcs:[ {id:'sethand', name:'Sethand', kind:'rhivi', x:10, y:5, node:()=>S.f.c2_hillsSeth ? 'c2_hills_seth_again' : 'c2_hills_dust', fresh:()=>!S.f.c2_hillsSeth} ] } ],

  battles:{
    barrow:{title:'The barrow', warrenText:'Something old under the stones · Meanas leans in · Denul holds', warren:{meanas:1.2,denul:1}, dark:true, music:'dark', open:true,
      map:["#..##..#","........","..#..#..","........","........",".#....#.","........","........","..#..#..","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['wight',2,1],['wight',5,1],['wight',3,3],['wight',6,4]], xp:140, after:'c2_after_barrow',
      /* down the stair under the slab: a long stone room with burial niches in both walls, the squad coming up out of a two-wide stair mouth */
      stage2:{title:'The burial chamber', warrenText:'Under the slab · the cold is older here · Meanas leans in · Denul holds', open:false,
        text:()=>`The four are down, and the cold hasn't gone anywhere. It's coming up past the slab, and the slab isn't a slab: it's a lid, and something has pushed it a hand's width off a stair that goes down further than a barrow has any business going.

${SQUAD().includes('brisk') ? `"Nothing at our backs," says Brisk, and goes down first, bent double, shield in front.` : `Nobody wants it at their backs.`}${SQUAD().includes('kettle') ? ` Kettle, behind her, very quietly: "There's another room." This time she doesn't sound pleased about it.` : ''}`,
        map:["#.#..#.#","#......#","..#..#..","#......#","#..##..#","#......#","..#..#..","#......#","###..###","##....##"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['c2_keeper',4,1],['wight',0,2],['wight',7,6]],
        waves:[{round:2, foes:[['wight',0,6]], text:'A niche you took for empty sits up.'}]}},
    outriders:{title:'The grass at night', warrenText:'Open ground · the light in the west throws two shadows', warren:{meanas:1.1,denul:1}, music:'battle', open:true,
      map:["........",".....#..","........","..#.....","........","........",".....#..","........","..#.....","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['rhivi',1,1],['rhivi',4,0],['rhivi',6,2]], xp:120, after:'c2_after_outriders',
      /* the curve falls back toward the light and forms again on a lit rise round the man in front; the riders hidden on the left come in on the flank */
      stage2:{title:'The lit grass', warrenText:'Lit ground · the light close enough to read by',
        text:()=>`The curve breaks and doesn't run. It falls back toward the light and forms again on a low rise where the grass is lit gold to the roots, and the man in front is in the middle of it now, bow strung, mouth shut.

Sethand, behind you, has not drawn. "That one speaks for them. If he goes down, they will let you by." A breath. "I am telling you so you will know which one not to kill."${SQUAD().includes('ellis') ? ` Ellis, already moving: "The grass on the left. They'll come when we do."` : ''}`,
        map:["..,..,..",".r....r.","........",",,..#...",",,......",",,....r.",",,......","........","..#.....","........"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['c2_front',4,1],['rhivi',6,2]],
        waves:[{round:2, foes:[['rhivi',0,4]], text:'One of the riders in the grass on the left comes out of it at a run, low on his horse\'s neck.'}]}},
    /* the new fight on the main road: Pale deserters waiting at the ridge for the wagon (c2_dusk). Avoidable by Guile 15 or ten silver. */
    c2_deserters:{title:'The foot of the ridge', warrenText:'Dusk · tall grass · the shadows are long and Meanas likes them', warren:{meanas:1.1,denul:1}, music:'battle', open:true,
      map:[",,,..r,,",",,..,,.,",".,,....,",",..#,,..","..,..,#,",",,......",".,..,,..","..W....,",",......,",",,....,,"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['c2_deserter',2,1],['c2_deserter',1,3],['c2_deserter',6,3],['c2_xbow',5,0]], xp:130, after:'c2_after_deserters',
      /* up the slope to their camp on the crest: a broken line of thorn with two gaps, the sergeant in one, crossbows behind */
      stage2:{title:'The crest', warrenText:'Full dark on the ridge · a cold fire-ring · thorn', dark:true, xp:70,
        text:()=>`The ones in the grass are down, and the ones on the crest haven't come to help them, which tells you everything about who's in charge up there. The light is nearly gone. Up the slope, behind a broken line of thorn and rock, a crossbow ratchets, and a voice that isn't shouting gives an order you've given yourself.

${SQUAD().includes('ellis') ? `Ellis: "Two gaps in the thorn. He's standing in the right-hand one." She doesn't say *he's good*. She doesn't have to.` : SQUAD().includes('brisk') ? `Brisk, looking at the thorn: "Two ways up. He'll be standing in one of them." She doesn't say *he's good*. She doesn't have to.` : ''}`,
        map:["r..F..r.","........",",......,","##.##.##","........",".,....,.","...r....",",......,",",,....,,",",,....,,"],
        party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
        foes:[['c2_desertsgt',5,2],['c2_deserter',2,2],['c2_xbow',1,0],['c2_xbow',6,0]]}} },

  foes:{ wight:{name:'Barrow wight', sig:'w', hp:12, ac:13, atk:4, dmg:[1,8,1], rng:1, mv:4, init:1, verb:'claws at'},
         rhivi:{name:'Rhivi outrider', sig:'R', hp:12, ac:13, atk:4, dmg:[1,6,2], rng:4, mv:6, init:3, verb:'looses at'},
         /* the barrow's own dead, on its bier under the slab: it never went out, so it never came back */
         c2_keeper:{name:'Barrow-keeper', sig:'K', kind:'wight', hp:28, ac:14, atk:5, dmg:[1,10,2], rng:1, mv:3, init:1, boss:true, sk:['root'], verb:'closes a cold hand on'},
         /* the one with a sergeant's tone in his voice (c2_outriders) */
         c2_front:{name:'The man in front', sig:'M', kind:'rhivi', hp:22, ac:14, atk:5, dmg:[1,8,2], rng:4, mv:6, init:4, sk:['hitrun','pin'], verb:'looses at'},
         /* Pale deserters, four days south and starving: Second Army kit with the badges cut away */
         c2_deserter:{name:'Deserter', sig:'D', kind:'deserter', hp:13, ac:13, atk:4, dmg:[1,8,1], rng:1, mv:4, init:2, verb:'hacks at'},
         c2_xbow:{name:'Deserter crossbow', sig:'X', kind:'xbow', hp:10, ac:12, atk:4, dmg:[1,8,1], rng:5, mv:3, init:2, sk:['pin'], verb:'shoots at'},
         c2_desertsgt:{name:'Deserter sergeant', sig:'S', kind:'deserter', hp:24, ac:14, atk:5, dmg:[1,10,2], rng:1, mv:4, init:3, sk:['parry'], verb:'cuts at'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    barrowtorc:{name:'Barrow torc', slot:'trinket', who:null, hp:2, line:'A twist of black iron from a dead man\'s neck. It is heavier than it looks and colder than it should be. Tuft would not touch it.'},
    secondbadge:{name:'Second Army badge, wrong regiment', slot:'trinket', who:['brisk','sgt'], ac:1, line:'A bronze badge of the Second, the Ninth Regiment\'s. Tav was the Fourth Regiment. Brisk knows the difference and carries it anyway.'},
    rhivibow:{name:'Rhivi horn bow', slot:'weapon', who:['ellis','kettle'], rng:1, atk:1, line:'A short recurve of horn and sinew, unstrung and given. Sethand said it was a bad bow. He did not say whose.'},
    toccloak:{name:'Toc\'s spare cloak', slot:'armour', who:['ellis','tuft','sgt'], ac:1, line:'A Claw\'s field cloak, grey going brown, with the shoulder cut for a bow. Toc left it on the wagon\'s tailboard and did not look back at it.'} },

  /* inside the barrow on the wagon road (it was 'dark', which is headed "Under the Pale" and tinted with Kurald Galain) */
  scenes:{ rhivi_barrow:{loc:'The Rhivi Plain', sub:'Inside the barrow', cap:'Dry-laid stone, a slab with nothing on it, and a cold that has nothing to do with the weather.', amb:'dark'} },

  card:{ id:'raven', name:'The Great Raven', house:'Unaligned', hue:'#6a6f7a',
    txt:`A black bird on a black branch, and something dead beneath it that the painter did not bother to finish. Tuft does not put it back. "It's looking at us," she says. "Not the card. The bird."`,
    fx:'Your squad rolls +2 initiative this chapter.' },

  /* the end screen's own lines: what the checks left behind */
  extras:()=>{ const f = S.f, x = [];
    if (f.c2_barrowCold) x.push(`Kettle ${f.c2_barrowMissWho ? `went into a barrow first, on ${f.c2_barrowMissWho === 'kettle' ? 'her own' : c2Who(f.c2_barrowMissWho) === 'the sergeant' ? 'the sergeant\'s' : c2Who(f.c2_barrowMissWho) + '\'s'} word that the stone had fallen` : 'had a hand inside a barrow before anyone read the stone'}. Her hands were cold ${f.c2_outSang ? 'until the Rhivi sang' : 'all the way to the hills'}.`);
    if (f.c2_printsTrod) x.push(`${c2Who(f.c2_printsWho).replace(/^t/, 'T')} stood where the Hound went home. Crone looked at the boots for a long time.`);
    if (f.c2_andiiStared) x.push(`A Tiste Andii looked back at ${c2Who(f.c2_andiiStaredWho)}, once, the way you look at a page you mean to find again.`);
    if (f.c2_outSang) x.push('The Rhivi let the Fourth through on the song for the dead. Sethand says the grass taught it.');
    if (f.c2_songWrong) x.push(`The outriders call ${c2Who(f.c2_songWho)} horse-singer. Sethand says it is not an insult. He says it is not not one.`);
    if (f.c2_outToll === 'sharper' || f.c2_outToll === 'burner') x.push(`One of Kettle's ${f.c2_outToll}s is riding with the Rhivi. She wants it noted that it was a loan.`);
    if (f.c2_horseHow === 'botched' && SQUAD().includes('ellis')) x.push('The mare took two strokes. Ellis has written it down as one.');
    if (f.c2_desTalked || f.c2_desPaid) x.push(`${c2Moreau() ? 'Moreau\'s section' : 'Eight deserters of the Second'} walked off a Rhivi ridge ${f.c2_desPaid ? 'ten silver richer' : 'on a word'}, south-west, toward the city. ${c2Moreau() ? 'That\'s twice. Garrow would want to know.' : 'Nobody in the Fourth has said where they think they went.'}`);
    else if (f.c2_desFought && c2Moreau()) x.push('Garrow\'s word got Moreau out of the Pale and four days south. The Fourth was the fifth day.');
    return x; },

  dlg:{
    /* ---- opening ---- */
    c2_start:()=>({sp:'The wagon road', scene:'plain', fx:()=>{S.f.c2_started=1;}, txt:
`The wagon has a list to the left that Brisk has been watching for three days the way she watches a shield-wall she doesn't trust. The mule doesn't care. The mule has never cared about anything.

Sethand is out ahead on his own horse, a small tough thing the colour of the grass, and has been since dawn. He does not look back to see if you're following. He has said that the road is the road, and that a Malazan could not lose it if paid to, and that he has known Malazans who were paid to.

Kettle walks beside the wagon with a hand on the oilcloth, as if the munitions might climb out. Tuft walks where the grass is tallest. Ohl rides on the driver's board, because his knees have made the decision for him, and reads nothing.

${S.f.c1_key === 'line' ? `Nobody has said the words *cadre row* since the Pale. Brisk said them once, on the first night, and Tuft got up and walked out of the firelight, and that was the end of that.` : `Nobody has said the words *grey cloak* since the Pale. Tuft has not said much of anything. She talks to Kettle, after dark, and Kettle does not repeat it.`}`,
      ch:[{t:'Ride on.', go:()=>startExplore()},
          {t:'"Kettle. Count."', go:'c2_start_kettle'},
          {t:'"Tuft. You sleeping out here?"', go:'c2_start_tuft'}]}),
    c2_start_kettle:()=>({sp:'Kettle', fx:()=>{S.f.c2_startKettle=1;}, txt:
`"${numw(S.inv.sharper, true)} sharper${S.inv.sharper === 1 ? '' : 's'}, ${numw(S.inv.burner)} burner${S.inv.burner === 1 ? '' : 's'}, ${numw(S.inv.cusser)} cusser${S.inv.cusser === 1 ? '' : 's'}. Same as the Pale. Same as I'll say tomorrow. You could write it down, Sergeant, and save us both the conversation."

She pats the oilcloth. "The Bridgeburners left a crate. I haven't opened it. I want that noted. I want it noted that I've walked beside an unopened Moranth crate for three days and haven't so much as looked at the seals."

${S.loy.kettle >= 2 ? `Then, lower: "It's cussers. A full crate. Twelve, and the dud. I can hear them." She can't. She's right anyway.` : `Brisk, from the far side of the wagon: "She looked at the seals."`}`,
      ch:[{t:'"Tuft. You sleeping out here?"', req:()=>!S.f.c2_startTuft, go:'c2_start_tuft'},
          {t:'Ride on.', go:()=>startExplore()}]}),
    c2_start_tuft:()=>({sp:'Tuft', fx:()=>{S.f.c2_startTuft=1;}, txt:
`She's in the tall grass where you can see her head and not her hands. "There's no lamp out here," she says. "I noticed that the first night."

"It's fine. Kettle snores. It's like a lamp, if you close your eyes."${S.f.c1_plant ? ` Then, not looking at you: "You talked to Tattersail. Outside the tent. I know you did; she does a thing with her shawl." A pause. "Whatever she said, Sergeant, it was true. That doesn't mean it was hers to say."` : ''}

${S.loy.tuft >= 2 ? `"The quorls went south-east. Not south. I watched them till they were gone. Somebody's going somewhere first."` : `She goes back into the grass. It closes behind her like water.`}`,
      ch:[{t:'"Kettle. Count."', req:()=>!S.f.c2_startKettle, go:'c2_start_kettle'},
          {t:'Ride on.', go:()=>startExplore()}]}),

    /* ---- Sethand, the guide ---- */
    c2_sethand:()=>({sp:'Sethand · Rhivi guide', fx:()=>{S.f.c2_seth=1;}, txt:
`He has stopped his horse and is waiting for you with the patience of a man waiting for weather. He is older than you thought at the Pale, or the plain has made him so: brown, seamed, a braid down his back with a bone bead in it, and eyes that have been looking at grass since before you were born and are not tired of it.

"Malazan." He says it the way the Untan docks say *tide*. Not an insult. A fact about the day.

"You have questions. Malazans always have questions. It is why you need so many soldiers to carry them."`,
      ch:[{t:'"Where does the road go?"', go:'c2_seth_road'},
          {t:'"The stones back there. The mounds."', go:'c2_seth_barrows'},
          {t:'"There\'s dust on the horizon. North-west. Been there since dawn."', go:'c2_seth_dust'},
          {t:'"No questions. Lead."', fx:()=>{S.f.c2_sethTrust = (S.f.c2_sethTrust || 0) + 1; loy('brisk',1);}, go:'c2_seth_lead'}]}),
    c2_sethand_again:()=>({sp:'Sethand', txt:
`He has not dismounted. He does not, for Malazans. "More questions."`,
      ch:[{t:'"Where does the road go?"', req:()=>!S.f.c2_sethRoad, go:'c2_seth_road'},
          {t:'"The stones. The mounds."', req:()=>!S.f.c2_sethBarrows, go:'c2_seth_barrows'},
          {t:'"The dust, north-west."', req:()=>!S.f.c2_sethDust, go:'c2_seth_dust'},
          {t:'"Nothing. Lead on."', go:()=>startExplore()}]}),
    c2_seth_road:()=>({sp:'Sethand', fx:()=>{S.f.c2_sethRoad=1;}, txt:
`"South and east, until the grass changes. Then the hills, and the road goes west over them, and then it is not a road, it is a city, and I will not go into it."

He looks along the line of the wagon-ruts, which are not a road either, only the memory of other wagons.

"Six days more. Your sergeant with the sword across his knees said eleven from the Pale, which is seven more. He was being kind to the mule."

${S.f.wjRegard > 0 ? `"He said also: *the Fourth will be on time.* He said it to me, not to you, so that I would know it mattered to him. I am telling you so you will know too."` : `"He did not say anything else about you. I noticed."`}`,
      ch:[{t:'Ask something else.', go:'c2_sethand_again'},
          {t:'"Six days. We\'ll make it five."', fx:()=>loy('brisk',1), go:'c2_seth_lead'}]}),
    c2_seth_barrows:()=>({sp:'Sethand', fx:()=>{S.f.c2_sethBarrows=1;}, txt:
`He does not look at them. He has not looked at them all day, you realise, which is a kind of looking.

"Barrows. They are not ours. They were here when the Rhivi came to the plain, and the Rhivi came to the plain before the grass. Do not."

"Do not what?"

"Whatever you are thinking. Do not. Your people put things in the ground and dig them up again. The plain does not work that way. What goes into a barrow is meant to stay, and sometimes it has opinions about that."

Behind you, Tuft says nothing, very clearly. Kettle, hopeful: "Opinions."`,
      ch:[{t:'"Understood. We leave them."', fx:()=>{S.f.c2_sethTrust = (S.f.c2_sethTrust || 0) + 1; loy('ohl',1);}, go:'c2_sethand_again'},
          {t:'"Noted."', go:'c2_sethand_again'}]}),
    c2_seth_dust:()=>({sp:'Sethand', fx:()=>{S.f.c2_sethDust=1;}, txt:
`This he does look at. For a long time, with his hand flat over his eyes, though the sun is behind him.

"Two. A woman on a horse, riding badly and fast. And a thing that is not a man, walking, and keeping up."

"A Rhivi?"

"No." He drops the hand. "It walks like the barrows. The clans have moved off that line three days now. We will not cross it. It is going where you are going, and it will be there first, and that is a thing I would think about, if I were a Malazan and had the habit."

He clicks his tongue and the horse walks on, and that is all you get.`,
      ch:[{t:'Ask something else.', go:'c2_sethand_again'}]}),
    c2_seth_lead:()=>({sp:'Sethand', txt:
`Something in his face moves that might, on a Malazan, have been approval, and on a Rhivi is probably indigestion.

"Good." He turns the horse. "East, when I say east. There is a place where the horses died. We will pass it before dark. You will want to stop. Do not stop long."`,
      ch:[{t:'Ride on.', go:()=>startExplore()}]}),

    /* ---- the wagon: Brisk and the rations ---- */
    c2_wagon:()=> S.f.c2_wagon ? {sp:'The wagon', txt:
`Brisk has finished counting. The mule has finished caring. Kettle has not finished not looking at the Moranth crate.

${S.f.c2_muleNamed ? `"Pell," Kettle says to the mule, as you pass. It flicks an ear. She takes that as agreement.` : `Ohl, from the driver's board: "Sergeant. If you are going to ride, ride. If you are going to walk, walk in front, where the mule can see somebody it hates."`}`,
      ch:[{t:'Leave'}]} : {sp:'The wagon', fx:()=>{S.f.c2_wagon=1;}, txt:
`Brisk is at the tailboard with the ration sacks open, counting aloud, which she does the way other people pray.

"Eighteen days hardtack, five. Fourteen if the mule eats. Eleven if Kettle does." She reties a sack. "Whiskeyjack said eleven days, and a week behind him. I've heard *a week* before. A week's a thing officers say instead of a number."

Kettle, from the mule's head: "It's a good mule, Sergeant. I've named it."

Brisk stops counting.

"Pell," says Kettle. "It does the same face."`,
      ch:[{t:'"It does the same face."', fx:()=>{S.f.c2_muleNamed=1; loy('kettle',1);}, go:'c2_wagon_pell'},
          {t:'"Brisk. Where does the count leave us if we\'re six?"', go:'c2_wagon_six'}]},
    c2_wagon_pell:()=>({sp:'The wagon', txt:
`Brisk looks at you the way a wall looks at a rumour. Then she goes back to the sacks.

"Eighteen days, five, and a mule called Pell." She ties the last one off. "I'll put it in the ledger. Somebody in Darujhistan will read it and think we've lost our minds, and they'll be right, and it'll be on paper."

Kettle is very pleased and hiding it badly.`,
      ch:[{t:'Ride on.', go:()=>startExplore()}]}),
    c2_wagon_six:()=>({sp:'Brisk', fx:()=>{S.f.c2_countSix=1;}, txt:
`She doesn't ask why six. That is the thing about Brisk; she assumes you have a reason and that it's a bad one.

"Fifteen days, six. Twelve with the mule." A pause. "Ten if the sixth is a marine. Eleven if they're cadre. Cadre don't eat."

Tuft, from the tall grass, without heat: "Cadre eat."

"Not that I've seen," says Brisk, and goes back to counting, and that is the most either of them has said to the other since the Pale.`,
      ch:[{t:'Ride on.', go:()=>startExplore()}]}),

    /* ---- the barrow ---- */
    c2_barrow:()=> S.f.c2_barrowFought ? {sp:'The barrow', txt:
`The stones are where they were. The gap you went in by is a black mouth in the turf, and the grass in front of it has been flattened by things that came out and did not go back.

Sethand has moved his horse to the far side of the wagon, and has not said anything, and is not going to.`,
      ch:[{t:'Leave it.'}]} : {sp:'The barrow', fx:()=>{S.f.c2_barrowSeen=1;}, txt: S.f.c2_barrowSeen ?
`The four stones, the fallen one, the gap. ${S.f.c2_barrowLooked ? `Opened from the inside. You haven't stopped knowing that.` : `It is still dark in the gap in a way that has nothing to do with the sun.`}

Kettle is standing a careful three paces off it${S.f.c2_barrowCold ? ', with her hands tucked into her armpits' : ''}, which is as close to obedience as Kettle comes.` :
`Four stones, waist-high on Brisk, leaning together over a long low mound that the grass has not managed to cover. The stones are older than the grass. They are older than the word for grass. There is a gap on the east side where one of them has fallen, or been pushed, and it is dark in the gap in a way that has nothing to do with the sun.

${S.f.c2_sethBarrows ? `Sethand said *do not.* He said it once, which for Sethand is a speech.` : `Sethand, out ahead, has stopped his horse and is not looking this way. He has the stillness of a man who has decided not to be involved.`}

Kettle has already found the gap. Of course she has.`,
      ch:[{t:'Look at the fallen stone.', check:['wits',12], req:()=>!S.f.c2_barrowTried, fx:()=>{S.f.c2_barrowTried=1;},
            edges:id=>[S.f.c2_sethBarrows && ['Sethand said do not', 1], id === 'kettle' && ['Kettle wants it to be a room', -1]],
            near:{t:'Kettle had a leg in the gap before the stone was read. The hand she put on the inside of it has not been warm since.', fx:()=>{ S.f.c2_barrowCold=1; }},
            clean:{t:'The scrapes going back in can be counted. Four.', fx:()=>{ S.f.c2_barrowFour=1; }},
            go:'c2_barrow_open', fail:'c2_barrow_miss'},
          {t:'Go in.', go:'c2_barrow_in'},
          {t:S.f.c2_barrowLeft ? 'Leave it.' : S.f.c2_sethBarrows ? '"Leave it. Sethand said."' : '"Leave it."', fx:()=>c2LeaveBarrow(()=>{ loy('ohl',1); loy('kettle',-1); }), go:()=>startExplore()}]},
    c2_barrow_open:()=>({sp:'The barrow', fx:()=>{S.f.c2_barrowLooked=1; S.f.c2_barrowReader=ROLL().who || 'sgt';}, txt:
`${by({
  sgt:`The fallen stone didn't fall. The turf on the outside of it is torn up in a fan, and the stone lies on top of the torn turf, and the scrape-marks on its inner face go the wrong way.`,
  ohl:`Ohl gets down by the stone the way he gets down by a wound, knees first, slowly, and doesn't touch it. "This did not fall, Sergeant." He points with the charcoal stub. "The turf is torn out in a fan, and the stone is lying on the torn turf, and the scrapes on the inner face go *out*. I have seen men push a lid like that. Never from that side."`,
  kettle:`Kettle is on her knees at the stone before anyone can tell her not to be. "That's not fallen," she says, delighted, and then, less delighted: "That's not fallen. See the fan? Turf's torn *out*, and the stone's lying on it. I'd want a satchel charge to shift that, and I'd be proud of it, and whatever shifted it didn't have a satchel."`,
  tuft:`Tuft doesn't go near it. She looks at it from where she stands for a long time, and then she says, very quietly, "It was pushed. The turf's torn out from under it, and the scrapes on the inside face go the wrong way."`,
  brisk:`Brisk looks at it the way she looks at a wall somebody else built. "Pushed," she says. "From in." That's all, and it's enough.`,
  _:`{who} crouches by the stone and doesn't touch it. "Didn't fall." The turf on the outside is torn up in a fan, and the stone lies on top of it, and the scrapes on its inner face go the wrong way.`})}

Somebody opened this from inside. Not recently. Not so long ago either.${nearMiss() ? `

${by({kettle:`Kettle worked it out with one leg already in the gap`, sgt:`It took you long enough that Kettle already has one leg in the gap`, _:`It took {who} long enough that Kettle already has one leg in the gap`})} and a hand flat on the inside of the stone. She takes them both out, slowly, and puts the hand under her arm. "It's cold in there," she says. "Not weather."` : ''}${cleanRoll() ? `

${by({sgt:`And you can count the scrapes going back in. Four sets, dragged, the way a man drags his feet when he has been dead a while. Four.`, _:`"Four," says {who}, and points: four sets of scrapes going back in, dragged, the way a man drags his feet when he has been dead a while.`})}` : ''}

${ROLL().who === 'brisk' ? `Her shield is already off her back.` : `Brisk has seen it too. Her shield comes off her back without her seeming to decide anything. "Sergeant."`}

${ROLL().who === 'tuft' ? `Then, from where she has moved to, where she can see the gap and you can't see her: "Something came out. Then something went back. The going-back is newer."` : `Tuft has moved to where she can see the gap and you can't see her. She does that. "Something came out," she says. "Then something went back. The going-back is newer."`}`,
      ch:[{t:'Go in anyway.', go:'c2_barrow_in'},
          {t:'"Nothing that opens its own grave is worth the walk. Leave it."', fx:()=>c2LeaveBarrow(()=>{ loy('brisk',1); loy('kettle',-1); }), go:()=>startExplore()}]}),
    /* a misread stone: Kettle goes in first, alone, and the barrow's cold stays in her hands (paid off at the ridge fire, by the outriders, and on the end screen) */
    c2_barrow_miss:()=>({sp:'The barrow', fx:()=>{S.f.c2_barrowCold=1; S.f.c2_barrowMissWho=ROLL().who || 'sgt';}, txt:
`${by({
  sgt:`It's a stone. It fell. Stones do.`,
  ohl:`Ohl looks at it for a long time. "It fell," he says. "Stones do. I have seen a great many things fall, Sergeant, and very few of them were pushed."`,
  kettle:`Kettle gives it a kick. "Frost-heave," she says, with total confidence. "Seen it a hundred times." She is Falari. She has never seen frost in her life.`,
  tuft:`Tuft looks at the stone, and then away from it. "It fell," she says, the way you'd say a thing to make it so.`,
  brisk:`"Fell," says Brisk, who is not a woman for stones.`,
  _:`{who} looks it over and shrugs. It's a stone. It fell. Stones do.`})}

Kettle is halfway into the gap already, ${by({kettle:'on her own say-so', sgt:'on your nod', _:'on that word'})}, feet first, which is how she goes into anything. Her voice comes back hollow: "There's a room, Sergeant. There's a *room.*"

Then, after a moment, not hollow at all, and very small: "It's *cold* in here."`,
      ch:[{t:'Go in after her.', go:'c2_barrow_in'},
          {t:'"Kettle. Out. Now."', fx:()=>c2LeaveBarrow(()=>{ loy('kettle',-1); loy('ohl',1); }), go:'c2_barrow_out'}]}),
    c2_barrow_out:()=>({sp:'The barrow', fx:()=>{S.f.c2_kettleOut=1;}, txt:
`She comes out faster than she went in, backwards, which is the only way out of that gap, and stands up in the sun and doesn't say anything at all, which is how you know.

Her hands are white to the wrist. She puts them under her arms. "It's a room," she says, eventually. "There's a slab, and nothing on it, and things in the corners that didn't get up. Yet. I didn't wait for *yet*."

${S.f.c2_sethBarrows ? `Out ahead, Sethand has turned his horse round to watch. He doesn't say *I said*. He has the face for it, and lets the face say it.` : `Out ahead, Sethand has turned his horse round to watch. When he sees Kettle standing in the sun with her hands under her arms, he turns it back.`}`,
      ch:[{t:'Ride on.', go:()=>startExplore()}]}),
    c2_barrow_in:()=>({sp:'The barrow', scene:'rhivi_barrow', txt:
`Inside it is cold the way the tunnels under the Pale were cold, the cold that isn't weather. A passage of dry-laid stone, low enough that Brisk goes in bent double, opens into a chamber the size of a company tent with a stone slab in the middle of it and nothing on the slab.

Nothing on the slab. Something in the corners.${S.f.c2_barrowFour ? ` Four, ${c2P(S.f.c2_barrowReader).you ? 'you said' : `${c2P(S.f.c2_barrowReader).n} said`}, at the stone, and the Fourth came in knowing it: shields up, spaced out, nobody talking.` : S.f.c2_barrowLooked ? ` Brisk came in first with her shield up, because somebody read the stone right, and that is the only reason the next part goes the way it does.` : S.f.c2_barrowMissWho && !S.f.c2_kettleOut ? `

Kettle got here first. She's against the far wall with her back to the stone and her satchel held in front of her in both hands, very still, the way you hold still for a dog you don't know. "Sergeant," she says, in a small voice. "It didn't fall."` : ''}

They stand up the way old men stand up, in stages. Four of them. Dry, brown, wound in what were clothes once, and their hands are the hands of things that have been digging.

Tuft, very quietly: "They're not undead. They're *worse* than undead. They're patient."`,
      /* a stone read right means nothing gets the jump on the squad; a clean read (four) means the squad moves first */
      ch:[{t:S.f.c2_barrowLooked ? '"Shields. Take them as they stand."' : '"Shields. Back to the passage."', go:()=>startBattle('barrow', S.f.c2_barrowFour ? {surprise:'p'} : S.f.c2_barrowLooked ? {} : {surprise:'e'})},
          {t:'Kettle has a sharper in her hand.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0, fx:()=>{S.inv.sharper--;}, go:()=>startBattle('barrow', S.f.c2_barrowFour ? {pre:true, surprise:'p'} : {pre:true})}]}),
    c2_after_barrow:()=>({sp:'The barrow', scene:'rhivi_barrow', fx:()=>{ S.f.c2_barrowFought=1; gain('barrowtorc'); }, txt:
`When it's done they don't fall so much as stop. Four brown shapes on the floor above, arranged wrong, and down here the big one folded across its own bier like a man who has sat down at the end of a long march. The cold goes out of the barrow like a tide going out.

There's a torc on the bier that wasn't there before. Black iron. Nobody saw who put it down.

And in the niche where the last one stood, in the dust, a bronze badge. Malazan. Second Army. Kettle picks it up and reads it and hands it to Brisk without a word, which is a thing Kettle has never done in her life.

Brisk turns it over. Turns it back. "Ninth Regiment." Her voice is completely level. "Tav was Fourth. This isn't his."

Ohl, from the stair: "Then it is someone's."`,
      ch:[{t:'"Keep it. Wrong regiment. Right army."', fx:()=>{gain('secondbadge'); loy('brisk',1); S.f.c2_badge=1;}, go:'c2_barrow_badge'},
          {t:'"Leave it on the slab. Let the barrow have him."', fx:()=>{loy('ohl',1); loy('brisk',-1);}, go:'c2_barrow_leave'}]}),
    c2_barrow_badge:()=>({sp:'Brisk', txt:
`She closes her hand on it.

"Somebody from the Second walked out onto this plain and into a barrow and didn't walk out. That's a year ago, maybe. Before Pale." She puts the badge inside her gorget, where the letter is. "He could've known Tav. Marched with him. Somebody did."

She doesn't say anything else. She doesn't have to; she has said more in a minute than she said in the whole of the Pale.`,
      ch:[{t:'Out. Into the light.', go:()=>startExplore()}]}),
    c2_barrow_leave:()=>({sp:'Brisk', txt:
`She sets it on the slab, square, the way you'd set a helmet on a pit's edge.

"Fine." She straightens. "He stays with the ones that killed him. That's the Second all over."

Ohl says something to Hood in Ehrlii on the way out. It doesn't sound like an argument this time. It sounds like a receipt.`,
      ch:[{t:'Out. Into the light.', go:()=>startExplore()}]}),
    c2_to_hound:()=>({sp:'The wagon road · east', txt:
`The ruts bend east here, and the grass ahead is trampled in a way that has nothing to do with wagons. Sethand is already out that way, sitting his horse, waiting. He has the look of a man standing at a distance from something.`,
      ch:[{t:'Ride east.', go:()=>{ startExplore('hound_site'); talk('c2_site'); }},
          {t:'Not yet.'}]}),

    /* ---- the Hound site ---- */
    c2_site:()=>({sp:'Where the horses died', scene:'plain_dusk', fx:()=>{S.f.c2_site=1;}, txt:
`Dusk. The grass here is flat for forty paces in every direction, pressed down in a spiral as if something had turned round in it, once, looking.

Two horses, dead. Not killed; *ended*, the way a sentence ends, and lying where they ended. A third is on its side and still breathing, and the breathing is the only sound on the plain.

A man sits with his back against the dying horse. Malazan kit, the light kind, a bow across his knees. Young. Not looking at you. Looking at the ground twenty paces off, where the spiral stops.

A second figure kneels at the horse's head with both hands on it and her face turned away from the man. Gloved hands. One glove is newer than the other.

Sethand has not come closer. He will not.`,
      ch:[{t:'Go to the man with the bow.', go:'c2_toc'},
          {t:'Look at the ground where the spiral stops.', check:['wits',13], req:()=>!S.f.c2_printsTried, fx:()=>S.f.c2_printsTried=1,
            edges:id=>[S.f.c1_key === 'line' && ['the cadre row: you have seen Hounds before', 1], S.gear[id] && S.gear[id].trinket === 'houndtooth' && ['the Hound\'s tooth is warm', 1]],
            near:{t:()=>`${NAME(ROLL().who)} reads it, but reads it on hands and knees in the middle of the spiral, where it stops.`, fx:()=>{ S.f.c2_printsTrod=1; S.f.c2_printsWho=ROLL().who; }},
            clean:{t:'There is one more print beside the hoofprint: a boot.', fx:()=>{ S.f.c2_paranTurned=1; }},
            go:'c2_prints', fail:'c2_prints_miss'},
          {t:'Go to the horse.', go:'c2_ellis'}]}),
    c2_prints:()=>({sp:'The ground', fx:()=>{S.f.c2_prints=1; loy('tuft',1);}, txt:
`${by({
  sgt:`It takes you a minute because you're looking for the wrong thing. You're looking for where the tracks go. They don't go.`,
  ohl:`It takes Ohl a minute, because he's looking for the wrong thing: for where the tracks go, the way you look for where the blood goes. They don't go.`,
  tuft:`Tuft finds it, because she isn't looking for tracks. She walks the spiral with her head on one side, as if listening for a draught under a door, and stops. "Here," she says. "It doesn't go anywhere from here."`,
  kettle:`Kettle finds it, because Kettle reads ground the way she reads a fuse: where does it stop? "It stops," she says. "Sergeant. It just *stops*."`,
  brisk:`Brisk finds it, because Brisk counts paces. She walks the spiral counting, and the count runs out.`,
  _:`It takes {who} a minute, looking for the wrong thing: for where the tracks go. They don't go.`})}

There is a print in the turf the size of a shield-boss, four-toed, deep as a man's hand. In front of it, where the next one should be, mid-stride, the grass is standing up. Untouched. As if the thing that made the print had been lifted off the world between one step and the next.

There's a horse's hoofprint beside it. Also mid-stride. Also the last.${cleanRoll() ? ` And beside that, one more: a boot. A man's, the heel dug in hard, the toe pointing at the Hound. Whoever wore it didn't run. He turned *into* it.` : ''}${nearMiss() ? `

${by({sgt:`You read it on your hands and knees, in the middle of the spiral, with your palms flat on the torn turf where it stops. It's warm. Turf shouldn't be warm at dusk.`, _:`{who} reads it on hands and knees, in the middle of the spiral, palms flat on the torn turf where it stops. "It's warm," {who} says. Turf shouldn't be warm at dusk.`})} Out at the horse's head, the woman with the gloves has looked up.` : ''}

${ROLL().who === 'tuft' ? `She doesn't look up from it. "Shadow," she says. She doesn't say it like a warren. "It didn't run away, Sergeant. It went *home*, and it took him."` : `Tuft has come up beside ${c2P(ROLL().who).n}. "Shadow," she says. She doesn't say it like a warren. "It didn't run away, Sergeant. It went *home*, and it took him."`}`,
      ch:[{t:'Go to the man with the bow.', go:'c2_toc'}]}),
    /* a misread spiral: whoever looked stood where the Hound went home (Toc, Ellis, the Andii and Crone all notice) */
    c2_prints_miss:()=>({sp:'The ground', fx:()=>{S.f.c2_printsTrod=1; S.f.c2_printsWho=ROLL().who || 'sgt';}, txt:
`${by({
  sgt:`You go into the middle of it to see better, which is the mistake.`,
  ohl:`Ohl goes and stands in the middle of it, where the spiral stops, and turns round once, slowly, the way he'd turn in a ward looking for the one who's gone quiet.`,
  kettle:`Kettle walks the spiral the way a sapper walks a breach, right to the end of it, and stands on the end, and bounces a little. "Firm," she says.`,
  tuft:`Tuft walks into the middle of it before she seems to know she's doing it, and stands there, and then, very quickly, doesn't.`,
  brisk:`Brisk walks into the middle of it with her shield up, which is how Brisk walks into anything.`,
  _:`{who} goes into the middle of it to see better, which is the mistake.`})}

Torn turf. A lot of it. Something heavy turned round here, and something else was thrown, and the light is going, and the shapes won't make a story.

${ROLL().who === 'kettle' ? `"That's a big dog," says Kettle, from the middle of it.` : `Kettle, helpfully: "That's a big dog."`}

Out at the horse's head, the woman with the gloves has looked up for the first time. Not at the dog. At ${c2P(ROLL().who).n}, ${ROLL().who === 'tuft' ? 'who stood' : 'standing'} where it stopped. Then she looks down again.`,
      ch:[{t:'Go to the man with the bow.', go:'c2_toc'}]}),
    c2_toc:()=>({sp:'Toc the Younger', fx:()=>{S.f.c2_toc=1;}, txt:
`He looks up when your shadow reaches him and not before. There's a burn across the left side of his face, new, shiny, and the eye on that side is gone, the lid sunk over nothing. He sees you take it in and lets you.

"Sergeant. Fourth Squad. I know; I read the roster. I read all the rosters. It's the only thing the Claw taught me that turned out useful." He has a young voice and an old way of using it. "Toc the Younger. Second Army scouts, and other things. I was riding with Captain Paran."

He nods at the ground where the spiral stops.

"*Was.*"`,
      ch:[{t:'"What happened here?"', go:'c2_toc_hound'},
          {t:'"Where\'s the captain?"', go:'c2_toc_captain'},
          {t:'"The horse. It\'s still breathing."', go:'c2_ellis'}]}),
    c2_toc_hound:()=>({sp:'Toc the Younger', fx:()=>{S.f.c2_tocHound=1; S.f.c2_toc=1;}, txt:
`${S.f.c2_toc ? '' : `He's young, with a burn across the left side of his face, new and shiny, and the eye on that side gone. "Toc the Younger," he says. "Second Army scouts, and other things. I was riding with Captain Paran."

`}"A Hound." He says it flat, so you'll know he knows how it sounds. "Came out of the ground. Not from behind a rise; out of the *ground*, the way a fish comes out of water. Took the horses first. Then it looked at him, and he looked at it, and he did something with that sword of his, and then it was gone and so was he. Into it. Through it. I don't have the word. The captain went where the Hound went."

He picks a burr off the bowstring.

"I've served the Claw nine years, Sergeant, and I've never seen the Empire lose an argument that fast."${S.f.c2_paranTurned ? `

He doesn't look at the place where the spiral stops. "Your people found the boot. I hoped nobody would but me. He turned *into* it, Sergeant. I've been sitting here an hour trying to make that mean something else."` : ''}

${S.f.c1_key === 'line' ? `"You were at the Pale when they came through the tent lines. I heard. Held the row for the cadre." He looks at you with the one eye. "Then you know what I'm not saying."` : S.f.clawFavour ? `"You were at the Pale when they came through the tent lines. I heard. Held the tent for the grey cloaks." Something in his face shuts. "Then you'll know who to tell."` : `"You were at the Pale. Then you've heard them. That's enough. Nobody should have to see them twice."`}`,
      ch:[{t:'"Where\'s the captain?"', req:()=>!S.f.c2_tocCaptain, go:'c2_toc_captain'},
          S.f.c2_horseDone ? {t:'"And Ellis?"', go:'c2_toc_offer'} : {t:'"The horse."', go:'c2_ellis'}]}),
    c2_toc_captain:()=>{ const p = c2P(S.f.c2_printsWho); return {sp:'Toc the Younger', fx:()=>{S.f.c2_tocCaptain=1;}, txt:
`"Alive." He says it quickly, the way you'd say it to yourself. "I'd know. I don't know how I'd know. I'd know."

"Adjunct Lorn is somewhere on this plain with something out of the barrows walking beside her. Paran was hers. He's still hers, wherever he is, and she'll want to be told, and I'm the one who tells her things. So I ride on. Alone, and fast, and probably wrong."

${S.f.c2_horseDone ? '' : `He stands. It costs him something; the burn pulls.

`}"I can't take Ellis. Not where I'm going. Not with what she is now." He looks over at the horse. "She'll tell you she's fine. She's Claw-trained; they teach you that before they teach you your name."

${S.f.c2_prints ? `"You saw the prints. Where they stop." Not a question. ${S.f.c2_printsTrod ? `"${p.N} knelt in it to do it. I'd rather ${p.they} hadn't; I don't know why. And don't tell her.` : `"Don't tell her.`} She's been not-looking at them for an hour."` : S.f.c2_printsTrod ? `"There's a place over there where the ground's wrong. ${p.N} ${p.was} standing in it." He doesn't look at it. "${p.you ? `I'd stay out of it` : `I'd keep ${p.them} out of it`}. I don't know why. I just would."` : `"There's a place over there where the ground's wrong. Don't let your people stand on it. I don't know why. I just wouldn't."`}${S.f.c2_horseDone ? '' : `

"The mare's hers. It's been dying since the Hound touched it, and she's been holding its head since, and I've asked her twice and I'm not going to ask a third time, because the third time I'd have to make it an order. I'd take it as a kindness, Sergeant. From a stranger. It's easier from a stranger."`}`,
      ch:[{t:'"What happened here?"', req:()=>!S.f.c2_tocHound, go:'c2_toc_hound'},
          S.f.c2_horseDone ? {t:'"And Ellis?"', go:'c2_toc_offer'} : {t:'"The horse."', go:'c2_ellis'}]}; },
    c2_toc_again:()=>({sp:'Toc the Younger', txt:
`He's restringing the bow, which doesn't need it. "Sergeant." He nods at the horse. "Whenever you're ready. She isn't, and won't be, and that's the point."`,
      ch:[{t:'Go to the horse.', go:'c2_ellis'},
          {t:'Leave him.'}]}),

    /* ---- Ellis and the horse ---- */
    c2_ellis:()=>({sp:'Ellis', fx:()=>{S.f.c2_ellisMet=1;}, txt:
`She doesn't look up. She's small, wiry, hair cropped for a helmet she isn't wearing, and she is holding the horse's head in her lap with both gloved hands the way you'd hold something that might get away. The horse's eye rolls to you and rolls back.

"Sergeant." ${S.f.c2_toc ? `She's heard Toc; she's got the rank without looking.` : `She's got the rank without looking.`} "It's a mare. Nine years. She was the only thing on this plain that could outrun that, and she tried, and she was wrong."

Her voice is very exact. Every word is put down where it's meant to go, and none of them shake.

${S.f.c2_tocCaptain ? `"He's asked you. I know. I'd like it noted that I didn't."` : `"Toc'll ask you. He's asked me twice. I'd like it noted that I didn't."`}${S.f.c2_printsTrod ? ((p) => `

Then, still not looking up: "${p.you ? 'You stood' : `${p.N} stood`} where it stopped. ${p.you ? `Don't do it twice.` : `Don't let ${p.them} do it twice.`}"`)(c2P(S.f.c2_printsWho)) : ''}

Ohl has come up on the horse's other side, slow, the way he does with everything that's dying, and put a hand flat on the mare's neck, and is saying something in Ehrlii that isn't for you.`,
      /* the sergeant's own hand, and it is once or it isn't: no "yes, but". A botch is remembered by Sethand that night and by Ellis at the hills. */
      ch:[{t:'Do it yourself. Quick, and once.', check:['might',11,'sgt'], near:false, edges:()=>[S.gear.sgt && S.gear.sgt.weapon === 'clawknife' && ['the grey cloak\'s knife is very sharp', 1]], go:'c2_horse_might', fail:'c2_horse_fail'},
          {t:'Ohl has the tea out.', go:'c2_horse_ohl'},
          {t:'"It\'s not my horse. Toc can do his own work."', fx:()=>{loy('ohl',-1); loy('brisk',-1);}, go:'c2_horse_refuse'}]}),
    c2_horse_might:()=>({sp:'The horse', fx:()=>{S.f.c2_horseDone=1; S.f.c2_horseHow='knife';}, txt:
`You don't ask her to move and she doesn't. You do it the way the Untan garrison taught, the way you've done it for men: fast, once, at the place where it's over before it's felt.

The mare goes still. Ellis's hands don't.${S.gear.sgt && S.gear.sgt.weapon === 'clawknife' ? ` Her eyes go to the knife, once: no maker's mark, and until a moment ago no blood. "I know that knife," she says. That's all.` : ''}

After a while she says, "Thank you." Then: "You've done that before." Then: "Not to a horse." She isn't asking.

She stands up, and takes the newer glove off, and you see the hand: burned, the fingers fused at two knuckles, healed hard and shiny. She looks at it as if checking it's still there and puts the glove back on.

"Fire at the Pale," she says. "Not the Hounds. Before. Nobody asks, so I'm telling you, so you won't."`,
      ch:[{t:'Help her bury it.', go:'c2_bury'}]}),
    c2_horse_fail:()=>({sp:'The horse', fx:()=>{S.f.c2_horseDone=1; S.f.c2_horseHow='botched'; loy('ohl',1);}, txt:
`You do it the way the garrison taught, and the mare moves, and it isn't once. It's twice. The second one is Ohl's, with the cudgel, exact and merciful and much too late to be either, and he says something to Hood that is not polite and is not in any language you know.

Ellis doesn't flinch. That's the worst of it. She's been trained not to, and it worked.${S.gear.sgt && S.gear.sgt.weapon === 'clawknife' ? ` She looks at the knife in your hand, and then away. "I know that knife."` : ''}

"Thank you," she says, to Ohl, and then, to you, after a while, "and you." She means it. It's not a kindness. It's an accounting.

She takes the newer glove off and looks at the hand underneath, burned, fused at two knuckles, and puts the glove back on. "Fire at the Pale. Before the Hounds. Nobody asks."`,
      ch:[{t:'Help her bury it.', go:'c2_bury'}]}),
    c2_horse_ohl:()=>({sp:'Ohl', fx:()=>{S.f.c2_horseDone=1; S.f.c2_horseHow='tea'; loy('ohl',1);}, txt:
`Ohl already has the flask out. He has had it out, you realise, since he saw the horse.

He pours it along the mare's tongue, a little, and talks to her in Ehrlii while it goes in: not an argument, this time, and not a prayer either. Something older than both. The mare's breathing slows, and evens, and spaces out, and is gone, and there isn't a moment when you could say which breath was the last.

Ellis watches the whole of it. When it's done she looks at Ohl with something you've seen on soldiers' faces exactly twice, and both times it was for him.

"What was that?"

"Tea," says Ohl. "Technically."

She takes the newer glove off, and looks at the burned hand under it, fused at two knuckles, and puts the glove back on. "Fire at the Pale," she says, to nobody. "Before the Hounds. I'm telling you so you won't ask."`,
      ch:[{t:'Help her bury it.', go:'c2_bury'}]}),
    c2_horse_refuse:()=>({sp:'Ellis', txt:
`"Understood." She doesn't look up. She doesn't look at Toc either, who has heard.

Toc stands. He does it himself, with his knife, one-handed, badly, because the burn pulls, and it takes longer than it should. Ellis holds the head the whole time. When it's done she lays it down and stands and takes her glove off and looks at the hand under it, burned, fused at two knuckles, and puts the glove back on, and looks at you.

"Fire at the Pale," she says. "Before the Hounds. So you won't ask."

Ohl has gone to the wagon. He has not said anything, and it is very loud.`,
      fx:()=>{S.f.c2_horseDone=1; S.f.c2_horseHow='refused';},
      ch:[{t:'Help her bury it.', go:'c2_bury'}]}),
    c2_bury:()=>({sp:'Where the horses died', txt:
`There is no burying a horse on the Rhivi Plain. There is cutting turf and laying it over the eyes, and putting the saddle-blanket across the neck, and standing there. Brisk cuts the turf. She doesn't ask why. She is a woman who understands that some things get covered.

Kettle, quietly, to the mare: "Sorry." Then, to you: "She had a name. Ellis won't say it. I'm not naming a horse that's already got one."

Sethand has not come into the flattened grass. He sits his horse at the edge of it and says something in Rhivi over the dead horses, low, the same few words over and over, with nearly a tune to them. He stops when he sees you listening, and does not start again until you have looked away.

Toc has his own horse's saddle over his shoulder and is standing at Sethand's stirrup, out at the edge of the flattened grass, negotiating, in the way Toc seems to negotiate, which is to say he asks and then waits until the other man is embarrassed. Sethand hands over the reins of his pack-pony without a word. He'll want something for that. Later.

${SQUAD().includes('ohl') && S.f.c2_horseHow === 'tea' ? `Ohl has the oilcloth out. He isn't writing on it. He's looking at the place where he would.` : `Tuft has gone to the edge of the flattened grass and is standing with her back to it, which is the way she stands to things she is listening to.`}`,
      ch:[{t:'"Toc. Before you ride. What happened here?"', req:()=>!S.f.c2_tocHound, go:'c2_toc_hound'},
          {t:'Toc wants a word.', go:'c2_toc_offer'}]}),
    c2_toc_offer:()=>({sp:'Toc the Younger', fx:()=>{S.f.c2_offer=1;}, txt:
`He has the pony's reins in one hand and his own saddle on it, and the light is nearly gone.

"Ellis." He doesn't raise his voice. She comes. "You're going with the Fourth."

"I'm going with you."

"You're not." He says it gently, which from a Claw is a thing you'd pay to see. "Where I'm going there's a woman who'll look at your hand and see a report. I've written enough of those. I'm not writing one about you." He puts the reins over the pony's neck. "The Claw's done with you. Be done with them."

Then, to you: "She tracks. She shoots. She's faster than anything you've got and she'll go down if a strong wind looks at her. She doesn't lie, and she's had it beaten into her that she should, and it didn't take. That's what you're getting, Sergeant, and I'm not asking. I'm telling you so you'll know what you said no to."

Ellis has not moved. She is looking at you with the exact attention of a woman who has been handed off before.`,
      ch:[{t:'"Ellis. Fourth Squad. If you want it."', go:'c2_ellis_yes'},
          {t:'"Ask her first. She\'s standing right there."', req:()=>!S.f.c2_ellisAsked, fx:()=>S.f.c2_ellisAsked=1, go:'c2_ellis_ask'},
          {t:'"No. Five is the number. Five is what came out of the tunnels."', go:'c2_ellis_no'}]}),
    c2_ellis_ask:()=>({sp:'Ellis', fx:()=>{loy('tuft',1);}, txt:
`It takes her a moment. Nobody has, you understand, in some time.

${S.f.clawFavour ? `"You held a cadre tent for a grey cloak at the Pale." Not accusing. Exact. "I know the one. He wrote my transfer. He writes very neatly." A pause. "One day I'll want to know whether you'd hold a tent for him again. Not now. When you tell me, I'd rather it was the truth and I didn't like it."` :
  S.f.cadreTrust ? `"You held the cadre row at the Pale. For Tattersail. I heard it from three people who don't like each other, so it's probably true." Something in her face eases by a hair, which is a great deal, for her. "The Claw don't hold for the cadre. That's the whole of what I know about the Fourth, and it's more than I know about most squads."` :
  `"I know the roster. Sergeant {sgt}, five out of the tunnels, five out of the tent lines. That's two fives. In the Claw we'd call that a pattern and put someone on it."`}

"I'll go where I'm sent, Sergeant. I always have. But you asked, so: yes. I'd rather be sent by you."

${S.f.clawFavour ? `Then, quieter: "I'll be watching you. I'd want you to know that. It isn't personal. It's training."` : ``}`,
      ch:[{t:'"Fourth Squad, then."', go:'c2_ellis_yes'},
          {t:'"No. Five is the number."', go:'c2_ellis_no'}]}),
    c2_ellis_yes:()=>({sp:'Where the horses died', fx:()=>{ S.f.c2_ellisJoined=1; recruit('ellis'); }, txt:
`"Fourth Squad," she says, as if trying the weight of it. Then she picks up her bow, and her pack, and a second pack that was the mare's, and walks to the wagon, and stands beside it, and that is the whole of the ceremony.

Brisk looks at her. Looks at the ration sacks. "Fifteen days, six."

${S.f.c2_countSix ? `Kettle: "You've done that count already."

"I like to be sure."` : `Kettle: "That was quick."

"I did it on the road," says Brisk. "In case."`}

Toc watches her go. Something goes out of his shoulders that he'd been carrying since the Pale, or before.

"Sergeant. Her hand. Ohl'll want to look at it and she'll say no. Let him look anyway." He swings up onto the pony, which does not like him. "And her eye's fine. Both of them. I'm the one with the eye. Don't let her tell you different; she's started to, and it isn't hers to tell."`,
      ch:[{t:'"Ride safe, Toc."', go:'c2_toc_rides'}]}),
    c2_ellis_no:()=>({sp:'Where the horses died', fx:()=>{ S.f.c2_ellisRefused=1; loy('ohl',-1); }, txt:
`Ellis nods. Once. It's the nod of someone hearing a number.

"Five," she says. "Understood, Sergeant." And she picks up her bow and her pack and goes to stand by Toc's pony, and doesn't look at the wagon, and doesn't look at you, and the not-looking is very well done.

Toc is quiet for long enough that the light changes.

"Then she rides with me, and I'll find a garrison to leave her at, and it'll be a bad one, because that's what's between here and the Adjunct." He swings up. "You had a reason, Sergeant. I hope it was a good one. I've stopped being able to tell them apart."

Ohl has gone back to the wagon. He's not on the driver's board. He's standing behind it, where he thinks nobody can see his face, and Brisk has moved so that nobody can.`,
      ch:[{t:'"Ride safe, Toc."', go:'c2_toc_rides'}]}),
    c2_toc_rides:()=>({sp:'Toc the Younger', fx:()=>{ S.f.c2_tocGone=1; gain('toccloak'); }, txt:
`He turns the pony south-east, toward the hills, the way Sethand told him the dust-line went. He doesn't hurry. A scout doesn't.

At the edge of the flattened grass he stops, once, and looks back at the place where the spiral ends, and you see him decide something about it and put it away.

"Sergeant. If you get to Darujhistan and the captain's there, tell him Toc kept riding. He'll know what it means. I don't, yet."

Then he's a shape in the grass, and then he's the grass.

There's a cloak on the wagon's tailboard that wasn't there before. Grey going brown, the shoulder cut for a bow. ${S.f.c2_ellisJoined ? `Ellis looks at it for a long moment before she touches it. "His spare," she says. "He never wears it. He says it's for when he's cold, and he's never cold. That's a Claw joke. There aren't many." She puts it on.` : `${(w => w ? `Nobody claims it for a while. Then ${w === 'sgt' ? 'you put it on' : `${NAME(w)} puts it on`}, because the nights on the plain are cold and it's a good cloak, and Toc would call leaving it folded a waste.` : `Nobody claims it. Brisk folds it and puts it under the oilcloth with the rest of what the Bridgeburners left.`)(['tuft','sgt'].find(x => S.gear[x] && S.gear[x].armour === 'toccloak'))}`}

Sethand, from his horse, to nobody: "The ridge, before full dark. I said not to stop long."`,
      ch:[{t:'East. The ridge.', go:()=>startExplore()}]}),

    /* ---- exit: to the ridge ---- */
    c2_to_ridge:()=> S.f.c2_tocGone ? {sp:'East · the ridge', txt:
`The ground rises ahead, not much, a long low back of land with the last light on it. Sethand has ridden on to the foot of it and stopped there, off to one side of the ruts. He has been looking west all day. He isn't now. He's looking up at the crest.`,
      ch:[{t:'Make camp on the ridge.', go:'c2_dusk'},
          {t:'Not yet.'}]} : {sp:'East · the ridge', txt:
`Sethand is waiting by the ridge. ${S.f.c2_horseDone ? `Toc hasn't ridden yet.` : `Toc is still sitting with the horse.`} Whatever this is, it isn't finished, and you're the one who'll have to finish it.`,
      ch:[{t:'Not yet.'}]},

    /* ---- the foot of the ridge: Pale deserters want the wagon (the chapter's road fight; talk, pay, or fight) ---- */
    c2_dusk:()=>({sp:'The foot of the ridge', scene:'plain_dusk', txt:
`Sethand doesn't turn round when the wagon comes up beside him. He's sitting his horse very still at the foot of the slope, and he hasn't taken his eyes off the crest.

"Malazan." Quietly. "There are men on the hill. Yours. They have been watching the dead horses since noon, waiting for the one-eyed man to go, and now they are watching your wagon. I am telling you so you will know."

${SQUAD().includes('ellis') ? `Ellis has stopped walking. "Eight," she says, without moving her lips. "Four in the grass by the ruts. Four on the crest: two crossbows, and one giving the orders." She has counted them twice. She is counting them again.` : `Then the grass by the ruts moves where there's no wind${SQUAD().includes('brisk') ? `, and Brisk's shield is off her back before anyone has said a word` : ''}.`}

A voice from the crest, in Malazan, with a Second Army camp in every vowel: "That's far enough, Fourth. Leave the wagon and the mule and walk on. Nobody needs to be brave on a hill."

${c2Moreau() ? `A man stands up on the crest against the last of the light, which is either brave or very tired. Grey under the dirt, Second Army kit with the badge cut away, and you know the face from a lamp in a tunnel under the Pale. Moreau. "Garrow's word," he says. "It got us out of the Pale. It doesn't feed us."${S.f.p_moreauPaid ? ` A pause. "${numw(S.f.p_moreauPaid, true)} silver, you gave me, under the Pale. It bought bread in the first village south. There hasn't been a second village."` : ''}` : `A man stands up on the crest against the last of the light: grey under the dirt, Second Army kit with the badge cut away and the cut gone ragged with days. "The Pale," he says, as if it were a regiment. "We walked out of it. We'd like to keep walking, and we'd like to eat while we do it."`}${SQUAD().includes('brisk') ? `

Brisk, not loudly: "${c2Count()}." It's the count. She says it the way another woman would put her hand on a sword.` : ''}`,
      ch:[{t:'"Shields. We\'re going up."', go:()=>startBattle('c2_deserters')},
          {t:'Ellis has counted them. Hit them first.', req:()=>SQUAD().includes('ellis'), go:()=>startBattle('c2_deserters', {surprise:'p'})},
          {t:'Talk them off the hill.', check:['guile',15],
            edges:id=>[c2Moreau() && ['Moreau remembers Garrow\'s word', 3], id === 'ohl' && ['Ohl stitched the Second under Dujek', 2], id === 'kettle' && ['a Moranth crate on the wagon', 1], id === 'ellis' && ['deserters know a Claw voice', 1]],
            near:{t:()=>S.f.c2_desTook === 'salve' ? 'They go, and a jar of salve goes with them off the tailboard, and nobody is quick enough to say no.' : S.f.c2_desTook === 'silver' ? 'They go, and some of the Fourth\'s silver goes with them, because somebody had to put something in a thin man\'s hand.' : `They go. The crossbow stays on ${NAME(ROLL().who)} all the way into the grass, and it's still there afterwards, behind the eyes: −1 on the next check.`,
              fx:()=>{ if (S.inv.salve > 0) { S.inv.salve--; S.f.c2_desTook = 'salve'; } else if (S.silver > 0) { S.silver -= Math.min(3, S.silver); S.f.c2_desTook = 'silver'; } else { S.f.c2_desTook = 'nothing'; (S.rattled ??= {})[ROLL().who] = 1; } }},
            go:'c2_des_talk', fail:'c2_des_fail'},
          {t:'"Ten silver, and the road to the city. Take it and go."', tag:'10 silver', req:()=>S.silver >= 10, fx:()=>{ S.silver -= 10; AUDIO.play('coin'); loy('brisk',-1); loy('ohl',1); }, go:'c2_des_paid'}]}),
    c2_des_talk:()=>({sp:'The foot of the ridge', scene:'plain_dusk', fx:()=>{ S.f.c2_desTalked=1; const up = gainXP(60); note('+60 experience. Talking them down is soldiering too.', 'good'); if (up) note(`The squad reaches level ${S.lvl}: +4 health and +1 to hit for everyone.`, 'good'); }, txt:
`${by({
  sgt:`You tell them the only true thing you've got that's worth more than the wagon: the clans have moved off the dust-line, there are Rhivi in the grass in numbers tonight, and a wagon is a slow thing to be caught with. Eight men on foot are a quick one.`,
  tuft:`Tuft talks. She doesn't raise her voice. She tells the grass, low and level, what the Rhivi do to men they find on the plain in Malazan kit and no regiment, and she sounds like somebody who has read the report.`,
  ellis:`Ellis says one sentence, and it's the right one, and it's true: "I've counted you, and the Claw taught me what to do with a count." She doesn't say she's done with the Claw. They don't need to know that.`,
  kettle:`Kettle climbs up on the wagon, puts one hand flat on the oilcloth, and explains with total confidence what a crate of Moranth munitions does to a hill when somebody puts a crossbow bolt into it. She has never once lied about munitions. She doesn't need to start.`,
  ohl:`Ohl gets down off the driver's board, knees first, and stands where the grass can see him. "I stitched the Second under Dujek," he says. "Some of you I stitched. I would rather not do it again tonight, and I would very much rather not do the other thing."`,
  brisk:`Brisk, in the regiment voice, the one for parade: "Second Army. *Fall out.*" And something in them older than the Pale very nearly does.`,
  _:`{who} talks, low and level, about the Rhivi, and the dark, and how far it is to anywhere.`})}

The grass is quiet long enough for the light to change. Then it moves: not toward you. Away, in ones and twos, up and over the crest, the way men back off from a dog they've decided isn't worth it. ${c2Moreau() ? `Moreau goes last. He stops on the skyline. "That's twice," he calls down. "Tell Garrow. Or don't. He'll know."` : `The grey one goes last, walking backwards until the far side of the hill has him.`}${cleanRoll() ? `

Before he drops out of sight, his voice comes back down the slope: "There's a woman on the plain with a thing walking beside her. We lay in the grass a whole day while she went by. Whatever you're for, Fourth, don't be for that."` : ''}${SQUAD().includes('brisk') ? `

Brisk lets her shield down an inch. "${c2Count()}," she says. "Still." It's as near as she comes to thanks.` : ''}`,
      ch:[{t:'Up the ridge. Make camp.', go:()=>{ startExplore('ridge'); talk('c2_ridge_arrive'); }}]}),
    c2_des_fail:()=>({sp:'The foot of the ridge', scene:'plain_dusk', txt:
`${by({
  sgt:`You get as far as *the Rhivi* before somebody in the grass decides he's heard this speech before, from an officer, at the Pale.`,
  tuft:`Tuft starts to talk, low and level, and a voice in the grass says *cadre* the way you'd say a dirty word, and that's the end of it.`,
  ellis:`Ellis says one sentence, in a Claw scout's flat voice; and these are men who have been running from that voice for four days.`,
  kettle:`Kettle climbs up on the wagon and gets as far as *cussers* before it occurs to everyone in the grass at once that a wagon full of cussers is worth more than a wagon full of bread.`,
  ohl:`Ohl stands where the grass can see him and gets three words in, and the grey one laughs, not unkindly. "Healer. We've all been stitched. Look where it got us."`,
  brisk:`Brisk tries the regiment voice, and it's exactly the wrong voice. It's the one they ran from.`,
  _:`{who} talks, and gets about four words in.`})}

A crossbow answers. The bolt goes into the wagon's sideboard a hand from the oilcloth, and the grass stands up.`,
      ch:[{t:'Fight', go:()=>startBattle('c2_deserters', {surprise:'e'})}]}),
    c2_des_paid:()=>({sp:'The foot of the ridge', scene:'plain_dusk', fx:()=>{S.f.c2_desPaid=1;}, txt:
`You count ten silver into your palm where the grass can see it, and throw it. It lands in the ruts in front of the wagon and lies there catching the last of the light.

Nobody moves. Then a thin arm comes out of the grass and the silver's gone, ${c2Moreau() ? `and up on the crest Moreau lowers his hand. "Garrow's word, and now your silver," he calls down. He doesn't sound grateful. He sounds like a man adding up what he owes. "The city, then. If there's a city."` : `and up on the crest the grey one lowers his hand. "The city, then," he calls down. "If there's a city."`} They go off south-west through the grass, eight of them, not looking back, the way you'd walk out of a camp you weren't supposed to leave.${SQUAD().includes('brisk') ? `

Brisk watches them until there's nothing to watch. "Ten silver, to deserters, for the road," she says. "That's going in the ledger exactly like that."` : ''}${SQUAD().includes('ohl') ? `

Ohl, from the driver's board: "Cheap. I have priced the other thing, Sergeant. Many times."` : ''}`,
      ch:[{t:'Up the ridge. Make camp.', go:()=>{ startExplore('ridge'); talk('c2_ridge_arrive'); }}]}),
    c2_after_deserters:()=>({sp:'The crest', scene:'plain_night', fx:()=>{S.f.c2_desFought=1;}, txt:
`It's done before the last of the light is. Eight men who walked out of the Pale and four days south, and stopped here, on a hill, over a wagon.${SQUAD().includes('brisk') ? `

Brisk goes from one to the next with her shield still up and turns their collars over. Where the badges were there are only holes, cut and then frayed, and you can't tell a regiment from a hole. She does it anyway. She does all eight.${S.f.c2_badge ? ` The Ninth's badge is inside her gorget, with the letter. She doesn't take it out.` : ''}` : ''}${c2Moreau() ? `

Moreau is the last. Garrow's word got him out of a tunnel under the Pale and four days south, and that was as far as it went. *Malazans running from Malazans*, Brisk said, in the tunnel. Nobody says anything now.` : ''}${SQUAD().includes('ohl') ? `

Ohl kneels by ${c2Moreau() ? 'him' : 'the grey one who did the talking'} and closes his eyes for him. "Second Army," he says. "I may have stitched him once. I stitched most of the Second, once." He doesn't open the oilcloth. These aren't his. He tells Hood so, in Ehrlii, and it doesn't sound as if Hood agrees.` : ''}${SQUAD().includes('ellis') ? `

Ellis has been down the far side of the crest and back. "No horses," she says. "There were three. They ate them." She goes and puts her hand on ${c2Mule()}'s neck, and leaves it there.` : ''}

Sethand comes up the slope when it's over, and not before. He looks at the dead for a long time. "Malazans killing Malazans on a Rhivi hill," he says. "The clans will say it is how the Empire keeps warm."`,
      ch:[{t:'Make camp.', go:()=>{ startExplore('ridge'); talk('c2_ridge_arrive'); }}]}),

    /* ---- the ridge: the fourth camp (the chapter's rest, for Bridgeburner) ---- */
    c2_ridge_arrive:()=>{ const m = c2P(S.f.c2_barrowMissWho); return {sp:'The fourth camp', scene:'plain_night', fx:()=>{ S.f.c2_ridge=1; rest('The fourth camp: Brisk\'s fire, Ohl\'s needle by Kettle\'s lamp, and sleep in shifts while it lasts. Wounds close, mostly.'); }, txt:
`Night on the ridge. Two tents, because Brisk will not sleep in one with Kettle and Kettle will not sleep in one without Tuft, and Ohl sleeps in the wagon, and you sleep where you can see all of it. The fire is small and Brisk built it${S.f.c2_desFought ? `, in the deserters' fire-ring, because it was there` : ''}. The stars are the wrong stars; they have been since Pale, and nobody has said so.

Sethand has come into the firelight. He has not done that on any night before. He sits with his back to the west, which is not where he has been looking.

${SQUAD().includes('ellis') ? `Ellis has taken the first watch without being told, and taken it out beyond the stakes where the tents can't see her. Brisk went out and looked at where she'd put herself, and came back, and said "Good," and that was Ellis's induction into the Fourth.` : `Nobody is talking about the horses. Ohl has the oilcloth open and is looking at it. He hasn't written anything. He's thinking about whether a horse counts, and you can see him decide that it does, and not write it anyway.`}

${S.f.c2_barrowCold ? `Kettle has her hands so near the flames that Brisk keeps looking at them. They have been cold since the barrow. ${S.f.c2_barrowMissWho === 'kettle' ? `"I said it fell," she says, to nobody. "I'd like that not noted."` : S.f.c2_barrowMissWho ? `"${m.you ? 'You' : m.N} said it fell${m.you ? ', Sergeant' : ''}," she says, ${m.you ? 'to the fire, not to you' : 'to nobody'}. "I'm not blaming. I'm *saying*."` : `She doesn't say why. Nobody asks.`}

` : ''}Tuft is at the fire. That's new too.`,
      ch:[{t:'The camp.', go:()=>startExplore()}]}; },
    c2_ridge_seth:()=>({sp:'Sethand', fx:()=>{S.f.c2_sethNight=1;}, txt:
`He doesn't look up from the fire. "Malazan. Sit. It is your fire."

You sit.

"My clan is the Mhybe's. You will not know the word. It means the woman who is the mother of the clan, and it means also a thing that is taken from her, and the Rhivi are not stupid; we know that a word which means both those things is a warning. I am telling you so you will understand that the Rhivi are not simple people who ride horses and shoot Malazans. We ride horses and shoot Malazans because it is a simple plain. The rest of us is not."

He turns a stick in the fire.

"Something is going to happen tonight. I do not know what. The horses know. The clans have moved. The stars are wrong, and you have noticed that, and not said it, which I respect."`,
      ch:[{t:'"The dust-line. It\'s closer."', go:'c2_seth_night_dust'},
          {t:'"Why are you at our fire, Sethand?"', go:'c2_seth_night_why'},
          {t:'Say nothing. Let him have the fire.', go:'c2_seth_night_quiet'}]}),
    c2_seth_night_dust:()=>({sp:'Sethand', fx:()=>{S.f.c2_sethDustNight=1;}, txt:
`"It is not closer. It is *ahead*. It has been ahead since noon. Whatever the thing that walks like the barrows is, it walks faster than a wagon, and it is going to the hills, and it will be in them before you are, and it will be doing something there that the Rhivi will feel in our teeth for a year."

He spits into the fire, carefully, so that it doesn't hiss.

"You are Malazan. It is Malazan. I am not asking you what it is. I am telling you I know that you do not know either, and that this is the first thing about the Empire that has frightened me."`,
      ch:[{t:'"Why are you at our fire?"', req:()=>!S.f.c2_sethWhy, go:'c2_seth_night_why'},
          {t:'Let him have the fire.', go:'c2_seth_night_done'}]}),
    c2_seth_night_why:()=>({sp:'Sethand', fx:()=>{S.f.c2_sethWhy=1;}, txt:
`He is quiet for a while.

"Because your mage has a Deck in her sleeve, and I have seen her not draw from it for four days, and tonight she is at the fire with it in her hand." He doesn't look at Tuft. "The Rhivi do not read the Deck. We do not need to. We have the grass, and the grass says what the Deck says, only slower and with fewer pictures."

${S.f.c2_horseHow === 'tea' ? `"And because a man who can put a horse down that gently should not sit alone."` : S.f.c2_horseHow === 'botched' ? `"And because your healer had to finish a thing at dusk that you began, and has not said a word since, and a man that old should not sit alone with a thing like that."` : `"And because your healer has not said a word since the horses, and a man that old should not sit alone with a thing like that."`} A nod toward the wagon, toward Ohl. "That is all. I will go back to my own fire when I have finished being here."`,
      ch:[{t:'"The dust-line."', req:()=>!S.f.c2_sethDustNight, fx:()=>S.f.c2_sethDustNight=1, go:'c2_seth_night_dust'},
          {t:'Let him have the fire.', go:'c2_seth_night_done'}]}),
    c2_seth_night_quiet:()=>({sp:'Sethand', txt:
`You say nothing. He says nothing. The fire does most of the talking, and it doesn't say much either.

After a long time he reaches into the sheepskin by his knee and takes out a bow. Short, horn and sinew, unstrung. He lays it across his knees and looks at it and then puts it on the ground between you.

"It is a bad bow." He goes back to the fire. "I would not want it wasted on a Malazan who talks."`,
      fx:()=>{ gain('rhivibow'); S.f.c2_sethTrust = (S.f.c2_sethTrust || 0) + 1; },
      ch:[{t:'"The dust-line."', req:()=>!S.f.c2_sethDustNight, fx:()=>S.f.c2_sethDustNight=1, go:'c2_seth_night_dust'},
          {t:'Let him have the fire.', go:'c2_seth_night_done'}]}),
    c2_seth_night_done:()=>({sp:'The fourth camp', txt:
`Sethand stays where he is. He has said what he came to say and will say the rest, if there is a rest, when the plain says it first.

${S.f.c2_drawn || S.f.c2_noCard ? `Tuft is still at the fire. She has put the Deck away, and her hands are in her lap where you can see them, and she is looking west.` : `Tuft is at the fire with the Deck in her hand. She hasn't drawn. She's waiting for something, and it might be you.`}`,
      ch:[{t:'The camp.', go:()=>{ if (S.f.c2_drawn || S.f.c2_noCard) talk('c2_light'); else startExplore(); }}]}),
    c2_ridge_seth_again:()=> S.f.c2_lightDone ? {sp:'Sethand', txt:
`He has his horse saddled and his back to the ridge. "The hills, Malazan. Two days. I will not talk on the way. I have talked more on this road than in the year before it, and I would like to stop."`,
      ch:[{t:'Leave him.'}]} : {sp:'Sethand', txt:
`He hasn't moved from the fire. "Malazan. You have already sat. Sit again or do not."

${!(S.f.c2_drawn || S.f.c2_noCard) ? `He nods, very slightly, at Tuft, and the Deck in her hand.` : `He is looking west. He has been looking west for some time.`}`,
      ch:[{t:'Leave him.', go:()=>{ if (S.f.c2_drawn || S.f.c2_noCard) talk('c2_light'); else startExplore(); }}]},

    /* ---- the fire: Tuft's Deck ---- */
    c2_fire:()=> S.f.c2_lightDone ? {sp:'The fire', txt:
`The fire's out. Somebody has kicked dirt over it, Malazan-fashion, and Sethand has kicked more over that, Rhivi-fashion, and neither of them has said anything about the other's way of doing it.`,
      ch:[{t:'Leave the fire.'}]} : S.f.c2_drawn || S.f.c2_noCard ? {sp:'The fire', txt:
`The fire's low. Brisk feeds it a stick at a time, which is how Brisk feeds anything.

${S.f.c2_noCard ? `Tuft has the Deck in her sleeve and is not touching it. She hasn't said anything about it. That's how you know.` : `Tuft has put the Deck away. She's looking west, over the tents, at nothing.`}

${SQUAD().includes('kettle') && !S.f.c2_bones ? `Kettle has two knucklebones out and is throwing them against her own knee, left hand against right, keeping score in the dirt with a stick. "Hedge taught me," she says, without looking up. "Well. Hedge took four silver off me and I watched how." She holds them up. "Loser takes first watch, Sergeant?"` : S.f.c2_bones === 'won' ? `Kettle is on first watch, out by the stakes, counting stars under her breath and losing count on purpose.` : S.f.c2_bones === 'lost' ? `Kettle is asleep already, curled round her satchel, with the bones in her fist.` : ''}`,
      ch:[{t:'"Loser takes first watch. Throw."', tag:'Bones', req:()=>SQUAD().includes('kettle') && !S.f.c2_bones, go:()=>playBones({opp:'kettle', chat:SQUAD().includes('brisk') ? 'brisk' : null, stakes:null, stakeText:'first watch', place:'c2', after:r => { if (r.games) S.f.c2_bones = r.last === 'me' ? 'won' : 'lost'; talk('c2_bones_after'); }})},
          {t:'Leave the fire.'}]} : {sp:'The fire', fx:()=>{S.f.c2_fireSeen=1;}, txt:
`Tuft has the Deck out. She has it face-down on her knee, one hand flat on it, the way you'd hold a door shut.

"One card, Sergeant. I don't want to. I think I have to." She doesn't look at Sethand, who is not looking at her with great skill. "Something's happening tonight. I can feel it in the warren like a draught under a door, and the Deck's warm, and it's never warm."

${SQUAD().includes('ellis') ? `Ellis, from the dark beyond the stakes, not loudly: "That thing got a man killed at Pale. A cadre mage read it three nights running and on the fourth the Hounds came." A pause. "I'm not saying it's the Deck's fault. I'm saying I've never seen it help." Tuft doesn't answer her. Tuft doesn't look at her. It is, you realise, the first thing Ellis has said that Tuft has heard.` : `Kettle: "Draw it. If it's bad we'll know it's bad. If it's good, Brisk can tell us why it's bad anyway."`}`,
      ch:[{t:'Let her draw.', fx:()=>{ S.f.c2_drawn=1; S.card = dealCard(['raven','raven','raven','oponn','obelisk','knight']); }, go:()=>cardSequence(()=>talk('c2_card'))},
          {t:'"Put it away. Not tonight."', fx:()=>{S.f.c2_noCard=1; loy('tuft',-1); loy('brisk',1); if (SQUAD().includes('ellis')) loy('ellis',1);}, go:'c2_fire_no'},
          {t:'Not yet.'}]},
    c2_card:()=>{ const c = (CARDS[S.card] || CH2.card); return {sp:'The Deck of Dragons', scene:'plain_night', txt:
`Tuft lays the reading out on the flat of Brisk's shield, which Brisk allows, which nobody comments on. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)} · ${esc(c.fx)}</div>`, oncard:[S.card,false],
      after:`${c.txt}

Sethand has not looked at the card. He has looked at Tuft's face while she looked at it, which is where a Rhivi reads a Deck.`,
      ch:[{t:'Put the cards away.', go:()=>{ if (S.f.c2_sethNight) talk('c2_light'); else startExplore(); }}]}; },
    c2_bones_after:()=>({sp:'The fire', txt: S.f.c2_bones === 'won' ?
`Kettle stares at the bones for a while as if they might explain themselves. Then she gets up, picks up her crossbow, and goes out to the stakes for first watch without a word, which from Kettle is a speech.

${SQUAD().includes('brisk') ? `Brisk, feeding the fire a stick at a time: "She let you win." A pause. "She didn't. But she'll say she did. Let her."` : `She's still muttering odds at the dark when you fall asleep.`}` : S.f.c2_bones === 'lost' ?
`"First watch," says Kettle, and is asleep before you've finished standing up, curled round her satchel with the bones in her fist.

The stars over the Rhivi Plain are very large and very many, and there is a long time to look at them.` :
`Kettle puts the bones away. "Another night," she says. "I've been working on a system."`,
      ch:[{t:'The camp.'}]}),
    c2_fire_no:()=>({sp:'Tuft', txt:
`She puts the Deck back in her sleeve. She does it slowly, which is a thing she does with her hands when the rest of her wants to do something fast.

"Yes, Sergeant."

${S.f.noCard && S.f.c1_noCard ? `"That's three times." Not an accusation. An observation, filed.` : S.f.noCard || S.f.c1_noCard ? `"That's twice." Not an accusation. An observation, filed.` : `Kettle, to the fire: "It'd have been the Raven. It's always the Raven out here. You can hear them at night."`}`,
      ch:[{t:'The camp.', go:()=>{ if (S.f.c2_sethNight) talk('c2_light'); else startExplore(); }}]}),

    /* ---- the tents and the wagon at night ---- */
    c2_tent:()=>({sp:'The tents', txt:
`${S.f.c2_lightDone ? `The tents are struck and on the wagon. Two squares of pale, flattened grass where they stood. By tonight the plain will have them back.` : S.f.c2_tentSeen ? `The tents are where they were. Kettle's snoring is not louder than the wind, but it's arguing with it.` :
`Two tents, six paces apart, which is the distance Brisk has decided is safe from Kettle. Kettle's has a lamp in it. Brisk's doesn't; Brisk sleeps standing, or looks like it.

Ohl is sitting on the wagon's tailboard with the oilcloth open on his knee and the lamp from Kettle's tent held over it, which she let him take, which she lets nobody do.

"Two hundred and eleven," he says, when you're close enough. "I've read it twice tonight. I keep getting to the end and finding no one new, and it should be a relief, Sergeant, and it isn't. It feels like waiting."

${SQUAD().includes('ellis') ? `"Six." He says it to the list. "I've had five in the Fourth for a year and more. I've never once had six. I keep looking at the tents and counting and it comes out wrong." A pause. "It comes out *right*. That's what's wrong."` : S.f.c2_ellisRefused ? `He closes the oilcloth. He does it without looking at you, which in Ohl is as close to a door slammed as he comes. "I'd have liked to look at her hand," he says. "That's all. It's the healer talking. Ignore him. Everybody does."` : `He closes the oilcloth. "Go and sleep, Sergeant. Or go and pretend. Tattersail told you that once. It was good advice from a woman who took none of it."`}`}`,
      fx:()=>{S.f.c2_tentSeen=1;},
      ch:[{t:'Leave'}]}),
    c2_wagon_night:()=>({sp:'The wagon', txt:
`${S.f.c2_lightDone ? `The wagon's loaded and ${c2Mule()} is in the traces. Brisk is at the tailboard with the ledger shut, waiting, which is a thing she can make sound like a remark.` : S.f.c2_wagonNight ? `Brisk is asleep against the wheel, or doing a very good impression. Her spear is across her knees. ${S.f.c2_wagon ? 'Pell the mule' : 'The mule'} is asleep too, and looks, for once, like it doesn't hate anyone.` :
`Brisk is at the wagon with her back to the wheel and the ration ledger open on her knee, though it's too dark to read and she isn't reading it.

"${SQUAD().includes('ellis') ? 'Fourteen days, six.' : 'Seventeen days, five.'}" She says it the way you'd say goodnight.

${S.f.c2_badge ? `She has the badge out. Ninth Regiment. She turns it over in her fingers the way she'd turn a coin she was deciding not to spend. "Sergeant. If Tav's dead, I want to have known it before somebody tells me. I don't know how that works. I'm working on it."` : `"Sethand's at the fire," she says. "First time. He's frightened of something, and he's not a man who frightens, and I've been trying to work out if that's better or worse than him not being frightened, and I've decided it's worse."`}`}`,
      fx:()=>{S.f.c2_wagonNight=1;},
      ch:[{t:'Leave'}]}),

    /* ---- the light ---- */
    c2_light:()=>({sp:'The fourth camp', scene:'plain_night', fx:()=>{S.f.c2_light=1;}, txt:
`It's Tuft who stands up first.

Not Sethand, who has been watching the west for four days. ${SQUAD().includes('ellis') ? `Not Ellis, out beyond the stakes with the best eyes on the plain. ` : ``}Tuft, at the fire, with her back to the west, stands up before anything has happened and turns round and says "No," once, quite quietly, the way you'd say it to someone across a room.

Then the west catches fire.

It comes up out of the horizon in a column, white going to gold going to a colour that isn't, and it doesn't flicker. Fire flickers. This stands. Two hours' hard ride, Sethand will say, when he can say anything; for now he is on his feet with his hand on his knife and his mouth open.

"That's her." Tuft's voice is nothing. "Sergeant, that's Tattersail. That's Thyr, that's her warren, she's *burning* it, she's burning all of it at once, there's nothing left after that, there's nothing you can do after that—"

Sethand, hoarse: "A mage. Dying. Two mages. One of them is very large."

Brisk hasn't moved. Brisk is looking at you.`,
      ch:[{t:'"Hitch the wagon. West. We ride to it."', go:'c2_ride'},
          {t:'"We keep the timetable. Whiskeyjack said east."', go:'c2_road'}]}),

    /* ---- ride to the light ---- */
    c2_ride:()=>({sp:'The grass at night', scene:'plain_night', fx:()=>{S.f.c2_key='light'; S.f.c2_late=1; loy('tuft',2); loy('brisk',-2); if (SQUAD().includes('ellis')) loy('ellis',1);}, txt:
`"West," you say, and Tuft is already moving, and Brisk is not.

"Sergeant." That's all. The whole of the argument. Then she picks up her shield and the spear, and goes to the wagon, and starts hitching ${c2Mule()}, because if the Fourth is going to be stupid it is going to be stupid with its rations.

Sethand doesn't argue. He looks at the light, and at you, and something in his face that you can't read is the same thing that was in it when he handed Toc the pony's reins.

"Two hours," he says. "The Rhivi will be there first. They are always there first. Do not draw on them. I mean that as I have never meant anything to a Malazan."

You go, the wagon lurching on ground it was never meant for. The light doesn't get closer for a long time and then it does, all at once, and the grass ahead is lit like day and there are riders in it.`,
      ch:[{t:'Rein in.', go:'c2_outriders'}]}),
    c2_outriders:()=>({sp:'Rhivi outriders', txt:
`Six of them, then nine, then more than you want to count: small horses, small men, bows strung, arrows on the string and not yet drawn. They come out of the lit grass in a curve and stop at a distance that is exactly a bowshot, which is not an accident.

The one in front says something in Rhivi. It has a sergeant's tone in it. Sethand answers, short. The man says it again, and this time he points at ${S.f.c2_barrowCold ? `Kettle: not the satchel, Kettle, her hands, which she has had under her arms since the barrow. He says a second word about her that Sethand does not translate. Then he points` : `Kettle's satchel, and then`} at the light, and then at you, and the meaning is very clear in any language: *not one step*.

${SQUAD().includes('ellis') ? `Ellis, at your elbow, without moving her lips: "Eleven. Four more in the grass on the left. They're not here for us. They're here for whatever's behind them."` : `Tuft, at your elbow: "Sergeant. They're afraid of us. Not of the fire. Of *us.* Malazans and a burning mage. Think about how that looks."`}

${(S.f.c2_sethTrust || 0) >= 2 ? `Sethand's hands are open on his reins. Under his breath, so low it is mostly breath, he is saying the words he said over the dead horses at dusk. He isn't saying them to the riders.` : `The man in front keeps coming back to one word, pointing at the light: the same word, every time. And there is a tune in your head that hasn't left since dusk, the few words Sethand said over the dead horses.`}`,
      ch:c2OutCh()}),
    c2_out_talk:()=>({sp:'Rhivi outriders', fx:()=>{S.f.c2_outTalked=1; loy('ohl',1);}, txt:
`${by({
  sgt:`You say it plainly, and Sethand says it plainly after you, and you watch it land:`,
  tuft:`Tuft says it. She says it to Sethand very quietly and very exactly, and then she adds one thing you didn't ask for: "Tell him I knew her." Sethand says all of it plainly after her, and you watch it land:`,
  ellis:`Ellis says it, in one sentence, the right one: "Tell him we've come late to bury one of ours." Sethand says it plainly after her, and you watch it land:`,
  kettle:`Kettle says it, with both hands held well away from the satchel, which for Kettle is a kind of oath. "Tell him we're here to bury her. Tell him we're good at it. We've had practice." Sethand says the first part plainly and leaves the rest on the grass, and you watch it land:`,
  ohl:`Ohl says it, slowly, the way he'd say a thing at a bedside, and Sethand says it plainly after him, and you watch it land:`,
  brisk:`Brisk says it in the regiment voice, the one for orders read out on parade, and Sethand says it plainly after her, and you watch it land:`,
  _:`{who} says it plainly, and Sethand says it plainly after, and you watch it land:`})} the word for *bury*, whatever it is in Rhivi, does something to the man in front. He looks at Ohl. Ohl has the flask out, and the oilcloth, and is looking back at him with the patience of a man who has argued with Hood in three languages and will learn a fourth if he has to.

A long pause. The light hums. ${!nearMiss() ? `Then the bows come down, not all at once, and the curve of riders opens in the middle like a hand.` : !['sharper','burner'].includes(S.f.c2_outToll) ? `Then the bows come down, not all at once and not all of them. The man in front keeps an arrow on the string, and keeps it on ${c2P(ROLL().who).n}, all the way through the gap that opens in the curve of riders, and ${c2P(ROLL().who).you ? 'you feel' : `${c2P(ROLL().who).n} feels`} it between the shoulders for an hour afterwards.` : `Then the man in front holds out his hand. Not to you. To Kettle. Sethand doesn't translate; he doesn't need to. Kettle looks at you, and you nod, and she puts a ${S.f.c2_outToll} in the Rhivi's palm the way you'd hand over a sleeping child. He stows it in his saddle-bag, very carefully, and only then does his bow come down, and the rest come down with it, and the curve of riders opens in the middle like a hand.

"He says Malazan fire does not go near the dead," says Sethand. "He says he will give it back." A pause. "He will not give it back."

Kettle, under her breath: "It's a *loan*."`}${cleanRoll() ? `

The man in front touches two fingers to his brow, at ${c2P(ROLL().who).n}, and Sethand looks at ${c2P(ROLL().who).them} as if ${c2P(ROLL().who).they} had grown an inch.` : ''}

The man in front says one more thing, to Sethand, and Sethand translates without being asked, which is the first time.

"He says: *look. Do not touch. And do not ask what we carry.*"`,
      ch:[{t:'Ride through.', go:'c2_ashes'}]}),
    c2_out_seth:()=>({sp:'Sethand', fx:()=>{S.f.c2_outSeth=1; loy('brisk',1);}, txt:
`Sethand walks his horse forward. Alone, into the bowshot, with his hands open, and says four words, and then says his name, and then says a longer thing that has the word *Mhybe* in it twice.

The bows come down. All of them, at once, the way a field of grass goes down under one wind.

He rides back. His face has not changed and everything about him has. "That is spent, Malazan. I will not be able to do it again on this plain for a year, and you owe me a thing you will not be able to pay. Ride through. Look. Do not touch. And do not ask what they carry."`,
      ch:[{t:'Ride through.', go:'c2_ashes'}]}),
    c2_out_fight:()=>({sp:'Rhivi outriders', txt:
`${S.f.c2_outTalkTried ? by({
  sgt:`Something goes wrong in the translation, or nothing does and it wouldn't have mattered.`,
  tuft:`Tuft says it, and says *cadre*, because it's true, and Sethand translates it, because she asks him to. On this plain, tonight, with that light behind them, it is the worst word she could have found.`,
  ellis:`Ellis says it in one sentence, and it's the right sentence, in a Claw scout's flat voice; and the man in front has heard that voice before, on this plain, saying other things.`,
  kettle:`Kettle tells Sethand to tell them that the Fourth are here to bury her, and that they're very good at it, they've had practice. Sethand, Hood help him, translates all of it.`,
  _:`{who} says it, and Sethand says it after, and something goes wrong between the one and the other.`}) : `Something goes wrong in the translation, or nothing does and it wouldn't have mattered.`} The man in front says a word that is the same in every language, and the bows come up.

Brisk's shield is already there.`,
      ch:[{t:'Fight', go:()=>startBattle('outriders',{surprise:'e'})}]}),
    /* ✦ the Rhivi Spirit-Song: the words Sethand said over the dead horses, with the man in front's word where the horse was */
    c2_song:()=>{ const p = c2P(ROLL().who), given = !!S.f.c2_songGiven; return {sp:'Rhivi outriders', fx:()=>{ S.f.c2_outSang=1; S.f.c2_songWho=ROLL().who || 'sgt'; S.f.c2_sethTrust=(S.f.c2_sethTrust || 0) + 1; }, txt:
`${given ? `Sethand gives you the words. He does it without turning his head, under his breath: the few words he said over the dead horses at dusk, and then, where the horse was, a different word, the one the man in front keeps saying at the light. Then he stops, and leaves the next breath empty for somebody else.` : `The words are the ones Sethand said over the dead horses at dusk, the same few, with nearly a tune. Somewhere in them is the word for *horse*. The man in front has been saying another word all this while, pointing at the light, the same word every time.`}

${by({
  sgt:`It's you. Marines don't sing; they count. You sing it anyway, the few words, low, with his word where the horse was.`,
  ohl:`It's Ohl. He has a voice for it, which nobody knew: low, cracked down the middle, patient. "I have a rule," he says, before he starts. "I learn the words for the dead in every tongue I am likely to need them in. I made it at dusk." Then he sings it, with the man's word where the horse was.`,
  tuft:`It's Tuft. She sings it the way she says *Yes, Sergeant*: very quietly, very exactly, as if anything louder would break. When she comes to the man's word she doesn't stop. She knows who it's for. It is the first thing anyone has let her do for Tattersail.`,
  ellis:`It's Ellis. "They sing it over horses," she says, before. "I heard it from a ridge once, scouting with Toc. You change one word." She sings it flat and exact, the way she'd give a count, and changes the word.`,
  kettle:`It's Kettle. She sings it loudly and badly and with total confidence, which is how she does everything, and gets every word right, which is not. She puts the man's word in the horse's place without being told; she's been listening to it the way she listens to a fuse.`,
  brisk:`It's Brisk. She doesn't sing it, exactly. She calls it, in the regiment voice, the one for reading out the names after a field; and it turns out that is what the song is.`,
  _:`It's {who}. {who} sings it low, the few words, with the man's word where the horse was.`})}

For a breath nothing happens. Then the man in front closes his mouth on whatever he was going to say, and opens it again, and sings the next line. And the next. The riders take it up, one and then four and then all of them, low, the way you'd sing in a tent with a sick child in it, and the bows are down and nobody saw them lowered.

Something comes with the song that wasn't in it at dusk. ${S.f.c2_barrowCold ? `Kettle's hands, cold since the barrow, are warm, and she looks at them as if they belonged to someone else.` : `Ohl's hands, which have not been still since the ridge, are still.`} Brisk lets her shield down an inch, which she has never done for anything she couldn't see the end of. Sung for the dead, the words carry the dead. Sung over the living, they carry something else, and for as long as it lasts the Fourth is standing in it.

${given ? `Sethand doesn't look at you. "I did not teach you that," he says. "If the clans ask, I did not." A pause. "I will be asked."` : `Sethand is looking at ${p.n} the way a man looks at weather he did not forecast. "Nobody taught you that," he says. "I am telling you so you will know that nobody did."`}

The man in front says one more thing, to Sethand, and Sethand translates it without being asked. "He says: *look. Do not touch. And do not ask what we carry.*"`,
      ch:[{t:'Ride through.', go:'c2_ashes'}]}; },
    /* the song gone wrong: sung word for word, horse and all. The outriders have a name for the singer now (Sethand says it at the hills). */
    c2_song_wrong:()=>({sp:'Rhivi outriders', fx:()=>{ S.f.c2_songWrong=1; S.f.c2_songWho=ROLL().who || 'sgt'; }, txt:
`${by({
  sgt:`You sing it the way Sethand sang it at dusk: the same few words, the nearly-tune, word for word.`,
  ohl:`Ohl sings it, low and cracked and patient, word for word as Sethand sang it at dusk.`,
  tuft:`Tuft sings it, very quietly, very exactly, word for word as Sethand sang it at dusk.`,
  ellis:`Ellis sings it flat and exact, word for word as she heard it from a ridge once, and as Sethand sang it at dusk.`,
  kettle:`Kettle sings it loudly and with total confidence, word for word as Sethand sang it at dusk.`,
  brisk:`Brisk calls it, in the regiment voice, word for word as Sethand sang it at dusk.`,
  _:`{who} sings it, word for word as Sethand sang it at dusk.`})}

Word for word. That's the trouble.

The man in front lets it run to the end. Then he laughs, once, short, the way you'd laugh at a child who's put a helmet on backwards; and the riders behind him do not laugh at all.

Sethand has closed his eyes. "That," he says, "is the song for a horse."${SQUAD().includes('kettle') ? `

Kettle, very quietly: "We *did* do a horse today."` : ''}

The bows haven't come up. They haven't come down either. And the man in front has a word for ${c2P(ROLL().who).n} now, which he says to the rider beside him, and which Sethand will not translate, and which, from the shape of it, has a horse in it.`,
      ch:c2OutCh()}),
    c2_after_outriders:()=>({sp:'The grass at night', scene:'plain_night', fx:()=>{ S.f.c2_outFought=1; loy('ohl',-1); }, txt:
`It's bad, twice, and then it stops, because the man in front is down on the lit rise and the ones still in the saddle are dragging him and the others back into the grass, and the curve of riders is a curve again, further off, and nobody is loosing.

Nobody is dead. Ohl went to the first one that fell and the Rhivi let him, which is a thing you'll think about later. He comes back with blood to the wrist and a face like a shut door.

"They are *children*, Sergeant," he says, in Malazan, and then something in Ehrlii that isn't.

Sethand has not drawn. He rides forward now, alone, into the space you've cleared, and says something, and it costs him; you can see it cost him. The riders let you through.

"Look," he says, not turning. "Do not touch. And do not ask what they carry. And do not, Malazan, ever tell anyone I brought you here."`,
      ch:[{t:'Ride through.', go:'c2_ashes'}]}),
    c2_ashes:()=>({sp:'The ashes', scene:'plain_night', fx:()=>{S.f.c2_ashes=1; S.f.c2_lightOut=1;}, txt:
`The light is gone by the time you reach the place, and it leaves a dark behind it that the stars can't get into.

A circle of burned grass a hundred paces across, and in the middle of it the ground has gone to glass. Black glass, still ticking as it cools. Two shapes in it. One is very large, larger than a man should be, on its back with its arms out, and the glass has gone over it like water over a stone. The other is small, and near it, and you don't look at the other for long, because you knew her.

The Rhivi are already here. Thirty of them. They are not looking at the glass. They are on the far edge of the circle, and in the middle of them is an old woman, and in the old woman's arms is something wrapped in a horse-blanket, and the whole of the Rhivi are standing around it the way the Fourth stood around Kettle's cusser at the Pale, except that they are not frightened of it. They are frightened *for* it.

Ohl has the oilcloth open on his knee. He writes. One line. He closes it. "She was not mine to write, Sergeant. I wrote her." His hand is steady. His voice isn't.

Kettle, very quietly: "Sail."

Tuft is on her knees at the edge of the glass.`,
      ch:[{t:'Go to Tuft.', go:'c2_ashes_tuft'},
          {t:'"Sethand. What are they carrying?"', go:'c2_ashes_rhivi'},
          {t:'"Ohl. The line. What did you write?"', go:'c2_ashes_ohl'}]}),
    c2_ashes_tuft:()=>({sp:'Tuft', fx:()=>{S.f.c2_ashesTuft=1;}, txt:
`She doesn't hear you come up. When she does, she doesn't turn round.

"I knew it was her before he said. Before the light. I was standing at the fire and something in the warren went cold, the way it goes cold when a door you've been holding shut gets opened from the other side, and I *knew*."

She puts a hand flat on the glass. It should burn her. It doesn't.

"The big one's Bellurdan. Thelomen. He was on the staff. He carried Nightchill's body south from Pale because he was told to, and he came after her because he was told to, and he didn't want to, and he did it anyway, and she burned him and herself rather than let him." Her voice hasn't risen at all. "Somebody told him to, Sergeant. Somebody sent a man who didn't want to go. I was on that staff. I know what that sounds like when it's said in a tent."

${S.f.knowTruth && S.ending === 'claw' ? `"*Moved before the Spawn attacked.* We read it, and then we gave it to the Claw, and she never saw it. She died without it." A breath. "He'll have read it the morning after, and put it in a drawer."` : S.f.knowTruth && S.ending === 'burned' ? `"*Moved before the Spawn attacked.* You read it. Varrow wrote it. She burned it without reading it, and now there's nobody left who read that page who isn't in this squad."` : S.f.knowTruth ? `"*Moved before the Spawn attacked.* You read it. Varrow wrote it. She died carrying it, and now there's nobody left who read that page who isn't in this squad."` : S.f.c1_plant ? `"She talked to you about me, outside the tent. She wouldn't tell me what she said. I'd give a lot to know now. I'd give the Deck."` : ''} "She sewed a badge on my collar once. I don't wear it. I'm going to start."

She takes her hand off the glass. Where it was, there's a print, and the print stays.`,
      ch:[{t:'"Whoever sent him, Tuft, he\'s not here. We are."', fx:()=>{loy('tuft',1); S.f.c2_tuftSteadied=1;}, go:'c2_ashes_more'},
          {t:'Say nothing. Stand next to her.', fx:()=>{loy('tuft',1); S.f.c2_tuftStood=1;}, go:'c2_ashes_more'},
          {t:'"Up. We\'ve seen what we came for."', fx:()=>{loy('tuft',-1); loy('brisk',1);}, go:'c2_ashes_more'}]}),
    c2_ashes_rhivi:()=>({sp:'Sethand', fx:()=>{S.f.c2_askedRhivi=1;}, txt:
`"Do not ask. I said." He hasn't dismounted. His hands are on the reins and they are not still, which you have never seen.

"I will not tell you, Malazan, and then you will know that I did not, and that is more than you should know. It is a thing the plain found in the fire. It is a thing that is ours now, and was not, and the Mhybe has it, and that is all. That is *all.*"

The old woman across the circle has not looked up. The bundle in her arms is small. It is the size of a thing you don't say. The Rhivi around her are singing, very low, and it is not a song for the dead.${S.f.c2_outSang ? ((p) => ` ${p.N} ${p.you ? 'know' : 'knows'} the song for the dead now; ${p.they} sang it at the bowshot. This isn't it.`)(c2P(S.f.c2_songWho)) : ''}

${SQUAD().includes('ellis') ? `Ellis, at your elbow, in a voice with no weight in it at all: "It moved. Sergeant. Whatever it is. It moved." She doesn't say it again.` : `Kettle has stopped naming things. She's looking at the bundle and her lips are moving and nothing is coming out.`}`,
      ch:[{t:'Go to Tuft.', req:()=>!S.f.c2_ashesTuft, go:'c2_ashes_tuft'},
          {t:'"Ohl. The line."', req:()=>!S.f.c2_ashesOhl, go:'c2_ashes_ohl'},
          {t:'Enough. Nobody should see this longer than they have to.', go:'c2_ashes_more'}]}),
    c2_ashes_ohl:()=>({sp:'Ohl', fx:()=>{S.f.c2_ashesOhl=1; loy('ohl',1);}, txt:
`He doesn't open the oilcloth again. He tells you.

"*Tattersail. Cadre. Two hundred and twelve.* That is the line, Sergeant, and there is a thing wrong with it, and I will tell you what it is so you can stop looking at me like that."

"She is the first name on that list I could not have saved. Every other one, I was there. I had my hands in them. Her I was two hours away, and too late." He folds the oilcloth along its old creases. "I have decided that counts. I have decided the list is not a list of my failures. It is a list of the ones I would have tried for. That changes it. I am fifty-eight and I have changed it tonight, on the back of a wagon, and I would like you to remember that I did, because I will not."

Then, because he is Ohl: "Drink something. Not the tea. The other flask."`,
      ch:[{t:'Go to Tuft.', req:()=>!S.f.c2_ashesTuft, go:'c2_ashes_tuft'},
          {t:'"Sethand. What are they carrying?"', req:()=>!S.f.c2_askedRhivi, go:'c2_ashes_rhivi'},
          {t:'Enough.', go:'c2_ashes_more'}]}),
    c2_ashes_more:()=>({sp:'The ashes', txt:
`The Rhivi are going. They go the way they came, in a curve, and the old woman rides in the middle of them with the horse-blanket held against her chest, and not one of them looks back at the glass.

Brisk has the wagon turned already. Brisk has not looked at the glass either. She is looking east, where the timetable is, and she has not said one word since the ridge, and she is not going to.

Something crosses the stars.

It's big. It's slow. It's the wrong shape for a bird and it's a bird anyway, and it comes down in a long spiral over the glass, and lands on Bellurdan's outflung hand as if it were a branch, and folds its wings, and looks at you.`,
      ch:[{t:'Look back at it.', go:'c2_crone'}]}),

    /* ---- keep the timetable: the road ---- */
    c2_road:()=>({sp:'The fourth camp', scene:'plain_night', fx:()=>{S.f.c2_key='road'; loy('brisk',1); loy('tuft',-2); loy('ohl',-1); if (SQUAD().includes('ellis')) loy('ellis',-1);}, txt:
`"East," you say. "Whiskeyjack said east."

Brisk nods. Once. She goes back to the fire and feeds it a stick, and that is her whole opinion, and it is the right one, and it does not feel like it.

Tuft doesn't say anything. Tuft sits down where she was standing, on the ground, with her back to the fire and her face to the light, and she does not move again for the rest of the night. Kettle goes and sits beside her, and after a while puts a hand on her shoulder, and Tuft lets her, which is a thing you have not seen.

Ohl closes the oilcloth. He doesn't open it again. "Somebody is dying," he says, to the fire, "and we are counting rations." It isn't an argument. It's a line in a ledger; he's putting it where he'll find it.

Nobody sleeps. The light burns in the west for two hours and doesn't flicker, and then it goes out all at once, the way a lamp does when a hand closes on it, and the dark it leaves is worse.

${SQUAD().includes('ellis') ? `Ellis comes in from the stakes an hour before dawn. "Sergeant. Three. On foot, walking, from the west, and they're not Rhivi, and I couldn't see them until they wanted me to."` : `Sethand, an hour before dawn, on his feet with his knife out: "Malazan. Get up. Something is coming across the grass, and it is not walking like anything I know."`}`,
      ch:[{t:'"Stand to."', go:'c2_andii'}]}),
    c2_andii:()=>({sp:'Tiste Andii', scene:'plain_night', fx:()=>{S.f.c2_andii=1; S.f.c2_lightOut=1;}, txt:
`Three of them. Tall, taller than Brisk, and the tallness is wrong for people; it's the tallness of something that had a long time to grow. Silver hair, long and unbound, and skin the colour of the dark between the stars, and eyes that have the light of the dead fire in them, still, hours after it went out.

They stop at the edge of the firelight. They don't come into it. Their swords are on their backs and their hands are empty and it makes no difference at all.

Brisk has her shield up. Kettle has her hand on the satchel and has not opened it. Tuft has not stood. Tuft is looking at them from the ground the way she looked at the light, and her lips are moving, and the word on them is a name you learned at the Pale from the sky, and it is *Rake*.

The one in the middle looks at each of you in turn. Counts. Arrives at ${SQUAD().includes('ellis') ? 'six' : 'five'}.${S.f.c2_printsTrod ? ` His eyes go back once, to ${c2P(S.f.c2_printsWho).poss} boots, and stay there a moment longer than they should.` : ''}

"Malazans." A voice like a door in a very large house. "The light. Did you go to it?"

That's the question. You understand, somehow, that it's the only one.`,
      ch:[{t:'"No. We had orders. East."', go:'c2_andii_no'},
          {t:'"We watched it. All night. We didn\'t go."', go:'c2_andii_no'},
          {t:'Answer them. Somebody watch their faces.', check:['wits',12],
            edges:id=>[id === 'kettle' && S.f.c2_bones && ['Kettle has been reading tells since the bones', 1], S.f.c2_printsTrod && id === S.f.c2_printsWho && ['Hound-ground on these boots: the Andii keep looking', -1]],
            near:{t:()=>`${NAME(ROLL().who)} sees it, and is seen seeing it.`, fx:()=>{ S.f.c2_andiiStared=1; S.f.c2_andiiStaredWho=ROLL().who; }},
            go:'c2_andii_fear', fail:'c2_andii_caught'}]}),
    c2_andii_no:()=>({sp:'Tiste Andii', txt:
`The one in the middle nods. It's a small movement. It has centuries in it.

"No," he says. "Nor did we."

Nothing else. Not why, not what it was, not who. They stand there for the space of a breath that is longer than a breath, and then they turn, all three at once without a word between them, and walk back into the grass toward the west, toward the place where the light was, and the grass does not move to let them through.

Kettle, when they're gone: "They asked one thing and answered nothing. That's not a patrol. That's a *sermon*."

"Tiste Andii," says Tuft, from the ground. "Rake's. Three of them. Nobody's ever seen three of them and not been in a war." She doesn't get up. "We're in one. We just haven't been told."`,
      ch:[{t:'Watch them go.', go:'c2_andii_go'}]}),
    c2_andii_fear:()=>({sp:'Tiste Andii', fx:()=>{S.f.c2_andiiFear=1; S.f.c2_andiiFearBy = ROLL().who || 'sgt'; loy('tuft',1);}, txt:
`${by({
  sgt:`You answer, and while you answer you watch, and you see it.`,
  ohl:`You answer. Ohl watches their hands, because hands are where a healer looks first: the face is what a man has decided to show you, and the hands are what he hasn't. And Ohl sees it.`,
  ellis:`You answer. Ellis doesn't look at their faces at all. She counts their hands, which is what she does with everything, and loses the count at the younger one's, because they will not stay still long enough to be counted.`,
  kettle:`You answer. Kettle watches them ${S.f.c2_bones ? `the way she watched Hedge's hands over the bones, for the tell` : `the way she'd watch a lit fuse, for the moment it does the thing`}, and she finds it.`,
  tuft:`You answer. Tuft watches them from the ground, with the name still on her lips, and she sees it first.`,
  brisk:`You answer. Brisk watches them over the rim of her shield, which is how she watches everything, and she sees it.`,
  _:`You answer, and while you answer {who} watches, and sees it.`})}

Not in the one who asked. In the one on the left, who is younger, if that word means anything, and who has not stopped looking west since they stopped walking. His hands are empty and his hands are not still. And the one who asked has put himself half a pace in front of the younger one, the way Brisk puts a shield in front of Kettle without being asked, and it isn't for you.

They are afraid. Not of the Malazans. Not of the plain. Of what they saw in the light, or of what came out of it after, or of what their lord will say when they tell him, and you don't know which, and you know it doesn't matter, because they are Tiste Andii and they have lived longer than the Empire and they are *afraid*.

"No," the one in the middle says. "Nor did we."${nearMiss() ? ` And then, without turning his head, he looks at ${c2P(ROLL().who).n}. Only that. It is like being looked at by a door.` : ''} And they turn, and go, and the younger one looks back. Once. West.

${ROLL().who === 'ellis' ? `"The young one's afraid of what they saw," Ellis says. "The old one's afraid of what the young one will do about it."

` : ''}${ROLL().who === 'tuft' ? `"They're the oldest thing on this plain," Tuft says, when they're gone.` : `Tuft has seen it too. "They're the oldest thing on this plain," she says, when they're gone.`} "And they're scared of the second-oldest. I'd like that written down somewhere, Sergeant. I'd like somebody to have it."`,
      ch:[{t:'Watch them go.', go:'c2_andii_go'}]}),
    /* a watch that was noticed: the one in the middle looks back at whoever was watching (Sethand and Crone both remark on it) */
    c2_andii_caught:()=>{ const p = c2P(ROLL().who); return {sp:'Tiste Andii', fx:()=>{ S.f.c2_andiiStared=1; S.f.c2_andiiStaredWho=ROLL().who || 'sgt'; }, txt:
`${by({
  sgt:`You answer, and you watch while you answer, and you watch too hard. You're a sergeant; you have never in your life looked at a thing without wanting to know what it will do next, and the one in the middle feels it like a hand on his sleeve.`,
  ohl:`You answer. Ohl watches the way he'd watch a wound, close and patient, and forgets, for a moment, that this one can watch back.`,
  kettle:`You answer. Kettle stares. She doesn't mean to. She has never seen anything so tall, and she has never in her life been able to not look at a thing.`,
  ellis:`You answer. Ellis watches the way the Claw taught her, which is very well; and the Claw never taught her what to do when the thing being watched has been watched by better for ten thousand years.`,
  tuft:`You answer. Tuft watches from the ground, and her lips are still moving, and that is what does it: his lord's name, in a Malazan mouth, at his feet.`,
  brisk:`You answer. Brisk watches over the rim of her shield, the way she watches everything; and the one in the middle has been watched over shields before, by better, and knows the feel of it.`,
  _:`You answer. {who} watches too hard.`})}

${ROLL().who === 'sgt' ? 'He' : 'The one in the middle'} turns his head and looks at ${p.n}, and only at ${p.them}, for the space of a long breath. It isn't anger. It is the look you give a page you mean to find again.

${p.you ? `"No," he says. "Nor did we."` : `"No," he says, to ${p.n}, not to you. "Nor did we."`}

Nothing else. They turn, all three at once without a word between them, and walk back into the grass toward the west, and the grass does not move to let them through.

Kettle, when they're gone: "They asked one thing and answered nothing. That's not a patrol. That's a *sermon*."

"Tiste Andii," says Tuft, from the ground. "Rake's." She doesn't get up. "And he looked at ${p.you ? 'you' : ROLL().who === 'tuft' ? '*me*' : p.n}, Sergeant. They don't look at *us*. Nobody's ever told me what it means when they do."`,
      ch:[{t:'Watch them go.', go:'c2_andii_go'}]}; },
    c2_andii_go:()=>({sp:'The fourth camp', txt:
`Grey in the east. The fire's out; nobody fed it after the Andii, and nobody noticed till now.

Sethand puts his knife away. He has held it the whole time and it has been no use at all and he knows it. "The Andii do not walk," he says. "They fly, on the Moon, and they do not come down. They came down. For that." He looks west. "The clans will be talking about this when your Empire is a story."${S.f.c2_andiiStared ? ((p) => ` He looks at ${p.n}. "And one of you read them. The Andii do not like to be read, Malazan; they would rather be feared. ${p.N} ${p.has} given one of them a face to keep, and they keep things a very long time."`)(c2P(S.f.c2_andiiStaredWho)) : ''}

Something crosses the grey.

It's big. It's slow. It's the wrong shape for a bird and it's a bird anyway, and it comes down in a long spiral over the dead fire, and lands on the wagon's tailboard as if it were a branch, and folds its wings, and looks at you.`,
      ch:[{t:'Look back at it.', go:'c2_crone'}]}),

    /* ---- Crone ---- */
    c2_crone:()=>({sp:'Crone · Great Raven', fx:()=>{S.f.c2_crone=1;}, txt:
`It's the size of a dog. Its feathers are black and its eyes are black and there is something in the eyes that is not a bird's and is not a person's and is very, very old. It cocks its head. It looks at Brisk's shield, and Kettle's satchel, ${S.f.c2_printsTrod ? `and ${c2P(S.f.c2_printsWho).poss} boots, for a long and interested moment, ` : ''}and Tuft, longest.

Then it opens its beak and laughs.

"Malazans! Ha! ${S.f.c2_key === 'light' ? `On the glass, with the dead still warm and the Rhivi still singing. Of *course* you are. Where there is a corpse and a lesson, there is a Malazan, standing on the one and missing the other.` : `Sat on a ridge all night, watching a mage burn, counting your bread. Ha! *Disciplined*. My lord will be pleased. He so admires discipline in things he intends to step on.`}"

The voice is a crow's voice, cracked and dry, and the words are as clear as a lawyer's.

"Crone, little soldiers. Eldest of the Great Ravens, and the one Anomander Rake sends when he wants a thing *seen*, because ravens see, and we remember, and we are so very hard to kill." It preens, once, an old woman settling a shawl. "I have been over the whole of this plain tonight and you are the most interesting thing on it, and that is not a compliment. Interesting things get *eaten*."${S.f.c2_printsTrod ? `

The head turns to ${c2P(S.f.c2_printsWho).n}. "And *you*. You've been standing where a Hound went home. Ha! It's on your boots. Wipe them or don't. The Hounds won't mind."` : ''}${S.f.c2_andiiStared && S.f.c2_key === 'road' ? `

"And one of you *stared* at my lord's children. Ha! They'll carry that face home. They carry everything home. It's why the Moon is so *heavy*."` : ''}`,
      ch:[{t:'"What did you see? Out there."', go:'c2_crone_saw'},
          {t:S.f.c2_key === 'light' ? '"Get off him."' : '"Get off my wagon."', fx:()=>loy('brisk',1), go:'c2_crone_off'}]}),
    c2_crone_saw:()=>({sp:'Crone', fx:()=>{S.f.c2_croneSaw=1;}, txt:
`"Everything, child. It is what I *do*."

${S.f.c2_key === 'light' ? `"I saw a fat woman on a bad horse run four days from a man who loved her, and turn, and burn them both, and I saw what the fire made, and so did the Rhivi, and so, I think, did your little mage. Ask *her* what she saw. I am too old to tell children the ends of stories."` :
  `"A mage. Burning. Two mages; one who ran and one who followed, and neither of them wanted to be there, and both of them were sent." The eye fixes on Tuft. "You know the word *sent*, child. You have the look of the sent. I have seen it on Tiste Andii. I have seen it on my lord. It is not a look that ends well, and it does not end at all."`}

"And a woman with a thing walking beside her that is not a man, going to the hills, going to *wake* something. And a captain, gone into the ground with a Hound, and not dead, which is annoying; I had the eyes marked. And eight soldiers who went south by quorl and have gone under a city like rats under a floor." The head cocks. "Your friends. You'll be a week behind them. You'll be *late*, Malazan. Everyone is going to be late to what is coming, and you will be the latest, and it may be that that is the only reason you'll live through it."

The head cocks the other way, and the black eye takes you in, all of you, the way a clerk takes in a page. "Sergeant {sgt}," it says. Nobody told it. "There. Now I have it."`,
      ch:[{t:S.f.c2_key === 'light' ? '"Get off him."' : '"Get off my wagon."', go:'c2_crone_off'}]}),
    c2_crone_off:()=>({sp:'Crone', txt:
`"Ha! *Manners*." It doesn't move. Then it does, all at once, a beat of wings that puts the fire's ash in the air and Kettle's hand on the satchel, and it's above you, circling once, the wrong shape for a bird.

${S.f.c2_key === 'light' ? `"Sergeant." The voice comes down clear. "The girl on her knees on the glass. Keep her. Not for her sake. For what she'll be worth to someone, and it will not be you, and it will not be me, and I would *so* like to see the face of whoever it is."` : `"Sergeant." The voice comes down clear. "You counted your bread while she burned. Good. Keep counting. Somebody in this war is going to need soldiers who do as they are told, and my lord has none, and it is his only weakness, and I have told him so."`}

Then it's a shape against the grey, going south-east. Toward the hills. Toward the city. Ahead of you, like everything else.

${SQUAD().includes('ellis') ? `Ellis, quietly: "It was counting us. Not our heads. Our *eyes*. I know that look. I've done that look."` : `Tuft, from the ground: "It knew my name. It didn't say it. It knew it."`}`,
      ch:[{t:'Dawn. Break camp.', go:'c2_dawn'}]}),
    c2_dawn:()=>({sp:'The fifth morning', scene:'plain', fx:()=>{S.f.c2_lightDone=1;}, txt:
`${S.f.c2_key === 'light' ? `It's full day by the time you're back at the ridge, and the ridge is a ridge, and the tents are where you left them, and Brisk strikes them without a word and without looking at anyone and loads the wagon and hitches ${c2Mule()} and stands by the tailboard waiting, and the waiting is a sentence with your name in it.

"A day," she says, when you're close enough. "That's what that cost. Whiskeyjack's *eleven days* are twelve now, and he'll know, because he's the kind that knows, and he'll ask, and I'll tell him."

Tuft has not spoken since the glass. She walks. She doesn't walk in the tall grass any more; she walks beside the wagon where everyone can see her, and it's the first time, and nobody says so.` :
`It's full day. The ridge is a ridge. In the west, where the light was, there's nothing: grass, sky, a low smudge that could be smoke and could be cloud. Sethand looks at it once and then doesn't.

Brisk has the tents struck and the wagon loaded and ${c2Mule()} hitched before the sun's clear of the horizon. She is very efficient this morning. She is efficient the way a woman is who has been proved right and would rather not have been.

Tuft has spoken to nobody since the light. She walks in the tall grass, where you can't see her hands. Kettle walks beside her, on the outside, and doesn't say anything either, which for Kettle is a kind of shouting.`}

Sethand: "South. Two days, and the grass changes, and then the hills."`,
      ch:[{t:'East.', go:'c2_to_hills'}]}),
    /* the ridge's exit tile, and also the way on from c2_dawn (a backdrop, so "Not yet" is offered only on the map) */
    c2_to_hills:()=> S.f.c2_lightDone ? {sp:'East · the hills', txt:
`Two days of grass, and then it changes: shorter, greyer, with stones coming up through it like knuckles. Sethand says this is where the road ends and the hills begin, and that the hills are Gadrobi, and that the Gadrobi are not Rhivi, and that this is the last thing he will explain to a Malazan.`,
      ch:[{t:'Into the hills.', go:()=>{ startExplore('hills_edge'); talk('c2_hills'); }},
          {t:'Not yet.', req:()=>view === 'explore'}]} : S.f.c2_light ? {sp:'East · the hills', txt:
`Not now. There's a light in the west and the whole of the Fourth is looking at it, and so are you.`,
      ch:[{t:'Not yet.'}]} : {sp:'East · the hills', txt:
`It's night. Sethand said the ridge, and the ridge is here, and the hills are two days east in the dark. Nobody is going anywhere tonight.`,
      ch:[{t:'Not yet.'}]},

    /* ---- the edge of the Gadrobi Hills ---- */
    c2_hills:()=>({sp:'The edge of the Gadrobi Hills', scene:'plain', fx:()=>{S.f.c2_hills=1;}, txt:
`The last morning. The hills come up out of the plain ahead like something surfacing, brown and bare-shouldered, and the road, which has not been a road for ${S.f.c2_late ? 'seven' : 'six'} days, becomes one again: cart-ruts, a cairn, a dead fire that isn't yours.

And to the south-west, past the hills, low on the horizon, a smudge. Blue. Not sky-blue; the blue of a flame with something wrong in it. It doesn't move. It's been there since first light and Kettle saw it first and said nothing, which is how you knew it was real.

"Darujhistan," Sethand says. He's stopped his horse. He won't go further. "The blue is gas, under the streets, in the lamps. The Gadrobi say the city is built on a dead god's breath and lights its lamps with it. The Gadrobi are drunk a great deal."

${SQUAD().includes('ellis') ? `Ellis has stopped too. She's looking at the blue the way Toc looked at the place where the spiral stopped.

` : ``}${S.f.c2_key === 'light' ? `Brisk, at the wagon: "Eleven days, he said. It'll be twelve. You can tell him why or I can, Sergeant, and you'll do it better, and I'll do it first."` : `Brisk, at the wagon: "Eleven days, he said. It'll be eleven. Somebody write that down."`}`,
      ch:[{t:'"Sethand. The dust-line. What was it?"', go:'c2_hills_dust'},
          {t:'"Ellis. You\'ve seen it before."', req:()=>SQUAD().includes('ellis') && !S.f.c2_hillsEllis, go:'c2_hills_ellis'},
          {t:'The road. The city.', go:()=>startExplore()}]}),
    c2_hills_dust:()=>({sp:'Sethand', fx:()=>{S.f.c2_hillsDust=1; S.f.c2_hillsSeth=1;}, txt:
`He's quiet for long enough that ${c2Mule()} shifts in the traces.

"A woman on a horse. Malazan. Not a soldier, though she rides like one and kills like one; the clans watched her kill a Rhivi boy on the third day for seeing her, and the thing beside her did not help, and did not need to." His hands are still on the reins. He has made them be. "The thing that is not a man is a thing that was buried. ${S.f.c2_sethBarrows ? `The barrows I told you not to open, Malazan` : `The barrows on the plain, Malazan, the ones your people walk past`}: it is what they were *for*. It walks with her because she has a word that makes it walk, and she is taking it into those hills, and there is something in those hills that has been asleep since before the Rhivi, and she is going to wake it."

He turns the horse.

"I do not know what your Empress wants with a thing like that. I know what the grass will do when it wakes. It will burn. Ride on to your city. I hope it is there when you reach it. I hope, Malazan, that you are."${S.f.c2_songWrong ? ((p) => `

He stops the horse again, half-turned. "The outriders have a name for ${p.n} now." Something happens at the corner of his mouth. "*Horse-singer.* It is not an insult. It is not not one. It will be at the Mhybe's fires before you are in your city."`)(c2P(S.f.c2_songWho)) : S.f.c2_outSang ? ((p) => `

He stops the horse again, half-turned. "The song, at the bowshot. The clans will ask me who taught a Malazan the words for the dead." He looks at ${p.n}. "I will tell them the grass did. It is nearly true."`)(c2P(S.f.c2_songWho)) : ''}

${(S.f.c2_sethTrust || 0) >= 2 ? `And then, without looking back: "You listened. When I said *do not*, and when I said nothing. That is more than any Malazan. If the Fourth comes back across the plain, come by the Mhybe's fires. Say my name. It will be worth something, once."` : `He doesn't say anything else. He has said, by his count, more than enough.`}`,
      ch:[{t:'"Ellis. You\'ve seen it before."', req:()=>SQUAD().includes('ellis') && !S.f.c2_hillsEllis, go:'c2_hills_ellis'},
          {t:'The road. The city.', go:()=>startExplore()}]}),
    c2_hills_ellis:()=>({sp:'Ellis', fx:()=>{S.f.c2_hillsEllis=1;}, txt:
`"Twice." She doesn't take her eyes off the blue. "Once as a child. My mother was Gadrobi; she sold horses at the Fete. Once as Claw."

She lets that sit.

"The Claw have a house there, Sergeant. Lakefront, near the Gadrobi quarter, a wine-merchant's with a green door. They've had it four years. I carried a letter to it once. I don't know what was in the letter. I know that the man who took it looked at my hand, before it was burned, and said *pretty*, and wrote something down."

${S.f.clawFavour ? `"Your grey cloak at the Pale. He'll have a letter there too. About you. It'll be *neat*." She finally looks at you. "I'm not telling you that to frighten you. I'm telling you so that when we walk past the green door you'll know why I don't."` : S.f.marked ? `"He'll know your name there, Sergeant. The one who wrote it down. That's what the house is for; it's where names go." She looks at you. "I'd walk past the green door on the far side of the street. That's not advice. It's what I'm going to do."` : `"I'd like not to go near the green door. I'd like that put in the ledger, next to the mule."`}

${S.f.c2_horseHow === 'botched' ? `"And the mare. It was twice." She looks at you. "I've put it down as once. I'd like it left that way."

` : ''}${S.loy.ellis >= 1 ? `Then, drier: "Also, the fish is good. Lakefront. Say I sent you. Then run."` : `She goes back to the wagon. She walks on the side away from Tuft, still, and Tuft has noticed, and neither of them has said a word about the Deck since the ridge.`}`,
      ch:[{t:'"Sethand. The dust-line."', req:()=>!S.f.c2_hillsDust, go:'c2_hills_dust'},
          {t:'The road. The city.', go:()=>startExplore()}]}),
    c2_hills_seth_again:()=>({sp:'Sethand', txt:
`"I have said it. I do not say things twice; it is a Malazan habit and it wears the words out." He looks south-west, at the blue. "Go. Your sergeant with the sword is under that city already, and he is counting days, and he does not count kindly."`,
      ch:[{t:'Leave him.'}]}),
    c2_wagon_last:()=>({sp:'The wagon', txt:
`Brisk has the ledger open and is writing in it, in daylight, which she does when she wants something on paper before somebody argues.

"${SQUAD().includes('ellis') ? (S.f.c2_late ? 'Eleven days, six.' : 'Twelve days, six.') : (S.f.c2_late ? 'Fourteen days, five.' : 'Fifteen days, five.')} ${S.f.c2_muleNamed ? `Mule's Pell.` : `One mule.`}${S.f.c2_badge ? ' One badge, Ninth Regiment, Second Army, unclaimed.' : ''}${S.f.c2_key === 'light' ? ' One day lost, west, on the sergeant\'s order.' : ' No days lost.'}"

She closes it. "That's the plain, Sergeant. Whiskeyjack can read it or not."

${S.f.c2_key === 'light' && S.loy.brisk <= -1 ? `She doesn't look at you when she says it. She hasn't, since the ridge. It's not anger. Brisk doesn't do anger. It's a ledger, and you're in it, and the line under you hasn't been drawn yet.` : S.inv.cusser > 0 ? `Kettle, from the mule's head: "Put the cusser${S.inv.cusser === 1 ? '' : 's'} in. ${S.f.c1_cusserSold ? `Maud. Gerrun. Whichever's still with us.` : `Maud.`}" Brisk doesn't. Kettle knew she wouldn't.` : `Kettle, from the mule's head: "Put in that I haven't got a cusser to my name, and I've walked beside a crate of them for a week." Brisk doesn't. Kettle knew she wouldn't.`}`,
      ch:[{t:'Leave'}]}),

    /* ---- chapter close ---- */
    c2_close:()=>({sp:'The road into the hills', txt:
`The ruts go up between two brown shoulders of hill and out of sight. Somewhere past them, a lake, and a city on it, and eight Bridgeburners under its streets who have been waiting for a wagon since the quorls set them down.

Sethand has turned his horse west. He has not said goodbye. ${S.f.c2_sethRoad ? `He said, days ago, that he would not go into the city, and a Rhivi does not say a thing twice.` : `He will not go into the city. He has not said so. He doesn't need to.`}

${S.f.c2_key === 'light' ? `Tuft walks beside the wagon, where you can see her. She has the badge on her collar. The cadre badge. She has not said a word about it and nobody has asked, and Ohl looked at it once and then looked at you, and nodded, as if something on his list had been paid.` :
  `Tuft walks in the tall grass, or what's left of it, where you can't see her hands. She has spoken to Kettle. She has not spoken to you. The Deck is in her sleeve and she has not touched it since the ridge, and you think that she is waiting for something, and you think that it isn't the city.`}

${SQUAD().includes('ellis') ? `Ellis is out ahead, on foot, where the ruts go up into the hills, with her bow strung and her burned hand gloved. She looks back once. Counts. Arrives at six, and checks it.` : S.f.c2_ellisRefused ? `Somewhere ahead, a scout with one eye is riding after an Adjunct with a woman who could have been the Fourth's, and Ohl has not mentioned it, and will not, and the not-mentioning has a shape.` : ``}

Kettle: "${numw(S.inv.sharper, true)} sharper${S.inv.sharper === 1 ? '' : 's'}, ${numw(S.inv.burner)} burner${S.inv.burner === 1 ? '' : 's'}, ${numw(S.inv.cusser)} cusser${S.inv.cusser === 1 ? '' : 's'}, ${S.f.c2_outToll === 'sharper' || S.f.c2_outToll === 'burner' ? `one ${S.f.c2_outToll} on loan to a Rhivi who isn't giving it back, ` : ''}and a crate I still haven't opened. I want that in the ledger."

Brisk: "It's in."

The blue smudge on the horizon has not moved. It's waiting. Everything on this plain, you have come to understand, has been waiting, and the Fourth is the last thing to arrive.`,
      ch:[{t:'Into the hills.', fx:()=>{S.f.c2_done=1;}, go:()=>chapterEnd(2, S.f.c2_key || 'road')},
          {t:'Not yet.'}]}),
  }
};
