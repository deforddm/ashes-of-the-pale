/* ============ tiles ============ */
/* exits: > < ^ v, drawn the same brass arrow in every style */
function exitArrow(ctx, ch, px, py, T){ const d = {'>':[1,0],'<':[-1,0],'v':[0,1],'^':[0,-1]}[ch]; if (!d) return false; const [dx,dy] = d, cx = px+T*.5, cy = py+T*.5;
  ctx.fillStyle = 'rgba(232,192,115,.55)'; ctx.beginPath(); ctx.moveTo(cx - dx*T*.18 - dy*T*.2, cy - dy*T*.18 - dx*T*.2); ctx.lineTo(cx + dx*T*.18, cy + dy*T*.18); ctx.lineTo(cx - dx*T*.18 + dy*T*.2, cy - dy*T*.18 + dx*T*.2); ctx.closePath(); ctx.fill(); return true; }
let estateMap = null; // the estate map being prerendered: a fountain or pond bigger than one tile is drawn once, whole
/* a block of f or w tiles is one fountain or one pond: {x,y,w,h} at its top-left tile, 'part' on its other tiles, null for a lone tile */
function estateBlock(map, x, y){ const c = map[y][x], at = (xx, yy) => !!map[yy] && map[yy][xx] === c;
  if (at(x-1, y) || at(x, y-1)) return 'part'; let w = 1, h = 1; while (at(x+w, y)) w++; while (at(x, y+h)) h++; return w > 1 || h > 1 ? {x, y, w, h} : null; }
let estateRing = {x:8, y:5}; // where the frost rings spread from: the sapling, or the top of a battle map
/* the estate: Lady Simtal's terraces and garden at night (estate_night / garden, estate_terrace / terrace, estate_storm / storm).
   mode: 'night' | 'terrace' | 'storm'. In battle every tile but # and , is plain ground. */
function drawEstateTile(ctx, ch, x, y, T, mode, battle){
  const px = x*T, py = y*T, h = hash(x,y), terr = mode === 'terrace', storm = mode === 'storm';
  const fill = c => { ctx.fillStyle = c; ctx.fillRect(px,py,T,T); };
  const line = (x0,y0,x1,y1,c,w=1) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(px+x0*T, py+y0*T); ctx.lineTo(px+x1*T, py+y1*T); ctx.stroke(); };
  if (battle && ch !== '#' && ch !== ',') ch = '.';
  const lawn = () => { // trimmed dark lawn with mower stripes, or pale marble flags, or frozen grass
    if (terr) { fill(shade('#3e434c', (h - .5)*.12)); ctx.strokeStyle = 'rgba(14,16,20,.75)'; ctx.lineWidth = 1; ctx.strokeRect(px+.5, py+.5, T-1, T-1); ctx.beginPath(); ctx.moveTo(px + (x%2 ? T*.5 : 0), py + T*.5); ctx.lineTo(px + (x%2 ? T : T*.5), py + T*.5); ctx.stroke();
      ctx.strokeStyle = 'rgba(210,216,232,.09)'; ctx.beginPath(); ctx.moveTo(px + hash(x,y,3)*T, py); ctx.bezierCurveTo(px + T*.3, py + T*.4, px + T*.7, py + T*.3, px + hash(x,y,4)*T, py + T); ctx.stroke();
      ctx.fillStyle = 'rgba(160,180,220,.05)'; ctx.fillRect(px+1, py+1, T*.45, T*.45); return; }
    fill(storm ? shade('#27353d', (h - .5)*.1) : shade(x % 2 ? '#182b23' : '#12221b', (h - .5)*.08));
    ctx.strokeStyle = storm ? 'rgba(190,220,240,.22)' : 'rgba(70,110,80,.35)'; ctx.lineWidth = 1; for (let i=0;i<4;i++){ const gx = px + hash(x,y,i+20)*T, gy = py + T*.3 + hash(y,x,i+30)*T*.65; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + (hash(x,y,i+40)-.5)*2, gy - T*.1); ctx.stroke(); }
    if (storm) { ctx.strokeStyle = 'rgba(210,235,255,.28)'; ctx.lineWidth = 1; const cx = (estateRing.x + .5)*T, cy = (estateRing.y + .6)*T, d = Math.hypot(px + T/2 - cx, py + T/2 - cy); for (let r = Math.floor(d/(T*.9))*T*.9 - T*.9; r < d + T; r += T*.9) { if (r <= 0) continue; ctx.save(); ctx.beginPath(); ctx.rect(px, py, T, T); ctx.clip(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.restore(); }
      ctx.fillStyle = 'rgba(230,245,255,.35)'; for (let i=0;i<5;i++) ctx.fillRect(px + hash(x,y,i+50)*T, py + hash(y,x,i+60)*T, 1.5, 1.5); } };
  const gravel = () => { // raked gravel, or the mosaic runner
    if (terr) { fill('#3a1418'); ctx.fillStyle = '#1c2a5e'; ctx.fillRect(px, py, T, T*.14); ctx.fillRect(px, py + T*.86, T, T*.14); ctx.fillStyle = '#c9a44a'; ctx.fillRect(px, py + T*.14, T, 1); ctx.fillRect(px, py + T*.86 - 1, T, 1);
      for (let i=0;i<2;i++){ const cx = px + T*(.25 + i*.5), cy = py + T*.5; poly(ctx, [[cx, cy - T*.22],[cx + T*.18, cy],[cx, cy + T*.22],[cx - T*.18, cy]], i%2 ? '#26408a' : '#6a1e24'); poly(ctx, [[cx, cy - T*.1],[cx + T*.08, cy],[cx, cy + T*.1],[cx - T*.08, cy]], '#c9a44a'); }
      ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i=0;i<14;i++) ctx.fillRect(px + hash(x,y,i)*T, py + hash(y,x,i)*T, 1, 1); return; }
    fill(storm ? '#3a444a' : '#34342f'); ctx.strokeStyle = storm ? 'rgba(220,240,255,.18)' : 'rgba(0,0,0,.35)'; ctx.lineWidth = 1;
    for (let i=1;i<6;i++){ ctx.beginPath(); ctx.moveTo(px, py + i*T/6); ctx.quadraticCurveTo(px + T*.5, py + i*T/6 + (y%2 ? 2 : -2), px + T, py + i*T/6); ctx.stroke(); }
    ctx.fillStyle = storm ? 'rgba(230,240,250,.3)' : 'rgba(150,140,120,.25)'; for (let i=0;i<8;i++) ctx.fillRect(px + hash(x,y,i+3)*T, py + hash(y,x,i+7)*T, 1, 1); };
  const brick = () => { fill(storm ? '#1e2226' : '#1a1616'); const bh = T*.22, bw = T*.5; ctx.fillStyle = storm ? '#2e343a' : '#352623';
    for (let r=0;r<4;r++){ const off = (r%2)*bw*.5; for (let c=-1;c<3;c++){ const bx = px + c*bw + off + 1, by = py + r*bh + 1; ctx.fillRect(Math.max(px,bx), by, Math.min(bw-2, px+T-bx), bh-2); } }
    for (let i=0;i<7;i++){ const a = hash(x,y,i+70), b = hash(y,x,i+71); ell(ctx, px + a*T, py + b*T*.9, T*(.08 + hash(x,y,i)*.08), T*.05, storm ? 'rgba(170,200,220,.5)' : i%3 ? '#1c3222' : '#2a4a2e', a*3); } // ivy, or hoarfrost on it
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(px, py + T*.85, T, T*.15); };
  const dressed = () => { fill('#5a5e66'); ctx.strokeStyle = 'rgba(20,22,28,.7)'; ctx.lineWidth = 1; for (let r=0;r<3;r++){ ctx.beginPath(); ctx.moveTo(px, py + r*T/3); ctx.lineTo(px+T, py + r*T/3); ctx.stroke(); const off = r%2 ? T*.5 : 0; ctx.beginPath(); ctx.moveTo(px + off + T*.25, py + r*T/3); ctx.lineTo(px + off + T*.25, py + (r+1)*T/3); ctx.stroke(); }
    ctx.fillStyle = 'rgba(210,216,232,.10)'; ctx.fillRect(px, py, T, T*.08); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(px, py + T*.8, T, T*.2); };
  const ground = () => (terr ? lawn() : gravel());
  if (ch === '#') {
    if (!battle) return terr ? dressed() : brick();
    if (terr) { lawn(); // a pillar on a square plinth
      ctx.fillStyle = 'rgba(0,0,0,.4)'; ell(ctx, px+T*.56, py+T*.86, T*.4, T*.12, 'rgba(0,0,0,.45)'); ctx.fillStyle = '#6a6e76'; ctx.fillRect(px+T*.14, py+T*.66, T*.72, T*.22); const g = ctx.createLinearGradient(px+T*.22, 0, px+T*.78, 0); g.addColorStop(0,'#9a9ea6'); g.addColorStop(.45,'#6a6e76'); g.addColorStop(1,'#2a2c32'); ctx.fillStyle = g; ctx.fillRect(px+T*.24, py-T*.1, T*.52, T*.78);
      ctx.strokeStyle = 'rgba(0,0,0,.3)'; for (let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(px+T*(.24 + i*.13), py-T*.1); ctx.lineTo(px+T*(.24 + i*.13), py+T*.66); ctx.stroke(); } ctx.fillStyle = '#8a8e96'; ctx.fillRect(px+T*.18, py-T*.14, T*.64, T*.1); return; }
    if (storm) { lawn(); if (h > .55) { // a block of ice
        poly(ctx, [[px+T*.1, py+T*.9],[px+T*.14, py+T*.3],[px+T*.4, py+T*.02],[px+T*.8, py+T*.12],[px+T*.92, py+T*.55],[px+T*.84, py+T*.92]], 'rgba(170,215,240,.75)'); poly(ctx, [[px+T*.4, py+T*.02],[px+T*.8, py+T*.12],[px+T*.6, py+T*.45],[px+T*.3, py+T*.38]], 'rgba(230,248,255,.6)');
        ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px+T*.3, py+T*.38); ctx.lineTo(px+T*.5, py+T*.8); ctx.moveTo(px+T*.6, py+T*.45); ctx.lineTo(px+T*.78, py+T*.7); ctx.stroke(); }
      else { ctx.fillStyle = '#4a4e56'; ctx.fillRect(px+T*.12, py+T*.62, T*.76, T*.28); poly(ctx, [[px+T*.3, py+T*.62],[px+T*.32, py+T*.2],[px+T*.5, py+T*.08],[px+T*.62, py+T*.3],[px+T*.66, py+T*.62]], '#6a6e76'); // a broken statue, rimed
        ell(ctx, px+T*.78, py+T*.8, T*.12, T*.07, '#5a5e66'); ctx.fillStyle = 'rgba(220,240,255,.5)'; ctx.fillRect(px+T*.3, py+T*.2, T*.3, 2); ctx.fillRect(px+T*.12, py+T*.62, T*.76, 2); } return; }
    lawn(); ch = 'h'; } // garden: a hedge block
  if (ch === '.') return lawn();
  if (ch === ',') return gravel();
  if (ch === 'h') { lawn(); const g = ctx.createLinearGradient(0, py, 0, py + T); g.addColorStop(0, storm ? '#3a5058' : '#1e3a26'); g.addColorStop(.25, storm ? '#1e2c30' : '#0f2216'); g.addColorStop(1, '#07110b');
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(px, py + T*.86, T, T*.14); ctx.fillStyle = g; ctx.fillRect(px + T*.02, py + T*.08, T*.96, T*.82);
    for (let i=0;i<9;i++) ell(ctx, px + T*(.1 + hash(x,y,i)*.8), py + T*(.2 + hash(y,x,i)*.6), T*.09, T*.06, storm ? 'rgba(40,60,66,.9)' : 'rgba(22,48,30,.9)', i);
    ctx.fillStyle = storm ? 'rgba(220,240,255,.7)' : 'rgba(150,170,90,.45)'; ctx.fillRect(px + T*.02, py + T*.08, T*.96, T*.05); // the lit top edge, or ice on it
    if (storm) for (let i=0;i<4;i++){ ctx.fillStyle = 'rgba(210,235,250,.6)'; ctx.fillRect(px + T*(.12 + i*.22), py + T*.13, 1.5, T*(.06 + hash(x,i)*.1)); } return; }
  if ((ch === 'f' || ch === 'w') && estateMap && estateBlock(estateMap, x, y)) { if (ch === 'f') ground(); else lawn(); return; } // part of a bigger fountain or pond: drawn whole in the second pass
  if (ch === 'f') { ground(); ell(ctx, px+T*.5, py+T*.62, T*.46, T*.3, 'rgba(0,0,0,.4)'); ell(ctx, px+T*.5, py+T*.56, T*.44, T*.3, '#6a6e72'); ell(ctx, px+T*.5, py+T*.54, T*.36, T*.23, storm ? '#b8d4e2' : '#0c2230');
    if (!storm) { ell(ctx, px+T*.42, py+T*.5, T*.14, T*.05, 'rgba(120,170,200,.25)'); } else { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.moveTo(px+T*.25, py+T*.5); ctx.lineTo(px+T*.5, py+T*.58); ctx.lineTo(px+T*.72, py+T*.48); ctx.stroke(); }
    ctx.fillStyle = '#7a7e84'; ctx.fillRect(px+T*.45, py+T*.2, T*.1, T*.34); ell(ctx, px+T*.5, py+T*.22, T*.14, T*.06, '#8a8e94'); ell(ctx, px+T*.5, py+T*.2, T*.1, T*.035, storm ? '#d8ecf6' : '#10283a'); return; }
  if (ch === 'l') { ground(); ell(ctx, px+T*.5, py+T*.9, T*.14, T*.05, 'rgba(0,0,0,.5)'); ctx.fillStyle = '#2a2018'; ctx.fillRect(px+T*.46, py+T*.1, T*.08, T*.8); ctx.fillStyle = '#3a2c1e'; ctx.fillRect(px+T*.18, py+T*.12, T*.64, T*.05);
    ctx.strokeStyle = 'rgba(140,120,90,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px+T*.2, py+T*.16); ctx.quadraticCurveTo(px+T*.5, py+T*.3, px+T*.8, py+T*.16); ctx.stroke();
    if (storm) for (let i=0;i<4;i++){ const lx = px + T*(.24 + i*.17), ly = py + T*(.26 + (i%2)*.04); ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.moveTo(lx, ly - T*.06); ctx.lineTo(lx + (hash(x,i)-.5)*T*.1, ly + T*.08); ctx.stroke(); // torn paper, dead
      poly(ctx, [[lx - T*.05, ly],[lx + T*.04, ly - T*.02],[lx + T*.06, ly + T*.1],[lx - T*.02, ly + T*.14]], ['#5a2a24','#5a4a24','#2a4a34','#2a345a'][i]); ctx.fillStyle = 'rgba(220,240,255,.5)'; ctx.fillRect(lx - T*.05, ly, T*.1, 1); }
    return; }
  if (ch === 'b') { ground(); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(px, py+T*.78, T, T*.12); ctx.fillStyle = '#5e626a'; ctx.fillRect(px, py+T*.68, T, T*.12); ctx.fillStyle = '#8a8e96'; ctx.fillRect(px, py+T*.26, T, T*.1); ctx.fillStyle = 'rgba(220,226,240,.2)'; ctx.fillRect(px, py+T*.26, T, 2);
    for (let i=0;i<4;i++){ const bx = px + T*(.125 + i*.25); ctx.fillStyle = '#6e727a'; ell(ctx, bx, py+T*.46, T*.06, T*.1, '#767a82'); ctx.fillRect(bx - T*.03, py+T*.36, T*.06, T*.32); ell(ctx, bx, py+T*.62, T*.05, T*.04, '#5e626a'); }
    if (storm) { ctx.fillStyle = 'rgba(225,245,255,.6)'; ctx.fillRect(px, py+T*.24, T, 2); } return; }
  if (ch === 's') { ground(); ell(ctx, px+T*.6, py+T*.9, T*.36, T*.08, 'rgba(0,0,0,.5)'); ctx.fillStyle = '#4e525a'; ctx.fillRect(px+T*.2, py+T*.6, T*.6, T*.3); ctx.fillStyle = '#6a6e76'; ctx.fillRect(px+T*.16, py+T*.56, T*.68, T*.07);
    const g = ctx.createLinearGradient(px+T*.3, 0, px+T*.7, 0); g.addColorStop(0, '#b0b4bc'); g.addColorStop(1, '#4a4e56'); poly(ctx, [[px+T*.3, py+T*.56],[px+T*.36, py+T*.22],[px+T*.44, py+T*.12],[px+T*.56, py+T*.12],[px+T*.62, py+T*.24],[px+T*.7, py+T*.56]], g); // a robed figure
    ell(ctx, px+T*.5, py+T*.08, T*.07, T*.07, '#9a9ea6'); ctx.strokeStyle = '#8a8e96'; ctx.lineWidth = T*.05; ctx.beginPath(); ctx.moveTo(px+T*.6, py+T*.26); ctx.lineTo(px+T*.76, py+T*.02); ctx.stroke(); // an arm raised, holding nothing
    if (storm) { ctx.fillStyle = 'rgba(225,245,255,.55)'; ctx.fillRect(px+T*.36, py+T*.22, T*.26, 2); ctx.fillRect(px+T*.16, py+T*.56, T*.68, 2); } return; }
  if (ch === 't') { ground(); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(px+T*.06, py+T*.8, T*.9, T*.12); ctx.fillStyle = '#d8d4c8'; ctx.fillRect(px+T*.04, py+T*.34, T*.92, T*.4); ctx.fillStyle = '#b8b2a4'; ctx.fillRect(px+T*.04, py+T*.62, T*.92, T*.16); // cloth and drape
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; for (let i=1;i<5;i++){ ctx.beginPath(); ctx.moveTo(px + T*i*.2, py+T*.62); ctx.lineTo(px + T*i*.2, py+T*.78); ctx.stroke(); }
    ell(ctx, px+T*.28, py+T*.48, T*.1, T*.05, '#e8e2d4'); ell(ctx, px+T*.28, py+T*.47, T*.06, T*.03, '#7a2a1e'); ell(ctx, px+T*.62, py+T*.5, T*.11, T*.05, '#c9a44a'); ell(ctx, px+T*.62, py+T*.49, T*.07, T*.03, '#6a4a2a'); // dishes
    ctx.fillStyle = '#4a1a24'; ctx.fillRect(px+T*.8, py+T*.3, T*.08, T*.18); ell(ctx, px+T*.84, py+T*.3, T*.05, T*.02, '#6a2a34'); // a wine jug
    ctx.fillStyle = '#e8e0c8'; ctx.fillRect(px+T*.46, py+T*.26, T*.04, T*.12); if (!storm) { ell(ctx, px+T*.48, py+T*.23, T*.02, T*.04, '#ffd890'); } return; } // a candle
  if (ch === 'w') { ground(); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px+T*.02, py+T*.06, T*.96, T*.9, T*.3) : ctx.rect(px+T*.02, py+T*.06, T*.96, T*.9); ctx.fill();
    ctx.fillStyle = storm ? '#9ab8c8' : '#081820'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px+T*.06, py+T*.08, T*.88, T*.84, T*.28) : ctx.rect(px+T*.06, py+T*.08, T*.88, T*.84); ctx.fill();
    if (!storm) { ell(ctx, px+T*.4, py+T*.35, T*.2, T*.04, 'rgba(90,130,170,.18)'); [[.3,.6,.12],[.68,.4,.1],[.62,.72,.08]].forEach(([a,b,r],i) => { ctx.fillStyle = '#1e3a22'; ctx.beginPath(); ctx.arc(px+T*a, py+T*b, T*r, .4, 6.0); ctx.lineTo(px+T*a, py+T*b); ctx.fill(); if (i === 0) ell(ctx, px+T*a + T*.03, py+T*b - T*.03, T*.03, T*.03, '#d8c0d0'); }); }
    else { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px+T*.15, py+T*.3); ctx.lineTo(px+T*.45, py+T*.55); ctx.lineTo(px+T*.4, py+T*.85); ctx.moveTo(px+T*.45, py+T*.55); ctx.lineTo(px+T*.85, py+T*.5); ctx.stroke(); } return; }
  if (ch === 'T') { lawn(); ell(ctx, px+T*.62, py+T*.82, T*.42, T*.14, 'rgba(0,0,0,.5)'); ctx.fillStyle = '#1e1610'; ctx.fillRect(px+T*.44, py+T*.46, T*.12, T*.42); return; } // the canopy goes on in the second pass
  if (ch === 'A') { lawn(); return; } // the sapling, or the house, in the second pass
  if (ch === 'D') { terr ? dressed() : brick(); ctx.fillStyle = '#0c0806'; ctx.fillRect(px+T*.16, py+T*.08, T*.68, T*.86); ctx.fillStyle = '#3a2412'; ctx.fillRect(px+T*.2, py+T*.12, T*.6, T*.82);
    ctx.fillStyle = storm ? 'rgba(150,170,190,.35)' : 'rgba(255,196,110,.9)'; ctx.beginPath(); ctx.arc(px+T*.5, py+T*.3, T*.24, Math.PI, 0); ctx.fill(); ctx.fillRect(px+T*.26, py+T*.3, T*.48, T*.16); // a fanlight, lit
    ctx.strokeStyle = '#1a1008'; ctx.lineWidth = 1.2; for (let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(px+T*.5, py+T*.3); ctx.lineTo(px+T*.5 + Math.sin(i*.6)*T*.24, py+T*.3 - Math.cos(i*.6)*T*.24); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(px+T*.5, py+T*.3); ctx.lineTo(px+T*.5, py+T*.94); ctx.stroke();
    ctx.fillStyle = '#c9a44a'; ctx.fillRect(px+T*.4, py+T*.62, T*.05, T*.05); ctx.fillStyle = '#6a6e76'; ctx.fillRect(px+T*.1, py+T*.92, T*.8, T*.08); return; }
  if (ch === 'g') { ground(); ctx.fillStyle = '#0a0c0e'; ctx.fillRect(px+T*.1, py+T*.14, T*.8, T*.78); ctx.fillStyle = terr ? '#6a6e76' : '#2e2220'; ctx.fillRect(px, py, T*.12, T); ctx.fillRect(px+T*.88, py, T*.12, T); ell(ctx, px+T*.06, py+T*.02, T*.1, T*.06, '#8a8e96'); ell(ctx, px+T*.94, py+T*.02, T*.1, T*.06, '#8a8e96');
    ctx.strokeStyle = '#2e3236'; ctx.lineWidth = Math.max(1.5, T*.045); for (let i=0;i<6;i++){ const bx = px + T*(.19 + i*.125); ctx.beginPath(); ctx.moveTo(bx, py+T*.92); ctx.lineTo(bx, py+T*.12); ctx.stroke(); poly(ctx, [[bx - T*.03, py+T*.14],[bx, py+T*.04],[bx + T*.03, py+T*.14]], '#4a4e52'); }
    ctx.lineWidth = Math.max(1, T*.03); ctx.beginPath(); ctx.moveTo(px+T*.12, py+T*.3); ctx.lineTo(px+T*.88, py+T*.3); ctx.moveTo(px+T*.12, py+T*.8); ctx.lineTo(px+T*.88, py+T*.8); ctx.stroke(); ctx.strokeStyle = 'rgba(160,170,180,.25)'; ctx.beginPath(); ctx.arc(px+T*.5, py+T*.55, T*.14, 0, 7); ctx.stroke(); return; }
  lawn(); exitArrow(ctx, ch, px, py, T);
}
/* second pass for the estate: tree canopies and the sapling spill over their neighbours */
function drawEstateOver(ctx, ch, x, y, T, mode, map){
  const px = x*T, py = y*T, storm = mode === 'storm';
  if ((ch === 'f' || ch === 'w') && map) { const bk = estateBlock(map, x, y); if (bk && bk !== 'part') { const cx = (x + bk.w/2)*T, cy = (y + bk.h/2)*T, rw = bk.w*T/2, rh = bk.h*T/2;
    if (ch === 'f') { ell(ctx, cx + T*.06, cy + T*.1, rw*.96, rh*.8, 'rgba(0,0,0,.45)'); ell(ctx, cx, cy, rw*.94, rh*.78, '#6a6e72'); ell(ctx, cx, cy - rh*.04, rw*.8, rh*.62, storm ? '#b8d4e2' : '#0c2230'); ell(ctx, cx, cy - rh*.02, rw*.82, rh*.64, 'rgba(0,0,0,0)'); // the great basin
      if (!storm) { ell(ctx, cx - rw*.3, cy - rh*.2, rw*.28, rh*.08, 'rgba(120,170,200,.22)'); ell(ctx, cx + rw*.25, cy + rh*.25, rw*.2, rh*.06, 'rgba(120,170,200,.14)'); } else { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - rw*.6, cy); ctx.lineTo(cx - rw*.1, cy + rh*.2); ctx.lineTo(cx + rw*.5, cy - rh*.1); ctx.moveTo(cx - rw*.1, cy + rh*.2); ctx.lineTo(cx, cy + rh*.5); ctx.stroke(); }
      ell(ctx, cx, cy + T*.05, T*.34, T*.14, '#5a5e64'); ctx.fillStyle = '#7a7e84'; ctx.fillRect(cx - T*.09, cy - T*.62, T*.18, T*.66); ell(ctx, cx, cy - T*.3, T*.3, T*.1, '#8a8e94'); ell(ctx, cx, cy - T*.32, T*.24, T*.07, storm ? '#d8ecf6' : '#10283a'); // a tiered bowl
      ell(ctx, cx, cy - T*.64, T*.14, T*.06, '#9a9ea4'); ell(ctx, cx, cy - T*.66, T*.09, T*.035, storm ? '#e8f4fa' : '#123046'); if (storm) for (let i=0;i<5;i++) poly(ctx, [[cx - T*.3 + i*T*.15, cy - T*.3],[cx - T*.27 + i*T*.15, cy - T*.1],[cx - T*.24 + i*T*.15, cy - T*.3]], 'rgba(220,240,255,.85)'); } // icicles
    else { ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - rw + 2, cy - rh + 4, rw*2 - 2, rh*2 - 4, T*.5) : ctx.rect(cx - rw + 2, cy - rh + 4, rw*2 - 2, rh*2 - 4); ctx.fill();
      ctx.fillStyle = '#5a5e62'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - rw + 2, cy - rh + 2, rw*2 - 4, rh*2 - 4, T*.5) : ctx.rect(cx - rw + 2, cy - rh + 2, rw*2 - 4, rh*2 - 4); ctx.fill(); // stone edging
      const g = ctx.createLinearGradient(0, cy - rh, 0, cy + rh); g.addColorStop(0, storm ? '#aac4d2' : '#0e2430'); g.addColorStop(1, storm ? '#8aa8b8' : '#05121a'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - rw + T*.14, cy - rh + T*.14, rw*2 - T*.28, rh*2 - T*.28, T*.4) : ctx.rect(cx - rw + T*.14, cy - rh + T*.14, rw*2 - T*.28, rh*2 - T*.28); ctx.fill();
      if (!storm) { ell(ctx, cx - rw*.2, cy - rh*.45, rw*.4, T*.05, 'rgba(90,130,170,.2)'); for (let i=0;i<5 + bk.w*bk.h;i++){ const lx = cx + (hash(x,i,3) - .5)*rw*1.4, ly = cy + (hash(i,y,4) - .5)*rh*1.3, r = T*(.08 + hash(i,x,5)*.06); ctx.fillStyle = i%2 ? '#1e3a22' : '#24462a'; ctx.beginPath(); ctx.arc(lx, ly, r, .4, 6.0); ctx.lineTo(lx, ly); ctx.fill(); if (i%3 === 0) ell(ctx, lx + r*.3, ly - r*.3, r*.35, r*.35, '#d8c0d0'); } } // lily pads, a flower or two
      else { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; for (let i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(cx + (hash(i,1)-.5)*rw*1.4, cy - rh*.6); ctx.lineTo(cx + (hash(i,2)-.5)*rw, cy + (hash(i,3)-.5)*rh); ctx.lineTo(cx + (hash(i,4)-.5)*rw*1.4, cy + rh*.6); ctx.stroke(); } } }
    return; } }
  if (ch === 'T') { for (let i=0;i<9;i++){ const a = i/9*6.28 + hash(x,y,i), r = T*(.2 + hash(x,y,i+9)*.22); ell(ctx, px+T*.5 + Math.cos(a)*T*.3, py+T*.18 + Math.sin(a)*T*.24, r, r*.8, i%2 ? (storm ? '#1c2a30' : '#0c1e14') : (storm ? '#24343a' : '#12281a')); }
    ell(ctx, px+T*.5, py+T*.16, T*.34, T*.28, storm ? '#2a3a42' : '#153020'); for (let i=0;i<6;i++) ell(ctx, px+T*(.2 + hash(x,y,i+20)*.6), py+T*(-.1 + hash(y,x,i+21)*.35), T*.08, T*.05, storm ? 'rgba(220,240,255,.45)' : 'rgba(90,130,70,.35)'); return; }
  if (ch === 'A') { const cx = px+T*.5, cy = py+T*.72;
    if (typeof S !== 'undefined' && S && S.f && S.f.c6_azath) { // the young Azath: a small, wrong house of living wood, rooted in the lawn
      ctx.strokeStyle = '#1a120c'; ctx.lineWidth = Math.max(1.5, T*.06); for (let i=0;i<7;i++){ const a = i/7*6.28 + .3; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a)*T*.2, cy + Math.sin(a)*T*.08); ctx.quadraticCurveTo(cx + Math.cos(a)*T*.6, cy + Math.sin(a)*T*.3 + T*.1, cx + Math.cos(a)*T*(.9 + hash(x,i)*.3), cy + Math.sin(a)*T*.45 + T*.05); ctx.stroke(); }
      [[-.9,.25],[.95,.1],[-.5,.6],[.6,.55]].forEach(([dx,dy]) => ell(ctx, cx + dx*T, cy + dy*T, T*.18, T*.08, '#241a12')); // the yard of mounds
      ell(ctx, cx, cy + T*.1, T*.5, T*.14, 'rgba(0,0,0,.5)');
      const w = T*.5; poly(ctx, [[cx - w, cy],[cx - w*.92, cy - T*.62],[cx + w*.95, cy - T*.66],[cx + w, cy + T*.02]], '#2e2016'); // walls, leaning
      poly(ctx, [[cx - w*1.2, cy - T*.56],[cx - T*.05, cy - T*1.2],[cx + w*1.15, cy - T*.62]], '#1a120c'); poly(ctx, [[cx - T*.05, cy - T*1.2],[cx + w*1.15, cy - T*.62],[cx + w*.6, cy - T*.6]], '#120c08'); // the peaked roof
      ctx.strokeStyle = 'rgba(90,70,50,.6)'; ctx.lineWidth = 1; for (let i=0;i<5;i++){ ctx.beginPath(); ctx.moveTo(cx - w + i*w*.45, cy); ctx.bezierCurveTo(cx - w + i*w*.45 + 3, cy - T*.2, cx - w + i*w*.45 - 3, cy - T*.4, cx - w + i*w*.45 + 1, cy - T*.62); ctx.stroke(); } // grain, growing
      ctx.fillStyle = '#060404'; ctx.fillRect(cx - T*.08, cy - T*.3, T*.16, T*.3); ctx.fillStyle = 'rgba(160,220,150,.55)'; ctx.fillRect(cx + T*.18, cy - T*.46, T*.12, T*.1); // a door, a window
      return; }
    ell(ctx, cx, cy, T*.36, T*.14, '#1e140e'); for (let i=0;i<8;i++) ell(ctx, cx + (hash(x,y,i)-.5)*T*.6, cy + (hash(y,x,i)-.5)*T*.2, T*.05, T*.03, '#2e2016'); // turned earth
    ctx.strokeStyle = '#0a0706'; ctx.lineWidth = Math.max(1.4, T*.05); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.bezierCurveTo(cx - T*.1, cy - T*.2, cx + T*.1, cy - T*.3, cx - T*.02, cy - T*.55); ctx.stroke(); // a black, twisted young tree
    ctx.lineWidth = Math.max(1, T*.03); [[-.2,-.5,-.34,-.62],[.02,-.42,.24,-.58],[-.04,-.3,-.26,-.34],[.04,-.52,.12,-.74]].forEach(([a,b,c,d]) => { ctx.beginPath(); ctx.moveTo(cx + a*T*.3, cy + b*T); ctx.quadraticCurveTo(cx + (a+c)*T*.5, cy + (b+d)*T*.5 - T*.05, cx + c*T, cy + d*T); ctx.stroke(); }); ctx.lineCap = 'butt'; }
}
function drawTile(ctx, ch, x, y, T, dark, tunnel, style){
  const px = x*T, py = y*T, h = hash(x,y);
  const plain = style && (style.startsWith('plain') || style.startsWith('hills'));
  const est = style && (style.startsWith('estate') || style === 'garden' || style === 'terrace' || style === 'storm');
  if (est) return drawEstateTile(ctx, ch, x, y, T, style.endsWith('terrace') ? 'terrace' : style.endsWith('storm') ? 'storm' : 'night', !style.startsWith('estate'));
  const lake = style === 'lakefront', dock = style === 'dock';
  const city = style && (style.startsWith('city') || style === 'cellar' || lake || dock), cellar = style === 'cellar';
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
    exitArrow(ctx, ch, px, py, T);
    return; }
  if (dock && ch === '#') { fill('#0a1218'); ctx.strokeStyle = 'rgba(120,160,190,.14)'; ctx.lineWidth = 1; for (let i=0;i<4;i++){ const yy = py + T*(.15 + i*.24) + hash(x,y,i)*3; ctx.beginPath(); ctx.moveTo(px + hash(x,y,i+5)*T*.3, yy); ctx.quadraticCurveTo(px + T*.5, yy - 2, px + T*(.7 + hash(x,y,i+6)*.3), yy); ctx.stroke(); } // lake water, it blocks
    ctx.fillStyle = 'rgba(200,150,120,.1)'; ctx.fillRect(px + hash(x,y,9)*T*.6, py + hash(x,y,8)*T, T*.3, 1); return; }
  if (dock && ch === ',') { fill('#2a2016'); ctx.fillStyle = '#3a2c1e'; for (let i=0;i<4;i++) ctx.fillRect(px + 1, py + i*T/4 + 1, T - 2, T/4 - 2); ctx.fillStyle = '#060a0e'; for (let i=1;i<4;i++) ctx.fillRect(px, py + i*T/4 - 1, T, 1.5); // pier planks, wet
    ctx.fillStyle = 'rgba(0,0,0,.5)'; for (let i=0;i<4;i++){ ctx.fillRect(px + T*.12, py + i*T/4 + T*.1, 1.5, 1.5); ctx.fillRect(px + T*.86, py + i*T/4 + T*.1, 1.5, 1.5); } ctx.fillStyle = 'rgba(160,190,220,.07)'; ctx.fillRect(px, py, T, T*.5); return; }
  if (ch === '#' && city) { // brick and mortar, or the cellar's cut stone
    fill(cellar ? '#0e0c0b' : lake ? shade('#1a1e24', clamp(x/15,0,1)*.1) : dark ? '#100e10' : '#1a1614');
    ctx.fillStyle = cellar ? '#1e1a17' : lake ? shade('#2c323a', clamp(x/15,0,1)*.16) : dark ? '#221c1e' : '#2e2622'; const bh = T*.22, bw = T*.5;
    for (let r=0;r<4;r++){ const off = (r%2)*bw*.5; for (let c=-1;c<3;c++){ const bx = px + c*bw + off + 1, by = py + r*bh + 1; ctx.fillRect(Math.max(px,bx), by, Math.min(bw-2, px+T-bx), bh-2); } }
    if (!cellar && hash(x,y,3) > .7) { ctx.fillStyle = lake ? `rgba(232,${150 + Math.round(x*4)},110,${.06 + x*.008})` : dark ? 'rgba(90,140,210,.10)' : 'rgba(232,192,115,.12)'; ctx.fillRect(px+T*.3, py+T*.25, T*.4, T*.35); ctx.fillStyle = '#0a0808'; ctx.fillRect(px+T*.48, py+T*.25, T*.04, T*.35); } // a window, lit or not
    return; }
  if (city && ch !== '#' && ch !== '~' && ch !== 'n') {
    const warm = lake ? clamp(x/15, 0, 1) : 0; // the lakefront at dawn: blue-grey stone warming toward the east
    fill(lake || dock ? (ch === ',' ? shade('#2c343e', warm*.12) : shade('#3a3f46', warm*.14 + (h - .5)*.06)) : cellar ? (ch === ',' ? '#1a1815' : '#221e1a') : dark ? (ch === ',' ? '#171a20' : '#1e1e22') : (ch === ',' ? '#2a2c30' : '#33312f'));
    ctx.strokeStyle = cellar ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.45)'; ctx.lineWidth = 1; const cw = T*.34, chh = T*.25; // cobbles
    for (let r=0;r<4;r++){ const off = (r%2)*cw*.5; for (let c=-1;c<4;c++){ const bx = px + c*cw + off, by = py + r*chh; ctx.beginPath(); ctx.ellipse(bx + cw*.5, by + chh*.5, cw*.46, chh*.42, 0, 0, 7); ctx.stroke(); } }
    if (ch === ',' && (lake || dock)) { ell(ctx, px+T*.45, py+T*.5, T*.4, T*.22, 'rgba(210,160,150,.12)'); ell(ctx, px+T*.6, py+T*.7, T*.2, T*.08, 'rgba(160,190,220,.12)'); } // wet stone, the dawn in it
    else if (ch === ',') { ctx.fillStyle = dark ? 'rgba(90,140,210,.16)' : 'rgba(180,190,200,.12)'; ell(ctx, px+T*.5, py+T*.55, T*.36, T*.2, dark ? 'rgba(90,140,210,.16)' : 'rgba(180,190,200,.12)'); } // a puddle
    if (dock && ch === '.' ) { ctx.fillStyle = 'rgba(150,180,210,.08)'; ctx.fillRect(px, py + T*.6, T, T*.4); }
    if (h > .85) speck('#0a0908', 3, 7, .08);
    if (ch === 'L') { ctx.fillStyle = '#1a1a1c'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.72); ctx.fillStyle = '#2e2e32'; ctx.fillRect(px+T*.36, py+T*.1, T*.28, T*.22); ctx.fillStyle = lake ? (hash(x,y,7) > .5 ? 'rgba(60,80,110,.9)' : 'rgba(110,160,230,.55)') : 'rgba(120,180,255,.85)'; ctx.fillRect(px+T*.42, py+T*.14, T*.16, T*.14); }
    if (ch === 'l') { ell(ctx, px+T*.5, py+T*.9, T*.14, T*.05, 'rgba(0,0,0,.5)'); ctx.fillStyle = '#2a2018'; ctx.fillRect(px+T*.45, py+T*.08, T*.1, T*.84); ctx.fillStyle = '#4a3a26'; ctx.fillRect(px+T*.4, py+T*.06, T*.2, T*.05); // a Fete pole, a string across the street
      ctx.strokeStyle = 'rgba(160,140,100,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px - T*.02, py+T*.12); ctx.quadraticCurveTo(px+T*.25, py+T*.3, px+T*.5, py+T*.1); ctx.quadraticCurveTo(px+T*.75, py+T*.3, px+T*1.02, py+T*.12); ctx.stroke(); }
    if (ch === 'g') { ctx.fillStyle = '#08090a'; ctx.fillRect(px+T*.1, py+T*.14, T*.8, T*.78); ctx.fillStyle = '#2e2622'; ctx.fillRect(px, py, T*.12, T); ctx.fillRect(px+T*.88, py, T*.12, T); ctx.fillStyle = '#4a403a'; ctx.fillRect(px - 1, py, T*.14, T*.06); ctx.fillRect(px+T*.87, py, T*.14, T*.06);
      ctx.strokeStyle = '#34383c'; ctx.lineWidth = Math.max(1.5, T*.045); for (let i=0;i<6;i++){ const bx = px + T*(.19 + i*.125); ctx.beginPath(); ctx.moveTo(bx, py+T*.92); ctx.lineTo(bx, py+T*.12); ctx.stroke(); poly(ctx, [[bx - T*.03, py+T*.14],[bx, py+T*.04],[bx + T*.03, py+T*.14]], '#50565a'); }
      ctx.lineWidth = Math.max(1, T*.03); ctx.beginPath(); ctx.moveTo(px+T*.12, py+T*.3); ctx.lineTo(px+T*.88, py+T*.3); ctx.moveTo(px+T*.12, py+T*.8); ctx.lineTo(px+T*.88, py+T*.8); ctx.stroke(); ctx.fillStyle = 'rgba(232,192,115,.35)'; ctx.fillRect(px+T*.12, py+T*.5, T*.76, T*.04); }
    if (ch === 'p') { fill('#2a2016'); ctx.fillStyle = '#3e2e1e'; for (let i=0;i<4;i++) ctx.fillRect(px + i*T/4 + 1, py, T/4 - 2, T); ctx.fillStyle = '#081016'; for (let i=1;i<4;i++) ctx.fillRect(px + i*T/4 - 1, py, 1.5, T); // pier planks, the lake under the gaps
      ctx.fillStyle = 'rgba(0,0,0,.55)'; for (let i=0;i<4;i++){ ctx.fillRect(px + i*T/4 + T*.1, py + T*.12, 1.5, 1.5); ctx.fillRect(px + i*T/4 + T*.1, py + T*.84, 1.5, 1.5); } ctx.fillStyle = lake ? 'rgba(220,170,140,.08)' : 'rgba(160,190,220,.06)'; ctx.fillRect(px, py, T, T*.3); }
    if (ch === 'k') { ell(ctx, px+T*.52, py+T*.78, T*.24, T*.1, 'rgba(0,0,0,.5)'); ctx.fillStyle = '#1e1e22'; ctx.fillRect(px+T*.36, py+T*.34, T*.28, T*.44); ell(ctx, px+T*.5, py+T*.34, T*.16, T*.07, '#3a3a40'); ell(ctx, px+T*.5, py+T*.33, T*.12, T*.05, '#4a4a52'); // a bollard, with rope
      ctx.strokeStyle = '#8a7450'; ctx.lineWidth = Math.max(1.5, T*.05); ctx.beginPath(); ctx.ellipse(px+T*.5, py+T*.52, T*.17, T*.07, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(px+T*.66, py+T*.54); ctx.quadraticCurveTo(px+T*.9, py+T*.7, px+T*1.02, py+T*.46); ctx.stroke(); }
    if (ch === 'D') { ctx.fillStyle = '#0a0806'; ctx.fillRect(px+T*.18, py+T*.1, T*.64, T*.82); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(px+T*.22, py+T*.14, T*.56, T*.74); ctx.fillStyle = '#1a1208'; ctx.fillRect(px+T*.49, py+T*.14, T*.02, T*.74); ctx.fillStyle = '#c9a44a'; ctx.fillRect(px+T*.4, py+T*.52, T*.06, T*.06); ctx.fillStyle = 'rgba(232,192,115,.18)'; ctx.fillRect(px+T*.22, py+T*.14, T*.56, T*.1); }
    if (ch === 'H') { ell(ctx, px+T*.5, py+T*.55, T*.42, T*.3, '#050404'); ell(ctx, px+T*.5, py+T*.5, T*.36, T*.22, '#000'); ctx.fillStyle = '#3a3230'; for (let i=0;i<6;i++){ const a = i/6*6.28; ctx.fillRect(px+T*.5 + Math.cos(a)*T*.44 - 2, py+T*.55 + Math.sin(a)*T*.32 - 1, 4, 3); } }
    if (ch === 'B') { ctx.fillStyle = '#2a1e12'; ctx.fillRect(px+T*.1, py+T*.35, T*.5, T*.5); ctx.fillStyle = '#4a3622'; ctx.fillRect(px+T*.1, py+T*.35, T*.5, T*.08); ctx.fillRect(px+T*.1, py+T*.6, T*.5, T*.05); ctx.fillStyle = '#3a2c1c'; ctx.fillRect(px+T*.5, py+T*.15, T*.4, T*.4); ctx.fillStyle = '#6b5a3c'; ctx.fillRect(px+T*.5, py+T*.15, T*.4, T*.06); ctx.fillStyle = '#8fa38a'; ctx.fillRect(px+T*.6, py+T*.28, T*.2, T*.12); /* a Moranth seal */ }
    if (ch === 'S') { for (let i=0;i<4;i++){ ctx.fillStyle = i%2 ? '#2a2622' : '#1a1714'; ctx.fillRect(px+T*.1, py+T*.15+i*T*.2, T*.8, T*.18); } ctx.fillStyle = 'rgba(232,192,115,.2)'; ctx.fillRect(px+T*.1, py+T*.1, T*.8, T*.1); }
    if (ch === 'W') { ctx.fillStyle = '#3c2d1e'; ctx.fillRect(px+T*.12, py+T*.3, T*.76, T*.4); ctx.fillStyle = '#5a4630'; ctx.fillRect(px+T*.12, py+T*.3, T*.76, T*.08); ell(ctx, px+T*.28, py+T*.76, T*.11, T*.11, '#15100a'); ell(ctx, px+T*.72, py+T*.76, T*.11, T*.11, '#15100a'); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(px+T*.2, py+T*.16, T*.6, T*.16); }
    if (ch === 'x') { ctx.fillStyle = '#3a2a18'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.7); ctx.fillStyle = '#6b5a3c'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.1); ctx.strokeStyle = 'rgba(120,100,70,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py+T*.35); ctx.lineTo(px+T, py+T*.35); ctx.stroke(); }
    if (ch === 'F') { for (let i=0;i<7;i++){ const a = i/7*6.28; ell(ctx, px+T/2 + Math.cos(a)*T*.32, py+T*.6 + Math.sin(a)*T*.2, T*.07, T*.05, '#3a3128'); } ell(ctx, px+T/2, py+T*.6, T*.16, T*.08, '#1a1008'); }
    if (ch === 'r') { ell(ctx, px+T*.5, py+T*.62, T*.3, T*.2, '#3a3630'); ell(ctx, px+T*.44, py+T*.56, T*.2, T*.14, '#57534c'); }
    exitArrow(ctx, ch, px, py, T);
    return; }
  if (city && (ch === '~' || ch === 'n')) { // the lake: dark water with a little light moving on it (the moving part is drawn live)
    fill(lake ? '#121c26' : '#0a1016'); const g = ctx.createLinearGradient(px, py, px, py + T); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.25)'); ctx.fillStyle = g; ctx.fillRect(px, py, T, T);
    ctx.strokeStyle = lake ? 'rgba(200,170,160,.14)' : 'rgba(90,140,210,.12)'; ctx.lineWidth = 1; for (let i=0;i<3;i++){ const yy = py + T*(.2 + i*.3) + hash(x,y,i)*4; ctx.beginPath(); ctx.moveTo(px + hash(x,y,i+4)*T*.4, yy); ctx.lineTo(px + T*(.5 + hash(x,y,i+7)*.5), yy); ctx.stroke(); }
    if (ch === 'n') { ell(ctx, px+T*.5, py+T*.66, T*.46, T*.12, 'rgba(0,0,0,.4)'); poly(ctx, [[px+T*.04, py+T*.42],[px+T*.96, py+T*.38],[px+T*.84, py+T*.66],[px+T*.16, py+T*.68]], '#2e2216'); poly(ctx, [[px+T*.04, py+T*.42],[px+T*.96, py+T*.38],[px+T*.94, py+T*.44],[px+T*.06, py+T*.48]], '#5a4630'); // a moored boat
      ctx.fillStyle = '#1a120c'; ctx.fillRect(px+T*.2, py+T*.46, T*.6, T*.06); ctx.fillStyle = '#3a2c1c'; ctx.fillRect(px+T*.47, py+T*.02, T*.06, T*.42); ctx.fillRect(px+T*.3, py+T*.14, T*.36, T*.03); // the mast stub
      ctx.strokeStyle = 'rgba(160,140,100,.6)'; ctx.beginPath(); ctx.moveTo(px+T*.5, py+T*.04); ctx.lineTo(px+T*.08, py+T*.42); ctx.moveTo(px+T*.9, py+T*.4); ctx.quadraticCurveTo(px+T, py+T*.2, px+T*1.05, py+T*.1); ctx.stroke(); }
    return; }
  if (ch === '#' && plain) { fill(dark ? '#0f130c' : '#1e2616'); for (let i=0;i<5;i++){ const a = hash(x,y,i), b = hash(x,y,i+5), r = T*(.14 + hash(x,y,i+11)*.16); ell(ctx, px + (.15 + a*.7)*T, py + (.25 + b*.6)*T, r, r*.7, dark ? '#101508' : '#243019'); ell(ctx, px + (.15 + a*.7)*T - r*.25, py + (.25 + b*.6)*T - r*.25, r*.5, r*.35, dark ? '#16200c' : '#334523'); } return; }
  if (ch === '#') { fill(dark ? '#0c0a0a' : tunnel ? '#151110' : '#171310');
    for (let i=0;i<4;i++){ const a=hash(x,y,i), b=hash(x,y,i+5), r = T*(.16 + hash(x,y,i+11)*.14); const g = ctx.createRadialGradient(px+(.2+a*.6)*T - r*.3, py+(.2+b*.6)*T - r*.3, 1, px+(.2+a*.6)*T, py+(.2+b*.6)*T, r); g.addColorStop(0, dark ? '#2a2426' : '#43372e'); g.addColorStop(1, dark ? '#0a0909' : '#130f0d'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(px+(.2+a*.6)*T, py+(.2+b*.6)*T, r, r*.7, a*3, 0, 7); ctx.fill(); }
    if (tunnel && hash(x,y,3) > .6) { ctx.fillStyle = '#2a1e12'; ctx.fillRect(px + T*.1, py, T*.12, T); } return; }
  const base = plain ? (ch === ',' ? '#4f5a34' : '#4a5232') : ch === ',' ? (tunnel ? '#29231e' : '#37302a') : tunnel ? '#26211c' : '#332b23';
  fill(dark ? shade(base, -.4 + (h - .5)*.04) : shade(base, (h - .5) * .06)); // gentle per tile; the broad light and dark comes from the mottling pass in prerender
  if (plain) { ctx.strokeStyle = dark ? 'rgba(90,110,60,.35)' : 'rgba(120,140,70,.5)'; ctx.lineWidth = 1; const n = ch === ',' ? 7 : 3; for (let i=0;i<n;i++){ const gx = px + hash(x,y,i+20)*T, gy = py + T*.3 + hash(y,x,i+30)*T*.7, gh = T*(ch === ',' ? .35 : .18); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx + 2, gy - gh*.6, gx + (hash(x,y,i+40)-.5)*4, gy - gh); ctx.stroke(); } }
  else { speck(ch === ',' ? '#5e574f' : '#3f362e', 4); if (ch === ',') for (let i=0;i<3;i++) ell(ctx, px + T*(.25 + hash(x,y,i+80)*.5), py + T*(.25 + hash(y,x,i+80)*.5), T*(.14 + hash(x,y,i+83)*.12), T*(.08 + hash(x,y,i+84)*.06), 'rgba(150,140,128,.1)', hash(x,y,i+85)*3); } // ash lying in drifts
  if (ch === 'T' && !tunnel && !plain) { const g = ctx.createLinearGradient(0, py + T*.2, 0, py + T*.95); g.addColorStop(0, '#020101'); g.addColorStop(1, '#120d0a'); ctx.fillStyle = g; ctx.fillRect(px+T*.16, py+T*.2, T*.68, T*.75); // the tunnel mouth: a shored opening going down into the dark
    ctx.fillStyle = 'rgba(60,48,36,.5)'; for (let i=0;i<3;i++) ctx.fillRect(px+T*(.2 + i*.03), py+T*(.72 + i*.08), T*(.6 - i*.06), T*.03); ctx.fillStyle = '#4a3a26'; ctx.fillRect(px+T*.08, py+T*.1, T*.84, T*.12); ctx.fillStyle = '#3a2c1c'; ctx.fillRect(px+T*.1, py+T*.12, T*.1, T*.84); ctx.fillStyle = '#2a1e12'; ctx.fillRect(px+T*.8, py+T*.12, T*.1, T*.84); ctx.fillStyle = 'rgba(210,180,130,.18)'; ctx.fillRect(px+T*.08, py+T*.1, T*.84, T*.03); }
  if (ch === 'r') { ell(ctx, px+T*.5, py+T*.62, T*.3, T*.2, '#3a3630'); ell(ctx, px+T*.44, py+T*.56, T*.2, T*.14, '#57534c'); ell(ctx, px+T*.62, py+T*.66, T*.12, T*.08, '#2a2724'); }
  if (ch === 'M') { ctx.fillStyle = '#3a3a38'; ctx.beginPath(); ctx.moveTo(px+T*.08, py+T*.92); ctx.quadraticCurveTo(px+T*.5, py-T*.1, px+T*.92, py+T*.92); ctx.fill(); ctx.fillStyle = '#2a2a28'; ctx.fillRect(px+T*.4, py+T*.5, T*.2, T*.42); ctx.fillStyle = '#6b6a66'; for (let i=0;i<5;i++) ctx.fillRect(px+T*.15+i*T*.15, py+T*.55+hash(x,y,i)*T*.2, T*.08, T*.06); }
  exitArrow(ctx, ch, px, py, T);
  if (h > .8 && ch !== 'P') for (let i=0;i<2;i++){ const a = hash(x,y,i+7), b = hash(y,x,i+7), r = T*(.035 + hash(x,y,i+60)*.035); ell(ctx, px + a*T, py + b*T, r, r*.7, plain ? '#343c22' : '#1c1612'); ell(ctx, px + a*T - r*.3, py + b*T - r*.3, r*.45, r*.3, plain ? 'rgba(170,180,120,.25)' : 'rgba(150,130,105,.28)'); } // pebbles, lit from above
  if (ch === 'R') { // a stub of broken masonry: courses of block, a ragged top, a doorway gone black, rubble at its foot
    const top = T*(.1 + hash(x,y,5)*.22); ell(ctx, px+T*.56, py+T*.9, T*.46, T*.1, 'rgba(0,0,0,.45)');
    ctx.beginPath(); ctx.moveTo(px+T*.06, py+T*.9); ctx.lineTo(px+T*.06, py + top + T*.12); for (let i=1;i<=5;i++) ctx.lineTo(px + T*(.06 + i*.176), py + top + (hash(x,y,i+20) - .3)*T*.24); ctx.lineTo(px+T*.94, py+T*.9); ctx.closePath(); ctx.fillStyle = '#2c241d'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(px + T*.62, py, T*.4, T); ctx.fillStyle = 'rgba(210,180,140,.08)'; ctx.fillRect(px, py, T*.3, T);
    ctx.strokeStyle = 'rgba(8,6,5,.75)'; ctx.lineWidth = 1; ctx.beginPath(); for (let r=0;r<6;r++){ const yy = py + T*(.9 - r*.155); ctx.moveTo(px, yy); ctx.lineTo(px + T, yy); for (let c=0;c<3;c++){ const xx = px + T*((c + (r%2)*.5)*.34 + .1); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy - T*.155); } } ctx.stroke();
    if (hash(x,y,9) > .45) { ctx.fillStyle = '#080605'; ctx.beginPath(); ctx.moveTo(px+T*.36, py+T*.9); ctx.lineTo(px+T*.36, py+T*.6); ctx.arc(px+T*.49, py+T*.6, T*.13, Math.PI, 0); ctx.lineTo(px+T*.62, py+T*.9); ctx.fill(); }
    ctx.restore(); for (let i=0;i<4;i++) ell(ctx, px + T*(.15 + hash(x,y,i+40)*.7), py + T*(.86 + hash(x,y,i+41)*.08), T*(.05 + hash(x,y,i+42)*.05), T*.035, i%2 ? '#4a3e32' : '#231c16'); }
  if (ch === 'P') { // a burial pit: turned earth at its lip, lime, the shrouded dead in rows
    const n = (dx, dy) => !tileMap || (tileMap[y + dy] && tileMap[y + dy][x + dx] === 'P'); fill(dark ? '#0c0908' : '#15100c');
    for (let i=0;i<2;i++){ if (hash(x,y,i+30) < .25) continue; const bx = px + T*(.26 + hash(x,y,i+31)*.34), by = py + T*(.3 + i*.38); ctx.save(); ctx.translate(bx, by); ctx.rotate((hash(x,y,i+32) - .5)*.35);
      ell(ctx, 0, T*.03, T*.25, T*.08, 'rgba(0,0,0,.5)'); ell(ctx, 0, 0, T*.24, T*.075, dark ? '#4a443c' : '#6e665a'); ell(ctx, -T*.06, -T*.025, T*.14, T*.03, 'rgba(210,200,180,.22)'); ctx.strokeStyle = 'rgba(30,24,18,.6)'; ctx.lineWidth = 1; ctx.beginPath(); for (let j=-1;j<=1;j++){ ctx.moveTo(j*T*.09, -T*.07); ctx.lineTo(j*T*.09 + T*.015, T*.07); } ctx.stroke(); ctx.restore(); }
    speck('rgba(220,215,200,.45)', 6, 3, .035);
    const lip = (x0, y0, w, hh) => { ctx.fillStyle = dark ? '#261e16' : '#3a2e22'; ctx.fillRect(x0, y0, w, hh); ctx.fillStyle = 'rgba(170,140,105,.16)'; ctx.fillRect(x0, y0, w, Math.max(1, hh*.4)); };
    if (!n(0,-1)) { lip(px, py, T, T*.14); const g = ctx.createLinearGradient(0, py + T*.14, 0, py + T*.5); g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(px, py + T*.14, T, T*.36); }
    if (!n(0,1)) lip(px, py + T*.9, T, T*.1); if (!n(-1,0)) { lip(px, py, T*.1, T); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(px + T*.1, py, T*.12, T); } if (!n(1,0)) lip(px + T*.9, py, T*.1, T); }
  if (ch === '~' && !tileMap) { fill('#0b0910'); const cg = ctx.createRadialGradient(9*T, 6*T, T*.3, 9*T, 6*T, T*2.3); cg.addColorStop(0, '#1e1630'); cg.addColorStop(.7, '#0e0b14'); cg.addColorStop(1, '#221c18'); ctx.fillStyle = cg; ctx.fillRect(px,py,T,T); } // (the crater is drawn whole by prerender)
  if (ch === '=') { ctx.fillStyle = '#5a4630'; ctx.beginPath(); ctx.moveTo(px, py+T); ctx.lineTo(px+T/2, py+T*.12); ctx.lineTo(px+T, py+T); ctx.fill(); ctx.fillStyle = '#3c2d1e'; ctx.beginPath(); ctx.moveTo(px+T/2, py+T*.12); ctx.lineTo(px+T, py+T); ctx.lineTo(px+T*.62, py+T); ctx.fill(); ctx.fillStyle = '#0a0806'; ctx.beginPath(); ctx.moveTo(px+T*.4, py+T); ctx.lineTo(px+T*.5, py+T*.6); ctx.lineTo(px+T*.6, py+T); ctx.fill(); }
  if (ch === 'C') { ctx.fillStyle = '#4a3a26'; ctx.beginPath(); ctx.moveTo(px - T*.1, py+T); ctx.lineTo(px+T/2, py+T*.02); ctx.lineTo(px+T*1.1, py+T); ctx.fill(); ctx.fillStyle = '#2c2216'; ctx.beginPath(); ctx.moveTo(px+T/2, py+T*.02); ctx.lineTo(px+T*1.1, py+T); ctx.lineTo(px+T*.66, py+T); ctx.fill(); ctx.fillStyle = '#1a1208'; ctx.beginPath(); ctx.moveTo(px+T*.38, py+T); ctx.lineTo(px+T*.5, py+T*.55); ctx.lineTo(px+T*.62, py+T); ctx.fill(); ctx.fillStyle = 'rgba(255,190,110,.55)'; ctx.fillRect(px+T*.45, py+T*.7, T*.1, T*.3); }
  if (ch === 'F' || ch === 'B') { for (let i=0;i<7;i++){ const a = i/7*6.28; ell(ctx, px+T/2 + Math.cos(a)*T*.32, py+T*.6 + Math.sin(a)*T*.2, T*.07, T*.05, '#3a3128'); } ell(ctx, px+T/2, py+T*.6, T*.16, T*.08, '#1a1008'); }
  if (ch === 'W') { ctx.fillStyle = '#3c2d1e'; ctx.fillRect(px+T*.12, py+T*.3, T*.76, T*.4); ctx.fillStyle = '#5a4630'; ctx.fillRect(px+T*.12, py+T*.3, T*.76, T*.08); ctx.fillStyle = '#15100a'; ell(ctx, px+T*.28, py+T*.76, T*.11, T*.11, '#15100a'); ell(ctx, px+T*.72, py+T*.76, T*.11, T*.11, '#15100a'); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(px+T*.2, py+T*.16, T*.6, T*.16); }
  if (ch === 'x') { ctx.fillStyle = '#3a2a18'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.7); ctx.fillStyle = '#6b5a3c'; ctx.fillRect(px+T*.44, py+T*.2, T*.12, T*.1); ctx.strokeStyle = 'rgba(120,100,70,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py+T*.35); ctx.lineTo(px+T, py+T*.35); ctx.stroke(); }
  if (ch === 'T' && (tunnel || plain)) { ctx.fillStyle = '#030202'; ctx.fillRect(px+T*.15, py+T*.2, T*.7, T*.72); ctx.fillStyle = '#4a3a26'; ctx.fillRect(px+T*.08, py+T*.12, T*.84, T*.12); ctx.fillRect(px+T*.1, py+T*.12, T*.1, T*.8); ctx.fillRect(px+T*.8, py+T*.12, T*.1, T*.8); }
}
let tileMap = null; // the map being prerendered, for tiles that look at their neighbours (pits)
/* the crater at the heart of the Pale: one bowl across all its tiles, a rim of thrown earth, glassed and cracked stone, shards that hold the warren's light */
function drawCrater(ctx, map, T){
  let x0 = 99, y0 = 99, x1 = -1, y1 = -1; map.forEach((r, y) => [...r].forEach((c, x) => { if (c === '~') { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } })); if (x1 < 0) return;
  const cx = (x0 + x1 + 1)/2*T, cy = (y0 + y1 + 1)/2*T, rx = (x1 - x0 + 1)/2*T*1.04, ry = (y1 - y0 + 1)/2*T*1.12;
  for (let i=0;i<44;i++){ const a = i/44*6.283, rr = 1.02 + hash(i,3)*.2; ell(ctx, cx + Math.cos(a)*rx*rr, cy + Math.sin(a)*ry*rr, T*(.1 + hash(i,4)*.14), T*(.06 + hash(i,5)*.07), i%3 ? '#433729' : '#241d17', a); } // thrown earth
  const path = () => { ctx.beginPath(); for (let i=0;i<=40;i++){ const a = i/40*6.283, rr = .9 + hash(i % 40, 7)*.12; const px = cx + Math.cos(a)*rx*rr, py = cy + Math.sin(a)*ry*rr; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); };
  path(); const g = ctx.createRadialGradient(cx, cy + ry*.12, T*.2, cx, cy, Math.max(rx, ry)); g.addColorStop(0, '#1c1430'); g.addColorStop(.55, '#0d0a14'); g.addColorStop(.86, '#16120f'); g.addColorStop(1, '#2a2219'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); path(); ctx.clip();
  const lg = ctx.createLinearGradient(0, cy - ry, 0, cy - ry*.3); lg.addColorStop(0, 'rgba(0,0,0,.6)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = lg; ctx.fillRect(cx - rx*1.2, cy - ry*1.2, rx*2.4, ry*.9); // the near lip throws its shadow down into it
  ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.lineWidth = 1; for (let i=0;i<16;i++){ const a = i/16*6.283 + hash(i,9); let px = cx, py = cy; ctx.beginPath(); ctx.moveTo(px, py); for (let q=1;q<6;q++){ px = cx + Math.cos(a + (hash(i,q) - .5)*.6)*rx*q/5; py = cy + Math.sin(a + (hash(q,i) - .5)*.6)*ry*q/5; ctx.lineTo(px, py); } ctx.stroke(); }
  for (let i=0;i<26;i++){ const px = cx + (hash(i,11) - .5)*rx*1.7, py = cy + (hash(i,12) - .5)*ry*1.6, s = T*(.04 + hash(i,15)*.05); poly(ctx, [[px, py - s*1.4],[px + s*1.6, py],[px, py + s],[px - s, py]], `rgba(${130 + Math.round(hash(i,13)*60)},110,210,${.18 + hash(i,14)*.3})`); } // glassed shards
  ctx.restore();
  ctx.strokeStyle = 'rgba(190,160,120,.12)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx, cy + 1, rx*.97, ry*.97, 0, Math.PI*.1, Math.PI*.9); ctx.stroke(); // the far lip catching a little light
}
function prerender(map, cols, rows, dark, tunnel, style){
  const {bctx, T} = G; if (!bctx) return;
  const est = style && style.startsWith('estate');
  if (style && (est || style === 'storm')) { estateRing = est ? {x:8, y:5} : {x:3.5, y:1}; map.forEach((r, y) => [...r].forEach((c, x) => { if (est && c === 'A') estateRing = {x, y}; })); }
  estateMap = est ? map : null; tileMap = map;
  for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) drawTile(bctx, map[y][x] === '#' ? '#' : tunnel ? (hash(x,y,4) > .8 ? ',' : '.') : map[y][x], x, y, T, dark, tunnel, style);
  estateMap = null;
  const earth = !style || style === 'pale' || style === 'camp_night' || style.startsWith('plain') || style.startsWith('hills');
  if (earth) { // broad, soft light and dark across the ground, so the tiles read as one field and not a board
    for (let i=0;i<cols*rows*.55;i++){ const x = hash(i,71)*cols*T, y = hash(i,72)*rows*T, r = T*(.9 + hash(i,73)*1.6), lit = hash(i,74) > .55, g = bctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, lit ? `rgba(255,236,200,${dark ? .02 : .04})` : 'rgba(0,0,0,.1)'); g.addColorStop(1, lit ? 'rgba(255,236,200,0)' : 'rgba(0,0,0,0)'); bctx.fillStyle = g; bctx.fillRect(x - r, y - r, r*2, r*2); }
    if (map.some(r => r.includes('~'))) drawCrater(bctx, map, T); }
  tileMap = null;
  if (est) { const mode = style.endsWith('terrace') ? 'terrace' : style.endsWith('storm') ? 'storm' : 'night'; for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) drawEstateOver(bctx, map[y][x], x, y, T, mode, map); G.azath = !!(S && S.f && S.f.c6_azath); }
  // grime / soft shadows along walls
  for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) if (map[y][x] !== '#' && (map[y-1]?.[x] === '#')) { const g = bctx.createLinearGradient(0, y*T, 0, y*T + T*.5); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); bctx.fillStyle = g; bctx.fillRect(x*T, y*T, T, T*.5); }
  if (tunnel) { for (let i=0;i<cols*rows*.15;i++){ const x = hash(i,31)*cols*T, y = hash(i,32)*rows*T; ell(bctx, x, y, T*.3, T*.1, 'rgba(0,0,0,.25)'); } }
  G.dctx.clearRect(0,0,cols*T,rows*T);
}
function bloodDecal(x, y, big){
  if (!SET.blood) return; const {dctx, T} = G; const cx = x*T + T/2, cy = y*T + T*.7, n = big ? 8 : 4;
  for (let i=0;i<n;i++){ const a = Math.random()*7, d = Math.random()*T*(big ? .4 : .25); ell(dctx, cx + Math.cos(a)*d, cy + Math.sin(a)*d*.5, T*(.04 + Math.random()*.1), T*(.025 + Math.random()*.05), `rgba(${48 + R(30)},${6 + R(6)},${6},${.45 + Math.random()*.3})`, a); }
}

