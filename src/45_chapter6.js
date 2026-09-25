/* ============ chapter 6: The Fete ============ */
/* small text helpers for the counts and the dead (after the alley any squadmate but the sergeant may be gone) */
const C6H = {
  words:n => { const o = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'], t = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']; if (!n) return 'none'; const h = Math.floor(n / 100), r = n % 100; const rr = r < 20 ? o[r] : t[Math.floor(r / 10)] + (r % 10 ? '-' + o[r % 10] : ''); return (h ? o[h] + ' hundred' : '') + (h && r ? ' and ' : '') + rr; },
  num:n => { const w = C6H.words(n); return w.charAt(0).toUpperCase() + w.slice(1); },
  list:a => a.length > 1 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : (a[0] || ''),
  names:ids => C6H.list(ids.map(id => NAME(id))),
  fell:() => (S.f.lastFallen || []).filter(id => id !== 'sgt'),
  dead:() => Object.keys(S.dead || {}).filter(id => S.dead[id] && S.dead[id].ch === 6),
  her:ids => ids.length === 1 ? (ids[0] === 'ohl' ? 'him' : 'her') : 'them',
  count:(n, w) => !(n > 0) ? `No ${w}s` : `${C6H.num(n)} ${w}${n === 1 ? '' : 's'}`   // Kettle's count: "Two sharpers", "No cussers"
};
const CH6 = {
  title:'The Fete', number:'Six',
  intro:{loc:'Darujhistan', sub:'The Gedderone Fete · three days out of the hills', cap:'Paper lanterns in every colour but blue strung over the streets, masks on every door, and over the lake a black mountain that nobody has dressed.',
    paras:[
`Three days west out of the hills on foot, with the barrow's *thud* still in the soles of your boots, and on the third morning the Worry Gate, and a clerk at it who does not ask your name, because nobody at any gate in Darujhistan is asking anybody anything today. Paran's horse passed you on the road the first morning, with Toc's on a lead rein behind it and a big man slumped across Toc's saddle, bound on, one arm hanging, and did not stop. You did not expect it to.`,
`The city is dressing. Paper lanterns strung across every street from eave to eave, red and green and amber, every colour but blue, as if the city had got tired of its own light for one night. Masks on the doors. Masks on the carthorses. Masks tied with ribbon on the statues in the squares, a bird's face on a dead councillor, a fox on a god. The Gedderone Fete, a Gadrobi woman tells Kettle, and when Kettle asks who Gedderone is, the woman looks at her the way you'd look at somebody who asked what spring was.`,
`And over the lake, where it has hung since before any of you came to this city, the Moon's Spawn. Black. Lampless. Nobody has strung a lantern on it. Nobody has tied a mask on it. Down in the streets, with the whole city looking up at its own paper lights, nobody looks at it at all, and you have learned enough about Darujhistan by now to know that this is how the city says it is afraid.`],
    go:'Down to the crossing', node:'c6_start'},

  areas:[
    /* 16 x 12.  . cobbles  , puddle  # building / Simtal's wall  L blue gas lamp  l Fete lantern pole  B crates  W wagon  x post  F brazier  D door (shut)  g Lady Simtal's gate */
    { id:'fete_street', title:'Darujhistan · the Estate District', sub:'Dusk · the Gedderone Fete', hint:'Tap the street to move · tap a figure to talk · Lady Simtal\'s gate is north', decor:'city_dusk',
      map:[ "################",
            "#####L###g###L##",
            "#..l.....,...l.#",
            "#.....,........#",
            "##..B....l..F..#",
            "#..........,...#",
            "#..l...,....W..#",
            "#......x....,..#",
            "#.,..l.....l...#",
            "#......L.......#",
            "##D####..###D###",
            "################" ],
      walk:'.,', triggers:{'g':'c6_gate'}, start:{x:1,y:5},
      npcs:[ {id:'kruppe', name:'Kruppe', kind:'kruppe', x:5, y:3, node:()=>'c6_kruppe', fresh:()=>!S.f.c6_kruppe},
             {id:'murillio', name:'Murillio', kind:'murillio', x:8, y:2, node:()=>'c6_murillio', fresh:()=>!S.f.c6_mur},
             {id:'coll', name:'A big man in plain brown', kind:'coll', x:11, y:3, still:true, node:()=>'c6_coll', fresh:()=>!S.f.c6_coll},
             {id:'crokus', name:'A boy with a rope', kind:'crokus', x:6, y:7, node:()=>'c6_crokus', show:()=>!S.f.c6_crokus, fresh:()=>true},
             {id:'rallick', name:'A man in a doorway', kind:'rallick', x:12, y:9, still:true, node:()=>'c6_rallick', fresh:()=>!S.f.c6_rallick},
             {id:'reveller', name:'A reveller in a goat mask', kind:'reveller', x:3, y:8, node:()=>'c6_reveller', fresh:()=>!S.f.c6_rev},
             {id:'horses', name:'An old Gadrobi horse-seller', kind:'reveller', x:13, y:7, still:true, node:()=>'c6_horses', show:()=>SQUAD().includes('ellis'), fresh:()=>!S.f.c6_horses} ] },

    /* . marble  , mosaic runner  # the house wall  D the lit hall doors  s statue  t banquet table  l lantern pole  b balustrade  v the steps down to the garden.  The upper terrace is the shelf in the north-east corner. */
    { id:'simtal_terrace', title:'Lady Simtal\'s estate · the terraces', sub:'Night · the Fete', hint:'Tap to move · tap a figure to talk · guard rounds: the upper terrace is north-east · the garden is down the steps, south', decor:'estate_terrace',
      map:[ "################",
            "#s.D....D..s#..#",
            "#l..........b..#",
            "#..t..,,..t.b.l#",
            "#.....,,....bb.#",
            "#s....,,.......#",
            "#.....,,..t..l.#",
            "#..t..,,.......#",
            "#l....,,....s..#",
            "#.....,,.......#",
            "#bbbbbbvvbbbbbb#",
            "################" ],
      walk:'.,', triggers:{'D':'c6_hall', 'v':'c6_steps'}, start:{x:1,y:6},
      npcs:[ {id:'baruk', name:'An old man in dark red', kind:'baruk', x:9, y:3, still:true, node:()=>'c6_baruk', fresh:()=>!S.f.c6_baruk},
             {id:'rakemask', name:'The tall guest', kind:'rakemask', x:10, y:2, still:true, node:()=>'c6_rake', fresh:()=>!S.f.c6_rakeMet && !(S.fxd && S.fxd.c6_rake)},
             {id:'kruppe_t', name:'Kruppe', kind:'kruppe', x:4, y:7, still:true, node:()=>'c6_kruppe_t', fresh:()=>!S.f.c6_kruppeT},
             {id:'simtal', name:'Lady Simtal', kind:'simtal', x:5, y:2, node:()=>'c6_simtal', show:()=>!S.f.c6_duelDone, fresh:()=>!S.f.c6_simtal},
             {id:'orr', name:'A councilman in green and gold', kind:'orr', x:9, y:5, node:()=>'c6_orr', show:()=>!S.f.c6_duelDone, fresh:()=>!S.f.c6_orr},
             {id:'mammot', name:'An old priest in a Jaghut mask', kind:'mammot', x:13, y:8, still:true, node:()=>'c6_mammot', show:()=>!S.f.c6_tuft, fresh:()=>!S.f.c6_mammotSeen},
             {id:'rallick_t', name:'The man from the doorway', kind:'rallick', x:11, y:9, node:()=>'c6_duel', show:()=>!S.f.c6_duelDone, fresh:()=>true},
             {id:'derudan', name:'A woman in a mask of feathers', kind:'reveller', x:2, y:4, still:true, node:()=>'c6_derudan', fresh:()=>!S.f.c6_derudan},
             {id:'knives', name:'Shapes on the balustrade', kind:'guildknife', x:14, y:1, still:true, node:()=>'c6_knives', show:()=>!S.f.c6_knivesDone, fresh:()=>true} ] },

    /* . lawn  , raked gravel  h hedge  f fountain  w pond  T tree  s statue  l lantern pole  A the Finnest sapling (the young Azath, after)  g the garden gate  ^ the steps up to the terrace */
    { id:'simtal_garden', title:'Lady Simtal\'s estate · the garden', sub:'Night · the Fete', hint:'Tap to move · tap a figure to talk · the terrace steps are north', decor:'estate_night',
      map:[ "################",
            "#l..hh.^^.hh..l#",
            "#......,,......#",
            "#.T..,,,,,,..T.#",
            "#..,,..ff..,,..#",
            "#h.,...ff...,.h#",
            "g..,,,,,,,,,,..#",
            "#.ww..T..s...,.#",
            "#.ww.....,,,,..#",
            "#..h..l..,..A..#",
            "#T...h.....,,.T#",
            "################" ],
      walk:'.,', triggers:{'^':'c6_steps', 'g':'c6_garden_gate'}, start:{x:7,y:2},
      npcs:[ {id:'wj', name:'Whiskeyjack', kind:'wj', x:9, y:5, node:()=>'c6_wj_garden', show:()=>!S.f.c6_key, fresh:()=>!S.f.c6_wjGarden},
             {id:'fiddler', name:'Fiddler', kind:'fiddler', x:6, y:1, node:()=>'c6_fid_garden', show:()=>!S.f.c6_key, fresh:()=>!S.f.c6_fidG},
             {id:'hedge', name:'Hedge', kind:'hedge', x:13, y:2, node:()=>'c6_hedge_garden', show:()=>!S.f.c6_key, fresh:()=>!S.f.c6_hedgeG},
             {id:'qb', name:'Quick Ben', kind:'qb', x:6, y:5, node:()=>'c6_qb_garden', show:()=>!S.f.c6_key, fresh:()=>!S.f.c6_qbG},
             {id:'paran', name:'Captain Paran', kind:'paran', x:4, y:8, still:true, node:()=>'c6_paran_garden', show:()=>!S.f.c6_key, fresh:()=>!S.f.c6_paranToc && !S.f.c6_paranG},
             {id:'crokus', name:'A boy and a girl, running', kind:'crokus', x:10, y:7, node:()=>'c6_crokus_garden', show:()=>!S.f.c6_crokusRan && !S.f.c6_tuft, fresh:()=>true},
             {id:'challice', name:'A girl in a silver half-mask', kind:'challice', x:11, y:7, node:()=>'c6_crokus_garden', show:()=>!S.f.c6_crokusRan && !S.f.c6_tuft},
             {id:'hound', name:'Something on the east wall', kind:'hound', x:14, y:3, node:()=>'c6_hound', show:()=>!!S.f.c6_wjGarden && !S.f.c6_houndDone && !S.f.c6_houndKnew, fresh:()=>true}, // same tile as houndlying: the gates exclude each other on c6_houndKnew
             {id:'houndlying', name:'The Hound, lying down', kind:'hound', x:14, y:3, still:true, node:()=>'c6_hound_lying', show:()=>!!S.f.c6_houndKnew && !S.f.c6_tuft},
             {id:'claw', name:'A grey cloak', kind:'claw', x:8, y:7, still:true, node:()=>'c6_claw', show:()=>!!S.f.c6_houndDone && !S.f.c6_tuft, fresh:()=>true},
             {id:'mammot', name:'The old priest', kind:'mammot', x:11, y:9, still:true, node:()=>'c6_tyrant', show:()=>!!S.f.c6_tuft && !S.f.c6_key, fresh:()=>true} ] } ],

  battles:{
    house_guards:{title:'The stable yard behind the gate', warrenText:'Straw and lanterns · the Fete loud over the wall · warrens steady', warren:{meanas:1,denul:1}, music:'battle', style:'city',
      map:["##....##","........",".#.,,.#.","........","..#..#..","........","#..,,..#","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['houseguard',2,1],['houseguard',5,1],['houseguard',3,3],['housecaptain',4,0]], xp:200, after:'c6_after_guards'},
    terrace_knives:{title:'The upper terrace', warrenText:'Marble and lake wind · the music forty paces off · Meanas leans into the dark · Denul holds', warren:{meanas:1.2,denul:1}, dark:true, music:'dark', style:'terrace',
      map:["#.#..#.#","........","..,,,,..",".#....#.","........","..#..#..","........","...,,...","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildknife',1,0],['guildknife',6,0],['guildknife',3,2],['guildveteran',4,0]], xp:240, after:'c6_after_knives'},
    terrace_knives_2:{title:'The upper terrace', warrenText:'Marble and lake wind · the music forty paces off · Meanas leans into the dark · Denul holds', warren:{meanas:1.2,denul:1}, dark:true, music:'dark', style:'terrace',
      map:["#.#..#.#","........","..,,,,..",".#....#.","........","..#..#..","........","...,,...","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['guildknife',1,0],['guildknife',6,0],['guildknife',3,2],['guildveteran',4,0],['guildveteran',3,0]], xp:240, after:'c6_after_knives'},
    garden_hound:{title:'The lawn by the east wall', warrenText:'Wet grass and lantern-light · something of Shadow on the lawn · Meanas swells', warren:{meanas:1.3,denul:1}, dark:true, music:'dark', style:'garden',
      map:["#......#","..#..#..","........",".#....#.","...,,...","........","#..##..#","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['houndhurt',4,1]], xp:240, after:'c6_after_hound',
      objective:{type:'survive', rounds:3, text:'Keep it off the guests. Three rounds.'} },
    tyrant_garden:{title:'Lady Simtal\'s garden', warrenText:'Omtose Phellack · the lawn freezing in rings · every warren shouldered aside by ice', warren:{meanas:0.8,denul:0.8}, dark:true, music:'dark', style:'storm',
      map:["#......#","...##...",".#....#.","........","..,..,..","#......#","........","..#..#..","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['raest',3,0],['rime',1,1],['rime',6,1],['rime',4,3]], xp:300, after:'c6_after_tyrant',
      allies:[['bbfiddler',1,9],['bbhedge',6,8]],
      objective:{type:'survive', rounds:4, text:'Hold the garden. Four rounds.'},
      waves:[{round:2, foes:[['rime',1,0],['rime',6,0],['rime',0,3]], text:'The frost goes out another ring, and where it passes the lawn heaves, and more of them come up out of it, white to the bone.'}] },
    the_mines:{title:'The vault under the Gadrobi crossing', warrenText:'Gas in the pipes · frost on the joints · one spark and there is no city · nobody throws anything', warren:{meanas:1,denul:1}, dark:true, music:'dark', style:'cellar', nothrow:true,
      map:["#..##..#","........",".##..##.","........","...,,...","#......#","..#..#..","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['clawknife',3,1],['assassin',1,1],['assassin',6,1],['clawmage',5,0]], xp:300, after:'c6_after_mines'},
    lorn_alley:{title:'An alley off the Daru District', warrenText:'Otataral · every warren is dead here · whoever falls stays down', warren:{meanas:0.2,denul:0.2}, dark:true, music:'dark', style:'city', nomagic:true, mortal:true,
      map:["##....##","#......#","#.#....#","#......#","#....#.#","#......#","#......#","#.#....#","#......#","#......#"],
      party:[[4,9],[3,6],[4,6],[3,7],[5,7],[4,7]], // the sergeant at the back with the boy; the line is already up against her
      foes:[['lorn',3,4]], xp:320, after:'c6_after_alley',
      objective:{type:'survive', rounds:3, text:'Keep her off the boy. Three rounds.'} } },

  foes:{ houseguard:{name:'House guard', sig:'g', hp:20, ac:15, atk:7, dmg:[1,8,3], rng:1, mv:4, init:2, verb:'swings a halberd at'},
         housecaptain:{name:'Captain of the house', sig:'G', kind:'houseguard', hp:32, ac:16, atk:8, dmg:[1,10,3], rng:1, mv:4, init:3, boss:true, verb:'brings a halberd down on'},
         houndhurt:{name:'Hound of Shadow, wounded', sig:'H', kind:'hound', hp:52, ac:15, atk:7, dmg:[2,6,3], rng:1, mv:6, init:5, boss:true, attacks:2, verb:'tears at', verb2:'tears again at'},
         raest:{name:'The Tyrant', sig:'R', kind:'raest', hp:300, ac:18, atk:9, dmg:[2,8,3], rng:1, mv:2, init:2, boss:true, immortal:true, ai:'raest', verb:'lays a hand of ice on'},
         rime:{name:'Rime-dead', sig:'r', kind:'rime', hp:16, ac:14, atk:7, dmg:[1,8,3], rng:1, mv:4, init:3, verb:'claws at'},
         bbfiddler:{name:'Fiddler', sig:'F', kind:'fiddler', hp:40, ac:15, atk:8, dmg:[1,8,3], rng:5, mv:4, init:4, verb:'puts a quarrel into'},
         bbhedge:{name:'Hedge', sig:'h', kind:'hedge', hp:40, ac:15, atk:7, dmg:[1,8,4], rng:1, mv:4, init:3, verb:'cracks a mallet across'},
         clawmage:{name:'Claw hand-mage', sig:'M', kind:'claw', hp:18, ac:14, atk:7, dmg:[2,6,2], rng:4, mv:4, init:4, verb:'looses a shadow-bolt at'},
         lorn:{name:'The Adjunct', sig:'L', kind:'lorn', hp:90, ac:18, atk:9, dmg:[2,6,4], rng:1, mv:4, init:6, boss:true, immortal:true, attacks:2, verb:'cuts at'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    fetemask:{name:'Fete mask', slot:'trinket', who:null, stat:{guile:1}, line:'A half-mask of dark red silk over stiffened linen, with a fringe of tiny brass bells along the lower edge that somebody has stuffed with wax so they will not ring. Murillio bought too many and could not choose. Guards do not wear masks. It is for after.'},
    simtalhalberd:{name:'House guard\'s halberd', slot:'weapon', who:['brisk','sgt'], atk:1, line:'Seven feet of ash with a blade on the end polished for show and sharpened by somebody who did not trust the show, handed out of a barrel at Lady Simtal\'s gate like an oar. Nobody expected you to use it. Brisk calls it a hat you hold, and uses it.'},
    bbstrap:{name:'Sapper\'s satchel strap', slot:'trinket', who:null, hp:2, line:'A Bridgeburner\'s spare strap, double-stitched, oiled, with a buckle filed smooth so it will not strike a spark. Hedge wore it through Mott Wood and Pale. For carrying something close to the ribs where it cannot swing. He did not say what. He did not need to.'},
    blackedblade:{name:'Blacked Guild blade', slot:'weapon', who:['sgt','ellis','kettle'], atk:1, stat:{guile:1}, line:'Longer than the roof knives, soot-black from point to pommel so that not even the edge catches a lantern. A Guild blade made for a party: for walking into lamplight and out of it again without anyone remembering you were there.'} },

  card:{ id:'chains', name:'Chains', house:'Unaligned', hue:'#9a9aa6',
    txt:`Chain, hanging out of a dark that has no top to it, every link catching a light that isn't there. At the bottom of the card, where the chain runs out of the picture, the shadow of something long and straight. Tuft turns it twice. "Bound," she says. "At both ends. Whatever holds this doesn't let go of what it takes." She doesn't like it. She doesn't put it back.`,
    fx:'An enemy that lands a blow on a squadmate takes 2 damage back.' },

  scenes:{
    fete_street:{loc:'Darujhistan', sub:'The Gedderone Fete', cap:'Paper lanterns in every colour but blue, masks on every face, music from three directions and none of it in time, and over the lake a black mountain wearing nothing at all.', amb:'explore'},
    fete_hall:{loc:'Lady Simtal\'s estate', sub:'The hall and the terraces', cap:'Chandeliers the size of wagons, two hundred masks on a black and white floor, and by one pillar a guest so tall that the dancers go round him the way water goes round a stone.', amb:'explore'},
    fete_garden:{loc:'Lady Simtal\'s estate',
      get sub(){ return (typeof S !== 'undefined' && S && S.f && (S.chapter >= 7 || /^c6_(dawn|close)/.test(S.node || ''))) ? 'The garden · dawn' : 'The garden · the Fete'; },
      get cap(){ return (typeof S !== 'undefined' && S && S.f && S.f.c6_azath && (S.chapter >= 7 || /^c6_(dawn|close)/.test(S.node || ''))) ? 'Dead lanterns in the trees, paper all over the wet lawn, and at the far end of it a small wrong house of living wood with a yard of mounds, that was not there last night.' : 'Lanterns in the trees like little lit rooms, a fountain, a pond, and at the far end of the lawn something small and black growing in turned earth.'; },
      amb:'explore'},
    garden_storm:{loc:'Lady Simtal\'s garden', sub:'Omtose Phellack', cap:'The lawn gone white in rings, the lanterns dead one after another, the fountain hanging in the air, and a figure in a tusked face standing over a hole in a flowerbed.', amb:'dark'},
    dragon_sky:{loc:'Darujhistan', sub:'The sky over the city', cap:'Two shapes over the roofs the size of ships, one black and one wrong, and a whole city in the street with its face turned up.', amb:'dark'},
    alley_night:{loc:'Darujhistan', sub:'An alley off the Daru District', cap:'Wet stone, walls close enough to touch both at once, one blue lamp, and a doorway where somebody is standing who was not standing there a moment ago.', amb:'dark'} },

  quests:{
    fete_street:()=> S.f.c6_gateDone ? 'Through the gate' : 'The Fete. Lady Simtal\'s gate, north. You\'re on the guard list.',
    simtal_terrace:()=> S.f.c6_duelDone && S.f.c6_knivesDone ? 'Down the steps to the garden' : !S.f.c6_knivesDone && !S.f.c6_duelDone ? 'Walk the terraces. Every dangerous person in the city is on them.' : !S.f.c6_knivesDone ? 'Guard rounds: the upper terrace, north-east' : 'The man from the doorway is on the terrace',
    simtal_garden:()=> S.f.c6_key ? 'Dawn' : S.f.c6_tuft ? 'The old priest in the Jaghut mask is walking to the sapling' : S.f.c6_houndDone ? 'A grey cloak by the fountain' : S.f.c6_wjGarden ? 'Something on the east wall' : 'Whiskeyjack, by the fountain' },

  end:{
    bridgeburners:['The garden held','The Tyrant came up out of an old priest in Lady Simtal\'s garden, and the Fourth stood on a lawn gone white with frost beside the Bridgeburners, four rounds, while Quick Ben opened seven warrens and Whiskeyjack\'s leg broke and a sapling became a house and took the Tyrant in. Then a black dragon drew a sword over the city that chains what it kills, and the Fourth was close enough to hear the chains.'],
    cellars:['Under the crossing','While the Tyrant stood in Lady Simtal\'s garden, the Fourth ran for the vault under the Gadrobi crossing and found grey cloaks setting acid to the wax of forty munitions and twelve cussers in the city\'s gas, on a standing order older than the night. Kettle stopped every drop. Nobody in Darujhistan will ever know how close it came, and the order, in a very neat hand, is in the sergeant\'s coat.'],
    get alley(){ const s = typeof S !== 'undefined' && S && S.f && S.f.c6_steppedIn;
      return ['The alley', s ? 'The Adjunct walked out of the garden as the Tyrant showed his face, and the Fourth followed her to an alley where a Daru boy with a coin was against a wall, and she told them to hold him. They stood between her and the boy instead, three rounds, in a place where no warren works and whoever falls stays down. A man in a faded crimson cloak finished it. Two women from the Phoenix Inn finished her. Paran carried her away.'
        : 'The Adjunct walked out of the garden as the Tyrant showed his face, and the Fourth followed her to an alley where a Daru boy with a coin was against a wall, and she told them to hold him. They stood aside. A man in a faded crimson cloak stepped out of a doorway and did what they did not. Two women from the Phoenix Inn finished her. Paran carried her away.']; } },
  endCap:()=>{ const dead = C6H.dead(), w = C6H.words(SQUAD().length);
    return dead.length ? `Dawn in a garden with a house in it. The Fourth counts, and gets ${w}, and counts again, and it stays ${w}.` : S.f.c6_key === 'cellars' ? 'Dawn over a city that does not know how close it came, and a house in a garden that was not there last night.' : 'Dawn in a garden with a house in it, and the Moon\'s Spawn, for the first time since Pale, moving.'; },
  extras:()=>{ const x = []; const dead = C6H.dead(), tA = SQUAD().includes('tuft'), oA = SQUAD().includes('ohl');
    if (dead.length) x.push(`${C6H.names(dead)} did not come out of the alley. ${dead.includes('ohl') ? `Ohl\'s list is in the sergeant\'s pack now, and nobody knows how to read it the way he did.` : `Ohl\'s list is ${listCount()} names long, and for the first time ${dead.length === 1 ? 'one of them is' : `${C6H.words(dead.length)} of them are`} the Fourth\'s.`}`);
    if (S.f.sgtScar) x.push('The sergeant went down on the cobbles in the alley and got up again. Nobody, including the sergeant, knows how.');
    if (S.f.c6_tuft === 'glove') x.push(tA ? 'Tuft dropped the High Mage\'s badge into an otataral glove. Meanas is quiet in her. She is nobody\'s, and it hurts, and she says she would do it again.' : 'Tuft dropped the High Mage\'s badge into an otataral glove. She was nobody\'s when she died in the alley, and she had chosen to be.');
    if (S.f.c6_tuft === 'shadow') x.push(tA ? `A Hound of Shadow bit through the High Mage\'s thread. Tuft says it was polite. Ohl ${oA ? 'says' : 'said'} it was a thumb turning a page.` : 'A Hound of Shadow bit through the High Mage\'s thread, and Tuft called it polite. In the alley, where nothing reaches, she was nobody\'s after all.');
    if (S.f.c6_tuft === 'dark') x.push(tA ? 'A tall man in a black dragon mask looked at Tuft\'s badge once, and it went cold. She says the house was polite. She says it the way you say a thing you have decided to believe.' : 'A tall man in a black dragon mask looked at Tuft\'s badge once, and it went cold. She called the house polite, an hour before the alley.');
    if (S.f.c6_tuft === 'kept') x.push(tA ? 'Tuft did what the grey cloak said. Something looked out of her eyes at the Fete. She is still with the Fourth. So is whatever was looking.' : 'Tuft did what the grey cloak said. Something looked out of her eyes at the Fete, until the alley, where nothing can look out of anything.');
    if (S.f.c6_paranToc) x.push('Paran has Toc\'s message at last. He says Toc is still riding.');
    if (S.f.c6_collRing) x.push('Coll has his ring back, and by morning, his house.'); else if (S.f.c6_signetSeen) x.push('The captain of Simtal\'s house knew the shape of the ring in the sergeant\'s pocket. So, by now, does half the hill.');
    if (S.f.c6_guildPassed) x.push('Vell\'s token got the Fourth called furniture by the Guild. It was meant kindly.');
    if (S.f.c6_terraceFought) x.push('Guild blood on Lady Simtal\'s upper terrace. The music did not stop.');
    if (S.f.c6_houndKnew) x.push(`A wounded Hound of Shadow lay down in the wet grass for Tuft.${oA ? ' Ohl has not stopped rubbing his hands.' : ''}`);
    if (S.f.c6_houndFought) x.push('A wounded Hound of Shadow came over the garden wall, and the Fourth held it off the guests, and it went back into nothing.');
    if (S.f.c6_rakeLooked) x.push('The tall guest in the black dragon mask looked at the Fourth. Nobody in the squad will say his name. Nobody has been told it.'); else if (S.f.c6_sawRake) x.push('The Fourth stood on a terrace with a very tall guest in a black dragon mask. He did not look at them. That is a kindness.');
    if (S.f.c6_orders) x.push('A standing order in a very neat hand is in the sergeant\'s coat. Somebody wanted the city gone. Somebody will want the paper back.');
    if (S.f.c6_wjLeg) x.push('The Fourth was on the lawn when Whiskeyjack\'s leg broke. Brisk says it was the sound of a green branch.');
    if (S.f.c6_lornEnd) x.push('The Adjunct died in an alley with Paran\'s knee under her head. The Fourth stood aside to let him carry her past.');
    if (S.f.wjRegard > 0) x.push('Whiskeyjack has decided the Fourth is worth the trouble.'); if (S.f.wjRegard < 0) x.push('Whiskeyjack has decided the Fourth is trouble.');
    return x; },
  tease:'Next: Outlaws. Dawn on the Lakefront, an Empire that has outlawed its own army, the Claw come for its last accounting, and a sky with nothing in it for the first time since Pale. The Fourth has to decide where it goes.',

  dlg:{
    /* ---- the vault under the crossing: noon on the day of the Fete ---- */
    c6_start:()=>({sp:'Whiskeyjack · Bridgeburners', scene:'cellar', fx:()=>{ S.f.c6_started=1; }, txt:
`The vault under the Gadrobi crossing, at noon on the day of the Fete. Down the ladder-hole comes the city: drums three streets off, a crowd laughing at something, a man selling masks in a voice like a gull. Down here the pipes hiss on every side the way they always have, and the lantern is on its crate, and forty Moranth munitions sleep in the walls with twelve cussers beside them, and none of them is going to the Fete.

Whiskeyjack is sitting on the crate with the broken seal. He looks up when you come down the ladder, and counts. ${SQUAD().length === 6 ? 'Six' : 'Five'}. ${S.f.c5_ellisThrough ? `You watch him arrive at it, and check it, and find the place where the sixth isn't. He doesn't ask. He knows he's about to be told.` : `You watch him arrive at it, and check it, and let it be right.`}

He isn't alone. Fiddler and Hedge are on the far side of the vault arguing in whispers over a bundle of something blue. Kalam is at the foot of the ladder, doing nothing with his hands. Quick Ben is sitting on a pipe with his knees drawn up, smiling at the lantern.

And against the wall, standing, as if sitting down were a thing he had lately forgotten how to do: Captain Paran. He got here a day ahead of you, and looks as if he hasn't slept in it. The ordinary sword is at his hip in its worn scabbard, and his hand is on the pommel, and he nods to you, once, and says nothing.

Up in the crossing, tethered beside the Bridgeburners' mule, there's a horse somebody has brushed until it shines. ${S.f.c2_muleNamed ? `Pell, tethered on its other side, has already bitten it once, on principle.` : `The Fourth's mule, tethered on its other side, has already bitten it once, on principle.`}

"Report," says Whiskeyjack.`,
      ch:[{t:'Give it to him. In order.', go:'c6_report'}]}),
    c6_report:()=>({sp:'Whiskeyjack', scene:'cellar', fx:()=>{ S.f.c6_reported=1; }, txt:
`You give it to him the way he taught you: in order, without anything in it that isn't so.

The long ridge, and the Rhivi lying flat along it, and Sethand in the lee of his stone.${S.f.c5_crone ? ` A raven the size of a dog that laughed.` : ''} The vale. The Adjunct on the lip of the dig with her hand on her sword, and the thing in the dig with its hands in the earth.${S.f.c5_spotted ? ` A stone that rolled, and a head that turned.` : ''} The Imass in the ring of stones saying *forgive me* to a hill. The wards, and the dead coming up out of the small barrows.${S.f.c5_cusserUsed ? ` Kettle's cusser.` : ''}${S.f.c5_toolSaw ? ` *You are very small. Stay that way.*` : ''} Two riders coming up the vale. The fold under the far hill, and the fire, and a painted puppet on the crest with its strings going up to nothing. The rent.

Then Toc.

You tell him about Toc. The horse screaming and the picket-pin coming out of the ground. Toc running for its head, because that's what a scout does. The grey coming in over the turf like a tide over sand. His one eye finding ${S.f.c5_ellisThrough || S.f.c5_ellisHeld ? `Ellis` : `you`} across the fire. His mouth opening on something he never got to say.

${S.f.c5_ellisThrough ? `And Ellis, after him, on purpose, with her hand up over her shoulder and your word to go.` : S.f.c5_ellisHeld ? `And Ellis going after him, and being held.${SQUAD().includes('ellis') ? ` At the foot of the ladder, Ellis listens to her own part of it with her face turned to the wall.` : ''}` : S.f.c5_tuftMarked ? `And Tuft at the threshold, with her arm in the grey to the elbow, and what came back with her.` : S.f.c5_tuftHeld ? `And Tuft at the edge of it, and your word that kept her on this side.` : ''}

The Hounds, going past the fire like weather. The puppet on the next hill, and the sound it made. Toc's horse walking back into the firelight before dawn with nobody on it. The *thud* under the long barrow, getting slower, the way a sleeper's heart slows before he wakes.

He listens to all of it with his face doing nothing. At Toc, he doesn't move at all. Neither does Paran, against the wall.

When you've finished, the pipes hiss for a long time.

"The captain came in yesterday," Whiskeyjack says. "He told me Toc was gone. He wouldn't tell me how. He said you'd seen it, and you'd tell it right." He looks at Paran. Paran is looking at the lantern. "He was right."

${S.f.wjRegard > 0 ? `Then, to you: "Good." A whole sentence. He puts a full stop on it, and Brisk, behind you, hears the full stop.` : S.f.wjRegard < 0 ? `He doesn't say it was a good report. He doesn't need to. You watch it go into the drawer where he keeps things, and this time the drawer doesn't slam.` : `Then, to you: "Good."`}`,
      ch:[{t:'"Sir."', go:'c6_orders'}]}),
    c6_orders:()=>({sp:'Whiskeyjack', scene:'cellar', txt:
`"Tonight," Whiskeyjack says, "Lady Simtal throws the Fete. Her estate. The hill with the brass lamps. Half the city's going. The half that matters." He turns the sword on his knees a quarter-turn, the way Madryn turned a cup. "Fiddler and Hedge hired on at her gate yesterday as guards. Gadrobi hired men, a silver a head and supper after. They've put your names on the list with theirs."

Fiddler, from across the vault, without looking up from the blue bundle: "Didn't ask for references. It's the Fete."

"Armbands," says Whiskeyjack. "Halberds. Nobody expects you to use them. A guard at a party is a piece of furniture that can say *no, my lord* and be ignored."

He's quiet for as long as it takes a pipe to hiss twice.

"Every dangerous person in this city will be in one garden tonight. The Council. The Guild. Whatever mages this city doesn't admit it has." His eyes go to Paran, and come back. "The Adjunct is in the city. The captain says whatever was under that hill is awake, and walking, and it's walking here."

"I want eyes in that garden." ${S.f.wjRegard > 0 ? `A beat. "Eyes I trust."` : S.f.wjRegard < 0 ? `A beat. "You've got eyes."` : `A beat, in which he doesn't say whose.`}

"Stand where Fiddler puts you. When it goes bad, and it'll go bad, you'll see what needs doing before I can tell you, because I won't be able to tell you." He looks at you. "Do it."

${SQUAD().includes('brisk') ? `Brisk, behind you, very low: "Furniture." She tries the word the way she'd try a strap. "I've been furniture. Nathilog, the Fist's tent. Furniture's what gets broken first."` : ''}`,
      ch:[{t:'"Sir."', go:'c6_vault'}]}),

    /* ---- the vault: the afternoon ---- */
    c6_vault:()=>({sp:'The vault under the crossing', scene:'cellar', txt:
`${S.f.c6_vParan || S.f.c6_vFid || S.f.c6_vKalam ? `The afternoon goes the way afternoons go under a city, which is without anyone noticing. The light down the ladder-hole goes from white to gold. The drums in the streets get closer together.` : `The afternoon goes the way afternoons go under a city. Somebody brings bread. The drums in the streets go on. Hedge sings, until Fiddler stops him.`}

Dusk is a few hours off. There are people in this vault you could talk to, and you have the feeling, clear as cold water, that by morning some of them will be harder to reach.`,
      ch:[{t:'Captain Paran, by the wall.', req:()=>!S.f.c6_vParan, fx:()=>{ S.f.c6_vParan=1; }, go:'c6_paran'},
          {t:'Fiddler and Hedge, and the blue bundle.', req:()=>!S.f.c6_vFid, fx:()=>{ S.f.c6_vFid=1; }, go:'c6_fid'},
          {t:'Kalam and the captain, by the ladder, talking low.', req:()=>!S.f.c6_vKalam && !!S.f.c6_vParan, fx:()=>{ S.f.c6_vKalam=1; }, go:'c6_kalam'},
          {t:'Up the ladder. Dusk.', go:'c6_ladder'}]}),
    c6_paran:()=>({sp:'Captain Paran', scene:'cellar', txt:
`He hasn't moved from the wall. Close to, he's worse than he was in the vale: grey under the eyes, grey round the mouth, with the look of a man who has been awake so long that sleep has stopped being a thing he wants and become a thing he has heard of.

"Sergeant." A breath. "You told it right. I couldn't have. I tried, yesterday, and it came out as a list."

${S.f.c1_key === 'line' ? `Something moves at the corner of his mouth. "The line at Pale. The vale. Now this." He looks at you properly. "You keep being where I needed somebody to have been."` : `He looks at you for a long moment, the way he looked at you in the hills, as if you were a page he'd once read and was reading again. "Toc liked you," he says. "He didn't say so. He never said so about anybody. He'd go and stand near them."`}

${SQUAD().includes('ellis') ? `His eyes go past you to the ladder, and stop on Ellis.

"You're Toc's scout," he says.

Ellis straightens, the way she straightens for officers, which is not often. "Sir." That's all she means to say. Then, because Paran is still looking at her, and she has never in her life been able to leave a silence alone when it's the wrong shape: "He counted my fingers, sir. In the vale. He was always counting my fingers."

Paran nods, slowly, as if she'd made a report. "Yes," he says. "He would."` : ''}`,
      ch:[{t:'"Toc gave me something to tell you, sir. On the plain."', req:()=>!S.f.c6_paranToc, go:'c6_paran_toc'},
          {t:'"Sir."', go:'c6_vault'}]}),
    c6_paran_toc:()=>({sp:'Captain Paran', scene:S.f.c6_up ? 'fete_garden' : 'cellar', fx:()=>{ S.f.c6_paranToc=1; if (SQUAD().includes('ohl')) loy('ohl',1); }, txt:
`You tell him. The plain, the afternoon before the mage burned. Toc on his pony at the edge of the flattened grass, stopping once to look back at the place where the spiral ended, and deciding something about it, and putting it away.

"*Tell him Toc kept riding.*" You say it the way Toc said it. "He said you'd know what it means. He said he didn't, yet."

For a long moment nothing happens to Paran's face at all. Then something does. It's small, and it goes across his face the way wind goes across standing water, and it's gone.

"He didn't know," Paran says. "He said that."

"Yes, sir."

"He knew." Paran takes his hand off the pommel of the sword, and looks at the hand, and puts it back. "He just hadn't said it to himself yet. We were both hers, Sergeant. The Adjunct's. Her captain and her scout. And he rode off across that plain on her business and sent back word by a marine sergeant that he'd *kept riding*." A breath out through the nose, which in another man would have been a laugh. "It means he wasn't going back to her. Not really. Whatever she'd sent him to do, he was going to go on past it, and keep going, until he was somewhere she wasn't."

"And then she sent for him, and he came, because that's what we do. And a hole opened in the air, and he went into it with his hand on a horse's bridle." Something happens in his throat, and he waits for it to stop. "So he's still doing it. Wherever that is. He's still riding."

He's quiet for a long time.

"Thank you, Sergeant. You carried that a long way. It was heavier than it looked."

${SQUAD().includes('ohl') ? `Behind you, Ohl has taken the oilcloth half out of his robe. He looks at the space at the bottom of it, the one he left in the hills, and puts it away again without writing anything. *Nobody's dead until I know where they went.* You watch him decide that *riding* is a place.` : ''}`,
      ch:[{t:'"Sir."', req:()=>!S.f.c6_up, go:'c6_vault'},
          {t:'Leave him to the pond.', req:()=>!!S.f.c6_up, go:()=>startExplore()}]}),
    c6_fid:()=>({sp:'Fiddler and Hedge', scene:'cellar', fx:()=>{ gain('bbstrap'); }, txt:
`Fiddler has the blue bundle open on a crate: armbands, twenty or so, blue silk with a silver thread run through it, Lady Simtal's colours. He's handing them out like a quartermaster who has been told the count and doesn't believe it.

"Guards," he says. "Hers, for one night." He ties one round your arm himself, tight, with a sapper's knot. "Nobody asks anybody anything on the Fete. That's what the masks are for."

"They give you a *halberd* at the gate," says Hedge, with enormous disgust. "Nobody expects you to use it. It's a hat you hold."

Then Fiddler stops with an armband half-knotted, and rubs the back of his neck. It's not a joke. You've seen him do it before, in the crossing, talking about a girl in a grey shawl.

"I've got a feeling about tonight, Sergeant. The back-of-the-neck kind. I had it at Pale the night before the tunnels came down, and I had it on the way here, and I've got it now, and it's worse." He finishes the knot. "Don't tell Whiskeyjack. He knows. He's got it too. He just won't admit to having a neck."

${SQUAD().includes('kettle') ? (S.f.c5_cusserUsed ? `Hedge has found Kettle. He's looking at her the way a man looks at a younger sister who has come home with a tattoo.

"Whiskeyjack says you threw one," he says. "In the hills. At *what?*"

"Wights," says Kettle. "And a rock. A big rock with ice in it."

Hedge looks at her for a long moment. "Was it good?"

Kettle's face does a thing you have only seen it do once, in a crater. "It was *beautiful*."

Hedge puts his hand flat on his chest. "I'm so proud," he says, and means it, and Fiddler turns away so nobody sees his face. ${S.inv.cusser > 0 ? `"And mine? You've still got mine?" "Yes." "*Good.* Keep it. Tonight's not the night. Tonight's a garden with a city under it."` : `"And mine?" "Gone," says Kettle. "Something needed it." Hedge nods, satisfied. "Something always does."`}` : S.inv.cusser > 0 ? `Hedge has found Kettle. "You've still got it? Mine?"

"Yes." Kettle has her hand on the satchel. "I carried it to the hills and back. Whiskeyjack said throw it at anything I liked, and I *didn't*."

Hedge regards her with enormous pity and respect. "Hood's teeth. You've gone Fiddler."

"I heard that," says Fiddler.` : `Hedge has found Kettle. "Where's mine?"

"Gone," says Kettle. "Something needed it."

Hedge nods, satisfied. "Something always does."`) : ''}

Hedge unbuckles something from his own satchel and holds it out: a spare strap, double-stitched, oiled, the buckle filed smooth so it won't strike a spark. "For carrying close," he says. "Under the arm, against the ribs, where it can't swing. You'll know what." ${SQUAD().includes('kettle') ? `He's saying it to Kettle. He's handing it to you. Sappers.` : `He hands it to you, and looks at your squad, and doesn't say *where's your sapper*, and you like him for it.`}

"No munitions in the garden tonight," Fiddler says, to all of you. "Not a sharper. There's a city under that lawn, and it's full of gas, and it's full of *us*."`,
      ch:[{t:'Back.', go:'c6_vault'}]}),
    c6_kalam:()=>({sp:'Kalam', scene:'cellar', fx:()=>{ S.f.c6_kalamAsked=1; }, txt:
`Later, you pass the foot of the ladder with a crate of lamp-oil in your arms, and Kalam and Paran are standing there, the two of them, closer together than two men stand when they're talking about the weather. Kalam has his hood down. Paran has his hand on his sword. Neither of them sees you, which with Kalam means he has decided not to.

You don't mean to hear. The pipes pick that moment to go quiet.

"—she'll be there," Paran is saying. "She has to be. Whatever she carried into this city, it's for tonight."

"Then tonight's the night." Kalam, very low. "The Guild takes any contract with enough gold on it. I'm going to put a great deal of gold on it, where they'll find it, and let them come to the Fete hungry."

"She was my—" Paran stops.

"I know what she was." A pause you could fit a knife into. "That's why it isn't you doing it."

The pipes start hissing again. Kalam turns his head, not fast, and looks at you, and at the lamp-oil, and at you.

"You didn't hear that," he says.

${S.f.c4_kalamLook ? `He looks at you a beat too long. The same beat as the vault before the roofs; the same space behind your face. He knows somebody in this squad has sat at a table with the Claw. He doesn't know who. He isn't going to settle it tonight, and he lets you watch him not settle it, which is worse.

` : ''}Then, differently, as if it cost him something to say it to a marine: "If you see a woman at that party with no mask on and nothing in her hands, Sergeant, watch which door she uses. Don't follow her. Don't go near her. Watch." He puts his hood up. "And if she walks out before the party's over, you'll know something's gone wrong, and it won't be ours."`,
      ch:[{t:'Put the lamp-oil down somewhere else.', go:'c6_vault'}]}),

    /* ---- the ladder: Quick Ben and Tuft's collar ---- */
    c6_ladder:()=>({sp:'Quick Ben · squad mage', scene:'cellar', txt:
`Dusk. The ladder-hole has gone from gold to blue, and the noise coming down it has changed from a city working to a city getting ready to stop.

Quick Ben is sitting on the bottom rung. Nobody is going up until he gets off it. He's smiling at the lantern the way he smiles at everything, at a joke just past your shoulder. Then Tuft comes level with him, in the Andii cloak that won't take the light, and the smile stops.

It doesn't fade. It stops, the way a clock stops. You realise you have never seen Quick Ben's face without it, and that it's a different face underneath: younger, and much older, and not kind.

${S.f.c2_key === 'light' ? `He's looking at her collar. At the badge on it: silver and enamel, a hand on a flame.

"Somebody's looking out of your collar, girl."` : `He's looking at her pack. At the place in it, you'd swear, where something small is wrapped in a stocking at the bottom.

"Somebody's looking out of your pack, girl." A beat. "Not well. There's a lot of canvas in the way. But he's looking."`}

${SQUAD().includes('tuft') ? `Tuft goes very still. It's the stillness she has when somebody says *High Mage*, and nobody has said it.` : ''}`,
      ch:[{t:'"What does that mean?"', go:'c6_qb_glove'}]}),
    c6_qb_glove:()=>{ const gw = (SQUAD().includes('brisk') && S.gear.brisk && S.gear.brisk.trinket === 'otatglove') ? 'brisk' : 'sgt'; return {sp:'Quick Ben', scene:'cellar', fx:()=>{ S.f.c6_qbCollar=1; }, txt:
`"Every cadre badge that was ever sewn has a bit of him in it." Quick Ben says it quietly, the way you'd tell somebody their house was on fire without waking the children. "Not much. A thread. It's how he keeps his mages. It's how he always knows where they are. And when he wants to, which isn't often, he looks out of them. The way you'd look out of a window in a house you own."

You remember a cadre mage in the cold outside a tent at the Pale, looking at the cadre row as if it were a line of graves she knew the names on. *He doesn't let people leave, Sergeant. He let her. I'd like to know what he thinks he still has of hers.*

Now you know.

${S.f.c2_key === 'light' ? `Tuft's hand has gone to her collar. "I put it on for her," she says. Her voice is perfectly level. "For Tattersail. On the plain, after." She doesn't take the hand away. "I've been wearing a window since the plain. I've been wearing it *for her*."` : `Tuft's hand has gone to the strap of her pack. "I haven't worn it," she says. Her voice is perfectly level. "Fourteen months. Not since the staff. Not once. I carried it because throwing it away felt like—" She stops. "I didn't know what it felt like. Now I do."`}

${SQUAD().includes('brisk') ? `"Take it off," says Brisk, from the back. "Throw it in the lake."` : `"Throw it in the lake," says Kettle.`}

"Won't help." Quick Ben doesn't look round. "It's his. Put it at the bottom of the lake and he'll look out of the bottom of the lake. You can't take a thing like that off. You can't break it. Something has to *eat* it."

His eyes go, once, to ${gw === 'brisk' ? `Brisk's belt` : `your belt`}, where a plain riding glove is tucked, with a fine red dust in its seams that won't brush out. And away.

Tuft follows the look. She goes white. She hasn't stood on the same side of a fire as that glove since the hills.

Quick Ben stands up off the rung, and the smile comes back, as if it had never been anywhere else. "Tonight everybody in this city is going to be looking at everything," he says pleasantly, to the lantern. "I'd close a few windows." And he goes up the ladder, humming.`,
      ch:[{t:'Up the ladder.', fx:()=>{ S.f.c6_up=1; }, go:()=>{ startExplore('fete_street'); talk('c6_street_arrive'); }}]}; },

    /* ---- the street outside Lady Simtal's gate: dusk ---- */
    c6_street_arrive:()=>({sp:'The Estate District', scene:'fete_street', txt:
`Up through the chandler's, out into the crossing, and the city has turned into something else while you were under it.

Lanterns, first. Paper lanterns strung across every street from eave to eave, red and amber and green and gold, so that the blue gas lamps burn underneath them like something the city is trying to keep quiet about. Then masks. Every face you pass: birds and foxes and bulls and moons, silk and feathers and pasteboard, and here and there a plain black domino on somebody who couldn't afford a face and wanted one anyway. Music from three directions, none of it in time. Somebody has hung a garland of paper flowers on Trotts at the stakes. He has allowed it.

You go up through the Daru District with the crowd, in Lady Simtal's blue, and the crowd opens round you without looking, which is what a crowd does for guards. Then the lamps are brass, and the houses stand back from the street behind walls, and you're in the Estate District, on the hill, and the street in front of Lady Simtal's gate is so full of the Fete that you can't see the cobbles.

${SQUAD().includes('kettle') ? `Kettle is counting lanterns. She got to three hundred at the bottom of the hill and started again at the top, and she won't say what she's at now, because the number frightens her. "*Paper*," she says. "Candles in paper, Sergeant. Over a city full of gas."` : ''}

${SQUAD().includes('tuft') ? `Tuft walks in the Andii cloak with her head down, not looking at anyone. ${S.f.c2_key === 'light' ? `Her hand keeps going to her collar and stopping just short of it, as if the badge were hot.` : `Her hand keeps going to the strap of her pack and stopping just short of it, as if the canvas were hot.`}` : ''}

${SQUAD().includes('ellis') ? `Ellis has seen something at the east end of the street, and has stopped looking at it very carefully.` : ''}

Over the lake, over the lanterns, over every mask in the city: the Moon's Spawn. Nobody has hung a lantern on it.`,
      ch:[{t:'The street.', go:()=>startExplore()}]}),

    c6_kruppe:()=>{ const rw = Object.keys(S.gear).find(w => SQUAD().includes(w) && S.gear[w] && S.gear[w].trinket === 'collsignet'); const ring = S.kit.includes('collsignet') && !S.f.c6_collRing;
      return {sp:'Kruppe', fx:()=>{ S.f.c6_kruppe=1; }, txt: S.f.c6_kruppe ?
`Kruppe has moved four paces up the street and acquired a second honey-cake. He raises it to you, gravely, like a toast.` :
`He is standing in the middle of the street eating a honey-cake, in a mask of green silk that covers exactly none of him, and the Fete parts round him on both sides the way water parts round a stone.

"The road-menders!" Crumbs. "No. The *guards*. Kruppe sees the armbands; Kruppe sees the blue; Kruppe sees a halberd in the future of the armoured lady, and weeps for the halberd." He beams. "How *versatile* the Empire's children are. Road-menders one week and guards the next. Kruppe expects to see you next as dancing-masters."

The small brown eyes go over the squad the way they did in the crossing, counting and pricing, and stop, for one blink, on Tuft.

"Kruppe will say only this, as a friend, to friends, who are guards, which are the best kind of friend to have at a party, being unable to leave early. There will be a guest tonight so tall that the doorways have been told about him in advance. Kruppe advises the guards not to *guard* him. He does not require it. He will not notice it. And the doorways will be so much happier."

${ring ? `His eyes drop, once, to ${rw ? (rw === 'sgt' ? 'your hand' : `${NAME(rw)}'s hand`) : 'your belt-pouch'}, where a heavy gold ring with the crest ground off is ${rw ? 'worn' : 'folded away'}, and come up again, and nothing in his face has changed at all. "And Kruppe would keep that particular trinket in a pocket tonight, and the pocket buttoned, and the button sewn. Kruppe did say somebody *will*. Kruppe so dislikes being right before supper."` : ''}

${SQUAD().includes('tuft') && (S.f.c3_kruppe || S.f.c3_askedTuft) ? `Then, to Tuft, with the ornament gone out of his voice for exactly one sentence: "The little mage has not forgotten what Kruppe said at the Phoenix door. Good. Some things are better for the keeping." And back again, at once: "Kruppe must eat. Kruppe has been eating since noon and is nowhere near finished."` : `"Kruppe must eat," he adds. "Kruppe has been eating since noon and is nowhere near finished."`}`,
      ch:[{t:'Leave him to it.'}]}; },

    c6_murillio:()=>({sp:'Murillio', fx:()=>{ S.f.c6_mur=1; gain('fetemask'); }, txt: S.f.c6_mur ?
`Murillio is standing by the wall with the masks over his arm, looking at Lady Simtal's gate as if it were the mouth of a well. He doesn't see you. You let him not.` :
`A slender man in a silk coat the colour of a bruise, with a thin moustache and rings, and a sheaf of masks over one arm like a vendor, which he isn't. ${S.f.c3_innMur ? `You know him: the Phoenix, Kruppe's table, the man who noticed collars.` : `He has the look of a man who has been beautiful for a living and is tired.`}

"Guards," he says, with a small bow a Daru lady would have paid for, and then he looks at your faces under the armbands, and the smile does something complicated. ${S.f.c3_inn ? `"Ah. The road-menders. Kruppe did say."` : `"Ah. Malazans. Kruppe did say."`}

He's pale under the powder. He's dressed for a party, and he looks like a man dressed for a funeral who has been told to smile at it.

"Forgive me. I'm going in to a Fete tonight to watch something end that I helped to begin. It's a very Daru thing to do. We do it beautifully." He looks at the masks on his arm as if he'd forgotten them. "I bought too many. I couldn't choose. That's also very Daru."

He holds one out: a half-mask of dark red silk, with a fringe of little brass bells along the edge that somebody has stopped with wax so they won't ring. "Guards don't wear masks, I know. Wear it after. There's always an *after*, at a Fete. That's when you'll want a face that isn't yours."

${SQUAD().includes('tuft') && S.f.c3_innMur && S.f.c2_key === 'light' ? `His eyes go to Tuft's collar. "Still wearing it," he says softly. "I told you to keep it on." A pause. "I've been told since that I give very bad advice."

Tuft doesn't answer him. Her hand is at her collar, and she doesn't take it away.` : ''}`,
      ch:[{t:'Take the mask.'}]}),

    c6_coll:()=>{ const ring = S.kit.includes('collsignet') && !S.f.c6_collRing; const rw = Object.keys(S.gear).find(w => SQUAD().includes(w) && S.gear[w] && S.gear[w].trinket === 'collsignet');
      return {sp: S.f.c3_innColl ? 'Coll' : 'A big man in plain brown', fx:()=>{ S.f.c6_coll=1; }, txt: S.f.c6_coll && !ring ?
`He's where he was, against the wall, with his arms folded, looking at the house. ${S.f.c6_collRing ? `Every so often he turns the ring on his finger, as if checking it's still there.` : `He doesn't look round.`}` :
`A very big man in plain brown clothes is standing across the street from Lady Simtal's gate with his back to a wall and his arms folded, looking at the house the way you'd look at a dog that used to be yours and has since been taught to bite you.

${S.f.c3_innColl ? `You know him, and then you don't. The Phoenix. The jug. The ruined soldier's shoulders. The shoulders are still a soldier's; the rest has been put back. He's sober. He's been sober, you'd guess, for days, and every one of them hard, and it shows in how still he stands: like a man standing on something that might not hold.` : `He's sober, and it looks new on him, and hard.`}${S.f.c5_collDown ? ` He stands a little crooked, favouring his left side, the way a man stands round a wound that has closed and hasn't yet agreed to it. The last time you saw a man that size, he was going sideways into the grass of a hillside with the Adjunct's sword in him.` : ''}

"Malazans," he says. ${S.f.c3_innColl ? `"Kruppe's road-menders. In Simtal's blue." He doesn't smile. "Of course you are. Kruppe arranges everything, and never where anybody can see him do it."` : `"In Simtal's blue. Hood's breath." He doesn't smile.`}

"That's my house." He says it to the gate, not to you. "Was. There's a councillor in it tonight who took it with my wife's help, and my wife, who helped, and half the city, drinking my cellar." A breath. "Kruppe says *tonight*. Kruppe says a great many things. I stopped drinking to find out whether he's right."

${ring ? `His eyes go to ${rw ? (rw === 'sgt' ? 'your hand' : `${NAME(rw)}'s hand`) : 'your belt-pouch, where the shape of it shows through the leather'}. To the ring. His face does nothing at all, very deliberately. "You've still got it," he says. "It didn't get lost in a ditch."` : S.f.c3_collTalk && !S.f.c3_coll ? `He turns a heavy gold ring on his finger: the one you pushed back across the table at the Phoenix. "Still got it," he says. "You wouldn't take it, and I couldn't lose it. It's been a long week for the pair of us."` : ''}`,
      ch:[{t:'Give him back his ring.', req:()=>S.kit.includes('collsignet') && !S.f.c6_collRing, go:'c6_coll_ring'},
          {t:'Leave him to his house.'}]}; },
    c6_coll_ring:()=>({sp:'Coll', fx:()=>{ S.f.c6_collRing=1; S.kit = S.kit.filter(k => k !== 'collsignet'); Object.keys(S.gear).forEach(w => { if (S.gear[w].trinket === 'collsignet') delete S.gear[w].trinket; }); if (SQUAD().includes('ohl')) loy('ohl',1); if (SQUAD().includes('brisk')) loy('brisk',1); }, txt:
`You hold it out to him. It's heavy. It was always heavier than gold should be; that's the history.

He doesn't take it at once. He looks at it on your palm the way he looked at the house.

"Tonight," he says. "You'd bring it back *tonight*." A long breath. "I gave it to you so a soldier would lose it honest."

"Kruppe told you," he says.

"No."

"No," Coll agrees. "Kruppe never tells anybody anything. He just leaves it lying where they'll trip on it."

He takes it. He puts it on. It goes over the knuckle hard, the way a ring does on a hand that got thin and then got thick again.

"Somebody *will*, Kruppe said. Recognise the shape." He closes the hand. "Let them."

${SQUAD().includes('ohl') ? `Ohl, beside you, has the look of a man who has watched a wound close that he'd expected to have to stitch, twice now, on the same patient.` : ''}`,
      ch:[{t:'Leave him to his house.'}]}),

    c6_crokus:()=>({sp:'Crokus', fx:()=>{ S.f.c6_crokus=1; }, txt:
`He comes through the crowd at a run that isn't quite a run, the way a boy runs when he's been told not to, with a coil of rope over his shoulder and a hook wrapped in rag, and a mask pushed up on his forehead that he's forgotten is there. He sees your armbands and stops so hard he nearly falls over.

${S.f.c3_innCrokus ? `Then he sees your faces. "You!" A grin, enormous, and then it falls off. "The road-menders. From the Phoenix. You're— you're *guards*? At *Simtal's*?"` : `"Guards," he says. "Simtal's. Of course. Of *course*." He looks at the rope on his shoulder as if an enemy had put it there.`}

"This isn't— I'm not—" He gives up. "Look. If you see somebody go over the east wall tonight, a little after the tenth bell, it's nobody. It's a boy who's been invited in every way except the one on the list." Something happens to his face at *invited*. "There's a girl."

${S.f.c4_crokusNo ? `You could tell him you've seen him before, on the Gadrobi roofs, with a bag that clinked and something tall and silver-haired behind him and ${S.f.c2_ellisJoined ? 'an arrow' : 'a quarrel'} on its back that never flew. You tell him. He goes white under the mask-paint. "That was *you*?" he whispers. "Somebody said *no*. On the roof. I heard it. I thought it was the wind." He looks at you for a long moment. "Thanks," he says. "I think. I don't know what for yet."` : ''}

He's walking the coin across his knuckles without knowing it, the way he did at the Phoenix: over, and under, and over. It stops, balanced on its edge, and stays there, which it shouldn't. He catches it and it's gone, and so is he, into the crowd.

${SQUAD().includes('tuft') ? `Tuft is watching the place where the coin was. "That's not his," she says. "The coin. It's *somebody's*. I don't want to be standing near him when they come to collect."` : ''}`,
      ch:[{t:'"We didn\'t see you."', fx:()=>{ if (SQUAD().includes('kettle')) loy('kettle',1); }},
          {t:'Let him go.'}]}),

    c6_rallick:()=>({sp: S.f.c4_rallick ? 'The man from the ridge' : 'A man in a doorway', fx:()=>{ S.f.c6_rallick=1; }, txt: S.f.c6_rallick ?
`He's still in the doorway, still watching the gate. He hasn't moved. You get the feeling he could stand there a year.` :
`He's in the doorway of a shuttered house on the south side of the street, in a dark plain coat, with no mask, as if the Fete were weather he'd decided not to be out in. You didn't see him until you were next to him. ${S.f.c4_rallick ? `You know him. The ridge on the Gadrobi roofs; the window three streets north. He knows you too.` : ''}

${S.f.c4_rallick ? `He looks at you. He doesn't say *go home* this time. He said it on a roof, and you didn't listen then either.` : `"Go home, Malazan," he says, without looking at you. "This isn't your war."`}

He's looking at Lady Simtal's gate. Not the way the big man across the street looks at it. The way a man looks at the place where a thing he has waited five years for is going to happen, and has stopped being able to want it, and is going to do it anyway.

${SQUAD().includes('tuft') ? `Tuft has stopped a pace behind you, staring at him. "Sergeant," she breathes. "He's got it *on* him. Like the Adjunct. Not a sword. Dust. In his clothes, in his hair, on his hands." She takes a step back. "It's like standing next to a very small hole."` : `Kettle, a pace behind you, sniffs. "He smells like a forge that's gone out," she says. "Why does he smell like that?"`}`,
      ch:[{t:'Leave him to his doorway.'}]}),

    c6_reveller:()=>({sp:'A reveller in a goat mask', fx:()=>{ S.f.c6_rev=1; }, txt: S.f.c6_rev ?
`The goat has found a lantern pole and is explaining Gedderone to it. The lantern pole is being very patient.` :
`A Daru in a goat's mask with gilded horns, drunk in the careful, upright, happy way of a man who has been drunk since noon on purpose, catches your sleeve because you're wearing an armband and he's decided that makes you official.

"Guard! Guard. You know what tonight is? No. You're *Gadrobi*." He leans in. Wine and cloves. "Gedderone. The Lady of Spring. The Fete's hers. Every year she comes back, you see, every single year, and everything that died in the winter comes back with her." He pats your arm, kindly. "That's the story. Everything that died comes back." A wink, through the goat. "It's a *story*. Nothing comes back. But it's a lovely night for pretending."

${SQUAD().includes('tuft') ? `Tuft has stopped dead. She isn't looking at the goat. She's looking east, over the roofs, toward the Gadrobi Hills and the long road the Rhivi took with the bundle, and her face has gone the colour it went at the Phoenix door.` : ''}

${SQUAD().includes('ohl') ? `Ohl, behind you, very quietly: "Nothing comes back." He says it the way he says *technically*. "No. But I'd keep the space open anyway."` : ''}`,
      ch:[{t:'Let him go.'}]}),

    c6_horses:()=>({sp:'Ellis', fx:()=>{ S.f.c6_horses=1; }, txt: S.f.c6_horses ?
`The old man is asleep on his bucket. The dun pony with the rolling eye has its ears back at nothing. Ellis doesn't look at it again, and doesn't look at you.` :
`At the east end of the street, where the crowd thins round a horse-trough, an old Gadrobi man in a felt hat is sitting on an upturned bucket with a string of ponies on a rope behind him. Fete ponies: shaggy hill-bred things with ribbons plaited into their manes and paper flowers on their browbands. He's selling rides to children for a copper. Nobody's buying.

Ellis is by the trough. She has been standing there since you came up the hill. She hasn't said a word to you since the hillside, and she doesn't now.

She's counting the ponies. You can see her do it: five, and then five again. Then she steps in among them and runs her gloved hand down the neck of the smallest, a dun with a white blaze and a rolling eye, and it puts its ears back at her, and she lets it.

She says something to the old man in Gadrobi. He answers. She says something else, and he laughs, a wheeze, and looks at her properly for the first time, and says a word you don't know that makes her go very still.

When she comes back past you, she stops. She doesn't look at you. She looks at the pony.

"My mother sold horses at the Fete," she says. "Every year. Down out of the hills to this street. She'd have sold that one first." The dun. "It's the one with the worst temper. People think temper is spirit." A breath. "He knew her. The old man. He says I've got her hands." She pulls the glove tight at the wrist, finger by finger. "One of them."

Then she walks on up the street to her place at the end of the line, where a scout walks, and that's all. It wasn't said to you. It was said in front of you. You understand that that is as much as she has to give tonight, and that you're not to answer it.`,
      ch:[{t:'Let it sit.'}]}),

    /* ---- the gate: Tuft's draw, the steward, the ring ---- */
    c6_gate:()=> S.f.c6_gateDone ? {sp:'Lady Simtal\'s gate', txt:
`The gate is behind you now. The Fete is ahead.`,
      ch:[{t:'On.', go:'c6_terrace_arrive'}]} : (SQUAD().includes('tuft') && !S.f.c6_drawn && !S.f.c6_noCard) ? {sp:'Tuft', scene:'fete_street', txt:
`At the gate, under a lantern pole hung with paper moons, Tuft stops. She has the Deck out of her sleeve before you've seen her reach for it, face down in both hands.

"One," she says. "For the squad. Before we go in." She isn't looking at the gate. She's looking up at the lanterns, all those candles in all that paper, swinging over a street full of people who have decided not to be afraid tonight. "Quick Ben's right. Everybody's going to be looking at everything. I'd like to look first."

${S.f.c5_noCard || S.f.c4_noCard ? `She doesn't mention the other times. She's past mentioning them.` : S.f.c5_drawn ? `"The last one was on the ridge," she says, "with the hole in the world at the bottom of the vale. I'd like one with nothing in the way."` : ''}`,
      ch:[{t:'Let her draw.', fx:()=>{ S.f.c6_drawn=1; S.card = ['chains','chains','knight','hounds','obelisk','oponn'][R(6)]; }, go:()=>cardSequence(()=>talk('c6_card'))},
          {t:'"Not here. Not in front of the whole Fete."', fx:()=>{ S.f.c6_noCard=1; if (SQUAD().includes('tuft')) loy('tuft',-1); if (SQUAD().includes('brisk')) loy('brisk',1); }, go:'c6_card_no'}]} : {sp:'Lady Simtal\'s gate', txt:
`The iron gate of Lady Simtal's estate, twelve feet high, standing open, with a steward at it holding two lists and the Fete going past him in both directions like a river past a post.`,
      ch:[{t:'Up to the steward.', go:'c6_steward'},
          {t:'Not yet.'}]},
    c6_card:()=>{ const c = CARDS[S.card] || CARDS.oponn; return {sp:'The Deck of Dragons', scene:'fete_street', txt:
`Tuft lays the reading out on the flat top of a mounting-block by the gate, in the light of a paper lantern shaped like a moon, with the Fete going past on every side and not one mask turning to look. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)}${c.fx ? ` · ${esc(c.fx)}` : ''}</div>`, oncard:[S.card || 'oponn',false],
      after:`${S.card === 'chains' ? `Chains. Black links hanging out of a dark with no top to it, and at the bottom, where the chain runs out of the picture, the shadow of something long and straight.

Tuft looks at it for a long time. "I don't know this one," she says. "I've never drawn it. I didn't know it was *in* here." She turns it over and back. "Bound at both ends. It takes, and it doesn't let go of what it takes, and it's close. It's *tonight*." She puts it away very carefully, as if it might catch on something.` : S.card === 'hounds' ? `${c.txt}

Tuft holds it very still. "Here," she says. "In the city. Tonight." ${S.f.c5_tuftMarked ? `Her hand has gone up to the grey lock at her temple, and she doesn't seem to know it.` : `She looks at the east end of the street, where the lamps stop, as if something might come round the corner.`}` : S.card === 'knight' ? `${c.txt}

"He's not watching the city tonight," Tuft says. She looks up at the gate, and the lit house beyond it. "He's *in* it."` : S.card === 'oponn' ? `${c.txt}

Tuft looks at the Twins for a long time, and then down the street, where a boy with a rope went by a little while ago walking a coin over his knuckles. "Oh," she says. "Oh. *That's* whose."` : `${c.txt}`}

${SQUAD().includes('ellis') ? `Ellis has watched it from the end of the line. She doesn't say anything. She isn't saying things to this end of the squad.` : SQUAD().includes('kettle') ? `Kettle, softly: "Put them away, Tuft. There's a man with a list."` : ''}`,
      ch:[{t:'To the gate.', go:'c6_steward'}]}; },
    c6_card_no:()=>({sp:'Tuft', scene:'fete_street', txt:
`She squares the Deck against her palm and puts it back in her sleeve.

"Yes, Sergeant."

${S.f.c5_noCard || S.f.c4_noCard || S.f.c3_noCard ? `She doesn't say anything about the other times. She looks up at the lanterns once, the way you'd look at a door you'd been told not to open, and walks to the gate.` : `"You're right," she says. "Everybody's looking." She pulls the Andii cloak closer. "I just wanted to see it before it saw us."`}`,
      ch:[{t:'To the gate.', go:'c6_steward'}]}),
    c6_steward:()=>{ const ring = S.kit.includes('collsignet') && !S.f.c6_collRing; return {sp:'The gate steward', scene:'fete_street', fx:()=>{ S.f.c6_gateDone=1; gain('simtalhalberd'); }, txt:
`Lady Simtal's gate is iron, twelve feet high, worked into vines and birds, with a crest over the arch that somebody has lately had regilded. It stands open. Through it, a drive of white gravel, and lanterns in the trees, and the lit front of a great house with every window gold and music coming out of it like heat.

At the gate: a steward with a list in each hand, and the face of a man who has been at this gate since noon, and has let in half the city and turned away the other half, and has enjoyed one of those things.

"Guests," he says, lifting one list, "this side. Guards," the other, "that side. You're not guests." He looks at your armbands. "*Gadrobi* guards. The other Gadrobi said you'd be along. Names."

${SQUAD().includes('brisk') ? `Brisk gives them to him, one after another, in the regiment voice. He finds every one on his list in a hand you recognise as Fiddler's, and ticks them, and doesn't look up.` : `You give them to him. He finds every one on his list in a hand you recognise as Fiddler's, and ticks them, and doesn't look up.`}

Beyond the gate a man in Simtal's blue and silver is handing halberds out of a barrel, like a man handing out oars. ${SQUAD().includes('brisk') ? `Brisk takes one. She looks at it the way she'd look at a man who had offered to hold her shield for her. She keeps the shield. She keeps the halberd too. "Hat," she says, to Kettle, who laughs out loud for the first time since the hills.` : `You take one. It's seven feet of ash and a polished blade, and it's a hat you hold.`}

${ring ? `And inside the gate, with his thumbs in his sword-belt, a big grey-templed man in blue with a captain's silver at the shoulder is watching the guards go through the way a farmer watches sheep through a gap: counting, and looking for the lame one.` : ''}`,
      ch:[{t:'Through the gate.', req:()=>S.kit.includes('collsignet') && !S.f.c6_collRing, go:'c6_signet'},
          {t:'Through the gate.', req:()=>!(S.kit.includes('collsignet') && !S.f.c6_collRing), go:'c6_terrace_arrive'}]}; },
    c6_signet:()=>{ const rw = Object.keys(S.gear).find(w => SQUAD().includes(w) && S.gear[w] && S.gear[w].trinket === 'collsignet'); return {sp:'The captain of the house', scene:'fete_street', fx:()=>{ S.f.c6_signetSeen=1; }, txt:
`His eyes go over the Fourth, and over the armbands, and over ${rw ? (rw === 'sgt' ? 'your hands' : `${NAME(rw)}'s hands`) : 'your belt, where the pouch has come open under the halberd strap'}, and stop.

On the ring.

"That," he says.

He doesn't reach for it. He steps in close instead, so that his body is between you and the steward and the gate and the guests, and he looks at the ring for a long moment: at the heavy gold, and the place where the crest was ground away so that only the shape of a house is left and not its name.

"That's the shape of this house," he says, very quietly. "Ground off. I'd know it in the dark. I polished the one over that gate for eleven years, before." Before what, he doesn't say. "There's a councillor inside tonight who'd give a great deal to know where that's been. So would I." His eyes come up. "Where'd you get it, Gadrobi?"

${SQUAD().includes('ellis') ? `Ellis, at the end of the line, has gone still in the particular way that means she's counting exits.` : SQUAD().includes('kettle') ? `Kettle, behind you, very softly: "Kruppe *said*."` : ''}`,
      ch:[{t:'"Bought it off a drunk at the Phoenix, for the price of a round."', check:['guile',13], go:'c6_signet_ok', fail:'c6_signet_bad'},
          {t:'Look him in the eye and say nothing.', go:'c6_signet_bad'}]}; },
    c6_signet_ok:()=>({sp:'The captain of the house', scene:'fete_street', txt:
`It's true, which helps. You tell it the way it was: a tavern with a painted bird over the door, a big man with a jug and a ruined soldier's shoulders, a round bought with the only thing he had left worth buying with.

He hears it. You watch him hear exactly which drunk, at exactly which tavern.

"Coll," he says. Not a question.

"He gave it for a round."

The captain looks at the ring for a long time. Something is happening behind his face that he isn't going to let out of it, not at this gate, not tonight.

"Keep it in your pocket," he says at last. "Not on a hand. There's a man inside who'd have the hand off for it, and I'd be the one told to hold it still." He steps back. "Go on. You're furniture. Be furniture."

${SQUAD().includes('brisk') ? `Brisk, when you're through the gate: "He served in that house." Flat. "Before. You could see it." She shifts the halberd. "Somebody always stays on, when a house changes hands. Somebody always has to."` : ''}`,
      ch:[{t:'Up the drive.', go:'c6_terrace_arrive'}]}),
    c6_signet_bad:()=>({sp:'The captain of the house', scene:'fete_street', txt:
`He waits. You let him.

"Round the back," he says. Pleasantly, for the steward's benefit. "All of you. There's been a mix-up with the guard list." Two men in blue have come up behind him without being called, and a third is coming from the gatehouse with a halberd that isn't for show.

Round the back is a stable yard: straw, a horse trough, lanterns on hooks, and a wall between it and the street so high that the Fete on the other side sounds like the sea. The gate to it shuts behind you. Somebody drops the bar.

"Nobody's going to hear anything over the Fete," the captain says. "Give me the ring, Gadrobi, and tell me where you got it, and you can go and stand on a terrace all night and I'll never have seen you." He lowers his halberd. "Or don't."

${SQUAD().includes('kettle') ? `Kettle's hand is on her satchel. "Stables," she says. "Straw." She takes the hand away again. "No. *No.*"` : ''}`,
      ch:[{t:'"Close up."', go:()=>startBattle('house_guards',{})},
          {t:'Kettle rolls a sharper across the cobbles, well away from the straw.', tag:'uses 1 sharper', req:()=>SQUAD().includes('kettle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('house_guards',{pre:true})}]}),
    c6_after_guards:()=>({sp:'The stable yard', scene:'fete_street', fx:()=>{ S.f.c6_guardsFought=1; }, txt:
`It's short, and loud for a moment, and then not, because the Fete on the other side of the wall swallows everything. When it's done the captain is sitting in the straw against the horse trough with a hand pressed to his ribs, breathing in short pulls, and his men are down around him, and none of them is dead, though one of them is thinking about it.

The captain looks at the ring. He looks at you.

"Coll's," he says. He's worked it out, sitting there. "You got it off *Coll*." Something that might be a laugh. "Hood's breath. He'd give his boots away if you asked him the right way."

The yard gate opens. Hedge comes through it with a halberd on his shoulder and a pie in his other hand, and stops, and looks at the straw, and the men in it, and the Fourth.

"First night on the job," he says. "*Hood's teeth.*"

Fiddler comes in behind him and takes it all in with one look. "Nobody's going to miss the captain of the house tonight," he says, to the yard. "Tonight's a very busy night." He and Hedge get the captain and his men into the tack room without any fuss at all, and bar the door, and Fiddler pockets the key. "Keep that ring in your belt, Sergeant, and your belt on. Terrace. Go."`,
      ch:[{t:'Up the drive.', go:'c6_terrace_arrive'}]}),
    c6_terrace_arrive:()=>({sp:'Lady Simtal\'s estate', scene:'fete_hall', txt:
`Up the white gravel between the lantern-trees, past the fountain in the drive, and in.

You've seen rich houses. Nathilog had a governor's palace. It would be the stables here.

The great hall of Lady Simtal's house is two storeys high and all of it lit: three chandeliers the size of wagons, hung with a thousand candles and a thousand drops of crystal, so that the light comes down in pieces. The floor is marble, black and white, and there are two hundred people on it in masks, dancing, or pretending to, and the music comes from a gallery you can't see. Beyond the hall, through tall doors thrown open to the night, the terraces: white marble stepping down toward the garden, with lanterns on poles and banquet tables under white cloths, and the lake beyond it all, black, and the Spawn over the lake, blacker.

Fiddler meets you at the terrace doors in a guard's blue, with a halberd on his shoulder, looking exactly like a guard. "Terrace," he says. "Walk it. Upper and lower. Anything comes over a balustrade that isn't a drunk, it's yours. The garden's down the steps; Hedge and me have the garden, and Whiskeyjack's there already." A pause. "Don't talk to the guests. Especially the tall one."

By a pillar at the edge of the hall stands a guest so tall that the dancers go round him the way water goes round a stone. A black dragon mask. He isn't dancing.

${SQUAD().includes('tuft') ? `Tuft stops dead in the terrace doors. ${S.f.c4_tuftDark ? `"The *house*," she whispers. "Sergeant. The house is here. Standing by a pillar, in a mask."` : `"Kurald Galain," she whispers. "Not leaking out of a crack. *Standing* there. In a mask."`} Her breath is smoking, and the hall is warm.` : ''}`,
      ch:[{t:'The terrace.', go:()=>startExplore('simtal_terrace')}]}),

    /* ---- the terraces ---- */
    c6_hall:()=>({sp:'The hall doors', scene:'fete_hall', txt: S.f.c6_duelDone ?
`The hall, through the terrace doors. The music has stopped and started again, the way music does in a house where something has happened that everyone has agreed not to have seen. The dancers are dancing a little closer together.

At the far end of the hall there's a small door with a gilt handle. It's closed. Nobody is standing near it. Everyone in the room is very carefully not standing near it.` :
`The hall, through the terrace doors: the chandeliers, the black and white floor, two hundred masks going round to music that seems to come out of the walls.

Near the musicians' gallery a girl in a silver half-mask is dancing with a young man who is plainly not the one she'd have chosen. She's looking over his shoulder at the tall windows, as if somebody might come in through one.

Up in the gallery, in the shadow behind the musicians, something moves: a boy-shaped something with a coil of rope, crouched on the rail, watching the girl. ${S.f.c6_crokus ? `You know the rope.` : ''} Nobody else looks up. Nobody at a Fete ever looks up.`,
      ch:[{t:'Back to the terrace.', go:()=>startExplore()}]}),
    c6_baruk:()=>({sp:'An old man in dark red', fx:()=>{ S.f.c6_baruk=1; }, txt: S.f.c6_baruk ?
`He's at the balustrade with his untouched wine. He inclines his head to you, very slightly, and goes back to watching his guest.` :
`An old man in robes of dark red, with a skullcap and a face like a well-kept ledger, is standing at the balustrade with a glass of wine he isn't drinking. He isn't masked. He looks as if he considered it and decided he was too tired.

He turns his head when you pass, and looks at your armband, and at your boots, and at the way you stand, and something in his face settles into a conclusion.

"You are not Lady Simtal's," he says. His voice is courteous and dry and exact, the voice of a man who has been correcting other people's arithmetic for fifty years and has stopped enjoying it. "Nor Gadrobi. Nor, I think, guards, except in the sense that tonight everyone is." A small inclination of the head. "Your Empire is very thorough, Sergeant. I find that I admire it. I would find it easier to admire from further away."

His eyes go to the tall guest by the pillar, and come back.

"A word, since we are on the same terrace. When the evening becomes interesting, and it will, stand somewhere else." He lifts the glass, a finger's width. "Not for my sake. For yours."

${SQUAD().includes('ellis') ? `Ellis, when you've moved off, not to you but near you: "The High Alchemist. Baruk. The Claw's page on him is one line long." A pause. "It says *don't*."` : SQUAD().includes('tuft') ? `Tuft, when you've moved off: "He's a mage. A big one. He's got it folded up so small you could put it in a pocket." She glances back. "People only fold it that small when it's very, very large."` : ''}`,
      ch:[{t:'Stand somewhere else.'}]}),
    c6_rake:()=>({sp:'The tall guest', fx:()=>{ S.f.c6_rakeMet=1; S.f.c6_sawRake=1; if (S.f.c4_seen) S.f.c6_rakeLooked=1; }, txt: (S.f.c6_rakeMet || (S.fxd && S.fxd.c6_rake)) ? // c6_sawRake is also set at Kruppe's table, so it can't mark this visit
`He's by the pillar with his untouched wine, and the space round him is exactly the size it was. ${S.f.c6_badgeCold ? `He doesn't look at Tuft again. He has done her the one courtesy, and that's the end of it.` : `He doesn't look at you. You're furniture again.`}` :
`You don't go close. Nobody goes close. There's a space round him by the pillar that the whole Fete is keeping without being told to, the way a crowd keeps the space round a fire.

He's very tall. Taller than the Andii on the roofs; taller than anyone you have ever stood near. A long coat, black and plain. A mask of black lacquer shaped like a dragon's head. Above it, falling down his back, hair the colour of old silver. There's something on his back under the coat, long and straight, that the coat doesn't quite hide. He holds a glass of wine and doesn't drink it.

The cold comes off him. Not the barrow's cold. Not frost. The cold of a deep well on a hot day, when you lean over the edge and it breathes on your face, and you understand how far down it goes.

${S.f.c4_seen ? `He turns his head. The dragon mask comes round, slowly, and the eyeholes are dark, and they rest on you. On your face. Then on each of the squad's faces, one after another, unhurried, the way a tall shape on a Daru roof once read them off like names on a list. It knew you then. It's checking.` : `He doesn't turn his head. You're the armband and the halberd, and he has seen ten thousand of both.`}

${S.f.c5_croneRake ? `And then he speaks. The voice is low and courteous and very tired, and so large that it seems to come from the whole terrace at once, though nobody else turns. "A raven told me of a squad on a hill," he says. "She said I would not care." A pause, in which the Fete goes on around him. "She was nearly right."` : ''}

${SQUAD().includes('tuft') ? `Tuft has come up at your shoulder, and shouldn't have. She's looking at him the way she looked at the Andii on the roof, with her lips parted and her breath smoking. "It's the *house*," she whispers. "Sergeant. The whole house. Standing on a terrace in a mask."${S.f.c4_tuftDark ? `

And the dragon mask turns, a fraction, from you to her.` : ''}` : ''}`,
      ch:[{t:'Stand still. Let him look at her.', req:()=>SQUAD().includes('tuft') && !!S.f.c4_tuftDark && !S.f.c6_badgeCold && !S.f.c6_rakeStep && !S.f.c6_rakeTuft, fx:()=>{ S.f.c6_rakeTuft=1; }, go:'c6_rake_cold'},
          {t:'Step between him and Tuft.', req:()=>SQUAD().includes('tuft') && !!S.f.c4_tuftDark && !S.f.c6_badgeCold && !S.f.c6_rakeStep && !S.f.c6_rakeTuft, fx:()=>{ S.f.c6_rakeTuft=1; }, go:'c6_rake_step'},
          {t:'Move on.', req:()=>!(SQUAD().includes('tuft') && !!S.f.c4_tuftDark && !S.f.c6_badgeCold && !S.f.c6_rakeStep && !S.f.c6_rakeTuft)}]}),
    c6_rake_cold:()=>({sp:'The tall guest', fx:()=>{ S.f.c6_badgeCold=1; S.f.c6_rakeLooked=1; }, txt:
`You don't move. Neither does Tuft.

He looks at ${S.f.c2_key === 'light' ? `her collar` : `the pack on her back, at the place in it where the badge is`}. Once. It isn't long. It's the way you'd look at a spider on your sleeve: not afraid of it, not angry at it, only noticing that it's there, and that it shouldn't be, and deciding.

Then he looks away, and turns back to the hall with his untouched wine.

Tuft makes a small sound.

${S.f.c2_key === 'light' ? `Her hand has gone to her collar.` : `She's put a hand behind her, flat against the canvas of the pack.`} "It's cold," she whispers. "Sergeant. It's gone *cold*." She takes the hand away and looks at it. "Like a window when somebody's drawn the curtain. From the inside." She's shaking a little, and her face is doing something you've never seen it do. "It knew my face. From the roof. The house knew my face, and it did me a *courtesy*."

${SQUAD().includes('ohl') ? `Ohl has seen it. He doesn't say anything. He looks at the tall man's back for a long time, and then at Tuft, and then he takes out the oilcloth, and looks at it, and puts it away again, the way you'd touch a charm.` : ''}`,
      ch:[{t:'Move on.'}]}),
    c6_rake_step:()=>({sp:'The tall guest', fx:()=>{ S.f.c6_rakeStep=1; if (SQUAD().includes('brisk')) loy('brisk',1); }, txt:
`You step. Half a step, sideways, so that you're between the pillar and Tuft, and the dragon mask, turning, finds your face instead of her collar.

It rests there. You feel yourself weighed: the whole of you, priced and set aside, in less time than it takes to breathe out. Not with contempt. Not with anything.

Then he looks away, and the cold goes with his eyes, and it's a party again.

"I don't know if you should have done that," Tuft says, very low, behind you. "I don't know if I'm glad." She has her hand on ${S.f.c2_key === 'light' ? `her collar` : `the strap of her pack`}. "It's still warm. Whatever he was going to do, he didn't." A breath. "I think he was going to be *kind*."`,
      ch:[{t:'Move on.'}]}),
    c6_kruppe_t:()=>({sp:'Kruppe', fx:()=>{ S.f.c6_kruppeT=1; S.f.c6_sawRake=1; }, txt: S.f.c6_kruppeT ?
`Kruppe is on his third plate. "Guards!" he says, and pushes a little cake an inch toward you across the cloth, and goes on eating before you can decide.` :
`Kruppe has found the banquet table, or it has found him; it's hard to say where one stops. He's seated, which nobody else on the terrace is, with a plate of little cakes in front of him and a second plate beside it for when the first runs out.

He doesn't look at you. He's looking past you, and as you watch, the tall guest in the black dragon mask comes walking along the terrace toward the balustrade, and the space round him walks with him; and as he passes the table, Kruppe says, conversationally, through a mouthful:

"Kruppe begs the tall gentleman's pardon. The mask! Superb. So very *like*. Kruppe has always held that the best masks tell the truth about the one who wears them, and the second-best tell a lie so large that no one can see round it." He dabs his lips. "Kruppe cannot for his life decide which this is."

The tall guest stops.

The terrace doesn't. The dancers go on dancing, and the wine goes on going round. But in the space round the tall man and the fat one, everything stops, the way it stops in a room when a cup goes over and everyone waits to hear whether it breaks.

The dragon mask looks down at Kruppe for a long moment.

"Nor can I," says the tall guest.

Kruppe beams. He holds up a little cake. "Kruppe is told that dragons are fond of honey-cake."

"Thank you," says the tall guest. "No." And he goes on, to the far balustrade, and stands there looking down at the garden, and the space goes with him.

Kruppe eats the cake himself. For the space of one chew he looks like a man who has just walked the whole length of a roof-ridge in the dark without looking down, and is very pleased with himself, and is going to need to sit very still for a while.

Then he sees you. "Guards! Kruppe did say. Not to *guard* him." He pushes the second plate an inch toward you. "Cake?"`,
      ch:[{t:'Take a cake.', fx:()=>{ if (SQUAD().includes('kettle') && !S.f.c6_cake) { S.f.c6_cake=1; loy('kettle',1); } }},
          {t:'Leave him to his plates.'}]}),
    c6_simtal:()=>({sp:'Lady Simtal', fx:()=>{ S.f.c6_simtal=1; }, txt: S.f.c6_simtal ?
`Lady Simtal is still watching the terrace doors. Every time a man in a silk coat comes through them she looks up, and every time it isn't him, something in her face goes a little harder.` :
`The hostess. You'd know it without being told: she's the one the guests turn toward without looking, the way plants turn toward a window. A gown the colour of pale wine. Jewels at her throat like frost on a branch. A mask of white feathers that she holds on a stick instead of wearing, so that you can see what a face she has, and what she has done with it. She's very beautiful. She's laughing at something a young man has said, and the laugh is lovely, and it doesn't reach anywhere.

She sees your armband, and you cease to exist. It's a thing she does with her eyes, like closing a door.

${S.f.c6_signetSeen && !S.f.c6_guardsFought ? `Then the door opens again. Her eyes come back, and go to your hand, and stay there for one breath. Somebody has told her. "The Gadrobi with the *ring*," she says, lightly, to the young man, as if it were a joke about the weather. The young man laughs. She doesn't. She looks away, and her fingers have gone white on the stick of the feathered mask.` : ''}

She's watching the terrace doors. Waiting for someone. Every time a man in a silk coat comes through them she looks up, and every time it isn't him, something in her face goes a very little harder.

${SQUAD().includes('ohl') ? `Ohl, when you've walked on: "She's afraid," he says. "Under all that. I've seen that face on people waiting for the surgeon to come in, when they've heard what the surgeon is like."` : ''}`,
      ch:[{t:'Stand somewhere else.'}]}),
    c6_orr:()=>({sp:'A councilman in green and gold', fx:()=>{ S.f.c6_orr=1; }, txt: S.f.c6_orr ?
`The councillor is at the top of the steps with his friends, laughing at the right places, and his eyes are still going, every few breaths, across the terrace to the thin young guard by the balustrade.` :
`A man in green and gold with a rapier at his hip and a mask of gilded leaves pushed up on his forehead is holding court at the top of the garden steps, with four men in masks around him laughing at the right places. Lean, handsome, going grey well. His voice carries without being raised. He is the kind of man who has never once had to raise it.

${S.f.c6_coll ? `You know who he is before anyone tells you. A big sober man in the street said it, looking at his own gate: *a councillor who took it with my wife's help.* ` : ''}Somebody at the next table says *Turban Orr* in the voice you'd use for the name of a storm.

He isn't listening to his friends. You watch him not listen. His eyes keep going, every few breaths, across the terrace to the balustrade over the lake, where one of Lady Simtal's guards is standing with a halberd: a thin young Daru with a sweating face, in blue and silver, who is watching the councillor back and trying very hard to look as if he isn't.

The councillor's eyes narrow a very little, the way a cat's do when a mouse makes a mistake.

${S.f.c6_signetSeen && !S.f.c6_guardsFought ? `Then they come to you, and to your hand. "You," he says, pleasantly, across the terrace, and his friends stop laughing. "The Gadrobi with the ring. My captain mentioned you." He smiles. It's a good smile. "We'll talk later. I'm sure you'll want to tell me all about it."` : S.f.c6_guardsFought ? `Once, they come to you, and rest there, puzzled, like a man who has lost count of his captains and is beginning to wonder where one of them went.` : ''}`,
      ch:[{t:'Stand somewhere else.'}]}),
    c6_mammot:()=>({sp:'An old priest in a Jaghut mask', fx:()=>{ S.f.c6_mammotSeen=1; }, txt: S.f.c6_mammotSeen ?
`The old priest is by the statue, alone, with his iced wine. Nobody has gone near him. You find you don't want to either.` :
`At the quiet end of the terrace, by a statue of somebody's grandfather, an old man in the plain dark robes of a priest is standing alone, and nobody is going near him, and nobody seems to know why they aren't.

His mask is the worst one at the Fete. You've seen birds and bulls and moons and foxes tonight, and this is a *face*: grey-green, heavy at the brow, with two tusks curving up out of the lower jaw, yellowed and cracked and very old. A Jaghut. Somebody's idea of a joke, at a Fete: the mask of the thing that children in this country are told will come for them if they don't go to sleep.

He isn't laughing. He's holding a cup of wine, and the wine in the cup has a skin of ice on it.

${S.f.c3_innCrokus ? `*Uncle Mammot says the Empire's a thing that happens to other cities*, a boy said to you once, at the Phoenix. This is the uncle. Kettle heard somebody on the steps say so: *the High Priest of D'rek, the boy's uncle, in that horrible mask.*` : `Kettle heard somebody on the steps say who he is: *Mammot. The High Priest of D'rek. In that horrible mask.*`}

He turns his head, slowly, the way an old man turns his head, and looks at you through the eyeholes.

"Soldiers," he says. It's an old man's voice, dry and kind; and under it, a long way under, something else says the same word a heartbeat later, like an echo coming back up a well. "At a Fete." He looks away, at the lake. "The world has become very small."

${SQUAD().includes('ohl') ? `Ohl, when you've walked on, is rubbing his hands together. "That man's cold," he says. "Not old-cold. I've had my hands in a thousand old men. *Cold*. The way the barrow was cold."` : ''}

${SQUAD().includes('tuft') ? `Tuft is walking with her arms folded tight inside the Andii cloak, looking back over her shoulder at the tusks. When you look at her she shakes her head, once. "I don't know," she says. "I don't *know*. Something's wrong in him and I can't see what. It's like something standing very still behind a door."` : ''}`,
      ch:[{t:'Walk on.'}]}),
    c6_derudan:()=>({sp:'A woman in a mask of feathers', fx:()=>{ S.f.c6_derudan=1; }, txt: S.f.c6_derudan ?
`The woman in black feathers is smoking on the balustrade. "Guard something," she says, without taking the pipe out of the mask.` :
`A woman in a mask of black feathers is sitting on the balustrade with her back against a lantern pole, smoking a long clay pipe through the mouth of the mask, which should be impossible, and which she is doing anyway. Her hands are old and dark and her rings are bone. She's watching ${SQUAD().includes('tuft') ? 'Tuft' : 'the squad'}.

${SQUAD().includes('tuft') ? `"Little Meanas," she says, as Tuft goes by, and Tuft stops as if she'd been called by her name. "Come here. No, don't. Stay there; I can see well enough." Smoke. "Somebody's using your ${S.f.c2_key === 'light' ? 'collar' : 'pack'} for a window, girl.${S.f.c5_tuftMarked ? ` And somebody else has put a thumb in your hair.` : ''}${S.f.c4_tuftDark ? ` And *that* one,` : ''}" ${S.f.c4_tuftDark ? `a nod of the feathers toward the tall guest, "knows your face." ` : ''}She taps the pipe on the stone. "Busy. Very busy, for somebody so small."

"A witch's advice, and free, because it's the Fete. Windows open both ways. Remember that, when you decide what to do about it."

Tuft stares at her. "Who are you?"` : `"Malazans," she says, to nobody. "In blue. Guarding. Oh, that's lovely." Smoke. "Who do you think you're guarding, soldiers?"`}

"A witch at a party," says the woman in feathers. "There's a priest here tonight, and an alchemist, and a witch, and a thing in a dragon mask, and not one of us came for the cake." She relights the pipe. "Go and guard something, Malazans."`,
      ch:[{t:'Go and guard something.'}]}),

    /* ---- guard rounds: the upper terrace ---- */
    c6_knives:()=>({sp:'The upper terrace', txt:
`Guard rounds, Fiddler said: upper and lower. The upper terrace is a narrow shelf of marble at the corner of the house above the lake, with a balustrade on the water side and one lantern pole, and nobody on it, because there's no wine up here and no music, only the wind off the water.

Except there is somebody on it.

They come over the balustrade from the lake side the way water comes over a weir: one, and another, and another, low and fast, landing on the marble without a sound. Dark coats. Soot-black blades held down along the forearm, the Daru way. They turn, all of them, toward the far end of the house, where the old man in dark red is standing with his tall guest; and then they see you, and stop.

${S.f.c4_key === 'aside' ? `The one in front is older than the rest, grey at the temples. You've seen him before: on Kalam's roof among the dead, looking at the space by your feet where you stood aside; and in an alley under the roofs, sitting against a wall with a hand to his ribs, telling you the Guild wasn't buying.

He smiles. It's the first time you've seen him do it. "Ocelot said you'd be here," he says, in Malazan, with the Daru bend on the vowels. "Ocelot said, if the ones who stand aside are on the terrace tonight, bring a friend." A fifth shape comes over the balustrade behind him, bigger than the rest, and straightens up. "I brought a friend."` : S.f.c4_key === 'shield' && S.kit.includes('guildtoken') ? `The one in front is older than the rest. He looks at your armband, and then at your face, and something in his own face changes, as if checking what he sees against something he's been told.

"Vell's Malazans," he says. Quietly, in Malazan, with the Daru bend. "Ocelot's clan owes you a boy." His blade doesn't come up. It doesn't go down either. "We've business at the far end of the house tonight. Not with you."` : `The one in front is older than the rest. "Guards," he says, in Daric, and then, looking harder, in Malazan: "Not guards." His blade comes up. "Doesn't matter. Tonight you're in the way."`}

${SQUAD().includes('kettle') ? `Kettle has her hand on the satchel. "There's a whole house under us," she says, very fast. "And a hall full of candles, and gas in the walls. Sharpers only, Sergeant. Small ones. *Small.*"` : ''}`,
      ch:[{t:'Hold up Vell\'s token.', req:()=>S.f.c4_key === 'shield' && S.kit.includes('guildtoken'), go:'c6_knives_pass'},
          {t:'"Close up."', req:()=>S.f.c4_key === 'aside', go:()=>startBattle('terrace_knives_2',{})},
          {t:'Kettle skims a sharper along the marble.', tag:'uses 1 sharper', req:()=>S.f.c4_key === 'aside' && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('terrace_knives_2',{pre:true})},
          {t:'"Close up."', req:()=>S.f.c4_key !== 'aside', go:()=>startBattle('terrace_knives',{})},
          {t:'Kettle skims a sharper along the marble.', tag:'uses 1 sharper', req:()=>S.f.c4_key !== 'aside' && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('terrace_knives',{pre:true})},
          {t:'Not yet. Back down the steps.'}]}),
    c6_knives_pass:()=>({sp:'The upper terrace', fx:()=>{ S.f.c6_guildPassed=1; S.f.c6_knivesDone=1; }, txt:
`You hold it up. A disc of black horn the size of a thumbnail, with a hole through it and nothing carved on it at all.

The older one looks at it. Then at you. Then, for a long moment, at your face again, as if matching it to a description.

"Vell's," he says. "He said a Malazan had it. He said you'd hold it up like it was a knife." Something at the corner of his mouth. "He's walking. He complains about the stitches. He's a rope man again."

He lowers his blade.

"Not tonight, Malazan. Tonight you're furniture. Stand against the wall like a good table and let the Guild go by."

They go by. Past you, close enough to touch, along the upper terrace and over the rail onto the lower, toward the far end of the house, and none of them looks back.

A little later, from the far end of the terrace, there's a flash of something that isn't lantern-light, and a sound like a heavy door shutting in a house that has no doors, and then the music again, as if nothing had happened. You'll never know what did.

${SQUAD().includes('brisk') ? `"Furniture," says Brisk. She considers the word. "I've been worse."` : `Kettle lets out a breath. "Furniture," she says. "I've been called worse. By *you*."`}

${SQUAD().includes('ohl') ? `Ohl is looking at the far end of the terrace, where the flash was. "I didn't hear anyone cry out," he says. "I'm choosing to be glad of that. I'm choosing very carefully."` : ''}`,
      ch:[{t:'Back to the rounds.'}]}),
    c6_after_knives:()=>({sp:'The upper terrace', scene:'fete_hall', fx:()=>{ S.f.c6_terraceFought=1; S.f.c6_knivesDone=1; gain('blackedblade'); }, txt:
`It's short, and it's quiet, because it has to be: two hundred people are dancing forty paces away, and a scream on the upper terrace would stop the music, and nobody on either side wants the music stopped. Marble, and soot-black blades, and the lake wind.

${S.f.c4_key === 'aside' ? `The old man from the alley goes down last. He sits against the balustrade with his blade across his knees, the way he sat against the warehouse wall, and looks at you. "There," he says. "Asked twice." And then he goes back over the balustrade, the way he came, into the dark over the water, and you hear the splash a long time after, and you don't know if it was him going in or him getting away.` : `The older one goes back over the balustrade the way he came, into the dark over the water, with a hand pressed to his side, and you hear the splash a long time after. The rest don't go anywhere.`}

One of them has dropped his blade on the marble. Longer than the roof knives, blacked with soot from point to pommel so that not even the edge catches the lantern. A party knife. ${SQUAD().includes('ellis') ? `Ellis picks it up by the blade and holds it out to you hilt first, without looking at you. "For walking into lamplight," she says, "and out again, without anybody remembering."` : SQUAD().includes('brisk') ? `Brisk picks it up and hands it to you hilt first. "Black all over. Even the edge. They've thought about it." She looks at the balustrade. "Didn't think about us."` : `You pick it up. It's lighter than it looks.`}

${SQUAD().includes('ohl') ? `Ohl is kneeling by the one who didn't get up, with his hands on him, arguing quietly in Ehrlii. He loses. He usually does, with the ones he meets like this. He closes the man's eyes and doesn't take out the oilcloth.` : ''}

Down on the lower terrace, the music has not stopped. Nobody looks up. Nobody at a Fete ever looks up.`,
      ch:[{t:'Back to the rounds.', go:()=>startExplore()}]}),

    /* ---- the duel ---- */
    c6_duel:()=>({sp:'The terrace', scene:'fete_hall', txt:
`He's come in. The man from the doorway, in the same plain dark coat, with no mask, moving through the Fete the way a knife moves through a loaf: not fast, not slow, and everything parting.

You're three paces from him when you see where he's going.

Across the terrace, the councillor in green and gold has stopped holding court. He's put down his glass. He's walking toward the balustrade over the lake, toward the thin young guard with the sweating face, and his left hand is lifting, not to the rapier, but to the air in front of him, the fingers moving the way ${SQUAD().includes('tuft') ? `Tuft's move before a working` : `a mage's move before a working`}.

The young guard sees him coming. His face goes the colour of the marble.

And the man in the plain coat walks straight into the councillor.

It isn't an accident. Nothing about him is an accident. His shoulder takes Orr's shoulder, and Orr's wine goes down the front of all that green and gold, and Orr turns, white with a rage he has never once had to show in public, and the man in the plain coat says, clearly, so that the whole terrace hears it:

"Councillor Orr. You're a thief, and I'm told you're a coward. I've come to find out about the second."

The terrace goes silent. The music doesn't; nobody's told the gallery. It goes on, bright and silly, over a hundred people who have all stopped moving at once.

Orr looks at him. He looks at the plain coat, and the plain face, and the empty hands. Then he laughs, a short, delighted, contemptuous sound. "A duel? With *you*?" He wipes the wine off his chest with two fingers. "At once. Here. Who seconds you?"

The man in the plain coat looks round the terrace. Nobody moves. Nobody on the whole terrace is going to second a man with no name against Turban Orr, in Turban Orr's own city.

${SQUAD().includes('brisk') ? `Brisk has shifted her weight. She's looking at you. She's always looking at you.` : ''}`,
      ch:[{t:'Watch.', go:'c6_duel_fight'}]}),
    c6_duel_fight:()=>({sp:'The terrace', scene:'fete_hall', txt:
`And then the space round the pillar moves.

The tall guest in the black dragon mask comes across the terrace, not hurrying, and the crowd opens in front of him like water in front of a prow, and he stops beside the man in the plain coat and looks down at the councillor.

"I will second him," he says.

Four words. The whole terrace breathes out.

Orr looks up at the dragon mask. He doesn't know who's under it; you can see him not know it, and decide it doesn't matter, and be wrong. "As you like," he says. Across the terrace the old man in dark red has closed his eyes.

They clear the mosaic runner. Somebody takes the guests back to the balustrades. Orr draws his rapier with a little flourish that he's done a thousand times in a hundred courtyards, and the man in the plain coat draws a plain short blade, and they stand.

Orr's free hand moves. You see it: the fingers shaping something in the air, quick and neat and practised, and the air in front of him thickens, the way air does in the moment before a working lands—

And nothing happens.

It goes out of him toward the man in the plain coat, whatever it was, and it gets to him, and it *stops*, the way water stops at a dry wall of sand, and there's nothing there. Orr's face changes. He's never in his life seen a working find nothing.

${SQUAD().includes('tuft') ? `"The dust," Tuft breathes, beside you. "Sergeant. It ate it. Whatever he threw, the dust on him just *ate* it."` : ''}

The man in the plain coat steps in. Twice. It takes less time than it takes to tell. Orr is on his knees on the mosaic with a look of enormous surprise, as if somebody had told him a joke he'd never heard before; and then he's on his face.

The tall guest looks down at the body for a moment. Then he turns and goes back to his pillar, and the space goes with him, and it's as if he'd never crossed the terrace at all.`,
      ch:[{t:'—', go:'c6_duel_after'}]}),
    c6_duel_after:()=>({sp:'The terrace', scene:'fete_hall', fx:()=>{ S.f.c6_duelDone=1; }, txt:
`The man in the plain coat wipes his blade on his own sleeve. He doesn't look at the body. He walks across the terrace to the hall doors, where a slender man in a silk coat the colour of a bruise has just come through them and stopped dead: Murillio, with his sheaf of masks still over his arm.

"Orr's dead," he says to Murillio. And then five more words. "Coll gets his house back."

Lady Simtal is standing a few paces off with her feathered mask forgotten in her hand. He says it to her too. The same words. He doesn't change them for her.

Then he walks away through the Fete, and it parts for him, and he's gone.

Murillio stands on the terrace for a long moment. Then he takes something out of his sleeve: a small knife, silver-hilted, a lady's knife. He goes to the banquet table in front of Lady Simtal and sets it down on the white cloth, gently, the way you'd set down a cup, and looks at her. You can see only a little of his face. You're glad it's only a little. He doesn't say anything. He turns, and goes into the hall.

Lady Simtal looks at the knife.

She picks it up. She walks into the hall, not hurrying, through the dancers, who part for her, to a small door at the far end with a gilt handle. She goes through it.

It closes.

Nobody on the terrace says anything for a long time. Then the music starts again, because somebody is paying the musicians to play, and they play.

${SQUAD().includes('ohl') ? `Ohl has taken a step toward the hall. He stops. "No," he says. Not to you. "No. It's hers." He doesn't look at you. His hands are shaking; they never shake. "I hate it. It's still hers."` : ''}

${SQUAD().includes('kettle') ? `Kettle, very quietly: "Is anyone going to *do* anything?" And then, because she's Kettle, and knows the answer: "No. No. It's a party."` : ''}`,
      ch:[{t:'Back to the rounds.', go:()=>startExplore()}]}),

    /* ---- the steps between the terrace and the garden (both ends) ---- */
    c6_steps:()=> S.area === 'simtal_garden' ? (S.f.c6_key ? {sp:'The terrace steps', txt:
`Up the steps is the terrace, and the hall, and a door with a gilt handle that nobody is going to open. Not now.`,
      ch:[{t:'Stay in the garden.'}]} : {sp:'The terrace steps', txt:
`The white steps back up to the terrace, the music, the lights.`,
      ch:[{t:'Up to the terrace.', go:()=>startExplore('simtal_terrace')},
          {t:'Stay in the garden.'}]}) : (S.f.c6_duelDone && S.f.c6_knivesDone) ? {sp:'The garden steps', txt:
`White steps going down off the marble into the dark, to lawns and hedges and lanterns in the trees. Fiddler and Hedge have the garden. Whiskeyjack is down there already.`,
      ch:[{t:'Down to the garden.', go:()=>{ startExplore('simtal_garden'); if (!S.f.c6_gardenSeen) talk('c6_garden_arrive'); }},
          {t:'Not yet.'}]} : {sp:'The garden steps', txt:
`White steps going down into the garden. Fiddler said walk the terrace first, upper and lower.${!S.f.c6_knivesDone ? ` You haven't walked the upper terrace yet, at the corner of the house over the lake.` : ''}${!S.f.c6_duelDone ? ` And the man from the doorway has just come in through the terrace doors, walking the way a knife walks, and you'd like to know where to.` : ''}`,
      ch:[{t:'Not yet.'}]},

    /* ---- the garden ---- */
    c6_garden_arrive:()=>{ const gw = (SQUAD().includes('brisk') && S.gear.brisk && S.gear.brisk.trinket === 'otatglove') ? 'brisk' : 'sgt'; return {sp:'Lady Simtal\'s garden', scene:'fete_garden', fx:()=>{ S.f.c6_gardenSeen=1; }, txt:
`Down the white steps, off the marble, onto grass.

The garden is bigger than the house. Lawns going down toward the lake in long dark shelves, with gravel paths raked into waves between them, and clipped hedges, and trees hung with lanterns so that every tree is a little lit room. A fountain throwing water up into the lantern-light and letting it fall. A pond with lilies. Statues. The music comes down the steps from the hall like water down a drain, thin and far off.

Most of the guests have stayed on the terraces. A few couples walk the paths. A few men who don't want to be seen talking are talking behind the hedges.

And at the far end of the garden, where the lawn runs down to the east wall and the lanterns stop, a woman is walking away from a flowerbed.

No mask. A dark cloak, a plain grey tunic, riding boots. One hand gloved and one bare. She crosses the lawn to the little iron gate in the west wall without hurrying and without looking at anyone, and goes through it, and it swings shut behind her.

You'd know her anywhere. You lay on your belly in the grass three hundred paces from her in the hills and felt that sword the whole way, and when she rode past the Fourth in the dark, nobody breathed. ${gw === 'brisk' ? `The glove on Brisk's belt is suddenly, very obviously, the other half of a pair.` : `The glove in your belt is suddenly, very obviously, the other half of a pair.`}

${SQUAD().includes('tuft') ? `Tuft has stopped on the bottom step with both hands pressed flat to her stomach, as if she'd been punched. "The hole," she whispers. "It went *past*. It went right past us." The shadow comes back round her fingers, thin and shaking. "She was *here*."` : ''}

Where the woman was, in the flowerbed at the far end of the lawn, the earth is freshly turned. And in the turned earth something small and black is growing. You'd swear it wasn't there when she knelt. A sapling: a twisted black stick of a thing no higher than your knee, with a faint light in it, green and violet, like the light at the back of a closed eye.

${SQUAD().includes('kettle') ? `"That wasn't *there*," Kettle says. "Was it? Tell me that wasn't there."` : ''}

${S.f.c6_kalamAsked ? `*Watch which door she uses*, Kalam said. She used the garden gate.` : ''}

Whiskeyjack is by the fountain.`,
      ch:[{t:'The garden.', go:()=>startExplore()}]}; },
    c6_wj_garden:()=>({sp:'Whiskeyjack', fx:()=>{ S.f.c6_wjGarden=1; }, txt: S.f.c6_wjGarden ?
`He's leaning on his halberd by the fountain, watching the sapling at the far end of the lawn. He doesn't look round. "Sergeant."` :
`He's standing by the fountain in a guard's blue, leaning on a halberd like a staff, and he's the only person in the garden who doesn't look as if he's at a party. He counts you. ${SQUAD().length === 6 ? 'Six' : 'Five'}.

"Sergeant." He doesn't take his eyes off the far end of the lawn. "You saw her."

"The Adjunct, sir. Out the garden gate."

"I saw her come in. An hour ago. I watched her kneel." The grey eyes go to the black sapling in the turned earth. "Whatever that is, she planted it, and she didn't stay to water it." He's quiet a moment. "Fiddler has the steps. Hedge has the east wall. Quick's on the other side of this fountain and the captain's by the pond. Kalam's where Kalam is. You've got the lawn."

He looks at you then. "Anything comes over a wall that isn't a drunk, it's yours until it's ours."

${S.f.wjRegard > 0 ? `A pause. "I'm glad it's you on the lawn." That's all. It's more than he's said to anyone in a month.` : S.f.wjRegard < 0 ? `A pause. "Try to keep it."` : `A pause, and then nothing, which from him is a kind of confidence.`}

He turns back to the sapling.

Behind you, on the east wall, where there was nothing a moment ago, something is crouched. Low, and dark, the size of a horse folded down small, the way a dog folds itself on a doorstep. Its eyes catch the lantern-light and give back something that isn't lantern-light.

Ten paces off, Hedge drops his onion.`,
      ch:[{t:'The east wall.', req:()=>!S.f.c6_houndDone, go:'c6_hound'},
          {t:'Leave him to it.'}]}),
    c6_fid_garden:()=>({sp:'Fiddler', fx:()=>{ S.f.c6_fidG=1; }, txt: S.f.c6_fidG ?
`Fiddler's on the steps, rubbing the back of his neck. "Still there," he says, meaning the feeling. "Worse."` :
`Fiddler is sitting on the bottom step with a halberd across his knees and a crossbow under his cloak that nobody at Lady Simtal's gate gave him. He's rubbing the back of his neck.

"Somebody's been digging in the flowerbed," he says, before you can speak. He nods down the lawn at the turned earth and the black stick in it. "Fresh. Nobody's supposed to be down there. Whiskeyjack watched her do it and didn't stop her, and I don't know why, and he's not going to tell me." He spits on the grass, a sapper's blessing, and looks as if he regrets it. "That thing's *growing*, Sergeant. I've been sitting here an hour. It was the height of my boot."

${SQUAD().includes('kettle') ? `He looks past you at Kettle. "Nothing, Falari. Not tonight. I don't care what comes over that wall. There's a city under this lawn full of gas and a vault full of *us*, and you know it better than anybody, because you stacked it."

"I know," says Kettle.

"I know you know." He goes back to rubbing his neck. "I'm telling you so you'll remember I told you."` : `"No munitions tonight," he says. "Not a sharper. You know why."`}`,
      ch:[{t:'Leave him to the steps.'}]}),
    c6_hedge_garden:()=>({sp:'Hedge', fx:()=>{ S.f.c6_hedgeG=1; }, txt: S.f.c6_hedgeG ?
`Hedge is at the east wall with his back to it and another onion. ${S.f.c6_houndDone ? `He keeps turning round to look at the top of the wall. "Cats and lovers," he says bitterly. "That's what I was told."` : `"Cats and lovers," he says.`}` :
`Hedge is leaning on the east wall with a halberd he's clearly forgotten he's holding, eating an onion like an apple.

"East wall," he says. "Nothing comes over the east wall but cats and lovers, the steward says. I've had four cats. No lovers." He considers the onion. "Night's young."

He's got his own satchel under his cloak, and he's got a hand on it, the way Kettle keeps a hand on hers. You look at the hand. He looks at you looking.

"Fiddler says nothing tonight. Fiddler's right." A bite of onion. "Fiddler's always right, and I've never once in my life done what he said, and we're both still here. Work that out."

${SQUAD().includes('kettle') ? `He looks past you at Kettle, and something in his face goes soft in a way that would embarrass him if he knew. "If it comes to it, Falari," he says, "if it *comes* to it — you'll know. Like Chub said. You'll know."

Kettle stares at him. "How do you know what Chub said?"

"Everybody who ever knew Chub knows what Chub said," says Hedge. "He said it to *all* of us."` : ''}`,
      ch:[{t:'Leave him to the wall.'}]}),
    c6_qb_garden:()=>({sp:'Quick Ben', fx:()=>{ S.f.c6_qbG=1; }, txt: S.f.c6_qbG ?
`Quick Ben is on the rim of the fountain, smiling at the sapling. "Sergeant," he says, without looking round.` :
`Quick Ben is sitting on the rim of the fountain with his hands folded between his knees, smiling at the black sapling at the far end of the lawn, which is a thing you have never seen anyone smile at.

"Sergeant." Pleasantly. "Stay off the gravel tonight. Gravel's loud." He doesn't explain. He never does.

${S.f.c6_mammotSeen ? `You tell him about the priest on the terrace in the Jaghut mask, and the wine with ice on it, and Ohl's hands. The smile doesn't move.

"Old priests are cold," he says. "D'rek's a worm. Her priests live in cellars." Then his eyes go to the terrace, once, and stay there a breath longer than the smile would like. "Hm," says Quick Ben.` : `"Everybody's here," he says, to the sapling. "Have you noticed? Everybody who could take this city apart, all in one garden, all being very polite to each other. It's like a room full of cussers with the wax scraped thin."`}

${SQUAD().includes('tuft') ? `He glances at Tuft, and away. "Closed any windows yet?"

Tuft doesn't answer. Her hand is ${S.f.c2_key === 'light' ? `at her collar` : `on the strap of her pack`}.` : ''}`,
      ch:[{t:'Leave him to the fountain.'}]}),
    c6_paran_garden:()=>({sp:'Captain Paran', fx:()=>{ S.f.c6_paranG=1; }, txt:
`He's standing by the pond with his hand on the pommel of the ordinary sword, watching the black sapling at the far end of the lawn the way he watched the long barrow in the vale: as if nothing needs to be looked at the moment it arrives, and this is going to arrive anyway.

"Sergeant." He doesn't turn his head. "She was here."

${S.f.c6_houndDone ? `His hand is on his chest, low, on the left, where the knife went in at Pale. He takes it away when he sees you see it.` : `"I felt her go by," he says. "The way you'd feel a draught from a door."`}`,
      ch:[{t:'"Toc gave me something to tell you, sir. On the plain."', req:()=>!S.f.c6_paranToc, go:'c6_paran_toc'},
          {t:'Leave him to the pond.'}]}),
    c6_crokus_garden:()=>({sp:'Crokus', fx:()=>{ S.f.c6_crokusRan=1; }, txt:
`They come across the lawn hand in hand at a run, out of the shadow of the hedges: a boy with his mask pushed up and his rope gone, and a girl in a silver half-mask and a gown the colour of the inside of a shell, holding her skirts up out of the wet grass with her free hand and laughing.

They see the armbands. They stop so hard the girl nearly goes over.

"Oh, no," says Crokus. "Oh, no, no, no." Then he sees your face. ${S.f.c6_crokus ? `"*You.* You said—"` : S.f.c3_innCrokus ? `"The road-menders! You're— oh, *gods*."` : `"Please."`}

The girl looks at you through the silver mask, and then at Brisk's hauberk, and Kettle's soot, and the whole of the Fourth standing on the lawn in Lady Simtal's blue. "Crokus," she says, in a voice that has never in its life had to ask for anything twice, "who *are* these people?"

"Guards," says Crokus.

"They're very ugly guards."

"They're the *nice* kind," says Crokus desperately, and looks at you, and waits to find out whether that's true.

${SQUAD().includes('tuft') ? `Tuft is watching his closed fist. The coin is in it. You can see the edge of it between his fingers, catching the lantern. "That's the one," she says, very quietly, to nobody. "That's the one everybody's going to want."` : ''}`,
      ch:[{t:'"We didn\'t see you."', fx:()=>{ if (SQUAD().includes('kettle') && !S.f.c6_crokusLet) { S.f.c6_crokusLet=1; loy('kettle',1); } }, go:'c6_crokus_gone'},
          {t:'Step aside and let them go.', go:'c6_crokus_gone'}]}),
    c6_crokus_gone:()=>({sp:'The lawn', txt:
`He grins, enormous, and pulls the girl on past you, and the two of them go down the lawn toward the dark end of the garden and the hedges there, laughing, and are gone into the shadows by the east wall.

That's the guard line, you think. You were it. A boy got past it, which is what boys are for.

${SQUAD().includes('ohl') ? `Ohl watches them go. "I was young once," he says. "In Ehrlitan. It was a very bad idea then too."` : ''}`,
      ch:[{t:'Back to the lawn.'}]}),
    c6_garden_gate:()=>({sp:'The garden gate', txt: S.f.c6_key ?
`The little iron gate in the west wall. It's where she went out. It's where, tonight, the whole of the Fete should have gone out, and didn't.` :
`A little iron gate in the west wall of the garden, giving onto a lane. It isn't locked. It doesn't need to be; nobody at the Fete wants to leave.

${S.f.c6_gardenSeen ? `The Adjunct went out through it an hour ago. You can still feel where she was, a little, the way you feel the place where a tooth was.` : ''}`,
      ch:[{t:'Leave it.'}]}),

    /* ---- the Hound ---- */
    c6_hound:()=>({sp:'The east wall', scene:'fete_garden', txt:
`It comes down off the wall in one long pour, like ink off the edge of a table, and lands on the lawn without a sound, and stands.

A Hound of Shadow. You saw them at Pale, in the tent lines, with the sky on fire. You saw two of them in the hills, come out of a hole in the air and go past you like weather. This one is smaller than those, or it's hunched, and it's hurt. Something has opened it along the flank, shoulder to haunch, in one long clean cut, and the cut isn't bleeding. It's smoking, faintly, like a wick someone has pinched out.

It lifts its head and looks across the lawn. At the terrace. At the lit hall and the music. At the black sapling in the turned earth. At you.

Across the lawn, by the pond, Paran has put his hand flat on his chest, low, on the left, as if something in there had turned over in its sleep.

Up on the terrace a woman laughs, and doesn't know.

${SQUAD().includes('tuft') ? (S.f.c5_tuftMarked ? `Tuft has gone very still. Her hand has gone up to the grey lock at her temple. "I know that one," she says, quietly and quite certainly. "Sergeant. That's the one that smelled my hand."` : `"It's hurt," Tuft says. "Something's hurt it badly. Things come to a place hurt when they're following something." She looks at the sapling. "It's following *that*."`) : ''}`,
      ch:[{t:'"Tuft. Go to it."', req:()=>SQUAD().includes('tuft') && !!S.f.c5_tuftMarked, go:'c6_hound_tuft'},
          {t:'"Shields! Keep it off the guests!"', go:()=>startBattle('garden_hound',{})},
          {t:'Kettle skims a sharper across the wet lawn.', tag:'uses 1 sharper', req:()=>SQUAD().includes('kettle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('garden_hound',{pre:true})}]}),
    c6_hound_tuft:()=>({sp:'Tuft', scene:'fete_garden', fx:()=>{ S.f.c6_houndKnew=1; S.f.c6_houndDone=1; if (SQUAD().includes('tuft')) loy('tuft',1); if (SQUAD().includes('ohl')) loy('ohl',-1); }, txt:
`She goes before you've finished saying it.

Across the wet grass, in the Andii cloak that doesn't take the light, with her hands open at her sides. ${SQUAD().includes('brisk') ? `Brisk moves to follow, and you put a hand on her arm, and she stops, and hates it.` : ''} The Hound watches her come. It doesn't move. Its lips come back off its teeth, a little, and then go down again.

She stops a pace from it. She holds out her hand, palm down, the way you'd hold it out to a strange dog in a strange yard.

It puts its head down and smells her hand. The way it did on the threshold in the hills, with the grey pulling at both of them. It takes a long time. It smells her fingers and her wrist and the cuff of the cloak, and then it lifts its great head and smells, very carefully, the grey lock at her temple.

Then it lies down.

It lies down in the wet grass at her feet, with its sides going like a bellows and its hurt flank to the sky, and lets out a breath that goes across the lawn like a cold draught under a door. Tuft kneels, and puts her hand on its neck.

Nobody breathes. ${SQUAD().includes('ohl') ? `Ohl, beside you, is saying something in Ehrlii under his breath, and it isn't to Hood, and you don't think he knows he's saying it.` : ''}

"It's all right," Tuft says. Not to you. "It's all right. It's hurt, and it came a long way, and it's tired." She looks up at you over the Hound's neck, and her face is wet, and she's smiling. "It *knew* me."

${SQUAD().includes('ohl') ? `"I hate this," Ohl says, very quietly. "I want that understood. I hate every part of this."` : ''}

By the fountain, where a lantern has gone out and nobody has lit it again, a man in a grey cloak is standing where nobody was.`,
      ch:[{t:'Back to the lawn.', go:()=>startExplore()}]}),
    c6_hound_lying:()=>({sp:'The Hound', txt:
`It's lying by the east wall where it lay down, with its hurt flank to the sky, breathing. The smoke has stopped coming off the wound. It watches the black sapling, and the terrace, and Tuft. Mostly Tuft.

${SQUAD().includes('tuft') ? `Tuft keeps looking back at it, the way you'd look back at a lamp you'd left burning.` : ''}`,
      ch:[{t:'Leave it be.'}]}),
    c6_after_hound:()=>({sp:'The east wall', scene:'fete_garden', fx:()=>{ S.f.c6_houndFought=1; S.f.c6_houndDone=1; }, txt:
`It's short and ugly, the way anything is with a Hound in it: the weight of it, and the speed, and the cold that comes off it like the cold under a door. It isn't trying to kill you. You understand that about halfway through. It's hurt and it's afraid and it wants to be past you, at the far end of the lawn, at the black thing in the flowerbed, and you're in the way.

You stay in the way.

In the end it gives up the lawn. It goes back over the east wall the way it came, in one long pour, and into the dark on the other side, and the dark takes it without a sound.

Up on the terrace the music hasn't stopped. Two masks at the balustrade are laughing about a *very* large dog.

${SQUAD().includes('tuft') ? `Tuft is looking at the wall where it went. "It wasn't here for us," she says. "It was here for *that*." The sapling. "It came all this way, hurt, for that, and we sent it back."` : ''}

${SQUAD().includes('ohl') ? `Ohl is going down the line with his hands out, the Denul light coming up faint and green under his palms. "Nothing that won't close," he says. He sounds surprised. He sounds, very slightly, disappointed in the Hound.` : ''}

By the fountain, where a lantern has gone out and nobody has lit it again, a man in a grey cloak is standing where nobody was.`,
      ch:[{t:'Back to the lawn.', go:()=>startExplore()}]}),

    /* ---- the summons: the grey cloak, and Tuft ---- */
    c6_claw:()=>({sp:'A grey cloak', scene:'fete_garden', fx:()=>{ S.f.c6_clawMet=1; }, txt:
`He's standing by the fountain with his hands folded in front of him, where the lantern went out. Middling height. Middling face. His boots are clean. It rained at dusk and the lawn is soaked through and his boots are clean.

You know him. ${S.f.clawMet || S.f.c1_claw ? `You've known him since the Pale.` : `You've never been introduced. You know him anyway; the whole Host knows that walk.`}

"Sergeant." Pleasantly, as if you'd met at a wedding. ${S.f.marked ? `"{sgt}. Still attached, I see. Good.${S.f.c1_claw && !S.f.decoy && !S.f.gaveClaw ? ` I did ask.` : ''}"` : S.f.clawFavour ? `"It's always a pleasure, at a party, to find a helpful squad on the lawn."` : `"We keep meeting at other people's fires."`}

"I won't keep you. You're on duty; I can see the armband. It suits you. I'm here on behalf of a man who would like to see the Fete, and can't come himself. He's very busy. He's always very busy." His eyes go past you. "Tuft."

Tuft goes still. It's the stillness from the tent at the Pale, the stillness she has at two words that nobody has said aloud yet tonight.

"The High Mage would like to see the Fete," says the grey cloak. "You'll stand where I tell you, and keep your eyes open. That's all. You won't have to do anything. You never did." ${S.f.c2_key === 'light' ? `He glances at her collar. "You've been wearing it since the plain. He's been grateful. He's been able to see a great deal."` : `He glances at her pack. "Take it out, there's a good girl, and pin it on. He sees so badly through canvas."`}

${S.f.c1_key === 'claw' ? `"One of yours knew my name," Tuft says. Her voice is very small. "At the Pale. At the tent. Not you. The other one."

"We all know all their names," says the grey cloak, kindly. "It's the job."` : ''}

${[SQUAD().includes('ellis') ? `At the end of the line, Ellis has gone still in a way you've never seen, even on the hillside. She knows the boots.` : '', SQUAD().includes('brisk') ? `Brisk's shield has come up an inch, all by itself.` : ''].filter(Boolean).join(' ')}`,
      ch:[{t:'"Tuft. It\'s your call."', req:()=>S.loy.tuft > -2, go:'c6_tuft_ask'},
          {t:'"Tuft. It\'s your call."', req:()=>S.loy.tuft <= -2, go:'c6_tuft_cold'},
          {t:'"She\'s a marine. She stands where I put her."', req:()=>S.loy.tuft > -2, fx:()=>{ S.f.c6_defied=1; }, go:'c6_tuft_ask'},
          {t:'"She\'s a marine. She stands where I put her."', req:()=>S.loy.tuft <= -2, fx:()=>{ S.f.c6_defied=1; }, go:'c6_tuft_cold'},
          {t:'"Do what he says, Tuft."', fx:()=>{ S.f.c6_keptHow='handed'; }, go:'c6_tuft_kept'}]}),
    c6_tuft_ask:()=>({sp:'Tuft', scene:'fete_garden', txt:
`${S.f.c6_defied ? `The grey cloak inclines his head. "Of course," he says. "Where would you put her, Sergeant?" And you find you don't know, and he watches you not know, and waits.

` : ''}Tuft doesn't answer him. She doesn't answer you either, not at first. She takes the Deck out of her sleeve.

Her hands aren't steady. They haven't been steady since the ladder. She holds the Deck in both of them, face down, with the paint worn off the House of Shadow, and looks at it the way you'd look at a door you've walked past every day of your life.

"Sergeant," she says. "There's a card in here I've never drawn for myself."

"Nineteen years. I've read for the squad, and for the cadre, and for the High Mage's staff, and for a quartermaster in Genabaris who wanted to know about his wife. I've never once turned one for me. I was afraid of whose face would be on it." She swallows. "His. A Hound's. The house's. I didn't know which would be worst."

"I'm going to draw it now. Here. With him watching." A breath. "I'd like you to be standing next to me."

${S.f.c1_plantMarine ? `A long way back, outside a tent at the Pale, in the cold, a cadre mage said a thing to you that you've carried ever since without knowing what it weighed. *There's a card in her deck she's never drawn for herself. When she does, be standing next to her.*

Now you know what it weighs.` : `You don't know why she's asking. You know that she is, and that she has asked you for something in that voice only once before, on a ridge in the hills, and that time it was to be kept away from a thing.`}

${S.f.c6_noCard ? `You told her no at the gate. She isn't asking you for a reading now. She's asking you to stand somewhere.` : ''}

The grey cloak waits. He's good at waiting. He's been waiting, you think, since the plain.`,
      ch:[{t:'Stand next to her.', fx:()=>{ S.f.c6_selfDrawn=1; }, go:()=>cardSequence(()=>talk('c6_tuft_card'), {card:'blank', self:true})},
          {t:'"Not now, Tuft. Do what he says."', fx:()=>{ S.f.c6_keptHow='refused'; }, go:'c6_tuft_kept'}]}),
    c6_tuft_cold:()=>({sp:'Tuft', scene:'fete_garden', txt:
`She doesn't look at you.

She hasn't looked at you properly for a long while. You've spent her the way sergeants spend soldiers, a little at a time, an order here and a *no* there, and there isn't much left in the purse, and she has known it longer than you have.

"Yes, sir," Tuft says. To the grey cloak.

${S.f.c2_key === 'light' ? `Her hand goes to the badge on her collar and stays there, the way you'd keep a hand on a door so it won't swing.` : `She shrugs off her pack and kneels on the wet grass and opens it, and begins to feel in the bottom of it for something wrapped in a stocking.`}

The grey cloak smiles at her. It's a kind smile. That's the worst of it.`,
      ch:[{t:'"Tuft. Stop. Look at me."', check:['guile',12], fx:()=>{ S.f.c6_keptHow='cold'; }, go:'c6_tuft_round', fail:'c6_tuft_kept'},
          {t:'Let her go.', fx:()=>{ S.f.c6_keptHow='cold'; }, go:'c6_tuft_kept'}]}),
    c6_tuft_round:()=>({sp:'Tuft', scene:'fete_garden', txt:
`It isn't what you say. It's that you say it at all, in front of him, in the voice you use to say *hold* on a line.

She stops. ${S.f.c2_key === 'light' ? `Her hand stays on the badge.` : `Her hand stays in the pack.`} She stays like that for a long time, with the grey cloak watching, and the fountain going, and the music coming down the steps.

Then she looks at you. Properly. It's been a while.

"You'd stand there?" Not believing it. "Next to me? With *him* watching?" She takes the Deck out of her sleeve with the hand that isn't busy. "There's a card in here I've never drawn for myself. Nineteen years. I was afraid of whose face would be on it." A breath. "I'm going to draw it. If you stand there."

${S.f.c1_plantMarine ? `*When she does*, a cadre mage told you once, in the cold outside a tent, *be standing next to her.*` : ''}`,
      ch:[{t:'Stand next to her.', fx:()=>{ S.f.c6_selfDrawn=1; }, go:()=>cardSequence(()=>talk('c6_tuft_card'), {card:'blank', self:true})},
          {t:'"No. Do what he says."', fx:()=>{ S.f.c6_keptHow='refused'; }, go:'c6_tuft_kept'}]}),
    c6_tuft_card:()=>{ const c = CARDS.blank || {name:'The unpainted card', fx:''}; const gw = (SQUAD().includes('brisk') && S.gear.brisk && S.gear.brisk.trinket === 'otatglove') ? 'brisk' : 'sgt';
      return {sp:'The unpainted card', scene:'fete_garden', txt:
`She draws it standing up, in the dark by the fountain where the lantern went out, with you at her shoulder close enough to feel her shaking, and the grey cloak three paces off with his hands folded, and the Fete going on over all your heads like weather.

One card. For herself. The first time.

The cards on either side stay face down. She turns it over.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)}${c.fx ? ` · ${esc(c.fx)}` : ''}</div>`, oncard:['blank',false],
      after:`It's blank.

Not worn. Not the House of Shadow with the paint rubbed off. *Blank*: pale gesso over the grain of the wood, smooth and unmarked, as if the painter had primed it and then put down the brush and gone to the window and never come back.

Tuft looks at it for a long time.

Then she laughs.

You've heard her laugh at exactly one thing, and it's Kettle. This isn't that laugh. This one comes up out of her from somewhere a long way down, the way water comes up out of a spring in a dry field, and she puts the back of her hand against her mouth and it comes out round her fingers anyway.

"It's *nobody's*," she says. "Sergeant. Look at it. Nineteen years I was afraid of whose face it'd have, and it hasn't got one. It isn't *his*. It isn't anybody's." She turns it to what light there is. "It isn't anybody's *yet*."

She puts it inside her tunic, against her chest, the way Brisk keeps her letter.

Then she looks at the grey cloak, and her face changes. ${S.f.c2_key === 'light' ? `Her hand goes up to her collar, and unpins the badge: silver and enamel, a hand on a flame.` : `She reaches into the pack and takes out a stocking, and out of the stocking a badge, silver and enamel, a hand on a flame, that hasn't seen a lamp in fourteen months.`}

"This is his," she says. "The card's mine. This isn't." She holds it out on her open palm where you can all see it. It doesn't look like anything. It looks like a pin.

${S.f.c6_badgeCold ? `"And it's *cold*," she says. "It's been cold since the terrace."` : `"Sergeant," says Tuft. "I'd like it not to be anybody's either."`}`,
      ch:[{t:'"Tell him, Tuft."', req:()=>!!S.f.c6_badgeCold, go:'c6_tuft_dark'},
          {t: gw === 'brisk' ? '"Brisk. The glove."' : 'Take the glove out of your belt and hold it open.', req:()=>!S.f.c6_badgeCold, go:'c6_tuft_glove'},
          {t: S.f.c6_houndKnew ? '"The Hound, Tuft. It knows your hand."' : '"The thing that smelled your hand. Let it."', req:()=>!S.f.c6_badgeCold && !!S.f.c5_tuftMarked, go:'c6_tuft_shadow'},
          {t:'Look up at the terrace.', req:()=>!S.f.c6_badgeCold && !!S.f.c4_tuftDark, go:'c6_tuft_dark'},
          {t:'"Go with him, Tuft."', req:()=>!S.f.c6_badgeCold, fx:()=>{ S.f.c6_keptHow='handed'; }, go:'c6_tuft_kept'}]}; },

    /* ---- the four roads for the badge ---- */
    c6_tuft_glove:()=>{ const gw = (SQUAD().includes('brisk') && S.gear.brisk && S.gear.brisk.trinket === 'otatglove') ? 'brisk' : 'sgt';
      return {sp:'The otataral glove', scene:'fete_garden', fx:()=>{ S.f.c6_tuft='glove'; if (SQUAD().includes('tuft')) loy('tuft',2); if (gw === 'brisk' && SQUAD().includes('brisk')) loy('brisk',1); if (SQUAD().includes('ohl')) loy('ohl',1); if (SQUAD().includes('kettle')) loy('kettle',1); }, txt:
`${gw === 'brisk' ? `Brisk takes the glove off her belt without a word, and pulls it open, and holds it out at arm's length on the flat of her palm, the way you'd hold out a bowl.` : `You take the glove out of your belt, and pull it open, and hold it out on the flat of your palm, the way you'd hold out a bowl.`}

A plain riding glove. The Adjunct's, left on a stone where her tent stood in the hills; its pair went out through the garden gate an hour ago on her hand. There's a fine red dust worked into the seams that won't brush out, and when it's held open the air round it goes flat and dead, the way the air goes in a room where a clock has stopped.

Tuft looks at it.

She has not stood on the same side of a fire as that glove since the hills. She has walked round it and slept away from it and turned her back on it, and you've watched her do it for days and never said anything, because what would you say.

She walks up to it now.

It costs her. You can see what it costs; every step is a step toward the hole in the world, toward the place where she's nothing, and she hates it, and she takes the steps anyway, one, and two, until she's close enough to touch it. The shadow round her fingers thins, and frays, and goes out.

"Hold it still," she says. Her voice has gone small and flat: the voice of someone speaking in a room with no echo.

She drops the badge in.

It doesn't make a sound. That's the thing you'll remember. Silver and enamel into leather and red dust, and no sound at all, and then something goes out. You feel it more than see it: a thread, somewhere, fine as a hair, running out of the badge and away north over the city in the dark, toward a camp you'll never see and a tent you'll never be let into, and the thread goes slack, and then it isn't there. Like a candle under a cup. You don't see it go out. You just notice, afterwards, that you're standing in the dark.

Three paces off, the grey cloak's left hand opens.

He's been holding it loosely closed at his side since he came, the way you'd hold a thread you'd been given to mind. It opens now, on its own, and he looks down at it, at the empty palm, for a long moment.

"Ah," he says.

Tuft has sat down on the wet grass. Just sat, all at once, the way you sit when your knees decide for you. Both her hands are pressed flat to her chest, over the blank card. "It's quiet," she says. "Sergeant. It's all *quiet*. Meanas is — it's there, it's a long way down, like a well I've dropped something into—" She breathes. "I'm not anybody's. I'm not *anybody's*." Her face crumples. "Oh, gods. It hurts."

The grey cloak looks from his hand to the glove to her, and back to his hand.

"That was his," he says, quite mildly. "Now it's a pin." He folds his hands again. "He'll be disappointed. He's so rarely disappointed. I find I shall enjoy telling him, a little, and I'd rather you didn't repeat that." He inclines his head to you. "Sergeant."

And he goes: not over the wall, but up through the garden, past the fountain and up the white steps, like a guest who has remembered another engagement. His boots are still clean.${S.f.c6_houndKnew ? ` By the east wall, the grass where the Hound was lying is empty. Nobody saw it go.` : ''}

${gw === 'brisk' ? `Brisk closes her fist round the glove, badge and all, and holds it the way she holds the rim of her shield. "Mine now," she says. "Anybody wants to look out of it, they can come and ask me."` : `You close the glove round the badge and put it back in your belt. Tuft watches you do it. "Keep it," she says. "I don't want to see it. I don't want to *not know where it is*, either."`}

${SQUAD().includes('ohl') ? `Ohl has knelt in the grass beside her and put his hand on her head, the way he did on a hill in the dark, and this time he says what he finds. "Nothing," he says. "Nothing's got her. Nothing at all." He sounds like a man reading good news off a list he'd been afraid to open.` : ''}

"It isn't polite," Tuft says, to the glove. She's crying and she's almost laughing. "That's why I was afraid of it. Everything else was *polite*.${S.f.c4_tuftDark ? ` The house was polite.` : ''}${S.f.c5_tuftMarked ? ` The Hounds were polite.` : ''} *He* was polite." A nod at the steps, where the grey cloak went. "That thing doesn't ask. It just eats." She wipes her face with the heel of her hand. "Good."

${S.f.c3_askedTuft ? `And then, still sitting in the wet: "Sergeant. What Kruppe said. At the Phoenix door." She's looking east. "Tomorrow. I'll tell you tomorrow. I promise I'll know by then."` : ''}`,
      ch:[{t:'Help her up.', go:()=>startExplore()}]}; },
    c6_tuft_shadow:()=>({sp:'The Hound', scene:'fete_garden', fx:()=>{ S.f.c6_tuft='shadow'; if (SQUAD().includes('tuft')) loy('tuft',2); if (SQUAD().includes('ohl')) loy('ohl',-1); if (SQUAD().includes('brisk')) loy('brisk',-1); }, txt:
`Tuft doesn't call it. She doesn't say anything at all. She turns round with the badge on her open palm and looks ${S.f.c6_houndKnew ? `at the Hound lying in the wet grass by the east wall` : `at the place on the east wall where the Hound went over`}, the way you'd turn toward a door somebody has knocked on.

${S.f.c6_houndKnew ? `The Hound lifts its head.

It gets up. It takes its time about it. It comes across the lawn to her, limping on the hurt side, huge in the lantern-light, and the grey cloak takes a step back, which you will remember for the rest of your life. The Hound puts its head down over Tuft's open hand the way it did on the threshold in the hills, the way it did on the lawn.

Then it opens its jaws, and closes them, very gently, on nothing. On the air an inch above the badge. Like a dog snapping at a fly.` : `The dark under the east wall moves.

Not the Hound. The shadow the Hound left when it went over: the dark in the angle of the wall, where the lantern-light doesn't reach. It gathers itself, and leans out across the lawn, long and low, the shape of a head, the shape of jaws, made of nothing but the place where the light isn't. It reaches Tuft's open hand. It closes its jaws, very gently, on nothing. On the air an inch above the badge. Like a dog snapping at a fly.`}

Something parts. You feel it: a thread, fine as a hair, running out of the badge and away north into the dark over the city; and the thread is bitten through, and the far end of it goes whipping away north like a snapped line on a ship's deck, and is gone.

Three paces off, the grey cloak's left hand opens. He's been holding it loosely closed at his side since he came, the way you'd hold a thread you'd been given to mind. He looks down at the empty palm.

"Ah," he says. And then, differently, looking at the ${S.f.c6_houndKnew ? 'Hound' : 'wall'}: "He won't like that. It isn't a house he likes."

${S.f.c6_houndKnew ? `The Hound looks at Tuft a moment longer. Then it goes: across the lawn and up the east wall in one long pour, and over, and the dark on the other side takes it.` : `The shadow goes back into the angle of the wall and is only a shadow again.`}

Tuft touches the grey lock at her temple. It's cold; you can see her feel it. Her eyes are very bright.

"It was *polite*," she says. "Did you see? It asked. It put its head down and it *asked*."

"Out of one hand, Tuft," says the grey cloak, gently, the way you'd speak to a child who has taken sweets from a stranger, "and into another. I do hope you know whose." He inclines his head to you. "Sergeant." And he goes, up through the garden and the white steps, like a guest remembering another engagement, with his boots still clean.

${SQUAD().includes('ohl') ? `"A thumb," says Ohl. He's very pale. "I told you. On the hill. A thumb, keeping her place in a book." He looks at the east wall. "And now it's turned the page." He turns away. "I'm glad she's out of *his* hand. I hate whose hand she's in. I'm too old to hold both of those at once, and I'm going to have to."` : ''}

${SQUAD().includes('brisk') ? `Brisk says nothing. She moves, very slightly, so that she's standing between Tuft and the east wall, and she stays there.` : ''}

${S.f.c3_askedTuft ? `Tuft, still looking at the wall: "Sergeant. What Kruppe said, at the Phoenix door. Tomorrow. I'll tell you tomorrow. I promise I'll know by then."` : ''}`,
      ch:[{t:'Back to the lawn.', go:()=>startExplore()}]}),
    c6_tuft_dark:()=>({sp:'Kurald Galain', scene:'fete_garden', fx:()=>{ S.f.c6_tuft='dark'; S.f.c6_rakeLooked=1; if (SQUAD().includes('tuft')) loy('tuft',2); if (SQUAD().includes('ohl')) loy('ohl',-1); }, txt:
`${S.f.c6_badgeCold ? `She doesn't hold it out to anyone. She looks at the grey cloak over it.

"There's nothing to look through," she says.

He frowns. It's the first expression you've ever seen on him that isn't pleasant. He lifts his left hand, loosely closed, the way he's been holding it at his side since he came, like a man minding a thread; and he looks at it; and he opens it. Nothing.

"When?" he says.

"On the terrace." Tuft's voice is quite steady. "A tall man in a dragon mask looked at my ${S.f.c2_key === 'light' ? 'collar' : 'pack'} the way you'd look at a spider on your sleeve, and it went cold." She turns the badge over on her palm. "Somebody in the house came to the window. And drew your curtain. From the inside."

The grey cloak looks up, past the fountain, past the steps, at the terrace balustrade, where a very tall figure in a black dragon mask is standing with a glass of wine he isn't drinking, looking out over the garden at nothing in particular.` : `She doesn't hold it out to anyone. She turns round, with the badge on her open palm, and looks up.

At the top of the white steps, at the terrace balustrade, a very tall figure in a black dragon mask is standing with a glass of wine he isn't drinking, looking out over the garden.

He looks down.

Not at you. Not at the grey cloak. At the pin on Tuft's palm. Once. It isn't long. It's the way you'd look at a spider on your sleeve: not afraid, not angry, only noticing that it's there, and that it shouldn't be.

Then he looks away, out over the lake, as if he'd never looked at all.

The badge goes cold. You see it happen: frost comes up on the silver, fine as breath on a window, and Tuft's hand closes on it and she gasps. And three paces off, the grey cloak's left hand, that he's been holding loosely closed at his side since he came like a man minding a thread, opens on its own.

He looks at it. He looks up at the terrace.`}

For the first time since the Pale, you watch the grey cloak be afraid. It's very small. It's there.

"Well," he says. "I can hardly complain to *him*."

Tuft is holding the cold pin against her chest with both hands, and she's crying a little, and she's smiling. "Kurald Galain," she says. "The house. It knew my face from the roof, and it did me a *courtesy*." She laughs, wet. "It was *polite*, Sergeant. Everything that's ever been kind to me has been something I was told to be afraid of."

The grey cloak inclines his head to you. "Sergeant." He goes: up through the garden, up the white steps, past the tall man at the balustrade without looking at him, very carefully without looking at him; and his boots are still clean.${S.f.c6_houndKnew ? ` By the east wall, the grass where the Hound was lying is empty. Nobody saw it go.` : ''}

${SQUAD().includes('ohl') ? `*Don't tell Ohl*, Tuft said once, on a roof. *He'll write it down.* Ohl heard anyway. He's looking up at the terrace, at the tall figure, and his face is grey. "I'm not going to write this down," he says. "I want that understood. There are things I don't write."` : ''}

${SQUAD().includes('tuft') ? `She pulls the Andii cloak closer round her. "It's still cold," she says. "The cloak. It never warmed up, not once, since the roof. I think I know why, now."` : ''}

${S.f.c3_askedTuft ? `"Sergeant. What Kruppe said, at the Phoenix door." She's looking east. "Tomorrow. I'll tell you tomorrow. I promise I'll know by then."` : ''}`,
      ch:[{t:'Back to the lawn.', go:()=>startExplore()}]}),
    c6_tuft_kept:()=>({sp:'Tuft', scene:'fete_garden', fx:()=>{ S.f.c6_tuft='kept'; const how = S.f.c6_keptHow || 'handed';
        if (SQUAD().includes('tuft')) loy('tuft', how === 'handed' ? -3 : how === 'refused' ? -2 : -1);
        if (how !== 'cold') { if (SQUAD().includes('brisk')) loy('brisk',-1); if (SQUAD().includes('kettle')) loy('kettle',-1); }
        if (SQUAD().includes('ohl')) loy('ohl',-1); }, txt:
`${S.f.c6_keptHow === 'cold' ? `You let her go. Or you try to stop her, and it isn't enough, and it comes to the same thing.` : S.f.c6_keptHow === 'refused' ? `"Not now," you say. "Do what he says."

She looks at you for a long moment. You watch something in her face go out${S.f.c5_tuftHeld ? `, the way it went out on the hillside when you said *no*,` : ''} and this time it doesn't come back.` : `"Go with him, Tuft," you say.

She looks at you for a long moment. You watch something in her face go out, and this time it doesn't come back.`}

"Yes, Sergeant," says Tuft.

${S.f.c6_selfDrawn ? `She looks at the pin on her open palm for a long moment. Then she pins it back on her collar, with fingers that are perfectly steady.` : S.f.c2_key === 'light' ? `She takes her hand away from the badge on her collar and lets it stay there.` : `She takes a badge out of the bottom of her pack, silver and enamel, a hand on a flame, and pins it on her collar with fingers that are perfectly steady.`}

"Thank you, Sergeant," says the grey cloak. "He'll remember you were helpful." And to Tuft, kindly, the way you'd speak to a horse you were leading: "By the little tree, I think. Where you can see the lawn and the steps and the wall. Keep your eyes open. That's all."

She goes where he says. She stands by the black sapling in the turned earth, in the Andii cloak, and she opens her eyes wide, wider than eyes open, and something changes in them. You can't say what. The pupils go wide and still, like a window at night with somebody standing behind the glass, looking out.

${SQUAD().includes('kettle') ? `"Tuft?" says Kettle, and her voice cracks on it.` : ''}

"She's here," says the grey cloak. "So is he." He folds his hands. "It'll be over by morning. It always is."

${SQUAD().includes('brisk') ? `"Sergeant," says Brisk. Only that. It's the whole conversation, the way it always is with her, and she has never once said it in this voice.` : ''}

${SQUAD().includes('ohl') ? `Ohl turns his back on the sapling. He doesn't take out the oilcloth. He stands with his back to her and his hands clasped behind him, and you can see them shaking.` : ''}

${S.f.c6_houndKnew ? `By the east wall the Hound gets up out of the wet grass and looks at Tuft for a long moment: at her, and at whatever is looking out of her. Then it goes over the wall, and the dark on the other side takes it.` : ''}

She hasn't left the squad. She'll walk back to the crossing with you in the morning, and sleep with her lamp lit, and say *yes, Sergeant*. That's the worst of it. She'll be exactly where she always is, and there'll be somebody behind the glass.`,
      ch:[{t:'Back to the lawn.', go:()=>startExplore()}]}),

    /* ---- the Tyrant ---- */
    c6_tyrant:()=>({sp:'The old priest', scene:'garden_storm', fx:()=>{ if (!S.f.c6_tuft) S.f.c6_tuft='kept'; S.f.c6_tyrantUp=1; }, txt:
`You're looking at the sky when it starts, which is why you miss the rest.

Over the lake, the Moon's Spawn lets something fall. A shape drops off its black underside, opens, and catches itself on the air; then another, and another. Five. Winged, long-necked, bigger than any bird has a right to be, and the first of them is red where the lanterns catch it. They go east over the city, low and fast and without a sound, toward the Gadrobi Hills and the barrow. Nobody in the garden sees them but you.

The old priest in the Jaghut mask has come down the white steps. You didn't see him come. Nobody did. He walks across the lawn slowly, an old man's walk, with his hands folded in his sleeves, and the couples on the gravel step out of his way without looking at him, the way you'd step out of a draught.

He goes to the sapling.

${S.f.c6_tuft === 'kept' && SQUAD().includes('tuft') ? `Tuft is standing beside it, where the grey cloak put her, with her eyes open. He walks past her as if she were a statue. The thing behind her eyes watches him go by.

` : ''}He stands over it for a long moment, looking down at the little black twisted thing in the turned earth, with the light in it like the light at the back of a closed eye. The frost on the grass round his feet has gone out a pace. You didn't see that happen either.

Then he takes off the mask.

And the face underneath it is the mask.

Grey-green. Heavy at the brow. Two tusks curving up out of the lower jaw, yellow and cracked and very old. It isn't a mask. It never was. There's nothing of an old priest of D'rek left in it, only the shape of him, like a coat on a peg; and inside the coat something enormous, and very cold, and awake.

*Thud*, you think, stupidly. *A long time later: thud.*

It looks up. Not at you. At the city.

The lawn freezes.

It goes out from his feet in a ring, white, the grass standing up stiff and glittering; and then another ring, further out, and another, like a stone dropped into a pond; and where each ring passes, the lanterns in the trees go out. One. Another. Another, all down the garden, as if somebody were walking through a house pinching out candles. The fountain stops in the air. The water goes up, and doesn't come down, and hangs there in the dark, white.

On the rim of the fountain, Quick Ben has stopped smiling. It's the second time today you've seen it. This time it doesn't come back.

${S.f.c6_mammotSeen && SQUAD().includes('ohl') ? `Ohl, beside you, in a whisper: "The cold. On the terrace. *That* was the cold."` : ''}

Up on the terrace somebody screams, and the music stops in the middle of a bar.`,
      ch:[{t:'—', go:'c6_choice'}]}),
    c6_choice:()=>({sp:'The garden', scene:'garden_storm', txt:
`Everything happens at once. That's how you'll tell it afterwards, and it's the only true way to tell it.

Whiskeyjack's voice from the fountain, the voice that carries across a battlefield and makes horses stop: "*Bridgeburners!*" And they come, out of the hedges and off the steps and over the walls, in Lady Simtal's blue with the armbands torn off: Fiddler with a crossbow that was never a halberd, Hedge with his satchel open. "On me! *On me!*"

Quick Ben has your arm. You didn't see him cross the lawn. His hand is cold and hard and his face is the face from the ladder, with nothing on it. "It's going into the *ground*," he says. "Sergeant. Listen. What he's doing, it's going down. Into the stone. Into the pipes. Forty of ours and twelve Moranth cussers are sitting in the gas mains under the Gadrobi crossing, and if that cold finds them there's no city. There's no *lake*." His grip tightens. "Somebody sit on those crates."

And at the little iron gate in the west wall, the gate the Adjunct used an hour ago, a woman in a dark cloak with no mask is standing with her hand on the latch, looking back. Not at the Tyrant. At the lawn, at the frost, at the sapling, as if checking them against a list. She knew. She's the only person in the garden who isn't surprised.

She opens the gate and goes out through it.

${S.f.c6_kalamAsked ? `*If she walks out before the party's over*, Kalam said, *you'll know something's gone wrong.*` : ''}

${SQUAD().includes('brisk') ? `Brisk is at your shoulder with her shield up. "Sergeant." Waiting for the word.` : ''}

${SQUAD().includes('kettle') ? `Kettle has gone white under the soot. She heard Quick Ben. She's looking down the hill, toward the crossing, toward the vault she carried the cussers down into in her own arms, and her lips are moving. She's counting.` : ''}

Three places to stand, and one of you to choose.`,
      ch:[{t:'With the Bridgeburners. Line on the sergeant.', fx:()=>{ S.f.c6_key='bridgeburners'; }, go:'c6_bb'},
          {t:'The mains. Somebody sits on those crates, and it\'s us.', fx:()=>{ S.f.c6_key='cellars'; }, go:'c6_cellars'},
          {t:'The garden gate. After her.', fx:()=>{ S.f.c6_key='alley'; }, go:'c6_alley'}]}),

    /* ==== the choice: with the Bridgeburners ==== */
    c6_bb:()=>({sp:'The garden', scene:'garden_storm', txt:
`"On me!" you shout, and the Fourth comes, and you take it to Whiskeyjack's shoulder, and put it there. Line on the sergeant. ${SQUAD().includes('brisk') ? `Brisk's shield goes up beside Fiddler's crossbow, and she looks at him once, sideways, and he looks at her, and something is agreed.` : ''}

Whiskeyjack sees you come. He doesn't say *good*. He says "Sergeant," the way he'd say it on a parade ground, and moves six inches to his left to give you room, and that's all, and it's everything.

The Tyrant turns his head.

And the frozen lawn begins to heave. Up out of it, where the white rings have gone, things are coming: slowly, the way the dead came up out of the small barrows in the hills, with the frost running off them. Shapes of ice with old bone inside the ice, blue-white, glittering. Whatever lay under this garden before it was a garden, before Simtal, before Coll, before the city, it's getting up.

${S.f.c6_tuft === 'kept' && SQUAD().includes('tuft') ? `Tuft is by the sapling where he put her, eyes open, three paces from the thing with the tusked face. Behind you, pleasantly, the grey cloak: "Go with your squad, Tuft. He'll want to see this." She comes, and takes her place in the line, and her eyes stay open.` : ''}

Fiddler, loading, not looking at you: "*I told you.* Back of the neck. I *told* you."`,
      ch:[{t:'"Hold!"', go:()=>startBattle('tyrant_garden',{})},
          {t:'Kettle skims a sharper across the frozen lawn at them.', tag:'uses 1 sharper', req:()=>SQUAD().includes('kettle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('tyrant_garden',{pre:true})}]}),
    c6_after_tyrant:()=>({sp:'The garden', scene:'garden_storm', txt:
`You hold. Afterwards you'll try to put it in order, the way Whiskeyjack likes, and it won't go. It comes in pieces.

Frost on your blade and in your teeth. The rime-dead coming on without hurry and coming apart ${SQUAD().includes('brisk') ? `against Brisk's shield` : `against your shield`} like icicles knocked off an eave. The Tyrant saying a word, one word, and the air round somebody in the line turning to knives. Fiddler's crossbow, never stopping. Hedge laughing, the whole time, like a man at a wedding.

And Quick Ben.

He's standing in the middle of the lawn with his arms out, and there's light coming off him. Not one light. Seven. You count them later, lying awake; at the time you only see colours: a green, and a gold, and a colour like bruised plums, and a colour like the inside of a shell, and others, going up round him like doors opening in a house all at once, seven doors, and Quick Ben in the middle of them with his face perfectly empty, holding them all open.

${SQUAD().includes('tuft') ? `Tuft makes a sound beside you like somebody seeing the sea. "*Seven*," she says. "He's got *seven*. Nobody has seven."` : ''}

The Tyrant turns toward him. It lifts a hand and throws: not a word this time but a spear, a lance of white, ice and cold and the end of every winter there has ever been, straight at the man with seven doors—

And Paran steps into it.

You don't see him cross the lawn. He's just there, between, with the ordinary sword out, and the lance of white goes into the blade.

Into it. Not off it. The sword *drinks* it, the way dry sand drinks water, and the white is gone, and Paran is standing on the frozen lawn with the sword in his hand and his eyes open and nobody behind them.

He's gone somewhere. You can see it. His body is here, standing, and he is not. For one long breath, and two, and three, he stands there empty as a coat on a peg, while the Tyrant stares at him with its tusked face; and then he comes back into himself all at once, and staggers, and looks down at the sword in his hand as if it had said something to him.`,
      ch:[{t:'"Down!"', go:'c6_bb_hedge'}]}),
    c6_bb_hedge:()=>({sp:'Hedge', scene:'garden_storm', fx:()=>{ S.f.c6_azath=1; if (SQUAD().includes('kettle') && S.inv.cusser > 0 && !S.f.c6_hedgeCusser) { S.f.c6_hedgeCusser=1; S.inv.cusser -= 1; loy('kettle',1); } }, txt:
`It isn't you who shouts it. It's Hedge.

${SQUAD().includes('kettle') && S.inv.cusser > 0 && !S.f.c6_hedgeCusser ? `He's beside Kettle, with his hand out, open. "Mine," he says. "Falari. Give it back."

And she does. She takes Hedge's cusser out of the satchel, the one he put into her arms in the vault like a baby not ten days ago, the one she's carried to the hills and back and never thrown, and she puts it in his hand. He grins at her, all his missing teeth.

"*This* one," he says. "You'll know, Chub said." And he turns and runs at the Tyrant with it.` : `He has a cusser in his hand, clay-grey, the size of a man's head, and he's running at the Tyrant with it, laughing, the way a man runs into the sea.`}

He doesn't throw it. He's too close to throw it. He gets inside the reach of the tusked thing, under the arm, and slaps the cusser against its chest the way you'd slap a friend on the back, and dives.

The sound isn't a sound. It's a shove: a hand the size of a hill in the middle of your back, and the frost on the lawn goes up in a white wall, and comes down again for a long time afterwards, pattering, like rain after the rain.

When you can see again, the thing in the old priest's body is on its knees in a crater of black earth and white frost, and the body is broken. An old man's body, opened, that should be dead and isn't, because the thing inside it hasn't noticed yet.

Then the sapling moves.

It's grown. You didn't see it grow. It was knee-high when the Adjunct walked away from it, and now it's the height of a man, and black, and twisted, and there's wood coming up out of the lawn round it in ridges, heaving up the frost the way roots heave a road. Roots. They come up out of the earth like fingers out of water, and they're reaching.

They reach the Tyrant.

He knows them. Something in the tusked face knows exactly what they are, and has known for longer than there's been a word for *long*, and it's afraid. It gets one foot under it. It speaks a word that turns the air to knives, and the roots don't care. They take it by the ankles and the wrists and the throat, gently, the way you'd take hold of a child who's about to run into a road, and they pull it down.

Down into the earth. Into the black. Into the thing that's growing there, that isn't a tree now: that's walls, and a roof, and a door. A small wrong house of living wood coming up out of Lady Simtal's lawn as you watch, with the Tyrant going into it, and the door closing.

The frost stops going out.

The lanterns don't come back on. But the fountain comes down, all at once, the hung water falling back into the basin with a sound like applause.

Where the old priest was, on the frozen lawn, there's only a mask: grey-green, tusked, pasteboard and paint. It isn't anybody's face now.`,
      ch:[{t:'Whiskeyjack.', go:'c6_bb_leg'}]}),
    c6_bb_leg:()=>({sp:'Whiskeyjack', scene:'garden_storm', fx:()=>{ S.f.c6_wjLeg=1; if (SQUAD().includes('brisk')) loy('brisk',1); }, txt:
`He's down.

You saw it happen and you didn't, the way you see everything in a fight. Somewhere in the middle of it, when the seven doors were open and Paran was gone and Hedge was running, Whiskeyjack went in at the Tyrant's flank with his halberd like a man going in at a boar, and it swept him aside without looking, the way you'd brush a wasp off a table, and he came down on the frozen lawn with one leg under him.

You heard it. Everybody who has ever been on a battlefield knows that sound. It's the sound of a green branch.

He's sitting up now, on the frost, with his back against the fountain and his leg out in front of him at an angle legs don't go, and his face is grey, and he's giving orders.

"Fiddler. The walls. Hedge, the steps. Quick—" He looks at Quick Ben, who is sitting on the lawn with his head between his knees, breathing like a man who has run up a mountain. "Quick, stay there." Then he sees you. "Sergeant."

Mallet is coming down the terrace steps at a run, with his bag.

${SQUAD().includes('brisk') ? `Brisk has put down her shield. She kneels on the frost by Whiskeyjack and looks at the leg, and at him, and doesn't ask. She gets her shoulder under his arm. "We don't leave people," she says, to nobody at all, and lifts. He isn't a small man. She lifts him anyway, and holds him, while Mallet cuts the boot away, and he doesn't make a sound, and she doesn't either.` : `You get your shoulder under his arm and hold him while Mallet cuts the boot away, and he doesn't make a sound.`}

Mallet looks at the leg for a long time. He doesn't say what he sees. He looks at Whiskeyjack, and Whiskeyjack looks back, and something is said between them without any words at all, and Mallet starts to splint it.

"Good," Whiskeyjack says to you, through his teeth. You don't know what he means by it. You're not sure he does.`,
      ch:[{t:'Then the sky.', go:'c6_bb_sky'}]}),
    c6_bb_sky:()=>({sp:'The sky over Darujhistan', scene:'dragon_sky', txt:
`The garden is quiet for the space of ten breaths. Then ${SQUAD().includes('kettle') ? `Kettle says "Sergeant," in a voice you've never heard her use,` : `somebody on the terrace says "*Look*," in a voice you've never heard anybody use,`} and points up.

Over the roofs down the hill, over the Daru District, where the Adjunct went, something is going up into the sky. Pale. Enormous. Wrong. It unfolds as it rises the way a sheet unfolds when you shake it out of a window: too many joints, too many edges, wings that aren't the shape of wings, a long pale neck and a head at the end of it that is almost a dragon's and isn't. It's the size of a ship. It's bigger than a ship.

And at the terrace balustrade above you, where the tall guest stood with his untouched wine: the glass, on the rail. Nobody beside it.

Above the house, blotting out the Moon's Spawn, something black unfolds.

You'll never be able to describe it. You'll try, for years. Black, and huge, and the shape a child draws when you say *dragon*, only the child was right; and it goes up over Lady Simtal's roof and out over the city toward the pale thing with two strokes of its wings, and every lamp in Darujhistan gutters in the wind of it.

They meet over the city.

The whole of Darujhistan is in the street with its face turned up. You can hear it: not screaming. Silence. A hundred thousand people not making a sound.

The black one drives the pale one down. Onto the roofs. You see it go, over the Daru District, and the black one goes down after it, and for a moment there's nothing, and then there's *darkness*: a darkness coming off something on a roof, off a sword, you'd swear, a sword you can't see, only what comes off it. Smoke. Black smoke, trailing, in long heavy loops like chain.

The sound comes a heartbeat later, faint, over the whole city at once. Chains. The sound of chains being dragged over stone a long way down, by a great many hands.

Then nothing. The pale thing is gone. Not dead. *Gone*, the way a thing goes that's been taken somewhere.

${SQUAD().includes('tuft') ? (S.card === 'chains' ? `Tuft has her hand over her sleeve, over the Deck. "Bound," she whispers. "At both ends. It came up at the gate. I didn't know what it *meant*."` : `"That sword," Tuft says. She's shaking. "Everything it kills goes *with* it. I felt that one go. It's still going."`) : ''}

${SQUAD().includes('ohl') ? `Ohl has the oilcloth half out. He doesn't write. "No," he says. "Whatever that was, it isn't mine. Hood didn't get it. Something else did."` : ''}

On the frost by the fountain, splinted, grey, Whiskeyjack says: "Nobody saw that." Then, after a while, to the sky: "*Hood's* breath."`,
      ch:[{t:'Dawn.', go:'c6_dawn'}]}),

    /* ==== the choice: the cellars ==== */
    c6_cellars:()=>({sp:'The garden', scene:'garden_storm', txt:
`"Kettle," you say, and she's already moving.

Up the white steps with the frost coming after you, through the hall, through two hundred masks that have stopped dancing and are standing very still looking at the garden doors, out past the steward with his two lists, and into the street. Behind you Quick Ben shouts something, and you catch one word of it: *crossing*.

${S.f.c6_tuft === 'kept' && SQUAD().includes('tuft') ? `Tuft comes with you. The grey cloak saw to that: "Go with them, Tuft. He'll want to see that too." Her eyes stay open all the way down the hill.` : ''}

${SQUAD().includes('kettle') ? `Kettle, running beside you, already talking, fast and low, the way a sapper counts drops: "Forty of Hedge's. Twelve cussers. At the joints. The big joints, where the pressure's worst. If that cold gets down into the stone the clay'll go brittle, and brittle clay cracks, and if one cracks next to a—" She stops herself. "Sergeant. I carried them down there. I *stacked* them."` : ''}`,
      ch:[{t:'Run.', go:'c6_cellars_run'}]}),
    c6_cellars_run:()=>({sp:'The streets', scene:'fete_street', txt:
`Down the hill through the Estate District at a run, with the halberds thrown in a gutter somewhere behind you, and the Fete doesn't know yet.

That's the terrible thing. Up on the hill, in one garden, the lawn is freezing in rings; and down here the street is full of masks and paper lanterns and music, a woman in a swan mask kissing a man in a bull mask in a doorway, children with sparklers, a drunk singing about Gedderone. They don't know. They step out of your way laughing, because you're guards and you're running and it must be a joke.

Then the frost comes down the hill after you.

It comes through the cobbles. You see it go past you: a whiteness in the cracks between the stones, running, faster than you can, down toward the lake along the lines of the pipes under the street. And where it passes, the blue gas lamps flicker. Not out. *Down*: every flame shrinking in its glass, blue to a bead, and back, as if something under the city had caught its breath.

The Fete stops laughing.

Through the Daru District. Down into the Gadrobi. The crossing, empty, the brazier out, the sign on the stakes that says *Works*, and the hole in the middle of it all.

The lantern at the bottom of the ladder is lit. It shouldn't be. Everybody who has any business down that hole is up on the hill in a garden.`,
      ch:[{t:'Down the ladder.', go:'c6_cellars_vault'}]}),
    c6_cellars_vault:()=>({sp:'The vault under the crossing', scene:'cellar', txt:
`The vault. Pipes on every side, sweating, hissing, and the hiss is wrong: too high, too thin, like breath through teeth. The frost has come down here too. There's white on the iron in fine furred lines along every joint, and the air is so cold your breath smokes.

And there are people in it.

Four of them. Grey cloaks, the cut you know, but not clean: mud to the knee and brick-dust to the elbow. One has a lantern. Three are working the niches along the base of the pipes where Hedge seated the munitions, cusser by cusser, with small knives and smaller phials: a notch cut into the wax that seals each one, a bead of something that smokes faintly in the cold set into the notch, and on to the next. Not hurrying. Moranth wax is thick. A bead in a notch is a slow clock, and they have set it slow enough to be up the ladder and three streets away when it runs out. Back by the ladder the one with the lantern holds a stoppered phial in his other hand, upright and well away from his body, the way you'd carry a cup filled to the brim.

They look up.

The one with the phial doesn't move. He's older than the others. He looks at you with no surprise at all, the way a clerk looks at a man who has come to the wrong window.

"Standing orders, Sergeant," he says. Pleasant. Tired. "Older than tonight. If the Bridgeburners wouldn't bring the city down, somebody would." He glances at the frost on the pipes. "Tonight seemed a good night. Everybody's looking at the garden." A pause. "Stand aside. You were never here."

${SQUAD().includes('kettle') ? `Kettle makes a sound. It isn't a word. She's looking at the notches in the wax, and the beads sitting in them, on Hedge's cussers, on *her* cussers, the ones she carried down the ladder in her own arms. "That's *Hedge's* acid," she says. "You're using *Hedge's acid*."` : ''}

${SQUAD().includes('ellis') ? `Ellis, at the foot of the ladder, very quietly: "I know that cut. They teach it at the green door."` : ''}

${S.f.c6_tuft === 'kept' && SQUAD().includes('tuft') ? `The man with the phial looks past you, at Tuft, at her wide still eyes, and for one breath he hesitates. Then he nods to her. Very slightly. The way you'd nod to an officer across a room.` : ''}

Nobody throws anything in here. Nobody has to be told.`,
      ch:[{t:'"Get that phial."', go:()=>startBattle('the_mines',{})}]}),
    c6_after_mines:()=>({sp:'The vault under the crossing', scene:'cellar', txt:
`It's close and quiet and ugly, the way it has to be in a room full of things that must not be touched. No sharpers. No burners. Nobody so much as draws a spark off a blade on the brick. Knives and shields and bodies in the dark between the pipes.

The man with the phial goes down last. He knows he's going down, and he spends it: he rolls onto his side at the foot of the nearest niche, and gets the stopper out with his thumb, and empties the whole phial over the wax of the cusser beside him. Two drops take ten heartbeats to eat through a Moranth plug. That was a great deal more than two drops—

${SQUAD().includes('kettle') ? `Kettle gets there. She's across the vault before anybody else has moved, down on her knees, and she wipes the acid off the wax with the flat of her bare hand and then presses the hand down over the plug and holds it there, and you smell her skin burn, and she doesn't lift it until the smoking stops.

Then she gets up, and shakes the hand once, and goes to the next niche.` : `You get there. You're on your knees in the wet with your palm over the plug before you've thought about it, wiping, pressing, and it burns, and you hold it till the smoking stops.

There are eleven more cussers with a bead of acid sitting in a notch in the wax, eating, and forty of Hedge's packed in around them, and nobody here knows how to stop a timer without waking what it's set in. You're going to have to learn.`}`,
      ch:[{t:SQUAD().includes('kettle') ? 'Kettle.' : 'The timers.', go:'c6_mines_kettle'}]}),
    c6_mines_kettle:()=>({sp: SQUAD().includes('kettle') ? 'Kettle' : 'The timers', scene:'cellar', fx:()=>{ if (SQUAD().includes('kettle')) loy('kettle',2); }, txt: SQUAD().includes('kettle') ?
`She stops the timers.

One at a time. She starts at the far end, at the last cusser, and works back toward the ladder, and at every niche she kneels, and puts her burned hand flat on the clay for a moment, as if taking its temperature, and then with the other hand, very gently, lifts the bead out of the notch on the point of her knife. Scrapes the notch clean. Packs it with tallow from the tin at her belt, and smooths it with her thumb. Moves on.

Nobody helps her. Nobody would dare. ${SQUAD().includes('brisk') ? `Brisk stands at the foot of the ladder with her shield turned to the vault, as if the dark might try something.` : ''} ${SQUAD().includes('ohl') ? `Ohl tries, once, to look at the hand, and she says "*Later*," without looking up, in a voice he has never heard out of her, and he steps back.` : ''}

The frost on the pipes is thickening. You can hear the clay tick in the cold: small dry sounds, like things thinking about cracking. She doesn't hurry. She has never hurried wax in her life.

She counts under her breath as she goes, the way she counted in the hills, the way priests count.

"You keep pointing me at things," she says, halfway down the line, to nobody, "and I'll keep making them stop being things. That's love, in the sapper trade." A notch. A thumb of tallow. "Nobody ever says the other half. Sometimes you point me at a thing and I make it *not* go. I make it stay a cusser. Sitting in a hole. Doing nothing. For ever." Another notch. "That's the hard half. Chub never told me that half. I don't think Chub *knew* that half."

When she gets to the last one, by the ladder, she sits down on the wet brick beside it with the tallow tin in her lap, and puts her burned hand on the clay, and leaves it there.

"Twelve," she says. "Sir. I *told* them." You don't know which *sir* she means. You don't think she does.

Then she cries, for the first time since you've known her, without making any sound at all.` :
`You stop the timers. There's nobody else to do it.

You've watched Kettle work wax a hundred times without understanding what you were watching, and you understand now: one at a time, from the far end, a hand flat on the clay first, as if taking its temperature, and then the bead lifted out of the notch on a knife point, very gently. Scrape the notch. Pack it with tallow from the sapper's tin. Smooth it. Move on.

The frost on the pipes is thickening. You can hear the clay tick in the cold. You don't hurry. You're more frightened than you have ever been in your life, and your hands are perfectly steady, and you think that is probably what sappers are.

Forty. Twelve. You count them the way she would have, like prayers. When you get to the last one, by the ladder, you sit down beside it with the tallow tin in your lap and your burned hand on the clay, and you leave it there for a while.`,
      ch:[{t:'The man with the phial.', go:'c6_mines_order'}]}),
    c6_mines_order:()=>({sp:'A standing order', scene:'cellar', fx:()=>{ S.f.c6_orders=1; }, txt:
`He's lying where he fell, at the foot of the niche: grey cloak, mud to the knee, the empty phial beside his hand. Inside his coat, folded small, a slip of paper.

Good paper. A few lines. A neat hand, very neat: small and square and without a flourish anywhere, the hand of somebody who has written a great many orders and never once had to write one twice.

*In the event that the Bridgeburners do not complete the mining of the city by the Fete of Gedderone, or decline to fire it, the charges under the Gadrobi crossing are to be fired by our own people on the night of the Fete, at the moment of greatest confusion. Standing order. Destroy this.*

No signature. It doesn't need one.

${S.f.marked ? `You've never seen the hand. You know it anyway: it's the hand your name went into at the Pale, in a ledger you were never shown.` : `You've never seen the hand before. You'd know it again anywhere.`}

${SQUAD().includes('ellis') ? `Ellis reads it over your shoulder, which she has never done. "That's the house hand," she says. "Every order out of the green door is written like that. They train you to it, the ones who'll be writing." She says it to the paper, not to you.` : ''}

You fold it, and put it inside your coat, against your ribs. Somebody gave that order. Somebody wanted a city gone, with forty thousand people in one district and Whiskeyjack's company in the hole under it, and wrote it down so neatly. Somebody is going to want this paper back.

${SQUAD().includes('brisk') ? `Brisk watches you put it away. "That's leverage," she says. "Or it's a knife with no handle." A pause. "Don't cut yourself."` : ''}`,
      ch:[{t:'Up the ladder.', go:'c6_mines_sky'}]}),
    c6_mines_sky:()=>({sp:'The Gadrobi crossing', scene:'dragon_sky', fx:()=>{ S.f.c6_azath=1; }, txt:
`You're halfway up the ladder when the sky changes.

You feel it before you see it. The air in the ladder-shaft goes heavy and strange, and every hair on your body stands up at once, the way it did on the hillside when the Hounds came, and something pulls at you from above, not at your body, at the part of you that knows where the edges of things are.

Then you're out in the crossing, and the whole of the Gadrobi District is in the street with its face turned up.

Over the Daru roofs there are two shapes in the sky the size of ships. One is pale and wrong, all joints and edges, almost a dragon and not. The other is black, the shape a child draws when you say *dragon*, only the child was right. They're fighting over the city, and every lamp in the Gadrobi District gutters in the wind of their wings.

The black one drives the pale one down, onto the roofs. It goes down after it. For a moment there's nothing. Then there's a darkness on a roof over the Daru District, coming off something you can't see, a sword, you'd swear: black smoke, trailing, in long heavy loops like chain.

The sound comes a heartbeat later, faint, over the whole city at once. Chains, dragged over stone, a long way down, by a great many hands.

Then the pale thing is gone. Not dead. *Gone*.

And the frost on the cobbles, which has been creeping down the street toward the hole all this time, stops. Just stops, a hand's breadth from the stakes, as if something up on the hill had closed a door on it.

${SQUAD().includes('kettle') ? `Kettle is sitting at the top of the ladder with the tallow tin still in her lap and her burned hand held against her chest. "Did we— Sergeant, did we do *that*?"

"No."

"No," she agrees. "We did the other thing." She looks down the hole at the dark where the cussers are, doing nothing. "I like the other thing."` : ''}

${SQUAD().includes('tuft') && S.card === 'chains' ? `Tuft has her hand over her sleeve, over the Deck. "Bound," she whispers. "At both ends. I didn't know what it *meant*."` : ''}`,
      ch:[{t:'Back up the hill. Dawn.', go:'c6_dawn'}]}),

    /* ==== the choice: the alley ==== */
    c6_alley:()=>({sp:'The garden gate', scene:'garden_storm', txt:
`"With me," you say, and go for the gate.

Behind you Whiskeyjack is shouting and the lawn is heaving and Quick Ben is saying something you'll wonder about for years, and you don't turn round. ${S.f.c6_kalamAsked ? `Kalam said *watch which door*. He said if she walked out before the party was over, something had gone wrong. She's walked out.` : `Nobody told you to. Nobody is going to tell anybody anything tonight; there isn't time. A woman with a hole in the world on her hip just walked out of a garden where a tyrant is standing up, and she wasn't surprised, and you want to know where she's going.`}

${S.f.c6_tuft === 'kept' && SQUAD().includes('tuft') ? `Behind you, pleasantly, the grey cloak: "Go with them, Tuft. He'd so like to see where *she* goes." And Tuft comes, running, with her eyes open.` : ''}

The little iron gate. The lane behind the garden wall: dark, wet, empty. And at the far end of it, turning a corner without hurrying, a dark cloak.`,
      ch:[{t:'After her.', go:'c6_alley_streets'}]}),
    c6_alley_streets:()=>({sp:'The streets', scene:'fete_street', txt:
`She doesn't run. She walks, fast, and the Fete gets out of her way without knowing it's doing it: masks turning aside, dancers stepping back, a man with a tray of cakes swinging round her like a door on a hinge. Nobody looks at her. Nobody at a Fete looks at the one person not wearing a face.

You keep her in sight for three streets. The frost comes down the hill behind you through the cobbles, and the blue lamps flicker as it passes under them, and the Fete begins, street by street, to stop laughing.

Then a square full of dancers and paper lanterns, and you lose her.

${SQUAD().includes('tuft') ? `Tuft finds her. Not with Meanas; with the lack of it. "There," she says, grey in the face, pointing across the square at an alley mouth on the far side. "There. It's like a hole moving. I can feel where I *can't* feel."` : `Brisk finds her. "There," she says, and points across the square with her shield, at an alley mouth on the far side, where the lanterns have gone out.`}

And from that alley mouth, from where she went, something goes up.

Pale. Enormous. Unfolding into the sky over the Daru roofs like a sheet shaken out of a window: too many joints, too many edges, a long neck, a head that's almost a dragon's and isn't. Every mask in the square turns up to it at once. You don't. You don't stop to look. You'll look later, and wish you hadn't.

Into the alley.`,
      ch:[{t:'—', go:'c6_alley_line'}]}),
    c6_alley_line:()=>({sp:'The Adjunct', scene:'alley_night', txt:
`An alley off the Daru District, so narrow you could touch both walls at once, wet, with one blue lamp on a bracket at the far end and a doorway halfway down.

She's got the boy against the wall.

Crokus. The rope's gone from his shoulder and the mask's gone from his forehead, and he's pressed back against the brick with her left hand flat on his chest; not holding him, just there, the way you'd put a hand on a door you were about to open. Her sword is in her right hand. It's a plain sword with a plain hilt, and you can feel it from the alley mouth, the way you felt it from three hundred paces in the hills: not with your skin.

The coin's in his fist. You can see it between his fingers, catching the lamp.

She turns her head. She looks at you: at the Fourth, in Lady Simtal's blue, standing in her alley. It's the look from the vale. The smudge on the map. Something to be accounted for.

"Hold him," says the Adjunct.

Two words. The only words she has ever said to you, and they're an order, in the voice of someone who has never once in her life had an order not obeyed.

${SQUAD().includes('tuft') ? `Tuft has stopped at the mouth of the alley as if she'd walked into a wall. "Nothing," she whispers. "Sergeant, there's *nothing*. It's all gone." The shadow on her hands is gone.` : ''}

${SQUAD().includes('ohl') ? `Ohl has put his hand out, flat, reaching for Denul the way you'd reach for a stair-rail in the dark. His face changes. "It's gone," he says. "It isn't faint. It's *gone*."` : ''}

*Otataral. Every warren in this alley is dead. If anyone falls here, Ohl can't bring them back.*

It's the roof again. You knew it would be, the moment you saw the boy. A boy with his back to something, and something coming that doesn't lose, and a gap the width of a doorway. On the roof it was a Tiste Andii. Here it's the Empress's own hand.

${SQUAD().includes('brisk') ? `Brisk is looking at you. She's always looking at you, at the moment it matters.` : ''}`,
      ch:[{t:'Step in between them. (Otataral: whoever falls here stays down.)', fx:()=>{ S.f.c6_steppedIn=1; }, go:'c6_alley_step'},
          {t:'Stand aside.', go:'c6_alley_aside'}]}),
    c6_alley_step:()=>({sp:'The alley', scene:'alley_night', fx:()=>{ if (SQUAD().includes('brisk')) loy('brisk',1); if (SQUAD().includes('kettle')) loy('kettle',1); if (SQUAD().includes('ellis')) loy('ellis',1); }, txt:
`You step in.

${S.f.c4_key === 'aside' ? `On the roof you stepped aside, and a boy called Vell looked at you over his shoulder, and you've carried the look all week. You're not carrying another.` : `On the roof you stood. You find, in an alley, with the Empress's own hand on the other side of the gap, that you're going to stand again, and that you'd known it since the gate.`}

${SQUAD().includes('brisk') ? `Brisk is on your left before your foot is down. Her shield comes up beside yours, the rims overlapping a hand's width, the way they did at Nathilog, the way they did on the roof.` : `The squad closes up round you before your foot is down, without being told.`}

The Adjunct looks at you over the shields. Her face does nothing. It does nothing for a long moment, very completely. Then she takes her hand off the boy's chest.

Behind you, Crokus doesn't run. He should. He's standing against the wall with the coin in his fist, staring at your backs.

"Go," you tell him, without turning round. He doesn't.

The Adjunct lifts her sword.

Nobody who falls in this alley is getting up again. Everybody in the Fourth knows it. Nobody moves.`,
      ch:[{t:'"Hold."', fx:()=>{ S.f.c6_alleySh = S.inv.sharper; }, go:()=>startBattle('lorn_alley',{})},
          {t:'Kettle rolls a sharper at her feet. Munitions don\'t care about otataral.', tag:'uses 1 sharper', req:()=>SQUAD().includes('kettle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; S.f.c6_alleyPre=1; S.f.c6_alleySh = S.inv.sharper; }, go:()=>startBattle('lorn_alley',{pre:true})}]}),
    c6_after_alley:()=>{ const fell = (S.f.lastFallen || []).filter(id => id !== 'sgt'); const names = fell.map(id => NAME(id)); const w = ['None','One','Two','Three','Four','Five','Six'][SQUAD().length] || String(SQUAD().length);
      return {sp:'The alley', scene:'alley_night', txt:
`Three rounds. You'll never be able to say how.

It comes in pieces, and the pieces have edges. No Meanas. No Denul. No shadow round anybody's hands. Iron, and brick, and bodies, and the Adjunct in the middle of it cutting twice for every blow that reaches her, and the blows that reach her don't seem to matter. She fights like the thing she is: the Empress's own hand, closing.

And in the third round, a man steps out of the doorway.

A man in a faded crimson cloak, with a plain sword. You'd swear the doorway was empty. You'd swear it on anything. He doesn't say a word. He simply comes out of the dark at the Adjunct's flank, between one of her cuts and the next, and his sword goes in under her guard, once, and out.

She breaks off.

She steps back, with one hand pressed flat to her side, and looks at the man in crimson for a long moment, and then at the Fourth; and then she goes, up the alley past the blue lamp, fast, not running, and around the corner.

The man in crimson looks at you. He doesn't speak. He goes back into the doorway, and the doorway is empty.

The boy is gone. You didn't see him go either.

${S.f.sgtScar ? `You were down. You remember the cobbles against your cheek, cold, and the wet, and her boots going past your face. You remember thinking, quite clearly, *well, then*. And then you were getting up, and nobody can tell you how, least of all you, and there's a new ache in you that you suspect is going to be there for the rest of your life.

` : ''}${fell.length ? `You count.

${w}.

You count again, and it's still ${w.toLowerCase()}, and you understand that it's going to be ${w.toLowerCase()} now for as long as there's a Fourth to count. ${names.length === 1 ? `${names[0]} is lying on the cobbles.` : `${names.slice(0,-1).join(', ')} and ${names[names.length-1]} are lying on the cobbles.`} Nobody who falls in this alley gets up. You knew that. You stepped in anyway. So did they.` : `You count. ${w}. You count twice, and a third time, because the number's right and it can't be.

Everybody's standing. Some of them only just. Nobody in the Fourth will ever be able to tell you how.`}`,
      ch:[{t:'The fallen.', req:()=>(S.f.lastFallen || []).filter(id => id !== 'sgt').length > 0, go:'c6_alley_fallen'},
          {t:'After her.', req:()=>!((S.f.lastFallen || []).filter(id => id !== 'sgt').length > 0), go:'c6_alley_sky'}]}; },
    c6_alley_fallen:()=>{ const fell = C6H.fell(), n = listCount(), first = n - fell.length + 1;
      const threw = S.f.c6_alleyPre || (typeof S.f.c6_alleySh === 'number' && S.inv.sharper < S.f.c6_alleySh);
      const other = fell.filter(id => id !== 'ohl');
      const how = {
        brisk:`Brisk is lying where she stood, in front of the place where the boy was, on her back, with her shield still on her arm. ${S.f.c4_key === 'shield' ? `The rim has the old bend in it from the roof, the one she left in so she'd know which dent was for something, and a new one beside it.` : `There's a new bend in the rim, fresh and bright.`} The second cut came in under the rim. She saw it coming; you know she did, because she didn't move out of its way. She's looking up at the strip of sky between the walls with no expression at all, the way she looked at everything, and Tav's letter is still inside her gorget, sealed.`,
        kettle:`Kettle is sitting against the alley wall with the satchel in her lap and both arms round it, the way she sat in the vault with it the day Whiskeyjack said yes. ${threw ? `She got a sharper off; you saw it go. Then the Adjunct came through the smoke. There's soot on her face to the eyebrows, and her eyes are open, and she looks surprised, and a little pleased, as if something had finally gone off exactly the way she meant it to.` : `She never got a hand into it; the Adjunct was on her first. There's soot on her face to the eyebrows, and her eyes are open, and she looks surprised, as if somebody had interrupted her in the middle of a count.`}`,
        tuft:`Tuft is lying in the wet at the foot of the wall with the Andii cloak spread round her like a pool of something darker than water. No Meanas. No shadow. A knife she'd never used in her life still in her hand, because in the alley there was nothing else to be. She died nothing, in the one place she was most afraid of, and she walked into it anyway. ${S.f.c6_tuft === 'kept' ? `Her eyes are open. There's nobody behind them now. Whoever was looking has stopped.` : `The card is inside her tunic, against her chest. You'll find it later. It's still blank.`}`,
        ohl:`Ohl is on his knees in the middle of the alley, ${other.length ? `bent over ${NAME(other[0])}, with his hands flat on her chest,` : S.f.sgtScar ? `where he knelt over you when you went down, with his hands still out,` : `with his hands flat on the wet cobbles,`} reaching for a warren that wasn't there. That's how he was when the sword found him. It's how he would have wanted to be found, and it's how he is. His cudgel is on the cobbles by his knee. The oilcloth is inside his robe, with its names, and ${S.f.c5_ellisThrough ? `the two spaces at the bottom for Toc and Ellis` : `the space at the bottom for Toc`}, and not one name from the Fourth on it, ever. He's been spared the writing. He'd have hated that.`,
        ellis:`Ellis went down the way she did everything: first, and fast, and without looking down. She'd got round the Adjunct's flank, where a scout goes, and she was drawing when the sword came round. Her bow is broken under her. Her gloved hand is out on the cobbles, flat, fingers spread, the way it was on the hillside when the rent closed. She never said the other sentence, the one that would have come after *don't expect thanks*. You'll wait for it the rest of your life.`
      };
      const writer = SQUAD().includes('ohl') ? `Ohl goes to ${fell.length === 1 ? NAME(fell[0]) : 'each of them in turn'}. He kneels. He puts his hands ${fell.length === 1 ? 'on her chest' : 'on each chest'}, flat, the way he's done ten thousand times, and there's no Denul to come up under them, and it wouldn't matter if there were.

Then he sits back on his heels in the wet and takes out the oilcloth, and the charcoal, and he writes. You watch him do it. It takes a long time. His hand doesn't shake. That's the worst part: after twenty-two years, his hand knows exactly how.

"${fell.map((id, i) => `${C6H.num(first + i)}. ${NAME(id)}. The Fourth`).join('. ')}." He says it aloud as he writes it${S.f.c2_key === 'light' ? `, the way he said Tattersail's on the plain` : ''}. "I said I'd die before I put one of ours on here." He folds the oilcloth along its old creases. "I was slow. I've always been slow. It's why I'm still alive to be."` : SQUAD().includes('brisk') ? `Somebody has to write it. Ohl can't.

Brisk takes out the ration ledger. She opens it on her knee in the wet, to the last page, under *Eighteen days hardtack*, and she writes, in her square infantry hand, ${fell.length === 1 ? 'the name' : `the names, Ohl's first`}. She doesn't cross anybody off the count. She draws a line under the count instead, the whole width of the page.

"Somebody has to write it somewhere," she says. "He'd have wanted it written. He'd have hated that it was in the *rations*." She closes the ledger. "He can take it up with me."

Then she takes the oilcloth out of his robe, folded along its old creases, and puts it into your hands without a word. You put it in your pack, beside the pay ledger. Nobody is going to write on it again. Somebody has to carry it.` : `Somebody has to write it. There's nobody left who does that.

You take out the pay ledger, the one you've kept honest for eleven years, and open it to the last page, and write ${fell.length === 1 ? 'the name' : 'the names'}, in your own hand, under the wages they won't draw. It's the only list you've got. It'll have to do.${fell.includes('ohl') ? `

Then you take the oilcloth out of Ohl's robe, folded along its old creases, and put it in your pack beside the ledger. Nobody is going to write on it again. Somebody has to carry it.` : ''}`;
      return {sp:'The fallen', scene:'alley_night', fx:()=>{ S.f.c6_fallenSeen=1; }, txt:
`${fell.map(id => how[id] || `${NAME(id)} is lying on the cobbles, and doesn't get up.`).join('\n\n')}

${writer}

${SQUAD().includes('kettle') ? `Kettle is standing in the middle of the alley with her crossbow hanging from one hand. "I can't make it stop," she says. "Sergeant. I can't make this one stop being a thing."` : ''}

${SQUAD().includes('tuft') ? `Tuft is kneeling by the wall with her hands in her lap, and the shadow isn't coming back to them, and she isn't asking it to.` : ''}

Nobody says the word. Nobody needs to. ${SQUAD().length > 1 ? `You stand in the alley in the wet for a while, all of you who can, and then you do what soldiers do, which is the next thing.` : `You stand in the alley in the wet for a while, on your own, and then you do what a soldier does, which is the next thing.`}`,
      ch:[{t:'After her.', go:'c6_alley_sky'}]}; },
    c6_alley_aside:()=>({sp:'The alley', scene:'alley_night', fx:()=>{ if (SQUAD().includes('brisk')) loy('brisk',-2); if (SQUAD().includes('kettle')) loy('kettle',-1); if (SQUAD().includes('tuft')) loy('tuft',1); if (SQUAD().includes('ohl')) loy('ohl',-1); if (SQUAD().includes('ellis')) loy('ellis',-1); }, txt:
`You step aside.

${S.f.c4_key === 'aside' ? `It's one step. You've taken it before, on a roof, and a boy called Vell looked at you over his shoulder. You know exactly how far it is.` : `On the roof you stood. You find, in an alley, with the Empress's own hand on the other side of the gap, that you're not going to.`}

${SQUAD().includes('brisk') ? `Brisk doesn't move. For a heartbeat she's still there, shield up, in the gap you've left. Then she takes the step too.` : `The squad moves with you, because that's what a squad does.`}

The Adjunct doesn't look at you again. You've done what she'd have expected of a squad of her Empress's marines, and it isn't worth a look.

Crokus looks at you, though. Over her shoulder, with his back against the brick and the coin in his fist.${S.f.c3_innCrokus ? ` It's the look from the Phoenix, when you told him about Pale: *and you lived*.` : ''} He's still looking at you when a man steps out of the doorway.

A man in a faded crimson cloak, with a plain sword. You'd swear the doorway was empty. He doesn't say a word. He comes out of the dark at her flank, and his sword goes in under her guard, once, and out.

She breaks off. She steps back with a hand pressed to her side, and looks at him, and goes: up the alley past the blue lamp, fast, and round the corner.

The boy is gone. You didn't see him go.

The man in crimson looks at you: at the Fourth, standing against the wall where you stepped, like furniture. He doesn't say anything. He doesn't need to. He goes back into the doorway, and it's empty.

${SQUAD().includes('brisk') ? (S.f.c4_key === 'aside' ? `"That's twice we've stood aside," says Brisk. Flat. She doesn't say anything else, and she doesn't look at you.` : `"On the roof we stood," says Brisk. Flat. "I thought that was who we were now." She doesn't look at you.`) : ''}

${SQUAD().includes('kettle') ? `Kettle is staring at the empty doorway. "He just *came out*," she says. "Somebody else just came out and did it."` : ''}

${SQUAD().includes('tuft') ? `Tuft, grey, against the wall: "Thank you," she says, very quietly, and you can hear her hate herself for saying it. "Near her I'm nothing. I'd have been nothing in front of that boy."` : ''}

${SQUAD().includes('ohl') ? `Ohl has his hand flat on the brick. "Nobody's dead," he says. "That's what you'll tell yourself. Nobody's dead." He doesn't say the rest.` : ''}

${SQUAD().includes('ellis') ? `Ellis says one sentence, and it's the right one, and it isn't kind. "The Claw would have written that up as good work."` : ''}

You know it was the safe thing. Everybody in the alley knows it was the safe thing. Nobody says so.`,
      ch:[{t:'After her.', go:'c6_alley_sky'}]}),
    c6_alley_sky:()=>({sp:'The sky over Darujhistan', scene:'dragon_sky', fx:()=>{ S.f.c6_azath=1; }, txt:
`The alley lets out into a lane, and the lane into a little square with a well in it, and everybody in the square is standing still with their faces turned up.

Over the Daru roofs, the pale thing that went up out of the alley mouth is fighting something black.

You'll never be able to describe the black one. You'll try. It's the shape a child draws when you say *dragon*, only the child was right, and it's the size of the Spawn's shadow, and every lamp in the square gutters in the wind of its wings. The two of them go round each other over the city like hawks over a field, and nobody in the square makes a sound. A hundred thousand people in the streets of Darujhistan, and not one of them making a sound.

The black one drives the pale one down. Onto the roofs, three streets off. It goes down after it. For a moment there's nothing. Then there's *darkness* on a roof over the Daru District, coming off something you can't see, off a sword, you'd swear: black smoke, trailing, in long heavy loops like chain.

The sound comes a heartbeat later, faint, over the whole city at once. Chains, dragged over stone a long way down, by a great many hands.

Then the pale thing is gone. Not dead. *Gone*, the way a thing goes that's been taken somewhere.

${SQUAD().includes('tuft') ? (S.card === 'chains' ? `Tuft has her hand over her sleeve, over the Deck. "Bound," she whispers. "At both ends. It came up at the gate. I didn't know what it *meant*."` : `Tuft is looking at the roof where the smoke was. Near the Adjunct she felt nothing; she's feeling something now. "Everything it kills goes *with* it," she says. "Sergeant. I felt that go. It's still going."`) : ''}

On the cobbles at your feet, going away across the square toward the lake, a drop of blood every few paces, black under the blue lamps.`,
      ch:[{t:'Follow the blood.', go:'c6_alley_women'}]}),
    c6_alley_women:()=>({sp:'An alley near the lake', scene:'alley_night', txt:
`Down toward the lake. The drops get closer together. You're in another alley, narrower, darker, with the smell of the water at the end of it, when two women go past its mouth.

A big woman in an apron with a cudgel over her shoulder, and a lean one beside her with a kitchen knife held down along her leg the Daru way. Neither is wearing a mask. ${S.f.c3_inn ? `You know them, a little: the Phoenix. The big one pulled the wine; the lean one threw a drunk into the street by his collar while you were drinking ${S.f.c3_innColl ? 'the round Coll bought' : 'at Kruppe\'s table'}.` : `They have the look of women who work somewhere with a lot of broken glass in it.`} They're walking fast, and quiet, and together, the way people walk who have done a thing like this before, in the direction the blood goes.

They don't look at the Fourth. You're furniture.

${SQUAD().includes('kettle') ? `"Those are the—" says Kettle.

"Yes."

"From the *Phoenix*?"

"Yes."

Kettle thinks about it. "I'm never not tipping there again."` : ''}

You wait. You don't know why you wait. It isn't your alley, and it isn't your business, and you're very tired of being in other people's alleys tonight.

After a while there are footsteps from the other way. A man in a dust-coloured captain's cloak, with a sword at his hip, walking fast, following the blood.

Paran.`,
      ch:[{t:'Follow him.', go:'c6_alley_paran'}]}),
    c6_alley_paran:()=>({sp:'The Adjunct', scene:'alley_night', fx:()=>{ S.f.c6_lornEnd=1; }, txt:
`She's lying at the end of the alley by a rain-barrel, on her back on the wet cobbles, with her sword beside her hand where it fell.

The two women are gone. You never saw them go. You don't need to see what they did; it's there on the cobbles, and on her, and it was quick, and it was done by people who had been told whose she was and had decided they didn't care.

Paran is kneeling beside her.

He has her head off the stones, on his knee. He isn't saying anything. Neither is she. She's looking up at him, and her face, for the first time you have ever seen, is doing something: not much. A small, tired easing, like a woman taking off her boots at the end of a long road.

She says something to him. You're too far off to hear it. You wouldn't listen if you could.

Then she isn't looking at anything.

Paran stays like that for a long time. Then he closes her eyes, and picks up her sword, the plain sword with the plain hilt that you felt from three hundred paces in the hills, and holds it; and you feel the hole in the world go with it into his hand, the way a dropped stone goes into a well.

${SQUAD().includes('tuft') ? `Tuft makes a small sound when the sword moves. She can feel where it is now, the way you'd feel the place where a tooth was.` : ''}

In a doorway across the alley, two figures are standing. A young man and a young woman, back to back, one of them smiling and one of them not, and something about them makes the back of your neck do what Fiddler's does. You look at them.

You look again, and the doorway's empty.

${SQUAD().includes('ohl') ? `Ohl has taken a step toward the woman on the cobbles. He stops, because the otataral is there and Denul isn't, and because she's dead, and because Paran is there. "I'd have tried," he says, very quietly, to nobody. He takes out the oilcloth.` : ''}

Paran gets up. He puts her sword through his belt beside his own. He gathers her up in his arms, the Adjunct of the Empress, the Empress's own hand, and she's smaller than you'd have thought, and he carries her up the alley past you, and he doesn't look at you, and you stand aside to let him by, because that is a thing a soldier does.

"Sergeant," he says, going past. Only that.`,
      ch:[{t:'Dawn.', fx:()=>{ if (SQUAD().includes('ohl') && !S.f.c6_ohlLorn) { S.f.c6_ohlLorn=1; S.f.listAdds = (S.f.listAdds || 0) + 1; } }, go:'c6_dawn'}]}),

    /* ---- dawn: the garden with a house in it ---- */
    c6_dawn:()=>{ const dead = Object.keys(S.dead || {}).filter(id => S.dead[id] && S.dead[id].ch === 6);
      return {sp:'Lady Simtal\'s garden · dawn', scene:'fete_garden', fx:()=>{ S.f.c6_azath=1; }, txt:
`Dawn, and you come back to the garden, because there's nowhere else to come back to.

The frost is gone. The lawn is wet and trampled and black in rings where it froze. The lanterns hang dead in the trees, and the paper from the broken ones lies all over the grass like the petals of some enormous flower that came out in the night and went over. The fountain is running. Somebody has fished a mask out of it and left it on the rim.

Beyond the wall the bells have started, and under the bells, a sound like a hunt: the priestesses of Gedderone running the streets at first light the way they do every year, barefoot, with strips of grey wolf fur in their fists, beating Fander the She-Wolf out of the doorways so that winter will leave the city for another year. Last night winter came into this garden on its own feet. Nobody here laughs at the ritual.

${S.f.c6_key === 'bridgeburners' ? `And the house is still there.` : `And there's a house.`}

At the far end of the lawn, where the flowerbed was, where the Adjunct knelt and a black stick grew, ${S.f.c6_key === 'bridgeburners' ? `there's the house you watched come up out of the lawn in the night, with the Tyrant going into it. In daylight it's worse.` : `there's a house that wasn't there last night.`} It isn't large. Squat and dark, made of wood that is still growing, you'd swear, if you stood and watched it long enough: a peaked roof, a door, one small window with a light in it that isn't any colour a lamp makes. Round it, a yard. And in the yard, mounds. Low grassed mounds, a dozen or more, as if the house had arrived with its graves already dug. One of them is fresh. Bare earth, still dark with the wet.

Nobody in the Fourth says who's under it. Nobody knows. The man in the plain coat is nowhere.

An old man in dark red robes is standing at the edge of the yard with his hands folded, looking at the mounds the way you'd look at a grave you had come a long way to stand at.

Whiskeyjack is on a bench by the fountain with his leg out in front of him, splinted to a halberd shaft from hip to heel. Mallet is sitting beside him with his bag between his feet, and says, to nobody in particular, "It's not going to be right."

"No," says Whiskeyjack.

${S.f.c6_wjLeg ? `You were there when it broke. You heard it.` : S.f.c6_key === 'cellars' ? `He broke it on the lawn in the night, holding the garden, while you were under the city scraping acid out of wax. You didn't hear it. You'd have liked to have been there to hear it, which is a strange thing to want.` : `He broke it on the lawn in the night, holding the garden, while you were in an alley. You weren't there.`}

Paran is standing at the edge of the yard of mounds with a sword through his belt beside his own. It isn't his. ${S.f.c6_lornEnd ? `You know whose.` : `He sees you looking. "The Adjunct's dead," he says, when you come level with him. One sentence, flat, like weather, the way he told you his own death in the hills. He doesn't give you another.`}

Across the lawn, the doors of the big house stand open, and a very big man in plain brown clothes is walking up the steps and in through them, slowly, like a man coming home late who doesn't want to wake anyone.${S.f.c6_collRing ? ` There's a ring on his hand.` : ''} Coll.

On the steps outside, a slender man in a silk coat the colour of a bruise is sitting with his elbows on his knees, not going in. Murillio. He's been sitting there all night, you think. There's a door inside that house that nobody has opened yet.

At a table on the terrace, alone among the ruins of the banquet, a fat man in a red waistcoat is eating something. He raises it to you.

And over the lake, low over the roofs: the Moon's Spawn. It's moving. For the first time since Pale, since before any of you came to this city, it's moving, slowly, the way a ship moves when the anchor comes up. West. Away. The dawn goes round it the way water goes round a stone, and it's going.

${dead.length ? `You count. You get the number you got in the alley. You'll get it every morning now.` : ''}`,
      ch:[{t:'Whiskeyjack.', go:'c6_dawn_wj'}]}; },
    c6_dawn_wj:()=>{ const dead = Object.keys(S.dead || {}).filter(id => S.dead[id] && S.dead[id].ch === 6); const w = ['None','One','Two','Three','Four','Five','Six'][SQUAD().length] || String(SQUAD().length);
      return {sp:'Whiskeyjack', scene:'fete_garden', txt:
`He looks up when you come, and counts. ${w}. ${dead.length ? `He counts again, and it's the same, and he looks at you, and you watch him put the number away where he keeps such things, with the others, and close the drawer on it very gently.` : `He checks it, and lets it be right.`}

"Report."

You give it to him the way he taught you, in order, without anything in it that isn't so. ${S.f.c6_key === 'bridgeburners' ? `The lawn, and the line, and the rime-dead. Seven doors. The sword that drank the lance. Hedge running. The roots. The sky.` : S.f.c6_key === 'cellars' ? `The run down the hill with the frost in the cobbles. The lantern at the bottom of the ladder that shouldn't have been lit. Four grey cloaks and a phial. The wax. The sky, from the crossing.` : `The gate, and the streets, and the thing that went up over the roofs. The alley. The boy against the wall and the order: *hold him*. What you did. The man in crimson. The two women from the Phoenix. The captain, kneeling. The sky.`}${dead.length ? (dead.length === 1 ? ` The name.` : ` The names.`) : ''}

He listens with his face doing nothing.

${S.f.c6_key === 'bridgeburners' ? `"You held," he says, when you've finished. "With us. On the lawn." He looks down at the leg. "I'd rather have had the leg. I'll take the squad." And then, because he's Whiskeyjack, and because it's true: "Good."` : S.f.c6_key === 'cellars' ? `"Quick says you sat on the crates," he says. "I heard the frost stop going down. On the lawn. It stopped, and I didn't know why." He looks down the hill, toward the crossing. "Now I do." He doesn't ask what you took off the man with the phial. He looks at your coat, once, where the paper is. "Keep whatever you found," he says. "Somewhere I'll never find it." A beat. "Good."` : S.f.c6_steppedIn ? `"Paran says you were in the alley," he says. "Between her and the boy." He closes his eyes, for a moment, the only time you've ever seen him do it in front of anyone. "Hood's breath, Sergeant." He opens them. "Good."` : `"Paran says you were in the alley," he says. He doesn't ask what you did there. He looks at your face${SQUAD().includes('brisk') ? `, and at Brisk's,` : ','} and files what he finds, and doesn't say which drawer.`}

${dead.length === 1 ? `Then he says the name. ${NAME(dead[0])}. The way he'd say it to Dujek. He knew ${C6H.her(dead)}. You didn't know he knew ${C6H.her(dead)}.` : dead.length ? `Then he says their names. ${C6H.names(dead)}. ${dead.length === 2 ? 'Both of them' : 'All of them'}, in order, the way he'd say them to Dujek. He knew them. You didn't know he knew them. He knew every one.` : ''}

${S.f.wjRegard > 0 ? `"Get some sleep," he says. "Somebody should. It won't be me."` : S.f.wjRegard < 0 ? `"Get some sleep," he says. He's already looking past you at the house.` : `"Get some sleep," he says. "Or pretend."`}`,
      ch:[{t:'The squad.', go:'c6_close'}]}; },

    /* ---- chapter close: the terrace steps at dawn ---- */
    c6_close:()=>{ const dead = Object.keys(S.dead || {}).filter(id => S.dead[id] && S.dead[id].ch === 6); const w = ['None','One','Two','Three','Four','Five','Six'][SQUAD().length] || String(SQUAD().length);
      return {sp:'The terrace steps · dawn', scene:'fete_garden', txt:
`${SQUAD().length > 1 ? `The Fourth sits on the terrace steps in the wet, in Lady Simtal's blue with the armbands torn off, and for a long time nobody says anything.` : `You sit on the terrace steps in the wet, in Lady Simtal's blue with the armband torn off, and for a long time there's nobody to say anything to.`}

${dead.length ? `There's room on the step for ${C6H.words(dead.length)} more. Nobody sits in it. Nobody says they're not sitting in it. ${C6H.names(dead)}.` : `${w}. You count twice, the way you always do, and it's right both times, and you sit with that for a while.`}

${SQUAD().length > 1 ? `The squad is awake. You could talk to any of them. It's the hour for it.` : `The Fourth is you now. You say the names once more, to the step, in order. It's the hour for it.`}`,
      ch:[{t:'Brisk.', req:()=>SQUAD().includes('brisk') && !S.f.c6_closeBrisk, fx:()=>{ S.f.c6_closeBrisk=1; }, go:'c6_close_brisk'},
          {t:'Kettle.', req:()=>SQUAD().includes('kettle') && !S.f.c6_closeKettle, fx:()=>{ S.f.c6_closeKettle=1; }, go:'c6_close_kettle'},
          {t:'Tuft.', req:()=>SQUAD().includes('tuft') && !S.f.c6_closeTuft, fx:()=>{ S.f.c6_closeTuft=1; }, go:'c6_close_tuft'},
          {t:'Ohl.', req:()=>SQUAD().includes('ohl') && !S.f.c6_closeOhl, fx:()=>{ S.f.c6_closeOhl=1; }, go:'c6_close_ohl'},
          {t:'Ellis.', req:()=>SQUAD().includes('ellis') && !S.f.c6_closeEllis, fx:()=>{ S.f.c6_closeEllis=1; }, go:'c6_close_ellis'},
          {t:'Look at the house.', go:'c6_close_end'}]}; },
    c6_close_brisk:()=>{ const dead = Object.keys(S.dead || {}).filter(id => S.dead[id] && S.dead[id].ch === 6);
      return {sp:'Brisk', scene:'fete_garden', txt:
`${S.f.c6_key === 'bridgeburners' ? `She's sitting with her shield across her knees and a splinter of halberd-shaft beside her that she hasn't thrown away yet.

"I carried Whiskeyjack," she says, before you can speak. "To the bench. Mallet holding the leg." She looks at the shield. "Nobody's going to believe me. I'm going to write it in the ledger so somebody has to."

A pause.

"We don't leave people. I said it on the lawn when I picked him up. I didn't mean to say it. It came out." She sights along the rim. "I've been saying it about the Fourth for as long as there's been a Fourth. I didn't know I meant *him* too. I didn't know it went out that far."` : S.f.c6_key === 'cellars' ? `She has the ration ledger open on her knee. She's written one line. You can read it upside down: *One vault. Forty and twelve. Not fired.*

"We sat on crates," she says. "While they fought the thing on the lawn, we sat on crates in a hole." She closes the ledger. "Best thing we've ever done. Nobody will ever know." A beat. "That's how you know it was the best thing. Nobody knows."` : S.f.c6_steppedIn ? `She has her shield across her knees, and ${S.f.c4_key === 'shield' ? `the rim has two bends in it now, side by side` : `there's a new bend in the rim, fresh and bright`}.

${dead.length ? `"I wrote ${C6H.her(dead)} in the ledger," she says. "${C6H.names(dead)}. ${dead.includes('ohl') ? `Ohl first. Somebody had to write him somewhere.` : `Ohl's got his list. I've got the rations.`} I didn't take ${C6H.her(dead)} off the count. I drew a line under it." Her voice is perfectly level. "We don't leave people. We didn't leave ${C6H.her(dead)}. We stood where ${dead.length === 1 ? (dead[0] === 'ohl' ? 'he' : 'she') : 'they'} stood, and ${dead.length === 1 ? (dead[0] === 'ohl' ? 'he' : 'she') : 'they'} fell there, and that isn't leaving." A long breath out. "I'm going to keep saying that until I believe it."` : `${S.f.c4_key === 'shield' ? `"Two dents," she says. "One for the roof. One for tonight. I'm leaving them both in."` : `"One dent," she says. "For tonight. There isn't one for the roof; we didn't stand there. I'm leaving this one in."`} She runs her thumb along the rim. "That's what a line's for, Sergeant. The ones who wouldn't have lived. That boy wouldn't have." A pause. "Neither would we, if something hadn't come out of a doorway. I'm not going to think about that. I'm going to think about the line."`}` : `She's sitting as far down the steps as the steps allow, with the ledger closed on her knee. She doesn't move away when you sit, which you take as the most she can manage.

${S.f.c4_key === 'aside' ? `"Twice," she says. "*Stood aside.* I've written it twice now. I didn't even have to think how to spell it this time."` : `"I wrote *stood aside*," she says. "I had to think how to spell it. On the roof I didn't have to write it at all."`}

"I took the step with you. Again. I'll always take it." She puts the ledger away. "That's the problem, Sergeant. You should know that it's a problem."`}

She puts her hand flat on her gorget, over the place where the letter is. Still sealed. "Not yet," she says, to it.`,
      ch:[{t:'Back to the steps.', go:'c6_close'}]}; },
    c6_close_kettle:()=>{ const dead = Object.keys(S.dead || {}).filter(id => S.dead[id] && S.dead[id].ch === 6);
      return {sp:'Kettle', scene:'fete_garden', txt:
`${S.f.c6_key === 'bridgeburners' ? (S.f.c6_hedgeCusser ? `She's lying on her back on the wet lawn with the satchel on her chest and her hands folded over the place where Hedge's cusser used to be.

"I gave it back," she says, to the sky. "Hedge's. He threw it at a *tyrant*." A long, happy sigh. "Chub said I'd know the one that mattered. It was that one. It just wasn't mine to throw."

"I'm not even sad," she says. "Is that bad? I'm not sad at all. I carried it to the hills and back and I gave it to the man who made it and he killed a *god* with it. Or nearly. Or whatever that was." She turns her head. "Put it in the ledger, Sergeant. *Returned to owner.*"` : `She's lying on her back on the wet lawn with the satchel on her chest.

"Hedge ran at a tyrant with a cusser," she says, to the sky. "Laughing. I watched him do it." A pause. "I didn't have one to give him. I've never wanted to have one so much in my life. Not to throw. To *give*."`) : S.f.c6_key === 'cellars' ? `${SQUAD().includes('ohl') ? `Ohl has bandaged her hand. She's holding it up in front of her face, turning it over, looking at it as if it belonged to somebody else.` : `She's wrapped her burned hand in a strip of Simtal's blue armband. She's holding it up in front of her face, turning it over.`}

"It's going to scar," she says. "Chub lost three fingers. I've got a scar." She almost smiles. "I'm catching him up."

"Forty and twelve. Nobody'll ever know. Hedge'll know. I'll tell him. He'll cry, and he'll pretend it's the onion." She lowers the hand. "Sergeant. I made them *not* go. All of them. That's the hard half. I did the hard half."` : `She's sitting with the satchel in her lap and her crossbow across it.

${S.f.c6_steppedIn ? `"Everything died in that alley," she says. "Every warren.${SQUAD().includes('tuft') ? ` Tuft's shadow.` : ''}${SQUAD().includes('ohl') ? ` Ohl's hands.` : ''} And the satchel never noticed. There's no warren in a sharper. There's just a sharper." She pats the satchel. "That's why I love them."` : `"My hand kept going to the satchel," she says. "In the alley. You said step aside, and I stepped, and my hand kept going to the satchel the whole time." She looks down at it. "It still does."`}${dead.length ? `

She's quiet for a long time.

"${C6H.names(dead)}," she says. "I keep counting. I get the wrong number. I keep thinking if I count it the other way round it'll come out different." She doesn't look at you. "The tall thing on the roof was the first thing I couldn't make stop being a thing. This is the second. I don't like it. I want you to know I don't like it."` : ''}`}

"${C6H.count(S.inv.cusser, 'cusser')}," she says, to nobody, the way she does. "${C6H.count(S.inv.sharper, 'sharper')}. ${C6H.count(S.inv.burner, 'burner')}. Same as—" She stops. "No. Not the same as this morning. Nothing's the same as this morning."`,
      ch:[{t:'Back to the steps.', go:'c6_close'}]}; },
    c6_close_tuft:()=>({sp:'Tuft', scene:'fete_garden', txt:
`${S.f.c6_tuft === 'glove' ? `She's sitting with her back against the fountain, in the Andii cloak, with the blank card on her knee.

"It's still quiet," she says. "Meanas. It's down there. I can feel it the way you feel the sea from a long way inland." She turns the card over. It's still blank. "I slept. Did you see? An hour, on the steps, before the light. Without the lamp. I didn't mean to."

"I'm going to keep the lamp. I'm going to keep lighting it. But it's *my* lamp now." She looks at the card. "Nobody's looking out of anything."` : S.f.c6_tuft === 'shadow' ? `She's sitting with her hood up. After a while she puts it down, and lets you see.

The grey lock at her temple is wider. Not much. A finger's width. It doesn't move in the wind the way the rest of her hair moves.

"I keep feeling it," she says. "Not a thread. Not a window. More like a hand on my shoulder, from behind, very light, the way you'd steady somebody on a stair." She touches the lock. "${SQUAD().includes('ohl') ? `Ohl says it's a thumb. He's right.` : `Ohl said it was a thumb. He was right.`} But it's a thumb that *asked*."

"The lamp," she adds. "I was frightened, last night, that the shadows would mind it. I asked them." A small, strange smile. "They don't."` : S.f.c6_tuft === 'dark' ? `She's standing at the balustrade in the Andii cloak, looking west, at the Spawn going away over the lake.

"It's going," she says. "The house. I can feel it going, the way you feel a big ship go out of a harbour: the water going down a little, everywhere." She pulls the cloak closer. "It did me a courtesy, and it's going, and it won't think of me again. I don't mind. I *don't*. I'd only like to have said thank you."

"I could sleep in the dark now," she says. "I think. I won't. I'll keep the lamp. But I could."` : `She's sitting apart, with her knees drawn up, and the badge is on her collar, and her eyes are her own this morning. You check. You can't help checking.

"He's gone," she says, before you can ask. "For now. He looks when he likes. I don't know when he likes." She doesn't look at you. "Don't look at my eyes, Sergeant. Please. I can't tell, from in here, when he's in them."

"Yes, Sergeant," she says, although you haven't said anything. She hears herself. She puts her face in her hands for a moment, and takes it out. "Sorry. I'll sleep with the lamp. I'll sleep with *two*."`}

${S.f.c6_selfDrawn && S.f.c6_tuft === 'kept' ? `"The card's still blank," she says. "I keep checking. I thought it would have his face on it by now."

` : ''}${S.f.c3_askedTuft ? (S.f.c6_tuft === 'kept' ? `"I owe you a thing," she says, very quietly. "From the Phoenix. What Kruppe said." She looks east. "I'll tell you. I don't know if it'll be *me* that tells you."` : `"Tomorrow," she says, looking east, toward the hills and the long road the Rhivi took. "I haven't forgotten. Kruppe's sentence. I'll know by then."`) : S.f.c3_kruppe ? `She's looking east, toward the hills and the long road the Rhivi took. "There's a thing Kruppe said at the Phoenix," she says. "I've never told you what it meant. I'm going to. Soon."` : ''}`,
      ch:[{t:'Back to the steps.', go:'c6_close'}]}),
    c6_close_ohl:()=>{ const dead = C6H.dead(), Cnt = C6H.num(listCount());
      return {sp:'Ohl', scene:'fete_garden', txt:
`He's sitting on the rim of the fountain with the oilcloth open on his knee, in daylight, for once.

"${Cnt}," he says, when you sit. He doesn't look up.

${dead.length ? `"I keep reading the last ${dead.length === 1 ? 'one' : 'ones'}," he says. "${dead.map(id => NAME(id)).join('. ')}. I keep thinking the charcoal will come off if I read ${dead.length === 1 ? 'it' : 'them'} enough times." He smooths the cloth flat with the side of his hand. "Twenty-two years, and I never put one of ours on here. I'd told Hood. I'd told him to his face. He doesn't listen. He never has." A long breath. "Neither do I. It's why we get on."

` : ''}${S.f.c6_ohlLorn ? `"I wrote her too," he says. "The Adjunct. *Lorn. The Empress's hand.* I never had my hands in her. I couldn't have; there was nothing in that alley for my hands to find." He looks at the name. "The list is the ones I would have tried for. I'd have tried for her. I've been sitting here an hour, and that's the most frightening thing I know about myself."

` : S.f.c6_key === 'bridgeburners' ? `"I don't write legs," he says, of Whiskeyjack. "Mallet's right, though. It won't be right." He looks at the house at the end of the lawn. "And the old priest. I didn't write him. He went into *that*. I don't know where that goes." He folds the oilcloth along its creases. "Nobody's dead until I know where they went."

` : S.f.c6_key === 'cellars' ? `"There were four in the vault," he says. "Grey cloaks. I didn't write them." He turns the charcoal over. "I've decided they're not mine. I'm allowed one of those a year. I've used it."

` : ''}${S.f.c5_ellisThrough ? `"Two spaces at the bottom, still. Toc. Ellis." He touches them. "Some lists close from the other side. I'm leaving them open. I'll leave them open till the cloth rots."` : `"The space for Toc is still there." He touches it. "Paran says he's still riding. I'm going to believe Paran. I've decided."`}

${SQUAD().includes('tuft') ? (S.f.c6_tuft === 'glove' ? `He looks across at Tuft, by the fountain. "I put my hand on her head last night," he says. "Nothing. Nobody. I've never in my life been so glad to find nothing in anybody."` : S.f.c6_tuft === 'shadow' ? `He looks at Tuft, at the grey in her hair. "A thumb," he says. "Turning pages." He doesn't say anything else.` : S.f.c6_tuft === 'dark' ? `He looks at Tuft at the balustrade. "I'm not writing that," he says. "Any of it."` : `He looks at Tuft, sitting apart, and doesn't put his hand on her head. "I tried, this morning," he says. "Something looked back at me." He puts the oilcloth away. "I've never been afraid of one of ours before."`) : ''}`,
      ch:[{t:'Back to the steps.', go:'c6_close'}]}; },
    c6_close_ellis:()=>({sp:'Ellis', scene:'fete_garden', txt:
`She's at the end of the step, facing out, where a scout sits. She doesn't look round when you sit down. She hasn't looked at you since the hillside, and she doesn't now.

${S.f.c6_key === 'cellars' ? `"That paper," she says, to the lake. "In your coat. They'll know it's gone by noon. They'll know who by supper." A pause. "Don't keep it anywhere you sleep."` : S.f.c6_key === 'alley' ? (S.f.c6_steppedIn ? `"You stepped in," she says, to the lake. "I saw." That's all. It isn't forgiveness. You can hear it not being forgiveness. It isn't nothing, either.` : `She doesn't say anything at all. She's said her sentence, in the alley, and it was the right one, and she isn't going to say another.`) : `"The captain's sword drank that lance," she says, to the lake. "Toc would have given his other eye to see that." A pause. "He'd have been insufferable about it for a year."`}

${S.f.c6_horses ? `After a long time: "The old man with the ponies. He'll be at the horse fair in the spring, outside the Worry Gate." She pulls her glove tight at the wrist. "I might go."` : ''}

She doesn't look at you. You sit there until the sun is properly up, and she lets you, and that's the whole of it.`,
      ch:[{t:'Back to the steps.', go:'c6_close'}]}),
    c6_close_end:()=>({sp:'Lady Simtal\'s garden · dawn', scene:'fete_garden', txt:
`The house at the end of the lawn.

You look at it for a long time. It doesn't do anything. It sits in its yard of mounds with its door shut and its one window lit, the way a house sits at the end of a lane in a country you're only passing through; and you have the feeling, clear as cold water, that it will be sitting there when this garden is a city and the city is a field, and that it knows exactly what is inside it, and has no intention of ever letting it out.

*Thud*, you think, and wait. Nothing comes. For the first time since the hills, nothing comes.

${SQUAD().includes('tuft') ? `Tuft, beside you: "It's a *house*," she says. "Sergeant. A real one. With somebody home." She shivers. "Not somebody I'd knock for."` : ''}

${SQUAD().includes('kettle') ? `Kettle, on the step below: "Is it going to stay there?" "Yes." "In a *garden*?" "Yes." She considers this. "The Daru are going to have to build round it." She sounds, for the first time since the hills, almost cheerful.` : ''}

Over the lake the Moon's Spawn is a long way west now, low, going, with the sun coming up behind it and the light going round it the way water goes round a stone. Nobody in the city is looking at it. For once it's because they don't need to.

Below the hill, the city wakes up, the way it always does, as if nothing had happened, and begins, all at once, to shout about fish.`,
      ch:[{t:'Sleep. Or pretend.', fx:()=>{ S.f.c6_done=1; }, go:()=>chapterEnd(6, S.f.c6_key || 'bridgeburners')}]}),
  }
};
