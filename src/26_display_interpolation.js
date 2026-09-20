/* ============ display interpolation ============ */
function dispOf(key, x, y){ let d = G.disp[key]; if (!d) { d = G.disp[key] = {x, y}; } const k = REDUCE() ? 1 : .22; d.x = lerp(d.x, x, k); d.y = lerp(d.y, y, k); if (Math.abs(d.x-x) < .005) d.x = x; if (Math.abs(d.y-y) < .005) d.y = y; return d; }

