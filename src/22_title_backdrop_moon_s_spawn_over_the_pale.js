/* ============ title backdrop: Moon's Spawn over the Pale ============ */
let titleAnim = null;
/* the floating mountain: basalt, faceted, crags on its back and spires hanging from its underside, lit from below by the burning city */
function paintTitleSpawn(x, ms){
  const pts = []; for (let i=0;i<48;i++){ const a = i/48*Math.PI*2, up = Math.sin(a) < 0, n = hash(i,7), r = ms*(up ? .82 + n*.16 + (i%3 === 0 ? .12 : 0) : .72 + n*.1); pts.push([Math.cos(a)*r*1.08, Math.sin(a)*r*(up ? .62 : .5)]);
    if (!up && i%3 === 1) { const b = a + .04; pts.push([Math.cos(b)*r*1.02, Math.sin(b)*r*.5 + ms*(.06 + n*.14)]); } } // crags above, spires hanging below
  const path = () => { x.beginPath(); pts.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.closePath(); };
  path(); const g = x.createRadialGradient(-ms*.35, -ms*.3, ms*.05, 0, 0, ms*1.1); g.addColorStop(0, '#1d1926'); g.addColorStop(.6, '#0c0a10'); g.addColorStop(1, '#040305'); x.fillStyle = g; x.fill();
  x.save(); path(); x.clip();
  for (let i=0;i<70;i++){ const cx = (hash(i,21) - .5)*ms*2, cy = (hash(i,22) - .5)*ms*1.1, r = ms*(.05 + hash(i,23)*.12), a = hash(i,24)*6; // basalt facets
    x.fillStyle = hash(i,25) > .5 ? `rgba(60,52,78,${.1 + hash(i,26)*.12})` : `rgba(0,0,0,${.2 + hash(i,26)*.2})`; x.beginPath(); x.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r*.6); x.lineTo(cx + Math.cos(a + 2.1)*r, cy + Math.sin(a + 2.1)*r*.6); x.lineTo(cx + Math.cos(a + 4.2)*r*.7, cy + Math.sin(a + 4.2)*r*.5); x.fill(); }
  x.strokeStyle = 'rgba(0,0,0,.55)'; x.lineWidth = 1; for (let i=0;i<14;i++){ let px = (hash(i,31) - .5)*ms*1.8, py = -ms*.45; x.beginPath(); x.moveTo(px, py); for (let j=0;j<5;j++){ px += (hash(i,j + 32) - .5)*ms*.2; py += ms*.2; x.lineTo(px, py); } x.stroke(); } // fissures
  const ug = x.createRadialGradient(ms*.2, ms*.7, ms*.1, ms*.1, ms*.5, ms*1.1); ug.addColorStop(0, 'rgba(255,120,50,.15)'); ug.addColorStop(1, 'rgba(255,120,50,0)'); x.fillStyle = ug; x.fillRect(-ms*1.2, -ms, ms*2.4, ms*2); // the fires of the Pale, on its belly
  x.restore();
  x.save(); path(); x.clip(); x.globalCompositeOperation = 'lighter'; x.strokeStyle = 'rgba(154,134,224,.13)'; x.lineWidth = 2; x.translate(ms*.02, ms*.03); path(); x.stroke(); x.restore(); // rim of Kurald Galain
  for (let i=0;i<16;i++){ const a = hash(i,11)*Math.PI*2, r = hash(i,12)*ms*.7; x.fillStyle = `rgba(201,187,255,${.2 + hash(i,13)*.4})`; x.fillRect(Math.cos(a)*r, Math.sin(a)*r*.45, 1.6, 1.6); } // Andii windows
}
/* what is left of Pale: walls with the tops knocked off, towers broken off at different heights, a dome stove in */
function paintTitleSkyline(x, W, H){
  const base = H*.8; x.fillStyle = '#070505'; let px = -10, i = 0; const lits = [];
  while (px < W + 10) { const k = [1,0,2,1,3,2,4,1][Math.floor(hash(i,1)*8)], w = Math.max(10, Math.min(W, 700)*(.03 + hash(i,2)*.05)), h = H*(.06 + hash(i,3)*.16)*(k === 1 || k === 2 ? 1.2 : 1);
    if (k === 0) { x.fillRect(px, base - h*.45, w*1.6, h*.45 + 2); for (let j=0;j<4;j++) if (hash(i,j + 10) > .4) x.fillRect(px + j*w*.42, base - h*.45 - 3, w*.22, 3); px += w*1.6; } // a wall, crenels gone ragged
    else if (k === 1 || k === 2) { x.beginPath(); x.moveTo(px, base + 2); x.lineTo(px, base - h); x.lineTo(px + w*.3, base - h - h*.12*hash(i,4)); x.lineTo(px + w*.55, base - h*(.8 + hash(i,5)*.1)); x.lineTo(px + w*.8, base - h*(1.05 + hash(i,6)*.15)); x.lineTo(px + w, base - h*.9); x.lineTo(px + w, base + 2); x.fill(); // a tower, broken
      if (hash(i,7) > .5) lits.push([px + w*.4, base - h*.55, w*.2, h*.1]); px += w + W*.004; }
    else if (k === 3) { x.fillRect(px, base - h*.5, w*1.3, h*.5 + 2); x.beginPath(); x.arc(px + w*.65, base - h*.5, w*.6, Math.PI, Math.PI*1.55); x.lineTo(px + w*.65, base - h*.5); x.fill(); x.fillStyle = '#0a0706'; x.fillRect(px + w*.3, base - h*.3, w*.2, h*.3); x.fillStyle = '#070505'; px += w*1.3; } // a dome, half of it gone
    else { x.fillRect(px, base - h*.25, w*2, h*.25 + 2); x.beginPath(); for (let j=0;j<3;j++){ x.moveTo(px + j*w*.66, base - h*.25); x.arc(px + j*w*.66 + w*.33, base - h*.25, w*.28, Math.PI, 0, true); } x.fillStyle = '#0c0807'; x.fill(); x.fillStyle = '#070505'; px += w*2; } // arches, fire behind them
    i++; }
  x.fillRect(0, base, W, H - base); return lits;
}
function startTitleBackdrop(cv){
  const ctx = cv.getContext('2d'); const dpr = Math.min(2, window.devicePixelRatio || 1);
  let spawn = null, sky = null, lits = [];
  const fit = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); spawn = sky = null; }; fit(); window.addEventListener('resize', fit);
  const ashp = Array.from({length:160}, (_, i) => ({x: Math.random(), y: Math.random(), v: .00008 + Math.random()*.00025, w: Math.random()*7, s: .8 + Math.random()*1.6}));
  const embers = Array.from({length:40}, (_, i) => ({x: .3 + Math.random()*.5, y: Math.random(), v: .0002 + Math.random()*.0004, w: Math.random()*7}));
  titleAnim = () => {
    if (!cv.isConnected) { titleAnim = null; window.removeEventListener('resize', fit); return; }
    const W = innerWidth, H = innerHeight, mo = REDUCE() ? 0 : 1, t = performance.now()*mo, ms = Math.min(W, H)*.36;
    if (!spawn) { spawn = document.createElement('canvas'); const r = Math.ceil(ms*1.5); spawn.width = spawn.height = r*2*dpr; const x = spawn.getContext('2d'); x.setTransform(dpr,0,0,dpr,0,0); x.translate(r, r); paintTitleSpawn(x, ms); spawn.r = r; }
    if (!sky) { sky = document.createElement('canvas'); sky.width = W*dpr; sky.height = H*dpr; const x = sky.getContext('2d'); x.setTransform(dpr,0,0,dpr,0,0); lits = paintTitleSkyline(x, W, H); }
    const g = ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#050408'); g.addColorStop(.55,'#120e14'); g.addColorStop(.8,'#2a1810'); g.addColorStop(1,'#0a0605'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = 'rgba(230,220,200,.5)'; for (let i=0;i<40;i++) ctx.fillRect(hash(i,8)*W, hash(i,9)*H*.5, 1, 1);
    const fl = .9 + (Math.sin(t/130)*.06 + Math.sin(t/53)*.04)*mo; glow(ctx, W*.62, H*.74, W*.55, '#ff7a2a', .28*fl); glow(ctx, W*.25, H*.76, W*.35, '#c94a20', .18*fl); // fires on the horizon
    const mx = W*.3 + Math.sin(t/9000)*8, my = H*.28 + Math.sin(t/6000)*6; glow(ctx, mx, my, ms*1.4, '#9a86e0', .08); ctx.drawImage(spawn, mx - spawn.r, my - spawn.r, spawn.r*2, spawn.r*2); // Moon's Spawn
    for (let i=0;i<5;i++){ for (let j=0;j<8;j++){ const yy = H*.78 - j*H*.05 - ((t/40 + i*90) % (H*.05)); const xx = W*(.15 + i*.18) + Math.sin(t/2500 + j + i)*(10 + j*4); ell(ctx, xx, yy, 18 + j*7, 10 + j*3, `rgba(40,32,30,${.14 - j*.014})`); } } // smoke columns
    ctx.drawImage(sky, 0, 0, W, H); lits.forEach(([x, y, w, h], i) => { ctx.fillStyle = `rgba(255,140,50,${.45 + Math.sin(t/170 + i*7)*.25})`; ctx.fillRect(x, y, w, h); }); // what is left of the city, some of it still burning
    for (let i=0;i<6;i++) ell(ctx, (hash(i,20)*1.4 - .2)*W + Math.sin(t/4000 + i)*40, H*.82 + hash(i,21)*H*.1, W*.3, H*.03, 'rgba(60,50,48,.12)'); // ground fog
    embers.forEach(e => { if (mo) { e.y -= e.v; if (e.y < .5) e.y = 1; } const a = (e.y - .5)*2; ctx.fillStyle = `rgba(255,${140 + Math.round(hash(Math.round(e.w*9), Math.floor(t/90))*50)},40,${a*.8})`; ctx.fillRect(e.x*W + Math.sin(t/600 + e.w)*6, e.y*H, 2, 2); });
    ctx.fillStyle = 'rgba(200,190,175,.32)'; ashp.forEach(a => { if (mo) { a.y += a.v; if (a.y > 1) a.y = -.02; } ctx.fillRect((a.x + Math.sin(t/1800 + a.w)*.012)*W, a.y*H, a.s, a.s); });
    const v = ctx.createRadialGradient(W/2, H*.5, H*.2, W/2, H*.5, H*.9); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.7)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
  };
}
