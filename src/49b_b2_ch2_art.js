/* ============ Book Two, Chapter 2 art: The Odhan — Dryj Spring, Sekala Crossing, the warlocks' night ============ */
/* Figures (FIGX), the Red Blade's bust (POR), the river and the spring (TILEX) and three backdrops (SCENEX), drawn the way
   src/47b_book2_art.js draws: lantern low on the left, glare by day, blue-black by night, dust over everything. */

/* ---------------- figures: FIGX[kind](ctx, h, t, o), the same ~32px frame as 47b ---------------- */
/* overlapping scales over a torso, row by row, lit from the left */
function b2Scales(ctx, x0, x1, y0, rows, sw, c1, c2){ for (let r=0;r<rows;r++){ const y = y0 + r*sw*.7; for (let x=x0 + (r%2)*sw*.5; x<x1; x+=sw){ const k = (x - x0)/(x1 - x0);
  ctx.fillStyle = k < .45 ? c1 : c2; ctx.beginPath(); ctx.moveTo(x - sw*.5, y); ctx.lineTo(x + sw*.5, y); ctx.quadraticCurveTo(x + sw*.5, y + sw*.9, x, y + sw); ctx.quadraticCurveTo(x - sw*.5, y + sw*.9, x - sw*.5, y); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x0 - sw*.5, y + sw*.62, x1 - x0 + sw, .4); } }
Object.assign(FIGX, {
  /* a Red Blade: a Seven Cities loyalist in the Empire's service — red-enamelled scale, a spiked iron helm with a mail curtain, a black sash, a tulwar */
  redblade(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.02, 1.05);
    h.legs('#1c1816'); ctx.fillStyle = '#3a2a1e'; ctx.fillRect(-4.5, 9.4, 3.4, 3.6); ctx.fillRect(1.1, 9.4, 3.4, 3.6); // boots
    poly(ctx, [[-6.6,-6],[6.6,-6],[7.6,9.4],[1,9.4],[0,6.4],[-1,9.4],[-7.6,9.4]], h.armor('#8a2418', '#2a0806')); // the scale coat, split for riding
    ctx.save(); poly(ctx, [[-6.6,-6],[6.6,-6],[7.6,9.4],[-7.6,9.4]]); ctx.clip(); b2Scales(ctx, -6.6, 7.6, -5.8, 9, 1.9, '#a8362a', '#5a140c'); ctx.restore();
    ctx.fillStyle = 'rgba(255,200,170,.14)'; ctx.fillRect(-6.2, -5.6, 2.4, 9); // the enamel catching the light
    ctx.fillStyle = '#141010'; ctx.fillRect(-6.8, 2.4, 13.6, 1.8); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-.9, 2.4, 1.8, 1.8); ctx.fillStyle = '#141010'; ctx.fillRect(-6.4, 4, 1.6, 4.4); // a black sash, its tail, a brass buckle
    ctx.fillStyle = '#2a1a12'; ctx.fillRect(-8, -1, 1.6, 6.4); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-8.2, -1.6, 2, 1); // a dagger at the hip
    h.head('#8a6448', 4.4, -11.2); h.look('rgba(20,10,6,.88)', -11.4);
    poly(ctx, [[-3.4,-9.4],[4.6,-9.4],[4,-6.6],[1.4,-5.2],[-1.6,-5.8],[-3.2,-7.4]], '#140c08'); ctx.fillStyle = '#140c08'; ctx.fillRect(-1.4, -9.8, 5.4, 1); // a black beard, oiled, the moustache trimmed
    poly(ctx, [[-5.4,-12.6],[-3,-12.6],[-3.6,-6],[-6.8,-6.6]], '#4a4640'); ctx.fillStyle = 'rgba(200,200,190,.35)'; for (let i=0;i<4;i++) ctx.fillRect(-6.2 + (i%2)*.8, -11.6 + i*1.4, .6, .6); // the mail curtain at the neck
    ctx.fillStyle = h.armor('#9a958a', '#2a2826'); ctx.beginPath(); ctx.moveTo(-5.2, -12.4); ctx.quadraticCurveTo(-5, -17.4, 0, -19.4); ctx.quadraticCurveTo(5, -17.4, 5.2, -12.4); ctx.closePath(); ctx.fill(); // the helm, rising to a spike
    ctx.fillStyle = '#8a2418'; ctx.fillRect(-5.6, -13.4, 11.2, 1.5); ctx.fillStyle = 'rgba(255,240,220,.3)'; ctx.fillRect(-3.4, -17, 1.2, 3); // a red band; the shine
    B2F.line(ctx, '#2a2420', .8, [[0, -19.4], [0, -21.4]]); B2F.line(ctx, '#b02a1c', 1.3, [[0, -21], [-2.6, -20.6], [-5, -18], [-6.6, -15]]); // the spike, and a red horsetail off it
    B2F.curved(ctx, '#dcd4c4', 1.05); ctx.fillStyle = '#8a2418'; ctx.fillRect(6, 2.6, 1.6, 1.6); // the tulwar, red cord on the grip
    ctx.restore(); },
  /* Guran heavy infantry: a rebel city legion — a long mail coat, a domed helm with a mail veil over the face, a tall hide shield, a spear */
  guran(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.1, 1.08);
    B2F.line(ctx, '#4a3820', 1.5, [[8.6, 12.6], [9.8, -25]], 'butt'); poly(ctx, [[9.9,-30.4],[8.6,-24.6],[11,-24.6]], '#b8b4a8'); ctx.fillStyle = '#3e8a3a'; ctx.fillRect(9, -24.4, 1.8, 1.6); // the spear, a green rag at its head
    h.legs('#26221e'); ctx.fillStyle = h.armor('#7a766c', '#2a2824'); ctx.fillRect(-4.6, 6.4, 3.6, 5.2); ctx.fillRect(1, 6.4, 3.6, 5.2); // greaves
    poly(ctx, [[-7,-6.4],[7,-6.4],[8,9.6],[-8,9.6]], h.armor('#7e786c', '#1e1c18')); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<7;i++){ ctx.moveTo(-7.4, -4.6 + i*2.1); ctx.lineTo(7.6, -4.6 + i*2.1); } ctx.stroke(); // the long mail coat
    poly(ctx, [[-6.4,-6.4],[6.4,-6.4],[6,1.6],[-6,1.6]], h.armor('#a07e48', '#3a2810')); ctx.strokeStyle = 'rgba(30,18,6,.55)'; ctx.lineWidth = .45; ctx.beginPath(); for (let i=0;i<9;i++){ ctx.moveTo(-5.6 + i*1.4, -6); ctx.lineTo(-5.6 + i*1.4, 1.4); } ctx.stroke(); // a bronze lamellar breast over it
    ctx.fillStyle = '#2a1e12'; ctx.fillRect(-7.2, 1.6, 14.4, 1.6); B2F.green(ctx, -8.6, -4);
    h.head('#7a5a40', 4.6, -11.2); h.look('rgba(255,200,150,.55)', -11.6);
    ctx.fillStyle = h.armor('#8a867c', '#1e1d1a'); ctx.beginPath(); ctx.arc(0, -12.4, 5.4, Math.PI, 0); ctx.fill(); ctx.fillRect(-5.6, -12.8, 11.2, 1.4); ctx.fillStyle = 'rgba(255,250,240,.2)'; ctx.fillRect(-3.6, -16.6, 3, 1); // the domed helm
    poly(ctx, [[-5.4,-10.4],[5.4,-10.4],[5,-5.6],[0,-4.4],[-5,-5.6]], '#4e4a44'); ctx.fillStyle = 'rgba(190,186,176,.35)'; for (let r=0;r<3;r++) for (let c=0;c<5;c++) ctx.fillRect(-4.2 + c*2 + (r%2), -9.6 + r*1.5, .7, .6); // the mail veil
    ctx.fillStyle = '#0c0a08'; ctx.fillRect(-2, -12.2, 6, 1.4); h.look('rgba(255,200,150,.6)', -12); // the eye-slit, a glint
    ctx.save(); ctx.translate(-8.4, 0); ctx.fillStyle = h.armor('#6a4a2c', '#1e140a'); ctx.beginPath(); ctx.moveTo(-4.4, -8.6); ctx.quadraticCurveTo(0, -11, 4.4, -8.6); ctx.lineTo(4.4, 9); ctx.quadraticCurveTo(0, 10.6, -4.4, 9); ctx.closePath(); ctx.fill(); // the tall hide shield
    ctx.strokeStyle = '#a07e48'; ctx.lineWidth = .9; ctx.stroke(); ell(ctx, 0, 0, 1.8, 2, '#b89050'); ell(ctx, -.5, -.5, .7, .7, '#f0d8a0'); ctx.fillStyle = 'rgba(62,138,58,.55)'; ctx.fillRect(-4.2, -4.6, 8.4, 1.4); ctx.restore(); // bronze rim and boss, a band of the rising's green
    ctx.restore(); },
  /* Captain Mincer of the sappers: old, burned down one side of his face, a coat that is all pockets, a pick-hammer */
  mincer(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.06, 1.02);
    h.legs('#2a2620'); ctx.fillStyle = '#3e3020'; ctx.fillRect(-4.6, 9.6, 3.6, 3.4); ctx.fillRect(1, 9.6, 3.6, 3.4);
    poly(ctx, [[-6.6,-6],[6.6,-6],[7.4,9.6],[-7.4,9.6]], h.armor('#6e5c40', '#221a10')); // the coat
    ctx.fillStyle = '#3e3222'; [[-5.8,-4.4],[1.8,-4.4],[-6.2,.4],[2.2,.4],[-6.4,5],[2.6,5]].forEach(([x, y]) => ctx.fillRect(x, y, 3.6, 3)); ctx.fillStyle = 'rgba(220,200,160,.22)'; [[-5.8,-4.4],[1.8,-4.4],[-6.2,.4],[2.2,.4],[-6.4,5],[2.6,5]].forEach(([x, y]) => ctx.fillRect(x, y, 3.6, .7)); // pockets, and pockets
    ctx.fillStyle = '#c8b890'; ctx.fillRect(2.4, -5.2, .7, 1.4); ctx.fillStyle = '#e07a45'; ctx.fillRect(-5, .9, 1.4, 1.2); // a stub of chalk; something round and clay he should not be carrying
    ctx.fillStyle = '#b8b0a0'; ctx.fillRect(-1.6, -6, 3.2, .9); // the captain's bar at the collar
    h.head('#a8826a', 4.6, -11); h.look('rgba(24,14,10,.85)', -11.4);
    ctx.fillStyle = '#8a8478'; ctx.beginPath(); ctx.arc(0, -12.4, 4.7, Math.PI*1.02, Math.PI*1.35); ctx.lineTo(-2, -13.6); ctx.fill(); ctx.fillRect(-4.6, -12.6, 1.4, 3.4); // grey stubble of hair, the crown bald
    ell(ctx, 3, -9.8, 1.7, 2.6, '#b07c6a'); ell(ctx, 2.6, -10.6, .7, .9, 'rgba(255,220,200,.3)'); ell(ctx, 3.6, -8.2, .8, .5, 'rgba(110,50,40,.45)'); // the burn, shiny, down the near cheek
    ctx.fillStyle = 'rgba(170,166,156,.55)'; ctx.fillRect(-2.6, -8.6, 3.6, 1.8); ctx.fillStyle = 'rgba(255,250,240,.14)'; ctx.fillRect(-2.6, -15.4, 3.2, 1); // grey stubble; the bald pate shining
    B2F.line(ctx, '#5a4026', 1.4, [[5.6, 4.4], [10.2, -6]]); poly(ctx, [[7.8,-6.8],[12.8,-4.8],[12.4,-4],[8,-5.6]], '#8a8680'); ctx.fillStyle = '#5a5650'; ctx.fillRect(7.6, -7.4, 1.6, 2); // the pick-hammer
    ctx.restore(); },
  /* a Malazan sapper: leather cap, a shovel over the shoulder, a satchel that should be handled more gently */
  sapper(ctx, h, t, o){ const sk = b2Pick(o, ['#a8826a', '#8e6a4c', '#b4947a', '#7a5a40']), cap = b2Pick(o, ['#4a3a28', '#5a4a34', '#3a3026']), coat = b2Pick(o, [['#6a5a40','#2a2016'], ['#5e5444','#221e16'], ['#74603e','#2a2012']]);
    B2F.line(ctx, '#5a4026', 1.3, [[5.4, 3.2], [-6.4, -16.4]], 'butt'); ctx.save(); ctx.translate(-6.8, -17); ctx.rotate(-.55); ctx.fillStyle = h.armor('#9a968c', '#3a3834'); ctx.beginPath(); ctx.moveTo(-2.2, -1); ctx.lineTo(2.2, -1); ctx.lineTo(2, 3.6); ctx.quadraticCurveTo(0, 5.4, -2, 3.6); ctx.closePath(); ctx.fill(); ctx.restore(); // the shovel, blade up behind
    h.legs('#2e2a24'); h.torso(coat[0], coat[1], 6.2); poly(ctx, [[-4.6,-2],[4.6,-2],[5.4,9.6],[-5.4,9.6]], h.armor('#5a4430', '#1e140a')); ell(ctx, 1.6, 5, 1.4, 1, 'rgba(10,6,4,.5)'); // the leather apron, scorched
    ctx.fillStyle = '#4a3622'; ctx.fillRect(-9.2, -.6, 4.4, 6); ctx.fillStyle = '#5e4630'; ctx.fillRect(-9.2, -.6, 4.4, 1.5); ell(ctx, -7, -.6, 1.2, 1, '#c87a4a'); B2F.line(ctx, '#3a2a1a', 1, [[-5.4, -.4], [4, -6]]); // the satchel, a clay munition peeping
    h.head(sk, 4.4, -11.2); h.look(); B2F.cap(ctx, cap, 4.7, -13, 1, 2); ctx.fillStyle = cap; ctx.fillRect(-4.7, -13.2, 1.8, 3.4); // a leather cap, one flap down
    ctx.fillStyle = '#5a4428'; ctx.fillRect(-4.6, -14.4, 9.2, .8); ell(ctx, -1.4, -14.6, 1.3, 1, '#c9a44a'); ell(ctx, 1.8, -14.6, 1.3, 1, '#c9a44a'); ell(ctx, -1.6, -14.8, .6, .4, 'rgba(255,250,220,.7)'); ell(ctx, 1.6, -14.8, .6, .4, 'rgba(255,250,220,.5)'); // goggles, pushed up
    ctx.fillStyle = 'rgba(20,14,10,.3)'; ctx.fillRect(1.2, -9.6, 2.8, 1); // soot
    ctx.fillStyle = sk; ctx.fillRect(4.6, 2, 2, 1.8); },
  /* Nil: a Wickan warlock, a boy; long loose hair, ochre across the eyes, feathers and bone, the spirits never far */
  nil(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .82, .86); const p = (Math.sin(t/1100 + 1) + 1)/2;
    h.legs('#2a2018'); poly(ctx, [[-5.4,-6],[5.4,-6],[6.4,8.4],[-6.4,8.4]], h.armor('#5e4632', '#1a120a')); ctx.fillStyle = 'rgba(200,180,140,.5)'; for (let i=0;i<7;i++) ctx.fillRect(-5.6 + i*1.8, 8.2, .5, 1.8 + (i%2)); // a hide tunic, fringed
    ctx.fillStyle = '#1a1210'; ctx.fillRect(-4.8, -12.6, 2.2, 13); // long black hair down his back
    ctx.fillStyle = '#d8ccb0'; [[-2.6,-3],[1.4,-1.6],[-.6,1.6]].forEach(([x, y]) => { ctx.fillRect(x, y, .8, 2); }); B2F.line(ctx, '#3a2a1a', .5, [[-4, -5.6], [0, -1], [4, -5.6]]); // bone on a thong
    B2F.line(ctx, '#5e4632', 1.6, [[4.6, -4], [8.4, -8.6]]); ell(ctx, 8.8, -9.2, 1.2, 1.2, '#8a6448'); // a hand lifted
    h.head('#8a6448', 4.2, -11.4); B2F.cap(ctx, '#0e0a08', 4.5, -12.6, .98, 2.02); ctx.fillStyle = 'rgba(176,80,42,.6)'; ctx.fillRect(-3.4, -12.4, 7.6, 1.6); h.look('rgba(230,220,200,.6)', -11.9); // ochre across the eyes, and old eyes looking out of it
    poly(ctx, [[-4.4,-13.4],[-6.8,-18.6],[-5.6,-18.8],[-3.6,-13.6]], '#1a1a20'); ctx.fillStyle = 'rgba(120,130,170,.4)'; ctx.fillRect(-6, -18, .5, 3); // a crow's feather in the hair
    for (let i=0;i<3;i++){ const a = t/1300 + i*2.1; ell(ctx, 8.8 + Math.cos(a)*3, -11 - i*3 + Math.sin(a)*1.2, 1.4, .8, `rgba(200,214,196,${.14 + p*.14})`); } // the spirits, at his fingers
    ctx.restore(); },
  /* Nether: a Wickan warlock, a girl; two braids tied with red, white lines on the chin, a rattle of bone, the spirits about her */
  nether(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .8, .84); const p = (Math.sin(t/950) + 1)/2;
    B2F.robe(ctx, h, '#7a4a30', '#22120a', 5.4, 7.4); ctx.fillStyle = '#c8a24a'; for (let i=0;i<6;i++) ctx.fillRect(-6.4 + i*2.4, 10.2, 1.2, .9); ctx.fillStyle = '#8a2a1a'; ctx.fillRect(-5.6, 1.6, 11.2, 1.1); // a long hide dress, a beaded hem, a red belt
    ctx.fillStyle = '#e8e0cc'; for (let i=0;i<5;i++) ctx.fillRect(-2.6 + i*1.2, -6 + Math.abs(i - 2)*-.3, .6, 1.4); // a string of teeth
    h.head('#8e6648', 4.1, -11.6); h.look('rgba(230,220,200,.55)', -12);
    B2F.cap(ctx, '#0e0a08', 4.4, -12.8); B2F.braids(ctx, '#120e0c', 9, -12.6); ctx.fillStyle = '#b02a1c'; ctx.fillRect(-5.5, -4.4, 1.6, .8); ctx.fillRect(3.9, -4.4, 1.6, .8); // braids, tied with red
    ctx.fillStyle = 'rgba(232,224,204,.7)'; for (let i=0;i<3;i++) ctx.fillRect(-.4 + i*1.3, -9, .45, 1.8); // white lines on the chin
    B2F.line(ctx, '#d8ccb0', .9, [[5.4, 3], [8.6, -3]]); ell(ctx, 9, -3.8, 1.5, 1.2, '#d8ccb0'); ell(ctx, 8.6, -4.2, .5, .4, 'rgba(255,255,255,.6)'); // the rattle
    for (let i=0;i<3;i++){ const a = -t/1200 + i*2.1; ell(ctx, Math.cos(a)*8, 2 - i*5 + Math.sin(a)*1.5, 1.4, .8, `rgba(200,214,196,${.12 + p*.14})`); }
    ctx.restore(); },
  /* a Tithansi rider, dismounted: desert robes kilted for the saddle, the face wrapped, a horse-bow drawn */
  tithansi_rider(ctx, h, t, o){ const robe = b2Pick(o, [['#b09a72','#4a3c26'], ['#a08868','#3e301e'], ['#9a8a6a','#3a3222']]);
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-9.2, -6, 2.6, 10); ctx.fillStyle = '#c8b8a0'; ctx.fillRect(-8.8, -7.6, .6, 2); ctx.fillRect(-7.8, -7.2, .6, 2); // a quiver
    h.legs('#3a3024'); ctx.fillStyle = '#4a3a26'; ctx.fillRect(-4.6, 7.4, 3.6, 5.6); ctx.fillRect(1, 7.4, 3.6, 5.6); // riding boots to the knee
    poly(ctx, [[-6.2,-6],[6.2,-6],[7.2,7.6],[.8,7.6],[0,4.6],[-.8,7.6],[-7.2,7.6]], h.armor(robe[0], robe[1])); ctx.fillStyle = '#7a2a1e'; ctx.fillRect(-6.2, 1, 12.4, 1.5); ctx.fillStyle = 'rgba(60,40,20,.3)'; ctx.fillRect(-7, 6, 14, 1); // robes kilted up, a madder sash, dust
    h.head('#6a4a32', 4.4, -11.2); ctx.fillStyle = '#3a2e24'; ctx.beginPath(); ctx.arc(0, -11.6, 5.2, 0, 7); ctx.fill(); poly(ctx, [[-5,-10],[-8.6,-4.6],[-4,-6]], '#3a2e24'); ctx.fillStyle = '#7a5e44'; ctx.fillRect(-.6, -12.4, 5.2, 1.6); // the face wrapped
    ctx.fillStyle = 'rgba(255,170,120,.7)'; ctx.fillRect(.2, -12, 1.1, .9); ctx.fillRect(2.8, -12, 1.1, .9);
    ctx.strokeStyle = '#5a3a1e'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(9.6, -14); ctx.quadraticCurveTo(10.8, -12.6, 11.8, -10.8); ctx.quadraticCurveTo(14.6, -4, 11.8, 2.6); ctx.quadraticCurveTo(10.8, 4.4, 9.6, 5.8); ctx.stroke(); // the horse-bow, short and recurved
    ctx.strokeStyle = 'rgba(220,210,190,.8)'; ctx.lineWidth = .55; ctx.beginPath(); ctx.moveTo(9.8, -13.6); ctx.lineTo(2.6, -4); ctx.lineTo(9.8, 5.4); ctx.stroke(); // the string, drawn
    B2F.line(ctx, '#c8b088', .7, [[2, -4], [15, -4.2]]); poly(ctx, [[15,-5],[16.8,-4.2],[15,-3.4]], '#a8a8a0'); // the arrow
    B2F.line(ctx, robe[0], 1.8, [[-2, -4], [2.6, -4]]); ell(ctx, 2.6, -4, 1.1, 1.1, '#6a4a32'); ell(ctx, 12, -4.2, 1.1, 1.2, '#6a4a32'); }, // the arms
});
/* ---------------- portrait: Ramin of the Red Blades — Ehrlitan, a loyalist in a city that wants him dead; spiked helm, mail at the neck, red enamel scale, the tulwar over his shoulder ---------------- */
POR.redblade = (ctx) => { const F = {cy:-73, w:12.6, h:20.4, jaw:.84, chin:4.8, skin:'#8a6448', iris:'#24160c', lip:'#7a4636', browCol:'#0e0806', browW:1.75, arch:.55, rim:'#c4483a', rimA:.2, nose:1.2, look:.3, smileL:-.25, smileR:-.2, mouthW:3.8, age:.3, bags:.5, ears:false};
  // the tulwar over his right shoulder: a leather grip bound in red cord, a brass guard, the scabbard's mouth
  ctx.save(); ctx.translate(27, -50); ctx.rotate(.42);
  ctx.fillStyle = PR.lin(ctx, -4, 0, 4, 0, [[0,'#4a2a1a'], [1,'#120806']]); ctx.fillRect(-3.4, 2, 6.8, 40); // the scabbard
  ctx.fillStyle = PR.lin(ctx, -9, 0, 9, 0, [[0,'#f0d08a'], [.5,'#a07a30'], [1,'#2a1a06']]); ctx.fillRect(-9, -1, 18, 3.4); ell(ctx, -9, .7, 1.8, 1.8, '#c9a44a'); ell(ctx, 9, .7, 1.8, 1.8, '#5a4010'); // the guard
  ctx.fillStyle = PR.lin(ctx, -2.6, 0, 2.6, 0, [[0,'#5a3622'], [1,'#1a0c06']]); ctx.fillRect(-2.6, -17, 5.2, 16); PR.stroke(ctx, '#a8302a', 1, () => { for (let i=0;i<6;i++){ ctx.moveTo(-2.6, -15 + i*2.4); ctx.lineTo(2.6, -14 + i*2.4); } }); // the grip
  ell(ctx, 0, -18.6, 3.2, 2.4, PR.rad(ctx, -1, -19.4, .3, 3.4, [[0,'#fff0c0'], [.4,'#c9a44a'], [1,'#3a2a08']])); ctx.restore(); // the pommel
  // red-enamelled scale, edged with black leather
  PR.torsoPath(ctx, 42, 2); ctx.fillStyle = PR.lit(ctx, '#7a2018', '#220604', -42, 30); ctx.fill();
  ctx.save(); PR.torsoPath(ctx, 42, 2); ctx.clip();
  PR.scales(ctx, -46, 46, -48, 15, 5.4, '#922c20'); PR.soft(ctx, -10, -8, 30, 14, '#000000', .3);
  PR.soft(ctx, 28, -18, 26, 24, '#000000', .5); PR.soft(ctx, -24, -32, 16, 10, '#ffd8c0', .14); // the far side in shadow; the lantern on the near
  ctx.strokeStyle = PR.lit(ctx, '#2a2420', '#0a0806', -40, 40); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(26, -44); ctx.lineTo(-26, 4); ctx.stroke(); // the black sash, across
  PR.stitch(ctx, 'rgba(200,160,90,.35)', .5, () => { ctx.moveTo(24, -46.4); ctx.lineTo(-28, 1.6); });
  ell(ctx, 4, -22, 3.2, 2.6, PR.rad(ctx, 3, -23, .4, 3.4, [[0,'#fff0c0'], [.4,'#c9a44a'], [1,'#3a2a08']])); // its brass
  ctx.restore();
  // the mail curtain hanging from the helm, round the face and over the shoulders
  const capY = F.cy - 8.6; ctx.beginPath(); ctx.moveTo(-16, capY); ctx.bezierCurveTo(-18, F.cy + 6, -20, -46, -27, -42); ctx.quadraticCurveTo(0, -36, 27, -42); ctx.bezierCurveTo(20, -46, 18, F.cy + 6, 16, capY); ctx.closePath();
  ctx.fillStyle = PR.lin(ctx, -26, 0, 26, 0, [[0,'#7a766e'], [.4,'#4a4742'], [1,'#0e0d0c']]); ctx.fill(); ctx.save(); ctx.clip(); PR.mail(ctx, -28, 28, capY, -36, '#7a766e', 1.8); PR.soft(ctx, 0, -48, 14, 6, '#000000', .5); ctx.restore();
  F.under = (ctx, F) => { const u = F.h/20, cy = F.cy, w = F.w, r = PR.rng(91); // a black beard, cut close and square, the moustache oiled
    ctx.beginPath(); ctx.moveTo(-w - 2, cy + 4*u); ctx.quadraticCurveTo(-w*.6, cy + 8.6*u, -5, cy + 9.8*u); ctx.lineTo(5, cy + 9.8*u); ctx.quadraticCurveTo(w*.6, cy + 8.6*u, w + 2, cy + 4*u); ctx.lineTo(w + 2, cy + 24*u); ctx.lineTo(-w - 2, cy + 24*u); ctx.closePath();
    ctx.ellipse(0, cy + 12.4*u, 4.3, 1.6*u, 0, 0, Math.PI*2); ctx.fillStyle = PR.lin(ctx, -w, 0, w, 0, [[0,'rgba(40,26,18,.85)'], [.45,'rgba(18,10,6,.9)'], [1,'rgba(6,4,2,.95)']]); ctx.fill('evenodd');
    for (let i=0;i<260;i++){ const x = (r() - .5)*2*w, yy = 6.4 + r()*13 + Math.abs(x)/w*2.4, y = cy + yy*u; if (Math.abs(x) < 4.3 && yy > 10.8 && yy < 14) continue; if (yy < 9.8 && Math.abs(x) < 4.8) continue;
      ctx.strokeStyle = x < 0 ? 'rgba(80,56,40,.45)' : 'rgba(8,4,2,.6)'; ctx.lineWidth = .45; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r() - .5)*.5, y + .9 + r()*.7); ctx.stroke(); }
    PR.stroke(ctx, 'rgba(10,6,4,.95)', 1, () => { ctx.moveTo(-5.6, cy + 10.6*u); ctx.quadraticCurveTo(0, cy + 9.2*u, 5.6, cy + 10.6*u); }); PR.soft(ctx, -2, cy + 10*u, 2, .6, '#ffe0c0', .2); // the moustache, a glint of oil
    PR.soft(ctx, 0, cy - 15*u, w, 4, '#120806', .5); // the helm's shadow on his brow
    PR.stroke(ctx, 'rgba(220,170,150,.35)', .5, () => { ctx.moveTo(6.4, cy - 6.6*u); ctx.lineTo(8.6, cy - 1.6*u); }); }; // a nick through the far brow
  PR.face(ctx, F);
  // the helm: iron, rising to a spike, a band of red enamel at the brim set with brass, a red horsetail off the spike
  ctx.beginPath(); ctx.moveTo(-15.8, capY + 1); ctx.bezierCurveTo(-16.6, capY - 12, -8, capY - 20, 0, capY - 25); ctx.bezierCurveTo(8, capY - 20, 16.6, capY - 12, 15.8, capY + 1); ctx.closePath();
  ctx.fillStyle = PR.lin(ctx, -16, capY - 18, 16, capY, [[0,'#aaa69c'], [.35,'#66625a'], [.75,'#2a2826'], [1,'#0c0b0a']]); ctx.fill();
  PR.soft(ctx, -6.6, capY - 11, 4, 6, '#f0e8d8', .32, -.4); PR.stroke(ctx, 'rgba(0,0,0,.45)', .6, () => { ctx.moveTo(0, capY - 25); ctx.quadraticCurveTo(1, capY - 12, 0, capY); }); // the shine; the ridge
  ctx.fillStyle = PR.lin(ctx, -17, 0, 17, 0, [[0,'#c84a36'], [.45,'#8a2418'], [1,'#1a0604']]); ctx.fillRect(-17, capY - 2.6, 34, 4.4); for (let i=0;i<9;i++) ell(ctx, -15 + i*3.75, capY - .4, .7, .7, i < 5 ? '#f0d08a' : '#6a4a14'); // the band
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-16, capY + 1.8, 32, .8);
  ctx.fillStyle = PR.lin(ctx, -1.6, 0, 1.6, 0, [[0,'#b0aca2'], [1,'#2a2826']]); PR.path(ctx, [[-1.4, capY - 24.6], [1.4, capY - 24.6], [.4, capY - 33], [-.4, capY - 33]]); ctx.fill(); // the spike
  PR.strands(ctx, 26, ['#c83a2a', '#8a2014', '#e05a40', '#5a100a'], 1.1, 33, (i, r) => { const x0 = (r() - .5)*1.4, y0 = capY - 31 + r()*2; return [x0, y0, -10 - r()*6, capY - 30 + r()*4, -18 - r()*6, capY - 12 + r()*16]; }); // the horsetail, blowing back
  return F; };

/* ---------------- ground: the river at Sekala, and Dryj Spring in the Odhan ---------------- */
/* the tile at (x, y), the map's edge repeated outward so a river runs off the board instead of ending at it */
const b2Tile = (x, y) => { if (!tileMap || !tileMap.length) return null; const r = tileMap[clamp(y, 0, tileMap.length - 1)]; return r ? r[clamp(x, 0, r.length - 1)] : null; };
const b2Wave = (u, s) => .5 + .3*Math.sin(u*4.1 + s) + .2*Math.sin(u*9.7 + s*2.3); // 0..1, smooth along a line, the same for every tile that asks
const b2InH = (wx, wy, T) => T*(.05 + .11*b2Wave(wx, wy*7.31)); // how far the bank comes into the water along a horizontal tile edge (world row wy)
const b2InV = (wx, wy, T) => T*(.05 + .11*b2Wave(wy, wx*5.17 + 40)); // ...and along a vertical one (world column wx)
const b2Hex = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const b2Mix = (a, b, k) => { const A = b2Hex(a), B = b2Hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v)*clamp(k, 0, 1))).join(',')})`; };
/* a water tile's outline: the tile, with the bank let in along every side that faces land, the outer corners rounded. Calls path() to trace it */
function b2WaterShape(x, y, T, isW, K = 1){
  const px = x*T, py = y*T, L = [!isW(b2Tile(x, y-1)), !isW(b2Tile(x+1, y)), !isW(b2Tile(x, y+1)), !isW(b2Tile(x-1, y))], N = 8;
  const top = u => L[0] ? K*b2InH(x + u, y, T) : 0, bot = u => L[2] ? K*b2InH(x + u, y + 1, T) : 0, lef = v => L[3] ? K*b2InV(x, y + v, T) : 0, rig = v => L[1] ? K*b2InV(x + 1, y + v, T) : 0;
  const E = [[], [], [], []];
  for (let i=0;i<=N;i++){ const s = i/N;
    { const xx = lerp(lef(0), T - rig(0), s); E[0].push([px + xx, py + top(xx/T)]); }
    { const yy = lerp(top(1), T - bot(1), s); E[1].push([px + T - rig(yy/T), py + yy]); }
    { const xx = lerp(T - rig(1), lef(1), s); E[2].push([px + xx, py + T - bot(xx/T)]); }
    { const yy = lerp(T - bot(0), top(0), s); E[3].push([px + lef(yy/T), py + yy]); } }
  const path = (c) => { c.beginPath(); let first = true;
    for (let k=0;k<4;k++){ const cvIn = L[k] && L[(k + 3)%4], cvOut = L[k] && L[(k + 1)%4], pts = E[k].slice(cvIn ? 3 : 0, cvOut ? N - 2 : N + 1);
      pts.forEach(p => { if (first) { c.moveTo(p[0], p[1]); first = false; } else c.lineTo(p[0], p[1]); });
      if (cvOut) { const nx = E[(k + 1)%4][3]; c.quadraticCurveTo(E[k][N][0], E[k][N][1], nx[0], nx[1]); } }
    c.closePath(); };
  return {L, E, path, px, py}; }
/* the colour of water at a point, from how deep the four tiles round each corner are (bilinear, so tiles agree) */
function b2WaterFill(ctx, x, y, T, dep, col){ const px = x*T, py = y*T, cv = (cx, cy) => (dep(b2Tile(cx - 1, cy - 1)) + dep(b2Tile(cx, cy - 1)) + dep(b2Tile(cx - 1, cy)) + dep(b2Tile(cx, cy)))/4;
  const c00 = cv(x, y), c10 = cv(x + 1, y), c01 = cv(x, y + 1), c11 = cv(x + 1, y + 1), n = 8;
  for (let i=0;i<n;i++){ const k = (i + .5)/n, g = ctx.createLinearGradient(px, 0, px + T, 0); g.addColorStop(0, col(lerp(c00, c01, k))); g.addColorStop(1, col(lerp(c10, c11, k))); ctx.fillStyle = g; ctx.fillRect(px, py + i*T/n, T, T/n + .6); } }
/* the bank's little round corners where water turns round a point of land */
function b2BankCorners(ctx, x, y, T, isW, col, K = 1){ [[0,0,-1,-1],[1,0,1,-1],[1,1,1,1],[0,1,-1,1]].forEach(([cx, cy, dx, dy]) => {
  if (!isW(b2Tile(x + dx, y + dy)) && isW(b2Tile(x + dx, y)) && isW(b2Tile(x, y + dy))) { const wx = x + cx, wy = y + cy; ell(ctx, wx*T, wy*T, K*b2InV(wx, wy, T)*1.3, K*b2InH(wx, wy, T)*1.3, col); } }); }
/* the bank's lip: a wet dark line and a thin bright one, drawn only along sides that face land */
function b2Lip(ctx, S, T, dark, lit){ S.E.forEach((pts, k) => { if (!S.L[k]) return; ctx.lineCap = 'round';
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, T*.045); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  const n = [[0,1],[-1,0],[0,-1],[1,0]][k]; ctx.strokeStyle = lit; ctx.lineWidth = Math.max(1, T*.022); ctx.beginPath(); pts.forEach((p, i) => { const q = [p[0] + n[0]*T*.05, p[1] + n[1]*T*.05]; i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.lineCap = 'butt'; }); }
/* land next to water is wet: darken toward every edge or corner that touches it */
function b2WetEdges(ctx, x, y, T, isW, rgb, a, reach = .32){ const px = x*T, py = y*T;
  [[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx, dy]) => { if (!isW(b2Tile(x + dx, y + dy))) return; const x0 = dx > 0 ? px + T : px, y0 = dy > 0 ? py + T : py, g = dx ? ctx.createLinearGradient(x0, 0, x0 - dx*T*reach, 0) : ctx.createLinearGradient(0, y0, 0, y0 - dy*T*reach);
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); });
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([dx, dy]) => { if (!isW(b2Tile(x + dx, y + dy)) || isW(b2Tile(x + dx, y)) || isW(b2Tile(x, y + dy))) return; b2Soft(ctx, px + (dx > 0 ? T : 0), py + (dy > 0 ? T : 0), T*reach*1.2, 1, rgb, a); }); }
/* prints in mud: feet, hooves, the odd cart rut */
function b2Prints(ctx, x, y, T, n, N, seed = 0){ const px = x*T, py = y*T;
  for (let i=0;i<n;i++){ const cx = px + T*(.12 + hash(x, y, i + 300 + seed)*.76), cy = py + T*(.12 + hash(y, x, i + 310 + seed)*.76), a = hash(x, y, i + 320 + seed)*6.28, hoof = hash(x, y, i + 330 + seed) > .5;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
    if (hoof) { ell(ctx, 0, 0, T*.05, T*.045, N ? 'rgba(0,0,0,.35)' : 'rgba(40,28,18,.4)'); ell(ctx, -T*.01, -T*.012, T*.03, T*.02, N ? 'rgba(140,150,180,.06)' : 'rgba(255,240,210,.14)'); }
    else { ell(ctx, -T*.03, 0, T*.035, T*.016, N ? 'rgba(0,0,0,.3)' : 'rgba(40,28,18,.32)'); ell(ctx, T*.04, T*.05, T*.035, T*.016, N ? 'rgba(0,0,0,.3)' : 'rgba(40,28,18,.32)'); }
    ctx.restore(); } }

/* the river at Sekala: silt-brown and green where it is shallow, dark where it runs deep; mud banks, reeds, cut banks, the paved ford under the water */
const b2RDep = c => c === '~' ? 2 : (c === '-' || c === 'p') ? 1 : 0, b2RW = c => c === '~' || c === '-' || c === 'p';
function b2River(ctx, ch, x, y, T, N){
  const px = x*T, py = y*T, h = hash(x, y);
  const P = N ? {mud:'#2a2a30', wet:'#19191e', mudL:'#3a3a44', top:'#2c2e2e', face:'#1c1a1c', faceD:'#0c0b0c', sand:'#3a3c44', sandRGB:'58,60,68', reed:'#2a3230', reedL:'#3e4844', head:'#1e1a16', stone:'#34343c', stoneL:'#4a4a56', lit:'170,180,220', wetRGB:'8,8,12', w0:'#343a42', w1:'#1e282e', w2:'#0e161a', glint:'rgba(170,190,230,.22)', lip:'rgba(160,170,210,.18)'}
              : {mud:'#7e6a52', wet:'#554634', mudL:'#a08a6a', top:'#9a8c5e', face:'#6a5038', faceD:'#2e2014', sand:'#cdb88e', sandRGB:'205,184,142', reed:'#7a7a46', reedL:'#b8b07a', head:'#5a3a1e', stone:'#7a746a', stoneL:'#b0aa9c', lit:'255,246,225', wetRGB:'52,40,26', w0:'#9a8a64', w1:'#6a7658', w2:'#2a4244', glint:'rgba(235,245,240,.4)', lip:'rgba(240,236,214,.38)'};
  const fill = c => { ctx.fillStyle = c; ctx.fillRect(px, py, T, T); };
  const wcol = v => v <= 1 ? b2Mix(P.w0, P.w1, v) : b2Mix(P.w1, P.w2, v - 1);
  const flowH = (() => { let hz = 0, vt = 0; for (let k=-3;k<=3;k++){ if (b2RW(b2Tile(x + k, y))) hz++; if (b2RW(b2Tile(x, y + k))) vt++; } return hz >= vt; })(); // which way the river runs here
  const mud = () => { fill(shade(P.mud, (h - .5)*.04)); b2Mottle(ctx, x, y, T, N ? .025 : .08, N ? .2 : .14, P.lit, 1.2);
    for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) if (b2Tile(x + dx, y + dy) === 's') for (let k=0;k<2;k++) b2Soft(ctx, (x + dx + .3 + hash(x+dx, y+dy, 60+k)*.4)*T, (y + dy + .3 + hash(x+dx, y+dy, 62+k)*.4)*T, T*(.85 + hash(x+dx, y+dy, 64+k)*.3), 1, P.sandRGB, .8); // sand bars lying soft on the mud
    ctx.fillStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(60,44,28,.3)'; for (let i=0;i<5;i++) ctx.fillRect(px + hash(x,y,i+20)*T, py + hash(y,x,i+21)*T, Math.max(1, T*.04), Math.max(1, T*.03)); // grit
    if (!b2RW(ch)) b2WetEdges(ctx, x, y, T, b2RW, P.wetRGB, N ? .5 : .55, .36); };
  if (b2RW(ch)) { // ---- water ----
    mud(); ctx.fillStyle = `rgba(${P.wetRGB},${N ? .5 : .55})`; ctx.fillRect(px, py, T, T);
    const S = b2WaterShape(x, y, T, b2RW, 1.3); ctx.save(); S.path(ctx); ctx.clip();
    b2WaterFill(ctx, x, y, T, b2RDep, wcol);
    if (ch === 'p') { // the ford the sappers paved: flat stones under a hand's depth of water, laid in courses
      const st = T/3; for (let r=-1;r<4;r++){ const wr = y*3 + r, wy = py + r*st; let wx = -hash(wr, 3, 9)*st, j = 0; while (wx < px + T) { const sw = st*(.8 + hash(j, wr, 6)*.7), k = hash(j++, wr, 5);
        if (wx + sw > px - 2) { ctx.fillStyle = N ? `rgba(80,86,100,${.12 + k*.1})` : `rgba(170,164,136,${.14 + k*.14})`; ctx.beginPath(); ctx.ellipse(wx + sw/2, wy + st/2, sw/2 - 1.2, st/2 - 1.2, 0, 0, 7); ctx.fill();
          ctx.fillStyle = N ? 'rgba(0,0,0,.14)' : 'rgba(30,44,36,.16)'; ctx.fillRect(wx + 2, wy + st - 2, sw - 4, 1); }
        wx += sw; } }
      ctx.fillStyle = N ? 'rgba(30,40,50,.18)' : 'rgba(90,110,96,.16)'; ctx.fillRect(px, py, T, T); } // the water over them
    // the current: long light streaks on the deep water, short broken ones and little wakes in the shallows
    const deep = ch === '~', n = deep ? 4 : 3; ctx.lineCap = 'round';
    for (let i=0;i<n;i++){ const a = hash(x, y, i + 40), b = hash(y, x, i + 41), len = T*(deep ? .3 + hash(x,y,i+42)*.35 : .12 + hash(x,y,i+42)*.16), wob = T*.025*(hash(x,y,i+43) - .5);
      const sx = px + a*T, sy = py + b*T; ctx.strokeStyle = deep ? (N ? 'rgba(120,140,180,.12)' : 'rgba(200,220,215,.2)') : P.glint; ctx.lineWidth = Math.max(1, T*(deep ? .018 : .022)); ctx.beginPath();
      if (flowH) { ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + len/2, sy + wob, sx + len, sy); } else { ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + wob, sy + len/2, sx, sy + len); } ctx.stroke(); }
    if (deep) { for (let i=0;i<2;i++){ const sx = px + hash(x,y,i+50)*T, sy = py + hash(y,x,i+51)*T; ctx.strokeStyle = N ? 'rgba(0,0,0,.3)' : 'rgba(16,30,34,.35)'; ctx.lineWidth = Math.max(1, T*.03); ctx.beginPath(); if (flowH) { ctx.moveTo(sx, sy); ctx.lineTo(sx + T*.4, sy + T*.02); } else { ctx.moveTo(sx, sy); ctx.lineTo(sx + T*.02, sy + T*.4); } ctx.stroke(); } } // dark seams where it runs fastest
    else if (ch === '-') for (let i=0;i<2;i++){ const cx = px + T*(.2 + hash(x,y,i+60)*.6), cy = py + T*(.2 + hash(y,x,i+61)*.6), r = T*(.04 + hash(x,y,i+62)*.04); ell(ctx, cx, cy, r*1.3, r, N ? 'rgba(60,64,74,.6)' : 'rgba(110,104,86,.6)'); // a stone just under, and the water parting round it
      ctx.strokeStyle = P.glint; ctx.lineWidth = 1; ctx.beginPath(); if (flowH) { ctx.moveTo(cx - r*1.6, cy - r*1.2); ctx.quadraticCurveTo(cx + r, cy - r*1.6, cx + r*3.4, cy - r*.6); ctx.moveTo(cx - r*1.6, cy + r*1.2); ctx.quadraticCurveTo(cx + r, cy + r*1.6, cx + r*3.4, cy + r*.6); } else { ctx.moveTo(cx - r*1.2, cy - r*1.6); ctx.quadraticCurveTo(cx - r*1.6, cy + r, cx - r*.6, cy + r*3.4); ctx.moveTo(cx + r*1.2, cy - r*1.6); ctx.quadraticCurveTo(cx + r*1.6, cy + r, cx + r*.6, cy + r*3.4); } ctx.stroke(); }
    ctx.lineCap = 'butt';
    b2Mottle(ctx, x, y, T, N ? .03 : .08, .08, N ? '150,170,220' : '240,250,255', 1); ctx.restore();
    b2Lip(ctx, S, T, N ? 'rgba(0,0,0,.4)' : 'rgba(40,30,18,.45)', P.lip); b2BankCorners(ctx, x, y, T, b2RW, P.wet, 1.3);
    return; }
  if (ch === '#') { // a cut bank: dry grass on top, a face of layered earth where it drops to the river, roots hanging out of it
    const face = b2Tile(x, y + 1) !== '#', top = b2Tile(x, y - 1) !== '#', fy = py + (face ? T*.5 : T);
    fill(shade(P.top, (h - .5)*.05)); b2Mottle(ctx, x, y, T, N ? .015 : .035, .14, P.lit, 1); for (let i=0;i<3;i++) ell(ctx, px + T*(.15 + hash(x,y,i+75)*.7), py + T*(.15 + hash(y,x,i+76)*.6), T*.09, T*.05, N ? 'rgba(20,26,24,.5)' : 'rgba(110,104,60,.45)'); // tussocks
    ctx.strokeStyle = N ? 'rgba(70,80,76,.5)' : 'rgba(170,160,100,.6)'; ctx.lineWidth = 1; for (let i=0;i<9;i++){ const gx = px + hash(x,y,i+70)*T, gy = py + T*.1 + hash(y,x,i+71)*(fy - py - T*.1); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + (hash(x,y,i+72) - .5)*T*.1, gy - T*.1); ctx.stroke(); } // dry grass
    if (top) { ctx.fillStyle = N ? 'rgba(150,160,200,.08)' : 'rgba(255,246,220,.22)'; ctx.fillRect(px, py, T, T*.06); }
    if (b2Tile(x - 1, y) !== '#') { ctx.fillStyle = N ? 'rgba(150,160,200,.05)' : 'rgba(255,246,220,.14)'; ctx.fillRect(px, py, T*.05, fy - py); } if (b2Tile(x + 1, y) !== '#') { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(px + T*.95, py, T*.05, fy - py); }
    if (face) { const wv = s => T*.05*Math.sin((x + s)*7.1) + T*.03*Math.sin((x + s)*17.3); ctx.beginPath(); ctx.moveTo(px, fy + wv(0)); for (let i=1;i<=8;i++) ctx.lineTo(px + i*T/8, fy + wv(i/8)); ctx.lineTo(px + T, py + T); ctx.lineTo(px, py + T); ctx.closePath();
      ctx.fillStyle = vgrad(ctx, fy, py + T, [[0, P.face], [1, P.faceD]]); ctx.fill(); ctx.save(); ctx.clip();
      for (let i=0;i<3;i++){ const yy = fy + T*(.1 + i*.13); ctx.fillStyle = N ? 'rgba(0,0,0,.25)' : `rgba(${i%2 ? '40,26,14' : '150,120,80'},.3)`; ctx.fillRect(px, yy + Math.sin(x*3 + i)*T*.02, T, Math.max(1, T*.04)); } // the layers the river cut
      ctx.strokeStyle = N ? '#0e0c0c' : '#2a1c10'; ctx.lineWidth = 1; for (let i=0;i<3;i++){ const rx = px + T*(.15 + hash(x,y,i+80)*.7); ctx.beginPath(); ctx.moveTo(rx, fy + T*.04); ctx.quadraticCurveTo(rx + T*.06*(hash(x,y,i+81) - .5)*4, fy + T*.2, rx + T*.03, fy + T*(.26 + hash(x,y,i+82)*.16)); ctx.stroke(); } ctx.restore(); // roots
      ctx.strokeStyle = N ? 'rgba(150,160,200,.12)' : 'rgba(255,240,200,.3)'; ctx.lineWidth = Math.max(1, T*.025); ctx.beginPath(); ctx.moveTo(px, fy + wv(0)); for (let i=1;i<=8;i++) ctx.lineTo(px + i*T/8, fy + wv(i/8)); ctx.stroke(); } // the lip
    return; }
  mud();
  if (ch === '.') { if (h > .45) b2Prints(ctx, x, y, T, 3 + Math.floor(hash(x,y,9)*5), N); // the bank, trodden
    if (h < .25) { ctx.strokeStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(70,50,30,.3)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i=0;i<3;i++){ const sx = px + hash(x,y,i+90)*T, sy = py + hash(y,x,i+91)*T; ctx.moveTo(sx, sy); ctx.lineTo(sx + (hash(x,y,i+92) - .5)*T*.4, sy + (hash(x,y,i+93) - .5)*T*.4); } ctx.stroke(); } } // drying cracks
  else if (ch === ',') { // reeds: tall, leaning, a few with their brown heads
    const clumps = 2 + Math.floor(h*3); for (let c=0;c<clumps;c++){ const bx = px + T*(.18 + hash(x,y,c+100)*.64), by = py + T*(.35 + hash(y,x,c+101)*.55), lean = (hash(x,y,c+102) - .5)*.5 + (N ? 0 : .1);
      ell(ctx, bx + T*.06, by + T*.02, T*.12, T*.04, N ? 'rgba(0,0,0,.35)' : 'rgba(50,36,20,.3)');
      for (let i=0;i<8;i++){ const a = lean + (i/7 - .5)*.7, l = T*(.28 + hash(x, y, c*10 + i + 110)*.22), ex = bx + Math.sin(a)*l + (i - 3.5)*T*.012, ey = by - Math.cos(a)*l;
        ctx.strokeStyle = i%3 === 0 ? P.reedL : P.reed; ctx.lineWidth = Math.max(1, T*.022); ctx.beginPath(); ctx.moveTo(bx + (i - 3.5)*T*.012, by); ctx.quadraticCurveTo(bx + Math.sin(a)*l*.4, by - l*.6, ex, ey); ctx.stroke();
        if (i%3 === 1) ell(ctx, bx + Math.sin(a)*l*.86, by - Math.cos(a)*l*.86, T*.018, T*.05, P.head, a); } } }
  else if (ch === 'r') { const stone = (cx, cy, r) => { ell(ctx, cx + r*.3, cy + r*.35, r*1.05, r*.55, N ? 'rgba(0,0,0,.4)' : 'rgba(50,36,20,.35)'); ell(ctx, cx, cy, r, r*.7, P.stone); ell(ctx, cx - r*.25, cy - r*.2, r*.5, r*.3, P.stoneL); ell(ctx, cx + r*.1, cy + r*.35, r*.8, r*.15, N ? 'rgba(0,0,0,.25)' : 'rgba(60,70,60,.3)'); }; // river stones, round and wet at the foot
    stone(px + T*.38, py + T*.44, T*.2); stone(px + T*.7, py + T*.68, T*.12); if (h > .4) stone(px + T*.22, py + T*.76, T*.08); }
  else if (ch === 's') { ctx.strokeStyle = N ? 'rgba(0,0,0,.14)' : 'rgba(150,120,80,.22)'; ctx.lineWidth = 1; for (let i=0;i<3;i++){ const yy = py + T*(.2 + i*.3); ctx.beginPath(); ctx.moveTo(px + T*.1, yy); ctx.quadraticCurveTo(px + T*.5, yy - T*.08 + ((x + i)%2)*T*.08, px + T*.9, yy); ctx.stroke(); } } // ripples the water left
  else if (ch === 'W') b2Wagon(ctx, px, py, T, N);
  else if (ch === '=') b2Tent(ctx, px, py, T, N, x, y);
  else exitArrow(ctx, ch, px, py, T);
}
/* a wagon, canvas hooped, and a tent of hide on poles: the Chain's, wherever it stops */
function b2Wagon(ctx, px, py, T, N){ const by = py + T*.78; ell(ctx, px + T*.56, by + T*.06, T*.46, T*.1, N ? 'rgba(0,0,0,.45)' : 'rgba(70,46,26,.35)');
  ctx.fillStyle = N ? '#1e1610' : '#5a4028'; ctx.fillRect(px + T*.08, py + T*.48, T*.84, T*.24); ctx.fillStyle = N ? '#3a3632' : '#d8c8a2'; ctx.beginPath(); ctx.moveTo(px + T*.06, py + T*.5); ctx.quadraticCurveTo(px + T*.5, py - T*.04, px + T*.94, py + T*.5); ctx.fill();
  ctx.fillStyle = N ? 'rgba(0,0,0,.3)' : 'rgba(110,90,60,.4)'; ctx.beginPath(); ctx.moveTo(px + T*.55, py + T*.5); ctx.quadraticCurveTo(px + T*.8, py + T*.12, px + T*.94, py + T*.5); ctx.fill(); ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(90,70,44,.5)'; ctx.lineWidth = 1; for (let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(px + T*(.08 + i*.21), py + T*.5); ctx.quadraticCurveTo(px + T*(.08 + i*.21), py + T*.16, px + T*(.1 + i*.21), py + T*.2); ctx.stroke(); }
  [.24, .76].forEach(k => { ell(ctx, px + T*k, by, T*.12, T*.12, '#120c08'); ctx.strokeStyle = N ? '#3a3028' : '#7a5a3a'; ctx.beginPath(); ctx.arc(px + T*k, by, T*.08, 0, 7); ctx.stroke(); }); }
function b2Tent(ctx, px, py, T, N, x, y){ const cx = px + T*.5, by = py + T*.86; ell(ctx, cx + T*.1, by, T*.46, T*.1, N ? 'rgba(0,0,0,.45)' : 'rgba(70,46,26,.35)');
  poly(ctx, [[px + T*.06, by],[cx, py + T*.14],[px + T*.94, by]], N ? '#3a3632' : '#c8b48c'); poly(ctx, [[cx, py + T*.14],[px + T*.94, by],[cx + T*.14, by]], N ? '#1e1c1a' : '#8a7454'); poly(ctx, [[cx - T*.12, by],[cx, py + T*.5],[cx + T*.1, by]], N ? '#0a0806' : '#2a1e12');
  ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(80,60,36,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, py + T*.14); ctx.lineTo(px + T*.3, by); ctx.stroke(); ctx.fillStyle = N ? '#2a2016' : '#5a4028'; ctx.fillRect(cx - 1, py + T*.06, 2, T*.1); }
TILEX.river = (ctx, ch, x, y, T, dark) => b2Clip(ctx, x, y, T, () => b2River(ctx, ch, x, y, T, !!dark));

/* Dryj Spring: a brown pool in the hardpan, trampled to mud all round by a hundred thousand feet and hooves; tamarisk */
const b2SW = c => c === 'o';
function b2Spring(ctx, ch, x, y, T, N){ const px = x*T, py = y*T, h = hash(x, y);
  const P = N ? {wet:'#17181d', w0:'#262a30', w1:'#14181c', glint:'rgba(170,185,225,.2)', lip:'rgba(150,160,200,.16)'} : {wet:'#705c40', w0:'#8a7c56', w1:'#4e4c34', glint:'rgba(245,245,230,.42)', lip:'rgba(235,225,200,.4)'};
  if (ch === 'o') { b2Odhan(ctx, '.', x, y, T, N); ctx.fillStyle = N ? 'rgba(10,10,14,.6)' : 'rgba(84,64,40,.72)'; ctx.fillRect(px, py, T, T); b2Prints(ctx, x, y, T, 6, N, 7);
    const S = b2WaterShape(x, y, T, b2SW, 2.3); ctx.save(); S.path(ctx); ctx.clip();
    b2WaterFill(ctx, x, y, T, c => c === 'o' ? 1.6 : 0, v => b2Mix(P.w0, P.w1, v/1.6));
    b2Soft(ctx, (x + .5)*T, (y + .3)*T, T*.7, .35, N ? '120,140,190' : '214,224,226', N ? .06 : .2); // the white sky lying on it
    ctx.strokeStyle = P.glint; ctx.lineWidth = 1; ctx.lineCap = 'round'; if (h > .55) for (let i=0;i<1;i++){ const cx = px + T*(.15 + hash(x,y,i+40)*.7), cy = py + T*(.15 + hash(y,x,i+41)*.7), r = T*(.06 + hash(x,y,i+42)*.08); ctx.beginPath(); ctx.ellipse(cx, cy, r, r*.4, 0, Math.PI*1.1, Math.PI*1.9); ctx.stroke(); } ctx.lineCap = 'butt'; // rings where it wells up
    if (!N && h > .5) { ctx.fillStyle = 'rgba(70,90,40,.35)'; for (let i=0;i<4;i++) ell(ctx, px + T*(.2 + hash(x,y,i+50)*.6), py + T*(.2 + hash(y,x,i+51)*.6), T*.05, T*.025, ctx.fillStyle); } // scum
    b2Mottle(ctx, x, y, T, N ? .02 : .06, .1, N ? '150,170,220' : '255,250,235', 1); ctx.restore();
    b2Lip(ctx, S, T, N ? 'rgba(0,0,0,.4)' : 'rgba(40,28,16,.5)', P.lip); b2BankCorners(ctx, x, y, T, b2SW, P.wet, 2.3);
    if (N) b2Firelit(ctx, x, y, T, .28, 3.2, '255,150,70'); return; }
  // 't' a tamarisk: a twisted trunk, feathery grey-green, plumes of pink by day
  b2Odhan(ctx, '.', x, y, T, N); const cx = px + T*.5, cy = py + T*.5;
  ell(ctx, cx + T*.16, cy + T*.32, T*.42, T*.16, N ? 'rgba(0,0,0,.4)' : 'rgba(70,50,30,.32)');
  ctx.strokeStyle = N ? '#1a1612' : '#4a3424'; ctx.lineWidth = Math.max(1.5, T*.06); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - T*.02, cy + T*.38); ctx.quadraticCurveTo(cx + T*.08, cy + T*.16, cx - T*.04, cy - T*.02); ctx.moveTo(cx + T*.02, cy + T*.2); ctx.quadraticCurveTo(cx + T*.16, cy + T*.1, cx + T*.18, cy - T*.04); ctx.stroke(); ctx.lineCap = 'butt';
  const fol = N ? ['#1c2224', '#262e2e', '#141a1c'] : ['#7a8a6a', '#9aa684', '#5a6a50'];
  for (let i=0;i<14;i++){ const a = hash(x,y,i+60)*6.28, d = T*(.06 + hash(x,y,i+61)*.22), fx = cx + Math.cos(a)*d*1.1, fy = cy - T*.1 + Math.sin(a)*d*.75, r = T*(.08 + hash(x,y,i+62)*.07);
    ell(ctx, fx, fy, r, r*.8, fol[i%3]); }
  ctx.strokeStyle = N ? 'rgba(60,70,70,.5)' : 'rgba(200,210,180,.45)'; ctx.lineWidth = 1; for (let i=0;i<10;i++){ const a = -Math.PI/2 + (hash(x,y,i+70) - .5)*2.6, sx = cx + (hash(x,y,i+71) - .5)*T*.4, sy = cy - T*.1 + (hash(x,y,i+72) - .5)*T*.3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a)*T*.1, sy + Math.sin(a)*T*.1); ctx.stroke(); } // the feathery fronds
  if (!N) for (let i=0;i<5;i++){ const sx = cx + (hash(x,y,i+80) - .5)*T*.5, sy = cy - T*(.12 + hash(x,y,i+81)*.2); ell(ctx, sx, sy, T*.025, T*.05, i%2 ? 'rgba(220,150,170,.8)' : 'rgba(200,130,150,.7)', (hash(x,y,i+82) - .5)); } // pink plumes
  ell(ctx, cx - T*.1, cy - T*.2, T*.12, T*.06, N ? 'rgba(150,160,200,.05)' : 'rgba(255,250,230,.16)');
  if (N) b2Firelit(ctx, x, y, T, .3, 3.2, '255,150,70'); }
/* the Odhan's other ground, trodden wet where it meets the spring */
function b2SpringMud(ctx, x, y, T, N){ let near = false; for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) if (b2SW(b2Tile(x + dx, y + dy))) near = true; if (!near) return;
  b2WetEdges(ctx, x, y, T, b2SW, N ? '10,10,14' : '84,64,40', N ? .6 : .72, .75); b2Prints(ctx, x, y, T, 5, N, 3); }
{ const o0 = TILEX.odhan, n0 = TILEX.odhan_night; // keep every other character of the Odhan as 47b drew it
  TILEX.odhan = (ctx, ch, x, y, T, dark) => { if (ch === 'o' || ch === 't') return b2Clip(ctx, x, y, T, () => b2Spring(ctx, ch, x, y, T, !!dark)); o0(ctx, ch, x, y, T, dark); if (ch !== '#') b2Clip(ctx, x, y, T, () => b2SpringMud(ctx, x, y, T, !!dark)); };
  TILEX.odhan_night = (ctx, ch, x, y, T, dark) => { if (ch === 'o' || ch === 't') return b2Clip(ctx, x, y, T, () => b2Spring(ctx, ch, x, y, T, true)); n0(ctx, ch, x, y, T, dark); if (ch !== '#') b2Clip(ctx, x, y, T, () => b2SpringMud(ctx, x, y, T, true)); }; }

/* ---------------- backdrops: Dryj Spring, Sekala Crossing at dawn, the warlocks' night ---------------- */
/* a crowd of tiny people round water: standing, stooping to drink, carrying jars on their heads; dark against the glare */
function b2Crowd(x, n, place, col, seed, cloth){ for (let i=0;i<n;i++){ const [cx, cy, s] = place(i), r = hash(i, seed), c = cloth ? cloth[Math.floor(hash(i, seed + 2)*cloth.length)] : col;
  const body = (hh, lean = 0) => { x.fillStyle = c; x.beginPath(); x.moveTo(cx - s*1.1 + lean, cy - hh); x.lineTo(cx + s*1.1 + lean, cy - hh); x.lineTo(cx + s*1.6, cy); x.lineTo(cx - s*1.6, cy); x.closePath(); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(cx + lean*1.2, cy - hh - s*1.1, s*1.05, 0, 7); x.fill(); };
  if (r < .25) { x.fillStyle = c; x.beginPath(); x.ellipse(cx, cy - s*1.6, s*2, s*1.6, 0, 0, 7); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(cx + s*1.8, cy - s*1.4, s, 0, 7); x.fill(); } // kneeling at the water, or stooped
  else if (r < .4) { body(5*s); x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy - 5*s - s*2.6, s*1.2, s*.9, 0, 0, 7); x.fill(); } // a jar on the head
  else if (r < .5) { body(4.4*s, s*.6); x.fillStyle = c; x.beginPath(); x.arc(cx - s*1.6, cy - 3.4*s, s*.9, 0, 7); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(cx - s*1.6, cy - 4.8*s, s*.6, 0, 7); x.fill(); } // with a child
  else body((4.4 + hash(i, seed + 1)*2)*s); } }
/* cattle, side on, heads down to drink or up and lowing */
function b2Cattle(x, cx, cy, s, col, down, d = 1){ x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy - 4*s, 5*s, 2.4*s, 0, 0, 7); x.fill(); for (let j=0;j<4;j++) x.fillRect(cx - 4*s + j*2.4*s + (j > 1 ? .8*s : 0), cy - 2.4*s, .9*s, 2.6*s);
  x.beginPath(); if (down) { x.moveTo(cx + 4*s*d, cy - 5*s); x.lineTo(cx + 7*s*d, cy - 1.4*s); x.lineTo(cx + 5.6*s*d, cy - .8*s); x.lineTo(cx + 3.4*s*d, cy - 3.6*s); } else { x.moveTo(cx + 4*s*d, cy - 5.6*s); x.lineTo(cx + 7*s*d, cy - 7*s); x.lineTo(cx + 7.4*s*d, cy - 5.4*s); x.lineTo(cx + 3.6*s*d, cy - 3.6*s); } x.fill();
  x.fillRect(cx + (down ? 6 : 6.4)*s*d - .4*s, cy - (down ? 3 : 8.4)*s, .7*s, 1.2*s); x.fillRect(cx - 5*s*d, cy - 4.4*s, .6*s, 3*s); }
/* a tamarisk against the sky: a twisted trunk and a feathery crown */
function b2Tamarisk(x, cx, cy, s, col, pink){ x.strokeStyle = col; x.lineWidth = 2*s; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.quadraticCurveTo(cx + 4*s, cy - 10*s, cx - 2*s, cy - 18*s); x.moveTo(cx + 1*s, cy - 8*s); x.quadraticCurveTo(cx + 8*s, cy - 12*s, cx + 9*s, cy - 18*s); x.stroke(); x.lineCap = 'butt';
  for (let i=0;i<16;i++){ const a = hash(i, Math.round(cx), 3)*6.28, d = (4 + hash(i, Math.round(cy), 4)*10)*s; x.fillStyle = col; x.beginPath(); x.ellipse(cx + 3*s + Math.cos(a)*d*1.2, cy - 20*s + Math.sin(a)*d*.6, (3 + hash(i, 5)*3)*s, (2 + hash(i, 6)*2)*s, 0, 0, 7); x.fill(); }
  if (pink) for (let i=0;i<6;i++){ x.fillStyle = 'rgba(190,120,130,.35)'; x.beginPath(); x.ellipse(cx + 3*s + (hash(i, 7) - .5)*24*s, cy - 22*s + (hash(i, 8) - .5)*10*s, 1.6*s, 3*s, 0, 0, 7); x.fill(); } }

SCENEX.b2_dryj_spring = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.52, sx = W*.52, sy = H*.68;
  const L = sceneLayer('b2:dryj_spring', W, H, (x, W, H) => { b2PaintOdhan(x, W, H, 'day');
    for (let i=0;i<7;i++){ const k = i/6; b2Tamarisk(x, W*(.06 + k*.9) + hash(i, 21)*20, hz + 4 + hash(i, 22)*6, .55 + hash(i, 23)*.25, 'rgba(96,100,82,.7)', i%2); } // tamarisks round the hollow, far
    x.fillStyle = 'rgba(70,60,44,.5)'; for (let i=0;i<6;i++){ const wx = W*(.12 + hash(i, 31)*.76), wy = hz + 8 + hash(i, 32)*8, s = .6 + hash(i, 33)*.3; x.fillRect(wx - 6*s, wy - 6*s, 12*s, 4*s); x.beginPath(); x.ellipse(wx, wy - 6*s, 6*s, 4.4*s, 0, Math.PI, 0); x.fill(); } // the carts, drawn up beyond
    // the hollow: mud trampled black round a brown pool, the white sky lying on the water
    x.save(); x.translate(sx, sy); x.scale(1, .24); x.fillStyle = PR.rad(x, 0, 0, 4, W*.46, [[0,'rgba(58,42,26,.9)'], [.5,'rgba(84,64,42,.65)'], [1,'rgba(150,126,90,0)']]); x.fillRect(-W*.5, -W*.5, W, W); x.restore();
    const pool = () => { x.beginPath(); for (let i=0;i<=40;i++){ const a = i/40*6.28, r = 1 + (hash(i%40, 7) - .5)*.18 + Math.sin(a*3 + 1)*.06; const px = sx + Math.cos(a)*W*.19*r, py = sy + Math.sin(a)*H*.045*r; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.closePath(); };
    pool(); x.fillStyle = vgrad(x, sy - H*.05, sy + H*.05, [[0,'#8a8672'], [.4,'#6a5e46'], [1,'#3a3020']]); x.fill(); x.save(); pool(); x.clip(); x.fillStyle = 'rgba(236,236,224,.25)'; x.fillRect(sx - W*.2, sy - H*.018, W*.4, 1.6); x.fillRect(sx - W*.1, sy + H*.005, W*.16, 1); x.restore();
    x.strokeStyle = 'rgba(40,28,16,.45)'; x.lineWidth = 1.2; pool(); x.stroke();
    for (let i=0;i<90;i++){ const a = hash(i, 41)*6.28, d = 1.05 + hash(i, 42)*1.1; ell(x, sx + Math.cos(a)*W*.2*d, sy + Math.sin(a)*H*.05*d, 1.6, .8, `rgba(30,20,12,${.25 + hash(i, 43)*.3})`); } // hoof-pocks
    // cattle and people, packed round the water and up the slope behind, more than the spring can give drink to
    const col = 'rgba(42,30,20,.92)', mid = 'rgba(64,50,36,.8)', far = 'rgba(96,80,60,.55)';
    b2Crowd(x, 160, i => { const cx = W*hash(i, 61), cy = hz + 6 + hash(i, 62)*(sy - hz - H*.05); return [cx, cy, .4 + (cy - hz)/H*1.2]; }, far, 64); // the slope behind, thick with them
    for (let i=0;i<26;i++){ const cx = W*hash(i, 51), cy = hz + 10 + hash(i, 53)*(sy - hz - H*.04); b2Cattle(x, cx, cy, .55 + (cy - hz)/H*1.6, far, hash(i, 52) > .5, hash(i, 54) > .5 ? 1 : -1); }
    for (let i=0;i<16;i++){ const a = Math.PI*(1.04 + hash(i, 55)*.92), cx = sx + Math.cos(a)*W*.21, cy = sy + Math.sin(a)*H*.05; b2Cattle(x, cx, cy, 1.1, mid, true, cx < sx ? 1 : -1); } // heads down at the far edge
    b2Crowd(x, 60, i => { const a = Math.PI*(1 + hash(i, 65)), d = 1.02 + hash(i, 66)*.5; return [sx + Math.cos(a)*W*.22*d, sy + Math.sin(a)*H*.06*d + 1, .8]; }, mid, 67, ['rgba(96,76,56,.85)', 'rgba(110,96,74,.85)', 'rgba(84,60,60,.85)', 'rgba(70,74,84,.85)']);
    b2Crowd(x, 80, i => { const cx = W*hash(i, 85), cy = sy + H*.04 + hash(i, 86)*H*.16; return [cx, cy, .9 + (cy - sy)/H*2.4]; }, mid, 88, ['#6a5440', '#7a6a50', '#5e4444', '#4e5260', '#8a7a5a']); // and on this side, all the way to us
    for (let i=0;i<12;i++){ const a = Math.PI*(.06 + hash(i, 71)*.88), cx = sx + Math.cos(a)*W*.22, cy = sy + Math.sin(a)*H*.06 + 5; b2Cattle(x, cx, cy, 1.5, col, hash(i, 72) > .25, cx < sx ? 1 : -1); } // the near edge, heads down at the water
    b2Crowd(x, 50, i => { const a = Math.PI*(.02 + hash(i, 81)*.96), d = 1.08 + hash(i, 82)*.5; return [sx + Math.cos(a)*W*.24*d, sy + Math.sin(a)*H*.07*d + 5, 1.1 + hash(i, 83)*.3]; }, col, 84, ['#4a3a2a', '#5a4a34', '#4a3434', '#3a3e48', '#6a5a40']);
    glow(x, sx, sy - H*.06, W*.5, '#e8d8b0', .14); // the dust hanging over all of it
    x.fillStyle = 'rgba(120,96,64,.25)'; x.fillRect(0, H*.84, W, H*.16); // the near slope
  });
  ctx.drawImage(L, 0, 0, W, H);
  if (mo) { const dpr = L.width / W; for (let y=hz - 16; y<hz + 26; y+=2){ const off = Math.sin(t/170 + y*.7)*1.8*Math.sin((y - hz + 16)/42*Math.PI); ctx.drawImage(L, 0, y*dpr, L.width, 2*dpr, off, y, W, 2); } } // heat over everything far
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.78, H*.1, W*.75, '#fff8e0', .16); for (let i=0;i<5;i++){ const k = ((t*mo/2600 + i/5) % 1); ctx.fillStyle = `rgba(255,255,240,${.35*Math.sin(k*Math.PI)})`; ctx.fillRect(sx - W*.15 + hash(i, 91)*W*.3, sy - H*.02 + hash(i, 92)*H*.04, 4 + hash(i, 93)*6, 1); } ctx.globalCompositeOperation = 'source-over'; // glare, and the water winking
  for (let i=0;i<4;i++){ const k = ((t*mo/12000 + i/4) % 1); ell(ctx, W*(.1 + i*.25) + k*50, H*.6 - k*H*.1, 30 + k*30, 5 + k*4, `rgba(220,200,160,${.14*Math.sin(k*Math.PI)})`); } // dust off the crowd
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.08 + i*Math.min(34, W*.5/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, .4, .5); };

SCENEX.b2_sekala = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.38, r0 = H*.45, r1 = H*.72;
  const ford = k => [lerp(W*.2, W*.6, k), lerp(r1 + 4, r0, Math.pow(k, .8))]; // the paved ford, running out from the near bank to the far
  ctx.drawImage(sceneLayer('b2:sekala', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#1e2434'],[.45,'#4a4a5c'],[.8,'#b08070'],[1,'#f0c890']]); x.fillRect(0, 0, W, hz + 2); glow(x, W*.12, hz, W*.5, '#ffc890', .4); ell(x, W*.12, hz + 1, 9, 6, '#fff0c8'); // dawn, the sun not yet up
    for (let i=0;i<5;i++) cloud(x, W*(.15 + i*.2), hz*(.25 + (i%3)*.15), W*.3, 3, i%2 ? '#e0a080' : '#6a5a6a', .14);
    x.fillStyle = '#4a4048'; x.beginPath(); x.moveTo(0, hz); for (let px=0;px<=W + 10;px+=10) x.lineTo(px, hz - 3 - Math.max(0, Math.sin(px/70 + 2))*6); x.lineTo(W, r0); x.lineTo(0, r0); x.fill(); // the far bank, rising
    x.fillStyle = '#2a2228'; x.fillRect(0, r0 - 6, W, 7); // its cut face
    // the rebels on the far bank: a long dark mass, spears, the green, Semk fires of witch-light here and there
    for (let i=0;i<420;i++){ const px = W*(.2 + hash(i, 11)*.8), py = r0 - 6 - hash(i, 12)*(10 + (px/W)*8); x.fillStyle = `rgba(20,14,18,${.6 + hash(i, 13)*.4})`; x.fillRect(px, py - 2, 1.4, 3); if (hash(i, 14) > .78) x.fillRect(px + .3, py - 7, .5, 5); }
    for (let i=0;i<10;i++){ const px = W*(.25 + i*.075 + hash(i, 15)*.03), py = r0 - 20 - hash(i, 16)*6; x.fillStyle = '#140c10'; x.fillRect(px, py - 6, .8, 14); x.fillStyle = i%3 ? '#2e5a2a' : '#5a1a14'; x.fillRect(px + .8, py - 6, 4.6, 3); }
    for (let i=0;i<4;i++) glow(x, W*(.4 + i*.15), r0 - 14 - hash(i, 17)*6, 10, '#9ad04a', .35); // the Semk, waiting
    // the river: broad, slow, the dawn lying on it
    x.fillStyle = vgrad(x, r0, r1, [[0,'#7a6a6a'],[.15,'#b08a74'],[.5,'#5a5a62'],[1,'#2a3036']]); x.fillRect(0, r0, W, r1 - r0);
    glow(x, W*.12, r0 + 8, W*.3, '#ffc890', .3); for (let i=0;i<50;i++){ const yy = r0 + 4 + Math.pow(hash(i, 21), .8)*(r1 - r0 - 6), px = hash(i, 22)*W, l = 8 + hash(i, 23)*30*(yy - r0)/(r1 - r0); x.fillStyle = `rgba(${yy < r0 + 20 ? '255,220,170' : '200,210,220'},${.08 + hash(i, 24)*.12})`; x.fillRect(px, yy, l, 1); } // streaks
    // the ford: a pale line of broken water, and the column strung out along it
    x.lineCap = 'round'; for (let pass=0;pass<2;pass++){ x.strokeStyle = pass ? 'rgba(220,214,200,.28)' : 'rgba(40,36,30,.3)'; x.beginPath(); for (let i=0;i<=30;i++){ const [px, py] = ford(i/30); x.lineWidth = lerp(16, 3, i/30)*(pass ? .5 : 1); i ? x.lineTo(px, py + (pass ? -1 : 1)) : x.moveTo(px, py); } x.stroke(); } x.lineCap = 'butt';
    b2Column(x, W, H, k => ford(lerp(.08, .92, k)), 90, '#1a1416', null);
    for (let i=0;i<5;i++){ const [px, py] = ford(.12 + i*.18); x.fillStyle = '#1a1416'; x.fillRect(px + 6, py - 16*(1 - i*.14), .8, 14*(1 - i*.14)); x.fillStyle = i%2 ? '#6a6e7a' : '#7a2a1e'; x.fillRect(px + 6.8, py - 16*(1 - i*.14), 4.4*(1 - i*.1), 2.6*(1 - i*.1)); } // standards
    // the near bank: mud and reeds, the rest of the column coming down to the water
    x.fillStyle = vgrad(x, r1 - 4, H, [[0,'#3a3028'],[.4,'#2a2018'],[1,'#120c08']]); x.beginPath(); x.moveTo(0, H); x.lineTo(0, r1 - 2); for (let px=0;px<=W + 10;px+=12) x.lineTo(px, r1 - 2 + Math.sin(px/40)*3 + (px > W*.15 && px < W*.3 ? 6 : 0)); x.lineTo(W, H); x.fill();
    x.fillStyle = 'rgba(255,220,170,.14)'; x.fillRect(0, r1 - 3, W, 1.2);
    x.strokeStyle = '#1a140e'; x.lineWidth = 1.2; for (let i=0;i<70;i++){ const px = W*(.42 + hash(i, 31)*.58) + (i%2 ? 0 : -W*.42), py = r1 + 2 + hash(i, 32)*12, l = 10 + hash(i, 33)*16, a = (hash(i, 34) - .5)*.5; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + a*6, py - l*.6, px + a*14, py - l); x.stroke(); } // reeds
    b2Column(x, W, H, k => [lerp(W*1.02, W*.24, Math.pow(k, .9)), lerp(H*.84, r1 + 6, Math.pow(k, .7))], 60, '#140e0c', null); // the column on the near bank, down to the ford
  }), 0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter'; for (let i=0;i<14;i++){ const k = ((t*mo/(3000 + hash(i, 41)*2000) + hash(i, 42)) % 1), px = hash(i, 43)*W + k*20, py = r0 + 6 + hash(i, 44)*(r1 - r0 - 10); ctx.fillStyle = `rgba(255,230,190,${.25*Math.sin(k*Math.PI)})`; ctx.fillRect(px, py, 6 + hash(i, 45)*10, 1); } ctx.globalCompositeOperation = 'source-over'; // light moving on the water
  for (let i=0;i<6;i++){ const k = ((t*mo/20000 + i/6) % 1); ell(ctx, (k*1.4 - .2)*W, r0 + 8 + (i%3)*(r1 - r0)*.3, W*.22, 5 + (i%2)*3, `rgba(220,214,214,${.12*Math.sin(k*Math.PI)})`); } // mist on the river
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.06 + i*Math.min(32, W*.45/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, .7, .5); };

SCENEX.b2_spirits = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.6, gx = W*.64, gy = hz + 1, gs = H/240*.62, p = (Math.sin(t/700) + 1)/2;
  ctx.drawImage(sceneLayer('b2:spirits', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#04050a'],[.6,'#0c1220'],[1,'#1a2230']]); x.fillRect(0, 0, W, hz + 2);
    for (let i=0;i<120;i++){ x.fillStyle = `rgba(220,226,240,${.2 + hash(i, 1)*.5})`; x.fillRect(hash(i, 2)*W, hash(i, 3)*hz*.9, hash(i, 4) > .92 ? 1.6 : 1, 1); } // stars
    x.fillStyle = '#0a0c12'; x.beginPath(); x.moveTo(0, hz); for (let px=0;px<=W + 10;px+=10) x.lineTo(px, hz - 2 - Math.max(0, Math.sin(px/50 + 1) - .6)*16); x.lineTo(W, hz + 4); x.lineTo(0, hz + 4); x.fill(); // the far line of the Odhan
    x.fillStyle = vgrad(x, hz, H, [[0,'#0e121a'],[1,'#040406']]); x.fillRect(0, hz + 2, W, H);
    for (let i=0;i<5;i++) { const fx = W*(.06 + i*.05), fy = hz + 10 + i*2; glow(x, fx, fy, 8, '#ff9040', .4); x.fillStyle = '#ffc070'; x.fillRect(fx - .5, fy - 1, 1.2, 1.2); } // the Chain's fires, far off to the left
    x.fillStyle = '#06070a'; x.beginPath(); x.moveTo(W*.22, hz + 26); x.quadraticCurveTo(W*.32, hz + 12, W*.44, hz + 26); x.fill(); // a low rise
    [[.3, .8], [.318, .6], [.332, .6]].forEach(([k, s], i) => { const px = W*k, py = hz + 18 + (i ? .6 : 0); x.fillStyle = '#0a0c10'; x.fillRect(px - 1.2*s, py - 8*s, 2.4*s, 8*s); x.beginPath(); x.arc(px, py - 9.2*s, 1.4*s, 0, 7); x.fill(); x.fillStyle = 'rgba(200,214,196,.25)'; x.fillRect(px - 1.2*s, py - 8*s, .8*s, 7*s); }); // three small figures on it: Sormo, and the two children
    x.fillStyle = 'rgba(0,0,0,.6)'; x.beginPath(); x.moveTo(0, H); x.lineTo(0, H*.84); x.quadraticCurveTo(W*.4, H*.8, W*.7, H*.86); x.quadraticCurveTo(W*.9, H*.88, W, H*.84); x.lineTo(W, H); x.fill(); // the near ground
  }), 0, 0, W, H);
  // the god of the Semk, out on the plain: hunched, too big, painted; a shape against the stars, its paint glowing; never closer than this
  ctx.save(); ctx.translate(gx, gy); ctx.scale(gs, gs); const sway = Math.sin(t*mo/1100)*1.6, drag = Math.sin(t*mo/700)*1.2;
  glow(ctx, 0, -60, 80, '#7ab040', .08 + p*.06);
  ctx.globalAlpha = .92; ctx.fillStyle = '#05060a'; poly(ctx, [[-26,2],[-20,-44],[-30,-68],[-34,-86],[-44 + sway,-102],[-41 + sway,-124],[-38 + sway,-130],[-35 + sway,-124],[-33 + sway,-104],[-24,-92],[-14,-98],[-10,-110],[2,-114],[10,-104],[16,-96],[30,-88],[38,-68 + drag],[44,-40 + drag],[50,-20 + drag],[43,-18 + drag],[34,-44],[26,-60],[22,-46],[28,2],[14,2],[4,-30],[-10,2]]); ctx.fill(); ctx.globalAlpha = 1; // one arm flung up, the other dragged down, the head low
  ctx.lineCap = 'round'; ctx.strokeStyle = `rgba(150,210,80,${.3 + p*.25})`; ctx.lineWidth = 1.4; ctx.beginPath(); for (let i=0;i<4;i++){ ctx.moveTo(-16 + i*9, -82 + i); ctx.lineTo(-18 + i*10, -60 + i); } ctx.moveTo(-6, -104); ctx.lineTo(5, -105); ctx.stroke(); // the ash-paint, glowing
  ctx.strokeStyle = `rgba(214,196,150,${.18 + p*.14})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-30, -84); ctx.lineTo(-40 + sway, -118); ctx.moveTo(28, -84); ctx.lineTo(42, -36 + drag); ctx.stroke(); ctx.lineCap = 'butt';
  ell(ctx, -2.6, -102, 1.3, .8, `rgba(200,255,120,${.6 + p*.3})`); ell(ctx, 3.6, -102, 1.3, .8, `rgba(200,255,120,${.5 + p*.3})`);
  for (let i=0;i<10;i++){ const k = ((t*mo/4200 + hash(i, 5)) % 1), a = hash(i, 6)*6.28; ell(ctx, Math.cos(a)*(18 + k*44), -70 - k*50 + Math.sin(a)*18, 2*(1 - k), 1.2*(1 - k), `rgba(160,220,90,${.4*(1 - k)})`); } // pieces of it, torn loose, going out
  ctx.restore();
  // the land's spirits: out of the ground all round it, pale and many, like smoke that knows where it is going
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i=0;i<22;i++){ const side = i%2 ? 1 : -1, bx = gx + side*(24 + hash(i, 11)*130)*gs, k = ((t*mo/(6000 + hash(i, 12)*4000) + hash(i, 13)) % 1), tx = gx + side*(4 + hash(i, 14)*30)*gs, ty = gy - (30 + hash(i, 15)*80)*gs, e = .35 + k*.65, ex = lerp(bx, tx, e), ey = lerp(gy, ty, e), a = Math.sin(k*Math.PI);
    for (let w=0;w<2;w++){ ctx.strokeStyle = `rgba(180,198,220,${(w ? .1 : .035)*a + (w ? .03 : .015)})`; ctx.lineWidth = (w ? 1.4 : 6 + hash(i, 16)*6)*gs; ctx.beginPath(); ctx.moveTo(bx, gy + 4*gs); ctx.bezierCurveTo(bx + side*8*gs, gy - 24*gs, lerp(bx, tx, .5) + Math.sin(t*mo/700 + i)*6*gs, ey + 26*gs, ex, ey); ctx.stroke(); }
    glow(ctx, ex, ey, 5*gs, '#d0dcf0', .3*a); }
  for (let i=0;i<30;i++){ const k = ((t*mo/(3000 + hash(i, 21)*2000) + hash(i, 22)) % 1), px = gx + (hash(i, 23) - .5)*W*.6, py = gy + 3 - k*26*gs; ctx.fillStyle = `rgba(200,214,230,${.35*Math.sin(k*Math.PI)})`; ctx.fillRect(px, py, 1.1, 1.1); } // the ground giving them up
  ctx.lineCap = 'butt'; glow(ctx, gx, gy - 30*gs, W*.35, '#8aa0c0', .05 + p*.03); ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(10,14,22,.35)'; ctx.fillRect(0, gy - 140*gs, W, 150*gs); // night air between us and it
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.08 + i*Math.min(32, W*.45/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  ctx.fillStyle = 'rgba(6,8,20,.45)'; ctx.fillRect(0, H*.7, W, H*.3); // the dark, on their backs
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.4, H*.82, W*.4, '#7a90b0', .05 + p*.03); ctx.globalCompositeOperation = 'source-over'; // what light there is, from out there
  vign(ctx, W, H, .8, .5); };
