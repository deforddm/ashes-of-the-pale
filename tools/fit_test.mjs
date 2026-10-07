// Nothing wider than a phone: every screen with artwork, at phone widths, must fit the screen (no sideways scroll,
// no element past the right edge). Usage: node tools/fit_test.mjs [widths...]   (exit 1 on a failure)
import { server, browser, openGame } from './page.mjs';
const widths = process.argv.slice(2).map(Number).filter(Boolean); if (!widths.length) widths.push(320, 360, 412);
const srv = await server(); const br = await browser();
let fail = 0;
const KEYS = {0:'given',1:'line',2:'road',3:'refuse',4:'shield',5:'hold',6:'bridgeburners',7:'outlaw'};
for (const w of widths) {
  const { page, errors } = await openGame(br, srv.url, { fast: true, mobile: true, touch: true, width: w, height: 800 });
  const check = async (label) => {
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth, sw = document.documentElement.scrollWidth, bad = [];
      for (const el of document.querySelectorAll('body *')) { if (el.closest('[hidden]') || el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
        const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed' && el.id !== 'artview') continue;
        const b = el.getBoundingClientRect(); if (!b.width || !b.height) continue;
        let p = el.parentElement, clipped = false; while (p) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'auto' || o === 'scroll') { if (p.getBoundingClientRect().right <= vw + 1) { clipped = true; break; } } p = p.parentElement; }
        if (!clipped && b.right > vw + 1) bad.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).trim().replace(/\s+/g, '.')} → ${Math.round(b.right)}`); }
      return { vw, sw, bad: bad.slice(0, 4) }; });
    const ok = r.sw <= r.vw && !r.bad.length;
    if (!ok) fail = 1;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${w}px ${label}${ok ? '' : ` (page ${r.sw} > ${r.vw}) ${r.bad.join(' | ')}`}`);
  };
  const reset = () => page.evaluate(() => { document.querySelectorAll('#modal,#chars,#settings,#cardfx,#artview').forEach(e => { e.hidden = true; }); window.scrollTo(0, 0); });
  await page.evaluate(() => { localStorage.clear(); showTitle(); }); await check('title');
  await page.evaluate(k => { S = newState('Hask'); S.chapter = 7; S.chapters = k; S.f.c7_key = 'outlaw'; S.kit = Object.keys(ITEMS); S.inv.smoker = 2; S.f.gotSmokers = 1; save(); }, KEYS);
  for (let n = 1; n <= 7; n++) { await page.evaluate(n => { S.chapter = n; showChapterIntro(); }, n); await check(`chapter ${n} opening`); }
  for (let n = 0; n <= 7; n++) { await page.evaluate(n => { S.chapter = n; S.scene = 'chend'; showChapterEnd(); }, n); await check(`chapter ${n} end`); }
  await page.evaluate(() => { S.chapter = 7; });
  const fp = await page.evaluate(() => finPages().length);
  for (let i = 0; i < fp; i++) { await page.evaluate(i => showFinale(i), i); await check(`finale page ${i + 1}/${fp}`); }
  await page.evaluate(() => startExplore(CHAPTERS[7].area.id));
  for (const t of ['pack', 'journal', 'save', 'deeds']) { await reset(); await page.evaluate(t => { openModal(t); document.querySelectorAll('#modal details').forEach(d => d.open = true); }, t); await check(`menu: ${t}`); }
  await reset();
  const sq = await page.evaluate(() => SQUAD().length);
  for (let i = 0; i < sq; i++) for (const tab of ['soldier', 'story']) { await page.evaluate(([i, tab]) => openChars(i, tab), [i, tab]); await check(`squad sheet ${i + 1} ${tab}`); }
  await reset(); await page.evaluate(() => openSettings()); await check('settings');
  await reset();
  const keys = await page.evaluate(() => Object.keys(ART).filter(k => /^(item|munitions)\//.test(k) && itemInfo(k)));
  for (const k of keys) { await page.evaluate(k => itemView(k), k); await check(`item viewer ${k}`); }
  for (const k of ['map/pale', 'map/genabackis', 'map/daru', 'map/gadrobi']) { await page.evaluate(k => artView(k), k); await check(`map viewer ${k}`); }
  await reset();
  for (const c of await page.evaluate(() => Object.keys(CARDS))) {
    await page.evaluate(c => cardSequence(() => {}, { card: c }), c); await page.waitForTimeout(600); await check(`Deck reading ${c}`);
    await page.evaluate(() => { const e = $('#cardfx'); e.hidden = true; e.innerHTML = ''; });
  }
  if (errors.length) { fail = 1; console.log('FAIL page errors ' + errors.join(' | ')); }
  await page.close();
}
await br.close(); srv.kill(); process.exit(fail);
