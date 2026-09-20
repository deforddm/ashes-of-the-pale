/* ============ drawing helpers ============ */
function shade(hex, amt){ const n = parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255;
  const f = v => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v*amt : (255-v)*amt)))); return `rgb(${f(r)},${f(g)},${f(b)})`; }
function rgba(hex, a){ const n = parseInt(hex.slice(1),16); return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`; }
function glow(ctx, x, y, r, col, a){ const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r*2, r*2); }
function poly(ctx, pts, fill, stroke){ ctx.beginPath(); pts.forEach((p,i) => i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1])); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); } }
function ell(ctx, x, y, rx, ry, fill, rot = 0){ ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, 7); ctx.fillStyle = fill; ctx.fill(); }

