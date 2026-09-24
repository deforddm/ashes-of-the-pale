/* ============ chapter 1: Pale ============ */
/* Kettle's count, in words: "Two sharpers, one burner, no cussers" */
const c1Count = () => { const w = n => ['no','one','two','three','four','five','six','seven','eight','nine','ten'][n] || String(n), p = (n, s) => `${w(n)} ${s}${n === 1 ? '' : 's'}`;
  const t = `${p(S.inv.sharper, 'sharper')}, ${p(S.inv.burner, 'burner')}, ${p(S.inv.cusser, 'cusser')}`; return t[0].toUpperCase() + t.slice(1); };
const CH1 = {
  title:'Pale', number:'One',
  intro:{loc:'The Pale', sub:'Genabackis · two nights later', cap:'The tent lines under a bruised sky. Somewhere north, the cadre row has one lamp lit.',
    paras:[
`Two nights since the tunnels. The Host has stopped counting its dead and started counting its living, which is a shorter job and a worse one. A new captain arrived this afternoon with a noble's seat on a horse and a commission for the Bridgeburners, and the Bridgeburners have been very quiet about it, which is how the Bridgeburners are loud.`,
`You are Sergeant {sgt}, Fourth Squad, Seventh Company marines. The Fourth has been attached to Whiskeyjack for whatever comes next. Nobody has told you what comes next. Kettle has counted the munitions twice since supper. Tuft has not slept.`,
`The runner said: *the Bridgeburners' fire, when you're ready.* Then he looked at your squad, all five, and added, "Sergeant," as if it were a question.`],
    go:'Walk the lines', node:'c1_start'},

  area:{ id:'pale_night', title:'The Pale · the camp at night', sub:'Bridgeburners\' fire to the east · cadre row north',
    hint:'Tap ground to move · tap a figure to talk',
    // 16 columns x 12 rows. # rubble  . ground  , ash  = tent  C cadre tent (Tattersail's; walking onto it = talk)  F fire (the Fourth's by the start; the other feeds the Bridgeburners')  W wagon (Pell)  P burial pit  x picket stake  B Bridgeburners' fire (walk onto = Whiskeyjack)
    map:[ "################",
          "#..C..=..=....P#",
          "#.....=..=...PP#",
          "#,,..........P.#",
          "#..=...x.x.x...#",
          "#..=......,....#",
          "#....W.....,...#",
          "#..=.......=..,#",
          "#..=...,F..=B..#",
          "#.....,....,F..#",
          "#..,......,....#",
          "################" ],
    walk:'.,P', triggers:{C:'c1_tent', B:'c1_wj', W:'c1_pell', P:'c1_pits'},
    start:{x:8,y:9},
    npcs:[
      // once he has said good night he walks on toward the cadre row: he stays on the map only while you are talking to him
      {id:'paran', name:'Captain Paran', kind:'paran', x:6, y:5, node:()=>S.f.c1_paran?'c1_paran_again':'c1_paran', show:()=>!S.f.c1_hounds && (!S.f.c1_paran || /^c1_paran/.test(S.node || '')), fresh:()=>!S.f.c1_paran},
      {id:'wj', name:'Whiskeyjack', kind:'wj', x:12, y:8, node:()=>S.f.c1_wj?'c1_wj_again':'c1_wj', fresh:()=>!S.f.c1_wj},
      {id:'qb', name:'Quick Ben', kind:'qb', x:13, y:8, node:()=>S.f.c1_wj?'c1_wj_again':'c1_wj'},
      {id:'kalam', name:'Kalam', kind:'kalam', x:13, y:9, node:()=>S.f.c1_wj?'c1_wj_again':'c1_wj'},
      {id:'tat', name:'Tattersail', kind:'tat', x:4, y:1, node:()=>S.f.c1_tent?'c1_tent_again':'c1_tent', show:()=>!S.f.c1_hounds, fresh:()=>!S.f.c1_tent},
      {id:'pell', name:'Quartermaster Pell', kind:'pell', x:6, y:6, node:()=>'c1_pell'},
      {id:'claw', name:'Grey cloak', kind:'claw', x:9, y:3, node:()=>S.f.c1_claw?'c1_claw_again':'c1_claw', show:()=>!S.f.c1_hounds && !!S.f.c1_wj, fresh:()=>!S.f.c1_claw} ] },

  battles:{
    hounds_line:{title:'The cadre row', warrenText:'Shadow bleeds through the tent lines · Meanas howls', warren:{meanas:1.4,denul:0.8}, dark:true, music:'dark',
      map:["#......#","..#..#..","........","#......#","........",".#....#.","........","........","#......#","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['hound',3,1]], xp:180, after:'c1_after_line',
      objective:{type:'survive', rounds:4, text:'Hold the cadre row for four rounds.'},
      waves:[{round:2, foes:[['hound',6,0]], text:'A second Hound comes over the tents. Rood.'}] },
    hounds_claw:{title:'The cadre tent', warrenText:'Shadow bleeds through the tent lines · Meanas howls', warren:{meanas:1.4,denul:0.8}, dark:true, music:'dark',
      map:["#......#","........","..#..#..","........","........","#......#","........",".#....#.","........","........"],
      party:[[3,7],[4,7],[2,8],[5,8],[3,8],[4,8]],
      foes:[['hound',3,1]], xp:150, after:'c1_after_claw',
      objective:{type:'survive', rounds:3, text:'Seal the cadre tent. Hold the crate for three rounds.'},
      allies:[['assassin',1,9],['assassin',6,9]],
      waves:[{round:2, foes:[['hound',6,0]], text:'A second Hound comes over the tents. Rood. The grey cloaks do not look up.'}] },
    accounting:{title:'The picket line', warrenText:'Warrens quiet · the stakes cast two shadows each', warren:{meanas:1.1,denul:1}, music:'battle',
      map:["........","..#..#..","........","#......#","........","........",".#....#.","........","........","........"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['assassin',1,1],['assassin',4,0],['assassin',6,2]], xp:120, after:'c1_after_accounting'} },

  foes:{ hound:{name:'Hound of Shadow', sig:'H', hp:44, ac:15, atk:6, dmg:[2,6,2], rng:1, mv:6, init:4, boss:true, verb:'tears at'},
         assassin:{name:'Claw', sig:'C', hp:14, ac:14, atk:5, dmg:[1,8,2], rng:1, mv:5, init:4, verb:'knifes'} },

  gear:{ // slot ∈ weapon|armour|trinket. who = ids that can wear it, or null for anyone.
    heater:{name:'Second Army heater shield', slot:'armour', who:['brisk','sgt'], ac:1, line:'A heater shield with the Second\'s sigil burned off. Brisk did not ask whose.'},
    houndtooth:{name:'Hound\'s tooth', slot:'trinket', who:null, atk:1, line:'A tooth the length of a finger, snapped off in a tent pole. It is warm. It stays warm.'},
    cadretoken:{name:'Cadre token', slot:'trinket', who:['tuft','ohl'], hp:2, line:'A bone disc on a cord, the kind the cadre give to people they intend to remember. Tattersail did not say whose it had been.'},
    clawknife:{name:'Grey cloak\'s knife', slot:'weapon', who:['sgt','kettle'], atk:1, line:'A short blade with no maker\'s mark and no blood on it, which is not the same as never having had any.'} },

  card:{ id:'hounds', name:'Hounds of Shadow', house:'High House Shadow', hue:'#7a6a9a',
    txt:`Seven shapes running under a moon that isn't there. Tuft looks at it for a long time. "They're not coming for us," she says, and then, quieter, "I don't think."`,
    fx:'Your squad moves +1 tile this chapter.' },

  dlg:{
    /* ---- opening ---- */
    c1_start:()=>({sp:'The Fourth\'s fire', scene:'camp_night', fx:()=>{S.f.c1_started=1;}, txt:
`The Fourth's fire is small and Brisk is standing over it as if it might try something. Kettle is on her third count of the munitions. Ohl has his oilcloth open on his knee and is not reading it, which is a thing he does when the list is long enough already.

Tuft is at the edge of the light with her back to the tent lines. She has been there since dark.

"Sergeant." Brisk, not looking up. "Bridgeburners want you. Runner said *when you're ready*, which means now."

${S.f.decoy ? `Kettle finishes on her fingers, since a grey cloak has her ledger.` : `Kettle snaps the ledger shut.`} "${c1Count()}. Same as this morning.${S.inv.sharper === 2 && S.inv.burner === 1 && S.inv.cusser === 1 ? ` Same as two nights ago.` : ``}${S.inv.cusser ? ` The cusser's called Maud, if anyone's asking." Nobody is.` : ` Maud went off under the north quarter, if anyone's asking." Nobody is.`}`,
      ch:[{t:'Walk the lines.', go:()=>startExplore()},
          {t:'"Tuft. You sleeping?"', fx:()=>{S.f.c1_askedTuft=1;}, go:'c1_start_tuft'},
          {t:'"Ohl. How long is it tonight?"', fx:()=>{S.f.c1_askedOhl=1;}, go:'c1_start_ohl'}]}),
    c1_start_tuft:()=>({sp:'Tuft', txt:
`She doesn't turn round. "There's a lamp in the cadre row that's been lit three nights. Same tent. Nobody goes in and nobody comes out."

${S.loy.tuft >= 2 ? `"I'd tell you if it mattered, Sergeant. I'm telling you now. It matters, and I don't know why yet."` : `"It's not our business." She says it the way people say things they've decided, not things they believe.`}`,
      ch:[{t:'Walk the lines.', go:()=>startExplore()},
          {t:'"Ohl. How long is it tonight?"', req:()=>!S.f.c1_askedOhl, fx:()=>{S.f.c1_askedOhl=1;}, go:'c1_start_ohl'}]}),
    c1_start_ohl:()=>({sp:'Ohl', txt:
`He folds the oilcloth along its old creases. "Two hundred and eleven. I counted again by the fire. It doesn't get shorter when you count it, but I keep hoping."

${S.loy.ohl >= 2 ? `"None of ours, Sergeant. I mention it because you'd never ask."` : `"Go on. The Bridgeburners don't like waiting, and they're worse at it than we are."`}`,
      ch:[{t:'Walk the lines.', go:()=>startExplore()},
          {t:'"Tuft. You sleeping?"', req:()=>!S.f.c1_askedTuft, fx:()=>{S.f.c1_askedTuft=1;}, go:'c1_start_tuft'}]}),

    /* ---- the Bridgeburners' fire ---- */
    c1_wj:()=> S.f.c1_wj ? CH1.dlg.c1_wj_again() : ({sp:'Whiskeyjack · Bridgeburners', scene:'fire', txt:
`The Bridgeburners' fire is bigger than yours, and quieter. Whiskeyjack sits on a saddle with his boots to the coals and his sword across his knees, not for show; he is oiling it. The one beside him, dark and long-fingered and smiling at something, would be Quick Ben. The big one standing just outside the light, not leaning on anything, would be Kalam.

"Sergeant {sgt}." Whiskeyjack doesn't stand. "Fourth Squad. You were in the north tunnels two nights ago. Tell me how that went."

Kalam's eyes go to Kettle's satchel and stay there. Quick Ben's go everywhere except Tuft.`,
      ch:[{t:`"All five up. ${S.ending === 'claw' ? 'Varrow\'s satchel went to a grey cloak at the tunnel mouth.' : 'Varrow\'s satchel went where it was sent.'} Deserters in the first hundred paces, something older at the end."`, go:'c1_wj_honest'},
          {t:'"Grave detail, sir. Nothing to report."', go:'c1_wj_evasive'},
          {t:'"Tunnels, sir. Nothing your Bridgeburners couldn\'t have done faster."', go:'c1_wj_boast'}]}),
    c1_wj_honest:()=>({sp:'Whiskeyjack', fx:()=>{S.f.wjRegard=1; S.f.c1_reported=1;}, txt:
`He nods once, as if a figure in a ledger had come out even.

"That's a report." He goes back to the sword. "Something older. Quick?"

"Kurald Galain, leaked down from the Spawn." The mage says it the way other men say *rain*. "It'll be gone in a month. The thing that was living in it won't." He is still not looking at Tuft.`,
      ch:[{t:'Wait for the rest.', go:'c1_brief'}]}),
    c1_wj_evasive:()=>({sp:'Whiskeyjack', fx:()=>{S.f.wjRegard=0; S.f.c1_reported=1;}, txt:
`"Grave detail." He says it back to you flat, the way you'd hand a man back a coin that's been clipped. "That's what people say to grey cloaks, Sergeant. You've been talking to grey cloaks."

Quick Ben laughs, once, softly. Kalam doesn't.

"I don't need to know what was in the tunnels. I need to know if you'll tell me what's in the next one. We'll find out."`,
      ch:[{t:'Wait for the rest.', go:'c1_brief'}]}),
    c1_wj_boast:()=>({sp:'Whiskeyjack', fx:()=>{S.f.wjRegard=-1; S.f.c1_reported=1; loy('brisk',-1);}, txt:
`He stops oiling the sword.

"Don't do that." Not loud. "I've got thirty-eight Bridgeburners left out of fourteen hundred and I'm not going to spend the evening being told how good they are by a sergeant who walked all five out of a hole. That's a better thing than fast. Try saying that next time."

Behind you, Brisk shifts her weight, which is as close as she comes to a comment.`,
      ch:[{t:'"Sir."', go:'c1_brief'}]}),
    // the full briefing the first time; coming back to it from a side question, a short recap instead of the whole speech again
    c1_brief:()=>({sp:'Whiskeyjack', fx:()=>{S.f.c1_briefed=1;}, txt: S.f.c1_briefed ?
`Whiskeyjack has gone back to the sword. "Darujhistan," he says, to the blade. "Overland, with the baggage, a week behind us. Anything else, Sergeant, ask it now."` :
`"Darujhistan." He lets the word sit in the fire a moment. "The last free city. Dujek's orders are to take it from the inside, and the Empress's orders are for the Bridgeburners to do it, and the new captain's orders are to command the Bridgeburners while they do it. You'll have seen the captain. Tall. Polite. Wearing his commission like a coat that hasn't been rained on yet."

"The Black Moranth fly us south. Five squads. The quorls carry five, and I've asked about a sixth, and the answer was a noise I've decided was a no. So the Fourth goes overland with the baggage train and a Rhivi guide and whatever the Host can spare, which is nothing. You'll be a week behind us. You'll come into the city from the plain, and you'll be the only Malazans in it that nobody's watching for."

${S.ending === 'claw' ? `Quick Ben, mildly: "A grey cloak walked out of the north quarter two nights ago with a satchel under his arm. Half the camp saw it. The other half was paid not to." He is smiling. It isn't at you.` :
  S.ending === 'burned' ? `Quick Ben, mildly: "Tattersail burned a candle for an hour that night. Not for reading by." He is smiling. It isn't at you.` :
  S.ending === 'told' ? `Quick Ben, mildly: "Tattersail's sleeping less than usual, which was none. Whatever you carried up, Sergeant, it didn't get lighter when she read it." He is smiling. It isn't at you.` :
  `Quick Ben, mildly: "The cadre tent smelled of oilcloth this morning. Somebody delivered something and didn't stay to read it. That's rarer than you'd think." He is smiling. It isn't at you.`}`,
      ch:[{t:'Watch the mage, and where he isn\'t looking.', check:['wits',12], req:()=>!S.f.c1_qb, fx:()=>S.f.c1_qb=1, go:'c1_qb_tuft', fail:'c1_qb_miss'},
          {t:'"And the captain, Kalam? Off the record."', check:['guile',13], req:()=>!S.f.c1_kal, fx:()=>S.f.c1_kal=1, go:'c1_kalam_ok', fail:'c1_kalam_no'},
          {t:'Tuft has the Deck out. She\'s looking at you.', req:()=>!S.f.c1_drawn, go:'c1_deck'},
          {t:'"Understood, sir."', go:'c1_wj_end'}]}),
    c1_qb_tuft:()=>({sp:'Quick Ben', txt:
`You've been in enough tents to know when a man is not looking at something on purpose. Quick Ben has not looked at Tuft since you walked into the light, and it is costing him.

When he catches you noticing, he lets it go, all at once, like a held breath. He looks at her properly. Tuft looks at the fire.

"Meanas," he says, to you, pleasantly. "Nice warren. Quiet. You can carry a lot in it without anyone hearing it rattle." Then, to her: "How's the High Mage's staff these days?"

Tuft says nothing. The fire pops. Quick Ben nods as if that had been an answer, and a good one.`,
      fx:()=>{S.f.c1_qbTuft=1; loy('tuft',1);},
      ch:[{t:'Back to the briefing.', go:'c1_brief'}]}),
    c1_qb_miss:()=>({sp:'Quick Ben', txt:
`The mage is looking at the fire, and then at Kalam, and then at you, with the mild interest of a man counting something. When you try to follow his eyes they've already moved.

"Sergeant," he says. "You're staring."`,
      ch:[{t:'Back to the briefing.', go:'c1_brief'}]}),
    c1_kalam_ok:()=>({sp:'Kalam', fx:()=>{S.f.c1_kalamTalk=1;}, txt:
`Kalam doesn't move from the edge of the light. For a moment you think he hasn't heard.

"He sits a horse like a noble and walks like a man who's been told that's a problem." The voice is low and unhurried. "He read the roster twice. Out loud. Every name. Nobody told him to."

A pause you could fit a knife into.

"Somebody sent him to us. Somebody who sends people. I'll know which somebody by the end of the week, and the captain won't, and that's the whole of what I think about the captain."`,
      ch:[{t:'Back to the briefing.', go:'c1_brief'}]}),
    c1_kalam_no:()=>({sp:'Kalam', txt:
`"He's the captain," Kalam says.

Whiskeyjack doesn't look up from the sword. "That's Kalam's whole opinion, Sergeant. It took him a day to reach it. Don't spend yours."`,
      ch:[{t:'Back to the briefing.', go:'c1_brief'}]}),
    c1_deck:()=>({sp:'Tuft', txt:
`Tuft has the Deck out of her sleeve, which she doesn't do in front of strangers. Quick Ben has gone very interested in the coals.

"One card, Sergeant. For the road. I'm not reading for them." Her eyes go to the Bridgeburners and back. "I'm reading for us."`,
      ch:[{t:'Let her draw.', fx:()=>{ S.f.c1_drawn=1; S.card = ['hounds','hounds','hounds','oponn','knight','assassin'][R(6)]; }, go:()=>cardSequence(()=>talk('c1_card'))},
          {t:'"Not here. Not in front of them."', fx:()=>{S.f.c1_drawn=1; S.f.c1_noCard=1; loy('tuft',-1); loy('brisk',1);}, go:'c1_brief'}]}),
    c1_card:()=>{ const c = (CARDS[S.card] || CH1.card); return {sp:'The Deck of Dragons', scene:'fire', txt:
`Tuft lays the reading out on Whiskeyjack's saddle-blanket without asking. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)} · ${esc(c.fx)}</div>`, oncard:[S.card,false],
      after:`${c.txt}

Quick Ben has looked up from the coals. "Interesting deck," he says, and means the hand holding it.`,
      ch:[{t:'Back to the briefing.', go:'c1_brief'}]}; },
    c1_wj_end:()=>({sp:'Whiskeyjack', fx:()=>{S.f.c1_wj=1;}, txt:
`He sheathes the sword.

"Sleep if you can. Report to the quartermaster in the morning for the wagon." ${S.f.c1_paran ? `A glance down the lines. "The captain's been round yours, I hear. Good. He's new, and he's trying, and the ones who try are the ones you get to keep."` : `"If the captain walks your lines tonight, be a marine at him; he's new, and he's trying, and the ones who try are the ones you get to keep."`} He looks at the cadre row, where the one lamp is still lit. ${S.f.c1_tent ? `"And you've seen Tattersail. Good. She doesn't ask twice. She just stops asking."` : `"And if Tattersail asks for you, go. She doesn't ask twice. She just stops asking."`}

${S.f.wjRegard > 0 ? `"Sergeant." As you turn. "All five. Keep doing that."` : S.f.wjRegard < 0 ? `He doesn't say anything as you turn. Kalam does, to nobody: "Fourth Squad."` : `Quick Ben lifts two fingers from his knee, which might be a farewell and might be a ward.`}`,
      ch:[{t:'Walk the lines.', go:()=>{ if (S.f.c1_tent) talk('c1_night'); else startExplore(); }}]}),
    c1_wj_again:()=>({sp:'Whiskeyjack', txt:
`"Sergeant." He doesn't look up from the fire. "You've got your orders. They don't get better with repeating."

${S.f.c1_qbTuft ? `Quick Ben, to the coals: "Tell your mage she can stop pretending I'm not here. I'm very good at being here."` : `Kalam has moved. You didn't see him do it.`}`,
      ch:[{t:'Leave', go:()=>startExplore()}]}),

    /* ---- Captain Paran walks the lines ---- */
    c1_paran:()=>({sp:'Captain Paran', fx:()=>{S.f.c1_paran=1;}, txt:
`A tall man in a clean cloak is walking the tent lines with no lantern, which is either courage or a noble's assumption that the ground will be where he left it. His sword is old, older than he is, and worn on the wrong side for a man who's used it much.

He stops when he sees your squad. He looks at each of you in turn, counting, and you watch him arrive at five and check it.

"Sergeant. Fourth Squad." Not a question; he's read the roster. "Captain Paran. I'm told you're attached to Whiskeyjack for the south. I'm told a number of things. I'm trying to find out which ones are true before someone asks me to act on them."

He says it stiffly, like a man reading aloud from something he wrote out earlier and is no longer sure of.`,
      ch:[{t:'Salute. Properly, the whole thing.', go:'c1_paran_salute'},
          {t:'"Five, sir. Same five that went down. You can stop counting."', check:['might',11], go:'c1_paran_count', fail:'c1_paran_count_fail'},
          {t:'Ohl holds out a cup of tea.', go:'c1_paran_tea'}]}),
    c1_paran_salute:()=>({sp:'Captain Paran', txt:
`You give him the salute the Untan garrison gave to Fists, the one with the shield-arm, and hold it.

He returns it correctly, which surprises you, and a beat late, which doesn't. Something in his face unclenches by a hair.

"Thank you, Sergeant," he says, and you think he means it, and you think he knows it's a strange thing for a captain to say. "I had a tutor who said sergeants were the spine of an army. I begin to see he'd never met one."`,
      ch:[{t:'"Sir."', go:'c1_paran_go'}]}),
    c1_paran_count:()=>({sp:'Captain Paran', fx:()=>{loy('brisk',1); S.f.c1_paranStare=1;}, txt:
`He holds your stare. You hold his. It is a longer contest than it should be, and he is the one who ends it, with a small nod that is not a concession and is not quite an order.

"Five," he says. "I'll remember the number. I've been given a great many numbers today, Sergeant, and yours is the first one that came with a face attached."

Brisk, behind you, makes a sound that in another woman would be approval.`,
      ch:[{t:'"Sir."', go:'c1_paran_go'}]}),
    c1_paran_count_fail:()=>({sp:'Captain Paran', txt:
`He holds your stare, and you find, to your irritation, that you have looked away first. He doesn't press it. He looks as if he has done that to people before and not enjoyed it.

"Five," he says quietly. "Good." And then, as if it cost him: "I'm sorry. I'm not yet sure how to talk to marines. I'll learn it or I won't."`,
      ch:[{t:'"Sir."', go:'c1_paran_go'}]}),
    c1_paran_tea:()=>({sp:'Captain Paran', fx:()=>{loy('ohl',1); S.f.c1_paranTea=1;}, txt:
`Ohl has a cup in his hand before anyone sees him make it. He holds it out to the captain the way he holds it out to everyone, as if refusal were a medical question.

Paran takes it. Drinks. His face does the thing every face does.

"Hood's breath," he says, and then, appalled at himself, "Forgive me. Is that medicine?"

"Technically," says Ohl.

The captain finishes the cup. That is the first thing he has done tonight that looks like a decision.`,
      ch:[{t:'"Sir."', go:'c1_paran_go'}]}),
    c1_paran_go:()=>({sp:'Captain Paran', txt:
`He looks toward the cadre row, where the one lamp is still lit.

"I'm to see the cadre mage before I sleep. Whiskeyjack calls it a courtesy. I think it's an inspection, and I'm not certain which of us is being inspected." A pause. "Good night, Sergeant. I expect I'll have a great deal to say to you in the morning, and I expect you'll have heard most of it before."

He walks off toward the tent lines with no lantern. Once, at the edge of the light, he looks back at the camp the way a man looks at a street whose name he has just been told, memorising it.

${S.loy.kettle >= 2 ? `Kettle, quietly: "He walks like a man who doesn't know there's a hole in front of him." Then, quieter: "I like him. That's a bad sign for him."` : `Tuft watches him go longer than anyone else does.`}`,
      ch:[{t:'Walk the lines.', go:()=>startExplore()}]}),
    c1_paran_again:()=>({sp:'Captain Paran', txt:`He's gone north along the tent lines, toward the cadre row. You can still see the pale cloak, and then you can't.`, ch:[{t:'Leave'}]}),

    /* ---- Tattersail's tent ---- */
    c1_tent:()=> S.f.c1_tent ? CH1.dlg.c1_tent_again() : ({sp:'Tattersail · cadre mage', scene:'tent', fx:()=>{S.f.c1_tentIn=1;}, txt:
`The tent smells of candle smoke and something under it, dry and sweet, like a cellar where fruit has been left too long. Tattersail is at her table with the cards out and a cup she isn't drinking from. She looks older than two nights ago. Everyone does, but she has managed it faster.

${S.ending === 'claw' ? `"Sergeant {sgt}. Sit, since you're here." She doesn't offer a stool. "The High Mage has Varrow's hand by now, and what I have is a squad that carried it up out of the dark and then carried it somewhere else. Don't explain. I've had the explanation from the cards. It was a short reading."` :
  S.ending === 'burned' ? `"Sergeant. I've been thinking about your candle." She turns a card face-down without looking at it. "I'm not finished thinking. Sit."` :
  S.ending === 'told' ? `"You know what I know. That makes two of us, and Tayschrenn, and Varrow, and Varrow isn't talking." Her voice is the same warm thing it was, and something under it isn't. "Sit, Sergeant. I don't say it to many people. Most of them are dead."` :
  `"Sergeant. You brought me a thing and didn't read it." She almost smiles. "I've been trying to decide whether that makes you the most trustworthy soldier in this camp or the least curious. Sit. I'll let you know."`}

On a crate against the far wall, where the light doesn't quite reach, something sits with its legs out in front of it. A doll. A puppet. Its head is a carved wooden thing, and there is a smell of resin and old bandage about it, and the cellar sweetness is coming from there.`,
      ch:[{t:'Look at the puppet.', check:['wits',12], go:'c1_hairlock', fail:'c1_hairlock_miss'},
          {t: S.f.c1_paran ? '"The new captain\'s coming to see you tonight."' : '"There\'s a new captain in camp."', go:'c1_tent_captain'},
          {t:'"Ma\'am."', go:'c1_tuft_still'}]}),
    c1_tent_captain:()=>({sp:'Tattersail', fx:()=>{S.f.c1_tentCaptain=1;}, txt:
`${S.f.c1_paran ? `"He is."` : `"There is. He's coming to see me tonight."`} She doesn't look up. "Whiskeyjack asked me to look at him. I've looked. He's got the Deck all over him and doesn't know it, which is the worst way to have it."

"Somebody's put a piece on the board, Sergeant. It's him. I'd like to know who, and I'd like the answer not to be the one I think it is."`,
      ch:[{t:'Look at the puppet.', check:['wits',12], go:'c1_hairlock', fail:'c1_hairlock_miss'},
          {t:'"Ma\'am."', go:'c1_tuft_still'}]}),
    c1_hairlock:()=>({sp:'Tattersail\'s tent', fx:()=>{S.f.c1_sawHairlock=1;}, txt:
`It's a puppet. Jointed wood, a painted face with the paint gone at the mouth, a soldier's tunic cut down to fit. Somebody has stitched it with a great deal of care and no affection at all.

When you came in, its head was facing the tent flap.

It is now facing you.

Nobody in the tent moved. The candle didn't gutter. Tattersail's hand has stopped on the cards. "Hairlock," she says, without turning round. "Luggage. Don't talk to it. It talks back."`,
      ch:[{t:'Say nothing. Keep your hand near the knife.', go:'c1_tuft_still'},
          {t:'"That was cadre. Wasn\'t it. That was a man."', fx:()=>{S.f.c1_namedHairlock=1;}, go:'c1_tuft_still'}]}),
    c1_hairlock_miss:()=>({sp:'Tattersail\'s tent', txt:
`It's a puppet. A grotesque one, the kind a bored soldier makes out of a broken tent pole and a bandage, and there is a great deal of both in this camp. Its head is turned toward the far wall.

It doesn't do anything. You are not sure why you thought it would.`,
      ch:[{t:'"Ma\'am."', go:'c1_tuft_still'}]}),
    c1_tuft_still:()=>({sp:'Tattersail', txt:
`${S.f.c1_namedHairlock ? `She doesn't answer that, which is its own kind of answer.

` : ``}Tattersail looks past you, at the tent flap, where Tuft is standing exactly as far inside as she has to be to count as present.

Tuft has gone still. Not the stillness of a soldier waiting; the stillness of a small animal that has heard the hawk. Her grey cloak is doing the thing it does, where it is there and then not quite.

Tattersail's face changes. It's a small change, and it's not unkind, and it's the face of a woman who has just recognised a badge on a collar that isn't wearing one.

"Sergeant," she says. "Step outside with me. Mind the cold. Leave the girl."`,
      ch:[{t:'Step outside.', go:'c1_tuft_plant'}]}),
    c1_tuft_plant:()=>({sp:'Tattersail', scene:'camp_night', fx:()=>{S.f.c1_plant=1;}, txt:
`Outside, the cold is the real thing. Tattersail pulls her shawl round and doesn't look at you; she looks at the cadre row, the way you'd look at a line of graves you knew the names on.

"Your mage carries a cadre badge she doesn't wear. I know the badge. I sewed one like it onto a girl's collar eighteen months ago, on the High Mage's staff, and I watched her take it off four months later and ask for a marine squad with a letter that said nothing."

${S.ending === 'told' ? `"You read the underlined line with her at your shoulder. I'd wager she stopped breathing. *Moved before the Spawn attacked, not after.* Somebody on his staff relayed that order, Sergeant. Somebody carried it. She was on his staff."` :
  S.f.partial ? `"You've heard the name now. Tayschrenn. She hears it and she stops moving. I've seen soldiers do that at the name of a place. I've never seen one do it at the name of a man."` :
  `"She goes still when someone says *High Mage*. You'll have noticed. She'll go stiller. There are things a person carries out of that staff that don't fit in a satchel."${S.f.knowTruth ? `

You think of a line in a small careful hand, underlined twice, and of Tuft behind you in the lantern light, not breathing. You don't say so.` : ``}`}

"He doesn't let people leave, Sergeant. He let her. I'd like to know what he thinks he still has of hers." She finally looks at you. "I'm not asking you to find out. I'm telling you what I'd want to know, if I were her sergeant, before somebody else found out for me."`,
      ch:[{t:'"What badge? I\'ve never seen a badge."', go:'c1_plant_badge'},
          {t:'"She\'s a marine now. Whatever she was."', fx:()=>{loy('tuft',1); S.f.c1_plantMarine=1;}, go:'c1_plant_marine'},
          {t:'"What do you want me to do about it?"', go:'c1_plant_ask'}]}),
    c1_plant_badge:()=>({sp:'Tattersail', fx:()=>{S.f.c1_plantDeny=1;}, txt:
`"No," she says. "You haven't." She almost smiles. "Keep not seeing it. It's the kindest thing anyone's done for that girl since Malaz City, and I include myself."

"But when she does something you don't understand, in a fight, or after one, don't ask her why. Ask her who taught her."`,
      ch:[{t:'Go back in.', go:'c1_tent_done'}]}),
    c1_plant_marine:()=>({sp:'Tattersail', txt:
`"Good," she says, and it comes out rougher than she meant it. "Good. Then she's yours and not his, and that's the first time I've been able to say that about anyone who came off that staff."

"Hold onto it. He'll test it. Not tonight. But he's patient, and you're going to Darujhistan, and there's a card in her deck she's never drawn for herself. When she does, be standing next to her."`,
      ch:[{t:'Go back in.', go:'c1_tent_done'}]}),
    c1_plant_ask:()=>({sp:'Tattersail', txt:
`"Nothing." She says it fast, as if she'd been waiting to. "That's the whole of my advice. When it comes, and it will, it'll come looking like a favour or an order, and it'll come from someone who outranks both of us. Do nothing until you've asked her. Then do what she says, if you can stand to."

"That's not an answer, Sergeant. I'm aware. I've been a cadre mage for twenty years and I've never had one."`,
      ch:[{t:'Go back in.', go:'c1_tent_done'}]}),
    c1_tent_done:()=>({sp:'Tattersail\'s tent', scene:'tent', fx:()=>{S.f.c1_tent=1; if (S.ending === 'told' || S.ending === 'given') { gain('cadretoken'); }}, txt:
`Inside, Tuft is exactly where you left her. The puppet is exactly where you left it, which you check.

${S.ending === 'told' || S.ending === 'given' ? `Tattersail puts something in your hand on the way past: a bone disc on a cord. "Cadre token. Give it to whichever of them you think needs to be remembered. I've stopped being able to tell."` :
  S.ending === 'burned' ? `Tattersail sits. "Pell's restocked, if you have coin. Buy the sapper something that goes off. I have a feeling about tonight and the cards won't tell me what it's a feeling of."` :
  `Tattersail sits. "Pell's restocked," she says, which is a dismissal. "Buy the sapper something that goes off. Somebody should have something tonight that does what it's told."`}

She's back to her cards before you reach the flap. "Sergeant. If you hear dogs tonight, they aren't."`,
      // with Whiskeyjack already seen, leaving the tent starts the Hounds: one last chance at Pell's wagon first
      ch:[{t:'Leave the tent', go:()=>{ if (S.f.c1_wj) talk('c1_night'); else startExplore(); }},
          {t:'Stop at Pell\'s wagon on the way.', req:()=>!!S.f.c1_wj && S.silver >= 3, go:()=>{ sceneShell('camp_night'); talk('c1_pell'); }}]}),
    c1_tent_again:()=>({sp:'Tattersail', txt:
`"Sergeant." She doesn't look up. "The cards haven't got better. Neither has the puppet. Go and sleep, or go and pretend to."`,
      ch:[{t:'Leave', go:()=>startExplore()}]}),

    /* ---- Pell's wagon ---- */
    c1_pell:()=>({sp:'Quartermaster Pell', txt:
`Pell has a wagon, a ledger, and the face of a man who has been asked for things all week and has started saying no before the question. The Moranth crates have new seals on them. "Restocked. Don't ask from where. Moranth don't give these away and neither do I."

You carry ${S.silver} silver.`,
      ch:[
        {t:'Sharper, 6 silver', tag:`have ${S.inv.sharper}`, req:()=>S.silver>=6, fx:()=>{S.silver-=6;S.inv.sharper++;note('Bought a sharper.','good');AUDIO.play('coin');}, go:'c1_pell'},
        {t:'Burner, 5 silver', tag:`have ${S.inv.burner}`, req:()=>S.silver>=5, fx:()=>{S.silver-=5;S.inv.burner++;note('Bought a burner.','good');AUDIO.play('coin');}, go:'c1_pell'},
        {t:'Healing salve, 3 silver', tag:`have ${S.inv.salve}`, req:()=>S.silver>=3, fx:()=>{S.silver-=3;S.inv.salve++;note('Bought a salve.','good');AUDIO.play('coin');}, go:'c1_pell'},
        {t:'Cusser, 14 silver', tag:`have ${S.inv.cusser}`, req:()=>S.silver>=14 && !S.f.c1_cusserSold, fx:()=>{S.silver-=14;S.inv.cusser++;S.f.c1_cusserSold=1;note('Bought a cusser. Pell looks at Kettle the way a man looks at weather.','good');AUDIO.play('coin');}, go:'c1_pell_cusser'},
        {t:'"You\'ve got a cusser."', req:()=>S.silver<14 && !S.f.c1_cusserSold && !S.f.c1_askedCusser, fx:()=>S.f.c1_askedCusser=1, go:'c1_pell_broke'},
        {t:'Leave', go:()=>{ if (S.f.c1_wj && S.f.c1_tent && !S.f.c1_hounds) talk('c1_night'); }}]}), // on the way back from the tent, the night goes wrong
    c1_pell_cusser:()=>({sp:'Quartermaster Pell', txt:
`Kettle takes it in both hands like an infant she has been told is hers. She turns it once to the light.

"This one's Gerrun," she says. "After a sapper. He's dead. It's a compliment."

Pell writes something in the ledger and underlines it. "Sergeant, if she stands near my wagon again I'm charging you for the wagon."`,
      ch:[{t:'Back', go:'c1_pell'}]}),
    c1_pell_broke:()=>({sp:'Quartermaster Pell', txt:
`"One. Fourteen silver, and I'm losing money at that." He doesn't look at your purse. He doesn't have to. "Come back when the Empress pays you, Sergeant. I'll still have it. Nobody else in this camp is mad enough."

Kettle has not stopped looking at the crate.`,
      ch:[{t:'Back', go:'c1_pell'}]}),

    /* ---- the burial field ---- */
    c1_pits:()=> S.f.c1_pits ? {sp:'The Second\'s burial field', txt:
`The pits are where they were. Brisk doesn't come this way twice in a night, and doesn't ask why you did.`,
      ch:[{t:'Leave'}]} : {sp:'The Second\'s burial field', fx:()=>{S.f.c1_pits=1;}, txt:
`The pits run up the hillside in the dark, long and shallow and half-filled, with lime over them that glows a little where the moon should be. Somebody has put helmets along the edge of the nearest one, upright, in a row, like men waiting for a wagon.

Brisk has stopped. She does this. You've learned not to notice, and she's learned that you're not noticing.

She crouches at the lip of the pit and puts her hand on something half under the lime. A heater shield, the Second's sigil burned off the face. She turns it over. She turns it back. She doesn't ask whose.

"Sergeant." That's all. Then, after a while: "Tav wrote a letter. Three years ago. I never opened it. I thought I'd open it when I found him." She sets the shield upright against the helmets. "If I open it now it means something."`,
      ch:[{t:'"Take the shield. It\'s a good shield."', fx:()=>{gain('heater'); loy('brisk',1);}, go:'c1_pits_take'},
          {t:'"Leave it with them."', fx:()=>{loy('ohl',1); loy('brisk',-1); S.f.c1_leftShield=1;}, go:'c1_pits_leave'},
          {t:'Say nothing. Wait for her.', fx:()=>{loy('brisk',1); S.f.c1_waitedBrisk=1;}, go:'c1_pits_wait'}]},
    c1_pits_take:()=>({sp:'Brisk', txt:
`She picks it up. She fits it to her arm and it fits, which is not the same as it being hers.

"Not his," she says. "His had a notch top left. This one's clean." She doesn't put it down. "It's a good shield."

Ohl, from behind you, very quietly, in Ehrlii: something to Hood, and not polite.`,
      ch:[{t:'Walk the lines.', go:()=>startExplore()}]}),
    c1_pits_leave:()=>({sp:'Brisk', txt:
`She leaves it. She stands up slowly, the way she does when her knees are talking, and looks along the row of helmets one more time as if a name might be written on one.

"Fine," she says. She walks. She doesn't look back, and you notice that she doesn't, and she notices that you notice.`,
      ch:[{t:'Walk the lines.', go:()=>startExplore()}]}),
    c1_pits_wait:()=>({sp:'Brisk', txt:
`You wait. Kettle, for once, is quiet. Tuft has gone to the far end of the row and is standing there with her hood up, which could be respect and could be the other thing.

After a while Brisk stands. She leaves the shield against the helmets.

"He's not in this one." She says it to the pit, not to you. "I'd know."

Then: "Sergeant." And the conversation, such as it was, is over, and something in it has been put down that she was carrying.`,
      ch:[{t:'Walk the lines.', go:()=>startExplore()}]}),

    /* ---- the grey cloak ---- */
    c1_claw:()=>({sp:'A grey cloak', fx:()=>{S.f.c1_claw=1;}, txt:
`He is standing between two tents where there isn't a fire, which means you saw him because he wanted you to. His boots are still clean. It's been raining ash for three days.

"Sergeant. Fine night for a walk."

${S.f.decoy ? `He holds out a satchel. Kettle's. "Your sapper's ledger. Every stick accounted for, one of them named, and a spoon listed under *equipment*. I've read the Imperial tax code, Sergeant. I've never been so thoroughly bored by a document." He lets Kettle take it. "Keep it. Lose it again and I'll know where to look."` :
  S.f.gaveClaw ? `"The High Mage sends his regards." A beat. "He doesn't, in fact. But it's the form, and you were helpful, and I like to see helpful people rewarded with the form."` :
  S.f.marked ? `"I know the name now. {sgt}. It's a good name." He lets that sit. "Try to keep it attached."` :
  S.f.clawFooled ? `"Grave detail," he says, pleasantly. "You'd be surprised how much of the camp has been on grave detail this week. Whole squads of it. Nobody's dug anything."` :
  `"Another time, I said, at the tunnel mouth. This is another time." He lets you look at his empty hands. "You'll have heard we're flying south. Not you. You're the wagon. I find I approve. Wagons see the country."`}`,
      ch:[{t:'"Who are you?"', go:'c1_claw_who'},
          {t:'"What do you want with the cadre tent?"', check:['wits',13], go:'c1_claw_tent', fail:'c1_claw_tent_fail'},
          {t:'Say nothing. Keep walking.', fx:()=>loy('brisk',1), go:'c1_claw_silent'}]}),
    c1_claw_who:()=>({sp:'A grey cloak', txt:
`"A concerned citizen of the Empire, Sergeant. There are more of us than you'd think, and fewer than the Empress would like."

Kettle, not quietly: "He's a Claw."

"Your sapper," he says to you, "is a credit to the marines and a hazard to everyone else. I mean that as a compliment. I'll be going."`,
      ch:[{t:'Let him.', go:()=>startExplore()}]}),
    c1_claw_tent:()=>({sp:'A grey cloak', fx:()=>{S.f.c1_clawTent=1;}, txt:
`You've been watching his eyes and they've gone to the cadre row three times. Not to the lamp. To the crate-shaped dark beside it.

"Nothing," he says, which is the first thing he's said that you're sure is a lie. "Cadre business. The cadre keep things they shouldn't, Sergeant, and then they keep them badly, and then someone has to tidy. I'm fond of tidy."

"If it comes to tidying tonight, you'll want to be on the tidy side of it."`,
      ch:[{t:'Let him go.', go:()=>startExplore()}]}),
    c1_claw_tent_fail:()=>({sp:'A grey cloak', txt:
`"The cadre tent?" He looks at it, mildly, as if you'd pointed out a hill. "I hadn't noticed it, Sergeant. I'll try to."

He's gone between the tents before you've decided whether that was an answer.`,
      ch:[{t:'Walk on.', go:()=>startExplore()}]}),
    c1_claw_silent:()=>({sp:'A grey cloak', txt:
`You walk past. Brisk walks past closer, so that her shield-rim is between him and you all the way. He allows it, which is the word for what he does.

"Sergeant," he says to your back. "Good habit. Keep it."`,
      ch:[{t:'Walk on.', go:()=>startExplore()}]}),
    c1_claw_again:()=>({sp:'A grey cloak', txt:`He's where he was. He hasn't moved, and the ash hasn't landed on him, and you decide not to think about either.`, ch:[{t:'Leave'}]}),

    /* ---- the Hounds ---- */
    c1_night:()=>({sp:'The camp at night', scene:'camp_night', fx:()=>{S.f.c1_hounds=1;}, txt:
`It starts as a scream from the cadre row. One voice, a man's, cut off in the middle as if a hand had closed on it. Then a mage's shout, Tattersail's, a word that isn't a word. Then the lamp in the cadre tent goes out and something else comes on, a light that is the wrong colour for fire and the right colour for nothing.

Then the dogs.

They aren't dogs. Brisk knows it before you do; her shield is up and her feet are set and she is saying "Sergeant" in a voice you have heard exactly once before, at Nathilog. Tuft has both hands out and her cloak is *gone*, not lifted, gone, and she is whispering the name of her warren the way you'd whisper the name of a friend who's just walked into a room full of enemies.

Something the size of a horse goes over the picket line without touching it. Something else, further off, howls, and the howl has a shape, and the shape is Shadow.

"Hounds," Tuft says. "Hounds of *Shadow*. Sergeant, they're hunting. That's a hunt."`,
      ch:[{t:'"Form on me. Cadre row."', go:'c1_orders'}]}),
    c1_orders:()=>({sp:'The cadre row', txt:
`The cadre row is on fire, or the tents nearest it are. There is a shape in the flames that is all shoulders and teeth, and a smaller shape in front of it that is a man with a sword, and the man is Paran, and the sword is doing something a sword shouldn't.

Two voices reach you at once.

Tattersail, from her tent, through the canvas, hoarse: *"Sergeant! The line. Hold the line by the cadre row. Give me four rounds and I'll give you a way out."*

And from the dark to your left, the grey cloak, unhurried, close enough to touch: "Leave the mage, Sergeant. She'll live or she won't. Seal the cadre tent and hold the crate. My people will hold with you. Three rounds. Then we're gone and so are you."

${S.loy.tuft >= 2 ? `Tuft, at your shoulder, so quiet only you hear it: "Her. Please."` : `Tuft is looking at the grey cloak the way she looks at the Deck when it's about to say something.`}

${S.loy.brisk >= 2 ? `Brisk: "Your call, Sergeant. I'll tell you after if it was stupid."` : `Brisk is waiting. Brisk is always waiting.`}`,
      ch:[{t:'"The line. On Tattersail. Hold the cadre row."', go:'c1_line_go'},
          {t:'"The crate. Seal the tent. Grey cloak, your people had better be worth it."', go:'c1_claw_go'}]}),
    c1_line_go:()=>({sp:'The cadre row', fx:()=>{S.f.c1_key='line'; loy('tuft',2); S.f.cadreTrust=1;}, txt:
`"The line," you say, and the squad moves before the word's finished. Brisk to the front. Kettle behind the shield, already fusing. Ohl to the rear, his cudgel in one hand and Denul in the other. Tuft, for once, exactly where you can see her.

The grey cloak says nothing. He's not there when you look again.

The first Hound comes through the tents like a wave through a fence. It's the colour of a bruise. It has eyes. It's called Gear, though you won't know that till later, and it's looking past you at the captain, and you are in the way.`,
      ch:[{t:'Hold the line.', go:()=>startBattle('hounds_line',{surprise:'e'})}]}),
    c1_claw_go:()=>({sp:'The cadre tent', fx:()=>{S.f.c1_key='claw'; loy('tuft',-2); loy('brisk',-1); S.f.clawFavour=1;}, txt:
`"The crate," you say. Tuft makes a sound. Brisk doesn't, which is worse.

Two figures come out of the dark on your flanks, grey, quiet, with knives already out and faces you'll never be able to describe. They don't look at you. They look at the tent, and the crate in it, and the flames.

The grey cloak, to nobody: "Three rounds, Sergeant. Then we tidy."

The first Hound comes through the tents like a wave through a fence. It's the colour of a bruise. It's called Gear, though you won't know that till later, and it does not care whose people are holding what.`,
      ch:[{t:'Seal the tent.', go:()=>startBattle('hounds_claw',{surprise:'e'})}]}),

    /* ---- after: the line ---- */
    // win() has already awarded the battle's xp and noted any level-up; these nodes only add the flavour note
    c1_after_line:()=>({sp:'The cadre row', scene:'camp_night', fx:()=>{ note('You held. Nobody holds against Hounds. Nobody has to know that.','good'); gain('houndtooth'); }, txt:
`It ends the way weather ends. The Hounds are there and then they are elsewhere, and the elsewhere is Shadow, and the tent lines are on fire and quiet.

The big one, Gear, goes last. It goes slowly. There's a wound down its shoulder that steams, a sword-wound, and it looks back once, at the cadre tent, and the look is not an animal's. Then it limps into a dark that isn't the camp's dark and is gone.

Brisk lowers the shield an inch. Kettle is laughing, which she does after, and it's not a good sound, and Ohl is already moving to her. Tuft is sitting down. She didn't decide to.

There's a tooth the length of a finger snapped off in a tent pole beside you. It's warm.`,
      ch:[{t:'The cadre tent.', go:'c1_after_line_tat'}]}),
    c1_after_line_tat:()=>({sp:'Tattersail', scene:'tent', txt:
`Tattersail's tent is standing, which is more than can be said for the row. Inside, the captain is on her cot with his shirt open and a wound in him that should have been the end of the conversation. Ohl looks at it, looks at her, and says something in Ehrlii that is not an argument for once.

"He's alive," Tattersail says. She's grey. Her hands are shaking and she's letting them. "Somebody put a knife in him before the Hounds came. Not the Hounds. A knife, in the dark, a good one. He should have died an hour ago. Then he put a sword in a Hound of Shadow, and now he's not dead, and I don't know why, and I've stopped asking the cards because they laugh."

${S.f.c1_sawHairlock ? `The puppet is where it was. Its head has turned to look at the captain. Nobody mentions it.` : `The puppet on the crate has fallen over. Nobody rights it.`}

"You held the row, Sergeant. The cadre don't forget that. There aren't enough of us left to afford to." She looks at Tuft, once, and Tuft looks back, and something passes between them that you weren't invited to. "Go and find Whiskeyjack. He'll want it from you before he gets it from anyone else."`,
      ch:[{t:'Find Whiskeyjack.', go:()=>talk(S.f.marked ? 'c1_accounting' : 'c1_wj_last')}]}),

    /* ---- the Claw's accounting (marked + line only) ---- */
    c1_accounting:()=>({sp:'The picket line', scene:'camp_night', fx:()=>{S.f.c1_accounting=1;}, txt:
`Halfway to the Bridgeburners' fire, the picket line. The stakes cast two shadows each, which is wrong, and Tuft stops walking.

"Three," she says. "No. Three I can see."

They come out from between the stakes without hurrying: grey, hooded, knives low. Not the ones who would have held with you. Different ones. The kind sent when a name has been written in a neat hand and the line under it is due.

One of them speaks. It isn't the grey cloak's voice, but it's his phrasing. "Sergeant {sgt}. There's a ledger. You're in it. We'd like to close the entry."`,
      ch:[{t:'"Wrong night. The Fourth held the cadre row for Tattersail. Ask her whose ledger you\'re in."', check:['guile',14], go:'c1_acc_slip', fail:'c1_acc_fight'},
          {t:'Kettle steps forward with the cusser in both hands.', req:()=>S.inv.cusser>0, go:'c1_acc_bluff'},
          {t:'"Brisk. Shield."', go:'c1_acc_fight'}]}),
    c1_acc_slip:()=>({sp:'The picket line', fx:()=>{S.f.c1_accAvoided=1; loy('tuft',1);}, txt:
`It's a long silence. Somewhere behind them the cadre row is still burning.

"Tattersail," the hooded one says, as if tasting it. Then, to the others, a small movement of the hand.

They go back between the stakes the way they came, and the stakes go back to casting one shadow each.

Tuft lets a breath out. "That won't work twice."

"Didn't need to," says Brisk.`,
      ch:[{t:'Find Whiskeyjack.', go:'c1_wj_last'}]}),
    c1_acc_bluff:()=>({sp:'The picket line', fx:()=>{S.f.c1_accBluffed=1; loy('kettle',1); loy('brisk',-1);}, txt:
`Kettle walks out in front of the shield with the cusser held in both hands, the way she'd carry a bowl too full. She stops at the distance where it would kill all of them and most of you.

"This is ${S.f.c1_cusserSold ? 'Gerrun' : 'Maud'}," she says. "Say hello."

Nobody says hello. The one who spoke looks at the cusser, and at Kettle's face, which is a bad liar's face and is not lying, and then he looks at the sky as if calculating a distance.

"Another night," he says, and they are gone, and Kettle stands there a while longer holding it before she remembers to be frightened.

Brisk, from very far behind the shield: "Never. Again."`,
      ch:[{t:'Find Whiskeyjack.', go:'c1_wj_last'}]}),
    c1_acc_fight:()=>({sp:'The picket line', txt:
`"Shield," you say, and Brisk's is already up, and the first knife rings off it.`,
      ch:[{t:'Fight', go:()=>startBattle('accounting',{})}]}),
    c1_after_accounting:()=>({sp:'The picket line', scene:'camp_night', fx:()=>{ note('The ledger stays open. That is not nothing.','good'); S.f.c1_accFought=1; }, txt:
`When it's done, none of them are there. Not dead there; not there. The ground where they fell is ground. Ohl stares at it a long time.

"They don't leave their own," Tuft says. "Ever. It's the only rule they keep."

There's blood on Brisk's spear. That much is real. She wipes it on the nearest stake and says nothing, and you know that she's keeping count, and that it isn't of them.`,
      ch:[{t:'Find Whiskeyjack.', go:'c1_wj_last'}]}),

    /* ---- after: the crate ---- */
    c1_after_claw:()=>({sp:'The cadre tent', scene:'camp_night', fx:()=>{ note('You held the crate. Somebody else held the row.','good'); }, txt:
`It ends the way weather ends. The Hounds are there and then they are elsewhere, and the two grey figures who held with you are elsewhere too, at the same moment, as if they'd all left by the same door.

The big one, Gear, goes last. It goes slowly. There's a wound down its shoulder that steams, a sword-wound, and it looks back once at the cadre tent, and the look is not an animal's.

The grey cloak is inside the tent. You didn't see him go in. He comes out with his hands in his cloak and something under his arm, and he's not hurrying.

${S.ending === 'given' || S.ending === 'told' ? `It's a page. One page, oilcloth-wrapped, in a small careful hand you'd know from a lantern-lit junction under the north quarter. Varrow's. "A loose leaf," he says. "The cadre keep things badly. I said." He tucks it away.` :
  `It's a crate lid. The crate lid. He holds it the way you'd hold a tray. Resin and old bandage and a smell like a cellar. "Luggage," he says. "Somebody should have declared it." He tucks it under his arm.`}

"Three rounds, Sergeant. You held them. That's been noted, and by better people than me." He puts something in your hand: a short knife, no maker's mark. "For the road. The wagon's a long way round, and the plain's not friendly."`,
      ch:[{t:'Take it.', fx:()=>{gain('clawknife');}, go:'c1_after_claw_tat'},
          {t:'"Keep it."', fx:()=>{loy('brisk',1); S.f.c1_refusedKnife=1;}, go:'c1_after_claw_tat'}]}),
    c1_after_claw_tat:()=>({sp:'Tattersail', scene:'camp_night', txt:
`Tattersail is standing in the wreck of the cadre row with her shawl gone and her hands shaking, and she's letting them. The captain is behind her on a cot dragged out of the tent, shirt open, a wound in him that should have been the end of the conversation, and it isn't.

"He's alive." She doesn't look at you. "Somebody put a knife in him before the Hounds came. Then he put a sword in one of them. He should have died twice tonight and he's done neither, and I've stopped asking the cards because they laugh."

Then she does look at you. It isn't anger. It's an estimate, revised.

"You held the crate, Sergeant. For him. I heard the order and I heard you take it." A pause. "The cadre will remember that too. There aren't many of us left, and we have long memories, and nothing else to do with them."

${S.f.c1_sawHairlock ? `Behind her, in the open tent, the puppet sits on its crate${S.ending === 'given' || S.ending === 'told' ? `` : ` with no lid`}. Its head is turned toward you. It stays turned.` : `Behind her, in the open tent, the puppet has fallen off its crate and lies with its face to the canvas. Nobody rights it.`}

Tuft won't look at you. She's looking at the place between the tents where the grey figures stood, as if learning it.`,
      ch:[{t:'Find Whiskeyjack.', go:'c1_wj_last'}]}),

    /* ---- Whiskeyjack's last orders ---- */
    c1_wj_last:()=>({sp:'Whiskeyjack', scene:'fire', txt:
`The Bridgeburners' fire has more people round it now and none of them are talking. Whiskeyjack is standing, which you haven't seen him do. Quick Ben is sitting with his back to a saddle and his eyes shut, and his lips are moving, and Kalam is standing over him the way Brisk stands over a fire.

"Sergeant." Whiskeyjack looks the squad over, counting, and gets to five. "Captain's alive. Tattersail says. Nobody's happy about how. Hounds of Shadow in an Imperial camp and the only thing in it that could put a sword in one was a noble-born captain who's been here half a day." He rubs his face. "I've stopped asking what that means. Quick's asking. Quick's welcome to it."

${S.f.c1_key === 'line' ? `"You held the row. For the cadre. That's going to matter more than you think and less than you'd like. The Host doesn't love the cadre, Sergeant, and the Claw don't love anybody who does." ${S.f.wjRegard > 0 ? `"But I do. Noted."` : S.f.wjRegard < 0 ? `"It's a start."` : `"Noted."`}` :
  `"You held the tent. For the grey cloaks." He says it without weight, and that's the weight. "I won't ask what they took. I'll know by morning anyway. But you'll want to remember that people who help the Claw once get asked twice, and the second time it isn't a request." ${S.f.wjRegard > 0 ? `"You came out of a hole with all five. Keep it five. That's the whole of my advice."` : S.f.wjRegard < 0 ? `"Fourth Squad." Nothing else.` : `"Go and sleep."`}`}

"Wagon leaves at dawn. Baggage, Rhivi guide, the Fourth. South, then east, then Darujhistan. We'll be there a week before you. Try not to be interesting on the way."`,
      ch:[{t:'"Sir."', go:'c1_close'}]}),
    c1_close:()=>({sp:'The Fourth\'s fire', scene:'camp_night', fx:()=>{S.f.c1_done=1;}, txt:
`Back at your own fire, which is smaller and still there. Brisk is standing over it. Kettle is counting. Ohl has the oilcloth open on his knee and has not added a name, and closes it, and you watch him decide not to say so.

Tuft is at the edge of the light with her back to the cadre row.

${S.f.c1_key === 'line' ? `"Sergeant." She doesn't turn round. "Thank you." It's the first time she's said it. She doesn't say for what, and you don't ask, and after a while she comes and sits down by the fire, on the side where you can see her.` :
  `"Sergeant." She doesn't turn round. "The grey cloak. At the tent, when his people held with us. He called me by my name." A long silence. "Not the one you'd think. The other one." She doesn't come to the fire. She stays where she is, in the dark, where you can't see her cast.`}

Somewhere north, the cadre row is still burning. Somewhere south, a long way, a city with blue fire in its streets that has never heard of you. The wagon leaves at dawn.`,
      ch:[{t:'Dawn.', go:()=>chapterEnd(1, S.f.c1_key || 'line')}]}),
  }
};
