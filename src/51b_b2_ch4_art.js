/* ============ Book Two, Chapter 4 art: The Day of Pure Blood — the Vathar Crossing, the Silanda, the evening after ============ */
/* Figures (FIGX), the crossing (TILEX) and three backdrops (SCENEX), drawn the way 47b, 49b and 50b draw: lantern low on the left,
   glare by day, blue-black by night, dust over everything. What happened at the Vathar is kept far off: smoke, birds, a dark far bank, things left in the mud. */

/* ---------------- figures: FIGX[kind](ctx, h, t, o), the same ~32px frame as 47b ---------------- */
/* sweat or a sheen of gold on skin: a few bright points that come and go */
const b2Beads = (ctx, t, pts, col, still) => pts.forEach(([x, y], i) => { const a = still ? .7 : .35 + .45*(Math.sin(t/380 + i*1.9) + 1)/2; ctx.fillStyle = col.replace('A', a.toFixed(2)); ctx.fillRect(x, y, .7, .8); });
Object.assign(FIGX, {
  /* Nethpara of the Nobles' Council: fat, soft, sweating through good silk gone grey with the march; a chain of office, a kerchief to his brow, rings */
  nethpara(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.12, 1.02);
    h.legs('#2a2018'); ctx.fillStyle = '#4a3020'; ctx.fillRect(-4.8, 11, 3.8, 2); ctx.fillRect(1, 11, 3.8, 2); // soft slippers, ruined
    ctx.fillStyle = h.armor('#7a5a6a', '#2a1a24'); ctx.beginPath(); ctx.moveTo(-6.4, -6.4); ctx.lineTo(6.4, -6.4); ctx.quadraticCurveTo(11.6, 1, 8.8, 12); ctx.lineTo(-8.8, 12); ctx.quadraticCurveTo(-11.6, 1, -6.4, -6.4); ctx.fill(); // the robe, and the belly in it
    ctx.fillStyle = 'rgba(160,140,110,.28)'; ctx.fillRect(-8.6, 9, 17.2, 3); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(1.6, 3.4, 6, 4.6, 0, -.4, Math.PI*.8); ctx.fill(); // dust to the knee; the belly's shadow
    ell(ctx, -3.6, -.8, 2.4, 3.4, 'rgba(255,240,230,.1)'); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-.5, -6, 1, 18); ctx.fillStyle = '#6a2a3a'; ctx.beginPath(); ctx.ellipse(0, 4.2, 9.4, 1.4, 0, 0, 7); ctx.fill(); // the silk's shine, gold trim, a sash pulled under the paunch
    ctx.strokeStyle = '#c9a44a'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(-4.8, -6); ctx.quadraticCurveTo(0, -1.2, 4.8, -6); ctx.stroke(); ell(ctx, 0, -2, 1.5, 1.5, '#d8b860'); ell(ctx, -.4, -2.4, .5, .5, 'rgba(255,250,220,.8)'); // the chain of office and its medallion
    h.head('#c09a7a', 5.2, -11); ell(ctx, 0, -6.8, 4.4, 1.8, '#b08a6a'); ell(ctx, 3.2, -9, 1.6, 1.4, 'rgba(200,110,90,.35)'); // jowls, a flushed cheek
    h.look('rgba(24,14,10,.82)', -11.6); ctx.fillStyle = 'rgba(40,24,16,.4)'; ctx.fillRect(-1.2, -10.4, 1.8, .6); ctx.fillRect(1.8, -10.4, 1.8, .6); // small eyes, pouched
    ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.arc(0, -12.4, 5.2, Math.PI*.96, Math.PI*1.22); ctx.lineTo(-3.4, -13); ctx.fill(); ctx.fillRect(-5.2, -12.6, 1.4, 3.4); // a fringe of oiled hair round the ears, the crown bald
    ctx.fillStyle = 'rgba(255,245,230,.22)'; ctx.fillRect(-2.6, -15.8, 3.2, 1.2); b2Beads(ctx, t, [[-1.6,-14.4],[1.4,-14.8],[3.4,-13.4],[-3.4,-12.8],[4,-10.6]], 'rgba(240,250,255,A)', o.still); // the pate, and the sweat on it
    ctx.fillStyle = '#1a1210'; ctx.fillRect(-1.4, -8.6, 4.8, 1); // a thin moustache, oiled
    B2F.line(ctx, '#7a5a6a', 2, [[5.4, -4], [7.4, -9], [5.6, -12.4]]); ell(ctx, 5, -13, 1.6, 1.4, '#c09a7a'); poly(ctx, [[3.4,-14.8],[6.8,-14.2],[6.2,-11.2],[3.6,-12]], '#e8e0d0'); // the kerchief to his brow
    ell(ctx, -8.4, 2, 1.5, 1.5, '#c09a7a'); ctx.fillStyle = '#e8c073'; ctx.fillRect(-9, 1.6, 1.4, .6); ell(ctx, -7.8, 2.8, .5, .5, '#c84a5a'); // a ringed hand, a ruby
    ctx.restore(); },

  /* Pullyk Alar: thin, upright, sharp; a narrow dark coat buttoned to the throat, a pointed beard, a hooked nose, a folded paper held close */
  pullyk(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .9, 1.1);
    h.legs('#1a1614'); ctx.fillStyle = '#2a1e16'; ctx.fillRect(-4.6, 10.6, 3.6, 2.4); ctx.fillRect(1, 10.6, 3.6, 2.4); // good boots, kept clean somehow
    poly(ctx, [[-5.6,-6.4],[5.6,-6.4],[6.6,11.6],[-6.6,11.6]], h.armor('#3a3a4a', '#0e0e16')); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-.4, -6, .8, 17.4); // the long coat, close-cut
    ctx.fillStyle = '#b8a070'; for (let i=0;i<6;i++) ctx.fillRect(.8, -5 + i*2.2, .8, .8); ctx.fillStyle = '#5a2a3a'; ctx.fillRect(-5.8, -6.6, 11.6, 1.2); // a row of small brass buttons, a wine-dark collar
    ctx.fillStyle = 'rgba(200,210,240,.1)'; ctx.fillRect(-5.2, -5.6, 1.8, 15); // the cloth's sheen
    ctx.save(); ctx.translate(-5.4, 1.2); ctx.rotate(-.25); ctx.fillStyle = '#e4dcc4'; ctx.fillRect(-1.6, -2.6, 3.4, 4.4); ctx.fillStyle = '#8a2a1e'; ctx.fillRect(-.6, -.6, 1.4, 1.2); ctx.fillStyle = 'rgba(40,30,20,.4)'; ctx.fillRect(-1.2, -1.8, 2.6, .3); ctx.fillRect(-1.2, .9, 2.4, .3); ctx.restore(); // a folded paper, a seal of red wax
    B2F.line(ctx, '#3a3a4a', 1.6, [[-5.2, -4.6], [-5.6, 1.4]]); ell(ctx, -5, 1.6, 1, 1, '#a8826a'); // the hand that holds it
    h.head('#a8826a', 3.9, -11.6); ctx.fillStyle = 'rgba(40,24,16,.3)'; ctx.fillRect(-3, -9.4, 6, .5); // a narrow face, hollow under the cheekbones
    h.look('rgba(20,12,8,.9)', -12); ctx.fillStyle = '#1a1210'; ctx.fillRect(-1.4, -13.4, 2.2, .5); ctx.fillRect(1.8, -13.6, 2.2, .5); // eyes close-set under level brows
    poly(ctx, [[3,-12],[5.6,-9.6],[4.6,-9],[3.4,-9.4]], '#a07a62'); // the nose, hooked
    poly(ctx, [[-1.4,-8.6],[3.4,-8.6],[2.2,-5.4],[1,-3.2],[-.2,-5.4]], '#1a1210'); ctx.fillStyle = 'rgba(160,150,140,.4)'; ctx.fillRect(.6, -6, .5, 2); // a pointed beard, a thread of grey
    ctx.fillStyle = '#1a1210'; ctx.beginPath(); ctx.arc(0, -12.6, 4.2, Math.PI, Math.PI*2); ctx.fill(); ctx.fillRect(-4.2, -12.8, 1.2, 2.6); ctx.fillStyle = 'rgba(255,250,240,.16)'; ctx.fillRect(-2.6, -16.4, 2.6, .8); // black hair combed flat, a widow's peak
    ctx.restore(); },

  /* Sergeant Gesler of the marines: short, broad, bow-legged; the fire left his skin gold; a cut-down leather coat, a cutlass, a cheerful bad look */
  gesler(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.04, .98); const sk = '#c8a050';
    ctx.fillStyle = '#3a2e22'; ctx.fillRect(-5.2, 5, 3.4, 8); ctx.fillRect(1.8, 5, 3.4, 8); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-5.2, 11, 3.4, 2); ctx.fillRect(1.8, 11, 3.4, 2); // bow-legged
    poly(ctx, [[-7,-6.4],[7,-6.4],[7.4,7.6],[-7.4,7.6]], h.armor('#7a5e3e', '#241a10')); ctx.strokeStyle = 'rgba(20,12,6,.5)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<3;i++){ ctx.moveTo(-7, -2 + i*3.2); ctx.lineTo(7.2, -2 + i*3.2); } ctx.stroke(); // a leather coat, cut short, banded
    ctx.fillStyle = 'rgba(10,6,4,.4)'; ell(ctx, 4, 4, 2, 1.4, ctx.fillStyle); ell(ctx, -4.6, -3, 1.4, 1.2, ctx.fillStyle); // scorched through in places
    ctx.fillStyle = '#2a1e12'; ctx.fillRect(-7.2, 2.6, 14.4, 1.6); ctx.fillStyle = '#9a968c'; ctx.fillRect(-1, 2.6, 2, 1.6); // belt, an iron buckle
    ctx.fillStyle = '#5a6a8a'; ctx.fillRect(2.4, -5.4, 1.6, 1.6); ctx.fillStyle = '#c8b890'; ctx.fillRect(4.6, -5.4, .6, 1.6); ctx.fillRect(5.6, -5.4, .6, 1.6); // a marine's blue tab, a sergeant's two bars
    ell(ctx, -7.6, 2.6, 1.8, 1.8, sk); B2F.line(ctx, sk, 2, [[-6.6, -4.8], [-7.8, 1.6]]); // a bare forearm, gold
    h.head(sk, 4.6, -11); ell(ctx, -2, -13, 2.6, 1.6, 'rgba(255,240,180,.35)'); h.look('rgba(30,20,8,.9)', -11.4); // a broad face, gold, the light skating on it
    ctx.fillStyle = 'rgba(90,60,20,.45)'; ctx.fillRect(-2.4, -8.6, 5.6, 1.8); ctx.fillStyle = '#4a2e14'; ctx.fillRect(.2, -7.6, 3, .5); ctx.fillRect(3, -8, .6, .5); // stubble, a crooked grin
    ctx.fillStyle = '#7a5a2a'; ctx.beginPath(); ctx.arc(0, -12.2, 4.8, Math.PI*1.02, Math.PI*1.98); ctx.fill(); ctx.fillStyle = 'rgba(255,230,160,.25)'; ctx.fillRect(-3, -16.2, 2.6, .8); // hair cropped to the skull, gone gold as well
    poly(ctx, [[3.6,-11.2],[5.4,-9.4],[3.8,-9]], sk); ctx.fillStyle = 'rgba(60,30,10,.4)'; ctx.fillRect(4, -9.2, 1.4, .4); // a nose broken more than once
    b2Beads(ctx, t, [[-3.6,-13],[1.6,-14.6],[-6.6,-2],[-8.4,2]], 'rgba(255,240,170,A)', o.still); // the gold, catching
    B2F.curved(ctx, '#d0c8b4', 1); ctx.fillStyle = '#c9a44a'; ctx.fillRect(5.4, .8, 3.8, 1.1); ctx.restore(); }, // the cutlass, a brass guard

  /* Corporal Stormy: a huge Falari, red beard and red hair wild, gold-skinned from the fire; mail over a burned shirt, a heavy sword over his shoulder */
  stormy(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.22, 1.18); const sk = '#c49a52';
    B2F.line(ctx, '#5a3e22', 1.8, [[5.4, -2], [7.4, -7]]); B2F.line(ctx, '#d4ccbc', 2.2, [[7.2, -6.8], [12.4, -22]], 'butt'); poly(ctx, [[11.4,-22.6],[13.6,-21.8],[13,-24.4]], '#d4ccbc'); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(4.6, -6.4, 5, 1.2); // the big sword, laid back on his shoulder
    h.legs('#2a2420'); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-4.8, 9.4, 3.8, 3.6); ctx.fillRect(1, 9.4, 3.8, 3.6);
    poly(ctx, [[-7.6,-6.6],[7.6,-6.6],[8,8.6],[-8,8.6]], h.armor('#7e7a70', '#1e1c18')); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<7;i++){ ctx.moveTo(-7.8, -5 + i*2); ctx.lineTo(7.8, -5 + i*2); } ctx.stroke(); // mail
    ctx.fillStyle = '#6a4a2e'; ctx.fillRect(-8, 6.8, 16, 2.4); ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let i=0;i<4;i++) ctx.fillRect(-7 + i*4, 7.6, 2.4, 1.6); // a scorched shirt-tail, ragged
    ctx.fillStyle = 'rgba(255,250,236,.1)'; ctx.fillRect(-7.2, -6, 2.2, 13); ctx.fillStyle = '#2a1e12'; ctx.fillRect(-8, 2.6, 16, 1.7); ctx.fillStyle = '#5a6a8a'; ctx.fillRect(2.6, -5.6, 1.6, 1.6); // belt; the blue tab
    ell(ctx, -8.6, 3, 2, 2, sk); B2F.line(ctx, sk, 2.4, [[-7.4, -5], [-8.8, 2.4]]); // a fist like a stone
    h.head(sk, 4.6, -11.6); ell(ctx, -2.2, -13.4, 2.4, 1.4, 'rgba(255,240,180,.3)'); h.look('rgba(30,20,8,.9)', -12);
    ctx.fillStyle = '#b0381e'; ctx.beginPath(); ctx.moveTo(-4.4, -10); ctx.quadraticCurveTo(-5.6, -4, -2, -1.6); ctx.lineTo(.6, -.2); ctx.lineTo(3, -1.8); ctx.quadraticCurveTo(6, -4.6, 4.8, -10); ctx.lineTo(3.4, -9); ctx.lineTo(-3, -9); ctx.closePath(); ctx.fill(); // the red beard, to the chest
    ctx.strokeStyle = 'rgba(240,120,70,.6)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<5;i++){ ctx.moveTo(-3 + i*1.6, -8.6); ctx.quadraticCurveTo(-2.6 + i*1.6, -5, -1.6 + i*1.2, -2.4); } ctx.stroke(); ctx.fillStyle = '#5a1608'; ctx.fillRect(-.6, -8.4, 3.4, .7); // its curls; the mouth in it
    ctx.fillStyle = '#b0381e'; ctx.beginPath(); ctx.arc(0, -12.8, 5.2, Math.PI*.9, Math.PI*2.06); ctx.fill(); for (let i=0;i<6;i++){ poly(ctx, [[-5 + i*2, -16.4 + Math.abs(i - 2.5)*.6],[-4.4 + i*2, -19 + Math.abs(i - 2.5)*.7 + (i%2)],[-3.2 + i*2, -16.6 + Math.abs(i - 2.5)*.6]], '#b0381e'); } // a red mane, never combed
    ctx.fillStyle = '#e0683a'; ctx.fillRect(-4.6, -16, 3.4, .8); ctx.fillRect(-5.6, -12.8, 1.4, 4); // the light in it
    b2Beads(ctx, t, [[-3.4,-13.6],[2.4,-11],[-8.8,1.6]], 'rgba(255,240,170,A)', o.still);
    ctx.restore(); },

  /* Truth: a young marine, hardly more than a boy, gold-skinned like the others; a helm too big for him, a spear held too tight, wide eyes */
  truth(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .94, 1.02); const sk = '#d0aa62';
    B2F.line(ctx, '#5a4026', 1.3, [[7.6, 12.4], [9, -22]], 'butt'); poly(ctx, [[9.1,-27],[8,-21.6],[10.2,-21.6]], '#c8c4b8'); // a spear
    h.legs('#2e2a24'); ctx.fillStyle = '#3a2e22'; ctx.fillRect(-4.5, 10, 3.4, 3); ctx.fillRect(1.1, 10, 3.4, 3);
    h.torso('#8a7a56', '#3a321e', 6); ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<4;i++){ ctx.moveTo(-6, -3 + i*2.6); ctx.lineTo(6, -3 + i*2.6); } ctx.stroke(); // a padded jerkin, new, already ruined
    ctx.fillStyle = 'rgba(20,12,6,.35)'; ell(ctx, -2, 3.4, 2.4, 1.2, ctx.fillStyle); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-6, 3, 12, 1.3); ctx.fillStyle = '#5a6a8a'; ctx.fillRect(2.2, -5.4, 1.4, 1.4); // a scorch; belt; the blue tab
    B2F.line(ctx, sk, 1.8, [[5, -3.6], [8.4, -1.6]]); ell(ctx, 8.6, -1.4, 1.3, 1.3, sk); ell(ctx, 8.4, 3, 1.2, 1.2, sk); // both hands on the spear
    h.head(sk, 4.2, -11); ell(ctx, -1.8, -12.4, 2, 1.2, 'rgba(255,245,200,.3)'); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(-1.2, -11.6, 1.6, 1.3); ctx.fillRect(1.8, -11.6, 1.6, 1.3); h.look('rgba(30,20,8,.95)', -11.4); // eyes too wide
    ctx.fillStyle = '#5a3a1a'; ctx.fillRect(.6, -8, 2, .5); // a mouth pressed shut
    ctx.fillStyle = h.armor('#76726a', '#24221e'); ctx.beginPath(); ctx.arc(0, -12.6, 5.8, Math.PI, 0); ctx.fill(); ctx.fillRect(-6.2, -13, 12.4, 1.6); ctx.fillStyle = 'rgba(255,250,240,.2)'; ctx.fillRect(-4, -17.6, 3, 1); // a helm a size too big, down to his brows
    B2F.line(ctx, '#4a3a26', .6, [[-5, -11.6], [-3.6, -6.4]]);
    b2Beads(ctx, t, [[-3,-12],[2,-9.4]], 'rgba(255,245,190,A)', o.still);
    ctx.restore(); },

  /* one of Dom's pikemen: a rebel regular, drilled — quilted coat, iron cap, the green on the arm, a pike as long as three men, a little round buckler */
  pikeman(ctx, h, t, o){ const sk = b2Pick(o, ['#8a6448', '#7a5a40', '#946c4c', '#6a4a32']), coat = b2Pick(o, [['#9a8a62','#3a3220'], ['#8a7a5a','#30281a'], ['#a08e66','#3e3422']]), sway = o.still ? 0 : Math.sin(t/700 + (o.phase||0))*.4;
    B2F.line(ctx, '#5a4428', 1.4, [[7.8, 12.6], [10.8 + sway, -34]], 'butt'); poly(ctx, [[11 + sway,-40],[10 + sway,-33.4],[11.8 + sway,-33.4]], '#c4c0b4'); ctx.fillStyle = '#3e8a3a'; ctx.fillRect(10 + sway, -32.6, 1.8, 1.4); // the pike, a green rag below the head
    h.legs('#2a2420'); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-4.6, 9.6, 3.6, 3.4); ctx.fillRect(1, 9.6, 3.6, 3.4);
    poly(ctx, [[-6.4,-6.2],[6.4,-6.2],[7,8.6],[-7,8.6]], h.armor(coat[0], coat[1])); ctx.strokeStyle = 'rgba(40,30,16,.4)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<5;i++){ ctx.moveTo(-6.6, -4 + i*2.6); ctx.lineTo(6.8, -4 + i*2.6); } for (let i=0;i<4;i++){ ctx.moveTo(-4.6 + i*3, -6); ctx.lineTo(-4.8 + i*3.2, 8.4); } ctx.stroke(); // the quilted coat, stitched in squares
    ctx.fillStyle = '#2a1e12'; ctx.fillRect(-6.8, 2.2, 13.6, 1.5); ctx.fillStyle = '#4a3a24'; ctx.fillRect(-7.6, 3, 2, 5); B2F.green(ctx, -8.4, -4); // belt, a long knife, the green on the arm
    B2F.line(ctx, coat[0], 1.8, [[4.6, -4], [8.6, -6]]); ell(ctx, 9, -6.2, 1.1, 1.1, sk); ell(ctx, 8.4, 3.6, 1.1, 1.1, sk); // two hands on the pike
    h.head(sk, 4.4, -11.2); h.look('rgba(255,190,140,.5)', -11.6); ctx.fillStyle = 'rgba(20,12,8,.5)'; ctx.fillRect(-2.6, -8.6, 5.6, 1.6); // a stubbled jaw
    ctx.fillStyle = h.armor('#8a867c', '#1e1d1a'); ctx.beginPath(); ctx.arc(0, -12.6, 5.2, Math.PI, 0); ctx.fill(); ctx.fillRect(-6, -13, 12, 1.2); ctx.fillStyle = 'rgba(255,250,240,.2)'; ctx.fillRect(-3.4, -16.8, 2.8, .9); B2F.line(ctx, '#2a2420', .8, [[0, -17.8], [0, -19.4]]); // the iron cap, a knob on top
    ctx.fillStyle = b2Pick(o, ['#c8bca4', '#a89a7c', '#8a7e66']); ctx.fillRect(-5.6, -12, 2, 5); // a neck-cloth under the cap
    ctx.save(); ctx.translate(-7.4, -1); ctx.fillStyle = h.armor('#6a5a40', '#1e160c'); ctx.beginPath(); ctx.arc(0, 0, 3.6, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a867c'; ctx.lineWidth = .8; ctx.stroke(); ell(ctx, 0, 0, 1, 1, '#9a968c'); ctx.restore(); }, // a small buckler on the forearm

  /* Korbolo Dom: half-Napan, the blue-grey skin of the isles, shaven head; a Fist's Malazan-cut armour with every badge cut away — the cloth paler where they were */
  dom(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.08, 1.1); const sk = '#6e7480', sw = o.still ? 0 : Math.sin(t/650 + (o.phase||0))*.6;
    poly(ctx, [[-6.6,-6.6],[6.4,-6.6],[8.4 + sw*.4,12.6],[-9.4 + sw,12.6]], h.armor('#2a2a30', '#08080a')); ctx.fillStyle = 'rgba(60,62,72,.5)'; ctx.fillRect(-9, 11, 17, 1.6); // a black cloak behind, dusty at the hem
    h.legs('#1e1c1a'); ctx.fillStyle = h.armor('#6a6a6e', '#1e1e22'); ctx.fillRect(-4.6, 6, 3.6, 5.6); ctx.fillRect(1, 6, 3.6, 5.6); ctx.fillStyle = '#2a2018'; ctx.fillRect(-4.8, 11, 3.8, 2); ctx.fillRect(1, 11, 3.8, 2); // greaves, boots
    poly(ctx, [[-7,-6.6],[7,-6.6],[7.6,7.8],[-7.6,7.8]], h.armor('#8a8a8e', '#1e1e24')); // the cuirass, Malazan cut
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(0, -6.4); ctx.lineTo(0, 7.6); for (let i=0;i<3;i++){ ctx.moveTo(-7.2, 4 + i*1.4); ctx.lineTo(7.4, 4 + i*1.4); } ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(-6.4, -6, 2, 9); // the ridge, the lames at the waist, the lantern's line
    ctx.fillStyle = '#9e9ea4'; ctx.fillRect(-4.6, -3.8, 3.2, 3.2); ctx.fillRect(2.2, -6.6, 2.4, 2); ctx.strokeStyle = 'rgba(40,30,20,.6)'; ctx.lineWidth = .35; ctx.strokeRect(-4.6, -3.8, 3.2, 3.2); ctx.beginPath(); for (let i=0;i<4;i++){ ctx.moveTo(-4.8 + i*1.1, -4); ctx.lineTo(-4.4 + i*1.1, -3.4); } ctx.stroke(); // bright where the Empire's badge and his Fist's rank were, the rivets cut out
    ell(ctx, -7.4, -5.6, 2.8, 2, h.armor('#8a8a8e', '#2a2a30')); ell(ctx, 7.2, -5.6, 2.6, 1.9, h.armor('#6a6a70', '#1a1a20')); // pauldrons
    ctx.fillStyle = '#3e8a3a'; ctx.fillRect(-7.4, 2.4, 14.8, 1.6); ctx.fillStyle = '#2a5e28'; ctx.fillRect(-7.4, 3.4, 14.8, .6); poly(ctx, [[-6,3.6],[-7.4,8.4],[-5.2,8]], '#3e8a3a'); // the rising's green, as a sash
    h.head(sk, 4.6, -11.4); ell(ctx, -2.2, -13.6, 2.4, 1.4, 'rgba(220,226,240,.25)'); // the shaven head, blue-grey
    h.look('rgba(230,210,170,.85)', -11.8); ctx.fillStyle = '#1a1c22'; ctx.fillRect(-1.6, -13, 2.4, .6); ctx.fillRect(1.6, -13.2, 2.4, .6); // pale eyes under heavy brows
    ctx.strokeStyle = 'rgba(180,186,200,.6)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(-3.6, -14.4); ctx.lineTo(-1, -8.4); ctx.stroke(); // an old scar, brow to jaw
    ctx.fillStyle = '#3a3e48'; ctx.fillRect(.2, -8.4, 3.2, .6); ctx.fillStyle = 'rgba(30,32,40,.4)'; ctx.fillRect(-3.2, -9, 7.4, 1.8); // a flat mouth, a heavy jaw
    ctx.fillStyle = '#c9a44a'; ell(ctx, -4.4, -9.8, .5, .6, '#c9a44a'); // a gold ring in the ear
    h.sword('#c8c4ba'); ctx.fillStyle = '#4a3a26'; ctx.fillRect(5.6, 3.2, 2.6, 1); ctx.restore(); },
});

/* ---------------- ground: the Vathar Crossing ---------------- */
/* The river at noon: brown, slow, wide; the near bank trodden to soup by forty thousand feet, things dropped in it, arrows standing in it.
   '.' mud  ',' reeds  '~' deep  '-' ford shallows  'b' floating bridge  '#' steep bank  'x' drowned tree  'W' overturned wagon  'c' cart */
const b2VW = c => c === '~' || c === '-' || c === 'b' || c === 'x', b2VDep = c => c === '~' || c === 'b' ? 2 : c === 'x' ? 1.3 : c === '-' ? 1 : 0;
const b2VP = N => N ? {mud:'#2a2a30', mudD:'#1c1c22', lit:'170,180,220', wetRGB:'8,8,12', wet:'#19191e', reed:'#2a3230', reedL:'#3e4844', head:'#1e1a16', top:'#2c2e2e', face:'#1c1a1c', faceD:'#0c0b0c', w0:'#343a42', w1:'#1e282e', w2:'#0e161a', glint:'rgba(170,190,230,.2)', lip:'rgba(160,170,210,.16)',
                         plank:'#2c2a28', plankL:'#3a3836', plankD:'#141210', rope:'#4a4438', tree:'#4a4c50', treeD:'#1a1a1e', wood:'#2a2018', woodL:'#3a3028', cloth:'#3a3632', clothD:'#24221e', shaft:'#4a4438', fl:'#5a5a62'}
                     : {mud:'#6e5a44', mudD:'#4e3e2c', lit:'255,244,220', wetRGB:'50,38,24', wet:'#4e3e2c', reed:'#76744a', reedL:'#aaa274', head:'#5a3a1e', top:'#8e8458', face:'#6a5038', faceD:'#2a1c10', w0:'#8a7c5a', w1:'#6a6a4c', w2:'#36423a', glint:'rgba(240,244,232,.36)', lip:'rgba(240,232,210,.34)',
                         plank:'#8a7454', plankL:'#b09a74', plankD:'#2a2014', rope:'#a08c64', tree:'#a49a88', treeD:'#4a4236', wood:'#5a4028', woodL:'#7a5a3a', cloth:'#c8b894', clothD:'#8a7a5a', shaft:'#8a7048', fl:'#d8d0c0'};
function b2Vathar(ctx, ch, x, y, T, N){
  const px = x*T, py = y*T, h = hash(x, y), P = b2VP(N), fill = c => { ctx.fillStyle = c; ctx.fillRect(px, py, T, T); };
  const wcol = v => v <= 1 ? b2Mix(P.w0, P.w1, v) : b2Mix(P.w1, P.w2, v - 1);
  const flowH = (() => { let hz = 0, vt = 0; for (let k=-3;k<=3;k++){ if (b2VW(b2Tile(x + k, y))) hz++; if (b2VW(b2Tile(x, y + k))) vt++; } return hz >= vt; })();
  const mud = () => { fill(shade(P.mud, (h - .5)*.05)); b2Mottle(ctx, x, y, T, N ? .025 : .07, N ? .2 : .18, P.lit, 1.2);
    ctx.fillStyle = N ? 'rgba(0,0,0,.22)' : 'rgba(40,28,16,.25)'; for (let i=0;i<3;i++){ const sx = px + hash(x,y,i+30)*T, sy = py + hash(y,x,i+31)*T; ell(ctx, sx, sy, T*(.12 + hash(x,y,i+32)*.12), T*.05, ctx.fillStyle, (hash(x,y,i+33) - .5)); } // churned, puddled
    if (!N) { ctx.fillStyle = 'rgba(255,240,210,.12)'; for (let i=0;i<2;i++) ell(ctx, px + hash(x,y,i+34)*T, py + hash(y,x,i+35)*T, T*.06, T*.02, ctx.fillStyle); } // the sky in a puddle
    if (!b2VW(ch)) b2WetEdges(ctx, x, y, T, c => c === '~' || c === '-' || c === 'b', P.wetRGB, N ? .5 : .6, .4); };
  const water = (K = 1.3) => { mud(); ctx.fillStyle = `rgba(${P.wetRGB},${N ? .5 : .6})`; ctx.fillRect(px, py, T, T);
    const S = b2WaterShape(x, y, T, b2VW, K); ctx.save(); S.path(ctx); ctx.clip(); b2WaterFill(ctx, x, y, T, b2VDep, wcol);
    const deep = b2VDep(ch) >= 2; ctx.lineCap = 'round';
    for (let i=0;i<(deep ? 4 : 3);i++){ const sx = px + hash(x,y,i+40)*T, sy = py + hash(y,x,i+41)*T, len = T*(deep ? .3 + hash(x,y,i+42)*.35 : .12 + hash(x,y,i+42)*.16), wob = T*.025*(hash(x,y,i+43) - .5);
      ctx.strokeStyle = deep ? (N ? 'rgba(120,140,180,.12)' : 'rgba(220,226,210,.2)') : P.glint; ctx.lineWidth = Math.max(1, T*.02); ctx.beginPath();
      if (flowH) { ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + len/2, sy + wob, sx + len, sy); } else { ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + wob, sy + len/2, sx, sy + len); } ctx.stroke(); }
    if (ch === '-') for (let i=0;i<2;i++){ const cx = px + T*(.2 + hash(x,y,i+60)*.6), cy = py + T*(.2 + hash(y,x,i+61)*.6), r = T*(.04 + hash(x,y,i+62)*.04); ell(ctx, cx, cy, r*1.3, r, N ? 'rgba(60,64,74,.6)' : 'rgba(104,92,70,.6)'); ctx.strokeStyle = P.glint; ctx.lineWidth = 1; ctx.beginPath(); if (flowH) { ctx.moveTo(cx - r*1.6, cy - r*1.2); ctx.quadraticCurveTo(cx + r, cy - r*1.6, cx + r*3.4, cy - r*.6); } else { ctx.moveTo(cx - r*1.2, cy - r*1.6); ctx.quadraticCurveTo(cx - r*1.6, cy + r, cx - r*.6, cy + r*3.4); } ctx.stroke(); }
    if (ch === '~' && h > .72) { const cx = px + T*(.25 + hash(x,y,70)*.5), cy = py + T*(.25 + hash(y,x,71)*.5); ctx.save(); ctx.translate(cx, cy); ctx.rotate(hash(x,y,72)*3); ctx.fillStyle = N ? 'rgba(60,58,54,.5)' : 'rgba(150,130,100,.55)'; ctx.fillRect(-T*.16, -T*.03, T*.32, T*.06); ctx.fillStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(40,40,30,.25)'; ctx.fillRect(-T*.16, T*.03, T*.32, T*.02); ctx.restore(); } // a plank, adrift
    if (ch === '~' && h < .14) { const cx = px + T*(.3 + hash(x,y,73)*.4), cy = py + T*(.3 + hash(y,x,74)*.4); ell(ctx, cx, cy, T*.1, T*.05, N ? 'rgba(54,52,50,.5)' : 'rgba(170,154,120,.45)', hash(x,y,75)*3); ell(ctx, cx - T*.03, cy - T*.01, T*.05, T*.02, N ? 'rgba(80,80,90,.3)' : 'rgba(220,206,170,.35)', hash(x,y,75)*3); } // a cloth, floating
    ctx.lineCap = 'butt'; b2Mottle(ctx, x, y, T, N ? .03 : .07, .08, N ? '150,170,220' : '240,250,255', 1); ctx.restore();
    b2Lip(ctx, S, T, N ? 'rgba(0,0,0,.4)' : 'rgba(40,30,18,.45)', P.lip); b2BankCorners(ctx, x, y, T, b2VW, P.wet, K); return S; };
  if (ch === '~' || ch === '-') { water(); return; }
  if (ch === 'b') { water(); b2Bridge(ctx, x, y, T, N, P, flowH); return; }
  if (ch === 'x') { const wet = [[0,-1],[1,0],[0,1],[-1,0]].some(([dx, dy]) => { const c = b2Tile(x + dx, y + dy); return c === '~' || c === '-' || c === 'b'; }); // in the river it stands in water; up on the bank it is only dead
    if (wet) water(); else mud(); b2Drowned(ctx, x, y, T, N, P, wet); return; }
  if (ch === '#') { // the steep bank: a lip of trampled grass, then a raw face of clay scored by everything that slid down it
    const face = b2Tile(x, y + 1) !== '#', fy = py + (face ? T*.34 : T);
    fill(shade(P.top, (h - .5)*.05)); b2Mottle(ctx, x, y, T, N ? .015 : .04, .16, P.lit, 1);
    ctx.strokeStyle = N ? 'rgba(70,80,76,.45)' : 'rgba(160,150,96,.55)'; ctx.lineWidth = 1; for (let i=0;i<7;i++){ const gx = px + hash(x,y,i+70)*T, gy = py + T*.08 + hash(y,x,i+71)*(fy - py - T*.06); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + T*.08, gy - T*.04); ctx.stroke(); } // grass, flattened all one way
    b2Prints(ctx, x, y, T, 3, N, 9);
    if (b2Tile(x, y - 1) !== '#') { ctx.fillStyle = N ? 'rgba(150,160,200,.08)' : 'rgba(255,246,220,.2)'; ctx.fillRect(px, py, T, T*.05); }
    if (b2Tile(x - 1, y) !== '#') { ctx.fillStyle = N ? 'rgba(150,160,200,.05)' : 'rgba(255,246,220,.14)'; ctx.fillRect(px, py, T*.05, fy - py); } if (b2Tile(x + 1, y) !== '#') { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(px + T*.95, py, T*.05, fy - py); }
    if (face) { const wv = s => T*.04*Math.sin((x + s)*6.3) + T*.025*Math.sin((x + s)*15.1); ctx.beginPath(); ctx.moveTo(px, fy + wv(0)); for (let i=1;i<=8;i++) ctx.lineTo(px + i*T/8, fy + wv(i/8)); ctx.lineTo(px + T, py + T); ctx.lineTo(px, py + T); ctx.closePath();
      ctx.fillStyle = vgrad(ctx, fy, py + T, [[0, P.face], [.7, shade(P.face, -.15)], [1, P.faceD]]); ctx.fill(); ctx.save(); ctx.clip();
      for (let i=0;i<4;i++){ const yy = fy + T*(.08 + i*.13); ctx.fillStyle = N ? 'rgba(0,0,0,.22)' : `rgba(${i%2 ? '40,26,14' : '150,120,80'},.26)`; ctx.fillRect(px, yy + Math.sin(x*3 + i)*T*.02, T, Math.max(1, T*.03)); } // clay in courses
      ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(40,26,14,.4)'; ctx.lineWidth = Math.max(1, T*.025); for (let i=0;i<4;i++){ const sx = px + T*(.1 + hash(x,y,i+80)*.8); ctx.beginPath(); ctx.moveTo(sx, fy + T*.04); ctx.lineTo(sx + T*(hash(x,y,i+81) - .5)*.08, py + T*.98); ctx.stroke(); } // slide-marks, heel and hand, straight down
      ctx.strokeStyle = N ? '#0e0c0c' : '#2a1c10'; ctx.lineWidth = 1; for (let i=0;i<2;i++){ const rx = px + T*(.2 + hash(x,y,i+84)*.6); ctx.beginPath(); ctx.moveTo(rx, fy + T*.03); ctx.quadraticCurveTo(rx + T*.06, fy + T*.14, rx + T*.02, fy + T*.24); ctx.stroke(); } ctx.restore(); // roots
      ctx.strokeStyle = N ? 'rgba(150,160,200,.12)' : 'rgba(255,240,200,.3)'; ctx.lineWidth = Math.max(1, T*.025); ctx.beginPath(); ctx.moveTo(px, fy + wv(0)); for (let i=1;i<=8;i++) ctx.lineTo(px + i*T/8, fy + wv(i/8)); ctx.stroke(); }
    return; }
  mud();
  if (ch === '.') { b2Prints(ctx, x, y, T, 5 + Math.floor(hash(x,y,9)*6), N, 2); // feet, hooves, wheels, everything that went down to the water
    if (h > .82) { ctx.strokeStyle = N ? 'rgba(0,0,0,.3)' : 'rgba(40,28,16,.35)'; ctx.lineWidth = Math.max(1, T*.05); ctx.beginPath(); const a = hash(x,y,12)*.6 - .3; ctx.moveTo(px, py + T*(.3 + a)); ctx.lineTo(px + T, py + T*(.3 - a)); ctx.moveTo(px, py + T*(.62 + a)); ctx.lineTo(px + T, py + T*(.62 - a)); ctx.stroke(); } // ruts
    const k = hash(x, y, 13); if (k < .12) b2Arrows(ctx, x, y, T, N, P); else if (k < .22) b2Dropped(ctx, x, y, T, N, P, Math.floor(hash(x,y,14)*4)); }
  else if (ch === ',') { // reeds, half of them trodden flat
    const clumps = 2 + Math.floor(h*2); for (let c=0;c<clumps;c++){ const bx = px + T*(.18 + hash(x,y,c+100)*.64), by = py + T*(.35 + hash(y,x,c+101)*.55), flat = hash(x,y,c+103) > .55, lean = flat ? 1.25*(hash(x,y,c+104) > .5 ? 1 : -1) : (hash(x,y,c+102) - .5)*.5 + (N ? 0 : .1);
      ell(ctx, bx + T*.06, by + T*.02, T*.12, T*.04, N ? 'rgba(0,0,0,.35)' : 'rgba(50,36,20,.3)');
      for (let i=0;i<8;i++){ const a = lean + (i/7 - .5)*(flat ? .3 : .7), l = T*(.26 + hash(x, y, c*10 + i + 110)*.22), ex = bx + Math.sin(a)*l + (i - 3.5)*T*.012, ey = by - Math.cos(a)*l;
        ctx.strokeStyle = i%3 === 0 ? P.reedL : P.reed; ctx.lineWidth = Math.max(1, T*.022); ctx.beginPath(); ctx.moveTo(bx + (i - 3.5)*T*.012, by); ctx.quadraticCurveTo(bx + Math.sin(a)*l*.4, by - Math.cos(a)*l*.6, ex, ey); ctx.stroke();
        if (i%3 === 1 && !flat) ell(ctx, bx + Math.sin(a)*l*.86, by - Math.cos(a)*l*.86, T*.018, T*.05, P.head, a); } } }
  else if (ch === 'W') b2Overturned(ctx, x, y, T, N, P);
  else if (ch === 'c') b2Cart(ctx, x, y, T, N, P);
  else if (ch === 't' || ch === 'o') drawFeature(ctx, ch, x, y, T, N, 'vathar', tileMap);
  else exitArrow(ctx, ch, px, py, T);
}
/* a floating bridge: planks lashed across boats and barrels, a rope rail, the river sliding under it */
function b2Bridge(ctx, x, y, T, N, P, flowH){
  const px = x*T, py = y*T, isB = c => c === 'b', land = c => c && !b2VW(c);
  const nb = (dx, dy) => b2Tile(x + dx, y + dy);
  const run = (dx, dy) => { let n = 0; for (let k=1;k<=5 && isB(nb(dx*k, dy*k));k++) n++; return n; }, rv = run(0,-1) + run(0,1), rh = run(-1,0) + run(1,0);
  const vs = (isB(nb(0,-1)) || land(nb(0,-1)) ? 1 : 0) + (isB(nb(0,1)) || land(nb(0,1)) ? 1 : 0), hs = (isB(nb(-1,0)) || land(nb(-1,0)) ? 1 : 0) + (isB(nb(1,0)) || land(nb(1,0)) ? 1 : 0);
  const vert = rv !== rh ? rv > rh : vs !== hs ? vs > hs : !flowH; // the bridge runs the long way of its own planks, else across the river
  ctx.save(); if (!vert) { ctx.translate(px + T/2, py + T/2); ctx.rotate(Math.PI/2); ctx.translate(-px - T/2, -py - T/2); } // draw it running up the screen; turn it if it runs across
  const eL = vert ? !isB(nb(-1,0)) : !isB(nb(0,-1)), eR = vert ? !isB(nb(1,0)) : !isB(nb(0,1)); // open sides
  const x0 = px + (eL ? T*.14 : 0), x1 = px + T - (eR ? T*.14 : 0);
  ctx.fillStyle = N ? 'rgba(0,0,0,.5)' : 'rgba(20,24,18,.45)'; ctx.fillRect(x0 + T*.05, py, x1 - x0, T); // its shadow on the water
  for (let i=0;i<2;i++){ const by = py + T*(.25 + i*.5); [[eL, x0 - T*.06], [eR, x1 + T*.06]].forEach(([e, bx]) => { if (!e) return; ell(ctx, bx, by, T*.08, T*.16, N ? '#1a1612' : P.wood); ell(ctx, bx - T*.02, by - T*.05, T*.04, T*.06, N ? '#2a241e' : P.woodL); ctx.fillStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(30,22,12,.5)'; ctx.fillRect(bx - T*.08, by - T*.01, T*.16, Math.max(1, T*.02)); }); } // barrels and boats under it, at the sides
  const n = 6, pw = T/n; for (let i=0;i<n;i++){ const wy = y*n + i, k = hash(x, wy, 7), gone = hash(x, wy, 8) < .05, xe = gone ? lerp(x0, x1, .35 + hash(x, wy, 13)*.3) : x1 + T*.02; // the planks, laid across, one here and there broken short
    const yy = py + i*pw, skew = (hash(x, wy, 9) - .5)*T*.04; ctx.fillStyle = shade(P.plank, (k - .5)*.2); ctx.beginPath(); ctx.moveTo(x0 - T*.02, yy + .6 + skew); ctx.lineTo(xe, yy + .6 - skew); ctx.lineTo(xe - (gone ? T*.05 : 0), yy + pw - .6 - skew); ctx.lineTo(x0 - T*.02, yy + pw - .6 + skew); ctx.closePath(); ctx.fill();
    ctx.fillStyle = N ? 'rgba(150,160,200,.06)' : 'rgba(255,246,220,.2)'; ctx.fillRect(x0, yy + .6 + skew, x1 - x0, Math.max(1, pw*.18)); // its lit edge
    ctx.fillStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(60,44,26,.3)'; ctx.fillRect(x0 + (x1 - x0)*hash(x, wy, 10), yy + pw*.4, (x1 - x0)*.2, 1); // grain
    if (hash(x, wy, 11) > .7) { ctx.fillStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(60,44,26,.35)'; ell(ctx, x0 + (x1 - x0)*(.2 + hash(x, wy, 12)*.6), yy + pw*.5, T*.08, pw*.3, ctx.fillStyle); } } // wet where the river came over
  ctx.fillStyle = N ? 'rgba(0,0,0,.35)' : 'rgba(30,22,12,.4)'; ctx.fillRect(x0 + (x1 - x0)*.3, py, Math.max(1, T*.03), T); ctx.fillRect(x0 + (x1 - x0)*.7, py, Math.max(1, T*.03), T); // the stringers' nail-lines
  [[eL, x0 + T*.03], [eR, x1 - T*.03]].forEach(([e, rx]) => { if (!e) return; ctx.fillStyle = N ? '#1a1612' : P.plankD; ctx.fillRect(rx - T*.03, py + T*.3, T*.06, T*.1); ctx.fillRect(rx - T*.03, py + T*.8, T*.06, T*.1); // posts
    ctx.strokeStyle = P.rope; ctx.lineWidth = Math.max(1, T*.025); ctx.beginPath(); ctx.moveTo(rx, py - T*.05); ctx.quadraticCurveTo(rx + (rx < px + T/2 ? -1 : 1)*T*.03, py + T*.6, rx, py + T*1.05); ctx.stroke(); }); // the rope rail, sagging
  ctx.restore(); }
/* a drowned tree, standing in the river: bleached, bare, the current parting round it; a crow sometimes */
function b2Drowned(ctx, x, y, T, N, P, wet){ const px = x*T, py = y*T, cx = px + T*(.42 + hash(x,y,20)*.16), cy = py + T*.84, lean = (hash(x,y,21) - .5)*.5;
  if (wet) { ctx.strokeStyle = P.glint; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, T*.16, T*.05, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx + T*.1, cy, T*.26, T*.08, 0, -1.2, 1.2); ctx.stroke(); } // the water round its foot
  ctx.strokeStyle = N ? 'rgba(0,0,0,.35)' : 'rgba(30,36,28,.3)'; ctx.lineWidth = Math.max(1.4, T*.06); ctx.beginPath(); ctx.moveTo(cx + T*.04, cy + T*.03); ctx.lineTo(cx + T*.42, cy + T*.16); ctx.stroke(); // its shadow on the water
  const br = (x0, y0, a, len, w, d) => { const x1 = x0 + Math.cos(a)*len, y1 = y0 + Math.sin(a)*len; ctx.strokeStyle = P.tree; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(70,60,44,.5)'; ctx.lineWidth = w*.4; ctx.beginPath(); ctx.moveTo(x0 + w*.3, y0); ctx.lineTo(x1 + w*.3, y1); ctx.stroke();
    if (d > 0) { br(x1, y1, a - .5 - hash(x, y, d*3)*.3, len*.62, w*.62, d - 1); br(x1, y1, a + .45 + hash(y, x, d*3)*.3, len*.55, w*.58, d - 1); } };
  ctx.strokeStyle = P.treeD; ctx.lineWidth = Math.max(1, T*.03); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - T*.04, cy - T*.02); ctx.quadraticCurveTo(cx - T*.14, cy - T*.04, cx - T*.18, cy + T*.03); ctx.moveTo(cx + T*.04, cy - T*.02); ctx.quadraticCurveTo(cx + T*.14, cy - T*.05, cx + T*.2, cy + T*.02); ctx.stroke(); // roots, out of the water
  br(cx, cy, -Math.PI/2 + lean, T*.36, Math.max(2, T*.1), 2); ctx.lineCap = 'butt';
  ctx.fillStyle = N ? 'rgba(20,20,24,.5)' : 'rgba(110,96,70,.45)'; ctx.fillRect(cx - T*.055, cy - T*.14, T*.11, T*.05); // the flood-line, a band of silt on the bark
  if (hash(x, y, 22) > .45) { const bx = cx + Math.cos(-Math.PI/2 + lean)*T*.36, by = cy + Math.sin(-Math.PI/2 + lean)*T*.36 - T*.02; ell(ctx, bx, by - T*.03, T*.045, T*.035, '#0c0a0a'); ell(ctx, bx + T*.035, by - T*.06, T*.022, T*.02, '#0c0a0a'); poly(ctx, [[bx + T*.05, by - T*.065],[bx + T*.08, by - T*.055],[bx + T*.05, by - T*.05]], '#1e1a18'); poly(ctx, [[bx - T*.04, by - T*.03],[bx - T*.09, by - T*.01],[bx - T*.04, by - T*.005]], '#0c0a0a'); } } // a crow, waiting
/* arrows standing in the mud, all leaning the one way: they came from the bridges */
function b2Arrows(ctx, x, y, T, N, P){ const px = x*T, py = y*T, n = 2 + Math.floor(hash(x, y, 40)*3);
  for (let i=0;i<n;i++){ const ax = px + T*(.15 + hash(x,y,i+41)*.7), ay = py + T*(.4 + hash(y,x,i+42)*.5), a = -.5 - hash(x,y,i+43)*.25, l = T*(.22 + hash(x,y,i+44)*.08), ex = ax + Math.sin(a)*l, ey = ay - Math.cos(a)*l;
    ell(ctx, ax, ay, T*.03, T*.012, N ? 'rgba(0,0,0,.4)' : 'rgba(40,28,16,.45)'); ctx.strokeStyle = N ? 'rgba(0,0,0,.3)' : 'rgba(40,28,16,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + l*.5, ay + l*.15); ctx.stroke(); // its hole, its shadow
    B2F.line(ctx, P.shaft, Math.max(1, T*.022), [[ax, ay], [ex, ey]]); poly(ctx, [[ex, ey],[ex - T*.05, ey + T*.01],[ex - T*.02, ey + T*.05]], P.fl); poly(ctx, [[ex + T*.012, ey + T*.012],[ex + T*.03, ey + T*.07],[ex - T*.004, ey + T*.05]], shade(P.fl, -.2)); } } // the fletching
/* what people drop when they run: a sandal, a bundle come undone, a smashed jar, a shawl */
function b2Dropped(ctx, x, y, T, N, P, k){ const px = x*T, py = y*T, cx = px + T*(.3 + hash(x,y,50)*.4), cy = py + T*(.35 + hash(y,x,51)*.4), r = hash(x,y,52)*3;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(r); ell(ctx, T*.03, T*.04, T*.16, T*.07, N ? 'rgba(0,0,0,.35)' : 'rgba(40,28,16,.3)');
  if (k === 0) { ell(ctx, 0, 0, T*.1, T*.04, N ? '#2a2018' : '#6a4a2a'); ctx.strokeStyle = N ? '#3a3028' : '#8a6a40'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-T*.04, -T*.04); ctx.lineTo(T*.02, T*.05); ctx.moveTo(T*.03, -T*.04); ctx.lineTo(T*.06, T*.05); ctx.stroke(); } // a sandal
  else if (k === 1) { ell(ctx, 0, 0, T*.14, T*.09, P.cloth); ell(ctx, -T*.03, -T*.03, T*.08, T*.04, N ? 'rgba(150,160,200,.06)' : 'rgba(255,250,236,.3)'); ctx.fillStyle = P.clothD; ctx.fillRect(-T*.02, -T*.1, T*.05, T*.06); ell(ctx, T*.16, T*.06, T*.05, T*.03, N ? '#2a2620' : '#7a6a50'); ell(ctx, T*.2, -T*.02, T*.03, T*.02, N ? '#2a2620' : '#9a8a6a'); } // a bundle, undone
  else if (k === 2) { const c = N ? '#3a3028' : '#a0603a'; poly(ctx, [[-T*.1,-T*.02],[-T*.02,-T*.06],[0,T*.02],[-T*.08,T*.04]], c); poly(ctx, [[T*.02,-T*.04],[T*.1,-T*.02],[T*.08,T*.05],[T*.03,T*.02]], shade(c, -.15)); ell(ctx, T*.13, T*.08, T*.03, T*.02, c); ell(ctx, -T*.03, T*.09, T*.02, T*.015, c); } // a jar, smashed
  else { ctx.fillStyle = N ? '#2a2a34' : b2Pick({phase:x + y}, ['#6a3a4a', '#3a4a6a', '#7a5a2a']); ctx.beginPath(); ctx.moveTo(-T*.16, -T*.04); ctx.quadraticCurveTo(-T*.02, -T*.12, T*.14, -T*.02); ctx.quadraticCurveTo(T*.04, T*.04, T*.12, T*.1); ctx.quadraticCurveTo(-T*.04, T*.06, -T*.16, -T*.04); ctx.fill(); ctx.fillStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(60,40,24,.35)'; ctx.fillRect(-T*.1, 0, T*.18, T*.03); } // a shawl, trodden in
  ctx.restore(); }
/* a wagon over on its back in the mud: the bed's underside and axles toward the sky, the wheels in the air, the canvas crushed out from under it */
function b2Overturned(ctx, x, y, T, N, P){ const px = x*T, py = y*T;
  ell(ctx, px + T*.54, py + T*.82, T*.5, T*.12, N ? 'rgba(0,0,0,.45)' : 'rgba(40,28,16,.4)');
  ctx.fillStyle = P.cloth; ctx.beginPath(); ctx.moveTo(px + T*.04, py + T*.8); ctx.quadraticCurveTo(px + T*.2, py + T*.96, px + T*.5, py + T*.92); ctx.quadraticCurveTo(px + T*.8, py + T*.98, px + T*.98, py + T*.84); ctx.lineTo(px + T*.9, py + T*.72); ctx.lineTo(px + T*.1, py + T*.72); ctx.closePath(); ctx.fill(); // the canvas, flattened out under it
  ctx.strokeStyle = N ? 'rgba(0,0,0,.35)' : 'rgba(90,70,44,.45)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i=0;i<3;i++){ ctx.moveTo(px + T*(.2 + i*.28), py + T*.74); ctx.lineTo(px + T*(.16 + i*.3), py + T*.92); } ctx.stroke(); // a broken hoop poking through
  ctx.fillStyle = N ? '#1e1610' : P.wood; ctx.fillRect(px + T*.1, py + T*.5, T*.8, T*.24); ctx.fillStyle = N ? 'rgba(0,0,0,.35)' : 'rgba(30,20,10,.4)'; ctx.fillRect(px + T*.1, py + T*.66, T*.8, T*.08); // the bed, upside down: its side
  ctx.fillStyle = N ? '#2a2018' : P.woodL; ctx.fillRect(px + T*.1, py + T*.44, T*.8, T*.08); ctx.fillStyle = N ? 'rgba(150,160,200,.06)' : 'rgba(255,246,220,.22)'; ctx.fillRect(px + T*.1, py + T*.44, T*.8, T*.025); // its floor, now its top
  ctx.fillStyle = N ? '#120c08' : P.plankD; ctx.fillRect(px + T*.2, py + T*.4, T*.06, T*.1); ctx.fillRect(px + T*.74, py + T*.4, T*.06, T*.1); // the axle-blocks
  [[.23, 1], [.77, 0]].forEach(([k, ok]) => { const wx = px + T*k, wy = py + T*.28, r = T*.17; ctx.strokeStyle = N ? '#3a3028' : P.woodL; ctx.lineWidth = Math.max(1.4, T*.045); ctx.beginPath(); ctx.arc(wx, wy, r, ok ? 0 : .9, ok ? 7 : 6.6); ctx.stroke(); // a wheel in the air (one with a bite out of its rim)
    ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(40,26,12,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(wx + 1, wy + 1, r, 0, 7); ctx.stroke();
    ctx.strokeStyle = N ? '#3a3028' : P.woodL; ctx.lineWidth = Math.max(1, T*.022); ctx.beginPath(); for (let i=0;i<4;i++){ const a = i*Math.PI/4 + .2; if (!ok && i === 1) continue; ctx.moveTo(wx - Math.cos(a)*r, wy - Math.sin(a)*r); ctx.lineTo(wx + Math.cos(a)*r, wy + Math.sin(a)*r); } ctx.stroke(); ell(ctx, wx, wy, T*.035, T*.035, N ? '#120c08' : '#2a1c10'); });
  ctx.strokeStyle = N ? '#2a2018' : P.wood; ctx.lineWidth = Math.max(1, T*.035); ctx.beginPath(); ctx.moveTo(px + T*.9, py + T*.62); ctx.lineTo(px + T*1.02, py + T*.5); ctx.stroke(); // the tongue, up at an angle
  ell(ctx, px + T*.06, py + T*.9, T*.06, T*.035, N ? '#2a2620' : '#7a6a50'); ell(ctx, px + T*.92, py + T*.94, T*.05, T*.03, N ? '#2a2620' : '#9a8460'); } // a sack, a bundle
/* a handcart, left: two wheels, shafts down in the mud, the load still roped on, a pot hanging */
function b2Cart(ctx, x, y, T, N, P){ const px = x*T, py = y*T;
  ell(ctx, px + T*.52, py + T*.82, T*.42, T*.1, N ? 'rgba(0,0,0,.45)' : 'rgba(40,28,16,.38)');
  ctx.strokeStyle = N ? '#2a2018' : P.wood; ctx.lineWidth = Math.max(1, T*.035); ctx.beginPath(); ctx.moveTo(px + T*.24, py + T*.6); ctx.lineTo(px + T*.02, py + T*.86); ctx.moveTo(px + T*.24, py + T*.68); ctx.lineTo(px + T*.06, py + T*.94); ctx.stroke(); // the shafts, down
  ctx.fillStyle = N ? '#2a2018' : P.wood; ctx.fillRect(px + T*.22, py + T*.48, T*.6, T*.2); ctx.fillStyle = N ? 'rgba(0,0,0,.35)' : 'rgba(30,20,10,.4)'; ctx.fillRect(px + T*.22, py + T*.62, T*.6, T*.06); // the bed
  ell(ctx, px + T*.44, py + T*.4, T*.17, T*.12, P.cloth); ell(ctx, px + T*.64, py + T*.42, T*.14, T*.1, N ? '#2e2a26' : '#9a8460'); ell(ctx, px + T*.38, py + T*.34, T*.08, T*.04, N ? 'rgba(150,160,200,.06)' : 'rgba(255,250,236,.3)'); // the load, under a cloth
  ctx.strokeStyle = N ? '#3a3028' : P.rope; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px + T*.3, py + T*.5); ctx.lineTo(px + T*.5, py + T*.28); ctx.lineTo(px + T*.74, py + T*.5); ctx.stroke(); // roped on
  ell(ctx, px + T*.84, py + T*.6, T*.05, T*.05, N ? '#1a1612' : '#3a3230'); ctx.strokeStyle = N ? '#3a3028' : P.rope; ctx.beginPath(); ctx.moveTo(px + T*.82, py + T*.5); ctx.lineTo(px + T*.84, py + T*.56); ctx.stroke(); // a pot hung off the back
  const wx = px + T*.52, wy = py + T*.72; ctx.strokeStyle = N ? '#3a3028' : P.woodL; ctx.lineWidth = Math.max(1.2, T*.04); ctx.beginPath(); ctx.arc(wx, wy, T*.15, 0, 7); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); for (let i=0;i<4;i++){ const a = i*Math.PI/4; ctx.moveTo(wx - Math.cos(a)*T*.15, wy - Math.sin(a)*T*.15); ctx.lineTo(wx + Math.cos(a)*T*.15, wy + Math.sin(a)*T*.15); } ctx.stroke(); ell(ctx, wx, wy, T*.03, T*.03, N ? '#120c08' : '#2a1c10'); } // the near wheel
TILEX.vathar = (ctx, ch, x, y, T, dark) => b2Clip(ctx, x, y, T, () => b2Vathar(ctx, ch, x, y, T, !!dark));

/* ---------------- backdrops: the crossing at noon, the Silanda in the mist, the evening after ---------------- */
/* a bird, far off: two bent strokes; f is the beat, -1..1 */
function b2Bird(x, cx, cy, s, f, col){ x.strokeStyle = col; x.lineWidth = Math.max(.8, s*.5); x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - 4*s, cy - f*2*s); x.quadraticCurveTo(cx - 1.6*s, cy - (1 + f)*1.2*s, cx, cy); x.quadraticCurveTo(cx + 1.6*s, cy - (1 + f)*1.2*s, cx + 4*s, cy - f*2*s); x.stroke(); x.lineCap = 'butt'; }
/* birds wheeling over a place: n of them on slow tilted circles, beating now and then */
function b2Wheel(ctx, t, cx, cy, rx, ry, n, s, col, seed){ for (let i=0;i<n;i++){ const sp = (hash(i, seed)*.5 + .5)*(i%2 ? 1 : -1), a = t/(5200 + hash(i, seed + 1)*3000)*sp*6.28 + hash(i, seed + 2)*6.28, r = .45 + hash(i, seed + 3)*.55;
  b2Bird(ctx, cx + Math.cos(a)*rx*r, cy + Math.sin(a)*ry*r - hash(i, seed + 4)*ry*.6, s*(.7 + hash(i, seed + 5)*.5), Math.sin(t/(160 + hash(i, seed + 6)*90) + i)*(Math.sin(t/1500 + i) > .2 ? 1 : .15), col); } }
/* smoke going up from a place and leaning off on the wind */
function b2Smoke(ctx, t, bx, by, hgt, w, col, a, seed, lean = 1){ for (let i=0;i<16;i++){ const k = ((t/(11000 + hash(seed, 1)*4000) + i/16) % 1), r = w*(.3 + k*1.4), sx = bx + k*k*hgt*.7*lean + Math.sin(t/2400 + i*1.7 + seed)*(2 + k*6); glow(ctx, sx, by - k*hgt, r, col, a*(1 - k*.7)); } }
/* a floating bridge in the distance, from (x0, y0) on the near bank to (x1, y1) on the far: pale deck, dark boats under it, a file of men on it */
function b2FarBridge(x, x0, y0, x1, y1, w0, w1, men, seed){
  const at = k => [lerp(x0, x1, k), lerp(y0, y1, k), lerp(w0, w1, k)];
  for (let i=0;i<=24;i++){ const [px, py, w] = at(i/24); x.fillStyle = 'rgba(30,26,20,.75)'; x.beginPath(); x.ellipse(px, py + w*.25, w*.9, w*.32, 0, 0, 7); x.fill(); } // the boats under it, nose to tail
  x.fillStyle = 'rgba(30,24,16,.35)'; x.beginPath(); { const a = at(0), b = at(1); x.moveTo(a[0] - a[2]*.7, a[1] + a[2]*.6); x.lineTo(b[0] - b[2]*.7, b[1] + b[2]*.6); x.lineTo(b[0] + b[2]*.9, b[1] + b[2]*.6); x.lineTo(a[0] + a[2]*.9, a[1] + a[2]*.6); x.fill(); } // its shadow
  x.fillStyle = '#b8a07a'; x.beginPath(); { const a = at(0), b = at(1); x.moveTo(a[0] - a[2]*.62, a[1]); x.lineTo(b[0] - b[2]*.62, b[1]); x.lineTo(b[0] + b[2]*.62, b[1]); x.lineTo(a[0] + a[2]*.62, a[1]); x.fill(); } // the deck
  x.strokeStyle = 'rgba(70,52,30,.45)'; x.lineWidth = .7; x.beginPath(); for (let i=1;i<30;i++){ const [px, py, w] = at(i/30); x.moveTo(px - w*.62, py); x.lineTo(px + w*.62, py); } x.stroke(); // planks
  for (let i=0;i<men;i++){ const k = .42 + Math.pow(hash(i, seed), .7)*.56, [px, py, w] = at(k), s = w*.13, ox = (hash(i, seed + 1) - .5)*w*.9, hh = 5.6*s; x.fillStyle = '#14100e'; x.fillRect(px + ox - s*.9, py - hh, s*1.8, hh); x.beginPath(); x.arc(px + ox, py - hh - s*.8, s*.85, 0, 7); x.fill(); // Dom's men, in file
    if (hash(i, seed + 2) > .4) { x.fillRect(px + ox + s*.5, py - hh - 9*s, Math.max(.5, s*.35), 9*s + hh*.6); } }
  for (let i=0;i<men*.6;i++){ const k = .02 + hash(i, seed + 3)*.3, [px, py, w] = at(k), s = w*.11, ox = (hash(i, seed + 4) - .5)*w*1.1, hh = (4.4 + hash(i, seed + 5)*1.4)*s; x.fillStyle = hash(i, seed + 6) > .5 ? '#3a2e26' : '#2a2226'; x.fillRect(px + ox - s*.9, py - hh, s*1.8, hh); x.beginPath(); x.arc(px + ox, py - hh - s*.8, s*.85, 0, 7); x.fill(); } } // and at the near end, the people who went out onto it // pikes, up

SCENEX.b2_vathar = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.3, r0 = H*.4, r1 = H*.74;
  ctx.drawImage(sceneLayer('b2:vathar', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#8a9aa6'],[.5,'#c8c8b8'],[1,'#ece0c0']]); x.fillRect(0, 0, W, hz + 2); glow(x, W*.58, 0, W*.5, '#fffaf0', .55); // noon, the sky white with heat
    for (let i=0;i<4;i++) cloud(x, W*(.1 + i*.27), hz*(.35 + (i%2)*.25), W*.3, 3, '#f4ecd8', .1);
    x.fillStyle = '#9a9078'; x.beginPath(); x.moveTo(0, hz + 4); for (let px=0;px<=W + 10;px+=10) x.lineTo(px, hz - Math.max(0, Math.sin(px/90 + 1))*7); x.lineTo(W, r0); x.lineTo(0, r0); x.fill(); // the far country, bleached
    x.fillStyle = '#6a5e48'; x.fillRect(0, r0 - 10, W, 10); x.fillStyle = '#3a3226'; x.fillRect(0, r0 - 3, W, 4); // the far bank, its cut face
    // the far bank black with men: a long dark mass, pikes over it like reeds, the green here and there
    for (let i=0;i<900;i++){ const px = hash(i, 11)*W, py = r0 - 6 - hash(i, 12)*16; x.fillStyle = `rgba(22,18,16,${.55 + hash(i, 13)*.45})`; x.fillRect(px, py - 2.4, 1.6, 3.4); if (hash(i, 14) > .55) x.fillRect(px + .5, py - 11 - hash(i, 15)*3, .5, 9); }
    x.fillStyle = 'rgba(22,18,16,.85)'; x.fillRect(0, r0 - 10, W, 5);
    for (let i=0;i<12;i++){ const px = W*(.04 + i*.083 + hash(i, 16)*.03), py = r0 - 26 - hash(i, 17)*5; x.fillStyle = '#14100e'; x.fillRect(px, py - 4, .8, 16); x.fillStyle = i%4 ? '#2e5a2a' : '#5a1a14'; x.fillRect(px + .8, py - 4, 5, 3); } // standards
    // the river: wide, brown, glaring
    x.fillStyle = vgrad(x, r0, r1, [[0,'#a89a7a'],[.25,'#8a7e62'],[.7,'#5e5a46'],[1,'#3a3a2e']]); x.fillRect(0, r0, W, r1 - r0);
    glow(x, W*.58, r0 + 14, W*.3, '#fff8e0', .35); for (let i=0;i<60;i++){ const yy = r0 + 3 + Math.pow(hash(i, 21), .8)*(r1 - r0 - 6), px = hash(i, 22)*W, l = 6 + hash(i, 23)*30*(yy - r0)/(r1 - r0); x.fillStyle = `rgba(255,248,226,${.08 + hash(i, 24)*.14})`; x.fillRect(px, yy, l, 1); } // the glare in streaks
    // three floating bridges, out from under our feet to the far bank; Dom's files on them
    b2FarBridge(x, W*.16, r1 + 2, W*.36, r0 - 1, 22, 5, 46, 30); b2FarBridge(x, W*.6, r1 + 2, W*.55, r0 - 1, 26, 5, 54, 40); b2FarBridge(x, W*.97, r1 + 2, W*.84, r0 - 1, 20, 4.4, 40, 50);
    // the near bank: the column pressed down to the water between the bridges, more of them than the bank will hold; some already in the shallows
    x.fillStyle = vgrad(x, r1 - 4, H, [[0,'#8a7658'],[.3,'#6a5840'],[.7,'#3e3022'],[1,'#1a140e']]); x.beginPath(); x.moveTo(0, H); x.lineTo(0, r1); for (let px=0;px<=W + 10;px+=12) x.lineTo(px, r1 - 1 + Math.sin(px/36)*2.4); x.lineTo(W, H); x.fill();
    x.fillStyle = 'rgba(255,240,210,.2)'; x.fillRect(0, r1 - 2, W, 1.2);
    b2Crowd(x, 220, i => { const cx = W*hash(i, 61), cy = r1 - 1 - Math.pow(hash(i, 62), 1.6)*24; return [cx, cy, .6 + (cy - r1 + 24)/24*.45]; }, 'rgba(40,32,26,.75)', 63, ['rgba(70,60,50,.8)', 'rgba(84,70,60,.8)', 'rgba(60,54,60,.8)']); // in the shallows, wading out toward nothing
    b2Crowd(x, 640, i => { const cx = W*hash(i, 71), cy = r1 + 4 + Math.pow(hash(i, 72), 1.9)*(H*.17); return [cx, cy, 1 + (cy - r1)/H*7]; }, 'rgba(30,24,18,.92)', 73, ['#4a3a2a', '#5a4a34', '#4a3434', '#3a3e48', '#6a5a40', '#5a4450']); // and packed on the bank behind them
    for (let i=0;i<14;i++){ const cx = W*hash(i, 81), cy = r1 + 8 + hash(i, 82)*H*.12, s = .7 + hash(i, 83)*.5; x.fillStyle = 'rgba(30,24,18,.9)'; x.fillRect(cx - 6*s, cy - 6*s, 12*s, 4*s); x.beginPath(); x.ellipse(cx, cy - 6*s, 6*s, 4.4*s, 0, Math.PI, 0); x.fill(); } // carts, left where they stood
    glow(x, W*.5, r1 + H*.06, W*.6, '#d8c8a0', .22); // the dust they raise
    x.fillStyle = 'rgba(20,16,12,.55)'; x.beginPath(); x.moveTo(0, H); x.lineTo(0, H*.86); x.quadraticCurveTo(W*.35, H*.82, W*.6, H*.87); x.quadraticCurveTo(W*.85, H*.9, W, H*.86); x.lineTo(W, H); x.fill(); // the rise we stand on
  }), 0, 0, W, H);
  if (mo) { const L = sceneLayer('b2:vathar', W, H, () => {}), dpr = L.width / W; for (let y=Math.floor(r0 - 30); y<r0 + 4; y+=2){ const off = Math.sin(t/160 + y*.8)*1.4*Math.sin((y - r0 + 30)/34*Math.PI); ctx.drawImage(L, 0, y*dpr, L.width, 2*dpr, off, y, W, 2); } } // heat over the far bank
  // the volleys: thin dark flecks rising off the bridges and the far bank and coming down on the near one, again and again
  ctx.lineCap = 'round'; for (let v=0;v<3;v++){ const sx = W*[.28, .52, .76][v], sy = r0 + 10, ex = W*[.18, .48, .86][v], ey = r1 + 8, k0 = ((t*mo/2600 + v*.37) % 1);
    for (let i=0;i<22;i++){ const k = (k0 + hash(i, v + 5)*.18) % 1, ax = lerp(sx, ex, k) + (hash(i, v + 6) - .5)*W*.12, ay = lerp(sy, ey, k) - Math.sin(k*Math.PI)*H*.22 + (hash(i, v + 7) - .5)*8, dy = Math.cos(k*Math.PI); ctx.strokeStyle = `rgba(26,20,18,${.6*Math.sin(k*Math.PI) + .15})`; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - (ex - sx)/W*6 - 2, ay + dy*5); ctx.stroke(); } }
  ctx.lineCap = 'butt';
  for (let i=0;i<4;i++) b2Smoke(ctx, t*mo, W*(.16 + i*.24 + hash(i, 91)*.06), r1 + 6, H*.36, 14, i%2 ? '#5a4e42' : '#7a6e5a', .3, i, -1); // dust and smoke off the bank, going up into the white
  b2Wheel(ctx, t*mo, W*.5, H*.14, W*.36, H*.08, 14, 1, 'rgba(30,26,24,.7)', 7); // and the birds, already
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.58, 0, W*.7, '#fffbe8', .12); ctx.globalCompositeOperation = 'source-over';
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.06 + i*Math.min(32, W*.45/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, .5, .5); };

SCENEX.b2_silanda = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.46, sx = W*.6, sy = H*.62, k = H/240, row = t*mo/1400;
  ctx.drawImage(sceneLayer('b2:silanda', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#3a403e'],[.6,'#6a706a'],[1,'#8a8e86']]); x.fillRect(0, 0, W, hz + 2); glow(x, W*.3, hz*.3, W*.4, '#c8ccc0', .18); // a white-grey day, the sun a smear
    x.fillStyle = 'rgba(70,74,70,.6)'; x.beginPath(); x.moveTo(0, hz); for (let px=0;px<=W + 10;px+=10) x.lineTo(px, hz - 3 - Math.max(0, Math.sin(px/60 + 3))*5); x.lineTo(W, hz + 3); x.lineTo(0, hz + 3); x.fill(); // the far bank, lost in it
    x.fillStyle = vgrad(x, hz, H, [[0,'#7a7e78'],[.3,'#4a524e'],[1,'#1a201e']]); x.fillRect(0, hz + 2, W, H); // the river, flat and grey
    for (let i=0;i<40;i++){ const yy = hz + 4 + Math.pow(hash(i, 21), .8)*(H*.4), px = hash(i, 22)*W, l = 10 + hash(i, 23)*40*(yy - hz)/H; x.fillStyle = `rgba(200,206,200,${.05 + hash(i, 24)*.08})`; x.fillRect(px, yy, l, 1); }
    x.fillStyle = 'rgba(20,24,22,.85)'; x.beginPath(); x.moveTo(0, H); x.lineTo(0, H*.8); x.quadraticCurveTo(W*.2, H*.76, W*.36, H*.84); x.quadraticCurveTo(W*.44, H*.9, W*.48, H); x.fill(); // the near bank, reeds on it
    x.strokeStyle = 'rgba(20,24,22,.9)'; x.lineWidth = 1.2; for (let i=0;i<40;i++){ const px = hash(i, 31)*W*.42, py = H*.8 + hash(i, 32)*12, l = 12 + hash(i, 33)*18, a = (hash(i, 34) - .5)*.5; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + a*6, py - l*.6, px + a*14, py - l); x.stroke(); }
  }), 0, 0, W, H);
  // the ship: long, low, burned to the waterline and floating anyway; no sail, a stump of mast; the dark that came with it clinging round it
  const bob = Math.sin(t*mo/1800)*1.2*k, L = 150*k, hh = 15*k; ctx.save(); ctx.translate(sx, sy + bob);
  ctx.fillStyle = 'rgba(10,12,12,.35)'; ctx.beginPath(); ctx.ellipse(0, hh*.4, L*.62, hh*.7, 0, 0, 7); ctx.fill(); // its reflection, dark
  for (let i=0;i<10;i++){ const a = t*mo/3000 + i*.8; glow(ctx, Math.cos(a)*L*.5, -hh*.8 + Math.sin(a*1.3)*hh*.9, 26*k, '#060808', .32); } // shadow, moving about it like breath
  const hull = () => { ctx.beginPath(); ctx.moveTo(-L*.52, -hh*1.1); ctx.quadraticCurveTo(-L*.46, hh*.5, -L*.3, hh*.55); ctx.lineTo(L*.34, hh*.55); ctx.quadraticCurveTo(L*.5, hh*.3, L*.56, -hh*1.5); ctx.lineTo(L*.48, -hh*.9); ctx.lineTo(-L*.44, -hh*.75); ctx.closePath(); };
  hull(); ctx.fillStyle = vgrad(ctx, -hh*1.5, hh*.6, [[0,'#2a2624'],[.5,'#141210'],[1,'#060606']]); ctx.fill(); ctx.save(); hull(); ctx.clip();
  ctx.strokeStyle = 'rgba(70,64,58,.5)'; ctx.lineWidth = .8; for (let i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(-L*.5, -hh*.6 + i*hh*.32); ctx.quadraticCurveTo(0, -hh*.4 + i*hh*.3, L*.54, -hh*.9 + i*hh*.34); ctx.stroke(); } // the strakes, charred
  ctx.fillStyle = 'rgba(0,0,0,.6)'; for (let i=0;i<9;i++){ const px = -L*.4 + i*L*.1 + hash(i, 3)*8, py = -hh*.2 + hash(i, 4)*hh*.5; ctx.beginPath(); ctx.ellipse(px, py, 3*k + hash(i, 5)*3*k, 1.4*k, 0, 0, 7); ctx.fill(); } // burned through, here and there
  ctx.fillStyle = 'rgba(110,100,90,.25)'; for (let i=0;i<40;i++) ctx.fillRect(-L*.48 + hash(i, 6)*L, -hh + hash(i, 7)*hh*1.4, 1.2, .8); // ash, flaking
  ctx.restore();
  ctx.fillStyle = '#100e0c'; ctx.fillRect(-L*.44, -hh*.95, L*.9, 1.6*k); for (let i=0;i<16;i++){ const px = -L*.4 + i*L*.055; if (hash(i, 8) > .3) ctx.fillRect(px, -hh*.95 - (2 + hash(i, 9)*3)*k, 1*k, (2 + hash(i, 9)*3)*k); } // the rail, burned to stubs
  poly(ctx, [[-L*.06, -hh*.9],[-L*.06 + 3*k, -hh*.9],[-L*.06 + 5*k, -hh*.9 - 22*k],[-L*.06 + 3.4*k, -hh*.9 - 27*k],[-L*.06 + 2.6*k, -hh*.9 - 21*k],[-L*.06 + 1*k, -hh*.9 - 25*k]], '#0c0a0a'); B2F.line(ctx, '#0c0a0a', 1.4*k, [[-L*.06 + 3*k, -hh*.9 - 14*k], [L*.12, -hh*.9 - 2*k]], 'butt'); // the mast, snapped off jagged; its yard fallen across the deck
  // the rowers: a row of bent backs behind the rail, black on black, all of them moving as one; nothing above the shoulders that the eye will settle on
  const ph = Math.sin(row*6.28); for (let i=0;i<11;i++){ const px = -L*.36 + i*L*.068; ctx.fillStyle = 'rgba(4,4,6,.7)'; ctx.beginPath(); ctx.ellipse(px + ph*1.4*k, -hh*.98, 3*k, 2*k, -.3 + ph*.25, Math.PI, 0); ctx.fill(); }
  ctx.strokeStyle = 'rgba(30,28,26,.95)'; ctx.lineWidth = 1.2*k; ctx.lineCap = 'round'; for (let i=0;i<11;i++){ const px = -L*.36 + i*L*.068, a = .5 + ph*.35; ctx.beginPath(); ctx.moveTo(px, -hh*.3); ctx.lineTo(px - Math.cos(a)*22*k, -hh*.3 + Math.sin(a)*26*k); ctx.stroke(); } ctx.lineCap = 'butt'; // the oars, together
  for (let i=0;i<11;i++){ const px = -L*.36 + i*L*.068 - Math.cos(.5 + ph*.35)*22*k, py = -hh*.3 + Math.sin(.5 + ph*.35)*26*k; if (ph > 0) ell(ctx, px, py, 3*k, .8*k, 'rgba(200,206,200,.25)'); } // where they bite
  // three on the deck aft, small, catching what light there is: gold
  [[L*.32, 1.15], [L*.38, .9], [L*.42, .8]].forEach(([px, s], i) => { const fy = -hh*.95, w = 2.4*k*s, hgt = 8*k*s; ctx.fillStyle = '#1a1612'; ctx.fillRect(px - w/2, fy - hgt, w, hgt); ctx.beginPath(); ctx.arc(px, fy - hgt - 1.4*k*s, 1.4*k*s, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(230,190,90,.7)'; ctx.fillRect(px - w/2, fy - hgt - 2*k*s, w*.4, 1.6*k*s); ell(ctx, px - .6*k, fy - hgt - 1.8*k*s, .6*k*s, .7*k*s, 'rgba(255,220,130,.8)'); if (i === 0) { ctx.fillStyle = 'rgba(176,56,30,.8)'; ctx.fillRect(px - w/2, fy - hgt + .4*k, w, 2*k); } }); // Stormy's red beard, the biggest of them
  ctx.restore();
  for (let i=0;i<3;i++){ const kk = ((t*mo/4000 + i/3) % 1); ctx.strokeStyle = `rgba(200,206,200,${.18*(1 - kk)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx + L*.56, sy + bob + 2); ctx.quadraticCurveTo(sx + L*.6 + kk*40, sy + 6 + kk*10, sx + L*.66 + kk*70, sy + 4 + kk*18); ctx.stroke(); } // the wake, off the bow
  for (let i=0;i<7;i++){ const kk = ((t*mo/24000 + i/7) % 1); ell(ctx, (kk*1.5 - .25)*W, hz + 6 + (i%4)*H*.08, W*.3, 6 + (i%3)*4, `rgba(200,204,198,${.2*Math.sin(kk*Math.PI)})`); } // mist on the water, crossing in front of it
  glow(ctx, W*.5, hz, W*.6, '#b8bcb4', .14);
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.06 + i*Math.min(30, W*.38/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  ctx.fillStyle = 'rgba(160,166,160,.12)'; ctx.fillRect(0, 0, W, H); // the mist, on everything
  vign(ctx, W, H, .7, .5); };

SCENEX.b2_after = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.42, r0 = H*.5, r1 = H*.7;
  const road = k => k < .55 ? [lerp(W*1.04, W*.38, k/.55), lerp(H*.8, r1 + 3, Math.pow(k/.55, .8))] : [lerp(W*.38, W*.04, (k - .55)/.45), lerp(r1 + 3, hz + 2, Math.pow((k - .55)/.45, .6))]; // the line of the living, along the near bank and up over the rise, away
  ctx.drawImage(sceneLayer('b2:after', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#1a1426'],[.4,'#4a2632'],[.75,'#a0482e'],[1,'#e08a48']]); x.fillRect(0, 0, W, hz + 2); glow(x, W*.64, hz, W*.45, '#ffa860', .4); ell(x, W*.64, hz - 2, 10, 7, '#ffd8a0'); // dusk, the sun going down red into the smoke
    for (let i=0;i<5;i++) cloud(x, W*(.1 + i*.22), hz*(.3 + (i%3)*.18), W*.35, 3, i%2 ? '#6a2a2a' : '#2a1a24', .22);
    x.fillStyle = '#2a1a1c'; x.beginPath(); x.moveTo(0, hz + 2); for (let px=0;px<=W + 10;px+=10) x.lineTo(px, hz - 1 - Math.max(0, Math.sin(px/80 + 2))*8); x.lineTo(W, r0); x.lineTo(0, r0); x.fill(); // the far bank, empty now, black
    x.fillStyle = '#140c0e'; x.fillRect(0, r0 - 4, W, 5); for (let i=0;i<160;i++){ const px = hash(i, 11)*W, py = r0 - 4 - hash(i, 12)*5; x.fillStyle = `rgba(12,8,10,${.5 + hash(i, 13)*.5})`; x.fillRect(px, py, 2 + hash(i, 14)*3, 1.4); } // what is left along it: low shapes, not looked at
    for (let i=0;i<5;i++){ const fx = W*(.3 + i*.14 + hash(i, 15)*.05), fy = r0 - 6; glow(x, fx, fy, 9, '#ff7030', .45); x.fillStyle = '#ffb060'; x.fillRect(fx - .6, fy - 1.2, 1.4, 1.4); } // Dom's fires, over there
    x.fillStyle = vgrad(x, r0, r1, [[0,'#6a3a30'],[.2,'#a0583a'],[.55,'#3a2a2e'],[1,'#141218']]); x.fillRect(0, r0, W, r1 - r0); // the river, holding the sky
    glow(x, W*.64, r0 + 6, W*.25, '#ffa860', .35); x.fillStyle = 'rgba(255,190,130,.25)'; for (let i=0;i<9;i++) x.fillRect(W*.64 - 14 + hash(i, 25)*10 - i*.6, r0 + 4 + i*4, 18 - i*1.2 + hash(i, 26)*8, 1.2); // the sun's road on the water for (let i=0;i<46;i++){ const yy = r0 + 3 + Math.pow(hash(i, 21), .8)*(r1 - r0 - 6), px = hash(i, 22)*W, l = 8 + hash(i, 23)*28*(yy - r0)/(r1 - r0); x.fillStyle = `rgba(${yy < r0 + 18 ? '255,190,130' : '200,170,170'},${.06 + hash(i, 24)*.1})`; x.fillRect(px, yy, l, 1); }
    // the bridges, cut loose: pieces of them swung round on the current, a line of boats with nothing on them
    [[W*.32, r0 + 14, 70, .2], [W*.62, r0 + 30, 90, -.12], [W*.86, r0 + 10, 40, .3]].forEach(([cx, cy, l, a], j) => { x.save(); x.translate(cx, cy); x.rotate(a); for (let i=0;i<9;i++){ x.fillStyle = 'rgba(16,10,10,.85)'; x.beginPath(); x.ellipse(-l/2 + i*l/8, 1.6, 4.4, 1.8, 0, 0, 7); x.fill(); } x.fillStyle = '#2a1a16'; x.fillRect(-l/2, -1.4, l, 2.2); if (j === 1) { x.fillStyle = '#140c0c'; x.fillRect(l*.2, -1.4, 4, 2.2); } x.fillStyle = 'rgba(255,170,110,.2)'; x.fillRect(-l/2, -1.4, l, .6); x.restore(); });
    for (let i=0;i<10;i++){ const px = hash(i, 41)*W, py = r0 + 8 + hash(i, 42)*(r1 - r0 - 14); x.fillStyle = 'rgba(16,10,12,.6)'; x.fillRect(px, py, 3 + hash(i, 43)*5, 1.2); } // things in the water, drifting; too far to say what
    // the near bank, and the road up it
    x.fillStyle = vgrad(x, r1 - 4, H, [[0,'#4a2e28'],[.35,'#2a1c1a'],[1,'#080606']]); x.beginPath(); x.moveTo(0, H); x.lineTo(0, r1); for (let px=0;px<=W + 10;px+=12) x.lineTo(px, r1 - 1 + Math.sin(px/40)*2.4); x.lineTo(W, H); x.fill();
    x.fillStyle = 'rgba(255,170,110,.14)'; x.fillRect(0, r1 - 2, W, 1.2);
    x.fillStyle = vgrad(x, hz, r1, [[0,'#24181a'],[1,'#1a1214']]); x.beginPath(); x.moveTo(0, hz + 4); x.quadraticCurveTo(W*.1, hz - 2, W*.2, hz + 10); x.quadraticCurveTo(W*.3, hz + 22, W*.42, r1 - 2); x.lineTo(0, r1); x.fill(); x.fillStyle = 'rgba(255,170,110,.14)'; x.beginPath(); x.moveTo(0, hz + 4); x.quadraticCurveTo(W*.1, hz - 2, W*.2, hz + 10); x.lineTo(W*.2, hz + 12); x.quadraticCurveTo(W*.1, hz, 0, hz + 6); x.fill(); // the rise on this side, upriver, where the road goes; the last light on its back
    for (let i=0;i<8;i++){ const cx = W*(.5 + hash(i, 51)*.46), cy = r1 + 10 + hash(i, 52)*H*.1, s = .8 + hash(i, 53)*.4; x.fillStyle = '#0e0a0a'; x.strokeStyle = '#0e0a0a'; x.lineWidth = 1.2*s; x.save(); x.translate(cx, cy); x.rotate((hash(i, 54) - .5)*.5); x.fillRect(-7*s, -3.4*s, 14*s, 3.4*s); x.beginPath(); x.arc(-4*s, -6*s, 3.2*s, 0, 7); x.moveTo(-4*s, -9.2*s); x.lineTo(-4*s, -2.8*s); x.stroke(); x.restore(); } // carts, over on their sides
    b2Column(x, W, H, k => road(k), 170, '#060404', null); // the living, walking on
    for (let i=0;i<5;i++){ const [px, py] = road(.08 + i*.2), s = 1 - i*.17; x.fillStyle = '#0a0606'; x.fillRect(px + 5*s, py - 18*s, .8, 16*s); x.fillStyle = i%2 ? '#3a2a24' : '#4a1a14'; x.fillRect(px + 5.8*s, py - 18*s, 4.6*s, 2.4*s); } // a few standards still up
  }), 0, 0, W, H);
  for (let i=0;i<4;i++) b2Smoke(ctx, t*mo, W*(.34 + i*.17 + hash(i, 61)*.04), r0 - 6, H*.42, 10, i%2 ? '#1a1012' : '#2a1a1a', .38, i + 3, -.8); // smoke off the far bank, going over
  b2Smoke(ctx, t*mo, W*.72, r1 + 12, H*.5, 12, '#1a1212', .3, 9, -.8); // and off a cart burning on this side
  ctx.globalCompositeOperation = 'lighter'; for (let i=0;i<8;i++){ const kk = ((t*mo/(3600 + hash(i, 71)*2000) + hash(i, 72)) % 1), px = hash(i, 73)*W + kk*16, py = r0 + 6 + hash(i, 74)*(r1 - r0 - 10); ctx.fillStyle = `rgba(255,180,120,${.2*Math.sin(kk*Math.PI)})`; ctx.fillRect(px, py, 6 + hash(i, 75)*10, 1); } ctx.globalCompositeOperation = 'source-over'; // the light moving on the water
  b2Wheel(ctx, t*mo, W*.6, H*.3, W*.28, H*.1, 22, 1.1, 'rgba(14,8,10,.85)', 3); b2Wheel(ctx, t*mo, W*.84, H*.36, W*.14, H*.06, 9, .8, 'rgba(14,8,10,.7)', 11); // crows, in their hundreds, coming down
  for (let i=0;i<16;i++){ const px = W*(.28 + hash(i, 81)*.7), py = r0 - 5 - hash(i, 82)*3, hop = mo && hash(i, 83) > .7 ? Math.max(0, Math.sin(t/300 + i*2))*1.6 : 0; ctx.fillStyle = '#0a0608'; ctx.beginPath(); ctx.ellipse(px, py - hop, 1.4, .9, 0, 0, 7); ctx.fill(); ctx.fillRect(px + .8, py - 1.6 - hop, .9, .9); } // and on the far bank, already down
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.08 + i*Math.min(32, W*.45/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  ctx.fillStyle = 'rgba(30,10,14,.3)'; ctx.fillRect(0, H*.72, W, H*.28); // the dusk, on their backs
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.6, H*.8, W*.4, '#ff8040', .06); ctx.globalCompositeOperation = 'source-over';
  vign(ctx, W, H, .75, .5); };
