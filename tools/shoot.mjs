// Screenshot any game state. Runs JS in the page (after boot) to set the state up, waits, and saves PNGs.
// Usage:
//   node tools/shoot.mjs --out=/tmp/x.png [--size=390x844] [--dpr=2] [--wait=800] [--js="<code>"] [--file=setup.js]
// Handy setups (the page exposes the game's globals):
//   --js="S=newState('Hask'); save(); startChapter(3)"                       chapter 3 intro card
//   --js="S=newState('Hask'); S.chapter=3; save(); startExplore('daru_street')" an explore area
//   --js="S=newState('Hask'); S.squad.push('ellis'); migrate(S); save(); startBattle('tyrant_garden',{})"  a battle
//   --js="S=newState('Hask'); S.chapter=6; save(); sceneShell('fete_hall'); talk('c6_rake')"  a dialogue node on its backdrop
//   --js="S=newState('Hask'); save(); openChars(0)"                           the character sheets
// Several shots in one go: --js may end by returning an array of [name, code] pairs; each is run in turn and shot as <out>-<name>.png.
// Exit code 1 if the page threw.
import { server, browser, openGame } from './page.mjs';
import fs from 'fs';
const arg = k => { const a = process.argv.find(a => a.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const out = arg('out') || '/tmp/shot.png';
const [w, h] = (arg('size') || '390x844').split('x').map(Number);
const dpr = +(arg('dpr') || 1), waitMs = +(arg('wait') || 900);
let js = arg('js') || ''; if (arg('file')) js = fs.readFileSync(arg('file'), 'utf8');
const srv = await server(); const br = await browser();
const { page, errors } = await openGame(br, srv.url, { width: w, height: h, dpr, settings: { master: 0, music: 0, sfx: 0, amb: 0 }, touch: process.argv.includes('--touch'), mobile: process.argv.includes('--touch') });
let multi = null;
if (js) { try { multi = await page.evaluate(new Function(js.includes('return') ? js : js + ';return null;')); } catch (e) { errors.push('setup threw: ' + e.message); } }
await page.waitForTimeout(waitMs);
if (Array.isArray(multi)) {
  for (const [name, code] of multi) {
    try { await page.evaluate(new Function(code)); } catch (e) { errors.push(`${name} threw: ${e.message}`); }
    await page.waitForTimeout(waitMs);
    const p = out.replace(/\.png$/, '') + '-' + name + '.png'; await page.screenshot({ path: p, fullPage: process.argv.includes('--full') }); console.log('saved ' + p);
  }
} else { await page.screenshot({ path: out, fullPage: process.argv.includes('--full') }); console.log('saved ' + out); }
errors.forEach(e => console.log('PAGE ERROR ' + e));
await br.close(); srv.kill();
process.exit(errors.length ? 1 : 0);
