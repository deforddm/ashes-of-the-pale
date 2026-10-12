/* ============ Book Two, Chapter 7 art: Aren Way — the walls, the Barrow, the road, the harbour, and the end of the book ============ */
/* Figures (FIGX), Aren's streets and walls and the barrow-field along Aren Way (TILEX), and five backdrops (SCENEX), drawn the way
   47b-53b draw: lantern low on the left, dust over everything. Aren is pale stone after six chapters of mud-brick, and its light is a
   sea light. The worst of this chapter happens far off and small: the Barrow is a knot under a cloud of crows, the road is a line of
   uprights against the dawn. Nothing is shown close; the distance does the work. Helpers here are prefixed b7. */

/* ---------------- figures: FIGX[kind](ctx, h, t, o), the same ~32px frame as 47b ---------------- */
/* the Aren Guard's colours: a slate-blue surcoat over mail, edged in sand, a conical helm with a cloth tail against the sun */
const b7Mail = (ctx, x0, x1, y0, y1, c) => { ctx.fillStyle = c; for (let y=y0; y<y1; y+=1.2) for (let x=x0 + ((y - y0)/1.2 % 2)*.6; x<x1; x+=1.2) ctx.fillRect(x, y, .6, .5); }; // rings, just
const b7Helm = (ctx, h, c, cl) => { ctx.fillStyle = h.armor(c, shade(c, -.6)); ctx.beginPath(); ctx.moveTo(-5.2, -12.2); ctx.quadraticCurveTo(-4.4, -17, 0, -18.6); ctx.quadraticCurveTo(4.4, -17, 5.2, -12.2); ctx.closePath(); ctx.fill(); ctx.fillRect(-5.6, -12.8, 11.2, 1.3); // a conical iron helm
  ctx.fillStyle = 'rgba(255,250,236,.32)'; ctx.fillRect(-3.4, -16.4, .8, 3.6); ctx.fillStyle = shade(c, -.5); ctx.fillRect(2.6, -12.2, 1, 3.6); // its shine, the nasal
  if (cl) poly(ctx, [[-5.6,-12.4],[-3.2,-12.4],[-3.8,-5.4],[-7,-6.6]], cl); }; // a cloth hung from it, behind
Object.assign(FIGX, {
  /* a man of the Aren Guard: a garrison soldier who has watched the Chain come for months from his wall; slate-blue over mail, a spear, a round shield */
  aren_guard(ctx, h, t, o){ const sk = b2Pick(o, ['#a8826a', '#94704e', '#b08c70', '#8a6448']), sur = b2Pick(o, [['#3e4c5e','#141a24'], ['#36445a','#10161e'], ['#44505e','#161c24']]);
    B2F.line(ctx, '#5a4430', 1.3, [[8.4, 12.8], [8.8, -22]], 'butt'); poly(ctx, [[8.9,-27],[7.8,-21.6],[9.9,-21.6]], '#cfc8b8'); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(8.6, -26, .4, 3.6); // a spear
    h.legs('#2a2a2e'); ctx.fillStyle = '#3a2e22'; ctx.fillRect(-4.6, 9.6, 3.6, 3.4); ctx.fillRect(1, 9.6, 3.6, 3.4); // boots
    poly(ctx, [[-6.4,-6],[6.4,-6],[7,7.4],[-7,7.4]], h.armor('#8a8a88', '#2e2e30')); b7Mail(ctx, -6.2, 6.4, -5.6, 7.2, 'rgba(20,20,24,.45)'); // the hauberk to the thigh
    poly(ctx, [[-4.8,-6],[4.8,-6],[5.4,8.6],[-5.4,8.6]], h.armor(sur[0], sur[1])); ctx.fillStyle = '#c8b890'; ctx.fillRect(-5.4, 7.8, 10.8, .8); ctx.fillRect(-.4, -6, .8, 14.6); // the surcoat, sand-edged, split
    ctx.fillStyle = '#2a1e14'; ctx.fillRect(-6, 2.6, 12, 1.3); ctx.fillStyle = '#a89060'; ctx.fillRect(-.8, 2.6, 1.6, 1.3); // belt
    h.shield('#4e5c6e', '#141a22', 5.6, -7.4, .6); ctx.strokeStyle = '#c8b890'; ctx.lineWidth = .7; ctx.beginPath(); ctx.arc(-7.4, .6, 3.6, 0, 7); ctx.stroke(); // a round shield, a sand ring painted on it
    ell(ctx, 8.4, 1.4, 1.2, 1.2, sk); B2F.line(ctx, sur[0], 2, [[5.4, -4.6], [8.2, 1]]);
    h.head(sk, 4.4, -11.2); h.look(); ctx.fillStyle = 'rgba(40,28,20,.35)'; ctx.fillRect(-2.6, -8.6, 6.6, 1.6); // a day's stubble
    b7Helm(ctx, h, '#6a6a6c', '#d8ccb0'); },

  /* Commander Blistig of the Aren Guard: big, heavy in the jaw, a soldier who has seen what happens to commanders who are right;
     the Guard's slate-blue with an officer's dark cloak, a broad belt, helm off, cropped hair going grey, and a mouth that says no */
  blistig(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.1, 1.06); const sk = '#a07c62';
    poly(ctx, [[-6.6,-6.6],[6,-6.6],[7.4,12.4],[-8.6,12.6]], h.armor('#2a2a30', '#0c0c10')); // the cloak behind him, to the boots
    h.legs('#26262a'); ctx.fillStyle = '#2e241a'; ctx.fillRect(-4.6, 8.8, 3.6, 4.2); ctx.fillRect(1, 8.8, 3.6, 4.2); ctx.fillStyle = 'rgba(255,236,200,.18)'; ctx.fillRect(-4.6, 8.8, 1, 4.2);
    poly(ctx, [[-6.8,-6.2],[6.8,-6.2],[7.2,7.6],[-7.2,7.6]], h.armor('#8c8c8a', '#2a2a2c')); b7Mail(ctx, -6.6, 6.8, -5.8, 7.4, 'rgba(20,20,24,.42)');
    poly(ctx, [[-5.2,-6.2],[5.2,-6.2],[5.8,8.6],[-5.8,8.6]], h.armor('#3a4a5e', '#0e141c')); ctx.fillStyle = '#c8b890'; ctx.fillRect(-5.8, 7.8, 11.6, .8); ctx.fillRect(-.4, -6.2, .8, 14.6);
    ctx.fillStyle = '#c9a44a'; poly(ctx, [[-5.2,-6.2],[-2.2,-6.2],[-3,-3.4],[-5.6,-3.6]], '#c9a44a'); ctx.fillStyle = 'rgba(80,60,20,.6)'; ctx.fillRect(-4.6, -5.2, 1.8, .4); // a commander's gilt at the shoulder, worn dull
    ctx.fillStyle = '#20160e'; ctx.fillRect(-7, 2.2, 14, 2); ctx.fillStyle = '#b89a58'; ell(ctx, 0, 3.2, 1.3, 1, '#b89a58'); // a broad belt, a plain boss
    ctx.fillStyle = '#1e1610'; ctx.fillRect(-8.4, 2.6, 1.8, 8); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(-8.8, 2, 2.6, 1); // a sword sheathed at the hip
    B2F.line(ctx, '#3a4a5e', 2.4, [[-5.4, -4.4], [-2, 1], [4.4, -.2]]); B2F.line(ctx, '#34445a', 2.4, [[5.6, -4.4], [6.8, 0], [-1.6, .4]]); ell(ctx, 4.8, -.4, 1.4, 1.2, sk); ell(ctx, -2, .6, 1.4, 1.2, shade(sk, -.15)); // arms folded
    h.head(sk, 4.8, -11.2); ctx.fillStyle = shade(sk, -.18); poly(ctx, [[-3.8,-9],[4.8,-9],[4.4,-6.4],[1.6,-5.4],[-2.4,-6]], ctx.fillStyle); // a heavy jaw
    ctx.fillStyle = 'rgba(60,48,40,.5)'; ctx.fillRect(-3, -8.2, 7.4, 2.4); // stubble
    ctx.fillStyle = 'rgba(24,14,10,.88)'; ctx.fillRect(-.6, -11.6, 1.3, .9); ctx.fillRect(2.4, -11.6, 1.3, .9); ctx.fillStyle = '#4a3a2e'; ctx.fillRect(-1.2, -12.8, 2.4, .7); ctx.fillRect(1.8, -12.6, 2.4, .7); // eyes under a low brow
    ctx.fillStyle = '#4a2a20'; ctx.fillRect(.6, -7.6, 3, .6); ctx.fillRect(.4, -7.4, .5, .9); ctx.fillRect(3.4, -7.4, .5, .9); // the mouth turned down at both ends
    ctx.fillStyle = '#4a4440'; ctx.beginPath(); ctx.arc(0, -12.6, 5, Math.PI*1.04, Math.PI*1.96); ctx.fill(); ctx.fillRect(-5, -13, 1.6, 3); ctx.fillStyle = 'rgba(200,196,186,.5)'; ctx.fillRect(-4.6, -13.6, 1.4, 3.4); ctx.fillRect(-1, -16.6, 3, .6); // cropped hair, grey at the side
    ctx.restore(); },

  /* Captain Keneb: lean and tired, come out of the Imperial Warren with dust of the wrong world still on him; a plain captain of the
     Fourth in rust leather and a grey travelling cloak, no helm, brown hair, hollow in the cheek; a hand on his sword and his eyes on Rel */
  keneb(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .96, 1.04); const sk = '#b08c70', sw = o.still ? 0 : Math.sin(t/700 + (o.phase||0));
    poly(ctx, [[-6.2,-6.4],[5.4,-6.4],[6.4,11.6 + sw*.3],[-8.4 - sw*.4,12]], h.armor('#5e5a52', '#1e1c1a')); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-8, 10.6, 14, 1.4); // the cloak, travel-worn, frayed at the hem
    h.legs('#2e2a24'); ctx.fillStyle = '#3a2e22'; ctx.fillRect(-4.6, 9.2, 3.6, 3.8); ctx.fillRect(1, 9.2, 3.6, 3.8);
    h.torso('#7a4a2e', '#2a160c', 6); ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i=0;i<4;i++) ctx.fillRect(-5.2, -3.6 + i*2.4, 10.4, .4); // rust leather, quilted
    ctx.fillStyle = '#c9a44a'; ctx.fillRect(3, -5.6, 2, 1.2); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(3.4, -5.2, 1.2, .4); // a captain's pin, small
    ctx.fillStyle = '#2a1c12'; ctx.fillRect(-6, 3, 12, 1.2); B2F.line(ctx, '#2a1c12', 1, [[-5.4, -6], [5, 3]]); // belt, baldric
    ctx.fillStyle = '#1e1610'; ctx.fillRect(5.4, 2.4, 1.6, 8.6); ctx.fillStyle = '#8a7a5a'; ctx.fillRect(4.8, 1.6, 2.8, .9); B2F.line(ctx, '#7a4a2e', 2, [[5, -4.6], [6.6, .8]]); ell(ctx, 6.4, 1.4, 1.2, 1.2, sk); // his hand on the hilt
    ctx.fillStyle = 'rgba(160,150,190,.22)'; ctx.fillRect(-6, 5.6, 4, .8); ctx.fillRect(1.4, -2, 3, .6); // a grey dust that is not this world's, still on him
    h.head(sk, 4.2, -11.2); ctx.fillStyle = 'rgba(80,50,36,.35)'; ctx.fillRect(-2.4, -9.6, 1.2, 2.6); ctx.fillRect(2.8, -9.6, 1.2, 2.6); // hollow cheeks
    ctx.fillStyle = 'rgba(80,56,40,.4)'; ctx.fillRect(-1, -10.6, 1.6, .5); ctx.fillRect(2, -10.6, 1.6, .5); h.look('rgba(24,14,10,.85)', -11.8); // tired under the eyes
    ctx.fillStyle = '#4a3420'; ctx.fillRect(.8, -8.2, 2.4, .5); // a straight mouth
    ctx.fillStyle = '#5a3e26'; ctx.beginPath(); ctx.arc(0, -12.6, 4.6, Math.PI*1.02, Math.PI*1.98); ctx.fill(); ctx.fillRect(-4.6, -13, 1.8, 4); poly(ctx, [[-1.6,-16.6],[3.4,-16.2],[4.4,-13.6],[1,-15]], '#5a3e26'); // brown hair, needing cutting
    ctx.restore(); },

  /* Squint: an old Aren Guard bowman, the best shot on the wall; bent at the neck, white stubble, one eye screwed nearly shut from
     fifty years of sighting; a leather cap, a long yew bow taller than he is, grey-fletched arrows at his hip */
  squint(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .94, .96); const sk = '#a07a5e';
    ctx.strokeStyle = '#7a5430'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(9.2, -22); ctx.quadraticCurveTo(13.8, -5, 9.2, 12); ctx.stroke(); ctx.strokeStyle = 'rgba(255,220,170,.35)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(9.6, -20); ctx.quadraticCurveTo(13.4, -5, 9.8, 10); ctx.stroke(); // the long yew bow
    ctx.strokeStyle = 'rgba(220,210,190,.7)'; ctx.lineWidth = .45; ctx.beginPath(); ctx.moveTo(9.2, -22); ctx.lineTo(9.2, 12); ctx.stroke(); ctx.fillStyle = '#c8b088'; ctx.fillRect(11.6, -6, 1.4, 2.4); // the string, the grip
    h.legs('#2a2a2e'); ctx.fillStyle = '#3a2e22'; ctx.fillRect(-4.6, 9.4, 3.6, 3.6); ctx.fillRect(1, 9.4, 3.6, 3.6);
    ctx.save(); ctx.translate(0, -5); ctx.rotate(.1); ctx.translate(0, 5); // stooped at the shoulders
    poly(ctx, [[-6,-6],[6,-6],[6.6,7.6],[-6.6,7.6]], h.armor('#4e5866', '#1a1e26')); ctx.fillStyle = 'rgba(200,190,160,.28)'; ctx.fillRect(-6, -2, 12, 4); // a surcoat faded nearly grey
    ctx.fillStyle = '#c8b890'; ctx.fillRect(-6.6, 6.8, 13.2, .7); ctx.fillStyle = '#2a1e14'; ctx.fillRect(-6, 2.4, 12, 1.2);
    ctx.fillStyle = '#4a3220'; ctx.fillRect(-8.4, 1, 2.6, 8); ctx.fillStyle = '#9a9a9e'; for (let i=0;i<4;i++){ ctx.fillRect(-8.2 + i*.6, -.8 + (i%2)*.4, .5, 2.2); } // a quiver at the hip, grey fletching
    ctx.fillStyle = '#e8e0cc'; ctx.fillRect(4, -.6, 3, .8); ctx.fillRect(4.4, .8, 2.6, .8); // a bracer, pale with age
    B2F.line(ctx, '#4e5866', 2, [[5, -4.6], [9.6, -5.2]]); ell(ctx, 10.6, -5.2, 1.2, 1.2, sk); // the bow hand
    h.head(sk, 4.2, -11.2); ctx.fillStyle = 'rgba(70,40,30,.42)'; ctx.lineWidth = .4; ctx.strokeStyle = 'rgba(70,40,30,.42)'; ctx.beginPath(); ctx.moveTo(-1.6, -14.2); ctx.lineTo(2.8, -14.4); ctx.moveTo(3.6, -10.4); ctx.lineTo(4.2, -9.6); ctx.stroke(); // lines
    ctx.fillStyle = 'rgba(24,14,10,.85)'; ctx.fillRect(-.8, -11.4, 1.2, 1); ctx.fillRect(1.8, -11.2, 1.8, .4); ctx.fillStyle = 'rgba(70,40,30,.5)'; ctx.fillRect(1.4, -12, 2.6, .5); ctx.fillRect(1.6, -10.6, 2.2, .4); // one eye open, one screwed shut
    ctx.fillStyle = 'rgba(226,222,212,.75)'; ctx.fillRect(-2.6, -8.8, 6.6, 2); ctx.fillStyle = '#5a3a2a'; ctx.fillRect(.6, -8.6, 2.4, .5); // white stubble
    ctx.fillStyle = '#5a4430'; ctx.beginPath(); ctx.arc(0, -12.8, 4.7, Math.PI, 0); ctx.fill(); ctx.fillRect(-5, -13, 10, 1.1); ctx.fillStyle = 'rgba(255,230,190,.2)'; ctx.fillRect(-3.4, -16, 2.4, .6); // a leather cap
    ctx.fillStyle = '#d8d4c8'; ctx.fillRect(-4.6, -12, 1.2, 2.6); // white hair under it
    ctx.restore(); ctx.restore(); },

  /* High Fist Pormqual: soft, gilded, certain; a cuirass of gilt scale that has never been struck, a purple cloak, a white plume,
     a round smooth face and rings on every finger; the jewelled sword held down, for show */
  pormqual(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.12, 1.02); const sk = '#d0a888', sw = o.still ? 0 : Math.sin(t/650 + (o.phase||0));
    poly(ctx, [[-6.4,-6.6],[6,-6.6],[7.8,12.4],[-8.8,12.6]], h.armor('#5a2a6a', '#1a0a22')); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-8.8, 11.6, 16.6, .9); // a purple cloak, gold at the hem
    h.legs('#3a2a3a'); ctx.fillStyle = '#5a3a24'; ctx.fillRect(-4.6, 8.6, 3.6, 4.4); ctx.fillRect(1, 8.6, 3.6, 4.4); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-4.6, 8.6, 3.6, .6); ctx.fillRect(1, 8.6, 3.6, .6); // fine boots
    poly(ctx, [[-6.4,-6.2],[6.4,-6.2],[7.6,7.8],[-7.6,7.8]], h.armor('#e8c870', '#6a4a14')); ell(ctx, 1, 2.8, 6.6, 4.2, h.armor('#e8c870', '#7a5418')); // gilt, and a belly under it
    b2Scales(ctx, -6, 6.6, -5.6, 8, 1.7, '#f0d488', '#8a6420'); ctx.fillStyle = 'rgba(255,250,220,.35)'; ctx.fillRect(-5.8, -5.6, 1.4, 11); // polished, every scale of it
    ctx.fillStyle = '#5a2a6a'; ctx.fillRect(-7.6, 3.2, 15.2, 2); ctx.fillStyle = '#e8c870'; ctx.fillRect(-7.6, 3.2, 15.2, .5); ell(ctx, 0, 4.2, 1.6, 1.3, '#4a8ad6'); // a silk sash, a sapphire
    poly(ctx, [[-7.6,-7.4],[-2.6,-7.4],[-3.4,-3.6],[-8.4,-3.2]], h.armor('#f0d488', '#7a5418')); poly(ctx, [[2.6,-7.4],[7.6,-7.4],[8.4,-3.2],[3.4,-3.6]], h.armor('#e8c870', '#6a4a14')); // pauldrons, chased
    ctx.strokeStyle = '#e8e0d8'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(7.6, 4); ctx.lineTo(9.6, 12); ctx.stroke(); ctx.fillStyle = '#c9a44a'; ctx.fillRect(5.6, 2.8, 4.2, 1.1); ell(ctx, 7.6, 1.8, .9, .9, '#c8302a'); B2F.line(ctx, '#5a2a6a', 2.2, [[5.6, -4.6], [7.4, 1.6]]); ell(ctx, 7.6, 2.6, 1.4, 1.3, sk); ctx.fillStyle = '#e8c870'; ctx.fillRect(7, 2.2, 1.4, .5); // the jewelled sword, held down, a ring on the hand
    h.head(sk, 4.9, -11.2); ell(ctx, 1.2, -7.4, 4, 1.8, shade(sk, -.06)); ell(ctx, -2.4, -9.6, 1.2, .9, 'rgba(220,120,110,.35)'); // a round smooth face, a soft chin under the chin, a flush
    ctx.fillStyle = 'rgba(24,14,10,.85)'; ctx.fillRect(-.6, -11.4, 1.2, .8); ctx.fillRect(2.4, -11.4, 1.2, .8); ctx.fillStyle = '#5a3a2a'; ctx.fillRect(-1, -12.6, 2, .5); ctx.fillRect(2.2, -12.8, 2, .5); // eyebrows up: he is pleased with himself
    ctx.fillStyle = '#8a4a3a'; ctx.fillRect(.6, -8.6, 2.6, .6); ctx.fillRect(3, -9, .6, .5); // a small smile
    ctx.fillStyle = h.armor('#d8b04a', '#5a3a0c'); ctx.beginPath(); ctx.arc(0, -12.4, 5.3, Math.PI, 0); ctx.fill(); ctx.fillRect(-5.8, -12.8, 11.6, 1.4); ctx.fillStyle = '#5a2a6a'; ctx.fillRect(-5.8, -11.6, 11.6, .5); ctx.fillStyle = 'rgba(255,250,220,.5)'; ctx.fillRect(-3.6, -16.4, 2.4, .8); ell(ctx, 0, -17.6, 1.2, .9, '#c9a44a'); // a gilt helm, open, polished
    for (let i=0;i<6;i++){ const k = i/5; B2F.line(ctx, i%2 ? '#f4f0e8' : '#dcd6cc', 1.1, [[0, -18], [-2 - k*2 + sw*.4, -22 + k*1.4], [-5.6 - k*2.6 + sw*1.1, -20 + k*3.6]]); } // a white plume, nodding
    ctx.restore(); },

  /* Kamist Reloe, High Mage of the Whirlwind: heavy, old, bald, a grey beard, robes of dun with the rising's green worked through them,
     a staff of bone and copper; one hand up and smoking with a sickly warren-light — the hand that burns the crows */
  reloe(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.06, 1.04); const sk = '#9a7656', p = o.still ? .6 : (Math.sin(t/260) + 1)/2;
    B2F.line(ctx, '#d8ccb0', 1.3, [[8.6, 12.6], [8.6, -16]], 'butt'); ctx.fillStyle = '#b87a3a'; for (let i=0;i<3;i++) ctx.fillRect(7.8, -14 + i*4, 1.6, .8); ell(ctx, 8.6, -17.4, 1.8, 1.6, '#d8ccb0'); ell(ctx, 8.2, -17.8, .5, .5, '#1a120c'); ell(ctx, 9.2, -17.8, .5, .5, '#1a120c'); // a staff of bone, a skull on it, copper bands
    B2F.robe(ctx, h, '#7a6a4a', '#241c10', 6.6, 8.8); ctx.fillStyle = '#3e6a34'; ctx.fillRect(-8.6, 9.6, 17.2, 1.4); ctx.fillRect(-.7, -6, 1.4, 16); ctx.fillStyle = 'rgba(160,220,140,.2)'; ctx.fillRect(-.7, -6, .5, 16); // robes, the rising's green down the front and at the hem
    ctx.fillStyle = '#3a2a18'; ctx.fillRect(-6.6, 1.6, 13.2, 1.6); ctx.fillStyle = '#d8ccb0'; [[-4, 3.2], [-1.6, 3.4], [2.6, 3.2]].forEach(([x, y]) => { ctx.fillRect(x, y, .8, 2.4); }); // a belt hung with finger-bones
    B2F.line(ctx, '#7a6a4a', 2.2, [[5.6, -4.4], [8, -.4]]); ell(ctx, 8.4, 0, 1.3, 1.3, sk); // the hand on the staff
    B2F.line(ctx, '#6a5a3e', 2.2, [[-5.4, -4.6], [-8.4, -9.4], [-8.6, -13.6]]); ell(ctx, -8.6, -14.4, 1.5, 1.4, sk); // the other hand up
    ctx.globalCompositeOperation = 'lighter'; glow(ctx, -8.6, -15.4, 6 + p*2, '#9ac85a', .3 + p*.2); ctx.globalCompositeOperation = 'source-over'; for (let i=0;i<3;i++){ const k = ((t/900 + i/3) % 1); ell(ctx, -8.6 + Math.sin(t/300 + i*2)*1.2, -16 - k*6, .8 + k*1.6, .6 + k*1.2, `rgba(40,50,30,${(.5*(1 - k)).toFixed(2)})`); } // a sickly fire on it, and its smoke
    h.head(sk, 4.8, -11.2); ctx.fillStyle = 'rgba(255,236,200,.22)'; ell(ctx, -1.6, -14, 2.2, 1.4, ctx.fillStyle); // bald, the dome shining
    ctx.fillStyle = 'rgba(70,46,30,.3)'; ctx.fillRect(-1, -13.4, 4.4, .35); // a furrowed brow
    ctx.fillStyle = 'rgba(160,210,110,.9)'; ctx.fillRect(-.6, -11.6, 1.2, .9); ctx.fillRect(2.4, -11.6, 1.2, .9); // eyes with the warren in them
    poly(ctx, [[-3.6,-9.6],[4.8,-9.6],[4.4,-5.6],[2,-1.8],[-.6,-2.6],[-3,-6]], '#a8a49a'); ctx.strokeStyle = 'rgba(80,76,70,.6)'; ctx.lineWidth = .4; ctx.beginPath(); for (let i=0;i<3;i++){ ctx.moveTo(-1.8 + i*1.8, -9); ctx.lineTo(-.6 + i*1.2, -3); } ctx.stroke(); // a grey beard
    ctx.fillStyle = '#7a7670'; ctx.fillRect(-4.8, -12.6, 1.6, 3); // grey at the temple
    ctx.fillStyle = '#c08a48'; ctx.fillRect(4.2, -10.8, .9, 1.4); // copper in the ear
    ctx.restore(); },

  /* Temul: a Wickan lancer of the Crow, hardly more than a boy and already a warleader's age in the eyes; horsehide and leather,
     braids, a lance taller than him with crow feathers bound under its blade */
  temul(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .9, .92); const sk = '#8a6448', sw = o.still ? 0 : Math.sin(t/480 + (o.phase||0));
    B2F.line(ctx, '#4a3420', 1.2, [[8.6, 13], [9.8, -26]], 'butt'); poly(ctx, [[9.9,-31.6],[9.1,-25.6],[10.8,-25.6]], '#d0c8b4'); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(9.7, -30.6, .35, 4.2); // a lance
    for (let k=0;k<3;k++) B2F.line(ctx, '#0a0808', 1, [[9.8, -25 + k*.8], [11.4 + k*.6 + sw*.6, -22.6 + k], [11.8 + k*.8 + sw*1.2, -19.6 + k*1.2]]); ctx.fillStyle = '#b87a3a'; ctx.fillRect(9.2, -25.4, 1.4, .8); // crow feathers bound under it
    h.legs('#2e2418'); ctx.fillStyle = '#4a3a26'; ctx.fillRect(-4.5, 9, 3.4, 4); ctx.fillRect(1.1, 9, 3.4, 4); ctx.fillStyle = 'rgba(214,190,140,.5)'; for (let i=0;i<3;i++){ ctx.fillRect(-4.4 + i*1.1, 12.4, .4, 1.1); ctx.fillRect(1.2 + i*1.1, 12.4, .4, 1.1); }
    h.torso('#6a4e34', '#22160c', 5.8); ctx.fillStyle = 'rgba(230,220,200,.2)'; [[-3,-2.6],[2.4,0],[-1.4,3.2]].forEach(([x, y]) => ell(ctx, x, y, 1.2, .8, ctx.fillStyle)); // a horsehide coat, a little pied
    ctx.fillStyle = 'rgba(200,180,140,.5)'; for (let i=0;i<6;i++) ctx.fillRect(-4.8 + i*1.9, 6, .5, 1.8);
    ctx.fillStyle = '#2a1a0e'; ctx.fillRect(-5.6, 2.8, 11.2, 1.1); ctx.fillStyle = '#2a2018'; ctx.fillRect(-7.4, -1, 1.6, 6); ctx.fillStyle = '#b8b0a0'; ctx.fillRect(-7.2, 4.6, 1.2, 2.2); // the long knife
    B2F.line(ctx, '#6a4e34', 1.9, [[5, -4.4], [8.6, -1.6]]); ell(ctx, 8.8, -1.4, 1.1, 1.1, sk);
    h.head(sk, 4.2, -11.4); h.look('rgba(20,12,8,.9)', -11.8); ctx.fillStyle = '#3a2418'; ctx.fillRect(.6, -8.4, 2.4, .5); // set mouth
    ctx.fillStyle = 'rgba(30,20,20,.55)'; ctx.fillRect(-1.2, -10.2, 5, .5); // a smear of ash under the eyes, for the dead
    B2F.cap(ctx, '#0e0a08', 4.5, -12.8); B2F.braids(ctx, '#120e0c', 10, -12.6); ctx.fillStyle = '#b87a3a'; ctx.fillRect(-5.5, -3.4, 1.6, .8); ctx.fillRect(3.9, -3.4, 1.6, .8); // braids, copper-tied
    B2F.line(ctx, '#0a0808', .9, [[-3.6, -15.6], [-5.4, -18.6], [-7, -19.4]]); // a crow's feather in his hair
    ctx.restore(); },

  /* Bent: Coltaine's cattle-dog, a big heavy Wickan dog, brindled near black, scarred across the muzzle and flank, ears cut short in
     some old fight, head low and tail low — nothing like Hackle's rope-coloured coat and ears-up eagerness; he looks at you and waits */
  bent(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.22, 1.14); const g = o.still ? 0 : Math.sin(t/260 + (o.phase||0)*2)*.5, br = o.still ? 0 : Math.sin(t/900 + (o.phase||0))*.3;
    const coat = '#3a3430', dk = '#1a1614', lt = '#6a625a', scar = 'rgba(214,200,180,.6)';
    ctx.fillStyle = dk; ctx.fillRect(-7 + g, 5.4, 2.2, 7.4); ctx.fillRect(4.6 - g, 5.4, 2.2, 7.4); // the far legs, heavy
    B2F.line(ctx, coat, 2.4, [[-9, 2.6], [-11.4, 6], [-11.6, 9.4]]); // the tail, carried low
    ell(ctx, -1.2, 3.6, 9.2, 4.2 + br, h.armor(lt, dk)); // the barrel, deep-chested
    ctx.strokeStyle = 'rgba(12,10,8,.4)'; ctx.lineWidth = .6; for (let i=0;i<14;i++){ const bx = -8.6 + hash(i, 5)*15, by = .4 + hash(i, 6)*5.4, l = .8 + hash(i, 7)*1.6; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + .5, by + l); ctx.stroke(); } ell(ctx, -2, 1.2, 6, 1.4, 'rgba(10,8,6,.3)'); // brindled, darkest along the back
    ctx.strokeStyle = scar; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(-5.4, 2.2); ctx.quadraticCurveTo(-3.6, 2.6, -1.8, 4.6); ctx.stroke(); // an old scar, the hair grown back white
    poly(ctx, [[3.4,.4],[7.6,-2.6],[11,-.6],[9.6,6.4],[4.6,7.4]], h.armor(lt, coat)); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(5, 4.4, 4, 1); // the thick neck, low
    ctx.fillStyle = coat; ctx.fillRect(-5.6 - g, 5.6, 2.6, 7.2); ctx.fillRect(6 + g, 5.6, 2.6, 7.2); ctx.fillStyle = dk; ctx.fillRect(-5.6 - g, 12, 2.6, 1); ctx.fillRect(6 + g, 12, 2.6, 1); ctx.fillStyle = '#8a8076'; ctx.fillRect(6.2 + g, 11.4, 1, .6); // the near legs, a pale toe
    ell(ctx, 10.4, -.6, 3.6, 3.1, coat); poly(ctx, [[12,-2.2],[16.2,-.8],[16,1.6],[12,2]], coat); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(12.2, 1.2, 3.8, .6); ell(ctx, 16, -.2, 1, .8, '#0a0806'); // a broad head, held level with his back; a heavy muzzle
    ctx.fillStyle = '#7a7068'; ctx.fillRect(13.6, -1.4, 2.4, .9); // grey on the muzzle
    ctx.strokeStyle = scar; ctx.lineWidth = .55; ctx.beginPath(); ctx.moveTo(11.4, -3.4); ctx.lineTo(14.6, .6); ctx.stroke(); // a scar across it, nose to eye
    poly(ctx, [[8.4,-2.8],[8.6,-5.2],[10.4,-3.4]], dk); poly(ctx, [[10.2,-3.2],[11,-5.6],[12.2,-3.2]], coat); // ears cut short
    ctx.fillStyle = '#0e0806'; ctx.fillRect(12.4, -1.8, 1.2, .9); ctx.fillStyle = 'rgba(255,220,170,.5)'; ctx.fillRect(12.7, -1.7, .4, .4); // an eye that has seen it all
    ctx.fillStyle = '#5a3a2a'; ctx.fillRect(4.4, -1.6, 4.6, 1); ctx.fillStyle = '#b89a58'; ctx.fillRect(6.2, -1.6, 1, 1); // an old collar, a brass stud
    ctx.restore(); },
});
/* ---------------- ground: Aren — pale stone streets and the great walls ---------------- */
/* After the Odhan, a city of dressed limestone: flags laid in a running bond, dust blown in off the Way, the walls broad enough to
   walk four abreast with merlons along every open edge and their faces in big ashlar courses. Light low from the upper left,
   so every wall throws its shade down and to the right. By night the stone goes blue and the street lamps are few.
   '.' paving  ',' dust  '#' wall (blocks)  't' tower (blocks)  's' stair  'g' gate  '=' awning  'w' well  (+ battle 't' 'o') */
const b7AW = c => c === '#' || c === 't';
const b7AP = N => N ? {pave:'#25272e', paveL:'#3a3e48', paveD:'#14161c', joint:'rgba(0,0,0,.45)', dust:'14,14,18', top:'#3c404c', topL:'#555a68', face:'#1c1e26', faceL:'#2a2e38', merl:'#3a3e4a', sh:'0,0,8', lit:'150,165,210', wood:'#2a2018', woodL:'#3e3024', iron:'#4a4c56', day:0}
                     : {pave:'#968666', paveL:'#c8b896', paveD:'#7a6a50', joint:'rgba(60,44,28,.42)', dust:'200,178,136', top:'#d6c8a4', topL:'#efe4c6', face:'#8a7a5e', faceL:'#a89878', merl:'#c4b494', sh:'40,26,30', lit:'255,236,200', wood:'#5a3e24', woodL:'#7a5a36', iron:'#3a3a3e', day:1};
/* the flags, laid in world space so the courses run on from tile to tile */
function b7Flags(ctx, x, y, T, P, bw = .75, bh = .5){ const px = x*T, py = y*T, r0 = Math.floor(y/bh) - 1, r1 = Math.ceil((y + 1)/bh);
  for (let r=r0; r<=r1; r++){ const yy = r*bh*T, off = (((r % 2) + 2) % 2)*bw*.5, c0 = Math.floor(x/bw - off/bw) - 1, c1 = Math.ceil((x + 1)/bw);
    for (let c=c0; c<=c1; c++){ const xx = (c*bw + off)*T, k = hash(c, r, 7); if (xx > px + T || xx + bw*T < px || yy > py + T || yy + bh*T < py) continue;
      ctx.fillStyle = shade(P.pave, (k - .5)*.12); ctx.fillRect(xx, yy, bw*T, bh*T);
      ctx.fillStyle = P.day ? 'rgba(255,244,220,.16)' : 'rgba(150,165,210,.06)'; ctx.fillRect(xx, yy, bw*T, Math.max(1, T*.03)); ctx.fillRect(xx, yy, Math.max(1, T*.03), bh*T); // the worn edge, lit
      ctx.fillStyle = P.joint; ctx.fillRect(xx, yy + bh*T - Math.max(1, T*.025), bw*T, Math.max(1, T*.025)); ctx.fillRect(xx + bw*T - Math.max(1, T*.025), yy, Math.max(1, T*.025), bh*T); // joints
      if (k > .82) { ctx.strokeStyle = P.joint; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xx + bw*T*hash(c, r, 8), yy); ctx.lineTo(xx + bw*T*hash(c, r, 9), yy + bh*T*.6); ctx.lineTo(xx + bw*T*hash(c, r, 10), yy + bh*T); ctx.stroke(); } // a crack
      if (k < .12) b2Soft(ctx, xx + bw*T*.5, yy + bh*T*.5, T*.2, .5, '0,0,0', .12); } } } // a dip worn by feet
function b7Aren(ctx, ch, x, y, T, N){
  const px = x*T, py = y*T, h = hash(x, y), P = b7AP(N), W = (dx, dy) => b7AW(b2Tile(x + dx, y + dy));
  const shadeIn = () => { // walls throw their shade down and right onto the street
    if (W(0, -1)) { const g = ctx.createLinearGradient(0, py, 0, py + T*.55); g.addColorStop(0, `rgba(${P.sh},${N ? .55 : .45})`); g.addColorStop(1, `rgba(${P.sh},0)`); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); }
    if (W(-1, 0)) { const g = ctx.createLinearGradient(px, 0, px + T*.4, 0); g.addColorStop(0, `rgba(${P.sh},${N ? .45 : .34})`); g.addColorStop(1, `rgba(${P.sh},0)`); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); }
    if (!W(0, -1) && !W(-1, 0) && W(-1, -1)) b2Soft(ctx, px, py, T*.45, 1, P.sh, N ? .4 : .3); };
  const street = () => { b7Flags(ctx, x, y, T, P); b2Mottle(ctx, x, y, T, N ? .02 : .06, N ? .2 : .12, P.lit, 1.4);
    for (let i=0;i<4;i++){ ctx.fillStyle = N ? 'rgba(10,12,18,.5)' : 'rgba(90,70,50,.4)'; ctx.fillRect(px + hash(x, y, i + 20)*T, py + hash(y, x, i + 21)*T, Math.max(1, T*.04), Math.max(1, T*.03)); } }; // grit
  const dust = () => { street(); for (let i=0;i<3;i++) b2Soft(ctx, px + T*(.15 + hash(x, y, i + 30)*.7), py + T*(.2 + hash(y, x, i + 31)*.6), T*(.26 + hash(x, y, i + 32)*.2), .55, P.dust, N ? .22 : .55); // sand blown in off the Way
    ctx.strokeStyle = N ? 'rgba(120,120,110,.3)' : 'rgba(214,180,100,.75)'; ctx.lineWidth = Math.max(1, T*.015); for (let i=0;i<5;i++){ const sx = px + hash(x, y, i + 40)*T, sy = py + hash(y, x, i + 41)*T, a = hash(x, y, i + 42)*3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a)*T*.12, sy + Math.sin(a)*T*.05); ctx.stroke(); } // straw from the carts
    if (h > .7) { ell(ctx, px + T*.7, py + T*.7, T*.05, T*.03, N ? '#1a1a20' : '#6a5a44'); ell(ctx, px + T*.3, py + T*.4, T*.04, T*.025, N ? '#1a1a20' : '#7a6a50'); } };
  const parapet = (open) => { const m = T*.16, [u, r, d, l] = open; // merlons along every edge that looks out over open ground
    const run = (horiz, x0, y0, len, lit) => { const n = 4, step = len/n; for (let i=0;i<n;i++){ const mx = horiz ? x0 + i*step : x0, my = horiz ? y0 : y0 + i*step, w = horiz ? step*.62 : m, hh = horiz ? m : step*.62;
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(mx + T*.03, my + T*.03, w, hh); ctx.fillStyle = P.merl; ctx.fillRect(mx, my, w, hh); ctx.fillStyle = lit ? (N ? 'rgba(150,165,210,.14)' : 'rgba(255,248,226,.45)') : 'rgba(0,0,0,.2)'; ctx.fillRect(mx, my, w, Math.max(1, T*.03)); }
      ctx.fillStyle = P.merl; horiz ? ctx.fillRect(x0, y0 + m*.62, len, m*.38) : ctx.fillRect(x0 + m*.62*(x0 > px + T*.5 ? 0 : 1), y0, m*.38, len); }; // the low wall the merlons stand on
    if (u) run(true, px, py, T, true); if (l) run(false, px, py, T, true); if (r) run(false, px + T - m, py, T, false); if (d) run(true, px, py + T*.48, T, false); };
  const face = (fy) => { // the outer face where the wall stands over the street: big ashlar courses, an arrow slit, lichen at the foot
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(px, fy - T*.03, T, T*.04);
    const g = ctx.createLinearGradient(0, fy, 0, py + T); g.addColorStop(0, P.faceL); g.addColorStop(1, P.face); ctx.fillStyle = g; ctx.fillRect(px, fy, T, py + T - fy);
    ctx.strokeStyle = N ? 'rgba(0,0,0,.5)' : 'rgba(60,44,30,.45)'; ctx.lineWidth = 1; const ch_ = (py + T - fy)/3; for (let r=0;r<3;r++){ const yy = fy + r*ch_; ctx.beginPath(); ctx.moveTo(px, yy); ctx.lineTo(px + T, yy); ctx.stroke(); for (let c=0;c<3;c++){ const xx = px + ((c + (r + x)%2*.5)/2)*T; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + ch_); ctx.stroke(); } }
    if (hash(x, y, 3) > .4) { const sx = px + T*(.42 + hash(x, y, 4)*.16); ctx.fillStyle = '#050406'; ctx.fillRect(sx, fy + T*.08, T*.06, T*.2); ctx.fillStyle = N ? 'rgba(150,165,210,.1)' : 'rgba(255,240,210,.3)'; ctx.fillRect(sx - T*.02, fy + T*.08, T*.02, T*.2); } // an arrow slit
    ctx.fillStyle = N ? 'rgba(30,40,40,.3)' : 'rgba(80,90,50,.3)'; for (let i=0;i<4;i++) ell(ctx, px + T*hash(x, y, i + 60), py + T*.96, T*.08, T*.03, ctx.fillStyle); }; // green at the foot, where the rain runs
  if (b7AW(ch) && ch === '#') { // the wall-walk: broad flags from above, merlons on the open sides, the face where it stands over the street
    const op = [!W(0, -1), !W(1, 0), !W(0, 1), !W(-1, 0)], fr = op[2], top = fr ? py + T*.52 : py + T;
    ctx.save(); ctx.beginPath(); ctx.rect(px, py, T, top - py); ctx.clip(); ctx.fillStyle = P.top; ctx.fillRect(px, py, T, T); b7Flags(ctx, x, y, T, Object.assign({}, P, {pave:P.top, joint:N ? 'rgba(0,0,0,.35)' : 'rgba(90,70,44,.3)'}), 1, .5); b2Mottle(ctx, x, y, T, N ? .02 : .05, .1, P.lit, 1.2);
    { const g = ctx.createLinearGradient(px, py, px + T, py + T); g.addColorStop(0, N ? 'rgba(150,165,210,.06)' : 'rgba(255,250,230,.16)'); g.addColorStop(1, 'rgba(0,0,0,.06)'); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); } /* the sun full on the walk */ parapet([op[0], op[1], false, op[3]]); if (fr) { ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(px, py, T, T); ctx.clip(); const m = T*.16; for (let i=0;i<4;i++){ const mx = px + i*T/4; ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(mx + T*.03, top - m + T*.03, T*.155, m); ctx.fillStyle = P.merl; ctx.fillRect(mx, top - m, T*.155, m); ctx.fillStyle = N ? 'rgba(150,165,210,.12)' : 'rgba(255,248,226,.4)'; ctx.fillRect(mx, top - m, T*.155, Math.max(1, T*.03)); } face(top); } // the front merlons, on the face's brow
    ctx.restore(); return; }
  if (ch === 't') { // a tower: a round drum taller than the wall, a crenellated crown, a hatch, its face where it meets the street
    const fr = !W(0, 1), cx = px + T*.5, cy = py + T*.42, r = T*.46;
    ctx.fillStyle = P.top; ctx.fillRect(px, py, T, T); b2Mottle(ctx, x, y, T, .04, .14, P.lit, 1);
    if (fr) face(py + T*.72);
    ell(ctx, cx + T*.1, cy + T*.12, r, r*.9, `rgba(${P.sh},.5)`); // its shadow on the walk
    const gr = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r); gr.addColorStop(0, P.topL); gr.addColorStop(.5, P.top); gr.addColorStop(1, shade(P.top, -.35)); ell(ctx, cx, cy, r, r*.86, gr);
    for (let i=0;i<12;i++){ const a = i/12*6.283, a2 = a + .3; ctx.fillStyle = (Math.cos(a) + Math.sin(a) < 0) ? P.topL : shade(P.merl, -.25); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r*.86); ctx.lineTo(cx + Math.cos(a2)*r, cy + Math.sin(a2)*r*.86); ctx.lineTo(cx + Math.cos(a2)*r*.8, cy + Math.sin(a2)*r*.7); ctx.lineTo(cx + Math.cos(a)*r*.8, cy + Math.sin(a)*r*.7); ctx.fill(); } // the crown of merlons
    ell(ctx, cx, cy, r*.78, r*.67, shade(P.top, -.1)); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1; for (let i=0;i<6;i++){ const a = i/6*3.14; ctx.beginPath(); ctx.moveTo(cx - Math.cos(a)*r*.76, cy - Math.sin(a)*r*.64); ctx.lineTo(cx + Math.cos(a)*r*.76, cy + Math.sin(a)*r*.64); ctx.stroke(); } // the roof-flags, laid round
    ctx.fillStyle = N ? '#0a0a10' : '#3a2e22'; ctx.fillRect(cx + T*.06, cy - T*.04, T*.14, T*.14); ctx.fillStyle = P.wood; ctx.fillRect(cx + T*.06, cy - T*.04, T*.14, T*.03); // a hatch
    if (!N) { ctx.strokeStyle = '#3a2a1e'; ctx.lineWidth = Math.max(1, T*.025); ctx.beginPath(); ctx.moveTo(cx - T*.18, cy + T*.04); ctx.lineTo(cx - T*.18, cy - T*.36); ctx.stroke(); ctx.fillStyle = '#3e4c66'; poly(ctx, [[cx - T*.18, cy - T*.36],[cx + T*.02, cy - T*.3],[cx - T*.18, cy - T*.22]], '#3e4c66'); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(cx - T*.18, cy - T*.36, T*.08, T*.02); } // a pennon, the Guard's slate-blue
    return; }
  if (ch === 's') { street(); shadeIn(); // a stair up the inside of the wall: treads, each lit on its nose, its riser in shade; a side wall where it is open
    const n = 5; for (let i=0;i<n;i++){ const y0 = py + i*T/n, k = i/n; ctx.fillStyle = shade(P.top, .06 - k*.16); ctx.fillRect(px + T*.08, y0, T*.84, T/n); ctx.fillStyle = N ? 'rgba(150,165,210,.12)' : 'rgba(255,246,224,.5)'; ctx.fillRect(px + T*.08, y0, T*.84, Math.max(1, T*.025)); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(px + T*.08, y0 + T/n - Math.max(1, T*.05), T*.84, Math.max(1, T*.05)); if (hash(x, y, i) > .7) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(px + T*(.3 + hash(x, y, i + 9)*.4), y0 + T*.04, T*.1, T*.06); } }
    const sd = (dx, sx) => { if (b2Tile(x + dx, y) === 's' || W(dx, 0)) return; ctx.fillStyle = P.face; ctx.fillRect(sx, py, T*.1, T); ctx.fillStyle = dx < 0 ? (N ? 'rgba(150,165,210,.1)' : 'rgba(255,246,224,.35)') : 'rgba(0,0,0,.3)'; ctx.fillRect(sx, py, Math.max(1, T*.03), T); }; sd(-1, px); sd(1, px + T*.9); return; }
  if (ch === 'g') { // the gate: the passage through the wall, its flags worn into two ruts, the leaves of the gate swung back against the jambs
    ctx.fillStyle = shade(P.pave, -.1); ctx.fillRect(px, py, T, T); b7Flags(ctx, x, y, T, Object.assign({}, P, {pave:shade(P.pave, -.08)}), 1, .5); b2Mottle(ctx, x, y, T, .03, .2, P.lit, 1);
    const g = ctx.createLinearGradient(0, py, 0, py + T); g.addColorStop(0, `rgba(${P.sh},${N ? .6 : .5})`); g.addColorStop(.5, `rgba(${P.sh},${N ? .4 : .25})`); g.addColorStop(1, `rgba(${P.sh},${N ? .5 : .35})`); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); // the shade under the arch
    ctx.strokeStyle = N ? 'rgba(0,0,0,.45)' : 'rgba(50,36,24,.45)'; ctx.lineWidth = Math.max(1.5, T*.06); [.3, .7].forEach(k => { const rx = px + T*(k + (b2Tile(x - 1, y) === 'g' ? -.2 : b2Tile(x + 1, y) === 'g' ? .2 : 0)); ctx.beginPath(); ctx.moveTo(rx, py); ctx.lineTo(rx, py + T); ctx.stroke(); }); // ruts, a few hundred years of carts
    ctx.fillStyle = '#0a0808'; ctx.fillRect(px, py + T*.08, T, T*.05); ctx.fillStyle = N ? 'rgba(150,165,210,.08)' : 'rgba(255,240,210,.2)'; ctx.fillRect(px, py + T*.13, T, Math.max(1, T*.02)); // the portcullis slot
    [[-1, px], [1, px + T]].forEach(([dx, ex]) => { if (!W(dx, 0)) return; const w = T*.13, lx = dx < 0 ? ex : ex - w; ctx.fillStyle = P.face; ctx.fillRect(dx < 0 ? ex : ex - T*.06, py, T*.06, T); // a jamb, and the leaf of the gate against it
      ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(lx + (dx < 0 ? w : -T*.04), py + T*.2, T*.04, T*.7); const lg = ctx.createLinearGradient(lx, 0, lx + w, 0); lg.addColorStop(0, P.woodL); lg.addColorStop(1, P.wood); ctx.fillStyle = lg; ctx.fillRect(lx + (dx < 0 ? T*.06 : -T*.06), py + T*.18, w, T*.74);
      ctx.fillStyle = P.iron; for (let i=0;i<3;i++) ctx.fillRect(lx + (dx < 0 ? T*.06 : -T*.06), py + T*(.24 + i*.24), w, Math.max(1, T*.035)); ctx.fillStyle = N ? 'rgba(150,165,210,.2)' : 'rgba(220,210,190,.6)'; for (let i=0;i<6;i++) ctx.fillRect(lx + (dx < 0 ? T*.08 : -T*.04) + (i%2)*w*.5, py + T*(.3 + Math.floor(i/2)*.24), Math.max(1, T*.025), Math.max(1, T*.025)); }); // iron bands, studs
    return; }
  if (ch === ',') dust(); else street();
  shadeIn();
  if (ch === '=') { // an awning over a stall, striped in Aren's indigo and undyed; a jar or two of whatever is left to sell under it
    const top = py + T*.1, bot = py + T*.6; ctx.fillStyle = `rgba(${P.sh},.4)`; ctx.fillRect(px + T*.1, bot, T*.88, T*.3);
    ell(ctx, px + T*.32, py + T*.84, T*.08, T*.06, N ? '#2a2420' : '#8a5a36'); ell(ctx, px + T*.54, py + T*.86, T*.07, T*.05, N ? '#222' : '#6a4a2e'); ctx.fillStyle = N ? '#2e2a28' : '#b8a888'; ctx.fillRect(px + T*.62, py + T*.76, T*.18, T*.12); // jars, a crate
    for (let i=0;i<5;i++){ ctx.fillStyle = N ? (i%2 ? '#1e2236' : '#3a3a40') : (i%2 ? '#34407a' : '#e0d6c0'); ctx.fillRect(px + i*T*.2, top, T*.2, bot - top); ctx.beginPath(); ctx.arc(px + T*(.1 + i*.2), bot, T*.1, 0, Math.PI); ctx.fill(); }
    ctx.fillStyle = N ? 'rgba(150,165,210,.08)' : 'rgba(255,252,236,.3)'; ctx.fillRect(px, top, T, T*.07); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(px, bot - T*.08, T, T*.08); // sun on the near edge, the fold
    ctx.fillStyle = P.wood; ctx.fillRect(px + T*.04, top, T*.05, T*.82); ctx.fillRect(px + T*.91, top, T*.05, T*.82);
    if (N && h > .35) { glow(ctx, px + T*.5, bot + T*.1, T*.6, '#ffa050', .3); ell(ctx, px + T*.5, bot + T*.06, T*.04, T*.05, '#ffd08a'); } } // a lamp under it, at night
  else if (ch === 'w') { const cx = px + T*.5, cy = py + T*.56, r = T*.3; // a public well: a round curb of dressed stone on a square step, a beam and wheel over it, a trough beside
    ctx.fillStyle = `rgba(${P.sh},.4)`; ctx.fillRect(px + T*.14, py + T*.26, T*.8, T*.7); ctx.fillStyle = shade(P.top, -.12); ctx.fillRect(px + T*.08, py + T*.2, T*.8, T*.7); ctx.fillStyle = N ? 'rgba(150,165,210,.08)' : 'rgba(255,248,226,.3)'; ctx.fillRect(px + T*.08, py + T*.2, T*.8, Math.max(1, T*.025)); // the step
    ell(ctx, cx + T*.05, cy + T*.06, r*1.04, r*.84, `rgba(${P.sh},.5)`); const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r); g.addColorStop(0, P.topL); g.addColorStop(1, shade(P.top, -.35)); ell(ctx, cx, cy, r, r*.8, g); // the curb
    ell(ctx, cx, cy - T*.01, r*.66, r*.5, '#050608'); ell(ctx, cx - r*.15, cy - r*.12, r*.3, r*.07, N ? 'rgba(150,165,210,.22)' : 'rgba(150,190,210,.4)'); // black water, the sky in it
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1; for (let i=0;i<8;i++){ const a = i/8*6.28; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a)*r*.68, cy + Math.sin(a)*r*.52); ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r*.8); ctx.stroke(); }
    ctx.fillStyle = P.wood; ctx.fillRect(cx - r - T*.02, py + T*.12, T*.05, cy - py - T*.1); ctx.fillRect(cx + r - T*.03, py + T*.12, T*.05, cy - py - T*.1); ctx.fillRect(cx - r - T*.02, py + T*.1, r*2 + T*.04, T*.05); ctx.fillStyle = P.woodL; ctx.fillRect(cx - r - T*.02, py + T*.1, r*2 + T*.04, Math.max(1, T*.015)); ell(ctx, cx, py + T*.13, T*.07, T*.07, P.wood); ctx.strokeStyle = N ? '#5a5a60' : '#b8a882'; ctx.beginPath(); ctx.moveTo(cx, py + T*.17); ctx.lineTo(cx, cy - T*.02); ctx.stroke(); // the frame, the wheel, the rope
    ctx.fillStyle = N ? '#2a2420' : '#6a4a2e'; ctx.fillRect(cx - T*.04, cy - T*.04, T*.08, T*.07); } // the bucket
  else exitArrow(ctx, ch, px, py, T);
}
TILEX.aren = (ctx, ch, x, y, T, dark) => b2Clip(ctx, x, y, T, () => b7Aren(ctx, ch, x, y, T, !!dark));

/* ---------------- ground: Aren Way — the barrow-field ---------------- */
/* The last three leagues: a road of packed pale dirt worn into ruts, with the old paving showing through; dry grass gone to straw on
   either side; old barrows, long and low, ringed with kerb-stones; a dead tree; outcrops of grey rock. Low light from the left
   (it is always early or late on the Way), long shadows to the right. By night it is blue and empty.
   '.' road  ',' dry grass  'm' barrow mound (walkable, high)  '#' rock (blocks)  'x' dead tree  'r' stones  (+ 't' 'o') */
const b7BM = c => c === 'm', b7BR = c => c === '#';
const b7OnM = (x, y) => { const c = b2Tile(x, y); if (c === 'm') return true; if (c !== 't' && c !== 'o') return false; return [[0,-1],[1,0],[0,1],[-1,0]].filter(([dx, dy]) => b2Tile(x + dx, y + dy) === 'm').length >= 2; }; // a battle's cover or pit on top of a barrow is still the barrow
const b7BP = N => N ? {g:'#22242a', gD:'#121418', gL:'#3a3c46', tip:'rgba(150,165,210,.14)', road:'#28282e', roadL:'#3e3e48', rut:'rgba(0,0,0,.45)', turf:'#262a2a', turfL:'#3c4246', turfD:'#0e1012', rock:'#2e3036', rockL:'#4a4e5a', rockD:'#101114', lit:'150,165,210', sh:'0,0,8', shA:.4, kerb:'#3e4048', day:0}
                     : {g:'#8a7646', gD:'#5a4a2a', gL:'#d0b878', tip:'rgba(255,214,140,.6)', road:'#9a8460', roadL:'#c8b088', rut:'rgba(70,50,30,.42)', turf:'#7a7240', turfL:'#c4b470', turfD:'#3a3418', rock:'#7a7064', rockL:'#c4b496', rockD:'#2e2824', lit:'255,206,140', sh:'40,22,34', shA:.34, kerb:'#9a9282', day:1};
function b7Barrow(ctx, ch, x, y, T, N){
  const px = x*T, py = y*T, h = hash(x, y), P = b7BP(N), fill = c => { ctx.fillStyle = c; ctx.fillRect(px, py, T, T); };
  const ground = (grass) => { fill(shade(grass ? P.g : P.road, (h - .5)*.05)); b2Mottle(ctx, x, y, T, N ? .03 : .1, N ? .2 : .12, P.lit, 1.4);
    { const g = ctx.createLinearGradient(px, 0, px + T, 0), wx = x/16; g.addColorStop(0, `rgba(${P.lit},${N ? 0 : (.07*(1 - wx)).toFixed(3)})`); g.addColorStop(1, `rgba(${P.lit},${N ? 0 : (.07*(1 - wx - 1/16)).toFixed(3)})`); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); } // warmer toward the low sun
    for (let dy=-1; dy<=1; dy++) for (let dx=-2; dx<=0; dx++){ const c = b7OnM(x + dx, y + dy) ? 'm' : b2Tile(x + dx, y + dy); if (b7BM(c) || b7BR(c)) b2Soft(ctx, (x + dx + 1.1)*T, (y + dy + .7)*T, T*(b7BM(c) ? 1.1 : 1.3), .45, P.sh, N ? .26 : (b7BM(c) ? .2 : .26)); } }; // the long shadows of the mounds and rocks, lying to the right
  const tuft = (bx, by, sz, k) => { b2Long(ctx, bx + sz*.1, by, sz*.2, sz*(N ? .8 : 1.8), P, .45);
    for (let i=0;i<8;i++){ const a = -Math.PI/2 + (i/7 - .5)*1.4 + .22 + (hash(x, y, k*10 + i + 103) - .5)*.25, l = sz*(.6 + hash(x, y, k*10 + i + 104)*.5), ex = bx + Math.cos(a)*l, ey = by + Math.sin(a)*l;
      ctx.strokeStyle = i%3 === 0 ? P.gL : i%3 === 1 ? P.gD : shade(P.g, .14); ctx.lineWidth = Math.max(1, T*.015); ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + Math.cos(a - .2)*l*.5, by + Math.sin(a - .2)*l*.55, ex, ey); ctx.stroke(); } }; // a clump of straw, bent east
  const stone = (cx, cy, r) => { b2Long(ctx, cx + r*.4, cy + r*.3, r*.6, r*(N ? 1.6 : 3.2), P); ell(ctx, cx, cy, r, r*.72, P.rock); ell(ctx, cx - r*.28, cy - r*.24, r*.55, r*.32, P.rockL); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(cx - r*.6, cy + r*.18, r*1.2, Math.max(1, r*.1)); };
  if (ch !== '#' && b7OnM(x, y)) ch = 'm';
  if (ch === 'm') { // a barrow: one long low mound across all its tiles, turfed in dry grass, its sunward brow lit, a ring of kerb-stones at its foot
    ground(true); const S = b2WaterShape(x, y, T, (() => { let k = 0; const off = [[0,-1],[1,0],[0,1],[-1,0]]; return () => { const [dx, dy] = off[k++ % 4]; return b7OnM(x + dx, y + dy); }; })(), 1.8); // (asked in order: up, right, down, left)
    ctx.save(); ctx.translate(T*.14, T*.1); S.path(ctx); ctx.fillStyle = `rgba(${P.sh},${N ? .5 : .32})`; ctx.fill(); ctx.restore(); // its shade at its foot
    S.path(ctx); ctx.fillStyle = P.turf; ctx.fill();
    ctx.save(); S.path(ctx); ctx.clip();
      b2Mottle(ctx, x, y, T, N ? .03 : .1, .18, P.lit, .9);
      b2EdgeShade(ctx, S, T, N ? 'rgba(150,165,210,.14)' : 'rgba(255,214,150,.42)', N ? 'rgba(0,0,0,.5)' : 'rgba(40,20,30,.4)', .8);
      b2Blades(ctx, x, y, T, Object.assign({}, P, {g:P.turf, gL:P.turfL, gD:P.turfD}), 30, .09, 70, false);
      if (h > .86 && b2Tile(x, y) === 'm' && [[0,-1],[1,0],[0,1],[-1,0]].every(([dx, dy]) => b7OnM(x + dx, y + dy))) { const cx = px + T*.42, cy = py + T*.5; b2Long(ctx, cx + T*.1, cy + T*.04, T*.1, T*(N ? .4 : .6), P, 1); poly(ctx, [[cx - T*.22, cy + T*.06],[cx - T*.18, cy - T*.08],[cx + T*.2, cy - T*.1],[cx + T*.24, cy + T*.06]], P.rock); poly(ctx, [[cx - T*.18, cy - T*.08],[cx + T*.2, cy - T*.1],[cx + T*.16, cy - T*.04],[cx - T*.16, cy - T*.02]], P.rockL); } // a capstone, half-sunk at its crown
    ctx.restore();
    b2Lip(ctx, S, T, N ? 'rgba(0,0,0,.4)' : 'rgba(40,24,14,.38)', N ? 'rgba(160,170,200,.1)' : 'rgba(255,214,150,.32)');
    S.E.forEach((pts, k) => { if (!S.L[k]) return; pts.forEach((p, i) => { if (i % 2 || hash(x*9 + k, y*9 + i, 5) < .3) return; const r = T*(.045 + hash(x, y, k*20 + i)*.03); ell(ctx, p[0] + r*.3, p[1] + r*.3, r*1.1, r*.7, 'rgba(0,0,0,.35)'); ell(ctx, p[0], p[1], r, r*.75, P.kerb); ell(ctx, p[0] - r*.3, p[1] - r*.3, r*.5, r*.3, N ? 'rgba(150,165,210,.15)' : 'rgba(255,240,210,.5)'); }); }); // the kerb, stone by stone, some gone
    return; }
  if (ch === '#') { // grey rock breaking out of the grass, one shape across its tiles, lit on its sunward faces
    ground(true); const S = b2WaterShape(x, y, T, b7BR, 1.6);
    ctx.save(); ctx.translate(T*.16, T*.12); S.path(ctx); ctx.fillStyle = `rgba(${P.sh},${N ? .55 : .4})`; ctx.fill(); ctx.restore();
    S.path(ctx); ctx.fillStyle = P.rock; ctx.fill(); ctx.save(); S.path(ctx); ctx.clip(); b2Mottle(ctx, x, y, T, N ? .02 : .08, .25, P.lit, .8);
      b2EdgeShade(ctx, S, T, N ? 'rgba(150,165,210,.2)' : 'rgba(255,226,170,.6)', N ? 'rgba(0,0,0,.7)' : 'rgba(30,16,24,.6)', .6);
      for (let i=0;i<2;i++){ const sx = px + T*(.2 + hash(x, y, i + 58)*.5), sy = py + T*(.2 + hash(y, x, i + 59)*.5), r = T*(.12 + hash(x, y, i + 60)*.1); poly(ctx, [[sx - r, sy + r*.4],[sx - r*.6, sy - r*.5],[sx + r*.5, sy - r*.6],[sx + r, sy + r*.2],[sx + r*.2, sy + r*.6]], shade(P.rock, .08)); poly(ctx, [[sx - r, sy + r*.4],[sx - r*.6, sy - r*.5],[sx + r*.5, sy - r*.6],[sx, sy - r*.2]], P.rockL); } // facets: the sunward ones lit
      ctx.strokeStyle = 'rgba(0,0,0,.32)'; ctx.lineWidth = Math.max(1, T*.02); for (let i=0;i<3;i++){ const sx = px + T*hash(x, y, i + 50), sy = py + T*hash(y, x, i + 51); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + T*(hash(x, y, i + 52) - .3)*.4, sy + T*hash(x, y, i + 53)*.4); ctx.stroke(); } // fissures
      ctx.fillStyle = N ? 'rgba(80,100,90,.2)' : 'rgba(170,170,100,.4)'; for (let i=0;i<3;i++) ell(ctx, px + T*hash(x, y, i + 56), py + T*hash(y, x, i + 57), T*.07, T*.04, ctx.fillStyle); ctx.restore(); // lichen
    b2Lip(ctx, S, T, N ? 'rgba(0,0,0,.45)' : 'rgba(40,24,14,.45)', N ? 'rgba(160,170,200,.12)' : 'rgba(255,226,170,.38)'); return; }
  const grass = ch !== '.'; ground(grass);
  { const rd = c => c === '.', mine = grass ? P.g : P.road, mid = b2Mix(P.g, P.road, .5), clear = b2Mix(mine, mine, 0).replace('rgb', 'rgba').replace(')', ',0)'); // where road meets grass, both tiles meet halfway, so neither is a square
    [[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx, dy]) => { const c = b2Tile(x + dx, y + dy); if (c === null || c === undefined || rd(c) === !grass || !(c === '.' || c === ',' || c === 'r' || c === 'x')) return; const g = dx ? ctx.createLinearGradient(dx > 0 ? px + T : px, 0, dx > 0 ? px + T*.5 : px + T*.5, 0) : ctx.createLinearGradient(0, dy > 0 ? py + T : py, 0, py + T*.5); g.addColorStop(0, mid); g.addColorStop(1, clear); ctx.fillStyle = g; ctx.fillRect(px, py, T, T); });
    b2Mottle(ctx, x, y, T, N ? .02 : .06, N ? .14 : .08, P.lit, 1.6); } // and the light and shade go on over both
  if (!grass) { // the Way itself: two ruts the way the road runs, the old paving coming through between them
    const R_ = (dx, dy) => b2Tile(x + dx, y + dy) === '.', run = (dx, dy) => { let n = 0; for (let k=-3;k<=3;k++) n += R_(dx*k, dy*k); return n; }, hr = run(1, 0), vr = run(0, 1), H_ = hr >= 6 && vr <= 3 ? 1 : vr >= 6 && hr <= 3 ? 0 : -1, ks = H_ === 1 ? (R_(0, -1) ? [.3] : R_(0, 1) ? [.7] : [.32, .68]) : (R_(-1, 0) ? [.3] : R_(1, 0) ? [.7] : [.32, .68]); // ruts only where the road runs one way; on a broad road, one each side of its middle
    for (let i=0;i<2;i++) if (H_ >= 0 && hash(x, y, i + 60) > .6) { const sx = px + T*(.15 + hash(x, y, i + 61)*.6), sy = py + T*(.2 + hash(y, x, i + 62)*.6), w = T*(.16 + hash(x, y, i + 63)*.12); ctx.fillStyle = shade(P.road, .05 + (hash(x, y, i + 64) - .5)*.06); ctx.fillRect(sx, sy, w, w*.6); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(sx, sy + w*.6 - 1, w, 1); ctx.fillRect(sx + w - 1, sy, 1, w*.6); } // old flags
    if (H_ >= 0) { ctx.strokeStyle = P.rut; ctx.lineWidth = Math.max(1.2, T*.05); ks.forEach(k => { ctx.beginPath(); if (H_) { ctx.moveTo(px, py + T*k + Math.sin(x*1.3)*T*.02); ctx.lineTo(px + T, py + T*k + Math.sin((x + 1)*1.3)*T*.02); } else { ctx.moveTo(px + T*k + Math.sin(y*1.3)*T*.02, py); ctx.lineTo(px + T*k + Math.sin((y + 1)*1.3)*T*.02, py + T); } ctx.stroke(); });
    ctx.strokeStyle = N ? 'rgba(150,165,210,.08)' : 'rgba(255,236,200,.3)'; ctx.lineWidth = Math.max(1, T*.015); ks.forEach(k => { ctx.beginPath(); if (H_) { ctx.moveTo(px, py + T*k + T*.03); ctx.lineTo(px + T, py + T*k + T*.03); } else { ctx.moveTo(px + T*k + T*.03, py); ctx.lineTo(px + T*k + T*.03, py + T); } ctx.stroke(); }); } // their far lips, lit
    for (let i=0;i<5;i++){ const sx = px + hash(x, y, i + 70)*T, sy = py + hash(y, x, i + 71)*T; ctx.fillStyle = N ? 'rgba(0,0,0,.4)' : 'rgba(80,60,40,.5)'; ctx.fillRect(sx, sy, Math.max(1, T*.03), Math.max(1, T*.025)); } // grit
    [[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx, dy], k) => { if (b2Tile(x + dx, y + dy) !== ',' || hash(x, y, k + 170) < .4) return; const u = .2 + hash(x, y, k + 171)*.6; tuft(px + T*(dx ? (dx > 0 ? .92 : .08) : u), py + T*(dy ? (dy > 0 ? .96 : .2) : u), T*(.12 + hash(x, y, k + 172)*.06), k + 5); }); } // the grass straggling in at the verge
  else { b2Blades(ctx, x, y, T, P, 22, .1, 40, false); const n = 3 + (h > .5 ? 1 : 0); for (let c=0;c<n;c++) tuft(px + T*(.06 + hash(x, y, c + 100)*.88), py + T*(.3 + hash(y, x, c + 101)*.66), T*(.18 + hash(x, y, c + 102)*.14), c); } // dry grass, straw-pale, in clumps
  if (ch === 'r') { stone(px + T*.24, py + T*.74, T*.1); stone(px + T*.78, py + T*.78, T*.07); if (h > .4) { const cx = px + T*.52, by = py + T*.72, w = T*.13, hh = T*.38; b2Long(ctx, cx + w*.6, by, w*.5, T*(N ? .7 : 1.6), P, 1.1); ctx.fillStyle = P.rock; ctx.beginPath(); ctx.moveTo(cx - w, by); ctx.lineTo(cx - w, by - hh + w); ctx.quadraticCurveTo(cx - w, by - hh, cx, by - hh); ctx.quadraticCurveTo(cx + w, by - hh, cx + w, by - hh + w); ctx.lineTo(cx + w, by); ctx.closePath(); ctx.fill(); ctx.fillStyle = P.rockL; ctx.fillRect(cx - w, by - hh + w*.8, w*.5, hh - w*.8); ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let i=0;i<3;i++) ctx.fillRect(cx - w*.5, by - hh + w*1.3 + i*T*.06, w*1.1, Math.max(1, T*.018)); ell(ctx, cx, by, w*1.1, T*.03, 'rgba(0,0,0,.3)'); } // a milestone, its letters worn to scratches
    else { const cx = px + T*.58, cy = py + T*.34; b2Long(ctx, cx + T*.1, cy + T*.04, T*.07, T*(N ? .6 : 1.4), P, 1); poly(ctx, [[cx - T*.24, cy + T*.04],[cx - T*.2, cy - T*.06],[cx + T*.22, cy - T*.08],[cx + T*.26, cy + T*.04]], P.rock); ctx.fillStyle = P.rockL; ctx.fillRect(cx - T*.2, cy - T*.07, T*.4, Math.max(1, T*.03)); } } // stones, and a fallen standing-stone (or a milestone still up)
  else if (ch === 'x') { const bx = px + T*.46, by = py + T*.82; // a dead tree: grey, bare, twisted by the wind off the sea; a crow on it, by day
    b2Long(ctx, bx + T*.2, by, T*.14, T*(N ? 1.2 : 2.6), P, 1.1); ell(ctx, bx, by, T*.12, T*.05, 'rgba(0,0,0,.4)');
    const br = (x0, y0, a, l, w, d) => { const x1 = x0 + Math.cos(a)*l, y1 = y0 + Math.sin(a)*l; ctx.strokeStyle = N ? '#3a3c44' : '#4a4038'; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1)/2 + Math.sin(a)*l*.15, (y0 + y1)/2, x1, y1); ctx.stroke();
      if (w > 1.4) { ctx.strokeStyle = N ? 'rgba(150,165,210,.15)' : 'rgba(230,214,190,.45)'; ctx.lineWidth = w*.3; ctx.beginPath(); ctx.moveTo(x0 - w*.25, y0); ctx.lineTo(x1 - w*.25, y1); ctx.stroke(); }
      if (d > 0) { br(x1, y1, a - .5 - hash(x, y, d)*.3, l*.66, w*.62, d - 1); br(x1, y1, a + .45 + hash(y, x, d)*.3, l*.6, w*.58, d - 1); } };
    br(bx, by, -Math.PI/2 - .1, T*.38, Math.max(2.4, T*.11), 3); ctx.lineCap = 'butt';
    if (!N && h > .3) { const cx = bx - T*.04 + Math.cos(-Math.PI/2 - .6)*T*.2, cy = by - T*.3 - T*.12; ell(ctx, cx, cy, T*.04, T*.028, '#120e10'); ell(ctx, cx + T*.04, cy - T*.02, T*.02, T*.02, '#120e10'); poly(ctx, [[cx + T*.055, cy - T*.025],[cx + T*.085, cy - T*.015],[cx + T*.055, cy - T*.005]], '#120e10'); ctx.fillRect(cx - T*.07, cy, T*.04, Math.max(1, T*.015)); } } // a crow, waiting
  else exitArrow(ctx, ch, px, py, T);
}
TILEX.barrow = (ctx, ch, x, y, T, dark) => b2Clip(ctx, x, y, T, () => b7Barrow(ctx, ch, x, y, T, !!dark));

/* ---------------- backdrops: SCENEX[kind](canvas, t) — the still parts cached with sceneLayer, the frame adding what moves ---------------- */
/* Aren's walls from outside: a long curtain of pale stone with square towers along it and a gatehouse, merlons against the sky,
   the lit faces toward the low sun on the left; the city's domes over it */
function b7Walls(x, x0, x1, base, hh, col, lit, seed, gx){ const tw = hh*.9, tower = (cx, w, th) => { x.fillStyle = col; x.fillRect(cx - w/2, base - th, w, th); for (let i=0;i<4;i++) x.fillRect(cx - w/2 + i*w/3.4, base - th - hh*.12, w/6.4, hh*.12); x.fillStyle = lit; x.fillRect(cx - w/2, base - th - hh*.12, w*.18, th + hh*.12); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(cx + w*.3, base - th, w*.2, th); x.fillStyle = '#0a0808'; x.fillRect(cx - .6, base - th*.7, 1.2, th*.14); };
  x.fillStyle = col; x.fillRect(x0, base - hh, x1 - x0, hh); for (let px=x0; px<x1; px+=hh*.32) x.fillRect(px, base - hh - hh*.1, hh*.18, hh*.1); // the curtain and its merlons
  { const g = x.createLinearGradient(0, base - hh, 0, base); g.addColorStop(0, 'rgba(255,240,210,.12)'); g.addColorStop(1, 'rgba(0,0,0,.25)'); x.fillStyle = g; x.fillRect(x0, base - hh, x1 - x0, hh); } // lit along its brow, darker at its foot
  for (let i=0, px=x0 + hh*.6; px<x1; i++, px += hh*(2.6 + hash(i, seed)*1.4)) if (!gx || Math.abs(px - gx) > hh*1.6) tower(px, tw, hh*(1.3 + hash(i, seed + 1)*.3));
  if (gx) { tower(gx - hh*.9, tw*1.2, hh*1.7); tower(gx + hh*.9, tw*1.2, hh*1.7); x.fillStyle = col; x.fillRect(gx - hh*.9, base - hh*1.36, hh*1.8, hh*1.36); x.fillStyle = '#0c0a0a'; x.beginPath(); x.moveTo(gx - hh*.42, base); x.lineTo(gx - hh*.42, base - hh*.62); x.arc(gx, base - hh*.62, hh*.42, Math.PI, 0); x.lineTo(gx + hh*.42, base); x.fill(); } } // the gatehouse, its arch open
/* an old barrow seen across the plain: long and low, its back not quite even, grass breaking its line, a few kerb-stones at its foot */
function b7Mound(x, cx, by, w, hh, col, lit, seed, grass){ const top = k => by - hh*Math.pow(Math.sin(k*Math.PI), .7)*(1 + (hash(Math.round(k*12), seed) - .5)*.06), path = () => { x.beginPath(); x.moveTo(cx - w, by); for (let i=1;i<=24;i++){ const k = i/24; x.lineTo(cx - w + k*w*2, top(k)); } x.closePath(); };
  path(); x.fillStyle = vgrad(x, by - hh, by, [[0, shade(col, .08)], [1, shade(col, -.25)]]); x.fill();
  if (lit) { x.save(); path(); x.clip(); const g = x.createLinearGradient(cx - w, 0, cx + w*.2, 0); g.addColorStop(0, lit); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(cx - w, by - hh*1.1, w*1.2, hh*1.1); x.restore();
    x.strokeStyle = lit; x.lineWidth = Math.max(.8, hh*.05); x.beginPath(); for (let i=1;i<=12;i++){ const k = i/24; i === 1 ? x.moveTo(cx - w + k*w*2, top(k)) : x.lineTo(cx - w + k*w*2, top(k)); } x.stroke(); } // its sunward brow
  if (grass) { x.strokeStyle = grass; x.lineWidth = Math.max(.6, hh*.03); for (let i=0;i<Math.round(w/2); i++){ const k = hash(i, seed + 1), px = cx - w + k*w*2, py = top(k) + 1, l = hh*(.06 + hash(i, seed + 2)*.1); x.beginPath(); x.moveTo(px, py); x.lineTo(px + l*.4, py - l); x.stroke(); } } // straw against the sky
  x.fillStyle = 'rgba(0,0,0,.25)'; for (let i=0;i<9;i++){ const k = (i + .5)/9, px = cx - w*.92 + k*w*1.84; if (hash(i, seed + 3) < .35) continue; x.beginPath(); x.ellipse(px, by - .5, w*.025, hh*.06, 0, Math.PI, 0); x.fill(); } } // kerb-stones, some gone
/* small running people, bent forward, legs going */
function b7Runner(ctx, cx, cy, s, col, ph, d = 1, load){ ctx.fillStyle = col; ctx.save(); ctx.translate(cx, cy); ctx.scale(d, 1); ctx.beginPath(); ctx.moveTo(-1*s, -6.6*s); ctx.lineTo(1.2*s, -6.6*s); ctx.lineTo(.6*s, -2.6*s); ctx.lineTo(-1.2*s, -2.6*s); ctx.closePath(); ctx.fill(); ctx.translate(.6*s, 0); ctx.beginPath(); ctx.arc(1*s, -7.6*s, .85*s, 0, 7); ctx.fill(); ctx.translate(-.6*s, 0);
  ctx.strokeStyle = col; ctx.lineWidth = .8*s; ctx.lineCap = 'round'; const a = Math.sin(ph)*2.2*s; ctx.beginPath(); ctx.moveTo(0, -2.8*s); ctx.lineTo(a, 0); ctx.moveTo(0, -2.8*s); ctx.lineTo(-a, 0); ctx.stroke(); ctx.lineCap = 'butt';
  if (load) { ctx.beginPath(); ctx.ellipse(-1.2*s, -6*s, 1.4*s, 1.2*s, 0, 0, 7); ctx.fill(); } ctx.restore(); } // a bundle, a child

SCENEX.b2_aren_walls = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.5, base = hz + H*.07, gx = W*.66;
  const R = u => [lerp(-W*.08, gx, Math.pow(u, .8)), lerp(H*1.04, base + 1, Math.pow(u, .55))], SC = py => .3 + (py - hz)/(H - hz)*1.9; // the Way, from behind the viewer to the gate
  ctx.drawImage(sceneLayer('b2:aren_walls', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#5a6a84'],[.5,'#b4a898'],[.85,'#e8c896'],[1,'#f0d4a0']]); x.fillRect(0, 0, W, hz + 2); // a hot afternoon, the haze gold low down
    glow(x, W*.08, hz*.62, W*.5, '#ffd8a0', .5); glow(x, W*.08, hz*.62, 18, '#fff4dc', .8); // the sun, low on the left in the haze
    for (let i=0;i<4;i++) cloud(x, W*(.2 + hash(i, 4)*.7), hz*(.2 + i*.14), W*(.24 + hash(i, 5)*.2), 2 + i*.6, '#fff0dc', .12);
    // behind the walls: Aren, a city of pale domes and towers going down to the sea on the right
    b2Skyline(x, W, base - H*.11, 'rgba(176,160,140,.55)', 71, H*.08, false); b2Skyline(x, W, base - H*.08, 'rgba(150,134,116,.8)', 72, H*.06, false);
    x.fillStyle = 'rgba(120,150,170,.6)'; x.fillRect(W*.86, hz - 2, W*.14, 3); glow(x, W*.95, hz, W*.12, '#d8e8f0', .3); // the sea beyond, a line of it
    x.fillStyle = vgrad(x, hz, H, [[0,'#a89270'],[.3,'#8a7450'],[1,'#3a2e1c']]); x.fillRect(0, hz, W, H - hz); // the plain before the walls, trodden bare
    b7Walls(x, W*.24, W*1.04, base, H*.1, '#b8a888', 'rgba(255,240,206,.4)', 73, gx); // the walls of Aren
    x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(W*.24, base, W*.8, 3); // their foot
    for (let i=0;i<5;i++){ const bx = W*(.04 + i*.08) + hash(i, 81)*W*.03, by = hz + H*(.03 + hash(i, 82)*.05), s = .6 + (by - hz)/H*3; b7Mound(x, bx, by, 16*s, 5*s, '#7a6a48', 'rgba(255,226,170,.35)', 40 + i, 'rgba(90,70,40,.7)'); } // the old barrows, out along the Way
    for (let i=0;i<140;i++){ const yy = hz + 3 + Math.pow(hash(i, 21), 1.3)*(H - hz), px = hash(i, 22)*W, d = (yy - hz)/(H - hz); ell(x, px, yy, 1 + d*5, .5 + d*1.5, `rgba(60,46,28,${(.18 + d*.3).toFixed(2)})`); } // scrub and stones
    x.lineCap = 'round'; for (let i=0;i<=60;i++){ const [px, py] = R(i/60), [qx, qy] = R((i + 1)/60), d = (py - hz)/(H - hz); x.strokeStyle = `rgba(196,176,136,${(.4 + d*.4).toFixed(2)})`; x.lineWidth = 2 + d*40; x.beginPath(); x.moveTo(px, py); x.lineTo(qx, qy); x.stroke(); } x.lineCap = 'butt'; // the Way: pale dust, wide where it is near
    // far back on the left, under the haze: Dom's army, a dark smear and its dust
    for (let i=0;i<8;i++) glow(x, W*(.0 + i*.035), hz - 2 - i*.6, 20 + i*4, '#a08a6a', .22); x.fillStyle = 'rgba(60,48,40,.55)'; for (let i=0;i<120;i++){ const px = hash(i, 31)*W*.24, py = hz + hash(i, 32)*3; x.fillRect(px, py - 2, 1, 2); if (hash(i, 33) > .8) x.fillRect(px, py - 5, .4, 3); }
  }), 0, 0, W, H);
  // the dust the Chain raises, gold in the sun, rolling up toward the gate
  for (let i=0;i<12;i++){ const k = ((t*mo/7000 + hash(i, 41)) % 1), [px, py] = R(.2 + hash(i, 42)*.75); ell(ctx, px - 6 + k*10, py - 6 - k*14*SC(py), 14 + k*26*SC(py), 3 + k*6*SC(py), `rgba(236,208,160,${(.22*Math.sin(k*Math.PI)).toFixed(3)})`); }
  // the refugees, running the last of it: thousands, thinning to specks at the gate, going into the dark of the arch
  const N = 170; for (let i=0;i<N;i++){ const u = ((hash(i, 51) + t*mo/26000*(.8 + hash(i, 52)*.4)) % 1), [px0, py0] = R(u), s = SC(py0), w = 4 + (1 - u)*W*.12, px = px0 + (hash(i, 53) - .5)*w, py = py0 + (hash(i, 54) - .5)*w*.18, fade = clamp((1 - u)*14, 0, 1)*clamp(u*20, 0, 1);
    ctx.globalAlpha = fade; b7Runner(ctx, px, py, s, `rgb(${40 + Math.round(hash(i, 55)*30)},${32 + Math.round(hash(i, 56)*20)},${24 + Math.round(hash(i, 57)*14)})`, t*mo/(90 + hash(i, 58)*40) + i, 1, hash(i, 59) > .7);
    if (hash(i, 60) > .93 && u < .6) { ctx.fillStyle = `rgba(${60 + Math.round(hash(i, 61)*40)},40,30,${fade.toFixed(2)})`; ctx.fillRect(px - 4*s, py - 5*s, 6*s, 4*s); ctx.beginPath(); ctx.arc(px - 3*s, py - .6*s, 1.2*s, 0, 7); ctx.arc(px + 1*s, py - .6*s, 1.2*s, 0, 7); ctx.fill(); } } // a handcart, here and there
  ctx.globalAlpha = 1;
  { ctx.fillStyle = 'rgba(30,20,14,.5)'; for (let i=0;i<10;i++){ const px = gx + (hash(i, 63) - .5)*W*.04, py = base - 1 - hash(i, 64)*2; ctx.fillRect(px, py - 3, 1, 3); } } // packed in the gate
  b2Wheel(ctx, t*mo, W*.14, hz - H*.16, W*.1, 10, 9, .55, 'rgba(20,16,18,.8)', 23); // crows, already, back toward the barrows
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.06 + i*Math.min(28, W*.36/sq.length), H*.97 - (i%2)*3, 2, t, {phase:i*1.2, dir:1}));
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, W*.05, H*.4, W*.5, '#ffb070', .08); ctx.globalCompositeOperation = 'source-over';
  vign(ctx, W, H, .5, .5); };

/* the Barrow, from the walls: far off and small. The ring of Dom's army, black; a knot on the top of an old mound; the crows over it,
   more of them every moment, until the sky above it is moving. No faces, no blood: the distance and the birds say it */
SCENEX.b2_barrow = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.5, bx = W*.5, by = hz + H*.075;
  ctx.drawImage(sceneLayer('b2:barrow', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#3a2e36'],[.45,'#7a5444'],[.8,'#c08458'],[1,'#d89a62']]); x.fillRect(0, 0, W, hz + 2); // a smoked, bruised evening
    glow(x, W*.12, hz*.82, W*.4, '#ffb070', .4); glow(x, W*.12, hz*.82, 12, '#ffe0b0', .7); // the sun low on the left, red through smoke
    for (let i=0;i<5;i++) cloud(x, W*(.1 + hash(i, 6)*.8), hz*(.15 + i*.12), W*(.22 + hash(i, 7)*.2), 2 + i*.6, i%2 ? '#2a1e24' : '#8a5a48', .14);
    for (let i=0;i<3;i++){ const sx = W*(.2 + i*.3 + hash(i, 8)*.1); for (let k=0;k<14;k++){ const kk = k/14; glow(x, sx + kk*kk*W*.12, hz - kk*hz*.9, 6 + kk*22, '#3a2a28', .2*(1 - kk*.6)); } } // smoke from the burning on the plain, leaning east
    x.fillStyle = vgrad(x, hz, H, [[0,'#5a4434'],[.4,'#3a2c22'],[1,'#120e0a']]); x.fillRect(0, hz, W, H - hz);
    x.fillStyle = 'rgba(40,30,26,.9)'; x.fillRect(0, hz - 1, W, 2); // the line of the land
    for (let i=0;i<4;i++){ const ox = W*(.08 + i*.26 + hash(i, 11)*.06), oy = hz + 3 + hash(i, 12)*6; if (Math.abs(ox - bx) < W*.16) continue; b7Mound(x, ox, oy, 12 + i*2, 3 + i*.6, '#3a2c22', 'rgba(255,170,110,.18)', 34 + i); } // other barrows, empty
    { const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(255,160,90,.12)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, hz, W, H - hz); }
    // the army round it, a dark tide: a mass pressed round the foot of the mound and thinning out across the plain, spears up in it
    x.save(); x.beginPath(); x.rect(0, hz + .5, W, H); x.clip(); for (let i=0;i<26;i++){ const a = i/26*6.283, rx = W*(.14 + hash(i, 28)*.14), ry = H*(.02 + hash(i, 29)*.02); glow(x, bx + Math.cos(a)*rx, by + Math.sin(a)*ry*.8 + H*.008, W*.06, '#140e0c', .4); } x.restore();
    { x.fillStyle = 'rgba(22,15,12,.78)'; x.beginPath(); for (let i=0;i<=40;i++){ const a = i/40*6.283, r = 1 + Math.sin(a*3 + 1)*.12 + (hash(i % 40, 30) - .5)*.2, px = bx + Math.cos(a)*W*.2*r, py = by + H*.006 + Math.sin(a)*H*.045*r; i ? x.lineTo(px, Math.max(hz + .5, py)) : x.moveTo(px, Math.max(hz + .5, py)); } x.closePath(); x.fill(); } // the press of them, round its foot
    b7Mound(x, bx, by, W*.11, H*.09, '#3a2c22', 'rgba(255,170,110,.3)', 33, 'rgba(30,20,16,.9)'); // THE barrow, its crown above the line of the land
    for (let i=0;i<1100;i++){ const a = hash(i, 21)*6.283, rr = .85 + Math.pow(hash(i, 22), 2.2)*3.6 + Math.sin(a*5 + 1)*.25, px = bx + Math.cos(a)*W*.085*rr, py = by - H*.004 + Math.sin(a)*H*.026*rr + (hash(i, 27) - .5)*H*.01, s = .5 + (py - hz)/(H - hz)*1.2; if (py < hz + 1.5 || (Math.abs(px - bx) < W*.08 && py < by - H*.006)) continue; x.fillStyle = `rgba(${18 + Math.round(hash(i, 23)*20)},${14 + Math.round(hash(i, 24)*10)},12,${(.75 + hash(i, 25)*.25).toFixed(2)})`; x.fillRect(px, py - 2.4*s, 1.1*s, 2.4*s); if (hash(i, 26) > .74) x.fillRect(px + .3*s, py - 6*s, .35*s, 4*s); }
    for (let i=0;i<9;i++){ const a = (i/9)*6.283 + .4, px = bx + Math.cos(a)*W*.17, py = by + Math.sin(a)*H*.05; if (py < hz + 2) continue; x.fillStyle = '#140e0c'; x.fillRect(px, py - 12, .8, 12); x.fillStyle = i%2 ? '#4a2418' : '#2e3a22'; x.fillRect(px + .8, py - 12, 4, 2.6); } // their standards
    // the knot on the top: a few dozen, close together, a single standard of crow feathers over them
    for (let i=0;i<30;i++){ const u = hash(i, 31) - .5, px = bx + u*W*.06, py = by - H*.093 + u*u*H*.12 + hash(i, 32)*1.2; x.fillStyle = 'rgba(10,8,8,.95)'; x.fillRect(px, py - 3, 1.2, 3); x.beginPath(); x.arc(px + .6, py - 3.6, .7, 0, 7); x.fill(); }
    { const sy = by - H*.095; x.fillStyle = '#0a0808'; x.fillRect(bx, sy - 16, .9, 16); x.lineWidth = .8; x.strokeStyle = '#0a0808'; for (let k=0;k<4;k++){ x.beginPath(); x.moveTo(bx + .9, sy - 15 + k*1.4); x.quadraticCurveTo(bx + 3 + k, sy - 14 + k*1.6, bx + 4.6 + k*.8, sy - 11 + k*1.6); x.stroke(); } } // the crow-feather standard
    // Aren's own wall in the foreground: we are on it, looking out between the merlons
    x.fillStyle = '#1a1410'; x.fillRect(0, H*.9, W, H*.1); [[-.02, .1], [.86, .16]].forEach(([u, w]) => { x.fillStyle = '#1a1410'; x.fillRect(W*u, H*.68, W*w, H*.24); x.fillStyle = 'rgba(255,170,110,.16)'; x.fillRect(W*u, H*.68, W*.012, H*.24); x.fillRect(W*u, H*.68, W*w, 1.2); }); x.fillStyle = 'rgba(255,170,110,.12)'; x.fillRect(0, H*.9, W, 1.4); // Aren's parapet: we are on it, between two merlons
  }), 0, 0, W, H);
  // the crows: a cloud over the barrow, wheeling, thickening, a few dropping and lifting; and more coming in from everywhere
  b2Wheel(ctx, t*mo, bx, by - H*.2, W*.12, H*.1, 70, .55, 'rgba(10,8,10,.88)', 31); b2Wheel(ctx, t*mo*.8, bx + W*.02, by - H*.28, W*.2, H*.12, 50, .45, 'rgba(14,10,14,.7)', 37);
  for (let i=0;i<14;i++){ const k = ((t*mo/(9000 + hash(i, 41)*5000) + hash(i, 42)) % 1), sx = hash(i, 43) > .5 ? -W*.05 : W*1.05, sy = H*(.08 + hash(i, 44)*.3), px = lerp(sx, bx, k), py = lerp(sy, by - H*.22, k) - Math.sin(k*Math.PI)*H*.06; b2Bird(ctx, px, py, .6 + (1 - k)*.4, Math.sin(t*mo/150 + i), 'rgba(10,8,10,.85)'); }
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, bx, by - H*.06, W*.06, '#ff9a50', mo ? .06 + Math.sin(t/700)*.03 : .06); ctx.globalCompositeOperation = 'source-over'; // something burning by it, or the sun on steel
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.14 + i*Math.min(30, W*.5/sq.length), H*.975 + (i%2)*2, 2.1, t, {still:true, dir:1}));
  ctx.fillStyle = '#1a1410'; ctx.fillRect(0, H*.955, W, H*.05); ctx.fillStyle = 'rgba(255,170,110,.1)'; ctx.fillRect(0, H*.955, W, 1); // (they stand at it to the chest) // the parapet before them, to the waist
  vign(ctx, W, H, .62, .48); };

/* Aren Way at dawn: the road running out to the horizon, and along both sides of it, as far as it goes, the uprights. Silhouettes only,
   against a sky going from cold to gold; mist low on the ground; crows. The nearest are still far off. Nothing else is shown */
SCENEX.b2_aren_way = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.6, vx = W*.56;
  const P = (side, k) => { const z = 1/(.12 + k*1.6), sp = W*.07*z; return [vx + side*sp, hz + H*.032*z*.5, z]; }; // the uprights in perspective: k from near (0) to far (1)
  ctx.drawImage(sceneLayer('b2:aren_way', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#1a2236'],[.4,'#4a5068'],[.7,'#b08a80'],[.88,'#e8b888'],[1,'#f4d8a8']]); x.fillRect(0, 0, W, hz + 2); // dawn
    glow(x, vx + W*.06, hz, W*.5, '#ffd8a0', .4); glow(x, vx + W*.06, hz, W*.12, '#fff0d0', .5); x.fillStyle = '#fff4dc'; x.beginPath(); x.ellipse(vx + W*.06, hz, 7, 2.4, 0, Math.PI, 0); x.fill(); // the sun's first rim, at the end of the road
    for (let i=0;i<30;i++){ x.fillStyle = `rgba(220,226,255,${(.1 + hash(i, 3)*.4).toFixed(2)})`; x.fillRect(hash(i, 4)*W, hash(i, 5)*hz*.4, 1, 1); } // the last stars
    for (let i=0;i<3;i++) cloud(x, W*(.15 + i*.32), hz*(.3 + i*.12), W*.3, 2, '#e8a890', .1);
    x.fillStyle = vgrad(x, hz, H, [[0,'#5a4a46'],[.3,'#3a302c'],[1,'#141012']]); x.fillRect(0, hz, W, H - hz);
    x.fillStyle = 'rgba(30,24,26,.9)'; x.fillRect(0, hz - .6, W, 1.6); // the line of the land, flat
    x.beginPath(); x.moveTo(vx - 1, hz); x.lineTo(vx + 1, hz); x.lineTo(vx + W*.32, H); x.lineTo(vx - W*.42, H); x.closePath(); x.fillStyle = vgrad(x, hz, H, [[0,'rgba(220,180,140,.5)'],[1,'rgba(110,90,74,.55)']]); x.fill(); // the road, pale, catching the sky
    for (let i=0;i<50;i++){ const yy = hz + 2 + Math.pow(hash(i, 11), 1.4)*(H - hz), px = hash(i, 12)*W, d = (yy - hz)/(H - hz); ell(x, px, yy, 1 + d*5, .4 + d, `rgba(20,16,18,${(.2 + d*.3).toFixed(2)})`); }
    // the uprights, both sides, to the end of the world; each a post and a bar and the shape on it, dark against the light
    for (let side of [-1, 1]) for (let i=40; i>=0; i--){ const k = i/40, [px0, py, z] = P(side, k), px = px0 + side*hash(i, side + 20)*W*.008*z, hh = H*.03*z, w = hh*.42, a = clamp(.2 + (1 - k)*.8, 0, 1); if (px < -W*.1 || px > W*1.1) continue;
      x.fillStyle = `rgba(16,12,16,${a.toFixed(2)})`; x.fillRect(px - hh*.03, py - hh, Math.max(.6, hh*.06), hh); x.fillRect(px - w, py - hh*.97, w*2, Math.max(.5, hh*.045)); // post, and the bar across its top
      if (hash(i, side + 30) > .08) { x.fillRect(px - w*.85, py - hh*.97, w*1.7, Math.max(.6, hh*.07)); x.beginPath(); x.moveTo(px - hh*.075, py - hh*.9); x.lineTo(px + hh*.075, py - hh*.9); x.lineTo(px + hh*.05, py - hh*.5); x.lineTo(px - hh*.05, py - hh*.5); x.closePath(); x.fill(); x.beginPath(); x.arc(px + hh*.035, py - hh*.86, hh*.05, 0, 7); x.fill(); } // a shape hung on it, head down: no more than that
      x.fillStyle = `rgba(200,170,150,${(.12*(1 - k)).toFixed(2)})`; x.fillRect(px - hh*.03, py - hh, Math.max(.4, hh*.015), hh); } // the dawn on one edge
    for (let i=0;i<6;i++) glow(x, W*(i/5), hz + H*.02, W*.3, '#c8b0a8', .14); // mist lying on the plain
  }), 0, 0, W, H);
  for (let i=0;i<5;i++){ const k = ((t*mo/40000 + i/5) % 1); ctx.globalAlpha = Math.sin(k*Math.PI)*.8; glow(ctx, lerp(-W*.2, W*1.2, k), hz + H*(.03 + i*.012), W*.22, '#d8c0b4', .14); } ctx.globalAlpha = 1; // the mist, moving
  b2Wheel(ctx, t*mo, vx - W*.1, hz - H*.2, W*.18, H*.08, 12, .55, 'rgba(14,10,16,.85)', 41); b2Wheel(ctx, t*mo, vx + W*.3, hz - H*.3, W*.1, H*.05, 6, .7, 'rgba(14,10,16,.8)', 43); // crows, low, everywhere along it
  for (let i=0;i<5;i++){ const side = i%2 ? 1 : -1, k = .05 + i*.05, [px0, py, z] = P(side, k), px = px0 + side*hash(Math.round(k*40), side + 20)*W*.008*z, hh = H*.03*z, w = hh*.42, sx = px + (hash(i, 51) > .5 ? .7 : -.7)*w, bob = mo ? Math.sin(t/(500 + i*90) + i) : 0; ell(ctx, sx, py - hh*.97 - 1.4 - bob*.2, 1.6, 1.1, 'rgba(12,8,12,.9)'); ell(ctx, sx + .9, py - hh*.97 - 2.6 - bob*.4, .7, .7, 'rgba(12,8,12,.9)'); } // a few sitting on the bars
  vign(ctx, W, H, .55, .5); };

/* Aren harbour: the city stepping down to the water, a mole with a light-tower, ships at anchor (the Empire's transports among
   them), lighters going between; the sea calm and the light easy. Everything the sortie will be about, and nothing of it */
function b7Ship(x, cx, wy, s, col, sail, oars){ x.fillStyle = col; x.beginPath(); x.moveTo(cx - 20*s, wy - 4*s); x.quadraticCurveTo(cx - 14*s, wy + 2*s, cx, wy + 2*s); x.quadraticCurveTo(cx + 16*s, wy + 2*s, cx + 22*s, wy - 6*s); x.lineTo(cx + 18*s, wy - 3*s); x.lineTo(cx - 17*s, wy - 2.6*s); x.closePath(); x.fill(); // the hull, high at the stern
  x.fillRect(cx - .5*s, wy - 34*s, 1*s, 32*s); x.fillRect(cx - 12*s, wy - 30*s, 24*s, .9*s); if (sail) { x.fillStyle = sail; x.fillRect(cx - 11*s, wy - 30*s, 22*s, 2*s); x.fillStyle = col; } // a mast, the yard, the sail furled on it
  x.fillRect(cx + 10*s, wy - 22*s, .7*s, 18*s); x.fillRect(cx + 6*s, wy - 19*s, 9*s, .6*s); // a mizzen
  x.strokeStyle = col; x.lineWidth = .4*s; x.beginPath(); x.moveTo(cx, wy - 34*s); x.lineTo(cx - 20*s, wy - 4*s); x.moveTo(cx, wy - 34*s); x.lineTo(cx + 22*s, wy - 6*s); x.stroke(); // stays
  if (oars) { x.lineWidth = .5*s; for (let i=0;i<9;i++){ x.beginPath(); x.moveTo(cx - 12*s + i*2.8*s, wy - 1*s); x.lineTo(cx - 13*s + i*2.8*s, wy + 3*s); x.stroke(); } } }
SCENEX.b2_harbour = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.44, wl = H*.56;
  const ships = [[.42, .02, .9, 1, 0], [.58, .0, .7, 0, 1], [.72, .03, 1.1, 1, 0], [.86, .01, .8, 0, 0], [.3, .06, 1.3, 0, 1], [.95, .05, 1.2, 1, 0]];
  ctx.drawImage(sceneLayer('b2:harbour', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#4a6a8e'],[.6,'#a8b8c0'],[1,'#e8dcc0']]); x.fillRect(0, 0, W, wl); // a clear sea sky, the afternoon on its way
    glow(x, W*.1, hz*.5, W*.45, '#ffe8c0', .45); for (let i=0;i<4;i++) cloud(x, W*(.3 + hash(i, 5)*.6), hz*(.2 + i*.14), W*(.2 + hash(i, 6)*.2), 2, '#ffffff', .14);
    x.fillStyle = 'rgba(110,130,150,.7)'; x.fillRect(0, hz - 1, W, 2); // the sea's horizon
    x.fillStyle = vgrad(x, hz, H, [[0,'#6a8ca0'],[.3,'#3a5a70'],[1,'#142430']]); x.fillRect(0, hz, W, H - hz); // the bay
    { const g = x.createLinearGradient(0, 0, W*.5, 0); g.addColorStop(0, 'rgba(255,230,190,.25)'); g.addColorStop(1, 'rgba(255,230,190,0)'); x.fillStyle = g; x.fillRect(0, hz, W, H - hz); }
    // the mole running out on the right, its light-tower at the end
    x.fillStyle = '#8a7a62'; x.fillRect(W*.62, wl - H*.02, W*.4, H*.025); x.fillStyle = 'rgba(255,236,200,.4)'; x.fillRect(W*.62, wl - H*.02, W*.4, 1); x.fillStyle = 'rgba(0,0,0,.3)'; x.fillRect(W*.62, wl + H*.005, W*.4, 2);
    { const lx = W*.66, ly = wl - H*.02; x.fillStyle = '#a8987a'; x.fillRect(lx - 5, ly - H*.2, 10, H*.2); x.fillRect(lx - 7, ly - H*.21, 14, 3); x.fillStyle = '#7a6a52'; x.fillRect(lx - 3.6, ly - H*.26, 7.2, H*.05); x.fillStyle = 'rgba(255,240,206,.45)'; x.fillRect(lx - 5, ly - H*.2, 2, H*.2); glow(x, lx, ly - H*.24, 14, '#ffd890', .5); }
    // the city on the left, stepping down to the quays: pale walls, flat roofs, domes, a tower or two
    for (let r=3;r>=0;r--){ const base = wl - H*.02 - r*H*.05, x1 = W*(.46 - r*.08); for (let px=-6; px<x1; ){ const w = 12 + hash(Math.round(px), r + 60)*20, hh = H*(.05 + hash(r + 61, Math.round(px))*.04), c = 176 + r*8 + Math.round(hash(Math.round(px), r + 62)*20), hz_ = r*.06; x.fillStyle = b2Mix(`#${[c, c - 16, c - 40].map(v => clamp(v, 0, 255).toString(16).padStart(2, '0')).join('')}`, '#b8c0c4', hz_*2); x.fillRect(px, base - hh, w, hh); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(px + w*.7, base - hh, w*.3, hh); x.fillStyle = 'rgba(40,30,24,.8)'; for (let k=0;k<2;k++) if (hash(Math.round(px), r + k + 63) > .4) x.fillRect(px + w*(.2 + k*.3), base - hh*.6, 1.6, 2.4);
      if (hash(Math.round(px), r + 64) > .78) { x.fillStyle = `rgb(${c + 10},${c - 2},${c - 24})`; x.beginPath(); x.ellipse(px + w/2, base - hh, w*.34, w*.36, 0, Math.PI, 0); x.fill(); } px += w - 1; } }
    x.fillStyle = '#7a6a54'; x.fillRect(0, wl - H*.03, W*.5, H*.04); x.fillStyle = 'rgba(255,236,200,.35)'; x.fillRect(0, wl - H*.03, W*.5, 1.2); // the quay
    // the ships at anchor, and their reflections
    ships.forEach(([u, dy, s, sail, oars]) => { const cx = W*u, wy = wl + H*dy; x.save(); x.globalAlpha = .25; x.translate(0, wy*2 + 2); x.scale(1, -1); b7Ship(x, cx, wy, s, '#1a2a34', null, false); x.restore(); });
  }), 0, 0, W, H);
  // the water moving: glints and long slow swells
  for (let i=0;i<70;i++){ const yy = wl + 4 + Math.pow(hash(i, 21), 1.2)*(H - wl - 4), px = (hash(i, 22)*W + t*mo/(60 + hash(i, 23)*40)) % (W + 40) - 20, d = (yy - wl)/(H - wl), tw = mo ? (Math.sin(t/300 + i*1.7) + 1)/2 : .5; ctx.fillStyle = `rgba(255,240,210,${((.15 + tw*.35)*(1 - px/W*.6)).toFixed(2)})`; ctx.fillRect(px, yy, 4 + d*16, .8 + d); }
  ships.forEach(([u, dy, s, sail, oars], i) => { const bob = mo ? Math.sin(t/900 + i*1.3)*.6 : 0, cx = W*u, wy = wl + H*dy + bob; ctx.save(); ctx.translate(cx, wy); ctx.rotate(mo ? Math.sin(t/1100 + i)*.012 : 0); ctx.translate(-cx, -wy); b7Ship(ctx, cx, wy, s, i === 4 ? '#2a221c' : '#3a3028', sail ? '#d8ccb0' : '#b8a888', oars); ctx.fillStyle = 'rgba(255,236,200,.3)'; ctx.fillRect(cx - 18*s, wy - 3*s, 16*s, .7*s); ctx.restore(); }); // the light along each hull
  for (let i=0;i<3;i++){ const k = ((t*mo/(30000 + i*9000) + i*.3) % 1), px = lerp(W*.1, W*.8, i%2 ? 1 - k : k), py = wl + H*(.12 + i*.06); ctx.fillStyle = '#2a221c'; ctx.beginPath(); ctx.ellipse(px, py, 6, 1.6, 0, 0, Math.PI); ctx.fill(); ctx.fillRect(px - 1, py - 4, 1.4, 4); ctx.fillStyle = '#b8a888'; ctx.fillRect(px - 3, py - 3, 3, 1.6); } // lighters, rowing between
  b2Wheel(ctx, t*mo, W*.6, hz - H*.12, W*.2, H*.06, 7, .6, 'rgba(240,236,228,.85)', 51); // gulls
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(0, H*.9, W*.42, H*.1); ctx.fillStyle = 'rgba(255,236,200,.35)'; ctx.fillRect(0, H*.9, W*.42, 1.2); ctx.fillStyle = 'rgba(0,0,0,.3)'; for (let i=0;i<6;i++) ctx.fillRect(i*W*.07, H*.9, 1, H*.1); ell(ctx, W*.38, H*.92, 3, 2, '#2a2018'); ctx.fillRect(W*.38 - 1.2, H*.9 - 6, 2.4, 6); // a near quay, a bollard
  const sq = marchOrder(sceneSquad()); sq.forEach((id, i) => drawFigure(ctx, id, W*.05 + i*Math.min(26, W*.32/sq.length), H*.96 - (i%2)*2, 1.9, t, {phase:i, dir:1}));
  vign(ctx, W, H, .45, .5); };

/* the end of the book: an empty barrow at evening, a dead tree, the crows going up off it and away, and Aren small on the horizon
   with its first lamps. Nothing moves but the birds and the grass */
SCENEX.b2_finale = (cv, t) => { const {ctx, W, H} = sceneFit(cv), mo = REDUCE() ? 0 : 1, hz = H*.62, bx = W*.38, by = H*.8;
  ctx.drawImage(sceneLayer('b2:finale', W, H, (x, W, H) => {
    x.fillStyle = vgrad(x, 0, hz, [[0,'#141a2e'],[.45,'#3a3a54'],[.78,'#9a6a64'],[1,'#d8a07a']]); x.fillRect(0, 0, W, hz + 2); // the last of the day
    glow(x, W*.1, hz, W*.42, '#ffb878', .34); glow(x, W*.1, hz, W*.08, '#ffe0b0', .3); for (let i=0;i<3;i++) cloud(x, W*(.3 + i*.25), hz*(.4 + i*.14), W*.3, 1.6, '#d89a84', .1);
    for (let i=0;i<40;i++){ x.fillStyle = `rgba(226,230,255,${(.12 + hash(i, 7)*.5).toFixed(2)})`; x.fillRect(W*.3 + hash(i, 8)*W*.7, hash(i, 9)*hz*.5, 1, 1); } x.fillStyle = '#f4f0e0'; x.fillRect(W*.74, hz*.16, 1.6, 1.6); glow(x, W*.74 + .8, hz*.16 + .8, 5, '#f4f0e0', .4); // one star bright
    // Aren on the horizon, small, its walls and domes dark and its lamps coming on; the sea a pale line by it
    for (let px=W*.6, i=0; px<W*.97; i++){ const w = 3 + hash(i, 96)*6, hh = H*(.01 + hash(i, 97)*.025); x.fillStyle = '#2a2632'; x.fillRect(px, hz - H*.03 - hh, w, hh + 1); if (hash(i, 98) > .7) { x.beginPath(); x.ellipse(px + w/2, hz - H*.03 - hh, w*.4, w*.45, 0, Math.PI, 0); x.fill(); } if (hash(i, 99) > .93) x.fillRect(px + w/2 - .7, hz - H*.03 - hh - H*.04, 1.4, H*.04); px += w; } // the city over its walls: domes, a minaret
    { const ax0 = W*.6, ax1 = W*.98, base = hz; x.fillStyle = '#26222c'; x.fillRect(ax0, base - H*.03, ax1 - ax0, H*.03); for (let px=ax0; px<ax1; px+=3) x.fillRect(px, base - H*.034, 1.6, H*.005); for (let i=0;i<6;i++){ const tx = ax0 + (i + .5)*(ax1 - ax0)/6; x.fillRect(tx - 2.4, base - H*.045, 4.8, H*.045); } for (let i=0;i<9;i++){ x.fillStyle = rgba('#ffb060', .5 + hash(i, 93)*.4); x.fillRect(ax0 + hash(i, 94)*(ax1 - ax0), base - H*(.01 + hash(i, 95)*.04), 1, 1.4); } glow(x, (ax0 + ax1)/2, base - H*.03, W*.2, '#ff9a50', .06); }
    x.fillStyle = 'rgba(200,180,170,.4)'; x.fillRect(W*.98, hz - 1, W*.02, 1.4); x.fillStyle = 'rgba(255,190,140,.3)'; x.fillRect(0, hz - .5, W*.4, 1); // the west along the land
    x.fillStyle = vgrad(x, hz, H, [[0,'#3a3236'],[.4,'#26201e'],[1,'#0e0c0c']]); x.fillRect(0, hz, W, H - hz);
    { const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(255,170,110,.14)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, hz, W, H - hz); } // the west, on the grass
    x.fillStyle = 'rgba(200,170,140,.14)'; x.beginPath(); x.moveTo(W*.78, hz); x.lineTo(W*.8, hz); x.lineTo(W*1.04, H); x.lineTo(W*.9, H); x.closePath(); x.fill(); // the Way, going home to the city, empty
    for (let i=0;i<3;i++){ const ox = W*(.1 + i*.22), oy = hz + 3 + i*2; b2Barrow(x, ox, oy, 10 + i*3, 2.6 + i*.6, '#2a2426', 'rgba(110,100,96,.5)', 'rgba(255,190,140,.12)'); }
    // the barrow, close: long and low, its kerb-stones, the grass on it pale; trodden, and nothing on it now
    b7Mound(x, bx, by, W*.3, H*.14, '#2e2628', 'rgba(255,190,140,.3)', 61, 'rgba(120,100,90,.55)');
    for (let i=0;i<40;i++){ const k = hash(i, 71), px = bx - W*.27 + k*W*.54, py = by - Math.pow(Math.sin(k*Math.PI*.98 + .03), .7)*H*.13 + hash(i, 72)*H*.03; x.strokeStyle = 'rgba(150,130,110,.35)'; x.lineWidth = .7; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 2, py - 4 - hash(i, 73)*4); x.stroke(); } // dry grass on it, the west on its tips
    for (let i=0;i<4;i++){ const px = bx + (hash(i, 75) - .5)*W*.24, py = by - H*.1 + Math.abs(hash(i, 75) - .5)*H*.12 - hash(i, 76)*H*.02; x.fillStyle = '#1a1414'; x.fillRect(px, py, 2.6 + hash(i, 77)*2, .8); } // a broken shaft or two in the grass, no more
    // the dead tree at its foot on the right, bare and grey
    { const tx = bx + W*.25, ty = by + 2; const br = (x0, y0, a, l, w, d) => { const x1 = x0 + Math.cos(a)*l, y1 = y0 + Math.sin(a)*l; x.strokeStyle = '#141012'; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); if (d > 0) { br(x1, y1, a - .45 - hash(d, 81)*.3, l*.7, w*.65, d - 1); br(x1, y1, a + .4 + hash(d, 82)*.3, l*.64, w*.6, d - 1); } }; br(tx, ty, -Math.PI/2 + .08, H*.16, 4, 5); x.lineCap = 'butt'; }
    x.fillStyle = vgrad(x, H*.86, H, [[0,'rgba(10,8,8,0)'],[1,'rgba(10,8,8,.7)']]); x.fillRect(0, H*.86, W, H*.14);
  }), 0, 0, W, H);
  // the grass close by, bending
  for (let i=0;i<60;i++){ const gx = hash(i, 61)*W, gy = H*(.9 + hash(i, 62)*.12), l = 6 + hash(i, 63)*12, sw = mo ? Math.sin(t/1100 + gx*.03)*2.4 : 0; ctx.strokeStyle = 'rgba(20,16,16,.9)'; ctx.lineWidth = 1 + hash(i, 64); ctx.beginPath(); ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx + sw*.4 + 1, gy - l*.6, gx + sw + 2, gy - l); ctx.stroke(); }
  // the crows: lifting off the barrow and going, one by one, over the city; a few still on the grass, one on the tree
  for (let i=0;i<16;i++){ const per = 14000 + hash(i, 101)*10000, k = ((t*mo/per + hash(i, 102)) % 1), sx = bx + (hash(i, 103) - .5)*W*.3, sy = by - H*.11, ex = W*(.62 + hash(i, 104)*.4), ey = hz - H*(.15 + hash(i, 105)*.3), px = lerp(sx, ex, k), py = lerp(sy, ey, Math.pow(k, .7)) - Math.sin(k*Math.PI)*H*.08, s = lerp(1, .4, k); ctx.globalAlpha = clamp(k*10, 0, 1)*clamp((1 - k)*5, 0, 1); b2Bird(ctx, px, py, s, Math.sin(t*mo/(140 + hash(i, 106)*60) + i), 'rgba(10,8,10,.9)'); } ctx.globalAlpha = 1;
  for (let i=0;i<3;i++){ const px = bx + (hash(i, 111) - .5)*W*.2, py = by - H*.12 + hash(i, 112)*H*.02, pk = mo ? (Math.sin(t/(700 + i*130) + i) > .7 ? 1 : 0) : 0; ell(ctx, px, py, 2.2, 1.4, '#0c0a0c'); ell(ctx, px + 1.8, py - 1.2 + pk, .9, .8, '#0c0a0c'); ctx.fillStyle = '#0c0a0c'; ctx.fillRect(px - 3.4, py - .2, 1.6, .7); } // walking, pecking
  { const px = bx + W*.25 + Math.cos(-Math.PI/2 + .08)*H*.16 - 6, py = by + 2 - H*.16 + 3; ell(ctx, px, py, 1.8, 1.2, '#0c0a0c'); ell(ctx, px + 1.6, py - 1.2, .8, .8, '#0c0a0c'); } // one on the tree, staying
  vign(ctx, W, H, .6, .5); };
