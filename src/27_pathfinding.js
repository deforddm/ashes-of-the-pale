/* ============ pathfinding ============ */
function reachMap(sx, sy, pass, maxD){
  const m = new Map([[K(sx,sy), {d:0, p:null, x:sx, y:sy}]]); const q = [[sx,sy]];
  while (q.length) { const [x,y] = q.shift(); const cur = m.get(K(x,y)); if (cur.d >= maxD) continue;
    for (const [dx,dy] of DIRS) { const nx = x+dx, ny = y+dy; if (m.has(K(nx,ny)) || !pass(nx,ny)) continue;
      m.set(K(nx,ny), {d:cur.d+1, p:K(x,y), x:nx, y:ny}); q.push([nx,ny]); } }
  return m;
}
function pathFrom(m, x, y){ const out = []; let k = K(x,y); while (k && m.get(k).p !== null) { const n = m.get(k); out.unshift({x:n.x, y:n.y}); k = n.p; } return out; }
function findPath(sx, sy, pass, goal){
  const m = new Map([[K(sx,sy), {d:0,p:null,x:sx,y:sy}]]); const q = [[sx,sy]];
  while (q.length) { const [x,y] = q.shift(); if (goal(x,y)) return pathFrom(m, x, y);
    for (const [dx,dy] of DIRS) { const nx=x+dx, ny=y+dy; if (m.has(K(nx,ny)) || !pass(nx,ny)) continue; m.set(K(nx,ny), {d:0,p:K(x,y),x:nx,y:ny}); q.push([nx,ny]); } }
  return null;
}

