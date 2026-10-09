// v3.18: Doctor Ottavio Brack's stall in the Worry Gate queue: the wares, the haggle, Kettle and the "Moranth" tray, and Hood's Repellent in a fight.
// Usage: node tools/brack_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
import fs from 'fs';
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true, mobile: true, touch: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = f => page.evaluate(f);
const q = s => s.replace(/[“”"‘’']/g, '').trim();
const choices = () => ev(() => [...document.querySelectorAll('#sheet .choice')].map(b => b.textContent.replace(/[“”"‘’']/g, '').trim()));
const click = async t => { const n = await page.evaluate(t => { const q = s => s.replace(/[“”"‘’']/g, '').trim(); const b = [...document.querySelectorAll('#sheet .choice')].find(x => q(x.textContent).includes(q(t))); if (!b) return false; b.click(); return true; }, t); await page.waitForTimeout(300); return n; };

await ev(() => { S = newState('Hask'); S.chapter = 3; S.lvl = 3; S.squad = ['sgt','brisk','kettle','tuft','ohl']; S.silver = 40; S.picksDue = []; migrate(S); save(); startExplore('worry_gate'); });
await page.waitForTimeout(500);
ok(await ev(() => AREAS.worry_gate.npcs.some(n => n.id === 'brack')), 'the stall stands in the Worry Gate queue');
await page.screenshot({ path: '/tmp/claude-0/shots/brack_map.png' });
await ev(() => talk('c3_brack')); await page.waitForTimeout(300);
const intro = await ev(() => $('#sheet').innerText);
ok(/OTTAVIO BRACK/.test(intro) && /no column for miracles/.test(intro), 'Doctor Brack introduces himself and why he is stuck');
await click('Show us your wonders'); let ch = await choices();
ok(ch.some(t => t.includes('Tincture')) && ch.some(t => t.includes('Hood')) && ch.some(t => t.includes('Oponn')), `the wares are on the counter (${ch.length} choices)`);
const salves = await ev(() => S.inv.salve); await click('Tincture'); ok(await ev(() => S.inv.salve) === salves + 1, 'the tincture is a salve');
await click('Back to the counter'); // tincture returns straight to the wares
await ev(() => { S.picksDue = []; talk('c3_brack_wares'); });
// Kettle and the Moranth tray: force the roll
await ev(() => { window._d20 = d20; });
ch = await choices(); ok(ch.some(t => t.includes('Moranth')), 'Kettle can look at the "Moranth" powders');
await ev(() => { S.f.c3_brackKettle = 1; S.f.c3_brackDisc = 1; talk('c3_brack_wares'); });
ch = await choices(); ok(ch.some(t => /Hoods Repellent, 9 silver/.test(t)), `the discount is three at most (${ch.find(t => t.startsWith('Hood'))})`);
const before = await ev(() => S.silver); await click('Hoods Repellent'); 
ok(await ev(() => S.kit.includes('hoodrep')) && (before - await ev(() => S.silver)) === 9, 'bought Hood\'s Repellent for 9');
await click('Back to the counter'); await click('Oponn'); await click('Back to the counter'); await click('Shard'); await click('Back to the counter'); await click('Map');
ok(await ev(() => ['brackcoin','spawnshard','tyrantmap'].every(k => S.kit.includes(k))), 'the coin, the shard and the map are in the kit');
ok(await ev(() => !!ART['item/hoodrep'] && !!ART['item/tyrantmap']), 'the wares have pictures');
// the repellent in a fight
const fight = await ev(async () => { const wait = ms => new Promise(r => setTimeout(r, ms)); $('#sheet').hidden = true;
  S.gear.brisk.trinket = 'hoodrep'; startBattle('cutpurses', {}); await wait(600);
  const b = B.units.find(u => u.id === 'brisk'); b.hp = 3; hurt(b, 50); const first = b.hp; b.hp = 3; hurt(b, 50); const second = b.hp; return {first, second, used:S.f.hoodRepCh}; });
ok(fight.first === 1 && fight.second === 0, `the repellent holds once a chapter (first ${fight.first}, then ${fight.second})`);
await ev(() => { B = null; view = 'explore'; });
// Ch7: still in the queue
const c7 = await ev(() => { S.chapter = 7; S.f.c7_key = 'outlaw'; const n = DLG.c7_to_gate ? DLG.c7_to_gate() : null; return Object.keys(DLG).filter(k => /c7/.test(k) && String(DLG[k]).includes('Brack')).length; });
ok(c7 >= 1, 'Brack is still waiting at the Worry Gate in Chapter 7');
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await br.close(); srv.kill();
process.exit(fail || errors.length ? 1 : 0);
