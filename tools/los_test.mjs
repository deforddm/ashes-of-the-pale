// v3.19: line of sight traced tile by tile; low cover ('t') and pits ('o', the roofs' drops, the quay's lake) block a step but not a shot;
// smoke on the line blocks a shot; a smoker hands the turn back at once (it used to wait for the watchdog); forced into a pit: a save to land prone, or fall.
// Usage: node tools/los_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const r = await page.evaluate(async () => { const wait = ms => new Promise(r => setTimeout(r, ms)); const out = {};
  // every unit, every wave, every party start stands on ground it is allowed to stand on
  out.badStarts = []; Object.entries(BATTLES).forEach(([id, d0]) => [d0, d0.stage2 ? Object.assign({}, d0, d0.stage2) : null].filter(Boolean).forEach(d => {
    const at = (x, y) => (d.map[y] || '')[x]; const chk = (x, y, who) => { if ('#to'.includes(at(x, y))) out.badStarts.push(`${id} ${who} ${x},${y} '${at(x, y)}'`); };
    (d.foes || []).forEach(f => chk(f[1], f[2], f[0])); (d.waves || []).forEach(w => w.foes.forEach(f => chk(f[1], f[2], 'wave ' + f[0])));
    (d.party || [[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]]).forEach(p => chk(p[0], p[1], 'party')); }));

  S = newState('Hask'); S.chapter = 5; S.lvl = 5; S.squad = ['sgt','brisk','kettle','tuft','ohl']; S.picksDue = []; S.inv.smoker = 2; S.f.gotSmokers = 1; migrate(S); save();
  startBattle('c5_dig', {}); await wait(700);
  for (let i = 0; i < 60 && !(B.cur && B.cur.side === 'p' && !B.busy); i++) await wait(100);
  out.digPit = pitAt(3, 5) && pitAt(4, 5) && wall(3, 5) && !solid(3, 5);
  // sight on a test map
  const realDef = B.def;
  B.def = Object.assign({}, realDef, {style:'city', map:['........','........','...#....','........','...t....','........','...o....','........','........','........']});
  const P = (x, y) => ({x, y});
  out.wallBlocks = !sees(P(1, 2), P(5, 2)); out.tableClear = sees(P(1, 4), P(5, 4)); out.pitClear = sees(P(1, 6), P(5, 6));
  out.leanRound = !sees(P(2, 1), P(4, 3)) && sees(P(1, 1), P(5, 2)); // straight through the pillar's corner, no; a line past its edge, yes
  out.tableBlocksStep = !free(3, 4) && !free(3, 6) && !free(3, 2);
  out.coverOnlyNear = coverFor(P(0, 4), P(4, 4)) && !coverFor(P(0, 4), P(6, 4));
  B.def = Object.assign({}, realDef, {style:'roof', map:['........','........','...#....','........','........','........','........','........','........','........']});
  out.roofDropClear = sees(P(1, 2), P(5, 2)) && pitAt(3, 2) && wall(3, 2);
  B.def = Object.assign({}, realDef, {style:'city', map:['........','........','........','........','........','........','........','........','........','........']});
  // smoke in the middle of the line, not at either end, still stops the shot
  B.smoke = [{x:3, y:4, until:B.round + 2, g:'t'}];
  out.smokeBetween = !canShoot(P(1, 4), P(5, 4)) && canShoot(P(1, 2), P(5, 2)) && canShoot(P(2, 4), P(3, 4));
  B.smoke = [];

  // the smoker: the turn comes straight back, one cloud
  const k = B.units.find(u => u.id === 'kettle'); B.units.filter(u => u.side === 'e').forEach((u, i) => { u.x = i; u.y = 0; });
  B.cur = k; B.acted = false; B.moved = true; B.mvLeft = 0; B.busy = false; k.x = 3; k.y = 8;
  const turn0 = B.turn; const t0 = performance.now(); useAb('smoker', 3, 5);
  for (let i = 0; i < 40 && B.turn === turn0 && B.busy; i++) await wait(50);
  out.smokeBack = Math.round(performance.now() - t0); out.smokeTiles = B.smoke.length; out.smokeGroups = new Set(B.smoke.map(s => s.g)).size;

  // forced into a pit: freeze the fight first
  B.def = realDef; await wait(500); const realEnd = endTurn; window.endTurn = () => {}; B.over = true; await wait(300);
  const g = B.units.find(u => u.id === 'sgt'), e = foes()[0]; const realAtk = attack; window.attack = () => ({hit:true, dmg:1});
  e.boss = false; e.immortal = false; B.units.filter(u => u !== g && u !== e).forEach((u, i) => { u.x = i; u.y = 9; });
  // made the save: prone at the lip, still in the fight
  for (let n = 0; n < 6; n++) { g.x = 3; g.y = 3; e.x = 3; e.y = 4; e.hp = e.maxhp = 40; e.prone = false; e.atk = 60; g.cdShove = -1; await AB.shove.run(g, e.x, e.y); if (e.prone) break; }
  out.saved = {x:e.x, y:e.y, hp:e.hp, prone:!!e.prone};
  // failed: over, out of the fight
  B.log = []; for (let n = 0; n < 6; n++) { g.x = 3; g.y = 3; e.x = 3; e.y = 4; e.hp = e.maxhp = 40; e.prone = false; e.fell = false; e.atk = -40; g.cdShove = -1; await AB.shove.run(g, e.x, e.y); if (e.hp <= 0) break; }
  out.fell = {hp:e.hp, fell:!!e.fell, log:B.log.join(' ').includes('robbers')};
  // the hook drags across the pit: the far side of the shaft, Vell on the near side
  const v = Object.assign(mkParty('sgt', 3, 7), {id:'vell', name:'Vell'}); B.units.push(v);
  const e2 = foes()[0] || e; e2.hp = e2.maxhp = 40; e2.fell = false; e2.deadAt = null; e2.x = 3; e2.y = 3; e2.atk = -40; v.cdHook = -1; v.x = 3; v.y = 7;
  for (let n = 0; n < 6 && e2.hp > 0; n++) { e2.x = 3; e2.y = 3; v.cdHook = -1; await AB.grapple.run(v, e2.x, e2.y); }
  out.hooked = {hp:e2.hp, fell:!!e2.fell};
  // the squad over the edge: hurt, prone, back up
  e.hp = 40; e.fell = false; e.atk = 5; e.x = 3; e.y = 3; g.x = 3; g.y = 4; g.hp = g.maxhp = 60; g.prone = false;
  for (let n = 0; n < 30 && g.hp === 60; n++) { g.x = 3; g.y = 4; g.prone = false; await overEdge(g, {x:3, y:5}, 'shoved'); if (g.hp === 60) g.hp = 60; }
  out.squadFell = {hpLost:60 - g.hp, prone:!!g.prone, x:g.x, y:g.y};
  window.attack = realAtk; window.endTurn = realEnd; B.over = false;
  // the new ground draws
  for (const id of ['terrace_knives', 'last_accounting', 'cutpurses', 'guild_roofs']) { startBattle(id, {}); await wait(400); }
  return out; });
console.log(JSON.stringify(r));
ok(!r.badStarts.length, 'no unit starts on a wall, a table or a pit' + (r.badStarts.length ? ': ' + r.badStarts.join('; ') : ''));
ok(r.digPit, 'the dig has its shaft: a pit you can see across and cannot walk over');
ok(r.wallBlocks && r.tableClear && r.pitClear, `a pillar blocks sight; a table and a pit do not (${r.wallBlocks}, ${r.tableClear}, ${r.pitClear})`);
ok(r.leanRound, 'a line past a pillar\'s edge sees; straight through it doesn\'t');
ok(r.tableBlocksStep, 'tables, pits and pillars all block a step');
ok(r.coverOnlyNear, 'a table right in front of the target is cover; one far from it isn\'t');
ok(r.roofDropClear, 'on the roofs the drop is a pit: seen across, not walked over');
ok(r.smokeBetween, 'smoke between shooter and target stops the shot; beside the line or point-blank it doesn\'t');
ok(r.smokeBack < 1500 && r.smokeTiles === 9 && r.smokeGroups === 1, `a smoker hands the turn back at once (${r.smokeBack} ms) and makes one cloud (${r.smokeTiles} tiles, ${r.smokeGroups} group)`);
ok(r.saved.prone && r.saved.hp > 0 && r.saved.y === 4, `driven at the shaft and saving: prone at the lip (${JSON.stringify(r.saved)})`);
ok(r.fell.hp === 0 && r.fell.fell && r.fell.log, `driven at the shaft and failing: over, out of the fight (${JSON.stringify(r.fell)})`);
ok(r.hooked.hp === 0 && r.hooked.fell, `hooked across the shaft and failing: in it (${JSON.stringify(r.hooked)})`);
ok(r.squadFell.hpLost >= 4 && r.squadFell.hpLost <= 14 && r.squadFell.prone, `a squadmate over the edge climbs back hurt and prone (${JSON.stringify(r.squadFell)})`);
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await br.close(); srv.kill();
process.exit(fail || errors.length ? 1 : 0);
