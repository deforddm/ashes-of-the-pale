/* ============ chapters: cards, intros, endings, ability picks ============ */
const CHEND = {
  0:{ // the prologue's four endings (text kept from the slice)
    given:['Delivered','Varrow\'s journal is in the cadre\'s hands, unread by you. Tattersail owes your squad, and she is the kind who pays.'],
    told:['Delivered, and known','Tattersail has the journal. You and Tuft both know what the underlined line says. That kind of knowledge has a weight, and a price.'],
    burned:['Ashes','Varrow\'s account went up in a candle flame. Your squad is safer. The truth about the night the Second died is not.'],
    claw:['Taken','The journal went to the Claw. Tayschrenn will know by morning who carried it up out of the dark.'] },
  1:{
    line:['The line held','When the tents burned the Fourth went where Tattersail pointed, and stood there until the Hounds decided the cadre row was not worth the price. The cadre will remember which squad that was. So will a man with clean boots.'],
    claw:['The crate held','When the tents burned the Fourth sealed the cadre tent on a grey cloak\'s word and let the mage shout. The Hounds broke on Claw knives instead of marine shields. Tuft has said one thing since, with her back to the fire. The Empire, in the person of a man with clean boots, is pleased.'] },
  2:{
    light:['You rode to the light','A mage died on the plain and the Fourth went to see it, against orders and against the clock. The Rhivi were there first and carried something away. Tuft knows what. The wagon arrives in Darujhistan a day late, and Whiskeyjack will have counted the day.'],
    road:['You kept the road','A mage died on the plain and the Fourth watched the light and counted rations. The timetable held. Three tall figures with silver hair came out of the dark to ask one question, and answered none, and that is the thing nobody in the squad is talking about.'] },
  3:{
    report:['You told the Claw','A grey-haired woman in a dye-shop asked what the Bridgeburners were doing under the city, and the Fourth told her, for silver and the Empire\'s regard. Whiskeyjack does not know. Brisk does. So does the sergeant, every time the crew goes down the hole.'],
    refuse:['You walked out','A grey-haired woman in a dye-shop asked what the Bridgeburners were doing under the city, and the Fourth gave her nothing, and paid for it in an alley. The Claw has the sergeant\'s name in a neat hand now. Whiskeyjack, told or not, has the squad.'] },
  4:{
    shield:['You held the roof','A Guild boy came over the parapet with a Tiste Andii behind him and the Fourth stood in between, which is what a line is for, and held three rounds against something that does not lose. Something in Quick Ben\'s sack laughed, and the silver-haired shapes went elsewhere. The boy is alive. The Guild knows which squad did that.'],
    aside:['You stepped aside','A Guild boy came over the parapet with a Tiste Andii behind him and the Fourth let it through. It killed him in one motion, looked at the sergeant, and nodded. Tuft looked into Kurald Galain and it looked back. Ohl\'s list has a name on it he did not put there.'] },
  5:{
    through:['Into the grey','A puppet opened the world on a hillside and Toc the Younger went through it, and when someone in the Fourth moved to follow him, the sergeant said go. The rent closed. The Hounds came for the puppet and not for you. Something under the hill turned over in its sleep, and Paran rode for the city at dawn with a face like a man who has read the end of the book.'],
    hold:['You held the line','A puppet opened the world on a hillside and Toc the Younger went through it, and the Fourth held on to its own. The rent closed on nothing. The Hounds came for the puppet and not for you. Something under the hill turned over in its sleep. Somebody in the squad has not forgiven the sergeant, and says so with silence.'] },
};
const CHTEASE = {
  0:'Next: Captain Paran arrives at the Pale, the Hounds of Shadow come hunting, and the Fourth is told where it is going.',
  1:'Next: the Black Moranth will not carry a sixth squad. The Fourth rides south across the Rhivi Plain, and something is riding the same way.',
  2:'Next: Darujhistan, the city of blue fire. The Bridgeburners are a week ahead and already under it.',
  3:'Next: assassins on the rooftops, a war nobody in the city admits is being fought, and a name said quietly at the Phoenix Inn: Rallick Nom.',  4:'Next: the Gadrobi Hills. An Adjunct with a T\'lan Imass at her side is digging for something that should stay buried, and the Fourth is sent to watch the wrong hill.',
  5:'Next: the Fete. Darujhistan throws a party the size of a city while a Tyrant walks toward it, and everyone the Fourth has met is going to be at Lady Simtal\'s.',
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
    if (S.f.c2_andiiFear) extra.push('The Andii were afraid of something on the plain. The sergeant saw it. Tuft would like it written down somewhere.');
    if (S.f.c2_outSeth) extra.push('Sethand spent his word on the Rhivi for the Fourth. You owe him a thing you will not be able to pay.');
    if (S.f.c2_badge) extra.push('A Second Army badge from the barrow. Wrong regiment. Brisk keeps it anyway.');
    if (S.f.c2_croneSaw) extra.push('A Great Raven knows the sergeant\'s name now. That is not a comfort.');
  }
  if (n === 3) {
    if (S.f.c3_lied) extra.push(S.f.c3_lieHeld ? 'You lied to a Claw handler to her face, and she half believed it. She will find out which half.' : 'You lied to a Claw handler to her face. She thanked you for the trouble.');
    if (S.f.c3_told) extra.push('Madryn knows what is under the intersection. That is a lit fuse with the Fourth\'s name on it.');
    if (S.f.c3_wjTold) extra.push('Whiskeyjack said "Good." Once. The squad heard it.');
    if (S.f.c3_kruppe) extra.push('Kruppe said a sentence about the plain and Tuft went white. Nobody else understood it. Tuft has not explained.');
    if (S.f.c3_sorry) extra.push('The sergeant spoke to Sorry. Eleven words came back. They were the wrong shape.');
    if (S.f.c3_coll) extra.push('Coll\'s signet is in the sergeant\'s pocket. It opens doors in this city that Coll no longer walks through.');
    if (S.f.c3_ellisMsg) extra.push('The Claw\'s message came through Ellis. She brought it anyway. Remember that.');
    if (S.f.c3_trueName) extra.push('The sergeant\'s real name is in a gate-clerk\'s ledger, spelled correctly. Somebody reads that ledger.'); else if (S.f.c3_falseName) extra.push('A dead man\'s name off an Untan headstone is in a gate-clerk\'s ledger. It is the name this city knows the sergeant by.'); else if (S.f.c3_paid) extra.push('Five silver kept the Fourth\'s name out of a gate-clerk\'s ledger. It did not keep it out of anyone else\'s.');
    if (S.f.wjRegard > 0) extra.push('Whiskeyjack has decided the Fourth is worth the trouble.'); if (S.f.wjRegard < 0) extra.push('Whiskeyjack has decided the Fourth is trouble.');
  }
  if (n === 4) {
    if (S.f.c4_vell) extra.push('Vell is alive. A Guild journeyman owes the Fourth his life, and the Guild pays its debts, one way or the other.');
    if (S.f.c4_guildKnows) extra.push('Ocelot knows a Malazan squad held a roof for one of his. Vell told him, and then told the rest of the clan.');
    if (S.f.c4_seen) extra.push('A Tiste Andii knows the Fourth\'s faces. That is Rake\'s business now.');
    if (S.f.c4_tuftDark) extra.push('Tuft has not slept. She says the dark was polite. She says it the way you say a thing you are trying not to say.');
    if (S.f.c4_kalamLook) extra.push('Kalam looked at the sergeant a beat too long before he went up. He knows something was told. He does not know by whom. Yet.');
    if (S.f.c4_reprisalFought) extra.push('Guild blood in the alley. Ocelot sent three and got two back, one of them holding his ribs, and will count that.');
    if (S.f.c4_sawSorry) extra.push('A girl in a doorway who did not move at all. Kettle has not stopped talking about it, which is how Kettle is afraid.');
    if (S.f.c4_rallick) extra.push('Rallick Nom told the Fourth to go home. He is the first person in this city to say it as a kindness.');
    if (S.f.wjRegard > 0) extra.push('Whiskeyjack has decided the Fourth is worth the trouble.'); if (S.f.wjRegard < 0) extra.push('Whiskeyjack has decided the Fourth is trouble.');
  }
  if (n === 5) {
    if (S.f.c5_ellisThrough) extra.push('Ellis went into the grey after her captain. The rent closed on her heel. Nobody has said the word \'dead\'. Nobody will.');
    if (S.f.c5_ellisHeld) extra.push('Ellis is with the Fourth and has not spoken to the sergeant since the hillside. She counts the squad every morning and arrives at the wrong number.');
    if (S.f.c5_tuftMarked) extra.push('Tuft came back from the threshold with grey in her hair. Shadow has noticed her. She says it was polite.');
    if (S.f.c5_toolSaw) extra.push('A T\'lan Imass looked at the ridge, once, and told the sergeant to stay small. That is the kindest thing anyone has said to the Fourth in a month.');
    if (S.f.c5_cusserUsed) extra.push('Kettle used the cusser. She has not stopped talking about it. Brisk wrote it in the ledger with a line under it.');
    if (S.f.c5_spotted) extra.push('The Adjunct\'s camp saw movement on the ridge. Lorn did not look up. Tool did.');
    if (S.f.c5_crone) extra.push('Crone says Rake is interested in the hill. Crone laughed when she said it. That is worse.');
    if (S.f.wjRegard > 0) extra.push('Whiskeyjack has decided the Fourth is worth the trouble.'); if (S.f.wjRegard < 0) extra.push('Whiskeyjack has decided the Fourth is trouble.');
  }
  if (n === 1) {
    if (S.f.wjRegard > 0) extra.push('Whiskeyjack has decided the Fourth is worth the trouble.'); if (S.f.wjRegard < 0) extra.push('Whiskeyjack has decided the Fourth is trouble.');
    if (S.f.c1_accFought) extra.push('Three of the Claw\'s people did not walk away from the picket line.');
    if (S.f.c1_accBluffed) extra.push('Kettle introduced her cusser to three of the Claw\'s people, by name. They left.');
    if (S.f.cadreTrust) extra.push('Tattersail knows what the Fourth is for.'); if (S.f.clawFavour) extra.push('The Claw remembers a favour. That is not the same as owing one.');
    if (S.f.c1_refusedKnife) extra.push('You turned down a Claw\'s knife. Brisk noticed.');
  }
  const CH = CHAPTERS[n], safe = (f, d) => { try { const v = f(); return v == null ? d : v; } catch(e) { return d; } };
  if (n > 0 && CH && CH.extras) extra.push(...safe(() => CH.extras(), []).filter(Boolean)); // the chapter's own lines, after the engine's
  const next = CHAPTERS[n + 1], epi = n === 7; // there is no Chapter Eight: the last end screen opens the epilogue
  const title = n === 0 ? 'End of the prologue' : `End of Chapter ${CH ? CH.number : n}`;
  const cap = n === 0 ? 'The Fourth comes up out of the dark. All five.' : CH && CH.endCap ? safe(() => CH.endCap(), 'Morning finds the Fourth still standing, which is the whole of the job.') : 'Morning finds the Fourth still standing, which is the whole of the job.';
  $('#app').innerHTML = smartq(`<div class="end">
    <div class="scene"><canvas id="scv" width="560" height="240"></canvas><div class="cap">${cap}</div></div>
    <div class="sub" style="margin-top:12px">${title}</div>
    <h2>${E[0]}</h2>
    <p class="narr" style="margin:0">${E[1]}</p>
    ${extra.length ? `<ul>${extra.map(e => `<li>${e}</li>`).join('')}</ul>` : ''}
    <div class="kv" style="margin:16px 0">${SQUAD().slice(1).map(id => `<span>${TPL[id].name}</span><span class="pips">${loyLabel(S.loy[id])}</span>`).join('')}
      <span>Squad level</span><span>${S.lvl} (${S.xp} xp)</span>${S.card ? `<span>Card drawn</span><span>${CARDS[S.card].name}</span>` : ''}</div>
    <p class="fine">${CHTEASE[n] || ''}</p>
    <div class="row" style="margin-top:14px">${epi ? `<button class="btn primary" id="bEpi">Epilogue</button>` : next ? `<button class="btn primary" id="bNext">Chapter ${next.number}: ${next.title}</button>` : ''}<button class="btn" id="bSq">Squad</button><button class="btn" id="bSet2">Settings</button><button class="btn" id="bAgain">Title</button></div></div>`);
  G.sceneKind = (CH && CH.endScene) || (n === 6 ? 'fete_garden' : n === 7 ? 'quorl_hill' : 'camp');
  if (epi) $('#bEpi').onclick = () => { AUDIO.play('click'); showFinale(0); };
  else if (next) $('#bNext').onclick = () => { AUDIO.play('click'); startChapter(n + 1); };
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
  const dec = CH.area.decor || '';
  G.sceneKind = I.scene || (S.chapter === 6 ? 'fete_street' : S.chapter === 7 ? 'lakefront_dawn' : dec === 'pale' ? 'camp' : dec.startsWith('plain') || dec.startsWith('hills') ? dec : dec.startsWith('city') ? 'city_street' : dec === 'roof_night' ? 'roof_night' : dec.startsWith('estate') ? 'fete_garden' : dec === 'lakefront' ? 'lakefront_dawn' : 'camp_night');
  AUDIO.setScene(sceneAmb(G.sceneKind, 'explore'));
  $('#bGo').onclick = () => { AUDIO.play('click'); $('#bGo').disabled = true; startExplore(CH.area.id); if (I.node) talk(I.node); };
  $('#bSq').onclick = () => { AUDIO.play('click'); openChars(0); };
  bindHud();
}
/* ============ the finale: the road taken, a page per squadmate, the sergeant, and the end of the book ============ */
const FIN_IDS = ['brisk','kettle','tuft','ohl','ellis'];
let finAnim = null;
function finKey(){ return S.chapters[7] || S.f.c7_key || 'outlaw'; }
function finCall(f, ...a){ try { return f ? f(...a) : null; } catch(e) { console.warn('finale', e); return null; } }
function finGone(id, key){ const F = CHAPTERS[7] && CHAPTERS[7].finale; if (F && F.gone) return finCall(F.gone, id, key);
  return S.dead && S.dead[id] ? {title:'Fallen', txt:`${TPL[id].name} did not get up. The Fourth carried the name the rest of the way.`} : null; } // no finale text: only the dead get a page
function finPages(){
  const key = finKey(), P = [{k:'road'}];
  S.squad.filter(id => id !== 'sgt').forEach(id => P.push({k:'fate', id}));
  FIN_IDS.filter(id => !S.squad.includes(id)).forEach(id => { const g = finGone(id, key); if (g) P.push({k:'gone', id, g}); });
  P.push({k:'fate', id:'sgt'}, {k:'end'}); return P;
}
function showFinale(i = 0){
  const P = finPages(); i = clamp(i|0, 0, P.length - 1); const pg = P[i], key = finKey(), F = (CHAPTERS[7] && CHAPTERS[7].finale) || {};
  S.scene = 'finale'; S.finPage = i; S.node = null; save();
  view = 'finale'; $('#sheet').hidden = true; B = null; titleAnim = null; finAnim = null; AUDIO.setScene('end');
  const E7 = (CHEND[7] || {})[key] || ['The road', ''];
  let body = '';
  if (pg.k === 'road') { const E = (F.endings && F.endings[key]) || {title:E7[0], scene:(CHAPTERS[7] && CHAPTERS[7].endScene) || 'quorl_hill', paras:[E7[1]].filter(Boolean)};
    G.sceneKind = E.scene || 'quorl_hill';
    body = `<div class="scene"><canvas id="scv" width="560" height="240"></canvas></div><div class="fin-k">Epilogue</div><h1 class="fin-title">${E.title || E7[0]}</h1><div class="narr">${(E.paras || []).map(p => fmt(p)).join('')}</div>`; }
  else if (pg.k === 'fate' || pg.k === 'gone') { const id = pg.id, sgt = id === 'sgt', dead = pg.k === 'gone' && S.dead && S.dead[id];
    const f = pg.k === 'gone' ? pg.g : (finCall(F.fate, id, key) || {title: sgt ? 'The sergeant' : TPL[id].role, txt: sgt ? TPL.sgt.quest : TPL[id].quest});
    const where = dead ? [S.dead[id].where, CHAPTERS[S.dead[id].ch] ? `Chapter ${CHAPTERS[S.dead[id].ch].number}` : ''].filter(Boolean).join(' · ') : '';
    body = `<div class="fin-k">${sgt ? 'The sergeant' : pg.k === 'gone' ? (dead ? 'The fallen' : 'Gone their own way') : 'The Fourth'}</div>
      <div class="fin-card"><div class="fin-por ${pg.k === 'gone' ? 'gone' : ''}"><canvas id="fpc" width="400" height="520" aria-hidden="true"></canvas>${pg.k === 'gone' ? `<span class="fin-mark ${dead ? '' : 'away'}">${dead ? '†' : 'gone'}</span>` : ''}</div>
        <div class="fin-who"><h2>${esc(NAME(id))}</h2><div class="r">${sgt ? 'Sergeant · Fourth Squad, Seventh Company' : TPL[id].role}</div>${sgt ? '' : pg.k === 'gone' ? (where ? `<div class="pips">${esc(where)}</div>` : '') : `<div class="pips">${loyLabel(S.loy[id] || 0)}</div>`}</div></div>
      <h3 class="fin-h">${f.title || ''}</h3><div class="narr fin-txt">${fmt(f.txt || '')}</div>`;
    finAnim = t => { const cv = $('#fpc'); if (!cv) { finAnim = null; return; } drawPortrait(cv.getContext('2d'), id, 400, 520, t); }; }
  else { const coda = finCall(F.coda, key) || [];
    const road = [`<li><span>Prologue</span><b>${((CHEND[0] || {})[S.chapters[0]] || ['—'])[0]}</b></li>`].concat([1,2,3,4,5,6,7].map(n => `<li><span>Chapter ${n} · ${CHAPTERS[n] ? CHAPTERS[n].title : '—'}</span><b>${((CHEND[n] || {})[S.chapters[n]] || ['—'])[0]}</b></li>`)).join('');
    const dead = Object.keys(S.dead || {});
    body = `<div class="fin-k">The end</div>${coda.length ? `<div class="narr">${coda.map(p => fmt(p)).join('')}</div>` : ''}
      <div class="fin-sum"><h3>The Fourth's road</h3><ol class="fin-road">${road}</ol>
        <h3>The dead</h3>${dead.length ? `<ul class="fin-dead">${dead.map(id => `<li><b>${esc(NAME(id))}</b>${S.dead[id].where ? ` — ${esc(S.dead[id].where)}` : ''}</li>`).join('')}</ul>` : `<p class="fine">None of the Fourth. Every one of them came up out of the dark.</p>`}
        <div class="kv"><span>Ohl's list</span><span>${listCount()} names</span><span>Squad level</span><span>${S.lvl} (${S.xp} xp)</span></div></div>
      <div class="fin-endline">The End of <em>Gardens of the Moon</em></div>
      <p class="fine fin-credit">The Malazan world and its canon characters belong to Steven Erikson. With thanks to him for the book, the Bridgeburners, and the long road; the Fourth only walked beside it.</p>`; }
  const last = i === P.length - 1;
  $('#app').innerHTML = `<div class="fin" id="fin">${body}
    <div class="fin-nav ${last ? 'last' : ''}"><button class="btn" id="fBack">Back</button><span class="fin-pg">${i + 1} / ${P.length}</span>${last ? `<button class="btn" id="fSq">The squad</button><button class="btn primary" id="fTitle">Title</button>` : `<button class="btn primary" id="fNext">Next</button>`}</div></div>`;
  window.scrollTo(0, 0);
  $('#fBack').onclick = () => { AUDIO.play('click'); finGo(-1); };
  if (last) { $('#fSq').onclick = () => { AUDIO.play('click'); openChars(0); }; $('#fTitle').onclick = () => { AUDIO.play('click'); showTitle(); }; }
  else $('#fNext').onclick = () => { AUDIO.play('click'); finGo(1); };
  let sx = null, sy = null; const el = $('#fin'); el.ontouchstart = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
  el.ontouchend = e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null; if (Math.abs(dx) > 70 && Math.abs(dy) < 50) { AUDIO.play('flip'); finGo(dx < 0 ? 1 : -1); } };
}
function finGo(d){ const i = (S.finPage || 0) + d, n = finPages().length; if (i < 0) { S.scene = 'chend'; save(); return showChapterEnd(); } if (i < n) showFinale(i); }
window.addEventListener('keydown', e => { if (view !== 'finale' || !$('#chars').hidden || !$('#settings').hidden || !$('#modal').hidden) return; if (e.key === 'ArrowRight') finGo(1); else if (e.key === 'ArrowLeft') finGo(-1); });
/* quest lines per area (chapter content sets flags; the engine reads them) */
const QUESTS = {
  plain_road:()=> S.f.c2_barrowFought ? 'East, to the wagon road\'s end' : S.f.c2_seth ? 'East. Sethand says do not go into the barrow.' : 'Talk to the guide, Sethand',
  hound_site:()=> S.f.c2_tocGone ? 'East, to the fourth camp' : 'Dead horses, and two people who are not dead',
  ridge:()=> S.f.c2_lightDone ? 'Dawn. East, to the hills' : S.f.c2_light ? 'The light in the west' : 'The fourth camp. Talk to Sethand.',
  hills_edge:()=> 'The Gadrobi Hills. Darujhistan beyond.',
  worry_gate:()=> S.f.c3_gateFought ? 'East, into the Gadrobi District' : S.f.c3_gate ? 'The wagon through the gate. East.' : 'The Worry Gate. Talk to the gate-clerk.',
  gadrobi_cross:()=> S.f.c3_key ? 'Dawn. The roof above the dig.' : S.f.c3_msg ? 'The Daru District. A dye-shop. East.' : S.f.c3_workDone ? (SQUAD().includes('ellis') ? 'The second night. Ellis is waiting at the dig.' : 'The second night. A Gadrobi child is looking for you.') : S.f.c3_reported ? 'Crates down the hole. Whiskeyjack\'s orders.' : 'Report to Whiskeyjack at the barrier',
  hills_ridge:()=> S.f.c5_seth ? 'East, to the barrow. Don\'t be seen.' : 'Talk to the Rhivi on the ridge',
  barrow_vale:()=> S.f.c5_key ? 'Dawn. Paran rides for the city.' : S.f.c5_night ? 'Night. Something on the next hill. East.' : S.f.c5_wardsFought ? 'Two riders coming up the vale' : 'The Adjunct and the Imass. Watch.',
  roofs_gadrobi:()=> S.f.c4_key ? 'Down. The dig, and Whiskeyjack.' : S.f.c4_roofsFought ? 'East across the planks, to Kalam\'s roof' : 'Two roofs over. Watch. Do not help.',
  roofs_daru:()=> S.f.c4_key ? 'Down, west. The street.' : S.f.c4_meet ? 'The parapet' : 'Kalam\'s roof. Watch.',
  daru_street:()=> S.f.c3_key ? 'Back west, to the dig' : S.f.c3_madryn ? 'The dye-shop. Decide.' : S.f.c3_guards ? 'The dye-shop. The outside stair.' : 'The dye-shop. The Watch is on the corner.',
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
