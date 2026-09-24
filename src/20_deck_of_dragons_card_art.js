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
    case 'knight': { // a tall figure seen from behind, white hair, a black sword point-down smoking, looking at a city of blue lamps
      ctx.fillStyle = '#070710'; ctx.fillRect(px, gy - ph*.18, pw, ph*.18); for (let i=0;i<16;i++){ const bx = px + hash(i,31)*pw, bh = ph*(.04 + hash(i,32)*.1); ctx.fillStyle = '#05050a'; ctx.fillRect(bx, gy - ph*.18 - bh, pw*(.04 + hash(i,33)*.05), bh); } // the city
      for (let i=0;i<14;i++){ ctx.fillStyle = `rgba(140,190,255,${.35 + Math.sin(t/700 + i)*.15})`; ctx.fillRect(px + hash(i,34)*pw, gy - ph*(.12 + hash(i,35)*.12), 1.5, 1.5); } glow(ctx, cx, gy - ph*.14, pw*.5, '#6a90d8', .16);
      const hx = cx - pw*.04, top = py + ph*.2, s = pw/100; ctx.save(); ctx.translate(hx, top);
      poly(ctx, [[-16*s, ph*.8],[-13*s, 30*s],[-10*s, 14*s],[-6*s, 6*s],[0, 3*s],[6*s, 6*s],[10*s, 14*s],[13*s, 30*s],[17*s, ph*.8]], '#06050a'); // cloak, from behind
      ctx.fillStyle = '#c8c6d4'; ctx.beginPath(); ctx.moveTo(-5.4*s, 0); ctx.quadraticCurveTo(0, -9*s, 5.4*s, 0); ctx.lineTo(7*s, 34*s); ctx.quadraticCurveTo(2*s, 40*s, -1*s, 34*s); ctx.quadraticCurveTo(-4*s, 40*s, -7*s, 32*s); ctx.closePath(); ctx.fill(); // long white hair down his back
      ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .8; for (let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(i*2*s, -3*s); ctx.quadraticCurveTo(i*2.6*s, 18*s, i*2.2*s, 34*s); ctx.stroke(); }
      ctx.restore();
      const sx = hx + pw*.2, sy = top + ph*.3; ctx.strokeStyle = '#020203'; ctx.lineWidth = pw*.028; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + pw*.03, gy + ph*.06); ctx.stroke(); ctx.lineWidth = pw*.012; ctx.beginPath(); ctx.moveTo(sx - pw*.05, sy + ph*.02); ctx.lineTo(sx + pw*.05, sy); ctx.stroke(); // Dragnipur, point down
      ctx.strokeStyle = `rgba(150,140,210,${.45 + Math.sin(t/800)*.15})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx + pw*.006, sy + 3); ctx.lineTo(sx + pw*.034, gy + ph*.05); ctx.stroke();
      for (let i=0;i<7;i++){ const k = ((t/2400 + i/7) % 1); ell(ctx, sx + pw*.03 + Math.sin(t/600 + i)*pw*.04 - k*pw*.1, gy - k*ph*.35, pw*(.02 + k*.07), ph*(.01 + k*.02), `rgba(10,8,18,${.6*(1 - k)})`); } // and it smokes
      ctx.fillStyle = 'rgba(125,127,201,.06)'; ctx.fillRect(px, gy - ph*.06, pw, ph*.06); break; }
    case 'hounds': { // two Hounds of Shadow on a ridge under a shadowed moon, eyes lit
      ell(ctx, cx + pw*.22, py + ph*.22, pw*.13, pw*.13, '#14121c'); ctx.strokeStyle = 'rgba(154,134,224,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx + pw*.22, py + ph*.22, pw*.13, 0, 7); ctx.stroke();
      poly(ctx, [[px, gy + 2],[px, gy - ph*.1],[px + pw*.3, gy - ph*.16],[px + pw*.6, gy - ph*.08],[px + pw, gy - ph*.15],[px + pw, gy + 2]], '#0d0b0a');
      [[cx - pw*.2, gy - ph*.13, 1, .95],[cx + pw*.24, gy - ph*.07, -1, 1.15]].forEach(([hx, hy, d, sc], i) => { ctx.save(); ctx.translate(hx, hy); ctx.scale(d*pw/130*sc, pw/130*sc); drawHound(ctx, {body:'#0c0a09', rim:'#9a86e0', gait:i ? .5 : -.3, eyeA:.75 + Math.sin(t/300 + i*2)*.25}); ctx.restore(); });
      for (let i=0;i<4;i++){ const a = t/900 + i*1.7; ell(ctx, cx + Math.cos(a)*pw*.3, py + ph*.5 + Math.sin(a*.6)*ph*.1, pw*.16, ph*.05, 'rgba(154,134,224,.06)'); } break; }
    case 'raven': { // the Great Raven: a shape the size of a cart over the plain, wings wide, one eye catching the moon
      ell(ctx, cx - pw*.2, py + ph*.2, pw*.1, pw*.1, '#b8bcc8'); glow(ctx, cx - pw*.2, py + ph*.2, pw*.3, '#c8ccd8', .2); ell(ctx, cx - pw*.17, py + ph*.19, pw*.1, pw*.1, 'rgba(7,6,10,.55)');
      ctx.fillStyle = '#0c0b0a'; ctx.fillRect(px, gy, pw, ph); ctx.strokeStyle = 'rgba(90,96,110,.35)'; ctx.lineWidth = 1; for (let i=0;i<30;i++){ const gx = px + hash(i,41)*pw, gh = ph*(.02 + hash(i,42)*.03); ctx.beginPath(); ctx.moveTo(gx, gy + 2); ctx.lineTo(gx + (hash(i,43) - .5)*3, gy + 2 - gh); ctx.stroke(); } // the grass
      const rx = cx + pw*.04, ry = py + ph*.46, s = pw/110, fl = Math.sin(t/900)*.06; ctx.save(); ctx.translate(rx, ry); ctx.scale(s, s);
      [-1, 1].forEach(sd => { ctx.save(); ctx.scale(sd, 1); ctx.rotate(-fl); ctx.beginPath(); ctx.moveTo(4, -4); ctx.bezierCurveTo(18, -22, 34, -30, 52, -24); // wing: the leading edge, then fingered primaries
        for (let f=0;f<6;f++){ const a = 52 - f*3.2, b = -24 + f*4.2; ctx.lineTo(a + 5, b + 3); ctx.lineTo(a - 1, b + 4.6); } ctx.bezierCurveTo(30, 4, 16, 8, 4, 6); ctx.closePath(); ctx.fillStyle = '#08080b'; ctx.fill();
        ctx.strokeStyle = 'rgba(106,111,122,.45)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(4, -4); ctx.bezierCurveTo(18, -22, 34, -30, 52, -24); ctx.stroke(); ctx.strokeStyle = 'rgba(106,111,122,.2)'; for (let f=0;f<5;f++){ ctx.beginPath(); ctx.moveTo(10 + f*6, -8 - f*2); ctx.lineTo(18 + f*6, 2 - f*.5); ctx.stroke(); } ctx.restore(); });
      ell(ctx, 0, 4, 7, 15, '#070709'); poly(ctx, [[-5, 16],[5, 16],[8, 28],[0, 25],[-8, 28]], '#08080b'); // body, tail fanned
      ell(ctx, 0, -10, 6, 6.4, '#09090c'); poly(ctx, [[-2.6, -8],[2.6, -8],[0, 1.5]], '#1a1a20'); ctx.fillStyle = 'rgba(160,168,184,.6)'; ctx.fillRect(-.3, -8, .6, 8.5); // the head, the heavy beak
      ctx.fillStyle = `rgba(255,236,190,${.7 + Math.sin(t/500)*.3})`; ctx.fillRect(2, -12, 1.8, 1.4); glow(ctx, 2.9, -11.3, 5, '#ffe0a0', .4); ctx.restore(); // one eye catching the moon
      for (let i=0;i<3;i++){ const k = ((t/5000 + i/3) % 1), fx = rx + (hash(i,51) - .5)*pw*.6 + Math.sin(t/700 + i)*6, fy = ry + pw*.1 + k*(gy - ry - pw*.1); ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.sin(t/400 + i)*.8); ell(ctx, 0, 0, pw*.012, pw*.035, `rgba(10,10,14,${.9*(1 - k*.6)})`); ctx.restore(); } // a feather or two, falling
      break; }
    case 'assassin': { // a hooded figure crouched on a roof's edge, half of it gone into shadow; rope, knives
      ctx.fillStyle = '#0a0a10'; poly(ctx, [[px, gy - ph*.08],[px + pw*.55, gy - ph*.2],[px + pw, gy - ph*.12],[px + pw, gy + 4],[px, gy + 4]], '#0b0a0e'); ctx.strokeStyle = 'rgba(154,134,224,.2)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, gy - ph*.08); ctx.lineTo(px + pw*.55, gy - ph*.2); ctx.lineTo(px + pw, gy - ph*.12); ctx.stroke(); // the roof ridge
      ctx.strokeStyle = '#6b6155'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(px + pw*.9, py); ctx.quadraticCurveTo(px + pw*.8, py + ph*.3, cx + pw*.08, py + ph*.42); ctx.stroke(); // the rope
      const fx = cx - pw*.02, fy = py + ph*.5, s = pw/100; for (let i=0;i<5;i++){ const a = t/800 + i; ell(ctx, fx + pw*.1 + Math.cos(a)*pw*.2, fy - ph*.05 + Math.sin(a*.7)*ph*.12, pw*.1, ph*.04, 'rgba(154,134,224,.05)'); } // shadow moving round it
      ctx.save(); ctx.translate(fx, fy); ctx.scale(s, s);
      poly(ctx, [[-22, 20],[-20, 4],[-12, -8],[-8, -20],[0, -26],[9, -20],[12, -8],[20, 2],[24, 20]], '#08070b'); ell(ctx, 1, -15, 5.6, 6, '#020203'); // the hood, the cloak spread
      ctx.fillStyle = 'rgba(210,200,190,.8)'; ctx.fillRect(-2.6, -15.8, 1.6, .9); ctx.fillRect(1.6, -15.8, 1.6, .9); // eyes in the hood
      ctx.strokeStyle = '#d8d0c0'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-18, 8); ctx.lineTo(-26, 0); ctx.moveTo(18, 6); ctx.lineTo(28, -4); ctx.stroke(); ctx.fillStyle = '#e8e4f0'; ctx.fillRect(-26.6, -.8, 1.4, 1.4); ctx.fillRect(27.6, -4.6, 1.4, 1.4); ctx.restore(); // knives
      const sh = ctx.createLinearGradient(fx - pw*.05, 0, fx + pw*.3, 0); sh.addColorStop(0, 'rgba(12,10,20,0)'); sh.addColorStop(.6, 'rgba(12,10,20,.85)'); sh.addColorStop(1, 'rgba(12,10,20,.95)'); ctx.fillStyle = sh; ctx.fillRect(fx, py, pw*.5, ph); break; } // half of it in shadow
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
    case 'sceptre': { const x0 = cx - pw*.12, y0 = py + ph*.78, x1 = cx + pw*.1, y1 = py + ph*.22, g = ctx.createLinearGradient(x0 - 4, 0, x0 + 4, 0); g.addColorStop(0, '#a8a090'); g.addColorStop(1, '#3a3630'); // an iron rod with a crowned head, standing in the dark
      ctx.strokeStyle = g; ctx.lineWidth = pw*.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.lineCap = 'butt'; [.25, .5, .75].forEach(k => ell(ctx, lerp(x0, x1, k), lerp(y0, y1, k), pw*.024, pw*.012, '#6b6155', -.9));
      ell(ctx, x1, y1 - pw*.02, pw*.055, pw*.055, '#8d8a86'); for (let i=0;i<5;i++){ const a = -Math.PI*.9 + i*Math.PI*.2; poly(ctx, [[x1 + Math.cos(a)*pw*.04, y1 - pw*.02 + Math.sin(a)*pw*.04],[x1 + Math.cos(a)*pw*.09, y1 - pw*.02 + Math.sin(a)*pw*.09],[x1 + Math.cos(a + .2)*pw*.045, y1 - pw*.02 + Math.sin(a + .2)*pw*.045]], '#8d8a86'); }
      ell(ctx, x1, y1 - pw*.02, pw*.022, pw*.022, `rgba(232,192,115,${.6 + Math.sin(t/600)*.2})`); glow(ctx, x1, y1, pw*.2, '#bdb3a3', .2); break; }
    case 'orb': { const oy = py + ph*.44, r = pw*.2; ell(ctx, cx, oy + r*1.1, r*.7, r*.18, 'rgba(0,0,0,.5)'); poly(ctx, [[cx - r*.45, oy + r*1.1],[cx - r*.25, oy + r*.85],[cx + r*.25, oy + r*.85],[cx + r*.45, oy + r*1.1]], '#3a3630'); // a glass orb on an iron stand, something turning inside
      ell(ctx, cx, oy, r, r, '#1a1918'); for (let i=0;i<3;i++){ const a = t/1400 + i*2.1; ctx.strokeStyle = `rgba(189,179,163,${.18 + i*.06})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, oy, r*.8, r*(.2 + i*.15), a, 0, 7); ctx.stroke(); }
      ctx.strokeStyle = '#8d8a86'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, oy, r, 0, 7); ctx.stroke(); glow(ctx, cx - r*.35, oy - r*.35, r*.5, '#e8e0d0', .35); ell(ctx, cx - r*.4, oy - r*.4, r*.12, r*.07, 'rgba(255,255,250,.5)', -.7); break; }
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
    if (k < 1 || (refuse && t < 2400) || ['oponn','chains','crown','blank','knight','raven','hounds','magi'].includes(id)) requestAnimationFrame(fr); }
  requestAnimationFrame(fr);
}

