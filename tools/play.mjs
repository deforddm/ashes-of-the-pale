// Playthrough bot for Ashes of the Pale: drives the real UI from the title screen through the
// prologue, all seven chapters and the finale, picking choices at random (preferring unseen nodes),
// walking to NPCs and trigger tiles, and fighting battles with the enemy AI on the squad's side.
// Usage: node tools/play.mjs [runs=3] [--cheat] [--from=N] [--shots=dir] [--quiet] [--wide] [--book=dg]
//   --book=dg   pick Book Two (Deadhouse Gates) on the new-sergeant form; the run ends at its last written chapter's end screen
//   --cheat     win every battle instantly (flow testing only)
//   --from=N    start from a synthetic save at the start of chapter N (with --book=dg, Book Two's chapter N: SYNTH_DG)
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
const book = (args.find(a => a.startsWith('--book=')) || '').split('=')[1] || 'gotm';
const from = +((args.find(a => a.startsWith('--from=')) || '').split('=')[1] || 0);
const shots = (args.find(a => a.startsWith('--shots=')) || '').split('=')[1] || '';
if (shots) fs.mkdirSync(shots, { recursive: true });

const srv = await server();
const browser = await launch();

const BOT = () => {
  window.__bot = {
    visited: {}, hist: [], book: 'gotm', nodeVisits: 0, choices: 0, battles: [], cur: null, events: [], tapFails: 0, targets: {}, cheat: false, lastView: '',
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
      const dice = $('#dice'); if (dice) { const pull = $('#dPull'); if (pull && Math.random() < .5) { this.ev('pull: spun the coin'); pull.click(); return 'dice-pull'; } dice.click(); return 'dice'; }
      if (!$('#cardfx').hidden) { const fold = $('#cfFold'); if (fold && Math.random() < .5) { this.ev('fold: drew again'); fold.click(); return 'cardfx-fold'; } const keep = $('#cfKeep'); if (keep && Math.random() < .5) { keep.click(); return 'cardfx-keep'; } const b = $('#cardfx').querySelector('button:not([disabled])'); if (b) { b.click(); return 'cardfx-btn'; } $('#cardfx').click(); return 'cardfx'; }
      if (view === 'title') { const bk = $(`[data-book="${this.book}"]`); if (bk && !bk.classList.contains('on')) { bk.click(); return 'book'; } const b = $('#bNew') || $('#bNewSgt'); if (b) { b.click(); return 'new'; } }
      if (!sh.hidden) {
        const on = $('#bOn'); if (on) { this.ev('stage: push on'); on.click(); return 'push-on'; } // a fight's second area
        const retry = $('#bRetry');
        if (retry) { const b = this.cur; if (b) { b.losses++; this.ev(`lost battle ${b.id} (attempt ${b.losses})`); } retry.click(); return 'retry'; }
        const pk = sh.querySelector('.choices.picker'); // who handles a check: mostly the likeliest, sometimes anyone
        if (pk) { const ws = [...pk.querySelectorAll('[data-who]:not([disabled])')]; if (ws.length) { const w = Math.random() < .6 ? (pk.querySelector('.best') || ws[0]) : ws[Math.floor(Math.random() * ws.length)]; this.choices++; w.click(); return 'pick-roller'; } }
        const btns = [...sh.querySelectorAll('.choice')].filter(b => !b.disabled && b.dataset.i != null);
        if (!btns.length) return 'wait-choice';
        const id = S.node; if (id && !this.visited[id]) { this.visited[id] = 1; this.nodeVisits++; }
        const opts = btns.map(b => { const c = curCh[+b.dataset.i]; let w = 1;
          if (typeof c.go === 'string') w = this.visited[c.go] ? 1 : 6;
          else if (typeof c.go === 'function') w = 3;
          else w = 0.6; // leave / close
          if (c.check) w *= 1.2;
          if (c.deck) w = 60; // a Book Two reading (47c): the bot nearly always sits down for it, so the card screen and its effects get played
          return { b, w }; });
        let r = Math.random() * opts.reduce((a, o) => a + o.w, 0); const o = opts.find(o => (r -= o.w) <= 0) || opts[0];
        this.hist.push(`${S.node} [${view}${G.sceneKind ? ':' + G.sceneKind : ''}] -> ${o.b.textContent.slice(0, 50)}`); this.hist = this.hist.slice(-8);
        const oc = curCh[+o.b.dataset.i]; if (oc && oc.deck && /draw\.$/.test(o.b.textContent)) this.ev(`deck: ${o.b.textContent} (${S.node})`);
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

// Book Two (--book=dg --from=N): a synthetic save at the start of Book Two's chapter N, with the earlier chapters' keys and the flags
// later chapters read drawn at random (the Silanda or a kept wound, Ramin or not, Ilhar's skin, Sathi's standing with the Weasels...)
const SYNTH_DG = (n) => {
  const pick = a => a[Math.floor(Math.random() * a.length)], coin = () => Math.random() < .5;
  setBook('dg'); S = newStateDG('Hask'); S.lvl = {1:1, 2:3, 3:4, 4:5, 5:6, 6:7, 7:7}[n] || 7; S.xp = LEVELS[S.lvl - 1];
  const keys = {1:['b2_key', ['daughters', 'carts']], 2:['b2_c2_key', ['spring', 'water']], 3:['b2_c3_key', ['bait', 'pull']], 4:['b2_c4_key', ['silanda', 'keep']], 5:['b2_c5_key', ['squad', 'column']], 6:['b2_c6_key', ['whole', 'some', 'many']]};
  S.chapters = {}; for (let i = 1; i < n; i++) { const [f, v] = keys[i]; S.f[f] = pick(v); S.chapters[i] = S.f[f]; }
  const f = S.f;
  if (n > 2 && coin()) { f.b2_raminDone = 1; S.squad.push('redblade'); S.loy.redblade = 0; } else if (n > 2) f.b2_raminDone = 0;
  if (n > 1) { f.b2_ilharHeard = 1; f.b2_prisonerFate = pick(['free', 'column', 'wickans']); f.b2_yedda = coin() ? 1 : 0; f.b2_bungle5 = pick(['gave', 'kept', 'met']); }
  if (n > 3) { f.b2_sathiTeeth = coin() ? 1 : 0; if (f.b2_c3_key === 'bait') f.b2_weaselHonour = 1; else f.b2_sathiShamed = 1; f.b2_duikerTold3 = coin() ? 1 : 0; }
  if (n > 4) { f.b2_ilharSeen = 1; f.b2_ilharSign = pick(['silent', 'named']); f.b2_robe = pick(['mincer', 'squad', 'none']); f.b2_marrowEnd = pick(['on', 'stopped']); if (f.b2_marrowEnd === 'on') f.b2_warrenFloor = 1; f.b2_sathiLaugh = coin() ? 1 : 0;
    const mates = ['haddat', 'sathi', 'tangle', 'marrow'];
    if (f.b2_c4_key === 'silanda') { const w = pick(mates); f.b2_silandaWho = w; f.b2_silandaGear = {}; S.squad = S.squad.filter(k => k !== w); } else f.b2_woundWho = pick(mates); }
  if (n > 5) { f.b2_list7 = 1; f.b2_bottle = 1; f.b2_trygalle = 1; f.b2_sathiRode = coin() ? 1 : 0; if (S.squad.includes('haddat')) { f.b2_ilharWater = 1; f.b2_ilharSkin = pick(['drunk', 'kept']); if (f.b2_ilharSkin === 'kept') gain('b2_sealskin'); }
    if (f.b2_key === 'daughters') f.b2_jar = pick(['poured', 'kept']); else { f.b2_jarboy = pick(['took', 'cart']); f.b2_girlsRode = 1; } f.b2_knots = 8; f.b2_sputters = 2; }
  migrate(S); Object.keys(S.loy).forEach(k => { S.loy[k] = Math.floor(Math.random() * 5) - 1; });
  S.chain = {water:8, column:20 + Math.floor(Math.random() * 10)}; S.inv = {sharper:1, burner:1, cusser:1, salve:2, smoker:1}; S.silver = 20;
  if (n > 6) { // the split on the Geleen, as Chapter 6 leaves it: nobody, everybody (sometimes the sergeant alone), or a random few stay with the Fist (47)
    Object.assign(f, {b2_listWar:1, b2_bottleThrown:1, b2_duiker11:1, b2_kherahn:1, b2_geleen:1, b2_retreat:1, b2_retreatLost:3, b2_silverDone:1, b2_warchief:1, b2_sathiClan:pick(['yes', 'no'])});
    if (coin()) f.b2_paid = 5; if (S.squad.includes('haddat')) f.b2_ilhar = pick(['came', 'parted', 'fell', 'lost']);
    const here = ['haddat', 'sathi', 'tangle', 'marrow', 'redblade'].filter(k => S.squad.includes(k)), r = Math.random();
    const stay = r < .25 ? [] : r < .4 ? here.slice() : here.filter(() => coin());
    f.b2_split = {}; f.b2_splitHow = {}; here.forEach(k => { f.b2_split[k] = stay.includes(k) ? 'stay' : 'go'; f.b2_splitHow[k] = pick(['own', 'asked', 'talked']); });
    if (stay.includes('tangle')) { f.b2_satchel6 = pick(['went', 'left']); if (f.b2_satchel6 === 'went') { f.b2_stayInv = {}; ['sharper', 'burner', 'cusser', 'smoker'].forEach(m => { f.b2_stayInv[m] = S.inv[m]; S.inv[m] = 0; }); } }
    stay.forEach(k => b2StayBehind(k)); stay.forEach(k => gain({haddat:'b2_bluethread', sathi:'b2_whistle', tangle:'b2_bead', marrow:'b2_knotstring', redblade:'b2_sash'}[k]));
    f.b2_stayCount = stay.length; f.b2_c6_key = !stay.length ? 'whole' : stay.length >= 2 && stay.length * 2 >= here.length ? 'many' : 'some'; S.chapters[6] = f.b2_c6_key;
    if (coin()) { const all = ['brisk', 'kettle', 'tuft', 'ohl', 'ellis', 'vell'], mates = all.filter(() => coin()); if (!mates.length) mates.push(pick(all));
      S.imported = {from:'Kell', sid:'synth', road:'empire', lvl:8, follow:{}, mates, dead:[], loy:Object.fromEntries(mates.map(k => [k, Math.floor(Math.random() * 7) - 3]))}; }
  }
  const all = [...S.squad, ...(n > 6 ? b2Rearguard() : [])]; // the ones who stayed at the split fight the Barrow with their own picks
  S.picksDue = []; if (S.lvl >= 3) all.forEach(id => { const o = PICKS[3][id]; S.picks[id] ??= []; if (o) S.picks[id].push(o[0][0]); });
  if (S.lvl >= 5) all.forEach(id => S.picks[id].push('iron')); if (S.lvl >= 7) all.forEach(id => S.picks[id].push('keen'));
  save(); startChapter(n);
};

let bad = 0;
async function run(i) {
  const { ctx, page, errors: errs } = await openGame(browser, srv.url, wide ? { fast: true, width: 1366, height: 768 } : { fast: true });
  page.on('console', m => { if (m.type() === 'warning' && /finale|backdrop leave|unknown/i.test(m.text())) errs.push('warn: ' + m.text()); });
  await page.evaluate(BOT);
  if (cheat) await page.evaluate(() => { __bot.cheat = true; });
  if (book !== 'gotm') await page.evaluate(b => { __bot.book = b; }, book);
  if (from) await page.evaluate(book === 'dg' ? SYNTH_DG : SYNTH, from);
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
  const rep = await page.evaluate(() => ({ nodes: __bot.nodeVisits, choices: __bot.choices, events: __bot.events, battles: __bot.battles.map(b => ({ id: b.id, rounds: b.rounds, losses: b.losses, cheated: !!b.cheated })), dead: Object.keys(S.dead || {}), squad: S.squad, book: S.book, chain: S.chain, lvl: S.lvl, chapters: S.chapters, key7: S.f.c7_key }));
  const ok = status === 'END' && !errs.length && !problems.length;
  if (!ok) bad++;
  console.log(`\n=== run ${i}: ${ok ? 'OK' : 'PROBLEMS'} in ${((Date.now() - t0) / 1000).toFixed(0)}s · ${rep.nodes} nodes seen · ${rep.choices} choices · level ${rep.lvl} · squad ${rep.squad.join(',')} · dead ${rep.dead.join(',') || 'none'} · road ${JSON.stringify(rep.chapters)}${rep.book && rep.book !== 'gotm' ? ` · book ${rep.book} · chain ${JSON.stringify(rep.chain)}` : ''}`);
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
