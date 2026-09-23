/* ============ Deck of Dragons card art ============ */
function drawCard(ctx, id, W, H, face, t = 0){
  ctx.save();
  // card body
  const r = W * .06; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(0, 0, W, H, r) : ctx.rect(0,0,W,H); ctx.clip();
  const body = ctx.createLinearGradient(0, 0, W, H); body.addColorStop(0, '#1d1511'); body.addColorStop(1, '#0c0908'); ctx.fillStyle = body; ctx.fillRect(0,0,W,H);
  // worn wood grain
  ctx.strokeStyle = 'rgba(255,255,255,.03)'; ctx.lineWidth = 1; for (let i=0;i<18;i++){ ctx.beginPath(); ctx.moveTo(0, i*H/18 + hash(i,1)*8); ctx.bezierCurveTo(W*.3, i*H/18 + hash(i,2)*14, W*.7, i*H/18 - hash(i,3)*14, W, i*H/18 + hash(i,4)*8); ctx.stroke(); }
  const gold = '#c9973f', gold2 = '#7a5a22';
  ctx.strokeStyle = gold; ctx.lineWidth = W*.012; ctx.strokeRect(W*.05, H*.035, W*.9, H*.93); ctx.strokeStyle = gold2; ctx.lineWidth = 1; ctx.strokeRect(W*.075, H*.052, W*.85, H*.896);
  if (!face) { // back: the fourteen-pointed wheel of Houses
    const cx = W/2, cy = H/2, R0 = W*.34;
    ctx.strokeStyle = gold2; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, R0*.62, 0, 7); ctx.stroke();
    for (let i=0;i<14;i++){ const a = i/14*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a)*R0*.62, cy + Math.sin(a)*R0*.62); ctx.lineTo(cx + Math.cos(a)*R0, cy + Math.sin(a)*R0); ctx.stroke(); }
    poly(ctx, [[cx,cy-R0*.5],[cx+R0*.12,cy-R0*.12],[cx+R0*.5,cy],[cx+R0*.12,cy+R0*.12],[cx,cy+R0*.5],[cx-R0*.12,cy+R0*.12],[cx-R0*.5,cy],[cx-R0*.12,cy-R0*.12]], null, gold);
    ell(ctx, cx, cy, R0*.08, R0*.08, gold);
    [[.18,.12],[.82,.12],[.18,.88],[.82,.88]].forEach(([x,y]) => { ctx.fillStyle = gold2; ctx.beginPath(); ctx.arc(W*x, H*y, W*.02, 0, 7); ctx.fill(); });
    ctx.restore(); return;
  }
  const c = CARDS[id] || {name:'?', hue:'#888'}; const hue = c.hue;
  // illustration panel
  const px = W*.11, py = H*.075, pw = W*.78, ph = H*.68;
  const sky = ctx.createLinearGradient(0, py, 0, py+ph); sky.addColorStop(0, '#07060a'); sky.addColorStop(1, id === 'herald' ? '#0d1410' : '#1a1410'); ctx.fillStyle = sky; ctx.fillRect(px, py, pw, ph);
  ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
  const cx = px + pw/2, gy = py + ph*.82;
  glow(ctx, cx, py + ph*.45, pw*.6, hue, .22);
  ctx.fillStyle = '#0a0807'; ctx.fillRect(px, gy, pw, ph); // ground
  switch (id) {
    case 'oponn': { // twin masks back to back, a coin above
      const my = py + ph*.5, mr = pw*.2;
      const mask = (dir, col) => { ctx.save(); ctx.translate(cx + dir*mr*.55, my); ctx.scale(dir, 1); poly(ctx, [[0,-mr],[mr*.55,-mr*.8],[mr*.9,-mr*.2],[mr*.8,mr*.5],[mr*.4,mr*1.05],[0,mr*.9]], col); ell(ctx, mr*.5, -mr*.35, mr*.16, mr*.1, '#0a0807'); ctx.strokeStyle = '#0a0807'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mr*.3, mr*.45); ctx.quadraticCurveTo(mr*.55, dir > 0 ? mr*.65 : mr*.3, mr*.75, mr*.4); ctx.stroke(); ctx.restore(); };
      mask(-1, '#d9c088'); mask(1, '#a9a9b4');
      const spin = Math.abs(Math.cos(t/900)); ell(ctx, cx, py + ph*.16, pw*.07*spin + .5, pw*.07, '#e8c073'); break; }
    case 'obelisk': { ctx.fillStyle = '#1e1c1a'; for (let i=0;i<6;i++) ell(ctx, px + hash(i,9)*pw, gy - 2 + hash(i,4)*4, pw*.12, ph*.02, '#1a1816');
      const g = ctx.createLinearGradient(cx - pw*.1, 0, cx + pw*.1, 0); g.addColorStop(0, '#9b958a'); g.addColorStop(.5, '#5c5852'); g.addColorStop(1, '#2a2826');
      poly(ctx, [[cx - pw*.1, gy],[cx - pw*.07, py + ph*.12],[cx + pw*.05, py + ph*.09],[cx + pw*.1, gy]], g);
      ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; for (let i=0;i<7;i++){ const yy = py + ph*(.2 + i*.08); ctx.beginPath(); ctx.moveTo(cx - pw*.05, yy); ctx.lineTo(cx + pw*.04, yy - 3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - pw*.02, yy+4); ctx.lineTo(cx - pw*.02, yy+10); ctx.stroke(); } break; }
    case 'knight': { ell(ctx, cx + pw*.2, py + ph*.28, pw*.16, pw*.16, '#0b0a0f'); ctx.strokeStyle = 'rgba(125,127,201,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx + pw*.2, py + ph*.28, pw*.16, 0, 7); ctx.stroke();
      const hx = cx - pw*.05, top = py + ph*.18; poly(ctx, [[hx - pw*.16, gy],[hx - pw*.13, top + ph*.22],[hx - pw*.07, top + ph*.12],[hx, top],[hx + pw*.07, top + ph*.12],[hx + pw*.13, top + ph*.22],[hx + pw*.16, gy]], '#050407');
      ctx.strokeStyle = '#020203'; ctx.lineWidth = pw*.03; ctx.beginPath(); ctx.moveTo(hx + pw*.14, top + ph*.35); ctx.lineTo(hx + pw*.2, gy + ph*.1); ctx.stroke(); ctx.strokeStyle = 'rgba(125,127,201,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx + pw*.145, top + ph*.35); ctx.lineTo(hx + pw*.205, gy + ph*.1); ctx.stroke();
      ctx.fillStyle = 'rgba(125,127,201,.06)'; ctx.fillRect(px, gy - ph*.06, pw, ph*.06); break; }
    case 'hounds': { // two hounds on a ridge under a shadowed moon, eyes lit
      ell(ctx, cx + pw*.22, py + ph*.22, pw*.13, pw*.13, '#14121c'); ctx.strokeStyle = 'rgba(154,134,224,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx + pw*.22, py + ph*.22, pw*.13, 0, 7); ctx.stroke();
      poly(ctx, [[px, gy],[px + pw*.3, gy - ph*.12],[px + pw*.6, gy - ph*.06],[px + pw, gy - ph*.14],[px + pw, gy]], '#0d0b0a');
      [[cx - pw*.22, gy - ph*.1, 1],[cx + pw*.2, gy - ph*.06, -1]].forEach(([hx,hy,d]) => { ctx.save(); ctx.translate(hx, hy); ctx.scale(d*pw/70, pw/70);
        poly(ctx, [[-14,2],[-10,-6],[2,-9],[10,-7],[14,-2],[12,6],[-12,7]], '#0a0808'); poly(ctx, [[10,-7],[18,-12],[24,-8],[22,-2],[14,-2]], '#0d0a09'); ctx.fillStyle = '#1a1614'; ctx.fillRect(-11,5,3,9); ctx.fillRect(9,5,3,9);
        ctx.fillStyle = `rgba(255,190,80,${.7 + Math.sin(t/300 + hx)*.3})`; ctx.fillRect(17,-10,2.2,1.8); ctx.restore(); glow(ctx, hx + d*pw*.25, hy - ph*.05, pw*.08, '#ffb040', .3); });
      for (let i=0;i<4;i++){ const a = t/900 + i*1.7; ell(ctx, cx + Math.cos(a)*pw*.3, py + ph*.5 + Math.sin(a*.6)*ph*.1, pw*.16, ph*.05, 'rgba(154,134,224,.06)'); } break; }
    case 'assassin': { ctx.strokeStyle = '#6b6155'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, py + ph*.45); ctx.lineTo(px + pw, py + ph*.32); ctx.stroke();
      const fx = cx, fy = py + ph*.4; for (let i=0;i<5;i++){ const a = t/800 + i; ell(ctx, fx + Math.cos(a)*pw*.18, fy + Math.sin(a*.7)*ph*.1, pw*.12, ph*.06, 'rgba(154,134,224,.07)'); }
      poly(ctx, [[fx - pw*.16, fy + ph*.05],[fx - pw*.1, fy - ph*.16],[fx, fy - ph*.22],[fx + pw*.1, fy - ph*.16],[fx + pw*.17, fy + ph*.05],[fx + pw*.1, fy + ph*.02],[fx - pw*.1, fy + ph*.02]], '#08070b');
      ell(ctx, fx, fy - ph*.14, pw*.05, ph*.03, '#000');
      ctx.strokeStyle = '#cfc8b8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(fx - pw*.2, fy); ctx.lineTo(fx - pw*.12, fy - ph*.04); ctx.moveTo(fx + pw*.2, fy - ph*.02); ctx.lineTo(fx + pw*.13, fy - ph*.05); ctx.stroke(); break; }
    case 'magi': { // a robed figure with a staff, and the shadows of many hands reaching from the hem
      for (let i=0;i<7;i++){ const a = t/900 + i*.9; ell(ctx, cx + Math.cos(a)*pw*.22, py + ph*.42 + Math.sin(a*.6)*ph*.08, pw*.14, ph*.05, 'rgba(154,134,224,.06)'); }
      poly(ctx, [[cx - pw*.22, gy],[cx - pw*.12, py + ph*.28],[cx, py + ph*.2],[cx + pw*.12, py + ph*.28],[cx + pw*.22, gy]], '#0a0810'); ell(ctx, cx, py + ph*.26, pw*.06, ph*.035, '#000');
      ctx.strokeStyle = '#6b5a8a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + pw*.2, gy); ctx.lineTo(cx + pw*.24, py + ph*.14); ctx.stroke(); ell(ctx, cx + pw*.24, py + ph*.13, pw*.03, pw*.03, `rgba(201,187,255,${.5 + Math.sin(t/300)*.3})`);
      for (let i=0;i<6;i++){ const a = i/6*3.14 + 3.14, r = pw*.28; ctx.strokeStyle = 'rgba(154,134,224,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx, gy - ph*.02); ctx.quadraticCurveTo(cx + Math.cos(a)*r*.6, gy - ph*.06, cx + Math.cos(a)*r, gy + Math.sin(a)*ph*.04 - ph*.02 + Math.sin(t/500 + i)*2); ctx.stroke(); }
      ctx.fillStyle = 'rgba(201,187,255,.6)'; ctx.fillRect(cx - pw*.02, py + ph*.255, pw*.012, ph*.006); ctx.fillRect(cx + pw*.01, py + ph*.255, pw*.012, ph*.006); break; }
    case 'herald': { poly(ctx, [[cx - pw*.3, gy],[cx - pw*.3, py + ph*.2],[cx - pw*.12, py + ph*.06],[cx + pw*.12, py + ph*.06],[cx + pw*.3, py + ph*.2],[cx + pw*.3, gy],[cx + pw*.22, gy],[cx + pw*.22, py + ph*.26],[cx, py + ph*.16],[cx - pw*.22, py + ph*.26],[cx - pw*.22, gy]], '#0a0c0a');
      ctx.fillStyle = '#000'; ctx.fillRect(cx - pw*.22, py + ph*.16, pw*.44, gy - py - ph*.16);
      const hx = cx, top = py + ph*.34; poly(ctx, [[hx - pw*.1, gy],[hx - pw*.08, top + ph*.12],[hx, top + ph*.08],[hx + pw*.08, top + ph*.12],[hx + pw*.1, gy]], '#1e2420');
      ell(ctx, hx, top, pw*.055, ph*.04, '#c9c4b0'); ctx.fillStyle = '#000'; ctx.fillRect(hx - pw*.035, top - ph*.01, pw*.025, ph*.012); ctx.fillRect(hx + pw*.01, top - ph*.01, pw*.025, ph*.012);
      ctx.strokeStyle = '#8fa38a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + pw*.06, top + ph*.14); ctx.lineTo(hx + pw*.22, top - ph*.06); ctx.stroke(); poly(ctx, [[hx + pw*.22, top - ph*.06],[hx + pw*.28, top - ph*.1],[hx + pw*.26, top - ph*.01]], '#8fa38a'); break; }
    case 'crown': { // an iron crown with a thread of gold, and behind it an empty throne in the dark
      const tb = py + ph*.1, tw = pw*.5; poly(ctx, [[cx - tw*.5, gy],[cx - tw*.5, tb + ph*.12],[cx - tw*.3, tb],[cx, tb - ph*.03],[cx + tw*.3, tb],[cx + tw*.5, tb + ph*.12],[cx + tw*.5, gy]], '#120f0c');
      ctx.strokeStyle = 'rgba(232,192,115,.12)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - tw*.5, gy); ctx.lineTo(cx - tw*.5, tb + ph*.12); ctx.lineTo(cx - tw*.3, tb); ctx.lineTo(cx, tb - ph*.03); ctx.lineTo(cx + tw*.3, tb); ctx.lineTo(cx + tw*.5, tb + ph*.12); ctx.lineTo(cx + tw*.5, gy); ctx.stroke();
      poly(ctx, [[cx - tw*.62, gy - ph*.2],[cx + tw*.62, gy - ph*.2],[cx + tw*.62, gy - ph*.16],[cx - tw*.62, gy - ph*.16]], '#0c0a08'); ctx.fillStyle = '#080605'; ctx.fillRect(cx - tw*.34, tb + ph*.12, tw*.68, gy - tb - ph*.32); // the seat, nobody on it
      const y = py + ph*.56, cw = pw*.3, chh = ph*.08, g = ctx.createLinearGradient(cx - cw, 0, cx + cw, 0); g.addColorStop(0, '#6a655e'); g.addColorStop(.4, '#3a3632'); g.addColorStop(1, '#161412');
      ell(ctx, cx, y + chh + ph*.03, cw*1.1, ph*.03, 'rgba(0,0,0,.6)');
      poly(ctx, [[cx - cw, y + chh],[cx - cw, y - chh*.4],[cx - cw*.72, y - chh*1.9],[cx - cw*.5, y - chh*.3],[cx - cw*.2, y - chh*2.4],[cx, y - chh*.5],[cx + cw*.2, y - chh*2.4],[cx + cw*.5, y - chh*.3],[cx + cw*.72, y - chh*1.9],[cx + cw, y - chh*.4],[cx + cw, y + chh]], g);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let i=0;i<6;i++) ctx.fillRect(cx - cw + hash(i,2)*cw*2, y - chh*.2 + hash(i,3)*chh, 2, 1.5); // pitted iron
      const gl = .55 + Math.sin(t/500)*.25; ctx.strokeStyle = `rgba(232,192,115,${gl})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx - cw, y + chh*.35); ctx.bezierCurveTo(cx - cw*.3, y + chh*.1, cx + cw*.3, y + chh*.6, cx + cw, y + chh*.3); ctx.stroke(); // the thread of gold
      [[-.72,-1.9],[-.2,-2.4],[.2,-2.4],[.72,-1.9]].forEach(([a,b],i) => { ell(ctx, cx + a*cw, y + b*chh, 1.8, 1.8, `rgba(232,192,115,${.4 + Math.sin(t/400 + i*1.6)*.35})`); });
      glow(ctx, cx, y, pw*.35, '#e8c073', .1 + Math.sin(t/700)*.04); break; }
    case 'chains': { // chains hanging out of the dark, bound at both ends; the shadow of a sword behind them
      const dk = ctx.createLinearGradient(0, py, 0, py + ph*.45); dk.addColorStop(0, '#000'); dk.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = dk; ctx.fillRect(px, py, pw, ph*.45);
      ctx.save(); ctx.translate(cx + pw*.06, py + ph*.5); ctx.rotate(-.5); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(-pw*.035, -ph*.46, pw*.07, ph*.8); ctx.fillRect(-pw*.14, ph*.3, pw*.28, ph*.035); ctx.fillRect(-pw*.025, ph*.33, pw*.05, ph*.12); ctx.strokeStyle = 'rgba(154,154,166,.12)'; ctx.lineWidth = 1; ctx.strokeRect(-pw*.035, -ph*.46, pw*.07, ph*.8); ctx.restore();
      for (let i=0;i<8;i++){ const k = ((t/2600 + i/8) % 1); ell(ctx, cx + Math.sin(i*2.3 + t/900)*pw*.3, py + ph*.8 - k*ph*.5, pw*(.08 + k*.1), ph*.02 + k*ph*.02, `rgba(20,18,26,${.35*(1-k)})`); } // smoke
      [[-.3, .66, 0],[-.1, .78, 1],[.12, .6, 2],[.3, .72, 3]].forEach(([dx, len, j]) => { const sw = Math.sin(t/1100 + j*1.4)*.04, x0 = cx + dx*pw, n = Math.round(len*ph/(pw*.055));
        for (let q=0;q<n;q++){ const yy = py + q*pw*.055, xx = x0 + Math.sin(sw*q*.6)*q*1.2 + sw*q*2, lit = yy > py + ph*.18, a = clamp((yy - py)/(ph*.3), 0, 1);
          ctx.strokeStyle = q%2 ? `rgba(70,70,78,${a})` : `rgba(110,110,122,${a})`; ctx.lineWidth = pw*.014; ctx.beginPath(); if (q%2) ctx.ellipse(xx, yy, pw*.012, pw*.034, 0, 0, 7); else ctx.ellipse(xx, yy, pw*.028, pw*.034, 0, 0, 7); ctx.stroke();
          if (lit && hash(q, j) > .55) { ctx.fillStyle = `rgba(230,228,240,${a*(.35 + Math.sin(t/300 + q + j)*.3)})`; ctx.fillRect(xx - pw*.02, yy - pw*.02, 1.6, 1.6); } }
        const ey = py + n*pw*.055, ex = x0 + Math.sin(sw*n*.6)*n*1.2 + sw*n*2; ctx.strokeStyle = '#8a8a96'; ctx.lineWidth = pw*.02; ctx.beginPath(); ctx.arc(ex, ey + pw*.04, pw*.045, Math.PI*1.1, Math.PI*1.9 + Math.PI*.9); ctx.stroke(); }); // open shackles at the ends
      glow(ctx, cx, py + ph*.62, pw*.4, '#9a9aa6', .08); break; }
    case 'blank': { // gesso and grain, nothing on it yet
      const g = ctx.createLinearGradient(px, py, px + pw, py + ph); g.addColorStop(0, '#e4ddcc'); g.addColorStop(.6, '#d8d0c0'); g.addColorStop(1, '#c2b8a4'); ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(120,100,70,.10)'; ctx.lineWidth = 1; for (let i=0;i<26;i++){ const yy = py + i*ph/26 + hash(i,5)*4; ctx.beginPath(); ctx.moveTo(px, yy); ctx.bezierCurveTo(px + pw*.3, yy + (hash(i,6) - .5)*8, px + pw*.7, yy + (hash(i,7) - .5)*8, px + pw, yy + (hash(i,8) - .5)*5); ctx.stroke(); } // the grain of the wood through the gesso
      ctx.fillStyle = 'rgba(255,255,250,.35)'; for (let i=0;i<40;i++) ctx.fillRect(px + hash(i,11)*pw, py + hash(i,12)*ph, 1, 1); ctx.fillStyle = 'rgba(90,70,50,.12)'; for (let i=0;i<14;i++) ctx.fillRect(px + hash(i,13)*pw, py + hash(i,14)*ph, 1.4, 1.4);
      ell(ctx, cx + pw*.1, py + ph*.3, pw*.3, ph*.12, 'rgba(255,255,248,.12)'); const v = ctx.createRadialGradient(cx, py + ph*.45, pw*.2, cx, py + ph*.45, pw*.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(60,45,30,.28)'); ctx.fillStyle = v; ctx.fillRect(px, py, pw, ph);
      glow(ctx, cx, py + ph*.45, pw*.5, '#fff8e8', .08 + Math.sin(t/900)*.04); break; }
    case 'sceptre': { ctx.strokeStyle = '#6b6155'; ctx.lineWidth = pw*.03; ctx.beginPath(); ctx.moveTo(cx - pw*.1, py + ph*.75); ctx.lineTo(cx + pw*.1, py + ph*.2); ctx.stroke(); ell(ctx, cx + pw*.1, py + ph*.18, pw*.06, pw*.06, '#8d8a86'); break; }
    case 'orb': { ell(ctx, cx, py + ph*.45, pw*.2, pw*.2, '#2a2826'); ctx.strokeStyle = '#8d8a86'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, py + ph*.45, pw*.2, 0, 7); ctx.stroke(); glow(ctx, cx - pw*.07, py + ph*.38, pw*.1, '#bdb3a3', .3); break; }
  }
  ctx.restore();
  ctx.strokeStyle = gold2; ctx.lineWidth = 1; ctx.strokeRect(px, py, pw, ph);
  // nameplate
  ctx.fillStyle = hue; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const nm = c.name.split(' of ');
  let fs = Math.round(W*.085); ctx.font = `${fs}px 'IM Fell English SC', serif`; while (fs > 8 && ctx.measureText(nm[0]).width > W*.82) { fs--; ctx.font = `${fs}px 'IM Fell English SC', serif`; } ctx.fillText(nm[0], W/2, H*.83);
  ctx.font = `${Math.round(W*.06)}px 'IM Fell English', serif`; ctx.fillStyle = '#9c8c78'; ctx.fillText(nm[1] ? 'of ' + nm[1] : (c.house || ''), W/2, H*.905);
  ctx.restore();
}
/* draw a card with a flip amount k in [0,1]: 0 = back, 1 = face */
function drawCardFlip(ctx, id, x, y, W, H, k, t, rot = 0, scale = 1){
  ctx.save(); ctx.translate(x + W/2, y + H/2); ctx.rotate(rot); ctx.scale(scale, scale);
  const sx = Math.cos(k * Math.PI); const face = k > .5;
  ctx.scale(Math.max(.02, Math.abs(sx)), 1); ctx.translate(-W/2, -H/2);
  ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#000'; ctx.fillRect(2, 2, W - 4, H - 4); ctx.shadowColor = 'transparent';
  drawCard(ctx, id, W, H, face, t);
  ctx.restore();
}
/* small inline card in the dialogue sheet; if refuse, it sours after flipping */
function inlineCard(cv, id, refuse){
  if (!cv) return; const ctx = cv.getContext('2d'), t0 = performance.now(); let played = false;
  function fr(){ if (!cv.isConnected) return; const t = performance.now() - t0, k = REDUCE() ? 1 : clamp((t - 300) / 700, 0, 1);
    ctx.clearRect(0,0,240,360); drawCardFlip(ctx, id, 0, 0, 240, 360, k, t);
    if (!played && k > .5) { played = true; AUDIO.play('flip'); }
    if (refuse && t > 1300) { const a = clamp((t - 1300) / 900, 0, .75); ctx.fillStyle = `rgba(6,5,4,${a})`; ctx.fillRect(0,0,240,360); for (let i=0;i<8;i++){ const yy = 360 - ((t/6 + i*47) % 400); ell(ctx, 120 + Math.sin(t/400 + i)*60, yy, 40, 14, `rgba(60,50,45,${a*.5})`); } }
    if (k < 1 || (refuse && t < 2400) || ['oponn','chains','crown','blank'].includes(id)) requestAnimationFrame(fr); }
  requestAnimationFrame(fr);
}

