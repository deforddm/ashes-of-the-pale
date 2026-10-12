// Party line: a squadmate standing on the map as someone to talk to is not also drawn in the line behind the sergeant,
// and the line closes up (no empty place). Checks every area of both books with a full squad on hand.
// Usage: node tools/trail_test.mjs   (build first; exit 1 on a failure)
import { server, browser as launch, openGame } from './page.mjs';
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, {});
const res = await page.evaluate(() => {
  const bad = []; let checked = 0, hidden = 0;
  const areaBook = {};
  for (const [book, CHS] of [['gotm', BOOK === 'gotm' ? CHAPTERS : BOOKSNAP.gotm.ch], ['dg', BOOKSNAP.dg.ch]])
    for (const CH of Object.values(CHS)) (CH.areas || (CH.area ? [CH.area] : [])).forEach(a => { areaBook[a.id] = book; });
  const real = drawFigure;
  for (const [aid, book] of Object.entries(areaBook)) {
    const a = AREAS[aid]; if (!a) continue;
    if (book === 'dg') { S = newStateDG('Hask'); if (TPL.redblade) S.squad.push('redblade'); } else { S = newState('Hask'); S.squad = [...PORDER, 'ellis']; }
    migrate(S); S.area = aid; S.pos = {...a.start}; S.trail = [[-1,0],[1,0],[-1,1],[0,1],[1,1],[0,-1]].map(([dx,dy]) => ({x:a.start.x+dx, y:a.start.y+dy})); S.scene = 'explore';
    a.npcs.forEach(n => { n.show = n.show; });
    // make every squadmate NPC visible, whatever its gate
    const saved = a.npcs.map(n => n.show); const mates = new Set(S.squad.slice(1));
    a.npcs.forEach(n => { if (mates.has(n.kind)) n.show = () => true; });
    try { startExplore(); } catch (e) { bad.push(aid + ' open: ' + e.message); }
    const drawn = []; drawFigure = (ctx, kind, x, y, sc, t, o) => { drawn.push({kind, sc}); };
    try { drawExplore(0); } catch (e) { bad.push(aid + ': ' + e.message); }
    drawFigure = real; a.npcs.forEach((n, i) => { n.show = saved[i]; });
    const npcKinds = new Set(a.npcs.filter(n => mates.has(n.kind)).map(n => n.kind));
    const trail = drawn.filter(d => d.sc < T_SC() * .9).map(d => d.kind);
    checked++;
    for (const k of npcKinds) { hidden++; if (trail.includes(k)) bad.push(`${aid}: ${k} is on the map and in the line`); }
    const want = Math.min(S.trail.length, S.squad.slice(1).filter(k => !npcKinds.has(k)).length);
    if (trail.length !== want) bad.push(`${aid}: ${trail.length} in the line, wanted ${want}`);
  }
  return {bad, checked, hidden};
  function T_SC(){ return G.T / 32; }
});
await br.close(); srv.kill();
if (errors.length) console.log('page errors:', errors);
if (res.bad.length) { console.log('trail: FAIL\n  ' + res.bad.join('\n  ')); process.exit(1); }
console.log(`trail: ok (${res.checked} areas, ${res.hidden} squadmates on their maps kept out of the line)`);
