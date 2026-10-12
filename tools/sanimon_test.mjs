// v4.5 (Book Two, Chapter 6: Sanimon): the chapter registers and opens; the Khundryl Paint works and never sputters; Sanimon's second
// ground and Dojal Spring are midday fights; Ilhar's last word ends each way it should; THE SPLIT: each squadmate leans the way their
// story says, the parting choices settle it ('own', 'asked', 'talked'), and every combination of who stays (and with a squadmate on the
// Silanda, and with Ramin or without) goes through the real split and end nodes to the end screen with S.f.b2_stay exactly right, the
// stayers out of the squad (not dead), their kit kept, their keepsakes given, Hackle with Sathi, and the key by count; then Chapter 7's
// Barrow helpers (47) put them back on a map without the sergeant, and take them off again, dead at the Barrow.
// Usage: node tools/sanimon_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true, mobile: true, touch: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = (f, a) => page.evaluate(f, a);
const fresh = (o = {}) => ev(o => { setBook('dg'); S = newStateDG('Hask'); S.chapter = 6; S.lvl = 7; S.xp = LEVELS[6]; S.chain = {water:6, column:24};
  Object.assign(S.f, {b2_key:'daughters', b2_c4_key:'keep', b2_c5_key:'column'}, o.f || {}); if (o.ramin) S.squad.push('redblade'); if (o.away) { S.f.b2_c4_key = 'silanda'; b2Aboard(o.away); }
  migrate(S); S.inv = {sharper:2, burner:1, cusser:1, salve:2, smoker:1}; S.silver = 15; save(); }, o);

// ---- the chapter is there ----
await fresh();
const reg = await ev(() => ({ch:!!CHAPTERS[6] && CHAPTERS[6].title, areas:['b2_hills', 'b2_field', 'b2_dojal', 'b2_geleen'].every(a => AREAS[a]), fights:['b2_sanimon', 'b2_dojal', 'b2_silver'].every(b => BATTLES[b]),
  dry:AREAS.b2_nenoth && AREAS.b2_nenoth.title}));
ok(reg.ch === 'Sanimon', `Book Two's Chapter 6 is registered (${reg.ch})`);
ok(reg.areas && reg.fights, 'all four areas and three fights are registered');
ok(/Nenoth/.test(reg.dry || ''), 'Chapter 5\'s areas are still Chapter 5\'s');
await ev(() => { startChapter(6); }); await page.waitForTimeout(400);
ok(await ev(() => view === 'intro' && /Sanimon/.test(document.body.innerText)), 'the chapter opens on its intro');
await fresh({f:{b2_drankSkip:'redblade', b2_dry:1}});
ok(await ev(() => { DLG.b2_c6_start().fx(); return !S.f.b2_drankSkip && !S.f.b2_dry; }), 'Chapter 5\'s drink flags do not carry into Sanimon');

// ---- heat ----
const heat = await ev(() => { const r = {}; startBattle('b2_sanimon', {}); r.s1 = !!B.def.heat; B = null; startBattle('b2_sanimon', {stage:2}); r.s2 = !!B.def.heat; r.surv = B.def.objective && B.def.objective.type; B = null;
  startBattle('b2_dojal', {}); r.dojal = !!B.def.heat; B = null; startBattle('b2_silver', {}); r.silver = !!B.def.heat; B = null; return r; });
ok(!heat.s1 && heat.s2 && heat.surv === 'survive', 'Sanimon: the dawn is cool, the noon is hot, and the fold is held, not won');
ok(heat.dojal && !heat.silver, 'Dojal Spring is at noon; the Geleen is at dusk');

// ---- the Khundryl Paint ----
await fresh();
const paint = await ev(() => { earnTrick('b2_paint', 'haddat'); startBattle('b2_silver', {}); const u = B.units.find(p => p.id === 'haddat'), m = B.units.find(p => p.id === 'sgt'), f = foes()[0];
  foes().filter(x => x !== f).forEach((x, i) => { x.x = 7; x.y = i; }); u.x = 3; u.y = 5; m.x = 4; m.y = 5; f.x = 3; f.y = 3; B.cur = u;
  const has = mkParty('haddat', 0, 0).ab.includes('t_b2_paint'); AB.t_b2_paint.run(u);
  const r = {has, rally:u.rallyUntil > B.round, mate:m.rallyUntil > B.round, daz:f.dazzleUntil >= B.round, far:foes().filter(x => x !== f).every(x => !(x.dazzleUntil >= B.round)), sorc:!!(AB.t_b2_paint.strain || TRICKS.b2_paint.sorcery)}; B = null; return r; });
ok(paint.has && paint.rally && paint.mate, 'the Khundryl Paint: the bearer and the one beside them are +2 to hit');
ok(paint.daz && paint.far, 'an enemy within 2 falters; one further off does not');
ok(!paint.sorc, 'it is not sorcery and costs no strain, so it never sputters');

// ---- Ilhar ----
for (const [path, want] of [['b2_ilhar_hold', 'lost'], ['b2_ilhar_late', 'fell'], ['b2_ilhar_came', 'came'], ['b2_ilhar_parts', 'parted']]) {
  await fresh({f:{b2_ilharWater:1, b2_ilharSkin:'kept'}});
  const r = await ev(p => { const c0 = S.chain.column; talk(p); return {f:S.f.b2_ilhar, dc:S.chain.column - c0, lean:b2Lean('haddat'), txt:$('#sheet').innerText}; }, path);
  ok(r.f === want && !/undefined|NaN|\$\{/.test(r.txt), `Ilhar: ${path} ends it '${want}'${want === 'came' ? ` (+${r.dc} in the stretch)` : ''}`);
  ok(r.lean === (want === 'came' ? 'go' : 'stay'), `  and Haddat leans '${r.lean}' at the split`);
}
await fresh({f:{b2_ilharSkin:'kept'}});
ok(await ev(() => { const n = DLG.b2_ilhar_talk(); const give = n.ch.find(c => /water/.test(c.t)); give.fx(); const ask = DLG.b2_ilhar_water().ch[0]; return !!give && S.f.b2_ilharGave === 1 && ask.edges().some(e => e && e[1] === 3); }), 'giving him back his water helps Haddat ask him (+3)');

// ---- leans ----
await fresh({ramin:true});
const leans = await ev(() => { const r = {}; r.base = Object.fromEntries(b2Here6().map(id => [id, b2Lean(id)]));
  S.f.b2_bungle5 = 'gave'; S.f.b2_marrowEnd = 'on'; r.tm = [b2Lean('tangle'), b2Lean('marrow')];
  S.f.b2_bungle5 = 'kept'; S.f.b2_marrowEnd = 'stopped'; S.f.b2_robe = 'squad'; S.f.b2_woundWho = 'tangle'; r.hurt = b2Lean('tangle'); return r; });
ok(leans.base.sathi === 'stay' && leans.base.haddat === 'stay' && leans.base.redblade === 'go' && leans.base.tangle === 'go' && leans.base.marrow === 'go', `leans by default: ${JSON.stringify(leans.base)}`);
ok(leans.tm[0] === 'stay' && leans.tm[1] === 'stay', 'Tangle leans to stay as Bungle\'s man; Marrow, if she healed the Vathar to the floor');
ok(leans.hurt === 'stay', 'the one with the Vathar wound leans to stay');

// ---- the parting choices ----
for (const [id, node] of [['haddat', 'b2_part_haddat'], ['sathi', 'b2_part_sathi'], ['tangle', 'b2_part_tangle'], ['marrow', 'b2_part_marrow'], ['redblade', 'b2_part_ramin']]) {
  const r = {};
  for (const mode of ['let', 'ask', 'pass', 'fail']) {
    await fresh({ramin:true});
    r[mode] = await ev(([id, node, mode]) => { S.f.b2_silverDone = 1; S.loy[id] = mode === 'ask' ? 2 : 0; const lean = b2Lean(id), n = DLG[node]();
      const vis = n.ch.filter(c => !c.req || c.req()), c = mode === 'let' ? vis[0] : mode === 'ask' ? vis.find(c => c.tag === 'they trust you') : vis.find(c => c.check);
      if (!c) return {err:'no choice for ' + mode};
      if (!c.check) { c.fx && c.fx(); talk(c.go); } else talk(mode === 'pass' ? c.go : c.fail);
      const txt = $('#sheet').innerText;
      return {lean, said:S.f.b2_split[id], how:S.f.b2_splitHow[id], leak:/undefined|NaN|\$\{|\[object/.test(txt), sgt:c.check ? c.check[2] : null}; }, [id, node, mode]);
  }
  const L = r.let.lean, other = L === 'stay' ? 'go' : 'stay';
  ok(r.let.said === L && r.let.how === 'own', `${id} (leans ${L}): let them choose -> ${r.let.said}/${r.let.how}`);
  ok(r.ask.said === other && r.ask.how === 'asked', `${id}: asked the other way, with their trust -> ${r.ask.said}/${r.ask.how}`);
  ok(r.pass.said === other && r.pass.how === 'talked' && r.pass.sgt === 'sgt', `${id}: argued, and it lands -> ${r.pass.said}/${r.pass.how} (the sergeant's own roll)`);
  ok(r.fail.said === L && r.fail.how === 'own', `${id}: argued, and it does not -> ${r.fail.said}/${r.fail.how}`);
  ok(![r.let, r.ask, r.pass, r.fail].some(x => x.leak || x.err), `${id}: the parting texts read clean`);
}
await fresh();
ok(await ev(() => { S.loy.sathi = 1; return !DLG.b2_part_sathi().ch.find(c => c.tag === 'they trust you').req(); }), 'asking needs trust: at loyalty 1 there is no plain ask');

// ---- every combination, through the real split and end nodes ----
const combos = [];
for (let m = 0; m < 32; m++) combos.push({m, ramin:true});
for (let m = 0; m < 16; m++) combos.push({m, ramin:false});
for (const away of ['haddat', 'sathi', 'tangle', 'marrow']) combos.push({m:31, ramin:true, away}, {m:0, ramin:false, away});
let bad = [], n = 0;
for (const cb of combos) {
  await fresh({ramin:cb.ramin, away:cb.away});
  const r = await ev(async ({m, satchel}) => {
    const all = ['haddat', 'sathi', 'tangle', 'marrow', 'redblade'], here = b2Here6(), want = all.filter((id, i) => m & (1 << i) && here.includes(id));
    Object.assign(S.f, {b2_silverDone:1, b2_kherahn:1, b2_geleen:1, b2_retreat:1, b2_sanimonDone:1, b2_satchel6:satchel});
    here.forEach(id => b2Choose(id, want.includes(id), 'own'));
    const gear0 = Object.fromEntries(want.map(id => [id, Object.assign({}, S.gear[id])])), inv0 = Object.assign({}, S.inv);
    startExplore('b2_geleen'); talk('b2_bult11');
    let splitTxt = '';
    for (let k = 0; k < 8 && view !== 'end'; k++) { if (S.node === 'b2_split') splitTxt = $('#sheet').innerText; const b = [...document.querySelectorAll('#sheet .choice')].find(b => !b.disabled && b.dataset.i != null); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 30)); }
    const told = want.every(id => splitTxt.includes(NAME(id))) && (want.length || /Nobody from the squad goes east/.test(splitTxt));
    const end = view === 'end', endTxt = document.body.innerText;
    const stay = Object.keys(S.f.b2_stay || {}).filter(k => S.f.b2_stay[k] === true).sort();
    startBattle('b2_dojal', {}); const ids = B.units.filter(u => u.side === 'p').map(u => u.id); B = null;
    const keep = want.every(id => JSON.stringify(S.f.b2_stayGear[id]) === JSON.stringify(gear0[id]));
    const keepsakes = want.every(id => S.kit.includes(B2_KEEP6[id]));
    const C = CHAPTERS[6], lines = [C.extras().join(' '), C.journal().join(' '), C.endCap(), endTxt].join(' ');
    const munis = ['sharper', 'burner', 'cusser', 'smoker'];
    const satch = want.includes('tangle') && satchel === 'went' ? munis.every(k => S.inv[k] === 0 && S.f.b2_stayInv[k] === inv0[k]) : munis.every(k => S.inv[k] === inv0[k]);
    return {want:want.sort(), stay, here, end, told, named:new RegExp(C.end[S.f.b2_c6_key][0]).test(endTxt), key:S.f.b2_c6_key, ch6:S.chapters[6], squad:S.squad.slice(), dead:Object.keys(S.dead || {}), ids, keep, keepsakes, satch,
      leak:/undefined|NaN|\$\{|\[object/.test(lines)};
  }, {m:cb.m, satchel:cb.m % 3 ? 'went' : 'left'});
  n++;
  const why = [];
  if (!r.end || !r.named) why.push('no end screen, or it does not name the road'); if (!r.told) why.push('the split does not say who went east'); if (JSON.stringify(r.want) !== JSON.stringify(r.stay)) why.push(`b2_stay ${r.stay} != ${r.want}`);
  if (r.want.some(id => r.squad.includes(id)) || r.here.filter(id => !r.want.includes(id)).some(id => !r.squad.includes(id)) || !r.squad.includes('sgt')) why.push(`squad ${r.squad}`);
  if (r.dead.length) why.push('somebody died at the split');
  const k = !r.want.length ? 'whole' : r.want.length >= 2 && r.want.length * 2 >= r.here.length ? 'many' : 'some'; if (r.key !== k || r.ch6 !== k) why.push(`key ${r.key}/${r.ch6} != ${k}`);
  if (r.ids.includes('ally_hackle') !== r.squad.includes('sathi')) why.push('Hackle is not with Sathi');
  if (r.want.some(id => r.ids.includes(id))) why.push('a stayer is on a map after the split');
  if (!r.keep || !r.keepsakes) why.push('kit or keepsakes'); if (!r.satch) why.push('the satchel'); if (r.leak) why.push('a leak in the end lines');
  if (why.length) bad.push(`m=${cb.m}${cb.ramin ? ' +Ramin' : ''}${cb.away ? ' away:' + cb.away : ''}: ${why.join('; ')}`);
}
ok(!bad.length, `every combination of who stays (${n}, with Ramin and without, and with each of the four on the Silanda) splits right and reaches the end screen`);
bad.slice(0, 6).forEach(b => console.log('      ' + b));
await fresh({ramin:true, away:'marrow'});
ok(await ev(() => { b2Choose('marrow', true, 'own'); return !b2Here6().includes('marrow') && (S.f.b2_split.marrow === 'stay'); }) && await ev(() => { ['haddat', 'sathi', 'tangle', 'redblade'].forEach(id => b2Choose(id, false, 'own')); b2DoSplit(); return !(S.f.b2_stay || {}).marrow && S.f.b2_c6_key === 'whole'; }),
  'the one on the Silanda cannot stay behind, whatever the flags say');

// ---- Chapter 7's Barrow (47) ----
await fresh({ramin:true});
const bar = await ev(() => { ['haddat', 'sathi', 'tangle'].forEach(id => b2Choose(id, true, 'own')); ['marrow', 'redblade'].forEach(id => b2Choose(id, false, 'own')); S.f.b2_satchel6 = 'went';
  S.gear.haddat = {trinket:'b2_sealskin'}; if (!S.kit.includes('b2_sealskin')) S.kit.push('b2_sealskin'); b2DoSplit(); const inv0 = Object.assign({}, S.inv), sq0 = S.squad.slice();
  const r = {rg:b2Rearguard(), in:b2LastStand()}; r.squad = S.squad.slice(); r.inv = Object.assign({}, S.inv); r.gear = Object.assign({}, S.gear.haddat); r.again = b2LastStand();
  startBattle('b2_silver', {}); r.units = B.units.filter(u => u.side === 'p').map(u => u.id); r.err = null;
  try { B.units.filter(u => u.side === 'p').forEach(u => u.hp = 0); checkEnd(); } catch (e) { r.err = e.message; } B = null; $('#sheet').hidden = true;
  r.out = b2LastStandEnd(); r.after = S.squad.slice(); r.inv2 = Object.assign({}, S.inv); r.dead = Object.assign({}, S.dead); r.fell = S.f.b2_barrowFell; r.twice = b2LastStandEnd(); r.rg2 = b2Rearguard(); r.sq0 = sq0; r.inv0 = inv0; return r; });
ok(bar.in && JSON.stringify(bar.squad) === JSON.stringify(['haddat', 'sathi', 'tangle']) && !bar.again, `b2LastStand: the rearguard is the squad, with no sergeant (${bar.squad})`);
ok(bar.inv.sharper === 2 && bar.inv.cusser === 1 && bar.gear.trinket === 'b2_sealskin', 'with Tangle\'s satchel and their own kit');
ok(bar.units.includes('haddat') && bar.units.includes('ally_hackle') && !bar.units.includes('sgt') && !bar.err, `a fight starts with them (and Hackle), and a loss does not throw${bar.err ? ': ' + bar.err : ''}`);
ok(bar.out && JSON.stringify(bar.after) === JSON.stringify(bar.sq0) && bar.inv2.sharper === bar.inv0.sharper, `b2LastStandEnd: the walls' squad comes back (${bar.after})`);
ok(['haddat', 'sathi', 'tangle'].every(id => bar.dead[id] && bar.dead[id].ch === 7) && bar.fell === 1 && !bar.twice && bar.rg2.length === 3, 'and the rearguard is dead at the Barrow, for good, once');

[...new Set(errors)].forEach(e => ok(false, 'page error: ' + e));
await br.close(); srv.kill();
process.exit(fail);
