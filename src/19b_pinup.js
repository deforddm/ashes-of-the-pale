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
  const body = (wide, waist, hip) => { ctx.beginPath(); ctx.moveTo(-9, -50); ctx.quadraticCurveTo(-19, -46, -wide*.55, -43); ctx.bezierCurveTo(-wide*.86, -41, -wide, -34, -wide, -22); ctx.bezierCurveTo(-wide, -6, -waist, 10, -waist, 24); ctx.quadraticCurveTo(-hip, 38, -hip, 110);
    ctx.lineTo(hip, 110); ctx.quadraticCurveTo(hip, 38, waist, 24); ctx.bezierCurveTo(waist, 10, wide, -6, wide, -22); ctx.bezierCurveTo(wide, -34, wide*.86, -41, wide*.55, -43); ctx.quadraticCurveTo(19, -46, 9, -50); ctx.closePath(); };
  const limb = (pts, skin) => { PR.path(ctx, pts); ctx.fillStyle = PR.lit(ctx, shade(skin, .06), shade(skin, -.38), Math.min(...pts.map(p => p[0])), Math.max(...pts.map(p => p[0]))); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke(); };
  const curl = (x, y, rr, col) => { ell(ctx, x, y, rr, rr, col); ctx.strokeStyle = shade(col, -.45); ctx.lineWidth = .7; ctx.beginPath(); for (let a=0; a<9; a+=.4){ const q = rr*(1 - a/10); ctx.lineTo(x + Math.cos(a)*q, y + Math.sin(a)*q); } ctx.stroke(); PR.soft(ctx, x - rr*.35, y - rr*.35, rr*.6, rr*.5, '#fff0d8', .25); };

  /* -- Rumjugs: kerchief, a flexed arm, the jug on it, a grin -- */
  ctx.save(); ctx.translate(198, OY); ctx.scale(K, K);
  const RJ = {cy:-76, w:14.6, h:20, jaw:.92, chin:6.2, skin:'#e0a880', iris:'#4e6a34', lip:'#c83a30', browCol:'#8a3a18', browW:1.6, arch:1.5, browL:.6, browR:.8, rim:'#ffd890', rimA:.22, nose:1.08, smileL:2.2, smileR:2.2, mouthW:5.6, teeth:true, look:.15, flush:'#e66a50', open:1.15};
  bigHead(() => [[-17, -66, 5], [-19, -74, 4.6], [17, -66, 5], [19, -74, 4.6], [-13, -59, 4], [13, -59, 4]].forEach(([x, y, s]) => curl(x, y, s, '#b44a24'))); // red curls, behind
  body(40, 34, 38); ctx.fillStyle = PR.lit(ctx, '#e0a83c', '#7a5014', -40, 38); ctx.fill();
  ctx.save(); body(40, 34, 38); ctx.clip(); ctx.strokeStyle = 'rgba(90,50,10,.45)'; ctx.lineWidth = .7; ctx.beginPath(); for (let i=-14;i<14;i++){ ctx.moveTo(i*8, -50); ctx.lineTo(i*8 + 160, 110); ctx.moveTo(i*8, -50); ctx.lineTo(i*8 - 160, 110); } ctx.stroke(); // the quilting
  PR.path(ctx, [[-11, -51], [0, -26], [11, -51]]); ctx.fillStyle = PR.lin(ctx, -10, 0, 10, 0, [[0, '#f4ead4'], [1, '#a89c80']]); ctx.fill(); // the shirt in the V
  ctx.fillStyle = PR.lin(ctx, 0, 22, 0, 30, [[0, '#4a2a14'], [1, '#22120a']]); ctx.fillRect(-50, 22, 100, 8); ell(ctx, -6, 26, 5, 4.6, '#e0b048'); ell(ctx, -6, 26, 2.6, 2.2, '#3a2410'); // belt, brass buckle
  ctx.fillStyle = PR.lit(ctx, '#6a4a30', '#2a1a10', -40, 38); ctx.fillRect(-50, 30, 100, 90); // breeches
  ctx.restore(); body(40, 34, 38); ctx.strokeStyle = line; ctx.lineWidth = 1.1; ctx.stroke();
  bigHead(() => {
    PR.neck(ctx, RJ, 9);
    RJ.under = (c, F) => PR.dots(c, F, 40, 'rgba(170,80,40,.32)', .5, [-3, 7, (x, y) => Math.abs(x) < 2.6 && y > 4]); // freckles
    PR.face(ctx, RJ); lift(RJ); PR.soft(ctx, -8, -68, 4.5, 3, '#ff7060', .3); PR.soft(ctx, 8, -68, 4.5, 3, '#ff7060', .24);
    // the kerchief: red, white polka dots, knotted on top
    const kp = () => { ctx.beginPath(); ctx.moveTo(-16.5, -84); ctx.bezierCurveTo(-17, -100, -9, -104, 0, -104); ctx.bezierCurveTo(9, -104, 17, -100, 16.5, -84); ctx.quadraticCurveTo(8, -90, 0, -90); ctx.quadraticCurveTo(-8, -90, -16.5, -84); ctx.closePath(); };
    kp(); ctx.fillStyle = PR.lit(ctx, '#e0402e', '#7a1812', -17, 17); ctx.fill(); ctx.save(); kp(); ctx.clip(); [[-11, -94], [-4, -99], [4, -95], [11, -98], [-8, -88], [8, -89], [0, -102], [13, -90]].forEach(([x, y]) => ell(ctx, x, y, 1.3, 1.2, '#f8f0e0')); ctx.restore(); kp(); ctx.strokeStyle = line; ctx.lineWidth = .9; ctx.stroke();
    [[-1, -.35], [1, .35]].forEach(([sd, a]) => { ctx.save(); ctx.translate(8.5 + sd*1.5, -104.5); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sd*3, -4.2, sd*7.4, -3.6); ctx.lineTo(sd*6.2, -1.2); ctx.lineTo(sd*7.8, .8); ctx.quadraticCurveTo(sd*3, 1.6, 0, 0); ctx.closePath(); ctx.fillStyle = sd < 0 ? '#d83a2c' : '#a8261e'; ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .7; ctx.stroke(); ell(ctx, sd*4.4, -1.4, .8, .7, '#f8f0e0'); ctx.restore(); }); ell(ctx, 8.5, -104.4, 2, 1.8, '#a8241e'); // the knot, two ends
    [[-12, -86, 2.6], [-7, -88, 2.4], [-2, -89, 2.2]].forEach(([x, y, s]) => curl(x, y, s, '#c0542a')); // curls escaping at the front
  });
  // the flexed arm: shirt sleeve rolled to the shoulder, the bicep, the fist, the jug sat on the muscle
  ctx.save(); ctx.translate(6, 0);
  limb([[-36, -45], [-44, -52], [-52, -57], [-60, -56], [-68, -52], [-76, -44], [-74, -38], [-62, -34], [-50, -29], [-42, -24]], RJ.skin);
  PR.stroke(ctx, 'rgba(90,30,10,.35)', .7, () => { ctx.moveTo(-54, -52); ctx.quadraticCurveTo(-59, -49, -64, -50); }); // the muscle's line
  limb([[-77, -46], [-64, -51], [-61, -84], [-71, -84]], RJ.skin);
  ell(ctx, -66, -91, 8.6, 8.2, PR.lit(ctx, shade(RJ.skin, .08), shade(RJ.skin, -.4), -75, -57)); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(-66, -91, 8.6, 8.2, 0, 0, 7); ctx.stroke();
  PR.stroke(ctx, 'rgba(60,20,8,.6)', .6, () => { for (let i=0;i<3;i++){ ctx.moveTo(-73, -95 + i*3.4); ctx.lineTo(-61, -95 + i*3.4); } ctx.moveTo(-74, -87); ctx.quadraticCurveTo(-68, -84, -60, -88); }); // fingers and thumb
  PR.path(ctx, [[-36, -45], [-41.5, -50], [-43, -26.6], [-40, -24]]); ctx.fillStyle = PR.lit(ctx, '#e0a83c', '#7a5014', -44, -36); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.stroke(); // the jerkin's shoulder
  PR.path(ctx, [[-41.5, -50.4], [-46.5, -53.4], [-47.6, -28.2], [-43, -26.4]]); ctx.fillStyle = PR.lin(ctx, -47, 0, -42, 0, [[0, '#fbf6e8'], [1, '#c8bca0']]); ctx.fill(); ctx.stroke(); PR.stroke(ctx, 'rgba(110,96,70,.7)', .45, () => { ctx.moveTo(-44, -52); ctx.lineTo(-45.2, -27.4); }); // the shirt, rolled to the shoulder
  const jug = () => { ctx.beginPath(); ctx.moveTo(-57, -56); ctx.bezierCurveTo(-63, -61, -63, -74, -55.5, -79); ctx.lineTo(-53.5, -81); ctx.lineTo(-53.5, -85); ctx.lineTo(-46.5, -85); ctx.lineTo(-46.5, -81); ctx.lineTo(-44.5, -79); ctx.bezierCurveTo(-37, -74, -37, -61, -43, -56); ctx.closePath(); };
  PR.stroke(ctx, '#5a3214', 2.2, () => { ctx.moveTo(-56, -79); ctx.bezierCurveTo(-63, -80, -64, -70, -60, -67); }); // the handle
  jug(); ctx.fillStyle = PR.lit(ctx, '#efe2c0', '#8a7a58', -62, -38); ctx.fill(); ctx.save(); jug(); ctx.clip(); ctx.fillStyle = PR.lit(ctx, '#8a5428', '#341c0a', -62, -38); ctx.fillRect(-64, -90, 30, 17); ctx.restore();
  jug(); ctx.strokeStyle = line; ctx.lineWidth = .9; ctx.stroke(); PR.soft(ctx, -56, -66, 2.4, 4, '#ffffff', .5);
  ctx.fillStyle = '#6a3a18'; ctx.font = '700 6.4px "IM Fell English SC", Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('RUM', -50, -63); ctx.font = '700 4px Georgia, serif'; ctx.fillText('X X X', -50, -59);
  ctx.fillStyle = PR.lin(ctx, -53, 0, -47, 0, [[0, '#d8b080'], [1, '#7a5430']]); ctx.fillRect(-52.5, -89, 5, 4.4);
  ctx.restore(); ctx.restore();

  /* -- Sweetlard: victory rolls and a flower, a wink, an apron, the honey-cakes (one with a fuse) -- */
  ctx.save(); ctx.translate(398, OY + 4); ctx.scale(K, K);
  const SL = {cy:-75, w:15.4, h:20.4, jaw:.98, chin:7, skin:'#c08460', iris:'#3a2414', lip:'#c83448', browCol:'#1a100a', browW:1.5, arch:1.6, browL:-.9, browR:1.4, rim:'#ffd0a0', rimA:.2, nose:1.05, smileL:2.4, smileR:1.7, mouthW:5, look:-.1, flush:'#e05a60'};
  bigHead(() => { PR.path(ctx, [[-18, -96], [18, -96], [21, -66], [16, -58], [-16, -58], [-21, -66]]); ctx.fillStyle = PR.lit(ctx, '#3a2a20', '#0a0604', -21, 21); ctx.fill(); }); // hair, behind
  body(42, 37, 42); ctx.fillStyle = PR.lit(ctx, '#46a072', '#124028', -42, 40); ctx.fill();
  ctx.save(); body(42, 37, 42); ctx.clip();
  const apron = () => { ctx.beginPath(); ctx.moveTo(-17, -32); ctx.quadraticCurveTo(0, -36, 17, -32); ctx.lineTo(20, 16); ctx.lineTo(32, 22); ctx.lineTo(36, 112); ctx.lineTo(-36, 112); ctx.lineTo(-32, 22); ctx.lineTo(-20, 16); ctx.closePath(); };
  apron(); ctx.fillStyle = PR.lit(ctx, '#fbf6ea', '#b4ab98', -36, 36); ctx.fill(); ctx.save(); apron(); ctx.clip(); for (let i=0;i<80;i++) ell(ctx, -30 + r()*60, -30 + r()*120, .5 + r()*1.4, .4 + r(), 'rgba(255,255,255,.7)'); ctx.restore(); // flour
  apron(); ctx.strokeStyle = 'rgba(120,110,90,.8)'; ctx.lineWidth = .7; ctx.stroke();
  PR.stroke(ctx, '#ebe4d2', 3, () => { ctx.moveTo(-15, -33); ctx.lineTo(-22, -46); ctx.moveTo(15, -33); ctx.lineTo(22, -46); }); // straps
  ctx.fillStyle = '#e8e0cc'; ctx.fillRect(-46, 18, 92, 5); // the tie at the waist
  ctx.save(); ctx.translate(0, -8); heart(0, 0, 6.5, '#d8443a'); ctx.restore(); // the pocket
  ctx.restore(); body(42, 37, 42); ctx.strokeStyle = line; ctx.lineWidth = 1.1; ctx.stroke();
  [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(0, -49); ctx.bezierCurveTo(sd*6, -51, sd*14, -50, sd*14, -44); ctx.bezierCurveTo(sd*10, -40, sd*3, -42, 0, -46); ctx.closePath(); ctx.fillStyle = sd < 0 ? '#fbf6ea' : '#c8c0ae'; ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .7; ctx.stroke(); }); // the round white collar
  bigHead(() => {
    PR.neck(ctx, SL, 8.8);
    PR.face(ctx, SL); lift(SL); PR.soft(ctx, -8.5, -66, 4.8, 3, '#ff6a70', .32); PR.soft(ctx, 8.5, -66, 4.8, 3, '#ff6a70', .24);
    { const u = SL.h/20, ex = -SL.w*.4, ey = SL.cy - 1*u, ew = SL.w*.22; // the wink: the near eye closed in a smile
      ell(ctx, ex, ey - .6, ew*1.15, 2.4, PR.lin(ctx, ex - ew, 0, ex + ew, 0, [[0, shade(SL.skin, .14)], [1, shade(SL.skin, -.02)]]));
      ctx.lineCap = 'round'; PR.stroke(ctx, '#1a0a06', 1.1, () => { ctx.moveTo(ex - ew, ey - .8); ctx.quadraticCurveTo(ex, ey + 1.6, ex + ew, ey - .8); });
      PR.stroke(ctx, '#1a0a06', .6, () => { ctx.moveTo(ex - ew, ey - .8); ctx.lineTo(ex - ew - 1.6, ey - 2); ctx.moveTo(ex - ew*.6, ey + .4); ctx.lineTo(ex - ew*.9, ey + 2); }); }
    ell(ctx, 6.4, -61.5, .7, .7, '#2a120a'); // a beauty spot
    [-1, 1].forEach(sd => { ctx.strokeStyle = '#e8b848'; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(sd*(SL.w + .6), SL.cy + 7, 2, 0, 7); ctx.stroke(); }); // gold earrings
    [[-9, -97, 7.4], [9, -97, 7.4]].forEach(([x, y, s]) => curl(x, y, s, '#2e2018')); [[-17, -86, 4], [17, -86, 4]].forEach(([x, y, s]) => curl(x, y, s, '#2a1c14')); // the victory rolls
    for (let i=0;i<5;i++){ const a = i/5*Math.PI*2; ell(ctx, 16 + Math.cos(a)*2.6, -91 + Math.sin(a)*2.6, 2.2, 2.2, '#f2c840'); } ell(ctx, 16, -91, 1.4, 1.4, '#c86a20'); // a flower in her hair
  });
  // the raised arm: a puffed sleeve, the hand flat under a tray
  ctx.save(); ctx.translate(-4, 0);
  limb([[40, -40], [50, -36], [62, -32], [70, -28], [68, -21], [56, -22], [44, -24]], SL.skin);
  limb([[62, -31], [70, -22], [70, -64], [62, -64]], SL.skin);
  ell(ctx, 66, -66, 7.4, 3.2, PR.lit(ctx, shade(SL.skin, .1), shade(SL.skin, -.35), 58, 74)); ctx.strokeStyle = line; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(66, -66, 7.4, 3.2, 0, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(37, -47); ctx.bezierCurveTo(44, -52, 55, -47, 54, -37); ctx.bezierCurveTo(53, -30, 47, -27, 41, -25); ctx.closePath(); ctx.fillStyle = PR.lit(ctx, '#56b082', '#16482c', 37, 55); ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = .9; ctx.stroke(); // the puffed sleeve
  PR.stroke(ctx, '#f4eedc', 1.2, () => { ctx.moveTo(53.6, -36); ctx.bezierCurveTo(53, -30, 47, -27.6, 41.6, -25.8); }); PR.stroke(ctx, 'rgba(10,40,20,.5)', .5, () => { ctx.moveTo(42, -46); ctx.quadraticCurveTo(48, -40, 46, -28); ctx.moveTo(47, -48); ctx.quadraticCurveTo(52, -40, 50, -29); }); // its trim and gathers
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
  ribbon(300, 980, 860, .272, 60, '#c4302a'); arcText('RUMJUGS & SWEETLARD', 300, 980, 849, '400 35px "IM Fell English SC", Georgia, serif', '#fbefcf', 1.2);
  ctx.restore(); // the panel's clip
  /* the border, painted round the panel; the small ribbon over it */
  panel(); ctx.strokeStyle = '#3a0c08'; ctx.lineWidth = 13; ctx.stroke(); panel(); ctx.strokeStyle = '#c4302a'; ctx.lineWidth = 8; ctx.stroke(); panel(); ctx.strokeStyle = '#e8b848'; ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); ribbon(300, 1660, 1000, .14, 44, '#b02a26'); arcText('Sweets for the Sappers', 300, 1660, 990, 'italic 400 27px "IM Fell English", Georgia, serif', '#fbefcf', .5); ctx.restore();
  /* ---- the years on it: chips back to the wood, scratches, the plank gaps, the nails, a scorch, old varnish ---- */
  for (let i=0;i<120;i++){ const x = 30 + r()*540, y = 70 + r()*650, pi = Math.min(2, Math.floor(y/253)), s = 1.5 + r()*r()*9, n = 5 + Math.floor(r()*3); if ([[198, 320], [398, 326]].some(([fx, fy]) => ((x - fx)/48)**2 + ((y - fy)/66)**2 < 1)) continue;
    ctx.beginPath(); for (let k=0;k<n;k++){ const a = k/n*Math.PI*2, q = s*(.5 + r()*.7); ctx.lineTo(x + Math.cos(a)*q, y + Math.sin(a)*q*.7); } ctx.closePath(); ctx.fillStyle = shade(pcol[pi], -.05); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,246,220,.35)'; ctx.lineWidth = .8; for (let i=0;i<26;i++){ const x = 40 + r()*520, y = 90 + r()*620, a = r()*Math.PI; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a)*(10 + r()*40), y + Math.sin(a)*(4 + r()*12)); ctx.stroke(); }
  [253, 507].forEach(y => { ctx.fillStyle = 'rgba(20,10,4,.85)'; ctx.fillRect(0, y - 2, 600, 4); ctx.fillStyle = 'rgba(255,230,190,.18)'; ctx.fillRect(0, y + 2, 600, 1.5); });
  for (let i=0;i<3;i++) [16, 584].forEach(x => [planks[i] + 40, planks[i+1] - 40].forEach(y => { ell(ctx, x, y, 5.2, 5.2, '#2a2420'); ell(ctx, x - 1, y - 1, 3.4, 3.4, '#6a625a'); PR.soft(ctx, x + 3, y + 5, 6, 3, '#4a2008', .4); }));
  PR.soft(ctx, 548, 708, 70, 40, '#2a1206', .55, -.3); PR.soft(ctx, 560, 714, 30, 18, '#100602', .5); // a scorch in the corner: sappers
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(214,180,120,.35)'; ctx.fillRect(0, 0, 600, 760); ctx.globalCompositeOperation = 'source-over'; // old varnish
  const v = ctx.createRadialGradient(300, 380, 260, 300, 380, 520); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,8,2,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, 600, 760);
  ctx.restore();
}
