/* ============ pack / journal / save ============ */
function openModal(tab){
  const m = $('#modal'); m.hidden = false; m.scrollTop = 0;
  const tabs = S ? ['pack','journal','save'] : ['save'];
  const body = {
    pack:()=>`<div class="kv"><span>Silver</span><span>${S.silver}</span><span>Sharpers</span><span>${S.inv.sharper}</span><span>Burners</span><span>${S.inv.burner}</span><span>Cussers</span><span>${S.inv.cusser}</span>${S.inv.smoker > 0 || S.f.gotSmokers ? `<span>Smokers</span><span>${S.inv.smoker}</span>` : ''}<span>Healing salves</span><span>${S.inv.salve}</span>
      <span>Squad level</span><span>${S.lvl} (${S.xp}/${LEVELS[S.lvl] ?? '—'} xp)</span>${S.card ? `<span>Deck reading</span><span>${CARDS[S.card].name}</span>` : ''}</div>
      ${S.card ? `<div class="cardinline" style="margin-top:12px"><canvas id="icard" width="240" height="360"></canvas></div><p class="fine" style="text-align:center">${CARDS[S.card].fx}</p>` : ''}
      <p class="fine" style="margin-top:10px">Moranth munitions hit everything in the blast, your own squad included. Warren magic builds strain; past ${STR_MAX}, the caster pays in blood.</p>`,
    journal:()=>`${journalHead()}<h4 class="jh">Notes</h4><ul class="jl">${[
      ...[7,6,5,4,3,2].filter(n => n <= S.chapter && CHAPTERS[n] && CHAPTERS[n].journal).map(n => { try { return CHAPTERS[n].journal() || []; } catch(e) { return []; } }), // optional: a chapter module may add journal:()=>[lines]; newest chapter first
      S.chapter >= 1 ? [
        S.f.c1_reported ? `Whiskeyjack: the Fourth rides south overland with the baggage. Darujhistan.` : `Report to Whiskeyjack at the Bridgeburners' fire.`,
        S.f.c1_paran ? `Captain Paran walked the lines. Noble-born. Trying.` : '',
        S.f.c1_sawHairlock ? `Tattersail's puppet turned its head.` : '',
        S.f.c1_plant ? `Tattersail knows about Tuft's badge. So, now, do you.` : '',
        S.f.c1_hounds ? `The Hounds of Shadow came through the tent lines. ${S.f.c1_key === 'claw' ? 'You held the crate.' : 'You held the line.'}` : '',
        S.f.c1_accounting ? `The Claw came to settle accounts at the picket line.` : '',
      ] : [],
      S.f.quest ? `Recover Varrow's satchel from the north sapper tunnels and bring it to Tattersail. ${S.ending ? '(Done.)' : ''}` : `Answer the cadre's summons.`,
      S.f.knowStakes ? `Tattersail says the journal records who ordered what the night the Second Army died.` : '',
      S.f.knowDeserters ? `Garrow: Moreau's section deserted into the north tunnels. "The Fist is still counting heads."` : '',
      S.f.clawMet ? (S.f.clawFooled ? `A grey cloak at the crater believed the grave-detail story.` : `A grey cloak is paying attention to your squad.`) : '',
      S.f.knowTruth ? `Varrow's journal: the cadre was moved forward <em>before</em> the Spawn attacked.` : '',
      S.f.c7_tav ? `Brisk's brother, Second Army: alive, on the Host's rolls.` : `Brisk's brother, Second Army: not yet found.`, S.f.c1_qbTuft ? `Tuft and the High Mage: asked, not answered.` : `Tuft and the High Mage: unasked.`].flat().filter(Boolean).map(l => `<li>${l}</li>`).join('')}</ul>${glossHTML()}`,
    save:()=>`${S ? `<p class="fine">Playing as <b class="who">Sergeant ${esc(S.name)}</b>. The game saves itself on this device as you play, under your sergeant's name. Anyone else can start their own sergeant from the title, and each keeps a save of their own.</p>
      <div class="row" style="margin:8px 0 16px"><button class="btn" id="bSwitch">Switch sergeant</button></div>
      <label class="fine" for="exp">Sergeant ${esc(S.name)}'s save code. Copy it somewhere safe to move them to another device, or to keep them from a cleared browser.</label>
      <textarea id="exp" readonly>${saveCode()}</textarea><div class="row" style="margin:8px 0 16px"><button class="btn" id="bCopy">Copy code</button></div>`
      : `<p class="fine">Each sergeant saves on this device as they play. A save code brings one here from another device, or back from a cleared browser.</p>`}
      <label class="fine" for="imp">Paste a save code to load it</label><textarea id="imp" placeholder="Paste code here"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primary" id="bLoad">Load code</button></div><p class="fine" id="impMsg"></p>`,
  };
  m.innerHTML = smartq(`<div class="mbox"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px"><h2 class="m">${S ? 'Fourth Squad' : 'Load a game'}</h2><button class="btn" id="bClose">Close</button></div>
    <div class="tabs">${S ? `<button class="tab" data-t="squad">Squad</button>` : ''}${tabs.map(k => `<button class="tab ${k === tab ? 'on' : ''}" data-t="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`).join('')}</div>
    <div>${body[tab]()}</div></div>`);
  m.querySelectorAll('.tab').forEach(b => b.onclick = () => { AUDIO.play('click'); if (b.dataset.t === 'squad') { m.hidden = true; openChars(0); } else openModal(b.dataset.t); });
  $('#bClose').onclick = () => { AUDIO.play('click'); m.hidden = true; };
  if (tab === 'pack' && S.card) inlineCard($('#icard'), S.card, false);
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
  [0, "Onearm's Host", "The Second Army on Genabackis, under High Fist Dujek Onearm. The Fourth are marines in it."],
  [0, 'Marines', 'Small squads with their own sapper, mage and healer, sent where a regiment would be noticed.'],
  [0, 'The Bridgeburners', "Whiskeyjack's company: veterans and sappers, the Empire's best, and the Empress's least trusted."],
  [0, 'The cadre', "The army's battle-mages. After the Pale, there are very few of them left."],
  [0, 'The Claw', "The Empress's assassins and spies. Grey cloaks. They keep lists."],
  [0, 'Warrens', 'The paths sorcery is drawn from. Tuft draws on Meanas, shadow and illusion; Ohl on Denul, healing. Draw too hard and it costs strain, and then blood.'],
  [0, 'Moranth munitions', 'Clay grenados from the Moranth alchemists: sharpers throw iron, burners throw fire, smokers throw cover, and cussers take down walls. Thirteen to a crate: twelve and a dud.'],
  [0, "The Moon's Spawn", 'A mountain of black stone that floats, and hangs over whatever it chooses.'],
  [0, 'The Deck of Dragons', 'A deck of cards whose Houses are the powers of the world. A reading shows who is watching you.'],
  [0, 'Hood', 'The Lord of Death. Soldiers swear by his breath, his teeth and his gate.'],
  [0, 'Pale', 'The city the Second Army took, at the price of most of itself.'],
  [1, 'The Moranth', 'A people in chitin armour who sort themselves by colour and ride quorls, flying things like enormous dragonflies. The Black Moranth fly for Onearm.'],
  [1, 'The Hounds of Shadow', "Shadowthrone's hunting beasts, the size of horses, with eyes like lamps seen through smoke."],
  [2, 'The Rhivi', 'Herders and riders of the central plains, who fight beside the Empire\'s enemies and carry their dead a long way.'],
  [2, 'Great Ravens', 'Ravens as big as a man, who remember everything and serve a lord they talk about far too much. Crone is the eldest.'],
  [3, 'Darujhistan', 'The City of Blue Fire: the last free city on Genabackis, lit by gas drawn up from the caverns beneath it.'],
  [3, 'Daru and Gadrobi', 'The city\'s two peoples. The Daru hold its money and its Council; the Gadrobi do its work, and give their name to the poorer districts and the hills to the east.'],
  [3, 'Oponn', 'The Twins of chance: the Lady pulls, the Lord pushes. A spinning coin is their business.'],
  [4, 'The Tiste Andii', "An old, long-lived people, tall and dark-skinned, who keep to the night. The Moon's Spawn is theirs."],
  [4, 'The Guild', "Darujhistan's assassins. They work the rooftops, and they do not like company up there."],
  [5, 'The Jaghut', 'An ancient race of solitary sorcerers, masters of ice. A few of them made themselves tyrants, and were buried for it.'],
  [5, "T'lan Imass", 'Undying warriors of bone and flint, bound to hunt the Jaghut for ever. They fight beside the Empire.'],
  [5, 'Otataral', 'A red ore that kills sorcery near it. Nobody with a warren wants to stand close to it.'],
  [5, 'The Adjunct', "The Empress's own hand, answerable to nobody below the throne."],
  [6, "Gedderone's Fete", "Darujhistan's spring festival: masks, paper lanterns, and winter chased out of the doorways at dawn."],
  [6, 'Omtose Phellack', 'The Jaghut warren: ice, and the cold that keeps.'],
  [6, 'The Azath', 'Houses that grow out of the ground where they are needed, and keep what is put in them.'],
];
function glossHTML(){
  const ch = S ? S.chapter || 0 : 0, rows = GLOSS.filter(g => g[0] <= ch);
  return `<details class="gloss"><summary>Words you'll hear</summary><dl>${rows.map(([, t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>${ch < 7 ? `<p class="fine">More as the story reaches them.</p>` : ''}</details>`;
}

/* what's new: shown once after an update (to a player with a save), and again from the version number on the title */
const NOTES = [
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
function openNotes(since){
  const vn = v => v.split('.').map(Number).reduce((a, n) => a * 1000 + n, 0);
  const list = NOTES.filter(([v]) => !since || vn(v) > vn(since)).slice(0, 3);
  const m = $('#modal'); m.hidden = false;
  m.innerHTML = smartq(`<div class="mbox notes"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px"><h2 class="m">What's new</h2><button class="btn icon" id="bClose" aria-label="Close">×</button></div>
    ${(list.length ? list : NOTES.slice(0, 1)).map(([v, ls]) => `<h4 class="jh">v${v}</h4><ul class="jl">${ls.map(l => `<li>${l}</li>`).join('')}</ul>`).join('')}
    <div class="row" style="margin-top:14px"><button class="btn primary" id="bNotesOk">Carry on</button></div></div>`);
  const close = () => { AUDIO.play('click'); m.hidden = true; };
  $('#bClose').onclick = close; $('#bNotesOk').onclick = close; m.onclick = e => { if (e.target === m) m.hidden = true; };
}
function maybeNotes(has){
  let seen = null; try { seen = localStorage.getItem(SEENKEY); localStorage.setItem(SEENKEY, VERSION); } catch(e) { return; }
  if (has && seen !== VERSION) openNotes(seen);
}
