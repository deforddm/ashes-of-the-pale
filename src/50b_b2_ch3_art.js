/* ============ Book Two, Chapter 3 art: The Ridge — the warlocks' tunnel, Gelor Ridge, the Foolish Dog charge ============ */
/* Figures (FIGX), the earth tunnel and the ridge (TILEX) and three backdrops (SCENEX), drawn the way 47b and 49b draw:
   lantern low on the left, glare by day, blue-black by night, dust over everything. Underground the only light is the warlocks'. */

/* ---------------- figures: FIGX[kind](ctx, h, t, o), the same ~32px frame as 47b ---------------- */
Object.assign(FIGX, {
  /* Captain Lull of the Sialk Marines, before Gelor: long-faced, a good straight nose, a dry mouth; mail under a sand surcoat, a crossbow on his back, a short sword out */
  lull(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.02, 1.07);
    B2F.line(ctx, '#4a3320', 1.5, [[-8.6, -13], [-3, 2]], 'butt'); B2F.line(ctx, '#8d8a86', 1, [[-11.4, -10.4], [-5.8, -14.8]]); // the crossbow slung across his back
    h.legs('#26221e'); ctx.fillStyle = '#3a2e22'; ctx.fillRect(-4.6, 9.4, 3.6, 3.6); ctx.fillRect(1, 9.4, 3.6, 3.6); // boots
    poly(ctx, [[-6.6,-6],[6.6,-6],[7.4,9.4],[-7.4,9.4]], h.armor('#86837a', '#24231f')); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<7;i++){ ctx.moveTo(-7, -4.6 + i*2.1); ctx.lineTo(7.2, -4.6 + i*2.1); } ctx.stroke(); // mail to the knee
    poly(ctx, [[-4.6,-6],[4.6,-6],[5.2,8.6],[-5.2,8.6]], h.armor('#a8946a', '#4a3e26')); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(-.4, -5.6, .8, 14); // the sand surcoat, faded, split
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-6.8, 2.6, 13.6, 1.5); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-.9, 2.6, 1.8, 1.5); ctx.fillStyle = '#4a3a26'; ctx.fillRect(-7.8, 3.6, 2.4, 3.4); ctx.fillStyle = '#5a4a30'; ctx.fillRect(-7.8, 3.6, 2.4, .8); // belt, buckle, a quarrel-case
    ctx.fillStyle = '#b8b0a0'; ctx.fillRect(-1.6, -6, 3.2, .9); ctx.fillStyle = '#5a6a8a'; ctx.fillRect(2.4, -5, 1.4, 1.4); // the captain's bar; a marine's blue tab
    h.head('#a07a5e', 4.2, -11.4); h.look('rgba(24,14,10,.85)', -11.8); ctx.fillStyle = 'rgba(30,18,12,.35)'; ctx.fillRect(-3.2, -8.6, 7, .6); // a long face, the cheeks hollow
    poly(ctx, [[3.6,-11.6],[5.8,-9],[3.8,-8.6]], '#a07a5e'); ctx.fillStyle = 'rgba(40,24,14,.4)'; ctx.fillRect(3.8, -8.9, 1.8, .5); // the nose, straight and long
    ctx.fillStyle = 'rgba(120,108,96,.5)'; ctx.fillRect(-2.6, -8.2, 6.4, 2); ctx.fillStyle = '#3a2216'; ctx.fillRect(.4, -7.4, 2.6, .5); ctx.fillRect(2.8, -7.6, .6, .4); // stubble, a mouth with one corner up
    ctx.fillStyle = h.armor('#6e6a62', '#1e1d1a'); ctx.beginPath(); ctx.arc(-.6, -13.4, 5, Math.PI*.98, Math.PI*2.02); ctx.fill(); ctx.fillRect(-5.8, -13.8, 10.4, 1.3); ctx.fillStyle = 'rgba(255,250,240,.2)'; ctx.fillRect(-4, -17.4, 3, 1); // the iron cap, pushed back
    ctx.fillStyle = '#3a2a1e'; ctx.fillRect(-4.6, -12.6, 1.6, 3.4); ctx.fillStyle = 'rgba(170,166,156,.6)'; ctx.fillRect(-4.6, -12.4, 1.6, 1); // cropped hair, grey at the temple
    B2F.line(ctx, '#4a3a26', .6, [[-4.4, -12.4], [-3.6, -6.8]]); // the chin-strap, hanging loose
    h.sword('#cfc8b8'); ctx.restore(); },

  /* a Foolish Dog lancer on foot: heavy iron scale to the knee, a dog's pelt over the shoulders with its head on the near one, braids, a long lance with a dog-tail streamer */
  foolish_dog(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.1, 1.1); const sway = o.still ? 0 : Math.sin(t/500 + (o.phase||0))*.6;
    B2F.line(ctx, '#5a4026', 1.5, [[8.4, 12.6], [10.2, -28]], 'butt'); poly(ctx, [[10.4,-34],[9.2,-27.6],[11.4,-27.4]], '#c8c4b8'); // the lance
    B2F.line(ctx, '#a8844a', 1.6, [[10.2, -26.4], [13 + sway, -24.6], [15 + sway*1.4, -21.4]]); B2F.line(ctx, '#6a4a26', .7, [[10.4, -26], [14 + sway*1.2, -22.6]]); // a dog's tail tied below the head
    h.legs('#221e1a'); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-4.8, 8.6, 3.8, 4.4); ctx.fillRect(1, 8.6, 3.8, 4.4); // high boots
    poly(ctx, [[-7.2,-6.4],[7.2,-6.4],[8.2,10],[1,10],[0,7],[-1,10],[-8.2,10]], h.armor('#7a7870', '#1e1d1a')); // the scale coat, split for the saddle
    ctx.save(); poly(ctx, [[-7.2,-6.4],[7.2,-6.4],[8.2,10],[-8.2,10]]); ctx.clip(); b2Scales(ctx, -7.2, 8.2, -6.2, 10, 1.9, '#8a877e', '#3a3832'); ctx.restore();
    ctx.fillStyle = 'rgba(255,250,236,.12)'; ctx.fillRect(-6.8, -6, 2.2, 10); // the iron catching the light
    ctx.fillStyle = '#2a1e12'; ctx.fillRect(-7.6, 2.4, 15.2, 1.6); ctx.fillStyle = '#c8a24a'; for (let i=0;i<4;i++) ctx.fillRect(-6 + i*3.4, 2.7, .9, .9); // a studded belt
    // the dog's pelt: tawny, over both shoulders, the head with its ears on the near shoulder, a paw hanging down the chest
    poly(ctx, [[-8.4,-7.4],[7.8,-7.4],[8.4,-3.2],[3,-4.4],[0,-3],[-3.6,-4.4],[-8.8,-2.6]], h.armor('#b08a50', '#4a3418')); ctx.fillStyle = 'rgba(60,40,20,.4)'; for (let i=0;i<8;i++) ctx.fillRect(-7.6 + i*2, -6.6 + (i%2)*1.2, .5, 1.6);
    poly(ctx, [[-1.4,-4],[.6,-4.4],[1,1.4],[-.6,2]], '#9a7642'); ell(ctx, .1, 2, .9, .7, '#5a3e20'); // a foreleg and its paw
    ell(ctx, -7.6, -7.6, 2.6, 2.2, h.armor('#c0985a', '#5a4020')); poly(ctx, [[-9.4,-9],[-9.6,-12],[-8,-9.6]], '#8a6a3a'); poly(ctx, [[-7,-9.4],[-6.4,-12.2],[-5.6,-9]], '#a07c46'); poly(ctx, [[-9.6,-7.4],[-12,-6.4],[-11.6,-5.4],[-9.4,-6]], '#a07c46'); ctx.fillStyle = '#0e0806'; ctx.fillRect(-9, -8.4, .8, .7); ell(ctx, -11.8, -5.9, .5, .5, '#120a06'); // the dog's head, muzzle out
    h.head('#7a5a40', 4.4, -11.4); h.look('rgba(20,10,6,.88)', -11.8); B2F.braids(ctx, '#0e0a08', 11, -12.8);
    ctx.fillStyle = h.armor('#8a877e', '#1e1d1a'); ctx.beginPath(); ctx.moveTo(-5.4, -12.4); ctx.quadraticCurveTo(-5, -17.6, 0, -18.6); ctx.quadraticCurveTo(5, -17.6, 5.4, -12.4); ctx.closePath(); ctx.fill(); ctx.fillRect(-5.6, -13, 11.2, 1.3); ctx.fillStyle = 'rgba(255,250,240,.24)'; ctx.fillRect(-3.4, -16.8, 1.2, 3); // a peaked iron helm
    ctx.fillStyle = '#5a5650'; ctx.fillRect(1.6, -12.4, 1.2, 4); // the nasal
    ctx.fillStyle = 'rgba(176,80,42,.55)'; ctx.fillRect(-2.6, -9.6, 1.4, .6); ctx.fillRect(3.4, -9.6, 1.4, .6); // ochre on the cheeks
    ctx.restore(); },

  /* a Weasel Clan warrior: small, wiry, bare-armed and tattooed, a weasel's pelt across the chest, braids and a topknot, the teeth filed to points and shown */
  weasel(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .94, .96); const sk = b2Pick(o, ['#8a6448', '#7a5a40', '#946c4c']), hide = b2Pick(o, [['#7a5634','#2a1c10'], ['#6a4a30','#22160c'], ['#84603a','#2e2012']]);
    h.legs('#2e2418'); ctx.fillStyle = '#4a3a26'; ctx.fillRect(-4.5, 9, 3.4, 4); ctx.fillRect(1.1, 9, 3.4, 4); ctx.fillStyle = 'rgba(200,180,140,.5)'; for (let i=0;i<4;i++){ ctx.fillRect(-4.4 + i*.9, 8.4, .4, 1.4); ctx.fillRect(1.2 + i*.9, 8.4, .4, 1.4); } // fringed leggings
    poly(ctx, [[-5,-6],[5,-6],[5.6,7.4],[-5.6,7.4]], h.armor(hide[0], hide[1])); ctx.fillStyle = 'rgba(200,180,140,.5)'; for (let i=0;i<6;i++) ctx.fillRect(-5 + i*2, 7.2, .5, 1.8 + (i%2)*.8); // a sleeveless hide shirt
    ctx.fillStyle = sk; ctx.fillRect(-7.2, -5.6, 2.4, 8); ctx.fillRect(4.8, -5.6, 2.4, 6); ctx.fillStyle = 'rgba(40,60,110,.55)'; for (let i=0;i<3;i++){ ctx.fillRect(-7.2, -4.4 + i*2, 2.4, .5); ctx.fillRect(4.8, -4.4 + i*2, 2.4, .5); } // bare arms, tattooed in rings
    poly(ctx, [[-5.4,-5.2],[-3.6,-6.4],[5.6,3.4],[4,4.6]], h.armor('#8a5a2a', '#3a2010')); ctx.fillStyle = '#e8dcc0'; poly(ctx, [[-4.4,-4.6],[-3.4,-5.2],[4.2,2.8],[3.6,3.4]], 'rgba(232,220,192,.55)'); // the weasel's pelt, its pale belly
    ell(ctx, -5, -5.6, 1.4, 1, '#7a4a22'); ctx.fillStyle = '#0a0604'; ctx.fillRect(-5.8, -6, .5, .5); B2F.line(ctx, '#5a3418', 1.1, [[4.8, 4], [5.6, 7.6], [4.4, 9.6]]); ctx.fillStyle = '#1a0e06'; ctx.fillRect(3.8, 9, 1.2, 1.4); // its head at the shoulder, its black-tipped tail
    ctx.fillStyle = '#c8a24a'; ctx.fillRect(-5.4, 2.6, 10.8, .9); // beads
    ctx.fillStyle = '#2a2018'; ctx.fillRect(-9, -8, 1.8, 10); B2F.line(ctx, '#6a4a2a', 1.1, [[-10, -9], [-7.6, 3]]); // a horse-bow, slung
    h.head(sk, 4.3, -11.4); h.look('rgba(20,12,8,.9)', -12);
    B2F.cap(ctx, '#0e0a08', 4.5, -12.8, 1, 2); B2F.braids(ctx, '#120e0c', 8, -12.6); ell(ctx, .4, -17.4, 1.6, 1.4, '#0e0a08'); B2F.line(ctx, '#0e0a08', 1.2, [[.4, -18], [-2.6, -20], [-4.6, -18.6]]); ctx.fillStyle = '#b02a1c'; ctx.fillRect(-.6, -16.4, 2, .7); // braids, and a topknot tied with red
    ctx.fillStyle = 'rgba(176,60,30,.6)'; ctx.fillRect(-2.4, -10.4, 1.4, .5); ctx.fillRect(-2.4, -9.6, 1.4, .5); // red slashes on the cheek
    poly(ctx, [[-1.6,-8.6],[4,-8.6],[3.4,-6.6],[-1,-6.6]], '#1e0806'); ctx.fillStyle = '#ece4d0'; for (let i=0;i<5;i++){ const tx = -1.2 + i*1.05; poly(ctx, [[tx,-8.6],[tx + .9,-8.6],[tx + .45,-7.5]], '#ece4d0'); poly(ctx, [[tx + .5,-6.6],[tx + 1.3,-6.6],[tx + .9,-7.6]], '#d8ccb0'); } // the grin: every tooth filed to a point
    B2F.curved(ctx, '#c8c0b0', .95); ctx.restore(); },

  /* the Tithansi warleader, with what is left of the Semk god in him: the veil torn down, the face ashed and painted, the head on one side, one arm too long; sick green light */
  warleader(ctx, h, t, o){ const p = (Math.sin(t/240 + (o.phase||0)) + 1)/2, tw = o.still ? 0 : Math.sin(t/170)*.06, jerk = o.still ? 0 : (Math.sin(t/90) > .93 ? .5 : 0);
    glow(ctx, 0, -2, 20, '#8ac040', .1 + p*.1); ctx.save(); B2F.grow(ctx, 1.08, 1.1);
    h.legs('#3a3024'); ctx.fillStyle = '#4a3a26'; ctx.fillRect(-4.6, 7.4, 3.6, 5.6); ctx.fillRect(1, 7.4, 3.6, 5.6);
    poly(ctx, [[-6.6,-6],[6.6,-6],[7.6,8],[4,10.6],[1,8],[-2,11],[-5,8.4],[-7.6,9.6]], h.armor('#a08868', '#2e2416')); ctx.fillStyle = '#7a2a1e'; ctx.fillRect(-6.6, 1, 13.2, 1.6); // the warleader's robes, torn at the hem, the madder sash
    poly(ctx, [[-3.4,-6],[3.4,-6],[2.4,1],[-2.4,1]], '#6a6a44'); ctx.strokeStyle = `rgba(160,220,80,${.5 + p*.4})`; ctx.lineWidth = .6; ctx.beginPath(); ctx.arc(0, -3, 1.8, 0, 5.4); ctx.moveTo(-2.6, -5.4); ctx.lineTo(2.6, -.6); ctx.stroke(); // the chest bared, a green spiral painted on it
    ctx.fillStyle = 'rgba(214,210,196,.55)'; for (let i=0;i<3;i++) ctx.fillRect(-2.8 + i*2.2, -5.6, .5, 4.2);
    ctx.fillStyle = '#c9a44a'; ctx.fillRect(-6.4, -6.4, 12.8, 1); // gold at the collar
    B2F.line(ctx, '#a08868', 2, [[-6, -4], [-8.6, 3], [-9.4, 9.6]]); ell(ctx, -9.6, 10.6, 1.4, 1.2, '#6a6a44'); B2F.line(ctx, '#3a3a20', .5, [[-10.6, 11], [-11.2, 12.4]]); B2F.line(ctx, '#3a3a20', .5, [[-9.4, 11.6], [-9.6, 13]]); // one arm hanging, too long, the fingers crooked
    B2F.curved(ctx, '#b8b8a0', 1); // the other still holds his sword
    ctx.save(); ctx.translate(0, -8); ctx.rotate(-.32 + tw + jerk); ctx.translate(0, 8); // the head, on one side
    h.head('#6e6c46', 4.4, -11.4); ctx.fillStyle = 'rgba(226,222,206,.55)'; ctx.fillRect(-3.4, -13, 7.6, 2); ctx.fillRect(-1.6, -10.4, 5.6, 1); // an ash mask
    ctx.strokeStyle = 'rgba(120,180,60,.8)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(-.6, -14.6); ctx.lineTo(-.2, -8); ctx.moveTo(3.4, -14.6); ctx.lineTo(3, -8); ctx.stroke(); // green lines down through the eyes
    ell(ctx, 1.6, -7.6, 1.3, 1, '#100c06'); // the mouth, open
    ctx.fillStyle = `rgba(190,255,110,${.75 + p*.25})`; ctx.fillRect(-1.2, -12.2, 1.4, 1); ctx.fillRect(2.4, -12.2, 1.4, 1);
    ctx.fillStyle = '#2e2418'; ctx.beginPath(); ctx.arc(0, -12.6, 5, Math.PI*1.02, Math.PI*1.98); ctx.fill(); ctx.fillRect(-5, -13, 10, 1.4); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-5, -13.6, 10, .9); // a wrapped head-cloth with a gold band
    for (let i=0;i<4;i++) B2F.line(ctx, i%2 ? '#1a2a12' : '#0e0e0a', .9, [[-1 + i*.8, -17], [-3 - i*1.4, -21.6 + i*.4], [-6 - i*1.6, -19 + i*.8]]); // a plume of black feathers, gone limp
    poly(ctx, [[-4.6,-8.6],[-6.8,-5.6],[-5.6,-2.6],[-3.6,-6]], '#3a2e24'); ctx.restore(); // the torn veil, hanging
    for (let i=0;i<4;i++){ const k = ((t/1800 + i/4) % 1); ell(ctx, (hash(i, 3) - .5)*12 + Math.sin(t/400 + i)*1.5, 4 - k*26, 1.4*(1 - k) + .3, .9*(1 - k) + .2, `rgba(160,220,80,${.45*(1 - k)})`); } // what is in him, leaking out
    ctx.restore(); },

  /* an officer of the Guran legions: gilded bronze lamellar over mail, a green crest on the domed helm, the mail veil hooked aside to show a hard bearded face, a green cloak, the tulwar up */
  guran_officer(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.1, 1.1); const sw = o.still ? 0 : Math.sin(t/600 + (o.phase||0))*.5;
    poly(ctx, [[-6.8,-6.4],[-3,-6.8],[-4,6],[-6.6,12.4],[-9.4,11.6]], h.armor('#2e5a2a', '#0e1e0c')); // the green cloak, behind
    h.legs('#26221e'); ctx.fillStyle = h.armor('#a07e48', '#3a2810'); ctx.fillRect(-4.6, 6.4, 3.6, 5.2); ctx.fillRect(1, 6.4, 3.6, 5.2); // bronze greaves
    poly(ctx, [[-7,-6.4],[7,-6.4],[8,9.6],[-8,9.6]], h.armor('#7e786c', '#1e1c18')); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<7;i++){ ctx.moveTo(-7.4, -4.6 + i*2.1); ctx.lineTo(7.6, -4.6 + i*2.1); } ctx.stroke(); // the long mail coat
    poly(ctx, [[-6.6,-6.4],[6.6,-6.4],[6.2,3],[-6.2,3]], h.armor('#c8a058', '#4a3210')); ctx.strokeStyle = 'rgba(40,24,6,.55)'; ctx.lineWidth = .45; ctx.beginPath(); for (let i=0;i<9;i++){ ctx.moveTo(-5.8 + i*1.45, -6); ctx.lineTo(-5.8 + i*1.45, 2.8); } for (let r=0;r<3;r++){ ctx.moveTo(-6.4, -3.6 + r*2.6); ctx.lineTo(6.4, -3.6 + r*2.6); } ctx.stroke(); // gilded lamellar
    ctx.fillStyle = 'rgba(255,236,180,.25)'; ctx.fillRect(-6, -6, 2.2, 8.6); ell(ctx, 0, -2, 2, 2, '#e8c878'); ell(ctx, -.5, -2.5, .8, .8, '#fff4d0'); // the shine; a sun-disc on the breast
    ctx.fillStyle = '#2e6a2a'; ctx.fillRect(-7.2, 3, 14.4, 1.8); ctx.fillStyle = '#2e6a2a'; ctx.fillRect(4.6, 4.6, 1.8, 4.4); // the rising's green, as a sash
    h.head('#7a5a40', 4.6, -11.2); h.look('rgba(20,10,6,.9)', -11.8); poly(ctx, [[-3.6,-9.6],[4.8,-9.6],[4.2,-6],[1.2,-4.4],[-2,-5.6]], '#120c08'); ctx.fillStyle = 'rgba(200,190,170,.3)'; ctx.fillRect(1.4, -6.4, 1.4, 1.4); // a black beard, a grey streak
    ctx.fillStyle = '#100a06'; ctx.fillRect(-1, -12.6, 5.4, .7); // a heavy brow
    poly(ctx, [[-5.4,-11],[-4,-11],[-4.8,-5],[-6.8,-5.6]], '#4e4a44'); ctx.fillStyle = 'rgba(190,186,176,.35)'; for (let r=0;r<4;r++) ctx.fillRect(-6 + (r%2)*.6, -10.4 + r*1.3, .6, .6); // the mail veil, hooked aside
    ctx.fillStyle = h.armor('#c0a060', '#3a2a0e'); ctx.beginPath(); ctx.arc(0, -12.6, 5.4, Math.PI, 0); ctx.fill(); ctx.fillRect(-5.6, -13, 11.2, 1.4); ctx.fillStyle = 'rgba(255,250,220,.3)'; ctx.fillRect(-3.6, -16.8, 3, 1); // a bronze dome
    ctx.fillStyle = '#5a5650'; ctx.fillRect(-.5, -20.2, 1, 2.4); for (let i=0;i<9;i++){ const a = -1.2 + i*.24; B2F.line(ctx, i%3 ? '#2e6a2a' : '#4a9a3e', .9, [[0, -20], [Math.sin(a)*2.4 - 2.6 + sw, -21 + Math.cos(a)*1], [-5 + i*.3 + sw*1.4, -17.4 + i*.4]]); } // the crest of green horsehair, falling back
    ctx.save(); ctx.translate(1, -1); ctx.rotate(-.35); B2F.curved(ctx, '#e0d8c8', 1.1); ctx.restore(); ctx.fillStyle = '#c9a44a'; ctx.fillRect(6.2, 1.4, 1.8, 1.2); // the tulwar, raised
    ctx.restore(); },
});

/* ---------------- ground: the warlocks' tunnel, and Gelor Ridge above the P'atha ---------------- */
/* spirit-light from every 'l' within a few tiles, laid in world space over this tile (cool, pale, the Wickans' dead) */
function b2SpiritLit(ctx, x, y, T, a, rad = 3.6){ if (!tileMap) return; const px = x*T, py = y*T, n = Math.ceil(rad);
  for (let dy=-n; dy<=n; dy++) for (let dx=-n; dx<=n; dx++){ const row = tileMap[y + dy]; if (!row || row[x + dx] !== 'l') continue;
    const cx = (x + dx + .5)*T, cy = (y + dy + .42)*T, R = T*rad, g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, `rgba(176,226,206,${a})`); g.addColorStop(.3, `rgba(140,200,190,${a*.45})`); g.addColorStop(1, 'rgba(120,180,180,0)'); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); } }

/* the tunnel the warlocks raised: earth pulled open like cloth, the walls smoothed in long ripples, roots through everything, water seeping in; no light but theirs */
const b2TW = c => c === '~' || c === '-', b2TDep = c => c === '~' ? 2 : c === '-' ? 1 : 0;
function b2Tunnel(ctx, ch, x, y, T){
  const px = x*T, py = y*T, h = hash(x, y), fill = c => { ctx.fillStyle = c; ctx.fillRect(px, py, T, T); };
  const P = {earth:'#3a2e22', earthL:'#54442e', wall:'#1c140c', face:'#3e3020', faceD:'#140e08', root:'#8a7a5c', rootD:'#4a3c28', w0:'#2e3a36', w1:'#1a2624', w2:'#0a1212'};
  const floor = () => { fill(shade(P.earth, (h - .5)*.05)); b2Mottle(ctx, x, y, T, .05, .2, '200,190,160', 1.1);
    ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.lineWidth = Math.max(1, T*.02); for (let i=0;i<3;i++){ const yy = (y + i*.33 + .15)*T; ctx.beginPath(); ctx.moveTo(px, yy + Math.sin(x*1.7 + i*2)*T*.06); ctx.quadraticCurveTo(px + T*.5, yy + Math.sin(x*1.7 + i*2 + .9)*T*.1, px + T, yy + Math.sin((x + 1)*1.7 + i*2)*T*.06); ctx.stroke(); } // ripples where the earth was drawn back, continuous across the floor
    ctx.strokeStyle = 'rgba(200,180,140,.07)'; for (let i=0;i<3;i++){ const yy = (y + i*.33 + .17)*T; ctx.beginPath(); ctx.moveTo(px, yy + Math.sin(x*1.7 + i*2)*T*.06 + 1); ctx.quadraticCurveTo(px + T*.5, yy + Math.sin(x*1.7 + i*2 + .9)*T*.1 + 1, px + T, yy + Math.sin((x + 1)*1.7 + i*2)*T*.06 + 1); ctx.stroke(); }
    ctx.fillStyle = 'rgba(16,10,6,.5)'; for (let i=0;i<4;i++) ctx.fillRect(px + hash(x,y,i+20)*T, py + hash(y,x,i+21)*T, Math.max(1, T*.04), Math.max(1, T*.03)); // grit
    if (h > .7) { const cx = px + T*(.25 + hash(x,y,22)*.5), cy = py + T*(.3 + hash(x,y,23)*.5), r = T*.06; ell(ctx, cx + r*.3, cy + r*.4, r*1.1, r*.5, 'rgba(0,0,0,.4)'); ell(ctx, cx, cy, r, r*.7, '#5a5048'); ell(ctx, cx - r*.3, cy - r*.2, r*.4, r*.25, 'rgba(200,210,200,.18)'); } // a stone the warren left
    if (!b2TW(ch)) b2WetEdges(ctx, x, y, T, b2TW, '8,10,10', .55, .4); };
  if (ch === '#') { // the wall: the earth over our heads, and where it drops to the floor, a face of drawn earth hung with roots
    const face = b2Tile(x, y + 1) !== '#', top = b2Tile(x, y - 1) !== '#', fy = py + (face ? T*.42 : T);
    fill(shade(P.wall, (h - .5)*.06)); b2Mottle(ctx, x, y, T, .02, .25, '180,170,150', .8);
    for (let i=0;i<3;i++){ const rx = px + hash(x,y,i+30)*T, ry = py + hash(y,x,i+31)*(fy - py); ctx.strokeStyle = 'rgba(110,96,70,.35)'; ctx.lineWidth = Math.max(1, T*.02); ctx.beginPath(); ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx + T*.1, ry + T*.04, rx + T*.18*(hash(x,y,i+32) - .3), ry + T*.12); ctx.stroke(); } // roots in the roof
    if (top) { const g = ctx.createLinearGradient(0, py, 0, py + T*.3); g.addColorStop(0, 'rgba(0,0,0,.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(px, py, T, T*.3); }
    if (b2Tile(x - 1, y) !== '#') { ctx.fillStyle = 'rgba(150,140,110,.1)'; ctx.fillRect(px, py, T*.05, fy - py); } if (b2Tile(x + 1, y) !== '#') { ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(px + T*.95, py, T*.05, fy - py); }
    if (face) { const wv = s => T*.04*Math.sin((x + s)*5.3) + T*.025*Math.sin((x + s)*13.1); ctx.beginPath(); ctx.moveTo(px, fy + wv(0)); for (let i=1;i<=8;i++) ctx.lineTo(px + i*T/8, fy + wv(i/8)); ctx.lineTo(px + T, py + T); ctx.lineTo(px, py + T); ctx.closePath();
      ctx.fillStyle = vgrad(ctx, fy, py + T, [[0, P.face], [.7, shade(P.face, -.2)], [1, P.faceD]]); ctx.fill(); ctx.save(); ctx.clip();
      for (let i=0;i<4;i++){ ctx.strokeStyle = i%2 ? 'rgba(0,0,0,.28)' : 'rgba(170,150,110,.12)'; ctx.lineWidth = Math.max(1, T*.025); ctx.beginPath(); const yy = fy + T*(.08 + i*.12); ctx.moveTo(px, yy + Math.sin(x*2.3 + i)*T*.03); ctx.quadraticCurveTo(px + T*.5, yy + Math.sin(x*2.3 + i + 1.4)*T*.05, px + T, yy + Math.sin((x + 1)*2.3 + i)*T*.03); ctx.stroke(); } // the long ripples the sorcery left in it
      for (let i=0;i<4;i++){ const rx = px + T*(.1 + hash(x,y,i+40)*.8), l = T*(.16 + hash(x,y,i+41)*.34), sway = (hash(x,y,i+42) - .5)*T*.12; // roots hanging out of the face, hair-fine at the ends
        ctx.strokeStyle = i%2 ? P.root : P.rootD; ctx.lineWidth = Math.max(1, T*.03); ctx.beginPath(); ctx.moveTo(rx, fy - T*.02); ctx.quadraticCurveTo(rx + sway, fy + l*.5, rx + sway*.4, fy + l); ctx.stroke();
        ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(160,146,110,.4)'; ctx.beginPath(); ctx.moveTo(rx + sway*.6, fy + l*.6); ctx.lineTo(rx + sway*.6 + T*.05, fy + l*.8); ctx.moveTo(rx + sway*.4, fy + l); ctx.lineTo(rx + sway*.4 - T*.02, fy + l + T*.06); ctx.stroke(); }
      if (h > .55) { const dx = px + T*(.2 + hash(x,y,44)*.6); ctx.fillStyle = 'rgba(120,170,160,.25)'; ctx.fillRect(dx, fy + T*.1, 1, T*.4); ell(ctx, dx + .5, fy + T*.52, T*.02, T*.03, 'rgba(170,220,210,.5)'); } // a seep, running down
      ctx.restore();
      ctx.strokeStyle = 'rgba(190,170,130,.16)'; ctx.lineWidth = Math.max(1, T*.025); ctx.beginPath(); ctx.moveTo(px, fy + wv(0)); for (let i=1;i<=8;i++) ctx.lineTo(px + i*T/8, fy + wv(i/8)); ctx.stroke(); }
    b2SpiritLit(ctx, x, y, T, .22, 3); return; }
  floor();
  if (b2TW(ch)) { // seeping water: black and still where it pools, a skin over the mud where it is shallow
    const S = b2WaterShape(x, y, T, b2TW, 1.2); ctx.save(); S.path(ctx); ctx.clip();
    b2WaterFill(ctx, x, y, T, b2TDep, v => v <= 1 ? b2Mix(P.w0, P.w1, v) : b2Mix(P.w1, P.w2, v - 1));
    if (ch === '-') for (let i=0;i<2;i++){ const cx = px + T*(.2 + hash(x,y,i+60)*.6), cy = py + T*(.2 + hash(y,x,i+61)*.6), r = T*(.04 + hash(x,y,i+62)*.04); ell(ctx, cx, cy, r*1.3, r, 'rgba(70,60,44,.55)'); } // mud showing through
    b2SpiritLit(ctx, x, y, T, .3, 3.4); // the light lying on it
    ctx.strokeStyle = 'rgba(190,236,220,.22)'; ctx.lineWidth = 1; for (let i=0;i<(ch === '~' ? 2 : 1);i++){ const cx = px + T*(.2 + hash(x,y,i+70)*.6), cy = py + T*(.2 + hash(y,x,i+71)*.6), r = T*(.05 + hash(x,y,i+72)*.08); ctx.beginPath(); ctx.ellipse(cx, cy, r, r*.45, 0, 0, 7); ctx.stroke(); if (h > .5) { ctx.beginPath(); ctx.ellipse(cx, cy, r*1.8, r*.8, 0, Math.PI*1.1, Math.PI*1.9); ctx.stroke(); } } // rings, where it drips from the roof
    b2Mottle(ctx, x, y, T, .03, .08, '160,210,200', 1); ctx.restore();
    b2Lip(ctx, S, T, 'rgba(0,0,0,.45)', 'rgba(160,200,190,.16)'); b2BankCorners(ctx, x, y, T, b2TW, '#1e1810', 1.2); return; }
  if (ch === ',') { // roots: one or two thick ones humping up out of the floor and diving back in, rootlets off them
    const n = 1 + (h > .5 ? 1 : 0); ctx.lineCap = 'round';
    for (let r=0;r<n;r++){ const a0 = hash(x,y,r+80)*6.28, cx = px + T*(.5 + (hash(x,y,r+81) - .5)*.3), cy = py + T*(.5 + (hash(x,y,r+82) - .5)*.3), L = T*(.42 + hash(x,y,r+83)*.18), bend = (hash(x,y,r+84) - .5)*1.6, w0 = Math.max(2, T*(.07 + hash(x,y,r+85)*.04));
      const pt = u => { const a = a0 + bend*(u - .5), d = (u - .5)*2*L; return [cx + Math.cos(a)*d + Math.sin(u*9 + r)*T*.02, cy + Math.sin(a)*d*.8 + Math.cos(u*7 + r)*T*.02]; };
      ell(ctx, pt(.04)[0], pt(.04)[1], w0*.9, w0*.5, 'rgba(0,0,0,.5)'); ell(ctx, pt(.96)[0], pt(.96)[1], w0*.6, w0*.35, 'rgba(0,0,0,.5)'); // where it goes into the earth
      for (let pass=0;pass<3;pass++){ for (let i=0;i<10;i++){ const u0 = .04 + i*.092, u1 = u0 + .1, A = pt(u0), B = pt(u1), w = w0*(1 - u0*.6);
        ctx.strokeStyle = pass === 0 ? 'rgba(0,0,0,.45)' : pass === 1 ? (r ? '#4a3a26' : '#5e4a32') : 'rgba(210,190,150,.28)'; ctx.lineWidth = pass === 2 ? Math.max(1, w*.3) : w; const o = pass === 0 ? T*.03 : pass === 2 ? -w*.25 : 0;
        ctx.beginPath(); ctx.moveTo(A[0] + (pass ? 0 : o), A[1] + o); ctx.lineTo(B[0] + (pass ? 0 : o), B[1] + o); ctx.stroke(); } } // shadow, bark, and the light along its back
      ctx.strokeStyle = 'rgba(150,130,96,.45)'; ctx.lineWidth = 1; for (let i=0;i<3;i++){ const u = .2 + i*.28, [rx, ry] = pt(u), a = a0 + (i%2 ? 1.4 : -1.4) + (hash(x,y,r*5+i+86) - .5); ctx.beginPath(); ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx + Math.cos(a)*T*.08, ry + Math.sin(a)*T*.08 + T*.02, rx + Math.cos(a + .4)*T*.16, ry + Math.sin(a + .4)*T*.14); ctx.stroke(); } } // rootlets, hair-fine
    ctx.lineCap = 'butt'; }
  else if (ch === 'l') { // a spirit-light: a bone stake driven in, a knot of feathers and hair on it, and the light hanging over it that is not fire
    const cx = px + T*.5, by = py + T*.82, ly = py + T*.36;
    ell(ctx, cx, by + T*.02, T*.16, T*.05, 'rgba(0,0,0,.45)');
    ctx.strokeStyle = '#d8ccb0'; ctx.lineWidth = Math.max(1.4, T*.045); ctx.beginPath(); ctx.moveTo(cx, by); ctx.lineTo(cx + T*.02, py + T*.5); ctx.stroke(); ctx.strokeStyle = 'rgba(80,60,40,.6)'; ctx.lineWidth = Math.max(1, T*.015); ctx.beginPath(); ctx.moveTo(cx + T*.015, by); ctx.lineTo(cx + T*.03, py + T*.5); ctx.stroke();
    poly(ctx, [[cx, py + T*.56],[cx - T*.12, py + T*.7],[cx - T*.08, py + T*.72]], '#1a1a20'); poly(ctx, [[cx + T*.02, py + T*.56],[cx + T*.14, py + T*.68],[cx + T*.1, py + T*.7]], '#2a2a30'); ctx.fillStyle = '#b02a1c'; ctx.fillRect(cx - T*.03, py + T*.54, T*.07, T*.04); // crow feathers, a red thread
    glow(ctx, cx, ly, T*.42, '#a8e0cc', .3); glow(ctx, cx, ly, T*.2, '#e0fff4', .5); ell(ctx, cx, ly, T*.06, T*.07, '#f4fffa');
    for (let i=0;i<5;i++){ const a = hash(x,y,i+90)*6.28, d = T*(.12 + hash(x,y,i+91)*.14); ell(ctx, cx + Math.cos(a)*d, ly + Math.sin(a)*d*.7, T*.03, T*.018, 'rgba(210,240,230,.4)', a); } } // wisps round it
  else if (ch === '.') { if (h > .5) b2Prints(ctx, x, y, T, 2 + Math.floor(hash(x,y,9)*3), true); }
  else exitArrow(ctx, ch, px, py, T);
  b2SpiritLit(ctx, x, y, T, .38, 3.6);
}
TILEX.b2tunnel = (ctx, ch, x, y, T, dark) => b2Clip(ctx, x, y, T, () => b2Tunnel(ctx, ch, x, y, T));

/* Gelor Ridge: a long grassy slope of dry gold and olive running up from the P'atha, limestone breaking through, Reloe's ramp banked up with earth */
const b2GW = c => c === '~';
function b2Ridge(ctx, ch, x, y, T, N){
  const px = x*T, py = y*T, h = hash(x, y), fill = c => { ctx.fillStyle = c; ctx.fillRect(px, py, T, T); };
  const P = N ? {gr:'#2a2e30', grL:'#3a4044', grass:'rgba(70,80,84,.55)', grassL:'rgba(110,120,130,.4)', sand:'58,60,68', bush:'#1c2226', bushL:'#2c3438', rock:'#34363e', rockL:'#4a4c58', rockD:'#121318', bank:'#24221f', bankF:'#1c1a18', bankD:'#0a0908', lit:'190,200,230', wet:'8,8,12', w0:'#343a42', w1:'#1e282e', w2:'#0e161a', glint:'rgba(170,190,230,.2)', lip:'rgba(160,170,210,.16)', tree:'#4a4c56'}
              : {gr:'#a8986a', grL:'#c4b47e', grass:'rgba(120,110,60,.6)', grassL:'rgba(220,206,140,.55)', sand:'214,192,146', bush:'#6a7048', bushL:'#98a06a', rock:'#a89c86', rockL:'#d4c8ae', rockD:'#5a5040', bank:'#7e6646', bankF:'#6a5038', bankD:'#2e2014', lit:'255,248,225', wet:'60,46,28', w0:'#8a8a64', w1:'#5e7058', w2:'#2a4244', glint:'rgba(235,245,240,.38)', lip:'rgba(240,236,214,.36)', tree:'#d0c4a8'};
  const ground = () => { fill(shade(P.gr, (h - .5)*.04)); b2Mottle(ctx, x, y, T, N ? .03 : .1, N ? .2 : .13, P.lit, 1.3);
    for (let i=0;i<2;i++){ const yy = (y + i*.5 + .25)*T + Math.sin(y*2.1 + i)*T*.08, g = ctx.createLinearGradient(0, yy - T*.16, 0, yy + T*.16); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, N ? 'rgba(0,0,0,.1)' : 'rgba(90,70,40,.1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(px, yy - T*.16, T, T*.32); } // the slope, in long faint terraces worn by grazing
    ctx.lineWidth = 1; for (let i=0;i<10;i++){ const gx = px + hash(x,y,i+10)*T, gy = py + T*.12 + hash(y,x,i+11)*T*.86, l = T*(.06 + hash(x,y,i+12)*.08); ctx.strokeStyle = i%3 ? P.grass : P.grassL; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + (hash(x,y,i+13) - .3)*T*.08, gy - l); ctx.stroke(); } // dry grass, leaning with the river wind
    ctx.fillStyle = N ? 'rgba(0,0,0,.3)' : 'rgba(90,70,44,.4)'; for (let i=0;i<3;i++) ctx.fillRect(px + hash(x,y,i+20)*T, py + hash(y,x,i+21)*T, Math.max(1, T*.04), Math.max(1, T*.03)); // grit
    for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) if (b2Tile(x + dx, y + dy) === 's') for (let k=0;k<2;k++) b2Soft(ctx, (x + dx + .3 + hash(x+dx, y+dy, 60+k)*.4)*T, (y + dy + .3 + hash(x+dx, y+dy, 62+k)*.4)*T, T*(.85 + hash(x+dx, y+dy, 64+k)*.3), 1, P.sand, .5); // river sand, lying soft
    if (b2Tile(x - 1, y) === '^') { const g = ctx.createLinearGradient(px, 0, px + T*.4, 0); g.addColorStop(0, N ? 'rgba(0,0,0,.45)' : 'rgba(60,40,20,.38)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(px, py, T*.4, T); } // shade off the rock and the bank
    if (!b2GW(ch)) b2WetEdges(ctx, x, y, T, b2GW, P.wet, N ? .5 : .5, .36); };
  if (b2GW(ch)) { // the P'atha: brown-green, quick, and deep enough to drown a horse
    ground(); ctx.fillStyle = `rgba(${P.wet},.55)`; ctx.fillRect(px, py, T, T);
    const S = b2WaterShape(x, y, T, b2GW, 1.3); ctx.save(); S.path(ctx); ctx.clip();
    b2WaterFill(ctx, x, y, T, c => b2GW(c) ? 2 : 0, v => v <= 1 ? b2Mix(P.w0, P.w1, v) : b2Mix(P.w1, P.w2, v - 1));
    const flowH = (() => { let hz = 0, vt = 0; for (let k=-3;k<=3;k++){ if (b2GW(b2Tile(x + k, y))) hz++; if (b2GW(b2Tile(x, y + k))) vt++; } return hz >= vt; })();
    ctx.lineCap = 'round'; for (let i=0;i<4;i++){ const sx = px + hash(x,y,i+40)*T, sy = py + hash(y,x,i+41)*T, len = T*(.25 + hash(x,y,i+42)*.35), wob = T*.03*(hash(x,y,i+43) - .5); ctx.strokeStyle = i%2 ? P.glint : (N ? 'rgba(0,0,0,.3)' : 'rgba(16,30,34,.3)'); ctx.lineWidth = Math.max(1, T*.02); ctx.beginPath();
      if (flowH) { ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + len/2, sy + wob, sx + len, sy); } else { ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + wob, sy + len/2, sx, sy + len); } ctx.stroke(); } ctx.lineCap = 'butt'; // the current
    b2Mottle(ctx, x, y, T, N ? .03 : .08, .08, N ? '150,170,220' : '240,250,255', 1); ctx.restore();
    b2Lip(ctx, S, T, N ? 'rgba(0,0,0,.4)' : 'rgba(40,30,18,.45)', P.lip); b2BankCorners(ctx, x, y, T, b2GW, N ? '#19191e' : '#6a5a40', 1.3); return; }
  if (ch === '#') { // limestone breaking through the turf: pale, lumpy, cracked, its shadow thrown down-slope
    ground(); const isR = c => c === '#';
    if (![[0,-1],[1,0],[0,1],[-1,0]].some(([dx, dy]) => isR(b2Tile(x + dx, y + dy)))) { // alone in the grass: a boulder, and a smaller one leaning on it
      const bould = (cx, cy, rx, ry, k) => { ell(ctx, cx + rx*.3, cy + ry*.55, rx*1.05, ry*.5, N ? 'rgba(0,0,0,.45)' : 'rgba(60,44,24,.38)'); ctx.beginPath(); for (let i=0;i<=16;i++){ const a = i/16*6.28, r = 1 + (hash(x*3 + k, y, i%16) - .5)*.16; const qx = cx + Math.cos(a)*rx*r, qy = cy + Math.sin(a)*ry*r*(a > 0 && a < Math.PI ? .8 : 1); i ? ctx.lineTo(qx, qy) : ctx.moveTo(qx, qy); } ctx.closePath();
        const g = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry); g.addColorStop(0, P.rockL); g.addColorStop(.55, P.rock); g.addColorStop(1, P.rockD); ctx.fillStyle = g; ctx.fill(); ctx.save(); ctx.clip();
        ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(70,58,40,.5)'; ctx.lineWidth = Math.max(1, T*.02); ctx.beginPath(); ctx.moveTo(cx - rx*.5, cy - ry*.6); ctx.lineTo(cx - rx*.1, cy); ctx.lineTo(cx + rx*.2, cy + ry*.7); ctx.moveTo(cx - rx*.1, cy); ctx.lineTo(cx + rx*.6, cy - ry*.2); ctx.stroke();
        ell(ctx, cx - rx*.35, cy - ry*.4, rx*.4, ry*.22, N ? 'rgba(150,160,200,.08)' : 'rgba(255,250,236,.3)'); if (!N) ell(ctx, cx + rx*.2, cy - ry*.3, rx*.2, ry*.12, 'rgba(150,150,90,.35)'); ctx.restore(); };
      bould(px + T*.46, py + T*.5, T*.38, T*.32, 0); bould(px + T*.8, py + T*.74, T*.16, T*.13, 1); return; }
    const S = b2WaterShape(x, y, T, isR, 1.4);
    ctx.save(); ctx.translate(T*.07, T*.09); S.path(ctx); ctx.fillStyle = N ? 'rgba(0,0,0,.45)' : 'rgba(60,44,24,.35)'; ctx.fill(); ctx.restore(); // its shadow
    S.path(ctx); const g = ctx.createLinearGradient(px, py, px + T, py + T); g.addColorStop(0, P.rockL); g.addColorStop(.55, P.rock); g.addColorStop(1, shade(P.rock, -.12)); ctx.fillStyle = g; ctx.fill();
    ctx.save(); S.path(ctx); ctx.clip(); b2Mottle(ctx, x, y, T, N ? .03 : .12, .22, P.lit, .8);
      ctx.strokeStyle = N ? 'rgba(0,0,0,.45)' : 'rgba(70,58,40,.5)'; ctx.lineWidth = Math.max(1, T*.022); ctx.lineCap = 'round'; ctx.beginPath(); for (let i=0;i<3;i++){ let cx = px + T*hash(x,y,i+50), cy = py + T*hash(y,x,i+51); ctx.moveTo(cx, cy); for (let j=0;j<3;j++){ cx += (hash(x,y,i*7+j+52) - .4)*T*.3; cy += (hash(y,x,i*7+j+53) - .3)*T*.25; ctx.lineTo(cx, cy); } } ctx.stroke(); // cracks
      ctx.strokeStyle = N ? 'rgba(150,160,200,.08)' : 'rgba(255,250,236,.3)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i=0;i<3;i++){ const cx = px + T*hash(x,y,i+50) - 1, cy = py + T*hash(y,x,i+51) - 1; ctx.moveTo(cx, cy); ctx.lineTo(cx + (hash(x,y,i*7+52) - .4)*T*.3, cy + (hash(y,x,i*7+53) - .3)*T*.25); } ctx.stroke(); ctx.lineCap = 'butt';
      for (let i=0;i<2;i++){ const cx = px + T*(.2 + hash(x,y,i+58)*.6), cy = py + T*(.2 + hash(y,x,i+59)*.6); ell(ctx, cx, cy + T*.05, T*.16, T*.05, N ? 'rgba(0,0,0,.2)' : 'rgba(80,66,46,.2)'); ell(ctx, cx - T*.02, cy - T*.02, T*.12, T*.05, N ? 'rgba(150,160,200,.05)' : 'rgba(255,250,236,.18)'); } // the lumps of it
      if (!N) for (let i=0;i<3;i++) ell(ctx, px + T*(.2 + hash(x,y,i+55)*.6), py + T*(.2 + hash(y,x,i+56)*.6), T*.07, T*.04, 'rgba(150,150,90,.3)'); // lichen
    ctx.restore(); b2Lip(ctx, S, T, N ? 'rgba(0,0,0,.35)' : 'rgba(70,56,36,.4)', N ? 'rgba(170,180,220,.1)' : 'rgba(255,250,232,.35)'); return; }
  if (ch === '^') { // the ramp's bank: earth thrown up and packed, its top trodden, its face cut steep, stakes in it where the sappers will wait
    const face = b2Tile(x, y + 1) !== '^', top = b2Tile(x, y - 1) !== '^', fy = py + (face ? T*.48 : T);
    fill(shade(P.bank, (h - .5)*.05)); b2Mottle(ctx, x, y, T, N ? .02 : .07, .16, P.lit, 1);
    { const L = b2Tile(x - 1, y) !== '^', R = b2Tile(x + 1, y) !== '^'; if (L || R) { const g = ctx.createLinearGradient(px, 0, px + T, 0); g.addColorStop(0, L ? (N ? 'rgba(150,160,200,.1)' : 'rgba(255,246,220,.3)') : 'rgba(0,0,0,0)'); g.addColorStop(.45, 'rgba(0,0,0,0)'); g.addColorStop(1, R ? 'rgba(0,0,0,.42)' : 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); }
      if (L) { ctx.fillStyle = N ? 'rgba(170,180,220,.14)' : 'rgba(255,248,226,.45)'; ctx.fillRect(px, py, Math.max(1, T*.04), T); ctx.fillStyle = 'rgba(40,28,14,.35)'; ctx.fillRect(px + T*.04, py, 1, T); } if (R) { ctx.fillStyle = 'rgba(20,12,6,.55)'; ctx.fillRect(px + T*.95, py, T*.05, T); }
      if (L && R) { ctx.strokeStyle = N ? 'rgba(150,160,200,.1)' : 'rgba(255,246,220,.25)'; ctx.lineWidth = Math.max(1, T*.02); ctx.beginPath(); ctx.moveTo(px + T*.42 + Math.sin(y*3)*T*.03, py); ctx.lineTo(px + T*.42 + Math.sin(y*3 + 3)*T*.03, py + T); ctx.stroke(); } } // a rounded crest: lit on the left, falling into shadow on the right
    ctx.strokeStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(70,50,30,.3)'; ctx.lineWidth = 1; for (let i=0;i<4;i++){ const sx = px + hash(x,y,i+60)*T, sy = py + hash(y,x,i+61)*(fy - py); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + T*.14, sy + T*.01); ctx.stroke(); } // spade-marks in the packed earth
    ctx.lineWidth = 1; for (let i=0;i<4;i++){ const gx = px + hash(x,y,i+62)*T, gy = py + T*.1 + hash(y,x,i+63)*(fy - py - T*.1); ctx.strokeStyle = P.grass; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + T*.03, gy - T*.08); ctx.stroke(); } // grass coming back on it
    if (top) { ctx.fillStyle = N ? 'rgba(150,160,200,.08)' : 'rgba(255,246,220,.24)'; ctx.fillRect(px, py, T, T*.06); }
    if (b2Tile(x - 1, y) !== '^') { ctx.fillStyle = N ? 'rgba(150,160,200,.05)' : 'rgba(255,246,220,.14)'; ctx.fillRect(px, py, T*.05, fy - py); } if (b2Tile(x + 1, y) !== '^') { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(px + T*.95, py, T*.05, fy - py); }
    if (face) { const wv = s => T*.03*Math.sin((x + s)*6.1); ctx.beginPath(); ctx.moveTo(px, fy + wv(0)); for (let i=1;i<=8;i++) ctx.lineTo(px + i*T/8, fy + wv(i/8)); ctx.lineTo(px + T, py + T); ctx.lineTo(px, py + T); ctx.closePath();
      ctx.fillStyle = vgrad(ctx, fy, py + T, [[0, P.bankF], [1, P.bankD]]); ctx.fill(); ctx.save(); ctx.clip();
      for (let i=0;i<3;i++){ const yy = fy + T*(.1 + i*.14); ctx.fillStyle = N ? 'rgba(0,0,0,.25)' : `rgba(${i%2 ? '40,26,14' : '160,130,90'},.28)`; ctx.fillRect(px, yy, T, Math.max(1, T*.035)); } // the courses it was packed in
      for (let i=0;i<3;i++){ const sx = px + T*(.12 + hash(x,y,i+66)*.76); ell(ctx, sx, fy + T*(.16 + hash(y,x,i+67)*.26), T*.05, T*.035, N ? '#2a2a2e' : '#8a8274'); } ctx.restore(); // stones packed in
      ctx.strokeStyle = N ? 'rgba(150,160,200,.12)' : 'rgba(255,240,200,.3)'; ctx.lineWidth = Math.max(1, T*.025); ctx.beginPath(); ctx.moveTo(px, fy + wv(0)); for (let i=1;i<=8;i++) ctx.lineTo(px + i*T/8, fy + wv(i/8)); ctx.stroke();
      if (h > .45) for (let i=0;i<2;i++){ const sx = px + T*(.25 + i*.4 + hash(x,y,i+68)*.1); B2F.line(ctx, N ? '#3a3028' : '#6a4e30', Math.max(1.2, T*.035), [[sx, fy + T*.18], [sx + T*.1, fy + T*.02]]); poly(ctx, [[sx + T*.08, fy + T*.04],[sx + T*.14, fy - T*.04],[sx + T*.11, fy + T*.05]], N ? '#4a4038' : '#a08a62'); } } // sharpened stakes, angled out
    return; }
  ground();
  if (ch === ',') { const bush = (cx, cy, r) => { ell(ctx, cx + r*.4, cy + r*.4, r*1.1, r*.5, N ? 'rgba(0,0,0,.35)' : 'rgba(70,50,30,.3)'); for (let i=0;i<6;i++){ const a = i/6*6.28 + h*3; ell(ctx, cx + Math.cos(a)*r*.5, cy + Math.sin(a)*r*.4, r*.45, r*.35, i < 3 ? P.bush : shade(P.bush, -.2)); } ell(ctx, cx - r*.2, cy - r*.22, r*.4, r*.25, P.bushL); };
    bush(px + T*(.32 + hash(x,y,50)*.2), py + T*(.4 + hash(x,y,51)*.2), T*.2); if (h > .4) bush(px + T*(.68 + hash(x,y,52)*.1), py + T*(.68 + hash(x,y,53)*.1), T*.13); // thorn-scrub, low
    if (!N && h > .6) for (let i=0;i<3;i++) ell(ctx, px + T*(.25 + hash(x,y,i+54)*.5), py + T*(.3 + hash(y,x,i+55)*.4), T*.018, T*.018, '#e0c860'); } // a few yellow flowers
  else if (ch === 's') { ctx.strokeStyle = N ? 'rgba(0,0,0,.14)' : 'rgba(150,120,80,.22)'; ctx.lineWidth = 1; for (let i=0;i<3;i++){ const yy = py + T*(.2 + i*.3); ctx.beginPath(); ctx.moveTo(px + T*.1, yy); ctx.quadraticCurveTo(px + T*.5, yy - T*.08 + ((x + i)%2)*T*.08, px + T*.9, yy); ctx.stroke(); } }
  else if (ch === 'x') { const cx = px + T*.48, cy = py + T*.74; ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(80,56,32,.35)'; ctx.lineWidth = Math.max(1.5, T*.05); ctx.beginPath(); ctx.moveTo(cx + T*.04, cy + T*.04); ctx.lineTo(cx + T*.4, cy + T*.16); ctx.stroke(); // a dead tree, bleached, its shadow down the slope
    const br = (x0, y0, a, len, w, d) => { const x1 = x0 + Math.cos(a)*len, y1 = y0 + Math.sin(a)*len; ctx.strokeStyle = P.tree; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(80,60,40,.45)'; ctx.lineWidth = w*.4; ctx.beginPath(); ctx.moveTo(x0 + w*.3, y0); ctx.lineTo(x1 + w*.3, y1); ctx.stroke(); if (d > 0) { br(x1, y1, a - .5 - hash(x, d, 7)*.4, len*.66, w*.62, d - 1); br(x1, y1, a + .45 + hash(y, d, 8)*.4, len*.6, w*.6, d - 1); } };
    br(cx, cy, -Math.PI/2 - .12, T*.28, Math.max(1.6, T*.075), 2); ctx.lineCap = 'butt'; }
  else if (ch === 'r') { const stone = (cx, cy, r) => { ell(ctx, cx + r*.35, cy + r*.4, r*1.05, r*.55, N ? 'rgba(0,0,0,.4)' : 'rgba(70,46,26,.35)'); ell(ctx, cx, cy, r, r*.72, P.rock); ell(ctx, cx - r*.25, cy - r*.22, r*.55, r*.35, P.rockL); };
    stone(px + T*.36, py + T*.42, T*.18); stone(px + T*.68, py + T*.66, T*.12); }
  else if (ch === 'W') b2Wagon(ctx, px, py, T, N);
  else if (ch === '=') b2Tent(ctx, px, py, T, N, x, y);
  else if (ch !== '.') exitArrow(ctx, ch, px, py, T);
}
TILEX.ridge = (ctx, ch, x, y, T, dark) => b2Clip(ctx, x, y, T, () => b2Ridge(ctx, ch, x, y, T, !!dark));

/* ---------------- backdrops: inside the tunnel, Gelor from below, the charge ---------------- */
/* a horse and rider at the gallop, side on, facing d (1 right, -1 left); legs in one of two strides */
function b2Rider(x, cx, cy, s, col, d, k, lance){ x.fillStyle = col; x.strokeStyle = col; x.lineCap = 'round';
  x.beginPath(); x.ellipse(cx, cy - 6*s, 5.4*s, 2.4*s, 0, 0, 7); x.fill(); // the barrel
  x.lineWidth = 1.6*s; x.beginPath(); x.moveTo(cx + 4*d*s, cy - 7*s); x.lineTo(cx + 7*d*s, cy - 10.4*s); x.stroke(); x.beginPath(); x.ellipse(cx + 8*d*s, cy - 10.2*s, 2*s, 1*s, .5*d, 0, 7); x.fill(); // neck stretched, head
  x.lineWidth = .9*s; const L = k ? [[3.6, 6, -3, 8.4, -1.6], [4.4, 5.6, -2.4, 7, -.3], [-3.6, -6, -3.2, -8.6, -1.4], [-4.4, -5.4, -2.4, -7, -.2]] : [[3.6, 3.4, -2.6, 1.4, 0], [4.4, 5, -2.4, 3.2, -.2], [-3.6, -1.6, -2.8, .6, 0], [-4.4, -3, -2.4, -1.4, -.2]]; // stretched out, or gathered under
  L.forEach(([hx, kx, ky, fx, fy]) => { x.beginPath(); x.moveTo(cx + hx*d*s, cy - 5*s); x.lineTo(cx + kx*d*s, cy + ky*s); x.lineTo(cx + fx*d*s, cy + fy*s); x.stroke(); });
  x.lineWidth = 1*s; x.beginPath(); x.moveTo(cx - 5*d*s, cy - 7*s); x.quadraticCurveTo(cx - 8*d*s, cy - 7*s, cx - 9*d*s, cy - 4*s); x.stroke(); // tail out behind
  x.beginPath(); x.ellipse(cx, cy - 11*s, 1.4*s, 3*s, -.25*d, 0, 7); x.fill(); x.beginPath(); x.arc(cx + .6*d*s, cy - 14.6*s, 1.1*s, 0, 7); x.fill(); // the rider, leaning in
  if (lance) { x.lineWidth = .6*s; x.beginPath(); x.moveTo(cx - 6*d*s, cy - 13*s); x.lineTo(cx + 16*d*s, cy - 9*s); x.stroke(); }
  x.lineCap = 'butt'; }

SCENEX.b2_tunnel = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, vx = W*.56, vy = H*.44, p = (Math.sin(t/900) + 1)/2;
  const ring = (s) => ({x0: vx - W*.7*s, x1: vx + W*.7*s, top: vy - H*.62*s, fl: vy + H*.6*s}); // the tunnel's mouth at depth s (1 near, toward 0 far)
  const arch = (x, s, i = 0) => { const n = 30, P = []; for (let j=0;j<n;j++){ const a = j/n*Math.PI*2, r = 1 + (hash(i, j, 7) - .5)*.1 + Math.sin(a*3 + i)*.03; P.push([vx + Math.cos(a)*W*.66*s*r, Math.min(vy + Math.sin(a)*H*.7*s*r, vy + H*.56*s)]); } // a burrow, not a vault: round, lumpy, the floor trodden flat
    x.beginPath(); P.forEach((p, j) => { const q = P[(j + 1) % n], m = [(p[0] + q[0])/2, (p[1] + q[1])/2]; j ? x.quadraticCurveTo(p[0], p[1], m[0], m[1]) : x.moveTo(m[0], m[1]); }); const q0 = P[0], q1 = P[1]; x.quadraticCurveTo(q0[0], q0[1], (q0[0] + q1[0])/2, (q0[1] + q1[1])/2); x.closePath(); };
  ctx.drawImage(sceneLayer('b2:tunnel', W, H, (x, W, H) => {
    x.fillStyle = '#120c08'; x.fillRect(0, 0, W, H);
    for (let i=0;i<=16;i++){ const s = Math.pow(.8, i + (hash(i, 9) - .5)*.5), k = 1 - i/16; arch(x, s, i); x.fillStyle = b2Mix('#030405', i%2 ? '#3e2e1e' : '#4a3826', Math.pow(k, 2.2)); x.fill(); // the walls, ring by ring, ribbed, darker as they go
      x.save(); arch(x, s, i); x.clip(); const r = ring(s), g = x.createLinearGradient(r.x0, 0, r.x1, 0); g.addColorStop(0, `rgba(0,0,0,${.35*k})`); g.addColorStop(.3, 'rgba(0,0,0,0)'); g.addColorStop(.7, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${.45*k})`); x.fillStyle = g; x.fillRect(r.x0, r.top, r.x1 - r.x0, r.fl - r.top); x.restore();
      x.strokeStyle = `rgba(0,0,0,${.5*k})`; x.lineWidth = 1 + 3*s; arch(x, s, i); x.stroke(); x.strokeStyle = `rgba(200,180,140,${.1*k})`; x.lineWidth = 1 + s; arch(x, s*.985, i); x.stroke(); } // ridges the sorcery left, like the inside of a throat
    for (let i=0;i<40;i++){ const s = Math.pow(.8, hash(i, 51)*12), r = ring(s), side = hash(i, 52) > .5 ? 1 : -1, px = vx + side*(r.x1 - r.x0)*(.38 + hash(i, 53)*.1), py = r.top + (r.fl - r.top)*(.35 + hash(i, 54)*.5); ell(x, px, py, 3*s + .4, 2*s + .3, `rgba(${hash(i, 55) > .5 ? '120,104,80' : '10,8,6'},.5)`); } // stones and root-ends in the walls
    // the floor: water lying the length of it, dark, with mud banks either side
    x.fillStyle = 'rgba(20,14,10,.6)'; x.beginPath(); x.moveTo(vx - W*.02, vy + H*.02); x.lineTo(vx + W*.02, vy + H*.02); x.lineTo(W*.95, H); x.lineTo(W*.12, H); x.closePath(); x.fill();
    x.fillStyle = vgrad(x, vy, H, [[0,'#040707'],[.5,'#0c1514'],[1,'#121c1a']]); x.beginPath(); x.moveTo(vx - W*.006, vy + H*.03); x.lineTo(vx + W*.008, vy + H*.03); x.quadraticCurveTo(W*.64, H*.72, W*.7, H); x.lineTo(W*.32, H); x.quadraticCurveTo(W*.44, H*.72, vx - W*.006, vy + H*.03); x.fill();
    x.strokeStyle = 'rgba(150,200,190,.12)'; x.lineWidth = 1; for (let i=0;i<14;i++){ const k = Math.pow(hash(i, 57), 1.6), yy = lerp(vy + H*.04, H, k), hw = lerp(W*.01, W*.18, k); x.beginPath(); x.moveTo(vx - hw*(.2 + hash(i, 58)*.5), yy); x.lineTo(vx + hw*(.1 + hash(i, 59)*.5), yy); x.stroke(); } // the skin of the water
    // roots: hanging from the roof all the way down, thick near, hair-fine far
    for (let i=0;i<70;i++){ const s = Math.pow(.82, hash(i, 1)*13), r = ring(s), u = hash(i, 2), rx = lerp(r.x0 + (r.x1 - r.x0)*.12, r.x1 - (r.x1 - r.x0)*.12, u), ry = r.top + (r.fl - r.top)*(.06 + Math.pow(Math.abs(u - .5)*2, 2)*.3), l = (16 + hash(i, 3)*50)*s, k = 1 - Math.log(s)/Math.log(.82)/14;
      x.strokeStyle = b2Mix('#0a0a0a', '#7a6a4c', k*.9); x.lineWidth = Math.max(.5, 2.4*s); x.beginPath(); x.moveTo(rx, ry); x.quadraticCurveTo(rx + (hash(i, 4) - .5)*14*s, ry + l*.6, rx + (hash(i, 5) - .5)*10*s, ry + l); x.stroke();
      x.lineWidth = Math.max(.4, .8*s); x.beginPath(); x.moveTo(rx + (hash(i, 4) - .5)*7*s, ry + l*.5); x.lineTo(rx + (hash(i, 6) - .5)*16*s, ry + l*.75); x.stroke(); }
    // far off, small: the marines of the other party, black against a light
    glow(x, vx, vy - H*.02, W*.06, '#a8e0cc', .35); [-6, -2, 3, 7].forEach((dx, i) => { x.fillStyle = '#020303'; x.fillRect(vx + dx - .9, vy - 6 + (i%2)*.4, 1.8, 6); x.beginPath(); x.arc(vx + dx, vy - 7.2, 1.1, 0, 7); x.fill(); });
    vign(x, W, H, .5, .55); }), 0, 0, W, H);
  // the spirit-lights, hung down the tunnel's length at a man's height, breathing; and their light lying on the water
  ctx.globalCompositeOperation = 'lighter';
  for (let i=1;i<7;i++){ const s = Math.pow(.82, i*1.9 - 1.4), r = ring(s), side = i%2 ? -1 : 1, lx = vx + side*(r.x1 - r.x0)*.3, ly = r.top + (r.fl - r.top)*.4 + Math.sin(t*mo/1300 + i*1.7)*4*s, a = .5 + .5*Math.sin(t*mo/1100 + i*2.3);
    glow(ctx, lx, ly, 70*s + 10, '#7ac8b0', (.14 + a*.08)*Math.min(1, s*2)); glow(ctx, lx, ly, 18*s + 3, '#e0fff4', .5); ell(ctx, lx, ly, 2.4*s + .5, 2.8*s + .5, 'rgba(240,255,250,.9)');
    const wy = r.fl - (r.fl - vy)*.12; ell(ctx, lx*.6 + vx*.4, wy, 10*s + 2, 1.6*s + .5, `rgba(170,230,210,${.18 + a*.12})`); // its reflection
    for (let j=0;j<3;j++){ const ph = (t*mo/2600 + j/3 + i*.2) % 1, aa = j*2.1 + t*mo/1600; ell(ctx, lx + Math.cos(aa)*12*s, ly + Math.sin(aa)*6*s - ph*14*s, 1.4*s + .3, .8*s + .2, `rgba(210,250,236,${.4*Math.sin(ph*Math.PI)})`); } } // wisps, turning round them
  for (let i=0;i<10;i++){ const k = ((t*mo/1400 + hash(i, 31)) % 1), dx = W*(.3 + hash(i, 32)*.44), dy = H*(.12 + hash(i, 33)*.2) + k*H*.6; ctx.fillStyle = `rgba(180,230,220,${.35*(1 - k)})`; ctx.fillRect(dx, dy, .8, 2.2); } // drips falling from the roof, catching the light
  for (let i=0;i<4;i++){ const k = ((t*mo/2200 + i/4) % 1), rx = W*(.38 + hash(i, 41)*.24), ry = H*(.72 + hash(i, 42)*.2); ctx.strokeStyle = `rgba(170,230,210,${.3*(1 - k)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(rx, ry, 3 + k*16, 1 + k*4, 0, 0, 7); ctx.stroke(); } // and the rings where they land
  ctx.globalCompositeOperation = 'source-over';
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.1 + i*Math.min(32, W*.45/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  ctx.fillStyle = 'rgba(4,8,8,.42)'; ctx.fillRect(0, H*.7, W, H*.3); // the dark, on their backs
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.3, H*.8, W*.3, '#6ab0a0', .06 + p*.03); ctx.globalCompositeOperation = 'source-over'; // the nearest light, on their shoulders
  vign(ctx, W, H, .75, .5); };

SCENEX.b2_gelor = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.3;
  const crest = px => H*.24 + (1 - px/W)*H*.08 - Math.sin(px/W*3.2 + .4)*H*.04; // the ridge line, higher to the right
  const ramp = k => [lerp(W*.18, W*.66, k), lerp(H*.86, crest(W*.66) + 2, Math.pow(k, .8))], rampW = k => lerp(W*.2, W*.05, Math.pow(k, .7)); // Reloe's ramp, narrowing as it climbs
  const L = sceneLayer('b2:gelor', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, H*.42, [[0,'#8a9aa8'],[.5,'#c8ccc4'],[1,'#f0e8d4']]); x.fillRect(0, 0, W, H*.42); glow(x, W*.2, H*.06, W*.6, '#fffcf0', .55); ell(x, W*.2, H*.06, 12, 12, '#ffffff'); // the white sun, behind and left
    for (let i=0;i<3;i++) cloud(x, W*(.3 + i*.25), H*(.08 + i*.04), W*.3, 4, '#ffffff', .08);
    // the ridge itself: a long hogback of dry grass, limestone in its flank, rising right
    x.fillStyle = vgrad(x, H*.22, H, [[0,'#a8946a'],[.3,'#9a8458'],[.7,'#7a6844'],[1,'#4a3e28']]); x.beginPath(); x.moveTo(0, H); x.lineTo(0, crest(0)); for (let px=0;px<=W + 8;px+=8) x.lineTo(px, crest(px)); x.lineTo(W, H); x.fill();
    x.fillStyle = 'rgba(255,248,226,.28)'; x.beginPath(); x.moveTo(0, crest(0)); for (let px=0;px<=W + 8;px+=8) x.lineTo(px, crest(px)); for (let px=W + 8;px>=0;px-=8) x.lineTo(px, crest(px) + 4); x.fill(); // the crest catching the glare
    for (let i=0;i<5;i++){ const x0 = W*(.05 + i*.22), g = x.createLinearGradient(x0, 0, x0 + W*.12, 0); g.addColorStop(0, 'rgba(60,44,24,0)'); g.addColorStop(.5, 'rgba(60,44,24,.14)'); g.addColorStop(1, 'rgba(60,44,24,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(x0, crest(x0) + 6); x.lineTo(x0 + W*.12, crest(x0 + W*.12) + 6); x.lineTo(x0 - W*.06, H*.8); x.lineTo(x0 - W*.2, H*.8); x.fill(); } // folds in the slope, gullies the rain cut
    for (let i=0;i<14;i++){ const px = W*hash(i, 5), py = crest(px) + 14 + hash(i, 6)*H*.3, s = .6 + (py - H*.3)/H*2; x.fillStyle = 'rgba(200,190,160,.5)'; x.fillRect(px, py, 10*s, 4*s); x.fillStyle = 'rgba(70,56,36,.4)'; x.fillRect(px, py + 3*s, 10*s, 1.6*s); } // limestone showing through
    for (let i=0;i<110;i++){ const py = H*.34 + Math.pow(hash(i, 8), 1.2)*H*.66, px = hash(i, 7)*W, d = (py - H*.34)/(H*.66); ell(x, px, py, 1 + d*4, .6 + d*1.4, `rgba(60,58,30,${.2 + d*.25})`); } // scrub
    // the ramp: an earthen road banked up the slope, pale where it is trodden, its banks throwing shadow
    for (let pass=0;pass<3;pass++){ x.beginPath(); for (let i=0;i<=30;i++){ const k = i/30, [px, py] = ramp(k), w = rampW(k)*(pass === 0 ? 1.3 : pass === 1 ? 1.12 : 1); i ? x.lineTo(px - w/2, py) : x.moveTo(px - w/2, py); } for (let i=30;i>=0;i--){ const k = i/30, [px, py] = ramp(k), w = rampW(k)*(pass === 0 ? 1.3 : pass === 1 ? 1.12 : 1); x.lineTo(px + w/2, py); } x.closePath();
      x.fillStyle = pass === 0 ? 'rgba(60,44,26,.45)' : pass === 1 ? '#7a6444' : vgrad(x, H*.3, H, [[0,'#c8b48a'],[1,'#a08a62']]); x.fill(); }
    x.strokeStyle = 'rgba(110,86,54,.4)'; x.lineWidth = 1; for (let j=0;j<4;j++){ x.beginPath(); for (let i=0;i<=30;i++){ const k = i/30, [px, py] = ramp(k), w = rampW(k), ox = (j/3 - .5)*w*.6 + Math.sin(k*20 + j)*w*.02; i ? x.lineTo(px + ox, py) : x.moveTo(px + ox, py); } x.stroke(); } // ruts, up its length
    for (let side=-1; side<=1; side+=2){ x.strokeStyle = side < 0 ? 'rgba(255,246,220,.35)' : 'rgba(40,28,14,.5)'; x.lineWidth = 2; x.beginPath(); for (let i=0;i<=30;i++){ const k = i/30, [px, py] = ramp(k), w = rampW(k)*1.12; i ? x.lineTo(px + side*w/2, py) : x.moveTo(px + side*w/2, py); } x.stroke(); } // the lips of its banks
    b2Column(x, W, H, k => { const [px, py] = ramp(lerp(.04, .5, k)); return [px + (hash(Math.round(k*99), 3) - .5)*rampW(k*.5)*.5, py]; }, 50, 'rgba(40,32,22,.85)', null); // the Malazans already on it, going up into the funnel
    // the rebel army on the crest: a long dark mass, spears, the green, the city legions in their blocks; dust
    for (let i=0;i<520;i++){ const px = W*(.08 + hash(i, 11)*.92), py = crest(px) - hash(i, 12)*(4 + px/W*6); x.fillStyle = `rgba(28,22,20,${.55 + hash(i, 13)*.45})`; x.fillRect(px, py - 2, 1.3, 3); if (hash(i, 14) > .7) x.fillRect(px + .3, py - 8, .5, 6); }
    for (let b=0;b<3;b++){ const bx = W*(.42 + b*.18), by = crest(bx); x.fillStyle = 'rgba(70,64,56,.85)'; x.fillRect(bx - 18, by - 6, 36, 5); x.fillStyle = 'rgba(200,190,170,.4)'; for (let j=0;j<14;j++) x.fillRect(bx - 17 + j*2.5, by - 6.4, 1.2, .8); for (let j=0;j<10;j++){ x.fillStyle = '#1e1814'; x.fillRect(bx - 16 + j*3.4, by - 15, .5, 9); } } // the legions in their blocks, helms glinting
    for (let i=0;i<9;i++){ const px = W*(.14 + i*.1 + hash(i, 15)*.03), py = crest(px) - 8 - hash(i, 16)*4; x.fillStyle = '#1a1412'; x.fillRect(px, py - 8, .8, 14); x.fillStyle = i%3 ? '#3a7a34' : '#7a2a1e'; x.fillRect(px + .8, py - 8, 5, 3); }
    glow(x, W*.6, crest(W*.6) - 6, W*.45, '#e0d0b0', .18);
    // the P'atha at the foot, a strip of quick brown water; the Malazans coming up to it
    x.fillStyle = vgrad(x, H*.78, H*.86, [[0,'#7a8070'],[1,'#3a4a44']]); x.beginPath(); x.moveTo(0, H*.8); x.quadraticCurveTo(W*.5, H*.76, W, H*.82); x.lineTo(W, H*.88); x.quadraticCurveTo(W*.5, H*.84, 0, H*.88); x.fill();
    x.fillStyle = 'rgba(240,240,230,.3)'; for (let i=0;i<24;i++) x.fillRect(hash(i, 21)*W, H*(.8 + hash(i, 22)*.06), 6 + hash(i, 23)*18, 1);
    x.fillStyle = vgrad(x, H*.86, H, [[0,'#5a4a32'],[1,'#2a2014']]); x.beginPath(); x.moveTo(0, H); x.lineTo(0, H*.88); x.quadraticCurveTo(W*.5, H*.84, W, H*.88); x.lineTo(W, H); x.fill(); // the near bank
    b2Column(x, W, H, k => [lerp(W*1.05, W*.3, Math.pow(k, .8)), lerp(H*.96, H*.88, k)], 70, '#1e1610', null);
  });
  ctx.drawImage(L, 0, 0, W, H);
  if (mo) { const dpr = L.width / W, y0 = Math.round(H*.2), y1 = Math.round(H*.36); for (let y=y0; y<y1; y+=2){ const off = Math.sin(t/180 + y*.7)*1.4*Math.sin((y - y0)/(y1 - y0)*Math.PI); ctx.drawImage(L, 0, y*dpr, L.width, 2*dpr, off, y, W, 2); } } // heat along the crest
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.2, H*.06, W*.6, '#fff8e0', .14); for (let i=0;i<8;i++){ const k = ((t*mo/1700 + hash(i, 51)) % 1), px = W*(.38 + hash(i, 52)*.5); ctx.fillStyle = `rgba(255,255,240,${.5*Math.sin(k*Math.PI)})`; ctx.fillRect(px, crest(px) - 6 - hash(i, 53)*6, 1.4, 1.4); } ctx.globalCompositeOperation = 'source-over'; // helms and spear-points winking up there
  for (let i=0;i<5;i++){ const k = ((t*mo/11000 + i/5) % 1); ell(ctx, W*(.15 + i*.18) + k*40, H*.3 - 4 - k*10, 30 + k*30, 4 + k*3, `rgba(220,206,170,${.14*Math.sin(k*Math.PI)})`); } // their dust, hanging
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.08 + i*Math.min(34, W*.5/sq.length), H*.95 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, .45, .5); };

SCENEX.b2_charge = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, mx = W*.82, my = H*.24;
  const crest = px => H*.26 + (1 - px/W)*H*.12 - Math.sin(px/W*3 + .3)*H*.03; // the ridge, falling away to the left
  ctx.drawImage(sceneLayer('b2:charge', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, H*.4, [[0,'#6a7280'],[.5,'#b8b0a0'],[1,'#e0c8a0']]); x.fillRect(0, 0, W, H*.4); glow(x, W*.4, H*.1, W*.5, '#fff0d0', .3);
    x.fillStyle = vgrad(x, H*.2, H, [[0,'#9a8458'],[.5,'#7a6444'],[1,'#3a2c1c']]); x.beginPath(); x.moveTo(0, H); x.lineTo(0, crest(0)); for (let px=0;px<=W + 8;px+=8) x.lineTo(px, crest(px)); x.lineTo(W, H); x.fill();
    x.fillStyle = 'rgba(255,240,210,.22)'; x.beginPath(); x.moveTo(0, crest(0)); for (let px=0;px<=W + 8;px+=8) x.lineTo(px, crest(px)); for (let px=W + 8;px>=0;px-=8) x.lineTo(px, crest(px) + 3); x.fill();
    for (let i=0;i<120;i++){ const py = H*.3 + Math.pow(hash(i, 8), 1.2)*H*.7, px = hash(i, 7)*W, d = (py - H*.3)/(H*.7); ell(x, px, py, 1 + d*4, .6 + d*1.4, `rgba(50,40,24,${.2 + d*.25})`); }
    // at the crest, small: the two children and the mare going down
    x.fillStyle = '#1a120c'; x.beginPath(); x.ellipse(mx + 6, my + 2, 7, 2.4, -.2, 0, 7); x.fill(); x.fillRect(mx + 11, my - 1, 4, 1.6); // the mare, down
    [[-5, .7], [-1.6, .66]].forEach(([dx, s]) => { x.fillStyle = '#120c08'; x.fillRect(mx + dx - 1.2*s, my - 8*s, 2.4*s, 8*s); x.beginPath(); x.arc(mx + dx, my - 9.2*s, 1.4*s, 0, 7); x.fill(); });
    // the Malazan line, low on the left, holding
    for (let i=0;i<160;i++){ const px = W*hash(i, 61)*.36, py = H*(.82 + hash(i, 62)*.08); x.fillStyle = `rgba(30,24,18,${.6 + hash(i, 63)*.4})`; x.fillRect(px, py - 3, 1.6, 4); if (hash(i, 64) > .8) x.fillRect(px + .4, py - 9, .5, 6); }
    x.fillStyle = vgrad(x, H*.88, H, [[0,'#4a3a26'],[1,'#1a120a']]); x.fillRect(0, H*.9, W, H*.1);
  }), 0, 0, W, H);
  // the mare's light: out of the ground where she fell, white-green, pouring down the slope after them, and going
  const fade = .75 + .25*Math.sin(t*mo/2000), pulse = .8 + .2*Math.sin(t*mo/160);
  ctx.globalCompositeOperation = 'lighter';
  glow(ctx, mx, my, W*.5, '#c8f0d8', .22*fade*pulse); glow(ctx, mx, my, W*.12, '#f4fff8', .5*fade); ctx.save(); ctx.translate(mx, my);
  for (let i=0;i<6;i++){ const a = Math.PI*(.66 + i*.06) + Math.sin(t*mo/900 + i)*.03, l = W*(.35 + hash(i, 71)*.35); const g = ctx.createLinearGradient(0, 0, Math.cos(a)*l, Math.sin(a)*l); g.addColorStop(0, `rgba(220,255,236,${.08*fade})`); g.addColorStop(1, 'rgba(220,255,236,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - .02)*l, Math.sin(a - .02)*l); ctx.lineTo(Math.cos(a + .02)*l, Math.sin(a + .02)*l); ctx.fill(); } // rays, down the slope
  ctx.restore(); ctx.globalCompositeOperation = 'source-over';
  // the Foolish Dogs: a wedge of heavy horse pouring down from the crest toward the left, dust boiling up behind them
  const N = 46; for (let i=0;i<N;i++){ const lane = hash(i, 82), k = (hash(i, 81) + t*mo/9000) % 1, px = lerp(mx - W*.06, W*.06, Math.min(1, k)) + (lane - .5)*W*.14*(1 - k*.5) - lane*W*.08, py = lerp(my + H*.06, H*.8, Math.pow(Math.min(1, k), .9)) + (lane - .5)*H*.1, s = .5 + Math.min(1, k)*1.2;
    ell(ctx, px + 4*s, py + 1, 12*s, 2.4*s, 'rgba(200,180,140,.22)'); b2Rider(ctx, px, py, s, `rgba(${24 + Math.round(hash(i, 83)*20)},${18 + Math.round(hash(i, 84)*14)},14,.95)`, -1, Math.floor(t*mo/110 + i) % 2, hash(i, 85) > .25);
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(200,255,220,${.25*fade})`; ctx.fillRect(px + 1*s, py - 15*s, 1.2*s, 8*s); ctx.globalCompositeOperation = 'source-over'; } // the light on their backs
  for (let i=0;i<14;i++){ const k = ((t*mo/5000 + hash(i, 91)) % 1), px = lerp(mx, W*.1, hash(i, 92)) + k*20, py = lerp(my + H*.08, H*.74, hash(i, 92)) - k*H*.12; ell(ctx, px, py, 26 + k*50, 8 + k*18, `rgba(206,186,146,${.22*Math.sin(k*Math.PI)})`); } // dust, boiling
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.06 + i*Math.min(30, W*.42/sq.length), H*.96 - (i%2)*3, 2.1, t, {phase:i, dir:1}));
  vign(ctx, W, H, .55, .5); };
