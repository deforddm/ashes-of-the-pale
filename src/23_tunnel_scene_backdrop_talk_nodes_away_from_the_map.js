/* ============ tunnel scene backdrop (talk nodes away from the map) ============ */
function drawScene(cv, kind, t){
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  ctx.fillStyle = '#060505'; ctx.fillRect(0,0,W,H);
  const cx = W/2, cy = H*.55, fl = .8 + Math.sin(t/110)*.08 + Math.sin(t/41)*.05;
  // perspective tunnel walls
  for (let i=0;i<9;i++){ const k = i/9, w = W*(1 - k*.8), h = H*(1 - k*.8), x = cx - w/2, y = cy - h*.55; const a = .18 - k*.02; ctx.strokeStyle = kind === 'dark' ? `rgba(60,50,80,${a})` : `rgba(90,70,50,${a})`; ctx.lineWidth = 4 - k*3; ctx.strokeRect(x, y, w, h); }
  // shoring beams
  for (let i=0;i<5;i++){ const k = i/5 + .05, w = W*(1 - k*.8), x = cx - w/2, y = cy - H*(1 - k*.8)*.55; ctx.fillStyle = '#2a1e12'; ctx.fillRect(x, y, w, 8 - k*5); ctx.fillRect(x, y, 6 - k*4, H*(1 - k*.8)); ctx.fillRect(x + w - (6 - k*4), y, 6 - k*4, H*(1 - k*.8)); }
  glow(ctx, cx - W*.2, cy + H*.1, W*.45, kind === 'dark' ? '#9a86e0' : '#e8923a', (kind === 'dark' ? .12 : .28)*fl);
  if (kind === 'dark') { for (let i=0;i<10;i++) ell(ctx, hash(i,3)*W, H*.6 + hash(i,4)*H*.4 - ((t/30 + i*30) % 60), 40 + hash(i,5)*40, 12, 'rgba(60,45,100,.08)'); glow(ctx, cx + W*.2, cy - H*.1, W*.2, '#9a86e0', .1 + Math.sin(t/700)*.05); }
  // floor rubble
  for (let i=0;i<20;i++) ell(ctx, hash(i,6)*W, H*.75 + hash(i,7)*H*.25, 6 + hash(i,8)*18, 4, '#0d0b0a');
  // party silhouettes small in foreground
  PORDER.forEach((id, i) => drawFigure(ctx, id, cx - 90 + i*45, H*.92, 2.2, t, {phase:i, dir: i < 2 ? 1 : -1}));
  // dust
  ctx.fillStyle = 'rgba(200,190,175,.25)'; for (let i=0;i<20;i++) ctx.fillRect(hash(i,9)*W + Math.sin(t/1400 + i)*5, (hash(i,10)*H + t*.02) % H, 1.5, 1.5);
  const v = ctx.createRadialGradient(cx, cy, H*.2, cx, cy, W*.7); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.85)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
}

/* tent and fire interiors for Chapter 1 talk nodes */
function drawInterior(cv, kind, t){
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, fl = .8 + Math.sin(t/110)*.08 + Math.sin(t/41)*.05;
  ctx.fillStyle = '#060505'; ctx.fillRect(0,0,W,H);
  if (kind === 'tent') {
    // canvas walls lit from a candle on a table; cards on the table; a crate in the corner with something on it
    const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#1a1410'); g.addColorStop(1,'#0c0907'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = 'rgba(120,95,60,.25)'; ctx.lineWidth = 1; for (let i=0;i<7;i++){ ctx.beginPath(); ctx.moveTo(W*.5, 0); ctx.lineTo(i*W/6, H*.7); ctx.stroke(); }
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(W*.25, H*.62, W*.5, H*.06); ctx.fillStyle = '#2a1e12'; ctx.fillRect(W*.28, H*.68, W*.03, H*.3); ctx.fillRect(W*.69, H*.68, W*.03, H*.3);
    for (let i=0;i<5;i++){ ctx.save(); ctx.translate(W*.36 + i*W*.07, H*.6); ctx.rotate((hash(i,3)-.5)*.5); ctx.fillStyle = i === 2 ? '#7d7fc9' : '#bdb3a3'; ctx.fillRect(-9, -13, 18, 26); ctx.fillStyle = '#1a1410'; ctx.fillRect(-7, -11, 14, 22); ctx.restore(); }
    ell(ctx, W*.62, H*.56, 3, 8, '#e8d8a8'); glow(ctx, W*.62, H*.5, W*.35, '#ffb060', .45*fl); poly(ctx, [[W*.62-3, H*.5],[W*.62+3, H*.5],[W*.62 + Math.sin(t/90)*2, H*.5 - 12*fl]], '#fff1c2');
    ctx.fillStyle = '#2a2018'; ctx.fillRect(W*.8, H*.66, W*.14, H*.22); ctx.fillStyle = '#3a2c1c'; ctx.fillRect(W*.8, H*.66, W*.14, H*.04);
    // the puppet
    ctx.save(); ctx.translate(W*.87, H*.66); ctx.fillStyle = '#4a3a2c'; ctx.fillRect(-5, -16, 10, 14); ell(ctx, 0, -20, 5, 5, '#8a6a52'); ctx.fillStyle = '#0a0808'; ctx.fillRect(-2, -21, 1.5, 1.5); ctx.fillRect(1, -21, 1.5, 1.5); ctx.strokeStyle = 'rgba(200,180,220,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-4, -30); ctx.lineTo(-3, -16); ctx.moveTo(4, -30); ctx.lineTo(3, -16); ctx.stroke(); ctx.restore();
    glow(ctx, W*.87, H*.6, W*.12, '#9a86e0', .1 + Math.sin(t/500)*.05);
    drawFigure(ctx, 'tat', W*.15, H*.9, 2.6, t, {still:true, dir:1});
    SQUAD().slice(0,3).forEach((id, i) => drawFigure(ctx, id, W*.4 + i*40, H*.98, 2.2, t, {phase:i, dir:-1}));
  } else {
    // the Bridgeburners' fire: a ring of figures, most of them not looking at you
    const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#04040a'); g.addColorStop(1,'#0a0807'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = 'rgba(220,220,240,.4)'; for (let i=0;i<30;i++) ctx.fillRect(hash(i,31)*W, hash(i,32)*H*.45, 1, 1);
    for (let i=0;i<4;i++){ const x = W*.05 + i*W*.3, y = H*.5; poly(ctx, [[x-30,y+16],[x,y-26],[x+30,y+16]], '#1c150f'); }
    glow(ctx, W*.5, H*.72, W*.4, '#e8923a', .4*fl); ell(ctx, W*.5, H*.78, 22, 7, '#2a1a10');
    poly(ctx, [[W*.5-12, H*.78],[W*.5+12, H*.78],[W*.5 + Math.sin(t/90)*5, H*.78 - 34*fl]], '#ffb35a'); poly(ctx, [[W*.5-6, H*.78],[W*.5+6, H*.78],[W*.5 + Math.sin(t/70)*3, H*.78 - 18*fl]], '#fff1c2');
    for (let i=0;i<8;i++){ const yy = H*.7 - ((t/10 + i*30) % (H*.5)); ctx.fillStyle = `rgba(255,${140 + R(60)},40,${(1 - (H*.7 - yy)/(H*.5))*.8})`; ctx.fillRect(W*.5 + Math.sin(t/300 + i)*20, yy, 2, 2); }
    [['wj', W*.62, H*.86, 1], ['qb', W*.75, H*.8, -1], ['kalam', W*.86, H*.9, -1], ['garrow', W*.3, H*.66, 1], ['pell', W*.68, H*.62, -1]].forEach(([k,x,y,d], i) => drawFigure(ctx, k, x, y, k === 'garrow' || k === 'pell' ? 1.8 : 2.4, t, {still:true, dir:d, phase:i}));
    SQUAD().slice(0,3).forEach((id, i) => drawFigure(ctx, id, W*.12 + i*36, H*.96, 2.2, t, {phase:i, dir:1}));
  }
  const v = ctx.createRadialGradient(W/2, H*.6, H*.25, W/2, H*.6, W*.7); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.85)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
}

/* the Rhivi Plain, for Chapter 2 talk nodes: day, dusk, night (with the light in the west once it rises) */
function drawPlain(cv, kind, t){
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, hz = H*.62;
  const sky = ctx.createLinearGradient(0,0,0,hz);
  const hills = kind.startsWith('hills'); if (hills) kind = kind === 'hills' ? 'plain' : kind === 'hills_dusk' ? 'plain_dusk' : 'plain_night';
  if (kind === 'plain_dusk') { sky.addColorStop(0,'#1a1218'); sky.addColorStop(.6,'#5a2a1e'); sky.addColorStop(1,'#c9713a'); }
  else if (kind === 'plain_night') { sky.addColorStop(0,'#04040a'); sky.addColorStop(1,'#0e0d16'); }
  else { sky.addColorStop(0,'#2a2e3a'); sky.addColorStop(.7,'#6b6a62'); sky.addColorStop(1,'#a8a08a'); }
  ctx.fillStyle = sky; ctx.fillRect(0,0,W,hz);
  if (kind === 'plain_night') { ctx.fillStyle = 'rgba(220,220,240,.7)'; for (let i=0;i<70;i++) ctx.fillRect(hash(i,41)*W, hash(i,42)*hz, 1, 1);
    if (S && S.f && S.f.c2_light) { const lx = W*.12, fl = .85 + Math.sin(t/140)*.08 + Math.sin(t/53)*.05; glow(ctx, lx, hz, W*.5, '#ffb35a', .35*fl); const g = ctx.createLinearGradient(lx - 14, 0, lx + 14, 0); g.addColorStop(0,'rgba(255,200,120,0)'); g.addColorStop(.5,`rgba(255,230,180,${.55*fl})`); g.addColorStop(1,'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(lx - 14, hz*.15, 28, hz*.85); } }
  if (kind === 'plain_dusk') { ell(ctx, W*.85, hz - 6, 26, 26, '#f0a060'); glow(ctx, W*.85, hz, W*.4, '#e8923a', .25); }
  // ground
  const gr = ctx.createLinearGradient(0,hz,0,H); gr.addColorStop(0, kind === 'plain_night' ? '#141a10' : kind === 'plain_dusk' ? '#3a3a20' : '#4a5232'); gr.addColorStop(1, kind === 'plain_night' ? '#080a06' : '#26301c'); ctx.fillStyle = gr; ctx.fillRect(0,hz,W,H-hz);
  ctx.strokeStyle = kind === 'plain_night' ? 'rgba(80,100,60,.35)' : 'rgba(140,160,80,.45)'; ctx.lineWidth = 1;
  for (let i=0;i<140;i++){ const x = hash(i,51)*W, y = hz + 4 + hash(i,52)*(H-hz), h = 4 + hash(i,53)*10 * (1 + (y-hz)/(H-hz)); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.sin(t/900 + i)*2, y - h*.6, x + Math.sin(t/700 + i)*3, y - h); ctx.stroke(); }
  if (hills) { // folded hills on the horizon, barrow mounds, and at night a grey tear of light on the far slope
    for (let i=0;i<4;i++){ const k = i/4; ctx.fillStyle = kind === 'plain_night' ? `rgba(14,16,10,${.9 - k*.15})` : kind === 'plain_dusk' ? `rgba(70,50,30,${.9 - k*.15})` : `rgba(60,70,40,${.9 - k*.15})`; ctx.beginPath(); ctx.moveTo(0, hz + 4 + i*8); for (let x=0;x<=W;x+=20) ctx.lineTo(x, hz + 4 + i*8 - Math.abs(Math.sin(x/90 + i*1.7))*(26 - i*5)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); }
    [[W*.3, hz+30, 40],[W*.62, hz+22, 30],[W*.8, hz+40, 50]].forEach(([x,y,r]) => { ell(ctx, x, y, r, r*.32, kind === 'plain_night' ? '#0c0e08' : '#3a4028'); for (let i=0;i<5;i++) ctx.fillRect(x - r*.7 + i*r*.35, y - r*.2 + hash(i,x)*4, 3, 5); });
    if (kind === 'plain_night' && S && S.f && S.f.c5_night && !S.f.c5_rentFought) { const rx = W*.72, ry = hz - 4; glow(ctx, rx, ry + 10, 70, '#9a86e0', .3 + Math.sin(t/200)*.08); ctx.strokeStyle = `rgba(210,205,230,${.7 + Math.sin(t/90)*.2})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx - 6, ry - 30); ctx.quadraticCurveTo(rx + 8, ry - 5, rx - 4, ry + 20); ctx.stroke(); }
  } else {
  // the wagon, small, to the right
  ctx.fillStyle = '#2a2018'; ctx.fillRect(W*.72, hz + 10, 60, 22); ctx.fillStyle = '#4a3a26'; ctx.fillRect(W*.72, hz + 2, 60, 10); ell(ctx, W*.72 + 12, hz + 34, 7, 7, '#15100a'); ell(ctx, W*.72 + 48, hz + 34, 7, 7, '#15100a');
  }
  // the squad walking, small
  (typeof SQUAD === 'function' && S ? SQUAD() : PORDER).forEach((id, i) => drawFigure(ctx, id, W*.12 + i*36, H*.9, 2.1, t, {phase:i, dir:1}));
  const v = ctx.createRadialGradient(W/2, H*.55, H*.3, W/2, H*.55, W*.75); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1, kind === 'plain_night' ? 'rgba(0,0,0,.85)' : 'rgba(0,0,0,.6)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
}

/* Darujhistan, for Chapter 3 talk nodes: the street, the Phoenix Inn, the cellar under the dig, the dye-shop room, a rooftop at dawn */
function drawCity(cv, kind, t){
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, fl = .85 + Math.sin(t/140)*.06 + Math.sin(t/53)*.04;
  const squad = (typeof SQUAD === 'function' && S ? SQUAD() : PORDER);
  ctx.fillStyle = '#060505'; ctx.fillRect(0,0,W,H);
  if (kind === 'inn') {
    const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#1a120c'); g.addColorStop(1,'#0a0705'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#2a1c10'; for (let i=0;i<4;i++) ctx.fillRect(0, H*.08 + i*H*.16, W, 6); // beams
    ctx.fillStyle = '#1e140c'; ctx.fillRect(0, H*.7, W, H*.3); ctx.strokeStyle = 'rgba(0,0,0,.4)'; for (let i=0;i<9;i++){ ctx.beginPath(); ctx.moveTo(0, H*.7 + i*H*.035); ctx.lineTo(W, H*.7 + i*H*.035); ctx.stroke(); } // floorboards
    // the bar, bottles, a hearth to the right
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(W*.02, H*.5, W*.34, H*.08); ctx.fillStyle = '#26190f'; ctx.fillRect(W*.02, H*.58, W*.34, H*.2);
    for (let i=0;i<9;i++){ ctx.fillStyle = ['#4a6a3a','#6a3a2a','#3a3a5a'][i%3]; ctx.fillRect(W*.04 + i*W*.035, H*.36 + hash(i,2)*8, 8, 24 - hash(i,3)*8); }
    glow(ctx, W*.86, H*.62, W*.3, '#e8923a', .4*fl); ctx.fillStyle = '#1a1210'; ctx.fillRect(W*.78, H*.4, W*.18, H*.32); ctx.fillStyle = '#0a0605'; ctx.fillRect(W*.81, H*.46, W*.12, H*.26);
    poly(ctx, [[W*.84, H*.72],[W*.9, H*.72],[W*.87 + Math.sin(t/90)*4, H*.72 - 30*fl]], '#ffb35a'); poly(ctx, [[W*.855, H*.72],[W*.885, H*.72],[W*.87 + Math.sin(t/70)*2, H*.72 - 16*fl]], '#fff1c2');
    // tables and candles
    [[W*.5, H*.66],[W*.28, H*.8]].forEach(([x,y]) => { ell(ctx, x, y, 44, 12, '#2e2014'); ctx.fillStyle = '#1c130b'; ctx.fillRect(x-4, y, 8, 20); ell(ctx, x+18, y-6, 2, 5, '#e8d8a8'); glow(ctx, x+18, y-10, 40, '#ffb060', .3*fl); });
    [['kruppe', W*.42, H*.9, 1], ['crokus', W*.56, H*.84, -1], ['murillio', W*.66, H*.92, -1], ['coll', W*.16, H*.72, 1]].forEach(([k,x,y,d], i) => drawFigure(ctx, k, x, y, 2.3, t, {still:true, dir:d, phase:i}));
    squad.slice(0,3).forEach((id, i) => drawFigure(ctx, id, W*.78 + i*30, H*.98, 2.1, t, {phase:i, dir:-1}));
  } else if (kind === 'cellar') {
    const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0a0908'); g.addColorStop(1,'#14100d'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1; for (let r=0;r<12;r++) for (let c=0;c<14;c++){ ctx.strokeRect(c*W/14 + (r%2)*W/28, r*H/12, W/14, H/12); } // cut stone
    // gas conduit: a bronze pipe along the back wall, blue seep at the joints
    ctx.fillStyle = '#4a3a22'; ctx.fillRect(0, H*.3, W, 14); ctx.fillStyle = '#6b5a3c'; ctx.fillRect(0, H*.3, W, 3);
    for (let i=0;i<5;i++){ const x = W*.1 + i*W*.2; ctx.fillStyle = '#3a2c18'; ctx.fillRect(x-6, H*.3-4, 12, 22); glow(ctx, x, H*.3 + 7, 30, '#6aa8ff', .12 + Math.sin(t/300 + i)*.06); }
    // crates with seals, a lantern, the hole above
    for (let i=0;i<6;i++){ const x = W*.55 + (i%3)*52, y = H*.62 + Math.floor(i/3)*-30; ctx.fillStyle = '#3a2c1c'; ctx.fillRect(x, y, 46, 28); ctx.fillStyle = '#6b5a3c'; ctx.fillRect(x, y, 46, 4); ctx.fillStyle = '#8fa38a'; ctx.fillRect(x+16, y+10, 14, 9); }
    ell(ctx, W*.3, H*.2, 60, 14, '#000'); ctx.fillStyle = 'rgba(90,140,210,.12)'; ell(ctx, W*.3, H*.2, 50, 10, 'rgba(90,140,210,.12)');
    ell(ctx, W*.22, H*.72, 5, 10, '#e8d8a8'); glow(ctx, W*.22, H*.66, W*.35, '#e8923a', .35*fl);
    [['fiddler', W*.4, H*.9, -1], ['hedge', W*.5, H*.84, 1]].forEach(([k,x,y,d], i) => drawFigure(ctx, k, x, y, 2.3, t, {still:true, dir:d, phase:i}));
    squad.slice(0,3).forEach((id, i) => drawFigure(ctx, id, W*.1 + i*34, H*.97, 2.1, t, {phase:i, dir:1}));
  } else if (kind === 'room') {
    const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#120e0c'); g.addColorStop(1,'#080606'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    // skeins hung to dry, blue and madder
    for (let i=0;i<12;i++){ const x = W*.06 + i*W*.08, h = 40 + hash(i,4)*50; ctx.fillStyle = i%3 === 0 ? '#2a3a6a' : i%3 === 1 ? '#6a2a2a' : '#3a4a7a'; ctx.fillRect(x, H*.06, 14, h); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x+9, H*.06, 5, h); }
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, H*.06); ctx.lineTo(W, H*.06); ctx.stroke();
    ctx.fillStyle = '#1e140c'; ctx.fillRect(0, H*.72, W, H*.28);
    // one table, one lamp, one chair
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(W*.4, H*.6, W*.2, H*.05); ctx.fillStyle = '#26190f'; ctx.fillRect(W*.42, H*.65, W*.02, H*.2); ctx.fillRect(W*.56, H*.65, W*.02, H*.2);
    ctx.fillStyle = '#2a1e12'; ctx.fillRect(W*.66, H*.56, W*.06, H*.3); ctx.fillRect(W*.66, H*.56, W*.1, H*.03);
    ell(ctx, W*.5, H*.56, 4, 8, '#e8d8a8'); glow(ctx, W*.5, H*.5, W*.32, '#ffb060', .4*fl);
    drawFigure(ctx, 'claw', W*.7, H*.9, 2.5, t, {still:true, dir:-1});
    squad.slice(0,3).forEach((id, i) => drawFigure(ctx, id, W*.18 + i*36, H*.97, 2.1, t, {phase:i, dir:1}));
  } else {
    // the street or the roof: night sky, Moon's Spawn over the lake, roofs, blue lamps
    const dawn = kind === 'roof', roofN = kind === 'roof_night';
    const sky = ctx.createLinearGradient(0,0,0,H*.6); if (dawn) { sky.addColorStop(0,'#1a1a2a'); sky.addColorStop(.7,'#4a3a4a'); sky.addColorStop(1,'#a06a50'); } else { sky.addColorStop(0,'#04040a'); sky.addColorStop(1,'#10121e'); }
    ctx.fillStyle = sky; ctx.fillRect(0,0,W,H*.6);
    if (!dawn) { ctx.fillStyle = 'rgba(220,220,240,.6)'; for (let i=0;i<50;i++) ctx.fillRect(hash(i,41)*W, hash(i,42)*H*.5, 1, 1); }
    // Moon's Spawn, hanging
    const mx = W*.74, my = H*.2 + Math.sin(t/4000)*2; glow(ctx, mx, my, 70, dawn ? '#6a4a5a' : '#2a2a3a', .5);
    poly(ctx, [[mx-38,my+14],[mx-30,my-22],[mx-8,my-34],[mx+20,my-30],[mx+40,my-8],[mx+34,my+18],[mx+8,my+28],[mx-22,my+24]], dawn ? '#14101a' : '#08080c');
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ell(ctx, mx-6, my+4, 30, 22, 'rgba(0,0,0,.35)'); for (let i=0;i<6;i++){ ctx.fillStyle = `rgba(200,180,120,${.15 + hash(i,9)*.2})`; ctx.fillRect(mx - 24 + hash(i,10)*44, my - 12 + hash(i,11)*28, 1.5, 1.5); }
    // the lake, a line of it, and the far shore
    ctx.fillStyle = dawn ? '#3a3a4a' : '#0c1018'; ctx.fillRect(0, H*.52, W, H*.1); ctx.fillStyle = dawn ? 'rgba(200,140,120,.15)' : 'rgba(90,140,210,.12)'; for (let i=0;i<20;i++) ctx.fillRect(hash(i,12)*W, H*.53 + hash(i,13)*H*.08, 10 + hash(i,14)*20, 1);
    // roofs, stepped, then the street or the near roof
    for (let i=0;i<12;i++){ const x = i*W/11 - 10, h = H*.12 + hash(i,15)*H*.18, w = W/11 + 14; ctx.fillStyle = dawn ? (i%2 ? '#241c22' : '#1c161c') : (i%2 ? '#0c0a0e' : '#100d12'); poly(ctx, [[x, H*.62],[x, H*.62 - h],[x + w*.5, H*.62 - h - 18],[x + w, H*.62 - h],[x + w, H*.62]], ctx.fillStyle); if (!dawn && hash(i,16) > .5) { ctx.fillStyle = 'rgba(232,192,115,.25)'; ctx.fillRect(x + w*.4, H*.62 - h*.5, 6, 8); } }
    if (roofN) { ctx.fillStyle = '#16141a'; ctx.fillRect(0, H*.66, W, H*.34); ctx.strokeStyle = 'rgba(0,0,0,.5)'; for (let r=0;r<6;r++){ ctx.beginPath(); ctx.moveTo(0, H*.66 + r*H*.06); ctx.lineTo(W, H*.66 + r*H*.06); ctx.stroke(); }
      ctx.fillStyle = '#0e0c10'; ctx.fillRect(W*.7, H*.5, 22, H*.2); ctx.fillRect(W*.2, H*.56, 16, H*.12); for (let i=0;i<3;i++) ell(ctx, W*.7 + 11 + Math.sin(t/600 + i)*6, H*.5 - 10 - i*14, 8 + i*4, 5 + i*2, `rgba(120,120,130,${.12 - i*.03})`);
      ctx.fillStyle = 'rgba(232,192,115,.16)'; ctx.fillRect(W*.42, H*.72, 50, 26); ctx.strokeStyle = '#3a2c1c'; ctx.lineWidth = 2; ctx.strokeRect(W*.42, H*.72, 50, 26);
      for (let i=0;i<20;i++) ell(ctx, hash(i,21)*W, H*.68 + hash(i,22)*H*.3, 30, 6, 'rgba(120,140,170,.05)');
      drawFigure(ctx, 'andii', W*.9, H*.62, 1.5, t, {still:true, dir:-1, alpha:.5}); }
    else if (dawn) { ctx.fillStyle = '#1e1a1e'; ctx.fillRect(0, H*.66, W, H*.34); ctx.strokeStyle = 'rgba(0,0,0,.5)'; for (let r=0;r<6;r++){ ctx.beginPath(); ctx.moveTo(0, H*.66 + r*H*.06); ctx.lineTo(W, H*.66 + r*H*.06); ctx.stroke(); } for (let i=0;i<30;i++) ell(ctx, hash(i,17)*W, H*.7 + hash(i,18)*H*.3, 8, 3, 'rgba(120,130,150,.12)');
      drawFigure(ctx, 'assassin', W*.9, H*.66, 1.6, t, {still:true, dir:-1, alpha:.55});
    } else { ctx.fillStyle = '#16161a'; ctx.fillRect(0, H*.62, W, H*.38); ctx.strokeStyle = 'rgba(0,0,0,.45)'; for (let i=0;i<40;i++){ ctx.beginPath(); ctx.ellipse(hash(i,19)*W, H*.66 + hash(i,20)*H*.34, 9, 4, 0, 0, 7); ctx.stroke(); }
      for (let i=0;i<4;i++){ const x = W*.1 + i*W*.27, y = H*.62; ctx.fillStyle = '#1a1a1c'; ctx.fillRect(x-2, y-46, 4, 46); ctx.fillStyle = '#2e2e32'; ctx.fillRect(x-6, y-54, 12, 10); ctx.fillStyle = `rgba(160,210,255,${.7 + Math.sin(t/230 + i)*.2})`; ctx.fillRect(x-3, y-52, 6, 6); glow(ctx, x, y-48, 60, '#6aa8ff', .3*fl); ctx.fillStyle = 'rgba(90,140,210,.08)'; ell(ctx, x, y+10, 40, 10, 'rgba(90,140,210,.08)'); } }
    squad.forEach((id, i) => drawFigure(ctx, id, W*.12 + i*36, H*.92, 2.1, t, {phase:i, dir:1}));
  }
  const v = ctx.createRadialGradient(W/2, H*.55, H*.3, W/2, H*.55, W*.72); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.8)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
}
