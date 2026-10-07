// The phone's Back button: closes what is open, never leaves the game by accident, and asks before it does.
// Usage: node tools/back_test.mjs   (exit 1 on a failure)
import { server, browser, openGame } from './page.mjs';
const srv = await server(); const br = await browser();
const { page, errors } = await openGame(br, srv.url, { fast: true, touch: true, mobile: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const onGame = async () => page.url().startsWith(srv.url.replace('index.html', ''));
const back = async () => { await page.goBack({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(400); };
await page.evaluate(() => { S = newState('Hask'); save(); startExplore(CHAPTERS[1].area.id); });
await page.mouse.click(200, 300); await page.waitForTimeout(200); // the player touches the game
// two things open at once, two Backs with no touch between: both close, still in the game
await page.evaluate("openModal('journal'); artView('map/pale')"); await page.waitForTimeout(200); await page.mouse.click(5, 5).catch(() => {});
await page.evaluate("if (!artViewOpen()) artView('map/pale')"); await page.waitForTimeout(200);
await back(); ok(await onGame() && !(await page.evaluate('artViewOpen()')) && await page.evaluate("!$('#modal').hidden"), 'two open: the first Back closes the viewer');
await back(); ok(await onGame() && await page.evaluate("$('#modal').hidden"), 'two open: the second Back closes the journal, still in the game');
await page.mouse.click(200, 300); await page.waitForTimeout(200);
for (const [what, open, isOpen] of [
  ['journal', "openModal('journal')", "!$('#modal').hidden"],
  ['squad sheets', "openChars(0)", "!$('#chars').hidden"],
  ['settings', "openSettings()", "!$('#settings').hidden"],
  ['map viewer', "openModal('journal'); artView('map/pale')", "artViewOpen()"],
  ['item viewer', "openChars(0); itemView('munitions/keep_sgt')", "artViewOpen()"],
  ['journal, closed and reopened at once', "openModal('journal'); $('#modal').hidden = true; openModal('pack')", "!$('#modal').hidden"],
]) {
  await page.evaluate(open); await page.mouse.click(5, 5).catch(() => {}); await page.evaluate(open); await page.waitForTimeout(250);
  ok(await page.evaluate(isOpen), `${what}: open`);
  await back();
  ok(await onGame() && !(await page.evaluate(isOpen)), `${what}: Back closes it and stays in the game`);
}
await page.evaluate(() => { document.querySelectorAll('#modal,#chars,#settings').forEach(e => e.hidden = true); });
await page.mouse.click(200, 300); await page.waitForTimeout(200);
await back();
ok(await onGame(), 'nothing open: Back stays in the game');
ok(await page.evaluate(() => !!document.getElementById('leavet')), 'nothing open: it says "Press Back again to leave"');
await page.waitForTimeout(3400);
ok(await page.evaluate(() => !document.getElementById('leavet')), 'the note goes away after a few seconds');
await back();
ok(await onGame(), 'after the note lapses, a single Back still stays');
await back(); await back();
ok(!(await onGame()), 'Back twice in a row leaves');
ok(!errors.length, 'no page errors ' + errors.join(' | '));
await br.close(); srv.kill(); process.exit(fail);
