// Book Two's seven Deck visions (56_b2_visions.js): each is played start to end from the journal with each kind of reader (Marrow; Yedda, a
// column woman with no squad sheet; the old Kanese, who is a he; and a stranger, for the fallback words), every choice picked at least once across runs. No page errors, no
// undefined/NaN/${ in the text, no bare "—" button; the closing step is spoken by the reader (visReader().name) and draws the reader's figure,
// and a second watching gets 36b's replay line in the reader's name. The journal lists Book Two's visions only in Book Two (one per chapter
// reached), and Book One's list and visionFor are unchanged. The reading path (playVision with a callback) counts the vision as the reader's.
// Usage: node tools/b2visions_test.mjs   (exit 1 on a failure)
import { server, browser, openGame } from './page.mjs';
const srv = await server(); const br = await browser();
const { page, errors } = await openGame(br, srv.url, { fast: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = (f, a) => page.evaluate(f, a);
const BAD = /\bundefined\b|\bNaN\b|\$\{|\[object/;
const READERS = [{id:'marrow', name:'Marrow', he:false, fig:'marrow', line:/Marrow lets the card go/}, {id:'yedda', name:'Yedda', he:false, fig:'hissari_w', line:/Yedda lets the card go/},
  {id:'kanese', name:'The old Kanese', mid:'the old Kanese', he:true, fig:'hissari_m', line:/The old Kanese lets the card go[\s\S]*His hands are cold/},
  {id:'stranger', name:'Tobb', he:true, fig:'hissari_m', line:/Tobb lets the card go[\s\S]*His hands are cold/}];
// a Book Two sergeant on the map in chapter ch, with the reader stubbed (the readings builder's VISREADER is kept and put back after)
const setup = (ch, r) => ev(([ch, r]) => {
  document.querySelectorAll('#modal,#chars,#settings').forEach(e => e.hidden = true);
  if (window.__visR === undefined) window.__visR = VISREADER;
  VISREADER = r ? () => ({id:r.id, name:r.name, mid:r.mid, he:r.he}) : window.__visR;
  setBook('dg'); S = newStateDG('Hask'); S.chapter = ch; migrate(S); S.picksDue = []; S.seenVisions = []; S.tuftVisions = []; notes = []; save();
  startExplore(CHAPTERS[ch].area.id);
}, [ch, r]);
const journalIds = () => ev(() => { openModal('journal'); document.querySelectorAll('#modal details').forEach(d => d.open = true);
  const ids = [...document.querySelectorAll('#modal [data-vision]')].map(b => b.dataset.vision); return ids; });

// ---- registration ----
const reg = await ev(() => ({b2:Object.keys(VISIONS).filter(k => VISIONS[k].book === 'dg').map(k => [k, VISIONS[k].ch, !VISIONS[k].cards]), b1:VISION_IDS.slice(), bgs:Object.keys(VISBG)}));
ok(reg.b2.length === 7 && reg.b2.every(([k, ch, nc], i) => ch === i + 1 && nc), `seven Book Two visions, one per chapter 1..7, none keyed by card (${reg.b2.map(x => x[0]).join(' ')})`);
ok(reg.b1.length === 10 && reg.b1.every(k => !/^b2/.test(k)), `Book One's VISION_IDS unchanged (${reg.b1.length})`);

// ---- Book One: the journal and visionFor are as they were ----
const b1 = await ev(() => { document.querySelectorAll('#modal,#chars,#settings').forEach(e => e.hidden = true); setBook('gotm'); S = newState('Hask'); S.chapter = 7; S.squad = ['sgt', 'brisk', 'kettle', 'tuft', 'ohl']; migrate(S); S.picksDue = []; save();
  startExplore(CHAPTERS[7].area.id); openModal('journal'); document.querySelectorAll('#modal details').forEach(d => d.open = true);
  const ids = [...document.querySelectorAll('#modal [data-vision]')].map(b => b.dataset.vision);
  const vf = [1, 2, 3, 5, 6, 7].map(c => visionFor(c, 'oponn')).concat(['assassin', 'knight', 'oponn', 'herald'].map(c => visionFor(4, c)));
  const text = (document.querySelector('#modal .vlist') || {}).previousElementSibling ? document.querySelector('#modal .vlist').previousElementSibling.textContent : '';
  document.querySelectorAll('#modal').forEach(e => e.hidden = true); return {ids, vf, text}; });
ok(b1.ids.join() === reg.b1.join(), `Book One's journal lists its ten visions, and only those (${b1.ids.length})`);
ok(b1.vf.join() === 'v1_paran,v2_crone,v3_qb,v5_paran,v6_rake,v7_lorn,v4_rallick,v4_hunter,v4_crokus,v4_sorry', 'Book One\'s visionFor is unchanged');
ok(/show Tuft/.test(b1.text), 'Book One\'s journal still names Tuft as the reader');

// ---- Book Two: the journal lists its own, by chapter reached ----
for (const ch of [1, 4, 7]) {
  await setup(ch, READERS[0]);
  const ids = await journalIds();
  ok(ids.join() === reg.b2.slice(0, ch).map(x => x[0]).join(), `Book Two chapter ${ch}: the journal lists ${ch} vision(s), all Book Two's (${ids.join(' ')})`);
  await ev(() => { $('#modal').hidden = true; });
}
const vf2 = await ev(() => [1, 2, 3, 4, 5, 6, 7].map(c => visionFor(c, 'oponn')).concat([visionFor(4, 'assassin'), visionFor(3, 'blank')]));
ok(vf2.join() === 'b2v1,b2v2,b2v3,b2v4,b2v5,b2v6,b2v7,b2v4,', 'Book Two\'s visionFor gives each chapter its vision, for any card but the blank');

// ---- every vision, every reader, every choice: from the journal (36b's replay ending, in the reader's name), then from a reading (the reader's own words) ----
const stepThrough = async (run) => { const probs = [], dashes = new Set(); let steps = 0, last = {};
  for (let i = 0; i < 40; i++) {
    const st = await ev(() => ({ vis:!!VIS, step:VIS && VIS.step, fig:VIS && VIS.fig, sp:($('#sheet .sp') || {}).textContent || '', txt:($('#sheet .txt') || {}).textContent || '',
      text:($('#app').innerText || '') + '\n' + ($('#sheet').hidden ? '' : $('#sheet').innerText), btns:[...document.querySelectorAll('#sheet .choice')].map(b => b.textContent.trim()) }));
    if (!st.vis) break;
    steps++; last = st;
    const m = st.text.match(new RegExp('.{0,40}(' + BAD.source + ').{0,40}'));
    if (m) probs.push(`step ${st.step}: "${m[0].replace(/\n/g, ' ')}"`);
    st.btns.forEach(t => { if (t === '—') dashes.add(st.step); });
    if (!st.btns.length) { probs.push(`step ${st.step}: no buttons`); break; }
    await page.click(`#sheet #ch${run % st.btns.length}`); await page.waitForTimeout(40);
  }
  const end = await ev(() => ({ vis:!!VIS, view, body:document.body.classList.contains('vision') }));
  if (end.vis) probs.push('never ended');
  return {probs, dashes, steps, last, back:end.view === 'explore' && !end.body}; };
for (const [id, ch] of reg.b2) {
  const runs = await ev(id => Math.max(1, ...VISIONS[id].steps.map(s => s.ch ? s.ch.length : 1)), id);
  for (const r of READERS) {
    const She = r.he ? 'He' : 'She'; let probs = [], steps = 0, back = true, listed = true, ends = [];
    for (let run = 0; run < runs; run++) {
      await setup(ch, r); if (run) await ev(id => { S.seenVisions = [id]; }, id);
      const opened = await ev(id => { openModal('journal'); document.querySelectorAll('#modal details').forEach(d => d.open = true);
        const b = document.querySelector(`#modal [data-vision="${id}"]`); if (!b) return false; b.click(); return true; }, id);
      if (!opened) { listed = false; break; }
      await page.waitForTimeout(120);
      const o = await stepThrough(run); probs.push(...o.probs, ...[...o.dashes].map(d => `bare "—" at step ${d}`)); steps += o.steps; back = back && o.back; ends.push(o.last);
    }
    ok(listed, `${id} (${r.name}): listed in Book Two's journal with a Watch button`);
    if (!listed) continue;
    ok(!probs.length, `${id} (${r.name}): ${runs} journal run(s), ${steps} steps, text clean ${probs.slice(0, 3).join(' | ')}`);
    ok(back, `${id} (${r.name}): back on the map afterwards`);
    ok(ends[0].sp === r.name && new RegExp(`${r.name} lets the card go\\. ${She} doesn.t say anything`).test(ends[0].txt) && ends[0].fig === r.fig, `${id} (${r.name}): from the journal the last step is the reader's, with the reader's figure (${ends[0].fig})`);
    if (ends[1]) ok(new RegExp(`${She} has watched this one before`).test(ends[1].txt), `${id} (${r.name}): watched again, "has watched this one before"`);
    // the reading path: the reader's own closing words
    await setup(ch, r);
    await ev(id => { window.__done = 0; playVision(id, () => { window.__done = 1; }); }, id); await page.waitForTimeout(120);
    const o = await stepThrough(1);
    const rd = await ev(id => ({ reader:(S.tuftVisions || []).includes(id), done:window.__done }), id);
    ok(!o.probs.length && o.last.sp === r.name && r.line.test(o.last.txt) && o.last.fig === r.fig && rd.reader && rd.done === 1,
      `${id} (${r.name}): from a reading it ends in ${r.name}'s own words ("${(o.last.txt || '').slice(0, 60)}…"), and counts as the reader's ${o.probs.join(' | ')}`);
  }
}

// the backdrops paint at phone width without throwing, for every step
const paint = await ev(() => { const out = []; const cv = document.createElement('canvas'); cv.style.cssText = 'width:360px;height:154px;position:fixed;left:0;top:0'; document.body.appendChild(cv);
  Object.keys(VISIONS).filter(k => VISIONS[k].book === 'dg').forEach(id => VISIONS[id].steps.forEach((st, i) => { try { drawVision(cv, {id, bg:st.bg || VISIONS[id].bg, fig:st.fig != null ? st.fig : VISIONS[id].fig, step:i}, 3000); } catch (e) { out.push(`${id}/${i}: ${e.message}`); } }));
  cv.remove(); return out; });
ok(!paint.length, 'every Book Two vision backdrop paints at phone width ' + paint.join(' | '));
await ev(() => { if (window.__visR !== undefined) VISREADER = window.__visR; });
ok(!errors.length, 'no page errors ' + errors.join(' | '));
await br.close(); srv.kill(); process.exit(fail);
