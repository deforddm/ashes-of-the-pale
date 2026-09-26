// Balance harness for Ashes of the Pale: plays every battle many times from a synthetic save at the point in the story
// where it happens, with a SMART squad policy (abilities, heals, munitions, focus fire, flanks, no needless free swings,
// wounded kept back, survive-fights held) and the NAIVE baseline play.mjs uses (the enemy AI driving the squad), and
// reports win rate, rounds, squad health lost, downs, deaths and anything degenerate.
//
// Usage: node tools/balance.mjs [--runs=20] [--noellis=12] [--naive=10] [--only=id,id] [--par=4]
//                               [--lvl=0] [--lean] [--rich] [--json=path] [--quiet]
//   --runs=N     smart runs per battle, with the squad as the story has it there (Ellis from Ch2's outriders on)
//   --noellis=N  smart runs per Ch2+ battle without Ellis (she is optional); 0 to skip
//   --naive=N    baseline runs per battle (enemy ai() drives the squad: no abilities, no munitions); 0 to skip
//   --only=a,b   just these battle ids
//   --par=P      pages in parallel inside the one browser (default 4; most of a run is timer waits, not CPU)
//   --lvl=K      add K to the squad level curve (SYNTH's is min(8, 1 + chapter); a squad that fights everything runs ~1 higher)
//   --lean       smart runs with no munitions and no salves (the satchel spent elsewhere)
//   --rich       smart runs with no per-fight cap on munitions (the whole satchel spent here)
//   --json=path  write every run's raw result there (default /tmp/ashes-balance.json)
//   --patch=f.js JS evaluated in the page after boot (global scope) to try a tuning in memory without touching src/,
//                e.g. BATTLES.the_rent.waves[0].foes = [['warrenspawn',1,0],['warrenspawn',6,0]];
// The game must be built (python3 build.py). One Chromium process, under the shared browser lock in page.mjs.
//
// Set-up per battle (see setup() below): level min(8, 1 + chapter) (+ --lvl), SYNTH's picks (first level-3 talent, Iron at 5,
// Keen at 7), all the gear the earlier chapters hand out (auto-equipped the way gain() does it), the chapter's Deck card drawn
// from that chapter's pool, and a satchel no bigger than the story has handed out by then (start kit 2 sharpers, 1 burner,
// 1 cusser, 2 salves; Hedge's +1 cusser and 2 smokers from Ch3's second night on). The smart player spends at most 2 munitions
// (1 cusser) and 1 salve a fight, since the satchel has to last the campaign. Game speed 0.02, motion off; frames are drawn
// at ~10 fps (display only) and the one unpaced 500 ms start-of-fight delay is clamped, which changes no rule.
import fs from 'fs';
import { server, browser as launch, openGame } from './page.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(a => a.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const RUNS = +opt('runs', 20), NOE = +opt('noellis', 12), NAIVE = +opt('naive', 10), PAR = +opt('par', 4), LVL = +opt('lvl', 0);
const ONLY = (opt('only', '') || '').split(',').filter(Boolean), LEAN = args.includes('--lean'), RICH = args.includes('--rich');
const JSONOUT = opt('json', '/tmp/ashes-balance.json'), QUIET = args.includes('--quiet');
const PATCH = opt('patch', '') ? fs.readFileSync(opt('patch', ''), 'utf8') : ''; // JS run in each page after boot, to try a tuning in memory
const MAXR = 40;

/* how each fight is entered on the plain path through the story (no sharper thrown first) */
const OPTS = { hounds_line: { surprise: 'e' }, hounds_claw: { surprise: 'e' }, barrow: { surprise: 'e' }, outriders: { surprise: 'e' } };
const optFor = id => id === 'stone' ? { surprise: Math.random() < .5 ? 'e' : 'p' } : (OPTS[id] || {});
/* Ellis joins at "where the horses died", after the barrow; she can be gone through the rent (Ch5) and back in Ch7 */
const ellisCan = (id, ch) => ch >= 2 && id !== 'barrow';
/* the satchel as the story has filled it by then (see header) */
const HEDGE = new Set(['knives']); // Ch3 fights after the second night with Hedge
const satchel = (id, ch) => LEAN ? { sharper: 0, burner: 0, cusser: 0, salve: 0, smoker: 0 }
  : (ch >= 4 || HEDGE.has(id)) ? { sharper: 2, burner: 1, cusser: 2, salve: 2, smoker: 2 } : { sharper: 2, burner: 1, cusser: 1, salve: 2, smoker: 0 };
const CARDPOOL = { 0: ['oponn', 'obelisk', 'knight', 'assassin'], 1: ['hounds', 'hounds', 'hounds', 'oponn', 'knight', 'assassin'],
  2: ['raven', 'raven', 'raven', 'oponn', 'obelisk', 'knight'], 3: ['knight', 'knight', 'oponn', 'assassin', 'obelisk', 'magi'],
  4: ['assassin', 'assassin', 'knight', 'knight', 'oponn', 'herald'], 5: ['herald', 'herald', 'obelisk', 'hounds', 'knight', 'oponn'],
  6: ['chains', 'chains', 'knight', 'hounds', 'obelisk', 'oponn'], 7: ['crown', 'crown', 'obelisk', 'oponn', 'chains', 'knight'] };

/* ---------------------------------------------------------------- in the page ---------------------------------------------------------------- */
const INIT = () => {
  if (window.__bal) return;
  const W = window.__bal = { st: null, open: null, ts: null };
  const avg = d => d[0] * (d[1] + 1) / 2 + d[2];
  const pct = u => u.hp / u.maxhp;
  /* instrumentation only: every wrapper calls the original and returns what it returns */
  const _later = later; window.later = (fn, ms) => _later(fn, Math.min(ms, 40)); // the one unpaced 500 ms wait at the start of a fight
  const _attack = attack; window.attack = function (a, t, o = {}) {
    const r = _attack.apply(this, arguments), st = W.st;
    if (st) { if (W.open && W.open.u === a) W.open.atk++; if (o.aoo) { if (t.side === 'p' && !t.ally) st.aooOnSquad++; else if (t.side === 'e') st.aooOnFoe++; } }
    return r; };
  const _hurt = hurt; window.hurt = function (u, n) {
    const before = u.hp, r = _hurt.apply(this, arguments), st = W.st;
    if (st && before > 0) { if (W.open && W.open.u.side !== u.side) W.open.dmg += before - u.hp;
      if (u.side === 'p' && !u.ally) { st.dmgTaken += before - u.hp; if (u.hp <= 0) { st.downs++; st.downed[u.id] = 1; } } }
    return r; };
  const _useAb = useAb; window.useAb = function (k) {
    const st = W.st, a = AB[k];
    if (st) { st.abil[k] = (st.abil[k] || 0) + 1; if (a.item === 'salve') st.salves++; else if (a.item) { st.mun++; if (a.item === 'cusser') st.cussers++; } if (W.open) W.open.atk++; }
    return _useAb.apply(this, arguments); };
  const closeTurn = () => { const o = W.open; if (!o || !W.st) return; W.open = null;
    const rec = W.st.units[o.key] || (W.st.units[o.key] = { kind: o.u.kind, side: o.u.side, ally: !!o.u.ally, turns: 0, idle: 0, dazed: 0, moved: 0 });
    rec.turns++; if (o.dazed) { rec.dazed++; return; }
    const moved = o.u.x !== o.x0 || o.u.y !== o.y0; if (moved) rec.moved++;
    if (!moved && !o.atk && !o.dmg && o.u.hp > 0) rec.idle++; };
  const _next = nextTurn; window.nextTurn = function () {
    const b0 = B, turn0 = B && B.turn; if (B && W.open && W.open.turn === B.turn) closeTurn();
    const stunned = new Set(B ? B.units.filter(u => u.stun) : []);
    const r = _next.apply(this, arguments);
    if (B === b0 && B && B.cur && B.turn !== turn0 && !(W.open && W.open.turn === B.turn) && W.st) {
      const u = B.cur; W.open = { u, turn: B.turn, key: ukeyOf(u), x0: u.x, y0: u.y, atk: 0, dmg: 0, dazed: stunned.has(u) && !u.stun }; }
    return r; };
  const ukeyOf = u => (u.side === 'e' ? 'e' : u.ally ? 'a' : 'p') + B.units.indexOf(u) + ':' + u.kind;

  /* a synthetic save at the point in the story where the fight happens (SYNTH's curve and picks) */
  W.setup = spec => {
    B = null; notes = [];
    const n = spec.ch;
    S = newState('Hask'); S.chapter = n; S.lvl = Math.max(1, Math.min(8, 1 + n + (spec.lvl || 0))); S.xp = LEVELS[S.lvl - 1];
    S.chapters = { 0: 'given' }; const keys = { 1: 'line', 2: 'light', 3: 'report', 4: 'shield', 5: 'hold', 6: 'x' }; for (let i = 1; i < n; i++) S.chapters[i] = keys[i];
    if (spec.ellis) S.squad.push('ellis'); migrate(S);
    S.picksDue = []; if (S.lvl >= 3) S.squad.forEach(id => { const o = PICKS[3][id]; if (o) S.picks[id].push(o[0][0]); });
    if (S.lvl >= 5) S.squad.forEach(id => S.picks[id].push('iron')); if (S.lvl >= 7) S.squad.forEach(id => S.picks[id].push('keen'));
    for (let k = 1; k < n; k++) Object.keys((CHAPTERS[k] && CHAPTERS[k].gear) || {}).forEach(g => gain(g));
    S.inv = Object.assign({}, spec.inv); if (S.inv.smoker > 0) S.f.gotSmokers = 1;
    S.card = spec.card || null; notes = [];
    startBattle(spec.id, spec.opt || {});
  };

  /* ---------------- the smart player ---------------- */
  const threatAt = (p, self) => { let s = 0; foes().forEach(e => { if (e.stun || e.hp <= 0) return; if (cheb(e, p) <= e.mv + e.rng) s += avg(e.dmg) * (e.attacks || 1); }); return s; };
  const minD = (p, list) => list.length ? Math.min(...list.map(e => cheb(e, p))) : 99;
  const danger = e => avg(e.dmg) * (e.attacks || 1) * (e.stun ? .2 : 1);
  /* what an attack on t from tile `from` is worth: expected damage, a likely kill, the most-damaged first */
  const tv = (u, t, from, dmg) => { const c = atkCalc(u, t, { from }), p = hitPct(c) / 100, d = avg(dmg || u.dmg) + (t.markedUntil >= B.round ? 2 : 0);
    const kill = t.immortal ? 0 : t.hp <= d ? p : t.hp <= d * 1.6 ? p * .4 : 0;
    return p * d * 2 + kill * 25 + (1 - pct(t)) * 12 - Math.min(t.hp, 60) * .15 - (t.immortal ? 20 : 0) - (t.stun ? 3 : 0); };
  const can = (u, k) => !B.acted && u.ab.includes(k) && abOk(u, k);
  const strainOk = (u, cost) => u.strain + (u.id === 'tuft' && S.card === 'magi' ? cost - 1 : cost) <= STR_MAX;
  const reachOf = u => reachSafe(u.x, u.y, (x, y) => free(x, y, u), B.mvLeft ?? u.mv, (x, y) => leaveCost(u, x, y));
  const inReach = (u, from) => foes().filter(t => cheb(from, t) <= u.rng && canShoot(from, t));

  /* the best spot for a munition from here, or null if nothing is worth one (2+ caught, none of ours near) */
  function bestThrow(u, k, spec) {
    const a = AB[k]; if (!can(u, k)) return null;
    const st = W.st; if (a.item && (st.mun >= spec.munCap || (k === 'cusser' && st.cussers >= spec.cusserCap))) return null;
    const R = abRange(u, a), scat = a.item && !has(u.id, 'longfuse') ? (k === 'cusser' ? 2 : 1) : 0;
    let best = null;
    for (let y = 0; y < 10; y++) for (let x = 0; x < 8; x++) {
      if (wall(x, y) || cheb(u, { x, y }) > R) continue; const pt = { x, y };
      if (B.units.some(v => v.hp > 0 && v.side === 'p' && cheb(v, pt) <= a.aoe + scat)) continue; // nobody of ours in it, scatter included
      let val = 0, n = 0, boss = false;
      if (k === 'smoker') { const sh = foes().filter(e => e.rng > 1 && cheb(e, pt) <= 1); n = sh.length; val = sh.reduce((s, e) => s + danger(e), 0); if (n < 2) continue; }
      else {
        const dice = k === 'cusser' ? [[3, 8, 0], [3, 8, 0], [1, 8, 0]] : k === 'burner' ? [[1, 6, 0], [1, 6, 0]] : [[1, 10, 2], [1, 6, 0]];
        foes().forEach(e => { const d = cheb(e, pt); if (d >= dice.length || e.immortal) return; const dm = avg(dice[d]) + (k === 'burner' ? 2 : 0); n++; if (e.boss) boss = true; val += Math.min(e.hp, dm) + (e.hp <= dm ? 6 : 0); });
        const need = k === 'cusser' ? (boss ? 2 : 3) : 2; if (n < need) continue;
      }
      if (!best || val > best.val) best = { x, y, val, n };
    }
    return best;
  }
  /* where to stand: 'pre' = before acting (an attack or heal spot, or closing in), 'post' = after acting (step back out of reach) */
  function bestMove(u, mode, spec) {
    const opp = foes(), sq = squadUnits(), ob = B.def.objective, survive = ob && ob.type === 'survive';
    const mortalFoes = opp.filter(e => !e.immortal), onlyImmortal = !mortalFoes.length; // nothing to gain walking up to what cannot fall
    const ranged = u.rng > 1, healer = u.id === 'ohl', wounded = pct(u) < .4 || onlyImmortal, anchor = W.anchor[u.id] || u;
    const mendR = has(u.id, 'triage') ? 4 : 3, hurtMate = healer ? sq.filter(p => pct(p) < .6).sort((a, b) => pct(a) - pct(b))[0] : null;
    const canMend = healer && can(u, 'mend') && strainOk(u, 3);
    let best = null, bestS = -Infinity;
    reachOf(u).forEach(n => {
      const here = { x: n.x, y: n.y }, adj = opp.filter(e => cheb(e, here) === 1).length, thr = threatAt(here, u), md = minD(here, opp);
      let s = 0;
      if (mode === 'pre') {
        let a = -Infinity;
        if (!healer || adj) inReach(u, here).forEach(t => { if (!t.immortal || n.d === 0) a = Math.max(a, tv(u, t, here)); });
        if (canMend && hurtMate && cheb(here, hurtMate) <= mendR) s += 90;
        else if (healer && hurtMate) s -= cheb(here, hurtMate) * 6;
        if (a > -Infinity && !(healer && !adj)) s += 100 + a;
        else if (!healer && !onlyImmortal) s -= minD(here, mortalFoes) * (ranged ? 2 : survive ? 1 : 6);
        if (ranged || healer || wounded) s -= adj * 45 + thr * (wounded ? 1 : .6);
        else s -= Math.max(0, adj - 1) * 12 + thr * .12;
        if (survive && !ranged && !healer && n.d > 0 && cheb(here, anchor) > 2) s -= 150; // hold, don't chase
        if (healer && !hurtMate) s -= Math.max(0, minD(here, sq.filter(p => p !== u)) - 2) * 4; // stay with the squad
      } else {
        s -= adj * 50 + thr;
        if (ranged) s -= Math.max(0, md - u.rng) * 4;
        if (healer && hurtMate) s -= Math.max(0, cheb(here, hurtMate) - mendR) * 10;
      }
      s -= n.c * 70; s -= n.d * .3; // free swings: only for a very good reason
      s += Math.min(2, sq.filter(p => p !== u && cheb(p, here) === 1).length) * 2;
      if (B.fires.some(f => f.x === n.x && f.y === n.y)) s -= 30;
      if (ranged && smoked(n.x, n.y)) s -= 15;
      if (n.d === 0) s += 1;
      if (s > bestS) { bestS = s; best = n; }
    });
    return best;
  }
  /* one decision for the squadmate whose turn it is; returns a function that does it (through the UI's own entry points) */
  function choose(u, ts, spec) {
    const opp = foes(), sq = squadUnits(), ob = B.def.objective;
    const tryAb = (k, x, y) => () => { const a = AB[k]; if (!can(u, k)) return false;
      if (a.self) { useAb(k, u.x, u.y); return true; }
      B.mode = k; B.aim = null; updBattleUI();
      if (a.aoe) { battleTap(x, y); if (!B.aim) { B.mode = 'act'; return false; } battleTap(x, y); } else battleTap(x, y);
      if (!B.busy) { B.mode = 'act'; B.aim = null; updBattleUI(); return false; } return true; };
    const tryAtk = t => () => { B.mode = 'act'; B.aim = null; updBattleUI(); battleTap(t.x, t.y); return B.busy; };
    const tryMove = n => () => { B.mode = 'act'; B.aim = null; updBattleUI(); if (!B.reach || !B.reach.has(K(n.x, n.y))) return false; ts.moves++; battleTap(n.x, n.y); return B.busy; };
    if (!B.acted) {
      // Ohl: a downed squadmate up, then Denul on the worst hurt
      if (can(u, 'argument') && strainOk(u, 3)) { const t = AB.argument.tiles(u)[0]; if (t) return tryAb('argument', t.x, t.y); }
      if (can(u, 'mend')) { const t = AB.mend.tiles(u).filter(p => !p.ally && pct(p) < .45).sort((a, b) => pct(a) - pct(b))[0];
        if (t && (strainOk(u, 3) || (pct(t) < .25 && u.strain + 3 <= STR_MAX + 1 && u.hp > 8))) return tryAb('mend', t.x, t.y); }
      // a salve on yourself or the one beside you when it is bad (one a fight: the satchel has to last)
      if (can(u, 'salve') && W.st.salves < spec.salveCap) {
        const ohl = sq.find(p => p.id === 'ohl'), mendSoon = ohl && ohl !== u && !B.def.nomagic && ohl.strain <= 3;
        const t = AB.salve.tiles(u).filter(p => !p.ally && pct(p) < .3 && !(mendSoon && cheb(ohl, p) <= 5) && minD(p, opp) <= 3).sort((a, b) => a.hp - b.hp)[0];
        if (t) return tryAb('salve', t.x, t.y); }
      // the sergeant's Rally when most of the squad is close and the fight has come to them
      if (can(u, 'rally')) { const near = sq.filter(p => p !== u && cheb(u, p) <= 3);
        if (near.length >= 3 && (minD(u, opp) <= 3 || near.some(p => pct(p) < .6 || minD(p, opp) <= 1))) return tryAb('rally'); }
      // Tuft: out through Meanas if she is cornered and hurt; a veil on whoever is taking it; a phantom on the worst thing near us
      if (u.id === 'tuft') {
        if (can(u, 'shadowstep') && strainOk(u, 1) && opp.some(e => cheb(e, u) === 1) && pct(u) < .6) {
          const t = AB.shadowstep.tiles(u).map(p => ({ ...p, s: -threatAt(p, u) - opp.filter(e => cheb(e, p) === 1).length * 50 - Math.max(0, minD(p, opp) - u.rng) * 3 })).sort((a, b) => b.s - a.s)[0];
          if (t) return tryAb('shadowstep', t.x, t.y); }
        if (can(u, 'veil') && strainOk(u, 2)) { const t = AB.veil.tiles(u).filter(p => !p.ally && !(p.veilUntil >= B.round)).map(p => { const adj = opp.filter(e => cheb(e, p) === 1 && !e.stun);
            return { p, adj, s: adj.reduce((s, e) => s + danger(e), 0) * (1.5 - pct(p)) }; })
          .filter(o => o.adj.some(e => e.boss) || o.adj.length >= 2 || (o.adj.length && pct(o.p) < .5)).sort((a, b) => b.s - a.s)[0];
          if (t) return tryAb('veil', t.p.x, t.p.y); }
        for (const k of ['phantom', 'mockra']) if (can(u, k) && strainOk(u, k === 'phantom' ? 3 : 2)) {
          const t = AB[k].tiles(u).filter(e => !e.stun && (e.boss || danger(e) >= 8) && sq.some(p => cheb(p, e) <= e.mv + e.rng)).sort((a, b) => danger(b) - danger(a))[0];
          if (t) return tryAb(k, t.x, t.y); }
      }
      // munitions and the quorl
      for (const k of ['cusser', 'sharper', 'burner', 'quorl', 'smoker']) { const t = bestThrow(u, k, spec); if (t) return tryAb(k, t.x, t.y); }
      // Ellis: the mark on something big the squad is about to hit
      if (can(u, 'mark')) { const t = AB.mark.tiles(u).filter(e => !e.immortal && e.hp >= 15 && sq.filter(p => p !== u && cheb(p, e) <= p.rng + p.mv).length >= 2).sort((a, b) => b.hp - a.hp)[0];
        if (t) return tryAb('mark', t.x, t.y); }
      // an attack from where we stand: ranged always (then step back), melee when already engaged (Brisk's bash when it's up)
      const here = inReach(u, u), engaged = opp.some(e => cheb(e, u) === 1);
      if (here.length && (u.rng > 1 || engaged)) {
        if (u.id === 'brisk' && can(u, 'bash')) { const t = AB.bash.tiles(u).sort((a, b) => danger(b) - danger(a))[0]; if (t) return tryAb('bash', t.x, t.y); } // the stun is worth most on the worst thing, immortal or not
        const t = here.sort((a, b) => tv(u, b, u) - tv(u, a, u))[0];
        if (can(u, 'quickshot')) return tryAb('quickshot', t.x, t.y);
        if (u.id !== 'ohl' || engaged) return tryAtk(t);
      }
      // otherwise move once to the best spot, then think again from there
      if (!B.moved && !ts.moves && canStep(u)) { const n = bestMove(u, 'pre', spec); if (n && n.d > 0) return tryMove(n); }
      if (here.length && u.id !== 'ohl') { const t = here.sort((a, b) => tv(u, b, u) - tv(u, a, u))[0]; return tryAtk(t); }
      return null;
    }
    // acted first, move still whole: the ranged, the healer and the hurt step back out of reach
    if (!B.moved && !ts.moves && canStep(u) && (u.rng > 1 || u.id === 'ohl' || pct(u) < .4)) {
      const n = bestMove(u, 'post', spec), cur = { x: u.x, y: u.y };
      if (n && n.d > 0 && n.c === 0 && (threatAt(n, u) + opp.filter(e => cheb(e, n) === 1).length * 50) < (threatAt(cur, u) + opp.filter(e => cheb(e, cur) === 1).length * 50) - 2) return tryMove(n);
    }
    return null;
  }
  W.smart = (u, spec) => {
    const ts = W.ts && W.ts.turn === B.turn ? W.ts : (W.ts = { turn: B.turn, steps: 0, moves: 0 });
    if (++ts.steps > 8) { W.st.policyStuck++; B.mode = 'act'; return endTurn(); }
    let act = null; try { act = choose(u, ts, spec); } catch (e) { W.st.errors.push('policy: ' + e.message); }
    if (act) { if (act()) return; W.st.policyFail++; }
    B.mode = 'act'; B.aim = null; endTurn();
  };

  W.run = async spec => {
    const st = W.st = { downs: 0, downed: {}, dmgTaken: 0, aooOnSquad: 0, aooOnFoe: 0, mun: 0, cussers: 0, salves: 0, abil: {}, units: {}, errors: [], policyStuck: 0, policyFail: 0 };
    W.open = null; W.ts = null;
    try { W.setup(spec); } catch (e) { return { err: 'setup: ' + e.message }; }
    const b0 = B, t0 = performance.now(); W.anchor = {}; B.units.forEach(u => { if (u.side === 'p' && !u.ally) W.anchor[u.id] = { x: u.x, y: u.y }; });
    const squadMax = B.units.filter(u => u.side === 'p' && !u.ally).reduce((s, u) => s + u.maxhp, 0);
    let sig = '', since = performance.now(), end = '';
    for (;;) {
      await new Promise(r => setTimeout(r, 2));
      if (B !== b0) { end = 'replaced'; break; }
      if (B.over) { end = 'over'; break; }
      if (B.round > spec.maxRounds) { end = 'stalemate'; break; }
      const now = performance.now(), sg = [B.turn, B.busy, B.round, B.units.map(u => u.hp + ':' + u.x + ',' + u.y).join(';')].join('|');
      if (sg !== sig) { sig = sg; since = now; } else if (now - since > 6000) { end = 'stuck'; break; }
      if (now - t0 > spec.wall) { end = 'wallclock'; break; }
      if (B.busy || !B.cur || B.cur.side !== 'p' || B.cur.ally || !$('#sheet').hidden) continue;
      if (spec.policy === 'naive') { B.busy = true; ai(B.cur, B.turn); continue; }
      W.smart(B.cur, spec);
    }
    if (W.open && B === b0) closeTurn();
    const sqU = b0.units.filter(u => u.side === 'p' && !u.ally);
    const won = end === 'over' && !!b0.banner && b0.banner.txt !== 'The Fourth is down';
    const ob = b0.def.objective, held = won && ob && ob.type === 'survive' && b0.round > ob.rounds;
    const res = { won, end, rounds: held ? ob.rounds : b0.round, ms: Math.round(performance.now() - t0), // a held fight lasted its rounds (the engine's counter is one past)
      hpLost: won ? sqU.reduce((s, u) => s + (u.maxhp - Math.max(0, u.hp)), 0) / squadMax : 1,
      downs: st.downs, downedN: Object.keys(st.downed).length, upAtEnd: sqU.filter(u => u.hp > 0).length,
      dead: b0.def.mortal ? (won ? sqU.filter(u => u.hp <= 0 && u.id !== 'sgt').map(u => u.id) : sqU.filter(u => u.id !== 'sgt').map(u => u.id)) : [],
      mun: st.mun, salves: st.salves, abil: st.abil, aooOnSquad: st.aooOnSquad, aooOnFoe: st.aooOnFoe, policyStuck: st.policyStuck, policyFail: st.policyFail,
      units: st.units, errors: st.errors, card: S.card, squad: [...S.squad],
      stuckAt: end === 'stuck' || end === 'wallclock' ? { cur: B.cur && B.cur.kind, side: B.cur && B.cur.side, busy: B.busy, round: B.round, log: B.log.slice(0, 3) } : null };
    W.st = null; W.open = null; B = null; // drop the fight: its pending timers check B and do nothing
    return res;
  };
};

/* ---------------------------------------------------------------- in node ---------------------------------------------------------------- */
const srv = await server();
const br = await launch();
const pages = [];
const pageErrs = [];
async function newPage() {
  const g = await openGame(br, srv.url, { fast: true });
  await g.page.addInitScript(() => { window.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 100); });
  await g.page.reload(); await g.page.waitForTimeout(300);
  await prep(g.page);
  return g;
}
async function prep(page) { await page.evaluate(INIT); if (PATCH) await page.evaluate(code => (0, eval)(code), PATCH); }
const first = await newPage();
const meta = await first.page.evaluate(() => Object.keys(BATTLES).map(id => {
  const ch = +(Object.keys(CHAPTERS).find(n => CHAPTERS[n].battles && id in CHAPTERS[n].battles) || 0), d = BATTLES[id];
  return { id, ch, foes: d.foes.map(f => f[0]), waves: (d.waves || []).map(w => w.round + ':' + w.foes.map(f => f[0]).join('+')), allies: (d.allies || []).map(a => a[0]),
    survive: d.objective && d.objective.type === 'survive' ? d.objective.rounds : 0, mortal: !!d.mortal, nomagic: !!d.nomagic, nothrow: !!d.nothrow, style: d.style || '' };
}));
const battles = meta.filter(b => !ONLY.length || ONLY.includes(b.id)).sort((a, b) => a.ch - b.ch);
const jobs = [];
for (const b of battles) {
  const base = { id: b.id, ch: b.ch, lvl: LVL, inv: satchel(b.id, b.ch), maxRounds: MAXR, wall: 90000, munCap: RICH ? 99 : 2, cusserCap: RICH ? 99 : 1, salveCap: RICH ? 99 : 1 };
  const E = ellisCan(b.id, b.ch);
  for (let i = 0; i < RUNS; i++) jobs.push({ ...base, variant: 'smart', policy: 'smart', ellis: E });
  if (E) for (let i = 0; i < NOE; i++) jobs.push({ ...base, variant: 'smartNoE', policy: 'smart', ellis: false });
  for (let i = 0; i < NAIVE; i++) jobs.push({ ...base, variant: 'naive', policy: 'naive', ellis: E });
}
jobs.forEach(j => { const pool = CARDPOOL[j.ch] || [null]; j.card = pool[Math.floor(Math.random() * pool.length)]; j.opt = optFor(j.id); });
// interleave so every battle gets some runs early (a partial run still says something)
const results = [];
const t0 = Date.now();
let next = 0, done = 0;
pages.push(first); for (let i = 1; i < PAR; i++) pages.push(await newPage());
const rank = {}, order = jobs.map((j, i) => { const k = j.id + '/' + j.variant; rank[k] = (rank[k] || 0) + 1; return { i, r: rank[k] }; }).sort((a, b) => a.r - b.r).map(o => o.i);
const dump = () => fs.writeFileSync(JSONOUT, JSON.stringify({ meta, args, results, pageErrs }, null, 0));
async function worker(g) {
  while (next < order.length) {
    const j = jobs[order[next++]], e0 = g.errors.length;
    let r;
    try { r = await Promise.race([g.page.evaluate(spec => __bal.run(spec), j), new Promise((_, rej) => setTimeout(() => rej(new Error('node timeout')), 120000))]); }
    catch (e) { r = { err: e.message }; try { await g.page.reload(); await g.page.waitForTimeout(300); await prep(g.page); } catch (e2) {} }
    const errs = g.errors.slice(e0); if (errs.length) { pageErrs.push({ id: j.id, variant: j.variant, errs: [...new Set(errs)] }); r.pageErrors = errs.length; }
    results.push({ ...j, ...r }); done++;
    if (done % 25 === 0) { dump(); if (!QUIET) console.error(`${done}/${jobs.length} runs · ${((Date.now() - t0) / 1000).toFixed(0)}s`); }
  }
}
await Promise.all(pages.map(worker));
await br.close(); srv.kill();
dump();

/* ---------------------------------------------------------------- report ---------------------------------------------------------------- */
const med = a => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN;
const P = x => isNaN(x) ? '—' : Math.round(x * 100) + '%';
const F = (x, d = 1) => isNaN(x) ? '—' : x.toFixed(d);
function agg(rs) {
  const ok = rs.filter(r => !r.err);
  return { n: ok.length, win: mean(ok.map(r => r.won ? 1 : 0)), medR: med(ok.map(r => r.rounds)), meanR: mean(ok.map(r => r.rounds)),
    hp: mean(ok.map(r => r.hpLost)), hpWon: mean(ok.filter(r => r.won).map(r => r.hpLost)), downs: mean(ok.map(r => r.downs)), anyDown: mean(ok.map(r => r.downs > 0 ? 1 : 0)),
    dead: mean(ok.map(r => (r.dead || []).length)), mun: mean(ok.map(r => r.mun)), sal: mean(ok.map(r => r.salves)),
    aoo: mean(ok.map(r => r.aooOnSquad)), pfail: ok.reduce((s, r) => s + (r.policyFail || 0), 0), stale: ok.filter(r => r.end === 'stalemate').length, stuck: ok.filter(r => r.end === 'stuck' || r.end === 'wallclock').length,
    r1: ok.filter(r => r.end === 'over' && r.rounds <= 1).length, errs: rs.filter(r => r.err).length, pstuck: ok.reduce((s, r) => s + (r.policyStuck || 0), 0), ms: mean(ok.map(r => r.ms)) };
}
/* an enemy that took turns and did nothing with them (no step, no blow, not dazed) */
function idleFoes(rs) {
  const by = {};
  rs.forEach(r => Object.values(r.units || {}).forEach(u => { if (u.side !== 'e') return; const b = by[u.kind] || (by[u.kind] = { turns: 0, idle: 0, never: 0, n: 0 });
    b.turns += u.turns - u.dazed; b.idle += u.idle; b.n++; if (u.turns - u.dazed >= 3 && u.moved === 0 && u.idle === u.turns - u.dazed) b.never++; }));
  return Object.entries(by).filter(([k, b]) => b.turns && (b.idle / b.turns > .25 || b.never)).map(([k, b]) => `${k} idle ${Math.round(b.idle / b.turns * 100)}% of turns${b.never ? `, never acted in ${b.never}/${b.n}` : ''}`);
}
const rows = [];
console.log(`\nAshes of the Pale · balance · smart ${RUNS}, no-Ellis ${NOE}, naive ${NAIVE} runs a battle${LVL ? ` · level +${LVL}` : ''}${LEAN ? ' · lean (no munitions/salves)' : ''}${RICH ? ' · rich (no munition cap)' : ''}${PATCH ? ' · PATCHED: ' + opt('patch', '') : ''} · ${((Date.now() - t0) / 60000).toFixed(1)} min\n`);
console.log('| battle | ch | lvl | smart win% | naive win% | no-Ellis win% | median rounds | avg HP lost% (smart / no-Ellis / naive) | downs/fight (smart / naive) | fights with a down | notes |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|');
for (const b of battles) {
  const rs = results.filter(r => r.id === b.id), sm = agg(rs.filter(r => r.variant === 'smart')), nv = agg(rs.filter(r => r.variant === 'naive')), ne = agg(rs.filter(r => r.variant === 'smartNoE'));
  const notes = [];
  if (b.survive) notes.push(`survive ${b.survive}`); if (b.mortal) notes.push(`mortal: ${F(sm.dead, 2)} dead/fight`); if (b.nomagic) notes.push('otataral'); if (b.nothrow) notes.push('no throws');
  if (sm.mun) notes.push(`${F(sm.mun, 1)} munitions`); if (sm.sal) notes.push(`${F(sm.sal, 1)} salves`);
  if (sm.aoo) notes.push(`${F(sm.aoo, 1)} free swings taken`);
  const smartOnly = rs.filter(r => r.variant !== 'naive');
  if (sm.stale || ne.stale) notes.push(`STALEMATE ${sm.stale + (ne.stale || 0)}`); if (sm.stuck + (ne.stuck || 0) + (nv.stuck || 0)) notes.push(`STUCK ${sm.stuck + (ne.stuck || 0) + (nv.stuck || 0)}`);
  if (sm.r1) notes.push(`ends in round 1 ×${sm.r1}`); if (sm.errs + (ne.errs || 0) + (nv.errs || 0)) notes.push(`harness errors ${sm.errs + (ne.errs || 0) + (nv.errs || 0)}`);
  if (sm.pstuck) notes.push(`policy loops ${sm.pstuck}`); if (sm.pfail) notes.push(`refused actions ${sm.pfail}`);
  const idle = idleFoes(rs); if (idle.length) notes.push('IDLE: ' + idle.join('; '));
  const pe = pageErrs.filter(p => p.id === b.id); if (pe.length) notes.push(`PAGE ERRORS ×${pe.length}`);
  const lvl = Math.max(1, Math.min(8, 1 + b.ch + LVL));
  rows.push({ id: b.id, ch: b.ch, sm, nv, ne });
  console.log(`| ${b.id} | ${b.ch} | ${lvl} | ${P(sm.win)} (${sm.n}) | ${P(nv.win)} | ${ne.n ? P(ne.win) : '—'} | ${F(sm.medR, 1)} | ${P(sm.hp)} / ${ne.n ? P(ne.hp) : '—'} / ${P(nv.hp)} | ${F(sm.downs, 2)} / ${F(nv.downs, 2)} | ${P(sm.anyDown)} | ${notes.join(' · ')} |`);
}
if (pageErrs.length) { console.log('\nPage errors:'); pageErrs.forEach(p => console.log(`  ${p.id} (${p.variant}): ${p.errs.join(' || ')}`)); }
const stuck = results.filter(r => r.stuckAt); if (stuck.length) { console.log('\nStuck runs:'); stuck.slice(0, 10).forEach(r => console.log(`  ${r.id} ${r.variant}: ${JSON.stringify(r.stuckAt)}`)); }
const errd = results.filter(r => r.err); if (errd.length) { console.log('\nHarness errors:'); errd.slice(0, 10).forEach(r => console.log(`  ${r.id} ${r.variant}: ${r.err}`)); }
console.log(`\n${results.length} runs in ${((Date.now() - t0) / 1000).toFixed(0)}s · raw results in ${JSONOUT}`);
