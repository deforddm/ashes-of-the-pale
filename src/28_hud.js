/* ============ hud ============ */
function hudButtons(){ return `<button class="btn" id="bSquad">Squad</button>${fullBtn('bFull')}<button class="btn icon" id="bSet" aria-label="Settings">${GEAR}</button>`; }
function bindHud(){ const a = $('#bSquad'), b = $('#bSet'), f = $('#bFull'); if (a) a.onclick = () => { AUDIO.play('click'); openChars(0); }; if (b) b.onclick = () => { AUDIO.play('click'); openSettings(); }; if (f) f.onclick = () => { AUDIO.play('click'); toggleFull(); }; }
/* every full screen button shows which way it goes; and the page's size changed, so the map fits itself again (the resize event does that) */
const fullSync = () => document.querySelectorAll('[data-full]').forEach(b => { const on = isFull(); b.innerHTML = on ? FULL_OUT : FULL_IN; b.setAttribute('aria-label', on ? 'Leave full screen' : 'Full screen'); b.title = (on ? 'Leave full screen' : 'Full screen') + ' (F)'; });
document.addEventListener('fullscreenchange', fullSync); document.addEventListener('webkitfullscreenchange', fullSync);
/* Settings > Full screen on: the first click or key of the visit goes full screen (F is left to its own toggle) */
let fullTried = false;
['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, e => { if (fullTried || !SET.full || !fullOK() || isFull()) return;
  if (ev === 'keydown' && (e.key === 'Escape' || /^f$/i.test(e.key) || e.ctrlKey || e.metaKey || e.altKey)) return; if (ev === 'pointerdown' && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
  fullTried = true; toggleFull(true); }, {capture:true}));

