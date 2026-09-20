/* ============ portraits ============ */
function drawPortrait(ctx, id, W, H, t){
  const c = TPL[id], hue = c.col;
  ctx.clearRect(0,0,W,H);
  const bg = ctx.createLinearGradient(0,0,0,H); bg.addColorStop(0,'#0b0908'); bg.addColorStop(1,'#050404'); ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
  glow(ctx, W*.5, H*.42, W*.42, hue, .16 + Math.sin(t/900)*.03);
  // drifting ash
  ctx.fillStyle = 'rgba(200,190,175,.28)'; for (let i=0;i<24;i++){ const y = ((hash(i,1)*H) + t*(.01 + hash(i,2)*.02)) % H; ctx.fillRect(hash(i,3)*W + Math.sin(t/1500+i)*6, y, 1.5, 1.5); }
  ctx.save(); ctx.translate(W/2, H*.98); const s = H/120; ctx.scale(s, s);
  const skin = {sgt:'#a8826a', brisk:'#b08c76', kettle:'#c29a7e', tuft:'#c9b5a6', ohl:'#a8896f'}[id];
  const dark = ctx.createLinearGradient(-40, -90, 40, 0); dark.addColorStop(0, '#0d0b0a'); dark.addColorStop(1, '#040303');
  const lit = (c1, c2, x0=-30, x1=30) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, c1); g.addColorStop(.55, c2); g.addColorStop(1, '#070606'); return g; };
  // shoulders / torso
  const wide = id === 'brisk' ? 52 : id === 'sgt' ? 44 : id === 'ohl' ? 42 : 36;
  const torsoCol = {sgt:['#6b4a2e','#2e2014'], brisk:['#8a8880','#2c2b29'], kettle:['#8a4a2a','#33190f'], tuft:['#4a4358','#161320'], ohl:['#5a6b58','#1c231b']}[id];
  poly(ctx, [[-wide, 0],[-wide*.85, -40],[-14,-52],[14,-52],[wide*.85,-40],[wide,0]], lit(torsoCol[0], torsoCol[1], -wide, wide*.6));
  if (id === 'sgt') { ctx.fillStyle = '#d6a24a'; ctx.fillRect(-wide*.85, -41, wide*1.7, 2.5); poly(ctx, [[-12,-52],[12,-52],[14,-44],[-14,-44]], '#3d3a36'); }
  if (id === 'brisk') { for (let r=0;r<5;r++){ ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-wide*.85+r*2, -38+r*7); ctx.lineTo(wide*.85-r*2, -38+r*7); ctx.stroke(); } poly(ctx, [[-16,-52],[16,-52],[18,-42],[-18,-42]], '#5a5854'); }
  if (id === 'kettle') { ctx.strokeStyle = '#2a1e14'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-8,-50); ctx.lineTo(24,-6); ctx.stroke(); for (let i=0;i<7;i++) ell(ctx, -30+hash(i,5)*60, -30+hash(i,6)*30, 3+hash(i,7)*4, 2, 'rgba(0,0,0,.45)'); }
  if (id === 'tuft' || id === 'ohl') { ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 2; for (let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(i*9, -50); ctx.quadraticCurveTo(i*14, -25, i*18, 0); ctx.stroke(); } }
  // neck + head
  const hy = id === 'ohl' ? -68 : -72, hr = id === 'brisk' ? 17 : id === 'tuft' ? 14.5 : 16;
  poly(ctx, [[-8,-52],[8,-52],[7,-64],[-7,-64]], lit(shade(skin,-.35), shade(skin,-.6)));
  ell(ctx, 0, hy, hr, hr*1.18, lit(skin, shade(skin,-.45), -hr, hr*.5));
  // face: brow shadow, eyes as sockets, nose, mouth
  const band = ctx.createLinearGradient(0, hy-9, 0, hy+3); band.addColorStop(0, 'rgba(0,0,0,.55)'); band.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = band; ctx.fillRect(-hr, hy-9, hr*2, 12);
  ell(ctx, -6.5, hy-1.5, 5.2, 3.4, 'rgba(5,3,3,.7)'); ell(ctx, 6.5, hy-1.5, 5.2, 3.4, 'rgba(5,3,3,.78)');
  const eyeCol = id === 'tuft' ? '#c9bbff' : id === 'ohl' ? '#cfe8d8' : '#e6dac2';
  ctx.fillStyle = eyeCol; ctx.globalAlpha = .55; ctx.fillRect(-7.6, hy-1.6, 2.2, .9); ctx.fillRect(5.4, hy-1.6, 2.2, .9); ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-11, hy-5); ctx.lineTo(-3, hy-4.5); ctx.moveTo(3, hy-4.5); ctx.lineTo(11, hy-5); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ell(ctx, 0, hy+9, hr*.8, 5, 'rgba(0,0,0,.22)'); // jaw shadow
  ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-1, hy-1); ctx.lineTo(-3, hy+7); ctx.lineTo(1, hy+8); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,20,15,.7)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-6, hy+12); ctx.quadraticCurveTo(0, hy+ (id==='kettle'?14:12.5), 6, hy+12); ctx.stroke();
  // per-character head dressing
  if (id === 'sgt') { ctx.beginPath(); ctx.arc(0, hy-4, hr+2, Math.PI, 0); ctx.fillStyle = lit('#6b6760','#2a2825',-hr,hr); ctx.fill(); ctx.fillRect(-hr-3, hy-5, hr*2+6, 3); poly(ctx, [[-hr-2,hy-2],[-hr-1,hy+12],[-hr+3,hy+12],[-hr+2,hy-2]], '#3a3733'); poly(ctx, [[hr+2,hy-2],[hr+1,hy+12],[hr-3,hy+12],[hr-2,hy-2]], '#2a2825');
    ctx.strokeStyle = '#4a2420'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(7, hy+1); ctx.lineTo(11, hy+13); ctx.stroke(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ell(ctx, 0, hy+13, hr*.7, 5, 'rgba(0,0,0,.2)'); for (let i=0;i<40;i++) { ctx.fillStyle = 'rgba(30,20,15,.35)'; ctx.fillRect(-9 + hash(i,1)*18, hy+9 + hash(i,2)*8, .8, .8); } }
  if (id === 'brisk') { ctx.beginPath(); ctx.arc(0, hy-2, hr+3, Math.PI, 0); ctx.fillStyle = lit('#8a8880','#33312e',-hr,hr); ctx.fill(); ctx.fillRect(-hr-3, hy-2, hr*2+6, 14); ctx.fillStyle = '#050403'; ctx.fillRect(-11, hy-4, 8, 3.5); ctx.fillRect(3, hy-4, 8, 3.5); ctx.fillStyle = '#e6dac2'; ctx.globalAlpha = .75; ctx.fillRect(-9.5, hy-2.8, 4, 1); ctx.fillRect(4.8, hy-2.8, 4, 1); ctx.globalAlpha = 1; ctx.fillStyle = '#2a2825'; ctx.fillRect(-2, hy-2, 4, 14); }
  if (id === 'kettle') { poly(ctx, [[-hr-1,hy-6],[-hr+3,hy-20],[-2,hy-22],[hr-3,hy-19],[hr+1,hy-8],[hr-4,hy-12],[hr-9,hy-10],[-hr+6,hy-9]], lit('#b8482a','#4a1c10',-hr,hr)); ctx.fillStyle = 'rgba(20,14,10,.5)'; ell(ctx, 9, hy+6, 5, 3, 'rgba(20,14,10,.45)'); ell(ctx, -10, hy+9, 4, 2, 'rgba(20,14,10,.45)');
    ctx.strokeStyle = '#3a3230'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, hy-6, hr-.5, Math.PI*1.12, Math.PI*1.88); ctx.stroke(); ell(ctx, -6, hy-13, 3.8, 3.2, '#1a1e24'); ell(ctx, 6, hy-13, 3.8, 3.2, '#1a1e24'); ctx.strokeStyle = '#6b6155'; ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(-6, hy-13, 3.8, 0, 7); ctx.arc(6, hy-13, 3.8, 0, 7); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ell(ctx, -7, hy-14, 1.5, 1, 'rgba(255,255,255,.14)'); ell(ctx, 5, hy-14, 1.5, 1, 'rgba(255,255,255,.14)'); }
  if (id === 'tuft') { poly(ctx, [[-hr-14,-40],[-hr-4,hy-14],[-6,hy-24],[6,hy-24],[hr+4,hy-14],[hr+14,-40],[hr+6,-30],[-hr-6,-30]], lit('#3a3446','#0f0d14',-hr-14,hr)); ell(ctx, 0, hy-1, hr-1.5, hr*1.05, 'rgba(0,0,0,.35)'); ctx.fillStyle = '#c9bbff'; ctx.globalAlpha = .9; ctx.fillRect(-8.5, hy-2, 3.6, 1.4); ctx.fillRect(4.8, hy-2, 3.6, 1.4); ctx.globalAlpha = 1;
    for (let i=0;i<4;i++){ const a = t/700 + i*1.6; ctx.strokeStyle = `rgba(160,141,224,${.25 + Math.sin(a)*.15})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(Math.cos(a)*30, -20 + Math.sin(a)*10); ctx.quadraticCurveTo(Math.cos(a+1)*40, -60, Math.cos(a+2)*25, hy-30); ctx.stroke(); } }
  if (id === 'ohl') { poly(ctx, [[-hr-12,-40],[-hr-2,hy-12],[-4,hy-22],[4,hy-22],[hr+2,hy-12],[hr+12,-40],[hr+4,-30],[-hr-4,-30]], lit('#4a5a48','#141a14',-hr-12,hr)); ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 1; [4,8,12].forEach(d => { ctx.beginPath(); ctx.moveTo(-9, hy+d); ctx.quadraticCurveTo(0, hy+d+1.5, 9, hy+d); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(-9,hy-6); ctx.lineTo(-3,hy-7); ctx.moveTo(3,hy-7); ctx.lineTo(9,hy-6); ctx.stroke(); ctx.fillStyle = lit('#cfc8b8','#6a6a66',-8,8); poly(ctx, [[-9,hy+9],[9,hy+9],[6,hy+24],[0,hy+28],[-6,hy+24]], lit('#b8b0a0','#4a4a46',-9,9)); }
  // rim light
  ctx.globalCompositeOperation = 'lighter'; glow(ctx, -wide*.7, -45, 40, hue, .07); ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
  // frame vignette
  const v = ctx.createRadialGradient(W/2, H*.5, H*.3, W/2, H*.5, H*.85); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.75)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
}

