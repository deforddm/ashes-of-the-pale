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
function loop(t){
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
if (history.state && history.state.ov) history.replaceState(null, ''); // a reload with an overlay's entry on top: nothing is open now
