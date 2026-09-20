/* ============ pack / journal / save ============ */
function openModal(tab){
  const m = $('#modal'); m.hidden = false;
  const tabs = S ? ['pack','journal','save'] : ['save'];
  const body = {
    pack:()=>`<div class="kv"><span>Silver</span><span>${S.silver}</span><span>Sharpers</span><span>${S.inv.sharper}</span><span>Burners</span><span>${S.inv.burner}</span><span>Cussers</span><span>${S.inv.cusser}</span><span>Healing salves</span><span>${S.inv.salve}</span>
      <span>Squad level</span><span>${S.lvl} (${S.xp}/${LEVELS[S.lvl] ?? '—'} xp)</span>${S.card ? `<span>Deck reading</span><span>${CARDS[S.card].name}</span>` : ''}</div>
      ${S.card ? `<div class="cardinline" style="margin-top:12px"><canvas id="icard" width="240" height="360"></canvas></div><p class="fine" style="text-align:center">${CARDS[S.card].fx}</p>` : ''}
      <p class="fine" style="margin-top:10px">Moranth munitions hit everything in the blast, your own squad included. Warren magic builds strain; past ${STR_MAX}, the caster pays in blood.</p>`,
    journal:()=>`<p class="fine">${S.chapter === 0 ? 'Prologue' : `Chapter ${CHAPTERS[S.chapter] ? CHAPTERS[S.chapter].number : S.chapter}`}${Object.keys(S.chapters).length ? ` · done: ${Object.keys(S.chapters).map(n => n === '0' ? 'prologue' : 'chapter ' + n).join(', ')}` : ''}</p><ul class="jl">${[
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
      S.f.clawMet ? (S.f.clawFooled ? `A grey cloak at the crater believed the grave-detail story.` : `A grey cloak at the crater is paying attention to your squad.`) : '',
      S.f.knowTruth ? `Varrow's journal: the cadre was moved forward <em>before</em> the Spawn attacked.` : '',
      `Brisk's brother, Second Army: not yet found.`, S.f.c1_plant ? `Tuft and the High Mage: asked, not answered.` : `Tuft and the High Mage: unasked.`].flat().filter(Boolean).map(l => `<li>${l}</li>`).join('')}</ul>`,
    save:()=>`<p class="fine">The game saves itself on this device as you play. To move it to another device, or protect it from a cleared browser, copy this code somewhere safe.</p>
      ${S ? `<textarea id="exp" readonly aria-label="Save code">${saveCode()}</textarea><div class="row" style="margin:8px 0 16px"><button class="btn" id="bCopy">Copy code</button></div>` : ''}
      <label class="fine" for="imp">Paste a save code to load it</label><textarea id="imp" placeholder="Paste code here"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primary" id="bLoad">Load code</button></div><p class="fine" id="impMsg"></p>`,
  };
  m.innerHTML = `<div class="mbox"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px"><h2 class="m">${S ? 'Fourth Squad' : 'Load a game'}</h2><button class="btn" id="bClose">Close</button></div>
    <div class="tabs">${S ? `<button class="tab" data-t="squad">Squad</button>` : ''}${tabs.map(k => `<button class="tab ${k === tab ? 'on' : ''}" data-t="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`).join('')}</div>
    <div>${body[tab]()}</div></div>`;
  m.querySelectorAll('.tab').forEach(b => b.onclick = () => { AUDIO.play('click'); if (b.dataset.t === 'squad') { m.hidden = true; openChars(0); } else openModal(b.dataset.t); });
  $('#bClose').onclick = () => { AUDIO.play('click'); m.hidden = true; };
  if (tab === 'pack' && S.card) inlineCard($('#icard'), S.card, false);
  if (tab === 'save') {
    if ($('#bCopy')) $('#bCopy').onclick = () => { const ta = $('#exp'); ta.select(); try { navigator.clipboard.writeText(ta.value); $('#bCopy').textContent = 'Copied'; } catch(e) { $('#bCopy').textContent = 'Select and copy'; } };
    $('#bLoad').onclick = () => { try { const s = JSON.parse(decodeURIComponent(escape(atob($('#imp').value.trim())))); if (!s || s.v !== 1) throw 0; S = migrate(s); save(); m.hidden = true; resume(); }
      catch(e) { $('#impMsg').textContent = 'That code didn\'t load. Check that it was copied in full.'; } };
  }
  m.onclick = e => { if (e.target === m) m.hidden = true; };
}
function saveCode(){ return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }

