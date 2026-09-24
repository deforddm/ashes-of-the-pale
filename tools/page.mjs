// Shared helpers for the test tools: a local server, a browser, and a game page with the real
// web fonts served locally (the sandbox cannot reach Google Fonts), no service worker, and
// optional fast settings. Import from lint/play/shoot.
import { spawn, execSync } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
export const { chromium } = createRequire(import.meta.url)(execSync('npm root -g').toString().trim() + '/playwright');
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = '/home/claude/fonts/files';

export async function server() {
  const port = 8000 + Math.floor(Math.random() * 900);
  const srv = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 700));
  return { port, url: `http://127.0.0.1:${port}/index.html`, kill: () => srv.kill() };
}
/* a machine-wide two-slot lock so parallel workers don't all run Chromium at once (2 CPUs here).
   Set ASHES_NOLOCK=1 to skip. Stale locks (dead pid) are taken over. */
const LOCKS = ['/tmp/ashes-browser-lock-0', '/tmp/ashes-browser-lock-1'];
let held = null;
const alive = pid => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
async function acquire() {
  if (process.env.ASHES_NOLOCK || held) return;
  let waited = 0;
  for (;;) {
    for (const l of LOCKS) {
      try { fs.mkdirSync(l); fs.writeFileSync(l + '/pid', String(process.pid)); held = l; break; }
      catch (e) { try { const pid = +fs.readFileSync(l + '/pid', 'utf8'); if (pid && !alive(pid)) fs.rmSync(l, { recursive: true, force: true }); } catch (e2) { /* being created */ } }
    }
    if (held) break;
    if (waited === 0) console.error('(waiting for a free browser slot…)');
    await new Promise(r => setTimeout(r, 1500)); waited += 1500;
  }
  const rel = () => { try { if (held) fs.rmSync(held, { recursive: true, force: true }); } catch (e) {} held = null; };
  process.on('exit', rel); process.on('SIGINT', () => { rel(); process.exit(130); }); process.on('SIGTERM', () => { rel(); process.exit(143); });
}
export async function browser() {
  await acquire();
  return chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
}
/* opts: {width, height, dpr, fast (speed/motion/mute), settings:{...}, save: S object to preload} */
export async function openGame(br, url, opts = {}) {
  const ctx = await br.newContext({ viewport: { width: opts.width || 390, height: opts.height || 844 }, deviceScaleFactor: opts.dpr || 1, serviceWorkers: 'block', hasTouch: !!opts.touch, isMobile: !!opts.mobile });
  if (fs.existsSync(FONTS)) {
    await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: fs.readFileSync(path.join(FONTS, 'fonts.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', r => { const f = path.join(FONTS, path.basename(new URL(r.request().url()).pathname)); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); });
  }
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e && e.stack || e).split('\n').slice(0, 4).join(' | ')));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  const settings = Object.assign(opts.fast ? { master: 0, music: 0, sfx: 0, amb: 0, speed: 0.02, motion: 'off', shake: false } : {}, opts.settings || {});
  await page.addInitScript(({ settings, save }) => { try { localStorage.clear(); localStorage.setItem('ashes-of-the-pale-settings', JSON.stringify(settings)); if (save) localStorage.setItem('ashes-of-the-pale-v1', JSON.stringify(save)); } catch (e) {} }, { settings, save: opts.save || null });
  await page.goto(url);
  await page.waitForTimeout(500);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  if (!(await page.evaluate(() => typeof newState === 'function' && typeof startBattle === 'function'))) throw new Error('the game script did not load (a syntax or boot error): ' + (errors.join(' || ') || 'no page error captured'));
  return { ctx, page, errors };
}
