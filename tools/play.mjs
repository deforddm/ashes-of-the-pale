// Playthrough bot for Ashes of the Pale: drives the real UI from the title screen through the
// prologue, all seven chapters and the finale, picking choices at random (preferring unseen nodes),
// walking to NPCs and trigger tiles, and fighting battles with the enemy AI on the squad's side.
// Usage: node tools/play.mjs [runs=3] [--cheat] [--from=N] [--shots=dir] [--quiet] [--wide]
//   --cheat     win every battle instantly (flow testing only)
//   --from=N    start from a synthetic save at the start of chapter N
//   --shots=dir screenshot on every new view/area and on any problem
//   --wide      play in a 1366x768 window (the wide, PC layout) instead of a phone
// Exit code 1 if any run hit a page error, a stuck state, or failed to reach the end.
import fs from 'fs';
import path from 'path';
import { server, browser as launch, openGame, root } from './page.mjs';
const args = process.argv.slice(2);
const runs = +(args.find(a => /^\d+$/.test(a)) || 3);
const cheat = args.includes('--cheat');
const quiet = args.includes('--quiet');
const wide = args.includes('--wide');
const from = +((args.find(a => a.startsWith('--from=')) || '').split('=')[1] || 0);
const shots = (args.find(a => a.startsWith('--shots=')) || '').split('=')[1] || '';
if (shots) fs.mkdirSync(shots, { recursive: true });

const srv = await server();
const browser = await launch();

const BOT = () => {
  window.__bot = {
    visited: {}, hist: [], nodeVisits: 0, choices: 0, battles: [], cur: null, events: [], tapFails: 0, targets: {}, cheat: false, lastView: '',
    ev(m) { this.events.push(`[ch${S ? S.chapter : '-'} ${view}${S && S.node ? ' ' + S.node : ''}] ${m}`); },
    sig() { return [$('#mg').hidden ? '' : (($('#mgPanel') || {}).textContent || ''), view, S && S.node, S && S.area, S && S.pos && S.pos.x, S && S.pos && S.pos.y, B && B.round, B && B.idx, B && B.units.map(u => u.hp + ':' + u.x + u.y).join(''), !$('#sheet').hidden, ($('#sheet').textContent || '').length, !$('#modal').hidden, S && S.finPage].join('|'); },
    tick() {
      const sh = $('#sheet'), m = $('#modal');
      if (!$('#mg').hidden) { const bs = [...$('#mg').querySelectorAll('[data-bot]:not([disabled])')], stay = bs.filter(b => b.id !== 'mgLeave'); if (!stay.length && !$('#chCheck')) return 'mg-wait'; const pool = stay.length && Math.random() < .95 ? stay : bs; if (pool.length) { pool[Math.floor(Math.random() * pool.length)].click(); return 'mg'; } return 'mg-wait'; } // a game at the table: mostly play it out, now and then walk away
      if (!$('#chars').hidden) { closeChars(); return 'chars'; }
      if (!$('#settings').hidden) { $('#settings').hidden = true; return 'settings'; }
      if (!m.hidden) {
        const pick = m.querySelector('#bPick');
        if (pick) { const g = {}; m.querySelectorAll('[data-k]').forEach(b => (g[b.dataset.id] ||= []).push(b)); Object.values(g).forEach(a => a[Math.floor(Math.random() * a.length)].click()); if (!pick.disabled) pick.click(); return 'picks'; }
        m.hidden = true; return 'modal';
      }
      const dice = $('#dice'); if (dice) { dice.click(); return 'dice'; }
      if (!$('#cardfx').hidden) { const b = $('#cardfx').querySelector('button:not([disabled])'); if (b) { b.click(); return 'cardfx-btn'; } $('#cardfx').click(); return 'cardfx'; }
      if (view === 'title') { const b = $('#bNew') || $('#bNewSgt'); if (b) { b.click(); return 'new'; } }
      if (!sh.hidden) {
        const retry = $('#bRetry');
        if (retry) { const b = this.cur; if (b) { b.losses++; this.ev(`lost battle ${b.id} (attempt ${b.losses})`); } retry.click(); return 'retry'; }
        const btns = [...sh.querySelectorAll('.choice')].filter(b => !b.disabled);
        if (!btns.length) return 'wait-choice';
        const id = S.node; if (id && !this.visited[id]) { this.visited[id] = 1; this.nodeVisits++; }
        const opts = btns.map(b => { const c = curCh[+b.dataset.i]; let w = 1;
          if (typeof c.go === 'string') w = this.visited[c.go] ? 1 : 6;
          else if (typeof c.go === 'function') w = 3;
          else w = 0.6; // leave / close
          if (c.check) w *= 1.2;
          return { b, w }; });
        let r = Math.random() * opts.reduce((a, o) => a + o.w, 0); const o = opts.find(o => (r -= o.w) <= 0) || opts[0];
        this.hist.push(`${S.node} [${view}${G.sceneKind ? ':' + G.sceneKind : ''}] -> ${o.b.textContent.slice(0, 50)}`); this.hist = this.hist.slice(-8);
        this.choices++; o.b.click(); return 'choice';
      }
      if (view === 'intro') { const g = $('#bGo'); if (g && !g.disabled) { g.click(); return 'intro-go'; } return 'intro-wait'; }
      if (view === 'end') { const n = $('#bNext') || $('#bEpi'); if (n) { n.click(); return 'next-chapter'; } return 'END'; }
      if (view === 'finale') { const n = $('#fNext'); if (n) { n.click(); return 'finale-next'; } return 'END'; }
      if (view === 'battle') {
        if (!B) return 'battle-none';
        if (B.id !== (this.cur && this.cur.id) || B !== this.cur._B) { this.cur = { id: B.id, losses: (this.cur && this.cur.id === B.id) ? this.cur.losses : 0, rounds: 0, _B: B, start: performance.now() }; this.battles.push(this.cur); }
        this.cur.rounds = B.round;
        if (B.over) return 'battle-over';
        if (B.busy || !B.cur || B.cur.side !== 'p' || B.cur.ally || !sh.hidden) return 'battle-wait';
        if (this.cheat || this.cur.losses >= 2 || B.round > 25) {
          this.cur.cheated = true; B.units.filter(u => u.side === 'e').forEach(u => u.hp = 0); B.round = 99; B.busy = true; checkEnd(); return 'battle-cheat';
        }
        // squad turn: use the enemy AI's own logic for the squadmate (move, flank, attack)
        B.busy = true; ai(B.cur, B.turn); return 'battle-ai';
      }
      if (view === 'explore') {
        if (walking) return 'walking';
        const a = AREA();
        const cands = [];
        (a.npcs || []).filter(n => !n.show || n.show()).forEach(n => { const k = a.id + ':' + n.id; const f = n.fresh ? n.fresh() : false; cands.push({ k, x: n.x, y: n.y, w: (f ? 8 : 1) / (1 + (this.targets[k] || 0)) }); });
        Object.keys(a.triggers || {}).forEach(ch => a.map.forEach((row, y) => [...row].forEach((c, x) => { if (c === ch) { const k = a.id + ':t' + ch; cands.push({ k, x, y, w: 3 / (1 + (this.targets[k] || 0) * .5) }); } })));
        if (!cands.length) { this.ev('explore: no targets'); return 'explore-empty'; }
        let r = Math.random() * cands.reduce((s, c) => s + c.w, 0); const c = cands.find(c => (r -= c.w) <= 0) || cands[0];
        this.targets[c.k] = (this.targets[c.k] || 0) + 1;
        const before = JSON.stringify(S.pos); exploreTap(c.x, c.y);
        if (!walking && $('#sheet').hidden && JSON.stringify(S.pos) === before) { this.tapFails++; if (this.tapFails % 25 === 0) this.ev(`explore: tap on ${c.k} at ${c.x},${c.y} did nothing (${this.tapFails})`); }
        return 'explore-tap';
      }
      if (view === 'scene' && sh.hidden) return 'STUCK-scene-no-sheet';
      return 'idle-' + view;
    },
  };
};

// build a synthetic save at the start of chapter n (for --from)
const SYNTH = (n) => {
  S = newState('Hask'); S.lvl = Math.min(8, 1 + n); S.xp = LEVELS[S.lvl - 1]; S.chapters = { 0: 'given' };
  const keys = { 1: 'line', 2: 'light', 3: 'report', 4: 'shield', 5: 'hold', 6: 'x' };
  for (let i = 1; i < n; i++) S.chapters[i] = keys[i];
  if (n >= 3) S.squad.push('ellis'); migrate(S);
  S.picksDue = []; if (S.lvl >= 3) { S.squad.forEach(id => { const o = PICKS[3][id]; if (o) S.picks[id].push(o[0][0]); }); }
  if (S.lvl >= 5) S.squad.forEach(id => S.picks[id].push('iron')); if (S.lvl >= 7) S.squad.forEach(id => S.picks[id].push('keen'));
  save(); startChapter(n);
};

let bad = 0;
async function run(i) {
  const { ctx, page, errors: errs } = await openGame(browser, srv.url, wide ? { fast: true, width: 1366, height: 768 } : { fast: true });
  page.on('console', m => { if (m.type() === 'warning' && /finale|backdrop leave|unknown/i.test(m.text())) errs.push('warn: ' + m.text()); });
  await page.evaluate(BOT);
  if (cheat) await page.evaluate(() => { __bot.cheat = true; });
  if (from) await page.evaluate(SYNTH, from);
  const t0 = Date.now();
  let last = '', same = 0, status = '', ticks = 0, chapterSeen = -1, areaSeen = '', viewSeen = '', errShot = 0;
  const problems = [];
  const shot = async (name) => { if (!shots) return; try { await page.screenshot({ path: path.join(shots, `r${i}_${String(ticks).padStart(6, '0')}_${name}.png`) }); } catch (e) {} };
  while (true) {
    ticks++;
    try { status = await page.evaluate(() => __bot.tick()); } catch (e) { problems.push('tick threw: ' + e.message); break; }
    const info = await page.evaluate(() => ({ sig: __bot.sig(), ch: S ? S.chapter : -1, area: S ? S.area : '', view, node: S && S.node }));
    if (info.ch !== chapterSeen) { chapterSeen = info.ch; if (!quiet) console.log(`run ${i}: chapter ${info.ch} at ${((Date.now() - t0) / 1000).toFixed(0)}s`); }
    if (shots && (info.area + info.view) !== (areaSeen + viewSeen)) { areaSeen = info.area; viewSeen = info.view; await shot(`${info.view}_${info.area}`); }
    if (errs.length > errShot) { errShot = errs.length; await shot('error'); }
    if (status === 'END') break;
    if (status.startsWith('STUCK')) { problems.push(`${status} at node ${info.node} (${info.view}, ch ${info.ch}) after:\n      ` + (await page.evaluate(() => __bot.hist.join('\n      ')))); await shot('stuck'); break; }
    if (info.sig === last) same++; else { same = 0; last = info.sig; }
    if (same > 400) { problems.push(`no progress for 400 ticks: status=${status} view=${info.view} node=${info.node} area=${info.area}`); await shot('frozen'); break; }
    if (Date.now() - t0 > 25 * 60 * 1000) { problems.push(`timeout after 25 min at ch ${info.ch} ${info.view} ${info.node}`); await shot('timeout'); break; }
    await page.waitForTimeout(status.startsWith('battle-wait') || status === 'walking' ? 25 : status === 'dice' ? 120 : 15);
  }
  const rep = await page.evaluate(() => ({ nodes: __bot.nodeVisits, choices: __bot.choices, events: __bot.events, battles: __bot.battles.map(b => ({ id: b.id, rounds: b.rounds, losses: b.losses, cheated: !!b.cheated })), dead: Object.keys(S.dead || {}), squad: S.squad, lvl: S.lvl, chapters: S.chapters, key7: S.f.c7_key }));
  const ok = status === 'END' && !errs.length && !problems.length;
  if (!ok) bad++;
  console.log(`\n=== run ${i}: ${ok ? 'OK' : 'PROBLEMS'} in ${((Date.now() - t0) / 1000).toFixed(0)}s · ${rep.nodes} nodes seen · ${rep.choices} choices · level ${rep.lvl} · squad ${rep.squad.join(',')} · dead ${rep.dead.join(',') || 'none'} · road ${JSON.stringify(rep.chapters)}`);
  problems.forEach(p => console.log('  PROBLEM ' + p));
  [...new Set(errs)].forEach(e => console.log('  PAGE ERROR ' + e));
  rep.events.forEach(e => console.log('  event ' + e));
  if (!quiet) console.log('  tables: ' + await page.evaluate(() => JSON.stringify(S.deeds || {}) + ' c1=' + (S.f.c1_bones || '-') + ' c2=' + (S.f.c2_bones || '-') + ' c3bones=' + (S.f.c3_bonesLast || '-') + ' cups=' + (S.f.c3_cupsLast || '-') + ' charges=' + (S.f.c3_charges || '-') + ' roof=' + (S.f.c4_run || '-') + ' masks=' + (S.f.c6_masks ? S.f.c6_masks - 1 : '-')));
  if (!quiet) console.log('  battles: ' + rep.battles.map(b => `${b.id}(r${b.rounds}${b.losses ? ' L' + b.losses : ''}${b.cheated ? ' cheat' : ''})`).join(' '));
  fs.appendFileSync(path.join(root, 'tools', '.visited.json'), JSON.stringify(await page.evaluate(() => Object.keys(__bot.visited))) + '\n');
  await ctx.close();
}
const par = Math.min(runs, 4);
let next = 0;
await Promise.all(Array.from({ length: par }, async () => { while (next < runs) { const i = next++; await run(i); } }));
await browser.close(); srv.kill();
process.exit(bad ? 1 : 0);
