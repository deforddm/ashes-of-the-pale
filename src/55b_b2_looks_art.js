/* ============ Book Two looks: the Book Two sergeant, Ramin made himself, and the anonymous Red Blade trooper ============ */
/* Loads after the chapter art (47b, 49b..54b), so it can replace FIGX.redblade and POR.redblade.
   - sgt_dg: the Hissar sergeant (BOOKSNAP.dg.sgt, 47): burnt dark, a sand scarf wound round head and throat, the iron cap
     hung at the belt because it is too hot to wear, a tall shield that has carried three regiments' paint, a Malazan longsword,
     Ressan's brass token on a cord. drawFigure (18) and paintPortrait (19) route 'sgt' here while BOOK === 'dg'.
   - redblade_trooper: the anonymous Red Blade (spiked helm, horsetail, black beard), as 49b first drew him.
   - redblade: Ramin. Bareheaded under a red head-wrap, the slit-visored helm carried at his hip, an oiled moustache and no beard,
     a gold ring in the ear, a rolled saddle-cloth over the shoulder, spurs with no horse, the lance cut down and held short,
     and his father's toll seal from the Old Quarter gate on a cord. */

/* ---------------- figures ---------------- */
const B2L = {
  /* the shield that has had three regiments painted on it: tall, rounded at the corners, curved; old red, then blue, then the
     garrison's dun over both, flaking so all three show; an iron rim and boss */
  tallShield(ctx, h, x0, y0, w, hh){ const r = 2.2, path = () => { ctx.beginPath(); ctx.moveTo(x0 + r, y0); ctx.lineTo(x0 + w - r, y0); ctx.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r); ctx.lineTo(x0 + w, y0 + hh - r); ctx.quadraticCurveTo(x0 + w, y0 + hh, x0 + w - r, y0 + hh); ctx.lineTo(x0 + r, y0 + hh); ctx.quadraticCurveTo(x0, y0 + hh, x0, y0 + hh - r); ctx.lineTo(x0, y0 + r); ctx.quadraticCurveTo(x0, y0, x0 + r, y0); ctx.closePath(); };
    path(); ctx.fillStyle = h.armor('#8a7a56', '#332a1c'); ctx.fill(); // the dun, newest
    ctx.save(); path(); ctx.clip();
    ctx.fillStyle = '#6a3024'; [[0, .04, .46, .22], [.5, .7, .5, .18]].forEach(([a, b, c, d]) => ctx.fillRect(x0 + a*w, y0 + b*hh, c*w, d*hh)); // the oldest red, where both coats came off
    ctx.fillStyle = '#3a5068'; [[.42, .1, .4, .16], [0, .64, .36, .2]].forEach(([a, b, c, d]) => ctx.fillRect(x0 + a*w, y0 + b*hh, c*w, d*hh)); // the blue over it
    ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(x0 + w*.62, y0, w*.38, hh); // the curve, away from the light
    ctx.fillStyle = 'rgba(214,162,74,.7)'; ctx.fillRect(x0 + w*.18, y0 + hh*.5 - .6, w*.64, 1.2); ctx.restore(); // a band of the sergeant's gold, painted on last, across the middle
    path(); ctx.strokeStyle = '#1a1612'; ctx.lineWidth = 1; ctx.stroke(); ell(ctx, x0 + w*.46, y0 + hh*.5, 1.5, 1.5, '#8a8274'); ell(ctx, x0 + w*.42, y0 + hh*.46, .6, .6, '#d8d0c0'); },
};
Object.assign(FIGX, {
  sgt_dg(ctx, h, t, o){ const fl = o.still ? 0 : Math.sin(t/260 + (o.phase||0)*2)*.7;
    poly(ctx, [[-2.6,-10.4],[-8.6,-8.6 + fl],[-10.2,-5 + fl],[-4.4,-6.6]], '#9a6a3c'); ctx.fillStyle = 'rgba(214,162,74,.8)'; ctx.fillRect(-9.4, -7.6 + fl, 1.2, 1.2); // the scarf's tail, out behind in the wind
    h.legs('#5a4a36'); ctx.fillStyle = 'rgba(210,190,150,.35)'; for (let i=0;i<3;i++){ ctx.fillRect(-4.5, 6.4 + i*1.6, 3.4, .5); ctx.fillRect(1.1, 6.4 + i*1.6, 3.4, .5); } // wrapped shins, against the sand
    h.torso('#8a6038', '#3a2414', 6.4); // boiled leather, bleached by six summers
    ctx.fillStyle = '#a89068'; ctx.fillRect(-5.6, 5.2, 11.2, 1.6); ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i=0;i<5;i++) ctx.fillRect(-5 + i*2.4, 5.2, .5, 1.6); // the quilting below the hem
    ctx.fillStyle = '#3a2818'; ctx.fillRect(-6.2, 3, 12.4, 1.4); ctx.fillStyle = '#d6a24a'; ctx.fillRect(-.8, 3, 1.6, 1.4); // the belt
    ctx.fillStyle = '#d6a24a'; ctx.fillRect(3, -6, 3.6, 1.3); ctx.fillRect(4.6, -6, 1.3, 3); // the sergeant's gold, at the shoulder
    B2F.line(ctx, '#2a1e12', .5, [[-2.2, -6], [.3, -2.6], [2.6, -6]]); ell(ctx, .3, -1.9, 1.15, 1.15, '#e2b85a'); ell(ctx, -.1, -2.3, .4, .4, '#fff0c0'); // Ressan's brass token on its cord
    ctx.beginPath(); ctx.arc(5.2, 4.6, 2.7, 0, Math.PI); ctx.closePath(); ctx.fillStyle = h.armor('#8a867c', '#26241f'); ctx.fill(); ctx.fillStyle = '#4a4640'; ctx.fillRect(2.4, 4.4, 5.6, .8); // the iron cap, hung at the belt
    h.head('#7a5438', 4.5, -11.2); h.look('rgba(20,10,6,.88)', -11.6); ctx.fillStyle = 'rgba(255,230,200,.18)'; ctx.fillRect(.6, -10.2, 3.6, .5); // burnt dark; squinting against the glare
    ctx.fillStyle = '#bc8a52'; ctx.beginPath(); ctx.arc(0, -12.2, 5.3, Math.PI*.94, Math.PI*2.04); ctx.fill(); ctx.fillRect(-5.3, -12.6, 1.8, 3.6); // the scarf over the head
    ctx.fillStyle = 'rgba(60,40,20,.35)'; ctx.fillRect(-4.6, -15.2, 9, .5); ctx.fillRect(-5, -13.8, 10, .5); ctx.fillStyle = '#d6a24a'; ctx.fillRect(-5.1, -12.9, 10.4, .9); // its folds; a gold stripe at the brow
    poly(ctx, [[-5,-7.8],[4.8,-7.8],[5.8,-5],[-5.8,-5]], '#a8784a'); ctx.fillStyle = 'rgba(60,40,20,.4)'; ctx.fillRect(-5.2, -6.6, 10.6, .5); // wound round the throat
    B2L.tallShield(ctx, h, -12.8, -6.4, 8.8, 15.6);
    B2F.line(ctx, '#d4ccbc', 1.3, [[7, 2], [12.8, -12.6]]); ctx.fillStyle = '#6b4f2a'; ctx.fillRect(5.6, 1.4, 4, 1.1); B2F.line(ctx, '#4a3220', 1.6, [[6.2, 4.4], [7.4, 1.6]]); }, // the longsword

  /* the anonymous Red Blade, unchanged from 49b: red scale, a spiked helm with a mail curtain and a horsetail, a black beard, a black sash, a tulwar */
  redblade_trooper: FIGX.redblade,

  /* Ramin, the red horse with no horse */
  redblade(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .98, 1.08); // lean, and very straight
    const fl = o.still ? 0 : Math.sin(t/240 + (o.phase||0)*2)*.6;
    poly(ctx, [[-3.4,-13.6],[-8.4,-12 + fl],[-9.4,-8.6 + fl],[-4.6,-11]], '#a8362a'); // the head-wrap's tail
    h.legs('#1c1816'); ctx.fillStyle = '#3a2a1e'; ctx.fillRect(-4.5, 8.6, 3.4, 4.4); ctx.fillRect(1.1, 8.6, 3.4, 4.4); // riding boots, tall
    ctx.fillStyle = '#d8c070'; ctx.fillRect(-6.4, 11.4, 2, .8); ctx.fillRect(-.8, 11.4, 2, .8); ell(ctx, -6.6, 11.8, .7, .7, '#e8d080'); ell(ctx, -1, 11.8, .7, .7, '#e8d080'); // spurs, and no horse
    poly(ctx, [[-6.2,-6],[6.2,-6],[7,9],[1,9],[0,6.2],[-1,9],[-7,9]], h.armor('#8a2418', '#2a0806')); // the scale coat, split for a saddle he hasn't got
    ctx.save(); poly(ctx, [[-6.2,-6],[6.2,-6],[7,9],[-7,9]]); ctx.clip(); b2Scales(ctx, -6.2, 7, -5.8, 9, 1.9, '#a8362a', '#5a140c'); ctx.restore();
    ctx.fillStyle = 'rgba(255,210,180,.18)'; ctx.fillRect(-5.8, -5.6, 2.2, 9); // polished every night
    ctx.fillStyle = '#2a1a12'; ctx.fillRect(-6.4, 2.6, 12.8, 1.2); // a plain belt
    ctx.save(); ctx.translate(-.4, -1.2); ctx.rotate(-.78); ctx.fillStyle = '#d8ccb0'; ctx.fillRect(-9.4, -1.6, 18.8, 3.2); ctx.fillStyle = '#9a2a1e'; ctx.fillRect(-9.4, -.5, 18.8, 1); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-9.4, 1, 18.8, .6); ell(ctx, -9.4, 0, 1, 1.6, '#c8bc9c'); ctx.restore(); // the saddle-cloth, rolled, over the shoulder
    B2F.line(ctx, '#2a1e12', .45, [[-1.6, -6], [1.6, -3], [3.4, -6]]); ctx.fillStyle = '#e2b85a'; ctx.fillRect(.6, -3.2, 2.2, 2.2); ctx.fillStyle = 'rgba(80,50,10,.6)'; ctx.fillRect(1.2, -2.6, 1, 1); // the toll seal, square, on a cord
    ctx.fillStyle = h.armor('#9a958a', '#2a2826'); ctx.beginPath(); ctx.arc(-6.6, 6.4, 2.6, Math.PI, 0); ctx.lineTo(-4, 8.6); ctx.lineTo(-9.2, 8.6); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#0a0806'; ctx.fillRect(-8.2, 6.4, 3.2, .7); ctx.fillStyle = '#9a2a1e'; ctx.fillRect(-9.2, 5.6, 5.2, .7); // the slit-visored helm, carried at the hip
    h.head('#8a6448', 4.2, -11.4); h.look('rgba(20,10,6,.88)', -11.6);
    ctx.fillStyle = '#0e0806'; ctx.fillRect(-.6, -8.6, 4.8, .8); ctx.fillRect(3.8, -8.6, .8, 1.4); ctx.fillStyle = 'rgba(255,230,200,.35)'; ctx.fillRect(.4, -8.6, 1.4, .3); // an oiled moustache, the ends turned down; no beard
    ell(ctx, -3.2, -9, .6, .7, '#e8c060'); // a gold ring in the ear
    ctx.fillStyle = '#c4483a'; ctx.beginPath(); ctx.arc(0, -12.4, 4.9, Math.PI*.96, Math.PI*2.04); ctx.fill(); ctx.fillStyle = '#8a2418'; ctx.fillRect(-4.9, -13.2, 9.8, .8); ctx.fillStyle = 'rgba(255,220,200,.25)'; ctx.fillRect(-3, -16.6, 2.6, .6); ell(ctx, -4.4, -13.6, 1.5, 1.2, '#a8362a'); // the red head-wrap, knotted behind
    ctx.fillStyle = '#0e0806'; ctx.fillRect(3.2, -12.2, 1.4, 1.6); // black hair at the temple
    B2F.line(ctx, '#6a4a2a', 1.5, [[3.4, 3], [14.6, -9.4]], 'butt'); ctx.fillStyle = '#c8b088'; ctx.save(); ctx.translate(4.4, 1.9); ctx.rotate(-.84); ctx.fillRect(-.6, -1.2, 1.4, 2.4); ctx.restore(); // the lance, cut down, the cut end bound
    poly(ctx, [[17.6,-13.4],[14,-10.4],[13.6,-8.2],[15.6,-9.2]], '#d8d4c8'); poly(ctx, [[17.6,-13.4],[15.6,-9.2],[14.8,-8.6]], 'rgba(0,0,0,.35)'); ctx.fillStyle = '#c4483a'; ctx.fillRect(13.2, -8.6, 1.6, 1.4); // the head, a red rag under it
    ell(ctx, 7.6, -1.4, 1.5, 1.5, '#8a6448'); // the hand, choked up on the shaft: held short
    ctx.restore(); },
});

/* ---------------- portraits ---------------- */
POR.sgt_dg = (ctx) => { const F = {cy:-74, w:13.2, h:20, jaw:.82, chin:5, skin:'#7e5638', iris:'#3a2816', lip:'#7a4a3c', browCol:'#1a100a', browW:1.7, arch:.45, rim:'#d6a24a', nose:1.05, smileL:-.2, smileR:-.1, mouthW:4, bags:.5, age:.65, look:.3, open:.78, ears:false};
  // the shield behind the left shoulder: tall, curved, three regiments of paint flaking through each other
  ctx.save(); ctx.translate(-41, -44); ctx.rotate(-.12);
  const sh = () => { const w = 22, hh = 34, r = 5; ctx.beginPath(); ctx.moveTo(-w + r, -hh); ctx.lineTo(w - r, -hh); ctx.quadraticCurveTo(w, -hh, w, -hh + r); ctx.lineTo(w, hh - r); ctx.quadraticCurveTo(w, hh, w - r, hh); ctx.lineTo(-w + r, hh); ctx.quadraticCurveTo(-w, hh, -w, hh - r); ctx.lineTo(-w, -hh + r); ctx.quadraticCurveTo(-w, -hh, -w + r, -hh); ctx.closePath(); };
  sh(); ctx.fillStyle = PR.lin(ctx, -22, -30, 22, 30, [[0,'#9a8a62'], [.45,'#5e5038'], [1,'#14100a']]); ctx.fill();
  ctx.save(); sh(); ctx.clip(); const r = PR.rng(212);
  const flake = (cx, cy, rx, ry, col) => { const n = 9; ctx.beginPath(); for (let k=0;k<n;k++){ const a = k/n*Math.PI*2, j = .65 + r()*.5; k ? ctx.lineTo(cx + Math.cos(a)*rx*j, cy + Math.sin(a)*ry*j) : ctx.moveTo(cx + Math.cos(a)*rx*j, cy + Math.sin(a)*ry*j); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  [[-12, -24, 9, 7], [8, 14, 10, 8], [-14, 22, 6, 5], [12, -12, 5, 4]].forEach(([x, y, a, b]) => flake(x, y, a, b, '#6e2a20')); // the oldest coat, red, where both the others came off
  [[-4, -24, 6, 4], [8, 18, 6, 4], [-10, 12, 8, 6], [10, -26, 6, 5]].forEach(([x, y, a, b]) => flake(x, y, a, b, '#38506a')); PR.soft(ctx, -10, -10, 16, 20, '#e8d8b0', .12); // the blue over it; the lantern on the dun
  ctx.fillStyle = PR.lin(ctx, -22, 0, 22, 0, [[0,'rgba(240,190,100,.55)'], [.6,'rgba(214,162,74,.4)'], [1,'rgba(60,40,10,.3)']]); ctx.fillRect(-22, -3.6, 44, 7.2); // a band of gold, painted on last
  PR.stroke(ctx, 'rgba(20,10,4,.5)', .7, () => { for (let i=0;i<10;i++){ const x = -18 + r()*34, y = -30 + r()*58; ctx.moveTo(x, y); ctx.lineTo(x + 1 + r()*4, y + .5 + r()*2.5); } }); // gouges
  ctx.fillStyle = PR.lin(ctx, -22, 0, 22, 0, [[0,'rgba(0,0,0,0)'], [.55,'rgba(0,0,0,.2)'], [1,'rgba(0,0,0,.65)']]); ctx.fillRect(-22, -34, 44, 68); ctx.restore(); // the curve, away from the lantern
  ctx.strokeStyle = PR.lin(ctx, -22, -30, 22, 30, [[0,'#a8a294'], [.5,'#4e4a44'], [1,'#121110']]); ctx.lineWidth = 2.6; sh(); ctx.stroke();
  ell(ctx, -2, -1, 4.6, 4.8, PR.rad(ctx, -3, -2.2, .4, 5, [[0,'#c8c0b0'], [.4,'#6a665e'], [1,'#1a1816']])); ctx.restore(); // the boss
  // boiled leather over quilting, bleached pale at the shoulders by six summers
  PR.torsoPath(ctx, 44); ctx.fillStyle = PR.lit(ctx, '#86704e', '#30261a', -44, 30); ctx.fill(); // the quilting
  ctx.save(); PR.torsoPath(ctx, 44); ctx.clip();
  PR.stroke(ctx, 'rgba(60,44,24,.4)', .6, () => { for (let i=0;i<8;i++){ ctx.moveTo(-46 + i*12, -48); ctx.lineTo(-46 + i*12, 2); } });
  PR.path(ctx, [[-29, 2], [-27, -35], [-12, -41], [12, -41], [27, -35], [29, 2]]); ctx.fillStyle = PR.lit(ctx, '#8a6038', '#2e1c0e', -29, 26); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.stroke(); // the cuirass
  PR.soft(ctx, -14, -32, 14, 8, '#f0d8a8', .14); for (let i=0;i<12;i++){ const r = PR.rng(i + 140); ell(ctx, -24 + r()*46, -32 + r()*30, 1 + r()*3, .5 + r(), 'rgba(240,220,180,.12)'); } // sun-bleached, salt-stained
  PR.stitch(ctx, 'rgba(230,200,140,.35)', .45, () => { ctx.moveTo(-26, -32); ctx.lineTo(-12, -38.4); ctx.lineTo(12, -38.4); ctx.lineTo(26, -32); });
  ctx.fillStyle = PR.lin(ctx, -30, 0, -16, 0, [[0,'#f4c878'], [1,'#8a5a18']]); [0, 1].forEach(i => { ctx.save(); ctx.translate(-21 + i*5, -27 + i*1.6); ctx.rotate(.3); ctx.fillRect(-2.2, -.8, 4.4, 1.6); ctx.restore(); }); // the sergeant's two gold bars, sewn on the breast
  PR.soft(ctx, 30, -18, 22, 22, '#000000', .45);
  // the sword's baldric, and Ressan's token on its cord at the breast, worn smooth
  ctx.strokeStyle = PR.lit(ctx, '#5a3e24', '#1a1008', -30, 30); ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(-26, -42); ctx.lineTo(22, 2); ctx.stroke();
  ctx.restore();
  PR.neck(ctx, F, 7.2);
  // the scarf: wound round the throat, up over the head, and the tail down over the near shoulder
  const u = F.h/20, cy = F.cy, top = cy - 21*u;
  ctx.save(); ctx.beginPath(); ctx.moveTo(-15, -52); ctx.bezierCurveTo(-24, -46, -30, -42, -34, -36); ctx.lineTo(-24, -30); ctx.bezierCurveTo(-18, -38, -10, -42, 0, -42); ctx.bezierCurveTo(10, -42, 16, -44, 17, -50); ctx.bezierCurveTo(12, -56, -10, -57, -15, -52); ctx.closePath();
  ctx.fillStyle = PR.lin(ctx, -34, 0, 18, 0, [[0,'#c88a50'], [.35,'#9a6434'], [.8,'#4a2c16'], [1,'#1a0e06']]); ctx.fill(); ctx.clip();
  PR.stroke(ctx, 'rgba(60,40,18,.45)', .9, () => { for (let i=0;i<4;i++){ ctx.moveTo(-14 - i*4, -54 + i*4); ctx.quadraticCurveTo(0, -48 + i*2.4, 16, -52 + i*2.6); } });
  PR.stroke(ctx, 'rgba(214,162,74,.8)', 1.2, () => { ctx.moveTo(-30, -38); ctx.quadraticCurveTo(-10, -47, 16, -48); }); ctx.restore(); // a gold thread woven through it
  F.under = (ctx, F) => { const u = F.h/20; PR.soft(ctx, 0, F.cy - 14, F.w*1.1, 5, '#120806', .5); // the scarf's shadow on the brow
    ctx.lineCap = 'round'; PR.stroke(ctx, 'rgba(40,16,8,.35)', .5, () => { [-1, 1].forEach(sd => { for (let i=0;i<3;i++){ ctx.moveTo(sd*F.w*.62, F.cy + (-1.4 + i*1.2)*u); ctx.lineTo(sd*(F.w*.86), F.cy + (-2.4 + i*1.6)*u); } }); }); // squint-lines from the glare
    PR.soft(ctx, -4, F.cy - 8*u, 6, 2, '#ffd8a8', .12); PR.stroke(ctx, 'rgba(230,190,160,.4)', .45, () => { ctx.moveTo(-3, F.cy + 11.6*u); ctx.lineTo(-1, F.cy + 11.9*u); }); // sun-cracked lips
    PR.soft(ctx, 3, F.cy + 3*u, 7, 3, '#3a1a0c', .2); PR.dots(ctx, F, 50, 'rgba(30,14,8,.22)', .45, [7, 18, (x, y) => Math.abs(x) > F.w*.8 || (Math.abs(x) < 4.6 && y > 10.4 && y < 14)]); }; // a few days' dust and stubble-shadow, not a beard
  PR.face(ctx, F);
  // the head-wrap: over the crown, a band at the brow, round the jaw on the far side, tucked in
  ctx.beginPath(); ctx.moveTo(-F.w - 2.6, cy + 2); ctx.bezierCurveTo(-F.w - 3.4, top - 4, F.w + 3.4, top - 4, F.w + 2.6, cy + 2); ctx.bezierCurveTo(F.w + 3, cy + 10, F.w + 1, cy + 16, F.w*.5, cy + 20); ctx.lineTo(F.w*.62, cy + 12); ctx.bezierCurveTo(F.w + .4, cy + 6, F.w + .6, cy - 4, F.w - .4, cy - 8);
  ctx.bezierCurveTo(F.w*.4, cy - 15.2, -F.w*.4, cy - 15.2, -F.w + .4, cy - 8); ctx.bezierCurveTo(-F.w - .6, cy - 4, -F.w - .6, cy + 2, -F.w - .8, cy + 6); ctx.closePath();
  ctx.fillStyle = PR.lin(ctx, -F.w - 3, 0, F.w + 3, 0, [[0,'#cc9058'], [.35,'#a8703c'], [.75,'#50301a'], [1,'#180c06']]); ctx.fill();
  ctx.save(); ctx.clip(); PR.stroke(ctx, 'rgba(70,46,20,.5)', .8, () => { for (let i=0;i<5;i++){ ctx.moveTo(-F.w - 2, cy - 4 - i*3.4); ctx.quadraticCurveTo(0, top - 3 + i*2.6, F.w + 2, cy - 2 - i*3.6); } });
  PR.stroke(ctx, 'rgba(255,240,210,.22)', .7, () => { for (let i=0;i<3;i++){ ctx.moveTo(-F.w - 1, cy - 6 - i*4); ctx.quadraticCurveTo(-F.w*.5, top + i*3, -2, top - 1 + i*3.4); } });
  ctx.fillStyle = PR.lin(ctx, -F.w, 0, F.w, 0, [[0,'#f4c878'], [.6,'#c8963e'], [1,'#3a2808']]); ctx.beginPath(); ctx.moveTo(-F.w - 2, cy - 8.6); ctx.quadraticCurveTo(0, cy - 17.6, F.w + 2, cy - 8.6); ctx.lineTo(F.w + 2, cy - 6.8); ctx.quadraticCurveTo(0, cy - 15.6, -F.w - 2, cy - 6.8); ctx.fill(); ctx.restore(); // the gold stripe at the brow
  PR.stroke(ctx, 'rgba(10,6,4,.6)', .7, () => { ctx.moveTo(-F.w + .4, cy - 8); ctx.bezierCurveTo(-F.w*.4, cy - 15.2, F.w*.4, cy - 15.2, F.w - .4, cy - 8); });
  ctx.fillStyle = '#1a120c'; [[-F.w + 1.2, cy - 7.4], [F.w - 2.2, cy - 7.6]].forEach(([x, y]) => { PR.path(ctx, [[x, y], [x + 1.2, y - .6], [x + 1, y + 3.2], [x + .1, y + 2.6]]); ctx.fill(); }); // cropped dark hair under it, at the temples
  // Ressan's token, on its cord over the scarf: brass, worn smooth, a water-jar stamped in it
  PR.stroke(ctx, '#2a1a0e', .7, () => { ctx.moveTo(-6, -46); ctx.quadraticCurveTo(-4, -34, -1, -28); ctx.moveTo(6, -46); ctx.quadraticCurveTo(4, -34, 1, -28); });
  ell(ctx, 0, -25, 4.2, 4.2, PR.rad(ctx, -1.2, -26.4, .5, 4.6, [[0,'#fff0c0'], [.35,'#e2b85a'], [1,'#4a3008']])); PR.stroke(ctx, 'rgba(70,40,8,.6)', .5, () => { ctx.moveTo(-1.2, -27); ctx.quadraticCurveTo(-2, -24, 0, -22.6); ctx.quadraticCurveTo(2, -24, 1.2, -27); ctx.closePath(); });
  return F; };

/* Ramin: twenty-six, lean, very straight. Bareheaded under a red head-wrap; the slit-visored helm is somewhere else; an oiled moustache,
   a gold ring in the ear; the red scale under a rolled saddle-cloth and a bridle he has no horse to put on; the lance-head on its cut shaft
   upright behind him; his father's toll seal from the Old Quarter gate on a cord at his throat */
POR.redblade = (ctx) => { const F = {cy:-75, w:12.2, h:20.6, jaw:.8, chin:4.6, skin:'#8a6448', iris:'#24160c', lip:'#7a4636', browCol:'#0e0806', browW:1.8, arch:.9, browL:.3, rim:'#c4483a', rimA:.22, nose:1.25, look:.2, smileL:-.1, smileR:.2, mouthW:3.8, age:.12, bags:.25, earS:.95};
  // the lance, cut down after it broke at the Sekala: an ash shaft, the cut end bound in cord, a long iron head, a red rag under it
  ctx.save(); ctx.translate(31, 0); ctx.rotate(.1);
  ctx.strokeStyle = PR.lin(ctx, -2, 0, 2, 0, [[0,'#a07a50'], [.5,'#5a4026'], [1,'#1a1008']]); ctx.lineWidth = 3.6; ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(0, -108); ctx.stroke();
  PR.path(ctx, [[0, -140], [3.8, -124], [2, -110], [-2, -110], [-3.8, -124]]); ctx.fillStyle = PR.lin(ctx, -4, 0, 4, 0, [[0,'#ece6da'], [.45,'#9a968c'], [1,'#242220']]); ctx.fill(); PR.stroke(ctx, 'rgba(0,0,0,.45)', .5, () => { ctx.moveTo(0, -138); ctx.lineTo(0, -111); });
  ctx.fillStyle = PR.lin(ctx, -6, 0, 6, 0, [[0,'#e05a40'], [.5,'#a8302a'], [1,'#3a0a06']]); PR.path(ctx, [[-2.2, -109], [2.2, -109], [5, -96], [1.4, -100], [-1, -92], [-2.6, -102]]); ctx.fill(); ctx.restore(); // the rag
  // the scale: red enamel, polished every night
  PR.torsoPath(ctx, 40, 3); ctx.fillStyle = PR.lit(ctx, '#7a2018', '#220604', -40, 30); ctx.fill();
  ctx.save(); PR.torsoPath(ctx, 40, 3); ctx.clip();
  PR.scales(ctx, -46, 46, -48, 15, 5.2, '#8e2a1e'); PR.soft(ctx, -10, -8, 30, 14, '#000000', .25);
  PR.soft(ctx, 28, -18, 26, 24, '#000000', .5); PR.soft(ctx, -22, -34, 14, 9, '#ffe0d0', .22); // the shine he keeps on it
  // the saddle-cloth, rolled tight and slung over the near shoulder and across: cream wool, the company's red stripe
  ctx.save(); ctx.translate(-6, -22); ctx.rotate(.8); const rl = () => { ctx.beginPath(); ctx.moveTo(-40, -4.6); ctx.lineTo(40, -4.6); ctx.quadraticCurveTo(42.6, 0, 40, 4.6); ctx.lineTo(-40, 4.6); ctx.closePath(); };
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2; rl(); ctx.fillStyle = '#2a2018'; ctx.fill(); ctx.restore();
  rl(); ctx.fillStyle = PR.lin(ctx, 0, -5, 0, 5, [[0,'#d8ccb0'], [.4,'#a89a7a'], [1,'#2a2218']]); ctx.fill(); ctx.save(); rl(); ctx.clip();
  ctx.fillStyle = PR.lin(ctx, 0, -2, 0, 2, [[0,'#d8503a'], [1,'#5a140c']]); ctx.fillRect(-42, -1.2, 84, 2.4); PR.stroke(ctx, 'rgba(60,40,20,.4)', .6, () => { for (let i=0;i<12;i++){ ctx.moveTo(-38 + i*7, -5); ctx.quadraticCurveTo(-36 + i*7, 0, -38 + i*7, 5); } });
  PR.soft(ctx, 30, 0, 22, 10, '#000000', .55); ctx.restore(); ctx.restore();
  // the bridle over the far shoulder: a cheek-strap and an iron bit-ring, hanging
  ctx.strokeStyle = PR.lin(ctx, 10, 0, 34, 0, [[0,'#5a3a22'], [1,'#120a04']]); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(14, -46); ctx.bezierCurveTo(22, -42, 26, -30, 24, -18); ctx.stroke();
  ctx.strokeStyle = '#6a6458'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(24, -14.6, 3.4, 0, 7); ctx.stroke(); ell(ctx, 19.4, -38, 2.2, 2.2, '#6a5020');
  ctx.restore();
  PR.neck(ctx, F, 6.8);
  // a cord at the throat and his father's toll seal on it: square brass, the Empire's mark and the Old Quarter gate
  PR.stroke(ctx, '#1a0e08', .8, () => { ctx.moveTo(-5.8, -47); ctx.quadraticCurveTo(-4, -40, -1.2, -36.4); ctx.moveTo(5.8, -47); ctx.quadraticCurveTo(4, -40, 1.2, -36.4); });
  ctx.save(); ctx.translate(0, -33); ctx.rotate(.12); ctx.fillStyle = PR.lin(ctx, -4, -4, 4, 4, [[0,'#fff0c0'], [.35,'#d8a84a'], [1,'#3a2408']]); ctx.fillRect(-4, -4, 8, 8); ctx.strokeStyle = 'rgba(60,34,6,.8)'; ctx.lineWidth = .5; ctx.strokeRect(-2.6, -2.6, 5.2, 5.2); PR.stroke(ctx, 'rgba(60,34,6,.7)', .5, () => { ctx.moveTo(-1.4, 2.4); ctx.lineTo(-1.4, -.6); ctx.arc(0, -.6, 1.4, Math.PI, 0); ctx.lineTo(1.4, 2.4); }); ctx.restore(); // a little arch: the gate
  F.under = (ctx, F) => { const u = F.h/20, cy = F.cy; // clean-shaven, close; an oiled moustache, its ends turned down; a lance-cut healing on the jaw
    PR.dots(ctx, F, 90, 'rgba(20,10,6,.18)', .4, [8, 19, (x, y) => Math.abs(x) > F.w*.85 || (Math.abs(x) < 4.4 && y > 10.4 && y < 14)]);
    ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-1, cy + 9.9*u); ctx.bezierCurveTo(-3, cy + 9.6*u, -5.4, cy + 10.2*u, -6, cy + 13.4*u); ctx.bezierCurveTo(-5, cy + 11.4*u, -3, cy + 10.8*u, 0, cy + 10.9*u); ctx.bezierCurveTo(3, cy + 10.8*u, 5, cy + 11.4*u, 6, cy + 13.4*u); ctx.bezierCurveTo(5.4, cy + 10.2*u, 3, cy + 9.6*u, 1, cy + 9.9*u); ctx.closePath(); ctx.fillStyle = '#0e0806'; ctx.fill();
    PR.soft(ctx, -2.6, cy + 10.1*u, 1.8, .5, '#ffe0c0', .35); // the oil catching the lantern
    PR.stroke(ctx, 'rgba(140,60,50,.55)', .7, () => { ctx.moveTo(-F.w*.88, cy + 6*u); ctx.lineTo(-F.w*.6, cy + 10.6*u); }); PR.stroke(ctx, 'rgba(230,180,160,.35)', .35, () => { ctx.moveTo(-F.w*.9, cy + 5.8*u); ctx.lineTo(-F.w*.62, cy + 10.4*u); });
    PR.soft(ctx, 0, cy - 14*u, F.w, 3.6, '#120806', .45); }; // the wrap's shadow on his brow
  PR.face(ctx, F);
  // a gold ring in the near ear
  const ex = -(F.w + .3), ey = F.cy + 1.8*(F.h/20) + 4.4; ctx.strokeStyle = PR.lin(ctx, ex - 2, 0, ex + 2, 0, [[0,'#fff0c0'], [.5,'#d8a84a'], [1,'#5a3a08']]); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(ex, ey + 1.8, 1.9, 0, 7); ctx.stroke();
  // the red head-wrap: black hair under it at the temples and the nape, wound round, knotted at the near side, the tail down to the shoulder
  const u = F.h/20, cy = F.cy, top = cy - 21*u;
  ctx.fillStyle = '#0c0806'; [[-F.w + .6, cy - 8], [F.w - 2.4, cy - 8.2]].forEach(([x, y]) => { PR.path(ctx, [[x, y], [x + 1.8, y - .4], [x + 1.4, y + 4], [x, y + 3.4]]); ctx.fill(); });
  const wrap = () => { ctx.beginPath(); ctx.moveTo(-F.w - 1.6, cy - 4); ctx.bezierCurveTo(-F.w - 3, top - 5, F.w + 3, top - 5, F.w + 1.6, cy - 4); ctx.bezierCurveTo(F.w + .4, cy - 9, F.w*.4, cy - 13.8, 0, cy - 14); ctx.bezierCurveTo(-F.w*.4, cy - 13.8, -F.w - .4, cy - 9, -F.w - 1.6, cy - 4); ctx.closePath(); };
  wrap(); ctx.fillStyle = PR.lin(ctx, -F.w - 3, 0, F.w + 3, 0, [[0,'#e86a50'], [.3,'#c4483a'], [.72,'#6a1a12'], [1,'#1a0604']]); ctx.fill();
  ctx.save(); wrap(); ctx.clip(); PR.stroke(ctx, 'rgba(60,8,4,.55)', .9, () => { for (let i=0;i<6;i++){ ctx.moveTo(-F.w - 3, cy - 6 - i*3); ctx.quadraticCurveTo(-2 + i*2, top - 2 + i*2.6, F.w + 3, cy - 10 - i*2.4); } });
  PR.stroke(ctx, 'rgba(255,200,180,.3)', .7, () => { for (let i=0;i<3;i++){ ctx.moveTo(-F.w - 1, cy - 8 - i*4); ctx.quadraticCurveTo(-F.w*.4, top + i*3, 2, top - 1.6 + i*3.2); } }); ctx.restore();
  PR.stroke(ctx, 'rgba(10,2,0,.6)', .7, () => { ctx.moveTo(-F.w - 1.6, cy - 4); ctx.bezierCurveTo(-F.w - .4, cy - 9, -F.w*.4, cy - 13.8, 0, cy - 14); ctx.bezierCurveTo(F.w*.4, cy - 13.8, F.w + .4, cy - 9, F.w + 1.6, cy - 4); });
  ell(ctx, -F.w - 2.6, cy - 8, 3.6, 3, PR.rad(ctx, -F.w - 3.6, cy - 9, .4, 4, [[0,'#f08060'], [.5,'#b03a2c'], [1,'#3a0a06']])); // the knot
  ctx.beginPath(); ctx.moveTo(-F.w - 4.6, cy - 6.4); ctx.bezierCurveTo(-F.w - 9, cy + 6, -F.w - 6, -54, -F.w - 12, -44); ctx.lineTo(-F.w - 6.4, -44); ctx.bezierCurveTo(-F.w - 3, -54, -F.w - 4, cy + 4, -F.w - 1.4, cy - 6); ctx.closePath(); ctx.fillStyle = PR.lin(ctx, -F.w - 12, 0, -F.w, 0, [[0,'#e86a50'], [.6,'#a8362a'], [1,'#4a0e08']]); ctx.fill(); // the tail
  ctx.fillStyle = '#d8a84a'; ctx.fillRect(-F.w - 12, -45, 5.8, 1.2); // its fringed end, a brass bead in it
  return F; };
