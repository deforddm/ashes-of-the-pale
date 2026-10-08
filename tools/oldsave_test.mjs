// Saves made by v3.15.3 load through the real path (the title's sergeant roster → loadSlot → resume) and show the renames:
// the gate clerk is Pennick and the card 'chains' is The Wain, never "Pallick" or "Chains" as the card's name.
// The save format (15_state.js): one slot per sergeant at 'ashes-of-the-pale-v1:<sid>', listed in 'ashes-of-the-pale-roster'.
// v3.15.3's newState/migrate (git show 192f075:src/15_state.js) wrote the same fields, so the saves are built from newState
// with the flags and ids v3.15.3 used (internal ids like 'chains' and c3_pallickDoubt never changed).
// Usage: node tools/oldsave_test.mjs   (exit 1 on a failure)
import { server, browser, openGame } from './page.mjs';
const srv = await server(); const br = await browser();
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const DONE = { 0: 'given', 1: 'line', 2: 'road', 3: 'refuse', 4: 'shield', 5: 'hold', 6: 'bridgeburners' };
const CASES = [
  { name: 'mid-prologue', build: () => { const s = newState('Orrin'); s.scene = 'intro'; s.node = 'intro_tat'; s.fxd = {}; return s; } },
  { name: 'Ch3 start, at the gate, the Wain in the pool', pennick: true, build: d => { const s = newState('Vella'); Object.assign(s, { chapter: 3, lvl: 4, xp: 400, chapters: { 0: d[0], 1: d[1], 2: d[2] }, scene: 'explore', area: CHAPTERS[3].area.id, node: 'c3_pallick', card: 'knight', cardPool: ['knight', 'chains', 'oponn', 'assassin', 'obelisk', 'magi'] }); s.f.c3_drawn = 1; return s; } },
  { name: 'Ch6, card chains, pallickDoubt', wain: true, build: d => { const s = newState('Corr'); Object.assign(s, { chapter: 6, lvl: 6, xp: 1500, chapters: { 0: d[0], 1: d[1], 2: d[2], 3: d[3], 4: d[4], 5: d[5] }, scene: 'explore', area: CHAPTERS[6].area.id, node: null, card: 'chains', cardPool: ['chains', 'chains', 'knight', 'hounds', 'obelisk', 'oponn'] });
    s.squad = ['sgt', 'brisk', 'kettle', 'tuft', 'ohl', 'ellis']; Object.assign(s.f, { c3_gate: 1, c3_pallickDoubt: 1, c3_falseName: 1, c6_drawn: 1, c6_drawnCard: 'chains' }); s.seenVisions = ['v1_paran', 'v3_qb']; return s; } },
  { name: 'Ch7 finale, Brisk dead', pennick: true, dead: 'brisk', build: d => { const s = newState('Hask'); Object.assign(s, { chapter: 7, lvl: 7, xp: 2400, chapters: Object.assign({}, d, { 7: 'outlaw' }), scene: 'finale', finPage: 0, area: CHAPTERS[7].area.id, node: null, card: 'chains' });
    s.squad = ['sgt', 'kettle', 'tuft', 'ohl', 'ellis']; s.dead = { brisk: { ch: 5, where: 'The barrow' } }; Object.assign(s.f, { c3_gate: 1, c3_pallickDoubt: 1, c7_key: 'outlaw', c7_worryPaid: 1 }); s.stats = { kills: 120, steps: 4000 }; return s; } },
];
for (const C of CASES) {
  const { page, errors } = await openGame(br, srv.url, { fast: true });
  const save = await page.evaluate(([src, d]) => { const s = (0, eval)('(' + src + ')')(d); s.sid = 'old' + Math.random().toString(36).slice(2, 7);
    const meta = { id: s.sid, name: s.name, ch: s.chapter, lvl: s.lvl, where: '', done: false, upd: Date.now() };
    return { s, meta }; }, [C.build.toString(), DONE]);
  // write it the way v3.15.3 left it on the device, then start the game fresh and press Continue on the title
  await page.addInitScript(({ s, meta }) => { try { localStorage.setItem('ashes-of-the-pale-v1:' + s.sid, JSON.stringify(s)); localStorage.setItem('ashes-of-the-pale-roster', JSON.stringify({ list: [meta] })); localStorage.setItem('ashes-of-the-pale-seen', '3.15.3'); } catch (e) {} }, save);
  await page.reload(); await page.waitForTimeout(500);
  // an updated player first sees What's new; Carry on closes it
  const notes = await page.evaluate(() => !$('#modal').hidden && !!$('#bNotesOk'));
  ok(notes, `${C.name}: What's new opens for a v3.15.3 player`);
  if (notes) { await page.click('#bNotesOk'); await page.waitForTimeout(150); }
  const hasCont = await page.evaluate(() => !!document.querySelector('#bCont'));
  ok(hasCont, `${C.name}: the title offers Continue`);
  if (!hasCont) { await page.context().close(); continue; }
  await page.click('#bCont'); await page.waitForTimeout(600);
  const texts = {};
  const grab = async (k, f, a) => { await page.evaluate(f, a); await page.waitForTimeout(250); texts[k] = await page.evaluate(() => document.body.innerText); };
  const st = await page.evaluate(() => ({ view, scene: S.scene, ch: S.chapter, node: S.node, sheet: !$('#sheet').hidden }));
  ok(st.ch === save.s.chapter && st.view !== 'title', `${C.name}: loaded (view ${st.view}, scene ${st.scene}, node ${st.node})`);
  texts.resumed = await page.evaluate(() => document.body.innerText);
  if (C.dead) { await grab('chapter end', () => $('#fBack') && $('#fBack').click()); await page.evaluate(() => showFinale(finPages().length - 1)); await page.waitForTimeout(250); texts.finale = await page.evaluate(() => document.body.innerText); }
  const sq = await page.evaluate(() => SQUAD().length);
  for (let i = 0; i < sq; i++) await grab('sheet ' + i, i => { document.querySelectorAll('#modal,#settings').forEach(e => e.hidden = true); openChars(i); }, i);
  const sheets = Object.keys(texts).filter(k => k.startsWith('sheet')).map(k => texts[k]);
  ok(sheets.length === sq && sheets.every(t => /Level|level|HP|Health/i.test(t)), `${C.name}: ${sq} squad sheets render`);
  await page.evaluate(() => closeChars());
  await grab('journal', () => { openModal('journal'); document.querySelectorAll('#modal details').forEach(d => d.open = true); });
  ok(/Journal|journal/.test(texts.journal) && !(await page.evaluate(() => $('#modal').hidden)), `${C.name}: the journal renders`);
  await grab('pack', () => openModal('pack'));
  ok(!(await page.evaluate(() => $('#modal').hidden)), `${C.name}: the pack renders`);
  await grab('deeds', () => { openModal('deeds'); document.querySelectorAll('#modal details').forEach(d => d.open = true); });
  ok(/Deeds|deeds/.test(texts.deeds) && (await page.evaluate(() => !!$('#modal .kv, #modal table, #modal li'))), `${C.name}: Deeds renders`);
  const all = Object.values(texts).join('\n');
  const bad = all.match(/.{0,30}\b(Pallick|undefined|NaN)\b.{0,30}/);
  ok(!bad, `${C.name}: no "Pallick", "undefined" or "NaN" anywhere shown${bad ? ' — "' + bad[0].replace(/\n/g, ' ') + '"' : ''}`);
  const chainsCard = all.match(/.{0,30}(Deck reading\s*Chains|\bChains\s*·|The card\W+Chains|\bChains\b(?! dragged|\. The sound|, dragged)).{0,30}/);
  ok(!chainsCard, `${C.name}: "Chains" never shown as a card name${chainsCard ? ' — "' + chainsCard[0].replace(/\n/g, ' ') + '"' : ''}`);
  if (C.wain) ok(/Deck reading\s*The Wain/.test(texts.pack), `${C.name}: the pack's Deck reading says The Wain`);
  if (C.pennick) ok(/Pennick/.test(all), `${C.name}: Pennick is named`);
  if (C.dead) ok(/Brisk/.test(texts.finale || '') && !(await page.evaluate(() => SQUAD().includes('brisk'))), `${C.name}: Brisk is among the dead, not in the squad`);
  ok(!errors.length, `${C.name}: no page errors ${errors.join(' | ')}`);
  await page.context().close();
}
await br.close(); srv.kill(); process.exit(fail);
