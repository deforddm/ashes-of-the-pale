/* ============ drawing helpers ============ */
function shade(hex, amt){ const n = parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255;
  const f = v => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v*amt : (255-v)*amt)))); return `rgb(${f(r)},${f(g)},${f(b)})`; }
function rgba(hex, a){ const n = parseInt(hex.slice(1),16); return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`; }
function glow(ctx, x, y, r, col, a){ const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r*2, r*2); }
function poly(ctx, pts, fill, stroke){ ctx.beginPath(); pts.forEach((p,i) => i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1])); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); } }
function ell(ctx, x, y, rx, ry, fill, rot = 0){ ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, 7); ctx.fillStyle = fill; ctx.fill(); }
/* a Hound of Shadow, side on, facing +x, feet on y = 0, about 56 units nose to tail and 19 at the shoulder.
   o: {body, rim (hex), eye (hex), gait (-1..1 stride), eyeA (glow strength)} */
function drawHound(ctx, o = {}){
  const body = o.body || '#1c1916', rim = o.rim || '#9a86e0', g = o.gait || 0, dark = shade(body.length === 7 ? body : '#1c1916', -.45);
  const leg = (x0, y0, x1, y1, x2, y2, w, c) => { ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.lineWidth = w*.8; ctx.beginPath(); ctx.moveTo(x2 - 1, y2 - .3); ctx.lineTo(x2 + 1.6, y2 - .3); ctx.stroke(); };
  leg(10, -9, 12 - g*2, -4.5, 13 + g*3, -.6, 3, dark); leg(-15, -10, -19 + g*2, -4.5, -15 - g*3, -.6, 3.4, dark); // the far legs
  const g2 = ctx.createLinearGradient(0, -19, 0, -5); g2.addColorStop(0, shade(body.length === 7 ? body : '#1c1916', .18)); g2.addColorStop(1, dark); ctx.fillStyle = g2;
  ctx.beginPath(); [[-27,-5.5],[-23,-10.6],[-15,-14],[-6,-14.6],[3,-18.6],[9,-18.2],[13,-15.6],[16,-13.2],[19.5,-13.6],[24,-11.8],[28,-10],[28.4,-8.4],[24.6,-7],[20,-6.2],[15,-7.2],[11,-6],[6,-7.6],[-3,-9.2],[-9,-9.8],[-15,-9.2],[-19.5,-9.6],[-23,-8.6]].forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
  ctx.fillStyle = body; for (let i=0;i<5;i++){ const x = 1 + i*2.4; ctx.beginPath(); ctx.moveTo(x - 1.4, -17 - i*.3); ctx.lineTo(x + .2, -20.4 - (i%2)*.8); ctx.lineTo(x + 1.2, -17.2 - i*.2); ctx.fill(); } // hackles
  poly(ctx, [[17.2,-13.4],[18,-17.8],[19.8,-13.6]], body); // an ear, flat back
  leg(8, -10, 8.6 + g*1.5, -4.8, 9 - g*3, -.6, 3.4, body); leg(-13, -11, -17.5 - g*1.5, -5, -13.5 + g*3, -.6, 3.8, body); // the near legs
  ctx.strokeStyle = rgba(rim, .35); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-15, -14); ctx.lineTo(-6, -14.6); ctx.lineTo(3, -18.6); ctx.lineTo(9, -18.2); ctx.lineTo(13, -15.6); ctx.lineTo(19.5, -13.6); ctx.lineTo(28, -10); ctx.stroke(); // shadow-light along the back
  ctx.fillStyle = '#0a0606'; ctx.beginPath(); ctx.moveTo(21, -7.4); ctx.lineTo(28.2, -8.6); ctx.lineTo(27.6, -7.6); ctx.lineTo(22, -6.4); ctx.fill(); ctx.fillStyle = '#e8dcc4'; for (let i=0;i<4;i++) ctx.fillRect(22.4 + i*1.4, -8 + i*-.15, .6, 1.1); // the jaw, the teeth
  const ea = o.eyeA ?? 1; ctx.fillStyle = rgba(o.eye || '#ffb040', .95*ea); ctx.fillRect(21.6, -12.4, 2, 1.3); glow(ctx, 22.6, -11.8, 5, o.eye || '#ffb040', .45*ea);
}

