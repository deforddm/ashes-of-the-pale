// Every check in one go: build, syntax, lint, then every tools/*_test.mjs in turn (and play.mjs N times with --play=N).
// One line per step, then PASS or FAIL overall; exits 1 on any failure. Full output of a failed step is printed after it.
// Usage (no npm needed):  node tools/run_all.mjs [--play=N] [--verbose]
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = k => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];
const plays = Math.max(0, parseInt(arg('play') || '0', 10) || 0), verbose = process.argv.includes('--verbose');
fs.mkdirSync('/tmp/claude-0/shots', { recursive: true });
const steps = [['build', 'python3', ['build.py']]];
const js = [...fs.readdirSync(path.join(root, 'src')).filter(f => f.endsWith('.js')).sort().map(f => 'src/' + f), 'sw.js'].filter(f => fs.existsSync(path.join(root, f)));
steps.push(['node --check (' + js.length + ' files)', null, js]);
steps.push(['lint', 'node', ['tools/lint.mjs']]);
for (const t of fs.readdirSync(path.join(root, 'tools')).filter(f => f.endsWith('_test.mjs')).sort()) steps.push([t.replace('.mjs', ''), 'node', ['tools/' + t]]);
for (let i = 1; i <= plays; i++) steps.push([`play ${i}/${plays}`, 'node', ['tools/play.mjs']]);
let bad = 0; const t00 = Date.now();
const run = (cmd, args) => spawnSync(cmd, args, { cwd: root, encoding: 'utf8', timeout: 15 * 60 * 1000, maxBuffer: 64 << 20 });
for (const [name, cmd, args] of steps) {
  const t0 = Date.now(); let ok, out, note = '';
  if (!cmd) { const errs = args.map(f => [f, run('node', ['--check', f])]).filter(([, r]) => r.status !== 0); ok = !errs.length; out = errs.map(([f, r]) => f + ':\n' + r.stderr).join('\n'); }
  else { const r = run(cmd, args); out = (r.stdout || '') + (r.stderr || ''); ok = r.status === 0; if (r.error) out += '\n' + r.error.message;
    const fails = out.split('\n').filter(l => /^FAIL\b/.test(l)).length, oks = out.split('\n').filter(l => /^ok\b/.test(l)).length;
    note = name === 'lint' ? (out.split('\n').find(l => /SUMMARY/.test(l)) || '').trim() : name === 'build' ? (out.trim().split('\n').pop() || '') : oks || fails ? `${oks} ok, ${fails} FAIL` : ''; }
  if (!ok) bad++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(26)} ${((Date.now() - t0) / 1000).toFixed(1).padStart(6)}s  ${note}`);
  if (!ok || verbose) console.log(out.trim().split('\n').filter(l => verbose || !/^ok\b/.test(l)).slice(-40).map(l => '      | ' + l).join('\n'));
}
console.log(`${bad ? 'FAIL' : 'PASS'}  overall: ${steps.length - bad}/${steps.length} steps passed in ${((Date.now() - t00) / 1000).toFixed(0)}s`);
process.exit(bad ? 1 : 0);
