/* ============ chapter 7: Outlaws (the finale) ============ */
/* helpers for this chapter only (C7H): everything here reads S at call time, never at load */
const C7H = {
  has:id => SQUAD().includes(id),
  loy:id => (S && S.loy && typeof S.loy[id] === 'number') ? S.loy[id] : 0,
  dead:() => Object.keys((S && S.dead) || {}).filter(id => id !== 'sgt' && TPL[id]),
  isDead:id => !!(S && S.dead && S.dead[id]),
  names:ids => { const n = ids.map(id => NAME(id)); return n.length < 2 ? (n[0] || '') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1]; },
  num:n => { const o = ['no','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'], t = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
    const w = k => k < 20 ? o[k] : k < 100 ? t[Math.floor(k / 10)] + (k % 10 ? '-' + o[k % 10] : '') : o[Math.floor(k / 100)] + ' hundred' + (k % 100 ? ' and ' + w(k % 100) : ''); return w(Math.max(0, Math.min(999, n | 0))); },
  Num:n => { const s = C7H.num(n); return s.charAt(0).toUpperCase() + s.slice(1); },
  cap:s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s,
  and:a => a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1],
  lc:() => typeof listCount === 'function' ? listCount() : 211 + (S.f.c2_key === 'light' ? 1 : 0) + (S.f.c4_key === 'aside' ? 1 : 0) + C7H.dead().length + (S.f.listAdds || 0),
  /* the number Ohl wrote for one of the Fourth's dead, as Chapter 6 wrote it in the alley: after 211, Tattersail and Vell, in the order they fell.
     The Adjunct (c6_ohlLorn) was written after them, at dawn, and Tattersail's crossing-out this morning (c7_listAdj) renumbers nobody. */
  listNo:id => { const f = S.f, d = C7H.dead(), base = 211 + (f.c2_key === 'light' ? 1 : 0) + (f.c4_key === 'aside' ? 1 : 0) + Math.max(0, (f.listAdds || 0) - (f.c7_listAdj || 0) - (f.c6_ohlLorn ? 1 : 0)), i = d.indexOf(id); return base + (i < 0 ? d.length : i) + 1; },
  tuft:() => S.f.c7_tuftCut ? 'glove' : (S.f.c6_tuft || ''),
  leashed:() => S.f.c6_tuft === 'kept' && !S.f.c7_tuftCut,
  /* the grey cloak comes with an offer if the Fourth's last word to the Claw was yes (the Ch3 report, which Madryn promised would keep her people off), otherwise to close the entry */
  friend:() => S.f.c3_key === 'report' || (!!S.f.clawFavour && !S.f.marked),
  pendingTell:() => !!S.f.c3_told && !S.f.c3_wjTold && !S.f.c7_wjKnows,
  wjTrust:() => { const f = S.f, r = f.wjRegard || 0;
    if (f.c7_wjKnows === 'claw') return false;
    if (f.c7_wjKnows === 'told' || f.c3_wjTold || f.c6_key === 'bridgeburners') return true;
    if (f.c7_wjKnows === 'kalam') return r >= 1;
    return r >= 0; },
  square:() => ['paid','spent','closed'].includes(S.f.c7_debt),
  ledgerCase:() => S.f.c5_ellisThrough ? 'lost' : (S.f.c3_key === 'report' && S.f.c2_ellisJoined) ? 'retained' : 'released',
  /* who follows the sergeant's road. Loyalty −2 or worse never follows; each thread pulls its own way */
  wouldFollow:(id, key) => { const f = S.f, l = C7H.loy(id);
    if (key === 'disband') return false;
    if (id === 'brisk') return key === 'outlaw' ? l >= -1 : l >= 2;
    if (id === 'kettle') return key === 'outlaw' ? l >= -1 : key === 'empire' ? (C7H.square() && l >= 0) : (C7H.square() && l >= -1);
    if (id === 'tuft') { if (key === 'empire' && C7H.leashed()) return false; return key === 'outlaw' ? l >= -1 : key === 'empire' ? l >= 1 : l >= 0; }
    if (id === 'ohl') return key === 'outlaw' ? l >= -1 : key === 'empire' ? l >= 1 : l >= 0;
    if (id === 'ellis') return key === 'outlaw' ? l >= -1 : key === 'empire' ? (f.c7_clawDeal !== 'took' && f.c7_ledger !== 'retained' && l >= 2) : l >= -1;
    return l >= -1; },
  follows:(id, key) => { const m = S.f.c7_follow; return (m && S.f.c7_key === key && id in m) ? !!m[id] : C7H.wouldFollow(id, key); },
  followMap:key => { const m = {}; SQUAD().filter(id => id !== 'sgt').forEach(id => { m[id] = C7H.wouldFollow(id, key); }); return m; },
  tuftEast:key => C7H.has('tuft') && !C7H.leashed() && (key === 'disband' || !C7H.wouldFollow('tuft', key)),
  /* a leashed Tuft who isn't coming with the sergeant goes west, to him, to keep his eye off the child (empire has its own line) */
  tuftWest:key => C7H.has('tuft') && C7H.leashed() && key !== 'empire' && (key === 'disband' || !C7H.wouldFollow('tuft', key)),
  /* one short line per squadmate for the choice node */
  reason:(id, key) => { const f = S.f, fol = C7H.wouldFollow(id, key);
    if (id === 'brisk') { if (key === 'disband') return 'Brisk goes north, to Tav.';
      if (key === 'outlaw') return fol ? (f.c7_tav ? 'Brisk, to where Tav is on the rolls.' : 'Brisk, to what is left of the Second. Tav was Second.') : 'Brisk goes north to Tav\'s regiment. Not with you.';
      return fol ? (key === 'empire' ? 'Brisk, the other way from Tav, because it\'s you asking.' : 'Brisk, in a doorway that needs standing in.') : 'Not Brisk. Tav is north.'; }
    if (id === 'kettle') { const sq = C7H.square();
      if (key === 'disband') return sq ? 'Kettle goes with the Moranth. Square, and going anyway.' : 'Kettle goes with the Moranth, to carry her half of what she owes.';
      if (key === 'outlaw') return fol ? 'Kettle, on the Moranth\'s own road.' : 'Kettle goes north with the Moranth. Not with the Fourth.';
      return fol ? (key === 'empire' ? 'Kettle, square with the Moranth.' : 'Kettle, in a city sitting on gas.') : (sq ? 'Not Kettle. She stays with the quorls.' : 'Not Kettle. She owes the Moranth, and the Moranth remember debts.'); }
    if (id === 'tuft') { const east = f.c7_tattersail ? 'east, after the child' : 'east, with the Rhivi', st = C7H.tuft();
      if (C7H.tuftWest(key)) return key === 'disband' ? 'Tuft goes west, to him, to keep his eye off the Rhivi road.' : 'Not Tuft. She goes west, to him, to keep his eye off the Rhivi road.';
      if (key === 'disband') return `Tuft goes ${east}.`;
      if (key === 'empire' && C7H.leashed()) return 'Tuft goes home too. His, not yours.';
      if (fol && C7H.leashed()) return 'Tuft, with the High Mage looking out of her collar.';
      if (fol) return key === 'outlaw' ? 'Tuft, back to where the cadre was.' : key === 'empire' ? (st === 'glove' ? 'Tuft, home, where the High Mage can\'t find her any more.' : 'Tuft, home, where the High Mage is.') : 'Tuft, by a door of Baruk\'s that only she can see.';
      return `Not Tuft. She goes ${east}.`; }
    if (id === 'ohl') { if (key === 'disband') return C7H.tuftEast('disband') ? 'Ohl goes east with Tuft. Somebody has to argue with Hood for her.' : 'Ohl goes north, where the wounded will be.';
      if (key === 'outlaw') return fol ? (f.c7_askedOhl ? 'Ohl, to Dujek\'s work.' : 'Ohl, where the wounded will be.') : 'Ohl goes north to the Host\'s hospital. Not to you.';
      return fol ? (key === 'empire' ? 'Ohl, home to an Empire with Seven Cities in it.' : 'Ohl, in a room at the Phoenix.') : 'Not Ohl. The wounded will be north.'; }
    if (id === 'ellis') { if (key === 'disband') return 'Ellis rides.';
      if (key === 'outlaw') return fol ? 'Ellis, riding ahead.' : 'Not Ellis. She rides her own road.';
      if (key === 'empire') return fol ? 'Ellis, home to Genabaris.' : 'Not Ellis. Not back into their hands.';
      return fol ? 'Ellis, among her mother\'s people.' : 'Not Ellis. Not in this city.'; }
    return ''; },
  count:(n, w) => { n = Math.max(0, n | 0); return n === 0 ? `no ${w}s` : `${C7H.num(n)} ${w}${n === 1 ? '' : 's'}`; },
  pr:id => id === 'ohl' ? {she:'he', She:'He', her:'him', hers:'his'} : {she:'she', She:'She', her:'her', hers:'her'},
  roadWho:key => { const ids = SQUAD().filter(id => id !== 'sgt'); return ids.length ? ids.map(id => C7H.reason(id, key)).join(' ') : 'Nobody. Only you.'; },
  countFollow:key => 1 + SQUAD().filter(id => id !== 'sgt' && C7H.follows(id, key)).length,
  intact:key => !C7H.dead().length && SQUAD().every(id => id === 'sgt' || C7H.follows(id, key)),
  /* the finale text lives further down, after CH7 */
};

const CH7 = {
  title:'Outlaws', number:'Seven',
  intro:{loc:'Darujhistan', sub:'The Lakefront · the morning after', cap:'Blue lamps going out along the quay one at a time, gulls on every piling, and over the lake a sky with nothing in it.',
    paras:[
`The lamps go out along the Lakefront the way they have gone out every morning for three hundred years: one at a time, street by street, the blue shrinking back into the glass as if something under the city were breathing in. Nobody watches them go. This morning, for once, the whole of Darujhistan is watching something else.`,
`The sky. There is nothing in it. For a month a mountain of black stone hung over the lake with nothing under it, and the city learned not to look up. Now the city looks up and can't stop. Moon's Spawn went west at first light, slow as a barge on a canal, and the sun came up where it had been and fell on the water and the roofs and on faces that had forgotten what it was to be lit from that side.`,
`The lake smells of weed and fish and last night's smoke. On the Estate hill a house that was not there yesterday stands in a garden full of mounds. In the Daru District they are carrying people out of doorways on shutters. Darujhistan is counting. So is the Fourth. You have been counting since midnight, and the number is the number, and you count it again.`],
    go:'Morning', node:'c7_start'},

  areas:[
    /* 16 columns x 12 rows.  ~ lake  n moored boat  p pier planks  , wet stone  . cobbles  k bollard  B crates  L gas lamp  x post  W wagon  # warehouses  D the green door  > the Gadrobi road east */
    { id:'lakefront', title:'Darujhistan · the Lakefront', sub:'Dawn · the morning after the Fete', hint:'Tap ground to move · tap a figure to talk · the green door is on the south side · the Gadrobi road is east', decor:'lakefront',
      map:[ "~~~~~~~~~~~~~~~~",
            "~~n~~~~~~~~~~~~~",
            "~~p~~~nnnnn~~p~~",
            "~np~~~nnnnn~~p~~",
            ",,p,k,,,,,,k,p,,",
            "....,.....,.....",
            ".L..B......L...>",
            "......,.........",
            "B....x...,...W..",
            "###.#####D##.###",
            "###.########.###",
            "################" ],
      walk:'.,p>', triggers:{'D':'c7_green_door', '>':'c7_to_hill'}, start:{x:1, y:7},
      npcs:[ {id:'kalam', name:'Kalam', kind:'kalam', x:6, y:4, still:true, node:()=>'c7_kalam', fresh:()=>!S.f.c7_kalam},
             {id:'fiddler', name:'Fiddler', kind:'fiddler', x:7, y:4, node:()=>'c7_fiddler', fresh:()=>!S.f.c7_fiddler},
             {id:'crokus', name:'Crokus', kind:'crokus', x:8, y:4, node:()=>S.f.c7_coin ? 'c7_crokus_again' : 'c7_crokus', fresh:()=>!S.f.c7_coin},
             {id:'apsalar', name:'A girl in a plain dress', kind:'sorry', x:9, y:4, still:true, node:()=>'c7_apsalar', fresh:()=>!S.f.c7_apsalar},
             {id:'mallet', name:'Mallet', kind:'mallet', x:10, y:4, still:true, node:()=>'c7_mallet', fresh:()=>!S.f.c7_mallet},
             {id:'paran', name:'Captain Paran', kind:'paran', x:13, y:2, still:true, node:()=>'c7_paran', fresh:()=>!S.f.c7_paran},
             {id:'kruppe', name:'Kruppe', kind:'kruppe', x:4, y:5, still:true, node:()=>'c7_kruppe', fresh:()=>!S.f.c7_kruppe},
             {id:'coll', name:'Coll', kind:'coll', x:3, y:5, node:()=>'c7_coll', fresh:()=>!S.f.c7_coll},
             {id:'claw', name:'A grey cloak', kind:'claw', x:10, y:8, still:true, node:()=>'c7_claw', show:()=>!S.f.c7_clawGone, fresh:()=>!S.f.c7_clawDone},
             {id:'ellisback', name:'Somebody in the alley', kind:'ellis', x:3, y:10, still:true, node:()=>'c7_ellis_back', show:()=>!!S.f.c5_ellisThrough && !S.f.c7_ellisBack && !S.f.c7_ellisLeft && !C7H.isDead('ellis'), fresh:()=>true},
             {id:'ellisdoor', name:'Ellis', kind:'ellis', x:7, y:8, still:true, node:()=>'c7_ellis_door', show:()=>!!S.f.c2_ellisRefused && !S.f.c7_ellisJoined && !S.f.c7_ellisWalked, fresh:()=>!S.f.c7_ellisDoor},
             {id:'vell', name:'Vell', kind:'vell', x:12, y:9, node:()=>'c7_vell', show:()=>!!S.f.c4_vell, fresh:()=>!S.f.c7_vell},
             {id:'veteran', name:'An old man mending a net', kind:'guildveteran', x:12, y:9, still:true, node:()=>'c7_veteran', show:()=>S.f.c4_key === 'aside' && !S.f.c4_vell, fresh:()=>!S.f.c7_veteran} ] },

    /* . grass  , scrub and the Gadrobi road  r rock  M barrow stone  x Rhivi stake  # drop  < the road back west to the city */
    { id:'quorl_hill', title:'East of the city · the quorl hill', sub:'Late morning · the Gadrobi road', hint:'Tap ground to move · tap a figure to talk · Whiskeyjack is on the litter · the Rhivi are on the road', decor:'hills',
      map:[ "################",
            "#,,..r......,.M#",
            "#.........r....#",
            "#..r.......,...#",
            "#.....,........#",
            "#.,.......r....#",
            "#........,.....#",
            "#r...M......x..#",
            "#....,.....x...#",
            "<,,,,,,,,,,,,,,,",
            "#..,..r...,..,.#",
            "################" ],
      walk:'.,<', triggers:{'<':'c7_hill_west'}, start:{x:2, y:9},
      npcs:[ {id:'wj', name:'Whiskeyjack', kind:'wj', x:7, y:4, still:true, node:()=>'c7_wj', fresh:()=>!S.f.c7_key},
             {id:'qb', name:'Quick Ben', kind:'qb', x:8, y:5, node:()=>'c7_qb_hill', fresh:()=>!S.f.c7_qbHill},
             {id:'paran', name:'Captain Paran', kind:'paran', x:5, y:3, node:()=>'c7_paran_hill', fresh:()=>!S.f.c7_paranHill},
             {id:'quorl1', name:'A quorl', kind:'quorl', x:3, y:2, still:true, node:()=>'c7_quorl', fresh:()=>!S.f.c7_quorl},
             {id:'quorl2', name:'A quorl', kind:'quorl', x:9, y:2, still:true, node:()=>'c7_quorl'},
             {id:'quorl3', name:'A quorl', kind:'quorl', x:11, y:3, still:true, node:()=>'c7_quorl'},
             {id:'quorl4', name:'A quorl', kind:'quorl', x:12, y:5, still:true, node:()=>'c7_quorl'},
             {id:'moranth', name:'A Black Moranth', kind:'moranth', x:10, y:4, still:true, node:()=>'c7_moranth', fresh:()=>!S.f.c7_moranth},
             {id:'chkess', name:'The Moranth quartermaster', kind:'moranth', x:13, y:4, still:true, node:()=>'c7_qm', fresh:()=>!S.f.c7_debt && !C7H.isDead('kettle') || !S.f.c7_rolls},
             {id:'hedge', name:'Hedge', kind:'hedge', x:4, y:5, node:()=>'c7_hedge', fresh:()=>!S.f.c7_hedge},
             {id:'trotts', name:'Trotts', kind:'trotts', x:5, y:5, still:true, node:()=>'c7_trotts'},
             {id:'crone', name:'A raven on a stone', kind:'crone', x:13, y:1, still:true, node:()=>'c7_crone', fresh:()=>!S.f.c7_crone},
             {id:'sethand', name:'Sethand', kind:'rhivi', x:12, y:9, still:true, node:()=>'c7_seth', fresh:()=>!S.f.c7_seth},
             {id:'bundle', name:'A woman on a grey mare', kind:'rhivi', x:14, y:9, still:true, node:()=>'c7_bundle', fresh:()=>!S.f.c7_tattersail},
             {id:'rhivi2', name:'A Rhivi rider', kind:'rhivi', x:13, y:10, still:true, node:()=>'c7_rhivi'} ] } ],

  battles:{
    last_accounting:{title:'The last accounting', warrenText:'Open water on three sides · Meanas thin · Denul steady', warren:{meanas:0.9,denul:1}, music:'battle', style:'dock',
      map:["##,,,.##","#..,...#","..,.....","..#..#..","........",".#....#.","........","...,,...","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['greycloak',4,1],['assassin',1,2],['assassin',6,2],['clawcrossbow',3,0],['clawmage',5,0]], xp:320, after:'c7_after_accounting'} },

  foes:{ greycloak:{name:'The grey cloak', sig:'C', kind:'claw', hp:44, ac:17, atk:9, dmg:[1,10,4], rng:1, mv:6, init:7, boss:true, verb:'opens'},
         clawcrossbow:{name:'Claw crossbow', sig:'x', kind:'assassin', hp:16, ac:14, atk:8, dmg:[1,10,2], rng:5, mv:4, init:5, verb:'shoots at'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    moranthchit:{name:'Moranth chit', slot:'trinket', who:['kettle'], hp:2, line:'A curved scrap of black chitin the size of a thumbnail, cut from a moult, with one notch filed in its edge. The Black Moranth give them to those they have finished counting with. Kettle wears it on a thong at her throat and touches it when she is frightened, which is how you will always know.'},
    phoenixkey:{name:'Key to a door that does not exist', slot:'trinket', who:null, stat:{guile:1}, line:'Old black iron, a hand long, with a bit like a broken tooth. It opens the back door of the Phoenix Inn, the one that is not there. Kruppe has had several copies made and forgets which he gave to whom, so that everyone he likes can come in.'},
    clawpen:{name:'A neat hand\'s pen', slot:'trinket', who:null, stat:{wits:1}, line:'A steel nib in a plain grey holder, the kind a clerk buys by the dozen, with ink dried in the slit. It fell out of a ledger onto the planks of a pier on the Lakefront. It has written the Fourth\'s name more times than anyone alive. Nobody in the squad will write with it. Nobody will throw it away.'} },

  card:{ id:'crown', name:'Crown', house:'Unaligned', hue:'#e8c073',
    txt:`An iron crown with a thread of gold worked through it, on nothing: no head under it, and behind it, where a throne should be, only the dark. "Sovereignty," Tuft says. "It means nobody owns us." She looks at it again. "Or everybody wants to."`,
    fx:'Every skill check this chapter rolls twice and keeps the better.' },

  scenes:{
    lakefront_dawn:{loc:'Darujhistan', sub:'The Lakefront · dawn', cap:'Blue lamps going out along the quay, a coastal trader at the long pier, gulls, and over the lake a sky with nothing in it.', amb:'explore'},
    quorl_hill:{loc:'East of Darujhistan', sub:'A hill on the Gadrobi road · noon', cap:'Quorls on the brown grass like dragonflies the size of barges, Black Moranth standing among them, and the city small and blue behind.', amb:'explore'},
    road_east:{loc:'Genabackis', sub:'North and east · the Host on the road', cap:'A column so far off it could be a line of ants: wagons, banners, dust, and an outlawed army walking toward a conversation.', amb:'explore'},
    ship:{loc:'The lake, and after it the sea', sub:'A coastal trader, westbound', cap:'A deck, a rail, a grey sail filling, and the city of blue fire going down behind the stern like a lamp turned low.', amb:'explore'} },

  quests:{
    lakefront:()=> S.f.c5_ellisThrough && !S.f.c7_ellisBack && !S.f.c7_ellisLeft && !C7H.isDead('ellis') ? 'Somebody in the alley' : (!S.f.c7_clawDone && !S.f.c7_clawAvoided) ? 'Goodbyes on the quay. A green door, and a man in a grey cloak.' : 'East, to the hill on the Gadrobi road. The quorls leave at noon.',
    quorl_hill:()=> S.f.c7_key ? 'Noon. The squad.' : 'Whiskeyjack, on the litter. Where does the Fourth go?' },

  end:{
    outlaw:['You flew north','The Empress outlawed the Host, and the Fourth went north with it on the backs of the Black Moranth, into whatever Dujek Onearm means to make of being a rebel. Whiskeyjack is second to an outlaw with a leg that will never be right, a green captain with a borrowed sword has the Bridgeburners, and the Fourth has a sky with nothing in it and a very long way down.'],
    empire:['You went home','The Host was outlawed and the Fourth went the other way: west, to Genabaris and a ship and an Empire that had just written a death sentence for its own army. The Claw keeps its ledger. Somewhere in it the Fourth has a line in a neat hand, and the line says loyal, and nobody in the squad will ever read it.'],
    city:['You stayed','The quorls went north without the Fourth. Darujhistan, which never conquers anyone, let a squad of Malazan marines walk back in through the gate they came in by and find work at a door. In the Empire\'s ledger the word is deserters. The city does not read the Empire\'s ledger. Warm, and uneasy, and both at once.'],
    disband:['You stood the Fourth down','On a brown hill east of Darujhistan, at noon, the sergeant stood the Fourth down, and there was no form for it, and the words were said anyway. Every one of them chose a road. The squad ended. The people did not.'] },
  endCap:()=>{ const k = S.f.c7_key, d = C7H.dead();
    return (k === 'outlaw' ? 'Noon, and the quorls going up off a brown hill, north.' : k === 'empire' ? 'Noon, and the quorls going up without you. The road west is long.' : k === 'city' ? 'Noon, and the quorls going up without you, and the city blue behind.' : 'Noon on a brown hill, and a squad standing down.') + (d.length ? ` ${C7H.names(d)} ${d.length === 1 ? 'is' : 'are'} not on the hill.` : ''); },
  extras:()=>{ const f = S.f, x = [];
    x.push({took:'The grey cloak\'s pardon is in the sergeant\'s coat. So is everything the sergeant told him to get it.', refused:'The grey cloak offered the Empire\'s pardon on the Lakefront, and the Fourth said no. He wrote that down too.'}[f.c7_clawDeal] ||
      (f.c7_clawFought ? 'The grey cloak stepped backward off the end of a pier with wet boots and did not come up. His ledger did not go with him.' : f.c7_clawBought ? 'The Claw\'s own order to fire the mains closed the Fourth\'s entry. The grey cloak drew the line himself.' : f.c7_clawTalked ? 'The grey cloak closed his ledger on the Lakefront and walked away. There was nobody left to send it to.' : f.c7_clawAvoided ? 'The Fourth walked past the green door and the man on its step. The entry stays open.' : ''));
    x.push({told:'Whiskeyjack heard about the dye-shop from the sergeant, before anyone else could tell him.', claw:'Whiskeyjack read about the dye-shop in the grey cloak\'s hand.', kalam:'Whiskeyjack heard about the dye-shop from Kalam, by way of Mallet, before the sergeant got up the hill.'}[f.c7_wjKnows] || '');
    if (f.c7_ellisBack) x.push('Ellis walked out of the dark on the Lakefront with Kettle\'s cord on her wrist.' + (f.c7_ohlEllis ? ' Ohl crossed out her space.' : ''));
    else if (f.c7_ellisLeft) x.push('Ellis came back out of the grey, and the sergeant let her go her own way.');
    else if (f.c7_ellisJoined) x.push('Ellis read her name at the green door and walked out of it with the Fourth.');
    else if (f.c7_ellisWalked) x.push('Ellis read her name at the green door and walked east along the quay alone.');
    if (f.c7_tav) x.push(f.c7_letter === 'brisk' ? 'Tav is on the Host\'s rolls of the living. Brisk opened the letter.' : f.c7_letter === 'sgt' ? 'Tav is on the Host\'s rolls of the living. His letter to Brisk is in the sergeant\'s hands.' : 'Tav is on the Host\'s rolls of the living.');
    x.push({paid:'Kettle handed a cusser back to a Black Moranth. Square.', spent:'Kettle told a Black Moranth what Chub\'s cusser was spent on, and he called it square.', owed:'Kettle still owes the Moranth. She kept the cusser, and the spoon, and knows whose they are.', closed:'The Moranth closed Kettle\'s debt. The dead do not owe.'}[f.c7_debt] || '');
    if (f.c7_tattersail) x.push(C7H.isDead('tuft') ? 'A raven told the Fourth on the Gadrobi road what Tuft did not live to: the child in the Rhivi bundle is Tattersail.' : 'Tuft kept her promise on the Gadrobi road: the child in the Rhivi bundle is Tattersail.');
    if (f.c7_tuftCut) x.push('The High Mage\'s working in Tuft\'s badge died in an otataral glove on the Lakefront.'); else if (C7H.has('tuft') && C7H.leashed()) x.push('The High Mage is still looking out of Tuft\'s collar.');
    if (f.c7_ohlTat) x.push('Tattersail is crossed off Ohl\'s list. She went east.');
    if (f.c7_key) x.push(C7H.wjTrust() ? 'Whiskeyjack would have had the Fourth as his.' : 'Whiskeyjack would not have the Fourth as his.');
    if (f.c7_paranToc) x.push('Paran has heard that Toc kept riding.');
    if (f.c7_coin) x.push('Crokus threw Oponn\'s coin into the lake.');
    return x.filter(Boolean); },
  tease:'The Book of the Fallen goes on without the Fourth, mostly.',

  finale:{
    endings:{ get outlaw(){ return C7H.ending('outlaw'); }, get empire(){ return C7H.ending('empire'); }, get city(){ return C7H.ending('city'); }, get disband(){ return C7H.ending('disband'); } },
    fate:(id, key)=>C7H.fate(id, key),
    gone:(id, key)=>C7H.gone(id, key),
    coda:(key)=>C7H.coda(key) },

  dlg:{
    /* ---- the garden bench: Whiskeyjack, the leg, the house with mounds ---- */
    c7_start:()=>{ const d = C7H.dead(); return {sp:'Whiskeyjack · Bridgeburners', scene:'fete_garden', fx:()=>{ S.f.c7_started=1; }, txt:
`Whiskeyjack is where you left him at first light: on the bench by the fountain in what was Lady Simtal's garden, among the broken lanterns, with his left leg out straight in front of him, splinted from hip to heel to a halberd-shaft with a great deal of somebody's good linen. The sword is across his knees. He isn't holding it. His hands are flat on the blade, the way you'd hold a table in a boat.

At the far end of the lawn, where the black sapling stood last night in its turned earth, there is a house.

It's small, and wrong, and made of wood that hasn't finished deciding what shape to be. A peaked roof. One window. A low wall round a yard, and in the yard, mounds: grave-sized, grassed over already, as if they'd been there a hundred years. One of them is fresh. The house doesn't do anything. You have the strong impression it would rather you didn't either.

${S.f.c6_wjLeg ? `You were there when the leg went. You heard it go, under the ice and the noise, a sound like a green branch in a frost. You'll go on hearing it for a while.` : `You weren't there when the leg went. You were ${S.f.c6_key === 'cellars' ? 'under the Gadrobi crossing with acid on your hands' : S.f.c6_key === 'alley' ? 'in an alley off the Daru District' : 'somewhere else in the dark'}, and you heard about it at dawn, from Mallet, in four words.`}

Mallet is crouched at the end of the bench packing his kit, slowly, the way a man packs when he's done what he can and it isn't enough.

"Sergeant." Whiskeyjack doesn't turn his head. He counts. You watch him do it, the way everyone does. ${d.length ? `He arrives at the number, and it's the wrong one, and he knows exactly how wrong.

"${d.map(id => NAME(id)).join('. ')}," he says. Just ${d.length > 1 ? 'the names' : 'the name'}, to the house in the garden, the way he'd read ${d.length > 1 ? 'them' : 'it'} off a roll. He said ${d.length > 1 ? 'them' : 'it'} at dawn. Somebody should say ${d.length > 1 ? 'them' : 'it'} again this morning, and he has decided it should be him.` : `He arrives at ${C7H.num(SQUAD().length)}, and checks it, and something in his shoulders lets go by the width of a hair.`}

"Quick's gone for something. When he's back there'll be news. Sit down. You look like you've been up all night." A pause. "So do I."`,
      ch:[{t:'"Sir. Before the news. There\'s something you should hear from me."', req:()=>C7H.pendingTell(), go:'c7_confess'},
          {t:'"The leg, sir."', req:()=>!S.f.c7_leg, go:'c7_leg'},
          {t:'Sit.', go:'c7_sending'}]}; },
    c7_leg:()=>({sp:'Mallet · healer', scene:'fete_garden', fx:()=>{ S.f.c7_leg=1; }, txt:
`"Knee, and the long bone above it," Mallet says, without looking up from his kit. "Broken in three places and then stood on by something made of ice." He buckles a strap. "I've set it. Quick's put something in it I don't want to know the name of. It'll hold him up. It'll carry him onto a quorl and off again."

He looks at the leg, and then at the man attached to it.

"It'll never be right," he says.

"It'll do," says Whiskeyjack.

"It'll *do*," Mallet agrees, in a voice that means the opposite, and goes back to his buckles.

${C7H.has('ohl') ? `Ohl has come to look at the splint the way he looks at a wound he wasn't asked to see. He and Mallet exchange the long nod of two old dogs across a yard. "Denul won't reach bone that far gone," Ohl says quietly. "Not in a night. Not in a year." "No," says Mallet. Neither of them says anything else. Healers don't lie to each other. Everybody else, yes.` : `Nobody says anything. The house in the garden doesn't either.`}

${S.f.c6_wjLeg ? `"You carried me off the lawn," Whiskeyjack says, to you, not looking round. "I remember that part. I don't remember much else." A pause. "I'd rather not."` : ''}`,
      ch:[{t:'"Sir. Before the news. There\'s something you should hear from me."', req:()=>C7H.pendingTell(), go:'c7_confess'},
          {t:'Sit.', go:'c7_sending'}]}),
    c7_confess:()=>({sp:'Whiskeyjack', scene:'fete_garden', fx:()=>{ S.f.c7_wjKnows='told'; if (C7H.has('brisk')) loy('brisk',1); if (C7H.has('ellis')) loy('ellis',1); }, txt:
`You tell him. In order, without anything in it that isn't so.

The paper with the blue-wax seal${S.f.c3_ellisMsg ? `, and the boy at the well who put it in Ellis's hand` : ''}. The dye-shop in the Street of Tanners' Daughters, the sign of the blue hand. The tea, which was good. The woman with blue hands, who never raised her voice. What she asked. What you told her: ${S.f.c3_toldAll ? `the vault, the mains, the count, where Hedge seats a cusser against a joint, and the two men who went out at night and came back before dawn with clean cuts on their hands` : `the vault, the mains, roughly how many crates; and what you didn't, and how she waited with her pen lifted until you knew she knew you'd stopped on purpose`}. Forty silver. How much of it is left.

He listens with his hands flat on the sword and his eyes on the house in the garden. He doesn't interrupt. When you've finished, a gull lands on the hedge behind him, looks at the broken lanterns, and goes away again.

"I know," says Whiskeyjack.

Then, because you're still standing there: "Not who. Kalam smelt it on the squad before the roofs, and told me somebody, and said he didn't know who, and I told him not to find out." He turns his head then, and looks at you. Grey eyes. Tired. "I didn't want to find out. I wanted you to come and tell me. I wasn't sure you would."

A long silence.

"It's in the Claw's hands, what you gave her. Some of it they'll have used. ${S.f.c6_key === 'cellars' ? `Last night they knew exactly which pipes to go to, and you were sitting on them.` : `Last night none of it mattered, because the city was busy being eaten.`}" He looks back at the house. "That's luck. It isn't forgiveness. You'll want to keep the two apart."

"You told me yourself, before anybody could. That's the part I'll remember."

${C7H.has('brisk') ? `Behind you, Brisk lets out a breath she has been holding since the Daru District.` : ''}`,
      ch:[{t:'"Sir."', go:'c7_sending'}]}),

    /* ---- the sending: a bone, a voice, Quick Ben not smiling ---- */
    c7_sending:()=>({sp:'Quick Ben · squad mage', scene:'fete_garden', txt:
`Quick Ben comes in at the garden gate with his hands in his sleeves, and he isn't smiling.

At the Pale, in the vault, on the roofs with a laughing sack under his arm, he smiled at something just past your shoulder, where he kept the joke. This morning there's nothing past your shoulder. He sits down on the frost-burned grass at Whiskeyjack's feet, cross-legged, like a boy at a fire, and takes a thing out of his sleeve.

A bone. A knuckle, you think, old and brown as a nut, wound round and round with fine copper wire. He holds it on his open palm. He says a word you don't catch, and then another, and the copper goes warm and then hot, you can see it, and his face goes very still, the way a man's face goes still when he's lifting something heavy and doesn't want you to see how heavy.

${C7H.has('tuft') ? (C7H.tuft() === 'glove' ? `Tuft can't feel it. Meanas has been quiet in her since the glove, a room with the fire out. She watches the bone the way you'd watch someone speak a language you used to know.` : `Tuft has gone the colour of the linen on Whiskeyjack's leg. "That isn't a warren," she whispers. "Sergeant, he's *carrying* it. The whole distance. In his hand."`) : ''}

And somewhere a very long way north, a voice says: "Whiskeyjack."

It comes out of the bone, or out of the air over it: thin, and far, full of wind, like a man shouting across a valley. An old voice. A voice like a cart going over gravel.

"You sound like shit," says the voice.

"My leg's broken," says Whiskeyjack.

"Good. Then you'll sit still and listen for once in your life."`,
      ch:[{t:'Listen.', go:'c7_sending_dujek'}]}),
    c7_sending_dujek:()=>{ const d = C7H.dead(); return {sp:'Dujek Onearm · a long way north', scene:'fete_garden', fx:()=>{ S.f.c7_dujek=1; }, txt:
`You know the voice. You'd know it at the bottom of a well: you heard it for three years across parade grounds and burning towns, while its one arm pointed you at whatever came next. High Fist Dujek. Onearm. The Host.

"Here it is, then. The Empress has outlawed the Host. Me by name, the rest of you by the usual courtesy. There's a price on my head. I've seen the figure. I'd be insulted by anything lower." The wind comes through the bone and takes a word away and gives it back. "Seven Cities is sharpening its knives. The Empire's got more map than soldiers. So the Host is going its own way, and the first place it's going is to have a talk with Caladan Brood, and don't ask me what about, because I haven't decided yet what I'm going to lie about." A pause, and the voice goes flat, which is how you know it isn't lying now. "Here's what I won't lie about. There's a prophet in a tower in the south who calls himself the Pannion Seer. His priests are eating cities, and he doesn't care whose flag was on them. Brood's going to have to care. So am I."

"The Black Moranth are with me. The rest of the Moranth are thinking about it, which with the Moranth takes a generation."

"Whiskeyjack. You're my second."

Whiskeyjack looks at his leg. "Sir."

"Don't argue, you'll hurt yourself. Paran gets your Bridgeburners."

"He's green."

"So were you. So was I. I've got one arm and no Empress; I'll take green." A pause full of wind. "Who's that breathing? You've got people there."

Whiskeyjack's eyes come to you. "The Fourth, sir. Marines. Seventh Company. They brought my crate across the plain."

The bone is quiet. Then the voice turns, a thousand leagues off; you hear it turn toward you. "The Fourth. {sgt}'s?" A sound that might be a laugh with no breath to spare for it. "Hood's balls. You read every order I ever gave you twice and made my adjutant weep. You came up out of the Pale with all five. I noticed. Don't let it go to your head. I notice a great many things, and most of them are latrines."

${d.length ? `"Still all of them?" says the voice.

Whiskeyjack says nothing. It's you who has to. "Not since last night, sir."

The wind in the bone. Then: "Names."

You give him ${d.length > 1 ? 'the names' : 'the name'}. ${C7H.names(d)}.

"On the rolls," says Dujek. "Top of the page." He says something else after that, and the wind takes it, and you don't ask for it back.

` : ''}Somewhere in Onearm's Host, somebody has noticed. You've carried that about for months without knowing you were carrying it. It was him. Of course it was him.`,
      ch:[{t:'Brisk has a question, sir.', req:()=>C7H.has('brisk') && !S.f.c7_askedTav, go:'c7_sending_tav'},
          {t:'"Sir. A soldier of the Second. Fourth Regiment."', req:()=>C7H.isDead('brisk') && !S.f.c7_askedTav, go:'c7_sending_tav'},
          {t:'"Ohl\'s here, sir."', req:()=>C7H.has('ohl') && !S.f.c7_askedOhl, go:'c7_sending_ohl'},
          {t:'"Sir. Ohl."', req:()=>C7H.isDead('ohl') && !S.f.c7_askedOhl, go:'c7_sending_ohl'},
          {t:'"Sir."', go:'c7_orders'}]}; },
    c7_sending_tav:()=>({sp:C7H.has('brisk') ? 'Brisk' : 'Dujek Onearm', scene:'fete_garden', fx:()=>{ S.f.c7_askedTav=1; }, txt: C7H.has('brisk') ?
`Brisk steps forward. You've never seen her speak to anyone above a sergeant without being told to, and nobody tells her to. She comes to attention over the bone in the grass, which is ridiculous, and nobody laughs.

"Sir. Brisk, sir. Corporal, Fourth Squad." A breath. "My brother's Second. Fourth Regiment. Tavore, called Tav. Of Cawn." Another breath. "Sir."

The voice is quiet a moment. "Corporal, I've a whole Host to count and one arm to count it on. I don't carry the rolls in my head." Not unkind. Tired. "The Moranth carry them. Living, and the other kind. They never lose a thing; it's a religious matter with them. Ask the Moranth." A pause. "I stopped reading the other kind after Pale. Ask for the living first."

"Sir." Brisk steps back into her place. Her face does nothing at all. Her hand has gone to her gorget, where the letter is.` :
`You ask it yourself. Somebody has to.

"Sir. A soldier of the Second. Fourth Regiment. Tavore, called Tav, of Cawn." You hear yourself say the rest. "His sister was mine."

"Was," says the voice. It isn't a question. The wind comes and goes. "I don't carry the rolls in my head, {sgt}. The Moranth carry them. Living and the other kind. Ask the Moranth." A pause. "Ask for the living first. I've made that a rule. I'm told old men are allowed to."

Her letter is in your coat now${S.f.c2_badge ? ', with the badge off her wrist' : ''}. It's still sealed.`,
      ch:[{t:'"Ohl\'s here, sir."', req:()=>C7H.has('ohl') && !S.f.c7_askedOhl, go:'c7_sending_ohl'},
          {t:'"Sir. Ohl."', req:()=>C7H.isDead('ohl') && !S.f.c7_askedOhl, go:'c7_sending_ohl'},
          {t:'"Sir."', go:'c7_orders'}]}),
    c7_sending_ohl:()=>{ const d = C7H.dead(); return {sp:C7H.has('ohl') ? 'Ohl' : 'Dujek Onearm', scene:'fete_garden', fx:()=>{ S.f.c7_askedOhl=1; }, txt: C7H.has('ohl') ?
`Ohl comes and kneels by the bone, stiffly, with a hand on Quick Ben's shoulder to get down, which Quick Ben allows.

"Sir," he says. "Ohl. Denul. The Second, before you were the whole of it."

"Ohl." The voice does something that in a man with two arms would be a clap on the back. "Ehrlitan. Tea like boiled boots. Still arguing with Hood?"

"Still losing, sir. Slowly."

"Keep losing slowly. I'll have work for you. I'll have more work than Hood's got time for, if I've read Brood right." Wind. "How long's your list now?"

Ohl doesn't have to take it out. "${C7H.Num(C7H.lc())}, sir."

"None of them yours, I'll bet. None of the Fourth."

${d.length ? `Ohl is quiet for a long moment. "${d.length === 1 ? 'One' : C7H.Num(d.length)} of them, sir. Since last night."

The wind in the bone goes on for a while with nobody speaking over it.

"Then you know what I know," says Dujek at last, "and I'm sorry you had to learn it in that order."` : `"No, sir. Not one."

"Keep it that way. That's an order. First one I've given all week that anybody's going to obey."

Ohl bows his head over the bone, the way you'd bow over a hand you were holding.`}` :
`"Is Ohl with you?" the voice asks, before you've found the words. "Old Ehrlitan. Bad tea. Argues with Hood in his sleep. Served the Second before I was the whole of it. Said he was going to a marine squad for the small wounds. For a rest."

You tell him.

The bone is quiet so long that Quick Ben looks down at it.

"Top of the rolls," says Dujek at last. "Above the rest. Whoever's carrying his list, tell them to put him on it, properly. He'd want to be counted right. He was a pedant about it." A pause. "He'd call that a technicality. Tell him I said so, when you write it."

Ohl's oilcloth is in your pack, where it's been since the alley. It's heavier than it looks.`,
      ch:[{t:'Brisk has a question, sir.', req:()=>C7H.has('brisk') && !S.f.c7_askedTav, go:'c7_sending_tav'},
          {t:'"Sir. A soldier of the Second. Fourth Regiment."', req:()=>C7H.isDead('brisk') && !S.f.c7_askedTav, go:'c7_sending_tav'},
          {t:'"Sir."', go:'c7_orders'}]}; },
    c7_orders:()=>({sp:'Whiskeyjack', scene:'fete_garden', fx:()=>{ S.f.c7_orders=1; }, txt:
`The copper goes cold. The voice goes, not all at once: it thins into wind, and the wind into nothing, and there's a garden, and a gull, and a small wrong house.

Quick Ben winds the wire back round the bone, slowly, turn by turn. He looks up and catches you looking. For a moment he has the face of a man who knows the end of a story you've only heard the start of, and has decided you'll like it better not knowing. Nobody says anything. He puts the bone away.

Whiskeyjack shifts his weight on the bench, and his mouth goes thin, and goes back.

"You heard," he says. "The Host's outlawed. I'm his second. Paran has the Bridgeburners. The Moranth are putting down on a hill east of the city, on the Gadrobi road, to fly us north. Noon."

"You're not Bridgeburners." Flat. Not unkind. "You never were. You're marines, Seventh Company, Onearm's Host, which as of this morning is a thing the Empress has written a death sentence for." He looks at the sword across his knees. "The outlawry reads *the Host*. Not the Bridgeburners by name. Not the Fourth. The Host. And the Host is a word with some give in it, Sergeant. It'll stretch to cover a squad that flies north with it. It'll stretch to cover a squad that doesn't."

"The quorls leave from the hill at noon. Be on them, or don't. I'm not going to order it. I've no Empress to order it with."

${(S.f.wjRegard || 0) >= 1 || S.f.c7_wjKnows === 'told' || S.f.c3_wjTold ? `A pause. "I'd like you on them. I'm saying that once."` : (S.f.wjRegard || 0) <= -1 ? `A pause. "Nobody's going to count the quorls to see if you're on them." It's a lie, and he knows it's a lie, because everybody counts the Fourth.` : `A pause, in which he doesn't say what he'd like, and you understand that he won't, so that it won't weigh.`}

"Go down to the Lakefront first. Kalam's ship goes out on the morning tide. ${C7H.has('kettle') ? `Fiddler will want to see your sapper.` : `Fiddler will want to see you. He's heard.`} Say your goodbyes." He looks at the house in the garden. "Everybody's saying them this morning. The whole city."`,
      ch:[{t:'Quick Ben.', req:()=>!S.f.c7_qb, go:'c7_qb'},
          {t:'"Sir." Down to the Lakefront.', go:()=>{ startExplore('lakefront'); talk('c7_lake_arrive'); }}]}),
    c7_qb:()=>({sp:'Quick Ben', scene:'fete_garden', fx:()=>{ S.f.c7_qb=1; }, txt:
`He's getting up off the grass, brushing his knees. He sees you coming and his face does the thing it does, the almost-smile at something past your shoulder, and then stops doing it halfway, as if he'd forgotten this was a morning he wasn't smiling.

"Sergeant." Mild. "You want to ask me whether it's all it seems." He tucks his hands into his sleeves. "Everything's all it seems. That's the trouble with things."

That's all he's going to say about it. You can watch him decide it.

${C7H.has('tuft') ? ({glove:`His eyes go past you to Tuft. "Your mage is very quiet this morning," he says. "Let her be. It comes back. It comes back *hers*, which is the point."`, shadow:`His eyes go past you to Tuft, and the grey at her temple, and stay a moment. "Your mage has a thumb on her," he says. "I'd not mention it to anyone who's afraid of dogs."`, dark:`His eyes go past you to Tuft, in the Andii cloak that doesn't take the light. "Somebody tall did your mage a courtesy last night," he says. "I'd let her keep it. Courtesies from that quarter don't come twice."`, kept:`His eyes go past you to Tuft, and to her collar, and he stops smiling altogether. "Your mage has a window in her," he says, very quietly. "Somebody's standing at it. I can see him from here." He looks back at you. "I'd close it before noon, Sergeant. I'd close it before you're anywhere near a Moranth."`}[C7H.leashed() ? 'kept' : C7H.tuft()] || `His eyes go past you to Tuft. "Look after your mage," he says, and doesn't say why.`) : `He looks at the gap in the Fourth where a mage should be, and doesn't say anything, which from Quick Ben is a speech.`}`,
      ch:[{t:'"Sir." Down to the Lakefront.', go:()=>{ startExplore('lakefront'); talk('c7_lake_arrive'); }}]}),

    /* ---- the Lakefront: arrival, and Tuft's last draw ---- */
    c7_lake_arrive:()=>{ const sp = ['kettle','brisk','ohl','tuft'].find(id => C7H.has(id)), she = sp === 'ohl' ? 'he' : 'she', He = sp === 'ohl' ? 'He' : 'She';
      return {sp:'The Lakefront', scene:'lakefront_dawn', fx:()=>{ S.f.c7_lakeSeen=1; }, txt:
`Down through the Estate District in the new light, past gates standing open and servants sitting on steps with nothing to do, down the long stair to the water, and out onto the Lakefront.

The quay is black stone and wet: fish-scale and rope-ends and last night's paper lanterns floating in the shallows like drowned moths. Piers go out into the lake on tarred legs. The lamps along the quay are going out one by one, blue, then nothing. Gulls on every piling, arguing. And moored along the quay, low in the water with her sail brailed up, a coastal trader with a name on her stern that's been painted over so many times it's only a colour.

On the quay by the trader's side, four people with packs. You know three of them.

At the end of the easternmost pier a man stands alone, looking north across the water, with a sword in his hands that isn't his.

And across the quay, on the step of a wine-merchant's with a green door, a man in a grey cloak is waiting with a book under his arm. The quay is a quarter-inch of lake and fish and last night. His boots are clean.

${C7H.has('ellis') ? `Ellis has stopped. She's looking at the door, not the man. "Green," she says. That's all. Her gloved hand has closed.` : S.f.c2_ellisRefused ? `Two doors down from the green door, on an upturned cask, a woman is sitting with a bow across her knees and her back to the wall. Plains leathers. A glove. ${C7H.has('ohl') && C7H.has('kettle') ? `"Ohl," says Kettle, very quietly. "Ohl. Look."` : `Nobody says her name. Everybody knows it.`}` : ''}

${S.f.c5_ellisThrough && !C7H.isDead('ellis') ? (sp ? `${NAME(sp)} stops dead. ${He}'s looking at the mouth of an alley between two warehouses, where the dawn hasn't got to yet. "Sergeant," ${she} says. "Sergeant, there's somebody in the dark."` : `You stop dead. There's an alley between two warehouses where the dawn hasn't got to yet, and there's somebody standing in the dark of it.`) : ''}

${C7H.has('tuft') ? `At the foot of the stair Tuft has the Deck out of her sleeve. She isn't shuffling. She's holding it the way you'd hold a bird. "One card," she says. "For the squad. The last one, I think." A pause. "I'd like to be the one who says when it's the last."` : `The Deck is in Tuft's pack, and the pack is on ${C7H.has('brisk') ? `Brisk's back` : C7H.has('ohl') ? `Ohl's back` : `your back`}, and nobody has opened it. You feel it there at the top of the stair, a small square weight, like a held breath. Nobody draws. There's nobody to draw.`}`,
      ch:[{t:'Let her draw.', req:()=>C7H.has('tuft') && !S.f.c7_drawn && !S.f.c7_noCard, fx:()=>{ S.f.c7_drawn=1; const pool = ['crown','crown','obelisk','oponn','chains','knight'].filter(k => CARDS[k]); S.card = pool[R(pool.length)] || 'crown'; }, go:()=>cardSequence(()=>talk('c7_card'))},
          {t:'"No readings. Not this morning."', req:()=>C7H.has('tuft') && !S.f.c7_drawn && !S.f.c7_noCard, fx:()=>{ S.f.c7_noCard=1; loy('tuft',-1); if (C7H.has('brisk')) loy('brisk',1); }, go:'c7_card_no'},
          {t:'The quay.', req:()=>!C7H.has('tuft') || S.f.c7_drawn || S.f.c7_noCard, go:()=>startExplore()}]}; },
    c7_card:()=>{ const c = CARDS[S.card] || CH7.card, st = C7H.leashed() ? 'kept' : C7H.tuft();
      /* the Crown's laugh is Kettle's; if Kettle fell in the alley, it doesn't come */
      const crown = `An iron crown with a thread of gold worked through it, on nothing: no head under it, and behind it, where a throne should be, only the dark. ${C7H.has('kettle') ? `Tuft laughs. She laughs at exactly one thing, and it has always been Kettle, and it isn't Kettle.` : `Tuft's mouth moves, the way it does before she laughs. She laughs at exactly one thing. It was always Kettle. It doesn't come.`} "Sovereignty," she says. "It means nobody owns us." She looks at it again. "Or everybody wants to."`;
      return {sp:'The Deck of Dragons', scene:'lakefront_dawn', txt:
`Tuft lays the reading out on the lid of a fish-crate at the foot of the stair, in the first real light, with the gulls watching. Her hands are ${st === 'glove' ? 'steady' : 'not quite steady'}. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)}${c.fx ? ` · ${esc(c.fx)}` : ''}</div>`, oncard:[S.card || 'crown', false],
      after:`${S.card === 'crown' ? crown : (c.txt || '')}

${S.card === 'crown' ? ({glove:`"The Deck isn't Meanas," she says, when she sees you watching her hands. "It never was. It's paint and wood and whoever's holding it. Meanas is a room with the fire out. This still works."`, kept:`She lays the Crown face up and looks at it, and then across the quay at the green door and the man on the step, and puts her hand over her collar. "Or everybody wants to," she says again, more quietly.`, shadow:`The paint is worn off the House of Shadow on every card in the Deck. It's worn off the Crown too, a little, at one corner, as if a thumb had rested there. She doesn't point it out. You see it anyway.`, dark:`She looks west, where the mountain was, for a long moment. "He never wanted one," she says, and doesn't say who, and doesn't need to.`}[st] || '') : S.card === 'chains' ? `"Bound at both ends," she says. She looks across the quay at the man on the step of the green door. "I'd like it to stop meaning him."` : `She turns it over in her fingers. "Not the one I expected," she says. "They never are, on the last morning."`}

${C7H.has('kettle') ? `Kettle, softly: "Put them away, Tuft. It's morning."` : `Nobody says anything. The gulls go on arguing.`}`,
      ch:[{t:'Put the cards away.', go:()=>startExplore()}]}; },
    c7_card_no:()=>({sp:'Tuft', scene:'lakefront_dawn', txt:
`She doesn't argue. She squares the Deck against her knee and puts it back in her sleeve, and keeps her hand over the sleeve a moment, as if keeping something warm.

"Yes, Sergeant."

${[S.f.noCard, S.f.c1_noCard, S.f.c2_noCard, S.f.c3_noCard, S.f.c4_noCard, S.f.c5_noCard, S.f.c6_noCard].filter(Boolean).length >= 3 ? `She doesn't say anything about the other times. She's long past saying it. She only looks at you, once, and there's no reproach in it, only arithmetic. "That's the last time you'll say that," she says. It isn't a complaint.` : `"You're probably right," she says. "It'd only have told me something I know already." A small smile. "They mostly do, on the last morning."`}`,
      ch:[{t:'The quay.', go:()=>startExplore()}]}),

    /* ---- the ship: Kalam, Fiddler, Crokus, Apsalar, Mallet ---- */
    c7_kalam:()=>{ const pend = C7H.pendingTell(); return {sp:'Kalam', fx:()=>{ S.f.c7_kalam=1; if (pend) S.f.c7_kalamWarned=1; }, txt:
`He's standing a little apart from the others, with his back to the trader's hull and his pack at his feet, watching the rooftops along the quay. Not any rooftop. All of them. It's dawn and the city is exhausted and there's nobody up there, and he watches them anyway, the way a man keeps a hand near a knife in a house he knows is empty.

"Sergeant." A pause you could fit a knife into.

${pend ? `He looks at you a beat too long. The same beat as in the vault, before the roofs. He's been carrying it since then. So have you.

"Somebody in your squad sat at a table with the Claw," he says. Conversationally; he could be talking about the weather over the lake. "Blue hands. Tea. I smelt it on you before the roofs, and I told him somebody, and he told me not to find out." A breath through the nose. "I found out anyway. I'm Kalam."

"I've given Mallet a word to carry up the hill. It's your name." He looks back at the roofs. "Get up that hill before Mallet does, Sergeant, and tell him yourself. It's the only road out of this where you're the one walking."` : S.f.c7_wjKnows === 'told' ? `He looks at you a beat too long, and then, for once, he stops. "You told him yourself," he says. Not a question. "On the bench, before the bone. He said you would. I said you wouldn't; I've been Claw, I know how it goes, it goes quiet." He looks back at the roofs. "I was wrong. I'm not often wrong about that. I'm glad."` : S.f.c7_wjKnows === 'claw' ? `"He had it in the grey man's hand before I could give it to him," Kalam says: of Whiskeyjack, of the dye-shop, of all of it, without looking at you. "Neat. Every word in its place." A long pause. "I'd have told it kinder. I'm not known for kind."` : S.f.c4_key === 'shield' ? `"You held a roof for a Guild boy," he says. "The Guild's still talking about it. I'm not; I'm leaving." He almost smiles. "I stood on that roof with my hands empty and watched Rake's people take the Guild apart around me. I've been trying all week to decide what I'd have done in your place. I'd have done what you did. I'd have hated it less."` : `"You stepped aside on a roof for a Tiste Andii," he says. "I'd have done the same. I'd have hated it the same." He watches the roofs. "It nodded at you. They don't nod. I've been thinking about that all week, and I'm going to go on thinking about it on a boat, where it's quieter."`}

"Itko Kan," he says, when you look at the pack. "The girl's going home. It's a long way round and we're taking all of it." ${S.f.c3_kal || S.f.c1_kalamTalk ? `He looks at you properly then, which he doesn't do to many people. "Keep your head down, Sergeant. You're better at it than most. Not as good as you think."` : `He nods to you, once. That's goodbye, from Kalam. You won't get a better one.`}`,
      ch:[{t:'"Safe water, Kalam."'}]}; },
    c7_fiddler:()=>({sp:'Fiddler · sapper', fx:()=>{ S.f.c7_fiddler=1; }, txt: C7H.has('kettle') ?
`He's got the fiddle case on his back that has never, as far as anyone knows, had a fiddle in it, and a pack, and the expression of a sapper about to get into a boat, which is the expression of a cat about to get into a bath.

He finds Kettle before she finds him.

"Falari." He looks at her satchel, not at her. "Count."

"${C7H.cap(C7H.count(S.inv.sharper, 'sharper'))}, ${C7H.count(S.inv.burner, 'burner')}, ${C7H.count(S.inv.cusser, 'cusser')}."

${S.f.c6_hedgeCusser ? `"You gave Hedge his cusser back." He sniffs. "On the lawn, with a tyrant coming up out of it. He's told everybody. He's told the *Moranth*."

"It was his," says Kettle.

"It was yours. He gave it you. That's how giving works." He looks at the lake. "It went off, though. That's what they're for. The rest is priests."` : S.f.c5_cusserUsed ? `"You threw one. At a barrow. Hedge told me." He sniffs. "Wights and a Jaghut rock."

"It didn't matter," says Kettle.

"It went off. That's what they're for. Mattering's for priests."` : S.inv.cusser > 0 ? `"You didn't throw it." He almost sounds proud. "Hedge says you've gone Fiddler. I told him that's not a thing. It's a thing."` : `"None." He looks at her, and then at the city, all those roofs over all that gas. "Good," he says. "Somebody on this quay should be empty-handed. It won't be me."`}

"Listen." He puts a hand on the satchel strap, lightly, the way you'd put a hand on a dog that might bite. "I'm going on a boat. Boats and munitions: never. Not in the hold, not in your hand, not in your *thoughts*. Remember I told you."

"Fiddler," says Kettle. "I *know*."

"I know you know. I'm telling you so you'll remember I told you." He takes his hand off the strap. "Your lot were good hands," he says, over her head, to you. "Tell your sergeant. That's you. I'm telling you."

Kettle doesn't say anything. She puts both arms round him, satchel and all, quickly, the way you'd grab a thing about to fall off a table, and lets go before he can object, and walks off down the quay very fast; and Fiddler stands there with his hands held out from his sides like a man who's just been handed somebody's baby.

"Hood's breath," he says. "Don't tell Hedge."` :
`He's got the fiddle case on his back and a pack at his feet, and he's looking along the Fourth the way everyone does, counting, and he finds the gap before he's finished.

"The Falari," he says.

You tell him. It doesn't take long. It never does.

He's quiet for a long while. The lake laps at the pilings.

"She had good hands," he says at last. "Best I've seen on a Falari. Never spilled a drop in her life." He spits into the lake, which is a sapper's blessing, and wipes his mouth. "I told her once, no munitions on the roofs. She said *I know*. I said I'm telling you so you'll remember I told you." He picks up his pack. "I'd like to have told her something else. I don't know what. I'm a sapper. Nobody tells us what the other thing is."`,
      ch:[{t:'"Safe water, Fiddler."'}]}),
    c7_crokus:()=>({sp:'Crokus', fx:()=>{ S.f.c7_crokus=1; }, txt:
`The boy from the Phoenix. Crokus. He's older than he was a week ago, the way boys get older, all at once and overnight, in the face. There's a cut over one eye stitched with black thread, and he's holding the girl's pack as well as his own and hasn't noticed he's doing it.

He knows you. "The road-menders." He almost laughs. "Malazans. Kruppe told me. Everybody knew. Kruppe says everybody always knows and pretends; it's the city's great courtesy."

${S.f.c6_steppedIn ? `Then he looks at you properly, and the laugh goes out of him. "You were in the alley," he says, low. "Last night. The woman with the sword. You stood — " He stops. He doesn't have the words, and he's the kind of boy who's ashamed of that, and he'll grow out of it. "Thank you. I didn't say it. I'm saying it."` : S.f.c6_lornEnd ? `Then he looks at you properly. "You were there," he says. "In the alley. At the end of it. You didn't — " He stops. "No. It's all right. I don't know what I'd have done either."${S.f.c3_innCrokus ? ` Nearly the same words he said at the Phoenix, about the Pale. He doesn't notice. You do.` : ''}` : ''}

"Uncle Mammot's dead," he says. He says it the way you'd tell somebody the weather had turned. "I'm going with her. Apsalar. To her home. Kalam says it's a long way."

He's walking a coin across the backs of his knuckles, back and forth, without looking at it, the way he did at the Phoenix. It's the only thing about him that hasn't got older.`,
      ch:[{t:'The coin.', go:'c7_coin'},
          {t:'"Safe road, Crokus."'}]}),
    c7_coin:()=>({sp:'Crokus', fx:()=>{ S.f.c7_coin=1; }, txt:
`He stops it. It stands on its edge on his knuckle, which it shouldn't, and stays there, which it shouldn't either.

"It's been lucky," he says. "Everybody says so. I've had enough luck. Everybody who's had any luck near me this week is dead, or they went into a house in a garden and didn't come out." He looks at it. "I don't want to find out what it does next."

He turns, and draws his arm back, and throws it overhand, far out over the water: a good throw, a thief's throw. It goes up spinning into the new light, both faces flashing, one and then the other, and comes down a long way out, and the lake takes it without a sound.

${C7H.has('tuft') ? `Tuft has watched it the whole way. When it goes in she lets out a breath she's been holding since the Phoenix. "Oponn," she says. "The Twins. He's thrown a god in the lake." A pause. "Good."` : C7H.has('kettle') ? `Kettle watches it go. "That was *gold*," she says. "It was bad luck," says Crokus. "It was *gold* bad luck."` : `Nobody says anything. The gulls go out to look, and come back disappointed.`}

"There," says Crokus. It doesn't sound like relief. It sounds like a man putting down a bag he's going to miss.`,
      ch:[{t:'"Safe road, Crokus."'}]}),
    c7_crokus_again:()=>({sp:'Crokus', txt:
`He's handing packs up to Fiddler on the trader's deck. His knuckles keep moving while he does it, back and forth, walking a coin that isn't there.`,
      ch:[{t:'Leave him.'}]}),
    c7_apsalar:()=>({sp:'A girl in a plain dress', fx:()=>{ S.f.c7_apsalar=1; }, txt:
`The girl from the Gadrobi crossing. ${S.f.c4_sawSorry ? `The girl in the doorway under the skylight, who looked up through the bubbled glass at you and didn't blink.` : `The girl in the grey shawl that everyone in the crossing stood with their backs to.`} Sorry.

She isn't. That's the first thing, and it's the only thing. She's a fisher girl of perhaps sixteen, with salt-cracked hands and a plain face and a plain dress, sitting on the trader's rail with her feet dangling, watching the gulls; and when you come up she looks at you the way anybody looks at a stranger on a quay, a glance and a polite nothing, and back to the gulls.

${S.f.c3_sorry ? `*You brought the wagon. Good. Now stand somewhere I am not.* Eleven words, at the Gadrobi crossing, in a girl's voice that was not the shape of a girl's voice. This voice is the shape.` : ''}

"Is it always like this?" she asks. "The city. Kalam says it's usually louder." An accent you can't place: a fishing coast, a long way off. "I don't remember coming here. I don't remember a great deal. Crokus says that's all right." She looks at her hands. "Some of it's coming back, and it isn't mine. It's like somebody left their coat in my room."

${C7H.has('tuft') ? (C7H.tuft() === 'shadow' ? `Tuft has stopped a pace behind you. "It's gone out of her," she whispers. "The hand in the glove. It let go." Her own hand goes up to the grey lock at her temple, and stays there. "It hasn't let go of me."` : `Tuft has stopped a pace behind you. "It's gone," she says, very quietly. "The hand in the glove. Whatever was wearing her, it's taken itself off." She sounds, of all things, envious.`) : ''}
${C7H.has('ellis') ? `Ellis looks at her a long time. "She doesn't know us," she says. "She's the only one on this quay who doesn't." She says it as if it were the kindest thing she's heard all year.` : ''}`,
      ch:[{t:'"Safe home."', go:'c7_apsalar_bye'}]}),
    c7_apsalar_bye:()=>({sp:S.f.c7_crokus ? 'Apsalar' : 'A girl in a plain dress', txt:
`"Thank you," says ${S.f.c7_crokus ? 'Apsalar' : 'the girl'}, and means it, and doesn't know what she's thanking you for; and neither, quite, do you.`,
      ch:[{t:'Leave her to the gulls.'}]}),
    c7_mallet:()=>{ const d = C7H.dead(); return {sp:'Mallet · healer', fx:()=>{ S.f.c7_mallet=1; }, txt:
`He's sitting on a fish-crate by the trader's side with his bag between his feet, waiting to see Fiddler off and not liking any of it.

"He'll walk," he says, of Whiskeyjack, before you ask. "With a stick. He'll hate the stick. He'll never run again and he'll never tell anybody it hurts, and it'll hurt every day till he dies." He looks at his hands. "I'm good at this, Sergeant. I'm the best there is at this in the Host. That's the leg I got."

${C7H.has('ohl') ? `His eyes go to Ohl. "Your healer. How's the list?"

"${C7H.Num(C7H.lc())}," says Ohl.

"None of yours?"

${d.length ? `"${C7H.names(d)}," says Ohl. Just that.

Mallet takes a long breath and lets it out. "Otataral," he says. "Nothing to be done. You know that." "I know it," says Ohl. "It doesn't help." "No," says Mallet. "It never does."` : `"None of mine."

"Keep it that way."

"Everybody keeps telling me that," says Ohl, "as if I'd been trying the other thing."`}` : C7H.isDead('ohl') ? `He looks along the Fourth and doesn't find the old man. "Your healer," he says. You tell him. He nods, slowly. "He knew about my list," Mallet says. "I never said. I've got one too. It's shorter. I'll put him on it." A breath. "He'd laugh. He'd say mine's a draft."` : ''}

${C7H.pendingTell() ? `"Kalam's given me a word to carry up the hill," he adds, not looking at you. "I don't know what it is. I don't want to. I'm going up at the ninth bell."` : ''}`,
      ch:[{t:'Leave him to the ship.'}]}; },

    /* ---- the pier: Paran ---- */
    c7_paran:()=>({sp:'Captain Paran', fx:()=>{ S.f.c7_paran=1; }, txt:
`The end of the easternmost pier. He's standing with his back to the city and the lake in front of him, grey and flat all the way to the far shore; and on the far shore, north, a thin line of smoke going straight up in the still air. There's a skiff tied under the pier, wet to the thwarts, with a spade in it.

He has two swords. His own, at his hip, the ordinary-looking one in the worn scabbard. And another, point down on the planks in front of him with both his hands on the pommel: a plain sword with a plain hilt in plain leather, and you can feel it from ten paces off, the way you feel a sheer drop behind you in the dark.

${C7H.has('tuft') ? (C7H.tuft() === 'glove' ? `Tuft walks all the way out along the pier with you. "It's all right," she says, to your look. "There's nothing left in me for it to eat."` : `Tuft stops at the foot of the pier and won't come any further. You don't ask her to.`) : ''}

"Sergeant." He doesn't turn round. "I buried her. North shore. There's a hill there with a view of the city." Flat. Like weather. "She'd have hated the view."

${S.f.c6_lornEnd ? `"You were in the alley," he says, "when I came. At the mouth of it. ${S.f.c6_steppedIn ? `You'd stood between her and the boy. The Adjunct of the Empress, and a squad of marines in front of a Daru thief with a coin.` : `You were against the wall, all of you, well back. I could see where you'd stood when it mattered. I didn't ask why. A year ago I'd have been standing there with you.`}" He's quiet a moment. "You didn't say anything to me when I knelt down. I've been grateful for that all night."` : ''}

${S.f.c1_key === 'line' ? `"Pale," he says. "The cadre row. There was a line of shields, and I looked up out of the fire with a Hound on top of me and thought, *somebody's doing their job*." He almost turns his head. "I told you that in the hills. I find I want to tell you again."` : ''}

"I'm told I've been given the Bridgeburners." Something moves at the corner of his mouth that might have been a smile once, a long time ago. "A company that doesn't want me, and a sergeant with a broken leg who's been promoted to somewhere I can't follow. I'm short of soldiers, Sergeant. I'm short of everything."`,
      ch:[{t:'"Captain. Toc asked me to tell you something."', req:()=>!S.f.c6_paranToc && !S.f.c7_paranToc, go:'c7_paran_toc'},
          {t:'"Captain. Toc\'s horse."', req:()=>C7H.has('ellis') && !S.f.c7_tocHorse, go:'c7_paran_horse'},
          {t:'Leave him to the lake.'}]}),
    c7_paran_toc:()=>{ const hill = S.area === 'quorl_hill'; return {sp:'Captain Paran', fx:()=>{ S.f.c7_paranToc=1; }, txt:
`"On the Rhivi Plain. Before he rode for the Adjunct. He said: if you get to Darujhistan and the captain's there, tell him Toc kept riding. He'll know what it means."

For a long time Paran doesn't do anything. ${hill ? `A quorl shifts its wings in the grass behind him, and a Moranth clicks at it, and it goes still.` : `The lake laps at the pilings. A gull comes and stands on the skiff's gunwale and looks at the spade.`}

Then he laughs. Not much. Once, down his nose: the laugh of a man hit somewhere he'd thought was armoured.

"He'd know I wouldn't," he says. "Know what it means. That's the joke. It's a Claw joke; there aren't many." He looks north. "He kept riding. Into the grey, with his mouth open and his hand on the bridle.${S.f.c7_ellisBack ? ` And she went in after him, and came out, and he didn't.` : ''} He kept riding." A breath. "I'll take it to mean he's still at it. Somebody has to decide what it means, and I'm the captain."`,
      ch:[{t:'"Captain. Toc\'s horse."', req:()=>C7H.has('ellis') && !S.f.c7_tocHorse, go:'c7_paran_horse'},
          {t:'Leave him.'}]}; },
    c7_paran_horse:()=>({sp:'Captain Paran', fx:()=>{ S.f.c7_tocHorse=1; if (C7H.has('ellis')) loy('ellis',1); }, txt:
`"Toc's horse." He knows before you've finished. ${S.f.c5_toc && (S.f.c2_ellisJoined || S.f.c7_ellisBack) ? `He looks past you at Ellis${S.f.c7_ellisBack ? `, and the grey in her hair, and doesn't ask` : ''}.` : `He looks past you at Ellis. "His scout," he says. "He told me about you. He said you'd tell me your eye was bad, and it isn't."`}

"It's in the stable at the Worry Gate. I led it all the way in from the hills. It stood by my fire every night because it had nowhere else to stand." He takes one hand off the pommel of the sword that isn't his. "It's yours, if you want it. He'd want it ridden."

Ellis doesn't say anything for a moment. Then she nods, once, the way you'd nod at a number you'd been waiting to hear.

${S.f.c5_toc && S.f.c2_ellisJoined ? `"Five," she says, very quietly, to nobody, and pulls her glove tight. And then, to Paran: "Thank you, sir."` : `"Thank you, sir," she says. And then, very quietly, to nobody: "He kept riding. So will it."`}`,
      ch:[{t:'Leave him to the lake.'}]}),

    /* ---- Kruppe and Coll: the city's offer ---- */
    c7_kruppe:()=>({sp:'Kruppe', fx:()=>{ S.f.c7_kruppe=1; }, txt:
`He's sitting on a bollard at the head of the stair, which takes some doing, with a pastry in one hand and a napkin in the other and the whole of the morning spread out in front of him like a meal he's already paid for.

"Ah! The road-menders!" Crumbs. "Kruppe has been waiting. Kruppe has been waiting since before dawn, an hour Kruppe regards as largely theoretical."

His small brown eyes go along the Fourth, counting, ${C7H.dead().length ? `and stop at the gap, and stay there a moment, and then go on, gently, the way you'd step round a grave on a path.` : `and arrive, and are satisfied, and move on to the pastry.`}

"Such a night! Such a garden! A young house where no house was, and in it a gentleman of Kruppe's acquaintance who went in last night carrying someone, and has not come out, and will not, Kruppe suspects, for some while. Houses of that kind are very hospitable. It is the leaving they are strict about."

"Coll has his house back" (a small nod at the big man beside the bollard) "and has come down to the water this morning to see a boy off, rather than stand in the hall of it looking at the stairs as if they might ask him something. Murillio is not well. Murillio will be well, in time, which is the only kind of well there is." A small sigh. "The High Alchemist grieves. A priest of D'rek, an old man and a good one, who is gone, and who was gone, it turns out, some days before anyone noticed. Kruppe did not notice. Kruppe is inconsolable. Kruppe has had only the two pastries."

He dabs his lips.

"And the road-menders? Where do the road-menders go, now the road is mended, and the Empire that paid for the mending has fallen out with its own army?" He spreads his small hands. "Kruppe merely asks. Kruppe has, as it happens, taken the liberty of arranging a few small things. In case. Kruppe is always taking liberties. They are so seldom missed."

${C7H.has('tuft') ? `His eyes rest on Tuft for exactly one blink${S.f.c3_kruppe ? `, as they did at the door of the Phoenix` : ''}. ${S.f.c3_askedTuft ? `"And the little mage has a promise to keep, Kruppe believes. East, on the road. Today."` : S.f.c3_kruppe ? `"And the little mage has a thing to say to somebody, Kruppe believes. East, on the road. Today."` : `"And the little mage should look east today, Kruppe believes. On the road. At the wool."`} He beams. "Kruppe merely observes."` : ''}`,
      ch:[{t:'"What have you arranged, Kruppe?"', req:()=>!S.f.c7_kruppeOffer, go:'c7_kruppe_city'},
          {t:'Leave him to the pastry.'}]}),
    c7_kruppe_city:()=>({sp:'Kruppe', fx:()=>{ S.f.c7_kruppeOffer=1; gain('phoenixkey'); }, txt:
`"Coll needs a man on his gate," says Kruppe. "Coll has a house with a young Azath in the garden and a yard full of, shall we say, tenants; and the Council will send men to look at it, and the Guild will send men to look at the men, and Coll will want somebody at the gate who has stood in front of worse things and does not ask what they are."

"The Phoenix needs somebody at the door who can stop a fight by standing in it. ${C7H.has('brisk') ? `Kruppe has seen the armoured lady stand in things.` : `Kruppe has seen the Fourth stand in things.`} And the High Alchemist, Kruppe is told, finds this morning that he has a great many doors, and rather fewer people than yesterday whom he trusts to watch them."

"Nothing is promised. Everything is available. Darujhistan does not ask a soldier which army he has left. It asks only whether he pays for his wine." A pause, delicate as a knife laid on a plate. "The Empire will call it desertion. The Empire calls a great many things a great many things. Darujhistan has never once been listening."

He presses something into your hand: a key, old black iron, a hand long.

"The back door of the Phoenix. The one that does not exist. Kruppe has had copies made, several, and forgets to whom he gave which, so that everybody he likes may come in." He pats your hand closed over it. "Kruppe likes a great many people. It is his only vice. Apart from the others."

${C7H.has('ohl') ? `Ohl is looking at the key. "The Phoenix," he says. "Jeth Arrow's room." You can see him turn it over. "I said I didn't know how to write a room. I could write one if I lived in it."` : ''}`,
      ch:[{t:'Leave him to the pastry.'}]}),
    c7_coll:()=>({sp:'Coll', fx:()=>{ S.f.c7_coll=1; }, txt:
`He's standing by Kruppe's bollard, a big man in a clean coat that doesn't fit him yet, the way new clothes don't, with a face that was handsome once and is sober this morning, which on Coll looks like a wound. He's here for the boy. He says so.

"Crokus. I taught him to hold a knife. Badly. Somebody should see him off who can tell him he still holds it badly."

${S.f.c3_innColl ? `He knows you. "The Malazans from the Phoenix." A thin smile. "I told you your Empress waits. It turns out she waited for the wrong thing."` : `He looks at you, and at the squad, and you watch him place you: Malazans, soldiers, the wrong side of something. He doesn't seem to mind.`}

${S.f.c6_collRing ? `He holds up his hand. The ring is on it: heavy gold, the crest ground off. "You gave it back," he says. "In the street outside my own gate, on the night I got the gate back. I've been trying all night to work out what that cost you."` : S.f.c3_coll && S.kit.includes('collsignet') ? `His eyes find the ring, wherever it is on you, the way a man's eyes find his own face in a crowd. "You've still got it," he says. Not a question. ${S.f.c6_signetSeen ? `"Somebody recognised the shape last night. Kruppe said they would."` : `"Nobody recognised the shape last night. Kruppe will be disappointed."`}` : S.f.c3_collTalk && !S.f.c3_coll ? `He holds up his hand. The ring is on it, where you pushed it back across the table at the Phoenix. "Hood take you," he says, without heat. "I've been wearing it since."` : ''}

"I've got my house back. Turban Orr is dead, and my wife — " He stops. "I've got my house back," he says again, as if he's trying the weight. "There's a thing in the garden. A house, in the garden of my house. The Council say it's mine. I say it isn't anybody's. It's the first time the Council and I have agreed on anything in five years."

"I need a man on the gate. Kruppe will have told you. Kruppe tells everyone everything before they need it; it's how he keeps his friends frightened."`,
      ch:[{t:'Give him the ring.', req:()=>!!S.f.c3_coll && !S.f.c6_collRing && S.kit.includes('collsignet') && !S.f.c7_collRing && !S.f.c7_collKept, go:'c7_coll_ring'},
          {t:'Keep the ring.', req:()=>!!S.f.c3_coll && !S.f.c6_collRing && S.kit.includes('collsignet') && !S.f.c7_collRing && !S.f.c7_collKept, go:'c7_coll_keep'},
          {t:'Leave him.'}]}),
    c7_coll_ring:()=>({sp:'Coll', fx:()=>{ S.f.c7_collRing=1; S.kit = S.kit.filter(k => k !== 'collsignet'); Object.keys(S.gear).forEach(w => { if (S.gear[w].trinket === 'collsignet') delete S.gear[w].trinket; }); if (C7H.has('ohl')) loy('ohl',1); }, txt:
`You hold it out to him on your palm. Heavy gold, the crest ground off, only the shape of a house left and not its name.

He looks at it for a long time without taking it.

"Hood take you," he says at last, without heat. He takes it. He puts it on. It fits; of course it fits. He turns his hand over and looks at the ring, and then up the hill toward the Estate District, where a house is standing with its door open and a stranger in its garden.

"A soldier'd have lost it honest," he says. "I'd almost counted on it." He closes his hand. "Thank you, Malazan. Don't tell Kruppe. He'll say he arranged it."`,
      ch:[{t:'Leave him.'}]}),
    c7_coll_keep:()=>({sp:'Coll', fx:()=>{ S.f.c7_collKept=1; }, txt:
`You don't take it out. He sees you not take it out.

"Keep it," he says, before you can say anything. "I said a soldier'd lose it honest. Lose it somewhere a long way from here, where nobody knows the shape." He almost smiles. "That's all I want from it now. To have it lost by somebody who didn't sell it."`,
      ch:[{t:'Leave him.'}]}),

    /* ---- the last accounting: the grey cloak on the step of the green door ---- */
    c7_claw:()=>{ const fr = C7H.friend(); return {sp:'A grey cloak', fx:()=>{ S.f.c7_clawMet=1; }, txt:
`He's on the step of the wine-merchant's, beside the green door, with a ledger under his arm: a plain book bound in grey, the kind a clerk buys by the dozen. ${fr ? `He's been waiting for you, and he's pleased you've come, the way a man is pleased when a column of figures comes out right.` : `He's been waiting for you the way a man waits for the last line of a column.`}

His boots are clean.

"Sergeant {sgt}." The same voice. The north quarter under the Pale; the tent lines${S.f.c3_knivesFought ? `; the far end of an alley behind a dye-shop` : ''}. He has never raised it and he doesn't now. "It's been a long road from the tunnels. I've walked most of it a few paces behind you. I'd like to close the book."

${S.f.c3_knivesFought ? `There's a scar across the back of his left hand, new since spring. He sees you see it. "The wall behind the dye-shop," he says. "It was higher than it looked."` : ''}

${C7H.has('tuft') && C7H.leashed() ? `His eyes go past you to Tuft, and rest there. "And the mage," he says. "Good morning." Tuft doesn't answer. Her hand is over her collar, and the hand is shaking.` : C7H.has('tuft') && S.f.c6_tuft ? `His eyes go past you to Tuft, to her collar, and rest there a moment, the way a man's eyes rest on a pocket where a purse used to be. He doesn't say anything about it. He writes something.` : ''}

${fr ? `"I've come with good news," he says. "It's rarer in my trade than you'd think."` : `"I've come to close the entry."`}`,
      ch:[{t:'"Go on."', go:fr ? 'c7_claw_offer' : 'c7_claw_close'},
          {t:'The glove. Tuft, now.', req:()=>C7H.has('tuft') && C7H.leashed(), go:'c7_tuft_glove'},
          {t:'Not yet.'}]}; },
    c7_claw_offer:()=>({sp:'The grey cloak', txt:
`He opens the ledger at a ribbon and takes out a paper folded in three, and holds it up where you can see it and can't read it. A seal. A neat hand.

"A pardon. For the Fourth Squad, Seventh Company, by name, in full." He lets it hang there between you in the morning air. "The Empress has outlawed the Host. The Empress, being the Empress, has also written a very small number of exceptions, for soldiers who were helpful. You were helpful.${S.f.c1_key === 'claw' ? ` At the Pale, holding a tent.` : ''}${S.f.c3_key === 'report' ? ` In a dye-shop, over tea.` : ''}"

"Passage home from Genabaris. A place, after. The Empire has use for soldiers who report. It always has. It has never once had enough."

He folds the paper again, neatly, along its creases.

"The price is small. A report. The Bridgeburners: where they fly, and when, and who with. What the bone said this morning in the garden; yes, I know about the bone. And your own people, Sergeant. Each of them. Who would follow the Host, and who would follow you, and who would follow neither." A small smile. "You know them better than anybody alive. That's what makes it worth a pardon."

${C7H.has('tuft') && C7H.leashed() ? `"And the mage comes home with you, to the High Mage. He's missed her." The smallest pause. "He hasn't, in fact. But it's the form."` : ''}

${C7H.has('brisk') ? `Brisk has gone completely still. Not the stillness of waiting: the stillness of a shield-wall when the other side hasn't charged yet.` : ''}

${C7H.has('ellis') ? `Ellis, very low, to nobody: "That's how they do it. They don't take you. They make you carry yourself in."` : ''}

${C7H.has('ohl') ? `Ohl has the oilcloth out. He isn't writing on it. He's holding it the way you'd hold a hand.` : ''}`,
      ch:[{t:'Take the pardon. Give him his report.', go:'c7_claw_took'},
          {t:'"No."', go:'c7_claw_refused'},
          {t:'The glove. Tuft, now.', req:()=>C7H.has('tuft') && C7H.leashed(), go:'c7_tuft_glove'}]}),
    c7_claw_took:()=>{ const ids = SQUAD().filter(i => i !== 'sgt'); return {sp:'The grey cloak', fx:()=>{ S.f.c7_clawDeal='took'; S.f.c7_clawDone=1; S.f.c7_clawGone=1; if (C7H.has('brisk')) loy('brisk',-2); if (C7H.has('ellis')) loy('ellis',-3); if (C7H.has('ohl')) loy('ohl',-1); if (C7H.has('kettle')) loy('kettle',-1); if (C7H.has('tuft')) loy('tuft',-2); }, txt:
`You take it.

It's lighter than paper should be. That's the first frightening thing.

He waits, pen lifted. You give him the Bridgeburners: the hill, noon, the quorls, north. It's nothing he couldn't have had from a gull. He writes it down anyway. Then he turns a page, and waits, and you understand that he means the other thing.

You give him that too. In order, without anything in it that isn't so; it's the only way you know how to give a report. ${ids.length ? `${C7H.names(ids)}. One at a time.` : `Your dead, one at a time, because they're all the people you have left.`} He writes each name in the neat hand, and a line after it, and doesn't show you the line.

"Thank you, Sergeant." He blots the page. "Whiskeyjack need never hear of the dye-shop. That's in the price too. Madryn told you he'd hear of it one day, but not this year." He closes the ledger on his pen. "It's a new year somewhere. It always is. He won't hear it from me."

${C7H.has('tuft') && C7H.leashed() ? `He looks at Tuft. "Genabaris," he says to her, pleasantly. "I'll see you on the quay." Tuft doesn't answer. She's looking at you. She doesn't stop.` : ''}

He goes along the Lakefront without hurrying, and turns at the corner, and is gone, and his boots are still clean.

${C7H.has('brisk') ? `"Sergeant," says Brisk. That's all. It's the whole conversation, and you can hear in the one word that it's going to be the last whole conversation for a long time.` : ''}

${C7H.has('ellis') ? `Ellis says one sentence, and it's the right one. "He wrote a line after my name, and you'll never know what it said, and neither will I."` : ''}

${C7H.has('kettle') ? `Kettle is looking at her boots. "I'd like to go home," she says, very small. "I just didn't want to go like *that*."` : ''}`,
      ch:[{t:'The glove. Tuft, now.', req:()=>C7H.has('tuft') && C7H.leashed(), go:'c7_tuft_glove'},
          {t:'Walk away from the green door.'}]}; },
    c7_claw_refused:()=>{ const tell = C7H.pendingTell(); return {sp:'The grey cloak', fx:()=>{ S.f.c7_clawDeal='refused'; S.f.c7_clawDone=1; S.f.c7_clawGone=1; if (tell) S.f.c7_wjKnows='claw'; if (C7H.has('brisk')) loy('brisk',1); if (C7H.has('ellis')) loy('ellis',2); if (C7H.has('tuft')) loy('tuft',1); }, txt:
`"No," you say.

He doesn't seem surprised. He writes a line. He doesn't hurry. He closes the ledger on his pen to keep the place.

"Then you're outlaws too, Sergeant, by your own hand. I'll write it so. It'll read better than most."

${tell ? `He tucks the ledger under his arm. "You'll want to know, before you go up that hill, that Whiskeyjack has a copy of your evening at the dye-shop. In my hand. It went up the Gadrobi road an hour ago with the quorls' water." A small, precise pause. "Madryn told you he'd not hear of it this year. It's a new year somewhere. It always is."` : `"I'd meant to send Whiskeyjack a copy of your evening at the dye-shop," he says. "In my hand. I'm told you got there first, on a bench, in a garden, before the bone." A small, precise pause. "That was unexpected. I've written that down too."`}

${C7H.has('tuft') && C7H.leashed() ? `His eyes go to Tuft. "The mage will come when she's called," he says, pleasantly. "She always has. That was never yours to refuse, Sergeant. The High Mage only lent her to you."` : ''}

He goes along the Lakefront without hurrying, and turns at the corner, and is gone.

${C7H.has('ellis') ? `Ellis says one sentence, and it's the right one. "${S.f.c3_key === 'refuse' ? `That's the second time you've shut that door with me on the right side of it.` : `Late, Sergeant, but it's shut, and I'm on the right side of it.`}"` : ''}

${C7H.has('brisk') ? `Brisk lets a breath out through her nose. "Outlaws," she says, trying it. She seems to like it better than she expected.` : ''}`,
      ch:[{t:'The glove. Tuft, now.', req:()=>C7H.has('tuft') && C7H.leashed(), go:'c7_tuft_glove'},
          {t:'Walk away from the green door.'}]}; },
    c7_claw_close:()=>({sp:'The grey cloak', txt:
`"The Empress has outlawed the Host," he says. "You'll have heard; the bone was very loud. That leaves me with a great many open entries and nobody to send them to. So I'm closing them myself. Neatly. It's the last thing I'll do in this city."

He opens the ledger at a ribbon. It's a long page. You can see that from here.

"Fourth Squad, Seventh Company. You'd be surprised what's in it. ${[S.f.decoy ? `A munitions ledger, and a spoon listed under *equipment*.` : '', S.f.c1_accFought ? `Three of mine at a picket line who didn't walk away.` : S.f.c1_accBluffed ? `A cusser at a picket line, and a sapper who wasn't lying.` : S.f.c1_accAvoided ? `A picket line, and a mage's name held up like a shield.` : '', S.f.c3_lied ? `A dye-shop, and a count that was wrong, and an alley.` : S.f.c3_key === 'refuse' ? `A dye-shop, and a door walked out of, and an alley.` : `A dye-shop, and some tea.`, S.f.c3_wjTold ? `A dye-seller's name given to the Guild. She's alive, by the way. She's moved. She thinks about you.` : '', S.f.c6_orders ? `A vault, last night, and some acid wiped off some wax, and a piece of paper that's gone missing.` : ''].filter(Boolean).join(' ')}"

He looks up. "I've come to draw the line under it."

They're on the quay now. You didn't see them come. Two hooded shapes by the fish-crates with their knives held low; a third in the green doorway with nothing in its hands and something in the air around them. ${S.f.c7_vellWarned ? `And on the chandlery roof across the quay, nobody. There should be. The Guild has had a word with him.` : `And on the chandlery roof across the quay, the short glint of a crossbow, where the sun's just reached.`}

${C7H.has('brisk') ? `Brisk's shield comes off her back. She doesn't hurry either.` : ''}`,
      ch:[{t:'"The Host\'s outlawed, and your ledger with it. There\'s nobody left to read it."', check:['guile',14], go:'c7_claw_talk_ok', fail:'c7_claw_talk_fail'},
          {t:'Show him the order from the cellars.', req:()=>!!S.f.c6_orders, go:'c7_claw_orders'},
          {t:'The glove. Tuft, now.', req:()=>C7H.has('tuft') && C7H.leashed(), go:'c7_tuft_glove'},
          {t:'"Shields."', go:()=>startBattle('last_accounting', S.f.c7_vellWarned ? {drop:[3]} : {})},
          {t:'Kettle rolls a sharper along the quay.', tag:'uses 1 sharper', req:()=>C7H.has('kettle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('last_accounting', S.f.c7_vellWarned ? {drop:[3], pre:true} : {pre:true})},
          {t:'Not yet.'}]}),
    c7_claw_talk_ok:()=>({sp:'The grey cloak', fx:()=>{ S.f.c7_clawTalked=1; S.f.c7_clawDone=1; S.f.c7_clawGone=1; }, txt:
`"The Empress outlawed the Host this morning," you say. "You said so. Your ledger's a list of people she doesn't want back. You can draw a line under every entry in it and she'll never read one. She'll be busy reading Seven Cities."

You let that sit.

"You're not closing an entry. You're closing the book. There's nobody to hand it to."

He looks at you for as long as it takes a gull to cross the quay. Then down at the page. Then he closes the ledger, very gently, the way you'd close a door on a sleeping room.

"Another time," he says, from habit. And then, as if correcting a clerical error: "No. There isn't one, is there." He looks at the book in his hands. "I'll write it closed."

He goes along the Lakefront without hurrying. After a while the shapes by the fish-crates aren't there, and the green doorway is empty, and the only thing left on the step is a little dust where a clean boot turned.`,
      ch:[{t:'Let him go.'}]}),
    c7_claw_talk_fail:()=>({sp:'The grey cloak', txt:
`He smiles. It's the smile of a man writing something down.

"That's very good, Sergeant. I'll put it in." He does. "It doesn't change the sum."

The shapes by the fish-crates are moving.`,
      ch:[{t:'Show him the order from the cellars.', req:()=>!!S.f.c6_orders, go:'c7_claw_orders'},
          {t:'"Shields."', go:()=>startBattle('last_accounting', S.f.c7_vellWarned ? {drop:[3]} : {})},
          {t:'Kettle rolls a sharper along the quay.', tag:'uses 1 sharper', req:()=>C7H.has('kettle') && S.inv.sharper > 0, fx:()=>{ S.inv.sharper--; }, go:()=>startBattle('last_accounting', S.f.c7_vellWarned ? {drop:[3], pre:true} : {pre:true})}]}),
    c7_claw_orders:()=>({sp:'The grey cloak', fx:()=>{ S.f.c7_clawBought=1; S.f.c7_clawDone=1; S.f.c7_clawGone=1; if (C7H.has('kettle')) loy('kettle',1); }, txt:
`You take it out of your coat: the slip from the vault, last night, from inside the coat of a man who was setting acid to the wax in the gas mains under a district of forty thousand people. *Standing order. Destroy this.* A neat hand.

You hold it where he can read it and can't reach it. He reads it. He reads it twice, the way you read orders.

"Ah," he says.

It's the first thing you have ever heard him say that he didn't mean to.

"If this reaches the Host," you say, "or the Bridgeburners — "

"Yes." He knows the rest. A Claw order to fire the Bridgeburners' own munitions under the Gadrobi crossing, with Whiskeyjack's company in the hole beneath them. An army outlawed this morning that would dearly love one more reason. "It's in my hand," he says, which is the only thing he will ever tell you about himself.

Then he opens the ledger at the ribbon, and takes a pen from his sleeve, and, holding the book flat against the green door, draws one line, neatly, corner to corner, across the whole of a long page. He turns it round to show you. Then he closes it.

"Closed," he says. "Keep the paper, Sergeant. I would, in your place. I'd keep it the rest of my life."

He goes along the Lakefront without hurrying, and the shapes by the fish-crates go with him, and the green doorway is empty.

${C7H.has('kettle') ? `Kettle watches him go. "I stopped those timers," she says. "With my *hands*. Under his people. And he just — " She doesn't finish. She doesn't have to. She's grinning, and it's a terrible grin, and it's the best thing you've seen all morning.` : ''}`,
      ch:[{t:'Let him go.'}]}),
    c7_tuft_glove:()=>{ const hill = S.area === 'quorl_hill', gone = !!S.f.c7_clawGone, b = C7H.has('brisk');
      return {sp:'Tuft', fx:()=>{ S.f.c7_tuftCut=1; if (C7H.has('tuft')) loy('tuft',2); }, txt:
`"Tuft," you say. "Now."

She knows what you mean before you've said it. She's known since the garden. ${b ? `Brisk has the glove out of her belt already.` : `You take the glove out of your belt.`} A plain riding glove, left on a stone where the Adjunct's tent stood, with a red dust in its seams that won't brush out. For days Tuft wouldn't stand on the same side of a fire as it.

She comes and stands on the same side.

Her fingers are shaking so hard she can't get the pin out of the badge. Silver and enamel, a hand on a flame. ${S.f.c2_key === 'light' ? `She's worn it since the plain, for somebody she thought was dead.` : `She's carried it since the staff, and not worn it since, and it made no difference.`} ${!hill && !gone ? `Across the quay, the grey cloak has stopped writing.` : ''} ${C7H.has('ohl') ? `In the end it's Ohl who takes her hand and holds it still, and she lets him.` : `In the end you take her hand and hold it still, and she lets you.`}

"Hold it open," she says.

${b ? `Brisk holds it open.` : `You hold it open.`}

She drops the badge in.

It goes out like a candle under a cup. There isn't a sound. There's the absence of one: the absence of something you hadn't known you were hearing, a hum under everything, gone. Tuft makes a noise like someone coming up out of deep water, and folds at the knees, and ${b ? 'Brisk catches her' : 'you catch her'}; and she's shaking, and she's laughing, and she's crying, and she's nobody's.

"It's quiet," she says. "Oh, it's so *quiet*. I can't feel Meanas. I can't feel *anything*." She grips your sleeve. "I can't feel *him*."

${!hill && !gone ? `Across the quay, on the step by the green door, the grey cloak is looking down at his own hand, the way a man looks at his hand when something he was holding by a string has gone slack. He looks at it a long moment. Then he writes a line.` : `Somewhere ${hill ? 'west, in the city' : 'along the Lakefront'}, you're quite sure, a man in a grey cloak has stopped in the middle of a street and is looking down at his own hand, the way a man looks at his hand when something he was holding by a string has gone slack.`}`,
      ch:[{t:'Back to the grey cloak.', req:()=>!hill && !S.f.c7_clawDone, go:()=>talk(C7H.friend() ? 'c7_claw_offer' : 'c7_claw_close')},
          {t:'Let her sit a while.', req:()=>hill || !!S.f.c7_clawDone}]}; },
    c7_after_accounting:()=>({sp:'The end of the pier', scene:'lakefront_dawn', fx:()=>{ S.f.c7_clawFought=1; S.f.c7_clawDone=1; S.f.c7_clawGone=1; gain('clawpen'); }, txt:
`It's short and ugly and wet. Dock fights are; there's water on three sides and nowhere to go but in. ${S.f.c7_vellWarned ? `No quarrels come from the chandlery roof. Somebody on it has been had words with.` : `A quarrel from the chandlery roof takes a splinter the size of a hand out of a piling beside your head, and then another, and then ${C7H.has('kettle') ? 'Kettle' : C7H.has('ellis') ? 'Ellis' : 'somebody'} gets a sightline, and then no more.`} The hand-mage in the doorway goes down with shadow still coming off its fingers like smoke off a snuffed wick. The two with knives go into the lake, one and then the other, and don't come up. The Claw don't leave their dead where anybody can count them.

The grey cloak is the last.

He's at the end of the pier, where the planks give out over grey water, with blood coming through the grey at his side and the ledger still under his arm. He isn't looking at you. He's looking down at his boots.

They're wet. Lake-water and blood and fish-scale to the ankle. In all the months since the north quarter, in ash and rain and the mud of the tent lines, you have never once seen them anything but clean. He looks at them for a long moment, the way a man looks at a sum that won't come out.

Then he steps backward off the end of the pier.

He doesn't fall. He steps, as if there were one more plank. The lake takes him without a sound, ${S.f.c7_coin ? `the way it took Crokus's coin` : `the way it takes everything`}, and the rings go out across the grey water and flatten, and he doesn't come up. He's kept the rule for himself too.

The ledger is on the planks where it slipped from under his arm, open, with a steel pen lying in the gutter of the book.

${C7H.has('brisk') ? `Brisk looks at the water for a long time. "Claw bleeds," she says. "Same as anyone." She wipes her spear on her sleeve. "Slower. Somewhere else."` : ''}`,
      ch:[{t:'Read the page.', go:'c7_claw_ledger'}]}),
    c7_claw_ledger:()=>({sp:'A ledger bound in grey', txt:
`It's open at the ribbon. The hand is small, square, perfectly even, and you know it the way you'd know a voice.

*Fourth Squad, Seventh Company, marines. Sgt. {sgt}.*

Under it, a long page. The north quarter, and a satchel. ${S.f.c1_key === 'line' ? `A line of shields on the cadre row.` : `A tent held for three rounds.`} A wagon, ${S.f.c2_late ? 'a day late' : 'on time'}. ${S.f.c3_key === 'report' ? `A dye-shop, and forty silver, and a report.` : S.f.c3_lied ? `A dye-shop, and a count that was wrong.` : `A dye-shop, and a door walked out of.`} ${S.f.c4_key === 'shield' ? `A roof held for a Guild boy.` : `A step aside, on a roof.`} ${S.f.c5_key === 'through' ? `A hillside, and somebody let go.` : `A hillside, and somebody held.`} And beside the first line of all, small, in the margin, the way a clerk marks a column he means to come back to: *all five*.

At the foot of the page, the last line, in the same neat hand, the ink still bright:

*Entry closed by*

And nothing after *by*.`,
      ch:[{t:'Throw it in the lake.', fx:()=>{ S.f.c7_clawLedger='lake'; }, go:'c7_claw_ledger_end'},
          {t:'Keep it.', fx:()=>{ S.f.c7_clawLedger='kept'; }, go:'c7_claw_ledger_end'}]}),
    c7_claw_ledger_end:()=>({sp:'The end of the pier', txt: S.f.c7_clawLedger === 'lake' ?
`You close it, and weigh it in your hand, and throw it underarm off the end of the pier. It opens in the air. It floats a moment on the grey water, splayed, like a gull with a broken wing, and the pages darken, and then the lake has that too.

The pen you keep. You couldn't have said why. You put it in your coat, and nobody in the squad asks.` :
`You close it and put it in your pack, next to the pay ledger. Two ledgers now. One of them's honest.

The pen you put in your coat. Nobody in the squad asks. Nobody in the squad would write with it for money.`,
      ch:[{t:'The quay.', go:()=>startExplore()}]}),
    c7_claw_avoid:()=>{ const fr = C7H.friend(), tell = fr && C7H.pendingTell(); return {sp:'The green door', fx:()=>{ S.f.c7_clawAvoided=1; if (tell) S.f.c7_wjKnows='claw'; }, txt:
`You walk past him.

You don't look at him. The squad doesn't either; they close up round you without being told, ${C7H.has('brisk') ? `Brisk's shield-rim between him and you all the way, the way it was in the tent lines at the Pale,` : ''} and you go by the green door at a marching pace with the lake on your left and the man in the grey cloak on your right, close enough to smell the ink.

He lets you. That's the word for what he does.

"Sergeant," he says to your back, pleasantly. ${fr ? `"I'll take that as a no. I'll write it so."${tell ? ` A pause. "Whiskeyjack has a copy of your evening at the dye-shop, by the way. In my hand. It went up the road an hour ago. Madryn told you not this year. It's a new year somewhere."` : ''}` : `"The entry stays open, then. It'll keep. Entries do."`}${C7H.has('tuft') && C7H.leashed() ? ` And, lower: "Good morning, mage. I'll see you when you're called."` : ''}

You don't turn round. It's the hardest thing you've done all year.`,
      ch:[{t:'East, to the hill.', go:()=>{ startExplore('quorl_hill'); talk('c7_hill_arrive'); }}]}; },

    /* ---- Ellis: out of the grey ---- */
    c7_ellis_back:()=>({sp:'Ellis', fx:()=>{ S.f.c7_ellisSeen=1; }, txt:
`${C7H.has('kettle') ? `Kettle is at the alley mouth before you are. She's stopped there, one hand on the warehouse corner, and she isn't going any further, and she isn't breathing.` : `You go to the alley mouth.`}

She's standing just inside the shadow, where the dawn hasn't got to, with one hand flat on the warehouse wall as if she isn't sure of it.

Plains leathers. The bow. The glove. She's thinner. She's older; not years, something else, the way a coat is older after one bad winter than after ten good ones. There's grey in her hair, a streak of it back from the left temple, the colour of ash. And round her right wrist, knotted tight, two lengths of trip-cord.

She looks at you. Then at the squad, one after another. Counting. ${C7H.dead().length ? `She arrives at the number, and it's wrong, and she checks it, and it's still wrong. She doesn't ask. Not yet.` : `She arrives at the number and checks it.`}

"Sergeant," she says. Her voice is hoarse, as if she hasn't used it. "How long was I gone?"

"Four days."

She thinks about that. You watch her try it and find it doesn't fit.

"It was longer," she says.`,
      ch:[{t:'"Toc?"', go:'c7_ellis_back2'}]}),
    c7_ellis_back2:()=>({sp:'Ellis', txt:
`"I didn't find him."

Level. Exact. The report voice, the one she used on the plain for tracks. "It's grey in there, Sergeant. It goes on. There's a road in it, sometimes, and sometimes there isn't, and I walked the road when it was there. I found his tracks once. Only once. Going away."

She looks down at her wrist.

"I tied the ends to a stone on this side, before I went. Two lengths. Kettle never asked what for." Something moves at the corner of her mouth. "That's what for. A line back. When the road ran out, I followed it back."

"He's out there," she says. "He kept riding."

It was his line, on the plain, for his captain. It's hers now. She says it as if she's carried it in her mouth the whole way, like a stone to keep from being thirsty.

${C7H.has('kettle') ? `Kettle is staring at the cord. Her mouth is working and nothing is coming out of it, which for Kettle is a medical event.` : ''}

${C7H.has('ohl') ? `Ohl has the oilcloth half out of his coat. He hasn't opened it. He's looking at her the way he looks at a wound that's closed on its own, when he'd been sure it wouldn't.` : ''}

${C7H.dead().length ? `Then she looks along the squad again, slowly, the way she reads ground, and finds the ${C7H.dead().length > 1 ? 'gaps' : 'gap'}. "${C7H.names(C7H.dead())}," she says. It isn't a question. You tell her anyway: the alley, the otataral, last night. She listens the way she listened to Toc's orders, all the way to the end.${C7H.isDead('kettle') ? ` Then she looks down at the cord on her wrist, and doesn't say anything at all.` : ''}` : ''}`,
      ch:[{t:'"Fourth Squad. If you want it."', go:'c7_ellis_take'},
          {t:'"You don\'t owe us anything. Go where you like, Ellis."', go:'c7_ellis_let'}]}),
    c7_ellis_take:()=>({sp:'Ellis', fx:()=>{ recruit('ellis'); S.f.c7_ellisBack=1; loy('ellis',1); if (C7H.has('ohl')) S.f.c7_ohlEllis=1; }, txt:
`"Fourth Squad," she says, the way she said it on the plain beside a dead mare, trying the weight. It's heavier than it was. She seems to find that she can carry it.

She comes out of the shadow into the light.

${C7H.has('kettle') ? `Kettle gets to her first. She doesn't say anything. She takes Ellis's wrist in both hands and picks at the knot until it gives, and unwinds the two lengths of trip-cord, and coils them, very carefully, the way she'd coil a trip-line she meant to set, and puts them in her satchel. "Mine," she says, thickly. "You never said what for." "I'm saying now," says Ellis. "I know," says Kettle. "I *know*. Shut up."` : C7H.isDead('kettle') ? `Nobody unties the cord. There's nobody to give it back to. She leaves it on her wrist.` : `Nobody unties the cord. She leaves it on her wrist.`}

${C7H.has('ohl') ? `Ohl opens the oilcloth. At the bottom, under the last name, there are two spaces he has carried since the hills. He takes the charcoal stub and draws it through one of them, carefully, from end to end. "I've never been able to do that," he says. "Cross out a space." He looks at the other one, Toc's, for a long moment, and folds the oilcloth along its old creases and puts it away. "Some lists close from the other side," he says. "I said that. I didn't know it would be *true*."` : ''}

${C7H.has('brisk') ? `Brisk hasn't moved. "We don't leave people," she says. "You left."

"I came back," says Ellis.

"That's the half nobody says," says Brisk, and doesn't finish, and puts her hand on Ellis's shoulder, which she has never done to anyone, and takes it away again, and goes back to being a wall.` : ''}`,
      ch:[{t:'The quay.'}]}),
    c7_ellis_let:()=>({sp:'Ellis', fx:()=>{ S.f.c7_ellisLeft=1; }, txt:
`She looks at you for a long moment, the way she looked at the planks on the Gadrobi roofs, weighing what would hold.

"I'd like it in the ledger," she says, "that you asked. And that you didn't make me say no." A breath. "I'd have said no, Sergeant. I think. I'd have hated saying it."

She pulls her glove tight at the wrist, finger by finger.

You tell her about the horse: that it came back out of the hills riderless, on the captain's lead rein, and is standing in a stable at the Worry Gate with nobody to ride it. She listens with her head down.

"Then I'll go and see if it remembers me," she says.

${C7H.has('kettle') ? `Kettle holds out her hand for the cord. Ellis looks at it, and then shakes her head, very slightly. "Not yet," she says. "I might need a line back." Kettle closes her hand on nothing and nods.` : ''}

She goes along the quay, not fast, a scout's walk, and at the corner she lifts the gloved hand over her shoulder, once, not quite a salute: the way you'd lift a hand to someone on a dock as the ship goes out.`,
      ch:[{t:'The quay.'}]}),

    /* ---- Ellis: at the green door (she never joined) ---- */
    c7_ellis_door:()=>({sp:'Ellis', fx:()=>{ S.f.c7_ellisDoor=1; }, txt:
`She's on an upturned cask two doors down from the green door, with her bow across her knees and her back to the wall, where she can see the whole quay and nobody can see her hands. There's a cup by her boot that's gone cold. She's been here a while.

She sees you coming. She doesn't get up.

"Sergeant." She counts, the way everybody counts. "${C7H.Num(SQUAD().length)}." A small nod, as at a figure confirmed. "Toc left me at a garrison on the Adjunct's road. It was a bad one; he said it would be. I left it."

"I heard about him. In a Gadrobi tavern, from a Bridgeburner who didn't know who I was. A hole in the air, on a hill." Her face does nothing at all. "He'd have said he kept riding. That's the kind of thing he'd have said."

She looks along the quay at the green door, and the man on its step${S.f.c7_clawGone ? `, who isn't there any more` : `, who hasn't looked at her once`}.

"Somebody wrote my name in a book in that house, four years ago, and I've never known which way it's written. I've come to read it." A pause. "${S.f.c7_clawGone ? `The grey man's gone. That's either very good news or very bad, and I've been sitting on this cask trying to decide which.` : `He knows I'm here. He's decided I'm not worth a look. That's either very good news or very bad, and I've been sitting on this cask since the lamps went out trying to decide which.`}"

"I'm going in." She looks at you at last. "You can come, if you like. I'd — " She stops. "I'd rather not go in alone. I'd like that in the ledger."`,
      ch:[{t:'Go in with her.', go:'c7_ledger'},
          {t:'"Not yet, Ellis."'}]}),

    /* ---- the green door, and the ledger ---- */
    c7_green_door:()=>{ const inSq = C7H.has('ellis'), atDoor = !!S.f.c2_ellisRefused && !S.f.c7_ellisJoined && !S.f.c7_ellisWalked;
      if (S.f.c7_ledgerDone) return {sp:'The green door', txt:
`The green door is shut. The smoke from the counting-room chimney has stopped. Whatever was written in there has been read, or burned, or roped into a crate and carried away, and the house is only a wine-merchant's now, with bad wine.`, ch:[{t:'Leave it.'}]};
      if (inSq || atDoor) return {sp:'The green door', txt:
`A wine-merchant's, near the Gadrobi quarter. Flaking green paint. A brass knocker in the shape of a hand. Somebody inside is burning paper: you can smell it, and see the smoke going straight up from the counting-room chimney in the still air.

${!S.f.c7_clawGone ? `The man in the grey cloak is on the step. He moves his feet to let you by. He doesn't look up from his ledger. "Mind the step," he says.` : ''}

${inSq ? `Ellis stops with her hand an inch from the door. "I carried a letter here once," she says. "The man who took it looked at my hand, before it was burned, and said *pretty*, and wrote something down." She puts her gloved hand flat on the green paint. "I've wanted to know what for, for four years."` : `Ellis has come down off her cask and is standing at your shoulder. "Here," she says. "This is where names go."`}`,
        ch:[{t:'In.', go:'c7_ledger'},{t:'Not yet.'}]};
      return {sp:'The green door', txt:
`A wine-merchant's, near the Gadrobi quarter. Flaking green paint. A brass knocker in the shape of a hand. Somebody inside is burning paper; you can smell it, and see the smoke going straight up from the counting-room chimney in the still air.

${!S.f.c7_clawGone ? `"Nothing in there for you, Sergeant," says the man on the step, without looking up. He taps the book under his arm. "Your entry's out here. With me."` : `Whatever's written in there, none of it is anybody the Fourth has left to ask about.`}`,
        ch:[{t:'Leave it.'}]}; },
    c7_ledger:()=>({sp:'The counting-room', fx:()=>{ S.f.c7_ledgerIn=1; }, txt:
`Inside, a wine-merchant's front room: casks, a counter, the sour-sweet smell of must, and nobody behind the counter. Through a door at the back, a counting-room. And in the counting-room, a small fire in a grate, being fed one sheet at a time by a clerk in grey sleeves with ink to the second knuckle, who doesn't stop when you come in.

There are ledgers on every shelf. There are ledgers in a crate by the door, roped for carrying. There are ledgers on the floor by the grate, stacked, waiting their turn. The Claw is leaving Darujhistan. It's leaving tidily. It's burning what it can't carry.

${S.f.c3_ellisMsg ? `The clerk looks up. He's young; nineteen. Ellis stops in the doorway. "Hello," she says, and you know him then without ever having seen him: the boy from the Gadrobi well, who cried every night for a year in the yards at Genabaris and then one night stopped. He looks at her a long moment. He doesn't say *pretty*. He doesn't say anything. He feeds another sheet to the fire.` : `The clerk looks up at Ellis, and at her glove, and at the squad behind her, and goes back to the fire. Whatever he's been told to burn, nobody told him to stop you, and nobody told him not to.`}

"The G shelf," Ellis says, very quietly. "Genabaris." Her eyes go along the stack by the grate. "He's working through the Gs."`,
      ch:[{t:'Find it before he does.', check:['wits',13], go:'c7_ledger_ok', fail:'c7_ledger_fail'}]}),
    c7_ledger_ok:()=>({sp:'The counting-room', txt:
`You go through the stack by the grate with the clerk's hands working beside yours, book by book, and he doesn't stop you and doesn't help; and three from the bottom, in a book with *Genabaris, the river quarter* inked small and square on its spine, Ellis puts one gloved finger on a page and stops.

She doesn't read it at once. She holds it the way you'd hold a letter you've waited years for and aren't sure you want.

Then she reads it.`,
      ch:[{t:'Read it over her shoulder.', go:'c7_ledger_read'}]}),
    c7_ledger_fail:()=>({sp:'The counting-room', fx:()=>{ S.f.c7_ledgerBurnt=1; }, txt:
`You're too slow. You're going through the wrong stack; she's going through the right one; and the clerk, not hurrying, not looking, takes the next book off the pile by the grate and opens it and tears out a gathering of pages and lays them on the coals.

*Genabaris, the river quarter*, on the spine, small and square.

Ellis puts her hand into the fire.

Her gloved hand: the one she burned at the Pale pulling a courier out of a tent that was already gone. She puts it into the coals without a sound, and closes it, and pulls it out, and there's a page in it, curling, smoking, the edges gone to lace. She shakes it out. She shakes her hand out. She doesn't make a sound about either.

"I've done that before," she says. "It's easier the second time. That's a lie." She smooths what's left of the page on the counting-table with the side of her good hand.`,
      ch:[{t:'Read it over her shoulder.', go:'c7_ledger_read'}]}),
    c7_ledger_read:()=>{ const c = C7H.ledgerCase(), burnt = !!S.f.c7_ledgerBurnt, held = !!S.f.c5_ellisHeld && C7H.has('ellis');
      const l2 = S.f.c2_ellisRefused ? `*Released on the plain by T. the Younger. Not retained.*` : `*Released on the plain by T. the Younger. Attached, Fourth Squad, marines.* ${c === 'retained' || (c === 'lost' && S.f.c3_key === 'report') ? `*Retained. Useful through the Fourth.*` : `*Not retained.*`}`;
      return {sp:'Ellis', fx:()=>{ S.f.c7_ledger=c; S.f.c7_ledgerRead=1; if (held) S.f.c7_ellisSpoke=1; }, txt:
`${burnt ? `Most of it's gone. What's left is the inner margin, by the spine, where the fire couldn't get its fingers in:

*Ellis. Genab—*

and lower down, one word, or the end of one:

*—${c === 'lost' ? 'closed' : 'tained'}.*` : `*Ellis. Genabaris, the river quarter. Scout, six years. Hand burned, Pale, recovering a courier (deceased).*

${l2}${c === 'lost' ? `

*Lost, Gadrobi Hills, after T. the Younger. Entry closed.*` : ''}`}

And in the margin, in an older ink gone brown, in a different hand, one word: *pretty*.

${burnt ? (c === 'lost' ? `"*Closed*," she says. "That's me. Closed." She almost smiles. "They wrote me dead, neat, and the fire's had the rest and left me that." She looks at the grey at her temple in the dark glass of the window. "I don't feel closed."` : `Ellis looks at it a long time. "*Tained*," she says. "Retained. Or not retained." She turns the scorched page over, as if the rest of the word might be on the back. It isn't. "Six years. And the fire's had the one word that says which way it's written." And then she laughs, without any sound at all, the way she does, until she has to put her good hand flat on the table. "That's *funny*, Sergeant," she says. "Isn't it. Somebody tell me that's funny."`) :
  c === 'lost' ? `She reads it twice. "*Lost*," she says. "*Entry closed*." She touches the line with one gloved finger. "They wrote me dead. Four days ago. In ink." She looks at the grey at her temple in the dark glass of the window. "It was longer."` :
  c === 'retained' ? `She reads it twice. "*Retained*," she says. "*Useful through the Fourth*." She looks at you, and you know she's thinking of a dye-shop in the Daru District and a paper sealed with blue wax${S.f.c3_ellisMsg ? ` that she carried to you herself` : ''}. "Toc told me they were done with me. They were. And then you sat down at a table with blue hands, and they weren't." She says it without heat. That's the worst of it. "It says *useful*, Sergeant. They never once wrote *useful* about me when I was theirs."` :
  `She reads it twice. "*Not retained*," she says. Her voice is perfectly level. "They let go of me at the Pale. For the hand." She turns her gloved hand over on the table and looks at it. "Toc didn't cut me loose on the plain. He just told me what they'd already written down." A long breath. "*Recovering a courier*." Her face does nothing. "Recovering." That's all she'll ever say about the courier. It's more than she has ever said.`}

${held ? `Then she turns, and looks at you, and says one sentence: the first thing she has said to you since the hillside that wasn't an answer to an order. And it's the right one.

"${burnt ? `They wrote something here and the fire's had it, and on that hill you held on to me anyway, and I've been angry at the wrong one.` : c === 'retained' ? `They wrote *useful* where you'd have written *mine*, and on that hill you held on anyway, and I've been angry at the wrong one.` : `They let go of me for a burned hand, and you wouldn't let go of me for a hole in the world, and I've been angry at the wrong one.`}"` : ''}`,
        ch:[{t:'"Strike it out."', fx:()=>{ S.f.c7_ledgerAct='struck'; }, go:'c7_ledger_after'},
            {t:'"Give it to the fire."', fx:()=>{ S.f.c7_ledgerAct='burned'; }, go:'c7_ledger_after'},
            {t:'"It\'s your page, Ellis."', fx:()=>{ S.f.c7_ledgerAct='kept'; }, go:'c7_ledger_after'}]}; },
    c7_ledger_after:()=>({sp:'Ellis', fx:()=>{ S.f.c7_ledgerDone=1; if (C7H.has('ellis')) loy('ellis',1); }, txt:
`${S.f.c7_ledgerAct === 'struck' ? `She takes the clerk's pen out of his inkwell without asking, and he lets her, and she draws one line through the whole of it, the name and the lines and the word in the margin, neatly, from end to end, ${S.f.c7_ohlEllis ? `the way Ohl crossed out her space on the quay` : C7H.has('ohl') ? `the way Ohl draws his charcoal through a line` : `the way Ohl used to draw his charcoal through a line`}. Then she blots it. "Neat," she says. "They'd want it neat." She puts the pen back in the well.` : S.f.c7_ledgerAct === 'burned' ? `She holds the page over the grate a moment. Then she lets it go. It goes the way the others go: a curl, a flare, a brown ghost of a page, and nothing. "That's where it was going," she says. "I've only saved him the walk."` : `She looks at it a long time. Then she folds it, once and again, small, and pushes it into the cuff of her glove, against the burned hand. "I'll keep it," she says. "When I'm dead properly, somebody can send it back to them. Tell them it was late."`}

The clerk feeds another book to the fire. He hasn't said a word. As you go out, very quietly, to the grate, he says, "Good." You'll never know which of you he meant.`,
      ch:[{t:'Out onto the quay.', req:()=>!C7H.has('ellis'), go:'c7_ellis_walk'},
          {t:'Out onto the quay.', req:()=>C7H.has('ellis')}]}),
    c7_ellis_walk:()=>({sp:'Ellis', txt:
`Out on the quay the light has come all the way up. Ellis stands on the step of the green door with her face turned to it, like someone who's been a long time in a cellar.

"Well," she says. "That's that read."

She looks east along the Lakefront toward the Gadrobi road, and then at the Fourth, counting, and then at you.

"Where are you going, Sergeant?"`,
      ch:[{t:'"With the Fourth. Fourth Squad, if you want it."', go:'c7_ellis_join'},
          {t:'"Wherever you like, Ellis."', go:'c7_ellis_own'}]}),
    c7_ellis_join:()=>{ const took = S.f.c7_clawDeal === 'took'; return {sp:'Ellis', fx:()=>{ if (took) S.f.c7_ellisWalked=1; else { recruit('ellis'); S.f.c7_ellisJoined=1; loy('ellis',1); } }, txt: took ?
`She looks at you, and at the paper-shaped place in your coat where the grey cloak's pardon is.

"You took his paper," she says. "I've just read what they write about people like me." She shakes her head, very slightly. "I'd like it in the ledger that you asked. I'm saying no. It isn't personal. It's training."

She pulls her glove tight and goes along the quay, not fast, a scout's walk, and at the corner she lifts the gloved hand over her shoulder, once, and is gone.` :
`"Fourth Squad," she says, trying the weight. It's the first time anyone's offered it to her. On the plain, you said five was the number.

${C7H.has('ohl') ? `Behind you Ohl makes a small sound, the sound of a man who has just been told he'll get to look at a hand after all.` : ''}

${S.f.c7_ledgerBurnt ? `"Toc said the Claw was done with me. I'll never know if it was. I've decided that's the same thing."` : `"Toc said the Claw was done with me. It was. It's written down."`} She comes down off the step. "Somebody should have me who isn't."

She falls in at the end of the line, where a scout walks, and looks back once along the Fourth, and counts, and gets a number she hasn't had before, and checks it.`,
      ch:[{t:'The quay.'}]}; },
    c7_ellis_own:()=>({sp:'Ellis', fx:()=>{ S.f.c7_ellisWalked=1; }, txt:
`She nods, once. "I'd like it in the ledger that you asked." She pulls her glove tight at the wrist. "East, I think. There's a lot of plain. I know how to count it."

She goes along the quay, not fast, a scout's walk. At the corner she lifts the gloved hand over her shoulder, once, and is gone.

${C7H.has('ohl') ? `"I'd have liked to look at her hand," Ohl says, after a while. "That's all. It's the healer talking."${S.f.c2_tentSeen ? ` It's the same thing he said on the plain, word for word. He doesn't notice. You do.` : ''}` : ''}`,
      ch:[{t:'The quay.'}]}),

    /* ---- the Guild: Vell's debt, or Ocelot's grudge ---- */
    c7_vell:()=>{ const done = !!S.f.c7_clawDone; return {sp:'Vell', fx:()=>{ S.f.c7_vell=1; S.f.c7_vellWarned=1; }, txt:
`A young man in a journeyman's dark coat is sitting in the mouth of the east alley with his back to the wall and a coil of tarred rope over his shoulder. He's mostly healed. He moves like somebody who remembers exactly where each of the cuts was. He grins when he sees you. He's seventeen.

"Malazan." ${S.f.c3_falseName ? `Then, carefully, to get it right, he says the name off the headstone in Unta. You let him have it; it's the one this city has. "I remembered."` : `Then, carefully, to get it right: "{sgt}. I remembered."`}

${S.f.c6_guildPassed ? `"The terrace, last night," he says. "*Not tonight, Malazan, tonight you're furniture.*" The grin gets wider. "That was me. I asked for that. I told them which squad."` : S.f.c6_terraceFought ? `"The terrace, last night." The grin goes. "I heard. I'm sorry. They didn't know it was you, and when they knew, it was late." He looks at his hands. "The Guild's got a long memory. It's got a short temper too. Both at once, most nights."` : ''}

"I owe you. The Guild remembers. So." He lowers his voice. ${done ? `"There was a man on the chandlery roof across from the green door this morning, with a crossbow. The grey man's. The Guild had a word with him before the lamps were out. You'd never have known. That's how it's meant to work."` : `"There's a man on the chandlery roof across from the green door with a crossbow, and he's been there since before the lamps went out, and he's the grey man's." A small pause. "Was. The Guild's had a word with him. He isn't on the roof any more."`}

"His name was Hollin," Vell says. "Out of Unta. Like you. I thought you'd want it. You look like somebody who keeps names."

He stands, and hitches the rope up on his shoulder.

"That's the debt. I'm told it's paid." He looks at you. "I don't feel it's paid. I'm going to go on not feeling it for a while, if that's all right."`,
      ch:[{t:'"It\'s all right, Vell."'}]}; },
    c7_veteran:()=>{ const st = S.f.c6_steppedIn ? 'settled' : S.f.c6_terraceFought ? 'lapsed' : 'open';
      return {sp:'An old man mending a net', fx:()=>{ S.f.c7_veteran=1; S.f.c7_grudge=st; if (st === 'settled') S.f.c7_vellWarned=1; }, txt:
`You know him. The older man from the Daru roof, grey at the temples, a Guild blade across his knees among the dead the night Kalam's candles went out; the man in the alley afterward with his hand pressed to his ribs, asking his question again. He's sitting on the step of the east alley mending a fishing net, badly, which is how you know it isn't his net.

"Malazan." He doesn't look up. "The clan-master sent me to see you off. He didn't say which way off."

${st === 'settled' ? `He ties a knot and looks at it and doesn't like it. "You stood in front of the Adjunct last night, for a Daru boy with a coin. Word gets about. The Guild had people in that street." A long pause. "That's an answer. It isn't the same answer as the roof. It'll do." He puts the net down. "There's a crossbow on the chandlery roof across the quay. It isn't ours. It isn't there any more, either."` : st === 'lapsed' ? `"You killed more of ours on Simtal's terrace," he says. "Three. Four. I've stopped counting. Somebody in this city has to." He ties a knot. "The Guild's not buying. I told you that in the alley. It's still not." He looks up at last. "But the Guild's burying this morning, a great many, and it hasn't the hands to hate you as well. Go before it finds them."` : `"The Guild's burying this morning," he says. "A great many. Not you. It hasn't the hands to hate you and grieve at the same time." He ties a knot and looks at it and doesn't like it. "It isn't settled. It's put down. That's a different thing. Go, Malazan, before somebody picks it up."`}`,
      ch:[{t:'Leave him to the net.'}]}; },

    /* ---- exit east ---- */
    c7_to_hill:()=> (S.f.c5_ellisThrough && !S.f.c7_ellisBack && !S.f.c7_ellisLeft && !C7H.isDead('ellis')) ? {sp:'The Gadrobi road', txt:
`The quay runs east to the Gadrobi District and the road out. ${C7H.has('kettle') ? `Kettle won't come. She's standing where the quay turns, looking back at the mouth of the alley between the warehouses. "There's somebody in the dark, Sergeant," she says. "I'm not going anywhere till we've looked."` : `Behind you, in the mouth of an alley between two warehouses, somebody is standing in the dark and hasn't come out. You're not leaving that behind you.`}`,
      ch:[{t:'Not yet.'}]} : (!S.f.c7_clawDone && !S.f.c7_clawAvoided) ? {sp:'The Gadrobi road', txt:
`The quay runs east to the Gadrobi District and the road out, and the hill, and noon.

The man in the grey cloak is still on the step by the green door. He hasn't moved. He's watching you look at the road, with the book under his arm and his boots clean, and you understand that he'll write it down if you walk past him, and that he'll write it down either way.`,
      ch:[{t:'Not yet.'},
          {t:'Walk past him. East.', go:'c7_claw_avoid'}]} : {sp:'The Gadrobi road', txt:
`East along the quay, and up through the Gadrobi District, and out through the gate you came in by. The hill is an hour on. The quorls leave at noon.`,
      ch:[{t:'East, to the hill.', go:()=>{ startExplore('quorl_hill'); talk('c7_hill_arrive'); }},
          {t:'Not yet.'}]},

    /* ---- the quorl hill ---- */
    c7_hill_arrive:()=>{ const pend = C7H.pendingTell(); return {sp:'The Gadrobi road · a hill east of the city', scene:'quorl_hill', fx:()=>{ S.f.c7_hill=1; }, txt:
`East along the quay and out through the Worry Gate you came in by from the hills, through Worrytown, past the tanneries and the goat-pens and the shrine to a god whose face somebody chiselled off with care. The road climbs into brown hills. An hour out, from the top of a rise, you see them.

Quorls.

They're on the grass of a long brown hill just north of the road, a dozen of them and more, folded down like dragonflies the size of barges: long black bodies, lacquer-bright; four wings apiece, each longer than a man, clear as oiled paper and veined in black, twitching in the sun. Black Moranth stand among them in black chitin plate, helms with no faces, not moving. Bridgeburners are going up the hill in twos and threes with packs, and being strapped in behind the riders, and not looking down.

${C7H.has('kettle') ? `Kettle stops dead in the road. She has checked the sky for quorls every day since Nathilog, the way you'd check for weather. Now they're on the ground in front of her, on the grass, close enough to touch. "Oh," she says. "Oh, they're *here*."` : ''}

A litter by the biggest of them, and on it a man with a leg splinted out straight and a sword across his knees. A dark small man beside him, cross-legged in the grass. A captain with two swords, looking at nothing. And down on the road east, where it bends round the foot of the hill, a Rhivi party with pack-ponies, and a woman on a grey mare with a bundle in good red wool held against her chest, and a rider at their head sitting his horse like a man who has decided to be patient.

On a barrow-stone at the top of the hill, a raven the size of a dog is watching all of it and laughing, very quietly, to itself.

${pend ? `Behind you on the road, a big soft-looking man with a healer's bag is coming up the hill at a steady walk with a word to carry, and he isn't hurrying, and he isn't slowing down.` : ''}`,
      ch:[{t:'Get to Whiskeyjack before Mallet does.', req:()=>C7H.pendingTell(), go:'c7_hill_tell'},
          {t:'Let Mallet carry it.', req:()=>C7H.pendingTell(), go:'c7_hill_word'},
          {t:'Up the hill.', req:()=>!C7H.pendingTell(), go:()=>startExplore()}]}; },
    c7_hill_tell:()=>({sp:'Whiskeyjack', scene:'quorl_hill', fx:()=>{ S.f.c7_wjKnows='told'; S.f.c7_toldHill=1; if (C7H.has('brisk')) loy('brisk',1); if (C7H.has('ellis')) loy('ellis',1); }, txt:
`You go up the hill at something close to a run, which a sergeant never does in front of Bridgeburners, and you find you don't care.

He sees you coming. He sees Mallet behind you. He lifts one hand, very slightly, and Mallet stops ten paces off and stands there with his bag and his word, and waits.

You tell him. In order, without anything in it that isn't so. The paper, the dye-shop, the tea, the blue hands, the purse. What she asked. What you gave her.

He listens with his eyes on the city, small and blue behind you on the rim of its lake. When you've finished he doesn't say anything for a while. Then he looks past you at Mallet.

"Mallet. Kalam's word."

"Sir."

"I've had it. From the right mouth." He looks back at you. "Go and see to your bag."

Mallet goes. Whiskeyjack looks at you a long moment more.

"You told me yourself," he says. "Late. But before anybody could." A pause. "Kalam bet me you'd get up the hill first. I'll have to pay him, and he's on a boat." Something happens at the corner of his mouth that isn't a smile, and he doesn't let it become one. "Good."`,
      ch:[{t:'"Sir."', go:'c7_wj'}]}),
    c7_hill_word:()=>({sp:'The quorl hill', scene:'quorl_hill', fx:()=>{ S.f.c7_wjKnows='kalam'; }, txt:
`You let him pass you. He does it without looking at you, the way a man walks past a grave he isn't going to stop at.

He goes up to the litter. He bends and says something, low, not long. Whiskeyjack listens. He doesn't look at you. He doesn't look at you for a long time.

Then he nods, once, to Mallet, and Mallet goes to see to his bag; and Whiskeyjack goes on looking at the city, small and blue behind you on the rim of its lake, and the hill is very quiet, and the quorls' wings tick in the sun.

${C7H.has('brisk') ? `Brisk doesn't say anything. She's looking at you. She's always looking at you, at the moment it matters.` : ''}`,
      ch:[{t:'Up the hill.', go:()=>startExplore()}]}),
    c7_wj:()=>{ const f = S.f, d = C7H.dead(), r = f.wjRegard || 0; return {sp:'Whiskeyjack', scene:'quorl_hill', fx:()=>{ S.f.c7_wjHill=1; }, txt:
`They've set the litter down in the lee of the biggest quorl, out of the wind of its wings. He's got the sword across his knees and the splinted leg out straight and a Moranth water-skin by his hand that he hasn't touched. Quick Ben is sitting in the grass beside him. Neither of them is talking.

"Sergeant." He counts. ${d.length ? `He knows the number. He counts it anyway, because you don't stop counting just because the number's changed.` : `${C7H.Num(SQUAD().length)}. He checks it. Something in his shoulders lets go by the width of a hair, and it's the last time you'll see it.`}

${f.c7_wjKnows === 'claw' ? `There's a paper on his knee, folded in three, in a neat hand. He doesn't hold it up. He doesn't need to. "I read it," he says. "In his hand. Not yours." He lets that sit a long time. "I'd have taken it from you. I'd have taken nearly anything from you. Not from him."` : f.c7_wjKnows === 'kalam' ? `"Kalam says somebody in the Fourth sat at a table with blue hands," he says. "It was you. You didn't tell me." A long pause. "I'm not going to ask why. It's always the same why. I've had it from better sergeants than you, and worse, and it was the same every time."` : f.c7_wjKnows === 'told' && !f.c7_toldHill ? `"You told me yourself," he says. "On the bench. I've thought about it all morning, and it's still the part I remember."` : f.c3_wjTold ? `"You told me about the dye-shop the night it happened," he says. "In order. I've never forgotten it. Nobody tells me anything in order."` : ''}

${f.c6_key === 'bridgeburners' ? `"You held the garden with us," he says. "I saw it, until I stopped seeing things. Hedge says you held it after that too. Hedge doesn't say that about anybody."` : f.c6_key === 'cellars' ? `"You sat on my crates," he says, "while the city tried to eat itself. Hedge says you scraped acid out of his wax with the Claw still breathing on it. He says it the way he talks about women." A pause. "Forty of Hedge's and twelve Moranth cussers under the Gadrobi crossing, and the Gadrobi District still standing. That's yours."` : f.c6_key === 'alley' ? (f.c6_steppedIn ? `"You went after the Adjunct," he says. "And you stood between her and a boy with a coin." He looks at his leg. "I'd have given a great deal to have been there. I'd have given this."` : `"You went after the Adjunct," he says, "and stood aside when it came to it, and let it go the way it went." He doesn't say whether that was right. "Paran says you didn't say anything to him after. That's worth more to him than you'd think."`) : ''}

${r > 0 ? `"You've been worth the trouble, Sergeant. I've said that about three squads in twenty years."` : r < 0 ? `"You've been trouble. I've said that about most squads."` : ''}

He looks up at the quorls, at the Moranth standing among them like black posts, at the Bridgeburners being strapped in.

"Noon," he says. "Where's the Fourth going, Sergeant?"`,
      ch:[{t:'Tell him.', go:'c7_choice'},
          {t:'"Not yet, sir. There are people on this hill I owe."', go:()=>startExplore()}]}; },
    c7_choice:()=>({sp:'Four roads', scene:'quorl_hill', txt:
`The quorls are shifting in the grass, their wings trembling like held breath. The first of them goes up while you're standing there: a lurch, a roar like a hundred sails filling, the grass flattened all round in a ring, and then it's a black shape against the blue, climbing, north, with two Bridgeburners strapped behind its rider not looking down.

Four roads off this hill. Every one of them goes somewhere you can't come back from.

*North, with the Host.* ${C7H.wjTrust() ? `Whiskeyjack will take the Fourth as his.` : `Whiskeyjack won't take the Fourth as his. The Host will, as marines.`} ${C7H.roadWho('outlaw')}

*Home, to the Empire.* ${S.f.c7_clawDeal === 'took' ? `The grey cloak's pardon is in your coat.` : `No pardon. Walk to Genabaris and report as a loyal squad of an outlawed army, and see what they make of you.`} ${C7H.roadWho('empire')}

*Stay, in Darujhistan.* ${S.f.c7_kruppeOffer ? `Kruppe has arranged things.` : `Kruppe will have arranged things. He always has.`} The Empire's ledger will say deserters. ${C7H.roadWho('city')}

*Stand the Fourth down.* No Fourth. Each of them chooses. ${C7H.roadWho('disband')}

Whiskeyjack waits. He's good at it. He's had twenty years of practice.`,
      ch:[{t:'North, with the Host. Outlaws.', fx:()=>{ S.f.c7_key='outlaw'; S.f.c7_follow=C7H.followMap('outlaw'); }, go:'c7_road_outlaw'},
          {t:'Home, to the Empire.', fx:()=>{ S.f.c7_key='empire'; S.f.c7_follow=C7H.followMap('empire'); }, go:'c7_road_empire'},
          {t:'Stay. Darujhistan.', fx:()=>{ S.f.c7_key='city'; S.f.c7_follow=C7H.followMap('city'); }, go:'c7_road_city'},
          {t:'Stand the Fourth down.', fx:()=>{ S.f.c7_key='disband'; S.f.c7_follow=C7H.followMap('disband'); }, go:'c7_road_disband'},
          {t:'Not yet.', go:()=>startExplore()}]}),
    c7_road_outlaw:()=>({sp:'Whiskeyjack', scene:'quorl_hill', txt: C7H.wjTrust() ?
`"North," you say.

"Good." He says it the way he said it at the Gadrobi crossing: a whole sentence. "Fourth Squad, attached. Paran's short. Report to him at the other end and he'll pretend he wanted you, and after a while he will." He looks at you. "You'll fly with us."

${S.f.c7_clawDeal === 'took' ? `He doesn't know what's in your coat. Quick Ben, in the grass beside him, looks at your coat for exactly one breath, and then at the sky, and says nothing, and goes on saying it.` : ''}` :
`"North," you say.

He's quiet a long time.

"The Host has marines," he says at last. "You'll fly with the baggage, and report to the Host's quartermaster at the other end, and go where the Host puts you. You're Dujek's." ${S.f.c7_wjKnows === 'claw' ? `His hand has gone flat on the folded paper on his knee. ` : ''}"You're not mine."

"I'll take them."

It's Paran, from the next quorl, with Lorn's sword across his back and a Moranth strapping him in. He isn't looking at either of you.

"You'll take who you're given, Captain," says Whiskeyjack.

"Then give me them. I'm short."

Whiskeyjack looks at Paran for a long moment. Then at you. "They're yours, Captain," he says. "You'll answer for them." And he doesn't look at you again.`,
      ch:[{t:'The squad.', go:'c7_close'}]}),
    c7_road_empire:()=>({sp:'Whiskeyjack', scene:'quorl_hill', txt:
`"Home," you say.

He doesn't say anything for a while. He looks west past you: at the city and the lake and the long brown country beyond, where the road goes round to Genabaris and the sea.

"Home," he says. He says it without weight, and that's the weight. "It's a long road to Genabaris. There'll be a ship at the end of it. ${S.f.c7_clawDeal === 'took' ? `You'll have a paper that gets you on it.` : `Report to whoever's left in the garrison as a loyal squad of an outlawed army, and see what they make of you. I'd like to see their faces. I won't.`}"

${S.f.c7_clawDeal === 'took' ? `He doesn't know about the paper. Quick Ben, in the grass beside him, looks at your coat for exactly one breath, and then at the sky.` : ''}

"Nobody on this hill will stop you. I'm not the Empire any more. I don't get to." He shifts the leg, and his mouth goes thin, and goes back. "You brought my crate across the plain. You'll get where you're going. You always have."`,
      ch:[{t:'The squad.', go:'c7_close'}]}),
    c7_road_city:()=>({sp:'Whiskeyjack', scene:'quorl_hill', txt:
`"We're staying," you say. "Darujhistan."

Something happens at the corner of his mouth, and he lets it.

"Kruppe," he says. It isn't a question.

"Kruppe."

"Kruppe arranges everything." He looks at the city on its lake, small and blue and loud, even from here. "The city that was going to be ours. I sat on a bucket in the middle of it for the best part of a month waiting to blow it up." A pause. "It'll have you. It'll have anybody who pays for their wine."

"The Empire's ledger will say deserters."

"The Empire's ledger is going to be very busy this year," says Whiskeyjack. "I wouldn't worry about the Fourth's line in it." He looks at you. "Keep the gate, Sergeant. Whichever gate. It's the one job I never got to do here."`,
      ch:[{t:'The squad.', go:'c7_close'}]}),
    c7_road_disband:()=>({sp:'Whiskeyjack', scene:'quorl_hill', txt:
`"I'm standing them down," you say.

He looks at you for a long time.

"You can't," he says. "Not in the Host's books. There's no form for it."

"There's no Host's books, sir. As of this morning."

"No," says Whiskeyjack. "There isn't." He looks at the quorls, going up now one after another in their roaring rings of flattened grass. "Then say the words. The ones for the end of a soldier's service. You know them. You've heard them said over enough holes."

${C7H.has('brisk') ? `Brisk has come to attention. She doesn't know she's done it.` : ''}

You say them. *Stood down, with the thanks of the Empire.* The Empire has no thanks this morning. You give them yours instead, and it's the same words, and it isn't.`,
      ch:[{t:'The squad.', go:'c7_close'}]}),

    /* ---- the people on the hill ---- */
    c7_qb_hill:()=>({sp:'Quick Ben', fx:()=>{ S.f.c7_qbHill=1; }, txt:
`He's sitting in the grass beside the litter with his hands round his knees, watching the Moranth strap Bridgeburners in. He's smiling again: at something just past your shoulder, where he keeps the joke. You find you're glad to see it.

"Sergeant." Mildly. "You look like a man with a decision in his pocket. Don't show it to me. I'll only tell you what's wrong with it."

${C7H.has('tuft') && C7H.leashed() ? `His eyes go to Tuft, and the smile goes away. "Still open," he says, very quietly. ${S.f.c7_qb ? `"I told you. Before noon."` : `"Close it before noon, Sergeant."`}` : ''}

${S.f.c4_key === 'shield' ? `"The second one stopped," he says after a while, to the sky. "On the roof. I still don't know why. I've decided not to. It's a skill."` : S.f.c4_key === 'aside' ? `"Somebody on that mountain had your faces," he says after a while, to the empty sky where the mountain was. "It's gone west now, with your faces in it. I'd think of that as good news."` : ''}

He goes back to watching the quorls. The conversation is over. It was over before it started; he just let you have it.`,
      ch:[{t:'Leave him.'}]}),
    c7_paran_hill:()=>({sp:'Captain Paran', fx:()=>{ S.f.c7_paranHill=1; }, txt:
`He's standing by a quorl with his hands behind his back, watching a Moranth rider check a strap that doesn't need checking. Lorn's sword is across his back now, in a plain scabbard somebody has found for it. His own is at his hip.

"Sergeant." He doesn't turn. "I'm short of soldiers. I said so on the pier. I'll say it again, in case it matters to whatever you're deciding." A pause. "If Whiskeyjack won't have you, I will. I don't care what anybody's written about you in any book. I've been written about. It isn't catching."`,
      ch:[{t:'"Captain. Toc asked me to tell you something."', req:()=>!S.f.c6_paranToc && !S.f.c7_paranToc, go:'c7_paran_toc'},
          {t:'"Captain. Toc\'s horse."', req:()=>C7H.has('ellis') && !S.f.c7_tocHorse, go:'c7_paran_horse'},
          {t:'Leave him.'}]}),
    c7_quorl:()=>({sp:'A quorl', fx:()=>{ S.f.c7_quorl=1; }, txt:
`Up close it's bigger than a barge and smells of struck flint and hot tin. The body is as long as three horses nose to tail, black, lacquer-bright, jointed; the head is mostly eyes, a great faceted dome of them, each catching the sun separately, so that looking at it is like looking at a hundred small suns in a black mirror. Four wings folded along its back, clear as oiled paper and veined in black. They twitch. They never quite stop twitching.

It's looking at you. You can't tell how you know.

${C7H.has('kettle') ? `Kettle has her hand out, flat, an inch from its side, not touching. "They're *warm*," she whispers, as if it were a secret. "Chub said they were warm. I never believed him." She touches it. It lets her.` : `The Moranth rider by its head doesn't turn. After a while, very slightly, the quorl's wings go still.`}`,
      ch:[{t:'Leave it.'}]}),
    c7_moranth:()=>({sp:'A Black Moranth', fx:()=>{ S.f.c7_moranth=1; }, txt:
`A Black Moranth, standing by a quorl's head with a crossbow across its chest. Black chitin plate from crown to heel, overlapping like the shell of a beetle, with a sheen on it like oil on water. A full helm with no eye-slits, no mouth, no face at all. Nobody in the Host has ever seen a Moranth face, and the Bridgeburners have a wager on it twenty years old that nobody expects to settle.

It turns the helm toward you. A click, from somewhere inside. A hiss. Another click.

You wait. It waits. It's much better at it.

${C7H.has('kettle') ? `"It said good morning," says Kettle. "Sort of. It said *the morning is*. It's a thing they say." She clicks back at it, badly. The helm turns to her, and stays turned, and then, very slowly, turns away. "I think I said something about its mother," Kettle says.` : `Then it turns the helm back to the north, and that's the conversation.`}`,
      ch:[{t:'Leave it.'}]}),

    /* ---- Ch'kess: Kettle's debt, and the rolls of the Host ---- */
    c7_qm:()=>{ const k = C7H.has('kettle'), kd = C7H.isDead('kettle'), settled = !!S.f.c7_debt;
      return {sp:'Ch\'kess · Black Moranth quartermaster', fx:()=>{ S.f.c7_qmMet=1; if (kd && !S.f.c7_debt) S.f.c7_debt='closed'; }, txt: k && settled ?
`Ch'kess is counting. It turns its helm to Kettle once, and clicks. Kettle clicks back, much better than she does it to anybody else. It's a very short conversation, and at the end of it ${S.f.c7_debt === 'owed' ? `the debt is still owed, and both of them know it, and neither of them seems to mind as much as they did.` : `they're square, and both of them know it, and Kettle touches the chit at her throat.`}` :
`The quartermaster is standing by the last quorl in the row with a slate in one chitin hand and a stylus in the other, checking straps and water-skins and bundles of quarrels and writing each one down in marks you can't read. Black plate like the others. A helm like the others. And yet you'd know it among them, the way you'd know a clerk in a crowd of soldiers: it's the only one of them that's counting.

${k ? `It turns its helm toward Kettle. A click. A hiss. A click.

Kettle says it back. Two clicks and a hiss, perfectly, the way nobody human can: its name, you realise. "Ch'kess."

"Kettle," says the Moranth, in Malazan. It sounds like a word said by a lobster. "Nathilog."

Kettle has gone white under the soot. She's checked the sky for this every day since Nathilog, and now it's standing in front of her on the grass, with a slate.

"Twelve went into the crate at Nathilog," says Ch'kess. Each word set down separately, like a counter on a board. "Eleven came out in hands that signed. One came out in the hand that was short three fingers. He did not sign. He is dead." Click. "The debt walked to you." Click. "And the measure."

Kettle takes something out of her kit. A spoon: black horn, small, with a notch in the bowl. The spoon she will not explain. She holds it out on her palm.

"Chub gave me both," she says. "He said *keep it for the one that matters, girl, you'll know it*. He said the spoon was for the powder." Her voice cracks. "He never said the spoon was *yours*."` : kd ? `It turns its helm toward the Fourth and counts. You can see it count: the helm moves, one of you, the next, the next. It doesn't find what it's counting for.

"The Falari," it says, in a Malazan that sounds like a word said by a lobster. "The one who counts."

You tell it.

The helm stays on you a long time. Click. Hiss. "Then the debt is closed," says the Moranth. "We do not collect from the dead." Click. "We carry them." It writes one mark on its slate and shows it to you, as if you could read it. "Here. With the others we carry."` : `It doesn't look at you. It's counting. You get the impression that if you stood here until the quorls left, it would finish counting first, and then look at you, and it wouldn't be worth the wait.`}`,
        ch:[{t:'Kettle. Give it back.', req:()=>k && !S.f.c7_debt && S.inv.cusser > 0, go:'c7_debt_paid'},
            {t:'Kettle. Tell him where it went.', req:()=>k && !S.f.c7_debt && (!!S.f.c5_cusserUsed || S.inv.cusser <= 0), go:'c7_debt_spent'},
            {t:'"Not yet."', req:()=>k && !S.f.c7_debt && S.inv.cusser > 0, go:'c7_debt_owed'},
            {t:'The rolls of the Host.', req:()=>!S.f.c7_rolls, go:'c7_rolls'},
            {t:'Leave it to its counting.'}]}; },
    c7_debt_paid:()=>({sp:'Ch\'kess', fx:()=>{ S.inv.cusser = Math.max(0, S.inv.cusser - 1); S.f.c7_debt='paid'; gain('moranthchit'); if (C7H.has('kettle')) loy('kettle',1); }, txt:
`Kettle puts her hand in the satchel and takes out a cusser. Round, clay-grey, the Moranth seal on it in black wax. ${S.f.c5_cusserUsed ? `Not Chub's. Chub's went up at the barrow in a fountain of turf and bone. ${S.f.c6_hedgeCusser ? (S.f.c1_cusserSold ? `This one's Gerrun, off Quartermaster Pell's wagon at the Pale.` : `This one came out of a Host crate somewhere along the road, the way most of them do.`) : `This one's Hedge's, from the vault.`} "A cusser's a cusser," she says, to the helm. "You count *cussers*. Not names."` : `"Maud," she says. "I've been calling her Maud. She was Chub's." Her hand is shaking. "She was yours."`}

She holds it out in both hands, the way you'd hand somebody a baby.

Ch'kess takes it. It turns it over once in its chitin fingers, and looks at the seal, and clicks. "Twelve," it says.

Then it holds out its other hand, and on the palm is a small curved scrap of black chitin, cut from a moult, with one notch filed in its edge.

"Square," says Ch'kess. Click. "Keep the measure. A measure is owed to the one who measured true."

Kettle takes the chit. She looks at it. She looks at the spoon. She looks at the Moranth.

"I'm *light*," she says, to you, wonderingly. "Sergeant. I've never been square with anybody in my *life*."`,
      ch:[{t:'The rolls of the Host.', req:()=>!S.f.c7_rolls, go:'c7_rolls'},
          {t:'Leave them to it.'}]}),
    c7_debt_spent:()=>({sp:'Ch\'kess', fx:()=>{ S.f.c7_debt='spent'; gain('moranthchit'); if (C7H.has('kettle')) loy('kettle',1); }, txt:
`"I haven't got it," says Kettle. "I threw it."

The helm waits.

${S.f.c5_cusserUsed ? `"The Gadrobi Hills. A barrow ridge. Three dead men who wouldn't stay down and a Jaghut ward like a rock with ice in it." She swallows. "Whiskeyjack said throw it at anything you like. So I did. It went up like the whole world had been holding its breath for two years."` : S.f.c6_hedgeCusser ? `"I gave it to Hedge," she says. "On a lawn, at the Fete, with a tyrant coming up out of the ground. He threw it." She lifts her chin. "He threw it *beautifully*."` : `"At something that needed it," she says. "I was there. I counted. It went off." She lifts her chin. "That's what they're for."`}

"Was it the one that mattered?" says Ch'kess.

${S.f.c5_cusserUsed ? `Kettle opens her mouth. Shuts it. "No," she says. Then: "Yes." Then, very small: "I don't know. I think I just couldn't carry it any more."` : S.f.c6_hedgeCusser ? `"Yes," says Kettle, at once. "Chub said I'd know. I knew. It just wasn't mine to throw."` : `Kettle opens her mouth. Shuts it. "I don't know," she says. "I threw it at what was in front of me. That's what Chub did with everything."`}

Click. Hiss. A long click.

"The one that mattered," says the Moranth, "is the one that is thrown." It writes a mark on its slate. "Spent. Spent is square." And it holds out a small curved scrap of black chitin, with one notch filed in its edge. "Keep the measure. A measure is owed to the one who measured true."

Kettle takes the chit and holds it a long time.

"It was *beautiful*, though," she says to it, very quietly. "Wasn't it."`,
      ch:[{t:'The rolls of the Host.', req:()=>!S.f.c7_rolls, go:'c7_rolls'},
          {t:'Leave them to it.'}]}),
    c7_debt_owed:()=>({sp:'Ch\'kess', fx:()=>{ S.f.c7_debt='owed'; }, txt:
`"Not yet," says Kettle.

She has her hand on the satchel flap, holding it shut.

"I've still got one. I know it's yours. I *know*." She can't look at the helm. "There's still — it might still matter. For something. Chub said I'd know." A breath. "I don't know yet."

The helm regards her for a long time.

"Owed," says Ch'kess. Click. "Owed is a thing that is. We carry it. You carry it." It writes a mark on its slate. "It is lighter carried by two."

It goes back to its counting. Kettle stands there with the spoon in her hand.`,
      ch:[{t:'The rolls of the Host.', req:()=>!S.f.c7_rolls, go:'c7_rolls'},
          {t:'Leave them to it.'}]}),
    c7_rolls:()=>{ const d = C7H.dead(); return {sp:'The rolls of the Host', fx:()=>{ S.f.c7_rolls=1; S.f.c7_tav='alive'; if (d.length) S.f.c7_rolled=1; }, txt:
`Ch'kess takes out a roll of something like vellum, wound tight on a black spindle as thick as your wrist, and unrolls a length of it along the quorl's flank. Names. Thousands. A tiny upright Malazan hand, perfectly even, a Moranth's copy of a Malazan clerk's, column after column, regiment by regiment.

"The living of the Host," it says.

${C7H.has('brisk') ? `Brisk comes. She doesn't hurry. She reads the way she counts rations, with her finger, down the columns, not skipping. *Second Army. Fourth Regiment.* Down, and down, and her finger stops.

*Tav, of Cawn. Fourth Regiment. Living.*

She doesn't say anything. She doesn't move. Her finger stays on the line, as if the name might get up and walk off the vellum if she took it away.

"Living," says Ch'kess, helpfully. Click.

"Yes," says Brisk. "I can read."` : C7H.isDead('brisk') ? `You read it yourself. *Second Army. Fourth Regiment.* Down the column, not skipping.

*Tav, of Cawn. Fourth Regiment. Living.*

You stand there a while with your finger on it. She'd have stood here. She'd have read it with her finger, not skipping, the way she counted rations.` : `You read down the long even columns anyway. You don't know what you're looking for. It seems wrong not to look.`}

${d.length ? `"And the other roll," says Ch'kess, and doesn't unroll it. "The dead of the Host. We carry both. The dead are heavier." Its helm turns to you. "You have names."

You give it ${d.length > 1 ? 'the names' : 'the name'}. ${C7H.names(d)}. It writes ${d.length > 1 ? 'them' : 'it'} at the foot of the other roll in the tiny even hand, where the ink is still wet from other names, and blows on them, which you would not have thought a Moranth could do.` : ''}`,
      ch:[{t:'Brisk. The letter.', req:()=>C7H.has('brisk') && !S.f.c7_letter, go:'c7_letter'},
          {t:'Her letter.', req:()=>C7H.isDead('brisk') && !S.f.c7_letter, go:'c7_letter_sgt'},
          {t:'Leave it to its counting.'}]}; },
    c7_letter:()=>({sp:'Brisk', fx:()=>{ S.f.c7_letter='brisk'; if (C7H.has('brisk')) loy('brisk',1); }, txt:
`She takes it out of her gorget. It has been there three years, against her chest under the scale, and it's soft as cloth now and the seal is worn nearly flat. ${S.f.c1_pits ? `She looks at it the way she looked at the pits at the Pale.

*If I open it now it means something*, she said, on the burial field. It does. It means he's alive.` : `She looks at it for a long time. She was always going to open it when she found him. It means he's alive.`}

She breaks the seal with her thumb.

She reads it standing up, by the quorl, with the Moranth counting beside her and the Bridgeburners going up into the sky in roaring rings of grass; and her face does nothing at all, and then it does.

${C7H.letter()}

Brisk laughs.

It comes out of her all at once, a big ugly bark of a laugh that makes the nearest Moranth turn its helm; and then it isn't a laugh, and then it is again, both at once, and she puts the back of her wrist against her mouth and stands there with the letter in her other hand, shaking, and doesn't let anybody see her face, which is what the shield's for, except she hasn't got the shield up.

"Four coppers," she says into her wrist. "The *bastard*."

${S.f.c6_steppedIn || S.f.c6_key === 'bridgeburners' || S.f.c4_key === 'shield' ? `And then, when she can: "Don't stand in front of things." She looks at the shield on her back, at the rim where she kept a bit of the bend. "Too late, Tav."` : ''}`,
      ch:[{t:'Leave her to it.'}]}),
    c7_letter_sgt:()=>({sp:'Brisk\'s letter', fx:()=>{ S.f.c7_letter='sgt'; }, txt:
`It's in your coat, where it's been since the alley: soft as cloth, three years old, the seal worn nearly flat from riding against her chest under the scale. It still has the shape of her in it, a little. A curve.

${S.f.c1_pits ? `*If I open it now it means something*, she said, on the burial field at the Pale. ` : ''}She never opened it. She was going to open it when she found him.

He's found. She isn't here.`,
      ch:[{t:'Open it.', fx:()=>{ S.f.c7_letterAct='opened'; }, go:'c7_letter_sgt2'},
          {t:'Give it to the Moranth, for Tav.', fx:()=>{ S.f.c7_letterAct='sent'; }, go:'c7_letter_sgt2'},
          {t:'Keep it sealed. Carry it to him yourself.', fx:()=>{ S.f.c7_letterAct='carried'; }, go:'c7_letter_sgt2'}]}),
    c7_letter_sgt2:()=>({sp:'Brisk\'s letter', txt: S.f.c7_letterAct === 'opened' ?
`You break the seal with your thumb.

${C7H.letter()}

You read it twice. *Don't stand in front of things. I know you. You'll stand in front of things.*

She stood in front of things. It's what she was for.

You fold it along its old creases and put it back in your coat, and after a while you find you're holding your hand over the place, the way she used to.` : S.f.c7_letterAct === 'sent' ?
`You hold it out to Ch'kess. "Tav, of Cawn. Fourth Regiment. It's from him. It was to her." You don't know how to explain the rest. You don't need to. "He should have it back."

The helm regards the letter. Click. "We carry everything," says the Moranth. It takes the letter in its chitin fingers, very carefully, the way ${C7H.has('kettle') ? 'Kettle carries' : 'Kettle used to carry'} a cusser, and puts it in a case at its hip, and makes a mark on its slate. "It will be carried."

Somewhere north, in a few days, a big man at a cook-fire is going to be handed his own letter, three years old, with the seal unbroken. He'll know what that means. Everybody in the Second knows what that means.` :
`You put it back in your coat, sealed. It isn't yours to open. It wasn't hers either, in the end. It was his, and it's going back to him the way it came, by hand.

You'll find him. The Host isn't that big. You've found smaller things in bigger places.`,
      ch:[{t:'Leave it to its counting.'}]}),

    /* ---- the Rhivi road: Sethand, the bundle, Tuft's promise ---- */
    c7_seth:()=>({sp:'Sethand · Rhivi', fx:()=>{ S.f.c7_seth=1; if (S.f.c2_outSeth) S.f.c7_sethDebt=1; }, txt:
`He's sitting his horse on the road at the foot of the hill with the Rhivi party strung out behind him eastward: riders, pack-ponies, a boy with a horn bow, and a woman on a grey mare with a bundle in good red wool held against her chest.

He's been watching you come down the hill for as long as you've been coming. His face does nothing. It does nothing very deliberately.

"Malazan." The voice the Untan docks use for *tide*. "You are on a hill. We are on a road. It has always been this way between us."

${S.f.c2_outFought ? `He doesn't move his horse to let you nearer. "There is Rhivi blood on the grass by the fourth camp," he says. "I have not forgotten it because the morning is fine. I am telling you so you do not think I have."` : S.f.c2_key === 'light' ? `"The Mhybe said you might live," he says. "You have. She will be pleased, and not say so."` : `"You kept your road on the plain," he says, "and your road in the hills. You are good at roads, for a people who fly."`}

${S.f.c2_outSeth ? `"You owe me a thing you will not be able to pay. I told you so on the plain. I have decided what it is."

He looks at the woman on the grey mare, and the bundle, and back at you.

"You will not say what you have seen on this road. To your Empress. To your grey man with the clean boots. To your children, if soldiers have them. It cannot be paid, because it is never finished." A pause. "That is the kind of debt the Rhivi like best."` : ''}

${S.f.c5_sethSat ? `His eyes go to your wrist, to the horse's knuckle-bone on its plait of hair, with the blue bead. He looks at it a long moment. He doesn't say anything about it. He said it once.` : ''}`,
      ch:[{t:'The bundle.', go:'c7_bundle'},
          {t:'Leave him to the road.'}]}),
    c7_bundle:()=>{ const t = C7H.has('tuft'), lsh = t && C7H.leashed(), wall = !!S.f.c2_outFought, kr = !!S.f.c3_kruppe; return {sp:'The road east', fx:()=>{ S.f.c7_tattersail=1; }, txt:
`${S.f.c2_outFought ? `The Rhivi won't let you near. A rider moves his horse between you and the grey mare, not threatening, simply there, the way a wall is there. You see the bundle past his shoulder: red wool, bound with plaited hair in three places, and a woman's hand flat on top of it.` : `The woman on the grey mare looks down at you without expression. She has one hand flat on the bundle in her arms, the way she had it on the ridge in the Gadrobi Hills, and she doesn't take it away. The good red Rhivi wool, bound with plaited hair in three places.`}

${t ? `${lsh ? `Tuft has come down the hill behind you. She stops twenty paces off, in the grass at the side of the road, and comes no nearer.

"No closer," she says. "Not with this on me." Her hand is over her collar. "Not with him looking."` : wall ? `Tuft has come down the hill behind you. The rider doesn't move his horse for her either. She stands at its shoulder and looks past him at the bundle, and after a while, without anybody saying anything, he lets her look.` : `Tuft has come down the hill behind you. ${C7H.tuft() === 'glove' ? `She walks all the way to the grey mare's shoulder. Nothing in her pulls away from anything now. Meanas is quiet in her; there's nothing in her the bundle need be afraid of, or she of it.` : `She walks to the grey mare's shoulder, slowly, the way you'd walk up to a horse that might shy, and stops there.`}`}

${S.f.c3_askedTuft ? `"I promised," she says. "At the Phoenix. That when I knew, you'd be the first." She doesn't take her eyes off the bundle. "You're the first."` : kr ? `"Kruppe said a thing at the door of the Phoenix," she says. "I never told you what it meant." She doesn't take her eyes off the bundle. "I'm telling you first."` : `"I've never told anybody this," she says. She doesn't take her eyes off the bundle. "You're the first."`}

"It's her. Tattersail." Very steady. "She burned on the plain with Bellurdan, and the Rhivi carried something out of the fire, and it's this. She's in there. She'll grow too fast. She'll be a woman again sooner than any child should, and she'll *remember*." A breath. "${kr ? 'Kruppe knew. ' : ''}The Mhybe knows. Sethand knows, and he'll never say it, and he'll make you promise not to either."

${S.f.c2_key === 'light' ? `"I wore my badge across the plain for her," Tuft says. "It was the High Mage's all along. I was wearing his eye for her." ${lsh ? `Her hand is still over her collar. "I still am. That's why I can't go near."` : `She touches her collar. "I'm not any more."`}` : ''}

"She's not gone. ${kr ? `That's what he meant, at the door. ` : ''}That's what I couldn't say, because if I said it I'd have to believe it." She lets out a breath. "I believe it."

The bundle moves. A small hand comes out of the red wool, a baby's hand, and the fingers open and close on the morning air, on nothing. ${lsh ? `Tuft doesn't move. Twenty paces off, she closes her own hand, on nothing, at the same moment.` : wall ? `Past the rider's shoulder, Tuft closes her own hand on nothing at the same moment.` : `Tuft puts one finger into it. The hand closes on it, hard, the way babies' hands do, as if they'd been waiting.`}

Up on the hill, Paran has turned. He's looking down at the road: at the Rhivi, at the woman on the grey mare, at the bundle. He has the face of a man who has heard his name called in a crowd and can't see who called it. He doesn't come down. He doesn't know why he's looking.` :
`"Ha!"

It's the raven, from its barrow-stone at the top of the hill, loud enough that the grey mare flicks an ear.

"The little soldiers have come to see the baby! Do you know who it is? No? My lord knows. The Mhybe knows. The fat man in the red waistcoat knows. Your little mage knew." A cracked, delighted laugh. "She burned on the plain, the pretty cadre witch, and the Rhivi carried her out of the fire in a blanket, and here she is, going home the long way round, and she will grow up much too fast and remember *everything*. Oh, it is so very *Rhivi*."

None of the Rhivi look up at it. They have decided, collectively and without discussion, that there is no raven.

Tattersail. ${S.f.c3_askedTuft ? `Kruppe said it at the door of the Phoenix, and Tuft went white, and promised to explain, and never got the chance.` : kr ? `Kruppe said it at the door of the Phoenix, and Tuft went white, and never said why.` : `Tuft knew. She never said.`} You look at the bundle a long time. A small hand comes out of the red wool and opens and closes on the morning air.`}`,
        ch:[{t:'Ohl.', req:()=>C7H.has('ohl') && S.f.c2_key === 'light' && !S.f.c7_ohlTat, go:'c7_ohl_cross'},
            {t:'Ohl\'s list.', req:()=>C7H.isDead('ohl') && S.f.c2_key === 'light' && !S.f.c7_ohlTat, go:'c7_ohl_cross'},
            {t:'The glove. Tuft, now.', req:()=>C7H.has('tuft') && C7H.leashed(), go:'c7_tuft_glove'},
            {t:'Let them go.'}]}; },
    c7_ohl_cross:()=>({sp:C7H.has('ohl') ? 'Ohl' : 'Ohl\'s list', fx:()=>{ S.f.c7_ohlTat=1; S.f.listAdds = (S.f.listAdds || 0) - 1; S.f.c7_listAdj = (S.f.c7_listAdj || 0) - 1; if (C7H.has('ohl')) loy('ohl',1); }, txt: C7H.has('ohl') ?
`Ohl has the oilcloth out. He finds her without looking, the way he said he could find any of them in the dark.

*Tattersail. Cadre. Two hundred and twelve.*

He looks at it for a long time. Then at the bundle. Then at the charcoal stub in his fingers.

"Nobody's dead until I know where they went," he says. "That's a rule. I made it in the hills." He draws the charcoal through her name, once, carefully, from end to end. "I know where she went. East."

${S.f.c4_key === 'shield' ? `"That's twice," he says. "Vell on the roof, and now her." He folds the oilcloth along its old creases. "I'm getting a taste for it. At my age. It's indecent."` : `"Twenty-two years," he says, "and I've never crossed off a name." He folds the oilcloth along its old creases. "It's very pleasant. I'd forgotten anything could be."`}` :
`It's in your pack, where it's been since the alley: the oilcloth, and the charcoal stub, and the old creases. You find her without looking. He wrote her in the dark on the plain, and the letters are small and careful.

*Tattersail. Cadre. Two hundred and twelve.*

*Nobody's dead until I know where they went.* He made that rule in the hills. He'd want it kept.

You draw the charcoal through her name, once, from end to end. It isn't your list. You do it the way he would have: carefully. Then you fold it along the creases he made, and put it away, and find your hand is shaking, and let it.`,
      ch:[{t:'Let them go.'}]}),
    c7_rhivi:()=>({sp:'A Rhivi rider', txt:
`A boy with a horn bow, fifteen or sixteen, sitting a pony at the back of the party. ${S.f.c5_outrider ? `The outrider from the ridge in the Gadrobi Hills, whose cousin the Adjunct killed on the plain.` : `He has the look of somebody the plain started young and is finishing fast.`}

${S.f.c2_outFought ? `He looks at the badge on your kit. "Fourth," he says. He knows the word. Somebody taught it to him, and not kindly. He turns his pony east and doesn't say anything else.` : `"Malazan," he says, in the Malazan he learned from people shouting it. Then, carefully, as if he has been practising: "Go well." ${S.f.c5_outrider ? `A pause. "She is dead. The woman with the sword. I hear it." He looks at you. "Good."` : ''}`}`,
      ch:[{t:'Leave him to the road.'}]}),
    c7_crone:()=>({sp:'Crone · Great Raven', fx:()=>{ S.f.c7_crone=1; }, txt:
`It's on the barrow-stone at the top of the hill, the one the Moranth have landed round without touching. The size of a dog, and greyer at the throat than it was on the ridge in the hills. It watches you come up the way a merchant watches a customer who has finally, after long haggling, brought enough money.

"Ha!" It opens its beak and laughs. "Little soldiers! On a hill! *Deciding* things!"

${S.f.c2_croneSaw ? `"Sergeant {sgt}. I remember the name. I told you I would. Ravens outlive everybody, and we are *so* good at remembering what you were called."` : `"Crone, little soldiers. I told you on the plain. You have forgotten; soldiers do."`}

It settles its feathers.

"My lord has gone west with his mountain," it says, "and told me to tell nobody anything, and so of course I have come to tell *you*." It draws itself up on the stone, enormous and ridiculous, and its voice goes deep and grave and not at all its own: "*The small ones may go.*"

It cackles. "That is what he said. Five words. I have flown all the way back from the Spawn to deliver five words to a squad of marines on a hill, and they are the kindest five words my lord has said to anybody in a thousand years, and he will not remember saying them by tomorrow." It cocks its head. ${S.f.c5_crone ? `"I told you, on the ridge. *He will not care.* He didn't. I keep my promises. It is the only vice I have left."` : `"I keep my promises. It is the only vice I have left."`}

${C7H.has('tuft') && C7H.tuft() === 'dark' ? `Its eye finds Tuft, in the Andii cloak that doesn't take the light. "And the little mage who went cold on the roof," it says, more quietly. "My lord remembers her. He is sorry about it. He is sorry about most things he remembers." A pause. "He did her a courtesy. He does not do those twice. Keep it."` : ''}`,
      ch:[{t:'Leave it to its laughing.'}]}),
    c7_hedge:()=>({sp:'Hedge · sapper', fx:()=>{ S.f.c7_hedge=1; }, txt: C7H.has('kettle') ?
`He's being strapped in behind a Moranth rider with a cap on the back of his head and an onion in one fist, eating it like an apple, and he's got a satchel in his lap he isn't letting the Moranth near.

"Falari!" He waves the onion. "Did you throw it?"

${S.f.c7_debt === 'paid' ? `"I gave one back," says Kettle. "To the Moranth. Ch'kess. We're square."

"Gave it *back*?" Hedge stares at her with the onion halfway to his mouth. "Hood's teeth. First sapper in history." He shakes his head, slowly, with something like awe. "Don't tell Fid. He'll want to try it."` : S.f.c6_hedgeCusser ? `"You gave it me back," says Kettle. "On the lawn."

"I *know*." He's delighted all over again. "Best cusser I ever threw, and it was mine, and you carried it to the hills and back and handed it over like a borrowed spoon." He points the onion at her. "Chub'd have wept. I nearly did. It was the onion."` : S.f.c5_cusserUsed ? `"At a barrow," says Kettle.

"I *heard*." He's delighted. "Wights and a Jaghut rock. Fid told me. Fid said it didn't matter." He points the onion at her. "It went off. That's what matters. Everything else is priests."` : S.inv.cusser > 0 ? `"No," says Kettle.

"No?" He looks at her with enormous pity and respect. "Carried it all over Genabackis, and never once — " He shakes his head. "You've gone Fiddler. It's catching. Don't let it get into the blood."` : `"All of them," says Kettle. "In the end."

"*Good* girl." He beams at her with the whole of his mouth, gaps and all.`}

The Moranth rider clicks. Hedge clicks back, worse than Kettle does. "It says sit still," Hedge translates. "It always says sit still. I've never once sat still on one of these, and I've never once fallen off." He squints at you. "What are you lot, then? Coming, or staying, or what are you, *priests*?"` :
`He's being strapped in behind a Moranth rider with a satchel in his lap he won't let anybody near. He looks along the Fourth, counting, the way everybody does, and stops.

"The Falari," he says.

You tell him.

He sits there a long time with an onion in his fist, not eating it. "I gave her a cusser," he says at last. "In the vault. Told her not to name it." He puts the onion away. "I hope she named it. I hope she named it something awful."`,
      ch:[{t:'Leave him to the Moranth.'}]}),
    c7_trotts:()=>({sp:'Trotts', txt:
`He's standing by a quorl with his arms folded, as he stood at the stakes in the Gadrobi crossing, as he has presumably stood everywhere since the world was made. The Moranth are working round him like water round a rock. He does not look at you.

${C7H.has('brisk') ? `Brisk stops in front of him. They regard each other: two walls meeting on a hill. Trotts, very slowly, bares his teeth. Every one of them.

Brisk bares hers back.

Nobody in the Fourth has ever seen Brisk bare her teeth. Trotts looks at them for a long moment, and then nods, once, as if a question had been answered that he has been asked a great many times. Brisk walks on. "*Him*," she says to you, with enormous satisfaction, "I'll miss."` : C7H.isDead('brisk') ? `He looks along the Fourth, slowly, the way a wall would look if a wall could, and doesn't find the other wall. Then he looks at you. Very slowly, he pulls one of the little bones out of the knots in his hair and holds it out.

You take it. He folds his arms again. That's all. It's a great deal, from Trotts.` : `He bares his teeth at you. You're not sure what it means. You decide it means well.`}`,
      ch:[{t:'Leave him.'}]}),
    c7_hill_west:()=>({sp:'The road west', txt:
`West, down the road, the city: blue, small, loud even from here, on the rim of its lake, under a sky with nothing in it. Everything you're taking with you is on this hill.`,
      ch:[{t:'Not yet.'}]}),

    /* ---- the close: the squad's last round ---- */
    c7_close:()=>{ const k = S.f.c7_key || 'outlaw', stay = SQUAD().filter(id => id !== 'sgt' && !C7H.follows(id, k)); return {sp:'The quorl hill · noon', scene:'quorl_hill', txt:
`${k === 'outlaw' ? `The Moranth are strapping the last of the Bridgeburners in. Behind you a quorl has its wings down in the grass, waiting, with a rider on it who has not once turned his faceless helm your way and is waiting all the same.` : k === 'disband' ? `The words are said. They're only words. They're the right ones. The quorls go on going up around you in their roaring rings, and the Fourth stands in the grass with nothing to stand in a line for.` : `The quorls are going up around you in their roaring rings of flattened grass, one after another, north, and not one of them is yours.`}

The Fourth sits for a moment in the lee of the hill before the road, because it's the last moment anyone is going to get. ${k !== 'disband' && stay.length ? `${C7H.names(stay)} won't be coming. ${stay.length === 1 ? C7H.pr(stay[0]).She + ' knows it' : 'They know it'}. You know it. Nobody has said it yet.` : ''}

${SQUAD().length > 1 ? `You could talk to any of them. It's the hour for it.` : `There's nobody to talk to. There's the hill, and the grass, and you.`}`,
      ch:[{t:'Brisk.', req:()=>C7H.has('brisk') && !S.f.c7_closeBrisk, fx:()=>{ S.f.c7_closeBrisk=1; }, go:'c7_close_brisk'},
          {t:'Kettle.', req:()=>C7H.has('kettle') && !S.f.c7_closeKettle, fx:()=>{ S.f.c7_closeKettle=1; }, go:'c7_close_kettle'},
          {t:'Tuft.', req:()=>C7H.has('tuft') && !S.f.c7_closeTuft, fx:()=>{ S.f.c7_closeTuft=1; }, go:'c7_close_tuft'},
          {t:'Ohl.', req:()=>C7H.has('ohl') && !S.f.c7_closeOhl, fx:()=>{ S.f.c7_closeOhl=1; }, go:'c7_close_ohl'},
          {t:'Ellis.', req:()=>C7H.has('ellis') && !S.f.c7_closeEllis, fx:()=>{ S.f.c7_closeEllis=1; }, go:'c7_close_ellis'},
          {t:'The last of it.', go:'c7_close_end'}]}; },
    c7_close_brisk:()=>{ const k = S.f.c7_key || 'outlaw', fol = C7H.follows('brisk', k), read = S.f.c7_letter === 'brisk'; return {sp:'Brisk', scene:'quorl_hill', txt:
`${k === 'disband' ? `She's already standing. She hands you the ration ledger, closed. "The count's on the last page," she says. "It's right."

She looks north. "I'm going to him. Tav." A pause. "We don't leave people. I know. I'm not leaving you. I'm going to him. It's a different direction, that's all."

She salutes, which she doesn't have to do any more, and means it, which she always did.` : k === 'outlaw' && fol ? `She's sitting with her shield across her knees and the ration ledger closed on top of it${read ? `, and the letter open on top of that, weighted with a stone` : ''}.

"North," she says. "Where Tav is." She looks at the quorls. "I'll have to be strapped to one of those."

"You will."

"I'll stand where you put me, Sergeant. Same as always." She runs her thumb along the shield rim. "Even on that."` : k === 'outlaw' ? `She's standing, not sitting, with her shield on her back. "North," she says. "Not with the Fourth. To the Fourth Regiment. To Tav." She looks at you. "I asked Paran for the transfer. He signed it on his knee. He didn't ask why. He's learning."

She doesn't salute. She nods. "Sergeant." It's the whole conversation, and for once it isn't enough, and she knows it isn't, and she goes.` : fol && k === 'empire' ? `She's sitting with her shield across her knees, looking north.

"He's alive," she says, before you can speak. "He's alive, and he's north, and I'm going west." She says it the way she'd read out a ration count. "I've been working out if that makes sense. It doesn't." She looks at you. "You asked. I'm coming. That's what *we don't leave people* means, I think. I think it means the ones in front of you."` : fol ? `"The Phoenix," she says. "The door. Kruppe said." She looks at the city, small and blue on its lake. "I've stood in worse doors." A pause. "I'll write to him. Tav. The Moranth carry everything." ${read ? `Something almost happens to her mouth. "I'll put four coppers at the bottom of every one."` : ''}` : `She's standing with her shield on her back. "No," she says, before you've asked. "He's north. Three years I've looked for him. I'm not ${k === 'city' ? 'staying in a city' : 'walking the other way'} now he's found."

She comes to attention, and salutes, and it's correct in every particular. "Sergeant." And she goes up the hill toward the quorls, and doesn't look back, because Brisk never looks back. It's what the shield's for.`}`,
      ch:[{t:'Back to the squad.', go:'c7_close'}]}; },
    c7_close_kettle:()=>{ const k = S.f.c7_key || 'outlaw', fol = C7H.follows('kettle', k), sq = C7H.square(); return {sp:'Kettle', scene:'quorl_hill', txt:
`${k === 'disband' ? `"The Moranth," she says. ${sq ? `"I'm square. I'm going anyway. They count, Sergeant. They count *everything*. I've never met anybody who counts like I do."` : `"I owe them. I'm going to go and owe them properly, where they can see."`}

"You kept pointing me at things," she says. "And I kept making them stop being things." Her eyes are very bright. "That's love, in the sapper trade. I told you that the first week. I'm telling you again so you'll remember I told you."` : k === 'outlaw' && fol ? `She's standing by the waiting quorl with her hand flat on its side, the way you'd put a hand on a horse's neck. It's warm. She keeps being surprised that it's warm.

"I'm going to name it," she says. "Don't tell the Moranth." ${sq ? `She touches the chit at her throat. "I'm square with them. I can name what I like."` : `"I owe them. I'm going to name it anyway. They can put it on the bill."`}` : k === 'outlaw' ? `"I'm going with Ch'kess," she says. "Not with the Fourth. With the munitions." She doesn't look at you. "It isn't the debt. Or it is. I don't know. They count, Sergeant. I've never met anybody who counts like I do."` : fol && k === 'empire' ? `She's looking at the sky. "No quorls over the sea," she says. "I asked Ch'kess. He clicked at me. I think it meant no." She puts her hand on the satchel. "${S.inv.cusser > 0 ? `I've still got one. Boats and munitions: never. Fiddler said.` : `Nothing in it. Good. Boats and munitions: never. Fiddler said.`} I'm telling you so you'll remember I told you."` : fol ? `"A city sitting on gas," she says, with a new and terrible tenderness. "The *whole* place, Sergeant." She looks at you. "Somebody should stay and keep an eye on Hedge's eggs, under the crossing. They're asleep. They should stay asleep." A pause. "I'll sing to them."` : `${sq ? `"I'm going with the Moranth," she says.` : `"I can't," she says. "I owe them. They're right *there*."`} She won't look at you. "Owed is lighter carried by two, he said. ${sq ? `I'm square, and I want to carry something anyway. I don't know what else I'm for.` : `I'm going to go and carry my half where he can see it.`}"`}`,
      ch:[{t:'Back to the squad.', go:'c7_close'}]}; },
    c7_close_tuft:()=>{ const k = S.f.c7_key || 'outlaw', fol = C7H.follows('tuft', k), lsh = C7H.leashed(), st = lsh ? 'kept' : C7H.tuft(); return {sp:'Tuft', scene:'quorl_hill', txt:
`${(k === 'disband' || !fol) && !(k === 'empire' && lsh) ? (lsh ? `"West," she says. "To him." Her hand is on her collar. "If he's looking out of me, I'll give him something to look at that isn't her. I'll walk into his tent at Genabaris with a letter that says nothing and stand where he says and keep my eyes open, and she'll be a thousand leagues east growing up where he can't see."

She takes the hand away. "That's the last thing I can do for her. It's a good one."` : `"East," she says. "With the Rhivi. With her." She looks down at the road, at the woman on the grey mare. ${k === 'disband' ? `"Sethand says I may. He said it once."` : S.f.c7_tattersail ? `"${S.f.c3_askedTuft ? 'I kept my promise. ' : ''}You were the first to know. Now I'd like to be there for every day after that, for as long as it takes her to grow up and remember."` : `"There's a child in that red wool I'd like to watch grow up. Ask me why, one day. I'll tell you."`}`) : k === 'empire' && lsh ? `She's standing. "He's called," she says. She takes her hand off her collar and looks at it. "I'm going home to the staff. With a letter that says nothing, like last time." She tries to smile. "It was always going to be him or the glove. It wasn't the glove."` : k === 'outlaw' ? (lsh ? `She's sitting with her hand over her collar. "He'll come north with us," she says. "The High Mage. In here." She doesn't take the hand away. "I'll know when he's looking. I'll sit with my back to the command tent when he is."` : `She's sitting with the Deck in her lap, not drawing. "North," she says. "Where the cadre was." ${st === 'glove' ? `She turns her hand over. Nothing curls round the fingers. "I'm nobody's. I'll be nobody's in the Host. I didn't know you could be."` : st === 'shadow' ? `She touches the grey at her temple. "Something will follow us north under the ground. It'll be polite about it."` : st === 'dark' ? `She pulls the Andii cloak closer. "The house went west with the mountain. I miss the window." ${C7H.has('ohl') ? `She almost laughs. "Don't tell Ohl."` : `She almost laughs, and then doesn't, because there's no Ohl left not to tell.`}` : ''}`) : k === 'empire' ? `"Home," she says. "Where the High Mage is." She almost smiles. ${st === 'glove' ? `"He can't find me any more. I could stand in his tent and he'd look through me."` : st === 'shadow' ? `"He'll find somebody's thumb on me. I'd like to see his face."` : st === 'dark' ? `"He'll find Kurald Galain looked at me once and didn't forget. I think that frightens him. I hope so."` : `"He'll find me. I'll find out what he wants."`}` : `"Baruk has a door only I can see," she says. "Kruppe says." She almost laughs. "I'm going to sit beside it and read the Deck for nobody."`}`,
      ch:[{t:'Back to the squad.', go:'c7_close'}]}; },
    c7_close_ohl:()=>{ const k = S.f.c7_key || 'outlaw', fol = C7H.follows('ohl', k), d = C7H.dead(); return {sp:'Ohl', scene:'quorl_hill', txt:
`${k === 'disband' ? (C7H.tuftEast('disband') ? `"East," he says. "With the child. With Tuft." He looks down at the road. "Somebody has to argue with Hood for her, and I'm old, and I've got the time.${C7H.tuft() === 'shadow' ? ` And something's got a thumb on her, and I'd like to be standing next to her when it presses.` : ''}"` : `"North," he says. "Where the wounded will be. There'll be a great many." He doesn't apologise. He never has.`) : k === 'outlaw' && fol ? `He has a cup of tea going cold on his knee, made on a Moranth fire, which he says is the worst fire he has ever made tea on and will not stop describing. ${S.f.c7_askedOhl ? `"Dujek has work for me," he says. "He said. More work than Hood's got time for." He drinks the tea, finally, and makes the face. "I'll keep losing slowly. It's an order. I've decided to obey one before I die."` : `"There'll be work, north," he says. "There always is, where Dujek goes." He drinks the tea, finally, and makes the face.`}` : !fol ? `"North," he says. "To the Host's hospital tents. Not to the Fourth." He folds the oilcloth. "I'm old, Sergeant. I go where the wounded are. There will be a great many, north."` : k === 'empire' ? `"Seven Cities," he says, as if tasting it. "They're saying it will rise within the year. Ehrlitan's in Seven Cities." He turns the cup. "I'll go home with you, Sergeant, to an Empire that's about to be at war with where I was born." A breath. "The list will get longer. I'll be there to write it. That's all a list is."` : `"Jeth Arrow's room," he says. "At the Phoenix, by the stair, where the lamp doesn't reach." He's smiling, which is rare. "I said I didn't know how to write a room. I've decided I'll live in it. Then it'll write itself."`}

"${C7H.Num(C7H.lc())}," he says, of the list, because you haven't asked. ${d.length ? `"${C7H.names(d)}. I meant to die before I wrote one of you. I didn't manage it."` : `"None of you. I intend to die first. I'm more confident of it than I was."`}${S.f.c7_ohlTat ? ` "Tattersail's crossed out. She went east."` : ''}`,
      ch:[{t:'Back to the squad.', go:'c7_close'}]}; },
    c7_close_ellis:()=>{ const k = S.f.c7_key || 'outlaw', fol = C7H.follows('ellis', k), horse = !!S.f.c7_tocHorse, held = !!S.f.c5_ellisHeld && !S.f.c7_ellisSpoke; return {sp:'Ellis', scene:'quorl_hill', fx:()=>{ if (held) S.f.c7_ellisSpoke=1; }, txt:
`${k === 'disband' ? `"He kept riding," she says. "Somebody should see where." ${horse ? `"I've a horse that knows the way, or thinks it does."` : ''}` : k === 'outlaw' && fol ? `"North," she says. ${horse ? `"On a horse. I'm not going up on one of those things with a horse at the Worry Gate that nobody's riding." She looks at Paran. "He'll let me ride ahead. It's where a scout rides."` : `"I'll ride ahead, where a scout rides. On anything they'll give me."`}` : k === 'outlaw' ? `"No," she says. "Not north. Not with the Host." She pulls her glove tight. "He kept riding. Somebody should see where."` : k === 'empire' && fol ? `"Genabaris," she says. "The river quarter. Where a man who never gave his name took me off a dock." She pulls her glove tight. "I'll walk past the dock. I'd like to see if I can."` : k === 'empire' ? (S.f.c7_clawDeal === 'took' ? `"You took his paper," she says. "I'm not going home to be written."` : S.f.c7_ledger === 'retained' ? `"They wrote *useful*," she says. "I'm not going home to be useful."` : `"No," she says. "Not west. I've been west."`) : fol ? `"My mother sold horses at the Fete," she says. "Gadrobi. There's a horse-market outside the Worry Gate every tenth day." She almost smiles. "I'll see if they cheat the woman with the glove."` : `"No," she says. "Not here. It's a lovely city. It had my name in a book."`}

${held ? `Then she looks at you, and says one sentence, the first she has said to you since the hillside that wasn't an answer to an order; and it's the right one.

"You held on to me on that hill because you'd decided I was yours, and I've been angry at you for it every morning since, and I've decided you were right."` : ''}`,
      ch:[{t:'Back to the squad.', go:'c7_close'}]}; },
    c7_close_end:()=>{ const k = S.f.c7_key || 'outlaw', n = C7H.countFollow(k); return {sp:'The quorl hill · noon', scene:k === 'outlaw' ? 'road_east' : 'quorl_hill', txt:
`${k === 'outlaw' ? `The quorl lifts under you with a lurch like a boat on a swell. The grass goes flat below in a roaring ring. The hill drops away, and the road, and the Rhivi on it, and the city tilts on the rim of its lake, blue and small; and then there's only the sky, and the sky has nothing in it but the Host's quorls strung out north like a line of geese, and the Fourth among them.` : k === 'disband' ? `The last quorl goes up. The grass lies down in its ring, and slowly stands again. The hill empties the way a room empties at the end of a long night: not all at once, and then all at once.` : k === 'empire' ? `The last quorl goes up. The grass lies down in its ring, and slowly stands again. It's very quiet on the hill without them. West, the road goes down to the city and round the lake and out the other side toward Genabaris and the sea. It's a long road, and by the end of it you'll know every rut.` : `The last quorl goes up. The grass lies down in its ring, and slowly stands again. Below, the city: blue, loud even from here, with a house in a garden that wasn't there yesterday and a gate that needs somebody on it.`}

Far off, where the Gadrobi road goes north over a brown ridge, a figure is walking. Alone. Not hurrying. The colour of the earth it walks on, with something long across its back that catches no light. It doesn't look round.

${S.f.c5_toolSaw ? `*You are very small. Stay that way.*` : ''} ${C7H.has('tuft') ? `Tuft watches it until it's gone over the ridge. "It isn't looking back," she says. "It never does. It's got nobody left to look back at." A pause. "I think that's the saddest thing I've ever seen, and it's walking."` : ''}

On the barrow-stone at the top of the hill, the raven laughs once more, a cracked crow's laugh going out over the grass; and lifts, and goes west, low, after a mountain that isn't in the sky any more.

The city is ${k === 'outlaw' ? 'behind you' : 'below you'}, on its lake. The sky over it has nothing in it. You count. ${C7H.intact(k) ? `All ${C7H.num(n)}.` : `${C7H.Num(n)}.`} You count twice.`,
      ch:[{t:'Noon.', fx:()=>{ S.f.c7_done=1; }, go:()=>chapterEnd(7, S.f.c7_key || 'outlaw')}]}; },
  }
};

/* ============ the finale text: the road, a page per squadmate, the gone, the coda ============ */
C7H.letter = () =>
`*Bris,*

*They tell you to write one of these in case. So this is in case. If you're reading it I'm dead, or you got bored, and you don't get bored.*

*The Second's all right. The food's worse than the barges and the sergeants are better. Nobody here can count. I told them my sister could count a barge-load of eels by the smell, and now they think I can count, and I can't, so you'd better come and do it for me.*

*I still owe you four coppers from the Cawn wharf. I'm not paying. Come and get them.*

*Don't stand in front of things. I know you. You'll stand in front of things.*

*Tav.*`;
C7H.KEYS = ['outlaw','empire','city','disband'];
C7H.key = k => C7H.KEYS.includes(k) ? k : (S.f.c7_key && C7H.KEYS.includes(S.f.c7_key) ? S.f.c7_key : 'outlaw');
C7H.join = ps => ps.filter(p => p && String(p).trim()).join('\n\n');
C7H.them = n => n === 1 ? 'it' : 'them';

C7H.ending = key => {
  const T = {outlaw:['Outlaws','road_east'], empire:['Loyalists','ship'], city:['Citizens','lakefront_dawn'], disband:['Stood Down','quorl_hill']}[key] || ['Outlaws','road_east'];
  if (typeof S === 'undefined' || !S || !S.f) return {title:T[0], scene:T[1], paras:[]};
  try {
    const f = S.f, n = C7H.countFollow(key), intact = C7H.intact(key), took = f.c7_clawDeal === 'took', alive = SQUAD().filter(id => id !== 'sgt');
    let P;
    if (key === 'outlaw') P = [
`Noon on a brown hill east of Darujhistan, and the quorls go up. They go up all at once, the way a flock goes, with a noise like a hundred sails filling, and the grass lies flat under them in rings, and the city tilts away blue and small on the rim of its lake. And there is the Fourth, strapped in behind Black Moranth who have never shown anybody their faces, going north into a sky with nothing in it.`,
`The Host is outlawed. Dujek Onearm has a price on his head he'd be insulted by if it were any lower; Whiskeyjack is his second, with a leg that will never be right; a green captain with a dead woman's sword has the Bridgeburners. ${C7H.wjTrust() ? `The Fourth flies with them. Attached, Whiskeyjack said on the hill, and the word has held, the way his words do.` : `The Fourth flies with the baggage: the Host's marines, not his. Paran asked for you anyway, and got you, and you are finding out what that's worth, and it's worth more than you'd have guessed.`}${took ? ` There's a pardon in the bottom of your pack in a neat hand. You never unfold it. You never throw it away, either.` : ''}`,
`Somewhere ahead is Caladan Brood, and whatever Dujek means to say to him, and after that whatever comes after that, which in this world is always more of it. ${n === 1 ? `Of the Fourth, only you are on the quorls.` : intact ? `All ${C7H.num(n)} of the Fourth are on the quorls.` : `${C7H.Num(n)} of the Fourth are on the quorls.`} The Empire has written every one of you down as an outlaw. You find you don't mind the word. It's the first thing the Empire has ever called the Fourth that it meant.`];
    else if (key === 'empire') P = [
`West, then. Weeks on the road to Genabaris, round the lake and over grass that doesn't care, and then the sea, and a ship, and a grey sail filling, and the city of blue fire going down behind the rail like a lamp turned low.`,
took ? `There's a pardon in your coat, in a neat hand. It says the Fourth were loyal. It doesn't say to what. The grey cloak wrote your people down in his book one by one, with a line after each name, and you gave him every line, in order, without anything in it that wasn't so; and you carry that across the sea like ballast.` : `No pardon. Nobody asked the Fourth to be loyal and nobody thanks you for it. At the Genabaris garrison a captain you've never met looks at you across a table and tries to decide what a loyal squad of an outlawed army is. There isn't a column for it. You watch him rule one.`,
`The Host goes north without you. ${C7H.has('brisk') ? (C7H.follows('brisk','empire') ? `Brisk's brother is in it, and Brisk is on the ship, and neither of those things has stopped being true since the hill.` : `Brisk's brother is in it, and so, now, is Brisk.`) : `Tav of Cawn is in it, alive, on the Moranth's rolls.`} ${took ? `The Claw keeps its ledger, and the Fourth's page stays open, because the Claw never closes a page on anyone useful.` : (f.c7_clawFought || f.c7_clawBought || f.c7_clawTalked) ? `The grey cloak's page on the Fourth is closed, or drowned. The Claw has other clerks. It always has.` : `The Claw keeps its ledger. Somewhere in it the Fourth's entry is still open.`} ${n === 1 ? `You count on the deck at dawn, out of habit, and get one.` : `You count on the deck at dawn: ${intact ? `all ${C7H.num(n)}` : C7H.num(n)}.`} Home is a word with some give in it. You're going to find out how much.`];
    else if (key === 'city') P = [
`You stay. The quorls go up without you and dwindle north over the Gadrobi Hills, and you walk back into Darujhistan by the gate you went out of, and the gate-watch looks at the Fourth and doesn't write anything down, which in Darujhistan is a kind of welcome.`,
`The Empire's ledger will call the Fourth deserters. Darujhistan does not read the Empire's ledger. Coll has a house with a young Azath in the garden and a gate that needs a soldier on it; the Phoenix has a door that needs standing in; the High Alchemist has more doors this morning than people he trusts; and Kruppe arranged all of it before anybody asked, and will never admit to having arranged any of it.`,
`It's warm, and it's uneasy, and it's both at once, like a room you've been told you can stay in by somebody who hasn't said for how long. The Empire never conquers a city, ${f.c3_innColl ? 'Coll said' : 'they say in Darujhistan'}; it waits. When it comes back, the Fourth will be on the other side of the gate. ${n === 1 ? `There's only you on this side of it.` : `There are ${C7H.num(n)} of you on this side of it.`}`];
    else {
      const roads = alive.map(id => ({
        brisk:`Brisk goes north to a brother who can't sing.`,
        kettle:`Kettle goes with the Moranth${C7H.square() ? ', square, and going anyway' : ', to carry her half of what she owes'}.`,
        tuft:C7H.leashed() ? `Tuft goes west, alone, to keep a man's eye off the Rhivi road.` : `Tuft goes east on the Rhivi road beside a child in red wool.`,
        ohl:C7H.tuftEast('disband') ? `Ohl goes with her, to argue with Hood on her behalf.` : `Ohl goes north, where the wounded will be.`,
        ellis:`Ellis rides.`}[id] || '')).filter(Boolean);
      P = [
`You stand the Fourth down on a brown hill at noon, with the quorls shifting their wings in the grass and a raven laughing on a stone. There's no form for it. The Host is outlawed and there's nobody left to countersign. You say the words anyway.`,
roads.length ? `And they go. ${roads.join(' ')} Not all at once; the Fourth never did anything all at once except stand in a line. Every one of them looks back once, and counts, and gets it wrong, and doesn't correct it.` : `There's nobody left to go anywhere but you. You say the words to the grass, and the grass takes them the way it takes everything.`,
`${roads.length ? `The squad ends. The people don't.` : `The squad ended last night, in an alley. This is only the paperwork.`} You stand on the hill until the quorls are specks and the Rhivi are dust and the hill is only a hill; and then you go down, alone for the first time in eleven years, to a city that has a room for you, because Kruppe arranged it.`];
    }
    return {title:T[0], scene:T[1], paras:P};
  } catch(e) { return {title:T[0], scene:T[1], paras:[]}; }
};

C7H.fate = (id, key) => {
  key = C7H.key(key);
  const f = S.f, k = key, fol = id === 'sgt' ? true : C7H.follows(id, k), l = C7H.loy(id), d = C7H.dead();
  if (id === 'sgt') return C7H.fateSgt(k);
  if (id === 'brisk') {
    const read = f.c7_letter === 'brisk', toTav = !fol || k === 'disband' || k === 'outlaw';
    const things = [f.c1_key === 'line' ? 'a Hound of Shadow on the cadre row' : '', f.c4_key === 'shield' ? 'a Tiste Andii on a Daru roof' : '', f.c6_key === 'bridgeburners' ? 'a Jaghut tyrant in a garden' : '', f.c6_steppedIn ? 'an Adjunct of the Empress in an alley' : ''].filter(Boolean);
    const self = !f.c7_tav && (k === 'empire' || k === 'city') ? `She read the Moranth's rolls for herself on the hill, while you were with Whiskeyjack: with her finger, down the columns, not skipping. *Tav, of Cawn. Fourth Regiment. Living.* Nobody took her. Nobody needed to.\n\n` : '';
    const p1 = self + (k === 'outlaw' && fol ? `Brisk flies north on a quorl with her shield strapped under her like a saddle, and doesn't look down once. She says afterwards she didn't need to; she could hear how far it was.

The Host's lines are a city of tents with no Empire in it. The Fourth Regiment is at the far end. Brisk walks the length of the camp in the first hour, not hurrying, with the shield on her back. There's a big man at a cook-fire who can't sing, singing. She stands behind him until he feels it, the way you feel weather.

"${read ? `Four coppers` : `Tav`}," she says. He turns round.` : k === 'outlaw' ? `Brisk flies north with the Host, but not with the Fourth. On the first morning in the lines she asks for a transfer to the Fourth Regiment in the regiment voice, and gets it, because nobody refuses Brisk in the regiment voice. She finds Tav by noon. She doesn't come back to the Fourth's fire. Once, a month on, a runner brings a slate with one line on it in her square hand: *Rations short. Count them twice.* From Brisk, it's a letter.` : k === 'disband' ? `Standing down is a thing Brisk has never done. She does it the way she does everything: completely. She hands you the ration ledger on the hill, closed, with the count on the last page, and it's right. Then she goes north with the Host to the Fourth Regiment, to a big man at a cook-fire who can't sing, singing. She stands behind him until he feels it. "${read ? `Four coppers` : `Tav`}," she says. He turns round.` : fol && k === 'empire' ? `Brisk goes west. She walks beside you all the way to Genabaris with her shield on her back and the letter ${read ? 'open' : 'sealed'} in her gorget, and every mile of it is a mile away from Tav, and she knows it, and she walks it anyway. "He's alive," she says on the ship, the only time she mentions it. "He doesn't need me standing in front of him. You might."` : fol ? `Brisk stays. She stands in the door of the Phoenix Inn five nights a week and stops fights by standing in them, and the thieves of Darujhistan come to regard her as a kind of weather. Kruppe calls her the armoured lady to her face and the wall behind her back, and she knows about both and permits one. She writes to Tav. The letters go north with the Moranth, who carry everything. He writes back, badly and seldom.${read ? ` At the foot of every letter she writes *four coppers*, and at the foot of every one of his he writes *no*.` : ''}` : `Brisk doesn't ${k === 'city' ? 'stay' : 'go west'}. At the foot of the hill she plants her shield in the grass and looks at you over the rim, the way she looked at you on the Pale when the grey cloak said leave the mage. "He's north," she says. "Three years I've looked. I'm not ${k === 'city' ? 'sitting in a city' : 'walking the other way'} now he's found." She goes north with the Host, and the last you see of her is the shield, going up into the sky on the back of a quorl, not looking down.`);
    const p2 = toTav ? (read ? (k === 'outlaw' && fol ? `Nobody in the Fourth sees the rest, and Brisk never tells it. What you know is that she comes back to the fire at dusk with a split lip she won't explain and a face doing something it has never done in front of you, and sits down, and counts the rations aloud, and gets the number wrong, and doesn't correct it.` : `Nobody sees the rest, and Brisk never tells it. Months on, a Moranth brings you a slate with one line on it in her square hand: *Found him. He still owes me four coppers.*`) : `She opens the letter that night, sitting next to him at his own fire, and reads it to him out loud, all of it, and he's mortified, and she makes him hear it to the end. Then she hits him. Then she doesn't let go of him for a long time.`) : (read ? `She'll see him again. The Empire is small in the end, if you're patient, and Brisk is the most patient person in it. She has four coppers to collect.` : `She hasn't opened the letter. She says she'll open it when she can put it in his hand and watch his face. She's patient. She's the most patient person in the Empire.`);
    const p3 = d.length ? `She carries ${C7H.names(d)} the way she carries the shield: on her back, out of sight, and never once put down. "We don't leave people," she says once more, to nobody, and then doesn't say it again. She's worked out what it means. It means you carry them.` : things.length ? `${read || toTav ? `*Don't stand in front of things.* ` : ''}She stood in front of ${things.length < 2 ? things[0] : things.slice(0, -1).join(', ') + ' and ' + things[things.length - 1]}, and she keeps a bit of the bend in her shield rim so she knows which dents were for something.` : `She keeps the ration ledger still, out of habit. Some nights she writes the count in it for a squad that isn't there, and gets it right.`;
    const p4 = l >= 2 ? `"Sergeant," she says, the last time you see her. That's the whole conversation. It always was, and it was always enough.` : l <= -2 ? `She doesn't forgive you. Her loyalty was slow to give and it doesn't come back once spent; she told you that the first week, in fewer words. She salutes when she passes you. She salutes correctly. It's the coldest thing she knows how to do.` : fol ? `She never tells you what she thought of how it ended. She tells you when the orders are stupid. The deal held.` : `She never tells you what she thought of how it ended. The deal was that she'd tell you when the orders were stupid. She never said this one was.`;
    return {title: read ? 'Four coppers' : 'The line', txt:C7H.join([p1, p2, p3, p4])};
  }
  if (id === 'kettle') {
    const sq = C7H.square(), c = (S.inv && S.inv.cusser) || 0;
    const p1 = k === 'outlaw' && fol ? `Kettle flies north on the back of the thing she's been checking the sky for since Nathilog. She names it. It doesn't answer to the name, and the Moranth rider pretends not to have heard. Hedge rides the next quorl over and they shout across the gap at each other about cussers the whole way, and the Moranth, who have never once been known to express an opinion, fly a little faster.` : k === 'empire' && fol ? `Kettle goes west, square with the Moranth, and on the ship out of Genabaris she stands at the rail and watches the sky out of habit for three days. There are no quorls over the sea. On the fourth day she stops looking up. She says it's the first time since Nathilog her neck hasn't hurt.` : k === 'city' && fol ? `Kettle stays in the city of blue fire, which is sitting on gas, and she knows it, and she has never been happier. She gets a job with the Paviors' Guild, a real one this time, Gadrobi District, on the strength of a charter nobody else has read. She knows where the Bridgeburners' eggs are sleeping under the Gadrobi crossing, and she goes down the ladder once a week to sit with them. "Somebody has to," she says. Nobody asks what she means, and she tells them anyway.` : `Kettle goes with the Moranth${k === 'outlaw' ? ', not with the Fourth' : ''}. She rides in Ch'kess's munitions train, ${sq ? 'square with them, and choosing it anyway' : 'working off what she owes a crate at a time'}, and she's good at it, and the Moranth say so, in clicks, which is more than they have said to any human in a generation. They count everything. She has never met anybody who counts like she does.`;
    const p2 = f.c7_debt === 'paid' ? `She handed a cusser back to a Black Moranth on a hill east of Darujhistan, and he gave her a chit of chitin that says square, and she wears it on a thong at her throat and touches it when she's frightened, which is how you'll always know. The spoon is explained now. She still won't explain it.` : f.c7_debt === 'spent' ? `She told a Black Moranth what Chub's cusser was spent on, and he said the one that mattered is the one that is thrown, and she has decided to believe him, most days. The chit at her throat says square. The spoon is explained now. She still won't explain it.` : f.c7_debt === 'owed' ? `The debt is still owed, and she and Ch'kess both know it, and it weighs less than it did. The spoon is still in her kit. She knows whose it is now.${c > 0 ? ` So is the cusser. Chub said she'd know the one that matters. She's still waiting to know.` : ''}` : `The debt is still owed. The spoon is still in her kit, unexplained. "It's a measure," she says, if you ask, which you don't. "For powder. It's Moranth. It isn't mine." And then, because she's Kettle: "Yet."${c > 0 ? ` She still has a cusser. Chub said she'd know the one that matters. She's still waiting to know.` : ''}`;
    const p3 = f.c7_ellisBack && C7H.has('ellis') ? `Ellis's two lengths of trip-cord are coiled in the bottom of her satchel. She has never used them. She never will.` : '';
    const p4 = l >= 2 ? `"You kept pointing me at things," she tells you, at the end of it, "and I kept making them stop being things." A pause. "That's love, in the sapper trade. I told you that. I'm telling you again so you'll remember I told you."` : l <= -2 ? (fol ? `She stopped giving you the count some while before the end. She gives it to ${C7H.has('brisk') && C7H.follows('brisk', k) ? 'Brisk' : 'the Moranth'} instead. You hear it through the tent wall at night: two sharpers, one burner, no cussers. Same as this morning.` : `She stopped giving you the count on the hill. She gives it to Ch'kess now, in clicks, and Ch'kess writes it down.`) : fol ? `She gives you the count every morning without being asked. "Same as yesterday. You can stop asking." You never asked.` : `She didn't give you the count on the hill. It's the first morning in five years she hasn't. You find you'd been waiting for it.`;
    return {title: sq ? 'Square' : 'The spoon', txt:C7H.join([p1, p2, p3, p4])};
  }
  if (id === 'tuft') {
    const lsh = C7H.leashed(), st = lsh ? 'kept' : C7H.tuft(), east = !lsh && (k === 'disband' || !fol), west = C7H.tuftWest(k);
    const stLine = {glove:`Meanas comes back to her a thread at a time, like feeling coming back into a hand that's been slept on. It comes back hers. She's nobody's. She's surprised, still, how light it is.`, shadow:`The Hounds are somewhere under her road, always. She can feel them the way you feel a river under a bridge. They don't come up. They know where she is. That, she says, is the polite thing about Shadow: it lets you know it knows.`, dark:`The house in Kurald Galain went west with the mountain. She misses the window. She wears the Andii cloak that doesn't take the light, and it still hasn't warmed up, and she's stopped expecting it to.`}[st] || '';
    const p1 = east ? `Tuft goes east with the Rhivi. She walks beside the woman on the grey mare, and Sethand lets her, which is the most he has ever let anybody. ${f.c7_tattersail ? `The child in the red wool grows too fast${f.c3_kruppe ? ', the way Kruppe said' : ''}. By the first snow it can say her name. By the second it looks at her, sometimes, the way a mage in a tent on the cadre row once looked at a card she had already turned.` : `The bundle in the red wool grows too fast. Tuft watches it the way she used to watch the Deck.`}` :
      west ? `Tuft goes west, alone, to Genabaris and the High Mage's staff, with a letter that says nothing and a face that says the rest. If he's looking out of her collar, she gives him Genabaris to look at, and the staff, and the sea: everything but a road going east through the grass. It's the last thing she can do for the child. She does it every day.` :
      k === 'empire' && lsh ? `Tuft goes home, but not with you. ${f.c7_clawFought ? `The grey cloak is at the bottom of the lake; it makes no difference; the High Mage has other hands.` : `The grey cloak is waiting on the quay at Genabaris, politely, as he said he would be.`} She goes back to the High Mage's staff the way she left it, with a letter that says nothing and a face that says the rest. Somewhere on that staff a mage sleeps with two lamps lit, and draws no cards, and is very, very careful never to think about a child on the Rhivi road. She's good at it. She has to be. He's looking.` :
      k === 'outlaw' && lsh ? `Tuft flies north with the Host, and the High Mage flies with her, in her collar, looking out. She knows when he's there. She sits with her back to the command tent when he is, and reads the Deck for nobody, and waits. In the second month Quick Ben sits down across a fire from her and says, "Your collar," and she says, "I know," and he does something with two fingers she doesn't see. In the morning the badge is only a badge. Neither of them mentions it again. It's the most she has ever been given by somebody who wanted nothing for it.` :
      k === 'outlaw' ? `Tuft flies north with the Host. She sits behind the Moranth rider with her eyes shut and her hands flat on the chitin, and says afterwards that the quorl was thinking about something the whole way, and it wasn't them. ${stLine}` :
      k === 'empire' ? `Tuft goes home with the Fourth, into an Empire whose High Mage ${st === 'glove' ? `can't find her any more: she could stand in his tent and he'd look through her` : st === 'shadow' ? `would find somebody else's thumb on her if he looked, and doesn't look` : st === 'dark' ? `would find that Kurald Galain looked at her once and didn't forget, and doesn't care to look` : `hasn't yet decided what to do about her`}. ${stLine}` :
      `Tuft stays in Darujhistan. The High Alchemist has doors that need watching, and one of them is a door only she can see. Kruppe takes her to the Phoenix on the tenth night of every month and watches her face, not her cards, and pays for her wine, and never once asks what she saw. ${stLine}`;
    const drew = f.c6_selfDrawn ? ` She drew for herself once, on the night of the Fete, with you beside her, and it was the unpainted card: nobody's yet. She keeps it inside her tunic, against her chest, the way Brisk keeps a letter.` : '';
    const p2 = (f.c7_tattersail ? (f.c3_askedTuft ? `She kept her promise. On the Gadrobi road she told you first.` : `On the Gadrobi road she told you what she'd known since the plain, and you were the first.`) : f.c3_askedTuft ? `She never did tell you what Kruppe meant, at the door of the Phoenix. The Rhivi went east with it. She'd promised you'd be the first, and you would have been.` : f.c3_kruppe ? `She never did tell you what Kruppe meant, at the door of the Phoenix. The Rhivi went east with it.` : '') + drew;
    const p3 = (lsh && (k === 'empire' || k === 'disband')) ? '' : {glove:`She sleeps in the dark now, some nights.`, shadow:`She sleeps with the lamp out. The dark is somebody's now, and she knows whose.`, dark:`She still sleeps with a lamp lit, but she turns it down.`, kept:`She sleeps with two lamps lit.`}[st] || `She sleeps with a lamp lit.`;
    const p4 = l >= 2 ? `"The cards say nothing about you, Sergeant," she tells you at the end. "I checked." A pause. "They never did. That was the compliment. I'm explaining it now, because I promised to explain things."` : l <= -2 ? `She doesn't say goodbye. She says, "Yes, Sergeant," in the flat voice she keeps for orders she hates, and it's the last thing she says to you.` : C7H.has('kettle') ? `She laughs at exactly one thing, still. It's still Kettle.` : `She hasn't laughed since the alley. Then one morning she does, at nothing, and looks startled, and does it again.`;
    return {title: east ? 'The long road east' : west ? 'West, to him' : ({glove:'Nobody\'s', shadow:'Polite', dark:'The window', kept:'A letter that says nothing'}[st] || 'The Deck'), txt:C7H.join([p1, p2, p3, p4])};
  }
  if (id === 'ohl') {
    const tEast = k === 'disband' && C7H.tuftEast('disband');
    const p1 = tEast ? `Ohl goes east with Tuft and the Rhivi. "Somebody has to argue with Hood for her," he says, "and I'm old, and I've got the time." Sethand looks at him for a long while and then moves his horse over, so there's room on the road.` :
      k === 'outlaw' && fol ? `Ohl flies north with the Host, complaining about the quorl the entire way in Ehrlii, and Dujek gives him a hospital tent the size of a barn on the first day. He argues with Hood in it, loudly, all winter. He loses, slowly.${f.c7_askedOhl ? ` *Keep losing slowly*, Dujek said, and it's the first order in years Ohl has found no fault with.` : ''}` :
      k === 'empire' && fol ? `Ohl goes west with the Fourth, and home, as far as the Empire is home to a man from Ehrlitan. In Genabaris they're saying Seven Cities will rise within the year. Ohl says nothing about it. He buys more gut and needles in the market by the docks than a squad could use in ten years, and packs them very carefully.` :
      k === 'city' && fol ? `Ohl stays in Darujhistan and takes a room at the Phoenix Inn: the one by the stair, where the lamp doesn't reach. Jeth Arrow's room. He lives in it now, and it writes itself. He treats thieves for nothing and nobles for a great deal, and Kruppe pays for his wine and never mentions it.` :
      `Ohl goes north with the Host, to the hospital tents${k === 'outlaw' ? ', and not to the Fourth\'s fire' : ''}. Dujek gives him a tent the size of a barn and more work than Hood has time for. He sends tea. It's technically medicine.`;
    const parts = [`The list is ${C7H.num(C7H.lc())} names.`];
    if (f.c7_ohlTat) parts.push(`He crossed Tattersail off it on the Gadrobi road. She went east.`);
    if (f.c7_ohlEllis) parts.push(`He crossed out the space he'd kept for Ellis, the morning she walked out of the dark on the Lakefront.`);
    parts.push(`The space for Toc is still there. He has decided to leave it. "He kept riding," he says. "I'll wait."`);
    if (f.c4_key === 'shield') parts.push(`The line for the boy on the Daru roof is still crossed out. He knows the name now. He hasn't written it in.`); else if (f.c4_key === 'aside') parts.push(`There's a mark beside Vell, small, that he has never explained.`);
    if (f.c6_ohlLorn) parts.push(`The Adjunct is on it too, near the bottom, in the same small hand as everyone else. He would have tried for her.`);
    parts.push(d.length ? `He meant to die before he wrote a name from the Fourth on it. He didn't. ${C7H.names(d)} ${d.length === 1 ? 'is' : 'are'} on it, ${C7H.and(d.map(i => C7H.num(C7H.listNo(i))))}, in the small hand, and he says that's the worst of it: not that ${d.length === 1 ? 'the name is' : 'they are'} there, but that he's still here to read ${C7H.them(d.length)}.` : `No name from the Fourth is on it. He intends to die before there is one. He's more confident about it than he used to be.`);
    const p3 = C7H.has('ellis') && C7H.follows('ellis', k) && (fol || tEast) ? `Somewhere along the way Ellis lets him look at her hand. Toc asked it, on the plain. It took a year. He doesn't say what he finds. He says it'll do, which from Ohl is a diagnosis.` : '';
    const p4 = l >= 2 ? `"Drink the tea, Sergeant," he says, the last time. "It's not poison. It's just unpleasant, which is how you know." You drink it. It's technically medicine.` : l <= -2 ? `He never forgave you ${f.c4_key === 'aside' ? 'Vell' : 'all of it'}. He treated you anyway. That's what the list is: the ones he'd have tried for. You'd have been on it.` : fol ? `He still makes the tea. You still drink it. Neither of you mentions it.` : `Neither of you says goodbye properly. Healers don't; they say *keep it clean* and *come back if it smells*. He says both.`;
    return {title:'The list', txt:C7H.join([p1, parts.join(' '), p3, p4])};
  }
  if (id === 'ellis') {
    const horse = !!f.c7_tocHorse, lc = f.c7_ledger, act = f.c7_ledgerAct, rides = !fol || k === 'disband';
    const p1 = rides ? `${k === 'empire' && f.c7_clawDeal === 'took' ? `"You took his paper," she said, on the hill. "I'm not going home to be written." ` : ''}Ellis rides.${horse ? ` On Toc's horse, which has decided she will do.` : ''} North, some days; east, most. *He kept riding. Somebody should see where.* She looks at the ground more than the sky. Once in a long while, where the grass is pressed flat in a way grass shouldn't be, she gets down and puts her gloved hand flat on the prints and counts the days.` :
      k === 'outlaw' ? `Ellis goes north with the Host and scouts for it, out ahead where a scout rides${horse ? `, on Toc's horse, which has decided she will do` : ''}. She looks back once a day and counts. The number is right more often than it isn't.` :
      k === 'empire' ? `Ellis goes home to Genabaris, the river quarter, where a man who never gave his name took her off a dock at eighteen. She walks past the dock. She doesn't look at it. Then she goes back and looks at it, for a long time, and walks on, and that's the end of that.` :
      `Ellis stays in Darujhistan. Her mother was Gadrobi and sold horses at the Fete, and there's a horse-market outside the Worry Gate every tenth day, and by midsummer the Gadrobi traders have stopped trying to cheat the woman with the glove, which in that market is a kind of citizenship.${horse ? ` She keeps Toc's horse. She never sells it.` : ''}`;
    const said = f.c7_ledgerBurnt ? `something the fire had half of` : lc === 'retained' ? `*retained, useful through the Fourth*` : lc === 'lost' ? `*lost, entry closed*` : `*not retained*`;
    const did = act === 'struck' ? `She struck it through, neatly. They'd want it neat.` : act === 'burned' ? `She gave it to the fire, which was where it was going.` : act === 'kept' ? `She keeps it folded small in the cuff of her glove, against the burned hand. When she's dead properly, somebody can send it back to them.` : '';
    const p2 = lc ? `Her line in the ledger behind the green door said ${said}. ${did}` : `She never went through the green door. "I know which way it's written," she says, if anybody asks. "It's written the way I walk."`;
    const p3 = [f.c7_ellisBack ? `She came back out of the grey after four days that were longer. The grey is still in her hair. It doesn't take the light.` : '', f.c5_ellisHeld ? (f.c7_ellisSpoke ? `She talks to you again. She has since that last morning: one sentence, the right one, and then others, which were only sentences.` : `She talks to you again, in the end. It takes a while. The first thing she says is one sentence, the right one, and after that the others are only sentences.`) : ''].filter(Boolean).join(' ');
    const p4 = l >= 2 ? `"I'm still not used to it," she says. "Don't stop."` : l <= -2 ? `She never says thank you. She told you on the plain she wasn't used to it. She never got used to it.` : `"I'd like it in the ledger," she says, "that I ${f.c7_ellisBack ? 'came back' : 'was here'}."`;
    return {title:'Which way it is written', txt:C7H.join([p1, p2, p3, p4])};
  }
  return {title:(TPL[id] && TPL[id].role) || '', txt:(TPL[id] && TPL[id].quest) || ''};
};

C7H.fateSgt = k => {
  const f = S.f, n = C7H.countFollow(k), intact = C7H.intact(k), d = C7H.dead(), took = f.c7_clawDeal === 'took', alive = SQUAD().length;
  const p1 = k === 'outlaw' ? `North. On the first morning in the Host's lines, before light, you take the Second Army whistle out of your kit, the one nobody has blown since the Second was a thing that existed, and you blow it. Three short. Muster. Half the camp turns out, because half the camp was Second, and they stand in the grey looking at each other, and somebody laughs, and somebody doesn't. The Fourth is already standing. ${intact ? `All ${C7H.num(n)}.` : `${C7H.Num(n)}.`}

Later, Dujek comes past on a horse, with the reins in his teeth when he needs the hand. He looks at the Fourth. He doesn't stop. "{sgt}," he says, and that's the whole of it. Somebody noticed. ${C7H.wjTrust() ? `When Whiskeyjack limps past the Fourth's fire on his stick, he counts you, and nods.` : `Whiskeyjack never counts the Fourth again. Paran does, every morning, badly, and gets the number right.`}` :
    k === 'empire' ? `West. At Genabaris a captain reads your name off a list and looks up, and looks at the Fourth, and doesn't know what to write. ${took ? `You show him the paper. He reads it twice, the way you read orders, and stands up.` : `A loyal squad of an outlawed army. There isn't a column for it. You watch him rule one.`} The Second Army whistle stays in the bottom of your kit. There's no Second left to call.

${took ? `Somewhere, in a neat hand, a line under the Fourth's name says *loyal*. You'll never read it. You'll know.` : f.c7_clawLedger === 'kept' ? `The grey cloak's ledger is in your pack. You've never finished the line. You never will.` : `Somewhere the Claw has a page on the Fourth. You find you can sleep anyway.`}` :
    k === 'city' ? `You stay. Coll's gate, or the Phoenix door, or one of Baruk's; it doesn't matter which; Kruppe arranged all three before anybody asked. The Second Army whistle hangs on a nail in the gatehouse, and on the night of every Gedderone Fete, at the hour the Tyrant came up out of the lawn, you take it down and look at it and hang it up again. In the Empire's ledger the Fourth is written *deserters*. You find you can live in a city that doesn't read it.` :
    `You stood them down on a brown hill at noon. Then you were alone on a hill for the first time in eleven years, and the quorls went up, and the Rhivi went east, and you stood there until the hill was only a hill. You went down to the city in the end. Kruppe had a room.

${C7H.has('brisk') ? `In the spring a Moranth brings a slate to the Phoenix with two words on it in a big square soldier's hand: *Still counting?* It isn't signed. It doesn't need to be.` : C7H.has('kettle') ? `In the spring a Moranth brings a slate to the Phoenix with one line on it in a small sooty hand: *Two sharpers, one burner. Same as this morning.* It isn't signed. It doesn't need to be.` : ''}`;
  const p2 = `The pay ledger, waterproofed, that you kept honest for eleven years: you close it ${k === 'outlaw' ? `in the Host's lines` : k === 'empire' ? `at Genabaris` : k === 'city' ? `in Coll's gatehouse` : `on the hill`}. The last page is every name in the Fourth, and against each name the pay owed, and against the pay the word *paid*, because you've paid it, one way or another. *One mule${S.f.c2_wagon ? ', Pell,' : ''} left with the Paviors' Guild at the Gadrobi crossing in lieu of wages.* Brisk would ${C7H.has('brisk') ? 'want' : 'have wanted'} it entered.${d.length ? ` And under the names, a line, and under the line, ${C7H.names(d)}, and nothing against ${d.length === 1 ? 'the name' : 'the names'}, because there's no column for what ${d.length === 1 ? C7H.pr(d[0]).she + '\'s' : 'they\'re'} owed.` : ''}`;
  const bits = [`You remember the names of the dead. All of them. It's the one thing on your record nobody asked you to do.`];
  if (f.sgtScar) bits.push(`There's a scar from the alley that aches when the weather turns. You fell that night, with the otataral in the air, and got up. ${C7H.has('ohl') ? `Ohl says you were lucky. He says it the way he says *technically*.` : `Nobody says you were lucky. The one who would have is on the list.`}`);
  if (f.c7_letter === 'sgt') bits.push(f.c7_letterAct === 'sent' ? `Brisk's letter went north with the Moranth, sealed, to the man who wrote it. You never hear what he did with it. You don't need to.` : f.c7_letterAct === 'carried' && k === 'outlaw' ? `Brisk's letter, sealed, you put into Tav's hand yourself on the third day, at a cook-fire, and walked away before he could open it.` : f.c7_letterAct === 'carried' ? `Brisk's letter is still in your coat, sealed. You meant to carry it to him yourself. You will. The Moranth carry everything, and so, it turns out, do you.` : `Brisk's letter is in your coat, open, folded along its old creases. *Don't stand in front of things.* You read it some nights. You'd like to tell her he was right, and wrong, and that she'd have laughed.`);
  bits.push(`The knife nobody has seen drawn is still undrawn.`);
  const p4 = k === 'disband' ? `There is no Fourth now. There is a sergeant with nobody to count, who counts anyway.` : intact ? `The Fourth came up out of the dark at the Pale with all five. ${n > 5 ? `It's ${C7H.num(n)} now, and you'd have said that wasn't possible.` : `It's still five.`} You count twice anyway.` : `The Fourth came up out of the dark at the Pale with all five. It's ${C7H.num(n)} now${n === 5 ? ', and not the same five' : ''}. You count twice. You'll always count twice.`;
  return {title: k === 'disband' ? 'Stood down' : intact ? `All ${C7H.num(n)}` : 'The pay ledger', txt:C7H.join([p1, p2, bits.join(' '), p4])};
};

C7H.gone = (id, key) => {
  key = C7H.key(key);
  const f = S.f;
  if (!TPL[id] || id === 'sgt' || SQUAD().includes(id)) return null;
  if (C7H.isDead(id)) {
    const no = C7H.listNo(id), who = C7H.has('ohl') ? 'ohl' : C7H.has('brisk') ? 'brisk' : 'sgt';
    const entry = {brisk:'Cawn. Corporal, heavy infantry', kettle:'Falar. Sapper', tuft:'Malaz City, the Mouse Quarter. Mage, Meanas', ohl:'Ehrlitan. Healer, Denul', ellis:'Genabaris, the river quarter. Scout'}[id] || TPL[id].role;
    const line = `*${NAME(id)}. ${entry}. ${C7H.Num(no)}.*`;
    let body;
    if (who === 'ohl') body = {
      brisk:`Ohl writes it small, the way he writes all of them, and sits with the charcoal in his hand a long time. "She let me call her child," he says. "Nine years a soldier, and twenty-nine, and she let me."${f.c7_tav ? ` A pause. "Her brother's alive. On the Moranth's rolls. She'd have counted his rations first and hugged him second."` : ''} He writes something else under it, very small. "We don't leave people," he says. "She'd want it on her line. There isn't room. I've put it in anyway."`,
      kettle:`Ohl writes it small, the way he writes all of them. "Nine stitchings," he says. "I'd have liked ten." He looks at the name a long time. "She had all her fingers. She mentioned it often. She mentioned it the night before, to me, as if I might have forgotten."${f.c7_debt === 'closed' ? ` He folds the oilcloth. "The Moranth wrote her down too," he says. "On their other roll. They said the dead don't owe. I've never liked a Moranth before."` : ''}`,
      tuft:`Ohl writes it small, the way he writes all of them. "Nineteen," he says. "Fourteen months with us. It felt longer to everyone, and not long enough." He folds the oilcloth. "She slept with a lamp lit. I've kept it lit."${f.c7_tattersail ? ` A long pause. "She'd have liked to see the child grow. I'll write to her about it. I don't know where to send it. I'll write anyway."` : ''}`,
      ellis:`Ohl writes it small, the way he writes all of them, just under the space he left for Toc. "Her captain's space and hers, side by side," he says. "One open. One not. She'd have laughed at that, without any sound." He puts the charcoal away. "I never did get to look at her hand. Toc asked for it, on the plain. I'd like that in the ledger."`}[id];
    else if (who === 'brisk') body = {
      ohl:`Brisk wrote him in the ration ledger the night of it, under the count, because somebody had to write him somewhere. Then she wrote him on his own oilcloth, at the bottom, in her square hand: the last name on a list that was never meant to have one of the Fourth on it. "He meant to die before he wrote one of us," she says. "He managed it." She closes the oilcloth. "He'd call that a technicality."`,
      kettle:`Brisk writes it in the ration ledger, under the count, in her square hand. "She called me *the wall*," she says. "Not to my face. I knew. I'd have liked her to say it to my face once."`,
      tuft:`Brisk writes it in the ration ledger, under the count. "She stood behind the shield without being told," she says. "From the first week. I noticed. I never said." She closes the ledger. "I should have said."`,
      ellis:`Brisk writes it in the ration ledger, under the count. "I handed her the rations count after one day," she says. "That's a promotion. She knew it." A pause. ${f.c5_briskHeld ? `"I held her down on a hillside once, so she wouldn't go," she says. "I'd do it again. There's nothing to hold."` : `"We don't leave people. We didn't. She went anyway." She closes the ledger. "I'm writing it so I'll stop looking."`}`}[id];
    else body = {
      brisk:`You write it yourself, on Ohl's oilcloth, in the space under the last name, in the small careful letters he'd have used. She prayed to no one and saluted Hood anyway. You salute him for her. It's the only order of hers you ever took.`,
      kettle:`You write it yourself, on Ohl's oilcloth, in the small careful letters he'd have used. She never dropped anything in her life. She threw a great deal. You find you're waiting for the count at breakfast, and it doesn't come.`,
      tuft:`You write it yourself, on Ohl's oilcloth, in the small careful letters he'd have used. The Deck is in your pack. You haven't opened it. You don't know how to read it, and it would only say nothing about you, which was the compliment.`,
      ohl:`You write it yourself, at the foot of his own list, in letters as small and careful as you can make them. He meant to die before he wrote one of the Fourth. He managed it. He'd call that a technicality. You make the tea, in the morning, the way he made it. It's terrible. It's technically medicine.`,
      ellis:`You write it yourself, on Ohl's oilcloth, in the small careful letters he'd have used. She counted horses before people and apologised for it. You count the horses first, now, and don't apologise to anybody.`}[id];
    return {title:C7H.Num(no), txt:C7H.join([line, body || `${NAME(id)} did not get up. The Fourth carried the name the rest of the way.`])};
  }
  if (id !== 'ellis') return null;
  const lc = f.c7_ledger, act = f.c7_ledgerAct, horse = !!f.c7_tocHorse;
  if (f.c7_ellisLeft) return {title:'He kept riding', txt:C7H.join([
`She came back out of the grey on the Lakefront at dawn, with ash in her hair and Kettle's cord on her wrist, and the sergeant told her she could go where she liked, and she did.`,
`There was a horse in the stable at the Worry Gate that nobody was riding. It remembered her. She rides. North, some days; east, most. She looks at the ground more than the sky, and once in a long while, where the grass is pressed flat in a way grass shouldn't be, she gets down and puts her gloved hand flat on the prints and counts the days.`,
`"He kept riding," she says, to the horse. "So will we."`,
C7H.has('ohl') ? `Ohl crossed out her space anyway. "She's not dead," he said. "She's only not ours. Those are different lists."` : ''])};
  if (f.c2_ellisRefused) {
    const said = f.c7_ledgerBurnt ? `a word the fire had half of` : `*not retained*`;
    const did = act === 'struck' ? `struck it through, neatly` : act === 'burned' ? `gave it to the fire` : act === 'kept' ? `folded it into the cuff of her glove` : `left it where it was`;
    return {title:'Which way it is written', txt:C7H.join([
      lc ? `She read her line in the ledger behind the green door with the Fourth beside her. It said ${said}, and she ${did}, and then she walked east along the Lakefront, not fast, a scout's walk, and at the corner she lifted the gloved hand over her shoulder once, and was gone.${f.c7_clawDeal === 'took' ? ` "You took his paper," she said, when the sergeant asked her to come. It wasn't personal. It was training.` : ''}` :
        `She was on the Lakefront that morning, on a cask two doors down from the green door, with her bow across her knees. ${f.c7_ellisDoor ? `The sergeant said not yet.` : `The Fourth didn't go over.`} She went in alone, later. Nobody knows what the book said. She knows. That was the whole of the point.`,
      `She counts the Rhivi Plain now, for whoever pays. She's good at it. She counts horses before people still, and apologises for it, to nobody. Nobody writes her down.`,
      C7H.has('ohl') ? `"I'd have liked to look at her hand," Ohl says, sometimes, when the fire's low. "That's all. It's the healer talking."` : ''])};
  }
  return {title:'Gone her own way', txt:`Ellis went her own way. The Fourth counted her, afterwards, out of habit, and got the number wrong, and didn't correct it.`};
};

C7H.coda = key => {
  key = C7H.key(key);
  const alive = SQUAD().length;
  const last = {outlaw:`The Fourth went north with an outlawed army, into whatever comes next, which in this world is always more of it.`,
    empire:`The Fourth went home, which is a word with some give in it.`,
    city:`The Fourth stayed, and the city, which never conquers anyone, let it.`,
    disband:`There is no Fourth now. There ${alive === 1 ? 'is one sergeant who was it' : `are ${C7H.num(alive)} people who were it, on ${C7H.num(alive)} roads`}, and ${alive === 1 ? 'the sergeant still counts' : 'every one of them still counts'}.`}[key];
  return [
`In Darujhistan they light the lamps at dusk, street by street, blue, as if something under the city were breathing out. In a garden on the Estate hill a small wrong house keeps its door shut and its guests in. At the bottom of the lake a coin lies in the mud on neither face. Somewhere west, over water, a mountain drifts with a lord in it who was interested once, and is no longer. The gods don't say what they made of any of it. Nobody asks them. Nobody ever asks the gods anything, in the end, but marines, and marines don't wait for the answer.`,
`Three days after the Pale fell, a sergeant came into a tent on the cadre row with ${S.ending === 'claw' ? 'empty hands' : 'a satchel'} and all five, and a mage looked up from her cards and said it was a nice touch. East on the Rhivi road, a child in good red wool is going to grow up too fast and remember a great many things. One of them, perhaps, will be that. ${last} Somebody noticed. It was enough.`];
};
