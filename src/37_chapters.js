/* ============ chapters: cards, intros, endings, ability picks ============ */
const CHEND = {
  0:{ // the prologue's four endings (text kept from the slice)
    given:['Delivered','Varrow\'s journal is in the cadre\'s hands, unread by you. Tattersail owes your squad, and she is the kind who pays.'],
    told:['Delivered, and known','Tattersail has the journal. You and Tuft both know what the underlined line says. That kind of knowledge has a weight, and a price.'],
    burned:['Ashes','Varrow\'s account went up in a candle flame. Your squad is safer. The truth about the night the Second died is not.'],
    claw:['Taken','The journal went to the Claw. Tayschrenn will know by morning who carried it up out of the dark.'] },
  1:{
    line:['The line held','When the tents burned the Fourth went where Tattersail pointed, and stood there until the Hounds decided the cadre row was not worth the price. The cadre will remember which squad that was. So will a man with clean boots.'],
    claw:['The crate held','When the tents burned the Fourth sealed the cadre tent on a grey cloak\'s word and let the mage shout. The Hounds broke on Claw knives instead of marine shields. Tuft has not spoken since. The Empire, in the person of a man with clean boots, is pleased.'] },
};
const CHTEASE = {
  0:'Next: Captain Paran arrives at the Pale, the Hounds of Shadow come hunting, and the Fourth is told where it is going.',
  1:'Next: the Black Moranth will not carry a sixth squad. The Fourth rides south across the Rhivi Plain, and something is riding the same way.',
};
function chapterEnd(n, key){
  S.chapters[n] = key; S.chapter = n; S.scene = 'chend'; S.node = null; S.bg = null; save(); showChapterEnd();
}
function finish(kind){ S.ending = kind; chapterEnd(0, kind); } // prologue endings
function showChapterEnd(){
  view = 'end'; $('#sheet').hidden = true; B = null; AUDIO.setScene('end');
  const n = S.chapter, key = S.chapters[n]; const E = (CHEND[n] || {})[key] || ['The end',''];
  const extra = [];
  if (n === 0) {
    if (S.f.decoy) extra.push('A Claw is walking around with Kettle\'s munitions ledger. He\'ll notice eventually.');
    if (S.f.marked) extra.push('A Claw has your name in a neat hand.');
    if (S.f.noisy) extra.push('Your sharper woke the Stonebound early. It remembered.');
    if (S.f.knowDeserters && !S.f.noisy) extra.push('Garrow\'s word reached Moreau\'s section.');
  }
  if (n === 1) {
    if (S.f.wjRegard > 0) extra.push('Whiskeyjack has decided the Fourth is worth the trouble.'); if (S.f.wjRegard < 0) extra.push('Whiskeyjack has decided the Fourth is trouble.');
    if (S.f.c1_accFought) extra.push('Three of the Claw\'s people did not walk away from the picket line.');
    if (S.f.c1_accBluffed) extra.push('Kettle has a cusser named after a Claw now.');
    if (S.f.cadreTrust) extra.push('Tattersail knows what the Fourth is for.'); if (S.f.clawFavour) extra.push('The Claw remembers a favour. That is not the same as owing one.');
    if (S.f.c1_refusedKnife) extra.push('You turned down a Claw\'s knife. Brisk noticed.');
  }
  const next = CHAPTERS[n + 1];
  const title = n === 0 ? 'End of the prologue' : `End of Chapter ${CHAPTERS[n].number}`;
  $('#app').innerHTML = `<div class="end">
    <div class="scene"><canvas id="scv" width="560" height="240"></canvas><div class="cap">${n === 0 ? 'The Fourth comes up out of the dark. All five.' : 'Morning finds the Fourth still standing, which is the whole of the job.'}</div></div>
    <div class="sub" style="margin-top:12px">${title}</div>
    <h2>${E[0]}</h2>
    <p class="narr" style="margin:0">${E[1]}</p>
    ${extra.length ? `<ul>${extra.map(e => `<li>${e}</li>`).join('')}</ul>` : ''}
    <div class="kv" style="margin:16px 0">${SQUAD().slice(1).map(id => `<span>${TPL[id].name}</span><span class="pips">${loyLabel(S.loy[id])}</span>`).join('')}
      <span>Squad level</span><span>${S.lvl} (${S.xp} xp)</span>${S.card ? `<span>Card drawn</span><span>${CARDS[S.card].name}</span>` : ''}</div>
    <p class="fine">${CHTEASE[n] || ''}</p>
    <div class="row" style="margin-top:14px">${next ? `<button class="btn primary" id="bNext">Chapter ${next.number}: ${next.title}</button>` : ''}<button class="btn" id="bSq">Squad</button><button class="btn" id="bSet2">Settings</button><button class="btn" id="bAgain">Title</button></div></div>`;
  G.sceneKind = 'camp';
  if (next) $('#bNext').onclick = () => { AUDIO.play('click'); startChapter(n + 1); };
  $('#bSq').onclick = () => { AUDIO.play('click'); openChars(0); };
  $('#bSet2').onclick = () => { AUDIO.play('click'); openSettings(); };
  $('#bAgain').onclick = () => { AUDIO.play('click'); showTitle(); };
}
const showEnd = showChapterEnd;
function startChapter(n){
  const CH = CHAPTERS[n]; if (!CH) return showTitle();
  S.chapter = n; S.card = null; S.scene = 'chintro'; S.node = null; S.bg = null; S.battle = null; S.bopt = null;
  S.area = CH.area.id; S.pos = {...CH.area.start}; S.trail = [{x:S.pos.x-1,y:S.pos.y},{x:S.pos.x+1,y:S.pos.y},{x:S.pos.x-1,y:S.pos.y+1},{x:S.pos.x,y:S.pos.y+1}]; S.log = [];
  save(); showChapterIntro();
}
function showChapterIntro(){
  const CH = CHAPTERS[S.chapter]; if (!CH) return showTitle();
  view = 'intro'; $('#sheet').hidden = true; B = null; titleAnim = null; AUDIO.setScene('explore');
  const I = CH.intro;
  $('#app').innerHTML = `<div class="chcard"><div class="num">Chapter ${CH.number}</div><h1>${CH.title}</h1><div class="rule"></div></div>
  <header class="hud"><div><div class="loc">${I.loc}</div><div class="sub">${I.sub}</div></div><div class="hudr">${hudButtons()}</div></header>
  <div class="scene"><canvas id="scv" width="560" height="240"></canvas><div class="cap">${I.cap}</div></div>
  <div class="narr">${I.paras.map(p => fmt(p)).join('')}</div>
  <div class="row"><button class="btn primary" id="bGo">${I.go}</button><button class="btn" id="bSq">The squad</button></div>`;
  G.sceneKind = CH.area.decor === 'pale' ? 'camp' : 'camp_night';
  $('#bGo').onclick = () => { AUDIO.play('click'); $('#bGo').disabled = true; startExplore(CH.area.id); if (I.node) talk(I.node); };
  $('#bSq').onclick = () => { AUDIO.play('click'); openChars(0); };
  bindHud();
}
/* quest lines per area (chapter content sets flags; the engine reads them) */
const QUESTS = {
  pale_night:()=> S.f.c1_done ? 'Get some sleep. Somebody should.' : S.f.c1_hounds ? 'Hounds in the tent lines' : !S.f.c1_reported ? 'Report to Whiskeyjack at the Bridgeburners\' fire (east)' : !S.f.c1_tent ? 'Tattersail\'s tent, cadre row (north)' : 'Walk the lines. Something is coming.',
};
/* ability picks: shown before the next conversation after a level 3/5/7 */
function openPicks(done){
  const lvl = S.picksDue[0]; if (!lvl) return done && done();
  const m = $('#modal'); m.hidden = false;
  const chosen = {};
  const optsFor = id => lvl === 3 ? PICKS[3][id] || [] : PICKS.vet.filter(v => !has(id, v[0]));
  m.innerHTML = `<div class="mbox"><h2 class="m">Level ${lvl}</h2><p class="fine">${lvl === 3 ? 'The squad has been through enough to have habits. Pick one per soldier.' : 'Veterans. One pick each; the rest stays as it was.'}</p>
    <div class="picks">${SQUAD().map(id => `<div class="pk"><h4>${esc(NAME(id))} <span class="stat">${TPL[id].role}</span></h4><div class="opt2">${optsFor(id).map(o => `<button class="btn" data-id="${id}" data-k="${o[0]}"><b>${o[1]}</b>${o[2]}</button>`).join('')}</div></div>`).join('')}</div>
    <div class="row" style="margin-top:12px"><button class="btn primary" id="bPick" disabled>Confirm</button></div></div>`;
  const need = SQUAD().filter(id => optsFor(id).length).length;
  m.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { AUDIO.play('click'); chosen[b.dataset.id] = b.dataset.k; m.querySelectorAll(`[data-id="${b.dataset.id}"]`).forEach(x => x.classList.toggle('on', x === b)); $('#bPick').disabled = Object.keys(chosen).length < need; });
  $('#bPick').onclick = () => { AUDIO.play('up'); Object.entries(chosen).forEach(([id,k]) => S.picks[id].push(k)); S.picksDue.shift(); save(); m.hidden = true; if (S.picksDue.length) openPicks(done); else done && done(); };
  m.onclick = null;
}
