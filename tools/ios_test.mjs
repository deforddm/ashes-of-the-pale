// iPhone and iPad (v4.9.2): home-screen apps keep their saves apart, so the title offers a save code for every sergeant (Book Two too)
// and the steps to From the Ranks. Runs as an iPhone browser. Other devices keep the one-line link.
// Usage: node tools/ios_test.mjs   (build first; exit 1 on a failure)
import { server, browser as launch } from './page.mjs';
const srv = await server(); const br = await launch();
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: UA });
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: srv.url.replace(/\/$/, '') });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e)));
await page.goto(srv.url); await page.waitForTimeout(600);
const bad = [], ok = m => console.log('  ok  ' + m), no = m => { bad.push(m); console.log('  FAIL ' + m); };
const r = await page.evaluate(async () => {
  localStorage.clear(); localStorage.setItem('ashes-of-the-pale-seen', '9.9.9');
  const v = {v:1, sid:'bbb', name:'Vesh', book:'dg', chapter:3, lvl:4, squad:[], f:{}};
  localStorage.setItem('ashes-of-the-pale-v1:bbb', JSON.stringify(v));
  S = newState('Hask'); save(); S = null; const m = roster(); m.list.push({id:'bbb', book:'dg', name:'Vesh', ch:3, lvl:4, upd:1}); localStorage.setItem('ashes-of-the-pale-roster', JSON.stringify(m));
  showTitle(); await new Promise(f => setTimeout(f, 200));
  const btns = [...document.querySelectorAll('[data-code]')]; const out = { ios: IOS(), labels: btns.map(b => b.textContent), steps: document.querySelectorAll('.iosteps li').length, codes: [] };
  for (const b of btns) { b.click(); await new Promise(f => setTimeout(f, 250)); let c = ''; try { c = await navigator.clipboard.readText(); } catch(e) {} let d = null; try { d = JSON.parse(decodeURIComponent(escape(atob(c)))); } catch(e) {} out.codes.push(d ? d.name + ':' + (d.book || 'gotm') : 'bad'); }
  $('#bFtrAddr').click(); await new Promise(f => setTimeout(f, 250)); try { out.addr = await navigator.clipboard.readText(); } catch(e) {}
  out.link = (document.querySelector('.onward a') || {}).getAttribute && document.querySelector('.onward a').getAttribute('target');
  return out;
});
r.ios ? ok('seen as an iPhone') : no('not seen as an iPhone');
r.labels.join() === 'Hask,Vesh (Book Two)' ? ok('a code button for every sergeant, Book Two too') : no('buttons: ' + r.labels.join());
r.codes.join() === 'Hask:gotm,Vesh:dg' ? ok('each button copies that sergeant\'s working save code') : no('codes: ' + r.codes.join());
r.addr === 'https://deforddm.github.io/from-the-ranks/' ? ok('Copy address copies the From the Ranks address') : no('address: ' + r.addr);
r.steps === 3 ? ok('three steps shown') : no('steps: ' + r.steps);
r.link === '_blank' ? ok('the link opens outside the app') : no('link target: ' + r.link);
// not an iPhone: the one-line link, no steps
const p2 = await (await br.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p2.goto(srv.url); await p2.waitForTimeout(500);
const r2 = await p2.evaluate(() => { showTitle(); return { steps: document.querySelectorAll('.iosteps').length, codes: document.querySelectorAll('[data-code]').length }; });
!r2.steps && !r2.codes ? ok('other devices keep the one-line link') : no('non-iPhone shows iPhone steps');
await br.close(); srv.kill();
if (errs.length) { console.log('page errors:', errs); process.exit(1); }
if (bad.length) { console.log(`ios: FAIL (${bad.length})`); process.exit(1); }
console.log('ios: 7 ok, 0 FAIL');
