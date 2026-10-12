// v4.6 (Book Two, Chapter 7: Aren Way, and the end of Book Two): the chapter registers and opens; the Barrow is played by whoever stayed
// at the split, without the sergeant, held or broken, and they die there for good; with nobody at the Barrow it is seen from the walls;
// Ramin goes to the cells with the Red Blades (or, if he stayed, his message goes to his commander); an Old Hand of the Fourth comes
// ashore in his place; the Silanda one comes back; the Vathar wound closes; the postern gets hands when the squad is short (and Hackle,
// if the whistle brought him home); and the end of Book Two: the end screen, every finale page (a page for each of the squad, the fallen
// at the Barrow, Ramin given back, an Old Hand), the coda and "End of Book Two", for every road; the title shows the sergeant Finished.
// Every combination: nobody / some / all stayed / the sergeant alone, with and without a Silanda squadmate, Ramin, and Old Hands.
// Book One's finale still names its own book.
// Usage: node tools/aren_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true, mobile: true, touch: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = (f, a) => page.evaluate(f, a);
const LEAK = /undefined|NaN|\$\{|\[object|\bnull\b/;
// a Book Two sergeant at the start of Chapter 7, as Chapter 6 leaves it: who stayed at the split (by b2StayBehind, 47), Ramin, the Silanda, Old Hands
const fresh = (o = {}) => ev(o => { setBook('dg'); S = newStateDG('Hask'); S.chapter = 7; S.lvl = 8; S.xp = LEVELS[7]; S.chain = {water:6, column:24};
  Object.assign(S.f, {b2_key:o.daughters ? 'daughters' : 'carts', b2_jarboy:o.daughters ? undefined : 'took', b2_c4_key:o.away ? 'silanda' : 'keep', b2_c5_key:'column', b2_listWar:1, b2_sathiCrows:1, b2_ilhar:'parted'}, o.f || {});
  if (o.ramin) S.squad.push('redblade'); migrate(S); S.inv = {sharper:2, burner:1, cusser:1, salve:2, smoker:1}; S.squad.forEach(id => { const p = PICKS[3][id]; if (p) S.picks[id].push(p[0][0]); });
  if (o.away) b2Aboard(o.away); else S.f.b2_woundWho = 'marrow';
  const here = B2_SPLIT.filter(k => S.squad.includes(k)), stay = o.stay === 'all' ? here : (o.stay || []).filter(k => here.includes(k));
  S.f.b2_split = {}; S.f.b2_splitHow = {}; here.forEach(k => { S.f.b2_split[k] = stay.includes(k) ? 'stay' : 'go'; S.f.b2_splitHow[k] = 'own'; });
  if (stay.includes('tangle')) { S.f.b2_satchel6 = 'went'; S.f.b2_stayInv = {}; ['sharper', 'burner', 'cusser', 'smoker'].forEach(m => { S.f.b2_stayInv[m] = S.inv[m]; S.inv[m] = 0; }); }
  stay.forEach(k => b2StayBehind(k)); stay.forEach(k => gain(B2_KEEP6[k])); S.f.b2_stayCount = stay.length;
  S.f.b2_c6_key = !stay.length ? 'whole' : stay.length >= 2 && stay.length * 2 >= here.length ? 'many' : 'some'; S.chapters = {1:S.f.b2_key, 2:'water', 3:'bait', 4:S.f.b2_c4_key, 5:'column', 6:S.f.b2_c6_key};
  if (o.old) S.imported = {from:'Kell', sid:'x', road:'empire', lvl:8, follow:{tuft:false}, mates:['brisk', 'kettle', 'tuft', 'ohl'], dead:[], loy:{brisk:1, kettle:3, tuft:3, ohl:2}};
  notes = []; save(); }, o);
const click = async (re) => { const r = await ev(re => { const b = [...document.querySelectorAll('#sheet .choice')].find(b => !b.disabled && new RegExp(re).test(b.textContent)); if (!b) return [...document.querySelectorAll('#sheet .choice')].map(b => b.textContent).join(' | '); b.click(); return null; }, re); await page.waitForTimeout(40); return r; };

// ---- the chapter is there, and the book is seven chapters long ----
await fresh();
const reg = await ev(() => ({ch:!!CHAPTERS[7] && CHAPTERS[7].title, n:dgChCount(), areas:['b2_balahn', 'b2_way', 'b2_aren', 'b2_quay'].every(a => AREAS[a]), fights:['b2_runway', 'b2_barrow', 'b2_postern'].every(b => BATTLES[b] && BATTLES[b].stage2),
  six:AREAS.b2_geleen && AREAS.b2_geleen.title, blurb:BOOKS.dg.blurb}));
ok(reg.ch === 'Aren Way' && reg.n === 7 && /All seven chapters/.test(reg.blurb), `Book Two's Chapter 7 is registered, and Book Two reads seven chapters (${reg.n})`);
ok(reg.areas && reg.fights, 'all four areas and three fights (each with a second ground) are registered');
ok(/Geleen/.test(reg.six || ''), 'Chapter 6\'s areas are still Chapter 6\'s');
await ev(() => { startChapter(7); }); await page.waitForTimeout(300);
ok(await ev(() => view === 'intro' && /Balahn/.test(document.body.innerText)), 'the chapter opens on its intro');

// ---- Squint's Breath ----
await fresh();
const sq = await ev(() => { earnTrick('b2_squint', 'sathi'); startBattle('b2_postern', {}); const u = B.units.find(p => p.id === 'sathi'); B.cur = u; const has = mkParty('sathi', 0, 0).ab.includes('t_b2_squint'); AB.t_b2_squint.run(u);
  const r = {has, steady:u.steady, rally:u.rallyUntil > B.round, sorc:!!AB.t_b2_squint.strain}; B = null; return r; });
ok(sq.has && sq.steady && sq.rally && !sq.sorc, 'Squint\'s Breath: the bearer goes still, +4 to hit and +2 damage on the next blow; not sorcery');

// ---- every combination ----
const STAYS = {nobody:[], some:['haddat', 'sathi'], all:'all', alone:'all'};
let bad = [], n = 0;
for (const [sk, stay] of Object.entries(STAYS)) for (const away of [null, 'tangle']) for (const ramin of [false, true]) for (const old of [false, true]) {
  if (sk === 'alone' && away) continue; // the sergeant alone means everybody who could choose stayed and nobody is on the Silanda
  const awayId = sk === 'all' && away ? 'marrow' : away;
  await fresh({stay, away:awayId, ramin, old, daughters:n % 2 === 0});
  const key = ['guard', 'wickans', 'desert'][n % 3], lossy = n % 2 === 1; n++;
  const why = [];
  const s0 = await ev(() => ({rg:b2Rearguard(), squad:S.squad.slice()}));
  if (sk === 'alone' && JSON.stringify(s0.squad) !== '["sgt"]') why.push('not the sergeant alone: ' + s0.squad);
  // the run, and the count at the gate
  const gate = await ev(() => { talk('b2_after_run'); return {c:S.f.b2_gateCount, txt:$('#sheet').innerText}; });
  if (gate.c == null || LEAK.test(gate.txt)) why.push('the gate count');
  // the north wall, and the Barrow
  await ev(() => { startExplore('b2_aren'); talk('b2_aren_arrive'); talk('b2_wall_up'); });
  if (s0.rg.length) {
    const r1 = await click('The mound'); if (r1) why.push('no choice into the Barrow: ' + r1);
    const st = await ev(() => ({squad:S.squad.slice(), node:S.node, txt:$('#sheet').innerText}));
    if (st.squad.includes('sgt') || JSON.stringify(st.squad) !== JSON.stringify(s0.rg)) why.push('the Barrow squad is ' + st.squad);
    if (LEAK.test(st.txt) || st.node !== 'b2_barrow_cut') why.push('the cut to the mound');
    const b = await ev(async lossy => { startBattle('b2_barrow', lossy ? {} : {stage:2}); const u = B.units.filter(x => x.side === 'p').map(x => x.id); let err = null;
      try { if (lossy) { B.units.filter(x => x.side === 'p' && !x.ally).forEach(x => x.hp = 0); checkEnd(); } else win(); } catch (e) { err = e.message; }
      for (let i = 0; i < 60 && S.node !== 'b2_after_barrow'; i++) await new Promise(r => setTimeout(r, 50));
      return {u, err, node:S.node, held:S.f.b2_barrowHeld, txt:$('#sheet').innerText, god:/would not let it|No one answers/.test($('#sheet').innerText)}; }, lossy);
    if (b.err || b.node !== 'b2_after_barrow' || b.god) why.push(`the Barrow did not go on (${b.err || b.node}${b.god ? ', a god answered' : ''})`);
    if (b.u.includes('sgt') || !s0.rg.every(id => b.u.includes(id)) || b.u.includes('ally_hackle') !== s0.rg.includes('sathi')) why.push('the Barrow map: ' + b.u);
    if (b.held !== (lossy ? 0 : 1)) why.push('b2_barrowHeld ' + b.held);
    if (LEAK.test(b.txt)) why.push('the Barrow\'s end text leaks');
    const r2 = await click('The walls'); if (r2) why.push('no way back to the walls: ' + r2);
  } else { const r = await click('Watch'); if (r) why.push('no Watch on the wall: ' + r); }
  const after = await ev(() => ({squad:S.squad.slice(), dead:JSON.parse(JSON.stringify(S.dead || {})), node:S.node, fell:S.f.b2_barrowFell}));
  if (!after.squad.includes('sgt') || s0.rg.some(id => after.squad.includes(id))) why.push('after the Barrow the squad is ' + after.squad);
  if (!s0.rg.every(id => after.dead[id] && after.dead[id].where === 'The Barrow' && after.dead[id].ch === 7)) why.push('the rearguard is not dead at the Barrow');
  if (!s0.rg.length && Object.keys(after.dead).length) why.push('somebody died with nobody at the Barrow');
  // the walls: the crows, Squint, and the whistle
  for (const nd of ['b2_wall_watch', 'b2_wall_crows', 'b2_wall_squint', 'b2_wall_gone']) { const t = await ev(nd => { talk(nd); return $('#sheet').innerText; }, nd); if (LEAK.test(t)) why.push(nd + ' leaks'); }
  const gone = await ev(() => ({coltaine:S.f.b2_coltaineGone, whistle:[...document.querySelectorAll('#sheet .choice')].some(b => /whistle/.test(b.textContent))}));
  if (!gone.coltaine) why.push('the crows did not take the Fist');
  if (gone.whistle !== s0.rg.includes('sathi')) why.push('the whistle choice');
  if (gone.whistle) { await click('whistle'); await click('Down off'); } else await click('Down off');
  // the Red Blades
  const rb = await ev(() => ({node:S.node, txt:$('#sheet').innerText}));
  if (ramin && !s0.rg.includes('redblade')) { await click('Ramin'); await click('On'); }
  else if (ramin) { await click('commander'); await click('sash as well|Leave him|Keep the sash'); }
  const rb2 = await ev(() => ({inSquad:S.squad.includes('redblade'), dead:!!(S.dead && S.dead.redblade), gone:S.f.b2_raminGone, msg:S.f.b2_raminMsg, ph:b2Ph7()}));
  if (ramin && !s0.rg.includes('redblade') && (rb2.inSquad || rb2.dead || !rb2.gone)) why.push('Ramin did not go with the Red Blades');
  if (ramin && s0.rg.includes('redblade') && (!rb2.dead || !rb2.msg)) why.push('Ramin\'s message did not reach his commander');
  if (rb2.ph !== 2 || LEAK.test(rb.txt)) why.push('the evening');
  // an Old Hand of the Fourth
  if (old) { const oh = await ev(() => { const p = b2OldHandPick(); talk('b2_oldhand'); return {p, txt:$('#sheet').innerText}; });
    if (oh.p !== 'kettle' || LEAK.test(oh.txt)) why.push('the Old Hand should be Kettle (most loyal who followed): ' + oh.p);
    await click('glad of you'); const j = await ev(() => ({oh:b2OH(), in:S.squad.includes('kettle'), txt:$('#sheet').innerText, picks:S.picksDue.slice()})); await ev(() => { S.picksDue = []; }); /* her level-3 habit is the player's to pick */ if (!j.in || j.oh !== 'kettle' || LEAK.test(j.txt)) why.push('Kettle did not join'); }
  else if (await ev(() => b2OldHandPick())) why.push('an Old Hand with no import');
  // the Vathar wound, the sortie, the road, the postern
  await ev(() => { talk('b2_blistig2'); });
  for (const nd of ['b2_muster', 'b2_muster2', 'b2_sortie', 'b2_keneb3', 'b2_keneb3b', 'b2_basin', 'b2_way_dead', 'b2_blistig3', 'b2_postern_go']) { const t = await ev(nd => { talk(nd); return $('#sheet').innerText; }, nd); if (LEAK.test(t)) why.push(nd + ' leaks'); }
  const pst = await ev(() => { startBattle('b2_postern', {}); const al = B.units.filter(u => u.side === 'p' && u.ally).map(u => u.id), sq = B.units.filter(u => u.side === 'p' && !u.ally).map(u => u.id); B = null; return {al, sq, short:b2Hands5()}; });
  const want = pst.short <= 1 ? 3 : pst.short <= 3 ? 2 : 0;
  if (pst.al.filter(a => /areng/.test(a)).length !== want) why.push(`the postern's Aren Guard (${pst.al} for ${pst.short} hands)`);
  if ((s0.rg.includes('sathi') || pst.sq.includes('sathi')) !== pst.al.includes('ally_hackle')) why.push('Hackle at the postern (with Sathi, or home to the whistle)');
  await ev(() => { talk('b2_after_postern'); talk('b2_dawn2'); startExplore('b2_quay'); talk('b2_quay4'); });
  const q = await ev(() => ({txt:$('#sheet').innerText})); if (LEAK.test(q.txt)) why.push('the Silanda comes in: leak');
  await click('');
  const back = await ev(() => ({sq:S.squad.slice(), back:S.f.b2_silandaBack, healed:S.f.b2_woundHealed, txt:$('#sheet').innerText}));
  if (awayId && (!back.sq.includes(awayId) || !back.back)) why.push('the Silanda one did not come ashore');
  if (!awayId && !s0.rg.includes('marrow') && !back.healed) why.push('the Vathar wound did not close in Aren');
  if (LEAK.test(back.txt)) why.push('the quay leaks');
  for (const nd of ['b2_keneb4', 'b2_gesler7', 'b2_nilq', 'b2_ours17', 'b2_last_haddat', 'b2_last_sathi', 'b2_last_tangle', 'b2_last_marrow', 'b2_last_oh', 'b2_qwell', 'b2_blistig4', 'b2_temul10', 'b2_road_' + key]) { const t = await ev(nd => { talk(nd); return $('#sheet').innerText; }, nd); if (LEAK.test(t)) why.push(nd + ' leaks'); }
  await click('This road'); const endn = await ev(() => ({node:S.node, txt:$('#sheet').innerText, key:S.f.b2_c7_key})); if (endn.key !== key || endn.node !== 'b2_c7_end' || LEAK.test(endn.txt)) why.push('the road ' + key);
  await click('end of the road');
  // the end screen and the finale
  const fin = await ev(async () => { const end = {view, txt:document.body.innerText, ch7:S.chapters[7]}, live = S.squad.filter(id => id !== 'sgt'), P = finPages(), pages = [];
    for (let i = 0; i < P.length; i++) { showFinale(i); pages.push({k:P[i].k, id:P[i].id, txt:document.querySelector('#app').innerText}); }
    showTitle(); const row = [...document.querySelectorAll('.sgtrow .load')].map(b => b.innerText).find(t => /Hask/.test(t)) || '';
    return {end, pages, row, live}; });
  if (fin.end.view !== 'end' || fin.end.ch7 !== key || !/End of Chapter Seven/i.test(fin.end.txt) || !/Book Two/i.test(fin.end.txt) || LEAK.test(fin.end.txt)) why.push('the end screen');
  const all = fin.pages.map(p => p.txt).join('\n');
  if (LEAK.test(all)) why.push('a finale page leaks: ' + (all.match(new RegExp('.{60}' + LEAK.source + '.{20}')) || [''])[0]);
  if (!/End of Book Two/i.test(fin.pages[fin.pages.length - 1].txt) || /Gardens of the Moon|Ohl's list|The Fourth's road|Prologue/i.test(all)) why.push('the last page does not end Book Two, or names Book One');
  const fate = fin.pages.filter(p => p.k === 'fate').map(p => p.id), gonep = fin.pages.filter(p => p.k === 'gone');
  const live = fin.live;
  if (JSON.stringify(fate) !== JSON.stringify([...live, 'sgt'])) why.push(`fate pages ${fate} != ${live},sgt`);
  if (!s0.rg.every(id => gonep.some(p => p.id === id && /The Barrow/i.test(p.txt) && /The fallen/i.test(p.txt)))) why.push('a Barrow page is missing');
  if (ramin && !s0.rg.includes('redblade') && !gonep.some(p => p.id === 'redblade' && /Given back/i.test(p.txt) && !/The fallen/i.test(p.txt))) why.push('Ramin\'s page (given back)');
  if (old && !fin.pages.some(p => p.id === 'kettle' && /Old Hand|Kell/i.test(p.txt))) why.push('the Old Hand\'s page');
  if (awayId && !fin.pages.some(p => p.id === awayId && /Silanda/i.test(p.txt))) why.push('the Silanda one\'s page');
  if (!/Book Two · Finished/i.test(fin.row)) why.push('the title roster: ' + fin.row);
  if (why.length) bad.push(`${sk}${awayId ? ' +Silanda:' + awayId : ''}${ramin ? ' +Ramin' : ''}${old ? ' +Old Hands' : ''} (${key}${lossy ? ', broken' : ', held'}): ${why.join('; ')}`);
}
ok(!bad.length, `every combination (${n}: nobody, some, all stayed, the sergeant alone; with and without the Silanda, Ramin and Old Hands) plays the Barrow, Aren and the end of Book Two`);
bad.slice(0, 8).forEach(b => console.log('      ' + b));

// ---- Book One's finale is still Book One's ----
const b1 = await ev(() => { setBook('gotm'); S = newState('Hask'); S.chapter = 7; S.chapters = {0:'given', 1:'line', 2:'light', 3:'report', 4:'shield', 5:'hold', 6:'x'}; S.f.c7_key = 'outlaw'; save(); chapterEnd(7, 'outlaw');
  const P = finPages(); showFinale(P.length - 1); const last = document.querySelector('#app').innerText; showFinale(0); const first = document.querySelector('#app').innerText;
  return {last, first, ids:P.filter(p => p.k === 'gone').map(p => p.id)}; });
ok(/The End of Gardens of the Moon/i.test(b1.last) && /The Fourth's road/i.test(b1.last) && /Ohl's list/i.test(b1.last) && /Prologue/i.test(b1.last) && /Epilogue/i.test(b1.first), 'Book One\'s finale still names its own book, its road, Ohl\'s list and the prologue');

[...new Set(errors)].forEach(e => ok(false, 'page error: ' + e));
await br.close(); srv.kill();
process.exit(fail);
