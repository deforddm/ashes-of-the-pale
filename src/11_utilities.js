/* ============ utilities ============ */
const $ = s => document.querySelector(s);
const R = n => Math.floor(Math.random() * n);
const rnd = (a, b) => a + Math.random() * (b - a);
const roll = (n, s, p = 0) => { let t = p; for (let i = 0; i < n; i++) t += 1 + R(s); return t; };
const d20 = () => 1 + R(20);
const wait = ms => new Promise(r => setTimeout(r, ms * (typeof SET !== 'undefined' ? SET.speed : 1)));
const cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const DIRS = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const K = (x, y) => x + ',' + y;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* numbers as a soldier says them: 'two', or 'Two' to start a sentence; past twelve, digits */
const numw = (n, cap) => { const w = ['no','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'][n] ?? String(n); return cap ? w[0].toUpperCase() + w.slice(1) : w; };
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
function hash(x, y, s = 0) { let h = (x * 374761393 + y * 668265263 + s * 982451653) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const GEAR = `<svg viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/><path d="M19.4 13.5a7.9 7.9 0 0 0 0-3l2-1.5-2-3.4-2.4.9a8 8 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5a8 8 0 0 0-2.6 1.5l-2.4-.9-2 3.4 2 1.5a7.9 7.9 0 0 0 0 3l-2 1.5 2 3.4 2.4-.9a8 8 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a8 8 0 0 0 2.6-1.5l2.4.9 2-3.4-2-1.5z"/></svg>`;
/* a wide screen (a PC, or a tablet on its side) lays the map or backdrop out on the left and everything to read and press on the
   right; the same query sits in the CSS. A fine pointer (a mouse) gets "click" for "tap", key hints and hover outlines. */
const WIDEQ = '(min-width:1000px) and (min-height:560px)', WIDE_MQ = window.matchMedia(WIDEQ), WIDE = () => WIDE_MQ.matches;
const FINE_MQ = window.matchMedia('(hover:hover) and (pointer:fine)'), FINE = () => FINE_MQ.matches;
const tapWord = s => FINE() ? String(s).replace(/\bTap\b/g, 'Click').replace(/\btap\b/g, 'click').replace(/\bTapping\b/g, 'Clicking').replace(/\btapping\b/g, 'clicking') : s;
/* a new page starts at its top: the window now, and again once the new page has laid out */
function toTop(){ const go = () => { try { window.scrollTo(0, 0); } catch(e) {} if (document.scrollingElement) document.scrollingElement.scrollTop = 0; }; go(); requestAnimationFrame(go); }
