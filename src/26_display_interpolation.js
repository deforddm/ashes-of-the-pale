/* ============ display interpolation ============ */
/* eases a drawn position toward its tile; time-based, so figures glide at the same pace at 30, 60 or 120 frames a second */
function dispOf(key, x, y){ const now = performance.now(); let d = G.disp[key]; if (!d) { d = G.disp[key] = {x, y, t:now}; }
  const dt = Math.min(100, Math.max(0, now - (d.t || now))); d.t = now;
  const k = REDUCE() ? 1 : 1 - Math.pow(.78, dt / 16.7); d.x = lerp(d.x, x, k); d.y = lerp(d.y, y, k); if (Math.abs(d.x-x) < .005) d.x = x; if (Math.abs(d.y-y) < .005) d.y = y; return d; }
