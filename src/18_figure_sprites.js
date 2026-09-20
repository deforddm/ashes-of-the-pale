/* ============ figure sprites ============ */
/* draws a ~32px-tall figure centred at (cx, baseline cy). s = scale, dir = facing */
function drawFigure(ctx, kind, cx, cy, s, t, o = {}){
  const dir = o.dir || 1, bob = o.still ? 0 : Math.sin(t/420 + (o.phase||0)) * .6 * s;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(dir * s, s); ctx.translate(0, bob);
  ctx.globalAlpha = o.alpha ?? 1;
  const A = ctx.globalAlpha;
  // ground shadow
  ell(ctx, 0, 13, 9, 3, 'rgba(0,0,0,.5)');
  const armor = (c1, c2) => { const g = ctx.createLinearGradient(-7, -8, 7, 8); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; };
  const head = (c, r = 4.6, y = -11) => ell(ctx, 0, y, r, r*1.05, c);
  const legs = c => { ctx.fillStyle = c; ctx.fillRect(-4.5, 5, 3.4, 8); ctx.fillRect(1.1, 5, 3.4, 8); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-4.5, 11, 3.4, 2); ctx.fillRect(1.1, 11, 3.4, 2); };
  const torso = (c1, c2, w = 6.5) => poly(ctx, [[-w,-6],[w,-6],[w*.85,7],[-w*.85,7]], armor(c1, c2));
  const capHelm = c => { ctx.beginPath(); ctx.arc(0, -12, 5.2, Math.PI, 0); ctx.fillStyle = c; ctx.fill(); ctx.fillRect(-5.8, -12.4, 11.6, 1.4); };
  const fullHelm = c => { ctx.beginPath(); ctx.arc(0, -11.5, 5.4, Math.PI, 0); ctx.fillStyle = c; ctx.fill(); ctx.fillRect(-5.4, -11.5, 10.8, 5); ctx.fillStyle = '#050403'; ctx.fillRect(1, -10.8, 3.4, 1.6); };
  const hood = (c, dark = '#0a0908') => { poly(ctx, [[-6.5,-4],[-4,-16],[0,-18],[4,-16],[6.5,-4]], c); ell(ctx, 0.5, -10.5, 3.6, 3.9, dark); };
  const sword = (c = '#cfc8b8') => { ctx.strokeStyle = c; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(7, 2); ctx.lineTo(12, -10); ctx.stroke(); ctx.strokeStyle = '#6b4f2a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(6, 4); ctx.lineTo(7.6, .5); ctx.stroke(); };
  const shield = (c1, c2, r = 6, x = -7, y = 0) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = armor(c1, c2); ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = '#111'; ctx.stroke(); ell(ctx, x, y, 1.4, 1.4, '#6b6155'); };
  const eyes = (c = 'rgba(255,255,255,.55)') => { ctx.fillStyle = c; ctx.fillRect(1, -11.6, 1.5, 1); ctx.fillRect(-2.5, -11.6, 1.5, 1); };
  switch (kind) {
    case 'sgt': legs('#2a2320'); torso('#6b4a2e', '#3d2a19'); ctx.fillStyle = '#d6a24a'; ctx.fillRect(-6.5, -6, 13, 1.2); head('#a8826a'); capHelm('#5a5650'); shield('#4a3a2c', '#241b14', 4.8, -7.5, 1); sword(); break;
    case 'brisk': legs('#3a3a3c'); torso('#7c7a74', '#3c3a37', 7.5); head('#b08c76'); fullHelm('#8a8880'); shield('#6a6a66', '#2c2b29', 7.5, -6, 0); ctx.strokeStyle = '#8b7355'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(8, 12); ctx.lineTo(8, -20); ctx.stroke(); poly(ctx, [[8,-20],[6.6,-15],[9.4,-15]], '#cfc8b8'); break;
    case 'kettle': legs('#3b2a22'); torso('#8a4a2a', '#4a2818', 5.8); head('#c29a7e', 4.2); poly(ctx, [[-4.6,-12],[-3,-16.5],[3,-16.5],[4.6,-12],[3.5,-9]], '#b8482a'); ell(ctx, -5, 2, 3, 3.6, '#e07a45'); ctx.fillStyle = '#2a1e14'; ctx.fillRect(-5.8, -4, 1.4, 7);
      ctx.strokeStyle = '#4a3320'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(3, -1); ctx.lineTo(13, -3); ctx.stroke(); ctx.strokeStyle = '#8d8a86'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(9.5, -7); ctx.lineTo(9.5, 1); ctx.stroke(); break;
    case 'tuft': ctx.globalAlpha = A * .95; legs('#1e1b24'); poly(ctx, [[-6,-6],[6,-6],[8,12],[-8,12]], armor('#4a4358', '#1d1a24')); head('#c9b5a6', 3.9, -11.5); hood('#3a3446', '#14121a');
      for (let i=0;i<3;i++){ const a = t/500 + i*2.1; ctx.strokeStyle = `rgba(160,141,224,${.35 + Math.sin(a)*.2})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.cos(a)*6, 4 + Math.sin(a*1.3)*3); ctx.quadraticCurveTo(Math.cos(a+1)*10, -2, Math.cos(a+2)*7, -12 + Math.sin(a)*3); ctx.stroke(); } break;
    case 'ohl': legs('#2a2b25'); poly(ctx, [[-7,-6],[7,-6],[8.5,12],[-8.5,12]], armor('#5a6b58', '#2a332a')); head('#a8896f', 4.3, -10.5); hood('#4a5a48', '#1a1f19'); ctx.strokeStyle = '#6b4f2a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-8, 13); ctx.lineTo(-7, -14); ctx.stroke(); break;
    case 'deserter': legs('#2a2320'); torso('#5a4632', '#33251a'); ctx.fillStyle = '#7a2a22'; ctx.fillRect(2, -5, 3, 2.5); head('#9a7a62'); capHelm('#4a4640'); sword('#a8a296'); eyes('rgba(255,120,100,.5)'); break;
    case 'xbow': legs('#2a2320'); torso('#4f4634', '#2c2418'); head('#9a7a62'); ctx.fillStyle = '#3a2f22'; ctx.fillRect(-5, -16, 10, 4); ctx.strokeStyle = '#4a3320'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(2, -2); ctx.lineTo(12, -4); ctx.stroke(); ctx.strokeStyle = '#8d8a86'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(9, -8); ctx.lineTo(9, 0); ctx.stroke(); eyes('rgba(255,120,100,.5)'); break;
    case 'shade': { ctx.globalAlpha = A * .8; const w = Math.sin(t/300 + (o.phase||0)); poly(ctx, [[-6+w,-14],[0,-19],[6-w,-14],[8,0],[4,13],[0,8],[-4,13],[-8,0]], 'rgba(8,6,12,.95)');
      ctx.strokeStyle = 'rgba(154,134,224,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5,-13); ctx.quadraticCurveTo(0,-4,5,-13); ctx.stroke(); ctx.fillStyle = `rgba(201,187,255,${.7 + w*.3})`; ctx.fillRect(-3, -12, 2, 1.4); ctx.fillRect(1.5, -12, 2, 1.4); break; }
    case 'stone': { const p = (Math.sin(t/600) + 1) / 2; ell(ctx, 0, 13, 14, 4, 'rgba(0,0,0,.55)');
      poly(ctx, [[-12,12],[-14,-2],[-9,-14],[-3,-18],[5,-17],[12,-9],[14,3],[10,12]], armor('#3d3a3a', '#141212'));
      poly(ctx, [[-9,-6],[-6,-12],[-1,-9],[-3,-2]], '#2a2727'); poly(ctx, [[3,-13],[9,-8],[7,0],[1,-3]], '#2a2727');
      ctx.strokeStyle = `rgba(160,141,224,${.45 + p*.5})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-6,-14); ctx.lineTo(-3,-5); ctx.lineTo(1,2); ctx.lineTo(-2,10); ctx.moveTo(4,-16); ctx.lineTo(6,-8); ctx.lineTo(10,-3); ctx.stroke();
      ctx.fillStyle = `rgba(201,187,255,${.5 + p*.5})`; ctx.fillRect(-5, -9, 3, 1.6); ctx.fillRect(3, -10, 3, 1.6); break; }
    case 'tat': legs('#1e1b24'); poly(ctx, [[-7,-6],[7,-6],[9,12],[-9,12]], armor('#5a4a7a', '#251d33')); head('#d0b9a8', 4.4); ctx.fillStyle = '#3a2a22'; ctx.beginPath(); ctx.arc(0,-13,5,Math.PI*1.05,Math.PI*1.95); ctx.fill(); ctx.fillRect(-5,-13,2.5,8); ctx.fillRect(2.5,-13,2.5,8);
      ctx.fillStyle = '#e6dac2'; ctx.save(); ctx.translate(7, 0); ctx.rotate(-.3); ctx.fillRect(-2, -3, 4, 6); ctx.restore(); ctx.fillStyle = '#9a86e0'; ctx.fillRect(-7, -6, 14, 1); break;
    case 'pell': legs('#2a2320'); poly(ctx, [[-7,-6],[7,-6],[7.5,9],[-7.5,9]], armor('#6b5a3c', '#3a2f1e')); head('#b08c76'); ctx.fillStyle = '#3a3230'; ctx.beginPath(); ctx.arc(0,-13,5,Math.PI,0); ctx.fill(); ctx.fillStyle = '#c9b89a'; ctx.fillRect(-9, -2, 5, 6); ctx.fillStyle = '#2a1e14'; ctx.fillRect(-9, -2, 5, 1); break;
    case 'garrow': ell(ctx, 0, 11, 10, 3, 'rgba(0,0,0,.5)'); poly(ctx, [[-7,-1],[7,-1],[8,10],[-8,10]], armor('#4a4440', '#1e1b19')); ctx.fillStyle = '#1a1614'; for (let i=0;i<4;i++) ctx.fillRect(-5+i*3, -1+hash(i,3)*8, 1.5, 3); head('#9a8270', 4.2, -6); ctx.fillStyle = '#3a3630'; ctx.beginPath(); ctx.arc(-6, 6, 4, Math.PI, 0); ctx.fill(); break;
    case 'wj': legs('#2a2320'); torso('#4a4640', '#26231f', 6.8); ctx.fillStyle = '#8d8a86'; ctx.fillRect(-6.8, -6, 13.6, 1.2); head('#9a7a62'); ctx.fillStyle = '#5a5248'; ctx.fillRect(-4.8, -15.5, 9.6, 4.5); ctx.fillStyle = '#8a8478'; ctx.fillRect(-4.5, -9.2, 9, 2.4); /* grey beard */ sword('#b8b2a4'); break;
    case 'qb': legs('#1e1c24'); poly(ctx, [[-6,-6],[6,-6],[8,12],[-8,12]], armor('#3a2e4a', '#17121f')); head('#5a3a2a', 4.2, -11.5); ctx.fillStyle = '#12100a'; ctx.beginPath(); ctx.arc(0, -13, 4.6, Math.PI, 0); ctx.fill();
      for (let i=0;i<4;i++){ const a = t/700 + i*1.6; ctx.strokeStyle = `rgba(232,192,115,${.25 + Math.sin(a)*.15})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.cos(a)*7, 6 + Math.sin(a)*4); ctx.quadraticCurveTo(Math.cos(a+1.5)*11, -4, Math.cos(a+3)*6, -14); ctx.stroke(); } eyes('rgba(255,230,180,.7)'); break;
    case 'kalam': legs('#1a1816'); torso('#2e2a26', '#141210', 7.5); head('#4a3020', 4.8, -11); ctx.fillStyle = '#1a1614'; ctx.beginPath(); ctx.arc(0, -12.5, 5, Math.PI, 0); ctx.fill(); ctx.strokeStyle = '#cfc8b8'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(7, 3); ctx.lineTo(10, -3); ctx.moveTo(-7, 3); ctx.lineTo(-10, -3); ctx.stroke(); break;
    case 'paran': legs('#2a2320'); torso('#6b5636', '#3a2c1c'); ctx.fillStyle = '#c9a44a'; ctx.fillRect(-6.5, -6, 13, 1.4); ctx.fillRect(-1, -6, 2, 13); head('#c9a58a', 4.4); ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.arc(0, -12.5, 4.8, Math.PI, 0); ctx.fill(); sword('#e8d8a8'); break;
    case 'assassin': legs('#0e0d0c'); poly(ctx, [[-6.5,-6],[6.5,-6],[8,12],[-8,12]], armor('#2a2826', '#0d0c0b')); head('#1e1a18', 4); hood('#26231f', '#050404'); ctx.strokeStyle = '#a8a296'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(7, 2); ctx.lineTo(10, -4); ctx.moveTo(-7, 2); ctx.lineTo(-10, -4); ctx.stroke(); eyes('rgba(255,120,100,.5)'); break;
    case 'hound': { ell(ctx, 0, 13, 15, 4, 'rgba(0,0,0,.6)'); const p = Math.sin(t/240 + (o.phase||0)) * (o.still ? 0 : 1.2);
      poly(ctx, [[-14,2],[-10,-6],[2,-9],[10,-7],[14,-2],[12,6],[-12,7]], armor('#2a2622', '#0c0a09')); // body
      ctx.fillStyle = '#1a1614'; ctx.fillRect(-11, 5, 3.2, 8 + p); ctx.fillRect(-5, 6, 3, 7 - p); ctx.fillRect(4, 6, 3, 7 + p); ctx.fillRect(9, 5, 3.2, 8 - p); // legs
      poly(ctx, [[10,-7],[18,-12],[24,-8],[22,-2],[14,-2]], armor('#332d28', '#110f0d')); // head
      ctx.fillStyle = '#0a0808'; ctx.fillRect(19, -5, 5, 2); ctx.fillStyle = '#f0e6d0'; ctx.fillRect(20, -3, 1.2, 2); ctx.fillRect(22.5, -3, 1.2, 2); // jaw, teeth
      ctx.fillStyle = 'rgba(255,190,80,.9)'; ctx.fillRect(17, -10, 2, 1.6); glow(ctx, 18, -9.5, 6, '#ffb040', .35);
      ctx.strokeStyle = 'rgba(154,134,224,.25)'; ctx.lineWidth = 1; for (let i=0;i<3;i++){ const a = t/500 + i*2; ctx.beginPath(); ctx.moveTo(-12 + Math.cos(a)*3, -2 + Math.sin(a)*4); ctx.quadraticCurveTo(-18, -10 + Math.sin(a+1)*4, -20 + Math.cos(a)*3, -4); ctx.stroke(); } break; }
    case 'claw': legs('#141414'); poly(ctx, [[-7,-6],[7,-6],[9,13],[-9,13]], armor('#5c5a56', '#242322')); head('#2a2624', 4); hood('#5a5854', '#0a0908'); break;
  }
  ctx.restore();
}

