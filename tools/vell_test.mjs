// v3.17: levels grow every skill and spell, role stat bumps, and Vell, the second recruit (one recruit at a time; Ellis can go and find Toc).
// Usage: node tools/vell_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true, mobile: true, touch: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = f => page.evaluate(f);
const Q = s => s.replace(/[“”"‘’']/g, '').trim();
const click = async txt => { const n = await page.evaluate(t => { const q = s => s.replace(/[“”"‘’']/g, '').trim(); const b = [...document.querySelectorAll('#sheet .choice')].find(x => q(x.textContent).startsWith(q(t))); if (!b) return false; b.click(); return true; }, txt); await page.waitForTimeout(250); return n; };
const choices = () => ev(() => [...document.querySelectorAll('#sheet .choice')].map(b => b.textContent.replace(/[“”"‘’']/g, '').trim()));

// ---- levels ----
const lv = await ev(() => { S = newState('Hask'); const at = l => { S.lvl = l; return {rally:rallyHeal(), str:strMax(), veil:veilPen(), wits:statOf('sgt','wits'), might:statOf('sgt','might'), guile:statOf('vell','guile'), dmg:lvDmg(), ac:lvAc(), pull:trickN('pull'), hook:grapR()}; }; return [at(1), at(4), at(8)]; });
ok(lv[0].rally === 5 && lv[2].rally === 19, `Rally heals 5 at level 1, 19 at level 8 (${lv[0].rally}, ${lv[2].rally})`);
ok(lv[0].str === 6 && lv[1].str === 7 && lv[2].str === 8, `strain limit 6 → 7 → 8 (${lv.map(x => x.str)})`);
ok(lv[0].veil < lv[2].veil, `Veil grows (${lv[0].veil} → ${lv[2].veil})`);
ok(lv[0].wits === 2 && lv[1].wits === 3 && lv[2].might === 3, `the sergeant's Wits +1 at 4, Might +1 at 8`);
ok(lv[0].guile === 3 && lv[1].guile === 4, `Vell's Guile +1 at level 4`);
ok(lv[0].pull === 2 && lv[2].pull === 3, `chapter tricks gain a use at level 5`);
ok(lv[0].hook === 3 && lv[2].hook === 5, `the hook reaches 3, then 5`);

// ---- Ch4: Vell offered; with Ellis, she can go and find Toc ----
await ev(() => { S = newState('Hask'); S.chapter = 4; S.lvl = 4; S.squad = ['sgt','brisk','kettle','tuft','ohl','ellis']; S.f.c4_key = 'shield'; S.f.c4_vell = 1; migrate(S); save(); startExplore(CHAPTERS[4].area.id); talk('c4_vell_thanks'); });
await page.waitForTimeout(300);
let ch = await choices(); ok(ch.filter(t => t.startsWith('Come with us.')).length === 1, `one "Come with us." with Ellis in the squad (${ch.join(' | ')})`);
await click('"Come with us."'); ch = await choices(); ok(ch.some(t => t.startsWith('Go and find him, Ellis.')), 'Ellis offers to go and find Toc');
await click('"Go and find him, Ellis."');
let st = await ev(() => ({sq:SQUAD().slice(), toc:S.f.c4_ellisToc, loy:S.loy.vell}));
ok(st.sq.includes('vell') && !st.sq.includes('ellis') && st.sq.length === 6, `Vell in, Ellis out, six in all (${st.sq})`);
ok(st.toc === 1, 'the Ellis-to-Toc flag is set');
await click('Down to the crossing.'); ch = await choices(); ok(ch.length > 0, `the corner follows (${ch.join(' | ')})`);
const dawn = await ev(() => { S.picksDue = []; talk('c4_dawn'); return document.querySelector('#sheet').innerText; });
ok(/Six/.test(dawn) && /Ocelot.s/.test(dawn) && /gone east/.test(dawn), 'Whiskeyjack counts six and hears about Vell and Ellis'); if (!/Ocelot.s/.test(dawn)) console.log(dawn.slice(0, 900));

// ---- the sheet and the portrait ----
await ev(() => { $('#sheet').hidden = true; openChars(SQUAD().indexOf('vell')); }); await page.waitForTimeout(500);
const sheet = await ev(() => $('#chars').innerText);
ok(/Grappling Hook/.test(sheet) && /Rope man/.test(sheet), 'Vell\'s sheet shows his role and the hook');
await page.screenshot({ path: '/tmp/claude-0/shots/vell_sheet.png' });
await ev(() => { $('#chars').hidden = true; });

// ---- the hook in a fight: hauled to the tile beside him ----
const fight = await ev(async () => { const wait = ms => new Promise(r => setTimeout(r, ms)); startBattle('guild_roofs', {}); await wait(600);
  const v = B.units.find(u => u.id === 'vell'), f = foes().filter(e => !e.boss)[0];
  const spot = [[0,0],[1,0],[0,1],[2,0],[3,0]].map(([x, y]) => ({x, y})).find(p => free(p.x, p.y, v)); if (spot) { v.x = spot.x; v.y = spot.y; }
  const far = []; for (let y = 0; y < 10; y++) for (let x = 0; x < 8; x++) { const d = Math.max(Math.abs(x - v.x), Math.abs(y - v.y)); if (d >= 3 && d <= grapR() && free(x, y, f)) far.push({x, y}); }
  if (!far.length) return {err:'no tile'}; f.x = far[0].x; f.y = far[0].y; f.boss = false; f.immortal = false; f.maxhp = Math.max(f.maxhp, 30); f.hp = 30; B.smoke = [];
  const before = cheb(v, f); const realAtk = attack; window.attack = (a, t, o) => ({hit:true, dmg:1}); // a sure hit, so the haul is what's tested
  const sq = B.units.find(p => p.side === 'p' && !p.ally && p !== v && p.hp > 0), spotB = DIRS.map(([dx, dy]) => ({x:f.x + dx, y:f.y + dy})).find(p => free(p.x, p.y, sq) && cheb(p, v) > 2);
  if (spotB) { sq.x = spotB.x; sq.y = spotB.y; sq.aooTurn = -1; sq.stun = false; } B.log = [];
  const run = AB.grapple.run(v, f.x, f.y); window.attack = realAtk; await run; await wait(300);
  return {before, after:f.hp > 0 ? cheb(v, f) : 1, cd:v.cdHook > B.round - 1, tiles:AB.grapple.tiles(v).length, aoo:!!spotB && B.log.join(' ').includes('dragged out of'), dbg:JSON.stringify({spotB, who:sq.id, log:B.log.slice(-8)})}; });
ok(!fight.err && fight.before >= 3 && fight.after === 1, `the hook hauls an enemy from ${fight.before} tiles to beside Vell (${fight.after})`);
ok(fight.aoo, 'dragging it out of a squadmate\'s reach gives that squadmate a free swing'); if (!fight.aoo) console.log(fight.dbg);
const drive = await ev(async () => { const wait = ms => new Promise(r => setTimeout(r, ms));
  S.squad = ['sgt','brisk','kettle','tuft','ohl','vell']; S.gear.sgt = {}; startBattle('guild_roofs', {}); await wait(600); B.smoke = [];
  const g = B.units.find(u => u.id === 'sgt'), b2 = B.units.find(u => u.id === 'brisk'), f = foes().filter(e => !e.boss)[0];
  B.units.filter(u => u !== g && u !== b2 && u !== f).forEach((u, i) => { u.x = i; u.y = 0; }); // out of the way
  g.x = 3; g.y = 6; f.x = 3; f.y = 5; b2.x = 4; b2.y = 5; [g, b2, f].forEach(u => { u.stun = false; u.aooTurn = -1; }); f.hp = f.maxhp = 40; f.boss = false; f.immortal = false; B.log = [];
  const realAtk = attack; let first = true; window.attack = (a, t, o) => { if (first) { first = false; return {hit:true, dmg:1}; } return realAtk(a, t, o); };
  const run = AB.shove.run(g, f.x, f.y); await run; window.attack = realAtk; const y = f.y; await wait(300);
  return {y, aoo:B.log.join(' ').includes('driven out of'), selfSwing:B.log.join(' ').includes(`${g.name} takes a free swing`)}; });
ok(drive.y === 3, `Shield Drive drives it back two tiles at level 6 (to row ${drive.y})`); // measured as the drive ends, before the fight moves on
ok(drive.aoo && !drive.selfSwing, 'driving it out of Brisk\'s reach gives Brisk a free swing; the sergeant spent his on the drive');
const hb = await ev(() => { S.gear.sgt = {weapon:'simtalhalberd'}; const u = mkParty('sgt', 3, 6); S.gear.sgt = {}; const n = mkParty('sgt', 3, 6); return {rng:u.rng, reach:!!u.reachMelee, ac:u.ac - n.ac}; });
ok(hb.rng === 2 && hb.reach && hb.ac === -1, `the halberd reaches 2 tiles as a blow, for −1 armour (${JSON.stringify(hb)})`);
const swing = await ev(() => { const v = B.units.find(u => u.id === 'vell'); S.picks.vell = ['ropeswing']; const n = AB.ropeswing.tiles(v).length; const t = AB.ropeswing.tiles(v)[0]; AB.ropeswing.run(v, t.x, t.y); return {n, at:v.x === t.x && v.y === t.y, again:AB.ropeswing.ok(v)}; });
ok(swing.n > 0 && swing.at && !swing.again, `Rope Swing moves him once a turn (${swing.n} tiles)`);
await ev(() => { B = null; view = 'explore'; });

// ---- Ch6: with Ellis gone into the grey, Vell comes down the ladder-hole ----
await ev(() => { S = newState('Hask'); S.chapter = 6; S.lvl = 6; S.squad = ['sgt','brisk','kettle','tuft','ohl']; S.f.c4_key = 'shield'; S.f.c4_vell = 1; S.f.c5_ellisThrough = 1; migrate(S); save(); startExplore(CHAPTERS[6].area.id); talk('c6_start'); });
await page.waitForTimeout(300); ch = await choices();
ok(ch.some(t => t.startsWith('Somebody is coming down')), `Vell arrives under the crossing (${ch.join(' | ')})`);
await click('Somebody is coming down'); await click('"Fourth Squad, Vell.');
st = await ev(() => SQUAD().slice()); ok(st.includes('vell') && st.length === 6, `Vell joins in Ch6 (${st})`);
ok(await ev(() => S.picksDue.includes(3)), 'joining at level 6, he picks his level-3 talent first');
const close = await ev(() => { S.picksDue = []; talk('c6_close'); return [...document.querySelectorAll('#sheet .choice')].map(b => b.textContent.trim()); });
ok(close.includes('Vell.'), 'Vell has a close at the end of Ch6');

// ---- Ch7: Ellis can't rejoin over him; his close and his fate ----
const c7 = await ev(() => { S.chapter = 7; S.f.c7_key = 'city'; talk('c7_ellis_back2'); const back = [...document.querySelectorAll('#sheet .choice')].map(b => b.textContent.replace(/[“”"‘’']/g, '').trim());
  const f = {}; ['outlaw','empire','city','disband'].forEach(k => { const r = C7H.fate('vell', k); f[k] = r && r.title + ': ' + r.txt.slice(0, 60); });
  talk('c7_close_vell'); const cl = document.querySelector('#sheet').innerText.length;
  S.squad = S.squad.filter(x => x !== 'vell'); S.dead = {vell:{ch:6, where:'x'}}; const g = C7H.gone('vell', 'city');
  S.dead = {}; S.f.c4_ellisToc = 1; const ge = C7H.gone('ellis', 'city'); return {back, f, cl, g:g && g.title + ' / ' + g.txt.slice(0, 80), ge:ge && ge.title}; });
ok(!c7.back.some(t => t.startsWith('Fourth Squad.')), `with Vell in, Ellis is not offered the place back (${c7.back.join(' | ')})`);
ok(Object.values(c7.f).every(x => x && /Where the line goes/.test(x)), 'a fate page for Vell on every road');
ok(c7.cl > 200, 'Vell\'s close on the quorl hill reads');
ok(c7.g && /Rope/.test(c7.g), `a page if he falls (${c7.g})`);
ok(c7.ge === 'He kept riding', 'Ellis gone east to Toc gets her own page');
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await br.close(); srv.kill();
process.exit(fail || errors.length ? 1 : 0);
