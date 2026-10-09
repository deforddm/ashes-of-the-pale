/* ============ the crate lid: Rumjugs and Sweetlard ============
   An easter egg (v3.13). Soldiers have always painted the things they carry. Somebody painted the lid of a Moranth munitions
   crate in the old poster style: two big cheerful women, one flexing with a rum jug on her arm, one winking over a tray of
   honey-cakes, one of them fused. Nobody at the crossing knows who they are. In years to come they will be Bonehunters,
   and make munitions for a dead man called Hedge. Painted once into the canvas; it does not move. */
function drawPinup(cv){
  if (!cv) return; const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, r = PR.rng(1186);
  ctx.save(); ctx.scale(W/600, H/760);
  const planks = [0, 253, 507, 760], pcol = ['#b48656', '#a97d4d', '#b98f5d'];
  /* ---- the lid: three pine planks, grain, knots ---- */
  for (let i=0;i<3;i++){ const y0 = planks[i], y1 = planks[i+1];
    ctx.fillStyle = PR.lin(ctx, 0, y0, 0, y1, [[0, shade(pcol[i], .1)], [.5, pcol[i]], [1, shade(pcol[i], -.18)]]); ctx.fillRect(0, y0, 600, y1 - y0);
    ctx.lineCap = 'round'; for (let g=0; g<44; g++){ const gy = y0 + 4 + r()*(y1 - y0 - 8), a = .06 + r()*.12, ph = r()*6, amp = 1 + r()*3;
      ctx.strokeStyle = `rgba(70,40,16,${a})`; ctx.lineWidth = .6 + r()*1.2; ctx.beginPath(); for (let x=-10; x<=610; x+=20){ const y = gy + Math.sin(x/90 + ph)*amp; x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    const kx = 60 + r()*480, ky = y0 + 40 + r()*(y1 - y0 - 80); for (let k=0;k<5;k++){ ctx.strokeStyle = `rgba(80,44,16,${.35 - k*.05})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(kx, ky, 6 + k*5, 3 + k*2.2, 0, 0, 7); ctx.stroke(); }
    ell(ctx, kx, ky, 5, 2.6, 'rgba(70,36,12,.7)'); }
  /* ---- the stencil under the paint ---- */
  ctx.save(); ctx.font = '700 30px "IM Fell English SC", Georgia, serif'; ctx.fillStyle = 'rgba(60,16,10,.42)'; ctx.textAlign = 'left';
  ctx.fillText('MORANTH · MUNITIONS', 34, 50); ctx.textAlign = 'right'; ctx.fillText('THIS SIDE UP ↑  · DO NOT DROP', 572, 742); ctx.restore();
  /* ---- the painted panel: an arched field, a sunburst, a red and gold border ---- */
  const panel = () => { ctx.beginPath(); ctx.moveTo(30, 700); ctx.lineTo(30, 250); ctx.bezierCurveTo(30, 120, 160, 70, 300, 70); ctx.bezierCurveTo(440, 70, 570, 120, 570, 250); ctx.lineTo(570, 700); ctx.quadraticCurveTo(570, 716, 554, 716); ctx.lineTo(46, 716); ctx.quadraticCurveTo(30, 716, 30, 700); ctx.closePath(); };
  ctx.save(); panel(); ctx.clip();
  ctx.fillStyle = PR.rad(ctx, 300, 330, 20, 460, [[0, '#fbeec8'], [.55, '#f0d69a'], [1, '#d8a868']]); ctx.fillRect(0, 0, 600, 760);
  for (let i=0;i<28;i++){ const a0 = i/28*Math.PI*2, a1 = a0 + Math.PI/28; if (i % 2) continue; ctx.fillStyle = 'rgba(255,248,224,.38)'; ctx.beginPath(); ctx.moveTo(300, 330); ctx.lineTo(300 + Math.cos(a0)*900, 330 + Math.sin(a0)*900); ctx.lineTo(300 + Math.cos(a1)*900, 330 + Math.sin(a1)*900); ctx.closePath(); ctx.fill(); }
  /* stars and hearts in the field */
  const star = (x, y, s, col) => { ctx.beginPath(); for (let i=0;i<10;i++){ const a = -Math.PI/2 + i*Math.PI/5, rr = i % 2 ? s*.42 : s; ctx.lineTo(x + Math.cos(a)*rr, y + Math.sin(a)*rr); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(90,40,10,.6)'; ctx.lineWidth = 1.4; ctx.stroke(); };
  const heart = (x, y, s, col) => { ctx.beginPath(); ctx.moveTo(x, y + s*.9); ctx.bezierCurveTo(x - s*1.3, y + s*.1, x - s*.9, y - s*.9, x, y - s*.3); ctx.bezierCurveTo(x + s*.9, y - s*.9, x + s*1.3, y + s*.1, x, y + s*.9); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(80,10,10,.6)'; ctx.lineWidth = 1.3; ctx.stroke(); };
  [[82, 236, 15], [520, 226, 12], [300, 214, 11], [140, 300, 8], [470, 296, 9], [62, 470, 10], [544, 452, 9]].forEach(([x, y, s]) => star(x, y, s, '#f2c14a'));
  heart(470, 360, 11, '#d8443a'); heart(500, 336, 7, '#e0584a');
  /* ---- the two of them, in bust units (shoulders at y = 0, about 2.5 px to the unit) ---- */
  const K = 2.25, OY = 503, line = 'rgba(40,16,8,.8)';
  const bigHead = f => { ctx.save(); ctx.translate(0, -50); ctx.scale(1.16, 1.16); ctx.translate(0, 50); f(); ctx.restore(); }; // poster heads run large
  const lift = (F, x) => { ctx.save(); ctx.globalCompositeOperation = 'screen'; PR.soft(ctx, (x || 0) + F.w*.35, F.cy + 2, F.w*.95, 19, '#8a5a34', .55); PR.soft(ctx, (x || 0) - F.w*.2, F.cy - 2, F.w*.8, 16, '#4a3020', .35); ctx.restore(); }; // a poster's light, not a lantern's
  /* an hourglass: shoulders, bust, waist, hips (bust units, the neck's base at y = -50) */
  const hg = (sh, bu, wa, hi) => { ctx.beginPath(); ctx.moveTo(-8.5, -51); ctx.quadraticCurveTo(-17, -48.5, -sh*.62, -43.6); ctx.bezierCurveTo(-sh*.9, -42, -sh, -37, -sh, -30);
    ctx.bezierCurveTo(-bu, -24, -bu*1.01, -15, -bu*.93, -8); ctx.bezierCurveTo(-wa*1.06, -1, -wa, 8, -wa, 14); ctx.bezierCurveTo(-wa, 24, -hi, 32, -hi, 48); ctx.lineTo(-hi, 110);
    ctx.lineTo(hi, 110); ctx.lineTo(hi, 48); ctx.bezierCurveTo(hi, 32, wa, 24, wa, 14); ctx.bezierCurveTo(wa, 8, wa*1.06, -1, bu*.93, -8); ctx.bezierCurveTo(bu*1.01, -15, bu, -25, sh, -30);
    ctx.bezierCurveTo(sh, -37, sh*.9, -42, sh*.62, -43.6); ctx.quadraticCurveTo(17, -48.5, 8.5, -51); ctx.closePath(); };
  /* the skin of the upper chest: collarbones, the bust above the neckline, the cleavage between */
  const fig = o => { hg(o.sh, o.bu, o.wa, o.hi); [-1, 1].forEach(sd => { ctx.moveTo(sd*o.bx + o.rx, o.by); ctx.ellipse(sd*o.bx, o.by, o.rx, o.ry, 0, 0, Math.PI*2, true); }); }; // the torso and the bust, as one shape
  const chest = (o, skin) => { const {sh, bx, by, rx, ry} = o;
    fig(o); ctx.strokeStyle = line; ctx.lineWidth = 2.2; ctx.stroke(); // the outline, before the fill covers its inside half
    fig(o); ctx.fillStyle = PR.lit(ctx, shade(skin, .1), shade(skin, -.36), -bx - rx, (bx + rx)*1.7); ctx.fill();
    ctx.save(); fig(o); ctx.clip();
    PR.soft(ctx, 0, -46, 14, 5, '#1a0a06', .28); // under the jaw's shadow
    [-1, 1].forEach(sd => { const cx = sd*bx;
      ell(ctx, cx, by, rx, ry, PR.rad(ctx, cx - rx*.38, by - ry*.42, 1, rx*1.25, [[0, shade(skin, .2)], [.55, skin], [1, shade(skin, sd < 0 ? -.28 : -.4)]]));
      ctx.strokeStyle = rgba('#3a1408', .5); ctx.lineWidth = .6; ctx.beginPath(); ctx.ellipse(cx, by, rx, ry, 0, Math.PI*(sd < 0 ? 1.08 : 1.42), Math.PI*(sd < 0 ? 1.58 : 1.92)); ctx.stroke(); // the upper curve
      PR.soft(ctx, cx - rx*.3, by - ry*.45, rx*.4, ry*.24, '#fff0e0', .34); }); // light on it
    PR.soft(ctx, 0, by - ry*.15, 3, ry*.7, '#2a0e06', .55); ctx.lineCap = 'round'; PR.stroke(ctx, rgba('#3a1408', .6), .65, () => { ctx.moveTo(-.6, by - ry*.66); ctx.quadraticCurveTo(-1.4, by - ry*.1, 0, by + ry*.5); }); // the cleavage
    PR.stroke(ctx, rgba('#5a2412', .35), .6, () => { [-1, 1].forEach(sd => { ctx.moveTo(sd*3.5, -44.5); ctx.quadraticCurveTo(sd*11, -43, sd*sh*.55, -43.2); }); }); // collarbones
    ctx.restore(); };
  /* a sweetheart neckline: two curves over the bust meeting low in the middle; the garment runs down to the waist from it */
  const sweet = (o, lift = 0) => { const {bx, by, rx, ry} = o, W = bx + rx + 3; ctx.moveTo(-W, by - ry*.12 + lift);
    ctx.bezierCurveTo(-bx - rx*.72, by - ry*.66 + lift, -bx + rx*.3, by - ry*.7 + lift, -1.2, by + ry*.3); ctx.lineTo(1.2, by + ry*.3);
    ctx.bezierCurveTo(bx - rx*.3, by - ry*.7 + lift, bx + rx*.72, by - ry*.66 + lift, W, by - ry*.12 + lift); };
  const wide = o => o.bx + o.rx + 3;
  /* a cup's shape under the cloth: a lit crown and the shadow beneath */
  const cups = (o, cloth) => { const {bx, by, rx, ry} = o; [-1, 1].forEach(sd => { const cx = sd*bx;
    PR.soft(ctx, cx - rx*.25, by + ry*.05, rx*.62, ry*.4, '#ffffff', sd < 0 ? .22 : .1); PR.soft(ctx, cx + sd*1, by + ry*.95, rx*.85, ry*.32, '#000000', .3);
    PR.stroke(ctx, rgba(cloth, .9), .7, () => { ctx.moveTo(cx - sd*rx*.95, by + ry*.1); ctx.quadraticCurveTo(cx - sd*rx*.6, by + ry*1.08, cx + sd*rx*.15, by + ry*.98); ctx.quadraticCurveTo(cx + sd*rx*.7, by + ry*.85, sd*1.5, by + ry*.45); }); }); };
  /* an arm as two tapered lengths with a bend: shoulder, elbow, wrist */
  const seg = (x0, y0, r0, x1, y1, r1, skin) => { const a = Math.atan2(y1 - y0, x1 - x0), h = Math.PI/2;
    ctx.beginPath(); ctx.moveTo(x0 + Math.cos(a + h)*r0, y0 + Math.sin(a + h)*r0); ctx.lineTo(x1 + Math.cos(a + h)*r1, y1 + Math.sin(a + h)*r1); ctx.arc(x1, y1, r1, a + h, a - h, true);
    ctx.lineTo(x0 + Math.cos(a - h)*r0, y0 + Math.sin(a - h)*r0); ctx.arc(x0, y0, r0, a - h, a + h, true); ctx.closePath();
    ctx.fillStyle = PR.lit(ctx, shade(skin, .08), shade(skin, -.4), Math.min(x0, x1) - r0, Math.max(x0, x1) + r0); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .9; ctx.stroke(); };
  /* a hand on a hip: the palm flat, the fingers forward and down, the thumb back */
  const hipHand = (x, y, sd, skin) => { ctx.save(); ctx.translate(x, y); ctx.rotate(sd*.5);
    ctx.beginPath(); ctx.moveTo(-4.4, -3); ctx.quadraticCurveTo(0, -5.2, 4.4, -3); ctx.lineTo(4.8, 4.4); ctx.quadraticCurveTo(0, 8, -4.8, 4.4); ctx.closePath(); ctx.fillStyle = PR.lit(ctx, shade(skin, .1), shade(skin, -.35), -5, 5); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.stroke();
    PR.stroke(ctx, rgba('#3a1408', .55), .5, () => { [-2.2, 0, 2.2].forEach(fx => { ctx.moveTo(fx, 0); ctx.lineTo(fx*1.05, 5.4); }); }); ctx.restore(); };
  /* a pin-up's eyes: a heavier lid and a flick at each outer corner */
  const lashes = (F, skip) => { const u = F.h/20; [-1, 1].forEach(sd => { if (sd === skip) return; const ex = sd*F.w*.4, ey = F.cy - u, ew = F.w*.2, ox = ex + sd*ew;
    ctx.lineCap = 'round'; PR.stroke(ctx, '#140806', 1.25, () => { ctx.moveTo(ex - ew*.8, ey - u*.95); ctx.quadraticCurveTo(ex, ey - u*2.6, ox, ey - .3); ctx.lineTo(ox + sd*1.5, ey - 1.4); }); }); };
  const sleeve = (x, y, rx, ry, rot, a, b, band = '#a8303a') => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath(); ctx.moveTo(-rx*.8, -ry); ctx.quadraticCurveTo(-rx*1.15, ry*.2, -rx*.7, ry); ctx.quadraticCurveTo(0, ry*1.25, rx*.7, ry); ctx.quadraticCurveTo(rx*1.15, ry*.2, rx*.8, -ry); ctx.quadraticCurveTo(0, -ry*1.2, -rx*.8, -ry); ctx.closePath();
    ctx.fillStyle = PR.lit(ctx, a, b, -rx, rx); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.stroke();
    PR.stroke(ctx, rgba('#6a5a40', .45), .45, () => { [-.45, 0, .45].forEach(k => { ctx.moveTo(k*rx, -ry*.9); ctx.quadraticCurveTo(k*rx*1.25, 0, k*rx, ry*.95); }); });
    PR.stroke(ctx, band, .9, () => { ctx.moveTo(-rx*.72, ry*.92); ctx.quadraticCurveTo(0, ry*1.2, rx*.72, ry*.92); }); ctx.restore(); };
  const limb = (pts, skin) => { PR.path(ctx, pts); ctx.fillStyle = PR.lit(ctx, shade(skin, .06), shade(skin, -.38), Math.min(...pts.map(p => p[0])), Math.max(...pts.map(p => p[0]))); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke(); };
  const curl = (x, y, rr, col) => { ell(ctx, x, y, rr, rr, col); ctx.strokeStyle = shade(col, -.45); ctx.lineWidth = .7; ctx.beginPath(); for (let a=0; a<9; a+=.4){ const q = rr*(1 - a/10); ctx.lineTo(x + Math.cos(a)*q, y + Math.sin(a)*q); } ctx.stroke(); PR.soft(ctx, x - rr*.35, y - rr*.35, rr*.6, rr*.5, '#fff0d8', .25); };

  /* -- Rumjugs: kerchief and red curls, a chemise and a laced bodice losing the argument, one arm flexed with the jug on it, the other on her hip -- */
  ctx.save(); ctx.translate(200, OY); ctx.scale(K, K);
  const RJ = {cy:-76, w:14.2, h:20, jaw:.84, chin:5.2, skin:'#e0a880', iris:'#4e6a34', lip:'#cc2e3a', browCol:'#a04a22', browW:1.15, arch:1.7, browL:.8, browR:1, rim:'#ffd890', rimA:.22, nose:.94, smileL:2.8, smileR:2.8, mouthW:5.2, teeth:true, look:.15, flush:'#e66a50', open:1.15};
  const RB = {sh:37, bu:40, wa:29, hi:42, bx:22.6, by:-14, rx:24, ry:22}; // the name is not an accident
  bigHead(() => { [[-17, -66, 5], [-19, -74, 4.6], [17, -66, 5], [19, -74, 4.6], [-13, -59, 4], [13, -59, 4]].forEach(([x, y, s]) => curl(x, y, s, '#b44a24')); PR.neck(ctx, RJ, 8.6); }); // red curls behind; the neck
  chest(RB, RJ.skin);
  ctx.save(); fig(RB); ctx.clip();
  // the chemise: wide straps over the shoulders, a ruffle at the top of the bodice
  [-1, 1].forEach(sd => { PR.path(ctx, [[sd*12, -48.5], [sd*23, -46], [sd*(RB.sh + 2), -36], [sd*(RB.sh + 2), -29], [sd*25, -27.5], [sd*14, -36]]); ctx.fillStyle = PR.lit(ctx, '#fbf4e2', '#b4a888', -RB.sh, RB.sh); ctx.fill(); ctx.strokeStyle = 'rgba(110,96,70,.8)'; ctx.lineWidth = .6; ctx.stroke(); });
  ctx.beginPath(); sweet(RB, -2.4); ctx.lineTo(wide(RB), 30); ctx.lineTo(-wide(RB), 30); ctx.closePath(); ctx.fillStyle = '#f4ecd8'; ctx.fill(); // ruffle (the chemise above the bodice line)
  ctx.strokeStyle = 'rgba(120,104,76,.7)'; ctx.lineWidth = .5; ctx.beginPath(); sweet(RB, -2.4); ctx.stroke();
  // the bodice: quilted mustard, laced up the front, open at the top
  const bod = () => { ctx.beginPath(); sweet(RB); ctx.lineTo(wide(RB), 30); ctx.lineTo(-wide(RB), 30); ctx.closePath(); };
  bod(); ctx.fillStyle = PR.lit(ctx, '#e4ac40', '#6e4612', -wide(RB), wide(RB)*1.6); ctx.fill();
  ctx.save(); bod(); ctx.clip(); ctx.strokeStyle = 'rgba(90,50,10,.4)'; ctx.lineWidth = .6; ctx.beginPath(); for (let i=-12;i<12;i++){ ctx.moveTo(i*7, -40); ctx.lineTo(i*7 + 80, 40); ctx.moveTo(i*7, -40); ctx.lineTo(i*7 - 80, 40); } ctx.stroke();
  cups(RB, '#5a3408'); PR.path(ctx, [[-3.2, RB.by + RB.ry*.3], [3.2, RB.by + RB.ry*.3], [.6, 14], [-.6, 14]]); ctx.fillStyle = '#f0e6d0'; ctx.fill(); // the gap the laces don't close
  PR.stroke(ctx, '#4a2a10', .7, () => { for (let i=0;i<5;i++){ const y = RB.by + RB.ry*.4 + i*5.4, w = 3.6 - i*.55; ctx.moveTo(-w, y); ctx.lineTo(w, y + 4); ctx.moveTo(w, y); ctx.lineTo(-w, y + 4); } }); ctx.restore();
  bod(); ctx.strokeStyle = line; ctx.lineWidth = .9; ctx.stroke();
  ctx.fillStyle = PR.lin(ctx, 0, 15, 0, 21, [[0, '#4a2a14'], [1, '#22120a']]); ctx.fillRect(-50, 15, 100, 6); ell(ctx, -6, 18, 4.2, 3.8, '#e0b048'); ell(ctx, -6, 18, 2.2, 1.8, '#3a2410'); // belt, brass buckle
  ctx.fillStyle = PR.lit(ctx, '#6a4a30', '#2a1a10', -RB.hi, RB.hi); ctx.fillRect(-60, 21, 120, 100); // breeches
  ctx.restore();
  // the hip arm: a puffed chemise sleeve, elbow out (behind Sweetlard's), hand on the hip
  seg(RB.sh + 16, -4, 5.6, RB.sh - 4, 18, 4.4, RJ.skin); seg(RB.sh - 3, -37, 7.2, RB.sh + 16, -4, 5.8, RJ.skin); hipHand(RB.sh - 5, 21, 1, RJ.skin);
  PR.path(ctx, [[RB.sh - 8, -41], [RB.sh + 3, -44], [RB.sh + 8, -33], [RB.sh - 1, -28]]); ctx.fillStyle = PR.lit(ctx, '#fbf4e2', '#b4a888', RB.sh - 8, RB.sh + 8); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.stroke(); // the chemise sleeve, rolled
  bigHead(() => {
    RJ.under = (c, F) => PR.dots(c, F, 40, 'rgba(170,80,40,.32)', .5, [-3, 7, (x, y) => Math.abs(x) < 2.6 && y > 4]); // freckles
    PR.face(ctx, RJ); lift(RJ); lashes(RJ); PR.soft(ctx, -8, -68, 4.5, 3, '#ff7060', .3); PR.soft(ctx, 8, -68, 4.5, 3, '#ff7060', .24);
    const kp = () => { ctx.beginPath(); ctx.moveTo(-16.5, -84); ctx.bezierCurveTo(-17, -100, -9, -104, 0, -104); ctx.bezierCurveTo(9, -104, 17, -100, 16.5, -84); ctx.quadraticCurveTo(8, -90, 0, -90); ctx.quadraticCurveTo(-8, -90, -16.5, -84); ctx.closePath(); };
    kp(); ctx.fillStyle = PR.lit(ctx, '#e0402e', '#7a1812', -17, 17); ctx.fill(); ctx.save(); kp(); ctx.clip(); [[-11, -94], [-4, -99], [4, -95], [11, -98], [-8, -88], [8, -89], [0, -102], [13, -90]].forEach(([x, y]) => ell(ctx, x, y, 1.3, 1.2, '#f8f0e0')); ctx.restore(); kp(); ctx.strokeStyle = line; ctx.lineWidth = .9; ctx.stroke();
    [[-1, -.35], [1, .35]].forEach(([sd, a]) => { ctx.save(); ctx.translate(8.5 + sd*1.5, -104.5); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sd*3, -4.2, sd*7.4, -3.6); ctx.lineTo(sd*6.2, -1.2); ctx.lineTo(sd*7.8, .8); ctx.quadraticCurveTo(sd*3, 1.6, 0, 0); ctx.closePath(); ctx.fillStyle = sd < 0 ? '#d83a2c' : '#a8261e'; ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .7; ctx.stroke(); ell(ctx, sd*4.4, -1.4, .8, .7, '#f8f0e0'); ctx.restore(); }); ell(ctx, 8.5, -104.4, 2, 1.8, '#a8241e'); // the knot, two ends
    [[-12, -86, 2.6], [-7, -88, 2.4], [-2, -89, 2.2]].forEach(([x, y, s]) => curl(x, y, s, '#c0542a')); // curls escaping at the front
  });
  // the flexed arm: chemise sleeve rolled to the shoulder, the bicep, the fist, the jug sat on the muscle
  ctx.save(); ctx.translate(4, 0);
  limb([[-34, -45], [-44, -52], [-52, -57], [-60, -56], [-68, -52], [-76, -44], [-74, -38], [-62, -34], [-50, -29], [-38, -26]], RJ.skin);
  PR.stroke(ctx, 'rgba(90,30,10,.35)', .7, () => { ctx.moveTo(-54, -52); ctx.quadraticCurveTo(-59, -49, -64, -50); }); // the muscle's line
  limb([[-77, -46], [-64, -51], [-61, -84], [-71, -84]], RJ.skin);
  ell(ctx, -66, -91, 8.6, 8.2, PR.lit(ctx, shade(RJ.skin, .08), shade(RJ.skin, -.4), -75, -57)); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(-66, -91, 8.6, 8.2, 0, 0, 7); ctx.stroke();
  PR.stroke(ctx, 'rgba(60,20,8,.6)', .6, () => { for (let i=0;i<3;i++){ ctx.moveTo(-73, -95 + i*3.4); ctx.lineTo(-61, -95 + i*3.4); } ctx.moveTo(-74, -87); ctx.quadraticCurveTo(-68, -84, -60, -88); }); // fingers and thumb
  PR.path(ctx, [[-36, -46], [-41.5, -50.4], [-46.5, -53.4], [-47.6, -28.2], [-43, -26.4], [-38, -26]]); ctx.fillStyle = PR.lin(ctx, -47, 0, -36, 0, [[0, '#fbf6e8'], [1, '#c8bca0']]); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.stroke(); PR.stroke(ctx, 'rgba(110,96,70,.7)', .45, () => { ctx.moveTo(-44, -52); ctx.lineTo(-45.2, -27.4); ctx.moveTo(-41, -49); ctx.lineTo(-41.6, -26.6); }); // the sleeve, rolled
  const jug = () => { ctx.beginPath(); ctx.moveTo(-57, -56); ctx.bezierCurveTo(-63, -61, -63, -74, -55.5, -79); ctx.lineTo(-53.5, -81); ctx.lineTo(-53.5, -85); ctx.lineTo(-46.5, -85); ctx.lineTo(-46.5, -81); ctx.lineTo(-44.5, -79); ctx.bezierCurveTo(-37, -74, -37, -61, -43, -56); ctx.closePath(); };
  PR.stroke(ctx, '#5a3214', 2.2, () => { ctx.moveTo(-56, -79); ctx.bezierCurveTo(-63, -80, -64, -70, -60, -67); }); // the handle
  jug(); ctx.fillStyle = PR.lit(ctx, '#efe2c0', '#8a7a58', -62, -38); ctx.fill(); ctx.save(); jug(); ctx.clip(); ctx.fillStyle = PR.lit(ctx, '#8a5428', '#341c0a', -62, -38); ctx.fillRect(-64, -90, 30, 17); ctx.restore();
  jug(); ctx.strokeStyle = line; ctx.lineWidth = .9; ctx.stroke(); PR.soft(ctx, -56, -66, 2.4, 4, '#ffffff', .5);
  ctx.fillStyle = '#6a3a18'; ctx.font = '700 6.4px "IM Fell English SC", Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('RUM', -50, -63); ctx.font = '700 4px Georgia, serif'; ctx.fillText('X X X', -50, -59);
  ctx.fillStyle = PR.lin(ctx, -53, 0, -47, 0, [[0, '#d8b080'], [1, '#7a5430']]); ctx.fillRect(-52.5, -89, 5, 4.4);
  ctx.restore(); ctx.restore();

  /* -- Sweetlard: victory rolls and a flower, a wink, an off-the-shoulder blouse over a green bodice, a floury half-apron, one hand on her hip and the honey-cakes up in the other (one with a fuse) -- */
  ctx.save(); ctx.translate(396, OY + 4); ctx.scale(K, K);
  const SL = {cy:-75, w:15.4, h:20.4, jaw:.98, chin:7, skin:'#c08460', iris:'#3a2414', lip:'#c8304a', browCol:'#1a100a', browW:1.5, arch:1.6, browL:-.9, browR:1.4, rim:'#ffd0a0', rimA:.2, nose:1.02, smileL:2.4, smileR:1.7, mouthW:5, look:-.1, flush:'#e05a60'};
  const SB = {sh:38, bu:42, wa:31, hi:46, bx:24.6, by:-12, rx:26, ry:24};
  bigHead(() => { PR.path(ctx, [[-18, -96], [18, -96], [21, -66], [16, -58], [-16, -58], [-21, -66]]); ctx.fillStyle = PR.lit(ctx, '#3a2a20', '#0a0604', -21, 21); ctx.fill(); PR.neck(ctx, SL, 8.4); }); // hair behind; the neck
  // the hip arm first, its elbow over Rumjugs's
  chest(SB, SL.skin);
  ctx.save(); fig(SB); ctx.clip();
  // the blouse, off the shoulders, gathered on a drawstring across the bust
  const bl = () => { ctx.beginPath(); sweet(SB, 1); ctx.lineTo(wide(SB), 30); ctx.lineTo(-wide(SB), 30); ctx.closePath(); };
  bl(); ctx.fillStyle = PR.lit(ctx, '#fdf8ee', '#b8ae9a', -wide(SB), wide(SB)*1.6); ctx.fill(); ctx.save(); bl(); ctx.clip(); cups(SB, '#8a8070');
  PR.stroke(ctx, 'rgba(120,108,88,.55)', .45, () => { for (let i=-12;i<=12;i++){ const x = i*3.6, y0 = SB.by - SB.ry*.25 + Math.abs(x)*.05; ctx.moveTo(x, y0 + 1); ctx.lineTo(x + (x < 0 ? -.6 : .6), y0 + 7); } }); ctx.restore(); // the gathers
  ctx.strokeStyle = '#a8303a'; ctx.lineWidth = .8; ctx.beginPath(); sweet(SB, 2.2); ctx.stroke(); // the drawstring
  // the bodice: green, laced, from under the bust to a point below the waist
  const bd = () => { const W = wide(SB); ctx.beginPath(); ctx.moveTo(-W, SB.by + SB.ry*.6); ctx.quadraticCurveTo(-SB.bx, SB.by + SB.ry*1.28, -1, SB.by + SB.ry*.95); ctx.lineTo(1, SB.by + SB.ry*.95); ctx.quadraticCurveTo(SB.bx, SB.by + SB.ry*1.28, W, SB.by + SB.ry*.6); ctx.lineTo(W, 23); ctx.lineTo(0, 31); ctx.lineTo(-W, 23); ctx.closePath(); };
  bd(); ctx.fillStyle = PR.lit(ctx, '#4aa676', '#123e26', -wide(SB), wide(SB)*1.5); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.stroke();
  PR.stroke(ctx, '#f4eedc', .7, () => { for (let i=0;i<3;i++){ const y = SB.by + SB.ry*1.02 + i*4.6, w = 2.6 - i*.25; ctx.moveTo(-w, y); ctx.lineTo(w, y + 3.6); ctx.moveTo(w, y); ctx.lineTo(-w, y + 3.6); } }); // lacing
  // skirt, and the half-apron over it with flour and a heart on the pocket
  ctx.fillStyle = PR.lit(ctx, '#3a9264', '#0e3420', -SB.hi, SB.hi); PR.path(ctx, [[-SB.sh - 4, 23], [0, 31], [SB.sh + 4, 23], [SB.hi + 8, 120], [-SB.hi - 8, 120]]); ctx.fill();
  const ap = () => { ctx.beginPath(); ctx.moveTo(-24, 26); ctx.quadraticCurveTo(0, 30, 24, 26); ctx.lineTo(30, 120); ctx.lineTo(-30, 120); ctx.closePath(); };
  ap(); ctx.fillStyle = PR.lit(ctx, '#fbf6ea', '#b4ab98', -30, 30); ctx.fill(); ctx.save(); ap(); ctx.clip(); for (let i=0;i<70;i++) ell(ctx, -26 + r()*52, 27 + r()*80, .5 + r()*1.4, .4 + r(), 'rgba(255,255,255,.7)'); ctx.restore(); ap(); ctx.strokeStyle = 'rgba(120,110,90,.8)'; ctx.lineWidth = .7; ctx.stroke();
  ctx.fillStyle = '#e8e0cc'; ctx.fillRect(-SB.sh - 4, 24, SB.sh*2 + 8, 3.2); ctx.save(); ctx.translate(-9, 41); heart(0, 0, 5, '#d8443a'); ctx.restore();
  ctx.restore();
  // the hip arm: a puffed sleeve, the elbow out over Rumjugs's, the hand on her hip
  seg(-SB.sh - 17, -3, 5.8, -SB.sh + 4, 20, 4.6, SL.skin); seg(-SB.sh + 3, -37, 7.4, -SB.sh - 17, -3, 6, SL.skin); hipHand(-SB.sh + 5, 23, -1, SL.skin);
  sleeve(-SB.sh - 3.5, -31, 7.6, 7, .55, '#fdf8ee', '#b8ae9a');
  bigHead(() => {
    PR.face(ctx, SL); lift(SL); lashes(SL, -1); PR.soft(ctx, -8.5, -66, 4.8, 3, '#ff6a70', .32); PR.soft(ctx, 8.5, -66, 4.8, 3, '#ff6a70', .24);
    { const u = SL.h/20, ex = -SL.w*.4, ey = SL.cy - 1*u, ew = SL.w*.22; // the wink: the near eye closed in a smile
      ell(ctx, ex, ey - .6, ew*1.15, 2.4, PR.lin(ctx, ex - ew, 0, ex + ew, 0, [[0, shade(SL.skin, .14)], [1, shade(SL.skin, -.02)]]));
      ctx.lineCap = 'round'; PR.stroke(ctx, '#1a0a06', 1.2, () => { ctx.moveTo(ex - ew, ey - .8); ctx.quadraticCurveTo(ex, ey + 1.6, ex + ew, ey - .8); });
      PR.stroke(ctx, '#1a0a06', .6, () => { ctx.moveTo(ex - ew, ey - .8); ctx.lineTo(ex - ew - 1.6, ey - 2); ctx.moveTo(ex - ew*.6, ey + .4); ctx.lineTo(ex - ew*.9, ey + 2); }); }
    ell(ctx, 6.4, -61.5, .7, .7, '#2a120a'); // a beauty spot
    [-1, 1].forEach(sd => { ctx.strokeStyle = '#e8b848'; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(sd*(SL.w + .6), SL.cy + 7, 2, 0, 7); ctx.stroke(); }); // gold earrings
    [[-9, -97, 7.4], [9, -97, 7.4]].forEach(([x, y, s]) => curl(x, y, s, '#2e2018')); [[-17, -86, 4], [17, -86, 4]].forEach(([x, y, s]) => curl(x, y, s, '#2a1c14')); // the victory rolls
    for (let i=0;i<5;i++){ const a = i/5*Math.PI*2; ell(ctx, 16 + Math.cos(a)*2.6, -91 + Math.sin(a)*2.6, 2.2, 2.2, '#f2c840'); } ell(ctx, 16, -91, 1.4, 1.4, '#c86a20'); // a flower in her hair
  });
  // the raised arm: a puffed sleeve, the hand flat under a tray
  ctx.save(); ctx.translate(-4, 0);
  limb([[38, -40], [50, -36], [62, -32], [70, -28], [68, -21], [56, -22], [42, -25]], SL.skin);
  limb([[62, -31], [70, -22], [70, -64], [62, -64]], SL.skin);
  ell(ctx, 66, -66, 7.4, 3.2, PR.lit(ctx, shade(SL.skin, .1), shade(SL.skin, -.35), 58, 74)); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(66, -66, 7.4, 3.2, 0, 0, 7); ctx.stroke();
  sleeve(45, -33, 7.6, 7, -1.2, '#fdf8ee', '#b8ae9a');
  ell(ctx, 64, -70, 16, 3.4, PR.lin(ctx, 48, 0, 80, 0, [[0, '#ece6d8'], [.5, '#aaa292'], [1, '#585248']])); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(64, -70, 16, 3.4, 0, 0, 7); ctx.stroke(); // the tray
  const bun = (x, y, s) => { ell(ctx, x, y, s, s*.8, PR.rad(ctx, x - s*.3, y - s*.4, .5, s*1.2, [[0, '#f8d070'], [.6, '#d88a2c'], [1, '#7a3c10']])); ctx.strokeStyle = line; ctx.lineWidth = .7; ctx.beginPath(); ctx.ellipse(x, y, s, s*.8, 0, 0, 7); ctx.stroke(); PR.soft(ctx, x - s*.35, y - s*.35, s*.45, s*.3, '#fff8e0', .7); };
  bun(57, -75, 5.6); bun(71, -75, 5.6); bun(64, -82.6, 5.6);
  PR.stroke(ctx, '#2a1a0e', .9, () => { ctx.moveTo(64.5, -87.4); ctx.quadraticCurveTo(64.5, -92, 68.5, -94); }); // the fuse
  glow(ctx, 69.5, -95, 7, '#ffd060', .8); star(69.5, -95, 2.6, '#fff4b0');
  ctx.restore(); ctx.restore();

  /* ---- the banners ---- */
  const arcText = (txt, cx, cy, R, font, fill, sp = 0) => { ctx.font = font; const ws = [...txt].map(c => ctx.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + sp*(ws.length - 1); let a = -tot/R/2;
    [...txt].forEach((c, i) => { const ang = a + ws[i]/2/R; ctx.save(); ctx.translate(cx + Math.sin(ang)*R, cy - Math.cos(ang)*R); ctx.rotate(ang); ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#3a0c08'; ctx.lineWidth = 5; ctx.strokeText(c, 0, 0); ctx.fillStyle = fill; ctx.fillText(c, 0, 0); ctx.restore(); a += (ws[i] + sp)/R; }); };
  const ribbon = (cx, cy, R, half, th, col) => { // an arched ribbon, its tails folded back and cut in a fork
    [-1, 1].forEach(sd => { const a = sd*half, x = cx + Math.sin(a)*R, y = cy - Math.cos(a)*R, tx = x + sd*44, ty = y + 26;
      PR.path(ctx, [[x - sd*6, y - th/2 + 10], [tx, ty - th/2 + 6], [tx - sd*14, ty + 6], [tx, ty + th/2 + 6], [x - sd*6, y + th/2 + 10]]); ctx.fillStyle = shade(col, -.35); ctx.fill(); ctx.strokeStyle = '#3a0c08'; ctx.lineWidth = 2; ctx.stroke(); });
    ctx.beginPath(); ctx.arc(cx, cy, R + th/2, -Math.PI/2 - half, -Math.PI/2 + half); ctx.arc(cx, cy, R - th/2, -Math.PI/2 + half, -Math.PI/2 - half, true); ctx.closePath();
    ctx.fillStyle = PR.lin(ctx, 0, cy - R - th/2, 0, cy - R + th/2, [[0, shade(col, .2)], [.5, col], [1, shade(col, -.25)]]); ctx.fill(); ctx.strokeStyle = '#3a0c08'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,220,140,.7)'; ctx.lineWidth = 1.2; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.arc(cx, cy, R + sd*(th/2 - 5), -Math.PI/2 - half + .01, -Math.PI/2 + half - .01); ctx.stroke(); }); };
  ribbon(300, 1020, 860, .272, 60, '#c4302a'); arcText('RUMJUGS & SWEETLARD', 300, 1020, 849, '400 35px "IM Fell English SC", Georgia, serif', '#fbefcf', 1.2);
  ctx.restore(); // the panel's clip
  /* the border, painted round the panel; the small ribbon over it */
  panel(); ctx.strokeStyle = '#3a0c08'; ctx.lineWidth = 13; ctx.stroke(); panel(); ctx.strokeStyle = '#c4302a'; ctx.lineWidth = 8; ctx.stroke(); panel(); ctx.strokeStyle = '#e8b848'; ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); ribbon(300, 1660, 1000, .14, 44, '#b02a26'); arcText('Sweets for the Sappers', 300, 1660, 990, 'italic 400 27px "IM Fell English", Georgia, serif', '#fbefcf', .5); ctx.restore();
  /* ---- the years on it: chips back to the wood, scratches, the plank gaps, the nails, a scorch, old varnish ---- */
  for (let i=0;i<120;i++){ const x = 30 + r()*540, y = 70 + r()*650, pi = Math.min(2, Math.floor(y/253)), s = 1.5 + r()*r()*9, n = 5 + Math.floor(r()*3); if ([[200, 320], [396, 326], [200, 455], [396, 458]].some(([fx, fy]) => ((x - fx)/48)**2 + ((y - fy)/66)**2 < 1)) continue;
    ctx.beginPath(); for (let k=0;k<n;k++){ const a = k/n*Math.PI*2, q = s*(.5 + r()*.7); ctx.lineTo(x + Math.cos(a)*q, y + Math.sin(a)*q*.7); } ctx.closePath(); ctx.fillStyle = shade(pcol[pi], -.05); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,246,220,.35)'; ctx.lineWidth = .8; for (let i=0;i<26;i++){ const x = 40 + r()*520, y = 90 + r()*620, a = r()*Math.PI; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a)*(10 + r()*40), y + Math.sin(a)*(4 + r()*12)); ctx.stroke(); }
  [253, 507].forEach(y => { ctx.fillStyle = 'rgba(20,10,4,.85)'; ctx.fillRect(0, y - 2, 600, 4); ctx.fillStyle = 'rgba(255,230,190,.18)'; ctx.fillRect(0, y + 2, 600, 1.5); });
  for (let i=0;i<3;i++) [16, 584].forEach(x => [planks[i] + 40, planks[i+1] - 40].forEach(y => { ell(ctx, x, y, 5.2, 5.2, '#2a2420'); ell(ctx, x - 1, y - 1, 3.4, 3.4, '#6a625a'); PR.soft(ctx, x + 3, y + 5, 6, 3, '#4a2008', .4); }));
  PR.soft(ctx, 548, 708, 70, 40, '#2a1206', .55, -.3); PR.soft(ctx, 560, 714, 30, 18, '#100602', .5); // a scorch in the corner: sappers
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(214,180,120,.35)'; ctx.fillRect(0, 0, 600, 760); ctx.globalCompositeOperation = 'source-over'; // old varnish
  const v = ctx.createRadialGradient(300, 380, 260, 300, 380, 520); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,8,2,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, 600, 760);
  ctx.restore();
}
