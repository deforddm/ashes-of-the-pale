// v4.3 (Book Two, Chapter 4: The Day of Pure Blood): the chapter registers and opens; a squadmate put aboard the Silanda leaves the
// squad with their kit kept and comes back with it (b2Aboard / b2Ashore, for Chapter 7); the Vathar wound takes max health in every fight
// until Aren; the ropes fight records who came out of it worst (never the sergeant or the Red Blade); Stormy's Way In closes on a pikeman
// and breaks the shaft; the bridge fight sends Tangle off with Mincer and gives a short squad more sappers; both keys reach a clean end.
// Usage: node tools/vathar_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true, mobile: true, touch: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = (f, a) => page.evaluate(f, a);
const fresh = () => ev(() => { S = newStateDG('Hask'); S.chapter = 4; S.lvl = 6; S.xp = LEVELS[5]; S.chain = {water:6, column:20}; S.f.b2_key = 'daughters'; S.f.b2_c2_key = 'water'; S.f.b2_c3_key = 'pull'; migrate(S); save(); });

// ---- the chapter is there ----
await fresh();
const reg = await ev(() => ({ch:!!CHAPTERS[4] && CHAPTERS[4].title, areas:['b2_vathar_bank', 'b2_carriages', 'b2_vford', 'b2_farbank'].every(a => AREAS[a]), ford2:AREAS.b2_ford && AREAS.b2_ford.title, cross2:/Sekala|ford/i.test(JSON.stringify((DLG.b2_cross || (() => ({})))().sp || ''))}));
ok(reg.ch === 'The Day of Pure Blood', `Book Two's Chapter 4 is registered (${reg.ch})`);
ok(reg.areas, 'all four areas are registered');
ok(/Sekala/.test(reg.ford2 || ''), `Chapter 2's ford area is still Chapter 2's (${reg.ford2})`);
await ev(() => { startChapter(4); }); await page.waitForTimeout(400);
ok(await ev(() => view === 'intro' && /Vathar/.test(document.body.innerText)), 'the chapter opens on its intro');

// ---- the Silanda: aboard and ashore ----
await fresh();
const ship = await ev(() => { S.gear.haddat = {trinket:'b2_dipper'}; b2Aboard('haddat'); const gone = !S.squad.includes('haddat'), who = S.f.b2_silandaWho, kept = S.f.b2_silandaGear && S.f.b2_silandaGear.trinket;
  startBattle('b2_ropes', {}); const onMap = B.units.some(u => u.id === 'haddat'); B = null;
  const back = b2Ashore(); return {gone, who, kept, onMap, back, inSquad:S.squad.includes('haddat'), gear:S.gear.haddat && S.gear.haddat.trinket, again:b2Ashore()}; });
ok(ship.gone && ship.who === 'haddat' && !ship.onMap, 'a squadmate aboard the Silanda leaves the squad and the map');
ok(ship.kept === 'b2_dipper', 'their kit is kept for them');
ok(ship.back && ship.inSquad && ship.gear === 'b2_dipper' && !ship.again, 'b2Ashore brings them back once, kit and all');
const noSgt = await ev(() => { b2Aboard('sgt'); b2Aboard('nobody'); return S.squad.includes('sgt'); });
ok(noSgt, 'the sergeant never goes aboard');

// ---- the Vathar wound ----
await fresh();
const wound = await ev(() => { startBattle('b2_envoy', {}); const a = B.units.find(u => u.id === 'tangle').maxhp; B = null;
  S.f.b2_woundWho = 'tangle'; startBattle('b2_envoy', {}); const b = B.units.find(u => u.id === 'tangle').maxhp, logged = B.log.some(l => /Vathar/.test(l)); B = null;
  S.f.b2_woundHealed = 1; startBattle('b2_envoy', {}); const c = B.units.find(u => u.id === 'tangle').maxhp; B = null; return {a, b, c, logged, W:B2_WOUND}; });
ok(wound.a - wound.b === wound.W && wound.c === wound.a, `the wound costs ${wound.W} max health until it is healed in Aren (${wound.a} → ${wound.b} → ${wound.c})`);
ok(wound.logged, 'the fight log says so');

// ---- who came out of the ropes worst ----
await fresh();
const worst = await ev(() => { S.squad.push('redblade'); migrate(S); startBattle('b2_ropes', {stage:2});
  B.units.filter(u => u.side === 'p' && !u.ally).forEach(u => { u.hp = u.maxhp; }); B.units.find(u => u.id === 'sgt').hp = 1; B.units.find(u => u.id === 'redblade').hp = 1; B.units.find(u => u.id === 'marrow').hp = 3; B.round = 5;
  win(); return {hm:S.f.b2_hurtMost, rounds:S.f.b2_lastRounds, node:S.node}; });
ok(worst.hm === 'marrow', `the ropes record the worst hurt, never the sergeant or the Red Blade (${worst.hm})`);
ok(worst.rounds === 5 && worst.node === 'b2_after_ropes', 'and how long it took, and go on to the bank');
const pick = await ev(() => { talk('b2_silanda_who'); const t = [...document.querySelectorAll('#sheet .choice')].map(b => b.textContent); return t; });
ok(pick.some(t => /Marrow aboard/.test(t)) && pick.some(t => /Keep Marrow/.test(t)), `the Silanda choice defaults to the worst hurt (${pick.join(' | ')})`);

// ---- Stormy's Way In ----
await fresh();
const inside = await ev(() => { earnTrick('b2_inside', 'haddat'); startBattle('b2_ropes', {}); const u = B.units.find(p => p.id === 'haddat'), t = foes().find(f => f.kind === 'pikeman');
  foes().filter(f => f !== t).forEach((f, i) => { f.x = 7; f.y = 9 - i; }); t.x = 3; t.y = 3; u.x = 3; u.y = 6; B.cur = u;
  const r0 = t.rng, inList = AB.t_b2_inside.tiles(u).includes(t); t.hp = 999; t.maxhp = 999;
  AB.t_b2_inside.run(u, t.x, t.y); return {r0, r1:t.rng, reach:(t.sk || []).includes('reach'), d:cheb(u, t), inList, hasAb:mkParty('haddat', 0, 0).ab.includes('t_b2_inside')}; }).catch(e => ({err:e.message}));
if (inside.err) ok(false, 'Stormy\'s Way In threw: ' + inside.err);
else {
  ok(inside.hasAb && inside.inList, 'Haddat carries Stormy\'s Way In, and a pikeman 3 off is a target');
  ok(inside.d === 1, 'she closes to the pikeman');
  ok(inside.r0 === 2 && inside.r1 === 1 && !inside.reach, 'and the shaft is broken: no more reach'); }

// ---- the bridge: Tangle with Mincer, and a short squad ----
await fresh();
const br2 = await ev(() => { const a = (k) => { startBattle('b2_bridge', {}); const r = {ids:B.units.filter(u => u.side === 'p' && !u.ally).map(u => u.id), saps:B.units.filter(u => u.id === 'ally_b2_sapdis').length}; B = null; return r; };
  const whole = a(); S.f.b2_robe = 'mincer'; const robe = a(); S.f.b2_robe = 'squad'; b2Aboard('marrow'); const short = a();
  return {whole, robe, short, squad:S.squad.includes('tangle')}; });
ok(br2.whole.ids.includes('tangle') && br2.whole.saps === 1, `a whole squad holds the ford with one sapper beside it (${br2.whole.saps})`);
ok(!br2.robe.ids.includes('tangle') && br2.squad, 'Tangle with Mincer is off the map, and still in the squad');
ok(br2.short.saps === 2, `a squad one short gets two sappers (${br2.short.saps})`);

// ---- both keys reach the end ----
for (const key of ['silanda', 'keep']) {
  await fresh();
  const end = await ev(k => { S.f.b2_c4_key = k; if (k === 'silanda') b2Aboard('sathi'); else S.f.b2_woundWho = 'sathi';
    Object.assign(S.f, {b2_vathar:1, b2_sormoDead:1, b2_gesler:1, b2_bungle:1, b2_ropesDone:1, b2_dealKnown:1, b2_heldBack:1, b2_vatharLost:4, b2_ilharSeen:1, b2_orphans:'took', b2_marrowEnd:'on'});
    chapterEnd(4, k); const C = CHAPTERS[4]; return {txt:document.body.innerText, ex:C.extras().join(' '), jr:C.journal().join(' '), cap:C.endCap()}; }, key);
  ok(new RegExp(key === 'silanda' ? 'Aboard the Silanda' : 'Kept').test(end.txt), `the ${key} end screen names its road`);
  ok(/Sathi/.test(end.ex) && /Sormo/.test(end.jr) && !/undefined|NaN|\$\{|null/.test(end.ex + end.jr + end.cap), `the ${key} end lines read clean`);
}

[...new Set(errors)].forEach(e => ok(false, 'page error: ' + e));
await br.close(); srv.kill();
process.exit(fail);
