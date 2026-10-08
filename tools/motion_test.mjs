// Settings › Motion › Reduced: a vision's title card (.vtitle) is gone or invisible within about 2 s, and nothing runs an
// infinite CSS animation on the main screens (title, explore, battle). The setting is changed through the Settings page.
// Usage: node tools/motion_test.mjs   (exit 1 on a failure)
import { server, browser, openGame } from './page.mjs';
const srv = await server(); const br = await browser();
const { page, errors } = await openGame(br, srv.url, { settings: { master: 0, music: 0, sfx: 0, amb: 0, speed: 0.02, motion: 'auto' } });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
await page.evaluate(() => openSettings());
await page.click('#settings [data-k="motion"][data-v="off"]'); await page.waitForTimeout(150);
ok(await page.evaluate(() => SET.motion === 'off' && document.body.classList.contains('reduce') && REDUCE()), 'Settings › Motion › Reduced is on (body.reduce)');
await page.evaluate(() => { $('#settings').hidden = true; $('#settings').innerHTML = ''; });
// infinite CSS animations still running on the page (Web Animations API sees CSS animations and transitions)
const endless = () => page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running' && a.effect && a.effect.getComputedTiming().iterations === Infinity)
  .map(a => { const t = a.effect.target; return `${a.animationName || 'anim'} on ${t ? t.tagName.toLowerCase() + (t.id ? '#' + t.id : '') + (t.className && typeof t.className === 'string' ? '.' + t.className.trim().split(/\s+/).join('.') : '') : '?'}${a.effect.pseudoElement || ''}`; }));
// a vision from the journal
await page.evaluate(() => { S = newState('Hask'); S.chapter = 2; S.squad = ['sgt', 'brisk', 'kettle', 'tuft', 'ohl']; migrate(S); S.picksDue = []; save();
  startExplore(CHAPTERS[2].area.id); openModal('journal'); document.querySelectorAll('#modal details').forEach(d => d.open = true); });
await page.click('#modal [data-vision]'); await page.waitForTimeout(100);
const shown = await page.evaluate(() => !!document.querySelector('.vtitle'));
ok(shown, 'the vision opens with its title card');
await page.waitForTimeout(1900);
const vt = await page.evaluate(() => { const v = document.querySelector('.vtitle'); if (!v) return 'gone'; const cs = getComputedStyle(v);
  return cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05 ? 'invisible' : `still showing (opacity ${cs.opacity}, animation ${cs.animationName} ${cs.animationDuration})`; });
ok(vt === 'gone' || vt === 'invisible', `after 2 s the vision title card is ${vt}`);
// the main screens
await page.evaluate(() => { if (VIS) visEnd(); document.querySelectorAll('#modal,#chars,#settings,#sheet').forEach(e => e.hidden = true); S = null; showTitle(); });
await page.waitForTimeout(600); let e = await endless();
ok(!e.length, `title: no infinite animation running ${e.slice(0, 4).join(', ')}`);
await page.evaluate(() => { S = newState('Hask'); S.chapter = 3; migrate(S); S.picksDue = []; save(); startExplore(CHAPTERS[3].area.id); });
await page.waitForTimeout(600); e = await endless();
ok(!e.length, `explore: no infinite animation running ${e.slice(0, 4).join(', ')}`);
await page.evaluate(() => { startBattle(Object.keys(BATTLES).find(k => BATTLES[k].foes && BATTLES[k].foes.length) , {}); });
await page.waitForTimeout(900); e = await endless();
ok(await page.evaluate(() => view === 'battle'), 'battle: opened');
ok(!e.length, `battle: no infinite animation running ${e.slice(0, 4).join(', ')}`);
ok(!errors.length, 'no page errors ' + errors.join(' | '));
await br.close(); srv.kill(); process.exit(fail);
