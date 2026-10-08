/* ============ resume & boot ============ */
function resume(){
  $('#sheet').hidden = true; $('#modal').hidden = true; notes = []; titleAnim = null;
  migrate(S);
  if (S.scene === 'chend') return showChapterEnd();
  if (S.scene === 'finale') return showFinale(S.finPage || 0);
  if (S.scene === 'chintro') return showChapterIntro();
  if (S.scene === 'intro') { showIntro(); if (S.node) talk(S.node); return; }
  if (S.scene === 'battle') return startBattle(S.battle, S.bopt || {});
  if (S.bg && S.bg !== 'explore' && SCENES[S.bg] && S.node) { sceneShell(S.bg); talk(S.node); return; } // a backdrop with no conversation on it goes back to the map
  startExplore(); if (S.node) talk(S.node);
}
/* backdrops keep their 240px-high drawing but take the width their box really has, so a phone doesn't squash them sideways */
/* a wide screen: the dialogue sits in the right-hand column, from just under the header to the foot of the window */
let dockAt = '';
function dockSheet(){
  const sh = $('#sheet'); if (!sh || sh.hidden) return;
  let k = '';
  if (WIDE() && ($('#app > .cvwrap') || $('#app > .scene'))) { const hud = $('#app > .hud'); if (hud) { const r = hud.getBoundingClientRect(); k = `${Math.round(r.left)}|${Math.round(r.width)}|${Math.max(16, Math.round(r.bottom + 14))}`; } }
  /* a phone held upright: the talk sheet starts under the picture instead of over it, so the whole painting stays in view.
     If that would leave the sheet less than 40% of the screen, it falls back to rising over the picture as before. */
  if (!k && !WIDE()) { const sc = $('#app > .scene'); if (sc) { const b = Math.round(sc.getBoundingClientRect().bottom + 6), vh = window.innerHeight; if (b > 0 && vh - b >= vh * .4) k = 'under|' + b; } }
  if (k === dockAt) return; dockAt = k;
  if (!k) { sh.style.left = sh.style.width = sh.style.top = sh.style.right = sh.style.maxHeight = ''; return; }
  if (k.startsWith('under|')) { sh.style.left = sh.style.width = sh.style.right = ''; sh.style.top = k.slice(6) + 'px'; sh.style.maxHeight = 'none'; return; }
  const [l, w, top] = k.split('|'); sh.style.left = l + 'px'; sh.style.width = w + 'px'; sh.style.top = top + 'px'; sh.style.right = 'auto';
}
function loop(t){
  dockSheet();
  if (view === 'explore') drawExplore(t); else if (view === 'battle') drawBattle(t);
  else if (view === 'title' && titleAnim) titleAnim();
  const scv = $('#scv'); if (scv && (view === 'scene' || view === 'intro' || view === 'end' || view === 'finale')) { if (FETE_SCENES.includes(G.sceneKind)) drawEstate(scv, G.sceneKind, t); else if (G.sceneKind === 'camp' || G.sceneKind === 'camp_night') drawCamp(scv, t, G.sceneKind === 'camp_night'); else if (G.sceneKind === 'tent' || G.sceneKind === 'fire') drawInterior(scv, G.sceneKind, t); else if (G.sceneKind && (G.sceneKind.startsWith('plain') || G.sceneKind.startsWith('hills'))) drawPlain(scv, G.sceneKind, t); else if (G.sceneKind && (G.sceneKind.startsWith('city') || ['inn','cellar','room','roof','roof_night'].includes(G.sceneKind))) drawCity(scv, G.sceneKind, t); else drawScene(scv, G.sceneKind, t); }
  if (view === 'finale' && finAnim) finAnim(t);
  if (charAnim) charAnim(t);
  if (cardAnim) cardAnim();
  if (MG.anim) MG.anim(t);
  if (routeAnim) routeAnim(t);
  padPoll();
  requestAnimationFrame(loop);
}
function start(){
  applySet();
  if (typeof CH1 !== 'undefined') registerChapter(1, CH1);
  if (typeof CH2 !== 'undefined') registerChapter(2, CH2);
  if (typeof CH3 !== 'undefined') registerChapter(3, CH3);
  if (typeof CH4 !== 'undefined') registerChapter(4, CH4);
  if (typeof CH5 !== 'undefined') registerChapter(5, CH5);
  if (typeof CH6 !== 'undefined') registerChapter(6, CH6);
  if (typeof CH7 !== 'undefined') registerChapter(7, CH7);
  showTitle();
  requestAnimationFrame(loop);
}
start();
/* Android Back (and Escape). The game keeps one spare history entry (a "guard") above the page it loaded on, so the phone's
   Back never lands outside the game by accident. Each Back comes back to the game as a popstate: it closes whatever is open
   on top (the picture viewer, the squad sheets, settings, pack/journal/save, a table game), and the guard goes straight
   back up. With nothing open, Back asks first: "Press Back again to leave", and only a second Back within a few seconds
   leaves. The level-up picks can't be backed out of. The guard is pushed from a tap or a key, since Chrome skips history
   entries a page adds without the player touching it. */
const OVERLAYS = ['#chars', '#settings', '#modal', '#mg'];
const ovOpen = () => OVERLAYS.some(s => !$(s).hidden), picksOpen = () => !$('#modal').hidden && !!$('#modal .picks');
let leaveArmed = 0, leaveT = 0, selfBack = false;
const gLevel = () => (history.state && history.state.g) || 0;
/* two guards deep, so two Backs in a row (a map or an item in the picture viewer, then the journal or sheet under it) both stay in the game */
function guardUp(){ try { if (gLevel() < 1) history.pushState({g:1}, ''); if (gLevel() < 2) history.pushState({g:2}, ''); } catch(e) {} }
['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, () => { if (leaveArmed) { leaveArmed = 0; clearTimeout(leaveT); leaveToast(false); } guardUp(); }, {capture:true, passive:true})); // touching the game again: stay
/* close the top thing that is open; false when nothing was */
function backTop(){
  if (typeof artViewOpen === 'function' && artViewOpen()) { $('#avClose').click(); return true; }
  if (picksOpen()) return true; // the level-up choice has to be made
  if (!$('#chars').hidden) { AUDIO.play('click'); closeChars(); return true; }
  if (!$('#settings').hidden) { AUDIO.play('click'); $('#settings').hidden = true; $('#settings').innerHTML = ''; return true; }
  if (!$('#modal').hidden) { AUDIO.play('click'); $('#modal').hidden = true; return true; }
  if (mgOpenNow()) { if (MG.leave) MG.leave(); return true; } // a table game: Back is its Leave (which may ask first)
  return false;
}
function leaveToast(on){ let t = $('#leavet');
  if (!on) { if (t) t.remove(); return; }
  if (!t) { t = document.createElement('div'); t.id = 'leavet'; t.className = 'leavet'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = 'Press Back again to leave the game'; }
window.addEventListener('popstate', () => {
  if (selfBack) { selfBack = false; return; }
  if (leaveArmed) return; // the second Back: let the phone take the player out
  if (backTop()) return; // the guards are topped up at the next touch
  // nothing open: drop to the page the game loaded on (so one more Back leaves) and say so; a touch, or a few seconds, puts the guards back
  if (gLevel()) { selfBack = true; history.go(-gLevel()); }
  leaveArmed = 1; leaveToast(true); clearTimeout(leaveT);
  leaveT = setTimeout(() => { leaveArmed = 0; leaveToast(false); guardUp(); }, 3000);
});
window.addEventListener('keydown', e => { if (e.key === 'Escape' && ovOpen() && !picksOpen()) { e.preventDefault(); backTop(); } });
/* the keyboard, for a PC. Talking: 1-9 pick a choice, Space or Enter takes the only one (or hurries the die). The map: the arrow keys or WASD
   walk a tile, Space or E talks to whoever is beside you. A fight: 1-9 the abilities, Space or E ends the turn, Esc drops an aimed ability.
   Anywhere in the game: J journal, P pack, C squad, Esc settings; Space or Enter presses a page's main button (the next chapter, and so on). */
const typing = e => { const t = e.target; return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); };
window.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented || typing(e) || picksOpen()) return;
  const k = e.key, low = k.length === 1 ? k.toLowerCase() : k, dig = /^[1-9]$/.test(k) ? +k : 0, go = k === 'Enter' || k === ' ';
  const onBtn = !!document.activeElement && document.activeElement.tagName === 'BUTTON' && document.activeElement !== document.body;
  const press = el => { if (!el || el.disabled) return false; e.preventDefault(); if (k === ' ' && document.activeElement && document.activeElement.blur) document.activeElement.blur(); el.click(); return true; };
  if (!$('#cardfx').hidden) { if (go && !onBtn) { const b = $('#cardfx').querySelector('button:not([disabled])'); if (b) press(b); else { e.preventDefault(); $('#cardfx').click(); } } return; }
  if (low === 'f' && fullOK()) { e.preventDefault(); toggleFull(); return; } // full screen, anywhere
  if (ovOpen()) return; // an overlay is open: Esc closes it (above), and everything else is its own
  const sh = $('#sheet');
  if (!sh.hidden) { // a conversation
    if (dig) { press(sh.querySelectorAll('.choice')[dig - 1]); return; }
    if (go && !onBtn) { const d = $('#dice'); if (d) { e.preventDefault(); d.click(); return; } const cs = [...sh.querySelectorAll('.choice:not([disabled])')]; if (cs.length === 1) press(cs[0]); }
    return;
  }
  if (view === 'title') { if (k === 'Enter' && !onBtn) press($('#bCont')); return; }
  if (!S) return;
  if (k === ' ' && (view === 'explore' || view === 'battle')) { e.preventDefault(); if (onBtn) document.activeElement.blur(); } // Space is the game's here, not a focused button's
  if (view === 'battle' && B) {
    const mine = B.cur && B.cur.side === 'p' && !B.cur.ally && !B.over;
    if (k === 'Escape' && mine && B.mode && B.mode !== 'act') { e.preventDefault(); B.mode = 'act'; B.aim = null; updBattleUI(); return; }
    if (mine && dig) { press($('#ubar').querySelectorAll('.abil [data-k]')[dig - 1]); return; }
    const ad = {ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0]}[k];
    if (mine && ad) { e.preventDefault(); const c = G.hover || {x:B.cur.x, y:B.cur.y}; G.hover = {x:clamp(c.x + ad[0], 0, 7), y:clamp(c.y + ad[1], 0, 9)}; return; } // a target square, for the keyboard and a controller
    if (mine && k === 'Enter' && !onBtn && G.hover) { e.preventDefault(); battleTap(G.hover.x, G.hover.y); return; }
    if (mine && (k === ' ' || low === 'e')) { press($('#bEnd')); return; }
  }
  if (view === 'explore' && !walking) {
    const dir = {ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0], w:[0,-1], s:[0,1], a:[-1,0], d:[1,0]}[low];
    if (dir) { e.preventDefault(); exploreTap(S.pos.x + dir[0], S.pos.y + dir[1]); return; }
    if ((k === ' ' || low === 'e' || (k === 'Enter' && !onBtn))) { const n = AREA().npcs.find(n => (!n.show || n.show()) && cheb(S.pos, n) <= 1); if (n) { e.preventDefault(); exploreTap(n.x, n.y); } return; }
  }
  if (view === 'explore' && walking && /^Arrow/.test(k)) { e.preventDefault(); return; } // a held arrow key keeps the page still between steps
  if (low === 'j' || low === 'p') { e.preventDefault(); AUDIO.play('click'); openModal(low === 'j' ? 'journal' : 'pack'); return; }
  if (low === 'c') { e.preventDefault(); AUDIO.play('click'); openChars(0); return; }
  if (k === 'Escape') { e.preventDefault(); AUDIO.play('click'); openSettings(); return; }
  if (go && !onBtn && view !== 'explore' && view !== 'battle') press($('#app .btn.primary:not([disabled])'));
});
/* the overlays are dialogs: when one opens, focus moves into it (Tab stays inside the top one); when it closes, focus goes back to
   what opened it, if that was reached by keyboard. The board viewer (#artview) is made on demand, so it is wired up when it appears. */
const DLGS = ['#artview', '#mg', '#settings', '#chars', '#modal'], dlgFrom = {};
const dlgTop = () => DLGS.map(s => $(s)).find(el => el && !el.hidden) || null;
function dlgWire(el){ if (!el || el.dataset.dlg) return; el.dataset.dlg = 1;
  if (!el.getAttribute('role')) { el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); if (el.id === 'artview') el.setAttribute('aria-label', 'Picture'); }
  if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
  const seen = () => { const a = document.activeElement;
    if (!el.hidden) { dlgFrom[el.id] = a && a !== document.body && !el.contains(a) && a.matches(':focus-visible') ? a : null; if (!el.contains(a)) el.focus({preventScroll:true}); }
    else { const f = dlgFrom[el.id]; dlgFrom[el.id] = null; if (f && f.isConnected && !f.closest('[hidden]') && !dlgTop()) f.focus({preventScroll:true}); } };
  new MutationObserver(seen).observe(el, {attributes:true, attributeFilter:['hidden']}); }
DLGS.forEach(s => dlgWire($(s)));
new MutationObserver(() => dlgWire($('#artview'))).observe(document.body, {childList:true});
window.addEventListener('keydown', e => { if (e.key !== 'Tab') return; const d = dlgTop(); if (!d) return;
  const fs = [...d.querySelectorAll('button:not([disabled]), [href], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent);
  if (!fs.length) { e.preventDefault(); d.focus({preventScroll:true}); return; }
  const i = fs.indexOf(document.activeElement);
  if (e.shiftKey && i <= 0) { e.preventDefault(); fs[fs.length - 1].focus(); } else if (!e.shiftKey && (i < 0 || i === fs.length - 1)) { e.preventDefault(); fs[0].focus(); } });
if (history.state && history.state.ov) history.replaceState({g:1}, ''); // a save from before 3.15.1 reloaded on an overlay's entry: it serves as the guard now
