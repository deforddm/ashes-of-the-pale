/* ============ title backdrop: Moon's Spawn over the Pale ============ */
let titleAnim = null;
function startTitleBackdrop(cv){
  const ctx = cv.getContext('2d'); const dpr = Math.min(2, window.devicePixelRatio || 1);
  const fit = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }; fit(); window.addEventListener('resize', fit);
  const towers = Array.from({length:26}, (_, i) => ({x: i/26 + hash(i,1)*.02, w: .025 + hash(i,2)*.04, h: .06 + hash(i,3)*.16, broken: hash(i,4) > .5, lit: hash(i,5) > .7}));
  const ashp = Array.from({length:160}, (_, i) => ({x: Math.random(), y: Math.random(), v: .00008 + Math.random()*.00025, w: Math.random()*7, s: .8 + Math.random()*1.6}));
  const embers = Array.from({length:40}, (_, i) => ({x: .3 + Math.random()*.5, y: Math.random(), v: .0002 + Math.random()*.0004, w: Math.random()*7}));
  titleAnim = () => {
    const W = innerWidth, H = innerHeight, t = performance.now();
    const sky = ctx.createLinearGradient(0,0,0,H); sky.addColorStop(0,'#050408'); sky.addColorStop(.55,'#120e14'); sky.addColorStop(.8,'#2a1810'); sky.addColorStop(1,'#0a0605'); ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = 'rgba(230,220,200,.5)'; for (let i=0;i<40;i++) ctx.fillRect(hash(i,8)*W, hash(i,9)*H*.5, 1, 1);
    // fires on the horizon
    const fl = .9 + Math.sin(t/130)*.06 + Math.sin(t/53)*.04; glow(ctx, W*.62, H*.74, W*.55, '#ff7a2a', .28*fl); glow(ctx, W*.25, H*.76, W*.35, '#c94a20', .18*fl);
    // Moon's Spawn
    const mx = W*.3 + Math.sin(t/9000)*8, my = H*.28 + Math.sin(t/6000)*6, ms = Math.min(W, H)*.36;
    glow(ctx, mx, my, ms*1.4, '#9a86e0', .08);
    ctx.save(); ctx.translate(mx, my); const pts = [[-1,.1],[-.85,-.35],[-.55,-.7],[-.2,-.95],[.25,-.85],[.6,-.6],[.95,-.2],[1,.25],[.7,.65],[.3,.95],[-.15,1],[-.6,.75],[-.9,.45]].map(([x,y]) => [x*ms, y*ms]);
    const mg = ctx.createRadialGradient(-ms*.3, -ms*.3, ms*.1, 0, 0, ms); mg.addColorStop(0, '#1a1622'); mg.addColorStop(1, '#040305'); poly(ctx, pts, mg);
    ctx.strokeStyle = 'rgba(154,134,224,.25)'; ctx.lineWidth = 1; ctx.beginPath(); pts.forEach((p,i) => i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1])); ctx.closePath(); ctx.stroke();
    for (let i=0;i<14;i++){ const a = hash(i,11)*Math.PI*2, r = hash(i,12)*ms*.8; const p = (Math.sin(t/900 + i*1.7) + 1)/2; ctx.fillStyle = `rgba(201,187,255,${.15 + p*.45})`; ctx.fillRect(Math.cos(a)*r, Math.sin(a)*r, 1.6, 1.6); }
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; for (let i=0;i<9;i++){ ctx.beginPath(); ctx.moveTo(hash(i,13)*ms*1.6 - ms*.8, -ms*.6); ctx.lineTo(hash(i,14)*ms*1.2 - ms*.6, ms*.7); ctx.stroke(); }
    ctx.restore();
    // smoke columns
    for (let i=0;i<5;i++){ for (let j=0;j<8;j++){ const yy = H*.78 - j*H*.05 - ((t/40 + i*90) % (H*.05)); const xx = W*(.15 + i*.18) + Math.sin(t/2500 + j + i)*(10 + j*4); ell(ctx, xx, yy, 18 + j*7, 10 + j*3, `rgba(40,32,30,${.14 - j*.014})`); } }
    // skyline
    towers.forEach(tw => { const x = tw.x*W, w = tw.w*W, h = tw.h*H, y = H*.8 - h; ctx.fillStyle = '#070505'; ctx.fillRect(x, y, w, h + H*.2);
      if (tw.broken) poly(ctx, [[x, y],[x + w*.3, y - h*.15],[x + w*.55, y + h*.05],[x + w, y - h*.08],[x + w, y + 2],[x, y + 2]], '#070505');
      if (tw.lit) { const f2 = .5 + Math.sin(t/170 + tw.x*40)*.3; ctx.fillStyle = `rgba(255,140,50,${f2})`; ctx.fillRect(x + w*.4, y + h*.4, w*.2, h*.12); } });
    ctx.fillStyle = '#050403'; ctx.fillRect(0, H*.8, W, H*.2);
    // ground fog
    for (let i=0;i<6;i++) ell(ctx, (hash(i,20)*1.4 - .2)*W + Math.sin(t/4000 + i)*40, H*.82 + hash(i,21)*H*.1, W*.3, H*.03, 'rgba(60,50,48,.12)');
    // embers rising, ash falling
    embers.forEach(e => { e.y -= e.v; if (e.y < .5) e.y = 1; const a = (e.y - .5)*2; ctx.fillStyle = `rgba(255,${120 + R(60)},40,${a*.8})`; ctx.fillRect(e.x*W + Math.sin(t/600 + e.w)*6, e.y*H, 2, 2); });
    ctx.fillStyle = 'rgba(200,190,175,.32)'; ashp.forEach(a => { a.y += a.v; if (a.y > 1) a.y = -.02; ctx.fillRect((a.x + Math.sin(t/1800 + a.w)*.012)*W, a.y*H, a.s, a.s); });
    const v = ctx.createRadialGradient(W/2, H*.5, H*.2, W/2, H*.5, H*.9); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.7)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
  };
}

