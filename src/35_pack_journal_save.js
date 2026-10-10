/* ============ pack / journal / save ============ */
function openModal(tab){
  const m = $('#modal'); m.hidden = false; m.scrollTop = 0;
  const tabs = S ? ['pack','journal','save','deeds'] : ['save','deeds']; routeAnim = null;
  const body = {
    pack:()=>`<div class="kv"><span>Silver</span><span>${S.silver}</span><span>${zoomArt('munitions/sharper', 'ico', 'Sharpers', true)}</span><span>${S.inv.sharper}</span><span>${zoomArt('munitions/burner', 'ico', 'Burners', true)}</span><span>${S.inv.burner}</span><span>${zoomArt('munitions/cusser', 'ico', 'Cussers', true)}</span><span>${S.inv.cusser}</span>${S.inv.smoker > 0 || S.f.gotSmokers ? `<span>${zoomArt('munitions/smoker', 'ico', 'Smokers', true)}</span><span>${S.inv.smoker}</span>` : ''}<span>${zoomArt('munitions/salve', 'ico', 'Healing salves', true)}</span><span>${S.inv.salve}</span>
      <span>Squad level</span><span>${S.lvl} (${S.xp}/${LEVELS[S.lvl] ?? '—'} xp)</span>${S.card ? `<span>Deck reading</span><span>${CARDS[S.card].name}</span>` : ''}</div>
      ${S.card ? `<div class="cardinline" style="margin-top:12px"><canvas id="icard" width="240" height="360"></canvas></div><p class="fine" style="text-align:center">${CARDS[S.card].fx}</p>` : ''}
      ${S.wounds ? `<h4 class="jh">Wounds carried (Bridgeburner)</h4><div class="kv wounds">${SQUAD().map(id => woundOf(id) == null ? '' : `<span>${esc(NAME(id))}</span><span>${woundOf(id)} / ${S.wounds[id + '_max'] || '?'} health ${S.inv.salve > 0 && woundOf(id) < (S.wounds[id + '_max'] || 0) ? `<button class="btn sm" data-salve="${id}">Salve +8</button>` : ''}</span>`).join('')}</div><p class="fine">Wounds close when the squad rests: at the start of a chapter, or where the story lets them sleep.</p>` : ''}
      <p class="fine" style="margin-top:10px">Moranth munitions hit everything in the blast, your own squad included. Warren magic builds strain; past ${strMax()}, the caster pays in blood (the limit grows at levels 4 and 7).</p>`,
    deeds:()=>deedsHTML(),
    journal:()=>`${journalHead()}<div class="route sm"><canvas id="jRoute"></canvas></div><h4 class="jh">Notes</h4><ul class="jl">${journalNotes().map(l => `<li>${l}</li>`).join('')}</ul>${artJournalHTML()}${typeof visionsHTML === 'function' ? visionsHTML() : ''}${glossHTML()}`,
    save:()=>`${S ? `<p class="fine">Playing as <b class="who">Sergeant ${esc(S.name)}</b>. The game saves itself on this device as you play, under your sergeant's name. Anyone else can start their own sergeant from the title, and each keeps a save of their own.</p>
      <div class="row" style="margin:8px 0 16px"><button class="btn" id="bSwitch">Switch sergeant</button></div>
      <label class="fine" for="exp">Sergeant ${esc(S.name)}'s save code. Copy it somewhere safe to move them to another device, or to keep them from a cleared browser.</label>
      <textarea id="exp" readonly>${saveCode()}</textarea><div class="row" style="margin:8px 0 16px"><button class="btn" id="bCopy">Copy code</button></div>`
      : `<p class="fine">Each sergeant saves on this device as they play. A save code brings one here from another device, or back from a cleared browser.</p>`}
      <label class="fine" for="imp">Paste a save code to load it</label><textarea id="imp" placeholder="Paste code here"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primary" id="bLoad">Load code</button></div><p class="fine" id="impMsg"></p>`,
  };
  m.innerHTML = smartq(`<div class="mbox"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px"><h2 class="m">${S ? 'Fourth Squad' : tab === 'deeds' ? 'Deeds' : 'Load a game'}</h2><button class="btn" id="bClose">Close</button></div>
    <div class="tabs">${S ? `<button class="tab" data-t="squad">Squad</button>` : ''}${tabs.map(k => `<button class="tab ${k === tab ? 'on' : ''}" data-t="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`).join('')}</div>
    <div>${body[tab]()}</div></div>`);
  m.querySelectorAll('.tab').forEach(b => b.onclick = () => { AUDIO.play('click'); if (b.dataset.t === 'squad') { m.hidden = true; openChars(0); } else openModal(b.dataset.t); });
  $('#bClose').onclick = () => { AUDIO.play('click'); m.hidden = true; };
  m.querySelectorAll('[data-salve]').forEach(b => b.onclick = () => { salveOut(b.dataset.salve); openModal('pack'); }); // Bridgeburner: a salve between fights
  if (tab === 'pack' && S.card) inlineCard($('#icard'), S.card, false);
  bindItemZoom(m);
  if (tab === 'deeds') bindDeeds();
  if (tab === 'journal') bindArtJournal(m);
  if (tab === 'journal' && typeof bindVisions === 'function') bindVisions(m);
  if (tab === 'journal') { const cv = $('#jRoute'); routeAnim = t => { if (!cv.isConnected || $('#modal').hidden) { routeAnim = null; return; } drawRoute(cv, S, t); }; }
  if (tab === 'save') {
    if ($('#bCopy')) $('#bCopy').onclick = () => { const ta = $('#exp'), b = $('#bCopy'); ta.focus(); ta.select(); AUDIO.play('click');
      const done = ok => { b.textContent = ok ? 'Copied' : 'Selected: copy it by hand'; };
      const old = () => { try { done(document.execCommand('copy')); } catch(e) { done(false); } }; // older browsers, and pages without clipboard permission
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(() => done(true), old); else old(); };
    if ($('#bSwitch')) $('#bSwitch').onclick = () => { AUDIO.play('click'); save(); m.hidden = true; showTitle(); };
    // a code for a sergeant already on this device asks twice: the second tap replaces that sergeant's save
    const bl = $('#bLoad'), unarm = () => { if (bl.dataset.arm) { delete bl.dataset.arm; bl.classList.remove('warn'); bl.textContent = 'Load code'; $('#impMsg').textContent = ''; } };
    $('#imp').oninput = unarm;
    bl.onclick = () => { let s = null; try { s = JSON.parse(decodeURIComponent(escape(atob($('#imp').value.trim())))); } catch(e) {}
      if (!s || s.v !== 1) { unarm(); $('#impMsg').textContent = 'That code didn\'t load. Check that it was copied in full.'; return; }
      s.name = String(s.name || 'Hask').slice(0, 18); const ex = roster().list.find(e => sameName(e.name, s.name));
      if (ex && !bl.dataset.arm) { bl.dataset.arm = 1; bl.classList.add('warn'); bl.textContent = `Replace Sergeant ${ex.name}`; $('#impMsg').textContent = tapWord(`Sergeant ${ex.name} already has a save on this device. Tap again to replace it with the one in this code.`); return; }
      AUDIO.play('click'); s.sid = ex ? ex.id : newSid(); S = migrate(s); save(); m.hidden = true; resume(); };
  }
  m.onclick = e => { if (e.target === m) m.hidden = true; };
}
/* the journal's notes, newest chapter first. Each line waits on the flag that means the player has seen it happen, so nothing spoils. */
function journalNotes(){
  const f = S.f, ch = S.chapter || 0, done = n => !!(S.chapters && S.chapters[n] != null) || ch > n, here = id => SQUAD().includes(id);
  const dead = Object.keys(S.dead || {}).filter(id => TPL[id]);
  const c7 = ch >= 7 ? [
    f.c7_ellisBack ? `Ellis came back out of the dark on the Lakefront. Four days, by the Fourth's count. Longer, by hers.` : f.c7_ellisLeft ? `Ellis came back out of the dark, and went her own way from the Lakefront with Kettle's cord on her wrist.` : '',
    f.c7_ellisJoined ? `Ellis was waiting on a cask at the green door, and went in with the Fourth.` : f.c7_ellisWalked ? `Ellis was waiting at the green door. She walked east alone.` : '',
    f.c7_ellisSpoke ? `Ellis has said her piece about the hillside.` : '',
    f.c7_clawTalked || f.c7_clawBought || f.c7_clawFought ? `The grey cloak's page on the Fourth: closed.` : f.c7_clawDeal === 'took' ? `The grey cloak wrote the Fourth a pardon, and a line after every name.${f.c7_pardonEmpty ? ' The lines say nothing.' : ''}` : f.c7_clawAvoided ? `The grey cloak's page on the Fourth stays open. Entries keep.` : f.c7_clawDeal === 'refused' ? `The grey cloak offered the Fourth a pardon. You said no.` : '',
  ] : [];
  const c6 = ch >= 6 ? [
    f.c6_key === 'bridgeburners' ? `The Fete: the Fourth held Lady Simtal's garden beside the Bridgeburners while the Tyrant came up out of the ground.` : f.c6_key === 'cellars' ? `The Fete: the Fourth went under the Gadrobi crossing and stopped the Claw firing the mines.` : f.c6_key === 'alley' ? `The Fete: the Fourth followed the Adjunct into an alley. ${f.c6_steppedIn ? '"Hold him," she said, and you stepped in.' : '"Hold him," she said, and you stood aside.'}` : '',
    f.c6_orders ? `In the pack: an unsigned order, in a neat hand, to fire the charges under the crossing.` : '',
    f.c6_lornEnd ? `The Adjunct is dead. Paran has her sword.` : '',
    f.c6_wjLeg ? `Whiskeyjack's leg is splinted to a halberd shaft.` : '',
    done(6) ? `A small wrong house of living wood has grown out of Lady Simtal's lawn overnight.` : '',
    ...dead.map(id => `${TPL[id].name} ${S.dead[id].ch === 6 ? 'fell the night of the Fete' : 'is dead'}.${here('ohl') ? ' Ohl has written the name on his list.' : ''}`),
  ] : [];
  const c5 = ch >= 5 ? [
    f.c5_key ? `On the hills a puppet opened the world, and Toc the Younger went through it.` : '',
    f.c5_ellisThrough ? `Ellis went into the grey after him. Nobody has said the word <em>dead</em>.` : f.c5_ellisHeld && !f.c7_ellisSpoke ? `Ellis would have gone after him. The Fourth held on to her, and she hasn't said a word to you since.` : '',
    f.c5_tuftMarked ? `Tuft put her arm into the rent up to the elbow. She came back with grey in her hair.` : '',
    f.c5_collDown ? `The Adjunct rode a big man down on the hill road, and did not stop.` : '',
    done(5) ? `The Adjunct has gone on to the city. Paran is following her. Under the barrow, something has started to knock.` : '',
  ] : [];
  const c4 = ch >= 4 ? [
    f.c4_key === 'shield' ? `On the roofs the Fourth stood between a Guild boy and the Tiste Andii hunting him, and held. The boy's name is Vell.${SQUAD().includes('vell') ? ` He walks with the Fourth now, with forty feet of tarred line on his shoulder.` : ''}${f.c4_ellisToc ? ` Ellis went east that night, into the hills, to find her captain.` : ''}` : f.c4_key === 'aside' ? `On the roofs you let the Tiste Andii through. It killed the Guild boy in one motion, looked at the sergeant, and nodded.` : '',
    f.c4_reprisalFought ? `The Guild came for the Fourth after. Fewer of them walked home than went out.` : '',
  ] : [];
  const c3 = ch >= 3 ? [
    f.c3_key === 'report' ? `You told the grey-haired woman at the dye-shop what the Bridgeburners are doing under the city, for forty silver.${f.c7_wjKnows ? ' Whiskeyjack knows now.' : ' Whiskeyjack does not know.'}` : f.c3_key === 'refuse' ? `You told the grey-haired woman at the dye-shop nothing, and paid for it in an alley. The Claw has the sergeant's name now.` : '',
    f.c3_wjTold ? `Whiskeyjack heard about the dye-shop from you. "Good," he said.` : '',
    f.c3_kruppeRumour ? `Kruppe, caught palming a coin at the Phoenix: the Guild's roof watchers sweep on a count of eight, and never look straight down.` : '',
  ] : [];
  const c2 = ch >= 2 ? [
    f.c2_key === 'light' ? `You rode to the light on the plain, against orders and against the clock. Black glass, and the Rhivi carried something away.` : f.c2_key === 'road' ? `You kept the road. Before dawn three tall strangers with silver hair walked into camp to ask if you had gone to the light.` : '',
    f.c2_ellisJoined ? `Ellis, Toc the Younger's scout, rides with the Fourth: six years a Claw scout, and a burned hand she doesn't explain.` : f.c2_ellisRefused ? `Ellis, Toc's scout, asked to ride with the Fourth. You kept the squad at five, and she rode on with Toc.` : '',
    f.c2_crone ? `A Great Raven called Crone landed by the fire and laughed at the Fourth.` : '',
  ] : [];
  const c1 = ch >= 1 ? [
    f.c1_reported ? `Whiskeyjack: the Fourth rides south overland with the baggage. Darujhistan.` : `Report to Whiskeyjack at the Bridgeburners' fire.`,
    f.c1_paran ? `Captain Paran walked the lines. Noble-born. Trying.` : '',
    f.c1_sawHairlock ? `Tattersail's puppet turned its head.` : '',
    f.c1_plant ? `Tattersail knows about Tuft's badge. So, now, do you.` : '',
    f.c1_hounds ? `The Hounds of Shadow came through the tent lines. ${f.c1_key === 'claw' ? 'You held the crate.' : 'You held the line.'}` : '',
    f.c1_accounting ? `The Claw came to settle accounts at the picket line.` : '',
  ] : [];
  const extra = [7, 6, 5, 4, 3, 2].filter(n => n <= ch && CHAPTERS[n] && CHAPTERS[n].journal).map(n => { try { return CHAPTERS[n].journal() || []; } catch(e) { return []; } }); // optional: a chapter module may still add journal:()=>[lines]
  const tuft = (S.dead && S.dead.tuft) || !SQUAD().includes('tuft') ? '' : ['glove', 'shadow', 'dark'].includes(f.c6_tuft) ? `Tuft and the High Mage: cut, at the Fete.` : f.c7_tuftCut ? `Tuft and the High Mage: cut, at the last.` : f.c6_tuft === 'kept' ? `Tuft and the High Mage: the badge is still on her collar.` : f.c1_qbTuft ? `Tuft and the High Mage: asked, not answered.` : f.c1_plant ? `Tuft and the High Mage: unasked.` : '';
  const tav = f.c7_tav ? `Brisk's brother, Second Army: alive, on the Host's rolls.` : f.c1_pits || f.c2_badge ? `Brisk's brother, Second Army: not yet found.` : '';
  return [...extra, ...c7, ...c6, ...c5, ...c4, ...c3, ...c2, ...c1,
    f.quest ? `Recover Varrow's satchel from the north sapper tunnels and bring it to Tattersail. ${S.ending ? '(Done.)' : ''}` : `Answer the cadre's summons.`,
    f.knowStakes ? `Tattersail says the journal records who ordered what the night the Second Army died.` : '',
    f.knowDeserters ? `Garrow: Moreau's section deserted into the north tunnels. "The Fist is still counting heads."` : '',
    f.clawMet ? (f.clawFooled ? `A grey cloak at the crater believed the grave-detail story.` : `A grey cloak is paying attention to your squad.`) : '',
    f.knowTruth ? `Varrow's journal: the cadre was moved forward <em>before</em> the Spawn attacked.` : '',
    tav, tuft].flat().filter(Boolean);
}
function saveCode(){ return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }

/* the journal's head: where the chapter stands now, and the road so far (the ending each chapter took) */
function journalHead(){
  const CH = CHAPTERS[S.chapter], a = AREAS[S.area], safe = f => { try { return f() || ''; } catch(e) { return ''; } };
  const now = S.scene === 'explore' ? (a ? safe(() => a.quest ? a.quest() : QUESTS[a.id] ? QUESTS[a.id]() : '') : '') : '';
  const road = Object.keys(S.chapters).map(Number).sort((x, y) => x - y).map(n => { const e = (CHEND[n] || {})[S.chapters[n]]; return e ? `<li><span>${n === 0 ? 'Prologue' : `Chapter ${CHAPTERS[n] ? CHAPTERS[n].number : n}${CHAPTERS[n] ? ' · ' + CHAPTERS[n].title : ''}`}</span><b>${e[0]}</b></li>` : ''; }).join('');
  return `<p class="jk">${S.chapter === 0 ? 'The prologue' : `Chapter ${CH ? CH.number : S.chapter}${CH ? ` · ${CH.title}` : ''}`}</p>${now ? `<p class="jnow">${now}</p>` : ''}${road ? `<h4 class="jh">The road so far</h4><ol class="fin-road">${road}</ol>` : ''}`;
}

/* the glossary at the foot of the journal: the words the book throws at you, unlocked as the story reaches them */
const GLOSS = [
  [0, 'The Malazan Empire', 'The Empire the Fourth serves: an Empress on the throne in Unta, armies on three continents, and a habit of taking cities.'],
  [0, "Onearm's Host", "What is left of the Second, Fifth and Sixth Armies on Genabackis, under High Fist Dujek Onearm. The Fourth are marines in it."],
  [0, 'Marines', 'Small squads with their own sapper, mage and healer, sent where a regiment would be noticed.'],
  [0, 'The Bridgeburners', "Whiskeyjack's company: veterans and sappers, the Empire's best, and the Empress's least trusted."],
  [0, 'The cadre', "The army's battle-mages. After the Pale, there are very few of them left."],
  [0, 'The Claw', "The Empress's assassins and spies. Grey cloaks. They keep lists."],
  [0, 'Warrens', 'The paths sorcery is drawn from. Tuft draws on Meanas, shadow and illusion; Ohl on Denul, healing. Draw too hard and it costs strain, and then blood.'],
  [0, 'Meanas', 'The warren of shadow and illusion: Tuft\'s. Quiet, and good for hiding things in.'],
  [0, 'Denul', 'The warren of healing: Ohl\'s. It closes wounds; it does not argue with Hood for free.'],
  [0, 'Moranth munitions', 'Clay grenados from the Moranth alchemists: sharpers throw iron, burners throw fire, smokers throw cover, and cussers take down walls. Thirteen to a crate: twelve and a dud.'],
  [0, "The Moon's Spawn", 'A mountain of black stone that floats, and hangs over whatever it chooses.'],
  [0, 'The Deck of Dragons', 'A deck of cards whose Houses are the powers of the world. A reading shows who is watching you.'],
  [0, 'Hood', 'The Lord of Death. Soldiers swear by his breath, his teeth and his gate.'],
  [0, 'Pale', 'The city the Second Army took, at the price of most of itself.'],
  [1, 'The Moranth', 'A people in chitin armour who sort themselves by colour and ride quorls, flying things like enormous dragonflies. The Black Moranth fly for Onearm.'],
  [1, 'The Hounds of Shadow', "The hunting beasts of High House Shadow, the size of horses, with eyes like lamps seen through smoke."],
  [1, 'Kurald Galain', 'The Warren of Darkness: an Elder warren, older than any the human mages draw on. Otataral does not quell it.'],
  [1, 'Mockra', 'The warren of the mind: what a person thinks they heard, and who they think said it.', () => S.lvl >= 3],
  [1, 'Shadowthrone', 'King of High House Shadow, on a throne in Shadowkeep. Nobody agrees on what he wants. Everybody agrees he is laughing.', () => godMet('tuft') || watchedVis('v3_qb')],
  [1, 'Soliel, Mistress of Healing', 'A goddess of healing, with temples across the Empire. Healers pray to her. She does not often answer soldiers.', () => godMet('ohl')],
  [1, 'Fener', 'The Boar of Summer, the god of war: the soldiers\' god, for when Hood is standing too close.', () => godMet('sgt')],
  [1, () => godMet('ellis') || godMet('vell') ? 'Cotillion, the Rope' : 'The Rope', 'The Patron of Assassins, of High House Shadow. The Guild calls on him on the rooftops; anyone with a long drop under them might.', () => godMet('ellis') || godMet('vell') || (S.chapter || 0) >= 4],
  [2, 'The Rhivi', 'Herders and riders of the central plains, who fight beside the Empire\'s enemies and carry their dead a long way.'],
  [2, 'Great Ravens', 'Ravens as big as a man, who remember everything and serve a lord they talk about far too much. Crone is the eldest.'],
  [3, 'Darujhistan', 'The City of Blue Fire: the last free city on Genabackis, lit by gas drawn up from the caverns beneath it.'],
  [3, 'Daru and Gadrobi', 'The city\'s two peoples. The Daru hold its money and its Council; the Gadrobi do its work, and give their name to the poorer districts and the hills to the east.'],
  [3, 'Oponn', 'The Twins of chance: the Lady pulls, the Lord pushes. A spinning coin is their business.'],
  [4, 'The Tiste Andii', "An old, long-lived people, tall and dark-skinned, who keep to the night. The Moon's Spawn is theirs."],
  [4, 'The Guild', "Darujhistan's assassins. They work the rooftops, and they do not like company up there."],
  [5, 'The Jaghut', 'An ancient race of solitary sorcerers, masters of ice. A few of them made themselves tyrants, and were buried for it.'],
  [5, 'Raest', 'The Jaghut Tyrant in the barrow on the Gadrobi Hills, buried by his own people a very long time ago.', () => S.f.c5_rise || (S.chapter || 0) >= 6],
  [5, "T'lan Imass", 'Undying warriors of bone and flint, bound to hunt the Jaghut for ever. They fought beside the old Emperor.'],
  [5, 'Otataral', 'A red ore that kills sorcery near it. Nobody with a warren wants to stand close to it. Some say the Elder warrens shrug it off.'],
  [5, 'The Adjunct', "The Empress's own hand, answerable to nobody below the throne."],
  [6, "Gedderone's Fete", "Darujhistan's spring festival: masks, paper lanterns, and winter chased out of the doorways at dawn."],
  [6, 'Omtose Phellack', 'The Jaghut warren: ice, and the cold that keeps.'],
  [6, 'The Azath', 'Houses that grow out of the ground where they are needed, and keep what is put in them.'],
  [6, 'The Finnest', 'Where a Jaghut keeps their power: set outside the body, in some object, and hidden. A Tyrant without it is less than he was.', () => S.chapters && S.chapters[6] != null],
  [6, 'Dragnipur', 'A sword that keeps what it kills. They go on, in chains, dragging a wagon through the dark inside it.', () => watchedVis('v6_rake')],
];
const godMet = id => !!(S && ((S.godsMet || []).includes(id) || (S.gods && (S.gods.used || []).includes(id))));
const seenVis = id => !!(S && (S.tuftVisions || []).includes(id)); // Tuft's: seen at a reading, not replayed from the journal
const watchedVis = id => !!(S && (S.seenVisions || []).includes(id)); // any, the journal's replays too
/* a row shows from its chapter on, and only once its met() test (if it has one) is true: the player has heard the word */
function glossHTML(){
  const ch = S ? S.chapter || 0 : 0, val = x => typeof x === 'function' ? x() : x;
  const rows = GLOSS.filter(g => { try { return g[0] <= ch && (!g[3] || (S && g[3]())); } catch(e) { return false; } });
  return `<details class="gloss"><summary>Words you'll hear</summary><dl>${rows.map(([, t, d]) => `<dt>${val(t)}</dt><dd>${d}</dd>`).join('')}</dl>${ch < 7 ? `<p class="fine">More as the story reaches them.</p>` : ''}</details>`;
}

/* what's new: shown once after an update (to a player with a save), and again from the version number on the title */
const NOTES = [
  ['3.19.0', ['Throwing a smoker no longer stalls the fight for a few seconds: the turn comes straight back.', 'Smoke is one grey cloud per smoker now, see-through, with its edge marked, like A Courtesy of Darkness.', 'Line of sight is traced tile by tile. Walls, pillars and standing stones block a shot; smoke anywhere on the line blocks it too. Throws, the hook, Veil, Phantom, Mend, Stanch and the other aimed tricks need sight of their target. The Quorl drop comes from the sky and doesn\'t.', 'New ground: tables, crates and fallen stones (block a step, not a shot; a target right behind one gets +2 armour against shots), and pits (block a step, not a shot). On the roofs the drop between roofs counts as a pit, and on the quays so does the lake.', 'Forced toward a pit, a roof\'s edge or the water by the hook, Shield Drive or an enemy\'s shove: a save to catch the lip and go down prone (no move next turn, −2 armour against blades), or over. An enemy that goes over is out of the fight. A squadmate climbs back up, hurt.', 'Where: crates in the alley by the Worry Gate, the stable yard and on the quay; tables on the upper terrace; the robbers\' shaft at the dig; an open barrow on the ridge; tanning pits and drying frames in the tanners\' yard.']],
  ['3.18.3', ['A Courtesy of Darkness is one cloud now, not nine, and you can see through it: the figures under it stay visible, and a slow dotted edge shows exactly which tiles it covers.']],
  ['3.18.2', ['Vell is in the rest at the end of Chapter 5 with the rest of the squad, with a scene of his own on the barrow-stones.', 'Vell can use knives, Guild blades and cloaks: the grey cloak\'s knife, the Daru duelling knife, both Guild blades, Toc\'s spare cloak and the scout\'s cloak.', 'More of Vell along the road: Tuft\'s Deck in the hills, the streets and the alchemist at the Fete, the toughs at the Worry Gate on the way out, his unfinished business on the sheet, and the chapter recaps.']],
  ['3.18.1', ['Fire on the ground now bites whoever goes through it. Stepping into a burning tile, or being dragged or driven through one, costs 1d4 and a save: the better of Might and Guile against 12. Fail it and you catch fire: 1d4 at the start of each of your next two turns. Rally, Denul Wash and the Rhivi song put it out. Enemies burn the same way, so a burner between you and them is a wall now.', 'The banner on the painted crate lid (Rumjugs and Sweetlard) sits lower, so the whole of it is inside the arch.']],
  ['3.18.0', ['There is a stall in the queue at the Worry Gate. Doctor Ottavio Brack, Purveyor of Wonders, Remedies and the Occasional Lesser Miracle, has been waiting nine days for the gate-clerk to find a column for miracles, and has opened for business in the meantime.', 'His wares are mostly nonsense: a two-headed coin, a shard of Moon\'s Spawn with a certificate, a map to a tyrant\'s hoard. Mostly. Ohl tasted the Hood\'s Repellent and will not say it doesn\'t work.', 'You can haggle with him, and Kettle has opinions about his Moranth powders.']],
  ['3.17.2', ['Shield Drive can follow through: after the drive, the tile the enemy left glows, and tapping it steps the sergeant in behind his shield, one tile, with no free swings. Tap anywhere else to hold your ground.']],
  ['3.17.1', ['When Vell\'s hook drags an enemy, every squadmate it is dragged out of reach of gets a free swing at it.', 'The sergeant has a new ability, Shield Drive: drive an adjacent enemy straight back (two tiles from level 4), and every squadmate it is driven away from gets a free swing. Into a wall or a body it takes extra damage instead.', 'The house guard\'s halberd now has reach: it strikes an enemy two tiles away, as Simtal\'s guards did. It takes both hands, so the shield goes on the back: −1 armour.']],
  ['3.17.0', ['Vell can join the Fourth. Stand between him and the Tiste Andii on the Chapter 4 roofs, then ask him to come with you. He fights with a grappling hook: a ranged throw that hauls an enemy to the tile beside him.', 'The Fourth has room for one recruit at a time. If Ellis is with you when Vell asks, she can go east to find Toc and leave the place to him. If she went into the rift after Toc, Vell can come down a rope into the vault under the crossing in Chapter 6 and offer himself then.', 'Every skill, spell, talent and trick now grows with level: longer reach, longer Veils and darks, harder for bosses to shrug off, more uses of the chapter tricks from level 5, and a higher strain limit at levels 4 and 7. Munitions stay as the Moranth made them.', 'At level 4 each soldier gains +1 to the Measure their role leans on (Wits for the sergeant, Kettle and Ohl; Might for Brisk; Guile for Tuft, Ellis and Vell), and at level 8 +1 to a second one. The character sheets show it.', 'Choices that showed only a dash now say what they do.']],
  ['3.16.1', ['Levels count for more. Every level still gives +4 health and +1 to hit; now levels 3, 5 and 7 add +1 damage on every blow, and levels 4 and 8 add +1 armour. The character sheets show it.', 'Rally grows with the squad: it heals 5, plus 2 for every level past the first, reaches 4 tiles, wakes the dazed, stops bleeding, and gives +2 to hit and +2 damage through the next round.', 'Denul Wash is worth casting: 2d4+2 plus the squad\'s level past the first, to everyone within 3 of Ohl, for strain 3. Mend, salves, the Rhivi Spirit-Song, Shield Bash and Argument with Hood grow with level too.', 'Bridgeburner is still hard, but no longer close to hopeless.']],
  ['3.16.0', ['The whole story has been checked against the novels, Gardens of the Moon and the books after it, and set right wherever it strayed.', 'A few names have changed: the clerk at the Worry Gate is Pennick, Brisk\'s brother is Tavrin, and the card once called Chains is now the Wain.', 'The maps of Genabackis, Darujhistan, Pale and the Gadrobi Hills now follow the lie of the land in the books.', 'Tuft remembers what she has seen in the Deck\'s visions, and the visions now follow the books.', 'The painted set is finished: every card Tuft deals, a painting at the end of every chapter, and one picture at each chapter\'s opening.', 'A Courtesy of Darkness and Omtose Rime come from the oldest magic, and now work even beside otataral, as the books say they should.', 'What\'s new shows everything since you last played. The journal keeps notes to the end of the book, and its glossary grows as you meet things.', 'Deeds now count your tricks, the gods\' answers and the visions you have seen.', 'Bigger buttons, clearer small text, curly apostrophes, gentler motion when you ask for it, and updates that download once.']],
  ['3.15.4', ['End turn now ignores taps for a moment at the start of each squad turn, so a double tap can\'t skip a squadmate.']],
  ['3.15.3', ['On a phone, the Proclamation at the end of the book now fits the screen and sits centred, and the page no longer slides sideways, so the count above it is centred too.']],
  ['3.15.2', ['Tap any picture of gear, a munition or a keepsake (on the squad sheets and in the pack) and it opens full screen, large, with everything known about it: what it does, who can use it, where it was found, and its story.', 'The pictures now live only where they belong in the game: on the title, the Deck, the chapters, the gear, and the journal\'s Maps, Papers and Faces. The separate gallery that came with the painted set is gone.']],
  ['3.15.1', ['The phone\'s Back button no longer drops you out of the game. In a menu it closes the menu, one layer at a time. With nothing open it asks first: "Press Back again to leave the game", and only a second Back right after leaves.']],
  ['3.15.0', ['The painted set. The artwork canvas is in the game: key art behind the title, painted faces on Tuft\'s Deck, a sigil for each god who answers, a plate at every chapter opening, vistas at the ends of Chapters Two, Three and Five, and the four roads and the Proclamation in the epilogue.',
             'Every piece of gear and every munition has its picture on the squad sheets and in the pack, and each squadmate\'s keepsake sits beside what they carry.',
             'The journal has Maps (tap one to see it full screen), the Papers the Fourth has seen, and Faces on the road: everyone met so far, canon and not.',
             'Pictures that would give away what is still ahead wait until the story gets there.',
             'Prefer the old drawings? Settings › Artwork › Classic brings them back.']],
  ['3.14.2', ['On a phone held upright, the story text now starts under the picture instead of sliding up over it, so you see the whole painting while you read. Scroll the text inside its own panel.']],
  ['3.14.1', ['✦ Through the Deck. When Tuft reads the Deck for you and a card turns, a new button appears beside "Put the cards away": Look into the card. It shows a short vision through the eyes of someone from the book, happening somewhere else that same night: Paran at Hood\'s Gate, Crone over the pillar of fire, Quick Ben in Shadowkeep, Paran inside the sword, Rake on the belfry, Lorn\'s last walk. In Chapter Four the card Tuft turns decides whose eyes you see through, out of four.',
             'Already past Tuft\'s reading this chapter? Open the journal: a new Visions list holds every vision for the chapters you have reached, seen or not, ready to watch.',
             'After the Fete, Paran no longer carries his own sword. He gave it away, he says. He carries the Adjunct\'s.']],
  ['3.13.7', ['Tuft\'s Phantom is a blinding shadow now: an enemy within 5 has Meanas over its eyes for its next two turns, and half the blows that would have landed go into the dark. Strain 2.', 'Mockra Whisper (an enemy turns on its own side) costs strain 3, so the bigger trick costs more.']],
  ['3.13.6', ['Broke at the bones? Hedge (Chapter One) or Fiddler (Chapter Three) will spot you five silver to sit in. Win, and they take their five back off the top; lose, and it goes on the Bridgeburners\' slate.']],
  ['3.13.5', ['Tuft\'s Mockra Whisper is no longer a second Phantom. Phantom (Meanas, an illusion) still costs an enemy its turn; Mockra Whisper (the mind) turns an enemy on its own side for a turn, and it goes for the nearest of them instead of you. Bosses may still shake it off.']],
  ['3.13.4', ['The same for the table games: whatever the bones or Kruppe\'s cups won or cost shows at the top as soon as you get up.']],
  ['3.13.3', ['The silver at the top of the screen now changes the moment you spend or win it, with a flash, instead of waiting for the conversation to close.']],
  ['3.13.2', ['Rumjugs and Sweetlard: somebody finally told the painter what their names meant.']],
  ['3.13.1', ['The crate lid at the Gadrobi crossing has been repainted, properly this time: both arms each, and the rest of them too. Sweets for the Sappers.']],
  ['3.13.0', ['Squadmates can move through each other, as long as they have the movement to get past. Nobody can end a move on someone else\'s tile.',
             'Steady: a squadmate who ends a turn without doing anything gets +2 on their next attack or save.',
             'Post up: a ranged squadmate who hasn\'t fired yet this fight gets a free shot at the first enemy who walks into range.',
             'Kettle\'s sharper openings now have consequences, different in every fight, and the story says what went differently: a barrow that heard the bang, a gas main in the lane, slates through an attic roof, a ship that cuts her lines at the quay, the Watch coming out of the Worry Gate. Some of it helps. Some of it costs.',
             'Hold-out fights: putting an enemy down when you were only meant to hold pays extra experience, and the story remembers it, even when the enemy gets up again.',
             'A continuity pass through every chapter: lines that assumed you had already talked to someone, people said to be down the hole while standing in plain sight, names used before anyone learned them, and more. Ellis now makes it plain when she has a letter for you.',
             'Gear: new kit goes to whoever it suits best with that slot free, and an Allocate gear button on the squad sheet deals everything out again for the most benefit. The sheet shows each bonus in gold, with the total.',
             'The Fete has no blue lanterns any more. Darujhistan\'s gas lamps are already blue.',
             'Somebody has painted the lid of a crate at the Gadrobi crossing. Go and have a look.']],
  ['3.12.0', ['Fights have higher stakes. Most fights now go on into a second area: clear the first ground and push on into the next, with your wounds, your strain, your spent munitions and your once-a-fight abilities carried over. A squadmate who went down gets dragged back up at a quarter of their health.',
             'Seven new fights, one in every chapter: deserters at Pell\'s wagon, deserters on the ridge, a grudge in the alley, a Guild clan on the plank home, barrow-robbers at the dig, a bonfire over the munitions, and the Worry Gate on the way out.',
             'Enemies have tricks of their own: hounds pounce and howl, Claw assassins step through shadow behind you, knives make you bleed, crossbows pin you, wights chill, bruisers shove, veterans parry, the Claw mage dazes, the grey cloak marks a target. Watch the log.',
             'When the whole squad goes down, a god answers for the most loyal of them: Hood for Brisk, Oponn for Kettle, Shadowthrone for Tuft, Soliel for Ohl, Cotillion for Ellis, and Fener, the soldiers\' god, for anyone. Each answers once a chapter, and only for a squadmate whose loyalty is above nothing. When nobody is left to answer, the chapter starts again. On Story, the gods always answer.',
             'Ohl has two new hands: Denul Wash (heals everyone close to him a little) and Stanch (holds one squadmate at 1 health until his next turn).',
             'Salves are scarce: the squad starts with one, Pell charges 5 silver, and one jar turns up among the dead each chapter from Chapter Two.',
             'Bridgeburner: wounds now carry from fight to fight until the squad rests (a new chapter, or a night\'s sleep in each chapter). The pack shows them and lets you use a salve between fights.',
             'Enemies get tougher chapter by chapter on Soldier and Bridgeburner. Story keeps the old pitch: softer foes, no enemy tricks.']],
  ['3.11.0', ['Skill checks that matter. Tap a check and pick who handles it: each squadmate shows their odds and what is helping or hurting them (their stat, loyalty, a rattle, Oponn, and what the Fourth did earlier on the road). The likeliest is lit. Every check also shows its odds before you commit.',
             'The story follows whoever rolled. If Tuft lies to the gate-clerk, Tuft does the lying; if Brisk bellows across the roofs, it is Brisk he hears.',
             'Six ways a roll can land: a natural 20, clean work (+xp), success, "yes, but" (you missed by a hair: it happens, at a price), failure, and a natural 1 (rattled for the next check). Failures change something now, later on the road.',
             '✦ Tricks. Ten hard checks, one or two a chapter, each teach whoever makes them a trick from the world: Tattersail\'s Fold, The Line, Rhivi Spirit-Song, the Lady\'s Pull, Blue Fire, Claw Hand-Cant, the Rope\'s Way, Otataral Dust, A Courtesy of Darkness and Omtose Rime. Some work once a fight, some have charges that come back each chapter. They are on the squad sheet and in the battle bar, marked ✦.',
             'More hard checks in Chapters 5 to 7, and the two checks that used to be the only way forward (the barrow edge and the green door\'s ledger) now have three ways in.',
             'Play a chapter again as soon as you have finished it, not just at the end of the book: from the chapter\'s end page, or the Deeds tab. The replay is a new save that starts with the squad, kit and tricks as they stood, and this save is kept.']],
  ['3.10.1', ['No more scrollbars where nothing needs scrolling. The title screen was always a little taller than the window; now it fits exactly.',
             'On a PC window too narrow for the side-by-side layout, a fight fits the window: the map comes down a size and the log shows the newest lines that fit.',
             'The tables fit the window too. When the talk runs long, the board gives up a little height instead of pushing the buttons off the bottom. Masks at the Fete lays its guests out three across on a wide screen.']],
  ['3.10.0', ['Deeds: a new tab, and a button on the title, that reads across every sergeant on this device. It shows the endings found on each chapter\'s road, how the tables have gone, and a map of the Fourth\'s road from Pale to the quorl hill.',
             'Difficulty: Story, Soldier or Bridgeburner. Pick it when you make a sergeant, and change it any time in Settings. Story softens the foes and the checks; Bridgeburner hardens both.',
             'The count: the finale now adds up the road. Fights won, foes put down, checks passed, silver earned and spent, munitions thrown, paces walked. The running count is on the Deeds tab.',
             'Chapter select: once a sergeant has finished the book, replay any chapter from the Deeds tab. The replay is a new save, so the finished one is kept.',
             'Controllers work now. Use the stick or D-pad to move and choose, A to act, B to go back, X to end a turn, the shoulder buttons for abilities, and View for the journal. On a keyboard, the arrows and Enter now steer the battle cursor.',
             'The journal draws the road so far as a map.']],
  ['3.9.1', ['The roof run (Chapter 4): after the fight on the Gadrobi roofs, cross to the Daru roofs low and unseen, one step at a time, while the Guild\'s watchers swing their lanterns on a count of eight. Caught Kruppe cheating in Chapter 3? Then you know the count.',
             'Masks at the Fete (Chapter 6): Whiskeyjack wants names. Walk Lady Simtal\'s hall, read the masks and the people under them, and hand Fiddler a list of five.']],
  ['3.9.0', ['Bones at the fire: a dice game of nerve against Fiddler at the Pale, Kettle at the Rhivi Plain fire (for first watch), and Hedge at the Gadrobi crossing once the crates are down. Two bones, throw or bank, and beware Hood\'s eyes.',
             'Kruppe\'s cups at the Phoenix Inn: follow the coin for three rounds. Kruppe cheats in the last one. Catch him at it and he pays double, and tells you something about the roofs.',
             'Laying the charges: in the vault under the crossroads, lay the twelve cussers yourself, three runs of a sapper\'s puzzle with Hedge watching. Clean work is rewarded.']],
  ['3.8.2', ['The credits now name Ian C. Esslemont beside Steven Erikson as co-creator of the Malazan world: on the title, at the finale and in the README.']],
  ['3.8.1', ['On a PC the game now uses the whole screen: the scene fills the left side, as tall as the window allows, and the text sits against the right edge. On a big monitor the text is a size larger too.',
             'Settings \u203a Text size now makes the story text and the choices bigger or smaller, on a phone as well. Before, it only changed the buttons.']],
  ['3.8.0', ['Full screen on a PC: no browser bars, no taskbar, just the game. Press F, or the button in the top corner of the title and beside the settings gear in the game. Esc leaves it.',
             'Settings \u203a Full screen On makes every visit go full screen at your first click, so you only set it once.']],
  ['3.7.9', ['On a PC the game can install itself as a desktop app: its own window with no browser bars, and a shortcut on your desktop and taskbar. The title offers it when your browser can do it (Chrome and Edge), and Settings always has Install as an app. Your sergeants come with it.',
             'Safari on a Mac gets the directions instead (File \u203a Add to Dock). The Dock app keeps its own saves, so bring your sergeant over with a save code.']],
  ['3.7.8', ['Plays properly on a PC. On a wide screen the map, the battlefield or the scene fills the left side as big as the window allows, and everything to read and press sits in a column on the right: the conversation, the unit bar, the log. No more scrolling to reach the buttons in a fight.',
             'The keyboard works: 1 to 9 pick a dialogue choice or an ability, Space ends a turn or talks to whoever is beside you, the arrow keys or WASD walk, J, P and C open the journal, pack and squad, Esc opens settings, and Enter presses a page\'s main button. The full list is in Settings.',
             'With a mouse, the tile under the cursor is outlined, choices and abilities show their number keys, and the game says click instead of tap. On a phone nothing has changed.']],
  ['3.7.7', ['Every sergeant has a save of their own, so more than one person can play on the same device. The title now lists the sergeants saved here, with their chapter, where they stand, their level and when they last played. Tap yours to carry on. Your game from before is already on the list.',
             'The name prompt only appears when you start a new sergeant. Starting one under a name that is already here asks first, then starts that sergeant over.',
             'Switch sergeant from the Save tab. Erase one with the \u00d7 beside them on the title (tap twice) or from Settings, which now erases only the sergeant you are playing. A save code for a sergeant already on this device asks before it replaces them.']],
  ['3.7.6', ['Brisk and the sergeant no longer look like twins. Brisk goes bareheaded, her wheat-pale hair plaited in a crown, with a spear and a big oxblood shield, and she stands a head taller. The sergeant keeps the iron cap and has grown a short dark beard, greying at the chin, and carries the battered heater shield from Nathilog.',
             'Every new page, the next chapter, the chapter card, the finale and each squadmate\'s sheet, now opens at the top.']],
  ['3.7.5', ['The middle of the book bites harder. Chapters 3 to 5 now hit about as hard as Chapter 1 and the Fete: more cutpurses and a second Gadrobi at the Worry Gate, four knives and a wave behind the dye-shop, a Guild veteran on the roofs, Tiste Andii who strike twice, a tougher Jaghut ward and more of the barrow dead, and more of the things that come through the rent.',
             'Talking one of the Guild runners down on the roof still makes that fight lighter.']],
  ['3.7.4', ['Chapters 1 and 2 read through for continuity: the city lies south-west beyond the hills, the quorls leave before the wagon rolls, and two dozen smaller things now agree with each other.',
             "Kettle keeps Chub's cusser, Maud, for the one that matters: she won't fire her in an ordinary fight.",
             'The Worry Gate is on the west side of its map, the way you walk in from the hills, and the street outside the Phoenix has people on it.',
             'The fight at the rent in Chapter 5 is harder.',
             "A glossary at the foot of the journal: warrens, munitions, Houses and the rest, as the story reaches them.",
             'This note, once after each update. Tap the version number on the title screen to read it again.']],
  ['3.7.3', ['The road from Pale is eleven days everywhere. The Moranth crate holds twelve cussers and the dud. The Phoenix is up the alley in the Daru District. Plus a sweep of Chapters 3 to 7.']],
  ['3.7.2', ['Maps and book beats: the Worry Gate, Rake and the Hounds in the hills, Coll on the slope, five dragons at the Fete, the Pannion Seer.']],
];
const SEENKEY = 'ashes-of-the-pale-seen';
/* since = the version this player last saw: every note after it, newest first. From the title's version number or Settings
   (since null): the newest note, with every earlier one behind "Earlier versions". */
function openNotes(since){
  const vn = v => v.split('.').map(Number).reduce((a, n) => a * 1000 + n, 0);
  const fresh = since ? NOTES.filter(([v]) => vn(v) > vn(since)) : [], list = fresh.length ? fresh : NOTES.slice(0, 1), rest = NOTES.slice(list.length);
  const one = ([v, ls]) => `<h4 class="jh">v${v}</h4><ul class="jl">${ls.map(l => `<li>${l}</li>`).join('')}</ul>`;
  const m = $('#modal'); m.hidden = false;
  m.innerHTML = smartq(`<div class="mbox notes"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px"><h2 class="m" id="notesH">What's new</h2><button class="btn icon" id="bClose" aria-label="Close">×</button></div>
    ${list.map(one).join('')}
    ${rest.length ? `<details class="gloss earlier"><summary>Earlier versions</summary>${rest.map(one).join('')}</details>` : ''}
    <div class="row" style="margin-top:14px"><button class="btn primary" id="bNotesOk">Carry on</button></div></div>`);
  m.scrollTop = 0;
  const close = () => { AUDIO.play('click'); m.hidden = true; };
  $('#bClose').onclick = close; $('#bNotesOk').onclick = close; m.onclick = e => { if (e.target === m) m.hidden = true; };
}
function maybeNotes(has){
  let seen = null; try { seen = localStorage.getItem(SEENKEY); localStorage.setItem(SEENKEY, VERSION); } catch(e) { return; }
  if (has && seen !== VERSION) openNotes(seen);
}
