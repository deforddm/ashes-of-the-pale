/* ============ tiles ============ */
function drawTile(ctx, ch, x, y, T, dark, tunnel, style){
  const px = x*T, py = y*T, h = hash(x,y);
  const plain = style && style.startsWith('plain');
  const city = style && (style.startsWith('city') || style === 'cellar'), cellar = style === 'cellar';
  const fill = c => { ctx.fillStyle = c; ctx.fillRect(px,py,T,T); };
  const speck = (c, n, s=1, sz=.06) => { ctx.fillStyle = c; for (let i=0;i<n;i++){ const a = hash(x,y,i+s), b = hash(y,x,i+s+9); ctx.fillRect(px+a*T, py+b*T, Math.max(1,T*sz), Math.max(1,T*sz)); } };
  const roof = style && style.startsWith('roof');
  if (roof) {
    if (ch === '#') { fill('#04040a'); ctx.fillStyle = 'rgba(90,140,210,.06)'; if (hash(x,y,2) > .6) ctx.fillRect(px+T*.3, py+T*.4, T*.1, T*.1); /* a lamp far below */ return; }
    fill(ch === ',' ? '#26262e' : '#2e2a28');
    ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 1; const rw = T*.5, rh = T*.2; // tiles / slates
    for (let r=0;r<5;r++){ const off = (r%2)*rw*.5; for (let c=-1;c<3;c++){ const bx = px + c*rw + off, by = py + r*rh; ctx.beginPath(); ctx.moveTo(bx, by + rh); ctx.lineTo(bx + rw, by + rh); ctx.moveTo(bx + rw*.5, by); ctx.lineTo(bx + rw*.5, by + rh); ctx.stroke(); } }
    ctx.fillStyle = 'rgba(160,190,220,.06)'; ctx.fillRect(px, py, T, T*.15); // lake-mist sheen
    if (h > .88) speck('#0a0908', 2, 7, .08);
    if (ch === 'p') { ctx.fillStyle = '#4a3a26'; ctx.fillRect(px, py+T*.34, T, T*.32); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.moveTo(px, py+T*.5); ctx.lineTo(px+T, py+T*.5); ctx.stroke(); ctx.fillStyle = '#2a1e12'; ctx.fillRect(px, py+T*.62, T, T*.04); }
    if (ch === 'C') { ctx.fillStyle = '#1e1a18'; ctx.fillRect(px+T*.22, py+T*.08, T*.56, T*.84); ctx.fillStyle = '#2e2622'; ctx.fillRect(px+T*.18, py+T*.05, T*.64, T*.1); ctx.fillStyle = '#0a0808'; ctx.fillRect(px+T*.32, py+T*.12, T*.36, T*.08); ctx.strokeStyle = 'rgba(0,0,0,.4)'; for (let r=1;r<5;r++){ ctx.beginPath(); ctx.moveTo(px+T*.22, py+T*.15+r*T*.16); ctx.lineTo(px+T*.78, py+T*.15+r*T*.16); ctx.stroke(); } }
    if (ch === 'S') { ctx.fillStyle = '#1a1410'; ctx.fillRect(px+T*.12, py+T*.15, T*.76, T*.7); ctx.fillStyle = 'rgba(232,192,115,.22)'; ctx.fillRect(px+T*.18, py+T*.2, T*.64, T*.6); ctx.strokeStyle = '#3a2c1c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px+T*.5, py+T*.15); ctx.lineTo(px+T*.5, py+T*.85); ctx.moveTo(px+T*.12, py+T*.5); ctx.lineTo(px+T*.88, py+T*.5); ctx.stroke(); }
    if (ch === 'x') { ctx.fillStyle = '#3a2a18'; ctx.fillRect(px+T*.44, py+T*.15, T*.12, T*.75); ctx.strokeStyle = 'rgba(200,190,175,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py+T*.3); ctx.lineTo(px+T, py+T*.3); ctx.stroke(); for (let i=0;i<3;i++){ ctx.fillStyle = ['#8a7a6a','#6a4a4a','#5a6a7a'][i]; ctx.fillRect(px+T*.1+i*T*.3, py+T*.3, T*.14, T*.28); } }
    if (ch === '>' || ch === '<') { ctx.fillStyle = 'rgba(232,192,115,.55)'; const d = ch === '>' ? 1 : -1; ctx.beginPath(); ctx.moveTo(px+T*.5 - d*T*.18, py+T*.3); ctx.lineTo(px+T*.5 + d*T*.18, py+T*.5); ctx.lineTo(px+T*.5 - d*T*.18, py+T*.7); ctx.closePath(); ctx.fill(); }
    return; }
  if (ch === '#' && city) { // brick and mortar, or the cellar's cut stone
    fill(cellar ? '#0e0c0b' : dark ? '#100e10' : '#1a1614');
    ctx.fillStyle = cellar ? '#1e1a17' : dark ? '#221c1e' : '#2e2622'; const bh = T*.22, bw = T*.5;
    for (let r=0;r<4;r++){ const off = (r%2)*bw*.5; for (let c=-1;c<3;c++){ const bx = px + c*bw + off + 1, by = py + r*bh + 1; ctx.fillRect(Math.max(px,bx), by, Math.min(bw-2, px+T-bx), bh-2); } }
    if (!cellar && hash(x,y,3) > .7) { ctx.fillStyle = dark ? 'rgba(90,140,210,.10)' : 'rgba(232,192,115,.12)'; ctx.fillRect(px+T*.3, py+T*.25, T*.4, T*.35); ctx.fillStyle = '#0a0808'; ctx.fillRect(px+T*.48, py+T*.25, T*.04, T*.35); } // a window, lit or not
    return; }
  if (city && ch !== '#') {
    fill(cellar ? (ch === ',' ? '#1a1815' : '#221e1a') : dark ? (ch === ',' ? '#171a20' : '#1e1e22') : (ch === ',' ? '#2a2c30' : '#33312f'));
    ctx.strokeStyle = cellar ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.45)'; ctx.lineWidth = 1; const cw = T*.34, chh = T*.25; // cobbles
    for (let r=0;r<4;r++){ const off = (r%2)*cw*.5; for (let c=-1;c<4;c++){ const bx = px + c*cw + off, by = py + r*chh; ctx.beginPath(); ctx.ellipse(bx + cw*.5, by + chh*.5, cw*.46, chh*.42, 0, 0, 7); ctx.stroke(); } }
    if (ch === ',') { ctx.fillStyle = dark ? 'rgba(90,140,210,.16)' : 'rgba(180,190,200,.12)'; ell(ctx, px+T*.5, py+T*.55, T*.36, T*.2, dark ? 'rgba(90,140,210,.16)' : 'rgba(180,190,200,.12)'); } // a puddle
    if (h > .85) speck('#0a0908', 3, 7, .08);
    if (ch === 'L') { ctx.fillStyle = '#1a1a1c'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.72); ctx.fillStyle = '#2e2e32'; ctx.fillRect(px+T*.36, py+T*.1, T*.28, T*.22); ctx.fillStyle = 'rgba(120,180,255,.85)'; ctx.fillRect(px+T*.42, py+T*.14, T*.16, T*.14); }
    if (ch === 'D') { ctx.fillStyle = '#0a0806'; ctx.fillRect(px+T*.18, py+T*.1, T*.64, T*.82); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(px+T*.22, py+T*.14, T*.56, T*.74); ctx.fillStyle = '#1a1208'; ctx.fillRect(px+T*.49, py+T*.14, T*.02, T*.74); ctx.fillStyle = '#c9a44a'; ctx.fillRect(px+T*.4, py+T*.52, T*.06, T*.06); ctx.fillStyle = 'rgba(232,192,115,.18)'; ctx.fillRect(px+T*.22, py+T*.14, T*.56, T*.1); }
    if (ch === 'H') { ell(ctx, px+T*.5, py+T*.55, T*.42, T*.3, '#050404'); ell(ctx, px+T*.5, py+T*.5, T*.36, T*.22, '#000'); ctx.fillStyle = '#3a3230'; for (let i=0;i<6;i++){ const a = i/6*6.28; ctx.fillRect(px+T*.5 + Math.cos(a)*T*.44 - 2, py+T*.55 + Math.sin(a)*T*.32 - 1, 4, 3); } }
    if (ch === 'B') { ctx.fillStyle = '#2a1e12'; ctx.fillRect(px+T*.1, py+T*.35, T*.5, T*.5); ctx.fillStyle = '#4a3622'; ctx.fillRect(px+T*.1, py+T*.35, T*.5, T*.08); ctx.fillRect(px+T*.1, py+T*.6, T*.5, T*.05); ctx.fillStyle = '#3a2c1c'; ctx.fillRect(px+T*.5, py+T*.15, T*.4, T*.4); ctx.fillStyle = '#6b5a3c'; ctx.fillRect(px+T*.5, py+T*.15, T*.4, T*.06); ctx.fillStyle = '#8fa38a'; ctx.fillRect(px+T*.6, py+T*.28, T*.2, T*.12); /* a Moranth seal */ }
    if (ch === 'S') { for (let i=0;i<4;i++){ ctx.fillStyle = i%2 ? '#2a2622' : '#1a1714'; ctx.fillRect(px+T*.1, py+T*.15+i*T*.2, T*.8, T*.18); } ctx.fillStyle = 'rgba(232,192,115,.2)'; ctx.fillRect(px+T*.1, py+T*.1, T*.8, T*.1); }
    if (ch === 'W') { ctx.fillStyle = '#3c2d1e'; ctx.fillRect(px+T*.12, py+T*.3, T*.76, T*.4); ctx.fillStyle = '#5a4630'; ctx.fillRect(px+T*.12, py+T*.3, T*.76, T*.08); ell(ctx, px+T*.28, py+T*.76, T*.11, T*.11, '#15100a'); ell(ctx, px+T*.72, py+T*.76, T*.11, T*.11, '#15100a'); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(px+T*.2, py+T*.16, T*.6, T*.16); }
    if (ch === 'x') { ctx.fillStyle = '#3a2a18'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.7); ctx.fillStyle = '#6b5a3c'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.1); ctx.strokeStyle = 'rgba(120,100,70,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py+T*.35); ctx.lineTo(px+T, py+T*.35); ctx.stroke(); }
    if (ch === 'F') { for (let i=0;i<7;i++){ const a = i/7*6.28; ell(ctx, px+T/2 + Math.cos(a)*T*.32, py+T*.6 + Math.sin(a)*T*.2, T*.07, T*.05, '#3a3128'); } ell(ctx, px+T/2, py+T*.6, T*.16, T*.08, '#1a1008'); }
    if (ch === 'r') { ell(ctx, px+T*.5, py+T*.62, T*.3, T*.2, '#3a3630'); ell(ctx, px+T*.44, py+T*.56, T*.2, T*.14, '#57534c'); }
    if (ch === '>' || ch === '<') { ctx.fillStyle = 'rgba(232,192,115,.55)'; const d = ch === '>' ? 1 : -1; ctx.beginPath(); ctx.moveTo(px+T*.5 - d*T*.18, py+T*.3); ctx.lineTo(px+T*.5 + d*T*.18, py+T*.5); ctx.lineTo(px+T*.5 - d*T*.18, py+T*.7); ctx.closePath(); ctx.fill(); }
    return; }
  if (ch === '#' && plain) { fill(dark ? '#0f130c' : '#1e2616'); for (let i=0;i<5;i++){ const a = hash(x,y,i), b = hash(x,y,i+5), r = T*(.14 + hash(x,y,i+11)*.16); ell(ctx, px + (.15 + a*.7)*T, py + (.25 + b*.6)*T, r, r*.7, dark ? '#101508' : '#243019'); ell(ctx, px + (.15 + a*.7)*T - r*.25, py + (.25 + b*.6)*T - r*.25, r*.5, r*.35, dark ? '#16200c' : '#334523'); } return; }
  if (ch === '#') { fill(dark ? '#0c0a0a' : tunnel ? '#151110' : '#171310');
    for (let i=0;i<4;i++){ const a=hash(x,y,i), b=hash(x,y,i+5), r = T*(.16 + hash(x,y,i+11)*.14); const g = ctx.createRadialGradient(px+(.2+a*.6)*T - r*.3, py+(.2+b*.6)*T - r*.3, 1, px+(.2+a*.6)*T, py+(.2+b*.6)*T, r); g.addColorStop(0, dark ? '#2a2426' : '#43372e'); g.addColorStop(1, dark ? '#0a0909' : '#130f0d'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(px+(.2+a*.6)*T, py+(.2+b*.6)*T, r, r*.7, a*3, 0, 7); ctx.fill(); }
    if (tunnel && hash(x,y,3) > .6) { ctx.fillStyle = '#2a1e12'; ctx.fillRect(px + T*.1, py, T*.12, T); } return; }
  const base = plain ? (ch === ',' ? '#4f5a34' : '#4a5232') : ch === ',' ? '#403a34' : ch === 'P' ? '#161210' : tunnel ? '#26211c' : '#332b23';
  fill(dark ? shade(base, -.4) : shade(base, (h - .5) * .16));
  if (plain) { ctx.strokeStyle = dark ? 'rgba(90,110,60,.35)' : 'rgba(120,140,70,.5)'; ctx.lineWidth = 1; const n = ch === ',' ? 7 : 3; for (let i=0;i<n;i++){ const gx = px + hash(x,y,i+20)*T, gy = py + T*.3 + hash(y,x,i+30)*T*.7, gh = T*(ch === ',' ? .35 : .18); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx + 2, gy - gh*.6, gx + (hash(x,y,i+40)-.5)*4, gy - gh); ctx.stroke(); } }
  else speck(ch === ',' ? '#5e574f' : '#3f362e', 4);
  if (ch === 'r') { ell(ctx, px+T*.5, py+T*.62, T*.3, T*.2, '#3a3630'); ell(ctx, px+T*.44, py+T*.56, T*.2, T*.14, '#57534c'); ell(ctx, px+T*.62, py+T*.66, T*.12, T*.08, '#2a2724'); }
  if (ch === 'M') { ctx.fillStyle = '#3a3a38'; ctx.beginPath(); ctx.moveTo(px+T*.08, py+T*.92); ctx.quadraticCurveTo(px+T*.5, py-T*.1, px+T*.92, py+T*.92); ctx.fill(); ctx.fillStyle = '#2a2a28'; ctx.fillRect(px+T*.4, py+T*.5, T*.2, T*.42); ctx.fillStyle = '#6b6a66'; for (let i=0;i<5;i++) ctx.fillRect(px+T*.15+i*T*.15, py+T*.55+hash(x,y,i)*T*.2, T*.08, T*.06); }
  if (ch === '>' || ch === '<') { ctx.fillStyle = 'rgba(232,192,115,.55)'; const d = ch === '>' ? 1 : -1; ctx.beginPath(); ctx.moveTo(px+T*.5 - d*T*.18, py+T*.3); ctx.lineTo(px+T*.5 + d*T*.18, py+T*.5); ctx.lineTo(px+T*.5 - d*T*.18, py+T*.7); ctx.closePath(); ctx.fill(); }
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
function prerender(map, cols, rows, dark, tunnel, style){
  const {bctx, T} = G; if (!bctx) return;
  for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) drawTile(bctx, map[y][x] === '#' ? '#' : tunnel ? (hash(x,y,4) > .8 ? ',' : '.') : map[y][x], x, y, T, dark, tunnel, style);
  // grime / soft shadows along walls
  for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) if (map[y][x] !== '#' && (map[y-1]?.[x] === '#')) { const g = bctx.createLinearGradient(0, y*T, 0, y*T + T*.5); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); bctx.fillStyle = g; bctx.fillRect(x*T, y*T, T, T*.5); }
  if (tunnel) { for (let i=0;i<cols*rows*.15;i++){ const x = hash(i,31)*cols*T, y = hash(i,32)*rows*T; ell(bctx, x, y, T*.3, T*.1, 'rgba(0,0,0,.25)'); } }
  G.dctx.clearRect(0,0,cols*T,rows*T);
}
function bloodDecal(x, y, big){
  if (!SET.blood) return; const {dctx, T} = G; const cx = x*T + T/2, cy = y*T + T*.7, n = big ? 8 : 4;
  for (let i=0;i<n;i++){ const a = Math.random()*7, d = Math.random()*T*(big ? .4 : .25); ell(dctx, cx + Math.cos(a)*d, cy + Math.sin(a)*d*.5, T*(.04 + Math.random()*.1), T*(.025 + Math.random()*.05), `rgba(${48 + R(30)},${6 + R(6)},${6},${.45 + Math.random()*.3})`, a); }
}

