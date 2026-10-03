// Quick test: every trick in a real battle, the picker, the dice outcomes, the fold, replay unlock.
import { server, browser as launch, openGame } from './page.mjs';
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true });
const out = await page.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms)); const log = [];
  S = newState('Hask'); S.chapter = 6; S.lvl = 5; S.squad = ['sgt','brisk','kettle','tuft','ohl','ellis']; migrate(S);
  const T = {fold:'tuft', line:'brisk', song:'ohl', pull:'kettle', bluefire:'kettle', cant:'ellis', rope:'tuft', otataral:'brisk', dark:'sgt', rime:'sgt'};
  Object.entries(T).forEach(([k, w]) => earnTrick(k, w)); notes = []; save();
  log.push('tricks: ' + Object.keys(S.tricks).join(','));
  const bid = Object.keys(BATTLES).find(k => BATTLES[k].foes.some(f => f[0] === 'raest')) || Object.keys(BATTLES)[0];
  startBattle(bid, {}); await wait(800);
  const abs = B.units.filter(u => u.side === 'p' && !u.ally).map(u => u.id + ':' + u.ab.join('/'));
  log.push('battle ' + bid + ' abs ' + abs.join(' | '));
  // drive: for each squad unit, force its turn and use each trick it has
  for (const u of B.units.filter(u => u.side === 'p' && !u.ally)) {
    for (const k of u.ab.filter(k => AB[k] && AB[k].trick)) {
      B.cur = u; B.busy = false; B.acted = false; B.moved = false; B.mode = 'act'; B.over = false;
      const a = AB[k]; const ok = abOk(u, k); let tgt = null;
      if (!ok) { log.push(`${k}: not ok for ${u.id}`); continue; }
      if (a.self) useAb(k, u.x, u.y);
      else if (a.aoe) { const f = foes()[0] || u; useAb(k, f.x, f.y); }
      else { const ts = a.tiles(u); tgt = ts[0]; if (!tgt) { log.push(`${k}: no target`); continue; } useAb(k, tgt.x, tgt.y); }
      await wait(700);
      log.push(`${k} by ${u.id} -> ok; used=${JSON.stringify(B.used)} left=${trickLeft(a.trick)} acted=${B.acted}`);
    }
  }
  const f0 = foes()[0]; log.push('foe state ' + (f0 ? JSON.stringify({k:f0.kind, otat:f0.otat, rime:f0.rimeUntil, stun:f0.stun, cant:f0.cantRound, dz:f0.dazzleUntil, ai:f0.ai}) : 'none'));
  log.push('line ' + !!B.line + ' dark tiles ' + B.smoke.filter(s => s.dark).length);
  // an attack with luck + cant
  const me = B.units.find(u => u.id === 'kettle'); const tg = foes()[0]; if (me && tg) { me.luckyTurn = B.turn; tg.cantRound = B.round; const r = attack(me, tg); log.push('attack ' + JSON.stringify(r)); }
  await wait(500);
  return log;
});
console.log(out.join('\n'));
await page.screenshot({ path: '/tmp/claude-0/shots/tricks_battle.png' });
// the picker and dice in a talk node
const out2 = await page.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms)); const log = [];
  B = null; S = newState('Hask'); S.squad = ['sgt','brisk','kettle','tuft','ohl']; migrate(S); S.loy.tuft = 2; S.rattled = {ohl:1}; save();
  view = 'explore'; startExplore('pale'); await wait(300);
  DLG.__t = () => ({sp:'Test', txt:'A test of the picker. {who} rolled last.', ch:[{t:'"Malazan, you idiots!"', check:['guile', 13], edges:id => [id === 'kettle' && ['Kettle cannot lie', -2]], go:'__ok', fail:'__no'}, {t:'Learn a trick', check:['wits', 15], trick:'fold', go:'__ok', fail:'__no'}, {t:'Leave'}]});
  DLG.__ok = () => ({sp:'OK', txt:`Made it: ${by({tuft:'Tuft did it.', _:'{who} did it.'})} tier ${ROLL().tier}`, ch:[{t:'Leave'}]});
  DLG.__no = () => ({sp:'No', txt:`Missed: {who}, tier ${ROLL().tier}`, ch:[{t:'Leave'}]});
  talk('__t'); await wait(200);
  log.push('tags: ' + [...document.querySelectorAll('#sheet .choice .tagk')].map(e => e.textContent).join(' | '));
  document.querySelector('#ch0').click(); await wait(200);
  log.push('picker: ' + [...document.querySelectorAll('#sheet .choice.who')].map(e => e.textContent.replace(/\s+/g, ' ')).join(' || '));
  return log;
});
console.log(out2.join('\n'));
await page.screenshot({ path: '/tmp/claude-0/shots/picker.png' });
const out3 = await page.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms)); const log = [];
  document.querySelector('#sheet [data-who="tuft"]').click(); await wait(400);
  log.push('dice: ' + ($('#dice') ? $('#dice').textContent.replace(/\s+/g,' ') : 'none'));
  for (let i = 0; i < 30 && $('#dice'); i++) { $('#dice').click(); await wait(150); }
  await wait(300); log.push('after: ' + $('#sheet').textContent.replace(/\s+/g, ' ').slice(0, 300));
  // replay unlock: finished prologue and ch1
  S.chapters = {0:'given', 1:'line'}; S.chsnap = {1: JSON.parse(JSON.stringify(S))}; log.push('replayable ' + JSON.stringify(replayable()) + ' name ' + replayName(1));
  return log;
});
console.log(out3.join('\n'));
await page.screenshot({ path: '/tmp/claude-0/shots/after_roll.png' });
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await br.close(); srv.kill();
