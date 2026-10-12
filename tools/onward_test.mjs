// Onward audit: nothing opened from the map commits the squad by itself.
// For every area, every trigger node and every NPC node reachable from the map (and the conversation that follows from it
// by plain string links), under many random states for that chapter:
//  - a node that offers a way onward (another area, a battle, the end or start of a chapter, or a jump into a new scene
//    that cannot come back to the map) must also offer a way to stay on the map: a choice with no go, go:()=>startExplore()
//    with no area or the same area, or a link into talk that can still come back;
//  - its own fx (run the moment it opens) must not move the story on.
// Choices are run with the moving parts stubbed (talk, startExplore, startBattle, chapterEnd, startChapter …) on a copy of
// the state, so a conditional jump ("if the tent's done, the raid starts") is seen in the states where it happens.
// Exceptions by design are listed in ALLOW, with why.
// Usage: node tools/onward_test.mjs [--list]   (build first; exit 1 on a failure)
import { server, browser as launch, openGame, root } from './page.mjs';
import fs from 'fs';
import path from 'path';

/* nodes that may commit when opened from the map, by design (see the comment by each) */
const ALLOW = {
  // the prologue's last beat: the grey cloak is waiting at the tunnel mouth as the squad climbs out with the satchel; he stands
  // in the only way off the map, the prologue has nothing left on it, and every answer to him is the end of the prologue
  claw2: 'the grey cloak blocks the tunnel mouth as the squad comes up with the satchel: the prologue ends on him, by design',
};
const list = process.argv.includes('--list');
const src = fs.readdirSync(path.join(root, 'src')).filter(f => f.endsWith('.js')).map(f => [f, fs.readFileSync(path.join(root, 'src', f), 'utf8').split('\n')]);
const where = id => { const re = new RegExp(`(^|[\\s{,])${id}\\s*:\\s*\\(`); for (const [f, ls] of src) { const i = ls.findIndex(l => re.test(l)); if (i >= 0) return `src/${f}:${i + 1}`; } return '?'; };

const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, {});
const res0 = await page.evaluate(() => {
  let seed = 7; const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const all = Object.values(DLG).map(String).join('\n') + Object.values(AREAS).map(a => (a.npcs || []).map(n => String(n.node) + String(n.show || '')).join('')).join('');
  const flags = [...new Set([...all.matchAll(/S\.f\.([A-Za-z0-9_]+)/g)].map(m => m[1]))];
  /* area -> [book, chapter] */
  const chOf = {}; chOf.pale = ['gotm', 0];
  for (const [book, CHS] of [['gotm', BOOK === 'gotm' ? CHAPTERS : BOOKSNAP.gotm.ch], ['dg', BOOKSNAP.dg.ch]])
    for (const [n, CH] of Object.entries(CHS)) (CH.areas || (CH.area ? [CH.area] : [])).forEach(a => { chOf[a.id] = [book, +n]; });
  const gating = {};
  for (const [aid, a] of Object.entries(AREAS)) { const t = (a.npcs || []).map(n => String(n.show || '') + String(n.node) + String(n.fresh || '')).join(' ') + Object.values(a.triggers || {}).map(id => String(DLG[id] || '')).join(' ') + String(a.quest || '');
    gating[aid] = [...new Set([...t.matchAll(/S\.f\.([A-Za-z0-9_]+)/g)].map(m => m[1]))]; }
  function mkState(aid, v) {
    const [book, ch] = chOf[aid] || ['gotm', 1];
    if (book === 'dg') { S = newStateDG('Hask'); if (v % 2 === 0 && TPL.redblade) S.squad.push('redblade'); S.chain = {water: Math.floor(rng() * 13), column: Math.floor(rng() * 40)}; }
    else { S = newState('Hask'); S.squad = [...PORDER]; if (v % 2 === 0 && ch >= 2) S.squad.push('ellis'); }
    S.chapter = ch; S.chapters = {}; for (let i = 0; i < ch; i++) S.chapters[i] = 'x';
    S.lvl = Math.min(8, 1 + ch); S.xp = LEVELS[S.lvl - 1] || 0; migrate(S);
    S.area = aid; S.scene = 'explore'; S.silver = 5 + (v % 4) * 10;
    /* the flags that pick who stands on this map and which version of each trigger opens: every combination of them in
       turn (or a random one when there are too many), the rest of the chapter's flags at random */
    const g = gating[aid], p = [.1, .3, .5][v % 3];
    if (v > 0) flags.forEach(f => { if (rng() < p) S.f[f] = rng() < .15 ? 2 : 1; });
    g.forEach((f, i) => { const on = g.length <= 7 ? (v >> i) & 1 : rng() < .5; if (on) S.f[f] = S.f[f] || 1; else delete S.f[f]; });
    S.card = null; return S;
  }
  /* run a go/fx with the moving parts stubbed: what does it call? */
  const REAL = {}, rec = [], THROWN = new Set();
  const STUB = {
    talk: id => rec.push(['talk', id]), startExplore: a => rec.push(['explore', a]), startBattle: id => rec.push(['battle', id]),
    chapterEnd: n => rec.push(['chapterEnd', n]), startChapter: n => rec.push(['startChapter', n]), finish: k => rec.push(['chapterEnd', 0]),
    sceneShell: () => {}, cardSequence: done => done(), openPicks: done => done(), save: () => {}, elog: () => {}, updExplore: () => {}, closeSheet: () => {}, toTop: () => {},
    playBones: () => rec.push(['game']), playKruppeCups: () => rec.push(['game']), playRoofRun: () => rec.push(['game']), playMasks: () => rec.push(['game']), playCharges: () => rec.push(['game']),
    showChapterIntro: () => rec.push(['startChapter']), dockSheet: () => {}, updSilver: () => {},
  };
  const stub = on => { for (const k of Object.keys(STUB)) { if (typeof window[k] !== 'function') continue; if (on) { REAL[k] = window[k]; window[k] = STUB[k]; } else window[k] = REAL[k]; } };
  const run = (fns) => { rec.length = 0; let err = null; for (const f of fns) { if (typeof f !== 'function') continue; try { f(); } catch (e) { err = e.message; break; } } return {calls: rec.slice(), err}; };
  const clone = s => JSON.parse(JSON.stringify(s));
  const onwardOf = (calls, aid) => calls.filter(([k, a]) => k === 'battle' || k === 'chapterEnd' || k === 'startChapter' || (k === 'explore' && a && a !== aid)).map(([k, a]) => k === 'explore' ? 'area ' + a : k === 'battle' ? 'battle ' + a : k);
  /* a hidden jump: a go that sometimes just goes back to the map (startExplore() or nothing) and sometimes starts a scene */
  const expand = (fn, seen = new Set(), d = 0) => { let t = String(fn); if (d > 4) return t;
    for (const m of t.matchAll(/(^|[^.\w$])([A-Za-z_$][\w$]*)\s*\(/g)) { const nm = m[2]; if (seen.has(nm) || ['if', 'for', 'while', 'switch', 'function', 'return', 'talk', 'startExplore', 'startBattle'].includes(nm)) continue; seen.add(nm);
      let f; try { f = (0, eval)(nm); } catch (e) { continue; } if (typeof f === 'function' && !/\[native code\]/.test(String(f))) t += '\n' + expand(f, seen, d + 1); }
    return t; };
  const hidden = c => typeof c.go === 'function' && /\btalk\s*\(/.test(expand(c.go)) && (/\bstartExplore\s*\(\s*\)/.test(expand(c.go)) || /\bif\s*\(/.test(String(c.go)) && !/\belse\b/.test(String(c.go)));
  /* can a talk that opens node id (under the current S) still come back to the map? (any path to a staying choice) */
  function canStay(id, aid, depth, seen) {
    if (!DLG[id] || depth > 14 || seen.has(id)) return false;
    seen.memo ||= new Map(); if (seen.memo.has(id)) return seen.memo.get(id);
    seen.add(id); const r = canStay1(id, aid, depth, seen); seen.delete(id); if (!seen.size) seen.memo.set(id, r); else if (r) seen.memo.set(id, r); return r;
  }
  function canStay1(id, aid, depth, seen) {
    const base = clone(S); let n; try { n = DLG[id](); } catch (e) { THROWN.add(id + ': ' + e.message); S = base; return true; }
    if (n.fx) { const r = run([n.fx]); if (onwardOf(r.calls, aid).length) { S = base; return false; } }
    const after = clone(S); let ok = false;
    const vis = (n.ch || []).filter(c => { try { return !c.req || c.req(); } catch (e) { return false; } });
    for (const c of vis) { if (ok) break;
      for (const key of c.check ? ['go', 'fail'] : ['go']) { if (ok) break; const g = c[key];
        S = clone(after);
        if (g === undefined) { ok = true; break; }
        if (typeof g === 'string') { if (canStay(g, aid, depth + 1, seen)) ok = true; continue; }
        const r = run([c.fx, g]); const t = r.calls.filter(([k]) => k === 'talk');
        if (onwardOf(r.calls, aid).length) continue;
        if (!t.length) { ok = true; break; }
        if (t.some(([, z]) => canStay(z, aid, depth + 1, seen))) ok = true; } }
    S = base; return ok;
  }
  /* what a choice does from node n: onward reasons, or 'stay', or 'talk' (more conversation that can come back) */
  function judge(c, aid, base, deep0) {
    const outs = []; let stay = false;
    for (const key of c.check ? ['go', 'fail'] : ['go']) { const g = c[key]; S = clone(base);
      if (g === undefined) { stay = true; continue; }
      if (typeof g === 'string') { if (deep0) { S = clone(base); run([c.fx]); if (!canStay(g, aid, 0, new Set())) outs.push('only on, by ' + g); } continue; } // the conversation goes on: from the map, only a talk that can still come back
      const r = run([c.fx, g]); const o = onwardOf(r.calls, aid); if (r.err && !r.calls.length) { outs.push('?' + r.err); continue; }
      const t = r.calls.filter(([k]) => k === 'talk').map(([, z]) => z);
      const jumps = t.filter(z => { S = clone(base); run([c.fx]); return !canStay(z, aid, 0, new Set()); });
      outs.push(...o, ...jumps.map(z => 'into ' + z));
      if (!o.length && !jumps.length && (!t.length || r.calls.some(([k]) => k === 'explore'))) stay = true;
    }
    S = base; return {outs: outs.filter(x => x[0] !== '?'), stay: stay && !c.check};
  }
  const out = {}, VAR = 128, view0 = view, lines = {n: 0, bad: new Set(), ex: []};
  stub(true); view = 'explore'; // opened from the map
  try {
  for (const [aid, a] of Object.entries(AREAS)) {
    for (let v = 0; v < VAR; v++) {
      mkState(aid, v); const base0 = clone(S);
      const entries = []; Object.entries(a.triggers || {}).forEach(([c, id]) => entries.push([id, 'trigger ' + c]));
      (a.npcs || []).forEach(n => { try { if (n.show && !n.show()) return; entries.push([n.node(), 'npc ' + n.id]); } catch (e) {} });
      /* each entry, then the conversation that follows by string links (go/fail) */
      for (const [eid, how] of entries) {
        const q = [[eid, 0, base0]], seen = new Set();
        while (q.length) {
          const [id, d, st] = q.shift(); if (seen.has(id) || !DLG[id] || d > 10) continue; seen.add(id);
          S = clone(st); let n; try { n = DLG[id](); } catch (e) { continue; }
          const why = [];
          if (n.fx && !d) { const r = run([n.fx]); const o = onwardOf(r.calls, aid); if (o.length) why.push('fx on open: ' + o.join(', ')); }
          const base = clone(S);
          const vis = (n.ch || []).filter(c => { try { return !c.req || c.req(); } catch (e) { return false; } });
          /* opened from the map: anything onward needs a way to stay beside it. Further into the talk the player has chosen
             to go on, and only a hidden jump counts (a "leave" that starts the next scene when something else is done) */
          const raw = vis.map(c => [c, judge(c, aid, base, true)]);
          const js = raw.map(([c, j]) => [c, d ? {...j, outs: hidden(c) ? j.outs.filter(o => /^into /.test(o)) : []} : j]);
          /* the unspoken-to line: never on a node that only stays (every choice here closes, or goes back to this map) */
          S = clone(base); let line = ''; try { line = unspokenLine(id, vis); } catch (e) { line = 'THROW ' + e.message; }
          if (line) { lines.n++; if (/THROW|undefined|NaN|\bHask\b/.test(line) || !raw.some(([, j]) => j.outs.length) && !vis.some(c => typeof c.go === 'string' || typeof c.fail === 'string')) lines.bad.add(`${id} [${aid}]: ${line}`); else if (lines.ex.length < 4 && !lines.ex.some(x => x.startsWith(id))) lines.ex.push(`${id}: ${line}`); }
          const fw = js.filter(([, j]) => j.outs.length);
          if (fw.length && !js.some(([, j]) => j.stay))
            why.push('no way to stay: ' + fw.map(([c, j]) => `"${c.t.slice(0, 36)}" -> ${[...new Set(j.outs)].join(', ')}`).join('; '));
          if (why.length) { const o = (out[id] ||= {id, area: aid, how: d ? `${how} -> … (${d} deep)` : how, depth: d, why: new Set(), v: 0}); why.forEach(w => o.why.add(w)); o.v++; o.depth = Math.min(o.depth, d); }
          for (const c of vis) for (const g of [c.go, c.fail]) if (typeof g === 'string') q.push([g, d + 1, base]);
        }
      }
    }
  }
  } finally { stub(false); view = view0; }
  return {lines: {n: lines.n, bad: [...lines.bad], ex: lines.ex}, thrown: [...THROWN], flagged: Object.values(out).map(o => ({...o, why: [...o.why]}))};
});
const res = res0.flagged; if (list && res0.thrown.length) console.log('note: nodes that threw under a random state: ' + res0.thrown.slice(0, 20).join(' | '));
let fail = 0;
for (const o of res.sort((p, q) => where(p.id).localeCompare(where(q.id), undefined, {numeric: true}))) {
  const ok = !!ALLOW[o.id];
  if (!ok) fail = 1;
  if (!ok || list) console.log(`${ok ? 'ok   (allowed: ' + ALLOW[o.id] + ')' : 'FAIL'} ${o.id} [${o.area} · ${o.how}] ${where(o.id)} (${o.v} states): ${o.why.join(' | ')}`);
}
console.log((fail ? 'FAIL' : 'ok  ') + ` onward audit: ${res.length} node(s) flagged, ${res.filter(o => !ALLOW[o.id]).length} not allowed`);
const L = res0.lines; if (list) console.log('unspoken-to line, e.g.: ' + L.ex.join(' | '));
for (const b of L.bad.slice(0, 20)) console.log('FAIL unspoken-to line on a node that does not lead away: ' + b);
if (L.bad.length) fail = 1;
console.log(`${L.n && !L.bad.length ? 'ok  ' : 'FAIL'} the unspoken-to line shown ${L.n} times across the audit states, never on a node that stays`); if (!L.n) fail = 1;
const unused = Object.keys(ALLOW).filter(k => !res.some(o => o.id === k)); if (unused.length) console.log('note: allowed but no longer flagged: ' + unused.join(', '));
/* the owner's case, in the real sheet: Chapter One, both reports made, Captain Paran not yet spoken to. Pell's wagon offers the
   night and a way to stay, with the reminder; "Not yet." leaves the squad on the map; the burial pits (only a way to stay) say nothing */
const ui = await page.evaluate(async () => {
  S = newState('Hask'); S.squad = [...PORDER]; migrate(S); S.chapter = 1; S.f.c1_wj = 1; S.f.c1_reported = 1; S.f.c1_tent = 1; S.f.c1_bones = 1; S.f.c1_claw = 1; S.silver = 3; save(); startExplore('pale_night');
  talk('c1_pell'); const sh = document.getElementById('sheet');
  const r = {line: (sh.querySelector('.unspoken') || {}).textContent || '', ch: [...sh.querySelectorAll('.choice')].map(b => b.textContent)};
  const ny = [...sh.querySelectorAll('.choice')].find(b => b.textContent === 'Not yet.'); ny && ny.click(); await new Promise(z => setTimeout(z, 50));
  r.after = {hidden: sh.hidden, area: S.area, view, raid: !!S.f.c1_raid};
  talk('c1_pits'); r.pits = !!sh.querySelector('.unspoken'); closeSheet();
  S.f.c1_paran = 1; talk('c1_pell'); r.noFresh = !!sh.querySelector('.unspoken'); closeSheet();
  return r; });
const okk = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
okk(/Paran.s still waiting on a word/.test(ui.line), `Pell's wagon with the night ready and Paran unspoken-to: the reminder shows (${ui.line})`);
okk(ui.ch.includes('Back to the Fourth\u2019s fire.') || ui.ch.some(t => /Back to the Fourth.s fire/.test(t)), 'Pell\'s wagon offers the night: ' + ui.ch.join(' | '));
okk(ui.after.hidden && ui.after.area === 'pale_night' && ui.after.view === 'explore' && !ui.after.raid, '"Not yet." closes the sheet and leaves the squad on the map, the raid not started');
okk(!ui.pits, 'the burial pits (no way on) never carry the reminder');
okk(!ui.noFresh, 'nobody left to talk to: no reminder');
if (errors.length) { console.log('FAIL page errors ' + errors.join(' | ')); fail = 1; }
await br.close(); srv.kill(); process.exit(fail);
