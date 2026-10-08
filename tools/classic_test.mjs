// Settings › Artwork › Classic: every screen that has a painted picture falls back to the old drawings (canvas), with no
// painted element left on it; then Painted again brings the pictures back. The setting is changed through the Settings page.
// Usage: node tools/classic_test.mjs   (exit 1 on a failure)
import { server, browser, openGame } from './page.mjs';
const srv = await server(); const br = await browser();
const { page, errors } = await openGame(br, srv.url, { fast: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const PAINTED = 'span.art, .titleart, .artscene, .jpapers, [data-iz], .paper';
const DONE = { 0: 'given', 1: 'line', 2: 'road', 3: 'refuse', 4: 'shield', 5: 'hold', 6: 'bridgeburners' };
// count the painted Deck faces handed to the card canvas (artImg is the only way a painted picture reaches a canvas)
await page.evaluate(() => { const real = artImg; window.__artImgs = 0; artImg = k => { const r = real(k); if (r) window.__artImgs++; return r; }; });
const setArt = async v => {
  await page.evaluate(() => { document.querySelectorAll('#modal,#chars').forEach(e => e.hidden = true); openSettings(); });
  await page.click(`#settings [data-k="art"][data-v="${v}"]`); await page.waitForTimeout(150);
  const on = await page.evaluate(() => [SET.art, JSON.parse(localStorage.getItem('ashes-of-the-pale-settings') || '{}').art]);
  await page.evaluate(() => { $('#settings').hidden = true; $('#settings').innerHTML = ''; });
  return on;
};
const close = () => page.evaluate(() => { document.querySelectorAll('#modal,#chars,#settings').forEach(e => e.hidden = true); const c = $('#cardfx'); if (c) { c.hidden = true; c.innerHTML = ''; } cardAnim = null; });
// each screen: how to open it, and the old drawing that must be there in Classic
const SCREENS = [
  ['title', () => showTitle(), '#titlecv:not([hidden])', '#app'],
  ['chapter 3 opening', () => { S.chapter = 3; showChapterIntro(); }, 'canvas', '#app'],
  ['chapter 2 end', () => { S.chapter = 2; S.scene = 'chend'; showChapterEnd(); }, '#scv', '#app'],
  ['Deck reading (Hounds)', () => { startExplore(CHAPTERS[3].area.id); cardSequence(() => {}, { card: 'hounds' }); }, '#ccv', '#cardfx'],
  ['pack', () => { startExplore(CHAPTERS[3].area.id); openModal('pack'); }, '#icard', '#modal'],
  ['squad sheet', () => { startExplore(CHAPTERS[3].area.id); openChars(SQUAD().indexOf('tuft')); }, '#pcv', '#chars'],
  ['journal', () => { startExplore(CHAPTERS[3].area.id); openModal('journal'); document.querySelectorAll('#modal details').forEach(d => d.open = true); }, '#jRoute', '#modal'],
];
const prep = () => page.evaluate(d => { S = newState('Hask'); S.chapter = 7; S.chapters = d; S.squad = ['sgt', 'brisk', 'kettle', 'tuft', 'ohl', 'ellis']; migrate(S);
  S.kit = Object.keys(ITEMS); S.kit.forEach(g => placeGear(g)); S.card = 'hounds'; S.picksDue = []; notes = []; save(); }, DONE);
const look = async (sel, scope = 'body', wait = 450) => { await page.waitForTimeout(wait); return page.evaluate(([P, sel, scope]) => {
  const vis = el => !el.closest('[hidden]') && getComputedStyle(el).display !== 'none';
  return { painted: [...document.querySelector(scope).querySelectorAll(P)].filter(vis).map(e => e.className && e.className.baseVal === undefined ? e.className : e.tagName).slice(0, 3),
    drawing: [...document.querySelectorAll(sel)].some(vis), faces: window.__artImgs }; }, [PAINTED, sel, scope]); };

const c = await setArt('false');
ok(c[0] === false && c[1] === false, 'Settings › Artwork › Classic is set and saved');
await prep();
for (const [name, open, sel, scope] of SCREENS) {
  await close(); await prep(); await page.evaluate(() => { window.__artImgs = 0; }); await page.evaluate(open);
  const r = await look(sel, 'body', scope === '#cardfx' ? 3000 : 450); // the whole page, and the reading long enough for the card to turn
  ok(!r.painted.length && !r.faces, `Classic ${name}: no painted artwork${r.painted.length ? ' (' + r.painted.join(', ') + ')' : ''}${r.faces ? ` (${r.faces} painted face draws)` : ''}`);
  ok(r.drawing, `Classic ${name}: the old drawing is there (${sel})`);
}
await close();
const p = await setArt('true');
ok(p[0] === true && p[1] === true, 'Settings › Artwork › Painted set is set and saved');
await prep(); await page.evaluate(() => artWarm()); await page.waitForTimeout(800);
for (const [name, open, , scope] of SCREENS) {
  await close(); await prep(); await page.evaluate(() => { window.__artImgs = 0; }); await page.evaluate(open);
  const r = await look('canvas', scope, scope === '#cardfx' ? 3000 : 450);
  ok(scope === '#cardfx' ? r.faces > 0 : r.painted.length, `Painted ${name}: the painted picture is back (${scope === '#cardfx' ? r.faces + ' painted face draws' : r.painted.join(', ')})`);
}
ok(!errors.length, 'no page errors ' + errors.join(' | '));
await br.close(); srv.kill(); process.exit(fail);
