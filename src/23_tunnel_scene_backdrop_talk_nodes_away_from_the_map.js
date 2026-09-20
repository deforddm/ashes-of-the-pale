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
