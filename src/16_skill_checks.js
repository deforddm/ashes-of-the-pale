/* ============ skill checks ============ */
function roller(stat, who){ const ids = who ? [who] : SQUAD(); let best = ids[0]; ids.forEach(id => { if (statOf(id, stat) > statOf(best, stat)) best = id; }); return best; }
function check(stat, dc, who){
  const best = roller(stat, who);
  const nat = d20(), mod = statOf(best, stat) + (S.card === 'oponn' ? 1 : 0), tot = nat + mod, ok = tot >= dc;
  const label = stat[0].toUpperCase() + stat.slice(1);
  note(SET.dice ? `${label} check (DC ${dc}): ${NAME(best)} rolls ${nat} + ${mod} = ${tot} · ${ok ? 'success' : 'failure'}` : `${label} check: ${NAME(best)} · ${ok ? 'success' : 'failure'}`, ok ? 'good' : 'bad');
  return {ok, nat, mod, tot, dc, who:best, label};
}
/* the die: a d20 tumbles in the sheet, settles on the roll, then the story goes on. Tap to hurry it. */
function rollDice(r, done){
  const sh = $('#sheet'); const old = $('#dice'); if (old) old.remove();
  const el = document.createElement('div'); el.id = 'dice'; el.className = 'dice';
  el.innerHTML = `<div class="dwho">${esc(NAME(r.who))} · ${r.label} ${r.dc}</div><div class="d20"><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,4 92,28 92,72 50,96 8,72 8,28" fill="#1a1613" stroke="#c9973f" stroke-width="2"/><polygon points="50,4 92,28 50,40 8,28" fill="rgba(201,151,63,.12)"/><polygon points="50,40 92,28 92,72 50,96 8,72 8,28" fill="none" stroke="rgba(201,151,63,.5)" stroke-width="1"/><line x1="50" y1="40" x2="50" y2="96" stroke="rgba(201,151,63,.5)"/></svg><span class="dn">20</span></div><div class="dres"></div>`;
  sh.appendChild(el); el.scrollIntoView({block:'nearest'});
  const n = el.querySelector('.dn'), res = el.querySelector('.dres'), die = el.querySelector('.d20');
  const t0 = performance.now(), dur = REDUCE() ? 200 : 950; let fin = false;
  AUDIO.play('shuffle');
  const settle = () => { if (fin) return; fin = true; n.textContent = r.nat; die.classList.add(r.nat === 20 ? 'crit' : r.nat === 1 ? 'fumble' : 'set'); el.classList.add(r.ok ? 'ok' : 'bad');
    res.innerHTML = `${r.nat} <span class="dm">${r.mod >= 0 ? '+' : '−'} ${Math.abs(r.mod)}</span> = <b>${r.tot}</b> <span class="dv">${r.ok ? 'success' : 'failure'}</span>`; AUDIO.play('dice', r.ok);
    setTimeout(() => { if (el.isConnected) el.remove(); done(); }, REDUCE() ? 500 : 2200); };
  const tick = () => { if (fin) return; const k = (performance.now() - t0) / dur; if (k >= 1) return settle(); n.textContent = 1 + R(20); die.style.transform = `rotate(${Math.sin(k*40)*18}deg) scale(${1 + Math.sin(k*Math.PI)*.15})`; setTimeout(tick, 45 + k*90); };
  el.onclick = settle; tick();
}
const fmt = t => t.replace(/\{sgt\}/g, esc(S.name)).split(/\n\n/).map(p => `<p>${p.replace(/\*(.+?)\*/g,'<em>$1</em>')}</p>`).join('');
function tatRest(){
  const c = [{t:`"We'll bring it back."`, go:'tat_end'}];
  if (!S.f.askedJ) c.push({t:`"What's actually in the journal?"`, check:['wits',12], fx:()=>S.f.askedJ=1, go:'tat_wits_ok', fail:'tat_wits_fail'});
  if (!S.f.paid) c.push({t:`"Tunnels under a fallen city. That's the kind of job that fills pits."`, fx:()=>S.f.paid=1, go:'tat_pay'});
  return c;
}
const DLG = {
  intro_tat:()=>({sp:'Tattersail · cadre mage', txt:
`The tent smells of candle smoke and wet canvas. The mage doesn't look up from the cards laid out across her camp table.

"Sergeant {sgt}. Not a Bridgeburner. Good. The Bridgeburners have enough people watching them."

"Varrow was cadre. He went into the sapper tunnels under the north quarter the night before the assault, and when the sky came down, the tunnels came down with it. Nobody has gone back for him." She turns a card and doesn't like it. "He carried a satchel. His journal is in it. I want it brought to me. To *me*, Sergeant, and to no one who asks nicely along the way."`,
    html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div>`, oncard:['orb',true],
    ch:tatRest()}),
  tat_wits_ok:()=>({sp:'Tattersail', txt:
`She studies you for long enough that the candle gutters.

"Timing. Who ordered what, and when, the night the Second died. Varrow was a careful man. He wrote things down."

Behind you, Tuft has gone very still.`, ch:tatRest(), fx:()=>{S.f.knowStakes=1;}}),
  tat_wits_fail:()=>({sp:'Tattersail', txt:`"Paper, Sergeant. It's full of paper." The cards offer you nothing more, and neither does she.`, ch:tatRest()}),
  tat_pay:()=>({sp:'Tattersail', txt:
`"It is exactly that kind of job." A purse lands on the table beside the cards. "Which is why you're being paid for it, and why I asked for a squad with a sapper."`,
    fx:()=>{S.silver += 10; note('+10 silver','good'); loy('brisk',1); AUDIO.play('coin');}, ch:tatRest()}),
  tat_end:()=>({sp:'Tattersail', txt:
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
      {t:'Healing salve, 3 silver', tag:`have ${S.inv.salve}`, req:()=>S.silver>=3, fx:()=>{S.silver-=3;S.inv.salve++;note('Bought a salve.','good');}, go:'pell'},
      {t:'"Got any cussers?"', req:()=>!S.f.askedCusser, fx:()=>S.f.askedCusser=1, go:'pell_cusser'},
      {t:'Leave'}]}),
  pell_cusser:()=>({sp:'Quartermaster Pell', txt:`"Cussers." He laughs without moving his face. "Your sapper's already got one, and I'd take it off her if I thought I'd live through the conversation."`, ch:[{t:'Back', go:'pell'}]}),

  garrow:()=>({sp:'Garrow · Second Army', fx:()=>S.f.garrow=1, txt:
`A soldier of the Second sits by the burial pits with his helmet in his lap. His armour is scorched in a pattern that looks almost like handprints.`,
    ch:[{t:'Share your water with him.', fx:()=>loy('ohl',1), go:'garrow_saw'},
        {t:'"What did you see that night?"', go:'garrow_saw'},
        {t:'Leave him be.'}]}),
  garrow_saw:()=>({sp:'Garrow', fx:()=>S.f.knowDeserters=1, txt:
`"The sky opened. Not the Spawn. *Ours.* I watched the cadre tents light up like lanterns, one after another." He turns the helmet over. "Some of my lot went down the north tunnels last night. Moreau's section. They're after dead officers' purses. If you run into them, tell them Garrow says the Fist is still counting heads. They might think twice."`,
    ch:[{t:'"We will."'}]}),
  garrow_again:()=>({sp:'Garrow', txt:`He's still counting the pits. He's lost his place twice since you last passed.`, ch:[{t:'Leave'}]}),

  claw:()=>({sp:'A grey cloak', fx:()=>S.f.clawMet=1, txt:
`A man in a grey cloak stands at the crater's lip, watching the violet shimmer at the bottom where the ground still hasn't decided whether to be ground. His boots are clean. Nobody's boots are clean.

"Fine night for a walk, Sergeant. Business in the north quarter?"`,
    ch:[{t:'"Grave detail."', check:['guile',13], go:'claw_fooled', fail:'claw_doubt'},
        {t:'"Who\'s asking?"', go:'claw_noone'},
        {t:'Say nothing and keep walking.', fx:()=>loy('brisk',1), go:'claw_silent'}]}),
  claw_fooled:()=>({sp:'A grey cloak', fx:()=>S.f.clawFooled=1, txt:`"Grim work. Hood keeps a long ledger." He looks back into the crater. When you glance over again, he isn't there.`, ch:[{t:'Move on'}]}),
  claw_doubt:()=>({sp:'A grey cloak', txt:`"Of course." He smiles like a man writing something down. "Carry on."`, ch:[{t:'Move on'}]}),
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
  card:()=>{ if (!S.card) S.card = ['oponn','obelisk','knight','assassin'][R(4)]; const c = CARDS[S.card];
    return {sp:'The Deck of Dragons', txt:`Tuft lays the reading out on the rubble. Two cards refuse her. The third does not.`,
      html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div><div class="note">${esc(c.name)} · ${esc(c.fx)}</div>`, oncard:[S.card,false],
      after:c.txt, ch:[{t:'Descend', go:'approach'}]}; },
  approach:()=>({sp:'North sapper tunnel', fx:()=>{S.bg='tunnel';}, scene:'tunnel', txt:
`Forty paces in, lamplight. Voices. Four figures crouch around a collapsed timber, prying at something with a spear-butt: Malazan kit, company badges cut off. Deserters.

Nobody has seen you yet.`,
    ch:[
      {t:`"Moreau! Garrow says the Fist is still counting heads."`, req:()=>S.f.knowDeserters, check:['guile',10], go:'desert_flee', fail:'desert_fight'},
      {t:'Talk them down.', check:['guile',14], go:'desert_half', fail:'desert_fight'},
      {t:'Hit them before they know you\'re here.', go:()=>startBattle('deserters',{surprise:'p'})},
      {t:'Kettle rolls a sharper in first.', tag:'uses 1 sharper', req:()=>S.inv.sharper>0,
        fx:()=>{S.inv.sharper--; S.f.noisy=1;}, go:()=>startBattle('deserters',{pre:true})}]}),
  desert_flee:()=>({sp:'North sapper tunnel', txt:
`The lamp swings round. A long silence, then a thin voice: "Garrow's alive?" Then boots, running, the other way. One of them leaves the lamp behind.

Brisk watches them go. "Malazans running from Malazans. Hood's laughing somewhere."`,
    fx:()=>{ const up = gainXP(100); note('+100 experience. Talking them down is soldiering too.','good'); if (up) note(`The squad reaches level ${S.lvl}. Everyone is tougher and hits harder.`,'good'); },
    ch:[{t:'Press on', go:'deep1'}]}),
  desert_half:()=>({sp:'North sapper tunnel', txt:
`You step into the light with empty hands and a sergeant's voice. Two of them look at each other, then at your sapper's satchel, and back away into the dark. The other two have come too far to go back.`,
    ch:[{t:'Fight', go:()=>startBattle('deserters',{drop:[0,2]})}]}),
  desert_fight:()=>({sp:'North sapper tunnel', txt:`The lamp swings round. Someone swears. Someone cocks a crossbow.`, ch:[{t:'Fight', go:()=>startBattle('deserters',{})}]}),
  deep1:()=>({sp:'Collapsed junction', scene:'dark', txt:
`The sapper tunnel ends in a chamber where three passages met before the ceiling came down. Varrow is here, or what's left of him, pinned under a beam with one hand still wrapped in a satchel strap.

The air is wrong: cold, and too dark, as if the lantern light has to push through water. "Kurald Galain," Tuft whispers. "The Spawn's warren leaked down here. Meanas will love it. Denul won't."

Something in the dark shifts its weight. Something big.`,
    ch:[{t:'Reach for the satchel.', go:()=>startBattle('stone',{surprise:'e'})},
        {t:'"Form up. Shields front."', go:()=>startBattle('stone',{surprise:'p'})}]}),
  journal:()=>({sp:'Collapsed junction', scene:'tunnel', txt:
`Varrow's satchel is heavy with oilcloth-wrapped pages. The top sheet is dated the night of the assault.`,
    ch:[{t:'Read it by lantern light.', check:['wits',13], go:'journal_read', fail:'journal_blur'},
        {t:'"Leave it closed. Not our business."', fx:()=>{loy('brisk',1); loy('tuft',-1);}, go:'journal_closed'}]}),
  journal_read:()=>({sp:'Varrow\'s journal', fx:()=>{S.f.knowTruth=1; loy('tuft',1);}, txt:
`Varrow's hand is small and careful. Times. Positions. An order relayed through the High Mage's staff that moved the cadre forward, and a line underlined twice:

*Moved before the Spawn attacked. Not after.*

Behind you, Tuft stops breathing. Then she starts again.`,
    ch:[{t:'Close it. Head for the surface.', go:()=>talk(S.f.clawFooled ? 'final' : 'claw2')}]}),
  journal_blur:()=>({sp:'Varrow\'s journal', fx:()=>S.f.partial=1, txt:
`The ink has run. Pages of it, too wet to read, except for one name that keeps surfacing like a drowned man: *Tayschrenn.*`,
    ch:[{t:'Head for the surface.', go:()=>talk(S.f.clawFooled ? 'final' : 'claw2')}]}),
  journal_closed:()=>({sp:'Collapsed junction', txt:`You buckle the satchel shut. Brisk grunts her approval. Tuft looks at the satchel the whole way up.`,
    ch:[{t:'Head for the surface.', go:()=>talk(S.f.clawFooled ? 'final' : 'claw2')}]}),
  claw2:()=>({sp:'A grey cloak', scene:'explore', txt:
`The grey cloak is waiting at the tunnel mouth, leaning on the shoring as if he's been part of it since the siege. His boots are still clean.

"Grave detail," he says pleasantly. "Find anything heavy? I'd be glad to carry it."`,
    ch:[{t:'Hand it over.', go:'claw_took'},
        {t:'"It\'s for the cadre." The squad closes ranks.', check:['might',14], go:'claw_withdraw', fail:'claw_marked'},
        {t:'Let Kettle hand him "the satchel."', check:['guile',13,'kettle'], go:'claw_decoy', fail:'claw_decoy_fail'}]}),
  claw_took:()=>({sp:'A grey cloak', fx:()=>{S.f.gaveClaw=1; loy('tuft',-2);}, txt:
`He takes the satchel without looking inside. "The Empress thanks you, Sergeant." He's gone before you can decide whether that was a joke. Tuft won't look at you.`,
    ch:[{t:'Report to Tattersail', go:'final'}]}),
  claw_withdraw:()=>({sp:'A grey cloak', fx:()=>loy('brisk',1), txt:
`Five marines. One Claw. A narrow place full of beams that might come down. He does the arithmetic out loud: "Another time, then."

When he's gone, Brisk lowers her shield about an inch.`, ch:[{t:'Report to Tattersail', go:'final'}]}),
  claw_marked:()=>({sp:'A grey cloak', fx:()=>S.f.marked=1, txt:
`"Of course it is." He steps aside with a little bow. You have the distinct feeling of having been entered into a ledger, in a very neat hand.`, ch:[{t:'Report to Tattersail', go:'final'}]}),
  claw_decoy:()=>({sp:'A grey cloak', fx:()=>{S.f.decoy=1; loy('kettle',1);}, txt:
`Kettle hands over a satchel, *a* satchel anyway, with the sullen reluctance of a woman surrendering her life's work. He walks off with it under his arm.

It's her munitions ledger. "He can have it," she says. "I know where every cusser is anyway."`, ch:[{t:'Report to Tattersail', go:'final'}]}),
  claw_decoy_fail:()=>({sp:'A grey cloak', txt:
`He opens it on the spot. "Munitions counts," he says. "Charming." His eyes don't smile. "The real one, Sergeant."`,
    ch:[{t:'Hand it over.', go:'claw_took'},
        {t:'"No."', check:['might',15], go:'claw_withdraw', fail:'claw_marked'}]}),
  final:()=> S.f.gaveClaw ? {sp:'Tattersail', txt:
`Tattersail hears you out without looking up. When you finish she turns a single card: the Herald of High House Death.`,
    html:`<div class="cardinline"><canvas id="icard" width="240" height="360"></canvas></div>`, oncard:['herald',false],
    after:`"Then the High Mage will have it by morning," she says. "Go and get some sleep, Sergeant. Somebody should."`,
    ch:[{t:'Leave the tent', go:()=>finish('claw')}]} : {sp:'Tattersail', txt:
`Back in the tent, the cards are exactly where she left them. Tattersail takes the satchel in both hands, the way you'd take something out of a fire.

"You came back with all five," she says. "That's a nice touch."`,
    ch:[{t:'"It\'s yours. We never saw it."', go:()=>finish('given')},
        {t:'"We read it. Moved before the Spawn attacked, not after."', req:()=>S.f.knowTruth, go:'final_told'},
        {t:'"Burn it. Knowing things gets soldiers killed."', go:'final_burn'}]},
  final_told:()=>({sp:'Tattersail', fx:()=>loy('tuft',1), txt:
`She's quiet for long enough that the candle gutters.

"Then you understand why it came to me and not to him." She lays a card face-down on the satchel. "Forget the underlined part, Sergeant, for your squad's sake. I'll remember it for all of us."`,
    ch:[{t:'Leave the tent', go:()=>finish('told')}]}),
  final_burn:()=>({sp:'Tattersail', fx:()=>{loy('ohl',1); loy('tuft',-1);}, txt:
`Ohl nods. Tuft doesn't. Tattersail looks at you like a woman revising an estimate.

"That's a soldier's answer," she says, and holds the first page to the candle herself. "It's not a wrong one. It just isn't the one Varrow died for."`,
    ch:[{t:'Leave the tent', go:()=>finish('burned')}]}),
};

let curCh = [];
function talk(id){
  if (S.picksDue && S.picksDue.length) return openPicks(() => talk(id));
  const n = DLG[id]();
  S.node = id; save();
  if (n.fx) { S.fxd = S.fxd || {}; if (!S.fxd[id]) { S.fxd[id] = 1; n.fx(); } }
  if (n.scene) { sceneShell(n.scene); }
  const sh = $('#sheet'); sh.hidden = false;
  const noteHtml = notes.map(x => `<div class="note ${x.c}">${esc(x.t)}</div>`).join(''); notes = [];
  curCh = n.ch.filter(c => !c.req || c.req());
  sh.innerHTML = `<div class="sp">${esc(n.sp || '')}</div>${noteHtml}<div class="txt">${fmt(n.txt)}</div>${n.html || ''}${n.after ? `<div class="txt">${fmt(n.after)}</div>` : ''}
    <div class="choices">${curCh.map((c,i) => {
      const tag = c.check ? `<span class="tagk">${c.check[0]} ${c.check[1]} · ${esc(NAME(roller(c.check[0], c.check[2])))}</span>` : c.tag ? `<span class="tagk">${esc(c.tag)}</span>` : '';
      return `<button class="choice" id="ch${i}" data-i="${i}">${tag}${esc(c.t)}</button>`; }).join('')}</div>`;
  sh.scrollTop = 0;
  if (n.oncard) inlineCard($('#icard'), n.oncard[0], n.oncard[1]);
  sh.querySelectorAll('.choice').forEach(b => b.onclick = () => { AUDIO.play('click'); choose(curCh[+b.dataset.i]); });
  const first = sh.querySelector('.choice'); if (first && !('ontouchstart' in window)) first.focus({preventScroll:true});
}
function choose(c){
  if (c.fx) c.fx();
  const go = tgt => { if (!tgt) { closeSheet(); return; } if (typeof tgt === 'function') { closeSheet(); tgt(); return; } talk(tgt); };
  if (!c.check) return go(c.go);
  const r = check(c.check[0], c.check[1], c.check[2]);
  $('#sheet').querySelectorAll('.choice').forEach(b => b.disabled = true);
  rollDice(r, () => go(r.ok ? c.go : c.fail));
}
function closeSheet(){
  $('#sheet').hidden = true; S.node = null;
  if (notes.length && view === 'explore') { notes.forEach(n => elog(n.t)); notes = []; }
  if (view === 'explore') updExplore();
  save();
}
/* a backdrop for talk nodes that happen away from the explore map */
const SCENES = {
  tunnel:{loc:'Under the Pale', sub:'North sapper tunnels', cap:'Lantern light, cold air, and the smell of old stone.', amb:'tunnel'},
  dark:{loc:'Under the Pale', sub:'Kurald Galain leaks through the stone', warren:true, cap:'The lantern light has to push through the dark like water.', amb:'dark'},
  camp_night:{loc:'The Pale', sub:'The camp at night', cap:'Tent lines under a bruised sky. The cadre row has one lamp lit.', amb:'explore'},
  tent:{loc:'Tattersail\'s tent', sub:'The cadre row', cap:'Candle smoke, wet canvas, and cards that will not lie still.', amb:'explore'},
  fire:{loc:'The Bridgeburners\' fire', sub:'East picket', cap:'Nine soldiers who do not look up when you arrive, which is how you know they saw you coming.', amb:'explore'},
  plain:{loc:'The Rhivi Plain', sub:'Grass to every horizon', cap:'The wagon, the guide, and six days of grass.', amb:'explore'},
  plain_dusk:{loc:'The Rhivi Plain', sub:'Dusk', cap:'The light goes long and red across the grass, and the grass does not care.', amb:'explore'},
  plain_night:{loc:'The Rhivi Plain', sub:'Night', cap:'Stars all the way down to the ground. Nothing between you and them.', amb:'explore'},
  city_street:{loc:'Darujhistan', sub:'The city of blue fire', cap:'Gas lamps burning blue down every street, and a black mountain hanging over the lake that nobody looks at any more.', amb:'explore'},
  inn:{loc:'The Phoenix Inn', sub:'The Daru District', cap:'Low beams, spilled wine, a fat man in a red waistcoat, and every thief in the city pretending not to watch the door.', amb:'explore'},
  cellar:{loc:'Under the intersection', sub:'The gas conduits', cap:'Cut stone, a lantern, a smell like a struck match, and crates with Moranth seals stacked where no crate should be.', amb:'tunnel'},
  room:{loc:'The dye-shop', sub:'An upstairs room, Daru District', cap:'Skeins of blue and madder hung to dry, one lamp, one chair, and a woman who has been expecting you.', amb:'explore'},
  roof:{loc:'Darujhistan', sub:'A rooftop above the dig · dawn', cap:'Tiles wet with lake mist. The blue fire going out lamp by lamp, and a shape on the next roof that was not there a moment ago.', amb:'explore'},
};
function sceneShell(kind){
  if (kind === 'explore') { if (view !== 'explore') { startExplore(); } return; }
  S.bg = kind;
  if (view === 'scene' && G.sceneKind === kind) return;
  view = 'scene'; B = null; G.sceneKind = kind; const sc = SCENES[kind] || SCENES.tunnel; AUDIO.setScene(sc.amb || kind);
  $('#app').innerHTML = `<header class="hud"><div><div class="loc">${sc.loc}</div><div class="sub ${sc.warren ? 'warren' : ''}">${sc.sub}</div></div><div class="hudr">${hudButtons()}</div></header>
    <div class="scene"><canvas id="scv" width="560" height="240"></canvas><div class="cap">${sc.cap}</div></div>`;
  bindHud();
}
