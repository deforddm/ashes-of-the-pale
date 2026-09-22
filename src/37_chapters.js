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
  2:{
    light:['You rode to the light','A mage died on the plain and the Fourth went to see it, against orders and against the clock. The Rhivi were there first and carried something away. Tuft knows what. The wagon arrives in Darujhistan a day late, and Whiskeyjack will have counted the day.'],
    road:['You kept the road','A mage died on the plain and the Fourth watched the light and counted rations. The timetable held. Three tall figures with silver hair came out of the dark to ask one question, and were afraid, and that is the thing nobody in the squad is talking about.'] },
  3:{
    report:['You told the Claw','A grey-haired woman in a dye-shop asked what the Bridgeburners were doing under the city, and the Fourth told her, for silver and the Empire\'s regard. Whiskeyjack does not know. Brisk does. So does the sergeant, every time the crew goes down the hole.'],
    refuse:['You walked out','A grey-haired woman in a dye-shop asked what the Bridgeburners were doing under the city, and the Fourth gave her nothing, and paid for it in an alley. The Claw has the sergeant\'s name in a neat hand now. Whiskeyjack, told or not, has the squad.'] },
};
const CHTEASE = {
  0:'Next: Captain Paran arrives at the Pale, the Hounds of Shadow come hunting, and the Fourth is told where it is going.',
  1:'Next: the Black Moranth will not carry a sixth squad. The Fourth rides south across the Rhivi Plain, and something is riding the same way.',
  2:'Next: Darujhistan, the city of blue fire. The Bridgeburners are a week ahead and already under it.',
  3:'Next: assassins on the rooftops, a war nobody in the city admits is being fought, and a name said quietly at the Phoenix Inn: Rallick Nom.',
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
  if (n === 2) {
    if (SQUAD().includes('ellis')) extra.push('Ellis rides with the Fourth. Toc\'s word, and yours.'); if (S.f.c2_ellisRefused) extra.push('Ellis stayed on the plain. Toc\'s word was not enough.');
    if (S.f.c2_late) extra.push('The wagon is a day late. Whiskeyjack does not forget days.');
    if (S.f.c2_outFought) extra.push('Rhivi blood on the grass. They will remember the squad that spilled it.');
    if (S.f.c2_badge) extra.push('A Second Army badge from the barrow. Wrong regiment. Brisk keeps it anyway.');
    if (S.f.c2_croneSaw) extra.push('A Great Raven knows the sergeant\'s name now. That is not a comfort.');
  }
  if (n === 3) {
    if (S.f.c3_lied) extra.push('You lied to a Claw handler to her face. She may or may not have believed it. She will find out.');
    if (S.f.c3_told) extra.push('Madryn knows what is under the intersection. That is a loaded gun with the Fourth\'s name on the grip.');
    if (S.f.c3_wjTold) extra.push('Whiskeyjack said "Good." Once. The squad heard it.');
    if (S.f.c3_kruppe) extra.push('Kruppe said a sentence about the plain and Tuft went white. Nobody else understood it. Tuft has not explained.');
    if (S.f.c3_sorry) extra.push('The sergeant spoke to Sorry. Eleven words came back. They were the wrong shape.');
    if (S.f.c3_coll) extra.push('Coll\'s signet is in the sergeant\'s pocket. It opens doors in this city that Coll no longer walks through.');
    if (S.f.c3_ellisMsg) extra.push('The Claw\'s message came through Ellis. She brought it anyway. Remember that.');
    if (S.f.c3_paid) extra.push('The Fourth\'s real name is in a gate-clerk\'s ledger, for five silver.');
    if (S.f.wjRegard > 0) extra.push('Whiskeyjack has decided the Fourth is worth the trouble.'); if (S.f.wjRegard < 0) extra.push('Whiskeyjack has decided the Fourth is trouble.');
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
  S.area = CH.area.id; S.pos = {...CH.area.start}; S.trail = [[-1,0],[1,0],[-1,1],[0,1],[1,1],[0,-1]].map(([dx,dy]) => ({x:S.pos.x+dx, y:S.pos.y+dy})); S.log = [];
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
  G.sceneKind = CH.area.decor === 'pale' ? 'camp' : (CH.area.decor || '').startsWith('plain') ? CH.area.decor : (CH.area.decor || '').startsWith('city') ? 'city_street' : 'camp_night';
  $('#bGo').onclick = () => { AUDIO.play('click'); $('#bGo').disabled = true; startExplore(CH.area.id); if (I.node) talk(I.node); };
  $('#bSq').onclick = () => { AUDIO.play('click'); openChars(0); };
  bindHud();
}
/* quest lines per area (chapter content sets flags; the engine reads them) */
const QUESTS = {
  plain_road:()=> S.f.c2_barrowFought ? 'East, to the wagon road\'s end' : S.f.c2_seth ? 'East. Sethand says do not go into the barrow.' : 'Talk to the guide, Sethand',
  hound_site:()=> S.f.c2_tocGone ? 'East, to the fourth camp' : 'Dead horses, and two people who are not dead',
  ridge:()=> S.f.c2_lightDone ? 'Dawn. East, to the hills' : S.f.c2_light ? 'The light in the west' : 'The fourth camp. Talk to Sethand.',
  hills_edge:()=> 'The Gadrobi Hills. Darujhistan beyond.',
  worry_gate:()=> S.f.c3_gateFought ? 'East, into the Gadrobi District' : S.f.c3_gate ? 'The wagon through the gate. East.' : 'The Worry Gate. Talk to the gate-clerk.',
  gadrobi_cross:()=> S.f.c3_key ? 'Dawn. The roof above the dig.' : S.f.c3_msg ? 'The Daru District. A dye-shop. East.' : S.f.c3_workDone ? (S.f.c3_inn ? 'The second night. Somebody is looking for you.' : 'The Phoenix Inn, or the second night') : S.f.c3_reported ? 'Crates down the hole. Whiskeyjack\'s orders.' : 'Report to Whiskeyjack at the barrier',
  daru_street:()=> S.f.c3_key ? 'Back west, to the dig' : S.f.c3_madryn ? 'The dye-shop. Decide.' : 'The dye-shop door, Daru District',
  pale_night:()=> S.f.c1_done ? 'Get some sleep. Somebody should.' : S.f.c1_hounds ? 'Hounds in the tent lines' : !S.f.c1_reported ? 'Report to Whiskeyjack at the Bridgeburners\' fire (east)' : !S.f.c1_tent ? 'Tattersail\'s tent, cadre row (north)' : 'Walk the lines. Something is coming.',
};
/* ability picks: shown before the next conversation after a level 3/5/7 */
function openPicks(done){
  const lvl = S.picksDue[0]; if (!lvl) return done && done();
  const m = $('#modal'); m.hidden = false;
  const chosen = {};
  const optsFor = id => lvl === 3 ? ((PICKS[3][id] || []).some(o => has(id, o[0])) ? [] : PICKS[3][id] || []) : PICKS.vet.filter(v => !has(id, v[0]));
  m.innerHTML = `<div class="mbox"><h2 class="m">Level ${lvl}</h2><p class="fine">${lvl === 3 ? 'The squad has been through enough to have habits. Pick one per soldier.' : 'Veterans. One pick each; the rest stays as it was.'}</p>
    <div class="picks">${SQUAD().filter(id => optsFor(id).length).map(id => `<div class="pk"><h4>${esc(NAME(id))} <span class="stat">${TPL[id].role}</span></h4><div class="opt2">${optsFor(id).map(o => `<button class="btn" data-id="${id}" data-k="${o[0]}"><b>${o[1]}</b>${o[2]}</button>`).join('')}</div></div>`).join('')}</div>
    <div class="row" style="margin-top:12px"><button class="btn primary" id="bPick" disabled>Confirm</button></div></div>`;
  const need = SQUAD().filter(id => optsFor(id).length).length;
  m.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { AUDIO.play('click'); chosen[b.dataset.id] = b.dataset.k; m.querySelectorAll(`[data-id="${b.dataset.id}"]`).forEach(x => x.classList.toggle('on', x === b)); $('#bPick').disabled = Object.keys(chosen).length < need; });
  $('#bPick').onclick = () => { AUDIO.play('up'); Object.entries(chosen).forEach(([id,k]) => S.picks[id].push(k)); S.picksDue.shift(); save(); m.hidden = true; if (S.picksDue.length) openPicks(done); else done && done(); };
  m.onclick = null;
}
