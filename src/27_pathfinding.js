/* ============ pathfinding ============ */
function reachMap(sx, sy, pass, maxD){
  const m = new Map([[K(sx,sy), {d:0, p:null, x:sx, y:sy}]]); const q = [[sx,sy]];
  while (q.length) { const [x,y] = q.shift(); const cur = m.get(K(x,y)); if (cur.d >= maxD) continue;
    for (const [dx,dy] of DIRS) { const nx = x+dx, ny = y+dy; if (m.has(K(nx,ny)) || !pass(nx,ny)) continue;
      m.set(K(nx,ny), {d:cur.d+1, p:K(x,y), x:nx, y:ny}); q.push([nx,ny]); } }
  return m;
}
/* like reachMap, but each tile is reached by the route that costs the least (leave(x,y) = the cost of stepping out of x,y,
   e.g. the free swings it gives away), then the fewest steps, within maxD steps. Each node carries its route in .path. */
function reachSafe(sx, sy, pass, maxD, leave){
  const start = {x:sx, y:sy, d:0, c:0, p:null, path:[]}, best = new Map([[K(sx,sy), start]]);
  let layer = [start];
  for (let d = 1; d <= maxD && layer.length; d++) {
    const next = new Map();
    for (const n of layer) { const lc = leave(n.x, n.y);
      for (const [dx,dy] of DIRS) { const x = n.x+dx, y = n.y+dy; if (!pass(x,y)) continue;
        const k = K(x,y), c = n.c + lc, o = next.get(k); if (!o || c < o.c) next.set(k, {x, y, d, c, p:K(n.x,n.y), path:[...n.path, {x,y}]}); } }
    layer = [];
    next.forEach((n, k) => { const b = best.get(k); if (b && b.c <= n.c) return; best.set(k, n); layer.push(n); }); // keep only routes that beat every shorter one on cost
  }
  return best;
}
function pathFrom(m, x, y){ const n0 = m.get(K(x,y)); if (n0 && n0.path) return n0.path.slice(); const out = []; let k = K(x,y); while (k && m.get(k).p !== null) { const n = m.get(k); out.unshift({x:n.x, y:n.y}); k = n.p; } return out; }
function findPath(sx, sy, pass, goal){
  const m = new Map([[K(sx,sy), {d:0,p:null,x:sx,y:sy}]]); const q = [[sx,sy]];
  while (q.length) { const [x,y] = q.shift(); if (goal(x,y)) return pathFrom(m, x, y);
    for (const [dx,dy] of DIRS) { const nx=x+dx, ny=y+dy; if (m.has(K(nx,ny)) || !pass(nx,ny)) continue; m.set(K(nx,ny), {d:0,p:K(x,y),x:nx,y:ny}); q.push([nx,ny]); } }
  return null;
}
