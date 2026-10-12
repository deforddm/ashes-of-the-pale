// v4.2 (Book Two, Chapter 3: The Ridge): the chapter registers and opens; a fight a squadmate sits out (def.away: Tangle in the
// ramp's banks) is fought without him and he is still in the squad after, and on a retry; the Earth's Hand (a Wickan trick) holds
// an enemy and its neighbours; the god-ridden does not fall; both keys reach the end screen with clean end lines.
// Usage: node tools/ridge_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true, mobile: true, touch: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = (f, a) => page.evaluate(f, a);
const fresh = () => ev(() => { S = newStateDG('Hask'); S.chapter = 3; S.lvl = 4; S.xp = LEVELS[3]; S.chain = {water:6, column:14}; S.f.b2_key = 'daughters'; S.f.b2_c2_key = 'water'; migrate(S); save(); });

// ---- the chapter is there ----
await fresh();
const reg = await ev(() => ({ch:!!CHAPTERS[3] && CHAPTERS[3].title, areas:['b2_east', 'b2_tunnelway', 'b2_patha', 'b2_shallows'].every(a => AREAS[a]), dlg:Object.keys(DLG).filter(k => /^b2_/.test(k)).length}));
ok(reg.ch === 'The Ridge', `Book Two's Chapter 3 is registered (${reg.ch})`);
ok(reg.areas, 'all four areas are registered');
await ev(() => { startChapter(3); }); await page.waitForTimeout(400);
ok(await ev(() => view === 'intro' && /P.atha/.test(document.body.innerText)), 'the chapter opens on its intro');

// ---- a fight Tangle sits out ----
await fresh();
const away = await ev(() => { S.f.b2_tangleAway = 1; startBattle('b2_bait', {}); const ids = B.units.filter(u => u.side === 'p' && !u.ally).map(u => u.id), snap = JSON.parse(B.snap).squad;
  return {ids, squad:S.squad.slice(), snap, dog:B.units.some(u => u.dog)}; });
ok(!away.ids.includes('tangle') && away.ids.includes('sathi'), `Tangle is not on the Shallows map (${away.ids})`);
ok(away.squad.includes('tangle') && away.snap.includes('tangle'), 'Tangle is still in the squad, and in the retry snapshot');
ok(away.dog, 'Hackle is in the fight beside Sathi');
const stage2 = await ev(() => { B.units.filter(u => u.side === 'e').forEach(u => u.hp = 0); B.over = true; stageBreak(); document.getElementById('bOn').click(); return B.units.filter(u => u.side === 'p' && !u.ally).map(u => u.id); });
ok(!stage2.includes('tangle') && stage2.length >= 4, `and not in the second area either (${stage2})`);
const raid = await ev(() => { startBattle('b2_raid', {}); return B.units.filter(u => u.side === 'p' && !u.ally).map(u => u.id); });
ok(raid.includes('tangle'), 'a fight without away keeps him (the raid)');

// ---- the Earth's Hand ----
await fresh();
const earth = await ev(() => { earnTrick('b2_earth', 'sathi'); startBattle('b2_raid', {}); const u = B.units.find(p => p.id === 'sathi'), t = foes()[0];
  u.x = t.x; u.y = t.y + 2; const others = foes().filter(f => f !== t); others.forEach((f, i) => { f.x = 7; f.y = 9 - i; });
  const near = foes().find(f => f !== t); near.x = t.x + 1; near.y = t.y;
  B.cur = u; const before = atkCalc(t, u).bonus;
  AB.t_b2_earth.run(u, t.x, t.y); const after = atkCalc(t, u).bonus;
  return {before, after, slow:!!t.slowTurn, nearHeld:near.earthUntil >= B.round, spirit:!!AB.t_b2_earth.spirit && !!TRICKS.b2_earth.spirit, pen:2 + lvT()}; }).catch(e => ({err:e.message}));
if (earth.err) {
  ok(false, 'Earth\'s Hand threw: ' + earth.err); }
else {
  ok(earth.slow && earth.nearHeld, 'the Earth\'s Hand slows the target and holds its neighbour');
  ok(earth.before - earth.after === earth.pen, `a held enemy is −${earth.pen} to hit (${earth.before} → ${earth.after})`);
  ok(earth.spirit, 'it is spirit-craft (never sputters)'); }

// ---- the god-ridden does not fall ----
await fresh();
const god = await ev(() => { startBattle('b2_raid', {stage:2}); const g = foes().find(f => f.immortal); hurt(g, 999); return {hp:g.hp, kind:g.kind, ob:B.def.objective && B.def.objective.type}; });
ok(god.hp === 1 && god.kind === 'warleader' && god.ob === 'survive', `the god-ridden holds at 1 health in a survive fight (${JSON.stringify(god)})`);

// ---- both keys reach the end ----
for (const key of ['bait', 'pull']) {
  await fresh();
  const end = await ev(k => { S.f.b2_c3_key = k; S.f.b2_shDone = 1; S.f.b2_ringDone = 1; S.f.b2_dom = 1; S.f.b2_raidDone = 1; S.f.b2_tangleAway = 1; S.f.b2_rampSatchel = 'took'; S.f.b2_ilharRidge = 1;
    chapterEnd(3, k); const C = CHAPTERS[3]; return {txt:document.body.innerText, ex:C.extras().join(' '), jr:C.journal().join(' ')}; }, key);
  ok(new RegExp(key === 'bait' ? 'The bait' : 'Pulled back').test(end.txt), `the ${key} end screen names its road`);
  ok(/Korbolo Dom/.test(end.ex) && !/undefined|NaN|\$\{/.test(end.ex + end.jr), `the ${key} end lines read clean`);
}

[...new Set(errors)].forEach(e => ok(false, 'page error: ' + e));
await br.close(); srv.kill();
process.exit(fail);
