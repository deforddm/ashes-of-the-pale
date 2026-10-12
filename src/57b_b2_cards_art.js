/* ============ Book Two's cards: the picture panels (20 drawCard calls CARDART[id] when there is no painted deck/ face) ============
   Each paints inside the card's picture panel {px, py, pw, ph}; gy is the ground line, t the time for the slow movement. */
{
  const frame = (P) => { const X = x => P.px + x / 100 * P.pw, Y = y => P.py + y / 100 * P.ph, u = P.pw / 100; return {X, Y, u}; };

  /* King of High House Death: a hooded figure on a backless grey seat, and behind it a gate the size of the world, the dead walking in */
  CARDART.b2c_king = (ctx, P) => { const {X, Y, u} = frame(P), t = P.t;
    const sky = ctx.createLinearGradient(0, P.py, 0, P.gy); sky.addColorStop(0, '#d8dcd2'); sky.addColorStop(1, '#8e948a'); ctx.fillStyle = sky; ctx.fillRect(P.px, P.py, P.pw, P.gy - P.py); // a white sky, no sun
    ctx.fillStyle = '#5e6158'; ctx.fillRect(P.px, P.gy - 6*u, P.pw, P.ph); // a grey plain
    // the gate: two posts and a lintel of bodies, slowly moving
    const post = (x0) => { ctx.fillStyle = '#3c3e38'; ctx.fillRect(X(x0), Y(10), 12*u, P.gy - Y(10) - 6*u);
      for (let i = 0; i < 9; i++) ell(ctx, X(x0 + 3 + hash(i, x0) * 6) + Math.sin(t/1400 + i + x0) * u, Y(14 + i * 7.4), 3.4*u, 2.2*u, 'rgba(150,154,144,.55)', Math.sin(t/1800 + i) * .6); };
    post(10); post(78);
    ctx.fillStyle = '#3c3e38'; ctx.fillRect(X(10), Y(6), 80*u, 9*u);
    for (let i = 0; i < 12; i++) ell(ctx, X(14 + i * 6.4) + Math.sin(t/1500 + i) * u, Y(10.5), 2.8*u, 1.8*u, 'rgba(150,154,144,.5)', .4 + Math.sin(t/1700 + i) * .5);
    const thru = ctx.createLinearGradient(X(22), 0, X(78), 0); thru.addColorStop(0, '#f2f4ee'); thru.addColorStop(.5, '#ffffff'); thru.addColorStop(1, '#f2f4ee'); ctx.fillStyle = thru; ctx.fillRect(X(22), Y(15), 56*u, P.gy - Y(15) - 6*u); // the light through it, from nowhere
    // the dead, walking in, unhurried
    for (let i = 0; i < 9; i++) { const k = ((t / 9000) + i / 9) % 1, x = X(24 + hash(i, 3) * 52), y = P.gy - 6*u - k * 26*u, s = (1 - k * .7) * u, a = .75 * (1 - k);
      if (a < .05) continue; ctx.fillStyle = `rgba(70,74,66,${a})`; ctx.fillRect(x - 1.6*s, y - 9*s, 3.2*s, 9*s); ell(ctx, x, y - 10.4*s, 1.6*s, 1.7*s, `rgba(70,74,66,${a})`); }
    // the seat, and the King on it
    const sx = P.cx, sy = P.gy - 2*u; poly(ctx, [[sx - 16*u, sy], [sx - 14*u, sy - 13*u], [sx + 14*u, sy - 13*u], [sx + 16*u, sy]], '#2a2c27');
    poly(ctx, [[sx - 13*u, sy - 12*u], [sx - 11*u, sy - 38*u], [sx - 6*u, sy - 50*u], [sx, sy - 54*u], [sx + 6*u, sy - 50*u], [sx + 11*u, sy - 38*u], [sx + 13*u, sy - 12*u], [sx + 18*u, sy + 1*u], [sx - 18*u, sy + 1*u]], '#1b1d19'); // the robe, the hood
    ell(ctx, sx, sy - 45*u, 4.4*u, 5.2*u, '#050605'); // no face in the hood
    ctx.fillStyle = `rgba(200,214,190,${.35 + Math.sin(t/900) * .2})`; ctx.fillRect(sx - 2.4*u, sy - 46*u, 1.2*u, .8*u); ctx.fillRect(sx + 1.2*u, sy - 46*u, 1.2*u, .8*u);
    ell(ctx, sx - 3*u, sy - 22*u, 4*u, 2.6*u, '#a8ab9f'); ell(ctx, sx + 3*u, sy - 21.4*u, 4*u, 2.6*u, '#9a9d92'); // hands folded, grey
    glow(ctx, sx, sy - 30*u, P.pw * .4, P.hue, .08 + Math.sin(t/1200) * .03); };

  /* Queen of High House Life: a veiled woman in a night garden, a cup overflowing in her lap, the water greening the dry ground */
  CARDART.b2c_queen = (ctx, P) => { const {X, Y, u} = frame(P), t = P.t;
    const sky = ctx.createLinearGradient(0, P.py, 0, P.gy); sky.addColorStop(0, '#0a0c18'); sky.addColorStop(1, '#1a1a2c'); ctx.fillStyle = sky; ctx.fillRect(P.px, P.py, P.pw, P.gy - P.py);
    for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(230,220,240,${.3 + Math.sin(t/700 + i * 2) * .25})`; ctx.fillRect(X(hash(i, 61) * 100), Y(hash(i, 62) * 40), 1.2, 1.2); } // stars
    ell(ctx, X(78), Y(14), 7*u, 7*u, '#e8e4d8'); ell(ctx, X(81), Y(12.6), 6.4*u, 6.4*u, '#0c0e1a'); glow(ctx, X(78), Y(14), 20*u, '#e8e4f0', .18); // a thin moon
    ctx.fillStyle = '#16120e'; ctx.fillRect(P.px, P.gy - 4*u, P.pw, P.ph); // the dry ground
    // trees of the garden, dark against the sky
    [[8, 30, 14], [92, 34, 12], [20, 40, 9]].forEach(([x, y, r], i) => { ctx.fillStyle = '#0b100c'; ctx.fillRect(X(x) - u, Y(y), 2*u, P.gy - Y(y)); ell(ctx, X(x), Y(y), r*u, r*.8*u, '#0d140f'); ell(ctx, X(x) + 3*u, Y(y) - 3*u, r*.6*u, r*.5*u, '#111a13'); });
    // the queen, seated, veiled
    const qx = P.cx, qy = P.gy - 6*u;
    poly(ctx, [[qx - 20*u, qy + 4*u], [qx - 14*u, qy - 20*u], [qx - 8*u, qy - 34*u], [qx, qy - 40*u], [qx + 8*u, qy - 34*u], [qx + 14*u, qy - 20*u], [qx + 20*u, qy + 4*u]], '#3a2a3a'); // the gown
    poly(ctx, [[qx - 7*u, qy - 33*u], [qx - 6*u, qy - 46*u], [qx, qy - 50*u], [qx + 6*u, qy - 46*u], [qx + 7*u, qy - 33*u], [qx, qy - 30*u]], 'rgba(226,214,226,.85)'); // the veil
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = .7; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(qx + i * 1.6*u, qy - 48*u); ctx.lineTo(qx + i * 2.6*u, qy - 32*u); ctx.stroke(); }
    // the cup in her lap, overflowing
    const cx = qx, cy = qy - 14*u; poly(ctx, [[cx - 5*u, cy - 4*u], [cx + 5*u, cy - 4*u], [cx + 3*u, cy + 1*u], [cx + 1*u, cy + 2*u], [cx + 1*u, cy + 5*u], [cx + 3*u, cy + 6*u], [cx - 3*u, cy + 6*u], [cx - 1*u, cy + 5*u], [cx - 1*u, cy + 2*u], [cx - 3*u, cy + 1*u]], '#c9a04a');
    ell(ctx, cx, cy - 4*u, 5*u, 1.2*u, '#8ec8e8'); glow(ctx, cx, cy - 4*u, 10*u, '#bfe6ff', .3 + Math.sin(t/600) * .1);
    // the water running down and away, and green where it touches
    ctx.strokeStyle = 'rgba(160,214,240,.75)'; ctx.lineWidth = 1.4*u; ctx.beginPath(); ctx.moveTo(cx + 5*u, cy - 4*u); ctx.quadraticCurveTo(cx + 14*u, cy + 8*u, cx + 10*u, P.gy - 3*u); ctx.quadraticCurveTo(cx + 18*u, P.gy + 2*u, X(96), P.gy + 1*u); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 5*u, cy - 4*u); ctx.quadraticCurveTo(cx - 13*u, cy + 10*u, cx - 12*u, P.gy - 3*u); ctx.quadraticCurveTo(cx - 22*u, P.gy + 2*u, X(4), P.gy + 2*u); ctx.stroke();
    for (let i = 0; i < 9; i++) { const k = ((t / 1600) + i / 9) % 1; ell(ctx, cx + (i % 2 ? 1 : -1) * (5 + k * 8)*u, cy - 3*u + k * 18*u, .9*u, 1.3*u, `rgba(190,230,255,${.8 * (1 - k)})`); } // drops
    for (let i = 0; i < 16; i++) { const x = X(4 + hash(i, 71) * 92), h = (3 + hash(i, 72) * 6) * u * (.8 + Math.sin(t/1100 + i) * .2); ctx.strokeStyle = '#4f9a5a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, P.gy + 1*u); ctx.lineTo(x + (hash(i, 73) - .5) * 3*u, P.gy + 1*u - h); ctx.stroke(); if (i % 3 === 0) ell(ctx, x, P.gy + 1*u - h, 1.3*u, 1.3*u, '#e8b4c8'); } // shoots, a flower or two
    glow(ctx, qx, qy - 20*u, P.pw * .45, P.hue, .1); };

  /* Mason of High House Death: a bent figure with mallet and chisel, cutting a long stone to fit the door of a barrow */
  CARDART.b2c_mason = (ctx, P) => { const {X, Y, u} = frame(P), t = P.t;
    const sky = ctx.createLinearGradient(0, P.py, 0, P.gy); sky.addColorStop(0, '#120e0a'); sky.addColorStop(1, '#3a2c1e'); ctx.fillStyle = sky; ctx.fillRect(P.px, P.py, P.pw, P.gy - P.py); // a dusk the colour of dust
    // the barrow, a long mound with a black door in it
    poly(ctx, [[X(40), P.gy], [X(52), Y(52)], [X(70), Y(44)], [X(92), Y(48)], [X(104), P.gy]], '#241b12'); ctx.strokeStyle = 'rgba(192,160,122,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(40), P.gy); ctx.lineTo(X(52), Y(52)); ctx.lineTo(X(70), Y(44)); ctx.lineTo(X(92), Y(48)); ctx.stroke();
    poly(ctx, [[X(64), P.gy], [X(64), Y(62)], [X(70), Y(57)], [X(80), Y(57)], [X(86), Y(62)], [X(86), P.gy]], '#030202'); // the doorway
    poly(ctx, [[X(62), Y(62)], [X(70), Y(55)], [X(80), Y(55)], [X(88), Y(62)], [X(86), Y(63)], [X(80), Y(58)], [X(70), Y(58)], [X(64), Y(63)]], '#6a5c4c'); // the lintel stones
    ctx.fillStyle = '#0d0a07'; ctx.fillRect(P.px, P.gy, P.pw, P.ph);
    // the long stone, lying on rollers, nearly cut
    const st = ctx.createLinearGradient(0, Y(74), 0, Y(82)); st.addColorStop(0, '#a89a86'); st.addColorStop(1, '#5a5046'); poly(ctx, [[X(8), Y(82)], [X(12), Y(74)], [X(58), Y(72)], [X(60), Y(80)]], st);
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(X(16 + i * 9), Y(74.5)); ctx.lineTo(X(15 + i * 9), Y(81)); ctx.stroke(); } // the chisel lines
    ell(ctx, X(18), Y(83), 2.4*u, 2.4*u, '#3a2e22'); ell(ctx, X(50), Y(82), 2.4*u, 2.4*u, '#3a2e22');
    // the mason, bent over it, mallet up, lit from the west
    glow(ctx, X(34), Y(58), 26*u, '#e0b070', .22);
    const mx = X(34), my = Y(71), sw = Math.sin(t/260); const lift = Math.max(0, sw);
    poly(ctx, [[mx - 9*u, my], [mx - 10*u, my - 12*u], [mx - 4*u, my - 22*u], [mx + 5*u, my - 24*u], [mx + 9*u, my - 18*u], [mx + 7*u, my]], '#6a523a'); // back, bent
    poly(ctx, [[mx - 6*u, my - 8*u], [mx + 6*u, my - 10*u], [mx + 5*u, my], [mx - 5*u, my]], '#a08a66'); // the apron, dusty
    ell(ctx, mx + 8*u, my - 22*u, 3.6*u, 3.8*u, '#54402c'); // the head, bowed
    ctx.strokeStyle = '#6a523a'; ctx.lineWidth = 2.4*u; ctx.beginPath(); ctx.moveTo(mx + 4*u, my - 16*u); ctx.lineTo(mx + 12*u, my - 6*u); ctx.stroke(); // the chisel arm
    ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 1.2*u; ctx.beginPath(); ctx.moveTo(mx + 12*u, my - 6*u); ctx.lineTo(mx + 13*u, my + 1*u); ctx.stroke(); // the chisel
    const ha = -.5 - lift * 1.1, hx = mx - 2*u, hy = my - 18*u, ex = hx + Math.cos(ha) * 14*u, ey = hy + Math.sin(ha) * 14*u;
    ctx.strokeStyle = '#6a523a'; ctx.lineWidth = 2.4*u; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke(); // the mallet arm
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(ha + Math.PI / 2); ctx.fillStyle = '#8a6a44'; ctx.fillRect(-4*u, -2.4*u, 8*u, 4.8*u); ctx.restore(); // the mallet
    if (sw < -.85) for (let i = 0; i < 6; i++) ell(ctx, mx + 13*u + (hash(i, Math.floor(t/260)) - .5) * 8*u, my - hash(i, 9) * 6*u, .8*u, .8*u, 'rgba(232,210,170,.8)'); // chips fly
    for (let i = 0; i < 18; i++) { const k = ((t / 7000) + hash(i, 81)) % 1; ell(ctx, X(hash(i, 82) * 100), Y(80 - k * 70), .7*u, .7*u, `rgba(192,160,122,${.35 * (1 - k)})`); } // dust in the air
    glow(ctx, X(75), Y(70), P.pw * .3, P.hue, .07); };

  /* Soldier of High House Death: a grey soldier at a grey gate, shield up, and behind the visor not quite a face */
  CARDART.b2c_soldier = (ctx, P) => { const {X, Y, u} = frame(P), t = P.t;
    const sky = ctx.createLinearGradient(0, P.py, 0, P.gy); sky.addColorStop(0, '#2a2e30'); sky.addColorStop(1, '#5a6064'); ctx.fillStyle = sky; ctx.fillRect(P.px, P.py, P.pw, P.gy - P.py);
    ctx.fillStyle = '#3a3e40'; ctx.fillRect(P.px, P.gy - 3*u, P.pw, P.ph);
    // the gate behind: two great dark posts, a white nothing between them
    ctx.fillStyle = '#16191b'; ctx.fillRect(X(6), Y(4), 16*u, P.gy - Y(4)); ctx.fillRect(X(78), Y(4), 16*u, P.gy - Y(4)); ctx.fillRect(X(6), Y(2), 88*u, 8*u);
    const w = ctx.createLinearGradient(0, Y(10), 0, P.gy); w.addColorStop(0, '#e8ecec'); w.addColorStop(1, '#aeb6b8'); ctx.fillStyle = w; ctx.fillRect(X(22), Y(10), 56*u, P.gy - Y(10) - 3*u);
    for (let i = 0; i < 5; i++) { const k = ((t / 6000) + i / 5) % 1; ell(ctx, X(30 + hash(i, 91) * 40), Y(60 - k * 40), (6 + k * 10)*u, 2*u, `rgba(255,255,255,${.25 * (1 - k)})`); } // mist going through
    // the soldier, front on
    const sx = P.cx, gy = P.gy - 2*u, br = Math.sin(t/1600) * .4*u;
    ctx.fillStyle = '#2a2f33'; ctx.fillRect(sx - 7*u, gy - 18*u, 5*u, 18*u); ctx.fillRect(sx + 2*u, gy - 18*u, 5*u, 18*u); // legs, greaves
    poly(ctx, [[sx - 11*u, gy - 16*u], [sx - 12*u, gy - 40*u + br], [sx, gy - 44*u + br], [sx + 12*u, gy - 40*u + br], [sx + 11*u, gy - 16*u]], '#5d666c'); // grey mail, no badge
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = .6; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(sx - 11*u, gy - 18*u - i * 3.4*u + br); ctx.lineTo(sx + 11*u, gy - 18*u - i * 3.4*u + br); ctx.stroke(); }
    // the helm, the visor, and behind it not quite a face
    poly(ctx, [[sx - 6*u, gy - 44*u + br], [sx - 6.5*u, gy - 54*u + br], [sx, gy - 58*u + br], [sx + 6.5*u, gy - 54*u + br], [sx + 6*u, gy - 44*u + br]], '#6f787e');
    ctx.fillStyle = '#060707'; ctx.fillRect(sx - 4.6*u, gy - 52*u + br, 9.2*u, 1.8*u);
    ctx.fillStyle = `rgba(210,226,230,${.25 + Math.sin(t/700) * .2})`; ctx.fillRect(sx - 3.4*u, gy - 51.6*u + br, 1.2*u, 1*u); ctx.fillRect(sx + 2.2*u, gy - 51.6*u + br, 1.2*u, 1*u);
    // the spear, upright
    ctx.strokeStyle = '#2a241c'; ctx.lineWidth = 1.6*u; ctx.beginPath(); ctx.moveTo(sx + 14*u, gy + 1*u); ctx.lineTo(sx + 14*u, Y(14)); ctx.stroke(); poly(ctx, [[sx + 14*u, Y(8)], [sx + 16*u, Y(14)], [sx + 12*u, Y(14)]], '#9aa6ae');
    // the shield, up, a grey round with nothing painted on it
    const shx = sx - 6*u, shy = gy - 28*u + br; ell(ctx, shx, shy, 11*u, 13*u, '#4a5258'); ctx.strokeStyle = '#9aa6ae'; ctx.lineWidth = 1.2*u; ctx.beginPath(); ctx.ellipse(shx, shy, 11*u, 13*u, 0, 0, 7); ctx.stroke(); ell(ctx, shx, shy, 2.6*u, 2.6*u, '#8a949a');
    glow(ctx, sx, gy - 30*u, P.pw * .4, P.hue, .08 + Math.sin(t/1100) * .03); };
}
