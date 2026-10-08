// v3.13 quick test: through the squad, Steady, Post up, hold-out takedowns, gear allocation and the sheet.
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true });
const out = await page.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms)), log = []; try {
  S = newState('Hask'); S.chapter = 4; S.lvl = 5; S.squad = ['sgt','brisk','kettle','tuft','ohl','ellis']; migrate(S); save();
  // gear: gain a few things and allocate
  ['heater','rhivibow','lampchip','collsignet','guildtoken','roadleather','toccloak','houndtooth'].forEach(g => { if (ITEMS[g]) gain(g); }); notes = [];
  log.push('auto: ' + JSON.stringify(S.gear));
  allocateGear(); log.push('alloc: ' + JSON.stringify(S.gear));
  startBattle('guild_roofs', {}); await wait(600);
  const sq = B.units.filter(u => u.side === 'p' && !u.ally);
  // move through: make the sergeant's turn, put brisk in front, check reach includes a tile beyond brisk
  const sg = sq.find(u => u.id === 'sgt'), br2 = sq.find(u => u.id === 'brisk');
  B.cur = sg; B.busy = false; B.moved = false; B.acted = false; B.mvLeft = sg.mv; B.mode = 'act'; updBattleUI();
  const beyond = [...B.reach.values()].filter(n => n.path.some(p => p.x === br2.x && p.y === br2.y));
  log.push(`through: ${beyond.length} tiles reached through Brisk; any on an occupied tile: ${[...B.reach.values()].some(n => n.d && !free(n.x, n.y, sg))}`);
  // steady
  endTurn(); await wait(200); log.push('steady: ' + sg.steady + ' bonus ' + atkCalc(sg, foes()[0]).bonus + ' vs ' + (sg.atk));
  // post up
  const ke = sq.find(u => u.id === 'kettle'); log.push('posted: ' + postedUp(ke) + ' rng ' + ke.rng);
  const f = foes()[0]; f.x = ke.x; f.y = Math.max(0, ke.y - ke.rng - 1); const was = {x:f.x, y:f.y}; f.y = ke.y - ke.rng; const fired = await postUp(f, was); await wait(200);
  log.push('post up fired: ' + fired + ' kettle fired flag ' + ke.fired + ' posted now ' + postedUp(ke));
  // hold-out takedown
  S.chapter = 1; startBattle('hounds_line', {}); await wait(400); foes().forEach(x => hurt(x, 999)); checkEnd(); await wait(2500);
  log.push('hold: ' + JSON.stringify(S.f.lastHold) + ' | sheet: ' + ($('#sheet').innerText || '').slice(0, 200).replace(/\n+/g, ' / '));
  } catch (e) { log.push('ERR ' + e.stack.split('\n').slice(0, 3).join(' | ')); } return log;
});
console.log(out.join('\n'));
await page.evaluate(() => { B = null; view = 'explore'; openChars(SQUAD().indexOf('tuft')); });
await page.waitForTimeout(500); await page.screenshot({ path: '/tmp/claude-0/shots/q_sheet_bonus.png', fullPage: false });
await page.evaluate(() => { const k = $('#chars').querySelector('.sec.kit'); k && k.scrollIntoView(); });
await page.waitForTimeout(300); await page.screenshot({ path: '/tmp/claude-0/shots/r_sheet_kit.png' });
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await br.close(); srv.kill();
// exit 1 on a page error or a caught exception (an ERR line)
process.exit(errors.length || out.some(l => /^ERR /.test(l)) ? 1 : 0);
