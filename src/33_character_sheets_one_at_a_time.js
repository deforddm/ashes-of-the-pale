/* ============ character sheets, one at a time ============ */
let charIdx = 0, charTab = 'soldier', charAnim = null;
function openChars(i, tab){
  if (!S) { S = newState('Hask'); S._preview = true; }
  const SQ = SQUAD(); charIdx = ((i % SQ.length) + SQ.length) % SQ.length; if (tab) charTab = tab;
  const id = SQ[charIdx], c = TPL[id], L = S.lvl - 1, m = $('#chars'); m.hidden = false;
  const gearOf = Object.values(S.gear[id] || {}).map(g => ITEMS[g]).filter(Boolean);
  const sum = k => gearOf.reduce((a,it) => a + (it[k] || 0), 0);
  const hp = c.hp + L*4 + (S.card === 'obelisk' ? 4 : 0) + sum('hp') + (has(id,'iron') ? 6 : 0), atk = c.atk + L + sum('atk') + (has(id,'keen') ? 1 : 0), ac = c.ac + sum('ac'), mv = c.mv + sum('mv') + (has(id,'fleet') ? 1 : 0), rng = c.rng + sum('rng'), init = c.init + (has(id,'nerve') ? 1 : 0);
  const allPicks = [...(PICKS[3][id] || []), ...PICKS.vet];
  const talents = (S.picks[id] || []).map(k => allPicks.find(o => o[0] === k)).filter(Boolean);
  const kitItems = S.kit.map(g => ITEMS[g] && {id:g, ...ITEMS[g]}).filter(it => it && (!it.who || it.who.includes(id)));
  const wearer = g => SQUAD().find(w => Object.values(S.gear[w] || {}).includes(g));
  const kit = kitItems.length ? kitItems.map(it => { const w = wearer(it.id); return `<div class="it"><div><b>${it.name}</b> <span class="stat">${it.slot}${[it.ac && `armour +${it.ac}`, it.atk && `hit +${it.atk}`, it.hp && `health +${it.hp}`, it.mv && `move +${it.mv}`, it.rng && `reach +${it.rng}`, it.stat && Object.entries(it.stat).map(([k,v]) => `${k} +${v}`).join(' ')].filter(Boolean).map(x => ' · ' + x).join('')}</span><small>${it.line}</small></div>
    ${w === id ? `<button class="btn" data-uneq="${it.slot}">Remove</button>` : `<button class="btn" data-eq="${it.id}">${w ? `Take from ${NAME(w)}` : 'Equip'}</button>`}</div>`; }).join('') : `<p class="fine">Nothing found yet that ${id === 'sgt' ? 'you' : c.name} could use.</p>`;
  const loyN = id === 'sgt' ? null : S.loy[id];
  const bar = (k, v, cls='') => `<div class="stbar"><span>${k}</span><div class="bar ${cls}"><i style="width:${v/4*100}%"></i></div><span>${v}</span></div>`;
  const abil = kitAb(id).map(k => { const a = AB[k]; let d; try { d = B ? a.desc() : a.desc(); } catch(e) { d = {rally:'Squadmates within 3 heal 4 and get +2 to hit through next round. Once per fight.', bash:'Adjacent enemy: 1d6+3 and it loses its next turn on a hit. Recharges after 2 rounds.', sharper:'Thrown, range 4. 1d10+2 at the centre, 1d6 around it. Scatters on a natural 1.', burner:'Thrown, range 4. 1d6 to a 3×3 and leaves it burning for 2 rounds.', cusser:'Fired from the crossbow\'s cradle, range 3. 3d8 centre and adjacent, 1d8 one step further. Scatters on 1–2.', smoker:'Thrown, range 4. A 3×3 of smoke for 2 rounds: nobody shoots into it or out of it.', veil:'Meanas illusion: enemies take −5 to hit the target for 2 rounds (more where Meanas is strong). Strain 2.', phantom:'An enemy chases a phantom and loses its turn unless it resists. Strain 3.', mend:'Denul healing, 2d6+3, weaker where Denul falters. Strain 3.', salve:'Heal 8, self or adjacent.'}[k]; }
    return `<div><b>${a.name}${a.item ? ` <span class="stat">×${S.inv[a.item]}</span>` : ''}</b><span>${d}</span></div>`; }).join('');
  const banter = c.banter ? c.banter[loyN <= -1 ? 0 : loyN >= 2 ? 2 : 1] : null;
  const rel = c.rel ? Object.entries(c.rel).filter(([k]) => SQ.includes(k)).map(([k,v]) => `<li><b>${TPL[k].name}.</b> ${v}</li>`).join('') : SQ.slice(1).map(k => `<li><b>${TPL[k].name}.</b> ${loyLabel(S.loy[k])}.</li>`).join('');
  const soldier = `<div class="sec"><h4>Measure</h4><div class="grid2">${bar('Might', c.st.might)}${bar('Wits', c.st.wits, 'w')}${bar('Guile', c.st.guile, 'g')}<div class="stbar"><span>Level</span><div class="bar"><i style="width:${S.lvl/8*100}%"></i></div><span>${S.lvl}</span></div></div></div>
    <div class="sec"><h4>In the line</h4><div class="kv"><span>Health</span><span>${hp}</span><span>Armour</span><span>${ac}</span><span>To hit</span><span>+${atk}</span><span>Damage</span><span>${c.dmg[0]}d${c.dmg[1]}${c.dmg[2] ? '+' + c.dmg[2] : ''}</span><span>Reach</span><span>${rng > 1 ? rng + ' tiles' : 'adjacent'}</span><span>Move</span><span>${mv}</span><span>Initiative</span><span>+${init}</span>${c.magic ? `<span>Strain limit</span><span>${STR_MAX}</span>` : ''}</div></div>
    <div class="sec"><h4>Field rules</h4><p class="fine">Flanking: +2 to hit when an ally stands next to the target on the far side, melee or ranged. Stepping out of a tile next to an enemy gives that enemy one free swing a turn, wherever you step to. Once you have moved and then acted, your movement for the turn is spent. The deserters know both tricks.</p></div>
    <div class="sec"><h4>Abilities</h4><div class="abl">${abil}</div></div>
    ${talents.length ? `<div class="sec"><h4>Learned</h4><div class="abl">${talents.map(o => `<div><b>${o[1]}</b><span>${o[2]}</span></div>`).join('')}</div></div>` : ''}
    <div class="sec"><h4>Arms</h4><p>${c.weapon}.</p><p>${c.armour}.</p>${gearOf.map(it => `<p>${it.line}</p>`).join('')}</div>
    <div class="sec kit"><h4>Kit</h4>${kit}</div>
    <div class="sec"><h4>Carries</h4><ul>${c.gear.map(g => `<li>${g}</li>`).join('')}</ul></div>`;
  const story = `<div class="sec"><h4>Record</h4><div class="kv"><span>Origin</span><span>${c.origin}</span><span>Age</span><span>${c.age}</span><span>Service</span><span>${c.service}</span><span>Bearing</span><span>${c.height}</span></div></div>
    <div class="sec"><h4>Who they are</h4><p>${c.bio}</p><p>${c.bio2}</p></div>
    <div class="sec"><h4>Habits</h4><ul>${c.traits.map(g => `<li>${g}</li>`).join('')}</ul></div>
    <div class="sec"><h4>Unfinished business</h4><p class="q">${c.quest}</p></div>
    ${loyN !== null ? `<div class="sec"><h4>Standing with ${esc(S.name)}</h4><div class="loymeter">${[-3,-2,-1,0,1,2,3].map(v => `<i class="${v === 0 ? 'mid' : v < 0 ? (loyN <= v ? 'neg' : '') : (loyN >= v ? 'pos' : '')}"></i>`).join('')}</div><div class="pips">${loyLabel(loyN)}</div>${banter ? `<p class="banter">${banter}</p>` : ''}</div>` : ''}
    <div class="sec"><h4>${id === 'sgt' ? 'The squad, as they stand' : 'The others'}</h4><ul>${rel}</ul></div>`;
  m.innerHTML = smartq(`<div class="mbox csheet">
    <div class="cshead"><button class="btn nav" id="cPrev" aria-label="Previous">‹</button><h2 class="m" style="text-align:center">Fourth Squad · ${charIdx + 1} of ${SQ.length}</h2><button class="btn nav" id="cNext" aria-label="Next">›</button></div>
    <div class="portrait"><canvas id="pcv" width="720" height="540"></canvas><div class="plate"><h3>${esc(NAME(id))}</h3><div class="r">${c.role}</div><div class="ep">${c.epithet}</div></div></div>
    <div class="dots">${SQ.map((p,k) => `<i class="${k === charIdx ? 'on' : ''}"></i>`).join('')}</div>
    <div class="tabs"><button class="tab ${charTab === 'soldier' ? 'on' : ''}" data-t="soldier">Soldier</button><button class="tab ${charTab === 'story' ? 'on' : ''}" data-t="story">Story</button><span style="flex:1"></span><button class="tab" data-t="pack">Pack</button><button class="tab" data-t="journal">Journal</button><button class="tab" data-t="save">Save</button></div>
    <div>${charTab === 'soldier' ? soldier : story}</div>
    <div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn" id="cClose">Close</button></div></div>`);
  const pcv = $('#pcv'), pctx = pcv.getContext('2d'); charAnim = t => { if (!pcv.isConnected) { charAnim = null; return; } drawPortrait(pctx, id, 720, 540, t); };
  $('#cPrev').onclick = () => { AUDIO.play('flip'); openChars(charIdx - 1); };
  $('#cNext').onclick = () => { AUDIO.play('flip'); openChars(charIdx + 1); };
  $('#cClose').onclick = closeChars;
  m.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { AUDIO.play('coin'); equip(id, b.dataset.eq); openChars(charIdx); });
  m.querySelectorAll('[data-uneq]').forEach(b => b.onclick = () => { AUDIO.play('click'); unequip(id, b.dataset.uneq); openChars(charIdx); });
  m.querySelectorAll('.tab').forEach(b => b.onclick = () => { AUDIO.play('click'); const tb = b.dataset.t; if (tb === 'soldier' || tb === 'story') openChars(charIdx, tb); else { closeChars(); openModal(tb); } });
  let sx = null; m.ontouchstart = e => { sx = e.touches[0].clientX; }; m.ontouchend = e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 70) { AUDIO.play('flip'); openChars(charIdx + (dx < 0 ? 1 : -1)); } };
  m.onclick = e => { if (e.target === m) closeChars(); };
}
function closeChars(){ const m = $('#chars'); m.hidden = true; m.innerHTML = ''; charAnim = null; if (S && S._preview) S = null; }

