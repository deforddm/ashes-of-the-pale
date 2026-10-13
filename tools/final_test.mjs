// The final edition (v4.9.0): Book One only. A Book Two sergeant left on the device is kept, never listed, and pointed on to
// From the Ranks; a Book Two save code is refused with where to take it; the title links on; no Book Two code is in the page.
// Usage: node tools/final_test.mjs   (build first; exit 1 on a failure)
import { server, browser as launch, openGame } from './page.mjs';
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, {});
const bad = [], ok = m => console.log('  ok  ' + m), no = m => { bad.push(m); console.log('  FAIL ' + m); };
const r = await page.evaluate(() => {
  localStorage.setItem('ashes-of-the-pale-v1:bbb', JSON.stringify({v:1, sid:'bbb', name:'Vesh', book:'dg', chapter:2, lvl:3, squad:[], f:{}}));
  S = newState('Hask'); save(); const meta = roster(); meta.list.push({id:'bbb', book:'dg', name:'Vesh', ch:2, lvl:3, upd:Date.now() + 9}); localStorage.setItem('ashes-of-the-pale-roster', JSON.stringify(meta)); S = null;
  showTitle();
  const rows = [...document.querySelectorAll('.sgtrow .load')].map(b => b.textContent);
  const on = document.querySelector('.title .onward'), link = on && on.querySelector('a');
  return { books: Object.keys(BOOKS), rows, onward: on ? on.textContent : '', href: link ? link.href : '', kept: !!localStorage.getItem('ashes-of-the-pale-v1:bbb'),
    picker: !!document.querySelector('.bseg'), dgFns: ['newStateDG', 'startTitleChain', 'B2CH1'].filter(n => typeof window[n] !== 'undefined') };
});
r.books.join() === 'gotm' ? ok('one book') : no('books: ' + r.books.join());
r.rows.length === 1 && /Hask/.test(r.rows[0]) ? ok('only the Book One sergeant is listed') : no('rows: ' + r.rows.join(' | '));
/Your Book Two sergeant lives on there/.test(r.onward) ? ok('the Book Two sergeant is pointed on') : no('onward: ' + r.onward);
r.href === 'https://deforddm.github.io/from-the-ranks/' ? ok('the title links to From the Ranks') : no('link: ' + r.href);
r.kept ? ok('the Book Two save is kept') : no('the Book Two save was lost');
!r.picker ? ok('no book picker') : no('a book picker is shown');
!r.dgFns.length ? ok('no Book Two code in the page') : no('Book Two code present: ' + r.dgFns.join());
// a Book Two save code
const msg = await page.evaluate(async () => {
  openModal('save'); await new Promise(f => setTimeout(f, 200));
  $('#imp').value = btoa(unescape(encodeURIComponent(JSON.stringify({v:1, name:'Orrin', book:'dg', chapter:1, squad:[], f:{}})))); $('#bLoad').click();
  return { m: $('#impMsg').textContent, n: roster().list.length };
});
/From the Ranks/.test(msg.m) && msg.n === 2 ? ok('a Book Two save code is refused, with where to take it') : no('save code: ' + JSON.stringify(msg));
await br.close(); srv.kill();
if (errors.length) { console.log('page errors:', errors); process.exit(1); }
if (bad.length) { console.log(`final: FAIL (${bad.length})`); process.exit(1); }
console.log('final: 8 ok, 0 FAIL');
