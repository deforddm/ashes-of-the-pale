/* ============ the prologue: dialogue (Tattersail, the tunnels under the Pale) ============ */
/* who did it, from a flag that kept a roller's id (S.f.x = ROLL().who): the id while they are still in the squad, else '' */
const pWho = k => { const w = S.f[k]; return typeof w === 'string' && TPL[w] && SQUAD().includes(w) ? w : ''; };
const pYou = id => !id || id === 'sgt' ? 'you' : NAME(id);
const pYour = id => !id || id === 'sgt' ? 'your' : NAME(id) + '\'s';
/* the grey cloak backs off a stand-off, but goes away with a name: shared by both "close ranks" checks at the tunnel mouth */
const pClawNear = {t:()=>{ const w = ROLL().who; return w && w !== 'sgt' ? `He goes. But he goes looking at ${NAME(w)}, and says “${NAME(w)}” on his way past, pleasantly, as if he'd always known it. Nobody told him.` : `He goes. But he says “Another time” to you, specifically, the way a man makes an appointment.`; },
  fx:()=>{ S.f.p_clawNamed = ROLL().who || 'sgt'; }};
/* the prologue's one new face on a battle map: Moreau, at the heart of the deserters' second ground (BATTLES.deserters.stage2).
   The prologue has no chapter module, so he is added to FOES here, the way registerChapter() adds a chapter's foes. */
Object.assign(FOES, {moreau:{name:'Moreau', sig:'M', kind:'deserter', hp:18, ac:14, atk:4, dmg:[1,8,2], rng:1, mv:4, init:2, sk:['parry'], verb:'cuts at'}});
function tatRest(){
  const c = [{t:`"We'll bring it back."`, go:'tat_end'}];
  if (!S.f.askedJ) c.push({t:'Ask what\'s actually in the journal.', check:['wits',12], fx:()=>S.f.askedJ=1,
    near:{t:'She answers. Then she reties the oilcloth on a bundle of her own, slowly, three turns and a tuck, so you can watch how it\'s done. She will know if Varrow\'s has been opened.', fx:()=>{ S.f.p_tatKnots = 1; }},
    clean:{t:'“Look at the dates,” she adds, almost to herself. “Not the words. The dates.”', fx:()=>{ S.f.p_tatDates = 1; }},
    go:'tat_wits_ok', fail:'tat_wits_fail'});
  // ✦ Tattersail's Fold: one look, once a playthrough
  c.push({t:'Watch her hands as she folds a bad card back into the spread.', check:['wits',15], trick:'fold', req:()=>!S.f.p_foldTried, fx:()=>{ S.f.p_foldTried = 1; },
    edges:id => [id === 'tuft' && ['a Deck of her own, up her sleeve', 1]], go:'p_fold_ok', fail:'p_fold_fail'});
  if (!S.f.paid) c.push({t:`"Tunnels under a fallen city. That's the kind of job that fills pits."`, fx:()=>S.f.paid=1, go:'tat_pay'});
  return c;
}
const DLG = {
  intro_tat:()=>({sp:'Tattersail · cadre mage', scene:'tent', txt:
`The tent smells of candle smoke and wet canvas. The mage doesn't look up from the cards laid out across her camp table.

"Sergeant {sgt}. Not a Bridgeburner. Good. The Bridgeburners have enough people watching them."

"Varrow was cadre. He went into the sapper tunnels under the north quarter the night before the assault, and when the sky came down, the tunnels came down with it. Nobody has gone back for him." She turns a card and doesn't like it. "He carried a satchel. His journal is in it. I want it brought to me. To *me*, Sergeant, and to no one who asks nicely along the way."`,
    html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div>`, oncard:['orb',true],
    ch:tatRest()}),
  tat_wits_ok:()=>({sp:'Tattersail', scene:'tent', txt:
`${by({ohl:`Ohl asks it, gently, the way he asks a man where it hurts when he already knows.`,
  tuft:`Tuft asks it, from just inside the flap, in the flat cadre way of asking that isn't quite a question.`,
  kettle:`"Is it maps?" Kettle asks. "Tell me it's maps. I'm good with maps."`,
  sgt:`You ask it.`, _:`{who} asks it.`})}

She studies ${by({sgt:'you', _:'{who}'})} over the cards, long enough to decide something.${by({tuft:` Longer than she has looked at anyone else in the tent.`, _:''})}

"Timing. Who ordered what, and when, the night the Second died. Varrow was a careful man. He wrote things down."

${by({tuft:`Tuft, having asked, has gone very still.`, _:`Behind you, Tuft has gone very still.`})}`, ch:tatRest(), fx:()=>{S.f.knowStakes=1;}}),
  // a bad question gets a warning instead of an answer: the satchel is tied the cadre way, and she will know (paid off in 'final' and Ch1's tent)
  tat_wits_fail:()=>({sp:'Tattersail', scene:'tent', fx:()=>{ S.f.p_tatKnots = 1; }, txt:
`${by({ohl:`Ohl asks it, gently. It comes out sounding like a diagnosis, and she doesn't care for it.`,
  tuft:`Tuft asks it, from the flap, too quietly and too exactly, the way the cadre ask. Tattersail doesn't look up.`,
  kettle:`"Is it maps?" Kettle asks. "Tell me it's maps." It is the wrong question in the wrong tent.`,
  sgt:`You ask it, and hear it come out as curiosity, which is the wrong thing to bring into a cadre tent.`,
  _:`{who} asks it, and it comes out as curiosity, which is the wrong thing to bring into a cadre tent.`})}

"Paper, Sergeant. It's full of paper." She takes a strip of oilcloth off the table and ties it round a bundle of her own without hurrying: three turns and a tuck. "Varrow's satchel is tied like that. I'll know if it's been opened."

The cards offer you nothing more, and neither does she.`, ch:tatRest()}),
  /* ✦ the Fold: whoever watched her hands learns it (the engine grants the trick); a miss and the Deck noticed (paid off at Tuft's draw) */
  p_fold_ok:()=>({sp:'Tattersail', scene:'tent', txt:
`She turns another card, and doesn't like that one either, and her fingers take it back into the spread so smoothly that you'd swear it never came up. Another comes up in its place. She doesn't look at it any more fondly.

${by({tuft:`Tuft has been watching her hands, not the cards. Later, in the lee of Pell's wagon, she does it once with her own Deck, badly, and then again, not badly. "It lets her," she says, to the cards. "It might let me. Sometimes."`,
  ohl:`Ohl has been watching her hands the way he watches a surgeon's, for the moment the knife goes in. "It's a stitch," he says later, outside, pleased with himself. "Under, over, and the cut never shows. I'll show the child. She'll pretend she knew."`,
  kettle:`Kettle has been watching her hands the way she watches a fuse. "That's a *palm*," she breathes, outside, delighted. "A card-sharp's palm. A cadre mage." She makes Tuft let her try it in the lee of Pell's wagon, until Tuft takes the Deck back and does it herself, properly, to make her stop.`,
  sgt:`You've been watching her hands, not the cards. Under, over, and the turned card is simply not there any more. You think you could do it, if a card ever came up that you couldn't live with. You think Tuft could do it better.`,
  _:`{who} has been watching her hands, not the cards. Under, over, and the turned card is simply not there any more.`})}

"Don't stare, Sergeant." She doesn't look up. "It's the only trick the cadre teach, and we don't teach it. The Deck lets me. Mostly. It may not let you."`, ch:tatRest()}),
  p_fold_fail:()=>({sp:'Tattersail', scene:'tent', fx:()=>{ S.f.p_foldFail = 1; }, txt:
`She turns another card, doesn't like it, and it goes back into the spread under ${by({sgt:'your', _:'{who}\'s'})} eyes without ever seeming to move. Another comes up.

She lays one hand flat over the cards, the way you'd put a hand on a dog's head. "Don't watch the Deck do that," she says, not unkindly. "It notices. They talk to each other, Decks."${SQUAD().includes('tuft') ? `

In the flap, Tuft pulls her sleeve down over her own.` : ''}`, ch:tatRest()}),
  tat_pay:()=>({sp:'Tattersail', scene:'tent', txt:
`"It is exactly that kind of job." A purse lands on the table beside the cards. "Which is why you're being paid for it, and why I asked for a squad with a sapper."`,
    fx:()=>{S.silver += 10; note('+10 silver','good'); loy('brisk',1); AUDIO.play('coin');}, ch:tatRest()}),
  tat_end:()=>({sp:'Tattersail', scene:'tent', txt:
`"The tunnel mouth is by the north wall. There are grey cloaks near the crater. If one of them talks to you, you're on grave detail."

She's back to her cards before you reach the flap. "Go."`,
    ch:[{t:'Leave the tent', go:()=>{ S.f.quest = 1; startExplore();
      elog(`<em>Ohl:</em> "Nobody's good at tunnels. Some of us just come out of them."`);
      elog(`<em>Kettle:</em> "Tunnels. Finally, something I'm good at."`); }}]}),
  tat_map:()=>({sp:'Tattersail', txt:`"North wall, Sergeant. The cards aren't getting any better while you stand there."`, ch:[{t:'Leave'}]}),

  pell:()=>({sp:'Quartermaster Pell', txt:
`Pell has a wagon, a ledger, and the face of a man who has been asked for things all week. "Moranth don't give these away, and neither do I."

You carry ${S.silver} silver.`,
    ch:[
      {t:'Sharper, 6 silver', tag:`have ${S.inv.sharper}`, req:()=>S.silver>=6, fx:()=>{S.silver-=6;S.inv.sharper++;note('Bought a sharper.','good');}, go:'pell'},
      {t:'Burner, 5 silver', tag:`have ${S.inv.burner}`, req:()=>S.silver>=5, fx:()=>{S.silver-=5;S.inv.burner++;note('Bought a burner.','good');}, go:'pell'},
      {t:'Healing salve, 5 silver', tag:`have ${S.inv.salve}`, req:()=>S.silver>=5, fx:()=>{S.silver-=5;S.inv.salve++;note('Bought a salve.','good');}, go:'pell'},
      {t:'"Got any cussers?"', req:()=>!S.f.askedCusser, fx:()=>S.f.askedCusser=1, go:'pell_cusser'},
      {t:'Leave'}]}),
  pell_cusser:()=>({sp:'Quartermaster Pell', txt:`"Cussers." He laughs without moving his face. "Your sapper's already got one, and I'd take it off her if I thought I'd live through the conversation."`, ch:[{t:'Back', go:'pell'}]}),

  garrow:()=>({sp:'Garrow · Second Army', fx:()=>S.f.garrow=1, txt:
`A soldier of the Second sits by the burial pits with his helmet in his lap, counting the pits under his breath. His armour is scorched in a pattern that looks almost like handprints.`,
    ch:[{t:'Share your water with him.', fx:()=>loy('ohl',1), go:'garrow_saw'},
        {t:'"What did you see that night?"', go:'garrow_saw'},
        {t:'Leave him be.'}]}),
  garrow_saw:()=>({sp:'Garrow', fx:()=>S.f.knowDeserters=1, txt:
`"The sky opened. Not the Spawn. *Ours.* I watched the cadre tents light up like lanterns, one after another." He turns the helmet over. "Some of my lot went down the north tunnels last night. Moreau's section. They're after dead officers' purses. If you run into them, tell them Garrow says the Fist is still counting heads. They might think twice."`,
    ch:[{t:'"We will."'}]}),
  garrow_again:()=>({sp:'Garrow', txt: S.f.p_garrowCrossed ?
`He isn't counting the pits any more. He's sitting with his helmet on and his back to them, watching the north wall.

"One of Moreau's came up out of the rubble an hour ago," he says, without looking round. "Asking after me. By name." He settles the helmet. "I'm still here. I'd like that to go on being true."` :
`He's still counting the pits. He's lost his place twice since you last passed.`, ch:[{t:'Leave'}]}),

  claw:()=>({sp:'A grey cloak', fx:()=>S.f.clawMet=1, txt:
`A man in a grey cloak stands at the crater's lip, watching the violet shimmer at the bottom where the ground still hasn't decided whether to be ground. His boots are clean. Nobody's boots are clean.

"Fine night for a walk, Sergeant. Business in the north quarter?"`,
    ch:[{t:'Give him the grave-detail story.', check:['guile',13], edges:()=>[S.f.garrow && ['lime from the burial pits on your boots', 1]],
          near:{t:'He believes it. He also looks at each of you in turn before he goes, the way a clerk looks at a page he means to copy out later.', fx:()=>{ S.f.p_clawFaces = 1; }},
          go:'claw_fooled', fail:'claw_doubt'},
        {t:'"Who\'s asking?"', go:'claw_noone'},
        {t:'Say nothing and keep walking.', fx:()=>loy('brisk',1), go:'claw_silent'}]}),
  claw_fooled:()=>({sp:'A grey cloak', fx:()=>S.f.clawFooled=1, txt:
`${by({tuft:`"Grave detail," says Tuft, before you can, in a voice so ordinary it is barely there. She doesn't look at him. She looks at the crater, the way you'd look at a pit you've been told to fill.`,
  kettle:`"Grave detail," says Kettle, with the total confidence of a woman who has never once been on grave detail, and adds that the Fist wants the north quarter done by morning, which she personally thinks is optimistic.`,
  sgt:`"Grave detail," you say.`, _:`"Grave detail," says {who}.`})}

"Grim work. Hood keeps a long ledger." He looks back into the crater. When you glance over again, he isn't there.${by({tuft:`

Tuft doesn't let her breath go until the rubble line.`, _:''})}`, ch:[{t:'Move on'}]}),
  // the lie that didn't take: he waits at the tunnel mouth knowing it, and Kettle's decoy pays for it there
  claw_doubt:()=>({sp:'A grey cloak', fx:()=>{ S.f.p_clawDoubt = 1; S.f.p_clawLiar = ROLL().who || 'sgt'; }, txt:
`${by({tuft:`"Grave detail," says Tuft, a breath too quickly, and he looks at her properly, the way nobody should ever look at a mage.`,
  kettle:`"Grave detail," says Kettle, and then, because the silence goes on, "Lots of graves. Big detail. We're the detail."`,
  sgt:`"Grave detail," you say, and hear it land wrong.`, _:`"Grave detail," says {who}, and it lands wrong.`})}

"Of course." He smiles like a man writing something down. "Carry on."`, ch:[{t:'Move on'}]}),
  claw_noone:()=>({sp:'A grey cloak', txt:`"No one, Sergeant. It's a worthy ambition. You should try it."`, ch:[{t:'Move on'}]}),
  claw_silent:()=>({sp:'A grey cloak', txt:`You walk past. You can feel him not watching you all the way to the rubble line.`, ch:[{t:'Move on'}]}),
  claw_again:()=>({sp:'A grey cloak', txt:`He's still at the crater. He doesn't look at you, which is worse.`, ch:[{t:'Leave'}]}),

  mouth:()=>({sp:'North wall · tunnel mouth', txt: S.card || S.f.noCard ?
`The shoring beams creak in a wind that isn't blowing. Kettle has her lantern lit. Brisk has her shield up.` :
`The tunnel mouth is a black slot in the rubble, shored with scavenged beams. Tuft crouches beside it and slides a battered Deck of Dragons out of her sleeve.

"For luck," she says, which is not what a Deck is for.`,
    ch: S.card || S.f.noCard ? [{t:'Descend', go:'approach'},{t:'Not yet'}] :
      [{t:'Let her draw a card.', go:()=>cardSequence(()=>talk('card'))},
       {t:'"No readings. We go."', fx:()=>{S.f.noCard=1; loy('brisk',1); loy('tuft',-1);}, go:'approach'},
       {t:'Not yet'}]}),
  card:()=>{ if (!S.card) S.card = dealCard(['oponn','obelisk','knight','assassin']); const c = CARDS[S.card];
    return {sp:'The Deck of Dragons', txt: S.f.p_foldFail ?
`Tuft lays the reading out on the rubble. Three cards refuse her. The fourth does not.

"They talk to each other," she says, not looking at anyone. "Decks."` :
`Tuft lays the reading out on the rubble. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)} · ${esc(c.fx)}</div>`, oncard:[S.card,false],
      after:c.txt, ch:[{t:'Descend', go:'approach'}]}; },
  approach:()=>({sp:'North sapper tunnel', fx:()=>{S.bg='tunnel';}, scene:'tunnel', txt:
`Forty paces in, lamplight. Voices. Four figures crouch around a collapsed timber, prying at something with a spear-butt: Malazan kit, company badges cut off. Deserters.

Nobody has seen you yet.`,
    ch:[
      // knowing Garrow's word is what makes this one easy; the edge says so out loud
      {t:'Call Moreau by name, and give them Garrow\'s word.', req:()=>S.f.knowDeserters, fx:()=>{S.f.garrowWord=1;}, check:['guile',14], edges:()=>[['Garrow\'s word', 4]],
        near:{t:()=>S.f.p_moreauPaid ? `They go. The last of them stops at the edge of the light with his hand out, and Garrow's word turns out to be worth ${['','one','two','three'][S.f.p_moreauPaid]} silver to a man with a long way to run.` : `They go. The last of them stops at the edge of the light with his hand out, finds nothing worth taking, and spits on ${pYour(ROLL().who)} boots instead. It stays with ${pYou(ROLL().who)}: −1 on the next check.`,
          fx:()=>{ const p = Math.min(3, S.silver); S.silver -= p; S.f.p_moreauPaid = p; if (!p) S.rattled[ROLL().who] = 1; }},
        go:'desert_flee', fail:'p_desert_named'},
      {t:'Talk them down.', check:['guile',14], edges:id => [id === 'kettle' && ['her satchel does half the talking', 1]],
        near:{t:()=>`Two of them go. The crossbow stayed on ${pYou(ROLL().who)} for the whole of the talking, and it is still there afterwards, behind the eyes: −1 on the next check.`, fx:()=>{ S.rattled[ROLL().who] = 1; }},
        go:'desert_half', fail:'desert_fight'},
      {t:'Hit them before they know you\'re here.', go:()=>startBattle('deserters',{surprise:'p'})},
      {t:'Kettle rolls a sharper in first.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0,
        fx:()=>{S.inv.sharper--; S.f.noisy=1;}, go:()=>startBattle('deserters',{pre:true})}]}),
  desert_flee:()=>({sp:'North sapper tunnel', txt:
`${by({tuft:`"Moreau." Tuft doesn't raise her voice; she doesn't have to. "Garrow says the Fist is still counting heads." Every head in the lamplight turns the wrong way, looking for her.`,
  kettle:`"Moreau!" Kettle, cheerfully, as if hailing a barge. "Garrow says the Fist is still counting heads! He says hello." A pause. "He didn't say hello."`,
  brisk:`"Moreau." Brisk, in the regiment voice, the one that carries down a line of shields. "Garrow says the Fist is still counting heads."`,
  sgt:`"Moreau!" Your voice goes down the tunnel ahead of you. "Garrow says the Fist is still counting heads."`,
  _:`"Moreau!" {who} calls down the tunnel. "Garrow says the Fist is still counting heads."`})}

The lamp swings round. A long silence, then a thin voice: "Garrow's alive?" Then boots, running, the other way. One of them leaves the lamp behind.

Brisk watches them go. "Malazans running from Malazans. Hood's laughing somewhere."`,
    fx:()=>{ const up = gainXP(100); note('+100 experience. Talking them down is soldiering too.','good'); if (up) note(`The squad reaches level ${S.lvl}. Everyone is tougher and hits harder.`,'good'); },
    ch:[{t:'Press on', go:'deep1'}]}),
  // Garrow's word, said wrong: one of them runs for the surface with Garrow's name (garrow_again, Ch1's pits and close)
  p_desert_named:()=>({sp:'North sapper tunnel', fx:()=>{ S.f.p_garrowCrossed = 1; }, txt:
`${by({tuft:`"Moreau. Garrow says the Fist is still counting heads." Tuft says it too softly, and it comes out sounding like a question.`,
  kettle:`"Moreau!" Kettle, cheerfully, as if hailing a barge. "Garrow says the Fist is still counting heads!" It echoes. It goes on echoing.`,
  brisk:`"Moreau." Brisk, in the regiment voice. "Garrow says the Fist is still counting heads." It sounds like an arrest.`,
  sgt:`"Moreau!" you call. "Garrow says the Fist is still counting heads." It sounds like an arrest.`,
  _:`"Moreau!" {who} calls. "Garrow says the Fist is still counting heads." It sounds like an arrest.`})}

The lamp swings round. A long silence, then a thin voice: "Garrow's alive?" And another, not thin at all: "Then Garrow's got a mouth on him."

One of them is already running, back the way you came, toward the surface, the way a man runs who has somewhere to be. The other three come for you.`,
    ch:[{t:'Fight', go:()=>startBattle('deserters',{drop:[0]})}]}),
  // the two who back away go deeper, not up: they fetch Moreau (the second ground)
  desert_half:()=>({sp:'North sapper tunnel', fx:()=>{ S.f.p_desertHalf = 1; }, txt:
`${by({tuft:`Tuft steps into the light with empty hands and talks to them the way you'd talk to a dog you don't know: low, level, nothing sudden. She tells them the roof is coming down. She sounds like someone who would know.`,
  kettle:`Kettle steps into the light with her hands empty and her satchel very much not, and explains, with total confidence, which of the beams over their heads she has already wired. None of them. She is very specific about which.`,
  sgt:`You step into the light with empty hands and a sergeant's voice.`,
  _:`{who} steps into the light with empty hands and talks, low and level, about the Fist, and the gallows, and the long way round.`})} Two of them look at each other, then at your sapper's satchel, and back away into the dark. The other two have come too far to go back.`,
    ch:[{t:'Fight', go:()=>startBattle('deserters',{drop:[0,2]})}]}),
  // talking failed: they answer, and what they say follows the squad down to the journal
  desert_fight:()=>({sp:'North sapper tunnel', fx:()=>{ S.f.p_deserterWords = 1; }, txt:
`${by({tuft:`Tuft steps into the light and starts to talk, low and level, and one of them laughs at how young she is.`,
  kettle:`Kettle steps into the light and explains which of the beams she's wired. She gets as far as the third beam.`,
  sgt:`You step into the light with empty hands and a sergeant's voice, and the sergeant's voice is the wrong thing to have brought.`,
  _:`{who} steps into the light and starts to talk, and gets about four words in.`})}

"Second Army," one of them says. He's grey under the dirt, and his badge is cut off, and the cut is clean. "We *were* Second Army. Go and ask your High Mage where the rest of it went."

The lamp swings round. Someone cocks a crossbow.`, ch:[{t:'Fight', go:()=>startBattle('deserters',{})}]}),
  // the fight comes in two grounds: the last thirty paces, where the dark has pooled, then the junction itself (BATTLES.stone)
  deep1:()=>({sp:'Collapsed junction', scene:'dark', txt:
`Thirty paces on, the sapper tunnel ends in a chamber where three passages met before the ceiling came down. The lantern reaches just far enough to show you Varrow, or what's left of him, pinned under a beam with one hand still wrapped in a satchel strap.

The air between here and there is wrong: cold, and too dark, as if the lantern light has to push through water. "Kurald Galain," Tuft whispers. "The Spawn's warren leaked down here. Meanas will love it. Denul won't."

The dark between you and Varrow moves, the way water moves when something under it does. Further in, something shifts its weight. Something big.${S.f.noisy ? ` It isn't waking up. It's been awake since your sharper went off, and it's been waiting.${SQUAD().includes('brisk') && SQUAD().includes('kettle') ? `

"Sapper," says Brisk. Just that.

"I *know*," says Kettle. "I know. Next time I'll knock."` : ''}` : ''}`,
    ch:[{t:'Go straight for the satchel.', go:()=>startBattle('stone',{surprise:'e'})},
        {t:'"Form up. Shields front."', go:()=>startBattle('stone',{surprise:'p'})}]}),
  journal:()=>({sp:'Collapsed junction', scene:'tunnel', fx:()=>{S.f.gotSatchel=1;}, txt:
`Varrow's satchel is heavy with oilcloth-wrapped pages. The top sheet is dated the night of the assault.${S.f.p_tatKnots ? ` The oilcloth is tied three turns and a tuck. Tattersail will know.` : ''}`,
    ch:[{t:'Read it by lantern light.', check:['wits',13], edges:()=>[S.f.knowStakes && ['Tattersail told you what to look for', 1], S.f.p_tatDates && ['“Look at the dates”', 1]],
          near:{t:'The top page tears along its fold as it comes free of the oilcloth. It reads. It doesn\'t go back in whole.', fx:()=>{ S.f.p_pageTorn = 1; }},
          fumble:{t:()=>`The lantern tips. A corner of the top sheet browns and curls before ${SQUAD().includes('ohl') ? 'Ohl slaps it out with his bare hand' : 'someone slaps it out'}.`, fx:()=>{ S.f.p_scorched = 1; }},
          go:'journal_read', fail:'journal_blur'},
        {t:'"Leave it closed. Not our business."', fx:()=>{loy('brisk',1); loy('tuft',-1);}, go:'journal_closed'}]}),
  journal_read:()=>({sp:'Varrow\'s journal', fx:()=>{S.f.knowTruth=1; S.f.p_reader = ROLL().who || 'sgt'; loy('tuft',1);}, txt:
`${by({ohl:`Ohl holds the page out at arm's length to the lantern, the way old men read, and reads it aloud in a low voice, and stops.`,
  tuft:`Tuft takes the page before anyone can tell her not to. She reads it once. She reads it again.`,
  kettle:`Kettle reads it with a finger under each line and her lips moving, the way she reads a Moranth seal.`,
  sgt:`Varrow's hand is small and careful.`, _:`{who} reads it by the lantern. Varrow's hand is small and careful.`})} Times. Positions. An order relayed through the High Mage's staff that moved the cadre forward, and a line underlined twice:

*Moved before the Spawn attacked. Not after.*

${by({tuft:`Tuft stops breathing. Then she starts again, and hands you the page open, the way you'd hand someone a knife: handle first.`, _:`Behind you, Tuft stops breathing. Then she starts again.`})}${S.f.p_deserterWords ? `

Nobody says *ask your High Mage where the rest of it went*. Nobody has to.` : ''}`,
    ch:[{t:'Close it. Head for the surface.', go:()=>talk(S.f.clawFooled ? 'final' : 'claw2')}]}),
  journal_blur:()=>({sp:'Varrow\'s journal', fx:()=>S.f.partial=1, txt:
`${by({ohl:`Ohl peels the oilcloth back with a healer's fingers, and it isn't enough.`,
  tuft:`Tuft has the pages before anyone can stop her, and her hands are not steady, and it isn't enough.`,
  kettle:`Kettle opens it the way she'd open a crate that might be primed, and it isn't enough.`,
  sgt:`You open it as carefully as you know how, and it isn't enough.`,
  _:`{who} opens it as carefully as anyone could, and it isn't enough.`})} Water has got in under the oilcloth. The ink has run, pages of it, too wet to read, except for one name that keeps surfacing like a drowned man: *Tayschrenn.*${S.f.p_deserterWords ? `

*Ask your High Mage*, the deserter said. Here is the High Mage's name, in a dead man's hand.` : ''}`,
    ch:[{t:'Head for the surface.', go:()=>talk(S.f.clawFooled ? 'final' : 'claw2')}]}),
  journal_closed:()=>({sp:'Collapsed junction', txt:`You buckle the satchel shut. Brisk grunts her approval. Tuft looks at the satchel the whole way up.${S.f.p_deserterWords ? ` *Ask your High Mage where the rest of it went.* She doesn't ask anyone anything. She looks at the satchel.` : ''}`,
    ch:[{t:'Head for the surface.', go:()=>talk(S.f.clawFooled ? 'final' : 'claw2')}]}),
  claw2:()=>{ const liar = pWho('p_clawLiar'), at = liar && liar !== 'sgt' ? NAME(liar) : 'you';
    return {sp:'A grey cloak', scene:'explore', fx:()=>{S.f.clawMet=1;}, txt: (S.f.clawMet ?
`The grey cloak from the crater is waiting at the tunnel mouth, leaning on the shoring as if he's been part of it since the siege. His boots are still clean.

"Grave detail," he says pleasantly${S.f.p_clawDoubt ? '' : `, though nobody said those words to him at the crater`}. "Find anything heavy? I'd be glad to carry it."` :
`A man in a grey cloak is waiting at the tunnel mouth, leaning on the shoring as if he's been part of it since the siege. His boots are clean. Nobody's boots are clean.

"Grave detail," he says pleasantly, before you can. "Find anything heavy? I'd be glad to carry it."`) + (S.f.p_clawDoubt ? `

He says *grave detail* to ${at}, not to the squad, and lets ${at} see him enjoy it. He has caught one story from the Fourth tonight. He is in the mood for another.` : ''),
    ch:[{t:'Hand it over.', go:'claw_took'},
        {t:'Close ranks. It\'s for the cadre.', check:['might',14], edges:()=>[S.f.knowTruth && ['you\'ve read what\'s in it', 1]], near:pClawNear, go:'claw_withdraw', fail:'claw_marked'},
        {t:'Let Kettle hand him "the satchel."', check:['guile',13,'kettle'], edges:()=>[S.f.p_clawDoubt && ['he caught one story already tonight', -2]],
          near:{t:'He takes it. He also takes a long look at Kettle, the kind that ends up in a ledger under a heading.', fx:()=>{ S.f.p_kettleLooked = 1; }},
          go:'claw_decoy', fail:'claw_decoy_fail'}]}; },
  claw_took:()=>({sp:'A grey cloak', fx:()=>{S.f.gaveClaw=1; loy('tuft',-2);}, txt:
`He takes the satchel without looking inside. "The Empress thanks you, Sergeant." He's gone before you can decide whether that was a joke. Tuft won't look at you.`,
    ch:[{t:'Report to Tattersail', go:'final'}]}),
  claw_withdraw:()=>({sp:'A grey cloak', fx:()=>loy('brisk',1), txt:
`${by({brisk:`Brisk's shield comes up, and the squad comes up behind it without being told. "For the cadre," she says. It's the most she's said all night.`,
  kettle:`Kettle steps up beside the shield with her crossbow cradled and a sharper in the cradle, and smiles at him, which is worse.`,
  sgt:`"It's for the cadre," you say, and the squad closes ranks behind the word.`,
  _:`"It's for the cadre," says {who}, and the squad closes ranks behind the word.`})}

Five marines. One Claw. A narrow place full of beams that might come down. He does the arithmetic out loud: "Another time, then."

When he's gone, Brisk lowers her shield about an inch.`, ch:[{t:'Report to Tattersail', go:'final'}]}),
  claw_marked:()=>({sp:'A grey cloak', fx:()=>{ S.f.marked=1; S.f.markedPale=1; }, txt:
`${by({brisk:`Brisk's shield comes up. He looks at it, and at her, and past her to you, and you understand that the shield was never the part of this he was interested in.`,
  sgt:`"It's for the cadre," you say, and the squad closes up, and he looks at the squad, and then only at you.`,
  _:`"It's for the cadre," says {who}, and the squad closes up, and he looks past {who}, and past the squad, and only at you.`})}

"Of course it is." He steps aside with a little bow. You have the distinct feeling of having been entered into a ledger, in a very neat hand.`, ch:[{t:'Report to Tattersail', go:'final'}]}),
  claw_decoy:()=>({sp:'A grey cloak', fx:()=>{S.f.decoy=1; loy('kettle',1);}, txt:
`Kettle hands over a satchel, *a* satchel anyway, with the sullen reluctance of a woman surrendering her life's work. He walks off with it under his arm.

It's her munitions ledger. "He can have it," she says. "I know where every cusser is anyway."`, ch:[{t:'Report to Tattersail', go:'final'}]}),
  // he reads Kettle's ledger before handing it back (she brings it up at the Ch1 fire)
  claw_decoy_fail:()=>({sp:'A grey cloak', fx:()=>{ S.f.p_decoyCaught = 1; }, txt:
`He opens it on the spot. "Munitions counts," he says. "Charming." He hands it back to Kettle. His eyes don't smile. "The real one, Sergeant."`,
    ch:[{t:'Hand it over.', go:'claw_took'},
        {t:'Refuse him. Let him see the shields.', check:['might',15], edges:()=>[S.f.knowTruth && ['you\'ve read what\'s in it', 1]], near:pClawNear, go:'claw_withdraw', fail:'claw_marked'}]}),
  final:()=> { const read = S.f.knowTruth || S.f.partial;
    const marks = [
      S.f.p_tatKnots ? (read ? `She looks at the knots before she looks at you. Three turns and a tuck, retied by someone who doesn't know the cadre way. "You opened it," she says. It isn't a question.` : `She looks at the knots before she looks at you. Three turns and a tuck, untouched. Something in her shoulders comes down an inch.`) : '',
      S.f.p_pageTorn ? `One page comes away in her hand, torn along its fold. She looks at the tear, and at the line underlined twice beside it, and puts the page back very carefully, on top.` : '',
      S.f.p_scorched ? `She touches the scorched corner of the top sheet with one finger. "You nearly saved me a decision," she says.` : ''].filter(Boolean).join(' ');
    return S.f.gaveClaw ? {sp:'Tattersail', scene:'tent', txt:
`Tattersail hears you out without looking up. When you finish she turns a single card: the Herald of High House Death.`,
    html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div>`, oncard:['herald',false],
    after:`"Then the High Mage will have it by morning," she says. "Go and get some sleep, Sergeant. Somebody should."`,
    ch:[{t:'Leave the tent', go:()=>finish('claw')}]} : {sp:'Tattersail', scene:'tent', txt:
`Back in the tent, the cards are exactly where she left them. Tattersail takes the satchel in both hands, the way you'd take something out of a fire.${marks ? `

${marks}` : ''}

"You came back with all five," she says. "That's a nice touch."`,
    ch:[{t:'"It\'s yours. We never saw it."', go:()=>finish('given')},
        {t:'"We read it. Moved before the Spawn attacked, not after."', req:()=>S.f.knowTruth, go:'final_told'},
        {t:'"Burn it. Knowing things gets soldiers killed."', go:'final_burn'}]}; },
  final_told:()=>({sp:'Tattersail', scene:'tent', fx:()=>loy('tuft',1), txt:
`She's quiet for long enough that the candle gutters.

"Then you understand why it came to me and not to him." She lays a card face-down on the satchel. "Forget the underlined part, Sergeant, for your squad's sake. I'll remember it for all of us."`,
    ch:[{t:'Leave the tent', go:()=>finish('told')}]}),
  final_burn:()=>({sp:'Tattersail', scene:'tent', fx:()=>{loy('ohl',1); loy('tuft',-1);}, txt:
`Ohl nods. Tuft doesn't. Tattersail looks at you like a woman revising an estimate.

"That's a soldier's answer," she says, and holds the first page to the candle herself. "It's not a wrong one. It just isn't the one Varrow died for."`,
    ch:[{t:'Leave the tent', go:()=>finish('burned')}]}),
};
