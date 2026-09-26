/* ============ explore ============ */
let ash = [], fog = [];
const AREA = () => AREAS[S.area] || AREAS.pale;
const ACOLS = () => AREA().map[0].length, AROWS = () => AREA().map.length;
function startExplore(areaId){
  if (areaId && areaId !== S.area) { S.area = areaId; const a = AREAS[areaId]; S.pos = {...a.start}; S.trail = [[-1,0],[1,0],[-1,1],[0,1],[1,1],[0,-1]].map(([dx,dy]) => ({x:a.start.x+dx, y:a.start.y+dy})); }
  const a = AREA(), [kick, ttl] = splitTitle(a.title);
  view = 'explore'; S.scene = 'explore'; S.bg = 'explore'; B = null; save(); AUDIO.setScene(a.amb || decorAmb(a));
  toTop(); $('#app').innerHTML = `<header class="hud"><div>${kick ? `<div class="kick">${kick}</div>` : ''}<div class="loc">${ttl}</div><div class="sub qline"><span id="quest"></span><span id="silver"></span></div></div>
    <div class="hudr">${hudButtons()}</div></header>
    <div class="cvwrap"><canvas id="cv" aria-label="Map"></canvas></div>
    <div class="maprow"><p class="hint">${tapWord(a.hint || 'Tap ground to move · tap a figure to talk')}</p><button class="btn mini" id="bMap"></button></div>
    <p class="hint keys" aria-hidden="true"><kbd>\u2190</kbd><kbd>\u2191</kbd><kbd>\u2192</kbd><kbd>\u2193</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> walk · <kbd>Space</kbd> talk to whoever is beside you · <kbd>J</kbd> journal · <kbd>P</kbd> pack · <kbd>C</kbd> squad · <kbd>Esc</kbd> settings</p>
    <div class="log" id="elog"></div>`;
  bindHud();
  G.disp = {};
  $('#bMap').textContent = 'Whole map'; updExplore(); fitCanvas(ACOLS(), AROWS()); // the quest line and a label first: they shape the rows around the map, and those the room it has
  $('#bMap').onclick = () => { AUDIO.play('click'); SET.map = mapClose() ? 'whole' : 'close'; saveSet(); fitCanvas(ACOLS(), AROWS()); mapBtn(); };
  mapBtn();
}
/* "Darujhistan · the Daru District" -> a kicker and a title that fits next to the buttons */
const splitTitle = t => { const i = t.indexOf(' · '); return i < 0 ? ['', t] : [t.slice(0, i), t[i + 3].toUpperCase() + t.slice(i + 4)]; };
/* the close/whole switch under the map; hidden when both would look the same (a wide screen) */
function mapBtn(){ const b = $('#bMap'); if (!b) return; b.textContent = mapClose() ? 'Whole map' : 'Close up'; b.setAttribute('aria-label', mapClose() ? 'Show the whole map' : 'Show the map close up'); b.hidden = WIDE() || (mapClose() && !G.pannable); }
/* ash, petals or ice: the count follows the map's size on screen so the density stays what it was at the old small scale */
function exploreParticles(){
  const n = REDUCE() ? 0 : Math.round(clamp(50 * (ACOLS()*G.T * AROWS()*G.T) / (352*264), 50, 200));
  if (ash.length !== n) ash = Array.from({length:n}, () => ({x:Math.random(), y:Math.random(), v:.00012 + Math.random()*.0003, w:Math.random()*6, s:.8 + Math.random()*1.4}));
  if (!fog.length) fog = Array.from({length:7}, (_, i) => ({x:Math.random(), y:.3 + Math.random()*.6, w:.25 + Math.random()*.3, v:.00002 + Math.random()*.00004, a:.05 + Math.random()*.05}));
}
/* is tile (x,y) within m tiles of the camera's view? (skip the glows nobody can see) */
const onCam = (x, y, m) => { const T = G.T, c = G.cam; return !G.pannable || ((x + 1 + m)*T > c.x && (x - m)*T < c.x + G.vw && (y + 1 + m)*T > c.y && (y - m)*T < c.y + G.vh); };
/* ambience from the decor when an area names none: the Fete has a crowd and pipes, the Lakefront has water and gulls */
const decorAmb = a => a.decor === 'estate_night' || a.decor === 'estate_terrace' || ((a.decor || '').startsWith('city') && a.map.some(r => r.includes('l'))) ? 'fete' : a.decor === 'lakefront' ? 'lake' : 'explore';
/* Fete lanterns on a pole: red, amber, green, blue paper, swaying a little on the string */
function drawFeteLanterns(ctx, T, x, y, t, street){
  const px = x*T, py = y*T, cols = ['#d8503a','#e8a040','#4aa870','#4a7ad8'], xs = street ? [.14,.33,.67,.86] : [.24,.41,.58,.75];
  xs.forEach((k, i) => { const sag = street ? Math.sin((k < .5 ? k*2 : (k - .5)*2) * Math.PI) * T*.16 : Math.sin(k*Math.PI) * T*.12, ax = px + k*T, ay = py + T*.12 + sag, sw = Math.sin(t/760 + x*1.3 + y + i*1.7) * .16, c = cols[(x + y + i) % 4];
    const fl = .85 + Math.sin(t/180 + i*2.1 + x)*.08 + Math.sin(t/63 + i)*.05;
    const r = Math.max(T*.075, 2.2); glow(ctx, ax + Math.sin(sw)*T*.14, ay + T*.14, T*.8, c, .26*fl);
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(sw); ctx.strokeStyle = 'rgba(40,30,20,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, T*.05); ctx.stroke();
    ell(ctx, 0, T*.05 + r*1.2, r, r*1.3, c); ell(ctx, -r*.25, T*.05 + r*1.1, r*.45, r*.8, `rgba(255,236,190,${.6*fl})`); ctx.fillStyle = 'rgba(30,20,12,.8)'; ctx.fillRect(-r*.6, T*.05 - .5, r*1.2, 1.2); ctx.fillRect(-r*.6, T*.05 + r*2.4, r*1.2, 1.2);
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.moveTo(-T*.035, T*.13); ctx.lineTo(T*.035, T*.13); ctx.stroke(); ctx.restore(); });
  glow(ctx, px + T*.5, py + T*.35, T*2.2, '#e8a050', .07);
}
function updExplore(){
  if (!$('#quest')) return;
  const a = AREA();
  $('#quest').textContent = a.quest ? a.quest() : (typeof QUESTS !== 'undefined' && QUESTS[a.id]) ? QUESTS[a.id]() : (a.sub || '');
  $('#silver').textContent = `${S.silver} silver`;
  $('#elog').innerHTML = S.log.map(l => `<div>${l}</div>`).join('');
  const hud = $('.hud'); if (G.cv && G.hudH != null && hud && hud.offsetHeight !== G.hudH) fitCanvas(ACOLS(), AROWS()); // a quest line that wraps differently moves the map: give it the room that's left
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
  walking = true; if (G.cam) G.cam.pan = false; // a walk brings the camera back to the sergeant
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
  const est = (a.decor || '').startsWith('estate'), lake = a.decor === 'lakefront', storm = a.decor === 'estate_storm';
  if (est && G.azath !== !!S.f.c6_azath) fitCanvas(cols, rows); // the sapling became a house while we were looking
  camStep(t); const cam = G.cam, px = 1 / (G.dpr || 1); // the world is drawn in map pixels, shifted by the camera (snapped to device pixels)
  ctx.save(); ctx.translate(-Math.round(cam.x / px) * px, -Math.round(cam.y / px) * px);
  ctx.drawImage(G.bgc, 0, 0, cols*T, rows*T);
  if (a.decor && (a.decor.startsWith('plain') || a.decor.startsWith('hills'))) {
    // open ground: fires burn, the barrow stones breathe a little, and the sky sets the mood
    a.map.forEach((row, y) => [...row].forEach((ch, x) => { if (!onCam(x, y, 4.5)) return; if (ch === 'F') drawFireAt(ctx, T, x*T + T/2, y*T + T*.55, t); if (ch === 'M') glow(ctx, x*T + T/2, y*T + T*.6, T*1.2, '#9a86e0', .05 + Math.sin(t/1100 + x)*.03); }));
    if (a.decor.startsWith('hills')) { ctx.fillStyle = 'rgba(120,90,50,.10)'; ctx.fillRect(0,0,cols*T,rows*T); }
    if (a.decor === 'hills_night') { ctx.fillStyle = 'rgba(10,10,30,.28)'; ctx.fillRect(0,0,cols*T,rows*T); }
    if (a.decor === 'plain_dusk' || a.decor === 'hills_dusk') { ctx.fillStyle = 'rgba(200,110,50,.10)'; ctx.fillRect(0,0,cols*T,rows*T); }
    if (a.decor === 'plain_night' && S.f.c2_light && !S.f.c2_lightOut && !S.f.c2_lightDone) { const g = ctx.createLinearGradient(0,0,cols*T*.35,0); g.addColorStop(0,`rgba(255,200,120,${.16 + Math.sin(t/500)*.05})`); g.addColorStop(1,'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(0,0,cols*T,rows*T); }
  } else if (a.decor === 'roof_night') {
    // rooftops: chimney smoke, skylights lit from below, and the blue of the street coming up through the gaps
    a.map.forEach((row, y) => [...row].forEach((ch, x) => { if (!onCam(x, y, 4.5)) return;
      if (ch === 'C') { for (let i=0;i<4;i++){ const k = ((t/900 + i*.25 + x*.1) % 1); ell(ctx, x*T + T/2 + Math.sin(t/700 + i + x)*T*.15*k, y*T + T*.1 - k*T*1.4, T*(.12 + k*.3), T*(.08 + k*.2), `rgba(120,120,130,${(1-k)*.14})`); } }
      if (ch === 'S') glow(ctx, x*T + T/2, y*T + T/2, T*1.8, '#e8b060', .16 + Math.sin(t/600 + x)*.04);
      if (ch === '#') glow(ctx, x*T + T/2, y*T + T*.5, T*.9, '#6aa8ff', .05 + Math.sin(t/800 + x*2)*.02);
    }));
    ctx.fillStyle = 'rgba(40,60,120,.06)'; ctx.fillRect(0,0,cols*T,rows*T);
  } else if (est) {
    // Lady Simtal's estate at night: lanterns in every colour, the fountain moving, the doors lit, and in turned earth something small and black that pulses
    a.map.forEach((row, y) => [...row].forEach((ch, x) => { if (!onCam(x, y, 4.5)) return; const cx = x*T + T/2, cy = y*T + T/2;
      if (ch === 'l' && !storm) drawFeteLanterns(ctx, T, x, y, t, false);
      if (ch === 'f') { const bk = estateBlock(a.map, x, y); if (bk !== 'part') { const sw = bk ? bk.w/2 : .5, fx = bk ? (x + sw)*T : cx, fy = bk ? (y + bk.h/2)*T : y*T + T*.54, sp = bk ? fy - T*.66 : y*T + T*.2, sc = bk ? sw*2 : 1; // one fountain, however many tiles it covers
        if (!storm) { for (let i=0;i<3;i++){ const k = ((t/1400 + i/3 + x*.1) % 1); ctx.strokeStyle = `rgba(160,210,240,${(1-k)*.35})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(fx, fy, (T*.08 + k*T*.26)*sc, (T*.04 + k*T*.16)*sc*.8, 0, 0, 7); ctx.stroke(); }
          for (let i=0;i<5 + (bk ? 5 : 0);i++){ const k = ((t/600 + i/10) % 1), dx = (i%5 - 2)*T*.05*sc; ctx.fillStyle = `rgba(200,230,255,${(1-k)*.7})`; ctx.fillRect(fx + dx*k*2, sp - Math.sin(k*Math.PI)*T*.12*sc + k*T*.3*sc, 1.5, 1.5); } glow(ctx, fx, fy, T*.9*sc, '#6aa8d8', .08); }
        else glow(ctx, fx, fy, T*.8*sc, '#bfe8ff', .1 + Math.sin(t/900)*.03); } }
      if (ch === 'w' && !storm) { for (let i=0;i<3;i++){ const k = (Math.sin(t/(500 + i*170) + x*3 + y*5 + i*2) + 1)/2; if (k > .8) { ctx.fillStyle = `rgba(210,230,255,${(k - .8)*3})`; ctx.fillRect(x*T + T*(.2 + hash(x,y,i)*.6), y*T + T*(.2 + hash(y,x,i)*.6), 2, 1); } } }
      if (ch === 'A') { const p = (Math.sin(t/1300) + 1)/2; if (S.f.c6_azath) { glow(ctx, cx, y*T + T*.3, T*2.2, '#7ad0a0', .08 + p*.08); glow(ctx, cx + T*.24, y*T + T*.3, T*.5, '#bfe8a0', .25 + p*.2); }
        else { glow(ctx, cx, y*T + T*.55, T*1.4, p > .5 ? '#7ad0a0' : '#9a86e0', .06 + p*.08); if (storm) glow(ctx, cx, y*T + T*.5, T*2.6, '#bfe8ff', .12 + p*.1); } }
      if (ch === 'D' && !storm) { const fl = .9 + Math.sin(t/200 + x)*.05; glow(ctx, cx, y*T + T*.35, T*1.2, '#ffc070', .3*fl); if (y + 1 < rows && '#hbD'.indexOf(a.map[y+1][x]) < 0) { const g = ctx.createLinearGradient(0, (y+1)*T, 0, (y+2.4)*T); g.addColorStop(0, `rgba(255,190,110,${.22*fl})`); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x*T + T*.2, (y+1)*T); ctx.lineTo(x*T + T*.8, (y+1)*T); ctx.lineTo(x*T + T*1.3, (y+2.4)*T); ctx.lineTo(x*T - T*.3, (y+2.4)*T); ctx.fill(); } }
      if (ch === 't' && !storm) { const fl = .8 + Math.sin(t/120 + x*2)*.12; glow(ctx, x*T + T*.48, y*T + T*.24, T*.9, '#ffc070', .2*fl); }
    }));
    ctx.fillStyle = storm ? 'rgba(120,170,220,.12)' : 'rgba(20,40,90,.12)'; ctx.fillRect(0,0,cols*T,rows*T);
  } else if (a.decor && (a.decor.startsWith('city') || a.decor === 'cellar' || lake)) {
    // the city of blue fire: every lamp burns blue, the dig has a lantern in it, braziers burn orange
    a.map.forEach((row, y) => [...row].forEach((ch, x) => { if (!onCam(x, y, 4.5)) return;
      if (ch === 'L' && lake) { const out = hash(x,y,7) > .5, fl = out ? (hash(Math.floor(t/140), x) > .9 ? .5 : .12) : .5 + Math.sin(t/300 + x)*.12 + (hash(Math.floor(t/90), y) > .93 ? -.3 : 0); glow(ctx, x*T + T/2, y*T + T*.2, T*1.8, '#6aa8ff', .22*fl); ctx.fillStyle = `rgba(140,190,255,${.25 + fl*.4})`; ctx.fillRect(x*T + T*.44, y*T + T*.15, T*.12, T*.12); } // burning low, going out
      else if (ch === 'L') { const fl = .85 + Math.sin(t/230 + x*1.7)*.08 + Math.sin(t/71 + y)*.04; glow(ctx, x*T + T/2, y*T + T*.2, T*3.4, '#6aa8ff', .42*fl); glow(ctx, x*T + T/2, y*T + T*.2, T*.9, '#bfe0ff', .5*fl); ctx.fillStyle = `rgba(160,210,255,${.7 + fl*.2})`; ctx.fillRect(x*T + T*.44, y*T + T*.15, T*.12, T*.12); }
      if (ch === 'l') drawFeteLanterns(ctx, T, x, y, t, true);
      if (ch === '~' || ch === 'n') { for (let i=0;i<3;i++){ const k = ((t/(2600 + i*700) + hash(x,y,i)) % 1), yy = y*T + T*(.18 + i*.3) + Math.sin(t/900 + x + i)*T*.04; ctx.strokeStyle = lake ? `rgba(255,${190 + i*20},150,${Math.sin(k*Math.PI)*.22})` : `rgba(140,190,255,${Math.sin(k*Math.PI)*.16})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x*T + k*T*.8, yy); ctx.lineTo(x*T + k*T*.8 + T*.22, yy); ctx.stroke(); } }
      if (ch === 'H') glow(ctx, x*T + T/2, y*T + T*.5, T*1.6, '#e8b060', .18 + Math.sin(t/400)*.05);
      if (ch === 'F') drawFireAt(ctx, T, x*T + T/2, y*T + T*.55, t, .9);
      if (ch === 'S') glow(ctx, x*T + T/2, y*T + T*.5, T*1.2, '#e8b060', .12);
    }));
    if (a.decor === 'city_dusk') { ctx.fillStyle = 'rgba(200,110,50,.07)'; ctx.fillRect(0,0,cols*T,rows*T); }
    if (lake) { const g = ctx.createLinearGradient(cols*T, 0, cols*T*.35, 0); g.addColorStop(0, `rgba(255,170,110,${.2 + Math.sin(t/3000)*.03})`); g.addColorStop(1, 'rgba(255,170,110,0)'); ctx.fillStyle = g; ctx.fillRect(0,0,cols*T,rows*T); ctx.fillStyle = 'rgba(90,110,140,.06)'; ctx.fillRect(0,0,cols*T,rows*T);
      for (let i=0;i<4;i++){ const k = ((t/(26000 + i*5000) + i*.27) % 1), gx = (1.1 - k*1.3)*cols*T, gy = (.08 + hash(i,3)*.3)*rows*T + Math.sin(t/800 + i)*T*.2, w = T*(.16 + hash(i,4)*.08), f = Math.sin(t/160 + i*2)*w*.35; // gulls
        ctx.strokeStyle = 'rgba(220,215,205,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(gx - w, gy - f); ctx.quadraticCurveTo(gx - w*.4, gy - w*.4, gx, gy); ctx.quadraticCurveTo(gx + w*.4, gy - w*.4, gx + w, gy - f); ctx.stroke(); } }
    if (a.decor === 'city_night') { ctx.fillStyle = 'rgba(40,70,140,.07)'; ctx.fillRect(0,0,cols*T,rows*T); }
  } else if (a.decor === 'pale') {
    // crater: Kurald Galain shimmer with the occasional pulse
    const pulse = (Math.sin(t/900) + 1) / 2, flick = hash(Math.floor(t/120), 1) > .93 ? .5 : 0;
    glow(ctx, 9*T, 6*T, T*3.2, '#9a86e0', .18 + pulse*.12 + flick);
    for (let i=0;i<6;i++){ const aa = t/1400 + i; ctx.strokeStyle = `rgba(201,187,255,${.12 + Math.sin(aa*2)*.08})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(8*T + Math.cos(aa)*T*1.3, 6*T + Math.sin(aa)*T*.8); ctx.quadraticCurveTo(9*T, 5.2*T + Math.sin(aa*1.7)*T*.6, 10*T + Math.cos(aa+2)*T*1.4, 6*T + Math.sin(aa+1)*T*.7); ctx.stroke(); }
    drawFireAt(ctx, T, 9*T, 9.5*T, t);
  } else {
    // night camp: every fire tile burns, every tent glows faintly, the cadre tent has its lamp
    a.map.forEach((row, y) => [...row].forEach((ch, x) => { if (!onCam(x, y, 4.5)) return;
      if (ch === 'F' || ch === 'B') drawFireAt(ctx, T, x*T + T/2, y*T + T*.55, t, ch === 'B' ? 1.3 : 1);
      if (ch === '=') glow(ctx, x*T + T/2, y*T + T*.6, T*.9, '#c98a3a', .05 + Math.sin(t/900 + x)*.02);
      if (ch === 'C') glow(ctx, x*T + T/2, y*T + T*.7, T*2.4, '#9a86e0', .16 + Math.sin(t/700)*.05);
    }));
  }
  // a mouse over the map: the tile it would walk to, brighter over someone to talk to
  const hv = G.hover; if (hv && !walking && $('#sheet').hidden) { const n = npcAt(hv.x, hv.y); if (n || palePass(hv.x, hv.y)) { ctx.strokeStyle = n ? 'rgba(232,192,115,.85)' : 'rgba(232,192,115,.38)'; ctx.lineWidth = 1.5; ctx.strokeRect(hv.x*T + 1.5, hv.y*T + 1.5, T - 3, T - 3); } }
  // NPCs
  a.npcs.forEach(n => { if (n.show && !n.show()) return; drawFigure(ctx, n.kind, n.x*T + T/2, n.y*T + T*.6, T/32, t, {phase:n.x + n.y*3, still:!!n.still});
    if (n.fresh && n.fresh()) { const by = Math.sin(t/300)*2; ctx.fillStyle = '#e8c073'; const cx = n.x*T+T/2, cy = n.y*T - T*.15 + by; ctx.beginPath(); ctx.moveTo(cx, cy-T*.16); ctx.lineTo(cx+T*.1, cy); ctx.lineTo(cx, cy+T*.12); ctx.lineTo(cx-T*.1, cy); ctx.fill(); } });
  // party: sergeant + trail, interpolated
  SQUAD().slice(1).forEach((id,i) => { const p = S.trail[i]; if (!p) return; const d = dispOf(id, p.x, p.y); drawFigure(ctx, id, d.x*T + T/2, d.y*T + T*.6, T/32*.85, t, {phase:i+1, dir: d.x <= S.pos.x ? 1 : -1, still:!walking}); });
  const d = dispOf('sgt', S.pos.x, S.pos.y);
  if (!walking) { const p = REDUCE() ? 0 : (Math.sin(t/260)+1)*.5; ctx.strokeStyle = `rgba(201,151,63,${.35+p*.4})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(d.x*T + T/2, d.y*T + T*.6, T*.4 + p*2, T*.16 + p, 0, 0, 7); ctx.stroke(); }
  drawFigure(ctx, 'sgt', d.x*T + T/2, d.y*T + T*.6, T/32, t, {phase:0, still:!walking});
  // lantern warmth around the party
  glow(ctx, d.x*T + T/2, d.y*T + T/2, T*2.6, '#e8b060', a.decor === 'pale' || a.decor === 'plain' || a.decor === 'hills' || a.decor === 'city_dusk' || lake ? .06 : .14);
  // fog banks (lake mist on the Lakefront, frost-smoke in the frozen garden)
  fog.forEach(f => { f.x += f.v; if (f.x > 1.3) f.x = -.3; ell(ctx, f.x*cols*T, f.y*rows*T, f.w*cols*T, T*.9, a.decor === 'plain' || a.decor === 'hills' ? `rgba(120,130,90,${f.a*.6})` : lake ? `rgba(170,185,200,${f.a*.7})` : storm ? `rgba(180,210,230,${f.a})` : est ? `rgba(40,50,70,${f.a})` : `rgba(70,62,58,${f.a})`); });
  // drifting ash; Fete confetti and paper petals on the estate; ice in the frozen garden; nothing on the Lakefront
  const PET = ['#d8503a','#e8a040','#4aa870','#4a7ad8','#e8d8c0','#c05a8a'];
  if (est && !storm) ash.forEach((s, i) => { s.y += s.v*.8; if (s.y > 1) s.y = 0; const x = (s.x + Math.sin(t/1300 + s.w)*.02) * cols*T, r = t/500 + s.w; ctx.save(); ctx.translate(x, s.y*rows*T); ctx.rotate(r); ctx.scale(1, Math.abs(Math.sin(r*1.3)) + .15); ctx.fillStyle = rgba(PET[i % PET.length], .75); ctx.fillRect(-s.s*1.2, -s.s*.8, s.s*2.4, s.s*1.6); ctx.restore(); });
  else if (storm) ash.forEach(s => { s.y += s.v*.6; if (s.y > 1) s.y = 0; const x = (s.x + Math.sin(t/2200 + s.w)*.03 + t*.000004) % 1 * cols*T; ctx.fillStyle = 'rgba(220,240,255,.6)'; ctx.fillRect(x, s.y*rows*T, s.s*1.2, s.s*1.2); if (s.s > 1.8) glow(ctx, x, s.y*rows*T, 4, '#bfe8ff', .3); });
  else if (!lake && !(a.decor && (a.decor.startsWith('plain') || a.decor.startsWith('hills')))) ash.forEach(s => { s.y += s.v; if (s.y > 1) s.y = 0; const x = (s.x + Math.sin(t/1600 + s.w)*.01) * cols*T; ctx.fillStyle = 'rgba(200,190,175,.4)'; ctx.fillRect(x, s.y*rows*T, s.s, s.s); });
  // off-screen: someone new to talk to (a brass diamond at the edge of the view, pointing their way)
  const off = [];
  if (G.pannable) a.npcs.forEach(n => { if ((n.show && !n.show()) || !(n.fresh && n.fresh())) return; const nx = n.x*T + T/2 - cam.x, ny = n.y*T + T*.4 - cam.y; if (nx < 0 || nx > G.vw || ny < 0 || ny > G.vh) off.push([nx, ny]); });
  ctx.restore();
  // darkness at the edges (deeper at night), on the view: the same shape the whole map always had
  const vw = G.vw, vh = G.vh, hd = Math.hypot(vw, vh) / 2;
  const v = ctx.createRadialGradient(vw/2, vh/2, hd*.4, vw/2, vh/2, hd); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${a.decor === 'pale' ? .6 : a.decor === 'plain' || a.decor === 'hills' ? .35 : a.decor === 'plain_dusk' || a.decor === 'hills_dusk' || a.decor === 'city_dusk' ? .5 : a.decor === 'city_night' || a.decor === 'roof_night' || est ? .45 : lake ? .35 : .7})`); ctx.fillStyle = v; ctx.fillRect(0,0,vw,vh);
  if (G.pannable) drawCamEdges(ctx, t, cam, off);
}
/* when the map runs on past the view: a soft brass chevron on that side, and a diamond for anyone new out there */
function drawCamEdges(ctx, t, cam, off){
  const vw = G.vw, vh = G.vh, mx = G.cols*G.T - vw, my = G.rows*G.T - vh, bob = REDUCE() ? 0 : Math.sin(t/400)*2;
  const chev = (x, y, dx, dy) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(dy, dx)); ctx.strokeStyle = 'rgba(232,192,115,.55)'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-3, -6); ctx.lineTo(3, 0); ctx.lineTo(-3, 6); ctx.stroke(); ctx.restore(); };
  if (cam.x > 1) chev(10 - bob, vh/2, -1, 0); if (cam.x < mx - 1) chev(vw - 10 + bob, vh/2, 1, 0);
  if (cam.y > 1) chev(vw/2, 10 - bob, 0, -1); if (cam.y < my - 1) chev(vw/2, vh - 10 + bob, 0, 1);
  const seen = [];
  off.forEach(([x, y]) => { const ex = clamp(x, 11, vw - 11), ey = clamp(y, 14, vh - 14); if (seen.some(([sx, sy]) => Math.abs(sx - ex) < 16 && Math.abs(sy - ey) < 16)) return; seen.push([ex, ey]);
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(Math.atan2(y - ey, x - ex)); ctx.translate(bob*.6, 0); glow(ctx, 0, 0, 16, '#e8c073', .3);
    ctx.fillStyle = '#e8c073'; ctx.strokeStyle = 'rgba(0,0,0,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(-4, -6); ctx.lineTo(-1.5, 0); ctx.lineTo(-4, 6); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore(); });
}
