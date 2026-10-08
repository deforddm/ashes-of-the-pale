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
/* The web fonts, served locally (the sandbox can't reach Google Fonts). A folder holding fonts.css
   (Google-style @font-face rules whose urls end in a file name) plus the .woff2 files it names:
   1. $ASHES_FONTS if set;  2. tools/.fonts/ (gitignored), built on first run from the npm @fontsource
   packages (installed into a cache outside the repo, ~/.cache/ashes-fonts);  3. none: one warning, and
   the browser falls back to its own fonts (fit measurements may shift). */
const FONT_SET = { // the families and weights src/00_head.html asks Google for
  'im-fell-english': ['400', '400-italic'], 'im-fell-english-sc': ['400'],
  'alegreya-sans': ['400', '500', '700', '400-italic'], 'alegreya-sans-sc': ['500', '700'] };
function findFonts() {
  if (process.env.ASHES_FONTS) return fs.existsSync(path.join(process.env.ASHES_FONTS, 'fonts.css')) ? process.env.ASHES_FONTS : null;
  const dir = path.join(root, 'tools', '.fonts');
  if (fs.existsSync(path.join(dir, 'fonts.css'))) return dir;
  try {
    const cache = path.join(process.env.HOME || '/tmp', '.cache', 'ashes-fonts');
    fs.mkdirSync(cache, { recursive: true });
    const pkgs = Object.keys(FONT_SET).map(f => '@fontsource/' + f + '@5');
    if (!Object.keys(FONT_SET).every(f => fs.existsSync(path.join(cache, 'node_modules/@fontsource', f))))
      execSync('npm install --no-save --no-audit --no-fund --silent --prefix ' + JSON.stringify(cache) + ' ' + pkgs.join(' '), { stdio: 'ignore', timeout: 120000 });
    const tmp = dir + '.tmp'; fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    let css = '';
    for (const [fam, ws] of Object.entries(FONT_SET)) {
      const pd = path.join(cache, 'node_modules/@fontsource', fam);
      for (const w of ws) css += fs.readFileSync(path.join(pd, w + '.css'), 'utf8')
        .replace(/url\(\.\/files\/([^)]+\.woff2)\) format\('woff2'\)(, url\([^)]+\.woff\) format\('woff'\))?/g, (m, f) => {
          fs.copyFileSync(path.join(pd, 'files', f), path.join(tmp, f)); return `url(https://fonts.gstatic.com/s/ashes/${f}) format('woff2')`; }) + '\n';
    }
    fs.writeFileSync(path.join(tmp, 'fonts.css'), css);
    fs.rmSync(dir, { recursive: true, force: true }); fs.renameSync(tmp, dir);
    return dir;
  } catch (e) { return null; }
}
const FONTS = findFonts();
if (!FONTS) console.warn('WARNING: web fonts not found (set ASHES_FONTS, or let tools/.fonts be built from npm @fontsource); using fallback fonts, so fit measurements may differ.');

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
  if (FONTS) {
    await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: fs.readFileSync(path.join(FONTS, 'fonts.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', r => { const f = path.join(FONTS, path.basename(new URL(r.request().url()).pathname)); return fs.existsSync(f) ? r.fulfill({ contentType: f.endsWith('.woff') ? 'font/woff' : 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); });
  }
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e && e.stack || e).split('\n').slice(0, 4).join(' | ')));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  const settings = Object.assign(opts.fast ? { master: 0, music: 0, sfx: 0, amb: 0, speed: +(process.env.ASHES_SPEED || 0.02), motion: 'off', shake: false } : {}, opts.settings || {});
  await page.addInitScript(({ settings, save }) => { try { localStorage.clear(); localStorage.setItem('ashes-of-the-pale-settings', JSON.stringify(settings)); if (save) localStorage.setItem('ashes-of-the-pale-v1', JSON.stringify(save)); } catch (e) {} }, { settings, save: opts.save || null });
  await page.goto(url);
  await page.waitForTimeout(500);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  if (!(await page.evaluate(() => typeof newState === 'function' && typeof startBattle === 'function'))) throw new Error('the game script did not load (a syntax or boot error): ' + (errors.join(' || ') || 'no page error captured'));
  return { ctx, page, errors };
}
