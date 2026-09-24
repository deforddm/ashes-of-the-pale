// Content linter for Ashes of the Pale.
// Usage: node tools/lint.mjs [--json]   (builds nothing; run `python3 build.py` first)
// Loads index.html in headless Chromium, then evaluates every dialogue node under many
// randomised game states and checks references, soft-locks, template leaks, areas and battles.
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readdirSync(path.join(root, 'src')).filter(f => f.endsWith('.js')).map(f => [f, fs.readFileSync(path.join(root, 'src', f), 'utf8')]);
const all = src.map(s => s[1]).join('\n');

// flags: names read and written anywhere in the source
const flags = [...new Set([...all.matchAll(/S\.f\.([A-Za-z0-9_]+)/g)].map(m => m[1]))];
const setRe = n => new RegExp(`S\\.f\\.${n}\\s*(=(?!=)|\\+\\+|--|\\+=|-=|\\?\\?=|\\|\\|=)|\\+\\+S\\.f\\.${n}\\b|--S\\.f\\.${n}\\b`);
const written = flags.filter(n => setRe(n).test(all));
const readOnly = flags.filter(n => !written.includes(n));
const objFlags = flags.filter(n => new RegExp(`S\\.f\\.${n}\\s*(=|\\?\\?=)\\s*[\\[{]|S\\.f\\.${n}\\s*\\[|S\\.f\\.${n}\\.(filter|map|includes|length|push|some|forEach)|in S\\.f\\.${n}\\b|= S\\.f\\.${n};`).test(all));
// values assigned to string-valued flags (e.g. c2_key = 'light')
const flagVals = {};
for (const m of all.matchAll(/S\.f\.([A-Za-z0-9_]+)\s*=\s*'([^']+)'/g)) (flagVals[m[1]] ||= new Set()).add(m[2]);
for (const m of all.matchAll(/S\.f\.([A-Za-z0-9_]+)\s*===?\s*'([^']+)'/g)) (flagVals[m[1]] ||= new Set()).add(m[2]);
const flagValsObj = Object.fromEntries(Object.entries(flagVals).map(([k, v]) => [k, [...v]]));
const spriteKinds = [...new Set([...fs.readFileSync(path.join(root, 'src/18_figure_sprites.js'), 'utf8').matchAll(/case '([a-z_0-9]+)'/g)].map(m => m[1]))];
const portraitSrc = fs.readFileSync(path.join(root, 'src/19_portraits.js'), 'utf8');

const srv = await server(); const browser = await launch();
const { page, errors: pageErrors } = await openGame(browser, srv.url, {});
const res = await page.evaluate(({ flags, flagVals, spriteKinds, portraitSrc, objFlags }) => {
  const E = [], W = [];
  const err = (m) => E.push(m), warn = (m) => W.push(m);
  let seed = 1; const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const STATS = ['might', 'wits', 'guile'];
  const ALLIDS = Object.keys(TPL);
  const chOf = id => { const m = /^c(\d)_/.exec(id); return m ? +m[1] : 0; };
  function mk(ch, v) {
    S = newState('Hask'); S.chapter = ch; S.scene = 'talk';
    S.lvl = Math.min(8, 1 + ch); S.xp = LEVELS[S.lvl - 1] || 0;
    S.squad = [...PORDER]; if (v % 2 === 0 && ch >= 2) S.squad.push('ellis');
    if (v % 5 === 3) S.squad = S.squad.filter(x => x !== 'tuft' && x !== 'ohl');
    migrate(S);
    S.chapters = {}; for (let i = 0; i < ch; i++) S.chapters[i] = 'x';
    const setF = f => { if (objFlags.includes(f)) { S.f[f] = f === 'lastFallen' ? (rng() < .5 ? ['kettle'] : []) : {}; } else S.f[f] = flagVals[f] ? flagVals[f][Math.floor(rng() * flagVals[f].length)] : (rng() < .15 ? 2 : 1); };
    if (v === 1) flags.forEach(f => objFlags.includes(f) ? setF(f) : S.f[f] = (flagVals[f] && flagVals[f][0]) || 1);
    else if (v > 1) flags.forEach(f => { if (rng() < 0.35) setF(f); });
    S.f.wjRegard = v % 3 - 1;
    if (v % 4 === 1) S.dead = { kettle: { ch: 6, where: 'x' } };
    S.card = v % 3 === 0 ? null : Object.keys(CARDS)[v % Object.keys(CARDS).length];
    if (CHAPTERS[ch] && CHAPTERS[ch].card) S.card = CHAPTERS[ch].card.id; // in play the chapter's own card is the one drawn
    return S;
  }
  const bad = /\bundefined\b|\bNaN\b|\[object |\$\{|\bnull\b(?!\s*and)/;
  const ids = Object.keys(DLG);
  const refd = new Set();
  const VAR = 40;
  const deadEnds = {}, choiceless = {};
  for (const id of ids) {
    const ch = chOf(id);
    const seen = new Set();
    for (let v = 0; v < VAR; v++) {
      mk(ch, v);
      let n;
      try { n = DLG[id](); } catch (e) { const k = 'throw ' + id + ': ' + e.message; if (!seen.has(k)) { seen.add(k); err(k + ` (variant ${v})`); } continue; }
      if (!n || typeof n !== 'object') { err(`${id}: node did not return an object`); break; }
      if (typeof n.txt !== 'string' || !n.txt.trim()) { const k = 'notxt'; if (!seen.has(k)) { seen.add(k); err(`${id}: empty txt (variant ${v})`); } }
      else { const f = fmt(n.txt); const m = bad.exec(f); if (m) { const k = 'leak' + m[0]; if (!seen.has(k)) { seen.add(k); err(`${id}: text contains "${m[0]}" (variant ${v}): …${f.slice(Math.max(0, m.index - 80), m.index + 40).replace(/<[^>]+>/g, '')}…`); } } }
      if (n.after) { const f = fmt(n.after); const m = bad.exec(f); if (m && !seen.has('aft')) { seen.add('aft'); err(`${id}: after-text contains "${m[0]}"`); } }
      if (n.scene && n.scene !== 'explore' && !SCENES[n.scene]) { if (!seen.has('sc')) { seen.add('sc'); err(`${id}: unknown scene "${n.scene}"`); } }
      if (n.oncard && !CARDS[n.oncard[0]]) { if (!seen.has('card')) { seen.add('card'); err(`${id}: unknown card ${n.oncard[0]}`); } }
      if (!Array.isArray(n.ch)) { err(`${id}: ch is not an array`); break; }
      let vis;
      try { vis = n.ch.filter(c => !c.req || c.req()); } catch (e) { if (!seen.has('req')) { seen.add('req'); err(`${id}: req() throws: ${e.message}`); } continue; }
      if (!vis.length) { (choiceless[id] ||= []).push(v); }
      for (const c of n.ch) {
        if (typeof c.t !== 'string' || !c.t.trim()) { if (!seen.has('ct')) { seen.add('ct'); err(`${id}: a choice has no text`); } }
        else if (bad.test(c.t)) { if (!seen.has('ctl')) { seen.add('ctl'); err(`${id}: choice text leak: ${c.t}`); } }
        for (const key of ['go', 'fail']) {
          const g = c[key];
          if (typeof g === 'string') { refd.add(g); if (!DLG[g] && !seen.has('g' + g)) { seen.add('g' + g); err(`${id}: ${key} -> missing node "${g}"`); } }
          else if (g === undefined && key === 'go') {
            if (!seen.has('nogo' + c.t)) { seen.add('nogo' + c.t); (deadEnds[id] ||= new Set()).add(c.t); }
            if (n.scene && n.scene !== 'explore' && !seen.has('nogoscene' + c.t)) { seen.add('nogoscene' + c.t); err(`${id}: choice "${c.t.slice(0, 40)}" closes the sheet but the node sets scene "${n.scene}" (player left on a backdrop with no way on) (variant ${v})`); }
          }
        }
        if (c.check) {
          const [st, dc, who] = c.check;
          if (!STATS.includes(st) && !seen.has('st')) { seen.add('st'); err(`${id}: check on unknown stat "${st}"`); }
          if (typeof dc !== 'number' && !seen.has('dc')) { seen.add('dc'); err(`${id}: check DC not a number`); }
          if (typeof dc === 'number' && (dc < 8 || dc > 22) && !seen.has('dcr')) { seen.add('dcr'); warn(`${id}: unusual DC ${dc}`); }
          if (who && !TPL[who] && !seen.has('who')) { seen.add('who'); err(`${id}: check roller "${who}" unknown`); }
          if (who && !S.squad.includes(who) && !c.req && !seen.has('whoin' + v)) { /* roller not in squad: roller() still works but reads odd */ }
          if (c.fail === undefined && !seen.has('nofail')) { seen.add('nofail'); warn(`${id}: check "${c.t.slice(0, 50)}" has no fail target (failure closes the sheet)`); }
        }
      }
    }
  }
  for (const [id, vs] of Object.entries(choiceless)) err(`${id}: NO visible choices (soft-lock) in ${vs.length}/${VAR} variants`);
  const dead = Object.entries(deadEnds).map(([id, s]) => `${id}: [${[...s].map(t => t.slice(0, 40)).join(' | ')}]`);

  // areas
  const areaNodes = new Set();
  for (const [aid, a] of Object.entries(AREAS)) {
    const m = a.map, w = m[0].length;
    m.forEach((r, y) => { if (r.length !== w) err(`area ${aid}: row ${y} width ${r.length} != ${w}`); });
    const walkable = (x, y) => { const c = (m[y] || '')[x]; return c && c !== '#' && (a.walk.includes(c) || (a.triggers && a.triggers[c])); };
    if (!walkable(a.start.x, a.start.y)) err(`area ${aid}: start ${a.start.x},${a.start.y} not walkable ('${m[a.start.y][a.start.x]}')`);
    Object.entries(a.triggers || {}).forEach(([c, node]) => { areaNodes.add(node); refd.add(node); if (!DLG[node]) err(`area ${aid}: trigger ${c} -> missing node ${node}`); if (!m.some(r => r.includes(c))) warn(`area ${aid}: trigger tile '${c}' not on map`); });
    const occ = {};
    for (const n of a.npcs || []) {
      const c = (m[n.y] || '')[n.x];
      if (c === undefined) err(`area ${aid}: npc ${n.id} off map`);
      else if (c === '#') err(`area ${aid}: npc ${n.id} stands on a wall`);
      if (!spriteKinds.includes(n.kind)) warn(`area ${aid}: npc ${n.id} kind "${n.kind}" has no sprite case`);
      for (let v = 0; v < VAR; v++) { mk(chOf(aid) || 0, v); try { const nd = n.node(); refd.add(nd); areaNodes.add(nd); if (!DLG[nd]) err(`area ${aid}: npc ${n.id} -> missing node ${nd}`); } catch (e) { err(`area ${aid}: npc ${n.id} node() throws ${e.message}`); break; } }
      for (let v = 0; v < VAR; v++) { mk(0, v); try { n.show && n.show(); n.fresh && n.fresh(); } catch (e) { err(`area ${aid}: npc ${n.id} show/fresh throws ${e.message}`); break; } }
      // overlapping NPCs that can be visible at once
      const k = n.x + ',' + n.y; (occ[k] ||= []).push(n);
    }
    for (const [k, list] of Object.entries(occ)) if (list.length > 1) {
      for (let v = 0; v < VAR; v++) { mk(6, v); const vis = list.filter(n => !n.show || n.show()); if (vis.length > 1) { warn(`area ${aid}: npcs ${vis.map(n => n.id).join('+')} visible together at ${k}`); break; } }
    }
    // reachability of npcs/triggers from start (walls only)
    const seenT = new Set([a.start.x + ',' + a.start.y]), q = [[a.start.x, a.start.y]];
    while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of DIRS) { const nx = x + dx, ny = y + dy, kk = nx + ',' + ny; if (!seenT.has(kk) && walkable(nx, ny) && !(a.triggers && a.triggers[m[ny][nx]])) { seenT.add(kk); q.push([nx, ny]); } else if (!seenT.has(kk) && walkable(nx, ny)) seenT.add(kk); } }
    for (const n of a.npcs || []) if (!DIRS.some(([dx, dy]) => seenT.has((n.x + dx) + ',' + (n.y + dy)))) warn(`area ${aid}: npc ${n.id} at ${n.x},${n.y} unreachable from start`);
  }
  // battles
  const battleIds = Object.keys(BATTLES);
  for (const [bid, b] of Object.entries(BATTLES)) {
    if (b.map.length !== 10 || b.map.some(r => r.length !== 8)) err(`battle ${bid}: map is not 8x10`);
    if (!DLG[b.after]) err(`battle ${bid}: after -> missing node ${b.after}`); else refd.add(b.after);
    (b.party || []).forEach(([x, y], i) => { if ((b.map[y] || '')[x] !== '.' && (b.map[y] || '')[x] !== ',') warn(`battle ${bid}: party slot ${i} at ${x},${y} is '${(b.map[y] || '')[x]}'`); });
    if ((b.party || []).length < 6) warn(`battle ${bid}: only ${(b.party || []).length} party slots (Ellis makes 6)`);
    const chkFoe = (f, where) => { if (!FOES[f[0]]) err(`battle ${bid}: ${where} foe ${f[0]} missing`); else { const k = FOES[f[0]].kind || f[0]; if (!spriteKinds.includes(k)) warn(`battle ${bid}: foe ${f[0]} kind ${k} has no sprite case`); } if ((b.map[f[2]] || '')[f[1]] === '#') err(`battle ${bid}: ${where} foe ${f[0]} placed on wall ${f[1]},${f[2]}`); };
    b.foes.forEach(f => chkFoe(f, 'start'));
    (b.waves || []).forEach(w => w.foes.forEach(f => chkFoe(f, 'wave' + w.round)));
    (b.allies || []).forEach(f => { if (!FOES[f[0]]) err(`battle ${bid}: ally ${f[0]} missing`); });
    if (b.style && !['city', 'terrace', 'garden', 'storm', 'cellar', 'roof', 'plain', 'hills', 'estate', 'lake', 'dock', 'street'].includes(b.style)) warn(`battle ${bid}: style ${b.style}`);
  }
  // items, cards
  const itemIds = Object.keys(ITEMS);
  for (const [iid, it] of Object.entries(ITEMS)) {
    if (!['weapon', 'armour', 'trinket'].includes(it.slot)) err(`item ${iid}: bad slot ${it.slot}`);
    (it.who || []).forEach(w => { if (!TPL[w]) err(`item ${iid}: who ${w} unknown`); });
    if (!it.line) warn(`item ${iid}: no description line`);
  }
  for (const [cid, c] of Object.entries(CARDS)) { if (!c.fx && cid !== 'herald') warn(`card ${cid}: no fx text`); }
  // absent squadmates still named in the text: for each node, drop one squadmate (dead after Ch6's alley, or Ellis gone/never recruited) and look for their name
  const absent = {};
  for (const id of ids) {
    const ch = chOf(id); if (ch < 2) continue;
    const pool = ch >= 6 ? ['brisk', 'kettle', 'tuft', 'ohl', 'ellis'] : ['ellis'];
    for (const x of pool) {
      const nm = TPL[x].name, re = new RegExp('\\b' + nm + '\\b');
      for (let v = 0; v < 8; v++) {
        mk(ch, v); if (!S.squad.includes(x) && x !== 'ellis') continue;
        S.squad = S.squad.filter(q => q !== x);
        if (x !== 'ellis' || v % 2) { if (ch >= 6 && x !== 'ellis') { S.dead = { [x]: { ch: 6, where: 'An alley off the Daru District' } }; S.f.lastFallen = [x]; } }
        if (x === 'ellis') { if (v % 3 === 0) { S.f.ellisGone = 1; S.f.c5_ellisThrough = 1; } else if (v % 3 === 1) { S.f.c2_ellisRefused = 1; } }
        let n; try { n = DLG[id](); } catch (e) { continue; }
        const vis = (n.ch || []).filter(c => { try { return !c.req || c.req(); } catch (e) { return false; } });
        const text = [n.txt || '', n.after || '', ...vis.map(c => c.t)].join(' ');
        const mm = re.exec(text);
        if (mm) { const k = id + ' · ' + nm; if (!absent[k]) absent[k] = '…' + text.slice(Math.max(0, mm.index - 90), mm.index + 60).replace(/\s+/g, ' ') + '…'; break; }
      }
    }
  }
  const orphans = ids.filter(id => !refd.has(id));
  return { E, W, dead, absent, orphans, battleIds, itemIds, cardIds: Object.keys(CARDS), sceneIds: Object.keys(SCENES), nodeCount: ids.length, areaCount: Object.keys(AREAS).length };
}, { flags, flagVals: flagValsObj, spriteKinds, portraitSrc, objFlags });

// static cross-refs in source text
const E = res.E, W = res.W;
for (const [f, t] of src) {
  for (const m of t.matchAll(/startBattle\('([a-z_0-9]+)'/g)) if (!res.battleIds.includes(m[1])) E.push(`${f}: startBattle('${m[1]}') missing`);
  for (const m of t.matchAll(/\bgain\('([a-z_0-9]+)'\)/g)) if (!res.itemIds.includes(m[1])) E.push(`${f}: gain('${m[1]}') missing item`);
  for (const m of t.matchAll(/S\.card\s*=\s*'([a-z_0-9]+)'/g)) if (!res.cardIds.includes(m[1])) E.push(`${f}: card '${m[1]}' missing`);
  for (const m of t.matchAll(/\btalk\('([a-z_0-9]+)'\)/g)) { /* checked below */ }
}
// orphans: node ids that no string literal references at all (computed references are possible)
const trulyOrphan = res.orphans.filter(id => { const re = new RegExp(`['"\`]${id}['"\`]`, 'g'); return (all.match(re) || []).length === 0; });

const out = {
  summary: { nodes: res.nodeCount, areas: res.areaCount, errors: E.length, warnings: W.length, pageErrors: pageErrors.length },
  errors: E, warnings: W, pageErrors,
  choicesWithoutGo: res.dead,
  absentNamed: res.absent,
  orphanNodes: trulyOrphan,
  flagsReadNeverWritten: readOnly,
};
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 1));
else {
  console.log('SUMMARY', JSON.stringify(out.summary));
  const sec = (h, a) => { if (a.length) { console.log(`\n== ${h} (${a.length})`); a.forEach(x => console.log(' - ' + x)); } };
  sec('ERRORS', E); sec('PAGE ERRORS', pageErrors); sec('WARNINGS', W); sec('Choices with no go (close the sheet)', res.dead); sec('Orphan nodes (never referenced by a literal)', trulyOrphan); sec('REVIEW: text names a squadmate who is not in the squad (dead / gone / never joined) — check each is deliberate', Object.entries(res.absent).map(([k, v]) => k + '  ' + v)); sec('Flags read but never written', readOnly);
}
await browser.close(); srv.kill();
process.exit(E.length || pageErrors.length ? 1 : 0);
