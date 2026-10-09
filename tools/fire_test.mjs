// v3.18.1: fire on the ground burns whoever goes through it, and a failed save sets them alight (1d4 a turn for two turns); Rally puts it out.
// Usage: node tools/fire_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const r = await page.evaluate(async () => { const wait = ms => new Promise(r => setTimeout(r, ms)); const out = {};
  S = newState('Hask'); S.chapter = 3; S.lvl = 3; S.squad = ['sgt','brisk','kettle','tuft','ohl']; S.picksDue = []; migrate(S); save();
  startBattle('cutpurses', {}); await wait(600);
  for (let i = 0; i < 60 && !(B.cur && B.cur.side === 'p' && !B.busy); i++) await wait(100);
  const realEnd = endTurn; window.endTurn = () => {}; B.busy = true;
  const g = B.units.find(u => u.id === 'sgt'), e = foes()[0]; const realD20 = d20;
  // a squadmate fails the save
  B.fires.push({x:g.x, y:g.y, until:B.round + 3}); // d20 can't be stubbed, so roll until the save fails (about one in two)
  for (let i = 0; i < 60 && !(g.burnTurns > 0); i++) { g.hp = g.maxhp; enterFire(g); }
  out.hurt = g.maxhp - g.hp; out.burning = g.burnTurns;
  // Rally puts it out
  const p = AB.rally; B.used.rally = 0; p.run(g); out.afterRally = g.burnTurns;
  // a save made: hurt, not alight
  e.x = 6; e.y = 2; B.fires.push({x:6, y:2, until:B.round + 3}); const atk0 = e.atk; e.atk = 60; // +30 to the save: only a natural 1 fails
  for (let i = 0; i < 6; i++) { e.burnTurns = 0; e.hp = e.maxhp = 40; enterFire(e); if (!e.burnTurns) break; } e.atk = atk0; out.enemyHurt = 40 - e.hp; out.enemyBurning = e.burnTurns || 0;
  // driven through fire by the sergeant's drive
  e.burnTurns = 0; e.hp = 40; e.boss = false; e.immortal = false; S.lvl = 5; B.fires = []; B.units.filter(u => u !== g && u !== e).forEach((u, i) => { u.x = i; u.y = 9; });
  g.x = 3; g.y = 6; e.x = 3; e.y = 5; B.fires.push({x:3, y:4, until:B.round + 3}); e.atk = -30; const realAtk = attack; // −15 to the save: it can only catch window.attack = () => ({hit:true, dmg:1});
  B.over = true; await wait(400); // freeze the fight: no more turns while the drive is tested
  B.log = [];
  for (let k = 0; k < 3; k++) { g.x = 3; g.y = 6; e.x = 3; e.y = 5; e.hp = 40; e.burnTurns = 0; g.cdShove = -1; await AB.shove.run(g, e.x, e.y); if (e.y < 5) break; await wait(200); } // the live fight can nudge pieces; try again
  B.over = false; window.attack = realAtk; out.driven = {y:e.y, hp:e.hp, burning:e.burnTurns, caught:B.log.join(' ').includes(`${e.name} catches fire`)};
  window.endTurn = realEnd; return out; });
console.log(JSON.stringify(r));
ok(r.hurt >= 1 && r.hurt <= 4 && r.burning === 2, `going through fire burns 1d4 and a failed save sets them alight for 2 turns (${r.hurt}, ${r.burning})`);
ok(r.afterRally === 0, 'Rally puts the fire out');
ok(r.enemyHurt >= 1 && r.enemyHurt <= 4 && r.enemyBurning === 0, 'a made save still burns, but does not catch');
ok(r.driven.y <= 4 && r.driven.hp < 40 && r.driven.caught, `driven back through a burning tile, it burns and catches (${JSON.stringify(r.driven)})`);
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await br.close(); srv.kill();
process.exit(fail || errors.length ? 1 : 0);
