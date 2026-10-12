/* ============ Book Two art: figures, portraits, ground and backdrops for Deadhouse Gates ============ */
/* Everything Book Two draws that Book One does not: the new squad and the people of the Chain (FIGX, 18), the squad's painted busts
   (POR, 19), the ground of Hissar and the Odhan (TILEX, 25) and the backdrops for talk nodes (SCENEX, 23).
   Same rules as Book One: lantern low on the left, the squadmate's own colour as a rim on the right; dust, ash, and not much light. */

/* ---------------- figures: FIGX[kind](ctx, h, t, o), in the ~32px frame drawFigure has already translated, scaled and set bobbing ---------------- */
const B2F = {
  grow(ctx, sx, sy){ ctx.translate(0, 13); ctx.scale(sx, sy); ctx.translate(0, -13); }, // bigger or smaller about the feet
  cap(ctx, c, r = 4.8, y = -12.5, a0 = 1, a1 = 2){ ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, y, r, Math.PI*a0, Math.PI*a1); ctx.fill(); }, // hair over the crown
  braids(ctx, c, len = 9, y = -13){ ctx.fillStyle = c; ctx.fillRect(-5.5, y, 1.6, len); ctx.fillRect(3.9, y, 1.6, len); ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let i=1;i<len/2;i++){ ctx.fillRect(-5.5, y + i*2, 1.6, .5); ctx.fillRect(3.9, y + i*2, 1.6, .5); } },
  line(ctx, c, w, pts, cap = 'round'){ ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = cap; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.lineCap = 'butt'; },
  /* a head-cloth: over the crown, a band at the brow, a tail hanging behind the neck */
  cloth(ctx, c, sh){ ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, -12, 5.2, Math.PI*.92, Math.PI*2.06); ctx.fill(); poly(ctx, [[-5.2,-12.6],[-1.6,-12.6],[-3.4,-3.6],[-6.8,-4.6]], c); ctx.fillStyle = sh; ctx.fillRect(-5.1, -12.8, 10.3, 1.1); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-6, -8, 2.4, .6); },
  /* a robe to the ground, lit from the left */
  robe(ctx, h, c1, c2, w = 6.4, f = 8.4){ poly(ctx, [[-w,-6],[w,-6],[f,12.4],[-f,12.4]], h.armor(c1, c2)); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(-f + 1, 10.8, f*2 - 2, 1.6); },
  /* a curved blade held up and out: tulwar, Wickan long knife */
  curved(ctx, c = '#c8c0b0', len = 1){ ctx.strokeStyle = c; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(7, 1.6); ctx.quadraticCurveTo(12*len, -2*len, 10.6*len, -10*len); ctx.stroke(); ctx.strokeStyle = '#5a3e22'; ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(6, 4); ctx.lineTo(7.4, 1); ctx.stroke(); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(5.6, 1, 3.6, .9); },
  bow(ctx, x = 8.4, top = -12, bot = 8){ const m = (top + bot)/2; ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 1.4, top); ctx.quadraticCurveTo(x + .2, top + 1.6, x + 1.6, top + 3.6); ctx.quadraticCurveTo(x + 3.6, m, x + 1.6, bot - 3.6); ctx.quadraticCurveTo(x + .2, bot - 1.6, x - 1.4, bot); ctx.stroke(); // short, the tips turned back
    ctx.strokeStyle = 'rgba(220,210,190,.75)'; ctx.lineWidth = .55; ctx.beginPath(); ctx.moveTo(x - 1.2, top + .4); ctx.lineTo(x - 1.2, bot - .4); ctx.stroke(); ctx.fillStyle = '#c8b088'; ctx.fillRect(x + 1.7, m - 1, 1.3, 2); },
  green(ctx, x = -7.2, y = -3.4){ ctx.fillStyle = '#3e8a3a'; ctx.fillRect(x, y, 2.6, 1.8); ctx.fillStyle = '#2a5e28'; ctx.fillRect(x, y + 1.2, 2.6, .6); poly(ctx, [[x, y + .4],[x - 1.6, y + 2.6],[x - .4, y + 2.8]], '#3e8a3a'); }, // the rebellion's green cloth, tied on the arm
};
/* a little variety in a crowd: the same kind, a different coat, from o.phase */
const b2Pick = (o, arr) => arr[Math.abs(Math.round((o.phase || 0) * 7)) % arr.length];

Object.assign(FIGX, {
  /* ---- the squad ---- */
  sathi(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .9, .9); // small, and all of it braced
    h.legs('#3a2a1c'); ctx.fillStyle = '#5a4630'; ctx.fillRect(-4.5, 9, 3.4, 4); ctx.fillRect(1.1, 9, 3.4, 4); // riding boots
    h.torso('#94744a', '#3a2a16', 5.8); ctx.fillStyle = 'rgba(214,190,140,.7)'; for (let i=0;i<7;i++) ctx.fillRect(-5 + i*1.6, 5.6, .5, 2.2 + (i%2)*.8); // the fringe
    ctx.fillStyle = '#c8a24a'; ctx.fillRect(-5.2, 2.8, 10.4, 1); // a beaded belt
    ctx.fillStyle = '#2a2018'; ctx.fillRect(-7.6, -1, 1.6, 6); ctx.fillStyle = '#b8b0a0'; ctx.fillRect(-7.4, 4.6, 1.2, 2.2); // the long knife
    h.head('#a27a58', 4.2, -11.4); h.look('rgba(20,12,8,.85)', -11.8);
    B2F.cap(ctx, '#0e0a08', 4.6, -12.8, 1, 2); ctx.fillStyle = '#0e0a08'; ctx.fillRect(-4.6, -12.8, 1.4, 3); B2F.braids(ctx, '#141010', 10, -12.6); ctx.fillStyle = '#c8a24a'; ctx.fillRect(-5.5, -3.4, 1.6, .8); ctx.fillRect(3.9, -3.4, 1.6, .8); // black hair, two braids, tied
    ctx.fillStyle = '#e8e0cc'; for (let i=0;i<5;i++) ctx.fillRect(-2.6 + i*1.2, -6.2 + Math.abs(i - 2)*-.3, .6, 1.3); // the Weasel teeth
    B2F.bow(ctx, 8.6, -11, 6); ctx.restore(); },
  hackle(ctx, h, t, o){ const g = o.still ? 0 : Math.sin(t/170 + (o.phase||0)*2)*.7, wag = o.still ? 0 : Math.sin(t/120 + (o.phase||0))*1.4; // a Wickan cattle-dog, the colour of old rope
    const coat = '#9a8458', dk = '#5a482c', lt = '#c8b282';
    ctx.fillStyle = dk; ctx.fillRect(-6.4 + g, 6, 1.7, 6.6); ctx.fillRect(5.2 - g, 6, 1.7, 6.6); // the far legs
    B2F.line(ctx, coat, 2, [[-8.4, 3.6], [-11.6, 1.6], [-11 + wag, -3]]); // the tail, up
    ell(ctx, -1, 4.2, 8.4, 3.4, h.armor(lt, dk)); ctx.fillStyle = 'rgba(40,30,16,.45)'; for (let i=0;i<9;i++) ctx.fillRect(-7 + hash(i,3)*12, 2.4 + hash(i,4)*3.6, 1, .6); // ticked, like rope
    poly(ctx, [[3.6,1.4],[7.8,-3.4],[10.6,-1.2],[8.6,6],[4.6,7]], h.armor(lt, coat)); ell(ctx, 7.4, 3.4, 1.8, 2.4, 'rgba(230,214,170,.45)'); // the neck and its ruff
    ctx.fillStyle = coat; ctx.fillRect(-5.2 - g, 6, 2, 6.8); ctx.fillRect(6.2 + g, 6, 2, 6.8); ctx.fillStyle = dk; ctx.fillRect(-5.2 - g, 12, 2, 1); ctx.fillRect(6.2 + g, 12, 2, 1); // the near legs
    ell(ctx, 9.6, -3.4, 3.1, 2.6, coat); poly(ctx, [[11,-4.8],[14.8,-3.4],[14.6,-1.8],[11,-1.4]], coat); ell(ctx, 14.6, -3.1, .8, .7, '#120c08'); // head and muzzle
    poly(ctx, [[7.8,-5.2],[8.2,-9.6],[10.2,-5.8]], dk); poly(ctx, [[9.6,-5.6],[11.2,-9.8],[12,-5]], coat); ctx.fillStyle = 'rgba(30,18,10,.5)'; ctx.fillRect(10.6, -8, .6, 2.4); // ears up
    ctx.fillStyle = '#0e0806'; ctx.fillRect(10.8, -4.6, 1.1, 1); ctx.fillStyle = 'rgba(255,230,180,.6)'; ctx.fillRect(11.1, -4.5, .4, .4); },
  tangle(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .94, 1.12); // long and bent
    h.legs('#2a2420'); h.torso('#4a3a2a', '#1e160e', 5.6);
    poly(ctx, [[-4.4,-3],[4.4,-3],[5.4,10],[-5.4,10]], h.armor('#6e5034', '#2a1a0e')); ell(ctx, -1.6, 4, 1.6, 1.2, 'rgba(10,6,4,.6)'); ell(ctx, 2.6, 7.4, 1.4, 1, 'rgba(10,6,4,.55)'); // the scorched apron
    ctx.fillStyle = '#4a3622'; ctx.fillRect(-9.4, -1, 4.6, 6.4); ctx.fillStyle = '#5e4630'; ctx.fillRect(-9.4, -1, 4.6, 1.6); ctx.fillStyle = '#e07a45'; ctx.fillRect(-7.6, 1, 1.2, 1.2); // the satchel
    ctx.save(); ctx.translate(1.2, 1.2); h.head('#b4947a', 4.1, -11.4); h.look('rgba(24,14,10,.82)', -11.6); B2F.cap(ctx, '#7a5e3a', 4.3, -12.6, 1.1, 1.92); ctx.restore(); // the head comes forward and down
    ctx.strokeStyle = '#4a3320'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(2, -.6); ctx.lineTo(13, -2.8); ctx.stroke(); ctx.strokeStyle = '#8d8a86'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(9.6, -7.2); ctx.lineTo(9.6, 1.2); ctx.stroke(); // the crossbow
    ctx.fillStyle = '#6a6458'; ctx.fillRect(7.2, -1.4, 3.6, 1.6); // its home-made cradle
    ctx.strokeStyle = '#c8a466'; ctx.lineWidth = .7; for (let i=0;i<3;i++){ ctx.beginPath(); ctx.ellipse(5.4, -.6 + i*.9, 1.6, .6, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-6, 2 + i*.9, 1.6, .6, 0, 0, 7); ctx.stroke(); } // fuse-cord round both wrists
    ctx.restore(); },
  haddat(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.08, 1.14); // tall, broad in the shoulder
    h.legs('#2e2a26'); poly(ctx, [[-6.6,-6],[6.6,-6],[7.8,11.6],[-7.8,11.6]], h.armor('#4e443a', '#1c1814')); // the long coat
    h.torso('#94908a', '#34322c', 7); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = .6; ctx.beginPath(); for (let i=0;i<4;i++){ ctx.moveTo(-6.4, -3.6 + i*2.4); ctx.lineTo(6.4, -3.6 + i*2.4); } ctx.stroke(); // mail
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-6.4, 4.6, 12.8, 1.4); ctx.fillStyle = '#c9a44a'; ctx.fillRect(2, -3, 1.6, 1.6); // belt; the auxiliary's brass badge
    h.head('#8e6a4c', 4.5, -11.2); h.look('rgba(20,10,6,.85)'); B2F.cloth(ctx, '#d4ccb8', '#a49a84'); ctx.fillStyle = '#d4ccb8'; ctx.fillRect(-4.8, -9.4, 1.6, 4); // the head-cloth, round under the jaw
    h.shield('#5a7a96', '#1e2a36', 6.6, -7.4, .4); ctx.strokeStyle = 'rgba(160,190,220,.35)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.arc(-7.4, .4, 4.4, 0, 7); ctx.stroke(); // the round shield, faded blue
    B2F.curved(ctx, '#d0c8b8'); ctx.restore(); },
  marrow(ctx, h, t, o){ h.legs('#2e2a24'); poly(ctx, [[-5.8,-6],[5.8,-6],[7,11],[-7,11]], h.armor('#6e6a50', '#26241a')); // the coat with too many pockets
    ctx.fillStyle = '#3a382a'; [[-5,-2],[1.6,-2],[-5.6,3.4],[2.2,3.4]].forEach(([x, y]) => { ctx.fillRect(x, y, 3.2, 2.6); }); ctx.fillStyle = 'rgba(200,200,170,.25)'; [[-5,-2],[1.6,-2],[-5.6,3.4],[2.2,3.4]].forEach(([x, y]) => ctx.fillRect(x, y, 3.2, .6));
    ctx.fillStyle = '#7fb394'; ctx.fillRect(-1, -6, 2, 1.2); // a green thread at the collar
    h.head('#9c8c8a', 4.2, -11.2); ell(ctx, 1.6, -10, 2.6, 2.4, 'rgba(90,110,160,.16)'); h.look('rgba(24,16,14,.8)', -11.2); ctx.fillStyle = '#9a948c'; ctx.fillRect(-4.4, -12.6, 1.6, 4.4); // grey hair at the back of the neck, a Napan's blue in the skin
    ell(ctx, 0, -14.4, 8.6, 1.9, '#a89068'); ell(ctx, .6, -13.8, 8, 1.2, 'rgba(40,30,16,.35)'); B2F.cap(ctx, '#b49a70', 4, -14.6, 1, 2); ctx.fillStyle = '#7fb394'; ctx.fillRect(-4, -15.2, 8, .8); // the wide-brimmed sun hat
    ctx.fillStyle = '#c8a878'; ell(ctx, 8.2, -.6, 1.1, 1.1, '#c8a878'); ctx.fillRect(7.3, .2, 1.8, 3.2); ctx.fillStyle = 'rgba(60,40,20,.4)'; ctx.fillRect(8.4, .4, .7, 3); // the little wooden Soliel, held
    ctx.fillStyle = '#9c8c8a'; ctx.fillRect(6.4, .8, 1.6, 1.6); },

  /* ---- the Chain's people ---- */
  coltaine(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.02, 1.08); // lean and hard; the crow-feather cloak; very still
    h.legs('#1a1614'); h.torso('#3a2a1e', '#140e0a', 5.4);
    const cl = [[-6.8,-7],[-3,-7.4],[-4.6,4],[-6,12.6],[-7.4,10.6],[-8.6,12.8],[-9.6,10],[-10.4,12]]; poly(ctx, cl, h.armor('#22222c', '#060608')); poly(ctx, [[6.8,-7],[4,-7.4],[5,4],[6.6,12],[8,10.4],[9,12.4]], h.armor('#1a1a22', '#050507')); // the cloak, hanging open, ragged as feathers
    ctx.strokeStyle = 'rgba(120,130,180,.35)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<6;i++){ ctx.moveTo(-6.4 + (i%2)*.8, -5 + i*2.6); ctx.lineTo(-8.6 + (i%2)*.8, -3 + i*2.6); } ctx.stroke(); // blue-black sheen on the feathers
    ctx.fillStyle = '#6a5a3a'; ctx.fillRect(-4.4, 3.6, 8.8, 1); B2F.line(ctx, '#b8b0a0', 1.1, [[6.4, 3], [9.6, -2.6]]); // a long knife, low
    h.head('#7a5a40', 4.1, -11.4); h.look('rgba(230,220,200,.5)', -11.6); B2F.cap(ctx, '#0a0808', 4.4, -12.8); B2F.braids(ctx, '#0c0a0a', 11, -12.8); ctx.fillStyle = 'rgba(30,18,12,.4)'; ctx.fillRect(-3.4, -9.6, 7, .6); // lean cheeks
    ell(ctx, -5, -8.6, 2.1, 1.4, '#08080a'); ell(ctx, -3.4, -10, 1.1, 1, '#0c0c10'); poly(ctx, [[-2.5,-10.2],[-1.2,-9.8],[-2.5,-9.5]], '#3a3a30'); poly(ctx, [[-6.8,-8.4],[-8.8,-6.8],[-6.4,-7.8]], '#08080a'); ctx.fillStyle = 'rgba(255,220,120,.85)'; ctx.fillRect(-3.4, -10.4, .5, .5); // a crow on his shoulder
    ctx.restore(); },
  bult(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.18, 1.06); // old, heavy, scarred, laughing
    h.legs('#2a2018'); poly(ctx, [[-7.4,-6],[7.4,-6],[8.4,8],[-8.4,8]], h.armor('#6e4e32', '#24180e')); ell(ctx, 1, 3, 6, 4.4, 'rgba(255,220,170,.06)'); ctx.fillStyle = '#3a2a18'; ctx.fillRect(-8, 4, 16, 1.6); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-1, 4, 2, 1.6); // a belly and a belt
    h.head('#8a6448', 4.9, -11); ctx.fillStyle = '#9a948a'; ctx.beginPath(); ctx.arc(0, -12.6, 4.9, Math.PI*1.05, Math.PI*1.95); ctx.fill(); B2F.braids(ctx, '#8a8478', 8, -12.4);
    ctx.fillStyle = 'rgba(20,10,6,.85)'; ctx.fillRect(-.6, -11.6, 1.6, .6); ctx.fillRect(2.4, -11.6, 1.6, .6); // eyes screwed up with laughing
    ell(ctx, 1.8, -8.2, 1.6, 1, '#2a0e08'); ctx.fillStyle = 'rgba(230,220,200,.6)'; ctx.fillRect(1, -8.8, 1.8, .4); // the laugh
    B2F.line(ctx, 'rgba(210,150,130,.7)', .5, [[-2.6, -14], [.4, -9.6]]); B2F.line(ctx, 'rgba(210,150,130,.6)', .5, [[3.6, -12.6], [4.2, -9]]); // scars
    h.sword('#b8b0a0'); ctx.restore(); },
  duiker(ctx, h, t, o){ h.legs('#2e2a24'); h.torso('#6a6252', '#2a261e', 6); ctx.fillStyle = '#3a3226'; ctx.fillRect(-6, 3.6, 12, 1.2); // plain clothes, a soldier's belt
    B2F.line(ctx, '#4a3a26', 1.6, [[-5, -6], [5.4, 4]], 'butt'); ctx.fillStyle = '#5a4430'; ctx.fillRect(4.6, 1.6, 5.8, 6); ctx.fillStyle = '#e4dcc8'; ctx.fillRect(5, .8, 4.8, 1.4); ctx.fillRect(5.6, .2, 3.2, 1); ctx.fillStyle = '#6e5640'; ctx.fillRect(4.6, 1.6, 5.8, 1.6); // a satchel stuffed with papers
    h.head('#a8826a', 4.4, -11.2); h.look('rgba(24,14,10,.82)'); ctx.fillStyle = '#a8a49a'; ctx.beginPath(); ctx.arc(0, -12.6, 4.6, Math.PI*1.05, Math.PI*1.95); ctx.fill(); ctx.fillRect(-4.6, -12.6, 1.4, 3.4); // grey, cropped
    ctx.fillStyle = 'rgba(180,176,166,.5)'; ctx.fillRect(-2.6, -8.8, 6.6, 2); // grey stubble
    ctx.fillStyle = '#2a2018'; ctx.fillRect(-7.6, -1, 1.6, 7); ctx.fillStyle = '#6a5a40'; ctx.fillRect(-7.8, -1.6, 2, 1); }, // a short sword, sheathed
  sormo(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .82, .84); // a boy's body, an old man's stillness
    h.legs('#2a2018'); B2F.robe(ctx, h, '#4a3a2c', '#18120c', 5.6, 7.2);
    ctx.fillStyle = '#d8ccb0'; [[-3,-2],[1.6,0],[-1,3.4],[3,4.6]].forEach(([x, y]) => { ctx.fillRect(x, y, .9, 2); ctx.fillRect(x - .4, y + 2, 1.7, .6); }); // bone fetishes
    h.head('#8a6a4c', 4.3, -11.4); B2F.cap(ctx, '#0e0a08', 4.6, -12.8); ctx.fillStyle = '#0e0a08'; ctx.fillRect(-4.6, -12.8, 2, 10); ctx.fillRect(2.8, -12.8, 1.4, 3); // long black hair
    ctx.fillStyle = 'rgba(226,214,180,.8)'; ctx.fillRect(-.8, -11.6, 1.1, 1); ctx.fillRect(2.1, -11.6, 1.1, 1); // old eyes
    const p = (Math.sin(t/900) + 1)/2; for (let i=0;i<3;i++){ const a = t/1400 + i*2.1; ell(ctx, Math.cos(a)*8, 4 - i*5 + Math.sin(a)*1.5, 1.4, .8, `rgba(200,210,190,${.12 + p*.12})`); } // spirits, barely
    ctx.restore(); },
  wickan(ctx, h, t, o){ h.legs('#2e2418'); ctx.fillStyle = '#4a3a26'; ctx.fillRect(-4.5, 9, 3.4, 4); ctx.fillRect(1.1, 9, 3.4, 4); h.torso(b2Pick(o, ['#7a5a3a','#6a4e34','#5e4a36']), '#2a1e12', 6.2); // hide and leather
    ctx.fillStyle = 'rgba(200,180,140,.5)'; for (let i=0;i<6;i++) ctx.fillRect(-5 + i*2, 6, .5, 1.8);
    h.head('#8a6448', 4.4, -11.2); h.look(); B2F.cap(ctx, '#0e0a08', 4.7, -12.6); B2F.braids(ctx, '#120e0c', 10);
    ctx.fillStyle = '#5a4a30'; ctx.fillRect(-8.6, -6, 2, 10); B2F.line(ctx, '#6a4a2a', 1.1, [[-9.6, -8], [-7, 4]]); // horse bow, slung
    B2F.curved(ctx, '#c0b8a8', .9); },
  b2soldier(ctx, h, t, o){ h.legs('#3a3228'); h.torso('#8a7a56', '#3a321e', 6.6); ctx.fillStyle = '#5a4630'; ctx.fillRect(-6.6, 3.6, 13.2, 1.3); // a sand tabard over leather
    ctx.fillStyle = '#c8b890'; ctx.fillRect(-4.8, -7.2, 9.6, 2.2); h.head('#a8826a'); h.look(); h.capHelm('#5e5a52'); poly(ctx, [[-5.6,-12],[-3.4,-12],[-4,-5],[-7,-6.4]], '#c8b890'); // the desert scarf, and a cloth hung off the cap
    ctx.fillStyle = 'rgba(255,250,240,.14)'; ctx.fillRect(-3.6, -16, 3, 1);
    h.shield('#6a5236', '#22180e', 5.8, -7.4, .4); ctx.fillStyle = 'rgba(200,180,120,.35)'; ctx.fillRect(-8, -3, 1.2, 7); h.sword(); },
  hissari_m(ctx, h, t, o){ const c = b2Pick(o, [['#8a7a5a','#34301e'],['#6a5a48','#26201a'],['#8a6a4a','#2e2014'],['#7a7466','#2a2822']]);
    h.legs('#2a2420'); B2F.robe(ctx, h, c[0], c[1], 6.2, 8); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(-.5, -5, 1, 16); ctx.fillStyle = '#5a3a24'; ctx.fillRect(-6, 1.6, 12, 1.2);
    h.head('#94704e', 4.4, -11.2); h.look(); ctx.fillStyle = '#1e1410'; poly(ctx, [[-3.6,-9.6],[4.6,-9.6],[3.8,-6],[1,-4.8],[-2.4,-5.6]], '#1e1410'); // a dark beard
    B2F.cloth(ctx, b2Pick(o, ['#cfc4ac','#b8ac90','#d8d0bc']), '#9a8e74'); },
  hissari_w(ctx, h, t, o){ const c = b2Pick(o, [['#6a4a5a','#24161e'],['#4a5a6a','#161e26'],['#7a5a3a','#2a1c10'],['#5a4a3a','#201810']]);
    B2F.robe(ctx, h, c[0], c[1], 5.6, 8.6); ctx.fillStyle = 'rgba(232,192,115,.35)'; ctx.fillRect(-7.8, 10, 15.6, .8); // a robe to the ground, a worked hem
    h.head('#9a7656', 4, -11.4); h.look('rgba(20,10,6,.85)', -11.6);
    const v = b2Pick(o, ['#3a2a3a','#2a3440','#4a2a20','#3a3228']); ctx.fillStyle = v; ctx.beginPath(); ctx.arc(0, -11.8, 5.2, Math.PI*.9, Math.PI*2.1); ctx.fill(); poly(ctx, [[-5.2,-12],[5.2,-12],[5.6,-6.6],[3.6,-6.6],[3.6,-9],[-3.6,-9],[-4,-4],[-7.4,-3.6]], v); // the scarf, over the hair and shoulders
    ctx.fillStyle = 'rgba(232,192,115,.4)'; ctx.fillRect(-4.8, -12.4, 9.6, .6); },
  child(ctx, h, t, o){ ctx.save(); ctx.scale(.66, .66); ctx.translate(0, 6.6); const c = b2Pick(o, ['#7a6a4a','#5a4a5a','#6a4a34','#4a5a5a']);
    h.legs('#2a2420'); h.torso(c, '#1e1a14', 5); h.head('#9a7656', 4.6); h.look(); B2F.cap(ctx, b2Pick(o, ['#1a1210','#2a1a10','#0e0a08']), 4.8, -12.6, .92, 2.08); ctx.restore(); },
  noble(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.1, 1.02); // silk, and a great deal of it
    B2F.robe(ctx, h, '#5a3a7a', '#1e1230', 6.4, 8.6); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-.6, -6, 1.2, 18); ctx.fillRect(-8.4, 11.4, 16.8, .8); ctx.fillStyle = '#8a2a3a'; ctx.fillRect(-6.4, 1, 12.8, 2); // gold trim, a madder sash
    ell(ctx, 0, 0, 5, 4, 'rgba(255,255,255,.06)');
    h.head('#c09a7a', 4.6, -11.4); h.look(); ctx.fillStyle = '#1a1210'; ctx.fillRect(-2.6, -8.6, 5.6, 1.4); // an oiled moustache
    ctx.fillStyle = '#e8dcc0'; ctx.beginPath(); ctx.arc(0, -13.2, 5, Math.PI, 0); ctx.fill(); ctx.fillRect(-5, -13.4, 10, 1.6); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-5, -13.6, 10, .7); ell(ctx, 0, -15.6, 1, 1, '#4a8ad6'); // a silk cap and a jewel
    ell(ctx, 7, 2, 1.4, 1.4, '#c09a7a'); ctx.fillStyle = '#e8c073'; ctx.fillRect(6.4, 1.6, 1.4, .6); ctx.restore(); }, // rings
  rebel(ctx, h, t, o){ h.legs('#2a2420'); h.torso(b2Pick(o, ['#6a5a40','#5a4a3a','#6a4a34']), '#241c12', 6); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-6, 3.6, 12, 1.1);
    h.head('#8e6a4c', 4.3); B2F.cloth(ctx, b2Pick(o, ['#8a7e66','#6a5e4a','#a89a7c']), '#5a4e3a'); h.eyes('rgba(255,120,100,.5)'); B2F.green(ctx); B2F.curved(ctx, '#b8b0a0', .95); },
  rebel_bow(ctx, h, t, o){ h.legs('#2a2420'); h.torso(b2Pick(o, ['#5e5040','#6a5a40','#54443a']), '#221a12', 6); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-9, -8, 2.6, 11); ctx.fillStyle = '#b8b0a0'; ctx.fillRect(-8.6, -9.6, .6, 2); ctx.fillRect(-7.6, -9.2, .6, 2); // a quiver
    h.head('#8e6a4c', 4.3); B2F.cloth(ctx, b2Pick(o, ['#8a7e66','#a89a7c','#6a5e4a']), '#5a4e3a'); h.eyes('rgba(255,120,100,.5)'); B2F.green(ctx);
    ctx.strokeStyle = '#8b7355'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(8, -13); ctx.quadraticCurveTo(12, -2, 8, 9); ctx.stroke(); ctx.strokeStyle = '#cfc8b8'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(8, -13); ctx.lineTo(8, 9); ctx.stroke(); },
  tithansi(ctx, h, t, o){ ctx.strokeStyle = '#5a4428'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(8.2, 12); ctx.lineTo(9.4, -24); ctx.stroke(); poly(ctx, [[9.4,-29],[8.4,-23.6],[10.4,-23.6]], '#c8c0b0'); poly(ctx, [[9.2,-22.4],[13.6,-21],[9.4,-19.4]], '#7a2a1e'); // the lance and its pennant
    h.legs('#3a3024'); B2F.robe(ctx, h, '#b09a72', '#4a3c26', 6.4, 8.4); ctx.fillStyle = 'rgba(60,40,20,.35)'; ctx.fillRect(-7, 5, 14, 1); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-6.2, 0, 12.4, 1.4); // desert robes, dust in the hem
    h.head('#6a4a32', 4.4, -11.2); ctx.fillStyle = '#3a2e24'; ctx.beginPath(); ctx.arc(0, -11.6, 5.2, 0, 7); ctx.fill(); poly(ctx, [[-5,-10],[-8,-4],[-4,-6]], '#3a2e24'); ctx.fillStyle = '#7a5e44'; ctx.fillRect(-.6, -12.4, 5.2, 1.6); // the face wrapped, a slit for the eyes
    ctx.fillStyle = 'rgba(255,170,120,.7)'; ctx.fillRect(.2, -12, 1.1, .9); ctx.fillRect(2.8, -12, 1.1, .9); },
  semk(ctx, h, t, o){ const p = (Math.sin(t/260 + (o.phase||0)) + 1)/2; // a painted holy man of the rising, casting
    glow(ctx, 0, -4, 18, '#9ad04a', .1 + p*.1);
    h.legs('#4a3a2a'); poly(ctx, [[-5,-6],[5,-6],[7,4],[5,12],[3,8],[1,12.6],[-1.6,8.4],[-4,12.4],[-6,8],[-7,4]], h.armor('#5a4a36', '#1e160e')); // rags
    ctx.fillStyle = '#6a5040'; ctx.fillRect(-3, -6, 6, 6); ctx.fillStyle = 'rgba(210,206,196,.55)'; for (let i=0;i<4;i++) ctx.fillRect(-2.6 + i*1.6, -5.6, .6, 4.6); // the bare chest, striped with ash
    B2F.line(ctx, '#6a5040', 1.6, [[-5, -4], [-9, -11], [-10, -15]]); B2F.line(ctx, '#6a5040', 1.6, [[5, -4], [9, -11], [10.6, -15.4]]); // arms raised
    h.head('#6a5040', 4.2, -11.4); ctx.fillStyle = 'rgba(220,216,206,.6)'; ctx.fillRect(-3, -12.6, 7, 1.2); ctx.fillRect(-1.4, -10, 4.6, .8); // ash on the face
    ctx.strokeStyle = '#2a2018'; ctx.lineWidth = 1; for (let i=0;i<6;i++){ ctx.beginPath(); ctx.moveTo(-4 + i*1.6, -14.6); ctx.lineTo(-6 + i*2.2 + Math.sin(t/300 + i)*.5, -18.4 - (i%2)); ctx.stroke(); } // wild hair
    ctx.fillStyle = `rgba(190,255,120,${.7 + p*.3})`; ctx.fillRect(-.6, -11.6, 1.1, 1); ctx.fillRect(2.2, -11.6, 1.1, 1);
    [[-10, -15], [10.6, -15.4]].forEach(([x, y]) => { glow(ctx, x, y, 5 + p*2, '#b8f060', .55); ell(ctx, x, y, 1, 1, 'rgba(230,255,190,.9)'); }); },
  ressan(ctx, h, t, o){ ctx.save(); ctx.translate(.8, .6); // an old water-seller, stooped under his skins
    ell(ctx, -7.4, 1.6, 3.2, 4.4, h.armor('#6a4a2a', '#24160a')); ell(ctx, 7, 3, 2.6, 3.8, h.armor('#5e4226', '#20140a')); // waterskins, sweating
    h.legs('#2a2420'); B2F.robe(ctx, h, '#7a6a4e', '#2a2216', 6, 7.8); ctx.fillStyle = '#4a3a24'; ctx.fillRect(-6, -6, 1.6, 9); ctx.fillRect(4.4, -6, 1.6, 10); // the straps
    ctx.save(); ctx.translate(1.2, 1.6); h.head('#8a6a50', 4.2, -11.2); h.look(); poly(ctx, [[-3.4,-9.6],[4.6,-9.6],[3.6,-5],[.8,-3],[-2,-5]], '#d8d0c0'); B2F.cloth(ctx, '#c8bca4', '#8a7e64'); ctx.restore(); // a white beard
    ell(ctx, 9.4, -1.6, 1.8, .7, '#e8c073'); ctx.fillStyle = '#c9a44a'; ctx.fillRect(8.2, -1.6, 2.4, 2.2); ctx.fillStyle = 'rgba(255,240,200,.7)'; ctx.fillRect(8.4, -1.2, .6, 1.6); // the brass cup
    ctx.restore(); },
  priest(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.16, 1); // soft and plump, a priest of Mael
    B2F.robe(ctx, h, '#2e5a7a', '#0c1e2c', 6.8, 8.8); ell(ctx, 0, 2, 6.4, 5.4, 'rgba(120,180,220,.08)'); ctx.strokeStyle = 'rgba(160,210,230,.4)'; ctx.lineWidth = .6; ctx.beginPath(); for (let i=0;i<3;i++){ ctx.moveTo(-7 + i*.4, 8 + i*1.2); ctx.quadraticCurveTo(-3, 6.6 + i*1.2, 0, 8 + i*1.2); ctx.quadraticCurveTo(3, 9.4 + i*1.2, 7.4 - i*.4, 8 + i*1.2); } ctx.stroke(); // waves worked in the hem
    h.head('#c8a088', 5, -11); h.look(undefined, -11.2); ell(ctx, 0, -7.8, 3.4, 1.2, '#b88e76'); // a double chin
    ctx.fillStyle = 'rgba(255,240,220,.18)'; ctx.fillRect(-3, -15.2, 3, 1.2); // bald, and shining
    ell(ctx, -1.2, 2.4, 2, 1.5, '#c8a088'); ell(ctx, 1.4, 2.6, 2, 1.5, '#b08a74'); ell(ctx, 0, -3, 1.4, 1, '#4aa8a0'); ctx.strokeStyle = 'rgba(200,190,170,.5)'; ctx.lineWidth = .4; ctx.beginPath(); ctx.moveTo(-3, -6); ctx.lineTo(0, -3.6); ctx.lineTo(3, -6); ctx.stroke(); // a sea-glass pendant
    ctx.restore(); },
});

/* ---------------- portraits: POR[id](ctx, st), a bust ~120 units tall, shoulders at y = 0, lantern low left, accent rim right ---------------- */
Object.assign(POR, {
  /* Sathi: seventeen, Weasel Clan. Black braids forward over the shoulders, a sly mouth, Weasel teeth at her throat, the short bow held upright */
  sathi(ctx){ const F = {cy:-74, w:12, h:18.6, jaw:.7, chin:4.2, skin:'#a27a58', iris:'#2a1c12', lip:'#8e5a48', browCol:'#100806', browW:1.35, arch:.9, browR:.5, rim:'#c8a24a', rimA:.18, nose:.92, look:.5, smileL:.05, smileR:.85, mouthW:3.6, flush:'#b8604a'};
    // the bow: horn and sinew, short, its tips doubled back
    const bow = () => { ctx.beginPath(); ctx.moveTo(-26, -96); ctx.quadraticCurveTo(-22, -90, -28, -84); ctx.bezierCurveTo(-40, -72, -40, -52, -37, -40); ctx.bezierCurveTo(-40, -28, -40, -10, -28, 2); ctx.quadraticCurveTo(-22, 8, -27, 14); };
    ctx.lineCap = 'round'; ctx.strokeStyle = '#1e140a'; ctx.lineWidth = 4.2; bow(); ctx.stroke(); ctx.strokeStyle = PR.lin(ctx, -42, 0, -24, 0, [[0,'#c8a066'], [.6,'#7a5430'], [1,'#2a1a0c']]); ctx.lineWidth = 2.8; bow(); ctx.stroke();
    PR.stroke(ctx, 'rgba(240,220,180,.35)', .6, () => { ctx.moveTo(-38.6, -66); ctx.quadraticCurveTo(-39.4, -56, -38, -48); }); PR.stroke(ctx, 'rgba(230,220,200,.6)', .45, () => { ctx.moveTo(-27.6, -84); ctx.lineTo(-27.6, 2); }); // the string
    // hide, fringed at the yoke
    PR.torsoPath(ctx, 31, 5); ctx.fillStyle = PR.lit(ctx, '#94744a', '#33240f', -31, 22); ctx.fill();
    ctx.save(); PR.torsoPath(ctx, 31, 5); ctx.clip();
    PR.stroke(ctx, 'rgba(20,12,4,.55)', .8, () => { ctx.moveTo(-31, -30); ctx.quadraticCurveTo(0, -18, 31, -30); });
    PR.strands(ctx, 40, ['rgba(214,188,136,.7)', 'rgba(150,120,80,.7)', 'rgba(60,40,20,.6)'], .7, 17, (i, r) => { const k = i/39, x = lerp(-29, 29, k), y = -30 + (1 - Math.pow((k - .5)*2, 2))*7.4; return [x, y, x + (r() - .5), y + 3, x + (r() - .5)*1.6, y + 6 + r()*3]; }); // the fringe
    PR.stitch(ctx, 'rgba(220,190,130,.3)', .45, () => { ctx.moveTo(-6, -46); ctx.lineTo(-7, -20); });
    PR.soft(ctx, 22, -18, 16, 14, '#000000', .45); PR.soft(ctx, -20, -36, 12, 7, '#ffe0b0', .1);
    ctx.fillStyle = PR.lit(ctx, '#c8a24a', '#5a4418', -30, 30); ctx.fillRect(-34, -5, 68, 3.4); for (let i=0;i<14;i++) ell(ctx, -26 + i*4, -3.3, .9, .9, i%3 ? '#e8d8b0' : '#8a2a1a'); // the beaded belt
    ctx.restore();
    PR.neck(ctx, F, 6);
    // a string of Weasel teeth on a thong
    PR.stroke(ctx, '#2a1a0c', .8, () => { ctx.moveTo(-10, -48); ctx.quadraticCurveTo(0, -36, 10, -48); });
    for (let i=0;i<11;i++){ const k = i/10, x = lerp(-9, 9, k), y = -47.6 + (1 - Math.pow((k - .5)*2, 2))*6, a = (k - .5)*.9; ctx.save(); ctx.translate(x, y); ctx.rotate(a); poly(ctx, [[-.7, 0], [.7, 0], [.2, 3.2]], k < .55 ? '#ece2cc' : '#9a907c'); ctx.restore(); }
    F.under = (ctx, F) => { PR.soft(ctx, -6, F.cy + 7, 4, 2, '#4a3018', .2); PR.soft(ctx, 7, F.cy + 10, 4, 2.4, '#2a1a0c', .22); }; // dust
    PR.face(ctx, F);
    // black hair, parted, scraped back into two Wickan braids that come forward over the shoulders
    const u = F.h/20, top = F.cy - 21*u; ctx.beginPath(); ctx.moveTo(-13, F.cy + 2); ctx.bezierCurveTo(-14.6, top + 2, -8, top - 2.2, 0, top - 2); ctx.bezierCurveTo(8, top - 2.2, 14.6, top + 2, 13, F.cy + 2); ctx.quadraticCurveTo(12.4, F.cy - 9, 5, F.cy - 13); ctx.quadraticCurveTo(1.6, F.cy - 14.6, 0, F.cy - 13.6); ctx.quadraticCurveTo(-1.6, F.cy - 14.6, -5, F.cy - 13); ctx.quadraticCurveTo(-12.4, F.cy - 9, -13, F.cy + 2);
    ctx.fillStyle = PR.lin(ctx, -14, 0, 14, 0, [[0,'#3a3030'], [.4,'#141010'], [1,'#040303']]); ctx.fill();
    PR.strands(ctx, 36, ['rgba(110,100,110,.45)', '#1a1414', '#0a0808'], .5, 71, (i, r) => { const sd = i%2 ? 1 : -1, x0 = sd*.4, y0 = F.cy - 13.8 - r()*.6, x1 = sd*(9 + r()*4), y1 = F.cy - 6 + r()*8; return [x0, y0, sd*7, top - .5, x1, y1]; });
    [-1, 1].forEach(sd => { const lit = sd < 0; for (let i=0;i<13;i++){ const k = i/12, x = sd*(12.6 + Math.sin(k*2.4)*3.6), y = F.cy + 2 + k*44, rr = 2.3 - k*.5;
      ell(ctx, x - sd*.6*(i%2 ? 1 : -1), y, rr, 1.9, PR.lin(ctx, x - 2, y - 2, x + 2, y + 2, lit ? [[0,'#4a4040'], [.6,'#1a1414'], [1,'#060404']] : [[0,'#2a2222'], [1,'#040303']]), (i%2 ? .6 : -.6)*sd); }
      ctx.fillStyle = PR.lit(ctx, '#e0c060', '#6a4a14', sd*12 - 3, sd*12 + 3); ctx.fillRect(sd*(12.6 + Math.sin(2.4)*3.6) - 2.2, F.cy + 44, 4.4, 2.4); // tied with yellow cord
      PR.strands(ctx, 7, ['#141010', '#2a2222'], .5, 80 + sd, (i, r) => { const x = sd*(12.6 + Math.sin(2.4)*3.6) + (r() - .5)*3, y = F.cy + 46.4; return [x, y, x + (r() - .5)*2, y + 3, x + (r() - .5)*3, y + 5 + r()*3]; }); });
    // the fist on the grip, bare and brown
    ctx.fillStyle = PR.lin(ctx, -42, 0, -30, 0, [[0,'#b88a64'], [.6,'#7a5438'], [1,'#2a1a10']]); ctx.beginPath(); ctx.moveTo(-41.4, -44); ctx.bezierCurveTo(-42.6, -49, -36, -50, -32, -47.4); ctx.bezierCurveTo(-30, -45, -30, -37, -32.4, -35.4); ctx.bezierCurveTo(-36, -33.4, -41.6, -35.6, -41.4, -40); ctx.closePath(); ctx.fill();
    PR.stroke(ctx, 'rgba(50,26,14,.5)', .45, () => { for (let i=0;i<3;i++){ ctx.moveTo(-32.6, -45 + i*3); ctx.quadraticCurveTo(-34.4, -44 + i*3, -37.4, -45 + i*3); } }); PR.soft(ctx, -38, -45, 3, 1.6, '#ffd8a8', .26);
    return F; },
  /* Tangle: a long Kanese face that has stood too near too many fuses; an ear Marrow stitched; fuse-cord coiled round his wrist and over his shoulder; the crossbow and its tally */
  tangle(ctx){ const F = {cy:-75, w:11.8, h:21, jaw:.74, chin:4.4, skin:'#b4947a', iris:'#4e5a48', lip:'#8a5a4a', browCol:'#4a3620', browW:1.25, arch:1.25, browL:.7, browR:.15, rim:'#e07a45', nose:1.2, age:.45, bags:.9, look:.15, smileL:-.2, smileR:.3, mouthW:3.8, earS:1.12};
    // the crossbow behind his right shoulder: the stock with its tally, the prod, the cradle he made
    ctx.save(); ctx.translate(26, -46); ctx.rotate(.22); ctx.fillStyle = PR.lin(ctx, -3, 0, 4, 0, [[0,'#8a6440'], [.5,'#5a3e22'], [1,'#1e140a']]); ctx.fillRect(-3, -44, 6, 70);
    PR.stroke(ctx, 'rgba(230,210,170,.45)', .45, () => { for (let i=0;i<9;i++){ ctx.moveTo(-2.4, -10 + i*2.4); ctx.lineTo(1.4, -10 + i*2.4); } ctx.moveTo(-2.4, -12); ctx.lineTo(1.4, 12); }); // the tally, scratched in
    ctx.strokeStyle = PR.lin(ctx, -22, 0, 22, 0, [[0,'#9a968c'], [.5,'#4a4640'], [1,'#141210']]); ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-20, -30); ctx.bezierCurveTo(-12, -38, -4, -40, 0, -40); ctx.bezierCurveTo(4, -40, 12, -38, 20, -30); ctx.stroke(); ell(ctx, -20, -30, 1.2, 1.2, '#2a2620'); ell(ctx, 20, -30, 1.2, 1.2, '#2a2620'); PR.stroke(ctx, 'rgba(220,210,190,.6)', .5, () => { ctx.moveTo(-20, -30); ctx.lineTo(0, -22); ctx.lineTo(20, -30); });
    ctx.fillStyle = '#5a564e'; ctx.fillRect(-4.6, -18, 9.2, 5); PR.stroke(ctx, '#2a2620', .6, () => { ctx.moveTo(-4.6, -15.5); ctx.lineTo(4.6, -15.5); }); ell(ctx, -3, -17, .7, .7, '#c8c0b0'); ell(ctx, 3, -17, .7, .7, '#6a645a'); ctx.restore(); // the cradle, riveted
    // a jerkin under a scorched leather apron
    PR.torsoPath(ctx, 34, 4); ctx.fillStyle = PR.lit(ctx, '#4e3e2c', '#1a120a', -34, 24); ctx.fill();
    ctx.save(); PR.torsoPath(ctx, 34, 4); ctx.clip();
    ctx.fillStyle = PR.lit(ctx, '#7a5636', '#2a1a0c', -18, 18); PR.path(ctx, [[-14, -44], [14, -44], [17, 2], [-17, 2]]); ctx.fill(); PR.stroke(ctx, 'rgba(0,0,0,.45)', .7, () => { ctx.moveTo(-14, -44); ctx.lineTo(-17, 2); ctx.moveTo(14, -44); ctx.lineTo(17, 2); });
    [[-6, -30, 4], [8, -16, 5.4], [-10, -10, 3], [4, -38, 2.4]].forEach(([x, y, r], i) => { PR.soft(ctx, x, y, r*2.4, r*1.7, '#0e0804', .6, i); if (i%2 === 0) { ell(ctx, x + .4, y, r*.38, r*.28, '#080402', i); PR.stroke(ctx, 'rgba(255,140,70,.4)', .35, () => { ctx.ellipse(x + .4, y, r*.38, r*.28, i, 0, 7); }); } }); // burns, two of them through
    ctx.strokeStyle = PR.lit(ctx, '#3a2818', '#120c06', -30, 30); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-14, -44); ctx.lineTo(-22, -48); ctx.moveTo(14, -44); ctx.lineTo(22, -48); ctx.stroke(); // the apron's straps
    ctx.restore();
    // fuse-cord coiled over the left shoulder
    for (let i=0;i<5;i++){ ctx.strokeStyle = PR.lin(ctx, -40, 0, -14, 0, [[0,'#e0c088'], [.6,'#9a7a48'], [1,'#3a2a14']]); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(-22 + i*.6, -36 + i*.8, 10 - i*.4, 4.4, -.5, 0, 7); ctx.stroke(); }
    PR.stroke(ctx, 'rgba(40,24,10,.5)', .4, () => { for (let i=0;i<16;i++){ const a = i/16*6.28, x = -22 + Math.cos(a)*10, y = -36 + Math.sin(a)*4.4; ctx.moveTo(x - .6, y - .6); ctx.lineTo(x + .6, y + .6); } });
    PR.neck(ctx, F, 6.4);
    ctx.fillStyle = PR.lit(ctx, '#5a4834', '#1a120a', -12, 12); PR.path(ctx, [[-12, -42], [-8, -49], [8, -49], [12, -42], [0, -42.4]]); ctx.fill(); // the jerkin's collar
    F.under = (ctx, F) => { const u = F.h/20; PR.dots(ctx, F, 120, 'rgba(70,46,30,.38)', .45, [7, 19, (x, y) => Math.abs(x) < 4.6 && y > 10 && y < 14]); // stubble
      PR.soft(ctx, -7, F.cy + 4*u, 4, 2, '#140a06', .35, .3); PR.soft(ctx, 8, F.cy - 9*u, 5, 2, '#140a06', .3); PR.soft(ctx, -3, F.cy - 13*u, 6, 2, '#ffe8cc', .1); }; // soot, and a forehead the hair has left
    PR.face(ctx, F);
    // the ear Marrow stitched (his left, the lit one)
    { const u = F.h/20, ex = -(F.w + .3), ey = F.cy + 1.8*u; PR.stroke(ctx, 'rgba(110,40,30,.6)', .6, () => { ctx.moveTo(ex - 1.6, ey - 3.6*u); ctx.quadraticCurveTo(ex - 2.4, ey, ex - 1.4, ey + 2.6*u); }); PR.stroke(ctx, '#1a0e0a', .35, () => { for (let i=0;i<4;i++){ const y = ey - 3*u + i*1.8*u; ctx.moveTo(ex - 2.8, y - .3); ctx.lineTo(ex - .8, y + .4); } }); }
    // thin sandy hair, cropped, and going back from the brow
    const u = F.h/20, top = F.cy - 21*u; ctx.beginPath(); ctx.moveTo(-12.4, F.cy - 2); ctx.bezierCurveTo(-13.4, top + 2, -7, top - 1.4, 0, top - 1); ctx.bezierCurveTo(7, top - 1.4, 13.4, top + 2, 12.4, F.cy - 2); ctx.quadraticCurveTo(11.6, F.cy - 13, 7, F.cy - 15.6); ctx.quadraticCurveTo(0, F.cy - 18.4, -7, F.cy - 15.6); ctx.quadraticCurveTo(-11.6, F.cy - 13, -12.4, F.cy - 2);
    ctx.fillStyle = PR.lin(ctx, -13, 0, 13, 0, [[0,'#9a7a50'], [.4,'#6a5034'], [1,'#1a120a']]); ctx.fill();
    PR.strands(ctx, 44, ['rgba(200,170,120,.5)', 'rgba(90,66,40,.6)', 'rgba(40,28,16,.55)'], .45, 31, (i, r) => { const sd = r() < .5 ? -1 : 1, x0 = sd*(3 + r()*5), y0 = F.cy - 15.4 - r()*1.2, x1 = sd*(10.6 + r()*2), y1 = F.cy - 4 + r()*4; return [x0, y0, sd*9, top + 1, x1, y1]; });
    // his left hand lifted, the cord round its wrist
    ctx.fillStyle = PR.lit(ctx, '#4e3e2c', '#1a120a', -46, -20); PR.path(ctx, [[-46, 4], [-36, 4], [-24, -14], [-31, -19]]); ctx.fill(); // the sleeve
    ctx.fillStyle = PR.lin(ctx, -34, 0, -20, 0, [[0,'#c8a48a'], [.6,'#8a6650'], [1,'#3a2418']]); ctx.beginPath(); ctx.ellipse(-26, -22, 5.2, 6.4, -.5, 0, 7); ctx.fill(); PR.stroke(ctx, 'rgba(60,30,20,.45)', .45, () => { for (let i=0;i<3;i++){ ctx.moveTo(-28 + i*2, -27.6 + i*.6); ctx.lineTo(-25 + i*2, -23 + i*.6); } });
    for (let i=0;i<4;i++){ ctx.strokeStyle = i%2 ? '#9a7a48' : '#d8b880'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(-30 + i*1.2, -15.6 - i*1.4, 5.2, 2, -.6, 0, 7); ctx.stroke(); }
    return F; },
  /* Haddat: the head-cloth that is also a bandage, framing a face that has decided something; mail over a long coat; the auxiliary's faded blue on the shield behind her */
  haddat(ctx){ const F = {cy:-76, w:13, h:20.4, jaw:.84, chin:5, skin:'#8e6a4c', iris:'#2a1a0e', lip:'#7a4636', browCol:'#100806', browW:1.6, arch:.6, rim:'#cfc6b4', rimA:.15, nose:1.15, look:.15, smileL:-.35, smileR:-.3, mouthW:4, ears:false};
    // the round shield behind her left shoulder: faded blue, iron rim, the boss; a blue thread at the grip
    ctx.save(); ctx.translate(-38, -32); ell(ctx, 0, 0, 29, 31, '#121416');
    ell(ctx, 0, 0, 26.4, 28.4, PR.lin(ctx, -26, -28, 22, 28, [[0,'#7a96aa'], [.45,'#4a6478'], [1,'#141c24']]));
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 26.4, 28.4, 0, 0, 7); ctx.clip(); for (let i=0;i<16;i++){ const r = PR.rng(i + 50); PR.soft(ctx, -22 + r()*40, -24 + r()*46, 3 + r()*7, 2 + r()*4, i%2 ? '#c8c0a8' : '#1a1410', .18); } // the paint gone in patches
    PR.stroke(ctx, 'rgba(210,220,230,.18)', 1.4, () => { ctx.ellipse(0, 0, 18, 19.6, 0, 0, 7); }); ctx.restore();
    ctx.strokeStyle = PR.lin(ctx, -28, -30, 28, 30, [[0,'#aaa498'], [.5,'#54504a'], [1,'#141210']]); ctx.lineWidth = 2.8; ctx.beginPath(); ctx.ellipse(0, 0, 27.6, 29.6, 0, 0, 7); ctx.stroke();
    ell(ctx, 6, 3, 5.6, 6, PR.rad(ctx, 4.6, 1.6, .5, 6, [[0,'#e0dccc'], [.4,'#8a867c'], [1,'#22201c']])); ctx.restore();
    // a long coat under a mail shirt
    PR.torsoPath(ctx, 50, 2); ctx.fillStyle = PR.lit(ctx, '#5a4e42', '#1a1612', -50, 36); ctx.fill();
    ctx.save(); PR.torsoPath(ctx, 50, 2); ctx.clip();
    ctx.save(); PR.path(ctx, [[-52, -46], [52, -46], [52, -12], [-52, -12]]); ctx.fillStyle = PR.lit(ctx, '#8e8a82', '#2c2a26', -52, 40); ctx.fill(); PR.mail(ctx, -52, 52, -46, -12, '#8e8a82', 2); ctx.restore();
    PR.stroke(ctx, 'rgba(0,0,0,.5)', .7, () => { ctx.moveTo(-52, -12); ctx.lineTo(52, -12); }); PR.soft(ctx, 30, -20, 28, 24, '#000000', .5); PR.soft(ctx, -26, -34, 20, 10, '#e8dcc0', .1);
    ctx.fillStyle = PR.lit(ctx, '#3a2a1a', '#120c06', -50, 40); ctx.fillRect(-52, -10, 104, 4); // the belt
    ell(ctx, 16, -26, 3.6, 3.6, PR.rad(ctx, 15, -27, .4, 3.8, [[0,'#fff0c0'], [.4,'#c9a44a'], [1,'#4a3410']])); PR.stroke(ctx, 'rgba(60,40,10,.6)', .45, () => { ctx.arc(16, -26, 2.2, 0, 7); }); // the auxiliary's brass badge, polished every night
    ctx.restore();
    F.under = (ctx, F) => { PR.soft(ctx, 0, F.cy - 14, F.w*1.1, 5, '#120806', .45); PR.soft(ctx, 9, F.cy + 6, 4, 4, '#140806', .3); }; // the cloth's shadow on her brow
    PR.face(ctx, F);
    // the head-cloth: over the head, round the face, under the jaw, down over the shoulders
    const u = F.h/20, cy = F.cy, top = cy - 21*u;
    const cloth = () => { ctx.beginPath(); ctx.moveTo(-30, -40); ctx.bezierCurveTo(-26, -52, -22, cy + 4, -19, cy - 10); ctx.bezierCurveTo(-18, top - 8, 18, top - 8, 19, cy - 10); ctx.bezierCurveTo(22, cy + 4, 26, -52, 32, -40); ctx.quadraticCurveTo(0, -30, -30, -40); ctx.closePath();
      ctx.moveTo(0, cy - 15.6); ctx.bezierCurveTo(8.6, cy - 15.6, 12.4, cy - 9, 12.4, cy - 2.4); ctx.bezierCurveTo(12.4, cy + 6, 10.4, cy + 13, 6.4, cy + 17); ctx.quadraticCurveTo(3, cy + 20.2, 0, cy + 20.2); ctx.quadraticCurveTo(-3, cy + 20.2, -6.4, cy + 17); ctx.bezierCurveTo(-10.4, cy + 13, -12.4, cy + 6, -12.4, cy - 2.4); ctx.bezierCurveTo(-12.4, cy - 9, -8.6, cy - 15.6, 0, cy - 15.6); ctx.closePath(); };
    cloth(); ctx.fillStyle = PR.lin(ctx, -30, 0, 30, 0, [[0,'#ddd4be'], [.3,'#bab09a'], [.66,'#5e5646'], [1,'#16140f']]); ctx.fill('evenodd');
    ctx.save(); cloth(); ctx.clip('evenodd');
    PR.stroke(ctx, 'rgba(60,50,36,.35)', 1.1, () => { for (let i=0;i<5;i++){ ctx.moveTo(-17 + i*.6, cy - 14 + i*6); ctx.quadraticCurveTo(-24 + i*2, cy + 8 + i*5, -26 + i*4, -42 + i); ctx.moveTo(17 - i*.6, cy - 14 + i*6); ctx.quadraticCurveTo(24 - i*2, cy + 8 + i*5, 28 - i*4, -42 + i); } ctx.moveTo(-14, top - 2); ctx.quadraticCurveTo(0, top - 7, 14, top - 2); }); // folds
    PR.stroke(ctx, 'rgba(255,250,236,.22)', .8, () => { for (let i=0;i<3;i++){ ctx.moveTo(-15 + i, cy - 12 + i*7); ctx.quadraticCurveTo(-22 + i*2, cy + 8 + i*5, -24 + i*3, -44); } });
    PR.soft(ctx, 0, cy + 22, 12, 4, '#1a1410', .45); PR.soft(ctx, 20, -50, 16, 10, '#000000', .4);
    PR.stroke(ctx, 'rgba(110,40,30,.45)', 1.6, () => { ctx.moveTo(-13.6, top + 7); ctx.quadraticCurveTo(-8, top + 1, -2, top + 2); }); ctx.restore(); // an old stain where it was a bandage once
    PR.stroke(ctx, 'rgba(20,14,10,.5)', .8, () => { ctx.moveTo(0, cy - 15.6); ctx.bezierCurveTo(8.6, cy - 15.6, 12.4, cy - 9, 12.4, cy - 2.4); ctx.bezierCurveTo(12.4, cy + 6, 10.4, cy + 13, 6.4, cy + 17); ctx.quadraticCurveTo(3, cy + 20.2, 0, cy + 20.2); });
    PR.stroke(ctx, '#3a5a8a', .7, () => { ctx.moveTo(-42, 2); ctx.quadraticCurveTo(-46, -6, -44, -12); }); // the blue thread from her mother's veil
    return F; },
  /* Marrow: forty, Napan, sun-cracked, a dry mouth; the wide straw hat, the coat with too many pockets, the faceless wooden Soliel on a cord at her breast, the tally-string */
  marrow(ctx){ const F = {cy:-71, w:12.4, h:19.2, jaw:.72, chin:4.2, skin:'#a48a7c', iris:'#5a5236', lip:'#7a5a5e', browCol:'#5a544e', browW:1.2, arch:1, browL:.6, rim:'#7fb394', rimA:.2, nose:1.05, age:.9, bags:1.1, open:.88, look:-.2, smileL:.25, smileR:-.05, mouthW:3.6};
    PR.torsoPath(ctx, 34, 6); ctx.fillStyle = PR.lit(ctx, '#74705a', '#22201a', -34, 24); ctx.fill();
    ctx.save(); PR.torsoPath(ctx, 34, 6); ctx.clip();
    ctx.fillStyle = PR.lit(ctx, '#5e5a46', '#1a1812', -20, 20); PR.path(ctx, [[-8, -48], [8, -48], [3, -14], [-3, -14]]); ctx.fill(); // the shirt in the coat's V
    PR.stroke(ctx, 'rgba(0,0,0,.5)', .9, () => { ctx.moveTo(-8, -48); ctx.lineTo(-3, -14); ctx.lineTo(-4, 2); ctx.moveTo(8, -48); ctx.lineTo(3, -14); ctx.lineTo(4, 2); });
    [[-26, -30, 9, 8], [-24, -14, 10, 9], [14, -32, 8, 7], [16, -14, 10, 9], [-12, -6, 6, 6]].forEach(([x, y, w, hh], i) => { ctx.fillStyle = i < 2 || i === 4 ? 'rgba(130,130,100,.3)' : 'rgba(0,0,0,.25)'; ctx.fillRect(x, y, w, hh); PR.stroke(ctx, 'rgba(10,10,6,.6)', .5, () => { ctx.rect(x, y, w, hh); }); ctx.fillStyle = i < 2 || i === 4 ? '#7e7a62' : '#2e2c22'; ctx.fillRect(x - .4, y - .6, w + .8, 2.6); ell(ctx, x + w/2, y + 1.4, .7, .7, '#a8a08a'); }); // pockets, and more pockets
    PR.stroke(ctx, 'rgba(220,220,230,.8)', .4, () => { ctx.moveTo(-12, -42); ctx.lineTo(-10.6, -35); ctx.moveTo(-14, -41); ctx.lineTo(-12.8, -34.6); }); // needles in the lapel
    PR.stroke(ctx, '#c8b890', .5, () => { ctx.moveTo(18, -14); ctx.quadraticCurveTo(20, -6, 17, 2); }); for (let i=0;i<5;i++) ell(ctx, 18.6 - i*.3, -11 + i*2.6, .9, .7, '#a89870'); // the tally-string, knotted
    PR.soft(ctx, 24, -20, 18, 18, '#000000', .45); ctx.restore();
    PR.neck(ctx, F, 6);
    // the little wooden Soliel on a cord, faceless with handling
    PR.stroke(ctx, '#2a2018', .6, () => { ctx.moveTo(-6, -47); ctx.quadraticCurveTo(-7, -38, -4.6, -31); ctx.moveTo(6, -47); ctx.quadraticCurveTo(2, -36, -3.4, -31); });
    ctx.fillStyle = PR.lin(ctx, -8, 0, 0, 0, [[0,'#e0c494'], [.6,'#a07a4a'], [1,'#4a3418']]); ctx.beginPath(); ctx.ellipse(-4, -29.4, 1.9, 2.1, 0, 0, 7); ctx.fill(); PR.path(ctx, [[-5.6, -27.6], [-2.4, -27.6], [-1.4, -19.4], [-6.6, -19.4]]); ctx.fill(); PR.soft(ctx, -4.8, -30, 1, 1, '#fff4dc', .5);
    F.under = (ctx, F) => { const u = F.h/20; PR.soft(ctx, 0, F.cy - 13*u, F.w*1.3, 5, '#100608', .55); // the brim's shadow
      PR.stroke(ctx, 'rgba(40,20,24,.3)', .4, () => { for (let i=0;i<4;i++){ ctx.moveTo(-F.w*.9, F.cy + (2 + i*2.4)*u); ctx.lineTo(-F.w*.7, F.cy + (2.6 + i*2.4)*u); } }); PR.dots(ctx, F, 30, 'rgba(60,40,50,.25)', .5, [-2, 9]); PR.soft(ctx, F.w*.45, F.cy + 4*u, F.w*.6, 6*u, '#3a4a7a', .2); PR.soft(ctx, -F.w*.3, F.cy + 14*u, F.w*.5, 3*u, '#4a5a8a', .12); }; // sun-cracks, spots; the Napan blue in the shadows
    PR.face(ctx, F);
    [-1, 1].forEach(sd => PR.strands(ctx, 18, sd < 0 ? ['#b0aaa2', '#8a847c', '#5a5450'] : ['#6a645e', '#3a3632'], .55, 40 + sd, (i, r) => { const x = sd*(10.4 + r()*2.4), y = F.cy - 14 + r()*4; return [x, y, x + sd*2.4, y + 5, x + sd*(1.4 + r()*1.4), y + 11 + r()*4]; })); // grey hair pulled back under the hat
    // the hat: a wide straw brim, a low crown, a faded green band
    const hy = F.cy - 13.4; ell(ctx, 1, hy + 1.6, 32, 7.6, 'rgba(0,0,0,.35)');
    ctx.beginPath(); ctx.ellipse(0, hy, 31, 7.2, 0, 0, 7); ctx.fillStyle = PR.lin(ctx, -31, 0, 31, 0, [[0,'#d8c08a'], [.35,'#a88e60'], [.75,'#4a3c24'], [1,'#14100a']]); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, hy, 31, 7.2, 0, 0, 7); ctx.clip(); PR.stroke(ctx, 'rgba(60,44,20,.35)', .4, () => { for (let i=0;i<5;i++){ ctx.ellipse(0, hy, 31 - i*4, 7.2 - i*.9, 0, 0, 7); } }); ctx.fillStyle = 'rgba(20,12,6,.4)'; ctx.fillRect(-31, hy + 2.4, 62, 6); ctx.restore(); // the weave, the underside
    ctx.beginPath(); ctx.moveTo(-14.6, hy - .6); ctx.bezierCurveTo(-15.4, hy - 13, -9, hy - 17.4, 0, hy - 17.4); ctx.bezierCurveTo(9, hy - 17.4, 15.4, hy - 13, 14.6, hy - .6); ctx.quadraticCurveTo(0, hy + 2.2, -14.6, hy - .6); ctx.fillStyle = PR.lin(ctx, -15, 0, 15, 0, [[0,'#e0c894'], [.4,'#b0966a'], [.8,'#4e4028'], [1,'#16120a']]); ctx.fill();
    PR.stroke(ctx, 'rgba(70,52,24,.4)', .4, () => { for (let i=0;i<4;i++){ ctx.moveTo(-13.6 + i, hy - 4 - i*3.4); ctx.quadraticCurveTo(0, hy - 6 - i*3.4, 13.6 - i, hy - 4 - i*3.4); } });
    ctx.fillStyle = PR.lin(ctx, -15, 0, 15, 0, [[0,'#9ac8ac'], [.5,'#5a8a6c'], [1,'#1a2a20']]); ctx.beginPath(); ctx.moveTo(-14.8, hy - 1.8); ctx.quadraticCurveTo(0, hy + .6, 14.8, hy - 1.8); ctx.lineTo(14.6, hy - 4.4); ctx.quadraticCurveTo(0, hy - 2, -14.6, hy - 4.4); ctx.closePath(); ctx.fill();
    PR.soft(ctx, -8, hy - 12, 6, 3, '#fff0d0', .2, -.4);
    return F; },
});

/* ---------------- ground: TILEX[style](ctx, ch, x, y, T, dark) — Hissar in the rising, and the Odhan ---------------- */
/* broad soft light and dark laid in world space, so neighbouring tiles agree and the ground reads as one field */
function b2Mottle(ctx, x, y, T, lit, dk, light = '255,236,200', sz = 1){ const px = x*T, py = y*T;
  for (let gy=y-3; gy<=y+3; gy++) for (let gx=x-3; gx<=x+3; gx++){ const cx = (gx + hash(gx,gy,91))*T, cy = (gy + hash(gx,gy,92))*T, r = T*(.8 + hash(gx,gy,93)*1.5)*sz, l = hash(gx,gy,94) > .55;
    if (cx + r < px || cx - r > px + T || cy + r < py || cy - r > py + T) continue;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, l ? `rgba(${light},${lit})` : `rgba(0,0,0,${dk})`); g.addColorStop(1, l ? `rgba(${light},0)` : 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); } }
/* a soft blot of colour, round and fading, squashed to ry/rx */
function b2Soft(ctx, x, y, r, sq, rgb, a){ ctx.save(); ctx.translate(x, y); ctx.scale(1, sq); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(-r, -r, r*2, r*2); ctx.restore(); }
/* firelight from every fire within a few tiles, laid in world space over this tile */
function b2Firelit(ctx, x, y, T, a, rad = 3.4, col = '255,140,60'){ if (!tileMap) return; const px = x*T, py = y*T, n = Math.ceil(rad);
  for (let dy=-n; dy<=n; dy++) for (let dx=-n; dx<=n; dx++){ const row = tileMap[y + dy]; if (!row || row[x + dx] !== 'F') continue;
    const cx = (x + dx + .5)*T, cy = (y + dy + .6)*T, R = T*rad, g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(.35, `rgba(${col},${a*.45})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); } }
const b2At = (x, y, c) => !!tileMap && !!tileMap[y] && tileMap[y][x] === c;
/* a small fire: charred wood, embers, a tongue or two of flame, and its own glow */
function b2Flames(ctx, cx, cy, T, k = 1){ glow(ctx, cx, cy - T*.1*k, T*.45*k, '#ff8a30', .4); ell(ctx, cx, cy + T*.04*k, T*.24*k, T*.08*k, '#140804');
  [[-.16,.02,.3],[.12,-.02,-.4],[.02,.04,.1]].forEach(([dx, dy, a]) => { ctx.save(); ctx.translate(cx + dx*T*k, cy + dy*T*k); ctx.rotate(a); ctx.fillStyle = '#1a0e08'; ctx.fillRect(-T*.16*k, -T*.03*k, T*.32*k, T*.06*k); ctx.fillStyle = 'rgba(255,120,40,.7)'; ctx.fillRect(-T*.05*k, -T*.03*k, T*.1*k, T*.02*k); ctx.restore(); });
  poly(ctx, [[cx - T*.14*k, cy],[cx - T*.06*k, cy - T*.3*k],[cx, cy - T*.12*k],[cx + T*.05*k, cy - T*.38*k],[cx + T*.14*k, cy]], '#e8642a'); poly(ctx, [[cx - T*.07*k, cy],[cx - T*.02*k, cy - T*.16*k],[cx + T*.03*k, cy - T*.24*k],[cx + T*.08*k, cy]], '#ffc060'); ell(ctx, cx, cy - T*.02*k, T*.05*k, T*.03*k, '#fff0c0');
  for (let i=0;i<4;i++) { ctx.fillStyle = 'rgba(255,190,90,.8)'; ctx.fillRect(cx + (hash(i, Math.round(cx), 3) - .5)*T*.5*k, cy - T*(.35 + hash(i, Math.round(cy), 4)*.3)*k, 1.2, 1.2); } }

/* Hissar during the rising: packed streets, ash and rubble, mud-brick and plaster, and the city burning. dark = night (the usual) */
TILEX.hissar = (ctx, ch, x, y, T, dark) => { ctx.save(); ctx.beginPath(); ctx.rect(x*T, y*T, T, T); ctx.clip(); b2Hissar(ctx, ch, x, y, T, dark); ctx.restore(); };
function b2Hissar(ctx, ch, x, y, T, dark){
  const px = x*T, py = y*T, h = hash(x,y), N = !!dark;
  const fill = c => { ctx.fillStyle = c; ctx.fillRect(px, py, T, T); };
  const speck = (c, n, s = 1, sz = .05) => { ctx.fillStyle = c; for (let i=0;i<n;i++) ctx.fillRect(px + hash(x,y,i+s)*T, py + hash(y,x,i+s+9)*T, Math.max(1, T*sz), Math.max(1, T*sz)); };
  const street = () => { fill(shade(N ? '#2c241e' : '#6a5a46', (h - .5)*.025)); b2Mottle(ctx, x, y, T, N ? .035 : .07, N ? .22 : .14, '255,236,200', 1.3);
    speck(N ? '#3e342a' : '#8a7860', 5, 2); speck(N ? '#16120e' : '#463a2c', 3, 30, .04);
    if (h > .78) for (let i=0;i<2;i++){ const a = hash(x,y,i+7), b = hash(y,x,i+7), r = T*(.03 + hash(x,y,i+60)*.03); ell(ctx, px + a*T, py + b*T, r, r*.7, N ? '#1a1410' : '#3e3226'); ell(ctx, px + a*T - r*.3, py + b*T - r*.3, r*.45, r*.3, N ? 'rgba(150,120,90,.2)' : 'rgba(220,200,160,.3)'); } }; // stones, lit from above
  const ash = () => { street(); for (let i=0;i<3;i++) b2Soft(ctx, px + T*(.2 + hash(x,y,i+80)*.6), py + T*(.2 + hash(y,x,i+80)*.6), T*(.22 + hash(x,y,i+83)*.14), .6, N ? '150,142,134' : '190,180,170', N ? .2 : .26); // ash in drifts
    for (let i=0;i<4;i++){ const bx = px + hash(x,y,i+40)*T*.86, by = py + hash(y,x,i+41)*T*.86, w = T*(.06 + hash(x,y,i+42)*.08); ctx.save(); ctx.translate(bx, by); ctx.rotate(hash(x,y,i+43)*3); ctx.fillStyle = N ? (i%2 ? '#3a2c22' : '#2a201a') : (i%2 ? '#8a6a4a' : '#6a523a'); ctx.fillRect(0, 0, w, w*.6); ctx.fillStyle = N ? 'rgba(255,170,100,.12)' : 'rgba(255,240,210,.2)'; ctx.fillRect(0, 0, w, 1); ctx.restore(); } // broken mud-brick
    if (hash(x,y,9) > .6) { ctx.save(); ctx.translate(px + T*.5, py + T*.55); ctx.rotate(hash(x,y,10)*3); ctx.fillStyle = '#120a06'; ctx.fillRect(-T*.3, -T*.04, T*.6, T*.08); if (N) { ctx.fillStyle = 'rgba(255,110,40,.55)'; ctx.fillRect(-T*.08, -T*.04, T*.12, T*.03); } ctx.restore(); } // a charred beam, still glowing
    speck(N ? '#0a0806' : '#2a2018', 6, 50, .05); };
  const roof = (face) => { // flat roofs of plaster over mud-brick; the odd dome; the front face where the block meets the street
    const base = N ? '#2a221c' : '#9a8464'; fill(shade(base, (h - .5)*.08)); b2Mottle(ctx, x, y, T, N ? .03 : .06, N ? .25 : .16);
    ctx.strokeStyle = N ? 'rgba(0,0,0,.35)' : 'rgba(70,52,34,.3)'; ctx.lineWidth = 1; for (let i=0;i<2;i++){ const sx = px + hash(x,y,i+20)*T, sy = py + hash(y,x,i+21)*T; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + (hash(x,y,i+22) - .5)*T*.4, sy + hash(x,y,i+23)*T*.3); ctx.stroke(); } // cracks in the plaster
    const up = b2At(x, y-1, '#'), lf = b2At(x-1, y, '#'), rt = b2At(x+1, y, '#');
    if (!up) { ctx.fillStyle = N ? 'rgba(255,170,110,.14)' : 'rgba(255,244,220,.35)'; ctx.fillRect(px, py, T, T*.07); } if (!lf) { ctx.fillStyle = N ? 'rgba(255,170,110,.08)' : 'rgba(255,244,220,.2)'; ctx.fillRect(px, py, T*.06, T); } if (!rt) { ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(px + T*.94, py, T*.06, T); } // parapets
    if (!face && hash(x,y,5) > .72) { const cx = px + T*.5, cy = py + T*.46, r = T*.3; ell(ctx, cx + r*.18, cy + r*.22, r*1.02, r*.9, 'rgba(0,0,0,.35)'); const g = ctx.createRadialGradient(cx - r*.35, cy - r*.4, r*.05, cx, cy, r); g.addColorStop(0, N ? '#6a5848' : '#e8dcc0'); g.addColorStop(.6, N ? '#3a3028' : '#a8946c'); g.addColorStop(1, N ? '#141010' : '#5a4a34'); ell(ctx, cx, cy, r, r, g); ell(ctx, cx, cy - r*1.02, T*.03, T*.05, N ? '#4a3a2a' : '#6a5a40'); } // a dome
    else if (!face && hash(x,y,6) > .55) { ctx.fillStyle = N ? '#120e0c' : '#5a4a36'; ctx.fillRect(px + T*.3, py + T*.34, T*.22, T*.22); ctx.fillStyle = N ? 'rgba(255,170,110,.1)' : 'rgba(255,240,210,.2)'; ctx.fillRect(px + T*.3, py + T*.34, T*.22, 1); ell(ctx, px + T*.72, py + T*.66, T*.07, T*.07, N ? '#3a2c22' : '#8a5a3a'); } // a roof hatch, a jar
    if (face) { const fy = py + T*.58; ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(px, fy - T*.03, T, T*.04); // the parapet's shadow
      ctx.fillStyle = shade(N ? '#201a16' : '#7a664c', (h - .5)*.06); ctx.fillRect(px, fy, T, T*.42); ctx.fillStyle = N ? '#2a201a' : '#8a6a4a'; for (let i=0;i<3;i++) if (hash(x,y,i+30) > .5) { const bx = px + hash(x,y,i+31)*T*.7, by = fy + T*(.08 + hash(x,y,i+32)*.2); for (let r=0;r<2;r++) for (let c=0;c<2;c++) ctx.fillRect(bx + c*T*.11 + (r%2)*T*.05, by + r*T*.06, T*.1, T*.05); } // brick where the plaster has gone
      if (hash(x,y,8) > .45) { const wx = px + T*(.3 + hash(x,y,11)*.3); ctx.fillStyle = N && hash(x,y,12) > .5 ? 'rgba(255,150,70,.8)' : '#0a0806'; ctx.beginPath(); ctx.moveTo(wx, fy + T*.32); ctx.lineTo(wx, fy + T*.14); ctx.arc(wx + T*.06, fy + T*.14, T*.06, Math.PI, 0); ctx.lineTo(wx + T*.12, fy + T*.32); ctx.fill(); } // a window slit, lit or dark
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(px, py + T*.92, T, T*.08); }
    if (N && hash(x,y,7) > .86) { b2Flames(ctx, px + T*.5, py + T*(face ? .4 : .62), T, .9); } }; // a roof on fire
  if (ch === '#') { roof(!b2At(x, y+1, '#')); if (N) b2Firelit(ctx, x, y, T, .22); return; }
  if (ch === 'D') { roof(true); const fy = py + T*.58, cx = px + T*.5; ctx.fillStyle = '#060404'; ctx.beginPath(); ctx.moveTo(cx - T*.2, py + T); ctx.lineTo(cx - T*.2, fy + T*.08); ctx.arc(cx, fy + T*.08, T*.2, Math.PI, 0); ctx.lineTo(cx + T*.2, py + T); ctx.fill(); // an arched doorway
    ctx.fillStyle = N ? 'rgba(255,150,70,.18)' : 'rgba(40,28,18,.6)'; ctx.fillRect(cx - T*.16, py + T*.86, T*.32, T*.14); ctx.strokeStyle = N ? '#3a2c20' : '#b8a07a'; ctx.lineWidth = Math.max(1, T*.03); ctx.beginPath(); ctx.arc(cx, fy + T*.08, T*.22, Math.PI, 0); ctx.stroke(); if (N) b2Firelit(ctx, x, y, T, .22); return; }
  if (ch === ',') ash(); else street();
  if (ch === 'F') { ash(); b2Flames(ctx, px + T*.5, py + T*.66, T, 1.3); }
  else if (ch === 'w') { const cx = px + T*.5, cy = py + T*.56; ell(ctx, cx + T*.04, cy + T*.06, T*.4, T*.3, 'rgba(0,0,0,.45)'); ell(ctx, cx, cy, T*.38, T*.28, N ? '#4a4038' : '#b0a084'); ell(ctx, cx, cy - T*.02, T*.26, T*.18, '#050404'); ell(ctx, cx - T*.05, cy - T*.04, T*.12, T*.04, N ? 'rgba(255,150,80,.22)' : 'rgba(140,170,190,.25)'); // the well: a stone ring, black water
    ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(70,56,40,.5)'; ctx.lineWidth = 1; for (let i=0;i<8;i++){ const a = i/8*6.28; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a)*T*.27, cy + Math.sin(a)*T*.19); ctx.lineTo(cx + Math.cos(a)*T*.38, cy + Math.sin(a)*T*.28); ctx.stroke(); }
    ctx.fillStyle = N ? '#2a1e14' : '#5a4430'; ctx.fillRect(px + T*.14, py + T*.12, T*.06, T*.5); ctx.fillRect(px + T*.8, py + T*.12, T*.06, T*.5); ctx.fillRect(px + T*.12, py + T*.12, T*.76, T*.05); // the frame
    ctx.strokeStyle = N ? '#5a4a36' : '#9a8460'; ctx.beginPath(); ctx.moveTo(cx, py + T*.16); ctx.lineTo(cx, py + T*.36); ctx.stroke(); ctx.fillStyle = N ? '#3a2a1a' : '#6a4a2a'; ctx.fillRect(cx - T*.06, py + T*.34, T*.12, T*.1); }
  else if (ch === 'c') { ell(ctx, px + T*.54, py + T*.8, T*.42, T*.1, 'rgba(0,0,0,.45)'); ctx.save(); ctx.translate(px + T*.5, py + T*.5); ctx.rotate((h - .5)*.6); // a cart, left where it stopped
    ctx.fillStyle = N ? '#2a1e14' : '#6a4a2c'; ctx.fillRect(-T*.36, -T*.18, T*.6, T*.36); ctx.fillStyle = N ? '#3a2a1c' : '#8a6a44'; ctx.fillRect(-T*.36, -T*.18, T*.6, T*.06); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1; for (let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(-T*.36 + i*T*.15, -T*.12); ctx.lineTo(-T*.36 + i*T*.15, T*.18); ctx.stroke(); }
    ctx.fillStyle = N ? '#1e140c' : '#4a3420'; ctx.fillRect(T*.24, -T*.03, T*.24, T*.04); ctx.fillRect(T*.24, T*.06, T*.24, T*.04); // the shafts
    ell(ctx, -T*.18, T*.24, T*.12, T*.05, '#120c08'); ell(ctx, T*.1, T*.24, T*.12, T*.05, '#120c08');
    ell(ctx, -T*.16, -T*.04, T*.1, T*.08, N ? '#4a3e30' : '#b8a882'); ell(ctx, T*.02, -T*.02, T*.09, T*.07, N ? '#3e3428' : '#a8987a'); ctx.restore(); } // sacks
  else if (ch === 'p') { const cx = px + T*.52, cy = py + T*.5; ell(ctx, cx + T*.12, cy + T*.3, T*.34, T*.12, 'rgba(0,0,0,.4)'); ctx.strokeStyle = N ? '#2a1e14' : '#6a5034'; ctx.lineWidth = Math.max(1.5, T*.07); ctx.beginPath(); ctx.moveTo(cx, cy + T*.36); ctx.quadraticCurveTo(cx - T*.04, cy + T*.1, cx, cy - T*.04); ctx.stroke(); // a date palm, from above
    for (let i=0;i<9;i++){ const a = i/9*6.28 + h, len = T*(.32 + hash(x,y,i+50)*.1), ex = cx + Math.cos(a)*len, ey = cy - T*.04 + Math.sin(a)*len*.7; ctx.strokeStyle = N ? (i%2 ? '#141a10' : '#1c2414') : (i%2 ? '#3a4a24' : '#52623a'); ctx.lineWidth = Math.max(1.4, T*.05); ctx.beginPath(); ctx.moveTo(cx, cy - T*.04); ctx.quadraticCurveTo((cx + ex)/2, (cy + ey)/2 - T*.1, ex, ey); ctx.stroke(); }
    ell(ctx, cx, cy - T*.04, T*.06, T*.05, N ? '#2a2014' : '#7a5a2a'); }
  else if (ch === '=') { const top = py + T*.1, bot = py + T*.62; ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(px + T*.06, bot, T*.9, T*.26); // a market awning, striped, torn
    for (let i=0;i<5;i++){ ctx.fillStyle = N ? (i%2 ? '#3a2018' : '#3a3020') : (i%2 ? '#8a3a2a' : '#c8a868'); ctx.fillRect(px + i*T*.2, top, T*.2, bot - top); } ctx.fillStyle = 'rgba(255,250,230,.08)'; ctx.fillRect(px, top, T, T*.08);
    for (let i=0;i<5;i++){ ctx.fillStyle = N ? (i%2 ? '#3a2018' : '#3a3020') : (i%2 ? '#8a3a2a' : '#c8a868'); ctx.beginPath(); ctx.arc(px + T*(.1 + i*.2), bot, T*.1, 0, Math.PI); ctx.fill(); }
    if (h > .5) { ctx.fillStyle = N ? '#2c241e' : '#6a5a46'; poly(ctx, [[px + T*.52, top + T*.18],[px + T*.7, top + T*.1],[px + T*.62, bot]], ctx.fillStyle); }
    ctx.fillStyle = N ? '#1e140c' : '#4a3420'; ctx.fillRect(px + T*.04, top, T*.05, T*.8); ctx.fillRect(px + T*.91, top, T*.05, T*.8); }
  else if (ch === 'g') { fill(N ? '#30281f' : '#8a7a62'); ctx.strokeStyle = N ? 'rgba(0,0,0,.6)' : 'rgba(50,40,28,.55)'; ctx.lineWidth = 1; for (let r=0;r<2;r++){ const off = (r + y)%2 ? T*.5 : 0; ctx.beginPath(); ctx.moveTo(px, py + r*T*.5); ctx.lineTo(px + T, py + r*T*.5); ctx.moveTo(px + off + T*.02, py + r*T*.5); ctx.lineTo(px + off + T*.02, py + (r + 1)*T*.5); ctx.stroke(); } // gate stones: big dressed blocks, worn
    ctx.fillStyle = N ? 'rgba(255,190,130,.06)' : 'rgba(255,248,230,.16)'; ctx.fillRect(px + T*.05, py + T*.04, T*.4, T*.06); ctx.fillRect(px + T*.55, py + T*.54, T*.4, T*.06); b2Mottle(ctx, x, y, T, .03, .14); ctx.strokeStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(60,44,28,.25)'; ctx.beginPath(); ctx.moveTo(px, py + T*.72); ctx.lineTo(px + T, py + T*.7); ctx.stroke(); }
  else if (ch === '~') { const vert = (b2At(x, y-1, '~') || b2At(x, y+1, '~')) && !(b2At(x-1, y, '~') || b2At(x+1, y, '~')); if (vert) { ctx.translate(px + T/2, py + T/2); ctx.rotate(Math.PI/2); ctx.translate(-px - T/2, -py - T/2); }
    fill(N ? '#3a3028' : '#9a8668'); ctx.fillStyle = N ? '#0a0c10' : '#1c2a30'; ctx.fillRect(px, py + T*.24, T, T*.52); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(px, py + T*.24, T, T*.08); // a stone channel, the water low in it
    ctx.strokeStyle = N ? 'rgba(255,150,80,.25)' : 'rgba(170,200,210,.25)'; ctx.lineWidth = 1; for (let i=0;i<2;i++){ const yy = py + T*(.42 + i*.16); ctx.beginPath(); ctx.moveTo(px + hash(x,y,i)*T*.4, yy); ctx.lineTo(px + T*(.5 + hash(x,y,i+3)*.4), yy); ctx.stroke(); }
    ctx.fillStyle = N ? 'rgba(255,180,120,.1)' : 'rgba(255,248,230,.25)'; ctx.fillRect(px, py + T*.2, T, T*.04); ctx.fillRect(px, py + T*.76, T, T*.03); }
  else exitArrow(ctx, ch, px, py, T);
  if (N) b2Firelit(ctx, x, y, T, .3); else b2Firelit(ctx, x, y, T, .12, 2.4);
}

/* the Odhan: scrub-desert, cracked hardpan, sand, red rock; harsh glare by day, blue-black and fire-lit by night */
function b2Odhan(ctx, ch, x, y, T, N){
  const px = x*T, py = y*T, h = hash(x,y);
  const P = N ? {pan:'#2a2c34', scrub:'#262a2e', sand:'#363840', rock:'#1e1e26', rockL:'#34343e', rockD:'#0c0c10', bush:'#1a2024', bushL:'#2a3236', crack:'rgba(0,0,0,.35)', lit:'200,210,240', sandRGB:'54,56,64'}
              : {pan:'#b8a47e', scrub:'#ac9a74', sand:'#d2bc8e', rock:'#9a7452', rockL:'#c8a070', rockD:'#4a3222', bush:'#6e7050', bushL:'#9a9a6c', crack:'rgba(90,66,40,.38)', lit:'255,250,235', sandRGB:'210,188,142'};
  const fill = c => { ctx.fillStyle = c; ctx.fillRect(px, py, T, T); };
  const ground = (c = P.pan) => { fill(shade(P.pan, (h - .5)*.02)); b2Mottle(ctx, x, y, T, N ? .025 : .1, N ? .2 : .12, P.lit, 1.2);
    { ctx.strokeStyle = P.crack; ctx.lineWidth = 1; ctx.beginPath(); for (let i=0;i<4;i++){ const sx = px + hash(x,y,i+10)*T, sy = py + hash(y,x,i+11)*T; ctx.moveTo(sx, sy); const mx = sx + (hash(x,y,i+12) - .5)*T*.5, my = sy + (hash(x,y,i+13) - .5)*T*.5; ctx.lineTo(mx, my); ctx.lineTo(mx + (hash(x,y,i+14) - .5)*T*.3, my + (hash(x,y,i+15) - .5)*T*.3); } ctx.stroke(); // the hardpan cracked in plates
      ctx.fillStyle = N ? 'rgba(160,170,200,.06)' : 'rgba(255,250,235,.16)'; for (let i=0;i<4;i++) ctx.fillRect(px + hash(x,y,i+16)*T, py + hash(y,x,i+17)*T, T*.12, 1); }
    ctx.fillStyle = N ? '#14161c' : '#7a6a4e'; for (let i=0;i<4;i++) ctx.fillRect(px + hash(x,y,i+20)*T, py + hash(y,x,i+21)*T, Math.max(1, T*.04), Math.max(1, T*.04)); // grit
    for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) if (b2At(x + dx, y + dy, 's')) for (let k=0;k<2;k++) b2Soft(ctx, (x + dx + .3 + hash(x+dx, y+dy, 60+k)*.4)*T, (y + dy + .3 + hash(x+dx, y+dy, 62+k)*.4)*T, T*(.85 + hash(x+dx, y+dy, 64+k)*.3), 1, P.sandRGB, .75); // sand lying in soft drifts, the same drift on every tile it touches
    if (c === P.sand) { ctx.strokeStyle = N ? 'rgba(0,0,0,.14)' : 'rgba(150,120,80,.22)'; ctx.lineWidth = 1; for (let i=0;i<3;i++){ const yy = py + T*(.2 + i*.3) + (hash(x,y,i)*2 - 1)*T*.04; ctx.beginPath(); ctx.moveTo(px + T*.1, yy); ctx.quadraticCurveTo(px + T*.5, yy - T*.08 + ((x + i)%2)*T*.08, px + T*.9, yy); ctx.stroke(); } } // wind ripples
    if (b2At(x - 1, y, '#')) { const g = ctx.createLinearGradient(px, 0, px + T*.4, 0); g.addColorStop(0, N ? 'rgba(0,0,0,.4)' : 'rgba(60,36,20,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(px, py, T*.4, T); } // the rock's shadow, the sun high on the left
  };
  const bush = (cx, cy, r) => { ell(ctx, cx + r*.4, cy + r*.4, r*1.1, r*.5, N ? 'rgba(0,0,0,.35)' : 'rgba(70,50,30,.3)'); for (let i=0;i<6;i++){ const a = i/6*6.28 + h*3; ell(ctx, cx + Math.cos(a)*r*.5, cy + Math.sin(a)*r*.4, r*.45, r*.35, i < 3 ? P.bush : shade(P.bush, -.2)); } ell(ctx, cx - r*.2, cy - r*.22, r*.4, r*.25, P.bushL);
    ctx.strokeStyle = N ? 'rgba(40,46,50,.8)' : 'rgba(90,80,56,.8)'; ctx.lineWidth = 1; for (let i=0;i<4;i++){ const a = i*1.6 + h; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a)*r*1.3, cy + Math.sin(a)*r*1.1); ctx.stroke(); } }; // dry brush, thorny
  const stone = (cx, cy, r) => { ell(ctx, cx + r*.35, cy + r*.4, r*1.05, r*.55, N ? 'rgba(0,0,0,.4)' : 'rgba(70,46,26,.35)'); ell(ctx, cx, cy, r, r*.72, P.rock); ell(ctx, cx - r*.25, cy - r*.22, r*.55, r*.35, P.rockL); ctx.fillStyle = N ? 'rgba(0,0,0,.3)' : 'rgba(60,36,20,.3)'; ctx.fillRect(cx - r*.6, cy + r*.1, r*1.2, 1); };
  if (ch === '#') { // a rock outcrop: layered sandstone, ragged where it meets open ground
    ground(); const nb = [b2At(x, y-1, '#'), b2At(x+1, y, '#'), b2At(x, y+1, '#'), b2At(x-1, y, '#')], ins = i => nb[i] ? -T*.02 : T*(.08 + hash(x,y,i+30)*.12);
    const pts = []; for (let i=0;i<4;i++) pts.push([px + T*(.25 + i*.25), py + (i === 3 ? T*.0 : 0)]); // (top edge, filled below)
    const P2 = [[px - (nb[3] ? T*.02 : 0) + (nb[3] ? 0 : ins(3)), py + ins(0)], [px + T*.33, py + ins(0)*(.6 + hash(x,y,40)*.8)], [px + T*.66, py + ins(0)*(.5 + hash(x,y,41)*.9)], [px + T - (nb[1] ? -T*.02 : ins(1)), py + ins(0)],
      [px + T - ins(1)*(.5 + hash(x,y,42)), py + T*.5], [px + T - ins(1), py + T - ins(2)], [px + T*.5, py + T - ins(2)*(.4 + hash(x,y,43))], [px + ins(3), py + T - ins(2)], [px + ins(3)*(.4 + hash(x,y,44)), py + T*.5]];
    if (!nb[2] || !nb[1]) { ctx.save(); ctx.translate(T*.08, T*.1); poly(ctx, P2, N ? 'rgba(0,0,0,.45)' : 'rgba(60,36,20,.35)'); ctx.restore(); } // its shadow
    const g = ctx.createLinearGradient(px, py, px + T, py + T); g.addColorStop(0, P.rockL); g.addColorStop(.5, P.rock); g.addColorStop(1, P.rockD); poly(ctx, P2, g);
    ctx.save(); poly(ctx, P2); ctx.clip(); ctx.strokeStyle = N ? 'rgba(0,0,0,.35)' : 'rgba(60,34,18,.4)'; ctx.lineWidth = Math.max(1, T*.025); for (let i=0;i<4;i++){ const yy = (y + i*.27 + .12)*T; ctx.beginPath(); ctx.moveTo(px, yy + Math.sin(x*2 + i)*T*.04); ctx.lineTo(px + T, yy + Math.sin(x*2 + 2 + i)*T*.04); ctx.stroke(); } // strata, continuous across the block
      ctx.fillStyle = N ? 'rgba(150,160,200,.08)' : 'rgba(255,240,210,.22)'; for (let i=0;i<4;i++){ const yy = (y + i*.27 + .14)*T; ctx.fillRect(px, yy + Math.sin(x*2 + i)*T*.04, T, 1); }
      b2Mottle(ctx, x, y, T, N ? .02 : .06, .2, P.lit, .7); if (!nb[0]) { ctx.fillStyle = N ? 'rgba(170,180,220,.1)' : 'rgba(255,246,220,.3)'; ctx.fillRect(px, py, T, T*.14); } ctx.restore();
    if (N) b2Firelit(ctx, x, y, T, .2); return; }
  ground(ch === 's' ? P.sand : P.pan); // (sand: the hardpan under the drift)
  if (ch === ',') { bush(px + T*(.3 + hash(x,y,50)*.15), py + T*(.35 + hash(x,y,51)*.2), T*.14); if (h > .35) bush(px + T*(.65 + hash(x,y,52)*.15), py + T*(.65 + hash(x,y,53)*.15), T*.1);
    ctx.strokeStyle = N ? 'rgba(60,70,70,.5)' : 'rgba(140,130,90,.6)'; ctx.lineWidth = 1; for (let i=0;i<5;i++){ const gx = px + hash(x,y,i+60)*T, gy = py + T*.4 + hash(y,x,i+61)*T*.55; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + (hash(x,y,i+62) - .5)*3, gy - T*.12); ctx.stroke(); } }
  else if (ch === 'r') { stone(px + T*.36, py + T*.42, T*.2); stone(px + T*.66, py + T*.66, T*.13); if (h > .5) stone(px + T*.24, py + T*.74, T*.07); }
  else if (ch === 'x') { const cx = px + T*.48, cy = py + T*.74; ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(80,56,32,.35)'; ctx.lineWidth = Math.max(1.5, T*.05); ctx.beginPath(); ctx.moveTo(cx + T*.04, cy + T*.04); ctx.lineTo(cx + T*.4, cy + T*.16); ctx.stroke(); // a dead tree, bleached, and its shadow
    const br = (x0, y0, a, len, w, d) => { const x1 = x0 + Math.cos(a)*len, y1 = y0 + Math.sin(a)*len; ctx.strokeStyle = N ? '#4a4c56' : '#d0c4a8'; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(80,60,40,.45)'; ctx.lineWidth = w*.4; ctx.beginPath(); ctx.moveTo(x0 + w*.3, y0); ctx.lineTo(x1 + w*.3, y1); ctx.stroke(); if (d > 0) { br(x1, y1, a - .5 - hash(x, d, 7)*.4, len*.66, w*.62, d - 1); br(x1, y1, a + .45 + hash(y, d, 8)*.4, len*.6, w*.6, d - 1); } };
    br(cx, cy, -Math.PI/2 - .1, T*.26, Math.max(1.6, T*.07), 2); ctx.lineCap = 'butt'; }
  else if (ch === 'b') { const cx = px + T*.5, cy = py + T*.55, bc = N ? '#5a5c66' : '#e8e0cc'; ctx.save(); ctx.translate(cx, cy); ctx.rotate((h - .5)*1.4); // bones: a rib-cage, a long bone, a skull, half in the dust
    ctx.strokeStyle = bc; ctx.lineWidth = Math.max(1, T*.03); ctx.beginPath(); ctx.moveTo(-T*.28, 0); ctx.lineTo(T*.14, 0); ctx.stroke(); for (let i=0;i<5;i++){ const rx = -T*.24 + i*T*.08; ctx.beginPath(); ctx.moveTo(rx, 0); ctx.quadraticCurveTo(rx - T*.06, -T*.1, rx - T*.02, -T*.18); ctx.moveTo(rx, 0); ctx.quadraticCurveTo(rx - T*.06, T*.1, rx - T*.02, T*.17); ctx.stroke(); }
    ell(ctx, T*.24, T*.02, T*.09, T*.07, bc); ctx.fillStyle = N ? '#14141a' : '#3a2c1e'; ctx.fillRect(T*.25, -T*.02, T*.03, T*.03); ctx.fillRect(T*.25, T*.03, T*.03, T*.03); ctx.restore();
    ctx.strokeStyle = bc; ctx.lineWidth = Math.max(1.4, T*.04); ctx.beginPath(); ctx.moveTo(px + T*.14, py + T*.86); ctx.lineTo(px + T*.44, py + T*.8); ctx.stroke(); ell(ctx, px + T*.14, py + T*.86, T*.03, T*.03, bc); ell(ctx, px + T*.44, py + T*.8, T*.03, T*.03, bc); }
  else if (ch === '=') { const cx = px + T*.5, by = py + T*.86; ell(ctx, cx + T*.1, by, T*.46, T*.1, N ? 'rgba(0,0,0,.45)' : 'rgba(70,46,26,.35)'); // a tent: hide on poles, the flap open
    poly(ctx, [[px + T*.06, by],[cx, py + T*.14],[px + T*.94, by]], N ? '#3a3632' : '#c8b48c'); poly(ctx, [[cx, py + T*.14],[px + T*.94, by],[cx + T*.14, by]], N ? '#1e1c1a' : '#8a7454'); poly(ctx, [[cx - T*.12, by],[cx, py + T*.5],[cx + T*.1, by]], N ? '#0a0806' : '#2a1e12');
    ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(80,60,36,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, py + T*.14); ctx.lineTo(px + T*.3, by); ctx.stroke(); ctx.fillStyle = N ? '#2a2016' : '#5a4028'; ctx.fillRect(cx - 1, py + T*.06, 2, T*.1);
    if (N && b2At(x, y+1, 'F') || N && b2At(x+1, y, 'F') || N && b2At(x-1, y, 'F')) { ctx.fillStyle = 'rgba(255,150,70,.25)'; poly(ctx, [[px + T*.06, by],[cx, py + T*.14],[cx - T*.1, by]], ctx.fillStyle); } }
  else if (ch === 'W') { const by = py + T*.78; ell(ctx, px + T*.56, by + T*.06, T*.46, T*.1, N ? 'rgba(0,0,0,.45)' : 'rgba(70,46,26,.35)'); // a wagon, its canvas hooped
    ctx.fillStyle = N ? '#1e1610' : '#5a4028'; ctx.fillRect(px + T*.08, py + T*.48, T*.84, T*.24); ctx.fillStyle = N ? '#3a3632' : '#d8c8a2'; ctx.beginPath(); ctx.moveTo(px + T*.06, py + T*.5); ctx.quadraticCurveTo(px + T*.5, py - T*.04, px + T*.94, py + T*.5); ctx.fill();
    ctx.fillStyle = N ? 'rgba(0,0,0,.3)' : 'rgba(110,90,60,.4)'; ctx.beginPath(); ctx.moveTo(px + T*.55, py + T*.5); ctx.quadraticCurveTo(px + T*.8, py + T*.12, px + T*.94, py + T*.5); ctx.fill(); ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(90,70,44,.5)'; ctx.lineWidth = 1; for (let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(px + T*(.08 + i*.21), py + T*.5); ctx.quadraticCurveTo(px + T*(.08 + i*.21), py + T*.16, px + T*(.1 + i*.21), py + T*.2); ctx.stroke(); }
    [.24, .76].forEach(k => { ell(ctx, px + T*k, by, T*.12, T*.12, '#120c08'); ctx.strokeStyle = N ? '#3a3028' : '#7a5a3a'; ctx.beginPath(); ctx.arc(px + T*k, by, T*.08, 0, 7); ctx.stroke(); }); }
  else if (ch === 'F') { const cx = px + T*.5, cy = py + T*.6; for (let i=0;i<7;i++){ const a = i/7*6.28; ell(ctx, cx + Math.cos(a)*T*.26, cy + Math.sin(a)*T*.16, T*.07, T*.05, N ? '#2a2a30' : '#7a6a54'); } // a campfire in its ring of stones
    if (N) b2Flames(ctx, cx, cy, T, 1); else { ell(ctx, cx, cy, T*.15, T*.08, '#2a1c10'); b2Flames(ctx, cx, cy, T, .55); for (let i=0;i<3;i++) ell(ctx, cx + T*(.04 + i*.06), cy - T*(.3 + i*.16), T*(.06 + i*.03), T*(.04 + i*.02), `rgba(200,190,170,${.25 - i*.06})`); } } // by day, smoke
  else if (ch === 'h') { // the horse lines: a picket rope between posts, a horse tied to it, hoof-churned ground
    for (let i=0;i<5;i++) ell(ctx, px + T*(.1 + hash(x,y,i+70)*.8), py + T*(.6 + hash(y,x,i+71)*.35), T*.04, T*.03, N ? 'rgba(0,0,0,.4)' : 'rgba(90,64,40,.45)');
    ctx.strokeStyle = N ? '#4a4038' : '#8a7454'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py + T*.3); ctx.lineTo(px + T, py + T*.3); ctx.stroke(); if (!b2At(x - 1, y, 'h')) { ctx.fillStyle = N ? '#2a2016' : '#5a4028'; ctx.fillRect(px + T*.04, py + T*.16, T*.06, T*.3); }
    if (hash(x,y,9) > .25) { const hx = px + T*.5, hy = py + T*.72, d = hash(x,y,10) > .5 ? 1 : -1, hc = N ? ['#1a1614','#2a2420','#141210'][Math.floor(h*3)] : ['#5a3a22','#8a6a44','#3a2a1e','#a89070'][Math.floor(h*4)];
      ell(ctx, hx, hy + T*.2, T*.3, T*.06, N ? 'rgba(0,0,0,.4)' : 'rgba(70,46,26,.35)'); ctx.fillStyle = hc; for (let i=0;i<4;i++) ctx.fillRect(hx + T*(-.2 + (i%2)*.06 + (i > 1 ? .28 : 0))*d - T*.02, hy, T*.04, T*.2); // legs
      ell(ctx, hx, hy - T*.02, T*.26, T*.1, hc); ctx.strokeStyle = hc; ctx.lineWidth = Math.max(2, T*.08); ctx.beginPath(); ctx.moveTo(hx + T*.18*d, hy - T*.04); ctx.lineTo(hx + T*.3*d, hy - T*.24); ctx.stroke(); ell(ctx, hx + T*.35*d, hy - T*.24, T*.08, T*.045, hc, .5*d); // body, neck, head
      ctx.strokeStyle = N ? '#0a0808' : '#1e140c'; ctx.lineWidth = Math.max(1, T*.03); ctx.beginPath(); ctx.moveTo(hx - T*.26*d, hy - T*.04); ctx.lineTo(hx - T*.32*d, hy + T*.1); ctx.stroke(); // tail
      ctx.fillStyle = N ? 'rgba(160,170,210,.12)' : 'rgba(255,240,210,.22)'; ctx.fillRect(hx - T*.2, hy - T*.11, T*.3, 1); ctx.strokeStyle = N ? '#3a3028' : '#6a5a40'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx + T*.38*d, hy - T*.22); ctx.lineTo(hx + T*.3*d, py + T*.3); ctx.stroke(); } }
  else exitArrow(ctx, ch, px, py, T);
  if (N) b2Firelit(ctx, x, y, T, .34, 3.2, '255,150,70');
}
const b2Clip = (ctx, x, y, T, f) => { ctx.save(); ctx.beginPath(); ctx.rect(x*T, y*T, T, T); ctx.clip(); f(); ctx.restore(); };
TILEX.odhan = (ctx, ch, x, y, T, dark) => b2Clip(ctx, x, y, T, () => b2Odhan(ctx, ch, x, y, T, !!dark));
TILEX.odhan_night = (ctx, ch, x, y, T, dark) => b2Clip(ctx, x, y, T, () => b2Odhan(ctx, ch, x, y, T, true));

/* ---------------- backdrops: SCENEX[kind](canvas, t) — the still parts cached with sceneLayer, the frame adding what moves ---------------- */
const b2Fl = t => REDUCE() ? 1 : .86 + Math.sin(t/120)*.07 + Math.sin(t/47)*.05; // a flame's breathing
/* a city skyline of domes, minarets and flat roofs against the burning sky */
function b2Skyline(x, W, base, col, seed, hmax, lit){ x.fillStyle = col; let px = -10;
  while (px < W + 10) { const k = hash(Math.round(px), seed), w = 14 + k*26, hh = 8 + hash(seed, Math.round(px))*hmax; x.fillRect(px, base - hh, w, hh + 2);
    if (k > .62) { x.beginPath(); x.ellipse(px + w/2, base - hh, w*.36, w*.38, 0, Math.PI, 0); x.fill(); x.fillRect(px + w/2 - .6, base - hh - w*.38 - 4, 1.2, 4); } // a dome, and its finial
    else if (k < .14) { const mx = px + w*.5; x.fillRect(mx - 2.4, base - hh - 30 - k*60, 4.8, 30 + k*60); x.fillRect(mx - 3.6, base - hh - 24 - k*50, 7.2, 2); x.beginPath(); x.moveTo(mx - 2.4, base - hh - 30 - k*60); x.lineTo(mx, base - hh - 38 - k*60); x.lineTo(mx + 2.4, base - hh - 30 - k*60); x.fill(); } // a minaret
    if (lit && hash(Math.round(px), seed, 3) > .5) { const wy = base - hh*(.3 + hash(Math.round(px), seed, 4)*.5); x.fillStyle = rgba('#ff9a48', .35 + hash(Math.round(px), seed, 5)*.4); x.fillRect(px + w*.4, wy, 2, 3); x.fillStyle = col; }
    px += w - 2; } }
/* the column on the march: a line of tiny walkers, carts and cattle along a path that runs away to the horizon */
function b2Column(x, W, H, path, n, col, dust){ for (let i=0;i<n;i++){ const k = Math.pow(i/n, 1.5), [cx, cy] = path(k), s = lerp(1.6, .25, Math.pow(k, .6)), r = hash(i, 17);
    if (dust) x.fillStyle = dust, x.fillRect(cx - 6*s, cy - 6*s, 12*s, 4*s);
    x.fillStyle = col;
    if (r < .14) { x.fillRect(cx - 5*s, cy - 6*s, 10*s, 4*s); x.beginPath(); x.ellipse(cx, cy - 6*s, 5*s, 4*s, 0, Math.PI, 0); x.fill(); x.fillRect(cx - 4*s, cy - 2*s, 1.6*s, 2*s); x.fillRect(cx + 2.4*s, cy - 2*s, 1.6*s, 2*s); } // a cart, its canvas hooped
    else if (r < .3) { x.fillRect(cx - 3.4*s, cy - 4*s, 6.8*s, 2.6*s); x.fillRect(cx + 3*s, cy - 4.6*s, 1.8*s, 1.6*s); for (let j=0;j<4;j++) x.fillRect(cx - 3*s + j*1.8*s, cy - 1.6*s, .8*s, 1.6*s); } // cattle
    else { const hh = (5 + hash(i,18)*2)*s; x.fillRect(cx - s*.9, cy - hh, s*1.8, hh); x.fillRect(cx - s*.7, cy - hh - s*1.4, s*1.4, s*1.4); if (r > .9) { x.fillRect(cx + s, cy - hh - 3*s, s*.4, hh + 2*s); } } } } // people, the odd spear

SCENEX.b2_hissar_burning = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, fl = b2Fl(t), hz = H*.66;
  ctx.drawImage(sceneLayer('b2:hissar_burning', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#06040a'],[.45,'#1e0c0c'],[.8,'#6a2414'],[1,'#c8562a']]); x.fillRect(0, 0, W, hz + 2);
    for (let i=0;i<40;i++){ x.fillStyle = `rgba(220,200,200,${.15 + hash(i,41)*.3})`; x.fillRect(hash(i,42)*W, hash(i,43)*hz*.3, 1, 1); } // a few stars the smoke has not reached
    glow(x, W*.55, hz, W*.6, '#ff7a30', .35); glow(x, W*.3, hz - 10, W*.3, '#ffa050', .25);
    b2Skyline(x, W, hz - 4, '#2a120c', 5, 34, false); // the far city, hazed
    b2Skyline(x, W, hz + 4, '#120806', 9, 50, true); // the near city, its windows burning
    x.fillStyle = '#1a0c08'; x.fillRect(0, hz + 2, W, 12); for (let i=0;i<W/14 + 1;i++) x.fillRect(i*14, hz - 3, 8, 6); // the curtain wall, crenellated
    x.fillStyle = 'rgba(255,140,60,.2)'; x.fillRect(0, hz + 2, W, 1.2);
    const gx = W*.62; x.fillStyle = '#080404'; x.fillRect(gx - 16, hz - 16, 32, 30); x.beginPath(); x.ellipse(gx, hz - 16, 16, 10, 0, Math.PI, 0); x.fill(); x.fillStyle = '#ff9040'; x.fillRect(gx - 7, hz - 2, 14, 16); x.beginPath(); x.ellipse(gx, hz - 2, 7, 7, 0, Math.PI, 0); x.fill(); // the gate, open, fire inside it
    x.fillStyle = vgrad(x, hz + 14, H, [[0,'#1a100c'],[1,'#060404']]); x.fillRect(0, hz + 14, W, H); // the ground outside the walls
    x.fillStyle = '#0a0606'; x.beginPath(); x.moveTo(0, H); x.lineTo(0, H*.86); x.quadraticCurveTo(W*.3, H*.8, W*.55, H*.86); x.quadraticCurveTo(W*.8, H*.92, W, H*.84); x.lineTo(W, H); x.fill(); // the near rise
    for (let i=0;i<30;i++){ const px = hash(i,51)*W, py = hz + 18 + hash(i,52)*(H*.2); x.fillStyle = `rgba(10,6,6,${.5 + hash(i,53)*.4})`; x.fillRect(px, py, 2 + hash(i,54)*4, 1.4); } // the road out, things dropped on it
  }), 0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.55, hz - 6, W*.55, '#ff6a20', .22*fl); glow(ctx, W*.62, hz, 60, '#ffb060', .3*fl); ctx.globalCompositeOperation = 'source-over';
  for (let c=0;c<5;c++){ const bx = W*(.12 + c*.2 + hash(c,3)*.06), by = hz - 10 - hash(c,4)*20; // the smoke columns, leaning on the wind
    for (let i=0;i<18;i++){ const k = ((t*mo/(9000 + c*1300) + i/18) % 1), r = 7 + k*34, sx = bx + k*k*70 + Math.sin(t*mo/2000 + i*1.7)*(3 + k*6); glow(ctx, sx, by - k*hz*1.1, r*1.3, '#1e0e0a', .5*(1 - k*.6)); glow(ctx, sx - r*.3, by - k*hz*1.1 + r*.3, r*.8, '#8a3418', .2*(1 - k)); }
    glow(ctx, bx, by, 30, '#ff7a30', .18*fl); }
  for (let i=0;i<26;i++){ const k = ((t*mo/(5000 + hash(i,7)*4000) + hash(i,8)) % 1), ex = W*(.15 + hash(i,9)*.75) + k*40 + Math.sin(t/600 + i)*5, ey = hz - k*hz*.9; ctx.fillStyle = `rgba(255,${150 + Math.round(hash(i,10)*80)},70,${(1 - k)*.85})`; ctx.fillRect(ex, ey, 1.4, 1.4); } // embers going up
  const sq = sceneSquad(); sq.forEach((id, i) => drawFigure(ctx, id, W*.08 + i*Math.min(28, W*.5/sq.length), H*.93 - (i%2)*2, 1.6, t, {phase:i, dir:1}));
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.25, H*.9, W*.35, '#ff6e28', .08*fl); ctx.globalCompositeOperation = 'source-over'; // the city's light on their backs and faces
  vign(ctx, W, H, .78, .5); };

SCENEX.b2_coltaine_tent = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, fl = b2Fl(t), lx = W*.52, ly = H*.22, sw = Math.sin(t*mo/1600)*1.5;
  ctx.drawImage(sceneLayer('b2:coltaine_tent', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, H, [[0,'#2a1c12'],[.6,'#160e08'],[1,'#080504']]); x.fillRect(0, 0, W, H);
    x.lineWidth = 1; for (let i=0;i<9;i++){ x.strokeStyle = `rgba(150,110,70,${.12 + (i%2)*.06})`; x.beginPath(); x.moveTo(W*.52, -4); x.quadraticCurveTo(i*W/8 + (i - 4)*6, H*.25, i*W/8 + (i - 4)*14, H*.68); x.stroke(); } // the canvas seams, from the ridge-pole
    for (let i=0;i<8;i++){ const g = x.createLinearGradient(i*W/8, 0, (i + 1)*W/8, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.18)'); x.fillStyle = g; x.fillRect(i*W/8, 0, W/8, H*.68); } // the sag between the ribs
    x.fillStyle = '#2a1c10'; x.fillRect(W*.52 - 3, 0, 6, H*.68); x.fillStyle = 'rgba(200,150,90,.18)'; x.fillRect(W*.52 - 3, 0, 1.4, H*.68); // the pole
    x.fillStyle = vgrad(x, H*.68, H, [[0,'#1e140c'],[1,'#0a0705']]); x.fillRect(0, H*.68, W, H*.32); for (let i=0;i<5;i++){ x.fillStyle = ['#3a1a14','#2a2a3a','#4a3418','#2a1410','#1e2a24'][i]; x.fillRect(W*(.08 + i*.18), H*(.74 + (i%2)*.05), W*.16, H*.08); } // rugs on the ground
    // the map table: trestles, a hide map weighted with stones, a crow feather
    const tx = W*.3, ty = H*.6, tw = W*.44; x.fillStyle = '#1a120a'; x.fillRect(tx + 8, ty + 6, 5, H*.3); x.fillRect(tx + tw - 13, ty + 6, 5, H*.3); x.fillStyle = '#3a2a1a'; x.fillRect(tx, ty, tw, 7); x.fillStyle = '#4a3622'; x.fillRect(tx, ty, tw, 2);
    x.save(); x.translate(tx + tw*.5, ty - 6); x.scale(1, .32); x.fillStyle = '#c8b088'; x.fillRect(-tw*.42, -30, tw*.84, 60); x.strokeStyle = 'rgba(80,50,30,.6)'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(-tw*.36, 10); x.bezierCurveTo(-tw*.1, -20, tw*.1, 20, tw*.36, -12); x.stroke(); // the coast road to Aren, inked
      x.fillStyle = 'rgba(120,40,30,.7)'; for (let i=0;i<5;i++) x.fillRect(-tw*.3 + i*tw*.15, -4 + Math.sin(i)*12, 5, 5); x.strokeStyle = 'rgba(60,40,24,.35)'; x.lineWidth = 1.4; for (let i=0;i<4;i++){ x.beginPath(); x.ellipse(tw*.15, 14, 20 - i*4, 10 - i*2, 0, 0, 7); x.stroke(); } x.restore(); // waypoints; a hill's contours
    [[tx + tw*.14, ty - 9], [tx + tw*.84, ty - 4]].forEach(([sx, sy]) => { ell(x, sx, sy, 5, 3, '#4a4440'); ell(x, sx - 1, sy - 1, 2.6, 1.4, '#7a746a'); });
    x.save(); x.translate(tx + tw*.6, ty - 8); x.rotate(-.35); x.strokeStyle = '#0a0a0e'; x.lineWidth = 1; x.beginPath(); x.moveTo(-16, 0); x.lineTo(16, 0); x.stroke(); for (let i=0;i<14;i++){ const k = i/13, l = 3.4*Math.sin(k*Math.PI) + 1; x.beginPath(); x.moveTo(-14 + k*28, 0); x.lineTo(-16 + k*28, -l); x.moveTo(-14 + k*28, 0); x.lineTo(-16 + k*28, l); x.stroke(); } x.fillStyle = 'rgba(120,130,180,.4)'; x.fillRect(-10, -1.2, 18, .6); x.restore(); // the crow feather
    x.fillStyle = '#2a2016'; x.fillRect(W*.84, H*.54, W*.12, H*.3); x.fillStyle = '#3a2c1e'; x.fillRect(W*.84, H*.54, W*.12, 4); for (let i=0;i<4;i++){ x.fillStyle = '#d8ccb0'; x.fillRect(W*.85 + i*5, H*.5 - i*1.4, 4, 10 + i); } // a chest of rolled dispatches
    x.strokeStyle = 'rgba(0,0,0,.6)'; x.lineWidth = 1; x.beginPath(); x.moveTo(W*.06, H*.1); x.lineTo(W*.06, H*.66); x.stroke(); for (let i=0;i<5;i++) ell(x, W*.06, H*(.16 + i*.1), 2, 4, '#14100c'); // feathers and fetishes tied to a pole
  }), 0, 0, W, H);
  // the lamp, hung from the ridge-pole, swinging a little
  const ax = lx + sw; ctx.strokeStyle = '#140e08'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W*.52, 0); ctx.lineTo(ax, ly - 6); ctx.stroke();
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, ax, ly + 20, W*.62, '#e8923a', .28*fl); glow(ctx, ax, ly + 2, 30, '#ffc070', .5*fl); ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#2a2016'; ctx.fillRect(ax - 5, ly - 6, 10, 2); ctx.fillRect(ax - 4, ly - 4, 8, 12); ctx.fillStyle = `rgba(255,${200 + Math.round(fl*20)},130,${.8*fl})`; ctx.fillRect(ax - 2.6, ly - 2, 5.2, 8); ctx.fillStyle = '#2a2016'; ctx.fillRect(ax - .5, ly - 4, 1, 12);
  drawFigure(ctx, 'coltaine', W*.4, H*.9, 2.6, t, {still:true, dir:1}); drawFigure(ctx, 'duiker', W*.2, H*.94, 2.3, t, {still:true, dir:1, phase:2});
  const sq = sceneSquad().slice(0, 3); sq.forEach((id, i) => drawFigure(ctx, id, W - 26 - (sq.length - 1 - i)*Math.min(30, W*.09), H*.97, 2.2, t, {phase:i, dir:-1}));
  ctx.fillStyle = 'rgba(210,190,160,.3)'; for (let i=0;i<16;i++){ const y = (hash(i,10)*H + t*.01*mo*(1 + hash(i,11))) % H, xx = ax + (hash(i,9) - .5)*W*.5 + Math.sin(t/1400 + i)*6; ctx.globalAlpha = clamp(1 - Math.hypot(xx - ax, y - ly)/(W*.3), 0, 1); ctx.fillRect(xx, y, 1.3, 1.3); } ctx.globalAlpha = 1; // dust in the lamplight
  vign(ctx, W, H, .82, .5); };

SCENEX.b2_well = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, fl = b2Fl(t), wy = H*.7;
  ctx.drawImage(sceneLayer('b2:well', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, H*.4, [[0,'#0a0608'],[.7,'#4a1a10'],[1,'#a04420']]); x.fillRect(0, 0, W, H*.42); // the sky over the wall, the city burning beyond it
    b2Skyline(x, W, H*.4, '#1a0a08', 13, 24, false);
    const wall = (x0, x1, top, c1, c2) => { x.fillStyle = vgrad(x, top, H*.72, [[0,c1],[1,c2]]); x.fillRect(x0, top, x1 - x0, H*.72 - top); x.fillStyle = 'rgba(255,150,80,.18)'; x.fillRect(x0, top, x1 - x0, 2); for (let i=0;i<10;i++){ x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(x0 + hash(i, Math.round(x0))*(x1 - x0), top + 6 + hash(Math.round(x0), i)*(H*.6 - top), 6 + hash(i,3)*10, 4); } };
    wall(-2, W*.22, H*.2, '#4a3426', '#1a120e'); wall(W*.78, W + 2, H*.16, '#3e2c20', '#140e0a'); wall(W*.22, W*.78, H*.4, '#3a2a20', '#140e0a'); // plaster over mud-brick, three sides of the yard
    x.fillStyle = '#080505'; x.beginPath(); x.moveTo(W*.4, H*.72); x.lineTo(W*.4, H*.52); x.arc(W*.45, H*.52, W*.05, Math.PI, 0); x.lineTo(W*.5, H*.72); x.fill(); x.fillStyle = 'rgba(255,150,80,.12)'; x.fillRect(W*.4, H*.69, W*.1, 3); // a doorway
    x.fillStyle = '#100a08'; x.fillRect(W*.86, H*.36, 10, 14); x.fillRect(W*.1, H*.34, 10, 14); // windows, shuttered
    x.fillStyle = vgrad(x, H*.72, H, [[0,'#2a1e16'],[1,'#0a0705']]); x.fillRect(0, H*.72, W, H*.28); for (let i=0;i<60;i++){ x.fillStyle = `rgba(0,0,0,${.15 + hash(i,21)*.2})`; x.fillRect(hash(i,22)*W, H*.74 + hash(i,23)*H*.26, 3 + hash(i,24)*8, 1.4); } // the yard's packed earth
    // a palm over the left wall
    x.strokeStyle = '#0c0806'; x.lineWidth = 4; x.beginPath(); x.moveTo(W*.14, H*.72); x.quadraticCurveTo(W*.1, H*.4, W*.16, H*.12); x.stroke(); for (let i=0;i<8;i++){ const a = -Math.PI*.95 + i/7*Math.PI*.9; x.lineWidth = 2.4; x.beginPath(); x.moveTo(W*.16, H*.12); x.quadraticCurveTo(W*.16 + Math.cos(a)*24, H*.12 + Math.sin(a)*14 - 6, W*.16 + Math.cos(a)*44, H*.12 + Math.sin(a)*20 + 14); x.stroke(); }
    // the well: a ring of stone, a timber frame, the rope, the bucket
    const cx = W*.62; ell(x, cx + 4, wy + 14, 40, 8, 'rgba(0,0,0,.5)'); x.fillStyle = vgrad(x, wy - 14, wy + 12, [[0,'#6a5a48'],[1,'#2a2018']]); x.fillRect(cx - 34, wy - 12, 68, 22); ell(x, cx, wy + 10, 34, 7, '#2a2018'); ell(x, cx, wy - 12, 34, 7, '#7a6a56'); ell(x, cx, wy - 12, 27, 5, '#050404');
    x.strokeStyle = 'rgba(0,0,0,.4)'; x.lineWidth = 1; for (let i=0;i<7;i++){ x.beginPath(); x.moveTo(cx - 34 + i*11, wy - 8); x.lineTo(cx - 34 + i*11, wy + 10); x.stroke(); }
    x.fillStyle = '#1e140c'; x.fillRect(cx - 30, wy - 52, 4, 42); x.fillRect(cx + 26, wy - 52, 4, 42); x.fillRect(cx - 32, wy - 54, 64, 5); x.fillStyle = 'rgba(255,160,90,.2)'; x.fillRect(cx - 32, wy - 54, 64, 1.2);
    x.strokeStyle = '#6a5a40'; x.beginPath(); x.moveTo(cx + 6, wy - 50); x.lineTo(cx + 6, wy - 30); x.stroke(); x.fillStyle = '#3a2a1a'; x.fillRect(cx + 1, wy - 30, 10, 9); x.fillStyle = '#5a4430'; x.fillRect(cx + 1, wy - 30, 10, 2);
    ell(x, cx - 46, wy + 6, 6, 9, '#4a3020'); ell(x, cx - 48, wy - 2, 3, 2, '#2a1a10'); // a water jar
  }), 0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.5, H*.36, W*.6, '#ff7a30', .16*fl); ctx.fillStyle = `rgba(255,120,50,${.07*fl})`; ctx.fillRect(0, H*.16, W, H*.08); ctx.globalCompositeOperation = 'source-over'; // fire-light over the walls
  for (let i=0;i<3;i++){ const k = ((t*mo/11000 + i/3) % 1); ell(ctx, W*(.3 + i*.2) + k*30, H*.36 - k*H*.4, 14 + k*30, 6 + k*10, `rgba(30,16,12,${.35*(1 - k)})`); } // smoke going over
  for (let i=0;i<14;i++){ const k = ((t*mo/(6000 + hash(i,7)*3000) + hash(i,8)) % 1); ctx.fillStyle = `rgba(255,${150 + Math.round(hash(i,9)*80)},70,${(1 - k)*.8})`; ctx.fillRect(W*hash(i,6) + k*30, H*.42 - k*H*.42, 1.3, 1.3); } // sparks
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.08 + i*Math.min(32, W*.4/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, .8, .5); };

function b2PaintOdhan(x, W, H, tod){ const dusk = tod === 'dusk', hz = H*.52;
  x.fillStyle = vgrad(x, 0, hz, dusk ? [[0,'#1a1020'],[.4,'#4a2028'],[.78,'#b8542a'],[1,'#f0a050']] : [[0,'#8a9aa8'],[.5,'#c8ccc4'],[1,'#f0e8d4']]); x.fillRect(0, 0, W, hz + 2);
  if (dusk) { const sx = W*.18, sy = hz - 6; glow(x, sx, sy, W*.55, '#ff8a40', .45); ell(x, sx, sy, 15, 15, '#ffd090'); glow(x, sx, sy, 30, '#fff0c0', .55); for (let i=0;i<5;i++) cloud(x, W*(.2 + hash(i,5)*.7), hz*(.25 + i*.12), W*(.3 + hash(i,6)*.2), 3 + i, i%2 ? '#e07040' : '#8a3a3a', .14); }
  else { glow(x, W*.78, hz*.18, W*.7, '#fffcf0', .6); ell(x, W*.78, hz*.18, 14, 14, '#ffffff'); glow(x, W*.78, hz*.18, 40, '#ffffff', .7); for (let i=0;i<3;i++) cloud(x, W*(.2 + i*.3), hz*(.3 + i*.12), W*.3, 4, '#ffffff', .1); } // the sun, white
  // far mesas, low and blue with distance
  x.fillStyle = dusk ? '#4a2a30' : '#a8a4a0'; x.beginPath(); x.moveTo(0, hz); for (let px=0;px<=W + 10;px+=10){ const m = Math.max(0, Math.sin(px/60 + 1) - .55)*30 + Math.max(0, Math.sin(px/37 + 3) - .7)*24; x.lineTo(px, hz - 2 - (m > 4 ? Math.min(m, 14) : m*.3)); } x.lineTo(W, hz); x.fill();
  x.fillStyle = vgrad(x, hz, H, dusk ? [[0,'#7a4a34'],[.4,'#4a2e20'],[1,'#1a1008']] : [[0,'#e0d0ac'],[.4,'#c8b088'],[1,'#8a7452']]); x.fillRect(0, hz, W, H);
  x.fillStyle = dusk ? 'rgba(255,160,90,.12)' : 'rgba(255,250,240,.35)'; x.fillRect(0, hz, W, 5); // haze on the line of the world
  for (let i=0;i<120;i++){ const yy = hz + 4 + Math.pow(hash(i,32), 1.4)*(H - hz), px = hash(i,31)*W, d = (yy - hz)/(H - hz), r = 1 + d*5; ell(x, px, yy, r*1.6, r*.6, dusk ? `rgba(30,18,14,${.3 + d*.3})` : `rgba(100,90,60,${.2 + d*.3})`); } // scrub, scattered
  for (let i=0;i<40;i++){ const yy = hz + 6 + hash(i,34)*(H - hz), px = hash(i,33)*W; x.strokeStyle = dusk ? 'rgba(40,24,16,.3)' : 'rgba(120,96,64,.3)'; x.lineWidth = 1; x.beginPath(); x.moveTo(px, yy); x.lineTo(px + 10 + hash(i,35)*30, yy + (hash(i,36) - .5)*3); x.stroke(); } // cracks in the pan
}
SCENEX.b2_odhan_dusk = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.52;
  ctx.drawImage(sceneLayer('b2:odhan_dusk', W, H, (x, W, H) => { b2PaintOdhan(x, W, H, 'dusk');
    const path = k => [lerp(W*1.05, W*.36, Math.pow(k, .7)) + Math.sin(k*9)*W*.05*(1 - k), lerp(H*.84, hz + 2, Math.pow(k, .45))]; // the road the column makes, winding off toward the horizon
    x.strokeStyle = 'rgba(200,120,70,.18)'; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); for (let i=0;i<=40;i++){ const [px, py] = path(i/40); x.lineWidth = lerp(18, 2, i/40); i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); x.lineCap = 'butt';
    glow(x, W*.55, hz + 6, W*.4, '#d88050', .18); // the dust it raises
    b2Column(x, W, H, path, 150, '#140a08', null);
    for (let i=0;i<6;i++){ const [px, py] = path(.1 + i*.14); x.fillStyle = '#140a08'; x.fillRect(px + 8, py - 18*(1 - i*.12), .9, 16*(1 - i*.12)); x.fillStyle = i%2 ? '#8a2a1e' : '#3a3a44'; x.fillRect(px + 8.9, py - 18*(1 - i*.12), 5*(1 - i*.1), 3*(1 - i*.1)); } // standards along it
  }), 0, 0, W, H);
  for (let i=0;i<5;i++){ const k = ((t*mo/14000 + i/5) % 1); ell(ctx, W*(.95 - k*.7), hz + 6 + i*4, 40 + k*30, 4 + k*3, `rgba(220,140,90,${.12*Math.sin(k*Math.PI)})`); } // dust drifting along the column
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.08 + i*Math.min(34, W*.5/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, .66, .5); };

SCENEX.b2_odhan_day = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.52;
  const L = sceneLayer('b2:odhan_day', W, H, (x, W, H) => { b2PaintOdhan(x, W, H, 'day');
    const path = k => [lerp(-W*.05, W*.7, Math.pow(k, .7)), lerp(H*.78, hz + 2, Math.pow(k, .5))]; b2Column(x, W, H, path, 70, 'rgba(70,56,40,.75)', 'rgba(220,200,160,.25)'); }); // the column, pale with dust
  ctx.drawImage(L, 0, 0, W, H);
  if (mo) { const dpr = L.width / W, y0 = hz - 18, y1 = hz + 16; for (let y=y0; y<y1; y+=2){ const off = Math.sin(t/180 + y*.7)*1.6*Math.sin((y - y0)/(y1 - y0)*Math.PI); ctx.drawImage(L, 0, y*dpr, L.width, 2*dpr, off, y, W, 2); } } // heat-shimmer on the horizon
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.78, H*.1, W*.7, '#fff8e0', .14); ctx.globalCompositeOperation = 'source-over'; // glare
  for (let i=0;i<2;i++){ const k = ((t*mo/16000 + i*.5) % 1), dx = W*(.2 + i*.5) + k*60; for (let j=0;j<8;j++) ell(ctx, dx + Math.sin(t*mo/300 + j)*j*.8, hz + 4 - j*5, 4 + j*1.4, 2, `rgba(210,190,150,${.16 - j*.015})`); } // a dust devil, far off
  ctx.fillStyle = 'rgba(230,214,180,.25)'; for (let i=0;i<30;i++){ const x = ((hash(i,61)*W) + t*mo*(.02 + hash(i,62)*.03)) % W, y = hz + hash(i,63)*(H - hz); ctx.fillRect(x, y, 1.3, 1); } // grit on the wind
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.12 + i*Math.min(34, W*.5/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, .42, .5); };

SCENEX.b2_basin = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.44;
  ctx.drawImage(sceneLayer('b2:basin', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#1c1e2c'],[.5,'#4a3a48'],[.85,'#b07060'],[1,'#e0a07a']]); x.fillRect(0, 0, W, hz + 2); glow(x, W*.86, hz, W*.4, '#ffb080', .35); // dawn, coming up behind the far rim
    for (let i=0;i<4;i++) cloud(x, W*(.15 + i*.25), hz*(.25 + i*.12), W*.3, 3, i%2 ? '#d88070' : '#8a6070', .12);
    x.fillStyle = '#3a2a2e'; x.beginPath(); x.moveTo(0, hz + 4); for (let px=0;px<=W + 10;px+=10) x.lineTo(px, hz - Math.sin(px/80)*3 - 2); x.lineTo(W, hz + 8); x.fill(); // the far rim
    // the army on it: a long dark mass, spears, standards, the dust of horses
    for (let i=0;i<320;i++){ const px = W*(.2 + hash(i,71)*.72), py = hz - 1 - hash(i,72)*5 + Math.sin(px/80)*-3; x.fillStyle = `rgba(14,8,10,${.6 + hash(i,73)*.4})`; x.fillRect(px, py - 2, 1.4, 3); if (hash(i,74) > .8) x.fillRect(px + .3, py - 6, .5, 4); }
    for (let i=0;i<9;i++){ const px = W*(.25 + i*.08), py = hz - 8 - hash(i,75)*3; x.fillStyle = '#0e080a'; x.fillRect(px, py - 6, .8, 12); x.fillStyle = i%3 ? '#2a3a2a' : '#4a1a14'; x.fillRect(px + .8, py - 6, 4, 3); }
    glow(x, W*.6, hz - 4, W*.4, '#c8a090', .14);
    // the basin: wide and shallow, falling away and rising again; the dry wash down its middle
    x.fillStyle = vgrad(x, hz, H, [[0,'#6a5050'],[.3,'#5a4234'],[.7,'#3a2a20'],[1,'#1a120c']]); x.fillRect(0, hz + 2, W, H);
    for (let i=0;i<5;i++){ x.fillStyle = `rgba(0,0,0,${.06 + i*.02})`; x.beginPath(); x.moveTo(0, hz + 10 + i*H*.08); x.quadraticCurveTo(W*.5, hz + 30 + i*H*.1, W, hz + 10 + i*H*.08); x.lineTo(W, hz + 16 + i*H*.08); x.quadraticCurveTo(W*.5, hz + 36 + i*H*.1, 0, hz + 16 + i*H*.08); x.fill(); } // the slopes, in long bands
    const wash = k => [lerp(W*.56, W*.36, k) + Math.sin(k*4 + 1)*W*.05*k, lerp(hz + 8, H*.88, k)];
    x.lineCap = 'round'; for (let pass=0;pass<2;pass++){ x.strokeStyle = pass ? 'rgba(190,160,130,.16)' : 'rgba(30,20,14,.32)'; x.beginPath(); for (let i=0;i<=40;i++){ const [px, py] = wash(i/40); x.lineWidth = lerp(2, 30, i/40)*(pass ? .5 : 1); i ? x.lineTo(px + (pass ? -2 : 0), py) : x.moveTo(px, py); } x.stroke(); } x.lineCap = 'butt'; // the wash, pale stones in a dark cut
    for (let i=0;i<40;i++){ const [px, py] = wash(hash(i,81)); ell(x, px + (hash(i,82) - .5)*lerp(2, 24, (py - hz)/(H - hz)), py, 1 + hash(i,83)*2.4, .6 + hash(i,83)*1, 'rgba(210,190,160,.22)'); }
    for (let i=0;i<90;i++){ const yy = hz + 10 + Math.pow(hash(i,91), 1.3)*(H - hz), px = hash(i,92)*W, d = (yy - hz)/(H - hz); ell(x, px, yy, 1 + d*4, .6 + d*1.6, `rgba(20,14,12,${.25 + d*.3})`); } // scrub
    x.fillStyle = '#140e0a'; x.beginPath(); x.moveTo(0, H); x.lineTo(0, H*.84); x.quadraticCurveTo(W*.4, H*.8, W*.7, H*.86); x.quadraticCurveTo(W*.9, H*.88, W, H*.84); x.lineTo(W, H); x.fill(); // the near rim
  }), 0, 0, W, H);
  for (let i=0;i<4;i++){ const k = ((t*mo/9000 + i/4) % 1); ell(ctx, W*(.3 + i*.18) + k*20, H*.44 - 6 - k*14, 20 + k*24, 3 + k*4, `rgba(200,150,130,${.14*Math.sin(k*Math.PI)})`); } // the army's dust
  ctx.fillStyle = 'rgba(220,200,190,.18)'; for (let i=0;i<12;i++){ const k = ((t*mo/7000 + hash(i,3)) % 1); ell(ctx, hash(i,4)*W + k*40, H*(.6 + hash(i,5)*.3), 20, 2, `rgba(220,200,190,${.08*Math.sin(k*Math.PI)})`); } // ground mist, burning off
  const sq = sceneSquad(); sq.forEach((id, i) => drawFigure(ctx, id, W*.1 + i*Math.min(32, W*.45/sq.length), H*.93 - (i%2)*2, 2, t, {phase:i, dir:1}));
  vign(ctx, W, H, .7, .5); };
