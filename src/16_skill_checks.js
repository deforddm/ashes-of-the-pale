/* ============ skill checks ============ */
function roller(stat, who){ const ids = who ? [who] : SQUAD(); let best = ids[0]; ids.forEach(id => { if (statOf(id, stat) > statOf(best, stat)) best = id; }); return best; }
function check(stat, dc, who){
  dc += DIFF().dc; const best = roller(stat, who);
  const crown = S.card === 'crown', r1 = d20(), r2 = crown ? d20() : 0; // the Crown: two dice, keep the better
  const nat = Math.max(r1, r2), mod = statOf(best, stat) + (S.card === 'oponn' ? 1 : 0), tot = nat + mod, ok = tot >= dc;
  const label = stat[0].toUpperCase() + stat.slice(1), cr = crown ? (SET.dice ? ` (the Crown: best of two, ${r1} and ${r2})` : ' (the Crown: best of two)') : '';
  note(SET.dice ? `${label} check (DC ${dc}): ${NAME(best)} rolls ${nat} + ${mod} = ${tot}${cr} · ${ok ? 'success' : 'failure'}` : `${label} check: ${NAME(best)}${cr} · ${ok ? 'success' : 'failure'}`, ok ? 'good' : 'bad');
  tally(ok ? 'checksOk' : 'checksFail'); return {ok, nat, mod, tot, dc, who:best, label};
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
/* IM Fell draws a straight " as a closing curly quote, so the story gets real ones: opening at the start of a run or after a space or
   bracket, or after a dash or asterisk when a word follows; closing everywhere else. Markup is left alone. Empty paragraphs (a conditional that came out blank) are dropped. */
const smartq = t => String(t).split(/(<[^>]*>)/).map((x, i) => i % 2 ? x : x.replace(/(^|[\s(\[])"(?=\S)/g, '$1\u201c').replace(/([\u2014\u2013*])"(?=[\w*'\u2018])/g, '$1\u201c').replace(/"/g, '\u201d').replace(/\u201c'/g, '\u201c\u2018')).join('');
const fmt = t => t.replace(/\{sgt\}/g, esc(S.name)).split(/\n\n/).filter(p => p.trim()).map(p => `<p>${smartq(p).replace(/\*(.+?)\*/g,'<em>$1</em>')}</p>`).join('');

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
      const tag = c.check ? `<span class="tagk">${c.check[0]} ${c.check[1] + DIFF().dc} · ${esc(NAME(roller(c.check[0], c.check[2])))}</span>` : c.tag ? `<span class="tagk">${esc(c.tag)}</span>` : '';
      return `<button class="choice" id="ch${i}" data-i="${i}">${tag}${smartq(esc(c.t).replace(/&quot;/g,'"'))}</button>`; }).join('')}</div>`;
  sh.scrollTop = 0;
  if (n.oncard) inlineCard($('#icard'), n.oncard[0], n.oncard[1]);
  sh.querySelectorAll('.choice').forEach(b => b.onclick = () => { AUDIO.play('click'); choose(curCh[+b.dataset.i]); });
  const first = sh.querySelector('.choice'); if (first && !('ontouchstart' in window)) first.focus({preventScroll:true});
  dockSheet();
}
function choose(c){
  if (c.fx) c.fx();
  const go = tgt => { if (!tgt) { const was = S.node; closeSheet(); if (view === 'scene') { console.warn('backdrop leave: ' + was); startExplore(); } return; } /* a plain 'leave' never strands the squad on a backdrop */ if (typeof tgt === 'function') { closeSheet(); tgt(); return; } talk(tgt); };
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
  camp_night:{loc:'The Pale', sub:'The camp at night', get cap(){ return typeof S !== 'undefined' && S && S.f && S.f.c1_hounds && S.chapter === 1 ? 'Tent lines under a bruised sky, and the cadre row still burning.' : 'Tent lines under a bruised sky. The cadre row has one lamp lit.'; }, amb:'explore'},
  tent:{loc:'Tattersail\'s tent', sub:'The cadre row', cap:'Candle smoke, wet canvas, and cards that will not lie still.', amb:'explore'},
  fire:{loc:'The Bridgeburners\' fire', sub:'East picket', cap:'A fire bigger than yours, and soldiers who do not look up when you arrive, which is how you know they saw you coming.', amb:'explore'},
  plain:{loc:'The Rhivi Plain', sub:'Grass to every horizon', cap:'The wagon, the guide, and six days of grass.', amb:'explore'},
  plain_dusk:{loc:'The Rhivi Plain', sub:'Dusk', cap:'The light goes long and red across the grass, and the grass does not care.', amb:'explore'},
  plain_night:{loc:'The Rhivi Plain', sub:'Night', cap:'Stars all the way down to the ground. Nothing between you and them.', amb:'explore'},
  hills:{loc:'The Gadrobi Hills', sub:'Brown hills, folded', cap:'Barrow mounds like knuckles under the grass. The city a smudge behind you. Nothing moves that you can see.', amb:'explore'},
  hills_dusk:{loc:'The Gadrobi Hills', sub:'Dusk', cap:'The hills go red and then brown and then nothing. The opened barrow breathes cold up out of the ground.', amb:'explore'},
  hills_night:{loc:'The Gadrobi Hills', sub:'Night', cap:'No stars over the barrow. There should be. Something on the next hill is the size of a child and is not one.', amb:'dark'},
  city_street:{loc:'Darujhistan', sub:'The city of blue fire', cap:'Gas lamps burning blue down every street, and a black mountain hanging over the lake that nobody looks at any more.', amb:'explore'},
  inn:{loc:'The Phoenix Inn', sub:'The Daru District', cap:'Low beams, spilled wine, a fat man in a red waistcoat, and every thief in the city pretending not to watch the door.', amb:'explore'},
  cellar:{loc:'Under the intersection', sub:'The gas conduits', cap:'Cut stone, a lantern, a smell like a struck match, and crates with Moranth seals stacked where no crate should be.', amb:'tunnel'},
  room:{loc:'The dye-shop', sub:'An upstairs room, Daru District', cap:'Skeins of blue and madder hung to dry, one lamp, one chair, and a woman who has been expecting you.', amb:'explore'},
  roof_night:{loc:'Darujhistan', sub:'The rooftops · night', cap:'Flat roofs and planks, chimneys, the lake mist coming up between the buildings, and a black mountain over all of it. Nothing moves. Something is moving.', amb:'explore'},
  roof:{loc:'Darujhistan', sub:'A rooftop above the dig · dawn', cap:'Tiles wet with lake mist. The blue fire going out lamp by lamp, and a shape on the next roof that was not there a moment ago.', amb:'explore'},
  /* Chapters 6 and 7 (the chapters overwrite these with their own text at registration) */
  fete_street:{loc:'Darujhistan', sub:'The Gedderone Fete · dusk', cap:'Lanterns strung across every street, masks on every face, and a black mountain over the lake that nobody looks at.', amb:'explore'},
  fete_hall:{loc:'Lady Simtal\'s estate', sub:'The hall', cap:'Chandeliers, masks, music, and a very tall guest by a pillar who does not dance.', amb:'explore'},
  fete_garden:{loc:'Lady Simtal\'s estate', sub:'The garden', cap:'Hedges, lanterns in the trees, a fountain, and something small and black growing in turned earth.', amb:'explore'},
  garden_storm:{loc:'Lady Simtal\'s estate', sub:'The garden · Omtose Phellack', warren:true, cap:'Frost goes across the lawn in rings. The lanterns go out one after another.', amb:'dark'},
  dragon_sky:{loc:'Darujhistan', sub:'The sky over the city', warren:true, cap:'Two dragons over the roofs, and one of them is not a dragon.', amb:'dark'},
  alley_night:{loc:'Darujhistan', sub:'An alley off the Daru District', cap:'Wet stone, one blue lamp, a doorway, and somebody standing in it.', amb:'dark'},
  lakefront_dawn:{loc:'Darujhistan', sub:'The Lakefront · dawn', cap:'Docks, the lake, a ship at the pier, and a sky with nothing in it.', amb:'explore'},
  quorl_hill:{loc:'East of Darujhistan', sub:'A hill on the Gadrobi road', cap:'Quorls on the grass, Black Moranth in chitin, and the city small behind.', amb:'explore'},
  road_east:{loc:'Genabackis', sub:'The road north-east', cap:'A column on a road through brown hills, very far off, and banners.', amb:'explore'},
  ship:{loc:'Lake Azur', sub:'A deck', cap:'Grey water, a sail, and the city getting smaller.', amb:'explore'},
};
/* ambience for the new scenes: the Fete has a crowd and pipes, the lake has water and gulls */
const sceneAmb = (kind, amb) => amb === 'explore' && ['fete_street','fete_hall'].includes(kind) ? 'fete' : amb === 'explore' && kind === 'fete_garden' && !feteDawn() ? 'fete' : amb === 'explore' && ['lakefront_dawn','ship'].includes(kind) ? 'lake' : amb;
function sceneShell(kind){
  if (kind === 'explore') { if (view !== 'explore') { startExplore(); } return; }
  S.bg = kind;
  if (view === 'scene' && G.sceneKind === kind) return;
  view = 'scene'; B = null; G.sceneKind = kind; const sc = SCENES[kind] || SCENES.tunnel; AUDIO.setScene(sceneAmb(kind, sc.amb || kind));
  toTop(); $('#app').innerHTML = `<header class="hud"><div><div class="loc">${sc.loc}</div><div class="sub ${sc.warren ? 'warren' : ''}">${sc.sub}</div></div><div class="hudr">${hudButtons()}</div></header>
    <div class="scene"><canvas id="scv" width="560" height="240"></canvas><div class="cap">${sc.cap}</div></div>`;
  bindHud();
}
