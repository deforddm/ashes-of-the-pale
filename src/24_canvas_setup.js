/* ============ canvas setup ============ */
function fitCanvas(cols, rows){
  const cv = $('#cv'); if (!cv) return;
  const w = cv.parentElement.clientWidth - 2;
  const T = Math.max(16, Math.floor(w / cols));
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = cols * T * dpr; cv.height = rows * T * dpr;
  cv.style.width = cols * T + 'px'; cv.style.height = rows * T + 'px';
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  const bgc = document.createElement('canvas'); bgc.width = cols*T*dpr; bgc.height = rows*T*dpr; const bctx = bgc.getContext('2d'); bctx.setTransform(dpr,0,0,dpr,0,0);
  const dec = document.createElement('canvas'); dec.width = cols*T*dpr; dec.height = rows*T*dpr; const dctx = dec.getContext('2d'); dctx.setTransform(dpr,0,0,dpr,0,0);
  G = {ctx, T, cv, cols, rows, bgc, bctx, dec, dctx, dpr, disp:G.disp || {}, sceneKind:G.sceneKind};
  cv.onpointerdown = e => {
    const r = cv.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) / T), y = Math.floor((e.clientY - r.top) / T);
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    if (view === 'explore') exploreTap(x, y); else if (view === 'battle') battleTap(x, y);
  };
  if (view === 'explore') { const a = AREA(); prerender(a.map, cols, rows, a.decor === 'camp_night' || a.decor === 'plain_night' || a.decor === 'city_night' || a.decor === 'cellar' || a.decor === 'roof_night' || a.decor === 'hills_night', false, a.decor); } else if (view === 'battle' && B) prerender(B.def.map, 8, 10, B.def.dark, !B.def.open && !B.def.style, B.def.style || (B.def.open ? 'plain' : '')); 
}
window.addEventListener('resize', () => { if (view === 'explore') fitCanvas(ACOLS(),AROWS()); else if (view === 'battle') fitCanvas(8,10); });
function shakeMap(){ if (!SET.shake || REDUCE()) return; const w = $('.cvwrap'); if (!w) return; w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake'); }
function redFlash(){ const r = $('#red'); r.classList.add('hurt'); setTimeout(() => r.classList.remove('hurt'), 250); }

