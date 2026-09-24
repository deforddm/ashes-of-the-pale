/* ============ scene backdrops (talk nodes away from the map) ============ */
/* The backdrop canvas is sized by CSS (full width, 240px tall), so its backing store is fitted here to the box it is shown in,
   at the device's pixel ratio: nothing is squashed on a narrow phone, and it stays sharp. W and H are CSS pixels. */
function sceneFit(cv){
  const ctx = cv.getContext('2d'), cw = cv.clientWidth, ch = cv.clientHeight;
  if (!cw || !ch) { ctx.setTransform(1,0,0,1,0,0); return {ctx, W:cv.width, H:cv.height}; }
  const dpr = Math.min(2, window.devicePixelRatio || 1), bw = Math.round(cw*dpr), bh = Math.round(ch*dpr);
  if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
  ctx.setTransform(bw/cw, 0, 0, bh/ch, 0, 0); return {ctx, W:cw, H:ch};
}
/* the still parts of a backdrop, painted once per kind and size; the frame only adds what moves */
const SCENE_CACHE = new Map();
function sceneLayer(key, W, H, paint){ const dpr = Math.min(2, window.devicePixelRatio || 1), k = `${key}|${W}x${H}|${dpr}`; let c = SCENE_CACHE.get(k);
  if (!c) { c = document.createElement('canvas'); c.width = Math.max(1, Math.round(W*dpr)); c.height = Math.max(1, Math.round(H*dpr)); const x = c.getContext('2d'); x.setTransform(dpr,0,0,dpr,0,0); paint(x, W, H); if (SCENE_CACHE.size > 12) SCENE_CACHE.clear(); SCENE_CACHE.set(k, c); }
  return c; }
const sceneSquad = () => (typeof SQUAD === 'function' && S ? SQUAD() : PORDER);
/* a column walking right, drawn left to right: the rest behind, then Brisk, then the sergeant in the lead */
const marchOrder = sq => { const lead = ['brisk','sgt'].filter(id => sq.includes(id)); return [...sq.filter(id => !lead.includes(id)), ...lead]; };
/* the sapper tunnels under the Pale: timber frames going back into the dark, a lantern on the nearest, rubble; or, deeper, Kurald Galain seeping in */
function paintTunnel(x, W, H, dark, barrow = false){ // barrow: a Rhivi barrow on the plain, dry-laid stone instead of timber shoring
  const vx = W*.56, vy = H*.42, N = 7, fr = i => { const k = Math.pow(.64, i); return {l:vx - W*.66*k, r:vx + W*.66*k, t:vy - H*.6*k, b:vy + H*.66*k, k}; };
  x.fillStyle = dark ? '#060509' : '#0a0807'; x.fillRect(0,0,W,H);
  const end = fr(N); x.fillStyle = dark ? '#0c0816' : '#050404'; x.fillRect(end.l, end.t, end.r - end.l, end.b - end.t);
  const q = (pts, c) => poly(x, pts, c), stone = (a, b, lit, side, seed) => { // lumps of rock and cracks between two frames
    for (let j=0;j<5;j++){ const u = hash(seed, j, 1), v = hash(seed, j, 2), px = side === 'l' ? lerp(a.l, b.l, u) : side === 'r' ? lerp(a.r, b.r, u) : lerp(lerp(a.l, b.l, u), lerp(a.r, b.r, u), v), py = side === 'f' ? lerp(a.b, b.b, u) : side === 'c' ? lerp(a.t, b.t, u) : lerp(lerp(a.t, b.t, u), lerp(a.b, b.b, u), .1 + v*.8), r = (W*.05 + hash(seed, j, 3)*W*.05)*lerp(a.k, b.k, u);
      ell(x, px, py, r, r*.6, `rgba(${dark ? '70,60,90' : '110,90,70'},${.12*lit})`, hash(seed, j, 4)*3); ell(x, px + r*.2, py + r*.2, r*.7, r*.35, `rgba(0,0,0,${.25})`, hash(seed, j, 4)*3); } };
  for (let i=N-1;i>=0;i--){ const a = fr(i), b = fr(i + 1), lit = clamp(1 - i*.15, .1, 1), c = (base, amt) => shade(base, -1 + lit*amt);
    q([[a.l, a.t],[b.l, b.t],[b.l, b.b],[a.l, a.b]], c(dark ? '#3a3448' : barrow ? '#48443c' : '#4a3a2c', .75)); q([[a.r, a.t],[b.r, b.t],[b.r, b.b],[a.r, a.b]], c(dark ? '#2a2636' : barrow ? '#34312b' : '#33291f', .6)); // walls, the left one lit
    q([[a.l, a.t],[a.r, a.t],[b.r, b.t],[b.l, b.t]], c('#241c16', .55)); q([[a.l, a.b],[a.r, a.b],[b.r, b.b],[b.l, b.b]], c(dark ? '#2a2630' : '#3a3026', .7)); // roof, floor
    ['l','r','c','f'].forEach((sd, j) => stone(a, b, lit, sd, i*4 + j + (dark ? 50 : 0)));
    if (barrow) { // dry-laid stone: two posts of stacked blocks and a lintel slab, mortarless
      const pw = W*.05*a.k, cap = H*.08*a.k, st = shade('#6e685c', -1 + lit*.95), sd = shade('#4a463e', -1 + lit*.9), rows = 6, rh = (a.b - a.t - cap)/rows;
      for (let r=0;r<rows;r++){ const yy = a.t + cap + r*rh, jog = (hash(i, r, 5) - .5)*pw*.25; x.fillStyle = st; x.fillRect(a.l + jog, yy, pw, rh - Math.max(.5, a.k)); x.fillStyle = sd; x.fillRect(a.r - pw - jog, yy, pw, rh - Math.max(.5, a.k)); }
      const g = x.createLinearGradient(0, a.t, 0, a.t + cap); g.addColorStop(0, st); g.addColorStop(1, sd); x.fillStyle = g; x.fillRect(a.l - pw*.2, a.t, a.r - a.l + pw*.4, cap);
      x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(a.l + pw, a.t + cap, a.r - a.l - pw*2, cap*.3); continue; }
    const pw = W*.045*a.k, cap = H*.07*a.k, wood = shade('#6a4a2a', -1 + lit*.95), wd = shade('#3a2616', -1 + lit*.9); // the frame: two posts and a cap
    x.fillStyle = wood; x.fillRect(a.l, a.t, pw, a.b - a.t); x.fillStyle = wd; x.fillRect(a.r - pw, a.t, pw, a.b - a.t);
    const g = x.createLinearGradient(0, a.t, 0, a.t + cap); g.addColorStop(0, wood); g.addColorStop(1, wd); x.fillStyle = g; x.fillRect(a.l, a.t, a.r - a.l, cap);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(a.l + pw, a.t + cap, a.r - a.l - pw*2, cap*.35); x.fillRect(a.l + pw*.7, a.t, pw*.3, a.b - a.t);
    x.strokeStyle = `rgba(0,0,0,${.4})`; x.lineWidth = Math.max(.5, a.k*1.2); x.beginPath(); for (let j=1;j<4;j++){ x.moveTo(a.l + pw*j/4, a.t + cap); x.lineTo(a.l + pw*j/4 + (hash(i,j)-.5)*pw*.3, a.b); } x.stroke(); } // grain
  // the near floor: rubble, a fallen beam, a puddle
  const f0 = fr(0); for (let i=0;i<26;i++){ const u = hash(i, 7), yy = lerp(f0.b, H, hash(i, 8)*.9) - H*.02, r = 3 + hash(i, 9)*10*(yy/H); ell(x, lerp(-10, W + 10, u), yy, r, r*.55, i%3 ? '#14100c' : '#241c16'); ell(x, lerp(-10, W + 10, u) - r*.3, yy - r*.2, r*.5, r*.25, 'rgba(120,100,80,.08)'); }
  if (barrow) { const e = fr(3); x.fillStyle = '#2a2722'; x.fillRect(lerp(e.l, e.r, .22), lerp(e.t, e.b, .72), (e.r - e.l)*.56, (e.b - e.t)*.12); x.fillStyle = 'rgba(160,150,130,.14)'; x.fillRect(lerp(e.l, e.r, .22), lerp(e.t, e.b, .72), (e.r - e.l)*.56, (e.b - e.t)*.025); } // the slab, with nothing on it
  else { x.save(); x.translate(W*.72, H*.86); x.rotate(-.12); x.fillStyle = '#1e140c'; x.fillRect(-W*.16, -5, W*.32, 9); x.fillStyle = 'rgba(120,90,60,.2)'; x.fillRect(-W*.16, -5, W*.32, 2); x.restore(); }
  ell(x, W*.3, H*.9, W*.1, H*.02, dark ? 'rgba(120,100,200,.12)' : 'rgba(232,150,80,.12)');
}
function drawScene(cv, kind, t){
  const {ctx, W, H} = sceneFit(cv), dark = kind === 'dark', barrow = kind === 'rhivi_barrow', mo = REDUCE() ? 0 : 1, fl = .82 + (Math.sin(t/110)*.08 + Math.sin(t/41)*.05)*mo;
  ctx.drawImage(sceneLayer('tunnel:' + (dark ? 'dark' : barrow ? 'barrow' : ''), W, H, (x, W, H) => paintTunnel(x, W, H, dark, barrow)), 0, 0, W, H);
  const vx = W*.56, vy = H*.42, lx = vx - W*.66*.64 + W*.1, ly = vy - H*.6*.64 + H*.1; // the lantern, hung from the second frame
  if (dark) { const p = (Math.sin(t/900) + 1)/2; glow(ctx, vx, vy, W*.3, '#9a86e0', .16 + p*.1); for (let i=0;i<9;i++){ const k = ((t/(5200 + i*300)*mo + hash(i,3)) % 1); ell(ctx, lerp(vx, hash(i,4)*W, k), lerp(vy + H*.1, H*.84, k), 16 + k*50, 4 + k*9, `rgba(70,55,120,${.12*Math.sin(k*Math.PI)})`); } }
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, lx, ly + 10, W*.5, '#e8923a', (dark ? .16 : .26)*fl); glow(ctx, lx, ly + 8, 26, '#ffc070', .5*fl); ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = '#1a140e'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, ly - 8); ctx.lineTo(lx, ly + 1); ctx.stroke(); ctx.fillStyle = '#2a2016'; ctx.fillRect(lx - 4, ly + 1, 8, 11); ctx.fillStyle = `rgba(255,${200 + Math.round(fl*20)},130,${.75*fl})`; ctx.fillRect(lx - 2.6, ly + 3, 5.2, 7); ctx.fillStyle = '#2a2016'; ctx.fillRect(lx - 5, ly, 10, 1.6);
  const sq = sceneSquad(), n = sq.length; sq.forEach((id, i) => drawFigure(ctx, id, W*.5 + (i - (n - 1)/2)*Math.min(44, W*.8/n), H*.95 - (i%2)*4, 1.9, t, {phase:i, dir: i < n/2 ? 1 : -1}));
  ctx.fillStyle = 'rgba(210,190,160,.3)'; for (let i=0;i<22;i++){ const y = (hash(i,10)*H + t*.012*mo*(1 + hash(i,11))) % H, xx = lx + (hash(i,9) - .5)*W*.6 + Math.sin(t/1400 + i)*6; ctx.globalAlpha = clamp(1 - Math.hypot(xx - lx, y - ly)/(W*.35), 0, 1); ctx.fillRect(xx, y, 1.4, 1.4); } ctx.globalAlpha = 1; // dust in the lantern light
  vign(ctx, W, H, .8, .5);
}

/* tent and fire interiors for Chapter 1 talk nodes */
function drawInterior(cv, kind, t){
  const {ctx, W, H} = sceneFit(cv), fl = .8 + Math.sin(t/110)*.08 + Math.sin(t/41)*.05;
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
    SQUAD().slice(0,3).forEach((id, i) => drawFigure(ctx, id, W*.4 + i*40, H*.95, 2.2, t, {phase:i, dir:-1}));
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

/* the Rhivi Plain (Chapter 2) and the Gadrobi Hills (Chapter 5): day, dusk and night; the light in the west once it rises; the rent on the far hill */
function paintPlain(x, W, H, hills, tod, hz){
  const night = tod === 'night', dusk = tod === 'dusk';
  x.fillStyle = vgrad(x, 0, hz, night ? [[0,'#030309'],[1,'#0e0d18']] : dusk ? [[0,'#140e1a'],[.45,'#3e1e24'],[.8,'#9a4a2a'],[1,'#e08a44']] : [[0,'#2a3040'],[.6,'#6e6e68'],[1,'#b0a68c']]); x.fillRect(0,0,W,hz + 2);
  if (night) { for (let i=0;i<110;i++){ const sx = hash(i,41)*W, sy = Math.pow(hash(i,42), 1.3)*hz; if (hills && sx > W*.52 && sx < W*.9 && sy > hz*.35) continue; x.fillStyle = `rgba(225,225,245,${.25 + hash(i,43)*.55})`; x.fillRect(sx, sy, hash(i,44) > .9 ? 1.6 : 1, hash(i,44) > .9 ? 1.6 : 1); } // no stars over the barrow
    x.fillStyle = 'rgba(160,160,200,.05)'; x.beginPath(); x.ellipse(W*.3, hz*.45, W*.5, hz*.12, -.3, 0, 7); x.fill(); } // the smear of the sky's river
  else if (dusk) { const sx = W*.84, sy = hz - H*.035; glow(x, sx, sy, W*.5, '#ff9a50', .4); ell(x, sx, sy, 16, 16, '#ffc890'); glow(x, sx, sy, 30, '#fff0c0', .5);
    for (let i=0;i<5;i++) cloud(x, W*(.2 + hash(i,5)*.6), hz*(.3 + i*.13), W*(.26 + hash(i,6)*.24), 3 + i, i%2 ? '#e07848' : '#b85a4a', .16); } // cloud lit from below
  else { cloud(x, W*.28, hz*.28, W*.4, 12, '#e8e4dc', .16); cloud(x, W*.74, hz*.16, W*.3, 9, '#e8e4dc', .12); cloud(x, W*.6, hz*.55, W*.5, 6, '#f0e8d8', .1); glow(x, W*.2, hz*.2, W*.5, '#fff4dc', .12); }
  // the horizon: a low line of haze on the plain; folded hills, one behind another, with the barrow mounds on them
  if (hills) { for (let i=0;i<4;i++){ const k = i/3, base = hz + i*H*.045, c = night ? shade('#10140c', -k*.2) : dusk ? shade(i%2 ? '#4a3020' : '#5a3a24', -k*.35) : shade(i%2 ? '#5a5a3a' : '#6a6440', -k*.3);
      x.fillStyle = c; x.beginPath(); x.moveTo(0, H); for (let px=0;px<=W + 16;px+=8) x.lineTo(px, base - Math.abs(Math.sin(px/(70 + i*25) + i*1.9))*(26 - i*5) - Math.sin(px/31 + i)*2); x.lineTo(W, H); x.fill();
      if (!night) { x.fillStyle = dusk ? 'rgba(255,150,80,.07)' : 'rgba(240,230,200,.06)'; x.fillRect(0, base - 30, W, 8); } }
    [[.18,.03,26],[.42,.06,18],[.64,.02,34]].forEach(([k, dy, r], i) => { const mx = W*k, my = hz + H*(.08 + dy) + i*6; ell(x, mx, my, r, r*.34, night ? '#0a0c07' : dusk ? '#3a2616' : '#4a4a2e'); ell(x, mx - r*.2, my - r*.12, r*.6, r*.14, night ? 'rgba(60,70,50,.15)' : 'rgba(255,230,180,.08)');
      for (let j=0;j<4;j++){ x.fillStyle = night ? '#1a1c16' : dusk ? '#5a4632' : '#7a7462'; x.fillRect(mx - r*.6 + j*r*.4, my - r*.32 - 3 - hash(i,j)*3, 2.2, 5 + hash(j,i)*3); } }); // knuckles of barrow under the grass, with stones
    if (dusk) { const mx = W*.64, my = hz + H*.08 + 12; ell(x, mx + 4, my - 2, 6, 3, '#050404'); } } // the opened barrow
  else { x.fillStyle = night ? '#0c0f0a' : dusk ? '#3a2a1c' : '#626448'; x.beginPath(); x.moveTo(0, hz + 2); for (let px=0;px<=W + 12;px+=12) x.lineTo(px, hz - Math.sin(px/90)*3 - Math.sin(px/23)*1.2); x.lineTo(W, hz + 2); x.fill();
    if (!night) { x.fillStyle = dusk ? 'rgba(255,170,100,.1)' : 'rgba(240,235,210,.12)'; x.fillRect(0, hz - 6, W, 8); } // haze on the line of the world
    if (tod === 'day') for (let i=0;i<14;i++) ell(x, W*.3 + hash(i,1)*W*.2, hz + 1 + hash(i,2)*3, 1.4, .9, '#2a2418'); } // a herd, very far off
  // the ground, grass all the way down
  x.fillStyle = vgrad(x, hz, H, night ? [[0,'#141a10'],[1,'#060805']] : dusk ? [[0,'#4a3a22'],[1,'#1e1a10']] : [[0,'#56603a'],[1,'#26301a']]); x.fillRect(0, hz + (hills ? H*.14 : 1), W, H);
  if (hills) { x.fillStyle = night ? '#0c100a' : dusk ? '#3a2c1a' : '#4a5030'; x.beginPath(); x.moveTo(0, H); x.lineTo(0, hz + H*.2); x.quadraticCurveTo(W*.3, hz + H*.12, W*.6, hz + H*.2); x.quadraticCurveTo(W*.85, hz + H*.26, W, hz + H*.18); x.lineTo(W, H); x.fill(); }
  x.lineWidth = 1; for (let i=0;i<260;i++){ const y0 = hz + (hills ? H*.2 : 3), yy = y0 + Math.pow(hash(i,52), .8)*(H - y0), px = hash(i,51)*W, d = (yy - y0)/(H - y0), h = 2 + d*9 + hash(i,53)*4;
    x.strokeStyle = night ? `rgba(70,90,55,${.2 + d*.25})` : dusk ? `rgba(${150 + d*40},${110 + d*20},60,${.2 + d*.3})` : `rgba(${120 + hash(i,54)*50},${140 + hash(i,55)*30},80,${.25 + d*.35})`; x.beginPath(); x.moveTo(px, yy); x.quadraticCurveTo(px + 1, yy - h*.6, px + (hash(i,56) - .5)*4, yy - h); x.stroke(); }
  if (!hills) { const wx = W*.74, wy = hz + H*.07; ell(x, wx + 30, wy + 26, 40, 5, 'rgba(0,0,0,.35)'); x.fillStyle = '#2a2018'; x.fillRect(wx, wy + 8, 58, 16); x.fillStyle = night ? '#2a2620' : '#8a7e66'; x.beginPath(); x.moveTo(wx - 2, wy + 9); x.quadraticCurveTo(wx + 29, wy - 14, wx + 60, wy + 9); x.fill(); x.strokeStyle = 'rgba(0,0,0,.35)'; for (let i=1;i<5;i++){ x.beginPath(); x.moveTo(wx + i*12, wy + 9); x.quadraticCurveTo(wx + i*12, wy - 4, wx + i*12 + 1, wy - 2); x.stroke(); } // the wagon, its canvas hooped
    [[wx + 10],[wx + 48]].forEach(([cx]) => { ell(x, cx, wy + 26, 7, 7, '#15100a'); x.strokeStyle = '#3a2c1c'; x.beginPath(); x.arc(cx, wy + 26, 5, 0, 7); x.stroke(); }); x.fillStyle = '#1a140e'; x.fillRect(wx + 58, wy + 18, 18, 2); }
}
function drawPlain(cv, kind, t){
  const {ctx, W, H} = sceneFit(cv), hills = kind.startsWith('hills'), tod = kind.endsWith('dusk') ? 'dusk' : kind.endsWith('night') ? 'night' : 'day', hz = H*(hills ? .44 : .58), mo = REDUCE() ? 0 : 1;
  ctx.drawImage(sceneLayer('plain:' + kind, W, H, (x, W, H) => paintPlain(x, W, H, hills, tod, hz)), 0, 0, W, H);
  if (!hills && tod === 'night' && S && S.f && S.f.c2_light && !S.f.c2_lightOut && !S.f.c2_lightDone) { const lx = W*.1, f = .85 + (Math.sin(t/140)*.08 + Math.sin(t/53)*.05)*mo; glow(ctx, lx, hz, W*.5, '#ffb35a', .35*f); const g = ctx.createLinearGradient(lx - 12, 0, lx + 12, 0); g.addColorStop(0,'rgba(255,200,120,0)'); g.addColorStop(.5,`rgba(255,230,180,${.55*f})`); g.addColorStop(1,'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(lx - 12, hz*.1, 24, hz*.9); } // the light in the west
  if (hills && tod === 'dusk') for (let i=0;i<4;i++){ const k = ((t/4200*mo + i/4) % 1); ell(ctx, W*.64 + 4 + k*18, hz + H*.08 + 8 - k*22, 5 + k*16, 2 + k*5, `rgba(200,220,235,${.16*(1 - k)})`); } // cold breathing out of the opened barrow
  if (hills && tod === 'night') { const hx = W*.72, hy = hz - 2; drawFigure(ctx, 'hairlock', hx, hy, 1.2, t, {still:true, alpha:.55}); // on the next hill, the size of a child and not one
    if (S && S.f && S.f.c5_night && !S.f.c5_rentFought) { glow(ctx, hx - 20, hy - 14, 70, '#9a86e0', .28 + Math.sin(t/200)*.08*mo); ctx.strokeStyle = `rgba(210,205,230,${.7 + Math.sin(t/90)*.2*mo})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx - 26, hy - 44); ctx.quadraticCurveTo(hx - 12, hy - 18, hx - 24, hy + 6); ctx.stroke(); } } // the rent
  ctx.lineWidth = 1.2; for (let i=0;i<46;i++){ const px = hash(i,61)*W, yy = H*(.9 + hash(i,62)*.12), h = 10 + hash(i,63)*14, sw = Math.sin(t/900 + i*.7)*3*mo; ctx.strokeStyle = tod === 'night' ? 'rgba(40,56,34,.8)' : tod === 'dusk' ? 'rgba(90,64,34,.8)' : 'rgba(84,100,52,.85)'; ctx.beginPath(); ctx.moveTo(px, yy); ctx.quadraticCurveTo(px + sw*.3, yy - h*.6, px + sw, yy - h); ctx.stroke(); } // the near grass, moving
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.1 + i*Math.min(36, W*.6/sq.length), H*.93 + (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, tod === 'night' ? .82 : tod === 'dusk' ? .62 : .5);
}

/* Darujhistan, for Chapter 3 talk nodes: the street, the Phoenix Inn, the cellar under the dig, the dye-shop room, a rooftop at dawn */
function drawCity(cv, kind, t){
  const {ctx, W, H} = sceneFit(cv), fl = .85 + Math.sin(t/140)*.06 + Math.sin(t/53)*.04;
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
    { const q3 = squad.slice(0,3), st = Math.min(30, W*.085); q3.forEach((id, i) => drawFigure(ctx, id, W - 22 - (q3.length - 1 - i)*st, H*.98, 2.1, t, {phase:i, dir:-1})); }
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
    marchOrder(squad.slice(0,3)).forEach((id, i) => drawFigure(ctx, id, W*.1 + i*34, H*.97, 2.1, t, {phase:i, dir:1}));
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
    marchOrder(squad.slice(0,3)).forEach((id, i) => drawFigure(ctx, id, W*.18 + i*36, H*.97, 2.1, t, {phase:i, dir:1}));
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
    marchOrder(squad).forEach((id, i) => drawFigure(ctx, id, W*.12 + i*36, H*.92, 2.1, t, {phase:i, dir:1}));
  }
  const v = ctx.createRadialGradient(W/2, H*.55, H*.3, W/2, H*.55, W*.72); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.8)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
}

/* ============ Chapters 6 and 7: the Fete, the Tyrant, the sky over the city, the Lakefront, the hill, the road ============ */
const FETE_SCENES = ['fete_street','fete_hall','fete_garden','garden_storm','dragon_sky','alley_night','lakefront_dawn','quorl_hill','road_east','ship'];
const LANT = ['#d8503a','#e8a040','#4aa870','#4a7ad8'];
/* the garden and its house are lit by dawn once the night is over */
function feteDawn(){ return !!S && (S.chapter >= 7 || !!(S.f && S.f.c6_done) || /^c6_(dawn|close)/.test(S.node || '')); }
function vign(ctx, W, H, a, cy = .55){ const v = ctx.createRadialGradient(W/2, H*cy, H*.3, W/2, H*cy, W*.72); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,`rgba(0,0,0,${a})`); ctx.fillStyle = v; ctx.fillRect(0,0,W,H); }
function vgrad(ctx, y0, y1, stops){ const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([k,c]) => g.addColorStop(k, c)); return g; }
/* Moon's Spawn: a black mountain of basalt hanging over everything, its underside lit faintly by whatever is below */
function drawSpawn(ctx, mx, my, s, t, under = '#2a2a3a'){ my += Math.sin(t/4000)*2*s; glow(ctx, mx, my + 6*s, 80*s, under, .45);
  const pts = [[-54,6],[-46,-6],[-38,-10],[-32,-22],[-20,-20],[-12,-31],[2,-27],[12,-35],[22,-22],[34,-21],[46,-8],[54,4],[42,14],[26,17],[12,26],[-4,22],[-18,25],[-34,17]].map(([x,y]) => [mx + x*s, my + y*s]); poly(ctx, pts, '#07070b');
  poly(ctx, [[mx - 32*s, my - 22*s],[mx - 20*s, my - 20*s],[mx - 12*s, my - 31*s],[mx - 6*s, my - 18*s],[mx - 26*s, my - 12*s]], '#0c0c12'); poly(ctx, [[mx + 12*s, my - 35*s],[mx + 22*s, my - 22*s],[mx + 34*s, my - 21*s],[mx + 20*s, my - 12*s]], '#0b0b11'); // crags catching a little light
  ctx.strokeStyle = rgba(under, .4); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx - 54*s, my + 6*s); ctx.lineTo(mx - 34*s, my + 17*s); ctx.lineTo(mx - 18*s, my + 25*s); ctx.lineTo(mx - 4*s, my + 22*s); ctx.lineTo(mx + 12*s, my + 26*s); ctx.lineTo(mx + 26*s, my + 17*s); ctx.lineTo(mx + 54*s, my + 4*s); ctx.stroke();
  [[-26,19,7],[-8,23,9],[16,24,6]].forEach(([x,y,h]) => poly(ctx, [[mx + (x - 3)*s, my + y*s],[mx + x*s, my + (y + h)*s],[mx + (x + 3)*s, my + y*s]], '#07070b')); // a few spires hanging from the underside
  for (let i=0;i<7;i++){ const p = (Math.sin(t/900 + i*1.9) + 1)/2; ctx.fillStyle = `rgba(200,180,120,${.08 + p*.18})`; ctx.fillRect(mx + (-36 + hash(i,10)*72)*s, my + (-18 + hash(i,11)*34)*s, 1.5, 1.5); } }
/* a soft cloud: overlapping glows, squashed */
function cloud(ctx, x, y, w, h, col, a){ ctx.save(); ctx.translate(x, y); ctx.scale(1, h/w*2.4); for (let i=0;i<7;i++) glow(ctx, (hash(i, Math.round(x))-.5)*w*.8, (hash(i, Math.round(y))-.5)*w*.1, w*(.16 + hash(i,3)*.14), col, a); ctx.restore(); }
/* Darujhistan's roofline: domes, towers, gables; windows lit warm or blue */
function skyline(ctx, W, base, h, col, win, seed = 1, x0 = -10, x1 = W + 10, ws = 1){
  let x = x0, i = 0; while (x < x1) { const w = (16 + hash(i, seed)*30)*ws, hh = h*(.35 + hash(i, seed + 1)*.65), k = Math.floor(hash(i, seed + 2)*4); ctx.fillStyle = col;
    if (k === 0) ctx.fillRect(x, base - hh, w, hh);
    else if (k === 1) poly(ctx, [[x, base],[x, base - hh],[x + w*.5, base - hh - w*.4],[x + w, base - hh],[x + w, base]], col);
    else if (k === 2) { ctx.fillRect(x, base - hh, w, hh); ctx.beginPath(); ctx.arc(x + w*.5, base - hh, w*.42, Math.PI, 0); ctx.fill(); ctx.fillRect(x + w*.5 - .7, base - hh - w*.42 - 6, 1.4, 6); }
    else { const tw = w*.4; ctx.fillRect(x + w*.3, base - hh*1.5, tw, hh*1.5); poly(ctx, [[x + w*.3 - 1, base - hh*1.5],[x + w*.3 + tw*.5, base - hh*1.5 - tw*1.6],[x + w*.3 + tw + 1, base - hh*1.5]], col); ctx.fillRect(x, base - hh*.6, w, hh*.6); }
    if (win) for (let j=0;j<4;j++) if (hash(i, j + seed*7) > .55) { ctx.fillStyle = typeof win === 'function' ? win(x/W, j) : win; ctx.fillRect(x + 3 + hash(j, i + seed)*(w - 6), base - hh*(.2 + hash(i, j + 3)*.6), 1.6, 2); }
    x += w - 1; i++; } }
/* a string of Fete lanterns between two points, sagging, swaying; dead ones hang dark and torn */
function lanternLine(ctx, x0, y0, x1, y1, sag, n, t, s = 1, seed = 0, dead = false){
  ctx.strokeStyle = dead ? 'rgba(60,70,80,.7)' : 'rgba(120,100,70,.7)'; ctx.lineWidth = Math.max(.6, s*.8); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1)/2, (y0 + y1)/2 + sag*2, x1, y1); ctx.stroke();
  for (let i=0;i<n;i++){ const k = (i + .5)/n, bx = (1-k)*(1-k)*x0 + 2*k*(1-k)*(x0 + x1)/2 + k*k*x1, by = (1-k)*(1-k)*y0 + 2*k*(1-k)*((y0 + y1)/2 + sag*2) + k*k*y1, c = LANT[(i + seed) % 4], sw = Math.sin(t/800 + i*1.3 + seed)*.2, fl = .85 + Math.sin(t/170 + i*2.3 + seed)*.1;
    ctx.save(); ctx.translate(bx, by); ctx.rotate(sw); ctx.strokeStyle = 'rgba(30,24,18,.8)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 3*s); ctx.stroke();
    if (dead) { poly(ctx, [[-2.4*s, 3*s],[2*s, 2.6*s],[2.8*s, 8*s],[-1*s, 9.6*s]], shade(c, -.6)); ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.moveTo(0, 9*s); ctx.lineTo(hash(i, seed)*3*s - 1.5*s, 12*s); ctx.stroke(); }
    else { glow(ctx, 0, 6*s, 12*s, c, .3*fl); ell(ctx, 0, 6.5*s, 3*s, 4*s, c); ell(ctx, -.6*s, 6*s, 1.4*s, 2.6*s, `rgba(255,236,190,${.6*fl})`); ctx.fillStyle = 'rgba(30,20,12,.85)'; ctx.fillRect(-1.8*s, 2.4*s, 3.6*s, .9*s); ctx.fillRect(-1.8*s, 10.2*s, 3.6*s, .9*s); }
    ctx.restore(); } }
function confetti(ctx, W, H, t, n, a = .7){ for (let i=0;i<n;i++){ const y = ((hash(i,61)*H) + t*(.012 + hash(i,62)*.02)) % (H + 10) - 5, x = hash(i,63)*W + Math.sin(t/1300 + i)*10, r = t/400 + i; ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(1, Math.abs(Math.sin(r*1.4)) + .15); ctx.fillStyle = rgba(['#d8503a','#e8a040','#4aa870','#4a7ad8','#e8d8c0','#c05a8a'][i % 6], a); ctx.fillRect(-2, -1.2, 4, 2.4); ctx.restore(); } }
function gulls(ctx, W, H, t, n, top = .1, spread = .3, col = 'rgba(225,220,210,.75)'){ for (let i=0;i<n;i++){ const k = ((t/(22000 + i*4000) + hash(i,71)) % 1), gx = (1.1 - k*1.25)*W, gy = (top + hash(i,72)*spread)*H + Math.sin(t/900 + i)*5, w = 5 + hash(i,73)*5, f = Math.sin(t/170 + i*2)*w*.4;
  ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(gx - w, gy - f); ctx.quadraticCurveTo(gx - w*.4, gy - w*.45, gx, gy); ctx.quadraticCurveTo(gx + w*.4, gy - w*.45, gx + w, gy - f); ctx.stroke(); } }
/* a great dragon in flight, drawn facing +x: body, neck, head, tail, two wings of finger-bones and skin */
function drawDragon(ctx, x, y, s, ang, flap, body, rim, wrong, t){
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); if (Math.cos(ang) < 0) ctx.scale(1, -1);
  const wing = (dx, dy, f, col) => { const tip = -58*f; poly(ctx, [[4 + dx, -3 + dy],[10 + dx, -5 + dy],[-4 + dx, tip + dy],[-10 + dx, tip*.62 + dy],[-24 + dx, tip*.9 + dy],[-26 + dx, tip*.5 + dy],[-42 + dx, tip*.66 + dy],[-34 + dx, tip*.2 + dy],[-16 + dx, -1 + dy]], col);
    ctx.strokeStyle = rgba(rim, .5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(10 + dx, -5 + dy); ctx.lineTo(-4 + dx, tip + dy); ctx.moveTo(4 + dx, -3 + dy); ctx.lineTo(-24 + dx, tip*.9 + dy); ctx.moveTo(2 + dx, -3 + dy); ctx.lineTo(-42 + dx, tip*.66 + dy); ctx.stroke(); };
  flap = .3 + flap*.7; wing(-4, -2, flap*.9, shade(body, -.35));
  ctx.strokeStyle = body; ctx.lineCap = 'round'; for (let i=0;i<6;i++){ ctx.lineWidth = 7 - i; ctx.beginPath(); ctx.moveTo(-18 - i*10, Math.sin(t/500 - i*.7)*i*1.4); ctx.lineTo(-28 - i*10, Math.sin(t/500 - (i+1)*.7)*(i+1)*1.4); ctx.stroke(); } // tail
  ell(ctx, 0, 0, 22, 7.5, body); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(16, -2); ctx.quadraticCurveTo(30, -12, 40, -10); ctx.stroke(); ctx.lineCap = 'butt';
  poly(ctx, [[38,-14],[50,-12],[55,-9],[50,-7],[40,-6]], body); poly(ctx, [[40,-13],[34,-22],[43,-14]], body); poly(ctx, [[44,-13],[42,-21],[47,-13]], body); // head and horns
  ctx.fillStyle = rim; ctx.fillRect(46, -11.5, 2.4, 1.2);
  if (wrong) { for (let i=0;i<6;i++) poly(ctx, [[-14 + i*6, -6],[-12 + i*6, -14 - hash(i,3)*6],[-9 + i*6, -6]], body); ctx.strokeStyle = shade(body, -.2); ctx.lineWidth = 2; for (let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-6 + i*8, 6); ctx.lineTo(-10 + i*8 + Math.sin(t/200 + i)*3, 16); ctx.stroke(); } } // spines; too many legs
  wing(0, 0, flap, body); ctx.strokeStyle = rgba(rim.startsWith('#') ? rim : '#ffffff', .3); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 22, 7.5, 0, Math.PI*1.1, Math.PI*1.9); ctx.stroke();
  ctx.restore(); }

function drawEstate(cv, kind, t){
  const {ctx, W, H} = sceneFit(cv), fl = .85 + Math.sin(t/140)*.06 + Math.sin(t/53)*.04, squad = (typeof SQUAD === 'function' && S ? SQUAD() : PORDER);
  ctx.fillStyle = '#060505'; ctx.fillRect(0,0,W,H);
  if (kind === 'fete_street') {
    // dusk over a street strung with lanterns; the lake at the end of it, and the black mountain over the lake
    ctx.fillStyle = vgrad(ctx, 0, H*.56, [[0,'#120c1c'],[.5,'#3a1a2c'],[.85,'#8a4030'],[1,'#c0703a']]); ctx.fillRect(0,0,W,H*.56);
    ctx.fillStyle = 'rgba(230,220,240,.5)'; for (let i=0;i<24;i++) ctx.fillRect(hash(i,41)*W, hash(i,42)*H*.22, 1, 1);
    const vx = W*.56, vy = H*.5; ctx.fillStyle = '#2a1e2c'; ctx.fillRect(W*.4, H*.44, W*.32, H*.1); for (let i=0;i<14;i++){ ctx.fillStyle = `rgba(255,170,100,${.12 + hash(i,5)*.2})`; ctx.fillRect(W*.42 + hash(i,6)*W*.28, H*.45 + hash(i,7)*H*.07, 4 + hash(i,8)*10, 1); }
    skyline(ctx, W, H*.46, H*.08, '#1a1220', 'rgba(232,192,115,.5)', 3, W*.36, W*.76);
    drawSpawn(ctx, W*.62, H*.19, 1.05, t, '#5a2a3a');
    const wallL = k => ({top: lerp(-H*.05, H*.3, k), bot: lerp(H*.98, H*.56, k), x: lerp(-W*.02, vx - W*.13, k)}), wallR = k => ({top: lerp(-H*.05, H*.3, k), bot: lerp(H*.98, H*.56, k), x: lerp(W*1.02, vx + W*.13, k)});
    const segs = [0,.3,.52,.67,.78,.86,.92,.96,1];
    [wallL, wallR].forEach((wf, side) => { for (let i=0;i<segs.length-1;i++){ const a = wf(segs[i]), b = wf(segs[i+1]), lift = (hash(i, side + 3) - .3)*H*.12*(1 - segs[i]), c = ['#2a1c1e','#221a22','#302024','#1e181e'][(i + side) % 4];
      poly(ctx, [[a.x, a.bot],[a.x, a.top - lift],[b.x, b.top - lift*.8],[b.x, b.bot]], c); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(b.x, b.top - lift*.8); ctx.lineTo(b.x, b.bot); ctx.stroke();
      for (let r=0;r<3;r++) for (let q=0;q<2;q++){ const k = (q + .5)/2, wx = lerp(a.x, b.x, k), wt = lerp(a.top - lift, b.top - lift*.8, k), wb = lerp(a.bot, b.bot, k), wy = lerp(wt, wb, .18 + r*.22), ww = Math.abs(b.x - a.x)*.2, wh = (wb - wt)*.1;
        const lit = hash(i*7 + r, q + side*3) > .35; ctx.fillStyle = lit ? `rgba(255,${180 + Math.round(hash(r,q)*40)},110,${.5 + Math.sin(t/900 + i + r)*.08})` : 'rgba(8,6,8,.8)'; ctx.fillRect(wx - ww/2, wy, ww, wh); if (lit) glow(ctx, wx, wy + wh/2, ww*1.6, '#ffb060', .08); } } });
    // the street, cobbles running to the end of it
    poly(ctx, [[0, H],[-W*.02, H*.98],[vx - W*.13, H*.56],[vx + W*.13, H*.56],[W*1.02, H*.98],[W, H]], '#241e22'); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1;
    for (let i=0;i<14;i++){ const k = Math.pow(i/14, 1.8), yy = lerp(H*.56, H, k); ctx.beginPath(); ctx.moveTo(lerp(vx - W*.13, -W*.02, k), yy); ctx.lineTo(lerp(vx + W*.13, W*1.02, k), yy); ctx.stroke(); }
    for (let i=-6;i<=6;i++){ ctx.beginPath(); ctx.moveTo(vx + i*W*.02, H*.56); ctx.lineTo(vx + i*W*.16, H); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,170,100,.06)'; ctx.fillRect(0, H*.6, W, H*.4);
    // blue lamps along both sides
    [.12,.45,.7].forEach((k, i) => [wallL, wallR].forEach((wf, side) => { const a = wf(k), sc = lerp(1.6, .5, k), lx = a.x + (side ? -1 : 1)*18*sc, ly = a.bot - 2*sc;
      ctx.fillStyle = '#141418'; ctx.fillRect(lx - 1.2*sc, ly - 44*sc, 2.4*sc, 44*sc); ctx.fillStyle = '#26262c'; ctx.fillRect(lx - 4*sc, ly - 52*sc, 8*sc, 8*sc); ctx.fillStyle = `rgba(160,210,255,${.7 + Math.sin(t/230 + i + side)*.2})`; ctx.fillRect(lx - 2.5*sc, ly - 50*sc, 5*sc, 5*sc); glow(ctx, lx, ly - 47*sc, 46*sc, '#6aa8ff', .3*fl); ell(ctx, lx, ly + 2, 26*sc, 5*sc, 'rgba(90,140,210,.08)'); }));
    // lantern strings across the street
    [.08,.3,.5,.66,.8].forEach((k, i) => { const a = wallL(k), b = wallR(k), y = lerp(a.top, a.bot, .3); lanternLine(ctx, a.x, y, b.x, y, lerp(22, 5, k), Math.round(lerp(14, 6, k)), t, lerp(2.2, .7, k), i); });
    // masked revellers, far and near
    [[.12,5],[.3,4],[.55,4],[.8,3]].forEach(([d, n], j) => { const yy = lerp(H*.58, H*.96, d), sc = lerp(.7, 2.3, d), half = lerp(W*.13, W*.5, d);
      for (let i=0;i<n;i++){ const k = ((hash(i, j + 20) + t/(40000 - d*20000)*(i%2 ? 1 : -1)) % 1 + 1) % 1, xx = vx - half*.9 + k*half*1.8; if (d > .7 && xx < W*.34) continue; drawFigure(ctx, 'reveller', xx, yy, sc, t, {phase:i*3 + j*7 + 1, dir: i%2 ? 1 : -1}); } });
    marchOrder(squad).forEach((id, i) => drawFigure(ctx, id, W*.06 + i*30, H*.95, 2.1, t, {phase:i, dir:1}));
    confetti(ctx, W, H, t, 26, .55);
    vign(ctx, W, H, .75);
  } else if (kind === 'fete_hall') {
    // the hall: dark red walls, gilt, tall windows full of night, chandeliers, masked dancers turning, a very tall guest by a pillar
    ctx.fillStyle = vgrad(ctx, 0, H, [[0,'#1c0a0c'],[.6,'#2a1012'],[1,'#120708']]); ctx.fillRect(0,0,W,H);
    for (let i=0;i<5;i++){ const x = W*.08 + i*W*.21; ctx.fillStyle = '#0a1224'; ctx.fillRect(x, H*.1, W*.08, H*.42); ctx.beginPath(); ctx.arc(x + W*.04, H*.1, W*.04, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(160,190,240,.05)'; ctx.fillRect(x + 3, H*.12, W*.035, H*.38); ctx.strokeStyle = '#6a4a22'; ctx.lineWidth = 1.5; ctx.strokeRect(x, H*.1, W*.08, H*.42); ctx.beginPath(); ctx.moveTo(x + W*.04, H*.06); ctx.lineTo(x + W*.04, H*.52); ctx.moveTo(x, H*.3); ctx.lineTo(x + W*.08, H*.3); ctx.stroke();
      ctx.fillStyle = 'rgba(220,220,240,.5)'; for (let j=0;j<3;j++) ctx.fillRect(x + hash(i,j)*W*.07, H*.12 + hash(j,i)*H*.3, 1, 1); }
    ctx.fillStyle = '#c9a44a'; ctx.fillRect(0, H*.56, W, 2); ctx.fillStyle = 'rgba(201,164,74,.3)'; ctx.fillRect(0, H*.06, W, 1.5);
    // the floor: dark polished stone, everything reflected in it
    ctx.fillStyle = vgrad(ctx, H*.58, H, [[0,'#1a1214'],[1,'#0a0707']]); ctx.fillRect(0, H*.58, W, H*.42); ctx.strokeStyle = 'rgba(201,164,74,.12)'; ctx.lineWidth = 1; for (let i=-8;i<=8;i++){ ctx.beginPath(); ctx.moveTo(W*.5 + i*W*.06, H*.58); ctx.lineTo(W*.5 + i*W*.2, H); ctx.stroke(); } for (let i=0;i<5;i++){ const yy = H*.58 + Math.pow(i/5, 1.6)*H*.42; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
    // chandeliers, swaying a little
    [[W*.28, H*.2],[W*.72, H*.18]].forEach(([cx, cy], j) => { const sw = Math.sin(t/1600 + j)*3; ctx.strokeStyle = '#3a2a14'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx + sw, cy - 8); ctx.stroke(); glow(ctx, cx + sw, cy, W*.2, '#ffc070', .28*fl);
      ctx.strokeStyle = '#8a6a2a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx + sw, cy, 30, 7, 0, 0, Math.PI); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx + sw, cy - 8, 16, 4, 0, 0, Math.PI); ctx.stroke();
      for (let i=0;i<9;i++){ const a = i/8*Math.PI, x = cx + sw + Math.cos(a)*30, y = cy + Math.sin(a)*7; ctx.fillStyle = '#e8e0c8'; ctx.fillRect(x - 1, y - 5, 2, 5); ell(ctx, x, y - 7, 1.4, 2.6 + Math.sin(t/90 + i)*.6, '#ffe0a0'); }
      for (let i=0;i<6;i++) ell(ctx, cx + sw + (i - 2.5)*9, cy + 10 + (i%2)*4, 1.5, 3, `rgba(220,230,255,${.3 + Math.sin(t/300 + i)*.2})`); ell(ctx, cx + sw, H*.9, 50, 6, 'rgba(255,190,110,.08)'); });
    // pillars
    [.14,.42,.86].forEach((k, i) => { const x = W*k, g = ctx.createLinearGradient(x - 12, 0, x + 12, 0); g.addColorStop(0,'#6a6258'); g.addColorStop(.4,'#4a4440'); g.addColorStop(1,'#16120f'); ctx.fillStyle = g; ctx.fillRect(x - 11, H*.04, 22, H*.72); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(x - 15, H*.04, 30, 7); ctx.fillRect(x - 14, H*.74, 28, 7); ctx.fillStyle = 'rgba(0,0,0,.2)'; for (let j=1;j<4;j++) ctx.fillRect(x - 11 + j*5.5, H*.08, 1, H*.66);
      ctx.fillStyle = 'rgba(106,98,88,.12)'; ctx.fillRect(x - 11, H*.81, 22, H*.16); });
    // the tall guest in the black dragon mask, by the second pillar; Kruppe at a table, eating
    glow(ctx, W*.46, H*.62, 40, '#9a86e0', .06 + Math.sin(t/900)*.03); drawFigure(ctx, 'rakemask', W*.47, H*.8, 2.6, t, {still:true, dir:-1});
    ctx.fillStyle = '#d8d4c8'; ctx.fillRect(W*.74, H*.7, W*.16, H*.05); ctx.fillStyle = '#b8b2a4'; ctx.fillRect(W*.74, H*.75, W*.16, H*.07); ell(ctx, W*.78, H*.7, 7, 2, '#c9a44a'); ell(ctx, W*.85, H*.705, 6, 2, '#e8e2d4'); ctx.fillStyle = '#4a1a24'; ctx.fillRect(W*.88, H*.64, 4, 9); ell(ctx, W*.815, H*.66, 1.4, 3, '#ffe0a0'); glow(ctx, W*.815, H*.66, 20, '#ffc070', .3*fl);
    drawFigure(ctx, 'kruppe', W*.8, H*.86, 2.3, t, {still:true, dir:-1});
    // masked dancers, turning in pairs
    for (let p=0;p<4;p++){ const cx = W*(.22 + p*.17), cy = H*(.86 + (p%2)*.06), a = t/1400 + p*1.7; [0, Math.PI].forEach((o, j) => { const x = cx + Math.cos(a + o)*12, depth = Math.sin(a + o); drawFigure(ctx, 'reveller', x, cy + depth*3, 2 + depth*.1, t, {phase:p*2 + j + 2, dir: Math.cos(a + o + Math.PI/2) > 0 ? 1 : -1}); }); }
    marchOrder(squad.slice(0, 3)).forEach((id, i) => drawFigure(ctx, id, 22 + i*Math.min(24, W*.07), H*.99, 2.1, t, {phase:i, dir:1}));
    vign(ctx, W, H, .8);
  } else if (kind === 'fete_garden') {
    const dawn = feteDawn(), az = !!(S && S.f && S.f.c6_azath), vx = W*.5, vy = H*.5;
    ctx.fillStyle = dawn ? vgrad(ctx, 0, vy, [[0,'#2a2c3a'],[.55,'#6a5058'],[1,'#c89070']]) : vgrad(ctx, 0, vy, [[0,'#03050c'],[1,'#121c30']]); ctx.fillRect(0,0,W,vy + 2);
    if (!dawn) { ctx.fillStyle = 'rgba(220,225,245,.55)'; for (let i=0;i<40;i++) ctx.fillRect(hash(i,41)*W, hash(i,42)*H*.4, 1, 1); drawSpawn(ctx, W*.8, H*.15, .62, t); }
    else { if (!(S && S.chapter >= 7)) drawSpawn(ctx, W*.1, H*.3, .42, t, '#6a4a5a'); glow(ctx, W*.95, vy, W*.45, '#ffb080', .28); cloud(ctx, W*.6, H*.16, W*.3, 8, '#f0c8b8', .14); } // Moon's Spawn going west; by Chapter 7 the sky is empty
    // the house: a pediment, columns, tall lit windows, a terrace
    const hw = W*.38, ht = H*.12; ctx.fillStyle = dawn ? '#2e2a34' : '#0d0d16'; ctx.fillRect(0, ht, hw, vy - ht); poly(ctx, [[-6, ht],[hw*.5, ht - H*.1],[hw + 6, ht]], dawn ? '#26222c' : '#0a0a12'); ctx.strokeStyle = dawn ? 'rgba(200,190,180,.25)' : 'rgba(120,120,150,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-6, ht); ctx.lineTo(hw*.5, ht - H*.1); ctx.lineTo(hw + 6, ht); ctx.stroke();
    for (let i=0;i<6;i++){ const x = W*.02 + i*hw/6.2, lit = !dawn || i === 2; ctx.fillStyle = dawn ? (lit ? 'rgba(255,210,150,.35)' : 'rgba(40,40,50,.8)') : `rgba(255,${176 + (i%3)*10},100,${.6 + Math.sin(t/800 + i)*.05})`; ctx.fillRect(x, ht + H*.06, W*.03, H*.13); ctx.fillRect(x, ht + H*.23, W*.03, H*.1);
      ctx.fillStyle = dawn ? '#1e1a22' : '#1a120a'; ctx.fillRect(x + W*.014, ht + H*.06, 1.2, H*.27); ctx.fillRect(x, ht + H*.12, W*.03, 1.2); if (!dawn) glow(ctx, x + W*.015, ht + H*.14, 26, '#ffb060', .14);
      ctx.fillStyle = dawn ? '#4a4650' : '#1c1c26'; ctx.fillRect(x - 5, ht + H*.02, 3, vy - ht - H*.02); }
    ctx.fillStyle = dawn ? '#7a766e' : '#34363e'; ctx.fillRect(0, vy - H*.05, hw + 10, 3); for (let i=0;i<22;i++) ctx.fillRect(i*(hw + 10)/22 + 1, vy - H*.05, 2.4, H*.05);
    // the lawn: mower stripes running to the fountain, a gravel walk, box hedges, topiary
    ctx.fillStyle = dawn ? vgrad(ctx, vy, H, [[0,'#34402c'],[1,'#161e12']]) : vgrad(ctx, vy, H, [[0,'#0e1c15'],[1,'#050b08']]); ctx.fillRect(0, vy, W, H - vy);
    for (let i=-9;i<=9;i+=2) poly(ctx, [[vx + i*W*.02, vy],[vx + (i+1)*W*.02, vy],[vx + (i+1)*W*.2, H],[vx + i*W*.2, H]], dawn ? 'rgba(200,220,170,.05)' : 'rgba(90,140,100,.05)');
    poly(ctx, [[vx - W*.03, vy],[vx + W*.03, vy],[vx + W*.14, H],[vx - W*.14, H]], dawn ? 'rgba(170,160,140,.28)' : 'rgba(110,110,105,.16)');
    [[-1],[1]].forEach(([sd]) => { for (let d=0;d<4;d++){ const k0 = .12 + d*.22, k1 = k0 + .14, y0 = lerp(vy, H, k0), y1 = lerp(vy, H, k1), x0 = vx + sd*lerp(W*.05, W*.2, k0), x1 = vx + sd*lerp(W*.05, W*.2, k1), w0 = lerp(10, 70, k0), w1 = lerp(10, 70, k1), hh = lerp(3, 14, k1);
      poly(ctx, [[x0, y0],[x0 + sd*w0, y0],[x1 + sd*w1, y1],[x1, y1]], dawn ? '#1e2c1a' : '#07120b'); poly(ctx, [[x0, y0 - hh*.6],[x0 + sd*w0, y0 - hh*.6],[x0 + sd*w0, y0],[x0, y0]], dawn ? '#2a3a24' : '#0c1c12'); ctx.fillStyle = dawn ? 'rgba(200,210,170,.25)' : 'rgba(140,170,90,.22)'; ctx.fillRect(Math.min(x0, x0 + sd*w0), y0 - hh*.6, w0, 1.2);
      if (d%2 === 0) { const tx = x1 + sd*w1*.5, ty = y1 - 1, th = lerp(10, 40, k1); poly(ctx, [[tx - th*.28, ty],[tx, ty - th],[tx + th*.28, ty]], dawn ? '#223020' : '#081410'); poly(ctx, [[tx, ty - th],[tx + th*.28, ty],[tx + th*.08, ty]], 'rgba(0,0,0,.3)'); } } });
    // trees with lanterns in them, and pools of lantern-light under them
    [[W*.43, vy + 2, .9],[W*.64, vy, .75],[W*.97, vy + 6, 1.25]].forEach(([x, y, sc], j) => { if (!dawn) ell(ctx, x, y + 14*sc, 50*sc, 8*sc, 'rgba(255,190,110,.07)'); ctx.fillStyle = dawn ? '#1e2218' : '#050a07'; ctx.fillRect(x - 3*sc, y - 30*sc, 6*sc, 32*sc);
      for (let i=0;i<11;i++) ell(ctx, x + (hash(i,j)-.5)*62*sc, y - 40*sc + (hash(j,i)-.5)*30*sc, 18*sc, 13*sc, dawn ? (i%2 ? '#232b1e' : '#1a2218') : (i%2 ? '#08140c' : '#0b1a10'));
      lanternLine(ctx, x - 28*sc, y - 40*sc, x + 28*sc, y - 36*sc, 6*sc, 5, t, 1.2*sc, j*3, dawn); lanternLine(ctx, x - 20*sc, y - 26*sc, x + 22*sc, y - 24*sc, 4*sc, 4, t, 1.1*sc, j*3 + 2, dawn); });
    if (!dawn) { [[.3,.6,.9],[.4,.66,1.1]].forEach(([k, yk, sc], i) => drawFigure(ctx, 'reveller', W*k + Math.sin(t/3000 + i)*14, H*yk, sc, t, {phase:i*5 + 3, dir:i ? -1 : 1})); } // guests, strolling
    // the fountain
    const fx = vx, fy = H*.72; ell(ctx, fx, fy + 6, 52, 11, 'rgba(0,0,0,.45)'); ell(ctx, fx, fy, 48, 11, dawn ? '#8a8680' : '#4a4c52'); ell(ctx, fx, fy - 1, 42, 8, dawn ? '#5a6a74' : '#0c1c28'); ctx.fillStyle = dawn ? '#8a8680' : '#4a4c52'; ctx.fillRect(fx - 4, fy - 32, 8, 31); ell(ctx, fx, fy - 30, 14, 4, dawn ? '#9a9690' : '#5a5c62');
    if (!dawn) glow(ctx, fx, fy - 10, 60, '#6aa8d8', .07);
    for (let i=0;i<14;i++){ const k = ((t/900 + i/14) % 1), side = i%2 ? 1 : -1; ctx.fillStyle = `rgba(200,225,245,${(1-k)*.55})`; ctx.fillRect(fx + side*(4 + k*16), fy - 32 + Math.pow(k*2 - .7, 2)*16 - 4, 1.5, 1.5); }
    for (let i=0;i<3;i++){ const k = ((t/1600 + i/3) % 1); ctx.strokeStyle = `rgba(170,210,240,${(1-k)*.3})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(fx, fy - 1, 8 + k*32, 2 + k*6, 0, 0, 7); ctx.stroke(); }
    // the sapling in turned earth, or the house that grew there overnight, with its yard of mounds
    const ax = W*.8, ay = H*.8, p = (Math.sin(t/1300) + 1)/2;
    if (az) { ctx.lineCap = 'round'; for (let i=0;i<11;i++){ const a = i/10*Math.PI*1.1 - .05, ex = ax + Math.cos(a)*(78 + hash(i,4)*26), ey = ay + 6 + Math.sin(i*1.7)*8; ctx.strokeStyle = '#1c130c'; for (let q=0;q<3;q++){ ctx.lineWidth = 5 - q*1.6; ctx.beginPath(); ctx.moveTo(ax + Math.cos(a)*26, ay); ctx.quadraticCurveTo(ax + Math.cos(a)*54, ay + 8, lerp(ax + Math.cos(a)*54, ex, .4 + q*.3), lerp(ay + 8, ey, .4 + q*.3)); ctx.stroke(); } } ctx.lineCap = 'butt';
      [[-86,10,0],[-58,22,0],[62,20,0],[92,8,0],[-20,28,0],[28,30,1]].forEach(([dx,dy,fresh]) => { const mx = ax + dx, my = ay + dy; ell(ctx, mx, my + 2, 18, 5, 'rgba(0,0,0,.35)'); ell(ctx, mx, my, 16, 6, fresh ? '#3a2616' : (dawn ? '#2a3422' : '#0c180f')); ell(ctx, mx - 3, my - 2, 10, 3, fresh ? '#4a3220' : (dawn ? '#3a4a2e' : '#12221a'));
        if (fresh) { ctx.fillStyle = 'rgba(110,76,50,.9)'; for (let i=0;i<7;i++) ctx.fillRect(mx - 13 + hash(i,9)*26, my - 3 + hash(i,8)*6, 2.2, 1.6); } else { ctx.strokeStyle = dawn ? 'rgba(150,170,110,.5)' : 'rgba(60,100,60,.5)'; ctx.lineWidth = 1; for (let i=0;i<5;i++){ ctx.beginPath(); ctx.moveTo(mx - 10 + i*5, my - 3); ctx.lineTo(mx - 11 + i*5, my - 7); ctx.stroke(); } } }); // the yard of mounds; one is fresh
      ell(ctx, ax, ay + 4, 50, 8, 'rgba(0,0,0,.5)');
      const wg = ctx.createLinearGradient(ax - 40, 0, ax + 40, 0); wg.addColorStop(0, dawn ? '#4a3624' : '#2e2016'); wg.addColorStop(1, dawn ? '#241a10' : '#120c08'); poly(ctx, [[ax - 38, ay + 2],[ax - 33, ay - 46],[ax + 30, ay - 54],[ax + 41, ay + 1]], wg); // walls of living wood, leaning
      ctx.strokeStyle = dawn ? 'rgba(130,100,70,.45)' : 'rgba(100,78,54,.4)'; ctx.lineWidth = 1; for (let i=0;i<8;i++){ const bx = ax - 34 + i*9.5; ctx.beginPath(); ctx.moveTo(bx, ay + 1); ctx.bezierCurveTo(bx + 4, ay - 16, bx - 4, ay - 32, bx + 2, ay - 48 - i*.8); ctx.stroke(); } ell(ctx, ax - 18, ay - 18, 3, 4, 'rgba(0,0,0,.4)'); ell(ctx, ax + 22, ay - 30, 2.4, 3, 'rgba(0,0,0,.4)'); // grain, knots
      poly(ctx, [[ax - 50, ay - 40],[ax - 12, ay - 98],[ax + 20, ay - 90],[ax + 50, ay - 48],[ax + 36, ay - 50],[ax + 4, ay - 84],[ax - 36, ay - 38]], dawn ? '#221810' : '#110c08'); poly(ctx, [[ax - 36, ay - 38],[ax + 4, ay - 84],[ax + 36, ay - 50]], dawn ? '#2e2116' : '#1a120c'); // a roof too steep, its ridge twisted
      ctx.strokeStyle = 'rgba(0,0,0,.45)'; for (let i=1;i<6;i++){ ctx.beginPath(); ctx.moveTo(lerp(ax - 50, ax - 12, i/6), lerp(ay - 40, ay - 98, i/6)); ctx.lineTo(lerp(ax - 36, ax + 4, i/6), lerp(ay - 38, ay - 84, i/6)); ctx.stroke(); }
      ctx.strokeStyle = dawn ? '#2a1e14' : '#150f0a'; ctx.lineWidth = 2; [[-12,-98,-26,-116],[20,-90,34,-104],[4,-94,10,-118]].forEach(([a,b,c,d]) => { ctx.beginPath(); ctx.moveTo(ax + a, ay + b); ctx.quadraticCurveTo(ax + (a + c)/2 + 6, ay + (b + d)/2, ax + c, ay + d); ctx.stroke(); ell(ctx, ax + c, ay + d, 3, 2, dawn ? '#3a4a2a' : '#12220f'); }); // it is still growing
      ctx.fillStyle = '#050303'; poly(ctx, [[ax - 8, ay + 1],[ax - 7, ay - 22],[ax + 6, ay - 23],[ax + 8, ay + 1]], '#050303'); ctx.fillStyle = `rgba(180,235,160,${.4 + p*.3})`; ctx.fillRect(ax + 15, ay - 36, 9, 8); ctx.fillStyle = '#120c08'; ctx.fillRect(ax + 19, ay - 36, 1, 8);
      glow(ctx, ax + 19, ay - 32, 30, '#9ad8a0', .16 + p*.12); glow(ctx, ax, ay - 40, 90, '#7ad0a0', .04 + p*.05);
    } else { ell(ctx, ax, ay + 2, 30, 8, '#1e140e'); for (let i=0;i<12;i++) ell(ctx, ax + (hash(i,3)-.5)*50, ay + (hash(3,i)-.5)*9, 3.4, 2, '#2e2016'); glow(ctx, ax, ay - 16, 50, p > .5 ? '#7ad0a0' : '#9a86e0', .1 + p*.1);
      ctx.strokeStyle = '#040304'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.bezierCurveTo(ax - 8, ay - 16, ax + 9, ay - 26, ax - 3, ay - 46); ctx.stroke(); ctx.lineWidth = 2; [[-2,-38,-16,-52],[1,-30,16,-42],[0,-20,-12,-26],[-2,-44,5,-60],[1,-34,10,-30]].forEach(([a,b,c,d]) => { ctx.beginPath(); ctx.moveTo(ax + a, ay + b); ctx.quadraticCurveTo(ax + (a+c)/2, ay + (b+d)/2 - 5, ax + c, ay + d); ctx.stroke(); }); ctx.lineCap = 'butt'; }
    marchOrder(squad).forEach((id, i) => drawFigure(ctx, id, W*.06 + i*30, H*.97, 2.1, t, {phase:i, dir:1}));
    if (!dawn) confetti(ctx, W, H, t, 16, .5); else { ctx.fillStyle = 'rgba(255,190,140,.06)'; ctx.fillRect(0,0,W,H); for (let i=0;i<30;i++){ ctx.fillStyle = `rgba(230,240,255,${.2 + Math.sin(t/400 + i)*.15})`; ctx.fillRect(hash(i,77)*W, vy + hash(i,78)*H*.5, 1, 1); } } // dew
    vign(ctx, W, H, dawn ? .6 : .8);
  } else if (kind === 'garden_storm') {
    // Omtose Phellack: frost going out across the lawn in rings, every lantern dead, a masked thing too tall for the man it was, and the Azath coming up out of the ground
    ctx.fillStyle = vgrad(ctx, 0, H*.5, [[0,'#02040a'],[1,'#0e1a26']]); ctx.fillRect(0,0,W,H*.5); ctx.fillStyle = 'rgba(220,235,255,.5)'; for (let i=0;i<30;i++) ctx.fillRect(hash(i,41)*W, hash(i,42)*H*.4, 1, 1);
    ctx.fillStyle = '#0a0e16'; ctx.fillRect(0, H*.2, W*.3, H*.3); for (let i=0;i<5;i++){ ctx.fillStyle = 'rgba(40,50,70,.8)'; ctx.fillRect(W*.02 + i*W*.055, H*.28, W*.03, H*.1); }
    ctx.fillStyle = vgrad(ctx, H*.5, H, [[0,'#1a2a32'],[1,'#0a1216']]); ctx.fillRect(0, H*.5, W, H*.5);
    const rx = W*.52, ry = H*.72;
    for (let i=0;i<7;i++){ const k = ((t/3600 + i/7) % 1), r = 14 + k*W*.6; ctx.strokeStyle = `rgba(200,235,255,${(1-k)*.55})`; ctx.lineWidth = 1.5 - k; ctx.beginPath(); ctx.ellipse(rx, ry, r, r*.22, 0, 0, 7); ctx.stroke(); } // frost rings
    ctx.fillStyle = 'rgba(220,240,255,.18)'; ell(ctx, rx, ry, W*.3, H*.08, 'rgba(200,230,250,.12)');
    [[W*.1, H*.5, 1],[W*.88, H*.52, 1.1]].forEach(([x, y, s], j) => { ctx.fillStyle = '#070b10'; ctx.fillRect(x - 3*s, y - 30*s, 6*s, 34*s); for (let i=0;i<9;i++) ell(ctx, x + (hash(i,j)-.5)*56*s, y - 40*s + (hash(j,i)-.5)*28*s, 17*s, 12*s, i%2 ? '#0c141a' : '#101a22'); for (let i=0;i<8;i++) ctx.fillRect(x + (hash(i,j+5)-.5)*60*s, y - 36*s + hash(i,j+6)*20*s, 2, 1); lanternLine(ctx, x - 24*s, y - 36*s, x + 24*s, y - 32*s, 6*s, 5, t, 1.1*s, j, true); });
    // cracks in the frost, and the Azath's roots coming up out of them: gnarled, crawling in across the lawn, climbing him
    ctx.strokeStyle = 'rgba(10,16,20,.8)'; ctx.lineWidth = 1.2; for (let i=0;i<12;i++){ const a = i/12*Math.PI*2 + .2; let x = rx, y = ry + 4; ctx.beginPath(); ctx.moveTo(x, y); for (let q=1;q<6;q++){ x = rx + Math.cos(a + (hash(i,q) - .5)*.5)*q*26; y = ry + 4 + Math.sin(a + (hash(q,i) - .5)*.5)*q*6; ctx.lineTo(x, y); } ctx.stroke(); }
    const root = (pts, w) => { for (let q=0;q<pts.length - 1;q++){ ctx.strokeStyle = '#1e140c'; ctx.lineWidth = lerp(w, 1.3, q/(pts.length - 1)); ctx.beginPath(); ctx.moveTo(pts[q][0], pts[q][1]); ctx.lineTo(pts[q+1][0], pts[q+1][1]); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(140,220,160,.14)'; ctx.lineWidth = 1; ctx.beginPath(); pts.forEach(([x,y],q) => q ? ctx.lineTo(x, y - w*.25) : ctx.moveTo(x, y - w*.25)); ctx.stroke(); };
    const grasp = (i, sd, len, climb) => { const g = (Math.sin(t/1600 + i*1.7) + 1)/2, pts = [], bx = rx + sd*len, by = ry + 6 + (hash(i,5) - .3)*10;
      for (let q=0;q<=10;q++){ const k = q/10, x = lerp(bx, rx + sd*(8 - k*4), k) + (hash(i, q) - .5)*8*(1 - k), y = k < .6 ? by + (ry + 4 - by)*k/.6 - Math.sin(k/.6*Math.PI)*4 : ry + 4 - (k - .6)/.4*(climb + g*10); pts.push([x, y + (hash(q, i) - .5)*3]); }
      const [ex, ey] = pts[pts.length - 1]; for (let q=0;q<5;q++){ const a = q*1.4 + i; pts.push([ex + Math.cos(a)*(5 - q), ey - q*2 + Math.sin(a)*2]); } root(pts, 6 - (i%3)); // it curls round him
      ctx.lineWidth = 1; ctx.strokeStyle = '#1e140c'; [.3,.5].forEach(k => { const [x, y] = pts[Math.round(k*10)]; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sd*-6, y - 8, x + sd*-3 + Math.sin(t/500 + i)*2, y - 12); ctx.stroke(); }); }; // rootlets
    ctx.lineCap = 'round'; [[-1,120,40],[1,130,50],[-1,70,30],[1,84,24]].forEach(([sd, len, climb], i) => grasp(i, sd, len, climb)); // behind him
    glow(ctx, rx, ry - 60, 100, '#bfe8ff', .22 + Math.sin(t/300)*.06); drawFigure(ctx, 'raest', rx, ry - 38, 3.1, t, {still:true, dir:-1}); // his feet where the rings begin
    [[-1,100,24],[1,96,16],[-1,150,10],[1,160,30],[-1,54,36]].forEach(([sd, len, climb], i) => grasp(i + 4, sd, len, climb)); // in front, over his feet and up his robe
    ctx.strokeStyle = '#1e140c'; for (let j=0;j<2;j++){ ctx.lineWidth = 4 - j; ctx.beginPath(); ctx.ellipse(rx, ry - 8 - j*16 - Math.sin(t/1600 + j)*3, 24 - j*2, 4, -.08, .15, Math.PI - .15); ctx.stroke(); } ctx.lineCap = 'butt';
    for (let i=0;i<10;i++){ const a = t/900 + i*.63, d = 34 + (i%3)*14; poly(ctx, [[rx + Math.cos(a)*d, ry - 70 + Math.sin(a)*16],[rx + Math.cos(a)*d + 4, ry - 76 + Math.sin(a)*16],[rx + Math.cos(a)*d + 2, ry - 64 + Math.sin(a)*16]], 'rgba(220,245,255,.6)'); } // ice in the air
    // Quick Ben, and seven warrens open at once
    const qx = W*.2, qy = H*.9, cols = ['#e8c073','#9a86e0','#6aa8ff','#e0574a','#7fb394','#f0f0f0','#c05a8a'];
    cols.forEach((c, i) => { const a = t/600 + i*.9; glow(ctx, qx + Math.cos(a)*22, qy - 40 + Math.sin(a*1.3)*16, 26, c, .22); ctx.strokeStyle = rgba(c, .6); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(qx, qy - 30); ctx.quadraticCurveTo(qx + Math.cos(a)*30, qy - 50 + Math.sin(a)*20, qx + Math.cos(a + 1)*40, qy - 70 + Math.sin(a*.7)*20); ctx.stroke(); });
    drawFigure(ctx, 'qb', qx, qy, 2.4, t, {still:true, dir:1});
    squad.forEach((id, i) => drawFigure(ctx, id, W - 22 - (squad.length - 1 - i)*Math.min(26, W*.4/squad.length), H*.99, 2, t, {phase:i, dir:-1}));
    for (let i=0;i<40;i++){ const y = ((hash(i,51)*H) + t*(.01 + hash(i,52)*.015)) % H, x = (hash(i,53)*W + t*.02*(hash(i,54) + .3)) % W; ctx.fillStyle = 'rgba(225,242,255,.6)'; ctx.fillRect(x, y, 1.6, 1.6); }
    ctx.fillStyle = 'rgba(120,170,220,.08)'; ctx.fillRect(0,0,W,H); vign(ctx, W, H, .85);
  } else if (kind === 'dragon_sky') {
    // over the roofs: a black dragon and a pale wrong one, circling and striking; and when the sword comes out, chains of smoke
    ctx.fillStyle = vgrad(ctx, 0, H, [[0,'#02020a'],[.7,'#0e1020'],[1,'#1a1e34']]); ctx.fillRect(0,0,W,H); ctx.fillStyle = 'rgba(220,220,240,.6)'; for (let i=0;i<60;i++) ctx.fillRect(hash(i,41)*W, hash(i,42)*H*.7, 1, 1);
    drawSpawn(ctx, W*.86, H*.52, .75, t);
    const cyc = t % 7000, strike = cyc > 4200 && cyc < 5000, burst = cyc > 4700 ? (cyc - 4700)/2300 : -1;
    const cx = W*.48, cy = H*.34, rad = strike ? lerp(1, .25, Math.sin((cyc - 4200)/800*Math.PI)) : 1;
    const a1 = t/2600, a2 = a1 + Math.PI*.85 + Math.sin(t/1700)*.35;
    const p1 = {x: cx + Math.cos(a1)*W*.26*rad, y: cy + Math.sin(a1)*H*.16*rad}, p2 = {x: cx + Math.cos(a2)*W*.24*rad, y: cy + Math.sin(a2)*H*.13*rad};
    const h1 = Math.atan2(Math.cos(a1)*H*.16, -Math.sin(a1)*W*.26), h2 = Math.atan2(Math.cos(a2)*H*.13, -Math.sin(a2)*W*.24);
    if (strike) { glow(ctx, (p1.x + p2.x)/2, (p1.y + p2.y)/2, 140, '#e8e0ff', .3*Math.sin((cyc - 4200)/800*Math.PI)); }
    if (burst >= 0) glow(ctx, p1.x, p1.y, 190, '#8a7ab8', .5*(1 - burst)); // the sword comes out, and the sky behind it goes pale
    glow(ctx, p2.x, p2.y, 70, '#6a7040', .2); drawDragon(ctx, p2.x, p2.y, 1.3, h2, Math.sin(t/260 + 1), '#b8b09a', '#d8e070', true, t); // the demon: pale, and wrong
    glow(ctx, p1.x, p1.y, 95, '#4a4a80', .38); drawDragon(ctx, p1.x, p1.y, 1.45, h1, Math.sin(t/300), '#08070d', '#b0a0ff', false, t); // Rake
    if (burst >= 0) { const k = ease(Math.min(1, burst*1.6)), fade = 1 - Math.max(0, burst - .5)*2; // Dragnipur drawn: smoke-chains lashing out from the black dragon
      for (let i=0;i<9;i++){ const a = i/9*Math.PI*2 + .2, len = k*(100 + hash(i,5)*80), ex0 = p1.x + Math.cos(a)*len, ey0 = p1.y + Math.sin(a)*len;
        for (let j=0;j<3;j++){ ctx.strokeStyle = `rgba(4,3,8,${(.45 - j*.12)*fade})`; ctx.lineWidth = 10 - j*3; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.quadraticCurveTo(p1.x + Math.cos(a + .4)*len*.55, p1.y + Math.sin(a + .4)*len*.55, ex0 + Math.sin(t/300 + i + j)*4, ey0); ctx.stroke(); }
        for (let q=1;q<11;q++){ const kk = q/11, bx = (1-kk)*(1-kk)*p1.x + 2*kk*(1-kk)*(p1.x + Math.cos(a + .4)*len*.55) + kk*kk*ex0, by = (1-kk)*(1-kk)*p1.y + 2*kk*(1-kk)*(p1.y + Math.sin(a + .4)*len*.55) + kk*kk*ey0;
          ctx.strokeStyle = `rgba(20,16,30,${.9*fade})`; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(bx, by, q%2 ? 2.2 : 4.4, q%2 ? 4.4 : 2.4, a, 0, 7); ctx.stroke(); ctx.strokeStyle = `rgba(190,180,230,${.45*fade})`; ctx.lineWidth = .8; ctx.stroke(); } } }
    // the city under it, blue, with its lamps
    ctx.fillStyle = 'rgba(90,140,210,.12)'; ctx.fillRect(0, H*.7, W, H*.3); glow(ctx, W*.5, H*1.05, W*.6, '#6aa8ff', .2);
    skyline(ctx, W, H*.92, H*.2, '#07080e', (x) => `rgba(${hash(Math.floor(x*40),2) > .5 ? '140,190,255' : '255,200,120'},.6)`, 5);
    ctx.fillStyle = '#040408'; ctx.fillRect(0, H*.9, W, H*.1); poly(ctx, [[0, H],[0, H*.84],[W*.3, H*.86],[W*.34, H]], '#08070a');
    marchOrder(squad).forEach((id, i) => drawFigure(ctx, id, W*.03 + i*18, H*.9, 1.5, t, {phase:i, dir:1, still:true}));
    vign(ctx, W, H, .75, .45);
  } else if (kind === 'alley_night') {
    // a narrow wet alley: high walls close on both sides, a strip of sky, one blue lamp, a doorway, and somebody in it who is only faintly there
    const vx = W*.52, vy = H*.42, ex0 = vx - 20, ex1 = vx + 20, et = vy - 34, eb = vy + 16, lt = W*.2, rt = W*.8;
    ctx.fillStyle = vgrad(ctx, 0, et, [[0,'#0a0e1c'],[1,'#1a2236']]); poly(ctx, [[lt, 0],[rt, 0],[ex1, et],[ex0, et]], ctx.fillStyle); ctx.fillStyle = 'rgba(220,225,245,.55)'; for (let i=0;i<8;i++) ctx.fillRect(lerp(lt, rt, hash(i,4)), hash(i,5)*et*.7, 1, 1);
    ctx.fillStyle = '#1c2230'; ctx.fillRect(ex0, et, ex1 - ex0, eb - et); glow(ctx, vx, eb - 6, 30, '#6aa8ff', .25); ctx.fillStyle = 'rgba(160,190,230,.18)'; ctx.fillRect(ex0, eb - 10, ex1 - ex0, 10); // the far end: a lit street crossing it
    const wall = (sd) => { const xo = sd < 0 ? 0 : W, xt = sd < 0 ? lt : rt, xe = sd < 0 ? ex0 : ex1; poly(ctx, [[xo, 0],[xt, 0],[xe, et],[xe, eb],[xo, H]], sd < 0 ? '#14141c' : '#101016');
      ctx.save(); ctx.beginPath(); ctx.moveTo(xo, 0); ctx.lineTo(xt, 0); ctx.lineTo(xe, et); ctx.lineTo(xe, eb); ctx.lineTo(xo, H); ctx.closePath(); ctx.clip();
      ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 1; for (let i=-4;i<22;i++){ const y = i*H/14; ctx.beginPath(); ctx.moveTo(xo, y); ctx.lineTo(vx, vy); ctx.stroke(); } // brick courses running to the end
      for (let i=0;i<7;i++){ const k = 1 - Math.pow(.72, i + 1), x = lerp(xo, xe, k); ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 2 - k; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      ctx.restore(); };
    wall(-1); wall(1);
    [[.3, .32, -1, 0],[.55, .3, -1, 1],[.35, .22, 1, 0],[.62, .36, 1, 1]].forEach(([k, yk, sd, lit], i) => { const xo = sd < 0 ? 0 : W, xe = sd < 0 ? ex0 : ex1, x0 = lerp(xo, xe, k), x1 = lerp(xo, xe, k + .08), sc0 = 1 - k, sc1 = 1 - k - .08, cy0 = lerp(vy, 0, 1) , wy = yk*H; // shuttered windows, one with a light behind it
      const y = (x, f) => vy + (f*H - vy)*(Math.abs(x - vx)/Math.abs(xo - vx)); poly(ctx, [[x0, y(x0, yk)],[x1, y(x1, yk)],[x1, y(x1, yk + .12)],[x0, y(x0, yk + .12)]], lit ? `rgba(232,170,100,${.35 + Math.sin(t/900 + i)*.05})` : '#07070a'); ctx.strokeStyle = '#1e1a16'; ctx.lineWidth = 1; ctx.stroke(); });
    ctx.strokeStyle = 'rgba(60,50,40,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W*.12, H*.12); ctx.quadraticCurveTo(vx, H*.24, W*.86, H*.1); ctx.stroke(); [[.3,'#5a4a3a'],[.45,'#3a4a5a'],[.62,'#6a5a4a']].forEach(([k, c], i) => { const x = lerp(W*.12, W*.86, k), y = H*.12 + Math.sin(k*Math.PI)*H*.07; poly(ctx, [[x - 6, y],[x + 6, y],[x + 5 + Math.sin(t/900 + i)*1.5, y + 16],[x - 5 + Math.sin(t/900 + i)*1.5, y + 16]], c); }); // washing on a line
    // the ground: wet stone, the lamp in it
    poly(ctx, [[0, H],[ex0, eb],[ex1, eb],[W, H]], '#0e1018'); ctx.strokeStyle = 'rgba(0,0,0,.45)'; for (let i=0;i<9;i++){ const k = Math.pow(i/9, 1.7); ctx.beginPath(); ctx.moveTo(lerp(ex0, 0, k), lerp(eb, H, k)); ctx.lineTo(lerp(ex1, W, k), lerp(eb, H, k)); ctx.stroke(); } for (let i=-4;i<=4;i++){ ctx.beginPath(); ctx.moveTo(vx + i*4, eb); ctx.lineTo(vx + i*W*.14, H); ctx.stroke(); }
    ctx.fillStyle = 'rgba(90,130,200,.08)'; poly(ctx, [[vx - 6, eb],[vx + 6, eb],[vx + 60, H],[vx - 60, H]], ctx.fillStyle); // a rill of water down the middle
    // the lamp, on its bracket on the right wall
    const lx = W*.7, ly = H*.3, lf = .8 + Math.sin(t/230)*.1 + (hash(Math.floor(t/100), 3) > .95 ? -.3 : 0); ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx + 24, ly - 10); ctx.lineTo(lx, ly - 8); ctx.stroke(); ctx.fillStyle = '#26262c'; ctx.fillRect(lx - 6, ly - 8, 12, 14); ctx.fillStyle = `rgba(160,210,255,${lf})`; ctx.fillRect(lx - 4, ly - 5, 8, 9);
    glow(ctx, lx, ly, W*.34, '#6aa8ff', .32*lf); glow(ctx, lx, ly, 26, '#bfe0ff', .45*lf); ell(ctx, lx - 30, H*.86, 80, 12, `rgba(90,140,210,${.14*lf})`); ctx.fillStyle = `rgba(160,210,255,${.3*lf})`; ctx.fillRect(lx - 3, H*.8, 6, H*.16);
    for (let i=0;i<4;i++){ const k = ((t/1800 + i/4) % 1); ctx.strokeStyle = `rgba(160,200,240,${(1-k)*.35})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(W*(.3 + i*.14), H*(.82 + (i%2)*.08), 4 + k*16, 1 + k*3, 0, 0, 7); ctx.stroke(); } // drips into puddles
    // the doorway on the left wall, and the figure in it, half in shadow
    const dx0 = W*.13, dx1 = W*.22, dyb = x => vy + (H*.86 - vy)*((vx - x)/vx), dyt = x => vy + (H*.34 - vy)*((vx - x)/vx);
    poly(ctx, [[dx0, dyb(dx0)],[dx0, dyt(dx0)],[dx1, dyt(dx1)],[dx1, dyb(dx1)]], '#040306'); ctx.strokeStyle = '#2a2420'; ctx.lineWidth = 2; ctx.stroke();
    drawFigure(ctx, 'crimson', (dx0 + dx1)/2, dyb((dx0 + dx1)/2) - 4, 2.2, t, {still:true, dir:1, alpha:.55 + Math.sin(t/1600)*.06});
    const sh = ctx.createLinearGradient(dx0, 0, dx1, 0); sh.addColorStop(0, 'rgba(4,3,6,.92)'); sh.addColorStop(.55, 'rgba(4,3,6,.5)'); sh.addColorStop(1, 'rgba(4,3,6,0)'); ctx.fillStyle = sh; ctx.fillRect(dx0 - 10, dyt(dx0) - 10, dx1 - dx0 + 10, dyb(dx0) - dyt(dx0) + 20); // the shadow takes half of him
    glow(ctx, dx1, dyt(dx1) + 30, 20, '#6aa8ff', .08);
    for (let i=0;i<30;i++){ const x = hash(i,81)*W, y = ((hash(i,82)*H) + t*.25) % H; ctx.strokeStyle = 'rgba(160,190,230,.16)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1, y + 6); ctx.stroke(); } // a fine rain
    marchOrder(squad).forEach((id, i) => drawFigure(ctx, id, W*.36 + i*28, H*.99, 2.1, t, {phase:i, dir:1}));
    vign(ctx, W, H, .85, .5);
  } else if (kind === 'lakefront_dawn') {
    // the docks at dawn: the lake, a ship at the pier, gulls, the city behind; and the sky has nothing in it
    ctx.fillStyle = vgrad(ctx, 0, H*.52, [[0,'#3a4458'],[.55,'#8a8a96'],[.85,'#d8a888'],[1,'#f0c090']]); ctx.fillRect(0,0,W,H*.52);
    glow(ctx, W*.95, H*.5, W*.5, '#ffc090', .3); cloud(ctx, W*.3, H*.13, W*.36, 10, '#e6d2d2', .12); cloud(ctx, W*.72, H*.23, W*.3, 8, '#ffdcc8', .16); // thin cloud; nothing else
    skyline(ctx, W, H*.5, H*.14, '#2e2e3c', (x) => x > .6 ? 'rgba(255,200,140,.5)' : 'rgba(120,170,230,.35)', 9, -10, W*.62);
    ctx.fillStyle = vgrad(ctx, H*.5, H, [[0,'#6a6a78'],[.4,'#3a4050'],[1,'#1c2028']]); ctx.fillRect(0, H*.5, W, H*.5);
    for (let i=0;i<50;i++){ const y = H*.52 + Math.pow(hash(i,21), 1.5)*H*.4, x = (hash(i,22)*W + t*(.004 + hash(i,23)*.006)) % W, w = 6 + (y - H*.5)*.25; ctx.strokeStyle = `rgba(255,${200 + Math.round(hash(i,24)*30)},170,${.12 + Math.sin(t/700 + i)*.08 + (x/W)*.15})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke(); }
    // the pier and the ship at it
    ctx.fillStyle = '#1e1812'; ctx.fillRect(W*.52, H*.66, W*.48, 7); for (let i=0;i<9;i++) ctx.fillRect(W*.54 + i*W*.055, H*.66, 4, H*.12); ctx.fillStyle = 'rgba(255,200,160,.12)'; ctx.fillRect(W*.52, H*.66, W*.48, 1.5);
    const sx = W*.72, sy = H*.64, roll = Math.sin(t/1600)*.015; ctx.save(); ctx.translate(sx, sy); ctx.rotate(roll);
    poly(ctx, [[-90,0],[92,-4],[80,20],[-76,22]], '#1a120c'); poly(ctx, [[-90,0],[92,-4],[90,2],[-88,6]], '#3a2a1a'); ctx.fillStyle = 'rgba(0,0,0,.4)'; for (let i=0;i<6;i++) ctx.fillRect(-60 + i*24, 8, 8, 4);
    ctx.fillStyle = '#140e0a'; ctx.fillRect(-36, -92, 3.5, 92); ctx.fillRect(34, -80, 3, 80); ctx.fillRect(-60, -70, 50, 2.5); ctx.fillRect(12, -60, 46, 2.5); ctx.fillStyle = '#b8ac98'; ctx.fillRect(-58, -68, 46, 5); ctx.fillRect(14, -58, 42, 5); // furled sails
    ctx.strokeStyle = 'rgba(20,14,10,.8)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-34, -92); ctx.lineTo(-90, 0); ctx.moveTo(-34, -92); ctx.lineTo(35, -80); ctx.lineTo(92, -4); ctx.stroke(); ctx.restore();
    ell(ctx, sx, sy + 26, 100, 5, 'rgba(0,0,0,.25)');
    // the near dock: planks, a bollard, crates
    ctx.fillStyle = '#241c16'; ctx.fillRect(0, H*.84, W, H*.16); ctx.strokeStyle = 'rgba(0,0,0,.5)'; for (let i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(0, H*.84 + i*H*.04); ctx.lineTo(W, H*.84 + i*H*.04); ctx.stroke(); } ctx.fillStyle = 'rgba(255,200,160,.08)'; ctx.fillRect(0, H*.84, W, 2);
    ctx.fillStyle = '#1a1a1e'; ctx.fillRect(W*.5, H*.8, 12, 16); ell(ctx, W*.5 + 6, H*.8, 7, 3, '#3a3a40'); ctx.fillStyle = '#2a1e12'; ctx.fillRect(W*.86, H*.74, 34, 26); ctx.fillStyle = '#3a2c1c'; ctx.fillRect(W*.9, H*.66, 26, 22); ctx.fillStyle = '#8fa38a'; ctx.fillRect(W*.915, H*.72, 10, 6);
    [[W*.1, H*.52],[W*.28, H*.5],[W*.44, H*.52]].forEach(([x, y], i) => { const f = hash(Math.floor(t/120), i) > .9 ? .1 : .35 + Math.sin(t/300 + i)*.1; ctx.fillStyle = `rgba(140,190,255,${f})`; ctx.fillRect(x - 1.5, y - 8, 3, 3); glow(ctx, x, y - 7, 12, '#6aa8ff', f*.4); }); // the last lamps going out
    gulls(ctx, W, H, t, 6, .08, .3);
    marchOrder(squad).forEach((id, i) => drawFigure(ctx, id, W*.08 + i*32, H*.97, 2.1, t, {phase:i, dir:1}));
    ctx.fillStyle = 'rgba(255,190,140,.05)'; ctx.fillRect(0,0,W,H); vign(ctx, W, H, .55);
  } else if (kind === 'quorl_hill' || kind === 'road_east') {
    const road = kind === 'road_east';
    ctx.fillStyle = vgrad(ctx, 0, H*.55, [[0,'#4a5a70'],[.7,'#a8a498'],[1,'#d8c8a0']]); ctx.fillRect(0,0,W,H*.55); glow(ctx, W*.92, H*.34, W*.4, '#fff0c8', .3); cloud(ctx, W*.4, H*.15, W*.34, 9, '#f0ebe1', .16); cloud(ctx, W*.12, H*.26, W*.2, 6, '#f0ebe1', .1);
    // far hills, folded; the city small behind on the quorl hill, with a glint of the lake
    for (let i=0;i<4;i++){ ctx.fillStyle = [ '#7a7060','#6a5e48','#5a4e38','#4a3e2a'][i]; ctx.beginPath(); ctx.moveTo(0, H*(.5 + i*.05)); for (let x=0;x<=W;x+=16) ctx.lineTo(x, H*(.5 + i*.05) - Math.abs(Math.sin(x/(110 - i*12) + i*1.9))*(18 - i*3)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); }
    if (!road) { glow(ctx, W*.13, H*.47, 70, '#a8c0e0', .16); skyline(ctx, W, H*.5, H*.08, 'rgba(74,78,94,.9)', 'rgba(170,200,240,.5)', 11, W*.02, W*.25, .4); ctx.fillStyle = 'rgba(210,220,235,.4)'; ctx.fillRect(W*.01, H*.5, W*.26, 2); cloud(ctx, W*.13, H*.46, W*.2, 6, '#b0b8c8', .12); } // the city, small behind, with the lake beside it
    // the road
    ctx.strokeStyle = 'rgba(180,160,120,.55)'; ctx.lineWidth = road ? 3 : 2; ctx.beginPath(); ctx.moveTo(road ? W*.1 : W*.2, H); ctx.bezierCurveTo(W*.4, H*.8, W*.3, H*.66, W*.6, H*.62); ctx.bezierCurveTo(W*.8, H*.58, W*.78, H*.54, W*.98, H*.5); ctx.stroke();
    const along = k => { const b = (p0, p1, p2, p3, u) => (1-u)**3*p0 + 3*(1-u)**2*u*p1 + 3*(1-u)*u*u*p2 + u**3*p3; if (k < .5) { const u = k*2; return {x: b(road ? W*.1 : W*.2, W*.4, W*.3, W*.6, u), y: b(H, H*.8, H*.66, H*.62, u)}; } const u = (k - .5)*2; return {x: b(W*.6, W*.8, W*.78, W*.98, u), y: b(H*.62, H*.58, H*.54, H*.5, u)}; };
    if (road) { // the Host on the march: soldiers, wagons, banners, dust, very far off
      for (let i=0;i<70;i++){ const k = .42 + i/70*.56 + ((t/90000) % (1/70)), p = along(k), s = 1.6 - k; if (k > .98) continue; ctx.fillStyle = '#2a2018'; ctx.fillRect(p.x, p.y - 4*s, 1.4*s, 4*s); if (i%3 === 0) { ctx.fillStyle = 'rgba(220,210,190,.7)'; ctx.fillRect(p.x + .5, p.y - 6*s, .6, 2*s); } // spear points
        if (i%9 === 4) { ctx.fillStyle = '#3a2c1c'; ctx.fillRect(p.x - 3*s, p.y - 4*s, 6*s, 3.5*s); } if (i%13 === 6) { ctx.fillStyle = '#1a1410'; ctx.fillRect(p.x, p.y - 12*s, .8, 10*s); ctx.fillStyle = ['#8a2a22','#c9a44a','#2a3a6a'][i%3]; ctx.fillRect(p.x + .8, p.y - 12*s + Math.sin(t/300 + i)*.5, 4*s, 2.6*s); } }
      for (let i=0;i<12;i++){ const p = along(.45 + i*.045); ell(ctx, p.x, p.y - 4, 20, 5, 'rgba(200,180,140,.1)'); }
      for (let i=0;i<5;i++){ const k = ((t/20000 + i/5) % 1); ctx.fillStyle = 'rgba(20,20,26,.7)'; ctx.fillRect(W*(.5 + i*.08) + k*40, H*(.18 + (i%2)*.06) - k*10, 3, 1); } // quorls, very far, going north
    } else { // quorls on the grass, Black Moranth, the Bridgeburners boarding; Rhivi riders far off on the road
      for (let i=0;i<4;i++){ const p = along(.62 + i*.07 + ((t/60000) % .07)); ctx.fillStyle = '#2a2018'; ell(ctx, p.x, p.y - 2, 3, 1.6, '#3a2a1c'); ctx.fillRect(p.x + 1.5, p.y - 5, 1, 3); ell(ctx, p.x - 6, p.y - 2, 10, 3, 'rgba(200,180,140,.12)'); }
      [[W*.24, H*.1, 1.1, 1],[W*.6, H*.2, .8, -1]].forEach(([x, y, sc, d], i) => drawFigure(ctx, 'quorl', x + Math.sin(t/3000 + i)*20, y + 30, sc, t, {phase:i + 1, dir:d, air:true}));
      [[W*.5, H*.72, 2.3, -1],[W*.7, H*.66, 1.9, 1],[W*.93, H*.74, 2.5, -1]].forEach(([x, y, sc, d], i) => drawFigure(ctx, 'quorl', x, y, sc, t, {still:true, phase:i, dir:d}));
      [[W*.52, H*.8, 1.8, -1],[W*.74, H*.76, 1.6, 1],[W*.94, H*.82, 1.8, -1]].forEach(([x, y, s, d], i) => drawFigure(ctx, 'moranth', x, y, s, t, {still:true, phase:i, dir:d}));
      [[W*.62, H*.78],[W*.6, H*.8],[W*.8, H*.8]].forEach(([x, y], i) => drawFigure(ctx, ['fiddler','hedge','mallet'][i], x, y, 1.5, t, {phase:i, dir:1})); }
    ctx.fillStyle = vgrad(ctx, H*.78, H, [[0,'#5a4a30'],[1,'#2e2416']]); ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, H*.82); ctx.quadraticCurveTo(W*.2, H*.76, W*.42, H*.88); ctx.quadraticCurveTo(W*.7, H*1.0, W, H*.96); ctx.lineTo(W, H); ctx.fill();
    ctx.strokeStyle = 'rgba(140,130,80,.5)'; ctx.lineWidth = 1; for (let i=0;i<50;i++){ const x = hash(i,51)*W*.42, y = H*.84 + hash(i,52)*H*.16, h = 3 + hash(i,53)*6; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.sin(t/900 + i)*2, y - h*.6, x + Math.sin(t/700 + i)*3, y - h); ctx.stroke(); }
    marchOrder(squad).forEach((id, i) => drawFigure(ctx, id, W*.05 + i*28, H*.95, 2.1, t, {phase:i, dir:1, still:road}));
    ctx.fillStyle = 'rgba(255,220,160,.05)'; ctx.fillRect(0,0,W,H); vign(ctx, W, H, .5);
  } else if (kind === 'ship') {
    // a deck, a rail, a sail; grey water all round, and the city going small behind
    const roll = Math.sin(t/1800)*.02; ctx.save(); ctx.translate(W/2, H/2); ctx.rotate(roll); ctx.translate(-W/2, -H/2);
    ctx.fillStyle = vgrad(ctx, -20, H*.56, [[0,'#3a4250'],[.7,'#7a7e86'],[1,'#a8a49a']]); ctx.fillRect(-40, -40, W + 80, H*.56 + 40);
    ctx.fillStyle = vgrad(ctx, H*.54, H, [[0,'#5a6068'],[1,'#20262c']]); ctx.fillRect(-40, H*.54, W + 80, H*.6);
    for (let i=0;i<60;i++){ const y = H*.56 + Math.pow(hash(i,21), 1.4)*H*.44, x = ((hash(i,22)*W - t*(.01 + (y - H*.5)*.0002)) % W + W) % W, w = 5 + (y - H*.5)*.3; ctx.strokeStyle = `rgba(220,225,230,${.1 + hash(i,23)*.14})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + w/2, y - 2, x + w, y); ctx.stroke(); }
    skyline(ctx, W, H*.555, H*.035, 'rgba(60,64,74,.85)', null, 13, W*.62, W*.86); glow(ctx, W*.74, H*.54, 50, '#b8c8e0', .12);
    gulls(ctx, W, H, t, 3, .12, .2, 'rgba(230,228,220,.8)');
    // the mast and a sail with the wind in it
    const bil = Math.sin(t/900)*4; ctx.fillStyle = vgrad(ctx, H*.05, H*.6, [[0,'#c8bca4'],[1,'#8a806e']]); ctx.beginPath(); ctx.moveTo(W*.03, H*.06); ctx.quadraticCurveTo(W*.23 + bil*3, H*.3, W*.05, H*.62); ctx.lineTo(W*.4, H*.6); ctx.quadraticCurveTo(W*.48 + bil*3, H*.3, W*.41, H*.06); ctx.fill();
    ctx.strokeStyle = 'rgba(60,50,40,.35)'; ctx.lineWidth = 1; for (let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(W*.04, H*(.06 + i*.14)); ctx.quadraticCurveTo(W*.26 + bil*3, H*(.12 + i*.14), W*.42, H*(.06 + i*.14)); ctx.stroke(); } ctx.fillStyle = '#1e1610'; ctx.fillRect(W*.2, -40, 6, H*.84 + 40); ctx.fillRect(W*.02, H*.04, W*.4, 4); ctx.strokeStyle = 'rgba(20,14,10,.7)'; ctx.beginPath(); ctx.moveTo(W*.22, -10); ctx.lineTo(W*.6, H*.72); ctx.moveTo(W*.22, -10); ctx.lineTo(-10, H*.72); ctx.stroke();
    // the deck and rail
    ctx.fillStyle = '#3a2c1e'; poly(ctx, [[-40, H],[-40, H*.72],[W + 40, H*.72],[W + 40, H]], '#3a2c1e'); ctx.strokeStyle = 'rgba(0,0,0,.4)'; for (let i=0;i<7;i++){ ctx.beginPath(); ctx.moveTo(-40, H*.74 + i*H*.04); ctx.lineTo(W + 40, H*.74 + i*H*.04); ctx.stroke(); }
    ctx.fillStyle = '#4a3624'; ctx.fillRect(-40, H*.6, W + 80, 6); for (let i=0;i<22;i++) ctx.fillRect(i*W/20 - 2, H*.6, 4, H*.13); ctx.fillStyle = 'rgba(255,240,220,.12)'; ctx.fillRect(-40, H*.6, W + 80, 1.5);
    ctx.restore();
    marchOrder(squad).forEach((id, i) => drawFigure(ctx, id, W*.5 + i*Math.min(30, (W*.5 - 24)/Math.max(1, squad.length - 1)), H*.96, 2.1, t, {phase:i, dir:1, still:true}));
    for (let i=0;i<12;i++){ const k = ((t/1400 + i/12) % 1); ctx.fillStyle = `rgba(230,235,240,${(1-k)*.35})`; ctx.fillRect(hash(i,91)*W, H*.6 - k*H*.3, 1.4, 1.4); } // spray
    vign(ctx, W, H, .55);
  }
}
