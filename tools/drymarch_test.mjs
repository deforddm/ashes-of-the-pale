// v4.4 (Book Two, Chapter 5: The Dry March): the chapter registers and opens; heat (47) costs a squadmate in heavy armour a step a turn
// from round 4 of a midday fight (round 2 on its second ground) unless they drank, and never in the forest's shade; a dry squad starts
// parched and cannot drink; the Tower's Breath rimes enemies and cools squadmates out of the heat; Sathi riding with the Weasels keeps
// her and Hackle off the herd fight; both keys do what they say and reach a clean end.
// Usage: node tools/drymarch_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true, mobile: true, touch: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = (f, a) => page.evaluate(f, a);
const fresh = () => ev(() => { S = newStateDG('Hask'); S.chapter = 5; S.lvl = 6; S.xp = LEVELS[5]; S.chain = {water:6, column:20}; S.f.b2_key = 'daughters'; S.f.b2_c4_key = 'keep'; migrate(S); save(); });

// ---- the chapter is there ----
await fresh();
const reg = await ev(() => ({ch:!!CHAPTERS[5] && CHAPTERS[5].title, areas:['b2_vforest', 'b2_jtower', 'b2_nenoth', 'b2_karpcamp'].every(a => AREAS[a]), fights:['b2_mounds', 'b2_herd', 'b2_dryraid'].every(b => BATTLES[b]),
  vathar:AREAS.b2_vathar_bank && AREAS.b2_vathar_bank.title}));
ok(reg.ch === 'The Dry March', `Book Two's Chapter 5 is registered (${reg.ch})`);
ok(reg.areas && reg.fights, 'all four areas and three fights are registered');
ok(/Vathar/.test(reg.vathar || ''), 'Chapter 4\'s areas are still Chapter 4\'s');
await ev(() => { startChapter(5); }); await page.waitForTimeout(400);
ok(await ev(() => view === 'intro' && /Vathar Forest/.test(document.body.innerText)), 'the chapter opens on its intro');

// ---- heat ----
await fresh();
const heat = await ev(() => { const step = (id, round, opt = {}) => { startBattle(id, opt); const u = B.units.find(p => p.id === 'haddat'); B.round = round; B.cur = u; B.mvLeft = u.mv; squadTurnStart(u); const r = {left:B.mvLeft, mv:u.mv}; B = null; return r; };
  const r3 = step('b2_herd', 3), r4 = step('b2_herd', 4), s2 = step('b2_herd', 2, {stage:2}), shade = step('b2_mounds', 5);
  startBattle('b2_herd', {}); const sathi = B.units.find(p => p.id === 'sathi'); B.round = 5; B.cur = sathi; B.mvLeft = sathi.mv; squadTurnStart(sathi); const light = B.mvLeft === sathi.mv; const logged = B.log.some(l => /Midday/.test(l)); B = null;
  const w0 = S.chain.water, drank = b2Drink('b2_herd'), w1 = S.chain.water; const after = step('b2_herd', 6);
  return {r3, r4, s2, shade, light, logged, drank, cost:w0 - w1, after}; });
ok(heat.logged, 'a midday fight says so in the log');
ok(heat.r3.left === heat.r3.mv && heat.r4.left === heat.r4.mv - 1, `Haddat's mail costs a step from round 4, not before (${heat.r3.left}/${heat.r3.mv} → ${heat.r4.left}/${heat.r4.mv})`);
ok(heat.s2.left === heat.s2.mv - 1, 'on the second ground it starts at round 2');
ok(heat.shade.left === heat.shade.mv, 'no heat under the trees');
ok(heat.light, 'Sathi in hide does not feel it');
ok(heat.drank && heat.cost === 1 && heat.after.left === heat.after.mv, 'a skin before the fight keeps the step');

// ---- a dry squad ----
await fresh();
const dry = await ev(() => { startBattle('b2_mounds', {}); const shade = B.units.filter(u => u.side === 'p' && !u.ally).every(u => u.hp === u.maxhp || u.vatharWound); B = null;
  S.f.b2_dry = 1; const could = b2Drink('b2_dryraid'); startBattle('b2_dryraid', {}); const sq = B.units.filter(u => u.side === 'p' && !u.ally); const parched = sq.every(u => u.parched && u.hp === u.maxhp - 3); const said = B.log.some(l => /went to the column/.test(l)); B = null;
  return {shade, could, parched, said, water:S.chain.water}; });
ok(!dry.could && dry.water === 6, 'a dry squad cannot drink');
ok(dry.parched && dry.said, 'and starts the Tregyn fight parched, and the log says why');
ok(dry.shade, 'a fight that is not at midday is not parched for it');

// ---- the Tower's Breath ----
await fresh();
const breath = await ev(() => { earnTrick('b2_breath', 'marrow'); startBattle('b2_herd', {}); const u = B.units.find(p => p.id === 'marrow'), h = B.units.find(p => p.id === 'haddat'), f = foes()[0];
  foes().filter(x => x !== f).forEach((x, i) => { x.x = 7; x.y = i; }); f.x = 3; f.y = 3; h.x = 4; h.y = 4; u.x = 3; u.y = 6; f.hp = f.maxhp = 999; B.cur = u;
  const has = mkParty('marrow', 0, 0).ab.includes('t_b2_breath'), aim = aoeOk(u, AB.t_b2_breath, 3, 3);
  B.used.t_b2_breath = 1; AB.t_b2_breath.run(u, 3, 3);
  const rimed = f.slowTurn && f.hp < 999, cooled = !!h.cooled; B.round = 5; B.cur = h; B.mvLeft = h.mv; squadTurnStart(h); const kept = B.mvLeft === h.mv; B = null;
  return {has, aim, rimed, cooled, kept, elder:!!AB.t_b2_breath.elder}; }).catch(e => ({err:e.message}));
if (breath.err) ok(false, 'the Tower\'s Breath threw: ' + breath.err);
else {
  ok(breath.has && breath.aim && breath.elder, 'Marrow carries the Tower\'s Breath (Elder), and can aim it 3 tiles off');
  ok(breath.rimed, 'an enemy in it is rimed and hurt');
  ok(breath.cooled && breath.kept, 'a squadmate in it sheds the heat'); }

// ---- Sathi rides with the Weasels ----
await fresh();
const rode = await ev(() => { S.f.b2_sathiRode = 1; startBattle('b2_herd', {}); const ids = B.units.filter(u => u.side === 'p').map(u => u.id); B = null; return {ids, squad:S.squad.includes('sathi')}; });
ok(!rode.ids.includes('sathi') && !rode.ids.includes('ally_hackle') && rode.squad, 'riding with the Weasels, Sathi and Hackle are off the herd fight, and still in the squad');
ok(rode.ids.filter(k => k === 'ally_b2_weasel5').length === 2, 'and two Weasel riders stand in for her');

// ---- the key ----
await fresh();
const keys = await ev(() => { S.squad.push('redblade'); migrate(S); const c0 = S.chain.column; b2KeySquad(); const a = {key:S.f.b2_c5_key, lost:c0 - S.chain.column, w:S.chain.water, drank:S.f.b2_drank, skip:S.f.b2_drankSkip, ml:S.f.b2_marchLost};
  S = newStateDG('Hask'); S.chapter = 5; S.chain = {water:6, column:20}; migrate(S); b2KeyColumn(); const b = {key:S.f.b2_c5_key, w:S.chain.water, dry:S.f.b2_dry, lost:20 - S.chain.column};
  DLG.b2_kcart().ch[0].fx(); b.after = {dry:S.f.b2_dry, w:S.chain.water}; return {a, b}; });
ok(keys.a.key === 'squad' && keys.a.lost === Math.max(2, Math.round(20 * .18)) && keys.a.w === 6 && keys.a.lost === keys.a.ml, `'squad': the skins stay, the stretch pays (${keys.a.lost} lost)`);
ok(keys.a.drank === 'b2_dryraid' && keys.a.skip === 'redblade', 'and the squad drinks before the Tregyn, all but Ramin');
ok(keys.b.key === 'column' && keys.b.w === 0 && keys.b.dry === 1 && keys.b.lost === 1, `'column': the skins go to the stretch and the squad fights dry`);
ok(!keys.b.after.dry && keys.b.after.w === 6, 'the Trygalle\'s water ends it');

for (const key of ['squad', 'column']) {
  await fresh();
  const end = await ev(k => { S.f.b2_c5_key = k; Object.assign(S.f, {b2_forest:1, b2_nenoth:1, b2_cattleDead:1, b2_trygalle:1, b2_bottle:1, b2_towerIn:1, b2_shade:1, b2_marchLost:3, b2_ilharWater:1, b2_ilharSkin:'kept', b2_bylan:'took', b2_sathiRode:1, b2_jar:'poured'});
    chapterEnd(5, k); const C = CHAPTERS[5]; return {txt:document.body.innerText, ex:C.extras().join(' '), jr:C.journal().join(' '), cap:C.endCap()}; }, key);
  ok(new RegExp(key === 'squad' ? 'The squad drank' : 'The column drank').test(end.txt), `the ${key} end screen names its road`);
  ok(/Trygalle/.test(end.jr) && /Haddat/.test(end.ex) && !/undefined|NaN|\$\{|null/.test(end.ex + end.jr + end.cap), `the ${key} end lines read clean`);
}

// ---- a squadmate on the Silanda is not in the chapter ----
await fresh();
const away = await ev(() => { S.f.b2_c4_key = 'silanda'; b2Aboard('tangle'); const t = DLG.b2_c5_start().txt, m = DLG.b2_mounds_go(), b = DLG.b2_bungle5();
  return {named:/Tangle anyway/.test(t), count:/Nobody's touched it/.test(t), sharper:m.ch.some(c => /Tangle/.test(c.t) && (!c.req || c.req())), give:b.ch.some(c => /Tangle/.test(c.t) && (!c.req || c.req()))}; });
ok(away.named && !away.count, 'the Silanda one is counted as away, not as present');
ok(!away.sharper && !away.give, 'and no choice puts them in the chapter');

[...new Set(errors)].forEach(e => ok(false, 'page error: ' + e));
await br.close(); srv.kill();
process.exit(fail);
