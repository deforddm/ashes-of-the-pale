// v4.10: saves outlive a cleared browser. A backup file holds every sergeant and the settings; a cleared device loads it back;
// the reminder shows on the title and at a chapter's end and speaks up when overdue; a save code still loads one sergeant;
// a whole backup pasted as a code is pointed at the file button; a restore over an existing name asks twice.
// Usage: node tools/backup_test.mjs   (build first; exit 1 on a failure)
import { server, browser as launch } from './page.mjs';
import { readFileSync, mkdtempSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path';
const srv = await server(); const br = await launch();
const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(String(e)));
const bad = [], ok = m => console.log('  ok  ' + m), no = m => { bad.push(m); console.log('  FAIL ' + m); };
await page.goto(srv.url); await page.waitForTimeout(800);
// two sergeants, one three chapters in; a setting changed
await page.evaluate(() => { localStorage.clear(); S = newState('Hask'); S.chapter = 3; S.chapters = {1:'line', 2:'road', 3:'refuse'}; S.silver = 77; save(); S = newState('Vesh'); save(); S = null; SET.art = false; saveSet(); });
const r0 = await page.evaluate(() => ({ due: backupDue(), mark: backupMark(), n: roster().list.length }));
r0.n === 2 && r0.due && !r0.mark ? ok('two sergeants, never backed up: a backup is due') : no('start: ' + JSON.stringify(r0));
// the title shows the reminder and says so
await page.evaluate(() => showTitle()); await page.waitForTimeout(300);
const t0 = await page.evaluate(() => ({ line: !!document.querySelector('.bkline.due'), text: (document.querySelector('.bkline') || {}).textContent || '', btn: (document.querySelector('#bImp') || {}).textContent || '' }));
t0.line && /Never backed up/.test(t0.text) && /erases every save/.test(t0.text) ? ok('the title reminder is up and says what a clear does') : no('title reminder: ' + JSON.stringify(t0));
/Backups/.test(t0.btn) ? ok('the title button says Backups') : no('title button: ' + t0.btn);
// the file: downloaded from the Save tab, every sergeant and the settings inside
await page.evaluate(() => openModal('save')); await page.waitForTimeout(200);
const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('#bDown')]);
if (!dl) no('no download started'); else {
  const dir = mkdtempSync(join(tmpdir(), 'ftrbk-')), path = join(dir, dl.suggestedFilename()); await dl.saveAs(path);
  const b = JSON.parse(readFileSync(path, 'utf8'));
  /^ashes-of-the-pale-saves-\d{4}-\d{2}-\d{2}\.json$/.test(dl.suggestedFilename()) ? ok('the file is named with the date: ' + dl.suggestedFilename()) : no('file name: ' + dl.suggestedFilename());
  b.ftr === 1 && b.sergeants.length === 2 && b.sergeants.some(s => s.name === 'Hask' && s.chapter === 3 && s.silver === 77) && b.sergeants.some(s => s.name === 'Vesh') ? ok('both sergeants are in the file, whole') : no('file sergeants: ' + JSON.stringify(b.sergeants.map(s => [s.name, s.chapter, s.silver])));
  b.settings && b.settings.art === false ? ok('the settings are in the file') : no('file settings: ' + JSON.stringify(b.settings));
  const r1 = await page.evaluate(() => ({ due: backupDue(), mark: !!backupMark(), msg: document.querySelector('#bkMsg').textContent, when: document.querySelector('#bkWhen').textContent }));
  !r1.due && r1.mark && /Saved as/.test(r1.msg) && /today/.test(r1.when) ? ok('the download marks the backup; nothing due') : no('after download: ' + JSON.stringify(r1));
  // the device is cleared: nothing left
  await page.evaluate(() => { localStorage.clear(); }); await page.reload(); await page.waitForTimeout(800);
  const r2 = await page.evaluate(() => ({ n: roster().list.length, line: !!document.querySelector('.bkline') }));
  r2.n === 0 && !r2.line ? ok('a cleared device: no sergeants, no reminder') : no('cleared: ' + JSON.stringify(r2));
  // the file comes back through the title's Load button
  await page.click('#bImp'); await page.waitForTimeout(200);
  await page.setInputFiles('#bkFile', path); await page.waitForTimeout(500);
  const r3 = await page.evaluate(() => ({ list: roster().list.map(e => e.name + ':' + (e.book || 'gotm') + ':' + e.ch).sort(), art: SET.art, mark: !!backupMark(), title: !!document.querySelector('#title'), rows: document.querySelectorAll('.sgtrow').length }));
  r3.list.join() === 'Hask:gotm:3,Vesh:gotm:0' ? ok('both sergeants are back, chapters kept') : no('restored: ' + r3.list.join());
  r3.art === false ? ok('the settings are back') : no('settings after restore: ' + r3.art);
  r3.mark && r3.title && r3.rows >= 1 ? ok('restoring counts as backed up and lands on the title') : no('after restore: ' + JSON.stringify(r3));
  // the same file again, over the same names: asks twice, then replaces
  await page.evaluate(() => { const s = loadSlot(roster().list.find(e => e.name === 'Hask').id); s.silver = 1; localStorage.setItem(slotKey(s.sid), JSON.stringify(s)); });
  await page.click('#bImp'); await page.waitForTimeout(200); await page.setInputFiles('#bkFile', path); await page.waitForTimeout(400);
  const r4 = await page.evaluate(() => ({ btn: document.querySelector('#bRestore').textContent, warn: document.querySelector('#bRestore').classList.contains('warn'), silver: loadSlot(roster().list.find(e => e.name === 'Hask').id).silver }));
  /Replace 2 sergeants/.test(r4.btn) && r4.warn && r4.silver === 1 ? ok('a clash asks first and changes nothing yet') : no('clash: ' + JSON.stringify(r4));
  await page.click('#bRestore'); await page.waitForTimeout(400);
  const r5 = await page.evaluate(() => ({ n: roster().list.length, silver: loadSlot(roster().list.find(e => e.name === 'Hask').id).silver }));
  r5.n === 2 && r5.silver === 77 ? ok('the second tap replaces, no duplicates') : no('after replace: ' + JSON.stringify(r5));
  // a whole backup pasted as a save code is pointed at the file button; a real code still loads
  await page.evaluate(() => openModal('save')); await page.waitForTimeout(200);
  await page.fill('#imp', readFileSync(path, 'utf8')); await page.click('#bLoad'); await page.waitForTimeout(200);
  /whole backup/.test(await page.evaluate(() => document.querySelector('#impMsg').textContent)) ? ok('a backup pasted as a code is sent to Load a backup file') : no('backup-as-code message: ' + await page.evaluate(() => document.querySelector('#impMsg').textContent));
  await page.fill('#imp', await page.evaluate(() => { const s = newState('Corl'); s.chapter = 2; return btoa(unescape(encodeURIComponent(JSON.stringify(s)))); })); await page.click('#bLoad'); await page.waitForTimeout(600);
  (await page.evaluate(() => roster().list.length)) === 3 ? ok('a save code still loads one sergeant') : no('save code load: ' + await page.evaluate(() => roster().list.length));
}
// the reminder at a chapter's end, and overdue after three chapters
await page.evaluate(() => { markBackup(); S = loadSlot(roster().list.find(e => e.name === 'Hask').id); S.chapter = 4; S.chapters[4] = 'aside'; S.scene = 'chend'; save(); showChapterEnd(); }); await page.waitForTimeout(300);
const e0 = await page.evaluate(() => ({ line: !!document.querySelector('.end .bkline'), due: !!document.querySelector('.end .bkline.due') }));
e0.line && !e0.due ? ok('the chapter end carries the reminder, not yet due') : no('chapter end: ' + JSON.stringify(e0));
await page.evaluate(() => { S.chapter = 6; S.chapters[5] = 'hold'; S.chapters[6] = 'alley'; save(); showChapterEnd(); }); await page.waitForTimeout(300);
(await page.evaluate(() => !!document.querySelector('.end .bkline.due') && !!document.querySelector('#bBk'))) ? ok('three chapters on, the reminder speaks up with a button') : no('overdue reminder missing');
await page.click('#bBk'); await page.waitForTimeout(200);
(await page.evaluate(() => !document.querySelector('#modal').hidden && !!document.querySelector('#bDown'))) ? ok('its button opens the Backups tab') : no('reminder button did not open Backups');
// the width: nothing wider than the phone
const w = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
w <= 390 ? ok('nothing wider than the phone') : no('page width ' + w);
errors.length === 0 ? ok('no page errors') : no('page errors: ' + errors.join(' | '));
await br.close(); srv.kill();
console.log(bad.length ? `backup_test FAIL (${bad.length})` : 'backup_test PASS'); process.exit(bad.length ? 1 : 0);
