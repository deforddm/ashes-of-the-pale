/* ============ the Deeds page, the count, the route map, chapter replays, and a controller ============ */

/* ---- the count: what a sergeant's road added up to (S.stats, kept as they play) ---- */
function statsRows(s){
  const st = (s && s.stats) || {}, n = k => st[k] || 0, thrown = ['sharper', 'burner', 'cusser', 'smoker'].map(k => [k, n('thrown_' + k)]).filter(([, v]) => v);
  return [['Fights won', n('won')], ['Fights retried', n('retries')], ['Foes put down', n('kills')], ['Critical hits', n('crits')],
    ['Damage dealt', n('dealt')], ['Damage taken', n('taken')], ['Health mended', n('healed')],
    ['Checks passed', `${n('checksOk')} of ${n('checksOk') + n('checksFail')}`], ['Silver earned', n('silverIn')], ['Silver spent', n('silverOut')],
    ['Munitions thrown', thrown.length ? thrown.map(([k, v]) => `${v} ${k}${v === 1 ? '' : 's'}`).join(', ') : 'none'], ['Paces walked', n('steps')]];
}
const statsHTML = s => `<div class="kv stats">${statsRows(s).map(([k, v]) => `<span>${k}</span><span>${v}</span>`).join('')}</div>`;

/* ---- every sergeant on this device, loaded (the Deeds page reads across all of them) ---- */
const allSergeants = () => roster().list.map(e => ({e, s:e.id === (S && S.sid) ? S : loadSlot(e.id)})).filter(x => x.s);

/* ---- the route: the Fourth's road across Genabackis, drawn as far as the sergeant has come ---- */
const ROUTE = [ // chapter -> where on the map (0..1), what to call it, and where its name sits (a: 'l' left of the mark, 'c' above it, else right; dy nudges it down)
  {x:.12, y:.14, t:'The Pale'}, {x:.2, y:.3, t:'The Pale camp'}, {x:.36, y:.44, t:'The Rhivi Plain'}, {x:.55, y:.6, t:'Darujhistan', a:'l'},
  {x:.6, y:.74, t:'The Daru roofs', a:'l', dy:10}, {x:.8, y:.44, t:'The Gadrobi Hills', a:'c'}, {x:.66, y:.86, t:'The Fete', dy:12}, {x:.86, y:.7, t:'The quorl hill', a:'l'}];
function drawRoute(cv, s, t){
  const {ctx, W, H} = (() => { const dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight; if (cv.width !== Math.round(w*dpr)) { cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr); } const c = cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0); return {ctx:c, W:w, H:h}; })();
  if (!W) return;
  // parchment, the lake, the hills, the plain
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#2a2218'); bg.addColorStop(1, '#1c1610'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 60; i++) ctx.fillRect(hash(i, 3)*W, hash(i, 4)*H, 1 + hash(i, 5)*2, 1);
  ctx.fillStyle = '#16304a'; ctx.beginPath(); ctx.ellipse(W*.66, H*1.02, W*.34, H*.2, 0, 0, 7); ctx.fill(); // Lake Azur
  ctx.fillStyle = 'rgba(106,168,255,.18)'; ctx.font = `italic ${Math.round(Math.max(10, H*.05))}px 'IM Fell English', serif`; ctx.textAlign = 'center'; ctx.fillText('Lake Azur', W*.84, H*.97);
  for (let i = 0; i < 9; i++) { const hx = W*(.72 + hash(i, 7)*.2), hy = H*(.42 + hash(i, 8)*.22); poly(ctx, [[hx - 12, hy + 6], [hx, hy - 8], [hx + 12, hy + 6]], 'rgba(90,70,48,.55)'); } // the Gadrobi Hills
  for (let i = 0; i < 14; i++) ctx.fillStyle = 'rgba(140,130,90,.12)', ctx.fillRect(W*(.28 + hash(i, 9)*.3), H*(.32 + hash(i, 10)*.2), 10, 1); // the plain's grass
  ctx.fillStyle = 'rgba(40,30,22,.9)'; ctx.fillRect(W*.1, H*.12, W*.08, H*.08); // the ruins of Pale
  const reached = [0, 1, 2, 3, 4, 5, 6, 7].filter(n => n <= (s.chapter || 0)), pts = reached.map(n => ({x:ROUTE[n].x*W, y:ROUTE[n].y*H}));
  // the Moon's Spawn: over Pale at the start, over the city from chapter 3
  const spawn = (s.chapter || 0) >= 3 ? {x:W*.62, y:H*.5} : {x:W*.22, y:H*.08}; ell(ctx, spawn.x, spawn.y, W*.05, H*.035, '#07070a'); glow(ctx, spawn.x, spawn.y, W*.08, '#9a86e0', .08);
  // the road
  ctx.strokeStyle = 'rgba(232,192,115,.75)'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.setLineDash([]);
  ROUTE.forEach((r, n) => { const x = r.x*W, y = r.y*H, on = n <= (s.chapter || 0), here = n === (s.chapter || 0) && !(s.chapters && s.chapters[7] != null);
    if (!on) { ctx.fillStyle = 'rgba(200,190,170,.18)'; ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); return; }
    if (here) glow(ctx, x, y, 18, '#e8c073', .35 + Math.sin(t/300)*.15);
    ctx.fillStyle = here ? '#e8c073' : '#c9973f'; ctx.beginPath(); ctx.arc(x, y, here ? 5 : 3.5, 0, 7); ctx.fill();
    ctx.fillStyle = here ? '#f2dca6' : 'rgba(230,218,194,.7)'; ctx.font = `600 ${Math.round(Math.max(9, Math.min(13, W*.028)))}px 'Alegreya Sans SC', sans-serif`; ctx.textAlign = r.a === 'l' ? 'right' : r.a === 'c' ? 'center' : 'left';
    ctx.fillText(r.t, x + (r.a === 'l' ? -8 : r.a === 'c' ? 0 : 8), y - (r.a === 'c' ? 10 : 6) + (r.dy || 0)); });
}
let routeAnim = null;

/* ---- the Deeds page: the road's endings found on this device, the tables, this sergeant's count, and replays ---- */
function deedsHTML(){
  const all = allSergeants(), deeds = {}; all.forEach(({s}) => Object.entries(s.deeds || {}).forEach(([k, v]) => deeds[k] = (deeds[k] || 0) + v));
  const found = n => { const f = new Set(); all.forEach(({s}) => { if (s.chapters && s.chapters[n] != null) f.add(s.chapters[n]); }); return f; };
  const road = [0, 1, 2, 3, 4, 5, 6, 7].map(n => { const E = CHEND[n] || {}, keys = Object.keys(E), f = found(n);
    return `<li><span>${n === 0 ? 'Prologue' : `Chapter ${CHAPTERS[n] ? CHAPTERS[n].number : n}${CHAPTERS[n] ? ' · ' + CHAPTERS[n].title : ''}`}</span><b>${f.size} of ${keys.length}</b>
      <em>${keys.map(k => f.has(k) ? esc(E[k][0]) : '<i>?</i>').join(' · ')}</em></li>`; }).join('');
  const d = k => deeds[k] || 0, best = Math.max(0, ...all.map(({s}) => (s.f && s.f.c6_masks ? s.f.c6_masks - 1 : 0)));
  const tables = [['Bones', `${d('bonesWon')} won, ${d('bonesLost')} lost${d('bonesShutout') ? `, ${d('bonesShutout')} before the other side scored` : ''}`],
    ['Kruppe\'s cups', `${d('cupsWon')} rounds won${d('cupsCaught') ? `, caught palming ${d('cupsCaught') === 1 ? 'once' : d('cupsCaught') + ' times'}` : ', never caught'}`],
    ['Laying the charges', d('chargesClean') ? 'Every run, first time' : d('chargesLaid') ? 'All three runs laid' : 'Not yet'],
    ['The roof run', d('roofsUnseen') ? `Across unseen${d('roofsUnseen') > 1 ? ` (${d('roofsUnseen')} times)` : ''}` : d('roofSeen') ? `Seen ${d('roofSeen')} time${d('roofSeen') === 1 ? '' : 's'}; never across unseen` : 'Not yet'],
    ['Masks at the Fete', best ? `${best} of 5 named${d('masksAll') ? ', all five at least once' : ''}` : 'Not yet']];
  const done = S && S.chapters && S.chapters[7] != null;
  return `<p class="fine">Across every sergeant on this device.</p>
    <h4 class="jh">The road</h4><div class="route"><canvas id="dRoute"></canvas></div>
    <ol class="deeds-road">${road}</ol>
    <h4 class="jh">At the tables</h4><div class="kv">${tables.map(([k, v]) => `<span>${k}</span><span>${v}</span>`).join('')}</div>
    ${S ? `<h4 class="jh">Sergeant ${esc(S.name)}'s count</h4>${statsHTML(S)}` : ''}
    ${S ? `<h4 class="jh">Play a chapter again</h4>${done ? `<p class="fine">Sergeant ${esc(S.name)} has finished the book. Start any chapter again as a new sergeant, ${esc(S.name)} (Ch <i>n</i>), with the squad as it stood then; this save stays as it is.</p>
      <div class="row chsel">${[1, 2, 3, 4, 5, 6, 7].map(n => `<button class="btn" data-replay="${n}">${CHAPTERS[n] ? CHAPTERS[n].number : n}</button>`).join('')}</div><p class="fine" id="replayMsg"></p>` : `<p class="fine">Finish the book, and any chapter can be played again from here.</p>`}` : ''}`;
}
function bindDeeds(){
  const cv = $('#dRoute'); if (cv) { routeAnim = t => { if (!cv.isConnected) { routeAnim = null; return; } drawRoute(cv, S || {chapter:0}, t); }; }
  document.querySelectorAll('[data-replay]').forEach(b => b.onclick = () => { const n = +b.dataset.replay, name = replayName(n), msg = $('#replayMsg');
    if (roster().list.some(e => sameName(e.name, name)) && b.dataset.arm !== '1') { document.querySelectorAll('[data-replay]').forEach(x => delete x.dataset.arm); b.dataset.arm = '1'; msg.textContent = tapWord(`Sergeant ${name} already has a save. Tap ${CHAPTERS[n].number} again to start it over.`); return; }
    AUDIO.play('click'); replayChapter(n); });
}
const replayName = n => `${S.name.slice(0, 12)} (Ch ${n})`;
/* a finished sergeant, back at chapter n: the snapshot taken when they started it, or (for saves from before snapshots) the save as it
   finished with everything from chapter n on taken back out: the flags, the endings, the fallen (they stand up again) */
function rebuildAt(base, n){
  const s = JSON.parse(JSON.stringify(base)), later = k => { const m = /^c(\d)_/.exec(k); return m && +m[1] >= n; };
  Object.keys(s.chapters || {}).forEach(k => { if (+k >= n) delete s.chapters[k]; });
  Object.keys(s.f || {}).forEach(k => { if (later(k)) delete s.f[k]; }); Object.keys(s.fxd || {}).forEach(k => { if (later(k)) delete s.fxd[k]; });
  Object.keys(s.dead || {}).forEach(id => { if (s.dead[id].ch >= n) { delete s.dead[id]; if (!s.squad.includes(id)) s.squad.push(id); } });
  delete s.finPage; s.chapter = n; return s;
}
function replayChapter(n){
  const base = S, snap = base.chsnap && base.chsnap[n], s = snap ? JSON.parse(JSON.stringify(snap)) : rebuildAt(base, n), name = replayName(n);
  s.name = name; delete s.sid; s.sid = sidFor(name); s.chsnap = JSON.parse(JSON.stringify(base.chsnap || {})); s.stats = {}; s.deeds = {};
  S = migrate(s); save(); $('#modal').hidden = true; startChapter(n);
}

/* ============ a controller (the Gamepad API): it drives the game through the same keys the keyboard does ============
   Stick or D-pad: walk on the map, move the target square in a fight, move between buttons elsewhere. A: press (the focused button,
   or talk / the target square / the game's main action). B: back (Esc). X: end the turn (Space). Y: the squad. LB / RB: the choices
   (or the abilities, in a fight). Start: settings. View: the journal. */
const PAD = {on:false, prev:[], held:{}, last:0};
const padKey = key => window.dispatchEvent(new KeyboardEvent('keydown', {key, bubbles:true, cancelable:true}));
function padScope(){ return ['#settings', '#modal', '#chars', '#mg'].map(s => $(s)).find(el => el && !el.hidden) || (!$('#sheet').hidden ? $('#sheet') : $('#app')); }
function padFocus(dir){ const sc = padScope(), bs = [...sc.querySelectorAll('button:not([disabled]), .choice:not([disabled]), [data-g]')].filter(b => b.offsetParent);
  if (!bs.length) return; const i = bs.indexOf(document.activeElement), j = i < 0 ? (dir > 0 ? 0 : bs.length - 1) : clamp(i + dir, 0, bs.length - 1); bs[j].focus(); bs[j].scrollIntoView({block:'nearest'}); }
function padPress(){ const a = document.activeElement; if (a && a !== document.body && (a.tagName === 'BUTTON' || a.classList.contains('choice'))) { a.click(); return; }
  if (!$('#sheet').hidden) { padFocus(1); return; } padKey(view === 'battle' ? 'Enter' : view === 'explore' ? 'e' : ' '); }
function padPoll(){
  const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(g => g && g.connected) : null; if (!gp) { if (PAD.on) { PAD.on = false; document.body.classList.remove('padfocus'); } return; }
  if (!PAD.on) { PAD.on = true; document.body.classList.add('padfocus'); }
  const b = i => !!(gp.buttons[i] && gp.buttons[i].pressed), ax = gp.axes || [], now = performance.now();
  const dir = {up:b(12) || ax[1] < -.5, down:b(13) || ax[1] > .5, left:b(14) || ax[0] < -.5, right:b(15) || ax[0] > .5};
  const prev = PAD.prev, edge = i => b(i) && !prev[i]; PAD.prev = gp.buttons.map(x => x.pressed);
  const menus = ['#settings', '#modal', '#chars'].some(s => !$(s).hidden) || (!$('#sheet').hidden && view !== 'battle') || (mgOpenNow() && !MG.arrows) || ['title', 'intro', 'end', 'finale'].includes(view);
  Object.entries({up:'ArrowUp', down:'ArrowDown', left:'ArrowLeft', right:'ArrowRight'}).forEach(([d, key]) => {
    if (!dir[d]) { delete PAD.held[d]; return; } const h = PAD.held[d]; if (h && now - h < 170) return; PAD.held[d] = h ? now : now + 180; // a first press, then a repeat while held
    if (menus) padFocus(d === 'up' || d === 'left' ? -1 : 1); else padKey(key); });
  if (edge(0)) padPress(); if (edge(1)) padKey('Escape'); if (edge(2)) padKey(' '); if (edge(3)) padKey('c');
  if (edge(4) || edge(5)) { if (view === 'battle' && $('#sheet').hidden && !mgOpenNow()) { const ab = [...document.querySelectorAll('#ubar .abil [data-k]:not([disabled])')]; if (ab.length) { PAD.ab = ((PAD.ab ?? -1) + (edge(5) ? 1 : -1) + ab.length) % ab.length; ab[PAD.ab].click(); } } else padFocus(edge(5) ? 1 : -1); }
  if (edge(9)) padKey('Escape'); if (edge(8)) padKey('j');
}
window.addEventListener('gamepadconnected', () => { PAD.on = true; document.body.classList.add('padfocus'); });
