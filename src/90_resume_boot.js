/* ============ resume & boot ============ */
function resume(){
  $('#sheet').hidden = true; $('#modal').hidden = true; notes = []; titleAnim = null;
  migrate(S);
  if (S.scene === 'end' || S.scene === 'chend') return showChapterEnd();
  if (S.scene === 'chintro') return showChapterIntro();
  if (S.scene === 'intro') { showIntro(); if (S.node) talk(S.node); return; }
  if (S.scene === 'battle') return startBattle(S.battle, S.bopt || {});
  if (S.bg && S.bg !== 'explore' && SCENES[S.bg]) { sceneShell(S.bg); if (S.node) talk(S.node); return; }
  startExplore(); if (S.node) talk(S.node);
}
function loop(t){
  if (view === 'explore') drawExplore(t); else if (view === 'battle') drawBattle(t);
  else if (view === 'title' && titleAnim) titleAnim();
  const scv = $('#scv'); if (scv && (view === 'scene' || view === 'intro' || view === 'end')) { if (G.sceneKind === 'camp' || G.sceneKind === 'camp_night') drawCamp(scv, t, G.sceneKind === 'camp_night'); else if (G.sceneKind === 'tent' || G.sceneKind === 'fire') drawInterior(scv, G.sceneKind, t); else if (G.sceneKind && (G.sceneKind.startsWith('plain') || G.sceneKind.startsWith('hills'))) drawPlain(scv, G.sceneKind, t); else if (G.sceneKind && (G.sceneKind.startsWith('city') || ['inn','cellar','room','roof','roof_night'].includes(G.sceneKind))) drawCity(scv, G.sceneKind, t); else drawScene(scv, G.sceneKind, t); }
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
  if (data && data.S) { S = migrate(data.S); resume(); } else showTitle();
  requestAnimationFrame(loop);
}
window.claude?.hot?.snapshot?.(() => (S ? {S: JSON.parse(JSON.stringify(S))} : {}));
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
