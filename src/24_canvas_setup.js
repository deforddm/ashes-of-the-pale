/* ============ canvas setup ============ */
/* The battle grid always fits the width. The explore map has two modes (Settings · Map, or the button under it):
   whole: the entire area fits the width, as it always did; close: bigger tiles filling the height the screen has,
   with a camera that follows the sergeant and can be dragged to look around. G.vw/G.vh are the canvas (viewport)
   size in CSS px, G.cam the camera's top-left in map px; in a battle the viewport is the whole map and the camera 0. */
const mapClose = () => SET.map !== 'whole';
function exploreRoom(wrap){ // the height left for the map once the HUD, the hint row and a few log lines have theirs
  const app = $('#app'), hint = $('.maprow'), keys = $('.hint.keys'), top = wrap.getBoundingClientRect().top + window.scrollY;
  const pb = parseFloat(getComputedStyle(app).paddingBottom) || 24, logMin = 3 * 1.45 * .9 * 16 * (SET.fs || 1);
  return Math.floor(window.innerHeight - top - (hint ? hint.offsetHeight : 20) - (keys && keys.offsetHeight ? keys.offsetHeight + 10 : 0) - logMin - 20 - pb - 2);
}
function fitCanvas(cols, rows){
  const cv = $('#cv'); if (!cv) return;
  const ex = view === 'explore', wrap = cv.parentElement; if (ex) { wrap.style.width = ''; wrap.style.marginInline = ''; }
  const w = wrap.clientWidth, hud = ex ? $('.hud') : null;
  let T = Math.max(16, Math.floor(w / cols)), vw = cols*T, vh = rows*T;
  if (ex && WIDE()) { // a wide screen: the whole map, as big as the left-hand column and the window's height allow, and the frame fitted to it
    const top = wrap.getBoundingClientRect().top + window.scrollY, pb = parseFloat(getComputedStyle($('#app')).paddingBottom) || 24;
    T = Math.max(16, Math.min(Math.floor((w - 2) / cols), Math.floor((window.innerHeight - top - pb - 4) / rows))); vw = cols*T; vh = rows*T;
    if (vw + 2 < w) { wrap.style.width = (vw + 2) + 'px'; wrap.style.marginInline = 'auto'; }
  } else if (ex && mapClose()) { // as tall as the room allows, at least as big as the whole view, and never so big that fewer than 8 columns show
    const room = exploreRoom(cv.parentElement), Tc = clamp(Math.floor(room / rows), T, Math.max(T, Math.min(46, Math.floor(w / 8))));
    if (Tc > T) { T = Tc; vw = Math.min(cols*T, w); vh = Math.min(rows*T, Math.max(room, T*8)); }
  }
  const dpr = Math.min(2, window.devicePixelRatio || 1), pan = ex && (vw < cols*T || vh < rows*T);
  const sized = () => { cv.width = vw * dpr; cv.height = vh * dpr; cv.style.width = vw + 'px'; cv.style.height = vh + 'px'; cv.classList.toggle('pan', pan); const ctx = cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); return ctx; };
  if (G.cv === cv && G.T === T && G.cols === cols && G.rows === rows && G.dpr === dpr && !(ex && G.azath !== !!(S && S.f && S.f.c6_azath))) {
    G.hudH = hud ? hud.offsetHeight : null;
    if (G.vw !== vw || G.vh !== vh) { G.ctx = sized(); G.vw = vw; G.vh = vh; G.pannable = pan; } // only the view changed: keep the prerendered map
    return;
  }
  const ctx = sized();
  const bgc = document.createElement('canvas'); bgc.width = cols*T*dpr; bgc.height = rows*T*dpr; const bctx = bgc.getContext('2d'); bctx.setTransform(dpr,0,0,dpr,0,0);
  const dec = document.createElement('canvas'); dec.width = cols*T*dpr; dec.height = rows*T*dpr; const dctx = dec.getContext('2d'); dctx.setTransform(dpr,0,0,dpr,0,0);
  G = {ctx, T, cv, cols, rows, bgc, bctx, dec, dctx, dpr, vw, vh, cam:{x:0, y:0, pan:false, snap:true}, pannable:pan, hudH:hud ? hud.offsetHeight : null, disp:G.disp || {}, sceneKind:G.sceneKind};
  const tile = e => { const r = cv.getBoundingClientRect(); return {x:Math.floor((e.clientX - r.left + G.cam.x) / T), y:Math.floor((e.clientY - r.top + G.cam.y) / T)}; };
  const tap = e => { const {x, y} = tile(e); if (x < 0 || y < 0 || x >= cols || y >= rows) return; if (view === 'explore') exploreTap(x, y); else if (view === 'battle') battleTap(x, y); };
  cv.onpointermove = cv.onpointerup = cv.onpointercancel = null;
  if (!ex) { cv.onpointerdown = tap; } // the battle: taps land at once, as before
  else { // explore: a tap walks, a drag looks around (the camera stays put until the next walk)
    let d = null;
    cv.onpointerdown = e => { d = {x:e.clientX, y:e.clientY, cx:G.cam.x, cy:G.cam.y, moved:false}; if (G.pannable) try { cv.setPointerCapture(e.pointerId); } catch(err) {} };
    cv.onpointerleave = () => { G.hover = null; };
    cv.onpointermove = e => { if (e.pointerType === 'mouse' && !d) { const p = tile(e); G.hover = p; const c = npcAt(p.x, p.y) ? 'pointer' : ''; if (cv.style.cursor !== c) cv.style.cursor = c; }
      if (!d || !G.pannable) return; const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) < 10) return; d.moved = true; G.cam.pan = true;
      G.cam.x = clamp(d.cx - dx, 0, cols*T - G.vw); G.cam.y = clamp(d.cy - dy, 0, rows*T - G.vh); };
    cv.onpointerup = e => { const t = d; d = null; if (t && !t.moved) tap(e); };
    cv.onpointercancel = () => { d = null; };
  }
  if (ex) { const a = AREA(); prerender(a.map, cols, rows, a.decor === 'camp_night' || a.decor === 'plain_night' || a.decor === 'city_night' || a.decor === 'cellar' || a.decor === 'roof_night' || a.decor === 'hills_night' || a.decor === 'estate_night' || a.decor === 'estate_terrace' || a.decor === 'estate_storm', false, a.decor); exploreParticles(); }
  else if (view === 'battle' && B) prerender(B.def.map, 8, 10, B.def.dark, !B.def.open && !B.def.style, B.def.style || (B.def.open ? 'plain' : ''));
}
/* the camera: follow the sergeant (his interpolated position from the last frame), eased; a drag holds it */
function camStep(t){
  const c = G.cam; if (!c || !G.pannable) { if (c) c.x = c.y = 0; return; }
  const T = G.T, d = G.disp.sgt || S.pos, mx = G.cols*T - G.vw, my = G.rows*T - G.vh;
  const tx = clamp(d.x*T + T/2 - G.vw/2, 0, mx), ty = clamp(d.y*T + T*.6 - G.vh/2, 0, my), dt = Math.min(100, t - (c.t || t)); c.t = t;
  if (c.pan) { c.x = clamp(c.x, 0, mx); c.y = clamp(c.y, 0, my); return; }
  if (c.snap || REDUCE()) { c.x = tx; c.y = ty; c.snap = false; return; }
  const k = 1 - Math.pow(.88, dt / 16.7); c.x = lerp(c.x, tx, k); c.y = lerp(c.y, ty, k); if (Math.abs(c.x - tx) < .3) c.x = tx; if (Math.abs(c.y - ty) < .3) c.y = ty;
}
window.addEventListener('resize', () => { if (view === 'explore') { fitCanvas(ACOLS(),AROWS()); if (typeof mapBtn === 'function') mapBtn(); } }); // the battle has its own resize handling in 31_battle.js
function shakeMap(){ if (!SET.shake || REDUCE()) return; const w = $('.cvwrap'); if (!w) return; w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake'); }
function redFlash(){ const r = $('#red'); r.classList.add('hurt'); setTimeout(() => r.classList.remove('hurt'), 250); }
