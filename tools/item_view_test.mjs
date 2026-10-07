// The item viewer (3.15.2): no Artwork page; tapping gear, munitions and keepsakes opens them large with their text.
// Usage: node tools/item_view_test.mjs [shotdir]   (exit 1 on a failure)
import { server, browser, openGame } from './page.mjs';
const shots = process.argv[2] || null;
const srv = await server(); const br = await browser();
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
for (const mobile of [false, true]) {
  const { page, errors } = await openGame(br, srv.url, mobile ? { fast: true, mobile, touch: true } : { fast: true, width: 1366, height: 768 });
  const tag = mobile ? 'phone' : 'pc';
  ok(await page.evaluate("!document.getElementById('bArt')"), `${tag}: no Artwork button on the title`);
  await page.evaluate(() => { S = newState('Hask'); S.kit = ['heater', 'houndtooth', 'barrowflint', 'fetemask']; S.inv.smoker = 2; save(); startExplore(CHAPTERS[1].area.id); openModal('pack'); });
  await page.waitForTimeout(300);
  ok(await page.evaluate("![...document.querySelectorAll('#modal .tab')].some(b => b.dataset.t === 'art')"), `${tag}: no Art tab`);
  ok(await page.evaluate("typeof artTabHTML === 'undefined' && typeof ART_BOARDS === 'undefined'"), `${tag}: the gallery code and data are gone`);
  await page.click('#modal [data-iz="munitions/sharper"]'); await page.waitForTimeout(300);
  ok(await page.evaluate("artViewOpen() && /Sharper/.test($('#artview .ivtext h3').textContent) && /In the pack/.test($('#artview').textContent)"), `${tag}: pack sharper opens large with its text`);
  if (shots) await page.screenshot({ path: `${shots}/${tag}-sharper.png` });
  await page.click('#avClose'); await page.waitForTimeout(200);
  ok(await page.evaluate("!artViewOpen() && !$('#modal').hidden"), `${tag}: Close goes back to the pack`);
  await page.evaluate(() => { $('#modal').hidden = true; openChars(0); }); await page.waitForTimeout(300);
  const n = await page.evaluate("document.querySelectorAll('#chars [data-iz]').length");
  ok(n >= 5, `${tag}: squad sheet has ${n} tappable pictures`);
  await page.click('#chars [data-iz="item/barrowflint"]'); await page.waitForTimeout(300);
  const t = await page.evaluate("$('#artview').innerText");
  ok(/Barrow-flint blade/.test(t) && /It still cuts/.test(t) && /found in Chapter V/.test(t) && /Can be used by/.test(t), `${tag}: gear opens with the full line, chapter and who can use it`);
  if (shots) await page.screenshot({ path: `${shots}/${tag}-flint.png` });
  await page.click('#avClose'); await page.waitForTimeout(200);
  await page.click('#chars [data-iz="munitions/keep_sgt"]'); await page.waitForTimeout(300);
  ok(await page.evaluate("/What Sergeant Hask carries/.test($('#artview').innerText) && /pay ledger/i.test($('#artview').innerText)"), `${tag}: keepsake opens with what they carry`);
  if (shots) await page.screenshot({ path: `${shots}/${tag}-keep.png` });
  await page.click('#avClose'); await page.waitForTimeout(200);
  await page.evaluate(() => { SET.art = false; openChars(0); }); await page.waitForTimeout(200);
  ok(await page.evaluate("document.querySelectorAll('#chars [data-iz]').length === 0"), `${tag}: Classic set: no picture, nothing to tap`);
  await page.evaluate(() => { SET.art = true; });
  ok(!errors.length, `${tag}: no page errors ` + errors.join(' | '));
  await page.close();
}
await br.close(); srv.kill(); process.exit(fail);
