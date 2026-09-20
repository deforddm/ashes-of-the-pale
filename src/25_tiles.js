/* ============ tiles ============ */
function drawTile(ctx, ch, x, y, T, dark, tunnel){
  const px = x*T, py = y*T, h = hash(x,y);
  const fill = c => { ctx.fillStyle = c; ctx.fillRect(px,py,T,T); };
  const speck = (c, n, s=1, sz=.06) => { ctx.fillStyle = c; for (let i=0;i<n;i++){ const a = hash(x,y,i+s), b = hash(y,x,i+s+9); ctx.fillRect(px+a*T, py+b*T, Math.max(1,T*sz), Math.max(1,T*sz)); } };
  if (ch === '#') { fill(dark ? '#0c0a0a' : tunnel ? '#151110' : '#171310');
    for (let i=0;i<4;i++){ const a=hash(x,y,i), b=hash(x,y,i+5), r = T*(.16 + hash(x,y,i+11)*.14); const g = ctx.createRadialGradient(px+(.2+a*.6)*T - r*.3, py+(.2+b*.6)*T - r*.3, 1, px+(.2+a*.6)*T, py+(.2+b*.6)*T, r); g.addColorStop(0, dark ? '#2a2426' : '#43372e'); g.addColorStop(1, dark ? '#0a0909' : '#130f0d'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(px+(.2+a*.6)*T, py+(.2+b*.6)*T, r, r*.7, a*3, 0, 7); ctx.fill(); }
    if (tunnel && hash(x,y,3) > .6) { ctx.fillStyle = '#2a1e12'; ctx.fillRect(px + T*.1, py, T*.12, T); } return; }
  const base = ch === ',' ? '#403a34' : ch === 'P' ? '#161210' : tunnel ? '#26211c' : '#332b23';
  fill(dark ? shade(base, -.4) : shade(base, (h - .5) * .16));
  speck(ch === ',' ? '#5e574f' : '#3f362e', 4);
  if (h > .82) speck('#0f0c0a', 2, 7, .1); // pebbles
  if (ch === 'R') { ctx.fillStyle = '#1e1915'; ctx.fillRect(px+1,py+1,T-2,T-2); ctx.fillStyle = '#3d3229'; ctx.fillRect(px+1,py+1,T-2,T*.22);
    ctx.strokeStyle = '#120f0d'; ctx.lineWidth = 1; for (let r=1;r<4;r++){ ctx.beginPath(); ctx.moveTo(px+1, py+r*T/4); ctx.lineTo(px+T-1, py+r*T/4); ctx.stroke(); } ctx.fillStyle = '#0a0807'; ctx.fillRect(px + T*.3, py + T*.35, T*.4, T*.3); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(px + T*.5, py + T*.05, T*.5, T*.9); }
  if (ch === 'P') { speck('#cfc4b0', 5, 3); speck('#8a7a68', 3, 13, .05); ctx.strokeStyle = '#26201a'; ctx.strokeRect(px+2,py+2,T-4,T-4); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(px+2,py+2,T-4,T*.3); }
  if (ch === '~') { fill('#0b0910'); const cg = ctx.createRadialGradient(9*T, 6*T, T*.3, 9*T, 6*T, T*2.3); cg.addColorStop(0, '#1e1630'); cg.addColorStop(.7, '#0e0b14'); cg.addColorStop(1, '#221c18'); ctx.fillStyle = cg; ctx.fillRect(px,py,T,T); ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 1; for (let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(px + hash(x,y,i)*T, py + hash(x,y,i+9)*T); ctx.lineTo(px + hash(x,y,i+4)*T, py + hash(x,y,i+13)*T); ctx.stroke(); } speck('#3a2f4a', 3, 21, .05); }
  if (ch === '=') { ctx.fillStyle = '#5a4630'; ctx.beginPath(); ctx.moveTo(px, py+T); ctx.lineTo(px+T/2, py+T*.12); ctx.lineTo(px+T, py+T); ctx.fill(); ctx.fillStyle = '#3c2d1e'; ctx.beginPath(); ctx.moveTo(px+T/2, py+T*.12); ctx.lineTo(px+T, py+T); ctx.lineTo(px+T*.62, py+T); ctx.fill(); ctx.fillStyle = '#0a0806'; ctx.beginPath(); ctx.moveTo(px+T*.4, py+T); ctx.lineTo(px+T*.5, py+T*.6); ctx.lineTo(px+T*.6, py+T); ctx.fill(); }
  if (ch === 'C') { ctx.fillStyle = '#4a3a26'; ctx.beginPath(); ctx.moveTo(px - T*.1, py+T); ctx.lineTo(px+T/2, py+T*.02); ctx.lineTo(px+T*1.1, py+T); ctx.fill(); ctx.fillStyle = '#2c2216'; ctx.beginPath(); ctx.moveTo(px+T/2, py+T*.02); ctx.lineTo(px+T*1.1, py+T); ctx.lineTo(px+T*.66, py+T); ctx.fill(); ctx.fillStyle = '#1a1208'; ctx.beginPath(); ctx.moveTo(px+T*.38, py+T); ctx.lineTo(px+T*.5, py+T*.55); ctx.lineTo(px+T*.62, py+T); ctx.fill(); ctx.fillStyle = 'rgba(255,190,110,.55)'; ctx.fillRect(px+T*.45, py+T*.7, T*.1, T*.3); }
  if (ch === 'F' || ch === 'B') { for (let i=0;i<7;i++){ const a = i/7*6.28; ell(ctx, px+T/2 + Math.cos(a)*T*.32, py+T*.6 + Math.sin(a)*T*.2, T*.07, T*.05, '#3a3128'); } ell(ctx, px+T/2, py+T*.6, T*.16, T*.08, '#1a1008'); }
  if (ch === 'W') { ctx.fillStyle = '#3c2d1e'; ctx.fillRect(px+T*.12, py+T*.3, T*.76, T*.4); ctx.fillStyle = '#5a4630'; ctx.fillRect(px+T*.12, py+T*.3, T*.76, T*.08); ctx.fillStyle = '#15100a'; ell(ctx, px+T*.28, py+T*.76, T*.11, T*.11, '#15100a'); ell(ctx, px+T*.72, py+T*.76, T*.11, T*.11, '#15100a'); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(px+T*.2, py+T*.16, T*.6, T*.16); }
  if (ch === 'x') { ctx.fillStyle = '#3a2a18'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.7); ctx.fillStyle = '#6b5a3c'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.1); ctx.strokeStyle = 'rgba(120,100,70,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py+T*.35); ctx.lineTo(px+T, py+T*.35); ctx.stroke(); }
  if (ch === 'T') { ctx.fillStyle = '#030202'; ctx.fillRect(px+T*.15, py+T*.2, T*.7, T*.72); ctx.fillStyle = '#4a3a26'; ctx.fillRect(px+T*.08, py+T*.12, T*.84, T*.12); ctx.fillRect(px+T*.1, py+T*.12, T*.1, T*.8); ctx.fillRect(px+T*.8, py+T*.12, T*.1, T*.8); }
}
function prerender(map, cols, rows, dark, tunnel){
  const {bctx, T} = G; if (!bctx) return;
  for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) drawTile(bctx, map[y][x] === '#' ? '#' : tunnel ? (hash(x,y,4) > .8 ? ',' : '.') : map[y][x], x, y, T, dark, tunnel);
  // grime / soft shadows along walls
  for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) if (map[y][x] !== '#' && (map[y-1]?.[x] === '#')) { const g = bctx.createLinearGradient(0, y*T, 0, y*T + T*.5); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); bctx.fillStyle = g; bctx.fillRect(x*T, y*T, T, T*.5); }
  if (tunnel) { for (let i=0;i<cols*rows*.15;i++){ const x = hash(i,31)*cols*T, y = hash(i,32)*rows*T; ell(bctx, x, y, T*.3, T*.1, 'rgba(0,0,0,.25)'); } }
  G.dctx.clearRect(0,0,cols*T,rows*T);
}
function bloodDecal(x, y, big){
  if (!SET.blood) return; const {dctx, T} = G; const cx = x*T + T/2, cy = y*T + T*.7, n = big ? 8 : 4;
  for (let i=0;i<n;i++){ const a = Math.random()*7, d = Math.random()*T*(big ? .4 : .25); ell(dctx, cx + Math.cos(a)*d, cy + Math.sin(a)*d*.5, T*(.04 + Math.random()*.1), T*(.025 + Math.random()*.05), `rgba(${48 + R(30)},${6 + R(6)},${6},${.45 + Math.random()*.3})`, a); }
}

