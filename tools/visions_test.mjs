// Every vision (36b_visions.js), opened the way a player does from the journal's Visions list, stepped to the end; every
// choice is picked at least once across runs. No page errors, no undefined/NaN/${ in the text, no bare "—" continue
// button, the vision is recorded in S.seenVisions, and the player comes back to the map.
// Usage: node tools/visions_test.mjs   (exit 1 on a failure)
import { server, browser, openGame } from './page.mjs';
const srv = await server(); const br = await browser();
const { page, errors } = await openGame(br, srv.url, { fast: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ids = await page.evaluate(() => VISION_IDS.map(k => [k, VISIONS[k].ch, Math.max(1, ...VISIONS[k].steps.map(s => s.ch ? s.ch.length : 1))]));
ok(ids.length > 0, `${ids.length} visions found`);
const BAD = /\bundefined\b|\bNaN\b|\$\{/;
for (const [id, ch, runs] of ids) {
  const probs = [], dashes = new Set(); let steps = 0, seen = false, tufts = false, back = false, listed = true;
  for (let run = 0; run < runs; run++) {
    // a sergeant in the vision's chapter, Tuft in the squad, on the map; open the journal and press the vision's Watch button
    const opened = await page.evaluate(async ([id, ch]) => {
      document.querySelectorAll('#modal,#chars,#settings').forEach(e => e.hidden = true);
      S = newState('Hask'); S.chapter = ch; S.squad = ['sgt', 'brisk', 'kettle', 'tuft', 'ohl']; migrate(S); S.picksDue = []; save();
      startExplore(CHAPTERS[ch] ? CHAPTERS[ch].area.id : 'pale'); openModal('journal');
      document.querySelectorAll('#modal details').forEach(d => d.open = true);
      const b = document.querySelector(`#modal [data-vision="${id}"]`); if (!b) return false; b.click(); return true;
    }, [id, ch]);
    if (!opened) { listed = false; break; }
    await page.waitForTimeout(150);
    for (let i = 0; i < 40; i++) {
      const st = await page.evaluate(() => ({ vis: !!VIS, step: VIS && VIS.step,
        text: ($('#app').innerText || '') + '\n' + ($('#sheet').hidden ? '' : $('#sheet').innerText),
        btns: [...document.querySelectorAll('#sheet .choice')].map(b => b.textContent.trim()) }));
      if (!st.vis) break;
      steps++;
      const m = st.text.match(new RegExp('.{0,40}(' + BAD.source + ').{0,40}'));
      if (m) probs.push(`step ${st.step}: "${m[0].replace(/\n/g, ' ')}"`);
      st.btns.forEach(t => { if (t === '—') dashes.add(st.step); });
      if (!st.btns.length) { probs.push(`step ${st.step}: no buttons`); break; }
      await page.click(`#sheet #ch${run % st.btns.length}`); await page.waitForTimeout(60);
    }
    const end = await page.evaluate(id => ({ vis: !!VIS, seen: (S.seenVisions || []).includes(id), tufts: (S.tuftVisions || []).includes(id), view, body: document.body.classList.contains('vision') }), id);
    if (end.vis) probs.push('never ended');
    seen = end.seen; tufts = tufts || end.tufts; back = end.view === 'explore' && !end.body;
  }
  ok(listed, `${id}: listed in the journal's Visions with a Watch button`);
  if (!listed) continue;
  ok(!probs.length, `${id}: ${runs} run(s), ${steps} steps, text clean ${probs.slice(0, 3).join(' | ')}`);
  ok(!dashes.size, `${id}: no continue button reading only "—"${dashes.size ? ' (steps ' + [...dashes].join(',') + ')' : ''}`);
  ok(seen, `${id}: recorded in seenVisions`);
  ok(!tufts, `${id}: a journal replay is not counted as Tuft's (tuftVisions)`);
  ok(back, `${id}: back on the map afterwards`);
}
// the other door: Tuft's reading, "✦ Look into the card" (Ch4 keys its vision by card: the Assassin is Rallick's)
const viaCard = await page.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  document.querySelectorAll('#modal,#chars,#settings').forEach(e => e.hidden = true);
  S = newState('Hask'); S.chapter = 4; S.squad = ['sgt', 'brisk', 'kettle', 'tuft', 'ohl']; migrate(S); S.card = 'assassin'; S.seenVisions = []; S.tuftVisions = []; save();
  startExplore(CHAPTERS[4].area.id); window.__done = 0; cardSequence(() => { window.__done = 1; }); await wait(300);
  const b = $('#cfVis'); if (!b) return 'no Look into the card button'; b.click(); await wait(150);
  const id = VIS && VIS.id;
  for (let i = 0; i < 40 && VIS; i++) { const c = $('#sheet #ch0'); if (!c) break; c.click(); await wait(40); }
  return `${id} seen=${(S.seenVisions || []).includes(id)} tuft=${(S.tuftVisions || []).includes(id)} done=${window.__done} open=${!!VIS}`;
});
ok(viaCard === 'v4_rallick seen=true tuft=true done=1 open=false', 'from the reading: ' + viaCard);
ok(!errors.length, 'no page errors ' + errors.join(' | '));
await br.close(); srv.kill(); process.exit(fail);
