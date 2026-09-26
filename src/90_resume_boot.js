/* ============ resume & boot ============ */
function resume(){
  $('#sheet').hidden = true; $('#modal').hidden = true; notes = []; titleAnim = null;
  migrate(S);
  if (S.scene === 'end' || S.scene === 'chend') return showChapterEnd();
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
  if (k === dockAt) return; dockAt = k;
  if (!k) { sh.style.left = sh.style.width = sh.style.top = sh.style.right = ''; return; }
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
  requestAnimationFrame(loop);
}
function start(data){
  applySet();
  if (typeof CH1 !== 'undefined') registerChapter(1, CH1);
  if (typeof CH2 !== 'undefined') registerChapter(2, CH2);
  if (typeof CH3 !== 'undefined') registerChapter(3, CH3);
  if (typeof CH4 !== 'undefined') registerChapter(4, CH4);
  if (typeof CH5 !== 'undefined') registerChapter(5, CH5);
  if (typeof CH6 !== 'undefined') registerChapter(6, CH6);
  if (typeof CH7 !== 'undefined') registerChapter(7, CH7);
  if (data && data.S) { S = migrate(data.S); resume(); } else showTitle();
  requestAnimationFrame(loop);
}
window.claude?.hot?.snapshot?.(() => (S ? {S: JSON.parse(JSON.stringify(S))} : {}));
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
/* Android Back (and Escape): an open overlay (the squad sheets, pack/journal/save, settings) holds one history entry,
   and Back closes it instead of leaving the app. The level-up picks can't be backed out of. */
const OVERLAYS = ['#chars', '#settings', '#modal'];
const ovOpen = () => OVERLAYS.some(s => !$(s).hidden), picksOpen = () => !$('#modal').hidden && !!$('#modal .picks');
let ovT = 0, ovBack = 0; // one check per burst of changes, and one Back at a time (a second would leave the page)
function ovSync(){ clearTimeout(ovT); ovT = setTimeout(() => { if (Date.now() - ovBack < 1500) return; const open = ovOpen(), mine = !!(history.state && history.state.ov);
  if (open && !mine) history.pushState({ov:1}, ''); else if (!open && mine) { ovBack = Date.now(); history.back(); } }, 0); }
OVERLAYS.forEach(s => new MutationObserver(ms => { if (ms.some(m => (m.oldValue !== null) !== m.target.hidden)) ovSync(); }).observe($(s), {attributes:true, attributeOldValue:true, attributeFilter:['hidden']}));
window.addEventListener('popstate', () => {
  const ours = ovBack; ovBack = 0; if (ours) { if (ovOpen()) ovSync(); return; } // our own Back, after a close: something may have opened since
  if (!ovOpen()) return;
  if (picksOpen()) { history.pushState({ov:1}, ''); return; }
  if (!$('#chars').hidden) closeChars();
  if (!$('#settings').hidden) { $('#settings').hidden = true; $('#settings').innerHTML = ''; }
  $('#modal').hidden = true;
});
window.addEventListener('keydown', e => { if (e.key === 'Escape' && ovOpen() && !picksOpen() && history.state && history.state.ov) history.back(); });
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
if (history.state && history.state.ov) history.replaceState(null, ''); // a reload with an overlay's entry on top: nothing is open now
