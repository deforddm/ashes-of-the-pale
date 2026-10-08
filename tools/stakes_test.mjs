// v3.12 quick test: enemy tricks fire, Ohl's Wash and Stanch, a second area, the gods on a wipe, Bridgeburner wounds.
import { server, browser as launch, openGame } from './page.mjs';
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true });
const out = await page.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms)), log = []; try {
  S = newState('Hask'); S.chapter = 3; S.lvl = 4; S.squad = ['sgt','brisk','kettle','tuft','ohl']; migrate(S); S.loy.brisk = 2; S.loy.ohl = 1; save();
  // a fake two-area fight from an existing one
  BATTLES.__t = Object.assign({}, BATTLES.knives, {after:'__after', stage2:{title:'The courtyard', text:'Further in.', map:BATTLES.knives.map, foes:[['bruiser',3,1],['guildveteran',4,1],['assassin',2,0]], xp:50}});
  DLG.__after = () => ({sp:'After', txt:'Done.', ch:[{t:'Leave'}]});
  startBattle('__t', {}); await wait(600);
  log.push('foe skills: ' + foes().map(f => f.kind + ':' + (f.sk || []).join('/')).join(' '));
  // Ohl's abilities
  const ohl = B.units.find(u => u.id === 'ohl'); log.push('ohl ab: ' + ohl.ab.join(','));
  B.units.forEach(u => { if (u.side === 'p') u.hp = Math.max(1, u.hp - 6); });
  B.cur = ohl; B.busy = false; B.acted = false; useAb('wash', ohl.x, ohl.y); await wait(400); log.push('after wash: ' + party().map(u => u.id + ' ' + u.hp + '/' + u.maxhp).join(' '));
  B.cur = ohl; B.busy = false; B.acted = false; ohl.strain = 0; const t = AB.stanch.tiles(ohl)[0]; useAb('stanch', t.x, t.y); await wait(300); hurt(t, 999); log.push(`stanch: ${t.id} hp ${t.hp}`);
  // enemy riders and specials directly
  const k = foes()[0]; const sq = party()[0]; foeRiders(k, sq, 3); log.push(`riders on ${sq.id}: bleed ${sq.bleed} slow ${!!sq.slowTurn}`);
  // clear stage 1 -> second area
  foes().forEach(f => hurt(f, 999)); checkEnd(); await wait(2500);
  log.push('sheet: ' + ($('#sheet').hidden ? 'hidden' : $('#sheet').innerText.slice(0, 160).replace(/\n+/g, ' | ')));
  $('#bOn') && $('#bOn').click(); await wait(800);
  log.push('stage2: ' + (B && B.def.isStage2) + ' title ' + (B && B.def.title) + ' foes ' + foes().map(f => f.kind).join(',') + ' squad hp ' + party().map(u => u.id + ' ' + u.hp).join(' ') + ' xp ' + B.def.xp);
  // wipe: the gods
  party().forEach(u => { u.hp = 0; }); checkEnd(); await wait(2500);
  log.push('god: ' + $('#sheet').innerText.slice(0, 220).replace(/\n+/g, ' | '));
  log.push('gods used: ' + JSON.stringify(S.gods));
  $('#bRetry').click(); await wait(800); log.push('retried: stage2 ' + (B && B.def.isStage2) + ' hp ' + party().map(u => u.id + ' ' + u.hp).join(' '));
  // burn through the gods
  for (let i = 0; i < 4 && B; i++) { party().forEach(u => { u.hp = 0; }); checkEnd(); await wait(2300); log.push(`wipe ${i + 2}: ` + $('#sheet').querySelector('.sp').textContent); const nb = $('#sheet').querySelector('.sp').textContent; $('#bRetry').click(); await wait(900); if (/No one/.test(nb)) break; }
  log.push('after no god: view ' + view + ' chapter ' + S.chapter + ' scene ' + S.scene);
  // Bridgeburner wounds
  S = newState('Bb'); S.diff = 'bridgeburner'; S.chapter = 2; S.squad = ['sgt','brisk','kettle','tuft','ohl']; migrate(S); save();
  startBattle('outriders', {}); await wait(600); party().forEach(u => { u.hp = Math.max(1, u.hp - 10); }); foes().forEach(f => hurt(f, 999)); checkEnd(); await wait(2500); if ($('#bOn')) { $('#bOn').click(); await wait(800); foes().forEach(f => hurt(f, 999)); checkEnd(); await wait(2500); }
  log.push('wounds: ' + JSON.stringify(S.wounds) + ' salves ' + S.inv.salve);
  } catch (e) { log.push('ERR ' + e.stack.split('\n').slice(0,3).join(' | ') + ' view=' + view + ' B=' + !!B); } return log;
});
console.log(out.join('\n'));
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await br.close(); srv.kill();
// exit 1 on a page error or a caught exception (an ERR line)
process.exit(errors.length || out.some(l => /^ERR /.test(l)) ? 1 : 0);
