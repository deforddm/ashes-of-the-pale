/* ============ explore ============ */
let ash = [], fog = [];
const AREA = () => AREAS[S.area] || AREAS.pale;
const ACOLS = () => AREA().map[0].length, AROWS = () => AREA().map.length;
function startExplore(areaId){
  if (areaId && areaId !== S.area) { S.area = areaId; const a = AREAS[areaId]; S.pos = {...a.start}; S.trail = [{x:a.start.x-1,y:a.start.y},{x:a.start.x+1,y:a.start.y},{x:a.start.x-1,y:a.start.y+1},{x:a.start.x,y:a.start.y+1}]; }
  const a = AREA();
  view = 'explore'; S.scene = 'explore'; S.bg = 'explore'; B = null; save(); AUDIO.setScene(a.amb || 'explore');
  $('#app').innerHTML = `<header class="hud"><div><div class="loc">${a.title}</div><div class="sub" id="quest"></div></div>
    <div class="hudr"><span id="silver"></span>${hudButtons()}</div></header>
    <div class="cvwrap"><canvas id="cv" aria-label="Map"></canvas></div>
    <p class="hint">${a.hint || 'Tap ground to move · tap a figure to talk'}</p>
    <div class="log" id="elog"></div>`;
  bindHud();
  G.disp = {};
  fitCanvas(ACOLS(), AROWS());
  ash = Array.from({length:REDUCE() ? 0 : 50}, () => ({x:Math.random(), y:Math.random(), v:.00012 + Math.random()*.0003, w:Math.random()*6, s:.8 + Math.random()*1.4}));
  fog = Array.from({length:7}, (_, i) => ({x:Math.random(), y:.3 + Math.random()*.6, w:.25 + Math.random()*.3, v:.00002 + Math.random()*.00004, a:.05 + Math.random()*.05}));
  updExplore();
}
function updExplore(){
  if (!$('#quest')) return;
  const a = AREA();
  $('#quest').textContent = a.quest ? a.quest() : (typeof QUESTS !== 'undefined' && QUESTS[a.id]) ? QUESTS[a.id]() : (a.sub || '');
  $('#silver').textContent = `${S.silver} silver`;
  $('#elog').innerHTML = S.log.map(l => `<div>${l}</div>`).join('');
}
const npcAt = (x,y) => AREA().npcs.find(n => n.x === x && n.y === y && (!n.show || n.show()));
const tileAt = (x,y) => { const m = AREA().map; return (y >= 0 && y < m.length && x >= 0 && x < m[0].length) ? m[y][x] : '#'; };
const palePass = (x,y) => { const a = AREA(), ch = tileAt(x,y); return ch !== '#' && (a.walk.includes(ch) || !!(a.triggers && a.triggers[ch])) && !npcAt(x,y); };
function exploreTap(x, y){
  if (walking || !$('#sheet').hidden) return;
  const npc = npcAt(x,y);
  if (npc) {
    const path = cheb(S.pos, npc) <= 1 ? [] : findPath(S.pos.x, S.pos.y, palePass, (a,b) => cheb({x:a,y:b}, npc) <= 1);
    if (path) walk(path, () => talk(npc.node()));
    return;
  }
  if (!palePass(x,y)) return;
  const m = reachMap(S.pos.x, S.pos.y, palePass, 99); if (!m.has(K(x,y))) return;
  walk(pathFrom(m, x, y), () => { const tr = AREA().triggers, ch = tileAt(x,y); if (tr && tr[ch]) talk(tr[ch]); });
}
async function walk(path, done){
  walking = true;
  for (const st of path) { S.trail.unshift({x:S.pos.x, y:S.pos.y}); S.trail = S.trail.slice(0,6); S.pos = {x:st.x, y:st.y}; AUDIO.play('step'); await wait(150); }
  walking = false; save(); if (done) done();
}
function drawFireAt(ctx, T, fx, fy, t, scale = 1){
  const fl = .8 + Math.sin(t/160 + fx)*.12 + Math.sin(t/67 + fy)*.06; glow(ctx, fx, fy, T*3.4*scale, '#e8923a', .28*fl);
  ell(ctx, fx, fy + T*.1, T*.16, T*.09, '#3a2a1a'); poly(ctx, [[fx - T*.1, fy + T*.1],[fx + T*.1, fy + T*.1],[fx + Math.sin(t/90)*T*.05, fy + T*.1 - T*.35*fl]], '#ffb35a'); poly(ctx, [[fx - T*.05, fy + T*.1],[fx + T*.05, fy + T*.1],[fx + Math.sin(t/70)*T*.03, fy + T*.1 - T*.2*fl]], '#fff1c2');
  for (let i=0;i<5;i++){ const yy = fy - ((t/12 + i*23) % (T*2.2)); ctx.fillStyle = `rgba(255,${140 + R(60)},40,${(1 - (fy - yy)/(T*2.2))*.8})`; ctx.fillRect(fx + Math.sin(t/300 + i)*T*.25, yy, 2, 2); }
}
function drawExplore(t){
  const {ctx, T} = G; if (!ctx) return; const a = AREA(), cols = ACOLS(), rows = AROWS();
  ctx.drawImage(G.bgc, 0, 0, cols*T, rows*T);
  if (a.decor === 'pale') {
    // crater: Kurald Galain shimmer with the occasional pulse
    const pulse = (Math.sin(t/900) + 1) / 2, flick = hash(Math.floor(t/120), 1) > .93 ? .5 : 0;
    glow(ctx, 9*T, 6*T, T*3.2, '#9a86e0', .18 + pulse*.12 + flick);
    for (let i=0;i<6;i++){ const aa = t/1400 + i; ctx.strokeStyle = `rgba(201,187,255,${.12 + Math.sin(aa*2)*.08})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(8*T + Math.cos(aa)*T*1.3, 6*T + Math.sin(aa)*T*.8); ctx.quadraticCurveTo(9*T, 5.2*T + Math.sin(aa*1.7)*T*.6, 10*T + Math.cos(aa+2)*T*1.4, 6*T + Math.sin(aa+1)*T*.7); ctx.stroke(); }
    drawFireAt(ctx, T, 9*T, 9.5*T, t);
  } else {
    // night camp: every fire tile burns, every tent glows faintly, the cadre tent has its lamp
    a.map.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === 'F' || ch === 'B') drawFireAt(ctx, T, x*T + T/2, y*T + T*.55, t, ch === 'B' ? 1.3 : 1);
      if (ch === '=') glow(ctx, x*T + T/2, y*T + T*.6, T*.9, '#c98a3a', .05 + Math.sin(t/900 + x)*.02);
      if (ch === 'C') glow(ctx, x*T + T/2, y*T + T*.7, T*2.4, '#9a86e0', .16 + Math.sin(t/700)*.05);
    }));
  }
  // NPCs
  a.npcs.forEach(n => { if (n.show && !n.show()) return; drawFigure(ctx, n.kind, n.x*T + T/2, n.y*T + T*.6, T/32, t, {phase:n.x, still:!!n.still});
    if (n.fresh && n.fresh()) { const by = Math.sin(t/300)*2; ctx.fillStyle = '#e8c073'; const cx = n.x*T+T/2, cy = n.y*T - T*.15 + by; ctx.beginPath(); ctx.moveTo(cx, cy-T*.16); ctx.lineTo(cx+T*.1, cy); ctx.lineTo(cx, cy+T*.12); ctx.lineTo(cx-T*.1, cy); ctx.fill(); } });
  // party: sergeant + trail, interpolated
  SQUAD().slice(1).forEach((id,i) => { const p = S.trail[i]; if (!p) return; const d = dispOf(id, p.x, p.y); drawFigure(ctx, id, d.x*T + T/2, d.y*T + T*.6, T/32*.85, t, {phase:i+1, dir: d.x <= S.pos.x ? 1 : -1, still:!walking}); });
  const d = dispOf('sgt', S.pos.x, S.pos.y);
  if (!walking) { const p = REDUCE() ? 0 : (Math.sin(t/260)+1)*.5; ctx.strokeStyle = `rgba(201,151,63,${.35+p*.4})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(d.x*T + T/2, d.y*T + T*.6, T*.4 + p*2, T*.16 + p, 0, 0, 7); ctx.stroke(); }
  drawFigure(ctx, 'sgt', d.x*T + T/2, d.y*T + T*.6, T/32, t, {phase:0, still:!walking});
  // lantern warmth around the party
  glow(ctx, d.x*T + T/2, d.y*T + T/2, T*2.6, '#e8b060', a.decor === 'pale' ? .09 : .14);
  // fog banks
  fog.forEach(f => { f.x += f.v; if (f.x > 1.3) f.x = -.3; ell(ctx, f.x*cols*T, f.y*rows*T, f.w*cols*T, T*.9, `rgba(70,62,58,${f.a})`); });
  // drifting ash
  ash.forEach(s => { s.y += s.v; if (s.y > 1) s.y = 0; const x = (s.x + Math.sin(t/1600 + s.w)*.01) * cols*T; ctx.fillStyle = 'rgba(200,190,175,.4)'; ctx.fillRect(x, s.y*rows*T, s.s, s.s); });
  // darkness at the edges (deeper at night)
  const v = ctx.createRadialGradient(cols*T/2, rows*T/2, T*4, cols*T/2, rows*T/2, T*10); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${a.decor === 'pale' ? .6 : .7})`); ctx.fillStyle = v; ctx.fillRect(0,0,cols*T,rows*T);
}
